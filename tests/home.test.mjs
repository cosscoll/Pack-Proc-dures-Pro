import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),css=read('assets/cinematic.css');
const three=read('assets/apartment-scene.js'),ux=read('assets/experience.js');
test('four narrative chapters, links and truthful prelaunch',()=>{
 for(const id of ['main','haut','depart','rotation','controle','solution','worldCanvas','sceneFallback','navPanel','overlayMessage','pack'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.equal(html.split('data-scene="').length-1,4);
 for(const link of ['exemple-procedure.html','atelier-decisions.html','avancement.html'])assert.ok(html.includes('href="./'+link+'"'),link);
 for(const text of ['15 procédures','7 registres','49 €','Aucun achat possible'])assert.ok(html.includes(text),text);
});
test('original architectural 3D model, not generic floating pages',()=>{
 for(const pattern of ['WebGLRenderer','PerspectiveCamera','shadowMap.enabled','toneMapping','scene.fog','skyline','camera.position.lerp','const room=new T.Group','contact.push',"spot('door'","spot('bed'","spot('kitchen'", "dataset.engine='fallback'"]){
  assert.ok(three.includes(pattern),pattern);
 }
 assert.ok(html.includes('<svg'));
});
test('accessible interactions and reduced-motion fallback',()=>{
 assert.ok(!html.includes('<form'));
 assert.ok(!html.includes('buy.stripe.com'));
 for(const pattern of ['prefers-reduced-motion:reduce','.nav-panel','.chapter'])assert.ok(css.includes(pattern),pattern);
 for(const pattern of ['aria-expanded','Escape','rotation:hotspot'])assert.ok(ux.includes(pattern),pattern);
 assert.ok(html.includes('aria-live="polite"'));
});
