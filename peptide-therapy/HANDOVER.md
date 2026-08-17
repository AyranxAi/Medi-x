# Peptide Therapy — `/peptide-therapy/` (first ship 2026-08-14)

> # ▶ START HERE — STATE OF PLAY AT THE END OF ROUND 18
>
> **The page:** `/peptide-therapy/index.html` — single file, zero build, ~3,900 lines.
> Open it with any static server; there is nothing to compile.
> **QA:** `node tools/qa/peptide-page.mjs` (**51**) and `node tools/qa/services-choice.mjs`
> (**72**). Both must be green before anything ships. They need
> `npm install --no-save playwright gsap@3.13.0 lenis@1.3.4`.
> The round-18 files have their own, playwright only: `node tools/qa/section04-lab.mjs`
> (**49**) and `node tools/qa/section04-hybrid.mjs` (**58**).
> **Round 18 is on `main`** — his call, 2026-08-17. ⚠️ **The live section 04 is UNCHANGED by
> it**: `section04-hybrid.html` is a standalone proposal, not wired into the page. What round
> 18 changed on the live page is the DELETION of 06 and the inverted tail grounds.
>
> **THE FOUR THINGS A NEW CHAT SHOULD KNOW FIRST:**
> 1. **The page is PLUM (warm), not glacier.** Round 14 reversed round 9. ⚠️ **It contradicts
>    a recorded client note** — *"the burgundy is not approved… we have transitioned to
>    blue"* — on his later instruction. **This is the likeliest thing to be sent back**, and
>    the full mapping back to glacier is kept at `.scene-stage` in the stylesheet.
> 2. **Section 05 does not exist, and as of round 18 nor does 06.** Deleted three times
>    over: the client's chapter (round 14), the programme band that replaced it (round 15),
>    and the included/excluded ledger (round 18, his "remove this"). ⚠️ **Everything about
>    price and process lives in ONE place — the programme panel**
>    (`<template id="prog-panel">`). Do not put a second copy on the page; `peptide-page.mjs`
>    now asserts the absence of both deleted chapters, because both were client copy.
>    ⚠️ **THE PAGE IS FIVE CHAPTERS AFTER THE SCENE AND THE GROUNDS INVERTED IN ROUND 18** —
>    services dawn · docs ivory · stories dawn · faq ivory · final dawn. Read the ⚠️⚠️ note
>    at `.docs` before touching any ground.
> 3. **Section 04 is the whole commercial engine**: eight goal tiles on the rose dawn, a
>    tray that follows the reader, and the panel. ⚠️ Its ground being `--dawn` is
>    load-bearing twice over — the chain scene's seamless handoff (`BG_B === --dawn`) *and*
>    the tiles reading as objects. **Round 18 put nine ways of making it more beautiful in
>    `section04-lab.html` and it is waiting on a letter.**
> 4. **Prices are settled.** AED 1,150 **VAT-exclusive**, +5% = 1,207.50. Home collection
>    AED 1,950. ⚠️ **Never invent a figure** — see the AED 350 incident in round 12.
>
> **WHAT IS STILL OPEN (all his):**
> · **SECTION 04 — TWO QUESTIONS: THE CHOSEN COLOUR, AND IVORY OR THE ROSE DAWN.** Shape is
>   settled — **he picked wide**. The chosen colour is a three-way toggle under the ring
>   (gold / ivory / wine) with the measurements on the page; ⚠️ **gold's 1.03 on gut-health
>   is why the badge now has an edge**, and that fix stands whichever he picks. ⚠️ **AND THE RING IS NOT WIRED INTO THE LIVE PAGE** — it is
>   a proposal file. Adopting it is a separate round: the tray, the programme panel and the
>   popup all have to meet it.
> · *(superseded)* **ONE QUESTION LEFT: IVORY OR THE ROSE DAWN.** He sent a third reference
>   and `section04-hybrid.html` is now a RING of his eight photographs with a + that turns
>   a card over. The artwork question is closed — the eight landed 2026-08-17.
> · *(superseded, kept for the reasoning)* **TWO QUESTIONS, NOT A LETTER ANY MORE.** He merged two of his own boards
>   instead of picking, and `section04-hybrid.html` ("the focus rail") is that merge, built
>   and published as an artifact. ⚠️ **What is open is: PHOTOGRAPHY OR THE BUILT
>   SCULPTURES, and THREE.JS OR SPLINE.** Everything else on it is flagged on the page as
>   reversible in a line. `section04-lab.html`'s nine variants stand as the alternatives.
> · **PAYMENT** — the one thing asked for and not built. `Start your programme` lands on
>   `#book`; the moment a provider exists that `href` is the only line that changes.
> · **Wiring `#pxd-choose` to step 03.** The doctor-chooser template is complete and
>   unrouted; "Choose your doctor" is now a named step. **This is the natural next round.**
> · The **burgundy/blue conflict** in point 1.
> · **Peptide delivery time** — step 05 says "8 weeks' supply", deliberately not a shipping
>   estimate, because none has been given.
> · Tile popup copy and the FAQ are **draft**, not client-approved.
>
> **THE LABS** (kept, each the record of a decision): `grade-lab` (glacier, judged A2·B2·C2)
> · `goals-lab` (eight presentations) · `programme-lab` (intake in three shapes) ·
> `bonds-lab` · `hero-lab` · `programme-band-lab` (round 15, answered "none") ·
> `selected-tile-lab` (round 17, answered **D**) · **`section04-lab` (round 18, OPEN)** ·
> **`section04-hybrid` (round 18 — his own two boards merged, OPEN)**. ⚠️ The hybrid is not
> a lab: it is one proposal at full scale, and `tools/pack-artifact.mjs` builds its
> artifact copy. That copy is derived and deliberately not committed.
> ⚠️ **The first five are on the GLACIER grade and are deliberately not updated** — they
> record decisions taken under the grade they were taken under.
>
> **HOW THIS PROJECT WORKS:** he replies in **letters** off a lab. Build the lab, letter the
> variants, tag the shipped one, and ship what he names. Every ⚠️ in the source is there
> because something already went wrong once — **read them before editing near them.**
>
> ---

> ## ROUND 18 — 2026-08-17: the ledger goes, the tail inverts, and section 04 gets a lab
>
> **1 · 06 · WHAT'S INCLUDED / WHAT'S EXCLUDED IS DELETED WHOLE — his "remove this".**
> Markup, twelve CSS rules and the `#included` id nothing linked to. It stood from round 14
> and was the **third** place on the page describing what the programme is; section 05 went
> in round 14 for the same reason, and the programme panel is the one that stays.
> ⚠️ **NOTHING FACTUAL WAS LOST AND THAT WAS CHECKED, NOT ASSUMED.** The excluded column's
> two facts are both live in the panel — diagnostics-and-home-collection is **step 02 plus
> the AED 1,950 add-on**, and *"prescriptions are personalised, priced before you pay"* is
> the "Priced after your consultation" block in the client's own words. If either ever
> leaves the panel, **that** is when this content has actually gone.
> ⚠️ **peptide-page.mjs NOW ASSERTS THE ABSENCE**, three ways: no `.incl` markup, no
> `#included`, and no `BOZAT`/`DUTCH Plus` in the body text. Same reason section 05 has an
> inverted check — **~150 words of CLIENT copy is one paste away from the page**, and a
> paste can arrive stripped of its classes. `git show 9bd43af:peptide-therapy/index.html`
> has the section whole.
>
> **2 · ⚠️⚠️ THE BILL ROUND 16 DEFERRED CAME DUE: THE TAIL INVERTED.** 06 was the **ivory
> beat** between `.services` (dawn) and `.docs` (dawn). Deleting it put two dawns face to
> face — the exact bug round 16's ground check was written for — and **that check went red
> on the first run after the deletion.** The four chapters below `.services` are now
> **`.docs` ivory · `.stories` dawn · `.faq` ivory · `.final` dawn**.
> ⚠️ **MOVING `.services` INSTEAD WAS RECONSIDERED AND REFUSED A SECOND TIME.** It is one
> declaration against four, and it is wrong both times: the dawn is load-bearing there
> **twice** — the chain scene rises to exactly `--dawn` (`BG_B`) so the scene hands off with
> no seam, and `.px` is `--ivory`, so an ivory section stops the eight reading as objects.
> ⚠️ **THE ALTERNATION CASCADES — THERE IS NO PARTIAL VERSION.** Flip `.docs` alone and it
> collides with `.stories`; flip both and `.stories` collides with `.faq`. Removing one beat
> from a two-colour run inverts everything after it or nothing.
> ⚠️ **TWO COSTS, STATED AT THE SITES THEY LAND:** `.faq` no longer matches the sister
> page's dawn (round 3 chose the dawn to *be* that match), and `.final` meets the cream
> footer at **6/255** where it used to be 16 — both edges were always invisible as fields,
> so the two `border-top`s are still the only things saying "new thing" and neither may go.
>
> **3 · SECTION 04 HAS A LAB — `peptide-therapy/section04-lab.html`, nine letters.** His
> brief: *"more beautiful… threejs for the cards, spline, new colour, animation, making them
> bigger, something interesting for the human to click it and be curious."*
> ⚠️ **THE AXIS IS COST TO ADOPT, NOT ARRANGEMENT** — round 10b's lesson applied, because
> eight arrangements of one tile would be eight answers to a question the tile already
> settled. Three chapters: **I · THE CUT** (A three up · B the dark room · C the gallery —
> geometry and ground, ships as-is) · **II · THE SURFACE** (D the mark draws itself · E the
> lens · F the turn — motion, zero dependency) · **III · THE DEPTH** (G the vial · H the
> frosted field — vendored three.js) · **I · on Spline**, written rather than mocked up.
> ⚠️ **B RE-OPENS ROUND 17'S LETTER D AND THE LAB SAYS SO IN BOLD.** `--burgundy` against an
> ink ground is **46/255** — a chosen tile would be a shadow — so on B the lit tile has to
> become gold with ink type, which is letter A from that lab. **Picking B un-picks D.**
> ⚠️ **G KEEPS THE EIGHT MARKS AND THAT IS THE WHOLE ARGUMENT FOR BUILDING IT THAT WAY.**
> The first instinct is eight rotating peptide chains; eight rotating peptide chains say
> "peptide" eight times and say nothing about auto-immunity or sleep. So each vial holds
> **that tile's own SVG**, serialised to a canvas texture through a `data:` URL, drawn in
> `--gold-deep` — the flat mark's own colour, so the no-WebGL fallback is invisible.
> ⚠️ **H BREAKS A MEASURED INVARIANT AND THE CARD SAYS SO.** A translucent tile has no fixed
> colour, so peptide-page.mjs's 8/255 tile-vs-ground assertion stops meaning anything.
> Adopting H means **replacing that check with a rendered-pixel sample, not deleting it**.
> ⚠️ **SPLINE IS ANSWERED, NOT MOCKED.** It is a CDN runtime plus a scene on Spline's hosts
> plus an editor seat — the first externally-hosted dependency on a zero-build page, and it
> would not run in our own labs, which open under a CSP that blocks every external host. G
> and H are the vendored answers to what Spline is usually wanted for. If he wants Spline
> anyway it is ~90 lines and a loading state; the bill is stated before, not after.
>
> **4 · THE LAB HAS ITS OWN HARNESS — `tools/qa/section04-lab.mjs`, 49 checks.** A lab
> exists to be replied to, so **every badge on it is re-derived in a real browser** and if a
> badge and the harness disagree, the harness is right. The two checks that matter most are
> about honesty rather than pixels: **check 2** — every name, descriptor and chip must
> already exist in `index.html` or `goals-lab.html`, so the lab cannot launder new marketing
> past him by letter; **check 4** — all nine variants must show the same eight names, or the
> comparison being asked for is not a comparison.
>
> **5 · FOUR BUGS THE HARNESS FOUND THAT LOOKING DID NOT**, all worth not repeating:
> · ⚠️⚠️ **A `<canvas>` IS A REPLACED ELEMENT, SO `position:absolute;inset:0` DOES NOT SIZE
>   IT.** `width:auto` resolves to the **intrinsic** width — the attribute the renderer
>   wrote, 1280 — and the over-constrained `right` is ignored. It is correct at exactly the
>   width where the grid is 1280 and pushes the document sideways at 1280, 1104, 900, 640
>   and 390. Nothing on screen looked wrong. `width:100%;height:100%` is the fix.
> · ⚠️ **`gl.readPixels` CANNOT PROVE A CANVAS DREW** — the back buffer is undefined after
>   compositing without `preserveDrawingBuffer`, so it returns all zeroes, which is
>   indistinguishable from a canvas that never drew. **Round 10b already recorded this and
>   it caught me again.** The honest test is the one a person does: screenshot, hide the
>   canvas, screenshot, diff.
> · ⚠️ **F's back face leaked into seven variants.** Its whole ruleset was scoped to
>   `[data-v="F"]`, including the `display` — so everywhere else the element had no rules at
>   all, fell into the flex column, and drew a **second descriptor and a live Choose button
>   under every tile**. Scope the ruleset; declare the OFF state unscoped.
> · ⚠️ **`rotateY(180deg)` MIRRORS POSITIONS, NOT JUST FACES.** The `+` pinned to
>   `right:10px` landed on the visual **left** of a turned tile, on top of the first line of
>   copy. Counter-rotating fixes the glyph and not the geometry — the offset has to swap
>   sides too.
>
> **6 · ⚠️ SELECTING D HAS TO REPLAY THE DRAWING.** The IntersectionObserver runs for every
> variant, so by the time a reader reaches D every mark is long drawn and the variant
> demonstrates itself as an ordinary grid — which is what the first build shipped. On the
> page firing once is correct; in a lab whose subject *is* the animation, arriving must show
> it.
>
> **7 · STILL HIS, UNCHANGED:** payment · wiring `#pxd-choose` to step 03 · the
> burgundy/blue conflict · peptide delivery time · tile popup copy and the FAQ are draft.
> **And now: a letter for section 04.**

> **8 · AND THEN HE MERGED TWO OF HIS OWN BOARDS INSTEAD OF PICKING A LETTER —
> `peptide-therapy/section04-hybrid.html`, "the focus rail".** His two references: an
> *interactive 3D orbit* concept (an arc of pathway cards, one enlarged, "click or drag to
> rotate") and an *editorial* concept (eight image-led cards, serif names, DISCOVER
> PATHWAY). His instruction: **the mechanism of the first with the visual system of the
> second.** ⚠️ **NEITHER BOARD USED HIS OWN EIGHT** — the orbit board invented eight names
> of its own ("Weight Loss Support", "Sleep & Stress Support"), the editorial board
> respelled two. Every word in the build is the project's already: names and outcomes from
> index.html, one-line descriptors from goals-lab, and check 1 of its harness asserts it.
>
> **9 · ⚠️⚠️ THE CONSTRAINT THAT SHAPED THE WHOLE BUILD: SECTION 04 IS A MULTI-SELECT.**
> A carousel answers *what am I looking at*; this section's reader is asking *what have I
> picked*. Those fight, and the orbit only survives because **all eight stay on screen**.
> So two rules, and they are the last things to break: every pathway visible at every
> width, and **the chosen tick legible at the smallest scale a card is ever drawn at**.
> ⚠️ **THE CTA IS "ADD TO YOUR PROGRAMME", NOT "EXPLORE".** Both boards said explore; round
> 12 moved this section off browsing and onto building. ⚠️ **AND THE BOARDS' 01–08 ARE NOT
> CARRIED OVER** — round 12 took numerals off these tiles because on a multi-select they
> imply an order that does not exist. Both are flagged on the page as his to reverse.
>
> **10 · THE ARTWORK IS BUILT, NOT PHOTOGRAPHED, AND THAT IS AN OPEN QUESTION FOR HIM.**
> The editorial board is ~65% photograph per card and **those eight photographs do not
> exist**. The focused card carries a glass vessel with **that pathway's own mark suspended
> inside it** — eight generic rotating molecules would say "peptide" eight times and
> nothing about auto-immunity or sleep. If photography arrives the plate takes an `<img>`
> and the layout does not move.
>
> **11 · FOUR BUGS, ALL FOUND BY MEASURING:**
> · ⚠️⚠️ **`transform-style:preserve-3d` MAKES `z-index` INERT.** Children are sorted by
>   position in 3D space instead, so the rotated side cards painted straight over the
>   focused card's name, copy and button. The stacking order was declared, correct and
>   ignored. `perspective` alone gives the same foreshortening and keeps normal painting.
> · ⚠️ **PERSPECTIVE PULLS A RECEDING ELEMENT TOWARD THE VANISHING POINT.** A 52px-per-step
>   `translateZ` for depth shortened every horizontal offset the script had computed, and
>   the fan collapsed into a stack. The arithmetic was right and the picture was wrong.
> · ⚠️ **WIDTH IS TRANSITIONED, SO A CARD CANNOT BE MEASURED FOR LAYOUT.** Reading
>   `offsetWidth` mid-move returns a number partway between the old size and the new one.
>   Two zero-height probes carry the same clamp values and never animate.
> · ⚠️ **THE TICK SCALED WITH ITS CARD** — 24px one step out, 20px at the far end — while
>   the page's own notes told the client it was constant. `1/--sc` on that one element.
>   **The harness caught the difference between the promise and the pixel.**
>
> **12 · `tools/pack-artifact.mjs` — THE TWO-COPIES RULE, AUTOMATED.** Fonts to data: URIs,
> three.js's single trailing `export{}` rewritten to `window.THREE={}` and emitted as a
> classic script (so it runs before the deferred module), and the document scaffolding
> stripped because the artifact host supplies its own. ⚠️ **EVERY SUBSTITUTION PASSES A
> FUNCTION** — a replacement *string* treats `$&` and friends as insertion patterns and
> corrupts 666KB of minified source in ways that do not throw until some unrelated geometry
> is built. Round 10b hit that by hand; this is why it cannot happen again.
> ⚠️ **THE PACKED COPY IS NOT COMMITTED.** bonds-lab committed its artifact copy because
> its build rig was gitignored; this packer is in the repo and deterministic, so 1 MB of
> derived bytes would be a second source of truth for no gain. Rebuild it, don't store it.
>
> **13 · `tools/qa/section04-hybrid.mjs`, 35 checks — IT ASSERTS THE PROMISES THE PAGE
> MAKES IN WRITING.** The notes panel tells the client four specific things; all four are
> measured. ⚠️ **AND ONE CHECK IS OF THE PACKER, NOT THE PAGE**: it aborts every request
> that is not the document and asks whether the faces still loaded and the 3D still booted.
> ⚠️ **A RESPONSIVE ASSERTION MUST NOT FIRE MID-TRANSITION** — measured 420ms after
> crossing the breakpoint it reported 7/8 cards on a layout that was correct a third of a
> second later. It measures the animation, not the page.

> **14 · HE DID NOT PICK — HE SENT A THIRD REFERENCE AND THE HYBRID WAS REBUILT AS A RING.**
> A shallow 3D arc of IMAGE-DOMINANT cards on warm ivory, numbered, one forward and larger,
> arrows at either end, a dot per pathway, "drag to explore" — plus the one thing he added
> in words rather than a picture: **a + in the top right that turns the card over for the
> description.** The front is photograph + numeral + name + one line + the pill; the back is
> the popup's own first paragraph and its outcome chips.
> ⚠️ **THE + IS ONLY ON THE CARD IN FRONT.** A + on a 110px card at the far end of the ring
> is a target nobody can hit and a decoration everybody can see. While a card is turned its
> face stops taking clicks — round 12's finding in a new costume.
> ⚠️ **AND TURNING THE RING CLOSES IT.** A card left turned as it rotates away is burgundy
> where seven photographs are, with no reachable + any more. Check 5g asserts it.
>
> **15 · ✅ THE EIGHT PHOTOGRAPHS LANDED — his upload, 2026-08-17 09:02, straight to `main`.**
> Eight 1122×1402 PNGs named by the tool that made them (`ChatGPT Image Aug 17 … (1)…(8)`),
> and ⚠️ **THEY ARRIVED IN THE SECTION'S OWN ORDER** — antibodies, neurons, villi, lipid
> droplets, follicles, muscle fibre, DNA, neurovascular, 1:1 against the eight goals as the
> page lists them. `git mv`'d to `images/pathways/<slug>-master.png`; the cards eat
> `<slug>.webp` encoded from them (**1.9 MB of PNG → 95 KB of card**, eight of them).
> ⚠️ **THE MASTERS ARE RENAMED, NEVER RE-ENCODED** — round 4's precedent. They are what to
> go back to when a crop or a size changes.
> ⚠️ **I TOLD HIM TWICE THEY WERE NOT THERE BEFORE THEY WERE.** Checked every branch and
> then GitHub's own API; both were right at the time. **Check the API, not just the fetch,
> and say what was checked** — "I can't find them" is worth nothing without the evidence.
> ⚠️ **A MISSING FILE IS STILL A SUPPORTED STATE AND THE CODE FOR IT IS NOT DEAD.** A probe
> `Image()` decides, and a card that loses its file falls back to its gradient plate and its
> own mark at identical geometry — which is exactly what the artifact packer produces when
> it cannot inline a path.
>
> **16 · THE GLASS VESSEL IS NOW THE FALLBACK, NOT THE ARTWORK.** It draws only where a card
> has no photograph. ⚠️ **A vessel hovering over a photograph of neurons is two pictures
> fighting inside one card** — and the harness asserts the two never coexist, in both
> directions, because the first version of that check asserted the opposite and failed a
> correct page.
>
> **17 · THREE MORE BUGS, ALL FROM THE FAN:**
> · ⚠️⚠️ **A FAN COVERS EACH CARD FROM THE SIDE ITS NEIGHBOUR SITS ON.** Names pinned left in
>   the RIGHT half printed underneath the next card — "…exual ealth", "…to mune ease" —
>   which reads as broken text rather than as depth. **Name AND tick are set against each
>   card's OUTER edge**, which is why the script writes a `data-side` and not only an offset.
> · ⚠️ **THE ARROWS WERE SOLVED FOR THE VIEWPORT AND LANDED ON THE CARDS.** The far card now
>   stops 62px short of the rail edge — the arrow's 44 plus air — not at the edge of the clip.
> · ⚠️ **A VERY WIDE ELLIPSE HAS NO VISIBLE CURVE.** At 124% only the top of the arc was on
>   screen and the ring read as a stray horizontal rule. 96% × 52% puts curvature in frame.
>
> **18 · `tools/pack-artifact.mjs` NOW INLINES ARTWORK TOO**, and ⚠️ **STRIPS `data-art` FOR
> ANY PATH IT CANNOT INLINE** — a path left in place is a request the artifact policy will
> refuse, and the card would show a broken-image glyph instead of the fallback it was built
> for. Packed: **2.04 MB**, nothing fetched, against a 16 MB ceiling.
>
> **19 · STILL OPEN, AND IT IS ONE QUESTION NOW: IVORY OR THE ROSE DAWN.** His reference is
> ivory and this is built on it. ⚠️ **`--dawn` is load-bearing in section 04 twice** — the
> chain scene rises to exactly it so the handoff has no seam, and the ivory tiles need it to
> read as objects. **The second reason dies with photographs on the cards; the first does
> not.** Either the scene's `BG_B` follows the ground, or this is re-graded onto the dawn.

> **20 · ⚠️⚠️ HE CAUGHT THE RING RUNNING UPSIDE DOWN, AND HE WAS RIGHT.** *"By the logic of
> our circle which rotates, going down to the point in the middle — should those cards be
> going down as well?"* **Yes.** On a ring seen from above the NEAR point is the LOWEST on
> screen and the ring climbs away as it recedes; the build had the front card HIGHEST with
> the outer cards dipping below it — **a hill with a valley in the middle, not a circle.**
> ⚠️ **NOTHING IN THE HARNESS WOULD EVER HAVE SAID SO.** Every assertion was about position,
> count, contrast and overflow, and not one about whether the arrangement MEANT anything.
> Checks 4e/4f now measure it: the feet must descend strictly from the front outward (51px
> of climb), and each step out must be strictly smaller.
> ⚠️ **THE FIX IS ANCHORING, NOT AN OFFSET.** Cards are bottom-anchored with
> `transform-origin:50% 100%`, because what follows the ellipse is a card's FOOT — anchored
> or scaled about its centre, a taller or smaller card's foot leaves the curve.
> ⚠️ **AND RECESSION IS NOW ONE NUMBER.** `t = (1-cos(a/aMax·SPREAD))/(1-cos(SPREAD))` — the
> chord of the arc, 0 at the front and 1 at the outermost. Height, size and opacity all read
> it, so they cannot drift apart, and the falloff is slow near the front and quick at the
> edges, which is what perspective does. Scale was a flat `1 − a×.05` (0.95→0.80, which the
> eye reads as nothing); it is now 0.98 / 0.91 / 0.80 / 0.66.
> ⚠️ **THE RING LINE'S HEIGHT IS DERIVED FROM `RISE`, NOT CHOSEN.** What is on screen is the
> ellipse's BOTTOM arc; at half-width it has climbed B×0.47, so B ≈ 2×RISE or the line stops
> being the thing the cards stand on. Change one, change the other.
>
> **21a · ✅ HE PICKED WIDE (2026-08-17) — it is the default and the toggle stays.** ⚠️ **THE
> CROP IS ON THE RECORD RATHER THAN DISCOVERED LATER**: a landscape card shows roughly the
> middle half of a 4:5 photograph. The card went 338 → **372px tall**, which is as landscape
> as it can stay beside a ring of portrait cards and buys back about a tenth of every picture
> for nothing. **If the eight are ever re-generated, ask for 3:2 landscape masters** and the
> cost disappears.
>
> **21 · TALL OR WIDE — A TOGGLE UNDER THE RING, AND THE SECOND OPEN QUESTION.** His ask:
> *"experiment on making the cards portrait sized to maximise their image, as the images are
> portrait."* ⚠️ **HE IS RIGHT THREE TIMES OVER.** The photographs are 4:5 and a 452×338
> landscape card **cropped about sixty per cent of each one away** before asking him to judge
> it; tall hands the arc **a hundred pixels back**, so the fan's overlap falls 31% → 22% and
> the outermost card stops being a sliver; and a ring of eight identical portrait cards with
> one brought forward is a coherent object, where a ring whose front card CHANGES SHAPE is a
> fan with a billboard in it. **Wide is kept, because it is what his reference showed.**
> Default is tall. ⚠️ The toggle writes `--fw/--fh` **on the rail**, and layout is deferred
> two frames — the probes report the new width on the next frame, not this one, so laying out
> immediately places the ring against the shape it just left.
>
> **22 · THE 3/4 SPLIT WAS ALREADY THERE; WHAT HE SAW WAS THE FOURTH CARD LOOKING HIDDEN.**
> Eight cards with one at the front leaves seven, so the arc is 3 + front + 4 and always was.
> ⚠️ **SEVEN DOES NOT HALVE — the asymmetry is movable, not fixable**, and his own first
> reference has the same split. The portrait card makes the fourth legible again, which is
> the whole of what was wrong.

> **23 · ⚠️⚠️ "IS GOLD REALLY RIGHT, OR THE SUPER-WHITE FROM THE BHRT STAR?" — MEASURED, AND
> THE ANSWER IS NEITHER.** Sampled at the corner the chosen badge actually sits in, against
> HIS OWN EIGHT PHOTOGRAPHS: **gold 1.03 at worst (gut-health — invisible, not weak), ivory
> 1.50, burgundy 4.84, ink 5.96.** Every one of the eight is pale rose in that corner, so
> **it is not gold-versus-ivory, it is light-versus-dark.**
> ⚠️ **AND ON THE IVORY GROUND THE REVERSE HOLDS: gold 2.31, ivory 1.00.** An ivory line on
> ivory is not a line. **This is the BHRT star board's finding a second time** — ivory is
> loudest on the dark and quietest on the pale, gold is the only one alive at both ends —
> and that board is the precedent for *taste outranks the meter*, so the numbers are put to
> him rather than applied over him.
> ⚠️ **THE REAL FIX WAS NOT A COLOUR: THE BADGE GAINED AN EDGE.** A wine hairline plus a soft
> drop means it is found by its OUTLINE rather than its fill, so it reads on all eight
> whatever accent is set. **Any future accent inherits the fix instead of re-finding the bug.**
> ⚠️ **THE SIGNALS ARE SPLIT AND MUST STAY SPLIT.** What sits ON A CARD follows `--pick`;
> what sits ON THE GROUND (the ring line, the unpicked dots) stays gold whatever `--pick` is,
> because no light accent survives the ivory and no dark one belongs there.
> Three settings live under the ring: **Gold** (default, what he approved) · **Ivory** ·
> **Wine**. My recommendation is wine for the badge and gold everywhere else.
>
> **24 · TWO MORE BUGS, AND BOTH ARE ABOUT CHECKS RATHER THAN CSS:**
> · ⚠️⚠️ **THE `[data-pick]` RULES WERE WRITTEN AND NEVER LANDED.** They were inserted against
>   an anchor comment an earlier edit had already consumed, so the substitution **matched
>   nothing and did nothing, silently**. The toggle moved the attribute, the attribute
>   selected no rule, and all three settings rendered gold. **Everything looked wired and
>   nothing was.** Check 4h asserts the COMPUTED colour, which is the only thing that can
>   tell a token apart from a token-shaped comment. **Every scripted substitution in this
>   file's history should assert its anchor.**
> · ⚠️ **A PICKED CARD LOST ITS RING AT THE FRONT.** `[data-picked]` and `[data-focus]` set
>   box-shadow at the same specificity, so the later rule simply won. **Chosen and focused
>   are not alternatives; they are both true.**
> · ⚠️ **AND THE HARNESS MEASURED AN ANIMATION FOR THE THIRD TIME.** box-shadow transitions
>   for 600ms and the check read it at 500 — partway between the old accent and the new, so
>   it matched neither. **The tell is always a check that passes for exactly the one case
>   that did not change**: gold passed because gold was the value it started from.

> ---

> ## ROUND 17 — 2026-08-16: the tile goes burgundy, and a contrast check is found to have
> been measuring the wrong tile since round 12
>
> **1 · THE CHOSEN TILE IS `--burgundy` #5C1F31 — his pick, letter D.** It was `--ink`.
> ⚠️ **HE TOOK IT WITH THE COST STATED AND THAT COST IS REAL: `--burgundy` IS THIS PAGE'S
> PRIMARY BUTTON MATERIAL.** A chosen tile now wears the same fill as "Book a consultation".
> ⚠️⚠️ **SO THE DISTINCTION IS CARRIED BY SHAPE AND CONTENT, NOT COLOUR** — a button is a
> **pill** (999px) in uppercase letterspaced sans; a tile is a **2px rectangle** in
> title-case Megante with a mark and a tick. **Round a tile or square a button and two
> different meanings collapse into one material with no visible error anywhere.** Check 1j
> asserts the radii stay apart; nothing was guarding it before.
> ⚠️ **THE ONE BUG THE COLOUR CHANGE CAUSED, AND IT IS FIXED:** `.px:hover .px-open::before`
> fills `--burgundy`, which was a clear circle on an ink tile and **invisible on a burgundy
> one**. A chosen tile's + now fills **gold with an ink glyph** (ivory-on-gold is 1.9:1 and
> would have swapped one invisible + for another).
>
> **2 · ⚠️⚠️ CHECK 16 HAD NEVER ONCE MEASURED A CHOSEN TILE — SINCE ROUND 12.** It read:
> `document.querySelector('.px[data-picked="true"]') || document.querySelector('.px')`
> and **the width sweep immediately above it calls `page.goto()` at eight viewports**, so by
> the time it ran the page had been reloaded eight times and nothing was picked. The `||`
> handed it an ordinary ivory tile and it reported **ink-on-ivory 14.28:1** under the label
> *"chosen tile name"* — a comfortable pass, printed in green, for a state the page was
> never in. It now picks a tile first and **the fallback is deleted**: a contrast check that
> cannot find its subject must FAIL, because the whole value of the number is which two
> colours produced it. Real numbers now: **11.58** name, **5.00** mark.
> ⚠️ **THIS IS THE SECOND ASSERTION-THAT-COULD-NOT-FAIL FOUND IN TWO ROUNDS** (check 6 was
> twelve hardcoded hexes and no browser). **When a check looks reassuring, verify it can
> still fail.**
> ⚠️ **AND IT CAUGHT ME OUT THE SAME WAY:** my first version of check 1k read the fill in
> the same tick as the click and got `rgb(250,247,241)` — `.px` transitions `background`
> over .35s, so `getComputedStyle` returned the START of the interpolation. Round 12 already
> recorded "DO NOT SAMPLE MID-TRANSITION" and it still bit.
>
> **3 · QA — 122 checks, all green.** `peptide-page.mjs` **50** · `services-choice.mjs` **72**.
>
> **4 · MERGED TO `main`** at his instruction — the first time this arc has left the branch.


> ## ROUND 16 — 2026-08-16: the VAT question closes after three rounds, and the lit tile
> goes to a lab
>
> **1 · ✅ AED 1,150 IS THE VAT-EXCLUSIVE BASE. CONFIRMED, IN HIS WORDS: *"1150 is exclusive
> so plus 5% tax is more."*** This had been open since **round 12** and it is the longest-
> running unknown on the page. **The arithmetic never changed** — the panel has computed
> 1,150 → 57.50 → **1,207.50** (and 3,100 → 155.00 → **3,255.00** with the collection) the
> whole time — so no figure on the page moves. What changed is that it is now a **confirmed
> fact rather than an assumption the page was quietly making.**
> ⚠️ **IT WAS WORTH ASKING THREE TIMES.** A base read as inclusive understates every total
> by 5%, the error surfaces only at the moment money is taken, and it is exactly what a
> customer disputes after paying. Recorded at the panel's summary and at `BASE` in the tray
> script, not only here.
>
> **2 · THE SELECTED TILE IS TOO COLD — his note: *"it looks too dark and not sexy or
> appetizing"*, and he is right.** It is `--ink` #2E2228, picked in round 12 on the rule
> *"ink, never the one red — red is this page's material for THIS COMMITS YOU, and a lit
> tile is a choice, not a call to action."* **That rule still holds.** What it did not
> account for is that a chosen tile is the section's **one moment of reward**, and near-black
> is the coldest possible reward.
>
> **3 · SIX CANDIDATES, IN A LAB: `selected-tile-lab.html`.** Live tiles at full scale on the
> real dawn ground, two of four chosen, each row carrying its measured numbers.
> **A champagne `#C2A05E`** · **C dusty rose `#C79A92`** · **H terracotta `#A8756B`** ·
> **G bronze `#8A6A34`** · **D burgundy `#5C1F31`** · **F ink** (shipped, for comparison).
> ⚠️⚠️ **THE NUMBER THAT DECIDES THIS IS NOT CONTRAST WITH ITS OWN TEXT — it is Δ FROM AN
> UNCHOSEN TILE.** Every candidate clears 4.5:1 for its name; that was table stakes and none
> failed it. What separates them is how far the fill travels from `--ivory`, because that is
> what a reader actually uses to count their choices without reading a word.
> ⚠️ **TWO OBVIOUS CANDIDATES WERE MEASURED AND CUT BEFORE THE LAB WAS WRITTEN**, and they
> are the two anyone reaches for first when asked to make something lighter:
> **gold-tint fill = 31/255** and **ivory + gold frame = 0/255** from an unchosen tile. Both
> are lovely in isolation and **neither says anything**. Do not re-propose them without
> solving that.
> ⚠️ **D IS THE TRAP.** It looks the richest and it is this page's **primary button
> material** — a chosen tile would wear the same colour as "Book a consultation", which is a
> sentence the page does not mean to say.
> ⚠️ **H IS THE ONLY CANDIDATE THAT IS NOT ALREADY A TOKEN.** Picking it adds a value to the
> system; that is a real cost and should be a deliberate one.
> **My pick: A.** It is the only option that makes a chosen tile the page's *own accent*
> rather than a darker rectangle, and gold already dresses every other "yes" here — the
> marks, the tick, the tray's count. **C is the safer pick** if the grid should stay quiet at
> four or five selections.
>
> **4 · A BUG THE LAB CAUGHT IN ITSELF, worth keeping because it will recur:** the tick badge
> was first drawn with its background and its glyph both taken from the same variable, so on
> half the variants it rendered **dark-on-dark and the ✓ was invisible**. A badge needs
> *two* colours chosen against *two* different neighbours — its own fill against the tile,
> and its glyph against itself.
>
> **5 · NOTHING ON THE PAGE CHANGED THIS ROUND** beyond the two VAT comments. The lab is a
> question, not an implementation — whichever letter he picks becomes a handful of values in
> the `.px[data-picked="true"]` block. QA unchanged: **50 + 69, green.**


> ## ROUND 15 — 2026-08-16 (last): section 05 goes for good, section 04 takes the dawn,
> and the + is found to have been drawing two rings for three rounds
>
> **1 · THE PROGRAMME BAND IS DELETED TOO — his call, and it settles three of the four
> lettered questions at once.** Round 14 replaced the client's chapter with a dawn band
> carrying the price, the ledger and the blood markers; he wanted section 05 gone *whole*.
> **So A, B and C in `programme-band-lab.html` are all answered "none of them".** The
> programme panel is once again the only place any price, any process or any marker appears.
> ⚠️ **D2 IS CONFIRMED AND SHIPPED** — his *"i'm guessing it should move with the user right
> if something is selected"*, which is exactly what D2 does.
>
> **2 · ⚠️⚠️ SECTION 04 IS THE DAWN NOW, AND THAT ONE LINE IS DOING TWO JOBS.**
> Deleting the band put `.services` (ivory) straight against `.incl` (ivory) — two identical
> grounds meeting, which reads as one section that lost its heading. **Moving section 04 to
> the dawn fixes it by changing ONE ground** instead of flipping `.incl` and the four below
> it, two of which carry photographs whose scrims are measured minimums.
> **The second job is the one he actually asked for.** `.px` is filled `--ivory`; on an ivory
> ground the tiles were the page colour on the page colour, held apart by a 1px hairline —
> which is *why* the section read flat and unclickable. On the rose dawn the same fill
> becomes a lifted card with no new decoration at all.
> ⚠️ **SO `--dawn` AND `.px`'s FILL MUST NEVER CONVERGE.** A later grade could collapse the
> distinction by moving either token and nothing would look broken in review. Check 18
> measures the gap (currently 16/255 at the widest channel; the floor is 8).
> ✅ **A free win: the chain scene rises to exactly `--dawn`, so the scene now hands off to
> section 04 with no seam** — the same handoff section 03 already had.
>
> **3 · WHAT ELSE THE TILES GAINED, and it is deliberately almost nothing.**
> · **a plate behind each mark** (`--cream`, `--gold-tint` on hover) so the glyph reads as an
> emblem rather than a drawing loose in the corner of a card;
> · **a floor** — `min-height` plus `margin-bottom:auto` on the mark, so every name sits on
> the same baseline whatever its length. ⚠️ **THAT is what makes the eight read as a set**,
> not the min-height alone: "Anti Ageing" against "Musculoskeletal Injury" is one line
> against two, and without it each row sets two different card heights;
> · **a gold tick badge** instead of a loose glyph — the moment a tile is chosen is the one
> moment in this section that should feel like a reward, and it was the quietest thing on
> the screen;
> · ⚠️ **a "READ" label on the + , which fixes a real ambiguity rather than decorating.** A
> "+" on a card means ADD everywhere else in the world — and on this card *adding is what
> the tile does*, while the + opens reading. Round 12 gave them separate hit areas, which
> stops the wrong thing happening but not the wrong thing being **expected**.
> ⚠️ **HOVER-ONLY ON PURPOSE.** Eight permanent READ labels turn a calm grid into a page of
> buttons. Phones get the 44px target and the aria-label.
> ⚠️ **ON PHONES THE FLOOR AND THE PUSHED-DOWN NAME COME OFF** — both exist to align a ROW,
> and in one column there is no row. Leaving them cost a screen and a half of extra
> scrolling between the reader and the tray.
>
> **4 · ⚠️⚠️ A THREE-ROUND-OLD BUG SURFACED, AND THE WAY IT HID IS THE LESSON.**
> Round 12 grew the + from a 32px circle to a 44px thumb target and left a comment saying
> *"the circle still DRAWS at 32, via `::before`"*. **It did not.** The base rule's
> `border:1px solid var(--line)` and `border-radius:50%` travelled with the box, so **every
> tile carried two concentric rings**, and the hover fill landed on the 44px box rather than
> the 32px circle — the burgundy disc a reader saw was 44px wide.
> ⚠️ **WHY NOTHING CAUGHT IT: every assertion about that control measured its POSITION
> (check 1g) or its BEHAVIOUR (checks 4–6). Both were correct the entire time. No check ever
> asked what it LOOKED like.** Checks 1h and 1i do now.
> ⚠️ **IT ALSO CARRIED `transform:rotate(90deg)` ON THE BUTTON**, which rotates everything
> positioned inside it — the new READ label rendered on its side. The rotation is on the
> `svg` now. (And a second CSS trap worth keeping: an absolutely positioned box with
> `right:100%` and `left:auto` shrink-to-fits against **zero** available width and breaks
> one character per line — `white-space:nowrap` does **not** save it, because "READ" has no
> spaces to not-wrap at. It needs `width:max-content`.)
>
> **5 · THE PANEL'S STEPS 05 AND 06 ARE HIS ACCOUNT OF THE REAL SERVICE.**
> **05 · Your peptides arrive** — prescribed at the consultation, quoted, and *"once payment
> is reached the prescription will be sent to the location of the customer"*. ⚠️ **PAYING AND
> DELIVERY ARE ONE STEP, NOT TWO** — his call; paying is the trigger for the despatch, not a
> stage anyone waits through, and splitting it took the list to seven, which is the length
> that got the client's own chapter deleted.
> ⚠️ **ITS DURATION CELL IS A QUANTITY, NOT A SHIPPING TIME — "8 weeks' supply"**, his figure,
> agreeing with "Your peptides — two months" above it. No delivery time has ever been given
> and inventing one in a column that also holds "60 min" would read as a commitment.
> **06 · Aftercare — one month of calls**, his *"they can still call us for the 1 month if
> they have symptoms and any confusion"*.
> ⚠️ **THAT IS NARROWER THAN THE CLIENT'S OWN INCLUDED LINE ("4-week | 8-week mentorship")
> AND BOTH STAY ON THE PAGE ON PURPOSE.** They are not the same thing: the mentorship is
> scheduled contact the clinic initiates, this is an open line the patient uses when they
> like. **Do not "reconcile" them by deleting one** — that either drops a promise the client
> made or invents one they did not.
>
> **6 · QA — 119 checks, all green.** `peptide-page.mjs` **50** · `services-choice.mjs` **69**.
> The shop-window comparison checks (12d–12h) were **deleted with the band they compared
> against** — ⚠️ **if a price ever appears on the open page again, restore them**;
> `git log -S "12d the band and the panel"` finds the block intact.
>
> **7 · ⚠️ STILL HIS, UNCHANGED:** whether **AED 1,150 includes VAT** (back behind two clicks
> now that the band is gone, which lowers the urgency but not the question) · **payment** ·
> the **burgundy conflict** from round 14 · and **wiring `#pxd-choose` to step 03**, which is
> the natural next round now that "choose your doctor" is a named step.


> ## ROUND 14 — 2026-08-16 (later still): the glacier is reversed, section 05 is deleted
> whole, and the chooser grows the band that carries the price
>
> **1 · ⚠️⚠️ THE PAGE IS PLUM AGAIN, AND THIS REVERSES A NOTE THE CLIENT MADE THE SAME DAY.**
> His instruction: *"roll the plum design in the whole peptide page."* The commercial reason
> is plain — medi-gyn.com is warm, the landing page is warm, the sister hormone page never
> left, and a service page in steel was the one screen in the estate that did not look like
> the brand. **BUT ON RECORD, EARLIER THE SAME DAY, IS THE CLIENT'S OWN:** *"the burgundy is
> not approved as now that we have transitioned to blue… we must find another colour with
> the same VALUE of this burgundy."* **His instruction is the later one and it is the one
> implemented.** The two have not been reconciled by the people who made them, and this is
> **the single most likely thing on the page to be sent back.** The conflict is recorded at
> `.scene-stage` in the stylesheet, not just here.
> ⚠️ **NOTHING IS AT RISK ON CONTRAST EITHER WAY** — the two grades measure the same to
> within 0.05 at every pair (check 6b proves it), so this is a brand decision, never an
> accessibility one, and it can be taken back without re-measuring anything.
>
> **2 · WHY THE REVERSAL COST A COMMIT INSTEAD OF A REDRAW — round 9 built it to be undone.**
> Three decisions made by the round that *applied* the glacier are the reason:
> · **The hero was tinted, not re-authored.** "ONE multiply at the foot of `draw()`, not
> re-tinted artwork" — deleting three lines (`multiply` / `#F3F7FB` / `fillRect`) restored
> warm artwork that had been sitting underneath the whole time.
> · **`--gold-gloss` was kept split from `--gold-deep`** with the note *"the next grade may
> need it again"*. It does: `#8A6A34` measures **4.16** on the rose dawn, under the 4.5 floor
> for `.seg-gloss`. ⚠️ **DO NOT TIDY THAT DUPLICATE AWAY** — check 6 asserts they stay split.
> · **The brand law never took a temperature.** `--burgundy`, `--rose`, `--logo-red` and both
> inks were untouched on both grades, so `.turn` was restored by pointing at `var(--burgundy)`
> again rather than by picking a colour.
> ⚠️ **THE PAGE HAS NO PHOTOGRAPHIC PLATES** (only doctor portraits), so no image was
> re-encoded. That is why this was cheap here and would not be on the landing page.
>
> **3 · SECTION 05 IS DELETED WHOLE — 425 lines of markup and CSS.** His call: *"we have
> basically compressed all the information, we need now to delete the following."* Gone: the
> P's headline, the client's two explainer paragraphs, both **For women / For men** symptom
> lists (~50 lines), and the **seven steps**. This closes two items that had been open since
> round 12 — the steps duplicating the panel's, and the women/men split.
> ✅ **A SIDE EFFECT WORTH BANKING: the flagged efficacy claim went with it** — *"a more
> effective alternative to traditional medicine"* was in that lede and no longer needs
> softening or sign-off.
> ⚠️ **THE HARNESS CHECK IS INVERTED, NOT DELETED.** Section 05 is ~1,100 words of CLIENT
> copy, so it lives in his documents, in git and in every handover — any of which is one
> paste away from the page. `peptide-page.mjs` now asserts it is **absent**.
>
> **4 · ⚠️ DELETING IT BROKE THE GROUND ALTERNATION, AND THAT IS WHAT THE NEW BAND FIXES.**
> `.services` is ivory and `.incl` is ivory; `.prog` (dawn) was the only thing between them.
> **05 · The programme band** (`.pgb`, and it reuses the vacated `id="programme"`) is dawn,
> so ivory→dawn→ivory→dawn survives to the foot of the page and **nothing below moved**.
> There is now a check that asserts the *sequence* rather than each colour.
>
> **5 · THE BAND IS ALSO HIS "MAKE THAT SECTION MORE APPEALING… GO LARGER".** The chooser was
> eight tiles and nothing else: a reader who never pressed one saw **no price, no proof, no
> process**. The band carries the price (with VAT), what's included, what you can add, what
> is priced after — and the **eleven blood markers**, the one thing rescued from section 05,
> because the panel says *"the exact panel we send you"* and never says what is in it.
> ⚠️⚠️ **WHAT THE BAND MUST NEVER GROW: THE STEPS.** They live in the programme panel and
> nowhere else. Section 05 was deleted *for* saying them twice, and the fastest way to
> rebuild that fault is to "helpfully" add the process here.
> ⚠️ **THE INCLUDED LIST DOES APPEAR TWICE AND THAT IS DELIBERATE** — shop window and cart.
> Six short lines restated at the moment of paying is how any purchase works. **Checks 12d–12h
> compare the band's figures against the panel's** rather than trusting them, because a band
> quoting a different price from the cart is a dispute after payment.
>
> **6 · THE PANEL'S STEPS WENT 5 → 6, AND THE ORDER WAS A REAL FAULT.** His correction: *"the
> choose your doctor should be on the third one, as that doctor will read your file, then you
> can choose the time with them."* The old copy had a **stranger reading your labs** and the
> reader picking someone afterwards. Now: **03 choose your doctor → 04 the consultation
> (findings, prescription, which peptides) → 05 your peptides arrive → 06 support.**
> ⚠️ **STEP 05 IS NEW AND THE PANEL HAD NEVER HAD IT** — the thing the customer is actually
> buying never appeared in the sequence. His words: *"after that is where we deliver the
> peptides after the payment and so on and the after care."*
> ⚠️ **ITS DURATION CELL SAYS "after payment", NOT A NUMBER OF DAYS.** No delivery time has
> been given and inventing one beside "60 min" would be the AED 350 mistake again.
> ⚠️ **STEP 03 IS THE HOME THE `#pxd-choose` TEMPLATE WAS KEPT FOR.** Round 13 recorded it as
> unreachable but kept "because doctor choice moved to the moment the consultation is booked".
> That moment is now named on the page. **Wiring it is the natural next round.**
>
> **7 · THE CLOSING LINE UNDER THE BUTTON IS GONE** — *"Everything happens online — you never
> need to visit us…"*, his *"it's not good in that page."* He is right twice over: the quoting
> half was already the "Priced after your consultation" block in his own words, and *"you
> never need to visit us"* stopped being true the moment step 05 delivered to an address.
> A hedge is the wrong last thing to read before a primary action. **Check 11d asserts it
> stays gone.**
>
> **8 · THE TRAY FOLLOWS THE READER NOW, AND SHRINKS RATHER THAN OVERSTAYING.** His *"the
> brown thingy should be sticking to the bottom when we scroll… to remind them that they have
> clicked on the program."* **THAT REVERSES ROUND 12**, which scoped it to the section — but
> that round's argument ("a fixed bar would follow the reader through the doctors, the stories
> and the FAQ") is **answered, not overruled**: once the eight are off screen the tray drops
> to `.mini`, stops painting its band, and becomes a **pill in the corner**. It hides entirely
> over `#book`, so two primary actions never share a viewport.
> ⚠️ **DRIVEN BY THE GRID, NOT THE SECTION** — `.services` is taller than the viewport, so
> watching the section would keep the bar full-width over the band below it.
> ⚠️ **FIXED NO LONGER RESERVES SPACE.** Nothing was added to compensate because `.sec-pad`
> already ends every section with `clamp(90px,13vh,160px)`. **That is load-bearing now.**
>
> **9 · ⚠️⚠️ A QA CHECK WAS FOUND TO HAVE BEEN PROVING NOTHING, WITH A GREEN TICK BESIDE IT.**
> Check 6 ("the cool translation held its values") was **twelve hardcoded hexes and the
> arithmetic run over them — no page, no browser, no measurement.** It passed identically
> whether the page shipped glacier, plum or neither. It was caught only because the reversal
> made it print the *cool* numbers under a heading claiming they were current. **It now reads
> the live document** and compares eleven tokens against BRAND.md; the arithmetic survives as
> **6b**, relabelled as what it is — a comparison of two historical tables, not evidence about
> what shipped. ⚠️ **NEVER LET THOSE TWO JOBS SHARE A HEADING AGAIN.**
>
> **10 · QA — 123 checks across two harnesses, all green.**
> `peptide-page.mjs` **51** (was 46) · `services-choice.mjs` **72** (was 64).
> ⚠️ `goals-lab.mjs` and `programme-lab.mjs` were **not re-run and are not counted** — both
> test lab files that were deliberately left on the glacier grade (see 11).
>
> **11 · THE VARIATIONS HE ASKED FOR ARE A LAB: `programme-band-lab.html`.** Three of the four
> round-14 questions came back *"show me different variations"*, so the answer follows the
> grade-lab contract: live markup at real scale, every variant lettered, the shipped one
> tagged. **Four decisions, twelve variants: A the band's shape · B the blood panel · C the
> price · D the tray.** On the page right now: **A1 · B1 · C1 · D2.**
> ⚠️ **IT IS A NEW FILE BECAUSE IT IS ON THE PLUM GRADE.** `goals-lab.html` and
> `programme-lab.html` were authored and judged under glacier and their tokens are still
> steel. **They are deliberately NOT updated** — they are the record of decisions taken under
> the grade they were taken under. Showing him shapes in the wrong colours is how a shape gets
> rejected for its palette.
> ⚠️ **THE LAB LINKS ITS FONTS INSTEAD OF INLINING THEM** — ~40KB against the older labs'
> 500KB+, and the two proprietary faces are referenced rather than embedded so the file can be
> shared without shipping the licence with it.
>
> **12 · ⚠️ STILL HIS, AND THE FIRST ONE GOT MORE URGENT:**
> · **whether AED 1,150 includes VAT** — open since round 12, and it is now printed on the
> **open page** rather than behind two clicks, so a wrong assumption is public;
> · **payment** — still the one thing asked for that is not built; `Start` lands on `#book`
> and the `href` is the only line that changes when a provider exists;
> · **the burgundy conflict in 1**, which only he and the client can settle;
> · **the peptide delivery time** for step 05, deliberately left as "after payment".


> ## ROUND 13 — 2026-08-16 (later): the tile finishes becoming a control
>
> **1 · THE + MOVED TO THE TOP RIGHT.** It sat bottom-right because it used to BE the
> whole tile's affordance and read as a "more" control at the foot of the copy. The
> tile is a choice now and the + is a secondary door on it — corners are where
> secondary controls live, and the top right is the one a thumb reaches for last,
> which is right for the control that must not be hit by accident. The tick moved to
> the bottom-right corner it vacated.
>
> **2 · THE POPUP'S PILL BUILDS THE PROGRAMME INSTEAD OF SENDING PEOPLE TO A DOCTOR.**
> "Book a consultation" → **"Add to your programme"**, which adds that goal, closes the
> panel and raises the tray. ⚠️ **THE POPUP CANNOT SAY WHICH GOAL IT IS** — its markup
> is cloned from a `<template>` carrying no identity — so the tile is remembered at the
> moment its + is pressed (`openGoal`) and the pill reads that back.
> ⚠️⚠️ **A CONSEQUENCE WORTH KNOWING: THE DOCTOR CHOOSER IS NOW UNREACHABLE FROM THE
> PAGE.** Nothing opens `#pxd-choose` any more. **The template is kept on purpose** —
> doctor choice moved to the moment the consultation is booked (his call), and that is
> exactly the UI for it. `peptide-page.mjs` used to reach the chooser by clicking
> `[data-choose]` and died on null; it now asserts the band-order invariant against
> the TEMPLATE, because a test that walks a path the product has removed is testing
> the test.
>
> **3 · THE POPUP KICKER WENT** — "01 · Peptide Therapy" told a reader of this page
> nothing they did not already know, and the numerals had just left the tiles for
> implying a sequence that does not exist. **The marks went 46 → 58px.**
>
> **4 · ⚠️ VAT CAME BACK, AND HIS INSTRUCTION REVERSED WITHIN THE SAME DAY.** First:
> *"show 1,150 only, VAT line at checkout."* Then: *"the +5% should be there with the
> total price."* **THE SECOND STANDS**, and the reasoning behind the reversal is sound —
> a number that grows after you have decided is the most disputed thing in any
> purchase, and this panel exists to make the next click feel safe. Three rows now:
> programme, VAT 5%, total. **1,150.00 → 57.50 → 1,207.50**, or with the collection
> **3,100.00 → 155.00 → 3,255.00**.
> ⚠️ **ALWAYS TWO DECIMALS IN THAT BLOCK, EVEN ON WHOLE FIGURES.** Letting round
> numbers drop their fils put "AED 1,207.50" and "AED 3,255" in the same column, which
> reads as a formatting fault rather than a total.
> ⚠️ **WHETHER AED 1,150 IS THE VAT-EXCLUSIVE BASE IS STILL NOT ON THE RECORD.** The
> page currently treats it as the base and adds on top.
>
> **5 · ⚠️ THE ONE THING ASKED FOR THAT IS NOT BUILT: PAYMENT.** His *"when they click
> start programme that should link to the payment already, either with Apple Pay or
> something, reducing friction"* is right and it is the correct next move — but it needs
> a payment provider on a merchant account (Stripe, Tabby, Network International, Apple
> Pay through any of them), which is his to open and not something to fake. Start
> follows the page's existing convention and lands on `#book`. **The moment a provider
> exists, that `href` is the only line that changes.**
>
> **6 · "THE CARDS ARE NOT SWIPEABLE" — the overlay's inner scroller needed telling.**
> `overflow:auto` alone lets a phone chain the drag to the locked body, which reads as
> a panel that will not move. Three properties fix it and all three are asserted:
> `overscroll-behavior:contain` keeps the gesture inside the panel, `touch-action:pan-y`
> hands the browser the axis outright, and `data-lenis-prevent` keeps Lenis off it even
> though this page is `smoothWheel`-only today. ⚠️ **VERIFIED IN CHROMIUM, NOT ON A
> REAL iOS DEVICE** — these are the standard fixes and the mechanism is measured, but
> nobody has put a thumb on an iPhone.
>
> **7 · THE TRAY IS DOWN AT REST IN BOTH THE PAGE AND THE LAB.** The lab's resting bar
> carried "four questions · about ninety seconds", a promise borrowed from the
> four-question flow in `programme-lab.html` and simply untrue on a one-question
> screen — and a bar that is up before there is an answer only repeats the lede above
> it. Nothing chosen, nothing there.
>
> **8 · TWO MARKS WERE REPLACED after the hide-labels test, and both were his calls.**
> **Musculoskeletal Injury** was a straight shaft interrupted by a circle and read as a
> pin or a valve; it is a **bent limb with its joint** now, because the BEND is the
> whole thing that says joint. **Sexual Health** was two interlocking rings and read as
> "pairing"; it is a **flame** now, against the card's own copy — *"desire and function,
> restored"*. ⚠️ **THE FLAME IS THE ONE MARK THAT LEAVES THE BEAD-AND-BOND VOCABULARY**,
> which the lit core at its centre is there to tie back. If a later round wants the set
> pure, that is the one to revisit.
>
> **9 · QA — 219 checks across four harnesses, all green.**
> `peptide-page.mjs` **46** · `services-choice.mjs` **64** · `goals-lab.mjs` **109** ·
> `programme-lab.mjs` **96**. New assertions worth keeping: the + is measured to be in
> the corner rather than trusted to be; the popup is proved to be a real scroller that
> actually moves and carries all three touch properties; and "add to your programme" is
> walked end to end — it adds the goal, closes the panel and raises the tray.
>
> **10 · ⚠️ STILL HIS, AND UNCHANGED FROM ROUND 12:** whether 1,150 includes VAT ·
> chapter 05's seven steps now duplicating the panel's five on one page · the
> "For women" / "For men" split he asked to leave for later · and payment.


> ## ROUND 12 — 2026-08-16: the eight stop being a list. Section 04 becomes the
> choice, and the page grows a programme panel
>
> **THIS IS THE FIRST ROUND THAT TOUCHED `index.html` SINCE ROUND 11, and everything
> before it in this arc was labs standing beside the page.** Three labs were built to
> decide three things, all three are committed, and all three are still the reference
> for *why* the page looks the way it does:
> `programme-lab.html` (the intake in three shapes) · `goals-lab.html` (one question,
> eight presentations) · and the harnesses `tools/qa/{programme-lab,goals-lab,services-choice}.mjs`.
>
> **1 · THE VOCABULARY, WHICH IS THE DECISION UNDER EVERY OTHER DECISION.**
> **You START a PROGRAMME · the doctor WRITES your PROTOCOL · the CONSULTATION is the
> hour inside it.** "Book a consultation" was wrong by four steps and the proposed
> "book a protocol" was wrong by five — worse, because someone who thinks they bought a
> plan and finds a questionnaire and a blood draw has been baited harder. ⚠️ **STEP 1
> OF THE CLIENT'S OWN SEVEN ALREADY READ "Book your programme"** — the word was on the
> page the whole time. The harnesses assert it: no control anywhere says
> "consultation", and the rail's row 5 does, which is the first moment it is true.
>
> **2 · EIGHT GOALS, ONE PROGRAMME — his call, and it rules the whole design.** Same
> process, same panel, same price for all eight, so the choice is recognition and
> routing, not a product decision. That is why it is MULTI-SELECT, why there is no
> comparison UI, and why ⚠️ **THE LEDE UNDER THE HEADING IS LOAD-BEARING RATHER THAN
> DECORATIVE**: it is the only line on the page telling a reader they may pick more
> than one and that picking three costs no more than picking one. Remove it and the
> grid reads as eight products to choose between.
>
> **3 · SECTION 04 WAS UPGRADED IN PLACE, NOT DELETED AND REBUILT — and that was the
> right call for three reasons that are invisible on the rendered page.**
> ⚠️ **`id="services"` IS LOAD-BEARING**: the chain scene's Skip control lands there.
> ⚠️ **THE GROUNDS ALTERNATE** and removing a chapter has inverted the tail before.
> ⚠️ **EACH TILE WAS NEVER A NAME AND A LINE.** Every one carries a `<template>` with
> two paragraphs, four "common goals" chips and a route into the doctor chooser —
> roughly a thousand words that a delete-and-rebuild would have thrown away.
> What each tile gained: a **mark** and a **select surface**. What it lost: its teaser
> sentence, which is not mourned — every one was a shorter paraphrase of the popup's
> own first paragraph, still there in full.
>
> **4 · ⚠️⚠️ THE HIT AREA MOVED, AND THAT REVERSES A DELIBERATE DECISION.** Until this
> round `.px-open::after{inset:0}` made the WHOLE tile the + button — tap anywhere,
> read more — and the stylesheet said so on purpose. The tile is now a CHOICE as well
> as a door and both cannot own the same pixels. **His pick: the tile selects; the +
> keeps its own target, enlarged from the 32px circle to a 44px box** (the circle still
> DRAWS at 32, via `::before`). **Restoring the stretch silently makes the goals
> unselectable and every content assertion still passes** — which is why
> `services-choice.mjs` checks 4–6 assert the swap in BOTH directions: the body selects
> and does not open, the + opens and does not select.
>
> **5 · THE TRAY IS SCOPED TO THE SECTION, AND IS NOT SHOWN AT REST.** `position:sticky`
> inside `.services`, so it rides the foot of the viewport while the eight are on
> screen and scrolls away with them; fixed, it would have followed the reader through
> the doctors, the stories and the FAQ. It is the section's ONLY forward control —
> ⚠️ **THERE IS DELIBERATELY NO CONTINUE BUTTON.** One opened the same panel forty
> pixels away, and in a full flow it would be a second forward path beside the tray's,
> which is the escape hatch that cannibalises the sequence it sits inside.
> The tray is also what makes a compact presentation viable at all: measured across the
> goals lab's eight views with three goals chosen, the LAYOUTS show 3 of 3 — except the
> shelf, which shows 1, and the index, which shows 2 because eight ruled rows do not
> fit a laptop screen. Neither is a defect once the answer lives in the tray.
>
> **6 · THE PANEL OPENS INTO THE PAGE'S OWN `.pxd` SHELL, not beside it.**
> `window.__openPxd` / `window.__closePxd` are exposed from that controller, so the
> programme panel inherits the scrim, the Lenis stop, the body lock, Escape, the scrim
> click and the focus return. ⚠️ **Start CLOSES THE OVERLAY BEFORE IT SCROLLS to
> `#book`** — a fixed overlay cannot be scrolled out of, the same rule the tiles' pill
> already followed. ⚠️ **THE PANEL'S CONTENTS DO NOT EXIST UNTIL IT IS OPENED** (they
> are cloned from `<template id="prog-panel">`), so every binding is DELEGATED — the
> trap the mock-booking guard fell into in round 4 and the chooser's portraits fell
> into in round 11.
>
> **7 · "NOT INCLUDED" BECAME "WHAT YOU CAN ADD", and that reframe is his.** The same
> four facts land in opposite directions: omission becomes option. It splits in two and
> **the split is the design** — **ADD NOW** is the home collection, a real toggle with a
> real price that moves the total; **PRICED AFTER YOUR CONSULTATION** is the peptides
> and the supplements, which are ⚠️ **NOT checkboxes, because a checkbox nobody is
> allowed to tick is worse than a sentence.** They sit as a promise instead, in his own
> words. ⚠️ **THE PANEL IS NOT A CHECKOUT: three controls, and check 13 counts them.**
> Every extra control there is another chance to hesitate at the last moment.
>
> **8 · THE MONEY, AND WHAT IS STILL NOT SETTLED.**
> `AED 1,150` — the programme. His confirmation: *"1150 is for the book the program."*
> **THIS IS THE FIRST PRICE ON THIS PAGE. A number is a commercial statement.**
> `AED 1,950` — home blood sample collection, Dubai. His figure, 2026-08-16: a team or
> a nurse comes to their home and takes the sample for whichever tests are required.
> ⚠️ **AED 350 STOOD HERE FOR ONE COMMIT ON THE BRANCH AND NEVER REACHED MAIN.** It was
> invented to make the mechanic demonstrable and carried a "price tbc" tag; asking
> before pushing is the only reason the public site never saw it. Nothing on the page
> is marked tbc now, and check 11h asserts that it stays that way.
> ⚠️ **VAT IS NOT COMPUTED IN THE PANEL — his call: "show 1,150 only, VAT line at
> checkout."** Three rows of tax working turns a summary into a receipt. The TOTAL is
> kept (1,150 alone, 3,100 with the collection) because the add-on gives the panel two
> numbers and a reader should not be made to add them; VAT is stated as a fact on one
> line. ⚠️ **WHETHER 1,150 IS VAT-INCLUSIVE OR THE BASE IS STILL NOT ON THE RECORD.**
> It is the sort of thing a customer disputes after paying.
>
> **9 · THE JOURNEY, IN HIS WORDS, AND THREE OF THESE CORRECTED WHAT WAS BUILT:**
> · **MEDI-X IS TELEHEALTH.** There is no place to visit; the consultation is online and
>   the panel says so plainly.
> · the assessment is a **WEB QUESTIONNAIRE** — not a PDF to complete and send back.
> · the home collection is **A TEAM OR A NURSE WHO COMES TO THEM** — not a kit.
> · the doctor's read is **SAME DAY OR NEXT DAY** — not 48 hours. Submit today, book
>   tomorrow at the earliest.
> · blood work happens **at any laboratory, from the exact panel we send** — peptide
>   work asks for markers a standard panel leaves out, which is why the list matters.
> · **THE DOCTOR IS CHOSEN WHEN THE CONSULTATION IS BOOKED**, not during selection.
> · the cycle is **two months, then a renewed consultation and a new blood test** —
>   which is the loop, confirmed in his own exclusions copy.
>
> **10 · THE EIGHT MARKS ARE DRAFT AND THEY ARE MINE.** Beads and bonds — the chain
> scene's own vocabulary — arranged eight ways: a shield turned inward · a network
> inside a head · a coil · a descent to a line · strands rooted through skin · a shaft
> interrupted by its joint · a spiral · two rings crossing. Outline only, one stroke
> weight, no fills: the line held against medical clipart, which is the look this page's
> restraint buys distance from. ⚠️ **THE ONLY TEST FOR A MARK IS "HIDE LABELS" IN
> `goals-lab.html` — cover the names and try to name them.** Two failed that test on
> the first pass and were redrawn (a balance that read as a crane, two bone-ends that
> read as a needle). ⚠️ **TWO ARE STILL UNRESOLVED AND ARE HIS CALL: the joint reads as
> a pin, and the two rings say "pairing" rather than "sexual health."**
>
> **11 · THE NUMERALS CAME OFF THE TILES — his call.** On a list of eight they were
> editorial furniture; on a MULTI-SELECT they implied a sequence that does not exist,
> and someone who picks 03 and 07 should not wonder what happened between. They survive
> in the popup kicker, which is a reference rather than an instruction, and check 1f
> holds them there.
>
> **12 · WHAT THE LABS DECIDED, KEPT FOR THE NEXT PERSON:**
> · **Shape A (guided flow) over B (one screen) and C (flow + skip)** — this is a
>   high-effort purchase from a brand the customer likely does not know, often from
>   another country; every step is a reason to build commitment gradually.
> · **Presentation: the marks**, over grid, index, type, shelf, pills and photographic
>   plates. ⚠️ **THE PLATES ARE THE ARGUMENT AGAINST PLATES:** eight real pictures,
>   competently cropped, still tell a visitor nothing — **there is no photograph of Auto
>   Immune Disease.** Photography works for products and places, not abstract clinical
>   categories. ⚠️ If plates are ever commissioned, `LICENSES/AI-DoorPlates.txt` already
>   forbids identifiable faces, and **the automatic crop found a face in three of eight
>   on its first pass** — that rule needs a human, not a setting.
> · **The upgrade path is SYMPTOM-FIRST** (goals lab, view 8): the customer describes
>   themselves and the page names the goal back. ⚠️ **ITS MAPPING IS INVENTED AND MUST
>   NOT SHIP** — the routing is his doctors' to write.
>
> **13 · ⚠️ TWO OPEN ITEMS, BOTH THE SAME SHAPE:**
> · **CHAPTER 05'S SEVEN STEPS AND THE PANEL'S FIVE NOW DESCRIBE ONE PROCESS TWICE ON
>   ONE PAGE.** Flagged, not touched. His call.
> · **THE "For women" / "For men" SPLIT IS STILL IN `index.html`** and the labs already
>   merged it. His call, 2026-08-16: *"keep things as they are for now, we will open
>   this later."* The merged version is option 3 of the three put to him — one card,
>   shared symptoms first, the reproductive and andropause material as two small groups.
>   ⚠️ "Basically the same thing" is true of fatigue, sleep, libido, mood and weight; it
>   is **not** true of PCOS against low sperm count, and a merged list where a man reads
>   "repeated miscarriages" is worse than the split it replaces.
>
> **14 · QA — THREE HARNESSES, 158 CHECKS, ALL GREEN.**
> `peptide-page.mjs` **45/45** (unchanged — the scene, the grade, the dialogs and the
> cool translation are untouched) · `services-choice.mjs` **58** · `goals-lab.mjs`
> **110** · `programme-lab.mjs` **96**.
> ⚠️ **FIVE MEASUREMENT LESSONS WORTH KEEPING, because each one reported a failure that
> did not exist or a pass that was not real:**
> 1. **ALPHA IS NOT OPTIONAL IN A CONTRAST CHECK.** `rgba(244,247,250,.72)` truncated to
>    three channels reports **1.01:1** on ink against a true **8.03**. Composite first.
> 2. **DO NOT SAMPLE MID-TRANSITION.** A ground that cross-fades over 550ms read as
>    `rgb(52,40,46)` at 400ms — ink at 97% — and every ratio computed against it was
>    wrong by a plausible amount, which is worse than wrong by an obvious one.
> 3. **RELOAD AT EACH WIDTH; DO NOT JUST RESIZE.** ScrollTrigger writes pin dimensions
>    at init and does not recompute on a bare resize, so `setViewportSize` alone
>    reported a 1440px document at a 1280 viewport.
> 4. **ASSERT GEOMETRY, NOT TEXT, FOR ANYTHING THAT STACKS.** Two `<span>`s left inline
>    set the doctor's name and specialism on ONE line and dropped the margin silently;
>    every text assertion passed.
> 5. **`margin:auto` IS LOAD-BEARING ON A `<dialog>` AND A `*{margin:0}` RESET EATS IT.**
>    Both labs' modals opened pinned to the top-left while every content check passed.
>    Measure the box.
> ⚠️ **AND ONE ARCHITECTURE LESSON THAT COST A REBUILD: JS TOGGLES STATE, IT NEVER
> SUPPLIES CONTENT.** The first programme lab generated every control from arrays via
> `innerHTML` and rendered four headings wherever script did not run. Every lab now
> authors its markup and is verified with `javaScriptEnabled:false`.


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
