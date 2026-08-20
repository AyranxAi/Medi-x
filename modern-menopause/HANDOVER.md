# /modern-menopause/ — build record, rounds 1–2 (2026-08-19)

**What this page is:** door 2 of `/hormone-balancing/` — *"Twelve months or more since
your last period?"* Postmenopause, and the programme it sells is the client's own
**menoSTART** (their name, recovered from medi-gyn.com: "Medi-Gyn's Modern Menopause
Management Programme, 'menoSTART'" — lowercase meno, capital START, not ours to tidy).

⚠️ **THIS PAGE AND `/hormone-therapy-bhrt/` MUST NOT BLUR.** His instruction, 2026-08-19:
*"is this different to modern menopause? … i dont want you to mix both."* The rule runs
both ways and both harnesses assert it — that page never says menoSTART or "Modern
Menopause"; this one never sells to a woman who is still cycling.

Built from the BHRT page (the estate's template now), so every recorded lesson comes with
it. What changed is everything that has to change when the cycle has stopped.

## Round 2 — the doctors turn sideways, and the four pills become one (2026-08-19)

His instruction, applied across every page in the estate that carries a doctors section:
*"make them swipeable in the phone so atleast you dont have to swipe multiple times to
finish all of them"* and *"there should only be one start consultation there both for
desktop and phone"*. This page received the change with `/peptide-therapy/`,
`/functional-medicine/` and `/hormone-therapy-bhrt/`; the mechanism is identical on all
five and the deep record lives at 05 in this page's own stylesheet.

**MEASURED HERE, NOT INHERITED.** At 390×844 the section was **2,538px — 3.01 screens**
and is **808px** now, 0.96 of a screen. Tablet 1,436 → 1,368. Desktop 794 → 822, the +28
being the single pill's own row.

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
the chooser; it does not leave for `#book`** — four pills each meant "book with THIS one",
so one aimed at the booking strip would have deleted the choosing step at the moment the
reader is looking at four faces. Two CSS declarations died with the per-card pill and are
deleted rather than left unmatched (the 4-up `.btn` step-down and `.doc-spec{flex:1 0 auto}`),
and 1180 keeps its cliff on a new argument — the picture rather than the button.

**⚠️⚠️ THE CHOOSER WAS MISSING ON THIS PAGE AND NOTHING REVEALED IT.** Built from the BHRT
template, this page inherited the chooser's **script** but never its markup or its
stylesheet: `chooseTpl` resolved to `null` and the `[data-choose]` branch, guarded by
`&& chooseTpl`, never ran. The section's new pill is the first control that needs the view.
`#pxd-choose` and the `.pxd-docs` / `.pxd-doc` / `.pxd-back` rules were **grafted from
`/peptide-therapy/` byte for byte** so the estate's choosers cannot drift; only the intro
line is this page's, and the heading matches the label the script was already passing
(*"Choose who you'll see"*). **The rows are 05's four in 05's order** — nothing but that
line enforces it.

**QA:** the repo's own harnesses plus a five-page sweep at 390/768/1440 asserting one pill
per section, zero in the cards, the rail live and snapping under 700, the dots hidden above
it, no sideways scroll, and the chooser opening from the new pill with 4 rows matching the
section's names **in order**, no ← Back and no broken portrait.

---

## The three inversions — why this is not a recolour of door 1

| | door 1 · BHRT | **door 2 · here** |
|---|---|---|
| Scene | the waves **must never flatten** | the waves **do** flatten — and four columns rise from the still line |
| Symptom device | a **28-day ring** (the cycle keeps the schedule) | a **24-hour clock** (no cycle left; the pattern is circadian) |
| Infographic | the molecule is identical | **a third of your life happens after** |
| Payoff word | "Steady." (a rhythm restored) | **"Onward."** (no rhythm to restore — direction instead) |

The scene is the argument: **the still line is a foundation, not an ending.** Do not
"improve" it by bringing the waves back — that is a false promise here and it is the
sibling's ending. Do not put a 28-day ring on this page or a clock on that one; either
swap says the opposite of what its page is for.

## Anatomy

hero (Horizon, drawn — same water as the scene) → define (the door's hook, verbatim) →
**THE HORIZON** scroll scene (fallback: 8 chips + turn) → **03 menoSTART** (six steps +
card) → **04 the day, mapped** (24-hour dial, armed ≥900px) → **05 the long view**
(life-bar + three cards) → docs (4) → stories (3) → faq (6) → Irina → footer.
Grounds alternate ivory/dawn unbroken.

## Copy provenance

- **Client's own:** menoSTART; the Modern Menopause Lifestyle Guide **with Ms. Livia
  Rees** (their Peri-Menopause Fitness & Nutrition Expert — she has no portrait or bio in
  this repo, so she is named in the Included list and nowhere else; do not invent a card);
  **five of the six FAQ answers**, verbatim from the parent page's approved set — "Am I
  too old…" and "How long will I have to be on BHRT?" live here rather than on door 1 on
  purpose, because they are postmenopause questions.
- **Draft:** hero sub, scene beats, dial hours and answers, the long-view copy, the three
  cards, the first FAQ ("My symptoms have settled…" — it makes the bone/heart argument and
  needs a prescriber), all three stories (**placeholders, not real patients**).
- ⚠️ The long view's numbers are **rounded public-health figures** (menopause ~51, life
  into the 80s, so ≈ a third after) and the graphic says so. Do **not** sharpen them into
  precise statistics without a cited source on the page.
- ⚠️ The dial's hours are **honest clusters, not diagnoses** — the lede's "yours is the one
  we test" is load-bearing; cut it and an illustration becomes a medical claim.

## Money — ⚠️ INHERITED, NOT CONFIRMED FOR THIS PROGRAMME

AED **950 + VAT** / VAT 47.50 / **997.50**, collection add-on 1,950 + VAT (→ 3,045.00),
review 750 + VAT. The 950 is his figure of 2026-08-19, given while we were building door
1. **He has not been asked whether menoSTART carries the same fee** — and menoSTART
includes the Lifestyle Guide, which BHRT does not. If he gives another number, three
figures change here and one in the features script.

## QA

`node tools/qa/doors-shots.mjs` — covers this page and door 3 from one config table.
Green: scene stops ×8 at 1440/390, six beats, six steps, four doctors incl. Nahla, six
FAQ, three stories, 8 chips = 8 dial labels, 24 ticks, the flip, the money three ways,
the long-view bar, no foreign-door vocabulary, no DUTCH, **no 404s**, no sideways scroll
at 13 widths, reduced-motion fallback, hero alive.

## Open — his to answer

1. **Does menoSTART cost AED 950 + VAT?** (the one blocking question)
2. `<title>` / meta sign-off; real testimonials; the draft FAQ past a prescriber.
3. The scene concept board owed from door 1 applies to this page too — he asked to see
   the alternatives rendered ("i want tooooo see them all next time").
4. `images/medi-gyn-modern-menopause-*` sit unreferenced — no photography, his call.
