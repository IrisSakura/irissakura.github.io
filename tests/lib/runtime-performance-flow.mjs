import assert from 'node:assert/strict';

export async function assertRuntimePerformance(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'));
    assert.equal(await page.locator('.profile-identity').evaluate(el => getComputedStyle(el).opacity), '1', 'initial content must not wait for reveal animation');
    assert.equal(await page.locator('link[href*="fonts.googleapis.com"][rel="stylesheet"]').getAttribute('media'), 'print', 'failed optional fonts must not block content');
    assert.equal(await page.locator('link[href$="dist/styles/site.css"]').count(), 1);
    await page.locator('.writing-entry').first().scrollIntoViewIfNeeded();
    await page.locator('.writing-entry.is-visible').first().waitFor();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('[data-reveal]').first().evaluate(el => getComputedStyle(el).opacity), '1');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.evaluate(() => { document.documentElement.dataset.performanceDocument = 'persistent'; });

    let releaseStyle;
    const heldStyle = new Promise(resolve => { releaseStyle = resolve; });
    let requestedStyle;
    const styleRequested = new Promise(resolve => { requestedStyle = resolve; });
    await page.route('**/style/portfolio.css', async route => {
      requestedStyle();
      await heldStyle;
      await route.continue();
    });
    await page.locator('.nav-menu a').filter({ hasText: /^作品$/u }).click();
    await styleRequested;
    const secondResponse = page.waitForResponse(response => response.url().endsWith('/pages/portfolio.html'));
    await page.locator('.nav-menu a').filter({ hasText: /^作品$/u }).click();
    await secondResponse;
    await page.waitForTimeout(100);
    assert.equal(new URL(page.url()).pathname, '/', 'a newer navigation must await a shared pending stylesheet');
    assert.equal(await page.locator('main h1').textContent(), '你好，我是 IrisSakura');
    releaseStyle();
    await page.waitForURL('**/pages/portfolio.html');
    assert.equal(await page.locator('link[href$="style/portfolio.css"]').count(), 1);
    assert.equal(await page.locator('html').getAttribute('data-performance-document'), 'persistent');
    // Exercise the first search after changing the persistent document's route.
    await page.locator('[data-search-open]').click();
    await page.locator('[data-search-input]').fill('SakuraGameFramework');
    await page.locator('[data-search-results] a[href="/pages/framework.html"]').waitFor();
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('[data-site-search]')?.open);

    let frameworkRequests = 0;
    let searchRequests = 0;
    page.on('request', request => {
      if (request.url().endsWith('/data/framework-public.json')) frameworkRequests++;
      if (request.url().endsWith('/data/search-index.json')) searchRequests++;
    });
    const visit = async (label, pathname) => {
      await page.locator('.footer').getByRole('link', { name: label, exact: true }).click();
      await page.waitForURL(`**${pathname}`);
    };
    await visit('SakuraGameFramework', '/pages/framework.html');
    await page.waitForSelector('#framework-module-list[data-framework-loaded="true"]');
    await visit('Myosotis', '/pages/journal.html');
    await page.waitForFunction(() => document.querySelector('[data-content-search-status]')?.textContent.includes('找到'));
    await visit('SakuraGameFramework', '/pages/framework.html');
    await page.waitForSelector('#framework-module-list[data-framework-loaded="true"]');
    await visit('Myosotis', '/pages/journal.html');
    await page.waitForFunction(() => document.querySelector('[data-content-search-status]')?.textContent.includes('找到'));
    assert.equal(frameworkRequests, 1, 'revisiting Framework reuses the successful snapshot');
    assert.equal(searchRequests, 1, 'revisiting Journal reuses the successful index');
    await page.locator('[data-content-search-query]').fill('Unity');
    assert.ok(await page.locator('[data-content-search-results] article').count());
    assert.deepEqual(errors, []);
  } finally { await context.close(); }

  // A destination module may finish after the user has already left that page.
  const lateContext = await browser.newContext();
  await lateContext.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  const latePage = await lateContext.newPage();
  try {
    await latePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await latePage.evaluate(() => {
      window.__completedNavigations = [];
      document.addEventListener('site:navigation-complete', event => window.__completedNavigations.push(event.detail.url));
    });
    let releaseModule;
    const heldModule = new Promise(resolve => { releaseModule = resolve; });
    let requestedModule;
    const moduleRequested = new Promise(resolve => { requestedModule = resolve; });
    await latePage.route('**/dist/framework.js', async route => {
      requestedModule();
      await heldModule;
      await route.continue();
    });
    await latePage.locator('.footer').getByRole('link', { name: 'SakuraGameFramework', exact: true }).click();
    await moduleRequested;
    await latePage.locator('.nav-menu').getByRole('link', { name: '文章', exact: true }).click();
    await latePage.waitForURL('**/pages/blog.html');
    releaseModule();
    await latePage.waitForLoadState('networkidle');
    assert.deepEqual(await latePage.evaluate(() => window.__completedNavigations.map(url => new URL(url).pathname)), ['/pages/blog.html'], 'late modules cannot complete obsolete navigations');
  } finally { await lateContext.close(); }

  const fontsContext = await browser.newContext();
  let releaseFonts;
  const fontsReady = new Promise(resolve => { releaseFonts = resolve; });
  await fontsContext.route('**/*', async route => {
    const url = route.request().url();
    if (url.startsWith(baseUrl)) return route.continue();
    if (url.startsWith('https://fonts.googleapis.com/')) {
      await fontsReady;
      return route.fulfill({ contentType: 'text/css', body: '/* delayed optional font stylesheet */' });
    }
    return route.abort();
  });
  try {
    const fontsPage = await fontsContext.newPage();
    await fontsPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    const fontStyle = fontsPage.locator('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
    assert.equal(await fontStyle.getAttribute('media'), 'print', 'pending optional fonts cannot block first content');
    assert.equal(await fontsPage.locator('.profile-identity').evaluate(el => getComputedStyle(el).opacity), '1');
    releaseFonts();
    await fontsPage.waitForFunction(() => document.querySelector('link[rel="stylesheet"][href*="fonts.googleapis.com"]')?.media === 'all');
    await fontsPage.locator('.nav-menu').getByRole('link', { name: '作品', exact: true }).click();
    await fontsPage.waitForURL('**/pages/portfolio.html');
    assert.equal(await fontStyle.count(), 1, 'soft navigation keeps one optional stylesheet');
  } finally { releaseFonts(); await fontsContext.close(); }
}
