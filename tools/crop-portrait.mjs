/* ═══════════ crop-portrait.mjs — bake a square head-and-shoulders crop ═══════════
   The doctor masters are FULL-BODY studio shots: the head occupies roughly the top
   quarter of the frame, so any small avatar drawn from them renders a ~20px face.
   The page needs two framings of the same person — the whole figure for the 336px
   card, a head-and-shoulders for the ~60–130px contexts — and the honest way to get
   the second is a real asset, not a runtime transform: a baked crop is sharp at 2x,
   needs no per-photo tuning in the stylesheet, and makes the next doctor a file drop.

     node tools/crop-portrait.mjs <src> <out.webp> <sx> <sy> <size> [out-px=400]

   sx/sy/size are in SOURCE pixels — the top-left and the side of the square to lift.
   ⚠️ NEW BASENAME, NEVER AN OVERWRITE (BRAND.md's caching rule). The masters stay
   exactly as uploaded; this only ever writes a new file beside them.
   Uses the repo's own Chromium (Playwright) as the codec — no new dependency. */
import { readFileSync, writeFileSync } from "fs";
import playwright from "playwright";

const [src, out, sx, sy, size, px = "400"] = process.argv.slice(2);
if (!src || !out || !sx) { console.error("usage: crop-portrait.mjs <src> <out> <sx> <sy> <size> [px]"); process.exit(1); }

const b64 = readFileSync(src).toString("base64");
const browser = await playwright.chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
});
const page = await browser.newPage();
const dataUrl = await page.evaluate(async ({ b64, sx, sy, size, px }) => {
  const img = new Image();
  img.src = "data:image/webp;base64," + b64;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = c.height = px;
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.drawImage(img, sx, sy, size, size, 0, 0, px, px);
  return c.toDataURL("image/webp", 0.92);
}, { b64, sx: +sx, sy: +sy, size: +size, px: +px });
await browser.close();

writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
console.log(out, (readFileSync(out).length / 1024).toFixed(1) + " KB", `(${px}x${px} from ${size}px at ${sx},${sy})`);
