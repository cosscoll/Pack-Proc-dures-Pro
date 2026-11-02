import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const legacy=JSON.parse(readFileSync('data/legacy-v03-csv-contract.json','utf8'));
const proposed=JSON.parse(readFileSync('data/registry-contracts.json','utf8'));
const expected=['R01','R02','R03','R04','R05','R06','R07'];
test('V0.3: 7 registres existants, 88 colonnes exactes, aucun blanc ni doublon',()=>{
 assert.equal(legacy.approved,false);
 assert.equal(legacy.source_csv_version,'V0.3');
 assert.equal(legacy.source_csv_rows,0);
 assert.match(legacy.source_sha256,/^[a-f0-9]{64}$/);
 assert.deepEqual(legacy.registries.map(x=>x.id),expected);
 assert.equal(legacy.registries.reduce((n,x)=>n+x.columns.length,0),88);
 for(const reg of legacy.registries){
  assert.equal(new Set(reg.columns).size,reg.columns.length);
  assert.ok(reg.columns.every(x=>/^[a-z][a-z0-9_]*$/.test(x)));
  assert.equal(reg.migration_approved,false);
  assert.ok(reg.risks.length>0,'chaque registre doit porter au moins un risque identifié');
 }
});
test('les correspondances directes pointent sur des colonnes réelles et le contrat cible',()=>{
 for(const source of legacy.registries){
  const destination=proposed.registries.find(x=>x.id===source.id);
  assert.ok(destination,'missing target '+source.id);
  const targetCols={...proposed.common_fields,...destination.fields};
  for(const [from,to] of Object.entries(source.direct)){
   assert.ok(source.columns.includes(from),'source missing '+from+' in '+source.id);
   assert.ok(Object.hasOwn(targetCols,to),'destination missing '+to+' in '+source.id);
  }
 }
});
test('pas de compatibilité implicite : tous les schémas source diffèrent des nouveaux',()=>{
 for(const source of legacy.registries){
  const dest=proposed.registries.find(x=>x.id===source.id);
  const target=new Set([...Object.keys(proposed.common_fields),...Object.keys(dest.fields)]);
  const legacySet=new Set(source.columns);
  assert.ok([...target].some(x=>!legacySet.has(x)),source.id+' doit nécessiter une migration explicite');
  assert.ok(source.missing.length>0);
 }
});
test('R02 exige les preuves absentes des anciens en-têtes',()=>{
 const r=legacy.registries.find(x=>x.id==='R02');
 assert.ok(!r.columns.includes('confirmation_ref'));
 assert.ok(!r.columns.includes('inspection_ref'));
 assert.ok(r.columns.includes('confirmation_mission_le'));
 assert.ok(r.columns.includes('anomalies_bloquantes_ouvertes'));
});
test('R03 distingue impact arrivée et gravité sans convertir automatiquement',()=>{
 const r=legacy.registries.find(x=>x.id==='R03');
 assert.ok(r.columns.includes('gravite'));
 assert.ok(r.columns.includes('impact_arrivee'));
 assert.ok(!r.columns.includes('blocks_arrival'));
});
test('R07 manque SHA-256 et ne peut prouver une validation indépendante',()=>{
 const r=legacy.registries.find(x=>x.id==='R07');
 assert.ok(!r.columns.includes('sha256'));
 assert.ok(r.columns.includes('statut_validation'));
});
