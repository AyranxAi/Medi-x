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
import sharp from 'sharp';
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
  /* ⚠️ MOVED 2026-08-29c and both moves are recorded: PS:CSS took the correction to the
     phone-crop claim (comment only), PS:JS took the slab token reader (behaviour, but
     identical on all four). The men's door still carries its extra 2026-08-24g comment,
     which is why JS has two legal sums and CSS has one. */
  const PS_PINNED = { CSS:['d26faf55bae9'], HTML:['95463c5391ea'],
                      JS:['c9d5a3e2365d','c288ab493d44'] };
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
    ok(Math.abs(r.bandH - 232) <= 14, `${w}×${h}: band ${r.bandH}px (target ~232)`);
    ok(r.bandH < r.vh * 0.45, `${w}×${h}: content height, not a viewport — ${r.bandH} < ${Math.round(r.vh * .45)}`);
    ok(r.pos === 'static', `${w}×${h}: static — not sticky, fixed or floating (${r.pos})`);
    ok(twoCols && eq, `${w}×${h}: two equal columns — ${r.cols}`);
    ok(r.actH >= 72, `${w}×${h}: action ${r.actH}px (≥72)`);
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
    ok(Math.abs(r.bandH - 270) <= 18, `${w}×${h}: band ${r.bandH}px (target ~270)`);
    ok(r.rows === 1, `${w}×${h}: one vertical stack (${r.rows} column${r.rows === 1 ? '' : 's'})`);
    ok(r.gap === 8, `${w}×${h}: 8px gap — ${r.gap}px`);
    ok(r.minAct >= 64, `${w}×${h}: every action ≥64px — ${r.minAct}px`);
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
          return box.right - arr.right <= 26 && arr.left > a.querySelector('.rb-lbl').getBoundingClientRect().right - 1;
        }),
      };
    });
    ok(r.docOver <= 0, `${p}: no sideways scroll${r.docOver > 0 ? ` (+${r.docOver}px)` : ''}`);
    ok(r.bandOver === 0, `${p}: the band itself stays inside the viewport`);
    ok(r.minAct >= 64, `${p}: actions ${r.minAct}px (≥64, and never under the 52 floor)`);
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

/* ── 7b · THE ORB: each door's strip wears its own ground, from ONE shared line ────
   `var(--door-tint,var(--gold-tint))` has to resolve to FOUR pages' worth of colour out
   of a block that is byte-identical on all four. This asserts the resolution AND the
   contrast arithmetic that came with it — the rule --gold-gloss's token block states
   ("it is a function of the ground") means a ground change is a re-measurement, and a
   silent contrast failure is exactly what that note exists to prevent. */
{
  console.log('7b · the orb: per-door ground, measured');
  /* the four grounds this strip stands on, and the eyebrow each one resolves */
  const WANT = {
    'hormone-therapy-bhrt': { bg: 'rgb(242, 225, 226)', eye: 'rgb(92, 31, 49)'  },  /* burgundy */
    'modern-menopause':     { bg: 'rgb(249, 228, 222)', eye: 'rgb(140, 81, 72)' },  /* rose */
    'testosterone-top-up':  { bg: 'rgb(241, 231, 210)', eye: 'rgb(127, 98, 48)' },  /* gold, no --door */
    'programs':             { bg: 'rgb(241, 231, 210)', eye: 'rgb(127, 98, 48)' },
  };
  const lin = c => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
  const lum = rgb => { const [r, g, b] = rgb.match(/\d+/g).map(Number); return .2126*lin(r) + .7152*lin(g) + .0722*lin(b); };
  const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const seen = new Set();
  for (const p of PAGES) {
    const page = await open({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/${p}/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const rb = document.querySelector('.rb'), eb = document.querySelector('.rb-eyebrow');
      const act = document.querySelector('.rb-act'), lbl = document.querySelector('.rb-lbl');
      /* the button fill is translucent — composite it over the strip's ground by hand,
         because getComputedStyle hands back the rgba, not what the eye receives */
      const bg = getComputedStyle(rb).backgroundColor;
      const raw = getComputedStyle(act).backgroundColor.match(/[\d.]+/g).map(Number);
      const g = bg.match(/\d+/g).map(Number);
      const a = raw.length > 3 ? raw[3] : 1;
      const fill = `rgb(${raw.slice(0,3).map((v,i) => Math.round(v*a + g[i]*(1-a))).join(', ')})`;
      return {
        bg, fill,
        eye: getComputedStyle(eb).color,
        head: getComputedStyle(document.querySelector('.rb-head')).color,
        lbl: getComputedStyle(lbl).color,
        /* the strip must run the full width — the colour is what separates it */
        bleed: Math.round(rb.getBoundingClientRect().width) >= document.documentElement.clientWidth,
        bandW: Math.round(rb.getBoundingClientRect().width),
        vw: document.documentElement.clientWidth,
        gridDelta: Math.round(document.querySelector('.rb-inner').getBoundingClientRect().left
                            - document.querySelector('.ps-ed').getBoundingClientRect().left),
        /* ...while the copy stays on the content grid.
           ⚠️ NOT against .wrap's own rect — that is its BORDER box, and --pad sits inside
           it, so the comparison is off by up to 72px and fails on a page that is aligned.
           .ps-ed is the flower's editorial column, the first thing inside the same wrap's
           padding, which is the edge the strip actually has to line up with. */
        onGrid: Math.abs(document.querySelector('.rb-inner').getBoundingClientRect().left
                       - document.querySelector('.ps-ed').getBoundingClientRect().left) <= 1,
        /* the flower's own ground must NOT have moved */
        chapter: getComputedStyle(document.querySelector('.programme')).backgroundColor,
      };
    });
    const w = WANT[p];
    ok(r.bg === w.bg, `${p}: ground ${r.bg} — the orb's own tint`);
    ok(r.eye === w.eye, `${p}: eyebrow ${r.eye}`);
    ok(r.chapter === 'rgb(240, 235, 231)', `${p}: the flower's chapter ground is untouched — ${r.chapter}`);
    ok(r.bleed, `${p}: the colour runs full bleed — ${r.bandW}px of ${r.vw}`);
    ok(r.onGrid, `${p}: the copy stays on the content grid (${r.gridDelta}px off the flower's column)`);
    /* the arithmetic, re-derived from the pixels rather than trusted from the comment */
    const eyeC = cr(r.eye, r.bg), headC = cr(r.head, r.bg), lblC = cr(r.lbl, r.fill);
    ok(eyeC >= 4.5, `${p}: eyebrow contrast ${eyeC.toFixed(3)} ≥ 4.5`);
    ok(headC >= 3.0, `${p}: heading contrast ${headC.toFixed(3)} ≥ 3.0`);
    ok(lblC >= 4.5, `${p}: label on fill ${lblC.toFixed(3)} ≥ 4.5`);
    seen.add(r.bg);
    await page.close();
  }
  /* three distinct grounds across four pages — the gold door and /programs/ share one */
  ok(seen.size === 3, `three distinct grounds across the four carriers — ${seen.size}`);
}

/* ── 7c · THE PETAL SLAB wears the orb too — from tokens, not from a forked script ──
   PS:JS is byte-identical on four pages, so the slab colour is read from each page's
   :root. This asserts what each page actually PAINTS, sampled off the rendered canvas —
   the spec hex is not the answer, because the scene's lighting lifts and desaturates it
   (that gap is the whole reason the first attempt at this was invisible). */
{
  console.log('7c · the slab: per-door, sampled off the render');
  const WANT = {                       /* spec, and the rendered slab it must produce */
    'hormone-therapy-bhrt': { spec: null,      rend: [95, 61, 67]  },  /* no tokens → shipped burgundy */
    'modern-menopause':     { spec: '#A1213B', rend: [169, 64, 79] },  /* rose-bolder */
    'testosterone-top-up':  { spec: '#9F7123', rend: [167, 123, 64] }, /* gold-bolder */
    'programs':             { spec: '#9F7123', rend: [167, 123, 64] },
  };
  const lum = (r, g, b) => .2126*r + .7152*g + .0722*b;
  const seen = [];
  for (const p of PAGES) {
    const page = await open({ viewport: { width: 1200, height: 820 }, deviceScaleFactor: 2 });
    await page.goto(`${BASE}/${p}/?probe=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2200);
    const tok = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return { slab: cs.getPropertyValue('--ps-slab').trim() || null,
               gl: !!document.querySelector('.ps.ps-3d') };
    });
    ok(tok.slab === WANT[p].spec, `${p}: --ps-slab ${tok.slab || '(none — falls back to burgundy)'}`);
    /* sample the slab off the plate's right shoulder, darkest 12% of the window */
    /* ⚠️ STOP LENIS, SCROLL INSTANTLY, THEN MEASURE IN A SEPARATE PASS. This is the
       third attempt and the first two are worth recording. scrollIntoView alone left the
       window off the bottom on /programs/ (Playwright rejects an out-of-frame clip
       outright). Clamping the window stopped the crash and quietly slid the sample onto
       the plate's ivory — a wrong answer instead of an error. The real cause is Lenis:
       its smooth scroll is still animating when the rect is read, so the measurement
       describes a page that has already moved. Stop it, jump, settle, then measure. */
    await page.evaluate(() => {
      if (window.__lenis) window.__lenis.stop();
      const pl = document.querySelector('.ps-arm[data-slot="0"] .ps-petal');
      const r = pl.getBoundingClientRect();
      window.scrollTo(0, r.top + window.scrollY - (window.innerHeight - r.height) / 2);
    });
    await page.waitForTimeout(900);
    const clip = await page.evaluate(() => {
      const r = document.querySelector('.ps-arm[data-slot="0"] .ps-petal').getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top < 0 || r.bottom > vh) throw new Error('plate not fully in frame: ' + JSON.stringify([r.top, r.bottom, vh]));
      return { x: Math.round(r.right - 40), y: Math.round(r.top + r.height * 0.28), width: 70, height: 200 };
    });
    await page.waitForTimeout(600);
    const shot = await page.screenshot({ clip });
    const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
    const px = [];
    for (let i = 0; i < data.length; i += info.channels) px.push([data[i], data[i+1], data[i+2]]);
    px.sort((a, b) => lum(...a) - lum(...b));
    const n = Math.max(1, Math.floor(px.length * 0.12));
    const avg = px.slice(0, n).reduce((a, q) => [a[0]+q[0]/n, a[1]+q[1]/n, a[2]+q[2]/n], [0,0,0]).map(Math.round);
    /* ⚠️ THE SAMPLE MUST HAVE SEEN THE SLAB. The slab is far darker than everything
       around it; if the darkest 12% of the window is not actually dark, the window
       missed and any colour it reports is fiction. This is the check that would have
       caught the clamped-window bug instead of letting it report the plate. */
    const w = WANT[p].rend;
    ok(lum(...avg) < 150, `${p}: the window actually found the slab (lum ${Math.round(lum(...avg))} < 150)`);
    const d = Math.round(Math.hypot(avg[0]-w[0], avg[1]-w[1], avg[2]-w[2]));
    ok(d <= 14, `${p}: paints rgb(${avg.join(',')}), expected rgb(${w.join(',')}) — off by ${d}`);
    seen.push(avg);
    await page.close();
  }
  /* ⚠️ THE POINT OF THE WHOLE ROUND: the doors must be TELLABLE APART on the page. The
     first attempt passed every spec check and failed this one at 8 of 255. */
  const sep = (a, b) => Math.round(Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]));
  ok(sep(seen[0], seen[1]) >= 30, `burgundy vs rose separate by ${sep(seen[0], seen[1])} (need ≥30)`);
  ok(sep(seen[0], seen[2]) >= 30, `burgundy vs gold separate by ${sep(seen[0], seen[2])} (need ≥30)`);
  ok(sep(seen[1], seen[2]) >= 30, `rose vs gold separate by ${sep(seen[1], seen[2])} (need ≥30)`);
  ok(sep(seen[2], seen[3]) <= 6,  `gold door and /programs/ share one slab — ${sep(seen[2], seen[3])}`);
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
  for (const [w, h, want] of [[1440, 900, 72], [320, 640, 64]]) {
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
        arrowsRight: acts.every(a => a.getBoundingClientRect().right - a.querySelector('.rb-arr').getBoundingClientRect().right <= 26),
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
  ok(r.shown && Math.abs(r.h - 232) <= 14, `the band stands without JS — ${r.h}px`);
  ok(r.hrefs[0] === '#book' && /whatsapp/.test(r.hrefs[1]), 'both destinations intact');
  ok(r.flowerHidden && r.rollback === 6, `the flower falls back to its six-item list — ${r.rollback}`);
  ok(r.over <= 0, 'no sideways scroll');
  await page.close(); await ctx.close();
}

console.log(fail ? `\n${fail} FAILED` : '\nall green');
await browser.close();
srv.close();
process.exit(fail ? 1 : 0);
