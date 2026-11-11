const {load}=require('./mock.js');const h=load(process.argv[2]||require('path').join(__dirname,'..','index.html'));const J=h.J,DT=1/30;const R=[];const ok=(c,m)=>{R.push((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const ev=(t,o)=>h.cv.handlers[t](Object.assign({pointerId:1,button:0,shiftKey:false,ctrlKey:false,clientX:0,clientY:0,preventDefault(){}},o));
const drag=(o,dx,dy,n=20)=>{ev('pointerdown',{...o,clientX:100,clientY:100});for(let i=1;i<=n;i++)ev('pointermove',{...o,clientX:100+dx*i/n,clientY:100+dy*i/n});ev('pointerup',{...o,clientX:100+dx,clientY:100+dy})};
for(let i=0;i<5;i++)h.tick(DT);
const th0=J.goal.th;drag({},-1500,0);ok(Math.abs(J.goal.th-th0)>6.28,'rotação 360° sem limite (Δθ='+(J.goal.th-th0).toFixed(1)+' rad)');
drag({},0,-5000);ok(J.goal.ph<=1.52+1e-9&&J.goal.ph>=1.4,'inclinação até quase horizontal (φ='+J.goal.ph.toFixed(2)+')');
drag({},0,5000);ok(J.goal.ph>=.08-1e-9&&J.goal.ph<=.1,'inclinação até vista de cima (φ='+J.goal.ph.toFixed(2)+')');
const t0=J.goal.t.clone();drag({button:2},200,100);ok(Math.hypot(J.goal.t.x-t0.x,J.goal.t.z-t0.z)>1,'pan com botão direito');
const t1=J.goal.t.clone();drag({shiftKey:true},-200,0);ok(Math.hypot(J.goal.t.x-t1.x,J.goal.t.z-t1.z)>1,'pan com Shift+arrastar');
for(let i=0;i<40;i++)ev('wheel',{deltaY:200});
h.cv.handlers.wheel({deltaY:-1e9,preventDefault(){}});ok(J.goal.r===3,'zoom mínimo 3');
for(let i=0;i<60;i++)h.cv.handlers.wheel({deltaY:500,preventDefault(){}});ok(J.goal.r===90,'zoom máximo 90');
// limites do alvo
for(let i=0;i<50;i++)drag({button:2},-800,800);ok(J.goal.t.x>=-12&&J.goal.t.x<=30&&J.goal.t.z>=-20&&J.goal.t.z<=24,'alvo preso aos limites do terreno');
// teclado
const kd=k=>h.wl().keydown({key:k,ctrlKey:false,metaKey:false,altKey:false,preventDefault(){}}),ku=k=>h.wl().keyup({key:k});
h.click('reset');for(let i=0;i<5;i++)h.tick(DT);const g0=J.goal.t.clone(),th1=J.goal.th,r1=J.goal.r;
kd('w');for(let i=0;i<30;i++)h.tick(DT);ku('w');ok(Math.hypot(J.goal.t.x-g0.x,J.goal.t.z-g0.z)>3,'W move a câmera');
kd('e');for(let i=0;i<30;i++)h.tick(DT);ku('e');ok(Math.abs(J.goal.th-th1)>1,'E gira');
kd('+');for(let i=0;i<30;i++)h.tick(DT);ku('+');ok(J.goal.r<r1,'+ aproxima');
ok(J.CAM.auto===false,'mexer manualmente desliga câmera automática');
// câmera automática vs simulação
h.click('restart');ok(J.CAM.auto,'reiniciar devolve a câmera automática');h.click('auto');ok(!J.CAM.auto,'botão desliga');h.click('auto');ok(J.CAM.auto,'botão reativa câmera automática');
h.click('start');for(let i=0;i<30*40;i++)h.tick(DT);
ok(J.FS.i===3&&J.CAM.auto,'etapa 4 com câmera automática');
h.click('restart');drag({},50,0);h.click('start');for(let i=0;i<30*17;i++)h.tick(DT);
ok(!(Math.abs(J.goal.t.x-14)<.5&&Math.abs(J.goal.t.z-8.5)<.5),'com câmera manual a simulação NÃO move a câmera');
// seguir caminhão
h.click('follow');ok(J.CAM.follow,'seguir caminhão ligado');for(let i=0;i<30*3;i++)h.tick(DT);
const w=J.main.g.localToWorld({x:0,y:0,z:0,clone(){return this}});
ok(Math.hypot(J.goal.t.x-w.x,J.goal.t.z-w.z)<1.5,'alvo da câmera acompanha o caminhão');
// vista de cima e reset
h.click('top');ok(J.goal.ph<.2&&!J.CAM.follow,'vista de cima');
h.click('reset');for(let i=0;i<5;i++)h.tick(DT);ok(J.CAM.auto&&Math.abs(J.goal.ph-.98)<1e-9&&J.goal.r===46,'reiniciar visualização restaura câmera');
console.log(R.join('\n'));
