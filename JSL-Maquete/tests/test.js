const {load,THREE}=require('./mock.js');
const FILE=process.argv[2]||require('path').join(__dirname,'..','index.html');
const R=[];const ok=(c,m)=>{R.push((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
let h=load(FILE);const J=h.J,DT=1/30;
const pos=()=>{const p=J.main.g.localToWorld(new THREE.Vector3());return[p.x,p.z]};
const chg=new Set(J.CHS.map(c=>c.c.g));
const snapChars=()=>J.CHS.map(s=>[s.c.g.position.x,s.c.g.position.z,s.c.g.visible]);
// ---- interface ----
ok(!/class="card/.test(h.html)&&!/class="cards/.test(h.html),'nenhum cartão superior no HTML');
ok(!/Simular processo|Simular coleta externa/.test(h.html),'botões antigos removidos');
const simBtns=['start','pause','resume','restart'].filter(v=>new RegExp('data-v="'+v+'"').test(h.html));
ok(simBtns.length===4,'um único conjunto de controles: '+simBtns.join(','));
const init=snapChars(),p0=pos();
ok(J.CHS.length===13,'13 personagens');
// ---- simulação completa ----
h.click('start');let t=0,tl=[],last=-9;const trk=[];let maxJump=0,prev=pos(),stopT=0,collected=0,minStopDur=0;
const pathPts=[];
while(t<140&&!(J.FS.done)){h.tick(DT);t+=DT;if(J.FS.i!==last){tl.push([+t.toFixed(1),J.FS.i]);last=J.FS.i}
 const p=pos();const d=Math.hypot(p[0]-prev[0],p[1]-prev[1]);maxJump=Math.max(maxJump,d);prev=p;let wr=0,q=J.main.g;while(q){wr+=q.rotation.y;q=q.parent}pathPts.push([t,p[0],p[1],wr,J.FS.i,J.CL.ph]);}
console.log('linha do tempo (t,etapa):',JSON.stringify(tl));
ok(J.FS.done,'simulação termina (t='+t.toFixed(1)+'s)');
ok(tl.map(x=>x[1]).join()==='0,1,2,3,4','sequência 0..4: '+tl.map(x=>x[1]).join());
const dur=i=>{const a=tl.findIndex(x=>x[1]===i);return (tl[a+1]?tl[a+1][0]:t)-tl[a][0]};
[0,1,2].forEach(i=>ok(dur(i)>=8&&dur(i)<8.6,`etapa ${i+1} = 8 s (${dur(i).toFixed(1)} s)`));ok(dur(4)>=12&&dur(4)<12.6,`etapa 5 = 8 s no ODS + 4 s de visão geral (${dur(4).toFixed(1)} s)`);
ok(dur(3)>15,'etapa 4 mais longa ('+dur(3).toFixed(1)+' s)');
ok(maxJump<0.25,'sem teletransporte: salto máx por frame '+maxJump.toFixed(3));
// parada no supermercado
const st=pathPts.filter(p=>p[5]===2||p[5]===3);const sp=st[0];
ok(st.length>0&&Math.abs(sp[1]-9.8)<.2&&Math.abs(sp[2]-13.2)<.2,'parou no ponto de coleta ('+sp.slice(1,3).map(v=>v.toFixed(2))+')');
ok(st.length*DT>6,'tempo parado/coletando '+(st.length*DT).toFixed(1)+' s');
const fin=pos();ok(Math.hypot(fin[0]-p0[0],fin[1]-p0[1])<.2,'retorna à base ('+fin.map(v=>v.toFixed(2))+')');
ok(J.CL.cl===4,'4 categorias coletadas');
ok(pathPts.some(p=>p[4]===3&&p[5]===0)&&pathPts.some(p=>p[5]===1)&&pathPts.some(p=>p[5]===4),'fases saída/percurso/retorno ocorreram');
// ---- obstáculos: caminhão ----
function boxes(){const out=[];J.scene.traverse(o=>{if(!o.isMesh||!o.geometry)return;let a=o,under=false;while(a){if(a===J.main.g||chg.has(a))under=true;a=a.parent}if(under)return;const g=o.geometry;let w,hh,d;if(g.kind==='box'){[w,hh,d]=g.args}else if(g.kind==='cyl'){w=d=g.args[0]*2;hh=g.args[2]??g.args[1]}else return;
 const c=o.localToWorld(new THREE.Vector3());const y0=c.y-hh/2,y1=c.y+hh/2;if(y1<0.26||y0>1.3)return;
 // rotação y acumulada
 let ry=0,q=o;while(q){ry+=q.rotation.y;q=q.parent}const cs=Math.abs(Math.cos(ry)),sn=Math.abs(Math.sin(ry));const ex=(w*cs+d*sn)/2,ez=(w*sn+d*cs)/2;
 out.push({x0:c.x-ex,x1:c.x+ex,z0:c.z-ez,z1:c.z+ez,y0,y1,o})});return out}
const B=boxes();
function hits(px,pz,ry,hl,hw){const c=Math.cos(ry),s=Math.sin(ry);const r=[];for(let a=-hl;a<=hl;a+=.3)for(let b=-hw;b<=hw;b+=.3){const x=px+a*c+b*s,z=pz-a*s+b*c;B.forEach(q=>{if(x>q.x0&&x<q.x1&&z>q.z0&&z<q.z1)r.push(q)})}return r}
const bad=new Map();pathPts.forEach(p=>{if(p[4]<3)return;hits(p[1],p[2],p[3],1.3,.5).forEach(q=>bad.set(q,[p[1].toFixed(1),p[2].toFixed(1)]))});
ok(bad.size===0,'caminhão não atravessa objetos (colisões: '+bad.size+')'+[...bad.entries()].slice(0,6).map(([q,p])=>` [${p}] box(${q.x0.toFixed(1)},${q.z0.toFixed(1)})-(${q.x1.toFixed(1)},${q.z1.toFixed(1)})`).join(''));
// ---- pausar / continuar ----
h.click('restart');ok(J.FS.i===-1&&!J.FS.auto,'reiniciar → pronto p/ iniciar');
h.click('start');for(let i=0;i<30*24+30*11;i++)h.tick(DT); // meio da etapa 4
const s1=pos(),c1=snapChars(),ft=J.FS.t,fi=J.FS.i;
ok(fi===3,'pausa ocorre durante etapa 4 (etapa '+(fi+1)+')');
h.click('pause');ok(J.SIM.paused&&h.btns.find(b=>b.dataset.v==='resume').disabled===false&&h.btns.find(b=>b.dataset.v==='pause').disabled===true,'estado dos botões pausado');
for(let i=0;i<300;i++)h.tick(DT);
const s2=pos(),c2=snapChars();
ok(Math.hypot(s1[0]-s2[0],s1[1]-s2[1])<1e-9&&J.FS.t===ft&&J.FS.i===fi,'pausa congela caminhão e cronômetro');
ok(JSON.stringify(c1)===JSON.stringify(c2),'pausa congela personagens');
h.click('resume');for(let i=0;i<60;i++)h.tick(DT);const s3=pos();
ok(Math.hypot(s3[0]-s2[0],s3[1]-s2[1])>.2||J.CL.s||J.f2.w>0,'continuar retoma de onde parou');
// pausar/continuar em cada etapa
const stagesSeen=new Set();h.click('restart');h.click('start');let guard=0;
while(!J.FS.done&&guard++<9000){h.tick(DT);if(!stagesSeen.has(J.FS.i)&&J.FS.i>=0){stagesSeen.add(J.FS.i);for(let k=0;k<10;k++)h.tick(DT);const a=JSON.stringify([pos(),J.FS.t,J.FS.i]);h.click('pause');for(let k=0;k<60;k++)h.tick(DT);ok(JSON.stringify([pos(),J.FS.t,J.FS.i])===a,`pausa na etapa ${J.FS.i+1} estável`);h.click('resume')}}
ok(J.FS.done&&stagesSeen.size===5,'pausar/continuar em todas as 5 etapas e ainda concluir');
// ---- reiniciar durante movimento ----
h.click('restart');h.click('start');for(let i=0;i<30*24+30*8;i++)h.tick(DT);
const moving=Math.hypot(pos()[0]-p0[0],pos()[1]-p0[1])>1;ok(moving,'caminhão em movimento antes de reiniciar');
h.click('restart');for(let i=0;i<3;i++)h.tick(DT);
const pr=pos();ok(Math.hypot(pr[0]-p0[0],pr[1]-p0[1])<.01&&J.CL.ph===-1&&!J.CL.on&&!J.f2.run,'reiniciar devolve caminhão à base e zera coleta');
const cs=snapChars();let dpos=0;cs.forEach((c,i)=>{dpos=Math.max(dpos,Math.hypot(c[0]-init[i][0],c[1]-init[i][1]))});ok(dpos<.05,'personagens voltam às posições originais (desvio máx '+dpos.toFixed(3)+')');
J.scene.traverse(()=>{});let flying=0;J.scene.children.forEach(c=>{});
// reiniciar de outra etapa e rodar de novo: mesma linha do tempo
h.click('start');let t2=0,tl2=[],l2=-9;while(t2<140&&!J.FS.done){h.tick(DT);t2+=DT;if(J.FS.i!==l2){tl2.push([+t2.toFixed(1),J.FS.i]);l2=J.FS.i}}
ok(JSON.stringify(tl2.map(x=>x[1]))==='[0,1,2,3,4]'&&Math.abs(t2-t)<1,'nova execução após reiniciar idêntica (t='+t2.toFixed(1)+' vs '+t.toFixed(1)+')');
// ---- reiniciar durante cada etapa ----
for(let stp=0;stp<5;stp++){h.click('restart');h.click('start');let n=0;while(J.FS.i<stp&&n++<9000)h.tick(DT);for(let k=0;k<45;k++)h.tick(DT);h.click('restart');for(let k=0;k<3;k++)h.tick(DT);
 const q=pos();const cc=snapChars();let dd=0;cc.forEach((c,i)=>dd=Math.max(dd,Math.hypot(c[0]-init[i][0],c[1]-init[i][1])));ok(Math.hypot(q[0]-p0[0],q[1]-p0[1])<.01&&dd<.05&&J.FS.i===-1,`reiniciar durante etapa ${stp+1} restaura estado`)}
// ---- personagens: caminhada x paredes/móveis ----
h.click('restart');h.click('start');const wb=B.filter(q=>q.o&&true);const walkBad=new Map();let g2=0;
function chHits(x,z){const r=[];B.forEach(q=>{if(x+.2>q.x0&&x-.2<q.x1&&z+.2>q.z0&&z-.2<q.z1&&q.y0<1.0&&q.y1>.4)r.push(q)});return r}
while(!J.FS.done&&g2++<9000){h.tick(DT);J.CHS.forEach((s,idx)=>{const sc=s.sc[s.i];if(sc&&sc.a==='walk'){const p=s.c.g.position;const home=s.home;let x=p.x,z=p.z;if(home){const w=s.c.g.localToWorld(new THREE.Vector3());x=w.x;z=w.z}
  if(!s.__st||s.__st.i!==s.i){s.__st={i:s.i,x:x,z:z}}chHits(x,z).forEach(q=>{if(Math.hypot(x-s.__st.x,z-s.__st.z)<.8)return;{const pa=s.path;if(pa){const e=pa[pa.length-1];let ex=e[0],ez=e[1];if(s.home){const w=s.c.g.parent.localToWorld(new THREE.Vector3(ex,0,ez));ex=w.x;ez=w.z}if(Math.hypot(x-ex,z-ez)<.8)return}}if(!q.o.userData.__ok)walkBad.set(idx+':'+q.x0.toFixed(1)+','+q.z0.toFixed(1),[x.toFixed(2),z.toFixed(2),q.x0.toFixed(2),q.z0.toFixed(2),q.x1.toFixed(2),q.z1.toFixed(2),q.y0.toFixed(2),q.y1.toFixed(2)])})}})}
ok(walkBad.size===0,'personagens em caminhada não atravessam objetos (ocorrências '+walkBad.size+')');
if(walkBad.size)[...walkBad.entries()].slice(0,12).forEach(([k,v])=>console.log('  char',k,'pos',v[0],v[1],'box',v.slice(2).join(' ')));
console.log(R.join('\n'));
