const {load,THREE}=require('./mock.js');const h=load(process.argv[2]||require('path').join(__dirname,'..','index.html'));const J=h.J,DT=1/30;const R=[];const ok=(c,m)=>{R.push((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
h.click('start');let t=0,prevYaw=null,maxDy=0,maxLag=0,pv=null,maxJump=0,minPair=9,pairInfo='';
const wr=()=>{let r=0,q=J.main.g;while(q){r+=q.rotation.y;q=q.parent}return r};
const W=i=>J.CHS[i].c.g.position;
while(!J.FS.done&&t<120){h.tick(DT);t+=DT;const y=wr();if(prevYaw!==null){const d=Math.abs(Math.atan2(Math.sin(y-prevYaw),Math.cos(y-prevYaw)));maxDy=Math.max(maxDy,d)}prevYaw=y;
 const p=J.main.g.localToWorld(new THREE.Vector3());if(pv)maxJump=Math.max(maxJump,Math.hypot(p.x-pv.x,p.z-pv.z));pv=p;
 if(J.CL.on){const lag=Math.abs(Math.atan2(Math.sin(J.f2.ty-J.main.g.rotation.y),Math.cos(J.f2.ty-J.main.g.rotation.y)));maxLag=Math.max(maxLag,lag)}
 for(let a=0;a<13;a++)for(let b=a+1;b<13;b++){const A=J.CHS[a].c.g.localToWorld(new THREE.Vector3()),B=J.CHS[b].c.g.localToWorld(new THREE.Vector3());const d=Math.hypot(A.x-B.x,A.z-B.z);if(d<minPair){minPair=d;pairInfo=`${a}-${b} em t=${t.toFixed(1)}`}}}
ok(J.FS.done,'simulação conclui');
ok(maxDy<0.25,'giro máx do caminhão por quadro '+maxDy.toFixed(3)+' rad (curvas graduais)');
ok(maxLag<0.5,'defasagem máxima entre orientação e tangente da rota '+maxLag.toFixed(2)+' rad');
ok(maxJump<0.1,'deslocamento máx por quadro '+maxJump.toFixed(3));
ok(minPair>0.45,'distância mínima entre personagens '+minPair.toFixed(2)+' ('+pairInfo+')');
console.log(R.join('\n'));
