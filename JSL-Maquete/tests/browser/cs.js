const {chromium}=require('playwright');const fs=require('fs');
const THREE=fs.readFileSync('/home/claude/jsl/vendor/three.min.js','utf8');
const W=+process.argv[2]||1100,H=+process.argv[3]||700,pre=process.argv[4]||'k';
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:W,height:H}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.route('**/three*.js',r=>r.fulfill({contentType:'application/javascript',body:THREE}));
await p.goto('file:///home/claude/jsl/index.html');await p.waitForTimeout(3500);
await p.getByRole('button',{name:'Iniciar',exact:true}).click();
const want=[['s0','J.FS.i==0&&J.FS.t>6'],['s1','J.FS.i==1&&J.FS.t>6'],['s2','J.FS.i==2&&J.FS.t>6'],['p0','J.FS.i==3&&J.CL.ph==0&&J.FS.t>1.5'],['p1','J.FS.i==3&&J.CL.ph==1&&J.FS.t>6'],['p3','J.FS.i==3&&J.CL.ph==3&&J.FS.t>1'],['p4','J.FS.i==3&&J.CL.ph==4&&J.FS.t>1'],['tri','J.FS.i==3&&J.CL.ph==5&&J.triT>6'],['tri_fim','J.FS.i==3&&J.FS.hold>5'],['ods','J.FS.i==4&&J.FS.t>6'],['ov','J.FS.i==4&&J.FS.t>10.5']];
const done=new Set();const t0=Date.now();const log=[];
const N=+process.argv[5]||want.length;while(done.size<N&&Date.now()-t0<1500000){
 const st=await p.evaluate(w=>{const J=window.__jsl;return w.map(([k,c])=>[k,!!eval(c)])},want);
 for(const [k,okk] of st){if(okk&&!done.has(k)){done.add(k);
   for(let i=0;i<10;i++){const e=await p.evaluate(()=>{const J=window.__jsl;return J.cur.t.distanceTo(J.goal.t)});if(e<.5)break;await p.waitForTimeout(600)}
   await p.locator('#view').screenshot({path:`${pre}_${k}.png`});
   const s=await p.evaluate(()=>{const J=window.__jsl;return {i:J.FS.i,ph:J.CL.ph,r:+J.cur.r.toFixed(1),t:J.FS.t.toFixed(1)}});log.push(k+' '+JSON.stringify(s));console.log(k,JSON.stringify(s))}}
 await p.waitForTimeout(400)}
console.log('capturas',done.size,'/',N,errs.join('|')||'sem erros');await b.close()})();
