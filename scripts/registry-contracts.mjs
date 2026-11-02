// Contrats de registres : outillage de recette interne, non un produit premium.
import {readFileSync} from 'node:fs';
export const contracts=JSON.parse(readFileSync(new URL('../data/registry-contracts.json',import.meta.url),'utf8'));
const refPattern=/^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const versionPattern=/^v[0-9]+\.[0-9]+(?:\.[0-9]+)?$/;
const hashPattern=/^[a-fA-F0-9]{64}$/;
const ISOOffset=/(?:Z|[+-][0-9]{2}:[0-9]{2})$/;
const dangerousCell=/^[\s\uFEFF\u200B]*[=+@\-]/u;
const forbiddenValue=/\b(?:sk_live_|pk_live_|BEGIN PRIVATE KEY|api[_-]?key\s*[:=]|password\s*[:=])\b/i;

export function registryById(id){
 return contracts.registries.find(r=>r.id===id)||null;
}
export function validateRecord(registryId,record){
 const errors=[];
 const registry=registryById(registryId);
 if(!registry)return ['registre_inconnu'];
 if(!record||typeof record!=='object'||Array.isArray(record))return ['enregistrement_invalide'];
 const fields={...contracts.common_fields,...registry.fields};
 for(const key of Object.keys(record)){
  if(!Object.hasOwn(fields,key))errors.push('champ_inconnu:'+key);
  if(contracts.forbidden_columns.some(c=>c.toLowerCase()===key.toLowerCase()))errors.push('champ_interdit:'+key);
 }
 for(const [key,rules] of Object.entries(fields)){
  const value=record[key];
  if(value===undefined||value===null||value===''){
   if(rules.required)errors.push('champ_requis:'+key);
   continue;
  }
  if(rules.type==='integer'){
   if(!Number.isSafeInteger(value)||value<rules.min||value>rules.max)errors.push('entier_invalide:'+key);
   continue;
  }
  if(typeof value!=='string'){errors.push('chaine_requise:'+key);continue;}
  if(/\r|\n|\0/.test(value))errors.push('controle_interdit:'+key);
  if(forbiddenValue.test(value))errors.push('secret_possible:'+key);
  if(rules.max_length&&value.length>rules.max_length)errors.push('longueur_invalide:'+key);
  switch(rules.type){
   case 'ref': if(!refPattern.test(value))errors.push('reference_invalide:'+key);break;
   case 'text': if(dangerousCell.test(value))errors.push('injection_tableur:'+key);break;
   case 'enum': if(!rules.values.includes(value))errors.push('valeur_inconnue:'+key);break;
   case 'date-time': if(!ISOOffset.test(value)||!Number.isFinite(Date.parse(value)))errors.push('date_invalide:'+key);break;
   case 'version': if(!versionPattern.test(value))errors.push('version_invalide:'+key);break;
   case 'sha256': if(!hashPattern.test(value))errors.push('empreinte_invalide:'+key);break;
   default: errors.push('type_inconnu:'+key);
  }
 }
 if(registryId==='R02'){
  if(record.checkout_at&&record.checkin_at&&Number.isFinite(Date.parse(record.checkout_at))&&Number.isFinite(Date.parse(record.checkin_at))&&Date.parse(record.checkin_at)<=Date.parse(record.checkout_at))errors.push('arrivee_avant_depart');
  if(record.acceptance_state==='confirmee'&&!record.confirmation_ref)errors.push('confirmation_sans_trace');
  if(record.acceptance_state==='confirmee'&&!record.assignment_ref)errors.push('affectation_sans_trace');
  if(['en_cours','termine'].includes(record.work_state)&&record.acceptance_state!=='confirmee')errors.push('travail_sans_acceptation');
  if(record.availability_state==='pret'&&(record.acceptance_state!=='confirmee'||record.work_state!=='termine'||record.inspection_state!=='conforme'||!record.inspector_role||!record.confirmation_ref||!record.assignment_ref))errors.push('pret_sans_preuves');
  if(record.inspection_state==='non_conforme'&&record.availability_state==='pret')errors.push('non_conforme_declare_pret');
 }
 if(registryId==='R03'&&record.state==='verifiee'&&!record.verified_at)errors.push('verification_sans_date');
 if(registryId==='R04'&&typeof record.quantity==='number'&&typeof record.alert_threshold==='number'&&record.quantity<record.alert_threshold&&record.replenishment_state==='aucun')errors.push('seuil_franchi_sans_action');
 if(registryId==='R05'&&record.sender_actor_ref&&record.receiver_actor_ref&&record.sender_actor_ref===record.receiver_actor_ref)errors.push('passation_a_soi_meme');
 if(registryId==='R06'&&['restitue','clos'].includes(record.custody_state)&&!record.resolved_at)errors.push('objet_clos_sans_date');
 if(registryId==='R07'&&record.approval_state==='approuve'&&!record.reviewer_role)errors.push('approbation_sans_relecteur');
 return [...new Set(errors)];
}

export function validateReadiness(rotation,anomalies=[]){
 const errors=validateRecord('R02',rotation);
 const blockers=anomalies.filter(x=>x.rotation_ref===rotation.rotation_ref&&x.severity==='bloquante'&&x.state!=='verifiee');
 for(const incident of anomalies){
  if(incident.rotation_ref===rotation.rotation_ref)errors.push(...validateRecord('R03',incident).map(e=>'anomalie_'+incident.incident_ref+':'+e));
 }
 if(rotation.availability_state==='pret'&&blockers.length)errors.push('incident_bloquant_non_verifie');
 return [...new Set(errors)];
}

// Mémo : ces contrôles sont des validations synthétiques de schéma. Aucun essai Excel réel.
