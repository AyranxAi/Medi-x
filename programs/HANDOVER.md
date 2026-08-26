# /programs/ — the booster programmes page. The record, opened 2026-08-26

**One page, both programmes — his note of 2026-08-11, recorded at the hub's `#boosters`
section, and his request of 2026-08-26: "a separate page (1 page for both)".** The lab draft
(threshold, two chapter plates, two mechanism bands, in-practice, close) was kept almost
whole and built out into a complete page in the estate's grammar. The hub's "Explore the
programmes" pill is wired here now; `data-soon` came off exactly as that section's comment
said it would once this page had an address.

## What the two programmes are

medi-gyn.com's **"Hormone Balancing for BHRT Plus"** (→ *Hormone Therapy + Gut Health*) and
**"Modern Menopause Management"** (→ *Hormone Therapy + Energy*), renamed forward under
Hormone Therapy + . ⚠️ medi-gyn.com is egress-blocked from the build environment; every
Included / Not-included line was recovered via **search snippets** of those two pages, then
set in the door cards' own wording wherever the same item exists there ("Prescription Issued
Bioidentical Hormone Therapy", "Once your prescription is issued, we will price it — before
you pay", the AED 795 + VAT review figure — the estate's settled number, **not** the
WordPress page's stale 750). **Verify against the live pages before real marketing.**

## What was added to the draft

- **Header + overlay nav** — the hub's bar, with one deliberate divergence recorded at the
  CSS: the DEFAULT state is the red key (red mark, red-outlined controls on transparent),
  because this page is ivory from its first pixel and the ivory-glass state would be an
  invisible bar. Menu items follow the doors' list (the newest): three in-repo relative,
  three WordPress absolute.
- **The threshold index** — two hairline rows, `#gut` and `#energy`, so a reader who knows
  her question is one press from her answer.
- **Inside the programme × 2** — the door cards' Included / Not-included grammar set as an
  open spread (hairlines, gold serif labels, tick SVGs, `<details>` + rows, no JavaScript).
  Same look, page-local classes — nothing here reaches the doors' `pg-*` popups.
- **Which one is yours** — a two-column self-selection band; each line is written from the
  mechanism bands' own claims, not new medicine.
- **The call strip + footer** — the hub's close (her photograph, the free 10-minute
  discovery call, the pill `data-book` and inert per the estate's unwired-controls
  convention) and the true-copy footer, marks served from `/images` rather than data URIs.
- **Motion** — deliberately no WebGL scene and no GSAP/Lenis: the page's device is the pair
  of plates. An IntersectionObserver reveal plus the mechanism diagrams drawing themselves
  in (`pathLength="1"`, one dash rule serves every shape). Both gated: no-JS shows the page
  whole, `prefers-reduced-motion` shows it still, `?probe=1` is the QA path.
- **Copy corrections** — "Estrogen", not "Oestrogen" (BRAND.md, the INN rule, his call
  2026-08-24f); "programmes" in all visible copy (the folder name is an address and keeps
  its spelling); step three re-reads at **two months**, not twelve weeks — the prescription
  is a two-month supply and the review sits at its end, here as on the doors.

## ⚠️ Decisions honoured, and the one line that is his to restore

- **The 4-week mentorship is on NEITHER Included list**, though the source BHRT-Plus page
  still advertises it. The owner removed the promise from every door ("they have removed it
  for a reason", 2026-08-24; "everything else in included drops", 2026-08-26) and this page
  follows. If the plus programmes are meant to keep it, that is his call and one `<li>` per
  list.
- **No package price is stated anywhere on the page.** The source pages carry old WordPress
  figures (BHRT AED 3,450 / 3 months; supplements from AED 1,800) that the door cards no
  longer quote — the doors' "we will price it — before you pay" voice is used instead. The
  only figure on the page is the settled AED 795 + VAT review consultation. If the
  programmes are to carry a headline price like the doors' AED 950, the Included panel takes
  a `pg-amt`-style figure and a money block — a round of its own, with his numbers.

---

# Round two, 2026-08-26 — the doors' aesthetics, whole

**His ask:** *"copy the aesthetics of the services — the same flower for the how it works
and the pricings as well … doctor page, feedback, footer and so on."* The page now runs the
doors' full chapter set:

| chapter | provenance |
|---|---|
| 05 · The programme | **The flower, byte-identical** — the PS:CSS/HTML/JS blocks make this page a FOURTH carrier of the parity contract (NEXT_ITERATIONS §2, updated). The six steps are the doors' six because the intake is the same intake. Below it, **two programme cards** in the door card's own grammar. |
| 06 · The doctors | Door 1's three-women row (Dr. V · Dr. N · Dr. D), markup carried verbatim including every per-card record; client-copy bios untouched; ONE pill under the row. ⚠️ The doors' banners still say the row is "carried byte-for-byte by two doors" — it is three pages now; correcting those two lines is a doors edit and was not made in passing. |
| 07 · Stories | The doors' fader (one voice at a time, dots, no auto-advance under reduced motion). ⚠️ PLACEHOLDER QUOTES, like every rail on the estate — replace before real marketing. |
| 08 · FAQ | Three client-approved answers VERBATIM from /hormone-balancing/ (change them there or nowhere) + three booster drafts flagged for him and a prescriber. |

---

# Round four, 2026-08-26 — the head rebuilt: hero, question, flip pair

**His call:** *"the first parts are ugly … the same as what we did for the others — the
question, animation, and 2 cards side by side that flip."* The editorial head (threshold +
index, two porcelain chapter plates, two mechanism bands) is **retired whole to
`archive/programs-sections/00-editorial-head-round3.html`**, restorable by paste. In its
place, the doors' opening arc:

- **The split hero** — HIS OWN UNUSED UPLOADS, found staged in `/images` and referenced by
  nothing: `medi-gyn-gut-health-hero-*` (the dish on burgundy marble) and
  `medi-gyn-energy-hero-*` (the brass pendulum), both orientations. Encoded through
  `tools/encode-plate.mjs` → `hero-boost-*-1672/-941` AVIF+WebP (new basenames; masters
  untouched). Two panes, one headline, one scrim; panes stack on phones.
- **The question** — the signals-chip device: seven chips, each a claim the page already
  makes, cascading on `--i` stagger; no new medicine.
- **The flip pair** — front: the offer on HIS gold anatomy uploads (his pick over the
  porcelain pair; `gut-gold`/`energy-gold` → `flip-*-gold-1400`); back (burgundy): the
  retired mechanism bands' four beats VERBATIM. Faces stack in one grid cell (the
  story-rail trick) so the card takes the taller face; the 3D turn lives behind `html.js`
  (no-JS renders both faces in flow); the hidden face is `inert` + `aria-hidden`; the cue
  is a real button and the whole surface turns, links excepted.
- **The header returns to the ivory key** (frosted glass, ivory mark) — the round-one red
  key existed because the old head was ivory from its first pixel; the red mark has no
  contrast on the marble. Red returns with the solid bar.
- ⚠️ **EVERY SCRIM HERE IS A MEASURED MINIMUM** — the harness's `worst2()` (the
  boost-contrast method) photographs the copy rectangles on every run: hero sub ≥4.5,
  hero headline ≥3, flip-front copy ≥4.5. The front title's accent is **gold-tint, not
  rose** — rose (L≈.37) cannot clear 4.5:1 over the artwork's glow on any scrim that
  leaves the artwork visible; that is arithmetic, recorded at the rule.
- A no-WebP-fallback note: the beat-draw animation and the `pathLength` trick left with
  the mechanism bands; the reveal engine no longer observes `.beat`.

# Round three, 2026-08-26 — Irina's correction: one card, one fee, one or two systems

**Her call, relayed by him:** *"it's not either or actually — it's one or two, which is
still the same price."* That corrected the model round two's PAIR of cards was built on:
the systems are two MODULES of one programme, additive, at one fee. The pair and its
`?cards=stacked` board are **deleted, not parked** — the question they settled stopped
being true. What stands now is **one door card that composes the programme in the peptide
page's grammar** (his own reference: "in the peptides it's dynamic — whatever you add will
be seen"):

- **Two system tiles** (the hub's own boost-band photographs as thumbs) carry the state
  on `aria-pressed` — the peptide rule: the tiles are the truth, the script is a view.
- The **recap** names the choice ("Hormone care with Gut Health and Energy."), the
  **Included rows collapse and return** per system (`grid-template-rows 1fr→0fr`,
  reduced-motion instant), and **at least one system is always on** — unticking the last
  is refused.
- **The fee never moves.** On the `?price=950` board the doors' live arithmetic returned
  (single card, so the `#pg-*` IDs and the collection toggle are safe again) and the
  second system prints as its own row at **AED 0.00** — the offer, made visible. The
  harness asserts the total does not change when a system is dropped.
- Default is **both systems on** (the full programme is the anchor). If he prefers the
  "watch the price not move when I add" telling, the second tile's initial
  `aria-pressed` is one attribute.
- Irina's promise is stated in patient copy exactly twice — the card's `.sys-note` and
  the FAQ's "Can I take both systems?" — change both or neither. The pick band's foot
  now says the reader need not choose.

## ~~THE TWO DECISION BOARDS~~ — round two's record, superseded above

**`?cards=stacked` is deleted (round three); `?price=950` still stands** — the figure
question below remains exactly as open as when this was written.

The cards ship with **no package figure**, because none exists for the plus programmes:
the doors' AED 950 + VAT buys assessment + blood-work reading + consultation, and whether
the plus programmes (gut holds TWO consultations) sell at that figure has never been said.
The money slot reads *"Priced at your consultation"* in the estate's quoted-first voice.
The boards, ?tone=/?boost= precedent:

- **`?price=950`** — the doors' figure on both cards, static doors' arithmetic
  (950 → 47.50 → 997.50). When he names real figures the `.pc-var` blocks take them;
  if the figures differ per programme, each card takes its own, and the collection
  add-on becomes the doors' live `pg-addon` toggle again (per card, with IDs made
  unique — the static preview deliberately carries none).
- **`?cards=stacked`** — one full-width 41/59 door card per programme instead of the
  side-by-side slim pair.

## Learned this round (each one cost a red run)

- **The doors' `button{}` reset is load-bearing for every ported chapter** — without it
  the FAQ rows and petal hits render the UA button box.
- **`minmax(0,1fr)`, never bare `1fr`, a THIRD time** — the pair grid: a flex card's
  min-content is its widest child (+104px at 320). Same lesson as `.f-grid` in round one.
- **`.pc-var` must be scoped** — bare `.pc-var{display:none}` loses to
  `.prog-card .pc-price{display:flex}` and the 950 figure showed by default.
- **The slim card is FLEX, not grid** — same `order` interleave, and `margin-top:auto`
  on the CTA is what closes two unequal cards on one line.
- **The flower's arrows are a phone control** (`display:none` above 900) — QA clicks
  them at 390, and petal hits serve desktop.

## Verifying

```bash
npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4 sharp   # ⚠️ ONE install — separate runs prune each other
node tools/qa/programs-page.mjs [--shots]   # THE PAGE, end to end — parity §0, widths, flower, cards+boards, doctors, fader, FAQ
node tools/qa/boost-contrast.mjs            # the hub section that links here
```

⚠️ Run harnesses one at a time — the SwiftShader rule, `tools/qa/README.md`.

⚠️ `.f-grid` on phones is `minmax(0,1fr)`, **not** `1fr` — the doors' fix, re-learned here:
a bare `1fr` track refuses to shrink under `.f-news`'s 22rem preferred width and drags a
+52px sideways scroll in at 320.

## Open

- **Plate encoding.** The four chapter plates are the PNG masters (1–1.4 MB each) referenced
  directly, as the draft already did. Encoding to AVIF+WebP via `tools/encode-plate.mjs`
  (new basenames, BRAND.md's caching rule) is the single biggest page-weight win left.
- **i18n.** English only, like the other service pages so far; the landing page's
  six-language machinery has not been ported here.
- **The booking flow.** `data-book` and the newsletter Join are inert by estate convention —
  see README's *Deliberately unwired controls*. WhatsApp in the header is the live channel.
- **`programs/cards.html`** is the retired diptych lab that seeded the hub's cards; it is
  repo-only working material and nothing links to it. Candidate for `archive/` next time
  someone is filing.
