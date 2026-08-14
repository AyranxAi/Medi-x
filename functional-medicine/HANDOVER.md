# Functional Medicine — `/functional-medicine/` (first ship 2026-08-14)

A self-contained service page (one `index.html`, ~620 KB, zero build step), built from
`/peptide-therapy/` as its base — which was itself built from `/hormone-balancing/` — so it
carries the whole family line: same embedded fonts, same header/nav/footer ports, same CDN
dependencies (GSAP 3.13 + ScrollTrigger + SplitText, Lenis 1.3.4, Three.js 0.166 for the
hero silk). If the CDNs are unreachable the page degrades to fully readable static
sections, exactly like its sisters. Where a mechanism, measurement or rule is inherited,
the comment at the site says so instead of restating the argument —
`../peptide-therapy/HANDOVER.md`, `../hormone-balancing/HANDOVER.md` and `../HANDOFF.md`
remain the source for those. Comments inside the file that say "the sister page" came with
the material they annotate: read hormone-balancing for scene-engine findings, the peptide
page for tile/popup/doctor findings.

## His brief (2026-08-14, verbatim intent)
Off the peptide remake ("good job… that's outstanding we need one for functional
medicine"): one page, **Hero → What is functional medicine → the animation → the
functional medicine services → doctors → testimonials → FAQ → Irina → footer**, "based on
the aesthetics that we have", with the peptide page and Hormone Therapy as the references.
The eight services come from the live site's Functional Medicine menu (his screenshot):
**Skin · PCOS · Weight-Loss · Gut Health · Endometriosis · Neurotransmitters ·
Testosterone Top Up · Functional General** — names reproduced exactly, including the
"Weight-Loss" hyphen.

## Page anatomy
1. **Hero** — "Functional / *medicine*" over the sisters' Three.js silk shader, unchanged.
   Kicker "Functional Medicine · Root causes, found and treated" — the tail is the landing
   page's own approved line for this pathway (`pw2.short`), not new copy. Primary pill →
   `#book`; ghost → `#roots` ("How we find the cause").
2. **03 · What is functional medicine?** (`#functional`, dawn) — the segment grammar:
   h2, gloss ("The cause, not the symptom"), one two-line definition. Define, then show.
3. **The Roots** (`#roots`) — the scroll scene. A pinned 420vh track (320vh phones),
   pure function of pin progress. See below.
4. **04 · Eight ways in** (`#services`, ivory) — the eight sub-services as tiles that open
   the one dialog shell (#pxd), each with draft popup copy, goal chips, and **Book a
   consultation → the doctor chooser**, all inherited working from the base page.
5. **05 · The doctors** (dawn) — **a verbatim port**: Dr. Andrey Komissarov and Dr. Eslam
   Yakout, whose client-copy bios are already functional-medicine bios (Komissarov is
   "Internal, Integrative & Functional Medicine"; Yakout is "Functional and Regenerative
   Medicine Doctor" — the section did not need different people, it needed this page).
   Cards, (i) popups, baked head crops, sizeFaces() — untouched. The chooser's intro line
   now reads "Both consult on functional medicine."
6. **06 · When the cause was found.** (ivory) — the one-voice-at-a-time carousel.
   ⚠️ **THE QUOTES ARE PLACEHOLDERS** — written for this mock-up; attributions name real
   services from section 04 so a future filter can read them.
7. **07 · FAQ** (dawn) — six questions in the accordion. ⚠️ **DRAFT COPY, NOT HIS** —
   written for the mock-up in his register. Regulated medical copy: route through him.
8. **08 · Call strip** (`#book`, ivory, hairlined) + **header/footer** — verbatim ports,
   WhatsApp prefill retargeted to functional medicine (header and footer both).

**Grounds:** the sister sequence exactly — dawn(03) → scene(ink → dawn) → ivory(04) →
dawn(05) → ivory(06) → dawn(07) → ivory(08, hairlines load-bearing) → cream(footer).

## The Roots — the scene
The story is **tracing**, and the beat order is the argument (recognition → the relapse
NAMED → the turn → tracing → the roots → payoff):
- **Act 1 (0–.33)** — fourteen symptom flares drift and BLINK across the upper field
  (the blink is the symptom speaking), dim rose-stone on the ink stage. Under the gold
  beat ("Because symptoms are messages — and nobody asked what was sending them") five
  of them visibly dim and return — treated, and back. The dip windows are pure
  functions of p, staggered inside .235–.325.
- **Act 2 (.345–.66)** — the tracing. One thread leaves each flare and follows it DOWN
  (each thread is a cubic bézier that drops vertical, then feeds sideways into its
  root — four rivers finding their mouths). One at a time, left to right; a bright
  tracer rides each thread's writing end. **14 into 4, never 1:1** — many symptoms,
  few causes IS the figure. Roots do not exist on stage until their first thread
  arrives: a cause is not drawn until it is found.
- **Act 3 (.62–.78)** — the roots light in thread order, and from .70 the light comes
  back UP every thread. ⚠️ **THE CALM IS CAUSAL AND THE ORDER IS LOAD-BEARING**: the
  flares settle (blink dies, colour goes gold, drift all but stops) only per-flare
  from .695, behind the returning light — the figure must never show a symptom going
  quiet before its root is treated, because that is the exact claim the page argues
  against.
- **Act 4 (.79–1)** — the dawn (.790–.835, fast crossing, radial source at 50%/74% —
  the roots' own heart), the map dims to 38%, and "Functional / medicine" lands dead
  centre — **two lines, and the `<br>` is load-bearing**: at 96px nowrap the pair is
  ~940px and cannot fit a phone, so `.scene-title` breaks to two centred lines at
  1.04 leading (Megante's tails touch at 1) and the clamp eases to 40/6.4vw/88.

Engine rules inherited whole, each commented at its site: the **latch** ("a cause, once
found, stays found"; seeking is the one thing allowed to lower it, 1.4s timeout),
controls that **move the page, never the progress variable**, glass pills whose colour
**snaps** ivory→ink mid-dawn, beats with fixed polarity and a copy-free window around
the dawn (SCHED windows verbatim from the base page), the seeded scatter (no
`Math.random()` — Replay rebuilds the exact map), sequential hint→controls, `?scene=`
solo QA, `?probe=1` static QA, and the reduced-motion/no-JS fallback (01 · The idea +
02 · The method, rewritten in this page's vocabulary).

## Wiring done with this ship
- Landing page menu "Functional Medicine" → `functional-medicine/` (relative, `target`
  off) and the pathway 02 "Explore pathway" CTA likewise — both were pointing at the
  WordPress site. Same rule and comment shape as the peptide wiring the day before.
- Hormone page menu → `../functional-medicine/`; peptide page menu likewise.
- This page's own menu: self-link `./`; both sisters relative.

## What is deliberately unfinished / needs his sign-off
- **Every block of copy on this page is draft** — hero sub, definition, beats, the eight
  tile teasers and popups, FAQ answers, `<title>` + meta description. Written in his
  register; nothing is signed off. No tests, compounds or protocols are named on
  purpose. The doctors' bios are the one exception — client copy, ported verbatim.
- **Testimonials are placeholders** (see the DOM warning above the rail).
- **The eight tiles route nowhere** beyond their popups — when the service pages exist,
  each takes one `.link-arrow` (lift it from the hormone page).
- **Booking CTAs are mock** (`data-book`), same as both sisters. The chooser's two
  Select pills are one per-doctor deep link each away from real.
- ⚠️ **THE 360px FOOTER OVERFLOW NOW EXISTS ON FOUR PAGES.** Inherited knowingly with
  the true-copy footer (`.f-news{width:22rem}` — the peptide HANDOVER documents it).
  The fix is still one commit across all four files at once:
  `.f-news{width:min(22rem,100%)}` plus `min-width:0` on the grid items.

## QA record (2026-08-14, headless Chromium 1440×900 + 390×844)
`?probe=1` both widths, `?scene=` at .06/.28/.42/.55/.68/.76/.82/.90/.97 desktop and
.28/.55/.76/.97 phone, plus the live page (preloader → hero, pin engaged mid-track, and
the full popup walk: tile → panel → chooser (kicker "Skin · Book a consultation", both
faces loaded) → Select (asserted inert, dialog open) → Back (returns to the service) →
Esc): zero console errors, `scrollWidth` exactly 1440/390 at every stop, `window.__scene.p`
reports the drawn progress, all four repo pages re-loaded clean after the menu wiring.
The three CDN scripts are blocked by egress policy in the QA environment; the same
versions were installed from npm and served by request interception — nothing about
that shipped (the page still loads from jsDelivr).
