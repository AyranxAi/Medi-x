# Medi✦X — next-chat handover: the "as featured in" marquee

Written 2026-08-01, end of the header/globe/accordion session. Read
`HANDOVER.md` first for the site's full state; this file is the brief
for ONE task: the featured-in wordmark marquee in chapter 07.

## Where things stand (all LIVE on medi-x-gin.vercel.app)

PRs #16 and #17 are merged. Chapter 07 is the split closer (invitation +
rotating patient quote left, paced champagne globe right, night ground,
gold-hairline CTA). Chapter 02 carries the new About Us flat-lay. The
header wears medi-blond's two-state chrome with our logo and three-line
burger. The accordion hover is JS-managed. Nothing in this task may
regress any of that.

## The task

The user sends images of every publication/feature ("all the things we
are featured in") at the START of the next chat. For each image:

1. Rebuild the wordmark as ONE clean, hand-crafted SVG — real vector
   paths, not an embedded raster. Requirements:
   - drawn in `currentColor` (single fill; the page tints it)
   - tight viewBox, no padding baked in
   - crisp at 24–36px render height (test small!)
   - filename: `images/press/<slug>.svg`
2. Get the user's YES on each mark before it enters the marquee (EXACT
   standard — a wrong wordmark on a medical brand is worse than none).

## Update 2026-08-01

Chapter 07's rotating patient quotes were REMOVED (they now live as
statics in the new chapter 08), so the closer's bottom edge is clean
ground for this strip. Placement and all rules below are unchanged —
the user reconfirmed: bottom of chapter 07, SVG wordmarks. Still
waiting on the publication images.

## Locked decisions (user's explicit picks — do not relitigate)

- Marquee lives INSIDE chapter 07, along the closer's bottom edge.
- Transparent background — no band fill, the night ground shows through.
- Wordmarks drift RIGHT → LEFT, continuous loop.
- Single ivory tint (use `rgba(250,247,241,…)` at a whisper opacity,
  ~.4–.55; they are credibility, not content).
- REAL features only. Never placeholder press, never invented logos.
- A small static "AS FEATURED IN" kicker label may precede the strip
  (gold, letterspaced) — propose at review.

## Build notes

- Chapter 07 already has three moving elements (globe, quote rotation,
  roll call). The marquee is the fourth: keep it WHISPER-slow (~35–45s
  per loop), no hover interactions needed; `prefers-reduced-motion`
  gets a static row (duplicate-content translateX loop, animation off).
- z-order inside `.sec--meno` (isolation:isolate): `.bg` −2 → `::after`
  scrim −1 → canvas 0 → `.inner` 1 → grain `::before` 2. Put the strip
  in a positioned container above the canvas (z 1), absolute at the
  section's bottom; on phones the section stacks copy → globe, so give
  the strip normal-flow placement after the canvas there (see how
  `.meno-globe` switches to `order:2` static under 900px).
- Mind the finale CTA's clearance on short viewports — the strip must
  never overlap the pill; test 1280×700 as well as 1400×900 and 390×844.
- Marquee CSS: two identical spans in a `width:max-content` flex row,
  `@keyframes` translateX(0 → −50%), linear, infinite (the pattern from
  the medi-lux BAZAAR band).

## Workflow (proven in this session — reuse it)

- Repo: `AyranxAi/Medi-x`, deployment tracks `main`. Clone into the
  session scratchpad; work on a `claude/…` branch; PR; send screenshots;
  merge ONLY after the user's explicit approval. He merges nothing
  himself — you merge on his "approved".
- The in-app Browser pane may stop compositing (stale black
  screenshots). Verify with headless Chrome instead: scratchpad
  `npm i puppeteer-core` + system Chrome at
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
  throwaway `userDataDir` in the scratchpad; serve the clone with
  `python3 -m http.server 8642` (scratchpad is not TCC-blocked).
  Screenshot quirk: use `captureBeyondViewport:false`, never `clip`
  after scrolling (it resets scroll mid-capture).
- Batch ALL questions at the start (his standing contract). He answers
  fast and decisively.

## Also open (do not forget to surface)

1. Quote sign-off + Irina's clearance of the two testimonial films
   (lines are verbatim; "Katrina, 58" names herself on film).
2. True event cities for the CHINA and INDIA globe dots (stand-ins:
   Shanghai, Mumbai).
3. "Join menoSTART" CTA destination (still inert).
4. Globe pace feel — if the 3.5× ocean transit feels wrong on the live
   site, `FAST` in the globe script is the one number to touch.
