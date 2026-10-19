import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

const base = 'https://cosscoll.github.io/Pack-Proc-dures-Pro/';
mkdirSync('screenshots', {recursive:true});
const browser = await chromium.launch({
  headless:true,
  args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
const results = [];
try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({
      viewport:{width,height:900},
      reducedMotion: width===320 ? 'reduce' : 'no-preference'
    });
    const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    const response=await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(response?.status(),200,'Public homepage must respond 200');
    await page.waitForSelector('#laboratoire [data-scenario="incident"]');
    assert.equal(await page.locator('#processCanvas').count(),1);
    const toggle=page.locator('#menuToggle');
    if(await toggle.isVisible()){
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      assert.equal(await page.locator('#primaryNavigation a[href="./avancement.html"]').isVisible(),true);
      await toggle.click();
    }else{
      assert.equal(await page.locator('a[href="./avancement.html"]').first().isVisible(),true);
    }
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    assert.ok(overflow<=1,'horizontal overflow at '+width+': '+overflow);
    await page.locator('.orientation-option summary').first().click();
    assert.equal(await page.locator('.orientation-option').first().evaluate(x=>x.open),true,'orientation accordion');
    await page.locator('[data-scenario="incident"]').click();
    assert.equal(await page.locator('#flowStatus').innerText(),'BLOQUÉ','incident state');
    await page.locator('[data-scenario="pending"]').click();
    assert.equal(await page.locator('#flowStatus').innerText(),'EN ATTENTE','confirmation state');
    const gpu=await page.evaluate(()=>!!document.querySelector('#processCanvas').getContext('webgl2'));
    await page.evaluate(()=>window.scrollTo(0,document.querySelector('#vision').offsetTop+200));
    await page.waitForTimeout(600);
    const active=await page.locator('#processCanvas').getAttribute('class');
    const fallback=await page.locator('#sceneFallback').isVisible();
    assert.ok(active==='is-active'||fallback,'WebGL or fallback must be available');
    assert.deepEqual(errors,[],'no JS page errors');
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:'screenshots/home-'+width+'.png',animations:'disabled'});
    results.push({width,overflow,gpuAvailable:gpu,webglActive:active==='is-active',fallbackVisible:fallback,errors:errors.length});
    console.log('PASS_BROWSER',JSON.stringify(results.at(-1)));
    await page.close();
  }
  console.log('PUBLIC_BROWSER_ACCEPTANCE_OK',JSON.stringify(results));
} finally {
  await browser.close();
}
