/* Compose a landscape photograph into one of section 05's 4:5 cards.
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
 *      then: node tools/encode-plate.mjs /tmp/gut.png images/boost/gut-estradiol-figure-1200 1200
 *
 * Needs: npm install sharp
 *
 * WHY THIS EXISTS. 05's cards are 4:5 with the copy zone COMPOSED INTO THE FRAME, and the
 * stylesheet says so in capitals: cover-cropping a landscape plate into them throws the copy
 * zone away and puts ink back on a photograph. The porcelain plates satisfied that by being
 * born on ivory — the object floated, the lower half was already empty, and there was nothing
 * to compose. A photograph with a real background of its own cannot do that, so the empty
 * lower half has to be BUILT: the picture takes a band across the top and dissolves into the
 * page, and the copy lands on --ivory with nothing under it.
 *
 * THE THREE NUMBERS, AND WHY THEY ARE THESE NUMBERS.
 *
 *   BAND_H 760 of 1500 (50.7%) — the porcelain pair's subjects ended at 54–55% of the card
 *   and that proportion is what 05 reads as. It is ALSO the most a 16:9 master can give
 *   without a damaging crop: a taller band means a narrower one, and at 820 the Energy
 *   master's crop reaches x=1375 and cuts the tablet in half. 760 costs it 188px of outer
 *   coat and nothing else.
 *
 *   FEATHER 110 — measured, not chosen. The masters' bottom edges are #BEA78E (Gut) and
 *   #DBCCC0 (Energy) against #FAF7F1, so a hard cut draws a horizon line across the card,
 *   and 44px still showed it on the darker Gut plate. 110 dissolves both. It is also the
 *   ceiling: the Energy master's mitochondrion bottoms out at 93.6% of its own height, i.e.
 *   y≈720 in the band, so a feather starting below y=650 is what keeps its lower rim reading
 *   as a glow rather than as an erasure.
 *
 *   IVORY #FAF7F1 — --ivory, which is both the card fill and the section ground. The band
 *   fades to the SAME value the card already is, so the plate has no edge of its own; see
 *   the "NO mix-blend-mode HERE" note in the stylesheet for what happens when it does not.
 *
 * ⚠️ THE COPY ZONE IS 740px AND IT IS NOT DECORATION. Measured against the shipped layout,
 * the copy block clears the band by 223px at 1440 and 72px at 390 — the phone is the tight
 * one, as always. A longer programme name or a third line of body copy eats that 72 first.
 * If the copy ever grows, re-run tools/qa/boost-contrast.mjs before assuming it still clears.
 *
 * ⚠️ THIS IS NOT THE LAST STEP. Encode with tools/encode-plate.mjs (new basename, never an
 * overwrite — BRAND.md), point the <picture> at it, delete the retired pair, then measure:
 *      node tools/qa/boost-contrast.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const CARD_W = 1200, CARD_H = 1500, BAND_H = 760, FEATHER = 110;
const IVORY = [0xFA, 0xF7, 0xF1];
const EDGES = ["right", "left", "bottom", "top"];

const [master, out, trim] = process.argv.slice(2);
if (!master || !out || !EDGES.includes(trim)) {
  console.error(`usage: node tools/compose-boost-plate.mjs <master> <out.png> <${EDGES.join("|")}>`);
  process.exit(2);
}
if (!fs.existsSync(master)) { console.error(`no such master: ${master}`); process.exit(2); }

const meta = await sharp(master).metadata();
const want = CARD_W / BAND_H;
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
  .resize(CARD_W, BAND_H, { fit: "fill" })
  .removeAlpha().raw().toBuffer({ resolveWithObject: true });

// Lerp toward ivory rather than compositing an alpha ramp: the destination is a flat ivory
// field, so the two are identical, and this keeps the plate at three channels throughout.
for (let y = BAND_H - FEATHER; y < BAND_H; y++) {
  const t = (y - (BAND_H - FEATHER)) / FEATHER;
  const a = 1 - t * t * (3 - 2 * t);                       // smoothstep, 1 -> 0
  for (let x = 0; x < CARD_W; x++) {
    const i = (y * CARD_W + x) * 3;
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * a + IVORY[c] * (1 - a));
  }
}

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
await sharp({ create: { width: CARD_W, height: CARD_H, channels: 3,
    background: { r: IVORY[0], g: IVORY[1], b: IVORY[2] } } })
  .composite([{ input: data, raw: { width: CARD_W, height: BAND_H, channels: 3 }, top: 0, left: 0 }])
  .png().toFile(out);

const lost = trim === "right" || trim === "left" ? meta.width - width : meta.height - height;
const axis = trim === "right" || trim === "left" ? meta.width : meta.height;
console.log(`\n  master  ${master}`);
console.log(`          ${meta.width}x${meta.height}  aspect ${srcAspect.toFixed(3)}`);
console.log(`  crop    ${width}x${height}   ${lost}px off the ${trim} (${(lost / axis * 100).toFixed(1)}%)`);
console.log(`  plate   ${out}   ${CARD_W}x${CARD_H}  band ${BAND_H} + feather ${FEATHER}, copy zone ${CARD_H - BAND_H}px`);
console.log(`\n  next: node tools/encode-plate.mjs ${out} images/boost/<new-basename>-1200 1200`);
console.log(`        then the <picture>, then node tools/qa/boost-contrast.mjs\n`);
