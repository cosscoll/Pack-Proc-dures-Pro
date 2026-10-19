import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

mkdirSync('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const sizes=[1440,768,390,320];
try {
  for(const width of sizes){
    const mobile=width<=390;
    const context=await browser.newContext({viewport:{width,height:850},isMobile:mobile,hasTouch:mobile,reducedMotion:width===320?'reduce':'no-preference'});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto('http://127.0.0.1:8787/atelier-decisions.html',{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200);
    assert.equal(await page.locator('#choices .choice').count(),3);
    const orbit=page.locator('#visual');
    await orbit.focus();await page.keyboard.press('ArrowRight');
    assert.notEqual(await orbit.evaluate(e=>e.style.getPropertyValue('--tilt-y')),'-15deg');
    await page.locator('[data-choice="0"]').click();
    assert.match(await page.locator('#feedbackTitle').innerText(),/Décision risquée/);
    assert.equal(await page.locator('.choice:disabled').count(),3);
    await page.locator('#next').click();
    assert.match(await page.locator('#game-heading').innerText(),/Qui valide/);
    await page.locator('[data-choice="0"]').click();
    assert.match(await page.locator('#feedbackTitle').innerText(),/Décision cohérente/);
    await page.locator('#next').click();
    assert.match(await page.locator('#game-heading').innerText(),/incident/);
    await page.locator('[data-choice="2"]').click();
    await page.locator('#next').click();
    assert.equal(await page.locator('#result').isVisible(),true,'result visible');
    assert.equal(await page.locator('#gameBody').isVisible(),false,'game body hidden');
    assert.match(await page.locator('#score').innerText(),/2\s*\/\s*3/);
    assert.equal(await page.locator('#resultList .result-item').count(),3);
    assert.equal(await page.locator('#result .cta').getAttribute('href'),'./exemple-procedure.html');
    await page.locator('#restart').click();
    assert.equal(await page.locator('#result').isVisible(),false,'result hidden after restart');
    assert.equal(await page.locator('#choices .choice').count(),3);
    assert.match(await page.locator('#game-heading').innerText(),/intervenant/);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert.ok(overflow<=1,'horizontal overflow '+width+': '+overflow);
    assert.deepEqual(errors,[],'no JS errors');
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],'automatic WCAG violations');
    await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0)});
    await page.screenshot({path:'screenshots/atelier-decisions-'+width+'.png',animations:'disabled'});
    console.log('DECISION_GAME_PASS',JSON.stringify({width,questions:3,score:'2/3',a11yViolations:0,overflow,jsErrors:0}));
    await context.close();
  }
  console.log('DECISION_GAME_ACCEPTANCE_OK');
}finally{await browser.close()}
