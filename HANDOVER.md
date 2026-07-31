# Medi✦X — session handover

State as of 2026-07-31. The page is live (deployment tracks `main`).
Everything below was built across PRs #1–#6, all merged.

## What this is

A single static full-bleed page (`index.html` + `images/`, no build step)
in the Clinique La Prairie register, sharing the Medi-Gyn design system
(ivory `#FAF7F1`, burgundy `#5C1F31`, burgundy-deep `#471826`, rose
`#C79A92`, gold `#C2A05E`, gold-tint `#F1E7D2`; Cormorant Garamond +
Inter). Seven chapters, one story arc:
**you → us → the consultation → the pathways → the room → the tools →
the invitation.**

## Chapter map

| # | id | Nav | Image | Notes |
|---|----|-----|-------|-------|
| 01 | s1 | The Light | `09-light.webp` | Hero, h1, Begin CTA |
| 02 | s2 | About Us | `about.webp` | "Decoded, not dismissed." flat-lay |
| 03 | s3 | The Conversation | `06-consult.webp` | Irina = the red-haired woman |
| 04 | s4 | The Pathways | `path-01..04-*.webp` | Interactive accordion, see below |
| 05 | s5 | The Room | `team.webp` | mg lounge interior (filename is a misnomer) |
| 06 | s6 | The Tools | `products.webp` | `#s6 .bg` crop override 12% center |
| 07 | s7 | menoSTART | `08-veil.webp` | Closer; "Join menoSTART" CTA is INERT |

Unused files kept in `images/`: `01-mirror`, `02-helix`, `03-molecule`,
`04-eye`, `05-touch`, `07-stillness`, `10-signal` (.webp) plus all
uploaded PNG sources (they are the masters — do not delete).

## The accordion (chapter 04)

Ported from medi-gyn-app's `.pathways-acc` (its `globals.css` +
`CarePathwaysAccordionClient.tsx`) into vanilla HTML/CSS/JS — the `.pw`
block in `index.html`. Two deliberate deltas from the source: it is
full-bleed with no copy above it, and it starts fully collapsed — all
four panels equal, click opens, clicking the open panel collapses back.
Desktop-only controls (count + arrows) appear only while open; the
"Choose a pathway" cue shows while collapsed. "Explore pathway" CTAs are
inert. Scrims are deep burgundy `#471826` — a deliberate decision (it
bridges the light frames around it and matches the burgundy in the
lounge and products photos); do not neutralise it.

## Image pipeline (IMPORTANT — follow for every new image)

The user uploads PNGs to `main` via the GitHub web UI (commit message
"Add files via upload"). Then:

1. `git fetch origin main && git merge origin/main`
2. Convert/upscale to a page-facing webp. Sources are 1024–1672px wide
   but full-bleed at Retina wants ~3400px, so every image is upscaled
   2× with **Real-ESRGAN x2plus** before serving:
   - `pip install torch torchvision` (first, alone — basicsr's build
     imports torch), then `pip install realesrgan`
   - patch: in `basicsr/data/degradations.py` change
     `torchvision.transforms.functional_tensor` → `torchvision.transforms.functional`
   - weights: `https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth`
   - RRDBNet(num_feat=64, num_block=23, scale=2), tile=512, half=False,
     outscale=2, save webp quality 80 via cv2
3. Full-bleed frames → 3344×1882; portrait panels → ~2048×3072
4. Commit on the working branch, push, PR to `main`, merge (deployment
   tracks `main`; the user expects changes to go live immediately)

Layout rules for new photographs: landscape 16:9, subject in the right
two-thirds, left third negative space for copy; high-key images get
`class="sec light"`. Google Fonts is blocked in the dev container — for
truthful screenshots install Cormorant Garamond + Inter locally (fetch
via `fonts.googleapis.com`, which IS reachable through the proxy) before
judging type wrapping.

## Workflow / repo facts

- Working branch: `claude/medi-x-bleed-photos-hw29an`; never push
  elsewhere. PR → merge to `main` = deploy.
- No gh CLI; use the GitHub MCP tools.
- medi-gyn-app repo (Next.js) is the design-system source of truth
  (content in `lib/content.ts`, image rules in `IMAGE_PROMPTS.md`).
  medi-lux repo was never needed.
- Screenshots: Playwright + `/opt/pw-browsers/chromium`, viewports
  1400×900 and 390×844.

## Hard rules

- Clinician/founder likenesses are REAL-PHOTO-ONLY, never AI-generated
  (medi-gyn rule). About Us deliberately shows the work, not a face.
- Ground all copy in medi-gyn's real content (`lib/content.ts`, about
  page) — never invent founder facts or medical claims.
- Keep PNG masters in `images/`; page serves only webp derivatives.

## Open threads (in priority order)

1. **"Join menoSTART" destination** — chapter 07's CTA is inert; needs a
   signup link / WhatsApp / events URL from the user.
2. **menoSTART "gathering" upgrade** — the closer shows a lone
   silhouette; the ideal image per medi-gyn's own brief is five women
   40–60, candid laughter, tea, golden light. Swap when generated.
3. **Accordion panel 01 redundancy** — since About Us (02) became a
   journal-and-charts flat-lay, `path-01-bhrt.webp` (also a journal
   flat-lay) repeats the motif. Consider regenerating panel 01 (e.g.
   medi-gyn's IMG-02 brief: woman stretching by a sunlit window).
4. **Chapter 03 upgrade** — the consult photo is the stockiest frame;
   a real clinician photo would strengthen it (real-photo rule applies).
5. Declined ideas (do not revive unasked): burgundy/red lipstick on the
   hero; neutral scrim for the accordion.
