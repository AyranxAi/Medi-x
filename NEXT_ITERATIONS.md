# Where to pick this up — written 2026-08-24, after the lite-petal round landed on `main`

`HANDOFF.md` and `HANDOVER_PROCESS_SCULPTURE.md` are the **record**: what was built and why,
newest first. **This file is the opposite** — it is what is still open, what is settled and must
not be re-opened, and what to run before you believe anything. Read it first, then go to the
record for the reasoning behind whatever you are about to touch.

**`main` carries the lite-petal round** — commit *"The plate carries the name, the column
carries the words"*. The audit branch `claude/medi-x-audit-updates-wuz6rd` was merged into it
as a fast-forward, so the two point at the same history and either name is fine to build from.

---

## 1 · What is live

**Eight pages, all zero-build.** No bundler, no framework, no install step: each page is one
`index.html` with its CSS and JS inline, served as-is. Open one in a browser and that is the
site. This is a deliberate choice and everything below assumes it.

| | flower | doctors chapter |
|---|---|---|
| `/hormone-therapy-bhrt/` | ✅ | ✅ |
| `/modern-menopause/` | ✅ | ✅ |
| `/testosterone-top-up/` | ✅ | ✅ |
| `/functional-medicine/` | — | ✅ |
| `/peptide-therapy/` | — | ✅ |
| `/hormone-balancing/` | — | — |
| `/` (home) | — | — |
| `/programs/` | — | — |

**The three pages with the flower are "the doors".** They share the process sculpture and are
reached from `/hormone-balancing/`, which is the hub above them.

**The doctors chapter carries exactly one `Book a consultation`** on each of its five pages — his
call, done. It sits under the grid as `.docs-cta`, not on the cards. Each doctor's own popup
keeps its own `.pxd-cta`; that one is not the pill he was counting.

---

## 2 · The three contracts. Break one and the flower breaks quietly

⚠️⚠️ **BYTE-IDENTICAL BLOCKS ACROSS THE THREE DOORS.** The sculpture lives between
`PS:CSS:START…END`, `PS:HTML:START…END` and `PS:JS:START…END` markers, and those three regions
must be **md5-identical on all three doors**. Edit one door, then copy the block to the other
two. Verify before every commit:

```bash
for p in hormone-therapy-bhrt modern-menopause testosterone-top-up; do
  for b in CSS HTML JS; do printf "%-22s %-4s " "$p" "$b"
    sed -n "/PS:$b:START/,/PS:$b:END/p" "$p/index.html" | md5sum | cut -c1-12
  done
done
```

As shipped: CSS `4d192d81e3e8`, HTML `c292a500add1`, JS `786e22822822`. **Three matching rows per
block or you are not done.** A one-door "quick fix" is how the three drift apart, and nothing
warns you — the pages each look fine alone.

⚠️ **THE SCRIPT TRADES SEATS; IT NEVER WRITES COORDINATES.** Six polar seats are defined in CSS,
keyed by `data-slot` — `--pang`, `--prad`, `--pw`, `--pa`, `--pz`, `--prot`. The script only
swaps which petal holds which `data-slot`, plus whole turns in `--pturn` / `--protturn`. **If you
find yourself computing an angle in JavaScript, stop** — the geometry is the stylesheet's, and
putting it in two places is what the slot map exists to prevent.

⚠️ **`ps-card-p` AND `ps-card-cta` ARE DELETED, NOT HIDDEN.** The plate carries a step's number,
name, rule and duration. **Prose on the plate is the thing this round removed** — see §4.

---

## 3 · Verifying anything

```bash
node tools/qa/process-sculpture.mjs   # the flower: geometry, grade, header, three doors × two widths
node tools/qa/doors-shots.mjs         # the three doors: 13 widths, sideways scroll, reduced motion
node tools/qa/doctors-pill.mjs        # one pill per doctors chapter, five pages × three widths
node tools/qa/bhrt-shots.mjs          # the BHRT page end to end
```

⚠️⚠️ **RUN THEM ONE AT A TIME, AND NEVER BELIEVE A FAILURE FROM A PARALLEL RUN.** They each drive
a headless browser painting through SwiftShader — **software WebGL, on the CPU**. Two at once
starve each other, and what starves first is every assertion timed on the wall clock rather than
on state. It cost a cycle in this very session: the sculpture's header check drives a scroll in
40ms steps and reads the bar 900ms later, and under contention it returned **`hdr--hidden` still
set on one door and a mid-transition `rgba(0,0,0,0)` background on another. Both were false** —
run alone, the same commit was green on all six page/width pairs. The warning is now at the top
of `tools/qa/README.md` too.

⚠️ **THE ORACLE FOR THE FLOWER IS `?step=N`.** Opening a step directly performs no turn, so the
frame you get **is the composition as designed**. Any step reached by *clicking* must match it
pixel-for-pixel outside the words. That comparison is the gate he made the last push conditional
on, and it is the only check that has ever caught the real bug:

```
desktop steps 1-6:  0.00%  match
phone   steps 1-6:  0.00%  match
```

⚠️ **A HARNESS THAT PASSES IS NOT THE SAME AS A HARNESS THAT LOOKS.** Two of these were asserting
a dead selector for weeks — counting `.pg-steps li` for "six programme steps" after the flower had
moved that list into `<noscript>`, whose contents are one text node once JS runs. They returned
**0, called it fine, and stayed green**. They now count `.ps-arm` and read the `<noscript>`
rollback separately. **When you add an assertion, make it fail on purpose once** before you trust
it.

---

## 4 · Settled. Do not re-open without asking him

- **The 4-week mentorship line stays off the Included list.** I recommended restoring it. His
  answer: *"it is given to me by the owner they have removed it for a reason."* That is a
  decision from outside this repo and it **outranks the recommendation**. The reasoning in the
  earlier note is still true and still does not change the answer.
- **The plate carries the name; the column carries the words.** His call off a rendered
  side-by-side. The plate's capacity changes with the screen — **15 words on a phone against 25
  on a desktop** — so a sentence on it had to exist twice, and the second version was a rewrite,
  not a trim. The column is the same box on both. **Every word on the six steps is now his**, and
  a new line from him is one line of work.
- **Ground `#F0EBE7`, petals `#FAF7F1`.** His: the flower's old cream becomes the ground, and the
  flower takes the scrolled header's ivory. Separation 1.107 with the sign flipped — **the petals
  are now the lighter of the two.**
- ⚠️ **`.ps-eyebrow` USES `--gold-gloss`, NOT `--gold-deep`, AND THAT IS LOAD-BEARING.**
  `--gold-deep` measures **4.233 on the new ground against a 4.5 floor** for 13px uppercase.
  `--gold-gloss` is 4.805. The repo already documents gloss as "a function of the ground" — it
  moved because the ground moved. Putting `--gold-deep` back fails contrast silently.
- **Step 05 is "BHRT Prescription" on all three doors**, including the two that are not BHRT. Not
  raised in his last reply, and the parity contract wants it uniform. Forking it is the first
  crack; if he wants it per-door, that is a copy decision and needs his word.
- **Sentence case on headings** — "Blood work", "Choose your doctor". British spelling
  ("personalised") throughout.

---

## 5 · Open, roughly in the order I would take them

**a · `/functional-medicine/` is three hops from home, and only through a door.** Measured on the
actual markup: home links to `hormone-balancing` and `peptide-therapy` only; the hub links to the
three doors and `peptide-therapy`; **the only pages linking to `functional-medicine` are the three
doors.** Every other service sits at depth 1. It may be deliberate, but it does not look it —
worth putting to him as a question, not a fix.

**b · `/programs/` is an orphan.** "Booster Programs", 16K, last touched in the section-04 round,
and **nothing on the site links to it and it links nowhere.** Establish whether it is a shipped
page that lost its entry point or a lab leftover that should move to `archive/`. Do not delete it
on your own reading.

**c · Four controls are deliberately inert, and the list is worth re-checking with him.**
`README.md` names them under *Deliberately unwired controls* — **Book consultation**, **Join
menoSTART**, **Hormone quiz** and **Newsletter Join** — and tells you plainly **not to "fix" them
by pointing them at placeholder URLs.** Honour that. The WhatsApp number is a placeholder too
(`wa.me` TBC, noted at `index.html:4362`). ⚠️ **This is a status question for him, not an
engineering task**: the destinations were "still being designed" when that list was written, and
it is worth asking which of the four have landed since. The newsletter is the one that costs
something while it waits — a visitor types an address, presses Join, and **nothing happens and
nothing tells them so** — so if Zoho is still not ready, that one is worth raising specifically.

**d · The flower is on three of the five doctor pages.** `/functional-medicine/` and
`/peptide-therapy/` still run the flat `.pg-steps` list. Porting is a known quantity now — it is
the three blocks plus the chapter markup — but **their steps are different content**, so it is a
copy round with him before it is an engineering one. Do not port his BHRT words onto a peptide
page.

**e · Consider making the harness assertions state-driven rather than clock-driven.** §3's false
failure is a defect in the gate, not in the page. The header check is the worst offender: it
sleeps 900ms and reads. Waiting on the class *and* a settled computed background would make it
honest under load. I left it alone deliberately — changing what the gate measures immediately
before a push is how you lose the ability to trust the push.

**f · `README.md`'s Architecture section describes the site as one file.** It was written when
`index.html` *was* the site; there are eight pages now. I put a warning above it rather than
rewriting it — the section's substance (zero-build, zero-dependency, one self-contained file per
page) is still exactly right, and only its file tree and its "single-page" framing have gone
stale. **Rewriting it properly means describing the hub-and-doors structure**, which is a
half-hour of prose and worth doing next time someone is in that file anyway.

---

## 6 · Things worth knowing before you touch the sculpture

⚠️⚠️ **THE 3D LAYER USED TO STOP RENDERING BEFORE THE DOM STOPPED MOVING, AND IT LOOKED LIKE A
LAYOUT BUG.** `dirty` was derived by hashing box rects; at the tail of an ease-out, boxes move
sub-pixel amounts, two consecutive frames hash the same key, `dirty` goes false, `busyUntil` has
passed, and `raf` is never re-scheduled. **The canvas parks on a mid-turn frame permanently** —
which is exactly what he saw and reported as *"why is the one with the red not on the right
side?"*. It is fixed by a capturing `transitionend` / `transitioncancel` listener on the stage
calling `wake(140)`. **If petals ever look misdirected again, suspect the render loop before the
geometry.** I blamed the geometry three times and was wrong three times.

⚠️ **DO NOT MATCH MAROON BY "RED IS THE BIGGEST CHANNEL".** The taupe cast shadows satisfy that
too. The backing petal is `#4E1A28` — its tell is **blue above green**, which the shadows do not
have. A detector without that test reports maroon everywhere and tells you nothing.

⚠️ **`overflow-x: clip`, NEVER `hidden`, ON `.ps`.** `.ps-gl` is `inset:-18%; width:136%` on
purpose — the bleed is what makes the petals feel unbounded — and nothing else stops it at the
page edge. `hidden` on one axis forces `overflow-y:auto` on the other and turns the section into
a scroll container; `clip` leaves the other axis `visible`. **This shipped broken at ten of
thirteen widths, desktop included**, because the width sweep had not been re-run since the
sculpture landed.

⚠️ **THE FLOOR OF A `clamp()` IS WHAT BITES, NOT THE CAP.** `cqw` resolves against
`.ps-stagewrap`, and the plate is `66cqw` on desktop *and* phone, so one rule serves both — but
only if the floor sits under what the phone actually computes (350 × .066 ≈ 23px). A 30px floor
inherited from the old paragraph card overran the 231px phone plate. As shipped: **43px desktop,
23px phone, zero spill on all twelve frames.**

⚠️ **THE COLUMN'S CTA IS SIZED IN `vw`, NOT `cqw`.** It sits outside the stage's container, where
container units resolve against the viewport and swing between the two layouts. It is also **one
element re-labelled per step**, built by the script so `<noscript>` stays untouched — one element
and not six means a keyboard user's focus ring never lands on a button belonging to a step they
cannot see.
