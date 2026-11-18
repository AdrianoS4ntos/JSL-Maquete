// Narrador ao vivo no cabeçalho (layout mobile). Uso: node tests/narrator.js [index.html]
const {load}=require('./mock.js');const path=require('path'),fs=require('fs');
const FILE=process.argv[2]||path.join(__dirname,'..','index.html');
const R=[];const ok=(c,m)=>{R.push((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const h=load(FILE),J=h.J,DT=1/30,src=fs.readFileSync(FILE,'utf8');
const css=(src.match(/<style>([\s\S]*?)<\/style>/)||['',''])[1].replace(/\/\*[\s\S]*?\*\//g,'');

// ---- CSS: narrador só existe no celular; desktop preservado ----
ok(/<header><h1>JSL — MODELO DEMONSTRATIVO DE INTEGRAÇÃO ENTRE SETORES<\/h1>/.test(src),'título padrão mantido no HTML');
ok(/<div class="hnar" id="hnar"[^>]*><\/div><\/header>/.test(src),'contêiner do narrador dentro do cabeçalho');
ok(/(^|\n)\.hnar\{display:none\}/.test(css),'narrador oculto por padrão (desktop)');
// toda regra que usa .narrating/.hnar (exceto o display:none base) deve estar dentro de @media mobile
const top=[];let depth=0,buf='',inMob=false,stack=[];
for(const ch of css){buf+=ch;if(ch==='{'){const sel=buf.slice(0,-1).trim();stack.push(sel);if(depth===0&&/^@media/.test(sel))inMob=/max-width:7[0-9]{2}px|max-height:500px/.test(sel);depth++;buf=''}
 else if(ch==='}'){depth--;const sel=stack.pop();if(depth===0&&!/^@media/.test(sel))top.push(sel);buf=''}}
ok(!top.some(s=>/narrating/.test(s))&&top.filter(s=>/hnar/.test(s)).join()==='.hnar','nenhuma regra .narrating/.hnar fora das media queries mobile');
const MQ=/@media \(max-width:768px\),\(orientation:landscape\) and \(max-height:500px\) and \(pointer:coarse\)\{/;
ok(MQ.test(css),'media query do narrador: retrato ≤768px e paisagem de celular');
ok(/body\.narrating \.view\{[^}]*calc\(100svh - var\(--hdr/.test(css),'retrato: altura da maquete = tela − cabeçalho (primeira dobra)');

// ---- estado inicial ----
for(let i=0;i<5;i++)h.tick(DT);
ok(J.narrOn===false,'estado inicial: sem narração (título padrão)');

// ---- simulação ----
h.click('start');h.tick(DT);
ok(J.narrOn===true,'Iniciar ativa o narrador');
let n=J.narrData();
ok(n.t==='ETAPA 1 — SOLICITAÇÃO MUNICIPAL'&&/município apresenta/.test(n.d),'etapa 1: título e texto completos');
ok(n.bar.length===5&&n.bar.filter(Boolean).length===1,'barra de progresso 1/5');
const seen=new Set(),subs=new Set();let t=0;
while(t<140&&!J.FS.done){h.tick(DT);t+=DT;if(!J.narrOn)break;n=J.narrData();seen.add(n.t);if(J.FS.i===3){subs.add(n.sub);ok.sub3=ok.sub3||n.bar.filter(Boolean).length===4}
 if(J.FS.i===2&&!ok.p){ok.p=1;h.click('pause');h.tick(DT);ok(/pausada/.test(J.narrData().st)&&J.narrOn,'pausa mantém narrador e indica “pausada”');h.click('resume');h.tick(DT)}}
ok(['ETAPA 1 — SOLICITAÇÃO MUNICIPAL','ETAPA 2 — DIRETORIA','ETAPA 3 — ADMINISTRATIVO','ETAPA 4 — LOGÍSTICA E OPERAÇÕES','ETAPA 5 — JSL ODS'].every(x=>seen.has(x)),'narrador percorre as 5 etapas');
ok(ok.sub3,'etapa 4: barra 4/5');
const sl=[...subs].join(' ¦ ');
ok(['SAÍDA DA BASE','PERCURSO PELA RUA','CHEGADA AO SUPERMERCADO','COLETA DOS RESÍDUOS','RETORNO PELA RUA'].every(x=>sl.includes(x)),'etapa 4: subfases da coleta atualizadas ao vivo');
ok(/Separação por categoria/.test(sl)&&/Triagem concluída/.test(sl),'etapa 4: subfases da triagem atualizadas ao vivo');
ok(J.FS.done&&J.narrOn===false,'fim da simulação: volta ao título padrão');

// ---- reiniciar ----
h.click('start');for(let i=0;i<30;i++)h.tick(DT);ok(J.narrOn,'nova simulação ativa narrador');
h.click('restart');h.tick(DT);ok(J.narrOn===false,'Reiniciar volta ao título padrão');

// ---- modo apresentação ----
h.click('pres');h.tick(DT);ok(J.narrOn===true,'modo apresentação ativa narrador');
n=J.narrData();ok(n.t==='ETAPA 1 DE 6 — VISÃO GERAL'&&n.bar.length===6&&/quatro setores/.test(n.d),'apresentação: título, barra 6 etapas e texto');
J.presGo(3);let caps=new Set();for(let i=0;i<30*60&&J.PR.i===3;i++){h.tick(DT);caps.add(J.narrData().d)}
ok(caps.size>=3,'apresentação etapa 4: texto acompanha a subfase ('+caps.size+' textos)');
J.presEnd();h.tick(DT);ok(J.narrOn===false,'encerrar apresentação volta ao título padrão');

console.log(R.join('\n'));
