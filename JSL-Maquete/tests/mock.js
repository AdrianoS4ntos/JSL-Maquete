// Mock mínimo de THREE r128 + DOM para executar a lógica da maquete sem WebGL.
const vm=require('vm'),fs=require('fs');
class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this}clone(){return new V3(this.x,this.y,this.z)}
 add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this}lerp(v,k){this.x+=(v.x-this.x)*k;this.y+=(v.y-this.y)*k;this.z+=(v.z-this.z)*k;return this}lerpVectors(a,b,k){this.x=a.x+(b.x-a.x)*k;this.y=a.y+(b.y-a.y)*k;this.z=a.z+(b.z-a.z)*k;return this}}
class Sc extends V3{constructor(){super(1,1,1)}setScalar(s){this.x=this.y=this.z=s;return this}}
class O3{constructor(){this.position=new V3();this.rotation={x:0,y:0,z:0};this.scale=new Sc();this.children=[];this.parent=null;this.visible=true;this.userData={};this.isObject3D=true}
 add(...o){o.forEach(c=>{if(c.parent)c.parent.remove(c);c.parent=this;this.children.push(c)});return this}remove(c){const i=this.children.indexOf(c);if(i>=0){this.children.splice(i,1);c.parent=null}return this}
 traverse(f){f(this);this.children.slice().forEach(c=>c.traverse(f))}
 localToWorld(v){let p=v.clone(),o=this;while(o){p.x*=o.scale.x;p.y*=o.scale.y;p.z*=o.scale.z;const c=Math.cos(o.rotation.y),s=Math.sin(o.rotation.y);const x=p.x*c+p.z*s,z=-p.x*s+p.z*c;p.x=x+o.position.x;p.y+=o.position.y;p.z=z+o.position.z;o=o.parent}return p}
 getWorldPosition(t){return t.copy(this.localToWorld(new V3()))}
 lookAt(){}}
class Mesh extends O3{constructor(g,m){super();this.geometry=g;this.material=m;this.isMesh=true;this.castShadow=false;this.receiveShadow=false}}
const geo=(k)=>function(...a){this.kind=k;this.args=a;this.type=k};
const col=()=>({setHex(h){this.hex=h;return this},getHex(){return this.hex},hex:0});
class Mat{constructor(o={}){Object.assign(this,o);this.color=col();if(typeof o.color==='number')this.color.hex=o.color;this.opacity=o.opacity==null?1:o.opacity}}
const THREE={Vector3:V3,Vector2:class{set(){return this}},Object3D:O3,Group:class extends O3{},Scene:class extends O3{},Mesh,
 Sprite:class extends Mesh{constructor(m){super(null,m);this.isSprite=true;this.isMesh=false}},LineSegments:class extends O3{constructor(g,m){super();this.geometry=g;this.material=m}},
 BoxGeometry:geo('box'),CylinderGeometry:geo('cyl'),ConeGeometry:geo('cone'),PlaneGeometry:geo('plane'),RingGeometry:geo('ring'),SphereGeometry:geo('sph'),EdgesGeometry:geo('edges'),ShapeGeometry:geo('shape'),
 Shape:class{moveTo(){}lineTo(){}closePath(){}},MeshStandardMaterial:Mat,MeshBasicMaterial:Mat,LineBasicMaterial:Mat,SpriteMaterial:Mat,CanvasTexture:class{},
 HemisphereLight:class extends O3{},DirectionalLight:class extends O3{constructor(){super();this.shadow={mapSize:{set(){}},camera:{}};this.target=new O3()}},
 PerspectiveCamera:class extends O3{updateProjectionMatrix(){}},WebGLRenderer:class{constructor(){this.shadowMap={}}setPixelRatio(){}setSize(){}render(){}},
 Raycaster:class{setFromCamera(){}intersectObjects(){return[]}},Clock:class{getElapsedTime(){return THREE.__now}},DoubleSide:2,sRGBEncoding:1,PCFSoftShadowMap:1,__now:0};
function el(){const e={style:{},dataset:{},handlers:{},_html:'',classList:{toggle(){},add(){},remove(){}},addEventListener(t,f){e.handlers[t]=f},querySelector(){return el()},querySelectorAll(){return[]},getBoundingClientRect(){return{left:0,top:0,width:800,height:600}},setPointerCapture(){},insertAdjacentHTML(){},appendChild(){},clientWidth:800,clientHeight:600,getContext(){return new Proxy(function(){},{get:(t,k)=>k==='measureText'?()=>({width:10}):(k in t?t[k]:()=>{}),set:()=>true,apply:()=>{}})}};
 Object.defineProperty(e,'innerHTML',{get:()=>e._html,set:v=>{e._html=v}});return e}
function load(htmlPath){
 const html=fs.readFileSync(htmlPath,'utf8');const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 const els={'#view':el(),'#cv':el(),'#panel':el(),'.ctrl':el(),'#hud':el(),'#pres':el()};
 const btns=['start','pause','resume','restart','flow','ov','dir','adm','ods','log','reset','int','top','follow','auto','pres'].map(v=>{const b=el();b.dataset.v=v;b.disabled=false;b.cls={};b.classList={toggle(c,on){b.cls[c]=!!on},add(){},remove(){}};return b});
 let loopFn=null;
 const sb={THREE,console,Math,document:{querySelector:s=>els[s]||el(),querySelectorAll:s=>s==='[data-v]'?btns:[],createElement:()=>el(),getElementById:()=>el(),body:el()},
  ResizeObserver:class{observe(){}},requestAnimationFrame:f=>{loopFn=f},devicePixelRatio:1,innerWidth:800,innerHeight:600,addEventListener(t,f){(sb.__wl=sb.__wl||{})[t]=f},window:{},Set,Map};
 sb.window=sb;vm.createContext(sb);vm.runInContext(scripts[scripts.length-1],sb,{filename:'maquete.js'});
 return{sb,els,btns,cv:els['#cv'],wl:()=>sb.__wl,tick(dt){THREE.__now+=dt;const f=loopFn;f&&f()},J:sb.__jsl,click:v=>{const b=btns.find(x=>x.dataset.v===v);els['.ctrl'].handlers.click({target:{closest:()=>b}})},panel:()=>els['#panel']._html,html}
}
module.exports={THREE,load,V3};
