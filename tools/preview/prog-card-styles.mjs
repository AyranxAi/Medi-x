/* ═══ tools/preview/prog-card-styles.mjs — the programme card, five dresses ═══════
   ⚠️ THIS IS A PREVIEW RIG, NOT A HARNESS AND NOT SHIPPED CODE. It asserts nothing.
   It exists to answer ONE question the mockups cannot settle — does the card keep its
   box? — by rendering the proposed two-column card in five box treatments so the
   choice is made from a picture rather than from a paragraph.

   ⚠️ IT RESTYLES THE REAL PAGE IN THE BROWSER AND WRITES NOTHING TO DISK BUT PNGs.
   /hormone-therapy-bhrt/ is loaded, its .prog-card is restructured in the DOM and the
   candidate CSS is injected over the page's own. Nothing in the repo changes. That is
   deliberate: the alternative — a standalone preview page carrying a copy of the
   card's CSS — is a second source of truth for type sizes and tokens, and it goes
   stale the first time somebody edits the page and not the copy.

   ⚠️ THE FONTS ARE THE REASON IT IS A SCREENSHOT AND NOT A SHAREABLE PAGE. "MediGyn
   NOW" and "MediGyn Megante" have no licence file in LICENSES/ — unlike Playfair and
   Cormorant, which are OFL. Rendering them is fine; redistributing them inside a
   published artifact is not. Pictures travel, the faces do not.

   ⚠️ ?probe=1 IS THE PAGE'S OWN QA SWITCH and it is what makes the card photographable:
   it returns before the reveal pass, so nothing is mid-animation. jsdelivr is blocked
   as well — the reveals are gsap.from(), so with no gsap the card simply stays visible.

   Run: npm install --no-save playwright@1.49.1
        node tools/preview/prog-card-styles.mjs
   Out: .qa-out/prog-card/ (gitignored)                                            */
import { chromium } from 'playwright';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, statSync, readFileSync, mkdirSync } from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT  = path.join(ROOT, '.qa-out', 'prog-card');
mkdirSync(OUT, { recursive: true });
const PORT = 8137;
const MIME = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css', '.webp':'image/webp', '.avif':'image/avif', '.png':'image/png',
  '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.ico':'image/x-icon',
  '.json':'application/json', '.mp4':'video/mp4' };

const srv = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  r.end(readFileSync(f));
});
await new Promise(r => srv.listen(PORT, r));

/* ── THE FIVE DRESSES ────────────────────────────────────────────────────────────
   Only the card's own edge changes between them. Layout, type and rules are
   identical in all five, so the picture isolates the one open question. */
const VARIANTS = [
  ['flat',  'A · FLAT ON THE GROUND',
   'no fill, no border, no radius, no side padding — the card aligns to the page measure ' +
   'and the hairlines do every division. What the mockups read as.'],
  ['band',  'B · RULED BAND',
   'flat, plus one hairline across the full width above and below. Framed as a chapter ' +
   'band without ever becoming a box.'],
  ['frame', 'C · HAIRLINE FRAME',
   'a drawn edge and nothing else — 1px line, square corners, no fill. Contained, but ' +
   'it does not lift off the ground.'],
  ['today', 'D · TODAY’S BOX  (what ships now)',
   'white .55 fill, 1px line, 18px radius. The panel dress the card has worn since it ' +
   'was one narrow column.'],
  ['paper', 'E · PAPER',
   'solid near-white, no border, 18px radius, one soft shadow. The card lifts and reads ' +
   'as a document laid on the chapter.'],
];

/* ── THE CANDIDATE CSS ───────────────────────────────────────────────────────────
   ⚠️ EVERY RULE IS SCOPED TO .prog-card OR TO A NEW pc-* CLASS. /peptide-therapy/ and
   /functional-medicine/ render this same content as a POPUP through the identical
   pg-* classes and nobody asked to change them; a bare .pg-amt or .pg-h rule here
   would silently reshape two dialogs. Extend, never fork. */
const BP = 1024;
const CSS = `
/* the 560 cap was the width the card was composed at as ONE column. Two cannot live
   there, so it lifts to the page's own measure. */
.prog-grid--card{max-width:1280px}

.prog-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);
  column-gap:0;padding:clamp(26px,3vw,44px)}
.prog-card .pc-col--l{padding-right:clamp(28px,3.4vw,56px)}
/* the divider is the right column's own left edge. Grid stretches both columns to the
   taller one, so it runs the card's full height without a spare element. */
.prog-card .pc-col--r{padding-left:clamp(28px,3.4vw,56px);border-left:1px solid var(--line)}

.prog-card h3{font-size:clamp(28px,3.2vw,44px)}
/* the short gold rule under the title — .ps-rule's idiom, which this page already owns */
.prog-card .pc-rule{width:clamp(80px,9vw,116px);height:2px;background:var(--gold);margin-top:22px}

/* ⚠️ THE FIGURE IS PROMOTED, NOT RE-CUT. It keeps var(--accent) — the face .pg-amt and
   .pg-row--total already wear — so the headline and the total agree. Setting it in the
   serif would make the two largest numbers on one card two different typefaces. */
.prog-card .pc-price{font-family:var(--accent);font-variant-numeric:tabular-nums;
  color:var(--ink);font-size:clamp(54px,6.6vw,96px);line-height:.92;white-space:nowrap;
  display:flex;align-items:baseline;gap:10px}
.prog-card .pc-price small{font-family:var(--sans);font-weight:500;
  font-size:clamp(11px,1.05vw,13px);letter-spacing:.12em;text-transform:uppercase;
  color:var(--ink-soft);margin-left:0}

/* the label loses its underline; the hairline moves to BETWEEN the blocks */
.prog-card .pg-h{border-bottom:0;padding-bottom:0}
.prog-card .pg-blk{margin-top:clamp(24px,2.6vw,32px);padding-top:clamp(24px,2.6vw,32px);
  border-top:1px solid var(--line)}

/* type grows with the measure — a 13.5px list inside a 1280px card reads as a caption */
.prog-card .pg-h span:first-child{font-size:clamp(11px,.95vw,12.5px)}
.prog-card .pg-list li{font-size:clamp(14px,1.15vw,16.5px)}
.prog-card .pg-list small{font-size:clamp(12.5px,1vw,14px)}
.prog-card .pg-t{font-size:clamp(14px,1.1vw,15.5px)}
.prog-card .pg-note{font-size:clamp(12.5px,1vw,14px)}
.prog-card .pg-row{font-size:clamp(13.5px,1.05vw,15px)}
.prog-card .pg-row--total span:first-child{font-size:clamp(11px,.95vw,12.5px)}
.prog-card .pg-row--total span:last-child{font-size:clamp(26px,3.4vw,46px)}

/* the add-on's price comes INSIDE the box — bottom-right, in the accent face */
.prog-card .pg-addon{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;
  align-items:start;padding:clamp(16px,1.6vw,22px)}
.prog-card .pg-box{flex:0 0 22px;width:22px;height:22px;font-size:13px;margin-top:1px}
.prog-card .pg-addon .pg-p{grid-column:2;justify-self:end;align-self:auto;
  margin-top:10px;margin-left:0;font-family:var(--accent);font-size:clamp(15px,1.5vw,21px)}
.prog-card .prog-cta{margin-top:clamp(26px,3vw,34px)}

/* ⚠️ THE PHONE INTERLEAVE, AND WHY IT IS display:contents. Desktop wants the children
   split into two independently-flowing columns; phone wants them in ONE column in an
   order that ALTERNATES between those columns (kicker, title, PRICE, included,
   add-on, not-included, summary, cta). Dissolving the wrappers makes every child a
   direct grid item of the card, and order puts them in his sequence — one node per
   figure, no duplicated price, no coupled row tracks. */
@media(max-width:${BP}px){
  .prog-card{grid-template-columns:minmax(0,1fr)}
  .prog-card .pc-col{display:contents}
  .prog-card .pxd-kicker{order:1}
  .prog-card h3{order:2}
  .prog-card h3{font-size:clamp(25px,7vw,34px)}
  .prog-card .pc-price{order:3;margin-top:12px;font-size:clamp(30px,8vw,40px)}
  .prog-card .pc-rule{display:none}
  .prog-card .pc-inc{order:4}
  .prog-card .pc-add{order:5}
  .prog-card .pc-exc{order:6}
  .prog-card .pg-sum{order:7}
  .prog-card .prog-cta{order:8}
  /* the figure stacks beside the copy rather than dropping under it — which is what
     the base sheet does at 520 and what the phone mockup does NOT show */
  .prog-card .pg-addon{grid-template-columns:auto minmax(0,1fr) auto;gap:11px}
  .prog-card .pg-addon .pg-p{grid-column:3;grid-row:1;justify-self:end;align-self:center;
    margin-top:0;margin-left:0;text-align:right}
  .prog-card .pg-addon .pg-p small{display:block;margin-left:0;margin-top:3px}
}
@media(min-width:${BP + 1}px){
  /* the first block in each column has no rule above it: the gold rule serves the left,
     and the figure serves the right */
  .prog-card .pc-inc,.prog-card .pc-add{padding-top:0;border-top:0}
}

/* ── the five dresses ── */
.prog-card{transition:none}
.v-flat  .prog-card{background:none;border:0;border-radius:0;padding-left:0;padding-right:0}
.v-band  .prog-card{background:none;border:0;border-radius:0;padding-left:0;padding-right:0;
  border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.v-frame .prog-card{background:none;border:1px solid var(--line);border-radius:0}
.v-paper .prog-card{background:#FFFCF7;border:0;border-radius:18px;
  box-shadow:0 18px 46px -28px rgba(46,34,40,.28)}
`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ||
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2 });
await page.route('**://cdn.jsdelivr.net/**', r => r.abort());
await page.goto(`http://127.0.0.1:${PORT}/hormone-therapy-bhrt/?probe=1`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

await page.evaluate(({ css, variants }) => {
  const card = document.querySelector('.prog-card');

  /* ── restructure: two wrappers, and the figure leaves the Included header ── */
  const kicker = card.querySelector('.pxd-kicker');
  const h3     = card.querySelector('h3');
  const blks   = [...card.querySelectorAll('.pg-blk')];   /* included · add now · not included */
  const sum    = card.querySelector('.pg-sum');
  const cta    = card.querySelector('.prog-cta');
  const amt    = blks[0].querySelector('.pg-amt');

  const price = document.createElement('p');
  price.className = 'pc-price';
  price.innerHTML = amt.innerHTML;
  amt.remove();

  const rule = document.createElement('div');
  rule.className = 'pc-rule'; rule.setAttribute('aria-hidden', 'true');

  blks[0].classList.add('pc-inc');
  blks[1].classList.add('pc-add');
  blks[2].classList.add('pc-exc');

  const L = document.createElement('div'); L.className = 'pc-col pc-col--l';
  const R = document.createElement('div'); R.className = 'pc-col pc-col--r';
  L.append(kicker, h3, rule, blks[0], blks[2]);
  R.append(price, blks[1], sum, cta);
  card.append(L, R);

  /* ── the sheet: five clones, one per dress, on the chapter's own ground ── */
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  [...document.body.children].forEach(n => { n.style.display = 'none'; });
  const sheet = document.createElement('div');
  sheet.id = 'pc-sheet';
  sheet.style.cssText = 'background:var(--ps-ground);padding:0 0 64px';
  document.body.appendChild(sheet);
  document.documentElement.style.background = 'var(--ps-ground)';

  for (const [key, title, blurb] of variants) {
    const band = document.createElement('div');
    band.className = 'v-' + key;
    band.style.cssText = 'padding:52px 0 60px';

    const cap = document.createElement('div');
    cap.className = 'wrap';
    cap.style.cssText = 'padding-bottom:30px';
    cap.innerHTML =
      `<div style="font-family:var(--sans);font-weight:500;font-size:12px;letter-spacing:.24em;` +
      `text-transform:uppercase;color:var(--logo-red)">${title}</div>` +
      `<div style="font-family:var(--sans);font-size:13.5px;line-height:1.5;color:var(--ink-soft);` +
      `max-width:78ch;margin-top:8px">${blurb}</div>`;

    const wrap = document.createElement('div'); wrap.className = 'wrap';
    const grid = document.createElement('div'); grid.className = 'prog-grid prog-grid--card';
    grid.appendChild(card.cloneNode(true));
    wrap.appendChild(grid);
    band.append(cap, wrap);
    sheet.appendChild(band);
  }
  card.closest('.wrap')?.remove();
}, { css: CSS, variants: VARIANTS });

await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(OUT, 'desktop-styles.png'), fullPage: true });
console.log('  desktop-styles.png');

/* one frame per dress as well — the sheet is 10,000px tall and nobody judges an edge
   at that scale */
for (const [key] of VARIANTS) {
  await page.locator('.v-' + key).screenshot({ path: path.join(OUT, `desktop-${key}.png`) });
  console.log(`  desktop-${key}.png`);
}

/* ⚠️ THE NARROWEST TWO-COLUMN CASE IS THE ONE THAT DECIDES THE BREAKPOINT. At 1104 the
   wrap leaves ~990px, so each column is ~495 before its own inner padding. If the lists
   look cramped HERE, the reflow belongs higher than 1024 — the number is measured, not
   picked. */
await page.setViewportSize({ width: 1104, height: 1200 });
await page.evaluate(() => document.fonts.ready);
await page.locator('.v-flat').screenshot({ path: path.join(OUT, 'desktop-flat-1104.png') });
console.log('  desktop-flat-1104.png  (narrowest two-column case)');

await page.setViewportSize({ width: 390, height: 1400 });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(OUT, 'phone-styles.png'), fullPage: true });
console.log('  phone-styles.png');
for (const [key] of VARIANTS) {
  await page.locator('.v-' + key).screenshot({ path: path.join(OUT, `phone-${key}.png`) });
  console.log(`  phone-${key}.png`);
}

/* ── DOES IT SURVIVE THE WIDTHS? ─────────────────────────────────────────────────
   ⚠️ bhrt-shots.mjs ASSERTS NO SIDEWAYS SCROLL AT THIRTEEN WIDTHS, and a two-column
   money card is the likeliest thing on the page to break it. Measuring here — on the
   real page, with the candidate CSS over it — is what tells us the layout is buildable
   BEFORE any of it is written into the file. A red row is a design answer, not a bug. */
const probe = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await probe.route('**://cdn.jsdelivr.net/**', r => r.abort());
await probe.goto(`http://127.0.0.1:${PORT}/hormone-therapy-bhrt/?probe=1`, { waitUntil: 'load' });
await probe.evaluate(({ css }) => {
  const card = document.querySelector('.prog-card');
  const kicker = card.querySelector('.pxd-kicker'), h3 = card.querySelector('h3');
  const blks = [...card.querySelectorAll('.pg-blk')];
  const sum = card.querySelector('.pg-sum'), cta = card.querySelector('.prog-cta');
  const amt = blks[0].querySelector('.pg-amt');
  const price = document.createElement('p');
  price.className = 'pc-price'; price.innerHTML = amt.innerHTML; amt.remove();
  const rule = document.createElement('div'); rule.className = 'pc-rule';
  blks[0].classList.add('pc-inc'); blks[1].classList.add('pc-add'); blks[2].classList.add('pc-exc');
  const L = document.createElement('div'); L.className = 'pc-col pc-col--l';
  const R = document.createElement('div'); R.className = 'pc-col pc-col--r';
  L.append(kicker, h3, rule, blks[0], blks[2]); R.append(price, blks[1], sum, cta);
  card.append(L, R);
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
}, { css: CSS });

console.log('\n  sideways scroll — the card at thirteen widths');
let bad = 0;
for (const w of [320, 360, 390, 430, 520, 700, 900, 1024, 1104, 1280, 1440, 1680, 1920]) {
  await probe.setViewportSize({ width: w, height: 900 });
  const sw = await probe.evaluate(() => document.documentElement.scrollWidth);
  const okw = sw <= w;
  if (!okw) bad++;
  console.log(`   ${okw ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'} ${String(w).padStart(4)}  scrollWidth=${sw}`);
}
console.log(bad ? `\n  \x1b[31m${bad} width(s) overflow\x1b[0m` : '\n  \x1b[32mno overflow at any width\x1b[0m');

await browser.close();
srv.close();
console.log(`\n  → ${path.relative(ROOT, OUT)}/`);
