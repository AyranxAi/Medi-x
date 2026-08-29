# The returning rows on the phone — the next iteration's brief

This is the handover for **designing the phone composition of the returning rows** (the
`RC:*` block). The desktop is settled and live on main; the phone deliberately does not
have the rows yet. This file is what you need to design it without re-deriving the day.

Read [`HANDOVER_RETURNING_BAND_NEXT.md`](HANDOVER_RETURNING_BAND_NEXT.md) first if you
don't know what the RC block is — its top note is the short version of how we got here.

---

## 1 · What is live right now (2026-08-29, at the push to main)

Four carriers — `/hormone-therapy-bhrt/`, `/modern-menopause/`, `/testosterone-top-up/`,
`/programs/` — each carry, byte-identical:

- **`RC:CSS` / `RC:HTML`** — the returning rows: an "Already a patient?" eyebrow under
  the process chapter's 01–06 dots, then two slim rows, icon and serif title on one
  line: **"Repeat consultation"** (calendar-check) and **"Repeat prescription"**
  (prescription-pad). ~58px tall each, hairline border, no radius, no shadow.
  `RC:HTML` sits **inside `PS:HTML`** (the comp seats it in the editorial column), so
  editing it on one page breaks `programs-page.mjs` §0 — edit all four or none.
- **`RB:CSS` / `RB:HTML`** — the old full-width returning band below the flower,
  untouched, **still the only returning UI with working links** (`#book` + WhatsApp)
  and **still the only returning UI a phone sees**.

**≤900px the whole `RC` block is `display:none`.** That one line
(`@media(max-width:900px){.rc{display:none}}`) is the seam this iteration replaces with
a real composition.

The day's decisions, in order (all his):
| | call |
|---|---|
| a | the returning doors move into the flower's editorial column, per the approved comp |
| b | the gold tick under the titles goes — it only ate height |
| c | subtitles go, icon joins the title's line — "say everything via the title" |
| d | petal 01 becomes **"Book the programme"**, its "10 min" meta dropped |
| e | rolled to all four carriers, pushed to main; the phone is the next iteration |

## 2 · What the phone pass has to decide

1. **Layout.** The phone's `.ps-ed` column is full-width, so the rows have more width
   than on desktop — but at 320px a two-up grid gives ~146px a row, and the title alone
   is 132px at 16px (§3). Expect one column, stacked; that is also the RB band's own
   proven phone answer (its notes record why two-up truncates at 320px).
2. **Where the rows sit in the phone composition.** Phone DOM order in the column is:
   eyebrow · head · rule · body · CTA · dots · **prev/next arrows** (phone-only,
   `.ps-arrows`) · rows. The stage (flower) is `order:-1`, on top. Decide whether the
   rows stay after the arrows or the composition wants them elsewhere — moving them in
   the DOM moves them on desktop too, so prefer CSS `order` if they must move.
3. **Target size.** 58px rows meet the 48px floor, but the estate's own phone precedent
   (the RB band) uses **64px** targets — decide whether the rows grow on the phone.
4. **The band's fate.** Once the phone rows exist, the band is redundant twice over —
   but ⚠️ **the rows link nowhere yet**. Retiring the band before the rows carry real
   `href`s leaves the estate with NO working returning path. Order of operations:
   **wire the rows, then retire the band** — never in between.

## 3 · Numbers you would otherwise re-measure

- Desktop title is **16px** and icon **28px** because the desktop card is 204–214px wide
  and "Repeat consultation" measures **140px at 17px / 132px at 16px** — the 17px cut
  overflows the 1920 card by 1px. The phone's full-width rows don't share that budget;
  re-measure before assuming the phone wants bigger type, and never a vw clamp (the
  desktop column doesn't grow with the viewport; the phone row does).
- Contrast is already settled: the eyebrow is `--gold-gloss` on `--ps-ground` (4.805,
  floor 4.5 — the same measured pair as `.ps-eyebrow`); the title is `--burgundy` on the
  row fill (~10). Nothing in the phone pass moves a ground, so nothing needs re-measuring
  unless you change a colour.
- Both icons are stroked SVG, `stroke-width:1.3` at 28px. If the phone wants them
  smaller, check the ℞ strokes (inner group is 1.15) still resolve at that size.

## 4 · Still open, still his — do not settle these in the phone pass

- **The rows' destinations.** Deliberately inert `<div>`s. The obvious candidates when
  he decides: "Repeat consultation" → the AED 395 repeat consultation (no booking flow
  exists for it yet — do not invent one; see `HANDOVER_RETURNING_BAND_NEXT.md` §4);
  "Repeat prescription" → the estate's WhatsApp form, as the band does today.
- **The old band.** Stays until the rows are wired (§2.4).
- **Step 01's knock-ons.** The petal now says "Book the programme" and carries no
  duration, but the hero still says "Book a free discovery call", the final CTA still
  says "Book a discovery call", and both still speak of the 10-minute call. Also the
  step's column copy ("Care begins with understanding you." / "We begin with
  understanding your needs…") was written for the discovery call and was deliberately
  NOT rewritten. All flagged to him, all undecided.

## 5 · Checks

```bash
node tools/qa/returning-band.mjs     # the band still passes — RC must not break it
node tools/qa/programs-page.mjs      # §0: PS/RC parity across the four carriers
node tools/qa/process-sculpture.mjs  # the flower, incl. the renamed petal
```

⚠️ Run each alone (SwiftShader rule, `tools/qa/README.md`). There are **no RC-specific
harness checks yet** — the phone pass is the right moment to add them (parity of
`RC:CSS`/`RC:HTML`, the 320px no-truncation sweep, target sizes), and the repo's rule
stands: **when you add an assertion, make it fail on purpose once.**
