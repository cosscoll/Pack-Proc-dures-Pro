import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('storytelling, navigation et ancres métiers', () => {
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<main id="main">/);
  assert.match(html, /aria-label="Navigation principale"/);
  for(const id of ['haut','vision','solutions','orientation','laboratoire']) {
    assert.ok(html.includes('id="'+id+'"'), id);
  }
  assert.match(html, /<a href="#orientation">S’orienter<\/a>/);
  assert.match(html, /href="\.\/avancement\.html"/);
});

test('orientation professionnelle accessible et privée', () => {
  assert.equal((html.match(/<details class="orientation-option">/g)||[]).length,3);
  assert.equal((html.match(/<\/details>/g)||[]).length,3);
  assert.match(html,/aria-labelledby="orientation-title"/);
  assert.match(html,/:focus-visible/);
  assert.match(html,/prefers-reduced-motion:reduce/);
  assert.doesNotMatch(html,/<form\b/i);
  assert.doesNotMatch(html,/https:\/\/(?:js\.stripe|www\.googletagmanager|fonts\.googleapis)/);
});

test('conseils distincts et promesse commerciale prudente', () => {
  for(const term of ['procédure opérationnelle','check-list de contrôle','registre de passation']) {
    assert.ok(html.includes(term),term);
  }
  assert.match(html,/Aucun achat/);
  assert.match(html,/VALIDATION MÉTIER EN COURS/);
  assert.match(html,/49 €/);
});

test('vraie scène 3D et repli, simulation des blocages', () => {
  assert.match(html,/getContext\('webgl2'/);
  assert.match(html,/createShader/);
  assert.match(html,/gl\.drawArrays/);
  assert.match(html,/sceneFallback/);
  assert.match(html,/webglcontextlost/);
  for(const code of ['ready','pending','incident']) assert.match(html,new RegExp('data-scenario="'+code+'"'));
  assert.match(html,/EN ATTENTE/);
  assert.match(html,/BLOQUÉ/);
  assert.match(html,/aria-live="polite"/);
});
