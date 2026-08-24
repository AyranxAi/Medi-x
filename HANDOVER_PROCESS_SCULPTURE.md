# The process sculpture (03) — build record, 2026-08-21

Chapter 03 of all three door pages — `/hormone-therapy-bhrt/`, `/modern-menopause/` and
`/testosterone-top-up/` — is one object: **a flower of six porcelain petals**. Five resting
petals fan behind one large selected petal ("the plate") that carries the step's card; a
deep-maroon petal sits beneath the plate as a backing. Selecting a step trades which petal
is the plate; the picture itself never changes, only the words move. It paints in **WebGL
(Three.js)**, and the DOM keeps everything a reader touches. Live since `e2cacc3` on main;
the third door took it on 2026-08-24.

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

All three blocks are **byte-identical on all three pages** (markers
`PS:CSS/HTML/JS:START…END`). Edit one, copy to the others; `md5` the blocks to prove parity.

**The third door joined on 2026-08-24** — his call, "make it in all three services including
men in testosterone top up". Nothing about the sculpture was page-specific, so the port was
the three marked blocks verbatim plus `.prog-grid--card` (the one modifier that lives outside
them, which drops the money panel under the flower instead of beside it). What the men's door
gave up to take it is what the two women's doors gave up in `39c094d`: the chapter's own `h2`
and lede, because the sculpture's editorial column is the heading now. Both strings are kept
verbatim in a comment at the section, so the rollback is still the three deletions plus that
paste. **The six steps' copy is the shared copy** — it was already written generically enough
for two different doors and reads for the third unchanged; the men's own step 02 wording (the
morning draw, which changes the result and not the experience) survives where it always lived,
in the `<noscript>` list.

## The dials (current values) and where they live

| what | value | where |
|---|---|---|
| relief: rise / convex bulge / tip curl / cup | `.14 / .18 / .30 / .03` (× petal length) | `RELIEF` in the 3D section |
| grid (leaf and plate share it — required for the morph) | 52 × 16, 6 rim rings | `GRID`, `petalGeometry` |
| rim radius / wall thickness (1000-unit frame) | leaf r 7, t 11 · plate r 8, t 14 | `leafGeo` / `plateGeo` |
| backing petal | same silhouette, +3.5 % along the base→apex axis, +14 right, −2 up, 30 below | `plateShape(14,-2,1.035)`, `back.position.z` |
| stack gap between layers | 16 px per 1000 px of stage width | `GAP` |
| porcelain | `#FAF7F1`, roughness .62, sheen .2, env 1.0 — **the scrolled header's ivory** | `IVORY` |
| the chapter's ground | `#F0EBE7` — the porcelain the petals wore until 2026-08-24 | `--ps-ground`, `.programme` |
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
| the roll | a hop = `.55 × --ps-dur`; a turn of n seats = n hops. Travel `--ps-hop`, grow `--ps-total` | `ROLL`, `data-ps-roll`, `data-ps-turn` |
| stacking | plate 10; Assessment 4, Blood work 2, Choose 5, Prescription 3, Aftercare 6 (1-3-5 in front of 2-4, as the render) | `--pz` |
| resting label | Playfair 380, 2.55 cqw (16–22 px), seated toward each petal's tip | `.ps-lbl`, per-slot `--lox/--loy` |
| phone card copy | `short` per step (the render's own sentence for 04) | `STEPS[].short`, `.ps-card-p--m` |

Measured off the render, for anyone re-tuning: ground `#F6EEE7`; petal faces
`#EDE5DD–#F2EBE4` (a touch darker than the ground); plate `#F3EDE8–#F8F1EB`, brightest at
the lit edge; maroon wall 4 px at the apex → 16–18 px constant through the middle third →
3 px at the foot (`#6A2D38` → `#401117`), a 1-px white line between face and maroon;
labels centred at (0.43,0.12) (0.21,0.25) (0.15,0.49) (0.26,0.73) (0.47,0.84) of the
stage, plate card text from 29 % / 30 % of the plate box.

## The re-grade (2026-08-24, his call)

> "im thinking of changing the colors of it to something lighter — you know how our flower is
> cream? make that the color of the background. additionally for the flower match it with the
> color of the header when you go down and you go up and reappears."

**Two colours swapped ends.** The flower's cream came off the petals and became the chapter's
ground; the petals took the colour of the header in its scrolled state.

| | before | after |
|---|---|---|
| petals | `#F0EBE7` | `#FAF7F1` — `--ivory`, i.e. `.hdr--solid`'s `rgba(250,247,241,.95)` |
| ground | `--cream #F4EDE1` (meno, BHRT) · `--ivory #FAF7F1` (TRT) | `--ps-ground #F0EBE7` |
| separation, petal against ground | 1.017, petal darker · 1.107, petal darker | **1.107 on all three, petal LIGHTER** |

⚠️ **THE NUMBER ALONE HIDES THE POINT: THE SIGN FLIPPED.** The men's door already separated by
1.107 — with the petals *darker* than their ivory ground, which is the reading the 2026-08-21
note called "the pieces read darker than the page". The same 1.107 now runs the other way on
all three doors. "Lighter" was a direction, not a magnitude.

**The render's own relationship is preserved and that is the argument for it.** The client's
reference stands its pieces on a ground *darker* than they are; the provisional `--cream` of
2026-08-21 existed for exactly that reason, and the note on it asked him to keep or revert.
He answered with a third colour instead, and it keeps the relationship while making the
flower the lighter of the two — which is what "lighter" meant.

**Four sites hold a colour that must move together**, and there is no way to share them in a
zero-build single file — the same standing `--dawn` and the scene's `BG_B` have:

1. `--ivory` in each page's token block
2. `.hdr--solid`'s `background`
3. `IVORY.color` in the 3D layer
4. the `psFace` gradient's mid stop in the SVG fallback (its lit and shade stops are derived
   from it, not lifted uniformly — see below)

**The SVG fallback could not take a uniform lift.** The porcelain's delta is `+10,+12,+10`;
adding it to the face's lit stop clipped it to white and threw the modelling away. So the
shade keeps its full spread *from the mid* (where the form reads) and the lit end takes the
headroom that is left: `#FFFDF8 / #FAF7F1 / #EFE9E0` against the old
`#FAF6EF / #F2EBE1 / #E7DDD0`. Lit-to-shade spread is 16 values of red against the old 19.
The wall (`psWall`) and the plate's inner sweep took the full `+10,+12,+10`: `#EEE5D5 /
#D7CAB7` and `#E6D9C2`. **The wall must stay a few values under the face's shade stop** or
thickness stops reading as thickness — it was 3–5 under before and is 3–5 under after.

**The maroon, the lights, the environment and the shadows did not move** — "only these for
now", and they are the reason the piece still reads as porcelain rather than paper.

**Everything ON the petal improved, because the petal got lighter.** `--ink-soft` on the
card meta went 5.59 → 6.19; the resting label 10.09 → 11.16; the card title 13.09 → 14.49;
the plate CTA 10.46 → 11.58. Nothing on the plate needed touching.

⚠️ **MEASURED IN PASSING AND LEFT ALONE: the gold rings are decoration, not contrast.**
`.ps-dot` / `.ps-tick` / `.ps-arr` are gold at 50–70 % over the ground and measure **1.42–1.65**
against it — under the 3.0 a UI boundary asks for. **The re-grade did not cause this and
barely moved it**: the same rings measured 1.43–1.60 on `--cream` and 1.68 on `--ivory`, so
the change is 0.015. What carries the numbers is the label inside them — `--burgundy` at
10.46 on the ground, and the active dot is solid burgundy — not the ring. Recorded because it
was measured, not proposed: the ring's weight is the client's palette and changing it is his
call, not a side effect of a colour swap.

**One contrast pairing moved and had to be repaired.** `.ps-eyebrow` is 13 px uppercase, so
it is small text with a floor of 4.5. `--gold-deep` measures **4.685** on `--ivory`, **4.305**
on `--cream` and **4.233** on the new ground — so it *passed on the testosterone door only*,
and the new ground put all three on the wrong side at once. It is `--gold-gloss` now:
**4.805**, the tightest pairing in the chapter. This is the rule the token block already
recorded on `--gold-gloss` ("it is a function of the ground") firing for the third time.
**Re-measure before moving `--ps-ground` any further from `--ivory`.**

## The bleed, and the sideways scroll it cost (2026-08-24)

`.ps-gl` is `inset:-18%; width:136%; height:136%` of the stage **on purpose** — the art hangs
past the piece boxes and the shadows need the room. What it never had was anything stopping it
at the page edge, so the whole document grew with it, **from the day the WebGL layer shipped
until 2026-08-24**, on both door pages.

**It failed ten of `doors-shots.mjs`'s thirteen widths**, not just the phone ones: 320 read
350, 390 read 433, 600 read 654 — and 1104 read 1194, 1280 read 1384, 1440 read 1453. Only
760, 900 and 1920 had margin enough to absorb it. **At 1440 the overflow is 13px**, which is
why three days passed with nobody noticing: it is a scrollbar, not a broken layout.

Fixed with **`.ps{overflow-x:clip}`**, in the shared block so it travels with the sculpture.

⚠️ **`clip`, NOT `hidden`.** `overflow-x:hidden` makes the element a scroll container and
forces `overflow-y` to `auto`, which clips the flower's shadow at the chapter's top and foot —
the thing the bleed exists for. `clip` on one axis leaves the other `visible`.

⚠️ **THE HARNESS THAT CATCHES IT EXISTED THE WHOLE TIME.** `tools/qa/doors-shots.mjs` sweeps
thirteen widths and had simply not been re-run since the sculpture landed. Run it after any
change to the stage, the canvas inset, or the phone slot map.

## The copy, and the phone's ceiling (2026-08-24)

His copy landed on the six cards, each now leading with its own number. **Step 01 was left
alone at his request.** The full account — the corrections made, the two strings reproduced
exactly as written, and the one American spelling still standing in 01 — is in
`HANDOFF.md`'s 2026-08-24b addendum. Two things belong here because they are geometry:

**The heading is a baseline flex row now.** The step number is an item inside the `<h3>`, not
inline text before it, because inline text indents only the title's *first* line — and "BHRT
Prescription" wraps at every width, so "BHRT" sat one numeral-width right of "Prescription".
The numeral is `--sans`, not `--accent`: the accent face's zero is a small round glyph that
at card size renders "04" as what reads like "o4".

**THE PHONE PLATE HOLDS ABOUT 15 WORDS / 90 CHARACTERS, AND THAT NUMBER IS MEASURED.** Forcing
the desktop sentence onto a 390px phone: at **21 words** the copy runs off the petal, collides
with a neighbouring label and pushes the CTA off the card; at **17 words** it still overruns
the plate's right edge; the six shipped `short` lines run **12–15** and all six clear it. This
is why `petal` and `short` are two sentences and not one string truncated — **a new line from
the client is two lines of work.** If that fork is ever collapsed, the ceiling is the rule and
the desktop plate (which holds about 25) goes sparse; the trade is his, and it must not be
made by quietly shortening `petal`.

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
  2026-08-21. `?dur=NNNN` sets it live; nothing is decided yet. Note the roll multiplies it:
  a three-seat turn is 1.65 × whatever `--ps-dur` ends up being.
- **The focus ring** — three options above; his call.
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

⚠️ **THE MULTI-SEAT SCRAMBLE (his report: "click 4 or 3 steps… it scrambled itself too
much and is not elegant"), fixed by ROLLING.** A jump of more than one step interpolated
straight from the old seat to the new one. The ring's radius is **not** constant — 103px at
the plate, 226px at the bottom seat — so a petal crossing three seats **cut through the
middle of the flower** instead of going round it: measured 195 → 144 → 119 → 108 → 103 while
the ring along that arc sits near 210. Six petals doing that at once is the scramble.
The flower now **rolls**: one seat at a time, each hop following the ring exactly. Traced at
`--ps-dur:2000ms`, a three-seat turn is three hops at t=151 / 1251 / 2351ms — `--ps-dur ×
--ps-roll` apart. A hop is `ROLL` (default **.55**) of `--ps-dur`, so a three-seat turn takes
1.65 × the base: longer jumps take longer, which is also what they should look like.
`?turn=direct` restores the old single interpolation for comparison; `?roll=` sets the hop.
Two durations now exist: **`--ps-hop`** paces the travel (arm/reach/cage, and the layer's
`rot` + `lay`), **`--ps-total`** paces the grow (box width, and the layer's `inf`).
Re-aiming mid-roll is free — each hop re-reads `cur`, so a click during a roll just
redirects it.

⚠️ **THE FOCUS RING (his report: "why is there a circle like that when it's clicked and
moved") — DIAGNOSED, NOT YET FIXED, his call.** It is `.ps-hit:focus-visible`, a dashed
circle because `.ps-hit` is `border-radius:50%`. A **mouse click does not trigger it**
(verified: `matchesFocusVisible === false`, `outline: none`). What happens is that focus
stays on the petal that was clicked, that petal then **travels somewhere else**, and the
first arrow-key press flips the browser's focus-visible heuristic — so the ring appears on a
resting leaf in a seemingly random place. Options put to him: (a) move focus with the
selection so the ring always sits on the active piece — note `.ps-arm.is-on .ps-hit` is
`opacity:0`, which also hides the outline, and that `opacity:0` is redundant since
`.ps-arm.is-on .ps-lbl` already hides the label; (b) restyle the ring to follow the petal's
silhouette instead of a circle; (c) hand keyboard focus to the matching 01–06 progress
number, which already carries a proper ring.

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
Serves the repo, photographs 03 on all three pages at 1440×900 and 393×852, every step, and
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

### ⚠️ The harness's own intermittency — open

**FOUND AND FIXED 2026-08-24d — IT WAS A STALE FRAME, NOT THE MAROON AND NOT THE GEOMETRY.**
He reported it: *"why is the one with the red not on the right side? that's the one that
contains the words."* Two earlier verdicts in this file were wrong — a blank-framebuffer
theory, then "the page is correct at every step". Both are superseded by this.

**THE CANVAS STOPPED DRAWING BEFORE THE FLOWER STOPPED MOVING.** The 3D layer quit its render
loop while a CSS transition was still in flight; the transition then finished, the DOM boxes
reached their seats, and nothing ever drew again. The canvas kept showing the flower from
earlier in the turn while the card text had already swapped — so the maroon appeared to belong
to a petal that was not carrying the words.

**PROVEN THREE WAYS, and the third is proof by construction:**

| test | result |
|---|---|
| every step opened directly with `?step=N`, no turn ever running | all six agree — the composition IS fixed, as designed |
| the same steps reached by clicking | desktop 2 and 5 differ by 14.5% of the frame; phone 2, 3, 5, 6 — exactly what he reported |
| force ONE more frame with `__ps3d.wake()`, changing nothing else | **0.00%** — pixel-identical to the correct frame |

Nothing was ever in the wrong place. It had not been repainted.

**WHY THE LOOP QUIT.** `dirty` is derived by comparing each box's rect key frame to frame, and
at the tail of an ease-out the boxes move sub-pixel amounts — so two consecutive frames hash
the same key, `dirty` goes false, `busyUntil` has passed, `raf` is not re-scheduled, and the
remainder of the transition plays out unobserved. `wake3D()`'s fixed window cannot cover it: a
multi-seat roll runs `--ps-hop` per seat plus the grow, which outruns the guess. That is why it
hit some steps and not others, why no amount of waiting recovered it, and why a reload did.

**THE FIX: STOP GUESSING THE DURATION, LISTEN FOR THE END.** One capturing `transitionend`
listener on the stage hears every arm, reach and box finish and buys another frame.
⚠️ **`transitioncancel` matters as much as `transitionend`** — a step change interrupts the
previous transition, and a cancelled transition still leaves a box somewhere new; without it a
fast double-click parks the canvas exactly as before. The old timer is kept but is no longer
load-bearing.

**THIS ALSO RETIRES THE HARNESS INTERMITTENCY.** `maroon inner body ... (0.0px)` and
`active zone drifted` were this same stale frame all along — which is why they moved between
runs on bytes that did not. The settle wait was rewritten in the same session to check the
contract rather than stillness; both were symptoms of one cause.

⚠️ **THE LESSON, AND IT IS THE ONE `tools/qa/README.md` ALREADY RECORDS: a render loop that
decides it is finished by watching for stillness will stop early on any eased motion.**
Stillness is a guess. The transition knows when it is over; ask it.

## Provisional — his to keep or revert

- ~~**Ground.**~~ **ANSWERED 2026-08-24** — and with a third colour rather than either of the
  two on offer. It is `--ps-ground #F0EBE7`, the flower's own former porcelain, on all three
  doors; the petals went up to `--ivory` to clear it. See **The re-grade**.
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
