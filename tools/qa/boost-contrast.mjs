/* Booster-plate contrast harness — BRAND.md's method, for section 05.
 *
 *   node tools/qa/boost-contrast.mjs           measure the shipped diptych
 *   node tools/qa/boost-contrast.mjs --shots   also write a PNG of each measured frame
 *
 * Needs: npm install playwright@1.49.1 sharp
 *
 * WHY THIS EXISTS. 05's twelve measurements were run by hand and the script was never kept,
 * so every plate swap since has been a promise rather than a check — and HANDOFF.md records
 * that this section has already failed a measurement once, at exactly 4.50 against a 4.5
 * floor. The diptych puts copy ON the photograph, so a plate change here is a
 * re-measurement and not a src change. This is the thing to run.
 *
 * SAME METHOD AS door-contrast.mjs: render, hide the copy, sample the ground behind each
 * copy rectangle, take the worst 2% of pixels, require 4.5:1 small and 3:1 large. Three
 * controls x two plates x two viewports = twelve.
 *
 * ⚠️ THE PHONE MOVES THE GOALPOSTS, AND THAT IS THE FAILURE THIS SECTION ALREADY HAD. The
 * rose `h3 em` is 38px on desktop — LARGE text, needing only 3 — and 22px on a phone, where
 * it needs 4.5. A scrim tuned on desktop will pass there and fail at 390. Both viewports,
 * every time.
 *
 * ⚠️ HIDE THE CHILDREN TOO. `visibility:hidden` on an h3 does hide its em, but a rule that
 * names only the parent and is then overridden by a more specific one will not — an earlier
 * hand-run measured an unhidden rose em against itself and reported 1.00.
 *
 * ⚠️ A NEAR-1.0 RATIO IS ALMOST NEVER A REAL FAILURE. It means the foreground and the
 * background are the same pixels: the copy did not hide, or the rect was read before the
 * scroll settled and is pointing at the wrong part of the page.
 *
 * ⚠️ ONE SCROLL PER TARGET, NOT PER SECTION. 05 is taller than the viewport, so no single
 * scroll position holds the headline and both rows at once. Scrolling per target is only
 * safe because the copy is hidden with `visibility`, which does not move layout.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = 8131;
const PAGE = `http://localhost:${PORT}/hormone-balancing/index.html?probe=1`;
const VIEWPORTS = [[1440, 900], [390, 844]];
const CONTROLS = ["h3", "h3 em", "p"];
const SHOTS = process.argv.includes("--shots");

const MIME = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript",
  ".webp":"image/webp", ".avif":"image/avif", ".svg":"image/svg+xml", ".png":"image/png",
  ".woff2":"font/woff2", ".ico":"image/x-icon" };

const server = http.createServer((req, res) => {
  let p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "content-type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(PORT, r));

const chan = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const HIDE = ".boost-one h3,.boost-one h3 em,.boost-one p{visibility:hidden !important}";

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
});
const results = [];

for (const [width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(PAGE, { waitUntil: "load" });
  const rows = await page.evaluate(() => document.querySelectorAll(".boost-one").length);

  for (let i = 0; i < rows; i++) {
    for (const sel of CONTROLS) {
      await page.goto(PAGE, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);

      /* scroll first, settle, and only THEN read the rect — reading it in the same call
         that starts the scroll samples wherever the page happened to be */
      const ok = await page.evaluate(([k, s]) => {
        const row = document.querySelectorAll(".boost-one")[k];
        const el = row.querySelector(s);
        if (!el) return false;
        el.scrollIntoView({ block: "center" });
        return true;
      }, [i, sel]);
      if (!ok) continue;
      await page.waitForTimeout(500);

      const t = await page.evaluate(([k, s]) => {
        const row = document.querySelectorAll(".boost-one")[k];
        const el = row.querySelector(s);
        const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
        const px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
        const img = row.querySelector("img");
        return { plate: img ? img.getAttribute("src").split("/").pop() : `row${k + 1}`,
          sel: s, x: r.x, y: r.y, w: r.width, h: r.height, color: cs.color, fontPx: px,
          large: px >= 24 || (bold && px >= 18.66) };
      }, [i, sel]);

      if (t.y < 0 || t.y + t.h > height || t.w < 2) {
        results.push({ ...t, vp: `${width}x${height}`, skipped: true });
        continue;
      }

      await page.addStyleTag({ content: HIDE });
      await page.waitForTimeout(200);
      const png = await page.screenshot();
      if (SHOTS) fs.writeFileSync(
        path.join(ROOT, `boost-${width}-${i}-${sel.replace(/\W+/g, "")}.png`), png);
      const { data, info } = await sharp(png).ensureAlpha().raw()
        .toBuffer({ resolveWithObject: true });

      /* the alpha is part of the colour — .boost-one p is ivory at .84 and measuring it as
         opaque reports a contrast the reader never gets, always flatteringly */
      const parts = t.color.match(/[\d.]+/g).map(Number);
      const [fr, fgc, fb] = parts, alpha = parts.length > 3 ? parts[3] : 1;
      const ratios = [];
      for (let py = Math.floor(t.y); py < Math.ceil(t.y + t.h); py++) {
        for (let px = Math.floor(t.x); px < Math.ceil(t.x + t.w); px++) {
          if (px < 0 || py < 0 || px >= info.width || py >= info.height) continue;
          const o = (py * info.width + px) * info.channels;
          const br = data[o], bg = data[o + 1], bb = data[o + 2];
          const eff = alpha === 1 ? lum(fr, fgc, fb)
            : lum(alpha * fr + (1 - alpha) * br,
                  alpha * fgc + (1 - alpha) * bg,
                  alpha * fb + (1 - alpha) * bb);
          ratios.push(contrast(eff, lum(br, bg, bb)));
        }
      }
      if (!ratios.length) { results.push({ ...t, vp: `${width}x${height}`, skipped: true }); continue; }
      ratios.sort((a, b) => a - b);
      const worst = ratios[Math.max(0, Math.floor(ratios.length * 0.02) - 1)];
      const need = t.large ? 3 : 4.5;
      results.push({ ...t, vp: `${width}x${height}`, worst, need, pass: worst >= need });
    }
  }
  await page.close();
}
await browser.close();
server.close();

console.log("\nsection 05 — copy on the plates, as shipped\n");
for (const r of results) {
  if (r.skipped) {
    console.log(`  ${r.vp.padEnd(9)} ${r.plate.padEnd(24)} ${r.sel.padEnd(7)} skipped (off screen)`);
    continue;
  }
  console.log(`  ${r.vp.padEnd(9)} ${r.plate.padEnd(24)} ${r.sel.padEnd(7)} ` +
    `${String(Math.round(r.fontPx) + "px").padEnd(5)} ${(r.large ? "large" : "small").padEnd(5)} ` +
    `need ${String(r.need).padEnd(3)} worst2% ${r.worst.toFixed(2).padStart(6)}  ` +
    `${r.pass ? "pass" : "*** FAIL ***"}` +
    `${r.worst < 1.15 ? "   <- near 1.0: the copy probably did not hide" : ""}`);
}
const measured = results.filter(r => !r.skipped);
const skipped  = results.filter(r => r.skipped);
const fails    = measured.filter(r => !r.pass);
/* a silent skip that reads as a pass is worse than a fail — door-contrast.mjs learned this
   the expensive way and this harness is not going to relearn it */
if (skipped.length) {
  console.log(`\n${skipped.length} control(s) NOT MEASURED — fix the scroll, do not trust this run.`);
  process.exitCode = 1;
}
if (measured.length) {
  const tightest = measured.reduce((a, b) => (a.worst - a.need) <= (b.worst - b.need) ? a : b);
  console.log(`\n${measured.length - fails.length}/${measured.length} clear.` +
    `  tightest: ${tightest.plate} ${tightest.sel} @ ${tightest.vp} — ` +
    `${tightest.worst.toFixed(2)} against ${tightest.need} ` +
    `(margin ${(tightest.worst - tightest.need).toFixed(2)})`);
}
if (fails.length) { console.log(`\n${fails.length} FAILING.`); process.exitCode = 1; }
