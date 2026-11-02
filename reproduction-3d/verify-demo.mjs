/** Reproduction indépendante 3D — utilise les 8 empreintes du dossier outil exact. */
import {readFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const m={
'index.html':'59163fab473734aedf88d6c8bdd0f63417334c3b',
'assets/cinematic.css':'bd4fdaa2a20826591f45cb01d4b30f22afcac393',
'assets/apartment-scene.js':'fe96414d99765ca46c3c2e13450cd405982fdc09',
'assets/experience.js':'46ce02b3461bd3839e47b2b91b8da98d0cada0ce',
'prototype-pack-conciergerie-3d.html':'7e9c6d37ddbed471501c79e06a072542874df538',
'assets/experience-product-preview.js':'85736319e97755d816b7a42fd88d8b0a160b5bc7',
'assets/product-preview.css':'02b8752d27f02460f60749b817f5743c5ec0acd9',
'assets/product-preview.js':'1048178f4e84a63621346e5e2573ba4f12db38a7'
};
for(const [filename,expected] of Object.entries(m)){
 const bytes=readFileSync('reproduction-3d/sources_exactes/'+filename);
 const hash=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(hash,expected,'source exactement identique au dossier : '+filename);
}
console.log('KIT_SOURCE_SHA_OK 8/8');
const base='http://127.0.0.1:8789/reproduction-3d/';
mkdirSync('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const width of [1440,768,390,320]){
  const reducedMotion=width===320;
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:reducedMotion?'reduce':'no-preference'});
  const page=await ctx.newPage();const jsErrors=[];
  page.on('pageerror',e=>jsErrors.push(String(e)));
  const response=await page.goto(base+'index.html',{waitUntil:'domcontentloaded',timeout:35000});
  assert.equal(response?.status(),200);
  assert.equal(await page.locator('main h1').count(),1);
  assert.equal(await page.locator('.chapter[data-scene]').count(),4);
  assert.equal(await page.locator('#coffre').count(),1);
  assert.equal(await page.locator('#worldCanvas').count(),1);
  assert.ok(await page.locator('meta[name="robots"][content="noindex,nofollow"]').count(),'site test noindex');
  await page.waitForFunction(()=>['webgl2','fallback'].includes(document.getElementById('world')?.dataset.engine),{timeout:35000});
  const engine=await page.locator('#world').getAttribute('data-engine');
  assert.equal(engine,reducedMotion?'fallback':'webgl2','mode 3D attendu');
  if(!reducedMotion){
   const model=await page.evaluate(()=>window.rotationScene?.model);
   assert.equal(model,'machined-key-and-leather-fob','vrai modèle réutilisé');
   const poses=await page.evaluate(()=>Array.from({length:7},(_,i)=>window.rotationScene.getReferencePose(i)));
   assert.deepEqual(poses.map(p=>Number(p.x.toFixed(2))),[1.43,1.65,-2.55,1.2,-2.7,2.4,-2.62]);
   for(const name of ['act-1','act-2','act-3','manifeste','atelier','passage']){
    await page.evaluate(id=>window.scrollTo({top:document.getElementById(id).offsetTop,behavior:'instant'}),name);
    await page.waitForTimeout(130);
   }
   // Effet complet : la clé rejoint la serrure puis ouvre un vrai couvercle.
   await page.evaluate(()=>{
    const s=document.getElementById('coffre');
    window.scrollTo({top:s.offsetTop+(s.offsetHeight-innerHeight)*.98,behavior:'instant'});
   });
   await page.waitForFunction(()=>window.rotationScene?.getVaultState()?.open>.75,{timeout:18000});
   const opened=await page.evaluate(()=>window.rotationScene.getVaultState());
   assert.equal(opened.chestVisible,true);
   await page.screenshot({path:'screenshots/reproduction-3d-coffre-'+width+'.png',animations:'disabled',fullPage:false});
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.waitForFunction(()=>window.rotationScene?.getVaultState()?.open<.04,{timeout:18000});
   const reverse=await page.evaluate(()=>window.rotationScene.getVaultState());
   assert.ok(reverse.open<.04,'scroll inverse = coffre fermé');
   console.log('DEMO_KEY_CHEST_REVERSIBLE_OK '+JSON.stringify({width,open:opened.open,closed:reverse.open}));
  }else{
   assert.equal(await page.locator('.vault-fallback svg').count(),1);
  }
  await page.screenshot({path:'screenshots/reproduction-3d-accueil-'+width+'.png',animations:'disabled'});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,'débordement horizontal '+width+' : '+overflow);
  assert.deepEqual(jsErrors,[],'erreurs JS '+width);
  console.log('DEMO_SITE_OK '+JSON.stringify({width,engine,overflow,jsErrors:jsErrors.length}));
  await ctx.close();
 }
 console.log('REPRODUCTION_INDEPENDANTE_OK');
}finally{await browser.close();}
