// Uso: node tests/browser/shots.js [index.html] [prefixo] — capturas de vistas fixas da maquete.
const {chromium}=require('playwright');const {LAUNCH,fileUrl,routeThree}=require('./env.js');
const file=process.argv[2],tag=process.argv[3]||'run';
const V={
 overview:{th:null},
 adm:{t:[0,0,-3],r:16,th:.6,ph:.75},
 log:{t:[8,0,-4],r:20,th:-.5,ph:.8},
 sm:{t:[17.5,0,13],r:13,th:.5,ph:.7},
 sm2:{t:[17.5,0,13],r:10,th:-2.4,ph:.6},
 road:{t:[11.5,0,10],r:18,th:1.2,ph:.9},
 top:{t:[9,0,2.5],r:48,th:0,ph:1.5}};
(async()=>{const b=await chromium.launch(LAUNCH);
const p=await b.newPage({viewport:{width:1400,height:850}});
const logs=[];p.on('console',m=>{if(m.type()=='error')logs.push(m.text())});p.on('pageerror',e=>logs.push('PAGEERROR '+e.message));
await routeThree(p);
await p.goto(fileUrl(file));await p.waitForTimeout(5000);
for(const [k,v] of Object.entries(V)){
 await p.evaluate(v=>{const J=window.__jsl;J.CAM.auto=false;J.CAM.follow=false;if(v.t){J.goal.t.set(...v.t);J.goal.r=v.r;J.goal.th=v.th;J.goal.ph=v.ph;}else{J.CAM.auto=true}},v);
 await p.waitForTimeout(2500);await p.screenshot({path:`${tag}_${k}.png`});}
console.log(logs.join('\n')||'no errors');await b.close()})();
