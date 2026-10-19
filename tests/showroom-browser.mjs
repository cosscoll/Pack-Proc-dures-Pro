import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
mkdirSync('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const root='http://127.0.0.1:8787/';
try{
 for(const width of [1440,768,390,320]){
  const mobile=width<500;
  const context=await browser.newContext({viewport:{width,height:860},isMobile:mobile,hasTouch:mobile,reducedMotion:width===320?'reduce':'no-preference'});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const result=await page.goto(root,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(result?.status(),200);
  const tabs=page.locator('.showroom-tab');
  assert.equal(await tabs.count(),3);
  await page.locator('#contenu-pack').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.showroom-tab[data-view="procedures"]').getAttribute('aria-selected'),'true');
  assert.match(await page.locator('#showroomHeading').innerText(),/gestes ne devraient pas dépendre/);
  await page.locator('.showroom-tab[data-view="registres"]').click();
  assert.equal(await page.locator('.showroom-tab[data-view="registres"]').getAttribute('aria-selected'),'true');
  assert.match(await page.locator('#showroomHeading').innerText(),/Les décisions ne devraient pas/);
  assert.match(await page.locator('#showroomGraphicNumber').innerText(),/07/);
  await page.locator('.showroom-tab[data-view="pilotage"]').click();
  assert.match(await page.locator('#showroomAvailability').innerText(),/non validé et non promis/);
  assert.equal(await page.locator('#showroomPanel').getAttribute('aria-labelledby'),'showroom-tab-pilotage');
  await page.locator('.showroom-tab[data-view="pilotage"]').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.showroom-tab[data-view="procedures"]').getAttribute('aria-selected'),'true','tabs wrap through arrows');
  await page.locator('#showroomStage').focus();
  await page.keyboard.press('ArrowRight');
  const orbit=await page.locator('#showroomStage').evaluate(x=>x.style.getPropertyValue('--local-y'));
  assert.notEqual(orbit,'0deg','keyboard orbits three-dimensional preview');
  await page.locator('#showroomStage').hover({force:true});
  if(!mobile){
   const box=await page.locator('#showroomStage').boundingBox();
   await page.mouse.move(box.x+box.width*.2,box.y+box.height*.45);
   const before=await page.locator('#showroomStage').evaluate(x=>x.style.getPropertyValue('--local-y'));
   await page.mouse.move(box.x+box.width*.75,box.y+box.height*.55);
   const after=await page.locator('#showroomStage').evaluate(x=>x.style.getPropertyValue('--local-y'));
   assert.notEqual(before,after,'hover tilts product sheets');
  }else{
   await page.locator('#showroomStage').dispatchEvent('pointerdown',{pointerType:'touch',pointerId:7,button:0,clientX:120,clientY:540});
   await page.locator('#showroomStage').dispatchEvent('pointermove',{pointerType:'touch',pointerId:7,clientX:220,clientY:530});
   const tilt=await page.locator('#showroomStage').evaluate(x=>x.style.getPropertyValue('--local-y'));
   assert.notEqual(tilt,orbit,'touch drag tilts 3D stage');
   await page.locator('#showroomStage').dispatchEvent('pointerup',{pointerType:'touch',pointerId:7,clientX:220,clientY:530});
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,'no horizontal overflow at '+width+': '+overflow);
  assert.deepEqual(errors,[],'no JavaScript errors');
  await page.locator('#contenu-pack').scrollIntoViewIfNeeded();
  await page.screenshot({path:'screenshots/showroom-'+width+'.png',animations:'disabled'});
  console.log('SHOWROOM_PASS '+JSON.stringify({width,tabs:3,keyboard:true,touch:mobile,overflow,errors:errors.length}));
  await context.close();
 }
 console.log('SHOWROOM_ACCEPTANCE_OK');
}finally{await browser.close();}
