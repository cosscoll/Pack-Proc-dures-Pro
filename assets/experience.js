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
let active=0,lastActive=-1,scheduled=false,menuOpen=false,trigger=null;
function setScene(index){
 active=Math.max(0,Math.min(chapters.length-1,index));
 if(lastActive===active)return;
 lastActive=active;
 chapters.forEach((chapter,i)=>chapter.classList.toggle('is-current',i===active));
 rails.forEach((rail,i)=>{
  const selected=i===active;
  rail.classList.toggle('is-active',selected);
  if(selected)rail.setAttribute('aria-current','step');else rail.removeAttribute('aria-current');
 });
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
 let progress=0;
 for(let i=0;i<chapters.length-1;i++){
  const a=chapters[i].offsetTop,b=chapters[i+1].offsetTop;
  if(y>=a){progress=i+Math.min(1,Math.max(0,(y-a)/(b-a||1)));}
 }
 if(y>=last)progress=3;
 window.rotationScene?.setProgress(progress);
 // Le 3D suit la structure réelle, y compris le manifeste, le pack et le pied de page.
 const route=[...chapters,document.querySelector('.interlude'),document.querySelector('#pack'),document.querySelector('.footer')].filter(Boolean);
 const focal=innerHeight*.54;
 let stage='depart';
 for(const part of route){
  if(part.getBoundingClientRect().top<=focal)stage=part.id||part.classList.contains('interlude')&&'interlude'||part.classList.contains('footer')&&'footer'||stage;
 }
 const footerRect=document.querySelector('.footer')?.getBoundingClientRect();
 if(footerRect&&footerRect.top<innerHeight*.83&&footerRect.bottom>innerHeight*.48)stage='footer';
 document.getElementById('world')?.setAttribute('data-stage',stage);
 // Le décor suit la clé existante : aucune consigne de repositionnement du modèle.
 scheduled=false;
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(measure);}}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
addEventListener('rotation:ready',schedule);
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
