/* ══ /programs/ — the booster-programmes page, end to end ══════════════════════
   Round-two gate (2026-08-26): the flower chapter, the pair of programme cards
   and their two decision boards, the doctors row + popup, the fader, the FAQ,
   plus the page-wide invariants (no sideways scroll at ten widths, no console
   errors, PS-block parity with the doors).

   ⚠️ RUN ALONE — SwiftShader rule, tools/qa/README.md. Every assertion here
   failed on purpose at least once while the page was being built (the 320/390
   overflows, the flexed .pc-var figure, the phone-only arrows, the lazy
   portraits) — they are all failures this page actually produced.

   node tools/qa/programs-page.mjs            checks only
   node tools/qa/programs-page.mjs --shots    also writes shots to /tmp/programs-qa/ */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHOTS = process.argv.includes('--shots');
const OUT = '/tmp/programs-qa/';
if (SHOTS) mkdirSync(OUT, { recursive: true });

const MIME = { html:'text/html', js:'text/javascript', mjs:'text/javascript', css:'text/css',
  png:'image/png', webp:'image/webp', avif:'image/avif', svg:'image/svg+xml', woff2:'font/woff2', ico:'image/x-icon' };
const srv = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(f).slice(1)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(path.join(base, 'chromium'))) return path.join(base, 'chromium');
  if (existsSync(base))
    for (const d of readdirSync(base)) {
      const c = path.join(base, d, 'chrome-linux', 'chrome');
      if (existsSync(c)) return c;
    }
  return undefined;
}
await new Promise(r => srv.listen(0, r));
const BASE = `http://localhost:${srv.address().port}`;
const browser = await chromium.launch({ executablePath: findChromium() });
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) fail++; };

/* ── 0 · PS-block parity: this page is a FOURTH CARRIER of the doors' contract ── */
{
  console.log('0 · PS parity, four carriers');
  for (const b of ['CSS', 'HTML', 'JS']) {
    const sums = new Set();
    const rows = [];
    for (const p of ['programs', 'hormone-therapy-bhrt', 'modern-menopause', 'testosterone-top-up']) {
      const s = execSync(
        `sed -n "/PS:${b}:START/,/PS:${b}:END/p" ${path.join(ROOT, p, 'index.html')} | md5sum | cut -c1-12`
      ).toString().trim();
      sums.add(s); rows.push(`${p}:${s}`);
    }
    /* the men's JS block carries one extra recorded comment (2026-08-24g) that
       pre-dates this page — parity is asserted against the two women's doors,
       and a THIRD sum appearing anywhere is the drift this check exists for. */
    const limit = b === 'JS' ? 2 : 1;
    ok(sums.size <= limit, `PS:${b} ${sums.size <= limit ? 'aligned' : 'DRIFTED'} — ${rows.join('  ')}`);
  }
}

/* ── 1 · console errors ── */
{
  console.log('1 · clean load');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`${BASE}/programs/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  ok(errs.length === 0, `no console errors${errs.length ? ' — ' + errs.join(' | ').slice(0, 200) : ''}`);
  await page.close();
}

/* ── 2 · no sideways scroll, ten widths ── */
{
  console.log('2 · widths');
  for (const w of [320, 390, 640, 768, 860, 1024, 1104, 1280, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(`${BASE}/programs/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(over <= 0, `${w}px${over > 0 ? ` sideways +${over}px` : ''}`);
    await page.close();
  }
}

/* ── 3 · the flower ── */
{
  console.log('3 · the flower');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/programs/?step=3`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  ok(await page.evaluate(() => document.querySelectorAll('.ps-arm').length) === 6, 'six arms built');
  ok(await page.evaluate(() => document.getElementById('process')?.getAttribute('data-active')) === '2',
    '?step=3 seats step 3');
  ok(await page.evaluate(() => !!document.querySelector('#programme noscript')), 'noscript rollback present');
  if (SHOTS) {
    await page.evaluate(() => document.getElementById('process').scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: OUT + 'flower-1440.png' });
  }
  await page.close();
  /* the arrows are a PHONE control (display:none above 900) */
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(`${BASE}/programs/?step=3`, { waitUntil: 'networkidle' });
  await phone.waitForTimeout(2000);
  await phone.evaluate(() => document.getElementById('process').scrollIntoView({ behavior: 'instant' }));
  await phone.waitForTimeout(600);
  await phone.click('[data-ps-next]');
  await phone.waitForTimeout(1600);
  ok(await phone.evaluate(() => document.getElementById('process').getAttribute('data-active')) === '3',
    'phone arrow advances');
  await phone.close();
}

/* ── 4 · the pair of cards and the two boards ── */
{
  console.log('4 · the cards');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/programs/?probe=1`, { waitUntil: 'networkidle' });
  const c = await page.evaluate(() => ({
    cards: document.querySelectorAll('#cards-grid .prog-card').length,
    details: document.querySelectorAll('#cards-grid details.pc-more').length,
    varsHidden: [...document.querySelectorAll('.pc-var')].every(el => getComputedStyle(el).display === 'none'),
    words: document.querySelectorAll('.pc-price--word').length,
    /* textContent, NOT innerHTML — the section banner's comment also says 795,
       and a comment is not a price a reader can see */
    fee795: document.getElementById('cards-grid').textContent.match(/AED 795 \+ VAT/g)?.length || 0,
    mentorship: /mentorship/i.test(document.querySelector('#cards-grid').textContent),
  }));
  ok(c.cards === 2, 'two cards');
  ok(c.details === 8, 'eight + rows');
  ok(c.varsHidden, 'price board hidden by default (incl. the flexed figure)');
  ok(c.words === 2, 'both money slots read "Priced at your consultation"');
  ok(c.fee795 === 2, `the 795 review fee on both cards (${c.fee795})`);
  ok(!c.mentorship, 'no mentorship promise on either card');
  ok(await page.evaluate(() => { const d = document.querySelector('#cards-grid details.pc-more');
    d.querySelector('summary').click(); return d.open; }), '+ row opens');
  if (SHOTS) {
    await page.evaluate(() => document.getElementById('cards-grid').scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: OUT + 'cards-default-1440.png' });
  }
  await page.goto(`${BASE}/programs/?probe=1&price=950`, { waitUntil: 'networkidle' });
  ok(await page.evaluate(() =>
    [...document.querySelectorAll('.pc-var.pg-amt')].every(el => getComputedStyle(el).display !== 'none') &&
    [...document.querySelectorAll('.pc-price--word')].every(el => getComputedStyle(el).display === 'none')),
    '?price=950 swaps the figure in');
  await page.goto(`${BASE}/programs/?probe=1&cards=stacked`, { waitUntil: 'networkidle' });
  ok(await page.evaluate(() => { const g = document.getElementById('cards-grid');
    return g.classList.contains('prog-grid--card') && !g.querySelector('.prog-card--slim'); }),
    '?cards=stacked serves full-width door cards');
  await page.close();
}

/* ── 5 · doctors: three women, ONE pill, the popup ── */
{
  console.log('5 · the doctors');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/programs/?probe=1`, { waitUntil: 'networkidle' });
  ok(await page.evaluate(() => document.querySelectorAll('.doc').length) === 3, 'three doctors');
  ok(await page.evaluate(() => document.querySelectorAll('.docs .btn').length) === 1, 'one pill in the chapter');
  await page.evaluate(() => document.getElementById('doctors').scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(1500);
  ok(await page.evaluate(() =>
    [...document.querySelectorAll('.doc-photo img')].filter(i => i.complete && i.naturalWidth > 0).length) === 3,
    'three portraits load');
  await page.click('.doc .doc-info');
  await page.waitForTimeout(700);
  ok(await page.evaluate(() => !document.getElementById('pxd').hidden && document.body.classList.contains('pxd-open')),
    'popup opens');
  if (SHOTS) await page.screenshot({ path: OUT + 'doctor-popup-1440.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  ok(await page.evaluate(() => document.getElementById('pxd').hidden), 'Escape closes it');
  await page.close();
}

/* ── 6 · fader + FAQ ── */
{
  console.log('6 · fader and FAQ');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/programs/?probe=1`, { waitUntil: 'networkidle' });
  const st = await page.evaluate(() => ({
    on: document.querySelectorAll('.story.is-on').length,
    dots: document.querySelectorAll('.story-dots button').length,
  }));
  ok(st.on === 1 && st.dots === 3, `one voice on, three dots (${st.on}/${st.dots})`);
  ok(await page.evaluate(() => {
    const qs = document.querySelectorAll('.faq-item');
    qs[0].querySelector('.faq-q').click();
    const one = document.querySelectorAll('.faq-item.open').length === 1;
    qs[1].querySelector('.faq-q').click();
    return one && document.querySelectorAll('.faq-item.open').length === 1 && qs.length === 6;
  }), 'six FAQ items, one open at a time');
  await page.close();
}

if (SHOTS) {
  for (const w of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(`${BASE}/programs/?probe=1`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await new Promise(r => { let y = 0; const t = setInterval(() => { y += 800; window.scrollTo(0, y);
        if (y > document.body.scrollHeight) { clearInterval(t); window.scrollTo(0, 0); r(); } }, 60); });
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}full-${w}.png`, fullPage: true });
    await page.close();
  }
  console.log('  shots → ' + OUT);
}

await browser.close();
srv.close();
console.log(fail === 0 ? 'ALL GREEN' : `${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
