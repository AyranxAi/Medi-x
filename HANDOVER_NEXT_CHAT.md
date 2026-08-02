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

**Live** = commit `c571e98`. **Local `main` is 2 commits ahead and NOT pushed:**

| commit | what |
|---|---|
| `22540d9` | Bodoni Moda replaces Didot · band rhythm · ch08 headline to 64px |
| `4618c10` | band label above the marks + centred · ch08 headline = Megante one-line · ch06 takes `product item.png` |

**Ask him before pushing these two** — the font swap is the most visible change
on the site and he had not seen it live when the session ended.

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

**Type.** Bodoni Moda (Google, variable, opsz axis) replaced Didot. It sets the
same string **11% wider at the same pixel size**, so all sizes came DOWN 10%:
Didot 80px and Bodoni 72px put the same ink on the page. Matching the old
numbers broke the hero to four lines AND dropped contrast below the floor.
**opsz 16, opsz 8 and weight 500 were all tested and all fail** — the problem
is width, not stroke weight.

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

**The band.** One `--band-gap` and a fixed `--label-h` drive everything; the
padding-bottom is `calc(--band-gap * 2 + --label-h)` **so the row of marks is
the band's optical centre** — his spec. Label is Megante, aligned to the P of
PRESS via a shared `--press-x`. The belt is two identical sets sliding -50%;
**verify `track === 2 × set`** after touching it. Marks must NOT be
`loading="lazy"` — off-screen horizontally inside `overflow:hidden` they never
fetch and the loop gains a hole.

**Logo sizing is by OPTICAL CORE (`--h`), not box.** Before changing any `--h`,
measure the file's alpha-bbox fill ratio: LVI Medical had the biggest `--h` on
the wall and the smallest ink on it, because its artwork filled 29.5% of a
400×400 file. `sponsor-09-matches-talent` is still untrimmed at 68.5%.

---

## 5. Open, in the order I would take them

1. **Push `22540d9` + `4618c10`** — needs his word only.
2. **The italic colour.** `#s1 h1 em, #s5 h2 em` ship IVORY, flagged provisional
   in the CSS. Rose and gold are **not available** on those two frames — 1.48
   to 2.39 against a 3.0 floor. A coloured italic needs a darker ground first.
3. **The scrim pass — this unlocks two other things.** Parked in
   `HANDOVER_MOBILE_UX.md` at his request ("im not good here its too much").
   One step deeper (`.88/.60/40/74` on `.sec.light::after`) is measured to work
   and would let the **body paragraph grow** (his ask, currently refused on
   evidence) and let the **headlines take chapter 07's full scale** (also his
   ask, currently refused).
4. **Phones.** Untouched by his instruction. Everything in
   `HANDOVER_MOBILE_UX.md` still stands.
5. **Destinations.** Every CTA and all six menu items are inert. Press button,
   Book, Quiz, Shop, Events all need URLs.
6. **The two films** (`JZ30fE0Nygw`, `HWZ8h3fgjvw`) left the site with the reel
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
