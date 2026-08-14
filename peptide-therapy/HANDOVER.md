# Peptide Therapy — `/peptide-therapy/` (first ship 2026-08-14)

> ## ROUND 4 — SAME DAY: the portraits land · the eight book a CONSULTATION, through a doctor chooser
>
> **1 · THE PORTRAITS ARE IN.** He uploaded them to `images/` as
> `Dr-V-3-1024x1024.webp` and `Dr.-Eslam-Yakout-new.webp`; both were moved (git mv,
> content untouched) to the names round 3 wired:
> `images/doctors/dr-andrey-komissarov-square.webp` (1024²) and
> `images/doctors/dr-eslam-yakout-square.webp` (700²). Both are square, so
> `object-fit:cover` crops nothing. Verified loading in card, bio popup and chooser.
> ⚠️ The monogram fallback stays in the code — it is the guard for a future rename,
> not scaffolding. It simply never fires now.
>
> **2 · THE EIGHT NOW BOOK A CONSULTATION, VIA A DOCTOR CHOOSER — his call**
> ("for the 8 cards its not book discovery call its book a consultation and pop up
> to choose either of the 2 doctors"). Each service popup's pill reads **Book a
> consultation** and is a `<button data-choose>`, not a link: it swaps the panel's
> content for the chooser **in the same shell**, so the reader never loses the
> service — the chooser's kicker reads e.g. "MUSCULOSKELETAL INJURY · BOOK A
> CONSULTATION", and **← Back** restores the detail without re-running the dialog's
> entrance. Two rows, portrait + name + specialization + one Select pill, in the
> section's order (Komissarov, Yakout — matches his booking screen).
> ⚠️ **THE SELECT PILLS ARE MOCK** (`data-book`), like every booking control on both
> pages. His booking system already lists these two at AED 1150 / 1h, so wiring is
> one per-doctor deep link each — not a form.
> ⚠️ **THE MOCK-BOOKING GUARD IS DELEGATED ON THE SHELL, and it has to be**: the
> page-load loop over `[data-book]` cannot bind controls cloned out of a `<template>`
> later, so without delegation Select would follow `href="#"` and throw the reader to
> the top of the document with the dialog still open. Verified by script.
> ⚠️ **THE DOCTOR CARDS' OWN PILLS STILL POINT AT `#book`** — unchanged, because that
> is the page's existing convention for "Book a consultation" (the hero's does too).
> Flagged to him rather than changed: if a doctor's own pill should book THAT doctor
> directly, it is one attribute per card.
>
> QA re-run whole after both: clean at 1440×900 and 390×844; the flow is walked by
> script — tile → popup (CTA text asserted) → chooser (kicker, two rows, both faces
> loaded) → Select (asserted inert, dialog still open) → Back (returns to the right
> service) → Esc (closes).
> ⚠️ One harness bug fixed in passing, worth knowing: lazy portraits report
> `complete === true` a frame or two BEFORE they paint, so the doctors screenshot was
> photographing an empty band while the page was correct. The harness now settles
> 1.2s after scrolling the section into view. The page never had the defect.

> ## ROUND 3 — SAME DAY: the doctors arrive · the DNA variant is deleted
>
> **1 · 05 · THE DOCTORS (`#doctors`)** — his call: Dr. Andrey Komissarov and
> Dr. Eslam Yakout, each a centred card (portrait band → Megante name → specialization
> → red "Book a consultation" pill) with a glass (i) on the portrait corner that opens
> the SHARED dialog shell (#pxd) carrying the full bio, ×-closed, pill at the foot.
> Two red pills in one viewport is his call and deliberately overrides the sister
> page's one-pill rule — recorded at `.docs` so it is not "fixed" in passing.
> ⚠️ **THE BIOS ARE CLIENT COPY** (medi-gyn.com doctor pages), reproduced verbatim
> with three recorded typographic corrections — unlike the tiles' draft copy.
> ⚠️ **THE PORTRAIT FILES ARE NOT IN THE REPO.** He supplied them in conversation;
> this environment cannot reach medi-gyn.com to fetch them. Cards are wired to
> `images/doctors/dr-andrey-komissarov-square.webp` and
> `images/doctors/dr-eslam-yakout-square.webp`; until those exact files exist the
> script flips each card to a Megante monogram band (AK / EY) on the gold tint —
> deliberate, not a bug — and strips the portrait from the popup. Landing the two
> files is a plain file drop; no markup changes.
> ⚠️ The ground sequence is the sister page's again: dawn(03) → ivory(04) →
> dawn(05 doctors) → ivory(06) → dawn(07) → ivory(08) — the round-2 stories/FAQ
> swaps are reverted with the section that made them necessary.
>
> **2 · `?figure=dna` IS DELETED — his call** ("remove dna figure lets stick with
> your brilliant one"), decided on the rendered A/B. The single chain is the figure.
> The flag, the ghost strand and the rungs went whole; `git revert` this commit to
> resurrect them.
>
> QA re-run whole: clean at both widths; doctors verified — fallback engages on both
> cards, the (i) opens the shell, the missing face is stripped from the panel, × closes.

> ## ROUND 2 — SAME DAY ("Honestly this is beautiful"), two changes
>
> **1 · The eight services are TILES THAT OPEN A POPUP — his call** ("having the 8 as
> tiles and if they click it there will be like a pop up"). The ruled rows below are
> replaced: cards in the boost-card material (ivory fill, hairline, 2px radius, gold
> hover + lift), each carrying a circled + in the FAQ indicator's language. The whole
> tile is the hit area via a stretched `<button>` (`.px-open::after` — the sister
> doors' trick), so the h3 stays valid HTML and a keyboard still finds one real
> button per tile. The popup is ONE dialog shell (`#pxd`) fed from each tile's own
> `<template>` — tile and panel can never disagree. Esc/scrim close, Lenis stops
> while open (the menu's rule), focus returns to the opening tile, and the panel's
> red pill closes first, then scrolls to `#book`. Grid: 4 → 2 → 1 columns at
> 1104/640. ⚠️ **The popup paragraphs and goal chips are DRAFT COPY** — no peptide
> compounds are named on purpose; route through him before real marketing.
>
> **2 · `?figure=dna` — his "string or dna?" question, answered as a switch.** The
> shipped figure stays the single chain (the argument is in *The Chain* below: a
> peptide IS a chain, the coil IS its alpha helix, and DNA is a different molecule).
> But the brand's approved renders lean double-helix, so the DNA reading is one
> query away instead of one debate away: with the flag a second ghost strand rises
> WITH the coil (phase +π) and twenty rungs ladder the two. The assembly acts are
> identical under both — only the payoff figure changes. Compare at
> `/peptide-therapy/?figure=dna` (or `?scene=0.97&figure=dna` for the frozen frame),
> then delete the loser — it is one gated block in `draw()` plus one flag.
>
> The QA record below was re-run whole after both changes: still zero console
> errors, still no overflow at any stop, popup verified open/Esc-close with focus
> landing on the panel at 1440×900 and 390×844.

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
