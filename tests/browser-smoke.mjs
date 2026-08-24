import { chromium } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { access, mkdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [journalSource, blogPublication, blogTaxonomy, evidenceChains, projectData, consumerLab, frameworkQuickstart, siteData, themeConfig, sitemap] = await Promise.all([
  readJson('data/journal-source.json'),
  readJson('config/blog-publication.json'),
  readJson('data/blog-taxonomy.json'),
  readJson('data/evidence-chains.json'),
  readJson('data/projects.json'),
  readJson('data/consumer-lab.json'),
  readJson('data/framework-quickstart.json'),
  readJson('data/site.json'),
  readJson('data/themes.json'),
  readFile(path.join(root, 'sitemap.xml'), 'utf8')
]);
const indexedRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, location]) => new URL(location).pathname);
if (indexedRoutes.length === 0) throw new Error('sitemap does not expose any indexable routes');
const journalBlogsById = new Map(journalSource.blogs.map((article) => [article.id, article]));
const publishedBlogs = blogPublication.articles
  .filter((article) => ['approved', 'published'].includes(article.status))
  .map((article) => ({ ...journalBlogsById.get(article.sourceId), ...article }));
const routableBlogTags = blogTaxonomy.tags.filter((tag) => (
  publishedBlogs.filter((article) => article.tags.includes(tag.name)).length >= 2
));
const [representativeBlog] = publishedBlogs;
if (!representativeBlog) throw new Error('blog registry does not contain a representative complete article');
const gameProject = projectData.projects.find((project) => project.category === 'game');
if (!gameProject) throw new Error('project registry does not contain a game case');
const lightThemeContrastRoutes = [
  {
    route: '/',
    checks: [
      ['homepage profile title', '.profile-copy .hero-title'],
      ['homepage profile role', '.profile-role'],
      ['homepage profile introduction', '.profile-copy .hero-description'],
      ['homepage focus descriptions', '.focus-card > p:not(.focus-index)']
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
      ['Journal dashboard publication note', '.journal-metric small'],
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

  const sharedDesignSelectors = [
    'body',
    '.navbar',
    '.logo',
    '.nav-link',
    '.hero-title',
    '.btn-primary',
    '.profile-identity',
    '.profile-avatar-large',
    '.focus-card'
  ];
  const sharedDesignProperties = [
    'display',
    'position',
    'font-family',
    'font-size',
    'font-style',
    'font-weight',
    'line-height',
    'letter-spacing',
    'text-transform',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'gap',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'box-shadow',
    'filter',
    'opacity',
    'transform',
    'transition-duration',
    'transition-timing-function'
  ];
  const sharedPseudoProperties = [
    'content',
    'display',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'height',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'filter',
    'opacity',
    'transform'
  ];
  const designSnapshots = new Map();
  await lightThemePage.setViewportSize({ width: 1280, height: 900 });
  for (const theme of themeConfig.themes) {
    await lightThemePage.evaluate(
      ({ storageKey, value }) => localStorage.setItem(storageKey, value),
      { storageKey: themeConfig.storageKey, value: theme.id }
    );
    await lightThemePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    if (await documentTheme(lightThemePage) !== theme.id) {
      throw new Error(`Shared-design test did not activate ${theme.id}`);
    }
    designSnapshots.set(theme.id, await lightThemePage.evaluate(
      ({ selectors, properties, pseudoProperties }) => {
        const readProperties = (style, names) => Object.fromEntries(
          names.map((name) => [name, style.getPropertyValue(name)])
        );
        return {
          elements: Object.fromEntries(selectors.map((selector) => {
            const element = document.querySelector(selector);
            if (!element) throw new Error(`Missing shared-design selector ${selector}`);
            const rect = element.getBoundingClientRect();
            return [selector, {
              rect: {
                width: Number(rect.width.toFixed(3)),
                height: Number(rect.height.toFixed(3))
              },
              style: readProperties(getComputedStyle(element), properties)
            }];
          })),
          pseudoElements: Object.fromEntries([
            ['.hero-section::before', readProperties(
              getComputedStyle(document.querySelector('.hero-section'), '::before'),
              pseudoProperties
            )],
            ['.hero-section::after', readProperties(
              getComputedStyle(document.querySelector('.hero-section'), '::after'),
              pseudoProperties
            )]
          ])
        };
      },
      {
        selectors: sharedDesignSelectors,
        properties: sharedDesignProperties,
        pseudoProperties: sharedPseudoProperties
      }
    ));
  }
  const [designBaselineTheme] = themeConfig.themes;
  const designBaseline = JSON.stringify(designSnapshots.get(designBaselineTheme.id));
  const designDrift = themeConfig.themes
    .slice(1)
    .filter((theme) => JSON.stringify(designSnapshots.get(theme.id)) !== designBaseline)
    .map((theme) => theme.id);
  if (designDrift.length > 0) {
    throw new Error(
      `Themes must share typography, component geometry and pseudo-element design; drifted: ${designDrift.join(', ')}`
    );
  }
  await lightThemePage.close();

  const transitionPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await keepSmokeTestLocal(transitionPage);
  await transitionPage.emulateMedia({ reducedMotion: 'no-preference' });
  await transitionPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const transitionResult = await transitionPage.evaluate(async (registeredThemeIds) => {
    const root = document.documentElement;
    const select = document.querySelector('.theme-select');
    if (!(select instanceof HTMLSelectElement)) throw new Error('theme selector is unavailable');
    const initialTheme = root.dataset.theme ?? '';
    const targetTheme = registeredThemeIds.find((themeId) => themeId !== initialTheme);
    if (!targetTheme) throw new Error('theme transition needs at least two registered themes');
    const observations = [];
    const sample = () => {
      const overlay = document.querySelector('.theme-transition-overlay');
      observations.push({
        theme: root.dataset.theme ?? '',
        covering: overlay?.classList.contains('is-covering') ?? false,
        transitioning: root.classList.contains('theme-transitioning')
      });
    };
    const observer = new MutationObserver(sample);
    observer.observe(root, { attributes: true });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class']
    });
    const waitForSettledTheme = (themeId) => new Promise((resolve, reject) => {
      const timeout = window.setTimeout(
        () => {
          window.clearInterval(poll);
          reject(new Error(`theme ${themeId} did not settle: ${JSON.stringify({
            currentTheme: root.dataset.theme,
            rootClass: root.className,
            overlayClass: document.querySelector('.theme-transition-overlay')?.className,
            observations: observations.slice(-8)
          })}`));
        },
        3000
      );
      const poll = window.setInterval(() => {
        if (root.dataset.theme !== themeId || root.classList.contains('theme-transitioning')) return;
        window.clearTimeout(timeout);
        window.clearInterval(poll);
        resolve();
      }, 10);
    });
    const chooseTheme = (themeId) => {
      select.value = themeId;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const startedAt = performance.now();
    chooseTheme(targetTheme);
    await waitForSettledTheme(targetTheme);
    const duration = performance.now() - startedAt;
    const overlay = document.querySelector('.theme-transition-overlay');
    const normalTransition = {
      duration,
      hadCoverBeforeTheme: observations.some((entry) => (
        entry.theme === initialTheme && entry.covering
      )),
      themeChangedWhileCovered: observations.some((entry) => (
        entry.theme === targetTheme && entry.covering
      )),
      endedUncovered: !overlay?.classList.contains('is-covering')
        && !root.classList.contains('theme-transitioning')
    };

    chooseTheme(initialTheme);
    await new Promise((resolve) => window.setTimeout(resolve, 40));
    chooseTheme(targetTheme);
    await waitForSettledTheme(targetTheme);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    observer.disconnect();

    return {
      ...normalTransition,
      rapidExpectedTheme: targetTheme,
      rapidFinalTheme: root.dataset.theme,
      rapidTransitioning: root.classList.contains('theme-transitioning')
    };
  }, themeConfig.themes.map((theme) => theme.id));
  if (
    transitionResult.duration < 250
    || !transitionResult.hadCoverBeforeTheme
    || !transitionResult.themeChangedWhileCovered
    || !transitionResult.endedUncovered
  ) {
    throw new Error(`Theme fade sequence is incomplete: ${JSON.stringify(transitionResult)}`);
  }
  if (
    transitionResult.rapidFinalTheme !== transitionResult.rapidExpectedTheme
    || transitionResult.rapidTransitioning
  ) {
    throw new Error(`Rapid theme switching left stale state: ${JSON.stringify(transitionResult)}`);
  }
  await transitionPage.close();

  const responsiveContext = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const responsivePage = await responsiveContext.newPage();
  await keepSmokeTestLocal(responsivePage);
  const intermediateViewportFailures = [];
  for (const width of [1600, 1280, 992, 900, 769, 390]) {
    await responsivePage.setViewportSize({ width, height: 900 });
    await responsivePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    const containerGeometry = await responsivePage.locator('.hero-section .container').evaluate((container) => {
      const rect = container.getBoundingClientRect();
      return { left: rect.left, right: window.innerWidth - rect.right };
    });
    const minimumInset = width <= 400 ? 19 : Math.min(width * 0.049, 79);
    if (containerGeometry.left < minimumInset || containerGeometry.right < minimumInset) {
      intermediateViewportFailures.push(
        `${width}px content inset ${JSON.stringify(containerGeometry)} below ${minimumInset}px`
      );
    }
    if (width <= 768) continue;
    const navigationGeometry = await responsivePage.locator('.nav-container').evaluate((container) => {
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
    throw new Error(`responsive spacing or navigation failures:\n${intermediateViewportFailures.join('\n')}`);
  }
  await responsivePage.close();
  await responsiveContext.close();

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
  const profileDrawerTrigger = desktop.getByRole('button', {
    name: '打开 IrisSakura 快速导航',
    exact: true
  });
  await profileDrawerTrigger.click();
  const profileDrawer = desktop.locator('#profile-drawer');
  if (await profileDrawerTrigger.getAttribute('aria-expanded') !== 'true') {
    throw new Error('profile drawer trigger did not expose expanded state');
  }
  if (await profileDrawer.getAttribute('aria-hidden') !== 'false') {
    throw new Error('profile drawer did not expose its open state');
  }
  if (await desktop.locator('[data-profile-quick-link]').count() !== 5) {
    throw new Error('profile drawer does not expose all five quick routes');
  }
  const profileDrawerClose = desktop.getByRole('button', {
    name: '关闭快速导航',
    exact: true
  });
  if (!await profileDrawerClose.evaluate((button) => document.activeElement === button)) {
    throw new Error('opening the profile drawer did not move focus into the dialog');
  }
  await desktop.keyboard.press('Escape');
  if (await profileDrawer.getAttribute('aria-hidden') !== 'true') {
    throw new Error('Escape did not close the profile drawer');
  }
  if (!await profileDrawerTrigger.evaluate((button) => document.activeElement === button)) {
    throw new Error('closing the profile drawer did not restore trigger focus');
  }
  await desktop.evaluate(() => {
    document.documentElement.dataset.smokeDocument = 'persistent-navigation';
  });
  await desktop.locator('.nav-menu').getByRole('link', { name: '联系我', exact: true }).click();
  await desktop.waitForURL(`${baseUrl}/pages/contact.html`);
  if (await desktop.getAttribute('html', 'data-smoke-document') !== 'persistent-navigation') {
    throw new Error('cross-page navigation replaced the active document');
  }
  await desktop.locator('.logo').click();
  await desktop.waitForURL(`${baseUrl}/index.html`);
  if (await desktop.getAttribute('html', 'data-smoke-document') !== 'persistent-navigation') {
    throw new Error('return navigation replaced the active document');
  }
  await desktop.locator('.nav-menu').getByRole('link', { name: '框架', exact: true }).click();
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
  await desktop.locator('.profile-identity').waitFor();
  if (await desktop.locator('link[href$="/style/framework.css"]').count() !== 0) {
    throw new Error('history navigation retained a stale Framework page stylesheet');
  }
  if (await desktop.getAttribute('html', 'data-smoke-document') !== 'persistent-navigation') {
    throw new Error('history navigation replaced the active document');
  }
  await desktop.locator('.profile-hero-inner > [data-reveal].is-visible').first().waitFor();
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
  if (!await desktop.locator('.nav-menu .nav-link.active', { hasText: '框架' }).isVisible()) {
    throw new Error('Quickstart does not keep the Framework navigation context');
  }
  const quickstartDesktopOverflow = await desktop.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (quickstartDesktopOverflow > 1) {
    throw new Error(`Quickstart overflows the desktop viewport by ${quickstartDesktopOverflow}px`);
  }

  await desktop.goto(`${baseUrl}/pages/portfolio.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.portfolio-case').count() !== projectData.projects.length) throw new Error('portfolio does not expose every registered project');
  if (!await desktop.locator('.portfolio-case').first().filter({ hasText: gameProject.title }).isVisible()) throw new Error('registered game project is not the first portfolio case');
  if (await desktop.locator('.consumer-lab-card').count() !== consumerLab.cases.length) {
    throw new Error('portfolio does not expose every Consumer Lab project');
  }
  const consumerLabSection = desktop.locator('.consumer-lab');
  if (await consumerLabSection.locator('.consumer-lab-category').count() !== consumerLab.cases.length) {
    throw new Error('Consumer Lab project categories are incomplete');
  }
  if (await consumerLabSection.locator('.consumer-lab-highlights li').count() !== consumerLab.cases.length * 4) {
    throw new Error('Consumer Lab core-system highlights are incomplete');
  }
  if (await consumerLabSection.locator([
    '[data-consumer-commit]',
    '.consumer-lab-status',
    '.consumer-lab-baseline',
    '.consumer-lab-packages',
    '.consumer-lab-verification',
    '.consumer-lab-commit',
    '.consumer-lab-boundary',
    '.consumer-lab-disclaimer'
  ].join(', ')).count() !== 0) {
    throw new Error('Consumer Lab exposes owner-only evidence metadata');
  }

  await desktop.getByLabel('选择页面主题').selectOption('sakura-village');
  const portfolioInsetFailures = [];
  for (const viewport of [
    { width: 2048, height: 1200 },
    { width: 390, height: 844 }
  ]) {
    await desktop.setViewportSize(viewport);
    const caseInsets = await desktop.locator('.portfolio-case').evaluateAll((cases) => cases.map((portfolioCase) => {
      const caseRect = portfolioCase.getBoundingClientRect();
      const contentRects = [...portfolioCase.children].map((child) => child.getBoundingClientRect());
      return {
        left: Math.min(...contentRects.map((rect) => rect.left)) - caseRect.left,
        right: caseRect.right - Math.max(...contentRects.map((rect) => rect.right))
      };
    }));
    for (const [index, inset] of caseInsets.entries()) {
      if (inset.left < 19 || inset.right < 19) {
        portfolioInsetFailures.push(`${viewport.width}px case ${index + 1} inset ${JSON.stringify(inset)} below 19px`);
      }
    }
  }
  if (portfolioInsetFailures.length > 0) {
    throw new Error(`portfolio case content touches its section edge:\n${portfolioInsetFailures.join('\n')}`);
  }
  await desktop.setViewportSize({ width: 1280, height: 900 });

  await desktop.locator('.nav-menu').getByRole('link', { name: '美术音乐', exact: true }).click();
  await desktop.waitForURL(`${baseUrl}/pages/art-music.html`);
  if (await desktop.locator('meta[name="robots"][content^="noindex"]').count() !== 0) {
    throw new Error('public brand portfolio must remain indexable');
  }
  if (!await desktop.getByRole('heading', { name: '品牌视觉与创作', exact: true }).isVisible()) {
    throw new Error('art and music navigation does not open the public brand portfolio');
  }
  if (!await desktop.locator('#brand-system').isVisible()) {
    throw new Error('public brand portfolio does not expose its brand system');
  }

  await desktop.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
  const journalText = await desktop.locator('body').innerText();
  for (const forbidden of ['确定性目录条目', '稳定 ID', '同步来源固定为 Journal 提交', '按 Journal 固定提交导出']) {
    if (journalText.includes(forbidden)) throw new Error(`Journal exposes maintainer-only copy: ${forbidden}`);
  }
  if (await desktop.locator('.evidence-chain-card').count() !== evidenceChains.chains.length) {
    throw new Error('research page does not expose every reviewed evidence chain');
  }
  const journalTitleBoundaryFailures = [];
  for (const [viewportName, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }]
  ]) {
    await desktop.setViewportSize(viewport);
    for (const theme of themeConfig.themes) {
      await desktop.getByLabel('选择页面主题').selectOption(theme.id);
      const overflows = await desktop.locator('.journal-update-card h3, .design-summary-card h3').evaluateAll((headings) => (
        headings.flatMap((heading) => {
          const overflow = heading.scrollWidth - heading.clientWidth;
          return overflow > 1
            ? [{ text: heading.textContent?.trim(), overflow }]
            : [];
        })
      ));
      for (const overflow of overflows) {
        journalTitleBoundaryFailures.push(
          `${viewportName} ${theme.id} "${overflow.text}" overflows by ${overflow.overflow}px`
        );
      }
    }
  }
  if (journalTitleBoundaryFailures.length > 0) {
    throw new Error(`Journal card titles intrude into their horizontal padding:\n${journalTitleBoundaryFailures.join('\n')}`);
  }
  await desktop.setViewportSize({ width: 1280, height: 900 });

  await desktop.goto(`${baseUrl}/pages/blog.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.blog-card').count() !== publishedBlogs.length) throw new Error('blog index does not expose exactly the approved articles');
  if (await desktop.locator('.blog-series-list > a').count() !== blogTaxonomy.series.length) throw new Error('blog index series registry is incomplete');
  if (await desktop.locator('.blog-tag-list > a').count() !== routableBlogTags.length) throw new Error('blog index exposes the wrong tag route set');
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

  await mobile.goto(`${baseUrl}/pages/art-music.html`, { waitUntil: 'networkidle' });
  const brandMobileState = await mobile.evaluate(() => {
    const header = document.querySelector('.brand-header-slice img');
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      headerReady: header instanceof HTMLImageElement && header.complete && header.naturalWidth > 0
    };
  });
  if (brandMobileState.overflow > 1) {
    throw new Error(`Brand portfolio overflows the mobile viewport by ${brandMobileState.overflow}px`);
  }
  if (!brandMobileState.headerReady) {
    throw new Error('mobile brand portfolio did not load the V3 header slice');
  }
  if (process.env.SITE_SCREENSHOT_DIR) {
    await mobile.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'brand-mobile.png'), fullPage: true });
  }

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
