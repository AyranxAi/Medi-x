/* ═══════════════════════════════════════════════════════════════════════════════════
   THE FOCUS RAIL — peptide-therapy/section04-hybrid.html, round 18
   ═══════════════════════════════════════════════════════════════════════════════════
   Run:  node tools/qa/section04-hybrid.mjs [--shots]
   Needs: npm install --no-save playwright

   ⚠️ THIS FILE CHECKS THE PROMISES THE PAGE MAKES IN WRITING. Its notes panel tells the
   client four specific things — every pathway stays on screen, the chosen tick is legible
   at the smallest scale a card is drawn at, the CTA is the page's own wording, and the
   arc gives way to a stack below 1180. A claim printed on a page and not asserted anywhere
   is a claim that will quietly stop being true; every one of the four is measured here.

   ⚠️ THREE OF THESE CHECKS EXIST BECAUSE THE BUG THEY CATCH ALREADY SHIPPED FOR A RUN:
     · check 2 — at 960px the outermost card sat past the edge of the clip. It was still
       "in the DOM", still had a width, and every count in the first harness said eight.
       Only asking whether its box lies inside the viewport found it.
     · check 3 — a chosen card in the LEFT half showed no tick, because the tick drew in
       the exact corner its neighbour overlapped. Position was correct; visibility was not.
       elementFromPoint is the difference between the two questions.
     · check 5 — transform-style:preserve-3d made z-index inert, and the side cards painted
       over the focused card's name and button. Nothing errored and the CSS was right.

   ⚠️ AND ONE CHECKS THE PACKER, NOT THE PAGE. The artifact copy is only worth anything if
   it renders with NOTHING fetched, so check 6 aborts every request that is not the
   document and then asks whether the faces loaded and the 3D booted anyway. */

import path from 'path';
import { chromium } from 'playwright';
import fs from 'fs';
import http from 'http';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE  = path.dirname(fileURLToPath(import.meta.url));
const ROOT  = path.resolve(HERE, '..', '..');
const SRC   = 'peptide-therapy/section04-hybrid.html';
const SHOTS = process.argv.includes('--shots');
const OUT   = process.env.OUT || path.join(ROOT, '.qa-out');
fs.mkdirSync(OUT, { recursive: true });

let pass = 0, fail = 0;
const ok   = (n, m = '') => { pass++; console.log(`  \x1b[32m✓\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const bad  = (n, m = '') => { fail++; console.log(`  \x1b[31m✗\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const is   = (n, got, want) => String(got) === String(want) ? ok(n, String(got)) : bad(n, `got ${got}, want ${want}`);
const head = t => console.log(`\n\x1b[1m${t}\x1b[0m`);

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  try { const p = chromium.executablePath(); if (fs.existsSync(p)) return p; } catch {}
  for (const base of ['/opt/pw-browsers', path.join(process.env.HOME || '', '.cache/ms-playwright')]) {
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base)) {
      for (const rel of ['chrome-linux/chrome', 'chrome-linux/headless_shell', 'chrome']) {
        const p = path.join(base, d, rel);
        if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
      }
    }
  }
}
const MIME = { '.html':'text/html', '.js':'text/javascript', '.woff2':'font/woff2',
  '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp' };

const run = async () => {
  const server = http.createServer((req, res) => {
    const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\//, ''));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end();
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  const PORT = await new Promise(r => server.listen(0, () => r(server.address().port)));
  const browser = await chromium.launch({ executablePath: findChromium(),
    args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto(`http://localhost:${PORT}/${SRC}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);

  /* ═══ 1 · THE EIGHT ARE THE CLIENT'S EIGHT, AND NOBODY WROTE NEW COPY ═════════════
     Both reference boards used names that are not his — the orbit board invented eight of
     its own, the editorial board respelled two. A mock-up that quietly renames a service
     and is then approved has changed the product by approval. */
  head('1 · The eight, and their words');
  const src  = fs.readFileSync(path.join(ROOT, 'peptide-therapy/index.html'), 'utf8');
  const gsrc = fs.readFileSync(path.join(ROOT, 'peptide-therapy/goals-lab.html'), 'utf8');
  const cards = await page.evaluate(() => [...document.querySelectorAll('.pw')].map(c => ({
    name: c.querySelector('h3').textContent.trim(),
    line: c.querySelector('.pw-line').textContent.trim(),
    outs: [...c.querySelectorAll('.pw-out li')].map(l => l.textContent.trim()),
    para: c.querySelector('.pw-back p').textContent.trim(),
    art:  c.classList.contains('has-art'),
    cta:  c.querySelector('.pw-cta').textContent.replace(/\s+/g, ' ').trim(),
    mark: [...c.querySelectorAll('.pw-mark path, .pw-mark circle')]
      .map(e => e.getAttribute('d') || e.getAttribute('cx') + ',' + e.getAttribute('cy')).join(';'),
  })));
  const esc = s => s.replace(/&/g, '&amp;');
  is('1  eight pathways', cards.length, 8);
  is('1a eight different marks', new Set(cards.map(c => c.mark)).size, 8);
  const badName = cards.find(c => !src.includes('>' + esc(c.name) + '<'));
  if (!badName) ok('1b every name is index.html\'s, character for character');
  else bad('1b a name is not the client\'s', badName.name);
  const badLine = cards.find(c => !gsrc.includes(esc(c.line)));
  if (!badLine) ok('1c every one-line descriptor comes from goals-lab.html');
  else bad('1c a descriptor was written here', badLine.line);
  const badOut = cards.flatMap(c => c.outs).find(o => !src.includes('>' + esc(o) + '<'));
  if (!badOut) ok('1d every outcome comes from that tile\'s own popup');
  else bad('1d an outcome was written here', badOut);
  /* the turned face carries the popup's own first paragraph, verbatim */
  const badPara = cards.find(c => !src.includes(esc(c.para)));
  if (!badPara) ok('1f the turned face quotes the popup paragraph, verbatim');
  else bad('1f the back of a card was written here', badPara.para.slice(0, 60));
  /* ⚠️ HIS EIGHT PHOTOGRAPHS, ASSERTED. They arrived as tool-named PNGs and were mapped to
     the eight goals by eye; if a rename or a re-encode ever drops one, the card silently
     falls back to its plate and looks deliberate. Only a count says otherwise. */
  is('1g all eight photographs load', cards.filter(c => c.art).length, 8);
  /* ⚠️ THE PILL IS THE PAGE'S, NOT THE MOOD BOARD'S. Both references said Explore or
     Discover pathway. Round 12 moved this section off browsing and onto building. */
  const ctas = new Set(cards.map(c => c.cta));
  if (ctas.size === 1 && /^Add to your programme \+$/.test([...ctas][0]))
    ok('1e the CTA is the shipped wording', [...ctas][0]);
  else bad('1e the CTA drifted', [...ctas].join(' / '));

  /* ═══ 2 · THE RING AT EVERY WIDTH ═══════════════════════════════════════════════
     ⚠️⚠️ THIS BLOCK USED TO ASSERT THAT ALL EIGHT WERE ON SCREEN AT EVERY WIDTH, AND THAT
     PROMISE WAS RETIRED ON 2026-08-17 RATHER THAN BROKEN QUIETLY. It could only ever be kept
     by giving up the ring below 1181 and showing a flat stacked list instead — and the list
     took the FLIP down with it, because a stacked card is transform-style:flat in a rail
     with perspective:none, so the + mirrored the card rather than turning it. His words:
     "its only 2d and if you flip it its nothing."
     ⚠️ EIGHT CARDS ELEVEN HUNDRED PIXELS WIDE DO NOT FIT ON A 390px PHONE — that is
     arithmetic, not tuning: the front card alone is two-thirds of the screen, and forcing
     all eight leaves the outer three showing 10px each, which reads as the edges of a stack
     of paper rather than as cards. So the fan is a WINDOW on to the ring — five on a phone,
     seven on a tablet, eight on a laptop — and the promise that replaced the old one is
     below: all eight are always IN the ring and reachable, whatever the window shows.
     ⚠️ THE OLD ASSERTION IS THE FIRST THING TO RESTORE IF THE WINDOW IS EVER ABANDONED.
     `git log -S "eight on screen, no sideways scroll"` finds it intact. */
  head('2 · The ring at every width, and what the window shows');
  const WINDOW = { 1600: 8, 1440: 8, 1366: 8, 1280: 8, 1181: 8,
                   1180: 7, 1104: 7, 900: 7, 760: 7, 699: 5, 430: 5, 390: 5, 360: 5 };
  for (const w of [1600, 1440, 1366, 1280, 1181, 1180, 1104, 900, 760, 699, 430, 390, 360]) {
    await page.setViewportSize({ width: w, height: 900 });
    /* ⚠️ 900ms, NOT 420. Crossing the breakpoint swaps the arc for the stack and the cards'
       width transition runs for .78s — measured at 420ms one card was still partway between
       152px and full width and its box had not yet reached the left edge of the column, so
       the check reported 7/8 on a layout that was correct a third of a second later. A
       responsive assertion that fires mid-transition measures the animation, not the page. */
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const seen = [...document.querySelectorAll('.pw')].filter(c => {
        const b = c.getBoundingClientRect();
        return b.width > 4 && b.left > -1 && b.right < vw + 1 && +getComputedStyle(c).opacity > .3;
      }).length;
      return { seen, over: document.documentElement.scrollWidth - vw,
               total: document.querySelectorAll('.pw').length,
               fan: [...document.querySelectorAll('.pw')].filter(c => c.dataset.park !== 'true').length,
               arc: getComputedStyle(document.querySelector('.pw')).position === 'absolute',
               flat: getComputedStyle(document.querySelector('.rail')).perspective === 'none' };
    });
    const want = WINDOW[w];
    /* ⚠️ `seen` COUNTS WHAT IS ACTUALLY ON SCREEN AND `fan` COUNTS WHAT THE WINDOW PLACED.
       They have to agree: a card the script thinks it placed but the clip has eaten is the
       exact failure the old version of this check existed to catch, and it is still the one
       that matters — it has simply stopped being "eight" and started being "the window". */
    r.seen === want && r.fan === want && r.over <= 1
      ? ok(`2  ${w}px — ${want} in the fan, no sideways scroll`)
      : bad(`2  ${w}px — ${r.seen} on screen and ${r.fan} placed, want ${want}; ${r.over}px of overflow`);
    /* ⚠️ ALL EIGHT ARE ALWAYS IN THE RING. The window is a placement rule, never a filter —
       the dots, the tally and the tray must see eight at every width or a reader on a phone
       has been shown a shorter menu than a reader on a laptop. */
    is(`2a ${w}px — all eight are still in the ring`, r.total, 8);
  }
  /* ⚠️⚠️ THE RING NEVER GIVES WAY TO A STACK NOW, AND THESE TWO ARE THE FINGERPRINT OF THE
     BUG THAT USED TO. `position:static` on a card or `perspective:none` on the rail means the
     2D fallback is back, and the flip will mirror the card instead of turning it. */
  const narrow = await page.evaluate(() => ({
    arc: getComputedStyle(document.querySelector('.pw')).position === 'absolute',
    flat: getComputedStyle(document.querySelector('.rail')).perspective === 'none' }));
  is('2b the ring is still a ring at 360px', narrow.arc, true);
  is('2c and the rail still has depth to turn a card through', narrow.flat, false);

  /* ═══ 3 · A CHOSEN PATHWAY IS LEGIBLE FROM ANYWHERE IN THE RING ══════════════════ */
  head('3 · The multi-select survives the mechanism');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(500);
  /* choose four spread around the ring, then look at them from a fifth position */
  for (const i of [0, 2, 5, 7]) {
    /* ⚠️ ONLY CLICK THE FACE IF THE CARD IS NOT ALREADY IN FOCUS. The face means two
       different things by position — bring forward, or add — so clicking it on the card
       that is already centred ADDS the goal, and the CTA click below then removes it
       again. The first version of this check did exactly that to card 0 and reported
       three of four chosen, which read like a page bug and was a test bug. */
    await page.evaluate(n => {
      const c = document.querySelectorAll('.pw')[n];
      if (c.dataset.focus !== 'true') c.querySelector('.pw-face').click();
    }, i);
    await page.waitForTimeout(760);
    await page.evaluate(n => document.querySelectorAll('.pw')[n].querySelector('.pw-cta').click(), i);
    await page.waitForTimeout(220);
  }
  await page.evaluate(() => document.querySelectorAll('.pw')[4].querySelector('.pw-face').click());
  await page.waitForTimeout(1100);
  const ticks = await page.evaluate(() =>
    [...document.querySelectorAll('.pw[data-picked="true"]')].map(c => {
      const t = c.querySelector('.pw-tick').getBoundingClientRect();
      const hit = document.elementFromPoint(t.x + t.width / 2, t.y + t.height / 2);
      return { name: c.querySelector('h3').textContent.trim(), size: Math.round(t.width),
               clear: !!hit && hit.closest('.pw') === c };
    }));
  is('3  four pathways chosen', ticks.length, 4);
  const hidden = ticks.filter(t => !t.clear);
  if (!hidden.length) ok('3a every chosen tick is unobscured wherever it sits in the ring');
  else bad('3a a chosen pathway shows no tick', hidden.map(t => t.name).join(', '));
  /* ⚠️ 20, NOT 24, AND THE DIFFERENCE IS ROTATION RATHER THAN SLACK. The claim is that the
     tick does not shrink with the card's SCALE, and 1/--sc holds that exactly. What the box
     also carries is the fan's rotateY — the outermost card is turned 44 degrees, so its
     axis-aligned rect measures about 22px for a 24px badge. Tightening this to 24 would
     assert something the design never promised and fail on a correct page. */
  const shrunk = ticks.filter(t => t.size < 20);
  if (!shrunk.length) ok('3b and none of them shrank with its card', `${[...new Set(ticks.map(t => t.size))].join('/')}px across the ring`);
  else bad('3b a tick scaled down with its card', shrunk.map(t => `${t.name} ${t.size}px`).join(', '));
  is('3c the tally agrees',
     await page.evaluate(() => document.getElementById('tally').textContent), 4);
  if (SHOTS) await (await page.$('#stage')).screenshot({ path: path.join(OUT, 'hybrid-chosen.png') });

  /* ═══ 4 · THE CARD IN FOCUS IS THE ONLY ONE THAT SPEAKS ═════════════════════════ */
  head('4 · The focused card');
  const f = await page.evaluate(() => {
    const c = document.querySelector('.pw[data-focus="true"]');
    const others = [...document.querySelectorAll('.pw:not([data-focus="true"])')];
    const vis = e => getComputedStyle(e).display !== 'none';
    return { one: document.querySelectorAll('.pw[data-focus="true"]').length,
             line: vis(c.querySelector('.pw-line')), cta: vis(c.querySelector('.pw-cta')),
             quiet: others.every(o => !vis(o.querySelector('.pw-line')) && !vis(o.querySelector('.pw-cta'))),
             /* the aria-label has to mean what the click will do */
             label: c.querySelector('.pw-face').getAttribute('aria-label'),
             otherLabel: others[0].querySelector('.pw-face').getAttribute('aria-label') };
  });
  is('4  exactly one card in focus', f.one, 1);
  if (f.line && f.cta) ok('4a it carries its line and its button');
  else bad('4a the focused card is missing its copy or its CTA');
  if (f.quiet) ok('4b and no other card does');
  else bad('4b a card away from the centre is showing focused content');
  if (/add this goal/i.test(f.label) && /bring this pathway forward/i.test(f.otherLabel))
    ok('4c the accessible name follows what the click actually does');
  else bad('4c a card is announced as something it will not do',
           `${f.label} / ${f.otherLabel}`);

  /* ═══ 5 · THE FAN PAINTS IN THE RIGHT ORDER ═════════════════════════════════════
     preserve-3d made z-index inert once and the side cards drew over the focused card's
     name and button. Sample the actual pixel the name occupies. */
  head('5 · Stacking');
  const cover = await page.evaluate(() => {
    const c = document.querySelector('.pw[data-focus="true"]');
    const probes = ['h3', '.pw-line', '.pw-cta'].map(sel => {
      const b = c.querySelector(sel).getBoundingClientRect();
      const hit = document.elementFromPoint(b.x + 8, b.y + b.height / 2);
      return { sel, own: !!hit && hit.closest('.pw') === c };
    });
    return probes.filter(p => !p.own).map(p => p.sel);
  });
  if (!cover.length) ok('5  nothing paints over the focused card\'s name, line or button');
  else bad('5  a side card is drawing over the centre', cover.join(', '));

  /* ═══ 4b · THE RING IS A RING — the physics he caught ═══════════════════════════
     ⚠️ THESE THREE CHECKS EXIST BECAUSE THE CLIENT FOUND THE BUG, NOT THE HARNESS. The
     first build had the front card HIGHEST and the outer cards dipping below it — a hill
     with a valley in the middle rather than a circle — and nothing here would ever have
     said so, because every assertion was about position, count and contrast and none about
     whether the arrangement meant anything. A geometry that is claimed in prose ("cards
     rise as they recede", "near is bigger") has to be measured like any other claim. */
  head('4b · The ring reads as a ring');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(900);
  /* ⚠️⚠️ THE FLOAT IS STOPPED FOR THIS CHECK, AND STOPPING IT IS THE CHECK BEING HONEST.
     Each card bobs 7px on its own phase, so a snapshot of the feet is the ring PLUS wherever
     eight independent sine waves happen to be — and the assertion failed the moment the
     float shipped, reporting the front card 1px above its neighbour on a ring that was
     perfectly correct. Widening the tolerance to swallow the bob would also swallow a real
     inversion. A float is motion and a ring is geometry: measure the geometry with the
     motion stopped, then let it go again. (Fourth time this harness has measured an
     animation instead of a page — see 4h and check 2.) */
  const freeze = await page.addStyleTag({ content: '.pw{animation:none !important}' });
  await page.waitForTimeout(120);
  for (const shape of ['tall', 'wide']) {
    await page.evaluate(sh => document.querySelector(`.shape button[data-shape="${sh}"]`).click(), shape);
    await page.waitForTimeout(1300);
    const ring = await page.evaluate(() => {
      const N = document.querySelectorAll('.pw').length;
      const f = [...document.querySelectorAll('.pw')].findIndex(c => c.dataset.focus === 'true');
      /* by distance round the ring, not by DOM order */
      const byA = [];
      [...document.querySelectorAll('.pw')].forEach((c, i) => {
        let d = (i - f + N) % N; if (d > N / 2) d -= N;
        const r = c.getBoundingClientRect();
        byA.push({ a: Math.abs(d), foot: r.bottom, w: r.width });
      });
      const at = a => byA.filter(x => x.a === a);
      return { foot: [0, 1, 2, 3, 4].map(a => at(a).length ? Math.round(Math.max(...at(a).map(x => x.foot))) : null),
               wide: [1, 2, 3, 4].map(a => at(a).length ? Math.round(Math.max(...at(a).map(x => x.w))) : null),
               front: Math.round(byA.find(x => x.a === 0).w) };
    });
    /* ⚠️ A LARGER `bottom` IS LOWER ON SCREEN. The front card must have the largest of all,
       and every step out must be strictly smaller — that IS "the ring climbs away from you",
       and it is the assertion that would have caught the inversion. */
    const feet = ring.foot.filter(v => v !== null);
    const rises = feet.every((v, i) => i === 0 || v < feet[i - 1]);
    if (rises) ok(`4e ${shape} — the feet rise away from the front`,
                  feet.join(' > ') + `  (${feet[0] - feet[feet.length - 1]}px of climb)`);
    else bad(`4e ${shape} — the ring is inverted or flat`, feet.join(' / '));
    /* near is bigger, strictly, at every step */
    const ws = ring.wide.filter(v => v !== null);
    const shrinks = ws.every((v, i) => i === 0 || v < ws[i - 1]);
    const spread = ws[ws.length - 1] / ws[0];
    if (shrinks && spread < .82)
      ok(`4f ${shape} — near cards are bigger, and by enough to read`,
         ws.join(' > ') + `  (far is ${Math.round(spread * 100)}% of near)`);
    else if (shrinks) bad(`4f ${shape} — the falloff is too flat to read as depth`,
                          `far is ${Math.round(spread * 100)}% of near`);
    else bad(`4f ${shape} — a far card is not smaller than a nearer one`, ws.join(' / '));
    if (SHOTS) await (await page.$('#stage')).screenshot({ path: path.join(OUT, `hybrid-${shape}.png`) });
  }
  /* ⚠️ AND THE TALL FRONT CARD MUST ACTUALLY BE TALL. The toggle writes --fw/--fh on the
     rail; if a future edit moves either onto the card itself, the probes stop seeing the
     change and the ring lays itself out against the shape it just left. */
  const shapes = await page.evaluate(async () => {
    const read = () => { const r = document.querySelector('.pw[data-focus="true"]').getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) }; };
    const wait = ms => new Promise(r => setTimeout(r, ms));
    document.querySelector('.shape button[data-shape="tall"]').click(); await wait(1200);
    const tall = read();
    document.querySelector('.shape button[data-shape="wide"]').click(); await wait(1200);
    return { tall, wide: read() };
  });
  if (shapes.tall.h > shapes.tall.w && shapes.wide.w > shapes.wide.h)
    ok('4g the toggle really changes the front card\'s shape',
       `tall ${shapes.tall.w}x${shapes.tall.h} · wide ${shapes.wide.w}x${shapes.wide.h}`);
  else bad('4g a shape is not the orientation it claims', JSON.stringify(shapes));
  await page.evaluate(() => document.querySelector('.shape button[data-shape="tall"]').click());
  await page.waitForTimeout(1200);
  await freeze.evaluate(n => n.remove());   /* the float goes back on */
  await page.waitForTimeout(200);

  /* ═══ 4m · THE CASCADE IS GEOMETRIC, NOT JUST DESCENDING ═══════════════════════
     ⚠️ "EACH ONE SMALLER" AND "EACH ONE SMALLER BY THE SAME PROPORTION" ARE DIFFERENT
     CLAIMS, AND ONLY THE SECOND READS AS DEPTH. A linear ladder — 1, .8, .6, .4 — descends
     perfectly and has a ratio that shrinks at every step, which the eye reads as a row of
     different-sized cards. A constant ratio is what distance actually does. Check 4f already
     asserts descending; this asserts the RATIO holds, which is the thing he asked for. */
  head('4m · The cascade');
  const freeze2 = await page.addStyleTag({ content: '.pw{animation:none !important}' });
  await page.waitForTimeout(150);
  for (const shape of ['tall', 'wide']) {
    await page.evaluate(sh => document.querySelector(`.shape button[data-shape="${sh}"]`).click(), shape);
    await page.waitForTimeout(1200);
    const w = await page.evaluate(() => {
      const cs = [...document.querySelectorAll('.pw')], N = cs.length;
      const f = cs.findIndex(c => c.dataset.focus === 'true');
      const by = {};
      cs.forEach((c, i) => { let d = (i - f + N) % N; if (d > N / 2) d -= N;
        by[Math.abs(d)] = c.getBoundingClientRect().width; });
      return [0, 1, 2, 3, 4].map(a => by[a]).filter(v => v);
    });
    /* the ratio between neighbours, from the first side card outward */
    const r = [];
    for (let i = 2; i < w.length; i++) r.push(w[i] / w[i - 1]);
    const spread = Math.max(...r) - Math.min(...r);
    if (spread <= .05)
      ok(`4m ${shape} — every step out is the same proportion`,
         r.map(v => v.toFixed(2)).join(' · ') + `  (${w.map(v => Math.round(v)).join(' > ')})`);
    else bad(`4m ${shape} — the ratio drifts, so it reads as a row not a ring`,
             r.map(v => v.toFixed(2)).join(' / '));
    /* and the front card has to be visibly the nearest thing, not first among equals */
    if (w[0] / w[1] >= 1.35) ok(`4m2 ${shape} — the front card is clearly nearest`,
      `x${(w[0] / w[1]).toFixed(2)} the next one`);
    else bad(`4m2 ${shape} — the front card does not stand out of the ring`,
      `only x${(w[0] / w[1]).toFixed(2)}`);
  }
  await freeze2.evaluate(n => n.remove());
  await page.evaluate(() => document.querySelector('.shape button[data-shape="tall"]').click());
  await page.waitForTimeout(1100);

  /* ═══ 4n · THE FLOAT IS SMALL ENOUGH TO BE SAFE ════════════════════════════════
     ⚠️⚠️ THIS IS AN ACCESSIBILITY ASSERTION WEARING A GEOMETRY ONE. His note: the readers
     are grandmothers and grandfathers, and persistent drift in the periphery is what
     provokes vestibular discomfort in exactly that audience. The first float was 7px over
     7s and he called it trippy. A number that is a promise to a reader belongs in a check,
     not only in a comment — so the amplitude is sampled, and it has to be BOTH non-zero
     (the float exists) and under about 3px (it cannot be felt). */
  head('4n · The float');
  const amp = await page.evaluate(() => new Promise(res => {
    const c = document.querySelectorAll('.pw')[3];
    let lo = Infinity, hi = -Infinity, n = 0;
    const id = setInterval(() => {
      const y = c.getBoundingClientRect().top;
      lo = Math.min(lo, y); hi = Math.max(hi, y);
      if (++n > 34) { clearInterval(id); res(+(hi - lo).toFixed(2)); }
    }, 150);
  }));
  if (amp > .2 && amp <= 3.2) ok('4n the float is present and barely there', `${amp}px observed`);
  else if (amp <= .2) bad('4n the float is not running', `${amp}px`);
  else bad('4n the float is big enough to be felt', `${amp}px observed, ceiling 3.2`);

  /* ═══ 4h · THE ACCENT REALLY RE-POINTS ═════════════════════════════════════════
     ⚠️ THIS CHECK EXISTS BECAUSE THE RULES WERE WRITTEN AND NEVER LANDED. The two
     [data-pick] blocks were inserted against an anchor comment an earlier edit had already
     consumed, so the substitution matched nothing and did nothing — silently. The toggle
     moved the attribute, the attribute selected no rule, and all three settings rendered
     gold. Everything looked wired and nothing was. Asserting the COMPUTED colour is the only
     thing that can tell a token apart from a token-shaped comment.
     ⚠️ AND THE GLYPH IS CHECKED WITH THE FILL. A badge whose disc changes and whose tick
     does not is a badge that reads ink-on-ivory or ivory-on-gold at some setting. */
  head('4h · The chosen colour');
  await page.evaluate(() => document.querySelector('.pw[data-focus="true"] .pw-cta').click());
  await page.waitForTimeout(500);
  const WANT = { gold:  ['rgb(194, 160, 94)', 'rgb(46, 34, 40)'],
                 ivory: ['rgb(250, 247, 241)', 'rgb(92, 31, 49)'],
                 wine:  ['rgb(92, 31, 49)', 'rgb(250, 247, 241)'] };
  for (const [k, [fill, glyph]] of Object.entries(WANT)) {
    await page.evaluate(v => document.querySelector(`.shape button[data-pick="${v}"]`).click(), k);
    /* ⚠️ 800ms, BECAUSE box-shadow IS TRANSITIONED FOR 600. Read at 500 the ring's colour is
       PARTWAY BETWEEN the old accent and the new one — it matches neither, and the check
       failed for ivory and wine while passing for gold purely because gold was the value it
       started from and therefore never animated. Third time this harness has measured an
       animation instead of a page; the tell is always a check that passes for exactly the
       one case that did not change. */
    await page.waitForTimeout(800);
    const got = await page.evaluate(() => {
      const t = document.querySelector('.pw[data-picked="true"] .pw-tick');
      const cs = getComputedStyle(t);
      return { fill: cs.backgroundColor, glyph: cs.color,
               /* the badge must never depend on its fill alone — the edge is the fix */
               edge: /rgba?\(52, 16, 28/.test(cs.boxShadow),
               /* and a picked card keeps its ring even at the front */
               ring: getComputedStyle(t.closest('.pw')).boxShadow.includes(cs.backgroundColor) };
    });
    if (got.fill === fill && got.glyph === glyph)
      ok(`4h ${k} — the badge really re-points`, `${got.fill} on ${got.glyph.replace('rgb', '')}`);
    else bad(`4h ${k} — the token did not take`, `got ${got.fill} / ${got.glyph}`);
    if (got.edge) ok(`4i ${k} — and it keeps its edge, so it does not rely on the fill`);
    else bad(`4i ${k} — the badge has no edge; on gut-health its fill measures 1.03`);
    if (got.ring) ok(`4j ${k} — a picked card keeps its ring at the front`);
    else bad(`4j ${k} — chosen and focused are fighting over box-shadow again`);
  }
  await page.evaluate(() => document.querySelector('.shape button[data-pick="gold"]').click());
  await page.waitForTimeout(400);

  /* ═══ 4k · THE PILL FITS THE COLUMN IT SITS IN ═════════════════════════════════
     ⚠️ IT DID NOT, AND HE SAW IT BEFORE THIS FILE DID: at 10px/.17em the button drew 243px
     inside a 224px text column and simply overflowed onto the photograph. `nowrap` plus
     `flex:none` means it will never wrap and never shrink, so a pill CANNOT be left to fit
     by luck — the relationship between its width and its column is an INEQUALITY, and
     inequalities are checkable. Measured in both shapes at three widths, because the column
     is a percentage of a clamped card and the label is a fixed string. */
  head('4k · The pill inside its column');
  for (const shape of ['wide', 'tall']) {
    await page.evaluate(sh => document.querySelector(`.shape button[data-shape="${sh}"]`).click(), shape);
    await page.waitForTimeout(1000);
    for (const w of [1440, 1280, 1200]) {
      await page.setViewportSize({ width: w, height: 1000 });
      await page.waitForTimeout(700);
      const m = await page.evaluate(() => {
        const c = document.querySelector('.pw[data-focus="true"]');
        const body = c.querySelector('.pw-body'), pill = c.querySelector('.pw-body .pw-cta');
        const cs = getComputedStyle(body);
        const bb = body.getBoundingClientRect(), pb = pill.getBoundingClientRect();
        const cb = c.getBoundingClientRect();
        return { over: Math.round(pb.right - (bb.right - parseFloat(cs.paddingRight))),
                 offCard: Math.round(pb.right - cb.right), pill: Math.round(pb.width) };
      });
      if (m.over <= 0 && m.offCard <= 0)
        ok(`4k ${shape} @${w} — the pill is inside its column`, `${m.pill}px, ${-m.over}px of slack`);
      else bad(`4k ${shape} @${w} — the pill escapes`, `${m.over}px past the column, ${m.offCard}px past the card`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => document.querySelector('.shape button[data-shape="wide"]').click());
  await page.waitForTimeout(1000);

  /* ═══ 4l · THE DUST IS THERE, AND IT IS DUST ════════════════════════════════════
     ⚠️ A PARTICLE LAYER IS EASY TO SHIP BROKEN AND HARD TO NOTICE. A canvas that sized
     itself and never painted looks exactly like restraint. Diffing two frames a moment
     apart is the only thing that separates "subtle" from "not running". */
  head('4l · The dust');
  const dust = await page.evaluate(() => {
    const c = document.getElementById('dust');
    if (!c) return null;
    const g = c.getContext('2d');
    const grab = () => { const d = g.getImageData(0, 0, c.width, c.height).data;
      let lit = 0, sum = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 6) { lit++; sum += d[i]; }
      return { lit, sum }; };
    return new Promise(res => {
      const a = grab();
      setTimeout(() => res({ a, b: grab(), w: c.width, h: c.height }), 700);
    });
  });
  if (!dust) bad('4l there is no dust canvas');
  else if (dust.a.lit > 200 && dust.b.lit > 200 && dust.a.sum !== dust.b.sum)
    ok('4l the dust is painting and moving', `${dust.a.lit.toLocaleString()} lit subpixels, ${dust.w}x${dust.h}`);
  else if (dust.a.lit > 200) bad('4l the dust is painted but frozen');
  else bad('4l the canvas is sized and empty', `${dust.a.lit} lit subpixels`);

  /* ═══ 4o · THE DUST MEANS ONE THING, AND IT TRAVELS WITH WHAT IT MEANS ═════════
     ⚠️⚠️ HIS WORDS: "the dust are out of control… they should only be out on the ones that
     are SELECTED, and they should track the location of that card." Both halves are
     assertions, and neither could be seen from the code:
       · with nothing selected and no card recently brought forward, the canvas must be
         EMPTY — dust that is always somewhere marks nothing;
       · with a card selected and the ring TURNED AWAY from it, the dust must have gone with
         it. Held in canvas pixels it stayed where it was born and scattered across the
         section, which is exactly what he saw.
     The second is measured by counting lit pixels inside that card's rect against every lit
     pixel outside it. A percentage is the only way to tell "on the card" from "near it". */
  head('4o · The dust marks a selection, and follows it');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => {
    for (const c of document.querySelectorAll('.pw[data-picked="true"]'))
      c.querySelector('.pw-body .pw-cta').click();
  });
  /* the bloom on the card in front lasts about 3.5s; wait it out so "empty" means empty */
  await page.waitForTimeout(5200);
  const painted = () => page.evaluate(() =>
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  await painted();
  const quiet = await page.evaluate(() => {
    const c = document.getElementById('dust');
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let lit = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 6) lit++;
    return { lit, picked: document.querySelectorAll('.pw[data-picked="true"]').length };
  });
  is('4o nothing is selected to begin with', quiet.picked, 0);
  if (quiet.lit < 400) ok('4o2 and with nothing selected the dust is gone', `${quiet.lit} lit subpixels`);
  else bad('4o2 dust is showing with nothing selected', `${quiet.lit} lit subpixels`);

  /* ⚠️⚠️ A CANVAS SHOWS THE LAST FRAME THAT WAS PAINTED, NOT THE CURRENT STATE, AND THAT IS
     WHAT MADE THIS BLOCK FLAKY RATHER THAN ANY BUG IN THE DUST. Motes age on the wall clock,
     so after a wait they are correctly dead — but if requestAnimationFrame has been starved
     (headless, an offscreen tab, a slow renderer) draw() has not run since, and the pixels
     still on the canvas are minutes old. The harness then measures a frame the page has
     already moved on from: 4o3 reported 64% once and 37% another time, and 100% on the very
     next run with nothing changed. Waiting for two real frames is the difference between
     reading the page and reading its history. */

  /* choose the card in front, then turn the ring three places away from it */
  await page.evaluate(() => document.querySelector('.pw[data-focus="true"] .pw-body .pw-cta').click());
  await page.waitForTimeout(500);
  const chosenIdx = await page.evaluate(() =>
    [...document.querySelectorAll('.pw')].findIndex(c => c.dataset.picked === 'true'));
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => document.getElementById('next').click());
    await page.waitForTimeout(950);
  }
  await page.waitForTimeout(4200);   /* let the blooms from those three turns expire */
  await painted();                   /* and let a frame actually be drawn without them */
  const tracked = await page.evaluate(idx => {
    const c = document.getElementById('dust');
    const g = c.getContext('2d');
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const sel = document.querySelectorAll('.pw')[idx];
    const o = c.getBoundingClientRect(), b = sel.getBoundingClientRect();
    const sx = c.width / o.width, sy = c.height / o.height;
    const x0 = (b.left - o.left) * sx, x1 = (b.right - o.left) * sx;
    const y0 = (b.top - o.top) * sy,  y1 = (b.bottom - o.top) * sy;
    let inn = 0, out = 0;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
      if (d[(y * c.width + x) * 4 + 3] <= 6) continue;
      if (x >= x0 && x <= x1 && y >= y0 && y <= y1) inn++; else out++;
    }
    return { inn, out, still: sel.dataset.picked === 'true' };
  }, chosenIdx);
  if (!tracked.still) bad('4o3 the chosen card lost its state while the ring turned');
  /* ⚠️ THE COUNT FLOOR IS DELIBERATELY LOW. A chosen card three places round the ring is a
     third of scale and its shimmer is a few dozen lit subpixels — the question this check
     answers is WHERE they are, not how many. The "is there enough of it" question is 4o2's,
     from the other direction. */
  else if (tracked.inn > 10 && tracked.inn / (tracked.inn + tracked.out) > .8)
    ok('4o3 the dust travelled with the card it marks',
       `${Math.round(tracked.inn / (tracked.inn + tracked.out) * 100)}% of it is on that card, three places round`);
  else if (tracked.inn + tracked.out < 10)
    bad('4o3 the chosen card has no dust at all after the ring turned', JSON.stringify(tracked));
  else bad('4o3 the dust stayed behind where the card used to be',
           `only ${Math.round(tracked.inn / (tracked.inn + tracked.out) * 100)}% is on the card`);

  /* ═══ 4p · THE CLIMB IS THE CASCADE'S, NOT ITS OWN NUMBER ══════════════════════
     ⚠️ HE ASKED FOR "a climb that is proportional". Rise is derived from (1 - scale), so the
     two are locked together — and this asserts the lock rather than the look. If the rise
     ever gets its own hardcoded ladder again, the neighbours drift back toward looking
     bottom-aligned with the middle card, which is what he drew on the screenshot. */
  head('4p · The climb follows the cascade');
  const freeze3 = await page.addStyleTag({ content: '.pw{animation:none !important}' });
  await page.waitForTimeout(150);
  const climb = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('.pw')], N = cs.length;
    const f = cs.findIndex(c => c.dataset.focus === 'true');
    const w = {}, ft = {};
    cs.forEach((c, i) => { let d = (i - f + N) % N; if (d > N / 2) d -= N;
      const r = c.getBoundingClientRect(); w[Math.abs(d)] = r.width; ft[Math.abs(d)] = r.bottom; });
    return [0, 1, 2, 3, 4].map(a => ({ w: w[a], foot: ft[a] })).filter(v => v.w);
  });
  const base = climb[0].w, lastA = climb.length - 1;
  const errs = climb.slice(1).map(v => {
    const wantLift = (1 - v.w / base) / (1 - climb[lastA].w / base);
    const gotLift = (climb[0].foot - v.foot) / (climb[0].foot - climb[lastA].foot);
    return Math.abs(wantLift - gotLift);
  });
  const worst = Math.max(...errs);
  if (worst <= .06)
    ok('4p every card climbs in proportion to how much smaller it is',
       climb.map(v => Math.round(climb[0].foot - v.foot) + 'px').join(' · '));
  else bad('4p the climb has drifted off the size cascade', `worst step off by ${(worst * 100).toFixed(0)}%`);
  /* the first neighbour must be VISIBLY lifted — this is the thing he circled */
  const firstLift = climb[0].foot - climb[1].foot;
  if (firstLift >= 14) ok('4p2 the cards beside the middle are clearly lifted off it', `${Math.round(firstLift)}px`);
  else bad('4p2 the neighbours still look bottom-aligned with the middle card', `only ${Math.round(firstLift)}px`);
  await freeze3.evaluate(n => n.remove());

  /* ═══ 5b · THE + TURNS THE CARD — HIS ADDITION, SO IT IS ASSERTED ══════════════
     ⚠️ THE + AND THE FACE MUST NEVER BOTH BE LIVE. The face adds the goal, the + opens the
     reading; a turned card whose face still takes clicks means one click doing two things,
     which is round 12's finding in a new costume.
     ⚠️ AND THE + HAS TO STAY IN THE TOP RIGHT OF WHAT THE READER SEES. rotateY mirrors
     POSITIONS as well as faces, so a control pinned to right:10px lands on the visual left
     of a turned card, on top of the first line of copy. */
  head('5b · The turn');
  await page.evaluate(() => document.querySelector('.pw[data-focus="true"] .pw-more').click());
  await page.waitForTimeout(1000);
  /* ⚠️ ONE CONTROL PER FACE NOW. The + is on the front and the x inside the back, each with
     its backface hidden — so neither has to be un-mirrored and neither jumps across the card
     when the turn starts. What has to hold is that BOTH write the same state: a close that
     did not clear data-open would leave a turned card in the ring with no way back. */
  const turned = await page.evaluate(() => {
    const c = document.querySelector('.pw[data-focus="true"]');
    const r = c.getBoundingClientRect(), m = c.querySelector('.pw-more').getBoundingClientRect();
    const back = c.querySelector('.pw-back');
    const bb = back.getBoundingClientRect();
    const hit = document.elementFromPoint(bb.x + bb.width / 2, bb.y + bb.height / 2);
    return { open: c.dataset.open,
             face: getComputedStyle(c.querySelector('.pw-face')).pointerEvents,
             shown: getComputedStyle(back).display !== 'none' && +getComputedStyle(back).opacity > .5,
             onTop: !!hit && hit.closest('.pw') === c,
             plusRight: m.x + m.width / 2 > r.x + r.width / 2,
             others: document.querySelectorAll('.pw:not([data-focus="true"]) .pw-more:not([style*="display: none"])').length };
  });
  is('5b the + turns the card', turned.open, 'true');
  is('5c and its face stops taking clicks', turned.face, 'none');
  if (turned.shown && turned.onTop) ok('5d the turned face is showing and on top');
  else bad('5d the back face did not come forward', JSON.stringify(turned));
  const faces = await page.evaluate(() => {
    const c = document.querySelector('.pw[data-focus="true"]');
    const back = getComputedStyle(c.querySelector('.pw-close'));
    return { close: !!c.querySelector('.pw-close'),
             /* the front's + must be face-away while the back is showing */
             plusHidden: getComputedStyle(c.querySelector('.pw-more')).backfaceVisibility === 'hidden',
             closeDrawn: !!c.querySelector('.pw-close svg') };
  });
  if (faces.close && faces.closeDrawn)
    ok('5e the turned face carries its own drawn close, not a typed glyph');
  else bad('5e the back has no close control, or it is a text glyph', JSON.stringify(faces));
  if (faces.plusHidden) ok('5e2 and the front\'s + turns away with its own face');
  else bad('5e2 the + is visible through the back of the card');
  /* turning back, and leaving the card, must both close it */
  await page.evaluate(() => document.querySelector('.pw[data-focus="true"] .pw-more').click());
  await page.waitForTimeout(800);
  is('5f pressing it again turns the card back',
     await page.evaluate(() => document.querySelector('.pw[data-focus="true"]').dataset.open), 'false');
  /* and the BACK's own control has to clear the same state */
  await page.evaluate(() => document.querySelector('.pw[data-focus="true"] .pw-more').click());
  await page.waitForTimeout(950);
  await page.evaluate(() => document.querySelector('.pw[data-focus="true"] .pw-close').click());
  await page.waitForTimeout(950);
  is('5f2 and the x on the back closes it too',
     await page.evaluate(() => document.querySelector('.pw[data-focus="true"]').dataset.open), 'false');
  await page.evaluate(() => document.querySelector('.pw[data-focus="true"] .pw-more').click());
  await page.waitForTimeout(700);
  await page.evaluate(() => document.getElementById('next').click());
  await page.waitForTimeout(900);
  /* ⚠️ A CARD LEFT TURNED AS IT ROTATES AWAY IS A CARD SHOWING ITS BACK IN THE RING —
     burgundy where seven photographs are, and no way to reach its + any more. */
  is('5g and turning the ring closes it',
     await page.evaluate(() =>
       [...document.querySelectorAll('.pw')].filter(c => c.dataset.open === 'true').length), 0);

  /* ═══ 6 · THE ARTIFACT COPY IS ACTUALLY SELF-CONTAINED ══════════════════════════ */
  head('6 · The packed copy');
  const packed = path.join(OUT, '_hybrid-packed.html');
  execFileSync(process.execPath, [path.join(ROOT, 'tools/pack-artifact.mjs'), SRC,
    path.relative(ROOT, packed)], { cwd: ROOT, stdio: 'pipe' });
  const body = fs.readFileSync(packed, 'utf8');
  const wrapped = path.join(OUT, '_hybrid-wrapped.html');
  fs.writeFileSync(wrapped, '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + body + '</body></html>');
  const p2 = await ctx.newPage();
  const fetched = [];
  await p2.route('**/*', r => {
    const u = r.request().url();
    if (u.startsWith('data:') || u.startsWith('blob:') || u.endsWith('_hybrid-wrapped.html')) return r.continue();
    fetched.push(u.slice(0, 80)); return r.abort();
  });
  await p2.goto('file://' + wrapped, { waitUntil: 'load' });
  await p2.waitForTimeout(2600);
  const packedState = await p2.evaluate(async () => {
    await document.fonts.ready;
    const faces = [...document.fonts].map(f => f.family + '|' + f.status);
    return { three: typeof window.THREE === 'object' && !!window.THREE.WebGLRenderer,
             gl: !!document.getElementById('depth'),
             cards: document.querySelectorAll('.pw').length,
             art: document.querySelectorAll('.pw.has-art').length,
             faces: ['Playfair', 'MediGyn NOW', 'MediGyn Megante']
               .filter(w => faces.some(f => f.startsWith(w) && f.endsWith('|loaded'))).length,
             /* the host supplies the document; a second one nested inside the body is the
                classic way an artifact renders as raw text */
             nested: document.querySelectorAll('body html, body head').length };
  });
  if (!fetched.length) ok('6  the packed copy fetches nothing at all');
  else bad(`6  it still reaches for ${fetched.length} file(s)`, fetched.slice(0, 3).join(', '));
  is('6a all three faces load from inside the file', packedState.faces, 3);
  if (packedState.three) ok('6b three.js is present as a global');
  else bad('6b window.THREE never appeared — the export rewrite failed');
  /* ⚠️ THE SCULPTURE IS THE FALLBACK, SO WITH EIGHT PHOTOGRAPHS IT MUST NOT BOOT AT ALL —
     a glass vessel hovering over a photograph of neurons is two pictures fighting inside one
     card. The first version of this check asserted the opposite and failed a correct page,
     which is the harness testing its own old assumption rather than the build. */
  if (packedState.art === 8 && !packedState.gl)
    ok('6c the sculpture stands down — every card has its photograph');
  else if (packedState.art < 8 && packedState.gl)
    ok('6c the sculpture stands in where a photograph is missing', `${8 - packedState.art} card(s)`);
  else bad('6c sculpture and photographs disagree',
           `art ${packedState.art}/8, sculpture ${packedState.gl}`);
  is('6d eight cards survived the pack', packedState.cards, 8);
  is('6g and all eight photographs came with it', packedState.art, 8);
  is('6e no nested document', packedState.nested, 0);
  const mb = (fs.statSync(packed).size / 1048576);
  if (mb <= 16) ok(`6f under the 16 MB artifact ceiling`, `${mb.toFixed(2)} MB`);
  else bad('6f too large to publish', `${mb.toFixed(2)} MB`);
  fs.rmSync(packed, { force: true }); fs.rmSync(wrapped, { force: true });

  /* ═══ 7 · AND IT STAYS QUIET ═══════════════════════════════════════════════════ */
  head('7 · Console');
  if (!errors.length) ok('7  zero console and page errors across the whole walk');
  else bad(`7  ${errors.length} error(s)`, errors.slice(0, 3).join(' | '));

  await browser.close();
  server.close();
  console.log(`\n\x1b[1m${fail ? '\x1b[31m' : '\x1b[32m'}${pass} passed, ${fail} failed\x1b[0m`);
  process.exit(fail ? 1 : 0);
};

run().catch(e => { console.error(e); process.exit(1); });
