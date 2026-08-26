/* ═══ doors 2 & 3 — /modern-menopause/ and /testosterone-top-up/ ════════════════════
   The build round's eyes for the two doors added after the BHRT page. One harness for
   both, because they are one family with one anatomy: a config table holds what differs
   and every check below runs against both.
   ⚠️ DOOR 1 HAS ITS OWN HARNESS — tools/qa/bhrt-shots.mjs, written first and green.
   The overlap is deliberate: that file is referenced by its own handover and is the
   pattern this one was built from. If the three ever need to move together, merge them
   here and delete it in the same commit, never before.

     npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
     node tools/qa/doors-shots.mjs

   Shots land in .qa-out/doors/ (gitignored). Exits non-zero on any smoke failure. */
import { chromium } from 'playwright';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, mkdirSync, readdirSync } from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT  = path.join(ROOT, '.qa-out', 'doors');
mkdirSync(OUT, { recursive: true });

/* ── what differs between the two doors. Everything else is asserted identically. ── */
const PAGES = [
  {
    slug: 'modern-menopause', tag: 'meno',
    title: /Modern Menopause/, payoff: 'Onward.', sceneId: 'horizon',
    /* ⚠️ THREE DOCTORS SINCE 2026-08-26, AND THEY ARE DOOR 1's THREE — his call on
       Irina's comments, "it should all just be women … copy exactly the doctors on
       hormone balancing BHRT". `docNames` is asserted IN ORDER for the same reason
       bhrt-shots.mjs asserts it over there: a "sync the doctors" pass on any of the
       four pages that still carry the peptide set would silently put a man back on
       this row, and the count alone would not notice a substitution. */
    docs: 3, hasNahla: true, docNames: [/Valentina/, /Nahla/, /Diana/],
    /* ⚠️ NO DEVICE CHAPTER ON THIS DOOR SINCE 2026-08-26. The 24-hour dial and the
       long-view bar came out together (his call, "the circle and the bar") and are
       archived whole in archive/modern-menopause-sections/. The harness's dial
       branches below are LEFT STANDING and simply unreachable — restoring the
       sections is this config row plus a paste, never a rewrite of the checks. To put
       them back: device 'dial', deviceSel '[data-dial]', armedCls 'dial-armed',
       labelSel '.dial-label', labels 8, ticks 24, extra '[data-lv]', extraCount 1,
       and 'day' + 'longview' back into `sections` after 'programme'. */
    device: null,
    /* the vocabulary each page must NOT contain — the "don't mix the doors" rule */
    money: ['AED 950.00', 'AED 47.50', 'AED 997.50'],
    addon: ['AED 145.00', 'AED 3,045.00'],
    banned: /DUTCH|still cycling and noticing|Testosterone Top Up/i,
    mustSay: /menoSTART/,
    sections: ['programme', 'doctors', 'stories', 'faq', 'book'],
  },
  {
    slug: 'testosterone-top-up', tag: 'trt',
    title: /Testosterone Top Up/, payoff: 'Back.', sceneId: 'slope',
    docs: 3, hasNahla: false,
    /* ⚠️ NO DEVICE CHAPTER ON THIS DOOR SINCE 2026-08-26 — the ledger and the four
       monitoring markers came out together (his call, the same two-chapter cut made on
       all three doors that day) and are archived whole in
       archive/testosterone-top-up-sections/. The dial/ledger branches below are LEFT
       STANDING and simply unreachable; restoring the sections is this config row plus a
       paste. To put them back: device 'ledger', deviceSel '[data-ledger]', armedCls 'in',
       labelSel '.ledger-list li', labels 8, ticks 0, extra '.mk-card', extraCount 4, and
       'told' + 'markers' back into `sections` after 'programme'. */
    device: null,
    /* ⚠️ 1,150, NOT 950 — this door's own price since its programme moved. The four
       numbers are trt-page.mjs's, which is the file that owns them. */
    money: ['AED 1,150.00', 'AED 57.50', 'AED 1,207.50'],
    addon: ['AED 155.00', 'AED 3,255.00'],
    banned: /DUTCH|menoSTART|Modern Menopause|Top-Up|Testosterone Replacement Therapy in Dubai/i,
    mustSay: /Testosterone Top Up/,
    sections: ['programme', 'doctors', 'stories', 'faq', 'book'],
  },
];

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
  const errs = [], bad = [];
  page.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  /* ⚠️ 404s ARE WATCHED HERE, unlike in the console filter above — a missing asset is
     exactly the failure that reaches production looking like nothing at all. */
  page.on('response', r => { if (r.status() >= 400 && !/cdn\.jsdelivr/.test(r.url())) bad.push(r.status() + ' ' + r.url()); });
  return { ctx, page, errs, bad };
}
const settle = ms => new Promise(r => setTimeout(r, ms));

for (const P of PAGES) {
  const URL_ = `http://127.0.0.1:${PORT}/${P.slug}/`;
  console.log(`\n══ /${P.slug}/ ═══════════════════════════════════════════`);

  /* ── 1 · the scene at its stops, solo, desktop + phone ── */
  for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'p']]) {
    for (const q of ['0.06', '0.20', '0.32', '0.48', '0.60', '0.70', '0.80', '0.93']) {
      const { ctx, page, errs } = await mk(w, h);
      await page.goto(`${URL_}?scene=${q}`, { waitUntil: 'networkidle' });
      await settle(900);
      await page.screenshot({ path: path.join(OUT, `${P.tag}-scene-${tag}-${q.replace('.', '')}.png`) });
      if (q === '0.48') ok(errs.length === 0, `scene ${tag} console clean`, errs.join(' | ').slice(0, 200));
      await ctx.close();
    }
  }

  /* ── 2 · the page, desktop — smoke ── */
  {
    const { ctx, page, errs, bad } = await mk(1440, 900);
    await page.goto(`${URL_}?probe=1`, { waitUntil: 'networkidle' });
    await settle(800);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } scrollTo(0, 0); });
    await settle(900);
    ok(errs.length === 0, 'console clean (probe)', errs.join(' | ').slice(0, 300));
    ok(bad.length === 0, 'every asset 200 (no 404s)', [...new Set(bad)].join(' | ').slice(0, 200));

    const d = await page.evaluate(cfg => ({
      title: document.title,
      payoff: document.querySelector('.scene-title')?.textContent.trim(),
      sceneId: document.querySelector('#' + cfg.sceneId) ? cfg.sceneId : '(missing)',
      beats: document.querySelectorAll('.scene-beat').length,
      /* ⚠️ THE SIX STEPS ARE THE SCULPTURE'S NOW, NOT AN <ol>'s. This read
         `.pg-steps li` until 2026-08-24 and had been quietly returning 0 since the
         flower shipped: the original list moved into <noscript>, whose contents are a
         TEXT NODE in a scripting-enabled browser, so the selector matched nothing and
         the check reported a page with no programme steps at all. Both halves are asked
         for now — the six petals a reader gets, and the six <li> in the rollback list a
         reader without JS gets, counted out of the raw text because they are not DOM. */
      steps: document.querySelectorAll('#process .ps-arm').length,
      rollback: (document.querySelector('#programme noscript')?.textContent.match(/<li>/g) || []).length,
      docs: document.querySelectorAll('.doc').length,
      names: [...document.querySelectorAll('.doc > h3')].map(h => h.textContent.trim()),
      faq: document.querySelectorAll('.faq-item').length,
      stories: document.querySelectorAll('.story').length,
      chips: document.querySelectorAll('.chip').length,
      /* ⚠️ GUARDED ON cfg, NOT ASSUMED PRESENT — a door may have no device chapter at
         all (see /modern-menopause/ above). Unguarded, `querySelectorAll(undefined)`
         is a VALID call that searches for an <undefined> element and quietly returns
         0, and `deviceSel + '.' + armedCls` becomes the selector "undefined.undefined"
         — so a missing config would not throw, it would report a device that is
         present-but-empty and the check would read as a real failure. */
      labels: cfg.labelSel ? document.querySelectorAll(cfg.labelSel).length : 0,
      armed:  cfg.deviceSel ? !!document.querySelector(cfg.deviceSel + '.' + cfg.armedCls) : null,
      ticks: document.querySelectorAll('.dial-ticks line').length,
      extra: cfg.extra ? document.querySelectorAll(cfg.extra).length : 0,
      sub: document.getElementById('pg-sub')?.textContent,
      vat: document.getElementById('pg-vat')?.textContent,
      total: document.getElementById('pg-total')?.textContent,
      /* ⚠️ VISIBLE TEXT ONLY — body.textContent INCLUDES <script> SOURCE, so the first
         cut of this check failed on the word "TOP-UP" written in a code comment inside
         the scene engine. A vocabulary rule about what the PAGE SAYS has to read what a
         reader can read; clone, strip the code, then take the text. */
      body: (() => { const c = document.body.cloneNode(true);
        /* ⚠️ <noscript> JOINED THE STRIP LIST 2026-08-24, for the reason the comment above
           gives about <script>: with JS on, a <noscript>'s content is a text node holding
           raw markup, so its tags and attributes land in body.textContent and a vocabulary
           rule about what the PAGE SAYS starts reading HTML. Its copy is still asserted —
           by the rollback count above, which is what it is for. */
        c.querySelectorAll('script,style,template,noscript').forEach(n => n.remove());
        return c.textContent; })(),
      ids: [...document.querySelectorAll('main section[id]')].map(e => e.id),
      links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && !h.startsWith('#') && !/^https?:|^mailto:/.test(h)),
    }), P);

    ok(P.title.test(d.title), 'title', d.title);
    ok(d.payoff === P.payoff, `payoff word "${P.payoff}"`, d.payoff);
    ok(d.sceneId === P.sceneId, `scene container #${P.sceneId}`, d.sceneId);
    ok(d.beats === 6, 'six scene beats', String(d.beats));
    ok(d.steps === 6, 'six programme steps (the sculpture)', String(d.steps));
    ok(d.rollback === 6, 'six steps in the <noscript> rollback list', String(d.rollback));
    ok(d.docs === P.docs, `${P.docs} doctors`, d.names.join(' · '));
    ok(/Nahla/.test(d.names.join()) === P.hasNahla, `Dr. Nahla ${P.hasNahla ? 'on' : 'off'} this row`);
    if (P.docNames)
      ok(P.docNames.every((re, i) => re.test(d.names[i] || '')),
         'the doctors row is the named three, in order', d.names.join(' · '));
    ok(d.faq === 6, 'six FAQ items', String(d.faq));
    ok(d.stories === 3, 'three stories', String(d.stories));
    /* the eight fallback chips are the SCENE's and survive a door losing its device
       chapter; only the device half of the old "8 chips = 8 rows" pairing is gated */
    ok(d.chips === 8, 'eight scene-fallback chips', String(d.chips));
    if (P.device) {
      ok(d.labels === P.labels, `${P.labels} device rows`, String(d.labels));
      ok(d.armed, `${P.device} armed on desktop`);
      if (P.ticks) ok(d.ticks === P.ticks, `${P.ticks} dial ticks`, String(d.ticks));
      ok(d.extra === P.extraCount, `${P.extraCount} ${P.device === 'dial' ? 'long-view bar' : 'markers'} present`, String(d.extra));
    } else {
      /* ⚠️ BOTH DOORS TAKE THIS BRANCH SINCE 2026-08-26, so nothing in the file exercises
         the device path any more. It is kept rather than deleted because the measurements
         behind those checks (the 900px arming floor, 28 ticks, eight labels) are not
         recoverable from a page that no longer has the chapter — see each door's archive
         README. This branch is the one that runs today, and it asserts the REMOVAL was
         clean rather than asserting nothing. */
      ok(d.labels === 0 && d.extra === 0 && d.ticks === 0,
         'no device chapter, and no orphan markup left behind by its removal',
         `${d.labels}/${d.extra}/${d.ticks}`);
    }
    /* ⚠️ THE FIGURES ARE THE DOOR'S OWN AND COME FROM ITS CONFIG ROW. They were written
       into this shared line as literals — door 2's 950/47.50/997.50, asserted against
       BOTH doors — and had been failing on /testosterone-top-up/ since its programme
       moved to AED 1,150. The money there is real and correct (trt-page.mjs guards it in
       four places and is green); it was this check that was wrong, and it was wrong in
       the one way a hardcoded expectation always fails — quietly, on the page it was not
       written for. Fixed in passing 2026-08-26; it is not part of that round's work. */
    ok(d.sub === P.money[0] && d.vat === P.money[1] && d.total === P.money[2],
       `money: ${P.money.join(' / ')}`, `${d.sub} ${d.vat} ${d.total}`);
    ok(!P.banned.test(d.body), 'no foreign-door vocabulary, no DUTCH',
       (d.body.match(P.banned) || []).join());
    ok(P.mustSay.test(d.body), `speaks its own programme name`);
    ok(P.sections.every(id => d.ids.includes(id)), 'every chapter present', d.ids.join(','));
    ok(d.links.includes('../hormone-balancing/'), 'links back to the parent door page', d.links.join(' · '));

    /* the add-on re-derives every row */
    await page.click('#pg-addon');
    const m2 = await page.evaluate(() => ({
      row: !document.getElementById('pg-row-addon').hidden,
      vat: document.getElementById('pg-vat').textContent,
      total: document.getElementById('pg-total').textContent,
    }));
    ok(m2.row && m2.vat === P.addon[0] && m2.total === P.addon[1],
       `add-on: ${P.addon[0]} VAT, ${P.addon[1]} total`, `${m2.vat} ${m2.total}`);

    /* the dial's flip (menopause only — the ledger has no flip by design) */
    if (P.device === 'dial') {
      const flip = await page.evaluate(() => {
        const b = document.querySelector('.dial-label'); b.click();
        return { on: b.classList.contains('flipped'), shown: getComputedStyle(b.querySelector('.dl-ans')).display !== 'none' };
      });
      ok(flip.on && flip.shown, 'dial label flips to its answer');
    }

    await page.evaluate(() => scrollTo(0, 0)); await settle(500);
    await page.screenshot({ path: path.join(OUT, `${P.tag}-page-d-top.png`) });
    for (const id of P.sections) {
      await page.evaluate(i => document.getElementById(i)?.scrollIntoView(), id);
      await settle(650);
      await page.screenshot({ path: path.join(OUT, `${P.tag}-page-d-${id}.png`) });
    }
    await ctx.close();
  }

  /* ── 3 · the phone + no sideways scroll across thirteen widths ── */
  {
    const { ctx, page } = await mk(390, 844);
    await page.goto(`${URL_}?probe=1`, { waitUntil: 'networkidle' });
    await settle(600);
    if (P.device === 'dial') {
      const m = await page.evaluate(() => !!document.querySelector('[data-dial].dial-armed'));
      ok(!m, 'phone: dial unarmed, chips flow');
    }
    await page.screenshot({ path: path.join(OUT, `${P.tag}-page-p-top.png`) });
    for (const id of P.sections.slice(0, 3)) {
      await page.evaluate(i => document.getElementById(i)?.scrollIntoView(), id);
      await settle(600);
      await page.screenshot({ path: path.join(OUT, `${P.tag}-page-p-${id}.png`) });
    }
    await ctx.close();

    for (const w of [320, 360, 375, 390, 430, 480, 600, 760, 900, 1104, 1280, 1440, 1920]) {
      const { ctx: c2, page: p2 } = await mk(w, 900);
      await p2.goto(`${URL_}?probe=1`, { waitUntil: 'networkidle' });
      await settle(320);
      const sw = await p2.evaluate(() => document.documentElement.scrollWidth);
      ok(sw <= w, `no sideways scroll at ${w}`, `scrollWidth=${sw}`);
      await c2.close();
    }
  }

  /* ── 4 · reduced motion ── */
  {
    const { ctx, page, errs } = await mk(1440, 900, { reducedMotion: 'reduce' });
    await page.goto(URL_, { waitUntil: 'networkidle' });
    await settle(700);
    const rm = await page.evaluate(cfg => ({
      scene: document.documentElement.classList.contains('js-scene'),
      chips: document.querySelectorAll('.chip').length,
      /* guarded for the same reason the desktop probe is — see there. A door with no
         device chapter must not have `undefined` compiled into a selector. */
      device: cfg.deviceSel ? !!document.querySelector(cfg.deviceSel) : null,
    }), P);
    ok(!rm.scene, 'reduced motion: scene stands down (fallback path)');
    ok(rm.chips === 8, 'reduced motion: the eight chips stand');
    if (P.device) ok(rm.device, 'reduced motion: the device still renders');
    ok(errs.length === 0, 'reduced motion console clean', errs.join(' | ').slice(0, 200));
    await page.screenshot({ path: path.join(OUT, `${P.tag}-reduced-top.png`) });
    await ctx.close();
  }

  /* ── 5 · the hero is alive ── */
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
}

await browser.close();
srv.close();
console.log(fails ? `\n${fails} FAILURE(S)` : '\nall green');
process.exit(fails ? 1 : 0);
