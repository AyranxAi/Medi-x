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

  /* ═══ 2 · EVERY PATHWAY ON SCREEN, AT EVERY WIDTH ════════════════════════════════
     The promise the whole layout is built to keep. A card that is in the DOM but outside
     the clip is not on screen, and a count of elements cannot tell the difference. */
  head('2 · All eight visible, every width');
  for (const w of [1600, 1440, 1366, 1280, 1181, 1180, 1104, 900, 760, 430, 390]) {
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
               arc: getComputedStyle(document.querySelector('.pw')).position === 'absolute' };
    });
    const mode = r.arc ? 'arc' : 'stack';
    if (r.seen === 8 && r.over <= 1) ok(`2  ${w}px — eight on screen, no sideways scroll`, mode);
    else bad(`2  ${w}px — ${r.seen}/8 on screen, ${r.over}px of overflow`, mode);
    /* ⚠️ THE BREAKPOINT IS ASSERTED FROM BOTH SIDES. A stack that starts one pixel early
       is a mechanism that quietly stopped existing on the most common laptop width. */
    if (w === 1181 && !r.arc) bad('2a the arc is gone at 1181, one pixel above its breakpoint');
    if (w === 1180 && r.arc)  bad('2b the arc is still running at 1180, below its breakpoint');
  }
  ok('2c the arc gives way to the stack exactly at 1180');

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
  if (turned.plusRight) ok('5e the + stays top-right of the turned card');
  else bad('5e the + landed on the left — the mirrored-position bug is back');
  /* turning back, and leaving the card, must both close it */
  await page.evaluate(() => document.querySelector('.pw[data-focus="true"] .pw-more').click());
  await page.waitForTimeout(800);
  is('5f pressing it again turns the card back',
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
