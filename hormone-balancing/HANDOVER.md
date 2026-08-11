# Hormone Balancing & BHRT — `/hormone-balancing/` (shipped 2026-08-10, four refinement rounds same day)

> **Where this stands.** Four rounds after the first ship, all driven by his notes on the
> live page. In order: (1) the symptoms became two-word plate annotations and the phone
> started using its sides; (2) the copy transitions were rebuilt after five of nine beats
> turned out never to reach full opacity and the dawn was printing text at 1.42:1;
> (3) `?play=hybrid`; (4) the figure he assembled himself in a live control room — bigger
> body, four glands, an inner glow, a growing grain, a blush dawn with a light source, and
> eight two-word reversals replacing the four floating sentences.
> The figure's *material* is still the shipped particle system and still provisional; the
> statue / point-cloud question is open. See **The figure, and the 3D question**.

A self-contained service page (one `index.html`, ~535 KB, zero build step): brand fonts
(Playfair var / MediGyn NOW / Megante) and both logo colourways are base64-embedded; the only
network dependencies are the animation CDNs (GSAP 3.13 + ScrollTrigger + SplitText, Lenis
1.3.4, Three.js 0.166 module). If the CDNs are unreachable the page degrades to fully
readable static sections.

## Page anatomy
1. **Hero** — "A new *zest* for living." over a Three.js silk shader (hope first — his call;
   the scene below earns it).
2. **Marquee** — Megante, the good-things words.
3. **The Signals scene** (`#signals`) — the heart of the page. A pinned scroll story
   (600vh desktop / 460vh phones): a soft particle silhouette tethered to 8 symptom labels.
   Acts at exact scrub fractions: Recognition 0–.42 → Signals .42–.56 (gold pulses
   label→body, drift stills) → Release .56–.78 (tethers cut ONE BY ONE, label sighs upward,
   figure brightens one step per cut) → Support .78–1 (dawn arrives AFTER full ignition,
   then eight two-word reversals land in the symptoms' own slots, "Meet BHRT."). Word-blooms
   on *this* / *differ* / *yourself* (`.w` spans). Phase indicator top-right, "Scroll to
   listen" hint.
4. **BHRT explainer** (cream) → **Consultations** (3 services, "do you still feel…" hooks)
   → **Boosters** (2 programs) → **Stories** (placeholder testimonials, labelled as such —
   replace with real voices before real marketing) → **FAQ** → **final CTA**.
5. **Header + footer** are verbatim ports of this repo's landing bar and footer (same
   classes, same behaviours, same overlay menu destinations).

## The Signals scene layout (rebuilt 2026-08-10, second round)

**The eight words**, in DOM order — which is also the release order and the order they
descend the body: `3am again · Brain fog · Hot flashes · Mood swings · No energy ·
Weight gain · Erratic cycles · Low libido`. The `.scene-fallback` chips carry the same
eight, same order. ⚠️ Re-ordering breaks two things at once: `rel(i)` cuts the tethers in
DOM order, and the slots run head→pelvis, so a swap makes tethers cross.

**Round 4 — the scene as it now stands (his settings, chosen in a live preview).**
- Figure `min(H*.73, 700)` from `H*.24` — 657px at 1440×900, 700px above. It was
  `min(H*.60, 540)`, and on anything taller than 900px the **540 ceiling** was the binding
  term, not the fraction: a 1440px-tall monitor still got 540px. That is the whole reason
  it read small on a desktop.
- Grain count 1.5× desktop (3900), 2600 on phones — the glow and the nodes are two more
  alpha layers over the same pixels and a mid-range phone pays for all three.
- **Grain grows .50 → 1.20 across the scroll.** His idea. It reads as the body gathering
  itself, and it puts the largest grain exactly where the risen ground would wash it out.
- **Four glands on the midline** + the axis between them, with a signal travelling it.
  Eight scattered nodes read as a diagram; four read as a spine of light.
- **Layer order is load-bearing:** inner glow UNDER the grain, nodes OVER it. A glow
  painted over the grain hazes it back into fog.
- **The dawn no longer resolves to ivory** — ivory is what the rest of the page already is,
  so the payoff of a six-screen scroll landed on wallpaper. It rises to blush (`#F6E7E1`)
  off a deeper plum (`#2A1B20`), and the last of the light is a **radial bloom centred on
  his chest**, not a flat fill, so he reads as causing the morning. `P_GLOW` reverts it.
- **Eight two-word reversals** replaced the four ✦ sentences, each landing in its own
  symptom's slot. ⚠️ The two lists are index-matched — re-order one and you must re-order
  the other. Cost: the one italic in the old fourth sentence. Every other emphasis is
  untouched (`this` / `differ` / `yourself` blooms, the three `just …` italics, the gold line).
- Headline 1.16×, ceiling 13% → 9.5%.

**Slots hang off the figure, not the viewport.** `CFG` is now
`[side, slotY (fraction of figure height), anchorX, anchorY]`. Side is strictly
L,R,L,R… and the anchor is always on the *same* side as its slot, so no tether crosses
the body.
- **Desktop:** offset from centre is capped at `figH*.66`, so the plate composes
  identically at 1440/1920/2560 (measured body clearance 169–216px at all three). The old
  viewport fractions parked words ~900px from the body on a 32" monitor.
- **Phones:** each word is pinned flush to its own screen edge (`EDGE` 16px), which is
  the maximum room a 390px viewport has, and leaves the middle to the body. Horizontal
  drift is switched off on phones — a pinned word that wanders sideways clips or collides.

**The pill is gone.** At 34px it read as a button; eight buttons around a body read as an
interface. Bare Megante + a hairline + a ring terminal is the anatomical-plate language.
The tether now stops at the word's inner edge (`halfW + TERM_GAP`), because there's no
frosted ground left to hide the last stretch of line under.

**Sizes.** Desktop `clamp(21px,2.35vw,34px)`; phones `clamp(16px,4.6vw,20px)`. The phone
clamp is solved, not chosen: a pinned label leaves `W/2 − EDGE − width − (silhouette
half-width, .139·figH at the arms)`, and the widest word ("Mood swings", wider than
"Erratic cycles" in this face) runs ~6.3× the font size. That yields ~4.6vw.

**The phone figure is derived:** `min(H*.48, 380, H − H*.30 − 40)`. The third term used to
reserve 150px below him for the four ✦ sentences, which were too wide to flank a body at
390px; the reversals use the side slots instead, so that reserve is gone.
⚠️ **Dropping it bought nothing, and this is worth knowing before anyone tries again.** The
binding term on a phone is the **380 cap**, not the reserve — and 380 is itself a trade
against label width, because figure width scales with height (`.139·figH` at the arms) and
every px of body squeezes the word pinned beside it. At 470px the widest label has ~1px of
clearance. So the empty band at the bottom of a phone is structurally hard to reclaim with
a centred body and side labels. The honest fix, if it ever matters: put the eight reversals
in that band as a 2×4 grid on phones only, and leave the side slots to desktop.

**Playback.** Default is scroll-scrubbed. `?play=hybrid` adds a floor: after .6s of
stillness the story creeps forward on its own, capped at `lead` ahead of where the reader
actually scrolled — it finishes the sentence you paused inside, then waits, and can never
reach the end without you. Full autoplay was rejected because the stage is pinned for
600vh: a story that finishes by itself leaves the reader locked in a viewport still owing
six screens of scrolling. Both numbers are URL-readable while the right feel is found:
`?play=hybrid&creep=0.04&lead=0.16`. `.014/s` was measurably too subtle to notice.

**Measured clearances** (`?scene=0.35`, label edge → silhouette edge at that label's own
height): 360×640 ≥ 17px, 390×844 ≥ 10px, 430×932 ≥ 21px, desktop ≥ 169px.
⚠️ **10px on "Mood swings" at 390×844 is the tightest point on the page** — it's the widest
word sitting at the widest part of the body (chest + arm) on the commonest phone width.
It clears, but it's the first thing that breaks if anyone grows the type, widens the
figure, or lengthens that word.

## The scene engine (all inside the last two `<script>` blocks)
- Everything is a **pure function of pin progress + time** — scrubbing is deterministic.
- **Scroll-up latch** (his ask): progress high-water-marks; once a tether is cut it never
  re-attaches on scroll-up. Per page load.
- **Figure**: capsule skeleton in relaxed contrapposto, rendered as a soft undefined
  silhouette; particles are allocated per capsule and **stream toward head/heart**
  (`posOf()` + `flowT`), slowing while "being heard", turning gold cut by cut.
- Fallback: `prefers-reduced-motion`, no-JS, or `?probe=1` swaps the scene for static
  sections (`.scene-fallback`).

## QA switches
- `?probe=1` — static layout QA (no Lenis, no preloader, scene replaced by fallback).
- `?scene=<0..1>` — solo stage frozen at that progress (e.g. `?scene=0.65` = mid-release).

## Decisions ledger (who called what)
- Hero copy "A new zest for living", Megante-for-Cormorant, one-by-one release, answers
  AFTER release, scroll-up latch, header/footer port, 45-min line removal: **his calls**.
- Beats/timing, rim-light experiment (rejected), contrapposto skeleton, inner-current
  particles, dawn-after-ignition: built by Claude, approved by him in rounds.
- ⚠️ **PROVISIONAL — the figure.** Shipped on his "okay *for now*" (2026-08-10). The soft
  streaming silhouette is not a final taste sign-off. Revisit before calling this page done;
  the alternative he floated was a classical-statue-sampled particle figure.
  **Untouched in the refinement round** — only the labels around it and its size/position
  changed. See below.
- Two-word symptoms, bigger labels, phones using their sides: **his calls, 2026-08-10**,
  after seeing the page live. Everything under *The Signals scene layout* is the build.
- Dropping the label pill, the ring terminal at the word's edge, figure-relative slots,
  the derived phone figure height: built by Claude to serve those two calls — **not yet
  seen by him.** The pill is a documented one-line revert if he wants it back.

## The figure, and the 3D question

He raised it in the same breath as the phone note: *"later on the day we might entertain
the idea of a 3d model out there."* Nothing was built. The considered position, so the
next session doesn't start from zero:

- **The layout work above is a prerequisite either way.** Slots, anchors and clearances
  are expressed against `figH`/`figTop` and the silhouette's half-width — swapping what
  draws the body doesn't invalidate any of it, as long as the replacement reports a
  height and a width profile. Do the figure after this, not instead of it.
- **Three.js is already loaded** for the hero silk shader (`three@0.166.1`, import map at
  the bottom of the file). A 3D figure costs no new dependency — but it does cost the
  page's "one self-contained file, no build step" property the moment it needs a `.glb`,
  which is the real decision, not the rendering.
- **The honest risk:** the current figure's weakness is that it's *vague*, and a literal
  3D body solves vagueness by becoming a person — which brings gender, age, race and body
  type into a page that currently, deliberately, addresses everyone (women and men, BHRT
  and TRT). The statue-sampled-particles idea he floated earlier threads that needle
  better than a rendered human: classical marble reads as *figure*, not as *a customer*.
- **Cheapest next step if he wants to see it:** sample point positions off a
  public-domain statue scan into the existing particle buckets. `posOf()` and the capsule
  allocator are the only things that change; every beat, tether, anchor and clearance
  above survives, because the anchors are figure-space fractions.
- ⚠️ Anchors in `CFG` are hand-placed just inside the *current* silhouette. A new body
  means re-checking those eight points — and re-running the clearance measurement, since
  a wider chest eats the 10px at 390×844 first.
- Nav wiring: the landing menu's "Hormone Therapy" now points here (relative href,
  mirror-safe, `target="_blank"` removed for this one item — documented inline in
  `../index.html`).

## Traps for the next session
- **Label width is the binding constraint on phones, and it is measured at runtime.**
  `build()` reads `offsetWidth` and placement is derived from it, so `document.fonts.ready`
  re-runs `build()` — remove that and every label lays out to fallback-font metrics and
  sits wrong for the whole session. Any new symptom word must be re-measured, not eyeballed.
- The scene beat named class `reveal` exists because `.final` (the CTA section) collides
  with any beat classed `final` — don't rename it back.
- The ✦ answers are the one thing that still stacks vertically on phones. That is
  deliberate: they're sentences, they arrive as a group, and a centred stack reads as a
  small poem where eight stacked *symptoms* read as a list. Don't "fix" it to match the
  symptoms without shortening the answer copy first.
- Booking CTAs are mock (`data-book` prevents default). Wire real booking before any
  paid-traffic use.

## QA harness used for the refinement (not in the repo)
`?scene=<0..1>` was driven headlessly in Chromium at 360/390/430/820/1280/1440/1920/2560,
measuring each label's rect against the true silhouette half-width solved from the `CAPS`
table (a constant width lies — it calls the head as wide as the shoulders). The real
pinned scroll, `?probe=1` and `prefers-reduced-motion` were each walked end to end.
⚠️ The three CDN scripts are blocked by egress policy in that environment; the same
versions were installed from npm and served by request interception. Nothing about that
shipped — the page still loads GSAP/Lenis/Three from jsDelivr.
