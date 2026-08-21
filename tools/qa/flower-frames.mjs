/* ── FLOWER FRAMES — contact sheets for the sculpture's motion questions ─────────
   Motion cannot be judged from a live page in a report, and it cannot be CAPTURED
   by racing the clock either: under software GL one screenshot costs seconds, which
   smears every frame (the first attempt produced six identical settled frames).

   So each frame is SCRUBBED, and each frame gets a FRESH PAGE. Scrubbing: CSS
   transitions are Web Animations, so every one is paused and its currentTime set;
   the 3D layer runs its own clock, so its three tweens are placed by hand at the
   same fraction and then frozen by stretching --ps-dur. Fresh page: re-seating a
   scrubbed flower to replay it leaves paused animations and a part-turned state
   behind — reloading is slower and is the only way the frames are comparable.

   node tools/qa/flower-frames.mjs            → all three sheets into .qa-out/flower
   node tools/qa/flower-frames.mjs grow       → just one                             */
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

const PAGE = 'hormone-therapy-bhrt';
const T = 3000;                       // the turn, stretched so a fraction is easy to hit

const SCRUB = ([X, T]) => {
  const root = document.getElementById('process');
  const ease = x => {                 // cubic-bezier(.22,1,.36,1) — the same curve as --ps-ease
    const A=(a,b)=>1-3*b+3*a, B=(a,b)=>3*b-6*a, C=a=>3*a;
    const cb=(t,a,b)=>((A(a,b)*t+B(a,b))*t+C(a))*t, sl=(t,a,b)=>3*A(a,b)*t*t+2*B(a,b)*t+C(a);
    if(x<=0)return 0; if(x>=1)return 1; let t=x;
    for(let i=0;i<8;i++){ const e=cb(t,.22,.36)-x; if(Math.abs(e)<1e-6)break; const d=sl(t,.22,.36); if(!d)break; t-=e/d; }
    return cb(t,1,1);
  };
  root.classList.toggle('ps-turning', X < T);
  [root, ...root.querySelectorAll('*')].forEach(el =>
    el.getAnimations().forEach(a => { a.pause(); try { a.currentTime = X; } catch(e){} }));
  const d = window.__ps3d; if(!d) return;
  const cs = getComputedStyle(root);
  const ms = (n,f) => { const v=cs.getPropertyValue(n), p=parseFloat(v);
    return isNaN(p) ? f : (/ms\s*$/.test(v) ? p : p*1000); };
  const gd = ms('--ps-grow-delay',0), gu = ms('--ps-grow-dur',T)||T, cl=(v,a,z)=>Math.max(a,Math.min(z,v));
  const e = ease(cl(X/T,0,1));
  d.pieces.forEach(pc => {
    pc.rot = pc.rotFrom + (pc.rotTo - pc.rotFrom)*e;
    pc.lay = pc.layFrom + (pc.layTo - pc.layFrom)*e;
    pc.inf = pc.infFrom + (pc.infTo - pc.infFrom)*ease(cl((X-gd)/gu,0,1));
    pc.body.morphTargetInfluences[0]=pc.inf; pc.back.morphTargetInfluences[0]=pc.inf;
  });
  root.style.setProperty('--ps-dur','100000000ms');      // freeze the layer's own clock
  const now = performance.now();
  d.pieces.forEach(pc => { pc.rotFrom=pc.rot; pc.rotT0=now; pc.infFrom=pc.inf; pc.infT0=now;
                           pc.layFrom=pc.lay; pc.layT0=now; });
  d.wake(0);
};

const b = await chromium.launch({ channel:'chromium', args:['--use-angle=swiftshader'] });

/* one frame = one page. query: extra URL params for the option under test. */
async function frame(query, fromStep, toStep, X, pad){
  const pg = await b.newPage({ viewport:{width:1500,height:1000}, deviceScaleFactor:2 });
  await pg.goto(`http://localhost:8099/${PAGE}/?step=${fromStep}${query}`, { waitUntil:'load' });
  await pg.evaluate(()=>document.getElementById('process').scrollIntoView({block:'center'}));
  await pg.waitForTimeout(1800);
  await pg.evaluate(t=>document.getElementById('process').style.setProperty('--ps-dur',t+'ms'), T);
  const box = await pg.locator('#process .ps-stage').boundingBox();
  const clip = { x:box.x-pad, y:box.y-pad, width:box.width+pad*2, height:box.height+pad*2 };
  await pg.evaluate(s=>window.__psGo(s-1), toStep);
  await pg.waitForTimeout(260);                      // the release beat is 130ms
  await pg.evaluate(SCRUB, [X, T]);
  await pg.waitForTimeout(260);
  const png = (await pg.screenshot({ clip })).toString('base64');
  await pg.close();
  return png;
}

async function sheet({ file, title, sub, opts, marks, heads, from, to, w, pad }){
  const rows = [];
  for (const o of opts){
    const shots = [];
    for (const m of marks) shots.push(await frame(o.q, from, to, m*T, pad));
    rows.push({ ...o, shots }); console.log('  captured', o.k);
  }
  const html = `<style>*{box-sizing:border-box}body{margin:0;background:#F6EEE7;font-family:-apple-system,system-ui,sans-serif;padding:38px 34px 32px}
  h1{font:500 31px/1.2 Georgia,serif;color:#3A1A26;margin:0 0 8px}
  p.sub{margin:0 0 26px;color:#6B5A52;font-size:14.5px;max-width:110ch;line-height:1.55}
  table{border-collapse:collapse}td,th{padding:6px}
  th.col{font:400 11.5px/1 -apple-system,sans-serif;color:#8A7A72;text-transform:uppercase;letter-spacing:.12em;padding-bottom:13px}
  th.row{font:400 15.5px/1.35 Georgia,serif;color:#3A1A26;text-align:right;padding-right:18px;white-space:nowrap;vertical-align:middle}
  th.row small{display:block;font:400 12px/1.4 -apple-system,sans-serif;color:#8A7A72;margin-top:3px}
  img{display:block;width:${w}px;border:1px solid rgba(94,69,54,.16);background:#F6EEE7}</style>
  <h1>${title}</h1><p class="sub">${sub}</p>
  <table><tr><th></th>${heads.map(h=>`<th class="col">${h}</th>`).join('')}</tr>
  ${rows.map(r=>`<tr><th class="row">${r.k}${r.note?`<small>${r.note}</small>`:''}</th>${
    r.shots.map(s=>`<td><img src="data:image/png;base64,${s}"></td>`).join('')}</tr>`).join('')}</table>`;
  const pg = await b.newPage({ viewport:{width:1400,height:1000}, deviceScaleFactor:2 });
  await pg.setContent(html); await pg.waitForTimeout(600);
  await pg.screenshot({ path:path.join(OUT,file), fullPage:true }); await pg.close();
  console.log('  ->', path.join(OUT,file));
}

const only = process.argv[2];
const SIX  = [0,.25,.5,.75,1,1.45];
const SIXH = ['the start','25% through','50% through','75% through','100% through','settled'];

if(!only || only==='grow'){ console.log('THE GROW — step 01 to 02:');
  await sheet({ file:'the-grow.png', from:1, to:2, marks:SIX, heads:SIXH, w:238, pad:10,
    title:'When does the arriving petal grow?',
    sub:'The same turn three times — step 01 to step 02 — frozen at the same five moments, each frame from a fresh page. Only the timing of the grow differs. Watch the petal coming down from the top: in A it is already swelling as it travels; in C it stays a leaf the whole way and blooms after it lands.',
    opts:[{k:'A · grows as it travels',q:'&grow=travel'},{k:'B · grows in the last third',q:'&grow=late'},{k:'C · grows on arrival',q:'&grow=arrive'}] }); }

if(!only || only==='labels'){ console.log('THE LABELS — step 01 to 04:');
  await sheet({ file:'the-labels.png', from:1, to:4, marks:SIX, heads:SIXH, w:238, pad:10,
    title:'What do the resting labels do while the flower turns?',
    sub:'The longest turn on offer — step 01 to step 04, three seats round. A keeps every label upright as it travels, which is what it does today. B glues each label to its petal so it rotates with it. C drops the labels while anything is moving and brings them back when it settles.',
    opts:[{k:'A · upright, travels around',q:'&labels=upright'},{k:'B · turns with its petal',q:'&labels=turn'},{k:'C · fades during the turn',q:'&labels=fade'}] }); }

if(!only || only==='overlap'){ console.log('THE OVERLAP — step 01 to 02:');
  await sheet({ file:'the-overlap.png', from:1, to:2, marks:[0,.4,1.45], w:330, pad:30,
    heads:['at rest','40% through the turn','settled on step 02'],
    title:'Should the petals sit on top of each other?',
    sub:'The overlap is at its worst part-way through a turn, so each option is shown at rest, mid-turn, and settled. A is the composition traced from the client&rsquo;s render. B keeps every seat exactly where it is and only trims the resting leaves. C also pushes the ring outward.',
    opts:[{k:'A · as it is now',q:'',note:'the client&rsquo;s composition'},
          {k:'B · leaves 12% smaller',q:'&leaf=0.88',note:'same seats, less overlap'},
          {k:'C · ring opened out',q:'&spread=1.12&leaf=0.9',note:'seats out, leaves trimmed'}] }); }

await b.close(); srv.close();
