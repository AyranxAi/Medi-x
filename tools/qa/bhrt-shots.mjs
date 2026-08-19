/* ═══ hormone-therapy-bhrt/ — screenshot pass + smoke checks ════════════════════════
   The build round's eyes for the BHRT page: serves the repo, reroutes the four CDN
   scripts to node_modules (egress policy blocks jsDelivr in sandboxes — NOTHING ABOUT
   THAT SHIPS, the page still loads them from the CDN), then photographs the page at
   the states a reviewer needs to judge and runs the structural smoke checks.
   This is not the page's full harness — writing one on the pattern of
   peptide-page.mjs is the natural next round once copy is signed off.

     npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
     node tools/qa/bhrt-shots.mjs

   Shots land in .qa-out/bhrt/ (gitignored, regenerated every run). Exits non-zero on
   any smoke failure. */
import { chromium } from 'playwright';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, mkdirSync, readdirSync } from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT  = path.join(ROOT, '.qa-out', 'bhrt');
mkdirSync(OUT, { recursive: true });

const MIME = { html:'text/html', js:'text/javascript', mjs:'text/javascript', css:'text/css',
  webp:'image/webp', avif:'image/avif', png:'image/png', svg:'image/svg+xml',
  woff2:'font/woff2', ico:'image/x-icon' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f).slice(1)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});

function findNM() {
  for (const t of [path.join(ROOT, 'node_modules'), process.env.QA_NODE_MODULES].filter(Boolean))
    if (existsSync(path.join(t, 'gsap', 'dist', 'gsap.min.js'))) return t;
  return null;
}
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
const NM = findNM();
if (!NM) { console.log('! gsap/lenis not found — install them first'); process.exit(1); }
const MAP = [
  [/gsap@3\.13\.0\/dist\/gsap\.min\.js/, path.join(NM, 'gsap/dist/gsap.min.js')],
  [/ScrollTrigger\.min\.js/,             path.join(NM, 'gsap/dist/ScrollTrigger.min.js')],
  [/SplitText\.min\.js/,                 path.join(NM, 'gsap/dist/SplitText.min.js')],
  [/lenis@1\.3\.4\/dist\/lenis\.min\.js/, path.join(NM, 'lenis/dist/lenis.min.js')],
];

await new Promise(r => srv.listen(0, r));
const PORT = srv.address().port;
const browser = await chromium.launch({ executablePath: findChromium() });

let fails = 0;
const ok = (cond, label, extra='') => {
  console.log(`${cond ? '  ✓' : '  ✗ FAIL'} ${label}${extra ? ' — ' + extra : ''}`);
  if (!cond) fails++;
};

async function mk(w, h, opts={}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opts });
  await ctx.route('**/cdn.jsdelivr.net/**', route => {
    const u = route.request().url();
    for (const [re, f] of MAP) if (re.test(u)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: readFileSync(f) });
    return route.abort();
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  return { ctx, page, errs };
}
const URL_ = `http://127.0.0.1:${PORT}/hormone-therapy-bhrt/`;
const settle = ms => new Promise(r => setTimeout(r, ms));

/* ── 1 · the Tide at its stops, solo, desktop + phone ──────────────────────────── */
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'p']]) {
  for (const p of ['0.06', '0.20', '0.32', '0.48', '0.60', '0.70', '0.80', '0.93']) {
    const { ctx, page, errs } = await mk(w, h);
    await page.goto(`${URL_}?scene=${p}`, { waitUntil: 'networkidle' });
    await settle(900);
    await page.screenshot({ path: path.join(OUT, `scene-${tag}-${p.replace('.', '')}.png`) });
    if (p === '0.48') ok(errs.length === 0, `scene ${tag} console clean`, errs.join(' | ').slice(0, 200));
    await ctx.close();
  }
}

/* ── 2 · the full page, desktop — smoke ────────────────────────────────────────── */
{
  const { ctx, page, errs } = await mk(1440, 900);
  await page.goto(`${URL_}?probe=1`, { waitUntil: 'networkidle' });
  await settle(800);
  ok(errs.length === 0, 'page console clean (probe)', errs.join(' | ').slice(0, 300));

  const smoke = await page.evaluate(() => ({
    beats:   document.querySelectorAll('.scene-beat').length,
    steps:   document.querySelectorAll('.pg-steps li').length,
    docs:    document.querySelectorAll('.doc').length,
    names:   [...document.querySelectorAll('.doc > h3')].map(h => h.textContent.trim()),
    faq:     document.querySelectorAll('.faq-item').length,
    stories: document.querySelectorAll('.story').length,
    labels:  document.querySelectorAll('.month-label').length,
    chips:   document.querySelectorAll('.chip').length,
    armed:   !!document.querySelector('[data-month].month-armed'),
    ticks:   document.querySelectorAll('.month-ticks line').length,
    keyUses: document.querySelectorAll('.key-stage use').length,
    title:   document.title,
    sub:     document.getElementById('pg-sub')?.textContent,
    vat:     document.getElementById('pg-vat')?.textContent,
    total:   document.getElementById('pg-total')?.textContent,
    banned:  /DUTCH|BOZAT/i.test(document.body.textContent),
    menoMix: /menoSTART|Modern Menopause/i.test(document.body.textContent),
    order:   [...document.querySelectorAll('main > section, main > div[id]')].map(e => e.id || e.className.split(' ')[0]),
  }));
  ok(smoke.beats === 6, 'six scene beats', String(smoke.beats));
  ok(smoke.steps === 6, 'six programme steps', String(smoke.steps));
  ok(smoke.docs === 4, 'four doctors', String(smoke.docs));
  ok(smoke.names.some(n => /Nahla/.test(n)), 'Dr. Nahla on the row', smoke.names.join(' · '));
  ok(smoke.faq === 6, 'six FAQ items', String(smoke.faq));
  ok(smoke.stories === 3, 'three stories', String(smoke.stories));
  ok(smoke.labels === 8 && smoke.chips === 8, 'eight month labels = eight fallback chips', `${smoke.labels}/${smoke.chips}`);
  ok(smoke.armed && smoke.ticks === 28, 'month wheel armed with 28 ticks', `armed=${smoke.armed} ticks=${smoke.ticks}`);
  ok(smoke.keyUses === 2, 'identical key: two stamped skeletons', String(smoke.keyUses));
  ok(smoke.sub === 'AED 950.00' && smoke.vat === 'AED 47.50' && smoke.total === 'AED 997.50',
     'money: 950.00 / 47.50 / 997.50', `${smoke.sub} ${smoke.vat} ${smoke.total}`);
  ok(!smoke.banned, 'no DUTCH, no BOZAT anywhere');
  ok(!smoke.menoMix, 'no Modern Menopause vocabulary on this page');

  /* full-page top shot BEFORE any interaction — page.click() auto-scrolls, and a
     "top" shot taken after it photographs the middle of the page */
  await page.evaluate(() => scrollTo(0, 0));
  await settle(500);
  await page.screenshot({ path: path.join(OUT, 'page-d-top.png') });

  /* the add-on toggle re-derives every row */
  await page.click('#pg-addon');
  const money2 = await page.evaluate(() => ({
    row: !document.getElementById('pg-row-addon').hidden,
    vat: document.getElementById('pg-vat').textContent,
    total: document.getElementById('pg-total').textContent,
    pressed: document.getElementById('pg-addon').getAttribute('aria-pressed'),
  }));
  ok(money2.row && money2.vat === 'AED 145.00' && money2.total === 'AED 3,045.00' && money2.pressed === 'true',
     'add-on: row shown, 145.00 VAT, 3,045.00 total', `${money2.vat} ${money2.total}`);

  /* the flip — symptom → answer in place */
  const flip = await page.evaluate(() => {
    const b = document.querySelector('.month-label');
    b.click();
    const cs = getComputedStyle(b.querySelector('.ml-ans'));
    return { flipped: b.classList.contains('flipped'), ansShown: cs.display !== 'none' };
  });
  ok(flip.flipped && flip.ansShown, 'month label flips to its answer');

  /* full-page shots */
  for (const [id, name] of [['programme','programme'],['month','month'],['messengers','messengers'],['doctors','docs'],['book','final']]) {
    await page.evaluate(id => document.getElementById(id)?.scrollIntoView(), id);
    await settle(700);
    await page.screenshot({ path: path.join(OUT, `page-d-${name}.png`) });
  }
  await ctx.close();
}

/* ── 3 · the phone — fallback layout + no sideways scroll, thirteen widths ─────── */
{
  const { ctx, page } = await mk(390, 844);
  await page.goto(`${URL_}?probe=1`, { waitUntil: 'networkidle' });
  await settle(600);
  const m = await page.evaluate(() => ({
    armed: !!document.querySelector('[data-month].month-armed'),
    labels: document.querySelectorAll('.month-label').length,
  }));
  ok(!m.armed && m.labels === 8, 'phone: wheel unarmed, eight chips flow', `armed=${m.armed}`);
  await page.screenshot({ path: path.join(OUT, 'page-p-top.png') });
  for (const [id, name] of [['programme','programme'],['month','month'],['messengers','messengers']]) {
    await page.evaluate(id => document.getElementById(id)?.scrollIntoView(), id);
    await settle(600);
    await page.screenshot({ path: path.join(OUT, `page-p-${name}.png`) });
  }
  await ctx.close();

  for (const w of [320, 360, 375, 390, 430, 480, 600, 760, 900, 1104, 1280, 1440, 1920]) {
    const { ctx: c2, page: p2 } = await mk(w, 900);
    await p2.goto(`${URL_}?probe=1`, { waitUntil: 'networkidle' });
    await settle(350);
    const sw = await p2.evaluate(() => document.documentElement.scrollWidth);
    ok(sw <= w, `no sideways scroll at ${w}`, `scrollWidth=${sw}`);
    await c2.close();
  }
}

/* ── 4 · reduced motion — fallback sections stand, no scene, key locked ────────── */
{
  const { ctx, page, errs } = await mk(1440, 900, { reducedMotion: 'reduce' });
  await page.goto(URL_, { waitUntil: 'networkidle' });
  await settle(700);
  const rm = await page.evaluate(() => ({
    sceneClass: document.documentElement.classList.contains('js-scene'),
    keyArmed: !!document.querySelector('[data-key].key-armed'),
    chips: document.querySelectorAll('.chip').length,
  }));
  ok(!rm.sceneClass, 'reduced motion: scene stands down (fallback path)');
  ok(!rm.keyArmed, 'reduced motion: identical key ships locked');
  ok(rm.chips === 8, 'reduced motion: the eight chips stand');
  ok(errs.length === 0, 'reduced motion console clean', errs.join(' | ').slice(0, 200));
  await page.screenshot({ path: path.join(OUT, 'reduced-top.png') });
  await ctx.close();
}

/* ── 5 · the hero is alive (and deterministic per frame) ───────────────────────── */
{
  const { ctx, page } = await mk(1440, 900);
  await page.goto(URL_, { waitUntil: 'networkidle' });
  await settle(1200);
  const a = await page.locator('#silk').screenshot();
  await settle(2600);
  const b = await page.locator('#silk').screenshot();
  ok(Buffer.compare(a, b) !== 0, 'hero canvas is alive (two frames differ)');
  await ctx.close();
}

await browser.close();
srv.close();
console.log(fails ? `\n${fails} FAILURE(S)` : '\nall green');
process.exit(fails ? 1 : 0);
