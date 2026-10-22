/* Mini-présentoir : extraits factuels du pack pilote P01 / P05 / P08. Aucune donnée collectée. */
(()=>{'use strict';
const data={
 P01:{title:['Une demande',"n'est pas une",'confirmation.'],sub:'PLANIFIER UNE ROTATION',status:'STATUT / À CONFIRMER',steps:[['Vérifier les horaires','Départ, arrivée, fenêtre disponible'],["Proposer l'intervention",'Tâches et intervenant désigné'],['Obtenir une confirmation','Mission envoyée ≠ mission acceptée']]},
 P05:{title:['Un ménage fini',"n'est pas encore",'un contrôle.'],sub:'VÉRIFIER LE LOGEMENT',status:'STATUT / PRÊT, À CORRIGER OU BLOQUÉ',steps:[['Inspecter le logement','Pièces, linge, consommables attendus'],['Consigner les écarts','Faits, lieu et priorité de correction'],['Valider le statut','Décision du responsable habilité']]},
 P08:{title:['Un incident','demande une','décision.'],sub:'TRAITER UN INCIDENT',status:'STATUT / À DÉCIDER',steps:[['Décrire les faits','Constat, heure et impact sur l’arrivée'],['Alerter le responsable','Urgence et canal approprié'],['Suivre la résolution','Action, responsable et statut final']]}
};
const buttons=[...document.querySelectorAll('button[data-preview]')],title=document.getElementById('previewTitle'),ref=document.getElementById('previewRef'),sub=document.getElementById('previewSub'),status=document.getElementById('previewStatus'),steps=document.getElementById('previewSteps');
if(!buttons.length||!title||!steps)return;
function show(key){
 const d=data[key];if(!d)return;
 ref.textContent=key+' / EXTRAIT';sub.textContent=d.sub;status.textContent=d.status;title.replaceChildren();
 d.title.forEach((str,i)=>{if(i)title.append(document.createElement('br'));if(i===2){const em=document.createElement('em');em.textContent=str;title.append(em)}else title.append(document.createTextNode(str))});
 steps.replaceChildren(...d.steps.map(([n,desc],i)=>{const li=document.createElement('li'),s=document.createElement('span'),b=document.createElement('strong'),sm=document.createElement('small');s.textContent=String(i+1).padStart(2,'0');b.textContent=n;sm.textContent=desc;li.append(s,b,sm);return li}));
 buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.preview===key)));
}
buttons.forEach(button=>button.addEventListener('click',()=>show(button.dataset.preview)));
})();