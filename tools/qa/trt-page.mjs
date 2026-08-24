/* ═══════════ trt-page.mjs — the men's door, smoke-tested ═══════════════════════
   ⚠️ THIS PAGE HAD NO HARNESS UNTIL 2026-08-24g, and it acquired one the day its
   PRICE CHANGED. That is the reason it exists: AED 950 → 1,150 is four numbers in
   two places (the script's BASE and three static figures the no-JS reader sees),
   and the failure mode is silent — a card that adds up wrongly still renders.
   The money is checked THREE WAYS: the static markup a no-JS reader gets, the
   derived figures after the script runs, and the arithmetic after the add-on is
   ticked. All three have to agree or the check fails.
   Run: npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
        && node tools/qa/trt-page.mjs                                          */
import playwright from "playwright";
import http from "http"; import fs from "fs"; import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PORT = 8123;
const URL_ = `http://127.0.0.1:${PORT}/testosterone-top-up/`;
const MIME = {".html":"text/html",".webp":"image/webp",".png":"image/png",".avif":"image/avif",
  ".svg":"image/svg+xml",".woff2":"font/woff2",".js":"text/javascript",".ico":"image/x-icon"};

let bad = 0;
const ok = (cond, name, detail = "") => {
  console.log(`  ${cond ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!cond) bad++;
};

const srv = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(r);
});
await new Promise(r => srv.listen(PORT, r));
const browser = await playwright.chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
});

/* ⚠️ THE PAGE LOADS gsap AND lenis FROM jsdelivr, so a sandboxed run fails four
   requests and the console check drowns in tunnel errors that say nothing about
   the page. bhrt-shots.mjs solves it by routing those URLs at the local install;
   this is the same map. Install with the command in the header. */
const NM = path.join(ROOT, "node_modules");
if (!fs.existsSync(path.join(NM, "gsap", "dist", "gsap.min.js"))) {
  console.log("! gsap/lenis not installed — see the run command in this file's header");
  process.exit(1);
}
const MAP = [
  [/gsap@3\.13\.0\/dist\/gsap\.min\.js/, path.join(NM, "gsap/dist/gsap.min.js")],
  [/ScrollTrigger\.min\.js/,               path.join(NM, "gsap/dist/ScrollTrigger.min.js")],
  [/SplitText\.min\.js/,                   path.join(NM, "gsap/dist/SplitText.min.js")],
  [/lenis@1\.3\.4\/dist\/lenis\.min\.js/, path.join(NM, "lenis/dist/lenis.min.js")],
];

/* ── 1 · the money a no-JS reader sees, read out of the raw HTML ───────────── */
console.log("\n\x1b[1m1 · The money in the markup (what no-JS ships)\x1b[0m");
const raw = fs.readFileSync(path.join(ROOT, "testosterone-top-up", "index.html"), "utf8");
ok(/id="pg-sub">AED 1,150\.00</.test(raw),   "static programme row is AED 1,150.00");
ok(/id="pg-vat">AED 57\.50</.test(raw),      "static VAT row is AED 57.50");
ok(/id="pg-total">AED 1,207\.50</.test(raw), "static total is AED 1,207.50");
ok(/pg-amt">AED 1,150 /.test(raw),           "the Included header quotes AED 1,150");
ok(/const BASE=1150,/.test(raw),             "the script's BASE is 1150");
/* ⚠️ BOTH COMMENT SYNTAXES ARE STRIPPED, NOT JUST HTML'S. The first run of this check
   caught a stale "AED 950 + VAT" living in a CSS /* *\/ banner, which an HTML-only
   strip walks straight past — and a stale price in a build note is exactly what the
   next person reads before touching the money. */
ok(!/AED 9(50|97\.50)\b/.test(raw.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "")),
   "no stray 950 / 997.50 left in copy OR in a build note");

/* ── 2 · the money the script derives, and the add-on arithmetic ───────────── */
console.log("\n\x1b[1m2 · The money after the script runs\x1b[0m");
const errs = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.route("**://cdn.jsdelivr.net/**", route => {
  const hit = MAP.find(([re]) => re.test(route.request().url()));
  return hit ? route.fulfill({ body: fs.readFileSync(hit[1]), contentType: "text/javascript" })
             : route.continue();
});
page.on("console", m => m.type() === "error" && errs.push(m.text()));
page.on("pageerror", e => errs.push(String(e)));
await page.goto(`${URL_}?probe=1`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);

const m1 = await page.evaluate(() => {
  const g = id => document.getElementById(id).textContent;
  return { sub: g("pg-sub"), vat: g("pg-vat"), total: g("pg-total") };
});
ok(m1.sub === "AED 1,150.00" && m1.vat === "AED 57.50" && m1.total === "AED 1,207.50",
   "derived: 1,150.00 / 57.50 / 1,207.50", `${m1.sub} ${m1.vat} ${m1.total}`);

await page.click("#pg-addon");
const m2 = await page.evaluate(() => ({
  row: !document.getElementById("pg-row-addon").hidden,
  sub: document.getElementById("pg-sub").textContent,
  vat: document.getElementById("pg-vat").textContent,
  total: document.getElementById("pg-total").textContent,
  pressed: document.getElementById("pg-addon").getAttribute("aria-pressed"),
}));
/* ⚠️ THE PROGRAMME ROW MUST NOT MOVE when the add-on is ticked — the 2026-08-17
   lesson, recorded at the money block: a base row that swallows the add-on reads
   as the wrong price. 3,100 is the SUBTOTAL and appears nowhere as a row. */
ok(m2.row && m2.sub === "AED 1,150.00" && m2.vat === "AED 155.00"
   && m2.total === "AED 3,255.00" && m2.pressed === "true",
   "with collection: row shown, base unmoved, 155.00 VAT, 3,255.00 total",
   `${m2.sub} ${m2.vat} ${m2.total}`);
await page.click("#pg-addon");

/* ── 3 · the chapter's shape, and the copy rules that are load-bearing ─────── */
console.log("\n\x1b[1m3 · The page's shape\x1b[0m");
const smoke = await page.evaluate(() => ({
  beats:    document.querySelectorAll(".scene-beat").length,
  steps:    document.querySelectorAll("#process .ps-arm").length,
  rollback: (document.querySelector("#programme noscript")?.textContent.match(/<li>/g) || []).length,
  markers:  document.querySelectorAll(".mk-card").length,
  ledger:   document.querySelectorAll(".ledger-list li").length,
  chips:    document.querySelectorAll(".chip").length,
  docs:     document.querySelectorAll(".doc").length,
  names:    [...document.querySelectorAll(".doc > h3")].map(h => h.textContent.trim()),
  text:     document.body.innerText,
}));
ok(smoke.beats === 6,    "six scene beats", String(smoke.beats));
ok(smoke.steps === 6,    "six petals", String(smoke.steps));
ok(smoke.rollback === 6, "six steps in the no-JS rollback list", String(smoke.rollback));
ok(smoke.markers === 4,  "four monitoring markers", String(smoke.markers));
ok(smoke.ledger === 8 && smoke.chips === 8,
   "eight ledger rows = eight fallback chips", `${smoke.ledger}/${smoke.chips}`);
/* ⚠️ THIS ROW IS PURELY MALE — his instruction 2026-08-24g. It is the mirror of
   /hormone-therapy-bhrt/, which is purely female by the same call. A "sync the
   doctors" pass on another page is what this check exists to refuse. */
ok(smoke.docs === 3, "three doctors", String(smoke.docs));
ok(["Andrey", "Eslam", "Khalid"].every(n => smoke.names.some(x => x.includes(n))),
   "the row is purely male — Andrey · Eslam · Khalid", smoke.names.join(" · "));
/* ⚠️ READ FROM THE SOURCE, NOT innerText — and that is not a shortcut. A scene beat
   sits at opacity 0 until its own window, and the whole .scene-fallback is display:none
   while the scene runs, so innerText legitimately sees neither. The first cut of this
   check used innerText and failed on a page where both lines were present and correct.
   ⚠️ THE PAGE'S CLINICAL POSITION: back to a normal range, never past it. The standing
   warning is that a copy round softens this into "optimised levels" — the vocabulary of
   the clinics this one is not. */
const body = raw.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
ok(/not beyond it|not past it|rather than past it/i.test(body),
   "the range guard survives in the copy");
/* ⚠️⚠️ THE MORNING DRAW IS CHECKED WHERE A READER WITH JS CAN ACTUALLY REACH IT.
   Testosterone is diurnal and a reference range is written for a morning sample, so
   this is the one instruction on the page that changes the RESULT rather than the
   experience. It was lost from the live page when the sculpture replaced the <ol>:
   it survived only inside <noscript>, which a scripting browser never renders. Asserting
   it "somewhere in the file" would have passed while nobody could read it — so the
   <noscript> block is cut out before this looks. */
const live = body.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");
ok(/taken in the morning/i.test(live),
   "the morning-draw instruction is reachable WITH JS on (not only in <noscript>)");
ok(errs.length === 0, "page console clean", errs.join(" | ").slice(0, 200));

/* ── 4 · no sideways scroll, the estate's standing check ───────────────────── */
console.log("\n\x1b[1m4 · No sideways scroll\x1b[0m");
for (const w of [320, 390, 430, 700, 900, 1104, 1280, 1440, 1920]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(220);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  ok(sw <= w, `no sideways scroll at ${w}`, `scrollWidth=${sw}`);
}

await browser.close(); srv.close();
console.log(bad ? `\n\x1b[31m${bad} failure(s)\x1b[0m\n` : "\n\x1b[32mall green\x1b[0m\n");
process.exit(bad ? 1 : 0);
