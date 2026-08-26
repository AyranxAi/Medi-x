/* ═══ tools/qa/included-parity.mjs — one Included list, three doors ═══════════════════
   ⚠️ THIS FILE EXISTS BECAUSE THE LIST HAS ALREADY BEEN WRONG ONCE, IN A WAY NOBODY
   COULD SEE FROM ONE PAGE. On 2026-08-24 three reworded lines were read as the WHOLE
   list, and six bullets became three on /hormone-therapy-bhrt/ and four on
   /modern-menopause/ while /testosterone-top-up/ kept its original six. Every page
   looked internally consistent. It took his screenshot of the men's card to catch it.

   So the check is not "does this page have a list" — it is "do the three cards say the
   SAME thing", which is the property a single-page harness structurally cannot see.

   What it asserts:
     · all three programme cards carry exactly six Included bullets
     · FIVE of the six are BYTE-IDENTICAL across the three (whitespace-normalised)
     · LINE 3 IS DELIBERATELY PER PAGE and is checked against a table, not against its
       siblings. His call 2026-08-26c: "all 3 pages have their own protocol, so edit that
       in accordance to the page." So the check cannot simply demand sameness — that would
       fail the correct state — and it cannot simply skip line 3 either, because then the
       one line most likely to be copy-pasted between doors would be the one line nobody
       is watching. A table is the only form that catches both.
     · the two lines he reworded that ARE shared read exactly as he wrote them
     · none of the phrases his rewording replaced has crept back

     node tools/qa/included-parity.mjs

   No browser: this is a source-level check on purpose, so it runs in a second and can sit
   in front of a commit. Exits non-zero on any failure. */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PAGES = ['hormone-therapy-bhrt', 'modern-menopause', 'testosterone-top-up'];

let fails = 0;
const ok = (c, n, d = '') => { console.log((c ? '  \x1b[32m✓\x1b[0m ' : '  \x1b[31m✗ FAIL\x1b[0m ') + n + (d ? ` — ${d}` : '')); if (!c) fails++; };

/* the two reworded lines that are the same on every door */
const HIS_SHARED = [
  'Science-based Supplements’ suggestion',
  'Hormone Balancing Lifestyle Guide',
];
/* ⚠️ LINE 3, PER PAGE — his 2026-08-26c call. Each door names ITS OWN protocol; door 3's
   wording is his verbatim. Changing a page's protocol name means changing it here too,
   which is the point: the table is where the intent lives. */
const PROTOCOL = {
  'hormone-therapy-bhrt': 'Prescription Issued Bioidentical Hormone Therapy Protocol (BHRT)',
  'modern-menopause':     'Prescription Issued Hormone Balancing Protocol (BHRT)',
  'testosterone-top-up':  'Prescription Issued Testosterone Therapy Protocol (TRT)',
};
const LINE3 = 2;   /* 0-indexed */
/* the phrasings his rewording replaced — if one of these is back, someone reverted half */
const RETIRED = [
  'Issuance of Hormone Balancing Protocol and Prescription',
  'Issuance of Testosterone Protocol and Prescription',
  'Issuance of Science-based Supplementation Plan',
  'Lifestyle Modifications Plan',
];

function included(slug) {
  let s = readFileSync(path.join(ROOT, slug, 'index.html'), 'utf8');
  s = s.replace(/<!--[\s\S]*?-->/g, '');                 /* comments quote the old copy */
  const m = s.match(/<div class="pg-blk pc-inc">[\s\S]*?<ul class="pg-list">([\s\S]*?)<\/ul>/);
  if (!m) return null;
  return [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)]
    .map(x => x[1].replace(/<small>[\s\S]*?<\/small>/g, '')   /* sub-lines are per-page by design */
                  .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

console.log('\n\x1b[1mthe three programme cards\x1b[0m');
const lists = {};
for (const slug of PAGES) {
  const li = included(slug);
  ok(!!li, `${slug}: has an Included block`);
  if (!li) continue;
  lists[slug] = li;
  ok(li.length === 6, `${slug}: six bullets`, String(li.length));
}

console.log('\n\x1b[1mparity — the five shared lines\x1b[0m');
const strip = l => l.filter((_, i) => i !== LINE3);
const [a, ...rest] = PAGES.filter(p => lists[p]);
for (const b of rest) {
  const same = JSON.stringify(strip(lists[a])) === JSON.stringify(strip(lists[b]));
  ok(same, `${b} matches ${a} on all five shared lines`,
     same ? '' : lists[b].map((l, i) => (i === LINE3 || l === lists[a][i]) ? null
        : `${i + 1}: "${l}" vs "${lists[a][i]}"`).filter(Boolean).join(' | '));
}

console.log('\n\x1b[1mline 3 — each door names its own protocol\x1b[0m');
for (const slug of PAGES) {
  if (!lists[slug]) continue;
  ok(lists[slug][LINE3] === PROTOCOL[slug], `${slug}`, lists[slug][LINE3]);
}
/* the failure this table exists to catch: two doors quoting one protocol */
const names = PAGES.filter(p => lists[p]).map(p => lists[p][LINE3]);
ok(new Set(names).size === names.length, 'no two doors share a protocol name',
   names.join(' | '));

console.log('\n\x1b[1mhis wording\x1b[0m');
for (const slug of PAGES) {
  if (!lists[slug]) continue;
  for (const line of HIS_SHARED)
    ok(lists[slug].includes(line), `${slug}: "${line.slice(0, 46)}…"`);
  const back = RETIRED.filter(r => lists[slug].some(l => l.includes(r)));
  ok(back.length === 0, `${slug}: none of the replaced phrasings is back`, back.join(' | '));
}

console.log(fails ? `\n\x1b[31m${fails} FAILURE(S)\x1b[0m` : '\n\x1b[32mall green — five lines shared, one line each\x1b[0m');
process.exit(fails ? 1 : 0);
