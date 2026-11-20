// Uso: node tests/browser/rs.js [index.html] — capturas das 5 etapas em celular, tablet e notebook.
const {chromium}=require('playwright');const {LAUNCH,fileUrl,routeThree}=require('./env.js');
const sizes=[[390,800,'mob'],[768,1024,'tab'],[1366,768,'lap']];
(async()=>{const b=await chromium.launch(LAUNCH);
for(const [W,H,n] of sizes){const p=await b.newPage({viewport:{width:W,height:H}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await routeThree(p);
 await p.goto(fileUrl(process.argv[2]));await p.waitForTimeout(3500);
 await p.getByRole('button',{name:'Iniciar',exact:true}).click();await p.getByRole('button',{name:'Pausar',exact:true}).click();
 for(const [k,js] of [['e1','J.goStep(0,false)'],['e2','J.goStep(1,false)'],['e3','J.goStep(2,false)'],['e4','J.goStep(3,false);J.CL.finish();J.setTri(6)'],['e5','J.goStep(4,false)']]){
  await p.evaluate(js=>{const J=window.__jsl;J.SIM.paused=false;eval(js);J.SIM.paused=false},js);
  for(let i=0;i<14;i++){await p.waitForTimeout(500);const e=await p.evaluate(()=>{const J=window.__jsl;return J.cur.t.distanceTo(J.goal.t)+Math.abs(J.cur.r-J.goal.r*Math.max(1,1.3/(document.getElementById('cv').clientWidth/document.getElementById('cv').clientHeight)))});if(e<.15)break}
  await p.locator('#view').screenshot({path:`r_${n}_${k}.png`})}
 console.log(n,W,H,'sw',await p.evaluate(()=>document.documentElement.scrollWidth),errs.join()||'ok');await p.close()}
await b.close()})();
