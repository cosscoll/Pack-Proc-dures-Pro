import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),css=read('assets/cinematic.css');
const three=read('assets/apartment-scene.js'),ux=read('assets/experience.js');
test('a commercially honest landing with four connected real-world gestures',()=>{
 for(const id of ['main','haut','depart','rotation','controle','solution','worldCanvas','sceneFallback','navPanel','overlayMessage','pack'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.equal(html.split('data-scene="').length-1,4);
 for(const link of ['exemple-procedure.html','atelier-decisions.html','avancement.html'])assert.ok(html.includes('href="./'+link+'"'),link);
 for(const word of ['Les clés passent','15','7','49 €','Aucun achat possible','version pilote'])assert.ok(html.toLowerCase().includes(word.toLowerCase()),word);
 assert.ok(!html.includes('buy.stripe.com'));
});
test('3D product is a pierced metal key with a physical leather fob, never generic floating boxes',()=>{
 for(const pattern of ['WebGLRenderer','PerspectiveCamera','ExtrudeGeometry','bow.holes.push(hole)','bladeShape','tagShape.holes.push(eyeletHole)','CanvasTexture','ray.intersectObjects','setProgress','keyframes','fallbackOn'])assert.ok(three.includes(pattern),pattern);
 assert.ok(html.includes('<svg'), 'accessible fallback');
 assert.ok(!three.includes('new T.BoxGeometry(9'), 'no apartment slab');
});
test('animation, responsive, accessible equivalent interactions',()=>{
 for(const pattern of ['prefers-reduced-motion:reduce','.offer-line:hover','.offer-line:focus-visible','.nav-panel','.chapter'])assert.ok(css.includes(pattern),pattern);
 for(const pattern of ['aria-expanded','Escape','rotation:hotspot','requestAnimationFrame','e.key===\'Tab\''])assert.ok(ux.includes(pattern),pattern);
 assert.ok(html.includes('aria-live="polite"'));
 assert.ok(html.includes('aria-modal="true"'));
});

test('locked cinematic route and a functional no-JavaScript navigation',()=>{
 const frames=(three.match(/\{rot:\[/g)||[]).length;
 assert.equal(frames,4,'the original four artistic poses cannot be added to or removed');
 assert.match(three,/actual=lerp\(actual,targetProgress,ease\)/);
 assert.ok(!three.includes('findSafePose('),'3D must not chase layout text');
 assert.ok(!three.includes('setStage('),'the motion path cannot be changed section by section');
 assert.ok(!html.includes('id="navPanel" inert'),'navigation cannot be inert if scripts fail');
 assert.match(html,/\.nav-panel\{position:relative!important/,'no-JS navigation should be visible');
 assert.ok(ux.includes('nav.inert=true'),'scripts should make the closed menu inert');
});
