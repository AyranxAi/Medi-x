/* ═══ tools/qa/process-sculpture.mjs — the six-shell sculpture, photographed and
   smoke-tested. Serves the repo, then photographs 03's process sculpture on all three
   door pages, at desktop and phone, at every step — and asserts the contract the
   section exists to keep:

     · the active shell settles in ONE consistent presentation zone: its centre
       moves less than 3% of the stage between any two steps (never chases the eye)
     · the maroon INNER BODY (a full SVG path instance behind the ivory face)
       physically extends past the face on the right — depth, not decoration
     · every INACTIVE shell's title is reachable: at least one sample point over
       the label resolves to that shell's own button (nothing buried alive)
     · the active card meta renders ≥ 12px and the editorial body ≥ 15px
     · THE GRADE, as a pair (2026-08-24): the chapter stands on --ps-ground #F0EBE7 —
       the colour the petals used to be — and the lit plate reads the scrolled header's
       #FAF7F1 off the live framebuffer, with the bar itself driven down and back up to
       prove what it returns as. Half this change is worse than none of it, so both
       halves are asserted here rather than in two places.
     · .ps-eyebrow is --gold-gloss, not --gold-deep: 13px uppercase is small text and
       --gold-deep measures 4.233 on this ground against a floor of 4.5
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

/* ⚠️ THREE DOORS SINCE 2026-08-24 — his call, "make it in all three services including
   men in testosterone top up". The three PS blocks are byte-identical (md5 the marked
   ranges to prove it), so a failure here on one page and not the others is a page-level
   ground or token, never the sculpture. */
const PAGES = ['modern-menopause', 'hormone-therapy-bhrt', 'testosterone-top-up'];
const SIZES = [[1440, 900, 'desktop'], [393, 852, 'phone']];
const TAG = { 'modern-menopause':'mm', 'hormone-therapy-bhrt':'bhrt', 'testosterone-top-up':'trt' };
let failures = 0;
const fail = m => { failures++; console.error('  ✗ ' + m); };

const browser = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined,
  /* the sculpture paints in WebGL; headless needs a software GL to show it */
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

for (const pageName of PAGES) {
  for (const [w, h, label] of SIZES) {
    console.log(`${pageName} @ ${label}`);
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`http://127.0.0.1:${port}/${pageName}/`, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    /* the page's preloader (burgundy, z 300) sits over everything for ~1.5s after
       load; elementFromPoint would hit IT and call every label buried */
    await page.waitForFunction(() => {
      const p = document.querySelector('.preloader');
      return !p || getComputedStyle(p).display === 'none';
    }, null, { timeout: 8000 }).catch(() => {});

    const on = await page.evaluate(() => {
      const el = document.getElementById('process');
      if (!el || !el.classList.contains('ps-on')) return false;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      return true;
    });
    if (!on) { fail('sculpture did not reveal'); await ctx.close(); continue; }
    /* the 3D layer arrives a beat later (dynamic import of three); give it a moment,
       then note which painter is live — it decides how the maroon is proven */
    await page.waitForFunction(() => document.getElementById('process').classList.contains('ps-3d'), null, { timeout: 6000 }).catch(() => {});
    const is3d = await page.evaluate(() => document.getElementById('process').classList.contains('ps-3d'));
    console.log('  painter:', is3d ? 'WebGL' : 'SVG fallback');
    await page.waitForTimeout(300);

    /* ── THE GRADE (2026-08-24) — his call: "you know how our flower is cream? make that
       the color of the background", and "for the flower match it with the color of the
       header when you go down and you go up and reappears". Two colours that swapped
       ends, so they are asserted as a PAIR: a page that reverted one half would still
       pass a check that only knew about the other, and half of this change is worse
       than none of it. The header half is driven for real at the foot of this block. */
    const grade = await page.evaluate(() => {
      const ps = document.getElementById('process');
      return {
        ground:  getComputedStyle(document.querySelector('.programme')).backgroundColor,
        eyebrow: getComputedStyle(ps.querySelector('.ps-eyebrow')).color,
      };
    });
    if (grade.ground !== 'rgb(240, 235, 231)')
      fail(`chapter ground is ${grade.ground}, not --ps-ground #F0EBE7`);
    /* 13px uppercase is small text, floor 4.5 — and --gold-deep measures 4.233 on this
       ground. The token is not decoration; see the note over .ps-eyebrow. */
    if (grade.eyebrow !== 'rgb(127, 98, 48)')
      fail(`eyebrow is ${grade.eyebrow}, not --gold-gloss #7F6230`);

    const centres = [];
    for (let s = 0; s < 6; s++) {
      /* wait for the shell to DEPART ITS SEAT and then SETTLE, not for a stopwatch:
         this harness runs on software GL, where the render loop can starve the
         timers that stage the choreography — a fixed sleep measures a shell
         mid-flight, and a stillness-only wait converges on one that has not left
         yet. Departure (the width grows toward scale 1) then two still samples. */
      await page.evaluate(i => {
        window.__psKey = null;
        document.querySelectorAll('#process .ps-dot')[i].click();
      }, s);

      /* ⚠️⚠️ WAIT ON THE CONTRACT, NOT ON STILLNESS. This wait was "the box grew past 1.15x,
         then two identical samples 300ms apart", and it cost three rounds of confusing
         failures: it accepts a piece that is momentarily still BETWEEN the choreography's
         three beats, so the harness measured a plate that had not finished arriving. Every
         symptom followed from that — `maroon ... (0.0px)` at 1-3 random steps per run, and
         `active zone drifted`, both on pages whose bytes were identical to main. MEASURED
         2026-08-24: with a long enough settle the seating is correct at all six steps on
         both viewports, every time, and the maroon is on the plate's right at every one.
         So the condition is now what the section actually promises:
           · the chosen petal is BOTH `.is-on` AND seated at `data-slot="0"`
           · its box has actually morphed to the plate — 66cqw against a resting leaf's 43,
             so "clearly the widest" is the honest test and 1.3x is well inside that margin
           · the 3D layer's own tweens have landed
           · and only THEN, two identical boxes
         ⚠️ DO NOT RELAX THIS BACK TO A SLEEP. A longer sleep hides the same race; the point
         is that the plate's arrival is observable, so observe it. */
      await page.waitForFunction(i => {
        const ps = document.getElementById('process');
        const arms = [...ps.querySelectorAll('.ps-arm')];
        const arm = arms[i];
        if (!arm.classList.contains('is-on')) return false;
        if (arm.getAttribute('data-slot') !== '0') return false;
        const w = arms.map(a => a.querySelector('.ps-face').getBoundingClientRect().width);
        const others = w.filter((_, k) => k !== i);
        if (w[i] < Math.max.apply(null, others) * 1.3) return false;
        if (window.__ps3d && !window.__ps3d.settled()) return false;
        const r = arm.querySelector('.ps-face').getBoundingClientRect();
        const key = r.x.toFixed(1) + ':' + r.y.toFixed(1) + ':' + r.width.toFixed(1);
        const same = window.__psKey === key;
        window.__psKey = key;
        return same;
      }, s, { polling: 250, timeout: 25000 }).catch(() => fail(`step ${s+1}: the plate never finished arriving`));

      const read = () => page.evaluate(() => {
        const root  = document.getElementById('process');
        const stage = root.querySelector('[data-ps-stage]').getBoundingClientRect();
        const act   = root.querySelector('.ps-arm.is-on');
        const face  = act.querySelector('.ps-face').getBoundingClientRect();
        /* the maroon must physically show past the plate's right edge — depth, not
           decoration. WebGL live: read the framebuffer just right of the plate's box
           at mid-height and walk inward until a maroon pixel turns up (R well over G).
           SVG fallback: the inner body's box must extend past the face path. */
        let maroonReveal = 0, opaque = 0;
        if (root.classList.contains('ps-3d')) {
          const c = root.querySelector('.ps-gl'), gl = c.getContext('webgl2') || c.getContext('webgl');
          const cr = c.getBoundingClientRect(), sx = c.width / cr.width, sy = c.height / cr.height;
          const px = new Uint8Array(4);
          for (let dx = 40; dx >= -face.width * .3; dx -= 2) {
            const x = Math.round((face.right + dx - cr.left) * sx), y = Math.round(c.height - (face.y + face.height*.45 - cr.top) * sy);
            gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
            /* ⚠️ COUNT THE OPAQUE SAMPLES, NOT ONLY THE MAROON ONES. A scan line that
               crosses the plate MUST hit opaque pixels — the plate is there. Zero of
               them means the framebuffer read back blank, which is a statement about
               the read and not about the maroon; see the caller. */
            if (px[3] > 200) opaque++;
            if (px[3] > 200 && px[0] > px[1] + 22 && px[0] < 170 && px[2] < 130) { maroonReveal = Math.max(maroonReveal, dx + 30); }
          }
        } else {
          opaque = 1;
          const actSvg = [...act.querySelectorAll('.ps-svg--act')]
            .find(sv => getComputedStyle(sv).display !== 'none');   /* desktop or phone art */
          const innerR = actSvg.querySelector('.ps-inner').getBoundingClientRect();
          const facePr = actSvg.querySelector('.ps-faceP').getBoundingClientRect();
          maroonReveal = innerR.right - facePr.right;
        }
        const out = {
          maroonReveal, opaque,
          cx: (face.x + face.width / 2 - stage.x) / stage.width,
          cy: (face.y + face.height / 2 - stage.y) / stage.height,
          cardPx: parseFloat(getComputedStyle(act.querySelector('.ps-card-meta')).fontSize),
          edPx: parseFloat(getComputedStyle(root.querySelector('[data-ps-body]')).fontSize),
          buried: [],
        };
        root.querySelectorAll('.ps-arm:not(.is-on)').forEach(p => {
          const lb = p.querySelector('.ps-lbl').getBoundingClientRect();
          const hit = p.querySelector('.ps-hit');
          const pts = [[.5,.5],[.2,.35],[.8,.35],[.2,.75],[.8,.75]]
            .map(([fx,fy]) => document.elementFromPoint(lb.x + lb.width*fx, lb.y + lb.height*fy));
          if (!pts.some(el2 => el2 === hit || (el2 && hit.contains(el2))))
            out.buried.push(p.querySelector('.ps-lbl').textContent);
        });
        return out;
      });

      /* ⚠️ THIS SPLITS TWO FAILURES THAT USED TO PRINT THE SAME LINE, and it stays because
         the split is still worth having — but IT IS NOT THE FIX and neither is the settle
         wait above. See the ⚠️⚠️ at the foot of this comment: the maroon check still fails
         with the seating and the morph provably correct, so a second fault remains open.
         Under software GL the maroon check fails at 1-3 steps per page-and-viewport, on
         DIFFERENT steps each run, on pages whose bytes are identical to main, always at
         exactly `0.0px`. Two very different things produce that number:
           · the drawing buffer read back EMPTY — nothing opaque anywhere on a line that
             crosses the plate, which is not a picture anyone has seen. The stage's
             ResizeObserver calls resize(), which reallocates and clears the buffer, and
             the redraw is a wake(50) away. Retried once, and only then reported.
           · the line was drawn and carried NO MAROON — the plate was measured somewhere
             it should not have been. That is the same fault the `active zone drifted`
             check reports, and the two travel together: the settle wait below accepts two
             identical samples 300ms apart, and the choreography is three beats, so a pair
             taken across a beat boundary matches while the piece is still in flight.
         ⚠️ THE RETRY IS NOT A TOLERANCE. `opaque` is either zero or dozens; there is no
         middle, so it cannot quietly widen a real failure into a pass.
         ⚠️⚠️ THE CAUSE WAS FOUND 2026-08-24d AND IT WAS NEVER THIS CHECK. The 3D layer
         stopped drawing before the DOM stopped moving, so the canvas held a mid-turn frame
         and every pixel test on it was reading a picture the page had already left behind.
         Fixed at the source: a capturing transitionend/transitioncancel listener on the
         stage now buys another frame whenever anything finishes moving. Proof by
         construction: forcing one extra frame took a wrong-looking step from 14.5% of the
         frame differing to 0.00%.
         ⚠️ SO A `0.0px` HERE IS EVIDENCE ABOUT THE PAGE AGAIN — it was not, for three
         rounds. If it returns, look for a new way the render loop can stop early before
         suspecting the scan. */
      let r = await read();
      if (r.opaque === 0) {
        await page.evaluate(() => window.__ps3d && window.__ps3d.wake(120));
        await page.waitForFunction(() => !window.__ps3d || window.__ps3d.settled(), null, { timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(250);
        r = await read();
      }

      centres.push([r.cx, r.cy]);
      if (r.opaque === 0)      fail(`step ${s+1}: the framebuffer read back blank twice — the maroon was not measured`);
      else if (r.maroonReveal < 2) fail(`step ${s+1}: maroon inner body not revealed past the face (${r.maroonReveal.toFixed(1)}px)`);
      if (r.cardPx < 12)         fail(`step ${s+1}: card meta ${r.cardPx}px`);
      if (r.edPx < 15)           fail(`step ${s+1}: editorial body ${r.edPx}px`);
      if (r.buried.length)       fail(`step ${s+1}: labels unreachable → ${r.buried.join(', ')}`);

      const el = await page.$('#process');
      /* ⚠️ THE TAG IS A MAP, NOT A TERNARY — it was `mm : bhrt`, which quietly filed the
         third door's shots over the BHRT ones the moment testosterone-top-up joined the
         list. A two-way ternary over a growing list is a silent overwrite. */
      await el.screenshot({ path: path.join(OUT, `${TAG[pageName]}-${label}-step${s+1}.png`) });
    }

    /* 5%: each shell arrives with its own small rotation and the shared tilt, and
       their projections spread the measured centre by a few cq — invisible; what
       this guards against is the active piece CHANGING NEIGHBOURHOODS */
    const [cx0, cy0] = centres[0];
    centres.forEach(([cx, cy], i) => {
      if (Math.hypot(cx - cx0, cy - cy0) > 0.05)
        fail(`active zone drifted at step ${i+1}: (${cx.toFixed(3)},${cy.toFixed(3)}) vs (${cx0.toFixed(3)},${cy0.toFixed(3)})`);
    });
    /* THE PORCELAIN AGAINST THE BAR. The petals are #FAF7F1 — --ivory, which is what
       `.hdr--solid` paints at 95%. Read the lit plate out of the framebuffer rather than
       trusting the literal, because the literal is what a re-grade would change and the
       env map is what would quietly undo it; 14 of tolerance per channel is the studio's
       own shading, measured at 250,244,234 on all three doors on the day. */
    if (is3d) {
      const px = await page.evaluate(() => {
        const ps = document.getElementById('process');
        const face = ps.querySelector('.ps-arm.is-on .ps-face').getBoundingClientRect();
        const c = ps.querySelector('.ps-gl'), gl = c.getContext('webgl2') || c.getContext('webgl');
        const cr = c.getBoundingClientRect(), sx = c.width / cr.width, sy = c.height / cr.height;
        const b = new Uint8Array(4);
        gl.readPixels(Math.round((face.x + face.width * .30 - cr.left) * sx),
                      Math.round(c.height - (face.y + face.height * .68 - cr.top) * sy),
                      1, 1, gl.RGBA, gl.UNSIGNED_BYTE, b);
        return [b[0], b[1], b[2], b[3]];
      });
      if (px[3] < 200 || Math.abs(px[0]-250) > 14 || Math.abs(px[1]-247) > 14 || Math.abs(px[2]-241) > 16)
        fail(`lit plate reads ${px.join(',')} — not the header ivory #FAF7F1`);
    }

    /* the header state he named, driven rather than simulated: the bar goes solid and
       hides past 240px on the way DOWN and comes back solid on the way UP. Toggling the
       class and reading it in the same tick returns the transition's start value — that
       cost a false failure the first time this was written. */
    await page.evaluate(async () => {
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 250));
      for (let y = 0; y < 1400; y += 120) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
      for (let y = 1400; y > 900; y -= 120) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    });
    await page.waitForTimeout(900);
    const bar = await page.evaluate(() => {
      const b = document.querySelector('.hdr');
      return { bg: getComputedStyle(b).backgroundColor,
               solid: b.classList.contains('hdr--solid'),
               hidden: b.classList.contains('hdr--hidden') };
    });
    if (!bar.solid || bar.hidden) fail(`header did not come back solid on the way up (solid=${bar.solid} hidden=${bar.hidden})`);
    else if (bar.bg !== 'rgba(250, 247, 241, 0.95)') fail(`the returned bar is ${bar.bg}, not the petals' #FAF7F1 @ .95`);

    if (errors.length) fail('page errors: ' + errors.join(' | '));
    await ctx.close();
  }
}
await browser.close();
srv.close();
console.log(failures ? `\n${failures} failure(s)` : '\nall green — shots in ' + OUT);
process.exit(failures ? 1 : 0);
