/* ═══════════════════════════════════════════════════════════════════════════════════
   PROGRAMME-LAB QA — peptide-therapy/programme-lab.html

     npm install --no-save playwright@1.49.1
     node tools/qa/programme-lab.mjs             # 1440 and 390
     node tools/qa/programme-lab.mjs --shots     # also write a PNG of every bay

   The lab makes four claims that are only worth anything if they are checked, so this
   harness checks exactly those and not the styling:

   1 · THE COPY IS ONE COPY. Every treatment renders from the same DATA block, which is
       the only thing that makes an audition of fifteen layouts fair. Check 3 asserts
       that every one of the client's step strings survives into every A treatment —
       because the moment a layout gets to quietly shorten a sentence to fit, the lab is
       measuring the sentence and not the layout.

   2 · THE HEIGHTS ARE MEASURED. They are printed in the chips as fact. Check 4 asserts
       they are non-zero, that the baselines read "the baseline", and that the ratios are
       arithmetically consistent with the raw pixel numbers beside them.

   3 · NO NEW COLOUR. BRAND.md's one-red rule and the round 8/11 glacier grade. Check 6
       extracts every hex and rgb() literal from the lab's stylesheet and asserts each is
       either a peptide-page token or a documented exception.

   4 · THE FALLBACKS ARE REAL. A6 claims it falls back to A5's accordion below 700px
       rather than squeezing; check 7 proves the two-column grid is actually gone at 390
       and the accordion is actually there.

   ⚠️ CHECK 1 IS THE ONE THAT MATTERS MOST AND IT IS COPIED FROM peptide-page.mjs.
   Writing L-star-slash-C-star inside a CSS comment CLOSES THE COMMENT ON THE SPOT; the
   prose after it parses as declarations, the parser swallows the following rule, and
   nothing reports it. That bug cost a day on the scene and it is silent every time.
   ⚠️ Chromium is searched for rather than pinned — the first harness in this repo
   hardcoded a home directory and crashed before measuring anything on any other machine.
   ═══════════════════════════════════════════════════════════════════════════════════ */
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE  = path.dirname(fileURLToPath(import.meta.url));
const ROOT  = path.resolve(HERE, '../..');
const PAGE  = '/peptide-therapy/programme-lab.html';
const SHOTS = process.argv.includes('--shots');
const OUT   = path.join(ROOT, '.qa-out');
if (SHOTS) mkdirSync(OUT, { recursive: true });

let failures = 0, checks = 0;
const ok   = (m) => { checks++; console.log('  \x1b[32m✓\x1b[0m ' + m); };
const bad  = (m) => { checks++; failures++; console.log('  \x1b[31m✗\x1b[0m ' + m); };
const note = (m) => console.log('    · ' + m);
const head = (m) => console.log('\n\x1b[1m' + m + '\x1b[0m');

const BAYS   = ['a1','a2','a3','a4','a5','a6','a7','a8','b1','b2','b3','b4','c1','c2','c3'];
/* the treatments whose full step bodies are all in the DOM at once, so one innerText
   read is a fair test of them. A6 is NOT one of them — it is a swapping panel and holds
   exactly one step at a time by design, so it gets its own walk below; A3 and A4 show a
   précis on purpose and are excluded for the same honest reason. Excluding a treatment
   from a check is only legitimate when the check is wrong FOR that treatment, which is
   why each exclusion is named here rather than left as a shorter array. */
const A_BAYS = ['a1','a2','a5','a7','a8'];

/* ─── a static server, so fonts and AVIF behave as they do in production ─── */
const MIME = {
  '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript',
  '.mjs':'text/javascript', '.woff2':'font/woff2', '.webp':'image/webp',
  '.avif':'image/avif', '.png':'image/png', '.jpg':'image/jpeg',
  '.svg':'image/svg+xml', '.ico':'image/x-icon',
};
/* peptide-page.mjs's resolver, verbatim in behaviour: SEARCH for Chromium, never pin a
   revision. Playwright's own default path carries the revision the npm package expects
   (1148 for 1.49.1) and the machine may have any other (this one has 1194) — pinning is
   how the first harness in this repo crashed before measuring anything. */
function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(base)) {
    for (const d of readdirSync(base)) {
      const p = path.join(base, d, 'chrome-linux', 'chrome');
      if (/^chromium-/.test(d) && existsSync(p)) return p;
    }
  }
  return undefined; /* let playwright resolve its own */
}

function serve(port) {
  const srv = http.createServer((rq, rs) => {
    let p = decodeURIComponent(rq.url.split('?')[0]);
    let f = path.join(ROOT, p);
    try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); }
    catch { rs.writeHead(404); return rs.end('not found'); }
    try {
      const b = fs.readFileSync(f);
      rs.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
      rs.end(b);
    } catch { rs.writeHead(404); rs.end('not found'); }
  });
  return new Promise(r => srv.listen(port, () => r(srv)));
}

/* ═══ 1 · THE STYLESHEET PARSES AS WRITTEN ═════════════════════════════════════════
   peptide-page.mjs's check, and it earns its place in every file in this repo.       */
function checkComments(html) {
  head('1 · Stylesheet comment integrity');
  let found = 0, blocks = 0;
  const re = /<style[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const start = m.index + m[0].length;
    const end = html.indexOf('</style>', start);
    if (end < 0) continue;
    blocks++;
    const css = html.slice(start, end);
    const line0 = html.slice(0, start).split('\n').length;
    let i = 0;
    while (i < css.length) {
      if (css.startsWith('/*', i)) {
        const close = css.indexOf('*/', i + 2);
        if (close < 0) {
          bad('unterminated comment at line ' + (line0 + css.slice(0, i).split('\n').length - 1));
          found++; break;
        }
        /* A comment that closes early — on a star-slash written INSIDE prose — is the
           silent bug: the comment's text ends mid-sentence and the tokens after it are
           not a selector. Cheap proxy: what follows the close reads as words rather
           than as a selector or an at-rule.
           ⚠️ THIS COMMENT MAY NOT CONTAIN THE SEQUENCE IT IS DESCRIBING. Writing it out
           here ends this comment too, and the harness then fails to parse as JS — which
           is how it was discovered, on the first run, in this exact block. */
        const after = css.slice(close + 2, close + 2 + 60);
        if (/^[^\n{}]*[a-z]{3,}\s+[a-z]{3,}/i.test(after) && !/^\s*[.#@a-z:\[]/i.test(after)) {
          bad('comment at line ' + (line0 + css.slice(0, i).split('\n').length - 1) +
              ' closes into prose: ' + JSON.stringify(after.slice(0, 40)));
          found++;
        }
        i = close + 2;
      } else i++;
    }
  }
  if (!found) ok(blocks + ' style block(s), every comment closes where it was meant to');
}

/* ═══ 6 · NO NEW COLOUR ════════════════════════════════════════════════════════════
   The glacier tokens from peptide-therapy/index.html, plus the neutrals a lab is
   allowed. Anything else is a finding — bring it to grade-lab.html, do not invent it
   here. Each exception below carries its reason inline; an exception without one is a
   colour someone got away with.                                                     */
const TOKENS = [
  'f4f7fa','eaf0f5','d5dee6','5c1f31','c79a92','8e2d3a','a33648',
  '7c93a8','54687c','e4edf4','2e2228','6a585f','e8eff5',
];
const ALLOWED_RGB = [
  /* every rgba() in the lab, with the reason it is not a token */
  '244,247,250',  /* --ivory, as rgba for the sticky bar's blur and the C2 caption   */
  '29,39,47',     /* --stage, the scene's own ground — the C2 scrim's only colour    */
  '46,54,71',     /* the shipped .aud hover shadow, copied verbatim from index.html  */
  '124,147,168',  /* --gold, as rgba for A3's split bar tint                          */
  '142,45,58',    /* --logo-red, as rgba for the .tag.warn ground and border          */
  '255,255,255',  /* plain white at low alpha — a wash over the ground, not a colour  */
];
function checkColours(html) {
  head('6 · No new colour');
  const css = html.slice(html.indexOf('<style>'), html.indexOf('</style>'));
  const hexes = [...css.matchAll(/#([0-9a-f]{3,8})\b/gi)].map(m => m[1].toLowerCase());
  const strays = [...new Set(hexes)].filter(h => !TOKENS.includes(h));
  if (strays.length) { bad('hex literals that are not peptide tokens: ' + strays.join(', ')); }
  else ok(new Set(hexes).size + ' distinct hex literals, every one a peptide-page token');

  const rgbs = [...css.matchAll(/rgba?\(\s*([\d]+\s*,\s*[\d]+\s*,\s*[\d]+)/g)]
    .map(m => m[1].replace(/\s/g, ''));
  const badRgb = [...new Set(rgbs)].filter(r => !ALLOWED_RGB.includes(r));
  if (badRgb.length) bad('rgb() triples with no recorded reason: ' + badRgb.join(' · '));
  else ok(new Set(rgbs).size + ' distinct rgb() triples, each one a token or a documented exception');
}

/* ═══ the browser run ══════════════════════════════════════════════════════════════ */
async function run() {
  const html = readFileSync(path.join(ROOT, PAGE.slice(1)), 'utf8');
  checkComments(html);
  checkColours(html);

  const srv = await serve(8791);
  const br  = await chromium.launch({ executablePath: findChromium() });

  /* ─── 2 · desktop: it renders, and nothing throws ─── */
  const pg = await br.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [], bad4 = [];
  pg.on('console',  m => { if (m.type() === 'error') errs.push(m.text()); });
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('response',  r => { if (r.status() >= 400) bad4.push(r.status() + ' ' + r.url()); });
  await pg.goto('http://localhost:8791' + PAGE, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(900);

  head('2 · It renders at 1440, and nothing throws');
  if (errs.length) { bad(errs.length + ' console error(s)'); errs.slice(0, 5).forEach(note); }
  else ok('console clean');
  if (bad4.length) { bad(bad4.length + ' request(s) 400+'); bad4.slice(0, 6).forEach(note); }
  else ok('every request 200 — including the two door plates C2 borrows');

  const filled = await pg.evaluate(bays => bays.map(b => {
    const n = document.querySelector('[data-render="' + b + '"]');
    return { b, kids: n ? n.children.length : -1, chars: n ? n.innerText.length : -1 };
  }), BAYS);
  const empty = filled.filter(f => f.kids < 1 || f.chars < 80);
  if (empty.length) { bad('bays that did not render: ' + empty.map(e => e.b).join(', ')); }
  else ok('all ' + BAYS.length + ' treatments rendered · thinnest is ' +
          filled.reduce((a, b) => a.chars < b.chars ? a : b).b);

  /* ─── 3 · the copy is ONE copy ─── */
  head('3 · Every treatment shows the client’s copy, unshortened');
  const copyReport = await pg.evaluate(abays => {
    /* pull the client's strings straight out of the page's own DATA, so this test
       cannot drift from the source it is testing */
    const probes = [];
    document.querySelectorAll('[data-render="a1"] .a1-step').forEach(s => {
      probes.push(s.querySelector('.t-h3').textContent.trim());
    });
    /* plus the four strings most likely to be quietly trimmed by a cramped layout */
    probes.push('Lipid panel (Cholesterol, LDL, HDL, Triglycerides)');
    probes.push('bioidentical hormones carry the same hormonal molecule as your own body');
    probes.push('A further four weeks of follow-up throughout your programme with us.');
    probes.push('IGF-1 (Insulin-Like Growth Factor 1)');
    const out = {};
    abays.forEach(b => {
      const root = document.querySelector('[data-render="' + b + '"]');
      const txt = root.innerText.replace(/\s+/g, ' ');
      out[b] = probes.filter(p => !txt.includes(p.replace(/\s+/g, ' ')));
    });
    return { probes: probes.length, out };
  }, A_BAYS);
  let copyBad = 0;
  for (const [b, missing] of Object.entries(copyReport.out)) {
    if (missing.length) {
      copyBad++;
      bad(b + ' is missing ' + missing.length + ' of ' + copyReport.probes + ' client strings');
      missing.slice(0, 3).forEach(m => note(JSON.stringify(m.slice(0, 62))));
    }
  }
  if (!copyBad) ok(copyReport.probes + ' client strings present in all ' + A_BAYS.length +
                   ' full-body treatments (A3 and A4 show a précis by design)');

  /* A6 holds one step at a time, so the fair test is to walk all seven tabs and union
     what it showed — a treatment may hide copy behind a control, but it may not LOSE it */
  const a6copy = await pg.evaluate(async () => {
    const nav = document.querySelector('[data-render="a6"] .a6-nav');
    const panel = document.querySelector('[data-render="a6"] .a6-panel');
    let seen = '';
    for (const b of [...nav.children]) { b.click(); await new Promise(r => setTimeout(r, 20)); seen += ' ' + panel.innerText; }
    seen = seen.replace(/\s+/g, ' ');
    return ['Lipid panel (Cholesterol, LDL, HDL, Triglycerides)',
            'bioidentical hormones carry the same hormonal molecule as your own body',
            'A further four weeks of follow-up throughout your programme with us.',
            'IGF-1 (Insulin-Like Growth Factor 1)',
            'Complete your Peptide Therapy Health Assessment.'].filter(p => !seen.includes(p));
  });
  if (a6copy.length) { bad('A6 loses ' + a6copy.length + ' string(s) across all seven tabs'); a6copy.forEach(note); }
  else ok('A6 · walking all seven tabs surfaces every probe string — nothing is lost, only deferred');

  /* ─── 4 · the heights are measured, and the arithmetic in the chips holds ─── */
  head('4 · The chips report real measurements');
  const chips = await pg.evaluate(() => {
    const o = {};
    document.querySelectorAll('[data-metric]').forEach(d => {
      const bay = document.getElementById(d.dataset.metric);
      o[d.dataset.metric] = {
        text: d.innerText.replace(/\s+/g, ' ').trim(),
        real: Math.round(bay.querySelector('.demo').getBoundingClientRect().height),
      };
    });
    return o;
  });
  const unmeasured = Object.entries(chips).filter(([, v]) => !/\d/.test(v.text) || v.real < 40);
  if (unmeasured.length) bad('chips still showing a placeholder: ' + unmeasured.map(u => u[0]).join(', '));
  else ok('all 15 chips carry a live pixel height');

  let arithBad = 0;
  const BASE = { a: 'a1', b: 'b1', c: 'c1' };
  for (const [id, v] of Object.entries(chips)) {
    const printed = parseInt(v.text.replace(/,/g, ''), 10);
    if (Math.abs(printed - v.real) > 2) {
      bad(id + ' prints ' + printed + 'px but measures ' + v.real + 'px'); arithBad++;
      continue;
    }
    const base = chips[BASE[id[0]]].real;
    const mult = v.text.match(/×([\d.]+)/), less = v.text.match(/−(\d+)%/);
    if (mult && Math.abs(parseFloat(mult[1]) - v.real / base) > 0.02) {
      bad(id + ' prints ×' + mult[1] + ' but is ×' + (v.real / base).toFixed(2)); arithBad++;
    }
    if (less && Math.abs(parseInt(less[1], 10) - Math.round((1 - v.real / base) * 100)) > 1) {
      bad(id + ' prints −' + less[1] + '% but is −' + Math.round((1 - v.real / base) * 100) + '%'); arithBad++;
    }
  }
  if (!arithBad) ok('every printed ratio agrees with its own pixel measurement');

  console.log('\n    \x1b[2mheights at 1440 (the number the decision turns on):\x1b[0m');
  for (const g of ['a', 'b', 'c']) {
    Object.entries(chips).filter(([k]) => k[0] === g)
      .sort((x, y) => x[1].real - y[1].real)
      .forEach(([k, v]) => console.log('      ' + k + '  ' + String(v.real).padStart(5) + 'px   ' + v.text));
    console.log('');
  }

  /* ─── 5 · the controls work ─── */
  head('5 · Every interactive treatment actually operates');
  /* A5 · the accordion opens one at a time */
  const a5 = await pg.evaluate(() => {
    const items = [...document.querySelectorAll('[data-render="a5"] .a5-item')];
    const before = items.filter(i => i.dataset.open === '1').length;
    items[3].querySelector('.a5-btn').click();
    const after = items.filter(i => i.dataset.open === '1').length;
    return { before, after, which: items.findIndex(i => i.dataset.open === '1'),
             aria: items[3].querySelector('.a5-btn').getAttribute('aria-expanded') };
  });
  if (a5.before === 1 && a5.after === 1 && a5.which === 3 && a5.aria === 'true')
    ok('A5 · one panel open before and after, and aria-expanded followed it');
  else bad('A5 · accordion state wrong: ' + JSON.stringify(a5));

  /* A6 · the tablist has roving focus and swaps the panel */
  const a6 = await pg.evaluate(() => {
    const nav = document.querySelector('[data-render="a6"] .a6-nav');
    const panel = document.querySelector('[data-render="a6"] .a6-panel');
    const first = panel.innerText.slice(0, 40);
    nav.children[4].click();
    const roving = [...nav.children].map(b => b.tabIndex);
    return { changed: panel.innerText.slice(0, 40) !== first,
             heading: panel.querySelector('.t-h3').textContent,
             zeroes: roving.filter(t => t === 0).length,
             role: nav.getAttribute('role') };
  });
  if (a6.changed && a6.zeroes === 1 && a6.role === 'tablist')
    ok('A6 · panel swapped to "' + a6.heading.slice(0, 38) + '…" · exactly one tabbable tab');
  else bad('A6 · tablist wrong: ' + JSON.stringify(a6));

  /* A4 · the rail scrolls and the arrows gate at the ends */
  const a4 = await pg.evaluate(async () => {
    const t = document.querySelector('[data-render="a4"] .a4-track');
    const btns = document.querySelectorAll('[data-render="a4"] .a4-arrows button');
    const startDisabled = btns[0].disabled;
    t.scrollLeft = t.scrollWidth;
    await new Promise(r => setTimeout(r, 120));
    return { startDisabled, endDisabled: btns[1].disabled,
             overflow: t.scrollWidth > t.clientWidth + 10 };
  });
  if (a4.startDisabled && a4.endDisabled && a4.overflow)
    ok('A4 · track overflows, prev gated at the start and next gated at the end');
  else bad('A4 · rail wrong: ' + JSON.stringify(a4));

  /* B4 and C3 · the two tab sets */
  for (const [bay, sel, label] of [['b4', '.b4-tabs', 'B4'], ['c3', '.c3-sw', 'C3']]) {
    const r = await pg.evaluate(([bay, sel]) => {
      const tabs = document.querySelector('[data-render="' + bay + '"] ' + sel);
      const panel = document.querySelector('[data-render="' + bay + '"] [role="tabpanel"]');
      const first = panel.innerText.slice(0, 60);
      tabs.children[1].click();
      return { changed: panel.innerText.slice(0, 60) !== first,
               selected: [...tabs.children].filter(b => b.getAttribute('aria-selected') === 'true').length,
               role: tabs.getAttribute('role'),
               tabbable: [...tabs.children].filter(b => b.tabIndex === 0).length };
    }, [bay, sel]);
    if (r.changed && r.selected === 1 && r.role === 'tablist' && r.tabbable === 1)
      ok(label + ' · panel swapped, one tab selected, one tab tabbable');
    else bad(label + ' · tab set wrong: ' + JSON.stringify(r));
  }

  /* A2 · the spine's fill tracks scroll, and does it with a transform.
     ⚠️ SCROLL TO AN ABSOLUTE POSITION, NOT scrollIntoView + scrollBy. The lab sets
     `html{scroll-behavior:smooth}` for its own index links, so both of those animate;
     the first version of this check read the fill 260ms into a ~6000px smooth scroll,
     got scaleY(0) at both stops because the wrap was still below the reading line, and
     reported a working treatment as broken. Landing the scroll is part of the test. */
  const a2 = await pg.evaluate(async () => {
    const doc = document.documentElement;
    const prev = doc.style.scrollBehavior;
    doc.style.scrollBehavior = 'auto';
    const wrap = document.querySelector('[data-render="a2"] .a2-wrap');
    const fill = document.querySelector('[data-render="a2"] .a2-fill');
    const scaleY = () => {
      const m = getComputedStyle(fill).transform.match(/matrix\(([^)]+)\)/);
      return m ? parseFloat(m[1].split(',')[3]) : null;
    };
    /* ⚠️ WAIT FOR THE TRANSITION, NOT FOR A FRAME. .a2-fill carries
       `transition:transform .18s linear` on purpose — it is what stops the rail
       stepping between scroll samples. Two rAFs is ~32ms, so reading there catches the
       fill a sixth of the way through its interpolation and reports 0.31 for a rail
       that is actually at 0.98. Ask for 250ms. */
    const settle = () => new Promise(r => setTimeout(r, 250));
    const absTop = wrap.getBoundingClientRect().top + window.scrollY;
    /* stop 1 · the wrap's head just under the reading line (mark = 52vh) */
    window.scrollTo(0, absTop - innerHeight * 0.20); await settle();
    const early = scaleY();
    /* stop 2 · three quarters of the wrap above the line */
    window.scrollTo(0, absTop + wrap.offsetHeight * 0.75); await settle();
    const late = scaleY();
    doc.style.scrollBehavior = prev;
    return { early, late, usesTransform: !fill.style.height && !!fill.style.transform };
  });
  if (a2.late > a2.early && a2.late > 0.5 && a2.usesTransform)
    ok('A2 · fill tracks scroll (' + a2.early.toFixed(2) + ' → ' + a2.late.toFixed(2) +
       ') and does it by transform — no per-frame layout of seven step bodies');
  else bad('A2 · spine fill wrong: ' + JSON.stringify(a2));

  /* A8 · every assay row is ruled off from the one above it.
     A regression test for a bug this harness did NOT catch and a screenshot did: the
     Hormones panel is three cells in one column, and a last-row exemption written for a
     two-column grid dropped the divider between SHBG and Free Testosterone. Nothing
     threw, no measurement moved, and the panel just quietly read as two rows. */
  const a8rules = await pg.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-render="a8"] .a8-assay').forEach(panel => {
      const cols = getComputedStyle(panel.querySelector('ul')).gridTemplateColumns.split(' ').length;
      [...panel.querySelectorAll('li')].forEach((li, i) => {
        const ruled = parseFloat(getComputedStyle(li).borderTopWidth) > 0;
        const firstRow = i < cols;
        if (ruled === firstRow) out.push(panel.querySelector('.a8-assay-h').textContent + ' #' + (i + 1) +
          (firstRow ? ' is ruled but is in the first row' : ' is not ruled off from the row above'));
      });
    });
    return out;
  });
  if (a8rules.length) { bad('A8 · ' + a8rules.length + ' assay cell(s) mis-ruled'); a8rules.forEach(note); }
  else ok('A8 · every assay cell below the first row is ruled off, in both panels');

  if (SHOTS) {
    for (const b of BAYS) {
      await pg.locator('#' + b).screenshot({ path: path.join(OUT, 'programme-lab-' + b + '.png') })
        .catch(() => {});
    }
    note('shots → ' + OUT);
  }
  /* ─── 8 · the measure ─── */
  head('8 · Nothing sets past a readable measure');
  /* ⚠️ THE UNIT IS CHARACTERS, AND THEY ARE MEASURED IN THE REAL FACE — not derived
     from font-size. The first version of this check assumed the usual 0.5em per
     character and reported B2 at 106 when CSS had already capped it at 78ch: MediGyn
     NOW's average advance is nearer 0.68em, so the assumption over-counted by a third
     and would have had someone tightening a measure that was already correct. Each
     element's own text is run through canvas measureText in its own computed font, and
     characters-per-line falls out of the ratio. 45–90 is the classic band; 100 is the
     ceiling here, deliberately loose, so it only fires on copy that genuinely runs away
     — which it did, on B2's stacked TEST row before the cap went on. */
  const wide = await pg.evaluate(() => {
    const SEL = '.t-p, .t-list li, .b1-list li, .b2-row .c, .b3-c, .c3-lede, .a4-card p, .bay-thesis';
    const cv = document.createElement('canvas').getContext('2d');
    const out = [];
    document.querySelectorAll(SEL).forEach(n => {
      if (n.querySelector('ul')) return;                    /* wrappers, not lines */
      const txt = n.textContent.trim();
      if (txt.length < 40) return;                          /* too short to have a measure */
      const cs = getComputedStyle(n);
      cv.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      const px = cv.measureText(txt).width;
      if (!px) return;
      const ch = Math.round(txt.length * (n.getBoundingClientRect().width / px));
      if (ch > 100) out.push({ cls: n.className || n.tagName, ch, txt: txt.slice(0, 40) });
    });
    return out;
  });
  if (wide.length) {
    bad(wide.length + ' element(s) set past ~100 characters');
    wide.slice(0, 5).forEach(w => note(w.ch + 'ch · ' + w.cls + ' · ' + JSON.stringify(w.txt)));
  } else ok('every copy element across all 15 treatments sets inside ~100 characters');

  await pg.close();

  /* ─── 7 · the phone, where most of the traffic is ─── */
  head('7 · 390 × 844 — the fallbacks are real, not squeezed');
  const ph = await br.newPage({ viewport: { width: 390, height: 844 } });
  const phErrs = [];
  ph.on('pageerror', e => phErrs.push(e.message));
  await ph.goto('http://localhost:8791' + PAGE, { waitUntil: 'networkidle' });
  await ph.evaluate(() => document.querySelector('#segWidth [data-w="phone"]').click());
  await ph.waitForTimeout(700);

  const phone = await ph.evaluate(() => {
    const a6grid = document.querySelector('[data-render="a6"] .a6-grid');
    const a6fb   = document.querySelector('[data-render="a6"] .a6-fallback');
    return {
      docW: document.documentElement.scrollWidth,
      winW: window.innerWidth,
      a6gridShown: getComputedStyle(a6grid).display !== 'none',
      a6fbShown:   getComputedStyle(a6fb).display !== 'none',
      a6fbItems:   a6fb.querySelectorAll('.a5-item').length,
      /* the one thing a container-query layout can still get wrong: a treatment that
         overflows its own frame rather than the document */
      overflowing: [...document.querySelectorAll('.demo')]
        .filter(d => d.querySelector('.demo-in').scrollWidth > d.clientWidth + 2)
        .map(d => d.parentElement.id),
      /* A3 · the ruler must still carry eight weeks, and nothing may be clipped.
         Both are regressions: the ruler dropped to four ticks while the bars kept
         running the full width, and the step-6 marker's second line was cut off by a
         fixed height — the line that says the source gives it no date. */
      a3ticks: [...document.querySelectorAll('[data-render="a3"] .a3-tick')]
        .filter(t => getComputedStyle(t).display !== 'none').length,
      a3clipped: [...document.querySelectorAll('[data-render="a3"] .a3-bar')]
        .filter(b => b.scrollHeight > b.clientHeight + 1).length,
    };
  });
  if (phErrs.length) bad('phone threw: ' + phErrs[0]); else ok('phone console clean');
  if (!phone.a6gridShown && phone.a6fbShown && phone.a6fbItems === 7)
    ok('A6 · the two-column stage is gone and A5’s seven-row accordion is standing in its place');
  else bad('A6 · fallback wrong: ' + JSON.stringify(phone));
  if (phone.overflowing.length)
    bad('treatments overflowing their own frame at 390: ' + phone.overflowing.join(', '));
  else ok('no treatment overflows the 390 frame');
  if (phone.a3ticks === 8) ok('A3 · the ruler still carries all eight weeks at 390');
  else bad('A3 · only ' + phone.a3ticks + ' of 8 week ticks visible — the bars would be ' +
           'measured against a ruler that does not span them');
  if (!phone.a3clipped) ok('A3 · no bar clips its own caption at 390');
  else bad('A3 · ' + phone.a3clipped + ' bar(s) clipping their caption at 390');
  if (phone.docW <= phone.winW + 1) ok('document does not scroll sideways at 390');
  else note('document is ' + phone.docW + 'px at a ' + phone.winW + ' viewport — ' +
            'the lab chrome, not a treatment (see peptide-page.mjs on the 360 exemption)');

  if (SHOTS) {
    /* the phone shots are the ones worth looking at — the desktop form is the one
       everybody imagines while designing, and the 390 form is the one most of the
       traffic actually gets */
    for (const b of BAYS) {
      await ph.locator('#' + b).screenshot({ path: path.join(OUT, 'phone-' + b + '.png') })
        .catch(() => {});
    }
    note('phone shots → ' + OUT);
  }
  await ph.close();
  await br.close();
  srv.close();

  console.log('\n' + (failures
    ? '\x1b[31m' + failures + ' of ' + checks + ' checks failed\x1b[0m'
    : '\x1b[32mall ' + checks + ' checks pass\x1b[0m'));
  process.exit(failures ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });
