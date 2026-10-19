import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MOTION_BASE||'http://127.0.0.1:8787/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const response=await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200);
  await page.locator('#vision').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#processCanvas').classList.contains('is-active'),{timeout:15000});
  assert.equal(await page.locator('#sceneFallback').isVisible(),false);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>!document.querySelector('#processCanvas').classList.contains('is-active'));
  assert.equal(await page.locator('#sceneFallback').isVisible(),true,'fallback required under reduced motion');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForFunction(()=>document.querySelector('#processCanvas').classList.contains('is-active'));
  assert.equal(await page.locator('#sceneFallback').isVisible(),false,'WebGL scene resumes when preference lifted');
  await page.evaluate(()=>{
    const c=document.querySelector('#processCanvas');
    c.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));
  });
  await page.waitForFunction(()=>!document.querySelector('#processCanvas').classList.contains('is-active'));
  assert.equal(await page.locator('#sceneFallback').isVisible(),true,'fallback on simulated graphics context loss');
  await page.evaluate(()=>document.querySelector('#processCanvas').dispatchEvent(new Event('webglcontextrestored')));
  await page.waitForFunction(()=>document.querySelector('#processCanvas').classList.contains('is-active'));
  assert.equal(await page.locator('#sceneFallback').isVisible(),false,'scene resumes after simulated context restoration');
  assert.deepEqual(errors,[]);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1);
  results.push({width,reducedMotionToggled:true,simulatedGraphicsRestore:true,overflow,errors:errors.length});
  console.log('MOTION_LIFECYCLE_PASS '+JSON.stringify(results.at(-1)));
  await page.close();
 }
 console.log('MOTION_LIFECYCLE_ACCEPTANCE_OK '+JSON.stringify(results));
}finally{await browser.close()}
