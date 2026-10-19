import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base='https://cosscoll.github.io/Pack-Proc-dures-Pro/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
let failures=0;
try {
 for(const route of ['', 'exemple-procedure.html']){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  const page=await context.newPage();
  await page.addInitScript(()=>{
    window.__qa={lcp:null,cls:0};
    try{new PerformanceObserver(list=>{const entries=list.getEntries();if(entries.length)window.__qa.lcp=entries.at(-1).startTime}).observe({type:'largest-contentful-paint',buffered:true})}catch{}
    try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__qa.cls+=e.value}).observe({type:'layout-shift',buffered:true})}catch{}
  });
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const response=await page.goto(base+route,{waitUntil:'networkidle',timeout:35000});
  await page.waitForTimeout(650);
  const outcome=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  const metrics=await page.evaluate(()=>({
    lcpMs:window.__qa?.lcp,cls:window.__qa?.cls,
    transferredResources:performance.getEntriesByType('resource').length,
    fullHtmlChars:document.documentElement.outerHTML.length,
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
  }));
  const details=outcome.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,targets:v.nodes.slice(0,4).map(n=>n.target.join(' '))}));
  console.log('A11Y_AUDIT_RESULT '+JSON.stringify({route:route||'index.html',http:response?.status(),metrics,errors,violations:details}));
  if(response?.status()!==200||errors.length||details.length||metrics.overflow>1)failures++;
  await page.close();await context.close();
 }
} finally {await browser.close()}
if(failures)throw new Error(failures+' page(s) en erreur lors de la recette a11y');
console.log('A11Y_AUDIT_OK');
