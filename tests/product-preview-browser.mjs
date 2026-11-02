import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

const base=process.env.PROTOTYPE_BASE||'http://127.0.0.1:8787/';
const route='prototype-pack-conciergerie-3d.html';
mkdirSync('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const width of [1440,768,390,320]){
  const reducedMotion=width===320;
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:reducedMotion?'reduce':'no-preference'});
  const page=await ctx.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  const url=new URL(route,base).toString();
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:35000});
  assert.equal(response?.status(),200,'prototype HTTP 200');
  assert.equal(await page.locator('#coffre').count(),1);
  assert.equal(await page.locator('main h1').count(),1,'unique page heading in main landmark');
  assert.equal(await page.locator('main #coffre').count(),1,'opening scene must belong to main landmark');
  assert.equal(await page.locator('#worldCanvas').count(),1);
  assert.equal(await page.locator('.chapter[data-scene]').count(),4);
  assert.equal(await page.locator('[data-product-tab]').count(),3);
  assert.equal(await page.locator('[role="tabpanel"]').count(),3);
  assert.ok(await page.locator('meta[name="robots"][content="noindex,nofollow"]').count());
  assert.ok(await page.evaluate(()=>Boolean(document.getElementById('coffre').compareDocumentPosition(document.getElementById('depart'))&Node.DOCUMENT_POSITION_FOLLOWING)),'coffre must appear before product narrative');
  await page.waitForFunction(()=>['webgl2','fallback'].includes(document.getElementById('world')?.dataset.engine),{timeout:35000});
  const engine=await page.locator('#world').getAttribute('data-engine');
  if(reducedMotion)assert.equal(engine,'fallback','reduced-motion must not initialize live WebGL');
  else assert.equal(engine,'webgl2','3D key/chest real WebGL should load on CI browser');
  if(!reducedMotion){
   const spec=await page.evaluate(()=>window.rotationScene && ({
    model:window.rotationScene.model,
    states:window.rotationScene.getMotionState(),
    vault:window.rotationScene.getVaultState()
   }));
   assert.equal(spec.model,'machined-key-and-leather-fob','must reuse original model');
   assert.ok(spec.states.keyframes>=7,'original key choreography preserved');
   await page.evaluate(()=>{const s=document.getElementById('coffre');window.scrollTo({top:s.offsetHeight-innerHeight-30,behavior:'instant'});});
   await page.waitForFunction(()=>window.rotationScene?.getVaultState()?.open>.78,{timeout:20000});
   const opened=await page.evaluate(()=>window.rotationScene.getVaultState());
   assert.ok(opened.chestVisible,'chest visible');
   await page.screenshot({path:'screenshots/product-prototype-coffre-'+width+'.png',animations:'disabled'});
   // Reversibilite : le couvercle revient a son etat ferme apres un scroll inverse.
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.waitForFunction(()=>window.rotationScene?.getVaultState()?.open<.04,{timeout:18000});
   const closed=await page.evaluate(()=>window.rotationScene.getVaultState());
   assert.ok(closed.open<.04,'reverse scroll must close the chest');
   // Aucune teleportation de la cle : le modele et ses poses restent stables.
   const poses=await page.evaluate(()=>[0,1,2,3,4,5,6].map(i=>window.rotationScene.getReferencePose(i).x));
   assert.deepEqual(poses.map(x=>Number(x.toFixed(2))),[1.43,1.65,-2.55,1.2,-2.7,2.4,-2.62]);
   console.log('PRODUCT_VAULT_REVERSIBLE_OK '+JSON.stringify({width,open:Number(opened.open.toFixed(2)),closed:Number(closed.open.toFixed(2))}));
  } else {
   assert.equal(await page.locator('.vault-finale__fallback svg').count(),1);
  }
  await page.locator('#preuve').scrollIntoViewIfNeeded();
  await page.locator('[data-product-tab="P05"]').click();
  assert.equal(await page.locator('[data-product-tab="P05"]').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('[data-product-panel="P05"]').isVisible(),true);
  assert.equal(await page.locator('[data-product-panel="P01"]').isVisible(),false);
  await page.locator('[data-product-tab="P05"]').focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('[data-product-tab="P08"]').getAttribute('aria-selected'),'true');
  await page.keyboard.press('Home');
  assert.equal(await page.locator('[data-product-tab="P01"]').getAttribute('aria-selected'),'true');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,'no horizontal overflow '+width+': '+overflow);
  assert.deepEqual(errors,[],'no JS exceptions at '+width);
  const sample=await page.request.get(new URL('exemple-procedure.html',base).toString());
  assert.equal(sample.status(),200,'public P01 remains accessible');
  await page.screenshot({path:'screenshots/product-prototype-extraits-'+width+'.png',animations:'disabled'});
  console.log('PRODUCT_PROTOTYPE_QA_OK '+JSON.stringify({width,engine,overflow,tabs:3,errors:errors.length}));
  await ctx.close();
 }
 console.log('PRODUCT_PROTOTYPE_ACCEPTANCE_OK');
} finally {await browser.close();}
