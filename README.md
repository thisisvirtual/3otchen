# 3otchen — سابق العطش

**Play: https://3otchene.vercel.app**

An endless runner about being thirsty in Tunisia. You run east across the country
looking for water, your gourde drains the whole time, and the world keeps finding
new ways to cut you off.

The events are drawn from the water and power situation people actually live with.
No real institution is named anywhere in the game — the joke is aimed at the
situation, not at anyone in particular.

Add it to your home screen and it works offline.

---

## How to play

Tap anywhere to jump. Tap again in the air for a double jump. Let go early and the
jump cuts short, which is how you clear low gaps without floating into the next
obstacle.

Collect **dbabez** — the water bottles — to refill your gourde. Seven real Tunisian
brands appear.

Two ways to die: run into anything, or let the gourde hit empty. Obstacles kill on
one touch, so the runner never takes a second chance.

Speed ramps continuously with distance. There are no levels and no checkpoints;
it just keeps getting faster until you make a mistake.

---

## Combo

Each bottle picked up within 2.4 seconds of the last raises the multiplier, up to
×9. The pickup sound rises in pitch as it climbs and the score popup grows. Getting
hit breaks the chain.

## The gold gauge

There is no golden bottle to chase. A second small gauge in the HUD fills as you
play well — bottles fill it, clearing obstacles fills it, and shaving past one by a
hair fills it more. Earned, never lucky.

When it fills you get one of three, never the same one twice in a row:

- **Dhahab** — seven seconds of gold. Invincible, bottles fly to you, obstacles
  smash instead of killing.
- **Chta** — rain of bottles.
- **Rih** — sandstorm. Everything gets much faster.

---

## Events

Every 13 to 21 seconds something happens. You get a warning banner first, then the
rules change for a few seconds.

| | |
| --- | --- |
| **EL MA MA9TOU3** | Water's cut. Colour drains out of the world and bottles stop spawning altogether. One jerrycan shows up halfway through — worth a lot of water, but you jump lower while carrying it. |
| **DHAW MA9TOU3** | Blackout. A torch halo follows you and obstacles loom out of the dark. |
| **S'HANA** | Heatwave. Thirst drains much faster, but every bottle is worth more. |
| **CAMION EL MA** | A water tanker rolls past ahead of you, spilling bottles. |
| **EL CHTA** | Rain. Thirst stops completely and the gourde slowly refills. The rare one. |
| **CHAMS GHADHBA** | The sun detaches from the sky, grows a face, and chases you — marking the ground where it's about to strike. Cacti stand down; the sun is the obstacle. |
| **BARRAGE POLICE** | A checkpoint stops you dead. Tap five times to show your papers and get waved through. |
| **DSL, DHAW 9ASS** | No warning. The screen goes black, fake loading dots appear, everything freezes. Then the power comes back. |

---

## Where you run

Seven places, crossfading into each other as you go: Sidi Bou Saïd, the Médina de
Tunis, Kairouan, Douz, Chott el Djerid, Carthage, and the deep Sahara. Sky, sand,
buildings, palms and stars all shift together, so the country changes under you
without a hard cut. Camels start showing up around Douz.

## Leaderboard

Scores are global. Enter a name and your best run goes on the world board; the Me
tab keeps your own history on the phone.

## Languages

Tunisian derja by default, right-to-left. French and English are full translations,
switchable in Settings. The combo shouts stay in derja either way — *Behi! Barcha!
Sa77a! Wa7ch!*

---

## Built with

Plain HTML5 canvas. No framework, no build step. Two vendored MIT libraries:
anime.js for UI motion and ZzFX for synthesised sound. Most audio is generated at
runtime; the death sting and the gold track are real recordings. A service worker
caches everything for offline play, and a small serverless function backs the world
board.

Tuning constants sit at the top of `game.js` — speed ramp, gravity, combo window,
event timing.

## Bottles

The seven sprites were cut from product photographs. These are real trademarks and
this is a prototype, not authorised brand material.
