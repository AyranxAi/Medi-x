# Functional Medicine — `/functional-medicine/` (first ship 2026-08-18)

> # ▶ START HERE — STATE OF PLAY AT THE END OF ROUND 1
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
> **WHAT IS NEW ON THIS PAGE, IN ONE LIST:**
> · **THE SCENE — "the web → the root".** Same engine grammar as both siblings (pure
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
> · **THE HERO — the plexus field.** Canvas 2D on the sibling's restraint palette: signal
>   nodes drifting upward, links forming within 118px and dissolving (alpha by distance,
>   no state), roughly one node in six champagne — the root, already lit; links touching
>   it draw gold. Deterministic (seed 424242), same STILL frame (21.7s), same counts-fall
>   art direction at narrow widths, same catch-block fallback pinned to the same stops.
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
