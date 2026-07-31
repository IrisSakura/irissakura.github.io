import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

import { assertFrameworkAdoptionReviewed } from './lib/framework-adoption-review.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE_COVER_TARGETS = {
  home: 'hero-section',
  portfolio: 'portfolio-header',
  framework: 'framework-hero',
  journal: 'journal-hero',
  blog: 'blog-hero',
  game: 'game-hero',
  about: 'about-intro',
  contact: 'contact-header'
};

const [site, framework, frameworkAdoption, projects, journal, journalSource, themeConfig, navbarTemplate, footerTemplate] = await Promise.all([
  readJson('data/site.json'),
  readJson('data/framework.json'),
  readJson('data/framework-adoption.json'),
  readJson('data/projects.json'),
  readJson('data/journal.json'),
  readJson('data/journal-source.json'),
  readJson('data/themes.json'),
  readText('components/navbar.html'),
  readText('components/footer.html')
]);

assertFrameworkAdoptionReviewed(framework, frameworkAdoption);
assertThemeConfig(themeConfig);

const journalDetailDefinitions = journal.featuredNotes.map((note) => ({
  file: `pages/journal/${note.id}.html`,
  key: 'journal',
  title: `${note.title} | Sakura Design Journal`,
  description: note.description,
  canonical: `/pages/journal/${note.id}.html`,
  image: '/assets/images/home-preview-pastoral.png',
  schemaType: 'Article',
  note
}));
const blogDetailDefinitions = await Promise.all(journalSource.blogs.map(async (article) => ({
  file: `pages/blog/${article.id}.html`,
  key: 'blog',
  title: `${article.title} | IrisSakura`,
  description: article.summary,
  canonical: `/pages/blog/${article.id}.html`,
  image: '/assets/images/home-preview-pastoral.png',
  schemaType: 'Article',
  article,
  markdown: await readText(article.contentPath)
})));

await writeJournalDetailSources(journalDetailDefinitions);
await writeBlogDetailSources(blogDetailDefinitions);

const pageDefinitions = [
  {
    file: 'index.html',
    key: 'home',
    coverKey: 'home',
    title: 'IrisSakura | 构建可验证的 Unity 游戏系统',
    description: site.description,
    canonical: '/',
    image: '/assets/images/home-preview-pastoral.png'
  },
  {
    file: 'pages/about.html',
    key: 'about',
    coverKey: 'about',
    title: '关于 IrisSakura | 研究、框架与游戏',
    description: '了解 IrisSakura 如何以设计与引擎研究为输入，构建 Sakura Framework，并通过《言铸之剑》验证系统设计与工程能力。',
    canonical: '/pages/about.html',
    image: '/assets/images/home-preview-pastoral.png'
  },
  {
    file: 'pages/framework.html',
    key: 'framework',
    coverKey: 'framework',
    title: 'Sakura Framework | 成熟度透明的 Unity 模块化框架',
    description: `查看 Sakura Framework 的完整生命周期、${frameworkAdoption.supportedPackages.length} 个 Supported 包、最小稳定采用路线与《言铸之剑》的已验证使用映射。`,
    canonical: '/pages/framework.html',
    image: '/assets/images/home-preview-pastoral.png',
    schemaType: 'SoftwareSourceCode'
  },
  {
    file: 'pages/portfolio.html',
    key: 'portfolio',
    coverKey: 'portfolio',
    title: '作品集 | Sakura Design Journal、Framework 与言铸之剑',
    description: `${projects.projects.length} 个真实项目组成从研究、框架到游戏验证的完整链路，并公开说明状态、职责、证据和限制。`,
    canonical: '/pages/portfolio.html',
    image: '/assets/images/sword-of-words/combat-room.png'
  },
  {
    file: 'pages/journal.html',
    key: 'journal',
    coverKey: 'journal',
    title: '研究记录 | Sakura Design Journal',
    description: '经过策展的游戏设计、Godot 源码研究与工程审计摘要，说明研究如何影响框架和游戏决策。',
    canonical: '/pages/journal.html',
    image: '/assets/images/home-preview-pastoral.png'
  },
  {
    file: 'pages/game.html',
    key: 'portfolio',
    coverKey: 'game',
    title: '言铸之剑 | Unity 2D Roguelike 可玩原型',
    description: '《言铸之剑》是一款围绕房间推进、实时战斗、潜能构筑、生成式祝福和 Run 存档展开的 Unity 2D Roguelike 可玩原型。',
    canonical: '/pages/game.html',
    image: '/assets/images/sword-of-words/combat-room.png',
    schemaType: 'VideoGame'
  },
  {
    file: 'pages/contact.html',
    key: 'contact',
    coverKey: 'contact',
    title: '联系 IrisSakura | Unity 系统设计与框架交流',
    description: '通过工作邮箱、工作 QQ、GitHub 与哔哩哔哩联系 IrisSakura，交流 Unity 游戏系统、框架设计和技术合作。',
    canonical: '/pages/contact.html',
    image: '/assets/images/home-preview-pastoral.png'
  },
  {
    file: 'pages/blog.html',
    key: 'blog',
    coverKey: 'blog',
    title: '博客 | 游戏系统与工程设计',
    description: '围绕游戏系统、框架实践与工程决策的完整文章。',
    canonical: '/pages/blog.html',
    image: '/assets/images/home-preview-pastoral.png'
  },
  {
    file: '404.html',
    key: '',
    title: '页面未找到 | IrisSakura',
    description: '该页面不存在。返回 IrisSakura 首页、作品集或研究记录。',
    canonical: '/404.html',
    image: '/assets/images/home-preview-pastoral.png',
    noIndex: true
  },
  ...journalDetailDefinitions,
  ...blogDetailDefinitions
];

await assertSitePresentation(site, pageDefinitions);

const navItems = [
  ['home', '首页', 'index.html'],
  ['portfolio', '作品', 'pages/portfolio.html'],
  ['framework', 'Framework', 'pages/framework.html'],
  ['journal', 'Journal', 'pages/journal.html'],
  ['blog', '博客', 'pages/blog.html'],
  ['about', '关于', 'pages/about.html'],
  ['contact', '联系我', 'pages/contact.html']
];

for (const page of pageDefinitions) {
  const absolutePath = path.join(root, page.file);
  let html;
  try {
    html = await readFile(absolutePath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') continue;
    throw error;
  }

  const depth = page.file.split('/').length - 1;
  const prefix = '../'.repeat(depth);
  const pageHref = (target) => `${prefix}${target}`;

  const navLinks = navItems.map(([key, label, target]) => {
    const active = page.key === key;
    return `<a href="${pageHref(target)}" class="nav-link${active ? ' active' : ''}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
  }).join('\n            ');

  const footerLinks = navItems.slice(1).map(([, label, target]) => (
    `<a href="${pageHref(target)}">${label}</a>`
  )).join('\n                ');

  const socialLinks = site.socials.map((social) => (
    `<a href="${social.url}" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="${social.label}（在新窗口打开）"><i class="fab ${social.icon}" aria-hidden="true"></i></a>`
  )).join('\n                    ');

  const navbar = navbarTemplate
    .replaceAll('{{homeHref}}', pageHref('index.html'))
    .replace('{{navLinks}}', navLinks)
    .replace('{{themeStorageKey}}', escapeAttribute(themeConfig.storageKey))
    .replace('{{defaultLightTheme}}', escapeAttribute(themeConfig.defaultLight))
    .replace('{{defaultDarkTheme}}', escapeAttribute(themeConfig.defaultDark))
    .replace('{{themeOptions}}', renderThemeOptions(themeConfig));
  const footer = footerTemplate
    .replaceAll('{{homeHref}}', pageHref('index.html'))
    .replace('{{footerLinks}}', footerLinks)
    .replace('{{socialLinks}}', socialLinks);

  html = html
    .replace(
      /(?:<a class="skip-link"[\s\S]*?<\/a>\s*)?<nav class="navbar"[\s\S]*?<\/nav>(?:\s*<aside\b[^>]*\bdata-bgm-player\b[\s\S]*?<\/aside>)*/,
      navbar
    )
    .replace(/<footer class="footer">[\s\S]*?<\/footer>/, footer)
    .replace(/<main(?![^>]*\bid="main-content")/, '<main id="main-content"')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`);

  const meta = buildMeta(page, site, themeConfig);
  if (/<!-- site-meta:start -->[\s\S]*?<!-- site-meta:end -->/.test(html)) {
    html = html.replace(/<!-- site-meta:start -->[\s\S]*?<!-- site-meta:end -->/, meta);
  } else {
    html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n    ${meta}`);
  }
  html = installThemeBootstrap(html, prefix, themeConfig);

  const siteScript = `<script src="${prefix}dist/site.js" type="module"></script>`;
  if (!html.includes('dist/site.js')) {
    html = html.replace('</body>', `${siteScript}\n</body>`);
  }

  if (page.file === 'pages/framework.html') {
    html = updateFrameworkFallback(html, framework, frameworkAdoption);
    html = replaceGeneratedBlock(html, 'framework-adoption', renderFrameworkAdoption(frameworkAdoption));
  }
  if (page.file === 'index.html') {
    html = replaceGeneratedBlock(html, 'home-content', renderHomeContent(projects, journal, framework, site));
  }
  if (page.file === 'pages/portfolio.html') {
    html = replaceGeneratedBlock(html, 'portfolio-content', renderPortfolioContent(projects, journal, framework));
  }
  if (page.file === 'pages/journal.html') {
    html = replaceGeneratedBlock(html, 'journal-content', renderJournalContent(journal, journalSource));
  }
  if (page.file === 'pages/blog.html') {
    html = replaceGeneratedBlock(html, 'blog-content', renderBlogIndex(journalSource));
  }
  if (page.file === 'pages/about.html') {
    html = replaceGeneratedBlock(html, 'about-content', renderAboutContent());
  }
  if (page.file === 'pages/contact.html') {
    html = replaceGeneratedBlock(html, 'contact-content', renderContactContent(site));
  }

  html = installPageCover(html, page, site, prefix);
  html = html
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
  await writeFile(absolutePath, `${html.trim()}\n`);
}

await Promise.all([
  writeSitemap(pageDefinitions.filter((page) => !page.noIndex && page.file !== '404.html'), site.siteUrl),
  writeFile(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`),
  writeFile(path.join(root, 'site.webmanifest'), JSON.stringify({
    name: 'IrisSakura',
    short_name: 'IrisSakura',
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: themeConfig.themes.find((theme) => theme.id === themeConfig.defaultLight).backgroundColor,
    theme_color: themeConfig.themes.find((theme) => theme.id === themeConfig.defaultLight).themeColor,
    icons: [
      { src: '/assets/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
    ]
  }, null, 2) + '\n')
]);

function buildMeta(page, siteData, themes) {
  const canonical = `${siteData.siteUrl}${page.canonical}`;
  const image = `${siteData.siteUrl}${page.image}`;
  const prefix = '../'.repeat(page.file.split('/').length - 1);
  const defaultThemeColor = themes.themes.find((theme) => theme.id === themes.defaultLight).themeColor;
  const structured = {
    '@context': 'https://schema.org',
    '@type': page.schemaType ?? 'WebPage',
    name: page.title,
    description: page.description,
    url: canonical
  };
  if (page.schemaType === 'VideoGame') {
    structured.author = { '@type': 'Person', name: 'IrisSakura', url: siteData.siteUrl };
    structured.gamePlatform = 'Unity 2022.3 LTS';
    structured.applicationCategory = 'Game';
  }
  if (page.schemaType === 'SoftwareSourceCode') {
    structured.creator = { '@type': 'Person', name: 'IrisSakura', url: siteData.siteUrl };
    structured.programmingLanguage = 'C#';
    structured.runtimePlatform = 'Unity';
  }
  if (page.schemaType === 'Article' && (page.note || page.article)) {
    const article = page.note ?? page.article;
    structured.author = { '@type': 'Person', name: 'IrisSakura', url: siteData.siteUrl };
    structured.dateModified = article.updatedAt;
    structured.about = article.tags;
  }

  return `<!-- site-meta:start -->
    <meta name="description" content="${escapeAttribute(page.description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="${page.schemaType === 'Article' ? 'article' : 'website'}">
    <meta property="og:site_name" content="${siteData.siteName}">
    <meta property="og:title" content="${escapeAttribute(page.title)}">
    <meta property="og:description" content="${escapeAttribute(page.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${image}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttribute(page.title)}">
    <meta name="twitter:description" content="${escapeAttribute(page.description)}">
    <meta name="twitter:image" content="${image}">
    ${page.noIndex ? '<meta name="robots" content="noindex, follow">' : '<!-- indexable page -->'}
    <meta name="theme-color" content="${defaultThemeColor}">
    <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
    <link rel="manifest" href="${prefix}site.webmanifest">
    <script type="application/ld+json">${JSON.stringify(structured)}</script>
    <!-- site-meta:end -->`;
}

function assertThemeConfig(config) {
  if (!config || !Array.isArray(config.themes) || config.themes.length < 2) {
    throw new Error('theme registry must contain at least two themes');
  }
  if (!/^[a-z0-9-]+$/.test(config.storageKey ?? '')) {
    throw new Error('theme registry storageKey must be a stable identifier');
  }
  if (typeof config.systemLabel !== 'string' || config.systemLabel.trim() === '') {
    throw new Error('theme registry requires a system label');
  }

  const ids = new Set();
  for (const theme of config.themes) {
    if (!/^[a-z0-9-]+$/.test(theme.id ?? '') || theme.id === 'system') {
      throw new Error(`invalid theme id: ${theme.id}`);
    }
    if (ids.has(theme.id)) {
      throw new Error(`duplicate theme id: ${theme.id}`);
    }
    ids.add(theme.id);
    if (typeof theme.label !== 'string' || theme.label.trim() === '') {
      throw new Error(`theme ${theme.id} requires a label`);
    }
    if (!['light', 'dark'].includes(theme.colorScheme)) {
      throw new Error(`theme ${theme.id} has invalid colorScheme`);
    }
    for (const [name, value] of [
      ['themeColor', theme.themeColor],
      ['backgroundColor', theme.backgroundColor]
    ]) {
      if (!/^#[0-9a-f]{6}$/i.test(value ?? '')) {
        throw new Error(`theme ${theme.id} has invalid ${name}`);
      }
    }
    if (!Array.isArray(theme.stylesheets) || theme.stylesheets.some((stylesheet) => (
      !/^style\/[a-z0-9-]+\.css$/.test(stylesheet)
    ))) {
      throw new Error(`theme ${theme.id} has invalid stylesheets`);
    }
    if (new Set(theme.stylesheets).size !== theme.stylesheets.length) {
      throw new Error(`theme ${theme.id} contains duplicate stylesheets`);
    }
  }
  for (const defaultTheme of [config.defaultLight, config.defaultDark]) {
    if (!ids.has(defaultTheme)) {
      throw new Error(`theme registry default is not registered: ${defaultTheme}`);
    }
  }
  if (config.themes.find((theme) => theme.id === config.defaultLight).colorScheme !== 'light') {
    throw new Error('defaultLight must reference a light theme');
  }
  if (config.themes.find((theme) => theme.id === config.defaultDark).colorScheme !== 'dark') {
    throw new Error('defaultDark must reference a dark theme');
  }
}

function renderThemeOptions(config) {
  const options = [
    `<option value="system">${escapeHtml(config.systemLabel)}</option>`,
    ...config.themes.map((theme) => (
      `<option value="${escapeAttribute(theme.id)}" data-color-scheme="${theme.colorScheme}" data-theme-color="${theme.themeColor}">${escapeHtml(theme.label)}</option>`
    ))
  ];
  return options.join('\n                    ');
}

function renderThemeStyles(prefix, config) {
  const stylesheetThemes = new Map();
  for (const theme of config.themes) {
    for (const stylesheet of theme.stylesheets) {
      const owners = stylesheetThemes.get(stylesheet) ?? [];
      owners.push(theme.id);
      stylesheetThemes.set(stylesheet, owners);
    }
  }

  const links = Array.from(stylesheetThemes, ([stylesheet, themeIds]) => {
    const enabledByDefault = themeIds.includes(config.defaultLight);
    return `<link rel="stylesheet" href="${prefix}${stylesheet}" data-theme-stylesheet data-themes="${themeIds.join(' ')}"${enabledByDefault ? '' : ' disabled'}>`;
  });
  return `<!-- theme-styles:start -->
    ${links.join('\n    ')}
    <!-- theme-styles:end -->`;
}

function installThemeBootstrap(html, prefix, config) {
  const themeStyles = renderThemeStyles(prefix, config);
  const themeStylesPattern = /<!-- theme-styles:start -->[\s\S]*?<!-- theme-styles:end -->/;
  const legacyThemeLinkPattern = /<link rel="stylesheet" href="(?:\.\.\/)*style\/pastoral\.css"(?:\s+data-theme-stylesheet)?\s*>/;
  if (themeStylesPattern.test(html)) {
    html = html.replace(themeStylesPattern, themeStyles);
  } else if (legacyThemeLinkPattern.test(html)) {
    html = html.replace(legacyThemeLinkPattern, themeStyles);
  } else {
    throw new Error('missing generated theme styles block');
  }

  const browserConfig = {
    storageKey: config.storageKey,
    defaultLight: config.defaultLight,
    defaultDark: config.defaultDark,
    themes: Object.fromEntries(config.themes.map((theme) => [
      theme.id,
      {
        colorScheme: theme.colorScheme,
        themeColor: theme.themeColor
      }
    ]))
  };
  const themeBootstrap = `<!-- theme-bootstrap:start -->
    <script>
        (() => {
            const config = ${JSON.stringify(browserConfig)};
            let storedTheme = null;
            try {
                storedTheme = window.localStorage.getItem(config.storageKey);
            } catch {
                // 受限存储环境下继续使用系统主题。
            }
            const isTheme = (value) => Object.prototype.hasOwnProperty.call(config.themes, value);
            const preference = isTheme(storedTheme) ? storedTheme : 'system';
            const theme = preference === 'system'
                ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? config.defaultDark
                    : config.defaultLight
                : preference;
            document.documentElement.dataset.theme = theme;
            document.documentElement.dataset.themePreference = preference;
            document.documentElement.style.colorScheme = config.themes[theme].colorScheme;
            document.querySelectorAll('[data-theme-stylesheet]').forEach((stylesheet) => {
                if (!(stylesheet instanceof HTMLLinkElement)) return;
                const supportedThemes = (stylesheet.dataset.themes || '').split(/\\s+/);
                stylesheet.disabled = !supportedThemes.includes(theme);
            });
            document.querySelector('meta[name="theme-color"]')
                ?.setAttribute('content', config.themes[theme].themeColor);
        })();
    </script>
    <!-- theme-bootstrap:end -->`;
  const themeBootstrapPattern = /<!-- theme-bootstrap:start -->[\s\S]*?<!-- theme-bootstrap:end -->/;
  html = html.replace(themeBootstrapPattern, '');
  return html.replace(themeStyles, `${themeStyles}\n    ${themeBootstrap}`);
}

function updateFrameworkFallback(html, data, adoption) {
  const replacements = {
    'framework-package-count': data.summary.packageCount,
    'framework-module-count': data.summary.catalogModuleCount,
    'framework-profile-count': data.summary.profileCount,
    'framework-maturity-summary': `${data.summary.packageCount} 个 Package 中只有 ${data.lifecycleCounts.Supported ?? 0} 个处于 Supported；Preview 和 Experimental 不应被解释为同等稳定的生产能力。`,
    'framework-module-result-count': `${data.featuredModules.length} 个模块`,
    'framework-supported-count': data.lifecycleCounts.Supported ?? 0,
    'framework-preview-count': data.lifecycleCounts.Preview ?? 0,
    'framework-experimental-count': data.lifecycleCounts.Experimental ?? 0,
    'framework-docsonly-count': data.lifecycleCounts.DocsOnly ?? 0,
    'framework-frozen-count': data.lifecycleCounts.Frozen ?? 0,
    'framework-supported-package-list': adoption.supportedPackages.map((entry) => entry.displayName).join('、')
  };
  for (const [id, value] of Object.entries(replacements)) {
    html = html.replace(
      new RegExp(`(<[^>]+id="${id}"[^>]*>)[\\s\\S]*?(</[^>]+>)`),
      `$1${value}$2`
    );
  }
  return html;
}

function replaceGeneratedBlock(html, name, content) {
  const pattern = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
  if (!pattern.test(html)) {
    throw new Error(`missing generated block: ${name}`);
  }
  return html.replace(pattern, `<!-- ${name}:start -->\n${content}\n<!-- ${name}:end -->`);
}

function renderHomeContent(projectData, journalData, frameworkData, siteData) {
  const game = projectData.projects.find((project) => project.id === 'sword-of-words');
  if (!game) throw new Error('missing sword-of-words project');
  const researchCards = journalData.featuredNotes.slice(0, 3).map((note) => `
                <article class="research-row">
                    <p class="project-status">${escapeHtml(note.track)} · ${escapeHtml(note.updatedAt)}</p>
                    <h3>${escapeHtml(note.title)}</h3>
                    <p>${escapeHtml(note.description)}</p>
                    <a href="pages/journal/${encodeURIComponent(note.id)}.html" class="project-detail-link">
                        阅读研究主题<i class="fas fa-arrow-right" aria-hidden="true"></i>
                    </a>
                </article>`).join('');

  return `    <section id="home-page" class="page active">
        <section class="hero-section">
            <div class="container hero">
                <div class="hero-content">
                    <p class="section-kicker">UNITY SYSTEMS · GAMEPLAY · TOOLS</p>
                    <h1 class="hero-title">构建可验证的 <span class="highlight">Unity 游戏系统</span></h1>
                    <p class="hero-description">我研究游戏机制与引擎运行时，将可复用结论沉淀为 Sakura Framework，并通过《言铸之剑》验证它们是否真正服务于可玩体验。</p>
                    <div class="hero-buttons">
                        <a href="pages/game.html" class="btn btn-primary">查看代表作</a>
                        <a href="https://github.com/IrisSakura" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">查看 GitHub</a>
                    </div>
                </div>
                <figure class="hero-proof">
                    <img src="${escapeAttribute(game.homeImage)}" alt="${escapeAttribute(game.imageAlt)}">
                    <figcaption>
                        <span>PLAYABLE PROTOTYPE</span>
                        <strong>《${escapeHtml(game.title)}》</strong>
                        <small>Unity 2022.3 LTS · 独立开发 / 系统设计</small>
                    </figcaption>
                </figure>
            </div>
        </section>

${renderProfileSection(siteData)}

        <section class="evidence-strip" aria-label="项目证据摘要">
            <div class="container evidence-grid">
                <a href="pages/game.html"><strong>1</strong><span>可玩原型</span></a>
                <a href="pages/framework.html#maturity"><strong>${frameworkData.lifecycleCounts.Supported}</strong><span>Supported 包</span></a>
                <a href="pages/journal.html"><strong>${journalData.summary.gameDesignCount}</strong><span>游戏设计主题</span></a>
                <a href="pages/about.html"><strong>独立开发</strong><span>系统设计 / 工程实现</span></a>
            </div>
        </section>

        <section class="flagship-section">
            <div class="container flagship-grid">
                <div class="flagship-media">
                    <img src="${escapeAttribute(game.homeImage)}" alt="${escapeAttribute(game.imageAlt)}">
                </div>
                <div class="flagship-copy">
                    <p class="section-kicker">REPRESENTATIVE WORK · ${escapeHtml(game.status)}</p>
                    <h2>《${escapeHtml(game.title)}》：让系统最终回到可玩体验</h2>
                    <p class="flagship-lead">${escapeHtml(game.summary)}</p>
                    <dl class="flagship-facts">
                        <div><dt>职责</dt><dd>${escapeHtml(game.role)}</dd></div>
                        <div><dt>玩家循环</dt><dd>选择房间 → 实时战斗 → 构筑成长 → 推进与保存</dd></div>
                        <div><dt>关键系统</dt><dd>技能与潜能、生成式祝福、Run 快照存档</dd></div>
                        <div><dt>当前限制</dt><dd>${escapeHtml(game.limitations.join('；'))}</dd></div>
                    </dl>
                    <a href="pages/game.html" class="btn btn-primary">查看完整案例</a>
                </div>
            </div>
        </section>

        <section class="method-section">
            <div class="container">
                <div class="section-heading">
                    <p class="section-kicker">RESEARCH → FRAMEWORK → GAME</p>
                    <h2>一条从判断到验证的项目链</h2>
                    <p>首页先展示成品证据；这里再解释这些系统从哪里来，以及如何被验证。</p>
                </div>
                <ol class="method-chain">
                    <li><span>01 · JOURNAL</span><h3>Sakura Design Journal</h3><p>研究问题、源码机制与设计判断。</p><a href="pages/journal.html">查看研究</a></li>
                    <li><span>02 · FRAMEWORK</span><h3>Sakura Framework</h3><p>沉淀可复用的边界、服务与规则。</p><a href="pages/framework.html">查看框架</a></li>
                    <li><span>03 · GAME</span><h3>《言铸之剑》</h3><p>验证系统是否产生真实玩法价值。</p><a href="pages/game.html">查看游戏</a></li>
                </ol>
            </div>
        </section>

        <section class="case-section">
            <div class="container">
                <div class="section-heading">
                    <p class="section-kicker">ENGINEERING CASES</p>
                    <h2>三个具体问题，三组可检查决策</h2>
                </div>
                <div class="case-list">
                    <article><span>01 · COMBAT</span><h3>统一技能、潜能与祝福的能力入口</h3><dl><div><dt>问题</dt><dd>多条成长路径如何作用于同一战斗事实？</dd></div><div><dt>约束</dt><dd>效果必须可组合，伤害提交不能出现双重事实。</dd></div><div><dt>决策</dt><dd>使用标签、属性、效果和能力入口组织结算。</dd></div><div><dt>结果</dt><dd>实时战斗与构筑系统在同一运行循环中协作。</dd></div></dl></article>
                    <article><span>02 · SAVE</span><h3>通过房间快照维持 Run 连续性</h3><dl><div><dt>问题</dt><dd>跨房间推进时如何恢复局内状态？</dd></div><div><dt>约束</dt><dd>场景对象不能成为持久化事实源。</dd></div><div><dt>决策</dt><dd>在明确推进节点提交结构化 Run 快照。</dd></div><div><dt>结果</dt><dd>房间分支、成长选择和恢复路径拥有清晰边界。</dd></div></dl></article>
                    <article><span>03 · LOCAL LLM</span><h3>让本地模型参与玩法而不破坏运行循环</h3><dl><div><dt>问题</dt><dd>生成式祝福怎样转化为可执行游戏效果？</dd></div><div><dt>约束</dt><dd>输出不稳定、调用可能失败，不能阻断游戏。</dd></div><div><dt>决策</dt><dd>采用结构化输出、白名单映射与失败回退。</dd></div><div><dt>结果</dt><dd>生成内容进入可验证的祝福选择与效果执行。</dd></div></dl></article>
                </div>
            </div>
        </section>

        <section class="research-section">
            <div class="container">
                <div class="section-heading section-heading-row">
                    <div><p class="section-kicker">LATEST RESEARCH</p><h2>近期研究主题</h2></div>
                    <a href="pages/journal.html" class="text-link">查看全部研究</a>
                </div>
                <div class="research-list">${researchCards}
                </div>
            </div>
        </section>

        <section class="public-cta">
            <div class="container public-cta-inner">
                <div><p class="section-kicker">CONTACT & PUBLIC ROUTES</p><h2>直接联系或继续查看公开记录</h2><p>工作邮箱、工作 QQ 与公开项目入口都集中在联系页。</p></div>
                <a href="pages/contact.html" class="btn btn-secondary">查看公开入口</a>
            </div>
        </section>
    </section>`;
}

function renderProfileSection(siteData) {
  const profile = siteData.profile;
  const avatar = profile.avatar
    ? `<img src="${escapeAttribute(profile.avatar)}" alt="${escapeAttribute(`${profile.displayName} 的头像`)}">`
    : `<span class="profile-avatar-fallback" aria-hidden="true">${escapeHtml(profile.initials)}</span><span class="sr-only">尚未设置头像</span>`;
  const backgroundImage = profile.backgroundImage
    ? `url('${escapeAttribute(profile.backgroundImage)}')`
    : 'none';
  const focuses = profile.focuses.map((focus) => `<li>${escapeHtml(focus)}</li>`).join('');
  const socialLinks = siteData.socials.map((social) => (
    `<a href="${escapeAttribute(social.url)}" target="_blank" rel="noopener noreferrer"><i class="fab ${escapeAttribute(social.icon)}" aria-hidden="true"></i>${escapeHtml(social.label)}</a>`
  )).join('');

  return `        <section class="profile-section" aria-labelledby="profile-title">
            <div class="container">
                <article class="profile-card">
                    <div class="profile-card-cover" aria-hidden="true" style="--profile-cover-image: ${backgroundImage}; --profile-cover-position: ${escapeAttribute(profile.backgroundPosition)};"></div>
                    <div class="profile-card-body">
                        <div class="profile-avatar">${avatar}</div>
                        <div class="profile-copy">
                            <p class="section-kicker">PERSONAL PROFILE · 个人信息</p>
                            <h2 id="profile-title">${escapeHtml(profile.displayName)}</h2>
                            <p class="profile-role">${escapeHtml(profile.role)}</p>
                            <p class="profile-bio">${escapeHtml(profile.bio)}</p>
                        </div>
                        <ul class="profile-focuses" aria-label="当前关注方向">${focuses}</ul>
                        <div class="profile-actions">
                            <a class="btn btn-primary" href="pages/about.html">了解我的方向</a>
                            <div class="profile-socials" aria-label="公开主页">${socialLinks}</div>
                        </div>
                    </div>
                </article>
            </div>
        </section>`;
}

function renderPortfolioContent(projectData, journalData, frameworkData) {
  const order = ['sword-of-words', 'sakura-framework', 'sakura-design-journal'];
  const ordered = order.map((id) => projectData.projects.find((project) => project.id === id));
  if (ordered.some((project) => !project)) throw new Error('portfolio project set is incomplete');
  const cases = ordered.map((project, index) => {
    const visual = renderPortfolioVisual(project, journalData, frameworkData);
    return `<article class="portfolio-case portfolio-case-${escapeAttribute(project.category)}" id="project-${escapeAttribute(project.id)}">
                <div class="portfolio-case-visual">${visual}</div>
                <div class="portfolio-case-copy">
                    <p class="project-status">0${index + 1} · ${escapeHtml(project.categoryLabel)} · ${escapeHtml(project.status)}</p>
                    <h2>${escapeHtml(project.title)}</h2>
                    <p class="portfolio-description">${escapeHtml(project.summary)}</p>
                    <dl class="portfolio-facts">
                        <div><dt>职责</dt><dd>${escapeHtml(project.role)}</dd></div>
                        <div><dt>目标</dt><dd>${escapeHtml(project.goal)}</dd></div>
                        <div><dt>证据</dt><dd>${escapeHtml(project.evidence.join('；'))}</dd></div>
                        <div><dt>限制</dt><dd>${escapeHtml(project.limitations.join('；'))}</dd></div>
                    </dl>
                    <div class="portfolio-tags">${project.technologies.slice(0, 5).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
                    <a href="${escapeAttribute(project.href)}" class="portfolio-link">${escapeHtml(project.linkLabel)}<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                </div>
            </article>`;
  }).join('\n            ');

  return `<div class="portfolio-header">
        <div class="container">
            <p class="section-kicker">WORK BEFORE CLAIMS</p>
            <h1>真实作品与工程证据</h1>
            <p>先看做成了什么，再看研究和框架如何支撑这些结果。</p>
        </div>
    </div>
    <div class="container">
        <section class="portfolio-journey" aria-labelledby="portfolio-journey-title">
            <div class="journey-heading">
                <div><p class="journey-kicker">HOW THE WORK IS MADE</p><h2 id="portfolio-journey-title">研究 → 范式 → 框架 → 游戏验证</h2></div>
                <a class="journal-link" href="journal.html">查看研究记录<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
            </div>
            <p class="journey-intro">展示顺序从游戏开始，因果链仍从研究开始：Journal 保存判断，Framework 沉淀复用能力，《言铸之剑》检验这些能力是否真正服务于玩法。</p>
            <ol class="journey-path">
                <li><span class="journey-index">01</span><h3>研究问题</h3><p>理解引擎机制与游戏设计约束。</p></li>
                <li><span class="journey-index">02</span><h3>工程抽象</h3><p>只把跨项目复用的结论沉淀为框架。</p></li>
                <li><span class="journey-index">03</span><h3>作品验证</h3><p>用可玩循环、截图和限制校验价值。</p></li>
            </ol>
        </section>
        <section class="portfolio-cases" aria-label="${ordered.length} 个真实项目">
            ${cases}
        </section>
    </div>`;
}

function renderPortfolioVisual(project, journalData, frameworkData) {
  if (project.image) {
    return `<img src="${escapeAttribute(project.image)}" alt="${escapeAttribute(project.imageAlt)}"><span class="visual-label">PLAYABLE PROTOTYPE</span>`;
  }
  if (project.id === 'sakura-framework') {
    return `<div class="framework-proof-visual" aria-label="Framework 生命周期快照">
        <div><strong>${frameworkData.lifecycleCounts.Supported}</strong><span>Supported</span></div>
        <div><strong>${frameworkData.lifecycleCounts.Preview}</strong><span>Preview</span></div>
        <div><strong>${frameworkData.lifecycleCounts.Experimental}</strong><span>Experimental</span></div>
        <p>${frameworkData.lifecycleCounts.DocsOnly} DocsOnly · ${frameworkData.lifecycleCounts.Frozen} Frozen</p>
    </div><span class="visual-label">PUBLIC SNAPSHOT</span>`;
  }
  return `<div class="journal-proof-visual" aria-label="Journal 精选研究主题">
      <p>${journalData.summary.gameDesignCount} 个设计主题 · ${journalData.summary.knowledgeStreamCount} 条知识流</p>
      ${journalData.featuredNotes.slice(0, 3).map((note) => `<div><span>${escapeHtml(note.track)}</span><strong>${escapeHtml(note.title)}</strong></div>`).join('')}
    </div><span class="visual-label">CURATED RESEARCH</span>`;
}

function renderJournalContent(journalData, sourceData) {
  const streams = journalData.streams.map((stream, index) => `
                <article class="stream-card" data-stream="${escapeAttribute(stream.id)}">
                    <div class="stream-card-topline"><span>0${index + 1}</span><i class="fas ${escapeAttribute(stream.icon)}" aria-hidden="true"></i></div>
                    <p class="stream-label">${escapeHtml(stream.label)}</p>
                    <h3>${escapeHtml(stream.title)}</h3>
                    <p>${escapeHtml(stream.description)}</p>
                </article>`).join('');
  const notes = journalData.featuredNotes.map((note) => `
                <article class="note-card" id="note-${escapeAttribute(note.id)}" data-note="${escapeAttribute(note.id)}">
                    <span class="note-track">${escapeHtml(note.track)}</span>
                    <h3>${escapeHtml(note.title)}</h3>
                    <p>${escapeHtml(note.description)}</p>
                    <div class="note-tags">${note.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
                    <p class="note-finding"><strong>核心结论</strong>${escapeHtml(note.finding)}</p>
                    <a class="note-link" href="journal/${encodeURIComponent(note.id)}.html">阅读完整研究结构<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                </article>`).join('');
  const recentAudits = sourceData.audits.slice(0, 6).map((audit) => `
                <article class="journal-update-card">
                    <p class="project-status">框架审计 · ${escapeHtml(audit.updatedAt)}</p>
                    <h3>${escapeHtml(audit.title)}</h3>
                    <p>${escapeHtml(audit.summary)}</p>
                </article>`).join('');
  const gameDesigns = sourceData.gameDesigns.map((design) => `
                <article class="design-summary-card" id="design-${escapeAttribute(design.id)}">
                    <p class="project-status">游戏设计范式 · ${escapeHtml(design.updatedAt)}</p>
                    <h3>${escapeHtml(design.title)}</h3>
                    <p>${escapeHtml(design.summary)}</p>
                    <div class="note-tags">${design.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
                </article>`).join('');

  return `<header class="journal-hero">
        <div class="container journal-hero-grid">
            <div>
                <a class="journal-back" href="portfolio.html"><i class="fas fa-arrow-left" aria-hidden="true"></i>返回作品</a>
                <p class="journal-kicker">CURATED LEARNING · EVIDENCE BY DESIGN</p>
                <h1>${escapeHtml(journalData.title)}</h1>
                <p class="journal-lead">${escapeHtml(journalData.summary.description)}</p>
                <div class="journal-actions"><a class="btn btn-primary" href="#featured-notes">查看精选主题</a><a class="btn btn-secondary" href="framework.html">查看框架影响</a></div>
            </div>
            <div class="journal-dashboard" aria-label="学习记录概览">
                <div class="journal-dashboard-label">CURATED SNAPSHOT</div>
                <div class="journal-metric"><strong>${journalData.summary.gameDesignCount}</strong><span>游戏设计主题</span></div>
                <div class="journal-metric"><strong>${journalData.summary.auditCount}</strong><span>框架审计摘要</span></div>
                <div class="journal-metric"><strong>${journalData.summary.blogCount}</strong><span>完整博客</span></div>
                <div class="journal-metric"><strong>${journalData.summary.knowledgeStreamCount}</strong><span>知识流</span></div>
            </div>
        </div>
    </header>
    <section class="journal-section">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">KNOWLEDGE STREAMS</p><h2>${journalData.streams.length} 条相互验证的知识流</h2></div><p>研究引擎如何工作，提炼游戏为何成立，再用工程记录约束判断是否可靠。</p></div>
            <div class="stream-grid">${streams}
            </div>
        </div>
    </section>
    <section class="journal-section journal-featured" id="featured-notes">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">SELECTED NOTES</p><h2 id="featured-notes-title">可独立分享的精选研究主题</h2></div></div>
            <div class="journal-scroll-region journal-featured-scroll" role="region" aria-labelledby="featured-notes-title" tabindex="0">
                <div class="note-grid">${notes}
                </div>
            </div>
        </div>
    </section>
    <section class="journal-section journal-updates" id="recent-audits">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">RECENT FRAMEWORK AUDITS</p><h2 id="recent-audits-title">近期框架审计摘要</h2></div></div>
            <div class="journal-scroll-region journal-audit-scroll" role="region" aria-labelledby="recent-audits-title" tabindex="0">
                <div class="journal-update-grid">${recentAudits}
                </div>
            </div>
        </div>
    </section>
    <section class="journal-section" id="game-design-library">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">GAME DESIGN LIBRARY</p><h2 id="game-design-library-title">游戏设计范式索引</h2></div></div>
            <div class="journal-scroll-region journal-design-scroll" role="region" aria-labelledby="game-design-library-title" tabindex="0">
                <div class="design-summary-grid">${gameDesigns}
                </div>
            </div>
        </div>
    </section>
    <section class="journal-section">
        <div class="container">
            <div class="journal-bridge">
                <div><p class="journal-kicker">RESEARCH → SYSTEM → WORK</p><h2>记录的价值，在于改变下一次实现</h2><p>只有能够跨项目复用的结论，才进入 Sakura Framework；只有被实际作品验证的能力，才成为作品集证据。</p></div>
                <div class="bridge-actions"><a class="bridge-card" href="framework.html"><span>02 / SYSTEM</span><strong>Sakura Framework</strong><i class="fas fa-arrow-right" aria-hidden="true"></i></a><a class="bridge-card" href="game.html"><span>03 / WORK</span><strong>《言铸之剑》</strong><i class="fas fa-arrow-right" aria-hidden="true"></i></a></div>
            </div>
        </div>
    </section>`;
}

function renderBlogIndex(sourceData) {
  const articles = sourceData.blogs.map((article) => `
                <article class="blog-card">
                    <p class="project-status">${escapeHtml(article.series)} · ${escapeHtml(article.updatedAt)}</p>
                    <h2>${escapeHtml(article.title)}</h2>
                    <p>${escapeHtml(article.summary)}</p>
                    <div class="note-tags">${article.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
                    <a class="note-link" href="blog/${encodeURIComponent(article.id)}.html">阅读全文<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                </article>`).join('');
  return `<header class="blog-hero">
        <div class="container">
            <p class="section-kicker">GAME SYSTEMS · ENGINEERING PRACTICE</p>
            <h1>游戏系统与工程设计博客</h1>
            <p>围绕游戏系统、框架实践与工程决策，整理可以独立阅读的完整文章。</p>
            <div class="hero-buttons"><a class="btn btn-primary" href="#articles">阅读文章</a><a class="btn btn-secondary" href="journal.html">查看研究索引</a></div>
        </div>
    </header>
    <section class="blog-list-section" id="articles">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">ARTICLES</p><h2>${sourceData.blogs.length} 篇完整文章</h2></div></div>
            <div class="blog-card-grid">${articles}
            </div>
        </div>
    </section>`;
}

function renderAboutContent() {
  return `<section class="about-intro">
        <div class="container about-intro-grid">
            <div>
                <p class="section-kicker">ABOUT THE PRACTICE</p>
                <h1>我关心的不是模块数量，<span class="highlight">而是系统能否进入真实游戏</span></h1>
            </div>
            <div class="about-intro-copy">
                <p>我从具体游戏功能开发逐渐转向框架与系统研究，因为同一类生命周期、状态同步和玩法边界会在不同项目中反复出现。</p>
                <p>建立 Sakura Framework 的目的，是把真正能够跨项目复用的判断沉淀下来；《言铸之剑》则持续检验这些抽象有没有改善玩家体验，而不只是让代码看起来更整齐。</p>
            </div>
        </div>
    </section>

    <section class="about-story">
        <div class="container about-story-grid">
            <div class="about-story-heading"><p class="section-kicker">WHY SAKURA FRAMEWORK</p><h2>从功能实现到系统边界</h2></div>
            <div class="about-story-copy">
                <article><span>01</span><h3>先从游戏问题出发</h3><p>战斗、房间推进、UI、存档与生成内容首先是玩家体验问题，不是为了展示框架而制造的模块。</p></article>
                <article><span>02</span><h3>研究重复出现的机制</h3><p>通过设计范式、Godot 源码和工程审计理解生命周期、调度、资源与数据事实应该由谁拥有。</p></article>
                <article><span>03</span><h3>只沉淀可复用部分</h3><p>只有职责、依赖和验证边界足够清晰的结论才进入 Framework；游戏专属内容继续留在项目侧。</p></article>
            </div>
        </div>
    </section>

    <section class="about-focus">
        <div class="container">
            <div class="about-section-heading"><p class="section-kicker">CURRENT FOCUS</p><h2>当前主要开发方向</h2></div>
            <div class="about-focus-list">
                <article><h3>可验证的游戏系统</h3><p>把战斗、成长、存档和生成式玩法拆成清晰事实，并用运行截图、测试和已知限制说明结果。</p></article>
                <article><h3>小而稳定的采用路线</h3><p>优先让新项目能够快速采用少量 Supported 能力，再逐步评估 Preview 与 Experimental 模块。</p></article>
                <article><h3>研究驱动的工程判断</h3><p>持续整理游戏设计与引擎源码研究，让架构选择能够回到问题、方法和影响。</p></article>
            </div>
        </div>
    </section>

    <section class="about-preferences">
        <div class="container about-preferences-grid">
            <div><p class="section-kicker">PROJECT PREFERENCES</p><h2>我偏好的项目与工作方式</h2></div>
            <dl>
                <div><dt>项目类型</dt><dd>系统驱动的动作、Roguelike、模拟与需要长期演进工具链的 Unity 项目。</dd></div>
                <div><dt>设计取向</dt><dd>先建立玩家循环和状态事实，再选择能够支撑它们的架构；不以规模代替成熟度。</dd></div>
                <div><dt>工作方式</dt><dd>明确约束、记录证据、公开限制，让实现、验证和发布拥有可检查边界。</dd></div>
                <div><dt>交流范围</dt><dd>Unity 游戏系统、模块化框架、运行时生命周期、设计研究策展与独立开发实践。</dd></div>
            </dl>
        </div>
    </section>

    <section class="about-next">
        <div class="container about-next-inner">
            <div><p class="section-kicker">SEE THE WORK</p><h2>从真实作品开始了解这套方法</h2></div>
            <div><a href="game.html" class="btn btn-primary">查看《言铸之剑》</a><a href="contact.html" class="btn btn-secondary">查看公开入口</a></div>
        </div>
    </section>`;
}

function renderContactContent(siteData) {
  const contacts = siteData.contacts.map((contact) => {
    const content = `
                    <i class="${escapeAttribute(contact.iconFamily)} ${escapeAttribute(contact.icon)}" aria-hidden="true"></i>
                    <div><span>DIRECT CONTACT</span><h2>${escapeHtml(contact.label)}</h2><p class="public-route-value">${escapeHtml(contact.value)}</p><p>${escapeHtml(contact.description)}</p></div>`;
    if (contact.href) {
      return `
                <a class="public-route-card direct-contact-card" href="${escapeAttribute(contact.href)}">${content}
                    <i class="fas fa-paper-plane" aria-hidden="true"></i>
                </a>`;
    }
    return `
                <article class="public-route-card direct-contact-card">${content}
                </article>`;
  }).join('');
  const routes = siteData.socials.map((social) => `
                <a class="public-route-card" href="${escapeAttribute(social.url)}" target="_blank" rel="noopener noreferrer">
                    <i class="fab ${escapeAttribute(social.icon)}" aria-hidden="true"></i>
                    <div><span>VERIFIED PUBLIC ROUTE</span><h2>${escapeHtml(social.label)}</h2><p>${escapeHtml(social.description)}</p></div>
                    <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                </a>`).join('');
  return `<header class="contact-header">
        <div class="container">
            <p class="section-kicker">DIRECT CONTACT & PUBLIC ROUTES</p>
            <h1>联系方式与交流范围</h1>
            <p>可通过工作邮箱或工作 QQ 直接联系，也可以从公开主页了解代码、开发记录与作品进展。</p>
        </div>
    </header>
    <section class="public-routes">
        <div class="container public-route-list">${contacts}${routes}
        </div>
    </section>
    <section class="discussion-scope">
        <div class="container discussion-grid">
            <div><p class="section-kicker">GOOD TOPICS</p><h2>适合交流的主题</h2></div>
            <ul>
                <li><strong>Unity 游戏系统</strong><span>战斗、成长、存档、UI 与运行时生命周期。</span></li>
                <li><strong>Sakura Framework</strong><span>模块边界、成熟度、最小采用路线和验证治理。</span></li>
                <li><strong>设计与源码研究</strong><span>游戏设计范式、Godot 运行时与研究策展方法。</span></li>
                <li><strong>独立开发实践</strong><span>从原型闭环到证据展示、限制披露和持续迭代。</span></li>
            </ul>
        </div>
    </section>`;
}

function renderFrameworkAdoption(adoption) {
  const supported = adoption.supportedPackages.map((entry) => `
                    <li><span>${escapeHtml(entry.displayName)}</span><code>${escapeHtml(entry.packageName)}</code><p>${escapeHtml(entry.role)}</p></li>`).join('');
  const routes = adoption.stableRoutes.map((route) => `
                    <article>
                        <p class="section-kicker">${escapeHtml(route.id)}</p>
                        <h3>${escapeHtml(route.label)}</h3>
                        <p>${escapeHtml(route.purpose)}</p>
                        <div>${route.packages.map((id) => `<code>${escapeHtml(id)}</code>`).join('<span>→</span>')}</div>
                    </article>`).join('');
  const mappings = adoption.gameAdoption.map((entry) => `
                    <tr><th scope="row">${escapeHtml(entry.gameSystem)}</th><td>${entry.frameworkPackages.map((name) => `<code>${escapeHtml(name)}</code>`).join(' ')}</td><td>${escapeHtml(entry.evidence)}</td></tr>`).join('');
  return `<section class="adoption-section" id="adoption">
        <div class="container">
            <div class="section-heading-row">
                <div><p class="section-kicker">START SMALL, VERIFY FIRST</p><h2 class="section-title">${adoption.supportedPackages.length} 个 Supported 包与最小采用路线</h2></div>
                <p class="section-intro">Supported 统计按包计算，不把 Preview 模块包装成稳定能力。新项目应先验证最小闭包，再按需求扩展。</p>
            </div>
            <div class="supported-adoption-grid">
                <ul class="supported-package-list">${supported}
                </ul>
                <div class="stable-route-list">${routes}
                </div>
            </div>
        </div>
    </section>
    <section class="game-adoption-section" id="game-adoption">
        <div class="container">
            <div class="section-heading-row">
                <div><p class="section-kicker">VERIFIED IN A REAL PROJECT</p><h2 class="section-title">《言铸之剑》采用映射</h2></div>
                <p class="section-intro">${escapeHtml(adoption.disclaimer)}</p>
            </div>
            <div class="adoption-table-wrap">
                <table class="adoption-table">
                    <thead><tr><th>游戏系统</th><th>Framework 包</th><th>公开证据口径</th></tr></thead>
                    <tbody>${mappings}
                    </tbody>
                </table>
            </div>
        </div>
    </section>`;
}

async function writeJournalDetailSources(definitions) {
  const directory = path.join(root, 'pages/journal');
  await mkdir(directory, { recursive: true });
  await Promise.all(definitions.map(({ file, note }) => writeFile(path.join(root, file), renderJournalDetailSource(note))));
}

async function writeBlogDetailSources(definitions) {
  const directory = path.join(root, 'pages/blog');
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  await Promise.all(definitions.map((definition) => (
    writeFile(path.join(root, definition.file), renderBlogDetailSource(definition))
  )));
}

function renderBlogDetailSource({ article, markdown }) {
  const bodyMarkdown = markdown.replace(/^#\s+.+?(?:\r?\n){1,2}/u, '');
  const body = sanitizeHtml(marked.parse(bodyMarkdown), {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img',
      'details',
      'summary'
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      code: ['class'],
      th: ['align'],
      td: ['align']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false
  });
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(article.title)} | IrisSakura</title>
    <link rel="stylesheet" href="../../style/main.css">
    <link rel="stylesheet" href="../../style/blog.css">
    <link rel="stylesheet" href="../../style/pastoral.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
<a class="skip-link" href="#main-content">跳到主要内容</a>
<nav class="navbar"></nav>
<main id="main-content" class="blog-detail-main">
    <article class="container blog-article">
        <a class="journal-back" href="../blog.html"><i class="fas fa-arrow-left" aria-hidden="true"></i>返回博客</a>
        <header>
            <p class="journal-kicker">${escapeHtml(article.series)} · ${escapeHtml(article.updatedAt)}</p>
            <h1>${escapeHtml(article.title)}</h1>
            <p class="blog-deck">${escapeHtml(article.summary)}</p>
            <div class="note-tags">${article.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
        </header>
        <div class="blog-prose">${body}</div>
    </article>
</main>
<footer class="footer"></footer>
<script src="../../dist/site.js" type="module"></script>
</body>
</html>
`;
}

function renderJournalDetailSource(note) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(note.title)} | Sakura Design Journal</title>
    <link rel="stylesheet" href="../../style/main.css">
    <link rel="stylesheet" href="../../style/journal.css">
    <link rel="stylesheet" href="../../style/pastoral.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
<a class="skip-link" href="#main-content">跳到主要内容</a>
<nav class="navbar"></nav>
<main id="main-content" class="journal-detail-main">
    <article class="container journal-detail">
        <a class="journal-back" href="../journal.html"><i class="fas fa-arrow-left" aria-hidden="true"></i>返回研究记录</a>
        <header><p class="journal-kicker">${escapeHtml(note.track)} · ${escapeHtml(note.updatedAt)}</p><h1>${escapeHtml(note.title)}</h1><p>${escapeHtml(note.description)}</p><div class="note-tags">${note.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div></header>
        <div class="journal-detail-grid">
            <section><span>01 · QUESTION</span><h2>问题背景</h2><p>${escapeHtml(note.question)}</p></section>
            <section><span>02 · METHOD</span><h2>研究方法</h2><p>${escapeHtml(note.method)}</p></section>
            <section><span>03 · FINDING</span><h2>核心发现</h2><p>${escapeHtml(note.finding)}</p></section>
            <section><span>04 · IMPACT</span><h2>对框架或游戏的影响</h2><p>${escapeHtml(note.impact)}</p></section>
        </div>
        <footer class="journal-detail-update"><strong>更新时间</strong><time datetime="${escapeAttribute(note.updatedAt)}">${escapeHtml(note.updatedAt)}</time></footer>
    </article>
</main>
<footer class="footer"></footer>
<script src="../../dist/site.js" type="module"></script>
</body>
</html>
`;
}

async function assertSitePresentation(siteData, pages) {
  const contacts = siteData.contacts;
  if (!Array.isArray(contacts) || contacts.length === 0) {
    throw new Error('site contacts configuration is required');
  }
  const contactIds = new Set();
  for (const contact of contacts) {
    for (const field of ['id', 'label', 'value', 'iconFamily', 'icon', 'description']) {
      if (typeof contact[field] !== 'string' || contact[field].trim() === '') {
        throw new Error(`site contact requires ${field}`);
      }
    }
    if (!/^[a-z0-9-]+$/.test(contact.id) || contactIds.has(contact.id)) {
      throw new Error(`site contact id must be unique and stable: ${contact.id}`);
    }
    contactIds.add(contact.id);
    if (!['fas', 'fab'].includes(contact.iconFamily) || !/^fa-[a-z0-9-]+$/.test(contact.icon)) {
      throw new Error(`site contact uses an unsupported icon: ${contact.id}`);
    }
    if (contact.href !== undefined && !/^(?:mailto:|https:\/\/)/.test(contact.href)) {
      throw new Error(`site contact uses an unsupported href: ${contact.id}`);
    }
    if (contact.href?.startsWith('mailto:') && contact.href !== `mailto:${contact.value}`) {
      throw new Error(`site mail contact value and href must match: ${contact.id}`);
    }
  }

  const profile = siteData.profile;
  if (!profile || typeof profile !== 'object') {
    throw new Error('site profile configuration is required');
  }
  for (const field of ['displayName', 'initials', 'role', 'bio']) {
    if (typeof profile[field] !== 'string' || profile[field].trim() === '') {
      throw new Error(`site profile requires ${field}`);
    }
  }
  if (profile.initials.length > 4) {
    throw new Error('site profile initials must contain at most four characters');
  }
  if (!Array.isArray(profile.focuses) || profile.focuses.length === 0) {
    throw new Error('site profile requires at least one focus');
  }
  if (profile.focuses.some((focus) => typeof focus !== 'string' || focus.trim() === '')) {
    throw new Error('site profile focuses must be non-empty strings');
  }
  assertFocalPosition(profile.backgroundPosition, 'profile backgroundPosition');

  const requiredCoverKeys = [...new Set(pages.map((page) => page.coverKey).filter(Boolean))];
  if (!siteData.pageCovers || typeof siteData.pageCovers !== 'object') {
    throw new Error('site pageCovers configuration is required');
  }
  for (const coverKey of requiredCoverKeys) {
    const cover = siteData.pageCovers[coverKey];
    if (!cover || typeof cover !== 'object') {
      throw new Error(`site pageCovers is missing ${coverKey}`);
    }
    assertFocalPosition(cover.position, `page cover ${coverKey} position`);
  }

  const imageEntries = [
    ['profile avatar', profile.avatar],
    ['profile backgroundImage', profile.backgroundImage],
    ...requiredCoverKeys.map((coverKey) => [
      `page cover ${coverKey}`,
      siteData.pageCovers[coverKey].image
    ])
  ];
  for (const [label, imagePath] of imageEntries) {
    await assertLocalImage(imagePath, label);
  }
}

async function assertLocalImage(imagePath, label) {
  if (imagePath === '') return;
  if (
    typeof imagePath !== 'string'
    || !/^assets\/images\/[a-z0-9][a-z0-9._/-]*\.(?:avif|jpe?g|png|webp)$/i.test(imagePath)
    || imagePath.split('/').includes('..')
  ) {
    throw new Error(`${label} must use a local assets/images image path`);
  }
  try {
    await access(path.join(root, imagePath));
  } catch {
    throw new Error(`${label} image does not exist: ${imagePath}`);
  }
}

function assertFocalPosition(position, label) {
  const match = /^(\d{1,3})% (\d{1,3})%$/.exec(position ?? '');
  if (!match || Number(match[1]) > 100 || Number(match[2]) > 100) {
    throw new Error(`${label} must use two percentages between 0% and 100%`);
  }
}

function installPageCover(html, page, siteData, prefix) {
  if (!page.coverKey) return html;
  const targetClass = PAGE_COVER_TARGETS[page.coverKey];
  const cover = siteData.pageCovers[page.coverKey];
  const pattern = new RegExp(`<([a-z]+)([^>]*class="[^"]*\\b${targetClass}\\b[^"]*"[^>]*)>`, 'i');
  let installed = false;
  const result = html.replace(pattern, (fullMatch, tagName, rawAttributes) => {
    installed = true;
    const existingStyle = rawAttributes.match(/\sstyle="([^"]*)"/)?.[1] ?? '';
    const preservedStyle = existingStyle
      .replace(/--page-cover-image:\s*[^;]+;?/g, '')
      .replace(/--page-cover-position:\s*[^;]+;?/g, '')
      .trim();
    let attributes = rawAttributes
      .replace(/\sdata-page-cover="[^"]*"/g, '')
      .replace(/\sstyle="[^"]*"/, '')
      .replace(/class="([^"]*)"/, (classMatch, classNames) => {
        const tokens = classNames.split(/\s+/).filter(Boolean);
        if (!tokens.includes('page-cover')) tokens.push('page-cover');
        return `class="${tokens.join(' ')}"`;
      });
    const image = cover.image
      ? `url('${escapeAttribute(`${prefix}${cover.image}`)}')`
      : 'none';
    const coverStyle = `--page-cover-image: ${image}; --page-cover-position: ${escapeAttribute(cover.position)};`;
    const style = preservedStyle ? `${preservedStyle}; ${coverStyle}` : coverStyle;
    attributes += ` data-page-cover="${escapeAttribute(page.coverKey)}" style="${style}"`;
    return `<${tagName}${attributes}>`;
  });
  if (!installed) {
    throw new Error(`missing page cover target ${targetClass} in ${page.file}`);
  }
  return result;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function writeSitemap(pages, siteUrl) {
  const urls = pages.map((page) => `  <url><loc>${siteUrl}${page.canonical}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(path.join(root, 'sitemap.xml'), xml);
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function readJson(relativePath) {
  return JSON.parse(await readText(relativePath));
}
