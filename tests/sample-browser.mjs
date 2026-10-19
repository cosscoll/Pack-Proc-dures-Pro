import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

mkdirSync('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const output=[];
try{
 for(const width of [1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:860},reducedMotion:width===320?'reduce':'no-preference'});
  const errors=[];page.on('pageerror',err=>errors.push(String(err)));
  const response=await page.goto('http://127.0.0.1:8787/exemple-procedure.html',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200,'sample should return HTTP 200');
  assert.equal(await page.locator('input[data-step]').count(),7,'only public P01 sample steps');
  const overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth));
  assert.ok(overflow<=1,'horizontal overflow '+width+' px: '+overflow);
  assert.equal(await page.locator('#progress').getAttribute('aria-valuenow'),'0');
  await page.locator('input[data-step]').first().check();
  assert.equal(await page.locator('#progress').getAttribute('aria-valuenow'),'1');
  for(const input of await page.locator('input[data-step]').all())await input.check();
  assert.equal(await page.locator('#progress').getAttribute('aria-valuenow'),'7');
  assert.match(await page.locator('#finalStatus').innerText(),/AUCUNE VALIDATION OPÉRATIONNELLE/);
  await page.locator('#reset').click();
  assert.equal(await page.locator('#progress').getAttribute('aria-valuenow'),'0');
  assert.equal(await page.locator('input[data-step]:checked').count(),0);
  await page.evaluate(()=>window._printCalled=false);
  await page.evaluate(()=>{window.print=()=>{window._printCalled=true;};});
  await page.locator('#print').click();
  assert.equal(await page.evaluate(()=>window._printCalled),true);
  assert.deepEqual(errors,[]);
  const external=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(location.origin)).map(r=>r.name));
  assert.deepEqual(external,[],'unexpected third-party resources');
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:'screenshots/procedure-'+width+'.png',animations:'disabled'});
  output.push({width,overflow,errors:errors.length,steps:7,reset:true,print:true,externalResources:external.length});
  console.log('SAMPLE_BROWSER_PASS '+JSON.stringify(output.at(-1)));
  await page.close();
 }
 console.log('SAMPLE_BROWSER_ACCEPTANCE_OK '+JSON.stringify(output));
}finally{await browser.close();}
