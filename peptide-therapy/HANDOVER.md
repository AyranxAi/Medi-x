# Peptide Therapy — `/peptide-therapy/` (first ship 2026-08-14)

> ## ROUND 7 — 2026-08-15: the silk becomes glass, and the glass sets the temperature
> for the whole site
>
> **1 · THE HERO GROUND IS NOW "AERO" IN THE GLACIER GRADE — his pick, off a
> fourteen-plate audition.** The sister silk shader is replaced in place (same canvas
> `#silk`, same uniforms, same Three.js plumbing — one fragmentShader paste): liquid-glass
> orbs over a bright white dish, each orb truly lensing the ground behind it, frosted in
> the far layer, crisp and rising in the near one, colour-locked to silver/white/graphite.
> The glacier temperature is ONE multiply (`#F3F7FB`) at the foot of `main()` — exactly
> how the audition lab's grade layer produced the look he judged, so what shipped is what
> he saw. His decision trail, verbatim: clouds → "moving molecules, whitish" → "B and C
> but no yellow" → "luxurious, scientific, proper lighting, 3D" → "Vista / iOS-26
> transparency" → "the gold doesn't feel right" → **"glacier K"**.
>
> **2 · THE AUDITION LAB IS A KEPT ARTIFACT, NOT SCAFFOLDING.**
> `peptide-therapy/hero-lab.html` (in this repo, fonts relative) holds all fourteen
> plates × five grades, live and switchable; the same lab is published as a Claude
> artifact at https://claude.ai/code/artifact/d273a6b6-be2f-44aa-a273-65a62a36d550 —
> ⚠️ **HE MAY SHOW THIS TO THE OWNER. Do not delete, overwrite or re-purpose either
> copy**; republishing that exact artifact keeps its URL stable. It is private until he
> flips the share toggle on the artifact page itself.
>
> **3 · GLACIER IS HERO-SCOPED IN THIS SHIP; THE NEXT PASS IS THE REST OF THIS PAGE —
> "we want the same vibe on the rest of the website", his words, and (his 2026-08-15
> clarification) the scope of those words is THE PEPTIDE PAGE.** Each service page gets
> its own design: the hormone page's is ALREADY APPROVED and does not move, functional
> medicine will get its own when its turn comes. Glacier is this page's identity. So the
> work ahead is the rest of THIS file: 03's dawn ground, 04/07/08's ivory panels and
> hairlines, 06's stories, the service tiles and the dialog shell, the doctors band, the
> chain scene's ink stage and gold beats (a composition of its own — judge it, don't
> find-and-replace it), and the header pills as they cross the new hero. The mapping he
> judged, ivory system → glacier, for every surface this page owns:
> `--ivory #FAF7F1 → #F4F7FA` · `--cream #F4EDE1 → #EAF0F5` · `--line #DED4C2 → #D5DEE6`
> · `--gold #C2A05E → #7C93A8` · `--gold-deep #8A6A34 → #54687C` · `--gold-tint #F1E7D2
> → #E4EDF4` (derived, unjudged). **The one red, the burgundy, the rose and both inks do
> not move** — the one-red rule is brand law and survived all five grades. Two cautions:
> BRAND.md's alphas are MEASURED minimums (re-measure on the new grounds, don't
> transpose); and ⚠️ the header/footer in this file are documented TRUE COPIES of the
> landing page's (round 6) — re-grading them here forks that copy on purpose, so it is
> HIS CALL to fork or to leave them ivory as shared chrome. The favicon's gold spark is
> shared too; it stays.
>
> QA: headless Chromium at 1440×900 and 390×844, CDNs served from npm via interception
> (the egress situation the round-1 QA record documents — nothing about that shipped):
> zero console errors, WebGL context up, copy legible over the field at both widths, the
> shader's own left-fade + the lab's radial wash (now in `.hero::after`) doing the work.
> Reduced-motion renders the field static at t=0, same rule as the silk. Offline fallback
> gradient re-graded glacier to match.

> ## ROUND 6 — SAME DAY: the section portraits grow (+29%)
>
> His "make the images bigger". **Two caps governed the size and both had to move**:
> `.doc-grid`'s max-width sets the column and `.doc-photo`'s own cap sets the picture
> inside it — at 56rem the column was already 415px while the photo was capped at
> 21rem/336, so the photo was binding; raising only the photo makes the column
> binding instead. Now **62rem / 27rem → 432px** at 1104 and up, from 336. Measured
> at ten widths: 432 / 432 / 432 / 432 / 389 / 329 / 432 / 432 / 350 / 320
> (1920 → 360), no horizontal overflow introduced at any of them.
>
> ⚠️ **A PRE-EXISTING 360px OVERFLOW WAS FOUND WHILE MEASURING THIS, AND IT IS NOT
> OURS — IT IS THE FOOTER, ON ALL THREE PAGES.** `.f-news{width:22rem}` is 352px
> against ~320px of content at 360, and grid tracks take their item's `auto` minimum,
> so the document measures **374px wide at a 360px viewport** on the landing page,
> the hormone page and this one alike (390 and up are clean). Left alone
> deliberately: the footer is documented as a TRUE COPY of the landing page's, so
> the fix belongs to all three files at once, not to this page unilaterally. The
> one-line version when he wants it: `.f-news{width:min(22rem,100%)}` plus
> `min-width:0` on the grid items — applied to `index.html`,
> `hormone-balancing/index.html` and here in the same commit.

> ## ROUND 5 — SAME DAY: the portrait goes SQUARE, the name sits beside it, and the
> square is measured to the text
>
> Off a rendered four-way board (circle/square × whole/cropped, name below/beside).
> **What the board settled first:** the circle was never the real fault — these
> masters are full-body studio shots with the head in the top quarter, so at 88px
> the face rendered ~20px. Cropping fixed the face; shape was then a free choice.
>
> **1 · SQUARE, HIS CALL, and the reason is consistency**: the section card he just
> clicked is a square, and this page spends squares on content and circles on chrome
> (the (i), the ×, the FAQ marks). **The name sits beside the picture** — the round
> face on its own line left the whole right of the panel empty.
>
> **2 · THE SQUARE IS AS TALL AS THE TEXT BLOCK — "top of the text and bottom of
> text for symmetry", his words, and it is MEASURED because it cannot be CSS.**
> A square whose height matches a text block whose height depends on the width that
> square leaves it is circular. Tested, not assumed: `align-self:stretch` +
> `aspect-ratio:1` resolves to **1px × 125px** in Chromium — the browser breaks the
> cycle by abandoning the width. `sizeFaces()` measures and iterates to a fixed
> point. Four things had to be true before it landed flush, each found by measuring
> a twelve-width sweep (1920 → 360) rather than by eye:
>   · **iterate, don't set once** — writing the square re-wraps the text and changes
>     the height just measured (one pass shipped 10px short in the chooser, 31px in
>     the header);
>   · **clamp, or the loop runs away** — the feedback is positive (taller square →
>     wider square → narrower column → taller text);
>   · **the × gutter belongs to the kicker, not the header** — 52px charged to every
>     line wrapped the name at 1440 and fed the loop into its cap;
>   · **the header sets its own name size** (32px, not the panel's 36) — at 36 no
>     fixed point EXISTS at 1440, so symmetry was unreachable, not just missed.
> Measured flush (top 0 / bottom 0, square within 1.5px) at 1920, 1440, 1104, 900,
> 760, 620; stacked by design ≤560; ⚠️ **360 is the one width that cannot be
> satisfied** — the longer title wraps to four lines there and the cap holds the
> square ~10px proud top and bottom, centred. Recorded, not chased.
>
> **3 · THE POPUP HEADER USES A BAKED HEAD CROP; THE CHOOSER SHOWS THE WHOLE FIGURE
> UNCROPPED** — his split. `tools/crop-portrait.mjs` (new) bakes
> `…-head-400.webp` from each master with Chromium as the codec, no new dependency;
> the masters are untouched and still serve the 336px cards. A runtime CSS zoom was
> rejected: it needs per-photo tuning in the stylesheet and softens at 2x, and the
> next doctor should be a file drop.
>
> **4 · THE CHOOSER SIZES BOTH ROWS FROM THE TALLER TEXT.** Per-row sizing is the
> literal reading and it rendered the two doctors at two different sizes whenever
> one title was shorter (65 vs 56 at 900). Two people offered as a choice are
> presented at one scale.
>
> ⚠️ Still open, his call: the four alternative chooser treatments (bigger, full-row
> height, mild crop, small) were rendered for him and the shipped default is the
> matched-height uncropped square.

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
