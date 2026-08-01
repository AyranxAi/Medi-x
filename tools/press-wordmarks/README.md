# Press wordmark generator

`build.py` produced every SVG in `images/press/`. It shapes text with
HarfBuzz (kerning included), extracts glyph outlines with fontTools pens,
and emits single-fill `currentColor` SVGs with tight viewBoxes. The
MADAME letterforms are drawn from scratch in code — parametric
high-contrast geometry, no font involved.

Run it when a new publication needs a mark, or an existing one needs a
tweak. Never trace a raster and never embed one — the marquee tints these
through CSS masks, so they must stay single-fill vectors.

## Setup (once per machine/session)

```
pip install fonttools uharfbuzz
mkdir work && cd work
npm init -y && npm i @fontsource/bodoni-moda @fontsource/montserrat \
  @fontsource/tinos @fontsource/prata @fontsource/jost \
  @fontsource/dancing-script @fontsource/mr-dafoe
```

Fontsource ships WOFF; convert what you need to TTF into `fonts/`,
named `<key>.ttf`:

```python
from fontTools.ttLib import TTFont
f = TTFont("node_modules/@fontsource/<pkg>/files/<subset-weight>-normal.woff")
f.flavor = None
f.save("fonts/<key>.ttf")
```

Keys the final marks use: `bodoni-900` + `bodoni-600` (bazaar),
`montserrat-700` (ARABIA line), `tinos-400` (global trend monitor),
`prata-cyr` + `jost-400` (russian emirates), `dancing-700` (driven),
`mr-dafoe` (sublime). The npm registry is reachable even from
restricted-network sessions; Google Fonts / arbitrary domains are not.

## Adding a mark

1. Add a function modelled on `driven()` / `gtm()`; pick the closest
   openly-licensed face (render 2–3 candidates side by side and compare
   against the user's reference image — fidelity is judged by eye).
2. `python3 build.py` → SVGs land in `out/`; copy the final into
   `images/press/`.
3. Wire it into `index.html`: one `.pl--<slug>` rule (mask URL, `--h`,
   `--r`) and one `<i>` per `.press__set` (4 sets). **Set `--h` by
   optical core, not bounding box** — see the sizing note in
   HANDOVER_FEATURED_IN.md; every mark must land at the same ~18px core.
   `--r` is the SVG's viewBox width/height.
4. If the new mark's box height exceeds 54px, re-derive the 4.95rem
   strip height inside `--press-zone` (index.html) — the globe centres
   on it.
5. Get the user's YES on the mark before it ships in the marquee.

## Verifying

CSS masks CORS-fail over `file://`. Serve the repo root
(`python3 -m http.server 8642`) and screenshot chapter 07 at 1400x900,
1280x700 and 390x844. In Claude Code remote sessions Chromium lives at
`/opt/pw-browsers/chromium` (use playwright-core with `executablePath`).
