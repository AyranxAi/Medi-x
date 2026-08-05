# Medi✦X — THE PHONE PASS

**Read `HANDOVER_NEXT_CHAT.md` §1–§3 first** (what this is, his rules, the
deploy). This file is the brief for one job and one job only.
Written 2026-08-05, immediately after the logo/header/chapter pass went live.

---

## 0. His brief, in his words

> "stabilizing and making phone mode better like cta **no matter what it takes
> even if we have to regenerate alot of pictures** alright it has to be smooth
> and perfect and not glitchy and jump this is **luxury and we are not a trash
> website** this will impact the effect we have … even smooth scroll or
> something"

Read that twice before you start, because it inverts the constraint every
previous handover in this repo operated under.

**The budget is no longer the constraint. The FEELING is the spec.** Earlier
passes refused things on cost — "not re-fetching a megabyte on every resize",
"rather than shipping 8 MB", "budget frozen". Those refusals are now void where
they trade smoothness for bytes. **He has explicitly pre-authorised regenerating
many images.** If a plate needs re-shooting, re-cropping or re-encoding at 3×,
do it and tell him what you did.

**What he does NOT mean:** this is not licence to redesign. The type scale, the
colour board, the i-stem copy line, the chapter order and the eight frames are
settled and were fought for. This job is about *motion, loading and framing* —
how the site behaves, not what it says. If you find yourself changing a
headline, stop.

---

## 1. What "glitchy and jumpy" actually is — diagnosed, not guessed

Four distinct defects. They are not one bug and they do not share a fix.

### 1.1 The hero pops in. This is the loudest one.

`index.html`, the `load()` function in the inline script (search
`lazy background + reveal`). **Every** chapter's photograph lives in a
`data-src` attribute and is fetched by `new Image()` only *after* the JS parses
and runs:

```js
var narrow = bg.dataset.srcNarrow && matchMedia('(max-width:899px)').matches;
var src = narrow ? bg.dataset.srcNarrow : bg.dataset.src;
var img = new Image();
img.onload = function(){ bg.style.backgroundImage = 'url("'+src+'")'; };
```

The browser's **preload scanner cannot see a `data-` attribute**. So the single
most important image on the site — the hero — is not even *discovered* until
the parser has finished the document and executed the script. On a phone on
mobile data that is a visible beat of empty ivory, then a slab of photograph
appearing at once. That beat is the "glitch" he is describing.

`load(secs[0]); load(secs[1]);` runs eagerly for the first two chapters, so
this is not lazy-loading in the usual sense — it is *late* loading, which is
worse, because it looks deliberate.

### 1.2 The frame changes shape with the viewport

`background-size:cover` plus a `background-position` percentage means **every
viewport ratio shows a different crop**. Rotate a phone, open the keyboard,
change the URL-bar height on iOS Safari — the photograph re-frames under the
copy. Chapter 01's `svh`-based sizing makes this worse, not better.

There are now **five tuned percentages** in the sheet, every one of them
measured against one specific file:

| rule | value | measured against |
|---|---|---|
| `.bg` | `72% center` | the landscape plates generally |
| `.bg` ≥900px | `center` | — |
| `#s1 .bg` | `center` | `team-hero-portrait.webp` (2026-08-05) |
| `#s5 .bg` | `center` / `100%` ≥900 | `team-clear-portrait.webp` |
| `#s6 .bg` | `57%` / `12%` ≥900 | `products-visible*` (2026-08-05) |

⚠️ **Three separate bugs in this repo have been "a position inherited across a
frame swap."** Chapter 01 carried the landscape `72%` for weeks. Chapter 06 was
handed the wine plate's `37%`, then the leaf plate's `63%`. **The permanent fix
is to delete the category**, not to keep re-deriving numbers: compose each plate
FOR its breakpoint so plain `center` is correct, which is the sentence `#s5`
already makes in its comment.

### 1.3 A rotated tablet keeps the wrong frame

Same `load()`: after the first pick it runs `delete bg.dataset.src`, so a device
that crosses the 900px boundary later keeps whichever plate it loaded with. This
was documented and accepted at the time — "the accepted cost of not re-fetching
a megabyte on every resize". **`<picture>` makes it free, so the trade no longer
needs making.**

### 1.4 Everything is upscaled on a modern phone

**This is why it looks soft, and he has noticed without naming it.**

`team-hero-portrait.webp` is **941px wide**. On a 390px phone it renders **475
CSS px** wide, which on a **3× display needs 1424 device pixels**. It is being
blown up ~1.5×. Every portrait plate in the repo has this, because 941 was
adopted as "the site's standard plate size" back when the only concern was file
weight.

The sources are all still in `images/` at full resolution — `15% high phone.png`
(2160×3840) is the hero's, and the desktop/mobile originals for the rest are
beside it. **This is a re-encode, not a re-shoot.**

---

## 2. The fix, in the order it must happen

Do not reorder these. Each one makes the next cheaper.

### Step 1 — Re-encode every plate at 2× (do this FIRST)

New files, **never an overwrite** — that rule is absolute in this repo, it is
how the revert stays one line and how no CDN cache holds a stale frame.

- Portrait plates: 941 → **~1400px wide** (~162 KB → ~330 KB each)
- Landscape plates: 1672 → **~2400px wide**
- Keep q92; it is what every existing plate used and it has never been the
  problem.

If you do this and stop, the site is already visibly sharper on his phone.

### Step 2 — Compose each plate for its own breakpoint

For every chapter, crop the plate so that **plain `center` is correct** at that
breakpoint. Then delete `#s1/#s5/#s6`'s position overrides and the global `72%`.

This is the step he pre-authorised the image work for. It is also the step that
permanently kills §1.2 and the whole class of bug in §1.2's ⚠️.

### Step 3 — Replace the JS loader with `<picture>`

```html
<picture>
  <source media="(max-width:899px)" srcset="images/x-portrait-1400.webp 1400w" sizes="100vw">
  <source srcset="images/x-2400.webp 2400w" sizes="100vw">
  <img src="images/x-2400.webp" alt="" width="2400" height="1350"
       fetchpriority="high" decoding="async">
</picture>
```

- `fetchpriority="high"` **on chapter 01 only.** Everything below the fold keeps
  `loading="lazy"` — the point is to make the hero early, not to make everything
  compete.
- Explicit `width`/`height` on every `<img>`, so nothing reflows as it arrives.
- `object-fit:cover` + `object-position:center` replaces `background-size` /
  `background-position` entirely.
- Delete `load()`, its `IntersectionObserver`, and `data-src`/`data-src-narrow`
  from all eight chapters.

⚠️ `.bg` is also the element the `::after` scrims and `.sec--meno`'s CSS
gradients paint against. Chapter 07 has **no photograph at all** — it is four
stacked gradients — and chapter 08's `.bg` is likewise CSS. **Do not convert
those two.** Only the six photographic chapters change.

### Step 4 — Motion, and this is where "luxury" is won or lost

- **`scroll-behavior:smooth`** on `html`, wrapped in
  `@media (prefers-reduced-motion:no-preference)`. He named this himself. It
  affects the `#top` logo link and any in-page anchor.
- **`overscroll-behavior-y:none`** on `body` — kills the rubber-band that
  exposes the canvas colour at the top and bottom. (The canvas was already
  changed to ivory on 2026-08-04 *because* of that rubber-band; this removes
  the cause rather than repainting the symptom.)
- **The reveal animations.** `.reveal` fires on an `IntersectionObserver` at
  `threshold:.22` with a `.95s` transition. On a phone, scrolling fast means
  several chapters fire at once and it reads as lurching. Consider a shorter
  distance (26px is a lot on a 390px screen) and a tighter duration on
  small viewports.
- **`content-visibility:auto`** on off-screen chapters, with
  `contain-intrinsic-size` set, so the browser stops doing layout and paint for
  eight full-bleed sections at once. This is likely the single biggest scroll-
  smoothness win after the images.
- **Audit `will-change:transform`** on `.bg`. It is on all eight at once, which
  on a phone means eight promoted compositor layers permanently. That is a
  memory cost that can cause exactly the jank it was added to prevent. Measure
  before and after; do not assume it helps.
- **The menoSTART canvas globe** (`#meno-globe`) animates continuously. Check
  whether it runs when off-screen, and whether it respects
  `prefers-reduced-motion`.

### Step 5 — The CTAs, which he named first

He said "phone mode better **like cta**". Concretely, on 390px today:

- The two hero buttons **wrap to two lines**. He approved this on 2026-08-05
  when the alternative was shrinking them — but that was a choice between two
  bad options at the old label lengths. With the hero re-ordered, look again.
- `.cta` is `height:3.05rem` — fine — but check every CTA against a **48px**
  target, not 44px, and check the spacing between the stacked pair.
- **The floating stack.** There are now TWO discs bottom-right (WhatsApp above
  the assistant) plus a header WhatsApp icon. On a 390×844 phone that is a lot
  of furniture in one corner. He was asked and said keep all three — but he has
  not yet seen them on his own phone while scrolling. Re-ask with a screenshot.
- Check the discs against the **iOS home indicator** and Safari's collapsing
  bottom bar. `env(safe-area-inset-bottom)` is already in the `bottom:` calc;
  verify it actually clears on a real device, not just in the emulator.

---

## 3. How to know it worked

Do not ship this on "looks fine to me". Measure:

- **LCP on the hero, throttled to Fast 3G, on a 390px viewport.** Record the
  number BEFORE you start. That single figure is the whole of §1.1.
- **CLS must be 0.** Explicit `width`/`height` on every `<img>` is what buys it.
- **A scroll trace at 4× CPU throttle**, top to bottom. Look for long tasks and
  dropped frames, chapter by chapter. §1.2 and Step 4 both show up here.
- **Screenshot every chapter at 360 / 390 / 430 and rotated**, and diff against
  the same set before your change. Framing regressions are silent otherwise —
  this is exactly how chapter 06's crop was wrong twice.

⚠️ **The rig lies if you let it.** `HANDOVER_NEXT_CHAT.md` §6 is a list of
confident wrong numbers this project has already produced — stale viewport
overrides, dead IntersectionObservers, unpainted images that still return a
contrast ratio, sampling in the wrong pixel space. Read it before you trust a
measurement. And when two passes disagree, **stop measuring and look at the
crop.**

⚠️ **Playfair does not load in the sandbox.** Google Fonts is blocked by the
agent proxy, so every headline screenshot renders in a fallback serif. Anything
about line-breaking must be confirmed on the real domain.

---

## 4. Traps specific to this job

- **`git fetch origin main` before you build AND again before you push.** He
  uploads files through the GitHub web UI mid-session and other sessions push.
- **Commit author MUST be `AyranxAi <ayranxai@gmail.com>`** or Vercel refuses
  the build. This was nearly shipped wrong on 2026-08-05; the branch had to be
  rebased with
  `--exec 'git commit --amend --no-edit --author="AyranxAi <ayranxai@gmail.com>"'`
  before merging. Set `git config user.email` at the start and save yourself
  the rebase.
- **`main` IS the deploy.** There is no staging. He is demoing this to the
  owners — ask before pushing anything visibly different.
- **Never overwrite an image filename.** New name, every time.
- **Do not touch chapter 07's gradients or chapter 08's collage `.bg`.** Neither
  has a photograph.
- **The two inert booking CTAs and the quiz stay inert** — his standing
  decision, re-confirmed 2026-08-05. Do not wire them to WhatsApp to tidy up.
  That is the specific option he turned down.
- **Chapter 05 still ships a former team member.** Unrelated to this job, but if
  you are regenerating plates anyway, that frame is the one that most needs it.
  See `HANDOVER_NEXT_CHAT.md` §5 item 0.

---

## 5. The one-line summary for whoever picks this up

The site is not jumpy because of its CSS. It is jumpy because **the hero image
is invisible to the preload scanner, every plate is upscaled 1.5× on a modern
phone, and the crop is recomputed from a magic percentage on every viewport
change.** Fix those three in that order, then spend the remaining effort on
scroll motion. He has pre-authorised the image work. Take him at his word.
