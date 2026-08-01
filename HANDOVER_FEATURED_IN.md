# Medi✦X — handover: the "as featured in" marquee (SHIPPED)

Rewritten 2026-08-01 at the end of the marquee build session. Read
`HANDOVER.md` first for the site's full state. Everything below is LIVE
on main / medi-x-gin.vercel.app.

## What shipped this session

- **Six wordmarks** in `images/press/` — harpers-bazaar, madame-arabia,
  global-trend-monitor, russian-emirates, driven-magazine, sublime. All
  hand-built vectors: single `currentColor` fill, tight viewBox, no
  rasters. Marks 1–5 user-approved; sublime shipped from previews
  without a formal "yes" — if he ever squints at it, offer a rework.
  Generator + full recipe: `tools/press-wordmarks/` (committed, so any
  future session can add a mark without rebuilding the toolchain).
- **The marquee** in chapter 07 (`#s7`): static gold "AS FEATURED IN"
  kicker, then the six marks drifting right→left. 44s loop, four
  `.press__set` copies (sets 2–4 aria-hidden), `translateX(-25%)`
  keyframe — seamless to ~3200px viewports. Transparent band, ivory
  `rgba(250,247,241,.48)` on `.press__belt`. Strip is
  `pointer-events:none` — user explicitly wants it non-clickable.
  Reduced motion: drift off, set 1 only. Phones: strip is static flow,
  `order:3`, marks scaled by `--k:.76`.
- **Composition pass** (user-driven, all measured): globe now centres in
  the space *above* the strip via `--press-zone`; every mark sized to
  the same ~18px optical core; h2 ceiling raised to 6.5rem; at ≥1500px
  the copy + kicker anchor to the frame edge (`max-width:none`) so they
  mirror the globe's right-edge anchor ("variant D", his pick).

## Three lessons learned the hard way — do not undo them

1. **Size marks by optical core, never by bounding box.** Each `.pl--*`
   carries `--h` (box height) + `--r` (viewBox aspect). `--h` values are
   tuned so every mark renders at the same ~18px core — cap-height × .72
   for all-caps marks, blended with x-height for mixed-case. Box-sizing
   (v1) made two-line marks 60% smaller than BAZAAR; the row read as a
   jumble. Adding a mark? Measure its core (fontTools BoundsPen on the
   cap/x glyphs), don't guess.
2. **`--press-zone` is load-bearing.** It reserves the strip's space AND
   is the globe's centring reference
   (`top:calc((100% - var(--press-zone))/2)`). Plain `top:50%` hung the
   globe 41–48px low at every viewport. Its value =
   `4.95rem + clamp(1rem,3vh,2.1rem)` where 4.95rem is the strip's own
   height (kicker block + 54px belt, set by the tallest `--h`). Change
   any `--h` past 54px or touch the kicker → re-derive 4.95rem, then
   re-measure gaps (script pattern: compare globe top-gap vs bottom-gap
   across viewports; delta must be ~0).
3. **The 1400px content cap breaks `#s7` at wide frames.** The globe
   anchors to the frame, the copy to the capped `.inner` — two
   coordinate systems. The ≥1500px `max-width:none` override keeps the
   corner-to-corner tension. If other sections ever get frame-anchored
   foreground elements, they'll need the same treatment.

## Knobs (user may ask; each is one line)

- Strip brightness: `.press__belt` color (locked band .4–.55).
- Speed: `press-drift` duration (whisper = 35–45s).
- Mark sizes globally: `.pl{--k}` (desktop 1, phones .76); per-mark: `--h`.
- Headline: `.sec--meno h2` clamp ceiling (now 6.5rem).

## Verifying changes

Masks CORS-fail over `file://` — serve the repo root with
`python3 -m http.server 8642`. Screenshot `#s7` at 1400×900, 1280×700,
390×844 (and ≥2000px wide if composition changed). In Claude Code
remote sessions: playwright-core + `executablePath:
'/opt/pw-browsers/chromium'`; npm/pypi are reachable, arbitrary domains
are not (WebFetch/WebSearch work). On the user's Mac the old
puppeteer-core + system Chrome recipe in git history still applies.
CTA→strip gap must stay >0 at 1280×700 (currently 67px).

## Standing contract with the user

Batch ALL questions at the start; he answers fast and decisively. Send
screenshots for judgement; he says "approved"/"push it" — you merge to
main (deployment tracks main; he merges nothing himself). Real features
only in the strip, never invented press. Wordmark fidelity is an EXACT
standard — his eye is final.

## Still open (surface these, do not forget)

1. Quote sign-off + Irina's clearance of the two testimonial films
   (chapter 08 attributions still pending; "Katrina, 58" names herself
   on film).
2. True event cities for the CHINA and INDIA globe dots (stand-ins:
   Shanghai, Mumbai).
3. "Join menoSTART" CTA destination (still inert).
4. Offer stands: swap any mark for exact paths if a publication sends
   its real logo file (SVG/EPS/PDF); Sublime and Madame are the two
   built from closest-match faces rather than exact letterforms.
5. Possible port of the strip to medi-lux / medi-gyn-app (SVGs are
   self-contained; user hasn't decided).
