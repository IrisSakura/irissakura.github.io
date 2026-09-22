import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function assertPersonaLayouts(browser, baseUrl, output) {
  const page = await browser.newPage();
  const evidence = [];
  await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (output) await mkdir(output, { recursive: true });
  try {
    for (const width of [390, 768, 1440, 2560]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const file of ['index', 'development', 'brand', 'engineering', 'framework', 'journal', 'tools', 'mods', 'wisteria', 'contact']) {
        const route = file === 'index' ? '/index.html' : `/pages/${file}.html`;
        await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
        for (const image of await page.locator('.persona-picture img').all()) {
          await image.scrollIntoViewIfNeeded();
          await image.evaluate((element) => element.decode());
        }
        const geometry = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          images: [...document.querySelectorAll('.persona-picture img')].map((img) => ({
            loaded: img.complete && img.naturalWidth > 0,
            fit: getComputedStyle(img).objectFit,
            current: img.currentSrc,
            width: img.getBoundingClientRect().width,
            height: img.getBoundingClientRect().height
          }))
        }));
        if (geometry.overflow > 1) {
          const offenders = await page.evaluate(() => [...document.querySelectorAll('main *')].map((element) => ({ tag: element.tagName, className: element.className, text: element.textContent.slice(0, 80), right: element.getBoundingClientRect().right })).filter((element) => element.right > innerWidth + 1));
          assert.fail(`${file} ${width}: overflow ${geometry.overflow}; ${JSON.stringify(offenders)}`);
        }
        for (const image of geometry.images) {
          assert.ok(image.loaded && image.width > 0 && image.height > 0, `${file} ${width}: unloaded persona`);
          assert.equal(image.fit, 'contain', `${file} ${width}: cropped persona`);
          assert.match(image.current, /\/personas\/v2\/.*\.(avif|webp)$/u);
        }
        if (['index', 'development', 'brand'].includes(file)) {
          const ids = await page.locator('.persona-picture').evaluateAll((images) => [...new Set(images.map((image) => image.dataset.persona))]);
          assert.equal(ids.length, 6, `${file} lacks six identities`);
        }
        evidence.push({ file, width, ...geometry });
        if (output) {
          await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
          await page.screenshot({ path: path.join(output, `persona-${file}-${width}.png`) });
        }
      }
    }
    if (output) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(baseUrl + '/pages/development.html', { waitUntil: 'networkidle' });
      for (const image of await page.locator('.persona-picture img').all()) {
        await image.scrollIntoViewIfNeeded(); await image.evaluate((element) => element.decode());
      }
      const grid = page.locator('.development-grid');
      // Exclude fixed navigation only from isolated diagnostic card captures.
      await page.addStyleTag({ content: '.navbar, .skip-link { visibility: hidden !important; }' });
      await grid.screenshot({ path: path.join(output, 'personas-six-cards.png') });
      for (const [name, css] of [
        ['thumbnail', '.development-grid {grid-template-columns:repeat(6,minmax(0,1fr))!important}.persona-card-stage{height:12rem!important}.development-card{padding:1rem!important}.development-card h2{font-size:1rem!important}.development-card>p,.development-card>a{display:none!important}'],
        ['blur', '.persona-card-stage{filter:blur(10px)}'],
        ['silhouette', '.persona-picture img{filter:brightness(0)}.persona-card-stage{background:#fff!important}.persona-motif{display:none}'],
        ['content-off', '.development-card>:not(.persona-card-stage){visibility:hidden}']
      ]) {
        const style = await page.addStyleTag({ content: css });
        await grid.screenshot({ path: path.join(output, `personas-${name}.png`) });
        await style.evaluate((element) => element.remove());
      }
      await writeFile(path.join(output, 'personas-layout.json'), JSON.stringify(evidence, null, 2));
    }
  } finally { await page.close(); }
}
