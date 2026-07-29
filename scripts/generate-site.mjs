import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const [site, framework, frameworkAdoption, projects, journal, navbarTemplate, footerTemplate] = await Promise.all([
  readJson('data/site.json'),
  readJson('data/framework.json'),
  readJson('data/framework-adoption.json'),
  readJson('data/projects.json'),
  readJson('data/journal.json'),
  readText('components/navbar.html'),
  readText('components/footer.html')
]);

if (frameworkAdoption.sourceCommit !== framework.sourceCommit) {
  throw new Error(`framework adoption snapshot ${frameworkAdoption.sourceCommit} does not match framework snapshot ${framework.sourceCommit}`);
}

const journalDetailDefinitions = journal.featuredNotes.map((note) => ({
  file: `pages/journal/${note.id}.html`,
  key: 'journal',
  title: `${note.title} | Sakura Design Journal`,
  description: note.description,
  canonical: `/pages/journal/${note.id}.html`,
  image: '/assets/images/home-preview.png',
  schemaType: 'Article',
  note
}));

await writeJournalDetailSources(journalDetailDefinitions);

const pageDefinitions = [
  {
    file: 'index.html',
    key: 'home',
    title: 'IrisSakura | 构建可验证的 Unity 游戏系统',
    description: site.description,
    canonical: '/',
    image: '/assets/images/home-preview.png'
  },
  {
    file: 'pages/about.html',
    key: 'about',
    title: '关于 IrisSakura | 研究、框架与游戏',
    description: '了解 IrisSakura 如何以设计与引擎研究为输入，构建 Sakura Framework，并通过《言铸之剑》验证系统设计与工程能力。',
    canonical: '/pages/about.html',
    image: '/assets/images/home-preview.png'
  },
  {
    file: 'pages/framework.html',
    key: 'framework',
    title: 'Sakura Framework | 成熟度透明的 Unity 模块化框架',
    description: '查看 Sakura Framework 的完整生命周期、4 个 Supported 包、最小稳定采用路线与《言铸之剑》的已验证使用映射。',
    canonical: '/pages/framework.html',
    image: '/assets/images/home-preview.png',
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
    image: '/assets/images/home-preview.png'
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
    image: '/assets/images/home-preview.png'
  },
  {
    file: 'pages/blog.html',
    key: 'journal',
    title: '研究记录已迁移 | IrisSakura',
    description: '原博客入口已收敛为真实的 Sakura Design Journal 研究记录。',
    canonical: '/pages/journal.html',
    image: '/assets/images/home-preview.png',
    noIndex: true
  },
  {
    file: '404.html',
    key: '',
    title: '页面未找到 | IrisSakura',
    description: '该页面不存在。返回 IrisSakura 首页、作品集或研究记录。',
    canonical: '/404.html',
    image: '/assets/images/home-preview.png',
    noIndex: true
  },
  ...journalDetailDefinitions
];

const navItems = [
  ['home', '首页', 'index.html'],
  ['portfolio', '作品', 'pages/portfolio.html'],
  ['framework', 'Framework', 'pages/framework.html'],
  ['journal', 'Journal', 'pages/journal.html'],
  ['about', '关于', 'pages/about.html'],
  ['contact', '公开入口', 'pages/contact.html']
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
    const emphasis = key === 'contact' ? ' nav-cta' : '';
    return `<a href="${pageHref(target)}" class="nav-link${emphasis}${active ? ' active' : ''}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
  }).join('\n            ');

  const footerLinks = navItems.slice(1).map(([, label, target]) => (
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
    html = updateFrameworkFallback(html, framework, frameworkAdoption);
    html = replaceGeneratedBlock(html, 'framework-adoption', renderFrameworkAdoption(frameworkAdoption));
  }
  if (page.file === 'index.html') {
    html = replaceGeneratedBlock(html, 'home-content', renderHomeContent(projects, journal, framework));
  }
  if (page.file === 'pages/portfolio.html') {
    html = replaceGeneratedBlock(html, 'portfolio-content', renderPortfolioContent(projects, journal, framework));
  }
  if (page.file === 'pages/journal.html') {
    html = replaceGeneratedBlock(html, 'journal-content', renderJournalContent(journal));
  }
  if (page.file === 'pages/about.html') {
    html = replaceGeneratedBlock(html, 'about-content', renderAboutContent());
  }
  if (page.file === 'pages/contact.html') {
    html = replaceGeneratedBlock(html, 'contact-content', renderContactContent(site));
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
  const prefix = '../'.repeat(page.file.split('/').length - 1);
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
  if (page.schemaType === 'Article' && page.note) {
    structured.author = { '@type': 'Person', name: 'IrisSakura', url: siteData.siteUrl };
    structured.dateModified = page.note.updatedAt;
    structured.about = page.note.tags;
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
    <meta name="theme-color" content="#6a11cb">
    <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
    <link rel="manifest" href="${prefix}site.webmanifest">
    <script type="application/ld+json">${JSON.stringify(structured)}</script>
    <!-- site-meta:end -->`;
}

function updateFrameworkFallback(html, data, adoption) {
  const replacements = {
    'framework-package-count': data.summary.packageCount,
    'framework-module-count': data.summary.catalogModuleCount,
    'framework-profile-count': data.summary.profileCount,
    'framework-module-result-count': `${data.featuredModules.length} 个模块`,
    'framework-source-commit': data.sourceCommit.slice(0, 7),
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

  const generatedDate = data.generatedAt.slice(0, 10);
  html = html.replace(
    /(<time id="framework-generated-at" datetime=")[^"]*("[^>]*>)[\s\S]*?(<\/time>)/,
    `$1${data.generatedAt}$2${generatedDate}$3`
  );
  return html;
}

function replaceGeneratedBlock(html, name, content) {
  const pattern = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
  if (!pattern.test(html)) {
    throw new Error(`missing generated block: ${name}`);
  }
  return html.replace(pattern, `<!-- ${name}:start -->\n${content}\n<!-- ${name}:end -->`);
}

function renderHomeContent(projectData, journalData, frameworkData) {
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
                <div><p class="section-kicker">PUBLIC ROUTES</p><h2>继续查看公开代码与开发记录</h2><p>当前未提供私密联系表单；所有可验证入口都集中在公开入口页。</p></div>
                <a href="pages/contact.html" class="btn btn-secondary">查看公开入口</a>
            </div>
        </section>
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
        <section class="portfolio-cases" aria-label="三个真实项目">
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

function renderJournalContent(journalData) {
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
                <div class="journal-metric"><strong>${journalData.summary.knowledgeStreamCount}</strong><span>知识流</span></div>
                <p>公开页只展示经过策展的摘要；完整研究仓库继续保留原始笔记、证据和工作历史。</p>
            </div>
        </div>
    </header>
    <section class="journal-section">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">KNOWLEDGE STREAMS</p><h2>三条相互验证的知识流</h2></div><p>研究引擎如何工作，提炼游戏为何成立，再用工程记录约束判断是否可靠。</p></div>
            <div class="stream-grid">${streams}
            </div>
        </div>
    </section>
    <section class="journal-section journal-featured" id="featured-notes">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">SELECTED NOTES</p><h2>可独立分享的精选研究主题</h2></div><p>每个主题都包含问题、方法、发现、影响和更新时间。</p></div>
            <div class="note-grid">${notes}
            </div>
        </div>
    </section>
    <section class="journal-section">
        <div class="container">
            <div class="journal-bridge">
                <div><p class="journal-kicker">RESEARCH → SYSTEM → WORK</p><h2>记录的价值，在于改变下一次实现</h2><p>只有能够跨项目复用的结论，才进入 Sakura Framework；只有被实际作品验证的能力，才成为作品集证据。</p></div>
                <div class="bridge-actions"><a class="bridge-card" href="framework.html"><span>02 / SYSTEM</span><strong>Sakura Framework</strong><i class="fas fa-arrow-right" aria-hidden="true"></i></a><a class="bridge-card" href="game.html"><span>03 / WORK</span><strong>《言铸之剑》</strong><i class="fas fa-arrow-right" aria-hidden="true"></i></a></div>
            </div>
            <p class="journal-source-note">内容选摘自私有的 Sakura Design Journal；本页只公开经过筛选的摘要，不暴露仓库地址或未整理的工作记录。</p>
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
  const routes = siteData.socials.map((social) => `
                <a class="public-route-card" href="${escapeAttribute(social.url)}" target="_blank" rel="noopener noreferrer">
                    <i class="fab ${escapeAttribute(social.icon)}" aria-hidden="true"></i>
                    <div><span>VERIFIED PUBLIC ROUTE</span><h2>${escapeHtml(social.label)}</h2><p>${escapeHtml(social.description)}</p></div>
                    <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                </a>`).join('');
  return `<header class="contact-header">
        <div class="container">
            <p class="section-kicker">PUBLIC ROUTES & DISCUSSION SCOPE</p>
            <h1>公开入口与交流范围</h1>
            <p>当前没有公开工作邮箱或私密联系表单。这里仅列出已经验证、可以实际访问的公开渠道。</p>
        </div>
    </header>
    <section class="public-routes">
        <div class="container public-route-list">${routes}
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
    </section>
    <section class="route-boundary">
        <div class="container route-boundary-inner">
            <div><p class="section-kicker">CURRENT BOUNDARY</p><h2>当前公开沟通边界</h2></div>
            <div><p>GitHub 与哔哩哔哩更适合公开项目讨论和开发记录，不等同于承诺即时回复的商务联系渠道。</p><p>私有仓库、未整理工作日记、凭据和本机工程路径不在公开范围内。</p></div>
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
                <div><p class="section-kicker">START SMALL, VERIFY FIRST</p><h2 class="section-title">4 个 Supported 包与最小采用路线</h2></div>
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

function renderJournalDetailSource(note) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(note.title)} | Sakura Design Journal</title>
    <link rel="stylesheet" href="../../style/main.css">
    <link rel="stylesheet" href="../../style/journal.css">
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
        <footer class="journal-detail-update"><strong>更新时间</strong><time datetime="${escapeAttribute(note.updatedAt)}">${escapeHtml(note.updatedAt)}</time><p>这是经过策展的公开研究结构，不包含私有仓库地址、工作日记或未整理原文。</p></footer>
    </article>
</main>
<footer class="footer"></footer>
<script src="../../dist/site.js" type="module"></script>
</body>
</html>
`;
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
