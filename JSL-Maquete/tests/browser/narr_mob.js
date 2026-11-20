// Layout mobile do narrador no cabeçalho (requer Playwright). Uso: node tests/browser/narr_mob.js [index.html]
// Verifica: retrato (360x640, 390x844) e paisagem (844x390) — narrador visível só durante simulação/apresentação,
// maquete + narrador na primeira dobra (retrato) e desktop (1366x768) sem narrador e com o mesmo layout.
const {chromium}=require('playwright');const path=require('path');const {LAUNCH,routeThree}=require('./env.js');
const FILE='file:///'+path.resolve(process.argv[2]||path.join(__dirname,'..','..','index.html')).replace(/\\/g,'/');
const R=[];const ok=(c,m)=>{R.push((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch(LAUNCH);
const geo=p=>p.evaluate(()=>{const r=s=>{const e=document.querySelector(s).getBoundingClientRect();return{t:e.top,b:e.bottom,h:e.height}};
 return{h1:getComputedStyle(document.querySelector('header h1')).display,nar:getComputedStyle(document.querySelector('#hnar')).display,hdr:r('header'),view:r('#view'),ih:innerHeight,txt:document.querySelector('#hnar').innerText}});
for(const [w,hh,touch] of [[360,640,1],[390,844,1],[844,390,1],[1366,768,0]]){
 const p=await b.newPage({viewport:{width:w,height:hh},hasTouch:!!touch,isMobile:!!touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await routeThree(p);await p.goto(FILE);await p.waitForTimeout(2500);const tag=`${w}x${hh}`,mob=touch;
 let g=await geo(p);ok(g.h1!=='none'&&g.nar==='none',`${tag} inicial: título padrão`);
 await p.locator('[data-v="start"]').click();await p.waitForTimeout(1500);g=await geo(p);
 if(mob){ok(g.h1==='none'&&g.nar!=='none'&&/ETAPA 1 — SOLICITAÇÃO MUNICIPAL/.test(g.txt)&&/Etapas ↓/.test(g.txt),`${tag} simulação: narrador no cabeçalho`);
  if(hh>w)ok(g.view.b<=g.ih+1&&g.hdr.t>=-1,`${tag} retrato: cabeçalho+maquete na 1ª dobra (view.bottom=${g.view.b.toFixed(0)} ≤ ${g.ih})`);
  await p.evaluate(()=>__jsl.goStep(3,true));await p.waitForTimeout(3000);g=await geo(p);ok(/ETAPA 4/.test(g.txt)&&/Coleta \d\/6/.test(g.txt),`${tag} etapa 4: subfase da coleta`);
  if(hh>w)ok(g.view.b<=g.ih+1,`${tag} etapa 4 retrato: cabe na 1ª dobra (${g.view.b.toFixed(0)} ≤ ${g.ih})`);
  await p.locator('#hnar [data-n="steps"]').click();await p.waitForTimeout(1200);
  ok(await p.evaluate(()=>{const e=document.querySelector('#panel .steps').getBoundingClientRect();return e.top<innerHeight&&e.bottom>0}),`${tag} “Etapas ↓” rola até a lista`);
  await p.locator('[data-v="restart"]').click();await p.waitForTimeout(500);g=await geo(p);ok(g.h1!=='none'&&g.nar==='none',`${tag} reiniciar: título padrão`);
  await p.locator('[data-v="pres"]').click();await p.waitForTimeout(1500);g=await geo(p);ok(g.nar!=='none'&&/ETAPA 1 DE 6/.test(g.txt),`${tag} apresentação: narrador`);
  if(hh>w)ok(g.view.b<=g.ih+1,`${tag} apresentação retrato: 1ª dobra`);
  await p.screenshot({path:`narr_${tag}.png`})}
 else ok(g.h1!=='none'&&g.nar==='none',`${tag} desktop: sem narrador durante a simulação`);
 ok(!errs.length,`${tag} sem erros JS ${errs.join(';')}`);await p.close()}
console.log(R.join('\n'));await b.close()})();
