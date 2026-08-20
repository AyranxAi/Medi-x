# /testosterone-top-up/ — build record, rounds 1–2 (2026-08-19)

**What this page is:** door 3 of `/hormone-balancing/` — *"Concerned about male hormone
health?"* The men's page, and the only one on the estate that is not about a cycle.

⚠️ **THE PROGRAMME IS "TESTOSTERONE TOP UP"** — his correction of 2026-08-13, recorded on
the parent page: *"testosterone replacement is not like this, it's supposed to be
Testosterone Top Up."* No hyphen, no "Top-Up", and **TRT is never the programme's name** —
it appears only as the generic name of the therapy, the way his own FAQ uses it. The
harness watches the difference. The directory is hyphenated because that is URL grammar.

## Round 2 — the doctors turn sideways, and the three pills become one (2026-08-19)

His instruction, applied across every page in the estate that carries a doctors section:
*"make them swipeable in the phone so atleast you dont have to swipe multiple times to
finish all of them"* and *"there should only be one start consultation there both for
desktop and phone"*. This page received the change with `/peptide-therapy/`,
`/functional-medicine/` and `/hormone-therapy-bhrt/`; the mechanism is identical on all
five and the deep record lives at 05 in this page's own stylesheet.

**MEASURED HERE, NOT INHERITED.** At 390×844 the section was **1,969px — 2.33 screens**
and is **808px** now, 0.96 of a screen. Tablet 1,436 → 1,368. Desktop 872 → 900, the +28
being the single pill's own row. ⚠️ **THIS DOOR RENDERS THREE, SO ITS
STACKED COLUMN WAS ALREADY SHORTER — AND IT STILL LANDS ON THE SAME 808.** The rail's
height is one card plus its furniture and does not know how many follow it, which is the
argument for doing this on a three-doctor page at all: stacking costs a screen per doctor,
the rail costs a screen full stop.

**What the rail is:** `.doc-grid` becomes a flex row with `scroll-snap-type:x mandatory`
under 700 and `.doc` becomes its item at `flex:0 0 78%`. The same children, turned — the
portrait, the (i), the bio `<template>`, the monogram fallback and the reveal are all
untouched. The 22% peek is the whole affordance (a full-width card is a rail that looks
like one picture), the negative margin is load-bearing (without it `.wrap` clips the
peeking card), and the swipe needs **no script** — JS adds only the dots, and it watches
the 700 breakpoint rather than reading it once, because a phone turned to landscape
crosses it without a reload.

**The pill reverses his own 2026-08-14 call** and the note that recorded that call is
quoted verbatim inside its replacement rather than deleted. ⚠️ **The surviving pill opens
the chooser; it does not leave for `#book`** — three pills each meant "book with THIS one",
so one aimed at the booking strip would have deleted the choosing step at the moment the
reader is looking at three faces. Two CSS declarations died with the per-card pill and are
deleted rather than left unmatched (the 4-up `.btn` step-down and `.doc-spec{flex:1 0 auto}`),
and 1180 keeps its cliff on a new argument — the picture rather than the button.

**⚠️⚠️ THE CHOOSER WAS MISSING ON THIS PAGE AND NOTHING REVEALED IT.** Built from the BHRT
template, this page inherited the chooser's **script** but never its markup or its
stylesheet: `chooseTpl` resolved to `null` and the `[data-choose]` branch, guarded by
`&& chooseTpl`, never ran. The section's new pill is the first control that needs the view.
`#pxd-choose` and the `.pxd-docs` / `.pxd-doc` / `.pxd-back` rules were **grafted from
`/peptide-therapy/` byte for byte** so the estate's choosers cannot drift; only the intro
line is this page's, and the heading matches the label the script was already passing
(*"Choose who you'll see"*). **The rows are 05's three in 05's order** — nothing but that
line enforces it.

**QA:** the repo's own harnesses plus a five-page sweep at 390/768/1440 asserting one pill
per section, zero in the cards, the rail live and snapping under 700, the dots hidden above
it, no sideways scroll, and the chooser opening from the new pill with 3 rows matching the
section's names **in order**, no ← Back and no broken portrait.

---

## Why this door is built differently — three deliberate departures

1. **The scene is not a wave.** A man's decline is not a rhythm that falters; it is one
   line sliding for twenty years. So: a range band, a line entering it high, the crossing
   out marked, and the right-hand end lifted **back into the band**.
   ⚠️ **Two rules in that scene are clinical claims made in pictures:** the line is lifted
   *into* the range and **never above its ceiling** (replacement, not enhancement), and
   **the history is never redrawn** (the weight function protects the left half — the
   years already lived do not move). Neither is negotiable without a prescriber.
2. **The symptom device is a ledger, not a dial.** Nothing here keeps a schedule, so what
   a man actually has is twenty years of reasonable explanations. The left column names
   the explanation, the right names the measurable thing. ⚠️ **The left column must stay
   sympathetic** — every sentence in it is true; the page is not calling him a liar.
3. **The infographic is the monitoring panel, not education.** He is not asking what
   testosterone is; he is deciding whether to trust a clinic he found online in a market
   full of places that will sell him a vial. So the chapter is **the four markers** —
   Testosterone Total, Haematocrit, Estradiol, PSA — **the client's own list**, recovered
   verbatim, with their "additional parameters may be requested" caveat reproduced.

Payoff word: **"Back."** — the shortest on the estate, deliberately plain.

## ⚠️ Three doctors, not four — an editorial judgement, flagged

Dr. Nahla Ibrahim Elawady (DHA-certified **gynaecologist**) is not on this page. A
gynaecologist heading the row is the first thing a sceptical male reader notices and the
last thing that helps him trust it. Her card is untouched on both women's doors and on
/peptide-therapy/. His instruction this round was *"for doctors add what you can for
now"* — permission to assemble, not a ruling on who belongs. Restoring her is one
`<article>`, one `grid-template-columns` value (set to 3 here) **and — since round 2 — one
`.pxd-doc` row in `#pxd-choose`**, which must stay in the section's order. Miss the third
and the chooser silently offers a different set of doctors from the row above it. The three who remain
all have men's-health grounds in their own client bios.

## Copy provenance

- **Client's own:** the eight symptoms (their testosterone-consultation page, cut to two
  words each); the four monitoring markers and the "any appointment beyond the first
  two-month phase is a new consultation" line; **FAQ 1, "Is hormone therapy for men too?"**
  — his copy, verbatim from the parent page.
- ⚠️ **Draft, and the most safety-loaded copy on the estate:** the other five FAQ answers —
  **is this steroids · fertility · "normal" results · on it for life · how it's prescribed**.
  These are the questions every man actually asks, so omitting them would be conspicuous
  and would push him to worse sources; each is written conservatively and ends by handing
  the decision to his doctor. **None of them should meet real traffic without a
  prescriber's sign-off.** The fertility answer especially.
- Draft: hero sub, scene beats, the ledger's left column, the markers' "what it guards"
  lines, all three stories (**placeholders**).
- ⚠️ Step 02 names the **morning draw** — that is not decoration: testosterone is diurnal
  and the range is written for a morning sample. It is the one instruction on the page
  that changes the result rather than the experience.

## Money — ⚠️ INHERITED, NOT CONFIRMED FOR THIS PROGRAMME

AED **950 + VAT** → 997.50; add-on 1,950 + VAT → 3,045.00; review 750 + VAT. Same standing
as door 2: his 2026-08-19 figure, given for door 1, **not yet confirmed for this page.**

## QA

`node tools/qa/doors-shots.mjs` (shared with door 2) — green, including: 3 doctors and
Nahla asserted **off** the row, the ledger armed, four markers, the money three ways, no
menoSTART/"Modern Menopause"/"Top-Up" anywhere, **no 404s**, 13 widths, reduced motion.

## Open — his to answer

1. **Does the men's programme cost AED 950 + VAT?**
2. **The five draft FAQ answers past a prescriber** — the blocking item before real traffic.
3. Three doctors or four?
4. Dose form: their own recovered copy confirms compounded **creams** for BHRT generally;
   nothing confirms the form for men, so the page says the doctor names it. Confirm.
5. Title/meta sign-off; real testimonials; the scene concept board owed from door 1.
6. `images/medi-gyn-trt-*` sit unreferenced — no photography, his call.
