const {load,THREE}=require('./mock.js');const h=load(process.argv[2]);const J=h.J;h.click('start');let t=0;
const w=[];J.main.g.traverse(o=>{if(o.isMesh&&o.geometry.kind==='cyl')w.push(o)});
while(t<60&&!J.FS.done){h.tick(1/30);t+=1/30;for(const o of w){const c=o.localToWorld(new THREE.Vector3());if(c.x>12.4&&c.x<13.4&&c.z>4.1&&c.z<5.1&&c.y<.5)console.log(t.toFixed(2),'roda',c.x.toFixed(2),c.z.toFixed(2),'ph',J.CL.ph,'FS',J.FS.i)}}
console.log('main wheels count',w.length)
