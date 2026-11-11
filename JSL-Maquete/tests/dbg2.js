const {load,THREE}=require('./mock.js');const h=load(process.argv[2]);const J=h.J;h.click('start');let t=0;
while(t<20){h.tick(1/30);t+=1/30;const p=J.main.g.localToWorld(new THREE.Vector3());let r=0,q=J.main.g;while(q){r+=q.rotation.y;q=q.parent}if(t>1.5&&t<20&&J.CL.ph>=0&&J.CL.ph<=1&&Math.abs(p.z-4.6)<.6)console.log(t.toFixed(2),p.x.toFixed(2),p.z.toFixed(2),r.toFixed(2),J.CL.ph)}
