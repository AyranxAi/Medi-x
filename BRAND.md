# Medi✦X — Design Constants

**v2 · 2026-09-02.** The visual system as shipped across the **eight-page estate** —
the landing page, the `/hormone-balancing/` hub, the three doors
(`/hormone-therapy-bhrt/`, `/modern-menopause/`, `/testosterone-top-up/`),
`/functional-medicine/`, `/peptide-therapy/` and `/programs/`. Every value here is
live in a `:root` block or a rule you can grep for; this sheet exists so nobody has
to reverse-engineer eight stylesheets to learn the rules.

v1 (2026-08-24) described the landing page alone. What moved between the two is
listed at the end, under **What changed since v1**, and the questions that only the
owner can answer are under **Open — his to answer**.

---

## Palette

### The core — unchanged since v1, verbatim on all eight pages

| Token | Hex | Role |
|---|---|---|
| `--ivory` | `#FAF7F1` | Page ground on every page. The canvas colour of `html` itself (rubber-band strip) |
| `--cream` | `#F4EDE1` | The alternating ground — one beat of two on the doors |
| `--line` | `#DED4C2` | Hairlines, dividers, the ghost button's rim |
| `--burgundy` | `#5C1F31` | The brand's deep wine — pathway scrims, the doors' dark `.turn` band, headings on tinted grounds |
| `--rose` | `#C79A92` | Accent rose. **A wash, never text** — 2.06:1 on the dawn |
| `--logo-red` | `#8E2D3A` | **The one red.** Sampled from the wordmark artwork (median of its opaque pixels), never invented. CTAs, favicon ground, italic accents |
| `--red-hover` | `#A33648` | The one red's hover ink — the same red two steps lighter, never a hue change. Promoted to a token on the doors |
| `--gold` | `#C2A05E` | Gold accent, open-panel hairline, favicon spark, `::selection` on the landing page, the champagne on burgundy |
| `--gold-deep` | `#8A6A34` | Gold for **dark grounds** and for ivory. ⚠️ Fails small-text contrast on every other light ground — see *The golds* |
| `--gold-tint` | `#F1E7D2` | Pale gold wash. The gold door's and `/programs/`' band ground |
| `--ink` | `#2E2228` | Dark plum — landing body ground, dark-key text, body copy on the doors |
| `--ink-soft` | `#6A585F` | Secondary ink — labels, band action text |

**The one-red rule, still the rule:** `--logo-red` (A9) is the only red allowed as a
CTA anywhere on the estate. It came from the logo itself so mark, buttons and favicon
can never drift apart. The door themes and the petal slab (below) are accents and
materials; neither is permitted to touch a button.

### The grounds — five light, two dark

The estate is built on **beats of ground**, not on one white sheet. The doors tried a
single ivory ground on 2026-08-17 and it came straight back — *"why is everything
white now, what happened to our colour palette."* Below the 3D scene a door page runs
~5,000px with no dark beat; bands are the only thing dividing that into chapters.
⚠️ **A seam test cannot see a field.** If a ground is ever reconsidered, render the
whole page top to bottom first.

| Ground | Hex | Where |
|---|---|---|
| Ivory | `#FAF7F1` | Every page's base; the flower's petals since 2026-08-24 |
| Cream | `#F4EDE1` | Alternating chapters on the doors and the hub |
| Porcelain `--ps-ground` | `#F0EBE7` | **The flower chapter only**, on all four carriers. It is the petals' own old colour, moved from the petals to the ground under them (his call 2026-08-24). ⚠️ A third ground on purpose, **not** cream — cream is +4 red, +2 green and six less blue than the colour he pointed at. Ground and petals separate by 1.107; they move together or not at all |
| Dawn `--dawn` | `#F6E7E1` | The rose dawn — the ground the 3D scene rises **to**, and the chapter after it stands on it so there is no seam. ⚠️ Must stay equal to `BG_B=[246,231,225]` in the scene script; two copies of one colour in two languages |
| Door tints | `#F2E1E2` · `#F9E4DE` · `#F1E7D2` | The returning-patient band's ground, keyed to each door's orb (below). `/programs/` falls through to the gold tint |
| Dune | `#FBF8F2 → #F6F1E8` | The testosterone hero's two-stop ground under the risen sun. Lands on `--ivory` at 78% |
| Ink | `#2E2228` (panels `#241A1F`) | The landing page's body and its dark panels |
| Burgundy | `#5C1F31` | The doors' `.turn` band — ivory copy, champagne (`--gold`) accents at 5.00:1, **solved not picked** |

### The golds — one hue, five values, each a function of its ground

⚠️ **`--gold-deep` is specced "AA on ivory" and that is the only light ground it
passes.** Every darker gold below exists because a ground moved and the gold had to
move with it. Measured at the rule site, not the swatch:

| Value | Hex | Ivory | Cream | Dawn | Gold tint | Used for |
|---|---|---|---|---|---|---|
| `--gold` | `#C2A05E` | wash only | wash only | wash only | — | Hairlines, sparks, dark-ground accents (5.00:1 on burgundy) |
| `--gold-deep` | `#8A6A34` | 4.69 ✓ | **4.31 ✗** | **4.16 ✗** | **4.08 ✗** | Ivory-ground gold text, dark-ground gold |
| `--gold-gloss` | `#7F6230` | 5.32 ✓ | 4.89 ✓ | 4.72 ✓ | 4.632 ✓ | The flower's eyebrow, `.seg-gloss`, the band eyebrow on the gold pages. ⚠️ Retired and restored inside one day (2026-08-17) — it is a function of the ground, not a duplicate |
| `--gold-text` | `#866732` | 4.91 ✓ | 4.51 ✓ | — | — | `/programs/` only, all small gold text. Its own note says *"worth promoting site-wide"* |
| Hero kicker | `#6E5427` | 5.79 ✓ | — | — | — | The landing hero's kicker on the ivory wash — the only place a v1 token did not survive the flip |

**4.632 (`--gold-gloss` on `--gold-tint`) is the tightest pair in the estate's new
work.** Deepen the tint and the gloss goes under with it.

### The door themes — burgundy · rose · gold

His call 2026-08-27: each door page wears the colour of its glass orb on
`/hormone-balancing/`. Confirmed against the real orb images, not guessed.

| Door | Orb | `--door` | `--door-deep` | `--door-tint` |
|---|---|---|---|---|
| `/hormone-therapy-bhrt/` | burgundy | `#5C1F31` | `#5C1F31` (10.28:1 on the dawn) | `#F2E1E2` |
| `/modern-menopause/` | rose | `#C79A92` | `#8C5148` (5.15 dawn · 5.24 porcelain · 5.80 ivory) | `#F9E4DE` |
| `/testosterone-top-up/` | gold | *none — the estate's gold already is the theme* | `--gold-deep` / `--gold-gloss` by ground | `--gold-tint` |

⚠️ **`--door-deep` is measured, not picked.** The rose is a 2.06:1 wash and can never
be text, so the deep variant is the rose darkened in-family until it clears the 4.5
body floor on the **worst** ground it stands on. Re-measure if a ground moves.

⚠️ **The gold door has no `--door` tokens on purpose.** Mapping them in would collapse
`--gold-deep` and `--gold-gloss` into one "deep", which the gloss note forbids.

**What the theme reaches — six sites, all light-ground accent chrome:** kicker
dashes, the scroll drip, the chip hover, `.chapter-mark`, `.seg-gloss`, `::selection`
(door tint under burgundy text on the doors; gold under ink on the landing page).

**What the theme does not touch, and each exclusion is load-bearing:** CTAs keep
`--logo-red`; the money card and the process sculpture keep their shared gold
grammar; the dark `.turn` band keeps its solved champagne; the scene keeps its
measured stage colours.

### The petal slab — materials, not swatches

His call 2026-08-29: *"making it pink or gold the same color as the orb."* The deep
edge under the flower's plate wears the door's orb. The script reads four tokens per
page and stays byte-identical on all four carriers.

| Page | Slab | Ramp (top · mid · foot) | Renders as |
|---|---|---|---|
| `/hormone-therapy-bhrt/` | crimson `#A1213B` | `#D02F4F` · `#AE1E3B` · `#90132C` | `rgb(169,64,79)` |
| `/modern-menopause/` | pink `#C9366C` | `#D36990` · `#D23770` · `#BE235C` | `rgb(208,76,117)` |
| `/testosterone-top-up/` | gold `#9F7123` | `#CD9432` · `#AC7920` · `#8F6214` | `rgb(167,123,64)` |
| `/programs/` | shares gold | same | same |

⚠️⚠️ **The rendered slab is not the token, and a swatch will lie to you.** The scene's
lighting lifts and desaturates whatever it is given. The first attempt kept the
burgundy's darkness and rotated only the hue; on the page it moved by eight of 255 and
he could not see it. **Saturation and lightness survive the lighting; hue alone does
not.** The harness requires the three doors to separate by ≥30 on the painted canvas.
Rendered separation as shipped: crimson↔pink 56 · crimson↔gold 61 · pink↔gold 82.

**Cancelled, and not on main:** a deeper menopause pink. Deepening at the same hue
walks it into the crimson (30 and then 26 apart — fails). The pick that was verified
green and then withdrawn is `#AD1A6D` with the hue moved to 326, 42 from the crimson.
⚠️ If the pink is ever deepened, the hue must move with it.

### Never text

`--rose`, `--gold`, `--line` and every tint are washes, rims and hairlines. The two
ink families that carry copy are the plums (`--ink`, `--ink-soft`, `--burgundy`) and
the measured golds (`--gold-gloss`, `--gold-text`, `#6E5427`).

---

## Typography

### The four faces

| Face | Files | Weights | Role | Licence |
|---|---|---|---|---|
| **Playfair** (variable, not Playfair Display) | `playfair-normal-var-*` · `playfair-italic-var-*`, latin / latin-ext / cyrillic / cyrillic-ext | 300–900 axis, **held at 450** | Editorial headlines, the big word, definitions, the band heading | SIL OFL 1.1, self-hosted |
| **MediGyn NOW** | `medigyn-now-{300,400,500,700}` | 300 · 400 · 500 · 700 | Everything functional: body, nav, buttons, kickers, labels | Proprietary — Medi-Gyn brand asset |
| **MediGyn Megante** | `medigyn-megante-400` | 400 | Chapter marks, eyebrows, prices, doctors' names, scene titles, the doors' quote voice | Proprietary — Medi-Gyn brand asset |
| **Cormorant Garamond** | `cormorant-garamond-italic-*`, latin / latin-ext / cyrillic / cyrillic-ext | italic 300 · 500 | Patient stories only — chapter 08 and the doors' testimonials | SIL OFL 1.1, self-hosted |

All four are self-hosted in `fonts/` with `font-display:swap`. The Playfair and
Cormorant blocks mirror Google Fonts' serving CSS including `unicode-range`
subsetting. Do not replace them with a Google Fonts `<link>`: self-hosting is what
guarantees identical rendering on every network and satisfies EU privacy rules.
NOW and Megante are Latin-only (308 glyphs) — see *Languages*.

**Playfair, why and how.** Chosen over GFS Didot and Bodoni Moda (2026-08-03) because
it carries an optical-size axis **and** a drawn italic. Every headline pins
`font-weight:450`, `font-optical-sizing:none`, `font-variation-settings:'opsz' 30`.
The low optical size thickens the horizontal hairlines while keeping the Didot-like
proportions. ⚠️ **Any large Playfair outside `h1/h2/h3` must re-pin both
declarations.** Left to `auto`, a 116px word swings to the display cut and the H's
crossbar vanishes — "BHRT" rendered as "BIIRT". Letter-spacing was the wrong suspect.

**Italics.** Landing headlines: italic 450 in `--rose` (the hero's italic is
`--logo-red`, one ink with the mark; chapter 06's inherits its heading's colour by his 2026-08-02 call).
Door headlines: italic **430** in `--logo-red`.

**Megante's promotion, Cormorant's demotion (2026-08-10).** *"Cormorant unreadable at
size — Megante everywhere it was."* On the doors `--quote` is Megante and dresses the
scene's labels and answers, the chips and the `.turn` quote. Cormorant survived in
**one** role, as a second token `--quote-story`, because the testimonials must match
chapter 08 on the landing page. Two names because there are two decisions; collapsing
them silently moves the scene.

### Body copy — two weights, one rule

| Page | Face · weight | Size | Leading | Why |
|---|---|---|---|---|
| Landing | NOW **400** | `clamp(1.05rem,1.2vw,1.2rem)` = 16.8–19.2px | 1.62 | *"Almost all copy on this site sits over a photograph, and Light goes to mush there"* |
| Doors, hub, programs | NOW **300** | 16px | 1.6 | Ivory ground, no photograph under the copy |
| Door hero sub | NOW 300 | `clamp(18px,1.6vw,23px)` | 1.75 | Grew from 19px to 23px at the ceiling, his note 2026-08-13 |
| `.turn` band paragraphs | NOW 300 | `clamp(15px,1.25vw,18px)` | 1.85 | Ivory on burgundy |

### The type scale — landing page

Root is the browser's 16px. Chapter headline lockups in English are deliberate
`<br>` breaks; the other five languages wrap fluidly with per-language ceilings.

| Role | Face | Spec | 390 phone | 1440 | ≥1500 |
|---|---|---|---|---|---|
| Hero `h1` | Playfair 450 / opsz 30, lh 1, `-.018em` | `clamp(2.48rem,5.78vw,4.44rem)` | 40px | 71px | `clamp(4.94rem,5.43vw,5.93rem)` = 79–95px |
| Chapter `h2` | same | `clamp(2.15rem,4.94vw,3.76rem)` | 34px | 60px | `clamp(4.19rem,4.62vw,4.5rem)` = 67–72px (cap measured against CLP 48–54, VIVAMAYR 72) |
| Menopause `h2` | same | `clamp(3rem,7.5vw,7.2rem)` | 48px | 108px | 115px |
| Chapter 08 head | Megante 400, `.02em` | `clamp(1.05rem,2.33vw,2.8rem)` | 17px | 34px | 45px |
| Pull quotes | Cormorant italic 500, lh 1.22 | `clamp(1.755rem,2.988vw,3.213rem)` | 29px | 43px | 51px |
| Pathway titles | Megante 400, lh 1.18 | 26 → 29 → 34 → 39px by breakpoint | 26px | 39px | 39px |
| Body | NOW 400, lh 1.62 | `clamp(1.05rem,1.2vw,1.2rem)` | 17px | 17px | 19px |
| Menu items | NOW 500, `-.01em`, lh 1.25 | `clamp(1.05rem,2.5vw,1.5rem)` | 17px | 24px | 24px |

⚠️ The ≥1500 hero cap is a **width limit wearing a height's clothing**: the longest
line must fit the 704px column or the hero breaks to four lines. It has moved with
every face the page has worn — 6.5rem Didot, 6rem Bodoni Moda, 5.93rem Playfair.

### The type scale — doors, hub, programs

| Role | Face | Spec | 390 phone | 1440 |
|---|---|---|---|---|
| Hero `h1` | Playfair 450 / opsz 30, lh 1.05, `-.01em` | `clamp(42px,7vw,100px)`; phone `clamp(28px,9.2vw,44px)` | 36px | 100px |
| Section `h2` | same | `clamp(34px,4.6vw,62px)` | 34px | 62px |
| The big word (`.seg-word`, "BHRT") | Playfair 450 / opsz 30, lh .96, `.015em` | `clamp(48px,8vw,116px)` | 48px | 115px |
| Definition (`.seg-def`) | Playfair 450, lh 1.42 | `clamp(21px,2.45vw,34px)`; phone 17px | 17px | 34px |
| Scene title | Megante 400, lh 1, `.02em` | doors `clamp(44px,7vw,96px)` · hub `clamp(52px,7.4vw,104px)` | 44 / 52px | 96 / 104px |
| Scene beat | Playfair 450, lh 1.22 | `clamp(27px,3.5vw,49px)`; reveal `clamp(44px,6.5vw,90px)` | 27px | 49px |
| Scene labels & answers | Megante (`--quote`), lh 1.1 | `clamp(21px,2.35vw,34px)` | 21px | 34px |
| `.turn` quote | Megante 400, lh 1.22, ivory | `clamp(30px,4.4vw,60px)` | 30px | 60px |
| Hub door titles | Megante 400, lh 1.1, `-.02em` | `clamp(25px,2.5vw,36px)` | 25px | 36px |
| Doctors' names | Megante 400, lh 1.1, `-.02em` | `clamp(23px,2.2vw,31px)` | 23px | 31px |
| Programme price | Megante 400, tabular, lh 1 | `clamp(42px,4.6vw,68px)`; phone `clamp(32px,8.5vw,42px)` | 36px | 66px |
| Programme card `h3` | Playfair 450 | `clamp(27px,2.9vw,41px)`; phone `clamp(25px,7vw,33px)` | 27px | 41px |
| Patient stories | Cormorant italic 500, lh 1.22 | `clamp(1.755rem,2.988vw,3.213rem)` | 29px | 43px |
| Returning band heading | Playfair 450 / opsz 30, lh 1.15, `-.005em`, burgundy | `clamp(24px,2.1vw,29px)` | 24px | 29px |
| Menu items | NOW 500 | `clamp(1.05rem,2.5vw,1.5rem)` — ported from the landing page | 17px | 24px |

### The small-caps system

Every uppercase label on the estate is one of these. Tracking grows as size shrinks.

| Label | Page | Face | Size | Tracking | Colour |
|---|---|---|---|---|---|
| Chapter kicker | landing | Megante 400 | `.68rem` = 10.9px | `.16em` | `#6E5427` on the hero; tokens elsewhere |
| Kicker | doors | NOW 500 | 11px | `.32em` | `--logo-red` text, `--door` dash |
| Chapter mark | doors | Megante 400 | 13px | `.24em` | `--door-deep` (champagne on the `.turn` band) |
| Eyebrows (card, band) | doors | Megante 400 | 12px | `.24em` | `--door-deep` → `--gold-gloss` |
| `.seg-gloss` | doors | Megante 400 | `clamp(14px,1.35vw,19px)` | `.15em` | `--gold-gloss` — 19px regular, so its floor is 4.5, not 3.0 |
| Button label | landing | NOW 500 | `.66rem` = 10.6px (`.72rem` in chapters) | `.22em` | ivory |
| Button label | doors | NOW 500 | 13px | `.12em` | ivory |
| Link-arrow | hub | NOW 500 | 11.5px | `.2em` | burgundy |
| Tag | landing | NOW | `.6rem` = 9.6px | `.26em` | ivory at 55% |
| Scroll hint | both | NOW | `.55rem` = 8.8px / 10px | `.3em` | — |
| Footer heads | landing | NOW 500 | `.72rem` | `.28em` | — |
| Footer base | landing | NOW | `.7rem` | `.24em` | — |

### Languages

Six languages ship on the **landing page only** (English, Arabic RTL, Simplified
Chinese, French, German, Russian). The seven other pages are English. NOW and Megante
have no Cyrillic, Arabic or CJK, so three fallback stacks load **on demand from Google
Fonts** — the one remaining remote font path; an English visitor downloads none of it:

| Language | Editorial | Functional | Accent / quote |
|---|---|---|---|
| Arabic | Noto Naskh Arabic | IBM Plex Sans Arabic | Noto Naskh Arabic |
| Chinese | Noto Serif SC | Noto Sans SC | Noto Serif SC |
| Russian | **Playfair** (ships Cyrillic) | Jost — the nearest free geometric to NOW | Megante → Playfair; quotes keep **Cormorant** (ships Cyrillic) |

---

## Buttons

One primary material on all eight pages: **`--logo-red` at 85% over a 12px backdrop
blur**, radius `--btn-radius:999px` (phones: 90% — touch never sees the hover that
firms the desktop pill). Hover: `--red-hover` at 94%, never a hue change. ⚠️ The
firm-up does not raise the label: hover 5.58 vs rest 5.60. Past ~94% the label slides
toward `#A33648`'s own 5.34 and buys nothing.

| Variant | Where | Spec |
|---|---|---|
| Primary `.cta` | landing | height `3.05rem`, padding `0 1.75rem`, label NOW 500 10.6px `.22em` uppercase, 1px rim at white 20%, inset top highlight, `saturate(150%)` in the blur |
| Primary `.btn` | doors, hub, programs | padding `18px 34px`, label NOW 500 13px `.12em` uppercase, arrow nudges 4px on hover |
| Ghost `.btn.ghost` | doors | transparent, burgundy text, 1px `--line` rim, no blur |
| Returning-band action `.rb-act` | four flower carriers | **72px tall** (64 on a phone), 1px gold at 60%, ground `rgba(255,253,249,.5)`, label NOW 400 16px `--ink-soft`, burgundy icon and arrow. Hover: `#FFFDF9` + `--gold-deep` rim. Press: the door tint |

Three deliberate exceptions on the landing page, each with its measured rationale in
the CSS: hero secondary (ivory reverse), chapter-07 globe (frosted glass),
chapter-08 press (ivory outline). Do not "unify" them.

⚠️ **The returning-patient band is not settled** (his word, 2026-08-29g). Its sizes,
type scale, hairlines and hover colours are free to change; its phone gap (8px), its
target height (64px) and its margin above (`clamp(104px,21vh,240px)`, which keeps it
out of the flower's viewport) are arithmetic and asserted exactly.

---

## Scrims and washes

- Pathway scrims: `--burgundy` at the section's original alpha geometry.
- Light-key chapters: ivory washes that end before the photograph's subject.
- **Every alpha is a measured minimum**, not taste: ivory/ink copy clears WCAG floors
  (4.5:1 small, 3:1 large) at the *worst pixel* of its own rectangle on the real
  plate. Method: render, hide the copy, sample the ground behind it, take the worst
  2% of pixels. Changing a plate or an alpha requires re-measuring.
- The same method is the authority for every gold and every `--door-deep` above.
  `tools/qa/` carries the harnesses — `door-contrast`, `boost-contrast`,
  `final-contrast`, `returning-band`, `process-sculpture` — and each assertion was made
  to fail on purpose before it was trusted.

---

## Imagery

Wide plates ~2400px, phone portraits ~1400px, AVIF + WebP via `<picture>`, encoded at
PSNR-checked quality. Replacement discipline: new filename, never an overwrite — no
cache can serve a stale frame. Phone crops are composed so the copy lands on calm
regions.

**The hub's three orbs** — burgundy, rose, gold glass on ivory — are photographic
renders (`images/service-circle-*.webp`), and they are the source of the door themes.
Change an orb and its door's tokens follow.

**The testosterone hero is not a photograph** (his standing call, 2026-08-19). It
draws three things: the two-stop ivory ground, the risen sun (core and halo, breathing
on an 11-second sine) and the crest curve in gold at 45%. Three rules live in the
script's header: the canvas id stays `#silk`; the sun is **risen, never hidden**; no
strokes on the sand, ever — texture, if it returns, comes from tone.

---

## Logo & favicon

Red wordmark (`images/logo-red.webp`) is the default at every scroll state; ivory
(`logo-ivory.webp`) survives only in the open menu. Height `clamp(36px,3.6vw,50px)`,
aspect 626/160.

**The copy line.** His call 2026-08-03: every chapter's copy starts on the stem of the
*i* in medi·gyn, so one vertical runs from the wordmark down the whole page. It is
derived, never typed — `--copy-x` is built from the header inset, the logo height, the
file's aspect ratio and the stem's position (0.44728 of the width) minus a 1px serif
correction. Change the artwork and only `--i-stem` needs re-measuring.

Favicon: ivory monogram + gold spark (`#C2A05E`) on an A9 ground — matching the
page's one red.

---

## Motion

One curve for the estate, `--ease: cubic-bezier(.22,.61,.36,1)`; `--swing:
cubic-bezier(.34,.75,.24,1)` for the dots' width; the flower's own
`cubic-bezier(.22,1,.36,1)` at 850ms. The header **dissolves** rather than slides:
out in `.9s` because that is where the luxury is, in at `.45s` because a bar you have
just asked for should not make you wait.

---

## Spelling — UK English

**His call, 2026-08-24f:** *"the whole website, it's going to be UK English, not
American, so we will always use personalised and not personalized."* The estate was
already mostly British by accident (`programme`, `ageing`, `gynaecology`,
`optimise`); this makes it a rule.

Reaches: **visible copy only** — `-ise`/`-isation`, `programme`, `ageing`,
`gynaecology`, `practise` (verb) / `practice` (noun), `-our`, `-re`.

Does **not** reach, and each exclusion is load-bearing:

- **Code.** `scroll-behavior`, `behavior:"smooth"`, `color`, `center`, WebGL
  `program` — these are API and CSS identifiers. Changing one breaks the page.
- **Comments and build notes.** They quote his instructions verbatim and record
  what happened. One note deliberately spells `personalized` *because it is naming
  the wrong spelling*. Rewriting the record falsifies it.
- **Proper nouns.** The **American Academy of Anti-Aging** keeps its own spelling
  beside the estate's "Anti-Ageing". They disagree on purpose; do not make them
  agree.
- **`estrogen` / `estradiol`.** ⚠️ **HIS CALL 2026-08-24f, PUT TO HIM AND ANSWERED:**
  the estate keeps the **international non-proprietary names**, not the NHS/BNF
  `oestrogen` / `oestradiol`. These are the names that appear on a prescription and
  the ones patients search for; looking American here is the pharmacological
  standard, not a slip. This is the one place the UK rule stops at a word boundary,
  so it is written down rather than left to be re-litigated. ~33 instances estate-wide.

---

## The brand book, and how the website maps onto it

The clinic's **Brand Refresh Guidelines** (George Mikhaeel; not in this repo — the
owner holds the PDF) is the source the CSS comments cite. It names three colours,
two text inks, two supporting tones and four faces. The website keeps every one of
its relationships and adds measured values where a print swatch had to become
text on a screen. **Where the two disagree, the book is the brand and this sheet is
the website; both are true, and the mapping is:**

| Brand book | Hex | Website token | Hex | Note |
|---|---|---|---|---|
| Burgundy (primary) | `#8E2D3A` | `--logo-red` | `#8E2D3A` | Identical — the site sampled it from the wordmark and landed on the book's value. ⚠️ The site's `--burgundy` (`#5C1F31`) is a **different, deeper wine** the book does not have; it carries scrims and the dark band, never a button |
| Warm champagne (luxury accent) | `#E2D3B3` | `--gold` / `--gold-tint` | `#C2A05E` / `#F1E7D2` | The book's champagne is a wash (under 1.3:1 on ivory). The site keeps it in the logo's DNA element and works from the gold family for accents; the three darker golds exist only because a wash cannot be text |
| Porcelain ivory (background) | `#FBF7F2` | `--ivory` | `#FAF7F1` | One step apart; the site value predates the book's and is pinned in every measured contrast |
| Main texts | `#2B2624` | `--ink` | `#2E2228` | The site's plum is two steps redder |
| Secondary texts | `#6D625E` | `--ink-soft` | `#6A585F` | Same role |
| Feminine accent | `#9B5A68` | `--rose` · rose door deep | `#C79A92` · `#8C5148` | The site's rose is lighter and a wash; where it must carry text it is darkened to `#8C5148` |
| Soft warmth | `#E8D6D9` | `--dawn` · door tints | `#F6E7E1` · `#F2E1E2` / `#F9E4DE` | Same role, warmer |
| Didot — logo & headlines | — | Playfair 450 / opsz 30 | — | Didot stays in the wordmark artwork. Headlines are Playfair because Didot has no optical axis and no drawn italic for the web |
| Megante — display titles | — | `--accent` / `--quote` | — | Same, plus the doors' quote voice since 2026-08-10 |
| NOW Light — body | — | NOW 300 / 400 | — | Light on ivory as the book says; **Regular over photographs** on the landing page. The book allows Poppins as a substitute; the site uses Jost for Cyrillic only |
| Cormorant Garamond — quotes | — | `--quote-story` | — | Same, narrowed to patient stories |
| Clear space: X = the m's height | — | the copy line on the *i* stem | — | The book's rule for the mark; the site adds the derived copy column |
| Logo on dark = the hero version | — | red wordmark default | — | ⚠️ The book calls the white-on-burgundy logo the website header's hero version. The site's ground is ivory, so the **red mark is the default** and ivory appears only in the open menu |

The rebuilt guidelines in the book's own layout, with these values painted, are
published alongside this sheet.

---

## What changed since v1 (2026-08-24 → 2026-09-02)

| Area | v1 said | v2 says |
|---|---|---|
| Scope | one page | eight pages, one core palette verbatim on all of them |
| Reds | one red, hover `#A33648` in prose | `--red-hover` is a token on six pages; the slab quartets and the door themes are the only other reds and pinks, and none may touch a CTA |
| Grounds | ivory, cream | + porcelain `--ps-ground`, the dawn `--dawn`, three door tints, the dune's two stops. The single-ivory experiment and why it failed |
| Golds | `--gold`, `--gold-deep`, `--gold-tint` | + `--gold-gloss`, `--gold-text`, the hero kicker's `#6E5427` — five values, each measured against its ground; `--gold-deep` fails everywhere but ivory |
| Door themes | — | burgundy · rose · gold, six accent sites, measured `--door-deep`, the gold door's deliberate absence of tokens |
| Petal slab | — | crimson · pink · gold materials, rendered values, the ≥30 separation rule, the cancelled deeper pink |
| Playfair | "held at 450, opsz 30" | + the re-pin rule for any large Playfair outside a heading; italic 430 in `--logo-red` on the doors |
| Megante | chapter marks, ch-08 title | the doors' quote voice, eyebrows, prices, doctors' names, scene titles — the 2026-08-10 call |
| Cormorant | pull quotes | patient stories **only**, as its own token `--quote-story` |
| Body | — | NOW 400 over photographs, NOW 300 on ivory; sizes and leading per page |
| Type scale | "~60px at 1440, ~34px on phones" | full tables for both page families, at 390 and 1440 |
| Small caps | — | the tracking ladder, twelve labels |
| Buttons | one material, three exceptions | + the doors' `.btn` spec, the ghost, the band's 72px actions |
| Languages | six | six on the landing page, English elsewhere; the three fallback stacks |
| Motion | — | the curves and the header's two speeds |

---

## Open — his to answer

1. **Promote `--gold-text` (`#866732`) estate-wide?** It clears cream and ivory in one
   value and `/programs/` already says it should. It would retire the ad-hoc
   `#6E5427` on the landing hero and put every small gold on one token.
2. **The doors' body weight.** NOW 300 on the doors, 400 on the landing page. The rule
   (Light goes to mush over photographs) is sound, but is 300 at 16px the reading
   weight he wants for a 5,000px page, or should the doors match the landing's 400?
3. **The menopause pink** — leave `#C9366C`, or ship the verified deeper `#AD1A6D`?
4. **The gold door's identity.** With no `--door` tokens it is "the estate's gold";
   if the orbs are ever re-rendered, does the testosterone door keep gold?
5. **Does the returning band keep its outline actions**, or take the primary red? The
   one-red rule says outlines; the band is due to change and he has not said how.
6. **Cormorant's last role.** The stories are the only place it survives. Keep it for
   parity with chapter 08, or let Megante take the stories too and retire a face?
7. **The landing page's italic colour** is still marked provisional in the CSS
   (rose on chapters, red on the hero, ivory on chapter 06). Settle it?
8. **Languages on the doors.** English only today; the four menu labels are English
   in all six languages on the landing page. Are translations coming?
9. **The dune's halo and crest** — the three open items in the dune handover are
   still his.
