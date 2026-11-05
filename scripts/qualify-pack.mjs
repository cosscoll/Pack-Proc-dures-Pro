// Contrôle de libération documentaire — n'expose aucun contenu premium.
// CLI : node scripts/qualify-pack.mjs
import {readFileSync} from 'node:fs';

const sha=/^[a-f0-9]{64}$/i;
const datetime=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/;
const hasText=value=>typeof value==='string'&&value.trim().length>0;
const isProof=p=>p&&typeof p==='object'&&p.storage==='prive'&&sha.test(p.sha256||'')&&hasText(p.ref);
const idList=[...Array.from({length:15},(_,i)=>'P'+String(i+1).padStart(2,'0')),...Array.from({length:7},(_,i)=>'R'+String(i+1).padStart(2,'0'))];
const caseList=Array.from({length:12},(_,i)=>'C'+String(i+1).padStart(2,'0'));
const validStates=['a_valider','en_correction','valide'];
const testOk=x=>x==='passe';
const reviewOk=reviewer=>reviewer&&typeof reviewer==='object'&&reviewer.independent===true&&
  hasText(reviewer.id)&&hasText(reviewer.qualification)&&!/@/.test(reviewer.id);

function documentIssues(item){
 const issues=[];
 if(!validStates.includes(item.status))issues.push('statut_inconnu');
 if(item.status!=='valide'){issues.push('non_valide');return issues;}
 if(!hasText(item.source_version))issues.push('version_absente');
 if(!sha.test(item.sha256||''))issues.push('empreinte_absente');
 if(!reviewOk(item.reviewer))issues.push('revue_independante_absente');
 if(typeof item.reviewed_at!=='string'||!datetime.test(item.reviewed_at)||!Number.isFinite(Date.parse(item.reviewed_at)))issues.push('date_revue_invalide');
 if((item.blockers||[]).length)issues.push('blocages_non_leves');
 const evidence=item.evidence||[];
 if(!Array.isArray(evidence))issues.push('preuves_incorrectes');
 else for(const type of ['nominal','exception']){
  if(!evidence.some(p=>p.type===type&&p.result==='passe'&&isProof(p)))issues.push('preuve_'+type+'_absente');
 }
 if(item.kind==='procedure'){
  for(const format of ['docx','pdf']){
   if(!testOk(item.format_tests?.[format]))issues.push('format_'+format+'_non_teste');
  }
 }else if(item.kind==='registre'){
  for(const format of ['csv','excel_real','libreoffice_real']){
   if(!testOk(item.format_tests?.[format]))issues.push('format_'+format+'_non_teste');
  }
 }else issues.push('type_inconnu');
 return issues;
}

export function assessRelease(manifest,acceptance,release){
 const errors=[];
 const requirements=manifest?.requirements;
 const cases=acceptance?.cases;
 if(!Array.isArray(requirements))errors.push('manifest_requirements_absentes');
 if(!Array.isArray(cases))errors.push('scenarios_absents');
 const requirementIds=requirements?.map(x=>x.id)||[];
 const scenarioIds=cases?.map(x=>x.id)||[];
 for(const id of idList)if(requirementIds.filter(x=>x===id).length!==1)errors.push('identifiant_document_manquant_ou_duplique:'+id);
 for(const id of caseList)if(scenarioIds.filter(x=>x===id).length!==1)errors.push('identifiant_cas_manquant_ou_duplique:'+id);
 const documents=Array.isArray(requirements)?requirements.map(x=>({id:x.id,title:x.title,issues:documentIssues(x)})):[];
 const scenarios=Array.isArray(cases)?cases.map(x=>{
  const issues=[];
  if(x.status!=='accepte')issues.push('cas_non_accepte');
  else{
   if(!reviewOk(x.reviewer))issues.push('relecteur_independant_absent');
   if(!datetime.test(x.reviewed_at||''))issues.push('date_essai_absente');
   if(!isProof(x.nominal))issues.push('preuve_nominale_absente');
   if(!isProof(x.exception))issues.push('preuve_exception_absente');
   if(!Array.isArray(x.documents)||!x.documents.length||x.documents.some(id=>!idList.includes(id)))issues.push('documents_incoherents');
  }
  return {id:x.id,issues};
 }):[];
 const productReady=errors.length===0&&documents.length===22&&scenarios.length===12&&
  documents.every(d=>d.issues.length===0)&&scenarios.every(c=>c.issues.length===0);
 // La qualité métier NE vaut PAS autorisation d'encaisser, servir le contenu privé ou délivrer.
 const commercialKeys=['vendeur_identifie','conditions_validees','prix_approuve','paiement_sandbox_teste','livraison_privee_testee','support_operationnel','licences_controlees'];
 const commercialBlockers=commercialKeys.filter(k=>release?.[k]!==true);
 const commercialReady=productReady&&commercialBlockers.length===0&&release?.autorisation_explicite===true;
 return {
  product:'ROTATION-001',
  files_total:22,
  files_validated:documents.filter(d=>d.issues.length===0).length,
  cases_total:12,
  cases_accepted:scenarios.filter(d=>d.issues.length===0).length,
  product_ready:productReady,
  commercial_ready:commercialReady,
  gate_errors:errors,
  blocked_documents:documents.filter(x=>x.issues.length),
  blocked_cases:scenarios.filter(x=>x.issues.length),
  commercial_blockers:[...commercialBlockers,...(!release?.autorisation_explicite?['autorisation_explicite']:[]),...(!productReady?['qualite_metier_incomplete']:[])]
 };
}
export const loadReleaseInputs=()=>({
 manifest:JSON.parse(readFileSync(new URL('../data/validation-conciergerie.json',import.meta.url),'utf8')),
 acceptance:JSON.parse(readFileSync(new URL('../data/acceptation-cases.json',import.meta.url),'utf8')),
 release:JSON.parse(readFileSync(new URL('../data/launch-gates.json',import.meta.url),'utf8'))
});
if(process.argv[1]&&import.meta.url.endsWith('/'+process.argv[1].replace(/\\/g,'/').split('/').slice(-2).join('/'))){
 const {manifest,acceptance,release}=loadReleaseInputs();
 const report=assessRelease(manifest,acceptance,release);
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
