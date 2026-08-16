/* Section 04 QA — the eight became a choice. Does the page still work, and does
   the choice actually do anything?

     PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
     node tools/qa/services-choice.mjs [--shots]

   Exits non-zero on any failure. This is a companion to peptide-page.mjs, not a
   replacement — that one still owns the scene, the grade and the dialogs.

   THE THREE THINGS THIS EXISTS FOR:

   1 · THE HIT-AREA SWAP. Until 2026-08-16 `.px-open::after{inset:0}` made the whole
       tile the + button — tap anywhere, read more. The tile is now a CHOICE, and
       both cannot own the same pixels. Checks 4–6 assert the swap happened in BOTH
       directions: tapping the body selects and does NOT open the dialog, and the +
       still opens it. Restoring the stretch would leave the goal unselectable and
       every content assertion would still pass.

   2 · THE ARITHMETIC. VAT is added at 5% on his instruction. A price a customer can
       dispute after paying deserves an assertion, not a glance.

   3 · THE PANEL DOES NOT EXIST UNTIL IT IS OPENED. Its markup is cloned into the
       .pxd shell, so every check against it has to open it first — and the binding
       has to be delegated, which is the trap the mock-booking guard and the
       chooser's portraits both fell into. */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SHOTS = process.argv.includes('--shots');
const OUT = process.env.OUT || path.join(ROOT, '.qa-out');
if (SHOTS) fs.mkdirSync(OUT, { recursive: true });

function findChromium() {
  try { const p = chromium.executablePath(); if (fs.existsSync(p)) return p; } catch {}
  for (const base of ['/opt/pw-browsers', path.join(process.env.HOME || '', '.cache/ms-playwright')]) {
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base)) {
      for (const rel of ['chrome-linux/chrome', 'chrome-linux/headless_shell', 'chrome']) {
        const p = path.join(base, d, rel);
        if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
      }
    }
  }
}

let pass = 0, fail = 0;
const ok  = (n, m = '') => { pass++; console.log(`  \x1b[32m✓\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const bad = (n, m = '') => { fail++; console.log(`  \x1b[31m✗\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const is  = (n, got, want) => String(got) === String(want) ? ok(n, String(got)) : bad(n, `got ${got}, want ${want}`);
const has = (n, hay, needle) => String(hay).includes(needle) ? ok(n, needle) : bad(n, `"${needle}" not in "${String(hay).slice(0,120)}"`);

/* the page loads three scripts from jsDelivr, which the QA environment blocks.
   Serve the same versions from node_modules by interception, exactly as
   peptide-page.mjs does — nothing about that ships. */
const CDN = {
  'gsap@3.13.0/dist/gsap.min.js':      'gsap/dist/gsap.min.js',
  'gsap@3.13.0/dist/ScrollTrigger.min.js': 'gsap/dist/ScrollTrigger.min.js',
  'gsap@3.13.0/dist/SplitText.min.js': 'gsap/dist/SplitText.min.js',
  'lenis@1.3.4/dist/lenis.min.js':     'lenis/dist/lenis.min.js'
};

const run = async () => {
  const dir = path.join(ROOT, 'peptide-therapy');
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '') || 'index.html';
    const f = path.join(ROOT, rel.startsWith('images/') || rel.startsWith('fonts/') ? rel : path.join('peptide-therapy', rel));
    const alt = path.join(ROOT, rel);
    const file = fs.existsSync(f) ? f : alt;
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end('nope'); }
    const ext = path.extname(file);
    res.setHeader('content-type', { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
      '.webp':'image/webp', '.avif':'image/avif', '.png':'image/png', '.woff2':'font/woff2' }[ext] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise(r => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}/`;

  const browser = await chromium.launch({ executablePath: findChromium(), args: ['--force-color-profile=srgb'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.route('**/cdn.jsdelivr.net/**', route => {
    const hit = Object.keys(CDN).find(k => route.request().url().includes(k));
    const local = hit && path.join(ROOT, 'node_modules', CDN[hit]);
    if (local && fs.existsSync(local))
      return route.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(local, 'utf8') });
    route.abort();
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto(base, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  console.log('\n\x1b[1mA · the eight, rebuilt\x1b[0m');
  const grid = await page.evaluate(() => ({
    tiles: document.querySelectorAll('.px').length,
    picks: document.querySelectorAll('.px-pick').length,
    marks: document.querySelectorAll('.px-mark').length,
    opens: document.querySelectorAll('.px-open').length,
    teasers: document.querySelectorAll('.px > p').length,
    nums: document.querySelectorAll('.px-num').length,
    kickers: [...document.querySelectorAll('.px-detail')]
      .filter(t => t.content.querySelector('.pxd-kicker')).length,
    names: [...document.querySelectorAll('.px h3')].map(h => h.textContent.trim()).join('|'),
    /* eight <svg>s all drawing the same figure would pass every count ever written */
    uniqueMarks: new Set([...document.querySelectorAll('.px-mark')]
      .map(s => [...s.querySelectorAll('path,circle')]
        .map(e => e.getAttribute('d') || e.getAttribute('cx') + ',' + e.getAttribute('cy')).join(';'))).size
  }));
  is('1  eight tiles', grid.tiles, 8);
  is('1a eight select surfaces', grid.picks, 8);
  is('1b eight marks', grid.marks, 8);
  is('1c eight DIFFERENT marks', grid.uniqueMarks, 8);
  /* ⚠️ THE NUMERALS ARE GONE ON PURPOSE — on a multi-select they implied a sequence
     that does not exist. They survive in the popup kicker, which is a reference. */
  is('1e no numerals on the tiles', grid.nums, 0);
  /* ⚠️ THE POPUP KICKER WENT TOO — his call. "01 · Peptide Therapy" told a reader
     of this page nothing they did not already know, and the numerals had just left
     the tiles for implying a sequence that does not exist. */
  is('1f and none left in the popups either', grid.kickers, 0);

  /* the + moved to the top right corner — it is a secondary door on a tile that is
     now primarily a choice, and corners are where secondary controls belong */
  const plusPos = await page.evaluate(() => {
    const t = document.querySelector('.px').getBoundingClientRect();
    const b = document.querySelector('.px-open').getBoundingClientRect();
    return { fromTop: Math.round(b.top - t.top), fromRight: Math.round(t.right - b.right) };
  });
  plusPos.fromTop < 30 && plusPos.fromRight < 30
    ? ok('1g the + sits in the top right corner', `${plusPos.fromTop}px / ${plusPos.fromRight}px`)
    : bad('1g the + sits in the top right corner', JSON.stringify(plusPos));
  is('1d the + survived on all eight', grid.opens, 8);
  is('2  the teaser line is gone from the tiles', grid.teasers, 0);
  has('2  the heading asks rather than announces',
      await page.evaluate(() => document.querySelector('#services h2').textContent), 'Where would you like to begin');
  has('2c the lede says you may pick more than one',
      await page.evaluate(() => document.querySelector('.sec-lede').textContent), 'as many as apply');
  has('2a the client\'s spellings survive', grid.names, 'Anti Ageing');
  has('2b and the ampersand one', grid.names, 'Skin & Hair Loss');

  /* the teaser was removed because the popup already says it, longer — prove the
     popup is still there rather than trusting that it was */
  const tplWords = await page.evaluate(() =>
    [...document.querySelectorAll('.px-detail')].map(t => t.content.textContent.trim().length));
  is('3  eight detail templates survive', tplWords.length, 8);
  tplWords.every(n => n > 300) ? ok('3a and none was emptied', `min ${Math.min(...tplWords)} chars`)
                               : bad('3a and none was emptied', tplWords.join('/'));

  console.log('\n\x1b[1mB · the hit-area swap, in both directions\x1b[0m');
  await page.evaluate(() => document.querySelector('#services').scrollIntoView());
  await page.waitForTimeout(500);
  await page.click('.px:nth-child(3) .px-pick');
  await page.waitForTimeout(300);
  is('4  tapping the tile selects it',
     await page.evaluate(() => document.querySelector('.px:nth-child(3)').dataset.picked), 'true');
  is('4a and does NOT open the dialog',
     await page.evaluate(() => document.querySelector('#pxd').hidden), true);
  await page.click('.px:nth-child(3) .px-pick');
  await page.waitForTimeout(250);
  is('4b tapping again deselects',
     await page.evaluate(() => document.querySelector('.px:nth-child(3)').dataset.picked), 'false');

  const plus = await page.evaluate(() => {
    const b = document.querySelector('.px-open').getBoundingClientRect();
    return { w: Math.round(b.width), h: Math.round(b.height) };
  });
  plus.w >= 44 && plus.h >= 44 ? ok('5  the + has a thumb-sized target', `${plus.w}×${plus.h}`)
                               : bad('5  the + has a thumb-sized target', `${plus.w}×${plus.h}`);
  await page.click('.px:nth-child(1) .px-open');
  await page.waitForTimeout(500);
  is('6  the + still opens the detail',
     await page.evaluate(() => !document.querySelector('#pxd').hidden), true);
  has('6a with its own copy',
      await page.evaluate(() => document.querySelector('.pxd-body').textContent), 'Auto Immune Disease');
  is('6b and opening it selected nothing',
     await page.evaluate(() => document.querySelectorAll('.px[data-picked="true"]').length), 0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  console.log('\n\x1b[1mC · the tray\x1b[0m');
  is('7  down before anything is chosen',
     await page.evaluate(() => document.querySelector('#px-tray').classList.contains('on')), false);
  await page.click('.px:nth-child(3) .px-pick');
  await page.click('.px:nth-child(2) .px-pick');
  await page.waitForTimeout(600);
  const tray = await page.evaluate(() => ({
    on: document.querySelector('#px-tray').classList.contains('on'),
    n: document.querySelector('#px-tray-n').textContent.trim(),
    l: document.querySelector('#px-tray-l').textContent.trim(),
    onScreen: document.querySelector('#px-tray').getBoundingClientRect().bottom <= innerHeight + 2
  }));
  is('7a it arrives on the first pick', tray.on, true);
  is('7b and counts', tray.n, '2 chosen');
  /* grid order, never click order — the same two picks must read one way */
  is('7c and reads in grid order, not tap order', tray.l, 'Brain Health · Gut Health');
  is('7d and is on screen', tray.onScreen, true);

  console.log('\n\x1b[1mD · the panel and the arithmetic\x1b[0m');
  await page.click('#px-tray-go');
  await page.waitForTimeout(600);
  is('8  the tray opens the panel',
     await page.evaluate(() => !document.querySelector('#pxd').hidden), true);
  const p1 = await page.evaluate(() => ({
    recap: document.querySelector('#pg-recap').textContent.trim(),
    sub: document.querySelector('#pg-sub').textContent.trim(),
    vat: document.querySelector('#pg-vat').textContent.trim(),
    total: document.querySelector('#pg-total').textContent.trim(),
    steps: document.querySelectorAll('.pg-steps li').length,
    /* the step TITLES in document order — the <small> is stripped so a copy edit inside a
       step's description does not move an order assertion */
    stepOrder: [...document.querySelectorAll('.pg-steps li')].map(li => {
      const s = li.querySelector('span:nth-child(2)').cloneNode(true);
      const sm = s.querySelector('small'); if (sm) sm.remove();
      return s.textContent.trim();
    }),
    incl: document.querySelectorAll('.pg-blk:not(.pg-blk--soft) .pg-list li').length
  }));
  has('8a it names both goals', p1.recap, 'Brain Health');
  has('8b and the second', p1.recap, 'Gut Health');
  /* ⚠️ VAT IS STATED, NOT COMPUTED — his call. One row, not three: a summary that
     shows tax working is a receipt, and this panel is not a checkout. */
  /* ⚠️ HIS INSTRUCTION REVERSED THE SAME DAY and the second one stands: "the +5%
     should be there with the total price". The tax is IN the total, not promised at
     a checkout the customer has not reached — a number that grows after you decide
     is the most disputed thing in any purchase. */
  is('9  programme line', p1.sub, 'AED 1,150.00');
  is('9a VAT at 5%', p1.vat, 'AED 57.50');
  is('9b the total carries it', p1.total, 'AED 1,207.50');
  /* ⚠️ SIX SINCE ROUND 14, AND THE COUNT IS NOT THE POINT — THE ORDER IS. His correction:
     the doctor is CHOSEN at 03 and reads the file afterwards, where the old copy had a
     stranger reading the labs and the reader picking someone at 04. The two assertions
     below pin the order itself, because a step list is exactly the kind of thing a later
     edit reshuffles without anyone noticing it now describes a different clinic. */
  is('10 six steps', p1.steps, 6);
  is('10b the doctor is chosen before the file is read', p1.stepOrder.indexOf('Choose your doctor'), 2);
  is('10c and the peptides arrive before the aftercare',
     p1.stepOrder.indexOf('Your peptides arrive') < p1.stepOrder.indexOf('Support while you begin'), true);
  is('10a six included lines', p1.incl, 6);
  const copy = await page.evaluate(() => document.querySelector('.pxd-body').textContent);
  has('11 the collection is a team at your home, not a kit', copy, 'comes to your home');
  has('11g at his real figure, not my placeholder', copy, 'AED 1,950');
  is('11h and nothing on the page is marked tbc', /price tbc/i.test(copy), false);
  has('11a the assessment is online', copy, 'complete online');
  has('11b the read is same or next day', copy, 'same or next day');
  /* ⚠️ 11c CHANGED WITH THE STEP ORDER (round 14). It asserted "Online. You choose your
     doctor when you book the time" on step 04 — copy his correction deleted, because it
     had the reader picking a doctor AFTER a stranger had read their labs. The doctor is
     chosen at 03 now and step 04 is what the consultation actually delivers, so this
     asserts the deliverable rather than the channel. */
  has('11c the consultation delivers the prescription', copy, 'writes your prescription');
  has('11e and the peptides arrive as a step of their own', copy, 'Your peptides arrive');
  /* ⚠️ 11d IS INVERTED, NOT DELETED. It asserted the panel's closing line — "Everything
     happens online — you never need to visit us" — which he removed in round 14 ("it's not
     good in that page"). The line is now ASSERTED ABSENT: it was a hedge under a primary
     action, and it had also stopped being true the moment step 05 started delivering
     peptides to an address. Deleting the check would let it drift back in unnoticed. */
  is('11d the hedge under the button is gone', /never need to visit/i.test(copy), false);

  /* the add-on's explanation is a <small> inside a flex child — inline by default,
     which ran it straight after the PRICE TBC tag on one line */
  const stacked = await page.evaluate(() => {
    const t = document.querySelector('.pg-t');
    const head = t.childNodes[0];
    const r = document.createRange(); r.selectNode(head);
    const sm = t.querySelector('small').getBoundingClientRect();
    return sm.top >= r.getBoundingClientRect().bottom - 1;
  });
  is('11f the add-on explanation is on its own line', stacked, true);

  await page.click('#pg-addon');
  await page.waitForTimeout(300);
  const p2 = await page.evaluate(() => ({
    total: document.querySelector('#pg-total').textContent.trim()
  }));
  is('12 the add-on moves the total', p2.total, 'AED 3,255.00');
  await page.click('#pg-addon');
  await page.waitForTimeout(300);
  is('12c and back again',
     await page.evaluate(() => document.querySelector('#pg-total').textContent.trim()), 'AED 1,207.50');

  /* ══ THE SHOP WINDOW AND THE CART MUST AGREE — NEW ROUND 14 ═══════════════════════
     ⚠️ THE PROGRAMME BAND RESTATES THE PANEL'S FIGURES AND ITS INCLUDED LIST ON THE OPEN
     PAGE, and that duplication is deliberate — the page could not name a price at all once
     section 05 was deleted, and a customer expects to see the contents again at the moment
     of paying. What is NOT acceptable is the two drifting apart: a band quoting 1,150 over
     a panel quoting something else is a dispute after payment, which is the exact failure
     the VAT rows exist to prevent. So every figure that appears twice is COMPARED here.
     ⚠️ THE BAND IS READ FROM OUTSIDE THE OVERLAY. It is ordinary page markup, so it is
     still in the document while the panel is open — no need to close anything. */
  const twice = await page.evaluate(() => {
    const t = s => { const e = document.querySelector(s); return e ? e.textContent.trim() : null; };
    const rows = [...document.querySelectorAll('.pgb-rows div')].map(d => d.lastElementChild.textContent.trim());
    return {
      bandBase:  rows[0], bandVat: rows[1], bandTotal: rows[2],
      panelBase: t('#pg-sub'), panelVat: t('#pg-vat'), panelTotal: t('#pg-total'),
      bandAddon:  /AED 1,950/.test(t('.pgb-ledger') || ''),
      bandIncl:   document.querySelectorAll('.pgb-ledger .pgb-list:first-of-type li').length,
      panelIncl:  document.querySelectorAll('.pg-blk:not(.pg-blk--soft) .pg-list li').length,
    };
  });
  is('12d the band and the panel quote one programme price', twice.bandBase, twice.panelBase);
  is('12e one VAT line',   twice.bandVat,   twice.panelVat);
  is('12f one total',      twice.bandTotal, twice.panelTotal);
  is('12g the add-on is his real figure in both', twice.bandAddon, true);
  is('12h and the included list is the same length', twice.bandIncl, twice.panelIncl);

  /* ⚠️ NOT A CHECKOUT: close, the one add-on, Start. Every extra control in there
     is another chance to hesitate at the last moment before payment. */
  const controls = await page.evaluate(() =>
    document.querySelectorAll('.pxd-panel button, .pxd-panel a').length);
  is('13 the panel carries three controls', controls, 3);

  /* ⚠️ HIS "the cards are not swipeable". A fixed overlay's inner scroller chains
     its drag to the locked body unless told not to; assert the panel is a real
     scroller AND that it carries the three properties that make a thumb work. */
  const scroller = await page.evaluate(() => {
    const p = document.querySelector('.pxd-panel'), cs = getComputedStyle(p);
    p.scrollTop = 400;
    return { overflows: p.scrollHeight > p.clientHeight + 8, moved: p.scrollTop > 0,
             chain: cs.overscrollBehaviorY, touch: cs.touchAction,
             lenis: p.hasAttribute('data-lenis-prevent') };
  });
  is('13a the panel is a real scroller', scroller.overflows, true);
  is('13b and it moves', scroller.moved, true);
  is('13c the drag stays inside it', scroller.chain, 'contain');
  is('13d the browser owns the axis', scroller.touch, 'pan-y');
  is('13e and Lenis is kept off it', scroller.lenis, true);
  if (SHOTS) await page.screenshot({ path: path.join(OUT, 'sv-panel.png') });

  await page.click('[data-pg-start]');
  await page.waitForTimeout(600);
  is('14 Start closes the overlay before it scrolls',
     await page.evaluate(() => document.querySelector('#pxd').classList.contains('on')), false);

  console.log('\n\x1b[1mE · the page still holds\x1b[0m');
  /* ⚠️ RELOAD AT EACH WIDTH, DO NOT JUST RESIZE. The chain scene pins through
     ScrollTrigger, which writes pixel dimensions at init and does not recompute
     them on a bare resize — so setViewportSize alone measured the PREVIOUS width's
     stale pin and reported 1440 at a 1280 viewport. It is also the honest test:
     a visitor arrives at their width, they do not drag the window to it. */
  for (const w of [1600, 1440, 1280, 1104, 900, 640, 430, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(base, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    sw === w ? ok(`15 no sideways scroll @ ${w}`) : bad(`15 no sideways scroll @ ${w}`, `document is ${sw}`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(200);

  /* the chosen tile inverts to ivory-on-ink and has to clear the floor */
  await page.evaluate(() => document.querySelector('#services').scrollIntoView());
  await page.waitForTimeout(400);
  const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = ([r,g,b]) => 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
  const parse = s => { const n = (s.match(/[\d.]+/g)||[]).map(Number); return { c:n.slice(0,3), a:n.length>3?n[3]:1 }; };
  const contrast = (fg,bg) => { const f = parse(fg), b = parse(bg);
    const o = f.c.map((v,i)=> v*f.a + b.c[i]*(1-f.a));
    const [x,y] = [lum(o), lum(b.c)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };
  const pairs = await page.evaluate(() => {
    const g = el => getComputedStyle(el);
    const t = document.querySelector('.px[data-picked="true"]') || document.querySelector('.px');
    const tray = document.querySelector('#px-tray');
    return { 'chosen tile name': [g(t.querySelector('h3')).color, g(t).backgroundColor],
             'chosen tile mark': [g(t.querySelector('.px-mark')).color, g(t).backgroundColor],
             'tray answer': [g(document.querySelector('#px-tray-l')).color, g(tray).backgroundColor] };
  });
  for (const [k,[fg,bg]] of Object.entries(pairs)) {
    const r = contrast(fg, bg);
    r >= 4.5 ? ok(`16 ${k} clears 4.5:1`, r.toFixed(2)) : bad(`16 ${k} clears 4.5:1`, r.toFixed(2));
  }
  if (SHOTS) {
    await page.screenshot({ path: path.join(OUT, 'sv-grid.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('#services').scrollIntoView());
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, 'sv-phone.png') });
  }
  is('17 zero console errors across the whole walk', errors.length, 0);
  if (errors.length) errors.slice(0, 5).forEach(e => console.log('       ' + e));

  await browser.close();
  server.close();
  console.log(`\n\x1b[1m${pass} passed, ${fail} failed\x1b[0m${SHOTS ? `  ·  shots in ${OUT}` : ''}\n`);
  process.exit(fail ? 1 : 0);
};

run().catch(e => { console.error(e); process.exit(1); });
