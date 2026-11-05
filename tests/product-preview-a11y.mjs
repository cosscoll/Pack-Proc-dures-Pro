import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
const base=process.env.PROTOTYPE_BASE||'http://127.0.0.1:8787/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:width===320?'reduce':'no-preference'});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const r=await page.goto(new URL('prototype-pack-conciergerie-3d.html',base).toString(),{waitUntil:'domcontentloaded',timeout:35000});
  assert.equal(r?.status(),200);
  await page.waitForFunction(()=>['webgl2','fallback'].includes(document.querySelector('#world')?.dataset.engine),{timeout:35000});
  const pages=[{label:'entrée',selector:'#coffre'},{label:'inventaire',selector:'#inventaire'},{label:'extraits',selector:'#preuve'}];
  for(const step of pages){
   await page.locator(step.selector).scrollIntoViewIfNeeded();
   const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   const violations=report.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.slice(0,10).map(n=>({target:n.target,summary:n.failureSummary?.slice(0,200)}))}));
   console.log('PRODUCT_A11Y_RESULT '+JSON.stringify({width,step:step.label,violations,errors:errors.length}));
   assert.deepEqual(violations,[],width+'px '+step.label+' : axe-core violations');
  }
  assert.deepEqual(errors,[]);
  await context.close();
 }
 console.log('PRODUCT_A11Y_ACCEPTANCE_OK');
}finally{await browser.close()}
