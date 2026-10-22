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
 assert.equal(frames,7,'four opening scenes followed by three continued cross-screen poses');
 assert.match(three,/actual=lerp\(actual,targetProgress,ease\)/);
 assert.ok(!three.includes('findSafePose('),'3D must not chase layout text');
 assert.ok(!three.includes('setStage('),'the motion path cannot be changed by obstacle detection');
 assert.ok(!html.includes('id="navPanel" inert'),'navigation cannot be inert if scripts fail');
 assert.match(html,/\.nav-panel\{position:relative!important/,'no-JS navigation should be visible');
 assert.ok(ux.includes('nav.inert=true'),'scripts should make the closed menu inert');
});

test('the public pilot pack is discoverable without scrolling the full story',()=>{
 assert.ok(html.includes('class="header-pack" href="#pack"'));
 assert.ok(html.includes('data-go="pack"'));
 assert.ok(html.includes('LE PACK PILOTE'));
 assert.ok(ux.includes("selectRail(stage==='pack'||stage==='footer'?4:active)"));
});

test('the key continues alternating across the complete site',()=>{
 assert.match(three,/pos:\[-2\.70,\.03,0\]/);
 assert.match(three,/pos:\[2\.40,-\.05,0\]/);
 assert.match(three,/rot:\[-\.09,8\.21,-\.09\]/);
 assert.ok(ux.includes('scrollEnd'));
 assert.ok(ux.includes('interlude?.offsetTop'));
 assert.ok(ux.includes('pack?.offsetTop'));
});

test('scroll hand-off disables tabbing to currently invisible offers',()=>{
 assert.ok(ux.includes('intro.inert='));
 assert.ok(ux.includes('detail.inert='));
 assert.ok(ux.includes('!motion.matches'));
});

test('continuous key rotation stays in the original seven poses and uses frame-independent click easing',()=>{
 assert.match(three,/monotone cubic Hermite/);
 assert.match(three,/const yaw=\(2\*u3-3\*u2\+1\)/);
 assert.ok(!three.includes('keyTurn*=.94'), 'click must not depend on frame rate');
 assert.match(three,/tapAge<1800/);
 assert.match(three,/getReferencePose/);
 assert.equal((three.match(/\{rot:\[/g)||[]).length,7);
});
