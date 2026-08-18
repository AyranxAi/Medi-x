# Functional Medicine — `/functional-medicine/` (first ship 2026-08-18)

> # ▶ START HERE — STATE OF PLAY AT THE END OF ROUND 3
>
> **The page:** `/functional-medicine/index.html` — single file, zero build, ~5,250 lines,
> adapted whole from `/peptide-therapy/index.html` at its round-19b state. Open it with any
> static server; there is nothing to compile.
> **His brief, verbatim in spirit:** hero for functional medicine · "what is functional
> medicine" with an animation explaining it · cards showcasing the services · the doctors ·
> Irina's discovery call · the footer. He picked **the web → the root** for the scene and
> **the full sibling structure** (testimonials + FAQ stay) off a four-way question.
> **QA:** `tools/qa/fm-shots.mjs` — a screenshot pass plus ~20 smoke checks (beats, ring,
> tray, panel arithmetic, overflow sweep 1440→360, phone flip), all green. It is NOT the
> page's full harness; writing one on the pattern of `peptide-page.mjs` is the natural
> next round once copy is signed off.
>
> **⚠️⚠️ THE FOUR THINGS A NEW CHAT SHOULD KNOW FIRST:**
> 1. **THE EIGHT SERVICE NAMES ARE DRAFT, UNLIKE EVERY OTHER PAGE IN THE ESTATE.** The
>    live site's Functional Medicine menu could not be reached from the build environment —
>    medi-gyn.com is egress-blocked, and search snippets exposed the page's prose but not
>    its menu. The eight are assembled from the client's own recovered vocabulary: his
>    pathway card ("Root causes, found and treated" / "metabolism, digestion, thyroid
>    health and inflammation") and his chips (gut issues, weight changes, persistent
>    fatigue, hair thinning). **Swap his menu names in verbatim the moment they arrive** —
>    the names live in three places per card (data-goal, front h3, back h3) plus the
>    stories' attributions.
> 2. **AED 1,150 IS CARRIED, NOT VERIFIED.** The client's booking screen lists
>    consultations at AED 1,150 / 1h and the sibling sells the same consultation at that
>    figure — but the live Functional Medicine consultation product page exposes no price
>    to search, and the site itself is unreachable from the sandbox. **He was asked to
>    confirm.** If the FM figure differs, two places change: the panel's `.pg-amt` line and
>    `BASE` in the tray script. The ⚠️ comment sits on both. Never invent a figure — the
>    sibling's AED 350 incident.
> 3. **TWO CARDS HAVE NO PHOTOGRAPH AND THAT IS A DESIGNED STATE, NOT A GAP.** Thyroid
>    Health and Fatigue & Energy stand on the ring's gradient plate with their own line
>    marks (a thyroid gland and a cell-with-spark, drawn in the house 48×48 stroke
>    grammar). The other six reuse the estate's pathway photographs where the subject
>    genuinely matches (villi→gut, lipid droplets→weight, antibodies→inflammation,
>    neurons→brain fog, follicles→skin & hair, DNA→healthy ageing). A photograph is a
>    `data-art` file-drop away — the probe-Image guard is inherited.
> 4. **EVERYTHING STRUCTURAL IS THE SIBLING'S, DELIBERATELY.** The ring, the tray, the
>    panel, the doctors (all four, client copy untouched), the pxd shell, the footer, the
>    grounds alternation (define dawn · services ivory · docs dawn · stories ivory · faq
>    dawn · final ivory · footer cream), the reduced-motion fallbacks — verbatim lifts.
>    Every ⚠️ in the source that names the peptide page is inherited history that still
>    governs here; where a comment became untrue on this page it was corrected in place.
>    **If the sibling's ring changes, this ring should follow** — there is no parity
>    harness between the two yet, and that is a real gap worth closing.
>
> **⚠️⚠️ ROUND 3 (2026-08-18) — TWO CALLS: LETTER O, AND MS. RICHA PURI.**
>
> **1 · THE SCENE IS THE ALIGNMENT NOW (letter O), AND THE RIVER IS GONE — HE READ IT AND
> HE WAS RIGHT: *"that looks like a pandemic."*** Branching channels with travelling
> particles converging on one node is the visual grammar of a TRANSMISSION MAP — flight
> paths, spread diagrams, contact tracing. The mechanism was sound; the association is
> fatal on a clinic page. ⚠️ **RECORD THIS AS A TEST, NOT AN ANECDOTE: every figure on this
> estate should be asked what ELSE it resembles before it is built.** Nothing in any
> harness could have caught it — every check was about position, contrast and overflow, and
> not one about what the picture reminds a person of. (It is the same class of miss as the
> peptide ring running upside down: the geometry was right and the meaning was wrong.)
> ⚠️ **AND HIS FIX WAS BETTER THAN THE CATCH.** His instruction was to reuse the hero's
> language — *"the same idea from the system in the hero where in the center is the root"* —
> which was also the first concept board's own recommendation (*pick one language and speak
> it twice*). So:
> · **THE SCENE IS NOW THE HERO'S OWN UNIVERSE.** Same generator, same seed (424242), same
>   five tilts and speeds. ⚠️⚠️ **TWO COPIES OF ONE FACT IN ONE FILE — if the hero's `RINGS`
>   block is ever re-seeded or re-tuned, THE SCENE'S MOVES WITH IT**, or the page silently
>   stops telling one story twice. Cross-referenced at both sites, the arrangement `--dawn`
>   and `BG_B` already live under.
> · **WHAT HAPPENS:** the five systems arrive one at a time on scattered tilts, each with a
>   travelling light; the gold beat names the failure while they are still scattered (*"read
>   alone, every result looks normal"*); then orbit by orbit each swings into ONE SHARED
>   PLANE and each light slides onto ONE SHARED RAY — disorder resolving into a line that
>   points at the nucleus. The dawn rises from that point; "The source" lands inside the ring.
> · ⚠️ **NOTHING IS ELIMINATED AND NOTHING SHRINKS — all five systems are on screen at the
>   end.** That is *why* O was picked over the subtractive letters (M/P/R on the second
>   board): functional medicine's own claim is that everything is connected, so a scene that
>   deletes four systems argues against the definition two screens above it. **Do not
>   "improve" it by fading the four** — that is letter Q and a different claim.
> · ⚠️ **THE ALIGNED ASPECT IS .30, NOT 0.** Edge-on collapses five orbits into one flat
>   line and the picture stops being a universe. At .30 it still reads as rings at a shallow
>   angle — a photograph, not a diagram.
> · ⚠️ **THE GOLD BEAT CLOSES AT .335 AND THE FIRST ORBIT SWINGS AT .34.** A beat reading
>   "read alone, every result looks normal" must not still be lit while the rings visibly
>   begin to agree. That ordering is the causality.
> · **It is the most reversible scene on the estate** — every term is a lerp of pin
>   progress, so scrubbing back genuinely un-aligns the orrery frame by frame.
>
> **2 · MS. RICHA PURI REPLACED DR. NAHLA IBRAHIM ELAWADY — HIS CALL, THIS PAGE ONLY.**
> ⚠️⚠️ **SHE IS NOT A PHYSICIAN AND THE PAGE HAD TO STOP SAYING "DOCTORS".** Richa is a
> UK-trained prescribing **pharmacist** and nutritional therapist — **"Ms.", not "Dr."** —
> so five user-facing strings moved in the same commit: the section heading (*"The doctors
> you'll meet"* → *"The specialists you'll meet"*), the chooser dialog (*"Choose your
> doctor"* → *"Choose who you'll see"*), programme step 03 (same), step 04's *"Your doctor"*
> → *"Your clinician"*, and her panel kicker (*"The specialist · Medi-Gyn"*; the three MDs
> keep *"The doctor"*). **Calling a pharmacist a doctor in clinic marketing is a regulatory
> misstatement, not a style slip** — it is exactly what a DHA review picks up.
> ⚠️ **DR. NAHLA IS NOT DELETED FROM THE ESTATE** — she is off THIS page only. Her card, bio
> and chooser row stand unchanged on `/peptide-therapy/`, and both her portraits stay in
> `images/doctors/`. Do not tidy them away.
> ⚠️ **HER PORTRAIT ARRIVED ALREADY SQUARE AND ALREADY HEAD-AND-SHOULDERS** (1200×1200, his
> upload to `main` as `images/Richa-Purinew.webp`), unlike the three full-body masters — so
> the card takes it **untouched** (git mv'd to `ms-richa-puri-square.webp`, never
> re-encoded, round 4's precedent) and only the panel head crop is baked:
> `node tools/crop-portrait.mjs images/doctors/ms-richa-puri-square.webp <out> 240 34 700 400`
> — 3.0% headroom, sitting with Eslam's 3.0% and Khalid's 3.3%.
> ⚠️ **HER COPY IS THE CLIENT'S, with three typographic corrections recorded at the card**
> (colon dropped from "Core Expertise:", unspaced em dashes spaced, "Richa's Story" →
> sentence case). Do not tighten it in passing — it has the same standing as the doctors'.
> ⚠️ **SHE IS THIRD BECAUSE THAT IS THE SLOT SHE REPLACED.** On a functional-medicine page,
> a functional-medicine specialist leading the row is an argument worth putting to him — two
> `<article>` blocks and two chooser rows swapped, and it is his call.
> ⚠️ **THE 4-UP ROW GOT EASIER, NOT HARDER:** 22px was solved for Dr. Nahla's name, the
> longest in the sibling's set; "Ms. Richa Puri" is far shorter, so the row keeps its margin
> and Dr. Andrey Komissarov is the worst case now.
>
> **⚠️⚠️ ROUND 2 (2026-08-18) REPLACED THE HERO AND THE SCENE — HIS LETTERS, F AND G,
> off the concept board ("Twelve Ways In", the published artifact). His words on F,
> recorded: *"it's a universe which has a center which is like the root and axis of
> everything."* The hero is now THE ORRERY (five tilted rings, five travelling lights,
> one gold nucleus that never moves, a hairline axis); the scene is now THE RIVER RUNS
> BACKWARD (a delta seen only downstream, the turn where the water stands still and
> reverses, the upstream travel, one spring igniting with the dawn, the phrase "The
> source" inside the opening ring). The round-1 plexus hero and web scene live whole in
> git history (round-1 ship commit) — one revert each resurrects them. Round 1's notes
> below describe them in past tense now; everything else in this file still stands.**
>
> **WHAT IS NEW ON THIS PAGE, IN ONE LIST (round 2 state):**
> · *(round 2, SUPERSEDED BY LETTER O IN ROUND 3 — read the pandemic note above)* **THE SCENE — "the river runs backward" (letter G).** Same engine grammar as both
>   siblings (pure function of pin progress, latch, seeded geometry, Replay/Skip, the
>   dawn to BG_B): act one shows only the DOWNSTREAM reaches of a watershed — streams
>   surfacing from the dark and flowing to their mouths, upstream hidden; the gold beat
>   names the failure ("Treated downstream, they come back"); then THE TURN — flow
>   direction is `1-2*ss(.38,.44,p)`, so at the window's middle the river STANDS STILL
>   for a scroll-beat (the water brightens while it holds) and reverses — the map extends
>   upstream reach by reach as `qMin` falls .55→0, tributaries merging, until the SPRING
>   is revealed at the dawn's radial centre and ignites with it. Payoff phrase: "The
>   source", inside the same opening ring.
>   ⚠️ **THE WATERSHED IS TWO-TIER BY DESIGN AND THAT WAS THE WEB'S OWN LESSON RE-APPLIED
>   — TWICE NOW, SO TREAT IT AS A RULE: plain Prim over a uniform scatter draws long
>   peripheral chains and an empty middle.** Spring → five seeded CONFLUENCES → sixteen
>   branch points (Prim, never attaching straight to the spring). Meandered edges,
>   Chaikin-smoothed paths, trunk hierarchy from deliberate overdraw (shared reaches
>   brighten with their own traffic).
>   ⚠️ **THE TURN IS DRIVEN BY p, NOT TIME** — it is the reader's own scroll, latch-safe
>   and scrub-exact. A time-driven turn would fire without them.
> · **THE HERO — the orrery (letter F).** Canvas 2.5D, zero deps: five rings (tilt =
>   aspect × rotation, depth = per-segment alpha), one travelling champagne light per
>   ring with a wake-arc, a nucleus that never moves, a faint plumb-line axis — his
>   "root and axis of everything". One orbit takes 70–120s; the vestibular rule is the
>   spec. Right of the copy on desktop (cx .70W), in the headline's air on a phone
>   (cx .74W, cy .30H). Same #silk contract, same ground stops, same catch fallback,
>   same 21.7s reduced-motion still.
> · *(round 1, superseded)* **THE SCENE — "the web → the root".** Same engine grammar as both siblings (pure
>   function of pin progress, latch, seeded geometry, Replay/Skip, the dawn to BG_B):
>   scattered symptom points drift; the gold beat names the failure of symptom-chasing;
>   the web draws itself (nodes glide home, bowed edges appear in shuffled order); a light
>   walks the web from its leaves to one node; the root ignites exactly where the dawn
>   rises; the phrase "The root cause" lands inside an opening ring — the brand's
>   ring-through-the-figure motif, drawn from the root on the canvas under the DOM title.
>   ⚠️ **THE GRAPH IS TWO-TIER BY DESIGN AND THAT WAS A FIX.** The first build scattered
>   all 21 satellites uniformly and Prim'd nearest-first — correct graph, wrong picture:
>   the root caught one spoke and the frame read as two constellations with a hole where
>   the cause should be. Now: root at centre (pinned to the dawn's radial, 50%/55%, phone
>   52%), five SYSTEM nodes on a seeded ring, sixteen signals attaching only through
>   systems or other signals, never straight to the root. Every trace visibly passes
>   through a system on its way to the cause — the discipline's own claim, drawn.
>   ⚠️ **THE TREE IS A TREE ON PURPOSE** — a web with cycles has no "back" and the trace
>   is the argument. Do not add cross-links for looks.
>   ⚠️ **THE PAYOFF PHRASE IS "The root cause", NOT "Functional Medicine"** — the segment
>   above already names the discipline, and the long title overruns a 390px stage at the
>   title's own floor. Measured before chosen.
> · *(round 1, superseded)* **THE HERO — the plexus field.** Canvas 2D signal nodes with
>   distance-faded links and champagne roots. Replaced by the orrery in round 2; in git
>   history whole.
> · **COPY.** Hero sub, definition, fallback sections, six FAQ answers, three stories and
>   all sixteen card paragraphs are **draft in his register** — route through him before
>   real marketing. Sentences that are the client's own and must stay his: "Root causes,
>   found and treated" (gloss), "metabolism, digestion, thyroid health and inflammation"
>   (hero sub), "doesn't begin with a checklist of symptoms — it begins with your story"
>   (the turn band and FAQ 2, recovered from medi-gyn.com by search).
> · **THE PANEL.** One line of the client's included list adapted ("Peptide Therapy
>   Protocol" → "Functional Medicine Protocol"); step 05's duration cell says "quoted
>   first" — the sibling's "8 weeks' supply" was HIS figure for peptides and does not
>   transfer, and no supply quantity has been given for FM prescriptions.
> · **THE BACKS FIT AT 1440 WITHOUT SCROLLING** — measured per card (the sibling's
>   standard), trimmed three times to get Gut Health from 56px over to 0.
>
> **WHAT IS STILL OPEN (all his):**
> · **The river's beat copy is DRAFT like all copy here** — the six beats now speak the
>   river's vocabulary ("streams", "upstream", "the source"); the fallback sections
>   followed. Same sign-off rule as everything else.
> · **The scene-title is "The source" now** — if the client prefers the clinical term,
>   "The root cause" fits the stage at every width (measured in round 1) and is a
>   one-line swap plus this note.
> · **The eight service names** — point 1. The single most likely thing to be sent back.
> · **The consultation price** — point 2.
> · **Photographs for Thyroid Health and Fatigue & Energy** — point 3. If the eight are
>   ever regenerated as a set, ask for the same 4:5 style the pathway masters use.
> · **Testimonials are placeholders** and the FAQ is draft — same standing as the
>   sibling's, recorded on the DOM at both sites.
> · **Payment** — inherited: `Start your consultation` lands on `#book`; the moment a
>   provider exists that href is the only line that changes.
> · **Wiring `#pxd-choose` to step 03** — inherited from the sibling, same natural next
>   round.
> · **The sibling pages' menus do not link here yet.** This page's own menu self-links
>   and routes to both siblings; pointing the peptide page's and landing page's
>   "Functional Medicine" items at `../functional-medicine/` (they currently go to the
>   WordPress site) is a two-line change on each page, and it is his call when this page
>   is approved.
> · **A real harness and a ring-parity check against the sibling** — see QA note above.
>
> **HOW THIS PROJECT WORKS** (inherited): he replies in letters off a lab; every ⚠️ in the
> source is there because something already went wrong once — read them before editing
> near them. The peptide page's HANDOVER is the deep history for every mechanism this
> page inherits; this file records only what is different here.
