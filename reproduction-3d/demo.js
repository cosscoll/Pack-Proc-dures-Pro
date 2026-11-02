/* Contrôleur INÉDIT construit à partir du guide 3D.
   Le module sculpture 3D importé par index.html est préservé OCTET POUR OCTET.
   Ce fichier prouve que la cinématique s'utilise sur un autre site. */
(()=>{
'use strict';
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const scenes=[...document.querySelectorAll('.chapter[data-scene]')];
const locations=[
 ...scenes,
 document.getElementById('manifeste'),
 document.getElementById('atelier'),
 document.getElementById('passage'),
 document.getElementById('coffre')
].filter(Boolean);
const ids=['act-0','act-1','act-2','act-3','coffre'];
const rails=[...document.querySelectorAll('.section-rail a')];
const engineLabel=document.getElementById('engineState');
const keyLabel=document.getElementById('motionState');
const chestLabel=document.getElementById('chestState');
const vaultLabel=document.getElementById('vaultState');
const meter=document.getElementById('vaultMeter');
const world=document.getElementById('world');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
let raf=0,still=0;
function currentChapter(y){
 let current=0;
 const mark=innerHeight*.52;
 for(let i=0;i<scenes.length;i++){
  if(scenes[i].getBoundingClientRect().top<=mark)current=i;
 }
 return current;
}
function track(y){
 const anchors=locations.map(element=>element.offsetTop);
 let t=0;
 for(let i=0;i<anchors.length-1;i++){
  const a=anchors[i],b=Math.max(a+1,anchors[i+1]);
  if(y>=a)t=i+clamp((y-a)/(b-a));
 }
 // Sept poses exactes, 0..6. La pose 6 ne change plus durant le coffre.
 return clamp(t,0,6);
}
function vault(y){
 const element=document.getElementById('coffre');
 const start=element?.offsetTop??Infinity;
 const distance=Math.max(1,(element?.offsetHeight||innerHeight*2.85)-innerHeight);
 return clamp((y-start)/distance);
}
function update(){
 raf=0;
 const y=scrollY;
 const chapter=currentChapter(y);
 const progress=track(y);
 const opening=vault(y);
 const scene=window.rotationScene;
 if(scene){
  scene.setChapter(chapter);
  scene.setProgress(progress);
  scene.setVaultProgress(opening);
 }
 world.dataset.stage=opening>.005?'coffre':(progress>=4?'transition':'chapitre');
 scenes.forEach((node,i)=>node.classList.toggle('is-current',i===chapter));
 const active=opening>.005?'coffre':ids[clamp(chapter,0,3)];
 rails.forEach((item)=>item.classList.toggle('is-active',item.getAttribute('href')==='#'+active));
 const info=scene?.getMotionState?.();
 const chest=scene?.getVaultState?.();
 engineLabel.textContent=world.dataset.engine==='webgl2'?'THREE.JS / WEBGL':world.dataset.engine==='fallback'?'VUE STATIQUE':'CHARGEMENT DE LA 3D';
 keyLabel.textContent='TRAJET '+(info?.actual??progress).toFixed(2)+' / 6';
 const openingActual=chest?.progress??opening;
 chestLabel.textContent='COFFRE '+Math.round(openingActual*100)+'%';
 meter.style.width=(openingActual*100).toFixed(1)+'%';
 vaultLabel.textContent=openingActual>.96?'COFFRE OUVERT':openingActual>.79?'LE COUVERCLE SE SOULÈVE':openingActual>.65?'LA SERRURE TOURNE':openingActual>.40?'LA CLÉ ENTRE DANS LA SERRURE':'LE COFFRE EST FERMÉ';
 const delta=Math.abs((info?.actual??progress)-progress)+Math.abs(openingActual-opening);
 if(scene&&delta>.006&&still<500){still++;schedule();}
 else still=0;
}
function schedule(){if(!raf)raf=requestAnimationFrame(update)}
addEventListener('scroll',()=>{still=0;schedule()},{passive:true});
addEventListener('resize',()=>{still=0;schedule()},{passive:true});
addEventListener('rotation:ready',()=>{still=0;schedule()});
addEventListener('pageshow',schedule);
motion.addEventListener?.('change',schedule);
schedule();
})();