import AxeBuilder from '@axe-core/playwright';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROUTES = [
  '/', '/pages/development.html', '/pages/framework.html', '/pages/journal.html',
  '/pages/blog.html', '/pages/blog/authoritative-time-source.html', '/pages/contact.html'
];

export async function assertProductizationFlow(browser, baseUrl, root) {
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await blockExternal(desktop, baseUrl);
  await desktop.goto(baseUrl, { waitUntil: 'networkidle' });
  const opener = desktop.locator('[data-search-open]');
  await opener.focus();
  await desktop.keyboard.press('Control+k');
  const dialog = desktop.locator('[data-site-search]');
  if (!await dialog.isVisible()) throw new Error('Ctrl+K did not open global search');
  await desktop.locator('[data-search-input]').fill('Sakura');
  await desktop.locator('[data-search-results] a').first().waitFor();
  await desktop.keyboard.press('ArrowDown');
  if (!await desktop.locator('[data-search-results] a').first().evaluate((node) => node === document.activeElement)) {
    throw new Error('Search arrow navigation did not focus a result');
  }
  await desktop.keyboard.press('Escape');
  if (await dialog.isVisible() || !await opener.evaluate((node) => node === document.activeElement)) {
    throw new Error('Search Escape did not restore focus');
  }
  await opener.click();
  await desktop.locator('[data-search-input]').fill('SakuraGameFramework');
  await desktop.locator('[data-search-results] a[href="/pages/framework.html"]').click();
  await desktop.waitForURL('**/pages/framework.html');
  await desktop.locator('a[href*="framework-quickstart.html"]').first().click();
  await desktop.waitForURL('**/pages/framework-quickstart.html');

  await desktop.goto(`${baseUrl}/pages/blog/authoritative-time-source.html`, { waitUntil: 'networkidle' });
  const research = desktop.locator('[data-related-link][href*="metroidvania"]');
  if (!await research.count()) throw new Error('Article lacks evidence-backed related research');
  await research.click();
  await desktop.waitForURL('**/pages/journal/metroidvania.html');
  await desktop.goto(`${baseUrl}/pages/game.html`, { waitUntil: 'networkidle' });
  if (!await desktop.locator('[data-related-link][href*="authoritative-time-source"]').count()) {
    throw new Error('Project lacks related article from evidence chain');
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await blockExternal(mobile, baseUrl);
  await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
  await mobile.locator('[data-search-open]').click();
  await mobile.locator('[data-search-input]').fill('对象池');
  const moduleResult = mobile.locator('[data-search-result="framework:pooling"]');
  await moduleResult.waitFor();
  await moduleResult.click();
  await mobile.waitForURL('**/pages/framework.html#module-pooling');

  const missing = await browser.newPage();
  await blockExternal(missing, baseUrl);
  await missing.route('**/data/site-search-index.json', (route) => route.abort());
  await missing.goto(baseUrl, { waitUntil: 'networkidle' });
  await missing.locator('[data-search-open]').click();
  await missing.getByText('搜索暂时不可用', { exact: false }).waitFor();
  if (!await missing.locator('main h1').count()) throw new Error('Search failure removed page content');

  const noJs = await browser.newPage({ javaScriptEnabled: false });
  await blockExternal(noJs, baseUrl);
  for (const route of ['/', '/pages/development.html', '/pages/framework.html', '/pages/contact.html']) {
    await noJs.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
    if (!await noJs.locator('main h1').count()) throw new Error(`No-JS primary content missing: ${route}`);
  }
  await noJs.close();

  await assertResponsiveSizes(browser, baseUrl);
  await assertAnalyticsFixture(browser, baseUrl);
  await assertAccessibility(browser, baseUrl);
  await assertPerformance(browser, baseUrl, root);
  await Promise.all([desktop.close(), mobile.close(), missing.close()]);
}

async function assertResponsiveSizes(browser, baseUrl) {
  const sizes = [
    [360, 800], [390, 844], [430, 932], [768, 1024], [1024, 768],
    [1280, 800], [1440, 900], [1728, 1117], [1920, 1080]
  ];
  const page = await browser.newPage();
  await blockExternal(page, baseUrl);
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await assertNoOverflow(page, `home ${width}x${height}`);
    await page.locator('[data-search-open]').click();
    const dialog = await page.locator('[data-site-search]').boundingBox();
    if (!dialog || dialog.x < -1 || dialog.x + dialog.width > width + 1) {
      throw new Error(`Search dialog overflows ${width}x${height}`);
    }
    if (process.env.SITE_SCREENSHOT_DIR) {
      await mkdir(process.env.SITE_SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, `phase1-search-${width}.png`) });
    }
    await page.keyboard.press('Escape');
  }
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: width === 360 ? 800 : 900 });
    for (const route of ['/pages/blog/authoritative-time-source.html', '/pages/framework.html',
      '/pages/journal.html', '/pages/game.html', '/pages/contact.html']) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      await assertNoOverflow(page, `${route} at ${width}`);
    }
  }
  await page.close();
}

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) throw new Error(`${label} has ${overflow}px horizontal overflow`);
}

async function assertAnalyticsFixture(browser, baseUrl) {
  const page = await browser.newPage();
  await blockExternal(page, baseUrl);
  const payloads = [];
  await page.route('https://plausible.io/api/event', (route) => {
    payloads.push(JSON.parse(route.request().postData()));
    return route.fulfill({ status: 202, body: '' });
  });
  await page.route(`${baseUrl}/`, async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    const config = {
      enabled: true, provider: 'plausible', siteDomain: 'irissakura.github.io',
      endpoint: 'https://plausible.io/api/event', privacyMode: true,
      trackPageViews: true, trackOutboundLinks: true
    };
    return route.fulfill({ response, body: html.replace(
      /<script type="application\/json" id="site-analytics-config">[^<]+<\/script>/u,
      `<script type="application/json" id="site-analytics-config">${JSON.stringify(config)}</script>`
    ) });
  });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('[data-search-open]').click();
  await page.locator('[data-search-input]').fill('SakuraGameFramework');
  await page.waitForTimeout(450);
  await page.locator('[data-search-results] a[href="/pages/framework.html"]').click();
  await page.waitForURL('**/pages/framework.html');
  const related = page.locator('[data-related-link]').first();
  if (await related.count()) await related.click();
  const names = payloads.map((payload) => payload.name);
  for (const required of ['pageview', 'navigation.search_open', 'navigation.search_query', 'navigation.search_result_open']) {
    if (!names.includes(required)) throw new Error(`Analytics fixture missed ${required}`);
  }
  if (!names.includes('content.related_open')) throw new Error('Analytics fixture missed related navigation');
  for (const payload of payloads) {
    const raw = JSON.stringify(payload);
    if (/[?@#]|Sakura|queryText|email|qq/i.test(payload.url)) throw new Error('Analytics URL contains unsafe data');
    if (/queryText|@|\/Users\//iu.test(JSON.stringify(payload.props ?? {}))) throw new Error('Analytics sent private properties');
    if (payload.domain !== 'irissakura.github.io' || !payload.url.startsWith(baseUrl)) throw new Error(`Invalid analytics payload ${raw}`);
  }
  await page.close();
}

async function blockExternal(page, baseUrl) {
  await page.route('**/*', (route) => route.request().url().startsWith(baseUrl)
    ? route.continue() : route.abort('blockedbyclient'));
}

async function assertAccessibility(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await blockExternal(page, baseUrl);
  const violations = [];
  for (const route of ROUTES) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    violations.push(...await scanAxe(page, route));
  }
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('[data-search-open]').click();
  violations.push(...await scanAxe(page, 'search dialog'));
  await context.close();
  if (violations.length) throw new Error(`Accessibility violations:\n${violations.join('\n')}`);
}

async function scanAxe(page, label) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const serious = result.violations.filter((entry) => ['serious', 'critical'].includes(entry.impact));
  return serious.map((entry) => `${label}: ${entry.id}: ${entry.nodes.map((node) =>
    `${node.target.join(' ')} ${node.failureSummary ?? ''}`).join(' | ')}`);
}

async function assertPerformance(browser, baseUrl, root) {
  const budget = JSON.parse(await readFile(path.join(root, 'config/performance-budget.json'), 'utf8'));
  const report = [];
  const indexBytes = (await stat(path.join(root, 'data/site-search-index.json'))).size;
  const exceeded = [];
  for (const route of ROUTES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await blockExternal(page, baseUrl);
    await page.addInitScript(() => {
      window.__siteQuality = { cls: 0, lcp: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__siteQuality.cls += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length) window.__siteQuality.lcp = entries.at(-1).startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    const requested = [];
    page.on('requestfinished', (request) => { if (request.url().startsWith(baseUrl)) requested.push(request.url()); });
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    let searchInteractionMs;
    if (route === '/') {
      const started = performance.now();
      await page.locator('[data-search-open]').click();
      await page.locator('[data-search-input]').fill('对象池');
      await page.locator('[data-search-result="framework:pooling"]').waitFor();
      searchInteractionMs = Math.round(performance.now() - started);
    }
    const metrics = { route, htmlBytes: 0, cssBytes: 0, jsBytes: 0, imageBytes: 0,
      requestCount: requested.length, searchIndexBytes: indexBytes, largestAssetBytes: 0,
      ...(searchInteractionMs !== undefined ? { searchInteractionMs } : {}),
      ...await page.evaluate(() => ({ cls: window.__siteQuality?.cls ?? 0, lcpLabMs: window.__siteQuality?.lcp ?? 0,
        navigationMs: performance.getEntriesByType('navigation')[0]?.duration ?? 0 })) };
    for (const url of requested) {
      const pathname = new URL(url).pathname;
      const file = path.join(root, pathname === '/' ? 'index.html' : pathname.slice(1));
      const size = (await stat(file)).size;
      const extension = path.extname(file).toLowerCase();
      const bucket = extension === '.html' ? 'htmlBytes' : extension === '.css' ? 'cssBytes'
        : extension === '.js' ? 'jsBytes' : ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'].includes(extension) ? 'imageBytes' : null;
      if (bucket) metrics[bucket] += size;
      metrics.largestAssetBytes = Math.max(metrics.largestAssetBytes, size);
    }
    report.push(metrics);
    for (const key of ['htmlBytes', 'cssBytes', 'jsBytes', 'imageBytes', 'requestCount', 'searchIndexBytes', 'largestAssetBytes', 'cls']) {
      if (metrics[key] > budget[key]) exceeded.push(`${route} ${key}: ${metrics[key]} > ${budget[key]}`);
    }
    await page.close();
  }
  const output = path.join(root, 'tests/output/performance-baseline.json');
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify({ measuredAt: new Date().toISOString(), budget, pages: report }, null, 2)}\n`);
  if (exceeded.length) throw new Error(`Performance budget exceeded: ${exceeded.join('; ')}`);
}
