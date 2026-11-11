const {chromium}=require('playwright');const fs=require('fs');
const THREE=fs.readFileSync('/home/claude/jsl/vendor/three.min.js','utf8');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const logs=[];
async function open(w,h){const p=await b.newPage({viewport:{width:w,height:h}});p.on('console',m=>{if(m.type()=='error')logs.push(m.text())});p.on('pageerror',e=>logs.push('PAGEERROR '+e.message));
await p.route('**/three*.js',r=>r.fulfill({contentType:'application/javascript',body:THREE}));await p.goto('file:///home/claude/jsl/index.html');await p.waitForTimeout(4000);return p}
const snap=async(p,n)=>{await p.evaluate(()=>{const J=window.__jsl;J.cur.t.copy(J.goal.t);J.cur.r=J.goal.r;J.cur.th=J.goal.th;J.cur.ph=J.goal.ph});await p.waitForTimeout(900);await p.screenshot({path:n})};
let p=await open(1400,850);await p.close();p=null;
XX
for(const i of [4,5]){await p.evaluate(i=>window.__jsl.presGo(i),i);await p.waitForTimeout(500);await snap(p,`h_pres_${i}.png`);console.log('etapa',i,await p.evaluate(()=>window.__jsl.hudVals().join('|')))}
await p.getByRole('button',{name:'Encerrar apresentação'}).click();await p.waitForTimeout(500);
// seleção dos 4 setores clicando nos prédios: projeta posições
const pts=await p.evaluate(()=>{const J=window.__jsl;return J.sectorPts?J.sectorPts():null});console.log('pts',JSON.stringify(pts));
// desempenho
const fps=await p.evaluate(()=>new Promise(r=>{const J=window.__jsl;let n=0,t0=performance.now(),mx=0,l=t0;J.goal.th+=1.5;function f(){const t=performance.now();mx=Math.max(mx,t-l);l=t;if(++n<60)requestAnimationFrame(f);else r({fps:(n/((t-t0)/1000)).toFixed(1),maxFrameMs:mx.toFixed(0)})}requestAnimationFrame(f)}));console.log('perf (render por software) durante giro da câmera',JSON.stringify(fps));
await p.close();
for(const [w,h] of [[390,800]]){p=await open(w,h);await p.screenshot({path:`h_m${w}.png`});
 await p.getByRole('button',{name:'Modo apresentação'}).click();await p.waitForTimeout(500);await snap(p,`h_m${w}_pres.png`);
 const ov=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth}));console.log(w,'scrollW',ov.sw,'innerW',ov.iw);await p.close()}
console.log(logs.join('\n')||'sem erros');await b.close()})();
