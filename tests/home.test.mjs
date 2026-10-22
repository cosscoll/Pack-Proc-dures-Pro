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
 for(const word of ['Les clés passent','15','7','Aucun achat possible','version pilote'])assert.ok(html.toLowerCase().includes(word.toLowerCase()),word);
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
 assert.ok(ux.includes("selectRail(stage==='coffre'?5:stage==='pack'||stage==='footer'?4:active)"));
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

test('the store actually presents a product and an honest sales path',()=>{
 const product=read('pack-conciergerie.html'),style=read('assets/pack-conciergerie.css');
 assert.ok(html.includes('href="./pack-conciergerie.html"'));
 for(const word of ['15 procédures','7 registres','49 €','ÉDITION PILOTE NON COMMERCIALISÉE','DOCX','PDF','CSV','P01','P05','P08','Fiches logements','Passation d\'équipe'])assert.ok(product.toLowerCase().includes(word.toLowerCase()),word);
 for(const link of ['./index.html','./exemple-procedure.html','./atelier-decisions.html'])assert.ok(product.includes('href="'+link+'"'),link);
 assert.equal((product.match(/<details/g)||[]).length,7);
 assert.ok(style.includes('prefers-reduced-motion:reduce'));
 assert.ok(!/stripe\.com|paypal\.com|type="email"|action=/.test(product),'do not offer checkout or collect leads before release');
 assert.ok(html.includes('worldCanvas'),'original cinematic scene retained');
});

test('the original route finishes in a real reversible 3D chest opening',()=>{
 for(const snippet of ['id="coffre"','id="vaultState"','OBJET 002 — LE COFFRE','VOLONTAIREMENT VIDE'])assert.ok(html.toLowerCase().includes(snippet.toLowerCase()),snippet);
 for(const text of ['vaultChest','real-keyhole-surround','hinged-lid','empty-chest-floor','setVaultProgress','getVaultState','vaultLid.rotation.x=-1.58*open'])assert.ok(three.includes(text),text);
 assert.ok(ux.includes('const originalEnd='),'legacy final key pose must keep its exact scroll anchor');
 assert.ok(ux.includes('Math.min(6,progress)'),'old key choreography must stay clamped at step six');
 assert.ok(ux.includes('setVaultProgress?.(vaultProgress)'),'finale is progressive and reversible');
 assert.ok(css.includes('.vault-finale__fallback')&&three.includes('vault-fallback-mode'),'accessible static coffre when GPU unavailable');
 assert.equal(three.split('{rot:[').length-1,7,'all seven approved keyframes remain intact');
});

test('three pilot documents can be explored, without tracking or checkout',()=>{const page=read('pack-conciergerie.html'),js=read('assets/pack-demo.js');for(const id of ['P01','P05','P08']){assert.ok(page.includes('data-preview="'+id+'"'));assert.ok(js.includes(id+':{'))}assert.ok(page.includes('Tester la procédure gratuite'));assert.ok(!js.includes('fetch(')&&!js.includes('localStorage'))});

test('full catalogue comes from the actual fifteen-draft manual',()=>{
 const page=read('pack-conciergerie.html');
 for(let i=2;i<=15;i++){const code='P'+String(i).padStart(2,'0');assert.ok(page.includes('>'+code+'</span>')||page.includes('data-preview="'+code+'"'),code)}
 assert.ok(page.includes('id="sommaire-complet"'));
 assert.ok(page.includes('Surveiller les changements de réservations'));
 assert.ok(page.includes('Faire le bilan mensuel des rotations'));
 assert.ok(page.includes('brouillons'));
 assert.ok(page.includes('data-show-preview="P05"')&&page.includes('data-show-preview="P08"'));
});
