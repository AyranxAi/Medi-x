# Scene QA harness

⚠️ **RUN THE WEBGL HARNESSES ONE AT A TIME.** `process-sculpture.mjs`, `doors-shots.mjs`,
`bhrt-shots.mjs`, `programs-page.mjs`, `returning-band.mjs` and `flower-frames.mjs` each drive a headless browser painting through
SwiftShader — software WebGL, on the CPU. Two of them at once starve each other, and what
starves first is every assertion that waits on wall-clock time rather than on state: the
sculpture's header check drives a scroll in 40ms steps and reads the bar 900ms later, and
under contention it returned **`hdr--hidden` still set on one door and a mid-transition
`rgba(0,0,0,0)` background on another — both false**. Run alone, the same commit was green
on all six page/width pairs. **A failure from a parallel run is not evidence of anything.
Re-run it solo before you believe it.**

## The whole peptide page — `peptide-page.mjs`

```bash
npm install playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
node tools/qa/peptide-page.mjs [--shots]
```

The page had three harnesses that each watched one thing — the hero ground, the bonds lab,
the scene stills — and nothing that watched the **page**. This is that one: 45 checks over
eleven viewport widths, the chain scene at four progress stops on desktop and phone, every
dialog the page owns, and the contrast arithmetic for the 2026-08-16 cool re-grade. It
exits non-zero on any failure.

⚠️ **Check 1 reads the stylesheet as text, and it is the most important check here.**
Writing the pair *lightness-star slash chroma-star* inside a CSS comment **closes the
comment on the spot**. The prose after it is parsed as declarations, the parser swallows
the rule that follows, and **nothing reports it**: `.scene-stage` lost its `height:100svh`,
the stage measured 0px, the canvas never drew — and the console was clean, with
`window.__scene.p` still reporting the right progress because the script was fine. Only a
screenshot showed it. Write `L* and C*`.

⚠️ **The helix width is asserted against `curve()`'s geometry, not against an earlier
frame.** The obvious test — compare the loose wave at p=.66 with the finished helix at
p=.78 — is wrong, and failed loudly before it was replaced: at .66 assembly is only two
thirds done, so the frame still holds unwritten beads scattered across ±.46W and the
measurement returns the *scatter's* 762px, not the chain's 496. There is no frame in which
the whole chain is a wave. The assertion is `2 × min(W×.17, 260)` on desktop and
`2 × min(W×.30, 150)` on a phone, ±14% for the bead radius at either end.

⚠️ **The scene's ground is not on the canvas.** The chain is painted onto a *transparent*
canvas and the ground is the stage element's own `background-color`, written per frame.
Sampling pixel (0,0) of the canvas returns `rgba(0,0,0,0)` and reports the stage as pure
black at every stop. Read the element; measure drawn extent by **alpha**, which also
survives the ground changing colour across the dawn.

⚠️ **360px fails on purpose and is asserted as a known failure, not skipped.**
`.f-news{width:22rem}` is 352px against ~320 of content, so the *footer* makes the document
374px wide at a 360 viewport — on all three pages of this site. Round 6 recorded it and left
it deliberately, because the footer is a documented true copy of the landing page's and the
one-line fix belongs to all three files in one commit. If 360 ever passes, that fix landed
and the exemption should come out.

`EXPECTED_MISSING` is **empty and should stay that way**. It held Dr. Nahla's and
Dr. Khalid's portraits for a day while they could not be landed from this environment; the
files arrived and the list emptied itself, which is exactly what the exemption was written
to do. Any 404 now is a real one and fails the run — add a path there only with a dated
reason.


The previous handover recorded this as "not in the repo", and that cost a day of
rendering static fallbacks instead of the real scroll story. It is here now.

The page loads GSAP / Lenis / Three from jsDelivr, which is blocked by egress policy in
sandboxes. The harness serves the repo over HTTP and fulfils those five requests from
`node_modules` instead. **Nothing about this ships** — the page still loads them from the
CDN in production.

```bash
npm install gsap@3.13.0 lenis@1.3.4 three@0.166.1 playwright@1.49.1
node tools/qa/scene-shots.mjs
```

`?scene=<0..1>` freezes the stage at any progress and `window.__scene.p` reports where the
story actually is. `?layout=side` selects the right/left composition; omit it for the
default centred scene. `?probe=1` swaps the scene for its static fallback.

## The returning-patient band — `returning-band.mjs`

```bash
npm install playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
node tools/qa/returning-band.mjs [--shots]
```

The strip added 2026-08-29 under the flower on all four carriers: eyebrow, heading, two
outlined actions, dressed in each door's orb. **164 checks** — parity, the flower's count,
desktop and phone geometry, 320px, the two destinations, the per-door theming and its
contrast arithmetic, every interaction state, the page mid-load with its webfonts still
coming, and the page with JavaScript off.

⚠️ **§7b IS THE ORB, AND IT RE-DERIVES THE CONTRAST FROM PIXELS RATHER THAN TRUSTING THE
COMMENT.** One byte-identical line — `var(--door-tint,var(--gold-tint))` — has to resolve
to three different grounds across four pages, so §7b asserts each page's resolved ground
and eyebrow, then computes all twelve contrast ratios from `getComputedStyle`. It
composites the translucent button fill over the strip's ground **by hand**: the computed
style hands back the `rgba`, not what the eye receives, and reading it raw would report
the label's contrast against a colour no reader ever sees. It also pins `.programme`'s own
ground at `#F0EBE7` — the theme dresses the strip, never the chapter.

⚠️ **THE TWO CHECKS THAT MATTER ARE THE COUNT AND THE FOLD**, and both were made to fail
on purpose before they were trusted:

- **The count.** A seventh entry spliced into the script's `STEPS` array is caught three
  ways — `PS:JS` drifts off its pinned sum, `.ps-arm` returns 7, and the progress row
  reads `07 01 02 03 04 05 06`. The band must never become a seventh step, and this is
  what says so.
- **The fold.** `.ps` is scrolled to the very top of the viewport — the strictest framing
  a reader can give the flower — and the band's top must be a full viewport below it.
  Shortening `.rb`'s margin to 20px fails it at 1440×900 (740 < 900), 1920×1080 and
  1280×800. On a phone the check is the same shape and passes on the flower's own height
  (988 ≥ 844 at 390) rather than on a margin.

⚠️ **§0 PINS THE PS SUMS RATHER THAN COMPARING THEM.** The band lives *outside* the
`PS:*` markers so it cannot move the flower's blocks; a compare-only check would be happy
with four matching rows of the wrong sum, which is exactly what a well-meaning edit to the
sculpture would produce. The pinned values are `CSS 4d192d81e3e8`, `HTML 95463c5391ea`,
`JS d2ee51cad3aa` — plus `ab64ee862292` for the men's door, whose JS carries the one
recorded comment of 2026-08-24g. The band has its **own** markers, `RB:CSS` and
`RB:HTML`, asserted aligned across the same four pages.

⚠️ **THE `<noscript>` ROLLBACK IS COUNTED AS TEXT, NOT QUERIED.** `.pg-steps li` returns
**0** once JS has run — the flower moved that list into `<noscript>`, whose contents are a
single text node. This is the dead selector `NEXT_ITERATIONS.md` §3 records staying green
for weeks, and the first run of this file walked straight into it. It counts `<li>` in the
`<noscript>`'s `textContent` instead.

⚠️ **TWO MORE HARNESS BUGS, BOTH FOUND BY THE ORB ROUND AND BOTH WORTH KNOWING.**
(1) The grid check compared `.rb-inner`'s left edge with `.ps .wrap`'s — but a `.wrap`
rect is its **border** box and `--pad` sits *inside* it, so the comparison was off by up
to 72px and failed on pages that were perfectly aligned. It compares against `.ps-ed`,
the flower's editorial column, which is the edge the strip actually has to meet.
(2) The "arrow is right-aligned" check used `right - arr.right < 24` while the desktop
padding was **also** 24 — so it measured the padding itself as a failure the moment the
buttons grew. Thresholds that happen to equal a layout value are a trap; it is `<= 26` now.

⚠️ **§7 MEASURES FROM THE OFFSET PARENT, NOT THE VIEWPORT.** `page.hover()` scrolls the
element into view, so a `getBoundingClientRect()` comparison reports the *scroll* as a
layout shift and fails on a page that never moved — it did, on the first run. Walking
`offsetLeft`/`offsetTop` is scroll-independent, which is what "hover, focus and press
change nothing but paint" actually needs to assert.

⚠️ **§8 IS THE LOADING STATE AND §9 IS THE NO-JS ONE**, because "preserve the layout
across hover, focus, pressed and loading" has to mean something testable. §8 blocks every
`woff2`: the label swaps from the fallback's metrics to MediGyn NOW's, which changes the
*word's* width, and the box must not follow it — it does not, because the arrow is pushed
by `margin-left:auto` rather than sized by content and the height is a `min-height`. §9
loads with `javaScriptEnabled:false`: `.ps` is `display:none` until the script reveals it,
so the band has to stand next to the `<noscript>` rollback as readily as next to the
flower. It is plain markup with no script of its own, and §9 is what keeps it that way.

⚠️ **THE DOORS PULL GSAP AND LENIS FROM jsdelivr AND A SANDBOX HAS NO ROUTE TO IT.** Left
alone the three doors load without their motion libraries and the console fills with
tunnel failures that read as a page bug. This file serves both from `node_modules`, the
same way `doors-shots.mjs` does; without it the three doors fail "no console errors" and
`/programs/` passes, which is a difference in the *environment*, not in the pages.

## One pill in the doctors chapter — `doctors-pill.mjs`

```bash
npm install --no-save playwright@1.49.1
node tools/qa/doctors-pill.mjs [--shots]      # five pages x three widths, plus one real popup
```

His call 2026-08-24: "for all the ones containing doctors it should only have one book
consultation across all pages". Nineteen per-card pills came out across five pages and each
chapter closes on one centred pill under the row instead.

⚠️ **THIS EXISTS BECAUSE THE RULE HAS ALREADY BEEN REVERSED ONCE.** The per-card pill was his
call on 2026-08-14, recorded then as a deliberate override of the estate's
one-pill-per-section rule, and it came back out ten days later. **A rule that has flipped once
flips again**, and the page it flips on next is whichever of the five somebody edits without
reading the other four.

⚠️ **THE POPUP'S PILL IS ASSERTED PRESENT, NOT ABSENT.** `.pxd-cta` is the exception the rule
was always written to allow — one doctor on screen, one pill — and it is now the ONLY
per-doctor route to booking. A well-meaning "only one pill anywhere" sweep that took it out
would leave a reader with no way to reach one named doctor at all, so the check fails in that
direction too.

⚠️ **THE PORTRAITS ARE SCROLLED INTO VIEW BEFORE "no 404s" IS CLAIMED.** They are
`loading="lazy"`: a page that never scrolls to the chapter never requests them, and a response
listener over requests that were never made reports a clean run on a chapter of broken images.

## Door-plate contrast — `door-contrast.mjs`

Section 04's three plates are photographs of very different tone, and the copy on them is in
three different colours. `node tools/qa/door-contrast.mjs` runs BRAND.md's measurement over
every combination — three doors × three controls × two viewports — with each control checked
against **its own** colour rather than against ivory.

```bash
npm install playwright@1.49.1 sharp
node tools/qa/door-contrast.mjs          # the shipped scrim: 18/18 clear
node tools/qa/door-contrast.mjs --rail   # the rail's ramp: fails the BHRT hook, twice
```

Exits non-zero on any failure, so it can gate a deploy. Run it after changing a plate,
a `--plate-y`, the scrim, or any of the three copy colours.

⚠️ The binding case is the rose `.hook` over the pale BHRT plate, with about 0.5 of margin —
not the ivory title, which clears by a factor of three. Anything that lightens that plate's
lower third is the change to watch.
⚠️ Expect ±0.05 between runs; AVIF decode is not bit-identical. Trust the pass/fail.

## Booster-plate contrast — `boost-contrast.mjs`

Section 05's diptych puts copy **on** the photograph, so a plate swap there is a
re-measurement and not a `src` change — the same standing cost 04 carries.

```bash
npm install playwright@1.49.1 sharp
node tools/qa/boost-contrast.mjs            # three controls x two plates x two viewports
node tools/qa/boost-contrast.mjs --shots    # also write the frame it measured
```

05's twelve measurements were run by hand and the script was never kept, so every plate
swap since has been a promise rather than a check. This is that script.

⚠️ **The phone moves the goalposts, and this section has already failed on it.** The rose
`h3 em` is 38px on desktop — *large* text needing only 3 — and 22px at 390, where it needs
4.5. A scrim tuned on desktop passes there and only there. Baseline as shipped: **12/12
clear, tightest the rose em on the gut plate at 390×844 — 5.48 against 4.5, margin 0.98.**
That margin is the budget any brighter plate spends.

⚠️ **A near-1.0 ratio is almost never a real failure** — it means the foreground and the
background are the same pixels: the copy did not hide, or the rect was read before the
scroll settled. The harness flags it inline rather than letting you chase a colour bug.

⚠️ **A skip exits non-zero.** Same rule `door-contrast.mjs` learned expensively: a silent
skip that reads as a pass is worse than a fail.

## Section 04 on the live page — `services-choice.mjs`

```bash
node tools/qa/services-choice.mjs [--shots]    # 89 checks
```

Rewritten in round 19 when the ring replaced the grid. It owns **the seam**, not the ring's
geometry — that is `section04-hybrid.mjs`'s job against the lab. What it asserts here: the
ring is on the page, the artwork actually loaded, the tray hears a choice, the arithmetic
still works, and the page holds at ten widths including 1181/1180, the ring's own cliff.

**⚠️⚠️ PLAYWRIGHT WILL NEVER CLICK A CARD UNTIL THE FLOAT IS STOPPED.** Each card breathes
2.5px over 16s, and Playwright waits for an element to be *stable*, which a permanently
animating element never is. One `page.addStyleTag({content:'.pw{animation:none!important}'})`
up front. That is a harness measure; the animation ships.

**⚠️ A CARD TWO STEPS OUT CANNOT BE CLICKED AT ITS CENTRE** — its neighbour overlaps it, which
is the ring working. Turn with `#railNext` or click a card one step out, the way a reader
would.

**⚠️⚠️ THE PHONE BLOCK (A2) ASKS THE SAME QUESTIONS AS THE DESKTOP ONE, ON PURPOSE.** Until
round 19b everything below 1181 was a flat stacked list, and the flip went down with it —
a stacked card is `transform-style:flat` in a rail with `perspective:none`, so
`rotateY(180deg)` mirrors it rather than turning it. The back face was present, lit and
painted *behind* a mirrored front, and every structural check passed. So A2b asserts the rail
still has perspective and A2l asks what the reader actually touches at the card's centre —
presence and opacity were both true while it was broken.

**⚠️ THE FAN IS A WINDOW, AND `seen` MUST EQUAL `fan`.** Five cards on a phone, seven on a
tablet, eight on a laptop; the rest wait one step off the edge at zero opacity. A card the
script thinks it placed but the clip has eaten is the failure these checks exist for — it has
simply stopped being "eight" and started being "the window". All eight stay in the DOM at
every width, which `2a` asserts separately.

**⚠️ THE CHOSEN-STATE CONTRAST SAMPLES REAL PIXELS**, because the background is a photograph
and `getComputedStyle(card).backgroundColor` is `transparent` — a check written that way
scores a perfect ratio and means nothing. The photograph is same-origin, so it is drawn to a
canvas, the scrim's own stop composited over it, and the **worst of the eight** measured.
⚠️ The first version of that check reported 1.09 and was wrong about which surface it had
looked at: `el => getComputedStyle(el)` silently drops a second argument, so `g(art,'::after')`
returned `.pw-art` itself — whose background is the pale fallback plate. **A helper that
quietly ignores an argument is worse than one that throws.**

**⚠️ TWO CHECKS LOST THEIR SUBJECT AND NEITHER WAS DELETED.** The chosen-tile contrast became
the pixel sample above; `peptide-page.mjs`'s tile-versus-ground separation became **the ring
line versus its ground** (gold at 42% on the dawn — the weakest pairing in the section, and
what the cards are seen to stand on). Deleting a check whose subject left is how a page
quietly loses a guarantee.

---

## The section 04 lab — `section04-lab.mjs`

```bash
npm install --no-save playwright
node tools/qa/section04-lab.mjs [--shots]
```

49 checks over `peptide-therapy/section04-lab.html` (round 18): the nine letters all take
the stage, one rationale is visible at a time, every proposed ground clears 4.5:1 for a tile
name, the two WebGL chapters actually put pixels on screen, and the two risky gestures — F's
turn and D's replay — do what their cards claim.

⚠️ **A lab exists to be REPLIED TO, so its badges are load-bearing.** Every arithmetic claim
printed on a variant card is re-derived here in a real browser. **If a badge and this file
disagree, this file is right and the badge is the bug.**

⚠️ **The two most important checks are about honesty, not pixels.** Check 2 asserts the lab
invents no copy — every name, descriptor and chip on a tile must already exist in
`index.html` or `goals-lab.html`, because a lab that quietly writes new marketing and is
then approved by letter has laundered copy past the client. Check 4 asserts all nine
variants show the same eight names: a variant may change style and behaviour, never content,
or the comparison being asked for is not a comparison.

⚠️ **`gl.readPixels` CANNOT PROVE A CANVAS DREW, and this harness shipped that mistake for
one run.** Without `preserveDrawingBuffer` the back buffer is undefined once the frame is
composited, so reading it returns all zeroes — identical to a canvas that never drew, and it
failed both depth variants while they were visibly working. Round 10b had already recorded
this for `bonds-lab.mjs`. The honest test is the one a person does: screenshot the grid, hide
the canvas, screenshot again, diff the two.

⚠️ **SwiftShader is requested, not required.** CI has no GPU; where no context appears the
depth checks report a **gap** rather than a pass, because a green tick for a canvas that
never drew is worse than a hole in the coverage.

⚠️ **Check 9a reads the stylesheet as text**, for the same reason `peptide-page.mjs` check 1
does: an unbalanced CSS comment eats the rule below it and the console stays clean.

## The section 04 ring — `section04-hybrid.mjs`

```bash
npm install --no-save playwright
node tools/qa/section04-hybrid.mjs [--shots]
```

77 checks over `peptide-therapy/section04-hybrid.html` (round 18) — the proposal that merges
the client's three reference boards into a turning ring of his eight photographs. It asserts
the promises the page makes **in writing**, because a claim printed on a page and not checked
anywhere is a claim that will quietly stop being true.

⚠️ **The most valuable checks here are the ones about meaning, not pixels.** Check 1 asserts
the lab invents no copy — every name, descriptor, outcome and paragraph must already exist in
`index.html` or `goals-lab.html`, because a mock-up that quietly renames a service and is then
approved has changed the product by approval. Check 4o asserts the dust only ever marks a
selection, and that it travels with the card it marks.

⚠️ **Geometry is measured with motion stopped.** The cards carry a 2.5px float, so a snapshot
of their feet is the ring *plus* wherever eight independent sine waves happen to be — it broke
the ring check the moment the float shipped, reporting the front card 1px above its neighbour
on a layout that was perfectly correct. Widening the tolerance would have swallowed a real
inversion too. `page.addStyleTag('.pw{animation:none}')`, measure, remove.

⚠️ **This harness has measured an animation instead of a page four separate times** — a
`width` mid-transition, a `box-shadow` mid-transition, a responsive assertion fired 420ms into
an 800ms reflow, and the float above. **The tell is always a check that passes for exactly the
one case that did not change.**

⚠️ **`4h` asserts a computed colour, and it exists because a whole ruleset was written and
never landed.** Two `[data-pick]` blocks were inserted against an anchor comment an earlier
edit had already consumed, so the substitution matched nothing and did nothing — silently. The
toggle moved the attribute, the attribute selected no rule, and all three settings rendered
gold. **Everything looked wired and nothing was.** Asserting the computed value is the only
thing that can tell a token apart from a token-shaped comment.

⚠️ **Check 6 tests the packer, not the page.** It runs `tools/pack-artifact.mjs`, wraps the
output in a minimal document, aborts *every* network request, and then asks whether the faces
still loaded, the photographs still showed and no second document got nested. An artifact copy
is worth nothing if it fetches.

⚠️ **An intermittent check is a check that has not finished being written.** 4o3 passed at
100% and then failed at 64% on the next run; the cause was mote lifetimes counted in frames
rather than milliseconds. Three consecutive clean runs is the bar.

## Lab vs live — `ring-parity.mjs`

```bash
node tools/qa/ring-parity.mjs [--verbose]      # 23 elements, all agree
```

The ring is built in `peptide-therapy/section04-hybrid.html` and **lifted** into
`peptide-therapy/index.html`. This harness renders both, walks 23 of the ring's elements in
each, and fails on any difference in colour, type, layer, visibility or stroke.

**⚠️⚠️ IT EXISTS BECAUSE MARKUP CARRIES DEPENDENCIES ON RULES THAT ARE NOWHERE NEAR IT, AND A
MISSING RULE FAILS BY RENDERING SOMETHING RATHER THAN BY ERRORING.** Round 19's graft proved
it four times, and every one passed every structural check in `services-choice.mjs` while it
was broken:

| what | how it failed | why nothing caught it |
|---|---|---|
| `.sr` was not defined on the live page | every pathway's name printed across its photograph in the browser's default face | it looked like part of the artwork |
| `.pw-back h3` took its colour by inheritance | dark plum on burgundy — the live page's `h1,h2,h3{color:var(--ink)}` beats inheritance | the element was present and its text was right |
| the ring's buttons lost their type | the lab resets `button{font:inherit}`, this page passes only `font-family` | those buttons hold SVGs and hidden text, so nothing showed |
| `.pw-body` sat under `.pw-face` | the front card's pill was a picture of a button over another button doing the same job | the goal still got added; only the hover was dead |

**It is two-way.** A fix applied to the live page and not to the lab fails just as loudly,
which is what keeps the lab worth prototyping in.

**⚠️ GEOMETRY IS EXCLUDED ON PURPOSE.** The lab's stage and the page's `.wrap` are different
widths. Everything carrying a *design decision* is compared; width and spacing are not.
`transform-origin` is compared as a **fraction of the layout box** — `getBoundingClientRect`
returns the *scaled* rect while `transform-origin` resolves against the unscaled one, and
dividing one by the other reported the tick's `top right` as 2.01 in one file and 2.00 in the
other. One decimal place, because what it guards is foot-anchoring (`0.5 1.0`) against centre
(`0.5 0.5`).

**⚠️ ADDING A PROPERTY IS CHEAP; REMOVING ONE TO GREEN A FAILURE IS HOW THIS FILE STOPS BEING
WORTH RUNNING.**

---

## Encoding a new plate — `tools/encode-plate.mjs`

```bash
node tools/encode-plate.mjs <master> <out-basename> [width]
```

Writes the AVIF/WebP pair the `<picture>` elements expect, prints the source aspect against
the target's so you know what `cover` is discarding, and **refuses to overwrite an existing
basename** — BRAND.md's rule, because a visitor holding the old file keeps being served the
old picture. Encoding is not the last step: if copy sits on the plate, re-measure.

⚠️ Serve `three.module.js` as `text/javascript` or the import map rejects it.
⚠️ Read opacities from `getComputedStyle`, not from the source: several bugs found with
this harness were elements that were positioned correctly but never reached full opacity.
