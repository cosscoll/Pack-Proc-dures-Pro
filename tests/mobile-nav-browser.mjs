import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const root=process.env.NAV_BASE||'http://127.0.0.1:8787/';
try {
 for(const width of [320,390,750,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const response=await page.goto(root,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200);
  const button=page.locator('#menuToggle'),nav=page.locator('#primaryNavigation');
  if(width<=750){
    const debug=await page.evaluate(()=>{
      const menu=document.getElementById('primaryNavigation');
      const style=getComputedStyle(menu);
      return {root:document.documentElement.className,navClass:menu.className,visibility:style.visibility,opacity:style.opacity,display:style.display,errors:[],hasToggle:!!document.getElementById('menuToggle')};
    });
    console.log('NAV_DEBUG '+JSON.stringify({width,...debug}));
    assert.equal(await button.isVisible(),true,'compact menu visible');
    assert.equal(await nav.isVisible(),false,'drawer initially hidden');
    assert.equal(await button.getAttribute('aria-expanded'),'false');
    await button.click();
    assert.equal(await nav.isVisible(),true);
    assert.equal(await button.getAttribute('aria-expanded'),'true');
    assert.equal(await nav.locator('a[href="./avancement.html"]').isVisible(),true);
    await page.keyboard.press('Escape');
    assert.equal(await nav.isVisible(),false);
    assert.equal(await button.getAttribute('aria-expanded'),'false');
    assert.equal(await button.evaluate(el=>el===document.activeElement),true,'escape restores focus');
    await button.click();
    await nav.locator('a[href="#solutions"]').click();
    assert.equal(await nav.isVisible(),false,'drawer closes after navigation');
    await button.click();
    await page.locator('.opening h1').click({force:true});
    assert.equal(await nav.isVisible(),false,'outside click closes drawer');
  }else{
    assert.equal(await button.isVisible(),false);
    assert.equal(await nav.isVisible(),true);
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,'overflow at '+width+': '+overflow);
  assert.deepEqual(errors,[],'no JS errors');
  console.log('NAV_BROWSER_PASS '+JSON.stringify({width,compact:width<=750,overflow,errors:0}));
  await page.close();
 }
 const nojs=await browser.newPage({viewport:{width:390,height:850},javaScriptEnabled:false});
 await nojs.goto(root,{waitUntil:'domcontentloaded'});
 assert.equal(await nojs.locator('#primaryNavigation').isVisible(),true,'no JS: navigation remains accessible');
 assert.equal(await nojs.locator('#menuToggle').isVisible(),false,'no JS: no inert button');
 console.log('NAV_BROWSER_ACCEPTANCE_OK');
}finally{await browser.close();}
