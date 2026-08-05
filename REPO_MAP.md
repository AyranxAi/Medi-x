# Medi✦X — repository map

**Reorganised 2026-08-05.** One rule produced this layout: **if `index.html`
does not reference a file, the file does not live next to the ones it does.**
Everything the page renders stays exactly where it was; everything else —
source photographs, rejected candidates, retired frames — moved under
`archive/`. The site's markup was not touched in the reorganisation commit,
and reverting that one commit puts every file back where it came from.

---

## What the page uses (do not move or rename these)

```
index.html            the whole site — markup, CSS, JS, all inline
favicon.ico/.svg      tab icon
fonts/                Megante (wordmark) + NOW (sans) — Playfair, Jost and the
                      Arabic/Chinese faces load from Google Fonts at runtime
images/               ONLY live plates + chrome (see table)
images/sponsors/      the 13 marks on the sponsor belt
images/coverage/      ⚠️ PARKED, not junk — 16 frames for the press-cards
                      feature; index.html comments point here. Leave in place.
tools/press-wordmarks/  generator for the press marquee SVG wordmarks
```

| chapter | desktop / landscape | portrait phones & tablets |
|---|---|---|
| 01 hero | `hero-team-wide-2400` .avif/.webp | `hero-team-phone-1424` .avif/.webp |
| 02 about | `about-report-wide-2399` | `about-report-phone-1425` |
| 03 consult | `consult-room-wide-2399` | `consult-room-phone-1173` |
| 04 pathways | `path-01-bhrt` `path-02-menopause` `path-03-functional` `path-04-peptides` | same |
| 05 team | `team-new-wide-2399` | `team-new-phone-1425` |
| 06 products | `products-glass-wide-2399` | `products-glass-phone-1389` |
| 07 menoSTART | *(no photograph — night gradient + canvas globe)* | same |
| 08 voices/press | `bazaar.webp` (Madame Arabia still) | same |

Chrome: `logo-red.webp` (default), `logo-ivory.webp` (nav-open only).

## archive/ — everything the page no longer looks at

**`archive/sources/`** — the photographs and renders the plates were cut
from, plus candidates that never shipped. His filenames were kept; only
noise names (ChatGPT/Codex exports, opaque IDs) were renamed after looking
at each file:

| new name | was | what it is |
|---|---|---|
| `consult-room-candidate.png` | `ChatGPT …Aug 3… 09_49_28…` (repo root) | consult scene, two chairs — ch03 candidate |
| `veil-portrait-candidate.png` | `ChatGPT …Aug 3… 09_49_33…` (repo root) | grey-haired woman behind sheer curtain |
| `helix-glass-render.png` | `ChatGPT …Jul 31… 07_08_13…` | glass DNA helix + gold ring (early-era art) |
| `products-estrogen-trio-render.png` | `ChatGPT …Jul 31… 08_27_58…` | wine-panel estrogen-cream trio (fed the first `products.webp` era) |
| `about-report-flatlay-render.png` | `ChatGPT …Jul 31… 09_13_58…` | notebook + hormone-report flat-lay (the `about.webp` imagery) |
| `madame-arabia-cover.png` | `ChatGPT …Aug 4… 07_08_27…` | the Madame Arabia cover (ch08's `bazaar.webp` imagery) |
| `team-group-wide-restage.png` | `ChatGPT …Aug 4… 08_48_25…` | restaged 5-woman team, wide |
| `team-group-portrait-restage.png` | `ChatGPT …Aug 4… 08_48_32…` | restaged team, portrait, clear floor below |
| `product-suite-render.png` | `Codex …Aug 1… 05_26_44…` | beige-marble product trio (the `product-suite` era) |
| `product-wine-portrait-master.png` | `exec-741e40c0-….png` | 941×1671 master of `product-wine-portrait-high.webp` |
| `logo-ivory-master.png` / `logo-red-master.png` | `Logo 1-01.png` / `Logo 3-02.png` | 4167×1167 wordmark masters of the two live logo webps |
| `team-hero-mobile-bottom-copy-higher-15pct.png` | `15% high phone.png` | 3rd re-shoot of the hero phone vertical (his +15%) |

Everything else in `sources/` kept its own name (`About.png` → old ch05
`team.webp` per the original README; `BHRT/Menopause/Functional medicine/
Peptide Therapy/peptides.png` → the pathway cards; `image for product(2).png`
→ the wine pair; `new team *.png` → the team-clear/team-new sets;
`team-hero-*-copy*.png` → the hero pair; `the shop products.png`,
`product visible.png`, `product mobike optimized.png`, `product item.png`,
`product desktop mide.png`, `Product mobile mode.png`,
`product image mobile 2.png` → the long ch06 saga; `About us.png`, `team.png`,
`medi-gyn-meet-the-team-wide-tight.png` → earlier ch02/ch05 frames).

**`archive/plates-retired/`** — every former live frame, filenames
untouched, so any old `index.html` revision can be re-pointed by prefixing
`archive/plates-retired/`. Includes the numbered launch-era atmospherics
(`01-mirror` … `10-signal`, `09-light`), the whole ch06 lineage
(`products*`, `product-suite*`, `product-wine*`), the ch05 lineage
(`team*`), the hero pair (`team-hero*`), `about.webp`, `06-consult*`, and
`world/` (a 12-city strip no longer referenced anywhere).

**`archive/sponsor-variants/`** — `sponsor-02-purovitalis` (colour),
`sponsor-05-wellbeing-sanctuary-ivory`, `sponsor-06-lvi-medical`
(untrimmed) — superseded by the variants on the wall.

**`archive/fonts/`** — the Didot pair; the editorial face has been Playfair
since 2026-08-03.

**`archive/press/press-monaco-info-source.webp`** — Irina at Monaco Info
(source of `coverage/press-01`); was the sole file in a
"press, testimonials, sponsor" folder, now removed.

---

## Working rules (unchanged by the reorg)

- `git fetch origin main` **before building AND before pushing** — he
  uploads via the GitHub web UI and parallel sessions ship whole features.
- Commit author must be `AyranxAi <ayranxai@gmail.com>` or Vercel refuses.
- **`main` is the deploy** (Vercel → medi-x-gin.vercel.app; GitHub Pages
  mirror at ayranxai.github.io/Medi-x/). There is no staging.
- **Never overwrite an image filename** — new plate, new name. When a new
  plate ships, its predecessor goes to `archive/plates-retired/` and its
  master to `archive/sources/`.
- The handovers (`HANDOVER*.md`) stay in the repo root — they are the
  working contract. Start from `HANDOVER_NEXT_CHAT.md`.

## Still open (owned by the handovers, listed here as pointers)

1. ch03 needs a **taller original** (533 real px vs the 1170 a phone asks) — `HANDOVER_PHONE_POLISH.md` §7.
2. ~~ch02 has **no portrait original** at all~~ — **CLOSED 2026-08-05.** He
   uploaded `about us phone .png` (941×1672) and ch02's phone frame is now
   `about-report-phone-1425`, 773 real px against 1170. ch03 is the last one.
3. ch03 headline below its 3.0 floor at 360/390; costed fix in §4 — his call.
4. ch02 fails on **desktop 1280** (h2 2.63) — worse than any phone number.
5. ch05 still ships a former team member — he has said "ok for now" twice; **do not re-ask**.
6. Landscape phones: header overlaps the headline (pre-existing).
7. `env(safe-area-inset-bottom)` unverified on real hardware.
8. Booking CTAs ×3, quiz, menoSTART deliberately **inert** — his standing decision.
9. iOS Simulator verification of the 2026-08-05 scroll-jump fix, once Xcode is installed.
