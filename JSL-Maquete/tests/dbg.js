const {load}=require('./mock.js');const h=load('/home/claude/jsl/index.html');const J=h.J,DT=1/30;
const w=i=>{const c=J.CHS[i].c.g.position;return[+c.x.toFixed(2),+c.z.toFixed(2)]};
console.log('home',w(2),w(7));h.click('start');let t=0;
for(let k=0;k<30*150;k++){h.tick(DT);t+=DT;if(k%(30*5)===0){const s2=J.CHS[2],s7=J.CHS[7];console.log(t.toFixed(0),'FS',J.FS.i,J.FS.done,'adm1',w(2),s2.i,s2.sc[s2.i].a,'ods7',w(7),s7.i,s7.sc[s7.i].a,JSON.stringify(J.ARM))}}
