# /modern-menopause/ — build record, round 1 (2026-08-19)

⚠️ **THE LITE PETAL, 2026-08-24e** — his call. The plate now carries the step's **number, name
and duration only**; the sentence and the CTA moved to the editorial column (left on desktop,
below the flower on a phone). This retired the two-version copy fork: each step carried four
prose strings and now carries two, and none of them is written by anyone but him. Full account
in [`HANDOFF.md`](../HANDOFF.md) and
[`HANDOVER_PROCESS_SCULPTURE.md`](../HANDOVER_PROCESS_SCULPTURE.md).

⚠️ **HIS COPY ROUND, 2026-08-24b** — the six petal cards carry his words and lead with their
step number (shared block, so identical on all three doors), and the programme panel's heading
is "Your treatment starts here". ⚠️ **THIS PAGE'S "Included" LIST WAS NOT TOUCHED**: his new
three-line list is BHRT vocabulary and stops at that door. Aligning this one is a decision,
not a sync. ⚠️ **"BHRT Prescription" is step 05's title on every door**, his wording, carried
by the byte-identical block. Full account in [`HANDOFF.md`](../HANDOFF.md).


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
**2026-08-21: 03's six steps render as the process sculpture (WebGL porcelain flower, shared with `/hormone-therapy-bhrt/`) — see [`HANDOVER_PROCESS_SCULPTURE.md`](../HANDOVER_PROCESS_SCULPTURE.md).**
**Since 2026-08-24 the third door runs it too.**
⚠️ **03's COLOURS TRADED ENDS ON 2026-08-24** — the flower's cream `#F0EBE7` came off the
petals and became the chapter's ground (`--ps-ground`), and the petals took `--ivory
#FAF7F1`, the colour the header paints when it comes back on an upward scroll. **The two
halves are one decision**; reverting one alone is worse than reverting neither. Full account
in [`HANDOVER_PROCESS_SCULPTURE.md`](../HANDOVER_PROCESS_SCULPTURE.md).

⚠️ **ONE "Book a consultation" IN THE DOCTORS CHAPTER SINCE 2026-08-24** — his call, "it
should only have one book consultation", across every page that renders doctors. The pill
under each name is gone; the chapter closes on one centred pill under the row, and the popup
keeps its own. `node tools/qa/doctors-pill.mjs` guards it on all five pages.
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
review **795 + VAT** (his figure of 2026-08-24h, shared with the other two door cards —
it was 750 until then). The 950 is his figure of 2026-08-19, given while we were building
door 1, and the review moving has NOT settled it.
**He has not been asked whether menoSTART carries the same fee** — and menoSTART
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
