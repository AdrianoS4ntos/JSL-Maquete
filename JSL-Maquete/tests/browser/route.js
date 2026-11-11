const {chromium}=require('playwright');const fs=require('fs');
const THREE=fs.readFileSync('/home/claude/jsl/vendor/three.min.js','utf8');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1400,height:850}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three*.js',r=>r.fulfill({contentType:'application/javascript',body:THREE}));
await p.goto('file:///home/claude/jsl/index.html');await p.waitForTimeout(3500);
await p.getByRole('button',{name:'Iniciar',exact:true}).click();
await p.evaluate(()=>{window.__jsl.goStep(3,true)});
await p.getByRole('button',{name:'Seguir caminhão'}).click();
const seen=new Set();const t0=Date.now();let n=0;
while(Date.now()-t0<150000&&n<6){const s=await p.evaluate(()=>({ph:window.__jsl.CL.ph}));
 if(!seen.has(s.ph)){seen.add(s.ph);await p.waitForTimeout(800);await p.screenshot({path:`route_${s.ph}.png`,clip:{x:0,y:64,width:1017,height:626}});console.log('fase',s.ph,'');n++}
 await p.waitForTimeout(500)}
console.log(errs.join()||'sem erros');await b.close()})();
