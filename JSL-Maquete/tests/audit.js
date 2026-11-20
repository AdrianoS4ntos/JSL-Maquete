// Auditoria geométrica básica da cena (caixas estáticas). Uso: node tests/audit.js [index.html]
const {load,THREE}=require('./mock.js');const h=load(process.argv[2]||require('path').join(__dirname,'..','index.html'));const J=h.J;
const chg=new Set(J.CHS.map(c=>c.c.g));
const M=[];J.scene.traverse(o=>{if(!o.isMesh||!o.geometry)return;let a=o,skip=false;while(a){if(chg.has(a))skip=true;a=a.parent}if(skip)return;
 const g=o.geometry;let w,hh,d,k=g.kind;if(k==='box')[w,hh,d]=g.args;else if(k==='cyl'){w=d=Math.max(g.args[0],g.args[1])*2;hh=g.args[2]??g.args[1]}else if(k==='cone'){w=d=g.args[0]*2;hh=g.args[1]}else return;
 const c=o.localToWorld(new THREE.Vector3());let ry=0,q=o;while(q){ry+=q.rotation.y;q=q.parent}const cs=Math.abs(Math.cos(ry)),sn=Math.abs(Math.sin(ry));const ex=(w*cs+d*sn)/2,ez=(w*sn+d*cs)/2;
 let top=o;while(top.parent&&top.parent!==J.scene)top=top.parent;
 M.push({o,k,x0:c.x-ex,x1:c.x+ex,z0:c.z-ez,z1:c.z+ez,y0:c.y-hh/2,y1:c.y+hh/2,col:o.material.color?o.material.color.hex:0,tr:o.material.opacity<1,top,idx:M.length,desc:`${k}(${w.toFixed?w.toFixed(2):w},${hh.toFixed(2)},${d.toFixed(2)})`})});
const f=v=>v.toFixed(2);const D=m=>`#${m.idx} ${m.desc} col=${m.col.toString(16)} [${f(m.x0)},${f(m.z0)}]-[${f(m.x1)},${f(m.z1)}] y ${f(m.y0)}..${f(m.y1)}`;
console.log('meshes',M.length);
// a) fora do terreno
const out=M.filter(m=>m.x0<-9.01||m.x1>27.01||m.z0<-15.51||m.z1>20.51);console.log('\nA) FORA DO TERRENO',out.length);out.slice(0,15).forEach(m=>console.log(' ',D(m)));
// c) enterrado
const bur=M.filter(m=>m.y1<.095&&m.y1>-.5);console.log('\nC) TOTALMENTE ABAIXO DO PISO (y1<.095)',bur.length);bur.slice(0,10).forEach(m=>console.log(' ',D(m)));
// b) flutuando
const fl=M.filter(m=>m.y0>.3&&!m.tr).filter(m=>!M.some(n=>n!==m&&Math.abs(n.y1-m.y0)<.06&&n.x0<m.x1-.02&&n.x1>m.x0+.02&&n.z0<m.z1-.02&&n.z1>m.z0+.02));
console.log('\nB) POSSIVELMENTE FLUTUANDO (y0>0.3 sem apoio)',fl.length);fl.slice(0,60).forEach(m=>console.log(' ',D(m)));
// d) sobreposição de sólidos
const solid=M.filter(m=>!m.tr&&m.y1-m.y0>.12&&m.y1>.3&&(m.x1-m.x0)>.05&&(m.z1-m.z0)>.05);
const ov=[];for(let i=0;i<solid.length;i++)for(let j=i+1;j<solid.length;j++){const a=solid[i],b=solid[j];if(a.top===b.top&&a.top!==undefined&&a.o.parent===b.o.parent&&a.top!==J.scene)continue;
 const dx=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),dz=Math.min(a.z1,b.z1)-Math.max(a.z0,b.z0),dy=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0);if(dx>.05&&dz>.05&&dy>.05){const v=dx*dz*dy;const sm=Math.min((a.x1-a.x0)*(a.z1-a.z0)*(a.y1-a.y0),(b.x1-b.x0)*(b.z1-b.z0)*(b.y1-b.y0));if(v/sm>.35&&v>.01)ov.push([a,b,v,v/sm])}}
console.log('\nD) SOBREPOSIÇÕES entre meshes de grupos distintos',ov.length);
const key=m=>m.top===J.scene?'scene':(m.top.__n||(m.top.__n='g'+Math.random().toString(36).slice(2,5)));
ov.sort((a,b)=>b[2]-a[2]).slice(0,60).forEach(([a,b,v,r])=>console.log(` v=${v.toFixed(2)} r=${r.toFixed(2)}\n    ${D(a)} {${key(a)}}\n    ${D(b)} {${key(b)}}`));
