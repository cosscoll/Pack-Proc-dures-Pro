// Checks the exact GitHub Pages HTML deployed from the checked-out main
// and real, anonymous desktop/mobile Chromium interactions.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const url=process.env.SITE_URL,kind=process.env.SITE_KIND;
if(!['pack-pro','banque-ia'].includes(kind)||!['https://cosscoll.github.io/Pack-Proc-dures-Pro/','https://cosscoll.github.io/Banque-Outils-IA/'].includes(url)){console.error('Unrecognized public site configuration');process.exit(2)}
const hash=b=>createHash('sha256').update(b).digest('hex');
const out='artifacts/public-browser-smoke';await mkdir(out,{recursive:true});
const report={site:kind,url,started_at:new Date().toISOString(),main_html_match:false,desktop:false,mobile:false,errors:[]};
try{
 const expected=await readFile('index.html');
 for(let attempt=0;attempt<8;attempt++){
  try{
   const r=await fetch(url+'?v='+Date.now(),{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'github-actions-public-pages-smoke'}});
   if(!r.ok||new URL(r.url).hostname!=='cosscoll.github.io')throw Error('Unexpected public HTTP '+r.status);
   const live=Buffer.from(await r.arrayBuffer());
   if(hash(live)!==hash(expected))throw Error('Public index.html differs from checked-out main');
   report.main_html_match=true;break;
  }catch(e){report.errors=[String(e.message||e)];if(attempt<7)await new Promise(r=>setTimeout(r,20000))}
 }
 if(report.main_html_match){
  report.errors=[];
  const {chromium}=await import('playwright');
  const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
  try{
   for(const mode of ['desktop','mobile']){
    const ctx=await browser.newContext({viewport:mode==='mobile'?{width:390,height:844}:{width:1360,height:850},isMobile:mode==='mobile',hasTouch:mode==='mobile',reducedMotion:'reduce'});
    const page=await ctx.newPage(),runtime=[];
    page.on('pageerror',e=>runtime.push(String(e.message||e)));
    try{
     const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
     if(!response||response.status()!==200)throw Error('Browser HTTP status '+(response?.status()??'none'));
     await page.locator('main h1').first().waitFor({state:'visible',timeout:12000});
     const metrics=await page.evaluate(()=>({pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,headings:document.querySelectorAll('h1').length}));
     if(metrics.pageWidth>metrics.viewport+4||metrics.headings!==1)throw Error('Viewport/heading regression '+JSON.stringify(metrics));
     if(kind==='pack-pro'){
      await page.locator('[data-scenario="pending"]').click();
      if(await page.locator('[data-scenario="pending"]').getAttribute('aria-pressed')!=='true')throw Error('Scenario button did not update aria-pressed');
      if(!(await page.locator('#flowStatus').innerText()).includes('EN ATTENTE'))throw Error('Scenario did not update business flow status');
     }else{
      await page.locator('[data-family="1"]').click();
      if(await page.locator('[data-family="1"]').getAttribute('aria-pressed')!=='true')throw Error('Universe selection did not update aria-pressed');
      if(!(await page.locator('#familyCounter').innerText()).includes('02'))throw Error('Universe details did not update');
     }
     report[mode]=true;report[mode+'_metrics']=metrics;
     if(runtime.length)report[mode+'_warnings']=runtime.slice(0,3);
    }catch(e){report.errors.push(mode+': '+String(e.message||e));try{await page.screenshot({path:out+'/'+kind+'-'+mode+'.png',timeout:10000})}catch{}}
    finally{await ctx.close()}
   }
  }finally{await browser.close()}
 }
}catch(e){report.errors.push(String(e.message||e))}
report.ended_at=new Date().toISOString();
report.verified_online=report.main_html_match&&report.desktop&&report.mobile;
await writeFile(out+'/report.json',JSON.stringify(report,null,2)+'\n');
if(process.env.GITHUB_STEP_SUMMARY){
 const {appendFile}=await import('node:fs/promises');
 await appendFile(process.env.GITHUB_STEP_SUMMARY,'## '+kind+' — recette publique\n\n'+
  '| Contrôle | Résultat |\n|---|---|\n'+
  '| HTML identique au code main | '+(report.main_html_match?'OK':'NON')+' |\n'+
  '| Chromium bureau avec interaction | '+(report.desktop?'OK':'NON')+' |\n'+
  '| Chromium mobile avec interaction | '+(report.mobile?'OK':'NON')+' |\n\n'+
  'Ne valide pas les accès privés, achats ou performances sur appareils physiques.\n');
}
console.log('Public deployment: '+(report.verified_online?'VERIFIED':'NOT VERIFIED'),JSON.stringify(report.errors));
if(!report.verified_online)process.exitCode=1;
