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

⚠️ **Second pass, same day — the height is a flat `92vh` again and `--head-block` is gone.**
The first pass kept the headline by shrinking the panels to fit beside it in one screen, which
made them **618px of a 900px viewport**. His read: full bleed at 69vh is not full bleed, it is
a wide band. The headline now simply sits above a 92vh rail. **The trade, stated:** 04 is taller
than one screen, so at the moment it arrives the door titles are below the fold and a short
scroll brings them up — normal for any full-bleed band, and worth 210px of photograph.
`--head-h` survives for **pinned only**, which genuinely still needs it: that mode centres the
headline and the rail together inside a 100vh sticky stage.

⚠️ **A PANEL-HEIGHT CHANGE IS A CONTRAST RE-MEASUREMENT.** `cover` crops against the panel's
aspect, so 618 → 817px moved the copy band onto a different part of every photograph. Re-run:
still 18/18, tightest the BHRT hook at **4.99**, margin **0.49**.

⚠️ **And it exposed a hole in the harness.** `door-contrast.mjs` centred the *door*, which
worked while a panel fitted inside the viewport; at 92vh the Explore link fell below the fold
and the script **skipped three of eighteen controls while still printing a clean pass.** It now
centres the lowest control being measured, and treats any skip as a failure with a non-zero
exit. **A silent skip that reads as a pass is worse than a fail.**

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
  the FAQ. ⚠️ **Still open, and now more so.** The treatment question below is closed; this is
  placement, and the section that used to be 780px is now ~1340px, so it sits between the doors
  and the proof for twice as long as it did when the note was written.

## 05 is the diptych — his pick 2026-08-12, and the Gut plate was replaced the same day

`images/gut.png` (his upload, `23ae7dd`) → `images/boost/gut-anatomy-1340.{avif,webp}`. An
anatomical GI render. **Renamed on the way in** — it arrived as
`ChatGPT Image Aug 12, 2026, 12_32_28 PM.png`, which is not a filename a repo should carry.

⚠️ **IT IS 1563×1006 (1.554) AGAINST A BOX LOCKED TO 1.778, AND `.boost-one img` HAD NO
`object-fit`.** It only ever worked because both previous plates were exactly 1340×754. Without
the guard this plate would have been **stretched, not cropped** — a distortion nobody reads as
a bug, only as a slightly wrong-looking photograph. `object-fit:cover` is on that rule now.
The retired `gut-band-1340.*` and `gut-tall-941.*` are deleted and 05's undecided frames were
repointed.

⚠️ **Both plates are now medical illustration** — an anatomical render and a lab frame. They
read as one family, which they did not when it was a pomegranate next to a pendulum, and that
is what makes the side-by-side arrangements viable at all.

| `?pair=` | What it does |
|---|---|
| `duo` | Two equal columns, picture over copy. The only one where both programmes are legible in a single glance |
| `stack` | Desktop takes the phone's layout — full-column pictures, copy beneath. Most generous, 2393px tall |
| `offset` | The shipped rows, but the picture breaks the text column and the second row drops |
| `frame` | Each programme becomes one ruled card. ⚠️ Also the most boxy, which has already been objected to once |
| `feature` | One leads, one follows. Only right if one of them actually is the main road |
| `diptych` | Two full-bleed halves, copy **on** the picture. **← chosen** |
⚠️ **CLOSED — he picked `diptych`.** The other five arrangements, all eight `?shape=` frames,
both switches and the four portrait crops that only `?shape=arch`/`tall` used are deleted.
05 is two full-bleed halves with the copy on the picture.

⚠️ **THE SCRIM IS BACK, AND THAT IS THE PRICE.** Bands existed to avoid it. 05 now carries the
presence 04 has instead of handing it back one screen later, and in exchange **every future
plate swap in 05 is a re-measurement** — it is no longer a `src` change. Same standing cost 04
carries.

⚠️ **A STYLE VARIANT DOES NOT SURVIVE THE LAYOUT CHANGING UNDER IT.** `?style=salon` set
`.boost-one h3 em` to burgundy — right while 05's copy was ink on cream, near-invisible the
moment it moved onto a dark scrim. Scoped to the headline; three more style rules that framed
the picture are gone with the frame. **Re-measured all five styles against the new layout:
102 runs, 0 skipped, all pass.**

⚠️ **Two harness lessons, both the same one in different clothes.** 05 is taller than the
viewport now, so one scroll per *section* cannot hold the headline and the copy at once — it is
one scroll per *target*, which only works because the copy is hidden with `color:transparent`
and layout does not move. And the rect must be read **after** the scroll settles, not in the
call that starts it: read too early it sampled the dark diptych behind a kicker that sits on
cream and reported **1.19:1** for something that measures 6.84. **A near-1.0 ratio is almost
never a real failure — it means the foreground and the background are the same pixels.**


⚠️ **`?shape=` and `?pair=` are orthogonal** — the frame the picture sits in, and where the two
things sit relative to each other. Either can be judged without the other moving.

⚠️ **diptych reintroduces a scrim, which bands existed to avoid.** Measured, both halves, both
viewports, 12 runs, 0 skipped — but it is a standing cost: every future plate swap in 05 becomes
a re-measurement, exactly as it is in 04.

⚠️ **AND IT FAILED ITS FIRST MEASUREMENT IN A WAY WORTH REMEMBERING.** The rose `h3 em` over the
gut plate landed at **exactly 4.50** at 390×844 against a 4.5 floor. It passed on desktop —
because there the em is 38px and therefore *large* text needing only 3. **The phone shrinks it
to 22px and moves the goalposts.** A scrim tuned on desktop will fail on a phone every time.
Deepened ramp; the same 12 runs now clear, tightest 4.99.

## The phone's scene chrome was invisible for most of the scene — found and fixed 2026-08-12

Four changes, all in `/hormone-balancing/`. The first two are one root cause.

**`updateSide()` dressed its chrome by `seamX`, and a phone has no seam.** The `mobile`
branch raises the ground **whole** and never reads `seamX` — but `seamX` is still computed,
so both indicators flipped against a ground that had not moved. Measured on 390×844, worst
ratio per beat, against the 4.5 an 9.5–11px run needs:

| Element | Window | Was | Now |
|---|---|---|---|
| `.scene-phase` | p .38–.58 | **1.05** — ink on a still-dark stage | 4.11 at the crossover, ≥5.5 either side |
| `.scene-ctrl` | p .57 → end | **1.10** — fixed ivory on risen blush | **6.06** worst, 13.19 at the end |

⚠️ **Each half was correct for the case it was reasoned about.** The stylesheet says the
controls "sit bottom-LEFT, on the half that is dark for the whole scene" — true of the
desktop diptych, false below 760px where there is no diptych. This is trap 7 in the list
above arriving from the other direction: `--scene-fg` keyed to the *seam* is wrong when the
ground has no seam.

⚠️ **The controls do not take the colour lerp, and that is deliberate.** Halfway through the
dawn the ground is a mid grey (rgb 152,137,136 at p .60) and **no unbacked small text clears
4.5 on it** — ivory and ink are equidistant, so a lerp tops out at ~3.9 and is worst at its
own midpoint because the type itself goes mid grey. Measured that way: 3.59. So the controls
**snap** (`--ctrl-fg`, never a mid value) and the pill carries a dark tint under them until
the snap. The phase indicator keeps the lerp and the sliver — it is `aria-hidden` chrome at
11px and it has no ground of its own to stand on.
⚠️ The `760px` in the stylesheet must track the scene script's own `mobile` query. They are
two places now; if one moves the other must.

**The phase indicator leaves as `BHRT` arrives** (`.7 * (1 - ss(.80,.88,p))`). Both a
collision fix and an editorial one. Measured gap between the 104px title and the 11px
indicator, both pinned top-right, at p .90: 164px at 1920, 44px at 1440, **17px at 1280** —
a common laptop, where the payoff word and the decoration read as one cluster. They also say
the same thing at that moment: *04 — Support* is the small print of *BHRT*.

**`.boost-one h3 em` gained `margin-left:.3em`.** 05's titles are two halves and the `em`
carries the join, so the markup has no whitespace between them: it rendered
*"Hormone Therapy+ Gut Health"*, both rows, since the section was built.
⚠️ A margin, not a literal space — a trailing space collapses if the line ever wraps between
the halves, and the phone is the viewport where it would.

**Still open after this pass, and not touched** (all judgement calls, not defects):
- **The doors' titles are below the fold**, so 04 answers *"Where would you like to begin?"*
  with three wordless photographs until you scroll. That is the stated trade of the flat
  `92vh` — his call, recorded above — but it is the page's biggest comprehension cost and
  the one thing a first-time reader cannot resolve on their own.
- **05's two plates.** Both dark, and the file already says so; the gut render is clinical
  where the rest of the page is editorial, and the energy frame reads as stock tech.
- **The placeholder testimonials.** Still the biggest liability, per the note above, and the
  disclaimer that carries them is 13px italic in the bottom-left corner of the section.

## Five page-wide style directions — `?style=`, offered 2026-08-12, undecided

Not section layout: the same structure wearing five faces, mostly token overrides plus a
handful of selectors, so picking one is a subtraction and rejecting all five costs nothing.

| Style | What it does |
|---|---|
| `editorial` | Headlines much larger and tighter, the kicker's gold rule gone, sections separated by a hairline instead of a change of ground, square button |
| `gallery` | Type smaller, air doubled, images in a hairline frame, and **one ground throughout** — `--cream` becomes `--ivory`, retiring the alternation that measures 1.088:1 |
| `salon` | Grounds move toward the plates' own warmth, hairlines and kicker rules go gold, headline accent drops from the one red to burgundy |
| `clinical` | Playfair steps back and the functional face carries the headlines, nothing rounded, grid tightens. Authority rather than spa |
| `soft` | Lighter headline weight, leading opened out, everything rounded, the quote larger |

⚠️ **Two knowingly breach BRAND.md and say so at the point of change**: `gallery` replaces the
one button material; `salon` moves the grounds off their named tokens.

**Measured, not eyeballed: 102 runs across five styles × three sections, 0 skipped, all pass.**
Two things fell out of that sweep:

⚠️ **A palette variant silently revalues every colour standing on the ground it moved.**
`salon`'s kicker was `--gold-deep`, which is fine on ivory and lands at **3.97:1** on salon's
own warmer cream. It is `#7A5C2A` now — 4.90 on the cream, 5.47 on the ivory. Any sixth style
that touches a ground has the same problem waiting.

⚠️ **PRE-EXISTING BUG, FOUND BY THE SWEEP AND FIXED: 07's kicker was 15.5px.** `.faq-side p`
(0,1,1) outranks `.kicker` (0,1,0), and the kicker is a `<p>` inside `.faq-side` — so section
07's kicker has been rendering half again larger than every other kicker on the page since the
section was built. `:not(.kicker)` on that rule. **Nobody saw it in six rounds of looking at
screenshots; a harness reporting "16px kicker" caught it.**

⚠️ Also worth knowing for the next harness: `.faq-side p` matches the kicker, so a naive
selector measures the kicker twice and reports the description as failing. Two of the four
"failures" in the first sweep were that, not the page.

## 04's shape is decided — "arch", his pick 2026-08-12

The founders' note was that the boxy shape was not working — **the three services, not 05**.
Six treatments went up behind `?dshape=`; arch won and the other five and the switch are gone.

⚠️ **THE NOTE AND FULL BLEED WERE IN DIRECT CONFLICT, and that was the real decision.** Full
bleed means the rectangle *is* the viewport: the panel has no edges of its own, so there is
nothing to shape. The four treatments that read as properly un-boxy — arcade, portal, inset,
stagger — all got there by giving the panels ground to stand on, which means giving up the
edge-to-edge wall he had asked for two rounds earlier. **Arch is the only one that satisfies
both standing requests.** Only the top edge changes; the panels still touch and still reach
both edges, and the section ground shows through the spandrels between the heads.

`border-radius:50% 50% 0 0 / 20% 20% 0 0`. ⚠️ **Not a true semicircle** — on a 92vh panel a
half-round head is a dome, because the radius would be half the *width*. ⚠️ **`overflow:hidden`
is load-bearing**: the img is absolutely positioned to `inset:0` and scaled 1.02, so without it
it paints straight over the corner the radius just cut.

Contrast re-measured after the shape change: **18/18, tightest the BHRT hook at 5.01.**

⚠️ **05's `?shape=` is still live and still undecided** — "not this one yet". Six frames for the
booster pictures, on their own parameter so neither question moves the other.

## The Energy plate was replaced 2026-08-12

`images/energy.png` (his upload, `cd1a281`) → `images/boost/energy-lab-1340.{avif,webp}`. A
clinician with a tablet over a DNA helix, already in the brand's rose. 1920×1080, which is the
band aspect exactly, so it dropped in without a crop.

⚠️ **New filenames, not an overwrite** — BRAND.md's rule, so no cache can serve the pendulum.
The retired `energy-band-1340.*` and `energy-tall-941.*` are deleted, and 05's undecided arch
and tall shapes were repointed at a portrait crop of the new frame (`energy-lab-tall-781.*`,
anchored on the clinician rather than the centre) so nothing references a plate that is gone.

⚠️ **05's two plates are now both dark.** The pendulum was pale cream against the near-black
food plate, and that spread was the argument for bands over plates in the first place. The
argument still holds — the copy sits beside the picture, so there is still no scrim to tune —
but the pair no longer reads light-against-dark. If that contrast mattered, it is the thing
that was lost.

## 05 is decided — "bands", his pick 2026-08-12

Six treatments were built behind `?boost=` and judged on the real page. **He picked bands. The
other five and the switch that served them are deleted** — they all ran off one DOM precisely
so that choosing one would be a subtraction rather than a rewrite. Gone with them:
`.boost-star`, `.boost-lede`, `.boost-base`, the `image-set()` background block, the
`?boost=` parameter, and `images/boost/*-plate-941.*`.

**Photography for both programmes** (his upload, commit `d0ac46a`): a gold pendulum mid-swing
for Energy, a pomegranate-and-fennel plate on red marble for Gut Health. AI-generated, same
terms as the door plates — covered by [`LICENSES/AI-DoorPlates.txt`](LICENSES/AI-DoorPlates.txt).
Neither contains a person. Served from `images/boost/{gut,energy}-band-1340.{avif,webp}` as
proper `<picture>`, lazy, with `width`/`height` so the row reserves its height before the image
lands. Note the spread: the pendulum is **8.7KB** as AVIF because it is mostly a smooth
gradient, the marble **86KB**, from identical source dimensions.

⚠️ **THE COPY SITS BESIDE THE PICTURE, NEVER ON IT, AND THAT IS THE WHOLE REASON THIS WON.** The
two plates are at opposite ends of the tonal range — the pendulum pale cream, the food nearly
black. One scrim cannot serve both: tuned to hold ivory over the marble it bands visibly across
the pendulum's smooth gradient and takes the light out of the one photograph whose entire
quality is its light. **`?boost=plates` measured fine** — 12.56 to 17.80, both viewports — so
the case against it was design, not legibility, and it is recorded that way rather than the
easier way.

⚠️ **CONSEQUENCE WORTH KEEPING: THERE IS NO SCRIM IN 05 TO RE-MEASURE.** Swapping either
photograph is a `src` change and nothing else — unlike 04, where the rose hook has half a point
of margin and a new plate is a new measurement.

⚠️ **The rows mirror**, and both halves of the mirror move together — `grid-template-areas` and
the column ratio both swap, or the picture changes width between rows.

⚠️ **05 breaks at 700px, not the 980 the rest of the page uses, and that is a measurement.**
Stacked, each picture becomes the full column width and a 16:9 frame gains height as fast as it
gains width. At 980 that came to 1012px of photograph alone and the section hit **1899px —
taller than the same section on a phone**. Holding two columns to 700 brings it to 1117, and a
`max-width:520px` cap on the stacked picture stops the same inversion reappearing just below the
breakpoint (700px went 1560 → 1429; the phone at 390 never reaches the cap and is unchanged).

Section heights now: 1343 at 1440, 1254 at 1280, 1117 at 980, 972 at 760, 1429 stacked, 1256 on
a phone. It was 780 flat.

Also fixed along the way: `.boost-sub` broke before its last word and left "it." alone on line
two. `text-wrap:balance` rather than a wider `max-width`, which would only move the problem to
the next breakpoint.

⚠️ **Two measurement artefacts nearly went into this file as real failures**, and are worth
knowing for the next scrim: hiding `h2` does **not** hide `h2 em`, so an unhidden rose `em`
inside an ivory heading measures rose-against-rose and reads 1.00; and a pill button's bounding
rect includes corners outside its border-radius, so the worst 2% samples ground the text never
touches. **Hide the children too, and sample pill-shaped controls inset.**
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
