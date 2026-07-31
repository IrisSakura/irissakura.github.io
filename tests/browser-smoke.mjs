import { chromium } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { access, mkdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [journalSource, projectData, siteData, themeConfig, sitemap] = await Promise.all([
  readJson('data/journal-source.json'),
  readJson('data/projects.json'),
  readJson('data/site.json'),
  readJson('data/themes.json'),
  readFile(path.join(root, 'sitemap.xml'), 'utf8')
]);
const indexedRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, location]) => new URL(location).pathname);
if (indexedRoutes.length === 0) throw new Error('sitemap does not expose any indexable routes');
const [representativeBlog] = journalSource.blogs;
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
    route: '/pages/journal.html',
    checks: [
      ['Journal back link', '.journal-back'],
      ['Journal dashboard label', '.journal-dashboard-label'],
      ['Journal dashboard values', '.journal-metric strong'],
      ['Journal dashboard metric labels', '.journal-metric span']
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
      ['Blog cover description', '.blog-hero > .container > p:not(.section-kicker)']
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

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await keepSmokeTestLocal(desktop);
  for (const route of indexedRoutes) {
    const response = await desktop.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`${route} returned ${response?.status()}`);
    if (await desktop.locator('main#main-content').count() !== 1) throw new Error(`${route} lacks one main landmark`);
  }
  await desktop.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const bgmPlayer = desktop.locator('[data-bgm-player]');
  const bgmAudio = desktop.locator('[data-bgm-audio]');
  const bgmToggle = desktop.locator('[data-bgm-toggle]');
  if (!await bgmPlayer.isVisible()) throw new Error('BGM player is not visible on the homepage');
  if (await bgmAudio.evaluate((audio) => !audio.paused)) throw new Error('BGM must be paused before visitor consent');
  if (await bgmToggle.getAttribute('aria-pressed') !== 'false') throw new Error('BGM toggle exposes an incorrect initial state');
  if (!await bgmAudio.evaluate((audio) => audio.canPlayType('audio/mpeg') !== '')) throw new Error('browser cannot play the configured BGM format');
  await bgmToggle.click();
  await desktop.waitForFunction(() => document.querySelector('[data-bgm-toggle]')?.getAttribute('aria-pressed') === 'true');
  await desktop.locator('[data-bgm-volume]').fill('0.2');
  await desktop.waitForFunction(() => {
    const audio = document.querySelector('[data-bgm-audio]');
    return audio instanceof HTMLAudioElement && audio.currentTime > 0.5;
  });
  await desktop.evaluate(() => {
    const audio = document.querySelector('[data-bgm-audio]');
    if (!(audio instanceof HTMLAudioElement)) throw new Error('BGM audio element is missing');
    window.dispatchEvent(new PageTransitionEvent('pagehide'));
  });
  const storedBgm = await desktop.evaluate((storageKey) => localStorage.getItem(storageKey), siteData.bgm.storageKey);
  if (!storedBgm) throw new Error('BGM state was not persisted');
  const parsedBgm = JSON.parse(storedBgm);
  if (!parsedBgm.enabled || parsedBgm.volume !== 0.2 || parsedBgm.currentTime <= 0.5) {
    throw new Error(`BGM state does not preserve playback intent, volume and progress: ${storedBgm}`);
  }
  const beforeNavigationTime = await bgmAudio.evaluate((audio) => {
    audio.dataset.smokeInstance = 'persistent-bgm';
    return audio.currentTime;
  });
  await desktop.locator('.nav-menu').getByRole('link', { name: '关于', exact: true }).click();
  await desktop.waitForURL(`${baseUrl}/pages/about.html`);
  if (await desktop.locator('[data-bgm-audio]').getAttribute('data-smoke-instance') !== 'persistent-bgm') {
    throw new Error('cross-page navigation replaced the active BGM audio instance');
  }
  await desktop.waitForFunction((minimumTime) => {
    const audio = document.querySelector('[data-bgm-audio]');
    return audio instanceof HTMLAudioElement && !audio.paused && audio.currentTime > minimumTime;
  }, beforeNavigationTime);
  await desktop.locator('.logo').click();
  await desktop.waitForURL(`${baseUrl}/index.html`);
  if (await desktop.locator('[data-bgm-audio]').getAttribute('data-smoke-instance') !== 'persistent-bgm') {
    throw new Error('return navigation replaced the active BGM audio instance');
  }
  const beforeFrameworkTime = await desktop.locator('[data-bgm-audio]')
    .evaluate((audio) => audio.currentTime);
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
  if (await desktop.locator('[data-bgm-audio]').getAttribute('data-smoke-instance') !== 'persistent-bgm') {
    throw new Error('history navigation replaced the persistent BGM audio instance');
  }
  await desktop.waitForFunction((minimumTime) => {
    const audio = document.querySelector('[data-bgm-audio]');
    return audio instanceof HTMLAudioElement && !audio.paused && audio.currentTime > minimumTime;
  }, beforeFrameworkTime);
  await desktop.locator('[data-bgm-toggle]').click();
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
  }

  await desktop.goto(`${baseUrl}/pages/portfolio.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.portfolio-case').count() !== projectData.projects.length) throw new Error('portfolio does not expose every registered project');
  if (!await desktop.locator('.portfolio-case').first().filter({ hasText: gameProject.title }).isVisible()) throw new Error('registered game project is not the first portfolio case');

  await desktop.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
  const journalText = await desktop.locator('body').innerText();
  for (const forbidden of ['确定性目录条目', '稳定 ID', '同步来源固定为 Journal 提交', '按 Journal 固定提交导出']) {
    if (journalText.includes(forbidden)) throw new Error(`Journal exposes maintainer-only copy: ${forbidden}`);
  }

  await desktop.goto(`${baseUrl}/pages/blog.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.blog-card').count() !== journalSource.blogs.length) throw new Error('blog index does not expose the registered complete articles');
  const blogIndexText = await desktop.locator('body').innerText();
  if (blogIndexText.includes('来源提交') || blogIndexText.includes('经过登记与安全检查')) {
    throw new Error('blog index exposes the internal publication pipeline');
  }
  await desktop.locator(`.blog-card a[href="blog/${encodeURIComponent(representativeBlog.id)}.html"]`).click();
  await desktop.getByRole('heading', {
    level: 1,
    name: representativeBlog.title,
    exact: true
  }).waitFor({ state: 'visible' });
  if (!await desktop.locator('.blog-prose').isVisible()) throw new Error('complete blog body is not visible');
  if (await desktop.locator('.blog-source-note').count() !== 0) throw new Error('blog article exposes a generator source note');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await keepSmokeTestLocal(mobile);
  await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  if (!await mobile.locator('[data-bgm-toggle]').isVisible()) throw new Error('mobile BGM toggle is not visible');
  if (await mobile.locator('.bgm-copy').isVisible()) throw new Error('mobile BGM control did not collapse its metadata');
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
  if (await mobile.getByRole('heading', { name: '当前公开沟通边界' }).count() !== 0) {
    throw new Error('Contact page exposes the owner-only communication boundary');
  }
  if (process.env.SITE_SCREENSHOT_DIR) {
    await mobile.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'contact-mobile.png'), fullPage: true });
  }

  console.log('Browser smoke passed: routes, persistent BGM navigation, complete blog publishing, evidence-led portfolio, mobile navigation and contact routes checked.');
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
