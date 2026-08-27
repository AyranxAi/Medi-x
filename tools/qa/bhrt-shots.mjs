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

/* ⚠️ 04 · THE MONTH, MAPPED and 05 · WHAT ARE HORMONES CAME OFF THIS PAGE ON 2026-08-26 —
   his call, the same two-chapter cut made on all three doors that day. Both are archived
   whole in archive/hormone-therapy-bhrt-sections/, restorable by paste.
   ⚠️ THEIR CHECKS ARE GATED, NOT DELETED, AND THAT IS DELIBERATE. Every assertion that
   reached into either chapter — eight month labels against eight fallback chips, the ring
   armed with 28 ticks, the flip, the five .msg-cards and their span map, the two stamped
   skeletons in .key-stage, the key shipping locked under reduced motion — is still written
   below, unchanged, behind this one flag. Flip it to true and they all run again, so a
   RESTORE IS A PASTE PLUS ONE WORD rather than a re-derivation of checks nobody has the
   measurements for any more.
   ⚠️ WHILE IT IS false THE else-BRANCHES ASSERT THE OPPOSITE: zero month labels, zero
   .msg-cards, zero .key-stage uses — i.e. no orphan markup was left behind by the removal.
   A gate that checks nothing would let a half-finished restore pass. */
const HAS_DEVICE = false;

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
    /* ⚠️ THE SIX STEPS ARE THE SCULPTURE'S NOW, NOT AN <ol>'s. This read
       `.pg-steps li` until 2026-08-24 and had been quietly returning 0 since the
       flower shipped: the original list moved into <noscript>, whose contents are a
       TEXT NODE in a scripting-enabled browser, so the selector matched nothing and
       the check reported a page with no programme steps at all. Both halves are asked
       for now — the six petals a reader gets, and the six <li> in the rollback list a
       reader without JS gets, counted out of the raw text because they are not DOM. */
    steps:   document.querySelectorAll('#process .ps-arm').length,
    rollback: (document.querySelector('#programme noscript')?.textContent.match(/<li>/g) || []).length,
    docs:    document.querySelectorAll('.doc').length,
    names:   [...document.querySelectorAll('.doc > h3')].map(h => h.textContent.trim()),
    /* the five dossiers, and the two precursors' centred seats — the nth-child
       centring is positional, so a reordered <article> moves the layout silently */
    msgs:    document.querySelectorAll('.msg-card').length,
    msgCols: [...document.querySelectorAll('.msg-card')].map(c => getComputedStyle(c).gridColumnStart),
    /* the international blood-test line must be OUTSIDE the priced toggle: a
       <button>'s whole subtree is its accessible name, and inside it the note
       was announced as part of the AED 1,950 offer */
    noteOut: !!document.querySelector('.pg-note') && !document.querySelector('#pg-addon .pg-note'),
    addonName: document.getElementById('pg-addon')?.textContent.replace(/\s+/g,' ').trim(),
    /* the UK-English rule: visible copy only, and estradiol/estrogen are the
       INN and deliberately not oestradiol/oestrogen (BRAND.md) */
    usSpell: (document.body.innerText.match(/\b\w*(?:personaliz|optimiz|utiliz|specializ)\w*\b/gi) || []),
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
  ok(smoke.steps === 6, 'six programme steps (the sculpture)', String(smoke.steps));
  ok(smoke.rollback === 6, 'six steps in the <noscript> rollback list', String(smoke.rollback));
  ok(smoke.docs === 3, 'three doctors', String(smoke.docs));
  /* ⚠️ THE ORDER IS ASSERTED, NOT JUST THE SET — his call 2026-08-24f named it
     outright (Dr. V, Dr. N, Dr. D) and all three are women, which was the
     instruction. A "sync the doctors" pass on another page would restore the
     peptide four here silently; this is the check that refuses it. */
  ok(/Valentina/.test(smoke.names[0] || '') && /Nahla/.test(smoke.names[1] || '')
     && /Diana/.test(smoke.names[2] || ''),
     'the row is Valentina · Nahla · Diana, in that order', smoke.names.join(' · '));
  ok(!smoke.names.some(n => /Andrey|Eslam|Khalid|Puri/.test(n)),
     'no doctor from the peptide four is back on this page', smoke.names.join(' · '));
  if (HAS_DEVICE) {
    ok(smoke.msgs === 5, 'five hormone dossiers', String(smoke.msgs));
    ok(smoke.msgCols[3] === '2' && smoke.msgCols[4] === '4',
       'the two precursors are centred beneath the three', smoke.msgCols.join(','));
  }
  ok(smoke.noteOut, 'the international blood-test line is outside the priced toggle');
  ok(!/outside the UAE/i.test(smoke.addonName || ''),
     'the add-on button\'s accessible name no longer carries it', String(smoke.addonName).slice(0, 120));
  ok(smoke.usSpell.length === 0, 'no American -ize spellings in visible copy',
     smoke.usSpell.join(' · '));
  ok(smoke.faq === 6, 'six FAQ items', String(smoke.faq));
  ok(smoke.stories === 3, 'three stories', String(smoke.stories));
  ok(smoke.chips === 8, 'eight scene-fallback chips', String(smoke.chips));
  if (HAS_DEVICE) {
    ok(smoke.labels === 8, 'eight month labels = eight fallback chips', `${smoke.labels}/${smoke.chips}`);
    ok(smoke.armed && smoke.ticks === 28, 'month wheel armed with 28 ticks', `armed=${smoke.armed} ticks=${smoke.ticks}`);
    ok(smoke.keyUses === 2, 'identical key: two stamped skeletons', String(smoke.keyUses));
  } else {
    ok(smoke.labels === 0 && smoke.keyUses === 0 && smoke.msgs === 0,
       'chapters 04 and 05 are gone, and no orphan markup was left behind',
       `${smoke.labels}/${smoke.keyUses}/${smoke.msgs}`);
  }
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
  /* ⚠️ THE DUBAI FIGURE since 2026-08-27 (owner's correction: 1,850 Dubai / 2,150
     other emirates, two exclusive toggles). #pg-addon is the Dubai box. */
  ok(money2.row && money2.vat === 'AED 140.00' && money2.total === 'AED 2,940.00' && money2.pressed === 'true',
     'add-on: row shown, 140.00 VAT, 2,940.00 total', `${money2.vat} ${money2.total}`);

  /* the flip — symptom → answer in place */
  if (HAS_DEVICE) {
    const flip = await page.evaluate(() => {
      const b = document.querySelector('.month-label');
      b.click();
      const cs = getComputedStyle(b.querySelector('.ml-ans'));
      return { flipped: b.classList.contains('flipped'), ansShown: cs.display !== 'none' };
    });
    ok(flip.flipped && flip.ansShown, 'month label flips to its answer');
  }

  /* full-page shots */
  for (const [id, name] of [['programme','programme'],
                            ...(HAS_DEVICE ? [['month','month'],['messengers','messengers']] : []),
                            ['doctors','docs'],['book','final']]) {
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
  if (HAS_DEVICE) {
    const m = await page.evaluate(() => ({
      armed: !!document.querySelector('[data-month].month-armed'),
      labels: document.querySelectorAll('.month-label').length,
    }));
    ok(!m.armed && m.labels === 8, 'phone: wheel unarmed, eight chips flow', `armed=${m.armed}`);
  }
  await page.screenshot({ path: path.join(OUT, 'page-p-top.png') });
  for (const [id, name] of [['programme','programme'],
                            ...(HAS_DEVICE ? [['month','month'],['messengers','messengers']] : [])]) {
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
  if (HAS_DEVICE) ok(!rm.keyArmed, 'reduced motion: identical key ships locked');
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
