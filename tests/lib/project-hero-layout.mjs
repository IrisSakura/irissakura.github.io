import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

/** Check the rendered page, not just the presence of a CSS class. */
export async function assertProjectHeroLayouts(browser, baseUrl, screenshotDirectory) {
  if (screenshotDirectory) await mkdir(screenshotDirectory, { recursive: true });
  const page = await browser.newPage();
  await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  try {
    for (const width of [390, 899, 900, 901, 1440]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
      for (const name of ['engineering', 'framework', 'journal', 'tools']) {
        await page.goto(`${baseUrl}/pages/${name}.html`, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await document.querySelector('[data-brand-project-hero] img').decode();
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
        const geometry = await page.evaluate(() => {
          const nav = document.querySelector('.navbar').getBoundingClientRect();
          const hero = document.querySelector('[data-brand-project-hero]').getBoundingClientRect();
          const art = document.querySelector('.brand-mode-hero-art').getBoundingClientRect();
          const title = document.querySelector('[data-brand-project-hero] h1').getBoundingClientRect();
          return { navBottom: nav.bottom, heroTop: hero.top, artTop: art.top, titleTop: title.top, overflow: document.documentElement.scrollWidth - window.innerWidth };
        });
        const label = `${width}px ${name}: ${JSON.stringify(geometry)}`;
        assert.ok(geometry.heroTop >= geometry.navBottom - 1, `Hero is under fixed navigation: ${label}`);
        assert.ok(geometry.artTop >= geometry.navBottom - 1, `Artwork is under fixed navigation: ${label}`);
        assert.ok(geometry.titleTop >= geometry.navBottom - 1, `Title is under fixed navigation: ${label}`);
        assert.ok(geometry.overflow <= 1, `Horizontal overflow: ${label}`);
        if (name === 'journal') {
          const overviewIsBelowHero = await page.evaluate(() =>
            document.querySelector('.journal-dashboard').getBoundingClientRect().top >=
            document.querySelector('[data-brand-project-hero]').getBoundingClientRect().bottom - 1);
          assert.ok(overviewIsBelowHero, `Knowledge overview covers the hero at ${width}px`);
          const controlsFit = await page.evaluate(() => {
            const form = document.querySelector('.content-search-controls');
            const bounds = form.getBoundingClientRect();
            return [...form.querySelectorAll('input, select, button')].every((control) => {
              const rect = control.getBoundingClientRect();
              return rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1;
            });
          });
          assert.ok(controlsFit, `Search controls are clipped at ${width}px`);
        }
        if (screenshotDirectory && [390, 1440].includes(width)) {
          await page.screenshot({ path: path.join(screenshotDirectory, `${name}-hero-${width}.png`) });
        }
        const jump = page.locator('[data-brand-project-hero] a[href^="#"]').first();
        const href = await jump.getAttribute('href');
        await jump.click();
        await page.waitForFunction((selector) => {
          const target = document.querySelector(selector);
          const heading = target?.querySelector('h2') ?? target;
          if (!heading) return false;
          const nav = document.querySelector('.navbar').getBoundingClientRect();
          const index = document.querySelector('[data-page-index]')?.getBoundingClientRect();
          const obstruction = index && index.top <= nav.bottom + 2 && index.bottom > 0 ? Math.max(nav.bottom, index.bottom) : nav.bottom;
          const rect = heading.getBoundingClientRect();
          return rect.top >= obstruction - 1 && rect.top < window.innerHeight;
        }, href, { timeout: 5000 });
      }
    }
  } finally {
    await page.close();
  }
}
