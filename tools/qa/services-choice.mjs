/* Section 04 QA — the eight became a choice. Does the page still work, and does
   the choice actually do anything?

     PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
     node tools/qa/services-choice.mjs [--shots]

   Exits non-zero on any failure. This is a companion to peptide-page.mjs, not a
   replacement — that one still owns the scene, the grade and the dialogs.

   THE THREE THINGS THIS EXISTS FOR:

   1 · THE HIT-AREA SWAP, NOW IN ITS THIRD COSTUME. Until 2026-08-16 the whole tile
       was the + button. Then the tile became a CHOICE and the + moved to a corner.
       Round 18 replaced the grid with the RING, and the same rule had to survive the
       move: the card's face chooses, the + turns the card over, and neither may own
       the other's pixels. Checks 4–6 assert it in every direction, including the one
       the ring adds — a card that is NOT at the front takes a click as "bring me
       forward" and must not quietly select a goal the reader cannot even read yet.

   1b · WHAT THIS FILE DOES *NOT* COVER. The ring's own geometry — the size cascade,
       the climb, the arc, the dust, the flip — is section04-hybrid.mjs's job, against
       the lab. This file owns the SEAM: that the ring is on the live page, that the
       tray hears it, and that the page still holds around it.

   2 · THE ARITHMETIC. VAT is added at 5% on his instruction. A price a customer can
       dispute after paying deserves an assertion, not a glance.

   3 · THE PANEL DOES NOT EXIST UNTIL IT IS OPENED. Its markup is cloned into the
       .pxd shell, so every check against it has to open it first — and the binding
       has to be delegated, which is the trap the mock-booking guard and the
       chooser's portraits both fell into.

   ⚠️⚠️ THE FLOAT WILL TIME OUT EVERY CLICK YOU DO NOT GUARD. Each card carries a 2.5px
   16s breathing animation, and Playwright waits for an element to be STABLE before it
   clicks — which a permanently animating element never is. The fix, used at every
   interaction below: page.addStyleTag('.pw{animation:none!important}') once, up front.
   That is a harness measure and not a page one; the animation ships. */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SHOTS = process.argv.includes('--shots');
const OUT = process.env.OUT || path.join(ROOT, '.qa-out');
if (SHOTS) fs.mkdirSync(OUT, { recursive: true });

function findChromium() {
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

let pass = 0, fail = 0;
const ok  = (n, m = '') => { pass++; console.log(`  \x1b[32m✓\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const bad = (n, m = '') => { fail++; console.log(`  \x1b[31m✗\x1b[0m ${n}${m ? ' — ' + m : ''}`); };
const is  = (n, got, want) => String(got) === String(want) ? ok(n, String(got)) : bad(n, `got ${got}, want ${want}`);
const has = (n, hay, needle) => String(hay).includes(needle) ? ok(n, needle) : bad(n, `"${needle}" not in "${String(hay).slice(0,120)}"`);

/* the page loads three scripts from jsDelivr, which the QA environment blocks.
   Serve the same versions from node_modules by interception, exactly as
   peptide-page.mjs does — nothing about that ships. */
const CDN = {
  'gsap@3.13.0/dist/gsap.min.js':      'gsap/dist/gsap.min.js',
  'gsap@3.13.0/dist/ScrollTrigger.min.js': 'gsap/dist/ScrollTrigger.min.js',
  'gsap@3.13.0/dist/SplitText.min.js': 'gsap/dist/SplitText.min.js',
  'lenis@1.3.4/dist/lenis.min.js':     'lenis/dist/lenis.min.js'
};

const run = async () => {
  const dir = path.join(ROOT, 'peptide-therapy');
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '') || 'index.html';
    const f = path.join(ROOT, rel.startsWith('images/') || rel.startsWith('fonts/') ? rel : path.join('peptide-therapy', rel));
    const alt = path.join(ROOT, rel);
    const file = fs.existsSync(f) ? f : alt;
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end('nope'); }
    const ext = path.extname(file);
    res.setHeader('content-type', { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
      '.webp':'image/webp', '.avif':'image/avif', '.png':'image/png', '.woff2':'font/woff2' }[ext] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise(r => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}/`;

  const browser = await chromium.launch({ executablePath: findChromium(), args: ['--force-color-profile=srgb'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.route('**/cdn.jsdelivr.net/**', route => {
    const hit = Object.keys(CDN).find(k => route.request().url().includes(k));
    const local = hit && path.join(ROOT, 'node_modules', CDN[hit]);
    if (local && fs.existsSync(local))
      return route.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(local, 'utf8') });
    route.abort();
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto(base, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  /* WCAG's own arithmetic, shared by every contrast check below — hoisted here because the
     back face is measured in section B, long before the chosen-state block at the end. */
  const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = ([r,g,b]) => 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
  const parse = s => { const n = (s.match(/[\d.]+/g)||[]).map(Number); return { c:n.slice(0,3), a:n.length>3?n[3]:1 }; };
  const contrast = (fg,bg) => { const f = parse(fg), b = parse(bg);
    const o = f.c.map((v,i)=> v*f.a + b.c[i]*(1-f.a));
    const [x,y] = [lum(o), lum(b.c)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };
  console.log('\n\x1b[1mA · the eight, on the ring\x1b[0m');
  /* ⚠️ ONCE, UP FRONT — see the note at the top of this file. Every click below would
     otherwise wait thirty seconds for a card that never stops breathing. */
  await page.addStyleTag({ content: '.pw{animation:none!important}' });
  const grid = await page.evaluate(() => ({
    cards: document.querySelectorAll('.pw').length,
    faces: document.querySelectorAll('.pw-face').length,
    marks: document.querySelectorAll('.pw-mark').length,
    mores: document.querySelectorAll('.pw-more').length,
    backs: document.querySelectorAll('.pw-back').length,
    art:   document.querySelectorAll('.pw.has-art').length,
    dots:  document.querySelectorAll('#railDots button').length,
    nums:  [...document.querySelectorAll('.pw-n')].map(n => n.textContent.trim()).join(','),
    names: [...document.querySelectorAll('.pw-body h3')].map(h => h.textContent.trim()).join('|'),
    /* eight <svg>s all drawing the same figure would pass every count ever written */
    uniqueMarks: new Set([...document.querySelectorAll('.pw-mark')]
      .map(s => [...s.querySelectorAll('path,circle')]
        .map(e => e.getAttribute('d') || e.getAttribute('cx') + ',' + e.getAttribute('cy')).join(';'))).size,
    /* the tiles and their popups are gone — assert their ABSENCE, or they drift back */
    oldTiles: document.querySelectorAll('.px, .px-pick, .px-open, .px-detail').length,
    oldGrid: !!document.querySelector('.px-grid')
  }));
  is('1  eight cards', grid.cards, 8);
  is('1a eight faces to choose with', grid.faces, 8);
  is('1b eight marks', grid.marks, 8);
  is('1c eight DIFFERENT marks', grid.uniqueMarks, 8);
  is('1d the + survived on all eight', grid.mores, 8);
  is('1e eight back faces', grid.backs, 8);
  /* ⚠️⚠️ THE ARTWORK IS ASSERTED, NOT ASSUMED, AND THE CARD IS BUILT TO SURVIVE ITS ABSENCE.
     A card only gains .has-art once a probe Image() has actually LOADED its file — so this
     is the check that a rename, a bad path or a missing webp cannot pass. Without it the
     eight fall back to their gradient plate and their line mark, which looks deliberate
     enough that nobody would report it. */
  is('1f all eight photographs actually loaded', grid.art, 8);
  is('1g a dot for every card', grid.dots, 8);
  /* ⚠️⚠️ THE DOTS' POSITION IS ASSERTED BECAUSE THEY SILENTLY MOVED. The foot is a grid, and
     dropping the lab's tally left two items auto-placing into three columns — so the dots,
     still faithfully `justify-self:end`, ended at the end of the MIDDLE column, sitting in
     the centre of the row with the right-hand third empty. Nothing errored and every count
     passed. A row's arrangement needs an assertion about where things ARE, not how many. */
  const footRow = await page.evaluate(() => {
    const foot = document.querySelector('.rail-foot').getBoundingClientRect();
    const hint = document.querySelector('.hint').getBoundingClientRect();
    const dots = document.querySelector('#railDots').getBoundingClientRect();
    return { hintLeft: Math.round(hint.left - foot.left),
             dotsRight: Math.round(foot.right - dots.right),
             apart: Math.round(dots.left - hint.right) };
  });
  footRow.hintLeft < 4 && footRow.dotsRight < 4
    ? ok('1k the hint sits left and the dots right', `${footRow.hintLeft}px / ${footRow.dotsRight}px, ${footRow.apart}px apart`)
    : bad('1k the foot row has drifted', JSON.stringify(footRow));
  /* ⚠️⚠️ THE NUMERALS CAME BACK IN ROUND 18, REVERSING ROUND 12, AND THAT IS WRITTEN DOWN
     RATHER THAN QUIETLY DONE. Round 12 removed them from the grid with this reasoning: on
     a MULTI-SELECT they imply a sequence that does not exist, and check 1e asserted zero.
     On the ring they are doing a different job — at the far end a card is a third of scale
     and its NAME has faded out entirely, so the numeral is the only thing identifying it,
     and in a thing you turn through, a number reads as a position rather than a step.
     ⚠️ SO THE CHECK IS INVERTED, NOT DELETED: it now pins the numerals to the CARD ORDER,
     which is the fault that would actually hurt — a reordering that leaves 03 on the fourth
     card is a page that contradicts itself and nothing else would notice. */
  is('1h the numerals run in card order', grid.nums, '01,02,03,04,05,06,07,08');
  is('1i the old tiles are gone', grid.oldTiles, 0);
  is('1j and so is their grid', grid.oldGrid, false);
  /* ⚠️⚠️ EVERY SCREEN-READER-ONLY SPAN ON THE PAGE, MEASURED — because one of them shipped
     VISIBLE. The ring's card faces carry their accessible name in <span class="sr">, and the
     rule that hides it was not part of what came over from the lab: the goal's name rendered
     in the browser's default face across the middle of all eight photographs, which looked
     enough like part of the artwork to be mistaken for the client's own images.
     ⚠️ MEASURED, NOT ASSERTED BY SELECTOR. `.sr` existing in the stylesheet proves nothing —
     a later rule, a different class name, or one span that missed the class all put readable
     text back on the page. A hidden thing has a box of about a pixel; that is the test. */
  const bare = await page.evaluate(() => [...document.querySelectorAll('.sr')]
    .map(el => { const b = el.getBoundingClientRect();
                 return { w: Math.round(b.width), h: Math.round(b.height),
                          text: el.textContent.trim().slice(0, 32) }; })
    .filter(x => x.w > 4 || x.h > 4));
  bare.length === 0
    ? ok('1l no screen-reader-only text is rendering visibly',
         `${await page.evaluate(() => document.querySelectorAll('.sr').length)} spans, all hidden`)
    : bad('1l screen-reader-only text is on the page', JSON.stringify(bare.slice(0, 3)));

  has('2  the heading asks rather than announces',
      await page.evaluate(() => document.querySelector('#services h2').textContent), 'Where would you like to begin');
  /* ⚠️ THIS PINNED THE STRING "as many as apply" AND THE COPY MOVED UNDER IT — 2026-08-17.
     The lede is now "Choose as many goals as you like to focus your consultation on."; the
     old literal made this check fail on a page that is correct, which is the same trap
     peptide-page.mjs's token checks fell into the same day.
     ⚠️ WHAT IT GUARDS HAS NOT CHANGED and is the reason the lede exists at all: the eight
     are a MULTI-SELECT and this sentence is the only thing on the page that says so. It
     now asserts the meaning — an "as many …" construction — rather than one phrasing of
     it, so the copy can be rewritten again without the check crying wolf, but a lede that
     stops inviting more than one pick still fails. */
  {
    const lede = await page.evaluate(() => document.querySelector('.sec-lede').textContent.replace(/\s+/g, ' ').trim());
    /^|.*/.test(lede) && (/as many/i.test(lede) && /goal|apply|like/i.test(lede)
      ? ok('2c the lede says you may pick more than one', lede)
      : bad('2c the lede no longer invites more than one pick', lede));
  }
  has('2a the client\'s spellings survive', grid.names, 'Anti Ageing');
  has('2b and the ampersand one', grid.names, 'Skin & Hair Loss');

  /* ⚠️⚠️ BOTH OF THE CLIENT'S PARAGRAPHS, ON EVERY CARD. The lab's card printed only the
     first — it was built to show a mechanism, and the second paragraph did not fit. Bringing
     the ring across without noticing would have deleted a paragraph of his copy from all
     eight pathways, silently, in a commit about layout. This is the check that says it did
     not happen, and it is the reason .pw-back scrolls. */
  const backs = await page.evaluate(() =>
    [...document.querySelectorAll('.pw-back')].map(b => ({
      paras: b.querySelectorAll('p').length,
      chars: b.textContent.trim().length,
      outs: b.querySelectorAll('.pw-out li').length })));
  is('3  every back face carries both paragraphs', backs.every(b => b.paras === 2), true);
  backs.every(b => b.chars > 300) ? ok('3a and none was emptied', `min ${Math.min(...backs.map(b=>b.chars))} chars`)
                                  : bad('3a and none was emptied', backs.map(b=>b.chars).join('/'));
  is('3b and its outcomes', backs.every(b => b.outs === 4), true);

  console.log('\n\x1b[1mA2 · the ring on a phone\x1b[0m');
  /* ⚠️⚠️ THE WHOLE POINT OF THIS BLOCK IS THAT THE MECHANISM IS THE SAME ONE. Until
     2026-08-17 everything below 1181 was a flat stacked list, and the flip went with it: a
     stacked card is transform-style:flat inside a rail with perspective:none, so
     rotateY(180deg) MIRRORS it instead of turning it. His report was "its only 2d and if you
     flip it its nothing" — what he was shown was his own card with the type backwards.
     ⚠️ SO THESE CHECKS ARE DELIBERATELY THE SAME QUESTIONS AS THE DESKTOP ONES. If the phone
     ever quietly falls back to a 2D list again, they are what says so. */
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.addStyleTag({ content: '.pw{animation:none!important}' });
  await page.evaluate(() => document.querySelector('#services').scrollIntoView());
  await page.waitForTimeout(600);

  const phone = await page.evaluate(() => {
    const rail = document.querySelector('.rail'), cs = getComputedStyle(rail);
    const cards = [...document.querySelectorAll('.pw')];
    const vis = cards.filter(c => c.dataset.park !== 'true');
    const rr = rail.getBoundingClientRect();
    return {
      isRing: rail.classList.contains('is-ring'),
      perspective: cs.perspective,
      fan: vis.length, parked: cards.length - vis.length, total: cards.length,
      fullBleed: Math.round(rr.width) >= innerWidth - 1,
      front: Math.round(document.querySelector('.pw[data-focus="true"]').getBoundingClientRect().width),
      /* ⚠️ THE FAN IS SYMMETRIC, so five cards give THREE distinct widths and not five —
         the first version of this check wanted five and was simply wrong about the shape it
         was measuring. What actually matters is that the widths fall away from the middle:
         a stack has one width, a ring has a cascade. This reads them left to right. */
      widths: vis.map(c => ({ x: c.getBoundingClientRect().left,
                              w: Math.round(c.getBoundingClientRect().width) }))
                 .sort((a, b) => a.x - b.x).map(o => o.w),
      parkedInert: cards.filter(c => c.dataset.park === 'true')
        .every(c => getComputedStyle(c).pointerEvents === 'none')
    };
  });
  is('A2a the ring is running, not the stack', phone.isRing, true);
  /* ⚠️ perspective:none IS EXACTLY THE OLD BUG'S FINGERPRINT — without it a turn is a mirror */
  phone.perspective !== 'none' ? ok('A2b and it has perspective', phone.perspective)
                               : bad('A2b the rail is flat again — the flip will mirror, not turn');
  is('A2c five cards in the fan', phone.fan, 5);
  is('A2d and the other three wait off it', phone.parked, 3);
  is('A2e all eight are still in the ring', phone.total, 8);
  is('A2f the rail takes the whole screen', phone.fullBleed, true);
  phone.front >= 240 ? ok('A2g the front card is big enough for its pill', phone.front + 'px')
                     : bad('A2g the front card is too small for its pill', phone.front + 'px');
  const w = phone.widths, mid = (w.length - 1) / 2;
  const falls = w.every((v, i) => i === mid || v < w[Math.round(mid)]) &&
                w[0] < w[1] && w[w.length - 1] < w[w.length - 2];
  const symmetric = w.every((v, i) => Math.abs(v - w[w.length - 1 - i]) <= 1);
  falls && symmetric
    ? ok('A2h the fan is a cascade, not a stack', w.join(' · '))
    : bad('A2h the fan is flat or lopsided', w.join(' · '));
  is('A2i a parked card cannot be clicked', phone.parkedInert, true);

  /* ⚠️⚠️ AND THE FLIP, WHICH IS THE BUG HE REPORTED. Turning must show the BACK — the card's
     own description — and not a mirrored copy of its front. Reading the back's opacity is not
     enough on its own: in the broken version the back was present and lit, and the front was
     painted over it, so this also asks what is actually on top at the card's centre. */
  await page.click('.pw[data-focus="true"] .pw-more');
  await page.waitForTimeout(1100);
  const flip = await page.evaluate(() => {
    const c = document.querySelector('.pw[data-open="true"]');
    if (!c) return { open: false };
    const back = c.querySelector('.pw-back'), r = c.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { open: true, opacity: getComputedStyle(back).opacity,
             onBack: !!hit && back.contains(hit),
             paras: back.querySelectorAll('p').length };
  });
  is('A2j the + turns the card on a phone', flip.open, true);
  is('A2k the back is lit', flip.opacity, '1');
  is('A2l and the back is what the reader touches — not a mirrored front', flip.onBack, true);
  is('A2m carrying both paragraphs', flip.paras, 2);
  await page.click('.pw[data-focus="true"] .pw-close');
  await page.waitForTimeout(900);

  /* the ring turns by thumb; the arrows are the discoverable way and must still be reachable */
  const before = await page.evaluate(() => document.querySelector('.pw[data-focus="true"]').dataset.i);
  await page.click('#railNext');
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => document.querySelector('.pw[data-focus="true"]').dataset.i);
  after !== before ? ok('A2n the arrows turn the ring on a phone', `${before} → ${after}`)
                   : bad('A2n the arrows do nothing on a phone', before);
  has('A2o and the instruction says swipe, not drag',
      await page.evaluate(() => {
        const s = document.querySelector('.hint-swipe');
        return s ? s.textContent : '';
      }), 'Swipe');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  await page.addStyleTag({ content: '.pw{animation:none!important}' });
  await page.evaluate(() => document.querySelector('#services').scrollIntoView());
  await page.waitForTimeout(500);

  console.log('\n\x1b[1mB · the hit-area swap, in every direction\x1b[0m');
  await page.evaluate(() => document.querySelector('#services').scrollIntoView());
  await page.waitForTimeout(500);

  /* ⚠️⚠️ THE RING ADDS A THIRD MEANING TO A CLICK AND THIS IS THE CHECK FOR IT. On the grid
     a tile only ever chose. On the ring a card that is NOT at the front is largely hidden
     behind its neighbours and its name may have faded out entirely — so a click there means
     "bring this forward", and if it ALSO chose, the reader would be adding goals they have
     not read to a programme they are still browsing. */
  const away = await page.evaluate(() => {
    const c = [...document.querySelectorAll('.pw')].find(c => c.dataset.focus !== 'true');
    return c.dataset.i;
  });
  await page.click(`.pw[data-i="${away}"] .pw-face`);
  await page.waitForTimeout(700);
  is('4  clicking a card away from the front brings it forward',
     await page.evaluate(i => document.querySelector(`.pw[data-i="${i}"]`).dataset.focus, away), 'true');
  is('4a and chooses nothing',
     await page.evaluate(() => document.querySelectorAll('.pw[data-picked="true"]').length), 0);
  await page.click(`.pw[data-i="${away}"] .pw-face`);
  await page.waitForTimeout(300);
  is('4b clicking the front card chooses it',
     await page.evaluate(i => document.querySelector(`.pw[data-i="${i}"]`).dataset.picked, away), 'true');
  is('4c and does NOT open the dialog',
     await page.evaluate(() => document.querySelector('#pxd').hidden), true);
  await page.click(`.pw[data-i="${away}"] .pw-face`);
  await page.waitForTimeout(300);
  is('4d clicking again deselects',
     await page.evaluate(i => document.querySelector(`.pw[data-i="${i}"]`).dataset.picked, away), 'false');

  const plus = await page.evaluate(() => {
    const card = document.querySelector('.pw[data-focus="true"]');
    const b = card.querySelector('.pw-more').getBoundingClientRect(), t = card.getBoundingClientRect();
    return { w: Math.round(b.width), h: Math.round(b.height),
             fromTop: Math.round(b.top - t.top), fromRight: Math.round(t.right - b.right) };
  });
  plus.w >= 44 && plus.h >= 44 ? ok('5  the + has a thumb-sized target', `${plus.w}×${plus.h}`)
                               : bad('5  the + has a thumb-sized target', `${plus.w}×${plus.h}`);
  plus.fromTop < 30 && plus.fromRight < 30
    ? ok('5a and sits in the top right corner', `${plus.fromTop}px / ${plus.fromRight}px`)
    : bad('5a and sits in the top right corner', JSON.stringify(plus));
  /* ⚠️ ONLY ON THE CARD IN FRONT. A + on a card at a third of scale is a target nobody can
     hit and a decoration everybody can see — and it would sit on top of the neighbour it
     overlaps, so the click would land on the wrong card entirely. */
  is('5b and only on the card in front',
     await page.evaluate(() => [...document.querySelectorAll('.pw')]
       .filter(c => getComputedStyle(c.querySelector('.pw-more')).display !== 'none').length), 1);

  /* ⚠️⚠️ HIT-TESTED, NOT JUST PRESENT — AND THIS CHECK EXISTS BECAUSE THE PILL FAILED IT.
     The card's face covers the whole card, and the body sat underneath it: the primary
     "Add to your programme" pill was a picture of a button sitting on top of a different
     button that happened to do the same thing. Every count and every content assertion
     passed the whole time, and the hover state simply never fired. elementFromPoint is the
     only assertion that can tell a control apart from a drawing of one. */
  const onTop = await page.evaluate(() => {
    const test = el => {
      const b = el.getBoundingClientRect();
      const hit = document.elementFromPoint(b.left + b.width/2, b.top + b.height/2);
      return !!hit && (hit === el || el.contains(hit));
    };
    const card = document.querySelector('.pw[data-focus="true"]');
    return { pill: test(card.querySelector('.pw-body .pw-cta')),
             plus: test(card.querySelector('.pw-more')) };
  });
  is('5c the front card\'s pill is the topmost thing at its own centre', onTop.pill, true);
  is('5d and so is the +', onTop.plus, true);

  await page.click('.pw[data-focus="true"] .pw-more');
  await page.waitForTimeout(900);
  is('6  the + turns the card over',
     await page.evaluate(() => document.querySelector('.pw[data-focus="true"]').dataset.open), 'true');
  is('6a and shows the back',
     await page.evaluate(() => getComputedStyle(
       document.querySelector('.pw[data-focus="true"] .pw-back')).opacity), '1');
  /* ⚠️ THE DIALOG IS NOT INVOLVED ANY MORE. The eight .px-detail templates went with the
     grid; if the shell ever opens from a card again, something has been rebound to markup
     that no longer exists. */
  is('6b and the dialog stays shut',
     await page.evaluate(() => document.querySelector('#pxd').hidden), true);
  is('6c and turning it chose nothing',
     await page.evaluate(() => document.querySelectorAll('.pw[data-picked="true"]').length), 0);
  /* ⚠️ WHILE A CARD IS TURNED ITS FACE STOPS TAKING CLICKS, so one click never means two
     things. The x is inside the back and inherits the turn — see the note in the page. */
  is('6d the turned card\'s face is inert',
     await page.evaluate(() => getComputedStyle(
       document.querySelector('.pw[data-open="true"] .pw-face')).pointerEvents), 'none');
  /* ⚠️⚠️ THE BACK'S OWN COLOURS, MEASURED — because its heading shipped dark-on-burgundy.
     .pw-back sets ivory text and the h3 took it by inheritance, which the live page's global
     `h1,h2,h3{color:var(--ink)}` overrides. A lifted component cannot rely on what its new
     host page does not say, and the failure is invisible to every structural assertion. */
  const backInk = await page.evaluate(() => {
    const b = document.querySelector('.pw[data-open="true"] .pw-back');
    const bg = getComputedStyle(b).backgroundColor;
    return { h3: [getComputedStyle(b.querySelector('h3')).color, bg],
             p:  [getComputedStyle(b.querySelector('p')).color, bg],
             chip:[getComputedStyle(b.querySelector('.pw-out li')).color, bg] };
  });
  for (const [k,[fg,bg]] of Object.entries(backInk)) {
    const r = contrast(fg, bg);
    r >= 4.5 ? ok(`6f the back's ${k} clears 4.5:1`, r.toFixed(2))
             : bad(`6f the back's ${k} clears 4.5:1`, `${r.toFixed(2)} — ${fg} on ${bg}`);
  }

  await page.click('.pw[data-focus="true"] .pw-close');
  await page.waitForTimeout(900);
  is('6e the x turns it back',
     await page.evaluate(() => document.querySelector('.pw[data-focus="true"]').dataset.open), 'false');

  console.log('\n\x1b[1mC · the tray\x1b[0m');
  is('7  down before anything is chosen',
     await page.evaluate(() => document.querySelector('#px-tray').classList.contains('on')), false);
  /* ⚠️ TWO CLICKS PER CARD, AND THAT IS THE MECHANISM RATHER THAN A WORKAROUND: the first
     brings the card to the front, the second chooses it. Gut Health is picked BEFORE Brain
     Health so that check 7c is actually testing something — see the note there. */
  const choose = async i => {
    await page.click(`.pw[data-i="${i}"] .pw-face`);
    await page.waitForTimeout(650);
    await page.click(`.pw[data-i="${i}"] .pw-face`);
    await page.waitForTimeout(250);
  };
  await choose(2);            /* Gut Health */
  await choose(1);            /* Brain Health */
  await page.waitForTimeout(400);
  const tray = await page.evaluate(() => ({
    on: document.querySelector('#px-tray').classList.contains('on'),
    n: document.querySelector('#px-tray-n').textContent.trim(),
    l: document.querySelector('#px-tray-l').textContent.trim(),
    onScreen: document.querySelector('#px-tray').getBoundingClientRect().bottom <= innerHeight + 2
  }));
  is('7a it arrives on the first pick', tray.on, true);
  is('7b and counts', tray.n, '2 chosen');
  /* ⚠️ RING ORDER, NEVER CLICK ORDER — and the picks above are made in the OPPOSITE order
     on purpose, so a regression to tap order reads "Gut Health · Brain Health" and fails
     here. Read back in tap order the same two goals render two different ways. */
  is('7c and reads in ring order, not tap order', tray.l, 'Brain Health · Gut Health');
  /* ⚠️⚠️ THE CHOSEN STATE HAS THREE HOMES AND THEY ARE ONE FACT. The tick on the card, the
     dot under the ring and the tray all read `data-picked` off the same eight cards — round
     18 deleted the tray's own `picked` array precisely so they could not disagree. If this
     count ever diverges from the tray's, two scripts are keeping score again. */
  is('7e the dots carry the same two',
     await page.evaluate(() => document.querySelectorAll('#railDots button[data-picked="true"]').length), 2);
  is('7f and so do the cards',
     await page.evaluate(() => document.querySelectorAll('.pw[data-picked="true"]').length), 2);
  is('7d and is on screen', tray.onScreen, true);

  console.log('\n\x1b[1mD · the panel and the arithmetic\x1b[0m');
  await page.click('#px-tray-go');
  await page.waitForTimeout(600);
  is('8  the tray opens the panel',
     await page.evaluate(() => !document.querySelector('#pxd').hidden), true);
  const p1 = await page.evaluate(() => ({
    recap: document.querySelector('#pg-recap').textContent.trim(),
    sub: document.querySelector('#pg-sub').textContent.trim(),
    vat: document.querySelector('#pg-vat').textContent.trim(),
    total: document.querySelector('#pg-total').textContent.trim(),
    steps: document.querySelectorAll('.pg-steps li').length,
    /* the step TITLES in document order — the <small> is stripped so a copy edit inside a
       step's description does not move an order assertion */
    stepOrder: [...document.querySelectorAll('.pg-steps li')].map(li => {
      const s = li.querySelector('span:nth-child(2)').cloneNode(true);
      const sm = s.querySelector('small'); if (sm) sm.remove();
      return s.textContent.trim();
    }),
    incl: document.querySelectorAll('.pg-blk:not(.pg-blk--soft) .pg-list li').length
  }));
  has('8a it names both goals', p1.recap, 'Brain Health');
  has('8b and the second', p1.recap, 'Gut Health');
  /* ⚠️ VAT IS STATED, NOT COMPUTED — his call. One row, not three: a summary that
     shows tax working is a receipt, and this panel is not a checkout. */
  /* ⚠️ HIS INSTRUCTION REVERSED THE SAME DAY and the second one stands: "the +5%
     should be there with the total price". The tax is IN the total, not promised at
     a checkout the customer has not reached — a number that grows after you decide
     is the most disputed thing in any purchase. */
  is('9  programme line', p1.sub, 'AED 1,150.00');
  is('9a VAT at 5%', p1.vat, 'AED 57.50');
  is('9b the total carries it', p1.total, 'AED 1,207.50');
  /* ⚠️ SIX SINCE ROUND 14, AND THE COUNT IS NOT THE POINT — THE ORDER IS. His correction:
     the doctor is CHOSEN at 03 and reads the file afterwards, where the old copy had a
     stranger reading the labs and the reader picking someone at 04. The two assertions
     below pin the order itself, because a step list is exactly the kind of thing a later
     edit reshuffles without anyone noticing it now describes a different clinic. */
  is('10 six steps', p1.steps, 6);
  is('10b the doctor is chosen before the file is read', p1.stepOrder.indexOf('Choose your doctor'), 2);
  is('10c and the peptides arrive before the aftercare',
     p1.stepOrder.indexOf('Your peptides arrive') < p1.stepOrder.indexOf('Aftercare'), true);
  is('10a six included lines', p1.incl, 6);
  const copy = await page.evaluate(() => document.querySelector('.pxd-body').textContent);
  /* ⚠️ 11's NEEDLE FOLLOWED THE COPY, TWICE. "comes to your home" died with his 2026-08-24
     rewrite ("Our team arrives to collect…") and the check had been failing since; the
     figure split on 2026-08-27 (owner's correction: 1,850 Dubai / 2,150 other emirates,
     two exclusive toggles), so 11g pins the Dubai figure and 11i the other-emirates one. */
  has('11 the collection is a team at your home, not a kit', copy, 'Our team arrives');
  has('11g at his real figure, not my placeholder', copy, 'AED 1,850');
  has('11i and the other-emirates figure beside it', copy, 'AED 2,150');
  is('11h and nothing on the page is marked tbc', /price tbc/i.test(copy), false);
  has('11a the assessment is online', copy, 'complete online');
  has('11b the read is same or next day', copy, 'same or next day');
  /* ⚠️ 11c CHANGED WITH THE STEP ORDER (round 14). It asserted "Online. You choose your
     doctor when you book the time" on step 04 — copy his correction deleted, because it
     had the reader picking a doctor AFTER a stranger had read their labs. The doctor is
     chosen at 03 now and step 04 is what the consultation actually delivers, so this
     asserts the deliverable rather than the channel. */
  has('11c the consultation delivers the prescription', copy, 'writes your prescription');
  has('11e and the peptides arrive as a step of their own', copy, 'Your peptides arrive');
  /* ⚠️ 11d IS INVERTED, NOT DELETED. It asserted the panel's closing line — "Everything
     happens online — you never need to visit us" — which he removed in round 14 ("it's not
     good in that page"). The line is now ASSERTED ABSENT: it was a hedge under a primary
     action, and it had also stopped being true the moment step 05 started delivering
     peptides to an address. Deleting the check would let it drift back in unnoticed. */
  is('11d the hedge under the button is gone', /never need to visit/i.test(copy), false);

  /* the add-on's explanation is a <small> inside a flex child — inline by default,
     which ran it straight after the PRICE TBC tag on one line */
  const stacked = await page.evaluate(() => {
    const t = document.querySelector('.pg-t');
    const head = t.childNodes[0];
    const r = document.createRange(); r.selectNode(head);
    const sm = t.querySelector('small').getBoundingClientRect();
    return sm.top >= r.getBoundingClientRect().bottom - 1;
  });
  is('11f the add-on explanation is on its own line', stacked, true);

  await page.click('#pg-addon');
  await page.waitForTimeout(300);
  const p2 = await page.evaluate(() => ({
    total: document.querySelector('#pg-total').textContent.trim()
  }));
  /* ⚠️ THE DUBAI FIGURE since 2026-08-27 (owner's correction: 1,850 Dubai / 2,150
     other emirates, two exclusive toggles). #pg-addon is the Dubai box. */
  is('12 the add-on moves the total', p2.total, 'AED 3,150.00');
  await page.click('#pg-addon');
  await page.waitForTimeout(300);
  is('12c and back again',
     await page.evaluate(() => document.querySelector('#pg-total').textContent.trim()), 'AED 1,207.50');

  /* ⚠️ A "SHOP WINDOW vs CART" BLOCK STOOD HERE (checks 12d–12h) AND WENT WITH THE BAND.
     It compared the programme band's restated price, add-on and included list against the
     panel's, because two copies of one figure drift silently. His call removed the band, so
     the panel is once again the ONLY place any price appears — which is why there is
     nothing left to compare and why the checks are deleted rather than adapted.
     ⚠️ IF A PRICE EVER APPEARS ON THE OPEN PAGE AGAIN, RESTORE THEM. `git log -S "12d the
     band and the panel"` finds the block intact. A page quoting a different number from the
     panel is a dispute after payment, and it is exactly the kind of fault that survives
     review because both numbers look right on their own screen. */

  /* ⚠️ NOT A CHECKOUT: close, the add-ons, Start. Every extra control in there
     is another chance to hesitate at the last moment before payment.
     ⚠️ FOUR SINCE 2026-08-27 — the collection split into two exclusive toggles
     (Dubai / other emirates), so the one add-on became two. Still no checkout. */
  const controls = await page.evaluate(() =>
    document.querySelectorAll('.pxd-panel button, .pxd-panel a').length);
  is('13 the panel carries four controls', controls, 4);

  /* ⚠️ HIS "the cards are not swipeable". A fixed overlay's inner scroller chains
     its drag to the locked body unless told not to; assert the panel is a real
     scroller AND that it carries the three properties that make a thumb work. */
  const scroller = await page.evaluate(() => {
    const p = document.querySelector('.pxd-panel'), cs = getComputedStyle(p);
    p.scrollTop = 400;
    return { overflows: p.scrollHeight > p.clientHeight + 8, moved: p.scrollTop > 0,
             chain: cs.overscrollBehaviorY, touch: cs.touchAction,
             lenis: p.hasAttribute('data-lenis-prevent') };
  });
  is('13a the panel is a real scroller', scroller.overflows, true);
  is('13b and it moves', scroller.moved, true);
  is('13c the drag stays inside it', scroller.chain, 'contain');
  is('13d the browser owns the axis', scroller.touch, 'pan-y');
  is('13e and Lenis is kept off it', scroller.lenis, true);
  if (SHOTS) await page.screenshot({ path: path.join(OUT, 'sv-panel.png') });

  await page.click('[data-pg-start]');
  await page.waitForTimeout(600);
  is('14 Start closes the overlay before it scrolls',
     await page.evaluate(() => document.querySelector('#pxd').classList.contains('on')), false);

  console.log('\n\x1b[1mE · the page still holds\x1b[0m');
  /* ⚠️ RELOAD AT EACH WIDTH, DO NOT JUST RESIZE. The chain scene pins through
     ScrollTrigger, which writes pixel dimensions at init and does not recompute
     them on a bare resize — so setViewportSize alone measured the PREVIOUS width's
     stale pin and reported 1440 at a 1280 viewport. It is also the honest test:
     a visitor arrives at their width, they do not drag the window to it. */
  /* ⚠️ 1181 AND 1180 ARE THE RING'S OWN CLIFF and are in this list for that reason: above
     it the eight fan out in 3D, below it they become a stacked list. A ring that overflows
     by four pixels at the widest width it is allowed to run is exactly the fault that
     reaches a phone-less reviewer last. */
  /* ⚠️ 360 AND 320 ARE IN THIS LIST BECAUSE 390 IS THE NARROWEST iPHONE, NOT THE NARROWEST
     PHONE. The sweep stopped at 390 and the footer had been pushing the whole document 14px
     wider than the viewport on every 360px Android since long before the ring — a `1fr`
     grid track sized by a 22rem child, which no assertion was looking at. */
  for (const w of [1600, 1440, 1280, 1181, 1180, 1104, 900, 700, 699, 640, 430, 390, 360, 320]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(base, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    sw === w ? ok(`15 no sideways scroll @ ${w}`) : bad(`15 no sideways scroll @ ${w}`, `document is ${sw}`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(200);

  /* ══ ⚠️⚠️ THIS CHECK HAS NEVER MEASURED A CHOSEN TILE UNTIL NOW (found round 17) ══════
     It read:
         const t = document.querySelector('.px[data-picked="true"]') || document.querySelector('.px');
     and the width sweep directly above it calls page.goto() at every viewport — so by the
     time it ran, THE PAGE HAD BEEN RELOADED EIGHT TIMES AND NOTHING WAS PICKED. The `||`
     fallback quietly handed it an ordinary ivory tile, and it reported ink-on-ivory 14.28:1
     under the label "chosen tile name" — a comfortable pass, printed in green, for a state
     the page was never in. It has been doing that since round 12.
     ⚠️ THE FALLBACK IS GONE ON PURPOSE. A contrast check that cannot find its subject must
     FAIL, not substitute a different subject: the whole value of the number is which two
     colours it came from. This is the same fault class as the hardcoded check 6 in
     peptide-page.mjs — an assertion that cannot fail is worse than no assertion, because it
     occupies the space where a real one would go.
     ⚠️ AND IT MUST WAIT FOR THE TRANSITION. `.px` animates `background` over .35s, so
     reading getComputedStyle immediately after the click returns the START of the
     interpolation — ivory — not the burgundy it is travelling to. Round 12 recorded this
     exact lesson ("DO NOT SAMPLE MID-TRANSITION") and it caught this file out anyway. */
  await page.addStyleTag({ content: '.pw{animation:none!important}' });
  await page.evaluate(() => document.querySelector('#services').scrollIntoView());
  await page.waitForTimeout(400);
  await page.click('.pw[data-focus="true"] .pw-face');
  await page.waitForTimeout(600);
  const isPicked = await page.evaluate(() => !!document.querySelector('.pw[data-picked="true"]'));
  isPicked ? ok('16pre a card is actually chosen before the chosen-state contrast is read')
           : bad('16pre nothing is chosen — the contrast below would measure the wrong card');
  /* ══ ⚠️⚠️ THE BACKGROUND IS A PHOTOGRAPH NOW, SO getComputedStyle CANNOT ANSWER THIS ═════
     On the grid the name sat on a flat --burgundy fill and one computed colour was the whole
     truth. On the ring it sits on eight different photographs under a gradient scrim, and
     `getComputedStyle(card).backgroundColor` returns TRANSPARENT — a check written that way
     would compare ivory against rgba(0,0,0,0), score a perfect ratio and mean nothing.
     ⚠️ SO THE PIXELS ARE ACTUALLY SAMPLED. The photograph is same-origin (the harness serves
     it), so it can be drawn to a canvas and read back: this takes the mean colour of the
     region the name occupies, composites the scrim's own stop over it exactly as the browser
     does, and measures against that. It is the same measurement the accent colour was chosen
     by, and it is the only one that stays true when a photograph is re-cropped.
     ⚠️ AND IT IS THE WORST OF THE EIGHT, not the first. One pale photograph is all it takes,
     and the first card is not reliably the worst. */
  const pairs = await page.evaluate(async () => {
    /* ⚠️⚠️ THE PSEUDO ARGUMENT IS THE WHOLE CHECK, AND LEAVING IT OFF SCORED 1.09 IN GREEN-
       LOOKING ARITHMETIC. `el => getComputedStyle(el)` silently DROPS a second argument, so
       `g(art, '::after')` returned the style of .pw-art ITSELF — whose background is the
       pale cream-and-gold plate the card falls back to when a photograph is missing. The
       check then measured ivory text against a near-white plate, reported a real failure,
       and was wrong about which surface it had even looked at. A helper that quietly ignores
       an argument is worse than one that throws. */
    const g = (el, pseudo) => getComputedStyle(el, pseudo || null);
    const rgba = s => (s.match(/[\d.]+/g) || []).map(Number);
    /* ⚠️ NO FALLBACK TO AN UNPICKED CARD — see the note above. If nothing is picked this
       throws, the harness exits non-zero, and that is the correct outcome. */
    const picked = document.querySelector('.pw[data-picked="true"]');
    if (!picked) throw new Error('nothing is chosen');

    /* the scrim's darkest stop, read off the rule rather than hardcoded */
    const scrim = g(document.querySelector('.pw[data-focus="true"] .pw-art'), '::after').backgroundImage;
    const stops = scrim.match(/rgba?\([^)]+\)/g);
    /* ⚠️ NO SILENT FALLBACK EITHER. If the scrim cannot be read, the number this check
       produces is meaningless — so it stops rather than inventing a plausible one. */
    if (!stops) throw new Error('could not read the scrim off .pw-art::after: ' + scrim);
    const [sr, sg, sb, sa = 1] = rgba(stops[0]);

    let worst = null;
    for (const card of document.querySelectorAll('.pw')) {
      const img = card.querySelector('.pw-art img');
      if (!img || !img.naturalWidth) continue;
      /* the name lives in the bottom third; sample that band of the photograph */
      const cv = document.createElement('canvas');
      cv.width = 24; cv.height = 8;
      const cx = cv.getContext('2d');
      cx.drawImage(img, 0, img.naturalHeight * 0.72, img.naturalWidth, img.naturalHeight * 0.28,
                       0, 0, 24, 8);
      const d = cx.getImageData(0, 0, 24, 8).data;
      let r = 0, gg = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i+1]; b += d[i+2]; }
      const n = d.length / 4;
      /* composite the scrim over the photograph, which is what the eye actually sees */
      const eff = [sr * sa + (r/n) * (1-sa), sg * sa + (gg/n) * (1-sa), sb * sa + (b/n) * (1-sa)];
      const L = c => { c /= 255; return c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055) ** 2.4; };
      const lum = 0.2126*L(eff[0]) + 0.7152*L(eff[1]) + 0.0722*L(eff[2]);
      if (!worst || lum > worst.lum) worst = { lum, eff, name: card.querySelector('.pw-body h3').textContent.trim() };
    }
    const tray = document.querySelector('#px-tray');
    return {
      'card name over the palest photograph':
        [g(picked.querySelector('.pw-body h3')).color, `rgb(${worst.eff.map(Math.round).join(',')})`, worst.name],
      'tray answer':
        [g(document.querySelector('#px-tray-l')).color, g(tray).backgroundColor, ''] };
  });
  for (const [k,[fg,bg,which]] of Object.entries(pairs)) {
    const r = contrast(fg, bg);
    const note = r.toFixed(2) + (which ? ` (${which})` : '');
    r >= 4.5 ? ok(`16 ${k} clears 4.5:1`, note) : bad(`16 ${k} clears 4.5:1`, note);
  }
  /* ⚠️ THE CHOSEN RING IS THE THIRD HOME OF THE STATE AND IT IS A SHADOW, NOT A FILL — a
     card that is both chosen AND in front took two rules at equal specificity once and lost
     its ring to the focus one. Assert it survives the combination, not just on its own. */
  const ringOn = await page.evaluate(() => {
    const c = document.querySelector('.pw[data-picked="true"][data-focus="true"]')
           || document.querySelector('.pw[data-picked="true"]');
    return getComputedStyle(c).boxShadow;
  });
  ringOn && ringOn !== 'none' ? ok('16a a chosen card keeps its ring when it is also in front')
                              : bad('16a the chosen ring is gone', String(ringOn));
  if (SHOTS) {
    await page.screenshot({ path: path.join(OUT, 'sv-ring.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('#services').scrollIntoView());
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, 'sv-phone.png') });
  }
  is('17 zero console errors across the whole walk', errors.length, 0);
  if (errors.length) errors.slice(0, 5).forEach(e => console.log('       ' + e));

  await browser.close();
  server.close();
  console.log(`\n\x1b[1m${pass} passed, ${fail} failed\x1b[0m${SHOTS ? `  ·  shots in ${OUT}` : ''}\n`);
  process.exit(fail ? 1 : 0);
};

run().catch(e => { console.error(e); process.exit(1); });
