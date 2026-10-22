/* PASSATION 001 — original machined-key study. 3D narrative objects, not UI cubes.
   Three.js r180 (MIT); runtime fallback: an inline architectural SVG, no model download. */
(async()=>{
'use strict';
const wrapper=document.getElementById('world');
const canvas=document.getElementById('worldCanvas');
const fallback=document.getElementById('sceneFallback');
if(!wrapper||!canvas)return;
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let T=null,renderer=null,started=false,running=false,raf=0,chapter=0,targetProgress=0;
const compact=wrapper.classList.contains('key-companion');
const viewWidth=()=>compact?Math.max(wrapper.clientWidth,1):innerWidth;
const viewHeight=()=>compact?Math.max(wrapper.clientHeight,1):innerHeight;
const dpr=()=>Math.min(devicePixelRatio||1,innerWidth<700?1.15:1.65);
function fallbackOn(reason){
 wrapper.dataset.engine='fallback';wrapper.dataset.ready='false';
 if(fallback)fallback.style.opacity='1';
 canvas.style.opacity='0';
 if(reason)console.info('La vue statique reste disponible :',reason);
}
if(motion.matches){fallbackOn('animations réduites');return;}
try{T=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');}
catch(e){fallbackOn('bibliothèque 3D indisponible');return;}
try{
 const scene=new T.Scene();
 const camera=new T.PerspectiveCamera(35,viewWidth()/viewHeight(),.1,100);
 camera.position.set(0,0,10.5);
 renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(dpr());
 renderer.setSize(viewWidth(),viewHeight(),false);
 renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.25;
 renderer.shadowMap.enabled=true;
 renderer.shadowMap.type=T.PCFSoftShadowMap;
 scene.add(new T.AmbientLight(0xcdd5c7,1.1));
 const hemisphere=new T.HemisphereLight(0xffe6bc,0x3b514c,2.4);scene.add(hemisphere);
 function light(color,power,x,y,z){const l=new T.DirectionalLight(color,power);l.position.set(x,y,z);scene.add(l);return l;}
 const keylight=light(0xffe8ba,4.0,-3,5,7);
 const rimlight=light(0xa9c6b5,3.1,3,-1,-3);
 light(0xe8b184,1.65,5,1,6);
 const group=new T.Group();scene.add(group);
 // Brushed bronze from broad grazing highlights. Its blade and bow share one alloy.
 const brass=new T.MeshPhysicalMaterial({color:0xc6a171,metalness:.83,roughness:.23,clearcoat:.58,clearcoatRoughness:.16});
 const brassEdge=new T.MeshStandardMaterial({color:0xf0d6a7,metalness:.76,roughness:.29});
 const darkMetal=new T.MeshStandardMaterial({color:0x544d3b,metalness:.78,roughness:.32});
 const leather=new T.MeshStandardMaterial({color:0x3d3027,metalness:.04,roughness:.92,side:T.DoubleSide});
 const ink=new T.MeshStandardMaterial({color:0x202a23,metalness:.25,roughness:.52});
 const offwhite=new T.MeshStandardMaterial({color:0xdacdaf,metalness:.08,roughness:.72});
 function attach(geometry,material,parent=group,name=''){const m=new T.Mesh(geometry,material);m.name=name;m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function extrude(shape,depth=.1,bevel=.038){const g=new T.ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:5,curveSegments:50});g.translate(0,0,-depth/2);return g;}
 // The key bow is actually pierced; the shaft has functional cuts, not a slab.
 const bow=new T.Shape();
 bow.absarc(0,.98,.66,0,Math.PI*2,false);
 const hole=new T.Path();
 hole.absarc(0,.98,.265,0,Math.PI*2,true);bow.holes.push(hole);
 const bowMesh=attach(extrude(bow,.16,.05),brass,group,'bow');
 const bladeShape=new T.Shape();
 bladeShape.moveTo(-.19,.49);bladeShape.lineTo(.19,.49);
 bladeShape.lineTo(.19,-1.13);bladeShape.lineTo(.52,-1.13);
 bladeShape.lineTo(.52,-1.43);bladeShape.lineTo(.19,-1.43);
 bladeShape.lineTo(.19,-1.69);bladeShape.lineTo(.44,-1.69);
 bladeShape.lineTo(.44,-1.96);bladeShape.lineTo(-.19,-1.96);bladeShape.closePath();
 const blade=attach(extrude(bladeShape,.135,.025),brass,group,'blade');
 const neck=attach(new T.CylinderGeometry(.215,.215,.19,32),darkMetal,group,'neck');
 neck.rotation.x=Math.PI/2;neck.position.set(0,.47,.02);
 // Milling grooves catch light and make the key read as a precision-made object.
 for(const side of [-1,1]){
  const groove=attach(new T.BoxGeometry(.015,1.25,.008),brassEdge,group,'groove');
  groove.position.set(-.085,-.63,side*.087);
 }
 const collar=attach(new T.TorusGeometry(.31,.035,10,64),brassEdge,group,'collar');
 collar.position.set(0,.97,.12);
 // The steel split-ring joins the identifier to the key.
 const splitRing=attach(new T.TorusGeometry(.42,.06,12,100),darkMetal,group,'split-ring');
 splitRing.position.set(.46,1.08,.12);
 splitRing.rotation.y=-.2;
 const ringTip=attach(new T.TorusGeometry(.415,.013,8,100),brassEdge,group,'split-ring-glint');
 ringTip.position.copy(splitRing.position);ringTip.position.z+=.07;
 // Rounded leather fob with a real punched eyelet.
 const tagGroup=new T.Group();tagGroup.position.set(1.28,.39,-.22);tagGroup.rotation.z=-.29;tagGroup.rotation.y=-.12;group.add(tagGroup);
 const tagShape=new T.Shape(),w=.59,h=.78,r=.16;
 tagShape.moveTo(-w+r,-h);tagShape.lineTo(w-r,-h);
 tagShape.quadraticCurveTo(w,-h,w,-h+r);tagShape.lineTo(w,h-r);
 tagShape.quadraticCurveTo(w,h,w-r,h);tagShape.lineTo(-w+r,h);
 tagShape.quadraticCurveTo(-w,h,-w,h-r);tagShape.lineTo(-w,-h+r);
 tagShape.quadraticCurveTo(-w,-h,-w+r,-h);
 const eyeletHole=new T.Path();eyeletHole.absarc(0,.58,.105,0,Math.PI*2,true);tagShape.holes.push(eyeletHole);
 attach(extrude(tagShape,.09,.035),leather,tagGroup,'leather-tag');
 const eyelet=attach(new T.TorusGeometry(.113,.03,8,48),brassEdge,tagGroup,'eyelet');
 eyelet.position.set(0,.58,.1);
 // Hand-designed print, native canvas texture, no unlicensed image/stock photograph.
 const texCanvas=document.createElement('canvas');texCanvas.width=512;texCanvas.height=640;
 const ctx=texCanvas.getContext('2d');
 ctx.clearRect(0,0,512,640);
 ctx.textAlign='center';ctx.fillStyle='#d2b98d';
 ctx.strokeStyle='rgba(214,192,157,.60)';ctx.lineWidth=2;
 ctx.strokeRect(31,33,450,576);
 ctx.font='italic 224px Georgia,serif';ctx.fillText('P.',256,360);
 ctx.fillStyle='#c2aa86';ctx.font='bold 25px monospace';ctx.fillText('ROTATION / 001',256,430);
 ctx.font='16px monospace';ctx.fillText('PASSATION',256,482);
 const texture=new T.CanvasTexture(texCanvas);
 texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);
 const mark=new T.Mesh(new T.PlaneGeometry(1.04,1.3),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:T.DoubleSide}));
 mark.position.z=.103;mark.position.y=-.02;tagGroup.add(mark);
 // A rivet at the point where the leather meets the split-ring.
 const tinyRivet=attach(new T.CircleGeometry(.032,20),brassEdge,tagGroup,'rivet');
 tinyRivet.position.set(0,.575,.14);
 // Hover IDs are attached to real physical surfaces.
 const hitObjects=[bowMesh,blade,mark];
 const ray=new T.Raycaster(),mouse=new T.Vector2();
 const pointer={x:0,y:0,hover:false};
 let actual=.0,last=0,keyTurn=0,lastTap=0;
 const captions=[
  ['OBJET 01 / LA CLÉ','Un passage de relais.','Faites défiler : le geste raconte la procédure.'],
  ['GESTE 01 / CONFIRMER','Une mission doit être acceptée.','Le bon prestataire, le bon créneau.'],
  ['GESTE 02 / VÉRIFIER','Une fin de mission n’est pas un contrôle.','Ne laissez pas l’incident passer à la prochaine arrivée.'],
  ['GESTE 03 / TRANSMETTRE','Le relais devient une méthode.','Une information claire vaut mieux qu’une supposition.']
 ];
 function setChapter(i){
  chapter=Math.min(3,Math.max(0,Math.floor(i)));
  wrapper.dataset.chapter=String(chapter);
  const labels=captions[chapter];
  const a=document.getElementById('worldIndex'),b=document.getElementById('worldTitle'),c=document.getElementById('worldHint');
  if(a)a.textContent=labels[0];if(b)b.textContent=labels[1];if(c)c.textContent=labels[2];
 }
 const lerp=(a,b,t)=>a+(b-a)*t;
 const stages=['depart','rotation','controle','solution','interlude','pack','footer'];
 let currentStage='depart',stageChanged=true,nextPose=null,lastScan=0;
 let occupied=[];
 const positions={
  depart:[[.73,.48,1],[.78,.46,.78],[.82,.27,.54]],
  rotation:[[.73,.48,1],[.8,.45,.79],[.85,.30,.56]],
  controle:[[.38,.51,1],[.32,.5,.82],[.24,.52,.56]],
  solution:[[.72,.47,1],[.81,.36,.76],[.83,.25,.53]],
  interlude:[[.87,.83,.36],[.88,.22,.33],[.87,.73,.29],[.13,.82,.28],[.89,.55,.21]],
  pack:[[.87,.21,.39],[.87,.83,.38],[.81,.17,.33],[.14,.84,.31],[.89,.53,.28]],
  footer:[[.88,.26,.36],[.86,.83,.34],[.15,.23,.30],[.84,.44,.28]]
 };
 const box=new T.Box3(),vec=new T.Vector3(),corner=new T.Vector3();
 function boundsOfObject(){
  camera.updateMatrixWorld(true);group.updateMatrixWorld(true);box.setFromObject(group);
  let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
  for(let i=0;i<8;i++){
   corner.set(i&1?box.max.x:box.min.x,i&2?box.max.y:box.min.y,i&4?box.max.z:box.min.z).project(camera);
   const x=(corner.x+1)*viewWidth()/2,y=(1-corner.y)*viewHeight()/2;
   left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
  }
  return {left,top,right,bottom,width:right-left,height:bottom-top};
 }
 function worldPositionAt(x,y){
  vec.set(x*2-1,1-y*2,.5).unproject(camera).sub(camera.position).normalize();
  const d=-camera.position.z/vec.z;
  return {x:camera.position.x+vec.x*d,y:camera.position.y+vec.y*d};
 }
 function textObstacles(){
  const all=document.querySelectorAll('.chapter h1,.chapter h2,.chapter p,.chapter a,.chapter button,'+
   '.interlude p,.interlude-top,.interlude-sign,.offer-top,.offer-bottom,'+
   '.offer-intro h2,.offer-intro p,.offer-stats,.offer-cta,.offer-outline .outline-caption,'+
   '.offer-line,.footer-brand,.footer p,.footer div,.footer small,'+
   '.progress-rail,.world-label,.model-caption');
  const out=[];
  for(const el of all){
   if(el.closest('[hidden]')||getComputedStyle(el).visibility==='hidden')continue;
   const range=document.createRange();range.selectNodeContents(el);
   const rectangles=el.matches('.progress-rail,.world-label,.model-caption,.offer-stats,.footer div')?[el.getBoundingClientRect()]:range.getClientRects();
   for(const r of rectangles){
    if(r.width<1||r.height<1||r.bottom<92||r.top>innerHeight-8)continue;
    out.push({left:r.left-12,right:r.right+12,top:r.top-12,bottom:r.bottom+12});
   }
  }
  return out;
 }
 function overlap(b,obstacles){
  let cost=0;
  // Going outside the viewport is never preferable to respecting an editorial margin.
  if(b.left<16)cost+=(16-b.left)*1800;
  if(b.right>viewWidth()-45)cost+=(b.right-viewWidth()+45)*1800;
  if(b.top<100)cost+=(100-b.top)*1800;
  if(b.bottom>viewHeight()-18)cost+=(b.bottom-viewHeight()+18)*1800;
  for(const r of obstacles){
   const w=Math.max(0,Math.min(b.right,r.right)-Math.max(b.left,r.left));
   const h=Math.max(0,Math.min(b.bottom,r.bottom)-Math.max(b.top,r.top));
   cost+=w*h;
  }
  return cost;
 }
 function findSafePose(frame){
  if(compact)return {x:.5,y:.5,scale:1.04,score:0};
  const regular=stages.indexOf(currentStage)<4, mobile=innerWidth<740;
  let choices=positions[currentStage]||positions.depart;
  if(regular){
   const original=new T.Vector3(frame.pos[0],frame.pos[1]+(mobile?1.2:0),0).project(camera);
   choices=[[(original.x+1)/2,(1-original.y)/2,mobile?.79:1],...choices];
  }
  const factors=regular?[1,.85,.70,.55,.39,.27,.20]:[1,.84,.67];
  let best=null;
  const oldPos=group.position.clone(),oldRot=group.rotation.clone(),oldScale=group.scale.x;
  for(const factor of factors){
   for(const [x,y,s] of choices){
    const scale=s*factor,world=worldPositionAt(x,y);
    group.position.set(world.x,world.y,0);
    group.scale.setScalar(scale);
    const turn={interlude:.57,pack:2.25,footer:3.08}[currentStage]||0;
    group.rotation.set(frame.rot[0],frame.rot[1]+turn,frame.rot[2]);
    const bounds=boundsOfObject(),score=overlap(bounds,occupied);
    const candidate={x,y,scale,score};
    if(!best||score<best.score-.01)best=candidate;
    if(score===0){group.position.copy(oldPos);group.rotation.copy(oldRot);group.scale.setScalar(oldScale);return candidate;}
   }
  }
  group.position.copy(oldPos);group.rotation.copy(oldRot);group.scale.setScalar(oldScale);
  return best;
 }
 function setStage(name){
  const desired=stages.includes(name)?name:'depart';
  if(currentStage!==desired){currentStage=desired;stageChanged=true;}
  wrapper.dataset.stage=currentStage;
 }

 // A single continuous camera route: no scene swap, no teleport, reverse scroll works.
 const keyframes=[
  {rot:[-.10,-.34,-.19],pos:[1.43,.12,0],cam:[0,0,10.5]},
  {rot:[-.04,.56,.16],pos:[1.65,.08,0],cam:[-.2,.08,9.5]},
  {rot:[.13,1.65,-.12],pos:[-.95,.0,0],cam:[.5,0,9.45]},
  {rot:[-.15,3.25,.13],pos:[1.2,-.06,0],cam:[0,0,10.2]}
 ];
 function mixFrames(t){
  const k=Math.max(0,Math.min(2.999,t)),i=Math.floor(k),u=k-i,blend=u*u*(3-2*u),a=keyframes[i],b=keyframes[i+1];
  return {rot:a.rot.map((x,j)=>lerp(x,b.rot[j],blend)),pos:a.pos.map((x,j)=>lerp(x,b.pos[j],blend)),cam:a.cam.map((x,j)=>lerp(x,b.cam[j],blend))};
 }
 function pulse(){lastTap=performance.now();keyTurn+=.45;window.dispatchEvent(new CustomEvent('rotation:hotspot',{detail:{id:'key',label:'La clé passe, la responsabilité aussi',description:'La remise des clés ne clôt pas la rotation : la prestation doit être attribuée, contrôlée et transmise.'}}));}
 function handlePointer(e){
  if(e.pointerType==='touch')return;
  pointer.x=(e.clientX/innerWidth-.5)*2;pointer.y=(e.clientY/innerHeight-.5)*2;
  mouse.set(pointer.x,-pointer.y);ray.setFromCamera(mouse,camera);
  pointer.hover=ray.intersectObjects(hitObjects,false).length>0;
  if(document.body)document.body.classList.toggle('object-hover',pointer.hover);
 }
 addEventListener('pointermove',handlePointer,{passive:true});
 const trigger=document.getElementById('objectTrigger');
 trigger?.addEventListener('click',pulse);
 function resize(){
  camera.aspect=viewWidth()/viewHeight();camera.fov=compact?39:(innerWidth<700?41:35);camera.updateProjectionMatrix();
  renderer.setPixelRatio(dpr());renderer.setSize(viewWidth(),viewHeight(),false);stageChanged=true;
 }
 function draw(now){
  if(!running)return;
  const dt=Math.min(40,now-last||16);last=now;const ease=1-Math.pow(.89,dt/16);
  actual=lerp(actual,targetProgress,ease);
  const f=mixFrames(actual);
  const hoverLift=pointer.hover?.06:0;
  const targetX=compact?0:(innerWidth<700?.03:f.cam[0]),targetY=compact?0:(innerWidth<700?.85:f.cam[1]);
  camera.position.x=lerp(camera.position.x,targetX,ease);camera.position.y=lerp(camera.position.y,targetY,ease);
  camera.position.z=lerp(camera.position.z,compact?10.8:(innerWidth<700?11.6:f.cam[2]),ease);
  camera.lookAt(0,compact?0:(innerWidth<700?.25:0),0);
  camera.updateMatrixWorld(true);
  if(!compact&&(stageChanged||now-lastScan>160)){
   occupied=textObstacles();
   nextPose=findSafePose(f);
   lastScan=now;stageChanged=false;
   wrapper.dataset.collisionFree=String(nextPose.score===0);
  }
  const target=compact?{x:.5,y:.5,scale:1.04}:nextPose||{x:.7,y:.5,scale:.8};
  const dest=worldPositionAt(target.x,target.y);
  group.position.set(lerp(group.position.x,dest.x,ease),lerp(group.position.y,dest.y+hoverLift,ease),0);
  const extraTurn={interlude:.57,pack:2.25,footer:3.08}[currentStage]||0;
  group.rotation.set(
   lerp(group.rotation.x,f.rot[0]+(innerWidth>700?-pointer.y*.04:0),ease),
   lerp(group.rotation.y,f.rot[1]+extraTurn+(innerWidth>700?pointer.x*.16:0)+keyTurn,ease),
   lerp(group.rotation.z,f.rot[2]+Math.sin(now*.0007)*.025,ease)
  );
  keyTurn*=.94;
  const shrink=target.scale<group.scale.x?Math.min(.78,ease*4):ease;
  group.scale.setScalar(lerp(group.scale.x,target.scale,shrink));
  if(!compact)wrapper.dataset.keyBounds=Object.values(boundsOfObject()).slice(0,4).map(Math.round).join(',');
  // Stronger rim light on the control step, because light reveals scratches and cutouts.
  rimlight.intensity=lerp(rimlight.intensity,chapter===2?4.4:3.1,ease);
  renderer.render(scene,camera);raf=requestAnimationFrame(draw);
 }
 function start(){if(running||motion.matches||document.hidden)return;running=true;last=0;raf=requestAnimationFrame(draw);}
 function stop(){running=false;cancelAnimationFrame(raf);}
 function setProgress(t){targetProgress=Math.max(0,Math.min(3,Number(t)||0));}
if(compact){const updateCompanion=()=>{const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);setProgress(3*scrollY/total);};addEventListener('scroll',updateCompanion,{passive:true});updateCompanion();}
 addEventListener('resize',resize,{passive:true});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 motion.addEventListener?.('change',()=>{if(motion.matches){stop();fallbackOn('animations réduites');}else{wrapper.dataset.engine='webgl2';wrapper.dataset.ready='true';fallback.style.opacity='0';start();}});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stop();fallbackOn('contexte 3D perdu');});
 canvas.addEventListener('webglcontextrestored',()=>{wrapper.dataset.engine='webgl2';wrapper.dataset.ready='true';start();});
 window.rotationScene={setChapter,setProgress,setStage,getKeyBounds:boundsOfObject,pulse,engine:'webgl2',model:'machined-key-and-leather-fob',hotspots:3};
 setChapter(0);setStage('depart');resize();renderer.render(scene,camera);
 wrapper.dataset.engine='webgl2';wrapper.dataset.ready='true';fallback.style.opacity='0';started=true;
 window.dispatchEvent(new CustomEvent('rotation:ready',{detail:{engine:'webgl2',model:'key'}}));
 start();
}catch(error){if(renderer){try{renderer.dispose();}catch(_){}}fallbackOn('WebGL non disponible');console.warn(error);}
})();