/* ══ THE RETURNING-PATIENT BAND — the quiet line under the flower ══════════════
   The band added 2026-08-29: eyebrow, heading, two outlined actions, on all four
   carriers of the flower. This harness is the gate for the two things that are
   easy to break and invisible when they are — THE FLOWER'S COUNT (six petals,
   six seats; the band must never become a seventh) and THE FOLD (the band must
   not be in the frame while the flower is).

   ⚠️ RUN ALONE — SwiftShader rule, tools/qa/README.md. Every check below failed
   on purpose once before it was trusted (§3's fold check by shortening the
   margin, §5's overflow by putting the two actions side by side at 320).

   node tools/qa/returning-band.mjs            checks only
   node tools/qa/returning-band.mjs --shots    also writes shots to /tmp/rb-qa/ */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHOTS = process.argv.includes('--shots');
const OUT = '/tmp/rb-qa/';
if (SHOTS) mkdirSync(OUT, { recursive: true });

const PAGES = ['hormone-therapy-bhrt', 'modern-menopause', 'testosterone-top-up', 'programs'];
const MIME = { html:'text/html', js:'text/javascript', mjs:'text/javascript', css:'text/css',
  png:'image/png', webp:'image/webp', avif:'image/avif', svg:'image/svg+xml', woff2:'font/woff2', ico:'image/x-icon' };
const srv = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(f).slice(1)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
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
/* ⚠️ THE DOORS PULL GSAP AND LENIS FROM jsdelivr, AND A SANDBOX HAS NO ROUTE TO IT.
   Left alone the three doors load without their motion libraries, every [data-reveal]
   stays where the no-JS rule put it, and the console fills with tunnel failures that
   look like a page bug. doors-shots.mjs solves it by serving the two from node_modules;
   this does the same, so what is measured here is the page a visitor gets. */
function findNM() {
  for (const t of [path.join(ROOT, 'node_modules'), process.env.QA_NODE_MODULES].filter(Boolean))
    if (existsSync(path.join(t, 'gsap', 'dist', 'gsap.min.js'))) return t;
  return null;
}
const NM = findNM();
if (!NM) { console.log('! gsap/lenis not found — npm install gsap@3.13.0 lenis@1.3.4'); process.exit(1); }
const MAP = [
  [/gsap@3\.13\.0\/dist\/gsap\.min\.js/, path.join(NM, 'gsap/dist/gsap.min.js')],
  [/ScrollTrigger\.min\.js/,             path.join(NM, 'gsap/dist/ScrollTrigger.min.js')],
  [/SplitText\.min\.js/,                 path.join(NM, 'gsap/dist/SplitText.min.js')],
  [/lenis@1\.3\.4\/dist\/lenis\.min\.js/, path.join(NM, 'lenis/dist/lenis.min.js')],
];
await new Promise(r => srv.listen(0, r));
const BASE = `http://localhost:${srv.address().port}`;
const browser = await chromium.launch({ executablePath: findChromium() });
async function open(opts = {}) {
  const ctx = await browser.newContext(opts);
  await ctx.route('**/cdn.jsdelivr.net/**', route => {
    const u = route.request().url();
    for (const [re, fp] of MAP) if (re.test(u)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: readFileSync(fp) });
    return route.abort();
  });
  return ctx.newPage();
}
let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) fail++; };
const sum = (p, b) => execSync(
  `sed -n "/${b}:START/,/${b}:END/p" ${path.join(ROOT, p, 'index.html')} | md5sum | cut -c1-12`
).toString().trim();

/* ── 0 · parity. The band has its OWN markers and must not have moved the flower's ── */
{
  console.log('0 · parity, four carriers');
  /* ⚠️ THESE THREE ARE THE SHIPPED PS SUMS AND THEY ARE PINNED, not merely compared to
     each other: the band lives outside the PS markers precisely so it cannot move them,
     and four matching rows of the WRONG sum would pass a compare-only check. */
  const PS_PINNED = { CSS:['4d192d81e3e8'], HTML:['95463c5391ea'],
                      JS:['d2ee51cad3aa','ab64ee862292'] };  /* the men's one-comment drift, 2026-08-24g */
  for (const b of ['CSS','HTML','JS']) {
    const rows = PAGES.map(p => `${p}:${sum(p, 'PS:' + b)}`);
    const bad = PAGES.filter(p => !PS_PINNED[b].includes(sum(p, 'PS:' + b)));
    ok(bad.length === 0, `PS:${b} untouched by the band — ${rows.join('  ')}`);
  }
  for (const b of ['CSS','HTML']) {
    const s = new Set(PAGES.map(p => sum(p, 'RB:' + b)));
    ok(s.size === 1, `RB:${b} ${s.size === 1 ? 'aligned' : 'DRIFTED'} — ${[...s].join(' ')}`);
  }
  /* ⚠️ NEVER 100vh. The band is content height; a viewport unit on its height is the
     "second hero" this block exists not to be. The margin's 21vh is separation, not
     height, so the check reads height declarations only. */
  const css = readFileSync(path.join(ROOT, 'programs', 'index.html'), 'utf8')
    .split('RB:CSS:START')[1].split('RB:CSS:END')[0];
  ok(!/(^|[;{\s])(min-|max-)?height\s*:[^;}]*\b\d[\d.]*(vh|svh|dvh|lvh)/.test(css),
    'no viewport unit on any height in the band');
}

/* ── 1 · the four pages load clean and carry the band exactly once ── */
{
  console.log('1 · present, once, on all four');
  for (const p of PAGES) {
    const page = await open({ viewport: { width: 1440, height: 900 } });
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(`${BASE}/${p}/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => ({
      bands: document.querySelectorAll('.rb').length,
      acts: document.querySelectorAll('.rb-act').length,
      eyebrow: document.querySelector('.rb-eyebrow')?.textContent.trim(),
      head: document.querySelector('.rb-head')?.textContent.trim(),
      labels: [...document.querySelectorAll('.rb-lbl')].map(e => e.textContent.trim()),
      /* the band must be a SIBLING AFTER the flower, never inside it and never a petal */
      insidePs: !!document.querySelector('.ps .rb'),
      insidePetal: !!document.querySelector('.ps-arm .rb, .ps-petal .rb, .ps-card .rb'),
      afterPs: !!(document.querySelector('.ps').compareDocumentPosition(document.querySelector('.rb'))
                  & Node.DOCUMENT_POSITION_FOLLOWING),
      upper: getComputedStyle(document.querySelector('.rb-eyebrow')).textTransform,
    }));
    ok(errs.length === 0, `${p}: no console errors${errs.length ? ' — ' + errs.join(' | ').slice(0,160) : ''}`);
    ok(r.bands === 1 && r.acts === 2, `${p}: one band, two actions — ${r.bands}/${r.acts}`);
    ok(r.eyebrow === 'Already a patient?' && r.upper === 'uppercase',
      `${p}: eyebrow "${r.eyebrow}" (uppercased by CSS)`);
    ok(r.head === 'Continue your care', `${p}: heading "${r.head}"`);
    ok(r.labels.join(' · ') === 'Book a follow-up · Repeat prescription',
      `${p}: labels — ${r.labels.join(' · ')}`);
    ok(!r.insidePs && !r.insidePetal && r.afterPs,
      `${p}: outside the flower, after it in the document`);
    await page.close();
  }
}

/* ── 2 · the flower is UNCHANGED: six petals, six seats, 01–06 ── */
{
  console.log('2 · the flower still counts six');
  for (const p of PAGES) {
    const page = await open({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/${p}/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({
      arms: document.querySelectorAll('.ps-arm').length,
      slots: [...new Set([...document.querySelectorAll('.ps-arm')].map(a => a.dataset.slot))].sort().join(''),
      dots: [...document.querySelectorAll('.ps-dot')].map(d => d.textContent.trim()).join(' '),
      /* ⚠️ NOT querySelectorAll('.pg-steps li') — NEXT_ITERATIONS §3 records that exact
         dead selector returning 0 and staying green for weeks. Once JS runs the flower's
         rollback list is the <noscript>'s single TEXT node, so it is counted as text. */
      rollback: (([...document.querySelectorAll('noscript')]
        .map(n => n.textContent).find(t => t.includes('pg-steps')) || '').match(/<li>/g) || []).length,
    }));
    ok(r.arms === 6 && r.slots === '012345', `${p}: six petals, six seats — ${r.arms} / ${r.slots}`);
    ok(r.dots === '01 02 03 04 05 06', `${p}: six numbered steps — ${r.dots}`);
    ok(r.rollback === 6, `${p}: <noscript> rollback still six — ${r.rollback}`);
    await page.close();
  }
}

/* ── 3 · DESKTOP: ~184px of band, and NOT IN THE FLOWER'S FRAME ──────────────────
   The fold check is the one that matters. `.ps` is scrolled to the top of the
   viewport — the strictest framing a reader can give the flower — and nothing of
   the band may be above the fold. */
{
  console.log('3 · desktop: height, fold, no overlap');
  for (const [w, h] of [[1440, 900], [1920, 1080], [1280, 800]]) {
    const page = await open({ viewport: { width: w, height: h } });
    await page.goto(`${BASE}/hormone-therapy-bhrt/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const r = await page.evaluate(() => {
      const rb = document.querySelector('.rb'), ps = document.querySelector('.ps');
      const cs = getComputedStyle(rb);
      ps.scrollIntoView({ block: 'start' });          /* flower's top at the fold's top */
      const psTop = ps.getBoundingClientRect().top;
      return {
        bandH: Math.round(rb.getBoundingClientRect().height),
        pos: cs.position,
        actH: Math.round(document.querySelector('.rb-act').getBoundingClientRect().height),
        cols: cs.getPropertyValue('--x') || getComputedStyle(document.querySelector('.rb-actions')).gridTemplateColumns,
        /* with the flower pinned to the fold's top, where does the band start? */
        rbTopFromFold: Math.round(rb.getBoundingClientRect().top - psTop),
        gapBelowFlower: Math.round(rb.getBoundingClientRect().top - ps.getBoundingClientRect().bottom),
        vh: window.innerHeight,
      };
    });
    const twoCols = r.cols.trim().split(/\s+/).length === 2;
    const eq = twoCols && (() => { const [a, b] = r.cols.trim().split(/\s+/).map(parseFloat); return Math.abs(a - b) < 1; })();
    ok(Math.abs(r.bandH - 184) <= 14, `${w}×${h}: band ${r.bandH}px (target ~184)`);
    ok(r.bandH < r.vh * 0.45, `${w}×${h}: content height, not a viewport — ${r.bandH} < ${Math.round(r.vh * .45)}`);
    ok(r.pos === 'static', `${w}×${h}: static — not sticky, fixed or floating (${r.pos})`);
    ok(twoCols && eq, `${w}×${h}: two equal columns — ${r.cols}`);
    ok(r.actH >= 52, `${w}×${h}: action ${r.actH}px`);
    ok(r.gapBelowFlower > 0, `${w}×${h}: no overlap with the flower — ${r.gapBelowFlower}px clear`);
    ok(r.rbTopFromFold >= r.vh, `${w}×${h}: FOLD — band starts ${r.rbTopFromFold}px below the flower's top, viewport is ${r.vh}`);
    if (SHOTS) {
      await page.evaluate(() => document.querySelector('.ps').scrollIntoView({ block: 'start' }));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}flower-frame-${w}x${h}.png` });
      await page.evaluate(() => document.querySelector('.rb').scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}band-${w}x${h}.png` });
    }
    await page.close();
  }
}

/* ── 4 · PHONE: ~228px, one column, 8px apart, 52px of target ── */
{
  console.log('4 · phone: stacked, 8px, 52px');
  for (const [w, h] of [[390, 844], [430, 932], [360, 800]]) {
    const page = await open({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
    await page.goto(`${BASE}/modern-menopause/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const r = await page.evaluate(() => {
      const rb = document.querySelector('.rb'), ps = document.querySelector('.ps');
      const acts = [...document.querySelectorAll('.rb-act')].map(a => a.getBoundingClientRect());
      return {
        bandH: Math.round(rb.getBoundingClientRect().height),
        rows: new Set(acts.map(a => Math.round(a.x))).size,
        gap: Math.round(acts[1].top - acts[0].bottom),
        minAct: Math.round(Math.min(...acts.map(a => a.height))),
        psH: Math.round(ps.getBoundingClientRect().height),
        vh: window.innerHeight,
        /* the flower chapter is taller than the phone's viewport, so the band is
           below the fold on its own — assert that rather than assume it */
        rbTopFromPsTop: Math.round(rb.getBoundingClientRect().top - ps.getBoundingClientRect().top),
      };
    });
    ok(Math.abs(r.bandH - 228) <= 18, `${w}×${h}: band ${r.bandH}px (target ~228)`);
    ok(r.rows === 1, `${w}×${h}: one vertical stack (${r.rows} column${r.rows === 1 ? '' : 's'})`);
    ok(r.gap === 8, `${w}×${h}: 8px gap — ${r.gap}px`);
    ok(r.minAct >= 52, `${w}×${h}: every action ≥52px — ${r.minAct}px`);
    ok(r.rbTopFromPsTop >= r.vh, `${w}×${h}: FOLD — the whole flower journey comes first (${r.rbTopFromPsTop} ≥ ${r.vh})`);
    if (SHOTS) {
      await page.evaluate(() => document.querySelector('.rb').scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}band-${w}x${h}.png` });
    }
    await page.close();
  }
}

/* ── 5 · 320px: readable, tappable, and NOTHING sideways ── */
{
  console.log('5 · 320px');
  for (const p of PAGES) {
    const page = await open({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true });
    await page.goto(`${BASE}/${p}/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      const rb = document.querySelector('.rb');
      const acts = [...document.querySelectorAll('.rb-act')];
      return {
        docOver: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        bandOver: Math.round(Math.max(0, rb.getBoundingClientRect().right - document.documentElement.clientWidth)),
        minAct: Math.round(Math.min(...acts.map(a => a.getBoundingClientRect().height))),
        /* a label that overruns its own box is the truncation this width exists to find */
        clipped: acts.map(a => a.querySelector('.rb-lbl'))
                     .some(l => l.scrollWidth > l.clientWidth + 1),
        arrowsRight: acts.every(a => {
          const box = a.getBoundingClientRect(), arr = a.querySelector('.rb-arr').getBoundingClientRect();
          return box.right - arr.right < 24 && arr.left > a.querySelector('.rb-lbl').getBoundingClientRect().right - 1;
        }),
      };
    });
    ok(r.docOver <= 0, `${p}: no sideways scroll${r.docOver > 0 ? ` (+${r.docOver}px)` : ''}`);
    ok(r.bandOver === 0, `${p}: the band itself stays inside the viewport`);
    ok(r.minAct >= 52, `${p}: actions ${r.minAct}px`);
    ok(!r.clipped, `${p}: both labels fully readable`);
    ok(r.arrowsRight, `${p}: arrows right-aligned, clear of the label`);
    await page.close();
  }
  if (SHOTS) {
    const page = await open({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true });
    await page.goto(`${BASE}/programs/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await page.evaluate(() => document.querySelector('.rb').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}band-320.png` });
    await page.close();
  }
}

/* ── 6 · the destinations are real, and they are the estate's own ── */
{
  console.log('6 · destinations');
  for (const p of PAGES) {
    const page = await open({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/${p}/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const [a, b] = document.querySelectorAll('.rb-act');
      const hash = a.getAttribute('href');
      /* the WhatsApp number must be the SAME line the rest of the page dials */
      const foot = document.querySelector('.f-social a[href*="api.whatsapp.com"]')?.href || '';
      const num = h => (h.match(/phone=(\d+)/) || [])[1];
      return {
        aHref: hash,
        aTargetExists: !!document.querySelector(hash),
        bHref: b.getAttribute('href'),
        sameNumber: num(b.href) && num(b.href) === num(foot),
        bRel: b.getAttribute('rel'), bTarget: b.getAttribute('target'),
        /* no gate, no dialog: two plain anchors */
        anchors: [a.tagName, b.tagName].join('/'),
        noDialog: !document.querySelector('.rb [data-book], .rb button, .rb dialog'),
      };
    });
    ok(r.aHref === '#book' && r.aTargetExists, `${p}: follow-up → ${r.aHref} (target present)`);
    ok(/^https:\/\/api\.whatsapp\.com\/send\/\?phone=\d+&text=.+repeat%20prescription/.test(r.bHref) && r.sameNumber,
      `${p}: repeat prescription → the clinic's own WhatsApp line`);
    ok(r.bTarget === '_blank' && r.bRel === 'noopener', `${p}: new tab, rel=noopener`);
    ok(r.anchors === 'A/A' && r.noDialog, `${p}: two direct links — no intermediate gate`);
    await page.close();
  }
}

/* ── 7 · states: focus is visible, and NOTHING MOVES in any of them ── */
{
  console.log('7 · hover / focus / press keep the box');
  const page = await open({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/programs/?probe=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.evaluate(() => document.querySelector('.rb').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(300);
  /* ⚠️ DOCUMENT-RELATIVE, NOT VIEWPORT-RELATIVE. page.hover() scrolls the element into
     view, so a getBoundingClientRect() comparison reports the SCROLL as a layout shift and
     fails on a page that never moved — it did, on the first run of this file. offsetLeft/
     offsetTop are measured from the offset parent and do not care where the page is. */
  const box = s => page.evaluate(sel => {
    const e = document.querySelector(sel);
    let x = 0, y = 0;
    for (let n = e; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return [x, y, e.offsetWidth, e.offsetHeight].join(',');
  }, s);

  const rest = await box('.rb-act');
  const restBand = await box('.rb');
  await page.hover('.rb-act');
  await page.waitForTimeout(420);
  const hov = await box('.rb-act');
  const hovBand = await box('.rb');
  const hoverPaint = await page.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('.rb-act'));
    return { bg: cs.backgroundColor, bc: cs.borderTopColor, bw: cs.borderTopWidth };
  });
  ok(rest === hov && restBand === hovBand, `hover moves nothing — ${rest}`);
  ok(hoverPaint.bw === '1px', `hover keeps the 1px hairline — ${hoverPaint.bw}`);

  /* keyboard focus. Tab from the link before it so :focus-visible is genuine. */
  const foc = await page.evaluate(async () => {
    const a = document.querySelector('.rb-act');
    a.focus();
    const cs = getComputedStyle(a);
    return {
      visible: a.matches(':focus-visible'),
      outlineW: parseFloat(cs.outlineWidth), outlineStyle: cs.outlineStyle, outlineColor: cs.outlineColor,
      box: (() => { let x = 0, y = 0; for (let n = a; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; } 
                    return [x, y, a.offsetWidth, a.offsetHeight].join(','); })(),
      isLink: a.tagName === 'A' && !!a.getAttribute('href'),
      name: a.textContent.replace(/\s+/g, ' ').trim(),
    };
  });
  ok(foc.visible && foc.outlineW >= 2 && foc.outlineStyle !== 'none',
    `focus-visible ring — ${foc.outlineW}px ${foc.outlineStyle} ${foc.outlineColor}`);
  ok(foc.box === rest, `focus moves nothing — ${foc.box}`);
  ok(foc.isLink && foc.name === 'Book a follow-up', `semantic link, accessible name "${foc.name}"`);

  /* the tab order: the two actions are reachable and in reading order */
  const order = await page.evaluate(() => {
    const all = [...document.querySelectorAll('a[href],button:not([disabled])')]
      .filter(e => e.offsetParent !== null);
    const i = all.indexOf(document.querySelectorAll('.rb-act')[0]);
    const j = all.indexOf(document.querySelectorAll('.rb-act')[1]);
    return { i, j, seq: j === i + 1 };
  });
  ok(order.i > -1 && order.seq, 'both actions in the tab order, one after the other');

  /* pressed: colour only */
  await page.mouse.move(0, 0);
  const press = await page.evaluate(() => {
    const a = document.querySelector('.rb-act');
    const before = getComputedStyle(a).backgroundColor;
    /* :active cannot be forced from script — assert the RULE exists and changes paint only */
    const rules = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch { return []; } });
    const act = rules.find(r => r.selectorText === '.rb-act:active');
    return { before, has: !!act, text: act ? act.style.cssText : '' };
  });
  ok(press.has && /^background(-color)?:/.test(press.text.trim()) && !/padding|border-width|margin|font-size/.test(press.text),
    `pressed changes paint only — ${press.text.trim()}`);
  await page.close();
}

/* ── 8 · the LOADING state: fonts not there yet, box the same size ──────────────
   "Preserve layout dimensions across hover, focus, pressed and loading" — the only
   loading a static band has is its own webfonts arriving. The label swaps from the
   fallback's metrics to MediGyn NOW's, which changes the WORD's width; the box must
   not follow it. It does not, and the reason is structural: the arrow is pushed by
   margin-left:auto rather than sized by content, and the height is a min-height. This
   check blocks every woff2 and proves it rather than assuming it. */
{
  console.log('8 · loading: no shift while the fonts are still coming');
  for (const [w, h, want] of [[1440, 900, 56], [320, 640, 52]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
    await ctx.route('**/*.woff2', r => r.abort());
    await ctx.route('**/cdn.jsdelivr.net/**', route => {
      const u = route.request().url();
      for (const [re, fp] of MAP) if (re.test(u)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: readFileSync(fp) });
      return route.abort();
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/programs/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => {
      const acts = [...document.querySelectorAll('.rb-act')];
      return {
        heights: acts.map(a => Math.round(a.getBoundingClientRect().height)),
        widths: [...new Set(acts.map(a => Math.round(a.getBoundingClientRect().width)))],
        over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        clipped: acts.map(a => a.querySelector('.rb-lbl')).some(l => l.scrollWidth > l.clientWidth + 1),
        arrowsRight: acts.every(a => a.getBoundingClientRect().right - a.querySelector('.rb-arr').getBoundingClientRect().right < 24),
      };
    });
    ok(r.heights.every(x => x === want), `${w}px: actions still ${want}px unstyled-font — ${r.heights.join('/')}`);
    ok(r.widths.length === 1, `${w}px: both actions still the same width — ${r.widths.join('/')}`);
    ok(r.over <= 0 && !r.clipped && r.arrowsRight, `${w}px: no overflow, no truncation, arrows still right`);
    await page.close(); await ctx.close();
  }
}

/* ── 9 · no JS: the band is not the flower's dependant ──────────────────────────
   `.ps` is display:none until the script reveals it, and the six steps fall back to the
   <noscript> list. The band is plain markup with no script of its own and must stand in
   BOTH worlds — it is the returning patient's shortcut, and she is the reader least
   likely to be indulged by a page that needs WebGL to show her a link. */
{
  console.log('9 · JavaScript off');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/hormone-therapy-bhrt/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const rb = document.querySelector('.rb');
    const acts = [...document.querySelectorAll('.rb-act')];
    return {
      shown: !!rb && getComputedStyle(rb).display !== 'none' && rb.getBoundingClientRect().height > 100,
      h: Math.round(rb.getBoundingClientRect().height),
      hrefs: acts.map(a => a.getAttribute('href')),
      flowerHidden: getComputedStyle(document.querySelector('.ps')).display === 'none',
      rollback: document.querySelectorAll('.pg-steps li').length,   /* real elements with JS off */
      over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  ok(r.shown, `the band stands without JS — ${r.h}px`);
  ok(r.hrefs[0] === '#book' && /whatsapp/.test(r.hrefs[1]), 'both destinations intact');
  ok(r.flowerHidden && r.rollback === 6, `the flower falls back to its six-item list — ${r.rollback}`);
  ok(r.over <= 0, 'no sideways scroll');
  await page.close(); await ctx.close();
}

console.log(fail ? `\n${fail} FAILED` : '\nall green');
await browser.close();
srv.close();
process.exit(fail ? 1 : 0);
