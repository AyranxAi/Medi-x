# Medi✦X — mobile legibility & UX, parked

**Status: PARKED 2026-08-02 at his request** ("can you set another md to tackle
the scrim and the phone ux/ui experience — currently I'm not good here, it's too
much"). The site-wide options in §4 are still unbuilt. The measurements are done
and the options are rendered, so this can be picked up cold without redoing any
of it.

Everything here is **pre-existing**, not caused by the copy work of 2026-08-02.
Nothing is getting worse by waiting.

> **Ch 05 is no longer in this backlog — closed 2026-08-04. See §8.** It was not
> fixed by any of the §4 options; it got its own per-chapter scrim when its
> photographs were replaced. §8 is worth reading before picking up §4, because
> the shape of the fix generalises and the site-wide A/B/C stops may not be the
> right instrument any more.

---

## 1. The problem, in one paragraph

On phones the chapter headlines and paragraphs sit on top of the brightest part
of each photograph, and several are effectively invisible. Chapter 06's headline
measures a **median of 1.18:1** against its background — the same brightness as
what is behind it. Desktop is fine; this is a phones-only failure.

## 2. Why — structural, verified in the CSS, not guesswork

| | ≥900px (fine) | <900px (broken) |
|---|---|---|
| `.sec` | `align-items:center` | `align-items:flex-end` — copy anchored to the bottom |
| scrim's dominant gradient | **left→right**, `.82` at the left edge | **bottom→top**, `.78` at the bottom, gone by 70% |
| result | copy sits inside the wash | headline is the **topmost** element of a **bottom-anchored** block, so it climbs out of the wash |

The taller the copy block, the further the headline rises out of the scrim it
depends on. (This is why deleting the chapter numbers and ✦ tags in `48cf378`
*improved* mobile — a shorter block sits lower. Every figure it touched improved.)

## 3. Measured, at 390×844

Headlines need 3:1 (large text). **Paragraphs need 4.5:1** — small text, and they
were failing too; this was only caught late.

| | headline | paragraph |
|---|---|---|
| Ch 01 | 4.72 ✓ | **2.43 ✗** |
| Ch 02 | **2.27 ✗** | 3.23 ✗ |
| Ch 03 | **2.79 ✗** | **2.55 ✗** |
| Ch 05 | **1.89 ✗** | **2.48 ✗** |
| Ch 06 | **1.26 ✗** | 3.07 ✗ |
| Ch 07 | 5.95 ✓ | 11.73 ✓ (its own night gradient — do not touch) |

## 4. The scrim options — built, measured, rendered, awaiting his pick

Only the **base** `.sec::after` / `.sec.light::after` rules change. The `≥900px`
blocks restate the whole `background`, so **desktop cannot be affected**.
Files were in the session scratchpad as `scrim-A/B/C.html`; the stop values:

- **A — reach (recommended).** Same weight at the bottom, carried much further up.
  light: `to top, rgba(30,20,16,.78) 0%, .52 46%, .18 76%, 0 96%`
  dark:  `to top, rgba(20,14,17,.86) 0%, .58 46%, .20 76%, 0 96%`
- **B — reach + a flat veil.** As A, but never reaching zero (`.22`/`.24` at 100%).
- **C — heavier.** `.86/.66/.40/.26` light. Biggest margins, visibly duller photos.

Results at 390 (worst-2%; **A clears everything B and C clear**, at the least
cost to the photography — that is why it is the recommendation):

| | NOW | A | B | C |
|---|---|---|---|---|
| Ch01 head / body | 4.72 / 2.43 | **7.76 / 4.68** | 8.07 / 4.99 | 9.85 / 6.80 |
| Ch02 head / body | 2.27 / 3.23 | **4.53 / 5.67** | 4.81 / 6.00 | 6.36 / 7.93 |
| Ch03 head / body | 2.79 / 2.55 | **4.89 / 4.97** | 5.51 / 5.22 | 6.78 / 7.05 |
| Ch05 head / body | 1.89 / 2.48 | **3.69 / 4.83** | 4.12 / 5.08 | 5.40 / 6.90 |
| Ch06 head / body | 1.26 / 3.07 | 1.66 / 5.46 | 1.77 / 5.78 | 2.48 / 7.74 |

## 5. Chapter 06's headline is the exception — three levers, none of them reach it

1. **Scrim** — best case 2.48 (option C), still short of 3:1.
2. **Crop.** Desktop already solves this with `#s6 .bg{background-position:12% center}`,
   but that override lives inside a `min-width:900px` block so **phones never get
   it**. Tested at 0% / 12% / 28% on mobile: moves 1.66 → 1.94 at best. At 390 the
   landscape frame is scaled so far up by `background-size:cover` that the bottles
   fill the visible slice wherever it is positioned.
3. **A new photograph** — tried, 2026-08-02. Made no difference: region luminance
   is effectively identical (left third .600 vs .596, bottom third .620 vs .620,
   whole frame .595 vs .592). **Lesson: measure a candidate photo's region
   luminance before swapping — it is one numpy pass and it would have saved the
   round trip.**

**What is actually left**, in the order I would try them:
- **Dark ink type on this frame, phones only.** The honest fix for a frame with
  no dark region, and the existing comment in the `#s6` CSS block already says so
  ("offered to the user 2026-08-01, not taken up yet"). The current photograph has
  clean pale ground upper-left, so ink type has somewhere to sit.
- **A soft dark plate behind the copy block**, phones only. Reliable, but it is
  new chrome on a site that just had its chrome stripped out — check with him.
- **A different or darker frame served under 900px** via `<picture>`/media query.

## 6. Other mobile UX threads worth a look while in here

- The paragraph now measures 16.8px at 390 after `48cf378`; it was 15.2px, which
  was the clamp floor winning at every viewport under ~1614px.
- Minimum slack at 390 is 342px, so there is vertical room to work with — a copy
  block that sat lower would land in the stronger part of the scrim for free.
- Chapter 07 is healthy on mobile and uses its own night gradient. Leave it alone.

## 7. How to measure any of this again

**Never pass `clip` to `page.screenshot()` — it is DOCUMENT-relative.** Passing
viewport coordinates silently crops the wrong section and returns confident wrong
numbers; that produced a wrong table in HANDOVER addendum 7 and shipped a bad
decision. Correct method: scroll the section to the top (correcting against the
live `getBoundingClientRect().top` in a loop), record per-**line** rects with
`range.getClientRects()`, set the text `visibility:hidden`, screenshot the **full
viewport**, then crop with PIL. Report the **brightest 2%**, not the median —
except over a dotted ground like ch07's globe, where the median is the honest read.

---

## 8. Addendum 2026-08-04 — chapter 05 is closed, and how

He uploaded a matched pair for the team chapter (a 1672x941 landscape and a
941x1672 portrait of the same restaged set) and asked for the wide one on desktop
and the tall one on phones. Wiring them in via the existing `data-src` /
`data-src-narrow` mechanism was the easy half. The frames alone made the numbers
**worse**, and that turned out to be the useful finding.

**What the frame swap alone did, at 390** (old `team-wide-tight.webp` → new
`team-clear-portrait.webp`, stock light scrim still in place):

| | headline | paragraph | cta |
|---|---|---|---|
| before | 2.56 | 3.89 | 8.97 |
| after | **2.37** | **2.51** | **6.39** |

The chapter's old comfort was never the scrim's doing. The plate it replaced had
a **charcoal shelving unit** sitting exactly under the copy column — that is where
its ~15:1 CTA came from. Take the furniture away and the stock scrim stands
exposed as having been carrying very little. **Any chapter whose numbers look
healthy because of something dark inside the photograph is one upload away from
failing.** Worth checking the others on that basis.

**The fix — reshape the gradient, do not just deepen it.** §2 diagnoses this
correctly: the phone scrim is bottom-anchored and gone by 70%, while the headline
is the topmost element of a bottom-anchored block. So the alpha was carried
further **up** rather than piled on at the bottom, which is where the copy is not:

```
#s5::after, <900px
  to top, rgba(30,20,16,.92) 0%, .74 32%, .54 58%, 0 84%
```

Desktop needed its own too, since the new plate has no dark region under the copy
either — modelled on the `#s6` block, `to right, .92 0%, .86 32%, .58 52%, 0 76%`.
The crop is anchored right (`#s5 .bg{background-position:100% center}`) so the
woman on the end is not cut at 1440/1280; that pulls the group into the column and
costs contrast, which the desktop scrim pays for.

**Shipped, worst line per element, repo method (§7), every size passing
head 3.0 / body 4.5 / cta 4.5:**

| | 1920 | 1440 | 1280 | 430 | 390 | 360 |
|---|---|---|---|---|---|---|
| headline | 8.76 | 6.55 | 4.16 | 6.60 | 5.93 | 4.26 |
| paragraph | 9.93 | 7.07 | 5.68 | 7.29 | 6.81 | 6.59 |
| cta | 13.07 | 12.87 | 12.87 | 11.99 | 11.68 | 11.48 |

For comparison with §4: option A would have put Ch05 at 3.69 / 4.83 and option C
at 5.40 / 6.90. The per-chapter reshape beats **C** on the headline at less cost
to the photograph, because it is spending alpha where that chapter's copy actually
sits instead of at a site-wide average.

**What this suggests for the rest of §4.** A single set of base stops has to serve
chapters whose copy blocks are different heights, so it overpays at the bottom and
still underreaches at the top. Ch 01/02/03 may each do better with the same
treatment — take the measurement, put the alpha where that chapter's headline
actually is. Ch 06's headline (§5) is still the hard one; nothing here moves it,
and dark ink type remains the honest answer there.

**Still open on ch 05, unrelated to legibility:** the woman at the left of the
group has left the team and is in both new frames — same person, same outfit, same
pose, the set was only restaged around her. She cannot be cropped out of either.
Flagged in the `#s5` markup; the fix is a frame she is not in.
