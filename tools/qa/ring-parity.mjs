/* Section 04 PARITY — does the ring on the live page still render like the ring in the lab?

     node tools/qa/ring-parity.mjs [--verbose]

   ══ WHY THIS FILE EXISTS ═══════════════════════════════════════════════════════════
   The ring is built in peptide-therapy/section04-hybrid.html and LIFTED into
   peptide-therapy/index.html. That is the project's working method and it is a good one —
   a variant costs nothing in the lab — but it has one failure mode that no other harness
   in this directory can see:

     ⚠️⚠️ MARKUP CARRIES DEPENDENCIES ON RULES THAT ARE NOWHERE NEAR IT, AND A MISSING RULE
     FAILS BY RENDERING SOMETHING RATHER THAN BY ERRORING.

   Round 18's graft proved it three times over, and every one of the three passed every
   structural check in services-choice.mjs while it was broken:

     1 · `.sr` — the eight card faces keep their accessible name in <span class="sr">. The
         rule that hides it lived in the lab's reset, which was not part of what was lifted,
         so every pathway's name printed across the middle of its photograph in the
         browser's default face. It looked so much like part of the artwork that the first
         reading of the screenshot was "the client baked text into their images".
     2 · `.pw-back h3` took its colour by INHERITANCE from .pw-back. That works in the lab,
         whose reset gives headings no colour, and fails here, where the global
         `h1,h2,h3{color:var(--ink)}` beats inheritance — so the pathway's name on the back
         of the card was dark plum on burgundy.
     3 · Every button the ring brought over lost its type: the lab resets
         `button{font:inherit}`, this page passes only font-family, so size, weight and
         line-height fell back to the browser's. Nothing showed, because those buttons hold
         SVGs and hidden text — which is what makes it the worst of the three.

   ⚠️ SO THIS HARNESS COMPARES COMPUTED STYLE, NOT MARKUP. Two files that agree about every
   selector can still disagree about every colour. It renders both, walks the ring's
   elements in both, and fails on any property that differs.
   ⚠️ IT IS A TWO-WAY CHECK. A fix applied to the live page and not to the lab fails here
   just as loudly, which is what keeps the lab worth prototyping in.
   ⚠️ GEOMETRY IS DELIBERATELY EXCLUDED. The lab's stage and the page's .wrap are different
   widths, so width/height/padding/margin legitimately differ; everything that carries a
   DESIGN DECISION — colour, type, layer, visibility — does not. */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const VERBOSE = process.argv.includes('--verbose');

function findChromium() {
  try { const p = chromium.executablePath(); if (fs.existsSync(p)) return p; } catch {}
  for (const base of ['/opt/pw-browsers', path.join(process.env.HOME || '', '.cache/ms-playwright')]) {
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base))
      for (const rel of ['chrome-linux/chrome', 'chrome-linux/headless_shell', 'chrome']) {
        const p = path.join(base, d, rel);
        if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
      }
  }
}

const CDN = {
  'gsap@3.13.0/dist/gsap.min.js':          'gsap/dist/gsap.min.js',
  'gsap@3.13.0/dist/ScrollTrigger.min.js': 'gsap/dist/ScrollTrigger.min.js',
  'gsap@3.13.0/dist/SplitText.min.js':     'gsap/dist/SplitText.min.js',
  'lenis@1.3.4/dist/lenis.min.js':         'lenis/dist/lenis.min.js'
};

/* ⚠️ EVERY PROPERTY HERE CARRIES A DESIGN DECISION. Adding one is cheap; removing one to
   green a failure is how this file stops being worth running. */
const PROPS = ['color', 'backgroundColor', 'backgroundImage', 'fontFamily', 'fontSize',
  'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'textAlign',
  'opacity', 'display', 'position', 'zIndex', 'pointerEvents', 'visibility', 'overflowY',
  'borderRadius', 'borderColor', 'borderWidth', 'boxShadow',
  'backfaceVisibility', 'perspective', 'stroke', 'fill'];
/* ⚠️ transform-origin IS COMPARED AS A FRACTION, NOT AS THE PIXELS getComputedStyle RETURNS.
   It resolves against the element's own box, so the lab's wider stage reports a different
   number for the identical `50% 100%` — comparing the raw value would fail forever on a
   difference that is not one. The FRACTION is the decision: .pw is bottom-anchored, and
   that is the whole reason every card's foot stays on the ring. */
const ORIGIN = 'transformOrigin%';

/* the ring, element by element — the back face included, which is why the walk turns a card
   over before it measures anything */
const SEL = ['.rail', '.pw', '.pw-art', '.pw-face', '.pw-n', '.pw-tick', '.pw-body',
  '.pw-body h3', '.pw-line', '.pw-body .pw-cta', '.pw-more', '.pw-back', '.pw-back h3',
  '.pw-back p', '.pw-out li', '.pw-back .pw-cta', '.pw-close', '.arrow', '.ringline path',
  '.rail-foot', '.hint', '.dots i', '.sr'];

let pass = 0, fail = 0;
const ok  = (n, m = '') => { pass++; console.log(`  \x1b[32m✓\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const bad = (n, m = '') => { fail++; console.log(`  \x1b[31m✗\x1b[0m ${n}${m ? ' — ' + m : ''}`); };

const run = async () => {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '') || 'index.html';
    const inPage = rel.startsWith('images/') || rel.startsWith('fonts/') || rel.startsWith('vendor/');
    const f = path.join(ROOT, inPage ? rel : path.join('peptide-therapy', rel));
    const file = fs.existsSync(f) ? f : path.join(ROOT, rel);
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end('nope'); }
    res.setHeader('content-type', { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
      '.webp':'image/webp', '.avif':'image/avif', '.png':'image/png', '.woff2':'font/woff2'
    }[path.extname(file)] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise(r => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}/`;

  const browser = await chromium.launch({ executablePath: findChromium(), args: ['--force-color-profile=srgb'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.route('**/cdn.jsdelivr.net/**', route => {
    const hit = Object.keys(CDN).find(k => route.request().url().includes(k));
    const local = hit && path.join(ROOT, 'node_modules', CDN[hit]);
    return local && fs.existsSync(local)
      ? route.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(local, 'utf8') })
      : route.abort();
  });

  async function grab(url) {
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(1400);
    /* ⚠️ THE FLOAT IS STOPPED AND THE CARD IS TURNED BY HAND. Measuring a card mid-breath
       returns a transform true for no frame, and the back face is display:none until a card
       is open — an unopened back reports the styles of a hidden box, and every one of them
       would match, which is the worst kind of pass. */
    await p.addStyleTag({ content: '.pw{animation:none!important}' });
    await p.evaluate(() => {
      const c = document.querySelector('.pw[data-focus="true"]');
      if (c) { c.dataset.open = 'true'; c.style.setProperty('--rot', '180deg'); }
    });
    await p.waitForTimeout(700);
    const out = await p.evaluate(([SEL, PROPS, ORIGIN]) => {
      const r = {};
      for (const s of SEL) {
        const el = document.querySelector(s);
        if (!el) { r[s] = 'MISSING'; continue; }
        const cs = getComputedStyle(el), o = {};
        for (const k of PROPS) o[k] = cs[k];
        /* ⚠️ THE LAYOUT BOX, NOT THE PAINTED ONE. getBoundingClientRect returns the SCALED
           rect — every card in the ring is scaled, and the tick carries a scale of its own —
           while transform-origin resolves against the UNSCALED box. Dividing one by the
           other reported the tick's `top right` as 2.01 of its width in one file and 2.00 in
           the other, which is a rounding artefact dressed up as a design difference.
           offsetWidth is the right denominator; SVG elements have none, so they keep the
           raw value, which is safe because neither file scales them. */
        const [ox, oy] = cs.transformOrigin.split(' ').map(parseFloat);
        const w = el.offsetWidth, h = el.offsetHeight;
        /* ⚠️ ONE DECIMAL PLACE, AND THAT IS NOT LAZINESS. The lab's foot still prints its own
           tally and this page's does not, so the two rows differ by a pixel of height and a
           half-pixel origin reads as 0.50 against 0.49. What this property is guarding is
           whether a card is anchored by its FOOT or its middle — 0.5 1.0 against 0.5 0.5 —
           and one place separates those with room to spare. Tightening it to two buys
           nothing and fails on arithmetic. */
        o[ORIGIN] = (w && h) ? `${(ox / w).toFixed(1)} ${(oy / h).toFixed(1)}`
                             : cs.transformOrigin;
        r[s] = o;
      }
      return r;
    }, [SEL, PROPS, ORIGIN]);
    await p.close();
    return out;
  }

  console.log('\n\x1b[1mthe lab and the live page, element by element\x1b[0m');
  const lab  = await grab(base + 'section04-hybrid.html');
  const live = await grab(base + 'index.html');

  for (const s of SEL) {
    if (lab[s] === 'MISSING' || live[s] === 'MISSING') {
      lab[s] === live[s]
        ? ok(`${s} — absent from both`)
        : bad(`${s} is in the ${lab[s] === 'MISSING' ? 'live page' : 'lab'} only`);
      continue;
    }
    const diffs = [...PROPS, ORIGIN].filter(k => lab[s][k] !== live[s][k]);
    if (!diffs.length) { if (VERBOSE) ok(s); else pass++; continue; }
    bad(s, `${diffs.length} propert${diffs.length === 1 ? 'y' : 'ies'} differ`);
    for (const k of diffs) console.log(`       ${k}\n         lab  ${lab[s][k]}\n         live ${live[s][k]}`);
  }
  if (!VERBOSE && !fail) console.log(`  \x1b[32m✓\x1b[0m all ${SEL.length} agree (--verbose lists them)`);

  await browser.close();
  server.close();
  console.log(`\n\x1b[1m${pass} agreed, ${fail} differ\x1b[0m\n`);
  process.exit(fail ? 1 : 0);
};
run().catch(e => { console.error(e); process.exit(1); });
