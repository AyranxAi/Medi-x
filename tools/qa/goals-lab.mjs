/* Goals-lab QA — six presentations of one question, proved to be six.

     PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save playwright@1.49.1
     node tools/qa/goals-lab.mjs            # checks only
     node tools/qa/goals-lab.mjs --shots    # + a screenshot of every view

   Exits non-zero on any failure.

   What this harness is actually for, beyond "does it render":

   1 · THE SIX MUST BE SIX. Views 1–5 are the SAME eight buttons re-laid by a
       data-view, which is the only way the comparison is honest — but it is also
       how a "new view" can silently be the old one with a different name. Every
       view is measured (columns, box widths, whether type is set large) and
       asserted to DIFFER from the others, not merely to exist.

   2 · CAN YOU STILL SEE WHAT YOU PICKED. The one constraint that rules this
       design space is multi-select. For each view the harness selects three,
       scrolls nothing, and asserts how many of the three are inside the
       viewport — which is the measurement that condemns the shelf and is the
       whole argument for the answer line beneath it.

   3 · CONTENT SURVIVES WITHOUT SCRIPT. The programme lab shipped a build whose
       content came from innerHTML and rendered four headings wherever script did
       not run. Section 0 loads this page with javaScriptEnabled:false.

   Chromium is searched for, never pinned. */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const PAGE = path.join(ROOT, 'peptide-therapy', 'goals-lab.html');
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
      const direct = path.join(base, d);
      if (fs.statSync(direct).isFile()) return direct;
    }
  }
}

let pass = 0, fail = 0;
const ok  = (n, m = '') => { pass++; console.log(`  \x1b[32m✓\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const bad = (n, m = '') => { fail++; console.log(`  \x1b[31m✗\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const is  = (n, got, want) => String(got) === String(want) ? ok(n, String(got)) : bad(n, `got ${got}, want ${want}`);
const has = (n, hay, needle) => String(hay).includes(needle) ? ok(n, needle) : bad(n, `"${needle}" not in "${String(hay).slice(0,110)}"`);

/* contrast, with alpha composited over its real ground and never sampled mid-fade */
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r,g,b]) => 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
const ratio = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };
const parse = s => { const n = (s.match(/[\d.]+/g)||[]).map(Number); return { c:n.slice(0,3), a:n.length>3?n[3]:1 }; };
const over = (fg,bg) => { const f = parse(fg), b = parse(bg); return f.c.map((v,i)=> v*f.a + b.c[i]*(1-f.a)); };
const contrast = (fg,bg) => ratio(over(fg,bg), parse(bg).c);

const VIEWS = ['grid','index','type','shelf','pills','derive'];

const run = async () => {
  const browser = await chromium.launch({ executablePath: findChromium(), args: ['--force-color-profile=srgb'] });

  /* ═════════════ 0 · WITHOUT SCRIPT ═════════════ */
  const nCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const nP = await nCtx.newPage();
  await nP.goto(pathToFileURL(PAGE).href, { waitUntil: 'load' });
  await nP.waitForTimeout(200);
  console.log('\n\x1b[1m0 · with JavaScript disabled\x1b[0m');
  const dead = await nP.evaluate(() => {
    const vis = s => [...document.querySelectorAll(s)].filter(e => e.getBoundingClientRect().height > 0).length;
    return { js: document.documentElement.classList.contains('js'), goals: vis('.g'),
             names: [...document.querySelectorAll('.g-t')].map(e => e.textContent).join('|'),
             descriptors: document.querySelectorAll('.g-d').length,
             sx: document.querySelectorAll('.sx').length,
             wide: document.documentElement.scrollWidth };
  });
  is('0  the js class never lands', dead.js, false);
  is('0a all eight are in the HTML', dead.goals, 8);
  is('0b all eight descriptors are in the HTML', dead.descriptors, 8);
  is('0c the symptom set is in the HTML', dead.sx, 12);
  has('0d the client\'s spellings survive', dead.names, 'Anti Ageing');
  has('0e and the ampersand one', dead.names, 'Skin & Hair Loss');
  is('0f no sideways scroll', dead.wide, 1440);
  await nCtx.close();

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [], external = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) external.push(r.url()); });
  await page.goto(pathToFileURL(PAGE).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);

  console.log('\n\x1b[1mA · integrity\x1b[0m');
  is('1  console is clean', errors.length, 0);
  if (errors.length) errors.slice(0,5).forEach(e => console.log('       ' + e));
  is('2  no request leaves the file', external.length, 0);
  const fonts = await page.evaluate(() => [...document.fonts].map(f => `${f.family}|${f.weight}|${f.style}|${f.status}`));
  const want = ['Playfair|300 900|normal','Playfair|300 900|italic','MediGyn NOW|300|normal',
                'MediGyn NOW|500|normal','MediGyn Megante|400|normal'];
  const miss = want.filter(w => !fonts.includes(w + '|loaded'));
  miss.length === 0 ? ok('3  all five faces loaded', `${fonts.length} registered`)
                    : bad('3  all five faces loaded', 'missing: ' + miss.join(', '));

  /* ═════════════ B · THE SIX ARE ACTUALLY SIX ═════════════
     Fingerprint each view by things that cannot coincide by accident, then
     assert every fingerprint is distinct. A view that silently rendered as
     another would pass "does it exist" and fail here. */
  console.log('\n\x1b[1mB · six distinct presentations\x1b[0m');
  const prints = {};
  for (const v of VIEWS) {
    await page.click(`[data-view="${v}"]`);
    await page.waitForTimeout(180);
    prints[v] = await page.evaluate(() => {
      /* ⚠️ TWO LEVELS, BECAUSE THE COLUMNS ARE NOT ALWAYS ON THE SAME ONE. Grid
         and shelf lay their columns out on the CONTAINER; index lays them out on
         each ROW and leaves the container a plain block. Reading only the
         container reported index as "row" and the check failed on a page that
         was correct. Fingerprint both, and read the type size off the NAME, not
         off the button, whose font-size is merely inherited. */
      const g = document.querySelector('#goals');
      const first = document.querySelector('.stage[data-mode="derive"] .sx, .g');
      const name = first.querySelector('.g-t') || first;
      const cols = el => { const c = getComputedStyle(el).gridTemplateColumns;
        return c === 'none' ? 0 : c.split(' ').length; };
      const r = first.getBoundingClientRect();
      return {
        mode: document.querySelector('#stage').dataset.mode,
        outerCols: cols(g),
        innerCols: cols(first),
        flow: getComputedStyle(g).display,
        w: Math.round(r.width), h: Math.round(r.height),
        size: Math.round(parseFloat(getComputedStyle(name).fontSize)),
        radius: Math.round(parseFloat(getComputedStyle(first).borderTopLeftRadius)),
        descriptorShown: !!document.querySelector('.g-d') &&
          getComputedStyle(document.querySelector('.g-d')).display !== 'none',
        scrollable: g.scrollWidth > g.clientWidth + 4
      };
    });
    if (SHOTS) await page.screenshot({ path: path.join(OUT, `gl-${VIEWS.indexOf(v)+1}-${v}.png`) });
  }
  const sigs = Object.entries(prints).map(([k,p]) => [k, JSON.stringify(p)]);
  const dupes = sigs.filter(([k,s], i) => sigs.findIndex(([,s2]) => s2 === s) !== i);
  dupes.length === 0 ? ok('4  all six render differently')
                     : bad('4  all six render differently', 'identical: ' + dupes.map(d=>d[0]).join(', '));

  is('5  grid is four columns on the container', prints.grid.outerCols, 4);
  is('5a and the index is not', prints.index.outerCols, 0);
  is('6  index shows the descriptor', prints.index.descriptorShown, true);
  is('6a index is three columns per row', prints.index.innerCols, 3);
  is('6b and it is the only view that shows a descriptor',
     ['grid','type','shelf','pills'].some(v => prints[v].descriptorShown), false);
  ok('7  type is set large', `${prints.type.size}px vs grid ${prints.grid.size}px`);
  prints.type.size >= prints.grid.size * 1.8
    ? ok('7a type is decisively larger than the grid', `${prints.type.size} ≥ ${Math.round(prints.grid.size*1.8)}`)
    : bad('7a type is decisively larger than the grid', `${prints.type.size} vs ${prints.grid.size}`);
  is('8  the shelf actually scrolls sideways', prints.shelf.scrollable, true);
  is('8a and nothing else does', [prints.grid,prints.index,prints.type,prints.pills].some(p=>p.scrollable), false);
  is('9  pills are pill-shaped', prints.pills.radius >= 20, true);
  is('9a nothing else is', [prints.grid.radius,prints.index.radius,prints.type.radius].every(r=>r<20), true);
  is('10 symptom-first swaps the mode', prints.derive.mode, 'derive');

  /* ═════════════ C · CAN YOU STILL SEE YOUR ANSWER ═════════════
     The measurement that decides this whole question. Pick three, then count how
     many of the three are actually inside the viewport without scrolling. */
  console.log('\n\x1b[1mC · with three chosen, how many can you see\x1b[0m');
  for (const v of ['grid','index','type','shelf','pills']) {
    await page.click('#reset');
    await page.click(`[data-view="${v}"]`);
    await page.waitForTimeout(180);
    await page.click('[data-goal="Auto Immune Disease"]');
    await page.click('[data-goal="Gut Health"]');
    await page.click('[data-goal="Sexual Health"]');
    await page.waitForTimeout(150);
    const seen = await page.evaluate(() => {
      const inView = e => { const r = e.getBoundingClientRect();
        return r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight && r.width > 4; };
      return { lit: document.querySelectorAll('.g[aria-pressed="true"]').length,
               visible: [...document.querySelectorAll('.g[aria-pressed="true"]')].filter(inView).length,
               answer: document.querySelector('#chosen').textContent.trim() };
    });
    is(`11 ${v}: three are selected`, seen.lit, 3);
    const label = `11a ${v}: how many of the three are on screen`;
    if (v === 'shelf') seen.visible < 3
      ? ok(label + ' (fewer, as predicted)', `${seen.visible} of 3`)
      : bad(label, `${seen.visible} of 3 — the shelf was expected to hide some`);
    else is(label, seen.visible, 3);
    has(`11b ${v}: the answer line names all three`, seen.answer, 'Sexual Health');
  }

  /* the answer line must read in MARKUP order, not click order — otherwise the
     same three picks render three different ways depending on tap sequence */
  await page.click('#reset');
  await page.click('[data-view="grid"]');
  await page.click('[data-goal="Sexual Health"]');
  await page.click('[data-goal="Auto Immune Disease"]');
  await page.click('[data-goal="Gut Health"]');
  const order = await page.evaluate(() => document.querySelector('#chosen').textContent.trim());
  order.indexOf('Auto Immune') < order.indexOf('Gut Health') && order.indexOf('Gut Health') < order.indexOf('Sexual')
    ? ok('12 the answer reads in the order shown, not the order tapped')
    : bad('12 the answer reads in the order shown', order);

  /* ═════════════ D · SYMPTOM-FIRST DERIVES ═════════════ */
  console.log('\n\x1b[1mD · symptom-first\x1b[0m');
  await page.click('#reset');
  await page.click('[data-view="derive"]');
  await page.waitForTimeout(180);
  is('13 the question itself changes',
     await page.evaluate(() => document.querySelector('#head').textContent.trim()), 'What are you noticing?');
  await page.click('[data-sx="Bloating"]');
  await page.click('[data-sx="Brain fog"]');
  await page.waitForTimeout(150);
  const derived = await page.evaluate(() => document.querySelector('#derived').textContent);
  has('14 two symptoms name a goal', derived, 'Gut Health');
  has('14a and the second', derived, 'Brain Health');
  is('15 it names at most three',
     await page.evaluate(() => document.querySelectorAll('#derived em').length <= 3), true);
  await page.click('#reset');
  await page.waitForTimeout(150);
  has('16 it degrades with nothing chosen',
      await page.evaluate(() => document.querySelector('#derived').textContent), "we'll name it");

  /* ═════════════ E · LAYOUT AND CONTRAST ═════════════ */
  console.log('\n\x1b[1mE · layout and contrast\x1b[0m');
  for (const v of VIEWS) {
    await page.click(`[data-view="${v}"]`);
    for (const w of [1440, 1024, 768, 430, 390, 360]) {
      await page.setViewportSize({ width: w, height: 860 });
      await page.waitForTimeout(90);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw !== w) bad(`17 ${v} @ ${w}`, `document is ${sw}`);
    }
    ok(`17 ${v} never scrolls the page sideways`, '1440→360');
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click('[data-view="grid"]');
  await page.click('[data-goal="Gut Health"]');
  await page.waitForTimeout(200);
  const pairs = await page.evaluate(() => {
    const g = el => getComputedStyle(el);
    const body = g(document.body).backgroundColor;
    const lit = document.querySelector('.g[aria-pressed="true"]');
    return { 'lit tile': [g(lit).color, g(lit).backgroundColor],
             'lit numeral': [g(lit.querySelector('.g-n')).color, g(lit).backgroundColor],
             'unlit numeral': [g(document.querySelector('.g:not([aria-pressed="true"]) .g-n')).color, body],
             'the answer line': [g(document.querySelector('#chosen')).color, body],
             'the lede': [g(document.querySelector('#lede')).color, body] };
  });
  for (const [k,[fg,bg]] of Object.entries(pairs)) {
    const r = contrast(fg, bg);
    r >= 4.5 ? ok(`18 ${k} clears 4.5:1`, r.toFixed(2)) : bad(`18 ${k} clears 4.5:1`, r.toFixed(2));
  }

  /* the one-red rule: red is the CTA material and must never be a selected state */
  const reds = await page.evaluate(() => {
    const lit = getComputedStyle(document.querySelector('.g[aria-pressed="true"]')).backgroundColor;
    return { lit, cta: getComputedStyle(document.querySelector('#cont')).backgroundColor };
  });
  !/142, ?45, ?58/.test(reds.lit) ? ok('19 selection is ink, never the one red', reds.lit)
                                  : bad('19 selection is ink, never the one red', reds.lit);
  /2, ?45, ?58|142, ?45, ?58/.test(reds.cta) ? ok('19a the CTA still is the one red')
                                             : bad('19a the CTA still is the one red', reds.cta);

  if (SHOTS) {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const v of ['index','pills','shelf']) {
      await page.click(`[data-view="${v}"]`); await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(OUT, `gl-phone-${v}.png`) });
    }
  }
  /* the answer line must leave no mark when there is no answer */
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click('#reset');
  await page.click('[data-view="grid"]');
  await page.waitForTimeout(150);
  const blank = await page.evaluate(() => {
    const c = document.querySelector('#chosen');
    return { h: Math.round(c.getBoundingClientRect().height),
             border: getComputedStyle(c).borderLeftColor };
  });
  is('19b the empty answer line has no height', blank.h, 0);
  /^(transparent|rgba\(0, ?0, ?0, ?0\))$/.test(blank.border)
    ? ok('19c and leaves no stray rule', blank.border)
    : bad('19c and leaves no stray rule', blank.border);

  is('20 still no console errors after the whole walk', errors.length, 0);

  await browser.close();
  console.log(`\n\x1b[1m${pass} passed, ${fail} failed\x1b[0m${SHOTS ? `  ·  shots in ${OUT}` : ''}\n`);
  process.exit(fail ? 1 : 0);
};

run().catch(e => { console.error(e); process.exit(1); });
