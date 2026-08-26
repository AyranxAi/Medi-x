# Medi✦X — Medi-Gyn Landing Experience

A single-page, full-bleed marketing site for **Medi-Gyn** (advanced women's
hormone health, menopause and longevity medicine). Editorial magazine layout:
eight full-viewport chapters, photographic plates, six languages.

Live: https://medi-x-gin.vercel.app

## Where to pick this up

⚠️ **[`NEXT_ITERATIONS.md`](NEXT_ITERATIONS.md) is the file to read first.** It carries what is
still open, what is settled and must not be re-opened, and what to run before trusting a change.
[`HANDOFF.md`](HANDOFF.md) and [`HANDOVER_PROCESS_SCULPTURE.md`](HANDOVER_PROCESS_SCULPTURE.md)
are the record of what was built and why, newest first, and each page keeps its own
`HANDOVER.md`.

⚠️ **THE ARCHITECTURE SECTION BELOW DESCRIBES THE LANDING PAGE, NOT THE ESTATE.** It was written
when `index.html` *was* the site. There are now **eight pages** — the landing page, the
`/hormone-balancing/` hub, three service doors, `/functional-medicine/`, `/peptide-therapy/` and
`/programs/`. Everything it says about zero-build, zero-dependency single files is still exactly
true of each of them; the file tree is what has moved on.

**`/programs/` — the booster programmes — went live 2026-08-26** and is no longer the orphan the
older notes describe. It is reached from the hub's `#boosters` pill, carries the doors' process
sculpture (a fourth carrier of the parity contract) and their doctors chapter, and sells **one
programme with two systems at one fee**. Its record is
[`programs/HANDOVER.md`](programs/HANDOVER.md); the round that built it is
[`HANDOVER_BOOSTER_PROGRAMMES.md`](HANDOVER_BOOSTER_PROGRAMMES.md).

## Architecture

The site is **one static HTML file with zero dependencies and no build step**.

```
index.html      the entire site — markup, styles, scripts, translations
fonts/          all typefaces, self-hosted (woff2)
images/         photographic plates and logos (AVIF + WebP)
  coverage/     press-feature cards (staged for a future section)
  sponsors/     partner logos
favicon.svg     brand monogram (favicon.ico for legacy browsers)
```

There is deliberately no framework, bundler or package manager: the page is a
finished editorial artifact, and a single file keeps hosting trivial (any
static host or CDN serves it as-is) and guarantees the design cannot drift
through dependency updates.

## Running locally

Serve the folder over HTTP (fonts and AVIF need a server, not `file://`):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

Pushing to `main` auto-deploys via Vercel. The site is static output only —
no environment variables, no server functions.

## Typography

Four faces, all self-hosted in `fonts/`:

| Face | Role | Licence |
|------|------|---------|
| Playfair (variable, upright + italic) | Editorial headlines | SIL OFL 1.1 |
| MediGyn NOW (300/400/500/700) | Functional text, buttons, body | Proprietary — Medi-Gyn brand |
| MediGyn Megante | Chapter identifiers, chapter-08 title | Proprietary — Medi-Gyn brand |
| Cormorant Garamond (italic) | Chapter-08 pull quotes | SIL OFL 1.1 |

The Playfair/Cormorant `@font-face` blocks mirror Google Fonts' serving CSS,
including `unicode-range` subsetting (latin, latin-ext, cyrillic — Russian
headlines render in Playfair). Do not replace these with a Google Fonts
`<link>`: self-hosting is what guarantees identical rendering on every
network and satisfies EU privacy requirements.

## Languages

Six languages ship in `index.html` itself: English, Arabic (RTL), Simplified
Chinese, French, German, Russian. Mechanics:

- Strings live in inline dictionaries keyed by `data-i18n` attributes
  (136 bound elements; also `data-i18n-aria/-alt/-ph/-content` for attributes).
- The globe button switches language; the choice persists in `localStorage`.
- Arabic flips `dir="rtl"` on the root — flex rows reverse automatically, so
  only physical properties are restated in CSS. Arabic/Chinese/Russian body
  faces load on demand from Google Fonts (the one remaining remote font path).
- The English headline copy carries deliberate `<br>` lockups; other languages
  wrap fluidly, and their line limits were derived per language — re-derive
  before changing any headline's size or wording.

## Images

Every chapter plate ships as AVIF with WebP fallback via `<picture>`. Phones
(`max-width: 899px`, portrait) receive dedicated portrait crops composed so the
copy lands on calm regions of the photograph. Wide plates are ~2400px,
portrait plates ~1400px, encoded at measured quality (PSNR-checked). When
replacing a plate, keep the filename discipline: new name, never an overwrite,
so CDN and browser caches can never serve a stale frame.

## Design constants worth knowing before editing

- Color tokens are defined once in `:root` (`--ivory`, `--cream`, `--burgundy`,
  `--logo-red` — the red is sampled from the wordmark, not invented).
- **Scrim and overlay alpha values are measured minimums, not taste.** The
  gradient stops over photographs were tuned so copy clears WCAG contrast
  floors (4.5:1 small text, 3:1 large) at the worst-case pixel of each plate.
  Comments at each site record the measured values. Lightening a scrim
  requires re-measuring against the actual plate.
- Chapter sections size in `vh` (not `svh`/`dvh`) on purpose: on iOS, `vh` is
  the large, static viewport, which prevents both the toolbar-collapse seam
  and intra-chapter background pan.
- The desktop parallax is gated to `min-width: 900px` and its frame writer is
  guarded against iOS Safari's toolbar `resize` events — see the comment at
  the guard before changing scroll or resize handling.
- Buttons: one primary pill material (translucent brand red with backdrop
  blur) plus three deliberate exceptions (hero secondary, chapter-07 globe,
  chapter-08 press), each with its own measured rationale in the CSS.

## Deliberately unwired controls

Four controls are intentionally inert while their destinations are still being
designed — do not "fix" them by pointing them at placeholder URLs:

- **Book consultation** (header, chapter 01, chapter 03) — awaits the real
  booking flow.
- **Join menoSTART** (chapter 07) — awaits its programme destination.
- **Hormone quiz** (chapter 01) — the feature is not yet built.
- **Newsletter Join** — collects the address but is not yet connected to a
  CRM (planned: Zoho, with source tracking).

## Accessibility

Interactive elements carry ARIA labels (translated per language), the pathway
accordion is keyboard-operable, and `prefers-reduced-motion` disables the
parallax. Contrast floors are treated as hard constraints (see above).

<!-- repo-only -->
## Development repository notes

These folders are internal working material and are **not part of the
distributable site** (a handover package excludes them):

- `archive/` — source masters, retired plates, superseded variants, press
  scans. Nothing in `index.html` references it.
- `tools/` — internal asset-generation helpers.

Operational: the Vercel project deploys commits authored by the repository
owner account; verify a deploy via the commit status API rather than polling
the production domain (bot protection rate-limits repeated requests). A
GitHub Pages mirror of `main` serves as a secondary check.
<!-- /repo-only -->
