const {chromium}=require('playwright');const fs=require('fs');
const THREE=fs.readFileSync('/home/claude/jsl/vendor/three.min.js','utf8');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1400,height:850}});
const logs=[];p.on('console',m=>{if(m.type()=='error')logs.push(m.text())});p.on('pageerror',e=>logs.push('PAGEERROR '+e.message));
await p.route('**/three*.js',r=>r.fulfill({contentType:'application/javascript',body:THREE}));
await p.goto('file:///home/claude/jsl/index.html');await p.waitForTimeout(4500);
await p.screenshot({path:'g_hud.png'});
// triagem em vários instantes (closeup)
for(const T of [0.6,3,5.5,9.2,11]){await p.evaluate(T=>{const J=window.__jsl;J.setTri(T);J.CAM.auto=false;J.goal.t.set(14,.4,-.2);J.goal.r=9;J.goal.th=.5;J.goal.ph=.95;J.cur.t.copy(J.goal.t);J.cur.r=9;J.cur.th=.5;J.cur.ph=.95},T);await p.waitForTimeout(1200);await p.screenshot({path:`g_tri_${T}.png`,clip:{x:0,y:64,width:1017,height:626}})}
await p.evaluate(()=>window.__jsl.setTri(-1));
// apresentação
await p.getByRole('button',{name:'Modo apresentação'}).click();
const seen={};const t0=Date.now();let used=false;
while(Date.now()-t0<400000){const s=await p.evaluate(()=>({i:window.__jsl.PR.i,sub:window.__jsl.PR.sub,on:window.__jsl.PR.on,v:window.__jsl.hudVals()}));
 const k=s.i+'_'+s.sub;if(!seen[k]){seen[k]=1;await p.waitForTimeout(1500);await p.screenshot({path:`g_pres_${k}.png`});console.log('passo',k,JSON.stringify(s.v));
  if(s.i===1&&!used){used=true;await p.getByRole('button',{name:'Pausar'}).first().click();const a=await p.evaluate(()=>window.__jsl.PR.t);await p.waitForTimeout(2500);const c=await p.evaluate(()=>window.__jsl.PR.t);console.log('pausa: tempo parado?',a===c);await p.getByRole('button',{name:'Continuar'}).first().click();
   await p.getByRole('button',{name:'Próxima'}).click();await p.waitForTimeout(500);console.log('apos Próxima i=',await p.evaluate(()=>window.__jsl.PR.i));await p.getByRole('button',{name:'Anterior'}).click();await p.waitForTimeout(500);console.log('apos Anterior i=',await p.evaluate(()=>window.__jsl.PR.i));}}
 if(s.i===5&&s.sub===0){await p.waitForTimeout(2500);break}
 await p.waitForTimeout(700)}
await p.getByRole('button',{name:'Encerrar apresentação'}).click();await p.waitForTimeout(2500);
console.log('apos encerrar: on=',await p.evaluate(()=>window.__jsl.PR.on),'mode=',await p.evaluate(()=>window.__jsl.mode),'auto=',await p.evaluate(()=>window.__jsl.CAM.auto));
await p.screenshot({path:'g_pres_end.png'});
// câmera devolvida: arrastar gira
const th0=await p.evaluate(()=>window.__jsl.goal.th);await p.mouse.move(500,400);await p.mouse.down();await p.mouse.move(620,400,{steps:5});await p.mouse.up();await p.waitForTimeout(500);
console.log('camera responde ao arrastar:',th0!==await p.evaluate(()=>window.__jsl.goal.th));
console.log(logs.join('\n')||'sem erros');await b.close()})();
