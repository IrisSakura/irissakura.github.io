import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('site configuration exposes verified direct contacts and public routes', async () => {
  const site = JSON.parse(await readText('data/site.json'));
  assert.equal(site.positioning, '可验证的 Unity 游戏系统开发者');
  assert.equal(site.tagline, '研究 · 框架 · 游戏验证');
  assert.ok(site.independenceNotice.includes('仅代表本人'));
  assert.deepEqual(site.contacts.map((contact) => contact.id), ['work-email', 'work-qq']);
  const workEmail = site.contacts.find((contact) => contact.id === 'work-email');
  const workQq = site.contacts.find((contact) => contact.id === 'work-qq');
  assert.match(workEmail.value, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  assert.equal(workEmail.href, `mailto:${workEmail.value}`);
  assert.match(workQq.value, /^\d{5,12}$/);
  assert.equal(workQq.href, undefined);
  assert.deepEqual(site.socials.map((social) => social.id), ['github', 'bilibili']);
  for (const social of site.socials) assert.match(social.url, /^https:\/\//);

  const contactPage = await readText('pages/contact.html');
  assert.ok(contactPage.includes(site.independenceNotice));
  for (const contact of site.contacts) {
    for (const fragment of [contact.label, contact.value, contact.description]) {
      assert.ok(contactPage.includes(fragment), `contact page missing ${fragment}`);
    }
  }
});

test('public navigation presents Contact as an ordinary tab without owner-only boundary copy', async () => {
  const pages = [
    'index.html',
    '404.html',
    ...(await listHtmlFiles(new URL('../pages/', import.meta.url), 'pages'))
  ];

  for (const page of pages) {
    const html = await readText(page);
    const nav = html.match(/<div class="nav-menu"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
    assert.ok(nav.includes('>联系我</a>'), `${page} navigation is missing the 联系我 tab`);
    assert.ok(!nav.includes('>公开入口</a>'), `${page} navigation still labels Contact as 公开入口`);
    assert.ok(!nav.includes('nav-cta'), `${page} gives Contact a special navigation treatment`);
  }

  const contactPage = await readText('pages/contact.html');
  for (const fragment of [
    'route-boundary',
    'CURRENT BOUNDARY',
    '当前公开沟通边界',
    '私有仓库、未整理工作日记、凭据和本机工程路径不在公开范围内'
  ]) {
    assert.ok(!contactPage.includes(fragment), `contact page exposes owner-only boundary copy: ${fragment}`);
  }

  const journalPages = await listHtmlFiles(new URL('../pages/journal/', import.meta.url), 'pages/journal');
  for (const page of journalPages) {
    const html = await readText(page);
    assert.ok(
      !html.includes('不包含私有仓库地址、工作日记或未整理原文'),
      `${page} exposes the private publication boundary`
    );
  }
});

test('public pages omit the retired test BGM while persistent navigation remains available', async () => {
  const site = JSON.parse(await readText('data/site.json'));
  const source = await readText('src/site.ts');
  const css = await readText('style/main.css');
  const navbar = await readText('components/navbar.html');
  const generator = await readText('scripts/generate-site.mjs');
  const pages = [
    'index.html',
    '404.html',
    ...(await listHtmlFiles(new URL('../pages/', import.meta.url), 'pages'))
  ];

  assert.equal('bgm' in site, false, 'site configuration still exposes the retired BGM');
  await assert.rejects(
    access(new URL('../assets/audio/huiliu-fang-datong.mp3', import.meta.url)),
    { code: 'ENOENT' }
  );

  for (const page of pages) {
    const html = await readText(page);
    for (const fragment of [
      'data-bgm-player',
      'data-bgm-audio',
      'data-bgm-toggle',
      'data-bgm-volume',
      'aria-label="背景音乐播放器"',
      'huiliu-fang-datong.mp3'
    ]) {
      assert.ok(!html.includes(fragment), `${page} still ships retired BGM markup: ${fragment}`);
    }
    assert.ok(!/<audio\b/i.test(html), `${page} still ships an audio element`);
  }

  for (const fragment of [
    'class BgmPlayer',
    'FALLBACK_BGM_STORAGE_KEY',
    'BGM_STATE_VERSION',
    '[data-bgm-audio]'
  ]) {
    assert.ok(!source.includes(fragment), `site runtime still contains retired BGM code: ${fragment}`);
  }
  for (const fragment of ['.bgm-player', '.bgm-toggle', '@keyframes bgm-']) {
    assert.ok(!css.includes(fragment), `shared CSS still contains retired BGM presentation: ${fragment}`);
  }
  for (const fragment of ['data-bgm-player', '{{bgmTitle}}', '{{bgmSource}}']) {
    assert.ok(!navbar.includes(fragment), `navbar template still contains retired BGM markup: ${fragment}`);
  }
  for (const fragment of ['site.bgm', 'assertLocalAudio', '{{bgmStorageKey}}']) {
    assert.ok(!generator.includes(fragment), `site generator still requires retired BGM data: ${fragment}`);
  }

  for (const contract of [
    'setupSoftNavigation()',
    'history.pushState',
    'main#main-content',
    'syncLocalStylesheets',
    "new CustomEvent('site:navigation-complete'",
    'location.assign(destination.href)'
  ]) {
    assert.ok(source.includes(contract), `persistent navigation runtime missing ${contract}`);
  }
  const frameworkSource = await readText('src/framework.ts');
  assert.ok(
    frameworkSource.includes("document.addEventListener('site:navigation-complete'"),
    'Framework page runtime must reconnect after persistent navigation'
  );
});

test('public page chrome omits maintainer-only source and implementation hints', async () => {
  const pageContracts = {
    'pages/journal.html': [
      '确定性目录条目',
      '稳定 ID',
      '同步来源固定为 Journal 提交',
      '按 Journal 固定提交导出',
      '在区域内滚动查看',
      '未登记文章'
    ],
    'pages/blog.html': [
      '来源提交',
      '经过登记与安全检查',
      'VERIFIED SOURCE',
      'PUBLISHED FROM JOURNAL'
    ],
    'pages/framework.html': [
      'framework-data-status',
      'framework-source-commit',
      'framework-generated-at',
      '构建时回退',
      '来源提交：'
    ]
  };

  for (const [page, forbidden] of Object.entries(pageContracts)) {
    const html = await readText(page);
    for (const fragment of forbidden) {
      assert.ok(!html.includes(fragment), `${page} exposes maintainer-only copy: ${fragment}`);
    }
  }

  const blogPages = await listHtmlFiles(new URL('../pages/blog/', import.meta.url), 'pages/blog');
  for (const page of blogPages) {
    const html = await readText(page);
    assert.ok(!html.includes('blog-source-note'), `${page} exposes a generator source note`);
    assert.ok(
      !html.includes('站点生成器会清理可执行 HTML'),
      `${page} explains the internal publication pipeline`
    );
  }
});

test('major page visuals are generated without reused category screenshots', async () => {
  const site = JSON.parse(await readText('data/site.json'));

  const majorPages = {
    home: 'index.html',
    portfolio: 'pages/portfolio.html',
    framework: 'pages/framework.html',
    journal: 'pages/journal.html',
    blog: 'pages/blog.html',
    game: 'pages/game.html',
    contact: 'pages/contact.html'
  };
  assert.deepEqual(Object.keys(site.pageCovers).sort(), Object.keys(majorPages).sort());

  const localImages = [
    ...Object.values(site.pageCovers).map((cover) => cover.image)
  ].filter(Boolean);
  for (const imagePath of localImages) {
    assert.match(imagePath, /^assets\/images\/.+\.(?:avif|jpe?g|png|webp)$/i);
    await access(new URL(`../${imagePath}`, import.meta.url));
  }

  const home = await readText('index.html');
  assert.ok(!home.includes('class="profile-card"'), 'home must not repeat a full identity card after the hero');
  assert.ok(!home.includes('id="profile-title"'), 'home must not add a redundant identity section');
  const evidenceOffset = home.indexOf('class="evidence-strip"');
  const flagshipOffset = home.indexOf('class="flagship-section"');
  const casesOffset = home.indexOf('class="case-section"');
  const methodOffset = home.indexOf('class="method-section"');
  assert.ok(evidenceOffset > home.indexOf('class="hero-section"'), 'home evidence must follow the hero');
  assert.ok(flagshipOffset > evidenceOffset, 'flagship proof must immediately follow the evidence summary');
  assert.ok(casesOffset > flagshipOffset, 'concrete engineering cases must follow the flagship proof');
  assert.ok(methodOffset > casesOffset, 'the abstract project chain must follow the concrete cases');

  const cssVisualCovers = ['home', 'framework', 'journal', 'blog', 'contact'];
  for (const coverKey of cssVisualCovers) assert.equal(site.pageCovers[coverKey].image, '', `${coverKey} must use a category visual`);
  assert.notEqual(site.pageCovers.portfolio.image, site.pageCovers.game.image);

  for (const [coverKey, pagePath] of Object.entries(majorPages)) {
    const html = await readText(pagePath);
    const prefix = pagePath === 'index.html' ? '' : '../';
    assert.ok(html.includes('page-cover'), `${pagePath} missing shared page-cover class`);
    assert.ok(html.includes(`data-page-cover="${coverKey}"`), `${pagePath} missing ${coverKey} cover key`);
    if (site.pageCovers[coverKey].image) {
      assert.ok(html.includes(`${prefix}${site.pageCovers[coverKey].image}`), `${pagePath} missing configured ${coverKey} cover image`);
    } else {
      assert.ok(html.includes('--page-cover-image: none;'), `${pagePath} must use its CSS category cover`);
    }
  }
});

test('research and articles share one primary navigation route without changing stable URLs', async () => {
  for (const page of ['index.html', 'pages/journal.html', 'pages/blog.html']) {
    const html = await readText(page);
    const primaryNav = html.match(/<div class="nav-menu"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
    assert.equal((primaryNav.match(/研究与文章/g) ?? []).length, 1, `${page} must expose one research nav item`);
    assert.ok(!primaryNav.includes('>Journal<'), `${page} must not expose a separate Journal nav item`);
    assert.ok(!primaryNav.includes('>博客<'), `${page} must not expose a separate blog nav item`);
  }

  const journal = await readText('pages/journal.html');
  const blog = await readText('pages/blog.html');
  const activeResearchNav = /href="\.\.\/pages\/journal\.html" class="nav-link active" aria-current="page">研究与文章<\/a>/;
  assert.match(journal, activeResearchNav);
  assert.match(blog, activeResearchNav);
});

test('primary navigation uses a Chinese framework label and exposes the art and music portfolio', async () => {
  for (const page of ['index.html', 'pages/framework.html', 'pages/art-music.html']) {
    const html = await readText(page);
    const primaryNav = html.match(/<div class="nav-menu"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
    assert.ok(primaryNav.includes('>框架</a>'), `${page} must label the Framework route as 框架`);
    assert.ok(!primaryNav.includes('>Framework</a>'), `${page} keeps an English Framework navigation label`);
    assert.ok(primaryNav.includes('>美术音乐</a>'), `${page} is missing the art and music navigation entry`);
    assert.ok(!primaryNav.includes('>关于</a>'), `${page} still exposes the retired About navigation entry`);
  }

  const artMusic = await readText('pages/art-music.html');
  assert.match(
    artMusic,
    /class="nav-link active" aria-current="page">美术音乐<\/a>/u
  );
  assert.ok(artMusic.includes('当前尚未公开作品'));
});

test('home hero and flagship use distinct existing game evidence', async () => {
  const projects = JSON.parse(await readText('data/projects.json'));
  const game = projects.projects.find((project) => project.id === 'sword-of-words');
  const home = await readText('index.html');
  assert.notEqual(game.homeImage, game.featureImage);
  assert.equal((home.match(new RegExp(game.homeImage, 'g')) ?? []).length, 1);
  assert.equal((home.match(new RegExp(game.featureImage, 'g')) ?? []).length, 1);
  assert.ok(home.includes(game.featureImageAlt));
});

test('all public pages use generated metadata and shared accessible shell', async () => {
  const themeConfig = JSON.parse(await readText('data/themes.json'));
  const layoutConfig = JSON.parse(await readText('data/layouts.json'));
  const pages = [
    'index.html',
    '404.html',
    ...(await listHtmlFiles(new URL('../pages/', import.meta.url), 'pages'))
  ];

  for (const page of pages) {
    const html = await readText(page);
    for (const fragment of [
      'site-meta:start',
      'meta name="description"',
      'rel="canonical"',
      'application/ld+json',
      'class="skip-link"',
      'id="main-navigation"',
      'aria-controls="main-navigation"',
      'aria-expanded="false"',
      'theme-styles:start',
      'data-theme-stylesheet',
      'data-themes=',
      'theme-bootstrap:start',
      'class="theme-select"',
      'aria-label="选择页面主题"',
      'option value="system"',
      'layout-styles:start',
      'data-layout-stylesheet',
      'data-layouts=',
      'layout-bootstrap:start',
      'class="layout-select"',
      'aria-label="选择页面布局"',
      'dist/site.js'
    ]) {
      assert.ok(html.includes(fragment), `${page} missing ${fragment}`);
    }

    assert.ok(
      html.indexOf('theme-styles:start') < html.indexOf('theme-bootstrap:start'),
      `${page} must load registered theme styles before applying the stored preference`
    );
    assert.ok(
      html.indexOf('theme-bootstrap:start') < html.indexOf('</head>'),
      `${page} must apply the theme before body rendering`
    );
    assert.ok(
      html.indexOf('layout-styles:start') < html.indexOf('layout-bootstrap:start'),
      `${page} must load layout styles before applying the stored preference`
    );
    assert.ok(
      html.indexOf('layout-bootstrap:start') < html.indexOf('</head>'),
      `${page} must apply the layout before body rendering`
    );
    for (const theme of themeConfig.themes) {
      assert.ok(
        html.includes(`option value="${theme.id}"`),
        `${page} missing registered theme option ${theme.id}`
      );
    }
    for (const stylesheet of new Set(themeConfig.themes.flatMap((theme) => theme.stylesheets))) {
      assert.ok(
        html.includes(stylesheet),
        `${page} missing registered theme stylesheet ${stylesheet}`
      );
    }
    for (const layout of layoutConfig.layouts) {
      assert.ok(
        html.includes(`option value="${layout.id}"`),
        `${page} missing registered layout option ${layout.id}`
      );
    }
    for (const stylesheet of new Set(layoutConfig.layouts.flatMap((layout) => layout.stylesheets))) {
      assert.ok(
        html.includes(stylesheet),
        `${page} missing registered layout stylesheet ${stylesheet}`
      );
    }
  }
});

test('theme selector follows the registry and system until the visitor stores a preference', async () => {
  const [siteSource, generator, navbar, themeConfig] = await Promise.all([
    readText('src/site.ts'),
    readText('scripts/generate-site.mjs'),
    readText('components/navbar.html'),
    readText('data/themes.json').then(JSON.parse)
  ]);

  assert.ok(generator.includes("readJson('data/themes.json')"));
  assert.ok(generator.includes('renderThemeOptions'));
  assert.ok(generator.includes('renderThemeStyles'));
  assert.ok(generator.includes("prefers-color-scheme: dark"));
  assert.ok(siteSource.includes("querySelector<HTMLSelectElement>('.theme-select')"));
  assert.ok(siteSource.includes("window.addEventListener('storage'"));
  assert.ok(siteSource.includes('localStorage.setItem'));
  assert.ok(siteSource.includes('localStorage.removeItem'));
  assert.ok(navbar.includes('{{themeOptions}}'));
  assert.ok(navbar.includes('data-default-light="{{defaultLightTheme}}"'));
  assert.equal(themeConfig.storageKey, 'irissakura-theme');
});

test('layout selector follows its own registry and stored preference', async () => {
  const [siteSource, generator, navbar, layoutConfig] = await Promise.all([
    readText('src/site.ts'),
    readText('scripts/generate-site.mjs'),
    readText('components/navbar.html'),
    readText('data/layouts.json').then(JSON.parse)
  ]);

  assert.ok(generator.includes("readJson('data/layouts.json')"));
  assert.ok(generator.includes('assertLayoutConfig'));
  assert.ok(generator.includes('renderLayoutOptions'));
  assert.ok(generator.includes('renderLayoutStyles'));
  assert.ok(siteSource.includes("querySelector<HTMLSelectElement>('.layout-select')"));
  assert.ok(siteSource.includes('applyLayoutPreference'));
  assert.ok(siteSource.includes('localStorage.setItem'));
  assert.ok(navbar.includes('{{layoutOptions}}'));
  assert.ok(navbar.includes('data-default-layout="{{defaultLayout}}"'));
  assert.equal(layoutConfig.storageKey, 'irissakura-layout');
});

test('layout registry keeps standard geometry as the default and owns layout styles', async () => {
  const [themeConfig, layoutConfig] = await Promise.all([
    readText('data/themes.json').then(JSON.parse),
    readText('data/layouts.json').then(JSON.parse)
  ]);
  const ids = layoutConfig.layouts.map((layout) => layout.id);
  assert.deepEqual(ids, ['standard', 'compact', 'wide']);
  assert.equal(layoutConfig.default, 'standard');
  assert.deepEqual(
    layoutConfig.layouts.find((layout) => layout.id === 'standard')?.stylesheets,
    []
  );

  const layoutStylesheets = new Set(layoutConfig.layouts.flatMap((layout) => layout.stylesheets));
  assert.deepEqual(
    [...layoutStylesheets].sort(),
    ['style/layout-compact.css', 'style/layout-wide.css']
  );
  const themeStylesheets = new Set(themeConfig.themes.flatMap((theme) => theme.stylesheets));
  for (const stylesheet of layoutStylesheets) {
    assert.ok(!themeStylesheets.has(stylesheet), `${stylesheet} must not be owned by a theme`);
    await readText(stylesheet);
  }
});

test('shared motion adds progressive depth without hiding content for reduced-motion visitors', async () => {
  const [siteSource, frameworkSource, css] = await Promise.all([
    readText('src/site.ts'),
    readText('src/framework.ts'),
    readText('style/main.css')
  ]);

  for (const contract of [
    'setupMotion',
    'setupNavbarDepth',
    'IntersectionObserver',
    "prefers-reduced-motion: reduce",
    "dataset.reveal = ''",
    "classList.add('depth-card')"
  ]) {
    assert.ok(siteSource.includes(contract), `shared site motion missing ${contract}`);
  }
  for (const contract of [
    '.navbar.scrolled',
    '.motion-ready [data-reveal]',
    '[data-reveal].is-visible',
    '.depth-card',
    '@media (prefers-reduced-motion: reduce)'
  ]) {
    assert.ok(css.includes(contract), `shared motion CSS missing ${contract}`);
  }
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\[data-reveal\][\s\S]*?opacity:\s*1\s*!important/s
  );
  assert.ok(
    !frameworkSource.includes("classList.toggle('scrolled'"),
    'navbar depth must have one shared owner instead of a Framework-only scroll listener'
  );
});

test('theme registry supports shared layers and the sakura village atmosphere', async () => {
  const config = JSON.parse(await readText('data/themes.json'));
  const ids = config.themes.map((theme) => theme.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ids, ['night', 'pastoral', 'sakura-village']);
  assert.equal(
    config.themes.find((theme) => theme.id === config.defaultLight)?.colorScheme,
    'light'
  );
  assert.equal(
    config.themes.find((theme) => theme.id === config.defaultDark)?.colorScheme,
    'dark'
  );

  const registeredStylesheets = new Set(config.themes.flatMap((theme) => theme.stylesheets));
  for (const stylesheet of registeredStylesheets) {
    await readText(stylesheet);
  }

  const sakuraTheme = config.themes.find((theme) => theme.id === 'sakura-village');
  assert.deepEqual(
    sakuraTheme.stylesheets,
    ['style/pastoral.css', 'style/sakura-village.css']
  );
  const sakuraCss = await readText('style/sakura-village.css');
  for (const motif of [
    '--torii',
    '--sakura',
    '.hero-section::before',
    '--ui-control-icon: var(--torii)'
  ]) {
    assert.ok(sakuraCss.includes(motif), `sakura theme missing motif ${motif}`);
  }
});

test('theme styles only change palette, typography and decoration', async () => {
  const config = JSON.parse(await readText('data/themes.json'));
  const stylesheets = new Set(config.themes.flatMap((theme) => theme.stylesheets));
  const presentationProperties = new Set([
    'backdrop-filter',
    'background',
    'background-blend-mode',
    'background-clip',
    'background-color',
    'background-image',
    'background-origin',
    'background-position',
    'background-repeat',
    'background-size',
    'border-bottom-color',
    'border-color',
    'border-left-color',
    'border-radius',
    'border-right-color',
    'border-top-color',
    'box-shadow',
    'color',
    'filter',
    'font-family',
    'font-style',
    'font-variant',
    'font-weight',
    'isolation',
    'letter-spacing',
    'mask-image',
    'mask-position',
    'mask-repeat',
    'mask-size',
    'mix-blend-mode',
    'opacity',
    'outline-color',
    'scrollbar-color',
    'text-decoration',
    'text-decoration-color',
    'text-shadow',
    'text-transform',
    'text-underline-offset',
    'text-wrap'
  ]);
  const violations = [];

  for (const stylesheet of stylesheets) {
    const css = (await readText(stylesheet)).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = match[1].trim();
      const selectors = selector.split(',').map((part) => part.trim());
      const isDecoration = selectors.every((part) => /::(?:before|after|selection)\b/.test(part));
      if (isDecoration) continue;

      for (const declaration of match[2].matchAll(/(?:^|;)\s*([\w-]+)\s*:/gm)) {
        const property = declaration[1];
        if (!property.startsWith('--') && !presentationProperties.has(property)) {
          violations.push(`${stylesheet}: ${selector} uses ${property}`);
        }
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `theme styles must not override shared layout or positioning:\n${violations.join('\n')}`
  );
});

test('placeholder blog, simulated form and unsupported template claims are absent', async () => {
  const publicFiles = [
    await readText('index.html'),
    await readText('pages/blog.html'),
    await readText('pages/contact.html'),
    await readText('src/site.ts')
  ].join('\n');

  for (const forbidden of [
    '完整文章内容',
    'blog-post.html',
    '游戏音乐中的互动音频设计',
    '消息已发送',
    '模拟API调用',
    'itch.io',
    'ArtStation',
    '从像素艺术到3A级体验',
    '音乐创作者 × 视觉设计师',
    'skill-percent'
  ]) {
    assert.ok(!publicFiles.includes(forbidden), `unsupported content remains: ${forbidden}`);
  }
});

async function listHtmlFiles(directory, prefix) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      files.push(...await listHtmlFiles(new URL(`${entry.name}/`, directory), `${prefix}/${entry.name}`));
    } else if (entry.name.endsWith('.html')) {
      files.push(`${prefix}/${entry.name}`);
    }
  }
  return files;
}

test('repository metadata and publishing policy are explicit', async () => {
  const packageJson = JSON.parse(await readText('package.json'));
  const readme = await readText('README.md');
  const journalSync = await readText('docs/maintenance/journal-sync.md');
  const workflow = await readText('.github/workflows/site-quality-and-pages.yml');

  assert.equal(packageJson.author, 'IrisSakura');
  assert.equal(packageJson.license, 'ISC');
  assert.equal(packageJson.homepage, 'https://irissakura.github.io/');
  assert.ok(!packageJson.dependencies?.gsap);
  assert.ok(readme.includes('内容真实性原则'));
  assert.ok(readme.includes('dist/'));
  assert.ok(readme.includes('隐式待审核'));
  assert.ok(journalSync.includes('新增未登记文章不会阻塞同步'));
  assert.ok(journalSync.includes('任何显式合同'));
  assert.ok(workflow.includes('npm run check'));
  assert.ok(workflow.includes('npm run test:smoke'));
  assert.ok(workflow.includes('actions/deploy-pages@v4'));
});

test('shared text colors meet WCAG AA contrast on dark surfaces', async () => {
  const css = await readText('style/main.css');
  const secondaryText = readCssHexVariable(css, 'secondary-text-color');
  const mutedText = readCssHexVariable(css, 'muted-text-color');
  const grayText = readCssHexVariable(css, 'gray-color');

  for (const background of ['#29173d', '#2d1b41', '#1e1e1e']) {
    assert.ok(
      contrastRatio(secondaryText, background) >= 4.5,
      `${secondaryText} must reach 4.5:1 on ${background}`
    );
  }
  assert.ok(contrastRatio(mutedText, '#040404') >= 4.5);
  assert.ok(contrastRatio(grayText, '#121212') >= 4.5);

  assert.match(css, /--ui-chip-text:\s*var\(--secondary-text-color\)/);
  assert.match(css, /\.tag,[\s\S]*?\.portfolio-tags span\s*\{[^}]*color:\s*var\(--ui-chip-text\)/s);
  assert.match(css, /\.project-status\s*\{[^}]*color:\s*var\(--secondary-text-color\)/s);
  assert.match(css, /\.footer-description\s*\{[^}]*color:\s*var\(--muted-text-color\)/s);
  assert.match(css, /\.footer-links a\s*\{[^}]*color:\s*var\(--muted-text-color\)/s);
  assert.match(css, /\.footer-bottom\s*\{[^}]*color:\s*var\(--muted-text-color\)/s);
});

test('sakura village text and actions meet WCAG AA contrast', async () => {
  const css = await readText('style/sakura-village.css');
  const paper = readCssHexVariable(css, 'paper');
  const ink = readCssHexVariable(css, 'ink');
  const inkSoft = readCssHexVariable(css, 'ink-soft');
  const petalStrong = readCssHexVariable(css, 'petal-strong');
  const torii = readCssHexVariable(css, 'torii');

  for (const foreground of [ink, inkSoft, petalStrong]) {
    assert.ok(
      contrastRatio(foreground, paper) >= 4.5,
      `${foreground} must reach 4.5:1 on sakura paper ${paper}`
    );
  }
  assert.ok(
    contrastRatio('#fffaf2', torii) >= 4.5,
    `primary button text must reach 4.5:1 on torii ${torii}`
  );
});

function readCssHexVariable(css, name) {
  const value = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
  assert.ok(value, `missing --${name}`);
  return value;
}

function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/.{2}/g).map((channel) => {
      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}
