import assert from 'node:assert/strict';

export async function assertJournalPerformance(browser, baseUrl, index) {
  const expected = index.entries.filter(entry => entry.type === 'game-design').length;
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
    await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
      const region = page.locator('.journal-design-scroll');
      const cards = region.locator('.design-summary-card');
      assert.equal(await cards.count(), expected, 'the entire archive remains in the static document');
      const lastTitle = await cards.last().locator('h3').textContent();
      const heightBefore = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.locator('[data-page-index-link][href="#game-design-library"]').click();
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.journal-design-scroll')).opacity === '1');
      assert.equal(await cards.first().evaluate(el => getComputedStyle(el).opacity), '1', 'cards must be readable when the archive appears');
      assert.ok(Math.abs(await page.evaluate(() => document.documentElement.scrollHeight) - heightBefore) <= 2, 'materializing the archive must not shift the document extent');
      await region.focus();
      await page.keyboard.press('End');
      await page.waitForFunction(() => document.querySelector('.journal-design-scroll').scrollTop > 0);
      await cards.last().locator('a').first().focus();
      assert.equal(await cards.last().locator('a').first().evaluate(el => el === document.activeElement), true);
      assert.equal(await cards.last().evaluate(el => getComputedStyle(el).opacity), '1');
      assert.equal(await cards.count(), expected);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

      // Chromium's native text search must find content before the archive is rendered.
      await page.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      assert.equal(await page.evaluate(text => window.find(text), lastTitle.trim()), true);
      // window.find selects a match; the browser's Find UI also scrolls to it.
      await page.evaluate(() => getSelection()?.anchorNode?.parentElement?.scrollIntoView({
        block: 'center', behavior: 'instant'
      }));
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.journal-design-scroll')).opacity === '1');
      assert.equal(await page.evaluate(() => getSelection()?.toString()), lastTitle.trim());
      assert.ok(await cards.last().locator('h3').evaluate(el => {
        const rect = el.getBoundingClientRect();
        const region = el.closest('.journal-design-scroll').getBoundingClientRect();
        return rect.top >= Math.max(0, region.top) && rect.bottom <= Math.min(innerHeight, region.bottom);
      }), 'the found heading must be visible inside the scroll region and viewport');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await region.evaluate(el => getComputedStyle(el).opacity), '1');
      await page.emulateMedia({ media: 'print' });
      assert.equal(await cards.last().evaluate(el => getComputedStyle(el).contentVisibility), 'visible');
      assert.deepEqual(errors, []);
    } finally { await context.close(); }
  }

  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  await staticContext.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  try {
    const page = await staticContext.newPage();
    await page.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
    const region = page.locator('.journal-design-scroll');
    assert.equal(await region.locator('.design-summary-card').count(), expected);
    await region.locator('.design-summary-card').last().locator('a').first().focus();
    assert.equal(await region.evaluate(el => getComputedStyle(el).opacity), '1');
    assert.ok(await region.evaluate(el => el.scrollTop > 0));
  } finally { await staticContext.close(); }
}
