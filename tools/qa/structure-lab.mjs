import { chromium } from 'playwright';
import path from 'path'; import fs from 'fs';
const ROOT='/home/user/Medi-x';
const FILE='file://'+path.join(ROOT,'peptide-therapy/structure-lab.html');
const OUT='/tmp/claude-0/-home-user-Medi-x/3141672a-4241-54d1-95ba-305a23c9ecc5/scratchpad';
let exe=null;
for(const d of fs.readdirSync('/opt/pw-browsers')){
  const p=path.join('/opt/pw-browsers',d,'chrome-linux','chrome');
  if(fs.existsSync(p)){exe=p;break;}
}
const b=await chromium.launch({executablePath:exe||undefined});
let fails=0;
const ok=(c,m)=>{console.log((c?'  ok  ':'  FAIL')+'  '+m); if(!c)fails++;};
for(const [w,h,label] of [[1440,900,'desktop'],[1024,800,'tablet'],[390,844,'phone']]){
  const pg=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
  const errs=[]; pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); pg.on('pageerror',e=>errs.push(String(e)));
  await pg.goto(FILE,{waitUntil:'load'});
  await pg.waitForTimeout(700);
  await pg.evaluate(()=>document.querySelectorAll('[data-rev]').forEach(e=>e.classList.add('on')));
  await pg.waitForTimeout(300);
  console.log(`\n── ${label} ${w}×${h} ──`);
  ok(errs.length===0,`zero console/page errors${errs.length?': '+errs.slice(0,3).join(' | '):''}`);
  const sw=await pg.evaluate(()=>document.documentElement.scrollWidth);
  ok(sw<=w,`no horizontal overflow (scrollWidth ${sw} ≤ ${w})`);
  const m=await pg.evaluate(()=>({
    arcs:document.querySelectorAll('#arcs path').length,
    verbs:document.querySelectorAll('#lhs text').length,
    steps:document.querySelectorAll('#rhs text').length/2,
    cols:document.querySelectorAll('#strip .col').length,
    blks:document.querySelectorAll('#strip .blk').length,
    draw:document.querySelectorAll('#strip .drawer').length,
    stackH:[...document.querySelectorAll('#strip .stack')].map(s=>Math.round(s.getBoundingClientRect().height)),
    totals:[...document.querySelectorAll('#strip .col-total')].map(t=>+t.textContent),
    plates:document.querySelectorAll('.plate').length,
    specs:document.querySelectorAll('.spec').length,
    fonts:document.fonts.size
  }));
  ok(m.arcs===9,`overlap figure: 9 arcs drawn (${m.arcs})`);
  ok(m.verbs===9&&m.steps===7,`figure labels: 9 verbs / 7 steps (${m.verbs}/${m.steps})`);
  ok(m.cols===6&&m.blks===35&&m.draw===5,`shape strip: 6 columns, 35 in-flow blocks, 5 drawers (${m.cols}/${m.blks}/${m.draw})`);
  // THE CENTRAL CLAIM OF THE OBJECT: stack height is words-in-flow × SCALE, exactly.
  // Asserted against the printed totals, because a drawn block that disagrees with its
  // own number is worse than no number — this is how the folded-block bug was caught.
  // Tolerance is 6px, not 0: each block rounds its own height to the nearest pixel, so an
  // eleven-block column can drift half a pixel eleven times. +2 is the stack's own border.
  const S=.62, bad=m.stackH.map((h,i)=>[m.totals[i],h,Math.round(m.totals[i]*S)+2]).filter(([t,h,e])=>Math.abs(h-e)>6);
  ok(bad.length===0,`every stack measures its own total ×${S} [${m.stackH}] ${bad.length?'off: '+JSON.stringify(bad):''}`);
  ok(m.stackH[0]===Math.max(...m.stackH)&&m.stackH[4]===Math.min(...m.stackH),`NOW is the tallest column and D the shortest`);
  ok(m.plates===8&&m.specs===5,`8 plates, 5 live specimens (${m.plates}/${m.specs})`);
  // fonts actually resolved (not fallback)
  const f=await pg.evaluate(async()=>{
    await document.fonts.ready;
    return {pf:document.fonts.check('450 40px Playfair'), meg:document.fonts.check('400 20px "MediGyn Megante"'), now:document.fonts.check('300 16px "MediGyn NOW"')};
  });
  ok(f.pf&&f.meg&&f.now,`all three brand faces loaded (Playfair ${f.pf}, Megante ${f.meg}, NOW ${f.now})`);
  // bar never overlaps first plate heading
  const clash=await pg.evaluate(()=>{
    const bar=document.querySelector('.bar').getBoundingClientRect();
    const k=document.querySelector('#diagnosis .kicker').getBoundingClientRect();
    return k.top < bar.bottom;
  });
  ok(!clash,'fixed bar clears the first plate heading');
  // The charset check exists because of a real bug: with no <meta charset> the file rendered
  // every em dash and plate glyph as Latin-1 mojibake, and NOTHING in the suite noticed —
  // only the first screenshot did. Assert the decoded document, not the bytes.
  const enc=await pg.evaluate(()=>({cs:document.characterSet,moji:document.body.innerText.includes('â')}));
  ok(enc.cs==='UTF-8'&&!enc.moji,`decoded as UTF-8, no mojibake (${enc.cs}${enc.moji?', â FOUND':''})`);
  // No text may overflow its own box — this caught .op labels ("COMPRESS") running out of a
  // 5.4em column into the sentence beside them, which no layout assertion would have seen.
  // .bar-id is excluded on purpose — it carries text-overflow:ellipsis and is MEANT to
  // truncate on a narrow bar. Everything else in this list must fit its box.
  const spill=await pg.evaluate(()=>[...document.querySelectorAll('.moves .op,.col-name,.cad .when,.c-verb,.req-top p,.col-unit')]
    .filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.className+':'+e.textContent.trim().slice(0,20)));
  ok(spill.length===0,`no label overflows its column${spill.length?': '+spill.slice(0,4).join(' | '):''}`);
  if(label==='desktop'){
    // Their own QA README: scrollIntoView() returns immediately and smooth scrolling lands
    // the screenshot mid-flight. Kill the behaviour before believing any frame.
    await pg.addStyleTag({content:'html{scroll-behavior:auto !important}'});
    await pg.screenshot({path:path.join(OUT,'lab-top.png'),clip:{x:0,y:0,width:w,height:1500}});
    await pg.evaluate(()=>document.getElementById('shapes').scrollIntoView());
    await pg.waitForTimeout(500);
    await pg.screenshot({path:path.join(OUT,'lab-shapes.png')});
    await pg.evaluate(()=>document.getElementById('a').scrollIntoView());
    await pg.waitForTimeout(500);
    await pg.screenshot({path:path.join(OUT,'lab-a.png')});
    await pg.evaluate(()=>document.getElementById('b').scrollIntoView());
    await pg.waitForTimeout(400);
    await pg.screenshot({path:path.join(OUT,'lab-b.png')});
    await pg.evaluate(()=>document.getElementById('ground').scrollIntoView());
    await pg.waitForTimeout(400);
    await pg.screenshot({path:path.join(OUT,'lab-ground.png')});
  }
  await pg.close();
}
// reduced motion
const pg=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await pg.goto(FILE,{waitUntil:'load'}); await pg.waitForTimeout(500);
const hidden=await pg.evaluate(()=>[...document.querySelectorAll('[data-rev]')].filter(e=>getComputedStyle(e).opacity!=='1').length);
console.log('\n── reduced motion ──');
ok(hidden===0,`every reveal is visible without animation (${hidden} hidden)`);
await pg.close(); await b.close();
console.log('\n'+(fails?`${fails} FAILED`:'ALL CHECKS PASSED'));
process.exit(fails?1:0);
