// Câmera automática da simulação (Iniciar) e tempos de 8 s
const {load}=require('./mock.js');const F=process.argv[2]||require('path').join(__dirname,'..','index.html');
const h=load(F);const J=h.J,DT=1/30;const R=[];const ok=(c,m)=>{R.push((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const T=(x,z)=>Math.hypot(J.goal.t.x-x,J.goal.t.z-z);
const tick=n=>{for(let i=0;i<n;i++)h.tick(DT)};
const truck=()=>{const w=J.main.g.localToWorld(new J.scene.position.constructor());return [w.x,w.z]};
const ev=(t,o)=>h.cv.handlers[t](Object.assign({pointerId:1,button:0,shiftKey:false,ctrlKey:false,clientX:0,clientY:0,preventDefault(){}},o));
tick(5);const r0=J.goal.r;
h.click('start');ok(J.CAM.auto&&!J.CAM.follow,'Iniciar ativa a câmera automática');
let t=0,pc=[J.cur.t.x,J.cur.t.z,J.cur.r],maxStep=0,stepLog={},phLog={},minR=1e9,maxR=0,lostTruck=0,samples=0,lastStep=-1,stepStart=0,textT={},panel0='';
const rec=(k,f)=>{if(!(k in stepLog))stepLog[k]=f()};
while(!J.FS.done&&t<200){h.tick(DT);t+=DT;
 const c=[J.cur.t.x,J.cur.t.z,J.cur.r];maxStep=Math.max(maxStep,Math.hypot(c[0]-pc[0],c[1]-pc[1])+Math.abs(c[2]-pc[2])*.5);pc=c;
 if(J.FS.i!==lastStep){lastStep=J.FS.i;stepStart=t}
 const i=J.FS.i;
 if(i<3&&t-stepStart>5&&!stepLog['s'+i])stepLog['s'+i]={t:[J.goal.t.x,J.goal.t.z],r:J.goal.r,cur:[J.cur.t.x,J.cur.t.z,J.cur.r]};
 if(i===3&&J.CL.ph>=0&&J.CL.ph<5){samples++;const tr=truck();if(t-stepStart>4&&Math.hypot(J.cur.t.x-tr[0],J.cur.t.z-tr[1])>7)lostTruck++;if(t-stepStart>4){minR=Math.min(minR,J.cur.r);maxR=Math.max(maxR,J.cur.r)}
  const k='ph'+J.CL.ph;if(J.CL.ph===3&&!phLog[k])phLog[k]={r:J.goal.r,d:Math.hypot(J.cur.t.x-tr[0],J.cur.t.z-tr[1])}}
 if(i===3&&J.CL.ph===5){if(!stepLog.tri&&J.triT>=12.8&&t>0)stepLog.tri={t,goal:[J.goal.t.x,J.goal.t.z,J.goal.r]};if(J.triT>=13&&!stepLog.triEnd)stepLog.triEnd=t}
 if(i===4&&!stepLog.odsStart)stepLog.odsStart=t;
 if(i===4&&t-stepLog.odsStart>10&&!stepLog.ods6)stepLog.ods6={r:J.goal.r,t:[J.goal.t.x,J.goal.t.z]};
 }
const dtri=(stepLog.odsStart-stepLog.triEnd);
const s0=stepLog.s0,s1=stepLog.s1,s2=stepLog.s2;
ok(s0&&T(-5.5,3.2)>=0&&Math.hypot(s0.cur[0]+5.2,s0.cur[1]-3.3)<2&&s0.cur[2]<20,'etapa 1: câmera aproximada de município + JSL ODS (r='+(s0&&s0.cur[2].toFixed(1))+', centro '+(s0&&s0.cur.slice(0,2).map(v=>v.toFixed(1)))+')');
ok(s1&&Math.hypot(s1.cur[0]+4.6,s1.cur[1]+3.9)<2&&s1.cur[2]<17,'etapa 2: câmera na Diretoria (r='+(s1&&s1.cur[2].toFixed(1))+')');
ok(s2&&Math.hypot(s2.cur[0]-2.9,s2.cur[1]+4.1)<2&&s2.cur[2]<17,'etapa 3: câmera no Administrativo (r='+(s2&&s2.cur[2].toFixed(1))+')');
ok(r0>40,'visão geral inicial distante (r='+r0.toFixed(0)+')');
ok(lostTruck===0&&samples>300,'etapa 4: câmera nunca perde o caminhão (>7 u) em '+samples+' amostras');
ok(maxR<=22.5&&minR>=13,'etapa 4: distância entre '+minR.toFixed(1)+' e '+maxR.toFixed(1)+' (nem colada, nem distante)');
ok(phLog.ph3&&phLog.ph3.r<=16&&phLog.ph3.d<2,'coleta no supermercado: aproxima (r '+(phLog.ph3&&phLog.ph3.r.toFixed(1))+', a '+(phLog.ph3&&phLog.ph3.d.toFixed(1))+' u do caminhão)');
ok(stepLog.tri&&Math.hypot(stepLog.tri.goal[0]-14,stepLog.tri.goal[1]+.2)<.6&&stepLog.tri.goal[2]<14,'triagem: câmera enquadra a área de triagem (alvo '+(stepLog.tri&&stepLog.tri.goal.map(v=>v.toFixed(1)))+')');
ok(dtri>=8&&dtri<8.6,'triagem permanece '+dtri.toFixed(1)+' s após concluir (≥ 8 s)');
ok(stepLog.ods6&&stepLog.ods6.r>40,'etapa 5: após o ODS, visão geral da integração (r='+(stepLog.ods6&&stepLog.ods6.r)+')');
ok(maxStep<3.5,'sem teletransporte: deslocamento máx. por quadro '+maxStep.toFixed(2));
ok(J.FS.done,'simulação concluída (t='+t.toFixed(1)+' s)');
// pausar: câmera não avança
h.click('restart');ok(J.CAM.auto&&Math.abs(J.goal.r-46)<.1&&Math.abs(J.goal.t.x-9)<.1,'reiniciar: câmera volta ao enquadramento inicial');
h.click('start');tick(30*10);h.click('pause');const g=[J.goal.t.x,J.goal.t.z,J.goal.r,J.goal.th,J.goal.ph];tick(30*10);
ok(g.every((v,i)=>Math.abs(v-[J.goal.t.x,J.goal.t.z,J.goal.r,J.goal.th,J.goal.ph][i])<1e-9),'pausa: câmera não troca de enquadramento');
h.click('resume');tick(30*10);ok(J.FS.i===1||J.FS.i===2,'continuar: simulação e câmera retomam (etapa '+(J.FS.i+1)+')');
// controle manual respeitado
const r1=J.goal.r;h.cv.handlers.wheel({deltaY:-300,preventDefault(){}});const rm=J.goal.r;ok(!J.CAM.auto&&rm<r1,'zoom manual na simulação desliga a câmera automática');
tick(30*10);ok(Math.abs(J.goal.r-rm)<1e-9,'câmera automática não disputa com o usuário (r mantido)');
h.click('auto');ok(J.CAM.auto,'botão Câmera automática reativa');tick(30*3);ok(J.CAM.auto,'reativada continua ativa');
h.click('restart');
// fluxo passo a passo: sem avanço automático
h.click('flow');tick(30*20);ok(J.FS.i===0,'fluxo passo a passo não avança sozinho (etapa '+(J.FS.i+1)+')');
console.log(R.join('\n'));console.log(JSON.stringify({dtri:+dtri.toFixed(2),phLog}));
