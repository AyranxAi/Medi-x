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

**Live head = `c7f1474` on `main`.** Working tree clean.

**⚠️ NOT ON MAIN YET:** the 2026-08-04 pass — the rimless ask bubble and the
three chapter-08 refinements (headline +8%, quotes −15%, capped cover crop) —
is on branch **`claude/medi-x-gin-ui-refinements-vpj444`**, deliberately not on
`main`, because he is mid-demo and `git push` to `main` IS the deploy. It lands
when he says so. Its details are in §4 below and in the CSS comments.

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
version. The article-width rule is in the CSS comment if wanted back.
Right panel is `--cream`, the footer's own token.

**The cover's crop is capped (2026-08-04).** It used to be plain `cover`, which
crops `675 − 1080·H/W` source px per side — a function of the WINDOW's ratio,
so the frame was perfect at 1440x900 (0px) and lost both ends on a wide, short
one (169px at 1920x900, which clipped the MADAME masthead and the IRINA Bond
signature; that is what he reported). `--frame-w:min(100%,max(92.31svh,517px))`
caps the crop at **90px a side** by capping the frame's width, leaving 48 source
px of air above the masthead (ink starts y138) and 54 below the signature (ink
ends y1206). It stays **full bleed** at 1280x800, 1440x900, 1512x830, 1600x900,
1920x1080 and 2560x1440 — `min()` means the cap only bites wide-and-short, worst
case 65px of ground a side at 1920x900. `margin-inline:auto` keeps her centred
in the left half; the grid is untouched. `.cpress__cta` offsets off the frame,
not the column, so PRESS never drifts onto the ground.
**⚠️ 92.31svh belongs to THIS artwork — re-measure the ink if the frame is swapped.**

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
