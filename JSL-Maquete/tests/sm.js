const {load,THREE}=require('./mock.js');const h=load('/home/claude/jsl/index.html');const J=h.J;
const out=[];J.scene.traverse(o=>{if(!o.isMesh||!o.geometry)return;const g=o.geometry;let w,hh,d;if(g.kind==='box')[w,hh,d]=g.args;else if(g.kind==='cyl'){w=d=g.args[0]*2;hh=g.args[2]??g.args[1]}else if(g.kind==='cone'){w=d=g.args[0]*2;hh=g.args[1]}else return;
 const c=o.localToWorld(new THREE.Vector3());let ry=0,q=o,inSM=false;while(q){ry+=q.rotation.y;if(q.children&&q===J.scene.children.find(x=>x.children.length>30&&x.children[0]&&x.children.some(k=>k.geometry&&k.geometry.kind==='box'&&Math.abs(k.position.x-17.5)<.01&&Math.abs(k.position.z-12.9)<.01)))inSM=true;q=q.parent}
 const cs=Math.abs(Math.cos(ry)),sn=Math.abs(Math.sin(ry));const ex=(w*cs+d*sn)/2,ez=(w*sn+d*cs)/2;
 if(c.x+ex<11.5||c.x-ex>21.5||c.z+ez<10||c.z-ez>16.2)return;if(c.y+hh/2<.25)return;
 out.push({x0:+(c.x-ex).toFixed(2),x1:+(c.x+ex).toFixed(2),z0:+(c.z-ez).toFixed(2),z1:+(c.z+ez).toFixed(2),y0:+(c.y-hh/2).toFixed(2),y1:+(c.y+hh/2).toFixed(2),inSM,k:g.kind,col:o.material.color&&o.material.color.hex&&o.material.color.hex.toString(16)})});
const sm=out.filter(o=>o.inSM),ot=out.filter(o=>!o.inSM);
console.log('SM parts',sm.length,'outros',ot.length);
console.log('envelope SM:',Math.min(...sm.map(o=>o.x0)),Math.max(...sm.map(o=>o.x1)),Math.min(...sm.map(o=>o.z0)),Math.max(...sm.map(o=>o.z1)),'ymax',Math.max(...sm.map(o=>o.y1)));
ot.forEach(o=>console.log(JSON.stringify(o)));
