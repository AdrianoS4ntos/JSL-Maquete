// Auditoria dinâmica: personagens e caminhão x sólidos estáticos, durante TODA a simulação.
const {load,THREE}=require('./mock.js');const h=load(process.argv[2]);const J=h.J,DT=1/15;
const chg=new Set(J.CHS.map(c=>c.c.g));
const inGroup=(o,set)=>{let a=o;while(a){if(set.has(a))return true;a=a.parent}return false};
const mainG=J.main.g;
function aabb(o){const g=o.geometry;if(!g)return null;let w,hh,d,k=g.kind;if(k==='box')[w,hh,d]=g.args;else if(k==='cyl'){w=d=Math.max(g.args[0],g.args[1])*2;hh=g.args[2]??g.args[1]}else return null;
 const c=o.localToWorld(new THREE.Vector3());let ry=0,q=o;while(q){ry+=q.rotation.y;q=q.parent}const cs=Math.abs(Math.cos(ry)),sn=Math.abs(Math.sin(ry));
 const ex=(w*cs+d*sn)/2,ez=(w*sn+d*cs)/2;return{x0:c.x-ex,x1:c.x+ex,z0:c.z-ez,z1:c.z+ez,y0:c.y-hh/2,y1:c.y+hh/2}}
const vis=o=>{let a=o;while(a){if(a.visible===false)return false;a=a.parent}return true};
// sólidos estáticos (nada dentro de personagem ou caminhão móvel); guarda descrição
const dynSet=new Set([...chg,mainG]);const S=[];
J.scene.traverse(o=>{if(!o.isMesh||inGroup(o,dynSet))return;const b=aabb(o);if(!b)return;if(o.material&&o.material.opacity<1)return;
 if(b.y1<.12||b.y1-b.y0<.08||(b.x1-b.x0)<.04||(b.z1-b.z0)<.04)return;
 let top=o;while(top.parent&&top.parent!==J.scene)top=top.parent;b.o=o;b.top=top;b.col=o.material.color?o.material.color.hex:0;b.d=`${o.geometry.kind}(${o.geometry.args.slice(0,3).map(v=>+v.toFixed(2))}) col=${b.col.toString(16)} [${b.x0.toFixed(2)},${b.z0.toFixed(2)}]-[${b.x1.toFixed(2)},${b.z1.toFixed(2)}] y ${b.y0.toFixed(2)}..${b.y1.toFixed(2)}`;S.push(b)});
const hits=new Map();
function check(name,root,tol){root.traverse(o=>{if(!o.isMesh||!vis(o))return;const b=aabb(o);if(!b||b.y0>2.6)return;
 for(const s of S){if(s.top===root)continue;const dx=Math.min(b.x1,s.x1)-Math.max(b.x0,s.x0),dz=Math.min(b.z1,s.z1)-Math.max(b.z0,s.z0),dy=Math.min(b.y1,s.y1)-Math.max(b.y0,s.y0);
  if(dx>tol&&dz>tol&&dy>tol){const k=name+' × '+s.d;const e=hits.get(k)||{n:0,max:0};e.n++;e.max=Math.max(e.max,Math.min(dx,dz,dy));hits.set(k,e)}}})}
h.click('start');let t=0,n=0;
function sample(){J.CHS.forEach((c,i)=>check('char'+i+'('+(c.name||c.role||i)+')',c.c.g,.06));check('CAMINHAO',mainG,.05)}
sample();while(t<140&&!J.FS.done){h.tick(DT);t+=DT;if(++n%2==0)sample()}
const arr=[...hits.entries()].sort((a,b)=>b[1].max-a[1].max);
console.log('sim t=',t.toFixed(1),'pares únicos',arr.length);arr.slice(0,60).forEach(([k,e])=>console.log(` pen=${e.max.toFixed(2)} amostras=${e.n}  ${k}`));
