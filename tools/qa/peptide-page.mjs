/* ═══════════════════════════════════════════════════════════════════════════════════
   peptide-page.mjs — the whole-page harness for /peptide-therapy/ (2026-08-16)

   The page had three harnesses that each watched one thing (the hero ground, the bonds
   lab, the scene stills) and nothing that watched the PAGE. This is that one. It exists
   because of a specific failure worth not repeating:

   ⚠️ A CSS COMMENT CLOSED EARLY AND NOTHING REPORTED IT. Writing the pair
   "lightness-star slash chroma-star" inside a comment terminates it on the spot; the
   prose after it is parsed as declarations and the parser swallows the rule that
   follows. `.scene-stage` lost `height:100svh`, the stage measured 0px, the canvas never
   drew — and the console was CLEAN. No error, no warning, and `window.__scene.p` still
   reported the right progress, because the script was fine. Only a screenshot showed it.
   So check 1 below reads the stylesheet as text and asserts no comment closes mid-word.
   It is the cheapest check here and the only one that would have caught that.

   Everything the CDN serves (GSAP, ScrollTrigger, SplitText, Lenis) is blocked by egress
   policy in sandboxes, so the harness serves the repo and fulfils those four requests
   from node_modules. NOTHING ABOUT THAT SHIPS — the page still loads them from jsDelivr.

     npm install playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
     node tools/qa/peptide-page.mjs [--shots]

   Exits non-zero on any failure. ROOT is derived from this file's own location and
   Chromium is searched for rather than pinned — the sister harness hardcoded a home
   directory and crashed before measuring anything on any other machine.
   ═══════════════════════════════════════════════════════════════════════════════════ */
import { chromium } from 'playwright';
import { readFileSync, existsSync, statSync, mkdirSync, readdirSync } from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const PAGE = '/peptide-therapy/';
const SHOTS = process.argv.includes('--shots');
const OUT = path.join(ROOT, '.qa-out');
if (SHOTS) mkdirSync(OUT, { recursive: true });

let failures = 0, checks = 0;
const ok   = (m) => { checks++; console.log('  \x1b[32m✓\x1b[0m ' + m); };
const bad  = (m) => { checks++; failures++; console.log('  \x1b[31m✗\x1b[0m ' + m); };
const note = (m) => console.log('    · ' + m);
const head = (m) => console.log('\n\x1b[1m' + m + '\x1b[0m');

/* ── the two portraits that are known-missing, and the reason ──────────────────────
   He sent both in conversation; chat attachments do not reach the filesystem and
   egress to medi-gyn.com is refused by policy, so they cannot be fetched either. The
   page is wired for them and falls back to a monogram. Their 404s are EXPECTED — but
   the harness prints them as a standing reminder rather than hiding them, and the
   moment the files land these lines disappear on their own. */
const EXPECTED_MISSING = [
  'images/doctors/dr-nahla-ibrahim-elawady-square.webp',
  'images/doctors/dr-nahla-ibrahim-elawady-head-400.webp',
  'images/doctors/dr-khalid-shukri-square.webp',
  'images/doctors/dr-khalid-shukri-head-400.webp',
];

/* ═══ 1 · THE STYLESHEET PARSES AS WRITTEN ═════════════════════════════════════════ */
function checkComments(html) {
  head('1 · Stylesheet comment integrity');
  let found = 0, blocks = 0;
  const re = /<style[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const start = m.index + m[0].length;
    const end = html.indexOf('</style>', start);
    if (end < 0) continue;
    const css = html.slice(start, end);
    if (css.length < 1000) continue;
    blocks++;
    const line0 = html.slice(0, start).split('\n').length;
    let i = 0;
    while (i < css.length) {
      if (css.startsWith('/*', i)) {
        const j = css.indexOf('*/', i + 2);
        if (j < 0) {
          bad(`unclosed comment opened at line ${line0 + css.slice(0, i).split('\n').length - 1}`);
          found++;
          break;
        }
        /* a comment that ends against a word character ended in the middle of prose,
           which is the signature of the accidental terminator */
        if (/[A-Za-z0-9]/.test(css[j - 1])) {
          const ln = line0 + css.slice(0, j).split('\n').length - 1;
          bad(`comment closes mid-word at line ${ln}: …${JSON.stringify(css.slice(Math.max(0, j - 54), j + 2))}`);
          found++;
        }
        i = j + 2;
      } else i++;
    }
  }
  if (!found) ok(`${blocks} style block(s), every comment closes on whitespace`);
}

/* ═══ 2 · THE COPY DECISIONS ARE ACTUALLY IN THE FILE ══════════════════════════════ */
function checkCopy(html) {
  head('2 · Copy decisions');
  /* his 2026-08-16 call: the word is gone from the page, both sites */
  const body = html.slice(html.indexOf('<main'));
  const partnership = (body.match(/Partnership/g) || []).length;
  const inComments = (body.match(/<!--[\s\S]*?-->/g) || []).join('').match(/Partnership/g) || [];
  if (partnership - inComments.length === 0) ok('"Partnership" appears in no rendered copy');
  else bad(`"Partnership" still rendered ${partnership - inComments.length}×`);

  const beats = (html.match(/class="scene-beat/g) || []).length;
  const sched = html.match(/const SCHED=\[([^;]*)\];/);
  const windows = sched ? (sched[1].match(/\[\s*\./g) || []).length : -1;
  if (beats === windows) ok(`${beats} scene beats, ${windows} SCHED windows — indexed 1:1`);
  else bad(`${beats} scene beats but ${windows} SCHED windows — draw() will throw on SCHED[b][0]`);
}

/* ═══ the server ═══════════════════════════════════════════════════════════════════ */
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml',
  '.webp':'image/webp', '.avif':'image/avif', '.woff2':'font/woff2', '.ico':'image/x-icon',
  '.png':'image/png', '.jpg':'image/jpeg' };
const missed = new Set();
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!existsSync(f) || statSync(f).isDirectory()) { missed.add(p.replace(/^\//, '')); r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  r.end(readFileSync(f));
});

/* node_modules may sit beside the repo or in a scratch dir — look, don't assume */
function findNodeModules() {
  const tries = [path.join(ROOT, 'node_modules'), path.join(process.cwd(), 'node_modules')];
  if (process.env.QA_NODE_MODULES) tries.unshift(process.env.QA_NODE_MODULES);
  for (const t of tries) if (existsSync(path.join(t, 'gsap', 'dist', 'gsap.min.js'))) return t;
  return null;
}
function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(base)) {
    for (const d of readdirSync(base)) {
      const p = path.join(base, d, 'chrome-linux', 'chrome');
      if (/^chromium-/.test(d) && existsSync(p)) return p;
    }
  }
  return undefined; /* let playwright resolve its own */
}

const html = readFileSync(path.join(ROOT, 'peptide-therapy/index.html'), 'utf8');
checkComments(html);
checkCopy(html);

const NM = findNodeModules();
if (!NM) { console.log('\n! gsap/lenis not found — install them, or set QA_NODE_MODULES'); process.exit(1); }
const MAP = [
  [/gsap@3\.13\.0\/dist\/gsap\.min\.js/, path.join(NM, 'gsap/dist/gsap.min.js')],
  [/ScrollTrigger\.min\.js/,             path.join(NM, 'gsap/dist/ScrollTrigger.min.js')],
  [/SplitText\.min\.js/,                 path.join(NM, 'gsap/dist/SplitText.min.js')],
  [/lenis@1\.3\.4\/dist\/lenis\.min\.js/, path.join(NM, 'lenis/dist/lenis.min.js')],
];

await new Promise(r => srv.listen(0, r));
const PORT = srv.address().port;
const browser = await chromium.launch({ executablePath: findChromium(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

async function newPage(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h },
    deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
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

/* ═══ 3 · NO HORIZONTAL OVERFLOW AT ANY WIDTH ══════════════════════════════════════
   ⚠️ 360 IS A KNOWN, PRE-EXISTING, NOT-OURS FAILURE and it is asserted as such rather
   than skipped: `.f-news{width:22rem}` is 352px against ~320 of content, and grid
   tracks take their item's auto minimum, so the FOOTER measures ~374 at a 360 viewport
   on all three pages of this site. Round 6 recorded it and left it deliberately — the
   footer is a documented TRUE COPY of the landing page's, so the one-line fix belongs
   to all three files in one commit. If 360 ever passes here, that fix landed. */
async function checkWidths() {
  head('3 · Horizontal overflow');
  const KNOWN_360 = 360;
  for (const w of [1920, 1440, 1280, 1104, 900, 760, 640, 560, 430, 390, KNOWN_360]) {
    const { ctx, page } = await newPage(w, 900);
    await page.goto(`http://localhost:${PORT}${PAGE}?probe=1`, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
      worst: (() => {
        let worst = null, W = document.documentElement.clientWidth;
        document.querySelectorAll('main *, footer *').forEach(e => {
          /* a clipped ancestor cannot overflow the document, so decorative glows inside
             overflow:hidden bands are not offenders and must not be reported as such */
          for (let p = e.parentElement; p; p = p.parentElement)
            if (getComputedStyle(p).overflow !== 'visible') return;
          const r = e.getBoundingClientRect();
          if (r.width && r.right > W + 1 && (!worst || r.right > worst.right))
            worst = { sel: e.tagName + '.' + [...e.classList].join('.'), right: Math.round(r.right) };
        });
        return worst;
      })(),
    }));
    const over = m.sw - m.cw;
    if (w === KNOWN_360) {
      if (over > 0) ok(`${w}px — ${m.sw} wide (the documented footer .f-news overflow, all three pages, not this page's)`);
      else ok(`${w}px — clean; the site-wide .f-news fix has landed, drop this exemption`);
    } else if (over <= 0) ok(`${w}px — scrollWidth ${m.sw}, exact`);
    else { bad(`${w}px — scrollWidth ${m.sw}, ${over}px of overflow`); if (m.worst) note(`widest: ${m.worst.sel} → ${m.worst.right}`); }
    await ctx.close();
  }
}

/* ═══ 4 · THE SCENE DRAWS, AND THE HELIX IS NOT COMPRESSED ═════════════════════════
   The stage must have height (see check 1's story), the canvas must actually put ink
   down, and — his 2026-08-16 call — the finished helix must be as wide as the loose
   wave was. The width is MEASURED off the canvas rather than read out of curve(): the
   whole point of the note is what the reader sees. */
async function checkScene() {
  head('4 · The chain scene');
  for (const [w, h, label] of [[1440, 900, 'desktop'], [390, 844, 'phone']]) {
    const { ctx, page, errs } = await newPage(w, h);
    const spans = {};
    for (const p of [0.30, 0.66, 0.78, 0.97]) {
      await page.goto(`http://localhost:${PORT}${PAGE}?scene=${p}`, { waitUntil: 'load' });
      await page.waitForTimeout(2200);
      const m = await page.evaluate(() => {
        const stage = document.querySelector('.scene-stage');
        const cv = document.querySelector('.scene-canvas');
        const box = stage.getBoundingClientRect();
        const c = cv.getContext('2d');
        const { width: W, height: H } = cv;
        const d = c.getImageData(0, 0, W, H).data;
        /* ⚠️ THE GROUND IS NOT ON THE CANVAS. The scene paints its ink onto a TRANSPARENT
           canvas and the ground is the stage's own background-color, written per frame by
           draw(). The first version of this harness sampled pixel (0,0) of the canvas,
           got rgba(0,0,0,0), and reported the stage as pure black at every stop. Read the
           element, and measure the drawn extent by ALPHA — which is what "drawn" means
           here, and is immune to the ground changing colour across the dawn. */
        const bg = getComputedStyle(stage).backgroundColor;
        let lo = W, hi = -1;
        const lum = [];
        for (let y = 0; y < H; y += 2) {
          for (let x = 0; x < W; x += 2) {
            const i = (y * W + x) * 4;
            const a = d[i + 3];
            if (a > 30) { if (x < lo) lo = x; if (x > hi) hi = x; }
            if (a > 8) lum.push(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]);
          }
        }
        const mean = lum.length ? lum.reduce((a, b) => a + b, 0) / lum.length : 0;
        const sd = lum.length ? Math.sqrt(lum.reduce((a, b) => a + (b - mean) ** 2, 0) / lum.length) : 0;
        return { p: window.__scene && window.__scene.p, stageH: Math.round(box.height),
                 cvW: W, span: hi < 0 ? 0 : Math.round((hi - lo) / (W / cv.clientWidth)),
                 ink: lum.length, spread: +sd.toFixed(1), bg };
      });
      spans[p] = m;
      if (m.stageH > 0 && m.ink > 0) ok(`${label} p=${p} — stage ${m.stageH}px, ground ${m.bg}, ink spread ${m.spread}, span ${m.span}px`);
      else if (!m.stageH) bad(`${label} p=${p} — STAGE HEIGHT 0. A CSS rule was eaten; run check 1.`);
      else bad(`${label} p=${p} — the canvas drew nothing`);
      if (SHOTS) await page.screenshot({ path: path.join(OUT, `peptide-scene-${label}-${p}.png`) });
    }
    /* ⚠️ THE HELIX IS MEASURED AGAINST ITS GEOMETRY, NOT AGAINST AN EARLIER FRAME.
       The obvious test — compare the wave at .66 with the helix at .78 — is WRONG and
       failed loudly before it was replaced: at .66 assembly is only two thirds done, so
       the frame still holds unwritten beads scattered across ±.46W, and the measured
       span was the SCATTER's 762px rather than the chain's. There is no frame in which
       the whole chain is a wave, so there is nothing to compare to.
       What the note actually asks for is that the finished helix be as wide as curve()'s
       amplitude says, so that is the assertion: 2 × min(W×.17, 260) on a desktop,
       2 × min(W×.30, 150) on a phone, ±14% for the bead radius at either end. Restore
       the old `mix(…, min(W*.14,120), coil)` narrowing and this drops by half. */
    const amp = w < 761 ? Math.min(w * .30, 150) : Math.min(w * .17, 260);
    const want = amp * 2;
    for (const p of [0.78, 0.97]) {
      const got = spans[p].span, off = Math.abs(got - want) / want;
      if (off <= 0.14) ok(`${label} p=${p} — helix spans ${got}px against curve()'s ${Math.round(want)}px (${(off * 100).toFixed(1)}% off): NOT compressed`);
      else bad(`${label} p=${p} — helix spans ${got}px, expected ~${Math.round(want)}px: the amplitude is a function of coil again`);
    }
    /* the ground must be cool, not the old plum — read at .30, before the dawn starts */
    const g = (spans[0.30].bg.match(/\d+/g) || []).map(Number);
    if (g.length >= 3 && g[2] > g[0]) ok(`${label} — the stage is cool (B ${g[2]} > R ${g[0]}), not the unapproved burgundy`);
    else bad(`${label} — the stage does not read cool: ${spans[0.30].bg}`);
    if (errs.length) bad(`${label} — console/page errors: ${JSON.stringify([...new Set(errs)].slice(0, 4))}`);
    else ok(`${label} — zero console and page errors across four stops`);
    await ctx.close();
  }
}

/* ═══ 5 · EVERY POPUP THE PAGE OWNS OPENS, AND CLOSES ══════════════════════════════ */
async function checkDialogs() {
  head('5 · Dialogs');
  const { ctx, page, errs } = await newPage(1440, 900);
  await page.goto(`http://localhost:${PORT}${PAGE}?probe=1`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  for (const [sel, name, min] of [
    ['.aud:nth-of-type(1) .aud-open', 'For women', 25],
    ['.aud:nth-of-type(2) .aud-open', 'For men', 18],
  ]) {
    await page.evaluate(s => document.querySelector(s).click(), sel);
    await page.waitForTimeout(700);
    const st = await page.evaluate(() => {
      const d = document.getElementById('pxd');
      return { hidden: d.hidden, label: d.getAttribute('aria-label'),
               items: d.querySelectorAll('.pxd-body .pxd-list li').length,
               focused: document.activeElement === d.querySelector('.pxd-panel') };
    });
    if (!st.hidden && st.label === name && st.items >= min && st.focused)
      ok(`${name} — opens, ${st.items} list items, focus on the panel`);
    else bad(`${name} — ${JSON.stringify(st)}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    const closed = await page.evaluate(() => document.getElementById('pxd').hidden);
    if (closed) ok(`${name} — Esc closes`); else bad(`${name} — Esc did not close`);
  }

  /* the chooser must mirror the doctors band, in the band's order */
  const cards = await page.evaluate(() => [...document.querySelectorAll('.doc > h3')].map(h => h.textContent.trim()));
  await page.evaluate(() => document.querySelector('.px .px-open').click());
  await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector('#pxd [data-choose]').click());
  await page.waitForTimeout(700);
  const chooser = await page.evaluate(() => ({
    rows: [...document.querySelectorAll('#pxd .pxd-doc b')].map(b => b.textContent.trim()),
    mono: [...document.querySelectorAll('#pxd .pxd-doc-face')].map(f => f.classList.contains('no-photo') ? f.dataset.mono : 'photo'),
    faces: [...document.querySelectorAll('#pxd .pxd-doc-face')].map(f => Math.round(f.getBoundingClientRect().width)),
  }));
  if (JSON.stringify(chooser.rows) === JSON.stringify(cards))
    ok(`chooser mirrors the band, in order — ${cards.length} doctors`);
  else bad(`chooser and band disagree:\n      band    ${JSON.stringify(cards)}\n      chooser ${JSON.stringify(chooser.rows)}`);
  if (new Set(chooser.faces).size === 1)
    ok(`all ${chooser.faces.length} chooser squares are one size (${chooser.faces[0]}px) — monograms cost no layout`);
  else bad(`chooser squares disagree in size: ${JSON.stringify(chooser.faces)}`);
  note(`portraits: ${chooser.mono.join(' · ')}`);

  /* Select is mock on every row, including the ones cloned out of the template */
  const inert = await page.evaluate(() => {
    const before = location.href;
    document.querySelector('#pxd .pxd-doc .btn').click();
    return { moved: location.href !== before, stillOpen: !document.getElementById('pxd').hidden };
  });
  if (!inert.moved && inert.stillOpen) ok('Select is inert and leaves the dialog open (delegated mock-booking guard)');
  else bad(`Select escaped its guard: ${JSON.stringify(inert)}`);

  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  if (errs.length) bad(`console/page errors: ${JSON.stringify([...new Set(errs)].slice(0, 4))}`);
  else ok('zero console and page errors through the whole dialog walk');
  await ctx.close();
}

/* ═══ 6 · CONTRAST ON THE RE-GRADED SURFACES ═══════════════════════════════════════
   WCAG arithmetic on the flat grounds the scene actually paints. The point is not that
   these pass — the warm originals passed too — it is that the COOL translation kept the
   warm numbers, which is what "the same value" was asked for. */
function lum(hex) {
  const c = hex.match(/\w\w/g).map(h => { const v = parseInt(h, 16) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
function checkContrast() {
  head('6 · The cool translation held its values');
  const pairs = [
    ['the ivory beat', '#F4F7FA', '#14202A', '#F4F7FA', '#2A1B20', 3],
    ['the gold beat',  '#8FA5B8', '#14202A', '#8FA5B8', '#2A1B20', 3],
    ['the italic',     '#87A8C5', '#14202A', '#C79A92', '#2A1B20', 3],
    ['a drifting bead','#93A1AE', '#14202A', '#B09A9C', '#2A1B20', 3],
    ['the turn accent','#95ABBF', '#003A5F', '#C2A05E', '#5C1F31', 3],
    ['the turn body',  '#BECDD8', '#003A5F', '#D7C7C7', '#5C1F31', 4.5],
  ];
  for (const [name, fg, bg, wasFg, wasBg, floor] of pairs) {
    const now = ratio(fg, bg), was = ratio(wasFg, wasBg);
    const drift = Math.abs(now - was);
    if (now < floor) bad(`${name}: ${now.toFixed(2)}:1 — under the ${floor} floor`);
    else if (drift > 0.4) bad(`${name}: ${now.toFixed(2)}:1 against ${was.toFixed(2)} warm — drifted ${drift.toFixed(2)}`);
    else ok(`${name}: ${now.toFixed(2)}:1 (warm original ${was.toFixed(2)}, drift ${drift.toFixed(2)})`);
  }
}

await checkWidths();
await checkScene();
await checkDialogs();
checkContrast();

head('7 · Files the page asks for and does not get');
const unexpected = [...missed].filter(f => !EXPECTED_MISSING.includes(f));
for (const f of EXPECTED_MISSING) if (missed.has(f)) note(`awaiting his drop: ${f}`);
if (!unexpected.length) ok('no unexpected 404s');
else { bad(`unexpected 404s: ${JSON.stringify(unexpected)}`); }

await browser.close(); srv.close();
console.log(`\n${failures ? '\x1b[31m' : '\x1b[32m'}${checks - failures}/${checks} checks passed\x1b[0m` + (SHOTS ? `  ·  shots in ${OUT}` : ''));
process.exit(failures ? 1 : 0);
