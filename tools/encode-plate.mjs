/* Encode a photographic master into the pair the page actually serves.
 *
 *   node tools/encode-plate.mjs <master> <out-basename> [width]
 *
 * e.g. node tools/encode-plate.mjs images/gut-gold.png images/boost/gut-gold-1340 1340
 *      -> images/boost/gut-gold-1340.avif  +  images/boost/gut-gold-1340.webp
 *
 * Needs: npm install sharp
 *
 * WHY THIS EXISTS. Every plate that has landed in this repo was hand-encoded, and the
 * handoff carries the consequences: a plate that arrived as
 * "ChatGPT Image Aug 12, 2026, 12_32_28 PM.png", a plate at the wrong aspect that would
 * have been STRETCHED rather than cropped because the CSS had no object-fit, and a pair of
 * retired files that had to be deleted by hand. Three steps that should be one command.
 *
 * ⚠️ NEW FILENAMES, NEVER AN OVERWRITE — BRAND.md's rule, and the reason is caching: a
 * visitor holding the old file keeps being served the old picture. This script REFUSES to
 * write over an existing basename rather than reminding you afterwards.
 *
 * ⚠️ IT PRINTS THE SOURCE ASPECT AND THE TARGET'S. The boost band is locked to 16:9 and the
 * doors to a panel near 0.75, so `cover` discards whatever does not fit — which is correct,
 * but only if you know it is happening and which part is being thrown away.
 *
 * ⚠️ ENCODING IS NOT THE LAST STEP. If the plate lands anywhere copy sits ON it — 04's doors,
 * 05's diptych — the swap is a contrast RE-MEASUREMENT, not a src change:
 *      node tools/qa/door-contrast.mjs
 *      node tools/qa/boost-contrast.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [master, outBase, widthArg] = process.argv.slice(2);
if (!master || !outBase) {
  console.error("usage: node tools/encode-plate.mjs <master> <out-basename> [width]");
  process.exit(2);
}
const width = Number(widthArg || 1340);
if (!Number.isFinite(width) || width < 16) { console.error("bad width"); process.exit(2); }
if (!fs.existsSync(master)) { console.error(`no such master: ${master}`); process.exit(2); }

const avif = `${outBase}.avif`, webp = `${outBase}.webp`;
for (const f of [avif, webp]) {
  if (fs.existsSync(f)) {
    console.error(`refusing to overwrite ${f}\n` +
      "BRAND.md: a replacement plate takes a NEW filename, so no cache can serve the old one.");
    process.exit(1);
  }
}
fs.mkdirSync(path.dirname(avif), { recursive: true });

const src = sharp(master);
const meta = await src.metadata();
const srcAspect = meta.width / meta.height;

const pipeline = () => sharp(master).resize({ width, withoutEnlargement: true });
await pipeline().avif({ quality: 62, effort: 6 }).toFile(avif);
await pipeline().webp({ quality: 82 }).toFile(webp);

const kb = f => (fs.statSync(f).size / 1024).toFixed(1) + " KB";
const outMeta = await sharp(avif).metadata();

console.log(`\n  master  ${master}`);
console.log(`          ${meta.width}x${meta.height}  aspect ${srcAspect.toFixed(3)}` +
  (meta.width < width ? `   ⚠️  NARROWER THAN ${width} — not upscaled, output is ${outMeta.width}px` : ""));
console.log(`  avif    ${avif}   ${kb(avif)}`);
console.log(`  webp    ${webp}   ${kb(webp)}`);
console.log(`\n  16:9 band wants 1.778 — this master is ${srcAspect.toFixed(3)}` +
  (Math.abs(srcAspect - 16 / 9) < 0.02
    ? "  (drops in, no crop)"
    : `  (cover will discard ~${Math.round(Math.abs(1 - (16 / 9) / srcAspect) * 100)}% of one axis)`));
console.log("\n  next: point the <picture> at the new basename, delete the retired pair,");
console.log("        and re-measure if copy sits on it — tools/qa/boost-contrast.mjs\n");
