const {load}=require('./mock.js');const h=load(process.argv[2]);const J=h.J;h.click('start');let t=0,last=-9,ls=-1;
for(let i=0;i<30*300&&!J.FS.done;i++){h.tick(1/30);t+=1/30;if(J.FS.i!==ls){console.log(t.toFixed(1),'etapa',J.FS.i+1);ls=J.FS.i}
 if(J.FS.i===3&&J.CL.ph!==last){console.log(t.toFixed(1),'  CL.ph',J.CL.ph,'triT',J.triT.toFixed(1));last=J.CL.ph}}
console.log('fim',t.toFixed(1),J.FS.done)
