/* ═══════════════════════════════════════════════════════════════════════════════════
   SECTION 04 LAB HARNESS — peptide-therapy/section04-lab.html, round 18
   ═══════════════════════════════════════════════════════════════════════════════════
   Run:  node tools/qa/section04-lab.mjs [--shots]
   Needs: npm install --no-save playwright

   ⚠️ WHY A LAB HAS A HARNESS AT ALL. A lab exists to be REPLIED TO, so the numbers
   printed on its variant cards are what the reply is made against — and a badge is just
   a string somebody typed. Every arithmetic claim on that page is re-derived here from a
   real browser, and if a badge and this file disagree, THIS FILE IS RIGHT and the badge
   is a bug. Round 17 found a contrast check that had never once measured its subject;
   the cure for that is checks that would notice.

   ⚠️ THE TWO CHECKS THAT MATTER MOST ARE THE ONES ABOUT HONESTY, NOT ABOUT PIXELS:
     · check 2 — the lab invents no copy. Every name, descriptor and chip on a tile must
       already exist in index.html or goals-lab.html. A lab that quietly writes new
       marketing and then gets approved has laundered copy past the client.
     · check 6 — a variant may only change style, never content. All eight variants have
       to show the same eight names, or the comparison being asked for is not a
       comparison.

   ⚠️ WebGL IS NOT ASSUMED. Chapter III is checked for a real drawing context and for real
   non-blank pixels; where the environment has no GPU the run says so and skips rather
   than passing quietly — a green tick for a canvas that never drew is worse than a gap. */

import path from 'path';
import { chromium } from 'playwright';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const HERE  = path.dirname(fileURLToPath(import.meta.url));
const ROOT  = path.resolve(HERE, '..', '..');
const PAGE  = '/peptide-therapy/section04-lab.html';
const SHOTS = process.argv.includes('--shots');
const OUT   = process.env.OUT || path.join(ROOT, '.qa-out');
if (SHOTS) fs.mkdirSync(OUT, { recursive: true });

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const DEPTH   = ['G', 'H'];

let pass = 0, fail = 0, skip = 0;
const ok   = (n, m = '') => { pass++; console.log(`  \x1b[32m✓\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const bad  = (n, m = '') => { fail++; console.log(`  \x1b[31m✗\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const note = m => console.log(`    \x1b[2m· ${m}\x1b[0m`);
const gap  = (n, m) => { skip++; console.log(`  \x1b[33m~\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const is   = (n, got, want) => String(got) === String(want) ? ok(n, String(got)) : bad(n, `got ${got}, want ${want}`);
const head = t => console.log(`\n\x1b[1m${t}\x1b[0m`);

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
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

const MIME = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css', '.woff2':'font/woff2', '.webp':'image/webp', '.svg':'image/svg+xml',
  '.png':'image/png', '.jpg':'image/jpeg', '.ico':'image/x-icon', '.json':'application/json' };

/* ── contrast, the same arithmetic every harness in this repo uses ─────────────────── */
const lin = c => (c /= 255) <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
const lum = ([r, g, b]) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + .05) / (y + .05); };
const rgb = s => (String(s).match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);

const run = async () => {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end('nope');
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  const PORT = await new Promise(r => server.listen(0, () => r(server.address().port)));

  /* ⚠️ SWIFTSHADER IS REQUESTED, NOT REQUIRED. CI has no GPU, and without a software
     rasteriser chapter III cannot be measured at all — but forcing it must never become a
     way of claiming the variants work on hardware they were never run on. If the context
     is missing the depth checks report a GAP. */
  const browser = await chromium.launch({ executablePath: findChromium(),
    args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto(`http://localhost:${PORT}${PAGE}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);

  /* ═══ 1 · THE LAB IS THE SHAPE IT CLAIMS TO BE ═══════════════════════════════════ */
  head('1 · Structure');
  const shape = await page.evaluate(() => ({
    tiles:  document.querySelectorAll('.px').length,
    picks:  document.querySelectorAll('.px-pick').length,
    marks:  document.querySelectorAll('.px-mark').length,
    opens:  document.querySelectorAll('.px-open').length,
    /* ⚠️ SCOPED TO THE DIRECT CHILD ON PURPOSE. F's back face carries a CLONE of the
       descriptor, so an unscoped .px .px-teaser counts sixteen and an assertion of eight
       fails on a page that is correct. The clone is checked on its own below. */
    teasers:document.querySelectorAll('.px > .px-teaser').length,
    backTeasers: document.querySelectorAll('.px-back .px-teaser').length,
    /* the lab's source promises the two agree; this is the promise, checked */
    clonesMatch: [...document.querySelectorAll('.px')].every(px => {
      const a = px.querySelector(':scope > .px-teaser'), b = px.querySelector('.px-back .px-teaser');
      return a && b && a.textContent.trim() === b.textContent.trim();
    }),
    rail:   [...document.querySelectorAll('.rail a[data-go]')].map(a => a.dataset.go),
    whys:   [...document.querySelectorAll('.why-item')].map(w => w.dataset.for),
    authored: document.getElementById('stage').dataset.v,
    /* eight <svg>s drawing the same figure would satisfy any count ever written */
    uniqueMarks: new Set([...document.querySelectorAll('.px-mark')].map(s =>
      [...s.querySelectorAll('path,circle')]
        .map(e => e.getAttribute('d') || e.getAttribute('cx') + ',' + e.getAttribute('cy'))
        .join(';'))).size,
  }));
  is('1  eight tiles', shape.tiles, 8);
  is('1a eight select surfaces', shape.picks, 8);
  is('1b eight marks', shape.marks, 8);
  is('1c eight DIFFERENT marks', shape.uniqueMarks, 8);
  is('1d eight + doors', shape.opens, 8);
  is('1e eight descriptors on the front', shape.teasers, 8);
  is('1i and eight on the turned face', shape.backTeasers, 8);
  if (shape.clonesMatch) ok('1j front and back say the same thing, tile for tile');
  else bad('1j a turned face has drifted from its front');
  is('1f nine letters on the rail', shape.rail.join(''), LETTERS.join(''));
  is('1g and a rationale for every one of them', shape.whys.join(''), LETTERS.join(''));
  /* ⚠️ THE AUTHORED data-v IS THE NO-SCRIPT STATE. If a future edit leaves the stage with
     no data-v, or with one that has no rules, the page renders as an unstyled grid for
     anyone whose script did not run — the exact failure the programme lab shipped once. */
  is('1h the stage is authored on a real variant', shape.authored, 'A');

  /* ═══ 2 · THE LAB INVENTS NO COPY ═══════════════════════════════════════════════
     ⚠️ THIS IS THE CHECK THE FILE EXISTS FOR. Every word on a tile has to be traceable to
     something the client has already been shown: names and chips to index.html, the
     one-line descriptors to goals-lab.html. A lab that writes new marketing and is then
     approved by letter has laundered copy past him — and the round-6 note about clinical
     claims is what that costs when it happens. */
  head('2 · No new copy');
  const src  = fs.readFileSync(path.join(ROOT, 'peptide-therapy/index.html'), 'utf8');
  const gsrc = fs.readFileSync(path.join(ROOT, 'peptide-therapy/goals-lab.html'), 'utf8');
  const words = await page.evaluate(() => [...document.querySelectorAll('.px')].map(px => ({
    name: px.querySelector('h3').textContent.trim(),
    desc: px.querySelector('.px-teaser').textContent.trim(),
    chips: [...px.querySelectorAll('.px-chips span')].map(s => s.textContent.trim()),
  })));
  const esc = s => s.replace(/&/g, '&amp;');
  const strayName = words.find(w => !src.includes('>' + esc(w.name) + '<'));
  const strayDesc = words.find(w => !gsrc.includes(esc(w.desc)));
  const strayChip = words.flatMap(w => w.chips).find(c => !src.includes('>' + esc(c) + '<'));
  if (!strayName) ok('2  all eight names come from index.html, character for character');
  else bad('2  a tile name is not on the page', strayName.name);
  if (!strayDesc) ok('2a all eight descriptors come from goals-lab.html');
  else bad('2a a descriptor was written here', strayDesc.desc);
  if (!strayChip) ok('2b all chips come from the tiles\' own popups in index.html');
  else bad('2b a chip was written here', strayChip);

  /* ═══ 3 · EVERY LETTER ACTUALLY SWITCHES, AND NOTHING LEAKS ═════════════════════ */
  head('3 · The nine switch');
  const seen = {};
  for (const v of LETTERS) {
    await page.click(`.rail a[data-go="${v}"]`);
    await page.waitForTimeout(DEPTH.includes(v) ? 2200 : 320);
    seen[v] = await page.evaluate(() => ({
      v: document.getElementById('stage').dataset.v,
      why: [...document.querySelectorAll('.why-item')].filter(w =>
        getComputedStyle(w).display !== 'none').map(w => w.dataset.for),
      /* ⚠️ THE BACK FACE LEAKED ONCE AND IT LOOKED LIKE DUPLICATED COPY. Its ruleset was
         scoped to [data-v="F"] while its display:none was not declared anywhere, so seven
         variants drew a second descriptor and a live Choose button under every tile. */
      backs: [...document.querySelectorAll('.px-back')]
        .filter(b => getComputedStyle(b).display !== 'none').length,
      names: [...document.querySelectorAll('.px h3')].map(h => h.textContent.trim()).join('|'),
    }));
    if (SHOTS) await (await page.$('#stage')).screenshot({ path: path.join(OUT, `s04-${v}.png`) });
  }
  const wrong = LETTERS.filter(v => seen[v].v !== v);
  if (!wrong.length) ok('3  all nine letters take the stage', LETTERS.join(' '));
  else bad('3  letters that did not stick', wrong.join(', '));
  const badWhy = LETTERS.filter(v => seen[v].why.join('') !== v);
  if (!badWhy.length) ok('3a and exactly one rationale is visible at a time');
  else bad('3a rationale mismatch', badWhy.map(v => `${v}->${seen[v].why}`).join(', '));
  const leaked = LETTERS.filter(v => v !== 'F' && seen[v].backs > 0);
  if (!leaked.length) ok('3b the turned face is hidden everywhere but F');
  else bad('3b F\'s back face is drawing in other variants', leaked.join(', '));

  /* ═══ 4 · A VARIANT MAY CHANGE STYLE, NEVER CONTENT ═════════════════════════════ */
  head('4 · Same eight, eight ways');
  const nameSets = new Set(LETTERS.map(v => seen[v].names));
  if (nameSets.size === 1) ok('4  every variant shows the same eight names', '8 names, 9 variants');
  else bad('4  a variant changed the content', [...nameSets].join('  //  '));

  /* ═══ 5 · THE BADGES' ARITHMETIC ════════════════════════════════════════════════ */
  head('5 · The numbers on the cards');
  async function tileBox(v){
    await page.click(`.rail a[data-go="${v}"]`);
    await page.waitForTimeout(DEPTH.includes(v) ? 1200 : 520);
    return page.evaluate(() => {
      const r = document.querySelector('.px').getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), area: r.width * r.height };
    });
  }
  /* the shipped tile is the base every "bigger" claim is measured against, and it is the
     stage's own default geometry — the .px rule copied out of index.html */
  const baseBox = await tileBox('D');
  note(`shipped tile at 1440: ${baseBox.w} x ${baseBox.h}`);
  for (const [v, want] of [['A', 1.9], ['C', 1.5]]) {
    const b = await tileBox(v);
    const r = b.area / baseBox.area;
    if (Math.abs(r - want) <= .12) ok(`5${v === 'A' ? '' : 'a'} ${v} is x${r.toFixed(2)} the shipped tile`, `${b.w} x ${b.h}, card says x${want}`);
    else bad(`5  ${v}'s badge disagrees with the page`, `measured x${r.toFixed(2)}, card says x${want}`);
  }

  /* ═══ 6 · A NAME IS LEGIBLE ON EVERY GROUND THE LAB PROPOSES ════════════════════
     ⚠️ MEASURED PER VARIANT BECAUSE THREE OF THEM MOVE THE GROUND. B inverts it entirely
     and H makes the tile translucent — that is exactly where a colourway quietly stops
     clearing 4.5:1, and the shipped page has no rule protecting a ground it does not have
     yet. H is read from RENDERED PIXELS rather than computed style, because a translucent
     tile has no computed colour worth reading. */
  head('6 · Contrast on every proposed ground');
  for (const v of LETTERS) {
    await page.click(`.rail a[data-go="${v}"]`);
    await page.waitForTimeout(DEPTH.includes(v) ? 1600 : 420);
    const m = await page.evaluate(() => {
      const h3 = document.querySelector('.px h3');
      return { ink: getComputedStyle(h3).color,
               tile: getComputedStyle(document.querySelector('.px')).backgroundColor };
    });
    let ground = rgb(m.tile);
    let how = 'computed';
    if (rgb(m.tile).length < 3 || /rgba\(.*0(\.\d+)?\)/.test(m.tile) || v === 'H') {
      /* sample the real pixel behind the name instead */
      const box = await page.evaluate(() => {
        const r = document.querySelector('.px h3').getBoundingClientRect();
        return { x: Math.round(r.x + r.width - 6), y: Math.round(r.y + r.height / 2) };
      });
      const buf = await page.screenshot({ clip: { x: box.x, y: box.y, width: 3, height: 3 } });
      ground = await pixelOf(page, buf);
      how = 'rendered';
    }
    const c = ratio(rgb(m.ink), ground);
    if (c >= 4.5) ok(`6${v} ${v} — the name clears 4.5:1`, `${c.toFixed(2)} (${how})`);
    else bad(`6${v} ${v} — the name is under 4.5:1`, `${c.toFixed(2)} (${how})`);
  }

  /* ═══ 7 · CHAPTER III REALLY DRAWS ═════════════════════════════════════════════ */
  head('7 · The depth engine');
  for (const v of DEPTH) {
    await page.click(`.rail a[data-go="${v}"]`);
    await page.waitForTimeout(2600);
    const st = await page.evaluate(() => {
      const c = document.getElementById('depth');
      return { shown: getComputedStyle(c).display, w: c.width, h: c.height,
               fallback: document.querySelectorAll('.px.no-webgl').length };
    });
    if (st.fallback) { gap(`7${v} ${v} fell back to the flat marks`, 'no WebGL context here'); continue; }
    if (st.shown !== 'block' || st.w < 200) { bad(`7${v} ${v}'s canvas never sized`, JSON.stringify(st)); continue; }
    /* ⚠️ A SIZED CANVAS IS NOT A DRAWN ONE — AND readPixels CANNOT PROVE IT EITHER.
       The obvious check is gl.readPixels on the canvas; it returns an all-zero buffer here
       and would have failed both variants for ever. A WebGL context without
       preserveDrawingBuffer has an UNDEFINED back buffer once the frame is composited, so
       reading it from outside the render callback is reading nothing — and the zeroes look
       exactly like a canvas that never drew. The honest test is the one a person does:
       screenshot the grid, hide the canvas, screenshot again, and see whether the picture
       changed. That measures what actually reached the screen. */
    const shot = async () => (await page.$('#grid')).screenshot();
    const withGl = await shot();
    await page.evaluate(() => { document.getElementById('depth').style.visibility = 'hidden'; });
    await page.waitForTimeout(260);
    const without = await shot();
    await page.evaluate(() => { document.getElementById('depth').style.visibility = ''; });
    await page.waitForTimeout(120);
    const painted = await diffPixels(page, withGl, without);
    if (painted > 3000) ok(`7${v} ${v} draws — ${painted.toLocaleString()} pixels change when it is hidden`, `${st.w}x${st.h}`);
    else if (painted < 0) gap(`7${v} ${v} — the two frames could not be compared`);
    else bad(`7${v} ${v}'s canvas is sized but puts nothing on screen`, `${painted} pixels differ`);
  }
  /* the vials are the tile's OWN mark, so eight different textures must exist */
  await page.click('.rail a[data-go="G"]'); await page.waitForTimeout(1600);
  const marksHidden = await page.evaluate(() =>
    [...document.querySelectorAll('.px-mark')].filter(m => +getComputedStyle(m).opacity < .1).length);
  if (marksHidden === 8 || marksHidden === 0)
    ok('7a G hides the flat marks together, or not at all', `${marksHidden}/8 hidden`);
  else bad('7a G hid only some of the flat marks', `${marksHidden}/8`);

  /* ═══ 8 · THE TWO GESTURES THAT CARRY REAL RISK ════════════════════════════════ */
  head('8 · The gestures');
  /* F — turning must switch the select surface off, and the + must stay top RIGHT */
  await page.click('.rail a[data-go="F"]'); await page.waitForTimeout(420);
  await page.evaluate(() => document.querySelector('.px .px-open').click());
  await page.waitForTimeout(950);
  const turned = await page.evaluate(() => {
    const px = document.querySelector('.px');
    const r = px.getBoundingClientRect(), o = px.querySelector('.px-open').getBoundingClientRect();
    return { open: px.dataset.open,
             picks: getComputedStyle(px.querySelector('.px-pick')).pointerEvents,
             backVisible: getComputedStyle(px.querySelector('.px-back')).display,
             plusRight: o.x + o.width / 2 > r.x + r.width / 2,
             hasChoose: !!px.querySelector('.px-back .turn-pick') };
  });
  is('8  F turns the tile', turned.open, 'true');
  is('8a and its select surface stops taking clicks', turned.picks, 'none');
  if (turned.backVisible !== 'none') ok('8b the back face is showing', turned.backVisible);
  else bad('8b the back face did not appear');
  if (turned.plusRight) ok('8c the + stays in the top right of the turned tile');
  else bad('8c the + landed on the left — the mirrored-position bug is back');
  if (turned.hasChoose) ok('8d and the back carries its own Choose control');
  else bad('8d the turned tile has no way to choose the goal');
  /* choosing from the back really chooses */
  await page.evaluate(() => document.querySelector('.px .px-back .turn-pick').click());
  await page.waitForTimeout(400);
  is('8e choosing from the back sets the tile',
     await page.evaluate(() => document.querySelector('.px').dataset.picked), 'true');

  /* D — arriving at the variant must REPLAY the drawing, not show a finished grid */
  await page.click('.rail a[data-go="A"]'); await page.waitForTimeout(700);
  await page.click('.rail a[data-go="D"]');
  await page.waitForTimeout(120);
  const midDraw = await page.evaluate(() =>
    [...document.querySelectorAll('.px')].filter(p => !p.classList.contains('drawn')).length);
  if (midDraw > 0) ok('8f D replays its drawing when it is selected', `${midDraw}/8 still undrawn 120ms in`);
  else bad('8f D showed a finished grid — the variant does not demonstrate itself');
  await page.waitForTimeout(1400);
  is('8g and it finishes',
     await page.evaluate(() => document.querySelectorAll('.px.drawn').length), 8);

  /* ═══ 9 · THE PAGE HOLDS ═══════════════════════════════════════════════════════ */
  head('9 · The lab holds together');
  for (const w of [1600, 1440, 1280, 1104, 900, 640, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(280);
    const over = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over <= 1) ok(`9  no sideways scroll @ ${w}`);
    else bad(`9  ${over}px of sideways scroll @ ${w}`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });

  /* ⚠️ THE COMMENT-CLOSING BUG, GUARDED. Writing a slash-star pair inside a CSS comment
     ends it early, the prose becomes declarations and the parser eats the next rule — and
     the console stays clean while a section silently loses its layout. It cost a whole
     round on index.html. Reading the stylesheet as text is the only thing that catches it. */
  const css = fs.readFileSync(path.join(ROOT, 'peptide-therapy/section04-lab.html'), 'utf8')
    .split('<style>')[1].split('</style>')[0];
  let depthC = 0, broke = false;
  for (let i = 0; i < css.length - 1; i++) {
    if (css[i] === '/' && css[i + 1] === '*') { depthC++; i++; }
    else if (css[i] === '*' && css[i + 1] === '/') { depthC--; i++; if (depthC < 0) broke = true; }
  }
  if (!broke && depthC === 0) ok('9a every CSS comment opens and closes exactly once');
  else bad('9a a CSS comment is unbalanced — a rule below it is being eaten', `depth ${depthC}`);

  if (!errors.length) ok('9b zero console and page errors across the whole walk');
  else bad(`9b ${errors.length} error(s)`, errors.slice(0, 4).join(' | '));

  await browser.close();
  server.close();
  const tail = skip ? `, ${skip} skipped` : '';
  console.log(`\n\x1b[1m${fail ? '\x1b[31m' : '\x1b[32m'}${pass} passed, ${fail} failed${tail}\x1b[0m`);
  process.exit(fail ? 1 : 0);
};

/* decode a 3x3 PNG clip to one RGB triple, without a decoder dependency: the browser we
   already have does it */
async function pixelOf(page, buf) {
  const b64 = buf.toString('base64');
  return page.evaluate(async d => {
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = 'data:image/png;base64,' + d; });
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const p = g.getImageData(1, 1, 1, 1).data;
    return [p[0], p[1], p[2]];
  }, b64);
}


/* two PNGs in, the number of visibly different pixels out. Decoded in the browser we
   already have rather than by adding an image dependency to this repo. */
async function diffPixels(page, a, b) {
  return page.evaluate(async ([da, db]) => {
    const load = async d => { const i = new Image();
      await new Promise(r => { i.onload = r; i.onerror = r; i.src = 'data:image/png;base64,' + d; });
      return i; };
    const [ia, ib] = await Promise.all([load(da), load(db)]);
    if (!ia.width || ia.width !== ib.width || ia.height !== ib.height) return -1;
    const px = i => { const c = document.createElement('canvas');
      c.width = i.width; c.height = i.height;
      c.getContext('2d').drawImage(i, 0, 0);
      return c.getContext('2d').getImageData(0, 0, i.width, i.height).data; };
    const pa = px(ia), pb = px(ib);
    let n = 0;
    for (let i = 0; i < pa.length; i += 4)
      if (Math.abs(pa[i] - pb[i]) + Math.abs(pa[i+1] - pb[i+1]) + Math.abs(pa[i+2] - pb[i+2]) > 12) n++;
    return n;
  }, [a.toString('base64'), b.toString('base64')]);
}

run().catch(e => { console.error(e); process.exit(1); });
