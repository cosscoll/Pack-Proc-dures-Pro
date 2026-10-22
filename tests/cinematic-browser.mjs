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
  await page.locator('#rotation').evaluate(el=>window.scrollTo({top:el.offsetTop,behavior:'instant'}));
  await page.waitForFunction(()=>document.body.dataset.scene==='1',{timeout:9000});
  assert.equal(await page.locator('#rotation').evaluate(el=>el.classList.contains('is-current')),true);
  await page.locator('[data-scenario="pending"]').click();
  assert.equal(await page.locator('#overlayMessage').isVisible(),true);
  assert.match(await page.locator('#overlayHeading').innerText(),/mission reste non confirmée/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#overlayMessage').isVisible(),false);
  await page.locator('#controle').evaluate(el=>window.scrollTo({top:el.offsetTop,behavior:'instant'}));
  await page.waitForFunction(()=>document.body.dataset.scene==='2',{timeout:9000});
  await page.locator('[data-scenario="incident"]').click();
  assert.match(await page.locator('#overlayHeading').innerText(),/ne signifie pas/);
  await page.locator('#overlayClose').click();
  assert.equal(await page.locator('#overlayMessage').isVisible(),false);
  await page.locator('#depart').evaluate(el=>window.scrollTo({top:el.offsetTop,behavior:'instant'}));
  await page.waitForFunction(()=>document.body.dataset.scene==='0',{timeout:9000});
  await page.locator('#objectTrigger').click();
  assert.equal(await page.locator('#overlayMessage').isVisible(),true);
  assert.match(await page.locator('#overlayHeading').innerText(),/clé passe/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#keyLayer').count(),1);
  assert.equal(await page.locator('#worldCanvas').evaluate(el=>getComputedStyle(el.parentElement).position),'fixed');
  for(const segment of ['.interlude','#pack','.footer']){
    await page.locator(segment).scrollIntoViewIfNeeded();
    const info=await page.locator('#keyLayer').evaluate(el=>({fixed:getComputedStyle(el).position==='fixed',z:Number(getComputedStyle(el).zIndex),canvasOpacity:Number(getComputedStyle(el.querySelector('canvas')).opacity)}));
    assert.ok(info.fixed&&info.z>8,'key must stay in front of main content: '+segment+' '+JSON.stringify(info));
    if(width!==320)assert.ok(info.canvasOpacity>.9,'animated key must remain visible at '+segment);
  }
  if(width===1440||width===390){
    for(const route of ['exemple-procedure.html','atelier-decisions.html','avancement.html']){
      const sub=await ctx.newPage();
      await sub.goto(new URL(route,base).toString(),{waitUntil:'domcontentloaded'});
      await sub.waitForFunction(()=>['webgl2','fallback'].includes(document.querySelector('#world')?.dataset.engine));
      assert.equal(await sub.locator('#world').getAttribute('data-engine'),'webgl2',route+' must display key 3D');
      assert.equal(await sub.locator('#world').evaluate(el=>getComputedStyle(el).position),'fixed');
      await sub.close();
    }
  }
  // Au manifeste la clef doit se loger dans un espace vacant, pas dans les lettres.
  if(width!==320){
   for(const [selector,stage] of [['.interlude','interlude'],['#pack','pack'],['.footer','footer']]){
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1900);
    const pos=await page.evaluate(()=>{
     const scene=window.rotationScene,rect=scene?.getKeyBounds();
     const stage=document.querySelector('#world')?.dataset.stage;
     const obstacles=[];
     for(const el of document.querySelectorAll('.interlude p,.offer-intro h2,.offer-intro p,.offer-line,.footer-brand,.footer p')){
      if(!el.getClientRects().length)continue;
      const range=document.createRange();range.selectNodeContents(el);
      for(const r of range.getClientRects()){
       const ix=Math.max(0,Math.min(rect.right,r.right)-Math.max(rect.left,r.left));
       const iy=Math.max(0,Math.min(rect.bottom,r.bottom)-Math.max(rect.top,r.top));
       if(ix*iy>70)obstacles.push({text:el.textContent.trim().slice(0,22),area:Math.round(ix*iy)});
      }
     }
     return {stage,bounds:rect,overlaps:obstacles,selected:document.querySelector('#world')?.dataset.collisionFree};
    });
    assert.equal(pos.stage,stage,'step tracking '+selector+': '+JSON.stringify(pos));
    assert.equal(pos.overlaps.length,0,'key must not cover text at '+selector+': '+JSON.stringify(pos));
    assert.ok(pos.bounds.width>35&&pos.bounds.height>50,'key must remain visible '+selector);
    console.log('KEY_SAFE_ZONE_PASS '+JSON.stringify({width,stage,bounds:pos.bounds}));
   }
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,'horizontal overflow '+width+' px: '+overflow);
  assert.deepEqual(errs,[],'uncaught browser exceptions');
  await page.screenshot({path:'screenshots/cinematic-'+width+'.png',animations:'disabled'});
  console.log('PASSATION_QA_PASS '+JSON.stringify({width,engine,chapters:4,menu:true,scenarios:3,overflow,errors:errs.length}));
  await ctx.close();
 }
 console.log('PASSATION_QA_ACCEPTANCE_OK');
}finally{await browser.close();}
