/* Door-plate contrast harness — BRAND.md's method, automated.
 *
 *   node tools/qa/door-contrast.mjs            measure the shipped scrim
 *   node tools/qa/door-contrast.mjs --rail     measure the rail's ramp instead (it fails)
 *
 * Needs: npm install playwright@1.49.1 sharp
 *
 * WHY THIS EXISTS. Section 04's copy sits on three photographs that do not share a tone —
 * BHRT is cream silk, TRT is near-black stone — and it sits there in THREE DIFFERENT
 * COLOURS: the hook is rose, the title ivory, the Explore link gold. "Ivory clears 4.5:1"
 * is therefore not the test; each control against its own colour, on its own plate, at each
 * viewport is the test. Eighteen measurements, and the one that binds is the rose hook over
 * the palest plate with about 0.5 of margin.
 *
 * THE METHOD, from BRAND.md: render, hide the copy, sample the ground behind each copy
 * rectangle, take the worst 2% of pixels, require 4.5:1 for small text and 3:1 for large.
 * Worst 2% rather than the mean, because a mean passes comfortably over a photograph that
 * has a bright highlight running through one line of the title.
 *
 * ⚠️ Run this after ANY change to a plate, to --plate-y, to the scrim, or to a copy colour.
 * ⚠️ deviceScaleFactor is pinned to 1 so pixel rectangles map 1:1 to CSS rectangles.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = 8123;
const PAGE = `http://localhost:${PORT}/hormone-balancing/index.html?probe=1`;
const VIEWPORTS = [[1440, 900], [390, 844]];
const CONTROLS = [".hook", "h3", ".link-arrow"];

/* the ramp the rail uses; kept here so the failing alternative stays reproducible */
const RAIL_RAMP = "linear-gradient(180deg,rgba(46,34,40,.16) 0%,rgba(92,31,49,.72) 58%," +
                  "rgba(26,15,19,.94) 100%)";
const useRail = process.argv.includes("--rail");

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

/* WCAG 2.1 relative luminance and contrast ratio */
const chan = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
});
const results = [];

for (const [width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const doorCount = await (async () => {
    await page.goto(PAGE, { waitUntil: "load" });
    return page.evaluate(() => document.querySelectorAll(".doors .door").length);
  })();

  /* one full reload per door: the copy has to be hidden to photograph the ground, and
     un-hiding it to measure the next door's rectangles would need the same reload anyway */
  for (let i = 0; i < doorCount; i++) {
    await page.goto(PAGE, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    if (useRail) await page.addStyleTag({
      content: `html.doors-tri .door::after{background:${RAIL_RAMP} !important}` });
    await page.evaluate(k =>
      document.querySelectorAll(".doors .door")[k].scrollIntoView({ block: "center" }), i);
    await page.waitForTimeout(600);

    const targets = await page.evaluate(([k, sels]) => {
      const door = document.querySelectorAll(".doors .door")[k];
      return sels.flatMap(sel => {
        const el = door.querySelector(sel);
        if (!el) return [];
        const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
        const px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
        return [{ door: door.className.replace(/\bdoor\b\s*/, "").trim() || `#${k + 1}`,
          sel, x: r.x, y: r.y, w: r.width, h: r.height, color: cs.color, fontPx: px,
          large: px >= 24 || (bold && px >= 18.66) }];
      });
    }, [i, CONTROLS]);

    await page.addStyleTag({ content:
      ".doors .door .hook,.doors .door h3,.doors .door .link-arrow{visibility:hidden !important}" });
    await page.waitForTimeout(200);
    const { data, info } = await sharp(await page.screenshot())
      .ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    for (const t of targets) {
      if (t.y < 0 || t.y + t.h > height || t.w < 2) {
        results.push({ ...t, vp: `${width}x${height}`, skipped: true });
        continue;
      }
      const [r, g, b] = t.color.match(/\d+/g).slice(0, 3).map(Number);
      const fg = lum(r, g, b), ratios = [];
      for (let py = Math.floor(t.y); py < Math.ceil(t.y + t.h); py++) {
        for (let px = Math.floor(t.x); px < Math.ceil(t.x + t.w); px++) {
          if (px < 0 || py < 0 || px >= info.width || py >= info.height) continue;
          const o = (py * info.width + px) * info.channels;
          ratios.push(contrast(fg, lum(data[o], data[o + 1], data[o + 2])));
        }
      }
      if (!ratios.length) continue;
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

console.log(`\nscrim: ${useRail ? "THE RAIL'S RAMP (--rail)" : "as shipped"}\n`);
for (const r of results) {
  if (r.skipped) { console.log(`  ${r.vp.padEnd(9)} ${r.door.padEnd(16)} ${r.sel.padEnd(12)} skipped (off screen)`); continue; }
  console.log(`  ${r.vp.padEnd(9)} ${r.door.padEnd(16)} ${r.sel.padEnd(12)} ` +
    `${String(Math.round(r.fontPx) + "px").padEnd(5)} ${(r.large ? "large" : "small").padEnd(5)} ` +
    `need ${String(r.need).padEnd(3)} worst2% ${r.worst.toFixed(2).padStart(6)}  ${r.pass ? "pass" : "*** FAIL ***"}`);
}
const measured = results.filter(r => !r.skipped);
const fails = measured.filter(r => !r.pass);
const tightest = measured.reduce((a, b) => (a.worst - a.need) <= (b.worst - b.need) ? a : b);
console.log(`\n${measured.length - fails.length}/${measured.length} clear.` +
  `  tightest: ${tightest.door} ${tightest.sel} @ ${tightest.vp} — ` +
  `${tightest.worst.toFixed(2)} against ${tightest.need} (margin ${(tightest.worst - tightest.need).toFixed(2)})`);
if (fails.length) { console.log(`\n${fails.length} FAILING.`); process.exitCode = 1; }
