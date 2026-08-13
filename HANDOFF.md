# Handoff addendum — 2026-08-13, late evening (the stills take the living orbs' movement)

> ## ⚠️ ROUND 6, SAME NIGHT — THE VORTEX RECIPE SHIPS TO MAIN, AS THE INTERIM
>
> The founder is choosing the motion herself in the **Orb Atelier** — a shared
> configurator artifact that runs this same engine (all three doors, presets, sliders,
> a copyable recipe line). His instruction until her line arrives: ship the Atelier's
> **Vortex** preset, to **main**, not a side branch. Verbatim:
> `orb-recipe: mode=counter dir=ccw wall=30s shell=48s breath=1.60 wander=1.50 glow=1.40 hover=both alternate=off`
> Two rules from earlier rounds are consciously overridden BY TASTE, chosen by eye in
> the Atelier: the shell now **turns** (48s — the round-4 reflection argument stands in
> the code as a recorded cost, not a prohibition), and hover is **both** (bloom + a .6
> quicken; the round-3 whisper rule stood at .25). All recipe numbers live in one `R`
> block in the script — the founder's eventual line is a drop-in retranslation of that
> block alone. The ring-mask safety sum is re-worked at the mask for wander 1.5: 41.6%
> vs 43.4%, ~1.8% margin — **the thinnest it has been; wander above ~1.9 breaks it.**
>
> ## ⚠️ ROUND 5, SAME NIGHT — "IS THE OUTSIDE EVEN MOVING?" — THE WALL BAND
>
> Round 4's highlight argument was correct optics and still overshot: it left the outer
> body of the ball visibly frozen. The completion of the law, not its retraction:
> **surfaces hold still, light doesn't.** A third, outermost, FASTEST zone
> (`.service-orb__wall`, ~57s/turn against the mid swirl's 80s and the core's 160s —
> the shear profile is now monotonic outward-faster) moves as **screen-blended light
> only**: the caustic webbing sweeps with the fluid while the base render's
> first-surface reflections stay anchored beneath it, which is how real glass behaves.
> Additive-only, per-door opacity (the rose runs hottest — faintest webbing), and
> **no drift on this layer, ever**: wall-confined fluid cannot slosh into its own wall,
> and pure rotation about the optical centre preserves radius — that plus the 35%
> fade-out against the 37% alpha edge is the entire rim-safety argument, carried at
> the mask. Screen over the cream ground is a near-no-op, so even a lumpy-silhouette
> graze costs nothing visible.
>
> ## ⚠️ ROUND 4, SAME NIGHT — PHYSICS ABOVE ALL (his call, and it outranks these notes)
>
> *"shouldn't the outside move faster than the inside … I want this to be physics above
> all … and defend that."* The engine now answers to a declared physical model — **a
> solid glass shell enclosing luminous fluid** — and the full defense lives in the
> script header. The four consequences: (1) the render itself must not visibly spin,
> because baked highlights belong to the room's lights and a real glass sphere keeps
> its highlights still while turning — the shell's rotation is seen only through what
> it drags; (2) **the interior is now TWO zones in shear, outer leading** (~80s/turn)
> **over a lagging deep core** (~160s/turn, 2:1) — his "outer faster" law, honored
> where it is physically true: the fluid is stirred by its wall, so drag grips the
> outer fluid first (were it orbiting a central mass the inner side would lead — the
> driver picks the profile); (3) shell and interior at different rates is MORE
> physical, not less — different phases couple only by drag (the Sun, Earth's inner
> core, a snow globe); (4) wander = convection, pulse = thermal flicker, rock and
> swell = a levitated droplet's librations. One new layer (`.service-orb__core`, the
> lagging zone) with its own mask; the shear crossfade in the 12–20% feather is
> deliberate — read it as the fluid's blur, not a defect.
>
> ## ⚠️ ROUND 3, SAME NIGHT — THE LOCKSTEP RULE BELOW IS RETIRED
>
> Over the proof clips the ask relaxed: *"it doesn't have to be picture perfect as the
> other circle … just for it to move"* — most aesthetic, luxury, nothing that takes away
> from the picture. So the stills **no longer quote the living engine's `draw()`**; their
> motion is retuned as **atmosphere** where the living orb's is **evidence** — every rate
> below the threshold of "watching something move". One shared clock is a ~7s breath
> (the ball swells ±.7% and the core light lifts with it, together); the interior turns
> slower than the eye holds (~2 min/turn); drift runs on 39s/48s paths; the rock drops
> to ±2° on 30s; hover **blooms** (light up, breath deeper, clock +25%) instead of
> hurrying. Periods are mutually incommensurate so the composite never loops. The full
> design position and every number live in the script header; the mask sum is re-worked
> at the mask (39.3% vs a rim at 42.9%). Paragraphs below marked ⚠️ describe round 1's
> lockstep build and survive as history — the mechanism, the layers, the fallback rules
> and the measured checks all still hold.

Scope: `hormone-balancing/index.html` only — one ask: *"they want this one to have that
movement"*, said of the approved section-04 renders while the 04 ALT spheres turn beside
them. So the stills now carry the living family's choreography. The A/B still stands —
nothing was deleted; if this settles the choice, the living section comes out by its own
three-part removal note.

**The verdict that shaped the build, on the record:** the living orb's motion is
*choreography* (rotation rates, the core's drift and pulse, the hover lift) **plus**
*refraction*, and a flat render can only ever share the first — one frozen viewpoint
cannot re-derive what the glass would show from the next angle; the §9 notes below
already establish that parallax is the thing a 2D image lacks. What shipped is therefore
the **entire choreography and only the choreography**: every rate is the in-plane
projection of `inst.draw` in the living engine — the shell's z-term as a rock, the
nebula's z-term as a continuous interior turn, the core's own x/y drift path and pulse,
the same seeds, hover boost, and ~34fps throttle. ⚠️ **The two engines quote the same
numbers and must change together**, or the A/B compares two behaviours instead of two
fidelities. Both motion tables live at the foot of the file, side by side, each saying so.
⚠️ **The projections negate on the way into CSS** — his check, second round ("is the
middle supposed to go the same way?"): the living engine composes in camera space (+y up,
+z spin counter-clockwise) while CSS runs +y down and rotate() clockwise, so the y-drift
and both rotations carry a minus and only the x-drift crosses unchanged. The first cut
shipped without the minuses and played vertically mirrored against the live family —
same rates, opposite directions. Fixed and re-measured the same evening.

**The mechanism** — three layers per door, all inside the existing `.service-orb` box:
the approved render (rocks), a clone of itself masked to the middle of the glass (turns
behind the rocking rim — the web and baked starburst sliding against the rim is what
stands in for "the interior swims"), and an additive glow riding the core's drift
(`mix-blend-mode:screen`, per-door opacity = the live `core` × .4 — the render already
has a full starburst; the layer only breathes over it, and the rose saturates first).
⚠️ The geometry that keeps moving glass inside the silhouette is a worked sum at the
mask: (30% mask edge × 1.16 scale) + 5.59% max drift = 40.4% against a rim at 42.9%.
Touch the mask, the drift, or `--circle-scale` and re-do it.

**The layers are built by the script, not the markup.** No JS and reduced-motion both
leave the approved section exactly as shipped — a still is its own considered frame,
the same rule the living orbs follow by rendering once. No CDN, no canvas: there is no
failure mode worse than the still that was already standing.

**Measured** (headless Chromium, `?probe=1`): three interiors + three glows built, zero
in the live section; two frames of the grid 2.6s apart differ (≈496k bytes — the same
motion test §9 used); under reduced-motion zero layers are built and the two frames are
byte-identical; `scrollWidth` at 390×844 is exactly 390, so the clipped drift never
re-springs the 391px trap.

---

# Handoff addendum — 2026-08-13, evening (headline · scene clearance · the title comes off the ball · an A/B on the orbs · 06 borrows the landing page's voice · 03 stands on the dawn · the orbs become real 3D · 05 takes his photographs)

Scope: `hormone-balancing/index.html`, ten of his notes in one pass — plus, for §10 only,
`images/boost/`, `archive/sources/` and two files in `tools/`. Where this touches
the orb table or the section-06 type below, **THIS supersedes**; everything else in the
earlier 08-13 and 08-12 addenda still holds.

Everything below was checked on the rendered page, not on the diff — 32 assertions across
1440×900 / 1920×1080 / 390×844, plus a baseline sweep at twelve widths. Both harnesses are
throwaway (they live in the session scratchpad, not the repo); what they measured is
recorded here and inline at each site.

## 1 · The H1 loses "for women"

`Hormone imbalance treatment for *women*.` → `Hormone imbalance **treatment**.`

⚠️ **The accent moved rather than disappearing.** It sat on the audience; with the audience
gone it sits on "treatment", still as a rose italic at the end of line two, which is where
every approved render has one. An H1 with no `<em>` would be the only headline on the page
without an accent.

⚠️ **The `<title>`, the meta description and the hero sub still say "for women", deliberately.**
He asked for the H1. Those three are the SEO copy he signed off the same morning — change
them as one decision, not as a tidy-up.

## 2 · BHRT is no longer sitting on "Deep sleep"

His note, and it was a measured collision rather than a preference. `.scene-title` lands at
`colL` over `.80–.88` at up to 104px, line-height 1; the first answer hangs in slot 0 at the
same x. **Gap was 8px at 1440×900 and ~7px at 390×844** — a 104px word and a 34px word
effectively touching.

Two numbers moved, and both were needed:

| | Was | Now |
|---|---|---|
| `.scene-title` y | `H*.055` | `H*.042` |
| label / answer column `top` | `H*.20` | `H*.245` |

Measured after: **60px at 1440×900, 97px at 1920×1080, 111px at 390×844.**

- The title could not climb much further — `.scene-copy` starts at `H*.045` and the header
  owns everything above — so most of the clearance came from the column.
- **`bot` is untouched.** `.88` is what leaves Replay/Skip their corner; the last slot has
  not moved a pixel.
- **The labels moved with the answers, on purpose.** Answer *i* lands in symptom *i*'s slot
  and that identity is the section's argument.
- Pitch is now 63px against 37px line boxes at 900px tall. The beat band only gained — it
  is capped by the first slot, so it went from a 180px ceiling to 220px.
- **BHRT's size is unchanged.** He asked for distance; shrinking the payoff to buy the gap
  would have spent the thing the gap protects.

## 3 · Section 04: the words come off the ball

> "they don't like the words on the middle of the ball, just make the ball the original
> colour and put the words under the questions" · "make question and the answer and the word
> explore bigger"

Reading order is now **picture → question → name → way in**.

**The glass apparatus is deleted, not neutralised.** The mask on `.service-orb__image`
(`--glass-center` / `--glass-mid`) and the `::after` scrim existed for exactly one job: to
punch a pale hole in each render so a heading could be read on it. Every per-orb value in
the old table — `.31/.5515` burgundy, `.65/.7725` rose, `.40/.61` gold — was a legibility
number tuned per pigment. With no heading over the glass there is nothing to make legible,
and an unmasked render **is** the original colour. **There is no longer a per-door
`.service-orb` rule at all** — all three carried only glass and title values.

The name is one line now (`Hormone Therapy & BHRT`), not two nowrap spans; the spans existed
to stack it inside a circle. `--top-letter` / `--bottom-letter` / `--line-gap` /
`--title-scale` went with them.

⚠️ **`--circle-scale: 1.16`, the optical centre and `overflow:hidden` all survive** — they
are size and framing, which he approved the same day. Don't take them out with the glass.

⚠️ **A contrast surface retired with it.** The title's 12.88:1 over its own scrim was a
measured row in `tools/qa/door-contrast.mjs`; the name now sits on the section's flat
`#FAF7F1` with the hook and Explore, the ground those two were already cleared against.
Nothing on this page reads over a picture any more.

The copy stack, sized as a set:

| | Was | Now |
|---|---|---|
| `.hook` (question) | `clamp(15px,1.45vw,19px)` | `clamp(17px,1.7vw,23px)` |
| `.door h3` (name) | `clamp(1.6rem,2.5vw,2.5rem)`, inside the orb | `clamp(25px,2.5vw,36px)`, on the ground |
| `.link-arrow` (Explore) | 12.5px | 15px |

The name kept **Megante**, not the global h1–h3 Playfair: it is the face he approved these
three names in, and an explicit family also makes the `"opsz" 30` pin inert on it.

The two `.service-orb h3` breakpoint overrides are gone — a title centred *inside* a circle
is sized against the circle, so it had to be re-clamped at 69rem and 45rem or it burst its
orb. On the open ground one viewport-keyed clamp covers three columns, two, and the stack.

### The one thing this round introduced and then paid off

Questions wrap 1/2/2 lines and names wrap 2/1/2, so with both on the ground **the three
Explores landed at three different heights** — a stagger the old layout could not produce,
because only the question varied. Fixed with a two-line reserve (`min-height:2.8em` on the
hook, `2.2em` on the name — line-count × line-height in each element's own ems, so they
track the clamps). Verified at 1920 / 1600 / 1440 / 1280 / 1104 / 1000 / 900 / 760 / 720 /
600 / 480 / 390: every door that shares a grid row shares an Explore baseline, and nothing
reaches a third line.

⚠️ **`min-height` is a floor, not a cap** — a third line in either string breaks this again.
Re-measure before lengthening either. ⚠️ It is **off below 45rem**, where the doors stack in
one column: with no neighbour to align to it would only print empty space.

## 4 · Section 04 ALT — the living orbs, as an A/B

> "create a whole new section under it, same thing except the orbs will use the actual 3d
> we made"

`#services-live`, directly under `#services`. Same head, same questions, same names, same
Explore, same discovery-call note — **one variable changed**. Anything else that differs
between the two sections is a bug in the comparison.

**The shader is recovered, not rewritten.** It is the engine from `4d798db`, retired on
2026-08-12 when the still family was approved, back verbatim except for one line: the mount
selector is `.doors--live .door`, so it cannot reach the still doors above it. It was
already house-patterned on the silk hero — reduced-motion collapses to one frame, per-orb
IntersectionObserver, DPR capped at 1.5, `.orb--live` granted only on a drawn frame so every
failure path leaves the CSS gradient orb standing.

**Not renumbered, and that is deliberate.** Both sections wear "04"; the kicker
(`04 alt · Consultations — living orbs`) is the only copy difference. A real 05 here would
mean renumbering Booster / Stories / FAQ for something built to have one half deleted.

⚠️ **When he picks, delete the losing section whole.** There is nothing to merge.
- Losing *live*: this section + the `.orb` / `.orb__gl` / `.orb--live` / `--orb-deep` block
  + the living-orb script at the foot. **Three pieces, all marked.**
- Losing *still*: its twin above + the `.service-orb` block.

⚠️ `id="services-live"` — the header menu and the hero's ghost button both point at
`#services`, which stays with the still section.

The mount matches `.service-orb`'s footprint at every breakpoint (square, `min(100%,29rem)`,
`31rem` on phones) because a like-for-like judgement needs the same box — otherwise he is
picking a size, not a technique. Measured 400px against 400px at 1440. The shader draws its
body at R=.80 of the canvas (23.2rem at the ceiling) against the still family's 74%-of-square
at `--circle-scale` 1.16 (24.9rem) — inside 7%, which is as close as a procedural silhouette
and a photographed one get without faking one of them.

Verified: all three orbs reach `.orb--live` with real WebGL2 buffers at 1440 **and** at
390×844, and the engine does not touch the still doors.

## 5 · Section 06 speaks in the landing page's voice

> "for the testimonials make it the same size as the landing page's feedback and same font
> and style"

Every value is lifted from `.cvoice` / `.cvoice p` / `.cvoice footer` in `../index.html`
rather than eyeballed — "same" is checkable, "similar" is not. **If chapter 08 there is ever
retuned, this is the block that follows it.**

| | Was | Now (= landing page) |
|---|---|---|
| face | `--quote` (Megante) | Cormorant Garamond italic 500 |
| size | `clamp(21px,2.5vw,36px)` | `clamp(1.755rem,2.988vw,3.213rem)` — **43.0px at 1440**, 28.1px floor |
| colour | `--ink` #2E2228 | `#000` |
| measure | 30ch | 26ch |
| attribution | burgundy name over uppercase caption | one black line, 1.08rem, .08em |

⚠️ **This overturns the 2026-08-10 "Cormorant unreadable at size" call, knowingly.** That
judgement was made against the *scene* — 21–34px of two-word phrases over a moving ground —
and **it still stands there**. `--quote` is deliberately unchanged; a second token,
`--quote-story`, carries Cormorant, so only the blockquote moved. Two names because there
are two decisions.

⚠️ **The gold `.q-mark` ornament is gone and the marks are in the copy.** The landing page
has no ornament — its quotes wear real `“ ”` around the words. A 46px gold glyph above the
text is a different style, not a smaller version of the same one. Nested quotes in Amina's
are `‘ ’`: straight quotes inside an italic garamond read as feet-and-inches at 43px.

⚠️ **A carousel-block size override had to be deleted, or the whole ask would have silently
failed.** `.story blockquote{font-size:clamp(21px,2.5vw,36px)}` sat *after* the base rule and
was more specific in cascade order; leaving it would have shipped the old size in the new
face — the one outcome that looks like the change worked and did not.

⚠️ **The fonts are linked, not base64, and that is the one place this page breaks its own
rule.** Two subsets, 74 KB, that only section 06 needs — and they are already on disk and
already shipping, so a reader arriving from the landing page has them cached. Embedding
would add ~100 KB of base64 to a 663 KB file to re-supply bytes the browser already holds.
`../images/` already resolves this way, so it is a new instance of an existing dependency,
not a new kind. **EN only** — no cyrillic subsets, because this page has no language switcher
(zero `data-i18n`, `lang="en"` fixed). Add them the day it is translated.

## 6 · The placeholder line is gone

`Placeholder stories for this mock-up — to be replaced with real patient voices.` removed on
his instruction; the `.story-note` rule went with it.

> ⚠️ **THE QUOTES ARE STILL PLACEHOLDERS.** Taking the disclaimer off a mock-up does not make
> the copy real, and 06 now looks finished to anyone who opens it. The warning is repeated in
> the DOM above the rail rather than quietly dropped with the line — that comment is the only
> place this record now lives on the page. Replace with real patient voices before any real
> marketing.

## 7 · Section 05's programme titles go back to one line

> "hormone + gut and hormone + energy should be one line"

`.boost-one h3 em` was `display:block`, which is what stacked `+ Gut Health` / `+ Energy`
under `Hormone Therapy`. Inline is the whole fix; the `margin-top:5px` and `margin-left:0`
that served the stack came off with it.

⚠️ **The gap is `margin-left:.3em`, not a space in the markup, and that is an old trap
returning.** The HTML is `<h3>Hormone Therapy<em>+ Gut Health</em></h3>` with no space before
the `<em>` — a trailing space there collapses if the line ever wraps between the halves and
the words fuse. A margin survives the wrap. Don't "tidy" it by adding a space.

⚠️ **Inline, not `nowrap`.** This makes the halves one continuous line; it does not forbid
wrapping. Measured at 1920 / 1600 / 1440 / 1280 / 1104 / 980 / 900 / 760 / 600 / 480 / 390 —
**one line at every width**, tightest slack 83px on the 390 phone. A programme name longer
than "+ Gut Health" wraps rather than overflowing, which is the right failure.

## 8 · Section 03 stands on the dawn, and the ampersand goes

> "what is bhrt background should it be different color i feel like it breaks harmony"

**He is right, and the measurement says exactly why.** The scene ends on the risen blush
`#F6E7E1`; 03 stood on cream `#F4EDE1`. The step between them is **ΔRGB `[-2, +6, 0]`** —
red down, green up, blue unmoved — at **ΔL\* 3.06%** and a contrast ratio of **1.04**.

That is the worst kind of edge: *no lightness step*, so the eye cannot read it as "a new
section began", but a real shift in colour **temperature** from pink to yellow, which the
eye sees perfectly well. It reads as two whites that were meant to match and don't.

`.bhrt` now takes `--dawn` (`#F6E7E1`). The seam disappears, and it is the editorially
right answer as well as the measurable one: **the scene names BHRT, 03 defines it**, so the
ground it was named on should still be underfoot while it is explained. The reader leaves
the dawn at 04, one section later than before.

⚠️ **This restores the alternation rather than breaking it.** Ground now runs
dawn(03) → ivory(04) → cream(05) → ivory(06) → cream(07) → burgundy. The old cream at 03
was the value that put two near-identical creams either side of the ivory doors.

⚠️ **`--dawn` must stay equal to `BG_B` in the scene script** (`[246,231,225]`). One colour,
two languages, no way to share them in a zero-build single file — cross-referenced at both
sites instead. Change one, change the other, or 03 grows a 2-value seam nobody will spot.

⚠️ **`.seg-gloss` needed its own gold, and that is a fix this round inherited rather than
caused.** `--gold-deep` `#8A6A34` measures 4.16 on the dawn — and it was **already failing
on the cream** (4.31, against a 4.5 floor: at 19px regular this is body text, not large).
New `--gold-gloss` `#7F6230` is the same hue at 92% and clears everywhere: **4.72 dawn /
4.89 cream / 5.32 ivory**. `--gold-deep` keeps its value for the scene.

Re-measured on the dawn: h2 ink **12.68**, `.seg-def` ink **12.68**, its `em` logo-red
**6.74**. All clear.

### The ampersand

`Hormone Therapy & BHRT` → `Hormone Therapy BHRT`, in **both** 04 and 04 alt. It wraps to
two lines on its own — `Hormone Therapy` / `BHRT` — which is the stacked treatment the orb
carried before the title came off the glass. The `min-height` reserve still holds all three
Explores on one baseline.

## 9 · The living orbs are actual 3D now

> "the 3d kinda feels wacky … it feels like its fake 3d … a 3d bubble in 3js or something
> … or blender glb?"

**He was diagnosing something real: the old orb was not 3D at all.** It was a fragment
shader painting a *disc* — a fake-sphere term (`z = sqrt(1-r²)`) shaded by chord length, with
wisps, filaments and rim speculars drawn as 2D functions of the pixel's angle. Nothing was
ever behind anything, and the eye knows glass by watching it **bend what is behind it**. No
amount of tuning that shader fixes it; the missing thing is parallax, not detail.

It is now a displaced sphere in `MeshPhysicalMaterial` with `transmission`, so Three renders
the rest of the scene into a buffer and genuinely refracts it. Pigment is **volume
absorption** (`attenuationColor` / `attenuationDistance`), not a painted gradient — coloured
glass is dark where the light's path is long, so the rim deepens and the centre stays pale
for free, and it stays correct while the silhouette wobbles.

### Blender GLB — recorded as a NO

A GLB carries **geometry**. It does not carry the glass: on the page it would still need
transmission, an IOR, an environment to reflect and a renderer to refract in — exactly the
material we now have — plus a loader and megabytes. A sphere is one line of geometry; it is
the least valuable thing a GLB could bring. And the **baked** option, which is the real
reason to reach for Blender, *already exists* — it is section 04's still renders. Baked vs
live is precisely the A/B he is judging, so a GLB is not a third option, it is the first one
with extra steps.

### The three things that were wrong on the way here

Recorded because each one looks like a plausible thing to "fix" back.

1. **Geometry must be `SphereGeometry`, not `IcosahedronGeometry`.** Icosahedron comes out of
   PolyhedronGeometry **non-indexed**, so `computeVertexNormals()` can only produce flat
   normals and the orb renders as a visible geodesic dome at any detail. The first render was
   faceted for exactly this reason. Sphere is indexed and shades smooth.
2. **`thickness` and `attenuationDistance` are one setting.** Beer–Lambert: what survives is
   `exp(−thickness / attenuationDistance)`. The first pass used 2.1 over .52 — a ratio of 4,
   i.e. **1.8% transmitted** — so the orb swallowed 98% of everything including its own core
   and read as a dark stone. **Tune the ratio, never one number.**
3. **The environment does almost all the work, and it must be high contrast.** This was the
   big one. A soft pale studio — what you instinctively reach for on an ivory page — renders
   the orb as flat mush with no rim and no specular, because *glass is only visible as the
   contrast it reflects*. Rendered side by side, the same material under a soft env and under
   a dark surround with bright strip softboxes was unrecognisable as the same object. The
   environment is therefore a **dark warm room with three crisp light strips**, and it never
   appears on screen — only its reflection does. **Do not brighten it to match the page.**
   Feathered rectangles, not radial blobs: blobs read as haze, strips read as glass.

### Two more things worth knowing

⚠️ **The glow is a second pass, and it has to be.** The core cannot live inside the refracted
scene: the transmission buffer's background is the page's ivory, so a white-hot core on
near-white ground is invisible — it measured as literally nothing. Interior light is drawn
*after* the glass, additively, `depthTest` off. The nebula is still a real displaced mesh
turning in 3D against the shell. Anything additive in that pass needs **soft falloff** — a
plain additive sphere punches a hard-edged white hole and reads as a bite out of the orb.

⚠️ **The canvas is opaque and its clear colour is read from the section, not typed.** Glass
needs something behind it; with a transparent canvas the refracted ray returns nothing and
the orb collapses to a flat tint (measured). It paints the section's own ground so the square
is invisible. Reading it from the DOM rather than hard-coding `#FAF7F1` means it cannot drift
if the section is ever re-grounded — which is exactly what happened to 03 the same day.

⚠️ **`neb` and `core` are per-orb for the same reason `dist` is.** Interior light is a fixed
amount of white on top of whatever the glass transmits, so on the darkest pigment it reads as
a starburst and on the palest it just saturates — the first pass blew Modern Menopause into a
featureless white blob while the burgundy beside it was perfect. Pale glass gets a shorter
attenuation distance **and** a dimmer core.

**Cost.** Transmission is an extra pass per orb per frame, so the loop is throttled to ~34fps
and gated on visibility; DPR capped 1.5. Verified: three live WebGL2 contexts at 1440 **and**
390×844, the orbs genuinely animate (two frames 2.6s apart differ), and reduced-motion stops
on a single frame.

⚠️ **It depends on the CDN**, unlike the raw-GL version it replaces. The fallback carries
that: `.orb--live` is granted only on a rendered frame, so no Three / no WebGL2 / a dead
context all leave the CSS gradient orb standing. What is lost is the live orb, never the
door. Three is already on the page for the hero silk, so no new request.

## 10 · Section 05 takes his photographs, and the empty half becomes something we build

> "replace the images on main for gut and energy" — **boosters only**, the two of them.

He uploaded three PNGs to `main` (`a8b6974`, `e5a9afb`) and said *choose*. Two are the pair:
a gold anatomy figure with the estradiol ball model beside it, and a clinician with ATP and
a mitochondrion — the same two subjects the day-old porcelain objects carried, photographed
rather than sculpted. The third is that clinician frame two stops darker.

**The dark take lost on a measurement, not a preference.** Mean frame value: Gut `#CBB192`,
pale clinician `#D9C7B9`, dark clinician `#A38F7E`. The section ground is `#F4EDE1` and the
card fill `#FAF7F1`; the dark one sits ~0.13 in relative luminance below its own partner and
reads as a different register beside it. It is kept at
`archive/sources/boost-energy-atp-clinician-dark-alt.png` — nothing was thrown away.

| Was (porcelain, one day old) | Now |
|---|---|
| `images/boost/gut-estradiol-card-1200.{avif,webp}` | `images/boost/gut-estradiol-figure-1200.{avif,webp}` |
| `images/boost/energy-atp-card-1200.{avif,webp}` | `images/boost/energy-atp-clinician-1200.{avif,webp}` |

The retired four are deleted and the masters renamed out of `images/` into
`archive/sources/` — a plate called `ChatGPT Image Aug 13, 2026, 01_02_53 PM.png` is the
exact failure `tools/encode-plate.mjs` was written to stop happening again.

⚠️ **THE 4:5 CARD SURVIVED; WHAT CHANGED IS WHERE ITS EMPTY HALF COMES FROM.** The stylesheet
has said since `3e4e773` that the copy zone is part of the photograph and a landscape master
cover-cropped into 4:5 throws it away. The porcelain plates satisfied that for free — objects
floating on ivory, lower half already blank. **His are photographs with real backgrounds and
have no such half**, and both are landscape (1.551 and 1.779): a straight `cover` would have
discarded 55–65% of the width and put ink back on a picture. So the half is now *built*:

- **band 760 of 1500 (50.7%)** — the porcelain subjects ended at 54–55%, and it is also the
  most a 16:9 master gives before the crop turns damaging. At 820 the clinician crop reaches
  x=1375 and cuts the tablet in half; at 760 it costs 188px of outer coat and nothing else.
- **feather 110px, smoothstep to `--ivory`** — the masters' bottom edges are `#BEA78E` and
  `#DBCCC0`, so a hard cut draws a horizon across the card and 44px still showed it on the
  darker Gut plate. 110 is also the ceiling: the mitochondrion bottoms out at 93.6% of its
  own height, so a feather reaching above y=650 erases its lower rim rather than softening it.
- crops: Gut **18px off the bottom** (1.8%), clinician **188px off the right** (11.2%). Never
  centred — the estradiol model and the adenine ring both sit hard against the left edge.

All three numbers are argued at length in **`tools/compose-boost-plate.mjs`**, which is new
and is now the first step of any 05 swap.

⚠️ **A PLATE SWAP IN 05 IS NO LONGER A `src` CHANGE, AND THE 08-13 NOTE SAYING IT IS HAS BEEN
CORRECTED IN PLACE.** That property belonged to masters that arrived pre-flattened onto ivory.
The sequence is now compose → encode → measure:

```
node tools/compose-boost-plate.mjs <master> /tmp/plate.png <right|left|bottom|top>
node tools/encode-plate.mjs /tmp/plate.png images/boost/<new-basename>-1200 1200
node tools/qa/boost-contrast.mjs
```

**Measured after, `tools/qa/boost-contrast.mjs` — 12/12 clear.** h3 **14.27**, rose em **7.59**,
body **6.18**, at both 1440×900 and 390×844. ⚠️ **The tell is that all six numbers are
identical on the two cards**: the copy is sitting on flat ivory on both, so the plate behind
it is not in the measurement at all. Two cards disagreeing here would mean a picture had crept
under the copy — that, not the absolute ratios, is what this harness is now checking.

⚠️ **Weight: 43.6 + 45.9 KB avif** against the porcelain pair's 20.6 + 16.6. Photographs cost
more than flat objects; still well inside the band, and both stay `loading="lazy"`.

⚠️ **`tools/encode-plate.mjs` was reporting against a 16:9 target that 05 stopped having on
08-13.** It now prints the live cover-cropped target so the crop warning means something again.

### Then he saw it, and the built copy zone lasted about an hour

> "make it tighter reduce all that white by reducing vertical height"

**He was looking at a real defect, and the number says where it came from.** The card was
`aspect-ratio:4/5` with the picture absolute at `inset:0` and `object-fit:cover`, so its
height was *declared* and the copy sat at the bottom of whatever that left. Two things then
move in opposite directions: the copy block is near-constant in CSS px — **measured 86–112
across eleven widths** — while the card height scales with its column. Air under the copy came
out at **82px at 390 and 214px at 1440**. No single aspect-ratio is right at both ends of that,
and a responsive one would have needed a second plate per programme to avoid `cover` eating
the top of the picture.

**So the height is derived instead of declared.** The picture is an in-flow `1200x760` band;
`h3` + `p` move into a new `.boost-copy` that carries the padding and the row rhythm; the card
is a flex column with no `aspect-ratio` and no `cover`.

| | Was | Now |
|---|---|---|
| card at 1440 | 558×697 | **558×519** (−25.5%) |
| card at 390 | 350×438 | **350×378** (−13.7%) |
| gap, picture → title | 214px @1440, 82px @390 | **the padding, 22–38px, at every width** |
| plate | 1200×1500, 740px of built copy zone | **1200×760, band only** |

Measured at eleven widths after: the gap equals the computed `padding-top` at every one, and
the two cards are **the same height to within 0.5px everywhere** — they share a copy length, so
nothing has to be forced. `boost-contrast` **12/12** (14.28 / 7.59 / 6.19, still identical
across the two cards). `?boost=tether` re-checked: its padding and row-gap overrides moved to
`.boost-copy` with the properties they were overriding, and the diagram draws with no stray
frames. No page errors at 1440 or 390.

⚠️ **The copy zone is no longer a thing that can be wrong.** Both earlier answers baked it into
pixels — the porcelain objects got an empty lower half for free by floating on ivory, his
photographs had one built at 1200×1500 — and pixels can only be right at one width. It is
layout now, so a longer programme name or a fourth line of body copy costs nothing and needs
no re-measure. **A replacement plate is the band, 1200×760** — one carrying its own copy zone
would double it.

⚠️ **`aspect-ratio` must not come back on its own.** A declared height over an auto-height
picture reopens exactly the gap he asked to close; it would need the plates rebuilt with it.

### And then the fade came off too

> "why is the cutout ugly on the white and the end of pictures also make the words bigger
> please appropriate for reading"

**Two calls, and the first one is a design error I introduced two changes ago.** The band's
bottom 110px dissolved into `--ivory`. That was right while the plate carried its own copy
zone — the fade hid a horizon line *inside the picture*. Once the caption moved out into
`.boost-copy`, the fade had nothing left to hide and only did damage.

**Why it read as a cutout rather than as mist, which is the part worth keeping:** both frames
have subjects that **run off the bottom edge** — the figure's shin and hand, the clinician's
coat, the mitochondrion's lower rim. Fading a frame whose content stops inside it looks like
atmosphere. Fading one through a limb looks like the limb evaporated. A hard edge cuts it,
which is what a photograph's edge is for. The feather is deleted from
`tools/compose-boost-plate.mjs`, not parameterised — the script is now crop → resize → encode
and nothing else, and the paragraph explaining why is in it so this does not get "fixed" back.

Removing it also returns the 110px it was dissolving, so both plates simply show more.

**And the type, which was genuinely too small.** `.boost-one p` had no size or leading of its
own: it inherited the global **16px**, the page's utility size, and was the smallest type in a
card whose entire job is two sentences.

| | Was | Now | at 1440 |
|---|---|---|---|
| `h3` | `clamp(19px,1.9vw,28px)` | `clamp(21px,2.1vw,31px)` | 28 → **30px** |
| `p` | inherited 16px / 1.6 | `clamp(16px,1.3vw,19px)` / **1.7** | 16 → **19px** |

The body now matches `.boost-sub` directly above it, so the section reads at one size instead
of two. Leading 1.7 rather than the sub's 1.8: the sub is a lone line and wants air; this is a
set paragraph and 1.8 loosens it into a list.

⚠️ **The line count did not move, and `ch` is the whole reason.** `max-width:34ch` scales with
the font, so 34 characters stay 34 characters at any size — the paragraph got bigger without
rewrapping. Two lines everywhere, three at 390, exactly as before. Had that been a `px` width
this would have been a re-measure of the card instead of a two-value change.

⚠️ **The one-line title rule was re-measured, because a bigger title is exactly what breaks
it.** Eleven widths, still one line at every one — but **slack at 390 is down from 83px to
60px**. That is the budget a longer programme name spends first.

**`boost-contrast` 12/12** (14.28 / 7.59 / 6.19, identical across both cards). At 1440 the
title now clears the harness as *large* text rather than small, which is a real accessibility
gain and not just a bigger number.

⚠️ **Fourth set of basenames in one evening** — `…-card-1200` → `…-1200` → `…-band-1200` →
**`…-1200x760`**. That is BRAND.md working as intended rather than churn: every one of those
was a genuinely different image, and no cache can serve a stale shape. All three retired pairs
are deleted, not left lying in `images/boost/`. The name states the shape now, which is the
thing a replacement has to match.

### The programme names go to Megante

> "Hormone Therapy+ Gut Health and energy should be Megante and bigger please"

The titles were Playfair by inheritance — they picked up the global `h1,h2,h3` rule and never
had a family of their own. They are now `var(--accent)` at `font-weight:400` /
`letter-spacing:-.02em`, which is **exactly `.door h3`** in 04: the other programme names on
the page. Setting an explicit family also makes the `h1,h2,h3` rule's `"opsz" 30` inert here,
the same reason `.svc-name` carries one.

⚠️ **THE SWAP COST WIDTH, SO THE CEILING CAME DOWN WHILE THE TYPE WENT UP.** Megante is a wide
flared face. My first attempt — `clamp(22px,2.45vw,36px)` — **wrapped the Gut title at 1920 and
1600**, and left 14px of slack at 390. So the clamp was measured rather than chosen: I probed
the largest size that still holds one line at each of eleven widths.

| width | max that holds one line | shipped |
|---|---|---|
| 390 | **23.0px** | 21px |
| 900 | 26.7px | 21px |
| 1104 | 32.8px | 25px |
| 1280 | 38.1px | 29px |
| 1440 | 36.9px | 32px |
| 1920 | **35.6px** | 32px |

`clamp(21px,2.3vw,32px)` — every value ~10% under its own ceiling. Note **1440 and up are
tighter than 1280**: the `.wrap` stops growing while the string does not, so the widest
viewport is not the roomiest card. Re-measured after: one line at all eleven, tightest slack
27px at 390.

⚠️ **390 is what caps the floor, so the phone keeps the 21px it already had** — Megante just
reads wider at it. Anything above 23px there wraps, and a wrapped title is what his earlier
"should be one line" note ruled out. **If he wants the phone bigger, the answer is not a size
— it is the two-line stack `.door h3` already uses in 04.** Worth offering; not worth assuming.

⚠️ **The `+ Gut Health` italic is now SYNTHESISED.** Megante ships one cut — the `@font-face`
declares `font-style:normal` and nothing else — so the em's inherited italic is a browser skew
rather than a drawn italic the way Playfair's was. Rendered at 3× against an upright version
before keeping it: the skew is clean on this face, and it keeps the rose italic that every
approved headline on this page ends with. The upright read flatter and lost the device.

**`boost-contrast` 12/12.** At 1440 the em now clears as *large* text too (26px), so all four
desktop rows are on the 3:1 floor rather than 4.5:1.

## Still open

- **04 and 04 alt share one ground (`#FAF7F1`), which is the only place the page runs two
  identical sections back to back.** That is correct *while it is an A/B* — different
  grounds would have him comparing grounds instead of orbs — and it resolves itself the
  moment he picks one and the other is deleted. Worth knowing it is deliberate, not missed.
- `.turn` is a **zero-height leftover** section between the scene and 03. It contributes
  nothing visually and is not in the ground sequence a reader sees. Harmless, but it is
  dead markup and it confuses anything that enumerates sections.
- The doors stay unwired (`data-soon`) in **both** sections — wiring is three `href`s and no
  markup change, and it would have to be done twice until he picks.
- **`/programs/` still shows the porcelain pair** (`medigyn-porcelain-*`, §01 and §02). He
  scoped this to the boosters, so it was left alone — but 05 and the page it points at now
  show the same two subjects in two different registers. One call, not a bug.
- `?style=editorial|gallery|soft` still override `.story blockquote` font-size with their own
  scales. They are whole-page preview treatments for a different question and are off by
  default; they now inherit Cormorant at their own sizes, which is coherent, but they are not
  "the landing page's size".
- `tools/qa/door-contrast.mjs` still measures the doors against the retired dark-plate model.
  Nothing it guards can fail now — the copy sits on flat ivory — but it is stale.

---

# Handoff addendum — 2026-08-13 (SEO headline · one scene for every width · bigger orbs)

Scope: `hormone-balancing/index.html`. Three of his calls, same day — then a second
round the same day after he saw the screenshots. Where this touches the orb table
below, THIS supersedes; everything else in the 08-12 addenda still holds.

## Round 2, same day — headline approved, and four more calls

- **The hero sub is the SEO description now** ("Medi-Gyn offers expert hormone
  imbalance treatment for women in Dubai…"). The "Deep sleep. Steady energy…" lede
  it replaced survives in spirit as the scene's own answers; revert is one block,
  marked inline.
- **The scene composition pulled toward the centre on desktop** — his question,
  answered in the build: the column starts at `W*.13` (was the 56px edge) and she
  stands at `W*.635` (was `.70`). ⚠️ **How far in they can come is bound by the beat
  band, not taste** — the beats live between the column and her left edge and the
  longest needs ~520px before it runs past three lines into the first label's slot.
  The controls follow the column in. Phone untouched.
- **Orbs again: circle 1.10 → 1.16, titles → `clamp(1.6rem,2.5vw,2.5rem)`** (36px
  at 1440, was 30.2 two rounds ago). Headroom to the ~1.26 clip is thin now — the
  next step up goes through the configurator with eyes on it.
- **The words under the orbs grew too**: hook `clamp(15px,1.45vw,19px)`, and the
  doors' Explore runs 12.5px — scoped to `.door .link-arrow` only, because
  `.link-arrow` is a shared material that 03 and 05 still use at 11.5px.
- The Orb Studio artifact's shipped defaults track all of this.

## Round 4, same day — the balance pass, and two deliberate "keep as is"

Pre-merge review, from a measured A/B/C board (margins drawn on real screenshots):

- **He was right about the imbalance**: words 187px from the left, her edge 364px
  from the right. **His pick is "B"**: `cx = W*.695`, and the column's left margin
  is **derived** — `colL = W − cx − stone half-width` — so left === right at every
  desktop width by construction (277px at 1440×900, 397 at 1920×1080, measured).
  Supersedes round 2's fixed `W*.13` column. The beat band survives at ~520px; the
  derivation comment at the point of change carries the constraint.
- **The question hooks stay Megante** — Playfair-italic and quiet-sans treatments
  were built, shown, and declined.
- **The section ground stays ivory** — cream, blush and warm-mist were shown.
  ⚠️ Recorded so nobody retries it casually: the orbs' glass centres are
  TRANSPARENT, so the ground behind them IS their inner glow — on blush the rose
  Modern-Menopause orb visibly melts into the ground.
- The temporary `?comp=` switch used for the board never shipped.

## Round 3, same day — his catch: "the word treatment is escaping"

**He was right, and it was a bug, not taste.** "Hormone Therapy" sat 50px off the
left edge of its circle and 5px off the right — the only asymmetric line of the
six. Cause: the h3 box was 62% of the orb, the spans are nowrap, and a nowrap line
WIDER than its `text-align:center` box start-aligns and spills its whole overflow
to the right. "Hormone Therapy" (289px ink at 1440) was the only line that
outgrew the 243px box — the centring silently broke for exactly the longest line,
which is the one where it matters. Fix: `.service-orb h3` is `width:100%`; the box
must always be wider than the longest line. Measured after: 27/28px, symmetric.
⚠️ Any future title longer than "Hormone Therapy" is safe up to the orb box width —
past that, this bug returns wearing the new title's name. The configurator carries
the same fix. Scene, headline and sub greenlit this round; orbs otherwise
untouched.

## 1 · The hero speaks SEO now

- **H1 is his copy verbatim:** "Hormone imbalance / treatment for *women*." — the
  accent falls on the audience, not the treatment. "A new zest for living." is gone
  from the H1; the zest survives in the untouched sub-paragraph.
- `<title>` and `meta description` carry the Dubai positioning ("Medi-Gyn offers
  expert hormone imbalance treatment for women in Dubai…").
- ⚠️ **The hero type ramp is SOLVED for this headline, not chosen** — the new second
  line runs ~9.6em against the old 5.2em, so the 118px ceiling had to go:
  `clamp(42px,7vw,100px)` desktop, `clamp(28px,9.2vw,44px)` under 520. Measured: no
  overflow at 1440 (line 940px in a 1150px wrap) or 390. Grow it only re-measured.

## 2 · The scene: the phone's presentation is the basis at every width — his call

*"The mobile experience is really good, the desktop not so — make the mobile the
basis for the desktop."* Done literally: the desktop diptych is **deleted, not
parked behind a flag**. At all widths the scene now does what the phone did:

- **The ground rises WHOLE** (dark → blush, one colour), no seam, no moving boundary.
- **The one column rewrites itself in place** — symptom out, outcome in, same slot.
  The desktop's "spent residue" column and `.scene-label.spent` are gone with the
  diptych they composed against.
- **She stands still at `W*.70`** for the entire scene. The migration existed to be
  the diptych's progress indicator; the whole-ground dawn is the indicator now.
- **All chrome keys to `wipe`** (the ground's own value): `--scene-fg` lerps with a
  crossover at wipe ~.47; the controls take the phone's snap-glass at every width
  (`--ctrl-fg` snaps ivory→ink at wipe .55, dark pill tint until the snap).
- **`BHRT` lands at the head of the column** (it used to centre on the seam's right
  half, which no longer exists).
- ⚠️ **The ivory text-shadow halo on `.scene-answer` is now load-bearing at ALL
  widths** — the early reversals land while the ground is still dark, exactly as on
  the phone. Remove the halo and "Deep sleep" arrives as ink on a dark ground.
- **What did NOT change:** every `mobile ? small : large` SCALE fork (figure
  657→900px on desktop, point density, edges, copy width), the track heights, the
  beats, the latch, the controls' behaviour, and the centred legacy at
  `?layout=centre` — verified error-free after the change.
- Verified with the QA harness at 1440×900 and 390×844 across p = .05/.25/.45/.60/
  .75/.92: identical label/answer opacity schedules at both widths, no page errors.

## 3 · The orbs: a tad bigger, and the BHRT glass recalibrated

- ⚠️ **The visible circle is only 74% of the square** — measured alpha bounds
  (174,115)–(990,931) of 1100, identical on all three masters. So the circle can
  grow with NO layout change: new `--circle-scale:1.10` scales the render about its
  own optical centre. Clipping starts at ~1.27; `overflow:hidden` on `.service-orb`
  is **load-bearing** (the scaled transparent ground widened the document to 391px
  on a 390 phone — measured, fixed).
- **Titles +10% with the circle:** h3 clamp `1.35rem/2.1vw/2.1rem` →
  `1.5rem/2.3vw/2.3rem`. The clamp is viewport-keyed, not orb-keyed — grow both or
  neither.
- **BHRT glass .39/.6035 → .31/.5515.** His read: "too dark, doesn't look like 60%."
  The number was honest but burgundy is the darkest pigment of the three, so equal
  alpha reads darker; .31 makes it READ like the gold orb's 60%. Family ratio kept:
  `mid = center + (1−center)×.35`. Updated table:

| Orb | Scale | Top / bottom tracking | Gap | Glass (center/mid) |
|---|---:|---|---:|---:|
| Hormone Therapy / BHRT | 98% | −.035em / −.035em | +.26em | .31 / .5515 |
| Modern / Menopause | 102% | −.035em / −.035em | +.06em | .65 / .7725 |
| Testosterone / Replacement | 101% | −.025em / −.035em | +.29em | .40 / .61 |

- **A live configurator artifact exists for the owner** (sliders for circle scale,
  title size/scale, tracking, gap, glass, scrim; emits the exact CSS block to paste
  into the per-orb rules). Values he picks there land here as a one-block change.

---

# Handoff addendum — 2026-08-12 (approved static service orbs)

Scope: `hormone-balancing/index.html` section 04 only. This supersedes the
“living orbs” addendum immediately below.

The procedural WebGL orbs and their arched triptych are retired. The approved
1254×1254 burgundy, rose and gold masters are archived untouched; 1100×1100
production derivatives now ship as an open ivory service grid, with the current
question hook and unwired Explore row centred under each orb. There is no Section
04 animation, canvas, fallback shader, or `?doors=` / `?doorcopy=` layout switch.

Served assets are `images/service-circle-{hormone-therapy-burgundy,
modern-menopause-rose,testosterone-replacement-gold}.webp` (quality 88; 85–122 KB
each). Their outer studio ground is transparent so no square image boundary appears.
The untouched PNG masters live under `archive/sources/` with the same semantic names.

The shared title treatment is MediGyn Megante, `#2E2228`, on `#FAF7F1`, with an
18% scrim and optical centre `52.83% 47.54%`. Per-orb values:

| Orb | Scale | Top / bottom tracking | Gap | Glass |
|---|---:|---|---:|---:|
| Hormone Therapy / BHRT | 98% | −.035em / −.035em | +.26em | 61% |
| Modern / Menopause | 102% | −.035em / −.035em | +.06em | 35% |
| Testosterone / Replacement | 101% | −.025em / −.035em | +.29em | 60% |

Responsive family: three columns wide, two columns with the third centred below
69rem at exactly the same width as either upper card, and one column below 45rem.
The three destinations remain deliberately unwired.

---

# Handoff addendum — 2026-08-12 (the living orbs)

Scope: `hormone-balancing/index.html` section 04 only. Everything below this addendum
still describes the rest of the page truthfully; where it describes the consultation
doors, this supersedes it.

## What changed

**The three consultation doors are fronted by living orbs now, not photographs.** His
call, with his renders as the target: three glass orbs — burgundy, rose, gold on ivory,
glowing core, swirling interior — one per service, "3d exactly as it is and it's moving
… the middle part has a transparent quality … and it's big."

The renders never landed in the repo as files, so the orb is **rebuilt procedurally in a
WebGL2 fragment shader** (one program, three brand tints, per-door seed). The engine is
a plain inline script at the foot of the file, house-patterned on the silk hero:
reduced-motion collapses each orb to a single drawn frame; IntersectionObserver stops
off-screen drawing; DPR capped at 1.5; every failure path (no JS, no WebGL2, context
death mid-setup) leaves a pure-CSS gradient orb standing — `.orb--live` is granted only
on a successfully drawn frame. Raw GL, not Three: the doors must not depend on the CDN.
Hover eases `u_boost` 0→1 and runs the sim-clock up to 45% faster — the orb stirs when
regarded; the triptych's no-lift rule is untouched.

**The doors went light in the same stroke.** The renders sit on ivory, so the panels
follow: cream ramp ground (`#FBF8F2→#F2EADC`), hairline border (inline borders come off
in the full-bleed triptych so touching seams stay single), arch radius kept. Copy flips
to the light-ground rules: hook rose→burgundy, h3 ivory→ink, Explore gold→logo-red (the
inversion rule, other direction). The measured dark-plate scrim system — all three ramps
(shipped, raise, crown) — is retired, not lightened; each site carries an `ORB FLIP`
note. The photo plates and their LICENSES record stay on disk, unreferenced; restoring
them is a git revert of the marked blocks.

## Contrast, re-measured (`node tools/qa/door-contrast.mjs`)

All 18 rows clear (3 doors × 3 controls × 2 viewports). Worst-2% method, per BRAND.md:

| Control | Colour | 1440×900 | 390×844 | Floor |
|---|---|---|---|---|
| .hook | burgundy | 10.54 | 10.55 | 4.5 |
| h3 | ink | 12.88 | 12.90 | 3 / 4.5 |
| .link-arrow | logo-red | 6.80 | 6.80 | 4.5 |

Tightest margin is 2.30 (link-arrow), against the photo era's 0.51. The harness needs
`npm install playwright gsap lenis three sharp` (no package.json — install ad hoc).

## Still open

- The doors stay unwired (`data-soon`) — wiring is still three `href`s, no markup change.
- `?doors=` and `?doorcopy=` QA modes all survive with orbs; judge them when he does.

---

# Handoff — 2026-08-11 (evening)

Everything here is **on `main` and deployed**. It replaces the earlier handoff of the same
date, which described the scene this session rebuilt.

For durable design law read [`BRAND.md`](BRAND.md). For the service page's own anatomy read
[`hormone-balancing/HANDOVER.md`](hormone-balancing/HANDOVER.md) — **which this session made
partly false**; it carries a superseding block at the top listing exactly what.

---

## The one-line version

The Signals scene was rebuilt around his idea: **she stands right, the symptoms are a list on
the left, ✦ BHRT travels down her, and the ground splits behind her into what she had and what
she has.** She is a Venus de Milo — a point cloud that resolves into marble. The old centred
scene is intact at `?layout=centre`.

---

## What shipped, in order

| Commit | What |
|---|---|
| `ee47137` | The side layout, Venus, ten symptoms, section 03 stripped, the QA harness |
| `b065e01` | Glass controls; steppers moved from beats to chapters |
| `fe60347` | The centred scene says BHRT again (it had stopped) |
| `8280471` | His five FAQ answers replace the six invented ones |
| `35ea2af` | "Is this for men too?" restored |
| `793c227` | Side becomes the default; centred moves to `?layout=centre` |
| `be712eb` | 03 becomes a headline; ◂ ▸ removed; subtext up; disclaimer out |
| `8e1853b` | "What is BHRT?" |
| `9671ff1` | This handoff rewritten; `HANDOVER.md` marked superseded in part |
| `aad3aaa` | The consultation doors become a triptych, three modes; Venus as interim plates; CC0 recorded |

---

## The scene as it now stands

**Two layouts, one file.** `?layout=centre` is the old centred capsule scene, unchanged in
behaviour and still correct. Everything else is the default. The fork is `const SIDE` and a
single `updateSide()`; the original `update()` was not restructured.

**Track: 360vh desktop, 300vh phone** (was 600/460). The old track spent 42% of itself on
recognition and held the finished picture for the last 3.9%. It now holds from `.80` to the
end — roughly 72vh against 23vh, in a track 40% shorter.

**The timeline**, all pure functions of pin progress:

| Window | What |
|---|---|
| `.015–.20` | The ten symptoms appear, staggered, tethered. Ground wholly dark |
| `→ .48` | All eight beats run and finish |
| `.27–.36` | The morning sweeps in from off the right edge to `W*.72` |
| `.30–.36` | **✦ BHRT** ignites at the pituitary |
| `.36–.68` | Ten cuts, `rel(i) = .36 + i*.036`. Each: tether retracts, answer lands `.01` later, she nudges left |
| `.40–.66` | Point cloud cross-fades to marble |
| `.40–.78` | The seam tracks from `W*.72` to her back |
| `.80–.88` | **BHRT** in Megante |

**She migrates** `W*.70 → W*.50`, one tenth per cut, so her position is the progress indicator
and the stage is never still. That was the answer to "too slow" — which was never about
duration. BHRT used to arrive at `.56` and the first visible improvement at `.866`, so the
claim and its proof sat 40% of the scroll apart.

**The seam is two-phase and the first phase is a correctness fix.** The reversals are fixed
ink and are only legible once blush is under them. A single ramp converging on her back left
the seam near the right edge at `.37`, so "Deep sleep" arrived as ink on the dark ground.
`seamX = mix(mix(W*1.35, W*.72, wipeIn), cx, wipe)`.

**Contrast got simpler, not harder.** Each half keeps one permanent ground, so symptoms are
ivory-on-dark for their whole life and reversals ink-on-blush for theirs. Nothing crosses
anything — the failure that cost a round when copy and ground lerped toward each other.

**Every beat finishes before `.48`, on ground that is still wholly dark.** Not tidiness: the
seam sweeps through the middle from `.34`, so centred copy would cross it. The back half is
deliberately wordless.

**Phones get no diptych.** 390px will not hold three columns, so the one column rewrites
itself in place — symptom out, outcome in — and the ground rises whole. His call.

---

## Venus

**Approved by him, and the licence question is closed.** The scan is a plaster cast (ref.
KAS434/1) in **The Royal Cast Collection at SMK – National Gallery of Denmark**, released
**CC0 1.0 Public Domain**. CC0 imposes nothing: commercial use, modification and
redistribution are all permitted and no attribution is required.
Recorded in [`LICENSES/CC0-VenusDeMilo-SMK.txt`](LICENSES/CC0-VenusDeMilo-SMK.txt) so the
next session does not have to ask again. SMK invite a note at web@smk.dk from anyone making
new work from the scans — a courtesy, not a term, and worth doing.
⚠️ The `.glb` itself is **not** in the repo and is not redistributed; the page ships a render
and a point cloud.

Two assets, baked together from one normalisation:

- **A 4000-point cloud**, Int16-quantised in figure space, inlined (~21KB). No loader, no
  runtime GLTF, single-file property intact — the same trade the fonts already make.
- **`images/scene/venus-stone-*`** — AVIF + WebP, 1005×2400 and 628×1500, 60KB and 36KB.

⚠️ **Both were baked from the same orthographic frame, and that is the only reason the
cross-fade registers.** Re-bake both together or neither. `VEN_ASPECT = 0.41872` must match.

⚠️ **Pre-rendered, not real-time, on purpose.** The stage is 2D and locked to one camera, so a
runtime GLB buys nothing visible and costs a loader, ~8MB, and a second WebGL context on
phones already paying for the hero silk shader.

⚠️ **The scan is wider than the capsule figure** — max half-width `.170` against `.139`. That
is why the centred layout could not absorb Venus *and* ten symptoms at 390px, and it is the
measurement that made the side layout necessary rather than merely nicer.

---

## Traps found the hard way, this session

1. **`OrthographicCamera`'s `top`/`bottom` are camera-relative, not world coordinates.**
   Passing world Y put the frustum above the model and clipped everything below the ribs, so
   Venus rendered as a torso fragment. It cost three render passes and a wrong conclusion
   about the asset. Frame it `(-halfW, halfW, H/2, -H/2)` with the camera at the centre.
2. **A near/far of ±1e5 on a two-unit model is a real bug but was not *this* bug.** It
   destroys depth precision and is worth fixing on sight — it just was not why the statue was
   cut in half. Fixing it changed nothing, which is what proved the frustum was the fault.
3. **"Faint at the payoff" was a stagger, not a bloom.** At scrub `.90` the last six reversals
   sat between `.50` and `0` opacity because answer *i* completed at `.898 + i*.009`. The dawn
   finishes at `.850`, so the ground is identical at `.90` and `.97`. A previous round blamed
   the radial bloom and nearly moved fixed ink back onto `--scene-fg`, which would have
   reintroduced the 1.42:1 crossover. **Read opacity from `getComputedStyle` before believing
   any colour diagnosis.**
4. **Ten answers against an eight-row `CFG` threw on `CFG[8]`** in the live centred scene.
   Growing the symptom list touches four DOM lists *and* two anchor tables and two loop bounds.
5. **Removing the ninth beat silently removed the only BHRT reveal in the centred path.**
   "✦ Meet BHRT." became `.scene-title`, which only `updateSide()` drove; section 03 had lost
   its 116px word in the same change. For two commits the live page never said the word above
   11px. **Deleting an element two code paths read is a two-path change.**
6. **A flag nobody can find is not a comparison switch.** `?layout=side` shipped opt-in so the
   two could be compared, and the bare URL then served the old scene to the person who asked
   to see the new one, three times. Default to the thing you want looked at.
7. **`--scene-fg` keyed to progress is wrong when the ground is not uniform.** The phase
   indicator sits top-right, which the blush reaches long before it reaches her; it is keyed to
   `seamX` now. The controls sit bottom-left on the permanently dark half and take a fixed
   ivory instead — following `--scene-fg` turned them to ink on ink.
8. **`.faq-a p` carried the gap between an answer and the next question.** That worked while
   every answer was one paragraph, because the two spaces were the same thing. His longest
   answer runs seven and repeated a 24–32px gap six times inside it.
9. **Both uploaded scans are the same statue.** The OBJ is also a Venus de Milo, lower-poly.
   There is no male figure in the repo.

---

## What is open

~~**Two statue scans are needed**~~ — **closed 2026-08-12. The doors have real photography and
no further scans are wanted.** Venus stays where she belongs, in the scene; she is out of the
doors. One image per door, his upload:

| Door | Plate | Subject |
|---|---|---|
| Hormone Therapy & BHRT | `images/doors/bhrt-941.*` | A gold molecule model on cream silk over travertine |
| Modern Menopause | `images/doors/menopause-941.*` | A woman in burgundy silk at a travertine counter |
| Testosterone Replacement | `images/doors/trt-941.*` | A man in a dark suit at a dark stone table |

**AI-generated**, recorded in [`LICENSES/AI-DoorPlates.txt`](LICENSES/AI-DoorPlates.txt).
⚠️ No identifiable person appears — both figure plates are framed above the face, so no model
release is in play. **That is load-bearing: do not re-crop to include a face.**
⚠️ A smart ring on a dock is visible in two plates. Raised as a risk — a device in frame can
read as a device the clinic supplies — and **kept as mood, his call**. Reversible by tightening
the crop; the copy band is nowhere near it.

**One size per door, which is deliberately not the repo's usual pair.** Heroes ship wide+phone
because a hero is biggest on desktop. A door inverts that — a third of the viewport on desktop
(480 CSS px, 960 at 2x) and the full width on a phone (390, 1170 at 3x) — so the phone wants
the larger file. 941 is the source's own width and covers both; a second file would be an
upscale. AVIF 39–66KB, WebP 60–98KB, all lazy.

⚠️ **`cover`, and each door crops from its own anchor.** Sources are 941×1672 (0.563) against a
panel near 0.75, so cover discards about a quarter of the height. `--plate-y` picks which
quarter, per door: BHRT 30%, Menopause 50%, TRT 50%. `object-fit:contain` and the `--plate-scale`
trio are gone — both existed only to make one statue look like three.

⚠️ **`images/medi-gyn-*.png` are the masters and reach no visitor.** The `-landscape` halves are
for the per-consultation pages that do not exist yet, and are deliberately not encoded, because
nothing points at them.

**The scrim was measured, and the rail's ramp — which the old comment told you to revert to —
fails.** `.hook` is rose `#C79A92`, not ivory, and over the pale BHRT plate the rail's ramp
lands at **4.18:1** at 1440×900 and **4.07:1** at 390×844 against the 4.5 a 14–17px run needs.
It passes over the dark TRT plate beside it, which is what makes it dangerous: two thirds of the
triptych look fine. The shipped ramp is keyed to the worst plate. BRAND.md's method, three doors
× three controls × two viewports, each control against its own colour — **18 of 18 clear**:

| Control | Colour | Need | Worst measured | Where |
|---|---|---|---|---|
| `.hook` | rose `#C79A92` | 4.5 | **5.01** | BHRT, 390×844 |
| `h3` | ivory `#FAF7F1` | 3 / 4.5 | 13.83 | BHRT, 1440×900 |
| `.link-arrow` | gold `#C2A05E` | 4.5 | 6.62 | BHRT, 390×844 |

⚠️ **The margin on that hook is 0.51, so a plate change is a re-measurement, not a swap.**
The harness is in the repo: `node tools/qa/door-contrast.mjs`, and `--rail` reproduces the
failing alternative so nobody has to take the paragraph above on trust. It needs `sharp`
alongside playwright. Expect ±0.05 between runs — AVIF decode is not bit-identical — so treat
the harness's pass/fail as the answer and these numbers as the record of one run.

`images/placeholders/` is deleted — the plates it was standing in for have landed.

**The triptych is built and live; the mode is not chosen.** All three ship behind a switch and
he is judging them on the real page:

| Mode | URL |
|---|---|
| Expand once on entry — **default, and the recommendation** | `/hormone-balancing/` |
| Pinned expansion | `?doors=pinned` |
| Static full bleed | `?doors=static` |
| The original scroll rail | `?doors=rail` |

**Delete the two he does not pick**, and the rail with them once the triptych has been seen on
a real phone. The recommendation is entry: pinned is the better moment in isolation, but it is
a second pin arriving one screen after a 360vh pinned scene, and costs ~160vh of held scroll
on a page whose original complaint was pace.

⚠️ **The mode switch runs above `if (probe) return`, deliberately.** Layout is not scroll-gated
motion and `?probe=1` is the layout QA switch, so it is exactly when you want to see the
triptych. Probe and reduced-motion skip the *animating* and land on the finished state.

~~⚠️ **The door plates are interim**~~ — **closed 2026-08-12, see the table above.** For the
record of what changed with them: the two properties this paragraph blamed on using a
contained marble figure did not both revert when photography landed. The panel height did not
(it is never a flat viewport tall, and that is now about the headline, not the plate). The
scrim did not either, but not in the direction predicted — the rail's ramp was measured and
**fails** on the pale plate, so the triptych keeps a ramp of its own for a completely
different reason than the one written here.

⚠️ **Superseded 2026-08-12 — the panel height is measured, not fixed, and the headline
stays.** Every mode used to fade `.sec-head` out as the panels grew: entry collapsed it to
`max-height:0` and then stripped the section's top padding, pinned keyed its opacity to `--k`.
The section ate its own headline, and *"Where would you like to begin?"* was gone by the time
the three answers to it reached full bleed. The panels now bleed **underneath** the headline.

⚠️ **Second pass, same day — the height is a flat `92vh` again and `--head-block` is gone.**
The first pass kept the headline by shrinking the panels to fit beside it in one screen, which
made them **618px of a 900px viewport**. His read: full bleed at 69vh is not full bleed, it is
a wide band. The headline now simply sits above a 92vh rail. **The trade, stated:** 04 is taller
than one screen, so at the moment it arrives the door titles are below the fold and a short
scroll brings them up — normal for any full-bleed band, and worth 210px of photograph.
`--head-h` survives for **pinned only**, which genuinely still needs it: that mode centres the
headline and the rail together inside a 100vh sticky stage.

⚠️ **A PANEL-HEIGHT CHANGE IS A CONTRAST RE-MEASUREMENT.** `cover` crops against the panel's
aspect, so 618 → 817px moved the copy band onto a different part of every photograph. Re-run:
still 18/18, tightest the BHRT hook at **4.99**, margin **0.49**.

⚠️ **And it exposed a hole in the harness.** `door-contrast.mjs` centred the *door*, which
worked while a panel fitted inside the viewport; at 92vh the Explore link fell below the fold
and the script **skipped three of eighteen controls while still printing a clean pass.** It now
centres the lowest control being measured, and treats any skip as a failure with a non-zero
exit. **A silent skip that reads as a pass is worse than a fail.**

⚠️ **`?doors=pinned` has never actually pinned, and this is not new.** `body` carries
`overflow-x:hidden`, which makes the body a scroll container and kills `position:sticky` on
`.svc-stage` — verified against the pre-change file, where the stage scrolls away exactly the
same. `--k` still reaches 1, so the panels expand on schedule and the mode *looks* plausible in
a screenshot; it just never holds. Worth knowing before judging pinned against entry, and it
dies with the mode if entry is the pick.

**Four controls are still inert** — the three door *Explore* links and 05's. Same standing
rule: a control with no destination stays inert rather than pointing at a placeholder URL.

**Recommended for the lower half**, none of it built:
- **The missing beat is "when".** The page says what BHRT is and where to begin but never how
  long it takes to feel different. It belongs between the doors and the FAQ.
- **The placeholder testimonials are the biggest liability on the page.** Invented patient
  voices on a regulated medical site are a different category of risk from an unfinished
  photo. Cut the section until three real ones exist.
- **05 Booster programs interrupts the run** from doors → proof → book. It reads better after
  the FAQ. ⚠️ **Still open, and now more so.** The treatment question below is closed; this is
  placement, and the section that used to be 780px is now ~1340px, so it sits between the doors
  and the proof for twice as long as it did when the note was written.

## 05 is the diptych — his pick 2026-08-12, and the Gut plate was replaced the same day

`images/gut.png` (his upload, `23ae7dd`) → `images/boost/gut-anatomy-1340.{avif,webp}`. An
anatomical GI render. **Renamed on the way in** — it arrived as
`ChatGPT Image Aug 12, 2026, 12_32_28 PM.png`, which is not a filename a repo should carry.

⚠️ **IT IS 1563×1006 (1.554) AGAINST A BOX LOCKED TO 1.778, AND `.boost-one img` HAD NO
`object-fit`.** It only ever worked because both previous plates were exactly 1340×754. Without
the guard this plate would have been **stretched, not cropped** — a distortion nobody reads as
a bug, only as a slightly wrong-looking photograph. `object-fit:cover` is on that rule now.
The retired `gut-band-1340.*` and `gut-tall-941.*` are deleted and 05's undecided frames were
repointed.

⚠️ **Both plates are now medical illustration** — an anatomical render and a lab frame. They
read as one family, which they did not when it was a pomegranate next to a pendulum, and that
is what makes the side-by-side arrangements viable at all.

| `?pair=` | What it does |
|---|---|
| `duo` | Two equal columns, picture over copy. The only one where both programmes are legible in a single glance |
| `stack` | Desktop takes the phone's layout — full-column pictures, copy beneath. Most generous, 2393px tall |
| `offset` | The shipped rows, but the picture breaks the text column and the second row drops |
| `frame` | Each programme becomes one ruled card. ⚠️ Also the most boxy, which has already been objected to once |
| `feature` | One leads, one follows. Only right if one of them actually is the main road |
| `diptych` | Two full-bleed halves, copy **on** the picture. **← chosen** |
⚠️ **CLOSED — he picked `diptych`.** The other five arrangements, all eight `?shape=` frames,
both switches and the four portrait crops that only `?shape=arch`/`tall` used are deleted.
05 is two full-bleed halves with the copy on the picture.

⚠️ **THE SCRIM IS BACK, AND THAT IS THE PRICE.** Bands existed to avoid it. 05 now carries the
presence 04 has instead of handing it back one screen later, and in exchange **every future
plate swap in 05 is a re-measurement** — it is no longer a `src` change. Same standing cost 04
carries.

⚠️ **A STYLE VARIANT DOES NOT SURVIVE THE LAYOUT CHANGING UNDER IT.** `?style=salon` set
`.boost-one h3 em` to burgundy — right while 05's copy was ink on cream, near-invisible the
moment it moved onto a dark scrim. Scoped to the headline; three more style rules that framed
the picture are gone with the frame. **Re-measured all five styles against the new layout:
102 runs, 0 skipped, all pass.**

⚠️ **Two harness lessons, both the same one in different clothes.** 05 is taller than the
viewport now, so one scroll per *section* cannot hold the headline and the copy at once — it is
one scroll per *target*, which only works because the copy is hidden with `color:transparent`
and layout does not move. And the rect must be read **after** the scroll settles, not in the
call that starts it: read too early it sampled the dark diptych behind a kicker that sits on
cream and reported **1.19:1** for something that measures 6.84. **A near-1.0 ratio is almost
never a real failure — it means the foreground and the background are the same pixels.**


⚠️ **`?shape=` and `?pair=` are orthogonal** — the frame the picture sits in, and where the two
things sit relative to each other. Either can be judged without the other moving.

⚠️ **diptych reintroduces a scrim, which bands existed to avoid.** Measured, both halves, both
viewports, 12 runs, 0 skipped — but it is a standing cost: every future plate swap in 05 becomes
a re-measurement, exactly as it is in 04.

⚠️ **AND IT FAILED ITS FIRST MEASUREMENT IN A WAY WORTH REMEMBERING.** The rose `h3 em` over the
gut plate landed at **exactly 4.50** at 390×844 against a 4.5 floor. It passed on desktop —
because there the em is 38px and therefore *large* text needing only 3. **The phone shrinks it
to 22px and moves the goalposts.** A scrim tuned on desktop will fail on a phone every time.
Deepened ramp; the same 12 runs now clear, tightest 4.99.

## 05's plates are recoloured — his upload, shipped 2026-08-12, and measured

`9d9a3eb` → `images/{gut,energy}-gold.png` → `images/boost/{gut-anatomy,energy-lab}-gold-1340.{avif,webp}`.
**Renamed on the way in**, again — they arrived as `ChatGPT Image Aug 12, 2026, 02_24_57 PM.png`
and `…02_29_23 PM.png`. The retired `gut-anatomy-1340.*` and `energy-lab-1340.*` are deleted.

Same two subjects, recoloured from the rose cast to gold. **The gold is the page's own
`--gold` #C2A05E** — the tether colour in the scene, the ignition at the pituitary, the
`link-arrow` on every door — so 05 stops looking like stock run through a brand filter and
starts sitting in the same world as the door plates.

⚠️ **MEASURED, AND THE MARGIN MOVED THE WAY IT WAS PREDICTED TO.** Copy sits ON these plates,
so this was a re-measurement and not a `src` change. `node tools/qa/boost-contrast.mjs`:

| | before (rose) | after (gold) |
|---|---|---|
| gut · rose `h3 em` @ 390 — **the binding case** | 5.48 | **5.23** (margin 0.73) |
| gut · ivory `h3` @ 390 | 13.23 | 12.64 |
| energy · rose `h3 em` @ 390 | 5.88 | **7.14** |

**12/12 clear.** The gut plate spent 0.25 of its margin and the energy plate gained 1.26.
The gut plate is much brighter overall, so the small loss is only small because `cover`
crops it (below) and the copy band sits on the darker foot of the frame. **0.73 is the
tightest thing in this section — a third plate swap is another measurement.**

⚠️ **THE GUT MASTER IS 1562×1007 (1.551) AGAINST A BOX LOCKED TO 1.778** — the same trap the
previous gut plate carried, and it only fails safe because `object-fit:cover` went onto
`.boost-one img` when that one landed. `cover` discards ~15% of the height. Do not remove
that guard; without it this plate is stretched, not cropped, which nobody reads as a bug.
The energy master is 1672×940 (1.779) and drops in untouched.

⚠️ **The subject is unchanged, and the objection to it is unchanged.** The gut plate is still
an anatomical cutaway on a page whose scene argues the reader is a figure and not a set of
organs — Venus is deliberately not a body-as-diagram. Recolouring made it a better-looking
cutaway. Raised, and **kept as his call**, exactly like the smart ring in the door plates.

## The phone's scene chrome was invisible for most of the scene — found and fixed 2026-08-12

Four changes, all in `/hormone-balancing/`. The first two are one root cause.

**`updateSide()` dressed its chrome by `seamX`, and a phone has no seam.** The `mobile`
branch raises the ground **whole** and never reads `seamX` — but `seamX` is still computed,
so both indicators flipped against a ground that had not moved. Measured on 390×844, worst
ratio per beat, against the 4.5 an 9.5–11px run needs:

| Element | Window | Was | Now |
|---|---|---|---|
| `.scene-phase` | p .38–.58 | **1.05** — ink on a still-dark stage | 4.11 at the crossover, ≥5.5 either side |
| `.scene-ctrl` | p .57 → end | **1.10** — fixed ivory on risen blush | **6.06** worst, 13.19 at the end |

⚠️ **Each half was correct for the case it was reasoned about.** The stylesheet says the
controls "sit bottom-LEFT, on the half that is dark for the whole scene" — true of the
desktop diptych, false below 760px where there is no diptych. This is trap 7 in the list
above arriving from the other direction: `--scene-fg` keyed to the *seam* is wrong when the
ground has no seam.

⚠️ **The controls do not take the colour lerp, and that is deliberate.** Halfway through the
dawn the ground is a mid grey (rgb 152,137,136 at p .60) and **no unbacked small text clears
4.5 on it** — ivory and ink are equidistant, so a lerp tops out at ~3.9 and is worst at its
own midpoint because the type itself goes mid grey. Measured that way: 3.59. So the controls
**snap** (`--ctrl-fg`, never a mid value) and the pill carries a dark tint under them until
the snap. The phase indicator keeps the lerp and the sliver — it is `aria-hidden` chrome at
11px and it has no ground of its own to stand on.
⚠️ The `760px` in the stylesheet must track the scene script's own `mobile` query. They are
two places now; if one moves the other must.

**The phase indicator leaves as `BHRT` arrives** (`.7 * (1 - ss(.80,.88,p))`). Both a
collision fix and an editorial one. Measured gap between the 104px title and the 11px
indicator, both pinned top-right, at p .90: 164px at 1920, 44px at 1440, **17px at 1280** —
a common laptop, where the payoff word and the decoration read as one cluster. They also say
the same thing at that moment: *04 — Support* is the small print of *BHRT*.

**`.boost-one h3 em` gained `margin-left:.3em`.** 05's titles are two halves and the `em`
carries the join, so the markup has no whitespace between them: it rendered
*"Hormone Therapy+ Gut Health"*, both rows, since the section was built.
⚠️ A margin, not a literal space — a trailing space collapses if the line ever wraps between
the halves, and the phone is the viewport where it would.

**Still open after this pass, and not touched** (all judgement calls, not defects):
- **The doors' titles are below the fold**, so 04 answers *"Where would you like to begin?"*
  with three wordless photographs until you scroll. That is the stated trade of the flat
  `92vh` — his call, recorded above — but it is the page's biggest comprehension cost and
  the one thing a first-time reader cannot resolve on their own.
- **05's two plates.** Both dark, and the file already says so; the gut render is clinical
  where the rest of the page is editorial, and the energy frame reads as stock tech.
- **The placeholder testimonials.** Still the biggest liability, per the note above, and the
  disclaimer that carries them is 13px italic in the bottom-left corner of the section.

## Five page-wide style directions — `?style=`, offered 2026-08-12, undecided

Not section layout: the same structure wearing five faces, mostly token overrides plus a
handful of selectors, so picking one is a subtraction and rejecting all five costs nothing.

| Style | What it does |
|---|---|
| `editorial` | Headlines much larger and tighter, the kicker's gold rule gone, sections separated by a hairline instead of a change of ground, square button |
| `gallery` | Type smaller, air doubled, images in a hairline frame, and **one ground throughout** — `--cream` becomes `--ivory`, retiring the alternation that measures 1.088:1 |
| `salon` | Grounds move toward the plates' own warmth, hairlines and kicker rules go gold, headline accent drops from the one red to burgundy |
| `clinical` | Playfair steps back and the functional face carries the headlines, nothing rounded, grid tightens. Authority rather than spa |
| `soft` | Lighter headline weight, leading opened out, everything rounded, the quote larger |

⚠️ **Two knowingly breach BRAND.md and say so at the point of change**: `gallery` replaces the
one button material; `salon` moves the grounds off their named tokens.

**Measured, not eyeballed: 102 runs across five styles × three sections, 0 skipped, all pass.**
Two things fell out of that sweep:

⚠️ **A palette variant silently revalues every colour standing on the ground it moved.**
`salon`'s kicker was `--gold-deep`, which is fine on ivory and lands at **3.97:1** on salon's
own warmer cream. It is `#7A5C2A` now — 4.90 on the cream, 5.47 on the ivory. Any sixth style
that touches a ground has the same problem waiting.

⚠️ **PRE-EXISTING BUG, FOUND BY THE SWEEP AND FIXED: 07's kicker was 15.5px.** `.faq-side p`
(0,1,1) outranks `.kicker` (0,1,0), and the kicker is a `<p>` inside `.faq-side` — so section
07's kicker has been rendering half again larger than every other kicker on the page since the
section was built. `:not(.kicker)` on that rule. **Nobody saw it in six rounds of looking at
screenshots; a harness reporting "16px kicker" caught it.**

⚠️ Also worth knowing for the next harness: `.faq-side p` matches the kicker, so a naive
selector measures the kicker twice and reports the description as failing. Two of the four
"failures" in the first sweep were that, not the page.

## 04's shape is decided — "arch", his pick 2026-08-12

The founders' note was that the boxy shape was not working — **the three services, not 05**.
Six treatments went up behind `?dshape=`; arch won and the other five and the switch are gone.

⚠️ **THE NOTE AND FULL BLEED WERE IN DIRECT CONFLICT, and that was the real decision.** Full
bleed means the rectangle *is* the viewport: the panel has no edges of its own, so there is
nothing to shape. The four treatments that read as properly un-boxy — arcade, portal, inset,
stagger — all got there by giving the panels ground to stand on, which means giving up the
edge-to-edge wall he had asked for two rounds earlier. **Arch is the only one that satisfies
both standing requests.** Only the top edge changes; the panels still touch and still reach
both edges, and the section ground shows through the spandrels between the heads.

`border-radius:50% 50% 0 0 / 20% 20% 0 0`. ⚠️ **Not a true semicircle** — on a 92vh panel a
half-round head is a dome, because the radius would be half the *width*. ⚠️ **`overflow:hidden`
is load-bearing**: the img is absolutely positioned to `inset:0` and scaled 1.02, so without it
it paints straight over the corner the radius just cut.

Contrast re-measured after the shape change: **18/18, tightest the BHRT hook at 5.01.**

⚠️ **05's `?shape=` is still live and still undecided** — "not this one yet". Six frames for the
booster pictures, on their own parameter so neither question moves the other.

## The Energy plate was replaced 2026-08-12

`images/energy.png` (his upload, `cd1a281`) → `images/boost/energy-lab-1340.{avif,webp}`. A
clinician with a tablet over a DNA helix, already in the brand's rose. 1920×1080, which is the
band aspect exactly, so it dropped in without a crop.

⚠️ **New filenames, not an overwrite** — BRAND.md's rule, so no cache can serve the pendulum.
The retired `energy-band-1340.*` and `energy-tall-941.*` are deleted, and 05's undecided arch
and tall shapes were repointed at a portrait crop of the new frame (`energy-lab-tall-781.*`,
anchored on the clinician rather than the centre) so nothing references a plate that is gone.

⚠️ **05's two plates are now both dark.** The pendulum was pale cream against the near-black
food plate, and that spread was the argument for bands over plates in the first place. The
argument still holds — the copy sits beside the picture, so there is still no scrim to tune —
but the pair no longer reads light-against-dark. If that contrast mattered, it is the thing
that was lost.

## 05 is decided — "bands", his pick 2026-08-12

Six treatments were built behind `?boost=` and judged on the real page. **He picked bands. The
other five and the switch that served them are deleted** — they all ran off one DOM precisely
so that choosing one would be a subtraction rather than a rewrite. Gone with them:
`.boost-star`, `.boost-lede`, `.boost-base`, the `image-set()` background block, the
`?boost=` parameter, and `images/boost/*-plate-941.*`.

**Photography for both programmes** (his upload, commit `d0ac46a`): a gold pendulum mid-swing
for Energy, a pomegranate-and-fennel plate on red marble for Gut Health. AI-generated, same
terms as the door plates — covered by [`LICENSES/AI-DoorPlates.txt`](LICENSES/AI-DoorPlates.txt).
Neither contains a person. Served from `images/boost/{gut,energy}-band-1340.{avif,webp}` as
proper `<picture>`, lazy, with `width`/`height` so the row reserves its height before the image
lands. Note the spread: the pendulum is **8.7KB** as AVIF because it is mostly a smooth
gradient, the marble **86KB**, from identical source dimensions.

⚠️ **THE COPY SITS BESIDE THE PICTURE, NEVER ON IT, AND THAT IS THE WHOLE REASON THIS WON.** The
two plates are at opposite ends of the tonal range — the pendulum pale cream, the food nearly
black. One scrim cannot serve both: tuned to hold ivory over the marble it bands visibly across
the pendulum's smooth gradient and takes the light out of the one photograph whose entire
quality is its light. **`?boost=plates` measured fine** — 12.56 to 17.80, both viewports — so
the case against it was design, not legibility, and it is recorded that way rather than the
easier way.

⚠️ **CONSEQUENCE WORTH KEEPING: THERE IS NO SCRIM IN 05 TO RE-MEASURE.** Swapping either
photograph is a `src` change and nothing else — unlike 04, where the rose hook has half a point
of margin and a new plate is a new measurement.

⚠️ **The rows mirror**, and both halves of the mirror move together — `grid-template-areas` and
the column ratio both swap, or the picture changes width between rows.

⚠️ **05 breaks at 700px, not the 980 the rest of the page uses, and that is a measurement.**
Stacked, each picture becomes the full column width and a 16:9 frame gains height as fast as it
gains width. At 980 that came to 1012px of photograph alone and the section hit **1899px —
taller than the same section on a phone**. Holding two columns to 700 brings it to 1117, and a
`max-width:520px` cap on the stacked picture stops the same inversion reappearing just below the
breakpoint (700px went 1560 → 1429; the phone at 390 never reaches the cap and is unchanged).

Section heights now: 1343 at 1440, 1254 at 1280, 1117 at 980, 972 at 760, 1429 stacked, 1256 on
a phone. It was 780 flat.

Also fixed along the way: `.boost-sub` broke before its last word and left "it." alone on line
two. `text-wrap:balance` rather than a wider `max-width`, which would only move the problem to
the next breakpoint.

⚠️ **Two measurement artefacts nearly went into this file as real failures**, and are worth
knowing for the next scrim: hiding `h2` does **not** hide `h2 em`, so an unhidden rose `em`
inside an ivory heading measures rose-against-rose and reads 1.00; and a pill button's bounding
rect includes corners outside its border-radius, so the worst 2% samples ground the text never
touches. **Hide the children too, and sample pill-shaped controls inset.**
- **The tonal cliff.** The scene ends on a two-tone diptych and the page drops into flat cream
  for five sections. Carrying burgundy plates with sculpture into the doors is most of the fix.

---

## On repo weight — raised, and the answer is "leave it"

`archive/` is **100 MB** (95 MB of it `archive/sources/`), 91 files tracked, mostly 6–8 MB
uncompressed PNG masters of the team hero. `.git` is a 105 MB pack because that history is in
it. A clone is ~220 MB.

**None of it reaches a visitor.** Vercel serves static files; nothing in `archive/` is
referenced by any page — the single grep hit is a comment in `index.html` naming the path.
Page weight is completely unaffected.

So the cost is clone and CI time, not performance. And the cheap fix does not work: deleting
the files now shrinks the working tree but **not** `.git`, because they are in history — that
needs a rewrite (`filter-repo`/BFG) which changes every commit hash.

**Recommendation: leave it alone.** It is doing exactly the job the README says it does —
source masters for re-crops — it costs nothing at runtime, and the only fix that would
actually shrink the repo is disruptive out of proportion to a slow clone.

---

## The QA harness is in the repo

`tools/qa/` — the CDN interception the last handover described in prose. `npm install
gsap@3.13.0 lenis@1.3.4 three@0.166.1 playwright@1.49.1`, then `node tools/qa/scene-shots.mjs`.

`?scene=<0..1>` freezes the stage; `window.__scene.p` reports where the story actually is;
`?layout=centre` selects the old scene; `?probe=1` swaps in the static fallback.

⚠️ Serve `three.module.js` as `text/javascript` or the import map rejects it.
⚠️ Placement is derived from `offsetWidth`, so anything that measures must wait on
`document.fonts.ready`. A mock written this session had the exact bug the real code guards
against, and laid its labels out to fallback metrics.

---

## Deploys

Pushing to `main` deploys via Vercel and **did** fire for these commits, despite the README's
note that it only deploys owner-authored commits. If a future push does not appear, that note
is the first thing to check — an empty commit from the owner account forces it.

---

## If you change the ten symptoms

Four lists are index-matched and must move together, or the page contradicts its own
animation:

1. `.scene-label` spans — release order, and they descend the body
2. `.scene-answer` spans — answer *i* lands in symptom *i*'s slot
3. `.scene-fallback` chips — no-JS and reduced-motion
4. `CFG` (centred) **and** `CFG_SIDE` (default) — two anchor tables, not one

Plus `rel()`'s spacing, which must keep ten cuts inside the release window, and the clearance
measurement at 390×844.
