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
 *      then: node tools/encode-plate.mjs /tmp/gut.png images/boost/gut-…-1200x760 1200
 *
 * Needs: npm install sharp
 *
 * WHY THIS EXISTS. The output is a straight 1200x760 crop of the master. One number, and it
 * is not taste: the card's picture is an IN-FLOW element whose height is its own, so 1.579
 * IS the band's shape at every width and nothing crops it afterwards. 1.579 is also the most
 * a 16:9 master gives before the crop turns damaging — at 1.463 the Energy crop reaches
 * x=1375 and cuts the tablet in half; at 1.579 it costs 188px of outer coat and nothing else.
 * The Gut master gives it up for 18px off the bottom.
 *
 * ⚠️ THERE IS NO FEATHER, AND PUTTING ONE BACK IS THE MISTAKE THIS PARAGRAPH EXISTS TO STOP.
 * Two earlier versions dissolved the band's bottom 44px, then 110px, into --ivory. That was
 * right while the plate carried its own copy zone: the fade had to hide a horizon line
 * *inside* the picture. Once the caption became its own block below the picture, the same
 * fade started reading as a bad mask instead — his word was "cutout". It is worth
 * understanding why, because it is a property of these two photographs and not of fades in
 * general: BOTH have subjects that run off the bottom edge. Fading a frame whose content
 * stops inside it looks like mist; fading one through a shin, a hand and a lab coat looks
 * like the limbs evaporated. A hard edge cuts them, which is what a photograph's edge is for.
 *
 * ⚠️ IT NO LONGER BUILDS A COPY ZONE EITHER. The first version emitted a 1200x1500 card with
 * 740px of ivory beneath the band, because the card was `aspect-ratio:4/5` with
 * `object-fit:cover` and the copy zone had to be part of the photograph. That zone could only
 * be right at one width: the copy block is near-constant in CSS px (86–112) while the card
 * scales with the column, so the air under it measured 82px at 390 and 214px at 1440 — his
 * "all that white". The card derives its height now, so the zone is layout rather than
 * pixels. Between them these two changes make the plate a plain photograph again, which is
 * the whole reason a swap is now a crop and an encode rather than a composition.
 *
 * ⚠️ THIS IS NOT THE LAST STEP. Encode with tools/encode-plate.mjs (new basename, never an
 * overwrite — BRAND.md), point the <picture> at it, delete the retired pair, then measure:
 *      node tools/qa/boost-contrast.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BAND_W = 1200, BAND_H = 760;
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

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
await sharp(master)
  .extract({ left, top, width, height })
  .resize(BAND_W, BAND_H, { fit: "fill" })
  .removeAlpha().png().toFile(out);

const lost = trim === "right" || trim === "left" ? meta.width - width : meta.height - height;
const axis = trim === "right" || trim === "left" ? meta.width : meta.height;
console.log(`\n  master  ${master}`);
console.log(`          ${meta.width}x${meta.height}  aspect ${srcAspect.toFixed(3)}`);
console.log(`  crop    ${width}x${height}   ${lost}px off the ${trim} (${(lost / axis * 100).toFixed(1)}%)`);
console.log(`  band    ${out}   ${BAND_W}x${BAND_H}  hard edges, no feather`);
console.log(`\n  next: node tools/encode-plate.mjs ${out} images/boost/<new-basename>-1200 1200`);
console.log(`        then the <picture>, then node tools/qa/boost-contrast.mjs\n`);
