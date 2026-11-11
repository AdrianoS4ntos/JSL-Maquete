// Testes das 4 melhorias (painel por setor, indicadores, modo apresentação, triagem)
const {load,THREE}=require('./mock.js');
const FILE=process.argv[2]||require('path').join(__dirname,'..','index.html');
const R=[];const ok=(c,m)=>{R.push((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
let h=load(FILE);const J=h.J,DT=1/30;const tick=n=>{for(let i=0;i<n;i++)h.tick(DT)};
const panelClick=a=>h.els['#panel'].handlers.click({target:{closest:()=>({dataset:{act:a}})}});
// 1) painéis por setor
ok(!J.PR.on,'apresentação NÃO inicia sozinha ao abrir');
for(const id of ['dir','adm','log','ods']){h.click(id);const p=h.panel();
 ok(J.mode==='sec'&&/Principais responsabilidades/.test(p)&&/Recebe dos outros setores/.test(p)&&/Entrega para os outros setores/.test(p)&&/Personagens e atividades/.test(p)&&/Fechar/.test(p),'painel do setor '+id+' completo');
 ok(!/Principais responsabilidades[\s\S]*Principais responsabilidades/.test(p),'apenas um painel aberto ('+id+')')}
ok(/Planejamento das rotas de coleta/.test((h.click('log'),h.panel())),'conteúdo Logística conforme pedido');
ok(/Agenda 2030/.test((h.click('ods'),h.panel())),'conteúdo JSL ODS cita Agenda 2030');
ok(/PLÁSTICO/.test((h.click('log'),h.panel())),'painel da Logística lista categorias da triagem');
panelClick('close');ok(J.mode==='ov','fechar painel volta à visão geral');
// 2) indicadores
let v=J.hudVals();ok(v[0]==='4'&&v[1]==='2'&&v[2]==='0 t'&&v[3]==='0/5'&&v[4]==='Aguardando','indicadores iniciais: '+v.join(' | '));
h.click('start');tick(30*10);v=J.hudVals();ok(v[4]==='Em andamento'&&v[3]==='1/5'&&/Diretoria|Administrativo/.test(v[5]),'indicadores na etapa 2: '+v.join(' | '));
let guard=0;while(J.FS.i<3&&guard++<9000)tick(1);tick(30);
let maxW=0;guard=0;while(!J.FS.done&&guard++<9000){tick(1);const w=J.hudVals()[2];maxW=Math.max(maxW,parseFloat(w.replace(',','.'))||0)}
v=J.hudVals();ok(v[4]==='Finalizada'&&v[3]==='5/5','indicadores ao final: '+v.join(' | '));ok(maxW>=1.3&&maxW<=1.5,'resíduos ilustrativos aumentam durante a coleta (máx '+maxW+' t)');
h.click('restart');tick(5);v=J.hudVals();ok(v[3]==='0/5'&&v[2]==='0 t'&&v[4]==='Aguardando','reiniciar zera indicadores: '+v.join(' | '));
h.click('start');tick(30*12);h.click('pause');tick(5);ok(J.hudVals()[4]==='Pausada','pausa reflete nos indicadores');h.click('resume');h.click('restart');
// 3) triagem (determinística)
const items=[];J.scene.traverse(o=>{if(o.isMesh&&o.geometry.kind==='box'&&o.geometry.args[0]===.2&&o.geometry.args[1]===.2&&o.geometry.args[2]===.2)items.push(o)});
ok(items.length===5,'5 itens de material na esteira');
J.setTri(-1);ok(items.every(m=>!m.visible),'sem triagem: nada na esteira');
const bins=[];J.scene.traverse(o=>{});
J.setTri(.5);ok(items.some(m=>m.visible),'chegada dos resíduos: itens aparecem');
let bad=0;for(let T=0;T<=13;T+=.05){J.setTri(T);items.forEach((m,i)=>{if(m.visible){const w=m.position;if(!(w.y>.1&&w.y<2.2))bad++}})}
ok(bad===0,'itens sempre acima do piso e abaixo de 2,2');
// cada item termina no contêiner da própria cor: x == 10.3+0.5*i
const cols=J.CAT.map(c=>c[1]);let wrong=0;for(let i=0;i<5;i++){const ts=2+1.2*i,d1=(12.65+.2*i)-(10.3+.5*i);J.setTri(ts+d1+.49);const m=items.find(x=>x.visible&&x.material.color.hex===cols[i]);if(!m||Math.abs(m.position.x-(10.3+.5*i))>.05||m.position.z>-.4)wrong++}
ok(wrong===0,'cada material cai no contêiner da sua categoria (cor/posição)');
J.setTri(13);ok(items.every(m=>!m.visible),'triagem concluída: esteira vazia');
// 4) modo apresentação
const seq=[];h.click('pres');ok(J.PR.on&&J.mode==='pres','modo apresentação ativa');
let t=0;guard=0;let last=-1,camJump=0,pc=null;
while(J.PR.on&&guard++<9000&&!(J.PR.i===5&&J.PR.t>13)){tick(1);t+=DT;if(J.PR.i!==last){seq.push(J.PR.i);last=J.PR.i}
 const c=[J.cur.t.x,J.cur.t.z,J.cur.r];if(pc){camJump=Math.max(camJump,Math.hypot(c[0]-pc[0],c[1]-pc[1])+Math.abs(c[2]-pc[2]))}pc=c}
ok(seq.join()==='0,1,2,3,4,5','apresentação percorre as 6 etapas: '+seq.join(','));
ok(camJump<4,'câmera sem saltos (easing 7%/quadro, sem cortes) (máx por quadro '+camJump.toFixed(2)+')');
ok(J.CL.ph===5&&J.FS.i===-1,'etapa 4 executou a coleta completa sem usar a simulação principal');
// pausa
h.click('pres');ok(!J.PR.on&&J.mode==='ov'&&J.CAM.auto,'encerrar devolve a câmera (modo visão geral)');
h.click('pres');J.presGo(1);tick(30);const t1=J.PR.t;J.presPause();tick(60);ok(J.PR.t===t1&&J.PR.paused,'pausa congela a apresentação');J.presPause();tick(30);ok(J.PR.t>t1,'continuar retoma');
J.presGo(2);ok(J.PR.i===2,'avançar');J.presGo(1);ok(J.PR.i===1,'voltar');
// conflito: iniciar simulação encerra apresentação
h.click('start');ok(!J.PR.on&&J.FS.i===0,'iniciar simulação encerra a apresentação (sem modos simultâneos)');
console.log(R.join('\n'));
