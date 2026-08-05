# Medi✦X — START HERE (next chat)

**Read this file first.** Then, only if you need detail:
`HANDOVER_LANGUAGES.md` (the language picker), `HANDOVER_MOBILE_UX.md` (the
parked mobile/scrim brief), `HANDOVER.md` addenda 9–11.
Rewritten 2026-08-03.

---

## 1. What this is

`AyranxAi/Medi-x` — a deliberately plain static site: **one `index.html`** with
inline CSS/JS plus `images/` and `fonts/`. No build step. Eight full-bleed
chapters, a sponsor band, a footer. **Live at https://medi-x-gin.vercel.app**,
which tracks `main`; **`git push` IS the deploy.** Local clone
`~/Documents/medi-gyn/medi-x`. Commit author must be **AyranxAi
<ayranxai@gmail.com>** or Vercel refuses the build.

**He is demoing this to the owners.** Live is a demo surface — ask before
pushing anything visibly different while he may be mid-conversation with them.

**⚠️ HE EDITS THE REPO HIMSELF, and other sessions push too.** On 2026-08-03 he
uploaded a file through the GitHub web UI mid-session, and a parallel session
shipped the entire language picker. **`git fetch origin main` before you build
AND again before you push.** Rebase, never force.

---

## 2. State

**Working tree clean. The 2026-08-04 pass is LIVE** — merged to `main` on his
say-so and deployed, fast-forward from `40501f6`, six changes across four
commits, all detailed in §4 and in the CSS comments:

1. the ask bubble is rimless at rest
2. ch08 headline +8% (paid for by the panel's side padding)
3. ch08 quotes −15%
4. ch08 takes his WIDER cover, with the crop capped on both axes
5. ch06 takes his `product visible` frame, and phones get his portrait one
6. the footer carries two addresses, its control row re-levels, and the
   newsletter line steps up to 1.15rem

**Two things went live UNVERIFIED and are his to close:** `strategy@medi-gyn.com`
is in a `mailto:` and nobody has proved the mailbox exists, and the back-to-top
disc overlaps the address text between roughly 1000 and 1150px wide — a
pre-existing squeeze that the second address made start earlier. Both are
written up in §4.

### The 2026-08-05 pass — on `claude/website-logo-header-redesign-ejy9yb`, NOT merged

Five commits, all on the branch, none on `main` yet. Every number below is
measured and the working is in the CSS comment beside each rule.

1. **The bar.** Logo `34/48 → 36/50`, header inset `+6px`. Both travel through
   `--copy-x` by design, so all eight chapters' copy moved with the mark — that
   is the i-stem rule working, not drift. The "Book your consultation" pill is
   OFF the bar; its `hdr.book` strings stay in all six language tables,
   unrendered, in case it returns.
2. **Chapter 01 re-ordered:** headline → body → both buttons on one line →
   "Private. Personal. Powerful." as the closing note, with its gold rule now
   running the full column width. Every h1 figure on the page is the old one
   ×0.92, **all six languages together** — scaling English alone would have
   undone the floors that make them break to four lines at the same width.
   The kicker is back on phones; it was hidden on 2026-08-04 for pushing the
   headline out of the scrim, and as the last row it pushes nothing.
3. **A WhatsApp disc** above the assistant, on the assistant's own trigger.
   It is a FILLED dark-green `#0F7A38`, not the green outline he first asked
   for: no green clears 3:1 on s2/s3/s5/s6, and a per-chapter list cannot fix
   it because s2 measures 0.344 on desktop and 0.065 on a phone off the same
   `data-src-narrow` swap. A fill measures the glyph against its own disc —
   5.09:1 everywhere, no script.
4. **The WhatsApp glyph is now the real trademark** in all four places. What
   shipped before was a hand-drawn speech bubble with a scribbled handset.
   Two sizes on purpose: padded `-2 -2 28 28` at 16px in the header so it sits
   level with the globe's stroke weight, full-bleed in the footer where its
   neighbours are Facebook and Instagram at full box.
5. **Chapter 01's phone crop** takes plain `center`. It had inherited the
   landscape plates' `72%`, which left 69px of margin left and 132px right.
   ⚠️ **A tuned 53% was measured, worked, and was REJECTED** — 2.5 CSS px
   better and a magic constant nobody could later justify.
6. **Chapter 06 back to the GLASS pair** — `products-visible` + its portrait,
   the champagne wall with the acrylic blocks and **no olive branch**.
   ⚠️ It went to `product-suite` first, which is also champagne but carries a
   leaf; he corrected it. If the chapter is ever changed again, note the repo
   holds THREE distinct champagne-ish sets and about a dozen crops of them —
   `product-suite*` (leaf), `products-visible*`/`products-closer`/
   `products-lineup`/`products-shop`/`the shop products` (glass, various
   zooms), and `product-wine*` (burgundy). Show him a contact sheet rather
   than guessing from a filename.
   **Both** positions re-derived: phone `63% → 57%`, desktop `12%` kept but
   re-checked. ⚠️ This pair is the tightest of the three — the phone group is
   745px wide in a 772.6px window, so ~28px of total slack against 87.6px on
   the leaf plate. At 360px the margin is ~4px a side. Re-check 360 first if
   the plate is ever recropped.
7. **Chapter 08 takes the Harper's Bazaar cover** and the button reads
   "Featured in" (idiomatic in all six, not literal). `.cpress__cta` moved
   bottom-left → bottom-RIGHT: this cover carries a QR code in the corner the
   button was anchored to. The phone was the stronger case for moving, not the
   objection to it.
8. **Chapter 07 was examined and deliberately left alone.** He asked whether
   the bloom should take the services scrim `#471826`. It should not: at .55
   over the `#2E2228` base that colour is luminance 0.0213 against the base's
   0.0188 and the bloom flattens out. The current `#5C1F31` at .55 already
   **composites to ≈#47202D**, i.e. the services scrim is what the section
   renders as today. Shown three ways, his call, no change.

---

## 3. His rules. Do not relearn these the hard way.

1. **The hero headline is THREE lines. Never four.** Verify 390 → 2560 after
   any type change.
2. **Show options, never pick for him.** Render 3–5 lettered variants over the
   REAL page at TRUE width, with measured numbers. Taste lives in the *degree*.
3. **Build his idea before arguing against it.** He decides; measurements
   inform, they do not veto.
4. **Answer a direct design question directly.** When he asked whether a
   label-on-a-scrim would read as editorial, he wanted a yes/no with a reason,
   not a survey.
5. **When he compares one section to another, read that section's CSS first.**
   "Copy chapter 07" meant its *anchoring*. I guessed "size" twice and was
   wrong twice.
6. **Ask which FILE when he attaches an image.** Downloads holds three
   near-identical product renders; the wrong one shipped once.
7. **Never tint another company's logo** — fetch their own dark/mono artwork.
8. **New filename, never an overwrite,** for any replaced image.

---

## 4. Load-bearing facts

### The copy line — every chapter starts on the **i of medi·gyn**

His alignment, 2026-08-03. Derived in CSS, never typed, because the wordmark
scales with the viewport:

```
--copy-x = --hdr-pad + --logo-h * --logo-ar * --i-stem - --serif-fix
```

`--logo-ar` is the file's 626/160. `--i-stem` is the stem at x280 of 626 =
`.44728`. `--serif-fix` is the 1px by which the Y's ink starts right of its box
— his "referring to each other's serif" — subtracted so the **ink** lands on the
stem. Header padding and logo height read the same tokens so they cannot drift.
**Change the logo artwork and only `--i-stem` needs re-measuring.**
Verified on the stem at 900 → 2560. **Phones are deliberately excluded**: at 390
the stem falls at 78px and would eat a fifth of the screen.

This replaced an earlier `min-width:1500` rule. The 1400px cap has to be off at
*every* desktop width, because a centred box adds half the leftover to the left.

### Type — Playfair variable, weight 450, `opsz` 30

Not Playfair Display. The newer family carries the opsz axis **and** a drawn
italic. `font-optical-sizing:none` is required or the browser overrides the axis
with the font-size, which is what makes the hairlines vanish at display sizes.

**⚠️ NEVER carry a px size across a font swap.** Width of "Your hormones." per
pixel of font-size — this governs line count AND how far type reaches into a
frame's bright half:

```
Didot 6.399   ·   Playfair @ opsz 30  6.609   ·   Bodoni Moda 7.099
```

Three faces in one day, three sets of numbers. Bodoni at Didot's sizes broke the
hero to four lines and dropped ch02 to 2.63. **Sturdier strokes are not the fix**
— opsz 16, opsz 8 and weight 500 all still failed. The problem is width.

### Contrast is the constraint on this whole site

Ivory on photographs: large text needs 3.0, small text 4.5. Method: hide the
text with `visibility:hidden`, shoot the FULL viewport, crop per LINE via
`range.getClientRects()`, report the **brightest 2%**.
Current: every headline clears at 1440 and 1920 (worst 3.18). **The body
paragraph does not — 4.09 at 1920 — and growing it makes it worse.**

### Chapter 06 — the frame is `products-visible.webp` (2026-08-04)

His upload `images/product visible.png` (commit `26c0c80`), named for what it
fixes: same set, same 1672x941, but pushed RIGHT so the left ~40% is empty wall
— which is where the copy column sits. On the frame it replaced, the arch and
the gold blocks stood behind the headline and the vaginal-cream label sat under
the scrim, half-legible. Encoded q92 to a NEW filename; `products-shop.webp`,
`products-closer.webp` and `products-lineup.webp` all stay.

Measured before swapping, worst LINE, ivory on the frame, old → new:

```
1440   headline 6.97 → 7.05     body 8.34 → 8.49     cta 14.00 → 14.15
1920   headline 11.16 → 11.15   body 11.48 → 11.82   cta 14.50 → 14.54
390    headline 2.11 → 1.87     body 3.18 → 3.04     cta 6.06 → 6.15
```

Desktop flat-to-better and clear of its floors.

**Phones get their OWN frame, also his upload (2026-08-04):**
`product mobike optimized.png` → `products-visible-portrait.webp`, the same set
shot portrait (941x1672), products in the top half and the reflective floor
under the bottom-anchored copy. Wired through a new optional `data-src-narrow`
on `.bg`, picked in the lazy loader by `matchMedia('(max-width:899px)')` — the
landscape frame stays the default, so every other chapter is untouched. The pick
is made once at load; a device crossing 900px afterwards (a tablet rotating, not
a phone) keeps what it loaded, which is deliberate.

```
worst line, ivory on the frame     landscape → portrait
360x780   headline 1.63 → 1.80   body 2.65 → 2.88   cta 6.12 → 6.85
390x844   headline 1.87 → 2.27   body 3.04 → 3.39   cta 6.15 → 7.08
430x932   headline 2.54 → 2.73   body 3.19 → 3.67   cta 6.46 → 7.30
```

**Better on every line at every size, and the CTA now clears comfortably — but
the headline still misses 3.0 and the body still misses 4.5.** Expected: the
cause was never the photograph. This hands the parked scrim pass a much better
starting point; it does not replace it.

### The footer carries TWO addresses (2026-08-04)

`General: info@medi-gyn.com` / `Business: strategy@medi-gyn.com`, his copy.
He drafted them with a leading "For" ("For more info:" / "For Business
Inquiries:") and asked; the answer was no, and the reasons are measurable, not
taste — 13 characters against 22 put the two addresses at visibly different
starts in a narrow column (they now begin within 2px of each other), his draft
mixed sentence case with Title Case so one was wrong either way, and "For" plus
a colon says the same thing twice. **His exact strings are one edit away in
`foot.mail_general` / `foot.mail_business` if he wants them back.**

Two things in there are load-bearing:

- **The colon lives in the TRANSLATION, not the markup** — French wants a space
  before it, Chinese wants the fullwidth `：`. Six new pairs of keys.
- **`.f-mail a` carries `unicode-bidi:isolate`** for Arabic. The address is
  strong-LTR but its dots and `@` are neutral, and in an RTL paragraph trailing
  neutrals reorder — without isolation the colon lands on the wrong end. Not
  `direction:ltr`, which would drag the label out of the RTL flow too.

**⚠️ `strategy@medi-gyn.com` is live in a `mailto:` and nobody here has proved
the mailbox exists.** Worth one send before the demo.

**The control row re-levels from 1240px up.** The second address broke three
alignments at once, not one — measured at 1440, relative to `.fw`:

```
shipped 2026-08-03   chips 67-111   form 69-113   arrow 65-114   level
+ second address     chips 92-136   form 69-113   arrow 65-114   chips fell 23
                                                                 below the form,
                                                                 24 below the arrow
now                  chips 93-137   form 93-137   arrow 91-140   level again
```

He proposed fixing it in copy — lengthening the newsletter line until it wrapped
and the columns matched. **Rejected as a mechanism**: the wrap point moves with
the viewport and each of the six languages wraps somewhere else, so it would
need re-tuning at every width forever, and it would only have fixed the form,
leaving the arrow 24px out. Geometry does it once: the columns stretch and push
their control rows down with `margin-top:auto`, and `.f-top` moved inside
`.f-grid` (markup only — it is absolutely positioned, takes no track) so it can
dock to the grid's bottom edge, which IS the chip row's bottom edge. Verified
level at 1240 → 2560 and in all six languages.

**⚠️ Scoped to `min-width:1240px`, and the number is measured.** Below it the
footer is already squeezed: at 1200 the six chips wrap to two rows, at 1100 the
addresses wrap, at 960 they take three lines. Bottom-aligning against a column
80px taller strands the form in an empty one. Under 1240 everything reverts to
what shipped on 2026-08-03.

**⚠️ KNOWN AND UNFIXED, and this pass made it start earlier:** the back-to-top
disc overlaps the address text at narrow desktop. It always did at ≤960; with
two addresses it does from ~1150. The fix is the footer's SHAPE at those widths
— stack sooner, or stop `.f-news` holding a rigid 22rem — and both change a
layout he signed off, so it is his call. **Not a regression at any width he
works at** (1240 up is clean).

**The newsletter line is 1.15rem and the words are unchanged.** He was offered
three longer two-line strings that would have closed the gap exactly and chose
"the sentence I have, bigger".

**⚠️ Bigger type does not close that gap — do not ship it believing it does.**
Gap under the line at 1440: `.95rem` 38px · `1.15rem` 33px · `1.45rem` 26px.
Each px of size buys 1.6px of line box, so closing 24px needs ~+15px of type
(~2.9rem), which would dwarf the addresses across the gutter. What actually
answers the hole is **`justify-content:space-between`** on both text columns
instead of `margin-top:auto`: same bottom-alignment, but the slack spreads
across every gap rather than pooling in one. Final gaps at 1240→2560 are
27 / 24 / 18 against the old 18 / 38 / 18.

1.15rem is a ceiling, not a round number: English stays one line to 1.52rem, but
this is now the largest body text in the footer, a step above the .95rem
addresses, and that is as far as "the invitation is louder than the information"
goes before it just looks mismatched. **It costs French a second line** —
one-line ceilings are en 1.52 / ar 1.75 / zh 1.74 / fr 1.00 / de 0.89 / ru 0.75
rem, so German and Russian were already wrapping at .95rem and French now joins
them. Nothing overflows, and space-between means the extra line strands nothing.

### Chapter 08

Two equal full-bleed halves (`1fr 1fr`). The client rejected the article-width
version. The article-width rule is in the CSS comment if wanted back.
Right panel is `--cream`, the footer's own token.

**The cover is `press-04-madame-arabia-wide.webp`, capped on BOTH axes
(2026-08-04).** Two of his decisions, in order.

It used to be plain `cover` on the 1080x1350 original, which crops by a function
of the WINDOW's ratio, not of anything in the CSS — perfect at 1440x900 (0px),
169px a side at 1920x900, which clipped the MADAME masthead and the IRINA Bond
signature. That is what he reported.

Then he had the cover **extended sideways**: 1182x1330, aspect 0.889 against
0.800. Better raw material — 0.889 is exactly the half-column aspect at 1600x900,
1920x1080 and 2560x1440, so those go to zero crop where they lost 68px. **But it
is not a drop-in, and this is the trap:** wider than 4:5 means it now crops LEFT
AND RIGHT on 4:5-ish columns, and the signature has only **60px** of margin to
the right edge. Raw, uncapped: 1440x900 crops 59px a side and the signature
survives by ONE pixel; **1366x900 crops 86px and clips it by 26.** The wider file
does not replace the cap — it changes which axis needs one.

Ink on the new file: masthead top y132 / left x209, signature bottom y1155 /
right x1122. Budgets 132 / 175 / 209 / 60. Allowing 84px of vertical crop and
30px of horizontal makes the frame the largest box in the column whose aspect
stays between `a_min = 1122/1330 = 0.8436` and `a_max = 1182/1162 = 1.0172`,
which is what the two caps say — `--frame-w` caps width (so vertical crop),
`--frame-h` caps height (so horizontal). Verified at twelve ratios: **nothing is
ever cut**, worst air 48px on the masthead and 30px on the signature.

```
                 vCrop  hCrop   bars X   bars Y
1440x810 / 1600x900 / 1920x1080 / 2560x1440    0      0       0       0
1280x800 / 1366x900 / 1440x900                 0     30       0    21-45
1920x900                                      84      0      22       0
2560x1080                                     84      0      91       0
```

The trade he accepted: ~22px bars at 1920x900 instead of 65, and zero at 16:9,
in exchange for 23px of top/bottom bar at 1440x900 where there used to be none.
`margin:auto` keeps her centred both ways; the grid is untouched; `.cpress__cta`
offsets off BOTH photo edges so PRESS never drifts onto the ground.

**⚠️ `--frame-h` is in `vw` because CSS has no "percent of containing-block
width" in a height.** `vw` counts the scrollbar and `.cpress` does not, so it
over-estimates ~9px at 1440 — about 6 more source px of side crop than the
nominal 30, leaving the signature ~24px of air. Do not tighten without
re-checking that.
**⚠️ ALL FOUR CONSTANTS BELONG TO THIS ARTWORK.** Swap the frame and re-measure
every ink edge before trusting 101.72 / 59.27.

**Its headline was at the wall; 2026-08-04 bought it 8% by moving the wall.**
One line is the rule, so the ceiling is the panel's text width ÷ the string's
width-per-px in Megante (19.09). He was offered the shorter string (worth ~+49%)
and chose to trim the panel's side padding instead, so **the string stands**:

```
                 text width      ceiling         2.16vw → 2.33vw
  1280            538 → 584     28.2 → 30.6      27.6 → 29.8
  1440            604 → 657     31.6 → 34.4      31.1 → 33.6
  1600            671 → 730     35.2 → 38.2      34.6 → 37.3
  1920            831 → 876     43.5 → 45.9      41.5 → 44.7
  2560           1151 → 1167    60.3 → 61.2      44.0 → 44.8 (cap)
```

Shipped `clamp(1.05rem,2.33vw,2.8rem)` with `padding-inline:2.2vw` in a
`min-width:900px` query. **That query is load-bearing:** phones keep their
padding, and the old `1.6rem` floor would otherwise bind from 1164px down and
wrap the headline at 950px. Padding and type now share one vw scale, so the
margin is a constant **2.4% from 900px to 1920px** (verified one line at 900,
950, 1000, 1100, 1164, 1280, 1366, 1440, 1512, 1600, 1728, 1920, 2200, 2560).
**It is at the wall again — from here the STRING has to get shorter.**

**Quotes came DOWN 15% in the same pass** (his call): `clamp(1.95rem,3.32vw,
3.57rem)` = 42.5 / 47.8 / 57.1. The whole clamp scales by 0.85 so the step is
15% at every width, and 26ch is in `ch` so the line count per quote is
unchanged — tallest of the nine is 313px in a 752px stage at 1440. Phones keep
2rem. The headline now sits at 0.78 of the quote at 1920, against 0.62; **that
ratio is the thing to watch if either moves again.**

**⚠️ Multilingual caveat, pre-existing, not caused by the sizing:** German,
French and Russian are ~60% longer than English and take TWO lines at any size
that keeps English on one. Arabic and Chinese are fine. Nothing overflows — they
wrap cleanly. Either those three translations get shortened to English's rhythm,
or two lines is accepted there. **His call, not yet asked.** Re-verified after
the 2026-08-04 growth at 1440 and 1920: line counts are unchanged and the widest
line still clears the panel (861/875 worst case, German at 1920).

### The ask bubble is RIMLESS AT REST from ch02 down (2026-08-04)

His call. The ivory rim is a **hover** state now; idle is a bare burgundy disc.
Know what it cost before "fixing" it back — the rim was the half of the pair
that carried the dark chapters. Disc alone, against the ground under the button:

```
ch05 the room 1.08   ch07 menoSTART 1.30   ch02, ch03 ~3.1
ch06 the tools 5.17  ch08 ivory panel 11.21   the footer 10.64
```

He was shown these and chose it anyway; the quiet is the point. Rendered at
1440x900 the disc still reads on ch05 (the floor under it is pale there) and
ch07 is the genuinely quiet one — the ivory icon is what finds it. If it ever
has to come back on the dark rooms only, the honest fix is a per-chapter signal
on the button, **not** a rim everywhere — a rim everywhere is what this removed.
`border-color:transparent`, not `border-width:0`, so the 1px box stays, the icon
cannot shift, and hover fades the rim back in on the existing transition.

### The band

No label — "kinda obvious and just ugly". The marks are the only thing in it, so
they are its centre by definition. The space the label vacated went to the
MARKS: `--k` 1.55 → 2.15, tallest mark 84 → 117px, band ~176–188px.
The belt is two identical sets sliding `-50%`; **verify `track === 2 × set`**
after touching it. Marks must NOT be `loading="lazy"` — off-screen horizontally
inside `overflow:hidden` they never fetch and the loop gains a hole.

**Logo sizing is by OPTICAL CORE (`--h`), not box.** Before changing any `--h`,
measure the file's alpha-bbox fill ratio: LVI had the biggest `--h` and the
smallest ink, because its artwork filled 29.5% of a 400×400 file.
`sponsor-09-matches-talent` is still untrimmed at 68.5%.

---

## 5. Open, in the order I would take them

00. **⚠️ THE PLATES ARE BEING UPSCALED ON PHONES, AND IT IS WHY THE HERO LOOKS
    SOFT.** `team-hero-portrait.webp` is 941px wide but renders 475 CSS px,
    which needs **1424 device px on a 3× phone** — roughly 1.5× upscale on any
    recent iPhone. Every portrait plate has this. The 2160×3840 sources are all
    still in `images/` (`15% high phone.png` is the one that ships), so this is
    a re-encode, not a re-shoot: ~1400 wide takes each file from ~162KB to
    ~330KB. **Do this BEFORE the `<picture>` work below** so that work just
    consumes the new assets.

0a. **⚠️ THE "GLITCHING AND RESIZING" HE KEEPS DESCRIBING IS THE LOADER, NOT
    ANY CROP.** He asked for a "Clinique La Prairie type" fix where the hero
    stops popping in and re-framing. Three separate causes, all real:
    - **The pop-in.** Every `.bg` image lives in a `data-src` attribute and is
      fetched by `new Image()` only after the JS parses (the `load()` function
      in the inline script). The browser's preload scanner cannot see it, so
      the hero starts downloading late. **Fix: real `<img>` in `<picture>`,
      `fetchpriority="high"` on the hero, explicit `width`/`height`.**
    - **The re-framing.** `cover` + any percentage means every viewport ratio
      shows a different crop. Art-directed `<source media>` per breakpoint,
      each plate composed for its own shape, removes **every**
      `background-position` percentage in the sheet.
    - **The rotation staleness.** The loader `delete`s `dataset.src` after the
      first pick, so a tablet crossing 900px keeps the frame it loaded with —
      documented and accepted at the time, and `<picture>` fixes it for free.
    This is a proper job, not a tweak. Scope it its own session.

0b. **Look at the 2026-08-05 branch on the real domain before merging.**
    Playfair loads from Google Fonts, which the sandbox proxy blocks, so every
    headline screenshot from that pass rendered in a fallback serif. The ×0.92
    sizes are safe in principle — these ceilings are width limits, so smaller
    can only gain clearance — but the actual line breaks of "Your best life."
    were never seen in the real face. **Also re-judge the phone kicker there:**
    it reverses his 2026-08-04 call on new reasoning, and the one-line revert
    is sitting commented in the `.kicker` block.

0c. **The hormone quiz is now the loudest inert control on the site.** It sits
    on the same line as booking, at equal weight, reading as a live offer.
    Booking at least has a destination coming; the quiz has nothing anywhere on
    `medi-gyn.com` to point at. He confirmed **inert for now** on 2026-08-05 —
    this is a note, not a request.

0. **⚠️ CHAPTER 05 SHIPS A FORMER TEAM MEMBER — RE-ASK HIM.** 2026-08-03 the
   empty-lounge `images/team.webp` was replaced with his own frame of the five
   of them, `images/team-wide-tight.webp` (source `medi-gyn-meet-the-team-wide-tight.png`,
   his upload, commit `f258d81`). **The woman at the left of the group has left
   the team.** He hoped the copy column would cover her. It does not: her face
   sits clear above the headline and the copy crosses her dress. She also
   cannot be cropped out — she holds the left third of the group, the entire
   crop budget at 1440x900 is ~20% of frame width (360px of an 1800px cover
   fit), so no `background-position` reaches her. **He shipped it knowingly as
   an interim, with the fix named: a frame she is not in.** When one exists,
   swap the file, delete the flag block above `#s5 .bg`, and delete this item.
   The contrast side is fine and measured — the new frame is far *darker* under
   the copy than the lounge it replaced (photo luminance .472 → .193 at 1440,
   .393 → .258 at 390; ivory median contrast 7.08 → 14.84 and 6.05 → 9.16).
   A wider variant of the same shot exists at
   `~/Documents/Codex/2026-08-03/hi/outputs/medi-gyn-meet-the-team-wide.png` —
   more empty wall, copy lands entirely clear of everyone — but she is in that
   one too, so it solves the composition and not the problem.

1. **The three long translations** of the ch08 headline (above) — one question
   to him, then either shorter strings or accept two lines.
2. **The italic colour.** `#s1 h1 em, #s5 h2 em` ship IVORY, flagged
   provisional in the CSS. Rose and gold are **not available** on those frames
   — 1.48 to 2.39 against a 3.0 floor. A coloured italic needs a darker ground.
3. **The scrim pass — it unlocks two things he has already asked for.** Parked
   in `HANDOVER_MOBILE_UX.md` at his request. One step deeper
   (`.88/.60/40/74` on `.sec.light::after`) is measured to work and would let
   the **body paragraph grow** and the **headlines take chapter 07's scale**,
   both currently refused on evidence.
4. **Phones.** Untouched by his instruction; the i-stem line excludes them.
5. **Destinations.** The five SOCIALS are LIVE as of 2026-08-03 (his URLs, in
   `3a8248a`). Everything else is still inert — but **most of it needs a URL,
   not a build**, which nobody had checked before: `medi-gyn.com` is a live
   WordPress/WooCommerce site that already has the pages.

   ⚠️ **medi-gyn.com soft-404s to its homepage, so HTTP 200 proves NOTHING.**
   Test whether the PATH SURVIVES the redirect
   (`curl -L -o /dev/null -w '%{url_effective}'`); if it returns bare
   `https://medi-gyn.com/`, the page does not exist. `/functional-general/` is
   linked from their own homepage and is dead exactly this way.

   **Verified to exist** (path survives) → the control it answers:
   `/about-us/` ch02 + menu · `/our-team/` ch05 · `/shop/` ch06 + menu ·
   `/press/` ch08 — and the natural home for the two orphaned films ·
   `/hormone-balancing-for-bhrt/` pathway 01 + menu ·
   `/modern-menopause/` pathway 02 · `/functional-medicine/` pathway 03 + menu ·
   `/peptide-therapy/` pathway 04 + menu · `/educational-events/` menu Events ·
   `/contact-us/`. Live and unused: `/blog/`, `/testimonials/`, `/case-studies/`,
   `/frequently-asked-questions/`, `/terms-and-conditions/`, `/anti-ageing/`,
   `/advisory-board/`.

   **THE 14 ARE WIRED AND LIVE** (`faca37a`): menu ×6, the four pathway CTAs,
   ch02, ch05, ch06, ch08. All `target="_blank"` — this page is a front door, so
   it stays alive behind the hand-off; one attribute to reverse if that reads
   wrong. The menu `<span>`s became `<a href>`s with no other change needed.

   ⚠️ **BOOKING and menoSTART ARE DELIBERATELY INERT — HIS DECISION,
   2026-08-03. This is PROVISIONAL, and he wants re-asking.** He was offered
   WhatsApp (already live 3× here, and medi-gyn.com's own primary funnel),
   `/contact-us/`, and an external scheduler for the three booking buttons; and
   `/educational-events/` or WhatsApp for menoSTART. **He turned all of them
   down and chose to wait for real destinations.** Do NOT wire either one to
   tidy up the list — the obvious fix is the option he already refused.
   Re-ask when a scheduler exists, and when menoSTART has its own page. The
   reminder is written into the markup at `.hdr__book` and ch07 as well.

   **The one genuine build left is the QUIZ** (ch01) — medi-gyn.com has no quiz
   anywhere. Also outstanding: the newsletter CRM and the ask-panel contents.
   `/privacy-policy/` is missing on medi-gyn.com too — worth raising for a
   clinic handling health data.

   **On making the hand-off neat.** medi-gyn.com is Hello Elementor + Elementor
   Pro + Woo, 29 plugins, 918KB of HTML on the homepage, set in Poppins and
   Montserrat — a hard break from Playfair/ivory/full-bleed. The efficient move
   is **not** rebuilding all nine pages: it is **the four PATHWAY pages only —
   one template, four fills**, taking the highest-intent traffic, since ch04 is
   this page's centrepiece and a visitor who opens a pathway has already
   decided to care. About/team/press/shop can stay Elementor. Cheaper middle
   option: Elementor's global font/colour settings (no code) — but that is
   Irina's live production site and global font swaps shift layouts.

   **The open decision is A vs B, and it is his:** (A) medi-x stays a front door
   and hands off to medi-gyn.com — 0 templates, but the jump from this design to
   the old WordPress site is jarring; (B) medi-x becomes the site and the
   destinations are rebuilt in this language — ~9 templates, ~18 pages.
   Build nothing downstream until he picks.
6. **The two films** (`JZ30fE0Nygw`, `HWZ8h3fgjvw`) left the site with the reel.
   He is content for them to live behind Press later.
7. **`images/product item.png`** — his 1.7MB upload, unreferenced. The site
   serves `products-closer.webp` (110KB, q92) from that exact file. Removing it
   is his call.

---

## 6. The verification rig — rebuild it, do not fight it

`puppeteer-core` is NOT installed. Chrome is driven over **raw CDP with Node's
built-in WebSocket** (`scratchpad/cdp.mjs`, ~80 lines). Serve from a scratchpad
copy with `python3 -m http.server`.

**Every one of these produced a confident wrong number:**

- **Check the server is yours.** A parallel session held ports 8899 and 8901;
  `index.html` returned 200 from *their* directory while my files 404'd.
  `lsof -p $(lsof -ti :PORT) | grep cwd`.
- **Assert the viewport after navigating.** A stale `Emulation` override
  silently served a real 1600 for a requested 1280 — and later a 2160 for a
  1440. The rig now refuses to measure on a mismatch; keep that guard.
- **IntersectionObserver, rAF, CSS transitions and smooth scroll are all dead
  headless.** Add `.in`, *stamp* end states with `!important`, set
  `scrollBehavior='auto'` before assigning `scrollTop` — then **assert the
  section landed**.
- **`img.decode()` never resolves for an unfetched lazy image.** Race it.
- **A flat crop is a MISSING image, not a dark one** — and it will still hand
  you a contrast number. An `<img>` can be complete, decoded, opacity 1,
  correctly sized and *still not painted*. Gate on the crop's standard
  deviation and retry the render.
- **Sample in the screenshot's pixel space.** CSS-px rects against a dsf-2 shot
  gave a button a 4.66 "pass" that was really 2.0.
- **An impossible number means your script is wrong, not the page.** A contrast
  ratio below 1.0 cannot exist; a "fill %" of a block element is just its
  container's width.
- **Check your own test harness too.** `Math.round(W*0.5625)||844` gave a 390px
  phone a 219px viewport and reported nine clipped quotes that were fine.
- **When two passes disagree, stop measuring and LOOK at the crop.**
