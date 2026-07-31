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
| 02 | s2 | About Us | `about.webp` | "Decoded, not dismissed." — hands + anatomy-chart flat-lay (from the `About us.png` upload, ESRGAN 2×, 2026-07-31) |
| 03 | s3 | The Conversation | `06-consult.webp` | Irina = the red-haired woman |
| 04 | s4 | The Pathways | `path-01..04-*.webp` | Interactive accordion, see below |
| 05 | s5 | The Room | `team.webp` | clinic lounge, derived from the `About.png` upload |
| 06 | s6 | The Tools | `products.webp` | `#s6 .bg` crop override 12% center |
| 07 | s7 | menoSTART | CSS night ground + canvas globe (NO photo) | Closer; split frame — hero-size invitation + rotating patient quote left, champagne globe right (stacks on phone). CTA still INERT |

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

## Chapter 07 internals (2026-07-31 rebuild)

The globe is hand-rolled — no libraries. A land-dot grid (world-atlas
land-110m at 1.8° latitude rows, longitudes thinned by cos(lat) so
density stays uniform — no polar rings; run-length encoded by row) is projected
orthographically on a `<canvas>`; one turn ≈ 95 s; a roll call labels
each menoSTART location in turn, skipping far-side cities; the loop
pauses off-screen (IntersectionObserver) and renders one static frame
under `prefers-reduced-motion`. The veil photograph was removed
2026-07-31 (two subjects fought for the right two-thirds); the ground
is a designed CSS gradient night — do not put a photo back without
rechecking the collision. Fiji wraps the antimeridian in land-110m:
the dot-grid generator unwraps small seam-crossing rings or a false
land band appears at 16°S. The globe tilts +22° so the northern
hemisphere — where every menoSTART location lives — owns the disc. Quote `<footer>`s must keep their
`background:none;padding:0` reset — the page-level `footer` styles bleed
in otherwise. Quote lines are verbatim from the two testimonial films in
the user's local `medi-gyn` folder (transcribed 2026-07-31).

## Open threads (in priority order)

1. **Quote sign-off** — the three chapter-07 quote lines + attributions
   ("A medi-gyn patient — on film", "Katrina, 58") need the user's and
   Irina's approval; they are clinic/BHRT testimonials, not
   menoSTART-event quotes. Swap or cut on request.
2. **Globe city coordinates** — CHINA and INDIA dots stand at
   Shanghai and Mumbai until the true event cities are confirmed;
   country-level entries (Oman, Saudi, Kuwait, Qatar) use
   Muscat/Riyadh/Kuwait City/Doha.
3. **"As featured in" press strip** — deliberately NOT built; the user
   is deciding static-in-frame vs a moving band outside the frame, and
   the real wordmark list must come from Irina first. Never placeholder
   press on the live page.
4. **"Join menoSTART" destination** — chapter 07's CTA is inert; needs a
   signup link / WhatsApp / events URL from the user.
5. **menoSTART "gathering" image** — no longer needed for the closer
   (chapter 07 has no photograph now); the five-women golden-light
   brief could serve a future chapter or the press band instead.
6. **Accordion panel 01 redundancy** — since About Us (02) became a
   journal-and-charts flat-lay, `path-01-bhrt.webp` (also a journal
   flat-lay) repeats the motif. Consider regenerating panel 01 (e.g.
   medi-gyn's IMG-02 brief: woman stretching by a sunlit window).
7. **Chapter 03 upgrade** — the consult photo is the stockiest frame;
   a real clinician photo would strengthen it (real-photo rule applies).
8. Declined ideas (do not revive unasked): burgundy/red lipstick on the
   hero; neutral scrim for the accordion.
