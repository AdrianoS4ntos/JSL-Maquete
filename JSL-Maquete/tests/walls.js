// Auditoria das paredes dos 4 prédios setoriais: faces coplanares (z-fighting / faces duplicadas)
// e interpenetração entre peças estruturais. Uso: node tests/walls.js [-v]
const {load,THREE}=require('./mock.js');const h=load(require('path').join(__dirname,'..','index.html'));const J=h.J;
const V=process.argv.includes('-v');const R=[];const ok=(c,m)=>{R.push((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const chg=new Set(J.CHS.map(c=>c.c.g));const inBG=new Map();Object.entries(J.BG).forEach(([id,g])=>g.traverse(o=>inBG.set(o,id)));
const E=1e-3,f=v=>v.toFixed(3);
const M=[];J.scene.traverse(o=>{if(!o.isMesh||!o.geometry||o.geometry.kind!=='box'||!o.visible)return;let a=o,skip=false,ry=0;while(a){if(chg.has(a)||a===J.main.g)skip=true;ry+=a.rotation.y;if(a.rotation.x||a.rotation.z)skip=true;a=a.parent}if(skip)return;
 const q=Math.abs(ry/(Math.PI/2)-Math.round(ry/(Math.PI/2)));if(q>1e-6)return; // só peças alinhadas aos eixos
 const [w,hh,d]=o.geometry.args,sw=Math.round(ry/(Math.PI/2))%2!==0,ex=(sw?d:w)/2,ez=(sw?w:d)/2;const c=o.localToWorld(new THREE.Vector3());
 M.push({o,id:inBG.get(o),b:[[c.x-ex,c.x+ex],[c.y-hh/2,c.y+hh/2],[c.z-ez,c.z+ez]],col:o.material.color.hex,tr:o.material.opacity<1,idx:M.length})});
const B=M.filter(m=>m.id);
const D=m=>`#${m.idx}${m.id?'['+m.id+']':''} col=${m.col.toString(16)}${m.tr?' (vidro)':''} x ${f(m.b[0][0])}..${f(m.b[0][1])} y ${f(m.b[1][0])}..${f(m.b[1][1])} z ${f(m.b[2][0])}..${f(m.b[2][1])}`;
const ov=(a,b,k)=>Math.min(a.b[k][1],b.b[k][1])-Math.max(a.b[k][0],b.b[k][0]);
// faces coplanares com mesma orientação e área comum > 1 cm²
// a região comum é ignorada só se estiver oculta: encostada na face oposta de outra peça opaca ou embutida nela
const OP=M.filter(m=>!m.tr);
function hidden(a,b,k,s,o){const p=a.b[k][s],lo=o.map(i=>Math.max(a.b[i][0],b.b[i][0])),hi=o.map(i=>Math.min(a.b[i][1],b.b[i][1]));
 return OP.some(c=>c!==a&&c!==b&&o.every((i,n)=>c.b[i][0]<=lo[n]+E&&c.b[i][1]>=hi[n]-E)&&(Math.abs(c.b[k][1-s]-p)<=E||(c.b[k][0]<p-E&&c.b[k][1]>p+E)))}
function coplanar(a,b){const out=[];for(let k=0;k<3;k++)for(let s=0;s<2;s++){if(Math.abs(a.b[k][s]-b.b[k][s])>E)continue;const o=[0,1,2].filter(i=>i!==k);const u=ov(a,b,o[0]),v=ov(a,b,o[1]);if(u>.01&&v>.01&&!hidden(a,b,k,s,o))out.push('xyz'[k]+(s?'+':'-')+'@'+f(a.b[k][s])+' área '+(u*v).toFixed(4))}return out}
const cp=[],cpDiff=[];for(const a of B)for(const b of M){if(b===a||(b.id&&b.idx<a.idx))continue;const r=coplanar(a,b);if(r.length)(a.col===b.col&&a.tr===b.tr?cp:cpDiff).push([a,b,r])}
console.log('Z-FIGHTING paredes (faces coplanares de cores/materiais diferentes):',cpDiff.length);
cpDiff.slice(0,V?999:20).forEach(([a,b,r])=>console.log(`  ${r.join('; ')}\n    ${D(a)}\n    ${D(b)}`));
console.log('Faces coplanares duplicadas (mesma cor):',cp.length);cp.slice(0,V?999:20).forEach(([a,b,r])=>console.log(`  ${r.join('; ')}\n    ${D(a)}\n    ${D(b)}`));
ok(cpDiff.length===0,'paredes sem faces coplanares de cores diferentes (z-fighting): '+cpDiff.length);
ok(cp.length===0,'paredes sem faces coplanares duplicadas: '+cp.length);
// interpenetração entre peças estruturais opacas do mesmo prédio (paredes, pilares, vigas, faixas)
// aceita somente "revestimento": uma peça envolve a outra por completo em duas direções (rodapé/faixa sobre a parede)
const ST=B.filter(m=>!m.tr&&Math.abs(m.b[1][0]-.2)<=E&&m.b[1][1]-m.b[1][0]>=.3); // peças verticais apoiadas na laje: paredes, pilares, peitoris, rodapés, batentes
const pen=[];for(let i=0;i<ST.length;i++)for(let j=i+1;j<ST.length;j++){const a=ST[i],b=ST[j];if(a.id!==b.id)continue;const o=[0,1,2].map(k=>ov(a,b,k));if(o.some(v=>v<=E))continue;
 const cont=k=>(a.b[k][0]<=b.b[k][0]+E&&a.b[k][1]>=b.b[k][1]-E)||(b.b[k][0]<=a.b[k][0]+E&&b.b[k][1]>=a.b[k][1]-E);const nc=[0,1,2].filter(cont).length;
 if(nc<2)pen.push([a,b,o[0]*o[1]*o[2]])}
console.log('Interseções entre peças adjacentes (cruzamento parcial):',pen.length);pen.slice(0,V?999:20).forEach(([a,b,v])=>console.log(`  vol ${v.toFixed(5)}\n    ${D(a)}\n    ${D(b)}`));
ok(pen.length===0,'sem interseções parciais entre paredes/pilares/vigas: '+pen.length);
// juntas entre setores: nenhuma peça de um prédio invade outro prédio
const cross=[];for(const a of B)for(const b of B){if(a.idx>=b.idx||a.id===b.id)continue;if([0,1,2].every(k=>ov(a,b,k)>-E))cross.push([a,b])}
ok(cross.length===0,'prédios não se tocam nem se sobrepõem: '+cross.length);
// cantos: as peças verticais de canto fecham sem vão (paredes/pilares cobrem a junção)
ok(Object.keys(J.BG).length===4,'4 prédios auditados ('+B.length+' peças)');
R.forEach(l=>console.log(l));
