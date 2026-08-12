# Medi✦X — Design Constants

The visual system as shipped. Every value here is live in `index.html`; this
sheet exists so nobody has to reverse-engineer the CSS to learn the rules.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--ivory` | `#FAF7F1` | Page ground, light-key copy ground |
| `--cream` | `#F4EDE1` | Soft panel ground |
| `--line` | `#DED4C2` | Hairlines, dividers |
| `--burgundy` | `#5C1F31` | The brand's deep wine — pathway scrims |
| `--rose` | `#C79A92` | Accent rose |
| `--logo-red` | `#8E2D3A` | **The one red.** Sampled from the wordmark artwork (median of its opaque pixels), never invented. CTAs, favicon ground, italic accents |
| `--gold` | `#C2A05E` | Gold accents, open-panel hairline |
| `--gold-deep` | `#8A6A34` | Gold for dark grounds |
| `--gold-tint` | `#F1E7D2` | Pale gold wash |
| `--ink` | `#2E2228` | Dark plum — body ground, dark-key text |
| `--ink-soft` | `#6A585F` | Secondary ink |

**The one-red rule:** `--logo-red` (A9) is the only red allowed on the page.
It came from the logo itself so mark, buttons and favicon can never drift apart.

## Typography

| Face | Role | Notes |
|---|---|---|
| Playfair (variable) | Editorial headlines | Held at weight 450, low optical size (30). Self-hosted, SIL OFL |
| MediGyn NOW (300–700) | Everything functional | Proprietary — Medi-Gyn brand asset |
| MediGyn Megante | Chapter marks, ch-08 title | Proprietary — Medi-Gyn brand asset |
| Cormorant Garamond (italic 300/500) | Pull quotes | Self-hosted, SIL OFL |

Chapter headlines run ~60px at 1440 (capped growth on larger screens), ~34px
on phones. English headline lockups are deliberate `<br>` breaks — the same
words share a line on every display. Other languages wrap fluidly with
per-language derived limits.

## Buttons

One primary material: **`--logo-red` at 85% over a 12px backdrop blur**
(phones: 90% — touch never sees the hover that firms the desktop pill).
Hover: lighter ink `#A33648` at 94%, never a hue change.
Three deliberate exceptions, each with its measured rationale in the CSS:
hero secondary (ivory reverse), chapter-07 globe (frosted glass),
chapter-08 press (ivory outline). Do not "unify" them.

## Scrims and washes

- Pathway scrims: `--burgundy` at the section's original alpha geometry.
- **Scrims over photographs are `--ink`'s hue at falling value — never a saturated wine.**
  `#2E2228` is `(46,34,40)`, ratios `1 : .739 : .870`; a scrim holds those ratios and drops
  the value. 05's ramp ran `rgba(42,19,28,.70)` until 2026-08-12 — twice the chroma — and
  over the near-black half of its plate that stop *was* the colour you saw, so it read as a
  red filter on the picture rather than as shadow. **A scrim is a shadow. If you can name its
  hue, it is a second red**, and the one-red rule above is the thing it is breaking.
  Counterintuitive but measured: taking the chroma out **gains** contrast, because a saturated
  plum is lighter than the ink at the same perceived density.
- Light-key chapters: ivory washes that end before the photograph's subject.
- **Every alpha is a measured minimum**, not taste: ivory/ink copy clears
  WCAG floors (4.5:1 small, 3:1 large) at the *worst pixel* of its own
  rectangle on the real plate. Method: render, hide the copy, sample the
  ground behind it, take the worst 2% of pixels. Changing a plate or an alpha
  requires re-measuring.

## Imagery

Wide plates ~2400px, phone portraits ~1400px, AVIF + WebP via `<picture>`,
encoded at PSNR-checked quality. Replacement discipline: new filename, never
an overwrite — no cache can serve a stale frame. Phone crops are composed so
the copy lands on calm regions.

## Logo & favicon

Red wordmark is the default at every scroll state; ivory survives only in the
open menu. Favicon: ivory monogram + gold spark on an A9 ground — matching
the page's one red.
