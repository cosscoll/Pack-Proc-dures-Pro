/* Original procedural apartment diorama. Cinematic camera: departure -> turnover -> inspection.
   Three.js is used only for a real-time scene, with a fully readable static SVG fallback. */
(async()=>{
  'use strict';
  const canvas=document.getElementById('worldCanvas');
  const wrapper=document.getElementById('world');
  const fallback=document.getElementById('sceneFallback');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  if(!canvas||!wrapper||motion.matches){wrapper.dataset.engine='fallback';return;}
  let T;
  try{T=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');}
  catch(err){console.warn('Scène 3D indisponible, vue architecturale conservée.',err);wrapper.dataset.engine='fallback';return;}
  const scene=new T.Scene();
  scene.background=null;
  scene.fog=new T.FogExp2(0x202927,.025);
  const camera=new T.PerspectiveCamera(30,innerWidth/innerHeight,.1,180);
  camera.position.set(11,9,13);
  const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<700?1.35:1.65));
  renderer.setSize(innerWidth,innerHeight,false);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.48;
  renderer.outputColorSpace=T.SRGBColorSpace;
  const mat=(hex,roughness=.72,metalness=0)=>new T.MeshStandardMaterial({color:hex,roughness,metalness});
  const mats={
    plaster:mat(0xb5b7ac,.93),chalk:mat(0xdfdfd4,.84),wall:mat(0xb9bcae,.88),wood:mat(0x8f6549,.48),
    walnut:mat(0x5d3c2f,.43),linen:mat(0xe6ddcf,.88),linenDark:mat(0xb0a999,.95),gold:mat(0xb9894f,.33,.58),
    metal:mat(0x4a524e,.28,.65),black:mat(0x272e2b,.42),fabric:mat(0x727c6f,.94),
    leaf:mat(0x425943,.79),ceramic:mat(0xd5d2c7,.28),glass:new T.MeshPhysicalMaterial({color:0x88a6a2,metalness:.05,roughness:.12,transparent:true,opacity:.45,clearcoat:1}),
    amber:new T.MeshStandardMaterial({color:0xffc27f,emissive:0xe5a454,emissiveIntensity:1.7,roughness:.22}),
    blue:new T.MeshStandardMaterial({color:0x9daea5,emissive:0x607b7f,emissiveIntensity:.2,roughness:.33})
  };
  const room=new T.Group();scene.add(room);
  const contact=[];
  function box(w,h,d,x,y,z,material,parent=room,shadow=true){
    const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);
    mesh.position.set(x,y,z);
    mesh.castShadow=shadow;mesh.receiveShadow=true;parent.add(mesh);
    return mesh;
  }
  function cyl(rt,rb,h,x,y,z,material,parent=room,segments=18){
    const mesh=new T.Mesh(new T.CylinderGeometry(rt,rb,h,segments),material);
    mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  const spot=(id,label,description,center,zone)=>{
    const ring=new T.Mesh(new T.TorusGeometry(.19,.018,8,46),new T.MeshBasicMaterial({color:0xf3c590}));
    ring.position.set(center[0],center[1],center[2]);ring.rotation.x=Math.PI/2;room.add(ring);
    const core=new T.Mesh(new T.SphereGeometry(.055,12,10),new T.MeshBasicMaterial({color:0xffdb9d}));
    core.position.copy(ring.position);room.add(core);
    ring.userData={id,label,description,zone};core.userData=ring.userData;
    contact.push({ring,core});
    return ring;
  };
  // Architectural cutaway: an actual room, not a floating abstract ornament.
  const block=box(9,.23,6.7,0,-.15,0,mat(0x777969,.94));
  box(9,.32,.15,0,-.25,3.28,mats.wood);box(.15,.32,6.6,-4.44,-.25,0,mats.wood);
  box(8.95,2.95,.16,0,1.42,-3.28,mats.plaster);
  box(.16,2.95,6.6,-4.42,1.42,0,mats.plaster);
  box(4.5,.018,6.50,-2.22,-.015,0,mat(0xb3a18b,.85));
  box(4.34,.018,6.50,2.26,-.013,0,mat(0xa99680,.82));
  // Fine repeating floor joins and accent skirting.
  for(let x=-4.25;x<4.30;x+=.62){box(.009,.007,6.43,x,.012,0,mat(0x796f64,.95),room,false);}
  for(let z=-3.02;z<3.1;z+=.72){box(8.65,.006,.01,0,.018,z,mat(0x9b8e7e,.98),room,false);}
  box(8.7,.10,.08,0,.07,-3.13,mats.chalk);
  box(.08,.10,6.4,-4.3,.07,0,mats.chalk);
  // Windows cutaway illusion on back wall: custom nighttime city image as canvas texture.
  function skyline(){
    const c=document.createElement('canvas');c.width=512;c.height=512;
    const ctx=c.getContext('2d'),g=ctx.createLinearGradient(0,0,0,512);
    g.addColorStop(0,'#748c90');g.addColorStop(.55,'#60717a');g.addColorStop(1,'#162f35');ctx.fillStyle=g;ctx.fillRect(0,0,512,512);
    for(let i=0;i<44;i++){const x=(i*73+23)%530,h=110+(i*31)%220,w=22+(i*17)%48;
      ctx.fillStyle=i%3?'#31494c':'#283b3e';ctx.fillRect(x,512-h,w,h);
      for(let row=0;row<8;row++)for(let col=0;col<3;col++)if((i+row*3+col)%5<2){ctx.fillStyle='#d4a879';ctx.fillRect(x+4+col*10,512-h+10+row*18,4,5);}
    }
    const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;
  }
  const city=skyline();
  for(const x of [-2.6,-1.45,1.58,2.73]){
    const glass=new T.Mesh(new T.PlaneGeometry(1.02,1.62),new T.MeshBasicMaterial({map:city,side:T.DoubleSide}));
    glass.position.set(x,1.85,-3.182);room.add(glass);
    box(1.12,.075,.09,x,2.70,-3.06,mats.wood);
    box(1.12,.075,.09,x,.99,-3.06,mats.wood);
    box(.065,1.79,.1,x-.54,1.85,-3.06,mats.wood);
    box(.065,1.79,.1,x+.54,1.85,-3.06,mats.wood);
    box(.04,1.68,.1,x,1.84,-3.045,mats.wood);
  }
  // Left bedroom: upholstered frame, oak headboard, layered bedding, pillow seam.
  box(2.43,.24,2.38,-2.55,.30,-1.02,mats.walnut);
  box(2.38,.24,.23,-2.55,.68,-2.16,mats.wood);
  box(2.23,.27,2.10,-2.55,.53,-.97,mats.linen);
  box(2.13,.065,1.31,-2.55,.71,-.39,mats.chalk);
  box(2.0,.07,.36,-2.55,.75,.31,mats.linenDark);
  box(.81,.14,.49,-3.10,.76,-1.77,mats.chalk);
  box(.81,.14,.49,-2.03,.76,-1.77,mats.chalk);
  for(const x of [-3.86,-1.23]){
    box(.47,.46,.56,x,.26,-1.8,mats.walnut);
    box(.36,.035,.42,x,.51,-1.8,mats.gold);
    cyl(.06,.08,.27,x,.68,-1.8,mats.metal);
    const shade=new T.Mesh(new T.ConeGeometry(.17,.24,22),new T.MeshStandardMaterial({color:0xf1deb9,emissive:0xe9c687,emissiveIntensity:.45}));
    shade.position.set(x,.86,-1.8);room.add(shade);
  }
  box(2.23,.027,1.35,-2.54,.012,1.33,mat(0x797e71,.99));
  // Bedside wardrobe and frame.
  box(.77,1.54,.43,-3.79,.75,-2.7,mats.wood);
  for(let i=0;i<2;i++)box(.035,.19,.035,-3.47,.85+i*.19,-2.45,mats.gold);
  // Living: low sofa, rug, shelf, sculptural circular table and small reading lamp.
  box(2.15,.13,1.37,.02,.09,1.39,mat(0xbec0b0,.96));
  const sofa=box(2.15,.43,.78,-.15,.36,1.96,mats.fabric);
  box(2.13,.64,.19,-.15,.80,2.34,mats.fabric);
  box(.20,.48,.84,-1.17,.57,1.96,mats.fabric);
  box(.20,.48,.84,.87,.57,1.96,mats.fabric);
  box(1.95,.12,.60,-.15,.63,1.96,mats.linenDark);
  for(const x of [-.73,.46])box(.53,.15,.45,x,.76,2.03,mat(0xa79d88,.92));
  cyl(.57,.57,.11,1.48,.51,1.10,mats.wood);
  cyl(.07,.07,.44,1.48,.26,1.10,mats.metal);
  cyl(.25,.22,.04,1.48,.02,1.10,mats.metal);
  cyl(.13,.13,.035,1.44,.57,1.02,mats.ceramic);
  // Kitchen units, handles, side hood, countertop, appliances.
  box(2.54,.82,.77,2.56,.41,-2.50,mats.wood);
  box(2.71,.10,.88,2.53,.89,-2.50,mats.ceramic);
  box(2.54,1.0,.15,2.56,1.72,-3.14,mats.chalk);
  for(const x of [1.71,2.36,3.0,3.65]){box(.016,.68,.02,x,.41,-2.10,mats.gold);}
  box(.78,.025,.46,2.20,.952,-2.5,mats.black);
  for(const x of [2.00,2.39])for(const z of [-2.64,-2.37]){
    const burner=new T.Mesh(new T.TorusGeometry(.10,.015,8,28),mats.metal);burner.rotation.x=-Math.PI/2;burner.position.set(x,.974,z);room.add(burner);
  }
  const sink=new T.Mesh(new T.BoxGeometry(.55,.035,.42),mat(0x828985,.21,.65));sink.position.set(3.33,.945,-2.51);room.add(sink);
  box(.025,.23,.045,3.48,1.07,-2.65,mats.metal);
  box(.19,.03,.03,3.40,1.17,-2.65,mats.metal);
  box(.67,.04,.42,2.18,2.12,-2.77,mats.wood);
  box(.38,.09,.42,2.18,2.34,-2.77,mats.metal);
  // Entry: door, luggage, keys/console to support operational storytelling.
  box(.09,2.47,1.16,4.11,1.18,1.95,mats.walnut);
  box(.1,.07,1.25,4.04,2.47,1.95,mats.wood);
  const handle=cyl(.05,.05,.14,4.01,1.16,1.52,mats.gold);handle.rotation.z=Math.PI/2;
  box(.52,.52,.36,3.48,.29,2.16,mats.metal);
  box(.15,.24,.32,3.48,.60,2.16,mats.gold);
  box(.83,.05,.51,3.45,.90,1.17,mats.wood);
  for(const x of [3.13,3.75])box(.05,.80,.06,x,.46,1.17,mats.metal);
  box(.40,.18,.28,3.45,.98,1.17,mats.ceramic);
  // Low interior partial wall and warm ceiling spots.
  box(.10,1.06,1.75,.97,.52,-1.60,mats.chalk);
  box(.33,.03,.80,.97,1.07,-1.60,mats.wood);
  for(const [x,z] of [[-2.1,-1.85],[.4,1.8],[2.58,-2.3]]){
    const l=new T.PointLight(0xffd7a0,10,4.7,2);l.position.set(x,2.5,z);room.add(l);
    cyl(.15,.13,.07,x,2.63,z,mats.gold);
  }
  // Botanical details: real shapes and shadows, not arbitrary hero prisms.
  const plantX=3.67,plantZ=.56;
  cyl(.24,.17,.48,plantX,.24,plantZ,mats.ceramic);
  for(let i=0;i<12;i++){
    const a=i*2.399;const leaf=new T.Mesh(new T.SphereGeometry(.15,10,8),mats.leaf);
    leaf.position.set(plantX+Math.cos(a)*(.10+i*.018),.61+(i%4)*.16,plantZ+Math.sin(a)*(.10+i*.017));
    leaf.scale.set(.55,1.8,.65);leaf.rotation.z=Math.cos(a)*.38;leaf.castShadow=true;room.add(leaf);
  }
  // Door and bed inspection beacons: actionable UI markers for the user's actual workflow.
  const rings=[
    spot('door','Mission à confirmer',"La demande d'intervention doit être acceptée avant d'être considérée comme planifiée.",[3.78,1.14,1.75],1),
    spot('bed','Vérifier la préparation',"Une prestation déclarée terminée ne remplace pas le contrôle de l'état du logement.",[-2.60,1.01,-.55],2),
    spot('kitchen','Équipement et consommables',"Une anomalie de cuisine ou de stock doit être consignée et attribuée à une personne.",[2.5,1.26,-2.11],2)
  ];
  // Architectural presentation: pedestal shadow and halo surfaces.
  const ground=new T.Mesh(new T.CircleGeometry(20,80),new T.MeshBasicMaterial({color:0x131b19,transparent:true,opacity:.23}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-.36;scene.add(ground);
  const ambient=new T.AmbientLight(0xeff5dc,1.8);scene.add(ambient);
  const hemisphere=new T.HemisphereLight(0xb8d1ca,0x76604d,2.3);scene.add(hemisphere);
  const key=new T.DirectionalLight(0xf6ead4,4.4);
  key.position.set(1,10,10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=9;key.shadow.camera.bottom=-9;key.shadow.bias=-.00035;scene.add(key);
  const rim=new T.DirectionalLight(0x96bbb5,2.4);rim.position.set(-7,6,-8);scene.add(rim);
  // Dust in the shaft of light: atmospheric, never detached cubes.
  const dustGeo=new T.BufferGeometry(),coords=new Float32Array(480);
  for(let i=0;i<160;i++){coords[i*3]=(Math.random()-.5)*17;coords[i*3+1]=Math.random()*8;coords[i*3+2]=(Math.random()-.5)*14;}
  dustGeo.setAttribute('position',new T.BufferAttribute(coords,3));
  const dust=new T.Points(dustGeo,new T.PointsMaterial({color:0xd8d4c2,size:.026,transparent:true,opacity:.35,depthWrite:false}));
  scene.add(dust);
  const pointer={x:0,y:0},current={x:0,y:0};
  let chapter=0,running=true,last=0,hoverId='',selectedId='';
  const path=[
    {pos:[11.8,9.3,13.6],look:[0,.20,0],zoom:1},
    {pos:[10.0,7.3,10.1],look:[1.0,.25,1.0],zoom:1},
    {pos:[4.0,8.3,10.5],look:[-1.6,.21,-.8],zoom:1.10},
    {pos:[10.5,9.6,12.5],look:[0,.2,0],zoom:.99}
  ];
  const aimed=new T.Vector3(...path[0].pos),look=new T.Vector3(...path[0].look),initial=new T.Vector3();
  const lerp=T.MathUtils.lerp;
  const ray=new T.Raycaster(),ndc=new T.Vector2();
  function updateView(index){
    chapter=Math.min(3,Math.max(0,index|0));
    wrapper.dataset.chapter=String(chapter);
    selectedId=chapter===1?'door':chapter===2?'bed':'';
    contact.forEach(({ring,core})=>{
      const active=ring.userData.id===selectedId;
      ring.material.color.set(active?0xffd298:0x9b947b);ring.material.transparent=true;ring.material.opacity=active?1:.35;
      core.material.color.set(active?0xffe6b1:0xd6ba8a);
    });
    const titles=[['SCÈNE 01 — DÉPART','La rotation commence ici.'],['SCÈNE 02 — INTERVENTION','Qui a confirmé la mission ?'],['SCÈNE 03 — CONTRÔLE','Le logement est-il vraiment prêt ?'],['SCÈNE 04 — MÉTHODE','Une décision à la fois.']];
    document.getElementById('worldIndex').textContent=titles[chapter][0];
    document.getElementById('worldTitle').textContent=titles[chapter][1];
    room.traverse(n=>{if(n.isMesh&&n.material===mats.amber)n.material.emissiveIntensity=chapter===2?2.3:1.2;});
  }
  function pointerMove(e){
    pointer.x=(e.clientX/innerWidth-.5)*2;
    pointer.y=(e.clientY/innerHeight-.5)*2;
    if(e.pointerType==='touch')return;
    ndc.set((e.clientX/innerWidth)*2-1,-(e.clientY/innerHeight)*2+1);
    ray.setFromCamera(ndc,camera);
    const hits=ray.intersectObjects(contact.flatMap(x=>[x.ring,x.core]),false);
    const match=hits[0]?.object.userData?.id||'';
    if(match!==hoverId){hoverId=match;wrapper.style.cursor=match?'pointer':'';}
  }
  addEventListener('pointermove',pointerMove,{passive:true});
  canvas.addEventListener('click',event=>{
    if(!hoverId)return;
    const target=contact.find(x=>x.ring.userData.id===hoverId);
    if(target)window.dispatchEvent(new CustomEvent('rotation:hotspot',{detail:target.ring.userData}));
  });
  function resize(){
    camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<650?42:30;camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<700?1.25:1.6));renderer.setSize(innerWidth,innerHeight,false);
  }
  addEventListener('resize',resize,{passive:true});
  motion.addEventListener?.('change',()=>{if(motion.matches){wrapper.dataset.ready='false';running=false;fallback.style.opacity='1';}else{running=true;wrapper.dataset.ready='true';fallback.style.opacity='0';requestAnimationFrame(frame);}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){running=false;}else if(!motion.matches){running=true;requestAnimationFrame(frame);}});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();running=false;wrapper.dataset.ready='false';fallback.style.opacity='1';});
  canvas.addEventListener('webglcontextrestored',()=>{running=true;wrapper.dataset.ready='true';requestAnimationFrame(frame);});
  let pointerEnergy=0;
  function frame(timestamp){
    if(!running||motion.matches)return;
    const elapsed=Math.min(35,timestamp-last||16);last=timestamp;
    const phase=path[chapter],ease=1-Math.pow(.94,elapsed/16);
    const side=innerWidth<750?0:pointer.x*.35;
    const rise=innerWidth<750?0:pointer.y*.19;
    const goalPos=new T.Vector3(...phase.pos).add(new T.Vector3(side,rise,-side*.55));
    camera.position.lerp(goalPos,ease);
    look.lerp(new T.Vector3(...phase.look),ease*.85);
    camera.lookAt(look);
    // One coherent building stays on screen while the camera advances between chapters.
    const frameSize=innerWidth<750?.77:1;room.scale.setScalar(lerp(room.scale.x,frameSize,ease));
    if(innerWidth<750)room.position.x=lerp(room.position.x,.60,ease);else room.position.x=lerp(room.position.x,.48,ease);
    dust.rotation.y+=.00009*elapsed;
    const pulse=1+Math.sin(timestamp*.003)*.085;
    contact.forEach(({ring})=>ring.scale.setScalar(pulse));
    renderer.render(scene,camera);
    requestAnimationFrame(frame);
  }
  try{
    updateView(0);resize();
    wrapper.dataset.ready='true';wrapper.dataset.engine='webgl2';fallback.style.opacity='0';
    window.rotationScene={setChapter:updateView, engine:'webgl2',roomCount:1,hotspots:contact.length};
    window.dispatchEvent(new CustomEvent('rotation:ready',{detail:{engine:'webgl2'}}));
    requestAnimationFrame(frame);
  }catch(err){wrapper.dataset.ready='false';wrapper.dataset.engine='fallback';console.warn('Scène de repli utilisée',err);}
})();
