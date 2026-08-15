/* Bond-lab QA — walk every plate in the built lab and prove it is actually there.

     npm install --no-save three@0.166.1 playwright@1.49.1 sharp
     node tools/qa/bonds-lab.mjs                 # the committed repo copy
     node tools/qa/bonds-lab.mjs --artifact      # the generated artifact copy, network blocked

   Two things this learned the hard way and must not forget:

   1 · MEASURE THE SCREENSHOT, NOT THE CANVAS. A WebGL canvas created without
       preserveDrawingBuffer reads back as pure black once the frame has been composited, so
       canvas readback reports every chapter-II and -III plate as "not drawing". The screenshot
       is also the more honest surface — it carries the glacier .tint multiply and the
       legibility veil, so a plate that draws and is then washed flat still fails here.

   2 · CHROMIUM NEEDS SWIFTSHADER FLAGS HEADLESS, or every WebGL plate silently falls back to
       its static wash and the run passes while testing nothing.

   Paths are derived and Chromium is searched for, never pinned — the first harness in this
   repo hardcoded a home directory and crashed before measuring anything on any other machine. */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import http from 'http'; import path from 'path'; import fs from 'fs';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const OUT  = process.env.OUT || path.join(ROOT, '.qa-out');
fs.mkdirSync(OUT, { recursive: true });

const ARTIFACT = process.argv.includes('--artifact');
const LAB_REL  = 'peptide-therapy/bonds-lab.html';
const ART_ABS  = path.join(ROOT, '.lab-dev', 'out', 'bond-lab-artifact.html');

const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2',
  '.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.ico':'image/x-icon' };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  r.end(readFileSync(f));
});
await new Promise(r => srv.listen(8124, r));

const CHROME = process.env.CHROME ||
  ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
   '/opt/pw-browsers/chromium/chrome-linux/chrome'].find(p => fs.existsSync(p));
const browser = await chromium.launch({
  ...(CHROME ? { executablePath: CHROME } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
         '--enable-webgl', '--ignore-gpu-blocklist']
});

let bad = 0;
const url = ARTIFACT ? 'file://' + ART_ABS : `http://localhost:8124/${LAB_REL}`;

async function stats(page) {
  const png = await page.screenshot();
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let n = 0, min = 255, max = 0, r = 0, g = 0, b = 0, warm = 0;
  const buf = [];
  for (let i = 0; i < data.length; i += ch * 37) {
    n++; r += data[i]; g += data[i+1]; b += data[i+2];
    const l = data[i]*.2126 + data[i+1]*.7152 + data[i+2]*.0722;
    if (l < min) min = l; if (l > max) max = l;
    if (data[i] - data[i+2] > 22) warm++;
    buf.push(l);
  }
  return { mean:[Math.round(r/n),Math.round(g/n),Math.round(b/n)],
           spread: Math.round(max-min), warmPct: 100*warm/n, buf };
}

async function run(label, w, h) {
  const ctx = await browser.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1,
                                         isMobile:w<500, hasTouch:w<500 });
  /* The artifact must be self-contained: block everything that is not the file itself. */
  if (ARTIFACT) await ctx.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));

  await page.goto(url, { waitUntil:'load' });
  /* The lab scrolls smoothly for humans. Under a harness that means scrollIntoView() returns
     immediately and the screenshot lands mid-flight — which is exactly how W and Z once got
     reported FLAT with an 89% "motion" reading: the frame was a blank gap between plates. */
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await page.waitForTimeout(2200);

  const meta = await page.evaluate(() => ({
    order: window.__PLATE_ORDER || [],
    three: typeof window.THREE !== 'undefined' ? 'r' + window.THREE.REVISION : 'MISSING',
    fell: [...document.querySelectorAll('.plate.nogl')].map(e => e.id),
    bands: document.querySelectorAll('.band').length,
  }));

  console.log(`\n──────── ${label}  ${w}x${h} ────────`);
  console.log(`  three ${meta.three}   chapters ${meta.bands}   plates ${meta.order.length}`);
  if (meta.three === 'MISSING') { console.log('  !! three.js did not load — chapter II cannot be judged'); bad++; }
  if (meta.fell.length) { console.log(`  !! fell back to a static wash: ${meta.fell.join(' ').toUpperCase()}`); bad++; }

  for (const id of meta.order) {
    /* Scroll, then WAIT FOR THE PLATE TO ACTUALLY BE THERE before believing any number. */
    await page.evaluate(id => document.getElementById(id).scrollIntoView(), id);
    await page.waitForFunction(id => {
      const r = document.getElementById(id).getBoundingClientRect();
      return Math.abs(r.top) < 4;
    }, id, { timeout: 5000 }).catch(() => { console.log(`  !! ${id.toUpperCase()}: never settled in view`); bad++; });
    await page.waitForTimeout(950);
    const a = await stats(page);
    /* 2.4s, not 0.75s — Z breathes on a 34-second cycle and a sub-second window calls it
       frozen. The slowest plate sets this number, not the fastest. */
    await page.waitForTimeout(2400);
    const b2 = await stats(page);
    let chg = 0;
    for (let i = 0; i < a.buf.length; i++) if (Math.abs(a.buf[i] - b2.buf[i]) > 2   /* renders are deterministic and PNG is lossless: any delta is real motion, and a smooth-gradient plate never shifts a pixel by 4 */) chg++;
    const moved = 100 * chg / a.buf.length;
    const flat = a.spread < 12, still = moved <= 0.05;
    if (flat || still) bad++;
    console.log(`  ${id.toUpperCase().padEnd(2)}  spread ${String(a.spread).padStart(3)}  ` +
                `moved ${moved.toFixed(2).padStart(5)}%  accent-px ${a.warmPct.toFixed(3)}%` +
                `${flat ? '   !! FLAT' : ''}${still ? '   !! STILL' : ''}`);
    await page.screenshot({ path: path.join(OUT, `lab-${label}-${id}.png`) });
  }

  const sw = await page.evaluate(() => ({ s:document.documentElement.scrollWidth, c:document.documentElement.clientWidth }));
  if (sw.s > sw.c) { console.log(`  !! HORIZONTAL SCROLL ${sw.s} > ${sw.c}`); bad++; }
  else console.log(`  no horizontal scroll (${sw.s} = ${sw.c})`);
  if (errs.length) { console.log('  !! ERRORS:', [...new Set(errs)].slice(0,6)); bad++; }
  else console.log('  console: clean');

  await ctx.close();
}

await run('desktop', 1440, 900);
await run('phone',    390, 844);

/* The accent bar must actually re-colour the plates. Counting "warm" pixels across the whole
   frame does not prove that: the burgundy CTA is warm, large, and constant, and on a phone it
   swamps a few hundred small accent discs. Diff the two frames instead — whatever changes when
   the bar is clicked IS the accent, whatever it is made of. */
{
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
  if (ARTIFACT) await ctx.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil:'load' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await page.waitForTimeout(1600);

  console.log(`\n──────── accent bar ────────`);
  /* U carries a single big accent residue and V an edge-light: between them they prove the
     bar reaches both a chapter-I-style mesh plate and a chapter-II one. */
  for (const id of ['d', 'u']) {
    await page.evaluate(id => document.getElementById(id).scrollIntoView(), id);
    await page.waitForTimeout(1200);
    await page.evaluate(() => { document.documentElement.dataset.accent = 'gold'; });
    await page.waitForTimeout(700);
    const g = await page.screenshot();
    await page.click('.accents [data-accent="steel"]');
    await page.waitForTimeout(700);
    const st = await page.screenshot();
    await page.click('.accents [data-accent="gold"]');

    const A = await sharp(g).raw().toBuffer({ resolveWithObject: true });
    const B = await sharp(st).raw().toBuffer({ resolveWithObject: true });
    const ch = A.info.channels;
    let diff = 0, n = 0;
    for (let i = 0; i < A.data.length; i += ch * 7) {
      n++;
      /* compare the RED-minus-BLUE axis: gold and steel differ in temperature, and that
         axis ignores the frame-to-frame motion of the plate itself, which is achromatic */
      const wa = A.data[i] - A.data[i+2], wb = B.data[i] - B.data[i+2];
      if (Math.abs(wa - wb) > 12) diff++;
    }
    const pct = 100 * diff / n;
    console.log(`  ${id.toUpperCase()}  pixels re-coloured: ${pct.toFixed(3)}%`);
    if (pct < 0.05) { console.log(`  !! the bar did not reach plate ${id.toUpperCase()}`); bad++; }
  }
  await page.screenshot({ path: path.join(OUT, 'lab-steel.png') });
  await ctx.close();
}


/* The fixed accent bar and the pinned spec chip must never claim the same pixels. Below 761
   the chip joins the flow and scrolls, so a bar passing over it is ordinary; at and above 761
   it is pinned inside a 100svh plate and cannot be scrolled clear, so an overlap there is a
   real defect. Geometry, because this is exactly the class of bug eyeballing one width misses:
   at 768 the bar WRAPS to two rows and clipped a chip lifted for the one-row height. */
{
  console.log(`\n──────── bar / chip geometry ────────`);
  for (const w of [390, 560, 768, 900, 1024, 1180, 1280, 1440, 1920]) {
    const ctx = await browser.newContext({ viewport:{width:w, height:900} });
    if (ARTIFACT) await ctx.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil:'load' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
    await page.evaluate(() => document.getElementById('u').scrollIntoView());
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => {
      const s = document.querySelector('#u .spec').getBoundingClientRect();
      const a = document.querySelector('.accents').getBoundingClientRect();
      return !(s.right < a.left || s.left > a.right || s.bottom < a.top || s.top > a.bottom);
    });
    const pinned = w >= 761;
    if (r && pinned) { console.log(`  ${String(w).padStart(5)}  !! OVERLAP`); bad++; }
    else console.log(`  ${String(w).padStart(5)}  ${r ? 'overlaps (in flow — scrolls clear, ok)' : 'clear'}`);
    await ctx.close();
  }
}

console.log(`\n${bad === 0 ? 'ALL CLEAR' : bad + ' PROBLEM(S)'}`);
await browser.close(); srv.close();
process.exit(bad === 0 ? 0 : 1);
