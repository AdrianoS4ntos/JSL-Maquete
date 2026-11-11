const {chromium}=require('playwright');const fs=require('fs');
const THREE=fs.readFileSync('/home/claude/jsl/vendor/three.min.js','utf8');
const sizes=[[390,800,'mob'],[768,1024,'tab'],[1366,768,'lap']];
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
for(const [W,H,n] of sizes){const p=await b.newPage({viewport:{width:W,height:H}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.route('**/three*.js',r=>r.fulfill({contentType:'application/javascript',body:THREE}));
 await p.goto('file:///home/claude/jsl/index.html');await p.waitForTimeout(3500);
 await p.getByRole('button',{name:'Iniciar',exact:true}).click();await p.getByRole('button',{name:'Pausar',exact:true}).click();
 for(const [k,js] of [['e1','J.goStep(0,false)'],['e2','J.goStep(1,false)'],['e3','J.goStep(2,false)'],['e4','J.goStep(3,false);J.CL.finish();J.setTri(6)'],['e5','J.goStep(4,false)']]){
  await p.evaluate(js=>{const J=window.__jsl;J.SIM.paused=false;eval(js);J.SIM.paused=false},js);
  for(let i=0;i<14;i++){await p.waitForTimeout(500);const e=await p.evaluate(()=>{const J=window.__jsl;return J.cur.t.distanceTo(J.goal.t)+Math.abs(J.cur.r-J.goal.r*Math.max(1,1.3/(document.getElementById('cv').clientWidth/document.getElementById('cv').clientHeight)))});if(e<.15)break}
  await p.locator('#view').screenshot({path:`r_${n}_${k}.png`})}
 console.log(n,W,H,'sw',await p.evaluate(()=>document.documentElement.scrollWidth),errs.join()||'ok');await p.close()}
await b.close()})();
