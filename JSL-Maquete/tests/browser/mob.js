const {chromium}=require('playwright');const fs=require('fs');
const THREE=fs.readFileSync('/home/claude/jsl/vendor/three.min.js','utf8');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:390,height:800}});const logs=[];p.on('pageerror',e=>logs.push(e.message));
await p.route('**/three*.js',r=>r.fulfill({contentType:'application/javascript',body:THREE}));await p.goto('file:///home/claude/jsl/index.html');await p.waitForTimeout(4000);
await p.screenshot({path:'h_m390.png'});
await p.getByRole('button',{name:'Modo apresentação'}).click();await p.waitForTimeout(2500);
console.log('scrollY',await p.evaluate(()=>scrollY));await p.screenshot({path:'h_m390_pres.png'});
console.log(logs.join()||'sem erros');await b.close()})();
