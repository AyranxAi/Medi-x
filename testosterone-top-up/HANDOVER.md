# /testosterone-top-up/ — build record, round 1 (2026-08-19)

**What this page is:** door 3 of `/hormone-balancing/` — *"Concerned about male hormone
health?"* The men's page, and the only one on the estate that is not about a cycle.

⚠️ **THE PROGRAMME IS "TESTOSTERONE TOP UP"** — his correction of 2026-08-13, recorded on
the parent page: *"testosterone replacement is not like this, it's supposed to be
Testosterone Top Up."* No hyphen, no "Top-Up", and **TRT is never the programme's name** —
it appears only as the generic name of the therapy, the way his own FAQ uses it. The
harness watches the difference. The directory is hyphenated because that is URL grammar.

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
`<article>` plus one `grid-template-columns` value (set to 3 here). The three who remain
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

## Chapter 03 — the process sculpture

**2026-08-24: 03's six steps render as the process sculpture (the WebGL porcelain flower,
shared byte-for-byte with `/hormone-therapy-bhrt/` and `/modern-menopause/`) — his call,
"make it in all three services including men in testosterone top up". See
[`HANDOVER_PROCESS_SCULPTURE.md`](../HANDOVER_PROCESS_SCULPTURE.md).**
⚠️ The chapter's own `h2` and lede went with the swap, as they did on the two sibling doors;
both strings are kept verbatim in a comment at the section for a rollback.
⚠️ **The men's step 02 — the morning draw — lives in the `<noscript>` list, not in the
sculpture's shared step copy.** It is the one instruction on this page that changes the
*result* and not the experience, so if the sculpture's copy is ever made page-specific it is
the first thing that must carry over.

⚠️ **03's COLOURS TRADED ENDS ON 2026-08-24** — the flower's cream `#F0EBE7` came off the
petals and became the chapter's ground (`--ps-ground`), and the petals took `--ivory
#FAF7F1`, the colour the header paints when it comes back on an upward scroll. **The two
halves are one decision**; reverting one alone is worse than reverting neither. Full account
in [`HANDOVER_PROCESS_SCULPTURE.md`](../HANDOVER_PROCESS_SCULPTURE.md).

⚠️ **ONE "Book a consultation" IN THE DOCTORS CHAPTER SINCE 2026-08-24** — his call, "it
should only have one book consultation", across every page that renders doctors. The pill
under each name is gone; the chapter closes on one centred pill under the row, and the popup
keeps its own. `node tools/qa/doctors-pill.mjs` guards it on all five pages.

## QA

`node tools/qa/doors-shots.mjs` (shared with door 2) — green, including: 3 doctors and
Nahla asserted **off** the row, the ledger armed, four markers, the money three ways, no
menoSTART/"Modern Menopause"/"Top-Up" anywhere, **no 404s**, 13 widths, reduced motion.
`node tools/qa/process-sculpture.mjs` (shared with doors 1 and 2 since 2026-08-24) — the
flower at six steps on desktop and phone, and the grade asserted as a pair.
`node tools/qa/doctors-pill.mjs` — one pill in the doctors chapter, three doctors, three popups.

## Open — his to answer

1. **Does the men's programme cost AED 950 + VAT?**
2. **The five draft FAQ answers past a prescriber** — the blocking item before real traffic.
3. Three doctors or four?
4. Dose form: their own recovered copy confirms compounded **creams** for BHRT generally;
   nothing confirms the form for men, so the page says the doctor names it. Confirm.
5. Title/meta sign-off; real testimonials; the scene concept board owed from door 1.
6. `images/medi-gyn-trt-*` sit unreferenced — no photography, his call.
