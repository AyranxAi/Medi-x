# Medi&#10022;X — full-bleed experiment

A single static page: **ten full-bleed chapters**, one image and one idea each.
No framework, no build step. `index.html` + `images/`.

## What's in it

| # | Chapter | Image |
|---|---|---|
| 01 | The Mirror | `01-mirror.webp` |
| 02 | The Blueprint | `02-helix.webp` |
| 03 | The Chemistry | `03-molecule.webp` |
| 04 | The Evidence | `04-eye.webp` |
| 05 | The Body Knows | `05-touch.webp` |
| 06 | The Conversation | `06-consult.webp` |
| 07 | The Stillness | `07-stillness.webp` |
| 08 | The Passage | `08-veil.webp` |
| 09 | The Light | `09-light.webp` |
| 10 | The Signal | `10-signal.webp` |

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
