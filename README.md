# Medi&#10022;X — full-bleed experiment

A single static page: **seven full-bleed chapters**, one image and one idea each.
No framework, no build step. `index.html` + `images/`.

## What's in it

| # | Chapter | Image | Status |
|---|---|---|---|
| 01 | The Light | `09-light.webp` | final |
| 02 | The Passage | `08-veil.webp` | final |
| 03 | The Chemistry | `03-molecule.webp` | final |
| 04 | The Service | `06-consult.webp` | interim — to be replaced |
| 05 | The Mirror | `01-mirror.webp` | interim — to be replaced |
| 06 | The Stillness | `07-stillness.webp` | interim — to be replaced |
| 07 | The Signal | `10-signal.webp` | interim — to be replaced |

Unused images kept in `images/` for now: `02-helix.webp`, `04-eye.webp`,
`05-touch.webp`.

## Chrome

- **Wordmark** top-left (`medi ✦ x`) — clickable, returns to the top.
- **Hamburger** beside it — opens a full-screen chapter menu (Esc or a link closes it).
- **Progress rail** on the right (desktop only) — marks the current chapter, click to jump.

## Behaviour notes

- Images lazy-load one viewport ahead; the first two are eager.
- Copy fades up once per section on scroll (`IntersectionObserver`).
- A ~26px parallax drift on the backgrounds, **desktop only**, disabled under
  `prefers-reduced-motion`.
- Layout assumes the subject sits on the **right** of each frame and the copy
  takes the negative space on the left. Sections whose image is high-key carry
  `class="light"` for a softer scrim.

## Palette / type

Inherited from the Medi-Gyn system: ivory `#FAF7F1`, burgundy `#5C1F31`,
rose `#C79A92`, gold `#C2A05E`, ink `#2E2228`.
Cormorant Garamond for headlines, Inter for everything else.

## Run it

Any static server, e.g.:

```bash
python3 -m http.server 8931
```

## Deploy

Static — nothing to build. Point Vercel (or GitHub Pages) at the repo root.
