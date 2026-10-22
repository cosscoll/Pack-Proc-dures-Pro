import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
mkdirSync('screenshots/audit',{recursive:true});
const results=[];
for(const file of ['index.html','pack-conciergerie.html','exemple-procedure.html']){
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  let errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url='https://cosscoll.github.io/Pack-Proc-dures-Pro/'+file;
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:35000});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
  await page.waitForTimeout(600);
  const ux=await page.evaluate(()=>{
   const intersect=(el)=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.visibility!=='hidden'&&s.display!=='none'&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight;};
   const anchors=[...document.querySelectorAll('a[href]')]; const all=[...document.querySelectorAll('a,button,summary')];
   return {
    title:document.title,h1:document.querySelector('h1')?.textContent?.trim(),
    documentHeight:document.documentElement.scrollHeight,viewportWidth:innerWidth,
    overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    aboveFoldLinks:anchors.filter(intersect).map(a=>({name:a.textContent.trim().slice(0,90),href:a.getAttribute('href')})).slice(0,18),
    tinyTargets:all.filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&(r.width<24||r.height<24)}).map(el=>({name:el.textContent.trim().slice(0,38),w:Math.round(el.getBoundingClientRect().width),h:Math.round(el.getBoundingClientRect().height)})).slice(0,20),
    emptyLinks:anchors.filter(a=>!a.textContent.trim()&&!a.getAttribute('aria-label')).length,
    brokenLocalAnchors:anchors.filter(a=>a.getAttribute('href')?.startsWith('#')&&!document.querySelector('[id="'+CSS.escape(a.getAttribute('href').slice(1))+'"]')).map(a=>a.getAttribute('href')).slice(0,10),
    directProductLink:anchors.filter(a=>(a.getAttribute('href')||'').includes('pack-conciergerie.html')).length
   };
  });
  let axe=null;try{
   const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   axe={violations:a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,targets:v.nodes.slice(0,3).map(n=>n.target)})),passes:a.passes.length};
  }catch(e){axe={error:String(e)}}
  const safe=file.replace('.html','');
  await page.screenshot({path:'screenshots/audit/'+safe+'-'+width+'-start.png',animations:'disabled'});
  if(file==='pack-conciergerie.html'){
   await page.locator('#composition').scrollIntoViewIfNeeded();
   await page.waitForTimeout(250);
   await page.screenshot({path:'screenshots/audit/'+safe+'-'+width+'-composition.png',animations:'disabled'});
  }
  results.push({page:file,width,http:response?.status(),ux,axe,errors});
  console.log('UX_AUDIT '+JSON.stringify(results.at(-1)));
  await context.close();
 }
}
writeFileSync('screenshots/audit/ux-baseline.json',JSON.stringify(results,null,2));
await browser.close();
