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

| | flower | returning band | doctors chapter |
|---|---|---|---|
| `/hormone-therapy-bhrt/` | ✅ | ✅ | ✅ |
| `/modern-menopause/` | ✅ | ✅ | ✅ |
| `/testosterone-top-up/` | ✅ | ✅ | ✅ |
| `/programs/` | ✅ | ✅ | ✅ |
| `/functional-medicine/` | — | — | ✅ |
| `/peptide-therapy/` | — | — | ✅ |
| `/hormone-balancing/` | — | — | — |
| `/` (home) | — | — | — |

**The returning band goes exactly where the flower goes** (2026-08-29) — it is the line
*under* the six steps and has no meaning on a page without them. Its contract is in §2.

**The three pages with the flower AND a service door behind them are "the doors".** They share
the process sculpture and are reached from `/hormone-balancing/`, which is the hub above them.
⚠️ **`/programs/` CARRIES THE FLOWER TOO SINCE 2026-08-26 but is NOT a door** — it is the
booster-programmes page, reached from the hub's `#boosters` pill, and it sells two modules of
one programme rather than one service. It is a **fourth carrier of the parity contract** in §2
all the same: an edit to the sculpture is now four files, not three.

**The doctors chapter carries exactly one `Book a consultation`** on each of the pages that
render it — his call, done. It sits under the grid as `.docs-cta`, not on the cards. Each
doctor's own popup keeps its own `.pxd-cta`; that one is not the pill he was counting.
⚠️ `tools/qa/doctors-pill.mjs` walks **five** pages and does not know about `/programs/`; that
page asserts its own one-pill rule in `tools/qa/programs-page.mjs` §5. Adding it to the
five-page walk is a one-line change and worth doing next time that file is open.

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

⚠️ **THE SUMS IN THE PARAGRAPH BELOW ARE HISTORY — see the 2026-08-29c note further down
for the live ones.** Two blocks moved that day: `PS:CSS` took a comment correction and
`PS:JS` took the slab's token reader.

As shipped: CSS `4d192d81e3e8`, HTML `c292a500add1`, JS `786e22822822`. **Three matching rows per
block or you are not done.** A one-door "quick fix" is how the three drift apart, and nothing
warns you — the pages each look fine alone.

⚠️ **2026-08-26 — `/programs/` IS A FOURTH CARRIER.** The booster-programmes page took the
flower on his ask ("the same flower for the how it works"), byte-identical, so add `programs`
to the loop above: **four matching rows per block now** (`tools/qa/programs-page.mjs` §0
asserts it on every run). Two block hashes have moved legitimately since the paragraph above
was written (HTML `95463c5391ea`, JS `d2ee51cad3aa`), and one pre-existing drift is on record:
**the men's PS:JS differs by one comment** — the fork-and-revert note of 2026-08-24g — so its
JS hash is `ab64ee862292`. Comment-only, no behaviour; erasing it to restore parity would
falsify the record, so the harness tolerates exactly two JS sums and no more.

⚠️ **2026-08-29 — THE RETURNING-PATIENT BAND IS A FIFTH BLOCK WITH ITS OWN MARKERS, AND IT
DELIBERATELY DOES NOT TOUCH THE FOUR ABOVE.** A patient already on a protocol needs two
things the six steps do not carry — a follow-up, and a repeat of her prescription — so a
compact band now sits under the flower on all four carriers: eyebrow, heading, two
outlined actions, ~232px on a desktop and ~270px stacked on a phone.

**It is NOT inside `PS:*`, and that is the point.** The three PS sums above are unchanged
by it — verify with the same loop; they still read `4d192d81e3e8` / `95463c5391ea` /
`d2ee51cad3aa` (+ `ab64ee862292` on the men's door). The band carries **`RB:CSS` and
`RB:HTML`** instead, on the same four pages, under the same rule: **four matching rows or
you are not done.**

```bash
for p in hormone-therapy-bhrt modern-menopause testosterone-top-up programs; do
  for b in CSS HTML; do printf "%-22s %-4s " "$p" "$b"
    sed -n "/RB:$b:START/,/RB:$b:END/p" "$p/index.html" | md5sum | cut -c1-12
  done
done
```

As shipped: CSS `a1ead3db21c7`, HTML `327a9675ebea`.

⚠️⚠️ **2026-08-29b — THE BAND WEARS ITS DOOR'S ORB, FROM ONE BYTE-IDENTICAL LINE.** His
round: bigger actions, and a colour behind the strip so it separates from the flower above
and the money card below — *"that color varies on what color the original orb is"*.
`background:var(--door-tint,var(--gold-tint))` does it with **no fork**: the burgundy door
serves `#F2E1E2`, the rose door `#F9E4DE`, and the gold door and `/programs/` — which
carry **no `--door` tokens on purpose** (§7 of `HANDOFF.md`) — fall through to
`--gold-tint #F1E7D2`. The eyebrow rides the same fallback on `--door-deep`. Three
distinct grounds across four pages, and `RB:CSS` stays one sum.

⚠️ **THE GROUND MOVED, SO THE CONTRAST WAS RE-MEASURED** — the rule `--gold-gloss`'s token
block states ("it is a function of the ground; anyone who darkens the ground must bring it
back") fires on any edit to that line. Measured, small floor 4.5 / large 3.0:

| | eyebrow | heading | label on the button fill |
|---|---|---|---|
| burgundy `#F2E1E2` | **9.817** (`--door-deep`) | 9.817 | 5.863 |
| rose `#F9E4DE` | **5.074** (`--door-deep`) | 10.133 | 5.965 |
| gold `#F1E7D2` | **4.632** (`--gold-gloss`) | 10.087 | 5.934 |

⚠️ **4.632 IS THE TIGHTEST PAIR IN THE ESTATE'S NEW WORK** and it is the gold pages'
eyebrow. `--gold-deep` on that ground is **4.080 and FAILS** — the same trap the flower's
own eyebrow records. Deepen `--gold-tint` and the gloss goes under too. `returning-band.mjs`
§7b re-derives all twelve numbers **from the rendered pixels**, so a token move fails the
run rather than the audit.
⚠️ **THE THEME TOUCHES THE GROUND AND THE EYEBROW, NOTHING ELSE.** Hairlines, button
borders and the heading keep the shared gold/burgundy grammar — the same exclusion the
door theme draws around the money card and the sculpture. The strip wears the orb; it does
not repaint the chapter, and §7b asserts `.programme`'s own ground is still `#F0EBE7`.

**The strip is ~232px on a desktop and ~270px stacked on a phone** since the actions grew
to 72px / 64px. Both still content height (232 is 26% of a 900 viewport) and the fold
arithmetic below is unchanged — it measures the strip's TOP, which did not move.

⚠️⚠️ **THE BAND IS NOT SETTLED — HE HAS SAID IT WILL CHANGE AGAIN (2026-08-29g).** What
changes is not decided. **Do not defend its current state as final**, and read
[`HANDOVER_RETURNING_BAND_NEXT.md`](HANDOVER_RETURNING_BAND_NEXT.md) before touching it —
it separates what is free to change (all the copy, the icons, the sizes, adding an action)
from the four things that look like taste and are not: the `margin-top` fold arithmetic,
the contrast measured on each door's ground, the `var(--door-tint,var(--gold-tint))`
fallback that keeps `RB` one sum across four pages, and the destinations, which invent no
new flow on purpose.

⚠️⚠️ **THE BAND IS NOT A SEVENTH STEP AND MUST NEVER BE MADE ONE.** Six petals, six seats,
01–06 — the count is the contract the slot map exists to hold. Nothing in the band is
numbered, nothing goes on a petal, and the progress row does not count it.
⚠️ **`.rb`'s MARGIN IS ARITHMETIC, NOT TASTE.** `.ps-grid` stands at `min(80svh,880px)`, so
a reader framing the flower from its own top has 20svh of slack underneath. `21vh` of
separation puts the band past the fold at the two heights a desktop actually is — 900
(720 + 189 = 909) and 1080 (864 + 227 = 1091). **Shorten it and the band appears inside
the flower's viewport**, which is the one thing this block was asked not to do.
Above ~1100px of viewport the flower caps at 880px and no fixed gap clears the fold
without whitespace that reads as broken; the cap stays at 240px. `returning-band.mjs`
§3 is the guard, and it fails on purpose when the margin is cut.

⚠️ **NEITHER ACTION IS A NEW FLOW, AND README's "deliberately unwired" LIST STAYS TRUE.**
Book a follow-up → `#book`, the call strip every `Book a consultation` pill already points
at; Repeat prescription → the clinic's **own** WhatsApp line, the same number and the same
deep-link form the footer and hero use. No placeholder URL was invented for either.
⚠️ **THE WHATSAPP TEXT IS THE ONE LINE THAT IS NOT PER-PAGE** — the band is byte-identical
on four carriers, and a service *request* is not a service *enquiry*, so it does not name
the door it was sent from. Forking it per door is how RB drifts.

⚠️⚠️ **2026-08-29c — THE PETAL SLAB WEARS THE ORB, AND TWO PS BLOCKS MOVED.** His call:
*"the petals have their own color on the side… making it pink or gold the same color as the
orb"*. **The live sums are now:**

```
PS:CSS   d26faf55bae9      PS:HTML  95463c5391ea
PS:JS    c9d5a3e2365d      (+ c288ab493d44 on the men's door — the 2026-08-24g comment)
```

**`PS:JS` IS STILL BYTE-IDENTICAL — the colour is not in it.** The script reads four
tokens off `:root` (`--ps-slab`, `--ps-slab-top`, `--ps-slab-mid`, `--ps-slab-foot`) and
paints both the 3D material and the SVG fallback's ramp from them. Each page sets its own;
**`/hormone-therapy-bhrt/` sets none on purpose** — it is the burgundy door and the
fallbacks *are* the shipped burgundy, so deleting any page's tokens restores the original
sculpture rather than breaking it.

| page | orb | slab | ramp |
|---|---|---|---|
| `/hormone-therapy-bhrt/` | burgundy | `#A1213B` crimson | `#D02F4F` `#AE1E3B` `#90132C` |
| `/modern-menopause/` | rose | `#C9366C` **pink** | `#D36990` `#D23770` `#BE235C` |
| `/testosterone-top-up/` | gold | `#9F7123` gold-bolder | `#CD9432` `#AC7920` `#8F6214` |
| `/programs/` | — (not a door) | `#9F7123` (shares gold) | same |

⚠️ **RE-SEATED 2026-08-29d, HIS CALL** — the crimson began on the menopause door and moved
to BHRT, because BHRT's orb is the **burgundy** one and crimson is that family; the
menopause door, whose orb is the **rose** one, took a true pink instead. Rendered
separation: crimson↔pink **56**, crimson↔gold **61**, pink↔gold **82**.
⚠️ **NO PAGE IS ON THE BURGUNDY FALLBACK ANY MORE.** The fallback path is still live in the
script and still the rollback — delete a page's four tokens and its flower returns to the
2026-08-21 burgundy — but no page exercises it, so a broken token reader would now show up
as a *wrong* colour rather than as a silent revert. `returning-band.mjs` §7c pins all four.

⚠️⚠️ **THE RENDERED SLAB IS NOT THE TOKEN, AND THIS COST A ROUND.** The scene's lighting
lifts and desaturates the material: `#4E1A28` leaves as `#5F3D43`. The first attempt kept
the burgundy's darkness and rotated only the hue — every spec looked distinct in a swatch
and the **rendered** slab moved by **eight of 255**. He looked at it and said he could see
no difference; he was right and the measurement agreed. Saturation *and* lightness are
what survive the lighting. **Judge this on a render, never on the hex** —
`returning-band.mjs` §7c samples the painted canvas and asserts the three doors separate
by ≥30.

⚠️ **THIS RE-OPENS A RECORDED EXCLUSION.** `HANDOFF.md` §7 says the door theme leaves the
sculpture alone ("the money card and the process sculpture keep their shared gold
grammar"). That still holds for the **six accent sites**; the slab is a material in a 3D
scene, not accent chrome on a light ground, so none of that block's contrast arithmetic
applies to it. His call, on the record, not a drift.

⚠️ **THE PHONE CROP IS ACCEPTED, NOT FIXED (2026-08-29c).** `PS:CSS` moved only to correct
a false claim: it used to say *"nothing visible is lost — on a phone what gets clipped is
what was off-screen anyway"*. **Measured by lifting the clip:** the art runs 30px past the
viewport at 320, 38 at 360, 43 at 390, 51 at 430 — what goes is the plate's right
shoulder, sliced to a flat edge. Nothing is lost on the left or on a desktop. He was shown
renders of three options and chose to leave it; the two that were built and measured are
recorded in the CSS comment for whoever reopens it.

⚠️ **THE SCRIPT TRADES SEATS; IT NEVER WRITES COORDINATES.** Six polar seats are defined in CSS,
keyed by `data-slot` — `--pang`, `--prad`, `--pw`, `--pa`, `--pz`, `--prot`. The script only
swaps which petal holds which `data-slot`, plus whole turns in `--pturn` / `--protturn`. **If you
find yourself computing an angle in JavaScript, stop** — the geometry is the stylesheet's, and
putting it in two places is what the slot map exists to prevent.

⚠️ **`ps-card-p` AND `ps-card-cta` ARE DELETED, NOT HIDDEN.** The plate carries a step's number,
name, rule and duration. **Prose on the plate is the thing this round removed** — see §4.

⚠️⚠️ **2026-08-29e — THE MENU HAS A FOURTH CONTRACT NOW: `NAV:CSS` / `NAV:JS`, ON EIGHT
PAGES.** Four pages the menu never showed — the three doors and `/programs/` — now sit
under Hormone Therapy behind a chevron. **Eight files, not four**, because every page
carries its own copy of the nav.

```bash
for f in index.html hormone-balancing modern-menopause hormone-therapy-bhrt \
         testosterone-top-up programs functional-medicine peptide-therapy; do
  p=$([ "$f" = index.html ] && echo index.html || echo $f/index.html)
  for b in CSS JS; do printf "%-24s %-4s " "$p" "$b"
    sed -n "/NAV:$b:START/,/NAV:$b:END/p" "$p" | md5sum | cut -c1-12
  done
done
```

**Eight matching rows per block.** ⚠️ **THE MARKUP CANNOT BE BYTE-IDENTICAL** — each page
needs its own relative prefix and its own `aria-current` — so `nav-services.mjs` asserts
*shape* instead: same items, same order, every destination a real 200, exactly one current
mark on the pages that have one.

⚠️ **HE CHOSE THE ACCORDION OVER THE ALWAYS-VISIBLE LIST**, off a four-way rendered board.
The recommendation here was the nested-always-visible one, because an accordion adds a tap
to reach the very pages it is meant to surface. **His call stands**; two refinements were
built to pay back what it costs, and neither is decoration:
- **The label and the chevron are separate targets.** "Hormone Therapy" is still a link to
  the hub (one tap, exactly as before); the chevron is a `<button>` that only expands. A
  parent that is both is the classic phone-menu trap.
- **The group ships OPEN on the four pages it contains**, with the current page marked —
  so the extra tap is spent by the readers least likely to need it. It is open in the
  *markup*, not by script, so it survives JS never loading.

⚠️⚠️ **THE FOUR NEW LABELS ARE ENGLISH-ONLY AND THAT IS A DELIBERATE, TESTED CHOICE.**
`t()` falls back to `DICT.en`, so keys added to **"en" only** show in all six languages. A
key missing from *every* dictionary resolves to `''`, and `setText` **blanks the element**
— `''` is not `null` and the guard only catches `null`. Proven: deleting the four English
keys blanks all four rows in **all six languages**. They are not translated because they
are proper names and because that is his copy to write, not ours.

⚠️ **STILL OPEN — THE TWO WORDPRESS MENU LINKS.** "Functional Medicine" reaches your own
page from six pages and the **WordPress** one from `/hormone-balancing/` and
`/peptide-therapy/`. Put to him 2026-08-29e; his answer was *"not sure — remind me
later"*, so **this is the reminder** and nothing was touched. It is two lines. Check the
in-repo page carries what the WordPress one does before switching.

---

## 3 · Verifying anything

```bash
node tools/qa/process-sculpture.mjs   # the flower: geometry, grade, header, three doors × two widths
node tools/qa/doors-shots.mjs         # the three doors: 13 widths, sideways scroll, reduced motion
node tools/qa/doctors-pill.mjs        # one pill per doctors chapter, five pages × three widths
node tools/qa/bhrt-shots.mjs          # the BHRT page end to end
node tools/qa/returning-band.mjs      # the band: parity, the count, the fold, 320px, states
node tools/qa/nav-services.mjs        # the menu's service group, eight pages, six languages
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

**a · ⚠️ THE MENU'S "FUNCTIONAL MEDICINE" GOES TO TWO DIFFERENT PLACES DEPENDING ON WHICH PAGE
YOU ARE STANDING ON.** On the three doors and on the page itself it points at the **in-repo**
`/functional-medicine/`. On the **landing page, `/hormone-balancing/` and `/peptide-therapy/`**
it still points off-site at `https://medi-gyn.com/functional-medicine/`, in a new tab.

This is a **half-finished migration, and the repo's own comments show the pattern.** The menu's
in-repo items were switched over one at a time, each on his call: Hormone Therapy on 2026-08-10
(*"the destination is our own /hormone-balancing/ scroll-story page, no longer the WordPress
site"*), Peptide Therapy on 2026-08-11. The doors, written later, say *"RELATIVE for the **three**
in-repo items"*. The landing page, the hub and the peptide page still say **"both"** — they were
written before the in-repo Functional Medicine page existed and were never revisited.

**The fix is one line on three pages** — swap the absolute URL for the relative one and drop
`target="_blank"`, exactly as the 08-10 comment describes doing for Hormone Therapy. ⚠️ **But the
decision is his, not ours**: it changes where a real visitor lands, the previous two switches were
each explicitly his call, and there may be content on the WordPress page that the in-repo one does
not carry. **Ask before switching it.** (My first reading of this called it a depth problem — that
Functional Medicine sat three clicks from home. That was wrong: it is one click from everywhere,
it just leaves the site from half the pages.)

**b · ~~`/programs/` is an orphan.~~ SHIPPED 2026-08-26 — he came back to it, and it is now a
real page.** The wait he asked for on 2026-08-24 ended with his request for "a separate page
(1 page for both)". Four rounds later it carries the flower (a **fourth carrier** of §2's
parity contract), the doors' doctors chapter, a composed programme card, a photographic hero
and a flip pair; the hub's `#boosters` pill is **wired to `../programs/`** (`data-soon` off,
exactly as that section's comment said would happen once the page had an address).

⚠️ **ITS ONE BLOCKING QUESTION IS THE PACKAGE FIGURE, AND IT IS HIS.** The page ships with no
price — the money slot reads "Priced at your consultation" — because none has ever been named
for the composed programme, and the doors' 950 buys a package with one consultation where the
Gut system carries two. The `?price=950` board shows the alternative on the real page; his pick
deletes it. **Do not invent a figure here.**

Records: [`HANDOVER_BOOSTER_PROGRAMMES.md`](HANDOVER_BOOSTER_PROGRAMMES.md) is the round —
what happened, whose call, what will bite. [`programs/HANDOVER.md`](programs/HANDOVER.md) is
the page, round by round. Everything still open (the figure, the unsigned FAQ drafts and
placeholder testimonials, the recovered-not-read Included lists, the mentorship line, i18n)
lives in the first of those.

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
