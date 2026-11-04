import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root=process.cwd(), origin='https://irissakura.com', commit='40e8745e2072fec5e61ee5064ca8d92b768e07cc';
const evidence=path.join(root,'output/playwright/interactive-labs');
const {assertInteractiveLabs}=await import(pathToFileURL(path.join(root,'tests/lib/interactive-labs-flow.mjs')));
const routes=['index.html','pages/tools.html','pages/framework.html','pages/labs/numeric-workbench.html','pages/labs/deck-odds.html','pages/labs/pathfinding.html','dist/site.js','dist/interactive-labs.js','dist/labs/models.js','dist/labs/pathfinding.js','dist/labs/deck-worker.js','dist/styles/site.css','data/site-search-index.json','sitemap.xml'];
const browser=await chromium.launch({headless:true,args:['--host-resolver-rules=MAP irissakura.com 185.199.111.153']});
try {
 const files=[];
 for(const route of routes){const bytes=execFileSync('curl',['--fail','--silent','--show-error','--max-time','30','--resolve','irissakura.com:443:185.199.111.153','-H','Cache-Control: no-cache',`${origin}/${route}?delivery=${commit}`],{maxBuffer:2*1024*1024}),local=await readFile(path.join(root,'_site',route));const sha=createHash('sha256').update(bytes).digest('hex');const match=bytes.equals(local);files.push({route,status:200,bytes:bytes.length,sha256:sha,matchesAcceptedPackage:match});if(!match)throw Error(`Published asset differs: ${route}`)}

 await writeFile(path.join(evidence,'online-assets.json'),JSON.stringify({origin,commit,verifiedAt:new Date().toISOString(),dns:'Public Google DNS returned GitHub Pages IPs; request-only mapping to 185.199.111.153 because local DNS fails. TLS verification remains enabled; no system DNS changes.',files},null,2)+'\n');
 await assertInteractiveLabs(browser,origin,path.join(evidence,'deployed'));
 const resultsPath=path.join(evidence,'deployed/output/playwright/interactive-labs/browser-results.json');const result=JSON.parse(await readFile(resultsPath,'utf8'));result.origin=origin;result.commit=commit;result.verifiedAt=new Date().toISOString();result.scope='Live GitHub Pages: Chromium desktop, responsive viewports, touch emulation; no Safari or physical-device claim';await writeFile(resultsPath,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({passed:true,origin,commit,matchingPublishedFiles:files.length,responsiveMeasurements:result.measurements.length,runtimeErrors:result.runtimeErrors}));
} finally {await browser.close()}
