# Medi✦X — THE PHONE PASS

**Status: DONE and shipped 2026-08-05.** This file was the brief; it is now the
record. Read `HANDOVER_NEXT_CHAT.md` §1–§3 first (what this is, his rules, the
deploy). §7 below is what is still open.

---

## HOW TO PUT IT BACK

He asked for this before it went to main, so it is the first thing in the file.
**The state before this pass is commit `d72f373`** ("The phone pass gets its own
brief, and the budget rule is inverted in writing").

⚠️ A `pre-phone-polish` tag exists locally but is NOT on the remote — this
repo's git gateway refuses tag refs, four attempts, `Everything up-to-date`
followed by a disconnect every time. Use the SHA. It is permanent and it is
already in main's history; a tag would only have been a nickname for it.

**All of it, one command, no force-push:**

```
git revert --no-edit d72f373..HEAD
git push origin main
```

That writes new commits undoing the three, so nothing is rewritten and Vercel
rebuilds from a real commit. To preview the old site first:
`git checkout d72f373` and open `index.html`.

**Or just one chapter.** Nothing in `images/` was overwritten — that rule held
through the whole pass — so every old plate is still on disk and any single
frame goes back by pointing its `<picture>` at its old file
*(2026-08-05 late: retired plates moved to `archive/plates-retired/`, same
filenames — prefix that path; the ch05 row below is itself superseded, the
chapter runs `team-new-*` since `92e390f`)*:

| chapter | now | was |
|---|---|---|
| 01 | `hero-team-phone-1424` / `hero-team-wide-2400` | `team-hero-portrait.webp` / `team-hero.webp` |
| 02 | `about-report-phone-1425` / `about-report-wide-2399` | *(no phone plate)* / `about.webp` |
| 03 | `consult-room-phone-1173` / `consult-room-wide-2399` | `06-consult-portrait.webp` / `06-consult.webp` |
| 05 | `team-clear-phone-1425` / `team-clear-wide-2399` | `team-clear-portrait.webp` / `team-clear.webp` |
| 06 | `products-glass-phone-1389` / `products-glass-wide-2399` | `products-visible-portrait.webp` / `products-visible.webp` |

**Or just one behaviour.** Each is independent and each is one edit:
the `<head>` preload (two lines), the `loading="lazy"` on the sponsor wall and
the Bazaar cover, `overscroll-behavior-y` on `html`, the phone `.reveal` block,
the hero's `heroRise` animation, the `.cta-stack` grid, `.lang__item`'s
`min-height`, and `and (orientation:portrait)` on the `<source>` media.
⚠️ The one thing that is NOT independent: if the `<source>` media queries change,
the two `<head>` preloads must change with them or a device loses its preload or
downloads both frames.

---

## 0. His brief, in his words

> "stabilizing and making phone mode better like cta **no matter what it takes
> even if we have to regenerate alot of pictures** alright it has to be smooth
> and perfect and not glitchy and jump this is **luxury and we are not a trash
> website** … even smooth scroll or something"

**The budget was not the constraint. The FEELING was the spec.** He explicitly
pre-authorised regenerating images. What he did NOT authorise was a redesign —
the type scale, the colour board, the i-stem copy line, the chapter order and
the eight frames are settled and were fought for. One change in this pass got as
far as being built before it was reverted for exactly that reason; see §4.

---

## 1. The numbers

Medians of 5 runs. **Fast 3G, 4× CPU throttle, 390×844 at DPR 3**, served with
Brotli, correct MIME types and Vercel-like cache headers.

| | before | after | |
|---|---|---|---|
| First contentful paint | 636 ms | 632 ms | flat |
| **Largest contentful paint** | **1824 ms** | **1256 ms** | **−31%** |
| **Hero photograph on screen** | **5365 ms** | **2347 ms** | **−56%** |
| Load event | 5429 ms | 2351 ms | −57% |
| Cumulative layout shift | 0 | 0 | held |
| Image bytes, first screen | 930 KB | 312 KB | −66% |
| Hero plate | 941×1673 webp | 1424×2532 avif | **2.3× the pixels** |

Scroll, 5 traces each, 4× CPU, top to bottom:

| | before | after |
|---|---|---|
| median frame | 16.7 ms | 16.7 ms |
| p95 frame | 22.8 ms | 20.6 ms |
| frames > 32 ms | 2 | 1 |
| long-task total | 96 ms | 62 ms |

⚠️ **MEASURE WITH COMPRESSION OR DO NOT MEASURE.** The first pass of this work
was done against a plain static server and read LCP 2632 → 2572, i.e. "no
improvement", and nearly sent the whole investigation after the wrong thing. The
document is 302 KB raw and 83 KB Brotli'd; uncompressed, the HTML download IS
the critical path and swamps every other signal. Vercel Brotlis. The rig is in
the session scratchpad (`serve.mjs` HTTP/1.1, `serve2.mjs` HTTP/2+TLS).

---

## 2. What was wrong, and what fixed it

### 2.1 The hero popped in — and it was worse than diagnosed

The brief had this right: every `.bg` lived in a `data-src` that the preload
scanner cannot see, so the hero was not *discovered* until the parser finished
and the script ran. The waterfall showed something worse on top of it: the hero
was the **eighteenth** image requested. Ahead of it, all eager, all below the
fold — the Harper's Bazaar cover (155 KB, `loading="eager"` in the markup) and
**thirteen sponsor marks** (375 KB). Half a megabyte of furniture had the pipe
while the most important photograph on the site waited.

Three fixes, in order of size:

- **Fourteen below-the-fold images went `loading="lazy"`.** First-screen image
  bytes: 930 KB → 312 KB.
- **The six photographic chapters are real `<picture>` elements.**
- **The hero is preloaded from the `<head>`.** This is the one that would be
  easy to leave out and it is worth ~700 ms on its own: chapter 01's markup does
  not arrive until byte ~165,000 of this document, which on Fast 3G is 800 ms of
  nothing even with a preload scanner that can see it. The `<link>` is in the
  first kilobyte.

### 2.2 Every plate was upscaled — and `will-change` was making it worse

Two causes, both measured on the rendered device pixels (mean |Laplacian| over
the faces, 390 @ DPR 3), not reasoned about:

| | detail |
|---|---|
| as shipped — 941px plate, `will-change:transform` | 4.101 |
| same plate, no `will-change` | 4.340 |
| 1425px plate, `will-change` | 4.940 |
| 1425px plate, no `will-change` | 5.102 |
| 2160px plate, no `will-change` | 6.203 |

Source resolution dominates, but **`will-change:transform` was costing ~6% of
edge energy on its own** — it was on all eight `.bg` layers permanently, on a
phone that never animates any of them, because the parallax is desktop-and-
motion-allowed only. It is now scoped to
`@media (min-width:900px) and (prefers-reduced-motion:no-preference)`, where it
is paying for something. Eight permanent compositor layers on a phone: gone.

**Sizing is derived, not picked.** A portrait plate is cover-cropped by HEIGHT on
a phone, so the visible source width is `390 × H / 844`. To reach the 1170 device
pixels a 390px screen has at DPR 3, `H ≥ 2532`. **Every portrait plate is now
2532 tall**, width following its master's own aspect. Landscape plates take 1350
(2400 wide at 16:9) on the same logic for a 1440 laptop.

**AVIF is what makes "sharper" and "arrives sooner" stop being a trade.** At the
same PSNR, AVIF is roughly half the bytes of webp. The hero is **161 KB at
1424×2532 against 165 KB for the 941×1673 webp it replaces** — two and a half
times the pixels for four kilobytes less. Every `<picture>` carries a webp
`<source>` for the phone and a webp `<img>` fallback for desktop, so a browser
without AVIF is exactly where it was.

Quality is allocated where there is detail to protect: the hero is q72 because
its masters (2160×3840 and 3840×2160) are genuinely larger than the target. The
other four are Lanczos upscales of 941px masters and ship at q62 — indistinguish-
able at 3× zoom, and chapters 02 and 03 in particular are fetched during the
initial load, so every kilobyte they hold is one the hero waits behind.

⚠️ **The upscale is not fake sharpening, and it is not new detail either.**
Measured on chapter 05 at 390 @ DPR 3: 4.014 (browser stretches the 941 plate) →
4.277 (Lanczos alone) → 4.838 (Lanczos + a light unsharp mask). The browser's own
GPU stretch is the worst of the three. The work is in stopping a second resample,
not in inventing resolution.

### 2.3 The frame re-shaped with the viewport

**The `72%` default is deleted.** `.bg` used to carry
`background-position:72% center` — a number measured against one specific
landscape plate and inherited by every chapter that did not override it. Three
separate bugs in this repo have been "a position inherited across a frame swap".

Below 900px there is now **no position value anywhere**: every phone plate is
composed so plain `center` is correct. Where a subject genuinely was not centred
in its own file — chapter 06's group sat 12px right of centre in a 941-wide
master, which is what `57%` was buying — the shift is **baked into the plate**
(cut 24px off the left before the resize). A crop belongs to one photograph and
cannot be inherited by the next one. A percentage in a stylesheet can, and twice
already has been.

Two values survive on desktop, as `object-position` on the `<img>`:
`#s5` 100% and `#s6` 12%. Those are not inherited constants — they are
compositions that deliberately place a subject against one edge, re-derived
against the plates that ship today, and both are a no-op at 1920/2560 where the
plates are 16:9 against a 16:9 viewport. A chapter that swaps its frame and
forgets its line now falls back to `center`, which is safe.

### 2.4 A rotated device kept the wrong frame — and it was hiding something

`<picture>` fixes the stated bug for free (the old loader ran
`delete bg.dataset.src` after the first pick and could not re-evaluate).
Screenshotting landscape turned up the bigger problem: the old loader chose with
`matchMedia('(max-width:899px)')`, so a phone **turned sideways** — 844×390,
still under 899 — got the tall plate and `cover` cropped it to a strip. At
844×390 the hero showed five pairs of legs and shoes and **not one face**. Every
chapter was a fragment. It had been like that since the narrow plates landed.

Every `<source>` is now `(max-width:899px) and (orientation:portrait)`. Portrait
phone and portrait tablet take the tall frame; anything in landscape takes the
wide one, which is the shape it actually is.

### 2.5 Two more things that were not in the brief

- **`about.webp` and `06-consult.webp` were 2× upscales made in place**
  (1672×941 → 3344×1882, commit 02a7d08). Six point three megapixels of fake
  resolution each, that a phone had to decode to look at about a sixth of.
  The 1672 originals were recovered from git.
- **Chapter 02 had no phone frame at all** — a landscape plate cover-cropped to
  26% of its width. It has one now, cut from the exact window the phone was
  already showing (derived from the CSS it replaces, not eyeballed), so the same
  picture is on screen at a third of the decode.

---

## 3. Motion

- **`scroll-behavior:smooth`** was already on `html` but unconditionally, relying
  on a later block to undo it under `prefers-reduced-motion`. It is now stated
  once, inside `@media (prefers-reduced-motion:no-preference)`.
- **`overscroll-behavior-y:none`** on `html` — the rubber-band that exposed the
  canvas is gone. (The canvas was repainted ivory on 2026-08-04 *because* of that
  bounce; this removes the cause. ⚠️ It also disables Android pull-to-refresh on
  this page — intended.)
- **The reveal animation has its own phone numbers.** 26px and .95s were chosen
  on a desktop where a chapter enters alone. On a phone, scrolling at any speed
  puts two or three chapters over the .22 threshold inside a second — six
  elements each, staggered to .45s, all easing at once. Below 900px: 14px, .62s,
  stagger halved. The stack finishes in .87s against 1.40s.
- **The hero's copy no longer waits for JavaScript.** `.reveal` is `opacity:0`
  until an observer adds `.in`, so until this 293 KB document had parsed *and*
  the script had run, the first screen was empty. Chapter 01 is always in view
  and never needed the observer; its entrance is a CSS animation that starts when
  the markup is parsed. Everything below the fold keeps the observer.
- **The globe was already correct** — `prefers-reduced-motion` draws one static
  frame and returns, and an IntersectionObserver starts/stops the rAF loop.
  Checked, not changed.

### ⚠️ `content-visibility:auto` was tried and MEASURED WORSE. Do not re-add.

§4 of the original brief called it "likely the single biggest scroll-smoothness
win after the images". It is the right instinct for a page of eight full-bleed
sections and it is wrong for this one. Shipped on `#s3/#s5/#s6/#s8`, then ablated
at runtime and re-traced — five passes each, both orders, to rule out warm-up:

| | p95 | p99 | long tasks |
|---|---|---|---|
| with `content-visibility` | 23.0 ms | 87.4 ms | 91 ms |
| without | 21.2 ms | 66.5 ms | 68 ms |
| with (order reversed) | 23.8 ms | 92.3 ms | 90 ms |
| without (order reversed) | 21.3 ms | 53.7 ms | **0 ms** |

It costs a ~90 ms long task and roughly doubles the worst frame. The reason is
structural: each chapter is ONE full-bleed image and a short copy block, so there
is almost no layout to skip — but every section still has to be laid out and
painted in a burst as it enters, and those bursts land on the frames the visitor
is actually scrolling through. The saving is theoretical; the entry cost is real.
The note is left in the stylesheet at the point where someone would add it.

---

## 4. ⚠️ The change that was built and then reverted

Chapter 03's phone plate is 533×1153 and a template match proves it is a **1:1
pixel crop** of his 941×1672 master (x276 y521 533×1151, MAD 3.2) — not a
downscale. So that framing already holds every real pixel it will ever have: 533,
against the 1170 a 390px phone asks for. It is the softest frame on the site,
2.2× blown up where every other chapter sits at 1.5×.

Taking the master whole was built, shipped into the branch, screenshotted, and
reverted. It gives 773 visible source pixels — 45% more, level with every other
chapter. It also shrinks the two women to a third of the frame, puts them behind
the copy block, leaves the top 60% as empty wall, and drops the headline to 2.72
at 360 against a 3.0 floor.

**That is a redesign bought with a resolution number, which is the one thing the
brief said not to do.** His crop ships, carried up with Lanczos and an unsharp
mask so the 2.2× resample happens once at build time instead of on every phone.

While it was in, chapter 03 got a reshaped scrim to pay for the new ground. That
came out with the frame. **The measurements are worth keeping**, because chapter
03 is failing its headline floor *today* and always has:

| stops | 360 | 390 | 430 | (h2 / body) |
|---|---|---|---|---|
| stock light (**ships today**) | **3.03**/4.22 | **3.31**/5.44 | 4.16/5.56 |
| ch05's shape | 3.97/6.48 | 4.48/6.20 | 6.72/7.14 |
| reach to 88% | 4.96/7.37 | 5.24/7.08 | 7.59/8.06 |
| heavier top | 6.49/8.62 | 6.75/8.37 | 8.94/9.15 ← dulls the frame |

Chapter 05's shape is the lightest that clears everything, which is the same
reason option A won in `HANDOVER_MOBILE_UX.md` §4. It is four lines and it is
costed. **It was not applied because darkening a photograph he approved is a
design decision and `HANDOVER_MOBILE_UX.md` is parked at his request.** Ask him.

---

## 5. CTAs

- **Every `.cta` measures 49px** at 360/390/430, so the 48px target the brief
  asked for is already met. The floating discs are 52px with 21px of clearance
  and 26px between them, and **no CTA overlaps either disc at any phone width** —
  checked by rect intersection, not by eye.
- **The hero pair never shares a line on a phone** — 250 + 207 against a 342px
  column at every width, so `flex-wrap` was dropping them into a stack of two
  different widths. He approved the stack; the *ragged edge* was never chosen, it
  fell out of wrapping. Below 900px the stack is now one `max-content` grid
  column, so both buttons take the width of the wider one. ⚠️ This cannot make
  overflow worse in any language — the column is exactly as wide as the widest
  button already is. Verified at 360 and 390 in all six languages; Russian is
  widest at 254px. Desktop keeps the flex row, where the pair does share a line.
- **The language menu rows were 36px** — the smallest touch target on the site,
  six of them, in a menu that opens under a fingertip, and invisible to every
  previous audit because it only exists when open. `min-height:44px` below 900px.
  Padding and type untouched, so a closed menu is identical.
- The header's globe / WhatsApp / burger discs are **44px** and were left alone.
  That is Apple's own minimum and he sized the wordmark against them on
  2026-08-05 ("the mark carries the bar"); changing them would move the header
  composition he had just settled.

---

## 6. What was verified

- **Contrast, every chapter × 360/390/430/1280/1440**, by this repo's own method
  (§7 of `HANDOVER_MOBILE_UX.md`: per-LINE rects, text hidden, full-viewport
  shot, brightest 2%). **Every number is within ±0.05 of before.** Nothing
  regressed.
- **Framing diffed at 360/390/430/rotated/768-tablet/1440**, chapter by chapter.
  Desktop is pixel-identical. Phone is identical. Landscape is transformed.
- CLS held at 0. Explicit `width`/`height` on every `<img>`, and the frames are
  absolutely positioned inside an already-absolute `.bg`, so they contribute
  nothing to layout and cannot shift it.
- Functional smoke: all 5 chapter frames decode, all 8 sections reveal, nav
  opens and closes, language switch works (de → "Beratung buchen"), the globe
  paints, no failed loads, no page errors.
- Every `<picture>` checked for a webp `<source>` and a webp `<img>` fallback in
  all four media/format combinations. All 40 image references resolve on disk.
- ⚠️ **Playfair does not load in the sandbox** — Google Fonts is blocked by the
  agent proxy, so every headline here rendered in a fallback serif. Anything
  about line-breaking must be confirmed on the real domain.

---

## 7. Still open

1. **Chapter 03 needs a taller original.** Everything else is at or above its
   screen; this one is 533 real pixels against 1170 and no amount of encoding
   changes that. Same setup, same two people, shot tall. It is the single
   highest-value photograph anyone could hand this site.
2. ~~**Chapter 02 is the other one.**~~ **CLOSED 2026-08-05 — he shot it.**
   `about us phone .png`, 941×1672, same table and same two reports composed
   vertically, is in `archive/sources/`. Built by the recipe in §2.2 (Lanczos to
   2532, light unsharp, AVIF q62): `about-report-phone-1425`, 77 KB. The phone
   window went from 435 real pixels to **773 against 1170** — 1.51×, level with
   every other chapter — and the old `about-report-phone-1170` pair is in
   `archive/plates-retired/`.
   ⚠️ **It also fixed a contrast bug nobody had logged.** The 1170 crop put the
   reports' dark-red chart bars directly behind the copy: the worst pixel under
   the text block measured **1.00:1** against the ink. The portrait composition
   puts the subject in the top half and empty stone under the copy — h2 **5.27**,
   body **5.18** against the darkest pixel in their own boxes, measured on the
   composited plate at 390×844. There is no scrim on this chapter, so those are
   the real numbers, not scrim-assisted ones.
   ⚠️ **DESKTOP WAS NOT TOUCHED** — his ask was the phone background. Open item 4
   below (ch02 h2 2.63 at desktop 1280) is untouched and still open.
3. **Chapter 03's headline fails its floor at 360 and 390** (3.03 / 3.31 against
   3.0 — the second is nominally passing but inside the noise). §4 has the fix
   costed at four lines. His call.
4. **Chapter 02 fails badly on DESKTOP at 1280** — h2 2.63, body 2.27. That is
   worse than anything on a phone and it is not in any handover yet.
5. **Chapter 05 still ships a former team member.** He has said "it's ok for
   now" twice with the facts in front of him — do NOT re-ask. The fix is a frame
   she is not in.
6. **The header overlaps the headline in landscape** on a phone. Visible in the
   844×390 shots. Pre-existing, unrelated to this pass.
7. **`env(safe-area-inset-bottom)` could not be verified on real hardware.** The
   discs clear correctly in the emulator, where the inset is 0. On a real iPhone
   the calc resolves to 34px and should clear the home indicator — confirm on the
   actual device.
8. **The old plates are all kept** — `team-hero-portrait.webp`,
   `team-clear-portrait.webp`, `products-visible-portrait.webp`,
   `06-consult-portrait.webp`, `about.webp`, `06-consult.webp` and the landscape
   pairs. Nothing was overwritten, so every chapter reverts by pointing its
   `<picture>` back at its old file. *(2026-08-05 late: they now live in
   `archive/plates-retired/`, filenames unchanged — see `REPO_MAP.md`.)*

---

## 8. Traps, still true

- **`git fetch origin main` before you build AND again before you push.** He
  uploads files through the GitHub web UI mid-session.
- **Commit author MUST be `AyranxAi <ayranxai@gmail.com>`** or Vercel refuses the
  build. `git config` is set in this clone; a fresh clone is not.
- **`main` IS the deploy.** There is no staging.
- **Never overwrite an image filename.** New name, every time.
- **Do not touch chapter 07's gradients or chapter 08's collage `.bg`.** Neither
  has a photograph, and neither is a `<picture>`.
- **The two inert booking CTAs and the quiz stay inert** — his standing decision.
  Do not wire them to WhatsApp to tidy up.

---

## 9. Addendum 2026-08-05 (late) — the Safari scroll jump, found and fixed

He was still feeling "the background jumps a little" in iOS Safari after this
pass shipped. It was real, it was ours, and **no rig in §1 could ever have
seen it**: iOS Safari fires a window `resize` every time its toolbar collapses
or returns — i.e. on every scroll — and the parallax block registered
`resize → onScroll` unconditionally while `frame()` itself had no width or
motion gate. On a phone `sync()` correctly attaches no scroll listener, so the
resize path stamped ONE stale desktop transform (`translate3d ±26px` +
`scale(1.07)`) onto every visible `.bg` per bar transition — an instant,
untransitioned 7% zoom pop that then STUCK until the next transition popped it
somewhere else. Which also means every plate composed in §2.3 was displaying
7% over-zoomed at a random offset from the first flick of the thumb onward.
Chrome-based rigs never change `innerHeight` mid-scroll; that is why five
clean traces coexisted with a glitch his thumb found in five seconds.

**The fix is one guard at the top of `frame()`** — the same
`wide.matches && !reduce.matches` condition `sync()` keys on — plus a comment
at the site. Desktop behaviour is identical (the guard is true there; a
desktop window resize still recomputes). Phones now have **zero scroll-coupled
geometry writers**. The two things that still move around the bar are the OS's
own and are not bugs: bottom-anchored fixed discs ride the viewport edge
during the bar animation, and a fast flick on slow cellular can catch a lazy
plate arriving.

**Revert:** `git revert` the commit carrying this addendum — one commit, two
files (`index.html` + this note).
**Verify:** on the iPhone, scroll down then up around the toolbar
transitions; the photographs must hold perfectly still while the bar moves.
Xcode was not on the Mac this session, so MobileSafari could not be driven
directly; he intends to install it — next session can boot the simulator and
watch the before/after instead of feeling for it.
