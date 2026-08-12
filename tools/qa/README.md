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

⚠️ Serve `three.module.js` as `text/javascript` or the import map rejects it.
⚠️ Read opacities from `getComputedStyle`, not from the source: several bugs found with
this harness were elements that were positioned correctly but never reached full opacity.
