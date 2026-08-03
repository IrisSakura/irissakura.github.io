import { chromium } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { access, mkdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [journalSource, blogPublication, blogTaxonomy, evidenceChains, projectData, frameworkQuickstart, siteData, themeConfig, layoutConfig, sitemap] = await Promise.all([
  readJson('data/journal-source.json'),
  readJson('config/blog-publication.json'),
  readJson('data/blog-taxonomy.json'),
  readJson('data/evidence-chains.json'),
  readJson('data/projects.json'),
  readJson('data/framework-quickstart.json'),
  readJson('data/site.json'),
  readJson('data/themes.json'),
  readJson('data/layouts.json'),
  readFile(path.join(root, 'sitemap.xml'), 'utf8')
]);
const indexedRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, location]) => new URL(location).pathname);
if (indexedRoutes.length === 0) throw new Error('sitemap does not expose any indexable routes');
const journalBlogsById = new Map(journalSource.blogs.map((article) => [article.id, article]));
const publishedBlogs = blogPublication.articles
  .filter((article) => ['approved', 'published'].includes(article.status))
  .map((article) => ({ ...journalBlogsById.get(article.sourceId), ...article }));
const [representativeBlog] = publishedBlogs;
if (!representativeBlog) throw new Error('blog registry does not contain a representative complete article');
const gameProject = projectData.projects.find((project) => project.category === 'game');
if (!gameProject) throw new Error('project registry does not contain a game case');
const lightThemeContrastRoutes = [
  {
    route: '/',
    checks: [
      ['homepage project proof title', '.hero-proof figcaption strong'],
      ['homepage project proof metadata', '.hero-proof figcaption small'],
      ['homepage method labels', '.method-chain > li > span'],
      ['homepage case labels', '.case-list > article > span']
    ]
  },
  {
    route: '/pages/framework.html',
    readySelector: '#framework-module-list[data-framework-loaded="true"]',
    checks: [
      ['Framework module result count', '#framework-module-result-count'],
      ['Framework stack highlight', '.stack-layer.highlight-layer'],
      ['Framework active module filter', '.module-filter.is-active'],
      ['Framework layer metric labels', '.layer-metrics span'],
      ['Framework lifecycle package count', '#framework-lifecycle-detail-count'],
      ['Framework lifecycle package share', '#framework-lifecycle-detail-share'],
      ['Framework adoption column headings', '.adoption-table thead th'],
      ['Framework adoption row headings', '.adoption-table tbody th']
    ]
  },
  {
    route: '/pages/framework-quickstart.html',
    checks: [
      ['Quickstart hero duration', '.quickstart-hero-summary strong'],
      ['Quickstart route package names', '.quickstart-package-sequence code'],
      ['Quickstart timeline markers', '.quickstart-step-marker'],
      ['Quickstart completion labels', '.quickstart-done strong'],
      ['Quickstart Preview badge', '.preview-badge']
    ]
  },
  {
    route: '/pages/journal.html',
    checks: [
      ['Journal back link', '.journal-back'],
      ['Journal dashboard label', '.journal-dashboard-label'],
      ['Journal dashboard values', '.journal-metric strong'],
      ['Journal dashboard metric labels', '.journal-metric span'],
      ['Evidence chain heading', '.evidence-chain-card h3'],
      ['Evidence chain question', '.evidence-chain-question'],
      ['Evidence chain path', '.evidence-chain-path strong'],
      ['Evidence chain boundary', '.evidence-chain-limit']
    ]
  },
  {
    route: '/pages/game.html',
    checks: [
      ['Game back link', '.game-back'],
      ['Game screenshot caption', '.game-hero-visual figcaption strong'],
      ['Game fact labels', '.game-facts dt']
    ]
  },
  {
    route: '/pages/portfolio.html',
    checks: [
      ['Portfolio cover description', '.portfolio-header p:not(.section-kicker)']
    ]
  },
  {
    route: '/pages/blog.html',
    checks: [
      ['Blog cover description', '.blog-hero > .container > p:not(.section-kicker)'],
      ['Blog series card', '.blog-series-list > a'],
      ['Blog tag chip', '.blog-tag-list > a']
    ]
  },
  {
    route: '/pages/contact.html',
    checks: [
      ['Contact cover description', '.contact-header p:not(.section-kicker)']
    ]
  }
];
const server = createServer(async (request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
  let filePath = path.resolve(root, `.${requestPath === '/' ? '/index.html' : requestPath}`);
  if (!filePath.startsWith(root + path.sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(filePath)).isDirectory()) filePath = path.join(filePath, 'index.html');
    await access(filePath);
    response.writeHead(200, { 'Content-Type': contentType(filePath) });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    createReadStream(path.join(root, '404.html')).pipe(response);
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('failed to bind static test server');
const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  const lightThemePage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await keepSmokeTestLocal(lightThemePage);
  await lightThemePage.emulateMedia({ reducedMotion: 'reduce' });
  await lightThemePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const lightThemeIds = themeConfig.themes
    .filter((theme) => theme.colorScheme === 'light')
    .map((theme) => theme.id);
  if (lightThemeIds.length === 0) throw new Error('theme registry does not contain a light theme');
  const contrastViewports = [
    ['desktop', { width: 1280, height: 900 }],
    ['mobile', { width: 390, height: 844 }]
  ];
  const contrastFailures = [];
  for (const [viewportName, viewport] of contrastViewports) {
    await lightThemePage.setViewportSize(viewport);
    for (const themeId of lightThemeIds) {
      await lightThemePage.evaluate(
        ({ storageKey, value }) => localStorage.setItem(storageKey, value),
        { storageKey: themeConfig.storageKey, value: themeId }
      );
      for (const routeContract of lightThemeContrastRoutes) {
        await lightThemePage.goto(`${baseUrl}${routeContract.route}`, { waitUntil: 'networkidle' });
        if (await documentTheme(lightThemePage) !== themeId) {
          throw new Error(`Light-theme contrast test did not activate ${themeId} on ${routeContract.route}`);
        }
        if (routeContract.readySelector) {
          await lightThemePage.locator(routeContract.readySelector).waitFor();
        }
        for (const [label, selector] of routeContract.checks) {
          const measurements = await measureTextContrast(lightThemePage, selector);
          if (measurements.length === 0) {
            contrastFailures.push(
              `${viewportName} ${themeId} ${routeContract.route} ${label}: no visible matches for ${selector}`
            );
            continue;
          }
          for (const measurement of measurements) {
            const foreground = compositeColor(measurement.foreground, measurement.background);
            const ratio = contrastRatio(foreground, measurement.background);
            if (ratio < 4.5) {
              contrastFailures.push(
                `${viewportName} ${themeId} ${routeContract.route} ${label} "${measurement.text}" `
                + `${ratio.toFixed(2)}:1 (${measurement.foregroundCss} on ${formatColor(measurement.background)})`
              );
            }
          }
        }
      }
    }
  }
  if (contrastFailures.length > 0) {
    throw new Error(`Light-theme text contrast failures:\n${contrastFailures.join('\n')}`);
  }
  await lightThemePage.close();

  const layoutContext = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const layoutPage = await layoutContext.newPage();
  await keepSmokeTestLocal(layoutPage);
  await layoutPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const layoutSelect = layoutPage.getByLabel('选择页面布局');
  const themeSelect = layoutPage.getByLabel('选择页面主题');
  if (await layoutSelect.count() !== 1) throw new Error('layout selector is missing from the shared navigation');
  for (const layout of layoutConfig.layouts) {
    if (await layoutSelect.locator(`option[value="${layout.id}"]`).count() !== 1) {
      throw new Error(`layout selector is missing registered option ${layout.id}`);
    }
  }
  await themeSelect.selectOption('sakura-village');
  await layoutSelect.selectOption('standard');
  const standardGeometry = await layoutPage.locator('.hero-section .hero').evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height
  }));
  await layoutSelect.selectOption('compact');
  const compactGeometry = await layoutPage.locator('.hero-section .hero').evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height
  }));
  await layoutSelect.selectOption('wide');
  const wideGeometry = await layoutPage.locator('.hero-section .hero').evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height
  }));
  if (!(compactGeometry.width < standardGeometry.width && compactGeometry.height < standardGeometry.height)) {
    throw new Error(`compact layout did not reduce homepage geometry: ${JSON.stringify({ standardGeometry, compactGeometry })}`);
  }
  if (!(wideGeometry.width > standardGeometry.width && wideGeometry.height > standardGeometry.height)) {
    throw new Error(`wide layout did not expand homepage geometry: ${JSON.stringify({ standardGeometry, wideGeometry })}`);
  }
  if (await documentTheme(layoutPage) !== 'sakura-village') {
    throw new Error('switching layouts changed the active theme');
  }
  await themeSelect.selectOption('night');
  if (await layoutPage.getAttribute('html', 'data-layout') !== 'wide') {
    throw new Error('switching themes changed the active layout');
  }
  const storedPreferences = await layoutPage.evaluate(({ themeKey, layoutKey }) => ({
    theme: localStorage.getItem(themeKey),
    layout: localStorage.getItem(layoutKey)
  }), {
    themeKey: themeConfig.storageKey,
    layoutKey: layoutConfig.storageKey
  });
  if (storedPreferences.theme !== 'night' || storedPreferences.layout !== 'wide') {
    throw new Error(`theme and layout preferences were not stored independently: ${JSON.stringify(storedPreferences)}`);
  }
  const layoutSyncPage = await layoutContext.newPage();
  await keepSmokeTestLocal(layoutSyncPage);
  await layoutSyncPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  if (await layoutSyncPage.getAttribute('html', 'data-layout') !== 'wide') {
    throw new Error('a second page did not restore the current layout preference');
  }
  await layoutSelect.selectOption('compact');
  await layoutSyncPage.waitForFunction(() => document.documentElement.dataset.layout === 'compact');
  await layoutSyncPage.getByLabel('选择页面布局').selectOption('wide');
  await layoutPage.waitForFunction(() => document.documentElement.dataset.layout === 'wide');
  if (await documentTheme(layoutPage) !== 'night' || await documentTheme(layoutSyncPage) !== 'night') {
    throw new Error('cross-tab layout synchronization changed the active theme');
  }
  await layoutSyncPage.close();
  await layoutPage.reload({ waitUntil: 'networkidle' });
  if (
    await documentTheme(layoutPage) !== 'night'
    || await layoutPage.getAttribute('html', 'data-layout') !== 'wide'
    || await layoutPage.getByLabel('选择页面布局').inputValue() !== 'wide'
  ) {
    throw new Error('stored theme and layout were not restored before runtime initialization');
  }
  await layoutPage.locator('.nav-menu').getByRole('link', { name: '关于', exact: true }).click();
  await layoutPage.waitForURL(`${baseUrl}/pages/about.html`);
  if (await layoutPage.getAttribute('html', 'data-layout') !== 'wide') {
    throw new Error('soft navigation reset the active layout');
  }
  const activeLayoutStyles = await layoutPage.locator('[data-layout-stylesheet]').evaluateAll((stylesheets) => (
    stylesheets.filter((stylesheet) => stylesheet instanceof HTMLLinkElement && !stylesheet.disabled)
      .map((stylesheet) => stylesheet.getAttribute('href'))
  ));
  if (activeLayoutStyles.length !== 1 || !activeLayoutStyles[0]?.endsWith('/style/layout-wide.css')) {
    throw new Error(`soft navigation did not preserve the wide layout stylesheet: ${JSON.stringify(activeLayoutStyles)}`);
  }
  await layoutPage.getByLabel('选择页面布局').selectOption(layoutConfig.default);
  await layoutPage.getByLabel('选择页面主题').selectOption('system');
  const intermediateViewportFailures = [];
  for (const width of [1280, 992, 900, 769]) {
    await layoutPage.setViewportSize({ width, height: 900 });
    await layoutPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    const navigationGeometry = await layoutPage.locator('.nav-container').evaluate((container) => {
      const logo = container.querySelector('.logo')?.getBoundingClientRect();
      const menu = container.querySelector('.nav-menu')?.getBoundingClientRect();
      const actions = container.querySelector('.nav-actions')?.getBoundingClientRect();
      return {
        logoRight: logo?.right ?? 0,
        menuLeft: menu?.left ?? 0,
        menuRight: menu?.right ?? 0,
        actionsLeft: actions?.left ?? 0,
        actionsRight: actions?.right ?? 0,
        viewportWidth: window.innerWidth
      };
    });
    if (
      navigationGeometry.logoRight > navigationGeometry.menuLeft
      || navigationGeometry.menuRight > navigationGeometry.actionsLeft
      || navigationGeometry.actionsRight > navigationGeometry.viewportWidth
    ) {
      intermediateViewportFailures.push(`${width}px ${JSON.stringify(navigationGeometry)}`);
    }
  }
  if (intermediateViewportFailures.length > 0) {
    throw new Error(`layout selector causes intermediate navigation overlap:\n${intermediateViewportFailures.join('\n')}`);
  }
  await layoutPage.close();
  await layoutContext.close();

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await keepSmokeTestLocal(desktop);
  for (const route of indexedRoutes) {
    const response = await desktop.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`${route} returned ${response?.status()}`);
    if (await desktop.locator('main#main-content').count() !== 1) throw new Error(`${route} lacks one main landmark`);
  }
  await desktop.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  if (await desktop.locator('[data-bgm-player], [data-bgm-audio], [data-bgm-toggle]').count() !== 0) {
    throw new Error('homepage still ships the retired BGM player');
  }
  await desktop.evaluate(() => {
    document.documentElement.dataset.smokeDocument = 'persistent-navigation';
  });
  await desktop.locator('.nav-menu').getByRole('link', { name: '关于', exact: true }).click();
  await desktop.waitForURL(`${baseUrl}/pages/about.html`);
  if (await desktop.getAttribute('html', 'data-smoke-document') !== 'persistent-navigation') {
    throw new Error('cross-page navigation replaced the active document');
  }
  await desktop.locator('.logo').click();
  await desktop.waitForURL(`${baseUrl}/index.html`);
  if (await desktop.getAttribute('html', 'data-smoke-document') !== 'persistent-navigation') {
    throw new Error('return navigation replaced the active document');
  }
  await desktop.locator('.nav-menu').getByRole('link', { name: 'Framework', exact: true }).click();
  await desktop.waitForURL(`${baseUrl}/pages/framework.html`);
  await desktop.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
  if (await desktop.locator('#framework-data-status, #framework-source-commit, #framework-generated-at').count() !== 0) {
    throw new Error('Framework page still exposes maintainer-only source metadata');
  }
  if (await desktop.locator('link[href$="/style/framework.css"]').count() !== 1) {
    throw new Error('soft navigation did not load the Framework page stylesheet');
  }
  await desktop.evaluate(() => history.back());
  await desktop.waitForURL(`${baseUrl}/index.html`);
  await desktop.locator('.hero-content').waitFor();
  if (await desktop.locator('link[href$="/style/framework.css"]').count() !== 0) {
    throw new Error('history navigation retained a stale Framework page stylesheet');
  }
  if (await desktop.getAttribute('html', 'data-smoke-document') !== 'persistent-navigation') {
    throw new Error('history navigation replaced the active document');
  }
  await desktop.locator('.hero-content > [data-reveal].is-visible').first().waitFor();
  if (await desktop.locator('.depth-card').count() === 0) throw new Error('shared depth treatment was not applied');
  await desktop.evaluate(() => window.scrollTo(0, 240));
  await desktop.waitForFunction(() => document.querySelector('.navbar')?.classList.contains('scrolled'));
  await desktop.locator('.research-row').first().scrollIntoViewIfNeeded();
  await desktop.locator('.research-row.is-visible').first().waitFor();

  const reducedMotionContext = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce'
  });
  const reducedMotionPage = await reducedMotionContext.newPage();
  await keepSmokeTestLocal(reducedMotionPage);
  await reducedMotionPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const reducedMotionState = await reducedMotionPage.locator('[data-reveal]').first().evaluate((element) => ({
    visible: element.classList.contains('is-visible'),
    opacity: getComputedStyle(element).opacity,
    motionReady: document.documentElement.classList.contains('motion-ready')
  }));
  if (!reducedMotionState.visible || reducedMotionState.opacity !== '1' || reducedMotionState.motionReady) {
    throw new Error('reduced-motion visitors do not receive immediately visible content');
  }
  await reducedMotionContext.close();

  if (process.env.SITE_SCREENSHOT_DIR) {
    await mkdir(process.env.SITE_SCREENSHOT_DIR, { recursive: true });
    await desktop.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'home-desktop.png'), fullPage: true });
    await desktop.goto(`${baseUrl}/pages/framework.html`, { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'framework-desktop.png'), fullPage: true });
    await desktop.goto(`${baseUrl}/pages/framework-quickstart.html`, { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'framework-quickstart-desktop.png'), fullPage: true });
  }

  await desktop.goto(`${baseUrl}/pages/framework-quickstart.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.quickstart-step').count() !== frameworkQuickstart.steps.length) {
    throw new Error('Quickstart does not render every registered step');
  }
  if (await desktop.locator('.quickstart-code pre').count() !== frameworkQuickstart.steps.filter((step) => step.code).length) {
    throw new Error('Quickstart does not render every registered code probe');
  }
  if (!await desktop.locator('.nav-menu .nav-link.active', { hasText: 'Framework' }).isVisible()) {
    throw new Error('Quickstart does not keep the Framework navigation context');
  }
  const quickstartDesktopOverflow = await desktop.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (quickstartDesktopOverflow > 1) {
    throw new Error(`Quickstart overflows the desktop viewport by ${quickstartDesktopOverflow}px`);
  }

  await desktop.goto(`${baseUrl}/pages/portfolio.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.portfolio-case').count() !== projectData.projects.length) throw new Error('portfolio does not expose every registered project');
  if (!await desktop.locator('.portfolio-case').first().filter({ hasText: gameProject.title }).isVisible()) throw new Error('registered game project is not the first portfolio case');

  await desktop.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
  const journalText = await desktop.locator('body').innerText();
  for (const forbidden of ['确定性目录条目', '稳定 ID', '同步来源固定为 Journal 提交', '按 Journal 固定提交导出']) {
    if (journalText.includes(forbidden)) throw new Error(`Journal exposes maintainer-only copy: ${forbidden}`);
  }
  if (await desktop.locator('.evidence-chain-card').count() !== evidenceChains.chains.length) {
    throw new Error('research page does not expose every reviewed evidence chain');
  }

  await desktop.goto(`${baseUrl}/pages/blog.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.blog-card').count() !== publishedBlogs.length) throw new Error('blog index does not expose exactly the approved articles');
  if (await desktop.locator('.blog-series-list > a').count() !== blogTaxonomy.series.length) throw new Error('blog index series registry is incomplete');
  if (await desktop.locator('.blog-tag-list > a').count() !== blogTaxonomy.tags.length) throw new Error('blog index tag registry is incomplete');
  if (await desktop.locator('a[href="../rss.xml"]').count() !== 1) throw new Error('blog index RSS route is missing');
  const blogIndexText = await desktop.locator('body').innerText();
  if (blogIndexText.includes('来源提交') || blogIndexText.includes('经过登记与安全检查')) {
    throw new Error('blog index exposes the internal publication pipeline');
  }
  const representativeSeries = blogTaxonomy.series.find((entry) => entry.name === representativeBlog.series);
  await desktop.goto(`${baseUrl}/pages/blog/series/${representativeSeries.slug}.html`, { waitUntil: 'networkidle' });
  if (!await desktop.getByRole('heading', { level: 1, name: representativeSeries.name }).isVisible()) {
    throw new Error('representative series route is not visible');
  }
  if (!await desktop.locator('.nav-menu .nav-link.active', { hasText: '研究与文章' }).isVisible()) {
    throw new Error('series route does not keep the research navigation context');
  }
  await desktop.goto(`${baseUrl}/pages/blog.html`, { waitUntil: 'networkidle' });
  await desktop.locator(`.blog-card a[href="blog/${encodeURIComponent(representativeBlog.slug)}.html"]`).click();
  await desktop.getByRole('heading', {
    level: 1,
    name: representativeBlog.title,
    exact: true
  }).waitFor({ state: 'visible' });
  if (!await desktop.locator('.blog-prose').isVisible()) throw new Error('complete blog body is not visible');
  if (await desktop.locator('.blog-source-note').count() !== 0) throw new Error('blog article exposes a generator source note');
  if (await desktop.locator('.related-articles a').count() !== 3) throw new Error('complete blog article does not expose three related routes');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await keepSmokeTestLocal(mobile);
  await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  if (await mobile.locator('[data-bgm-player], [data-bgm-audio], [data-bgm-toggle]').count() !== 0) {
    throw new Error('mobile homepage still ships the retired BGM player');
  }
  const toggle = mobile.locator('.mobile-toggle');
  const mobileLayoutSelect = mobile.getByLabel('选择页面布局');
  if (!await mobileLayoutSelect.isVisible()) throw new Error('mobile layout selector is not visible');
  const mobileLayoutControl = await mobile.locator('.layout-picker').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  if (mobileLayoutControl.width < 44 || mobileLayoutControl.height < 44) {
    throw new Error(`mobile layout selector is smaller than the touch target: ${JSON.stringify(mobileLayoutControl)}`);
  }
  await mobileLayoutSelect.selectOption('compact');
  if (await mobile.getAttribute('html', 'data-layout') !== 'compact') {
    throw new Error('mobile layout selector did not apply the selected preset');
  }
  if (await toggle.getAttribute('aria-label') !== '打开导航菜单') throw new Error('mobile menu lacks its initial accessible name');
  if (!await toggle.isVisible()) {
    const mobileState = await mobile.evaluate(() => {
      const element = document.querySelector('.mobile-toggle');
      return {
        innerWidth: window.innerWidth,
        mediaMatches: window.matchMedia('(max-width: 768px)').matches,
        display: element ? getComputedStyle(element).display : 'missing',
        styleSheets: Array.from(document.styleSheets).map((sheet) => sheet.href)
      };
    });
    throw new Error(`mobile menu is not visible: ${JSON.stringify(mobileState)}`);
  }
  await toggle.click();
  if (await toggle.getAttribute('aria-expanded') !== 'true') throw new Error('mobile menu did not expose expanded state');
  if (await toggle.getAttribute('aria-label') !== '关闭导航菜单') throw new Error('mobile menu did not update its accessible name');
  await mobile.keyboard.press('Escape');
  if (await toggle.getAttribute('aria-expanded') !== 'false') throw new Error('Escape did not close mobile menu');

  await mobile.goto(`${baseUrl}/pages/framework-quickstart.html`, { waitUntil: 'networkidle' });
  const quickstartMobileState = await mobile.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    steps: document.querySelectorAll('.quickstart-step').length,
    codeBlocks: document.querySelectorAll('.quickstart-code pre').length
  }));
  if (quickstartMobileState.overflow > 1) {
    throw new Error(`Quickstart overflows the mobile viewport by ${quickstartMobileState.overflow}px`);
  }
  if (quickstartMobileState.steps !== frameworkQuickstart.steps.length) {
    throw new Error('mobile Quickstart does not expose every registered step');
  }
  if (quickstartMobileState.codeBlocks !== frameworkQuickstart.steps.filter((step) => step.code).length) {
    throw new Error('mobile Quickstart does not expose every registered code probe');
  }
  if (process.env.SITE_SCREENSHOT_DIR) {
    await mobile.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'framework-quickstart-mobile.png'), fullPage: true });
  }

  await mobile.goto(`${baseUrl}/pages/contact.html`, { waitUntil: 'networkidle' });
  const contactNavLink = mobile.locator('.nav-menu').getByRole('link', { name: '联系我', exact: true });
  if (await contactNavLink.count() !== 1) throw new Error('Contact navigation is not labeled 联系我');
  if ((await contactNavLink.getAttribute('class'))?.split(/\s+/).includes('nav-cta')) {
    throw new Error('Contact navigation still has special CTA styling');
  }
  const expectedContactCards = siteData.contacts.length + siteData.socials.length;
  if (await mobile.locator('.public-route-card').count() !== expectedContactCards) throw new Error('direct contacts or verified public routes are missing');
  for (const contact of siteData.contacts) {
    if (!await mobile.getByText(contact.value, { exact: true }).isVisible()) throw new Error(`direct contact is missing: ${contact.id}`);
    if (contact.href && !await mobile.locator(`.direct-contact-card[href="${contact.href}"]`).isVisible()) throw new Error(`direct contact link is missing: ${contact.id}`);
  }
  for (const social of siteData.socials) {
    if (!await mobile.locator(`.public-route-card[href="${social.url}"]`).isVisible()) throw new Error(`verified public route is missing: ${social.id}`);
  }
  if (!await mobile.getByRole('heading', { name: '适合交流的主题' }).isVisible()) throw new Error('discussion scope is missing');
  if (!await mobile.getByText(siteData.independenceNotice, { exact: true }).isVisible()) throw new Error('personal and employer boundary is missing');
  if (await mobile.getByRole('heading', { name: '当前公开沟通边界' }).count() !== 0) {
    throw new Error('Contact page exposes the owner-only communication boundary');
  }
  if (process.env.SITE_SCREENSHOT_DIR) {
    await mobile.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'contact-mobile.png'), fullPage: true });
  }

  console.log('Browser smoke passed: routes, persistent navigation, complete blog publishing, evidence-led portfolio, mobile navigation and contact routes checked.');
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

function contentType(filePath) {
  const extension = path.extname(filePath);
  return {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mp3': 'audio/mpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  }[extension] ?? 'application/octet-stream';
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

async function keepSmokeTestLocal(page) {
  await page.route('**/*', (route) => (
    route.request().url().startsWith(baseUrl)
      ? route.continue()
      : route.abort('blockedbyclient')
  ));
}

function compositeColor(foreground, background) {
  return {
    red: foreground.red * foreground.alpha + background.red * (1 - foreground.alpha),
    green: foreground.green * foreground.alpha + background.green * (1 - foreground.alpha),
    blue: foreground.blue * foreground.alpha + background.blue * (1 - foreground.alpha),
    alpha: 1
  };
}

function contrastRatio(left, right) {
  const luminance = (color) => {
    const channels = [color.red, color.green, color.blue].map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const brighter = Math.max(luminance(left), luminance(right));
  const darker = Math.min(luminance(left), luminance(right));
  return (brighter + 0.05) / (darker + 0.05);
}

function documentTheme(page) {
  return page.evaluate(() => document.documentElement.dataset.theme);
}

async function measureTextContrast(page, selector) {
  const measurements = await page.locator(selector).evaluateAll((elements) => {
    const parseColor = (value) => {
      const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return {
        red: channels[0] ?? 0,
        green: channels[1] ?? 0,
        blue: channels[2] ?? 0,
        alpha: channels[3] ?? 1
      };
    };
    const composite = (foreground, background) => ({
      red: foreground.red * foreground.alpha + background.red * (1 - foreground.alpha),
      green: foreground.green * foreground.alpha + background.green * (1 - foreground.alpha),
      blue: foreground.blue * foreground.alpha + background.blue * (1 - foreground.alpha),
      alpha: foreground.alpha + background.alpha * (1 - foreground.alpha)
    });
    return elements.flatMap((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (
        style.display === 'none'
        || style.visibility !== 'visible'
        || Number(style.opacity) < 0.1
        || rect.width <= 1
        || rect.height <= 1
      ) {
        return [];
      }
      const ancestors = [];
      for (let current = element; current; current = current.parentElement) ancestors.unshift(current);
      let background = { red: 255, green: 255, blue: 255, alpha: 1 };
      for (const ancestor of ancestors) {
        background = composite(parseColor(getComputedStyle(ancestor).backgroundColor), background);
      }
      return [{
        text: (element.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 80),
        foregroundCss: style.color,
        foreground: parseColor(style.color),
        background
      }];
    });
  });
  return measurements;
}

function formatColor(color) {
  return `rgb(${color.red.toFixed(0)}, ${color.green.toFixed(0)}, ${color.blue.toFixed(0)})`;
}
