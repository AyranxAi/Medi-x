/* Service-orb contrast harness — BRAND.md's method, automated.
 *
 *   node tools/qa/door-contrast.mjs
 *
 * Needs: npm install playwright@1.49.1 sharp
 *
 * WHY THIS EXISTS. Section 04's titles sit inside three glass renders with different
 * transparency masks; the hooks and Explore rows sit on ivory below them. Each control
 * must be checked against its own rendered ground at both production viewports.
 *
 * THE METHOD, from BRAND.md: render, hide the copy, sample the ground behind each rendered
 * line (not the heading container's empty side space), take the worst 2% of pixels, and
 * require 4.5:1 for small text and 3:1 for large. Worst 2% rather than the mean, because a
 * mean passes comfortably over a photograph that has a bright highlight through one line.
 *
 * ⚠️ Run this after ANY change to an orb, its glass mask, title scrim or copy colour.
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
    /* Centre the lowest control. The complete square orb plus its supporting copy fits
       inside both measured viewports, so this also keeps the in-orb heading visible. */
    await page.evaluate(k => {
      const d = document.querySelectorAll(".doors .door")[k];
      (d.querySelector(".link-arrow") || d).scrollIntoView({ block: "center" });
    }, i);
    await page.waitForTimeout(600);

    const targets = await page.evaluate(([k, sels]) => {
      const door = document.querySelectorAll(".doors .door")[k];
      return sels.flatMap(sel => {
        const el = door.querySelector(sel);
        if (!el) return [];
        const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
        const sampleRects = sel === "h3"
          ? [...el.querySelectorAll("span")].map(span => {
              const range = document.createRange();
              range.selectNodeContents(span);
              const sr = range.getBoundingClientRect();
              return { x: sr.x, y: sr.y, w: sr.width, h: sr.height };
            })
          : [{ x: r.x, y: r.y, w: r.width, h: r.height }];
        const px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
        return [{ door: door.className.replace(/\bdoor\b\s*/, "").trim() || `#${k + 1}`,
          sel, x: r.x, y: r.y, w: r.width, h: r.height, color: cs.color, fontPx: px,
          sampleRects, large: px >= 24 || (bold && px >= 18.66) }];
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
      /* ⚠️ THE ALPHA IS PART OF THE COLOUR. getComputedStyle gives "rgba(250, 247, 241, 0.62)"
         for any semi-transparent copy, and taking only the first three numbers measures it as
         if it were fully opaque — which reports a contrast the reader never gets, always in
         the flattering direction. Semi-transparent text is composited against whatever is
         behind it, so the effective foreground has to be blended per sampled pixel. Browsers
         composite in sRGB, so the mix happens on the 0–255 values, before luminance. */
      const parts = t.color.match(/[\d.]+/g).map(Number);
      const [fr, fgc, fb] = parts, alpha = parts.length > 3 ? parts[3] : 1;
      const ratios = [];
      for (const sample of t.sampleRects) {
       for (let py = Math.floor(sample.y); py < Math.ceil(sample.y + sample.h); py++) {
        for (let px = Math.floor(sample.x); px < Math.ceil(sample.x + sample.w); px++) {
          if (px < 0 || py < 0 || px >= info.width || py >= info.height) continue;
          const o = (py * info.width + px) * info.channels;
          const br = data[o], bg = data[o + 1], bb = data[o + 2];
          const eff = alpha === 1
            ? lum(fr, fgc, fb)
            : lum(alpha * fr + (1 - alpha) * br,
                  alpha * fgc + (1 - alpha) * bg,
                  alpha * fb + (1 - alpha) * bb);
          ratios.push(contrast(eff, lum(br, bg, bb)));
        }
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

console.log("\nservice orbs: as shipped\n");
for (const r of results) {
  if (r.skipped) { console.log(`  ${r.vp.padEnd(9)} ${r.door.padEnd(16)} ${r.sel.padEnd(12)} skipped (off screen)`); continue; }
  console.log(`  ${r.vp.padEnd(9)} ${r.door.padEnd(16)} ${r.sel.padEnd(12)} ` +
    `${String(Math.round(r.fontPx) + "px").padEnd(5)} ${(r.large ? "large" : "small").padEnd(5)} ` +
    `need ${String(r.need).padEnd(3)} worst2% ${r.worst.toFixed(2).padStart(6)}  ${r.pass ? "pass" : "*** FAIL ***"}`);
}
const measured = results.filter(r => !r.skipped);
const skipped = results.filter(r => r.skipped);
const fails = measured.filter(r => !r.pass);
/* ⚠️ A SKIP IS A FAILURE OF THE HARNESS, NOT A PASS. Left silent, this script once reported
   "15/15 clear" while three controls had scrolled out of frame unmeasured. */
if (skipped.length) {
  console.log(`\n${skipped.length} control(s) NOT MEASURED — fix the scroll, do not trust this run.`);
  process.exitCode = 1;
}
const tightest = measured.reduce((a, b) => (a.worst - a.need) <= (b.worst - b.need) ? a : b);
console.log(`\n${measured.length - fails.length}/${measured.length} clear.` +
  `  tightest: ${tightest.door} ${tightest.sel} @ ${tightest.vp} — ` +
  `${tightest.worst.toFixed(2)} against ${tightest.need} (margin ${(tightest.worst - tightest.need).toFixed(2)})`);
if (fails.length) { console.log(`\n${fails.length} FAILING.`); process.exitCode = 1; }
