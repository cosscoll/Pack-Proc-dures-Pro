import test from 'node:test';
import assert from 'node:assert/strict';
import {assessRelease,loadReleaseInputs} from '../scripts/qualify-pack.mjs';

const validHash='a'.repeat(64);
const proof=type=>({type,ref:'PRIVATE-ARCHIVE:'+type,sha256:validHash,storage:'prive',result:'passe'});
const sign=()=>({id:'METIER-TEST-01',qualification:'responsable_conciergerie',independent:true});
const cloned=x=>JSON.parse(JSON.stringify(x));
const {manifest,acceptance,release}=loadReleaseInputs();
const readyFixture=()=>{
 const m=cloned(manifest),a=cloned(acceptance),r=cloned(release);
 m.requirements.forEach(item=>{
  item.status='valide';
  item.source_version='V0.6.1';
  item.sha256=validHash;
  item.reviewer=sign();
  item.reviewed_at='2026-11-05T11:00:00+01:00';
  item.evidence=[proof('nominal'),proof('exception')];
  item.blockers=[];
  const formats=item.kind==='procedure'?['docx','pdf']:['csv','excel_real','libreoffice_real'];
  formats.forEach(key=>item.format_tests[key]='passe');
 });
 a.cases.forEach(c=>{
  c.status='accepte';
  c.reviewer=sign();
  c.reviewed_at='2026-11-05T11:30:00+01:00';
  c.nominal=proof('nominal');
  c.exception=proof('exception');
  c.documents=['P01','R02'];
 });
 for(const k of Object.keys(r))if(typeof r[k]==='boolean')r[k]=true;
 return {m,a,r};
};

test('La version réelle reste bloquée : 0/22 et 0/12',()=>{
 const result=assessRelease(manifest,acceptance,release);
 assert.equal(result.files_total,22);
 assert.equal(result.files_validated,0);
 assert.equal(result.cases_total,12);
 assert.equal(result.cases_accepted,0);
 assert.equal(result.product_ready,false);
 assert.equal(result.commercial_ready,false);
 assert.ok(result.commercial_blockers.includes('qualite_metier_incomplete'));
});
test('La simulation complète reste distincte d une vraie validation métier',()=>{
 const {m,a,r}=readyFixture(),q=assessRelease(m,a,r);
 assert.equal(q.product_ready,true);
 assert.equal(q.commercial_ready,true);
});
test('Statut déclaré validé sans relecteur indépendant : REFUS',()=>{
 const {m,a,r}=readyFixture();
 m.requirements[0].reviewer.independent=false;
 const q=assessRelease(m,a,r);
 assert.equal(q.product_ready,false);
 assert.ok(q.blocked_documents.find(x=>x.id==='P01').issues.includes('revue_independante_absente'));
});
test('Empreinte ou nom de version invalide : REFUS',()=>{
 const {m,a,r}=readyFixture();
 m.requirements[4].sha256='not-a-hash';
 m.requirements[7].source_version='';
 const q=assessRelease(m,a,r);
 assert.equal(q.product_ready,false);
 assert.ok(q.blocked_documents.some(x=>x.id==='P05'&&x.issues.includes('empreinte_absente')));
 assert.ok(q.blocked_documents.some(x=>x.id==='P08'&&x.issues.includes('version_absente')));
});
test('Une exception non vérifiée bloque une procédure et un scénario',()=>{
 const {m,a,r}=readyFixture();
 m.requirements[0].evidence=[proof('nominal')];
 a.cases[0].exception=null;
 const q=assessRelease(m,a,r);
 assert.equal(q.product_ready,false);
 assert.ok(q.blocked_documents.find(x=>x.id==='P01').issues.includes('preuve_exception_absente'));
 assert.ok(q.blocked_cases.find(x=>x.id==='C01').issues.includes('preuve_exception_absente'));
});
test('Un registre sans vraie recette Excel/LibreOffice ne peut être vendu',()=>{
 const {m,a,r}=readyFixture();
 const registry=m.requirements.find(x=>x.id==='R02');
 registry.format_tests.excel_real='non_teste';
 registry.format_tests.libreoffice_real='non_teste';
 const q=assessRelease(m,a,r);
 assert.ok(q.blocked_documents.find(x=>x.id==='R02').issues.includes('format_excel_real_non_teste'));
 assert.ok(q.blocked_documents.find(x=>x.id==='R02').issues.includes('format_libreoffice_real_non_teste'));
});
test('Doublons des identifiants : refus systématique',()=>{
 const {m,a,r}=readyFixture();
 m.requirements.push(cloned(m.requirements[0]));
 const q=assessRelease(m,a,r);
 assert.equal(q.product_ready,false);
 assert.ok(q.gate_errors.some(x=>x==='identifiant_document_manquant_ou_duplique:P01'));
});
test('Qualité documentaire n autorise PAS la commercialisation',()=>{
 const {m,a,r}=readyFixture();
 r.paiement_sandbox_teste=false;
 r.autorisation_explicite=false;
 const q=assessRelease(m,a,r);
 assert.equal(q.product_ready,true);
 assert.equal(q.commercial_ready,false);
 assert.ok(q.commercial_blockers.includes('paiement_sandbox_teste'));
 assert.ok(q.commercial_blockers.includes('autorisation_explicite'));
});
test('Une preuve publique ou non traçable bloque le feu vert',()=>{
 const {m,a,r}=readyFixture();
 m.requirements[0].evidence[0].storage='public';
 const q=assessRelease(m,a,r);
 assert.equal(q.product_ready,false);
 assert.ok(q.blocked_documents.find(x=>x.id==='P01').issues.includes('preuve_nominal_absente'));
});
