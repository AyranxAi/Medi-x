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

**Everything is pushed. Live head = `3a8248a`.** Working tree clean.

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

### Chapter 08

Two equal full-bleed halves (`1fr 1fr`). The client rejected the article-width
version; the accepted cost is that a 4:5 cover in a ~16:9 column gets cropped
top and bottom. The article-width rule is in the CSS comment if wanted back.
Right panel is `--cream`, the footer's own token.

**Its headline is at the wall.** One line is the rule, so the ceiling is the
panel's text width ÷ the string's width-per-px in Megante:

```
1280 → 29.4    1440 → 33.0    1600 → 36.7    1920 → 45.4    2560 → 62.8
```

Shipped `clamp(1.05rem,2.16vw,2.75rem)` = 27.6 / 31.1 / 34.6 / 41.5 / 44.
**Below 1600 only ~2px of margin remains and 1440 is the width he works at.**
To go meaningfully bigger the STRING must get shorter, not the type larger.

**⚠️ Multilingual caveat, pre-existing, not caused by the sizing:** German,
French and Russian are ~60% longer than English and take TWO lines at any size
that keeps English on one. Arabic and Chinese are fine. Nothing overflows — they
wrap cleanly. Either those three translations get shortened to English's rhythm,
or two lines is accepted there. **His call, not yet asked.**

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
