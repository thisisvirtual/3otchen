# Ateshane — course contre la soif

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

## v18 — les scènes se voient enfin, la jauge se renouvelle, le classement devient mondial

**Le barrage : le bug trouvé.** La scène se jouait — en **0,62 seconde**. Chaque tape avançait une réplique, et un joueur en pleine course tape sans arrêt pour sauter : les quatre répliques et le bakchich passaient en 37 images. Invisible. Et si tu ne tapais pas du tout, la scène ne se terminait jamais (time-out à 12 s). Corrigé : chaque réplique tient **1,15 s minimum**, s'enchaîne toute seule à 2,3 s, et l'horloge de l'événement **gèle** pendant la scène. Mesuré après correction : joueur qui matraque 4,0 s · joueur posé 6,3 s · joueur qui ne touche à rien 7,5 s — **4 répliques sur 4 visibles dans les trois cas**.

**Le soleil : les maths disaient « des heures ».** Tirage pondéré, ~10 % pour le soleil, trous de 24–44 s → environ 7 événements dans une course de 4 minutes. Sur **45 minutes simulées, le barrage n'est jamais sorti une seule fois**. Remplacé par un **sac mélangé** : chaque événement passe avant qu'un seul ne se répète, trous raccourcis (13–21 s), verrous de distance abaissés. Après : **8 événements sur 8** par course, premier soleil à 98–250 s, barrage à 181–403 s, et il va **jusqu'au bout** à chaque fois.

**Le fouet était injuste — vrai bug.** Les zones de brûlure ne défilaient pas avec le monde, et le coureur ne bouge pas en x : une frappe à moins de 52 px était une **mort inévitable** (aucun saut ne survit à 0,85 s de feu), et toutes les autres n'étaient que décor. Mon propre harnais v17 affichait `survived=false` — je l'avais laissé passer comme simple ligne de log. Maintenant : la marque **vise là où il sera** au moment du claquement, **défile avec le sol**, et le feu est un coup sec (0,28 s, rayon 30). Testé : **7 courses sur 7 survivent** avec une réaction entre 0,10 s et 0,30 s avant l'impact ; sauter 0,45 s trop tôt échoue — c'est une vraie fenêtre d'adresse derrière un télégraphe de 0,55 s.

**La jauge ne se répète plus.** Elle tire dans un sac de trois, jamais deux fois la même d'affilée :
- **DHAHAB** — casse tout, aimant, et 3otchana qui démarre **à un endroit différent du morceau** à chaque fois.
- **CHTA DBABEZ** — les dbabez tombent du ciel sur lui, l'aimant les cueille en plein vol. Pas de 3otchana : pluie + basses ouvertes.
- **RIH** — bourrasque, +45 % de vitesse, le vent **balaie les obstacles**, et la musique monte en pitch (playbackRate 1,09).

**Langues.** Les noms de régions étaient des constantes françaises affichées dans les trois langues (« Le Sahara » en mode anglais) ; la pancarte STOP et l'étiquette de la gourde étaient de l'arabe en dur. Tout est localisé. Un test **scanne chaque chaîne dessinée sur le canvas** en FR et EN : zéro arabe, sauf «شرطة» sur la livrée de la voiture — c'est la vraie livrée tunisienne, bilingue avec POLICE.

**Classement mondial.** `/api/scores` (fonction serverless Vercel + Upstash Redis), onglets **Monde / Moi**, meilleur score par joueur, contrôle de plausibilité (un score doit tenir dans la distance parcourue), limite de débit par IP, noms assainis. Si le backend n'est pas configuré, l'appel échoue en douceur : le panneau montre le classement local et une note — le jeu ne ralentit jamais et ne casse jamais à cause du réseau.

Vérifié headless en portrait **et** paysage : 12 blocs de tests, 45 minutes de jeu simulé, chaîne audio complète, fantôme v16 toujours mort.

## v17 — la bande-son, la chasse, le barrage, trois langues

**Musique & son (le gros morceau) :**
- **Rolling Bass** tourne en boucle du menu jusqu'au game over, derrière un vrai **filtre passe-bas** : bouché au menu (~750 Hz), il **s'ouvre d'un coup quand tu lances la course** (15,5 kHz), se referme en pause, s'éteint presque à la mort. « Filter bypasse » = filtre passe-bas — c'est fait.
- **3otchana blindée** : échantillon WebAudio d'abord (arrêt dur compilé dans le graphe), sinon repli `<audio>` avec minuterie d'arrêt, sinon fanfare — et re-décodage tenté au premier geste. Elle jouera.
- **Talkie-walkie** : tranches aléatoires (0,55–1,1 s) piochées dans tes 24 s — jamais l'échantillon entier. Vérifié : 60 tranches, toutes dans les bornes.
- **Respiration lourde** : ton sample en boucle remplace le halètement synthétique (soif basse + chasse du soleil).
- **Autoplay géré** : un refus navigateur ne bascule plus sur le synthé — on attend le geste et on relance.
- **Sync jeu ↔ musique** : BPM mesuré (126,25). La jauge d'or pulse sur le temps, les dbabez sautillent, la pastille combo hoche la tête — coupé pendant l'or (3otchana mène la danse).
- Mixage homogénéisé : musique .40/.50, duck ×.25, pas ré-adoucis, tout sous le limiteur.

**Le soleil chasse (CHAMS GHADHBA v2) :**
- Entrée **cinématique** : tout s'arrête (comme le barrage), le monde s'assombrit, **ton soleil furieux** (sprite détouré du damier, dents intactes) surgit du ciel avec overshoot, rugit, tremble.
- Puis il se place **derrière le coureur** et le traque : **ton fouet** en main (lové, il se lève en anticipation), et au claquement ma flamme procédurale prend le relais — mèche, claquement, brasier au sol à sauter.
- Le coureur **marche** — voûté, épuisé, sueur constante, souffle lourd — à ~55 % de la vitesse. Pas de Higgsfield ici (aucun outil vidéo dans cet environnement, et un mp4 n'a pas sa place dans un canvas) : tout est animé procéduralement, et c'est vérifié image par image.

**Le barrage v2 (la scène) :**
- La voiture — **livrée officielle** : blanche, bande bleue à pointillés, «شرطة POLICE», gyrophare rouge. L'agent — chemise bleu clair, casquette, badge doré (d'après ta référence).
- Bulles de dialogue, dzz pour avancer : «بطاقة تعريف !» → «ما عنديش…» → «ما عندكش ؟! عدّيه تحقيق !» → «خوذ قهوتك ☕» — trois **billets de 20 dinars** voltigent vers le flic (−30 points), grésillement radio, «يزّي، برّا !», et ça repart.

**Trois langues :** tounsi (RTL, par défaut), français, anglais — menus, aide, réglages, pause, game over, bannières d'événements, dialogues, punchlines de mort. Les cris signature (Behi ! Barcha ! 3AWED !) restent en derja partout. Sélecteur dans les réglages, persistant.

**Divers :** Sabrine re-rendue depuis ta nouvelle image (+ variante or), marqueur d'impact au sol au lieu de la colonne, halte du soleil = respiration calme (pas de jogging sur place).

Vérifié headless ×2 orientations : arc complet du soleil (intro 1,9 s → marche → 2 claquements → fuite), racket en 4 répliques (−30, libéré), i18n fr/en/tn, arc musical menu→play→pause→play→over, pulsations au bon tempo et coupées pendant l'or, 60 tranches radio dans les bornes, chaîne 3otchana, fantôme v16 toujours mort.

## v16 — le son réparé, le jeu vivant

**Son (bugs réels, prouvés en harness) :**
- La chanson d'or ne « ressuscite » plus. Cause racine : `stopSample` (mort/pause/retour menu pendant l'or) fadait le gain **sans annuler** les événements d'automation programmés par l'arrêt compilé — un `setValueAtTime` futur remontait le gain à fond ~6 s après la mort, et le 2e `stop()` levait `InvalidStateError` (avalé). Fix : `cancelScheduledValues` + `disconnect` différé. Harness WebAudio-sémantique : ancien fichier → gain **0.714** à t=7.2 s (fantôme audible), nouveau → **0**.
- Limiteur (DynamicsCompressor) sur le master : fini le crachotement quand pickup×combo + musique + vent s'empilent.
- ZzFX rerouté dans le **même** AudioContext, à travers le limiteur (avant : contexte séparé, sortie brute).
- Garde anti-rafale : au retour d'onglet, le séquenceur saute les pas manqués au lieu de les mitrailler.
- Sifflet du flic (طويط !) pendant le barrage.

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
