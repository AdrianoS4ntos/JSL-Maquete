const {load,THREE}=require('./mock.js');const h=load(process.argv[2]);const J=h.J;h.click('start');let t=0;
while(t<45&&!J.FS.done){h.tick(1/30);t+=1/30;if(t>36.4&&t<38.2&&Math.round(t*30)%3==0){const p=J.main.g.localToWorld(new THREE.Vector3());let r=0,q=J.main.g;while(q){r+=q.rotation.y;q=q.parent}console.log(t.toFixed(2),p.x.toFixed(2),p.z.toFixed(2),'rot',r.toFixed(2))}}
