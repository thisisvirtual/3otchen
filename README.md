# 3otchen — course contre la soif

Endless runner PWA. Auto-run right, tap to jump (double-tap for a double jump), collect
Tunisian water bottles before the thirst gauge empties. Seven stages, each a Tunisian
place, from Sidi Bou Saïd to the Sahara.

**Portrait-first.** The logical scale anchors to the smaller screen dimension: phones
held vertically get a tall world with the same reaction distance as landscape — both
orientations play correctly, no rotate lock. The manifest requests portrait when
installed. An install banner slides in at the top of the menu: native prompt on
Android/Chrome, add-to-home-screen instructions on iOS (Apple allows no programmatic
prompt), with a ✕ that remembers the dismissal.

Pure static site — no build step. Two vendored MIT libraries: anime.js (UI motion)
and ZzFX (sound synthesis). Menu with name entry, top-10 high scores, settings.
Loop: menu → tap to launch (world holds still until the first tap, Flappy-style)
→ continuous speed ramp → game over → instant retry.



**Animation (le jeu respire) :**
- **Mort cinématique** : hit-stop 90 ms → culbute au ralenti, la chechia s'envole et retombe, rebond + poussière, étoiles qui tournent, vignette qui se ferme — le panneau n'arrive qu'après (~1,5 s).
- **Écharpe** bleue en verlet 6 points qui flotte avec la vitesse (dorée en mode or), même sur le cadavre.
- **Mode or** : aimant à dbabez (180 px), rayons divins rotatifs, afterimages dorées, lunettes de soleil sur le visage, empreintes dorées à chaque pas.
- **Jauge d'or** : chaque gain envoie une mote dorée qui vole de la source vers la jauge, qui pulse à l'arrivée.
- **Combo ≥5** : traînée d'afterimages bleues.
- **Événements** : lucioles dans le délestage, éclaboussures + flaques sous la pluie, essuie-front pendant la canicule, projections de roues du camion, lavage rouge/bleu des bords + sifflet au barrage, herbes qui roulent (coupure & désert profond).
- **Monde** : sweep lumineux au changement de région, kick caméra à l'atterrissage, camion qui tressaute, clignements d'yeux, étincelles sur les bouteilles, pop-in élastique des popups, anneaux « tap ici » en READY, confettis DOM sur nouveau record.
- Cap particules (240) — testé : pic 142 en paysage.

Vérifié headless : 3 600 frames sans erreur ×2 orientations, chaque événement forcé, pause/reprise pendant l'or, chronologie de la cinématique de mort.

## Deploy to Vercel

**Fastest — drag and drop:** go to [vercel.com/new](https://vercel.com/new), drag this
folder in. Framework preset: *Other*. No build command, no output directory. Done in
about a minute.

**CLI:**

```bash
npm i -g vercel
cd ateshane
vercel --prod
```

**Git:** push the folder to a repo and import it in Vercel. Preset *Other*, leave build
settings empty.

Vercel serves HTTPS by default, which the service worker and install prompt both
require. There is nothing to configure.

## Files

| File | Role |
|---|---|
| `index.html` | Shell: canvas, HUD, start / stage / game-over panels |
| `styles.css` | HUD, panels, portrait rotate overlay |
| `game.js` | Engine: loop, physics, spawning, rendering, speed ramp |
| `audio.js` | Synthesised sound — footsteps, water, wind, impacts |
| `vendor-anime.min.js` | anime.js 3.2.2, vendored so the PWA works offline |
| `sw.js` | Cache-first service worker — plays fully offline after first load |
| `manifest.webmanifest` | Install metadata, landscape orientation, icons |
| `assets/*.png` | Seven bottle sprites, background-removed with alpha |
| `icons/` | 192 / 512 / apple-touch icons |

## Tuning

There are no stages and no gates. Speed ramps continuously with distance, the way
Flappy Bird ramps — the constants are at the top of `game.js`:

| Constant | Effect |
|---|---|
| `SPEED_START` | Opening speed. Low enough to read the first obstacles. |
| `SPEED_RAMP` | Speed gained per pixel travelled. The whole difficulty curve. |
| `SPEED_MAX` | Ceiling, reached around 1850 m. |
| `REGION_LEN` | Distance between region crossfades (~480 m). |

Thirst drain scales off speed in `update()`: `3.0 + speed * 0.0080`. Raising the
coefficient makes late game harsher without touching the early game.

Measured with an automated bot: ~2700 m and 37 bottles on a strong run, speed hitting
the cap. Regions crossfade into each other over the last 25% of each — sky, sand,
buildings, palms and star density all interpolate, so there is no hard cut.

`REGIONS` holds the seven palettes. Adding an eighth means adding one entry.

## Language

UI copy is French. All user-facing strings are in `index.html` and in the
`THEMES` blurbs plus the panel text in `game.js` — swap them in place, or lift them into
a lookup object if you want French / Arabic / English toggling.

## Updating after deploy

The service worker caches aggressively. When you ship a change, bump the version in
`sw.js`:

```js
const CACHE = 'ateshane-v2';   // was v1
```

Otherwise returning players keep the cached build.

## Bottle assets

The seven sprites were cut from the supplied product photographs: white background
flood-filled at a 250 threshold, alpha edges eroded one pixel to remove JPEG fringing,
scaled to 150px tall.

They are photographic, so they read as photos next to the drawn world. If you want a
tighter visual match, redraw them as flat vector shapes — silhouette plus the two or
three signature brand colours is enough for recognition at 50px. If the brands are
sponsoring this, ask them for the official vector logo files; every brand has them, and
they will be far cleaner than anything traced from a retail photo.


## Mechanics

- **Combo** — each bottle within 2.4s of the last raises the multiplier (×2…×9).
  Points scale with it, the popup grows and goes gold, the pickup sound rises in
  pitch, and a badge with a draining bar tracks the window. A hit breaks the chain.
- **Bouteille d'or** — reach ×5 and a golden bottle spawns on a high arc: one of the
  seven real brands, gold-tinted at load time (canvas composite, works in Safari —
  no ctx.filter). Collecting it: +250, brief slow-motion, a full-screen celebration
  ("PALMA EN OR !" with spinning rays and the real bottle sprite), and **7s of
  invincibility** — golden aura, trail, and you smash obstacles for +30 each.
  It re-arms once per combo streak.
- **Obstacles are lethal** — one touch ends the run (unless golden). The game-over
  screen names the cause: "Aïe ! Percuté" vs "Plus une goutte". Thirst is the only
  attrition; bottles heal +11.
- **Jump feel** — asymmetric gravity (floatier rise, faster fall), release early to
  cut the jump short, jump buffering, air lean, sand-puff dust that expands, and
  takeoff/landing shockwave rings.
- **Name required** — no run without a name; the input shakes and hints. First Play
  opens a "Comment jouer" screen (also in the menu), then never auto-shows again.
- **Death** — plays `assets/audio/ta3fita.mp3` (the supplied Tunisian FX), faded out
  the moment a new run starts. Falls back to the ZzFX game-over sting if the file
  fails to load.

- **La jauge d'or** — no golden pickup on the field. A second small bottle in the
  HUD (labelled OR) fills as you play: +7 per bottle, +4 per obstacle cleared,
  +6 extra for a near-miss. Full = gold mode fires automatically (celebration with
  a random gold brand, `3otchana.mp3`, 7s invincible). Earned, never lucky. Gold mode is unmistakable on screen: a slight
  camera push-in on the runner, a golden wash with a warm edge vignette, and light
  motes drifting across the frame — all ramping in and out with the timer.
- **Spawn director** — bottle heights derive from the real jump physics (single- and
  double-jump ceilings), the first two waves of every run are friendly ground
  trains, obstacle streaks cap at two, and if hydration drops under 45 the next
  spawn is guaranteed bottles. Verified: zero thirsty frames with an empty screen.
- **Pause** — ⏸ button, Échap or P, and auto-pause when the tab loses focus.
  Resume, restart, or back to menu mid-run.
- **Ambience** — drifting clouds, flocks of swallows, Tunisian flags waving on
  rooftops, camel silhouettes in the dunes from Douz onward, and foreground rocks
  and dry grass sliding past faster than the action for depth.
- **Obstacle patterns** — singles, timed pairs, tall cacti that demand the double
  jump, and wide crate stacks, mixed by distance. Bottle trains are 3–5 in arcs,
  waves, or ground lines, spaced to be chainable at the current speed.
- **Feel** — jump buffering (a tap just before landing queues the jump), near-miss
  bonus ("Frôlé ! +10") for clearing an obstacle by a hair, combo shouts in
  Tunisian (Behi ! / Barcha ! / Sa77a ! / Champion !), +100 per region, panting
  breath loop while the bottle runs low, score count-up on game over.

Tuning: `COMBO_WINDOW`, `GOLD_AT`, `GOLD_TIME`, `GOLD_COOLDOWN`, `COMBO_CAP` at the
top of game.js; drain curve in `update()`.

## Les Événements

Every 24–44 seconds a world event is telegraphed (⚠ banner + warning), then rewrites
the rules for 6–12 seconds. All five are drawn from Tunisia's 2026 water summer, and
deliberately no real institution is named — the satire aims at the situation:

- **Coupure** — colour drains from the world, a tap drips, and bottles stop spawning
  entirely; you survive on your gourde. Halfway through, one **bidon** (jerrycan)
  appears: +38 water and 40 points, but you jump 15% lower for 2.5s while carrying it.
- **Délestage** — blackout. A torchlight halo follows the runner, obstacles loom out
  of the dark (spawn density eased 30% for fairness), bottles glimmer faintly.
- **Canicule** — the sun swells and pulses, heat shimmer rises, thirst drains ×1.8,
  but every bottle heals 17 instead of 11.
- **Camion citerne** — a water tanker rolls through ahead of you, spilling a trail of
  bottles; regular bottle trains pause because the truck *is* the supply.
- **Pluie** — the rare one. Rain streaks the screen, thirst stops entirely and slowly
  refills. The dream, playable.

- **Chams ghadhba** — the sun detaches, grows a furious face, trembles with jagged
  rays and pursues you, telegraphing red columns on your position: jump the instant
  the fire ignites. During it, cacti stand down — the sun is the only obstacle.
- **Barrage police** — an original patrol car (شرطة, flashing bar) and an officer
  with a قف paddle force a full stop. Tap ×5 to "show your papers" and get waved
  through for +80; the road around the checkpoint clears, and standing drains at
  half rate.
- **DSL, dhaw 9ass** — no warning: the screen goes near-black with «دسولي… الضو
  قصّ 😅», fake loading dots, everything frozen (verified 0.0px of drift), then
  power-up sound and «Rja3 el dhaw !».

Portrait was rebuilt around real phones: the logical scale is 460 across the width
(~17% larger world), the ground rides at 60% of the screen instead of the bottom,
bottles are 94px, the runner draws 22% larger, and the gauges dock top-centre clear
of the HUD text.

No event repeats back-to-back, none fire in the opening 400m, and each ends with its
own sound (power back on, rain fading out, the drip stopping).

## Sound

Everything is synthesised at runtime in `audio.js` — no sample files, which keeps the
whole deploy around 200KB. Footsteps are filtered noise bursts, the pickup is a cap
crack plus a three-stage resonant glug, wind is brown noise whose cutoff and gain track
your speed. Press M or tap the speaker to mute.

If you want real recordings instead, drop files in `assets/audio/` and call:

```js
Audio2.loadSample('pickup', 'assets/audio/glug.mp3');
Audio2.loadSample('step',   'assets/audio/sand.mp3');
```

Any sample loaded this way replaces the synthesised voice of the same name. Names
available: `step`, `jump`, `land`, `pickup`, `hit`, `milestone`, `over`, `warn`.

---

## Activer le classement mondial

Sans ça, le jeu tourne parfaitement — le classement reste simplement local à chaque
téléphone. Avec, tout le monde voit le même tableau.

### 1. La base de données (Upstash, gratuit)
1. **upstash.com** → *Start for Free* → connexion Google/GitHub.
2. Onglet **Redis** → *Create Database*.
3. Nom : `ateshane`. Type : **Regional**. Région : **eu-central-1 (Frankfurt)** —
   la plus proche de la Tunisie. Plan : **Free**.
4. Dans la page de la base, descends jusqu'à **REST API** → onglet **.env**.
   Tu y vois exactement les deux lignes dont on a besoin :
   `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`.

### 2. Les clés dans Vercel
1. Ton projet → **Settings** → **Environment Variables**.
2. Ajoute les deux, cochées pour **Production**, **Preview** et **Development**.
3. **Deployments** → dernier déploiement → menu **⋯** → **Redeploy**.
   (Obligatoire : les variables ne s'appliquent qu'aux nouveaux déploiements.)

### 3. Vérifier en 5 secondes
Ouvre `https://TON-SITE.vercel.app/api/scores` :

| Ce que tu vois | Ce que ça veut dire |
|---|---|
| `{"ok":true,"top":[]}` | ✅ tout marche — joue une partie avec un nom, puis onglet **Monde** |
| `{"ok":false,"reason":"not-configured"}` | les clés ne sont pas là, ou pas de *Redeploy* |
| une page 404, ou le code JS qui s'affiche | Vercel n'a pas construit la fonction (voir ci-dessous) |

### 4. Si la fonction n'est pas construite
Vercel Drop publie parfois un dossier « tel quel », sans étape de build — dans ce
cas `/api` n'est pas transformé en fonction. Deux solutions :
- Pousse le dossier sur **GitHub** et importe le repo dans Vercel (*Add New → Project*).
  Les fonctions `/api` sont alors toujours construites, et chaque push redéploie.
- Ou en terminal : `npm i -g vercel` puis `vercel --prod` dans le dossier.

### 5. Important : Vercel Drop crée un NOUVEAU projet à chaque dépôt
Les variables d'environnement ne suivent pas. Donc, à chaque nouvelle version :
soit tu recolles les deux clés dans le nouveau projet, soit — plus simple — tu
gardes **un seul** déploiement pour le classement et tu écris son adresse dans
`index.html` :

```html
<script>window.ATESHANE_API='https://ateshane-board.vercel.app';</script>
```

Le jeu ira chercher ce tableau-là, où qu'il soit déployé (l'API accepte les
appels d'autres origines). Les scores, eux, vivent dans Upstash : ils survivent
à tous les redéploiements.
