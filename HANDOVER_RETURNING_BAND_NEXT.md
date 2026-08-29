# The returning-patient band — **NOT SETTLED. IT IS GOING TO CHANGE.**

⚠️⚠️ **READ THIS BEFORE YOU TOUCH THE BAND.** He has said the band will be changed again;
what changes has not been decided. **Nothing in it is final and nothing in it should be
defended as settled.** This file exists so the next change is cheap and safe, not so the
current state is preserved.

Its history is [`HANDOVER_RETURNING_BAND.md`](HANDOVER_RETURNING_BAND.md) (three rounds,
why each thing is the way it is). This file is the opposite: **what you need to know to
change it**, and what will quietly break if you change the wrong thing.

Live at `bd8b829`. Four carriers: `/hormone-therapy-bhrt/`, `/modern-menopause/`,
`/testosterone-top-up/`, `/programs/`.

> **2026-08-29, later — THE CHANGE HAS BEGUN, AS A PREVIEW.** His approved comp moves the
> returning doors INTO the process chapter's editorial column: "Already a patient?" under
> the 01–06 dots, then two slim rows — icon and serif title on one line, nothing else.
> Three same-day cuts flattened the comp's card: the gold tick went, then the subtitles
> and the stacked layout ("say everything via the title"), and the titles became the
> matched pair **"Repeat consultation / Repeat prescription"** — the estate's real
> service names. Later the same day it was **rolled to all four carriers, byte-identical,
> and pushed to main** — the block is `RC:CSS / RC:HTML`, its own parity markers on the
> RB pattern, and the one-page preview drift `programs-page.mjs` §0 briefly read is
> healed. Still deliberate: the rows are **desktop only** (≤900px hides them) and **link
> nowhere yet**, and the RB band **stays on all four pages** — it carries the only
> working links and the only phone experience, so everything in this file still stands.
> The same push renamed petal 01 to **"Book the programme"** (meta dropped). Next: the
> phone composition — **`HANDOVER_RETURNING_ROWS_PHONE.md` is that iteration's brief** —
> then the rows' destinations, then the band's fate.

---

## 1 · What is there today — the baseline to diff against

```
ALREADY A PATIENT?                    ← .rb-eyebrow, sentence case in HTML, uppercased in CSS
Continue your care                    ← .rb-head

[ 📅  Book a follow-up          → ]   [ ℞  Repeat prescription       → ]
```

| | |
|---|---|
| eyebrow | "Already a patient?" · `--accent` 12px · `.24em` · `--door-deep` → `--gold-gloss` |
| heading | "Continue your care" · `--serif` 450 · `clamp(24px,2.1vw,29px)` · `--burgundy` |
| action 1 | calendar icon · "Book a follow-up" · → `#book` |
| action 2 | ℞ bottle icon · "Repeat prescription" · → WhatsApp `971555450797` |
| ground | full-bleed `var(--door-tint,var(--gold-tint))` |
| edges | `1px rgba(194,160,94,.38)` top **and** bottom, full bleed |
| desktop | ~232px tall · two equal columns · `max-width:980px` · actions **72px** · label 16px |
| phone | ~270px tall · one column · **8px** gap · actions **64px** · label 15.5px |
| padding | `.rb-inner{padding:40px 0}` desktop, `32px 0` phone |
| separation | `margin-top:clamp(104px,21vh,240px)` · `margin-bottom:clamp(64px,8vh,104px)` |

**Where it lives** — two marker blocks per page, four pages:

| block | what | byte-identical? |
|---|---|---|
| `RB:CSS:START…END` | all the styling | **yes, all four** — `a1ead3db21c7` |
| `RB:HTML:START…END` | the markup | **yes, all four** — `327a9675ebea` |

It sits inside `<section class="programme">`, after the flower's `<noscript>` rollback and
before the money card. It is **outside** the `PS:*` markers on purpose.

---

## 2 · Change this freely

Nothing below is load-bearing. Change it and the only cost is re-running the harness and
updating its expectation.

- **All the copy** — eyebrow, heading, both labels. ⚠️ Write the eyebrow in **sentence
  case** in the HTML; CSS uppercases it. That is the estate's rule for every eyebrow and it
  is what stops a screen reader spelling the words out.
- **The icons.** Both are inline SVG in the markup. ⚠️ The ℞ is drawn as **strokes, not
  `<text>`** — a glyph would inherit whichever face resolved first and land at a different
  size on every platform.
- **Sizes, padding, type scale, the 980px cap.**
- **Adding or removing an action.** The desktop grid is
  `repeat(2,minmax(0,1fr))` → make it 3 for a third action, and re-check 320px.
- **The hairlines, the hover and press colours.**

---

## 3 · ⚠️ Change these ONLY with the arithmetic — they look like taste and are not

### 3.1 · `margin-top` is a fold calculation, not spacing

`.ps-grid` stands at `min(80svh,880px)`, so a reader with the flower framed from its own
top has 20svh of slack underneath. **The requirement is that the complete flower viewport
contains no returning-patient UI.** `21vh` is what puts the band past the fold at the two
heights a desktop actually is:

| viewport | flower | separation | band top |
|---|---|---|---|
| 1440×**900** | 720 | 189 | **909** ≥ 900 ✓ |
| 1920×**1080** | 864 | 227 | **1091** ≥ 1080 ✓ |
| 1280×**800** | 640 | 168 | **808** ≥ 800 ✓ |

**Shorten it and the band appears inside the flower's frame.** `returning-band.mjs` §3
fails at all three sizes if you do — proven by cutting it to 20px. Making the band taller
or shorter is free; moving its **top** is not.

### 3.2 · The ground moved once and everything on it had to be re-measured

The rule `--gold-gloss`'s own token block states: *it is a function of the ground; anyone
who darkens the ground must bring it back.* Current, all clearing their floors:

| door | ground | eyebrow | heading | label on the button fill |
|---|---|---|---|---|
| BHRT | `#F2E1E2` | 9.817 | 9.817 | 5.863 |
| Menopause | `#F9E4DE` | 5.074 | 10.133 | 5.965 |
| Gold / Programs | `#F1E7D2` | **4.632** | 10.087 | 5.934 |

⚠️ **4.632 is the tightest pair in the estate's new work** — the gold pages' eyebrow.
`--gold-deep` on that ground is **4.080 and FAILS**, the same trap the flower's own eyebrow
records. **Darken any ground and the eyebrow goes under.** §7b re-derives all twelve
numbers from rendered pixels, so a token move fails the run rather than a reader.

### 3.3 · The per-door colour is a fallback chain, not four copies

```css
.rb{background:var(--door-tint,var(--gold-tint))}
.rb-eyebrow{color:var(--door-deep,var(--gold-gloss))}
```

The burgundy and rose doors define `--door-*`; the gold door and `/programs/` **carry none
on purpose** (`HANDOFF.md` §7) and fall through. **That fallback is the only reason `RB`
is one sum across four pages.** Write a colour per page and you fork the block four ways
and end the parity contract. If the gold door is ever given `--door` tokens, the band picks
them up with no edit.

### 3.4 · Every state must keep the box the same size

Hover and press move **colour only**; focus is an `outline` (paints outside the border box,
reflows nothing); the arrow's nudge is a transform on a `flex:none` span. **Change the
border *width* on any state and the two actions jump a pixel** — the one thing a returning
patient's muscle memory notices. §7 asserts the box is identical at rest, on hover and on
focus, and that `:active` changes paint only.

### 3.5 · The phone numbers are targets, not taste

**64px** actions, **8px** apart, one column. Two-up at 320px leaves 122px a side, which
truncates "Repeat prescription" and puts the arrow on the word — reproduced on purpose in
the harness. The label is deliberately **not** `nowrap`: if a future label doesn't fit,
wrapping costs height, and the alternative costs a sideways scrollbar on the whole document.

### 3.6 · Never `100vh`, never sticky, never a card

It is a **band**: content height, `position:static`, no radius, no shadow. §0 greps the CSS
for a viewport unit on any height and fails if one appears.

---

## 4 · ⚠️ The destinations — the part most likely to be got wrong

Neither action invents a flow, and that is deliberate. `README.md` lists four controls that
are **intentionally inert** and says plainly not to "fix" them with placeholder URLs.

- **Book a follow-up → `#book`** — the call strip every "Book a consultation" pill on the
  page already points at. Same anchor, same behaviour, **no new destination**. When a real
  booking flow lands, this moves with every other `#book` link and needs no decision.
- **Repeat prescription → WhatsApp**, same number and deep-link form as the footer and hero.

⚠️ **THE WHATSAPP TEXT IS THE ONE LINE ON THESE PAGES THAT IS NOT PER-DOOR.** Every other
WhatsApp link names its own service; this one reads *"Hello, I would like to request a
repeat prescription."* on all four, because the block is byte-identical and because a
service **request** is not a service **enquiry**. **Forking it per door is how `RB` drifts.**

⚠️ **NO INTERMEDIATE STEP.** Both are plain `<a>`s straight at the destination — no
"Continue care" gate, no dialog. §6 asserts there is no `<button>`, `<dialog>` or
`[data-book]` inside the band.

**Open, and his to decide:** whether the follow-up should eventually reach a *repeat
consultation* booking of its own (AED 395 + VAT, the Zoom follow-up) rather than the
discovery-call strip. That destination does not exist yet. **Do not invent it here.**

---

## 5 · What breaks if you change what

| you change | what fails, and where |
|---|---|
| the copy | §1's exact-string checks — update them, they are one line each |
| `margin-top` | §3's fold check, at all three desktop sizes |
| a ground or an eyebrow token | §7b's twelve contrast numbers, re-derived from pixels |
| the colour per page instead of via the fallback | §0 — `RB:CSS` drifts, four sums instead of one |
| a border width on hover/focus/press | §7 — the box moves |
| the phone gap or target size | §4 — 8px and 64px are asserted exactly |
| two columns on a phone | §4 **and** §5 — the 320px labels truncate |
| `height:100vh` anywhere | §0 |
| adding a dialog or gate | §6 |
| editing it on one page only | §0 — `RB` parity, instantly |

---

## 6 · Before you believe anything

```bash
npm install playwright@1.49.1 gsap@3.13.0 lenis@1.3.4 sharp
node tools/qa/returning-band.mjs            # 180 checks
node tools/qa/returning-band.mjs --shots    # + frames to /tmp/rb-qa/
```

⚠️ **RUN IT ALONE** — SwiftShader rule, `tools/qa/README.md`.

**Then run the estate**, because the band sits inside the flower's chapter:
`process-sculpture`, `doors-shots`, `programs-page`, `bhrt-shots`, `trt-page`, `prog-card`,
`doctors-pill`, `included-parity`, `nav-services` — each alone.

⚠️ **WHEN YOU ADD AN ASSERTION, MAKE IT FAIL ON PURPOSE ONCE.** It is the repo's own rule
and it earned its keep four times this session — it caught a dead `.pg-steps li` selector
returning 0, a scroll being reported as a layout shift, a clamped screenshot window that
silently sampled the wrong thing, and a burgundy-shaped colour test that went blind the
moment the slab stopped being burgundy.

---

## 7 · Still open on the band

1. **The follow-up shares `#book`** with every other booking pill (§4). Correct while that
   is the only booking destination the estate has.
2. **The WhatsApp number is the estate's placeholder.** The band inherits it rather than
   adding a second, so the real number is one find-and-replace across the estate.
3. **No i18n.** The four carriers carry no `data-i18n` at all, so the band matches them.
   ⚠️ If they are ever translated, **never add a `data-i18n` key without its English
   entry** — `t()` returns `''` for a key missing everywhere and `setText` applies it,
   blanking the element. Proven on the menu: four missing keys blanked four rows in all six
   languages.
