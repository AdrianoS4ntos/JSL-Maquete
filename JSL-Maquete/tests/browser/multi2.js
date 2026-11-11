const {chromium}=require('playwright');const fs=require('fs');
const [file,dir]=process.argv.slice(2,4);fs.mkdirSync(dir,{recursive:true});
const THREE=fs.readFileSync('/home/claude/jsl/vendor/three.min.js','utf8');
const V=JSON.parse(fs.readFileSync(process.argv[4]));
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1400,height:850}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three*.js',r=>r.fulfill({contentType:'application/javascript',body:THREE}));
await p.goto('file://'+file);await p.waitForTimeout(4000);
await p.evaluate(()=>{document.getElementById('hud').style.display='none';document.querySelector('.tip').style.display='none'});
for(const [n,a] of Object.entries(V)){await p.evaluate(a=>{const J=window.__jsl;J.CAM.auto=false;J.CAM.follow=false;J.goal.t.set(a[0],0,a[1]);J.goal.r=a[2];J.goal.th=a[3];J.goal.ph=a[4];J.cur.t.copy(J.goal.t);J.cur.r=a[2];J.cur.th=a[3];J.cur.ph=a[4]},a);await p.waitForTimeout(900);await p.screenshot({path:`${dir}/${n}.png`,clip:{x:0,y:64,width:1017,height:626}})}
console.log(errs.join()||'ok');await b.close()})();
