/* Rotation 001 — accessible scene navigation and editorial interactions. */
(()=>{
 'use strict';
 const chapters=[...document.querySelectorAll('.chapter')];
 const rails=[...document.querySelectorAll('.rail-item')];
 const nav=document.getElementById('navPanel');
 const menu=document.getElementById('menuToggle');
 const overlay=document.getElementById('overlayMessage');
 const dialogTitle=document.getElementById('overlayHeading');
 const dialogDetail=document.getElementById('overlayDetail');
 const dialogTag=document.getElementById('overlayCategory');
 const close=document.getElementById('overlayClose');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let active=0,lastActive=-1,queued=false;
 const scenes=[
  {heading:'La rotation commence ici.',hint:'Explorez les pièces du logement.'},
  {heading:'L’intervention doit être acceptée.',hint:'Entrée : vérifier l’attribution de la mission.'},
  {heading:'Le contrôle reste indispensable.',hint:'Chambre et cuisine : tracer les anomalies.'},
  {heading:'La méthode relie chaque décision.',hint:'La procédure pilote P01 est disponible gratuitement.'}
 ];
 function setScene(n){
   active=Math.min(chapters.length-1,Math.max(0,n));
   if(active===lastActive)return;
   lastActive=active;
   chapters.forEach((chapter,i)=>chapter.classList.toggle('is-current',i===active));
   rails.forEach((rail,i)=>{
     const selected=i===active;rail.classList.toggle('is-active',selected);
     if(selected)rail.setAttribute('aria-current','step');else rail.removeAttribute('aria-current');
   });
   const title=document.getElementById('worldTitle');
   const hint=document.getElementById('worldHint');
   if(title)title.textContent=scenes[active].heading;
   if(hint)hint.textContent=scenes[active].hint;
   window.rotationScene?.setChapter(active);
 }
 function measure(){
   const mark=innerHeight*.57;
   let next=0;
   for(let i=0;i<chapters.length;i++){if(chapters[i].getBoundingClientRect().top<=mark)next=i;}
   setScene(next);
   queued=false;
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(measure)}};
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule,{passive:true});
 addEventListener('rotation:ready',()=>window.rotationScene?.setChapter(active));
 measure();
 rails.forEach(button=>button.addEventListener('click',()=>{
   const id=button.dataset.go,section=document.getElementById(id);
   section?.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});
 }));
 function toggleMenu(open){
   menu.setAttribute('aria-expanded',String(open));
   menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
   nav.classList.toggle('is-open',open);
   nav.inert=!open;
   if(open)nav.querySelector('a')?.focus();
   else menu.focus();
 }
 menu.addEventListener('click',()=>toggleMenu(menu.getAttribute('aria-expanded')!=='true'));
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
 addEventListener('keydown',e=>{
   if(e.key==='Escape'){
     if(!overlay.hidden)hideOverlay();
     if(menu.getAttribute('aria-expanded')==='true')toggleMenu(false);
   }
 });
 const stories={
  pending:{
   label:'SCÉNARIO 01 / INTERVENTION NON CONFIRMÉE',
   heading:'La mission reste non confirmée.',
   detail:'Un message envoyé ne vaut pas acceptation. La procédure P01 prévoit un créneau, un responsable et une confirmation explicite. Sans réponse, on demande un arbitrage avant l’arrivée.'
  },
  incident:{
   label:'SCÉNARIO 02 / ANOMALIE BLOQUANTE',
   heading:'« Terminé » ne signifie pas « prêt ».',
   detail:'Un problème non résolu doit être consigné et transmis au décideur. Les procédures P05 et P08 distinguent la correction demandée de la validation finale.'
  }
 };
 let trigger=null;
 function showOverlay(story){
   if(!story)return;
   trigger=document.activeElement;
   dialogTag.textContent=story.label;
   dialogTitle.textContent=story.heading;
   dialogDetail.textContent=story.detail;
   overlay.hidden=false;
   close.focus();
 }
 function hideOverlay(){
   overlay.hidden=true;
   if(trigger&&typeof trigger.focus==='function')trigger.focus();
 }
 close.addEventListener('click',hideOverlay);
 document.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>showOverlay(stories[button.dataset.scenario])));
 window.addEventListener('rotation:hotspot',e=>{
   const data=e.detail||{};
   showOverlay({label:'POINT DE CONTRÔLE / '+(data.label||'LOGEMENT').toUpperCase(),heading:data.label||'Point de contrôle',detail:data.description||'Un responsable doit vérifier cette zone.'});
 });
})();
