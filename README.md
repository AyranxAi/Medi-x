# Medi&#10022;X — full-bleed experiment

A single static page for **medi-gyn**: **eight full-bleed chapters**, one
photograph and one idea each. No framework, no build step —
`index.html` + `images/` + `fonts/`. Live at **medi-x-gin.vercel.app**
(Vercel tracks `main`; GitHub Pages mirror at `ayranxai.github.io/Medi-x/`).

**`REPO_MAP.md` is the map**: what the page uses, what `archive/` holds and
why, the working rules, and the open list. Session-to-session state lives in
the `HANDOVER_*.md` files — start from `HANDOVER_NEXT_CHAT.md`.

## Shape of the page

| # | chapter | frame |
|---|---|---|
| 01 | hero — the team | `hero-team-*` (photo, light-key ivory wash) |
| 02 | about — the report | `about-report-*` |
| 03 | the conversation | `consult-room-*` |
| 04 | the pathways | 4-panel accordion, `path-01..04-*` |
| 05 | meet the experts | `team-new-*` |
| 06 | the tools | `products-glass-*` |
| 07 | menoSTART | night gradient + canvas globe (no photo) |
| 08 | voices / press | Madame Arabia still + press marquee + sponsor belt |

Each photographic chapter is a `<picture>`: AVIF + webp, a portrait source
for `(max-width:899px) and (orientation:portrait)`, a wide frame for
everything else. Copy reveals once per section; a ~26px parallax drift on
the backgrounds runs **desktop only** (`min-width:900px`, motion-allowed) —
guarded inside `frame()` itself, because iOS Safari fires `resize` on every
toolbar collapse and must never reach the transform writer.

## Type / palette

Playfair Display (editorial), Megante (wordmark), NOW (sans); Arabic,
Chinese and Russian faces load per-language. Ivory `#FAF7F1`, burgundy
`#5C1F31`, logo red `#8E2D3A`, ink `#2E2228`. Six languages via `data-i18n`
(`HANDOVER_LANGUAGES.md`).

## Run / deploy

Any static server for local work. Deploy = push to `main` (commit author
must be `AyranxAi` or Vercel refuses the build). Fetch before building and
again before pushing — the repo is edited from several places at once.
