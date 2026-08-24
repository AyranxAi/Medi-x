/* ═══════════ prog-card.mjs — the programme card, on all three doors ═══════════
   ⚠️ THE CARD HAD NO CHECK OF ITS OWN UNTIL 2026-08-24h, and it acquired one the
   day it stopped being a single column. Its money was already guarded three ways
   by trt-page.mjs and bhrt-shots.mjs; NOTHING guarded its SHAPE, and the shape is
   now the part that can fail silently.

   THE FAILURE THIS EXISTS FOR. Desktop splits the card's children into two
   independently flowing columns; phone puts them in ONE column in an order that
   ALTERNATES between those columns. That is done by dissolving the two wrappers
   with display:contents at the breakpoint and re-ordering the children. If a later
   edit adds a child without an `order`, or wraps two children in a new div, the
   desktop layout keeps working perfectly and the PHONE ORDER QUIETLY SCRAMBLES —
   the price lands under the not-included list, or the total floats above the
   summary. It renders. It just says the wrong thing in the wrong place.
   So the phone order is asserted by MEASURED POSITION, not by class.

   It also guards what the redesign was careful about:
     · the four not-included rows each keep a <details> — the AED 795 review fee
       lives inside one of them and NOWHERE ELSE ON THE SITE
     · the figure keeps its .pg-amt class, LAST in the attribute, because
       trt-page.mjs reads the no-JS price through it
     · .pg-note stays outside #pg-addon (the 2026-08-24f accessibility fix)
     · the collection row still hides — `hidden` loses to display:flex without
       .pg-row[hidden], and the row would show AED 1,950.00 unticked

       npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
       node tools/qa/prog-card.mjs [--shots]

   Shots (with --shots) land in .qa-out/prog-card/ (gitignored).                */
import { chromium } from 'playwright';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, statSync, readFileSync, mkdirSync } from 'node:fs';

const ROOT  = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHOTS = process.argv.includes('--shots');
const OUT   = path.join(ROOT, '.qa-out', 'prog-card');
if (SHOTS) mkdirSync(OUT, { recursive: true });
const PORT = 8141;
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.webp':'image/webp', '.avif':'image/avif', '.png':'image/png', '.jpg':'image/jpeg',
  '.svg':'image/svg+xml', '.woff2':'font/woff2', '.ico':'image/x-icon', '.mp4':'video/mp4' };

let bad = 0;
const ok = (c, name, detail = '') => {
  console.log(`  ${c ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!c) bad++;
};

const srv = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  r.end(readFileSync(f));
});
await new Promise(r => srv.listen(PORT, r));

const NM = path.join(ROOT, 'node_modules');
if (!existsSync(path.join(NM, 'gsap', 'dist', 'gsap.min.js'))) {
  console.log('! gsap/lenis not installed — see the run command in this file\'s header');
  process.exit(1);
}
const MAP = [
  [/gsap@3\.13\.0\/dist\/gsap\.min\.js/, path.join(NM, 'gsap/dist/gsap.min.js')],
  [/ScrollTrigger\.min\.js/,             path.join(NM, 'gsap/dist/ScrollTrigger.min.js')],
  [/SplitText\.min\.js/,                 path.join(NM, 'gsap/dist/SplitText.min.js')],
  [/lenis@1\.3\.4\/dist\/lenis\.min\.js/, path.join(NM, 'lenis/dist/lenis.min.js')],
];

/* the sequence a reader must meet on a phone, top to bottom. It is HIS order and
   it is not the DOM order — the two columns interleave here. */
const PHONE_ORDER = ['.pxd-kicker', 'h3', '.pc-price', '.pc-inc', '.pc-add', '.pc-exc',
                     '.pg-sum', '.prog-cta'];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ||
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

for (const [dir, figure] of [['hormone-therapy-bhrt', 'AED 950'],
                             ['modern-menopause',     'AED 950'],
                             ['testosterone-top-up',  'AED 1,150']]) {
  console.log(`\n\x1b[1m${dir}\x1b[0m`);
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.route('**://cdn.jsdelivr.net/**', route => {
    const hit = MAP.find(([re]) => re.test(route.request().url()));
    hit ? route.fulfill({ contentType: 'text/javascript', body: readFileSync(hit[1], 'utf8') })
        : route.abort();
  });
  await page.goto(`http://127.0.0.1:${PORT}/${dir}/?probe=1`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  /* the site header is sticky, so it paints over the top of a tall element shot.
     It is not part of what this file photographs. */
  if (SHOTS) await page.evaluate(() => {
    document.querySelectorAll('header,.hdr,.nav').forEach(h => { h.style.display = 'none'; });
  });

  /* ── structure ── */
  const st = await page.evaluate(() => {
    const c = document.querySelector('.prog-card');
    const price = c?.querySelector('.pc-price');
    const note = document.querySelector('.pg-note');
    return {
      card:   !!c,
      cols:   [!!c?.querySelector(':scope > .pc-col--l'), !!c?.querySelector(':scope > .pc-col--r')],
      priceR: !!c?.querySelector('.pc-col--r > .pc-price'),
      amtCls: price?.getAttribute('class'),
      priceTx: price?.textContent.replace(/\s+/g, ' ').trim(),
      mores:  [...c.querySelectorAll('.pc-exc .pc-more')].map(d => ({
                sum: !!d.querySelector(':scope > summary'),
                sml: (d.querySelector(':scope > small')?.textContent || '').trim().length > 0,
                shut: !d.open })),
      excPlain: c.querySelectorAll('.pc-exc .pg-list li:not(:has(.pc-more))').length,
      noteOut: !!note && !document.querySelector('#pg-addon .pg-note'),
      addonName: document.getElementById('pg-addon')?.textContent.replace(/\s+/g, ' ').trim(),
      ids:    ['pg-sub', 'pg-vat', 'pg-total', 'pg-addon-amt', 'pg-addon', 'pg-row-addon']
                .filter(i => !document.getElementById(i)),
      rowHid: getComputedStyle(document.getElementById('pg-row-addon')).display,
      tracks: getComputedStyle(c).gridTemplateColumns.split(' ').length,
    };
  });
  ok(st.card && st.cols[0] && st.cols[1], 'the card carries both column wrappers');
  ok(st.tracks === 2, 'two grid tracks at 1440', String(st.tracks));
  ok(st.priceR, 'the figure sits in the right column');
  ok(/\bpg-amt$/.test(st.amtCls || ''), '.pg-amt is LAST in the figure\'s class list', st.amtCls);
  ok((st.priceTx || '').startsWith(figure), `the figure reads ${figure}`, st.priceTx);
  ok(st.mores.length === 4, 'four not-included rows are disclosures', String(st.mores.length));
  ok(st.mores.every(m => m.sum && m.sml), 'every + has a label and a sentence to open onto');
  ok(st.mores.every(m => m.shut), 'all four start closed');
  ok(st.excPlain === 0, 'no not-included row was left without its +', String(st.excPlain));
  ok(st.noteOut, 'the outside-UAE note is present and OUTSIDE the priced toggle');
  ok(!/outside the UAE/i.test(st.addonName || ''),
     'the toggle\'s accessible name does not swallow the outside-UAE line');
  ok(st.ids.length === 0, 'all four money IDs and both toggles survive', st.ids.join(' '));
  ok(st.rowHid === 'none', 'the collection row is hidden until it is ticked', st.rowHid);

  /* ── the + actually opens, and it opens without a script ── */
  const opened = await page.evaluate(async () => {
    const d = document.querySelector('.pc-exc .pc-more');
    const h0 = d.getBoundingClientRect().height;
    d.querySelector('summary').click();
    await new Promise(r => setTimeout(r, 420));
    return { grew: d.getBoundingClientRect().height > h0 + 6, open: d.open };
  });
  ok(opened.open && opened.grew, 'tapping a + opens the row and it grows');
  await page.evaluate(() => document.querySelectorAll('.pc-more').forEach(d => { d.open = false; }));

  if (SHOTS) await page.locator('.prog-grid--card').screenshot({ path: path.join(OUT, `${dir}-desktop.png`) });

  /* ── phone: one column, and HIS order, measured ── */
  await page.setViewportSize({ width: 390, height: 900 });
  await page.evaluate(() => document.fonts.ready);
  const ph = await page.evaluate((SEL) => {
    const c = document.querySelector('.prog-card');
    const tops = SEL.map(s => {
      const el = c.querySelector(s);
      return el ? Math.round(el.getBoundingClientRect().top) : null;
    });
    return { tracks: getComputedStyle(c).gridTemplateColumns.split(' ').length, tops,
             dissolved: getComputedStyle(c.querySelector('.pc-col--l')).display };
  }, PHONE_ORDER);
  ok(ph.tracks === 1, 'one grid track at 390', String(ph.tracks));
  ok(ph.dissolved === 'contents', 'the column wrappers dissolve on phone', ph.dissolved);
  const rising = ph.tops.every((t, i) => t !== null && (i === 0 || t > ph.tops[i - 1]));
  ok(rising, 'phone order: kicker → title → figure → included → add-on → not included → summary → cta',
     ph.tops.join(' '));
  if (SHOTS) await page.locator('.prog-grid--card').screenshot({ path: path.join(OUT, `${dir}-phone.png`) });

  ok(errs.length === 0, 'page console clean', errs.join(' | ').slice(0, 200));
  await page.close();
}

await browser.close(); srv.close();
console.log(bad ? `\n\x1b[31m${bad} failed\x1b[0m` : '\n\x1b[32mall green\x1b[0m');
process.exit(bad ? 1 : 0);
