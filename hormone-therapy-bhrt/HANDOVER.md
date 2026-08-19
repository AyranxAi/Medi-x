# /hormone-therapy-bhrt/ — build record, rounds 1–2 (2026-08-19)

**What this page is:** door 1 of `/hormone-balancing/` — the woman who clicked
*"Still cycling and noticing changes?"* It sells exactly one thing: **the programme**
(assessment + blood-work reading + consultation, AED 950 + VAT). It is the
PERIMENOPAUSE page and must not blur into Modern Menopause — his instruction on the
record: *"is this different to modern menopause? … i dont want you to mix both"*. The
word "menopause" appears on this page only inside "perimenopause" and in the two
client-approved FAQ answers that already carried it; `menoSTART` and "Modern
Menopause" never. The harness asserts the absence.

Built by adapting `functional-medicine/index.html` whole (the newest sibling), so
every recorded lesson over there — the dialog shell, the doc cards, the reveal
engine, the grounds discipline — is inherited rather than re-learned. The sibling's
ring/tray/chooser machinery (eight services, one basket) was **deleted whole, not
disabled**: this page's one programme is a chapter, not a popup. The living copies
stay on /peptide-therapy/ and /functional-medicine/; restore from there, never from
memory.

## Round 2 — the doctors turn sideways, and four pills become one (2026-08-19)

His two asks in one message: *"lets fix somethings on the websites that have the doctor
make them swipeable in the phone so atleast you dont have to swipe multiple times to finish
all of them"* and *"there should only be one start consultation there both for desktop and
phone"*. Both land in **05 · THE DOCTORS**, and the identical change shipped to all three
pages that carry the section — `/peptide-therapy/`, `/functional-medicine/` and
`/hormone-therapy-bhrt/`. They were pixel-identical there before this round and still are;
treat the three as one change applied three times, not three changes.

**MEASURED, BECAUSE THE COMPLAINT WAS ABOUT DISTANCE.** At 390×844 the section was
**2,538px — 3.0 full screens for four faces**, of which the grid alone was 2,228. It is
**808px now, 0.96 of a screen** (844 on `/functional-medicine/`, whose heading wraps to two
lines). The tablet 2×2 — untouched by instruction, "keep 2×2" was his answer when asked —
went 1,436 → 1,368. The desktop line of four went 794 → 822, the +28 being the single pill's
own row.

**THE RAIL IS THE SAME GRID, TURNED — THERE IS NO SECOND MARKUP SHAPE FOR THE PHONE.**
`.doc-grid` becomes a flex row with `scroll-snap-type:x mandatory` under 700 and `.doc`
becomes its item at `flex:0 0 78%`. The portrait, the (i), the bio `<template>`, the
monogram fallback and the reveal are untouched and all keep working. The reason this was
cheap is that nothing was duplicated — anyone tempted to build a separate phone carousel
should read that sentence twice.
· ⚠️ **THE 22% PEEK IS THE ENTIRE AFFORDANCE.** A full-width card is a rail that looks like
  one picture: nothing on screen says three more exist, and dots alone are too quiet to
  carry it. The edge of the next portrait *is* the label, which is why there are no arrows
  and no "swipe" caption on a page that has neither anywhere else.
· ⚠️ **THE NEGATIVE MARGIN IS LOAD-BEARING, NOT TIDINESS.** Without pulling the rail out to
  the viewport edge and handing `--pad` back as `scroll-padding-inline`, the peeking card is
  clipped by `.wrap` and the rail reads as a cut-off column — the exact impression this
  round exists to remove.
· ⚠️ **`scroll-snap-align` IS `center`, NOT `start`.** With `start` the fourth card pins to
  the left edge behind 22% of dead ground, so the last doctor is the only one who never sits
  in the middle of the screen.
· ⚠️ **THE SWIPE NEEDS NO SCRIPT.** It is a plain overflow container and works with JS off.
  The script adds the dots and nothing else, from its **own** `matchMedia("(max-width:700px)")`
  — the breakpoint has to be *watched*, because a phone turned to landscape crosses 700
  without a reload and dots left armed sit under a 2-up grid pointing at nothing. That is
  also why `.doc-dots` is `display:none` in CSS and lit by `.on` from the script: two
  independent 700s that must agree is a bug waiting for the day one of them moves.
· The dots are **06's fader dots copied exactly** — same 7px, same 11px gap, same burgundy
  fill, same 1.4 scale. Not shared code (that component owns opacity, this one owns
  `scrollLeft`), so if `.story-dots` is ever restyled, restyle this with it.

**THE PILL: FOUR TO ONE, AND IT REVERSES HIS OWN 2026-08-14 CALL.** The stylesheet carried
*"⚠️ TWO RED PILLS IN ONE VIEWPORT, HIS CALL … he asked for the pill under each name"*,
written specifically to stop anyone tidying it away. **That note is quoted verbatim inside
its own replacement rather than deleted** — the argument for it was his, the argument
against it is his, and a reader who finds only the reversal will re-litigate the original.
⚠️ **THE SURVIVING PILL OPENS THE CHOOSER; IT DOES NOT LEAVE FOR `#book`.** Four pills each
meant "book with THIS one", so one pill aimed at the booking strip would have deleted the
choosing step at the exact moment the reader is looking at four faces — consolidating the
ask while losing what the ask was about. It is a `<button data-doc-choose>` for that reason.
⚠️ It opens that view **cold**, with no service popup behind it, so the handler removes the
template's own ← Back: cold, `lastTpl` is either nothing or — worse — whichever bio the
reader happened to open earlier in the session. ⚠️ With the script off the button does
nothing, and that is accepted rather than overlooked; the alternative is an `<a href="#book">`
the script must intercept to reach the chooser, which is the same dependency in a disguise.

**TWO DECLARATIONS DIED WITH THE PILL AND ARE DELETED, NOT LEFT UNMATCHED:** the 4-up
block's `.doc .btn` step-down (216px into a 247px column — a `white-space:nowrap` pill
cannot wrap its way out of an overflow) and `.doc-spec{flex:1 0 auto}` (which ate the ragged
specialisation lengths so the four buttons sat on one floor). Nothing sits under the spec
now, and a ragged bottom edge is invisible once the last line of type *is* the bottom edge.
⚠️ **1180 KEEPS ITS CLIFF BUT ON A NEW ARGUMENT** — it used to rest on the pill's 216px, and
it now rests on the picture: four squares in a line stop reading as portraits around 1100,
where the column drops under ~250px and Dr. Khalid's three-line specialisation starts to
outweigh the face above it. Both spent bullets are struck through **in prose** in the source
rather than removed, because anyone putting a pill back in the card inherits both problems
the same afternoon.

**QA:** `tools/qa/peptide-page.mjs` 53/53, `fm-shots.mjs` and `bhrt-shots.mjs` all green,
plus a per-page sweep at 390/768/1440 asserting one pill in the section, zero pills in the
cards, the rail live and snapping under 700, the dots hidden above it, no sideways scroll,
and the chooser opening **from the new pill** with four rows, no ← Back and no broken
portrait.

**⚠️⚠️ THE GAP THIS SURFACED WAS ALREADY HERE, AND NOTHING ON THE PAGE REVEALED IT.** This
page shipped with the chooser's **script** but never its template or its stylesheet:
`chooseTpl` resolved to `null` and the `[data-choose]` branch was guarded by `&& chooseTpl`,
so the dead half failed silently. The section's new pill is the first control that actually
needs the view, which is what exposed it. `#pxd-choose` and the `.pxd-docs` / `.pxd-doc` /
`.pxd-back` rules were **grafted from `/peptide-therapy/` byte for byte** so the two choosers
cannot drift; only the copy line is this page's (*"All four consult on hormone therapy"*),
and the heading matches the label the script was already passing (*"Choose who you'll see"*).
The rows are 05's four in 05's order — Komissarov, Yakout, Elawady, Shukri — and nothing but
that line enforces it. If the peptide chooser is ever restyled, re-graft; there is nothing
here worth diverging on.

---

## The decisions this page stands on — all his, 2026-08-19

| Decision | His words |
|---|---|
| No hero photography | "the images are rejected for a reason hence we dont even need images if there is a better way" — the `medi-gyn-bhrt-*` plates stay in `images/`, unreferenced |
| Scene = A · THE TIDE | "okay for scene lets do a for now" — ⚠️ **a concept board of B (metronome) and C (duet) on the real stage is OWED next round**: "i want tooooo see them all next time" |
| Symptoms = A · the month wheel | "ship a for now" |
| Hormones = the identical key | "yes for now" |
| H1 = the direct one | "a. — for people who would find the page itself as thats more direct and still you. might be confusing" |
| **Programme, AED 950 + VAT** | "consultation is actually 950+ vat and review is 750 + vat" — NOT the siblings' 1,150 |
| Blood test only | "regarding dutch we stop for now onky blood test now" — no DUTCH anywhere, harness-asserted |
| Home collection add-on | "we still have the optional add on of 1950 + vat for blood work in uae" |
| The word "programme" | approved by the owner via him (relayed earlier the same day): the price buys assessment + blood reading + consultation, which is fairly a programme; "consultation" names only the meeting. The peptide page's consultation-only rule governs THAT page |
| Doctors | "for doctors add what you can for now" → the peptide page's four, verbatim (Nahla restored into the slot the FM base gave Ms. Puri) |

## Anatomy

hero (Tide, drawn) → define (the door's own hook, verbatim) → THE TIDE scroll scene
(fallback: signals chips + turn) → **03 the programme** (six steps + the card) →
**04 the month, mapped** (cycle wheel) → **05 what are hormones** (identical key +
three dossiers) → docs (4) → stories (3) → faq (6) → final (Irina) → footer.

Grounds: ivory(03) → dawn(04) → ivory(05) → dawn(docs) → ivory(stories) → dawn(faq)
→ ivory(final). The scene exits its dawn onto 03's ivory — the parent's measured seam.

### The Tide (hero + scene — one water)
Two hormone waves: estradiol leads (gold/champagne), progesterone answers a
quarter-turn behind (rose / ink-soft plum on the hero). The WAVES block is shared
between the two scripts — **two copies of one fact, cross-referenced at both sites**.
Scene acts: steady → the waver (deterministic seeded sines; crests fall short, peaks
arrive late, the pair parts) → five measured gold drops refill the rhythm → dawn from
the waterline, ring, "Steady." **Nothing flattens — still cycling is the page's
premise and the final frame keeps the waves rolling.**
- ⚠️ Crest lights sit at sine = **−1** (screen y grows downward). The first cut used
  +π/2 and every light sat in a trough — measured off the rendered frame, fixed in
  both scripts. The note is at the site.
- Skip lands on `#programme`. Latch/controls/SCHED/probe hooks are the siblings',
  verbatim. `?scene=p` and `?probe=1` work as over there.

### The programme (03)
The siblings' `pg-*` grammar promoted to a chapter: six steps left (page-scale
`--page` modifier), sticky card right. Steps keep the client's recorded order
correction (doctor CHOSEN at 03, then reads the file). Step 05's cell is a QUANTITY
("2 months' supply" — their real initial protocol length, recovered from their own
site) — no shipping time exists anywhere, do not invent one. Aftercare (a month of
open calls) and the 4-week mentorship are two different promises; both stay.
Money: 950.00 / VAT 47.50 / **997.50**; with collection 2,900 → 145.00 → **3,045.00**.
Two decimals always. "What's not included" prices the Review consultation at **AED
750 + VAT** (his figure). The start pill lands on `#book` until a payment provider
exists (the siblings' recorded position).

### The month, mapped (04)
Eight symptoms seated on a 28-day ring where they land in the month; tap flips each
to its answer in place (the parent scene's replace-in-place grammar). ⚠️ **The wheel
is a STATE, not a width** (the round-19b lesson): everything absolute lives behind
`.month-armed`, added by script and only at **≥900px — measured**: at 760 the
outermost label's overhang widened the document 22px (the harness caught it; note at
the media query). Unarmed = a flowing chip row, flips intact. The eight words = the
fallback chips' eight, same order — the parent's vocabulary rule, change both or
neither. ⚠️ The day placements are honest clusters, NOT diagnoses, and the lede's
"yours is the one we test" sentence is **load-bearing** — deleting it turns an
illustration into a medical claim.

### The identical key (05)
Estradiol's skeleton drawn once in `<defs>` and **stamped twice with `<use>` —
identical by construction, which is the argument**. The gold copy slides onto the ink
one when the stage arrives (IO); default CSS is the LOCKED state, so no-JS and
reduced motion ship the proof already made. Caption: "Identical. Not similar." —
the clinic's own claim ("the same molecule as human body hormone molecules",
recovered from their site). Three dossiers name the three hormones in their own
vocabulary (creams etc. live in the FAQ's client-approved answer, not here).

### Docs · stories · FAQ · final
Docs: the peptide four (Andrey · Eslam · **Nahla** · Khalid), bios client copy
verbatim. ⚠️ Nahla is third only because that was the open slot; **a BHRT
gynaecologist LEADING the row is a question for him**, not a tidy-up. Stories: three
placeholders in this page's register — NOT real patients. FAQ: three answers are the
parent page's client-approved copy verbatim (safe? / how used? / tried HRT); three
are DRAFT perimenopause questions — "Will BHRT stop my periods?" especially needs a
prescriber's eyes. Final strip + footer inherited; WhatsApp prefills say "hormone
therapy support".

## QA — `tools/qa/bhrt-shots.mjs`, all green

Screenshot pass (scene stops ×8 at 1440/390, page chapters d+p, reduced-motion) +
smoke: 6 beats · 6 steps · 4 docs incl. Nahla · 6 FAQ · 3 stories · 8 labels = 8
chips · 28 ticks · 2 `<use>` · money three ways · add-on arithmetic · flip works ·
no DUTCH/BOZAT · no Modern-Menopause vocabulary · wheel unarmed on phones · no
sideways scroll at 13 widths (320–1920) · reduced-motion falls back clean · hero
canvas alive. Run: `npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
&& node tools/qa/bhrt-shots.mjs`. The full harness on the peptide-page.mjs pattern is
the natural next round once copy is signed off.

## Wiring

Parent door 1 (`hormone-balancing/index.html`) lost `data-soon`, gained
`href="../hormone-therapy-bhrt/"`; doors 2–3 keep `data-soon` until their pages
exist. ⚠️ The door's hook and this page's opening h2 are the same sentence in two
files — change both or neither (noted at both sites). This page has no menu item of
its own, deliberately: the menu lists top services; the doors are the route in.

## Open — his to answer

1. **The scene concept board** — B and C rendered on this real stage, next round. Owed.
2. Doctor order: Nahla first?
3. `<title>`/meta description sign-off (draft, in his pattern).
4. Real testimonial copy; FAQ drafts through him + a prescriber; the month wheel's
   day placements through a doctor.
5. Payment provider for "Start the programme" (merchant account — his to open).
6. The three uploaded `medi-gyn-bhrt-*` plates sit unreferenced in `images/` — keep
   or retire is his call; nothing points at them.
