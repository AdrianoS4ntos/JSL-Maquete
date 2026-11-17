// Auditoria de faces coplanares (z-fighting) em X, Y e Z para todas as caixas
// estáticas alinhadas aos eixos. Duas faces com a mesma normal, no mesmo plano
// (|Δ| ≤ EPS) e com área em comum disputam o depth buffer.
//   - cores diferentes (ou alguma transparente) => z-fighting visível (FALHA)
//   - mesma cor/material                       => face duplicada (aviso)
// Uso: node tests/coplanar.js [index.html] [--dup] [--all]
//   --dup  lista também as faces duplicadas de mesma cor
//   --all  inclui toda a cena (padrão: só prédios e interiores dos 4 setores)
const {load,THREE}=require('./mock.js');
const args=process.argv.slice(2),file=args.find(a=>!a.startsWith('--'));
const h=load(file||require('path').join(__dirname,'..','index.html'));const J=h.J;
const EPS=.002,MIN_A=1e-4,ALL=args.includes('--all'),DUP=args.includes('--dup');
const chg=new Set(J.CHS.map(c=>c.c.g));
// Área dos 4 prédios (BCFG lido do HTML): footprint 6,1×4,2 + marquise/porta à frente.
const src=require('fs').readFileSync(file||require('path').join(__dirname,'..','index.html'),'utf8');
const BC=[...src.matchAll(/(dir|adm|ods|log):{x:(-?[\d.]+),z:(-?[\d.]+),wall:/g)].map(m=>({id:m[1],x:+m[2],z:+m[3]}));
if(BC.length!==4)throw new Error('BCFG não encontrado no HTML');
const naArea=(x,z)=>BC.some(c=>Math.abs(x-c.x)<=3.15&&z>=c.z-2.2&&z<=c.z+3.0);
const M=[];
J.scene.traverse(o=>{
 if(!o.isMesh||!o.geometry||o.geometry.kind!=='box')return;
 let a=o,skip=false;while(a){if(chg.has(a)||a.visible===false)skip=true;a=a.parent}
 if(skip)return;
 let ry=0,rx=0,rz=0,q=o;while(q){ry+=q.rotation.y;rx+=q.rotation.x||0;rz+=q.rotation.z||0;q=q.parent}
 const k=Math.round(ry/(Math.PI/2));if(Math.abs(ry-k*Math.PI/2)>1e-6||Math.abs(rx)>1e-6||Math.abs(rz)>1e-6)return;
 const[w,hh,d]=o.geometry.args,c=o.localToWorld(new THREE.Vector3()),sw=k%2!==0;
 const ex=(sw?d:w)/2,ez=(sw?w:d)/2,ey=hh/2;
 const mat=o.material||{};
 M.push({area:ALL||naArea(c.x,c.z),idx:M.length,b:[[c.x-ex,c.x+ex],[c.y-ey,c.y+ey],[c.z-ez,c.z+ez]],col:mat.color?mat.color.hex:0,tr:(mat.opacity??1)<1,mat,
  desc:`box(${w},${hh},${d})`});
});
const f=v=>v.toFixed(3);
const D=m=>`#${m.idx} ${m.desc} col=${m.col.toString(16)}${m.tr?' (transp)':''} x[${f(m.b[0][0])},${f(m.b[0][1])}] y[${f(m.b[1][0])},${f(m.b[1][1])}] z[${f(m.b[2][0])},${f(m.b[2][1])}]`;
// Oclusão: a região comum só importa se estiver exposta. Amostra pontos logo à
// frente da face (OFF na direção da normal); se caírem dentro de um sólido
// opaco, aquele trecho está escondido e não pode cintilar.
const OFF=.003,OCC=M.filter(m=>!m.tr);
const dentro=(p,m)=>p[0]>m.b[0][0]&&p[0]<m.b[0][1]&&p[1]>m.b[1][0]&&p[1]<m.b[1][1]&&p[2]>m.b[2][0]&&p[2]<m.b[2][1];
function exposto(A,B,ax,s,o,r){const N=6;let vis=0;const p=[0,0,0];p[ax]=A.b[ax][s]+(s?OFF:-OFF);
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){p[o[0]]=r[0][0]+(r[0][1]-r[0][0])*(i+.5)/N;p[o[1]]=r[1][0]+(r[1][1]-r[1][0])*(j+.5)/N;
  if(!OCC.some(m=>m!==A&&m!==B&&dentro(p,m)))vis++}
 return vis/(N*N)}
const AX='xyz',vis=[],dup=[],SC=M.filter(m=>m.area);
for(let i=0;i<SC.length;i++)for(let j=i+1;j<SC.length;j++){const A=SC[i],B=SC[j];
 for(let ax=0;ax<3;ax++)for(let s=0;s<2;s++){
  if(Math.abs(A.b[ax][s]-B.b[ax][s])>EPS)continue;
  const o=[0,1,2].filter(n=>n!==ax);let area=1;const r=[];
  for(const n of o){const lo=Math.max(A.b[n][0],B.b[n][0]),hi=Math.min(A.b[n][1],B.b[n][1]);if(hi-lo<=EPS){area=0;break}area*=hi-lo;r.push([lo,hi])}
  if(area<MIN_A)continue;
  const fr=exposto(A,B,ax,s,o,r);if(fr===0)continue;area*=fr;
  const same=A.mat===B.mat||(A.col===B.col&&!A.tr&&!B.tr);
  (same?dup:vis).push({A,B,face:`${s?'+':'-'}${AX[ax]}`,plane:A.b[ax][s],area});
 }}
console.log('caixas auditadas',SC.length,'(oclusores',OCC.length+')',ALL?'(cena inteira)':'(prédios + interiores dos setores)');
console.log('Z-FIGHTING VISÍVEL (faces coplanares, cores diferentes):',vis.length);
vis.sort((a,b)=>b.area-a.area).slice(0,40).forEach(p=>console.log(` face ${p.face}=${f(p.plane)} área ${p.area.toFixed(4)}\n   ${D(p.A)}\n   ${D(p.B)}`));
if(args.includes('--sum')){const g={};(DUP?dup:vis).forEach(p=>{const k=[p.A.desc+' '+p.A.col.toString(16),p.B.desc+' '+p.B.col.toString(16)].sort().join(' × ')+' '+p.face[1];g[k]=(g[k]||0)+1});
 Object.entries(g).sort((a,b)=>b[1]-a[1]).forEach(([k,n])=>console.log('  ',n,k))}
console.log('FACES DUPLICADAS (mesma cor):',dup.length);
if(DUP)dup.sort((a,b)=>b.area-a.area).slice(0,40).forEach(p=>console.log(` face ${p.face}=${f(p.plane)} área ${p.area.toFixed(4)}\n   ${D(p.A)}\n   ${D(p.B)}`));
process.exitCode=vis.length?1:0;
