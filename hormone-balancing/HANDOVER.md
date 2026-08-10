# Hormone Balancing & BHRT — `/hormone-balancing/` (shipped 2026-08-10)

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
   the ✦ answers ring him and stay, "Meet BHRT."). Word-blooms on *this* / *differ* /
   *yourself* (`.w` spans). Phase indicator top-right, "Scroll to listen" hint.
4. **BHRT explainer** (cream) → **Consultations** (3 services, "do you still feel…" hooks)
   → **Boosters** (2 programs) → **Stories** (placeholder testimonials, labelled as such —
   replace with real voices before real marketing) → **FAQ** → **final CTA**.
5. **Header + footer** are verbatim ports of this repo's landing bar and footer (same
   classes, same behaviours, same overlay menu destinations).

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
- Nav wiring: the landing menu's "Hormone Therapy" now points here (relative href,
  mirror-safe, `target="_blank"` removed for this one item — documented inline in
  `../index.html`).

## Traps for the next session
- The label pills are Megante and WIDE — on phones they render as centered rows above and
  below the figure; slot fractions live in `CFG` (mobile branch). Don't re-scatter them at
  375px, they collide.
- The scene beat named class `reveal` exists because `.final` (the CTA section) collides
  with any beat classed `final` — don't rename it back.
- Booking CTAs are mock (`data-book` prevents default). Wire real booking before any
  paid-traffic use.
