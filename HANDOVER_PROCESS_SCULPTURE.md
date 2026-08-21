# The process sculpture (03) — build record, 2026-08-21

Chapter 03 of both door pages — `/hormone-therapy-bhrt/` and `/modern-menopause/` — is one
object: **a flower of six porcelain petals**. Five resting petals fan behind one large
selected petal ("the plate") that carries the step's card; a deep-maroon petal sits
beneath the plate as a backing. Selecting a step trades which petal is the plate; the
picture itself never changes, only the words move. It paints in **WebGL (Three.js)**, and
the DOM keeps everything a reader touches. Live since `e2cacc3` on main.

**The reference is the client's pair of renders** — `~/Documents/medi-gyn/Design .png`
(desktop, 1672×941) and `Design Phone.png` (941×1672), not in the repo. Every number in
this file was measured off them or decided by him on 2026-08-21; nothing here is a guess.

## His brief, in his words (the geometry — this is the design)

- Every piece is a **flower petal**, not a flat egg and not a dish: **low where it joins the
  centre of the flower, climbing convex all the way out to its far edge, which is the
  highest point; the far edge curls a little, like a petal tip.** A small **cup across** the
  sides ("a little from the side, like a spoon but not too convex"). Thin, rounded rim.
- The **maroon is a second petal under the selected one**, the same shape, a little longer
  toward the apex — "a cover from below, for emphasis" — never a slab, never the underside.
  Only the selected petal has it.
- "Premium luxury stone or porcelain." Matte, soft sheen. One light from the **upper right**;
  shadows fall **down-left** onto whatever is beneath (the render was measured: shadow
  L 146 → 196 over ~60 px under a petal's lower edge; no shadow to the right of the plate).
- "Three.js please, realistic please." (His pick over layered SVG, 2026-08-21 evening.)

Corrections he made along the way, so nobody re-makes them: first build had the light from
the upper left and the shadows down-right (wrong); second had a dome/dish (wrong); third had
the petal peaking mid-length and dipping at the tip (wrong) — **the far edge is the high
end**. He drew all three; the sketches are in the chat of 2026-08-21.

## Anatomy — four layers, one contract

1. **DOM** (`PS:HTML` + the script's builder): six arms — `.ps-arm` (rotates about the
   flower's centre) > `.ps-reach` (the radius) > `.ps-cage` (undoes the arm, so the petal's
   own box stays axis-aligned, which is what the 3D layer measures) > `.ps-petal`. The seat,
   the state classes and `data-slot` all live on the **arm**; `--pw/--pa/--prot` are custom
   properties, so they inherit down to the box. Each `.ps-petal` carries a hit button
   (`.ps-hit`) carrying the resting label (`.ps-lbl`) and the active card (`.ps-card`: title ·
   rule · meta · copy · CTA). Labels, focus rings, keyboard (← →), swipe, the 01–06 progress
   numbers, phone arrows, aria-live — all DOM. `<noscript>` keeps the original six-step list.
2. **CSS slot map** (`PS:CSS`): six fixed slots keyed by `data-slot`, now **POLAR** —
   `--pang` (the seat's angle round the flower), `--prad` (its radius in cqw), plus `--pw`
   (box width), `--pa` (aspect), `--pz` (stack), `--prot` (the petal's own rotation). Slot 0
   is the plate. A phone media query re-maps all six (plate turned −18°). **This is still the
   only source of positions — the script writes no coordinate, only WHOLE TURNS** (`--pturn`,
   `--protturn`), which is what lets CSS interpolate the way the flower is actually going
   instead of the way the numbers read. Step change = **cyclic** re-seating: petal p sits at
   slot (p − active), so the steps always read 01…06 round the ring and every petal moves
   exactly one seat. See **The turn**, below. The polar values were converted from the old
   `--px/--py` and round-trip to them exactly — the statics are untouched.
3. **The 3D layer** (`PS:JS`, section "THE 3D LAYER"): one transparent `<canvas class="ps-gl">`
   behind the pieces. It **owns no map**: every frame it draws, it reads each piece's box
   (`getBoundingClientRect`) and `--prot`/`z-index` from the cascade, and places/scales/
   rotates a mesh to match. Leaf and plate are built by one generator on one grid, so a
   piece is **one mesh that morphs** leaf → plate in step with its DOM box (opaque, no
   cross-fade). The maroon backing is always present as a slightly smaller leaf hidden
   under the leaf and morphs into the backing petal only as the piece becomes the plate.
   Renders on demand (step change, hover, resize, fonts), then stops. Flags the root with
   `.ps-3d`, which hides the SVG art.
4. **Layered-SVG fallback** (`PS:JS`, the art builder before the 3D section): the same two
   silhouettes painted as path stacks (shadow → wall → face → rim) — the picture when WebGL
   is absent or the context is lost. Container-query units absent → the `<noscript>` list is
   injected instead.

All three blocks are **byte-identical on both pages** (markers `PS:CSS/HTML/JS:START…END`).
Edit one, copy to the other; `md5` the blocks to prove parity.

## The dials (current values) and where they live

| what | value | where |
|---|---|---|
| relief: rise / convex bulge / tip curl / cup | `.14 / .18 / .30 / .03` (× petal length) | `RELIEF` in the 3D section |
| grid (leaf and plate share it — required for the morph) | 52 × 16, 6 rim rings | `GRID`, `petalGeometry` |
| rim radius / wall thickness (1000-unit frame) | leaf r 7, t 11 · plate r 8, t 14 | `leafGeo` / `plateGeo` |
| backing petal | same silhouette, +3.5 % along the base→apex axis, +14 right, −2 up, 30 below | `plateShape(14,-2,1.035)`, `back.position.z` |
| stack gap between layers | 16 px per 1000 px of stage width | `GAP` |
| porcelain | `#F0EBE7`, roughness .62, sheen .2, env 1.0 | `IVORY` |
| maroon | `#4E1A28`, roughness .6, clearcoat .12, env .5 | `MAROON` |
| key light | white ×.86 at (1.15 W, .4 H, 2.4 S) — upper right, in front; VSM radius 9, map 1536 | `sun` |
| fill light | white ×.30 near-frontal (.55 W, .1 H, 3 S); VSM radius 22, map 1024 — the contact darkening | `fill` |
| shadow on the page ground | `ShadowMaterial` taupe `#5E4536` @ .30 | `catcher` |
| environment | small PMREM studio: warm-grey room, softbox upper right, quiet fill left, dim bounce below | `env()` |
| leaf silhouette | egg 1000 × 640, widest at 52.5 % from the tip | `eggShape` |
| plate silhouette | 13 anchors (Catmull-Rom) in a 1000 × 1104 frame, measured off the render | `PLATE_PTS` |
| desktop slot map | plate 66 cqw at −23.68° r 15.833; leaves 43 cqw at −105.06°/33.480 · −135.08°/31.072 · −180°/30 · −226.97°/27.551 · −264.03°/34.638, `--prot` 12/−27/−81/−157/168 | `.ps-arm[data-slot]` |
| phone slot map | stage 1/1.25; plate 66 cqw at −10.42° r 17.285, −18°; leaves 50 cqw at −92.01°/37.148 · −136.60°/31.655 · −185.71°/25.125 · −235.56°/31.829 · −282.77°/38.451 | `@media(max-width:900px)` |
| the grow's timing | delay 0 / dur `--ps-dur` (travel) · .55/.55 (late) · .92/.50 (arrive), × `--ps-dur` | `--ps-grow-delay`, `--ps-grow-dur` |
| the overlap dials | ring radius × `--pspread`, resting-leaf width × `--pleaf` (the plate keeps its measured width); both 1 = the client's composition | `.ps-reach`, `.ps-arm{--pleafx}` |
| depth (the stack) | seat `z-index` read as a target and glided, 16 px per 1000 of stage width between layers | `pc.lay`, `GAP` |
| stacking | plate 10; Assessment 4, Blood work 2, Choose 5, Prescription 3, Aftercare 6 (1-3-5 in front of 2-4, as the render) | `--pz` |
| resting label | Playfair 380, 2.55 cqw (16–22 px), seated toward each petal's tip | `.ps-lbl`, per-slot `--lox/--loy` |
| phone card copy | `short` per step (the render's own sentence for 04) | `STEPS[].short`, `.ps-card-p--m` |

Measured off the render, for anyone re-tuning: ground `#F6EEE7`; petal faces
`#EDE5DD–#F2EBE4` (a touch darker than the ground); plate `#F3EDE8–#F8F1EB`, brightest at
the lit edge; maroon wall 4 px at the apex → 16–18 px constant through the middle third →
3 px at the foot (`#6A2D38` → `#401117`), a 1-px white line between face and maroon;
labels centred at (0.43,0.12) (0.21,0.25) (0.15,0.49) (0.26,0.73) (0.47,0.84) of the
stage, plate card text from 29 % / 30 % of the plate box.

## The turn (2026-08-21, his call)

Before this, a step change did **not** turn anything: it traded two petals across the fan
while the other four stood still, and one of them span up to 168°. Five of the six
transitions moved two pieces; 06 → 01 moved all six, so one transition looked unlike the
other five. That is what "make it smooth" was about.

**His two decisions:**

- **Land in the render, not a rigid dial.** The six seats are not evenly spaced — going
  round they are 81° → 30° → 45° → 47° → 37° → 120°, and the plate sits much closer in
  (r 15.8) than the leaves (27–35). A rigid turn would carry that 120° opening away from
  the plate and rotate the 30° pinch into its place, so the composition would match the
  client's render on only one step out of six. Instead **the six measured seats are kept
  exactly** and every petal shifts one seat along an arc — the flower turns and re-settles.
  Petals therefore travel unequal amounts; that is the price, and it is the price he chose.
- **Shortest way round.** From step a to step b the whole flower turns `(b−a) mod 6` seats
  clockwise, or the other way about when that is more than three.

A bonus that falls out of cyclic seating: the steps now always read **01…06 in order**
around the flower. Under the old ordinal rule, step 04 read 1, 2, 3, 5, 6 with 4 on the plate.

**Still open — he asked to see these, and the contact sheets are in `.qa-out/flower/`:**

- **The pace.** 850ms is too fast for him and `?slow=1` (6000ms) too slow — his words,
  2026-08-21. `?dur=NNNN` sets it live; nothing is decided yet.
- **The overlap** — his question, "should it be on top of each other as it is right now?"
  `?leaf=` and `?spread=` explore it without re-tracing a seat. Sheet: `the-overlap.png`.
- **When the arriving petal grows** — `?grow=travel` (default, swells along the arc),
  `?grow=late` (last third), `?grow=arrive` (blooms after landing).
  ⚠️ If `late` or `arrive` wins, **the card's fade-in must be re-timed too** — it runs off
  `--ps-dur` (0.45 × dur), so the copy currently arrives before the petal is big enough to
  hold it and spills past the edge. Visible at 50% in rows B and C of `the-grow.png`.
- **What the resting labels do** — `?labels=upright` (default, what it does today),
  `?labels=turn` (glued to the petal), `?labels=fade` (gone while anything moves).
  ⚠️ `turn` leaves four of the five labels unreadable **at rest**, not only mid-turn,
  because `--prot` at slots 3/4/5 is −81°/−157°/168°. The sheet shows it.

Regenerate the sheets with `node tools/qa/flower-frames.mjs` (or `… grow|labels|overlap`).

⚠️ **Two traps that both produced confident, wrong sheets before they were caught:**
1. **Do not RACE the clock.** Under software GL one screenshot costs seconds, so sampling a
   running animation returns six identical settled frames. The rig SCRUBS: CSS transitions
   are Web Animations, so each is paused and its `currentTime` set; the layer's three tweens
   (`rot`, `inf`, `lay`) are placed by hand at the same fraction; `--ps-dur` is then
   stretched to freeze the layer's own clock.
2. **Do not replay a scrubbed flower.** Re-seating it to shoot the next frame leaves paused
   animations and a part-turned state behind — rows drifted out of phase with each other
   (the maroon sat at a different stage in each row, which is what exposed it). **Every
   frame now comes from a fresh page load.** Slower; the only way the rows are comparable.

⚠️ **THE STACK GLITCH (his report: "a glitch… I'm referring to the shadow"), fixed.**
`z-index` is a stepped property — it cannot transition — and a turn changes every piece's
slot at once, so **all six depths snapped in a single frame** at the start of the turn
(traced: petal 2 jumped 43.7 → 106.2, petal 4 dropped 54.1 → 22.8). A second jump followed
**mid-journey** when `.ps-arm.was-on` released the outgoing piece from z-index 9 back to its
seat at 55%. Depth drives shadow distance and blur under the two VSM lights, so both read as
the shadow snapping. The 3D layer now GLIDES depth on the same curve as everything else
(`pc.lay`), and the `.was-on` pin is retired — a piece leaving slot 0 for slot 5 passes
through 9, 8, 7 by itself, which is what that beat was miming. The one CSS line is kept in a
comment if the fold-away is ever wanted back.

⚠️ **A second latent bug came out of this and is fixed:** the render loop ran on a wall-clock
deadline (`busyUntil`), so on a slow device a frame could outlast it and **the flower froze
part-turned**. It was intermittent in the harness before anyone saw it on a phone. The loop
now runs until the boxes actually stop moving (`dirty`, set by watching each box's rect),
which also makes `__ps3d.settled()` trustworthy.

⚠️ The layered-SVG fallback bakes rotation into five per-slot path stacks, so without WebGL
the pieces still pop between seats rather than turning. Unchanged by this work.

## QA

```
npm install --no-save playwright@1.49.1 && npx playwright install chromium
node tools/qa/process-sculpture.mjs
```
Serves the repo, photographs 03 on both pages at 1440×900 and 393×852, every step, and
asserts: the plate's centre moves < 5 % between steps; **the maroon shows past the plate's
right edge** (read from the WebGL framebuffer when `.ps-3d` is live — it waits for the
layer's own `window.__ps3d.settled()` first, because software GL can be slower than the
choreography; from the SVG boxes otherwise); every resting label is reachable by
`elementFromPoint`; card meta ≥ 12 px, editorial body ≥ 15 px; zero page errors. Shots in
`.qa-out/process/`. Headless launches with a software GL (`--use-angle=swiftshader`).
QA hooks on the page: `?step=N` (open on step N, no motion), `window.__psGo(n)`,
`window.__ps3d`.

Local quirk (this Mac, 2026-08-21): `npx playwright install` stalled at extraction; the
zip was unpacked by hand into `~/Library/Caches/ms-playwright/chromium-1148/` and the
headless-shell path shimmed to the full Chromium. Not a repo concern.

## Provisional — his to keep or revert

- **Ground.** The chapter stands on `--cream`, not the page's `--ivory`, because the render
  stands its ivory on warm cream; flagged above `.programme{…}` in both pages. One token.
- **Phone copy.** Each step gained a `short` sentence for the plate on phones (the long one
  overflowed the narrower plate). 04 is the render's own line; the other five are mine,
  cut from the existing copy.
- **The grow and the labels** — the two questions the turn left open. See **The turn**.
- **Performance.** Two VSM shadow maps. If a phone stutters during a step change, drop the
  fill's shadow (keep its light) — that is the cheap cut.

## Next chat — "the logic of the flower" (his words)

The turn is done (above); the grow and the labels are waiting on his verdict. Still not
designed: what each step's plate CTA does (today all go to `#book` except 03 → `#doctors`); whether
the steps should be reachable by URL (`?step=N` exists as a QA hook and could become the
real deep link); whether a step should auto-advance or the flower should greet on scroll;
what the phone arrows and swipe should do at the ends (today they wrap 06 → 01); keyboard
and screen-reader order; what happens on hover (today a 2 % breath); whether the resting
petals should show more than a title; analytics on the numbers. Bring the decisions,
not the code — the code is the easy half.

## History (branch `claude/medi-gyn-process-sculpture-pxqzo3`, all on main now)
`f406e93` CSS blob shells → `d8ae1e8` WebGL extrusions → `bb97fc9` traced 3D stones →
`fd28540` light corrections → `917ead8` layered SVG (the version he rejected as flat) →
`a67756e` re-cut against the two renders (SVG) → `e2cacc3` **Three.js porcelain petals,
his geometry** — this record.
