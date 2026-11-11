const {chromium}=require('playwright');const fs=require('fs');
const file=process.argv[2],tag=process.argv[3];
const THREE=fs.readFileSync('/home/claude/jsl/vendor/three.min.js','utf8');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1400,height:850}});
const logs=[];p.on('console',m=>{if(m.type()=='error')logs.push(m.text())});p.on('pageerror',e=>logs.push('PAGEERROR '+e.message));
await p.route('**/three*.js',r=>r.fulfill({contentType:'application/javascript',body:THREE}));
await p.goto('file://'+file);await p.waitForTimeout(4000);
const st=()=>p.evaluate(()=>{const J=window.__jsl;const w=J.main.g.getWorldPosition?J.main.g.getWorldPosition(new (J.main.g.position.constructor)()):null;return {i:J.FS.i,ph:J.CL.ph,paused:J.SIM.paused,x:w&&+w.x.toFixed(2),y:w&&+w.y.toFixed(3),z:w&&+w.z.toFixed(2)}});
await p.getByRole('button',{name:'Iniciar',exact:true}).click();
const seen={};const trail=[];let shot={};const t0=Date.now();let paused=false;
while(Date.now()-t0<420000){
 const s=await st();trail.push(s);
 const k='s'+s.i+'p'+s.ph;
 if(!seen[k]){seen[k]=1;await p.waitForTimeout(700);await p.screenshot({path:`${tag}_sim_${k}.png`});console.log('shot',k,JSON.stringify(s));
  if(s.i===3&&s.ph===2&&!paused){paused=true;await p.getByRole('button',{name:'Pausar',exact:true}).click();await p.waitForTimeout(800);const a=await st();await p.waitForTimeout(1500);const c=await st();console.log('pausa: mesmo ponto?',a.x===c.x&&a.z===c.z,a.paused);await p.getByRole('button',{name:'Continuar',exact:true}).click();await p.waitForTimeout(800);console.log('continuar:',JSON.stringify(await st()));}}
 if(s.i>=4&&s.ph===5)break;
 await p.waitForTimeout(500);}
// rodas/altura: y do caminhão
const ys=trail.map(t=>t.y).filter(v=>v!=null);console.log('y min/max',Math.min(...ys),Math.max(...ys));
let jump=0;for(let i=1;i<trail.length;i++){jump=Math.max(jump,Math.hypot(trail[i].x-trail[i-1].x,trail[i].z-trail[i-1].z))}console.log('maior salto entre amostras(0.5s)',jump.toFixed(2));
await p.locator('section').getByRole('button',{name:'Reiniciar',exact:true}).click();await p.waitForTimeout(2500);console.log('apos reiniciar',JSON.stringify(await st()));await p.screenshot({path:`${tag}_sim_restart.png`});
console.log(logs.join('\n')||'no console errors');await b.close()})();
