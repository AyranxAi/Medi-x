// Render each generated SVG with brand fonts, screenshot it, and pair it
// side-by-side with a live screenshot of the same section for comparison.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'http://127.0.0.1:8321';
const SVGDIR = 'svg-out';
const OUT = 'verify-out';
fs.mkdirSync(OUT, { recursive: true });

const fontData = f =>
  'data:font/woff2;base64,' + fs.readFileSync(`/home/user/Medi-x/fonts/${f}`).toString('base64');
const FONT_CSS = `
@font-face{font-family:"MediGyn NOW";src:url(${fontData('medigyn-now-300.woff2')});font-weight:300}
@font-face{font-family:"MediGyn NOW";src:url(${fontData('medigyn-now-400.woff2')});font-weight:400}
@font-face{font-family:"MediGyn NOW";src:url(${fontData('medigyn-now-500.woff2')});font-weight:500}
@font-face{font-family:"MediGyn NOW";src:url(${fontData('medigyn-now-700.woff2')});font-weight:700}
@font-face{font-family:"MediGyn Megante";src:url(${fontData('medigyn-megante-400.woff2')});font-weight:400}
`;

const browser = await chromium.launch();

// -- pass 1: live section references ----------------------------------------
for (const vp of [
  { tag: 'desktop', width: 1440, height: 900, mobile: false },
  { tag: 'mobile', width: 390, height: 844, mobile: true },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile,
  });
  const page = await ctx.newPage();
  await page.goto(SITE + '/index.html', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation-duration:0s!important}' });
  const frames = await page.evaluate(() => {
    const f = [];
    const names = { s1: '01-hero', s2: '02-solutions', s3: '03-conversation', s4: '04-pathways',
      s5: '05-team', s6: '06-products', s7: '07-events', s8: '08-press' };
    for (const id of Object.keys(names)) {
      const el = document.getElementById(id);
      if (el) { const r = el.getBoundingClientRect(); f.push({ name: names[id], top: Math.round(r.top + scrollY), h: Math.round(r.height) }); }
    }
    const sb = document.querySelector('.sband');
    if (sb) { const r = sb.getBoundingClientRect(); f.push({ name: '09-sponsors', top: Math.round(r.top + scrollY), h: Math.round(r.height) }); }
    let foot = null;
    for (const el of document.querySelectorAll('footer'))
      if (!foot || el.getBoundingClientRect().height > foot.getBoundingClientRect().height) foot = el;
    if (foot) { const r = foot.getBoundingClientRect(); f.push({ name: '10-footer', top: Math.round(r.top + scrollY), h: Math.round(r.height) }); }
    return f;
  });
  for (const f of frames) {
    await page.evaluate(y => window.scrollTo(0, y), f.top);
    await page.waitForTimeout(450);
    const buf = await page.screenshot({ fullPage: true,
      clip: { x: 0, y: f.top, width: vp.width, height: f.h } });
    fs.writeFileSync(path.join(OUT, `ref-${vp.tag}-${f.name}.png`), buf);
  }
  await ctx.close();
}

// -- pass 2: render generated SVGs ------------------------------------------
const svgFiles = fs.readdirSync(SVGDIR).filter(f => f.endsWith('.svg'));
for (const file of svgFiles) {
  const svg = fs.readFileSync(path.join(SVGDIR, file), 'utf8');
  const m = svg.match(/width="(\d+)" height="(\d+)"/);
  const w = parseInt(m[1]), h = parseInt(m[2]);
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&family=Cormorant+Garamond:ital,wght@1,300;1,500&display=swap" rel="stylesheet">
<style>${FONT_CSS} body{margin:0}</style></head><body>${svg}</body></html>`;
  const tmp = path.join(OUT, `.render-${file}.html`);
  fs.writeFileSync(tmp, html);
  const ctx = await browser.newContext({ viewport: { width: w, height: Math.min(h, 4000) }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file://' + path.resolve(tmp), { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(async () => {
    const loads = [];
    for (const w of [300, 400, 500, 700]) loads.push(document.fonts.load(`${w} 16px "MediGyn NOW"`));
    loads.push(document.fonts.load('400 16px "MediGyn Megante"'));
    for (const w of [300, 400, 450, 500, 600, 700]) {
      loads.push(document.fonts.load(`${w} 16px "Playfair"`));
      loads.push(document.fonts.load(`italic ${w} 16px "Playfair"`));
    }
    loads.push(document.fonts.load('italic 300 16px "Cormorant Garamond"'));
    loads.push(document.fonts.load('italic 500 16px "Cormorant Garamond"'));
    await Promise.allSettled(loads);
    await document.fonts.ready;
  });
  await page.waitForTimeout(600);
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: w, height: h } });
  fs.writeFileSync(path.join(OUT, `svg-${file.replace('.svg', '')}.png`), buf);
  await ctx.close();
  fs.unlinkSync(tmp);
}
await browser.close();

// -- pass 3: side-by-side pairs ---------------------------------------------
for (const file of svgFiles) {
  const base = file.replace('.svg', '');
  const ref = path.join(OUT, `ref-${base}.png`);
  const gen = path.join(OUT, `svg-${base}.png`);
  if (!fs.existsSync(ref) || !fs.existsSync(gen)) { console.log('missing pair for', base); continue; }
  execFileSync('python3', ['-c', `
from PIL import Image
a = Image.open(${JSON.stringify(ref)}); b = Image.open(${JSON.stringify(gen)})
h = max(a.height, b.height)
gap = 24
canvas = Image.new('RGB', (a.width + b.width + gap, h), (255, 0, 0))
canvas.paste(a, (0, 0)); canvas.paste(b, (a.width + gap, 0))
w = 900
canvas.resize((w, int(canvas.height * w / canvas.width)), Image.LANCZOS).save(${JSON.stringify(path.join(OUT, 'pair-' + base + '.png'))}, optimize=True)
`]);
  console.log('pair-' + base + '.png');
}
console.log('done');
