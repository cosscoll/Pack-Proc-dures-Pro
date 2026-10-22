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
  // La clé suit strictement l'ancien trajet, sans keyframe ajouté ni routage automatique.
  if(width!==320){
   assert.equal(await page.locator('#world').getAttribute('data-motion'),'original-smooth');
   const timeline=await page.evaluate(()=>window.rotationScene?.getMotionState());
   assert.equal(timeline.keyframes,4);
   assert.equal(timeline.placement,'original-fixed');
   for(const [selector,section] of [['.interlude','manifeste'],['#pack','pack'],['.footer','footer']]){
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1750);
    const report=await page.evaluate(()=>{
     const b=window.rotationScene.getKeyBounds();
     const checks=[];
     const selector='.interlude p,.interlude-top,.interlude-sign,.offer-intro h2,.offer-intro>p,.offer-stats,.offer-cta,.offer-outline .outline-caption,.offer-line,.footer-brand,.footer p,.footer div,.footer small';
     for(const el of document.querySelectorAll(selector)){
      const range=document.createRange();range.selectNodeContents(el);
      for(const r of range.getClientRects()){
       if(r.width<1||r.height<1||r.bottom<90||r.top>innerHeight-5)continue;
       const w=Math.max(0,Math.min(b.right,r.right)-Math.max(b.left,r.left));
       const h=Math.max(0,Math.min(b.bottom,r.bottom)-Math.max(b.top,r.top));
       if(w*h>95)checks.push({element:el.tagName,area:Math.round(w*h),text:el.textContent.trim().slice(0,30)});
      }
     }
     return {bounds:b,overlaps:checks,mode:window.rotationScene.getMotionState()};
    });
    console.log('COMPOSITION_AROUND_ORIGINAL_KEY '+JSON.stringify({width,section,bounds:report.bounds,overlaps:report.overlaps}));
    assert.equal(report.overlaps.length,0,'Text crosses the original key @'+width+' '+section+': '+JSON.stringify(report.overlaps));
    assert.ok(report.bounds.width>30&&report.bounds.height>50,'Key remains rendered '+section);
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
