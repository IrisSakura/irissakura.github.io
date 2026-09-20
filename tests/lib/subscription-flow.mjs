import assert from 'node:assert/strict';

export async function assertSubscriptionFlow(browser, baseUrl, siteUrl) {
  const feedUrl = `${siteUrl}/rss.xml`;
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  try {
    const page = await context.newPage();
    await page.goto(`${baseUrl}/index.html`);
    await page.evaluate(() => { window.subscriptionNavigationProbe = true; });
    await page.locator('.footer').getByRole('link', { name: '订阅文章', exact: true }).click();
    await page.waitForURL(`${baseUrl}/pages/subscribe.html`);
    await page.getByRole('button', { name: '复制订阅地址' }).click();
    await page.waitForFunction(() => document.querySelector('[data-subscription-status]').textContent.includes('已复制'));
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), feedUrl);
    assert.equal(await page.evaluate(() => window.subscriptionNavigationProbe), true, 'subscription must work after soft navigation');

    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const geometry = await page.evaluate(() => {
        const input = document.querySelector('#subscription-url').getBoundingClientRect();
        const button = document.querySelector('[data-copy-subscription]').getBoundingClientRect();
        return { overflow: document.documentElement.scrollWidth - innerWidth, inputWidth: input.width, buttonWidth: button.width };
      });
      assert.ok(geometry.overflow <= 1 && geometry.inputWidth > 200 && geometry.buttonWidth > 80, `subscription layout at ${width}px`);
    }

    // Exercise denial and a browser without the Clipboard API on direct page loads.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); } } });
    });
    await page.reload();
    await page.getByRole('button', { name: '复制订阅地址' }).click();
    await page.waitForFunction(() => document.querySelector('[data-subscription-status]').textContent.includes('请手动复制'));
    assert.equal(await page.locator('#subscription-url').evaluate((input) => input.value.slice(input.selectionStart, input.selectionEnd)), feedUrl);
    assert.equal(await page.locator('[data-copy-subscription]').isEnabled(), true);
    await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: undefined }); });
    await page.getByRole('button', { name: '复制订阅地址' }).click();
    assert.equal(await page.locator('#subscription-url').evaluate((input) => input.selectionEnd - input.selectionStart), feedUrl.length);
    await page.getByRole('link', { name: '浏览全部文章', exact: true }).click();
    await page.waitForURL(`${baseUrl}/pages/blog.html`);
    await page.locator('main').getByRole('link', { name: '订阅文章', exact: true }).click();
    await page.waitForURL(`${baseUrl}/pages/subscribe.html`);
    await page.getByRole('button', { name: '复制订阅地址' }).click();
    await page.waitForFunction(() => document.querySelector('[data-subscription-status]').textContent.includes('请手动复制'));
  } finally {
    await context.close();
  }

  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await staticContext.newPage();
    await page.goto(`${baseUrl}/pages/subscribe.html`);
    assert.equal(await page.locator('#subscription-url').inputValue(), feedUrl);
    assert.equal(await page.locator('[data-copy-subscription]').isVisible(), false);
    await page.getByRole('link', { name: '浏览全部文章', exact: true }).click();
    await page.waitForURL(`${baseUrl}/pages/blog.html`);
  } finally {
    await staticContext.close();
  }
}
