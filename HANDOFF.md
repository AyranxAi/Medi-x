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
| `9671ff1` | This handoff rewritten; `HANDOVER.md` marked superseded in part |
| `aad3aaa` | The consultation doors become a triptych, three modes; Venus as interim plates; CC0 recorded |

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

**Approved by him, and the licence question is closed.** The scan is a plaster cast (ref.
KAS434/1) in **The Royal Cast Collection at SMK – National Gallery of Denmark**, released
**CC0 1.0 Public Domain**. CC0 imposes nothing: commercial use, modification and
redistribution are all permitted and no attribution is required.
Recorded in [`LICENSES/CC0-VenusDeMilo-SMK.txt`](LICENSES/CC0-VenusDeMilo-SMK.txt) so the
next session does not have to ask again. SMK invite a note at web@smk.dk from anyone making
new work from the scans — a courtesy, not a term, and worth doing.
⚠️ The `.glb` itself is **not** in the repo and is not redistributed; the page ships a render
and a point cloud.

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

~~**Two statue scans are needed**~~ — **closed 2026-08-12. The doors have real photography and
no further scans are wanted.** Venus stays where she belongs, in the scene; she is out of the
doors. One image per door, his upload:

| Door | Plate | Subject |
|---|---|---|
| Hormone Therapy & BHRT | `images/doors/bhrt-941.*` | A gold molecule model on cream silk over travertine |
| Modern Menopause | `images/doors/menopause-941.*` | A woman in burgundy silk at a travertine counter |
| Testosterone Replacement | `images/doors/trt-941.*` | A man in a dark suit at a dark stone table |

**AI-generated**, recorded in [`LICENSES/AI-DoorPlates.txt`](LICENSES/AI-DoorPlates.txt).
⚠️ No identifiable person appears — both figure plates are framed above the face, so no model
release is in play. **That is load-bearing: do not re-crop to include a face.**
⚠️ A smart ring on a dock is visible in two plates. Raised as a risk — a device in frame can
read as a device the clinic supplies — and **kept as mood, his call**. Reversible by tightening
the crop; the copy band is nowhere near it.

**One size per door, which is deliberately not the repo's usual pair.** Heroes ship wide+phone
because a hero is biggest on desktop. A door inverts that — a third of the viewport on desktop
(480 CSS px, 960 at 2x) and the full width on a phone (390, 1170 at 3x) — so the phone wants
the larger file. 941 is the source's own width and covers both; a second file would be an
upscale. AVIF 39–66KB, WebP 60–98KB, all lazy.

⚠️ **`cover`, and each door crops from its own anchor.** Sources are 941×1672 (0.563) against a
panel near 0.75, so cover discards about a quarter of the height. `--plate-y` picks which
quarter, per door: BHRT 30%, Menopause 50%, TRT 50%. `object-fit:contain` and the `--plate-scale`
trio are gone — both existed only to make one statue look like three.

⚠️ **`images/medi-gyn-*.png` are the masters and reach no visitor.** The `-landscape` halves are
for the per-consultation pages that do not exist yet, and are deliberately not encoded, because
nothing points at them.

**The scrim was measured, and the rail's ramp — which the old comment told you to revert to —
fails.** `.hook` is rose `#C79A92`, not ivory, and over the pale BHRT plate the rail's ramp
lands at **4.18:1** at 1440×900 and **4.07:1** at 390×844 against the 4.5 a 14–17px run needs.
It passes over the dark TRT plate beside it, which is what makes it dangerous: two thirds of the
triptych look fine. The shipped ramp is keyed to the worst plate. BRAND.md's method, three doors
× three controls × two viewports, each control against its own colour — **18 of 18 clear**:

| Control | Colour | Need | Worst measured | Where |
|---|---|---|---|---|
| `.hook` | rose `#C79A92` | 4.5 | **5.01** | BHRT, 390×844 |
| `h3` | ivory `#FAF7F1` | 3 / 4.5 | 13.83 | BHRT, 1440×900 |
| `.link-arrow` | gold `#C2A05E` | 4.5 | 6.62 | BHRT, 390×844 |

⚠️ **The margin on that hook is 0.51, so a plate change is a re-measurement, not a swap.**
The harness is in the repo: `node tools/qa/door-contrast.mjs`, and `--rail` reproduces the
failing alternative so nobody has to take the paragraph above on trust. It needs `sharp`
alongside playwright. Expect ±0.05 between runs — AVIF decode is not bit-identical — so treat
the harness's pass/fail as the answer and these numbers as the record of one run.

`images/placeholders/` is deleted — the plates it was standing in for have landed.

**The triptych is built and live; the mode is not chosen.** All three ship behind a switch and
he is judging them on the real page:

| Mode | URL |
|---|---|
| Expand once on entry — **default, and the recommendation** | `/hormone-balancing/` |
| Pinned expansion | `?doors=pinned` |
| Static full bleed | `?doors=static` |
| The original scroll rail | `?doors=rail` |

**Delete the two he does not pick**, and the rail with them once the triptych has been seen on
a real phone. The recommendation is entry: pinned is the better moment in isolation, but it is
a second pin arriving one screen after a 360vh pinned scene, and costs ~160vh of held scroll
on a page whose original complaint was pace.

⚠️ **The mode switch runs above `if (probe) return`, deliberately.** Layout is not scroll-gated
motion and `?probe=1` is the layout QA switch, so it is exactly when you want to see the
triptych. Probe and reduced-motion skip the *animating* and land on the finished state.

~~⚠️ **The door plates are interim**~~ — **closed 2026-08-12, see the table above.** For the
record of what changed with them: the two properties this paragraph blamed on using a
contained marble figure did not both revert when photography landed. The panel height did not
(it is never a flat viewport tall, and that is now about the headline, not the plate). The
scrim did not either, but not in the direction predicted — the rail's ramp was measured and
**fails** on the pale plate, so the triptych keeps a ramp of its own for a completely
different reason than the one written here.

⚠️ **Superseded 2026-08-12 — the panel height is measured, not fixed, and the headline
stays.** Every mode used to fade `.sec-head` out as the panels grew: entry collapsed it to
`max-height:0` and then stripped the section's top padding, pinned keyed its opacity to `--k`.
The section ate its own headline, and *"Where would you like to begin?"* was gone by the time
the three answers to it reached full bleed. The panels now bleed **underneath** the headline.
Height is `calc(100vh - var(--head-block))` — the flat `92vh` this file used to name is now
only the JS-less fallback (`8vh`). Two variables, because the geometries differ: `--head-block`
counts `.sec-pad`'s padding for the modes that scroll in normal flow, `--head-h` is the
headline alone for pinned, which zeroes its own padding inside a 100vh stage.

⚠️ **`?doors=pinned` has never actually pinned, and this is not new.** `body` carries
`overflow-x:hidden`, which makes the body a scroll container and kills `position:sticky` on
`.svc-stage` — verified against the pre-change file, where the stage scrolls away exactly the
same. `--k` still reaches 1, so the panels expand on schedule and the mode *looks* plausible in
a screenshot; it just never holds. Worth knowing before judging pinned against entry, and it
dies with the mode if entry is the pick.

**Four controls are still inert** — the three door *Explore* links and 05's. Same standing
rule: a control with no destination stays inert rather than pointing at a placeholder URL.

**Recommended for the lower half**, none of it built:
- **The missing beat is "when".** The page says what BHRT is and where to begin but never how
  long it takes to feel different. It belongs between the doors and the FAQ.
- **The placeholder testimonials are the biggest liability on the page.** Invented patient
  voices on a regulated medical site are a different category of risk from an unfinished
  photo. Cut the section until three real ones exist.
- **05 Booster programs interrupts the run** from doors → proof → book. It reads better after
  the FAQ. ⚠️ **This is a placement question and is still open** — the four treatments below
  are about weight, and moving the section would still be worth doing whichever one wins.

**05 has four treatments behind a switch, offered 2026-08-12 for a decision.** Same shape as
the doors: all of them live, judged on the real page, three deleted once he picks. **The bare
URL is unchanged**, so nothing here is live yet.

| Mode | URL | Weight comes from | Notes |
|---|---|---|---|
| As shipped | `/hormone-balancing/#boosters` | nothing — that is the problem | 780px of flat cream, two headings and six lines, straight after three full-bleed photographs |
| Ledger | `?boost=ledger` | **structure** | Two ruled rows, name left, promise right. The only one that gives up the ✦ — stacked rows say "and" by sitting under each other |
| Cards | `?boost=cards` | **containment** | Ivory panels, hairline, gold top rule. Safest: changes density without changing the argument |
| Lockup | `?boost=lockup` | **the idea** | Says "Hormone Therapy" once at headline scale with both amplifiers hanging off it. The only shape that matches what the section *is* — one offer, two halves, one door |
| Band | `?boost=band` | **ground** | Burgundy. ⚠️ **Reverses his 2026-08-11 "the ground goes light with it".** Reopened only because the doors changed underneath that decision |

⚠️ **All four run off one DOM**, so deleting three is pure subtraction. `.boost-lede` and
`.boost-base` exist for lockup and are inert elsewhere. **`.boost-base` is clipped, never
`display:none`** — a screen reader still hears "Hormone Therapy + Gut Health" while the eye
sees the name once; verified by comparing `textContent` against `innerText`.

**Band was measured** (rose on burgundy is the case worth checking, and it clears): kicker gold
5.00, `h2` ivory 11.58, `h2 em` rose 4.99 against 3, sub and body 11.58, star 5.00, the on-dark
button 10.32. Both viewports, all pass.
⚠️ Two artefacts nearly got reported as failures here, both worth knowing for the next
measurement: hiding `h2` does **not** hide `h2 em`, so an unhidden rose `em` inside an ivory
heading measures rose-against-rose and reads 1.00; and a pill button's bounding rect includes
corners outside the border-radius, so the worst 2% samples section ground the text never
touches. **Hide the children too, and sample pill-shaped controls inset.**

Also fixed while in there: `.boost-sub` broke before its last word and left "it." alone on
line two. `text-wrap:balance` rather than a wider `max-width`, which would only move the
problem to the next breakpoint.
- **The tonal cliff.** The scene ends on a two-tone diptych and the page drops into flat cream
  for five sections. Carrying burgundy plates with sculpture into the doors is most of the fix.

---

## On repo weight — raised, and the answer is "leave it"

`archive/` is **100 MB** (95 MB of it `archive/sources/`), 91 files tracked, mostly 6–8 MB
uncompressed PNG masters of the team hero. `.git` is a 105 MB pack because that history is in
it. A clone is ~220 MB.

**None of it reaches a visitor.** Vercel serves static files; nothing in `archive/` is
referenced by any page — the single grep hit is a comment in `index.html` naming the path.
Page weight is completely unaffected.

So the cost is clone and CI time, not performance. And the cheap fix does not work: deleting
the files now shrinks the working tree but **not** `.git`, because they are in history — that
needs a rewrite (`filter-repo`/BFG) which changes every commit hash.

**Recommendation: leave it alone.** It is doing exactly the job the README says it does —
source masters for re-crops — it costs nothing at runtime, and the only fix that would
actually shrink the repo is disruptive out of proportion to a slow clone.

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
