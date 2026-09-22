import assert from 'node:assert/strict';
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const widths=[2048,1600,1440,1280,992,900,769,600,390];
const references=['engineering','framework','journal','tools','mods','wisteria'];
const routes=['index','development','brand',...references,'contact','blog','blog/authoritative-time-source','blog/series/sakura-framework-engineering','blog/tag/unity','framework/runtime'];
export async function assertPersonaLayouts(browser, baseUrl, output) {
 const page=await browser.newPage(); const evidence=[],failures=[];
 await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(baseUrl).origin?route.continue():route.abort());
 await page.emulateMedia({reducedMotion:'reduce'});
 const visit=async(file,width,folder)=>{
  await page.setViewportSize({width,height:1000});
  const route=file==='index'?'/index.html':`/pages/${file}.html`;
  const redirect=['about','art-music','blog/facade-scope','blog/unity-quickstart','blog/unity-sample'].includes(file);
  await page.goto(baseUrl+route,{waitUntil:redirect?'networkidle':'load'});
  if(file==='journal') await page.locator('[data-content-search-results] .content-search-result').first().waitFor();
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('img')].map(img=>{img.loading='eager';return img.decode().catch(()=>{});}));});
  const geometry=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth-innerWidth,
   grammar:document.documentElement.dataset.pageGrammar,
   images:[...document.querySelectorAll('.persona-picture img')].map(img=>({loaded:img.complete&&img.naturalWidth>0,fit:getComputedStyle(img).objectFit,current:img.currentSrc,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height})),
   prose:[...document.querySelectorAll('.article-prose-section')].map(el=>({width:el.getBoundingClientRect().width,lineHeight:getComputedStyle(el).lineHeight})),
   toc:document.querySelector('.article-toc')?.open,
   overlaps:[...document.querySelectorAll('.article-breakout')].some(b=>[...document.querySelectorAll('.article-toc,.series-context')].some(a=>{const x=b.getBoundingClientRect(),y=a.getBoundingClientRect();return x.left<y.right&&x.right>y.left&&x.top<y.bottom&&x.bottom>y.top;})),
   missingAnchors:[...document.querySelectorAll('.article-toc a')].filter(a=>!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash)
  }));
  if(geometry.overflow>1) failures.push(`${file} ${width}: page overflow ${geometry.overflow}`);
  for(const image of geometry.images) if(!image.loaded||!image.width||!image.height||image.fit!=='contain') failures.push(`${file} ${width}: missing/cropped persona`);
  if(references.includes(file)&&geometry.images.length!==1) failures.push(`${file} ${width}: requires exactly one persona`);
  if(['index','development'].includes(file)&&geometry.images.length) failures.push(`${file} ${width}: character gallery restored`);
  if(geometry.toc!==undefined&&geometry.toc!==(width>900)) failures.push(`${file} ${width}: TOC disclosure state`);
  if(geometry.overlaps||geometry.missingAnchors.length) failures.push(`${file} ${width}: reader overlap/anchor`);
  if(width>=1440&&geometry.prose.some(p=>p.width<680||p.width>760)) failures.push(`${file} ${width}: prose width outside 680–760`);
  evidence.push({file,width,...geometry});
  if(output&&folder) {await mkdir(path.join(output,folder),{recursive:true});await page.screenshot({path:path.join(output,folder,`${file.replaceAll('/','--')}-${width}.png`),fullPage:folder==='routes'});}
 };
 try {
  for(const width of widths) for(const file of routes) await visit(file,width,'responsive');
  // Drawers are real native disclosures: keyboard opens/closes without fake tool state.
  await page.goto(baseUrl+'/pages/tools.html',{waitUntil:'networkidle'});
  const drawer=page.locator('.tool-drawer').first(),summary=drawer.locator('summary');
  await summary.focus();await page.keyboard.press('Enter');assert.equal(await drawer.getAttribute('open'),'');
  await page.keyboard.press('Enter');assert.equal(await drawer.getAttribute('open'),null);
  if(output) {
   async function files(dir){const entries=await readdir(dir,{withFileTypes:true});return(await Promise.all(entries.map(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]))).flat();}
   const pagesDir=new URL('../../pages/',import.meta.url);
   for(const full of await files(pagesDir.pathname)) {const file=path.relative(pagesDir.pathname,full).slice(0,-5);for(const width of [1440,390]) await visit(file,width,'routes');}
   for(const width of [1440,390]) {await visit('index',width,'routes');await page.goto(baseUrl+'/404.html',{waitUntil:'networkidle'});await page.screenshot({path:path.join(output,'routes',`404-${width}.png`),fullPage:true});}
   await captureGrammarDiagnostics(browser,baseUrl,output);
   await writeFile(path.join(output,'website-v2-layout.json'),JSON.stringify({widths,evidence,failures},null,2));
  }
  assert.deepEqual(failures,[],failures.join('\n'));
 } finally {await page.close();}
}

export async function captureGrammarDiagnostics(browser,baseUrl,output) {
 const page=await browser.newPage({viewport:{width:1440,height:1800}});
 await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(baseUrl).origin?r.continue():r.abort());
 await page.emulateMedia({reducedMotion:'reduce'});
 const frame=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await mkdir(path.join(output,'diagnostics'),{recursive:true});
 try {
  for(const file of references) {
   await page.goto(baseUrl+`/pages/${file}.html`,{waitUntil:'networkidle'});
   await page.locator('.persona-picture img').evaluate(img=>img.decode());
   for(const [name,css] of [
    ['silhouette','main{filter:grayscale(1) blur(3px)} main *{-webkit-text-fill-color:transparent!important;text-shadow:none!important}'],
    ['blur','main{filter:blur(12px)}'],
    ['content-off','h1,.brand-wordmark,.brand-mark,.mods-brand-lockup{visibility:hidden!important}'],
    ['persona-off','.persona-picture,.persona-picture *{visibility:hidden!important}']
   ]) {
    const style=await page.addStyleTag({content:css});await frame();
    if(name==='persona-off') assert.equal(await page.locator('.persona-picture img').evaluate(e=>getComputedStyle(e).visibility),'hidden');
    if(name==='content-off') assert.equal(await page.locator('h1').evaluate(e=>getComputedStyle(e).visibility),'hidden');
    await page.screenshot({path:path.join(output,'diagnostics',`${file}-${name}.png`)});
    await style.evaluate(el=>el.remove());await frame();
   }
  }
 }finally{await page.close();}
}
