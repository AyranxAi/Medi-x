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

## Verifying

```bash
python3 -m http.server 8410           # from the repo root
# widths 320–1920: no sideways scroll; header states; burger; + rows; reveal;
# beats draw; hub pill wired — the round's sweep lived in a temp harness and
# came back ALL GREEN 2026-08-26; re-create from this list or promote into
# tools/qa/ if this page starts changing often.
node tools/qa/boost-contrast.mjs      # the hub section that links here — 12/12 after wiring
```

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
