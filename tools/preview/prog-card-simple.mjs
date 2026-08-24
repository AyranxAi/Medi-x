/* ═══ tools/preview/prog-card-simple.mjs — the card, with the copy cut back ═══════
   ⚠️ HIS SECOND PAIR OF MOCKUPS SAYS THE PROBLEM IS COPY, NOT LAYOUT. The two-column
   card he approved reads as convoluted, and what his simpler references actually
   remove is TEXT: every grey sub-line under the two lists, the add-on's three-line
   paragraph, and the outside-UAE note. The columns, the promoted figure and the
   divider survive unchanged in both.

   ⚠️⚠️ THREE OF THOSE CUTS ARE NOT DECORATION, AND THIS RIG PUTS THEM BACK AS FINE
   PRINT rather than dropping them, so the picture he judges is one that could ship:
     · "we will price it before your payment" is a COMMERCIAL PROMISE on a money card.
     · "A new consultation, AED 795 + VAT" is the ONLY place that figure exists.
     · "Patients outside the UAE…" LEFT THE BUTTON ON PURPOSE (2026-08-24f) so a reader
       abroad would not tick a 1,950 charge that cannot apply to her. Deleting it
       re-opens exactly the problem that move solved.
   One .pc-fine line under the pill carries all three at 12.5px. If he wants them gone
   for real, that is a decision to take with the sentences in front of him.

   Three dresses, and only the dress changes:
     S1  his first reference — the estate's gold caps labels, dash markers, ivory ground
     S2  his second — gold SERIF labels, tick and cross markers, ivory ground
     S3  the same as S2 on the BURGUNDY ground, card floating white

   Run: node tools/preview/prog-card-simple.mjs      Out: .qa-out/prog-card-simple/  */
import { chromium } from 'playwright';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, statSync, readFileSync, mkdirSync } from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT  = path.join(ROOT, '.qa-out', 'prog-card-simple');
mkdirSync(OUT, { recursive: true });
const PORT = 8139;
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.webp':'image/webp', '.avif':'image/avif', '.png':'image/png', '.jpg':'image/jpeg',
  '.svg':'image/svg+xml', '.woff2':'font/woff2', '.ico':'image/x-icon', '.mp4':'video/mp4' };
const srv = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  r.end(readFileSync(f));
});
await new Promise(r => srv.listen(PORT, r));

const TICK  = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3 8.4l3.3 3.3L13 4.9' fill='none' stroke='%23C2A05E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";
const CROSS = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='6.4' fill='none' stroke='%238A6A34' stroke-width='.9' opacity='.75'/%3E%3Cpath d='M5.9 5.9l4.2 4.2M10.1 5.9l-4.2 4.2' stroke='%238A6A34' stroke-width='.9' stroke-linecap='round' opacity='.75'/%3E%3C/svg%3E\")";

const BP = 1024;
const CSS = `
.prog-grid--card{max-width:1180px}

/* ⚠️ 41/59, NOT 50/50 — both of his simpler references split the card there, and the
   narrower left column is what makes the title wrap to two lines the way they show. */
.prog-card{display:grid;grid-template-columns:minmax(0,41fr) minmax(0,59fr);
  column-gap:0;padding:clamp(28px,3.2vw,48px)}
.prog-card .pc-col--l{padding-right:clamp(28px,3.2vw,52px)}
.prog-card .pc-col--r{padding-left:clamp(30px,3.6vw,58px);
  border-left:1px solid rgba(194,160,94,.42)}

.prog-card h3{font-size:clamp(27px,2.9vw,41px);line-height:1.12}
.prog-card .pc-rule{width:clamp(78px,8vw,112px);height:1px;background:var(--gold);
  margin-top:20px;opacity:.85}

/* ⚠️ THE FIGURE COMES DOWN. His first pair put it at roughly four times .pg-amt and it
   was the loudest thing in the chapter; these references set it about half that, in
   scale with the title beside it. Big, not shouted. */
.prog-card .pc-price{font-family:var(--accent);font-variant-numeric:tabular-nums;
  color:var(--ink);font-size:clamp(42px,4.6vw,68px);line-height:1;white-space:nowrap;
  display:flex;align-items:baseline;gap:12px;justify-content:center}
.prog-card .pc-price small{font-family:var(--sans);font-weight:500;
  font-size:clamp(11px,1vw,13px);letter-spacing:.12em;text-transform:uppercase;
  color:var(--ink-soft);margin-left:0}

.prog-card .pg-h{border-bottom:0;padding-bottom:0}
.prog-card .pg-blk{margin-top:clamp(22px,2.4vw,30px);padding-top:clamp(22px,2.4vw,30px);
  border-top:1px solid rgba(194,160,94,.34)}

/* ⚠️ ONE LINE PER ITEM. Every grey <small> under these two lists is hidden, not deleted
   — the markup is untouched and .pc-fine below carries what the sentences said. */
.prog-card .pg-list li > small{display:none}
.prog-card .pg-list li{font-size:clamp(14.5px,1.15vw,16.5px);line-height:1.45;padding-left:26px}
.prog-card .pg-list li + li{margin-top:13px}
.prog-card .pg-h span:first-child{font-size:clamp(11px,.95vw,12.5px)}
.prog-card .pg-row{font-size:clamp(13.5px,1.05vw,15px)}
.prog-card .pg-row--total span:last-child{font-size:clamp(26px,3.1vw,42px)}

/* the summary loses its 2px ink bar — with the sub-lines gone there is nothing heavy
   left to separate it from, and a gold hairline above the total is all his references
   carry */
.prog-card .pg-sum{border-top:0;margin-top:clamp(26px,3vw,38px);padding-top:0}
.prog-card .pg-row--total{border-top:1px solid rgba(194,160,94,.5);
  margin-top:14px;padding-top:14px}

/* the add-on box: a label, the service on one line, one short line of what it is,
   and the figure. Three lines became one. */
.prog-card .pg-addon{display:grid;grid-template-columns:auto minmax(0,1fr);
  gap:6px 14px;align-items:start;padding:clamp(17px,1.7vw,24px);
  border-color:rgba(194,160,94,.5);border-radius:10px}
.prog-card .pg-box{flex:0 0 21px;width:21px;height:21px;font-size:12px;margin-top:1px;
  border-color:rgba(138,106,52,.75)}
.prog-card .pc-addon-label{display:block;font-family:var(--serif);
  font-size:clamp(16px,1.45vw,20px);color:var(--gold-deep);margin-bottom:7px}
.prog-card .pg-t{font-size:clamp(14px,1.12vw,15.5px)}
.prog-card .pg-t > small{font-size:clamp(12.5px,1vw,13.5px);margin-top:5px}
.prog-card .pg-addon .pg-p{grid-column:2;justify-self:end;align-self:auto;
  margin-top:12px;margin-left:0;font-family:var(--accent);font-size:clamp(18px,1.8vw,25px)}
/* ⚠️ THE OUTSIDE-UAE LINE STAYS VISIBLE, and it is the one sentence that does NOT go
   behind a +. It guards a 1,950 charge: a reader abroad who never opens a disclosure
   can tick a collection that cannot reach her. It is one line, and it sits under the
   box where the decision is actually made. Everything else the card used to say in
   grey is now behind the +. */
.prog-card .pg-note{margin-top:12px}

/* ── THE + · his call, and it replaces the cross rather than joining it ──────────
   ⚠️ A CROSS LABELS THE ROW; A + OPENS IT. "Blood tests · not included" raises the
   question "so what do I pay, and to whom?" and the sentence that answers it was
   the first thing the simplification deleted. The + puts it back WITHOUT putting it
   on screen — the card stays as quiet as his reference and loses nothing.
   ⚠️ IT IS <details>, NOT JAVASCRIPT. This page ships a no-JS rollback for its six
   steps and static figures for its money; a disclosure that needs a script to open
   would be the one place on the card where a reader with no JS is simply told less.
   <details> opens with the script dead.
   ⚠️ THE WHOLE ROW IS THE TARGET, not the glyph. 13px of + is a 13px tap target;
   <summary> makes the label part of the control for free. */
.prog-card .pc-exc .pg-list li{padding-left:0}
.prog-card .pc-exc .pg-list li::before{display:none}
.prog-card .pc-more > summary{position:relative;padding:3px 0 3px 28px;cursor:pointer;
  list-style:none;display:block}
.prog-card .pc-more > summary::-webkit-details-marker{display:none}
.prog-card .pc-more > summary::before,
.prog-card .pc-more > summary::after{content:"";position:absolute;background:var(--gold-deep);
  opacity:.85;transition:transform .3s var(--ease)}
.prog-card .pc-more > summary::before{left:0;top:calc(.72em + 3px);width:14px;height:1px}
.prog-card .pc-more > summary::after{left:6.5px;top:calc(.72em - 3px);width:1px;height:14px;
  transform-origin:center}
/* the stem lies down onto the bar — the + becomes a − with no second glyph */
.prog-card .pc-more[open] > summary::after{transform:rotate(90deg)}
.prog-card .pc-more > summary:hover::before,
.prog-card .pc-more > summary:hover::after{opacity:1}
.prog-card .pc-more > small{display:block;padding-left:28px;margin-top:2px;
  padding-bottom:4px;max-width:46ch}
@media(hover:none){
  /* a thumb is not a cursor — the row grows its own target on touch */
  .prog-card .pc-more > summary{padding-top:9px;padding-bottom:9px}
}
/* ⚠️ "ADD NOW" GOES WITH THE PARAGRAPH. His references give the box its own gold
   heading — "Optional add-on" — and a section label above it saying the same thing
   twice is exactly the kind of doubling that made the card feel busy. */
.prog-card .pc-add > .pg-h{display:none}
.prog-card .pc-add .pg-addon{margin-top:0}

.prog-card .prog-cta{margin-top:clamp(22px,2.4vw,28px)}
/* ⚠️ .pc-fine IS GONE AND THE + IS WHY. The footnote existed because three cut
   sentences were load-bearing — a promise, a price and a warning. Two of them now
   live behind the + on their own row, which is a better place than a footnote: they
   are attached to the thing they explain. The third, the warning, stayed visible. */

@media(max-width:${BP}px){
  .prog-card{grid-template-columns:minmax(0,1fr)}
  .prog-card .pc-col{display:contents}
  .prog-card .pxd-kicker{order:1} .prog-card h3{order:2;font-size:clamp(25px,7vw,33px)}
  .prog-card .pc-price{order:3;margin-top:12px;justify-content:flex-start;
    font-size:clamp(32px,8.5vw,42px)}
  .prog-card .pc-rule{display:none}
  .prog-card .pc-inc{order:4} .prog-card .pc-add{order:5} .prog-card .pc-exc{order:6}
  .prog-card .pg-sum{order:7;border-top:1px solid rgba(194,160,94,.34);
    padding-top:clamp(22px,2.4vw,30px)}
  .prog-card .prog-cta{order:8}
  /* ⚠️ THE FIGURE STAYS ON ITS OWN ROW HERE, unlike the dense build. With three lines
     of paragraph gone the box is short, so a third column buys nothing and costs the
     service name its width — "Home blood sample collection · UAE" was setting three
     words to a line at 390. Under the copy, right-aligned, same as desktop. */
  .prog-card .pg-addon .pg-p{margin-top:12px}
}
@media(min-width:${BP + 1}px){
  .prog-card .pc-inc,.prog-card .pc-add{padding-top:0;border-top:0}
}

/* ── S1 · his first reference: the estate's own caps labels and dash markers ── */
.v-s1 .prog-card{background:rgba(255,255,255,.62);border:1px solid var(--line);border-radius:16px}
.v-s1 .prog-card .pg-list li{padding-left:22px}
.v-s1 .prog-card .pg-list li::before{width:11px;top:.66em}

/* ── S2 · his second: gold serif labels, a tick for what you get, a ring for what
       you do not. Sentence case reads as writing rather than as signage. ── */
.v-s2 .prog-card,.v-s2open .prog-card,.v-s3 .prog-card{border-radius:16px}
.v-s2 .prog-card,.v-s2open .prog-card{background:rgba(255,255,255,.62);border:1px solid var(--line)}
.v-s2 .prog-card .pg-h span:first-child,
.v-s2open .prog-card .pg-h span:first-child,
.v-s3 .prog-card .pg-h span:first-child{font-family:var(--serif);font-weight:400;
  font-size:clamp(19px,1.7vw,24px);letter-spacing:0;text-transform:none;color:var(--gold-deep)}
.v-s2 .prog-card .pg-row--total span:first-child,
.v-s2open .prog-card .pg-row--total span:first-child,
.v-s3 .prog-card .pg-row--total span:first-child{font-family:var(--serif);font-weight:400;
  font-size:clamp(17px,1.5vw,21px);letter-spacing:0;text-transform:none;color:var(--gold-deep)}
.v-s2 .prog-card .pg-list li::before,
.v-s2open .prog-card .pg-list li::before,
.v-s3 .prog-card .pg-list li::before{content:"";width:16px;height:16px;background:${TICK};
  background-repeat:no-repeat;top:.18em;left:0;opacity:1}
.v-s2 .prog-card .pc-exc .pg-list li::before,
.v-s2open .prog-card .pc-exc .pg-list li::before,
.v-s3 .prog-card .pc-exc .pg-list li::before{background:${CROSS};background-repeat:no-repeat}

/* ── S3 · the same card on the burgundy ground, floating ── */
.v-s3{background:var(--burgundy)}
.v-s3 .prog-card{background:#FBF8F3;border:0;box-shadow:0 30px 70px -34px rgba(0,0,0,.55)}
.v-s3 .pc-cap-t{color:#E8C79A!important} .v-s3 .pc-cap-b{color:rgba(250,247,241,.72)!important}
`;

const VARIANTS = [
  ['s1', 'S1 · YOUR FIRST REFERENCE — CAPS LABELS, DASH MARKERS',
   'The estate’s existing label and marker grammar, with the copy cut back. Shown for ' +
   'comparison — the + is on this one too.'],
  ['s2', 'S2 · SERIF LABELS, A TICK, AND THE + — the proposal',
   'His pick, with his correction: the cross is replaced by a + that OPENS. Closed, the ' +
   'card says only what it is. Each + carries the sentence that row used to spell out.'],
  ['s2open', 'S2 · THE SAME CARD WITH EVERY + OPENED',
   'What a reader sees after tapping all four. This is the worst case for height, and ' +
   'nobody will ever open all of them at once — but it is the state to judge the copy in.'],
  ['s3', 'S3 · THE SAME CARD ON BURGUNDY',
   '⚠️ This changes the CHAPTER’s ground, not the card’s. The porcelain #F0EBE7 under it ' +
   'is your own call and it is what the flower sculpture stands on — see the note below.'],
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ||
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2 });
await page.route('**://cdn.jsdelivr.net/**', r => r.abort());
await page.goto(`http://127.0.0.1:${PORT}/hormone-therapy-bhrt/?probe=1`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

await page.evaluate(({ css, variants }) => {
  const card = document.querySelector('.prog-card');
  const kicker = card.querySelector('.pxd-kicker'), h3 = card.querySelector('h3');
  const blks = [...card.querySelectorAll('.pg-blk')];
  const sum = card.querySelector('.pg-sum'), cta = card.querySelector('.prog-cta');
  const amt = blks[0].querySelector('.pg-amt');

  const price = document.createElement('p');
  price.className = 'pc-price'; price.innerHTML = amt.innerHTML; amt.remove();
  const rule = document.createElement('div'); rule.className = 'pc-rule';

  /* ── the copy cut ── */
  blks[2].querySelector('.pg-h span').textContent = 'Not included';
  blks[0].querySelector('.pg-h span').textContent = 'Included';
  const t = blks[1].querySelector('.pg-t');
  t.innerHTML = '<span class="pc-addon-label">Optional add-on</span>' +
    'Home blood sample collection · UAE' +
    '<small>Anywhere in the UAE — home, office or hotel.</small>';

  /* ── and where it went: each row keeps its sentence, behind its own + ──
     ⚠️ THE MARKUP IS THE MARKUP THAT WAS ALREADY THERE. Every <li> in this list
     already held a label and a <small>; they are only re-parented into
     <details>/<summary>. No copy is written here and none is thrown away — which
     is what makes this reversible in one function if he changes his mind. */
  for (const li of blks[2].querySelectorAll('.pg-list li')) {
    const small = li.querySelector('small');
    if (!small) continue;                       /* no sentence, no + — a + that opens
                                                   onto nothing is a broken promise */
    const label = li.firstChild.textContent.trim();
    const d = document.createElement('details'); d.className = 'pc-more';
    const sm = document.createElement('summary'); sm.textContent = label;
    d.append(sm, small);
    li.textContent = ''; li.appendChild(d);
  }

  blks[0].classList.add('pc-inc'); blks[1].classList.add('pc-add'); blks[2].classList.add('pc-exc');
  const L = document.createElement('div'); L.className = 'pc-col pc-col--l';
  const R = document.createElement('div'); R.className = 'pc-col pc-col--r';
  L.append(kicker, h3, rule, blks[0], blks[2]);
  R.append(price, blks[1], sum, cta);
  card.append(L, R);

  const style = document.createElement('style'); style.textContent = css;
  document.head.appendChild(style);
  [...document.body.children].forEach(n => { n.style.display = 'none'; });
  const sheet = document.createElement('div');
  sheet.style.cssText = 'background:var(--ps-ground)';
  document.body.appendChild(sheet);
  document.documentElement.style.background = 'var(--ps-ground)';

  for (const [key, title, blurb] of variants) {
    const band = document.createElement('div');
    band.className = 'v-' + key; band.style.cssText = 'padding:54px 0 62px';
    const cap = document.createElement('div'); cap.className = 'wrap';
    cap.style.cssText = 'padding-bottom:30px';
    cap.innerHTML =
      `<div class="pc-cap-t" style="font-family:var(--sans);font-weight:500;font-size:12px;` +
      `letter-spacing:.24em;text-transform:uppercase;color:var(--logo-red)">${title}</div>` +
      `<div class="pc-cap-b" style="font-family:var(--sans);font-size:13.5px;line-height:1.5;` +
      `color:var(--ink-soft);max-width:80ch;margin-top:8px">${blurb}</div>`;
    const wrap = document.createElement('div'); wrap.className = 'wrap';
    const grid = document.createElement('div'); grid.className = 'prog-grid prog-grid--card';
    const clone = card.cloneNode(true);
    if (key === 's2open') clone.querySelectorAll('.pc-more').forEach(d => { d.open = true; });
    grid.appendChild(clone);
    wrap.appendChild(grid); band.append(cap, wrap); sheet.appendChild(band);
  }
  card.closest('.wrap')?.remove();
}, { css: CSS, variants: VARIANTS });

await page.evaluate(() => document.fonts.ready);
for (const [key] of VARIANTS) {
  await page.locator('.v-' + key).screenshot({ path: path.join(OUT, `desktop-${key}.png`) });
  console.log(`  desktop-${key}.png`);
}
await page.setViewportSize({ width: 390, height: 1400 });
await page.evaluate(() => document.fonts.ready);
for (const [key] of VARIANTS) {
  await page.locator('.v-' + key).screenshot({ path: path.join(OUT, `phone-${key}.png`) });
  console.log(`  phone-${key}.png`);
}

/* the widths again — the copy cut changes the wrapping, so the check is re-run */
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
  const t = blks[1].querySelector('.pg-t');
  t.innerHTML = '<span class="pc-addon-label">Optional add-on</span>Home blood sample ' +
    'collection · UAE<small>Anywhere in the UAE — home, office or hotel.</small>';
  for (const li of blks[2].querySelectorAll('.pg-list li')) {
    const small = li.querySelector('small'); if (!small) continue;
    const label = li.firstChild.textContent.trim();
    const d = document.createElement('details'); d.className = 'pc-more';
    const sm = document.createElement('summary'); sm.textContent = label;
    d.append(sm, small); li.textContent = ''; li.appendChild(d);
  }
  blks[0].classList.add('pc-inc'); blks[1].classList.add('pc-add'); blks[2].classList.add('pc-exc');
  const L = document.createElement('div'); L.className = 'pc-col pc-col--l';
  const R = document.createElement('div'); R.className = 'pc-col pc-col--r';
  L.append(kicker, h3, rule, blks[0], blks[2]); R.append(price, blks[1], sum, cta);
  card.append(L, R);
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
}, { css: CSS });
console.log('\n  sideways scroll');
let bad = 0;
for (const w of [320, 360, 390, 430, 520, 700, 900, 1024, 1104, 1280, 1440, 1680, 1920]) {
  await probe.setViewportSize({ width: w, height: 900 });
  const sw = await probe.evaluate(() => document.documentElement.scrollWidth);
  if (sw > w) bad++;
  console.log(`   ${sw <= w ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'} ${String(w).padStart(4)}  scrollWidth=${sw}`);
}
console.log(bad ? `\n  \x1b[31m${bad} overflow\x1b[0m` : '\n  \x1b[32mno overflow at any width\x1b[0m');
await browser.close(); srv.close();
