import { chromium } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
const ROOT = process.cwd(), OUT = path.join(ROOT, '.qa-out', 'flower');
fs.mkdirSync(OUT, { recursive: true });
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.avif':'image/avif','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4'};
const srv = http.createServer((q,r)=>{ let f=path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)){ r.writeHead(404); return r.end(); }
  r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(r); });
await new Promise(r=>srv.listen(8099,r));

const T = 3000;                              // the turn, stretched so a fraction is easy to hit
const MARKS = [0, .25, .5, .75, 1, 1.45];    // x T, measured from the moment the pieces start moving
const b = await chromium.launch({ channel:'chromium', args:['--use-angle=swiftshader'] });

/* Frames are SCRUBBED, not raced: every CSS transition is a Web Animation, so it can be
   paused and its currentTime set exactly. The 3D layer runs its own clock, so its two
   tweens are placed by hand at the same fraction and then frozen by stretching --ps-dur.
   Screenshot latency therefore cannot smear a frame. */
const SCRUB = ([X, T]) => {
  const root = document.getElementById('process');
  const ease = x => { // cubic-bezier(.22,1,.36,1), the same curve as --ps-ease
    const A=(a,b)=>1-3*b+3*a, B=(a,b)=>3*b-6*a, C=a=>3*a;
    const cb=(t,a,b)=>((A(a,b)*t+B(a,b))*t+C(a))*t, sl=(t,a,b)=>3*A(a,b)*t*t+2*B(a,b)*t+C(a);
    if(x<=0)return 0; if(x>=1)return 1; let t=x;
    for(let i=0;i<8;i++){ const e=cb(t,.22,.36)-x; if(Math.abs(e)<1e-6)break; const d=sl(t,.22,.36); if(!d)break; t-=e/d; }
    return cb(t,1,1);
  };
  root.classList.toggle('ps-turning', X < T);   // the fade keys off this, so scrub it too
  [root, ...root.querySelectorAll('*')].forEach(el =>
    el.getAnimations().forEach(a => { a.pause(); try { a.currentTime = X; } catch(e){} }));
  const d = window.__ps3d;
  if (d){
    const cs = getComputedStyle(root);
    const ms = (n, f) => { const v = cs.getPropertyValue(n); const p = parseFloat(v);
      return isNaN(p) ? f : (/ms\s*$/.test(v) ? p : p*1000); };
    const gd = ms('--ps-grow-delay', 0), gu = ms('--ps-grow-dur', T) || T;
    const cl = (v,a,z) => Math.max(a, Math.min(z, v));
    d.pieces.forEach(pc => {
      pc.rot = pc.rotFrom + (pc.rotTo - pc.rotFrom) * ease(cl(X/T, 0, 1));
      pc.inf = pc.infFrom + (pc.infTo - pc.infFrom) * ease(cl((X-gd)/gu, 0, 1));
      pc.body.morphTargetInfluences[0] = pc.inf; pc.back.morphTargetInfluences[0] = pc.inf;
    });
    root.style.setProperty('--ps-dur', '100000000ms');   // freeze the layer's own clock
    const now = performance.now();
    d.pieces.forEach(pc => { pc.rotFrom = pc.rot; pc.rotT0 = now; pc.infFrom = pc.inf; pc.infT0 = now; });
    d.wake(0);
  }
};

async function run(attr, values, fromStep, toStep){
  const rows = [];
  for (const v of values){
    const pg = await b.newPage({ viewport:{width:1500,height:1000}, deviceScaleFactor:2 });
    await pg.goto(`http://localhost:8099/hormone-therapy-bhrt/?step=${fromStep}`, { waitUntil:'load' });
    await pg.evaluate(()=>document.getElementById('process').scrollIntoView({block:'center'}));
    await pg.waitForTimeout(1800);
    await pg.evaluate(([a,v,t])=>{ const r=document.getElementById('process');
      r.setAttribute(a,v); r.style.setProperty('--ps-dur', t+'ms'); }, [attr,v,T]);
    const box = await pg.locator('#process .ps-stage').boundingBox();
    const clip = { x:box.x-10, y:box.y-10, width:box.width+20, height:box.height+20 };
    const shots = [];
    for (const m of MARKS){
      await pg.evaluate(([a,v,t])=>{ const r=document.getElementById('process');
        r.style.setProperty('--ps-dur', t+'ms'); r.setAttribute(a,v); }, [attr,v,T]);
      await pg.evaluate(s => window.__psGo(s-1), fromStep);   // back to the start, instantly
      await pg.waitForTimeout(600);
      await pg.evaluate(s => window.__psGo(s-1), toStep);     // and turn
      await pg.waitForTimeout(260);                            // the release beat is 130ms
      await pg.evaluate(SCRUB, [m*T, T]);
      await pg.waitForTimeout(260);
      shots.push({ at:Math.round(m*T), png:(await pg.screenshot({ clip })).toString('base64') });
    }
    rows.push({ v, shots }); console.log(`  ${attr}=${v} captured`);
    await pg.close();
  }
  return rows;
}

const NAMES = {
  travel:'A · grows as it travels', late:'B · grows in the last third', arrive:'C · grows on arrival',
  upright:'A · upright, travels around', turn:'B · turns with its petal', fade:'C · fades during the turn' };

async function sheet(title, sub, rows, file){
  const head = MARKS.map(m => m===0?'the start':(m>1?'settled':`${Math.round(m*100)}% through`));
  const html = `<style>
    *{box-sizing:border-box} body{margin:0;background:#F6EEE7;font-family:-apple-system,system-ui,sans-serif;padding:38px 34px 32px}
    h1{font:500 31px/1.2 Georgia,serif;color:#3A1A26;margin:0 0 8px}
    p.sub{margin:0 0 26px;color:#6B5A52;font-size:14.5px;max-width:112ch;line-height:1.55}
    table{border-collapse:collapse} td,th{padding:5px}
    th.col{font:400 11.5px/1 -apple-system,sans-serif;color:#8A7A72;text-transform:uppercase;letter-spacing:.12em;padding-bottom:13px}
    th.row{font:400 15.5px/1.3 Georgia,serif;color:#3A1A26;text-align:right;padding-right:17px;white-space:nowrap;vertical-align:middle}
    img{display:block;width:238px;border:1px solid rgba(94,69,54,.16);background:#F6EEE7}
  </style>
  <h1>${title}</h1><p class="sub">${sub}</p>
  <table><tr><th></th>${head.map(h=>`<th class="col">${h}</th>`).join('')}</tr>
  ${rows.map(r=>`<tr><th class="row">${NAMES[r.v]}</th>${r.shots.map(s=>
      `<td><img src="data:image/png;base64,${s.png}"></td>`).join('')}</tr>`).join('')}
  </table>`;
  const pg = await b.newPage({ viewport:{width:1740,height:1000}, deviceScaleFactor:2 });
  await pg.setContent(html); await pg.waitForTimeout(600);
  await pg.screenshot({ path:path.join(OUT,file), fullPage:true }); await pg.close();
  console.log('  ->', path.join(OUT,file));
}

console.log('THE GROW — step 01 to step 02:');
await sheet('When does the arriving petal grow?',
  'The same turn three times — step 01 to step 02 — frozen at the same five moments. Only the timing of the grow differs. Watch the petal coming down from the top: in A it is already swelling as it travels; in C it stays a leaf the whole way and blooms after it lands.',
  await run('data-ps-grow', ['travel','late','arrive'], 1, 2), 'the-grow.png');

console.log('THE LABELS — step 01 to step 04 (three seats, the longest turn):');
await sheet('What do the resting labels do while the flower turns?',
  'The longest turn on offer — step 01 to step 04, three seats round. A keeps every label upright as it travels, which is what it does today. B glues each label to its petal so it rotates with it. C drops the labels while anything is moving and brings them back when it settles.',
  await run('data-ps-labels', ['upright','turn','fade'], 1, 4), 'the-labels.png');

await b.close(); srv.close();
