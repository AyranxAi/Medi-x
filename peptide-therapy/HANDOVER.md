# Peptide Therapy — `/peptide-therapy/` (first ship 2026-08-14)

> ## ROUND 12 — 2026-08-16: chapters 05 and 06 get a lab — fifteen treatments, one copy of
> the client's words, and a harness that checks the lab's own claims
>
> **NOTHING ON THE PAGE MOVED THIS ROUND.** `index.html` is byte-identical. Two new files:
> `peptide-therapy/programme-lab.html` and `tools/qa/programme-lab.mjs`. Round 11 shipped
> the programme copy in exactly one shape each — the seven steps as a hairline ledger, the
> included/excluded as two columns, the two audiences as two opening rows — and each of
> those was chosen against the page's box budget on the day, **not against an alternative**.
> This lab is the alternatives, so the shape can be picked on its merits.
>
> **1 · FIFTEEN TREATMENTS IN THREE CHAPTERS, SISTER TO THE OTHER THREE LABS.**
> A · the seven steps (8) — the shipped Ledger, the Spine, the Eight Weeks, the Rail, the
> Doors, the Stage, the Plates, the Chart. B · the ledger (4) — Two Columns as shipped, the
> Balance, the Verbs, the Tabs. C · the two audiences (3) — Two Rows as shipped, the
> Diptych, the Switch. Ground and width switch live; every bay carries a spec chip.
> ⚠️ **PICK ONE FROM EACH CHAPTER — THEY ARE INDEPENDENT.** Two combinations are worth
> avoiding and both are repetition rather than taste: A4+C2 puts a horizontal card track
> directly above two photographic doors, and A5+B4+C1 makes every single thing in the
> section something you have to open before you can read it.
>
> **2 · THE COPY LIVES ONCE, AND THAT IS THE WHOLE METHOD.** All fifteen render from one
> `DATA` block, so no treatment can win an audition by quietly tightening a sentence. Round
> 11's corrections come through with it; the lab introduces none of its own. **Two fields
> in that block are NOT the client's and are marked as such**: `short` (a précis, written
> for A3's band, A4's cards and A6's index — new text, needing sign-off like any other) and
> `span` (used only where the source states a duration).
> ⚠️ **DO NOT PORT THE RENDERER.** It exists so fifteen treatments could share one copy of
> his text. Whichever is adopted gets hand-written into `index.html` as static markup, the
> way A1 already is. The lab has no no-JS fallback and the page must keep having one.
>
> **3 · THE HEIGHTS IN THE CHIPS ARE MEASURED LIVE, because for half of these the whole
> argument is what the chapter costs in scroll.** At 1440, against the shipped baselines:
> `A4 −79% · A6 −78% · A3 −66% · A5 −61% · A8 −6% · A2 −2% · A1 baseline · A7 ×1.14` ·
> `B4 −4% · B1 baseline · B3 ×1.57 · B2 ×1.61` · `C1 baseline · C2 ×2.22 · C3 ×4.07`.
> **C3 is the number that answers a real question**: putting the full symptom lists in the
> page instead of behind a dialog costs four times the shipped row, and that is the fact to
> argue from rather than taste.
>
> **4 · TWO OF THE FIFTEEN CANNOT SHIP ON THIS LAB'S SAY-SO.**
> ⚠️ **A3 · THE EIGHT WEEKS NEEDS HIS DATES.** The client's source contains three durations
> and no dates — two months of protocol, four weeks of mentorship, a further four weeks of
> follow-up. Those three are drawn and **nothing else is**: steps 1–4 sit in a band headed
> "before day one", and step 6 is a marker that hugs its own text rather than a band. It
> first shipped in this lab as a full-width band with an "undated" caption underneath, and
> a full-width band on an eight-week ruler says EIGHT WEEKS louder than any caption says
> otherwise. Inventing "week 1, week 2" publishes a schedule the clinic never agreed to and
> a patient will hold them to it.
> ⚠️ **C2 · THE DIPTYCH NEEDS ITS SCRIM MEASURED.** It borrows `images/doors/menopause-941`
> and `trt-941`, which already ship — no new photography, no new encode, no new licence —
> but **the alphas in the file are the doors' geometry as a starting point and are not a
> measurement**. BRAND.md's method against these two plates at these two crops before it
> goes near the page.
>
> **5 · THE HARNESS CHECKS THE LAB'S CLAIMS, NOT ITS STYLING** — `tools/qa/programme-lab.mjs`,
> 24 checks, exits non-zero. The copy is one copy; the printed ratios agree with the pixels;
> no hex or `rgb()` is outside the peptide tokens; A6's fallback is real at 390.
> ⚠️ **THREE BUGS IT FOUND, AND THEY ARE THE USEFUL PART OF THIS ENTRY.**
> (a) `const BASE` sat below the mount loop while three treatments call `measure()` during
> their first render — the temporal dead zone threw on the FIRST such render, the mount loop
> died, and **every bay after A6 rendered as an empty box** behind one console error that
> looked like a CSS problem.
> (b) A8's Hormones panel silently lost the divider between SHBG and Free Testosterone: a
> last-row exemption written for two columns misfires on three cells in one. **Rule rows
> with `border-top` and exempt the first row** — counting from the top is the same
> arithmetic in every column count.
> (c) A3's ruler dropped to four ticks on a phone while its bars kept running the full
> width — a two-month protocol drawn against a four-week ruler — and a fixed `height`
> clipped the step-6 marker's second line, which is the one sentence in that graphic that
> may not go missing.
> ⚠️ **(b) AND (c) WERE FOUND BY A SCREENSHOT, NOT BY THE HARNESS.** Nothing threw and no
> measurement moved. Both have regression checks now. Run `--shots` and **look at the phone
> set** — the desktop form is the one everybody imagines while designing.
> ⚠️ **CHECK 1 CAUGHT ITSELF ON ITS FIRST RUN**: the comment describing the
> comment-closing bug contained the sequence that causes it, and the harness would not
> parse. It says so now instead of demonstrating it.
> ⚠️ **CSS `ch` IS NOT A CHARACTER IN THIS FACE — the ratio is ~1.4.** `ch` is the advance
> of the digit zero and MediGyn NOW's zero is narrow against its own average letter, so
> B2's `max-width:78ch` was setting 109 actual characters. Any `ch` cap on this site wants
> dividing by 1.4 to read as characters; the harness measures each element's own text
> through canvas `measureText` rather than assuming 0.5em.
>
> **6 · ONE THING THE SOURCE IS MISSING AND ONLY HE CAN SUPPLY.** His exclusions list ends
> with a bare `*` — an empty third bullet. `index.html` drops it and the lab drops it the
> same way. If a third exclusion was meant, it never arrived.
> ⚠️ Round 11's flag still stands and this lab does not resolve it: **"a more effective
> alternative to traditional medicine" is a comparative-efficacy claim about a regulated
> therapy** and needs sign-off alongside the FAQ and the eight tiles. It is reproduced in
> the lab's B and A chapters exactly as it stands on the page.

> ## ROUND 11 — 2026-08-16: the client's notes land — the scene goes cool, the page grows
> two chapters, and the band grows two doctors
>
> **1 · "PARTNERSHIP" IS OFF THE PAGE, AND IT IS THREE P's NOW — his call, everywhere.**
> The hero kicker reads *Preventative · Precision · Personalised*, and the new chapter's
> headline is the same three. ⚠️ **THE CLIENT'S OWN SOURCE DOCUMENT FOR THAT CHAPTER IS
> HEADED "4 P's — … & Partnership"**, so the next person to read it will think the page is
> wrong. It is not: he struck the word. Both sites carry the note. `bonds-lab.html`'s
> thirteen kicker copies were swept too — ⚠️ **that file is BUILD OUTPUT from `.lab-dev/`
> (gitignored, not in this clone), so the next `node .lab-dev/build.mjs` on his machine
> puts Partnership back unless `template.html`'s kicker is fixed there as well.** Edited
> anyway, because a lab he may show the owner should not contradict the page.
>
> **2 · SECTION 02'S DEFINITION LOST A SENTENCE AND GAINED A MEASURE — one decision, not
> two.** His "this is too long for them… and make it wider so it's not that crammed". The
> therapy clause went ("Replenished under medical supervision as your own supply slows") —
> the only line in the caption that was not the definition, and said three more times
> elsewhere on the page. ⚠️ **THE CRAMPED LOOK WAS LINE COUNT, NOT WORD COUNT**: at 34ch the
> shortened string still stacked four narrow lines. Swept at seven widths — 44ch sets three
> lines everywhere with "rebalance." orphaned on the third; **48ch is the narrowest measure
> that reaches two**, and at 1440 its 890px box still sits inside the h2's 992px cap, which
> is why it can be that wide without reading as a different column.
>
> **3 · THE SCENE IS COOL, AND IT IS ARITHMETIC RATHER THAN TASTE.** The client: *"the
> burgundy is not approved — now that we have transitioned to blue we must find another
> colour with the same VALUE of this burgundy."* Value is the operative word. Every warm
> surface was converted to CIE LCh, **L\* and C\* were HELD**, and only the hue was rotated
> into the page's glacier family (h≈256°, where --dawn 252°, --gold 257°, --gold-deep 260°
> already live):
> `stage #2E2228→#1D272F` · `canvas BG_A #2A1B20→#14202A` · `glow #5C1F31→#003A5F` ·
> `beads STONE #B09A9C→#93A1AE` · `italics --rose #C79A92→#87A8C5`.
> **THE PROOF IS THE CONTRAST TABLE — every measured pair survived to within 0.05 of its
> warm original**, which is what "the same value" has to mean: ivory beat 15.31→15.38,
> gold beat 6.46→6.49, italic 6.63→6.64, bead 6.23→6.26.
> ⚠️ **`--rose`, `--burgundy` and `--ink` ARE UNTOUCHED AS TOKENS.** They are brand law and
> they still dress the rest of the page; they simply no longer appear in this scene. `--ink`
> especially — it is the page's TEXT ink and dresses `.scene-beat.light` and `.scene-title`,
> type standing on the RISEN ground exactly like every other heading. Cooling it would fork
> the page's body ink to fix a background problem.
> ⚠️ **THE FALLBACK `.turn` BAND WENT WITH IT**, and it had to: that band is what a
> reduced-motion or no-JS visitor sees INSTEAD of the scene, so leaving it burgundy meant
> the unapproved colour was exactly what the accessibility path still showed. Round 9 wrote
> *"if the band itself ever goes cool, that is a different decision"* — this is that
> decision. Its accent **#95ABBF is SOLVED, not picked**: the champagne carried exactly
> 5.00:1 on the burgundy, so the new accent is the glacier family's own chroma (C\*13,
> h256) at whatever L\* returns 5.00:1 on #003A5F — L\*68.9. The raw hue rotation of
> #C2A05E lands on #50ADE8, a sky blue this brand does not own.
> ⚠️ **THE PRELOADER IS NOW THE PAGE'S ONE FULL BURGUNDY FIELD AND IT IS LEFT STANDING —
> HIS CALL TO MAKE.** It is chrome shared with the hormone page, not section 3, so forking
> it is a decision and not a side effect of this one. It is the first thing a visitor sees.
>
> **4 · THE SCENE'S COPY: SEVEN BEATS AND 62 WORDS BECAME SIX AND 39.** The argument is
> untouched — recognition → the decline NAMED → the therapy → assembly → payoff. **The
> target was LINE COUNT**: `.scene-copy` is capped at min(92vw,780px) and a beat sets at up
> to 49px, so ~34 characters is one line, and the old beat 1 was 72. ⚠️ `SCHED` has SIX
> windows now and `draw()` indexes it by beat position — adding a `<p>` without adding a
> window throws. ⚠️ The gold beat still closes at .335 against assembly's A0 of .34, and
> that gap is load-bearing: a beat reading "fewer get written" must not be lit while the
> chain visibly starts writing.
>
> **5 · THE HELIX IS WIDE AGAIN — one expression.** His relay: *"the spinning peptide is
> beautiful, it's just that we make it thin… she likes it wide, so don't compress it
> horizontally."* `amp` was `mix(W*.17, min(W*.14,120), coil)` — the chain hung 490px wide
> while being written and squeezed to 240 as it wound up, so **the finished helix, the one
> frame the reader rests on, was the narrowest thing in the scene and narrower than the word
> standing in front of it.** Now constant: `min(W*(mobile?.30:.17), mobile?150:260)`.
> ⚠️ **THE TURN COUNT DID NOT MOVE.** 1.25→3.1 is untouched. Auditioned against 2.4 and 2.0
> at the new width and both lost — fewer turns at full width is a lazy squiggle, and at 2.0
> the payoff word has nothing to stand through. Width was the variable; the coil was not.
>
> **6 · TWO NEW CHAPTERS BEFORE THE DOCTORS, AND EVERY WORD IN THEM IS THE CLIENT'S.**
> 05 · The programme (dawn) — the three P's as the headline, their two explainer paragraphs,
> two audience rows, and their seven-step programme. 06 · What's included / What's excluded
> (ivory) — a ledger, not a chapter. ⚠️ **THE GROUND SEQUENCE HAD TO BE CHECKED, NOT
> ASSUMED**: the page ran ivory(04) → dawn(doctors) → ivory(06) → dawn(07) → ivory(08), so
> two inserted chapters means dawn then ivory or the whole tail inverts. Nothing below moved.
> ⚠️ **NO NEW MATERIAL WAS INVENTED**: the audience rows are `.px`'s card at row scale (the
> eight tiles already taught the reader that this material opens), the steps are the FAQ's
> hairline rhythm with the tile's Megante numeral, and both panels are the shell the tiles
> open. Adding a family to that shell is **three selectors on two lines** — container,
> button, template — and missing one fails silently, because the loop just returns early.
> ⚠️ **ONE CLINICAL CLAIM IS REPRODUCED AND FLAGGED RATHER THAN QUIETLY EDITED**: "a more
> effective alternative to traditional medicine" is their comparative-efficacy claim about a
> regulated therapy. It needs sign-off alongside the FAQ and the eight tiles.
> ⚠️ **EVERY CORRECTION TO THEIR COPY IS RECORDED AT THE SITE IT WAS MADE** — typos,
> broken grammar, and the removal of exact repeats within a single list (the women's list
> had "Trouble sleeping" twice; the men's had a second "Irritability", a bare "Fatigue"
> already inside item 1, and "Low sex drive" for the "Low libido" seven lines above). ⚠️ ONE
> CORRECTION IS AN INFERENCE AND IS FLAGGED AS SUCH: Dr. Nahla's "productive medicine" is
> read as "reproductive medicine". If she meant something else, it is one word.
>
> **7 · FOUR DOCTORS NOW — Dr. Nahla Ibrahim Elawady and Dr. Khalid Shukri joined.** The
> grid was always `repeat(2)` so it becomes 2×2 with no change, and the booking chooser
> gained the matching rows. ⚠️ **KEEP THE BAND AND THE CHOOSER IN THE SAME ORDER** — the QA
> harness now asserts it, because nothing else did. ⚠️ **DR. KHALID IS THE PEPTIDE DOCTOR ON
> THIS PAGE** ("Peptide Therapy & Peptide Bioregulators" is the second line of his own list)
> and he is appended LAST only because that is the order the names arrived in. If the page
> should lead with him, it is two `<article>`s and two chooser rows swapped — the client's
> call, not a tidy-up.
> ⚠️ **THE CHOOSER NEEDED ITS OWN PORTRAIT FALLBACK AND DID NOT HAVE ONE.** The card guard
> keys off `.doc.no-photo` and the bio panel inherits it because it is opened FROM a card —
> but the chooser is a standalone `<template>` with no card behind it, so a missing file
> rendered the browser's broken-image glyph inside the dialog. `guardFaces()` now runs after
> every clone (a page-load loop finds nothing to bind — the same trap the mock-booking guard
> fell into), and the face keeps its box so the monogram costs no layout.
>
> **8 · ✅ ALL FOUR PORTRAITS ARE IN — he uploaded the last two the same day.** They landed
> on main as `images/dr .webp` and `images/drr.webp` (a filename with a space in it) and
> were `git mv`'d into `images/doctors/` under the names the markup already expected —
> round 4's precedent: **the masters are renamed, never re-encoded.**
> ⚠️ **DR. KHALID'S UPLOAD WAS THE ONE THAT WAS NOT SQUARE**: 1113×1414 against everyone
> else's square. His original is kept beside the others as `dr-khalid-shukri-master.webp`,
> is the source both his crops were cut from, is referenced by no markup, and **must not be
> deleted**. His square is BAKED at sy=120 rather than left to `object-fit:cover` — three
> crops were auditioned and 120 won: sy=0 cuts his crossed arms off and reads as a tight
> headshot beside three full figures, sy=150 is the browser's own centre crop with the hair
> tight to the frame, and 120 keeps both the arms and the headroom. The exact re-bake
> commands for his square and for all four head crops are recorded in the DOM at the
> section. ⚠️ **THE MONOGRAM FALLBACK STAYS IN THE CODE.** It is the guard for a future
> rename, not scaffolding, and it earned its place this round — it was the shipped state
> for a day. It simply never fires now.
>
> **9 · THE PAGE HAS A WHOLE-PAGE HARNESS NOW — `tools/qa/peptide-page.mjs`, 45/45.**
> Eleven widths, the scene at four stops × two viewports, every dialog walked, the contrast
> arithmetic for the re-grade, and a check that reads the stylesheet as text. ⚠️ **THAT LAST
> ONE EXISTS BECAUSE OF A REAL BUG THIS ROUND**: writing "L\*/C\*" in a CSS comment closes
> the comment, the prose becomes declarations, the parser eats the next rule — `.scene-stage`
> lost `height:100svh`, the stage measured 0px, the canvas never drew, **and the console was
> clean**. `window.__scene.p` still reported the right progress. Only a screenshot showed it,
> and the first attempt at the warning comment quoted the offending pair and broke the rule
> a second time. Two more harness bugs are documented in `tools/qa/README.md` and worth
> reading before trusting a number: the scene's ground is NOT on the canvas (it is the
> stage's background-color; sampling canvas (0,0) reports pure black at every stop), and the
> helix width cannot be compared against the p=.66 frame (assembly is two thirds done there,
> so the measurement returns the unwritten beads' scatter — 762px against the chain's 496).

> ## ROUND 10b — 2026-08-15: the lab was six answers to a settled question, so it was rebuilt
> along the axis that actually varies — HOW A PLATE IS MADE
>
> **1 · WHAT WAS WRONG WITH 10a.** The first Bond Lab offered six successors to D that were
> all flat Canvas 2D line-and-bead at one scale. His note: *"im not talking only of 2d… im
> referring to a lot of diverse types… including 3js sizes and different ways… you can even
> make it 3d"*. He was right, and the diagnosis is worth keeping: round 7 auditioned MATERIALS
> and D settled that the hero is made of peptides, so six more variations on arrangement were
> six answers to a question already closed. The axis that still varies is **technique**,
> because technique is what changes what a plate can say.
>
> **2 · THE LAB IS NOW THIRTEEN GROUNDS IN THREE CHAPTERS**, D above them as the reference:
>   · **I · Drawn** — flat, line and bead, Canvas 2D. O Coil · P Affinity · Q Sequence ·
>     R Shoal · S Lattice · T Relay. No dependency, no WebGL, cheapest on a phone.
>   · **II · Built** — real geometry in a real camera, three.js. **U Helix** (instanced
>     residues on a tube backbone, studio-lit, cropped top and bottom so it reads as a
>     fragment), **V Ribbon** (the structural-biology cartoon as a twisting band of pressed
>     silk), **W Vitrine** (a chain in a refracting glass capsule on an ivory sweep),
>     **X Deep** (a volume with hundreds of chains, seen through a faked wide aperture).
>   · **III · Rendered** — solved pixel by pixel. **Y Bloom** (residues fused by a smooth
>     minimum into one alabaster surface, raymarched) and **Z Aperture** (one bond filling the
>     frame at macro range; only the bond is sharp).
> Scale is now a variable in its own right, from a single bond to a volume of hundreds.
>
> **3 · THE LAB IS GENERATED, NOT HAND-WRITTEN.** `peptide-therapy/bonds-lab.html` is BUILD
> OUTPUT — editing it is thrown away by the next build. Source is `.lab-dev/`:
> `template.html` (shell), `manifest.js` (contents), `kit.js` (the shared plate contract and
> the palette), `plates/plate-<letter>.js` (one engine each). `node .lab-dev/build.mjs` emits
> both copies of the two-copies rule. `.lab-dev/` is gitignored dev rig; the two built copies
> are the deliverable.
>
> **4 · three.js IS VENDORED AT `vendor/three.module.min.js`** (r166, MIT, provenance in
> `LICENSES/MIT-threejs.txt`) rather than loaded from a CDN. The repo copy imports it
> relatively; the artifact copy carries the SAME bundle converted to a classic inline global
> by `.lab-dev/pack/three-to-global.py`, because artifacts run under a CSP that blocks every
> external host and may refuse blob:/data: script urls too. ⚠️ **The shipped page still does
> not use three.js** — round 10 removed it with the silk. Promoting a chapter-II plate means
> pointing at `vendor/`, NOT restoring the CDN importmap.
>
> **5 · FOUR BUGS WORTH NOT REPEATING**, all found by measuring rather than looking:
>   · **`String.replace` ate the three.js bundle.** A STRING replacement treats `$&`, `` $` ``,
>     `$'` and `$$` as substitution patterns, and minified three is full of them — the inlined
>     copy was silently corrupted and the artifact died on `Unexpected token 'return'`. Every
>     replacement in `build.mjs` now goes through a function replacer.
>   · **A `type="module"` three boot loads too late.** Module scripts are deferred, so they run
>     AFTER the classic runner and every chapter-II plate initialised with `window.THREE`
>     undefined and fell back to a static wash. Both copies now publish `window.__THREE_READY`
>     from a CLASSIC script and the runner awaits it.
>   · **A WebGL canvas reads back BLACK.** Without `preserveDrawingBuffer` the drawing buffer is
>     gone once composited, so canvas-readback QA reported every 3D plate as not drawing. The
>     harness measures the SCREENSHOT now — which is also more honest, since it carries the
>     glacier tint and the legibility veil.
>   · **Smooth scrolling fooled the harness.** `scrollIntoView()` returns immediately, so
>     screenshots landed mid-flight and two plates were reported FLAT with 89% "motion" — the
>     frame was a blank gap between plates. QA forces `scroll-behavior:auto` and waits for the
>     plate to settle before believing any number.
>
> **6 · TWO LAYOUT DEFECTS THE GEOMETRY CHECK CAUGHT** that eyeballing 1440 never would: the
> fixed accent bar covered the spec chip on phones, and at 768 the bar WRAPS to two rows and
> clipped a chip that had been lifted for the one-row height. The chip now lifts 112px between
> 761 and 1180, and `tools/qa/bonds-lab.mjs` asserts the two boxes are disjoint at nine widths
> — only where the chip is pinned, since below 761 it joins the flow and scrolls clear.
>
> QA (`node tools/qa/bonds-lab.mjs`, and `--artifact` for the published copy): all thirteen
> plates draw and animate at 1440×900 and 390×844, three.js r166 present, nothing falls back,
> zero console and page errors, no horizontal scroll, the accent bar re-colours both a
> chapter-I and a chapter-II plate, and bar/chip disjoint at all nine pinned widths. Every
> plate reviewed by eye at both widths — U's crop, W's spin axis, X's copy-band fade and Z's
> residue weight all changed because of that pass, not because of a number.
>
> **D IS STILL THE LIVE HERO.** Nothing on `index.html` moved this round; the lab is the
> succession, and one of these thirteen is meant to replace it.

> ## ROUND 10 — 2026-08-15: the relay is corrected — the hero is plate D ("PEPTIDE
> BONDS"), not the bleached silk — SHIPPED TO MAIN AT HIS INSTRUCTION
>
> **1 · ROUND 9 SHIPPED THE WRONG PLATE, AND THIS IS THE CORRECTION.** Round 9 moved the
> hero to plate E on a relayed report ("they like a version of the peptides E in there").
> The relay was wrong: the owner's pick was **D · Peptide bonds** — his words this round,
> *"it was not e bleach that they liked it was d"*. E was the silk whitened, which is the
> smallest possible change; D is the plate that tells the page's own story — amino chains
> adrift, free molecules docking on in gold, the chain scene below the fold rehearsed in
> miniature. The lab's own note on D said exactly that, and it is why it is the right one.
> E lives on in `hero-lab.html` (plate E), Aero in plate K; `git revert` this round's hero
> commit to resurrect the silk.
>
> **2 · THE HERO IS CANVAS 2D NOW, AND THREE.JS IS GONE FROM THE PAGE.** D is a 2D engine,
> not a fragment shader, so the swap is an engine replacement rather than a shader paste.
> The hero shader was the page's ONLY `import("three")` — so the importmap went with it
> (a comment stands at the site saying how to bring it back). One fewer CDN dependency,
> ~600KB off the critical path, and a hero that survives a machine with no WebGL. GSAP and
> Lenis are untouched and still carry the chain scene. **The canvas id stays `#silk`** —
> the CSS and the catch-block fallback know it by name; it means "the hero ground", and it
> has been a lie since Aero.
>
> **3 · THE GLACIER ARRIVES AS ONE MULTIPLY, NOT AS RECOLOURED ARTWORK.** The lab
> composited every plate under a `#F3F7FB` `.tint` layer in `multiply`; the same
> arithmetic ships at the foot of `draw()` (round 7's decision, kept through 9 and 10), so
> what ships is what was judged rather than a hand-approximated re-tint.
>
> ⚠️ **D'S NODES ARE LITERALLY GOLD, AND `--gold` IS STEEL ON THIS PAGE.** The re-grade
> remapped the gold TOKEN to #7C93A8, so these chains are now the only true gold on the
> page. That is what plate D was when he picked it, so that is what shipped — but it is a
> live question, not a settled one, and it is the same question the grade lab's chapter C
> left open for the chain scene. `bonds-lab.html` carries a gold/steel bar that shows both
> across all six round-10 plates; the switch here is three `rgba()` literals in `draw()`.
>
> **4 · ART DIRECTION FOR PHONES, NOT RESIZING.** A chain is a fixed 26–36px rod, so the
> eleven of them cover roughly four times the share of a 390px screen that they cover at
> 1440 — shipped verbatim from the lab (which is a desktop judging tool) the field ran
> straight through the headline. The draw now takes a PREFIX of the same seeded arrays —
> 6 chains / 11 frees under 640px, 8 / 16 under 1024, the full 11 / 24 above — never a
> reseed, so the composition does not jump to a different set of chains when a resize
> crosses a breakpoint.
>
> **5 · THE HERO QA HARNESS IS IN THE REPO AND ITS PATHS ARE DERIVED.**
> `tools/qa/hero-ground.mjs` serves the repo, fulfils GSAP/Lenis from `node_modules`,
> and deliberately does NOT map three — anything still asking for it aborts and is
> reported. It reads the canvas back and measures luma SPREAD (a ground that failed to
> draw is flat, and a mean alone cannot tell you that), samples twice 900ms apart to prove
> motion, and asserts stillness under reduced-motion. ROOT is resolved from the script's
> own location and Chromium is searched for, not pinned — the sister harness hardcoded a
> home directory and a sandbox path and crashed before measuring anything on any other
> machine.
>
> QA: headless Chromium 1440×900 + 390×844 + reduced-motion. Zero console errors, zero
> page errors at all three. Canvas draws at both widths (luma spread 103–109 against a
> flat-ground floor of 12), animates at both, holds still at t=21.7s under reduced motion,
> and three.js is never requested. Screenshots reviewed by eye at both widths — the phone
> density fix above came out of that look, not out of the numbers.
>
> ⚠️ PUSHED TO MAIN AT HIS EXPLICIT INSTRUCTION (this round's request: "push the d on the
> main page for the mean time"). D is the INTERIM ground — round 10's six new plates in
> `bonds-lab.html` are its succession, and one of them is meant to replace it.

> ## ROUND 9 — 2026-08-15: the page goes glacier whole (A2 · B2 · C2), and the hero
> trades its orbs for the bleached silk — SHIPPED TO MAIN AT HIS INSTRUCTION
>
> **1 · THE RE-GRADE IS LIVE — his "push your recommendation to main", the letters
> A2 · B2 · C2 from the grade lab.** Six token VALUES moved by the round-7 judged mapping
> (ivory→#F4F7FA · cream→#EAF0F5 · line→#D5DEE6 · gold→#7C93A8 · gold-deep→#54687C ·
> gold-tint→#E4EDF4), --dawn→#E8EFF5 (B2), and the token names keep their BRAND.md roles —
> the hormone page keeps the warm originals untouched. The one red, the burgundy, the rose
> and both inks did not move. With them travelled, each with its comment at the site:
>   · **A2, the chrome fork**: the solid bar is rgba(244,247,250,.94), the footer follows
>     the tokens, and the plum hairlines/shadows moved hue wine→slate at the SAME alpha
>     geometry (rgba(71,24,38,α)→rgba(46,54,71,α); the input glass likewise). The header
>     and footer are now DELIBERATELY FORKED from the landing TRUE COPY — recorded at
>     .hdr--solid and at the footer comment, alongside the round-8 mark→home divergence.
>   · **B2 everywhere the dawn stands** (03, doctors, FAQ), and ⚠️ BG_B=[232,239,245] in
>     the scene script — the token and the constant moved together, cross-refs updated.
>   · **C2, the scene's voice**: GOLD→[124,147,168], GOLD_DEEP→[84,104,124], the
>     travelling light [236,214,178]→[214,232,246], the scene's IVORY→[244,247,250], and
>     ⚠️ `.scene-beat.gold` is PINNED #8FA5B8, NOT var(--gold) — measured: the champagne
>     carried 6.65:1 on the stage, the token's #7C93A8 only 5.17, #8FA5B8 restores the
>     weight at 6.46. STONE stays rose (brand law).
>   · **THREE WARM SURVIVORS, PINNED AS LITERALS, EACH ARGUED AT ITS SITE**: the
>     preloader's ✦ (the favicon's shared gold spark), and the turn band's three golds —
>     burgundy + rose cannot move, so 02 stays a COMPLETE warm composition rather than a
>     half-graded one. If the band itself ever goes cool, that is a new decision.
>   · --gold-gloss and --gold-deep now SHARE #54687C (the steel deep passes the gloss's
>     4.5 floor on every ground: 4.96 dawn / 5.01 cream / 5.35 ivory) — the token is kept
>     split anyway; the divergence was a decision and the next grade may need it.
>
> **2 · THE HERO IS PLATE E ("BLEACHED SILK") NOW, NOT AERO — the OWNER's call, relayed:
> the liquid-glass orbs did not land ("they dont like it… they like a version of the
> peptides E in there").** One fragmentShader paste, same canvas/uniforms as rounds 7 and
> 0: the sister silk's domain-warped fbm bleached toward white, motes adrift on top, the
> round-7 glacier multiply (#F3F7FB) KEPT at the foot of main() — E ships in the same
> grade layer the lab judged it under. Aero lives on in hero-lab.html (plate K) and the
> grade lab's reference plate; `git revert` the round-9 hero commit to resurrect it. The
> round-7 hero-scoped CSS block is COLLAPSED (its overrides became the global tokens);
> the ::after fade + radial wash merged into the base rule, transparent stops re-keyed to
> the glacier ivory.
>
> QA re-run whole: headless Chromium 1440×900 + 390×844, CDNs served from npm via
> interception (round 1's egress situation, unchanged — nothing about that shipped):
> zero console errors, zero page errors, scrollWidth exact at both widths, `?probe=1`
> clean, `?scene=` .28/.55/.76/.97 rendered and inspected — the chain writes steel on the
> ink stage, the payoff coils behind "Peptides" on the risen glacier dawn. Printed ratios
> are WCAG arithmetic on flat grounds (exact); the doctors' PHOTO-backed surfaces keep
> their glass materials unchanged from the shipped rounds.
>
> ⚠️ PUSHED TO MAIN AT HIS EXPLICIT INSTRUCTION (this round's request), branch merged
> fast-forward; the feature branch continues to carry development.

> ## ROUND 8 — 2026-08-15: the mark learns the way home, and the re-grade gets its lab
>
> **1 · BOTH MARKS NOW LINK HOME (`../`), NOT `#top` — his call** ("if someone will click
> Medigyn logo it should go to the original page right??? thats naturall???" — it is, and
> they didn't: header `.mark` and footer `.f-mark` scrolled the page they were already
> on). One attribute + aria label each, here AND on the hormone page, same commit. This is
> a deliberate divergence from the TRUE-COPY landing chrome, commented at all four sites;
> the landing page keeps `#top`, where home and top are the same place.
>
> **2 · THE ROUND-7 RE-GRADE QUESTIONS ARE NOW A LAB, NOT A MEMO:
> `peptide-therapy/grade-lab.html` — the hero lab's grammar, its two-copies rule, and
> ⚠️ THE SAME KEEP-BOTH WARNING.** The repo copy runs on relative fonts; the same lab is
> published as a private Claude artifact with the fonts embedded at
> https://claude.ai/code/artifact/1be3d4af-9d72-469d-9c0c-8d7ca00571da — do not delete,
> overwrite or re-purpose either copy. It holds the three decisions round 7 left him,
> each as a chapter with the live copy and the live type files:
>   · **A — the chrome** (keep the ivory TRUE-COPY bar/footer over the glacier body ·
>     fork them glacier · bright glass). The measured argument in the strips: the ivory
>     bar vs the glacier ground is 1.006:1 in lightness — the eye reads pure temperature.
>   · **B — the dawn** (rose #F6E7E1 as-stands · glacier dawn #E8EFF5 · his "BHRT white"
>     #FAF7F1 verbatim · the same instinct translated to a lifted cool white #FBFDFF).
>     Every specimen sits between glacier slices and carries a rise bar, because
>     ⚠️ BG_B RIDES THE PICK — the scene's payoff recolours with the token.
>   · **C — the scene's voice** (champagne as-stands · steel #7C93A8/#8FA5B8 · glass =
>     the ✦ BHRT ivory-with-halo treatment in this page's light), on a live sketch of
>     the chain scene — seeded scatter, write, coil, dawn — scrubbed by slider, the
>     risen ground following the B pick.
>   · **D — the composer**: the whole page in miniature, re-graded live from his three
>     letters. My verdict is recorded in the lab itself: **A2 · B2 · C2**, C3's halo as
>     the upgrade path if steel reads quiet.
> ⚠️ RATIOS PRINTED IN THE LAB ARE COMPUTED ON THE FLAT CANDIDATE GROUNDS (WCAG
> arithmetic — exact for flat colour). The live page's photo-backed alphas still need
> the render-and-sample method when the winning grade lands; nothing on index.html has
> been re-graded yet — that ships when his letters come back.

> ## ROUND 7 — 2026-08-15: the silk becomes glass, and the glass sets the temperature
> for the whole site
>
> **1 · THE HERO GROUND IS NOW "AERO" IN THE GLACIER GRADE — his pick, off a
> fourteen-plate audition.** The sister silk shader is replaced in place (same canvas
> `#silk`, same uniforms, same Three.js plumbing — one fragmentShader paste): liquid-glass
> orbs over a bright white dish, each orb truly lensing the ground behind it, frosted in
> the far layer, crisp and rising in the near one, colour-locked to silver/white/graphite.
> The glacier temperature is ONE multiply (`#F3F7FB`) at the foot of `main()` — exactly
> how the audition lab's grade layer produced the look he judged, so what shipped is what
> he saw. His decision trail, verbatim: clouds → "moving molecules, whitish" → "B and C
> but no yellow" → "luxurious, scientific, proper lighting, 3D" → "Vista / iOS-26
> transparency" → "the gold doesn't feel right" → **"glacier K"**.
>
> **2 · THE AUDITION LAB IS A KEPT ARTIFACT, NOT SCAFFOLDING.**
> `peptide-therapy/hero-lab.html` (in this repo, fonts relative) holds all fourteen
> plates × five grades, live and switchable; the same lab is published as a Claude
> artifact at https://claude.ai/code/artifact/d273a6b6-be2f-44aa-a273-65a62a36d550 —
> ⚠️ **HE MAY SHOW THIS TO THE OWNER. Do not delete, overwrite or re-purpose either
> copy**; republishing that exact artifact keeps its URL stable. It is private until he
> flips the share toggle on the artifact page itself.
>
> **3 · GLACIER IS HERO-SCOPED IN THIS SHIP; THE NEXT PASS IS THE REST OF THIS PAGE —
> "we want the same vibe on the rest of the website", his words, and (his 2026-08-15
> clarification) the scope of those words is THE PEPTIDE PAGE.** Each service page gets
> its own design: the hormone page's is ALREADY APPROVED and does not move, functional
> medicine will get its own when its turn comes. Glacier is this page's identity. So the
> work ahead is the rest of THIS file: 03's dawn ground, 04/07/08's ivory panels and
> hairlines, 06's stories, the service tiles and the dialog shell, the doctors band, the
> chain scene's ink stage and gold beats (a composition of its own — judge it, don't
> find-and-replace it), and the header pills as they cross the new hero. The mapping he
> judged, ivory system → glacier, for every surface this page owns:
> `--ivory #FAF7F1 → #F4F7FA` · `--cream #F4EDE1 → #EAF0F5` · `--line #DED4C2 → #D5DEE6`
> · `--gold #C2A05E → #7C93A8` · `--gold-deep #8A6A34 → #54687C` · `--gold-tint #F1E7D2
> → #E4EDF4` (derived, unjudged). **The one red, the burgundy, the rose and both inks do
> not move** — the one-red rule is brand law and survived all five grades. Two cautions:
> BRAND.md's alphas are MEASURED minimums (re-measure on the new grounds, don't
> transpose); and ⚠️ the header/footer in this file are documented TRUE COPIES of the
> landing page's (round 6) — re-grading them here forks that copy on purpose, so it is
> HIS CALL to fork or to leave them ivory as shared chrome. The favicon's gold spark is
> shared too; it stays.
>
> QA: headless Chromium at 1440×900 and 390×844, CDNs served from npm via interception
> (the egress situation the round-1 QA record documents — nothing about that shipped):
> zero console errors, WebGL context up, copy legible over the field at both widths, the
> shader's own left-fade + the lab's radial wash (now in `.hero::after`) doing the work.
> Reduced-motion renders the field static at t=0, same rule as the silk. Offline fallback
> gradient re-graded glacier to match.

> ## ROUND 6 — SAME DAY: the section portraits grow (+29%)
>
> His "make the images bigger". **Two caps governed the size and both had to move**:
> `.doc-grid`'s max-width sets the column and `.doc-photo`'s own cap sets the picture
> inside it — at 56rem the column was already 415px while the photo was capped at
> 21rem/336, so the photo was binding; raising only the photo makes the column
> binding instead. Now **62rem / 27rem → 432px** at 1104 and up, from 336. Measured
> at ten widths: 432 / 432 / 432 / 432 / 389 / 329 / 432 / 432 / 350 / 320
> (1920 → 360), no horizontal overflow introduced at any of them.
>
> ⚠️ **A PRE-EXISTING 360px OVERFLOW WAS FOUND WHILE MEASURING THIS, AND IT IS NOT
> OURS — IT IS THE FOOTER, ON ALL THREE PAGES.** `.f-news{width:22rem}` is 352px
> against ~320px of content at 360, and grid tracks take their item's `auto` minimum,
> so the document measures **374px wide at a 360px viewport** on the landing page,
> the hormone page and this one alike (390 and up are clean). Left alone
> deliberately: the footer is documented as a TRUE COPY of the landing page's, so
> the fix belongs to all three files at once, not to this page unilaterally. The
> one-line version when he wants it: `.f-news{width:min(22rem,100%)}` plus
> `min-width:0` on the grid items — applied to `index.html`,
> `hormone-balancing/index.html` and here in the same commit.

> ## ROUND 5 — SAME DAY: the portrait goes SQUARE, the name sits beside it, and the
> square is measured to the text
>
> Off a rendered four-way board (circle/square × whole/cropped, name below/beside).
> **What the board settled first:** the circle was never the real fault — these
> masters are full-body studio shots with the head in the top quarter, so at 88px
> the face rendered ~20px. Cropping fixed the face; shape was then a free choice.
>
> **1 · SQUARE, HIS CALL, and the reason is consistency**: the section card he just
> clicked is a square, and this page spends squares on content and circles on chrome
> (the (i), the ×, the FAQ marks). **The name sits beside the picture** — the round
> face on its own line left the whole right of the panel empty.
>
> **2 · THE SQUARE IS AS TALL AS THE TEXT BLOCK — "top of the text and bottom of
> text for symmetry", his words, and it is MEASURED because it cannot be CSS.**
> A square whose height matches a text block whose height depends on the width that
> square leaves it is circular. Tested, not assumed: `align-self:stretch` +
> `aspect-ratio:1` resolves to **1px × 125px** in Chromium — the browser breaks the
> cycle by abandoning the width. `sizeFaces()` measures and iterates to a fixed
> point. Four things had to be true before it landed flush, each found by measuring
> a twelve-width sweep (1920 → 360) rather than by eye:
>   · **iterate, don't set once** — writing the square re-wraps the text and changes
>     the height just measured (one pass shipped 10px short in the chooser, 31px in
>     the header);
>   · **clamp, or the loop runs away** — the feedback is positive (taller square →
>     wider square → narrower column → taller text);
>   · **the × gutter belongs to the kicker, not the header** — 52px charged to every
>     line wrapped the name at 1440 and fed the loop into its cap;
>   · **the header sets its own name size** (32px, not the panel's 36) — at 36 no
>     fixed point EXISTS at 1440, so symmetry was unreachable, not just missed.
> Measured flush (top 0 / bottom 0, square within 1.5px) at 1920, 1440, 1104, 900,
> 760, 620; stacked by design ≤560; ⚠️ **360 is the one width that cannot be
> satisfied** — the longer title wraps to four lines there and the cap holds the
> square ~10px proud top and bottom, centred. Recorded, not chased.
>
> **3 · THE POPUP HEADER USES A BAKED HEAD CROP; THE CHOOSER SHOWS THE WHOLE FIGURE
> UNCROPPED** — his split. `tools/crop-portrait.mjs` (new) bakes
> `…-head-400.webp` from each master with Chromium as the codec, no new dependency;
> the masters are untouched and still serve the 336px cards. A runtime CSS zoom was
> rejected: it needs per-photo tuning in the stylesheet and softens at 2x, and the
> next doctor should be a file drop.
>
> **4 · THE CHOOSER SIZES BOTH ROWS FROM THE TALLER TEXT.** Per-row sizing is the
> literal reading and it rendered the two doctors at two different sizes whenever
> one title was shorter (65 vs 56 at 900). Two people offered as a choice are
> presented at one scale.
>
> ⚠️ Still open, his call: the four alternative chooser treatments (bigger, full-row
> height, mild crop, small) were rendered for him and the shipped default is the
> matched-height uncropped square.

> ## ROUND 4 — SAME DAY: the portraits land · the eight book a CONSULTATION, through a doctor chooser
>
> **1 · THE PORTRAITS ARE IN.** He uploaded them to `images/` as
> `Dr-V-3-1024x1024.webp` and `Dr.-Eslam-Yakout-new.webp`; both were moved (git mv,
> content untouched) to the names round 3 wired:
> `images/doctors/dr-andrey-komissarov-square.webp` (1024²) and
> `images/doctors/dr-eslam-yakout-square.webp` (700²). Both are square, so
> `object-fit:cover` crops nothing. Verified loading in card, bio popup and chooser.
> ⚠️ The monogram fallback stays in the code — it is the guard for a future rename,
> not scaffolding. It simply never fires now.
>
> **2 · THE EIGHT NOW BOOK A CONSULTATION, VIA A DOCTOR CHOOSER — his call**
> ("for the 8 cards its not book discovery call its book a consultation and pop up
> to choose either of the 2 doctors"). Each service popup's pill reads **Book a
> consultation** and is a `<button data-choose>`, not a link: it swaps the panel's
> content for the chooser **in the same shell**, so the reader never loses the
> service — the chooser's kicker reads e.g. "MUSCULOSKELETAL INJURY · BOOK A
> CONSULTATION", and **← Back** restores the detail without re-running the dialog's
> entrance. Two rows, portrait + name + specialization + one Select pill, in the
> section's order (Komissarov, Yakout — matches his booking screen).
> ⚠️ **THE SELECT PILLS ARE MOCK** (`data-book`), like every booking control on both
> pages. His booking system already lists these two at AED 1150 / 1h, so wiring is
> one per-doctor deep link each — not a form.
> ⚠️ **THE MOCK-BOOKING GUARD IS DELEGATED ON THE SHELL, and it has to be**: the
> page-load loop over `[data-book]` cannot bind controls cloned out of a `<template>`
> later, so without delegation Select would follow `href="#"` and throw the reader to
> the top of the document with the dialog still open. Verified by script.
> ⚠️ **THE DOCTOR CARDS' OWN PILLS STILL POINT AT `#book`** — unchanged, because that
> is the page's existing convention for "Book a consultation" (the hero's does too).
> Flagged to him rather than changed: if a doctor's own pill should book THAT doctor
> directly, it is one attribute per card.
>
> QA re-run whole after both: clean at 1440×900 and 390×844; the flow is walked by
> script — tile → popup (CTA text asserted) → chooser (kicker, two rows, both faces
> loaded) → Select (asserted inert, dialog still open) → Back (returns to the right
> service) → Esc (closes).
> ⚠️ One harness bug fixed in passing, worth knowing: lazy portraits report
> `complete === true` a frame or two BEFORE they paint, so the doctors screenshot was
> photographing an empty band while the page was correct. The harness now settles
> 1.2s after scrolling the section into view. The page never had the defect.

> ## ROUND 3 — SAME DAY: the doctors arrive · the DNA variant is deleted
>
> **1 · 05 · THE DOCTORS (`#doctors`)** — his call: Dr. Andrey Komissarov and
> Dr. Eslam Yakout, each a centred card (portrait band → Megante name → specialization
> → red "Book a consultation" pill) with a glass (i) on the portrait corner that opens
> the SHARED dialog shell (#pxd) carrying the full bio, ×-closed, pill at the foot.
> Two red pills in one viewport is his call and deliberately overrides the sister
> page's one-pill rule — recorded at `.docs` so it is not "fixed" in passing.
> ⚠️ **THE BIOS ARE CLIENT COPY** (medi-gyn.com doctor pages), reproduced verbatim
> with three recorded typographic corrections — unlike the tiles' draft copy.
> ⚠️ **THE PORTRAIT FILES ARE NOT IN THE REPO.** He supplied them in conversation;
> this environment cannot reach medi-gyn.com to fetch them. Cards are wired to
> `images/doctors/dr-andrey-komissarov-square.webp` and
> `images/doctors/dr-eslam-yakout-square.webp`; until those exact files exist the
> script flips each card to a Megante monogram band (AK / EY) on the gold tint —
> deliberate, not a bug — and strips the portrait from the popup. Landing the two
> files is a plain file drop; no markup changes.
> ⚠️ The ground sequence is the sister page's again: dawn(03) → ivory(04) →
> dawn(05 doctors) → ivory(06) → dawn(07) → ivory(08) — the round-2 stories/FAQ
> swaps are reverted with the section that made them necessary.
>
> **2 · `?figure=dna` IS DELETED — his call** ("remove dna figure lets stick with
> your brilliant one"), decided on the rendered A/B. The single chain is the figure.
> The flag, the ghost strand and the rungs went whole; `git revert` this commit to
> resurrect them.
>
> QA re-run whole: clean at both widths; doctors verified — fallback engages on both
> cards, the (i) opens the shell, the missing face is stripped from the panel, × closes.

> ## ROUND 2 — SAME DAY ("Honestly this is beautiful"), two changes
>
> **1 · The eight services are TILES THAT OPEN A POPUP — his call** ("having the 8 as
> tiles and if they click it there will be like a pop up"). The ruled rows below are
> replaced: cards in the boost-card material (ivory fill, hairline, 2px radius, gold
> hover + lift), each carrying a circled + in the FAQ indicator's language. The whole
> tile is the hit area via a stretched `<button>` (`.px-open::after` — the sister
> doors' trick), so the h3 stays valid HTML and a keyboard still finds one real
> button per tile. The popup is ONE dialog shell (`#pxd`) fed from each tile's own
> `<template>` — tile and panel can never disagree. Esc/scrim close, Lenis stops
> while open (the menu's rule), focus returns to the opening tile, and the panel's
> red pill closes first, then scrolls to `#book`. Grid: 4 → 2 → 1 columns at
> 1104/640. ⚠️ **The popup paragraphs and goal chips are DRAFT COPY** — no peptide
> compounds are named on purpose; route through him before real marketing.
>
> **2 · `?figure=dna` — his "string or dna?" question, answered as a switch.** The
> shipped figure stays the single chain (the argument is in *The Chain* below: a
> peptide IS a chain, the coil IS its alpha helix, and DNA is a different molecule).
> But the brand's approved renders lean double-helix, so the DNA reading is one
> query away instead of one debate away: with the flag a second ghost strand rises
> WITH the coil (phase +π) and twenty rungs ladder the two. The assembly acts are
> identical under both — only the payoff figure changes. Compare at
> `/peptide-therapy/?figure=dna` (or `?scene=0.97&figure=dna` for the frozen frame),
> then delete the loser — it is one gated block in `draw()` plus one flag.
>
> The QA record below was re-run whole after both changes: still zero console
> errors, still no overflow at any stop, popup verified open/Esc-close with focus
> landing on the panel at 1440×900 and 390×844.

A self-contained service page (one `index.html`, ~565 KB, zero build step), built from
`/hormone-balancing/` as its base: same embedded fonts, same header/nav/footer ports, same
CDN dependencies (GSAP 3.13 + ScrollTrigger + SplitText, Lenis 1.3.4, Three.js 0.166 for
the hero silk). If the CDNs are unreachable the page degrades to fully readable static
sections, exactly like its sister. Where a mechanism, measurement or rule is inherited
from the sister page, the comment at the site says so instead of restating the argument —
`../hormone-balancing/HANDOVER.md` and `../HANDOFF.md` remain the source for those.

## His brief (2026-08-14, verbatim intent)
One page: **Hero → What are peptides → Peptides animation → the peptide services →
testimonials → FAQ → Irina → footer**, "based on the aesthetics that we have" with the
Hormone Therapy page as the reference. The eight services come from the live site's
Peptide Therapy menu (his screenshot): Auto Immune Disease · Brain Health · Gut Health ·
Weight Management · Skin & Hair Loss · Musculoskeletal Injury · Anti Ageing · Sexual
Health — **names reproduced exactly, including spellings.**

## Page anatomy
1. **Hero** — "Peptide / *therapy*" over the sister page's Three.js silk shader,
   unchanged. Kicker "Peptide Therapy · Recovery, resilience, repair" (the approved
   pathway vocabulary from the landing page). Primary pill → `#book`; ghost →
   `#chain` ("How peptides work").
2. **03 · What are peptides?** (`#peptides`, dawn ground) — the sister page's caption
   segment grammar: h2, gloss, one two-line definition. Define, then show — it stands
   ABOVE the scene for the reason "What is BHRT?" does.
3. **The Chain** (`#chain`) — the peptides animation. A pinned 420vh scroll scene
   (320vh phones), pure function of pin progress. See below.
4. **04 · Eight places to begin** (`#services`, ivory) — the eight sub-services as a
   ruled editorial grid: Megante number + name, one line of NOW, hairlines, two columns
   (one on phones). No photography exists for these eight, so no photography is faked.
5. **06 · What came back first.** (dawn) — the one-voice-at-a-time carousel, ported.
   ⚠️ **THE QUOTES ARE PLACEHOLDERS** — written for this mock-up, flagged in the DOM.
6. **07 · FAQ** (ivory) — six questions in the accordion. ⚠️ **DRAFT COPY, NOT HIS** —
   unlike the sister FAQ (his answers verbatim), these were written for the mock-up in
   his register. Regulated medical copy: route through him before real marketing.
7. **08 · Call strip** (`#book`, ivory, hairlined) — Irina's circle, one line, one pill
   ("Book a discovery call"), structurally identical to the sister strip.
8. **Header + footer** — verbatim ports, WhatsApp prefill retargeted to peptide therapy.

**Grounds:** dawn(03) → scene(ink → dawn) → ivory(04) → dawn(06) → ivory(07) →
ivory(08, hairlines load-bearing) → cream(footer). This page has no booster chapter, so
the warm note the sister page gives 05 moved to the stories — that is why 06 is dawn here
and 07 is ivory (both swaps carry comments at the rules).

## The Chain — the peptides animation
The story is **assembly**, in four acts, and the beat order is the argument
(recognition → the decline NAMED → the therapy → assembly → payoff):
- **Act 1 (0–.33)** — 26 amino-acid beads drift scattered, dim rose-stone on the ink
  stage. The raw material was never the problem. The gold beat names the decline:
  "With age, fewer messages get written."
- **Act 2 (.34–.68)** — "So we help your body write them again." The beads link ONE BY
  ONE, head to tail (the order a ribosome writes one), each flying to a loose golden
  wave. The written spine is stroked as the smooth sampled curve it lies on — NOT
  bead-to-bead chords, which render as a zig-zag (caught on the render and fixed); the
  one bead currently flying home gets a straight "reach" chord that the curve absorbs.
- **Act 3 (.60–.78)** — the finished chain winds into a helix (1.25 → 3.1 turns,
  amplitude narrowing): a peptide folding into an alpha helix — the brand's own render
  and the chemistry agree. z = cos(angle) lights and sizes near passes only once the
  coil arrives, so it reads as ONE strand in the round, not two strands faking DNA.
  From .70 a light pulse travels the chain — the instruction in transit.
- **Act 4 (.79–1)** — the dawn (.790–.835, fast crossing, radial source at the chain's
  heart — both sister findings, inherited), then "Peptides" in Megante lands dead
  centre while the helix dims to 38% behind it: the word through the figure, the way
  the ring stands through the helix in the approved renders.

Engine rules inherited whole, each commented at its site: the **latch** (progress
high-water-marks — "the message stays written"; seeking is the one thing allowed to
lower it, with the 1.4s timeout), controls that **move the page, never the progress
variable**, the glass-material pills whose colour **snaps** ivory→ink mid-dawn, beats
with fixed polarity and a copy-free window around the dawn, `?scene=<0..1>` solo QA and
`?probe=1` static QA, and the reduced-motion/no-JS fallback (01 · The idea + 02 · The
therapy, same vocabulary as the scene).

Departures from the sister scene, deliberate:
- **The scatter is seeded, not `Math.random()`** — the pure-function rule extended to
  geometry, so Replay rebuilds the exact chain the reader saw.
- **Hint → controls is SEQUENTIAL, not a cross-fade** — a frozen frame inside the
  sister's cross-fade shows two half-lit labels stacked (caught at `?scene=.06`).
  The hint is fully out (.072) before the pill fades in (.080).
- **No `?play=hybrid`,** no side layout, no phase indicator — none of their problems
  exist on a symmetric, shorter track.

## Wiring done with this ship
- Landing page menu "Peptide Therapy" → `peptide-therapy/` (relative, `target` off) and
  the pathway 03 CTA likewise — both were pointing at the WordPress site.
- Sister page menu "Peptide Therapy" → `../peptide-therapy/`.
- This page's own menu: self-link `./`; "Hormone Therapy" → `../hormone-balancing/`.

## What is deliberately unfinished / needs his sign-off
- **Every block of copy on this page is draft** — hero sub, definition, beats, the
  eight service descriptions, FAQ answers, `<title>` + meta description. Written in his
  register, but nothing here is his signed-off copy yet. The DOM comments mark the two
  clinical surfaces (FAQ, service lines) explicitly.
- **Testimonials are placeholders** (see the DOM warning above the rail).
- **The eight service rows route nowhere** — no red pill, no inert Explore ×8. When
  the service pages exist, each row takes one `.link-arrow` (lift it from the sister
  page; this stylesheet deliberately doesn't carry it unused).
- **Booking CTAs are mock** (`data-book` prevents default), same as the sister page.

## QA record (2026-08-14, headless Chromium 1440×900 + 390×844)
`?probe=1` both widths, `?scene=` at .06/.28/.42/.55/.68/.76/.82/.90/.97 desktop and
.28/.55/.76/.97 phone, plus the live page (preloader → hero, and pin engaged mid-track):
zero console errors, `scrollWidth` exactly 1440/390 at every stop, `window.__scene.p`
reports the drawn progress. The three CDN scripts are blocked by egress policy in the QA
environment; the same versions were installed from npm and served by request
interception — nothing about that shipped (the page still loads from jsDelivr).
