# Handoff — 2026-08-11 (evening)

Everything here is **on `main` and deployed**. It replaces the earlier handoff of the same
date, which described the scene this session rebuilt.

For durable design law read [`BRAND.md`](BRAND.md). For the service page's own anatomy read
[`hormone-balancing/HANDOVER.md`](hormone-balancing/HANDOVER.md) — **which this session made
partly false**; it carries a superseding block at the top listing exactly what.

---

## The one-line version

The Signals scene was rebuilt around his idea: **she stands right, the symptoms are a list on
the left, ✦ BHRT travels down her, and the ground splits behind her into what she had and what
she has.** She is a Venus de Milo — a point cloud that resolves into marble. The old centred
scene is intact at `?layout=centre`.

---

## What shipped, in order

| Commit | What |
|---|---|
| `ee47137` | The side layout, Venus, ten symptoms, section 03 stripped, the QA harness |
| `b065e01` | Glass controls; steppers moved from beats to chapters |
| `fe60347` | The centred scene says BHRT again (it had stopped) |
| `8280471` | His five FAQ answers replace the six invented ones |
| `35ea2af` | "Is this for men too?" restored |
| `793c227` | Side becomes the default; centred moves to `?layout=centre` |
| `be712eb` | 03 becomes a headline; ◂ ▸ removed; subtext up; disclaimer out |
| `8e1853b` | "What is BHRT?" |

---

## The scene as it now stands

**Two layouts, one file.** `?layout=centre` is the old centred capsule scene, unchanged in
behaviour and still correct. Everything else is the default. The fork is `const SIDE` and a
single `updateSide()`; the original `update()` was not restructured.

**Track: 360vh desktop, 300vh phone** (was 600/460). The old track spent 42% of itself on
recognition and held the finished picture for the last 3.9%. It now holds from `.80` to the
end — roughly 72vh against 23vh, in a track 40% shorter.

**The timeline**, all pure functions of pin progress:

| Window | What |
|---|---|
| `.015–.20` | The ten symptoms appear, staggered, tethered. Ground wholly dark |
| `→ .48` | All eight beats run and finish |
| `.27–.36` | The morning sweeps in from off the right edge to `W*.72` |
| `.30–.36` | **✦ BHRT** ignites at the pituitary |
| `.36–.68` | Ten cuts, `rel(i) = .36 + i*.036`. Each: tether retracts, answer lands `.01` later, she nudges left |
| `.40–.66` | Point cloud cross-fades to marble |
| `.40–.78` | The seam tracks from `W*.72` to her back |
| `.80–.88` | **BHRT** in Megante |

**She migrates** `W*.70 → W*.50`, one tenth per cut, so her position is the progress indicator
and the stage is never still. That was the answer to "too slow" — which was never about
duration. BHRT used to arrive at `.56` and the first visible improvement at `.866`, so the
claim and its proof sat 40% of the scroll apart.

**The seam is two-phase and the first phase is a correctness fix.** The reversals are fixed
ink and are only legible once blush is under them. A single ramp converging on her back left
the seam near the right edge at `.37`, so "Deep sleep" arrived as ink on the dark ground.
`seamX = mix(mix(W*1.35, W*.72, wipeIn), cx, wipe)`.

**Contrast got simpler, not harder.** Each half keeps one permanent ground, so symptoms are
ivory-on-dark for their whole life and reversals ink-on-blush for theirs. Nothing crosses
anything — the failure that cost a round when copy and ground lerped toward each other.

**Every beat finishes before `.48`, on ground that is still wholly dark.** Not tidiness: the
seam sweeps through the middle from `.34`, so centred copy would cross it. The back half is
deliberately wordless.

**Phones get no diptych.** 390px will not hold three columns, so the one column rewrites
itself in place — symptom out, outcome in — and the ground rises whole. His call.

---

## Venus

**Approved by him, 2026-08-11, and cleared for commercial use.** The GLB carries no copyright
field — only a Sketchfab generator string — so the grant lives with him, not in the file.
Nothing in `LICENSES/` covers it.

Two assets, baked together from one normalisation:

- **A 4000-point cloud**, Int16-quantised in figure space, inlined (~21KB). No loader, no
  runtime GLTF, single-file property intact — the same trade the fonts already make.
- **`images/scene/venus-stone-*`** — AVIF + WebP, 1005×2400 and 628×1500, 60KB and 36KB.

⚠️ **Both were baked from the same orthographic frame, and that is the only reason the
cross-fade registers.** Re-bake both together or neither. `VEN_ASPECT = 0.41872` must match.

⚠️ **Pre-rendered, not real-time, on purpose.** The stage is 2D and locked to one camera, so a
runtime GLB buys nothing visible and costs a loader, ~8MB, and a second WebGL context on
phones already paying for the hero silk shader.

⚠️ **The scan is wider than the capsule figure** — max half-width `.170` against `.139`. That
is why the centred layout could not absorb Venus *and* ten symptoms at 390px, and it is the
measurement that made the side layout necessary rather than merely nicer.

---

## Traps found the hard way, this session

1. **`OrthographicCamera`'s `top`/`bottom` are camera-relative, not world coordinates.**
   Passing world Y put the frustum above the model and clipped everything below the ribs, so
   Venus rendered as a torso fragment. It cost three render passes and a wrong conclusion
   about the asset. Frame it `(-halfW, halfW, H/2, -H/2)` with the camera at the centre.
2. **A near/far of ±1e5 on a two-unit model is a real bug but was not *this* bug.** It
   destroys depth precision and is worth fixing on sight — it just was not why the statue was
   cut in half. Fixing it changed nothing, which is what proved the frustum was the fault.
3. **"Faint at the payoff" was a stagger, not a bloom.** At scrub `.90` the last six reversals
   sat between `.50` and `0` opacity because answer *i* completed at `.898 + i*.009`. The dawn
   finishes at `.850`, so the ground is identical at `.90` and `.97`. A previous round blamed
   the radial bloom and nearly moved fixed ink back onto `--scene-fg`, which would have
   reintroduced the 1.42:1 crossover. **Read opacity from `getComputedStyle` before believing
   any colour diagnosis.**
4. **Ten answers against an eight-row `CFG` threw on `CFG[8]`** in the live centred scene.
   Growing the symptom list touches four DOM lists *and* two anchor tables and two loop bounds.
5. **Removing the ninth beat silently removed the only BHRT reveal in the centred path.**
   "✦ Meet BHRT." became `.scene-title`, which only `updateSide()` drove; section 03 had lost
   its 116px word in the same change. For two commits the live page never said the word above
   11px. **Deleting an element two code paths read is a two-path change.**
6. **A flag nobody can find is not a comparison switch.** `?layout=side` shipped opt-in so the
   two could be compared, and the bare URL then served the old scene to the person who asked
   to see the new one, three times. Default to the thing you want looked at.
7. **`--scene-fg` keyed to progress is wrong when the ground is not uniform.** The phase
   indicator sits top-right, which the blush reaches long before it reaches her; it is keyed to
   `seamX` now. The controls sit bottom-left on the permanently dark half and take a fixed
   ivory instead — following `--scene-fg` turned them to ink on ink.
8. **`.faq-a p` carried the gap between an answer and the next question.** That worked while
   every answer was one paragraph, because the two spaces were the same thing. His longest
   answer runs seven and repeated a 24–32px gap six times inside it.
9. **Both uploaded scans are the same statue.** The OBJ is also a Venus de Milo, lower-poly.
   There is no male figure in the repo.

---

## What is open

**Two statue scans are needed**, cleared the same way Venus was:
- **A male classical figure** for Testosterone Replacement — Doryphoros, Hermes, Apollo. This
  is the door with no image in any form.
- **A second female figure** for Modern Menopause — a draped mature type, so she reads as a
  different woman rather than the same one twice.

Render both on the scene's camera, light and marble so they land as one system.

**The consultation triptych is designed but not wired.** Three motions were built and shown to
him as a standalone page: pinned expansion, expand-once-on-entry, static full bleed. His call
on phones is settled — **stacked, full width, no swiping, in every mode.** The recommendation
is **expand-once-on-entry**: the pinned version is the better moment in isolation, but it is a
second pin arriving one screen after a 360vh pinned scene and costs another ~160vh of held
scroll on a page whose original complaint was pace.

**Four controls are still inert** — the three door *Explore* links and 05's. Same standing
rule: a control with no destination stays inert rather than pointing at a placeholder URL.

**Recommended for the lower half**, none of it built:
- **The missing beat is "when".** The page says what BHRT is and where to begin but never how
  long it takes to feel different. It belongs between the doors and the FAQ.
- **The placeholder testimonials are the biggest liability on the page.** Invented patient
  voices on a regulated medical site are a different category of risk from an unfinished
  photo. Cut the section until three real ones exist.
- **05 Booster programs interrupts the run** from doors → proof → book. It reads better after
  the FAQ.
- **The tonal cliff.** The scene ends on a two-tone diptych and the page drops into flat cream
  for five sections. Carrying burgundy plates with sculpture into the doors is most of the fix.

---

## The QA harness is in the repo

`tools/qa/` — the CDN interception the last handover described in prose. `npm install
gsap@3.13.0 lenis@1.3.4 three@0.166.1 playwright@1.49.1`, then `node tools/qa/scene-shots.mjs`.

`?scene=<0..1>` freezes the stage; `window.__scene.p` reports where the story actually is;
`?layout=centre` selects the old scene; `?probe=1` swaps in the static fallback.

⚠️ Serve `three.module.js` as `text/javascript` or the import map rejects it.
⚠️ Placement is derived from `offsetWidth`, so anything that measures must wait on
`document.fonts.ready`. A mock written this session had the exact bug the real code guards
against, and laid its labels out to fallback metrics.

---

## Deploys

Pushing to `main` deploys via Vercel and **did** fire for these commits, despite the README's
note that it only deploys owner-authored commits. If a future push does not appear, that note
is the first thing to check — an empty commit from the owner account forces it.

---

## If you change the ten symptoms

Four lists are index-matched and must move together, or the page contradicts its own
animation:

1. `.scene-label` spans — release order, and they descend the body
2. `.scene-answer` spans — answer *i* lands in symptom *i*'s slot
3. `.scene-fallback` chips — no-JS and reduced-motion
4. `CFG` (centred) **and** `CFG_SIDE` (default) — two anchor tables, not one

Plus `rel()`'s spacing, which must keep ten cuts inside the release window, and the clearance
measurement at 390×844.
