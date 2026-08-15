/* Round-10 hero QA — is plate D actually drawing, and is the page still clean?
   Same shape as tools/qa/scene-shots.mjs: serve the repo, fulfil the CDN from node_modules,
   drive it with a real Chromium. Three is deliberately NOT mapped — if anything still asks
   for it the request aborts and shows up as an error, which is the point. */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import http from 'http'; import path from 'path'; import fs from 'fs';
import { fileURLToPath } from 'url';

/* Paths are derived, never hardcoded — the sister harness pinned a home directory and a
   sandbox scratchpad, and it crashed on anyone else's machine before measuring anything.
   ROOT is the repo (two levels up from tools/qa/); OUT defaults beside it and is
   overridable with OUT=… for CI. */
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const NM   = path.join(ROOT, 'node_modules');
const OUT  = process.env.OUT || path.join(ROOT, '.qa-out');
fs.mkdirSync(OUT, {recursive:true});
const MIME = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml',
  '.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.ico':'image/x-icon','.png':'image/png'};

const srv = http.createServer((q,r)=>{
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, {'Content-Type': MIME[path.extname(f)] || 'application/octet-stream'});
  r.end(readFileSync(f));
});
await new Promise(r => srv.listen(8123, r));

const MAP = [
  [/gsap@3\.13\.0\/dist\/gsap\.min\.js/, `${NM}/gsap/dist/gsap.min.js`],
  [/ScrollTrigger\.min\.js/,             `${NM}/gsap/dist/ScrollTrigger.min.js`],
  [/SplitText\.min\.js/,                 `${NM}/gsap/dist/SplitText.min.js`],
  [/lenis@1\.3\.4\/dist\/lenis\.min\.js/,`${NM}/lenis/dist/lenis.min.js`],
];

/* Find a Chromium rather than pinning one: CHROME=… wins, then Playwright's own download,
   then the sandbox image's. Pinning is what broke the sister script on macOS. */
const CHROME = process.env.CHROME ||
  ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
   '/opt/pw-browsers/chromium/chrome-linux/chrome']
  .find(p => fs.existsSync(p));
const browser = await chromium.launch({
  ...(CHROME ? {executablePath: CHROME} : {}),
  args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});

let threeAsked = false;

async function run(label, w, h, reduce) {
  const ctx = await browser.newContext({
    viewport:{width:w,height:h}, deviceScaleFactor:1,
    isMobile:w<500, hasTouch:w<500,
    reducedMotion: reduce ? 'reduce' : 'no-preference'
  });
  await ctx.route('**/cdn.jsdelivr.net/**', route => {
    const u = route.request().url();
    if (/three/.test(u)) { threeAsked = true; return route.abort(); }
    for (const [re,f] of MAP) if (re.test(u)) return route.fulfill({status:200,contentType:'text/javascript',body:readFileSync(f)});
    return route.abort();
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));

  await page.goto('http://localhost:8123/peptide-therapy/', {waitUntil:'load'});
  await page.waitForTimeout(2600);

  /* Read the hero canvas back. A ground that failed to draw is either uniform (one flat
     colour) or transparent — so measure spread, not just mean. Two samples 900ms apart
     tell us whether it is animating. */
  const probe = async () => await page.evaluate(() => {
    const cv = document.getElementById('silk');
    if (!cv) return {err:'no #silk'};
    const w = cv.width, h = cv.height;
    const off = document.createElement('canvas'); off.width=w; off.height=h;
    off.getContext('2d').drawImage(cv,0,0);
    const d = off.getContext('2d').getImageData(0,0,w,h).data;
    let r=0,g=0,b=0,n=0, min=255, max=0;
    for (let i=0;i<d.length;i+=4*97){            // stride-sample
      r+=d[i]; g+=d[i+1]; b+=d[i+2]; n++;
      const l = (d[i]*.2126 + d[i+1]*.7152 + d[i+2]*.0722);
      if (l<min) min=l; if (l>max) max=l;
    }
    return { w, h, mean:[Math.round(r/n),Math.round(g/n),Math.round(b/n)],
             lumaMin:Math.round(min), lumaMax:Math.round(max),
             spread:Math.round(max-min), alpha:d[3] };
  });

  const a = await probe();
  await page.waitForTimeout(900);
  const b = await probe();
  const moved = JSON.stringify(a.mean) !== JSON.stringify(b.mean) || a.lumaMin !== b.lumaMin;

  console.log(`\n[${label}] ${w}x${h}${reduce?' reduced-motion':''}`);
  console.log(`   canvas ${a.w}x${a.h}  mean rgb(${a.mean.join(',')})  luma ${a.lumaMin}..${a.lumaMax} (spread ${a.spread})`);
  console.log(`   animating: ${moved}   ${reduce ? '(expected: false)' : '(expected: true)'}`);
  if (a.spread < 12) console.log('   !! FLAT — the ground may not be drawing');
  if (errs.length) console.log('   !! ERRORS:', [...new Set(errs)].slice(0,6));
  else console.log('   console: clean');

  await page.screenshot({path:`${OUT}/hero-${label}.png`});
  await ctx.close();
  return {a, moved, errs};
}

await run('desktop', 1440, 900, false);
await run('phone',    390, 844, false);
await run('reduced', 1440, 900, true);

console.log(`\nthree.js requested by the page: ${threeAsked}  (expected: false)`);
await browser.close(); srv.close();
