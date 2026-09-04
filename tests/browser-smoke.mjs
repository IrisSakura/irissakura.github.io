import { chromium } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { access, mkdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [journalSource, blogPublication, blogTaxonomy, contentSearchIndex, evidenceChains, evidenceChainAuthorities, projectData, irisEngineering, consumerLab, frameworkQuickstart, frameworkStory, frameworkEngineering, frameworkArchitecture, frameworkEvidence, frameworkCaseStudies, frameworkEvolution, frameworkKnowledgeGraph, frameworkModuleReference, frameworkEvidenceAuthorities, siteData, themeConfig, sitemap] = await Promise.all([
  readJson('data/journal-source.json'),
  readJson('config/blog-publication.json'),
  readJson('data/blog-taxonomy.json'),
  readJson('data/search-index.json'),
  readJson('data/evidence-chains.json'),
  readJson('config/evidence-chain-authorities.json'),
  readJson('data/projects.json'),
  readJson('data/iris-engineering.json'),
  readJson('data/consumer-lab.json'),
  readJson('data/framework-quickstart.json'),
  readJson('data/framework-story.json'),
  readJson('data/framework-engineering.json'),
  readJson('data/framework-architecture.json'),
  readJson('data/framework-evidence.json'),
  readJson('data/framework-case-studies.json'),
  readJson('data/framework-evolution.json'),
  readJson('data/framework-knowledge-graph.json'),
  readJson('data/framework-module-reference.json'),
  readJson('tests/contracts/framework-evidence-authorities.json'),
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
const gameProject = projectData.projects.find((project) => project.id === 'sword-of-words');
if (!gameProject) throw new Error('project registry does not contain the flagship game case');
const normalizedGodotQuery = 'godot';
const godotSearchCount = contentSearchIndex.entries.filter((entry) => (
  [entry.title, entry.summary, entry.typeLabel, entry.series, ...entry.tags, ...entry.engines]
    .join(' ')
    .normalize('NFKC')
    .toLocaleLowerCase('zh-CN')
    .includes(normalizedGodotQuery)
)).length;

async function assertEvidenceChainPage(page, route, viewportName) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  if (await page.locator('.evidence-chain-card').count() !== evidenceChains.chains.length) {
    throw new Error(`${viewportName} ${route} does not expose every reviewed evidence chain`);
  }
  const state = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    columns: getComputedStyle(document.querySelector('.evidence-chain-path')).gridTemplateColumns.split(/\s+/u).length,
    relationshipColumns: getComputedStyle(document.querySelector('.evidence-chain-relationships')).gridTemplateColumns.split(/\s+/u).length,
    chains: [...document.querySelectorAll('.evidence-chain-card')].map((card) => ({
      id: card.id,
      segments: [...card.querySelectorAll('.evidence-chain-path > *')].map((segment) => segment.querySelector(':scope > span')?.textContent?.trim()),
      workflowTargets: card.querySelectorAll('a[href^="engineering.html#workflow-"]').length,
      capabilityTargets: card.querySelectorAll('a[href^="engineering.html#capability-"]').length,
      frameworkTargets: card.querySelectorAll('a[href="framework.html#game-adoption"]').length,
      gameTargets: card.querySelectorAll('a[href^="game.html#"]').length
    }))
  }));
  if (state.overflow > 1) throw new Error(`${viewportName} ${route} evidence chain overflows by ${state.overflow}px`);
  const expectedSegments = ['RESEARCH', 'CONTROL PLANE', 'FRAMEWORK', 'GAME'];
  for (const [index, chain] of state.chains.entries()) {
    if (chain.id !== `evidence-chain-${evidenceChains.chains[index].id}`) throw new Error(`${viewportName} ${route} evidence chain order drifted`);
    if (JSON.stringify(chain.segments) !== JSON.stringify(expectedSegments)) throw new Error(`${viewportName} ${route} has wrong evidence chain segments`);
    if (chain.workflowTargets !== 3 || chain.capabilityTargets !== 1 || chain.frameworkTargets !== 1 || chain.gameTargets !== 1) {
      throw new Error(`${viewportName} ${route} has incomplete evidence chain targets`);
    }
    for (const relationship of Object.values(evidenceChainAuthorities.relationships)) {
      const cardText = await page.locator(`#${chain.id}`).innerText();
      if (!cardText.includes(relationship)) throw new Error(`${viewportName} ${route} is missing relationship text`);
    }
  }
  const expectedColumns = viewportName === 'desktop' ? 4 : 1;
  if (state.columns !== expectedColumns) throw new Error(`${viewportName} ${route} evidence chain uses ${state.columns} columns, expected ${expectedColumns}`);
  const expectedRelationshipColumns = viewportName === 'desktop' ? 3 : 1;
  if (state.relationshipColumns !== expectedRelationshipColumns) throw new Error(`${viewportName} ${route} relationship section uses ${state.relationshipColumns} columns, expected ${expectedRelationshipColumns}`);
}

const brandContrastRoutes = [
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
    route: '/pages/engineering.html',
    checks: [
      ['Engineering hero description', '.engineering-hero-inner > div > p:last-child'],
      ['Engineering status', '.engineering-status p'],
      ['Engineering workflow descriptions', '.engineering-workflow li > span:last-child'],
      ['Engineering capability descriptions', '.engineering-capability-card > p'],
      ['Engineering evidence descriptions', '.engineering-evidence-card p'],
      ['Engineering boundary descriptions', '.engineering-boundaries li']
    ]
  },
  {
    route: '/pages/framework.html',
    readySelector: '#framework-module-list[data-framework-loaded="true"]',
    checks: [
      ['Framework positioning summary', '#positioning .framework-story-intro p'],
      ['Framework story chip', '.framework-story-chip'],
      ['Framework architecture map title', '#architecture-map h2'],
      ['Framework architecture status', '.framework-map-branch-unity .framework-map-status'],
      ['Framework architecture boundary', '.framework-map-boundaries article h3'],
      ['Framework pillar title', '.framework-pillar h3'],
      ['Framework reference card', '.framework-reference-card strong'],
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
    route: '/pages/framework-engineering.html',
    checks: [
      ['Framework Engineering hero description', '.framework-engineering-hero-copy > p:not(.section-kicker)'],
      ['Framework Engineering depth cards', '.framework-depth-card h3'],
      ['Framework Engineering reader cards', '.framework-reader-card h3'],
      ['Framework Engineering domain cards', '.framework-domain-card h3'],
      ['Framework Engineering evidence cards', '.framework-evidence-authority-card p'],
      ['Framework Engineering adoption routes', '.framework-adoption-route-card strong']
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
  if (themeConfig.id !== 'iris-sakura' || themeConfig.colorScheme !== 'light') {
    throw new Error('single-brand registry is not IRIS × SAKURA light');
  }
  const brandPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await keepSmokeTestLocal(brandPage);
  await brandPage.emulateMedia({ reducedMotion: 'reduce' });
  const contrastViewports = [
    ['desktop', { width: 1280, height: 900 }],
    ['mobile', { width: 390, height: 844 }]
  ];
  const contrastFailures = [];
  for (const [viewportName, viewport] of contrastViewports) {
    await brandPage.setViewportSize(viewport);
    for (const routeContract of brandContrastRoutes) {
      await brandPage.goto(`${baseUrl}${routeContract.route}`, { waitUntil: 'networkidle' });
      const shell = await brandPage.evaluate(() => ({
        brand: document.documentElement.dataset.brand,
        themeControls: document.querySelectorAll('.theme-select, .theme-picker, .theme-transition-overlay').length
      }));
      if (shell.brand !== 'iris-sakura' || shell.themeControls !== 0) {
        throw new Error(`Single-brand shell drifted on ${routeContract.route}: ${JSON.stringify(shell)}`);
      }
      if (routeContract.readySelector) {
        await brandPage.locator(routeContract.readySelector).waitFor();
      }
      for (const [label, selector] of routeContract.checks) {
        const measurements = await measureTextContrast(brandPage, selector);
        if (measurements.length === 0) {
          contrastFailures.push(
            `${viewportName} ${routeContract.route} ${label}: no visible matches for ${selector}`
          );
          continue;
        }
        for (const measurement of measurements) {
          const foreground = compositeColor(measurement.foreground, measurement.background);
          const ratio = contrastRatio(foreground, measurement.background);
          if (ratio < 4.5) {
            contrastFailures.push(
              `${viewportName} ${routeContract.route} ${label} "${measurement.text}" `
              + `${ratio.toFixed(2)}:1 (${measurement.foregroundCss} on ${formatColor(measurement.background)})`
            );
          }
        }
      }
    }
  }
  if (contrastFailures.length > 0) {
    throw new Error(`Single-brand text contrast failures:\n${contrastFailures.join('\n')}`);
  }
  await brandPage.close();

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
    if (width <= 900) {
      const compactNavigation = await responsivePage.locator('.nav-container').evaluate((container) => {
        const menu = container.querySelector('.nav-menu');
        const toggle = container.querySelector('.mobile-toggle');
        const menuRect = menu?.getBoundingClientRect();
        return {
          menuPosition: menu ? getComputedStyle(menu).position : 'missing',
          menuRight: menuRect?.right ?? Number.POSITIVE_INFINITY,
          toggleDisplay: toggle ? getComputedStyle(toggle).display : 'missing'
        };
      });
      if (
        compactNavigation.menuPosition !== 'fixed'
        || compactNavigation.menuRight > 1
        || compactNavigation.toggleDisplay === 'none'
      ) {
        intermediateViewportFailures.push(`${width}px compact navigation ${JSON.stringify(compactNavigation)}`);
      }
      continue;
    }
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
  if (await desktop.locator('[data-profile-quick-link]').count() !== 6) {
    throw new Error('profile drawer does not expose all six quick routes');
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
  await desktop.locator('.nav-menu').getByRole('link', { name: '联系', exact: true }).click();
  await desktop.waitForURL(`${baseUrl}/pages/contact.html`);
  if (await desktop.getAttribute('html', 'data-smoke-document') !== 'persistent-navigation') {
    throw new Error('cross-page navigation replaced the active document');
  }
  await desktop.locator('.logo').click();
  await desktop.waitForURL(`${baseUrl}/index.html`);
  if (await desktop.getAttribute('html', 'data-smoke-document') !== 'persistent-navigation') {
    throw new Error('return navigation replaced the active document');
  }
  await desktop.locator('.nav-menu').getByRole('link', { name: '研发体系', exact: true }).click();
  await desktop.waitForURL(`${baseUrl}/pages/development.html`);
  if (await desktop.locator('.development-card').count() !== 2) {
    throw new Error('Development hub does not present two equal sibling routes');
  }
  await desktop.getByRole('link', { name: '进入 Sakura Framework', exact: true }).click();
  await desktop.waitForURL(`${baseUrl}/pages/framework.html`);
  await desktop.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
  if (await desktop.locator('.framework-story-chip').count() !== frameworkStory.positioning.claims.length) {
    throw new Error('Framework positioning claims are incomplete');
  }
  if (await desktop.locator('.framework-map-layer').count() !== frameworkStory.architectureMap.layers.length) {
    throw new Error('Framework architecture map layers are incomplete');
  }
  if (await desktop.locator('.framework-pillar').count() !== frameworkStory.pillars.length) {
    throw new Error('Framework engineering pillars are incomplete');
  }
  if (await desktop.locator('.framework-reference-card').count() !== frameworkStory.reference.items.length) {
    throw new Error('Framework technical reference entries are incomplete');
  }
  const frameworkStoryState = await desktop.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    storyText: document.querySelector('#main-content')?.innerText ?? '',
    referenceAnchors: [...document.querySelectorAll('.framework-reference-card')].map((card) => card.getAttribute('href'))
  }));
  if (frameworkStoryState.overflow > 1) {
    throw new Error(`Framework story overflows the desktop viewport by ${frameworkStoryState.overflow}px`);
  }
  for (const phrase of ['Portable Core', 'Godot Parallel Preview', 'Godot Runtime Host', 'local-passed / runner-pending']) {
    if (!frameworkStoryState.storyText.includes(phrase)) throw new Error(`Framework story is missing ${phrase}`);
  }
  if (frameworkStoryState.storyText.includes('Godot Runtime Supported')) {
    throw new Error('Framework story overclaims Godot Runtime support');
  }
  if (JSON.stringify(frameworkStoryState.referenceAnchors) !== JSON.stringify(frameworkStory.reference.items.map((item) => item.href))) {
    throw new Error('Framework reference anchors drifted from the story contract');
  }
  if (await desktop.getAttribute('html', 'data-brand-mode') !== 'sakura') {
    throw new Error('soft navigation retained a stale Engineering brand mode');
  }
  if (await desktop.locator('meta[name="theme-color"]').getAttribute('content') !== '#fff0f7') {
    throw new Error('soft navigation retained a stale Engineering theme color');
  }
  if (await desktop.locator('.skip-link').getAttribute('href') !== `${baseUrl}/pages/framework.html#main-content`) {
    throw new Error('soft navigation retained a stale skip-link URL');
  }
  if (await desktop.locator('#framework-data-status, #framework-source-commit, #framework-generated-at').count() !== 0) {
    throw new Error('Framework page still exposes maintainer-only source metadata');
  }
  if (await desktop.locator('link[href$="/style/framework.css"]').count() !== 1) {
    throw new Error('soft navigation did not load the Framework page stylesheet');
  }
  const frameworkEngineeringPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await keepSmokeTestLocal(frameworkEngineeringPage);
  await frameworkEngineeringPage.goto(`${baseUrl}/pages/framework-engineering.html`, { waitUntil: 'networkidle' });
  if (await frameworkEngineeringPage.locator('.framework-depth-card').count() !== frameworkEngineering.depthModel.length
    || await frameworkEngineeringPage.locator('.framework-reader-card').count() !== frameworkEngineering.readerPaths.length
    || await frameworkEngineeringPage.locator('.framework-domain-card').count() !== frameworkEngineering.domains.length) {
    throw new Error('Framework Engineering Hub does not expose the complete depth, reader, and domain contract');
  }
  const frameworkEngineeringState = await frameworkEngineeringPage.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    title: document.title,
    text: document.querySelector('#main-content')?.innerText ?? '',
    pageIndex: [...document.querySelectorAll('[data-page-index-link]')].map((link) => link.getAttribute('href')),
    routeLinks: [...document.querySelectorAll('.framework-adoption-route-card')].map((link) => link.getAttribute('href')),
    themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
    statusValueColor: getComputedStyle(document.querySelector('.framework-engineering-status-row strong')).color,
    secondaryActionColor: getComputedStyle(document.querySelector('.framework-actions .btn-secondary')).color
  }));
  if (frameworkEngineeringState.overflow > 1) {
    throw new Error(`Framework Engineering Hub overflows the desktop viewport by ${frameworkEngineeringState.overflow}px`);
  }
  if (frameworkEngineeringState.title !== frameworkEngineering.positioning.seoTitle) {
    throw new Error('Framework Engineering page title drifted from the closed SEO contract');
  }
  if (frameworkEngineeringState.themeColor !== '#fff0f7'
    || frameworkEngineeringState.statusValueColor !== 'rgb(255, 250, 255)'
    || frameworkEngineeringState.secondaryActionColor !== 'rgb(184, 47, 108)') {
    throw new Error('Framework Engineering page drifted from the IRIS × SAKURA palette or lost dark-surface contrast');
  }
  const normalizedEngineeringText = frameworkEngineeringState.text.toLocaleUpperCase('en-US');
  for (const phrase of ['D0 · Signal', 'D1 · System', 'D2 · Architecture', 'D3 · Evidence', 'Understand Sakura', 'Explore Engineering', 'Start Using', 'local-passed / runner-pending', 'Production: unknown', 'Implemented']) {
    if (!normalizedEngineeringText.includes(phrase.toLocaleUpperCase('en-US'))) throw new Error(`Framework Engineering Hub is missing ${phrase}`);
  }
  if (JSON.stringify(frameworkEngineeringState.pageIndex) !== JSON.stringify(['#depth-model', '#reader-paths', '#architecture-domains', '#evidence-boundary', '#adoption-route'])) {
    throw new Error('Framework Engineering page index order drifted');
  }
  for (const href of [frameworkEngineering.links.framework, frameworkEngineering.links.quickstart, `${frameworkEngineering.links.portfolio}#consumer-lab`, frameworkEngineering.links.cases, frameworkEngineering.links.knowledge, frameworkEngineering.links.reference, frameworkEngineering.links.home]) {
    if (!frameworkEngineeringState.routeLinks.includes(href)) throw new Error(`Framework Engineering Hub is missing route ${href}`);
  }
  if (frameworkEngineeringState.text.includes('href="pages/')) {
    throw new Error('Framework Engineering Hub contains an invalid nested page route');
  }
  const frameworkDeepRoutes = [
    ...frameworkArchitecture.pages.map((entry) => entry.route),
    ...frameworkEvidence.pages.map((entry) => entry.route),
    ...frameworkCaseStudies.cases.map((entry) => entry.route),
    frameworkEvolution.route,
    frameworkKnowledgeGraph.route,
    frameworkModuleReference.route
  ];
  if (frameworkDeepRoutes.length !== 18) throw new Error('Framework deep route topology must contain exactly 18 pages');
  for (const route of frameworkDeepRoutes) {
    await frameworkEngineeringPage.goto(`${baseUrl}/${route}`, { waitUntil: 'networkidle' });
    const state = await frameworkEngineeringPage.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll('h1').length,
      indexes: document.querySelectorAll('[data-page-index-link]').length,
      next: document.querySelectorAll('#next-route a').length,
      text: document.querySelector('#main-content')?.innerText ?? ''
    }));
    if (state.overflow > 1) throw new Error(`${route} overflows the desktop viewport by ${state.overflow}px`);
    if (state.h1 !== 1 || state.indexes < 3 || state.next < 2) throw new Error(`${route} has an incomplete deep-page shell`);
    if (state.text.includes('undefined') || state.text.includes('/Users/')) throw new Error(`${route} exposes unresolved or private content`);
  }
  await frameworkEngineeringPage.goto(`${baseUrl}/pages/framework/decisions.html`, { waitUntil: 'networkidle' });
  if (await frameworkEngineeringPage.locator('.framework-decision-card').count() !== 10
    || await frameworkEngineeringPage.locator('.framework-decision-card section').count() !== 70) {
    throw new Error('Architecture Decisions page does not expose ten seven-section decisions');
  }
  for (const caseStudy of frameworkCaseStudies.cases) {
    await frameworkEngineeringPage.goto(`${baseUrl}/${caseStudy.route}`, { waitUntil: 'networkidle' });
    if (await frameworkEngineeringPage.locator('.framework-case-sections > .container > section').count() !== 12) throw new Error(`${caseStudy.id} does not expose twelve sections`);
  }
  await frameworkEngineeringPage.goto(`${baseUrl}/pages/framework/evidence.html`, { waitUntil: 'networkidle' });
  if (await frameworkEngineeringPage.locator('.framework-evidence-ladder > li').count() !== frameworkEvidenceAuthorities.levels.length) throw new Error('Evidence page does not expose the full eight-level ladder');
  await frameworkEngineeringPage.goto(`${baseUrl}/pages/framework/consumers.html`, { waitUntil: 'networkidle' });
  if (await frameworkEngineeringPage.locator('.framework-consumer-card').count() !== consumerLab.cases.length) throw new Error('Consumer Matrix does not expose all reviewed snapshots');
  await frameworkEngineeringPage.goto(`${baseUrl}/pages/framework/reference.html`, { waitUntil: 'networkidle' });
  if (await frameworkEngineeringPage.locator('.framework-module-reference-card').count() !== frameworkModuleReference.modules.length) throw new Error('Module Reference does not expose every curated module');
  await frameworkEngineeringPage.close();
  await desktop.evaluate(() => history.back());
  await desktop.waitForURL(`${baseUrl}/index.html`);
  await desktop.locator('.profile-identity').waitFor();
  if (await desktop.getAttribute('html', 'data-brand-mode') !== 'master') {
    throw new Error('history navigation retained a stale Framework brand mode');
  }
  if (await desktop.locator('meta[name="theme-color"]').getAttribute('content') !== '#f4efff') {
    throw new Error('history navigation retained a stale Framework theme color');
  }
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
    await desktop.goto(`${baseUrl}/pages/engineering.html`, { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'engineering-desktop.png'), fullPage: true });
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
  if (!await desktop.locator('.nav-menu .nav-link.active', { hasText: '研发体系' }).isVisible()) {
    throw new Error('Quickstart does not keep the 研发体系 navigation context');
  }
  const quickstartDesktopOverflow = await desktop.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (quickstartDesktopOverflow > 1) {
    throw new Error(`Quickstart overflows the desktop viewport by ${quickstartDesktopOverflow}px`);
  }

  await desktop.goto(`${baseUrl}/pages/engineering.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.engineering-workflow li').count() !== irisEngineering.workflow.length) {
    throw new Error('Engineering page does not expose every reviewed workflow step');
  }
  if (await desktop.locator('.engineering-capability-card').count() !== irisEngineering.capabilities.length) {
    throw new Error('Engineering page does not expose every reviewed capability group');
  }
  if (await desktop.locator('.engineering-evidence-card').count() !== irisEngineering.evidence.length) {
    throw new Error('Engineering page does not expose every reviewed evidence boundary');
  }
  const engineeringDesktopState = await desktop.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    text: document.body.innerText
  }));
  if (engineeringDesktopState.overflow > 1) {
    throw new Error(`Engineering page overflows the desktop viewport by ${engineeringDesktopState.overflow}px`);
  }
  for (const forbidden of ['/Users/', '154.37.215.57', 'external-read-passed']) {
    if (engineeringDesktopState.text.includes(forbidden)) {
      throw new Error(`Engineering page exposes private or overstated text: ${forbidden}`);
    }
  }
  for (const route of ['/pages/engineering.html', '/pages/framework.html', '/pages/journal.html', '/pages/game.html']) {
    await assertEvidenceChainPage(desktop, route, 'desktop');
  }

  await desktop.goto(`${baseUrl}/pages/portfolio.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.portfolio-case').count() !== projectData.projects.length) throw new Error('portfolio does not expose every registered project');
  if (!await desktop.locator('.portfolio-case').first().filter({ hasText: gameProject.title }).isVisible()) throw new Error('registered game project is not the first portfolio case');
  if (!await desktop.locator('#project-udgap').isVisible()) throw new Error('UDGAP status case is not visible');
  if (!await desktop.locator('#project-iris-shelf').isVisible()) throw new Error('Iris Shelf status case is not visible');
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
  if (await consumerLabSection.locator('.consumer-lab-relation').innerText() !== '7 个案例 · 4 个 Source-push Repository · 3 个固定快照') {
    throw new Error('Consumer Case and source repository relationship is not explicit');
  }
  if (await consumerLabSection.locator('.consumer-lab-compact-proof').count() !== 2) {
    throw new Error('Consumer Lab does not expose the selected compact local evidence');
  }
  if (!await desktop.locator('a[href="framework-quickstart.html"]').isVisible()) {
    throw new Error('portfolio does not expose the 15-minute Framework Quickstart');
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

  await desktop.locator('.brand-seal').click();
  await desktop.waitForURL(`${baseUrl}/pages/brand.html#brand-system`);
  if (await desktop.locator('meta[name="robots"][content^="noindex"]').count() !== 0) {
    throw new Error('public brand portfolio must remain indexable');
  }
  if (!await desktop.getByRole('heading', { name: 'IrisSakura Brand System', exact: true }).isVisible()) {
    throw new Error('Brand navigation does not open the public brand guidelines');
  }
  if (!await desktop.locator('#brand-system').isVisible()) {
    throw new Error('public brand portfolio does not expose its brand system');
  }
  await desktop.goto(`${baseUrl}/pages/art-music.html`, { waitUntil: 'networkidle' });
  await desktop.waitForURL(`${baseUrl}/pages/brand.html`);

  await desktop.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
  const journalText = await desktop.locator('body').innerText();
  for (const forbidden of ['确定性目录条目', '稳定 ID', '同步来源固定为 Journal 提交', '按 Journal 固定提交导出']) {
    if (journalText.includes(forbidden)) throw new Error(`Journal exposes maintainer-only copy: ${forbidden}`);
  }
  if (await desktop.locator('.evidence-chain-card').count() !== evidenceChains.chains.length) {
    throw new Error('research page does not expose every reviewed evidence chain');
  }
  const searchResults = desktop.locator('[data-content-search-results] .content-search-result');
  await searchResults.first().waitFor({ state: 'visible' });
  if (await searchResults.count() !== 12) {
    throw new Error('Journal search does not show the initial bounded result set');
  }
  if (await desktop.locator('[data-content-search-status]').innerText() !== `找到 ${contentSearchIndex.totalCount} 项，当前显示前 12 项。`) {
    throw new Error('Journal search does not announce the complete public index count');
  }
  const queryInput = desktop.locator('[data-content-search-query]');
  await queryInput.fill('Godot');
  await desktop.waitForFunction((expectedCount) => (
    document.querySelectorAll('[data-content-search-results] .content-search-result').length === expectedCount
  ), Math.min(godotSearchCount, 12));
  const expectedGodotStatus = godotSearchCount > 12
    ? `找到 ${godotSearchCount} 项，当前显示前 12 项。`
    : `找到 ${godotSearchCount} 项。`;
  if (await desktop.locator('[data-content-search-status]').innerText() !== expectedGodotStatus) {
    throw new Error('Journal keyword search does not announce its filtered result count');
  }
  await queryInput.fill('');
  await desktop.locator('[data-content-search-engine]').selectOption('unity');
  await desktop.waitForFunction(() => document.querySelectorAll('[data-content-search-results] .content-search-result').length === 4);
  await desktop.locator('[data-content-search-reset]').click();
  await desktop.waitForFunction(() => document.querySelectorAll('[data-content-search-results] .content-search-result').length === 12);
  const journalTitleBoundaryFailures = [];
  for (const [viewportName, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }]
  ]) {
    await desktop.setViewportSize(viewport);
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
        `${viewportName} IRIS × SAKURA "${overflow.text}" overflows by ${overflow.overflow}px`
      );
    }
  }
  if (journalTitleBoundaryFailures.length > 0) {
    throw new Error(`Journal card titles intrude into their horizontal padding:\n${journalTitleBoundaryFailures.join('\n')}`);
  }
  await desktop.setViewportSize({ width: 1280, height: 900 });

  await desktop.goto(`${baseUrl}/pages/blog.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.blog-card').count() !== publishedBlogs.length) throw new Error('blog index does not expose exactly the approved articles');
  if (await desktop.locator('.blog-featured-card').count() !== blogTaxonomy.series.length) throw new Error('Featured Reading does not expose one entry per registered series');
  if (await desktop.locator('.blog-series-list > a').count() !== blogTaxonomy.series.length) throw new Error('blog index series registry is incomplete');
  if (await desktop.locator('.blog-tag-list > a').count() !== routableBlogTags.length) throw new Error('blog index exposes the wrong tag route set');
  if (await desktop.locator('a[href="../rss.xml"]').count() !== 1) throw new Error('blog index RSS route is missing');
  const blogIndexText = await desktop.locator('body').innerText();
  if (blogIndexText.includes('来源提交') || blogIndexText.includes('经过登记与安全检查')) {
    throw new Error('blog index exposes the internal publication pipeline');
  }
  await desktop.evaluate(() => {
    document.documentElement.dataset.searchSoftNav = 'persistent';
  });
  await desktop.locator('.nav-menu').getByRole('link', { name: '研究与文章', exact: true }).click();
  await desktop.waitForURL(`${baseUrl}/pages/journal.html`);
  await desktop.locator('[data-content-search-results] .content-search-result').first().waitFor({ state: 'visible' });
  if (await desktop.locator('[data-content-search-results] .content-search-result').count() !== 12) {
    throw new Error('Journal search did not reinitialize after soft navigation');
  }
  if (await desktop.getAttribute('html', 'data-search-soft-nav') !== 'persistent') {
    throw new Error('Journal search navigation replaced the active document');
  }
  await desktop.goto(`${baseUrl}/pages/blog.html`, { waitUntil: 'networkidle' });
  const representativeSeries = blogTaxonomy.series.find((entry) => entry.name === representativeBlog.series);
  await desktop.goto(`${baseUrl}/pages/blog/series/${representativeSeries.slug}.html`, { waitUntil: 'networkidle' });
  if (!await desktop.getByRole('heading', { level: 1, name: representativeSeries.name }).isVisible()) {
    throw new Error('representative series route is not visible');
  }
  if (!await desktop.locator('.nav-menu .nav-link.active', { hasText: '研究与文章' }).isVisible()) {
    throw new Error('series route does not keep the 研究与文章 navigation context');
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
        mediaMatches: window.matchMedia('(max-width: 900px)').matches,
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

  await mobile.goto(`${baseUrl}/pages/brand.html`, { waitUntil: 'networkidle' });
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

  await mobile.goto(`${baseUrl}/pages/engineering.html`, { waitUntil: 'networkidle' });
  const engineeringMobileState = await mobile.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    workflowSteps: document.querySelectorAll('.engineering-workflow li').length,
    capabilityCards: document.querySelectorAll('.engineering-capability-card').length
  }));
  if (engineeringMobileState.overflow > 1) {
    throw new Error(`Engineering page overflows the mobile viewport by ${engineeringMobileState.overflow}px`);
  }
  if (engineeringMobileState.workflowSteps !== irisEngineering.workflow.length) {
    throw new Error('mobile Engineering page does not expose every workflow step');
  }
  if (engineeringMobileState.capabilityCards !== irisEngineering.capabilities.length) {
    throw new Error('mobile Engineering page does not expose every capability group');
  }
  await mobile.goto(`${baseUrl}/pages/framework.html`, { waitUntil: 'networkidle' });
  await mobile.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
  const frameworkMobileState = await mobile.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    layers: document.querySelectorAll('.framework-map-layer').length,
    branches: document.querySelectorAll('.framework-map-branch').length,
    pillars: document.querySelectorAll('.framework-pillar').length,
    reference: document.querySelectorAll('.framework-reference-card').length
  }));
  if (frameworkMobileState.overflow > 1) {
    throw new Error(`Framework story overflows the mobile viewport by ${frameworkMobileState.overflow}px`);
  }
  if (frameworkMobileState.layers !== frameworkStory.architectureMap.layers.length
    || frameworkMobileState.branches !== frameworkStory.architectureMap.branches.length
    || frameworkMobileState.pillars !== frameworkStory.pillars.length
    || frameworkMobileState.reference !== frameworkStory.reference.items.length) {
    throw new Error('mobile Framework story does not expose the complete architecture and reference contract');
  }
  await mobile.goto(`${baseUrl}/pages/framework-engineering.html`, { waitUntil: 'networkidle' });
  const frameworkEngineeringMobileState = await mobile.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    viewportWidth: window.innerWidth,
    heroWidth: document.querySelector('.framework-engineering-hero-inner').getBoundingClientRect().width,
    depthCards: document.querySelectorAll('.framework-depth-card').length,
    readerCards: document.querySelectorAll('.framework-reader-card').length,
    domainCards: document.querySelectorAll('.framework-domain-card').length,
    evidenceCards: document.querySelectorAll('.framework-evidence-authority-card').length
  }));
  if (frameworkEngineeringMobileState.overflow > 1) {
    throw new Error(`Framework Engineering Hub overflows the mobile viewport by ${frameworkEngineeringMobileState.overflow}px`);
  }
  if (frameworkEngineeringMobileState.heroWidth < frameworkEngineeringMobileState.viewportWidth - 48) {
    throw new Error(`Framework Engineering Hub hero collapsed to ${frameworkEngineeringMobileState.heroWidth}px on mobile`);
  }
  if (frameworkEngineeringMobileState.depthCards !== frameworkEngineering.depthModel.length
    || frameworkEngineeringMobileState.readerCards !== frameworkEngineering.readerPaths.length
    || frameworkEngineeringMobileState.domainCards !== frameworkEngineering.domains.length
    || frameworkEngineeringMobileState.evidenceCards !== frameworkEvidenceAuthorities.authorities.length) {
    throw new Error('mobile Framework Engineering Hub does not expose the complete contract');
  }
  for (const route of ['/pages/framework/decisions.html', '/pages/framework/consumers.html', '/pages/framework/cases/paradigm-neutral-ui.html', '/pages/framework/reference.html']) {
    await mobile.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    const deepMobileState = await mobile.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll('h1').length,
      index: document.querySelectorAll('[data-page-index-link]').length
    }));
    if (deepMobileState.overflow > 1) throw new Error(`${route} overflows the mobile viewport by ${deepMobileState.overflow}px`);
    if (deepMobileState.h1 !== 1 || deepMobileState.index < 3) throw new Error(`${route} is incomplete on mobile`);
  }
  for (const route of ['/pages/engineering.html', '/pages/framework.html', '/pages/journal.html', '/pages/game.html']) {
    await assertEvidenceChainPage(mobile, route, 'mobile');
  }
  if (process.env.SITE_SCREENSHOT_DIR) {
    await mobile.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'engineering-mobile.png'), fullPage: true });
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
  const contactNavLink = mobile.locator('.nav-menu').getByRole('link', { name: '联系', exact: true });
  if (await contactNavLink.count() !== 1) throw new Error('Contact navigation is not labeled 联系');
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

  console.log('Browser smoke passed: routes, persistent navigation, static content search, Featured Reading, evidence-led portfolio, mobile navigation and contact routes checked.');
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

async function measureTextContrast(page, selector) {
  const measurements = await page.locator(selector).evaluateAll((elements) => {
    const parseColor = (value) => {
      const srgb = value.match(
        /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/i
      );
      if (srgb) {
        return {
          red: Number(srgb[1]) * 255,
          green: Number(srgb[2]) * 255,
          blue: Number(srgb[3]) * 255,
          alpha: srgb[4] === undefined ? 1 : Number(srgb[4])
        };
      }
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
