const {load,THREE}=require('./mock.js');const h=load(process.argv[2]||require('path').join(__dirname,'..','index.html'));const J=h.J;
const chg=new Set(J.CHS.map(c=>c.c.g));
const M=[];J.scene.traverse(o=>{if(!o.isMesh||!o.geometry)return;let a=o,skip=false;while(a){if(chg.has(a))skip=true;a=a.parent}if(skip)return;
 const g=o.geometry;let w,hh,d,k=g.kind;if(k==='box')[w,hh,d]=g.args;else if(k==='cyl'){w=d=Math.max(g.args[0],g.args[1])*2;hh=g.args[2]??g.args[1]}else if(k==='cone'){w=d=g.args[0]*2;hh=g.args[1]}else return;
 const c=o.localToWorld(new THREE.Vector3());let ry=0,q=o;while(q){ry+=q.rotation.y;q=q.parent}const cs=Math.abs(Math.cos(ry)),sn=Math.abs(Math.sin(ry));const ex=(w*cs+d*sn)/2,ez=(w*sn+d*cs)/2;
 let top=o;while(top.parent&&top.parent!==J.scene)top=top.parent;
 M.push({o,k,x0:c.x-ex,x1:c.x+ex,z0:c.z-ez,z1:c.z+ez,y0:c.y-hh/2,y1:c.y+hh/2,col:o.material.color?o.material.color.hex:0,tr:o.material.opacity<1,top,idx:M.length,desc:`${k}(${w.toFixed?w.toFixed(2):w},${hh.toFixed(2)},${d.toFixed(2)})`})});
const f=v=>v.toFixed(2);const D=m=>`#${m.idx} ${m.desc} col=${m.col.toString(16)} [${f(m.x0)},${f(m.z0)}]-[${f(m.x1)},${f(m.z1)}] y ${f(m.y0)}..${f(m.y1)}`;
console.log('meshes',M.length);

const fl=M.filter(m=>m.k==='box'&&m.y1-m.y0<=.045&&!m.tr);const zf=[];
for(let i=0;i<fl.length;i++)for(let j=i+1;j<fl.length;j++){const a=fl[i],b=fl[j];if(Math.abs(a.y1-b.y1)>.004||a.col===b.col)continue;const dx=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),dz=Math.min(a.z1,b.z1)-Math.max(a.z0,b.z0);if(dx>.05&&dz>.05&&dx*dz>.06)zf.push([a,b,dx*dz])}
console.log('Z-FIGHTING (decalques coplanares de cores diferentes):',zf.length);zf.sort((a,b)=>b[2]-a[2]).slice(0,25).forEach(([a,b,v])=>console.log(` área ${v.toFixed(2)}\n   ${D(a)}\n   ${D(b)}`));
