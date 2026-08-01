# Medi✦X — session handover

State as of 2026-07-31. The page is live (deployment tracks `main`).
Everything below was built across PRs #1–#6, all merged.

## 0 · 2026-08-01 addendum 3 — chapter 08 became THE WALL + hover fix

**Supersedes the chapter-08 half of addendum 2 entirely.** The user's
verdict on the belts build was "section 8 is a mistake". His spec,
verbatim: *one section that fills the screen, divided in two — top 0% to
50%, bottom 51% to 100%, no space in between — both containing tiles that
move, top right-to-left, bottom left-to-right.*

- **`.world-wall`** replaces `.world-split`. `.sec--world` is now
  `height:100svh; padding:0` and the wall is `position:absolute;inset:0`
  with `grid-template-rows:1fr 1fr` (grid, not flex, so a fractional
  viewport height can't open a hairline at the seam — measured gap is
  0.00px at every size). Classes: `.wrow--top` / `.wrow--bottom`,
  `.wrow__track`, `.wrow__set`, `.wtile`.
- **Gone, by his explicit answers:** the kicker + headline + paragraph
  (the section carries no copy at all now), both gold belt kickers, the
  6% edge-fade masks, the rounded corners and 14px gaps, the toned
  placeholder grounds and "photograph to come" captions, and **the three
  patient quotes — DELETED from the site** (his call; they are in git
  history if he ever wants them back).
- **Tiles**: 4:5 portrait, `height:100%` + `aspect-ratio:4/5`, butted
  square edge to edge, running off both edges of the frame. Width falls
  out of viewport height: 360px at 900svh, 432px at 1080svh.
- **NO hover-pause** on these belts (chapter 07's marquee keeps its
  one). The wall IS the screen, so any cursor would freeze the section
  permanently. Do not "restore" it.
- **Photographs are REAL medi-gyn coverage, not stock and not stand-ins**
  — pulled from medi-gyn.com's own `/educational-events/` (Rome, Monaco,
  Dubai, Riyadh, Jeddah, Muscat, with the site's own dates) and
  `/photo-gallery/` "At Play". 12 files in `images/world/`, 4:5 at
  720×900, `cwebp -q 80`, 968 KB total. They stand in until the final
  selection lands: **swap the files, keep the names, the wall updates
  itself.** `images/press/press-01..06.webp` were never delivered and
  are no longer referenced.
- **Loop maths**: a set is 6 × 0.4 = 2.4 screen-heights wide, so three
  sets clear any frame up to 7.2:1 — every desktop, ultrawide included.
  Same four-set `translateX(-25%)` mechanic as chapter 07.
- Verified headless at 1440×900, 1280×700, 1920×1080, 390×844: section
  height == viewport height exactly, both halves exactly 50%, seam gap
  0.00px, tile ratio 0.8000, top `normal` / bottom `reverse`, no page
  h-scroll, no console errors, and **zero blank tiles in view across a
  full 64s loop**.
- Also fixed this session: the chapter-04 accordion "clicked/unclicked
  hover" bug — see the Pathways section below, it is fully written up
  there.

**Bonus finding, not yet acted on:** `/educational-events/` gives the
TRUE event cities and dates — Rome (Jun 2026), Monte-Carlo (Apr 2026),
Hong Kong (Apr 2026), Riyadh (Jan 2026), Dubai (Feb 2026), Jeddah (Dec
2025), Muscat (Oct 2025). That answers the long-open "true cities for the
CHINA/INDIA globe dots" thread in chapter 07 — note there is **no India
event listed**, and China is Hong Kong. Raise it with him.

## 0 · 2026-08-01 addendum 2 — favicon + chapter 08 belts session

- **Favicon = medi-blond's, verbatim.** `favicon.svg` is a byte-for-byte
  copy of `medi-gyn-app/app/icon.svg` (ivory mg monogram + gold ✦ on
  the `#5C1F31` burgundy square); `favicon.ico` is that same artwork
  rasterised at 48/32/16 for older browsers. One favicon across the
  whole site family — the user's explicit rule. (A DNA-helix-glyph
  favicon I invented first was REJECTED — "the mg burgundy logo" means
  the medi-blond monogram icon; do not redesign brand marks unasked.)
  The old gold-✦-on-ink data URI is gone from `<head>`.
- ⚠️ **SUPERSEDED by addendum 3 — this chapter-08 build was rejected.**
  Kept only so nobody rebuilds it. Everything from `.world-split` down
  is gone from the file.
- **Chapter 08 rebuilt as two counter-drifting full-bleed belts**
  (`.world-split`): events tiles drift right→left (64s/set), the three
  film-testimonial cards drift left→right (80s/set, reverse of the same
  `world-drift` keyframes — slower because quotes are read, not
  glanced). Same loop mechanics as chapter 07: four sets, sets 2–4
  aria-hidden, `translateX(-25%)`. Gold kickers "On the road" / "In
  their words" align to the 1400px copy grid; belts bleed to the frame
  with 6% gradient edge-fade masks (pure CSS gradients — no CORS
  caveat). Both belts pause on hover. Event slots grew 4 → 6
  (`press-01..06.webp`, drop-a-file, real coverage only). `.voice` is a
  card now (fixed width, `min-height:clamp(150px,20vh,195px)` so the
  two halves stay near-even against the 160–240px tiles).
- **Two traps encoded in comments — do not re-trip**: (1)
  `.world-split` needs `grid-template-columns:100%` — an auto column
  inflates to the ~9000px max-content track and drags the centred
  kickers ~3800px off-screen; (2) the reduced-motion `animation:none`
  needs the `.wbelt .wbelt__track` prefix to tie the drift rules'
  specificity, or the belts keep moving.
- Verified at 1400×900, 1280×700, 2100×1000, 390×844 + reduced-motion
  (static, set 1 only, finger-scrollable) with measured drift
  directions (events −35px/s, voices +17px/s).

## 0 · 2026-08-01 addendum — buttons/layout session (PR #18)

- The page is EIGHT chapters now. New 08 "In the World" (`#s8`): press
  coverage as photographs — drop-a-file slots `images/press/press-01..04.webp`
  (real coverage only, captions vanish when a file lands) — plus the three
  film testimonials, static, on the chapter-07 night ground.
- CTAs: hero "Begin" → burgundy "Book your consultation" + ivory "Take the
  hormone quiz", equal-width pair (labels left, arrows right). Ivory CTAs in
  02 About us / 03 Book a free discovery call / 05 Meet the team /
  06 Visit the shop. All INERT until destinations exist.
- **Pill register CONFIRMED over CLP boxes** (user saw both side by side).
  One token flips every CTA if revisited: `--btn-radius` in `:root`.
- Chapter 07: the rotating quotes were REMOVED (user's call) — the
  featured-in wordmark marquee goes along its bottom edge once the real
  publication SVGs arrive (brief unchanged in `HANDOVER_FEATURED_IN.md`).
- Footer rebuilt: logo, tagline, five social chips (UNWIRED — no accounts
  yet), newsletter (UNWIRED — CRM later), contact block.
- WhatsApp IS WIRED (header chip + footer link):
  `https://api.whatsapp.com/send/?phone=971555450797&text=...` — the one
  live destination on the page.
- Title, meta description and hero body now carry the real positioning
  line — the "experiment in full-bleed" framing is gone from user-facing
  chrome (menu foot / footer base still say "experiment"; user hasn't asked).
- Accordion closed names 21→23px, short lines 13→14px (readability, 40–60
  audience).
- "Book your consultation" vs "Book a free discovery call" naming: user
  will revisit — do NOT unify unasked.

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
| 07 | s7 | menoSTART | CSS night ground + canvas globe (NO photo) | Split frame — hero-size invitation left, champagne globe right (stacks on phone), "as featured in" wordmark marquee along the bottom edge. NO quote here any more. CTA still INERT |
| 08 | s8 | In the World | 12 × `images/world/*.webp` | THE WALL — 100svh, two exact halves, tiles drifting in opposite directions, no copy. See addendum 3 |

Unused files kept in `images/`: `01-mirror`, `02-helix`, `03-molecule`,
`04-eye`, `05-touch`, `07-stillness`, `10-signal` (.webp) plus all
uploaded PNG sources (they are the masters — do not delete).

## The header (2026-08-01 — chrome ported from medi-blond)

Two states, medi-blond's exact recipe (same design tokens both sites):
over the hero = frosted glass (ink 45% + blur 12, 60% ivory hairline,
ivory icons, 44px chips); scrolled ≥24px = ivory bar (95% + blur,
`--line` base hairline) with the coloured logo (`logo-red.webp`,
same 626×160 artwork as the ivory one), outline chips, ink icons,
gold hover, burgundy-outline book pill ("BOOK YOUR CONSULTATION" —
uppercase per CLP register, the user's explicit pick over medi-blond's
sentence case). Hides scrolling down past 240, returns on any 6px+
up-scroll. Identity kept OURS: logo files and the three-line burger
(medi-blond has two lines — do not copy that). Menu open = our
burgundy overlay untouched, controls in glass so they read on dark.

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

**Panel hover — rewritten 2026-08-01, read before touching it.** Two
classes, both JS-managed, and neither may go back to a bare CSS
selector:

- `.hov` = the pointer is on this panel. Derived from a stored pointer
  position + `document.elementFromPoint`, re-run on `pointermove` AND on
  every frame for 720ms after a click. Not `pointerenter`/`pointerleave`:
  a click animates every panel's width, so a panel slides under a cursor
  that never moved and no boundary event ever fires — the panel under
  your hand went dead until you jiggled the mouse. Not plain `:hover`
  either: touch made that sticky.
- `.kfoc` = the trigger holds KEYBOARD focus, set from
  `:focus-visible` on the button's `focus` event. **`:focus-within` is
  banned here.** It was the desktop half of the "clicked/unclicked hover"
  bug the user reported twice: a mouse click focuses the button too, so
  the panel you clicked stayed fully lit forever — cursor on the other
  side of the screen, two panels reading as hovered at once. The earlier
  `.hov` fix only ever addressed the touch half.

Verified: collapse with the cursor unmoved keeps that panel lit; pointer
off the accordion lights nothing; Tab still shows the ring and the panel
treatment.

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
under `prefers-reduced-motion`. The pace varies (2026-08-01): base
rate while the located arc (~20°W–140°E) faces the viewer, cosine-
eased up to 3.5× across the empty Pacific/Americas, so the frame
never lingers on nothing; the roll call rests while pace >1.8×. The veil photograph was removed
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

1. ~~**Quote sign-off**~~ — CLOSED 2026-08-01. The three patient quote
   lines are DELETED from the site (his call when chapter 08 became
   photographs only). No sign-off needed; nothing quoted anywhere now.
   Git history holds them if he changes his mind.
2. **Final chapter-08 photographs** — the 12 files in `images/world/`
   are real medi-gyn coverage lifted from medi-gyn.com, standing in
   until he picks the definitive set. Swap the files, keep the names.
3. **Globe city coordinates** — CHINA and INDIA dots stand at
   Shanghai and Mumbai. **Partly answerable now:** medi-gyn.com's
   `/educational-events/` lists the real events — Rome, Monte-Carlo,
   Hong Kong, Riyadh, Dubai, Jeddah, Muscat. So China should probably be
   HONG KONG, and **there is no India event on that page at all** —
   ask him before moving or dropping the INDIA dot. Country-level
   entries (Oman, Saudi, Kuwait, Qatar) use
   Muscat/Riyadh/Kuwait City/Doha.
3. **"As featured in" marquee — GREEN-LIT (2026-08-01), build next
   chat — full brief in `HANDOVER_FEATURED_IN.md`.** The user's decisions: it lives INSIDE chapter 07 (bottom
   edge of the closer), transparent background, wordmarks drifting
   right→left, single ivory tint. He sends images of every feature
   next chat; each becomes ONE clean SVG (drawn in `currentColor` so
   the tint is CSS). Real features only — never placeholder press.
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
