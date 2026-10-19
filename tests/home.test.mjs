import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('structure principale et navigation',()=>{
  assert.match(html,/<!doctype html>/i);
  assert.match(html,/<main>/);
  assert.match(html,/<nav aria-label="Navigation principale">/);
  for(const id of ['accueil','contenu','orientation','methode','projet'])assert.ok(html.includes('id="'+id+'"'),id);
  assert.match(html,/<a href="#orientation">S’orienter<\/a>/);
});
test('parcours accessible et non intrusif',()=>{
  assert.equal((html.match(/<details class="choice">/g)||[]).length,3);
  assert.equal((html.match(/<\/details>/g)||[]).length,3);
  assert.match(html,/id="orientation-title"/);
  assert.match(html,/aria-labelledby="orientation-title"/);
  assert.match(html,/:focus-visible/);
  assert.match(html,/prefers-reduced-motion:reduce/);
  assert.doesNotMatch(html,/<form\b/i);
  assert.doesNotMatch(html,/<script\b/i);
});
test('les recommandations couvrent trois besoins distincts',()=>{
  for(const term of ['procédure opérationnelle','check-list de vérification','support de passation'])assert.ok(html.includes(term),term);
  assert.match(html,/Aucune vente n.est ouverte/);
  assert.match(html,/sans compte ni collecte de données/);
});
