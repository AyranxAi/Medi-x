# The programme card — the record, closed 2026-08-24h

**This began as a brief for work that had not started. It is now a record of work that
shipped.** The card is built on all three door cards; `tools/qa/prog-card.mjs` guards it.
Everything below the fold is kept because it is still true and still the reason the card
is shaped as it is.

---

## ⚠️ WHAT HAPPENED, IN ORDER — THE PART WORTH READING

**Round one was built faithfully from his first two mockups and he rejected it:**
*"it really looks convoluted… hard to read."* The build was not wrong; the mockups
carried every grey sub-line and the add-on's full three-line paragraph, so a faithful
build of them was always going to be dense.

**The diagnosis was copy, not layout.** His second pair of references kept the two
columns, the divider and the promoted figure UNCHANGED. What they removed was text —
four sub-lines, the add-on paragraph, the outside-UAE note. Roughly nine lines of small
type off a card that had thirty-five.

> **If a later round starts putting explanatory lines back INLINE, that is the change
> that undoes this one.** They belong behind the +.

**The + is his, and it resolved what the cut opened.** His words: *"rather than adding
an x symbol we just need to add an + that is clickable so the person can understand what
it means… the same things will be there if that is clicked and something will come
down."* A cross LABELS a row; a + OPENS it. Three of the deleted sentences were
load-bearing — a commercial promise, a price that exists nowhere else on the site, and a
warning that guards a charge — and two of them now live on the row they explain instead
of in a footnote.

---

## What shipped

| | |
|---|---|
| **Layout** | Two columns, **41/59**, divider is the right column's own left edge. Reflows to one column at **1024px**, measured at 1104 (the narrowest two-column case) rather than picked. |
| **Card width** | `.prog-grid--card` **1180px** — it was 560, the width the card was composed at as one column. |
| **The figure** | Promoted out of the Included header to the right column, `clamp(42px,4.6vw,68px)`. **Keeps `.pg-amt`, LAST in its class list** — `trt-page.mjs` reads the no-JS price through it. |
| **Labels** | `Included` / `Not included`, gold serif, sentence case. "What's not included" is gone; so is the "Add now" label, which the add-on box's own gold heading replaced. |
| **Markers** | A gold tick (SVG, because MediGyn NOW has no ✓ glyph) for Included. A **+** for every Not-included row. |
| **The +** | `<details>`/`<summary>`, **no JavaScript**. Several open at once. Whole row is the target, larger under `@media(hover:none)`. Unfolds via `::details-content` where supported, snaps where not. |
| **Add-on box** | Gold "Optional add-on" heading, the service on one line, one line of what it is, figure bottom-right in the accent face. |
| **Summary** | The 2px ink bar is gone with the density it separated; a gold hairline above the total. On desktop the sum and pill **anchor to the floor of the right column**. |
| **Ground / box** | Unchanged — the chapter's `--ps-ground` porcelain, card keeps a fill, hairline and radius. **Burgundy was shown and not taken.** |
| **Scope** | The three door cards. **Neither popup was touched.** |

### Still open

- **The burgundy ground** (`S3` in the round that is now deleted from `tools/preview/`).
  It is a CHAPTER change, not a card change: `--ps-ground` #F0EBE7 is his own call
  (*"you know how our flower is cream? make that the color of the background"*) and it is
  what the flower sculpture stands on directly above this card. Going burgundy means
  recolouring the chapter or banding the card alone. Worth a round of its own.
- **`/modern-menopause/` still has a tall left column** — six Included items against
  BHRT's three. The floor-anchor closed the hole; the air in the middle is real and is
  the price of one shared layout across three lists of different lengths.
- **The men's Included list still says "Detailed symptom assessment"** while step 01 is a
  discovery call. Untouched here.

---

## Where this card lives today

| Page | What it renders | Notes |
|---|---|---|
| `/hormone-therapy-bhrt/` | `<aside class="prog-card">` — a real chapter card | **AED 950 + VAT.** The page the mockups showed. |
| `/modern-menopause/` | the same card | AED 950 + VAT, **plus a `.pg-recap` line** (it sits under the `<h3>`, above the gold rule) |
| `/testosterone-top-up/` | the same card | **AED 1,150 + VAT** (2026-08-24g), plus `.pg-recap` |
| `/peptide-therapy/` | ⚠️ **a popup panel** (`template#prog-panel`) | same `pg-*` classes, **no `.prog-card`** |
| `/functional-medicine/` | ⚠️ **a popup panel** | same `pg-*` classes, **no `.prog-card`** |

### The DOM, as built

```
<aside class="prog-card" data-reveal>
  <div class="pc-col pc-col--l">
    <p class="pxd-kicker"> · <h3> · [<p class="pg-recap">] · <div class="pc-rule">
    <div class="pg-blk pc-inc">            Included  + the tick list
    <div class="pg-blk pg-blk--soft pc-exc">  Not included + four <details class="pc-more">
  </div>
  <div class="pc-col pc-col--r">
    <p class="pc-price pg-amt">            ← the figure. .pg-amt MUST stay last.
    <div class="pg-blk pc-add">            the add-on <button> + the .pg-note outside it
    <div class="pg-sum">                   #pg-sub / #pg-row-addon[hidden] / #pg-vat / #pg-total
    <div class="prog-cta">
  </div>
</aside>
```

⚠️ **The two wrappers become `display:contents` at 1024** so their children turn into
direct grid items of the card and `order` interleaves them into the phone sequence.
That is the whole trick, and the reason it is necessary is written out below.

---

## What the first pair of mockups asked for — SUPERSEDED, kept for the reasoning

The round-one spec lived here: promote the figure to roughly **four times** `.pg-amt`,
strip the price out of the `Included` header, move the add-on's figure inside its box,
lift the 560px cap, and give phone an order that is **not** today's DOM order.

**Four of those five shipped.** The one that did not is the figure's size: at ~4× it
shouted over the chapter and his second pair of references set it nearer **2×**, which is
what is built. The phone order is unchanged from the spec and is the thing
`prog-card.mjs` now measures:

```
kicker → title → [recap] → BIG PRICE → INCLUDED → ADD NOW + box + note
→ NOT INCLUDED → summary rows → TOTAL TODAY → pill
```

It also proposed the card might **lose its box** and sit flat on the ground. Five edge
treatments were rendered for him — flat, ruled band, hairline frame, today's box, paper —
and **he kept the box**. Do not re-open that from the mockup crop; it was decided from
pictures.

---

## ⚠️ THE THREE THINGS THAT WILL BITE YOU

### 1. `pg-*` IS SHARED WITH TWO POPUPS THAT NOBODY ASKED TO CHANGE

`/peptide-therapy/` and `/functional-medicine/` render this content as a **popup panel**,
not a card, using the **same `pg-h`, `pg-amt`, `pg-list`, `pg-sum`, `pg-addon` classes**.
Restyle those base classes and you silently reshape two popups — and `.pg-amt` in a popup
has no room to become a 90px figure.

> **Scope every new rule to `.prog-card`.** `.prog-card .pg-h{…}`, not `.pg-h{…}`.
> The base grammar is load-bearing elsewhere; extend it, never fork it. That rule is
> already written into the stylesheet at `.pg-steps--page` — the same discipline applies.

### 2. THE DOM-ORDER PROBLEM — read this before writing any markup

Desktop needs the children split into two independently-flowing columns; phone needs them
**interleaved** in a single column. Mapped against the DOM order that serves phone
natively (`kicker, title, price, included, addon+note, not-included, summary, cta`):

```
LEFT  column ← kicker, title, included, not-included      (DOM 1, 2, 4, 6)
RIGHT column ← price, addon+note, summary, cta            (DOM 3, 5, 7, 8)
```

They alternate. That rules out the obvious approaches:

- **Two wrapper `<div>`s, stacked on phone** → gives phone `…included, not-included,
  price, addon…`. Wrong: the price lands after the not-included list instead of under
  the title.
- **One grid, explicit `grid-row` on every child** → left and right share row tracks, so
  the 90px price forces the kicker's row to 90px and the two columns' rhythms couple.
  Fights the design instead of expressing it.
- **Duplicating the price, one per breakpoint** → two nodes holding one number. Never do
  this on a money card; and the `pg-sub`/`pg-vat`/`pg-total` IDs beside it make duplicate
  IDs a live hazard.

> **Recommended:** two wrapper divs for desktop, and on phone set both wrappers to
> `display:contents` so their children become direct grid items of `.prog-card`, then
> `order` them into the phone sequence. Each desktop column then flows independently
> (which is what the design wants) and phone gets the exact interleave.
> Fallback if `display:contents` misbehaves: keep the wrappers and accept a phone order
> where the price follows the title inside the LEFT wrapper — then move it on desktop
> only. Put the compromise to him rather than shipping it silently.

**Accessibility is NOT a blocker here, and you can stop worrying about it:** the card has
only **two focusable elements** (the add-on button and the CTA pill), and they stay in the
same relative order in every layout. DOM order also reads sensibly aloud in both. Record
this so the next person does not re-derive it.

### 3. THE MONEY MUST NOT MOVE

Three different figures ride this card and two are script-driven:

- `#pg-sub`, `#pg-vat`, `#pg-total`, `#pg-addon-amt` are written by the money block at the
  foot of each file. **Keep the IDs.** Restructuring the summary without them is a silent
  pricing bug.
- The headline `.pg-amt` is **static text** today. If it becomes the display figure, it is
  still static — but it must stay in step with `BASE` in the script. They disagree the
  moment someone edits one.
- `.pg-row[hidden]` exists because `hidden` loses to `display:flex`. **Do not drop it** —
  without it the collection row shows AED 1,950.00 whether or not it was ticked, which is
  the worst direction a pricing bug can fail in. The note is at the rule.
- ⚠️ **`/testosterone-top-up/` IS AED 1,150, NOT 950.** The mockups show the BHRT card.
  Do not copy 950 across.

---

## The open questions, and his answers

1. **Does the card keep its box?** → He asked to see options; five were rendered.
   **The box stayed** (fill, hairline, 18px radius), on the chapter's own ground.
2. **Which pages?** → **All three door cards, neither popup.**
3. **Where does `.pg-recap` go?** → **Under the `<h3>`, above the gold rule**, in the
   left column. Ordered explicitly on phone.
4. **How wide?** → He chose the full `.wrap`; the simplification brought it to **1180px**.
5. **Where is the breakpoint?** → **1024**, measured at 1104.

Also settled: **the CTA stays a pill** (his first reference showed a rounded rectangle;
the estate's button is a pill on every page), and **the Included list keeps ticks with no
+** — a + that opens onto nothing is a broken promise, and only menopause has a sentence
there.

## Verifying the work

Run these; all three were green when this brief was written:

```
npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4     # ⚠️ all three in ONE install
node tools/qa/prog-card.mjs --shots  # THE CARD ITSELF, on all three doors
node tools/qa/bhrt-shots.mjs         # 950.00 / 47.50 / 997.50 + the add-on arithmetic
node tools/qa/trt-page.mjs           # 1,150 three ways + the 795 review fee on all three
node tools/qa/doctors-pill.mjs       # walks all five pages — cheap insurance
```

**`prog-card.mjs` is the one that did not exist when this file was written**, and the
failure it is for is the phone order. Desktop and phone want the same children in
different sequences; if a later edit adds a child with no `order`, or wraps two children
in a new div, **desktop keeps working perfectly and the phone order quietly scrambles** —
the figure lands under the not-included list, or the total floats above its own summary.
It renders. It just says the wrong thing in the wrong place. So the order is asserted by
**measured position**, not by class. It also holds the four `<details>`, the `.pg-amt`
class order, `.pg-note` staying outside the toggle, and the collection row staying hidden.

`trt-page.mjs` checks the money **in the raw markup as well as after the script runs**,
precisely so a layout change that strands a static figure gets caught. If you restructure
the summary, **run it before and after** — a card that adds up wrongly still renders.

`bhrt-shots.mjs` also asserts **no sideways scroll at 13 widths (320–1920)**. A two-column
card is the most likely thing on the page to break that; it is the check to watch.

**No screenshot test covers this card's appearance.** If the redesign lands, it is worth
adding one — an element screenshot of `.prog-card` at desktop and phone, the way the
doctor-row and month-wheel shots already work.

---

## Everything else still open on these pages

This brief is one item. The standing lists are in
[`hormone-therapy-bhrt/HANDOVER.md`](hormone-therapy-bhrt/HANDOVER.md) and
[`testosterone-top-up/HANDOVER.md`](testosterone-top-up/HANDOVER.md) — including two that
touch **this card** and should probably be settled in the same round:

- ✅ *(settled 2026-08-24h — done, before the card work)* **The Review consultation is
  AED 795 + VAT** on all three door cards. It did not follow the men's programme to 1,150.
  Guarded from `trt-page.mjs` §1b across all three pages.
- **"Detailed symptom assessment"** sits in the men's Included list while step 01 is now a
  **discovery call**, not an assessment.
