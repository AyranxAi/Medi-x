#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────────
   third-colour.mjs — derives and re-measures --deep, the peptide page's ONE
   added colour (round 12, 2026-08-16).

   WHY THIS EXISTS. --deep is not a picked hex. It is the champagne's complement
   taken at the burgundy's own weight, and every figure quoted in the stylesheet
   comes out of this file. If --gold, --burgundy or --deep is ever touched, run
   this and paste the table back into peptide-therapy/index.html — do not
   re-measure by eye, and do not adjust a number in a comment without re-running.

     node tools/qa/third-colour.mjs

   ⚠️ THE ONE RULE THIS ENCODES: chroma may clip to gamut, LIGHTNESS MAY NOT.
   Relative luminance in XYZ is a pure function of L*, so holding L* holds every
   WCAG ratio exactly; the only error left is 8-bit rounding. Gamut relief
   therefore takes chroma and never lightness — which is why the clipped --deep
   still measures what the table says it measures.
   ───────────────────────────────────────────────────────────────────────────── */

const f = x => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
const g = x => x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const rgb2hex = r => '#' + r.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255)
  .toString(16).padStart(2, '0').toUpperCase()).join('');
const W = [0.95047, 1, 1.08883];
const M = [[.4124564, .3575761, .1804375], [.2126729, .7151522, .0721750], [.0193339, .1191920, .9503041]];
const Mi = [[3.2404542, -1.5371385, -.4985314], [-.9692660, 1.8760108, .0415560], [.0556434, -.2040259, 1.0572252]];

function lch(hex) {
  const [r, gg, b] = hex2rgb(hex).map(f);
  const xyz = M.map(o => o[0] * r + o[1] * gg + o[2] * b).map((v, i) => v / W[i]);
  const t = v => v > 216 / 24389 ? Math.cbrt(v) : (24389 / 27 * v + 16) / 116;
  const [fx, fy, fz] = xyz.map(t), L = 116 * fy - 16, a = 500 * (fx - fy), bb = 200 * (fy - fz);
  let h = Math.atan2(bb, a) * 180 / Math.PI; if (h < 0) h += 360;
  return { L, C: Math.hypot(a, bb), h };
}
function raw(L, C, h) {
  const a = C * Math.cos(h * Math.PI / 180), bb = C * Math.sin(h * Math.PI / 180);
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - bb / 200;
  const ti = v => v ** 3 > 216 / 24389 ? v ** 3 : (116 * v - 16) * 27 / 24389;
  return Mi.map(o => { const xyz = [ti(fx), L > 8 ? ((L + 16) / 116) ** 3 : L * 27 / 24389, ti(fz)]
    .map((v, i) => v * W[i]); return o[0] * xyz[0] + o[1] * xyz[1] + o[2] * xyz[2]; });
}
const inG = l => l.every(v => v >= -0.0005 && v <= 1.0005);
function mk(L, C, h) {                       // chroma yields to gamut; L* never does
  if (inG(raw(L, C, h))) return { hex: rgb2hex(raw(L, C, h).map(g)), clipped: false };
  let lo = 0, hi = C;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; inG(raw(L, m, h)) ? lo = m : hi = m; }
  return { hex: rgb2hex(raw(L, lo, h).map(g)), clipped: true, C: lo };
}
const lum = hex => { const [r, gg, b] = hex2rgb(hex).map(f); return .2126 * r + .7152 * gg + .0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };

/* BRAND.md — the only inputs. Change these only if BRAND.md changes. */
const GOLD = '#C2A05E', BURGUNDY = '#5C1F31', IVORY = '#FAF7F1',
      ROSE = '#C79A92', STONE = '#B09A9C', INK = '#2E2228';

const champ = lch(GOLD), bur = lch(BURGUNDY);
const hue = (champ.h + 180) % 360;                    // the champagne's complement
const deep = mk(bur.L, bur.C, hue);                   // at the burgundy's own weight
const mid  = mk(bur.L - 6, bur.C * .95, hue);         // RECESSED, not lifted — see below
const line = mk(bur.L + 12, bur.C * .85, hue);
const glow = mk(bur.L + 14, bur.C, hue);
/* ⚠️ BG_A KEEPS ITS OWN LIGHTNESS, NOT --ink's. The scene's canvas floor has always been
   a shade below the stage — the warm original was #2A1B20 at L* 11.8, which is DARKER
   than --ink's 14.8. Deriving it from --ink lifts the floor above where it has always sat
   and flattens the gradient the scene rises through. Take the floor's own numbers. */
const BG_A_WARM = '#2A1B20';
const bgA  = mk(lch(BG_A_WARM).L, lch(BG_A_WARM).C, hue);

const p = (n, d = 2) => n.toFixed(d);
console.log(`\n--gold ${GOLD} sits at h${p(champ.h, 1)}° → complement h${p(hue, 1)}°`);
console.log(`--burgundy ${BURGUNDY} gives the weight: L* ${p(bur.L, 1)}  C* ${p(bur.C, 1)}\n`);
console.log('  token         value      note');
for (const [n, v, note] of [
  ['--deep', deep, 'the stage, the turn band'],
  ['--deep-mid', mid, 'recessed base / step strip'],
  ['--deep-line', line, 'hairline on the deep'],
  ['--deep-glow', glow, "the scene's light"],
  ['BG_A (script)', bgA, 'canvas floor — [' + hex2rgb(bgA.hex).map(v => Math.round(v * 255)).join(',') + ']'],
]) console.log('  ' + n.padEnd(14) + v.hex + '    ' + note + (v.clipped ? '   (chroma clipped to ' + p(v.C, 1) + '; L* held)' : ''));

console.log('\n  pair                              ratio   floor');
let bad = 0;
for (const [n, fg, bg, floor] of [
  ['ivory copy on the stage', IVORY, deep.hex, 4.5],
  ['the champagne beat on the stage', GOLD, deep.hex, 4.5],
  ['rose italics on the stage', ROSE, deep.hex, 4.5],
  ['stone beads on the stage', STONE, deep.hex, 4.5],
  ['ivory on the recessed strip', IVORY, mid.hex, 4.5],
  ['the champagne on the strip', GOLD, mid.hex, 4.5],
  ['ivory on the canvas floor', IVORY, bgA.hex, 4.5],
  ['hairline against the deep', line.hex, deep.hex, 1.15],
]) {
  const r = ratio(fg, bg); if (r < floor) bad++;
  console.log('  ' + n.padEnd(34) + p(r).padStart(5) + '   ' + floor + (r < floor ? '   ⚠ BELOW' : ''));
}

/* ⚠️ --deep and --burgundy share a lightness ON PURPOSE, so they carry equal weight and
   their luminance ratio is 1.00 by construction. That is not a defect and it is not a
   legibility test — the thing that has to hold is that they separate by HUE. */
const d = Math.abs(hue - bur.h) % 360, sep = Math.min(d, 360 - d);
console.log(`\n  hue separation from the burgundy  ${p(sep, 0).padStart(4)}°   30°` + (sep < 30 ? '   ⚠ BELOW' : ''));
console.log(`  luminance vs the burgundy         ${p(ratio(deep.hex, BURGUNDY))}    by design`);
console.log('\n' + (bad ? `⚠ ${bad} PAIR(S) BELOW FLOOR` : 'all clear') + '\n');

/* ⚠️ WHY --deep-mid IS RECESSED AND NOT LIFTED. The obvious move is to lift the step
   strip above the stage. Measured, that puts the champagne at 3.55:1 on it — a gold
   label over a lifted surface is the trap. Recessed, it reads as foundation and the
   champagne clears at ~6:1. Do not "tidy" the minus sign out of bur.L - 6. */
process.exit(bad ? 1 : 0);
