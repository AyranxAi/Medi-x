/* Section 08 contrast harness — BRAND.md's method, for the discovery-call frame.
 *
 *   node tools/qa/final-contrast.mjs           measure the shipped section
 *   node tools/qa/final-contrast.mjs --shots   also write a PNG of each measured frame
 *
 * Needs: npm install playwright sharp
 *
 * WHY THIS EXISTS. It was written the afternoon 08 became a full-bleed photograph with a
 * scrim, because the moment copy sits ON a photograph a colour change is a re-measurement
 * rather than a src change. 08 is now a small ivory call strip and the copy sits on a FLAT
 * ground, so the numbers below are easy ones — and the harness is kept anyway, for two
 * reasons. It is the guard on the two values that are NOT easy: the red em, which is the
 * page's accent on a near-white and clears 4.5 by about three; and the pill, which is the
 * tightest control here at 5.45. And 08 has taken three shapes in one day — flat burgundy,
 * photo-and-scrim, ivory strip — so the next change is likelier than not.
 * ⚠️ IF 08 GOES BACK TO A PHOTOGRAPH, this file needs nothing: same selectors, same method.
 * The one thing to re-check by hand is that .final h2 is still the headline element.
 *
 * ⚠️ THE LANDING PAGE ALREADY FAILED ON THIS EXACT FRAME, which is the reason to run it
 * rather than trust the render. Its own note reads: "this frame is bright right where the
 * headline sits", measured at worst-2% 1.99 and median 3.86 at 390 against a 3.0 floor.
 * A scrim tuned on the desktop landscape crop will pass there and fail on the phone
 * portrait one, because they are DIFFERENT PHOTOGRAPHS, not two crops of one.
 *
 * SAME METHOD AS boost-contrast.mjs / door-contrast.mjs: render, hide the copy, sample the
 * ground behind each copy rectangle, take the worst 2% of pixels, require 4.5:1 for small
 * text and 3:1 for large. Three controls x three viewports = nine.
 *
 * ⚠️ THE BUTTON IS A PILL, NOT A RUN OF TEXT, AND MEASURING IT AS TEXT REPORTS 1.00.
 * .btn.on-dark fills with rgba(250,247,241,.94) and sets its label in --burgundy, so the
 * label never touches the photograph — it touches the fill. The first version of this
 * harness hid the whole button and compared the burgundy LABEL against the burgundy SCRIM
 * behind it, which is the same colour, and duly reported 1.00 at both viewports. That is
 * the "near-1.0 is not a failure, it is a bug in the measurement" case, caught on its own
 * first run. So the pill is measured in mode:"pill" — the fill is composited over whatever
 * the photograph puts behind it (that 6% of alpha is real, and a bright frame lifts it),
 * and the label is measured against THAT. The floor is 4.5: the label is 13px.
 *
 * ⚠️ HIDE THE CHILDREN TOO — an h2 hidden by `visibility` hides its em, but a later, more
 * specific rule can bring it back and you end up measuring the rose italic against itself
 * and reporting 1.00. A near-1.0 ratio is almost never a real failure; it means the
 * foreground and the background are the same pixels.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = 8132;
const PAGE = `http://localhost:${PORT}/hormone-balancing/index.html?probe=1`;
/* ⚠️ 820 IS NOT PADDING OUT THE TABLE, IT IS THE THIRD LAYOUT. The picture switches to the
   portrait frame at 899px and the scrim flips with it, so a tablet is running the phone's
   photograph at nearly twice its width — a case neither of the other two rows covers. */
const VIEWPORTS = [[1440, 900], [820, 1180], [390, 844]];
const CONTROLS = [
  { sel: ".final h2",    mode: "text" },
  { sel: ".final h2 em", mode: "text" },
  { sel: ".final .btn",  mode: "pill" },
];
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

/* the button hides as a whole — its label and its fill are one object */
const HIDE = ".final h2,.final h2 em,.final .btn{visibility:hidden !important}";

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
});
const results = [];

for (const [width, height] of VIEWPORTS) {
  for (const { sel, mode } of CONTROLS) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(PAGE, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);

    /* scroll first, settle, THEN read the rect — the photograph is lazy and the section is
       the last on the page, so a rect read mid-scroll points at the FAQ */
    await page.evaluate(s => document.querySelector(s).scrollIntoView({ block: "center" }), sel);
    await page.waitForTimeout(700);

    const t = await page.evaluate(s => {
      const el = document.querySelector(s);
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      const px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
      return { sel: s, x: r.x, y: r.y, w: r.width, h: r.height, color: cs.color,
        fill: cs.backgroundColor, fontPx: px,
        large: px >= 24 || (bold && px >= 18.66) };
    }, sel);
    t.mode = mode;

    if (t.y < 0 || t.y + t.h > height || t.w < 2) {
      results.push({ ...t, vp: `${width}x${height}`, skipped: true });
      await page.close(); continue;
    }

    await page.addStyleTag({ content: HIDE });
    await page.waitForTimeout(200);
    const png = await page.screenshot();
    if (SHOTS) fs.writeFileSync(
      path.join(ROOT, `final-${width}-${t.sel.replace(/\W+/g, "")}.png`), png);
    const { data, info } = await sharp(png).ensureAlpha().raw()
      .toBuffer({ resolveWithObject: true });

    const parts = t.color.match(/[\d.]+/g).map(Number);
    const [fr, fgc, fb] = parts, alpha = parts.length > 3 ? parts[3] : 1;
    /* mode:"pill" — the label does not sit on the photograph, it sits on the button's own
       fill, which is itself translucent over the photograph. Composite once, then measure. */
    const fillParts = t.mode === "pill" ? t.fill.match(/[\d.]+/g).map(Number) : null;
    const ratios = [];
    for (let py = Math.floor(t.y); py < Math.ceil(t.y + t.h); py++) {
      for (let px = Math.floor(t.x); px < Math.ceil(t.x + t.w); px++) {
        if (px < 0 || py < 0 || px >= info.width || py >= info.height) continue;
        const o = (py * info.width + px) * info.channels;
        let br = data[o], bg = data[o + 1], bb = data[o + 2];
        if (fillParts) {
          const fa = fillParts.length > 3 ? fillParts[3] : 1;
          br = fa * fillParts[0] + (1 - fa) * br;
          bg = fa * fillParts[1] + (1 - fa) * bg;
          bb = fa * fillParts[2] + (1 - fa) * bb;
        }
        const eff = alpha === 1 ? lum(fr, fgc, fb)
          : lum(alpha * fr + (1 - alpha) * br,
                alpha * fgc + (1 - alpha) * bg,
                alpha * fb + (1 - alpha) * bb);
        ratios.push(contrast(eff, lum(br, bg, bb)));
      }
    }
    ratios.sort((a, b) => a - b);
    const worst = ratios[Math.max(0, Math.floor(ratios.length * 0.02) - 1)];
    const median = ratios[Math.floor(ratios.length / 2)];
    const need = t.large ? 3 : 4.5;
    results.push({ ...t, vp: `${width}x${height}`, worst, median, need, pass: worst >= need });
    await page.close();
  }
}

console.log("\nsection 08 — the call strip, as shipped\n");
let fails = 0;
for (const r of results) {
  if (r.skipped) { console.log(`  ${r.vp.padEnd(9)} ${r.sel.padEnd(16)} skipped (off-screen)`); continue; }
  if (!r.pass) fails++;
  console.log(`  ${r.vp.padEnd(9)} ${r.sel.padEnd(16)} ${String(Math.round(r.fontPx)).padStart(3)}px  ` +
    `${(r.large ? "large" : "small").padEnd(5)} need ${String(r.need).padEnd(3)} ` +
    `worst2% ${r.worst.toFixed(2).padStart(6)}  median ${r.median.toFixed(2).padStart(6)}  ` +
    (r.pass ? "pass" : "FAIL"));
}
const scored = results.filter(r => !r.skipped);
const tight = scored.slice().sort((a, b) => (a.worst - a.need) - (b.worst - b.need))[0];
console.log(`\n${scored.length - fails}/${scored.length} clear.` +
  (tight ? `  tightest: ${tight.sel} @ ${tight.vp} — ${tight.worst.toFixed(2)} against ${tight.need} ` +
           `(margin ${(tight.worst - tight.need).toFixed(2)})` : ""));

await browser.close();
server.close();
process.exit(fails ? 1 : 0);
