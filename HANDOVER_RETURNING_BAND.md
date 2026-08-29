# Handover — the returning-patient band, and the flower's slab (2026-08-29, three rounds)

**Two rounds, one block.** A compact strip now sits under the flower on all four carriers,
for a reader who is already on a protocol and needs neither the six steps nor a discovery
call. Eyebrow, heading, two outlined actions. Nothing else.

**Round two (his):** *"im thinking of making the buttons bigger perhaps? and also
separating it from the flower and the payment below by adding a color behind it (and that
color varies on what color the original orb is)"* — the actions went 56→**72px** (64 on a
phone), and the strip took a full-bleed ground keyed to each door's orb. §5b is that
round; everything else below survived it unchanged.

```
ALREADY A PATIENT?
Continue your care

[ 📅  Book a follow-up          → ]   [ ℞  Repeat prescription       → ]
```

The four carriers are `/hormone-therapy-bhrt/`, `/modern-menopause/`,
`/testosterone-top-up/` and `/programs/` — the same four the flower is on, because the
band is the line *under* the six steps and means nothing without them.

---

## 1 · What it is, and the three things it deliberately is not

| | |
|---|---|
| **is** | a content-height strip — ~232px desktop, ~270px stacked on a phone |
| **is** | two direct links, on the estate's own destinations |
| **is** | its own parity block, `RB:CSS` / `RB:HTML`, on four pages |
| **is** | dressed in its door's orb — three grounds, **one** byte-identical line (§5b) |
| **is not** | a seventh step. The flower keeps **six petals and six seats, 01–06** |
| **is not** | a chapter, hero, card, modal, sticky bar or floating panel — no `100vh`, `position:static`, no radius, no shadow |
| **is not** | a new flow. Neither action invents a destination (§3) |

**It never appears inside the flower's viewport.** That is arithmetic, not spacing taste,
and §4 is the whole of it.

---

## 2 · Where it lives, and why it is not in `PS:*`

`NEXT_ITERATIONS.md` §2 is the standing contract: the sculpture's three regions must be
**byte-identical on all four carriers**. The band could have gone inside `PS:HTML`, which
would have made it byte-identical for free — and would have put a non-sculpture element
inside the block whose entire documented purpose is the sculpture.

**It went outside instead, with its own markers.** The consequence is the good one: the
four PS sums are *unchanged by this round*, so every hash the record quotes is still
true —

```
PS:CSS   4d192d81e3e8      PS:HTML  95463c5391ea
PS:JS    d2ee51cad3aa      (+ ab64ee862292 on the men's door — the 2026-08-24g comment)
```

— and the band carries the same discipline under its own names:

```bash
for p in hormone-therapy-bhrt modern-menopause testosterone-top-up programs; do
  for b in CSS HTML; do printf "%-22s %-4s " "$p" "$b"
    sed -n "/RB:$b:START/,/RB:$b:END/p" "$p/index.html" | md5sum | cut -c1-12
  done
done
```

As shipped: **CSS `a1ead3db21c7`, HTML `327a9675ebea`. Four matching rows or you are not
done.**

In the DOM the band is a sibling **after** `.ps`, inside `#programme`, placed after the
flower's `<noscript>` rollback rather than before it — that list is the sculpture's own
no-JS half and belongs to the block above. The band needs no script at all, so it stands
whether the flower renders or the list does.

---

## 3 · The two destinations, and why neither is new

`README.md` names four controls that are **deliberately inert** and says plainly not to
"fix" them with placeholder URLs. A returning-patient band is exactly the change that
would have quietly broken that rule, so it wires to what already exists:

- **Book a follow-up → `#book`.** The call strip. Every `Book a consultation` pill on
  these pages already points there, and the page already carries the smooth-scroll
  handling for it. Same anchor, same behaviour, **no new machinery and no new
  destination** — when the real booking flow lands, this action moves with every other
  `#book` link and needs no separate decision.
- **Repeat prescription → the clinic's own WhatsApp line.** Same number
  (`971555450797`), same deep-link form the footer and hero already use. It is the one
  channel that reaches the clinic today, and a repeat prescription — issued without a
  face-to-face, AED 750 + VAT, the row the programme card carries since 2026-08-28 — is
  precisely what a reader uses it for.

⚠️ **THE WHATSAPP TEXT IS THE ONE LINE ON THESE PAGES THAT IS NOT PER-DOOR.** Every other
WhatsApp deep link names its own service ("…a private consultation for the Testosterone
Top Up programme"). This one reads *"Hello, I would like to request a repeat
prescription."* on all four, because the band is byte-identical across them and because a
service **request** is not a service **enquiry** — the clinic already knows what she is
on. Forking it per door is how `RB` drifts.

⚠️ **NO INTERMEDIATE STEP.** Both are plain `<a>`s straight at the destination. No
"Continue care" gate, no dialog, nothing to dismiss — the harness asserts there is no
`<button>`, `<dialog>` or `[data-book]` inside the band.

**Still his, not ours:** whether the follow-up should eventually reach a *repeat
consultation* booking of its own (AED 395 + VAT, the Zoom follow-up) rather than the
discovery-call strip. That is a destination that does not exist yet, and inventing one
here would be the duplicate flow the estate's notes keep warning about.

---

## 4 · The margin is the feature

**The requirement was that the complete flower viewport contains no returning-patient
UI.** `.ps-grid` stands at `min(80svh,880px)`, so a reader who frames the flower from its
own top has 20svh of slack underneath — put the band in that slack and it is *in the
picture*.

`.rb{margin-top:clamp(104px,21vh,240px)}` is sized against that, and the two heights a
desktop actually is are the two that were checked:

| viewport | flower | separation | band starts at |
|---|---|---|---|
| 1440 × **900** | 720 | 189 | **909** ≥ 900 ✓ |
| 1920 × **1080** | 864 | 227 | **1091** ≥ 1080 ✓ |
| 1280 × **800** | 640 | 168 | **808** ≥ 800 ✓ |

On a phone the check is the same shape and the margin is not what passes it: the flower
chapter is taller than the viewport on its own (988px against 844 at 390 wide), so the
whole six-step journey comes first and the band is what a scroll reveals.

⚠️ **ABOVE ~1100px OF VIEWPORT NO FIXED GAP CAN CLEAR THE FOLD.** The flower caps at
880px and the viewport keeps growing; 1440 tall would want 560px of separation, which
reads as a broken page. The cap stays at 240px. At those heights the chapter's own top
padding is inside the frame too, which is the slack that arithmetic spends.

⚠️ **THE FLOWER'S CANVAS BLEEDS DOWNWARD.** `.ps-gl` is `inset:-18%` and `.ps` clips only
the x axis, so a whisper of petal shadow sits above the band's hairline. **That is the
client's reference, not a leak** — do not "fix" it by clipping `.ps` on both axes; the
note on `overflow-x:clip` in the PS block says what that costs.

---

## 5c · Round three — the petal slab wears the orb, and a false comment comes out

> *"the petals have their own color on the side right currently all is burgundy? can you
> give me a set of colors… maybe making it pink or gold the same color as the orb"*

**The slab is the deep edge under the plate** — a maroon backing petal in the 3D scene,
plus a three-stop ramp in the SVG fallback. Both live in `PS:JS`, which is byte-identical
on four pages, so the colour was moved OUT of the script and into four `:root` tokens:

```css
--ps-slab  --ps-slab-top  --ps-slab-mid  --ps-slab-foot
```

| page | orb | slab | ramp |
|---|---|---|---|
| `/hormone-therapy-bhrt/` | burgundy | `#A1213B` crimson | `#D02F4F` `#AE1E3B` `#90132C` |
| `/modern-menopause/` | rose | `#C9366C` **pink** | `#D36990` `#D23770` `#BE235C` |
| `/testosterone-top-up/` | gold | `#9F7123` gold-bolder | `#CD9432` `#AC7920` `#8F6214` |
| `/programs/` | — | `#9F7123` (shares gold) | same |

⚠️ **RE-SEATED 2026-08-29d.** The crimson shipped on the menopause door for a few hours and
he moved it: *"the one on modern meno should actually be on the hormone therapy bhrt"*.
He is right about the families — BHRT's orb is the burgundy one and crimson belongs to it;
the menopause orb is the **rose** one, so that door wanted an actual pink, which is what
`#C9366C` is. Rendered separation: crimson↔pink 56, crimson↔gold 61, pink↔gold 82.
**The alternative on the board was `#BD5664` (dusty)** — truer to the soft `--rose #C79A92`
of the orb image, less bold. One token per page if he wants it.

⚠️ **DELETING A PAGE'S TOKENS RESTORES THE 2026-08-21 SCULPTURE**, because the script's
fallbacks are the original values rather than black. That is the rollback.

⚠️⚠️ **THE RENDERED SLAB IS NOT THE TOKEN, AND THIS IS THE ROUND'S REAL LESSON.** The
scene's lighting lifts and desaturates whatever the material is given: `#4E1A28` leaves as
`#5F3D43`. **The first attempt kept the shipped burgundy's darkness and rotated only the
hue.** Every candidate looked distinct as a swatch; on the page the rendered slab moved by
**eight of 255**. He said he could not see a difference — he was right, and the
measurement agreed:

| spec | renders as | Δ from burgundy |
|---|---|---|
| `#4E1A28` burgundy | `#5F3D43` | — |
| `#4E211A` rose-terracotta | `#5F403C` | **8 — invisible** |
| `#A1213B` rose-bolder | `#A9404F` | **75 — shipped** |
| `#9F7123` gold-bolder | `#A77B40` | **95 — shipped** |

**Saturation and lightness survive the lighting; hue alone does not.** Judge this on a
render, never on the hex. `returning-band.mjs` §7c samples the painted canvas and asserts
the three doors separate by ≥30 — the check the first attempt would have failed.

⚠️ **THIS RE-OPENS A RECORDED EXCLUSION, DELIBERATELY.** `HANDOFF.md` §7 says the door
theme leaves the sculpture alone. That still holds for the **six accent sites**; the slab
is a material in a 3D scene, not accent chrome on a light ground, so none of that block's
contrast arithmetic reaches it. His call, on the record.

### The phone crop — measured, and deliberately left

He asked how the flower looked on mobile before this work. **Answer: identical.** Rendered
both builds from a worktree at the pre-band commit, four phone widths — chapter height,
stage, plate, petal count and overflow all matched to the pixel. The band changed nothing.

**But the flower IS cropped on phones, and always was.** By lifting `overflow-x:clip` and
comparing painted extent:

| viewport | art ends (shipped) | unclipped | cut |
|---|---|---|---|
| 320 | 316 | 346 | 30px |
| 390 | 389 | 432 | **43px** |
| 430 | 429 | 480 | 51px |

What goes is the plate's right shoulder, sliced to a flat vertical edge. Nothing is lost
on the left or on a desktop. **The code claimed otherwise** — *"nothing visible is lost…
what gets clipped is what was off-screen anyway"* — and that comment is now corrected with
the numbers, because a false claim in this repo outlives the person who wrote it.

**He was shown renders of three options and chose to leave it.** The two that were built
and measured are recorded in the CSS for whoever reopens it: shrink the stage to 88%
(plate 231→203px), or tighten the ring (`--prad` 17.285→8.6cqw on slot 0, slots 1 and 5
eased in; plate stays 231px, art ends at 362 of 390). The second is the better picture and
edits a composition traced from the client's own phone reference — his to reopen.

---

## 5b · The orb — one line, four pages, three grounds

His ask was for the strip to carry the door's colour. The estate already had the token:
`--door-tint`, confirmed against the real orb images on `/hormone-balancing/` in the
2026-08-27 round, and already used by `::selection` and `.chip:hover`.

```css
.rb{background:var(--door-tint,var(--gold-tint))}
.rb-eyebrow{color:var(--door-deep,var(--gold-gloss))}
```

| page | orb | ground | eyebrow |
|---|---|---|---|
| `/hormone-therapy-bhrt/` | burgundy | `--door-tint` `#F2E1E2` | `--door-deep` `#5C1F31` |
| `/modern-menopause/` | rose | `--door-tint` `#F9E4DE` | `--door-deep` `#8C5148` |
| `/testosterone-top-up/` | gold | `--gold-tint` `#F1E7D2` | `--gold-gloss` `#7F6230` |
| `/programs/` | — (not a door) | `--gold-tint` `#F1E7D2` | `--gold-gloss` `#7F6230` |

⚠️ **THE FALLBACK IS WHAT KEEPS `RB` ONE SUM.** The gold door carries **no `--door`
tokens on purpose** — `HANDOFF.md` §7: *"the estate's gold already dresses exactly the six
rule sites the theme names, so the theme there is the page as it stands"* — and
`/programs/` is not a door at all. Writing the colour per page would have forked the block
four ways and ended the parity contract; `var(--x, var(--y))` lets the cascade do it.
**If the gold door is ever given `--door` tokens, this strip picks them up with no edit.**

⚠️ **THE GROUND MOVED, SO EVERYTHING ON IT WAS RE-MEASURED.** `--gold-gloss`'s token block
says it plainly — *it is a function of the ground; anyone who darkens the ground must
bring it back*. Small floor 4.5, large 3.0:

| | eyebrow | heading | label on fill | icon + arrow |
|---|---|---|---|---|
| burgundy `#F2E1E2` | **9.817** | 9.817 | 5.863 | 10.976 |
| rose `#F9E4DE` | **5.074** | 10.133 | 5.965 | 11.167 |
| gold `#F1E7D2` | **4.632** | 10.087 | 5.934 | 11.109 |

⚠️ **4.632 IS THE TIGHTEST PAIR HERE**, the gold pages' eyebrow. `--gold-deep` on that
ground is **4.080 — it FAILS**, which is the same trap the flower's eyebrow records two
blocks up in the stylesheet. Deepen `--gold-tint` and the gloss goes under with it.
**`returning-band.mjs` §7b re-derives all twelve of these from the rendered pixels**
(compositing the translucent button fill over the strip's ground by hand, because
`getComputedStyle` hands back the `rgba`, not what the eye receives), so a token move
fails the run instead of quietly failing a reader.

⚠️ **THE THEME TOUCHES THE GROUND AND THE EYEBROW, AND NOTHING ELSE.** Hairlines, button
borders, heading and icons keep the estate's shared gold/burgundy grammar — the same
exclusion the door theme's own note draws around the money card and the sculpture. §7b
asserts `.programme`'s ground is still `#F0EBE7` on every page: the strip wears the orb,
it does not repaint the chapter.

⚠️ **FULL BLEED IS WHAT DOES THE SEPARATING.** `.rb` is a block child of a section that
carries no side padding, so the colour runs edge to edge on its own — no negative margins,
no `100vw` (which would have been the sideways-scroll bug the doors' sweep exists to
catch). `.wrap` inside it holds the copy on the content grid; §7b asserts the strip's copy
starts on the same pixel as the flower's editorial column.

**Pressed takes the orb for free:** `.rb-act:active` sets the fill back to
`var(--door-tint,var(--gold-tint))`, so the raised button sinks to the strip's own ground.
`--ink-soft` on it is 5.24 / 5.41 / 5.39.

---

## 5 · The dress

Every token is one the chapter already owned; nothing new was invented.

| | |
|---|---|
| ground | **the door's orb** — `var(--door-tint,var(--gold-tint))`, full bleed (§5b) |
| edges | `1px rgba(194,160,94,.38)` top **and** bottom, full bleed — the colour separates, the hairlines crisp it |
| eyebrow | `--accent`, 12px, `.24em`, **`--door-deep` → `--gold-gloss`** (§5b) |
| heading | `--serif` 450, `clamp(24px,2.1vw,29px)`, `--burgundy` |
| label | `--sans` 400, **16px**, `--ink-soft` — 5.86 / 5.97 / 5.93 on the fill |
| box | **72px** (64 on a phone), `1px rgba(194,160,94,.6)` on `rgba(255,253,249,.5)`, **no radius, no shadow** |
| hover / press | `#FFFDF9` + `--gold-deep` border / the strip's own ground |
| focus | `2px solid --gold-deep`, offset 3 — the flower's own ring |

⚠️ **NEVER `--gold-deep` ON THE EYEBROW, ON ANY GROUND THIS STRIP HAS STOOD ON** — 4.233
on the flower's `--ps-ground`, 4.080 on `--gold-tint`, both under the 4.5 floor, both
silent. The measurement is in §5b and the flower's own eyebrow records the same trap.

⚠️ **THE EYEBROW IS SENTENCE CASE IN THE MARKUP AND UPPERCASED IN CSS** — the estate's
rule for every eyebrow it owns, and what keeps a screen reader from spelling the words.

⚠️ **EVERY STATE KEEPS THE BOX THE SAME SIZE.** Hover and press move **colour only**;
focus is an `outline`, which paints outside the border box and reflows nothing; the
arrow's nudge is a transform on a `flex:none` span. Change the border *width* on any state
and the two actions jump a pixel — the one thing a returning patient's muscle memory
notices.

⚠️ **THE ℞ IS DRAWN AS STROKES, NOT SET AS `<text>`.** A glyph would inherit whichever
face resolved first and land at a different size on every platform.

**The phone stacks rather than halves.** Two-up at 320px leaves 122px a side, which
truncates "Repeat prescription" and puts the arrow on top of the word — that failure is
reproduced deliberately in the harness (§6). One column, 8px apart, 52px of target each.

---

## 6 · Verifying it

```bash
node tools/qa/returning-band.mjs            # 180 checks
node tools/qa/returning-band.mjs --shots    # + frames to /tmp/rb-qa/
```

⚠️ **RUN ALONE** — SwiftShader rule, `tools/qa/README.md`.

**Every assertion here was made to fail on purpose before it was trusted**, which is the
repo's own standing rule and which caught three real harness bugs on the first run:

| broken on purpose | what fired |
|---|---|
| `.rb` margin cut to 20px | the fold check at all three desktop sizes, **and** `RB:CSS` parity |
| phone forced to two columns | the stack, the 8px gap, the band height, **and** 320px truncation on all four pages |
| a seventh entry spliced into `STEPS` | `PS:JS` off its pinned sum, `.ps-arm` = 7, progress row `07 01 02 03 04 05 06` |

Three bugs the first run had, all recorded in `tools/qa/README.md`:

1. **`.pg-steps li` returned 0** — the exact dead selector `NEXT_ITERATIONS.md` §3 records
   staying green for weeks. Once JS runs the rollback list is the `<noscript>`'s single
   text node; it is counted as text now.
2. **§7 compared `getBoundingClientRect()`** — `page.hover()` scrolls the element into
   view, so the *scroll* was reported as a layout shift on a page that never moved. It
   walks `offsetLeft`/`offsetTop` instead.
3. **GSAP and Lenis come from jsdelivr and a sandbox has no route to it** — the three
   doors loaded without their motion libraries and the console filled with tunnel
   failures that read as a page bug. Both are served from `node_modules` now, the way
   `doors-shots.mjs` does it.

⚠️ **§0 PINS THE PS SUMS RATHER THAN COMPARING THEM.** A compare-only check is happy with
four matching rows of the *wrong* sum, which is exactly what a well-meaning edit to the
sculpture produces.

**§8 is the loading state, §9 is the no-JS one.** "Preserve the layout across hover,
focus, pressed and *loading*" has to mean something testable: §8 blocks every `woff2`, so
the label swaps from the fallback's metrics to MediGyn NOW's and the *word's* width
changes — the box does not follow it, because the arrow is pushed by `margin-left:auto`
rather than sized by content and the height is a `min-height`. §9 loads with JavaScript
off, where `.ps` is `display:none` and the flower is its `<noscript>` list; the band is
plain markup with no script of its own and stands in both worlds (184px either way).

Re-run green after this round, each alone: `process-sculpture`, `doors-shots`,
`programs-page` (it prints `ALL GREEN` in caps — a lower-case grep misses it),
`doctors-pill`, `bhrt-shots`, `trt-page`, `prog-card`, `included-parity`.

---

## 7 · Open

- **Whether the follow-up should get its own destination** once a repeat-consultation
  booking exists (§3). Today it shares `#book` with every other booking pill, which is
  correct while that is the only booking destination the estate has.
- **The WhatsApp number is still the estate's placeholder** (`README.md`'s standing note,
  `index.html:4362`). The band inherits it rather than adding a second one — when the real
  number lands it is one find-and-replace across the estate, and the band is included in
  it by construction.
- **No i18n.** The four carriers carry no `data-i18n` bindings at all, so the band matches
  them. If the doors are ever translated, the band's five strings go with the rest.
