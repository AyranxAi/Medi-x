# Medi✦X — the language picker (2026-08-03)

Six languages off one dictionary, driven by the globe button in the header.
Built in commit `e6ffa79`. **Not pushed** — see §6.

---

## 1. What shipped

English · العربية · 简体中文 · Français · Deutsch · Русский — his list, his
order, each name written in its own language, each with its flag.

The globe was built inert on 2026-08-01 carrying the note *"becomes the language
picker when translations exist"*. It now opens a dropdown. The button **keeps
`class="globe"`**, so all three header colourways — frosted over the hero,
outlined on the ivory bar, dark over the open menu — keep applying to it for
free. Only the panel is new chrome.

Flags are **inline SVG, not emoji**. Windows ships no flag emoji at all and
renders 🇬🇧 as the letters "GB".

The choice persists in `localStorage` (`medigyn.lang`); with nothing saved it
follows the browser's own languages, then falls back to English.

---

## 2. How the strings work

Every translatable string carries an attribute:

| attribute | what it sets |
|---|---|
| `data-i18n` | element text (or innerHTML, if the value contains a tag) |
| `data-i18n-aria` | `aria-label` |
| `data-i18n-alt` | `alt` |
| `data-i18n-ph` | `placeholder` |
| `data-i18n-content` | `content` (the meta description) |

**114 keys.** Nothing is keyed by CSS selector, so moving markup around cannot
silently break a translation — a renamed class is harmless, a deleted element
just drops its key.

`setText()` replaces the element's own text node and leaves its children alone,
because most CTAs here are text **plus** an arrow `<svg>` and several put the
svg first. Surrounding whitespace is preserved: it is the gap before the arrow.

`window.__mgT(key)` is exposed so the older header script can translate the
burger's open/close label without duplicating the dictionary.

### What is deliberately NOT translated
`medi-gyn`, `menoSTART`, `BHRT`, sponsor names, patient names, and the legal
entity in the footer. Patient **cities** do localise (Dubai → دبي → 迪拜 → Дубай).
`AD` in Baydaa's quote is left as-is — we do not know what it stands for and
guessing would put words in a real person's mouth.

---

## 3. The faces — measured, not assumed

`fontTools` over the real files: **NOW, Megante and the old Didot are all subset
to Latin — 308 glyphs, no Cyrillic, no Arabic, no CJK.** Playfair (Google) has
Latin + Cyrillic. Cormorant has Cyrillic. Nothing on the site had Arabic or CJK.

| language | editorial | functional | quotes |
|---|---|---|---|
| en / fr / de | Playfair *(already here)* | MediGyn NOW | Cormorant |
| **ru** | **Playfair — unchanged, it has Cyrillic** | Jost | Cormorant |
| ar | Noto Naskh Arabic | IBM Plex Sans Arabic | Noto Naskh Arabic |
| zh | Noto Serif SC | Noto Sans SC | Noto Serif SC |

**Every added face is SIL OFL 1.1** — free for commercial use, no fee, no
attribution in the UI, same licence as the Playfair already in the head.
Verified against `github.com/google/fonts` METADATA, not from memory.

Each stylesheet is fetched **only when its language is chosen**, so an English
visitor downloads none of it. Chinese is special: the dictionary *is* the entire
Chinese text of the page, so `zhFontUrl()` builds a `&text=` request for exactly
the glyphs used — a few KB instead of a CJK family, and it can never drift from
the copy because it is derived from it.

Two consequences worth knowing:
- **Neither Arabic nor Chinese has an italic.** The rose/ivory `<em>` survives as
  colour alone; slanting a Naskh or Song face is a synthetic oblique and reads
  as a rendering fault.
- **Arabic letterforms join.** Every tracked style on the page drops its
  tracking in Arabic, or the words visibly come apart.

---

## 4. The hero — three lines, six ways to break it

The `>=1500px` block states the method for its own cap: *"a WIDTH limit wearing
a height's clothing … the hero's longest line must fit the 704px column …
**Re-derive it, never carry it over.**"* The longest line is a **different
string in every language**, so every cap is re-derived rather than scaled off
English — by scanning the real page for the size at which the fourth line
appears, then shipping 5–8% under it.

| | ≥1500 cap | why |
|---|---|---|
| en | 6.45rem | his number, untouched |
| ar | 6.15rem | ceiling 104px vs a shipped 103 — 1px is noise, not margin |
| de | 6.15rem | ceiling 103.5 vs 103.2 — same problem |
| zh | 6.05rem | 您最好的人生。= 7 glyphs × 103.2 = 722 in a 704 column |
| fr | 5.50rem | "Votre plus belle vie." wants 754 in 704 |
| ru | 4.70rem | Cyrillic sets ~12% wider than English in Playfair |

**The floor is the other end and it bites on real phones.** At 373px the column
is 317px and *both* French and Russian broke on the shared 2.7rem floor, while
English held with 13% to spare. Their floors are set to give them that same 13%,
so all six degrade together on a narrow phone instead of three degrading first.

Verified **373 / 390 / 768 / 1440 / 1920 / 2560 × six languages**: three lines
everywhere, +5% to +47% margin, no element overflow, no page h-scroll.

> ⚠️ Re-run that scan after any type change. The method is in §7.

---

## 5. Right-to-left

**The chrome mirrors; the chapters do not** (his call) — and the scrim agrees
with him. `.sec::after` runs its dark gradient **left to right** (`.82` at 0% →
`.48` at 34% → transparent at 66%), so the left column is the only ground on the
page with enough darkness under it for ivory text.

That is also why **the Arabic copy column is narrower** (27/32/35rem against
34/40/44). Right-aligning inside the full-width left column pushed the text's
start edge to 52.7% of the frame, where the scrim is down to 0.20:

| at 1440 | headline | scrim |
|---|---|---|
| English | 8.2% – 42.6% | 0.74 → 0.35 |
| Arabic, full column | 23.8% – 52.7% | 0.58 → **0.20** |
| Arabic, as shipped | 14.9% – 43.8% | 0.67 → **0.33** |

His decision is untouched — the copy still starts on the page's left gutter.
Only the measure is shorter, which is what keeps the text inside its own scrim.
The alternative tried and rejected was `text-align:left`: better headline (0.43),
worse paragraph (0.26), and it costs Arabic its flush start edge.

> ⚠️ **There are deliberately no `flex-direction` / `justify-content` overrides.**
> `dir="rtl"` already reverses a flex row and already flips `flex-start`/`flex-end`
> and `text-align`. Adding `flex-direction:row-reverse` to `.hdr` flips it a
> **second** time and lands you back in left-to-right — the header looks
> untouched while the rule computes exactly as written, which is a nasty way to
> lose an hour. Only physical properties need restating (the `.lang__menu`
> anchor). Verified in Arabic at 1440: mark 1217–1405 (right), burger 35–79
> (left), nav column 101–837 (left, on the burger's side).

---

## 6. ⚠️ Open, and the two that need his word

1. **`e6ffa79` is NOT pushed.** Everything the other stream did is already live;
   this commit is the only thing between local and `origin/main`, so pushing
   ships exactly the picker and nothing else. He is demoing to the owners —
   his call when.
2. **THE COPY IS A DRAFT.** All five translations are mine, not a native medical
   copywriter's, and UAE health advertising has its own rules. Every language
   wants a native read before this goes to the owners as final. **The English is
   untouched.** The chapter-08 quotes are the sharpest case: they are verbatim
   words from named real people, and the English excerpt picks were *already*
   awaiting his sign-off before they were translated.
3. **Russian hero, alternative on the table.** It ships 9% smaller than English
   because "Ваша лучшая жизнь." is long. The other option is to shorten the line
   to "Лучшая жизнь." (fits at full size) — but that loses the Ваши/Ваше/Ваша
   anaphora carrying the English Your/Your/Your. His call.
4. **SEO.** Client-side switching means only the English page is ever indexed.
   Real multilingual SEO needs `/ar/ /zh/ /fr/ /de/ /ru/` URLs plus `hreflang`.
   This dictionary is the input for that when it is wanted.
5. **Arabic flag = 🇦🇪** (his pick, clinic is Dubai). 🇸🇦 is one line away if the
   Saudi market argues louder — one of the quotes literally asks for a branch there.

---

## 7. Rebuilding it

The build is two idempotent-once scripts in the session scratchpad
(`annotate.py`, `splice.py`) plus `translations.json` and `en_clean.json`.
`annotate.py` tags the markup region-by-region and **asserts an exact hit count
on every anchor**, so when the other stream moves markup it fails loudly instead
of tagging the wrong element — that happened three times during this build and
cost nothing each time. They are not in the repo; the shipped `index.html` is
self-contained and hand-editable from here.

The verification rig is the browser pane against `python3 -m http.server` over a
scratch copy. Two traps, both hit:
- **Gate every measurement on `document.fonts.ready` *and* a real delay.** The
  first hero scan reported Russian at 4 lines; it was measuring the fallback
  before the webfont swapped in.
- **Model nothing — scan the real page.** A probe span that omitted
  `word-spacing` and the `opsz` variation under-read the Russian line by 8px and
  produced a fix that was one percentage point short.
