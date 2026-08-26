// /api/scores — the global board.
//
// Storage: Upstash Redis (free tier) over its REST API, so this runs fine on
// Vercel's serverless runtime with no client library and no build step.
// Set two environment variables in the Vercel dashboard:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// Without them the endpoint answers 503 and the game quietly falls back to the
// local board, so an unconfigured deploy still plays perfectly.

const URL_ = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const BOARD = 'ateshane:board';     // sorted set: member = name, score = points
const META  = 'ateshane:meta';      // hash: name -> {m,b,ts}
const TOP_N = 20;

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
    .replace(/[\u0000-\u001F\u007F<>]/g, '')   // control chars and tag brackets
    .trim()
    .slice(0, 14) || '?';

const int = (v, max) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n >= 0 && n <= max ? n : null;
};

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  // Vercel Drop makes a new project on every upload, so the game may well be
  // served from a different origin than this board. Allow it.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).json(null);

  if (!URL_ || !TOKEN) {
    return res.status(503).json({ ok: false, reason: 'not-configured' });
  }

  try {
    if (req.method === 'GET') {
      const [top] = await redis([['ZREVRANGE', BOARD, 0, TOP_N - 1, 'WITHSCORES']]);
      const flat = top.result || [];
      const names = [];
      const entries = [];
      for (let i = 0; i < flat.length; i += 2) {
        names.push(flat[i]);
        entries.push({ n: flat[i], s: Number(flat[i + 1]) });
      }
      if (names.length) {
        const [meta] = await redis([['HMGET', META, ...names]]);
        (meta.result || []).forEach((raw, i) => {
          try {
            const d = JSON.parse(raw);
            entries[i].m = d.m; entries[i].b = d.b; entries[i].ts = d.ts;
          } catch { /* an entry without metadata still ranks fine */ }
        });
      }
      return res.status(200).json({ ok: true, top: entries });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const n = clean(body.n);
      const s = int(body.s, 50000000);
      const m = int(body.m, 2000000);
      const b = int(body.b, 200000);
      if (s === null || m === null || b === null) {
        return res.status(400).json({ ok: false, reason: 'bad-payload' });
      }
      // A run can only earn so much from the distance it covered. Generous
      // enough to never punish a great run, tight enough to reject a typed-in
      // million.
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

      // GT keeps a player's personal best rather than their latest run.
      await redis([
        ['ZADD', BOARD, 'GT', 'CH', String(s), n],
        ['HSET', META, n, JSON.stringify({ m, b, ts: Date.now() })],
        ['ZREMRANGEBYRANK', BOARD, 0, -501],   // keep the board bounded
      ]);
      const [rank, best] = await redis([
        ['ZREVRANK', BOARD, n],
        ['ZSCORE', BOARD, n],
      ]);
      return res.status(200).json({
        ok: true,
        rank: rank.result === null ? null : Number(rank.result) + 1,
        best: best.result === null ? s : Number(best.result),
      });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, reason: 'method' });
  } catch (err) {
    return res.status(502).json({ ok: false, reason: 'upstream' });
  }
};
