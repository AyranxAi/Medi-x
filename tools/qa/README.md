# Scene QA harness

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
clear, tightest the rose em on the gut plate at 390×844 — 5.41 against 4.5, margin 0.91.**
That margin is the budget any brighter plate spends.

⚠️ **THAT WARNING WAS UNTRUE FOR FOUR COMMITS AND THE HARNESS IS HOW IT WAS CAUGHT.** `74e25fb`
dropped `.boost-one h3`'s `font-size` when the diptych replaced the bands layout, so the title
fell back to the UA default — a flat 19px at *both* viewports. The tell is in the output
itself: every control printed `19px small need 4.5`, including the desktop rows the paragraph
above promises will read `38px large need 3`. **Read the size and class columns, not just the
pass column** — the section was passing a stricter test than the one documented, which is the
benign direction, but the same silent drift in reverse is a failure nobody would see. Fixed
2026-08-12; desktop rows now read `38px large` and the phone rows `22px small`, as described.

⚠️ **A near-1.0 ratio is almost never a real failure** — it means the foreground and the
background are the same pixels: the copy did not hide, or the rect was read before the
scroll settled. The harness flags it inline rather than letting you chase a colour bug.

⚠️ **A skip exits non-zero.** Same rule `door-contrast.mjs` learned expensively: a silent
skip that reads as a pass is worse than a fail.

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
