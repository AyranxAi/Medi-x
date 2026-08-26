# /programs/ — the booster programmes. The record, closed 2026-08-26

**The page shipped.** It was an orphan when this round opened — 16K of lab draft that nothing
linked to and that linked nowhere — and it is now the estate's ninth destination: the
booster-programmes page, reached from the hub's `#boosters` pill, carrying the doors' process
sculpture, their programme card, their doctors chapter, their fader and their FAQ.

Its living record is [`programs/HANDOVER.md`](programs/HANDOVER.md), round by round. **This
file is the round's own record** — what happened, in what order, whose call each thing was,
and what is still open.

---

## ⚠️ THE PART WORTH READING: THE MODEL CHANGED TWICE, AND BOTH TIMES THE BUILD WAS WRONG UNTIL IT DID

**Round two shipped two programme cards side by side** — one for Gut Health, one for Energy —
because that is what "two programmes" reads like from the outside. It was a faithful build of
the wrong model.

**Irina corrected it (2026-08-26, relayed by him):** *"it's not either or actually — it's one
or two, which is still the same price."* The systems are two **modules of one programme**,
additive, at one fee. Two cards side by side say "two purchases" no matter what the copy under
them claims, so the pair and its `?cards=stacked` board were **deleted, not parked** — the
question that board existed to settle had stopped being a true question.

**What replaced it is dynamic, and the dynamism IS the sales argument.** His own reference:
*"in the peptides at least it's dynamic where whatever you add will be seen."* One card, two
system tiles, and a fee that does not move when a system is added. A sentence claiming "same
price either way" is a claim; **a reader watching the total hold still while she adds the second
system is a demonstration**, and on the priced board that second system prints as its own row
at **AED 0.00**.

> **If a later round separates the systems back into two priced cards, that is the change that
> undoes this one.** The composed card is not a layout preference; it is the offer's shape.

**Then the head was rejected on sight:** *"the first parts are ugly."* True, and the fix was
already in the repository — see the next section.

---

## HIS FOUR UPLOADS WERE ALREADY IN `/images`, REFERENCED BY NOTHING

Scoping the new head turned up **four hero-named photographs staged in `/images` that no page
had ever used**: `medi-gyn-gut-health-hero-{landscape,portrait}` (a plated dish on burgundy
marble) and `medi-gyn-energy-hero-{landscape,portrait}` (a brass pendulum mid-swing). Both
orientations, both already in the estate's palette. They had been art-directed for exactly this
hero and were waiting for someone to hang them.

**Check `/images` for orphans before commissioning artwork.** `gut-gold` and `energy-gold` — the
flip cards' fronts, his pick over the porcelain pair — were sitting there too.

---

## What shipped, in four rounds

| round | what landed |
|---|---|
| **1** | The lab draft built out: estate header/nav, Included / Not-included spreads, in-practice, the "which one is yours" band, call strip, true-copy footer. The hub's `#boosters` pill loses `data-soon` and points here. |
| **2** | The doors' whole dress — **the flower byte-identical**, the programme card grammar, the three-women doctors row with its popups, the stories fader, the FAQ. |
| **3** | **Irina's correction**: the pair becomes one composed card; two system tiles, live Included rows, a fee that never moves. |
| **4** | **The new head**: the split photographic hero, the question band, and two cards that turn — gold anatomy on the front, the mechanism science on the burgundy back. |

**The page as it stands:** hero → the question → the flip pair → in practice → which one is
yours → the flower + the composed card → the doctors → stories → FAQ → the call strip → footer.

---

## ⚠️ THE FOUR THINGS THAT WILL BITE YOU

### 1. THE PARITY CONTRACT IS FOUR PAGES NOW, NOT THREE

`NEXT_ITERATIONS.md` §2's md5 loop was written for the three doors. `/programs/` carries the
`PS:CSS` / `PS:HTML` / `PS:JS` blocks **byte-identically** and is a fourth carrier: an edit to
the sculpture is four files, and a one-page "quick fix" is how four drift apart while each page
still looks fine alone. `tools/qa/programs-page.mjs` §0 asserts it on every run.

One pre-existing divergence is on record and **tolerated deliberately**: the men's `PS:JS`
carries one extra comment (the fork-and-revert note of 2026-08-24g), so its hash differs.
Comment-only, no behaviour. Erasing it to restore a clean four-way match would falsify the
record, so the harness allows exactly two JS sums and no more.

### 2. EVERY SCRIM ON A PHOTOGRAPH IS A MEASURED MINIMUM

The new head puts ivory copy on two photographs. Those alphas are arithmetic, not taste, and
`tools/qa/programs-page.mjs` §2b **photographs the copy rectangles on every run** (the
`boost-contrast` worst-2% method: hide the copy, shoot its own rectangle, take the brightest 2%
of pixels). As shipped: hero sub **7.73** against a 4.5 floor, hero headline **3.69** against 3,
flip-front copy **7.42** against 4.5.

⚠️ **The flip fronts' accent line is `--gold-tint`, NOT `--rose`, and that is forced.** Rose
(L≈.37) cannot clear 4.5:1 over the gold artwork's glow on any scrim that still leaves the
artwork visible — measured at 2.98 before the change. The gold tint (L≈.80) tracks ivory and
belongs to the faces' own key. **Putting rose back fails contrast silently.**

### 3. THE COMPOSED CARD'S STATE LIVES ON THE TILES, AND THE SCRIPT IS ONLY A VIEW

The peptide page's rule, carried verbatim: `aria-pressed` on the two `.sys-tile` buttons is the
truth; the recap line, the collapsing Included rows and the money column are **read** from it.
Nothing is built by `innerHTML`, so a reader with no JS gets the whole programme — both systems'
rows, nothing ticked — which is the truthful static reading.

- **At least one system is always on.** Unticking the last is refused silently; a programme with
  zero systems is not a state this offer has.
- **Default is both on.** The full programme is the anchor and removing reads as giving
  something up. If he prefers the *watch-the-price-not-move-as-I-add* telling, flipping the
  second tile's initial `aria-pressed` is **one attribute** — put it to him, it is a real choice.
- **The fee must never move with the systems.** The harness asserts exactly this: drop a system,
  the total stays `AED 997.50`. It is the one assertion Irina's promise turns on.

### 4. THE PATIENT-FACING PROMISE IS STATED EXACTLY TWICE

Irina's *"one fee, either way"* appears in the card's `.sys-note` and in the FAQ's "Can I take
both systems?". **Change both or neither** — a commercial promise that disagrees with itself
across one page is worse than one that is only made once.

---

## ⚠️ OPEN, AND THE FIRST ONE IS A DECISION ONLY HE CAN MAKE

### a · THE PACKAGE FIGURE — the page ships with no price, on purpose

**No figure for the composed programme has ever been named.** The doors' AED 950 + VAT buys one
consultation package; the Gut system carries a second consultation, and the WordPress source
pages quote only stale component prices (BHRT 3,450 / 3 months, supplements from 1,800) that the
door cards no longer use. Inventing a figure on a money card is the worst direction for a
pricing bug to fail in, so the money slot reads **"Priced at your consultation"** in the estate's
own quoted-first voice.

**One board remains for his pick: `?price=950`** — the doors' figure with the doors' live
arithmetic (950 → 47.50 → 997.50), the collection toggle summing in at 1,950, and the second
system printing at 0.00. It is the `?tone=` / `?boost=` precedent: **his pick deletes the
board.** When he names the real figure:

1. `BASE` moves once in the systems script, and
2. the static `.pg-amt` figure moves with it — **they disagree the moment someone edits one**, and
3. the `.pc-var` scaffolding and the `price-950` class are deleted.

If the two systems ever price differently, that breaks the one-fee model and is a **new
conversation with Irina**, not an edit.

### b · COPY THAT IS NOT SIGNED OFF, AND READS AS IF IT WERE

- **The three testimonials are invented.** They read finished and they are placeholders — the
  same standing as every stories rail on the estate. Replace with real patient voices before any
  real marketing.
- **Three of the six FAQ answers are drafts** written for this page ("Do I need to be on hormone
  therapy first?", "How are the supplements chosen?", "Can I take both systems?"). This is
  regulated medical copy: route them through him **and a prescriber**. The other three carry his
  sign-off on `/hormone-balancing/` and are reproduced verbatim — change them there or nowhere.
- ⚠️ **THE INCLUDED / NOT-INCLUDED CONTENT WAS RECOVERED, NOT READ.** `medi-gyn.com` is
  egress-blocked from the build environment, so both programmes' lists were reconstructed from
  **search-result snippets** of the two source pages and then set in the door cards' own wording.
  It is the best available reading and it is **not a substitute for opening those two pages**.
  Verify before real marketing.

### c · ⚠️ THIS PAGE IS ONE ROUND BEHIND THE DOORS ON TWO LINES — CAUGHT AT THE MERGE

While this page was being built, **`main` moved**: a same-day round restored the doors'
Included lists to six lines and gave each door its own protocol name (`64f430e`). This page
was written against the state before it, so two things are now out of step. **Neither was
"fixed" on the way in, and that is deliberate** — the composed card's list is per-system, so
both are content calls for him, not syncs:

- **The 4-week mentorship.** Removed estate-wide on 2026-08-24 ("they have removed it for a
  reason"), which is why it is absent here — then **restored on all three doors** the same
  day. The reasoning this page's absence rests on has expired, and the source BHRT-Plus page
  advertises the promise too. It is distinct from step 06's aftercare month. **One `<li>`,
  and it needs his word.**
- **The protocol name.** Line 3 on each door now reads "…Protocol (BHRT)" / "…Hormone
  Balancing Protocol (BHRT)" / "…Testosterone Therapy Protocol (TRT)", guarded by the new
  `tools/qa/included-parity.mjs`. That harness walks **the three doors only** and this page
  is rightly outside it; ours still reads the older unsuffixed form. What a *booster*
  programme should name is his call.

⚠️ **The lesson for the next round is the merge itself.** Two commits sat on this branch
from an earlier session and reached `main` independently while this work ran; a third landed
that touched a file this branch had also edited. `git merge origin/main` resolved it cleanly,
but **the copy divergence above would not have shown up in any harness** — it took reading
the doors' lists next to this page's. Re-read them after any merge that touches a door.

### d · SMALLER, AND EACH IS ONE EDIT

- `tools/qa/doctors-pill.mjs` walks **five** pages and does not know about `/programs/` — that
  page asserts its own one-pill rule in its own harness. One line to add it.
- The doors' banners still say the three-women row is *"carried byte-for-byte by two doors"*. It
  is **three pages** now. Two lines, on the doors, and not made in passing this round.
- **No i18n.** English only, like the other service pages; the landing page's six-language
  machinery has not been ported.
- `programs/cards.html` is the retired diptych lab that seeded the hub's cards. Nothing links to
  it. Candidate for `archive/` next time someone is filing.
- **The booking flow is still unwired** — `data-book` and the newsletter Join, per README's
  *Deliberately unwired controls*. WhatsApp in the header is the live channel.

### e · CLOSED THIS ROUND — do not re-open from an older note

- ~~*"`/programs/` is an orphan; he has asked for this one to wait"*~~ — the wait ended with his
  request for the page. `NEXT_ITERATIONS.md` §5b is rewritten.
- ~~*"Plate encoding is the biggest page-weight win left"*~~ — **the live page serves no PNGs**.
  The porcelain plates retired with the round-three head; the new hero and flip assets went
  through `tools/encode-plate.mjs` as AVIF+WebP pairs on new basenames. 248K of HTML, ~1.18 MB
  of images on disk across the pairs (the browser fetches one of each).

---

## Verifying

```bash
npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4 sharp   # ⚠️ ONE install — separate runs prune each other
node tools/qa/programs-page.mjs [--shots]   # THE PAGE: parity §0, ten widths, the head + its
                                            # contrast maths, the flower, the composed card and
                                            # its board, the doctors, the fader, the FAQ
```

⚠️ **RUN HARNESSES ONE AT A TIME** — the SwiftShader rule in `tools/qa/README.md`. It bit twice
this round: a parallel run produced a false click-timeout that was green when run solo.

**Green across the estate at the merge commit**, each run alone:

```
programs-page ✓   boost-contrast 12/12 ✓   doctors-pill ✓   process-sculpture ✓
prog-card ✓       bhrt-shots ✓             trt-page ✓       doors-shots ✓
```

⚠️ **Every assertion in `programs-page.mjs` failed honestly at least once** before it was
trusted — the 320/390 overflows, the `.pc-var` figure that outranked its own hide rule, the
phone-only flower arrows, the lazy portraits, the rose accent that could not clear the glow.
**When you add an assertion here, make it fail on purpose once.**

---

## Three lessons this page re-taught, at cost

1. **`minmax(0,1fr)`, never a bare `1fr`** — three times in one round. A bare track refuses to
   shrink under its widest child (the footer's 22rem newsletter, a flex card's min-content) and
   drags a sideways scroll in at 320.
2. **The doors' `button{}` reset is load-bearing for every ported chapter.** Without it the FAQ
   rows and the flower's petal hits render the UA button box, and the port looks broken in a way
   that reads as a layout bug.
3. **Scope every extension to its own component.** A bare `.pc-var{display:none}` lost to
   `.prog-card .pc-price{display:flex}` and showed a price that was supposed to be hidden —
   which on a money card is the direction that costs money. `.prog-card .pc-var` is the fix, and
   it is the same discipline `HANDOVER_PROGRAMME_CARD.md` records for the two popups.

---

**A clickable preview of the finished page** (self-contained, fonts and images inlined, with a
bar that flips the pricing board) is published at
`https://claude.ai/code/artifact/1fb4908b-1ac5-4fbe-a701-6d7df36f2116`. It is a **review copy**:
the repo page is the source of truth, and the preview's board bar does not exist in it.
