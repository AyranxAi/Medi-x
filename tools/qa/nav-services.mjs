/* ══ THE MENU'S SERVICE GROUP — eight pages, one shape ═══════════════════════════
   The four pages the menu never showed (three doors + boosters) now sit under Hormone
   Therapy behind a chevron. His call off a four-way board, 2026-08-29e.

   ⚠️ THE NAV MARKUP CANNOT BE BYTE-IDENTICAL — every page needs its own relative
   prefix and its own aria-current — so parity is asserted on SHAPE instead: the same
   items, in the same order, resolving to real files, with exactly one current mark.
   The CSS and JS blocks ARE byte-identical and are hashed.

   node tools/qa/nav-services.mjs */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MIME = { html:'text/html', js:'text/javascript', css:'text/css', png:'image/png',
  webp:'image/webp', avif:'image/avif', svg:'image/svg+xml', woff2:'font/woff2', ico:'image/x-icon' };
const srv = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f).slice(1)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(path.join(base, 'chromium'))) return path.join(base, 'chromium');
  if (existsSync(base)) for (const d of readdirSync(base)) {
    const c = path.join(base, d, 'chrome-linux', 'chrome'); if (existsSync(c)) return c;
  }
}
await new Promise(r => srv.listen(0, r));
const BASE = `http://localhost:${srv.address().port}`;
const NM = path.join(ROOT, 'node_modules');
const MAP = [[/gsap@3\.13\.0\/dist\/gsap\.min\.js/, 'gsap/dist/gsap.min.js'],
  [/ScrollTrigger\.min\.js/, 'gsap/dist/ScrollTrigger.min.js'],
  [/SplitText\.min\.js/, 'gsap/dist/SplitText.min.js'],
  [/lenis@1\.3\.4\/dist\/lenis\.min\.js/, 'lenis/dist/lenis.min.js']];
const browser = await chromium.launch({ executablePath: findChromium() });
let fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) fail++; };
async function open(o = {}) {
  const ctx = await browser.newContext(o);
  await ctx.route('**/cdn.jsdelivr.net/**', r => { const u = r.request().url();
    for (const [re, f] of MAP) if (re.test(u)) return r.fulfill({ status:200, contentType:'text/javascript', body: readFileSync(path.join(NM, f)) });
    return r.abort(); });
  return ctx.newPage();
}
const PAGES = { '/':'', '/hormone-balancing/':'', '/hormone-therapy-bhrt/':'hormone-therapy-bhrt',
  '/modern-menopause/':'modern-menopause', '/testosterone-top-up/':'testosterone-top-up',
  '/programs/':'programs', '/functional-medicine/':'', '/peptide-therapy/':'' };
const FILES = ['index.html','hormone-balancing/index.html','hormone-therapy-bhrt/index.html',
  'modern-menopause/index.html','testosterone-top-up/index.html','programs/index.html',
  'functional-medicine/index.html','peptide-therapy/index.html'];
const WANT = ['Hormone Therapy BHRT','Modern Menopause','Testosterone Top Up','Booster Programmes'];

/* ── 0 · the shared blocks are byte-identical on all eight ── */
{
  console.log('0 · NAV block parity, eight pages');
  for (const b of ['CSS','JS']) {
    const s = new Set(FILES.map(f => execSync(
      `sed -n "/NAV:${b}:START/,/NAV:${b}:END/p" ${path.join(ROOT,f)} | md5sum | cut -c1-12`).toString().trim()));
    ok(s.size === 1, `NAV:${b} ${s.size === 1 ? 'aligned' : 'DRIFTED'} — ${[...s].join(' ')}`);
  }
}

/* ── 1 · shape, links and the current mark, on every page ── */
{
  console.log('1 · the group, on all eight');
  for (const [url, selfDoor] of Object.entries(PAGES)) {
    const page = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const bad = [];
    page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    await page.goto(`${BASE}${url}?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => {
      const sub = document.getElementById('nav-services');
      const t = document.querySelector('[data-nav-toggle]');
      return {
        items: [...(sub?.querySelectorAll('a') || [])].map(a => a.textContent.trim()),
        hrefs: [...(sub?.querySelectorAll('a') || [])].map(a => a.getAttribute('href')),
        current: [...(sub?.querySelectorAll('[aria-current]') || [])].map(a => a.textContent.trim()),
        expanded: t?.getAttribute('aria-expanded'),
        hidden: sub?.hidden,
        controls: t?.getAttribute('aria-controls'),
        /* the label must still be its own link — the whole point of the two targets */
        hubIsLink: document.querySelector('.nav-row > a')?.tagName === 'A',
        toggleIsButton: t?.tagName === 'BUTTON',
        order: [...document.querySelectorAll('.nav ol > li')].map(li =>
          li.querySelector('a')?.textContent.trim()),
      };
    });
    const tag = url.padEnd(24);
    ok(r.items.join('|') === WANT.join('|'), `${tag} four services, in order`);
    ok(r.controls === 'nav-services' && r.toggleIsButton && r.hubIsLink,
      `${tag} label is a link, chevron is a button`);
    /* the group ships open exactly on the pages it contains */
    const shouldOpen = selfDoor !== '';
    ok((r.expanded === 'true') === shouldOpen && r.hidden === !shouldOpen,
      `${tag} ships ${shouldOpen ? 'OPEN (it holds this page)' : 'collapsed'}`);
    ok(r.current.length === (shouldOpen ? 1 : 0), `${tag} ${shouldOpen ? 'marks the current page' : 'marks nothing'}`);
    ok(bad.length === 0, `${tag} every nav destination resolves${bad.length ? ' — ' + bad[0] : ''}`);
    await page.close();
  }
}

/* ── 2 · every link in the group actually resolves to a file ── */
{
  console.log('2 · the destinations exist');
  const page = await open({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/?probe=1`, { waitUntil: 'networkidle' });
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('#nav-services a')].map(a => a.href));
  for (const h of hrefs) {
    const res = await page.request.get(h);
    ok(res.status() === 200, `${new URL(h).pathname} → ${res.status()}`);
  }
  await page.close();
}

/* ── 3 · the chevron works, and the label still travels ── */
{
  console.log('3 · behaviour');
  const page = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}/?probe=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.evaluate(() => { document.getElementById('nav').hidden = false; document.body.classList.add('nav-open'); });
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => document.getElementById('nav-services').hidden);
  /* ⚠️ THE CHEVRON'S TARGET IS THE THING THIS CHECK IS FOR. 44px is the floor; the glyph
     is 11px, so a shrunk hit area would still LOOK right and be unusable on a phone. */
  const box = await page.evaluate(() => {
    const b = document.querySelector('[data-nav-toggle]').getBoundingClientRect();
    return { w: Math.round(b.width), h: Math.round(b.height) };
  });
  ok(box.w >= 44 && box.h >= 44, `chevron target ${box.w}×${box.h} (≥44)`);
  await page.click('[data-nav-toggle]');
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => ({
    hidden: document.getElementById('nav-services').hidden,
    exp: document.querySelector('[data-nav-toggle]').getAttribute('aria-expanded'),
    reachable: [...document.querySelectorAll('#nav-services a')].every(a => a.offsetParent !== null),
  }));
  ok(before === true && after.hidden === false && after.exp === 'true', 'chevron expands the group');
  ok(after.reachable, 'all four become visible and tabbable');
  /* the label is a separate target: clicking it navigates rather than toggling */
  await page.click('.nav-row > a');
  await page.waitForLoadState('networkidle');
  ok(new URL(page.url()).pathname === '/hormone-balancing/',
    `the label still goes to the hub in one tap — ${new URL(page.url()).pathname}`);
  await page.close();
}

/* ── 4 · no language blanks the new rows ── */
{
  console.log('4 · six languages');
  const page = await open({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/?probe=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  for (const code of ['en','ar','de','fr','ru','zh']) {
    const txt = await page.evaluate(c => {
      document.querySelectorAll('.lang__item').forEach(i => { if (i.getAttribute('data-lang') === c) i.click(); });
      return new Promise(r => setTimeout(() => r(
        [...document.querySelectorAll('#nav-services a')].map(a => a.textContent.trim())), 250));
    }, code);
    ok(txt.length === 4 && txt.every(t => t.length > 0),
      `${code}: four rows, none blank — ${txt.join(' · ').slice(0, 60)}`);
  }
  await page.close();
}

console.log(fail ? `\n${fail} FAILED` : '\nall green');
await browser.close(); srv.close();
process.exit(fail ? 1 : 0);
