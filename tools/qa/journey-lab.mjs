/* Journey-lab QA — walk the interaction, not just the layout.

     npm install --no-save playwright@1.49.1
     node tools/qa/journey-lab.mjs

   Three things this harness exists to catch, none of which a layout check would see:

   1 · THE NO-JS PATH IS THE REAL DELIVERABLE. The section is progressive enhancement —
       every step and both symptom lists are in the markup, and the wizard is laid over
       them. So the suite loads the page a second time with JavaScript DISABLED and
       asserts the reader still gets the whole chapter. A wizard that hides its content
       from a reader without JS has not degraded, it has failed.

   2 · A CSS ANIMATION DOES NOT RESTART on an element that already carries the class.
       Every step after the first arrived unanimated until the class was removed and
       re-added on the next frame. Asserted by walking all seven and checking each one
       actually claims .anim.

   3 · TRACKED CAPITALS OVERRUN FIXED COLUMNS — the bug that bit structure-lab twice
       (COMPRESS, INTERPRET). Any label whose scrollWidth exceeds its box fails here.

   Paths are derived and Chromium is searched for, never pinned. */
import { chromium } from 'playwright';
import path from 'path'; import fs from 'fs';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const FILE = 'file://' + path.join(ROOT, 'peptide-therapy/journey-lab.html');
const OUT  = process.env.OUT || path.join(ROOT, '.qa-out');
fs.mkdirSync(OUT, { recursive: true });

let exe = null;
for (const d of fs.readdirSync('/opt/pw-browsers')) {
  const p = path.join('/opt/pw-browsers', d, 'chrome-linux', 'chrome');
  if (fs.existsSync(p)) { exe = p; break; }
}
const b = await chromium.launch({ executablePath: exe || undefined });
let fails = 0;
const ok = (c, m) => { console.log((c ? '  ok  ' : '  FAIL') + '  ' + m); if (!c) fails++; };

const STEPS = ['step1','step2','step3','step4','step5','step6','step7'];

for (const [w, h, label] of [[1440,900,'desktop'], [1024,800,'tablet'], [390,844,'phone']]) {
  const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errs = [];
  pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(FILE, { waitUntil: 'load' });
  await pg.waitForTimeout(500);
  console.log(`\n── ${label} ${w}×${h} ──`);

  ok(errs.length === 0, `zero console/page errors${errs.length ? ': ' + errs.slice(0,3).join(' | ') : ''}`);
  ok(await pg.evaluate(() => document.documentElement.scrollWidth) <= w, 'no horizontal overflow');

  const enc = await pg.evaluate(() => ({ cs: document.characterSet, moji: document.body.innerText.includes('â') }));
  ok(enc.cs === 'UTF-8' && !enc.moji, `decoded as UTF-8, no mojibake (${enc.cs})`);

  const f = await pg.evaluate(async () => { await document.fonts.ready; return {
    pf: document.fonts.check('450 40px Playfair'),
    meg: document.fonts.check('400 20px "MediGyn Megante"'),
    now: document.fonts.check('300 16px "MediGyn NOW"') }; });
  ok(f.pf && f.meg && f.now, `all three brand faces loaded`);

  // ── the gate ──────────────────────────────────────────────────────────────
  const gate = await pg.evaluate(() => ({
    onGate: document.querySelector('[data-view="gate"]').classList.contains('on'),
    picks: document.querySelectorAll('.pick').length,
    ctrlHidden: getComputedStyle(document.getElementById('ctrl')).display === 'none',
    railHidden: document.getElementById('rail-wrap').hidden,
    eight: document.querySelectorAll('#eight button').length,
    beads: document.querySelectorAll('.bead').length,
    bonds: document.querySelectorAll('.bond').length,
  }));
  ok(gate.onGate && gate.picks === 2, 'opens on the gate with two paths');
  ok(gate.ctrlHidden && gate.railHidden, 'no arrows and no rail before a path is chosen');
  ok(gate.eight === 8, `the eight are built (${gate.eight})`);
  ok(gate.beads === 7 && gate.bonds === 6, `rail is 7 residues on 6 bonds (${gate.beads}/${gate.bonds})`);

  // only one view is ever on
  const onCount = async () => pg.evaluate(() => document.querySelectorAll('[data-view].on').length);
  ok(await onCount() === 1, 'exactly one view is visible');

  // ── pick a path ───────────────────────────────────────────────────────────
  await pg.click('.pick[data-sex="women"]'); await pg.waitForTimeout(220);
  const aud = await pg.evaluate(() => ({
    on: document.querySelector('[data-view="women"]').classList.contains('on'),
    menOff: !document.querySelector('[data-view="men"]').classList.contains('on'),
    cont: !!document.querySelector('#ctrl-r .btn'),
    pmos: document.querySelectorAll('[data-view="women"] .pending').length,
    noPcos: !document.querySelector('[data-view="women"]').innerText.includes('PCOS'),
  }));
  ok(aud.on && aud.menOff, 'choosing “For women” shows her list and only hers');
  ok(aud.cont, 'a Continue button appears on the symptom panel');
  ok(aud.pmos === 2 && aud.noPcos, `PCOS→PMOS applied and flagged pending (${aud.pmos} marked, no PCOS left)`);
  ok(await onCount() === 1, 'still exactly one view visible');

  // ── into the journey, and all the way through ─────────────────────────────
  await pg.click('#ctrl-r .btn'); await pg.waitForTimeout(220);
  ok(await pg.evaluate(() => document.querySelector('[data-view="step1"]').classList.contains('on')), 'Continue lands on step 1');
  ok(await pg.evaluate(() => !document.getElementById('rail-wrap').hidden), 'the rail appears inside the journey');
  ok(await pg.evaluate(() => document.getElementById('prev').disabled) === false, 'back is live on step 1');

  let animated = 0;
  for (let i = 1; i < 7; i++) {
    await pg.click('#next'); await pg.waitForTimeout(190);
    const s = await pg.evaluate((n) => ({
      on: document.querySelector(`[data-view="${n}"]`).classList.contains('on'),
      anim: document.querySelector(`[data-view="${n}"]`).classList.contains('anim'),
      now: document.querySelectorAll('.bead.now').length,
      done: document.querySelectorAll('.bond.done').length,
      note: document.getElementById('ctrl-note').innerText.trim(),
    }), STEPS[i]);
    if (s.anim) animated++;
    if (!s.on) ok(false, `→ reaches ${STEPS[i]}`);
    if (s.now !== 1) ok(false, `exactly one bead lit on ${STEPS[i]} (${s.now})`);
    if (s.done !== i) ok(false, `${i} bonds filled on ${STEPS[i]} (${s.done})`);
    if (!s.note.startsWith(String(i + 1))) ok(false, `counter reads ${i+1} of 7 on ${STEPS[i]} (“${s.note}”)`);
  }
  ok(true, '→ walks steps 1 through 7, one bead lit and the backbone filling behind it');
  ok(animated === 6, `every step claims its entrance animation (${animated}/6) — a class that is already present does not restart one`);
  ok(await pg.evaluate(() => document.getElementById('next').disabled), 'forward is dead on step 7');

  // ── the eight are carried through ─────────────────────────────────────────
  await pg.evaluate(() => { for (let i = 0; i < 6; i++) document.getElementById('prev').click(); });
  await pg.waitForTimeout(220);
  ok(await pg.evaluate(() => document.querySelector('[data-view="step1"]').classList.contains('on')), '← walks back to step 1');
  await pg.click('#eight button:nth-child(3)');   // Gut Health
  await pg.waitForTimeout(120);
  await pg.evaluate(() => { for (let i = 0; i < 6; i++) document.getElementById('next').click(); });
  await pg.waitForTimeout(220);
  const cta = await pg.evaluate(() => document.querySelector('#ctrl-r a.btn')?.innerText.trim() || '');
  ok(/gut\s+health/i.test(cta), `the choice reaches the closing CTA (“${cta.replace(/\s+/g," ")}”)`);
  const chosen = await pg.evaluate(() => document.querySelector('#ctrl-r .chosen')?.innerText || '');
  ok(/women/i.test(chosen), `the chosen path is shown back with a way to change it (“${chosen.replace(/\s+/g,' ').trim()}”)`);

  // ── keyboard ──────────────────────────────────────────────────────────────
  await pg.keyboard.press('ArrowLeft'); await pg.waitForTimeout(190);
  ok(await pg.evaluate(() => document.querySelector('[data-view="step6"]').classList.contains('on')), '← key steps back');
  await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(190);
  ok(await pg.evaluate(() => document.querySelector('[data-view="step7"]').classList.contains('on')), '→ key steps forward');

  // ── no label may overrun its own box ──────────────────────────────────────
  const spill = await pg.evaluate(() => [...document.querySelectorAll('.step-of,.sublab,.aud-sub,.coda h3,.bead,.ctrl-note,.eight button,.btn')]
    .filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.className + ':' + e.textContent.trim().slice(0, 22)));
  ok(spill.length === 0, `no label overruns its box${spill.length ? ': ' + spill.slice(0,4).join(' | ') : ''}`);

  if (label === 'desktop') {
    await pg.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    for (const [v, name] of [['gate','gate'],['women','women'],['step1','step1'],['step3','step3'],['step7','step7']]) {
      await pg.goto(FILE + '?view=' + v, { waitUntil: 'load' }); await pg.waitForTimeout(450);
      await pg.evaluate(() => document.querySelector('.stage').scrollIntoView({ block: 'center' }));
      await pg.waitForTimeout(200);
      await pg.screenshot({ path: path.join(OUT, `journey-${name}.png`) });
    }
  }
  await pg.close();
}

// ── ?view= deep link ────────────────────────────────────────────────────────
console.log('\n── ?view= solo ──');
{
  const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await pg.goto(FILE + '?view=step5', { waitUntil: 'load' }); await pg.waitForTimeout(400);
  ok(await pg.evaluate(() => document.querySelector('[data-view="step5"]').classList.contains('on')), '?view=step5 opens straight onto step 5');
  await pg.goto(FILE + '?view=nonsense', { waitUntil: 'load' }); await pg.waitForTimeout(400);
  ok(await pg.evaluate(() => document.querySelector('[data-view="gate"]').classList.contains('on')), 'an unknown ?view falls back to the gate rather than a blank stage');
  await pg.close();
}

// ── THE NO-JS PATH ──────────────────────────────────────────────────────────
console.log('\n── javascript disabled ──');
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const pg = await ctx.newPage();
  await pg.goto(FILE, { waitUntil: 'load' }); await pg.waitForTimeout(300);
  const seen = await pg.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    return {
      views: [...document.querySelectorAll('[data-view]')].filter(vis).length,
      total: document.querySelectorAll('[data-view]').length,
      text: document.body.innerText,
    };
  });
  ok(seen.views === seen.total, `every view is readable without JS (${seen.views}/${seen.total})`);
  const must = ['Ready to begin', 'For women', 'For men', 'Book your programme', 'Symptom',
                'BOZAT', 'IGF-1', 'Diagnostic results review', 'personalised', 'Protocol explanation',
                'mentorship', 'Priced separately'];
  const missing = must.filter(m => !seen.text.includes(m));
  ok(missing.length === 0, `the whole chapter is in the no-JS document${missing.length ? ' — missing: ' + missing.join(', ') : ''}`);
  ok(await pg.evaluate(() => document.documentElement.scrollWidth) <= 1440, 'no horizontal overflow without JS');
  await ctx.close();
}

// ── reduced motion ──────────────────────────────────────────────────────────
console.log('\n── reduced motion ──');
{
  const pg = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await pg.goto(FILE, { waitUntil: 'load' }); await pg.waitForTimeout(300);
  await pg.click('.pick[data-sex="men"]'); await pg.waitForTimeout(200);
  const r = await pg.evaluate(() => {
    const el = document.querySelector('[data-view="men"]');
    return { on: el.classList.contains('on'), op: getComputedStyle(el).opacity,
             dur: getComputedStyle(el).animationDuration };
  });
  ok(r.on && r.op === '1', `the panel still arrives, fully opaque (opacity ${r.op})`);
  ok(parseFloat(r.dur) < 0.01, `entrance animation is suppressed (${r.dur})`);
  await pg.close();
}

await b.close();
console.log('\n' + (fails ? `${fails} FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
