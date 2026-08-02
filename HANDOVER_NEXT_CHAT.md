# Medi✦X — START HERE (next chat)

**Read this file first. Then `HANDOVER.md` addenda 9–11 only if you need the
detail.** Written 2026-08-03 at the end of a very long session.

---

## 1. What this is, in one paragraph

`AyranxAi/Medi-x`, a deliberately plain static site — **one `index.html`** with
inline CSS/JS plus `images/` and `fonts/`. No build step. Eight full-bleed
chapters plus a sponsor band and footer. **Live at
https://medi-x-gin.vercel.app**, which tracks `main`; `git push` IS the deploy.
Local clone: `~/Documents/medi-gyn/medi-x`. Commit author must be
**AyranxAi <ayranxai@gmail.com>** (Vercel Hobby rule) or the deploy is refused.

**He is showing this to the owners.** Treat live as a demo surface: ask before
pushing anything that visibly changes while he may be mid-demo.

---

## 2. State right now

**Everything through `b474e39` is PUSHED and live.** Nothing is held back.

The editorial face went Didot → Bodoni Moda → **Playfair variable** inside one
session; only the last one is live, and the two intermediate commits are in the
log if the reasoning is ever needed.

---

## 3. The rules he has set. Do not relearn these the hard way.

1. **The hero headline is THREE lines. Never four.** "Your hormones. / Your
   health. / Your best life." Verify 390 → 2560 after any type change.
2. **Show options, never pick for him** — render 3–5 lettered variants over the
   REAL page at TRUE width, with measured numbers, and let him choose. He has
   praised this repeatedly. Taste lives in the *degree*, not the direction.
3. **Build his idea before arguing against it.** Twice this session I argued
   from measurements against something he asked for, and twice the right move
   was to build it, measure it, and show him. He decides.
4. **When he compares one section to another, read that section's CSS before
   assuming which property he means.** "Copy chapter 07" meant the *anchoring*,
   not the size. I guessed size twice and was wrong twice.
5. **Ask which FILE when he attaches an image.** Downloads holds three
   near-identical product renders. I shipped the wrong one once already.
6. **Never tint another company's logo.** Fetch their own dark/mono artwork.
7. **New filename, never an overwrite,** for any replaced image — no cache can
   then serve a stale frame, and revert is one line.

---

## 4. The load-bearing technical facts

**Layout.** `.inner` was `max-width:1400px` centred, so past 1400 the left
margin grew without limit (18.5% at 1920, 26.4% at 2560) while the headline
capped out at 1230px. Chapter 07 already solved this for itself; that rule is
now `@media (min-width:1500px){ .sec .inner{max-width:none} }` for every
chapter. **Below 1500 nothing changed and his own 1440 view is untouched** —
which is also why type growth is scoped `>=1500px` and nowhere else.

**Type — PLAYFAIR VARIABLE (not Playfair Display), weight 450, `opsz` pinned
to 30 with `font-optical-sizing:none`.** His spec. Left alone opsz tracks the
font-size, so a 103px headline gets the 103pt drawing and its hairlines go as
thin as the family allows; pinned low they thicken. It also has a DRAWN italic,
which is why it beats GFS Didot for the `<em>` phrases.

**⚠️ NEVER carry a px size across a font swap.** Measured width of "Your
hormones." per pixel of font-size — this governs line count AND how far type
reaches into a frame's bright half:

    Didot 6.399  ·  Playfair @ opsz 30  6.609  ·  Bodoni Moda 7.099

Three faces in one session, three sets of numbers. Bodoni at the Didot sizes
broke the hero to four lines and dropped ch02 to 2.63. **Sturdier strokes are
NOT the fix for that** — opsz 16, opsz 8 and weight 500 were all tried and all
failed, because the problem is width.

**Contrast is the constraint on this whole site.** Ivory text on photographs;
large text needs 3.0, small text 4.5. Method that survives: hide the text with
`visibility:hidden`, shoot the FULL viewport, crop per LINE via
`range.getClientRects()` afterwards, report the **brightest 2%**.
Current worst values: headlines all clear at 1440 and 1920; **the body
paragraph does not — 4.09 at 1920, and growing it makes it worse.** That is the
next real job (see §5).

**Chapter 08.** Left column is sized to the 4:5 cover, not 50/50:
`min(60%,calc(max(100svh,560px) * 4 / 5)) 1fr`. Right panel is `--cream`, the
footer's own token.

**The band.** The "Our sponsors" label is GONE (his call — "kinda obvious and
just ugly"), so the marks are the only thing in it and are its centre by
definition. The space the label vacated went to the MARKS, not to padding:
`--k` 1.55 → 2.15, tallest mark 84px → 117px, band ~176–188px.
`--press-x` and `--label-h` are gone with the label; if a label ever returns,
the balancing rule was `padding-bottom: calc(--band-gap*2 + --label-h)`.
The belt is two identical sets sliding -50%;
**verify `track === 2 × set`** after touching it. Marks must NOT be
`loading="lazy"` — off-screen horizontally inside `overflow:hidden` they never
fetch and the loop gains a hole.

**Logo sizing is by OPTICAL CORE (`--h`), not box.** Before changing any `--h`,
measure the file's alpha-bbox fill ratio: LVI Medical had the biggest `--h` on
the wall and the smallest ink on it, because its artwork filled 29.5% of a
400×400 file. `sponsor-09-matches-talent` is still untrimmed at 68.5%.

---

## 5. Open, in the order I would take them

1. **The italic colour.** `#s1 h1 em, #s5 h2 em` ship IVORY, flagged provisional
   in the CSS. Rose and gold are **not available** on those two frames — 1.48
   to 2.39 against a 3.0 floor. A coloured italic needs a darker ground first.
2. **The scrim pass — this unlocks two other things.** Parked in
   `HANDOVER_MOBILE_UX.md` at his request ("im not good here its too much").
   One step deeper (`.88/.60/40/74` on `.sec.light::after`) is measured to work
   and would let the **body paragraph grow** (his ask, currently refused on
   evidence) and let the **headlines take chapter 07's full scale** (also his
   ask, currently refused).
3. **Phones.** Untouched by his instruction. Everything in
   `HANDOVER_MOBILE_UX.md` still stands.
4. **Destinations.** Every CTA and all six menu items are inert. Press button,
   Book, Quiz, Shop, Events all need URLs.
5. **The two films** (`JZ30fE0Nygw`, `HWZ8h3fgjvw`) left the site with the reel
   and have no home. He is content for them to live behind Press later.

---

## 6. The verification rig — rebuild it, do not fight it

`puppeteer-core` is NOT installed. Chrome is driven over **raw CDP with Node's
built-in WebSocket**: `scratchpad/cdp.mjs`, ~70 lines. Serve the site with
`python3 -m http.server` from a scratchpad copy.

**Every one of these produced a confident wrong number this session:**

- **Check the server is yours.** A parallel session held ports 8899 and 8901;
  `index.html` returned 200 from *their* directory while my files 404'd.
  `lsof -p $(lsof -ti :PORT) | grep cwd`.
- **Assert the viewport.** A stale `Emulation` override silently scaled a
  requested 1280 to a real 1600 — every vw-based measurement was wrong while
  the log said otherwise. Re-apply after navigation and check `innerWidth`.
- **IntersectionObserver, rAF, CSS transitions and smooth scroll are all dead
  headless.** Add `.in`, *stamp* end states with `!important`, and set
  `scrollBehavior='auto'` before assigning `scrollTop` — then **assert the
  section landed**.
- **`img.decode()` never resolves for an unfetched lazy image.** Race it.
- **A flat crop is a MISSING image, not a dark one** — and it will hand you a
  contrast number regardless. An `<img>` can be complete, decoded, opacity 1,
  correctly sized and *still not painted*. Gate on the crop's standard
  deviation and retry.
- **Sample in the screenshot's pixel space.** CSS-px rects against a dsf-2 shot
  gave a button a 4.66 "pass" that was really 2.0.
- **An impossible number means the script is wrong, not the page.** A contrast
  ratio below 1.0 cannot exist.
- **When two passes disagree, stop measuring and LOOK at the crop.**

---

## 7. Where the rest is written

- `HANDOVER.md` — addenda 9, 10, 11 cover this session in full detail.
- `HANDOVER_MOBILE_UX.md` — the parked mobile/scrim brief, written to be picked
  up cold.
- Commit messages are long on purpose; `git log` is the reasoning record.
