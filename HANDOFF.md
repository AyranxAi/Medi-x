# Handoff — 2026-08-11

Everything in this document is **on `main` and deployed**. It covers one working day on
`/hormone-balancing/` plus one line on the landing page. It is written for whoever picks this
up next, including future me.

For durable design law read [`BRAND.md`](BRAND.md); for the service page's own anatomy read
[`hormone-balancing/HANDOVER.md`](hormone-balancing/HANDOVER.md). **This file is the diff
between yesterday and today, plus the things that are still open.**

---

## What shipped, in order

| Commit | What |
|---|---|
| `b4b1c0e` | Pathway 01 points at our own page; the routing line names the free 10-minute discovery call |
| `60c8102` | The marquee band goes to tuned capitals |
| `32a8789` | Sections 03 / 04 / 05 rebuilt — the lower half stops explaining and starts pointing |
| `d33c899` | 03 becomes a centred segment rather than a chapter |
| `147ee6f` | The band comes off entirely; "Sleeplessness"; the three new hooks; the doors become a full-bleed rail |
| `b6616ff` | The scene names its own release, keeps a written receipt, and can be skipped or replayed |

---

## Where each piece stands

**Hero** — untouched. Still the Three.js silk shader.

**Marquee** — **removed.** It went to tuned capitals in the morning and was cut entirely in the
afternoon. One consequence worth knowing: section 03's shape was partly justified by rhyming
with that band, and the comment in the file now says that argument is void.

**01–02 · The Signals scene** — the figure, tethers and timings are as they were after the
2026-08-10 rounds. Three things changed:
- **Beat 5 names the release** — *"One by one, we take them off you."* It replaced the
  diagnostics line, which was a setup line sitting on a payoff moment.
- **`◂ ▸ · Replay · Skip`** bottom-centre, cross-fading with "Scroll to listen".
- **"3am again" → "Sleeplessness"**, in the scene, the fallback chips and both index-matched
  comments.

**03 · The answer** — the BHRT lockup *and* the ledger: the scene's eight pairs in the scene's
order, symptom → outcome. 1277px at 1440.

**04 · Consultations** — three photographic doors on a full-bleed horizontal rail at every
width. Hooks are the client's copy. Discovery call sits once, under the set.

**05 · Booster programs** — light-key, one offer with two halves joined by the brand ✦, one
door, because both programmes go to one page.

**06–08** — untouched. Stories are still placeholder testimonials, labelled as such.

---

## Numbers that are constraints, not descriptions

Break any of these and something that was measured stops being true.

- **"Sleeplessness" has ~8px of slack at 390×844** and is the widest label on the page. Measured
  111 / 118 / 132px at 360 / 390 / 430 against 127 / 126 / 146px of room. That room figure uses
  the silhouette half-width *at the arms* for every label, and this word sits at the head slot,
  so its true clearance is larger — "Mood swings" at the chest is still the binding case. **Any
  growth in the phone type ramp must be re-measured, not assumed.**
- **The consultation rail needs cards at ~34vw.** At 26vw the three cards plus padding came to
  1456px against a 1440 viewport: 17px of scroll, invisible. At 34vw the track is 1802px and the
  third card is cut by the screen edge, which is the entire affordance since the scrollbar is
  hidden.
- **Scrim alphas on the doors are a guess.** The placeholder is a mid-tone plum so the ramp is
  not passing a test a bright photograph would fail — but that is a guard, not a measurement.
  Run the repo's method against the real plates before paid traffic.
- **Section grounds run cream · ivory · cream · ivory · cream · burgundy.** 08 is the only dark
  moment on the way down, deliberately.

---

## Traps found the hard way today

Each of these cost real time. None of them announce themselves.

1. **Playfair loses its pinned optical size outside `h1`–`h3`.** The stylesheet pins
   `font-variation-settings:"opsz" 30` on headings only; everything else inherits
   `font-optical-sizing: auto`, which ties the axis to the rendered size. At 116px Playfair
   swings to its display cut, hairlines go razor-thin, and the H's crossbar vanishes — **"BHRT"
   rendered as "BIIRT"**. Letter-spacing was the wrong suspect and opening it up changed
   nothing. Re-pin both axes on any large Playfair that is not a heading.
2. **SVG is XML, so a bare `&` is a parse error — and it fails silently.** The first placeholder
   plate shipped with `HORMONE THERAPY & BHRT` in its label: `naturalWidth` 0, no console
   error, the panel just showed its scrim. All three are validated now.
3. **A high-water latch that only releases on arrival can hang forever.** The scene's seek
   override tracks progress exactly while a seek is in flight. Released only on arrival, a seek
   that never converged left the latch in tracking mode permanently, taking the
   "story only moves forward" rule with it. It now also releases after 1.4s.
4. **`SCHED[b][0]` is when a beat *starts fading*, not when it is readable.** Stepping to beat
   starts showed lines at zero opacity. Stops are midpoints.
5. **A pin with `pinSpacing:false` changes document height when it engages.** The first ▸ from
   the top of the track landed on beat 2 every time, because the target was computed before the
   pin engaged. `go()` carries one correction pass.
6. **`width:100vw` on a full-bleed section buys nothing here and costs a scrollbar.** Sections
   in this page are already full width — `.wrap` does the constraining — and `100vw` counts the
   scrollbar's width while the body does not.
7. **A `<span>` is inline, so `width`/`height` silently do nothing.** Cost a set of invisible
   gold rules in a mockup.
8. **Duplicate `id` beats `getElementById`.** A `<style id="seg">` in the head shadowed a
   `<section id="seg">` and produced a "zero-height section" that was nothing of the kind.

---

## The QA harness, which is now reproducible

The previous handover said the harness was "not in the repo", and that cost a day of rendering
static fallbacks instead of the real scene. **This is how to get the actual scroll story
rendering in a sandbox where the CDNs are blocked:**

```bash
npm install gsap@3.13.0 lenis@1.3.4 three@0.166.1
```

Then intercept the five jsDelivr requests in Playwright and fulfil them from `node_modules`
(`gsap/dist/gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js`, `lenis/dist/lenis.min.js`,
`three/build/three.module.js`; serve the last as `text/javascript`). Nothing about this ships —
the page still loads them from jsDelivr.

With that in place, `?scene=<0..1>` freezes the stage at any progress and `window.__scene.p`
reports where the story actually is, which is how the control wiring was verified:

```
0 → .110 → .245 → .370 → .460 → .540      one fully-lit beat at each stop
prev .540 → .464      replay → .004       scroll-up latch .175 → .175 (holds)
```

---

## Deliberately unfinished

**Four inert controls** (`data-soon`, no `href`): the three door *Explore* links and 05's
*Explore the programs*. The repo's standing rule is that a control with no destination stays
inert rather than pointing at a placeholder URL. **Wiring each is one attribute** — and on a
door, adding `href` also makes the whole panel clickable via `.door a[href]::after`, with no
markup change. Section 03 has no CTA at all, on purpose: this page *is* the BHRT intro.

**Three placeholder plates** in `images/placeholders/`. Swapping in photography is a `src`
change — the crop is `object-fit`, the scrim is a pseudo-element, the sizing is the panel's.
That folder is not part of the finished site.

**Two photographs do not exist in any form.** A testosterone / men's plate, and a solo portrait
of Irina. Both are shoots, not crops.

**Testimonials are placeholder voices**, labelled as such in the markup. Replace before any
paid traffic.

---

## Open, and worth deciding

- **The reversals are faint at the payoff.** Compare "Cool again" and "Steady moods" against
  "Deep sleep" and "Clear head" at scrub .90 — all fixed ink on the risen blush, but the ones
  over the brighter part of the bloom lose a lot. Same failure mode the scene controls had
  before they were moved onto `--scene-fg`. Untouched, and it happens at the exact moment the
  page is trying to land its promise.
- **03 is a chapter again.** The "must stay a segment" rule recorded on 2026-08-11 was reversed
  the same day when the ledger was merged in. If the beat is wanted back, the ledger lifts into
  its own section below without changing a rule.
- **The 600vh scroll length.** Deliberately not shortened yet: it is the change most likely to
  break beat timings tuned over four rounds, and the scroll may stop feeling long now that the
  reader is told what they are waiting for. Re-watch before touching it.
- **The scene figure is still provisional** — shipped on "okay *for now*". The
  statue / point-cloud question from the previous handover is still open.

---

## If you change the eight symptoms

Three lists are index-matched and must move together, or the page contradicts its own animation:

1. `.scene-label` spans (release order, and they descend head → pelvis)
2. `.scene-answer` spans (answer *i* lands in symptom *i*'s slot)
3. `.led-row`s in section 03

Plus the `.scene-fallback` chips, which carry the same eight in the same order for no-JS and
reduced-motion. And re-measure any new word against the phone clearance above.
