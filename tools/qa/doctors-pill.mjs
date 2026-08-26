/* ═══ tools/qa/doctors-pill.mjs — ONE "Book a consultation" in the doctors chapter ═══
   His call 2026-08-24: "for all the ones containing doctors it should only have one book
   consultation across all pages". Five pages render a doctors chapter and every one of
   them used to carry a pill under each name — nineteen pills across the estate. There is
   one per chapter now, under the row.

   THIS CHECK EXISTS BECAUSE THE RULE IT GUARDS HAS ALREADY BEEN REVERSED ONCE. The
   per-card pill was his call on 2026-08-14 and was recorded then as a deliberate override
   of the estate's one-pill-per-section rule; it came back out on 2026-08-24. A rule that
   has flipped once flips again, and the page it flips on next will be whichever of the
   five somebody edits without reading the other four.

   What it asserts, per page:
     · no `.doc .btn` anywhere — not one card carries a pill
     · exactly one `.docs-cta .btn`, inside #doctors, pointing at #book
     · every doctor still has a `<template class="doc-detail">` and an (i) button, because
       the popup is now the ONLY per-doctor route and losing it would leave a reader with
       no way to reach one named doctor at all
     · the popup's own `.pxd-cta` survives in each template — one doctor on screen, one
       pill, which is the exception the rule was always written to allow
     · zero page errors, zero 404s

       npm install --no-save playwright@1.49.1
       node tools/qa/doctors-pill.mjs [--shots]

   Shots (with --shots) land in .qa-out/doctors/ (gitignored). Exits non-zero on failure. */
import { chromium } from 'playwright';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';

const ROOT  = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHOTS = process.argv.includes('--shots');
const OUT   = path.join(ROOT, '.qa-out', 'doctors');
if (SHOTS) mkdirSync(OUT, { recursive: true });

const MIME = { html:'text/html', js:'text/javascript', mjs:'text/javascript', css:'text/css',
  webp:'image/webp', avif:'image/avif', png:'image/png', jpg:'image/jpeg', svg:'image/svg+xml',
  woff2:'font/woff2', ico:'image/x-icon', json:'application/json', mp4:'video/mp4' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f).slice(1)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise(r => srv.listen(0, r));
const port = srv.address().port;

/* the doctor count is page-specific and is asserted, not discovered: three on the men's
   door (Dr. Nahla, a gynaecologist, is off it — editorial judgement, recorded), three on
   the two women's doors, four on the two that still carry the peptide set. A page that
   silently loses a doctor should fail here too. */
const PAGES = [
  /* ⚠️ THREE SINCE 2026-08-26, AND THEY ARE DOOR 1's THREE, VERBATIM — his call on
     Irina's comments, "it should all just be women … copy exactly the doctors on hormone
     balancing BHRT". Dr. Andrey, Dr. Eslam and Dr. Khalid came off THIS PAGE ONLY and
     still live whole on /peptide-therapy/, /functional-medicine/ and
     /testosterone-top-up/. doors-shots.mjs asserts the three names and their order. */
  { slug: 'modern-menopause',     docs: 3 },
  /* ⚠️ THREE SINCE 2026-08-24f — his call, three women (Dr. V · Dr. N · Dr. D).
     bhrt-shots.mjs asserts the names and the order. */
  { slug: 'hormone-therapy-bhrt', docs: 3 },
  { slug: 'testosterone-top-up',  docs: 3 },
  { slug: 'functional-medicine',  docs: 4 },
  { slug: 'peptide-therapy',      docs: 4 },
];

let failures = 0;
const fail = m => { failures++; console.error('  ✗ ' + m); };
const pass = m => console.log('  ✓ ' + m);

const browser = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });

/* 1181 is the row's own cliff — four portraits in a line above it, two below, one on a
   phone. The pill is centred under the row at all three, so all three are visited. */
const SIZES = [[1440, 900, 'desktop'], [1000, 900, 'tablet'], [390, 844, 'phone']];

for (const P of PAGES) {
  console.log('\n' + P.slug);
  for (const [w, h, label] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(String(e)));
    const bad  = []; page.on('response', r => { if (r.status() >= 400) bad.push(r.url()); });
    await page.goto(`http://127.0.0.1:${port}/${P.slug}/?probe=1`, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    await page.waitForFunction(() => { const p = document.querySelector('.preloader');
      return !p || getComputedStyle(p).display === 'none'; }, null, { timeout: 8000 }).catch(() => {});
    /* the portraits are lazy — scroll the chapter into view so they are actually fetched,
       or "no 404s" is a claim about requests that were never made */
    await page.evaluate(() => document.getElementById('doctors')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(900);
    await page.evaluate(() => Promise.all([...document.querySelectorAll('#doctors img')]
      .map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })))).catch(() => {});

    const d = await page.evaluate(() => {
      const sec = document.getElementById('doctors');
      const tpl = [...sec.querySelectorAll('template.doc-detail')];
      const cta = sec.querySelectorAll('.docs-cta .btn');
      return {
        cardPills:  sec.querySelectorAll('.doc .btn').length,
        pagePills:  document.querySelectorAll('.doc .btn').length,
        chapterCta: cta.length,
        ctaInside:  cta.length === 1 && sec.contains(cta[0]),
        ctaHref:    cta[0]?.getAttribute('href') || '',
        ctaText:    (cta[0]?.textContent || '').replace(/\s+/g, ' ').trim(),
        ctaVisible: cta.length === 1 && cta[0].getBoundingClientRect().width > 40,
        docs:       sec.querySelectorAll('.doc').length,
        info:       sec.querySelectorAll('.doc .doc-info').length,
        templates:  tpl.length,
        popupPills: tpl.filter(t => t.content.querySelector('.pxd-cta .btn[href="#book"]')).length,
        brokenImg:  [...sec.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0)
                      .map(i => i.getAttribute('src')),
      };
    });

    const T = `${label} ${w}px`;
    const before = failures;
    if (d.cardPills || d.pagePills) fail(`${T}: ${d.pagePills} pill(s) still on doctor cards`);
    if (d.chapterCta !== 1)         fail(`${T}: ${d.chapterCta} chapter pills, expected 1`);
    if (!d.ctaInside)               fail(`${T}: the chapter pill is not inside #doctors`);
    if (d.ctaHref !== '#book')      fail(`${T}: the chapter pill points at "${d.ctaHref}", not #book`);
    if (!/^Book a consultation/.test(d.ctaText)) fail(`${T}: the chapter pill says "${d.ctaText}"`);
    if (!d.ctaVisible)              fail(`${T}: the chapter pill has no width`);
    if (d.docs !== P.docs)          fail(`${T}: ${d.docs} doctors, expected ${P.docs}`);
    if (d.info !== P.docs)          fail(`${T}: ${d.info} (i) buttons for ${P.docs} doctors`);
    if (d.templates !== P.docs)     fail(`${T}: ${d.templates} popups for ${P.docs} doctors`);
    if (d.popupPills !== P.docs)    fail(`${T}: ${d.popupPills} popups carry their own pill, expected ${P.docs}`);
    if (d.brokenImg.length)         fail(`${T}: portrait did not load → ${d.brokenImg.join(', ')}`);
    if (errs.length)                fail(`${T}: page errors → ${errs.join(' | ').slice(0, 200)}`);
    if (bad.length)                 fail(`${T}: ${[...new Set(bad)].join(' ').slice(0, 200)}`);
    if (failures === before) pass(`${T}: 0 card pills · 1 chapter pill → #book · ${P.docs} doctors, ${P.docs} popups`);

    if (SHOTS) {
      const el = await page.$('#doctors');
      await el.screenshot({ path: path.join(OUT, `${P.slug}-${label}.png`) });
    }
    await ctx.close();
  }
}

/* the popup is the only per-doctor route now, so it is opened for real once — a template
   that is present but does not fill the shell is a chapter with no way into one doctor */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/modern-menopause/?probe=1`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.waitForFunction(() => { const p = document.querySelector('.preloader');
    return !p || getComputedStyle(p).display === 'none'; }, null, { timeout: 8000 }).catch(() => {});
  await page.evaluate(() => document.getElementById('doctors').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(400);
  await page.click('.doc:first-child .doc-info');
  await page.waitForTimeout(600);
  const open = await page.evaluate(() => {
    const p = document.getElementById('pxd');
    const cta = p.querySelectorAll('.pxd-cta .btn');
    return { shown: !p.hasAttribute('hidden'), name: p.querySelector('h3')?.textContent.trim(),
             pills: cta.length, href: cta[0]?.getAttribute('href') };
  });
  console.log('\npopup');
  if (!open.shown)            fail('the (i) did not open the doctor popup');
  else if (open.pills !== 1)  fail(`the popup carries ${open.pills} pills, expected 1`);
  else if (open.href !== '#book') fail(`the popup pill points at "${open.href}"`);
  else pass(`opens on ${open.name} with one pill → #book`);
  await ctx.close();
}

await browser.close();
srv.close();
console.log(failures ? `\n${failures} failure(s)` : '\nall green — one pill per chapter on all five pages');
process.exit(failures ? 1 : 0);
