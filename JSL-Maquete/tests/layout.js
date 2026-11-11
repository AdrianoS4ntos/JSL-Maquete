const {load,THREE}=require('./mock.js');const h=load('/home/claude/jsl/index.html');const J=h.J,DT=1/30;const fs=require('fs');
const out=[];J.scene.traverse(o=>{if(!o.isMesh||!o.geometry)return;const g=o.geometry;let w,hh,d;if(g.kind==='box')[w,hh,d]=g.args;else if(g.kind==='cyl'){w=d=g.args[0]*2;hh=g.args[2]??g.args[1]}else return;
 const c=o.localToWorld(new THREE.Vector3());let ry=0,q=o;while(q){ry+=q.rotation.y;q=q.parent}const cs=Math.abs(Math.cos(ry)),sn=Math.abs(Math.sin(ry));const ex=(w*cs+d*sn)/2,ez=(w*sn+d*cs)/2;
 out.push([c.x-ex,c.z-ez,c.x+ex,c.z+ez,c.y-hh/2,c.y+hh/2,o.material.color?o.material.color.hex:0,o.material.opacity<1?1:0])});
h.click('start');const path=[];for(let i=0;i<30*50;i++){h.tick(DT);const p=J.main.g.localToWorld(new THREE.Vector3());path.push([p.x,p.z,J.FS.i])}
fs.writeFileSync('layout.json',JSON.stringify({b:out,p:path}));console.log(out.length);
