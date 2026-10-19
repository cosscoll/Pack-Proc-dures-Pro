import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
mkdirSync('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const base='http://127.0.0.1:8787/';
try {
  for(const width of [1440,1024,390,320]){
    const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:width===320?'reduce':'no-preference'});
    const page=await ctx.newPage();
    const errs=[];page.on('pageerror',e=>errs.push(String(e)));
    const res=await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(res?.status(),200);
    assert.match(await page.locator('#opening-title').innerText(),/Chaque arrivée/);
    assert.equal(await page.locator('a.hero-primary[href="./exemple-procedure.html"]').isVisible(),true,'free sample CTA is visible');
    assert.equal(await page.locator('#heroCanvas').count(),1);
    await page.locator('#heroStage').scrollIntoViewIfNeeded();
    const reduced=width===320;
    if(!reduced){
      await page.waitForFunction(()=>document.querySelector('#heroStage').classList.contains('webgl-active'),{timeout:15000});
      assert.ok(await page.evaluate(()=>!!document.querySelector('#heroCanvas').getContext('webgl2')),'hero requires actual WebGL2');
    }else{
      assert.equal(await page.locator('#heroStage').evaluate(x=>x.classList.contains('webgl-active')),false);
      assert.equal(await page.locator('#heroVolume').isVisible(),true);
    }
    const bounds=await page.locator('#heroStage').boundingBox();
    assert.ok(bounds && bounds.width>0,'hero stage must have dimensions');
    await page.mouse.move(bounds.x+bounds.width*.25,bounds.y+bounds.height*.45);
    await page.waitForTimeout(150);
    const before=await page.locator('#heroStage').evaluate(x=>x.style.getPropertyValue('--ry'));
    await page.mouse.move(bounds.x+bounds.width*.75,bounds.y+bounds.height*.55);
    await page.waitForTimeout(180);
    const after=await page.locator('#heroStage').evaluate(x=>x.style.getPropertyValue('--ry'));
    assert.notEqual(before,after,'hero rotation should respond to pointer within its bounds '+width);
    await page.locator('#heroStage').focus();
    await page.keyboard.press('ArrowRight');
    const keyboardTilt=await page.locator('#heroStage').evaluate(x=>x.style.getPropertyValue('--ry'));
    assert.ok(keyboardTilt.length>0,'hero rotates on keyboard');
    await page.locator('[data-compare="after"]').click();
    assert.equal(await page.locator('[data-compare="after"]').getAttribute('aria-pressed'),'true');
    assert.match(await page.locator('#compareHeadline').innerText(),/mission confirmée/);
    assert.match(await page.locator('#compareDetail').innerText(),/contrôle réel/);
    await page.locator('[data-compare="before"]').click();
    assert.match(await page.locator('#compareHeadline').innerText(),/Personne ne confirme/);
    await page.locator('[data-scenario="incident"]').click();
    assert.equal(await page.locator('#flowStatus').innerText(),'BLOQUÉ');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert.ok(overflow<=1,'horizontal overflow at '+width+': '+overflow);
    assert.deepEqual(errs,[],'no page runtime errors');
    await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(230);
    await page.screenshot({path:'screenshots/sales-hero-'+width+'.png',animations:'disabled'});
    console.log('SALES_HERO_PASS '+JSON.stringify({width,heroWebGL:!reduced,pointerMotion:before!==after,keyboard:true,compare:true,overflow,errors:errs.length}));
    await ctx.close();
  }
  console.log('SALES_HERO_ACCEPTANCE_OK');
}finally{await browser.close();}
