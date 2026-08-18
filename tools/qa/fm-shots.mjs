/* ═══ functional-medicine/ — screenshot pass + smoke checks ═════════════════════════
   The build round's eyes: serves the repo, reroutes the four CDN scripts to
   node_modules (egress policy blocks jsDelivr in sandboxes — NOTHING ABOUT THAT
   SHIPS, the page still loads them from the CDN), then photographs the page at the
   states a reviewer needs to judge and runs a handful of structural smoke checks.
   This is not the page's full harness — writing one on the pattern of
   peptide-page.mjs is the natural next round once copy is signed off.

     npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
     node tools/qa/fm-shots.mjs

   Shots land in .qa-out/fm/ (gitignored, regenerated every run). Exits non-zero on any
   smoke failure. */
import { chromium } from 'playwright';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, mkdirSync, readdirSync } from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT  = path.join(ROOT, '.qa-out', 'fm');
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

async function mk(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
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
const URL_ = `http://127.0.0.1:${PORT}/functional-medicine/`;
const settle = ms => new Promise(r => setTimeout(r, ms));

/* ── 1 · the scene at its stops, solo, desktop + phone ─────────────────────────── */
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'p']]) {
  for (const p of ['0.06', '0.20', '0.32', '0.48', '0.62', '0.72', '0.80', '0.93']) {
    const { ctx, page, errs } = await mk(w, h);
    await page.goto(`${URL_}?scene=${p}`, { waitUntil: 'networkidle' });
    await settle(900);
    await page.screenshot({ path: path.join(OUT, `scene-${tag}-${p.replace('.', '')}.png`) });
    if (p === '0.48') ok(errs.length === 0, `scene ${tag} console clean`, errs.join(' | ').slice(0, 200));
    await ctx.close();
  }
}

/* ── 2 · the full page, desktop ────────────────────────────────────────────────── */
{
  const { ctx, page, errs } = await mk(1440, 900);
  await page.goto(`${URL_}?probe=1`, { waitUntil: 'networkidle' });
  await settle(800);
  ok(errs.length === 0, 'page console clean (probe)', errs.join(' | ').slice(0, 300));

  /* smoke: beats == SCHED, ring alive, eight cards, dots, doctors, faq */
  const smoke = await page.evaluate(() => {
    const beats = document.querySelectorAll('.scene-beat').length;
    const rail = document.getElementById('rail');
    return {
      beats,
      isRing: rail.classList.contains('is-ring'),
      cards: rail.querySelectorAll('.pw').length,
      dots: document.querySelectorAll('#railDots button').length,
      arts: [...rail.querySelectorAll('.pw')].map(c => (c.dataset.art || '').split('/').pop() || '(plate)'),
      docs: document.querySelectorAll('.doc').length,
      chooser: document.getElementById('pxd-choose').content.querySelectorAll('.pxd-doc').length,
      faq: document.querySelectorAll('.faq-item').length,
      stories: document.querySelectorAll('.story').length,
      title: document.title,
    };
  });
  ok(smoke.beats === 6, `6 beats (${smoke.beats})`);
  ok(smoke.isRing && smoke.cards === 8, `ring live with 8 cards`);
  ok(smoke.dots === 8, `8 dots`);
  ok(smoke.docs === 4 && smoke.chooser === 4, `4 doctors, 4 chooser rows`);
  ok(smoke.faq === 6 && smoke.stories === 3, `6 faq, 3 stories`);
  console.log('    cards: ' + smoke.arts.join(' · '));

  /* has-art settles async — give the probes a beat */
  await settle(700);
  const arts = await page.evaluate(() =>
    [...document.querySelectorAll('.pw')].map(c => c.classList.contains('has-art')));
  ok(arts.filter(Boolean).length === 6, `6 photographs loaded, 2 designed plates (${arts.map(a => a ? '■' : '·').join('')})`);

  await page.screenshot({ path: path.join(OUT, 'hero-d.png') });
  for (const [sel, name] of [['#define', 'define'], ['#services', 'services'], ['#doctors', 'doctors'],
                             ['#stories', 'stories'], ['#faq', 'faq'], ['#book', 'final']]) {
    await page.evaluate(s => document.querySelector(s).scrollIntoView(), sel);
    await settle(650);
    await page.screenshot({ path: path.join(OUT, `${name}-d.png`) });
  }
  /* the ring: flip the front card, then pick two and shoot the tray */
  await page.evaluate(() => document.querySelector('#services').scrollIntoView());
  await page.addStyleTag({ content: '.pw{animation:none}' });
  await settle(700);
  await page.click('.pw[data-focus="true"] .pw-more');
  await settle(1000);
  await page.screenshot({ path: path.join(OUT, 'services-flip-d.png') });
  await page.click('.pw[data-open="true"] .pw-close');
  await settle(900);
  await page.evaluate(() => {
    document.querySelector('.pw[data-focus="true"] .pw-face').click();
  });
  await settle(400);
  await page.click('#railNext');
  await settle(1000);
  await page.evaluate(() => {
    document.querySelector('.pw[data-focus="true"] .pw-face').click();
  });
  await settle(600);
  const tray = await page.evaluate(() => ({
    on: document.getElementById('px-tray').classList.contains('on'),
    n: document.getElementById('px-tray-n').textContent,
    l: document.getElementById('px-tray-l').textContent,
  }));
  ok(tray.on && /2 chosen/.test(tray.n), `tray: "${tray.n}" — "${tray.l}"`);
  await page.screenshot({ path: path.join(OUT, 'services-picked-d.png') });
  /* the panel */
  await page.click('#px-tray-go');
  await settle(800);
  const panel = await page.evaluate(() => ({
    recap: document.getElementById('pg-recap').textContent,
    total: document.getElementById('pg-total').textContent,
  }));
  ok(/Functional medicine for/.test(panel.recap), `panel recap: "${panel.recap}"`);
  ok(panel.total === 'AED 1,207.50', `panel total ${panel.total}`);
  await page.screenshot({ path: path.join(OUT, 'panel-d.png') });
  await page.keyboard.press('Escape');
  await settle(500);
  /* a doctor bio */
  await page.evaluate(() => document.querySelector('#doctors').scrollIntoView());
  await settle(500);
  await page.click('.doc:first-child .doc-info');
  await settle(800);
  await page.screenshot({ path: path.join(OUT, 'doctor-bio-d.png') });
  await ctx.close();
}

/* ── 3 · overflow sweep — the document must not scroll sideways ────────────────── */
for (const w of [1440, 1180, 900, 700, 430, 390, 360]) {
  const { ctx, page } = await mk(w, 900);
  await page.goto(`${URL_}?probe=1`, { waitUntil: 'networkidle' });
  await settle(600);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  /* 360 is the repo's recorded known-fail (footer .f-news 22rem) on every page — assert ≤ 0 elsewhere */
  if (w === 360) console.log(`  · 360px overflow ${over}px (recorded known state on all pages — compare, don't gate)`);
  else ok(over <= 0, `${w}px no sideways scroll`, over > 0 ? `${over}px over` : '');
  await ctx.close();
}

/* ── 4 · the phone ring + flip ─────────────────────────────────────────────────── */
{
  const { ctx, page } = await mk(390, 844);
  await page.goto(`${URL_}?probe=1`, { waitUntil: 'networkidle' });
  await settle(700);
  await page.evaluate(() => document.querySelector('#services').scrollIntoView());
  await page.addStyleTag({ content: '.pw{animation:none}' });
  await settle(700);
  await page.screenshot({ path: path.join(OUT, 'services-p.png') });
  await page.click('.pw[data-focus="true"] .pw-more');
  await settle(1000);
  await page.screenshot({ path: path.join(OUT, 'services-flip-p.png') });
  const flip = await page.evaluate(() => {
    const c = document.querySelector('.pw[data-open="true"]');
    return c ? getComputedStyle(c.querySelector('.pw-back')).opacity : 'no-open-card';
  });
  ok(flip === '1', `phone flip shows the back (opacity ${flip})`);
  await page.screenshot({ path: path.join(OUT, 'hero-p.png'), clip: { x: 0, y: 0, width: 390, height: 844 } });
  await page.evaluate(() => scrollTo(0, 0));
  await settle(600);
  await page.screenshot({ path: path.join(OUT, 'hero-p.png') });
  await ctx.close();
}

await browser.close();
srv.close();
console.log(fails ? `\n${fails} FAILURE(S)` : '\nall smoke checks green');
process.exit(fails ? 1 : 0);
