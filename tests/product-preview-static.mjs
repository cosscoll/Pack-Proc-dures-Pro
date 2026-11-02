import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const page=readFileSync('prototype-pack-conciergerie-3d.html','utf8');
const main=readFileSync('index.html','utf8');
const previewScript=readFileSync('assets/experience-product-preview.js','utf8');
test('prototype isolated, noindex and no checkout',()=>{
 assert.match(page,/<meta name="robots" content="noindex,nofollow">/);
 assert.match(page,/id="coffre"/);
 assert.match(page,/id="worldCanvas"/);
 assert.ok(page.indexOf('<main id="main">')<page.indexOf('id="coffre"'));
 assert.ok(page.indexOf('id="coffre"')<page.indexOf('id="depart"'));
 assert.equal((page.match(/<h1(?:\\s|>)/g)||[]).length,1,'exactly one H1, on opening scene');
 assert.match(page,/15 procédures/);
 assert.match(page,/7 registres/);
 assert.doesNotMatch(page,/https:\/\/buy\.stripe|https:\/\/checkout\.stripe/i);
});
test('3D model and current home untouched',()=>{
 assert.match(page,/\.\/assets\/apartment-scene\.js/);
 assert.match(main,/name="site-revision" content="coffre-cinematique-20261022-v24"/);
 assert.match(previewScript,/const introTravel=/);
 assert.match(previewScript,/setVaultProgress/);
 assert.ok(!previewScript.includes('const vaultProgress=Math.max(0,Math.min(1,progress-6));'));
});
test('interactive tabs aria and valid resources',()=>{
 const matches=[...page.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
 const dup=matches.filter((id,i)=>matches.indexOf(id)!==i);
 assert.deepEqual(dup,[],'IDs must be unique');
 for(const path of ['assets/cinematic.css','assets/apartment-scene.js','assets/experience-product-preview.js','assets/product-preview.css','assets/product-preview.js','exemple-procedure.html'])assert.ok(existsSync(path),'missing '+path);
 for(const id of ['P01','P05','P08']){
   assert.match(page,new RegExp('aria-controls="panel'+id+'"'));
   assert.match(page,new RegExp('id="panel'+id+'"'));
 }
});
