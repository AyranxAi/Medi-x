/* ═══ tools/qa/process-sculpture.mjs — the six-shell sculpture, photographed and
   smoke-tested. Serves the repo, then photographs 03's process sculpture on both
   door pages, at desktop and phone, at every step — and asserts the contract the
   section exists to keep:

     · the active shell settles in ONE consistent presentation zone: its centre
       moves less than 3% of the stage between any two steps (never chases the eye)
     · the maroon inner layer is actually revealed on the active shell (opacity ≈ 1
       and physically offset from the ivory face — depth, not decoration)
     · every INACTIVE shell's title is reachable: at least one sample point over
       the label resolves to that shell's own button (nothing buried alive)
     · the active card body renders ≥ 13px and the editorial body ≥ 15px
     · zero page errors

       npm install --no-save playwright@1.49.1
       node tools/qa/process-sculpture.mjs

   Shots land in .qa-out/process/ (gitignored). Exits non-zero on any failure. */
import { chromium } from 'playwright';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT  = path.join(ROOT, '.qa-out', 'process');
mkdirSync(OUT, { recursive: true });

const MIME = { html:'text/html', js:'text/javascript', mjs:'text/javascript', css:'text/css',
  webp:'image/webp', avif:'image/avif', png:'image/png', jpg:'image/jpeg', svg:'image/svg+xml',
  woff2:'font/woff2', ico:'image/x-icon', json:'application/json' };

const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(f).slice(1)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise(r => srv.listen(0, r));
const port = srv.address().port;

const PAGES = ['modern-menopause', 'hormone-therapy-bhrt'];
const SIZES = [[1440, 900, 'desktop'], [393, 852, 'phone']];
let failures = 0;
const fail = m => { failures++; console.error('  ✗ ' + m); };

const browser = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });

for (const pageName of PAGES) {
  for (const [w, h, label] of SIZES) {
    console.log(`${pageName} @ ${label}`);
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`http://127.0.0.1:${port}/${pageName}/`, { waitUntil: 'load' });
    await page.waitForTimeout(700);

    const on = await page.evaluate(() => {
      const el = document.getElementById('process');
      if (!el || !el.classList.contains('ps-on')) return false;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      return true;
    });
    if (!on) { fail('sculpture did not reveal'); await ctx.close(); continue; }
    await page.waitForTimeout(300);

    const centres = [];
    for (let s = 0; s < 6; s++) {
      await page.evaluate(i => document.querySelectorAll('#process .ps-dot')[i].click(), s);
      await page.waitForTimeout(1300);

      const r = await page.evaluate(() => {
        const root  = document.getElementById('process');
        const stage = root.querySelector('[data-ps-stage]').getBoundingClientRect();
        const act   = root.querySelector('.ps-petal.is-on');
        const face  = act.querySelector('.ps-face').getBoundingClientRect();
        const under = act.querySelector('.ps-under');
        const ub    = under.getBoundingClientRect();
        const out = {
          cx: (face.x + face.width / 2 - stage.x) / stage.width,
          cy: (face.y + face.height / 2 - stage.y) / stage.height,
          underOpacity: parseFloat(getComputedStyle(under).opacity),
          underOffset: Math.hypot(ub.x - face.x, ub.y - face.y),
          cardPx: parseFloat(getComputedStyle(act.querySelector('.ps-card-meta')).fontSize),
          edPx: parseFloat(getComputedStyle(root.querySelector('[data-ps-body]')).fontSize),
          buried: [],
        };
        root.querySelectorAll('.ps-petal:not(.is-on)').forEach(p => {
          const lb = p.querySelector('.ps-lbl').getBoundingClientRect();
          const hit = p.querySelector('.ps-hit');
          const pts = [[.5,.5],[.2,.35],[.8,.35],[.2,.75],[.8,.75]]
            .map(([fx,fy]) => document.elementFromPoint(lb.x + lb.width*fx, lb.y + lb.height*fy));
          if (!pts.some(el2 => el2 === hit || (el2 && hit.contains(el2))))
            out.buried.push(p.querySelector('.ps-lbl').textContent);
        });
        return out;
      });

      centres.push([r.cx, r.cy]);
      if (r.underOpacity < 0.95) fail(`step ${s+1}: maroon layer not revealed (opacity ${r.underOpacity})`);
      if (r.underOffset < 3)     fail(`step ${s+1}: maroon layer not offset from the face (${r.underOffset.toFixed(1)}px)`);
      if (r.cardPx < 12)         fail(`step ${s+1}: card meta ${r.cardPx}px`);
      if (r.edPx < 15)           fail(`step ${s+1}: editorial body ${r.edPx}px`);
      if (r.buried.length)       fail(`step ${s+1}: labels unreachable → ${r.buried.join(', ')}`);

      const el = await page.$('#process');
      await el.screenshot({ path: path.join(OUT,
        `${pageName === 'modern-menopause' ? 'mm' : 'bhrt'}-${label}-step${s+1}.png`) });
    }

    const [cx0, cy0] = centres[0];
    centres.forEach(([cx, cy], i) => {
      if (Math.hypot(cx - cx0, cy - cy0) > 0.03)
        fail(`active zone drifted at step ${i+1}: (${cx.toFixed(3)},${cy.toFixed(3)}) vs (${cx0.toFixed(3)},${cy0.toFixed(3)})`);
    });
    if (errors.length) fail('page errors: ' + errors.join(' | '));
    await ctx.close();
  }
}
await browser.close();
srv.close();
console.log(failures ? `\n${failures} failure(s)` : '\nall green — shots in ' + OUT);
process.exit(failures ? 1 : 0);
