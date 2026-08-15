/* Bond-lab QA — does every plate draw, animate, and stay clean?
   Same contract as hero-ground.mjs: derived paths, a searched-for Chromium, luma SPREAD
   rather than a bare mean (a plate that failed to draw is flat, and a mean cannot see that),
   and two samples to prove motion. Screenshots land in OUT for the by-eye pass, which is
   the part that actually decides anything. */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import http from 'http'; import path from 'path'; import fs from 'fs';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
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
await new Promise(r => srv.listen(8124, r));

const CHROME = process.env.CHROME ||
  ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
   '/opt/pw-browsers/chromium/chrome-linux/chrome'].find(p => fs.existsSync(p));
const browser = await chromium.launch({ ...(CHROME?{executablePath:CHROME}:{}) });

const PLATES = ['d','o','p','q','r','s','t'];

async function run(label, w, h) {
  const ctx = await browser.newContext({viewport:{width:w,height:h}, deviceScaleFactor:1, isMobile:w<500, hasTouch:w<500});
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));

  await page.goto('http://localhost:8124/peptide-therapy/bonds-lab.html', {waitUntil:'load'});
  await page.waitForTimeout(1200);

  /* Returns stats AND a downsampled luma buffer. A rounded mean cannot see a slow plate —
     P's ligand barely moves while it is bound, and 700ms of that reads as a frozen frame —
     so motion is judged by counting pixels that actually changed, not by summary numbers. */
  const probe = async id => await page.evaluate(id => {
    const cv = document.getElementById('cv-'+id);
    if (!cv) return {err:'missing'};
    const off = document.createElement('canvas'); off.width=cv.width; off.height=cv.height;
    off.getContext('2d').drawImage(cv,0,0);
    const d = off.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
    let r=0,g=0,b=0,n=0,min=255,max=0,warm=0;
    const buf=[];
    for (let i=0;i<d.length;i+=4*89){
      r+=d[i]; g+=d[i+1]; b+=d[i+2]; n++;
      const l=(d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722);
      if(l<min)min=l; if(l>max)max=l;
      if(d[i]-d[i+2] > 22) warm++;              /* an accent pixel, gold side */
      buf.push(l);
    }
    return {mean:[Math.round(r/n),Math.round(g/n),Math.round(b/n)],
            spread:Math.round(max-min), warm, n, buf};
  }, id);

  console.log(`\n──────── ${label}  ${w}x${h} ────────`);
  let bad = 0;
  for (const id of PLATES) {
    await page.evaluate(id => document.getElementById(id).scrollIntoView(), id);
    await page.waitForTimeout(900);
    const a = await probe(id);
    await page.waitForTimeout(700);
    const b = await probe(id);
    let changed = 0;
    for (let i=0;i<a.buf.length;i++) if (Math.abs(a.buf[i]-b.buf[i]) > 4) changed++;
    const pct = 100*changed/a.buf.length;
    const moved = pct > 0.05;
    const flat = a.spread < 12;
    if (flat || !moved) bad++;
    console.log(`  ${id.toUpperCase()}  spread ${String(a.spread).padStart(3)}  moved ${pct.toFixed(2).padStart(5)}%  mean rgb(${a.mean.join(',')})${flat?'   !! FLAT':''}${!moved?'   !! STILL':''}`);
    await page.screenshot({path:`${OUT}/lab-${label}-${id}.png`});
  }
  if (errs.length) { console.log('  !! ERRORS:', [...new Set(errs)].slice(0,6)); bad++; }
  else console.log('  console: clean');

  const sw = await page.evaluate(()=>({s:document.documentElement.scrollWidth, c:document.documentElement.clientWidth}));
  if (sw.s > sw.c) { console.log(`  !! HORIZONTAL SCROLL ${sw.s} > ${sw.c}`); bad++; }
  else console.log(`  no horizontal scroll (${sw.s} = ${sw.c})`);

  await ctx.close();
  return bad;
}

let bad = 0;
bad += await run('desktop', 1440, 900);
bad += await run('phone',    390, 844);

/* the accent bar must actually re-colour the plates */
{
  const ctx = await browser.newContext({viewport:{width:1440,height:900}});
  const page = await ctx.newPage();
  await page.goto('http://localhost:8124/peptide-therapy/bonds-lab.html', {waitUntil:'load'});
  await page.evaluate(()=>document.getElementById('d').scrollIntoView());
  await page.waitForTimeout(900);
  /* Averaging the whole frame washes the switch out — the accent is a few hundred small
     discs on a large neutral ground. Count the strongly-warm pixels instead: a gold node
     runs R-B ≈ +100, a steel one ≈ -44, so the population should collapse. */
  const warmCount = async () => await page.evaluate(()=>{
    const cv=document.getElementById('cv-d');
    const off=document.createElement('canvas'); off.width=cv.width; off.height=cv.height;
    off.getContext('2d').drawImage(cv,0,0);
    const d=off.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
    let warm=0,n=0;
    for(let i=0;i<d.length;i+=4*11){ n++; if(d[i]-d[i+2] > 22) warm++; }
    return 100*warm/n;
  });
  const gold = await warmCount();
  await page.click('.accents [data-accent="steel"]');
  await page.waitForTimeout(700);
  const steel = await warmCount();
  console.log(`\n──────── accent bar ────────`);
  console.log(`  warm pixels: gold ${gold.toFixed(3)}%  steel ${steel.toFixed(3)}%`);
  if (!(gold > steel*2 + .01)) { console.log('  !! the bar did not cool the plate'); bad++; }
  else console.log('  the bar re-colours the plates');
  await page.screenshot({path:`${OUT}/lab-steel-d.png`});
  await ctx.close();
}

console.log(`\n${bad===0 ? 'ALL CLEAR' : bad + ' PROBLEM(S)'}`);
await browser.close(); srv.close();
process.exit(bad===0?0:1);
