import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

const base=process.env.CINEMATIC_BASE||'http://127.0.0.1:8787/';
mkdirSync('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const width of [1440,768,390,320]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:width===320?'reduce':'no-preference'});
  const page=await ctx.newPage(),errs=[];
  page.on('pageerror',e=>errs.push(String(e)));
  const res=await page.goto(base,{waitUntil:'domcontentloaded',timeout:35000});
  assert.equal(res?.status(),200);
  assert.match(await page.locator('h1').innerText(),/Les clés passent/);
  assert.equal(await page.locator('.chapter[data-scene]').count(),4);
  assert.equal(await page.locator('#worldCanvas').count(),1);
  assert.equal(await page.locator('.hero-chapter a[href="./exemple-procedure.html"]').isVisible(),true);
  await page.waitForFunction(()=>['webgl2','fallback'].includes(document.querySelector('#world')?.dataset.engine),{timeout:30000});
  const engine=await page.locator('#world').getAttribute('data-engine');
  if(width!==320)assert.equal(engine,'webgl2','La clé WebGL doit charger à '+width+'px');
  else assert.equal(engine,'fallback','Mode sans animation attendu à 320px');
  if(width!==320){
   const scene=await page.evaluate(()=>({model:window.rotationScene?.model,hotspots:window.rotationScene?.hotspots}));
   assert.equal(scene.model,'machined-key-and-leather-fob');
   assert.ok(scene.hotspots>0);
  }
  await page.locator('#menuToggle').click();
  assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('#navPanel a[href="./avancement.html"]').isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'false');
  await page.locator('#rotation').scrollIntoViewIfNeeded();
  await page.waitForTimeout(550);
  assert.equal(await page.locator('#rotation').evaluate(el=>el.classList.contains('is-current')),true);
  await page.locator('[data-scenario="pending"]').click();
  assert.equal(await page.locator('#overlayMessage').isVisible(),true);
  assert.match(await page.locator('#overlayHeading').innerText(),/mission reste non confirmée/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#overlayMessage').isVisible(),false);
  await page.locator('#controle').scrollIntoViewIfNeeded();
  await page.waitForTimeout(550);
  await page.locator('[data-scenario="incident"]').click();
  assert.match(await page.locator('#overlayHeading').innerText(),/ne signifie pas/);
  await page.locator('#overlayClose').click();
  assert.equal(await page.locator('#overlayMessage').isVisible(),false);
  await page.locator('#depart').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator('#objectTrigger').click();
  assert.equal(await page.locator('#overlayMessage').isVisible(),true);
  assert.match(await page.locator('#overlayHeading').innerText(),/clé passe/);
  await page.keyboard.press('Escape');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,'horizontal overflow '+width+' px: '+overflow);
  assert.deepEqual(errs,[],'uncaught browser exceptions');
  await page.screenshot({path:'screenshots/cinematic-'+width+'.png',animations:'disabled'});
  console.log('PASSATION_QA_PASS '+JSON.stringify({width,engine,chapters:4,menu:true,scenarios:3,overflow,errors:errs.length}));
  await ctx.close();
 }
 console.log('PASSATION_QA_ACCEPTANCE_OK');
}finally{await browser.close();}
