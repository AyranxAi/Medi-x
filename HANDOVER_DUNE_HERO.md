# The dune hero — the record, /testosterone-top-up/, 2026-08-29

**This began as a complaint about one line being invisible and ended with the line gone,
the figure replaced, and the replacement stripped back to two marks.** Everything here
shipped the same day. The scroll scene below the hero was never touched.

---

## ⚠️ WHAT HAPPENED, IN ORDER — THE PART WORTH READING

**His finding started it:** *"the line is kinda being hidden by the message so its really
hard."* He was right, and the cause was measurable rather than a matter of taste:

- the Slope figure sat at **64% of the viewport height on desktop and 76% on a phone** —
  directly under the sub, the pills and the scroll hint;
- `.hero::after`'s **radial wash**, which existed to keep the copy legible over that
  figure, was wiping out most of the band's contrast before the eye reached it;
- and the figure itself was a **1.6px line at 46% alpha inside a 7% band** — the estate's
  discipline, which works in open space and disappears under type.

**The wash and the figure were in a fight the wash was always going to win.** That is the
sentence worth carrying forward: any hero that puts a drawn figure under this copy column
will need a wash, and the wash will bury it. The fix was not to strengthen the line.

**Round 1 — a 22-concept board, nothing built.** Two groups: A–F recomposed the line
(clear the stage, split hero, underline, inside the band, vertical range, magnified line);
G–M kept the physiology but changed the picture (morning, the level, the panel row,
contours, the point, type-as-figure, the twenty-year axis). Four ideas were **argued
against on the board rather than shown**: the molecule (the FAQ spends a whole answer
fighting *"is this steroids"*), any wave or pulse (that is the women's doors' grammar),
the gauge-and-needle (the vocabulary of the optimisation clinics this page is not), and
photography (his standing call of 2026-08-19).

**Round 2 — nine more, off the chart entirely,** after he asked for ideas that were not
lines: the dawn room, the eclipse, a dark cloth, stone, growth rings, a plumb line, a
drop, giant type, and the dune. His calls at that point, all still binding: **the scroll
scene stays exactly as shipped**, the field is open, tech is per-idea, and the clinical
claim may live in the picture *or* in the copy.

**He picked the dune.** It was built at full hero scale — real copy, real type ramp, real
buttons — before anything touched the page.

**Then three corrections, each of which improved it:**

1. **The sun was hidden; he wanted it risen.** *"i want it revealed not hiden i want it
   risen like an idea."* My first build tucked the sun half-behind the crest on screens
   under 1024px — a conservative fix for a real measured collision (at desktop height the
   sun core sat behind the sub text). His instruction is the better image and is now the
   rule; the collision is solved by **position** instead, at x .80 in the step of sky
   above the crest.
2. **The ruled lines came off the sand.** *"remove the lines on the dune ------ thats
   weird i dont want it."* Nine faint stroked ripples read as ruled lines, not as wind.
3. **The colour came off too.** *"there appears to be a lot of clutter on the color part
   … remove the shade thingy and just the line and the dot?"* Rather than guess how far
   that went, he got a **five-rung reduction row** — A as it stands · B no shading · C one
   dune · D a whisper of sand · E line and dot — and picked **E**.

---

## WHAT IS LIVE NOW

The hero draws **three things**: the page's two-stop ivory ground, the risen sun, and the
crest curve. That is all.

| gone | kept |
|---|---|
| the sky band, both back ridges | the two-stop ground `#FBF8F2 → #F6F1E8` |
| the sand fill | the crest curve, gold at 45% |
| the rose morning shadow, the warm lit face | the sun, core + halo at 70% strength |
| the grain, the travelling sheen | the 11 s breath; the still at 21.7 s |
| the wind ripples | `#silk` as the canvas id |
| `.hero::after`'s radial wash | the foot fade, moved to 78%, landing on `--ivory` |

> ⚠️ **Read the reduction as deliberate, not unfinished.** Every removed layer was built,
> seen at hero scale and taken out on purpose. Anyone reinstating one is starting a new
> round, not fixing an omission — and the reduction row is where that round starts.

**Three rules are written into the hero script's header comment and should survive edits:**

1. **The canvas id stays `#silk`.** The CSS and the catch-block fallback know it by name,
   and `doors-shots.mjs` asserts on it.
2. **The sun is risen, never hidden** — his words, in the file.
3. **No strokes on the sand, ever.** If texture is ever wanted again it has to come from
   tone. (Moot while there is no sand, and the reason it is moot is worth keeping.)

**Motion is now carried by one thing only:** the sun's halo breathing on an 11-second
sine. The ~80-second sheen went with the sand. `doors-shots.mjs` still passes *"hero canvas
is alive"* on that alone — verified, not assumed.

---

## ⚠️ A CORRECTION HE CAUGHT, AND IT WAS MINE

He asked: *"its not how it works anymore right? its book a free discovery call — is it in
our notes or not?"*

**It is in the notes, and the live page has been right the whole time.** `HANDOFF.md` §1
records his own instruction — *"for all the service page replace the other cta with Book
Discovery Call"* — and the follow-up where he chose the wording with **"free"** in it. The
hero's second pill is `Book a free discovery call` → `#book` on **all three doors**, and
`testosterone-top-up/index.html` carries a dated comment attributing it to the owner's call
of 2026-08-27.

**What was stale was my preview artifacts, not the page.** I read the hero markup *before*
pulling 41 commits of parallel-chat work, so the dune preview and the reduction row both
showed the retired `How it works` pill — and, less visibly, the **old hero sub**. The live
sub is now *"Medically supervised testosterone therapy, tailored to your individual results
and monitored throughout your treatment."* Both previews have been corrected.

> **The lesson, and it has now cost something twice: fetch `main` before building, not
> just before pushing.** The local checkout was 41 commits behind when this round started.
> The hero block itself was untouched by those commits, which is luck, not process.

---

## QA

`tools/qa/trt-page.mjs` and `tools/qa/doors-shots.mjs` — **both green**, run after every
change in this round, including *"hero canvas is alive"* and no sideways scroll at nine
widths.

Two things that will trip the next person:

- **Both harnesses want port 8123**, which a local static preview server also wants. Stop
  the preview before running QA, or the harness dies on `EADDRINUSE` with a stack trace
  that says nothing about ports until the very last line.
- They need `npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4` and a
  `CHROMIUM_PATH` pointing at the local headless shell.

---

## OPEN — his to answer

1. **The sun's halo at the thin end.** E keeps a small warm halo, because a bare dot on
   flat ivory reads as a full stop rather than a sun. If *"just the dot"* meant no halo at
   all, it is a one-line change — but it is his call, not mine.
2. **The crest curve's shape is inherited, not chosen.** It was drawn to sit under a full
   dune with ridges behind it. Alone on the ground, its height, its peak position and how
   far it runs off both edges are all now legible as a single gesture, and none of the
   three has been reviewed since the sand came off.
3. **Whether the hero still needs to carry the clinical claim.** The dune never did — the
   claim lives in the sub, in scene beat 4 and in the turn paragraph, and `trt-page.mjs`
   asserts it survives somewhere in the copy. Flagged because the old Slope hero *did*
   carry it in the picture, and that was once considered the point of the figure.

---

## The artifacts, for the trail

- **The 22-concept board** — every idea from both rounds, live-drawn in the page's tokens
  with the real copy on top, plus the four ideas argued against.
- **The dune at hero scale** — the full-size preview the pick was made from.
- **The five-rung reduction row** — A–E, one horizontal row, click any frame to stand it
  up at hero scale. **This is the file to reopen if the reduction is ever revisited**; the
  rungs either side of E are already built.

Their URLs sit with the chat that produced them, and with the memory note
`medi-gyn-trt-hero-board`.
