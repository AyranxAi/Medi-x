import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import http from 'http'; import path from 'path'; import fs from 'fs';

const ROOT='/home/user/Medi-x';
const NM='/tmp/claude-0/-home-user-Medi-x/681f992f-1efa-5352-8c04-edc61ecc2f5f/scratchpad/node_modules';
const SP='/tmp/claude-0/-home-user-Medi-x/681f992f-1efa-5352-8c04-edc61ecc2f5f/scratchpad';
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml',
 '.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.ico':'image/x-icon','.png':'image/png'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);
  if(p.endsWith('/'))p+='index.html'; const f=path.join(ROOT,p);
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end();}
  r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});
  r.end(readFileSync(f));});
await new Promise(r=>srv.listen(8123,r));

const MAP=[[/gsap@3.13.0\/dist\/gsap\.min\.js/,`${NM}/gsap/dist/gsap.min.js`],
 [/ScrollTrigger\.min\.js/,`${NM}/gsap/dist/ScrollTrigger.min.js`],
 [/SplitText\.min\.js/,`${NM}/gsap/dist/SplitText.min.js`],
 [/lenis@1.3.4\/dist\/lenis\.min\.js/,`${NM}/lenis/dist/lenis.min.js`],
 [/three@0.166.1\/build\/three\.module\.js/,`${NM}/three/build/three.module.js`]];

const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});

async function shots(label,w,h,dpr,ps){
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:dpr,
    isMobile:w<500, hasTouch:w<500});
  await ctx.route('**/cdn.jsdelivr.net/**',route=>{
    const u=route.request().url();
    for(const [re,f] of MAP) if(re.test(u)) return route.fulfill({status:200,contentType:'text/javascript',body:readFileSync(f)});
    return route.abort();});
  const page=await ctx.newPage();
  const errs=[];
  page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));
  for(const p of ps){
    await page.goto(`http://localhost:8123/hormone-balancing/?layout=side&scene=${p}`,{waitUntil:'load'});
    await page.waitForTimeout(2200);
    const st=await page.evaluate(()=>{
      const g=s=>document.querySelector(s);
      const rd=e=>e?{o:+getComputedStyle(e).opacity,t:(e.textContent||'').trim().slice(0,22)}:null;
      return {
        p: window.__scene && window.__scene.p,
        stone: rd(g('.scene-stone')),
        title: rd(g('.scene-title')),
        agent: rd(g('.scene-agent')),
        stoneBox: (b=>b?{x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)}:null)(g('.scene-stone')&&g('.scene-stone').getBoundingClientRect()),
        labels: [...document.querySelectorAll('.scene-label')].map(e=>+(+getComputedStyle(e).opacity).toFixed(2)),
        answers:[...document.querySelectorAll('.scene-answer')].map(e=>+(+getComputedStyle(e).opacity).toFixed(2)),
        bg: getComputedStyle(g('.scene-stage')).backgroundImage.slice(0,60),
      };});
    console.log(`\n[${label} p=${p}] scene.p=${st.p} stone=${st.stone.o} title=${st.title.o} agent=${st.agent.o}`);
    console.log(`   stone box ${JSON.stringify(st.stoneBox)}`);
    console.log(`   labels  ${st.labels.join(' ')}`);
    console.log(`   answers ${st.answers.join(' ')}`);
    await page.screenshot({path:`${SP}/side-${label}-${p}.png`});
  }
  if(errs.length) console.log('!! ERRORS:', [...new Set(errs)].slice(0,6));
  await ctx.close();
}
await shots('desk',1440,900,1,[0.15,0.42,0.60,0.95]);
await shots('phone',390,844,2,[0.95]);
await browser.close(); srv.close();
