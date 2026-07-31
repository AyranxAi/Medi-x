# Medi&#10022;X — full-bleed experiment

A single static page: **seven full-bleed chapters**, one image and one idea each.
No framework, no build step. `index.html` + `images/`.

## What's in it

| # | Chapter | Image | Status |
|---|---|---|---|
| 01 | The Light | `09-light.webp` | final |
| 02 | About Us | `05-touch.webp` | interim — awaiting real founder/team photo |
| 03 | The Conversation | `06-consult.webp` (Irina) | final |
| 04 | The Pathways | `path-01..04-*.webp` | accordion — see below |
| 05 | The Room | `team.webp` | final |
| 06 | The Tools | `products.webp` | final |
| 07 | menoSTART | `08-veil.webp` | final — upgrade to a "gathering" shot when one exists |

Chapter 07's "Join menoSTART" CTA is inert until there is a signup
destination. About Us (02) deliberately shows hands, not a face — clinician
likenesses are real-photo-only, per the medi-gyn image rules.

Chapter 04 is a port of medi-gyn-app's care-pathways accordion (the
`.pathways-acc` block in its `globals.css`): four full-height photo panels in
one strip — Hormone Therapy & BHRT, Menopause Care, Functional Medicine,
Peptide & Regenerative Support. Two deliberate differences from the source:
it is full-bleed with no copy above it, and it starts fully collapsed — all
four panels equal until one is clicked, and clicking the open panel collapses
it again. The "Explore pathway" CTA is present but inert for now.

The `path-0X-*.webp` and `team.webp` files are resized derivatives of the
uploaded originals (`BHRT.png`, `Menopause.png`, `Functional medicine.png`,
`team.png`, and the ChatGPT-named PNG that replaced `peptides.png` as the
peptides source), which stay in `images/` as sources. Also unused on the
page: `01-mirror.webp`, `02-helix.webp`, `03-molecule.webp`, `04-eye.webp`,
`07-stillness.webp`, `10-signal.webp`.

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
