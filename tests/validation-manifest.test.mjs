import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('data/validation-conciergerie.json','utf8'));
const requirements=manifest.requirements;
const codes=requirements.map(r=>r.id);
const expected=[...Array.from({length:15},(_,i)=>'P'+String(i+1).padStart(2,'0')),...Array.from({length:7},(_,i)=>'R'+String(i+1).padStart(2,'0'))];
test('liste exhaustive, ordre et unicite P01–P15, R01–R07',()=>{
  assert.equal(requirements.length,22);
  assert.deepEqual(codes,expected);
  assert.equal(new Set(codes).size,22);
  assert.equal(requirements.filter(r=>r.kind==='procedure').length,15);
  assert.equal(requirements.filter(r=>r.kind==='registre').length,7);
});
test('aucun brouillon ne peut etre presente comme valide',()=>{
  assert.equal(manifest.state,'NON_COMMERCIALISABLE');
  assert.ok(requirements.every(r=>r.status==='a_valider' && !r.reviewer && r.evidence.length===0));
  assert.ok(requirements.every(r=>r.format_tests.excel_real!=='valide'));
});
test('toute future validation exigera preuve, source, SHA et relecteur',()=>{
  for(const r of requirements){
    assert.ok(r.title && r.scenario && r.kind,'metadata obligatoire: '+r.id);
    assert.ok(['a_valider','en_revision','corrige','valide'].includes(r.status));
    if(r.status==='valide'){
      assert.match(r.sha256||'',/^[a-f0-9]{64}$/);
      assert.ok(r.source_version,'version source manquante: '+r.id);
      assert.ok(r.reviewer,'relecteur manquant: '+r.id);
      assert.ok(r.reviewed_at,'date de revue manquante: '+r.id);
      assert.ok(r.evidence.length>0,'preuve manquante: '+r.id);
      for(const [format,state] of Object.entries(r.format_tests)){
        if(state!=='sans_objet')assert.equal(state,'valide','format '+format+' non valide pour '+r.id);
      }
    }
  }
});
test('pas de données personnelles ni de livrables premium inclus dans la matrice',()=>{
 const raw=JSON.stringify(manifest);
 assert.ok(!/apikey|BEGIN PRIVATE KEY|sk_live_|pk_live_/i.test(raw));
 assert.ok(!/https?:\/\/[^\s]+\.(zip|docx|xlsx|pdf)/i.test(raw));
});
