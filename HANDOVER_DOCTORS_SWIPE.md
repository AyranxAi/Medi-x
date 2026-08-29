# The doctors swipe on the phone — one row, six pages, one block

His call, 2026-08-29f: **"make sure that the doctors are always swipeable in mobile
across the pages and not shown as 3 sections size."** Before this, every page's ≤700px
tier stacked the doctors one under another at full column width and 48px apart — three
(or four) ~350px portraits that each filled the screen and read as three chapters, not
one row. Now the phone shows **one portrait and a peek of the next, scroll-snap,
swipeable** — the same on every page that renders doctors.

## 1 · Where it lives

Six pages render doctors, in two markup families, and the phone block is **byte-identical
on all six** (the `@media(max-width:700px)` block whose banner starts "THE PHONE SWIPES"):

| pages | doctors | upper tiers (untouched) |
|---|---|---|
| `/hormone-therapy-bhrt/` `/modern-menopause/` `/testosterone-top-up/` `/programs/` | 3 | 3-up ≥901 · four-tracks-seating-three at 701–900 |
| `/functional-medicine/` `/peptide-therapy/` | 4 | 4-up ≥901 · two-up at 701–900 |

There are **no `DOCS:*` parity markers** — the estate's existing contract here is the
documented sed-diff between `/modern-menopause/` and `/hormone-therapy-bhrt/` (the note
above `.doc-grid` on the menopause page), which covers `.doc-grid{` → the 700px block's
*opening* and still passes. The swipe block's own contract is stated in its banner:
**one identical block on all six pages — edit it everywhere or not at all.**

## 2 · How it works, and the numbers

```
.doc-grid (≤700px):  grid-auto-flow:column · grid-auto-columns:78% · gap:16px
                     overflow-x:auto · scroll-snap-type:x mandatory
                     margin-inline:calc(-1*var(--pad)) · padding-inline:var(--pad)
                     scroll-padding-inline:var(--pad) · scrollbar hidden both engines
.doc:                scroll-snap-align:start  (+ the span reset, see below)
```

- **The document does not widen.** The row scrolls inside itself; the negative margin
  spends the wrap's own `--pad` so the row bleeds to the screen edge, and
  `scroll-padding` seats card 1 back on the content grid (measured: grid at x=0, first
  card at x=20 on a 390 phone; document x-overflow 0 on all six).
- **At 390px:** cards are 273px; ~97px of the next portrait shows at the screen edge.
  **The peek is the affordance** — that is why the scrollbar is hidden.
- **The `grid-column:auto` reset is load-bearing on the 3-doctor pages** — their base
  `.doc` carries `span 2` for the 701–900 tier, and a span-2 card in *column* flow
  swallows two auto columns. Harmless on the 4-doctor pages; kept identical everywhere.
- **The reveal tween does not fight the peek.** `data-reveal` fires on ScrollTrigger's
  vertical axis (`top 86%`), so all cards light together when the section arrives,
  whatever their horizontal seat.
- The `(i)` popups, the monogram fallback, and the single `.docs-cta` pill under the row
  are all untouched; the pill stays centred under the swipe row.

## 3 · Verified (2026-08-29, headless Chromium)

All six pages at 390×844: swipeable (scrollWidth 891/1180 vs 390), snap `x mandatory`,
no page errors, no document x-overflow, row bleeds to the edge, first card seated at
`--pad`. At 800 and 1440 the grid is unchanged (`flow:row`, `overflow visible`, no
scrolling). `node tools/qa/doctors-pill.mjs` visits 390 and checks the centred pill —
unaffected. `doors-shots.mjs`'s 13-width overflow sweep is the standing guard against a
regression that widens the document.

## 4 · Open, and his to decide

- **The 701–900 tier still shows a static 2+1 (or 2+2) arrangement.** "Mobile" was read
  as the section's own phone tier (≤700). If he wants small tablets swiping too, the
  media query number is the only thing to move — but re-check the span reset story
  first: the 701–900 composition is the reason the spans exist at all.
- **No QA harness asserts the swipe yet.** The right assertions when one lands: the
  block's six-way byte parity, scrollWidth > clientWidth at 390 on all six, document
  x-overflow 0, and the first card's seat at `--pad`. The repo's rule stands: make each
  new assertion fail on purpose once.
