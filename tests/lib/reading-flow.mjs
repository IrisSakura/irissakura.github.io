import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
export async function assertReadingFlow(browser,baseUrl,output) {
 const page=await browser.newPage();const evidence=[];
 await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(baseUrl).origin?r.continue():r.abort());
 await page.emulateMedia({reducedMotion:'reduce'});
 try {
  for(const width of [1440,992,390]) {
   await page.setViewportSize({width,height:1000});await page.goto(baseUrl+'/pages/blog/runtime-consumption-facade-scope.html',{waitUntil:'networkidle'});
   const toc=page.locator('.article-toc');
   if(width<=900) {assert.equal(await toc.getAttribute('open'),null);await toc.locator('summary').focus();await page.keyboard.press('Enter');}
   const link=toc.locator('a').first();const href=await link.getAttribute('href');await link.click();
   await page.waitForFunction(h=>decodeURIComponent(location.hash)===decodeURIComponent(h),href);
   const anchor=await page.evaluate(h=>{const id=decodeURIComponent(h.slice(1)),target=document.getElementById(id),nav=document.querySelector('.navbar');return{top:target.getBoundingClientRect().top,bottom:nav.getBoundingClientRect().bottom};},href);
   assert.ok(anchor.top>=anchor.bottom-1&&anchor.top<1000,`reading anchor obscured at ${width}`);
   const blocks=await page.locator('.article-breakout').evaluateAll(es=>es.map(e=>({width:e.getBoundingClientRect().width,scroll:e.scrollWidth,tabindex:e.tabIndex,overflow:getComputedStyle(e).overflowX})));
   assert.ok(blocks.length>=2);assert.ok(blocks.every(b=>b.tabindex===0&&b.overflow==='auto'&&b.width<=width));
   if(width===1440) assert.ok(blocks.every(b=>b.width>=900&&b.width<=1100));
   await page.locator('.article-breakout').first().focus();
   assert.ok(await page.locator('.article-breakout').first().evaluate(e=>e===document.activeElement));
   evidence.push({width,anchor,blocks});
   if(output) {await mkdir(path.join(output,'reading'),{recursive:true});for(const fraction of [0,.35,.7]) {await page.evaluate(f=>scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*f,behavior:'instant'}),fraction);await page.screenshot({path:path.join(output,'reading',`reading-${width}-${fraction}.png`)});}}
  }
  if(output) await writeFile(path.join(output,'reading-flow.json'),JSON.stringify(evidence,null,2));
 }finally{await page.close();}
}
