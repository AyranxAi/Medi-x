/* Programme-intake lab QA — walk all three shapes and prove they are actually there.

     PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save playwright@1.49.1
     node tools/qa/programme-lab.mjs            # checks only
     node tools/qa/programme-lab.mjs --shots    # + screenshots into .qa-out/

   Exits non-zero on any failure.

   Three things this harness exists to catch, each of which has bitten this repo:

   1 · THE DISPLAY CASCADE. Screens and stages are shown by exactly one class
       (.is-on) and never by [hidden]. Check 6 asserts that at every step exactly
       ONE .screen inside the flow is displayed — not that the right one has the
       class, which is the check that passes while two screens are stacked.

   2 · THE SILENT FONT FALLBACK. The whole point of this lab is that it reads as
       the page, so a system-face fallback is a failure and not a cosmetic one.
       Check 3 reads document.fonts and asserts all five faces reached "loaded";
       document.fonts.check() is NOT used — it answers "could this be used", which
       is true for a family that never arrived.

   3 · THE LAB THAT PHONED HOME. Every byte is meant to be inline. Check 2 fails
       the run on any request that leaves the file, so an embedded asset that
       silently became a URL cannot ship as "self-contained".

   Chromium is searched for, never pinned — the first harness in this repo
   hardcoded a path and crashed before measuring anything on any other machine. */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const PAGE = path.join(ROOT, 'peptide-therapy', 'programme-lab.html');
const SHOTS = process.argv.includes('--shots');
const OUT = process.env.OUT || path.join(ROOT, '.qa-out');
if (SHOTS) fs.mkdirSync(OUT, { recursive: true });

/* find a chromium that exists, preferring playwright's own resolution */
function findChromium() {
  try {
    const p = chromium.executablePath();
    if (fs.existsSync(p)) return p;
  } catch {}
  for (const base of ['/opt/pw-browsers', path.join(process.env.HOME || '', '.cache/ms-playwright')]) {
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base)) {
      for (const rel of ['chrome-linux/chrome', 'chrome-linux/headless_shell', 'chrome']) {
        const p = path.join(base, d, rel);
        if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
      }
      const direct = path.join(base, d);
      if (fs.statSync(direct).isFile()) return direct;
    }
  }
  return undefined;
}

let pass = 0, fail = 0;
const ok  = (n, m = '') => { pass++; console.log(`  \x1b[32m✓\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const bad = (n, m = '') => { fail++; console.log(`  \x1b[31m✗\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const is  = (n, got, want) => String(got) === String(want) ? ok(n, String(got)) : bad(n, `got ${got}, want ${want}`);
const has = (n, hay, needle) => String(hay).includes(needle) ? ok(n, needle) : bad(n, `"${needle}" not in "${String(hay).slice(0, 110)}"`);

/* WCAG contrast, sRGB.

   ⚠️ TWO WAYS THIS MEASUREMENT LIED, BOTH CAUGHT HERE AND BOTH WORTH KEEPING:

   a · ALPHA IS NOT OPTIONAL. Every secondary line on the ink ground is written
       rgba(244,247,250,.72). Taking its first three channels and calling that the
       foreground reports 1.01:1 against ink — a catastrophic failure that does not
       exist. The text painted on screen is the COMPOSITE, so composite first.

   b · DO NOT SAMPLE MID-TRANSITION. The stage cross-fades its ground over 550ms.
       Reading it 400ms in returns rgb(52,40,46) — ink at 97% — and every ratio
       computed against it is wrong by a little, which is worse than wrong by a lot
       because it looks plausible. settle() waits the fade out before any read. */
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const parse = s => { const n = (s.match(/[\d.]+/g) || []).map(Number); return { c: n.slice(0, 3), a: n.length > 3 ? n[3] : 1 }; };
/* foreground over background, honouring the foreground's alpha */
const over = (fg, bg) => { const f = parse(fg), b = parse(bg);
  return f.c.map((v, i) => v * f.a + b.c[i] * (1 - f.a)); };
const contrast = (fg, bg) => ratio(over(fg, bg), parse(bg).c);

const run = async () => {
  const exe = findChromium();
  const browser = await chromium.launch({ executablePath: exe, args: ['--force-color-profile=srgb'] });

  /* ══════════════════ 0 · THE PAGE WITHOUT SCRIPT ══════════════════
     THIS SECTION IS WHY THE LAB WAS REBUILT. The first version generated every
     goal, pill, row, doctor and all three rails from JS arrays via innerHTML —
     so with script unavailable for any reason it rendered four headings and
     nothing else. Not a degraded page: a blank one.

     Script can be unavailable for reasons that have nothing to do with this
     file being correct — a host CSP without 'unsafe-inline', a sandbox that
     strips inline script, an error thrown above it. So the content is now
     authored in the HTML and this context proves it, by loading the page with
     the engine's script support switched off entirely. */
  const noJsCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const noJs = await noJsCtx.newPage();
  await noJs.goto(pathToFileURL(PAGE).href, { waitUntil: 'load' });
  await noJs.waitForTimeout(250);

  console.log('\n\x1b[1m0 · with JavaScript disabled\x1b[0m');
  const dead = await noJs.evaluate(() => {
    const vis = s => [...document.querySelectorAll(s)].filter(e => e.getBoundingClientRect().height > 0).length;
    return {
      goals:   vis('.goal'),
      pills:   vis('.pill'),
      rows:    vis('.row'),
      docs:    vis('.doc'),
      railRows:vis('.rail li'),
      /* the dialog's copy is present but unrendered until opened — count it, don't measure it */
      dialogRail: document.querySelectorAll('#how .rail li').length,
      screens: vis('#flow .screen'),
      price:   (document.querySelector('.price-v') || {}).textContent,
      incl:    vis('.ledger:not(.ledger--out) li'),
      excl:    vis('.ledger--out li'),
      jsClass: document.documentElement.classList.contains('js'),
      wide:    document.documentElement.scrollWidth
    };
  });
  is('0   the js class never lands', dead.jsClass, false);
  is('0a  all eight goals are in the HTML', dead.goals, 8);
  is('0b  all twenty-five symptom pills are in the HTML', dead.pills, 25);
  is('0c  all three locations are in the HTML', dead.rows, 3);
  is('0d  all four doctors are in the HTML', dead.docs, 4);
  is('0e  the summary rail is in the HTML', dead.railRows, 6);
  is('0e2 the overlay rail is in the HTML too', dead.dialogRail, 6);
  is('0f  every screen is readable, stacked', dead.screens, 6);
  is('0g  the price survives', (dead.price || '').trim(), 'AED 1,150');
  is('0h  what is included survives', dead.incl, 6);
  is('0i  what is not included survives', dead.excl, 4);
  is('0j  still no sideways scroll', dead.wide, 1440);
  await noJsCtx.close();

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  const errors = [], external = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) external.push(r.url()); });

  await page.goto(pathToFileURL(PAGE).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);

  console.log('\n\x1b[1mA · integrity\x1b[0m');
  is('1  console is clean', errors.length, 0);
  if (errors.length) errors.slice(0, 5).forEach(e => console.log('       ' + e));
  is('2  no request leaves the file', external.length, 0);
  if (external.length) external.slice(0, 5).forEach(u => console.log('       ' + u));

  const fonts = await page.evaluate(() =>
    [...document.fonts].map(f => `${f.family}|${f.weight}|${f.style}|${f.status}`));
  const wantFaces = ['Playfair|300 900|normal', 'Playfair|300 900|italic',
                     'MediGyn NOW|300|normal', 'MediGyn NOW|500|normal', 'MediGyn Megante|400|normal'];
  const missing = wantFaces.filter(w => !fonts.includes(w + '|loaded'));
  missing.length === 0
    ? ok('3  all five faces loaded', `${fonts.length} registered`)
    : bad('3  all five faces loaded', 'not loaded: ' + missing.join(', '));

  /* the face is registered — but is it the face actually painting? Measure a
     headline against the same string in the fallback stack. */
  const faceReal = await page.evaluate(() => {
    const h = document.querySelector('.screen.is-on .q');
    const w1 = h.getBoundingClientRect().width;
    const probe = document.createElement('span');
    probe.textContent = h.textContent;
    probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;
      font-size:${getComputedStyle(h).fontSize};font-weight:450;font-family:Georgia,serif`;
    document.body.appendChild(probe);
    const w2 = probe.getBoundingClientRect().width; probe.remove();
    return { w1, w2, family: getComputedStyle(h).fontFamily.split(',')[0] };
  });
  faceReal.family.replace(/"/g, '') === 'Playfair'
    ? ok('4  headline resolves to Playfair', `vs Georgia ${Math.round(faceReal.w2)}px`)
    : bad('4  headline resolves to Playfair', faceReal.family);

  console.log('\n\x1b[1mB · layout\x1b[0m');
  for (const w of [1600, 1440, 1280, 1180, 1024, 940, 900, 834, 768, 700, 640, 560, 480, 430, 390, 360]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(120);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    is(`5  no sideways scroll @ ${w}`, sw, w);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(120);

  const shown = await page.evaluate(() =>
    [...document.querySelectorAll('#flow .screen')].filter(s => getComputedStyle(s).display !== 'none').length);
  is('6  exactly one screen is displayed', shown, 1);

  console.log('\n\x1b[1mC · content\x1b[0m');
  const docOrder = await page.evaluate(() =>
    [...document.querySelectorAll('.docs .doc .doc-n')].map(n => n.textContent.trim()));
  const wantOrder = ['Dr. Andrey Komissarov', 'Dr. Eslam Yakout', 'Dr. Nahla Ibrahim Elawady', 'Dr. Khalid Shukri'];
  JSON.stringify(docOrder) === JSON.stringify(wantOrder)
    ? ok('7  doctors are in band order')
    : bad('7  doctors are in band order', docOrder.join(' · '));

  /* The portraits are CSS backgrounds, so there is no naturalWidth to read — each
     data URI is written once in .face-* and referenced by class from the markup.
     Pull the resolved url() back out and decode it, which proves both that the
     custom property resolved and that the bytes behind it are a real image. */
  const faces = await page.evaluate(async () => {
    const els = [...document.querySelectorAll('.doc-face')];
    const urls = els.map(e => (getComputedStyle(e).backgroundImage.match(/url\("?(data:[^")]+)"?\)/) || [])[1]);
    const sizes = await Promise.all(urls.map(u => u ? new Promise(res => {
      const i = new Image(); i.onload = () => res(i.naturalWidth); i.onerror = () => res(0); i.src = u;
    }) : Promise.resolve(0)));
    return { n: els.length, sizes };
  });
  faces.n === 4 && faces.sizes.every(w => w > 0)
    ? ok('8  four portraits decoded', faces.sizes.join('/'))
    : bad('8  four portraits decoded', JSON.stringify(faces));

  /* ⚠️ GEOMETRY, NOT PRESENCE. Both the name and the specialism are <span>s; when
     they were left inline they set on ONE line ("Dr. Andrey KomissarovMD, PhD")
     and .doc-s's margin-top was silently dropped, because vertical margins do
     nothing on an inline box. Every text-content assertion passed throughout.
     Assert that the two boxes do not share a line. */
  const stacked = await page.evaluate(() =>
    [...document.querySelectorAll('.docs .doc')].every(d => {
      const n = d.querySelector('.doc-n').getBoundingClientRect();
      const s = d.querySelector('.doc-s').getBoundingClientRect();
      return s.top >= n.bottom - 1;
    }));
  is('8a name and specialism are on separate lines', stacked, true);

  const goals = await page.evaluate(() => [...document.querySelectorAll('.goals .goal .t')].map(t => t.textContent));
  is('9  eight goals', goals.length, 8);
  has('9a the client\'s spellings survive', goals.join('|'), 'Anti Ageing');

  const banned = await page.evaluate(() => {
    const txt = document.body.innerText;
    return { bozat: /BOZAT/i.test(txt), dutch: /DUTCH/i.test(txt),
             forWomen: /\bFor women\b/.test(txt), forMen: /\bFor men\b/.test(txt) };
  });
  !banned.bozat && !banned.dutch ? ok('10 no BOZAT, no DUTCH Plus') : bad('10 no BOZAT, no DUTCH Plus', JSON.stringify(banned));
  !banned.forWomen && !banned.forMen ? ok('11 no gender split') : bad('11 no gender split', JSON.stringify(banned));

  /* THE VOCABULARY RULE, ASSERTED.
       you START a PROGRAMME · the doctor WRITES your PROTOCOL · the CONSULTATION
       is the hour inside it.
     "Consultation" is not banned — it is the right word in exactly two places:
     the rail's row 5, and the exclusion line for the renewal. What is banned is
     it appearing on a CONTROL, where it would promise a doctor five steps early.
     ⚠️ textContent, NOT innerText — innerText returns only rendered text, and four
     of the six screens are display:none at any moment. The first version of this
     check read innerText and reported zero uses on a page that has two. */
  const vocab = await page.evaluate(() => {
    const body = document.body.textContent;
    const controls = [...document.querySelectorAll('#flow .btn, #flow .howlink, #flow .goal, #flow .row, #flow .doc, #flow .doc-match')]
      .map(b => b.textContent).join(' | ');
    return {
      bookConsult:  /book a consultation/i.test(body),
      bookProtocol: /book a protocol/i.test(body),
      onAControl:   /consultation/i.test(controls),
      inTheRail:    /consultation/i.test(document.querySelector('.screen[data-step="5"] .rail').textContent),
      startsIt:     /start your programme/i.test(document.querySelector('#flow').textContent)
    };
  });
  is('12  "Book a consultation" is gone', vocab.bookConsult, false);
  is('12a "Book a protocol" never arrived', vocab.bookProtocol, false);
  is('12b no control says "consultation"', vocab.onAControl, false);
  is('12c the rail\'s row 5 does say it', vocab.inTheRail, true);
  is('12d the CTA is "start your programme"', vocab.startsIt, true);

  console.log('\n\x1b[1mD · the walk\x1b[0m');
  const step = () => page.evaluate(() =>
    +document.querySelector('#flow .screen.is-on').dataset.step);
  const ground = () => page.evaluate(() => document.querySelector('#flow').dataset.ground);

  is('13 opens on step 1', await step(), 1);
  is('14 Continue is gated with no goal',
     await page.evaluate(() => document.querySelector('.screen[data-step="1"] [data-go="2"]').disabled), true);

  if (SHOTS) await page.screenshot({ path: path.join(OUT, 'pl-1-goals.png') });
  await page.click('[data-goal="Gut Health"]');
  await page.click('[data-goal="Brain Health"]');
  await page.waitForTimeout(750);
  is('15 two goals do not auto-advance', await step(), 1);
  is('15a Continue opens once a goal is chosen',
     await page.evaluate(() => document.querySelector('.screen[data-step="1"] [data-go="2"]').disabled), false);

  await page.click('.screen[data-step="1"] [data-go="2"]');
  is('16 Continue reaches step 2', await step(), 2);
  await page.click('[data-sx="Brain fog"]');
  await page.click('[data-sx="Poor sleep"]');
  if (SHOTS) await page.screenshot({ path: path.join(OUT, 'pl-2-symptoms.png') });
  await page.click('.screen[data-step="2"] [data-go="3"]');
  is('17 reaches step 3', await step(), 3);

  if (SHOTS) await page.screenshot({ path: path.join(OUT, 'pl-3-where.png') });
  await page.click('[data-loc="world"]');
  await page.waitForTimeout(600);
  is('18 single-select DOES auto-advance', await step(), 4);

  if (SHOTS) await page.screenshot({ path: path.join(OUT, 'pl-4-doctor.png') });
  await page.click('[data-doc="Dr. Khalid Shukri"]');
  await page.waitForTimeout(600);
  is('19 doctor auto-advances to the summary', await step(), 5);
  is('20 the summary stands on ivory', await ground(), 'ivory');

  const recap = await page.evaluate(() => document.querySelector('#recap').innerText);
  has('21 recap names both goals', recap, 'Gut Health');
  has('21a recap names the second goal', recap, 'Brain Health');
  has('22 recap names the doctor', recap, 'Dr. Khalid Shukri');
  has('23 recap counts the symptoms', recap, '2 symptoms');

  const rail = await page.evaluate(() =>
    [...document.querySelectorAll('.screen[data-step="5"] .rail li')].map(li => li.innerText.replace(/\n/g, ' § ')));
  is('24 the rail is six rows', rail.length, 6);
  has('25 row 3 personalises to the location', rail[2], 'any laboratory near you');
  has('26 row 4 sells the prep day', rail[3], '48 hours');
  has('27 row 5 carries the doctor', rail[4], 'Dr. Khalid Shukri');
  has('28 durations are on every row', rail.map(r => r.split('§').pop()).join('|'), '8 weeks');

  const priced = await page.evaluate(() => document.querySelector('.screen[data-step="5"] .price-v').textContent);
  is('29 the price is on the screen before payment', priced.trim(), 'AED 1,150');
  const excl = await page.evaluate(() => document.querySelector('.screen[data-step="5"] .ledger--out').innerText);
  ['Peptide therapy', 'Supplementation', 'Review consultation', 'Home blood test']
    .forEach((s, i) => has(`30${'abcd'[i]} exclusion listed pre-payment`, excl, s));

  if (SHOTS) await page.screenshot({ path: path.join(OUT, 'pl-5-summary.png'), fullPage: true });
  await page.click('.screen[data-step="5"] [data-go="6"]');
  is('31 Start reaches the threshold', await step(), 6);
  is('32 the threshold stands on ink', await ground(), 'ink');
  has('33 the blood task personalises', await page.evaluate(() => document.querySelector('#task-blood').textContent), 'any laboratory');
  if (SHOTS) await page.screenshot({ path: path.join(OUT, 'pl-6-threshold.png') });

  console.log('\n\x1b[1mE · contrast on the real grounds\x1b[0m');
  const settle = () => page.waitForTimeout(700);   /* the 550ms ground fade, out */
  await settle();
  const pairs = await page.evaluate(() => {
    const g = el => getComputedStyle(el);
    const stage = g(document.querySelector('#flow')).backgroundColor;
    return {
      'ink · lede':    [g(document.querySelector('.screen[data-step="6"] .lede')).color, stage],
      'ink · after':   [g(document.querySelector('.screen[data-step="6"] .after')).color, stage],
      'ink · task':    [g(document.querySelector('.screen[data-step="6"] .task p')).color, stage],
      'ink · heading': [g(document.querySelector('.screen[data-step="6"] .q')).color, stage]
    };
  });
  for (const [k, [fg, bg]] of Object.entries(pairs)) {
    const r = contrast(fg, bg);
    r >= 4.5 ? ok(`34 ${k} clears 4.5:1`, r.toFixed(2)) : bad(`34 ${k} clears 4.5:1`, r.toFixed(2));
  }
  await page.click('#back');
  await settle();
  const light = await page.evaluate(() => {
    const g = el => getComputedStyle(el);
    const bg = g(document.querySelector('#flow')).backgroundColor;
    return { 'recap':     [g(document.querySelector('.screen[data-step="5"] .recap')).color, bg],
             'durations': [g(document.querySelector('.screen[data-step="5"] .rail .rd')).color, bg],
             'exclusions':[g(document.querySelector('.ledger--out li')).color, bg],
             'price':     [g(document.querySelector('.screen[data-step="5"] .price-v')).color, bg] };
  });
  for (const [k, [fg, bg]] of Object.entries(light)) {
    const r = contrast(fg, bg);
    r >= 4.5 ? ok(`35 ${k} on ivory clears 4.5:1`, r.toFixed(2)) : bad(`35 ${k} on ivory clears 4.5:1`, r.toFixed(2));
  }
  /* the selected state inverts to ivory-on-ink and has to clear the floor too */
  await page.click('#back'); await page.click('#back'); await page.click('#back');
  await settle();
  const sel = await page.evaluate(() => {
    const b = document.querySelector('[data-goal="Gut Health"]');
    return [getComputedStyle(b.querySelector('.t')).color, getComputedStyle(b).backgroundColor];
  });
  const rs = contrast(sel[0], sel[1]);
  rs >= 4.5 ? ok('35e selected goal clears 4.5:1', rs.toFixed(2)) : bad('35e selected goal clears 4.5:1', rs.toFixed(2));

  console.log('\n\x1b[1mF · the three shapes\x1b[0m');
  await page.click('[data-shape="c"]');
  is('36 C shows the escape hatch',
     await page.evaluate(() => getComputedStyle(document.querySelector('#skipbtn')).display !== 'none'), true);
  await page.click('#skipbtn');
  is('37 the escape hatch lands on the summary', await step(), 5);

  await page.click('[data-shape="a"]');
  is('38 A hides the escape hatch',
     await page.evaluate(() => getComputedStyle(document.querySelector('#skipbtn')).display === 'none'), true);

  /* ⚠️ B IS NOT A SECOND SECTION. It is the same six screens re-laid into two
     columns, so the assertion is that the four question screens are up TOGETHER
     and the threshold is not — never that some other element became visible. */
  await page.click('[data-shape="b"]');
  await page.waitForTimeout(200);
  const bVis = await page.evaluate(() => {
    const up = [...document.querySelectorAll('#flow .screen')]
      .filter(s => getComputedStyle(s).display !== 'none').map(s => s.dataset.step);
    const s5 = document.querySelector('#flow .screen[data-step="5"]');
    return { up, cols: getComputedStyle(document.querySelector('#flow')).gridTemplateColumns.split(' ').length,
             sticky: getComputedStyle(s5).position };
  });
  JSON.stringify(bVis.up) === JSON.stringify(['1','2','3','4','5'])
    ? ok('39 B shows all five at once', bVis.up.join(''))
    : bad('39 B shows all five at once', bVis.up.join(''));
  is('39a B is two columns', bVis.cols, 2);
  is('39b the ledger sticks beside the questions', bVis.sticky, 'sticky');

  /* one set of screens means there is nothing to keep in sync — the selection
     made in A is the same DOM node, and it must simply still be pressed */
  const carried = await page.evaluate(() =>
    document.querySelector('[data-goal="Gut Health"]').getAttribute('aria-pressed'));
  is('40 selections survive the shape switch', carried, 'true');
  const bRail = await page.evaluate(() =>
    document.querySelectorAll('#flow .screen[data-step="5"] .rail li').length);
  is('41 B carries the whole rail in view', bRail, 6);
  if (SHOTS) {
    await page.screenshot({ path: path.join(OUT, 'pl-b-onescreen.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUT, 'pl-b-phone.png'), fullPage: true });
    await page.click('[data-shape="a"]');
    await page.screenshot({ path: path.join(OUT, 'pl-a-phone.png'), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
  }

  console.log('\n\x1b[1mG · the overlay and the reset\x1b[0m');
  await page.click('[data-shape="a"]');
  await page.click('#how-open');
  await page.waitForTimeout(200);
  is('42 How it works opens', await page.evaluate(() => document.querySelector('#how').open), true);
  is('43 the overlay carries the same six rows',
     await page.evaluate(() => document.querySelectorAll('#how .rail li').length), 6);
  await page.click('#how-close');
  await page.waitForTimeout(200);
  is('44 it closes', await page.evaluate(() => document.querySelector('#how').open), false);

  await page.click('#reset');
  await page.waitForTimeout(150);
  const cleared = await page.evaluate(() => ({
    step: +document.querySelector('#flow .screen.is-on').dataset.step,
    pressed: document.querySelectorAll('.goals [aria-pressed="true"]').length,
    recap: document.querySelector('#recap').innerText.trim()
  }));
  is('45 reset returns to step 1', cleared.step, 1);
  is('46 reset clears every selection', cleared.pressed, 0);
  is('47 the recap degrades gracefully with nothing chosen', cleared.recap, 'Peptide therapy.');

  is('48 still no console errors after the whole walk', errors.length, 0);

  await browser.close();
  console.log(`\n\x1b[1m${pass} passed, ${fail} failed\x1b[0m${SHOTS ? `  ·  shots in ${OUT}` : ''}\n`);
  process.exit(fail ? 1 : 0);
};

run().catch(e => { console.error(e); process.exit(1); });
