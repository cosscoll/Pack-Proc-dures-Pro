import test from 'node:test';
import assert from 'node:assert/strict';
import {contracts,registryById,validateRecord,validateReadiness} from '../scripts/registry-contracts.mjs';

const now='2026-11-02T09:00:00+01:00';
const row={record_ref:'REC-001',updated_at:now};
const rotation={...row,rotation_ref:'ROT-001',property_ref:'LOG-001',checkout_at:'2026-11-02T10:00:00+01:00',checkin_at:'2026-11-02T16:00:00+01:00',assignment_ref:'ASS-001',acceptance_state:'confirmee',work_state:'termine',inspection_state:'conforme',availability_state:'pret',inspector_role:'controleur_designe',confirmation_ref:'ACK-001'};
const anomaly={...row,incident_ref:'INC-001',rotation_ref:'ROT-001',severity:'bloquante',state:'ouverte',assigned_role:'coordinateur',description_code:'EQUIP-001'};
function includesError(id,record,error){assert.ok(validateRecord(id,record).includes(error),id+': '+error);}

test('registre R01–R07 : schema exhaustif et champs reserves',()=>{
 assert.equal(contracts.registries.length,7);
 assert.deepEqual(contracts.registries.map(x=>x.id),['R01','R02','R03','R04','R05','R06','R07']);
 for(const r of contracts.registries){
  assert.ok(r.name&&r.purpose);
  assert.ok(registryById(r.id)===r);
  assert.ok(Object.values(r.fields).every(f=>['text','ref','enum','integer','date-time','version','sha256'].includes(f.type)));
 }
 assert.equal(registryById('R99'),null);
});

test('rotation confirmée, achevée, contrôlée : validation nominale',()=>{
 assert.deepEqual(validateRecord('R02',rotation),[]);
 assert.deepEqual(validateReadiness(rotation,[]),[]);
});

test('mission non confirmée : jamais prête',()=>{
 const invalid={...rotation,acceptance_state:'proposee',confirmation_ref:undefined};
 includesError('R02',invalid,'travail_sans_acceptation');
 includesError('R02',invalid,'pret_sans_preuves');
});

test('logement prétendu prêt avant contrôle : refus',()=>{
 includesError('R02',{...rotation,inspection_state:'en_attente'},'pret_sans_preuves');
 includesError('R02',{...rotation,inspection_state:'non_conforme'},'non_conforme_declare_pret');
});

test('incident bloquant non vérifié : ne pas livrer en prêt',()=>{
 assert.ok(validateReadiness(rotation,[anomaly]).includes('incident_bloquant_non_verifie'));
 assert.deepEqual(validateReadiness(rotation,[{...anomaly,state:'verifiee',verified_at:now}]),[]);
});

test('problèmes temporels et preuves de confirmation',()=>{
 includesError('R02',{...rotation,checkin_at:'2026-11-02T09:00:00+01:00'},'arrivee_avant_depart');
 includesError('R02',{...rotation,confirmation_ref:undefined},'confirmation_sans_trace');
});

test('registre d’anomalies exige une date de vérification finale',()=>{
 includesError('R03',{...anomaly,state:'verifiee',verified_at:undefined},'verification_sans_date');
 assert.deepEqual(validateRecord('R03',{...anomaly,state:'verifiee',verified_at:now}),[]);
});

test('stocks : quantité négative ou seuil sans décision => refus',()=>{
 const stock={...row,stock_ref:'STK-001',property_ref:'LOG-001',item_ref:'LINGE-001',quantity:2,alert_threshold:5,replenishment_state:'aucun'};
 includesError('R04',stock,'seuil_franchi_sans_action');
 includesError('R04',{...stock,quantity:-1},'entier_invalide:quantity');
 assert.deepEqual(validateRecord('R04',{...stock,replenishment_state:'a_etudier'}),[]);
});

test('objet restitué : date requise',()=>{
 const item={...row,object_ref:'OBJ-001',property_ref:'LOG-001',category:'accessoire',found_at:now,custody_role:'coordinateur',custody_state:'restitue',retention_rule_ref:'POL-001'};
 includesError('R06',item,'objet_clos_sans_date');
 assert.deepEqual(validateRecord('R06',{...item,resolved_at:now}),[]);
});

test('versions : empreinte cryptographique et relecteur',()=>{
 const revision={...row,artifact_ref:'P01',version:'v0.2.1',sha256:'a'.repeat(64),approval_state:'approuve',revision_at:now};
 includesError('R07',revision,'approbation_sans_relecteur');
 assert.deepEqual(validateRecord('R07',{...revision,reviewer_role:'expert_metier'}),[]);
 includesError('R07',{...revision,reviewer_role:'expert_metier',sha256:'abc'},'empreinte_invalide:sha256');
});

test('refuser colonnes inconnues, secrets et injection tableur dans texte libre',()=>{
 const log={...row,property_ref:'LOG-001',property_label:'=HYPERLINK("https://unsafe.example")',responsible_role:'coordinateur',checklist_version:'P04-v1'};
 includesError('R01',log,'injection_tableur:property_label');
 includesError('R01',{...log,property_label:'Logement_A',password:'code'},'champ_interdit:password');
 includesError('R01',{...log,property_label:'Logement_A',unknown_custom:'x'},'champ_inconnu:unknown_custom');
 assert.deepEqual(validateRecord('R01',{...log,property_label:'Logement_A'}),[]);
});

test('noms et coordonnées de voyageurs jamais autorisés comme colonnes',()=>{
 const item={...row,property_ref:'LOG-001',property_label:'LOGEMENT-001',responsible_role:'coordinateur',checklist_version:'P04-v1'};
 for(const key of ['nom_voyageur','email_voyageur','code_acces','api_key'])assert.ok(validateRecord('R01',{...item,[key]:'x'}).includes('champ_interdit:'+key));
});

test('passation entre deux personnes de même rôle permise, pas vers soi-même',()=>{
 const handoff={...row,handoff_ref:'HOF-001',rotation_ref:'ROT-001',sender_role:'coordinateur',receiver_role:'coordinateur',sender_actor_ref:'USR-001',receiver_actor_ref:'USR-002',pending_action_ref:'ACTION-001',ack_state:'acceptee',handoff_at:now};
 assert.deepEqual(validateRecord('R05',handoff),[]);
 includesError('R05',{...handoff,receiver_actor_ref:'USR-001'},'passation_a_soi_meme');
});

test('mission confirmée sans trace d’attribution : refus',()=>{
 includesError('R02',{...rotation,assignment_ref:undefined},'affectation_sans_trace');
});

test('couverture des procédures par les registres proposés',()=>{
 const covers=new Set(contracts.registries.flatMap(reg=>reg.related_procedures));
 const expected=Array.from({length:15},(_,i)=>'P'+String(i+1).padStart(2,'0'));
 assert.deepEqual([...covers].sort(),expected.sort());
});
