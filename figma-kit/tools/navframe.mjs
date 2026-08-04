// Capture the open nav overlay as an extra frame per viewport.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'http://127.0.0.1:8321';
const OUT = 'svg-out';
const SERIALIZER = fs.readFileSync('serializer-snippet.js', 'utf8');

const browser = await chromium.launch();
for (const vp of [
  { tag: 'desktop', width: 1440, height: 900, mobile: false },
  { tag: 'mobile', width: 390, height: 844, mobile: true },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2, isMobile: vp.mobile, hasTouch: vp.mobile,
  });
  const page = await ctx.newPage();
  await page.goto(SITE + '/index.html', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation-duration:0s!important}' });
  // find and click the hamburger
  const burger = await page.evaluate(() => {
    const el = document.querySelector('button.burger');
    if (!el) return null;
    el.setAttribute('data-burger', '1');
    return { cls: el.className, tag: el.tagName };
  });
  if (!burger) { console.log(vp.tag, 'no burger found'); await ctx.close(); continue; }
  await page.click('[data-burger="1"]');
  await page.waitForTimeout(800);
  const navState = await page.evaluate(() => {
    const nav = document.getElementById('nav');
    if (!nav) return null;
    const cs = getComputedStyle(nav);
    const r = nav.getBoundingClientRect();
    return { vis: cs.visibility, op: cs.opacity, disp: cs.display, w: Math.round(r.width), h: Math.round(r.height), cls: nav.className };
  });
  console.log(vp.tag, 'burger:', JSON.stringify(burger), 'nav:', JSON.stringify(navState));
  if (!navState || navState.vis === 'hidden' || navState.op === '0' || navState.disp === 'none') {
    console.log(vp.tag, 'nav did not open, skipping'); await ctx.close(); continue;
  }
  // preload bg dims (nav may use images)
  await page.evaluate(async () => {
    window.__bgDims = {};
    const urls = new Set();
    for (const el of document.querySelectorAll('*')) {
      const bi = getComputedStyle(el).backgroundImage;
      if (bi && bi.includes('url(')) for (const m of bi.matchAll(/url\("?([^")]+)"?\)/g)) urls.add(m[1]);
    }
    await Promise.allSettled([...urls].map(u => new Promise(res => {
      const im = new Image();
      im.onload = () => { window.__bgDims[u] = [im.naturalWidth, im.naturalHeight]; res(); };
      im.onerror = res; im.src = u;
    })));
  });
  await page.evaluate(SERIALIZER);
  const res = await page.evaluate(
    ([w, h]) => window.__ser.serializeFrame(['#nav'], 0, window.scrollY, w, h), [vp.width, vp.height]);
  fs.writeFileSync(path.join(OUT, `${vp.tag}-11-nav-menu.svg.tmp`), JSON.stringify({ svg: res.svg, jobs: res.rasterJobs.length }));
  console.log(vp.tag, 'nav svg bytes:', res.svg.length, 'jobs:', res.rasterJobs.length);
  // reference screenshot of open nav
  const buf = await page.screenshot();
  fs.writeFileSync(`verify-out/ref-${vp.tag}-11-nav-menu.png`, buf);
  await ctx.close();
}
await browser.close();
console.log('done');
