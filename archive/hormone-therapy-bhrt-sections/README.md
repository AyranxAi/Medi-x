# `/hormone-therapy-bhrt/` — two chapters taken out, 2026-08-26

**His call:** *"what you did by removing the 2 sections after the consultation page on this,
do also for the other 2 pages — remove those 2 but make it retrievable."* Door 2 was cut
first, earlier the same day; this is the same cut on door 1.

The two chapters that stood between the programme card and the doctors are here, **byte for
byte as they were served**, in the pieces each one was made of. Nothing was rewritten on the
way out and nothing here is a summary — these files ARE the sections, and restoring one is a
paste, not a rebuild.

| chapter | what it was | files |
|---|---|---|
| **04 · The month, mapped** | the 28-day ring — eight symptom chips seated on a cycle, each flipping to the answer we aim for | `04-the-month-mapped.html` · `.css` · `.js` |
| **05 · What are hormones** | the identical key — two estradiol skeletons stamped from one `<defs>` and slid together — plus the five messenger cards | `05-the-messengers.html` · `.css` · `.js` |

## This was tested, not asserted

1. **Each block is an exact substring of `/hormone-therapy-bhrt/index.html` as it was
   served** — the archive is the page, not a transcription of it.
2. **Pasting them all back at the four seams below reproduces the served original byte for
   byte**, compared against the pre-removal commit.

So the instruction below is not a hope. It was executed.

## Restoring — where each piece goes back

**FOUR seams, not three.** Every one is marked in the live file by a breadcrumb naming this
directory, so they are findable by grep:

    grep -n "archive/hormone-therapy-bhrt-sections" hormone-therapy-bhrt/index.html

1. **CSS, in the section shell** — near the top of the `<style>`, just after
   `.sec-head h2{font-size:…}`. ⚠️ **This is the seam people miss.** 04's chapter carried a
   one-line heading-balance rule that lives nowhere near the rest of its styles, and it is
   kept at the head of `04-the-month-mapped.css` — the comment and the
   `.month .sec-head h2{text-wrap:balance}` line under it. Without it, 04's heading breaks
   with `rhythm.` alone on the last line, and the widow **is** the emphasised word.
2. **CSS, in the stylesheet** — between `/* PS:CSS:END */` and
   `/* ══ THE pg-* MONEY GRAMMAR`. The rest of `04-the-month-mapped.css` (everything below
   its heading-balance rule), a blank line, then `05-the-messengers.css`.
3. **HTML** — in the `<body>`, between `</section>` closing `.programme` and the
   `<!-- THE DIALOG SHELL` comment. `04` then `05`.
4. **JS** — in the main IIFE, after the `pg-addon` money block and before the closing
   `})();`. `04` then `05`. The block's header comment above it was retitled when they
   left; it names all three engines in its own note, so put it back to
   *"The programme card · the month wheel · the identical key"*.

Then put back what the removal touched outside this file:

- **`tools/qa/bhrt-shots.mjs`** — the month and messenger checks are gated behind
  `HAS_DEVICE`, declared at the top of the file. Set it back to `true` and every one of
  them runs again: eight month labels against eight fallback chips, the ring armed with 28
  ticks, the label flip, the five `.msg-card`s and their span map, the two `<use>` elements
  in `.key-stage`, and the `month` and `messengers` shots. Put `'month'` and `'messengers'`
  back into the shot list beside `'programme'` and `'doctors'`.
- **`.msg-grid` is named in the doctors row's banner.** That sentence was rewritten on
  2026-08-26 to spell the four-tracks-seating-three technique out rather than point at an
  example, because the example stopped existing on every door at once. If 05 comes back,
  the sentence still reads correctly — leave it, or restore the pointer on **both**
  `/hormone-therapy-bhrt/` and `/modern-menopause/` at once. That banner is byte-identical
  across the two doors and a check in each file's stylesheet proves it; changing one alone
  breaks the guarantee.
- **Grounds.** Live order is now `.programme` (`--ps-ground`) → `.docs` (`--dawn`).
  Putting these back restores `--ps-ground` → `--dawn` → `--ivory` → `--dawn`, which is what
  the alternation was composed as. Nothing to edit; it just works again.

## What NOT to change if they come back

- **The ring is 28 DAYS and must stay 28 days.** `/modern-menopause/` used to run the same
  engine on a 24-HOUR CLOCK, because its reader has no cycle left and the pattern that
  remains is circadian. This page's reader still cycles, so the symptoms keep the cycle's
  schedule. Either swap says the opposite of what its page is for. (Door 2's clock is in
  `archive/modern-menopause-sections/` — the two are siblings and were cut on the same day.)
- **The month's hours are honest clusters, not diagnoses**, and the lede's
  *"yours is the one we test"* is what keeps that true. It is load-bearing: cut it and an
  illustration becomes a medical claim.
- **The two estradiol skeletons are STAMPED FROM ONE `<defs>`.** That is not a saving, it is
  the proof: the page's argument is *the molecule is identical*, and drawing the second one
  by hand would make the picture a claim rather than a demonstration. Never inline the
  second copy.
- **The key ships LOCKED.** Default CSS is the coincident state, so a reader with no JS gets
  the proof already made; the script arms the offset and lets it transition in. The reverse
  — hiding in CSS and revealing in JS — strands the graphic on every failure.
- **The ring is a state, not a width.** Everything absolute lives behind `.month-armed`,
  which the script adds only at ≥900px. Measured, not chosen: at 760 the outermost label
  overhangs the 680px stage and widens the document.

## What is NOT in here

The `.pg-list` styling the messenger cards borrow is the money grammar's and stays in the
live page — `05-the-messengers.css` carries only the chapter's own selectors. Nothing else
on the page referenced `.month-*`, `.msg-*` or `.key-*`, no navigation linked `#month` or
`#messengers`, and no sibling page or other harness reached into either chapter. That was
checked before the cut, which is why the removal is these files, one harness flag and
nothing else.
