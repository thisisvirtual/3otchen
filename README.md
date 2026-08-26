# 3otchen — سابق العطش

Endless runner. Tap to jump, tap again mid-air for a double jump, collect Tunisian
water bottles before your gourde runs dry. One touch on an obstacle ends the run.

Static site, no build step, no framework. Plain canvas plus two vendored MIT
libraries (anime.js for UI motion, ZzFX for synthesised sound). One serverless
function, `api/scores.js`, backs the world leaderboard; without it the game still
plays and the board is simply local to each phone.

Live: https://3otchene.vercel.app

---

## Deploy

**Use Git.** Push to `main` and Vercel builds and deploys on its own.

Do not use Vercel Drop. Drop publishes a folder as static files and skips the build
step, so `api/scores.js` never becomes a running function and the world board fails
silently. Drop also creates a new project on every upload, which means new
environment variables and a new URL each time.

Framework preset *Other*, no build command, no output directory.

### Leaderboard setup

1. Upstash → Redis → Create Database. Free tier is enough.
2. In the database page, **Connect → REST**. Leave *Read-Only Token* unticked — the
   game writes scores as well as reading them.
3. Vercel → your project → Settings → Environment Variables. Add both, ticked for
   Production, Preview and Development:

   | Key | Value |
   | --- | --- |
   | `UPSTASH_REDIS_REST_URL` | `https://<name>.upstash.io` |
   | `UPSTASH_REDIS_REST_TOKEN` | the token from the same database |

   Upstash displays these wrapped in quotes. Do not include the quotes — the value
   starts with `h` and ends with `o`.
4. Redeploy. Environment variables only apply to deployments created after they are
   saved, so editing them changes nothing until you redeploy.

### Verifying

Open `https://<your-site>/api/scores`:

| Response | Meaning |
| --- | --- |
| `{"ok":true,"top":[]}` | Working. Play a run with a name, then check the World tab. |
| `{"ok":false,"reason":"not-configured"}` | One or both variables are missing, or you didn't redeploy. |
| `{"ok":false,"reason":"upstream"}` | Variables exist but the values are wrong — quotes, whitespace, or the `redis://` string instead of the REST URL. |
| 404, or the raw JavaScript | Deployed as static files. The function was never built. Deploy from Git. |

Upstash's command counter is the second signal: it stays at zero for as long as
nothing is reaching the database.

### Moderating the board

Upstash → Data Browser. Scores live in the sorted set `ateshane:board`; the
distance and bottle count for each name live in the hash `ateshane:meta`. Removing
a player means deleting the member from one and the field from the other. There is
deliberately no admin endpoint.

---

## Updating after a deploy

The service worker caches aggressively. Bump the version in `sw.js` on every deploy
or returning players keep the old build:

```js
const CACHE = 'ateshane-v19';   // was v18
```

`/api/` is excluded from the cache and always goes to the network. This matters: the
worker used to cache API responses like any other GET, so a single failed call froze
the world board on that failure permanently, even after the backend was fixed.
Only successful responses are cached.

After deploying, force-close the app on any device that has already played. The old
worker keeps serving until the new one activates.

---

## Files

| Path | Role |
| --- | --- |
| `index.html` | Shell — canvas, HUD, menu and panels |
| `styles.css` | HUD, panels, overlays |
| `game.js` | Engine — loop, physics, spawning, events, rendering |
| `audio.js` | Sound bus, synthesis, sample playback |
| `api/scores.js` | World leaderboard (Upstash REST) |
| `sw.js` | Service worker — offline play, cache versioning |
| `manifest.webmanifest` | Install metadata, portrait, icons |
| `vendor-anime.min.js` | anime.js 3.2.2, vendored for offline |
| `vendor-zzfx.js` | ZzFX, patched to route through the shared sfx bus |
| `assets/` | Bottle sprites, gold variants, audio, images |
| `icons/` | 192 / 512 / apple-touch |

---

## Tuning

All constants are at the top of `game.js`.

| Constant | Value | Effect |
| --- | --- | --- |
| `SPEED_START` | 235 | Opening speed |
| `SPEED_RAMP` | 0.0295 | Speed gained per pixel travelled — the difficulty curve |
| `SPEED_MAX` | 780 | Ceiling |
| `REGION_LEN` | 4800 | Distance between region crossfades |
| `GRAV_UP` / `GRAV_DOWN` | 1800 / 2650 | Asymmetric gravity — floaty rise, fast fall |
| `JUMP_V` / `JUMP_CUT` | −620 / 0.45 | Jump impulse; release early to cut it short |
| `MAX_JUMPS` | 2 | Double jump |
| `COMBO_WINDOW` | 2.4 | Seconds between pickups to keep the chain |
| `COMBO_CAP` | 9 | Multiplier ceiling |
| `EVENT_FIRST` / `EVENT_GAP` | 11 / 13–21 | Seconds before the first event, then the gap between |

Thirst drain is in `update()`: `(2.7 + speed * 0.0094) * easeK`. Raising the
coefficient makes the late game harsher without touching the opening.

### Gold gauge

There is no golden bottle to chase on the field. A second gauge in the HUD fills as
you play and triggers a boon when full.

| Constant | Value |
| --- | --- |
| `GOLD_FULL` | 100 |
| `GOLD_PER_BOTTLE` | 7 |
| `GOLD_PER_PASS` | 4 (obstacle cleared) |
| `GOLD_PER_GRAZE` | 6 (near miss, on top of the pass) |

A full gauge draws from a shuffled bag of three boons, so the same one never lands
twice in a row:

| Boon | Duration | Effect |
| --- | --- | --- |
| `dhahab` | 7 s | Invincible, smash obstacles, bottle magnet |
| `chta` | 8.5 s | Bottle rain |
| `rih` | 6 s | Sandstorm — speed ×1.45 while golden |

---

## Events

One event fires every 13–21 seconds after the first at 11 s, telegraphed with a
banner, then rewrites the rules for its duration. `w` is the spawn weight, `min` the
metres required before it can appear. No event repeats back to back.

| Key | Duration | What changes |
| --- | --- | --- |
| `coupure` | 8 s | Colour drains, bottles stop spawning entirely. One jerrycan appears halfway: +38 water, but you jump 15% lower for 2.5 s carrying it. |
| `delestage` | 9 s | Blackout. Torch halo follows the runner, obstacle density eased 30%. |
| `canicule` | 12 s | Thirst drains ×1.8, but each bottle heals 17 instead of 11. |
| `citerne` | 6.5 s | A tanker rolls ahead spilling bottles; normal bottle trains pause. |
| `pluie` | 10 s | Thirst stops and slowly refills. |
| `chams` | 13 s | The sun detaches and pursues you, telegraphing fire columns on your position. Cacti stand down. |
| `police` | 14 s | A checkpoint forces a full stop. Tap ×5 to be waved through for +80. Standing drains at half rate. |
| `dhaw9ass` | 2.8 s | No warning. Screen goes black, fake loading dots, everything frozen, then the power comes back. |

Events are drawn from Tunisia's water and power situation. No real institution is
named — the satire is aimed at the situation.

---

## Regions

Seven palettes in `REGIONS`, crossfading over the last quarter of each: Sidi Bou
Saïd, Médina de Tunis, Kairouan, Douz, Chott el Djerid, Carthage, Le Sahara. Sky,
sand, buildings, palms and star density all interpolate, so there is no hard cut.
Adding an eighth means adding one entry.

---

## Language

Three full translations in `I18N` at the top of `game.js`: `tn` (Tunisian derja,
RTL, default), `fr`, `en`. Switchable in Settings. Combo shouts stay in derja in
every language.

---

## Sound

`audio.js` runs a compressor and a shared sfx bus. Most sounds are synthesised at
runtime; two are real recordings loaded as samples:

```js
Audio2.loadSample('death', 'assets/audio/ta3fita.mp3');
Audio2.loadSample('gold',  'assets/audio/3otchana.mp3');
```

Any sample loaded this way replaces the synthesised voice of the same name.
Available names: `step`, `jump`, `land`, `pickup`, `hit`, `milestone`, `over`,
`warn`, `death`, `gold`.

The gold track has a hard cutoff. Its stop is compiled into the WebAudio graph when
it starts playing, not called at runtime — a runtime stop leaves a ghost tail if the
run ends first.

Press M or tap the speaker to mute.

---

## Bottle assets

The seven sprites are cut from product photographs: white background flood-filled,
alpha edges eroded one pixel to kill JPEG fringing, gold variants pre-rendered at
build time rather than with `ctx.filter` (which Safari doesn't support).

They are photographs, so they read as photos against a drawn world. Flat vector
redraws would match better — silhouette plus two or three brand colours is enough
to recognise at 50 px. If any of these brands sponsors this, ask them for the
official vector files.

**These are real trademarks.** They are fine for a prototype. Publishing this as
brand promotion is a different question, and showing six competitors alongside one
sponsor is a conversation to have before launch, not after.
