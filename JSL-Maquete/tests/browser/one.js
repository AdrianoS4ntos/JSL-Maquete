const {chromium}=require('playwright');const fs=require('fs');
const [file,out,x,z,r,th,ph]=process.argv.slice(2);
const THREE=fs.readFileSync('/home/claude/jsl/vendor/three.min.js','utf8');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1400,height:850}});
await p.route('**/three*.js',r=>r.fulfill({contentType:'application/javascript',body:THREE}));
await p.goto('file://'+file);await p.waitForTimeout(4000);
await p.evaluate(a=>{const J=window.__jsl;J.CAM.auto=false;J.CAM.follow=false;J.goal.t.set(+a[0],0,+a[1]);J.goal.r=+a[2];J.goal.th=+a[3];J.goal.ph=+a[4]},[x,z,r,th,ph]);
await p.waitForTimeout(3000);await p.screenshot({path:out});await b.close()})();
