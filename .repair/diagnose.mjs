import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const output = '/tmp/website-repair/diagnostics';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:4173/') ? route.continue() : route.abort());
const report = [];
try {
  for (const width of [901, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const name of ['engineering', 'framework', 'journal', 'tools', 'brand', 'contact']) {
      await page.goto(`http://127.0.0.1:4173/pages/${name}.html`, { waitUntil: 'networkidle' });
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => !i.loading || i.loading !== 'lazy').map(i => i.decode().catch(() => {}))); });
      report.push({ name, width, geometry: await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        elements: [...document.querySelectorAll('body *')].map(e => {
          const r=e.getBoundingClientRect(), s=getComputedStyle(e);
          return {tag:e.tagName, id:e.id, cls:e.className, right:r.right, left:r.left, width:r.width, scrollWidth:e.scrollWidth, clientWidth:e.clientWidth, overflowX:s.overflowX, minWidth:s.minWidth, whiteSpace:s.whiteSpace, text:e.innerText?.slice(0,140)};
        }).filter(e => e.width && (e.right > innerWidth+1 || e.left < -1)).slice(0,60)
      })) });
      await page.screenshot({ path: `${output}/${name}-${width}.png`, fullPage: name==='brand'||name==='contact' });
    }
  }
  await writeFile(`${output}/geometry.json`, JSON.stringify(report,null,2));
} finally { await browser.close(); }
