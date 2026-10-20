import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),css=read('assets/cinematic.css'),three=read('assets/apartment-scene.js'),ux=read('assets/experience.js');
test('quatre chapitres cinématographiques, navigation et CTA métier',()=>{
 assert.match(html,/<main id="main">/);
 for(const id of ['haut','depart','rotation','controle','solution','worldCanvas','sceneFallback','navPanel','overlayMessage','pack']) assert.ok(html.includes('id="'+id+'"'),id);
 assert.equal((html.match(/data-scene="/g)||[]).length,4);
 assert.match(html,/href="\.\/exemple-procedure\.html"/);
 assert.match(html,/href="\.\/atelier-decisions\.html"/);
 assert.match(html,/href="\.\/avancement\.html"/);
 assert.match(html,/15 procédures/);
 assert.match(html,/7 registres/);
 assert.match(html,/49 €/);
 assert.match(html,/Aucun achat possible/);
});
test('véritable appartement WebGL, et pas des documents décoratifs',()=>{
 for(const pattern of ['WebGLRenderer','PerspectiveCamera','shadowMap.enabled','toneMapping','scene.fog','skyline','createElement(\\'canvas\\')','mission','camera.position.lerp']){
   assert.match(three,new RegExp(pattern));
 }
 assert.match(three,/const room=new T.Group/);
 assert.match(three,/contact\.push/);
 assert.match(three,/spot\\('door'/);
 assert.match(three,/spot\\('bed'/);
 assert.match(three,/spot\\('kitchen'/);
 assert.match(three,/data.engine='fallback'|dataset.engine='fallback'/);
 assert.match(html,/<svg/);
});
test('confidentialité, accessibilité et animations réduites',()=>{
 assert.doesNotMatch(html,/<form\b/i);
 assert.doesNotMatch(html,/checkout\.stripe|js\.stripe\.com|sk_live_/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(ux,/aria-expanded/);
 assert.match(ux,/Escape/);
 assert.match(ux,/rotation:hotspot/);
 assert.match(html,/aria-live="polite"/);
});
