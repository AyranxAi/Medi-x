# Peptide Therapy — `/peptide-therapy/` (first ship 2026-08-14)

A self-contained service page (one `index.html`, ~565 KB, zero build step), built from
`/hormone-balancing/` as its base: same embedded fonts, same header/nav/footer ports, same
CDN dependencies (GSAP 3.13 + ScrollTrigger + SplitText, Lenis 1.3.4, Three.js 0.166 for
the hero silk). If the CDNs are unreachable the page degrades to fully readable static
sections, exactly like its sister. Where a mechanism, measurement or rule is inherited
from the sister page, the comment at the site says so instead of restating the argument —
`../hormone-balancing/HANDOVER.md` and `../HANDOFF.md` remain the source for those.

## His brief (2026-08-14, verbatim intent)
One page: **Hero → What are peptides → Peptides animation → the peptide services →
testimonials → FAQ → Irina → footer**, "based on the aesthetics that we have" with the
Hormone Therapy page as the reference. The eight services come from the live site's
Peptide Therapy menu (his screenshot): Auto Immune Disease · Brain Health · Gut Health ·
Weight Management · Skin & Hair Loss · Musculoskeletal Injury · Anti Ageing · Sexual
Health — **names reproduced exactly, including spellings.**

## Page anatomy
1. **Hero** — "Peptide / *therapy*" over the sister page's Three.js silk shader,
   unchanged. Kicker "Peptide Therapy · Recovery, resilience, repair" (the approved
   pathway vocabulary from the landing page). Primary pill → `#book`; ghost →
   `#chain` ("How peptides work").
2. **03 · What are peptides?** (`#peptides`, dawn ground) — the sister page's caption
   segment grammar: h2, gloss, one two-line definition. Define, then show — it stands
   ABOVE the scene for the reason "What is BHRT?" does.
3. **The Chain** (`#chain`) — the peptides animation. A pinned 420vh scroll scene
   (320vh phones), pure function of pin progress. See below.
4. **04 · Eight places to begin** (`#services`, ivory) — the eight sub-services as a
   ruled editorial grid: Megante number + name, one line of NOW, hairlines, two columns
   (one on phones). No photography exists for these eight, so no photography is faked.
5. **06 · What came back first.** (dawn) — the one-voice-at-a-time carousel, ported.
   ⚠️ **THE QUOTES ARE PLACEHOLDERS** — written for this mock-up, flagged in the DOM.
6. **07 · FAQ** (ivory) — six questions in the accordion. ⚠️ **DRAFT COPY, NOT HIS** —
   unlike the sister FAQ (his answers verbatim), these were written for the mock-up in
   his register. Regulated medical copy: route through him before real marketing.
7. **08 · Call strip** (`#book`, ivory, hairlined) — Irina's circle, one line, one pill
   ("Book a discovery call"), structurally identical to the sister strip.
8. **Header + footer** — verbatim ports, WhatsApp prefill retargeted to peptide therapy.

**Grounds:** dawn(03) → scene(ink → dawn) → ivory(04) → dawn(06) → ivory(07) →
ivory(08, hairlines load-bearing) → cream(footer). This page has no booster chapter, so
the warm note the sister page gives 05 moved to the stories — that is why 06 is dawn here
and 07 is ivory (both swaps carry comments at the rules).

## The Chain — the peptides animation
The story is **assembly**, in four acts, and the beat order is the argument
(recognition → the decline NAMED → the therapy → assembly → payoff):
- **Act 1 (0–.33)** — 26 amino-acid beads drift scattered, dim rose-stone on the ink
  stage. The raw material was never the problem. The gold beat names the decline:
  "With age, fewer messages get written."
- **Act 2 (.34–.68)** — "So we help your body write them again." The beads link ONE BY
  ONE, head to tail (the order a ribosome writes one), each flying to a loose golden
  wave. The written spine is stroked as the smooth sampled curve it lies on — NOT
  bead-to-bead chords, which render as a zig-zag (caught on the render and fixed); the
  one bead currently flying home gets a straight "reach" chord that the curve absorbs.
- **Act 3 (.60–.78)** — the finished chain winds into a helix (1.25 → 3.1 turns,
  amplitude narrowing): a peptide folding into an alpha helix — the brand's own render
  and the chemistry agree. z = cos(angle) lights and sizes near passes only once the
  coil arrives, so it reads as ONE strand in the round, not two strands faking DNA.
  From .70 a light pulse travels the chain — the instruction in transit.
- **Act 4 (.79–1)** — the dawn (.790–.835, fast crossing, radial source at the chain's
  heart — both sister findings, inherited), then "Peptides" in Megante lands dead
  centre while the helix dims to 38% behind it: the word through the figure, the way
  the ring stands through the helix in the approved renders.

Engine rules inherited whole, each commented at its site: the **latch** (progress
high-water-marks — "the message stays written"; seeking is the one thing allowed to
lower it, with the 1.4s timeout), controls that **move the page, never the progress
variable**, the glass-material pills whose colour **snaps** ivory→ink mid-dawn, beats
with fixed polarity and a copy-free window around the dawn, `?scene=<0..1>` solo QA and
`?probe=1` static QA, and the reduced-motion/no-JS fallback (01 · The idea + 02 · The
therapy, same vocabulary as the scene).

Departures from the sister scene, deliberate:
- **The scatter is seeded, not `Math.random()`** — the pure-function rule extended to
  geometry, so Replay rebuilds the exact chain the reader saw.
- **Hint → controls is SEQUENTIAL, not a cross-fade** — a frozen frame inside the
  sister's cross-fade shows two half-lit labels stacked (caught at `?scene=.06`).
  The hint is fully out (.072) before the pill fades in (.080).
- **No `?play=hybrid`,** no side layout, no phase indicator — none of their problems
  exist on a symmetric, shorter track.

## Wiring done with this ship
- Landing page menu "Peptide Therapy" → `peptide-therapy/` (relative, `target` off) and
  the pathway 03 CTA likewise — both were pointing at the WordPress site.
- Sister page menu "Peptide Therapy" → `../peptide-therapy/`.
- This page's own menu: self-link `./`; "Hormone Therapy" → `../hormone-balancing/`.

## What is deliberately unfinished / needs his sign-off
- **Every block of copy on this page is draft** — hero sub, definition, beats, the
  eight service descriptions, FAQ answers, `<title>` + meta description. Written in his
  register, but nothing here is his signed-off copy yet. The DOM comments mark the two
  clinical surfaces (FAQ, service lines) explicitly.
- **Testimonials are placeholders** (see the DOM warning above the rail).
- **The eight service rows route nowhere** — no red pill, no inert Explore ×8. When
  the service pages exist, each row takes one `.link-arrow` (lift it from the sister
  page; this stylesheet deliberately doesn't carry it unused).
- **Booking CTAs are mock** (`data-book` prevents default), same as the sister page.

## QA record (2026-08-14, headless Chromium 1440×900 + 390×844)
`?probe=1` both widths, `?scene=` at .06/.28/.42/.55/.68/.76/.82/.90/.97 desktop and
.28/.55/.76/.97 phone, plus the live page (preloader → hero, and pin engaged mid-track):
zero console errors, `scrollWidth` exactly 1440/390 at every stop, `window.__scene.p`
reports the drawn progress. The three CDN scripts are blocked by egress policy in the QA
environment; the same versions were installed from npm and served by request
interception — nothing about that shipped (the page still loads from jsDelivr).
