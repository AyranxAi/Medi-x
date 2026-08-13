/* Cut a landscape photograph into section 05's band.
 *
 *   node tools/compose-boost-plate.mjs <master> <out.png> <trim-edge>
 *
 *   trim-edge = right | left | bottom | top   — which edge loses pixels to reach the
 *   band's aspect. There is no "centre" option on purpose: on both plates shipped so
 *   far the thing that must survive sits hard against one edge (the estradiol ball
 *   model on the Gut master's left, the adenine ring on the Energy master's), and a
 *   centre crop clips it.
 *
 * e.g. node tools/compose-boost-plate.mjs archive/sources/boost-gut-estradiol-figure-master.png \
 *        /tmp/gut.png bottom
 *      then: node tools/encode-plate.mjs /tmp/gut.png images/boost/gut-…-band-1200 1200
 *
 * Needs: npm install sharp
 *
 * WHY THIS EXISTS. The output is 1200x760 with its bottom 110px dissolved into --ivory. Both
 * numbers are the point, and neither is taste.
 *
 *   1200x760 (aspect 1.579) — the card's picture is now an IN-FLOW element whose height is
 *   its own, so this aspect IS the band's height at every width and nothing crops it. 1.579
 *   is the most a 16:9 master gives before the crop turns damaging: at 1.463 the Energy
 *   crop reaches x=1375 and cuts the tablet in half; at 1.579 it costs 188px of outer coat
 *   and nothing else. The Gut master gives it up for 18px off the bottom.
 *
 *   FEATHER 110 — measured. The masters' bottom edges are #BEA78E (Gut) and #DBCCC0
 *   (Energy) against #FAF7F1, so a hard cut draws a horizon line straight above the copy,
 *   and 44px still showed it on the darker Gut plate. 110 dissolves both. It is also the
 *   ceiling: the Energy master's mitochondrion bottoms out at 93.6% of its own height, i.e.
 *   y≈720 of 760, so a feather reaching above y=650 erases its lower rim instead of
 *   softening it.
 *
 *   IVORY #FAF7F1 — --ivory, which is the card fill the copy then sits on. The band fades to
 *   the exact value of the thing underneath it, so the picture has no edge of its own and
 *   the copy has no picture under it. See the "NO mix-blend-mode HERE" note in the CSS.
 *
 * ⚠️ IT NO LONGER BUILDS A COPY ZONE, AND THAT IS THE 08-13-LATE CHANGE. The first version
 * of this script emitted a 1200x1500 card with 740px of ivory beneath the band, because the
 * card was `aspect-ratio:4/5` with `object-fit:cover` and the copy zone had to be part of the
 * photograph. That zone could only be right at one width: the copy block is near-constant in
 * CSS px (86–112) while the card scales with the column, so the air under it measured 82px at
 * 390 and 214px at 1440 — his "all that white". The card now derives its height from the band
 * plus the copy, so the zone is layout rather than pixels and is correct everywhere by
 * construction. Nothing here needs re-tuning when the copy changes length.
 *
 * ⚠️ THIS IS NOT THE LAST STEP. Encode with tools/encode-plate.mjs (new basename, never an
 * overwrite — BRAND.md), point the <picture> at it, delete the retired pair, then measure:
 *      node tools/qa/boost-contrast.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BAND_W = 1200, BAND_H = 760, FEATHER = 110;
const IVORY = [0xFA, 0xF7, 0xF1];
const EDGES = ["right", "left", "bottom", "top"];

const [master, out, trim] = process.argv.slice(2);
if (!master || !out || !EDGES.includes(trim)) {
  console.error(`usage: node tools/compose-boost-plate.mjs <master> <out.png> <${EDGES.join("|")}>`);
  process.exit(2);
}
if (!fs.existsSync(master)) { console.error(`no such master: ${master}`); process.exit(2); }

const meta = await sharp(master).metadata();
const want = BAND_W / BAND_H;
const srcAspect = meta.width / meta.height;

// Trim ONE edge down to the band's aspect. Trimming the wrong axis is a usage error, not
// something to silently reinterpret — a "bottom" on an already-too-tall master would crop
// the axis the caller was trying to protect.
let left = 0, top = 0, width = meta.width, height = meta.height;
if (srcAspect > want) {
  if (trim !== "right" && trim !== "left") {
    console.error(`master is too WIDE for the band (${srcAspect.toFixed(3)} > ${want.toFixed(3)}) — trim right or left`);
    process.exit(1);
  }
  width = Math.round(meta.height * want);
  if (trim === "left") left = meta.width - width;
} else {
  if (trim !== "bottom" && trim !== "top") {
    console.error(`master is too TALL for the band (${srcAspect.toFixed(3)} < ${want.toFixed(3)}) — trim bottom or top`);
    process.exit(1);
  }
  height = Math.round(meta.width / want);
  if (trim === "top") top = meta.height - height;
}

const { data } = await sharp(master)
  .extract({ left, top, width, height })
  .resize(BAND_W, BAND_H, { fit: "fill" })
  .removeAlpha().raw().toBuffer({ resolveWithObject: true });

// Lerp toward ivory rather than compositing an alpha ramp: the card underneath is a flat
// ivory field, so the two are identical, and this keeps the plate at three channels.
for (let y = BAND_H - FEATHER; y < BAND_H; y++) {
  const t = (y - (BAND_H - FEATHER)) / FEATHER;
  const a = 1 - t * t * (3 - 2 * t);                       // smoothstep, 1 -> 0
  for (let x = 0; x < BAND_W; x++) {
    const i = (y * BAND_W + x) * 3;
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * a + IVORY[c] * (1 - a));
  }
}

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
await sharp(data, { raw: { width: BAND_W, height: BAND_H, channels: 3 } }).png().toFile(out);

const lost = trim === "right" || trim === "left" ? meta.width - width : meta.height - height;
const axis = trim === "right" || trim === "left" ? meta.width : meta.height;
console.log(`\n  master  ${master}`);
console.log(`          ${meta.width}x${meta.height}  aspect ${srcAspect.toFixed(3)}`);
console.log(`  crop    ${width}x${height}   ${lost}px off the ${trim} (${(lost / axis * 100).toFixed(1)}%)`);
console.log(`  band    ${out}   ${BAND_W}x${BAND_H}  feather ${FEATHER} into #FAF7F1`);
console.log(`\n  next: node tools/encode-plate.mjs ${out} images/boost/<new-basename>-1200 1200`);
console.log(`        then the <picture>, then node tools/qa/boost-contrast.mjs\n`);
