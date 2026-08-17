/* ═══════════════════════════════════════════════════════════════════════════════════
   PACK AN ARTIFACT COPY — tools/pack-artifact.mjs
   ═══════════════════════════════════════════════════════════════════════════════════
   Usage:  node tools/pack-artifact.mjs <in.html> <out.html>

   The two-copies rule, automated. The repo copy of a lab loads its fonts from ../fonts and
   three.js from ../vendor; an ARTIFACT runs under a policy that blocks every external host,
   so the copy that goes there has to carry both inside it. bonds-lab has done this by hand
   since round 10b — this is the same job with the steps written down.

   WHAT IT DOES, AND WHY EACH STEP IS THE WAY IT IS:

   1 · FONTS become data: URIs. Nothing clever, but note it rewrites url(../fonts/x.woff2)
       only — a face that ever loads from anywhere else will not be caught, and will fail
       silently as a fallback that looks almost right. The pack REFUSES rather than warns:
       an artifact whose display face silently became Georgia is worse than no artifact.

   2 · three.js becomes a CLASSIC INLINE SCRIPT WITH A GLOBAL. The bundle is an ES module
       whose only module-ness is one trailing `export{A as B, …}` — no imports, no
       import.meta, no top-level await, all three checked below rather than assumed. That
       statement is rewritten to `window.THREE={B:A, …}` and the whole thing emitted as a
       plain <script>, which runs at parse time and therefore BEFORE the deferred module
       that wants it. The page itself already prefers `window.THREE` over its dynamic
       import, so the repo copy and the artifact copy run the same code path.
       ⚠️ A BLOB OR data: MODULE URL IS NOT AN ALTERNATIVE. Artifact CSP may refuse both,
       and the failure mode is a silently missing 3D scene rather than an error.
       ⚠️ AND STRING .replace() IS NOT SAFE FOR THIS. A replacement string treats $&, $` and
       $' as insertion patterns, so a 680KB bundle full of them corrupts itself in ways that
       do not throw until some unrelated geometry is constructed. Round 10b hit exactly
       that. Every substitution here passes a FUNCTION, which disables the patterns.

   3 · The DOCUMENT SCAFFOLDING IS STRIPPED. An artifact is published as page CONTENT: the
       host wraps it in its own <!doctype>/<head>/<body> at publish time, so a second set of
       those tags nests a whole document inside a body. <title> is deliberately KEPT and
       kept early — the host scans only the first 8KB of the file for it, and without one
       the page is named after its filename.

   4 · The header comment is re-stamped so the artifact copy says what it is. A file that
       claims to load from ../vendor while carrying an inlined bundle is a file that will
       be "fixed" by someone later. */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const [inRel, outRel] = process.argv.slice(2);
if (!inRel || !outRel) {
  console.error('usage: node tools/pack-artifact.mjs <in.html> <out.html>');
  process.exit(1);
}
const IN = path.resolve(ROOT, inRel), OUT = path.resolve(ROOT, outRel);
let html = fs.readFileSync(IN, 'utf8');
const before = html.length;

/* ── 1 · fonts ──────────────────────────────────────────────────────────────────── */
let fonts = 0, fontBytes = 0;
html = html.replace(/url\(\.\.\/fonts\/([A-Za-z0-9._-]+\.woff2)\)/g, (_m, file) => {
  const p = path.join(ROOT, 'fonts', file);
  if (!fs.existsSync(p)) { console.error(`! missing font: ${file}`); process.exit(1); }
  const b = fs.readFileSync(p);
  fonts++; fontBytes += b.length;
  return `url(data:font/woff2;base64,${b.toString('base64')})`;
});
const stray = html.match(/url\((?!data:)[^)]*\.(woff2?|ttf|otf)\)/g);
if (stray) { console.error(`! a face still loads from outside the file: ${stray[0]}`); process.exit(1); }
if (!fonts) { console.error('! no fonts were inlined — check the url(../fonts/…) pattern'); process.exit(1); }

/* ── 2 · three.js ───────────────────────────────────────────────────────────────── */
let three = '';
if (/vendor\/three\.module\.min\.js/.test(html)) {
  const src = fs.readFileSync(path.join(ROOT, 'vendor/three.module.min.js'), 'utf8');
  /* checked, not assumed — see the note at the top */
  for (const [what, re] of [['import.meta', /import\.meta/], ['a bare import', /(^|[;\n])import[ {"']/],
                            ['top-level await', /^\s*await /m]]) {
    if (re.test(src)) { console.error(`! the bundle uses ${what}; it cannot run as a classic script`); process.exit(1); }
  }
  const i = src.lastIndexOf('export{');
  const j = src.indexOf('};', i);
  if (i < 0 || j < 0) { console.error('! could not find the bundle\'s trailing export'); process.exit(1); }
  const pairs = src.slice(i + 7, j).split(',').map(t => {
    const m = t.trim().match(/^(.+?)\s+as\s+(.+)$/);
    return m ? `${m[2]}:${m[1]}` : `${t.trim()}:${t.trim()}`;
  });
  /* the function form of replace is what keeps $& and friends inert in 680KB of minified
     source — see the note at the top of this file */
  const body = src.slice(0, i) + `window.THREE={${pairs.join(',')}};` + src.slice(j + 2);
  three = `<script>${body}</script>\n`;
  console.log(`  three.js  ${(src.length / 1024).toFixed(0)} KB · ${pairs.length} exports globalised`);
}

/* ── 3 · strip the scaffolding the host supplies ────────────────────────────────── */
const SCAFFOLD = [
  /<!DOCTYPE html>\s*/i, /<html[^>]*>\s*/i, /<\/html>\s*/i,
  /<head>\s*/i, /<\/head>\s*/i, /<body[^>]*>\s*/i, /<\/body>\s*/i,
  /<meta[^>]*>\s*/gi,
];
for (const re of SCAFFOLD) html = html.replace(re, () => '');
if (!/<title>/i.test(html.slice(0, 8192)))
  { console.error('! no <title> in the first 8KB — the artifact would be named after its file'); process.exit(1); }

/* ── 4 · say what this copy is ──────────────────────────────────────────────────── */
html = html.replace('⚠️ THIS FILE IS THE REPO COPY.', () =>
  '⚠️⚠️ THIS FILE IS THE ARTIFACT COPY AND IT IS BUILD OUTPUT — DO NOT HAND-EDIT IT.\n' +
  '  Regenerate with:  node tools/pack-artifact.mjs <source> <this file>\n' +
  '  Its fonts are data: URIs and three.js is inlined as a classic global, because an\n' +
  '  artifact runs under a policy that blocks every external host. The SOURCE COPY');

if (three) {
  const at = html.indexOf('<script type="module">');
  if (at < 0) { console.error('! no module script to precede'); process.exit(1); }
  html = html.slice(0, at) + three + html.slice(at);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`  fonts     ${fonts} faces · ${(fontBytes / 1024).toFixed(0)} KB raw`);
console.log(`  ${path.relative(ROOT, IN)} ${(before / 1024).toFixed(0)} KB → ${path.relative(ROOT, OUT)} ${(html.length / 1024).toFixed(0)} KB`);
