# `/modern-menopause/` — two chapters taken out, 2026-08-26

**His call, on Irina's comments:** *"2 section after that will be removed the circle and
the bar — in this case make them an archive so if i want them ever again they can be back,
but take them out now."*

The two chapters that stood between the programme card and the doctors are here, **byte
for byte as they were served**, in the three pieces each one was made of. Nothing was
rewritten on the way out and nothing here is a summary — these files ARE the sections, and
restoring one is a paste, not a rebuild.

| chapter | what it was | files |
|---|---|---|
| **04 · The day, mapped** | the 24-hour dial — eight symptom chips seated on a clock face, each flipping to the answer we aim for | `04-the-day-mapped.html` · `.css` · `.js` |
| **05 · The long view** | the life-bar — "a third of your life happens after", plus the three message cards (Bone & muscle · Brain & heart · Skin & intimacy) | `05-the-long-view.html` · `.css` · `.js` |

## Why they are ONE archive entry and not two

They came out together and they read as a pair — the dial is *the day* and the bar is *the
life*, one zoomed out of the other, and 05's `.lv-line` ("Estrogen was never only about the
cycle…") answers the argument 04 opens. Bringing back one alone is a decision, not a
paste; it is fine, but know that you are keeping half a movement.

## This was tested, not asserted

Two checks were run at the time of the cut, and both are cheap to re-run if you doubt the
files:

1. **Each of the six blocks is an exact substring of `/modern-menopause/index.html` as it was
   served** — the archive is the page, not a transcription of it.
2. **Pasting all six back at the three seams below reproduces the served original byte for
   byte** in all three regions (CSS, HTML, JS), compared against the pre-removal commit.

So the instruction below is not a hope. It was executed.

## Restoring — where each piece goes back

`/modern-menopause/index.html`, three insertion points. Each is marked in the live file by
a one-line breadcrumb naming this directory, so the seams are findable by grep:

    grep -n "archive/modern-menopause-sections" modern-menopause/index.html

1. **CSS** — in the `<style>`, between `/* PS:CSS:END */` and
   `/* ══ THE pg-* MONEY GRAMMAR`. `04-the-day-mapped.css` first, then a blank line, then
   `05-the-long-view.css`. That order is the served order and the cascade never depended
   on it, but the next reader's eye does.
2. **HTML** — in the `<body>`, between `</section>` closing `.programme` and
   `<div class="pxd" id="pxd">`. `04` then `05`.
3. **JS** — in the main IIFE, after the `pg-addon` money block and before the closing
   `})();`. `04` then `05`.

Then put back what the removal touched outside these files:

- **`tools/qa/doors-shots.mjs`** — the `modern-menopause` row keeps `device: null` in place
  of the device keys. Restore all eight:

      device: 'dial', deviceSel: '[data-dial]', armedCls: 'dial-armed',
      labelSel: '.dial-label', labels: 8, ticks: 24,
      extra: '[data-lv]', extraCount: 1,

  and put `'day'` and `'longview'` back into `sections` between `'programme'` and
  `'doctors'`. The harness's `P.device` branches are still in the file, unchanged and
  unreachable — they were left standing on purpose so **a restore is config only**. The
  `else` branch that runs today asserts the opposite thing (zero labels, zero `extra`,
  zero ticks) and stands down of its own accord once `device` is set.
- **Grounds.** Live order is now `.programme` (`--ps-ground`) → `.docs` (`--dawn`).
  Putting these back restores `--ps-ground` → `--dawn` → `--ivory` → `--dawn`, which is
  what the alternation was composed as. Nothing to edit; it just works again.

## What NOT to change if they come back

- **`.dial` is a 24-HOUR CLOCK and must stay one.** The sibling `/hormone-therapy-bhrt/`
  seats its symptoms on a 28-day ring because its reader still cycles; this reader does
  not, so the pattern that remains is circadian. Swapping either page's unit says the
  opposite of what that page is for. The full argument is in the section's own banner,
  which travelled with the markup — read it before touching a coordinate.
- **The dial's hours are honest clusters, not diagnoses**, and the lede's
  *"yours is the one we test"* is what keeps that true. It is load-bearing: cut it and an
  illustration becomes a medical claim.
- **The long view's numbers are rounded public-health figures** (last period around 51,
  life into the eighties, so ≈ a third after) and the graphic says so in its own caption.
  Do not sharpen them into precise statistics without a cited source on the page — a
  precise number invites a challenge a rounded one does not.
- **The dial is a state, not a width.** Everything absolute lives behind `.dial-armed`,
  which the script adds only at ≥900px. That number is measured, not chosen: at 760 the
  outermost label overhangs the 680px stage and widens the document. The QA harness's
  no-sideways-scroll check at 13 widths is what catches it.

## What is NOT in here

The `.pg-list` styling the three message cards borrow is the money grammar's and stays in
the live page — `05-the-long-view.css` carries only `.msg-*`, which is longview-only.
Nothing else on the page referenced `.dial-*`, `.lv-*` or `.msg-*`, and no navigation, no
sibling page and no other harness linked `#day` or `#longview`. That was checked before
the cut, which is why the removal is these three files and a config row and nothing else.
