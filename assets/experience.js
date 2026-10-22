/* PROCÉDURES PRO — scroll choreography, real scenarios and keyboard-equivalent hover. */
(()=>{
'use strict';
const chapters=[...document.querySelectorAll('.chapter[data-scene]')];
const rails=[...document.querySelectorAll('.rail-item')];
const nav=document.getElementById('navPanel');
const menu=document.getElementById('menuToggle');
const overlay=document.getElementById('overlayMessage');
const dialogTitle=document.getElementById('overlayHeading');
const dialogDetail=document.getElementById('overlayDetail');
const dialogTag=document.getElementById('overlayCategory');
const close=document.getElementById('overlayClose');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const scenes=[
 {heading:'Un passage de relais.',hint:'La clé révèle les gestes invisibles.'},
 {heading:'Une mission doit être acceptée.',hint:'Attribuer puis obtenir une confirmation.'},
 {heading:'Une prestation terminée n’est pas une validation.',hint:'L’état du logement se contrôle.'},
 {heading:'Un même langage pour l’équipe.',hint:'Attribuer, contrôler, transmettre.'}
];
let active=0,lastActive=-1,lastRail=-1,scheduled=false,menuOpen=false,trigger=null;
function selectRail(index){
 if(lastRail===index)return;
 lastRail=index;
 rails.forEach((rail,i)=>{
  const chosen=i===index;
  rail.classList.toggle('is-active',chosen);
  if(chosen)rail.setAttribute('aria-current','step');else rail.removeAttribute('aria-current');
 });
}
function setScene(index){
 active=Math.max(0,Math.min(chapters.length-1,index));
 if(lastActive===active)return;
 lastActive=active;
 chapters.forEach((chapter,i)=>chapter.classList.toggle('is-current',i===active));

 document.body.dataset.scene=String(active);
 const title=document.getElementById('worldTitle'),hint=document.getElementById('worldHint');
 if(title)title.textContent=scenes[active].heading;
 if(hint)hint.textContent=scenes[active].hint;
 window.rotationScene?.setChapter(active);
}
function measure(){
 const mark=innerHeight*.57;
 let found=0;
 for(let i=0;i<chapters.length;i++){
  if(chapters[i].getBoundingClientRect().top<=mark)found=i;
 }
 setScene(found);
 const y=scrollY,first=chapters[0]?.offsetTop||0,last=chapters.at(-1)?.offsetTop||1;
 // Même interpolation lente de départ, étendue aux trois séquences suivantes.
 // Aucun recalcul opportuniste de la pose: on suit uniquement la position du scroll.
 const interlude=document.querySelector('.interlude'),pack=document.querySelector('#pack'),footer=document.querySelector('.footer');
 const scrollEnd=Math.max(0,document.documentElement.scrollHeight-innerHeight);
 const anchors=[
  ...chapters.map(ch=>ch.offsetTop),
  interlude?.offsetTop ?? last+innerHeight,
  pack?.offsetTop ?? last+innerHeight*2,
  scrollEnd
 ];
 let progress=0;
 for(let i=0;i<anchors.length-1;i++){
  const a=anchors[i],b=Math.max(a+1,anchors[i+1]);
  if(y>=a)progress=i+Math.min(1,Math.max(0,(y-a)/(b-a)));
 }
 if(y>=scrollEnd-2)progress=anchors.length-1;
 window.rotationScene?.setProgress(progress);
 // Le texte de l'interlude entre dans le champ lorsque la clé a atteint la gauche,
 // puis se retire doucement avant sa traversée vers la droite.
 const easing=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
 const arrival=easing(3.87,4.06,progress);
 // Le manifeste mobile doit libérer son couloir AVANT que la clé repasse au centre.
 const departure=1-easing(innerWidth<=740?4.12:4.32,innerWidth<=740?4.24:4.52,progress);
 const mobileReadingBay=innerWidth<=740;
 const manifestoVisibility=mobileReadingBay?'1':Math.min(arrival,departure).toFixed(3);
 document.documentElement.style.setProperty('--manifest-visibility',manifestoVisibility);
 document.querySelectorAll('.interlude-top,.interlude p,.interlude-sign').forEach(node=>{
  node.style.opacity=manifestoVisibility;
 });
 // Acte III : pendant que la clé traverse le pack, le texte d'introduction
 // s'efface puis les quatre usages apparaissent du côté libéré.
 // Aucune instruction de repositionnement n'est envoyée à la scène 3D.
 const introVisibility=mobileReadingBay?'1':(1-easing(5.28,5.49,progress)).toFixed(3);
 const detailsVisibility=mobileReadingBay?'1':easing(innerWidth>=1101?5.46:5.59,innerWidth>=1101?5.58:5.73,progress).toFixed(3);
 const intro=document.querySelector('#pack .offer-intro');
 const detail=document.querySelector('#pack .offer-outline');
 if(intro)intro.style.opacity=introVisibility;
 if(detail)detail.style.opacity=detailsVisibility;
 // La clé suit une histoire continue de sept poses; le décor réserve des zones latérales.
 const route=[...chapters,document.querySelector('.interlude'),document.querySelector('#pack'),document.querySelector('.footer')].filter(Boolean);
 const focal=innerHeight*.54;
 let stage='depart';
 for(const part of route){
  if(part.getBoundingClientRect().top<=focal)stage=part.id||part.classList.contains('interlude')&&'interlude'||part.classList.contains('footer')&&'footer'||stage;
 }
 const footerRect=document.querySelector('.footer')?.getBoundingClientRect();
 if(footerRect&&footerRect.top<innerHeight*.83&&footerRect.bottom>innerHeight*.48)stage='footer';
 selectRail(stage==='pack'||stage==='footer'?4:active);
 document.getElementById('world')?.setAttribute('data-stage',stage);
 // Le décor suit la clé existante : aucune consigne de repositionnement du modèle.
 scheduled=false;
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(measure);}}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
addEventListener('rotation:ready',schedule);
nav.inert=true;
measure();
rails.forEach(button=>button.addEventListener('click',()=>{
 document.getElementById(button.dataset.go)?.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});
}));
function toggleMenu(open,restore=true){
 menuOpen=open;
 menu.setAttribute('aria-expanded',String(open));
 menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
 nav.classList.toggle('is-open',open);nav.inert=!open;
 document.body.classList.toggle('menu-open',open);
 if(open)nav.querySelector('a')?.focus();
 else if(restore)menu.focus();
}
menu?.addEventListener('click',()=>toggleMenu(!menuOpen));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false,false)));
const stories={
 pending:{
  label:'01 / MISSION NON CONFIRMÉE',
  heading:'La mission reste non confirmée.',
  detail:'Un message envoyé ne vaut pas acceptation. Le cadre pilote P01 prévoit un responsable, un créneau et une confirmation explicite. Sans réponse, il faut demander une décision avant l’arrivée.'
 },
 incident:{
  label:'02 / ANOMALIE BLOQUANTE',
  heading:'« Terminé » ne signifie pas « prêt ».',
  detail:'Une anomalie doit être consignée, attribuée puis vérifiée. Les procédures pilotes P05 et P08 séparent la correction demandée de la validation finale du logement.'
 }
};
function showOverlay(story){
 if(!story)return;
 if(menuOpen)toggleMenu(false,false);
 trigger=document.activeElement;
 dialogTag.textContent=story.label;
 dialogTitle.textContent=story.heading;
 dialogDetail.textContent=story.detail;
 overlay.hidden=false;
 document.body.style.overflow='hidden';
 close?.focus();
}
function hideOverlay(){
 overlay.hidden=true;
 document.body.style.overflow='';
 if(trigger&&typeof trigger.focus==='function')trigger.focus();
}
// The 2D fallback must retain the same useful interaction as the real 3D object.
document.getElementById('objectTrigger')?.addEventListener('click',()=>{
 if(window.rotationScene?.engine==='webgl2')return;
 showOverlay({label:'OBJET INTERACTIF / PASSATION',heading:'La clé passe, la responsabilité aussi',detail:'La remise des clés ne clôt pas la rotation : la prestation doit être attribuée, contrôlée et transmise.'});
});
close?.addEventListener('click',hideOverlay);
overlay?.addEventListener('click',e=>{if(e.target===overlay)hideOverlay();});
document.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>showOverlay(stories[button.dataset.scenario])));
window.addEventListener('rotation:hotspot',e=>{
 const d=e.detail||{};
 showOverlay({label:'OBJET INTERACTIF / '+(d.id||'PASSATION').toUpperCase(),heading:d.label||'Un geste à confirmer.',detail:d.description||'Une décision doit être confirmée avant le prochain relais.'});
});
addEventListener('keydown',e=>{
 if(e.key==='Escape'){
  if(!overlay.hidden){hideOverlay();return;}
  if(menuOpen)toggleMenu(false);
 }
 if(e.key==='Tab'&&!overlay.hidden){
  const focusables=[...overlay.querySelectorAll('button,a[href]')];
  if(!focusables.length)return;
  const first=focusables[0],last=focusables[focusables.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
 if(e.key==='Tab'&&menuOpen&&overlay.hidden){
  const links=[...nav.querySelectorAll('a')],first=links[0],last=menu;
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();menu.focus();}
  if(!e.shiftKey&&document.activeElement===menu){e.preventDefault();first.focus();}
 }
});
// The effect responds only to the user's own pointer motion; focus always stays stationary.
if(!motion.matches&&matchMedia('(pointer:fine)').matches){
 document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('pointermove',event=>{
   const rect=el.getBoundingClientRect();
   const dx=(event.clientX-rect.left-rect.width/2)/rect.width;
   const dy=(event.clientY-rect.top-rect.height/2)/rect.height;
   el.style.transform='translate('+Math.max(-6,Math.min(6,dx*9))+'px,'+Math.max(-4,Math.min(4,dy*6))+'px)';
  });
  el.addEventListener('pointerleave',()=>{el.style.transform='';});
  el.addEventListener('blur',()=>{el.style.transform='';});
 });
}
})();
