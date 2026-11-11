const {load}=require('./mock.js');let h=load('/home/claude/jsl/index.html');const J=h.J;
h.click('pres');let pc=null,g=0;
while(J.PR.on&&g++<9000&&!(J.PR.i===5&&J.PR.t>13)){h.tick(1/30);const c=[J.cur.t.x,J.cur.t.z,J.cur.r];
 if(pc){const d=Math.hypot(c[0]-pc[0],c[1]-pc[1])+Math.abs(c[2]-pc[2]);if(d>1)console.log(g,'step',J.PR.i,'sub',J.PR.sub,'ph',J.CL.ph,d.toFixed(2),c.map(x=>x.toFixed(1)).join())}pc=c}
