// /api/scores — the global board.
//
// Storage: Upstash Redis over its REST API, so this runs on Vercel's serverless
// runtime with no client library and no build step. Two environment variables:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// Without them the endpoint answers 503 and the game falls back to the local
// board, so an unconfigured deploy still plays perfectly.

const URL_ = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Members are a per-device id, never the name. Keying by name meant two players
// called "Nour" shared one row and overwrote each other — certain to happen once
// the game is public. The name is display data, stored alongside the score.
const ALL = 'ateshane:all';
const META_ALL = 'ateshane:meta:all';
const WEEK_TTL = 90 * 24 * 3600;   // weekly keys clean themselves up
const TOP_N = 10;                  // 3 podium + 7 list
const KEEP = 500;                  // rows retained per board

// ISO-8601 week, computed in UTC so every player rolls over at the same instant.
function weekTag(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dow);            // Thursday decides the year
  const jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const wk = Math.ceil(((t - jan1) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(wk).padStart(2, '0')}`;
}
const weekBoard = (tag) => `ateshane:w:${tag}`;
const weekMeta  = (tag) => `ateshane:wm:${tag}`;

async function redis(commands) {
  const res = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  return res.json();
}

const clean = (s) =>
  String(s == null ? '' : s)
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .trim()
    .slice(0, 14) || '?';

const uidOf = (v) => {
  const s = String(v == null ? '' : v).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 24);
  return s.length >= 8 ? s : null;
};

const int = (v, max) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n >= 0 && n <= max ? n : null;
};

// Turn a flat ZREVRANGE ... WITHSCORES reply plus its metadata into rows.
function rows(flat, metaRaw, startRank) {
  const out = [];
  for (let i = 0; i < flat.length; i += 2) {
    out.push({ u: flat[i], s: Number(flat[i + 1]), rank: startRank + out.length });
  }
  (metaRaw || []).forEach((raw, i) => {
    if (!out[i]) return;
    try {
      const d = JSON.parse(raw);
      out[i].n = d.n; out[i].m = d.m; out[i].b = d.b; out[i].ts = d.ts;
    } catch { out[i].n = '?'; }
  });
  return out;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).json(null);

  if (!URL_ || !TOKEN) {
    return res.status(503).json({ ok: false, reason: 'not-configured' });
  }

  const tag = weekTag();

  try {
    if (req.method === 'GET') {
      const q = req.query || {};
      const scope = q.scope === 'all' ? 'all' : 'week';
      const board = scope === 'all' ? ALL : weekBoard(tag);
      const meta  = scope === 'all' ? META_ALL : weekMeta(tag);
      const me    = uidOf(q.uid);

      const [top, total] = await redis([
        ['ZREVRANGE', board, 0, TOP_N - 1, 'WITHSCORES'],
        ['ZCARD', board],
      ]);
      const flat = top.result || [];
      const ids = [];
      for (let i = 0; i < flat.length; i += 2) ids.push(flat[i]);

      let metaRaw = [];
      if (ids.length) {
        const [h] = await redis([['HMGET', meta, ...ids]]);
        metaRaw = h.result || [];
      }
      const list = rows(flat, metaRaw, 1);

      // The player's own standing, always — a board that only shows the top ten
      // tells player 400 nothing about themselves.
      let mine = null;
      if (me) {
        const inTop = list.find((r) => r.u === me);
        if (inTop) {
          mine = { ...inTop, top: true };
        } else {
          const [rank, score, mrow] = await redis([
            ['ZREVRANK', board, me],
            ['ZSCORE', board, me],
            ['HGET', meta, me],
          ]);
          if (rank.result !== null && rank.result !== undefined) {
            mine = { u: me, rank: Number(rank.result) + 1, s: Number(score.result || 0) };
            try {
              const d = JSON.parse(mrow.result);
              mine.n = d.n; mine.m = d.m; mine.b = d.b;
            } catch { mine.n = '?'; }
          }
        }
      }

      return res.status(200).json({
        ok: true, scope, week: tag,
        total: Number(total.result || 0),
        top: list, me: mine,
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const u = uidOf(body.u);
      const n = clean(body.n);
      const s = int(body.s, 50000000);
      const m = int(body.m, 2000000);
      const b = int(body.b, 200000);
      if (!u || s === null || m === null || b === null) {
        return res.status(400).json({ ok: false, reason: 'bad-payload' });
      }
      if (s > m * 16 + b * 90 + 6000) {
        return res.status(422).json({ ok: false, reason: 'implausible' });
      }

      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
      const rlKey = `ateshane:rl:${ip}`;
      const [hits] = await redis([['INCR', rlKey]]);
      if (Number(hits.result) === 1) await redis([['EXPIRE', rlKey, 60]]);
      if (Number(hits.result) > 30) {
        return res.status(429).json({ ok: false, reason: 'slow-down' });
      }

      const wb = weekBoard(tag), wm = weekMeta(tag);
      const payload = JSON.stringify({ n, m, b, ts: Date.now() });

      // GT keeps the personal best; CH reports whether it actually moved. The two
      // boards improve independently, and each one's metadata is written only when
      // its own score improves — otherwise a later weak run overwrites the metres
      // shown beside an earlier strong score.
      const [gAll, gWeek] = await redis([
        ['ZADD', ALL, 'GT', 'CH', String(s), u],
        ['ZADD', wb,  'GT', 'CH', String(s), u],
      ]);

      const after = [];
      if (Number(gAll.result) === 1)  after.push(['HSET', META_ALL, u, payload]);
      if (Number(gWeek.result) === 1) after.push(['HSET', wm, u, payload]);
      after.push(['ZREMRANGEBYRANK', ALL, 0, -(KEEP + 1)]);
      after.push(['ZREMRANGEBYRANK', wb,  0, -(KEEP + 1)]);
      after.push(['EXPIRE', wb, WEEK_TTL]);
      after.push(['EXPIRE', wm, WEEK_TTL]);
      await redis(after);

      const [rWeek, rAll, bestW] = await redis([
        ['ZREVRANK', wb, u],
        ['ZREVRANK', ALL, u],
        ['ZSCORE', wb, u],
      ]);
      return res.status(200).json({
        ok: true,
        week: tag,
        rank: rWeek.result === null ? null : Number(rWeek.result) + 1,
        rankAll: rAll.result === null ? null : Number(rAll.result) + 1,
        best: bestW.result === null ? s : Number(bestW.result),
      });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, reason: 'method' });
  } catch (err) {
    return res.status(502).json({ ok: false, reason: 'upstream' });
  }
};
