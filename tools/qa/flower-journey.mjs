/* ═══ tools/qa/flower-journey.mjs — the six-step flower, photographed and smoke-tested ══
   Serves the repo, then photographs 03's flower on both pages that carry it, at desktop
   and phone, in overview and in every detail state — and asserts the geometry contract
   that the section exists to keep:

     · the active petal's broad end is ABOVE its tapered base (never flipped)
     · the hub's centre is BELOW the active petal's centre (never inside it)
     · the two visible neighbours sit at TRUE ±60°, measured off the rendered DOM
     · the copy is upright at every step (counter-rotation actually cancels)
     · one petal path, six times, byte-identical (no petal was reshaped)

       npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
       node tools/qa/flower-journey.mjs

   Shots land in .qa-out/flower/ (gitignored). Exits non-zero on any smoke failure. */
import { chromium } from 'playwright';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, mkdirSync, statSync } from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT  = path.join(ROOT, '.qa-out', 'flower');
mkdirSync(OUT, { recursive: true });

const MIME = { html:'text/html', js:'text/javascript', mjs:'text/javascript', css:'text/css',
  webp:'image/webp', avif:'image/avif', png:'image/png', jpg:'image/jpeg', svg:'image/svg+xml',
  woff2:'font/woff2', ico:'image/x-icon', json:'application/json' };

const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f) || !statSync(f).isFile()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[f.split('.').pop()] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise(r => srv.listen(0, r));
const BASE = `http://127.0.0.1:${srv.address().port}`;

const PAGES = ['modern-menopause', 'hormone-therapy-bhrt'];
/* ⚠️ Playwright takes `viewport:{width,height}`, NOT bare width/height — pass them at
   the top level and every context silently runs at the default 1280×720, which makes
   a phone run look exactly like a desktop one and hides every responsive failure. */
const VIEWS = [
  { tag: 'desktop', viewport: { width: 1440, height: 900 } },
  { tag: 'laptop',  viewport: { width: 1280, height: 720 } },
  { tag: 'tablet',  viewport: { width: 820,  height: 1180 }, hasTouch: true },
  { tag: 'phone',   viewport: { width: 390,  height: 844 }, isMobile: true,
    hasTouch: true, deviceScaleFactor: 2 },
  { tag: 'phone-sm', viewport: { width: 360, height: 640 }, isMobile: true,
    hasTouch: true, deviceScaleFactor: 2 },
];

const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;

/* ⚠️ THE PAGE'S OWN SCRIPTS MUST BE RUNNING FOR THIS TO MEAN ANYTHING. Sandboxes block
   jsDelivr, and with GSAP absent the page's main IIFE never runs — the flower would
   then be measured in a document where nothing else executed, which proves nothing
   about the two coexisting. Same reroute as tools/qa/fm-shots.mjs: node_modules stands
   in for the CDN inside the harness only, and NOTHING ABOUT IT SHIPS. */
const NM = [path.join(ROOT, 'node_modules'), process.env.QA_NODE_MODULES].filter(Boolean)
  .find(t => existsSync(path.join(t, 'gsap', 'dist', 'gsap.min.js')));
if (!NM) { console.error('✗ gsap/lenis not found — npm install --no-save gsap@3.13.0 lenis@1.3.4'); process.exit(1); }
const CDN = [
  [/gsap@3\.13\.0\/dist\/gsap\.min\.js/,  path.join(NM, 'gsap/dist/gsap.min.js')],
  [/ScrollTrigger\.min\.js/,                 path.join(NM, 'gsap/dist/ScrollTrigger.min.js')],
  [/SplitText\.min\.js/,                     path.join(NM, 'gsap/dist/SplitText.min.js')],
  [/lenis@1\.3\.4\/dist\/lenis\.min\.js/, path.join(NM, 'lenis/dist/lenis.min.js')],
];
const reroute = ctx => ctx.route('**/cdn.jsdelivr.net/**', route => {
  const u = route.request().url();
  for (const [re, f] of CDN)
    if (re.test(u)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: readFileSync(f) });
  return route.abort();
});

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

/* read the rendered geometry straight out of the DOM — not out of our own maths */
const probe = () => {
  const fj = document.getElementById('fj');
  const svg = fj.querySelector('.fj-svg');
  const sb = svg.getBoundingClientRect();
  const box = el => { const b = el.getBoundingClientRect();
    return { x: b.x - sb.x, y: b.y - sb.y, w: b.width, h: b.height,
             cx: b.x - sb.x + b.width / 2, cy: b.y - sb.y + b.height / 2 }; };
  const active = +fj.getAttribute('data-active');
  const petals = [...fj.querySelectorAll('.fj-p')];
  const hub = fj.querySelector('.fj-hub-c');
  /* the petal's own tip and base, mapped through whatever transforms are live */
  const pt = (el, x, y) => {
    const m = el.getScreenCTM();
    const p = new DOMPoint(x, y).matrixTransform(m);
    return { x: p.x - sb.x, y: p.y - sb.y };
  };
  return {
    mode: fj.getAttribute('data-mode'),
    active,
    idx: getComputedStyle(fj).getPropertyValue('--fj-idx').trim(),
    svg: { w: sb.width, h: sb.height },
    /* tip = broad outer end (r=520), base = tapered inner end (r=125) */
    petals: petals.map(p => ({
      tip: pt(p, 0, -520), base: pt(p, 0, -100),
      wideL: pt(p, -178, -406), wideR: pt(p, 178, -406),
      d: p.querySelector('.fj-shape').getAttribute('d'),
      /* the live matrix of the counter-rotated copy holder */
      copy: (m => ({ a: m.a, b: m.b, c: m.c, d: m.d }))(p.querySelector('.fj-c').getScreenCTM()),
      ovOpacity: +getComputedStyle(p.querySelector('.fj-ov')).opacity,
      dtOpacity: +getComputedStyle(p.querySelector('.fj-dt')).opacity,
      tabindex: p.getAttribute('tabindex'),
      label: p.getAttribute('aria-label'),
    })),
    hub: (() => { const m = hub.getScreenCTM();
      const c = new DOMPoint(0, 0).matrixTransform(m);
      const e = new DOMPoint(147, 0).matrixTransform(m);
      return { cx: c.x - sb.x, cy: c.y - sb.y, r: Math.hypot(e.x - c.x, e.y - c.y) }; })(),
    /* ⚠️ THE OVERVIEW LABELS ARE THE HARDER CASE, and it is easy to miss. Each is
       counter-rotated inside a petal that is itself seated at i*60°, so the label sits
       ACROSS the silhouette at five different angles — a block that clears the curve at
       12 o'clock can still cross it at 120°. Check all six. */
    ovSpill: (() => {
      const bad = [];
      petals.forEach((p, i) => {
        const shape = p.querySelector('.fj-shape');
        const inv = shape.getScreenCTM().inverse();
        p.querySelectorAll('.fj-ov text:not(:has(tspan)), .fj-ov tspan, .fj-ov line')
          .forEach(t => {
            const b = t.getBoundingClientRect();
            if (!b.width && !b.height) return;
            [[b.left, b.top], [b.right, b.top], [b.left, b.bottom], [b.right, b.bottom]]
              .forEach(([x, y]) => {
                const q = new DOMPoint(x, y).matrixTransform(inv);
                if (!shape.isPointInFill(q)) bad.push(`p${i + 1} “${t.textContent}”`);
              });
          });
      });
      return [...new Set(bad)];
    })(),
    live: fj.querySelector('.fj-live').textContent,
    ui: {
      cta: box(fj.querySelector('.fj-cta')),
      all: box(fj.querySelector('.fj-all')),
      prev: box(fj.querySelector('.fj-prev')),
      next: box(fj.querySelector('.fj-next')),
      lblPrev: box(fj.querySelector('.fj-arw-l--prev')),
      lblNext: box(fj.querySelector('.fj-arw-l--next')),
      ctaOp: +getComputedStyle(fj.querySelector('.fj-cta')).opacity,
      navOp: +getComputedStyle(fj.querySelector('.fj-nav')).opacity,
      /* SVG computed font-size is in USER UNITS — the only honest legibility number
         is the rendered one, so scale it through the live CTM */
      bodyFs: (() => { const t = petals[active].querySelector('.fj-dt .fj-body');
        const m = t.getScreenCTM();
        return parseFloat(getComputedStyle(t).fontSize) * Math.hypot(m.a, m.b); })(),
      stage: (b => ({ w: b.width, h: b.height }))(
        fj.querySelector('.fj-stage').getBoundingClientRect()),
    },
    /* EVERY corner of EVERY line of the active petal's copy, tested against the
       petal's own fill. Not a width heuristic — the actual silhouette. */
    spill: (() => {
      const shape = petals[active].querySelector('.fj-shape');
      const inv = shape.getScreenCTM().inverse();
      const bad = [];
      /* ⚠️ TEST EACH <tspan>, NOT ITS PARENT <text>. A multi-line <text>'s box is the
         UNION of its lines, so its bottom corners sit at the widest line's x and the
         lowest line's y — a point no glyph occupies. Testing the union reports a spill
         on every centred paragraph in a curved shape, which is a lie. */
      petals[active].querySelectorAll(
        '.fj-dt text:not(:has(tspan)), .fj-dt tspan, .fj-dt line, .fj-dt circle, .fj-dt path, .fj-dt ellipse')
        .forEach(t => {
          const b = t.getBoundingClientRect();
          if (!b.width && !b.height) return;
          [[b.left, b.top], [b.right, b.top], [b.left, b.bottom], [b.right, b.bottom]]
            .forEach(([x, y]) => {
              const q = new DOMPoint(x, y).matrixTransform(inv);
              if (!shape.isPointInFill(q)) bad.push(
              `${t.tagName}${t.textContent ? ' “' + t.textContent.slice(0, 34) + '”' : ''}`);
            });
        });
      return [...new Set(bad)];
    })(),
  };
};

const ang = (from, to) => (Math.atan2(to.x - from.x, from.y - to.y) * 180 / Math.PI + 540) % 360 - 180;

for (const page of PAGES) {
  for (const view of VIEWS) {
    const ctx = await browser.newContext(view);
    await reroute(ctx);
    const pg  = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', e => errs.push(String(e) + ' @ ' + String(e.stack||'').split('\n').slice(1,3).join(' | ')));
    await pg.goto(`${BASE}/${page}/`, { waitUntil: 'domcontentloaded' });
    await pg.waitForSelector('#fj.fj-on', { timeout: 8000 });
    await pg.evaluate(() => document.getElementById('fj').scrollIntoView({ block: 'center' }));
    await pg.waitForTimeout(700);

    const stage = pg.locator('#fj .fj-stage');
    const tag = `${page}-${view.tag}`;

    /* ── overview ─────────────────────────────────────────────────────────── */
    let g = await pg.evaluate(probe);
    await stage.screenshot({ path: path.join(OUT, `${tag}-00-overview.png`) });

    ok(g.mode === 'overview', `${tag}: opens in overview`);
    ok(g.ui.ctaOp === 1, `${tag}: booking CTA visible in overview`);
    ok(g.ui.navOp === 0, `${tag}: step controls hidden in overview`);
    ok(new Set(g.petals.map(p => p.d)).size === 1,
       `${tag}: all six petals share ONE path (found ${new Set(g.petals.map(p => p.d)).size})`);
    ok(g.petals.every(p => p.tabindex === '0'), `${tag}: all six petals are tab stops in overview`);
    ok(g.ovSpill.length === 0, `${tag}: overview label crosses the petal edge → ${g.ovSpill.join(', ')}`);
    /* the six seats, measured off the render: petal i must sit at i*60° from 12 */
    g.petals.forEach((p, i) => {
      const a = ang({ x: g.hub.cx, y: g.hub.cy }, p.tip);
      const want = ((i * 60 + 180) % 360) - 180;
      ok(near(a, want, 1.2), `${tag}: petal ${i + 1} seated at ${a.toFixed(1)}°, wants ${want}°`);
      ok(p.tip.y < p.base.y || i !== 0, `${tag}: petal ${i + 1} broad end orientation`);
    });

    /* ── detail, every step ───────────────────────────────────────────────── */
    await pg.evaluate(() => document.querySelectorAll('#fj .fj-p')[0].dispatchEvent(
      new MouseEvent('click', { bubbles: true })));
    await pg.waitForTimeout(1200);

    for (let n = 0; n < 6; n++) {
      g = await pg.evaluate(probe);
      const a = g.active;
      await stage.screenshot({ path: path.join(OUT, `${tag}-${String(a + 1).padStart(2, '0')}-detail.png`) });

      const p = g.petals[a];
      ok(g.mode === 'detail', `${tag}/step${a + 1}: in detail`);
      /* 12 o'clock, broad end UP, tapered base DOWN, hub BELOW the petal */
      const at12 = ang({ x: g.hub.cx, y: g.hub.cy }, p.tip);
      ok(near(at12, 0, 1.2), `${tag}/step${a + 1}: active petal at ${at12.toFixed(1)}°, wants 12 o'clock`);
      ok(p.tip.y < p.base.y - 40,
         `${tag}/step${a + 1}: broad end (y=${p.tip.y.toFixed(0)}) must be above base (y=${p.base.y.toFixed(0)})`);
      ok(g.hub.cy > p.base.y, `${tag}/step${a + 1}: hub centre below the petal's base`);
      ok(g.hub.cy > (p.tip.y + p.base.y) / 2, `${tag}/step${a + 1}: hub below the petal, not inside it`);
      /* no mirroring: the petal's left edge stays left of its right edge */
      ok(p.wideL.x < p.wideR.x, `${tag}/step${a + 1}: petal not mirrored`);
      /* the two TRUE neighbours, at real ±60° off the hub */
      [[(a + 5) % 6, -60], [(a + 1) % 6, 60]].forEach(([j, want]) => {
        const na = ang({ x: g.hub.cx, y: g.hub.cy }, g.petals[j].tip);
        ok(near(na, want, 1.2), `${tag}/step${a + 1}: neighbour ${j + 1} at ${na.toFixed(1)}°, wants ${want}°`);
      });
      /* copy upright: the counter-rotated holder's matrix must be a pure scale */
      g.petals.forEach((q, i) => {
        const rot = Math.atan2(q.copy.b, q.copy.a) * 180 / Math.PI;
        ok(near(rot, 0, 0.8), `${tag}/step${a + 1}: petal ${i + 1} copy tilted ${rot.toFixed(1)}°`);
      });
      /* rigid: every petal keeps the same scale — nothing stretched */
      const scales = g.petals.map(q => Math.hypot(q.copy.a, q.copy.b));
      ok(near(Math.min(...scales), Math.max(...scales), 0.001),
         `${tag}/step${a + 1}: petals at different scales — something stretched`);
      /* copy inside the silhouette — exact, not approximate */
      ok(g.spill.length === 0,
        `${tag}/step${a + 1}: copy crosses the petal edge → ${g.spill.join(', ')}`);
      ok(g.live.includes(`Step ${a + 1} of 6`), `${tag}/step${a + 1}: live region announces the step`);
      ok(p.dtOpacity > .9 && p.ovOpacity < .1, `${tag}/step${a + 1}: detail copy shown, overview label hidden`);
      ok(g.ui.navOp === 1, `${tag}/step${a + 1}: controls visible`);
      ok(g.ui.prev.w >= 44 && g.ui.prev.h >= 44, `${tag}/step${a + 1}: Prev is ${g.ui.prev.w}×${g.ui.prev.h}, wants ≥44`);
      ok(g.ui.next.w >= 44 && g.ui.next.h >= 44, `${tag}/step${a + 1}: Next is ${g.ui.next.w}×${g.ui.next.h}, wants ≥44`);
      ok(g.ui.bodyFs >= 16, `${tag}/step${a + 1}: body copy renders at ${g.ui.bodyFs.toFixed(1)}px, wants ≥16`);
      /* the arrows must not spill off the stage */
      ok(g.ui.prev.x >= -1 && g.ui.next.x + g.ui.next.w <= g.ui.stage.w + 1,
         `${tag}/step${a + 1}: an arrow is off the stage — prev.x ${g.ui.prev.x.toFixed(0)}, `
         + `next right ${(g.ui.next.x + g.ui.next.w).toFixed(0)} of ${g.ui.stage.w.toFixed(0)}`);
      ok(g.ui.all.y + g.ui.all.h <= g.ui.stage.h + 1 && g.ui.all.y >= 0,
         `${tag}/step${a + 1}: All steps is off the stage (y ${g.ui.all.y.toFixed(0)})`);
      /* the destination names must be ON the stage and OFF the burgundy hub — dark ink
         on burgundy is the one place this layout can quietly fail a contrast check */
      [['prev', g.ui.lblPrev], ['next', g.ui.lblNext]].forEach(([w, L]) => {
        ok(L.x >= -1 && L.x + L.w <= g.ui.stage.w + 1 && L.y >= -1
           && L.y + L.h <= g.ui.stage.h + 1,
           `${tag}/step${a + 1}: ${w} label off the stage (${L.x.toFixed(0)}…${(L.x + L.w).toFixed(0)}`
           + ` of ${g.ui.stage.w.toFixed(0)}, y ${L.y.toFixed(0)}…${(L.y + L.h).toFixed(0)})`);
        const near = Math.max(Math.abs(L.cx - g.hub.cx) - L.w / 2, 0);
        const overHub = near < g.hub.r
          && L.y + L.h > g.hub.cy - Math.sqrt(Math.max(0, g.hub.r ** 2 - near ** 2));
        ok(!overHub, `${tag}/step${a + 1}: ${w} label sits on the burgundy hub`);
      });

      if (n < 5) {
        await pg.locator('#fj .fj-next').click();
        await pg.waitForTimeout(950);
      }
    }

    {
      const fit = await pg.evaluate(() => window.__fjFit || null);
      if (fit && (fit.fs < 1 || fit.ttl < 1 || fit.ov < 1))
        console.log(`  · ${tag} fit clamp — body ${fit.fs.toFixed(3)} title ${fit.ttl.toFixed(3)}`
          + ` overview ${fit.ov.toFixed(3)}`
          + Object.entries(fit.worst || {}).map(([r, t2]) => `\n      ${r} ← "${t2}"`).join(''));
    }

    /* the flower turned one whole way round: idx went 0 → 5, never unwound */
    ok(+g.idx === 5, `${tag}: five Nexts land on idx 5 (got ${g.idx}) — the flower unwound`);

    /* ── keyboard ─────────────────────────────────────────────────────────── */
    await pg.locator('#fj .fj-all').focus();
    await pg.keyboard.press('ArrowLeft');
    await pg.waitForTimeout(800);
    g = await pg.evaluate(probe);
    ok(g.active === 4, `${tag}: ArrowLeft steps back (got ${g.active + 1})`);
    await pg.keyboard.press('Escape');
    await pg.waitForTimeout(1000);
    g = await pg.evaluate(probe);
    ok(g.mode === 'overview', `${tag}: Escape returns to overview`);
    ok(+g.idx % 6 === 0, `${tag}: overview rests on step 01 (idx ${g.idx})`);

    /* Enter opens a petal */
    await pg.evaluate(() => document.querySelectorAll('#fj .fj-p')[2].focus());
    await pg.keyboard.press('Enter');
    await pg.waitForTimeout(1000);
    g = await pg.evaluate(probe);
    ok(g.mode === 'detail' && g.active === 2, `${tag}: Enter opens step 03 (got ${g.mode}/${g.active + 1})`);
    await pg.screenshot({ path: path.join(OUT, `${tag}-99-focus.png`) });

    /* ── swipe, phones only ───────────────────────────────────────────────── */
    if (view.hasTouch) {
      const b = await stage.boundingBox();
      const y = b.y + b.height * 0.35;
      await pg.touchscreen.tap(b.x + b.width / 2, y);
      await pg.evaluate(({ x1, x2, y }) => {
        const el = document.querySelector('#fj .fj-stage');
        const T = (x, id) => new Touch({ clientX: x, clientY: y, screenX: x, screenY: y,
          pageX: x, pageY: y, identifier: id, target: el });
        /* ⚠️ targetTouches IS NOT OPTIONAL. Lenis reads it in its own onTouchStart, and
           a synthetic event without it throws inside the smooth-scroller — which looks
           exactly like a bug in the flower and is a bug in the test. Real touch events
           always carry all three lists; so must these. */
        const start = T(x1, 0);
        el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true,
          touches: [start], targetTouches: [start], changedTouches: [start] }));
        const end = T(x2, 0);
        el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true,
          touches: [], targetTouches: [], changedTouches: [end] }));
      }, { x1: b.x + b.width * 0.8, x2: b.x + b.width * 0.2, y });
      await pg.waitForTimeout(900);
      g = await pg.evaluate(probe);
      ok(g.active === 3, `${tag}: swipe left advances 03 → 04 (got ${g.active + 1})`);
      await stage.screenshot({ path: path.join(OUT, `${tag}-98-swipe.png`) });
    }

    /* ── reduced motion ───────────────────────────────────────────────────── */
    await pg.emulateMedia({ reducedMotion: 'reduce' });
    await pg.evaluate(() => document.querySelector('#fj .fj-all').click());
    await pg.waitForTimeout(260);
    g = await pg.evaluate(probe);
    ok(g.mode === 'overview', `${tag}: reduced motion — state changes immediately`);
    await pg.emulateMedia({ reducedMotion: 'no-preference' });

    ok(errs.length === 0, `${tag}: page errors → ${errs.join(' | ')}`);
    await ctx.close();
  }
}

/* ── the rest of the page must be untouched ─────────────────────────────────── */
{
  const ctx = await browser.newContext(VIEWS[0]);
  await reroute(ctx);
  const pg = await ctx.newPage();
  for (const page of PAGES) {
    await pg.goto(`${BASE}/${page}/`, { waitUntil: 'domcontentloaded' });
    await pg.waitForTimeout(400);
    const kept = await pg.evaluate(() => ({
      card: !!document.querySelector('.prog-card'),
      addon: !!document.getElementById('pg-addon'),
      total: (document.getElementById('pg-total') || {}).textContent,
      lede: !!document.querySelector('.prog-lede'),
      head: (document.querySelector('#programme h2') || {}).textContent,
      hero: !!document.querySelector('.hero'),
      scene: !!document.querySelector('.scene'),
      faq: document.querySelectorAll('.faq details, .faq .faq-q').length,
      noscript: (document.querySelector('#programme noscript') || {}).innerHTML?.includes('pg-steps'),
      /* the flower is a child of the SECTION, not of .wrap — see the splice note. If
         the div arithmetic in that swap were off by one this is where it would show. */
      wraps: document.querySelectorAll('#programme > .wrap').length,
      fjIsSectionChild: document.querySelector('#programme > .fj') !== null,
      cardInGrid: !!document.querySelector('#programme .prog-grid--card > .prog-card'),
      strayOl: document.querySelectorAll('#programme > .wrap ol.pg-steps').length,
    }));
    ok(kept.card && kept.lede && kept.hero && kept.scene, `${page}: chapter furniture intact`);
    ok(kept.head && kept.head.includes('One programme'), `${page}: 03's headline untouched`);
    ok(kept.noscript, `${page}: the original list survives in <noscript>`);
    if (page === 'modern-menopause') ok(kept.addon, `${page}: the add-on toggle survives`);
    ok(kept.wraps === 2, `${page}: #programme should hold exactly 2 .wrap columns, found ${kept.wraps}`);
    ok(kept.fjIsSectionChild, `${page}: the flower is not a direct child of #programme`);
    ok(kept.cardInGrid, `${page}: the money card is not inside .prog-grid--card`);
    ok(kept.strayOl === 0, `${page}: a live six-step <ol> is still rendering inside .wrap`);
    const eng = await pg.evaluate(() => ({ gsap: typeof window.gsap, lenis: typeof window.Lenis,
      hiddenReveals: [...document.querySelectorAll('[data-reveal]')]
        .filter(e => getComputedStyle(e).visibility === 'hidden' && e.getBoundingClientRect().top < innerHeight).length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
    ok(eng.gsap === 'object' || eng.gsap === 'function',
       `${page}: GSAP did not load — the coexistence check is meaningless (${eng.gsap})`);
    ok(eng.overflow <= 0, `${page}: the page scrolls sideways by ${eng.overflow}px`);
    ok(eng.hiddenReveals === 0, `${page}: ${eng.hiddenReveals} in-view [data-reveal] left hidden`);
  }
  await ctx.close();
}

/* ── no JS: the chapter must still be the chapter ───────────────────────────── */
{
  const ctx = await browser.newContext({ ...VIEWS[0], javaScriptEnabled: false });
  const pg = await ctx.newPage();
  for (const page of PAGES) {
    await pg.goto(`${BASE}/${page}/`, { waitUntil: 'domcontentloaded' });
    const r = await pg.evaluate(() => 0).catch(() => null);   /* evaluate is unavailable; use the DOM via locators */
    const steps = await pg.locator('#programme ol.pg-steps > li').count();
    const flowerVisible = await pg.locator('#fj').isVisible();
    const cardText = await pg.locator('#programme .prog-card').innerText();
    ok(steps === 6, `${page} (no JS): the six-step list should render from <noscript>, found ${steps}`);
    ok(!flowerVisible, `${page} (no JS): the empty flower mount should stay hidden`);
    ok(/AED\s*950/.test(cardText), `${page} (no JS): the money card still renders`);
  }
  await ctx.close();
}

await browser.close();
srv.close();

if (fails.length) { console.error('\n✗ ' + fails.length + ' failure(s):\n  ' + fails.join('\n  ')); process.exit(1); }
console.log('✓ flower journey: geometry, controls, a11y and page integrity all pass');
console.log('  shots → .qa-out/flower/');
