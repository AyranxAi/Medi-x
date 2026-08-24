# The programme card — redesign brief, opened 2026-08-24g

**This file exists because the work was deliberately NOT started.** His instruction:
*"edit the start the programme section for the desktop and the phone to be exactly like
this… but not to do it in this one but on another chat create the handover and let us
proceed."* Everything below is preparation. **Nothing in the repo has been changed for it.**

---

## ⚠️⚠️ FIRST: ASK HIM TO RE-PASTE THE TWO MOCKUPS

He supplied **two reference images** in the chat that produced this file — a desktop card
and a phone card. **They could not be saved to the repo** (chat images have no file path
this session could reach), so they exist nowhere but that conversation.

**Open the new chat by asking him to paste both images again.** The written spec below is
detailed enough to start from, but it is a description of a picture, and "exactly like
this" is his standard. Do not guess at what the spec does not cover — ask, or wait for the
image.

If he cannot re-supply them, say so plainly and work from the spec, flagging every place
you had to infer.

---

## Where this card lives today

| Page | What it renders | Notes |
|---|---|---|
| `/hormone-therapy-bhrt/` | `<aside class="prog-card">` — a real chapter card | **AED 950 + VAT. This is the page the mockups show.** |
| `/modern-menopause/` | the same card | AED 950 + VAT, **plus a `.pg-recap` line** |
| `/testosterone-top-up/` | the same card | **AED 1,150 + VAT** (2026-08-24g), plus `.pg-recap` |
| `/peptide-therapy/` | ⚠️ **a popup panel** (`template#prog-panel`) | same `pg-*` classes, **no `.prog-card`** |
| `/functional-medicine/` | ⚠️ **a popup panel** | same `pg-*` classes, **no `.prog-card`** |

### The DOM, as it stands (BHRT — the other two add `.pg-recap` after the `<h3>`)

```
<aside class="prog-card" data-reveal>
  <p class="pxd-kicker">The programme</p>
  <h3>Your treatment starts here</h3>
  <div class="pg-blk">              Included   +  <span class="pg-amt">AED 950 +VAT</span>
    <div class="pg-h">…</div>       ← the price lives HERE today, inline, ~21px
    <ul class="pg-list">…</ul>
  </div>
  <div class="pg-blk">              Add now
    <button id="pg-addon">…</button>      ← price is a sibling column INSIDE the button row
    <p class="pg-note">…</p>              ← outside the button since 2026-08-24f
  </div>
  <div class="pg-blk pg-blk--soft"> What's not included
    <ul class="pg-list">…</ul>
  </div>
  <div class="pg-sum">              Programme / [collection] / VAT / TOTAL TODAY
    <div class="pg-row">×3 + <div class="pg-row pg-row--total">
  </div>
  <div class="prog-cta"><a class="btn" href="#book">Start the programme</a></div>
</aside>
```

### The CSS that governs it

```
.prog-grid--card   max-width:560px, centred          ← the card is ONE narrow column today
.prog-card         sticky→static, white .55, 1px border, radius 18px, padding 22–34px
.pg-blk            margin-top:26px
.pg-h              flex row, label left / .pg-amt right, 1px ink underline
.pg-amt            accent face, clamp(17px,2vw,21px)   ← THE FIGURE THAT GETS PROMOTED
.pg-list / li      13.5px, gold dash marker at left
.pg-addon          bordered box, flex: checkbox | text | price
.pg-note           12.5px ink-soft, under the box
.pg-sum            border-top 2px ink
.pg-row            flex, label / figure, tabular-nums
.pg-row--total     gold caps label / accent figure clamp(21px,2.6vw,27px)
.prog-cta .btn     width:100%
```

---

## What the mockups change

### Desktop — from one narrow column to **two columns with a vertical divider**

- **LEFT:** kicker → title → short gold rule → `INCLUDED` (+ its 3 items) →
  `WHAT'S NOT INCLUDED` (+ its 4 items, each with its grey sub-line).
- **DIVIDER:** a single hairline running the full height between the columns, roughly
  centred.
- **RIGHT:** the **big price** → `ADD NOW` + the add-on box → the outside-UAE note →
  the summary rows → `TOTAL TODAY` → the full-width pill.

**The five real changes:**

1. ⚠️ **THE PRICE IS PROMOTED TO A DISPLAY FIGURE.** Today it is `.pg-amt`, ~21px, sitting
   inline at the right of the `INCLUDED` header. In the mockup it is the largest thing on
   the card — a Playfair figure at roughly **four times** its current size, with `+ VAT`
   beside it in the small sans caps it already uses.
2. **`INCLUDED` LOSES THE PRICE** and becomes a plain label, like `WHAT'S NOT INCLUDED`.
3. **THE ADD-ON'S PRICE MOVES INSIDE THE BOX** — bottom-right on desktop rather than a
   third flex column in the same row. On phone it stacks (`AED 1,950` over `+ VAT`).
4. **THE CARD APPEARS TO LOSE ITS BOX** — no outer border, no radius, no white fill;
   flat on the section ground with hairlines doing the dividing. ⚠️ **VERIFY THIS
   AGAINST THE IMAGE** — the crop may simply be inside the existing card. It is the one
   structural thing the spec is least sure of. **See open question 1.**
5. **THE 560px CAP MUST LIFT.** `.prog-grid--card{max-width:560px}` is the width the card
   was composed at. Two columns cannot live there. The mockup is a wide block — closer to
   the page's own `.wrap` measure than to a panel.

### Phone — one column, and the order is NOT today's order

```
kicker → title → BIG PRICE → rule → INCLUDED → items → rule → ADD NOW → box → note
→ rule → WHAT'S NOT INCLUDED → items → thick rule → summary rows → TOTAL TODAY → pill
```

The price sits **directly under the title**, left-aligned, large (smaller than desktop but
still the display figure). Everything else keeps today's sequence.

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

## Open questions — put these to him early

1. ⚠️ **Does the card keep its box?** Today: white `.55` fill, 1px border, 18px radius.
   The mockups look flat and borderless. **This is the biggest visual unknown in the
   brief** and it changes how the whole chapter sits on its ground.
2. **Which pages get this?** The mockups are BHRT. `/modern-menopause/` and
   `/testosterone-top-up/` carry the identical card and would look broken beside it if
   left behind — but the peptide and FM **popups** are a different component and almost
   certainly out of scope. Recommend: **all three door cards, neither popup.**
3. **Where does `.pg-recap` go?** Modern-menopause and testosterone have a one-line recap
   after the `<h3>` that the BHRT mockup does not show. Under the title? Under the price?
4. **How wide does the card get on desktop?** Full `.wrap` measure, or something narrower?
   The mockup's proportions suggest wide, but the number is his.
5. **Where is the breakpoint?** The card currently reflows at 900px (`.prog-grid`) and the
   chapter has its own cliffs. Two columns of this density will not survive 900 — expect to
   need a higher one, and **measure it rather than pick it**.

---

## Verifying the work

Run these; all three were green when this brief was written:

```
npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4     # ⚠️ all three in ONE install
node tools/qa/bhrt-shots.mjs      # asserts 950.00 / 47.50 / 997.50 + the add-on arithmetic
node tools/qa/trt-page.mjs        # asserts 1,150 three ways, incl. the static no-JS figures
node tools/qa/doctors-pill.mjs    # unrelated, but it walks all five pages — cheap insurance
```

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
