import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

import { assertFrameworkAdoptionReviewed } from './lib/framework-adoption-review.mjs';
import { assertFrameworkQuickstart, resolveQuickstartRoutes } from './lib/framework-quickstart.mjs';
import { resolveBlogDiscovery } from './lib/blog-discovery-model.mjs';
import { selectPublishedBlogs, stripBlogPublicationPreamble } from './lib/blog-publication-model.mjs';
import { assertConsumerLabCurrent } from './lib/consumer-lab-model.mjs';
import { resolveEvidenceChains } from './lib/evidence-chain-model.mjs';
import { updateFrameworkFallback } from './lib/framework-fallback.mjs';
import { assertProjectFactsCurrent } from './lib/project-facts.mjs';
import { writeSocialImages } from './lib/social-image.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE_COVER_TARGETS = {
  home: 'hero-section',
  portfolio: 'portfolio-header',
  framework: 'framework-hero',
  journal: 'journal-hero',
  blog: 'blog-hero',
  game: 'game-hero',
  contact: 'contact-header'
};

const [site, framework, frameworkAdoption, frameworkQuickstart, projects, consumerLab, journal, journalSource, blogPublication, blogTaxonomy, evidenceChainData, themeConfig, navbarTemplate, footerTemplate] = await Promise.all([
  readJson('data/site.json'),
  readJson('data/framework.json'),
  readJson('data/framework-adoption.json'),
  readJson('data/framework-quickstart.json'),
  readJson('data/projects.json'),
  readJson('data/consumer-lab.json'),
  readJson('data/journal.json'),
  readJson('data/journal-source.json'),
  readJson('config/blog-publication.json'),
  readJson('data/blog-taxonomy.json'),
  readJson('data/evidence-chains.json'),
  readJson('data/themes.json'),
  readText('components/navbar.html'),
  readText('components/footer.html')
]);

assertFrameworkAdoptionReviewed(framework, frameworkAdoption);
assertFrameworkQuickstart(frameworkQuickstart, frameworkAdoption);
assertProjectFactsCurrent(projects, framework, journal, blogPublication);
assertConsumerLabCurrent(consumerLab);
assertThemeConfig(themeConfig);

const blogBodies = new Map(await Promise.all(journalSource.blogs.map(async (article) => (
  [article.id, await readText(article.contentPath)]
))));
const gameDesignBodies = new Map(await Promise.all(journalSource.gameDesigns.map(async (design) => (
  [design.id, await readText(design.contentPath)]
))));
const publishedBlogs = selectPublishedBlogs(blogPublication, journalSource, blogBodies);
const publicationById = new Map(blogPublication.articles.map((article) => [article.sourceId, article]));
const publicJournal = {
  ...journal,
  summary: { ...journal.summary, publishedBlogCount: publishedBlogs.length }
};
const publicJournalSource = {
  ...journalSource,
  summary: { ...journalSource.summary, publishedBlogCount: publishedBlogs.length },
  blogs: publishedBlogs
};
const blogDiscovery = resolveBlogDiscovery(blogTaxonomy, publishedBlogs);
const evidenceChains = resolveEvidenceChains(evidenceChainData, frameworkAdoption, journalSource, blogPublication);

const featuredNoteById = new Map(journal.featuredNotes.map((note) => [note.id, note]));
const gameDesignIds = new Set(journalSource.gameDesigns.map((design) => design.id));
const gameDesignDetailDefinitions = journalSource.gameDesigns.map((design) => ({
  file: `pages/journal/${design.id}.html`,
  key: 'research',
  title: `${design.title} | Sakura Design Journal`,
  description: design.summary,
  canonical: `/pages/journal/${design.id}.html`,
  schemaType: 'Article',
  design,
  markdown: gameDesignBodies.get(design.id),
  note: featuredNoteById.get(design.id)
}));
const curatedOnlyDetailDefinitions = journal.featuredNotes.filter((note) => !gameDesignIds.has(note.id)).map((note) => ({
  file: `pages/journal/${note.id}.html`,
  key: 'research',
  title: `${note.title} | Sakura Design Journal`,
  description: note.description,
  canonical: `/pages/journal/${note.id}.html`,
  schemaType: 'Article',
  note
}));
const journalDetailDefinitions = [...gameDesignDetailDefinitions, ...curatedOnlyDetailDefinitions];
const blogDetailDefinitions = publishedBlogs.map((article) => ({
  file: `pages/blog/${article.slug}.html`,
  key: 'research',
  title: `${article.title} | IrisSakura`,
  description: article.summary,
  canonical: `/pages/blog/${article.slug}.html`,
  schemaType: 'Article',
  article,
  markdown: blogBodies.get(article.id),
  series: blogDiscovery.seriesByName.get(article.series),
  tags: article.tags.map((tag) => blogDiscovery.tagsByName.get(tag)),
  related: blogDiscovery.relatedBySlug.get(article.slug)
}));
const blogCollectionDefinitions = [
  ...blogDiscovery.series.map((collection) => ({
    file: `pages/blog/series/${collection.slug}.html`,
    key: 'research',
    title: `系列：${collection.name} | IrisSakura`,
    description: collection.description,
    canonical: `/pages/blog/series/${collection.slug}.html`,
    schemaType: 'CollectionPage',
    collection: { ...collection, kind: 'series', kindLabel: '文章系列' }
  })),
  ...blogDiscovery.routableTags.map((collection) => ({
    file: `pages/blog/tag/${collection.slug}.html`,
    key: 'research',
    title: `标签：${collection.name} | IrisSakura`,
    description: collection.description,
    canonical: `/pages/blog/tag/${collection.slug}.html`,
    schemaType: 'CollectionPage',
    collection: { ...collection, kind: 'tag', kindLabel: '文章标签' }
  }))
];
const blogAliasDefinitions = journalSource.blogs.flatMap((article) => {
  const publication = publicationById.get(article.id);
  if (!publication) return [];
  const isPublished = ['approved', 'published'].includes(publication.status);
  if (isPublished && publication.slug === article.id) return [];
  return [{
    file: `pages/blog/${article.id}.html`,
    key: 'research',
    title: `${isPublished ? '文章已移动' : '文章暂未发布'} | IrisSakura`,
    description: isPublished
      ? '这篇文章已迁移到稳定的语义地址。'
      : '这篇文章正在整理或审核中，请返回正式文章列表。',
    canonical: isPublished ? `/pages/blog/${publication.slug}.html` : '/pages/blog.html',
    noIndex: true,
    redirect: isPublished ? `./${publication.slug}.html` : '../blog.html#articles'
  }];
});

await writeJournalDetailSources(journalDetailDefinitions);
await writeBlogSources(blogDetailDefinitions, blogAliasDefinitions, blogCollectionDefinitions);
await writeFrameworkQuickstartSource(frameworkQuickstart);
await writeCompatibilityRouteSources();

const pageDefinitions = [
  {
    file: 'index.html',
    key: 'home',
    coverKey: 'home',
    title: 'IrisSakura | 构建可验证的 Unity 游戏系统',
    description: site.description,
    canonical: '/',
  },
  {
    file: 'pages/framework.html',
    key: 'framework',
    coverKey: 'framework',
    title: 'Sakura Framework | 成熟度透明的 Unity 模块化框架',
    description: `查看 Sakura Framework 的完整生命周期、${frameworkAdoption.supportedPackages.length} 个 Supported 包、最小稳定采用路线与《言铸之剑》的已验证使用映射。`,
    canonical: '/pages/framework.html',
    schemaType: 'SoftwareSourceCode'
  },
  {
    file: 'pages/framework-quickstart.html',
    key: 'framework',
    coverKey: 'framework',
    title: `${frameworkQuickstart.title} | IrisSakura`,
    description: '从 Core Only 到 Bootstrap Lite，在 15 分钟内完成安装、首次事件、对象池验证、诊断与清理。',
    canonical: '/pages/framework-quickstart.html',
    schemaType: 'HowTo',
    quickstart: frameworkQuickstart
  },
  {
    file: 'pages/portfolio.html',
    key: 'portfolio',
    coverKey: 'portfolio',
    title: '作品集 | 游戏、Framework 玩法项目与研究',
    description: `${projects.projects.length} 条真实作品主线与 ${consumerLab.cases.length} 个独立玩法项目，呈现从研究、框架到游戏实践的完整链路。`,
    canonical: '/pages/portfolio.html',
  },
  {
    file: 'pages/art-music.html',
    key: 'art-music',
    title: '美术与音乐作品集 | IrisSakura',
    description: 'IrisSakura 的美术与音乐作品集入口；当前尚未公开作品，后续内容将在这里持续更新。',
    canonical: '/pages/art-music.html',
    noIndex: true
  },
  {
    file: 'pages/about.html',
    key: '',
    title: '关于页面已迁移 | IrisSakura',
    description: '原关于页面的内容已经整合到 IrisSakura 首页。',
    canonical: '/',
    noIndex: true
  },
  {
    file: 'pages/journal.html',
    key: 'research',
    coverKey: 'journal',
    title: '研究记录 | Sakura Design Journal',
    description: '经过策展的游戏设计、Godot 源码研究与工程审计摘要，说明研究如何影响框架和游戏决策。',
    canonical: '/pages/journal.html',
  },
  {
    file: 'pages/game.html',
    key: 'portfolio',
    coverKey: 'game',
    title: '言铸之剑 | Unity 2D Roguelike 可玩原型',
    description: '《言铸之剑》是一款围绕房间推进、实时战斗、潜能构筑、生成式祝福和 Run 存档展开的 Unity 2D Roguelike 可玩原型。',
    canonical: '/pages/game.html',
    schemaType: 'VideoGame'
  },
  {
    file: 'pages/contact.html',
    key: 'contact',
    coverKey: 'contact',
    title: '联系 IrisSakura | Unity 系统设计与框架交流',
    description: '通过工作邮箱、工作 QQ、GitHub 与哔哩哔哩联系 IrisSakura，交流 Unity 游戏系统、框架设计和技术合作。',
    canonical: '/pages/contact.html',
  },
  {
    file: 'pages/blog.html',
    key: 'research',
    coverKey: 'blog',
    title: '博客 | 游戏系统与工程设计',
    description: '围绕游戏系统、框架实践与工程决策的完整文章。',
    canonical: '/pages/blog.html',
  },
  {
    file: '404.html',
    key: '',
    title: '页面未找到 | IrisSakura',
    description: '该页面不存在。返回 IrisSakura 首页、作品集或研究记录。',
    canonical: '/404.html',
    noIndex: true
  },
  ...journalDetailDefinitions,
  ...blogDetailDefinitions,
  ...blogCollectionDefinitions,
  ...blogAliasDefinitions
];

for (const page of pageDefinitions) {
  page.image = socialImagePath(page.file);
  page.imageAlt = `${page.title.replace(/ \| IrisSakura$/u, '')} 的 IrisSakura 分享图`;
  page.socialCategory = socialCategory(page);
}
await writeSocialImages(root, pageDefinitions);
await assertSitePresentation(site, pageDefinitions);

const navItems = [
  ['home', '首页', 'index.html'],
  ['portfolio', '作品', 'pages/portfolio.html'],
  ['art-music', '美术音乐', 'pages/art-music.html'],
  ['framework', '框架', 'pages/framework.html'],
  ['research', '研究与文章', 'pages/journal.html'],
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
    .replaceAll('{{profileAvatar}}', escapeAttribute(pageHref(site.profile.avatar)))
    .replace('{{profileAvatarAlt}}', escapeAttribute(site.profile.avatarAlt))
    .replace('{{profileNickname}}', escapeHtml(site.profile.nickname))
    .replace('{{profileRole}}', escapeHtml(site.profile.role))
    .replace('{{gameHref}}', escapeAttribute(pageHref('pages/game.html')))
    .replace('{{frameworkHref}}', escapeAttribute(pageHref('pages/framework.html')))
    .replace('{{journalHref}}', escapeAttribute(pageHref('pages/journal.html')))
    .replace('{{consumerLabHref}}', escapeAttribute(pageHref('pages/portfolio.html#consumer-lab')))
    .replace('{{contactHref}}', escapeAttribute(pageHref('pages/contact.html')))
    .replace('{{navLinks}}', navLinks)
    .replace('{{themeStorageKey}}', escapeAttribute(themeConfig.storageKey))
    .replace('{{defaultLightTheme}}', escapeAttribute(themeConfig.defaultLight))
    .replace('{{defaultDarkTheme}}', escapeAttribute(themeConfig.defaultDark))
    .replace('{{themeOptions}}', renderThemeOptions(themeConfig, prefix));
  const footer = footerTemplate
    .replaceAll('{{homeHref}}', pageHref('index.html'))
    .replace('{{footerLinks}}', footerLinks)
    .replace('{{socialLinks}}', socialLinks);

  const navbarPattern = /<!-- site-navbar:start -->[\s\S]*?<!-- site-navbar:end -->|(?:<a class="skip-link"[\s\S]*?<\/a>\s*)?<nav class="navbar"[\s\S]*?<\/nav>(?:\s*<aside\b[^>]*\bdata-bgm-player\b[\s\S]*?<\/aside>)*/;
  html = html
    .replace(navbarPattern, navbar)
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
    html = replaceGeneratedBlock(html, 'framework-evidence', renderEvidenceChains(evidenceChains));
  }
  if (page.file === 'pages/framework-quickstart.html') {
    html = replaceGeneratedBlock(
      html,
      'framework-quickstart',
      renderFrameworkQuickstart(frameworkQuickstart, frameworkAdoption)
    );
  }
  if (page.file === 'index.html') {
    html = replaceGeneratedBlock(
      html,
      'home-content',
      renderHomeContent(projects, publicJournal, framework, consumerLab, site)
    );
  }
  if (page.file === 'pages/portfolio.html') {
    html = replaceGeneratedBlock(html, 'portfolio-content', renderPortfolioContent(projects, journal, framework, consumerLab));
  }
  if (page.file === 'pages/journal.html') {
    html = replaceGeneratedBlock(html, 'journal-content', renderJournalContent(publicJournal, publicJournalSource, evidenceChains));
  }
  if (page.file === 'pages/game.html') {
    html = replaceGeneratedBlock(html, 'game-evidence', renderEvidenceChains(evidenceChains));
  }
  if (page.file === 'pages/blog.html') {
    html = replaceGeneratedBlock(html, 'blog-content', renderBlogIndex(publicJournalSource, blogDiscovery));
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
  writeRss(publishedBlogs, site),
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
  if (page.schemaType === 'HowTo' && page.quickstart) {
    structured.totalTime = `PT${page.quickstart.durationMinutes}M`;
    structured.step = page.quickstart.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: `${step.summary} 完成标准：${step.completion}`,
      url: `${canonical}#${step.id}`
    }));
  }
  if (page.schemaType === 'Article' && (page.note || page.article || page.design)) {
    const article = page.article ?? page.design ?? page.note;
    structured.author = { '@type': 'Person', name: 'IrisSakura', url: siteData.siteUrl };
    structured.headline = article.title;
    structured.image = image;
    if (page.article) structured.datePublished = article.publishedAt;
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
    <meta property="og:image:alt" content="${escapeAttribute(page.imageAlt)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttribute(page.title)}">
    <meta name="twitter:description" content="${escapeAttribute(page.description)}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:image:alt" content="${escapeAttribute(page.imageAlt)}">
    ${page.noIndex ? '<meta name="robots" content="noindex, follow">' : '<!-- indexable page -->'}
    <meta name="theme-color" content="${defaultThemeColor}">
    <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
    <link rel="manifest" href="${prefix}site.webmanifest">
    <link rel="alternate" type="application/rss+xml" title="IrisSakura 正式文章" href="${prefix}rss.xml">
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
    if (!/^assets\/images\/profile\/home-hero-[a-z0-9-]+\.png$/u.test(theme.homeHeroImage ?? '')) {
      throw new Error(`theme ${theme.id} has invalid homeHeroImage`);
    }
    if (!/^\d+(?:\.\d+)?% \d+(?:\.\d+)?%$/u.test(theme.homeHeroPosition ?? '')) {
      throw new Error(`theme ${theme.id} has invalid homeHeroPosition`);
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

function renderThemeOptions(config, prefix) {
  const options = [
    `<option value="system">${escapeHtml(config.systemLabel)}</option>`,
    ...config.themes.map((theme) => (
      `<option value="${escapeAttribute(theme.id)}" data-color-scheme="${theme.colorScheme}" data-theme-color="${theme.themeColor}" data-home-hero-image="${escapeAttribute(`${prefix}${theme.homeHeroImage}`)}" data-home-hero-position="${escapeAttribute(theme.homeHeroPosition)}">${escapeHtml(theme.label)}</option>`
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
        themeColor: theme.themeColor,
        homeHeroImage: `${prefix}${theme.homeHeroImage}`,
        homeHeroPosition: theme.homeHeroPosition
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
            const homeHeroImage = new URL(config.themes[theme].homeHeroImage, window.location.href).href;
            document.documentElement.style.setProperty('--home-hero-image', "url('" + homeHeroImage + "')");
            document.documentElement.style.setProperty('--home-hero-position', config.themes[theme].homeHeroPosition);
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

function replaceGeneratedBlock(html, name, content) {
  const pattern = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
  if (!pattern.test(html)) {
    throw new Error(`missing generated block: ${name}`);
  }
  return html.replace(pattern, `<!-- ${name}:start -->\n${content}\n<!-- ${name}:end -->`);
}

function renderHomeContent(projectData, journalData, frameworkData, consumerLabData, siteData) {
  const game = projectData.projects.find((project) => project.id === 'sword-of-words');
  if (!game) throw new Error('missing sword-of-words project');
  const { profile } = siteData;
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
        <section id="profile" class="hero-section profile-hero">
            <div class="container profile-hero-inner">
                <div class="profile-identity">
                    <img class="profile-avatar-large" src="${escapeAttribute(profile.avatar)}" alt="${escapeAttribute(profile.avatarAlt)}">
                    <div class="profile-copy">
                        <p class="section-kicker">UNITY SYSTEMS · GAMEPLAY · TOOLS</p>
                        <h1 class="hero-title">你好，我是 <span class="highlight">${escapeHtml(profile.nickname)}</span></h1>
                        <p class="profile-role">${escapeHtml(profile.role)}</p>
                        <p class="hero-description">${escapeHtml(profile.introduction)}</p>
                    </div>
                    <div class="hero-buttons">
                        <a href="pages/game.html" class="btn btn-primary">查看代表作</a>
                        <a href="https://github.com/IrisSakura" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">查看 GitHub</a>
                    </div>
                </div>
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

        <section class="focus-section">
            <div class="container">
                <div class="section-heading">
                    <p class="section-kicker">MORE FOCUSED WORK</p>
                    <h2>围绕代表作继续展开的三条主线</h2>
                    <p>框架、研究与真实消费项目分别承接复用、判断和验证，让首页重点明确而不失完整脉络。</p>
                </div>
                <div class="focus-grid">
                    <article class="focus-card" data-home-focus>
                        <p class="focus-index">01 · REUSABLE SYSTEMS</p>
                        <strong>${frameworkData.lifecycleCounts.Supported}</strong>
                        <h3>Sakura Framework</h3>
                        <p>把游戏中的稳定边界沉淀为可复用 Unity 包，并持续记录生命周期与验证状态。</p>
                        <a href="pages/framework.html" class="text-link">查看框架</a>
                    </article>
                    <article class="focus-card" data-home-focus>
                        <p class="focus-index">02 · DESIGN RESEARCH</p>
                        <strong>${journalData.summary.gameDesignCount}</strong>
                        <h3>Sakura Design Journal</h3>
                        <p>从机制、源码和实际约束出发，保留可追溯的研究判断与设计结论。</p>
                        <a href="pages/journal.html" class="text-link">查看研究</a>
                    </article>
                    <article class="focus-card" data-home-focus>
                        <p class="focus-index">03 · REAL CONSUMERS</p>
                        <strong>${consumerLabData.cases.length}</strong>
                        <h3>Consumer Lab</h3>
                        <p>用独立玩法项目检验 Framework 能力是否真正落入可理解、可运行的游戏循环。</p>
                        <a href="pages/portfolio.html#consumer-lab" class="text-link">查看消费项目</a>
                    </article>
                </div>
            </div>
        </section>

        <section class="research-section">
            <div class="container">
                <div class="section-heading section-heading-row">
                    <div><p class="section-kicker">SELECTED RESEARCH</p><h2>精选研究主题</h2></div>
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

function renderPortfolioContent(projectData, journalData, frameworkData, consumerLabData) {
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
        ${renderConsumerLab(consumerLabData)}
    </div>`;
}

function renderConsumerLab(consumerLabData) {
  const cards = consumerLabData.cases.map((entry, index) => {
    const highlights = entry.highlights
      .map((highlight) => `<li>${escapeHtml(highlight)}</li>`)
      .join('');
    return `<article class="consumer-lab-card" id="consumer-${escapeAttribute(entry.id)}">
                    <div class="consumer-lab-card-topline"><span class="consumer-lab-index">0${index + 1}</span><span class="consumer-lab-category">${escapeHtml(entry.category)}</span></div>
                    <h3>${escapeHtml(entry.title)}</h3>
                    <p class="consumer-lab-summary">${escapeHtml(entry.summary)}</p>
                    <div class="consumer-lab-systems"><p>核心系统</p><ul class="consumer-lab-highlights" aria-label="${escapeAttribute(entry.title)} 核心系统">${highlights}</ul></div>
                </article>`;
  }).join('\n                ');

  return `<section class="consumer-lab" id="consumer-lab" aria-label="${consumerLabData.cases.length} 个独立玩法项目">
            <div class="consumer-lab-heading">
                <p class="section-kicker">FRAMEWORK PLAYGROUNDS</p><h2>${escapeHtml(consumerLabData.title)}</h2><p class="consumer-lab-intro">${escapeHtml(consumerLabData.description)}</p>
            </div>
            <div class="consumer-lab-grid">${cards}
            </div>
        </section>`;
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

function renderJournalContent(journalData, sourceData, chains) {
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
                    <a class="note-link" href="journal/${encodeURIComponent(design.id)}.html">阅读完整研究结构<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
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
                <div class="journal-metric journal-metric-with-note"><strong>${journalData.summary.importedBlogCount}</strong><span>完整博客</span><small>${journalData.summary.publishedBlogCount} 篇已公开</small></div>
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
            <div class="journal-section-heading"><div><p class="journal-kicker">GAME DESIGN LIBRARY</p><h2 id="game-design-library-title">全部游戏设计范式研究结构</h2></div><p>${sourceData.gameDesigns.length} 个主题均提供独立完整正文；精选主题额外保留问题、方法、发现与影响摘要。</p></div>
            <div class="journal-scroll-region journal-design-scroll" role="region" aria-labelledby="game-design-library-title" tabindex="0">
                <div class="design-summary-grid">${gameDesigns}
                </div>
            </div>
        </div>
    </section>
${renderEvidenceChains(chains)}
    <section class="journal-section">
        <div class="container">
            <div class="journal-bridge">
                <div><p class="journal-kicker">RESEARCH → SYSTEM → WORK</p><h2>记录的价值，在于改变下一次实现</h2><p>只有能够跨项目复用的结论，才进入 Sakura Framework；只有被实际作品验证的能力，才成为作品集证据。</p></div>
                <div class="bridge-actions"><a class="bridge-card" href="framework.html"><span>02 / SYSTEM</span><strong>Sakura Framework</strong><i class="fas fa-arrow-right" aria-hidden="true"></i></a><a class="bridge-card" href="game.html"><span>03 / WORK</span><strong>《言铸之剑》</strong><i class="fas fa-arrow-right" aria-hidden="true"></i></a></div>
            </div>
        </div>
    </section>`;
}

function renderEvidenceChains(chains) {
  const cards = chains.map((chain, index) => {
    const researchLinks = chain.research.map((reference) => `<a href="${escapeAttribute(reference.href)}"><span>${reference.type === 'article' ? '正式文章' : '设计索引'}</span><strong>${escapeHtml(reference.title)}</strong><small>${escapeHtml(reference.relation)}</small></a>`).join('');
    return `<article class="evidence-chain-card" id="evidence-chain-${escapeAttribute(chain.id)}">
                    <p class="evidence-chain-index">0${index + 1} · ${escapeHtml(chain.gameSystem)}</p>
                    <h3>${escapeHtml(chain.title)}</h3>
                    <p class="evidence-chain-question">${escapeHtml(chain.question)}</p>
                    <div class="evidence-chain-path" aria-label="游戏、框架与研究证据">
                        <a href="game.html#${escapeAttribute(chain.gameAnchor)}"><span>GAME</span><strong>《言铸之剑》</strong><small>${escapeHtml(chain.gameSystem)}</small></a>
                        <a href="framework.html#game-adoption"><span>FRAMEWORK</span><strong>${chain.frameworkPackages.map((name) => `<code>${escapeHtml(name)}</code>`).join(' ')}</strong><small>${escapeHtml(chain.adoptionEvidence)}</small></a>
                        <div class="evidence-chain-research"><span>RESEARCH</span>${researchLinks}</div>
                    </div>
                    <p class="evidence-chain-limit"><strong>证据边界</strong>${escapeHtml(chain.limitation)}</p>
                </article>`;
  }).join('');
  return `<section class="evidence-chain-section" aria-labelledby="evidence-chain-title">
        <div class="container">
            <div class="section-heading">
                <p class="section-kicker">RESEARCH ↔ FRAMEWORK ↔ GAME</p>
                <h2 id="evidence-chain-title">从研究判断到游戏验证的公开证据链</h2>
                <p>同一条链同时指向游戏系统、Framework 采用映射和研究依据；公开证据不足的部分直接写在边界里。</p>
            </div>
            <div class="evidence-chain-grid">${cards}
            </div>
        </div>
    </section>`;
}

function renderBlogIndex(sourceData, discovery) {
  const articles = sourceData.blogs.map((article) => {
    const series = discovery.seriesByName.get(article.series);
    return `
                <article class="blog-card">
                    <p class="project-status"><a href="blog/series/${escapeAttribute(series.slug)}.html">${escapeHtml(article.series)}</a> · ${escapeHtml(article.updatedAt)}</p>
                    <h2>${escapeHtml(article.title)}</h2>
                    <p>${escapeHtml(article.summary)}</p>
                    <div class="note-tags">${article.tags.map((tag) => {
                      const collection = discovery.tagsByName.get(tag);
                      return collection.articles.length >= 2
                        ? `<a href="blog/tag/${escapeAttribute(collection.slug)}.html">${escapeHtml(tag)}</a>`
                        : `<span>${escapeHtml(tag)}</span>`;
                    }).join('')}</div>
                    <a class="note-link" href="blog/${encodeURIComponent(article.slug)}.html">阅读全文<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                </article>`;
  }).join('');
  const series = discovery.series.map((entry) => `<a href="blog/series/${escapeAttribute(entry.slug)}.html"><strong>${escapeHtml(entry.name)}</strong><span>${entry.articles.length} 篇</span><small>${escapeHtml(entry.description)}</small></a>`).join('');
  const tags = discovery.routableTags.map((entry) => `<a href="blog/tag/${escapeAttribute(entry.slug)}.html">${escapeHtml(entry.name)}<span>${entry.articles.length}</span></a>`).join('');
  return `<header class="blog-hero">
        <div class="container">
            <p class="section-kicker">GAME SYSTEMS · ENGINEERING PRACTICE</p>
            <h1>游戏系统与工程设计博客</h1>
            <p>围绕游戏系统、框架实践与工程决策，整理可以独立阅读的完整文章。</p>
            <div class="hero-buttons"><a class="btn btn-primary" href="#articles">阅读文章</a><a class="btn btn-secondary" href="journal.html">查看研究索引</a><a class="btn btn-secondary" href="../rss.xml"><i class="fas fa-rss" aria-hidden="true"></i>订阅 RSS</a></div>
        </div>
    </header>
    <section class="blog-taxonomy" aria-labelledby="blog-taxonomy-title">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">SERIES & TAGS</p><h2 id="blog-taxonomy-title">按系列与主题继续阅读</h2></div><p>分类只覆盖已经正式发布的文章；草稿不会进入聚合页或订阅。</p></div>
            <div class="blog-series-list">${series}</div>
            <div class="blog-tag-list" aria-label="文章标签">${tags}</div>
        </div>
    </section>
    <section class="blog-list-section" id="articles">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">ARTICLES</p><h2>${sourceData.blogs.length} 篇正式文章</h2></div></div>
            <div class="blog-card-grid">${articles}
            </div>
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
            <p class="contact-independence">${escapeHtml(siteData.independenceNotice)}</p>
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
            <aside class="adoption-quickstart-callout" aria-labelledby="adoption-quickstart-title">
                <div><p class="section-kicker">GUIDED FIRST RUN</p><h3 id="adoption-quickstart-title">把稳定路线真正跑一遍</h3><p>从安装入口开始，在 15 分钟内完成 Core Only、Bootstrap Lite、第一次事件、对象池验证与清理。</p></div>
                <a class="btn btn-primary" href="framework-quickstart.html">开始 15 分钟教程</a>
            </aside>
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

function renderFrameworkQuickstart(quickstart, adoption) {
  const routes = resolveQuickstartRoutes(quickstart, adoption);
  const routesById = new Map(routes.map((route) => [route.id, route]));
  const renderList = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const renderPackages = (route) => route.packages.map((entry, index) => (
    `${index > 0 ? '<span aria-hidden="true">→</span>' : ''}<code>${escapeHtml(entry.packageName)}</code>`
  )).join('');
  const routeCards = routes.map((route, index) => `<article>
                    <span class="quickstart-route-index">0${index + 1}</span>
                    <p class="section-kicker">${escapeHtml(route.id)}</p>
                    <h3>${escapeHtml(route.label)}</h3>
                    <p>${escapeHtml(route.purpose)}</p>
                    <div class="quickstart-package-sequence">${renderPackages(route)}</div>
                </article>`).join('');
  const steps = quickstart.steps.map((step, index) => {
    const route = step.routeId ? routesById.get(step.routeId) : null;
    const routeBlock = route ? `<div class="quickstart-step-route" aria-label="${escapeAttribute(route.label)} 包清单">
                            <strong>${escapeHtml(route.label)}</strong>
                            <div class="quickstart-package-sequence">${renderPackages(route)}</div>
                        </div>` : '';
    const codeBlock = step.code ? `<div class="quickstart-code">
                            <p>可复制的最小探针</p>
                            <pre tabindex="0" aria-label="${escapeAttribute(step.title)} C# 示例"><code>${escapeHtml(step.code)}</code></pre>
                        </div>` : '';
    return `<li class="quickstart-step" id="${escapeAttribute(step.id)}">
                    <div class="quickstart-step-marker" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>
                    <article>
                        <header><p class="section-kicker">${step.startMinute}–${step.endMinute} MIN</p><h2>${escapeHtml(step.title)}</h2></header>
                        <p class="quickstart-step-summary">${escapeHtml(step.summary)}</p>
                        ${routeBlock}
                        <ol>${renderList(step.actions)}</ol>
                        ${codeBlock}
                        <p class="quickstart-done"><strong>完成标准</strong><span>${escapeHtml(step.completion)}</span></p>
                    </article>
                </li>`;
  }).join('');
  const troubleshooting = quickstart.troubleshooting.map((entry) => `<article>
                    <h3>${escapeHtml(entry.symptom)}</h3>
                    <p>${escapeHtml(entry.resolution)}</p>
                </article>`).join('');

  return `<section class="quickstart-boundary" aria-labelledby="quickstart-boundary-title">
        <div class="container quickstart-boundary-grid">
            <div>
                <p class="section-kicker">BEFORE YOU START</p>
                <h2 id="quickstart-boundary-title">准备与完成标准</h2>
                <ul>${renderList(quickstart.prerequisites)}</ul>
            </div>
            <aside>
                <span>${escapeHtml(quickstart.channel.label)}</span>
                <code>${escapeHtml(quickstart.channel.packageName)}</code>
                <a class="btn btn-primary" href="${escapeAttribute(quickstart.channel.installUrl)}" target="_blank" rel="noopener noreferrer">打开安装 URL <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
                <p>正式项目不要把 <code>#main</code> 当作 Stable。</p>
            </aside>
        </div>
    </section>
    <section class="quickstart-routes" aria-labelledby="quickstart-routes-title">
        <div class="container">
            <div class="section-heading-row">
                <div><p class="section-kicker">REVIEWED ROUTES</p><h2 class="section-title" id="quickstart-routes-title">包名来自已复核的稳定路线</h2></div>
                <p class="section-intro">这里不维护第二份包清单：路线 ID 解析到 Framework adoption 注册表，事实漂移时构建会失败。</p>
            </div>
            <div class="quickstart-route-grid">${routeCards}</div>
            <div class="quickstart-stable-guidance"><h3>正式项目的版本边界</h3><ul>${renderList(quickstart.stableGuidance)}</ul></div>
        </div>
    </section>
    <section class="quickstart-steps" aria-labelledby="quickstart-steps-title">
        <div class="container">
            <div class="section-heading-row">
                <div><p class="section-kicker">FOLLOW IN ORDER</p><h2 class="section-title" id="quickstart-steps-title">六步完成第一次可验证运行</h2></div>
                <p class="quickstart-duration"><strong>${quickstart.durationMinutes}</strong><span>分钟</span></p>
            </div>
            <ol class="quickstart-timeline">${steps}</ol>
        </div>
    </section>
    <section class="quickstart-verification" aria-labelledby="quickstart-verification-title">
        <div class="container quickstart-verification-grid">
            <div><p class="section-kicker">DONE MEANS VERIFIED</p><h2 id="quickstart-verification-title">不要停在“包已出现”</h2><ul>${renderList(quickstart.completionChecks)}</ul></div>
            <aside><span class="preview-badge">${escapeHtml(quickstart.runtimeStarter.maturity)}</span><h3>Runtime Starter 是可选自检</h3><p>${escapeHtml(quickstart.runtimeStarterGuide.summary)}</p><h4>必须通过</h4><ul>${renderList(quickstart.runtimeStarterGuide.requiredChecks)}</ul><h4>允许的结构化跳过</h4><ul>${renderList(quickstart.runtimeStarterGuide.optionalChecks)}</ul></aside>
        </div>
    </section>
    <section class="quickstart-support" aria-labelledby="quickstart-support-title">
        <div class="container">
            <div class="section-heading-row"><div><p class="section-kicker">FAIL CLOSED</p><h2 class="section-title" id="quickstart-support-title">故障诊断</h2></div><p class="section-intro">错误必须能够解释和回退；不要把缺失依赖或未执行步骤包装成成功。</p></div>
            <div class="quickstart-troubleshooting">${troubleshooting}</div>
        </div>
    </section>
    <section class="quickstart-cleanup" aria-labelledby="quickstart-cleanup-title">
        <div class="container quickstart-cleanup-inner"><div><p class="section-kicker">LEAVE NO PROBE BEHIND</p><h2 id="quickstart-cleanup-title">清理与卸载边界</h2></div><ol>${renderList(quickstart.cleanup)}</ol><a class="btn btn-secondary" href="framework.html">返回 Framework 成熟度页</a></div>
    </section>`;
}

async function writeFrameworkQuickstartSource(quickstart) {
  const file = path.join(root, 'pages/framework-quickstart.html');
  await writeFile(file, `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(quickstart.title)} | IrisSakura</title>
    <link rel="stylesheet" href="../style/main.css">
    <link rel="stylesheet" href="../style/framework.css">
    <link rel="stylesheet" href="../style/pastoral.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
<a class="skip-link" href="#main-content">跳到主要内容</a>
<nav class="navbar"></nav>
<main id="main-content" class="main-content quickstart-main">
    <section class="framework-hero quickstart-hero">
        <div class="container framework-hero-grid">
            <div class="framework-hero-copy">
                <p class="section-kicker">CORE ONLY → BOOTSTRAP LITE</p>
                <h1>${escapeHtml(quickstart.title)}</h1>
                <p class="framework-subtitle">从安装到第一次事件和对象复用，用可观察结果确认最小稳定组合真正可用。</p>
                <div class="framework-actions"><a href="#install-editor-tools" class="btn btn-primary">开始计时</a><a href="framework.html" class="btn btn-secondary">先看成熟度</a></div>
            </div>
            <aside class="quickstart-hero-summary" aria-label="教程范围">
                <strong>${quickstart.durationMinutes}<span>分钟</span></strong>
                <p>六个有完成标准的步骤</p>
                <ul><li>Core Only</li><li>Bootstrap Lite</li><li>Event + Pooling</li></ul>
            </aside>
        </div>
    </section>
    <!-- framework-quickstart:start -->
    <!-- framework-quickstart:end -->
</main>
<footer class="footer"></footer>
<script src="../dist/site.js" type="module"></script>
</body>
</html>
`);
}

async function writeCompatibilityRouteSources() {
  await writeFile(path.join(root, 'pages/about.html'), `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0; url=../index.html">
    <title>关于页面已迁移 | IrisSakura</title>
    <link rel="stylesheet" href="../style/main.css">
    <link rel="stylesheet" href="../style/pastoral.css">
</head>
<body>
<a class="skip-link" href="#main-content">跳到主要内容</a>
<nav class="navbar"></nav>
<main id="main-content" class="not-found-main">
    <section class="container not-found-card">
        <p class="section-kicker">ROUTE MOVED</p>
        <h1>关于内容已整合到首页</h1>
        <p>这个旧地址会自动前往首页；你也可以使用下方链接继续访问。</p>
        <a class="btn btn-primary" href="../index.html">前往首页</a>
    </section>
</main>
<footer class="footer"></footer>
<script src="../dist/site.js" type="module"></script>
</body>
</html>
`);
}

async function writeJournalDetailSources(definitions) {
  const directory = path.join(root, 'pages/journal');
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  await Promise.all(definitions.map((definition) => writeFile(
    path.join(root, definition.file),
    definition.design ? renderGameDesignDetailSource(definition) : renderJournalDetailSource(definition.note)
  )));
}

async function writeBlogSources(definitions, aliases, collections) {
  const directory = path.join(root, 'pages/blog');
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  await Promise.all([
    ...definitions.map((definition) => (
      writeFile(path.join(root, definition.file), renderBlogDetailSource(definition))
    )),
    ...aliases.map((definition) => (
      writeFile(path.join(root, definition.file), renderBlogAliasSource(definition))
    )),
    ...collections.map(async (definition) => {
      const file = path.join(root, definition.file);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, renderBlogCollectionSource(definition));
    })
  ]);
}

function renderBlogDetailSource({ article, markdown, series, tags, related }) {
  const bodyMarkdown = stripBlogPublicationPreamble(markdown);
  const body = renderPublicMarkdown(bodyMarkdown);
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
            <p class="journal-kicker"><a href="series/${escapeAttribute(series.slug)}.html">${escapeHtml(article.series)}</a> · 发布于 ${escapeHtml(article.publishedAt)} · 更新于 ${escapeHtml(article.updatedAt)}</p>
            <h1>${escapeHtml(article.title)}</h1>
            <p class="blog-deck">${escapeHtml(article.summary)}</p>
            <div class="note-tags">${tags.map((tag) => (
              tag.articles.length >= 2
                ? `<a href="tag/${escapeAttribute(tag.slug)}.html">${escapeHtml(tag.name)}</a>`
                : `<span>${escapeHtml(tag.name)}</span>`
            )).join('')}</div>
        </header>
        <div class="blog-prose">${body}</div>
        <aside class="related-articles" aria-labelledby="related-articles-title">
            <p class="journal-kicker">CONTINUE READING</p>
            <h2 id="related-articles-title">相关文章</h2>
            <div>${related.map(({ article: item, relation }) => `<a href="${escapeAttribute(item.slug)}.html"><span>${escapeHtml(relation)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.summary)}</small></a>`).join('')}</div>
        </aside>
    </article>
</main>
<footer class="footer"></footer>
<script src="../../dist/site.js" type="module"></script>
</body>
</html>
`;
}

function renderGameDesignDetailSource({ design, markdown, note }) {
  const body = renderPublicMarkdown(markdown);
  const curatedSummary = note ? `<section class="journal-research-summary" aria-labelledby="curated-summary-title">
            <p class="journal-kicker">SELECTED RESEARCH SUMMARY</p>
            <h2 id="curated-summary-title">精选研究结构摘要</h2>
            <div class="journal-detail-grid">
                <section><span>01 · QUESTION</span><h3>问题背景</h3><p>${escapeHtml(note.question)}</p></section>
                <section><span>02 · METHOD</span><h3>研究方法</h3><p>${escapeHtml(note.method)}</p></section>
                <section><span>03 · FINDING</span><h3>核心发现</h3><p>${escapeHtml(note.finding)}</p></section>
                <section><span>04 · IMPACT</span><h3>对框架或游戏的影响</h3><p>${escapeHtml(note.impact)}</p></section>
            </div>
        </section>` : '';
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(design.title)} | Sakura Design Journal</title>
    <link rel="stylesheet" href="../../style/main.css">
    <link rel="stylesheet" href="../../style/journal.css">
    <link rel="stylesheet" href="../../style/blog.css">
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
    <article class="container journal-detail journal-research-detail">
        <a class="journal-back" href="../journal.html#design-${escapeAttribute(design.id)}"><i class="fas fa-arrow-left" aria-hidden="true"></i>返回游戏设计范式</a>
        <header><p class="journal-kicker">游戏设计范式 · ${escapeHtml(design.updatedAt)}</p><h1>${escapeHtml(design.title)}</h1><p>${escapeHtml(design.summary)}</p><div class="note-tags">${design.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div></header>
        ${curatedSummary}
        <section class="journal-research-body" aria-labelledby="complete-research-title">
            <div class="journal-prose-heading"><p class="journal-kicker">COMPLETE RESEARCH</p><h2 id="complete-research-title">完整研究结构</h2></div>
            <div class="blog-prose research-prose">${body}</div>
        </section>
        <footer class="journal-detail-update"><strong>更新时间</strong><time datetime="${escapeAttribute(design.updatedAt)}">${escapeHtml(design.updatedAt)}</time></footer>
    </article>
</main>
<footer class="footer"></footer>
<script src="../../dist/site.js" type="module"></script>
</body>
</html>
`;
}

function renderPublicMarkdown(markdown) {
  const headingCounts = new Map();
  const renderer = new marked.Renderer();
  renderer.heading = ({ depth, text }) => {
    const base = markdownHeadingId(text) || 'section';
    const count = headingCounts.get(base) ?? 0;
    headingCounts.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;
    return `<h${depth} id="${escapeAttribute(id)}">${marked.parseInline(text)}</h${depth}>`;
  };
  return sanitizeHtml(marked.parse(markdown, { renderer }), {
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
      h2: ['id'],
      h3: ['id'],
      h4: ['id'],
      h5: ['id'],
      h6: ['id'],
      th: ['align'],
      td: ['align']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false
  });
}

function markdownHeadingId(text) {
  return text
    .toLocaleLowerCase('zh-CN')
    .replace(/<[^>]*>/gu, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/[\s-]+/gu, '-');
}

function renderBlogCollectionSource({ collection }) {
  const articles = collection.articles.map((article) => `<article class="blog-card">
                    <p class="project-status">${escapeHtml(article.series)} · ${escapeHtml(article.updatedAt)}</p>
                    <h2>${escapeHtml(article.title)}</h2>
                    <p>${escapeHtml(article.summary)}</p>
                    <a class="note-link" href="../${escapeAttribute(article.slug)}.html">阅读全文<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                </article>`).join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(collection.kindLabel)}：${escapeHtml(collection.name)} | IrisSakura</title>
    <link rel="stylesheet" href="../../../style/main.css">
    <link rel="stylesheet" href="../../../style/blog.css">
    <link rel="stylesheet" href="../../../style/pastoral.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
<a class="skip-link" href="#main-content">跳到主要内容</a>
<nav class="navbar"></nav>
<main id="main-content" class="blog-main blog-collection-main">
    <header class="blog-collection-hero">
        <div class="container">
            <a class="journal-back" href="../../blog.html"><i class="fas fa-arrow-left" aria-hidden="true"></i>返回全部文章</a>
            <p class="section-kicker">${escapeHtml(collection.kindLabel)} · ${collection.articles.length} 篇正式文章</p>
            <h1>${escapeHtml(collection.name)}</h1>
            <p>${escapeHtml(collection.description)}</p>
        </div>
    </header>
    <section class="blog-list-section">
        <div class="container blog-card-grid">${articles}
        </div>
    </section>
</main>
<footer class="footer"></footer>
<script src="../../../dist/site.js" type="module"></script>
</body>
</html>
`;
}

function renderBlogAliasSource({ redirect, title, description }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0; url=${escapeAttribute(redirect)}">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="../../style/main.css">
    <link rel="stylesheet" href="../../style/blog.css">
    <link rel="stylesheet" href="../../style/pastoral.css">
</head>
<body>
<a class="skip-link" href="#main-content">跳到主要内容</a>
<nav class="navbar"></nav>
<main id="main-content" class="blog-detail-main">
    <article class="container blog-article">
        <header><h1>${escapeHtml(title.replace(/ \| IrisSakura$/u, ''))}</h1><p class="blog-deck">${escapeHtml(description)}</p></header>
        <p><a class="note-link" href="${escapeAttribute(redirect)}">继续访问</a></p>
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
  if (typeof siteData.independenceNotice !== 'string' || siteData.independenceNotice.trim().length < 24) {
    throw new Error('site independenceNotice must explain the personal and employer boundary');
  }
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

function socialImagePath(file) {
  const slug = file
    .replace(/\.html$/u, '')
    .replaceAll('/', '-')
    .replace(/[^a-z0-9-]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return `/assets/social/${slug}.png`;
}

function socialCategory(page) {
  if (page.article) return 'article';
  if (page.file === 'index.html') return 'home';
  if (page.file === 'pages/portfolio.html') return 'portfolio';
  if (page.file === 'pages/game.html') return 'game';
  if (page.file === 'pages/contact.html') return 'contact';
  if (page.file.startsWith('pages/framework')) return 'framework';
  if (page.file.startsWith('pages/journal') || page.file.startsWith('pages/blog')) return 'research';
  return 'site';
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

async function writeRss(articles, siteData) {
  const sorted = [...articles].sort((left, right) => (
    right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug)
  ));
  const latestUpdate = [...articles].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0].updatedAt;
  const items = sorted.map((article) => {
    const url = `${siteData.siteUrl}/pages/blog/${article.slug}.html`;
    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(article.summary)}</description>
      <pubDate>${new Date(`${article.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
${article.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>IrisSakura 正式文章</title>
    <link>${escapeXml(`${siteData.siteUrl}/pages/blog.html`)}</link>
    <description>${escapeXml('游戏系统、Framework 工程实践与可复核设计判断。')}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date(`${latestUpdate}T00:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteData.siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  await writeFile(path.join(root, 'rss.xml'), xml);
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
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
