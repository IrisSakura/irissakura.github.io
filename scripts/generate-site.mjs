import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const [site, framework, navbarTemplate, footerTemplate] = await Promise.all([
  readJson('data/site.json'),
  readJson('data/framework.json'),
  readText('components/navbar.html'),
  readText('components/footer.html')
]);

const pageDefinitions = [
  {
    file: 'index.html',
    key: 'home',
    title: 'IrisSakura | Unity 游戏系统与框架开发者',
    description: site.description,
    canonical: '/',
    image: '/assets/images/portfolio-bg.png'
  },
  {
    file: 'pages/about.html',
    key: 'about',
    title: '关于 IrisSakura | 研究、框架与游戏',
    description: '了解 IrisSakura 如何以设计与引擎研究为输入，构建 Sakura Framework，并通过《言铸之剑》验证系统设计与工程能力。',
    canonical: '/pages/about.html',
    image: '/assets/images/portfolio-bg.png'
  },
  {
    file: 'pages/framework.html',
    key: 'framework',
    title: 'Sakura Framework | 成熟度透明的 Unity 模块化框架',
    description: '查看 Sakura Framework 的真实规模、生命周期成熟度、模块分层与公开快照，区分 Supported、Preview 和 Experimental 能力。',
    canonical: '/pages/framework.html',
    image: '/assets/images/portfolio-bg.png',
    schemaType: 'SoftwareSourceCode'
  },
  {
    file: 'pages/portfolio.html',
    key: 'portfolio',
    title: '作品集 | Sakura Design Journal、Framework 与言铸之剑',
    description: '三个真实项目组成从研究、框架到游戏验证的完整链路，并公开说明状态、职责、证据和限制。',
    canonical: '/pages/portfolio.html',
    image: '/assets/images/sword-of-words/combat-room.png'
  },
  {
    file: 'pages/journal.html',
    key: 'journal',
    title: '研究记录 | Sakura Design Journal',
    description: '经过策展的游戏设计、Godot 源码研究与工程审计摘要，说明研究如何影响框架和游戏决策。',
    canonical: '/pages/journal.html',
    image: '/assets/images/portfolio-bg.png'
  },
  {
    file: 'pages/game.html',
    key: 'portfolio',
    title: '言铸之剑 | Unity 2D Roguelike 可玩原型',
    description: '《言铸之剑》是一款围绕房间推进、实时战斗、潜能构筑、生成式祝福和 Run 存档展开的 Unity 2D Roguelike 可玩原型。',
    canonical: '/pages/game.html',
    image: '/assets/images/sword-of-words/combat-room.png',
    schemaType: 'VideoGame'
  },
  {
    file: 'pages/contact.html',
    key: 'contact',
    title: '联系 IrisSakura | Unity 系统设计与框架交流',
    description: '通过已验证的 GitHub 与哔哩哔哩入口联系 IrisSakura，交流 Unity 游戏系统、框架设计和技术合作。',
    canonical: '/pages/contact.html',
    image: '/assets/images/contact-bg.png'
  },
  {
    file: 'pages/blog.html',
    key: 'journal',
    title: '研究记录已迁移 | IrisSakura',
    description: '原博客入口已收敛为真实的 Sakura Design Journal 研究记录。',
    canonical: '/pages/journal.html',
    image: '/assets/images/portfolio-bg.png',
    noIndex: true
  },
  {
    file: '404.html',
    key: '',
    title: '页面未找到 | IrisSakura',
    description: '该页面不存在。返回 IrisSakura 首页、作品集或研究记录。',
    canonical: '/404.html',
    image: '/assets/images/portfolio-bg.png',
    noIndex: true
  }
];

const navItems = [
  ['home', '首页', 'index.html'],
  ['about', '关于', 'pages/about.html'],
  ['framework', '开发框架', 'pages/framework.html'],
  ['portfolio', '作品集', 'pages/portfolio.html'],
  ['journal', '研究记录', 'pages/journal.html'],
  ['contact', '联系', 'pages/contact.html']
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

  const inPages = page.file.startsWith('pages/');
  const prefix = inPages ? '../' : '';
  const pageHref = (target) => inPages && target.startsWith('pages/')
    ? target.slice('pages/'.length)
    : `${prefix}${target}`;

  const navLinks = navItems.map(([key, label, target]) => {
    const active = page.key === key;
    return `<a href="${pageHref(target)}" class="nav-link${active ? ' active' : ''}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
  }).join('\n            ');

  const footerLinks = navItems.slice(2).map(([, label, target]) => (
    `<a href="${pageHref(target)}">${label}</a>`
  )).join('\n                ');

  const socialLinks = site.socials.map((social) => (
    `<a href="${social.url}" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="${social.label}（在新窗口打开）"><i class="fab ${social.icon}" aria-hidden="true"></i></a>`
  )).join('\n                    ');

  const navbar = navbarTemplate
    .replaceAll('{{homeHref}}', pageHref('index.html'))
    .replace('{{navLinks}}', navLinks);
  const footer = footerTemplate
    .replaceAll('{{homeHref}}', pageHref('index.html'))
    .replace('{{footerLinks}}', footerLinks)
    .replace('{{socialLinks}}', socialLinks);

  html = html
    .replace(/(?:<a class="skip-link"[\s\S]*?<\/a>\s*)?<nav class="navbar"[\s\S]*?<\/nav>/, navbar)
    .replace(/<footer class="footer">[\s\S]*?<\/footer>/, footer)
    .replace(/<main(?![^>]*\bid="main-content")/, '<main id="main-content"')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`);

  const meta = buildMeta(page, site);
  if (/<!-- site-meta:start -->[\s\S]*?<!-- site-meta:end -->/.test(html)) {
    html = html.replace(/<!-- site-meta:start -->[\s\S]*?<!-- site-meta:end -->/, meta);
  } else {
    html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n    ${meta}`);
  }

  const siteScript = `<script src="${prefix}dist/site.js" type="module"></script>`;
  if (!html.includes('dist/site.js')) {
    html = html.replace('</body>', `${siteScript}\n</body>`);
  }

  if (page.file === 'pages/framework.html') {
    html = updateFrameworkFallback(html, framework);
  }

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
    background_color: '#121212',
    theme_color: '#6a11cb',
    icons: [
      { src: '/assets/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
    ]
  }, null, 2) + '\n')
]);

function buildMeta(page, siteData) {
  const canonical = `${siteData.siteUrl}${page.canonical}`;
  const image = `${siteData.siteUrl}${page.image}`;
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

  return `<!-- site-meta:start -->
    <meta name="description" content="${escapeAttribute(page.description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
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
    <meta name="theme-color" content="#6a11cb">
    <link rel="icon" href="${page.file.startsWith('pages/') ? '../' : ''}assets/favicon.svg" type="image/svg+xml">
    <link rel="manifest" href="${page.file.startsWith('pages/') ? '../' : ''}site.webmanifest">
    <script type="application/ld+json">${JSON.stringify(structured)}</script>
    <!-- site-meta:end -->`;
}

function updateFrameworkFallback(html, data) {
  const replacements = {
    'framework-package-count': data.summary.packageCount,
    'framework-module-count': data.summary.catalogModuleCount,
    'framework-profile-count': data.summary.profileCount,
    'framework-source-commit': data.sourceCommit.slice(0, 7)
  };
  for (const [id, value] of Object.entries(replacements)) {
    html = html.replace(
      new RegExp(`(<[^>]+id="${id}"[^>]*>)[\\s\\S]*?(</[^>]+>)`),
      `$1${value}$2`
    );
  }

  const generatedDate = data.generatedAt.slice(0, 10);
  html = html.replace(
    /(<time id="framework-generated-at" datetime=")[^"]*("[^>]*>)[\s\S]*?(<\/time>)/,
    `$1${data.generatedAt}$2${generatedDate}$3`
  );
  return html;
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
