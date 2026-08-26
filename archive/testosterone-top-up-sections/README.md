# `/testosterone-top-up/` — two chapters taken out, 2026-08-26

**His call:** *"what you did by removing the 2 sections after the consultation page on this,
do also for the other 2 pages — remove those 2 but make it retrievable."* Door 2 was cut
first, earlier the same day, then door 1; this is the same cut on door 3.

The two chapters that stood between the programme card and the doctors are here, **byte for
byte as they were served**, in the pieces each one was made of. Nothing was rewritten on the
way out and nothing here is a summary — these files ARE the sections, and restoring one is a
paste, not a rebuild.

| chapter | what it was | files |
|---|---|---|
| **04 · What you told yourself** | the ledger — eight things a man says on the left, what each one is actually called on the right, the second column arriving as you scroll | `04-what-you-told-yourself.html` · `.css` · `.js` |
| **05 · What we measure** | the four monitoring markers, each with what it is and why it is watched | `05-what-we-measure.html` · `.css` |

⚠️ **05 HAS NO `.js` AND THAT IS NOT AN OMISSION** — its four cards are static markup. The
whole chapter is two files.

## This was tested, not asserted

1. **Each block is an exact substring of `/testosterone-top-up/index.html` as it was
   served** — the archive is the page, not a transcription of it.
2. **Pasting them all back at the four seams below reproduces the served original byte for
   byte**, compared against the pre-removal commit.

So the instruction below is not a hope. It was executed.

## Restoring — where each piece goes back

**FOUR seams, not three.** Every one is marked in the live file by a breadcrumb naming this
directory, so they are findable by grep:

    grep -n "archive/testosterone-top-up-sections" testosterone-top-up/index.html

1. **CSS, in the section shell** — near the top of the `<style>`, just after
   `.sec-head h2{font-size:…}`. ⚠️ **This is the seam people miss.** 04's chapter carried a
   one-line heading-balance rule that lives nowhere near the rest of its styles, and it is
   kept at the head of `04-what-you-told-yourself.css` — the comment and the
   `.ledger .sec-head h2{text-wrap:balance}` line under it. The ledger's heading is two
   sentences, the only one on the estate that is; without the rule it breaks badly.
2. **CSS, in the stylesheet** — between `/* PS:CSS:END */` and
   `/* ══ THE pg-* MONEY GRAMMAR`. The rest of `04-what-you-told-yourself.css` (everything
   below its heading-balance rule), a blank line, then `05-what-we-measure.css`.
3. **HTML** — in the `<body>`, between `</section>` closing `.programme` and
   `<div class="pxd" id="pxd">`. `04` then `05`.
4. **JS** — in the main IIFE, after the `pg-addon` money block and before the closing
   `})();`. 04 only. The block's header comment above it was retitled when the ledger left;
   put it back to *"The programme card · the ledger"*.

Then put back what the removal touched outside this file:

- **`tools/qa/doors-shots.mjs`** — the `testosterone-top-up` row keeps `device: null` in
  place of the device keys. Restore all eight:

      device: 'ledger', deviceSel: '[data-ledger]', armedCls: 'in',
      labelSel: '.ledger-list li', labels: 8, ticks: 0,
      extra: '.mk-card', extraCount: 4,

  and put `'told'` and `'markers'` back into `sections` between `'programme'` and
  `'doctors'`. The harness's `P.device` branches are still in the file, unchanged and
  unreachable — they were left standing on purpose so **a restore is config only**. The
  `else` branch that runs today asserts the opposite thing (zero labels, zero `extra`,
  zero ticks) and stands down of its own accord once `device` is set.
- **`tools/qa/trt-page.mjs`** — the ledger and marker counts are gated behind `HAS_DEVICE`,
  declared at the top of the file. Set it back to `true` and the eight-ledger-rows and
  four-markers checks run again.
- **Grounds.** Live order is now `.programme` (`--ps-ground`) → `.docs` (`--dawn`).
  Putting these back restores `--ps-ground` → `--dawn` → `--ivory` → `--dawn`, which is what
  the alternation was composed as. Nothing to edit; it just works again.

## What NOT to change if they come back

- **The ledger's two columns ARE the argument.** The left is what a man says to himself
  ("I'm just getting older"), the right is what that is actually called. The pairing is the
  whole chapter; a version with one column is a list of symptoms and says nothing.
- **The right column ARRIVES, and the finished state is the DEFAULT.** `.armed` is added by
  script and the CSS hides the right column only when it is present. That order is
  deliberate: no-JS, a thrown error and reduced motion all render both columns, and the
  animation is something the script opts into rather than something a failure could strand.
  The reverse has stranded a column on every project that has tried it.
- **The four markers are named tests, not promised results.** They say what is measured and
  why it is watched. Do not let them grow into outcomes.
- **The eight ledger rows are the same eight as the scene's fallback chips**, in the same
  order. Change one list and change the other; the harness asserted the pairing.

## What is NOT in here

Nothing outside these chapters used `.ledger-*`, `.lg-*` or `.mk-*`, no navigation linked
`#told` or `#markers`, and no sibling page or other harness reached into either chapter.
⚠️ `.ledger` also appears in `tools/qa/peptide-page.mjs` and `tools/qa/programme-lab.mjs` —
**those are different things entirely** (peptide's retired section 06, and a lab page's
included/excluded list) and neither was touched. That was checked before the cut, which is
why the removal is these files, two harness flags and nothing else.
