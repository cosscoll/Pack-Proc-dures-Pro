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
  assert.equal(await page.locator('.rail-item').count(),5,'all four steps and pack must be reachable');
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
   assert.equal(timeline.keyframes,7);
   assert.equal(timeline.placement,'scroll-storyboard');
   const poseSamples=[];
   for(const [selector,targetStep] of [['.interlude',4],['#pack',5],['.footer',6]]){
    await page.evaluate(({selector})=>{
      const el=document.querySelector(selector);
      const end=document.documentElement.scrollHeight-innerHeight;
      scrollTo({top:selector==='.footer'?end:el.offsetTop,behavior:'instant'});
    },{selector});
    await page.waitForTimeout(2000);
    const snap=await page.evaluate(()=>({
      ...window.rotationScene.getMotionState(),
      bounds:window.rotationScene.getKeyBounds()
    }));
    poseSamples.push({selector,targetStep,...snap});
   }
   for(let i=1;i<poseSamples.length;i++){
    assert.ok(poseSamples[i].rotation>poseSamples[i-1].rotation+.5,'key must keep rotating '+JSON.stringify(poseSamples));
    const sign=i===1?1:-1;
    assert.ok((poseSamples[i].bounds.left+poseSamples[i].bounds.right-
               poseSamples[i-1].bounds.left-poseSamples[i-1].bounds.right)*sign>25,
               'key should alternate left/right '+JSON.stringify(poseSamples));
   }
   console.log('CONTINUOUS_KEY_CROSSING '+JSON.stringify({width,poses:poseSamples}));
   for(const [selector,section] of [['.interlude','manifeste'],['#pack','pack'],['.footer','footer']]){
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1750);
    const report=await page.evaluate(()=>{
     const b=window.rotationScene.getKeyBounds();
     const readingBay=document.querySelector('#keyLayer').getBoundingClientRect();
     const mobile=innerWidth<=740;
     const checks=[];
     const selector='.interlude p,.interlude-top,.interlude-sign,.offer-intro h2,.offer-intro>p,.offer-stats,.offer-cta,.offer-outline .outline-caption,.offer-line,.footer-brand,.footer p,.footer div,.footer small';
     for(const el of document.querySelectorAll(selector)){
      let combinedOpacity=1;
      for(let parent=el;parent&&parent.nodeType===1;parent=parent.parentElement){
        const alpha=Number.parseFloat(getComputedStyle(parent).opacity);
        if(Number.isFinite(alpha))combinedOpacity*=alpha;
      }
      if(combinedOpacity<=.15)continue;
      const range=document.createRange();range.selectNodeContents(el);
      for(const r of range.getClientRects()){
       if(r.width<1||r.height<1||r.bottom<90||r.top>innerHeight-5)continue;
       const w=Math.max(0,Math.min(b.right,r.right)-Math.max(b.left,r.left));
       const h=Math.max(0,Math.min(b.bottom,r.bottom)-Math.max(b.top,r.top,mobile?readingBay.bottom:0));
       if(w*h>95)checks.push({element:el.tagName,area:Math.round(w*h),text:el.textContent.trim().slice(0,30)});
      }
     }
     return {bounds:b,overlaps:checks,mode:window.rotationScene.getMotionState(),introOpacity:getComputedStyle(document.querySelector('#pack .offer-intro')).opacity,detailOpacity:getComputedStyle(document.querySelector('#pack .offer-outline')).opacity};
    });
    console.log('COMPOSITION_AROUND_ORIGINAL_KEY '+JSON.stringify({width,section,bounds:report.bounds,overlaps:report.overlaps}));
    assert.equal(report.overlaps.length,0,'Text crosses the original key @'+width+' '+section+': '+JSON.stringify(report.overlaps));
    assert.ok(report.bounds.width>30&&report.bounds.height>50,'Key remains rendered '+section);
   }
  }
  // Balayage de vrais points de lecture : la page se compose autour d'une clé immuable.
  if(width!==320){
   for(const sec of ['.interlude','#pack','.footer']){
    for(const step of [.12,.43,.75]){
     await page.evaluate(({sec,step})=>{
       const el=document.querySelector(sec),top=scrollY+el.getBoundingClientRect().top;
       const target=top+el.offsetHeight*step-innerHeight*.55;
       scrollTo({top:Math.min(document.documentElement.scrollHeight-innerHeight,Math.max(0,target)),behavior:'instant'});
     },{sec,step});
     await page.waitForTimeout(900);
     const coverage=await page.evaluate(()=>{
       const bounds=window.rotationScene?.getKeyBounds(),offenders=[];
       const bay=document.querySelector('#keyLayer');
       const bayRect=bay.getBoundingClientRect();
       const bayStyle=getComputedStyle(bay);
       const onMobile=innerWidth<=740;
       if(onMobile){
        const bg=bayStyle.backgroundColor;
        const match=bg.match(/rgba?\(([^)]+)\)/);
        const alpha=match&&match[1].split(',')[3];
        if(!match||alpha!==undefined&&Number(alpha)<.999)
          throw new Error('Reading bay must be opaque: '+bg);
       }
       const all=document.querySelectorAll('.interlude-top,.interlude p,.interlude-sign,.offer-top,.offer-intro h2,.offer-intro>p,.offer-stats,.offer-cta,.offer-outline .outline-caption,.offer-line,.offer-bottom,.footer-brand,.footer p,.footer div,.footer small');
       for(const el of all){
        if(!el.getClientRects().length)continue;
        let combinedOpacity=1;
        for(let parent=el;parent&&parent.nodeType===1;parent=parent.parentElement){
          const alpha=Number.parseFloat(getComputedStyle(parent).opacity);
          if(Number.isFinite(alpha))combinedOpacity*=alpha;
        }
        if(combinedOpacity<=.15)continue;
        const range=document.createRange();range.selectNodeContents(el);
        for(const r of range.getClientRects()){
         if(r.width<1||r.height<1||r.bottom<95||r.top>innerHeight-10)continue;
         // Sur mobile, le contenu est réellement masqué par la scène opaque :
         // seules les parties visibles sous son bord inférieur comptent.
         if(onMobile&&r.top<bayRect.bottom&&r.bottom<=bayRect.bottom)continue;
         const w=Math.max(0,Math.min(bounds.right,r.right)-Math.max(bounds.left,r.left));
         const h=Math.max(0,Math.min(bounds.bottom,r.bottom)-Math.max(bounds.top,r.top,onMobile?bayRect.bottom:0));
         if(w*h>130)offenders.push({type:el.className||el.tagName,area:Math.round(w*h)});
        }
       }
       return {offenders,bounds,progress:window.rotationScene?.getMotionState()?.target,opacity:getComputedStyle(document.querySelector('.interlude p')).opacity};
     });
     console.log('CONTINUOUS_KEY_TEXT_SWEEP '+JSON.stringify({width,sec,step,coverage}));
     assert.equal(coverage.offenders.length,0,'readable text should never cross the original 3D key '+width+' '+sec+' '+step+': '+JSON.stringify(coverage.offenders));
    }
   }
  }
  await page.locator('#pack').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.rail-item[data-go="pack"]').getAttribute('aria-current'),'step','progress must show 05 at product section');
  // Un contenu masqué par le scroll ne doit pas conserver de liens/boutons
  // accessibles au clavier tant qu'il n'est pas lisible.
  if(width!==320&&width>740){
    await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight-innerHeight,behavior:'instant'}));
    await page.waitForTimeout(200);
    assert.equal(await page.locator('#pack .offer-intro').evaluate(el=>el.inert),true);
    assert.equal(await page.locator('#pack .offer-outline').evaluate(el=>el.inert),false);
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,'horizontal overflow '+width+' px: '+overflow);
  assert.deepEqual(errs,[],'uncaught browser exceptions');
  await page.screenshot({path:'screenshots/cinematic-'+width+'.png',animations:'disabled'});
  console.log('PASSATION_QA_PASS '+JSON.stringify({width,engine,chapters:4,menu:true,scenarios:3,overflow,errors:errs.length}));
  await ctx.close();
 }
 console.log('PASSATION_QA_ACCEPTANCE_OK');
 // Navigation still works when JavaScript is blocked (graceful degradation).
 const context=await browser.newContext({viewport:{width:390,height:850},javaScriptEnabled:false});
 const page=await context.newPage();
 const res=await page.goto(base,{waitUntil:'domcontentloaded'});
 assert.equal(res?.status(),200);
 assert.equal(await page.locator('#navPanel').isVisible(),true);
 assert.equal(await page.locator('#navPanel a[href="./exemple-procedure.html"]').isVisible(),true);
 assert.equal(await page.locator('#menuToggle').isVisible(),false);
 assert.equal(await page.locator('.world-fallback').isVisible(),true);
 await context.close();
 console.log('NO_JS_NAVIGATION_PASS');
}finally{await browser.close();}
