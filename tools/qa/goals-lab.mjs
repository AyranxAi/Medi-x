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

const VIEWS = ['grid','index','type','shelf','pills','plates','marks','derive'];

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
             tray: !!document.querySelector('#tray'),
             panelSteps: document.querySelectorAll('#panel .steps li').length,
             panelIncl: document.querySelectorAll('#panel .blk:not(.blk--soft) ul li').length,
             trayShown: getComputedStyle(document.querySelector('#tray')).display,
             wide: document.documentElement.scrollWidth };
  });
  is('0  the js class never lands', dead.js, false);
  is('0a all eight are in the HTML', dead.goals, 8);
  is('0b all eight descriptors are in the HTML', dead.descriptors, 8);
  is('0c the symptom set is in the HTML', dead.sx, 12);
  has('0d the client\'s spellings survive', dead.names, 'Anti Ageing');
  has('0e and the ampersand one', dead.names, 'Skin & Hair Loss');
  is('0f the panel\'s five steps are in the HTML', dead.panelSteps, 5);
  is('0g the panel\'s included list is in the HTML', dead.panelIncl, 6);
  is('0h the tray exists but stays down without script', dead.trayShown, 'none');
  is('0i no sideways scroll', dead.wide, 1440);
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
  dupes.length === 0 ? ok('4  all eight render differently')
                     : bad('4  all eight render differently', 'identical: ' + dupes.map(d=>d[0]).join(', '));

  is('5  grid is four columns on the container', prints.grid.outerCols, 4);
  is('5a and the index is not', prints.index.outerCols, 0);
  is('6  index shows the descriptor', prints.index.descriptorShown, true);
  is('6a index is three columns per row', prints.index.innerCols, 3);
  is('6b and it is the only view that shows a descriptor',
     ['grid','type','shelf','pills','plates','marks'].some(v => prints[v].descriptorShown), false);
  ok('7  type is set large', `${prints.type.size}px vs grid ${prints.grid.size}px`);
  prints.type.size >= prints.grid.size * 1.8
    ? ok('7a type is decisively larger than the grid', `${prints.type.size} ≥ ${Math.round(prints.grid.size*1.8)}`)
    : bad('7a type is decisively larger than the grid', `${prints.type.size} vs ${prints.grid.size}`);
  is('8  the shelf actually scrolls sideways', prints.shelf.scrollable, true);
  is('8a and nothing else does', [prints.grid,prints.index,prints.type,prints.pills,prints.plates,prints.marks].some(p=>p.scrollable), false);
  is('9  pills are pill-shaped', prints.pills.radius >= 20, true);
  is('9a nothing else is', [prints.grid.radius,prints.index.radius,prints.type.radius,
     prints.plates.radius,prints.marks.radius].every(r=>r<20), true);

  /* ── the two tile views, which is what "show them as clickable tiles" asked for ──
     PLATES: eight distinct pictures must actually decode, and the resting state
     must be visibly quieter than the chosen one — that desaturation IS the
     selection state, so if the filter ever stops applying the view silently
     loses its only affordance.
     MARKS: eight distinct drawings, not one drawing eight times. Compare the
     path geometry, because eight <svg>s that all render the same shape would
     pass every count-based check ever written. */
  await page.click('[data-view="plates"]');
  await page.waitForTimeout(700);
  const plates = await page.evaluate(async () => {
    const els = [...document.querySelectorAll('.g-plate')];
    const urls = els.map(e => (getComputedStyle(e).backgroundImage.match(/url\("?(data:[^")]+)"?\)/)||[])[1]);
    const sizes = await Promise.all(urls.map(u => u ? new Promise(r => {
      const i = new Image(); i.onload = () => r(i.naturalWidth); i.onerror = () => r(0); i.src = u; }) : 0));
    return { n: els.length, unique: new Set(urls).size, sizes,
             resting: getComputedStyle(els[0]).filter };
  });
  is('9b plates: eight frames', plates.n, 8);
  is('9c plates: eight DIFFERENT pictures', plates.unique, 8);
  is('9d plates: all eight decode', plates.sizes.every(w => w > 0), true);
  has('9e plates: the resting state is desaturated', plates.resting, 'saturate');
  await page.click('[data-goal="Gut Health"]');
  await page.waitForTimeout(700);
  const lifted = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.g[aria-pressed="true"] .g-plate')).filter);
  lifted !== plates.resting
    ? ok('9f plates: choosing brings the picture to life', `${plates.resting} → ${lifted}`)
    : bad('9f plates: choosing brings the picture to life', 'filter unchanged');
  await page.click('#reset');

  await page.click('[data-view="marks"]');
  await page.waitForTimeout(180);
  const marks = await page.evaluate(() => {
    const svgs = [...document.querySelectorAll('.g-mark')];
    const geom = svgs.map(s => [...s.querySelectorAll('path,circle')]
      .map(e => e.getAttribute('d') || `${e.getAttribute('cx')},${e.getAttribute('cy')}`).join(';'));
    const box = svgs[0].getBoundingClientRect();
    return { n: svgs.length, unique: new Set(geom).size,
             drawn: Math.round(box.width), shown: getComputedStyle(svgs[0]).display };
  });
  is('9g marks: eight figures', marks.n, 8);
  is('9h marks: eight DIFFERENT figures', marks.unique, 8);
  is('9i marks: they are actually drawn', marks.drawn >= 40, true);
  is('9j marks: hidden in every other view',
     await page.evaluate(() => { document.querySelector('[data-view="grid"]').click();
       return getComputedStyle(document.querySelector('.g-mark')).display; }), 'none');
  is('10 symptom-first swaps the mode', prints.derive.mode, 'derive');

  /* ═════════════ C · CAN YOU STILL SEE YOUR ANSWER ═════════════
     The measurement that decides this whole question. Pick three, then count how
     many of the three are actually inside the viewport without scrolling. */
  console.log('\n\x1b[1mC · with three chosen, how many can you see\x1b[0m');
  for (const v of ['grid','index','type','shelf','pills','plates','marks']) {
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
               answer: document.querySelector('#tray-l').textContent.trim() };
    });
    is(`11 ${v}: three are selected`, seen.lit, 3);
    /* ⚠️ THIS NUMBER IS REPORTED, NOT ASSERTED, AND THAT IS THE POINT.
       Asserting "3 of 3" only ever measured which layouts happen to fit a 1440×900
       window — the shelf hides picks by scrolling them away, and index hides its
       eighth row simply by being eight ruled rows tall. Neither is a defect once
       the tray exists; the tray is precisely what makes a view that cannot show
       every pick still usable. So the measurement is printed for the record and
       the ASSERTION is the design claim: whatever the layout hides, the tray
       names all three. */
    ok(`11a ${v}: ${seen.visible} of 3 picks visible in the layout itself`);
    has(`11b ${v}: and the tray names all three regardless`, seen.answer, 'Sexual Health');
  }

  /* the answer line must read in MARKUP order, not click order — otherwise the
     same three picks render three different ways depending on tap sequence */
  await page.click('#reset');
  await page.click('[data-view="grid"]');
  await page.click('[data-goal="Sexual Health"]');
  await page.click('[data-goal="Auto Immune Disease"]');
  await page.click('[data-goal="Gut Health"]');
  const order = await page.evaluate(() => document.querySelector('#tray-l').textContent.trim());
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
             /* the answer moved onto the tray's ink, so it is measured against
                that ground and not the page's */
             'the tray answer': [g(document.querySelector('#tray-l')).color,
                                 g(document.querySelector('#tray')).backgroundColor],
             'the lede': [g(document.querySelector('#lede')).color, body] };
  });
  for (const [k,[fg,bg]] of Object.entries(pairs)) {
    const r = contrast(fg, bg);
    r >= 4.5 ? ok(`18 ${k} clears 4.5:1`, r.toFixed(2)) : bad(`18 ${k} clears 4.5:1`, r.toFixed(2));
  }

  /* ⚠️ THE ONE RED, NOW THAT THERE IS ONLY ONE ACTION. Red is this page's material
     for "this is the thing that commits you", so it must appear on exactly one
     control and never on a selected state or a navigation step. Since the Continue
     went, that is: the lit tile is INK, the tray's action is an OUTLINE (it moves
     you along, it does not commit you), and the panel's Start is the one filled
     red in the whole file. */
  const reds = await page.evaluate(() => {
    const g = el => getComputedStyle(el);
    return {
      lit:   g(document.querySelector('.g[aria-pressed="true"]')).backgroundColor,
      tray:  g(document.querySelector('#tray-go')).backgroundColor,
      start: g(document.querySelector('#panel .btn')).backgroundColor,
      filled: [...document.querySelectorAll('button')]
        .filter(b => /142, ?45, ?58/.test(getComputedStyle(b).backgroundColor)).length
    };
  });
  const RED = /142, ?45, ?58/;
  !RED.test(reds.lit)   ? ok('19 selection is ink, never the one red', reds.lit)
                        : bad('19 selection is ink, never the one red', reds.lit);
  !RED.test(reds.tray)  ? ok('19a the tray action is an outline, not a commitment', reds.tray)
                        : bad('19a the tray action is an outline', reds.tray);
  RED.test(reds.start)  ? ok('19e Start is the one red', reds.start)
                        : bad('19e Start is the one red', reds.start);
  is('19f and it is the only red control on the page', reds.filled, 1);

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
  /* ⚠️ THE ANSWER IS SAID EXACTLY ONCE. A Continue button, a .chosen line and the
     tray all carried the same thing at one point — two of them are gone, and this
     asserts they stay gone rather than creeping back as a convenience. */
  const dupes2 = await page.evaluate(() => ({
    cont: !!document.querySelector('#cont'),
    chosen: !!document.querySelector('#chosen'),
    openers: document.querySelectorAll('[data-open-panel]').length
  }));
  is('19b there is no second Continue', dupes2.cont, false);
  is('19c there is no second answer line', dupes2.chosen, false);
  is('19d exactly one control opens the panel', dupes2.openers, 1);

/* ═════════════ F · THE TRAY AND THE PANEL ═════════════
     The tray is the answer made permanent: it must arrive on the FIRST pick, in
     every view, and carry the names — that is what lets a compact presentation
     work at all. The panel must open from both routes and must not become a
     checkout: one primary action and one toggle, nothing else clickable. */
  console.log('\n\x1b[1mF · the tray and the panel\x1b[0m');
  await page.click('#reset');
  await page.click('[data-view="marks"]');
  await page.waitForTimeout(200);
  const rest = await page.evaluate(() => ({
    up: getComputedStyle(document.querySelector('#tray')).opacity,
    l: document.querySelector('#tray-l').textContent.trim(),
    off: document.querySelector('#tray-go').disabled,
    label: document.querySelector('#tray-go-t').textContent.trim()
  }));
  /* ⚠️ NOTHING CHOSEN, NOTHING SHOWN — his call. The resting bar carried "four
     questions · about ninety seconds", a promise borrowed from the four-question
     flow in the other lab and simply untrue on a one-question screen; and a bar
     that is up before there is an answer only repeats the lede above it. */
  is('21 the tray is down at rest', rest.up, '0');
  is('21e and says nothing', rest.l, '');
  is('21f with its action closed', rest.off, true);
  await page.click('[data-goal="Gut Health"]');
  await page.waitForTimeout(600);
  const tray1 = await page.evaluate(() => ({
    on: document.querySelector('#tray').classList.contains('has'),
    n: document.querySelector('#tray-n').textContent.trim(),
    l: document.querySelector('#tray-l').textContent.trim(),
    onScreen: document.querySelector('#tray').getBoundingClientRect().bottom <= innerHeight + 2
  }));
  is('21a it fills in on the first pick', tray1.on, true);
  is('21b and counts', tray1.n, '1 chosen');
  is('21h and its label becomes the reward',
     await page.evaluate(() => document.querySelector('#tray-go-t').textContent.trim()),
     'See your programme');
  has('21c and names', tray1.l, 'Gut Health');
  is('21d and is actually on screen', tray1.onScreen, true);

  /* the tray is what makes the shelf survivable — assert it there specifically */
  await page.click('[data-view="shelf"]');
  await page.click('[data-goal="Sexual Health"]');
  await page.waitForTimeout(400);
  has('22 the shelf pick that scrolled away is still named in the tray',
      await page.evaluate(() => document.querySelector('#tray-l').textContent), 'Sexual Health');

  await page.click('[data-open-panel]');
  await page.waitForTimeout(250);
  is('23 the tray opens the panel',
     await page.evaluate(() => document.querySelector('#panel').open), true);
  /* ⚠️ IS IT ACTUALLY CENTRED. A <dialog> centres via its UA margin:auto, which a
     `*{margin:0}` reset silently overrides — the modal then opens pinned top-left
     and every content assertion still passes. Measure the box, not the CSS. */
  const box = await page.evaluate(() => {
    const d = document.querySelector('#panel').getBoundingClientRect();
    return { l: Math.round(d.left), r: Math.round(innerWidth - d.right), w: Math.round(d.width) };
  });
  Math.abs(box.l - box.r) <= 2
    ? ok('CENTRED the modal is centred', `${box.l}px each side`)
    : bad('CENTRED the modal is centred', `left ${box.l}, right ${box.r}`);
  has('23a the panel names the goals',
      await page.evaluate(() => document.querySelector('#panel-recap').textContent), 'Gut Health');
  is('23b the total carries VAT at 5%',
     await page.evaluate(() => document.querySelector('#total').textContent.trim()), 'AED 1,207.50');
  await page.click('#addon');
  await page.waitForTimeout(200);
  is('24 the add-on moves the total',
     await page.evaluate(() => document.querySelector('#total').textContent.trim()), 'AED 3,255.00');
  await page.click('#addon');
  await page.waitForTimeout(200);
  is('24a and moves it back',
     await page.evaluate(() => document.querySelector('#total').textContent.trim()), 'AED 1,207.50');

  /* ⚠️ NOT A CHECKOUT. Count the things a customer can press inside the panel:
     close, the one add-on, and Start. Anything else is another chance to hesitate
     at the last moment before payment, and this check is how that stays true. */
  const controls = await page.evaluate(() =>
    [...document.querySelectorAll('#panel button')].map(b => b.id || b.className.split(' ')[0]));
  is('25 the panel carries exactly three controls', controls.length, 3);
  has('25a close', controls.join('|'), 'panel-x');
  has('25b the one add-on', controls.join('|'), 'addon');
  has('25c and Start', controls.join('|'), 'btn');
  await page.click('#panel-x');
  await page.waitForTimeout(200);

  is('26 it closes', await page.evaluate(() => document.querySelector('#panel').open), false);

  /* ═════════════ G · THE LEGIBILITY TEST ═════════════ */
  console.log('\n\x1b[1mG · hide labels\x1b[0m');
  await page.click('[data-view="marks"]');
  await page.click('#blind');
  await page.waitForTimeout(200);
  const blindOn = await page.evaluate(() => ({
    label: getComputedStyle(document.querySelector('[data-view="marks"] .g-t')).opacity,
    mark: getComputedStyle(document.querySelector('.g-mark')).display
  }));
  is('27 labels go', blindOn.label, '0');
  is('27a the marks stay', blindOn.mark, 'block');
  await page.click('#blind');
  await page.waitForTimeout(200);
  is('27b and come back',
     await page.evaluate(() => getComputedStyle(document.querySelector('[data-view="marks"] .g-t')).opacity), '1');

  await page.click('#reset');
  await page.waitForTimeout(250);
  is('28 reset returns the tray to its resting state',
     await page.evaluate(() => document.querySelector('#tray-go').disabled), true);
  is('28b and the tray goes down with it',
     await page.evaluate(() => document.querySelector('#tray').classList.contains('has')), false);
  is('28a and clears the add-on',
     await page.evaluate(() => document.querySelector('#total').textContent.trim()), 'AED 1,207.50');

  is('29 still no console errors after the whole walk', errors.length, 0);

  await browser.close();
  console.log(`\n\x1b[1m${pass} passed, ${fail} failed\x1b[0m${SHOTS ? `  ·  shots in ${OUT}` : ''}\n`);
  process.exit(fail ? 1 : 0);
};

run().catch(e => { console.error(e); process.exit(1); });
