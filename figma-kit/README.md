# medi·gyn — Figma design kit

A faithful recreation of the live site (`medi-x-gin.vercel.app`) as **Figma-ready,
fully editable frames** — desktop (1440 px) and mobile (390 px) — plus the brand's
design tokens and fonts. Generated directly from the rendered site, so positions,
colours, type sizes and imagery match the production page.

There are two ways to get this into Figma. They complement each other — you can do
both in the same file and keep whichever serves you better.

---

## Route A — import the SVG frames (everything is in this folder)

**1. Install the brand fonts first** (so text imports with the right faces):

- Open `fonts/` and install all five `.ttf` files
  (double-click → *Install*, on macOS and Windows alike).
  They are named so Figma matches them automatically:
  **MediGyn NOW** Light/Regular/Medium/Bold and **MediGyn Megante**.
- *Playfair* and *Cormorant Garamond* need no install — they are Google Fonts,
  available in Figma out of the box.
- If Figma was open, restart it so it picks the new fonts up.
  (In the Figma **desktop app** local fonts just work; in the browser you need the
  [Figma font installer / agent](https://www.figma.com/downloads/).)

**2. Import the frames:**

- Create a new Figma design file.
- Drag the whole `desktop/` folder's SVG files onto the canvas, then `mobile/`,
  then `00-style-guide.svg`. (You can multi-select and drop them all at once —
  Figma places each SVG as its own editable frame.)
- Arrange desktop frames `01 → 11` in one row/column and mobile in another.
- Everything is real layers: text is editable text, buttons/hairlines/gradients are
  vectors, photos are embedded images cropped exactly as on the site.

**Frames included** (same set in `desktop/` and `mobile/`):

| # | Frame | Section on the site |
|---|-------|---------------------|
| 00 | `00-style-guide.svg` | Colours, typography, scale, buttons |
| 01 | `01-hero` | Hero + fixed header + floating ask button |
| 02 | `02-solutions` | "Personalised Solutions, Precision Medicine…" |
| 03 | `03-conversation` | "Start With a Conversation…" (discovery call) |
| 04 | `04-pathways` | The four care-pathway cards |
| 05 | `05-team` | "Meet The Experts Behind Your Journey" |
| 06 | `06-products` | "Personalised Health Solutions…" (shop) |
| 07 | `07-events` | "Educational Events Beyond Borders." (globe) |
| 08 | `08-press` | Madame Arabia press + testimonial |
| 09 | `09-sponsors` | Partner/sponsor logo band |
| 10 | `10-footer` | Newsletter + contact footer |
| 11 | `11-nav-menu` | The hamburger menu, open state |

`reference/full-page-desktop.jpg` and `reference/full-page-mobile.jpg` are
full-page screenshots of the real site for side-by-side checking while you work.

**Known, deliberate approximations** (small and listed for honesty):

- Frosted-glass pills (`backdrop-filter: blur`) are approximated with a slightly
  darker translucent fill — in Figma, add a *Background blur* effect to those
  pills to restore the exact look.
- The animated sponsor marquee and the dotted globe are frozen at the moment of
  capture (the globe is an embedded image; it is drawn by a `<canvas>` on the site).
- Subtle `drop-shadow`s (e.g. under the header wordmark) are omitted — re-add as
  Figma *Drop shadow* effects if wanted.
- Photos are embedded rasters (as with any site-to-Figma import).

## Route B — html.to.design plugin (import from the live URL)

The [html.to.design](https://www.figma.com/community/plugin/1159123024924461424)
plugin rebuilds a live page as Figma layers with auto-layout:

1. In Figma: **Resources → Plugins → search "html.to.design" → Run**.
2. Paste `https://medi-x-gin.vercel.app` in the *URL* tab.
3. Import twice: once with a **Desktop (1440)** viewport, once with **Mobile (390)**.
4. Install the fonts from `fonts/` first (step A-1) so text maps correctly.

Route A gives you clean per-section frames plus the token sheet; Route B gives you
one long auto-layout page. Many teams import both and keep the better parts of each.

---

## Fonts & licensing note

- `MediGyn NOW` and `MediGyn Megante` TTFs were converted from the site's own
  self-hosted WOFF2 files (`/fonts`) with their family names normalised so Figma
  matches them to the frames automatically.
- ⚠️ The Megante source file carries an internal "Personal Use Only" name. The
  site already uses it, but please verify the brand's licence covers design-tool
  use before distributing the TTF beyond the team.

## Regenerating this kit

The kit is generated, not hand-drawn. `tools/` contains the scripts:

- `dom2svg.mjs` — renders the site in headless Chromium and serialises every
  section's DOM (text, vectors, gradients, images, pseudo-elements, canvas) into
  the per-section SVGs.
- `navframe.mjs` — same, for the open hamburger-menu state.
- `verify.mjs` — renders every SVG next to a live screenshot for a fidelity diff.

Run them with Node ≥ 20 and Playwright while serving the repo root over HTTP
(`python3 -m http.server 8321`).
