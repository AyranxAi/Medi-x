# Medi✦X — session handover

## 0 · 2026-08-02 addendum 9 — his section list; the wall starts moving

Committed as `48cf8a0`, **local only — NOT pushed.** Five decisions are still
with him and two of them touch what is on screen, so nothing has deployed.

### What landed

**Copy.** ch01 `Your best life.` and ch05 `Your Journey` are `<em>` now. ch02
separates on commas, ch03 drops its full stops, ch05 drops its own. ch06's
`Tailored to You` goes white by his instruction — that one is settled and is
deliberately outside the colour question below.

**The italic colour is measured, and the palette is shorter than it looks.**
Against the real photographs under those two lines, worst-2%, at 1440 / 1920,
floor 3.0:

| | ivory | cream | champagne | rose | gold |
|---|---|---|---|---|---|
| ch01 `Your best life.` | 3.84 / 3.44 | 3.53 / 3.16 | 3.34 / 2.99 | **1.65 / 1.48** | **1.66 / 1.48** |
| ch05 `Your Journey` | 5.54 / 4.63 | 5.09 / 4.25 | 4.82 / 4.03 | **2.39 / 1.99** | **2.39 / 2.00** |

Rose and gold are not marginal, they are nowhere — the same wall ch01/02/03/05
hit in `fc5d1c3`. **A coloured italic on those frames needs a darker ground
first, not a different swatch.** Shipped ivory; the rule is one line, commented.

**ch08 is one still frame** (Madame Arabia, his pick). The count pill, arrows,
swipe handling and the youtube-nocookie lightbox are gone, with ~300 lines of
script. ⚠️ **This also removes BOTH FILMS from the site** (the Monaco
bone-and-joints interview `JZ30fE0Nygw` and the Riyadh menoSTART film
`HWZ8h3fgjvw`), plus nine press frames and three candids. Files all remain in
`images/coverage/`; markup is one `git show 65728c6 -- index.html` away. The
Press button is the natural home for them once it has a destination.

`In their words` → `Real Patients. Real Stories. Real Impact.` as an `h2`, and
the panel now takes **the footer's `--cream` token**, not a matching hex, so
the two grounds cannot drift apart.

**The sponsor wall is a belt** — two identical sets, `-50%` slide, 64s, hover
pauses, reduced-motion stops it and hides the duplicate. Track verified at
exactly 2 × one set at 1440 and 390.

⚠️ **Two traps this cost, worth keeping.** (1) The marks had `loading="lazy"`;
a lazily-loaded image that sits **off-screen horizontally inside an
`overflow:hidden` band never fetches**, and the track was collapsing to 1414px
against a true 5110 — the duplicate set would have scrolled in as a hole. They
are eager now with real `width`/`height`. (2) **LVI Medical was never too
small — its FILE was wrong.** A 400×400 square whose artwork filled 29.5% of
the height, so the biggest `--h` on the wall (3.6rem) rendered the smallest ink
on it (26px). Trimmed to content → `sponsor-06-lvi-medical-trim.webp` (342×118,
new filename), `--h` drops to 2rem, ink doubles to 50px, level with the other
wordmarks. **Bigger number never meant bigger logo here — check the file's fill
ratio before touching a `--h`.** `sponsor-09-matches-talent` is also untrimmed
(68.5%); left alone, not asked about.

**Band ground** = `--ivory`, the colour the testimonials used to wear. He asked
me to check it: it separates from the footer's cream by **1.088:1** — real but
faint, and it steps *lighter* where the champagne `#E9DECA` it replaces stepped
darker at 1.145. For scale `--gold-tint` is 1.055 and was rejected in July for
reading as the same surface.

**Menu / footer.** Six destinations replace the eight chapters — Hormone
Therapy, Functional Medicine, Peptide Therapy, About Us, Shop, Events — inert
by his instruction, written as `<span>` so each becomes an `<a href>` with no
other change. `.nav a` styling extended to `.nav span` so they are already
identical. Footer tagline out; `.f-brand` opts back into stretching (`.f-grid`
is `align-items:start`) so the wordmark centres. `hello@` → `info@`.

### ⚠️ OPEN — nothing pushes until these land

1. **The hero gap.** At 1920 the copy starts 356px in (18.5%) and the first
   headline line measures **2.64** with the paragraph at **2.58** — both below
   standard, which the 1440 measurements never showed. Cause: `.inner` is
   `max-width:1400` centred, so past 1400 the margin grows without limit while
   the headline is capped at 5rem. Four rungs rendered (5.4 / 6.6 / 7.8 / 9.2%
   of viewport, all `max(1.25rem, Nvw)` with the 1400 cap dropped); **he said
   "between A and D", pick pending.** A also repairs ch02, which fails at 2.22
   today. The rule is shared by all eight chapters — scope is his call too.
2. **The italic colour** — ivory shipped, table above.
3. **The Press button.** It sits on the cover's white blazer: pill vs ground
   **2.0** (needs 3.0), label **3.0** (needs 4.5). The settled frosted CTA was
   measured on grounds of luminance 0.017–0.141; this one is **0.58**. Two
   fixes rendered — deepen the wash to .86 (7.0 / 10.8, geometry untouched) or
   the footer's solid burgundy (7.6 / 11.8). Darkening the frame instead does
   **not** work: it darkens pill and ground together, 1.5.
4. **Purovitalis dark mark** — he wants the dark version, not the yellow one.
   Needs fetching from their site; not downloaded, permission not asked yet.
5. **Band colour** — confirm 1.088 is the separation he wants.

### Verification rig (rebuilt this session, no install)

`puppeteer-core` is not installed. Chrome is driven over **CDP with Node's
built-in WebSocket** — `scratchpad/cdp.mjs`. Traps it cost, all of which
produce confident wrong numbers rather than errors:

- **`headless=new` starts with no page target.** `PUT /json/new` first.
- **A parallel session already had servers on 8899 and 8901.** My files 404'd
  while `index.html` returned 200 from *their* directory. **Always
  `lsof -p $(lsof -ti :PORT) | grep cwd` and confirm the server is yours.**
- **IntersectionObserver, rAF, CSS transitions and smooth scroll are all dead
  headless.** Add `.in`, and *stamp* end states (`.reveal`, `.collage`,
  `.cpress__img.is-on`, `.cvoice.is-on`) with `!important` — waiting never
  finishes. `scrollIntoView` silently does nothing against
  `html{scroll-behavior:smooth}`: set `scrollBehavior='auto'` and assign
  `scrollTop`, then **assert the section landed**.
- **`img.decode()` never resolves for an unfetched lazy image** — race it.
- **A loaded, decoded, opacity-1 image can still not paint.** Verify a region's
  standard deviation before trusting any number taken from it; a flat crop is
  a missing photo, not a dark one.
- **Sample geometry in the same space as the screenshot.** A dsf-2 shot with
  CSS-pixel rects gave the Press button a 4.66 "pass" that was really 2.0.

## 0 · 2026-08-02 addendum 8 — the invented chrome comes out; the paragraph grows

His call, after seeing it built: **the "Chapter 0X" numbers and the ✦ tag lines
("Who we are", "Clinical layer", "The clinic", "Supportive tools") are deleted**
from chapters 02/03/05/06/07. They were invention — no client document ever
asked for them, and "Clinical layer" is internal IA vocabulary that means
nothing to a visitor. The hero keeps its eyebrow (PRIVATE. PERSONAL. POWERFUL.)
and ch08 keeps "In their words", so **Megante survives in two places** — an
earlier draft of this argument claimed removing the numbers would delete Megante
from the site, which was simply wrong. What the removal does cost is the gold
accent in 02/03/05/06; he accepted that.

**The headline size is deliberately UNCHANGED, and this is the interesting
part.** He asked to "adjust the headers" upward. Rendering a ladder at +6 / +12
/ +18% showed why not: his copy is written as short sentences, and at the
current size each sentence lands on its own line — "Start With a Conversation. /
Leave With Clarity." Every growth step fractures that ("Start With a /
Conversation. Leave / With Clarity."); ch06 splits "Tailored to You"; at +18%
ch02 breaks into four lines. Two escapes were tried and both were rejected on
evidence: forced `<br>` does nothing, because at +12% the sentence "Start With a
Conversation." is by itself wider than the 640px copy column; widening the
column (40→52rem) *does* restore clean sentences and even takes ch07 from 3
lines to 2, but it pushes the headline further into each photograph's bright
zone and drops hero line 1 from 3.38 to **2.55** and ch02 line 1 from 3.40 to
**2.77**. Clean sentences bought by making the words unreadable is a bad trade.
**If the headline is ever to grow, the photographs have to be fixed first.**

**What grew instead is the supporting paragraph, and it needed to.** `.body` was
`clamp(.95rem,1.05vw,1.06rem)` — the middle term never wins below a ~1614px
viewport, so the paragraph had been rendering at its 15.2px floor on every
laptop AND every phone. Now `clamp(1.05rem,1.2vw,1.2rem)` with line-height 1.62:
**17.3px at 1440, 16.8px at 390**, and it finally scales on large screens.
Slack improves 326→358px desktop, 306→342px mobile; no line counts move on
desktop, none on mobile, no horizontal overflow at 390.

**UK spelling** — `Healthy Ageing` and the footer's `Hormone balancing centre`
were the only two US forms in visible copy (audited by stripping script/style
and scanning the rendered text, so CSS keywords like `center` did not pollute it).

### ⚠️ Correction: the addendum 7 contrast numbers were wrong

The measuring script passed **viewport** coordinates to
`page.screenshot({ clip })`. Puppeteer's clip is **document-relative**, so for
every section except the hero it cropped a strip of the hero photograph and
reported it as that section's background. It was caught only because an
unrelated crop came back showing the wrong chapter. **Method that is correct:
never pass `clip` — screenshot the full viewport and crop afterwards with the
recorded viewport rect, at the same scroll position, with the headline
`visibility:hidden` so the true ground is sampled.**

Re-measured, desktop 1440 (large text needs 3:1, "worst" = brightest 2%):

| chapter | before the copy change | as shipped now |
|---|---|---|
| 01 | rose 1.29 ✗ | flat **3.38 / 4.01 / 3.96** ✓ |
| 02 | rose 1.28 ✗ | flat **3.40 / 4.19 / 6.00** ✓ |
| 03 | rose 1.84 ✗ | flat **4.30 / 4.81** ✓ |
| 05 | rose 1.45 / 2.75 ✗ | **flattened this addendum** — rose was 1.68, the worst on the page; now **4.35 / 5.33** ✓ |
| 06 | rose 6.04 ✓ | rose **3.07** ✓ (kept — only just) |
| 07 | rose 6.19 ✓ | rose **1.23 worst / 6.25 median** — fails only where "Beyond" crosses the globe's white dots |

### ⚠️ NEXT JOB, AGREED WITH HIM: the mobile scrim

**Phones are far worse than desktop and always have been — this is pre-existing,
not caused by any of the above.** At 390px, as shipped: ch02 2.27, ch03 2.79,
ch05 1.89, and **ch06 sits at a median of 1.18:1** — the headline is the same
brightness as its background, i.e. genuinely not visible.

The cause is structural. At ≥900px the scrim's dominant gradient runs
**left-to-right** (`.82` at the left edge) and `.sec` centres the copy, so the
headline sits inside the wash. Under 900px **both flip**: `.sec` is
`align-items:flex-end` and the dominant gradient runs **bottom-to-top** (`.78`
at the bottom, gone by 70%). The headline is the topmost element of a
bottom-anchored block, so the taller the block the further the headline climbs
out of the scrim it depends on. (This is also why deleting the chrome *helped*
mobile: a shorter block sits lower. Measured — every figure it touches improved.)

**The fix is the ground, not the type**: extend the mobile gradient's reach for
`.sec::after` / `.sec.light::after` under 900px. He has approved this as its own
pass with a lettered board rendered over the real photographs at 390. Desktop
must not change. When it lands, the rose italic should return to 01/02/03/05 and
the provisional note above chapter 01 in `index.html` can go.

## 0 · 2026-08-02 addendum 7 — client copy lands in chapters 01/02/03/05/06/07

His supplied wordings replace the invented copy in six chapters. Chapter 04
(the accordion) and chapter 08 were explicitly out of scope. **No CSS changed
— measured first: every section still clears its 100svh frame** (desktop slack
326–498px, mobile 306–406px, no horizontal overflow at 390px).

- **Ch 01 hero** — headline `Your hormones. / Your health. / Your best life.`,
  and **the gold eyebrow now carries `PRIVATE. PERSONAL. POWERFUL.` instead of
  "Chapter 01"** (his explicit pick). The hero is therefore the ONE chapter
  without a chapter number; 02–07 keep theirs. Megante still appears nowhere
  else.
- **Ch 02** `Personalised Solutions. Precision Medicine. Healthy Aging`
- **Ch 03** `Start With a Conversation. Leave With Clarity.` — the body now
  names Irina Bond and the complimentary discovery call.
- **Ch 05** `Meet The Experts Behind Your Journey.`
- **Ch 06** `Personalised Health Solutions. Tailored to You`
- **Ch 07** `Educational Events Beyond Borders.` — **this section gained its
  first body paragraph**, placed where every other chapter puts it (between
  headline and CTA). It fits the post-restructure layout with 326px to spare.
- **The `.kicker` chapter numbers and the ✦ `.tag` lines are deliberately
  UNTOUCHED** — his call, "leave both for now, later lets revisit for the whole
  look of it". Revisiting those is an open thread, not an oversight.
- **Nav + `data-nav` relabelled** to match: About Us → Why Medi-Gyn, The
  Conversation → Discovery Call, The Room → Meet Our Team, The Tools →
  Products & Therapies. The Light / The Pathways / menoSTART / In the World
  unchanged.

### ⚠️ The rose italic is PROVISIONAL in chapters 01/02/03 — ask him

Every chapter headline carries one rose-italic phrase. On the three brightest
photographs it is effectively invisible, so those three are **set flat** for
now. Measured on the real page with the headline hidden so the true background
under each line could be sampled (large text needs 3:1):

> ⚠️ **THE TABLE THAT WAS HERE WAS WRONG — see addendum 8.** Every figure except
> the hero's was measured with a script that passed VIEWPORT coordinates to
> `page.screenshot({clip})`, which is DOCUMENT-relative, so it sampled a strip of
> the hero photograph while reporting it as ch02, ch05 and the rest. Corrected
> figures and the consequence (ch05 was left with an italic that fails at
> 1.68:1) are in addendum 8. **Never pass `clip` — shoot the full viewport and
> crop afterwards.**

Note the new copy **improved** all three — this is an inherited problem, not one
his wording created. **The honest fix is the ground, not the type**: a scrim, a
different crop, or moving the copy block to a darker part of the frame. Once
that pass happens the italic should come back to 01/02/03. The same reasoning
retires the long-parked note on the hero's old `younger.` (1.10:1) — that line
no longer exists. The full rationale is an HTML comment directly above chapter
01 in `index.html`. **He asked to be asked whether this reads right — do not
treat it as settled.**

### Copy details worth knowing

Normalised to house style: `personalized` → `personalised`, two hyphens/tight
em dashes → the site's spaced `&mdash;`, and a closing full stop on ch07's
paragraph. **Left verbatim but flagged to him, unanswered:** "Healthy **Aging**"
is US spelling while the site is UK throughout — and the product bottles in
ch06's own photograph read "ANTI-AGEING"; also "Healthy Aging" and "Tailored to
You" carry no closing full stop where every other headline does.

**Orphan:** the footer still reads "Where women's symptoms are decoded — not
dismissed." That quoted chapter 02's old headline, which this commit deletes.

## 0 · 2026-08-02 addendum 6 — ch07 belt OUT, ch08 two-panel, sponsor wall band, footer tagline

Client-driven restructure (their words: the three-cell collage was ugly, and
they spotted the press redundancy themselves):

- **Chapter 07:** the "as featured in" wordmark marquee is **deleted
  completely** — markup, CSS, `images/press/` SVGs, `HANDOVER_FEATURED_IN.md`.
  ⚠️ **REVERT CANDIDATE:** he wants to watch the client's reaction — if they
  ask for it back, `git revert` this commit's ch07 hunks (everything lives in
  history; nothing was parked). Freed space went to the globe (bigger AND
  pulled inward: `min(54vw,86svh)`, `right:clamp(2.5rem,8vw,9.5rem)` — the
  60vw variant overlapped the headline and was rejected) and the headline
  (`clamp(3rem,7.5vw,7.2rem)`). CTA kept its settled 3.5rem finale size on
  purpose. `--press-zone` machinery deleted; globe centres on plain `top:50%`.
- **Chapter 08 is TWO PANELS:** press frame left, voices full-height right.
  The sponsor belt left the collage. **Madame Arabia is slide 1** (his call;
  Monaco Info took her old slot 5 — candids stay at 4/8/12). Mobile press
  frame 52svh→**58svh** (4:5 at 390px ≈ 487px; the old 52svh existed only for
  the burgundy-belt peek, which no longer exists).
- **`.sband` — "Our sponsors": SHIPPED as F1, "the grand wall" (his pick
  from a 7-option board).** Static — every partner on stage at once, no
  loop to wait for — 13 full-colour original marks (sponsor-05 = the
  ORIGINAL file, not -ivory.webp) on true champagne `#E9DECA`
  (`--gold-tint` is within 3% of cream and does NOT read as a distinct
  ground). `--k:1.55` at `column-gap:2.2rem` = the biggest clean 7/6
  wrap at 1440; 1.62 flips to 6/7, wider gaps orphan Longevity Hub.
  **Parked alternatives** (renders in the 2026-08-02 chat, rebuildable
  from this note): F2 whisper-drift belt at ~2× marks; F3 cream band
  over a BURGUNDY footer (full colour-flip spec was rendered); F4
  burgundy band with champagne plaque cards — the plaque recipe is
  `background + box-sizing:content-box + padding:calc((H - var(--h)*k)/2)`
  for uniform card heights. Physics that killed bare-marks-on-burgundy:
  Richmont/Livia dark text ≈1.5:1 there, and tinting other companies'
  marks is off-limits.
- **FOOTER V2 — the compact footer, SHIPPED (his annotated sketch + V2
  pick).** Columns pack left (`auto` tracks); the contact column is
  "Contact us" + the written address (his pick V2 — "it is an address,
  not a destination"; the V1 envelope chip lost, git has it) + one chip
  row [WhatsApp live wa.me · FB · IG · TikTok · YT · LinkedIn]; the
  "Dubai · worldwide" line is deleted; the to-top circle is STANDALONE
  at the content's right edge, 3.05rem, level with the chip row — NOT in
  the row (navigation ≠ contact method) and NOT bottom-right (the fixed
  bot bubble owns that corner). Band + footer close in one viewport.
- **ch07 headline-over-globe overlap: ACCEPTED as editorial (his call,
  2026-08-02).** The client's `fc5d1c3` copy ("Educational Events
  *Beyond Borders.*") is wider than the composition was balanced for and
  the italic crosses the globe's dim left limb. If it ever reads as
  noise: shrink toward `min(48vw,78svh)` / push `right` back toward
  `clamp(.75rem,3vw,4rem)`.
- **Footer tagline** is now the placeholder **"Hormone balancing center"**
  (replaces "decoded — not dismissed", his call). Everything else in the
  footer is deliberately untouched — the book-a-consultation button, the
  sharpening pass, and the possible band+footer one-viewport merge are a
  SEPARATE, paused stream.

## 0 · 2026-08-02 addendum 5 — BRAND TYPOGRAPHY ("Variation B") — built, NOT deployed

The site ran on Cormorant Garamond + Inter and used **none** of the three
approved brand faces. That is fixed. His pick was **Variation B** from the
Codex preview (`~/Documents/Codex/2026-08-01/i-w/outputs/medi-gyn-full-preview-b/`).

**The mapping now in `index.html`:**

| Role | Face | Where |
|---|---|---|
| Chapter headlines | **Didot 400** | `h1,h2` — `line-height:1`, `letter-spacing:-.018em` |
| Emphasis inside headlines | **Didot Italic** | `h1 em,h2 em` — real italic file, not synthesised |
| Chapter identifiers | **Megante 400** | `.kicker` ONLY — `letter-spacing:.16em` |
| Service/pathway titles | **NOW Medium 500** | `.pw__name`, `.pw__title` |
| Nav, CTAs, buttons, footer heads | **NOW Medium 500** | `.nav a`, `.cta`, `.f-head`, `.f-news button` |
| Body, contact, captions, inputs | **NOW Regular 400** | `body`, `.body`, `.f-news input` |
| Pull quotes | **Cormorant italic** | `.cvoice p` — the one role the guideline still reserves for it |

**Fonts are self-hosted** in `fonts/` — seven subset woff2 files, **92 KB total**,
lighter than the two Google families they replace. Originals live outside the
repo at `~/Documents/Codex/2026-08-01/i-w/work/fonts/`. Tokens are
`--font-editorial` / `--font-functional` / `--font-brand-accent` / `--font-quote`;
`--serif` and `--sans` are kept as aliases so no old rule silently lost its face.

**⚠️ Sizes had to move, and here is why — do not "restore" them.** These faces
are not interchangeable at the same pixel value. Measured x-heights:
Cormorant `0.386em`, Didot `0.429em`, NOW `0.546em`. So:
- headlines came **down ~7%** (h1 `5.4rem`→`5rem`, h2 `4.2rem`→`3.9rem`)
- nav came down hard (`2rem`→`1.5rem`) — NOW is ~40% larger at the same size
- pathway titles came down ~14% (`46px`→`39px` at the top step)
- `word-spacing:.05em` on `h1,h2` — the `-.018em` tracking also tightens word
  spaces and Didot Italic has a narrow left sidebearing; without it
  "look younger." closes up.

**Footer, same session (his spec):** wordmark **40px → 64px** (he picked C from a
four-up), copyright **centred**, back-to-top moved out of the legal row to sit at
the **right end above the rule** (new `.f-topwrap`).

**Licensing — asked and answered.** The supplied Megante file is
`MegantÇ-Personal-Use.ttf` (fsType 4, and the same personal-use file the brand
guidelines PDF was built with). **He confirmed a commercial licence is held.**
Didot Regular also carries fsType 4 (Preview & Print); Didot Italic/Bold and all
four NOW weights are unrestricted. Noted, not blocking.

**⏳ PARKED, his call — the emphasis word contrast.** `younger.` measures
**1.10:1** against the brightest part of the hero photo (rose `#C79A92`), i.e.
effectively invisible. This is **pre-existing on the live site and present in
Variation B too** — it is not caused by the font change. Measured alternatives:
Warm Champagne `2.85 / 2.13 / 1.85`, Ivory `3.94 / 2.95 / 2.55` (median /
brightest-10% / brightest-2%); WCAG large-text minimum is 3.0:1, so **every
colour fails in the bright zone** — the real fix is the scrim, the crop, or the
copy position, not the colour. **He said leave it: the wording itself is not
final.** Revisit when the copy locks.

**Verified** at 1440 / 768 / 390: no horizontal overflow, nothing clipped, no
fallback faces, zero console errors, zero failed font requests, Didot Italic
confirmed loading as a real file.

**NOT committed and NOT pushed** — working tree only, awaiting his review.

## 0 · 2026-08-02 addendum 4 — chapter 08 became THE COLLAGE (LIVE)

**Supersedes addendum 3's wall entirely.** Client verdict on the wall:
too much movement. They sent a reference collage; his spec: left =
press images fading, top right = testimonials fading, bottom right =
sponsors sliding. Shipped on main (`fd8df2a`):

- `.collage` replaces `.world-wall`: 50/50 vertical split, right
  column `62fr/38fr`. Left = 4 real press frames (Monaco Info — his
  upload, masters in "press, testimonials, sponsor/" — plus Monaco
  Tribune / Madame Arabia / GTM from the parked press-cards branch's
  `images/press-assets/`), all 1080×1350 in `images/coverage/`,
  crossfading 11s. NO caption overlay — every frame carries its own
  masthead and Tribune's baked-in callout sits exactly where an
  overlay would go.
- Top right `.cvoices` on ivory: patient quotes APPROVED BACK (his
  call 2026-08-01). 3 film quotes (git 657ce4b) + 6 written ones he
  supplied in chat, excerpted VERBATIM, emojis stripped; crossfade
  7.5s — deliberately offset from the press 11s so the panels never
  blink in sync. `.cvoice footer` must keep
  `background:none;padding:0;border:0` — the page footer's BORDER
  bleeds too (extended ch07 lesson).
- Bottom right `.csponsors` on gold-tint: 13 real partner marks from
  his zip (`images/sponsors/`, trimmed, alpha kept, full colour;
  Fezā white→alpha; Wellbeing Sanctuary extracted from an SVG raster
  wrapper), ch07's four-set translateX(-25%) belt at 70s,
  hover-pause, per-mark `--h` optical-core sizing.
- Reduced motion: everything static, set 1 / first frame / first
  quote. JS timers run only while the section is on screen.
- ⚠️ PARALLEL CHATS work this repo: main moved three times during
  this build (ivory footer + ch06 product frame, footer legal/type,
  back-to-top removal). Fetch main before building AND before
  pushing. Editorial refinement pass (type size, belt treatment,
  press vignette) is pending his pick from lettered options.


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

**Where the photographs came from:** medi-gyn.com's `/educational-events/`
dates them — Rome (Jun 2026), Monte-Carlo (Apr 2026), Hong Kong (Apr
2026), Riyadh (Jan 2026), Dubai (Feb 2026), Jeddah (Dec 2025), Muscat
(Oct 2025). Those dates are in the tiles' alt text.
⚠️ **That page is NOT the event list.** I treated it as complete, read
India's absence as meaningful, and was corrected on the spot: *"just
because you don't see it doesn't mean it's there."* The chapter-07 globe
already carries all ten of his locations, Hong Kong included, and it is
right as it stands. Never infer his coverage from a public page.

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
3. **Globe city coordinates** — all ten locations are correct and
   present (Dubai, Oman, Saudi, Kuwait, Qatar, China, India, Hong Kong,
   United Kingdom, Monte-Carlo); **Hong Kong already has its own dot**
   at 114.17/22.32. Only the CHINA and INDIA *pin points* are
   representative — Shanghai and Mumbai — and country-level Gulf entries
   use Muscat/Riyadh/Kuwait City/Doha. These are placeholder coordinates
   inside the right countries, not claims about venues.
   ⚠️ **Do NOT infer the event list from medi-gyn.com.** Its
   `/educational-events/` page shows only some of them (Rome,
   Monte-Carlo, Hong Kong, Riyadh, Dubai, Jeddah, Muscat) — I read India's
   absence there as evidence and was corrected: *"just because you don't
   see it doesn't mean it's there."* The locations list is his, and it
   stands. Only he confirms cities.
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
