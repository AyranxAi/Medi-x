# Peptide Therapy — state of play

**Branch:** `claude/peptides-color-structure-b2gzem` · **Written:** 2026-08-16 ·
**Next topic:** the booking process.

Read this before `HANDOVER.md`. That file is the full round-by-round record (14 rounds, and
every measured argument is in it); this one is the ten-minute version a fresh session needs
to start work without re-deriving anything.

---

## 1 · The one thing to know first

⚠️ **`peptide-therapy/index.html` HAS NOT BEEN TOUCHED ON THIS BRANCH.** Not one line. The
live chapter 05 is exactly as round 11 left it. Everything below is **two prototype labs**
built beside it, waiting on his approval before anything ports.

If a task says "change the peptide page", check whether it means the live page or the lab.
They have diverged deliberately and completely.

---

## 2 · What is on this branch

| File | What it is |
|---|---|
| `peptide-therapy/structure-lab.html` | Five alternative structures for chapter 05, drawn to scale. A judging instrument. |
| `peptide-therapy/journey-lab.html` | **The live proposal.** Chapter 05 as one interactive full-bleed section on ink. |
| `tools/qa/structure-lab.mjs` | 37 assertions. `node tools/qa/structure-lab.mjs` |
| `tools/qa/journey-lab.mjs` | 89 assertions across 3 widths + `?view=` solo + **JS disabled** + reduced motion. |
| `peptide-therapy/HANDOVER.md` | Rounds 1–14, full detail. Rounds 12–14 are this branch. |

Both labs are **published as private Claude artifacts** and he may show them to the owner —
**do not delete, overwrite or re-purpose either**; republishing the same file path keeps the
URL stable (the round-7 rule, still in force):

- Structure lab — https://claude.ai/code/artifact/b4b68824-b941-42b8-a575-f6669bb3ae45
- Journey lab — https://claude.ai/code/artifact/384f0c18-d508-4f83-ac88-86538596d474
  (append `?clean=1` for the section alone with no lab furniture; `?clean=1&view=step3` for
  any single view)

**Setup for QA:** `npm install --no-save playwright@1.49.1`. Chromium is already at
`/opt/pw-browsers` and both harnesses search for it rather than pinning a path.

---

## 3 · The journey lab, as it stands

One section. At rest it is **"Ready to begin?" and two buttons — nothing else, 799px**. Choose
a path → that symptom list takes the full screen → `›` → the seven steps, one at a time, on
chevrons at the bottom left, keyboard `←` `→`, or the bead chain in the nav.

- **Ink, full bleed, `min-height:100svh`.** Ground is the page's own peptide-bond canvas
  engine (same seed 424242, same geometry as the hero's plate D), quietened to 7 chains at
  .55× speed, under a veil that leans right so type sits on near-solid ink.
- **Progressive enhancement.** All ten views and both symptom lists are in the markup; the
  takeover exists only under `html.js`. Kill the script and the whole chapter is still there.
- **The eight services are selectable in step 1** and the choice rewrites the closing CTA.

---

## 4 · Decisions locked, with his words

| Decision | His instruction (2026-08-16) |
|---|---|
| One journey for both paths | *"technically either choosing men or women doesn't really matter as it leads to the same thing and journey"* — the gate picks the symptom list and nothing else. |
| Blood work only | *"it's going to be blood test only required not Bozat and not the Dutch Test"* — **BOZAT scans and "The DUTCH Plus" are struck from both labs**, and `journey-lab.mjs` asserts their ABSENCE so they cannot drift back in from his source document. |
| The section at rest is the question | *"I want one section where it says 'Ready to begin?' and only that word and male and female button"* — the chapter headline and lede were removed; the question is now the section's only `<h2>`. |
| Chevrons do all navigation | *"a chevron button < > on the bottom left to go back and choose again or to go through"* — there is no CTA button until step 7. |
| Both introductions cut | The women's *"Often, we don't understand…"* and both of the men's paragraphs. Straight from the title to the list. |
| Every symptom item kept | His call was to set them well, not to cut them. Hairline per cell, no dashes. |
| Ink, not glacier | *"it doesn't have to be this colour blue"* + *"do you think clinique la prairie will design it like this, it has no aesthetic"*. |
| PCOS → PMOS | Applied in both places. **Expansion still pending — see below.** |
| 06 (included/excluded) is gone as a section | Its nine verbs were the journey said twice; the exclusions became the *Priced separately* footnote inside step 7. |

⚠️ **Round 11's copy corrections stand and must not be re-reverted.** His later pastes restore
the source's original typos (*"making it a natural as possible for our body"*, *"Endometrioses"*,
*"Disminished"*, the two *"Those who has"*). The corrections are the agreed text.

---

## 5 · Open — waiting on him, do not guess

1. **The PMOS expansion.** He chose "PMOS + expansion" and the words never arrived. Both
   occurrences ship as the bare acronym with a gold dashed underline and a `title`.
   **Do not invent it** — clinical term, regulated page.
2. **The questionnaire screenshot.** `medi-gyn.com` is **blocked by this environment's egress
   proxy** (403 on CONNECT; `curl` and WebFetch both refused — the same wall round 3 hit
   fetching the doctor portraits). Step 2 carries a built browser frame at 16:10 with the live
   link; drop the image in and replace `.shot-body` with an `<img>`.
3. **Women see a testosterone-only panel.** One journey for both paths was his call, so step 3
   shows Total Testosterone / SHBG / Free Testosterone to everyone. That is what his source
   contains; **no female marker was invented to fill it.** Raised twice, his call.
4. **The three P's are homeless.** "Preventative. Precision. Personalised." came off when the
   headline went. The hero kicker still carries the words.
5. **Ink breaks the page's ground alternation.** The page runs a strict dawn/ivory alternation
   from 03 to the call strip; this section is now the only dark ground. Deliberate for a
   takeover, but the sections either side want a look.
6. **The eight selection routes nowhere.** It rewrites the CTA text; the link is still `#book`
   like every booking control on both pages. Needs the URL shape from his booking system.

---

## 6 · Traps — every one of these was a real bug here

- ⚠️ **The display-cascade family. Three in two rounds; assume a fourth exists.**
  `.js .wiz-only{display:block}` is (0,2,0) and flattened `.picks{display:grid}`.
  `.chain{display:flex}` beat the UA's `[hidden]{display:none}` while `el.hidden` reported
  `true`. And the enhancement was once written inverted, so a reader without JS got an empty
  stage. **Rule: hide under `html:not(.js)`, never show under `.js`; spell out
  `[hidden]` for anything that sets its own display; and assert COMPUTED DISPLAY, never the
  property.**
- ⚠️ **`<meta charset="utf-8">` must stay the first line**, ahead of the embedded font blob, or
  it falls outside the first 1024 bytes and the whole file renders Latin-1 mojibake over
  `file://`. Nothing but a screenshot notices.
- ⚠️ **A CSS animation does not restart** on an element that already carries the class. Remove
  it and re-add on the next frame, or every step after the first arrives with no entrance.
- ⚠️ **`innerText` returns TRANSFORMED text** — `text-transform:uppercase` is already applied,
  so any assertion against label text must be case-insensitive.
- ⚠️ **No `overflow` on `.prog`.** It would make the section a scroll container and kill the
  sticky nav; the canvas is `inset:0` so nothing can escape anyway.
- ⚠️ **`scrollIntoView()` returns immediately** and smooth scrolling lands screenshots
  mid-flight. Force `scroll-behavior:auto` before believing any frame.
- ⚠️ **Tracked capitals overrun fixed columns.** Size a label column to the MEASURED width of
  the longest word (INTERPRET is 84px at 11px Megante, not the 81 that 7.4em gives).

---

## 7 · The ink palette, measured

Every value was run against both grounds before use. WCAG on flat colour; the canvas sits
under a veil that only ever darkens, so these are floors.

| | on `#0D161D` | on `#18262F` |
|---|---|---|
| paper `#F2F6F9` | 16.81 | 14.24 |
| `#AEC0CC` | 9.75 | 8.26 |
| `#91A6B4` | 7.24 | 6.13 |
| gold `#C2A05E` | 7.38 | 6.25 |

⚠️ **The one red cannot come to this ground.** `--logo-red #8E2D3A` carries ~2:1 on ink and
fails at any size. The accent is the hero's **own** gold `#C2A05E` — the colour plate D
already ships for its active site on the live page — so the section borrows a warm note the
brand already has rather than inventing one, and does not reopen the burgundy question.

---

## 8 · What comes next

**The booking process.** He has a clearer picture of it now. The relevant existing facts:

- Every booking control on both pages is **mock** (`data-book` prevents default) — the hero
  pill, the doctor cards, the service popups' *Book a consultation*, and the journey lab's
  step-7 CTA. All point at `#book`.
- `#book` is the call strip at the foot of the peptide page (Irina, one pill).
- His booking system already lists the four doctors at **AED 1150 / 1h**, so wiring a
  per-doctor or per-service deep link is one attribute each — not a form.
- The doctor chooser (`#pxd-choose`) opens from each service popup and offers all four
  doctors. ⚠️ **The band and the chooser must stay in the same order** — the QA harness
  asserts it, because nothing else did.
