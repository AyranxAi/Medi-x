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

## The programme lab — `programme-lab.mjs`

```bash
npm install --no-save playwright@1.49.1
node tools/qa/programme-lab.mjs            # 24 checks at 1440 and 390
node tools/qa/programme-lab.mjs --shots    # a PNG of every bay, at both widths
```

`peptide-therapy/programme-lab.html` auditions fifteen treatments of chapters 05 and 06.
The harness checks the four things the lab **claims**, not its styling:

- **the copy is one copy** — every client string survives into every treatment that shows
  full step bodies, so no layout can win an audition by quietly shortening a sentence;
- **the heights are measured** — each chip's printed pixel height and its ratio against
  the shipped baseline are re-derived from the DOM and compared with what is printed;
- **no new colour** — every hex and `rgb()` in the stylesheet is a peptide-page token or
  a documented exception;
- **the fallbacks are real** — A6's two-column stage is genuinely gone at 390 and A5's
  accordion is genuinely standing in its place.

⚠️ **A6 is excluded from the one-innerText copy check on purpose, and gets its own walk.**
It holds one step at a time by design. The first version of the check read it like a
static list and reported a working treatment as losing four strings. A treatment may
defer copy behind a control; it may not lose it — so the walk clicks all seven tabs and
unions what they showed. Excluding a bay from a check is only legitimate when the check
is wrong *for that bay*, which is why each exclusion is named in the source.

⚠️ **Characters are measured in the real face, never derived from `font-size`.** CSS `ch`
is the advance of the digit zero, and MediGyn NOW's zero is narrow against its own average
letter — the ratio over this section's real strings is **~1.4**. A `max-width:78ch` set
109 actual characters. The check runs each element's own text through canvas `measureText`
in its own computed font. Assuming 0.5em per character over-counted by a third and would
have had someone tightening a measure that was already correct.

⚠️ **Two bugs here were found by a screenshot and not by the harness**, and both now have
regression checks: A8's Hormones panel lost the divider between SHBG and Free Testosterone
(a last-row exemption written for two columns, misfiring on three cells in one), and A3's
week ruler dropped to four ticks on a phone while its bars kept running the full width —
a two-month protocol drawn against a four-week ruler. Nothing threw for either. **Run
`--shots` and look at the phone set**; the desktop form is the one everybody imagines
while designing, and 390 is the one most of the traffic gets.

⚠️ **Check 1 caught itself.** The stylesheet-comment check is copied from
`peptide-page.mjs`, and the first run of this file failed to parse as JavaScript because
the comment *describing* the bug contained the sequence that causes it. The comment now
says so instead of demonstrating it.

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
