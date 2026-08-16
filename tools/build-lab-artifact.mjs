/* ═══════════════════════════════════════════════════════════════════════════════════
   BUILD THE ARTIFACT COPY OF A LAB — the hero lab's TWO COPIES RULE, automated.

     node tools/build-lab-artifact.mjs peptide-therapy/programme-lab.html [out.html]

   A lab in this repo lives with relative asset paths, because that is what makes it a
   page in the site and lets `tools/qa/*.mjs` serve it the way production serves it. The
   same lab is also published as a Claude artifact so the client can open it from a link
   without a checkout — and an artifact runs under a strict CSP that blocks every external
   host, so the fonts and plates have to travel inside the file.

   Keeping those two copies by hand is how they drift. This makes the second one from the
   first, every time, so the repo copy stays the single source.

   WHAT IT DOES, AND WHY EACH STEP EXISTS:
   1 · inlines every @font-face `url(../fonts/*.woff2)` as a data URI — the brand faces
       are the whole point of an audition, and a lab set in the fallback stack is
       auditioning the wrong thing;
   2 · inlines the plate paths listed in the lab's own PLATES table;
   3 · strips the document skeleton. The artifact host supplies doctype, html, head and
       body and wraps whatever it is given, so a second <body> in the content nests one
       body inside another and the browser drops the attributes on the inner one.

   ⚠️ IT REFUSES TO WRITE A FILE THAT STILL CONTAINS A RELATIVE ASSET PATH. A missed path
   under CSP is not a broken image with a console warning — it is a silently unstyled
   audition that the client is being asked to judge. Check 4 fails the build instead.
   ⚠️ IT DOES NOT WRITE INTO THE REPO BY DEFAULT. The artifact copy is build output, not a
   tracked 900KB duplicate of a tracked file.
   ═══════════════════════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

const src = process.argv[2];
if (!src) {
  console.error('usage: node tools/build-lab-artifact.mjs <lab.html> [out.html]');
  process.exit(1);
}
const SRC = path.resolve(ROOT, src);
const OUT = process.argv[3]
  ? path.resolve(process.cwd(), process.argv[3])
  : path.join(ROOT, '.qa-out', path.basename(SRC, '.html') + '-artifact.html');

if (!existsSync(SRC)) { console.error('no such file: ' + SRC); process.exit(1); }

const MIME = { '.woff2':'font/woff2', '.avif':'image/avif', '.webp':'image/webp',
               '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml' };

let html = readFileSync(SRC, 'utf8');
const base = path.dirname(SRC);
let inlined = 0, bytes = 0;

/* ── 1 & 2 · every relative asset reference, wherever it appears ──────────────────
   One pass over "../something.ext" catches the @font-face urls and the PLATES table
   alike; there is no need to know which is which, only that the file resolves. */
html = html.replace(/(["'(])(\.\.\/[A-Za-z0-9._\-/ ]+?\.(?:woff2|avif|webp|png|jpg|svg))(["')])/g,
  (whole, open, rel, close) => {
    const abs = path.resolve(base, rel);
    if (!existsSync(abs)) {
      console.error('  ! missing asset, left as-is: ' + rel);
      return whole;
    }
    const buf = readFileSync(abs);
    inlined++; bytes += buf.length;
    return open + 'data:' + (MIME[path.extname(abs)] || 'application/octet-stream') +
           ';base64,' + buf.toString('base64') + close;
  });

/* ── 3 · strip the skeleton the artifact host supplies ── */
const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || path.basename(SRC);
html = html
  .replace(/<!doctype html>\s*/i, '')
  .replace(/<html[^>]*>\s*/i, '')
  .replace(/<\/html>\s*$/i, '')
  .replace(/<head>\s*/i, '')
  .replace(/<\/head>\s*/i, '')
  .replace(/<body[^>]*>\s*/i, '')
  .replace(/<\/body>\s*/i, '')
  .replace(/<meta[^>]*>\s*/gi, '');

/* ── 4 · refuse to ship a file that still reaches outside itself ── */
const leftover = [...html.matchAll(/["'(](\.\.?\/[^"')]+)["')]/g)].map(m => m[1]);
if (leftover.length) {
  console.error('\n✗ ' + leftover.length + ' relative path(s) survived — under the ' +
                'artifact CSP these load nothing and the lab renders unstyled:');
  [...new Set(leftover)].slice(0, 10).forEach(p => console.error('    ' + p));
  process.exit(1);
}
const external = [...html.matchAll(/["'(](https?:\/\/[^"')]+)["')]/g)].map(m => m[1])
  .filter(u => !/^https?:\/\/(medi-x-gin\.vercel\.app|medi-gyn\.com)/.test(u));
if (external.length) {
  console.error('\n✗ external host(s) referenced: ' + [...new Set(external)].join(', '));
  process.exit(1);
}

writeFileSync(OUT, html);
const kb = n => (n / 1024).toFixed(0) + ' KB';
console.log('\n\x1b[32m✓\x1b[0m ' + title);
console.log('    ' + inlined + ' assets inlined (' + kb(bytes) + ' raw)');
console.log('    ' + kb(Buffer.byteLength(html)) + ' out → ' + OUT);
console.log('    no relative paths, no external hosts');
