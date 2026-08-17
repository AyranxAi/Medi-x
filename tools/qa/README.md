# Scene QA harness

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
