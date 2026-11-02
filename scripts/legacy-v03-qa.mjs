/**
 * Validation de cohérence des sept CSV historiques V0.3, sur copies et données fictives.
 * Ni migrateur, ni moteur de décisions opérationnelles, ni validation métier.
 * Aucune dépendance npm. Ne charge pas les documents premium dans le dépôt public.
 */
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
const schema=JSON.parse(readFileSync(new URL('../data/legacy-v03-csv-contract.json', import.meta.url),'utf8'));
const forbiddenText=/\b(?:sk_(?:live|test)_[a-z0-9]+|(?:password|mot\s*de\s*passe|code\s*d.acc[eè]s|api[_-]?key)\s*[:=]|BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY)/i;
const formula=/^[\s\uFEFF\u200B]*[=+@\-]/u;
const timeRegex=/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?(?:Z|[+-]\d\d:\d\d)$/;
const refRegex=/^[A-Za-z][A-Za-z0-9._-]{1,79}$/;
const documents=new Set([...Array(15)].map((_,i)=>'P'+String(i+1).padStart(2,'0')));
const isFullTime = v => typeof v==='string' && timeRegex.test(v) && Number.isFinite(Date.parse(v));
const string = x => typeof x==='string' ? x.trim() : '';
const nonempty = x => string(x).length>0;

/** Parse CSV RFC4180 (séparateur ;), guillemets doublés, UTF-8 BOM et LF/CRLF. */
export function parseCsv(text){
 if(typeof text!=='string')throw new TypeError('CSV must be text');
 const source=text.startsWith('\uFEFF')?text.slice(1):text;
 const rows=[];let row=[],value='',quoted=false,closed=false;
 for(let i=0;i<source.length;i++){
  const c=source[i];
  if(quoted){
   if(c==='"'&&source[i+1]==='"'){value+='"';i++}
   else if(c==='"'){quoted=false;closed=true}
   else value+=c;
   continue;
  }
  if(c==='"'){
   if(value.length||closed)throw new Error('guillemet_inattendu');
   quoted=true;continue;
  }
  if(c===';'){row.push(value);value='';closed=false;continue;}
  if(c==='\n'||c==='\r'){
   if(c==='\r'&&source[i+1]==='\n')i++;
   if(row.length||value||closed){row.push(value);rows.push(row)}
   row=[];value='';closed=false;continue;
  }
  if(closed)throw new Error('texte_apres_guillemet');
  value+=c;
 }
 if(quoted)throw new Error('guillemet_non_ferme');
 if(row.length||value||closed){row.push(value);rows.push(row)}
 if(!rows.length)throw new Error('csv_vide_sans_entete');
 const header=rows.shift();
 return {header,rows:rows.map((values,i)=>({line:i+2,values}))};
}

export function parseRegistryCsv(id,text){
 const cfg=schema.registries.find(x=>x.id===id);
 if(!cfg)throw new Error('registre_inconnu:'+id);
 const parsed=parseCsv(text);
 if(parsed.header.join('\u0000')!==cfg.columns.join('\u0000'))throw new Error('entete_incompatible:'+id);
 const rows=parsed.rows.map(({line,values})=>{
  if(values.length!==cfg.columns.length)throw new Error('largeur_invalide:'+id+':ligne_'+line);
  const obj=Object.fromEntries(cfg.columns.map((col,i)=>[col,values[i]]));
  Object.defineProperty(obj,'__line',{value:line,enumerable:false});
  return obj;
 });
 return rows;
}

export function loadLegacyFolder(folder){
 return Object.fromEntries(schema.registries.map(cfg=>[cfg.id,parseRegistryCsv(cfg.id,readFileSync(join(folder,cfg.file),'utf8'))]));
}

export function validateLegacyPack(input,{requireAllFiles=true}={}){
 const errors=[],warnings=[];
 const add=(level,registry,row,code,detail='')=>({level,registry,reference:row?Object.values(row)[0]||'':null,line:row?.__line||null,code,detail});
 const fail=(r,x,c,d)=>errors.push(add('error',r,x,c,d));
 const warn=(r,x,c,d)=>warnings.push(add('warning',r,x,c,d));
 const data={};
 for(const cfg of schema.registries){
  const val=input?.[cfg.id];
  if(val===undefined){if(requireAllFiles)fail(cfg.id,null,'registre_manquant');data[cfg.id]=[];continue}
  if(!Array.isArray(val)){fail(cfg.id,null,'registre_non_tableau');data[cfg.id]=[];continue}
  data[cfg.id]=val;
  const seen=new Set();
  const keyField={R01:'id_logement',R02:'id_rotation',R03:'id_incident',R06:'id_objet',R07:'id_document'}[cfg.id];
  for(const row of val){
   if(row===null||typeof row!=='object'||Array.isArray(row)){fail(cfg.id,null,'ligne_invalide');continue}
   if(cfg.columns.some(col=>!Object.hasOwn(row,col)))fail(cfg.id,row,'colonne_absente');
   for(const [col,cell] of Object.entries(row)){
    if(!cfg.columns.includes(col)){fail(cfg.id,row,'colonne_non_autorisee',col);continue}
    if(typeof cell!=='string'){fail(cfg.id,row,'cellule_non_texte',col);continue}
    if(/[\r\n\0]/.test(cell))fail(cfg.id,row,'controle_interdit',col);
    if(forbiddenText.test(cell))fail(cfg.id,row,'secret_potentiel',col);
    if(formula.test(cell))fail(cfg.id,row,'injection_tableur',col);
   }
   if(keyField){
    const key=row[keyField];
    if(!nonempty(key)||!refRegex.test(key))fail(cfg.id,row,'identifiant_invalide',keyField);
    else if(seen.has(key))fail(cfg.id,row,'identifiant_duplique',key);else seen.add(key);
   }
  }
 }
 const ids=(id,field)=>new Set(data[id].map(x=>x?.[field]).filter(Boolean));
 const properties=ids('R01','id_logement'),rotations=ids('R02','id_rotation');
 const incidentsByRotation=new Map();
 const qualifiedIncidents=(data.R03||[]).filter(x=>x&&typeof x==='object');
 for(const row of qualifiedIncidents){
  if(!rotations.has(row.id_rotation))fail('R03',row,'rotation_introuvable',row.id_rotation);
  if(!properties.has(row.id_logement))fail('R03',row,'logement_introuvable',row.id_logement);
  const rot=data.R02.find(x=>x?.id_rotation===row.id_rotation);
  if(rot&&rot.id_logement!==row.id_logement)fail('R03',row,'incident_mauvais_logement',row.id_logement);
  if(row.signalee_le&&!isFullTime(row.signalee_le))fail('R03',row,'date_signalement_invalide');
  if(row.gravite==='critique'&&row.impact_arrivee!=='BLOQUE')fail('R03',row,'critique_declassee_sans_impact');
  if(row.statut==='CLOTURE'&&!isFullTime(row.resolution_verifiee_le))fail('R03',row,'cloture_sans_verification');
  if(row.cloture_le&&!isFullTime(row.resolution_verifiee_le))fail('R03',row,'cloture_non_justifiee');
  if(row.resolution_verifiee_le&&!isFullTime(row.resolution_verifiee_le))fail('R03',row,'date_verification_invalide');
  if(!incidentsByRotation.has(row.id_rotation))incidentsByRotation.set(row.id_rotation,[]);
  incidentsByRotation.get(row.id_rotation).push(row);
 }
 const intervals=new Map();
 for(const row of data.R02){
  if(!properties.has(row.id_logement))fail('R02',row,'logement_introuvable',row.id_logement);
  for(const field of ['depart_prevu_local','arrivee_prevue_locale']){
   if(!isFullTime(row[field]))fail('R02',row,'date_creneau_invalide',field);
  }
  const depart=Date.parse(row.depart_prevu_local),arrivee=Date.parse(row.arrivee_prevue_locale);
  if(Number.isFinite(depart)&&Number.isFinite(arrivee)){
   if(arrivee<=depart)fail('R02',row,'creneau_negatif_ou_nul');
   if(!intervals.has(row.id_logement))intervals.set(row.id_logement,[]);
   for(const old of intervals.get(row.id_logement))if(depart<old.arrivee&&old.depart<arrivee)fail('R02',row,'rotations_superposees',old.ref);
   intervals.get(row.id_logement).push({depart,arrivee,ref:row.id_rotation});
  }
  if(row.fuseau_horaire&&row.fuseau_horaire!=='Europe/Paris')warn('R02',row,'fuseau_a_valider',row.fuseau_horaire);
  if(row.statut_mission==='CONFIRMEE'&&!isFullTime(row.confirmation_mission_le))fail('R02',row,'mission_confirmee_sans_date');
  if(row.statut_final==='PRET'){
   if(row.statut_mission!=='CONFIRMEE')fail('R02',row,'pret_sans_mission_confirmee');
   if(row.statut_preparation!=='TERMINE')fail('R02',row,'pret_sans_intervention_terminee');
   if(row.statut_controle!=='CONFORME')fail('R02',row,'pret_sans_controle_conforme');
   if(!nonempty(row.controleur_ref)||!isFullTime(row.controle_effectue_le))fail('R02',row,'pret_sans_preuve_controle');
   if(!nonempty(row.validateur_ref)||!isFullTime(row.validation_finale_le))fail('R02',row,'pret_sans_validation_finale');
  }
  const incidentList=incidentsByRotation.get(row.id_rotation)||[];
  const blockers=incidentList.filter(inc=>(inc.impact_arrivee==='BLOQUE'||inc.gravite==='critique')&&(!isFullTime(inc.resolution_verifiee_le)||!isFullTime(inc.cloture_le)));
  const expected=blockers.length;
  if(!/^\d+$/.test(row.anomalies_bloquantes_ouvertes))fail('R02',row,'nombre_anomalies_invalide');
  else if(Number(row.anomalies_bloquantes_ouvertes)!==expected)fail('R02',row,'nombre_anomalies_incoherent',String(expected));
  if(row.statut_final==='PRET'&&blockers.length)fail('R02',row,'pret_malgre_incident_bloquant',String(blockers.length));
  if(row.statut_final==='PRET'&&isFullTime(row.validation_finale_le)&&isFullTime(row.controle_effectue_le)&&Date.parse(row.validation_finale_le)<Date.parse(row.controle_effectue_le))fail('R02',row,'validation_avant_controle');
  if(row.statut_final==='PRET'&&isFullTime(row.confirmation_mission_le)&&isFullTime(row.controle_effectue_le)&&Date.parse(row.controle_effectue_le)<Date.parse(row.confirmation_mission_le))fail('R02',row,'controle_avant_confirmation');
  if(row.statut_final==='PRET'&&!nonempty(row.intervenant_ref))fail('R02',row,'pret_sans_intervenant');
  if(row.statut_final==='BLOQUE'&&!nonempty(row.prochaine_action))warn('R02',row,'blocage_sans_prochaine_action');
 }
 for(const row of data.R04){
  if(!properties.has(row.id_logement))fail('R04',row,'logement_introuvable');
  const n=Number(row.stock_constate),seuil=Number(row.seuil_local),reappro=Number(row.quantite_a_reapprovisionner);
  if([n,seuil,reappro].some(x=>!Number.isFinite(x)||x<0))fail('R04',row,'stock_ou_seuil_invalide');
  else if(n<seuil&&(reappro<seuil-n||!nonempty(row.action_decidee)||!nonempty(row.responsable_ref)))fail('R04',row,'reapprovisionnement_insuffisant');
 }
 for(const row of data.R05){
  if(!rotations.has(row.id_rotation))fail('R05',row,'rotation_introuvable',row.id_rotation);
  if(nonempty(row.coordinateur_sortant_ref)&&row.coordinateur_sortant_ref===row.coordinateur_entrant_ref)fail('R05',row,'passation_a_soi_meme');
  if(!isFullTime(row.transmission_le))fail('R05',row,'transmission_sans_date');
  if(!nonempty(row.accuse_reception_le))warn('R05',row,'passation_non_accusee');
  else if(!isFullTime(row.accuse_reception_le))fail('R05',row,'accuse_reception_invalide');
  if(!nonempty(row.responsable_action))fail('R05',row,'action_sans_responsable');
 }
 for(const row of data.R06){
  if(!properties.has(row.id_logement))fail('R06',row,'logement_introuvable');
  if(!isFullTime(row.constate_le))fail('R06',row,'decouverte_sans_date');
  if(!nonempty(row.responsable_ref)||!nonempty(row.lieu_garde_securise_reference))fail('R06',row,'objet_sans_gardien');
  if(row.statut==='CLOTURE'&&!isFullTime(row.cloture_le))fail('R06',row,'objet_clos_sans_date');
  if(!nonempty(row.date_limite_traitement))warn('R06',row,'date_limite_objet_absente');
 }
 for(const row of data.R07){
  if(!documents.has(row.id_document))warn('R07',row,'version_hors_15_procedures');
  if(row.statut_validation==='APPROUVE'&&(!nonempty(row.relecteur_ref)||!isFullTime(row.date_validation)))fail('R07',row,'approbation_sans_preuve');
  if(row.statut_validation==='EN_REVISION'&&nonempty(row.date_validation))fail('R07',row,'brouillon_declare_date_validee');
  if(!nonempty(row.nouvelle_version))fail('R07',row,'nouvelle_version_absente');
 }
 return {valid:errors.length===0,errors,warnings,counts:Object.fromEntries(schema.registries.map(x=>[x.id,data[x.id].length]))};
}

/** Indicateurs recalculables à partir des références fictives, jamais un KPI métier certifié. */
export function summarizeLegacyMonth(data,month){
 if(!/^\d{4}-(?:0[1-9]|1[0-2])$/.test(month))throw new Error('mois_invalide');
 const inMonth=(row,field)=>typeof row?.[field]==='string'&&row[field].slice(0,7)===month;
 const rotations=(data.R02||[]).filter(x=>inMonth(x,'depart_prevu_local'));
 const rotationIds=new Set(rotations.map(x=>x.id_rotation));
 const incidents=(data.R03||[]).filter(x=>rotationIds.has(x.id_rotation));
 const stocks=(data.R04||[]).filter(x=>inMonth(x,'controle_le'));
 const handoffs=(data.R05||[]).filter(x=>inMonth(x,'transmission_le'));
 const objects=(data.R06||[]).filter(x=>inMonth(x,'constate_le'));
 return {
  month,
  rotations:rotations.length,
  ready:rotations.filter(x=>x.statut_final==='PRET').length,
  blocked:rotations.filter(x=>x.statut_final==='BLOQUE').length,
  other:rotations.filter(x=>!['PRET','BLOQUE'].includes(x.statut_final)).length,
  incident_count:incidents.length,
  blocking_incidents_open:incidents.filter(x=>(x.impact_arrivee==='BLOQUE'||x.gravite==='critique')&&(!isFullTime(x.resolution_verifiee_le)||!isFullTime(x.cloture_le))).length,
  stock_alerts:stocks.filter(x=>Number(x.stock_constate)<Number(x.seuil_local)).length,
  pending_handoffs:handoffs.filter(x=>!nonempty(x.accuse_reception_le)).length,
  objects_found:objects.length
 };
}