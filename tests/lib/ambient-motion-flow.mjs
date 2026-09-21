import assert from 'node:assert/strict';

export async function assertAmbientMotion(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'no-preference' });
  await context.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${baseUrl}/index.html`);
    const layer = page.locator('[data-ambient-layer]');
    await page.waitForFunction(() => document.querySelector('[data-ambient-layer]')?.dataset.motion === 'running');
    assert.equal(await page.locator('.profile-illustration img').evaluate((img) => img.complete && img.naturalWidth > 0), true);
    assert.equal(await page.locator('.ambient-particle:visible').count(), 12);
    assert.equal(await layer.evaluate((el) => getComputedStyle(el).pointerEvents), 'none');
    const toggle = page.getByRole('switch', { name: '背景动效', exact: true });
    assert.equal(await page.locator('main [data-ambient-toggle]').count(), 0);
    assert.equal(await page.locator('.footer [data-ambient-toggle]').count(), 1);
    await toggle.click();
    assert.equal(await layer.getAttribute('data-motion'), 'paused');
    await page.locator('.footer').getByRole('link', { name: '订阅文章', exact: true }).click();
    await page.waitForURL(`${baseUrl}/pages/subscribe.html`);
    assert.equal(await toggle.getAttribute('aria-checked'), 'false');
    await page.reload();
    await toggle.click();
    await page.locator('h1').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-ambient-layer]')?.dataset.motion === 'running');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('[data-ambient-layer]')?.dataset.motion === 'paused');
    assert.equal(await page.locator('[data-ambient-toggle]').isVisible(), false);
    assert.equal(await page.locator('.ambient-particle').first().evaluate((el) => getComputedStyle(el).animationName), 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-ambient-layer]')?.dataset.motion === 'paused');
    await page.goto(`${baseUrl}/index.html`);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('.ambient-particle:visible').count(), 6);
    assert.ok(await page.evaluate(() => document.querySelector('.profile-illustration-mobile').getBoundingClientRect().bottom <= document.querySelector('.living-profile .section-kicker').getBoundingClientRect().top + 1), 'mobile art must stay in its own row above the introduction text');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    for (const width of [1440, 992, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await toggle.scrollIntoViewIfNeeded();
      const bounds = await toggle.evaluate((el) => {
        const button = el.getBoundingClientRect();
        const footer = el.closest('.footer > .container').getBoundingClientRect();
        const copyright = el.closest('.footer-bottom').querySelector('p').getBoundingClientRect();
        return { contained: button.left >= footer.left && button.right <= footer.right && button.bottom <= footer.bottom, afterCopy: button.top >= copyright.bottom, normalFlow: !['absolute', 'fixed'].includes(getComputedStyle(el.parentElement).position), overflow: document.documentElement.scrollWidth - innerWidth };
      });
      assert.ok(bounds.contained && bounds.afterCopy && bounds.normalFlow && bounds.overflow <= 1, `footer motion control must stay in flow and within its container at ${width}px`);
    }
    await page.locator('.navbar').getByRole('link', { name: 'IrisSakura 首页', exact: true }).click();
    await page.goto(`${baseUrl}/pages/blog/runtime-consumption-facade-scope.html`);
    assert.equal(await page.locator('[data-ambient-layer]').count(), 0);
    assert.equal(await page.locator('[data-ambient-toggle]').isVisible(), false);
    await page.locator('.navbar').getByRole('link', { name: 'IrisSakura 首页', exact: true }).click();
    await page.waitForURL(`${baseUrl}/index.html`);
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-checked'), 'false', 'one listener after leaving and returning to an animated page');
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
  const staticContext = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
  try {
    const staticPage = await staticContext.newPage();
    await staticPage.goto(`${baseUrl}/index.html`);
    assert.equal(await staticPage.locator('.ambient-particle').first().evaluate((el) => getComputedStyle(el).animationPlayState), 'paused');
    assert.equal(await staticPage.locator('[data-ambient-toggle]').isVisible(), false);
  } finally { await staticContext.close(); }
}
