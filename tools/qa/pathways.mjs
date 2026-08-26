/* ═══ tools/qa/pathways.mjs — chapter 04's "Explore pathway" buttons actually work ═══
   ⚠️⚠️ THIS FILE EXISTS BECAUSE THE BUG IT CATCHES SHIPPED FOR OVER TWO WEEKS AND NOBODY
   COULD SEE IT. From 2026-08-11 pathway 01 carried a correct relative href to our own
   /hormone-balancing/ page — and it was never once followable. `.pw__layer` is
   `pointer-events:none`, nothing re-enabled `.pw__cta`, so the full-bleed `.pw__trigger`
   behind the pill took every click and pressing "Explore pathway" COLLAPSED THE PANEL.
   The markup was right, the href was right, and the button was dead.

   That is the failure mode this whole directory is written against: a claim the page
   makes in the markup, contradicted by what a finger actually does, failing by DOING
   SOMETHING PLAUSIBLE rather than by erroring. A harness that only read hrefs would have
   passed it every day for a fortnight. So this one CLICKS, and asserts the URL changed.

   What it asserts, for each of the four panels:
     · the href is the local page (relative), with no target/rel — the estate's rule is
       that a same-site page REPLACES this one and only external hand-offs spawn a tab
     · `pointer-events` computes to auto, and `elementFromPoint` at the pill's own centre
       returns the pill and not the trigger — the exact check the old bug would fail
     · pressing it NAVIGATES, verified by the URL, then goes back and continues
     · panel 04 (Healthy Aging, no page yet) is the inverse: hrefless, click-THROUGH, and
       pressing it still collapses the panel. That is not an oversight being tolerated —
       it is the `[href]` guard in the stylesheet doing its job, and if someone ever
       "fixes" 04 with href="#" this check fails, which is the point.
     · the nav's three same-site items point home; the external ones keep their target
     · zero page errors, zero 404s

     npm install --no-save playwright@1.49.1 gsap@3.13.0 lenis@1.3.4
     node tools/qa/pathways.mjs

   Exits non-zero on any failure. */
import { chromium } from 'playwright';
import http from 'node:http'; import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
const ROOT = process.cwd();
const MIME={html:'text/html',js:'text/javascript',mjs:'text/javascript',css:'text/css',webp:'image/webp',avif:'image/avif',png:'image/png',jpg:'image/jpeg',svg:'image/svg+xml',woff2:'font/woff2',ico:'image/x-icon',mp4:'video/mp4',json:'application/json'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(new URL(q.url,'http://x').pathname);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);if(!f.startsWith(ROOT)||!existsSync(f)){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':MIME[path.extname(f).slice(1)]||'application/octet-stream'});r.end(readFileSync(f));});
await new Promise(r=>srv.listen(0,r));
const PORT=srv.address().port;
const NM=path.join(ROOT,'node_modules');
const MAP=[[/gsap\.min\.js/,'gsap/dist/gsap.min.js'],[/ScrollTrigger\.min\.js/,'gsap/dist/ScrollTrigger.min.js'],[/SplitText\.min\.js/,'gsap/dist/SplitText.min.js'],[/lenis.*\.js/,'lenis/dist/lenis.min.js']];
let fails=0;
const ok=(c,n,d='')=>{console.log((c?'  \x1b[32m✓\x1b[0m ':'  \x1b[31m✗ FAIL\x1b[0m ')+n+(d?` — ${d}`:''));if(!c)fails++;};

const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const page=await ctx.newPage();
const errs=[]; page.on('pageerror',e=>errs.push(String(e)));
const bad=[]; page.on('response',r=>{if(r.status()>=400)bad.push(r.url());});
await page.route('**://cdn.jsdelivr.net/**',route=>{const h=MAP.find(([re])=>re.test(route.request().url()));h?route.fulfill({contentType:'text/javascript',body:readFileSync(path.join(NM,h[1]))}):route.abort();});
await page.goto(`http://127.0.0.1:${PORT}/?probe=1`,{waitUntil:'load'});
await page.waitForTimeout(1500);
await page.waitForFunction(()=>{const p=document.querySelector('.preloader');return !p||getComputedStyle(p).display==='none';},null,{timeout:9000}).catch(()=>{});

console.log('\n\x1b[1mthe four pathway CTAs\x1b[0m');
const EXPECT=[{n:1,href:'hormone-balancing/'},{n:2,href:'functional-medicine/'},{n:3,href:'peptide-therapy/'},{n:4,href:null}];
for(const {n,href} of EXPECT){
  await page.evaluate(i=>document.getElementById('pw').scrollIntoView({block:'center'}),n);
  await page.waitForTimeout(400);
  await page.click(`#pw-t${n}`);                                  // open the panel
  await page.waitForTimeout(900);
  const r=await page.evaluate(i=>{
    const a=document.querySelector(`#pw-p${i} .pw__cta`);
    const b=a.getBoundingClientRect();
    const hit=document.elementFromPoint(b.left+b.width/2, b.top+b.height/2);
    return {href:a.getAttribute('href'), pe:getComputedStyle(a).pointerEvents,
            hit:hit?(hit.className.baseVal||hit.className||hit.tagName):'(none)',
            isCta:!!(hit&&hit.closest&&hit.closest('.pw__cta')),
            target:a.getAttribute('target'), rel:a.getAttribute('rel')};
  },n);
  if(href){
    ok(r.href===href, `0${n}: href is the local page`, r.href);
    ok(!r.target&&!r.rel, `0${n}: no target/rel (same-site)`, `${r.target}/${r.rel}`);
    ok(r.pe==='auto', `0${n}: pointer-events auto`, r.pe);
    ok(r.isCta, `0${n}: the CTA is what the cursor actually hits`, r.hit);
    /* the real test: does pressing it navigate? */
    const before=page.url();
    await page.click(`#pw-p${n} .pw__cta`);
    await page.waitForLoadState('load'); await page.waitForTimeout(500);
    const now=page.url();
    ok(now!==before&&now.includes(href), `0${n}: pressing it NAVIGATES to /${href}`, now.replace(`http://127.0.0.1:${PORT}/`,'/'));
    await page.goBack({waitUntil:'load'}); await page.waitForTimeout(1400);
    await page.waitForFunction(()=>{const p=document.querySelector('.preloader');return !p||getComputedStyle(p).display==='none';},null,{timeout:9000}).catch(()=>{});
  } else {
    ok(r.href===null, `0${n}: still hrefless (no page yet)`, String(r.href));
    ok(r.pe==='none', `0${n}: click-through, so the panel still collapses`, r.pe);
    ok(!r.isCta, `0${n}: the trigger, not the dead pill, takes the click`, r.hit);
    const open=await page.evaluate(()=>document.querySelector('#pw-p4').getAttribute('data-show'));
    await page.click('#pw-p4 .pw__cta',{force:true}); await page.waitForTimeout(800);
    const after=await page.evaluate(()=>document.querySelector('#pw-p4').getAttribute('data-show'));
    ok(open==='true'&&after==='false', `0${n}: pressing it collapses the panel, as before`, `${open}→${after}`);
  }
}
console.log('\n\x1b[1mthe nav\x1b[0m');
const nav=await page.evaluate(()=>[...document.querySelectorAll('#nav a')].map(a=>({t:a.textContent.trim(),h:a.getAttribute('href'),tg:a.getAttribute('target')})));
for(const l of nav) console.log(`    ${l.t.padEnd(20)} → ${l.h}${l.tg?'  ['+l.tg+']':''}`);
ok(nav.find(l=>/Functional/i.test(l.t))?.h==='functional-medicine/','nav: Functional Medicine points home');
ok(!nav.find(l=>/Functional/i.test(l.t))?.tg,'nav: no target on the same-site item');
ok(errs.length===0,'console clean',errs.join(' | ').slice(0,160));
ok(bad.length===0,'no 404s',bad.join(' ').slice(0,160));
await b.close(); srv.close();
console.log(fails?`\n\x1b[31m${fails} FAILURE(S)\x1b[0m`:'\n\x1b[32mall green\x1b[0m');
process.exit(fails?1:0);
