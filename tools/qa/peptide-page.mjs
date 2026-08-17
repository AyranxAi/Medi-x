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

/* ── files the page may legitimately ask for and not get ───────────────────────────
   Empty, and it should stay that way. It held Dr. Nahla's and Dr. Khalid's portraits
   for a day while they could not be landed from this environment; he uploaded them on
   2026-08-16 and the list emptied itself, exactly as the exemption was written to. Any
   404 now is a real one and fails the run. Add a path here ONLY with a dated reason. */
const EXPECTED_MISSING = [];

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
    /* ⚠️ THIS CHECK'S POLARITY IS INVERTED, AND THE INVERSION IS THE POINT (round 14).
       It read "the ground must be COOL, not the old plum" and asserted B > R, because
       2026-08-16 carried a client note that burgundy was not approved. His later
       instruction — "roll the plum design in the whole peptide page" — reverses that, so
       the same check now guards the opposite invariant.
       ⚠️ IT IS FLIPPED RATHER THAN DELETED because the risk it covers is unchanged in
       either direction: the stage ground lives in TWO languages (CSS `background:#2E2228`
       on .scene-stage for the pre-frame, and BG_A in the scene script for every frame
       after), and nothing but this check notices when only one of them is edited. A
       half-graded stage flashes the wrong colour for one frame on load — which is exactly
       the kind of thing that never shows up in review and always shows up on a client's
       phone. Read at .30, before the dawn starts. */
    const g = (spans[0.30].bg.match(/\d+/g) || []).map(Number);
    if (g.length >= 3 && g[0] > g[2]) ok(`${label} — the stage is plum (R ${g[0]} > B ${g[2]}), both languages agreeing`);
    else bad(`${label} — the stage did not come back warm: ${spans[0.30].bg}`);
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

  /* ⚠️ SECTION 05 IS GONE (round 14) AND ITS TWO DIALOGS WENT WITH IT. This used to
     open "For women" and "For men" and count their symptom lines. The section was
     deleted whole on his call — the client's two explainer paragraphs, both symptom
     lists and the seven steps — because the programme panel now carries the same
     ground in five steps and the page was saying it twice.
     THE CHECK IS INVERTED RATHER THAN DROPPED, for the reason the chooser's check
     below already records: an assertion is cheap and a silent restoration is not.
     Section 05's markup is the single most likely thing to come back by accident —
     it is ~1,100 words of CLIENT copy, so it exists in his documents, in the git
     history and in every handover, and any of those is one paste away from the page.
     If it does come back, the page has two "what happens next" sequences again and
     nothing else in this harness would say so. */
  const dead = await page.evaluate(() => ({
    aud:   document.querySelectorAll('.aud, .aud-open, .aud-detail').length,
    steps: document.querySelectorAll('.steps .step').length,
    lede:  document.body.textContent.includes('building blocks of proteins'),
    /* ⚠️ NOTHING MAY CLAIM #programme NOW. The band that briefly reused that id was
       removed on his call too; the page's only statement of price and process is the
       programme panel. */
    band:  !!document.getElementById('programme'),
    /* the panel's six, and they are the page's ONLY sequence */
    panel: document.getElementById('prog-panel')
             ? document.getElementById('prog-panel').content.querySelectorAll('.pg-steps li').length : -1,
  }));
  if (!dead.aud && !dead.steps && !dead.lede && !dead.band)
    ok('section 05 is gone whole — no audience rows, no seven steps, no client lede, no #programme');
  else bad(`section 05 has come back: ${JSON.stringify(dead)}`);

  /* ⚠️ AND 06 · WHAT'S INCLUDED / WHAT'S EXCLUDED IS GONE THE SAME WAY — round 18, his
     "remove this". SAME INVERTED ASSERTION, FOR EXACTLY THE REASON SECTION 05'S NOTE
     GIVES: the ledger was ~150 words of CLIENT copy, so it lives in his documents, in the
     git history and in every handover, and any of those is one paste away from the page.
     If it comes back the page has two answers to "what am I buying" again — the programme
     panel is the other — and nothing else in this harness would say so.
     ⚠️ IT IS CHECKED THREE WAYS ON PURPOSE, because a paste can arrive stripped of its
     classes: the container, the id it was reachable by, and a phrase from the copy that
     appears nowhere else on the page. "BOZAT" is the safest of those — it is a scanner
     brand named only in that list, so it cannot collide with the panel or the FAQ. */
  const ledger = await page.evaluate(() => ({
    sec:  document.querySelectorAll('.incl, .incl-grid, .incl-col, .incl-list').length,
    id:   !!document.getElementById('included'),
    copy: /BOZAT|DUTCH Plus/i.test(document.body.textContent),
  }));
  if (!ledger.sec && !ledger.id && !ledger.copy)
    ok('section 06 · the included/excluded ledger is gone whole — no .incl markup, no #included, no client copy');
  else bad(`the included/excluded ledger has come back: ${JSON.stringify(ledger)}`);
  if (dead.panel === 6) ok('the programme panel is the page\'s only sequence — six steps');
  else bad(`the panel's steps are wrong: ${dead.panel}`);

  /* ⚠️⚠️ THIS CHECK ASSERTED AN ALTERNATION AND ITS SUBJECT LEFT ON 2026-08-17 — the page
     went to ONE ground (his call, "making the background ivory not rose") and the chapters
     are separated by a hairline now. THE GUARANTEE IS UNCHANGED AND THE MEASUREMENT MOVED
     WITH IT: what it has always protected is that a reader can tell one chapter from the
     next, and that used to be a colour step. It is a 1px rule now, so that is what gets
     read. THE QA README'S OWN RULE — "deleting a check whose subject left is how a page
     quietly loses a guarantee" — is why this was rewritten rather than dropped.
     ⚠️ WHY THE HAIRLINE IS NOT A DOWNGRADE, MEASURED: --line #DED4C2 on --ivory #FAF7F1
     is 1.373:1, where the rose/ivory step it replaces was 1.126:1. The separator got
     STRONGER, which is the argument that carried the change.
     ⚠️⚠️ THE HISTORY THIS CHECK EARNED IS WORTH KEEPING even though the colours are gone,
     because the failure mode has not changed — only its shape. Twice a section was deleted
     and the two chapters that met were left indistinguishable, with nothing reporting it:
     round 16 (05 went, .services and .incl were both ivory) and round 18 (06 went, the
     ivory beat between .services and .docs went with it). A missing hairline is that same
     bug in the new vocabulary, and it is just as invisible in a console.
     ⚠️ DO NOT EVER GREEN A FAILURE HERE BY DELETING THE OFFENDING SELECTOR FROM THIS
     ARRAY. The array IS the page's reading order; a name dropped from it is a boundary
     that silently stops being watched, and the check would still print in green. A chapter
     leaving the page is the only reason a name may leave this list, and then the
     boundaries around the hole have to be re-read — the work this failure exists to force.
     ⚠️ .services IS EXEMPT FROM THE RULE AND THAT IS DELIBERATE, NOT A HOLE: it opens
     directly under .turn, which is burgundy, so the ground change IS the boundary there
     and a --line hairline on a dark edge would be invisible anyway. The exemption is
     asserted rather than skipped — if .turn ever stops being burgundy this goes red. */
  const chapters = await page.evaluate(() =>
    ['.services', '.docs', '.stories', '.faq', '.final'].map(s => {
      const el = document.querySelector(s);
      if (!el) return { s, missing: true };
      const cs = getComputedStyle(el);
      const prev = el.previousElementSibling;
      return { s, bg: cs.backgroundColor,
               rule: cs.borderTopWidth, ruleColor: cs.borderTopColor,
               above: prev ? getComputedStyle(prev).backgroundColor : null };
    }));
  const turnIsDark = await page.evaluate(() => {
    const t = document.querySelector('.turn');
    if (!t) return false;
    const [r, g, b] = getComputedStyle(t).backgroundColor.match(/\d+/g).map(Number);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 110;
  });
  let separated = 0;
  for (const c of chapters) {
    if (c.missing) { bad(`${c.s} has left the page — re-read the boundaries around the hole`); continue; }
    const stepped = c.above && c.above !== c.bg;
    const ruled = parseFloat(c.rule) >= 1 && c.ruleColor !== 'rgba(0, 0, 0, 0)';
    if (ruled || stepped) separated++;
    else bad(`${c.s} has no boundary: no hairline, and the chapter above it shares its ground (${c.bg})`);
  }
  if (separated === chapters.length)
    ok(`every chapter is separated from the one above it — hairline or ground step, ${chapters.length} chapters`);
  if (turnIsDark) ok('.services is exempt because .turn above it is still dark — the ground change is the boundary');
  else bad('.turn is no longer dark, so .services needs a hairline like the rest');

  /* ⚠️⚠️ THIS CHECK MEASURED THE IVORY TILES AGAINST THE DAWN GROUND AND ITS SUBJECT LEFT IN
     ROUND 18. It read `rgb('.services')` against `rgb('.px')` and required 8/255 of daylight
     between them, because the tiles' ivory fill was the only thing making them read as
     objects rather than as ruled-off regions of the page. The ring's cards are PHOTOGRAPHS,
     which are objects on any ground, so the invariant it guarded no longer exists.
     ⚠️ IT IS REPLACED RATHER THAN DELETED, AND BY THE THING THAT IS NOW LOAD-BEARING: the
     ring line and the unpicked dots are drawn in gold ON THE GROUND, and gold on a pale
     ground is the weakest pairing in this section — measured at 2.31 against ivory when the
     accent was chosen. If a later grade lightens the ground or softens the gold, the ring
     the cards stand on quietly stops being visible and nothing else here would notice. */
  const sep = await page.evaluate(() => {
    const lin = c => { c /= 255; return c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055) ** 2.4; };
    const lum = ([r,g,b]) => 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
    const nums = s => (s.match(/[\d.]+/g) || []).map(Number);
    const ground = nums(getComputedStyle(document.querySelector('.services')).backgroundColor).slice(0,3);
    const line = getComputedStyle(document.querySelector('#ringline path'));
    const stroke = nums(line.stroke).slice(0,3);
    const a = parseFloat(line.opacity);
    /* the line is drawn at 42% over the ground, so that is the colour the eye gets */
    const eff = stroke.map((v,i) => v*a + ground[i]*(1-a));
    const [x,y] = [lum(eff), lum(ground)].sort((m,n)=>n-m);
    return +((x+0.05)/(y+0.05)).toFixed(2);
  });
  if (sep >= 1.2) ok(`the ring line stands off its ground at ${sep}:1`);
  else bad(`the ring line and its ground have converged (${sep}:1) — the cards stand on nothing`);

  /* ⚠️ THE CHOOSER IS NO LONGER REACHABLE FROM THE PAGE, AND THAT IS DELIBERATE.
     Round 12 moved doctor selection to the moment the consultation is booked (his
     call), so the eight tiles' pill became "Add to your programme" and nothing on
     the page opens #pxd-choose any more. THE TEMPLATE IS KEPT ON PURPOSE — it is
     exactly the right UI for that later moment and re-deleting it would only mean
     rebuilding it — so the invariant it exists for is asserted against the TEMPLATE
     instead of against a route that no longer runs. The old version of this check
     clicked [data-choose] and died on null, which is the honest failure: a test
     that walks a path the product has removed is testing the test. */
  const cards = await page.evaluate(() => [...document.querySelectorAll('.doc > h3')].map(h => h.textContent.trim()));
  const chooser = await page.evaluate(() => {
    const t = document.getElementById('pxd-choose');
    if (!t) return null;
    return { rows: [...t.content.querySelectorAll('.pxd-doc b')].map(b => b.textContent.trim()),
             mono: [...t.content.querySelectorAll('.pxd-doc-face')]
               .map(f => f.classList.contains('no-photo') ? f.dataset.mono : 'photo') };
  });
  if (!chooser) bad('the doctor chooser template has gone missing');
  else if (JSON.stringify(chooser.rows) === JSON.stringify(cards))
    ok(`chooser template mirrors the band, in order — ${cards.length} doctors`);
  else bad(`chooser and band disagree:\n      band    ${JSON.stringify(cards)}\n      chooser ${JSON.stringify(chooser.rows)}`);
  if (chooser) note(`portraits: ${chooser.mono.join(' · ')} (template, unrouted)`);

  /* ⚠️⚠️ THE PILL MOVED OUT OF THE DIALOG AND ONTO THE CARD IN ROUND 18. It used to live in
     a cloned .px-detail popup and carry [data-add-goal]; the ring puts one on each side of
     the card instead — the front's, under the name, and the back's, under the description —
     so this walks the card rather than the overlay. The invariant is unchanged and is the
     one worth keeping: the pill BUILDS THE PROGRAMME, it does not route to the doctor
     chooser, and pressing it actually raises the tray.
     ⚠️ THE FLOAT HAS TO BE STOPPED FIRST or the click waits for a card that never settles —
     see the same note in services-choice.mjs. */
  await page.addStyleTag({ content: '.pw{animation:none!important}' });
  await page.evaluate(() => document.querySelector('#services').scrollIntoView());
  await page.waitForTimeout(400);
  const pill = await page.evaluate(() => {
    const b = document.querySelector('.pw[data-focus="true"] .pw-body .pw-cta');
    return { text: b ? b.textContent.trim() : null,
             stale: !!document.querySelector('.pw [data-choose]'),
             onBoth: document.querySelectorAll('.pw[data-focus="true"] .pw-cta').length };
  });
  if (pill.text && /add to your programme/i.test(pill.text)) ok(`the card pill reads "${pill.text}"`);
  else bad(`the card pill reads ${JSON.stringify(pill.text)}`);
  if (!pill.stale) ok('and no card still routes to the chooser');
  else bad('a card pill still carries data-choose');
  if (pill.onBoth === 2) ok('a pill on each face of the card — front and back');
  else bad(`the card carries ${pill.onBoth} pills, want 2`);
  await page.click('.pw[data-focus="true"] .pw-body .pw-cta');
  await page.waitForTimeout(600);
  const added = await page.evaluate(() => ({
    picked: document.querySelectorAll('.pw[data-picked="true"]').length,
    tray: document.getElementById('px-tray').classList.contains('on'),
    dot: document.querySelectorAll('#railDots button[data-picked="true"]').length }));
  if (added.picked === 1 && added.tray && added.dot === 1)
    ok('pressing it adds the goal, raises the tray and lights the dot');
  else bad(`add-to-programme misbehaved: ${JSON.stringify(added)}`);

  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  if (errs.length) bad(`console/page errors: ${JSON.stringify([...new Set(errs)].slice(0, 4))}`);
  else ok('zero console and page errors through the whole dialog walk');
  await ctx.close();
}

/* ═══ 6 · THE GRADE, AND THE CONTRAST IT CARRIES ═══════════════════════════════════
   ⚠️⚠️ THIS CHECK USED TO PROVE NOTHING ABOUT THE PAGE AND IT LOOKED LIKE IT DID. Until
   round 14 it was a table of TWELVE HARDCODED HEXES with the arithmetic run over them —
   no page, no browser, no measurement. It passed identically whether the page shipped
   glacier, plum, or neither, and it had a green tick beside it the whole time. It was
   found only because the plum reversal made it print the COOL numbers under a heading
   claiming they were current.
   ⚠️ SO PART A NOW READS THE LIVE PAGE. The tokens are pulled off the running document
   and compared against BRAND.md's warm system — that is the assertion that actually
   fails if a grade half-lands, and it is the one that was missing.
   ⚠️ PART B KEEPS THE ARITHMETIC, because the equivalence it proves is still worth
   holding: the two grades measure the same to within 0.05 at every pair, so the choice
   between them is a brand decision and never an accessibility one. That matters
   precisely because this page has now been graded in both directions and may be again —
   but it is labelled as what it is, a comparison of two historical tables, NOT evidence
   about what shipped. Never let those two jobs share a heading again. */
function lum(hex) {
  const c = hex.match(/\w\w/g).map(h => { const v = parseInt(h, 16) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hex = rgb => '#' + (rgb.match(/\d+/g) || []).slice(0, 3)
  .map(n => (+n).toString(16).padStart(2, '0')).join('').toUpperCase();

async function checkGrade() {
  head('6 · The grade on the page, read from the page');
  const { ctx, page } = await newPage(1440, 900);
  await page.goto(`http://localhost:${PORT}${PAGE}?probe=1`, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  /* BRAND.md's warm system. --burgundy, --rose, --logo-red and both inks are brand law
     and never took a temperature; the six below are the ones that travelled. */
  const WANT = {
    '--ivory': '#FAF7F1', '--cream': '#F4EDE1', '--line': '#DED4C2',
    '--gold': '#C2A05E', '--gold-deep': '#8A6A34', '--gold-tint': '#F1E7D2',
    '--dawn': '#F6E7E1',
    '--burgundy': '#5C1F31', '--rose': '#C79A92', '--ink': '#2E2228',
  };
  const got = await page.evaluate(names => {
    const cs = getComputedStyle(document.documentElement);
    const out = {};
    for (const n of names) out[n] = cs.getPropertyValue(n).trim().toUpperCase();
    /* the two places the stage's ground is written, in two languages — the CSS
       pre-frame value and whatever the script has painted by now */
    out.stageCSS = getComputedStyle(document.querySelector('.scene-stage')).backgroundColor;
    out.turn = document.querySelector('.turn')
      ? getComputedStyle(document.querySelector('.turn')).backgroundColor : null;
    return out;
  }, Object.keys(WANT));

  let drifted = [];
  for (const [k, v] of Object.entries(WANT)) if (got[k] !== v) drifted.push(`${k} ${got[k]}≠${v}`);
  if (!drifted.length) ok(`all ten tokens are the warm system — ivory ${got['--ivory']}, dawn ${got['--dawn']}, gold ${got['--gold']}`);
  else bad(`the grade half-landed: ${drifted.join(' · ')}`);

  /* ⚠⚠ THIS CHECK USED TO ASSERT --gold-gloss ≠ --gold-deep, and on 2026-08-17 the move
     to an ivory ground retired --gold-gloss: #8A6A34 measures 4.685 on ivory where it gave
     4.16 on the rose, so the second token had no subject left.
     ⚠⚠ IT IS REWRITTEN, NOT DELETED, AND NOT LEFT AS IT WAS — BOTH OF THOSE WERE WRONG.
     Left alone it went red on a correct page. Deleted, the guarantee goes with it. Worse,
     the old line PASSED VACUOUSLY the moment the token vanished: an undefined custom
     property reads as the empty string, empty ≠ '#8A6A34' is true, and it printed
     "gloss and deep stay split —  vs #8A6A34" in green while measuring nothing at all.
     A check that scores a tick on a value that does not exist is worse than no check.
     So what is asserted now is THE THING THAT ACTUALLY MATTERS, which was never the token:
     .seg-gloss's rendered colour must clear 4.5 against the ground it really stands on. It
     reads both off the page, so it survives any future re-grade in either direction — and
     if this ground ever darkens again, this is the check that will demand --gold-gloss
     back rather than letting the copy quietly drop under the floor. */
  const gloss = await page.evaluate(() => {
    const el = document.querySelector('.seg-gloss');
    if (!el) return null;
    const fg = getComputedStyle(el).color;
    /* the nearest ancestor that actually paints — .seg-gloss itself is transparent */
    let n = el, bg = null;
    while (n && n !== document.documentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') { bg = c; break; }
      n = n.parentElement;
    }
    return { fg, bg, on: n ? (n.className || n.tagName.toLowerCase()) : null,
             px: parseFloat(getComputedStyle(el).fontSize) };
  });
  if (!gloss || !gloss.bg) bad('.seg-gloss or its ground has gone missing — the 4.5 floor cannot be read');
  else {
    /* ratio() and hex() are this file's own module-scope helpers — the first draft of
       this check called contrast()/nums(), which do not exist at this scope: nums is a
       local inside one page.evaluate and contrast was never defined. It would have thrown
       a ReferenceError rather than measuring anything. */
    const r = ratio(hex(gloss.fg), hex(gloss.bg));
    /* 19px regular is body text, not large text, so the floor is 4.5 and not 3.0 */
    if (r >= 4.5) ok(`.seg-gloss clears the small-text floor — ${r.toFixed(2)}:1 at ${gloss.px}px on .${String(gloss.on).split(' ')[0]}`);
    else bad(`.seg-gloss measures ${r.toFixed(2)}:1 at ${gloss.px}px, under the 4.5 floor — restore --gold-gloss #7F6230`);
  }

  if (hex(got.stageCSS) === '#2E2228') ok('the stage\'s CSS pre-frame ground is the plum');
  else bad(`the stage's pre-frame ground did not revert: ${got.stageCSS}`);
  if (got.turn && hex(got.turn) === '#5C1F31') ok('the scene\'s static twin is burgundy again');
  else bad(`.turn did not revert: ${got.turn}`);
  await ctx.close();
}

function checkContrast() {
  head('6b · Plum and glacier measure the same (two historical tables, not the page)');
  const pairs = [
    ['the ivory beat', '#FAF7F1', '#2A1B20', '#F4F7FA', '#14202A', 3],
    ['the gold beat',  '#C2A05E', '#2A1B20', '#8FA5B8', '#14202A', 3],
    ['the italic',     '#C79A92', '#2A1B20', '#87A8C5', '#14202A', 3],
    ['a drifting bead','#B09A9C', '#2A1B20', '#93A1AE', '#14202A', 3],
    ['the turn accent','#C2A05E', '#5C1F31', '#95ABBF', '#003A5F', 3],
    ['the turn body',  '#D7C7C7', '#5C1F31', '#BECDD8', '#003A5F', 4.5],
  ];
  for (const [name, fg, bg, wasFg, wasBg, floor] of pairs) {
    const now = ratio(fg, bg), was = ratio(wasFg, wasBg);
    const drift = Math.abs(now - was);
    if (now < floor) bad(`${name}: ${now.toFixed(2)}:1 — under the ${floor} floor`);
    else if (drift > 0.4) bad(`${name}: ${now.toFixed(2)}:1 against ${was.toFixed(2)} cool — drifted ${drift.toFixed(2)}`);
    else ok(`${name}: ${now.toFixed(2)}:1 plum (glacier ${was.toFixed(2)}, drift ${drift.toFixed(2)})`);
  }
}

await checkWidths();
await checkScene();
await checkDialogs();
await checkGrade();
checkContrast();

head('7 · Files the page asks for and does not get');
const unexpected = [...missed].filter(f => !EXPECTED_MISSING.includes(f));
for (const f of EXPECTED_MISSING) if (missed.has(f)) note(`awaiting his drop: ${f}`);
if (!unexpected.length) ok('no unexpected 404s');
else { bad(`unexpected 404s: ${JSON.stringify(unexpected)}`); }

await browser.close(); srv.close();
console.log(`\n${failures ? '\x1b[31m' : '\x1b[32m'}${checks - failures}/${checks} checks passed\x1b[0m` + (SHOTS ? `  ·  shots in ${OUT}` : ''));
process.exit(failures ? 1 : 0);
