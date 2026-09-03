import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

import { assertBrandAssets, assertBrandContract, BRAND_MODE_IDS, resolvePageBrandMode } from './lib/brand-contract.mjs';
import { assertFrameworkAdoptionReviewed } from './lib/framework-adoption-review.mjs';
import { assertFrameworkQuickstart, resolveQuickstartRoutes } from './lib/framework-quickstart.mjs';
import { assertFrameworkEngineering, resolveFrameworkEngineering } from './lib/framework-engineering-model.mjs';
import { assertFrameworkRequirementCoverage } from './lib/framework-requirement-coverage.mjs';
import { assertFrameworkEvidenceAuthorities, resolveFrameworkEvidenceAuthorities } from './lib/framework-evidence-authority.mjs';
import { assertFrameworkStory, resolveFrameworkStory } from './lib/framework-story-model.mjs';
import { assertFrameworkArchitecture, resolveFrameworkArchitecture } from './lib/framework-architecture-model.mjs';
import { assertFrameworkEvidence, resolveFrameworkEvidence } from './lib/framework-evidence-model.mjs';
import { assertFrameworkCaseStudies, resolveFrameworkCaseStudies } from './lib/framework-case-studies-model.mjs';
import { assertFrameworkEvolution, resolveFrameworkEvolution } from './lib/framework-evolution-model.mjs';
import { assertFrameworkKnowledgeGraph, resolveFrameworkKnowledgeGraph } from './lib/framework-knowledge-graph-model.mjs';
import { assertFrameworkModuleReference, resolveFrameworkModuleReference } from './lib/framework-module-reference-model.mjs';
import { resolveBlogDiscovery } from './lib/blog-discovery-model.mjs';
import { selectPublishedBlogs, stripBlogPublicationPreamble } from './lib/blog-publication-model.mjs';
import { buildContentSearchIndex, resolveFeaturedReading } from './lib/content-search-model.mjs';
import { assertConsumerLabCurrent } from './lib/consumer-lab-model.mjs';
import { resolveConsumerSyncRegistry } from './lib/consumer-sync-registry.mjs';
import { resolveEvidenceChains } from './lib/evidence-chain-model.mjs';
import { updateFrameworkFallback } from './lib/framework-fallback.mjs';
import { assertProjectFactsCurrent } from './lib/project-facts.mjs';
import { writeSocialImages } from './lib/social-image.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BRAND_MODES = new Set(BRAND_MODE_IDS);
const PAGE_COVER_TARGETS = {
  home: 'hero-section',
  portfolio: 'portfolio-header',
  engineering: 'engineering-hero',
  framework: 'framework-hero',
  journal: 'journal-hero',
  blog: 'blog-hero',
  game: 'game-hero',
  contact: 'contact-header'
};
const BRAND_MODE_HERO_ARTWORK = Object.freeze({
  'pages/engineering.html': Object.freeze({ mode: 'iris', assetKey: 'irisHeroArt' }),
  'pages/framework.html': Object.freeze({ mode: 'sakura', assetKey: 'sakuraHeroArt' }),
  'pages/journal.html': Object.freeze({ mode: 'journal', assetKey: 'journalHeroArt' })
});
const PAGE_INDEXES = {
  'pages/portfolio.html': {
    ariaLabel: '作品页章节',
    title: '浏览作品证据',
    insertBefore: '    <div class="container">\n        <section class="portfolio-journey"',
    items: [
      ['portfolio-journey', '作品路径'],
      ['portfolio-cases', '真实项目'],
      ['consumer-lab', '玩法实验室']
    ]
  },
  'pages/framework.html': {
    ariaLabel: 'Framework 页面章节',
    title: '浏览框架证据',
    insertBefore: '    <!-- framework-story:start -->',
    items: [
      ['architecture-map', '架构地图'],
      ['pillars', '工程支柱'],
      ['reference', '技术参考'],
      ['maturity', '成熟度'],
      ['adoption', '采用路线'],
      ['game-adoption', '消费证据']
    ]
  },
  'pages/framework-engineering.html': {
    ariaLabel: 'Framework Engineering 页面章节',
    title: '浏览架构证据',
    insertBefore: '    <!-- framework-engineering-content:start -->',
    items: [
      ['depth-model', '深度模型'],
      ['reader-paths', '读者路径'],
      ['architecture-domains', '十个能力域'],
      ['evidence-boundary', '证据边界'],
      ['adoption-route', '采用入口']
    ]
  },
  'pages/journal.html': {
    ariaLabel: '研究页章节',
    title: '浏览研究脉络',
    insertBefore: '    <section class="journal-section"',
    items: [
      ['knowledge-streams', '知识流'],
      ['content-search', '内容检索'],
      ['featured-notes', '精选主题'],
      ['recent-audits', '近期审计'],
      ['game-design-library', '设计资料库'],
      ['evidence-chains', '公开证据链']
    ]
  },
  'pages/blog.html': {
    ariaLabel: '博客页章节',
    title: '浏览正式文章',
    insertBefore: '    <section class="blog-taxonomy"',
    items: [
      ['featured-reading', '精选阅读'],
      ['blog-taxonomy', '系列与主题'],
      ['articles', '全部文章']
    ]
  }
};

const [site, framework, frameworkAdoption, frameworkQuickstart, frameworkStory, frameworkEngineering, frameworkArchitecture, frameworkEvidence, frameworkCaseStudies, frameworkEvolution, frameworkKnowledgeGraph, frameworkModuleReference, frameworkPlanCoverage, frameworkEvidenceAuthorities, frameworkPageShellTemplate, projects, irisEngineering, consumerLab, consumerSyncRegistry, journal, journalSource, blogPublication, blogTaxonomy, evidenceChainData, evidenceChainAuthorities, themeConfig, brandConfig, navbarTemplate, footerTemplate] = await Promise.all([
  readJson('data/site.json'),
  readJson('data/framework.json'),
  readJson('data/framework-adoption.json'),
  readJson('data/framework-quickstart.json'),
  readJson('data/framework-story.json'),
  readJson('data/framework-engineering.json'),
  readJson('data/framework-architecture.json'),
  readJson('data/framework-evidence.json'),
  readJson('data/framework-case-studies.json'),
  readJson('data/framework-evolution.json'),
  readJson('data/framework-knowledge-graph.json'),
  readJson('data/framework-module-reference.json'),
  readJson('tests/contracts/framework-plan-coverage.json'),
  readJson('tests/contracts/framework-evidence-authorities.json'),
  readText('components/framework-page-shell.html'),
  readJson('data/projects.json'),
  readJson('data/iris-engineering.json'),
  readJson('data/consumer-lab.json'),
  readJson('config/consumer-sync.json'),
  readJson('data/journal.json'),
  readJson('data/journal-source.json'),
  readJson('config/blog-publication.json'),
  readJson('data/blog-taxonomy.json'),
  readJson('data/evidence-chains.json'),
  readJson('config/evidence-chain-authorities.json'),
  readJson('data/themes.json'),
  readJson('config/brand.json'),
  readText('components/navbar.html'),
  readText('components/footer.html')
]);

assertFrameworkAdoptionReviewed(framework, frameworkAdoption);
assertFrameworkQuickstart(frameworkQuickstart, frameworkAdoption);
assertFrameworkStory(frameworkStory);
assertFrameworkEngineering(frameworkEngineering);
assertFrameworkArchitecture(frameworkArchitecture);
assertFrameworkEvidence(frameworkEvidence);
assertFrameworkCaseStudies(frameworkCaseStudies);
assertFrameworkEvolution(frameworkEvolution);
assertFrameworkKnowledgeGraph(frameworkKnowledgeGraph);
assertFrameworkModuleReference(frameworkModuleReference);
assertFrameworkRequirementCoverage(frameworkPlanCoverage);
assertFrameworkEvidenceAuthorities(frameworkEvidenceAuthorities);
assertProjectFactsCurrent(projects, framework, journal);
assertEngineeringSnapshot(irisEngineering);
assertConsumerLabCurrent(consumerLab);
const consumerSync = resolveConsumerSyncRegistry(consumerSyncRegistry, consumerLab);
assertBrandConfig(themeConfig);
assertBrandContract(brandConfig);
await assertBrandAssets(root, brandConfig);
assertBrandProof(site);

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
const contentSearchIndex = buildContentSearchIndex(journalSource, publishedBlogs, blogDiscovery);
const featuredReading = resolveFeaturedReading(blogDiscovery);
const evidenceChains = resolveEvidenceChains(evidenceChainData, frameworkAdoption, journalSource, blogPublication, irisEngineering, evidenceChainAuthorities);

const featuredNoteById = new Map(journal.featuredNotes.map((note) => [note.id, note]));
const gameDesignIds = new Set(journalSource.gameDesigns.map((design) => design.id));
const gameDesignDetailDefinitions = journalSource.gameDesigns.map((design) => ({
  file: `pages/journal/${design.id}.html`,
  key: 'journal',
  title: `${design.title} | IrisSakura Journal`,
  description: design.summary,
  canonical: `/pages/journal/${design.id}.html`,
  schemaType: 'Article',
  design,
  markdown: gameDesignBodies.get(design.id),
  note: featuredNoteById.get(design.id)
}));
const curatedOnlyDetailDefinitions = journal.featuredNotes.filter((note) => !gameDesignIds.has(note.id)).map((note) => ({
  file: `pages/journal/${note.id}.html`,
  key: 'journal',
  title: `${note.title} | IrisSakura Journal`,
  description: note.description,
  canonical: `/pages/journal/${note.id}.html`,
  schemaType: 'Article',
  note
}));
const journalDetailDefinitions = [...gameDesignDetailDefinitions, ...curatedOnlyDetailDefinitions];
const blogDetailDefinitions = publishedBlogs.map((article) => ({
  file: `pages/blog/${article.slug}.html`,
  key: 'journal',
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
    key: 'journal',
    title: `系列：${collection.name} | IrisSakura`,
    description: collection.description,
    canonical: `/pages/blog/series/${collection.slug}.html`,
    schemaType: 'CollectionPage',
    collection: { ...collection, kind: 'series', kindLabel: '文章系列' }
  })),
  ...blogDiscovery.routableTags.map((collection) => ({
    file: `pages/blog/tag/${collection.slug}.html`,
    key: 'journal',
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
    key: 'journal',
    title: `${isPublished ? '文章已移动' : '文章暂未发布'} | IrisSakura`,
    description: isPublished
      ? '这篇文章已迁移到稳定的语义地址。'
      : '这篇文章正在整理或审核中，请返回正式文章列表。',
    canonical: isPublished ? `/pages/blog/${publication.slug}.html` : '/pages/blog.html',
    noIndex: true,
    redirect: isPublished ? `./${publication.slug}.html` : '../blog.html#articles'
  }];
});

const architectureView = resolveFrameworkArchitecture(frameworkArchitecture);
const evidenceView = resolveFrameworkEvidence(frameworkEvidence);
const caseStudiesView = resolveFrameworkCaseStudies(frameworkCaseStudies);
const evolutionView = resolveFrameworkEvolution(frameworkEvolution);
const knowledgeGraphView = resolveFrameworkKnowledgeGraph(frameworkKnowledgeGraph);
const moduleReferenceView = resolveFrameworkModuleReference(frameworkModuleReference);

const frameworkArchitectureDefinitions = architectureView.pages.map((content) => ({
  file: content.route,
  key: 'framework',
  title: `${content.title} | Sakura Framework`,
  description: content.summary,
  canonical: `/${content.route}`,
  schemaType: 'TechArticle',
  frameworkDeepKind: 'architecture',
  content,
  pageIndex: content.id === 'decisions'
    ? [['overview', '定位与边界'], ['decision-list', '十项决策'], ['next-route', '继续阅读']]
    : [['overview', '定位与边界'], ['focus', '系统重点'], ['failure-model', '失败模型'], ['tradeoffs', '代价与边界'], ['next-route', '继续阅读']]
}));
const frameworkEvidenceDefinitions = evidenceView.pages.map((content) => ({
  file: content.route,
  key: 'framework',
  title: `${content.title} | Sakura Framework`,
  description: content.summary,
  canonical: `/${content.route}`,
  schemaType: content.id === 'cases' ? 'CollectionPage' : 'TechArticle',
  frameworkDeepKind: 'evidence',
  content,
  pageIndex: content.id === 'tooling'
    ? [['overview', '定位与边界'], ['toolchains', '工具链'], ['next-route', '继续阅读']]
    : content.id === 'evidence'
      ? [['overview', '定位与边界'], ['evidence-ladder', '证据阶梯'], ['evidence-topics', '主题证据'], ['next-route', '继续阅读']]
      : content.id === 'consumers'
        ? [['overview', '定位与边界'], ['consumer-matrix', 'Consumer Matrix'], ['next-route', '继续阅读']]
        : [['overview', '定位与边界'], ['case-grid', '五个案例'], ['next-route', '继续阅读']]
}));
const frameworkCaseDefinitions = caseStudiesView.cases.map((content) => ({
  file: content.route,
  key: 'framework',
  title: `${content.title} | Sakura Framework Case Study`,
  description: content.subtitle,
  canonical: `/${content.route}`,
  schemaType: 'TechArticle',
  frameworkDeepKind: 'case',
  content,
  pageIndex: [['overview', '案例摘要'], ['case-sections', '十二段复盘'], ['next-route', '继续阅读']]
}));
const frameworkClosingDefinitions = [
  { file: evolutionView.route, key: 'framework', title: `${evolutionView.title} | Sakura Framework`, description: evolutionView.summary, canonical: `/${evolutionView.route}`, schemaType: 'TechArticle', frameworkDeepKind: 'evolution', content: evolutionView, pageIndex: [['overview','演进原则'],['timeline','演进时间线'],['next-route','继续阅读']] },
  { file: knowledgeGraphView.route, key: 'framework', title: `${knowledgeGraphView.title} | Sakura Framework`, description: knowledgeGraphView.summary, canonical: `/${knowledgeGraphView.route}`, schemaType: 'CollectionPage', frameworkDeepKind: 'knowledge', content: knowledgeGraphView, pageIndex: [['overview','知识关系'],['knowledge-series','系列入口'],['knowledge-articles','文章节点'],['evidence-graph','证据链'],['next-route','继续阅读']] },
  { file: moduleReferenceView.route, key: 'framework', title: `${moduleReferenceView.title} | Sakura Framework`, description: moduleReferenceView.summary, canonical: `/${moduleReferenceView.route}`, schemaType: 'CollectionPage', frameworkDeepKind: 'reference', content: moduleReferenceView, pageIndex: [['overview','Reference 定位'],['module-reference','精选模块'],['next-route','继续阅读']] }
];
const frameworkDeepDefinitions = [...frameworkArchitectureDefinitions, ...frameworkEvidenceDefinitions, ...frameworkCaseDefinitions, ...frameworkClosingDefinitions];

await writeJournalDetailSources(journalDetailDefinitions);
await writeBlogSources(blogDetailDefinitions, blogAliasDefinitions, blogCollectionDefinitions);
await writeFrameworkQuickstartSource(frameworkQuickstart);
await writeFrameworkEngineeringSource(frameworkPageShellTemplate);
await writeFrameworkDeepSources(frameworkDeepDefinitions);
await writeBrandSource();
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
    file: 'pages/engineering.html',
    key: 'engineering',
    coverKey: 'engineering',
    title: 'Iris Engineering | 研发工作流控制面',
    description: '查看 Iris Engineering 如何把仓库事实、研究提案、显式授权、受限执行与验证审计组织成失败关闭的研发工作流。',
    canonical: '/pages/engineering.html',
    schemaType: 'SoftwareApplication'
  },
  {
    file: 'pages/framework.html',
    key: 'framework',
    coverKey: 'framework',
    title: frameworkStory.positioning.seoTitle,
    description: frameworkStory.positioning.description,
    canonical: '/pages/framework.html',
    schemaType: 'SoftwareSourceCode',
    runtimePlatform: 'Portable .NET; Unity; Godot Parallel Preview'
  },
  {
    file: 'pages/framework-engineering.html',
    key: 'framework',
    coverKey: 'framework',
    title: frameworkEngineering.positioning.seoTitle,
    description: frameworkEngineering.positioning.description,
    canonical: '/pages/framework-engineering.html'
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
    description: `${projects.projects.length} 条真实作品主线与 ${consumerLab.cases.length} 个独立玩法项目，呈现从研究、工程治理、框架到游戏实践的完整链路。`,
    canonical: '/pages/portfolio.html',
  },
  {
    file: 'pages/brand.html',
    key: 'brand',
    title: 'IrisSakura Brand System | IrisSakura',
    description: '查看 IrisSakura 主品牌、IRIS 与 SAKURA 的职责边界、联合标识、色板、角色、图标与命名规则。',
    canonical: '/pages/brand.html'
  },
  {
    file: 'pages/art-music.html',
    key: '',
    title: '品牌页面已迁移 | IrisSakura',
    description: '原美术音乐入口承载的品牌系统已经迁移到独立 Brand 页面。',
    canonical: '/pages/brand.html',
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
    key: 'journal',
    coverKey: 'journal',
    title: 'IrisSakura Journal | 游戏系统、架构与引擎研究',
    description: '经过策展的游戏设计、引擎源码研究与工程审计摘要，说明研究如何影响框架和游戏决策。',
    canonical: '/pages/journal.html',
  },
  {
    file: 'pages/game.html',
    key: 'portfolio',
    brandModeKey: 'game',
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
    key: 'journal',
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
  ...blogAliasDefinitions,
  ...frameworkDeepDefinitions
];

for (const page of pageDefinitions) {
  const brandModeKey = (page.brandModeKey ?? page.key) || 'system';
  const brandMode = resolvePageBrandMode(brandConfig, brandModeKey);
  page.brandMode = brandMode;
  page.image = socialImagePath(page.file);
  page.imageAlt = `${page.title.replace(/ \| IrisSakura$/u, '')} 的 IrisSakura 分享图`;
  page.socialCategory = socialCategory(page);
}
await Promise.all([
  writeSocialImages(root, pageDefinitions, brandConfig),
  writeFile(path.join(root, 'data/search-index.json'), `${JSON.stringify(contentSearchIndex, null, 2)}\n`),
  writeReadmeSummaries(projects, consumerSync)
]);
await assertSitePresentation(site, pageDefinitions);

const navItems = [
  ['home', '首页', 'index.html'],
  ['portfolio', '作品', 'pages/portfolio.html'],
  ['engineering', 'Engineering', 'pages/engineering.html'],
  ['framework', 'Framework', 'pages/framework.html'],
  ['journal', 'Journal', 'pages/journal.html'],
  ['brand', 'Brand', 'pages/brand.html'],
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
  html = html.replace(/\sdata-content-stage="(?:value|system|result|evidence|boundary|next)"/g, '');

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
    .replaceAll('{{brandMark}}', escapeAttribute(pageHref(brandConfig.assets.symbol)))
    .replaceAll('{{masterWordmark}}', escapeAttribute(pageHref(brandConfig.assets.masterWordmark)))
    .replaceAll('{{profileAvatar}}', escapeAttribute(pageHref(site.profile.avatar)))
    .replace('{{profileAvatarAlt}}', escapeAttribute(site.profile.avatarAlt))
    .replace('{{profileNickname}}', escapeHtml(site.profile.nickname))
    .replace('{{profileRole}}', escapeHtml(site.profile.role))
    .replace('{{gameHref}}', escapeAttribute(pageHref('pages/game.html')))
    .replace('{{engineeringHref}}', escapeAttribute(pageHref('pages/engineering.html')))
    .replace('{{frameworkHref}}', escapeAttribute(pageHref('pages/framework.html')))
    .replace('{{journalHref}}', escapeAttribute(pageHref('pages/journal.html')))
    .replace('{{consumerLabHref}}', escapeAttribute(pageHref('pages/portfolio.html#consumer-lab')))
    .replace('{{contactHref}}', escapeAttribute(pageHref('pages/contact.html')))
    .replace('{{brandHref}}', escapeAttribute(pageHref('pages/brand.html#brand-system')))
    .replace('{{navLinks}}', navLinks);
  const footer = footerTemplate
    .replaceAll('{{homeHref}}', pageHref('index.html'))
    .replaceAll('{{brandMark}}', escapeAttribute(pageHref(brandConfig.assets.symbol)))
    .replaceAll('{{masterWordmark}}', escapeAttribute(pageHref(brandConfig.assets.masterWordmark)))
    .replace('{{footerLinks}}', footerLinks)
    .replace('{{socialLinks}}', socialLinks);

  const navbarPattern = /<!-- site-navbar:start -->[\s\S]*?<!-- site-navbar:end -->|(?:<a class="skip-link"[\s\S]*?<\/a>\s*)?<nav class="navbar"[\s\S]*?<\/nav>(?:\s*<aside\b[^>]*\bdata-bgm-player\b[\s\S]*?<\/aside>)*/;
  html = html
    .replace(navbarPattern, navbar)
    .replace(/<footer class="footer">[\s\S]*?<\/footer>/, footer)
    .replace(/<main(?![^>]*\bid="main-content")/, '<main id="main-content"')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`);

  const meta = buildMeta(page, site, brandConfig);
  if (/<!-- site-meta:start -->[\s\S]*?<!-- site-meta:end -->/.test(html)) {
    html = html.replace(/<!-- site-meta:start -->[\s\S]*?<!-- site-meta:end -->/, meta);
  } else {
    html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n    ${meta}`);
  }
  html = installBrandIdentity(html, prefix, themeConfig, page.brandMode);

  const siteScript = `<script src="${prefix}dist/site.js" type="module"></script>`;
  if (!html.includes('dist/site.js')) {
    html = html.replace('</body>', `${siteScript}\n</body>`);
  }

  if (page.file === 'pages/framework.html') {
    const story = resolveFrameworkStory(frameworkStory);
    html = replaceGeneratedBlock(html, 'framework-story-hero', renderFrameworkStoryHero(story));
    html = replaceGeneratedBlock(html, 'framework-story', renderFrameworkStory(story));
    html = replaceGeneratedBlock(html, 'framework-reference', renderFrameworkReference(story));
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
  if (page.file === 'pages/framework-engineering.html') {
    html = replaceGeneratedBlock(
      html,
      'framework-engineering-content',
      renderFrameworkEngineering(
        resolveFrameworkEngineering(frameworkEngineering),
        resolveFrameworkEvidenceAuthorities(frameworkEvidenceAuthorities)
      )
    );
  }
  if (page.frameworkDeepKind) {
    html = replaceGeneratedBlock(
      html,
      'framework-detail-content',
      renderFrameworkDeepPage(page, {
        architecture: architectureView,
        evidence: evidenceView,
        cases: caseStudiesView,
        authorities: resolveFrameworkEvidenceAuthorities(frameworkEvidenceAuthorities),
        consumers: consumerLab,
        knowledge: knowledgeGraphView,
        blogDiscovery,
        publishedBlogs,
        publicationById,
        evidenceChains,
        moduleReference: moduleReferenceView
      })
    );
  }
  if (page.file === 'pages/engineering.html') {
    html = replaceGeneratedBlock(html, 'engineering-content', renderEngineeringContent(irisEngineering, evidenceChains));
  }
  if (page.file === 'index.html') {
    html = replaceGeneratedBlock(
      html,
      'home-content',
      renderHomeContent(projects, publicJournal, framework, irisEngineering, consumerLab, site)
    );
  }
  if (page.file === 'pages/brand.html') {
    html = replaceGeneratedBlock(html, 'brand-content', renderBrandContent(brandConfig));
  }
  if (page.file === 'pages/portfolio.html') {
    html = replaceGeneratedBlock(html, 'portfolio-content', renderPortfolioContent(projects, journal, framework, irisEngineering, consumerLab, consumerSync));
  }
  if (page.file === 'pages/journal.html') {
    html = replaceGeneratedBlock(html, 'journal-content', renderJournalContent(publicJournal, publicJournalSource, evidenceChains, contentSearchIndex));
  }
  if (page.file === 'pages/game.html') {
    html = replaceGeneratedBlock(html, 'game-evidence', renderEvidenceChains(evidenceChains));
  }
  if (page.file === 'pages/blog.html') {
    html = replaceGeneratedBlock(html, 'blog-content', renderBlogIndex(publicJournalSource, blogDiscovery, featuredReading));
  }
  if (page.file === 'pages/contact.html') {
    html = replaceGeneratedBlock(html, 'contact-content', renderContactContent(site));
  }

  html = installPageIndex(html, page);
  html = installPageCover(html, page, site, prefix);
  html = installBrandExperience(html, page, prefix, brandConfig);
  html = installContentVoiceStages(html, page);
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
    background_color: themeConfig.backgroundColor,
    theme_color: brandConfig.modes.master.themeColor,
    icons: [
      { src: `/${brandConfig.assets.favicon}?v=20260824`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
    ]
  }, null, 2) + '\n')
]);

function buildMeta(page, siteData, brand) {
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
    structured.runtimePlatform = page.runtimePlatform ?? 'Unity';
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
    <meta name="theme-color" content="${brandConfig.modes[page.brandMode].themeColor}">
    <link rel="icon" href="${prefix}${brandConfig.assets.favicon}?v=20260824" type="image/svg+xml">
    <link rel="manifest" href="${prefix}site.webmanifest">
    <link rel="alternate" type="application/rss+xml" title="IrisSakura 正式文章" href="${prefix}rss.xml">
    <script type="application/ld+json">${JSON.stringify(structured)}</script>
    <!-- site-meta:end -->`;
}

function assertBrandConfig(config) {
  if (!config || config.id !== 'iris-sakura' || config.label !== 'IRIS × SAKURA') {
    throw new Error('brand registry must define IRIS × SAKURA');
  }
  if (config.colorScheme !== 'light') {
    throw new Error('IRIS × SAKURA must use the reviewed light color scheme');
  }
  for (const [name, value] of [
    ['themeColor', config.themeColor],
    ['backgroundColor', config.backgroundColor]
  ]) {
    if (!/^#[0-9a-f]{6}$/i.test(value ?? '')) {
      throw new Error(`brand registry has invalid ${name}`);
    }
  }
  if (config.stylesheet !== 'style/iris-sakura.css') {
    throw new Error('brand registry must own the IRIS × SAKURA stylesheet');
  }
  if (JSON.stringify(config.tokenStylesheets) !== JSON.stringify([
    'style/tokens/primitive.css',
    'style/tokens/semantic.css',
    'style/tokens/modes.css',
    'style/components/brand-experience.css'
  ])) {
    throw new Error('brand registry must own the reviewed design token stylesheets');
  }
  if (config.homeHeroImage !== 'assets/images/profile/home-hero-iris-sakura.png') {
    throw new Error('brand registry must own the IRIS × SAKURA hero image');
  }
  if (!/^\d+(?:\.\d+)?% \d+(?:\.\d+)?%$/u.test(config.homeHeroPosition ?? '')) {
    throw new Error('brand registry has invalid homeHeroPosition');
  }
}

function assertBrandProof(siteData) {
  const proof = siteData?.brandProof;
  const ids = proof?.items?.map((item) => item.id);
  if (JSON.stringify(ids) !== JSON.stringify(['iris', 'sakura', 'outcome'])) {
    throw new Error('brand proof must preserve the IRIS, SAKURA and outcome sequence');
  }
  for (const item of proof.items) {
    if (!item.promise || !item.proof || !/^pages\/[a-z-]+\.html(?:#[a-z-]+)?$/u.test(item.href ?? '') || !item.cta) {
      throw new Error(`brand proof has an invalid ${item.id} entry`);
    }
  }
}

function assertEngineeringSnapshot(snapshot) {
  if (!snapshot || ![1, 2].includes(snapshot.schemaVersion) || snapshot.id !== 'iris-engineering') {
    throw new Error('Iris Engineering snapshot must use the legacy schemaVersion 1 or synced schemaVersion 2 and the stable project id');
  }
  if (snapshot.schemaVersion === 2 && (
    typeof snapshot.sourceUpdatedAt !== 'string'
    || !Number.isFinite(Date.parse(snapshot.sourceUpdatedAt))
    || new Date(snapshot.sourceUpdatedAt).toISOString() !== snapshot.sourceUpdatedAt
  )) {
    throw new Error('Synced Iris Engineering snapshot must expose a canonical sourceUpdatedAt');
  }
  const workflowIds = snapshot.workflow?.map((entry) => entry.id);
  if (JSON.stringify(workflowIds) !== JSON.stringify(['observe', 'authorize', 'execute', 'verify'])) {
    throw new Error('Iris Engineering workflow must preserve Observe, Authorize, Execute and Verify');
  }
  const capabilityIds = snapshot.capabilities?.map((entry) => entry.id);
  if (JSON.stringify(capabilityIds) !== JSON.stringify([
    'workflow-core',
    'read-models',
    'research-intake',
    'agent-execution'
  ])) {
    throw new Error('Iris Engineering public capability set is incomplete');
  }
  if (!snapshot.evidence?.some((entry) => entry.state === 'failed-closed')) {
    throw new Error('Iris Engineering evidence must retain the failed-closed external read result');
  }
  const publicJson = JSON.stringify(snapshot);
  for (const forbidden of ['/Users/', '154.37.215.57', 'git@', 'credential-revoked', 'remote-matched']) {
    if (publicJson.includes(forbidden)) {
      throw new Error(`Iris Engineering public snapshot leaks ${forbidden}`);
    }
  }
}

function installBrandIdentity(html, prefix, config, brandMode) {
  if (!BRAND_MODES.has(brandMode)) throw new Error(`invalid page brand mode: ${brandMode}`);
  const tokenStyles = config.tokenStylesheets
    .map((stylesheet) => `<link rel="stylesheet" href="${prefix}${stylesheet}">`)
    .join('\n    ');
  const brandStyles = `<!-- brand-styles:start -->
    ${tokenStyles}
    <link rel="stylesheet" href="${prefix}${config.stylesheet}">
    <!-- brand-styles:end -->`;
  const stylePattern = /<!-- (?:theme|brand)-styles:start -->[\s\S]*?<!-- (?:theme|brand)-styles:end -->/;
  if (!stylePattern.test(html)) throw new Error('missing generated brand styles block');
  html = html.replace(stylePattern, brandStyles);
  html = html.replace(/<!-- theme-bootstrap:start -->[\s\S]*?<!-- theme-bootstrap:end -->/, '');

  const rootStyle = [
    `color-scheme: ${config.colorScheme}`,
    `--home-hero-image: url('/${config.homeHeroImage}')`,
    `--home-hero-position: ${config.homeHeroPosition}`
  ].join('; ');
  return html.replace(
    /<html\b[^>]*>/,
    `<html lang="zh-CN" data-brand="${config.id}" data-brand-mode="${brandMode}" style="${escapeAttribute(rootStyle)};">`
  );
}

function installBrandExperience(html, page, prefix, brand) {
  html = html
    .replace(/\s*<!-- brand-mode-signature:start -->[\s\S]*?<!-- brand-mode-signature:end -->/g, '')
    .replace(/\s*<!-- game-brand-attribution:start -->[\s\S]*?<!-- game-brand-attribution:end -->/g, '');

  const signatureByMode = {
    iris: { icon: 'iris-pipeline', label: 'IRIS MODE', title: 'Engineering Control Plane', productAsset: brand.assets.irisWordmark },
    sakura: { icon: 'sakura-composition', label: 'SAKURA MODE', title: 'Composable Game Framework', productAsset: brand.assets.sakuraWordmark },
    journal: { icon: 'shared-research', label: 'JOURNAL MODE', title: 'Questions · Reasoning · Application' }
  };
  const signature = signatureByMode[page.brandMode];
  if (signature && page.coverKey && !BRAND_MODE_HERO_ARTWORK[page.file]) {
    const coverPattern = new RegExp(`(<(?:header|section|div)\\b[^>]*\\bdata-page-cover="${escapeRegExp(page.coverKey)}"[^>]*>)`);
    if (!coverPattern.test(html)) throw new Error(`brand-contract violation: ${page.file} has no cover for ${page.brandMode} signature`);
    const markup = `<!-- brand-mode-signature:start -->
        <aside class="brand-mode-signature" aria-label="${escapeAttribute(signature.label)}">
            <svg aria-hidden="true"><use href="${prefix}${brand.assets.iconSprite}#${signature.icon}"></use></svg>
            <div><span>${escapeHtml(signature.label)}</span>${signature.productAsset ? `<img class="brand-mode-product-lockup" src="${prefix}${signature.productAsset}" alt="">` : `<strong>${escapeHtml(signature.title)}</strong>`}</div>
        </aside>
        <!-- brand-mode-signature:end -->`;
    html = html.replace(coverPattern, `$1\n        ${markup}`);
  }

  html = installBrandModeHeroArt(html, page, prefix, brand);

  if (page.brandMode === 'game') {
    const actionPattern = /(<div class="game-actions">[\s\S]*?<\/div>)/;
    if (!actionPattern.test(html)) throw new Error(`brand-contract violation: ${page.file} has no game action block`);
    const attribution = `<!-- game-brand-attribution:start -->
                    <p class="game-brand-attribution" data-game-brand-attribution><img src="${prefix}${brand.assets.symbol}" alt="">IRIS × SAKURA 技术生态支持</p>
                    <!-- game-brand-attribution:end -->`;
    html = html.replace(actionPattern, `$1\n                    ${attribution}`);
  }
  return html;
}

function installBrandModeHeroArt(html, page, prefix, brand) {
  html = html.replace(/\s*<!-- brand-mode-hero-art:start -->[\s\S]*?<!-- brand-mode-hero-art:end -->/g, '');
  const artwork = BRAND_MODE_HERO_ARTWORK[page.file];
  if (!artwork || !page.coverKey) return html;
  if (artwork.mode !== page.brandMode) {
    throw new Error(`brand-contract violation: ${page.file} hero art mode drift`);
  }
  const asset = brand.assets[artwork.assetKey];
  if (!asset) throw new Error(`brand-contract violation: ${page.file} hero art asset missing`);

  const coverPattern = new RegExp(`(<(?:header|section|div)\\b[^>]*\\bdata-page-cover="${escapeRegExp(page.coverKey)}"[^>]*>)`);
  if (!coverPattern.test(html)) {
    throw new Error(`brand-contract violation: ${page.file} has no cover for ${page.brandMode} hero art`);
  }
  const markup = `<!-- brand-mode-hero-art:start -->
        <figure class="brand-mode-hero-art brand-mode-hero-art-${artwork.mode}" aria-hidden="true">
            <img src="${prefix}${asset}" alt="" decoding="async" fetchpriority="high">
        </figure>
        <!-- brand-mode-hero-art:end -->`;
  return html.replace(coverPattern, `$1\n        ${markup}`);
}

function installContentVoiceStages(html, page) {
  const stagesByFile = {
    'index.html': [
      ['hero-section', 'value'], ['brand-ecosystem-section', 'system'], ['flagship-section', 'result'],
      ['brand-proof', 'evidence'], ['flagship-facts', 'boundary']
    ],
    'pages/portfolio.html': [
      ['portfolio-header', 'value'], ['portfolio-journey', 'system'], ['portfolio-cases', 'result'],
      ['consumer-lab', 'evidence'], ['portfolio-facts', 'boundary']
    ],
    'pages/engineering.html': [
      ['engineering-hero', 'value'], ['engineering-workflow', 'system'], ['engineering-capabilities', 'result'],
      ['engineering-evidence', 'evidence'], ['engineering-boundaries', 'boundary']
    ],
    'pages/framework.html': [
      ['framework-hero', 'value'], ['framework-positioning', 'system'], ['framework-architecture-map', 'result'],
      ['framework-pillars', 'evidence'], ['framework-reference', 'boundary'], ['framework-overview', 'system'],
      ['game-adoption-section', 'result'], ['evidence-chain-section', 'evidence'], ['lifecycle-section', 'boundary']
    ],
    'pages/framework-engineering.html': [
      ['framework-engineering-hero', 'value'], ['framework-depth-model', 'system'], ['framework-domain-map', 'result'],
      ['framework-evidence-boundary', 'evidence'], ['framework-adoption-route', 'boundary']
    ],
    'pages/journal.html': [
      ['journal-hero', 'value'], ['stream-grid', 'system'], ['journal-bridge', 'result'],
      ['evidence-chain-section', 'evidence'], ['evidence-chain-limit', 'boundary']
    ]
  };
  const stages = page.frameworkDeepKind
    ? [['framework-detail-hero', 'value'], ['framework-detail-overview', 'system'], ['framework-detail-body', 'result'], ['framework-detail-next', 'next']]
    : stagesByFile[page.file];
  if (!stages) return html;
  html = html.replace(/\sdata-content-stage="(?:value|system|result|evidence|boundary|next)"/g, '');
  for (const [className, stage] of stages) html = addContentStage(html, className, stage, page.file);
  return addContentStage(html, 'footer-links', 'next', page.file);
}

function addContentStage(html, className, stage, file) {
  const pattern = new RegExp(`(<[a-z][^>]*\\bclass="[^"]*\\b${escapeRegExp(className)}\\b[^"]*")([^>]*>)`, 'i');
  if (!pattern.test(html)) throw new Error(`content voice contract: ${file} missing ${className}`);
  return html.replace(pattern, `$1 data-content-stage="${stage}"$2`);
}

function replaceGeneratedBlock(html, name, content) {
  const pattern = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
  if (!pattern.test(html)) {
    throw new Error(`missing generated block: ${name}`);
  }
  return html.replace(pattern, `<!-- ${name}:start -->\n${content}\n<!-- ${name}:end -->`);
}

async function writeReadmeSummaries(projectData, sync) {
  const file = path.join(root, 'README.md');
  let readme = await readFile(file, 'utf8');
  readme = replaceGeneratedBlock(
    readme,
    'project-summary',
    `- \`/pages/portfolio.html\`：${projectData.projects.length} 个正式公开项目，以及 ${sync.caseCount} 个 Consumer Lab 案例的本地验证矩阵；`
  );
  readme = replaceGeneratedBlock(
    readme,
    'consumer-summary',
    `Consumer Lab 当前包含 ${sync.caseCount} 个 Consumer Lab 案例：${sync.sourcePushCount} 个仓库启用 source-push，另外 ${sync.fixedSnapshotCount} 个固定快照保留经复核的本地证据但不声明自动同步。`
  );
  await writeFile(file, `${readme.trim()}\n`);
}

function renderHomeContent(projectData, journalData, frameworkData, irisEngineeringData, consumerLabData, siteData) {
  const game = projectData.projects.find((project) => project.id === 'sword-of-words');
  if (!game) throw new Error('missing sword-of-words project');
  const featuredConsumer = consumerLabData.cases.find((entry) => entry.id === 'gamejam-game');
  if (!featuredConsumer) throw new Error('missing featured GameJam consumer');
  const { profile } = siteData;
  const brandProofItems = siteData.brandProof.items.map((item, index) => `
                        <article class="brand-proof-item brand-proof-${escapeAttribute(item.id)}" data-brand-proof="${escapeAttribute(item.id)}">
                            <span>0${index + 1}</span>
                            <p>${escapeHtml(item.promise)}</p>
                            <strong>${escapeHtml(item.proof)}</strong>
                            <a href="${escapeAttribute(item.href)}" class="text-link">${escapeHtml(item.cta)}<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                        </article>`).join('');
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
        <section id="profile" class="hero-section profile-hero" data-brand-layout="editorial">
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

        <section class="flagship-section" data-brand-layout="editorial">
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

        <section class="brand-ecosystem-section" data-brand-layout="contrast" aria-labelledby="brand-ecosystem-title">
            <div class="container brand-ecosystem-inner">
                <div class="brand-signature">
                    <div class="brand-lockup brand-lockup-compact" aria-label="IRIS × SAKURA">
                        <span class="brand-lockup-iris">IRIS</span><span class="brand-lockup-cross" aria-hidden="true">×</span><span class="brand-lockup-sakura">SAKURA</span>
                    </div>
                    <p>BUILD · ORGANIZE · BLOOM</p>
                    <a href="pages/brand.html#brand-system" class="text-link">进入品牌视觉体系<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                </div>
                <div>
                    <p class="section-kicker">ONE ECOSYSTEM · TWO STRENGTHS</p>
                    <h2 id="brand-ecosystem-title">让工程与项目管理有序推进，让游戏框架持续承载创作</h2>
                    <div class="brand-branch-grid">
                        <article class="brand-branch brand-branch-iris" data-home-brand-branch>
                            <span>01 / IRIS</span>
                            <h3>Engineering &amp; Project Management</h3>
                            <p>Iris Engineering 承接 Workflow、Project Management、Pipeline 与 Reliability。</p>
                        </article>
                        <article class="brand-branch brand-branch-sakura" data-home-brand-branch>
                            <span>02 / SAKURA</span>
                            <h3>Game Framework</h3>
                            <p>Game Framework、Runtime Systems、Gameplay Modules 与 Tooling。</p>
                        </article>
                    </div>
                </div>
                <div class="brand-proof" aria-labelledby="brand-proof-title">
                    <div class="brand-proof-heading">
                        <p class="section-kicker">${escapeHtml(siteData.brandProof.label)}</p>
                        <h3 id="brand-proof-title">${escapeHtml(siteData.brandProof.title)}</h3>
                        <p>${escapeHtml(siteData.brandProof.description)}</p>
                    </div>
                    <div class="brand-proof-grid">${brandProofItems}
                    </div>
                </div>
            </div>
        </section>

        <section class="focus-section" data-brand-layout="editorial">
            <div class="container">
                <div class="section-heading">
                    <p class="section-kicker">MORE FOCUSED WORK</p>
                    <h2>围绕代表作继续展开的四条主线</h2>
                    <p>工程治理、框架、研究与真实消费项目分别承接授权、复用、判断和验证，让首页重点明确而不失完整脉络。</p>
                </div>
                <div class="focus-grid">
                    <article class="focus-card" data-home-focus>
                        <p class="focus-index">01 · ENGINEERING CONTROL</p>
                        <strong>${escapeHtml(irisEngineeringData.statusLabel)}</strong>
                        <h3>Iris Engineering</h3>
                        <p>把研究提案、显式授权、受限执行与验证审计组织成失败关闭的研发工作流。</p>
                        <a href="pages/engineering.html" class="text-link">查看工程控制面</a>
                    </article>
                    <article class="focus-card" data-home-focus>
                        <p class="focus-index">02 · REUSABLE SYSTEMS</p>
                        <strong>${frameworkData.lifecycleCounts.Supported}</strong>
                        <h3>Sakura Framework</h3>
                        <p>把游戏中的稳定边界沉淀为可复用 Unity 包，并持续记录生命周期与验证状态。</p>
                        <a href="pages/framework.html" class="text-link">查看框架</a>
                        <a href="pages/framework-engineering.html" class="text-link">查看 Engineering Hub</a>
                    </article>
                    <article class="focus-card" data-home-focus>
                        <p class="focus-index">03 · DESIGN RESEARCH</p>
                        <strong>${journalData.summary.gameDesignCount}</strong>
                        <h3>IrisSakura Journal</h3>
                        <p>从机制、源码和实际约束出发，保留可追溯的研究判断与设计结论。</p>
                        <a href="pages/journal.html" class="text-link">查看研究</a>
                    </article>
                    <article class="focus-card focus-card-latest" data-home-focus>
                        <p class="focus-index">04 · REAL CONSUMERS</p>
                        <strong>${consumerLabData.cases.length}</strong>
                        <h3>Consumer Lab</h3>
                        <span class="focus-latest">LATEST CONSUMER · WEBGL</span>
                        <p><span class="focus-latest-name">${escapeHtml(featuredConsumer.title)}</span>用双模式战斗检验 Framework 能力是否真正落入可理解、可运行的游戏闭环。</p>
                        <a href="pages/portfolio.html#consumer-gamejam-game" class="text-link">查看最新消费项目</a>
                    </article>
                </div>
            </div>
        </section>

        <section class="research-section" data-brand-layout="editorial">
            <div class="container">
                <div class="section-heading section-heading-row">
                    <div><p class="section-kicker">SELECTED RESEARCH</p><h2>精选研究主题</h2></div>
                    <a href="pages/journal.html" class="text-link">查看全部研究</a>
                </div>
                <div class="research-list">${researchCards}
                </div>
            </div>
        </section>

        <section class="public-cta" data-brand-layout="editorial">
            <div class="container public-cta-inner">
                <div><p class="section-kicker">CONTACT & PUBLIC ROUTES</p><h2>直接联系或继续查看公开记录</h2><p>工作邮箱、工作 QQ 与公开项目入口都集中在联系页。</p></div>
                <a href="pages/contact.html" class="btn btn-secondary">查看公开入口</a>
            </div>
        </section>
    </section>`;
}

function renderBrandContent(brand) {
  const palette = [
    ['Iris Core', '#4C3DF5'],
    ['Iris Light', '#7B73FF'],
    ['Shared Violet', '#A06BFF'],
    ['Sakura Core', '#FF7EB6'],
    ['Sakura Light', '#FFC1D8'],
    ['Sky Link', '#7EC6FF']
  ].map(([label, value]) => `
                            <li><span class="brand-swatch" style="--brand-swatch: ${value}"></span><strong>${label}</strong><code>${value}</code></li>`).join('');

  return `<header class="portfolio-header brand-portfolio-header">
        <div class="container">
            <p class="section-kicker">IRIS × SAKURA · BRAND SYSTEM</p>
            <h1>IrisSakura Brand System</h1>
            <p>主品牌、能力品牌与成果层的共同规则：IRIS 组织工程，SAKURA 承载游戏能力，Journal 保存研究判断，真实项目负责验证。</p>
        </div>
    </header>

    <div class="brand-portfolio" id="brand-system">
        <section class="brand-system-intro" data-brand-layout="editorial" aria-labelledby="brand-system-title">
            <div class="container brand-system-intro-inner">
                <div class="brand-system-copy">
                    <p class="section-kicker">ONE ECOSYSTEM · TWO STRENGTHS</p>
                    <img class="brand-official-lockup" src="../${escapeAttribute(brand.assets.jointLockup)}" alt="IRIS × SAKURA — Build · Organize · Bloom">
                    <p class="brand-lockup-subtitle">GAME-TECH ECOSYSTEM · BUILD · ORGANIZE · BLOOM</p>
                    <h2 id="brand-system-title">Build · Organize · Bloom</h2>
                    <p>不是把工程管理与框架能力混成一种声音，而是让两根支柱在同一生态里各自清晰、彼此支撑。</p>
                    <figure class="brand-header-slice">
                        <img src="../assets/images/brand/01_iris_x_sakura_header.png" alt="IRIS × SAKURA 游戏技术生态：Build、Organize、Bloom" decoding="async">
                        <figcaption>V3 生态头图 · 工程与项目管理连接游戏框架</figcaption>
                    </figure>
                </div>
                <ol class="brand-principles" aria-label="品牌行动原则">
                    <li><span>01</span><strong>BUILD</strong><small>用可验证的工程系统建立创造底座</small></li>
                    <li><span>02</span><strong>ORGANIZE</strong><small>让项目、工作流与交付保持清晰</small></li>
                    <li><span>03</span><strong>BLOOM</strong><small>让 Sakura Framework 支撑游戏创作扩展</small></li>
                </ol>
            </div>
        </section>

        <section class="brand-board-section" data-brand-layout="editorial" aria-labelledby="brand-board-title">
            <div class="container">
                <div class="brand-section-heading">
                    <p class="section-kicker">MASTER BRAND BOARD</p>
                    <h2 id="brand-board-title">先看完整生态，再进入每一条分支</h2>
                    <p>总览板保留双人格、两大产品支柱、联合徽记、色板与命名家族的原始关系；网页组件则把这些规则变成可阅读、可复用的界面语言。</p>
                </div>
                <figure class="brand-board">
                    <img src="../${escapeAttribute(brand.assets.brandBoard)}" alt="IRIS × SAKURA 完整品牌系统总览，包含角色、子品牌、色板、图标与命名规则" decoding="async">
                    <figcaption>品牌系统总览 · 工程理性与创作生命力并行</figcaption>
                </figure>
            </div>
        </section>

        <section class="brand-duality-section" data-brand-layout="contrast" aria-labelledby="brand-duality-title">
            <div class="container">
                <div class="brand-section-heading brand-section-heading-centered">
                    <p class="section-kicker">DUAL TRACKS</p>
                    <h2 id="brand-duality-title">边界清晰，才能真正合流</h2>
                    <p>IRIS 对工程与项目管理负责，SAKURA 对游戏框架负责。名称、语气和能力范围分别表达，生态层再用联合标识连接。</p>
                </div>
                <div class="brand-duality-grid">
                    <article class="brand-track brand-track-iris" data-brand-branch="iris">
                        <header><span>IRIS / 01</span><strong>ENGINEER · MANAGE · DELIVER</strong></header>
                        <h3>Engineering &amp; Project Management</h3>
                        <p>冷静、精确、结构化。承担 Engineering、Project Management、Workflow、Pipeline 与 Reliability。</p>
                        <ul><li>Project Management</li><li>Workflow &amp; Pipeline</li><li>Quality &amp; Reliability</li></ul>
                    </article>
                    <div class="brand-convergence" data-brand-convergence>
                        <img src="../${escapeAttribute(brand.assets.masterLogo)}" alt="" class="brand-convergence-mark">
                        <strong>ONE ECOSYSTEM</strong>
                        <span>Shared intent<br>Distinct voices</span>
                    </div>
                    <article class="brand-track brand-track-sakura" data-brand-branch="sakura">
                        <header><span>SAKURA / 02</span><strong>FRAME · POWER · EXTEND</strong></header>
                        <h3>Game Framework</h3>
                        <p>温暖、灵动、富有生命力。承担 Game Framework、Runtime Systems、Gameplay Modules 与 Tooling。</p>
                        <ul><li>Runtime Systems</li><li>Gameplay Modules</li><li>Extensible Tooling</li></ul>
                    </article>
                </div>
            </div>
        </section>

        <section class="brand-products-section" data-brand-layout="contrast" aria-labelledby="brand-products-title">
            <div class="container">
                <div class="brand-section-heading">
                    <p class="section-kicker">TWO PRODUCT PILLARS</p>
                    <h2 id="brand-products-title">两个支柱，各自承担清晰职责</h2>
                    <p>Iris Engineering 组织研发与项目工作流；Sakura Framework 为可扩展游戏创作提供模块、运行时与工具底座。</p>
                </div>
                <div class="brand-product-grid">
                    <article class="brand-product-card brand-product-engineering">
                        <img class="brand-product-wordmark" src="../${escapeAttribute(brand.assets.irisWordmark)}" alt="">
                        <p>IRIS / ENGINEERING &amp; PROJECT MANAGEMENT</p>
                        <h3>Iris Engineering</h3>
                        <strong>ENGINEER · ORGANIZE · DELIVER</strong>
                        <span>让研发事实、验证边界与受控自动化进入同一工作流。</span>
                        <a href="engineering.html" class="text-link">查看工程控制面<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </article>
                    <article class="brand-product-card brand-product-framework">
                        <img class="brand-product-wordmark" src="../${escapeAttribute(brand.assets.sakuraWordmark)}" alt="">
                        <p>SAKURA / GAME FRAMEWORK</p>
                        <h3>Sakura Framework</h3>
                        <strong>MODULAR · EXTENSIBLE · CREATOR-READY</strong>
                        <span>为真实游戏生产建立可复用、可组合的 Unity 系统边界。</span>
                    </article>
                </div>
            </div>
        </section>

        <section class="brand-language-section" aria-labelledby="brand-language-title">
            <div class="container">
                <div class="brand-section-heading brand-section-heading-centered">
                    <p class="section-kicker">VISUAL LANGUAGE</p>
                    <h2 id="brand-language-title">一套能够直接进入产品的品牌工具箱</h2>
                    <p>颜色负责区分力量，图标负责解释系统，命名负责守住产品边界。</p>
                </div>
                <div class="brand-language-grid">
                    <article class="brand-language-card brand-palette-card">
                        <span class="brand-card-index">01 / COLOR</span>
                        <h3>从鸢尾紫到樱花粉</h3>
                        <ul class="brand-palette" aria-label="品牌核心色">${palette}
                        </ul>
                    </article>
                    <article class="brand-language-card brand-icon-card">
                        <span class="brand-card-index">02 / ICONOGRAPHY</span>
                        <h3>Clean · Technical · Elegant</h3>
                        <div class="brand-icon-row brand-icon-row-official" aria-hidden="true"><svg><use href="../${escapeAttribute(brand.assets.iconSprite)}#iris-pipeline"></use></svg><svg><use href="../${escapeAttribute(brand.assets.iconSprite)}#iris-verification"></use></svg><svg><use href="../${escapeAttribute(brand.assets.iconSprite)}#sakura-framework"></use></svg><svg><use href="../${escapeAttribute(brand.assets.iconSprite)}#sakura-composition"></use></svg><svg><use href="../${escapeAttribute(brand.assets.iconSprite)}#shared-research"></use></svg><svg><use href="../${escapeAttribute(brand.assets.iconSprite)}#shared-game"></use></svg></div>
                        <p>22 个品牌核心概念使用正式 SVG；通用操作继续使用 Font Awesome，避免图标职责混淆。</p>
                    </article>
                    <article class="brand-language-card brand-naming-card">
                        <span class="brand-card-index">03 / NAMING</span>
                        <h3>一个生态，两套命名家族</h3>
                        <div><code>IRIS-*</code><span>Engineering / Project Management</span></div>
                        <div><code>SAKURA-*</code><span>Game Framework / Modules / Runtime / Tooling</span></div>
                        <p>游戏消费项目暂不纳入当前命名体系。</p>
                    </article>
                </div>
            </div>
        </section>

        <section class="brand-persona-section" aria-labelledby="brand-personas-title">
            <div class="container">
                <div class="brand-section-heading">
                    <p class="section-kicker">PERSONIFIED BRAND</p>
                    <h2 id="brand-personas-title">让抽象价值拥有可以记住的面孔</h2>
                    <p>肖像只服务于品牌故事与文化表达；产品界面仍优先使用功能清晰的联合标识、产品名和系统图标。</p>
                </div>
                <div class="brand-persona-stage">
                    <figure class="brand-persona-portrait brand-persona-iris">
                        <img src="../assets/images/brand/10_iris_character_portrait.png" alt="IRIS 品牌人格角色肖像" loading="lazy" decoding="async">
                        <figcaption><span>IRIS</span><strong>Engineer · Manage · Deliver</strong></figcaption>
                    </figure>
                    <figure class="brand-persona-portrait brand-persona-sakura">
                        <img src="../assets/images/brand/11_sakura_character_portrait.png" alt="SAKURA 品牌人格角色肖像" loading="lazy" decoding="async">
                        <figcaption><span>SAKURA</span><strong>Frame · Power · Extend</strong></figcaption>
                    </figure>
                </div>
            </div>
        </section>
    </div>`;
}

function renderEngineeringContent(engineering, chains) {
  const workflow = engineering.workflow.map((step, index) => `
                <li id="workflow-${escapeAttribute(step.id)}">
                    <span class="engineering-step-index">0${index + 1}</span>
                    <p>${escapeHtml(step.label)}</p>
                    <h3>${escapeHtml(step.title)}</h3>
                    <span>${escapeHtml(step.description)}</span>
                </li>`).join('');
  const capabilities = engineering.capabilities.map((capability, index) => `
                <article class="engineering-capability-card" id="capability-${escapeAttribute(capability.id)}">
                    <p class="engineering-card-index">0${index + 1} / ${escapeHtml(capability.id.toUpperCase())}</p>
                    <h3>${escapeHtml(capability.title)}</h3>
                    <p>${escapeHtml(capability.description)}</p>
                    <ul>${capability.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
                </article>`).join('');
  const evidence = engineering.evidence.map((entry) => `
                <article class="engineering-evidence-card engineering-evidence-${escapeAttribute(entry.state)}">
                    <div><span>${entry.state === 'failed-closed' ? '失败关闭' : '本地通过'}</span><strong>${escapeHtml(entry.label)}</strong></div>
                    <p>${escapeHtml(entry.summary)}</p>
                </article>`).join('');
  const boundaries = engineering.boundaries.map((boundary) => `<li>${escapeHtml(boundary)}</li>`).join('');

  return `<header class="engineering-hero page-cover" data-page-cover="engineering">
        <div class="container engineering-hero-inner">
            <div>
                <p class="section-kicker">${escapeHtml(engineering.eyebrow)}</p>
                <h1>研发工作流控制面</h1>
                <p>把分散的仓库与研发事实变成可行动、可授权、可恢复的工作节奏，让个人与小型团队知道现在发生了什么、下一步能安全做什么。</p>
            </div>
            <aside class="engineering-status" aria-label="Iris Engineering 当前状态">
                <span>${escapeHtml(engineering.operatingMode)}</span>
                <strong>${escapeHtml(engineering.statusLabel)}</strong>
                <p>${escapeHtml(engineering.status)}</p>${engineering.schemaVersion === 2 ? `
                <small>源仓更新 · ${escapeHtml(formatPublicDate(engineering.sourceUpdatedAt))}</small>` : ''}
            </aside>
        </div>
    </header>

    <div class="engineering-page">
        <section class="engineering-intro" aria-labelledby="engineering-intro-title">
            <div class="container engineering-intro-grid">
                <div><p class="section-kicker">WHY IRIS ENGINEERING</p><h2 id="engineering-intro-title">${escapeHtml(engineering.headline)}</h2></div>
                <p>Iris Engineering 不替代 Git、Gitea、Sakura Framework 或人的判断。它负责把分散事实变成只读视图，把研究建议变成待审批提案，再让获得授权的任务拥有明确目标、权限和恢复边界。</p>
            </div>
        </section>

        <section class="engineering-workflow" aria-labelledby="engineering-workflow-title">
            <div class="container">
                <div class="engineering-section-heading"><p class="section-kicker">OBSERVE · AUTHORIZE · EXECUTE · VERIFY</p><h2 id="engineering-workflow-title">从事实到验证，四段互不越权</h2></div>
                <ol>${workflow}
                </ol>
            </div>
        </section>

        <section class="engineering-capabilities" aria-labelledby="engineering-capabilities-title">
            <div class="container">
                <div class="engineering-section-heading"><p class="section-kicker">P1–P10 PRODUCT BASELINE</p><h2 id="engineering-capabilities-title">四个已经形成合同的能力层</h2><p>从 Workflow Core 到只读视图，再到 Research Artifact 与 Agent Execution，公开展示只描述已实现的本地产品边界。</p></div>
                <div class="engineering-capability-grid">${capabilities}
                </div>
            </div>
        </section>

        <section class="engineering-evidence" aria-labelledby="engineering-evidence-title">
            <div class="container engineering-evidence-grid">
                <div class="engineering-section-heading"><p class="section-kicker">EVIDENCE BEFORE CLAIMS</p><h2 id="engineering-evidence-title">通过与失败都保留原本含义</h2><p>本地合同、只读行动视图与外部试点分别陈述；传输失败没有被重试或改写成接入成功。</p></div>
                <div>${evidence}
                </div>
            </div>
        </section>

        <section class="engineering-boundaries" aria-labelledby="engineering-boundaries-title">
            <div class="container engineering-boundary-grid">
                <div><p class="section-kicker">CURRENT BOUNDARIES</p><h2 id="engineering-boundaries-title">当前边界</h2><p>失败关闭不是保守文案，而是产品设计的一部分：没有新的授权与证据，就不扩大能力结论。</p></div>
                <ul>${boundaries}</ul>
            </div>
        </section>
${renderEvidenceChains(chains, 'engineering-evidence-chains')}
    </div>`;
}

function renderPortfolioContent(projectData, journalData, frameworkData, irisEngineeringData, consumerLabData, consumerSync) {
  const order = ['sword-of-words', 'udgap', 'the-weaver', 'iris-core', 'iris-shelf', 'iris-engineering', 'sakura-framework', 'sakura-design-journal'];
  const ordered = order.map((id) => projectData.projects.find((project) => project.id === id));
  if (ordered.some((project) => !project)) throw new Error('portfolio project set is incomplete');
  const cases = ordered.map((project, index) => {
    const visual = renderPortfolioVisual(project, journalData, frameworkData, irisEngineeringData);
    return `<article class="portfolio-case portfolio-case-${escapeAttribute(project.category)}" id="project-${escapeAttribute(project.id)}">
                <div class="portfolio-case-visual">${visual}</div>
                <div class="portfolio-case-copy">
                    <p class="project-status">0${index + 1} · ${escapeHtml(project.categoryLabel)} · ${escapeHtml(project.status)}</p>
                    <h2>${escapeHtml(project.title)}</h2>
                    <p class="portfolio-update"><span>事实更新 · ${escapeHtml(project.updatedAt)}</span><span>${escapeHtml(project.syncLabel)} · 复核 ${escapeHtml(project.lastReviewedAt)}</span></p>
                    <p class="portfolio-description">${escapeHtml(project.summary)}</p>
                    <dl class="portfolio-facts">
                        <div><dt>职责</dt><dd>${escapeHtml(project.role)}</dd></div>
                        <div><dt>目标</dt><dd>${escapeHtml(project.goal)}</dd></div>
                        <div><dt>证据</dt><dd>${escapeHtml(project.evidence.join('；'))}</dd></div>
                        <div><dt>限制</dt><dd>${escapeHtml(project.limitations.join('；'))}</dd></div>
                        <div><dt>下一步</dt><dd>${escapeHtml(project.next.join('；'))}</dd></div>
                    </dl>
                    <div class="portfolio-tags">${project.technologies.slice(0, 5).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
                    ${project.href
                      ? `<a href="${escapeAttribute(project.href)}" class="portfolio-link">${escapeHtml(project.linkLabel)}<i class="fas fa-arrow-right" aria-hidden="true"></i></a>`
                      : `<span class="portfolio-link portfolio-link-static">${escapeHtml(project.linkLabel)}</span>`}
                    ${project.id === 'sakura-framework'
                      ? '<a href="framework-engineering.html" class="portfolio-link portfolio-link-secondary">打开 Engineering Hub<i class="fas fa-arrow-right" aria-hidden="true"></i></a><a href="framework-quickstart.html" class="portfolio-link portfolio-link-secondary">打开 15 分钟 Quickstart<i class="fas fa-arrow-right" aria-hidden="true"></i></a>'
                      : ''}
                </div>
            </article>`;
  }).join('\n            ');

  return `<div class="portfolio-header">
        <div class="container">
            <p class="section-kicker">PROJECT STATUS · REVIEWED SOURCES</p>
            <h1>${ordered.length} 个项目的当前状态与证据边界</h1>
            <p>每项状态都区分事实更新时间、人工复核时间与同步方式；未提交工作、私有路径和 source SHA 不进入公开完成声明。</p>
        </div>
    </div>
    <div class="container">
        <section class="portfolio-journey" id="portfolio-journey" aria-labelledby="portfolio-journey-title">
            <div class="journey-heading">
                <div><p class="journey-kicker">HOW THE WORK IS MADE</p><h2 id="portfolio-journey-title">研究判断 → 工程治理 → 框架沉淀 → 游戏验证</h2></div>
                <a class="journal-link" href="journal.html">查看研究记录<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
            </div>
            <p class="journey-intro">展示顺序从游戏与桌面产品开始，因果链仍从研究开始：Journal 保存判断，Iris Engineering 约束授权与执行，Iris Shelf 提供独立本地入口，Sakura Framework 与 Iris Core 沉淀可复用能力，UDGAP、The Weaver 与《言铸之剑》承担不同阶段的游戏验证。</p>
            <ol class="journey-path">
                <li><span class="journey-index">01</span><h3>研究判断</h3><p>理解引擎机制、游戏设计与当前约束。</p></li>
                <li><span class="journey-index">02</span><h3>显式授权</h3><p>把研究提案、目标和执行权限变成可复查合同。</p></li>
                <li><span class="journey-index">03</span><h3>框架沉淀</h3><p>只把跨项目复用的结论沉淀为稳定边界。</p></li>
                <li><span class="journey-index">04</span><h3>游戏验证</h3><p>用可玩循环、截图和限制校验实际价值。</p></li>
            </ol>
        </section>
        <section class="portfolio-cases" id="portfolio-cases" aria-label="${ordered.length} 个真实项目">
            ${cases}
        </section>
        ${renderConsumerLab(consumerLabData, consumerSync)}
    </div>`;
}

function renderConsumerLab(consumerLabData, consumerSync) {
  const representativeEvidence = new Set(consumerSync.representativeEvidenceCaseIds);
  const cards = consumerLabData.cases.map((entry, index) => {
    const highlights = entry.highlights
      .map((highlight) => `<li>${escapeHtml(highlight)}</li>`)
      .join('');
    if (entry.id === 'gamejam-game') {
      const playerEvidence = entry.verification.player === 'Unity WebGL Build + browser smoke'
        ? 'WebGL + Browser'
        : 'Player + Smoke';
      return `<article class="consumer-lab-card consumer-lab-card-featured" id="consumer-${escapeAttribute(entry.id)}" data-brand-bridge="iris-sakura">
                    <div class="consumer-lab-feature-copy">
                        <div class="consumer-lab-card-topline"><span class="consumer-lab-index">0${index + 1}</span><span class="consumer-lab-category">${escapeHtml(entry.category)}</span></div>
                        <p class="consumer-lab-feature-label">LATEST VERIFIED CONSUMER</p>
                        <h3>${escapeHtml(entry.title)}</h3>
                        <p class="consumer-lab-summary">${escapeHtml(entry.summary)}</p>
                        <div class="consumer-lab-brand-role" data-brand-side="iris"><p>IRIS · DEFINE THE PROOF</p><strong>${escapeHtml(entry.brandNarrative.iris)}</strong></div>
                    </div>
                    <aside class="consumer-lab-feature-proof" aria-label="${escapeAttribute(entry.title)} 品牌能力与本地验证">
                        <div class="consumer-lab-brand-role" data-brand-side="sakura"><p>SAKURA · POWER THE SYSTEM</p><strong>${escapeHtml(entry.brandNarrative.sakura)}</strong></div>
                        <div class="consumer-lab-systems"><p>核心系统</p><ul class="consumer-lab-highlights" aria-label="${escapeAttribute(entry.title)} 核心系统">${highlights}</ul></div>
                        <div class="consumer-lab-local-proof">
                            <p>LOCAL UNITY VERIFIED · NOT A RELEASE</p>
                            <ul class="consumer-lab-local-proof-list" aria-label="${escapeAttribute(entry.title)} 本地验证结果">
                                <li><span>EditMode</span><strong>${entry.verification.editMode.passed} / ${entry.verification.editMode.total}</strong></li>
                                <li><span>PlayMode</span><strong>${entry.verification.playMode.passed} / ${entry.verification.playMode.total}</strong></li>
                                <li><span>Runtime</span><strong>${playerEvidence}</strong></li>
                            </ul>
                        </div>
                        <a class="consumer-lab-proof-link" href="framework.html#game-adoption">查看 Framework 实战映射<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </aside>
                </article>`;
    }
    const compactProof = representativeEvidence.has(entry.id)
      ? `<div class="consumer-lab-compact-proof" aria-label="${escapeAttribute(entry.title)} 本地 Unity 验证">
                        <p>LOCAL UNITY VERIFIED · NOT A RELEASE</p>
                        <span>EditMode ${entry.verification.editMode.passed}/${entry.verification.editMode.total}</span>
                        <span>PlayMode ${entry.verification.playMode.passed}/${entry.verification.playMode.total}</span>
                        <span>${entry.verification.player.startsWith('macOS') ? 'macOS Player + Smoke' : 'WebGL + Browser'}</span>
                    </div>`
      : '';
    return `<article class="consumer-lab-card" id="consumer-${escapeAttribute(entry.id)}">
                    <div class="consumer-lab-card-topline"><span class="consumer-lab-index">0${index + 1}</span><span class="consumer-lab-category">${escapeHtml(entry.category)}</span></div>
                    <h3>${escapeHtml(entry.title)}</h3>
                    <p class="consumer-lab-summary">${escapeHtml(entry.summary)}</p>
                    <div class="consumer-lab-systems"><p>核心系统</p><ul class="consumer-lab-highlights" aria-label="${escapeAttribute(entry.title)} 核心系统">${highlights}</ul></div>
                    ${compactProof}
                </article>`;
  }).join('\n                ');

  return `<section class="consumer-lab" id="consumer-lab" aria-label="${consumerLabData.cases.length} 个独立玩法项目">
            <div class="consumer-lab-heading">
                <p class="section-kicker">FRAMEWORK PLAYGROUNDS</p><h2>${escapeHtml(consumerLabData.title)}</h2><p class="consumer-lab-intro">${escapeHtml(consumerLabData.description)}</p>
                <p class="consumer-lab-relation">${consumerSync.caseCount} 个案例 · ${consumerSync.sourcePushCount} 个 Source-push Repository · ${consumerSync.fixedSnapshotCount} 个固定快照</p>
            </div>
            <div class="consumer-lab-grid">${cards}
            </div>
        </section>`;
}

function renderPortfolioVisual(project, journalData, frameworkData, irisEngineeringData) {
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
  if (project.id === 'iris-engineering') {
    return `<div class="engineering-proof-visual" aria-label="Iris Engineering 受控工作流">
      ${irisEngineeringData.workflow.map((step, index) => `<div><span>0${index + 1}</span><strong>${escapeHtml(step.label)}</strong><small>${escapeHtml(step.title)}</small></div>`).join('')}
      <p>EXPLICIT AUTHORIZATION · FAIL CLOSED</p>
    </div><span class="visual-label">CONTROL PLANE</span>`;
  }
  if (Array.isArray(project.proof)) {
    const visualVariant = project.id === 'iris-shelf' ? 'shelf' : project.id;
    return `<div class="project-proof-visual project-proof-visual-${escapeAttribute(visualVariant)}" aria-label="${escapeAttribute(project.title)} 项目状态">
      ${project.proof.map((item) => `<div><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`).join('')}
      <p>${escapeHtml(project.proofFooter)}</p>
    </div><span class="visual-label">${escapeHtml(project.visualLabel)}</span>`;
  }
  return `<div class="journal-proof-visual" aria-label="Journal 精选研究主题">
      <p>${journalData.summary.gameDesignCount} 个设计主题 · ${journalData.summary.knowledgeStreamCount} 条知识流</p>
      ${journalData.featuredNotes.slice(0, 3).map((note) => `<div><span>${escapeHtml(note.track)}</span><strong>${escapeHtml(note.title)}</strong></div>`).join('')}
    </div><span class="visual-label">CURATED RESEARCH</span>`;
}

function renderContentSearch(searchIndex) {
  const typeOptions = searchIndex.facets.types
    .map((entry) => `<option value="${escapeAttribute(entry.id)}">${escapeHtml(entry.label)}（${entry.count}）</option>`)
    .join('');
  const seriesOptions = searchIndex.facets.series
    .map((entry) => `<option value="${escapeAttribute(entry.label)}">${escapeHtml(entry.label)}（${entry.count}）</option>`)
    .join('');
  const engineOptions = searchIndex.facets.engines
    .map((entry) => `<option value="${escapeAttribute(entry.id)}">${escapeHtml(entry.label)}（${entry.count}）</option>`)
    .join('');

  return `    <section class="journal-section content-search" id="content-search" data-content-search data-search-index="../data/search-index.json" data-search-limit="12">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">CONTENT SEARCH</p><h2 id="content-search-title">在 ${searchIndex.totalCount} 个公开内容单元中检索</h2></div><p>索引只包含已公开的标题、摘要与分类；文章正文、私有来源和未发布内容不会进入搜索数据。</p></div>
            <form class="content-search-controls" role="search" aria-labelledby="content-search-title" data-content-search-form>
                <label class="content-search-query" for="content-search-query"><span>关键词</span><input id="content-search-query" name="query" type="search" autocomplete="off" placeholder="搜索系统、玩法、引擎或主题" data-content-search-query></label>
                <label><span>内容类型</span><select name="type" data-content-search-type><option value="">全部类型（${searchIndex.totalCount}）</option>${typeOptions}</select></label>
                <label><span>文章系列</span><select name="series" data-content-search-series><option value="">全部系列</option>${seriesOptions}</select></label>
                <label><span>引擎</span><select name="engine" data-content-search-engine><option value="">全部引擎</option>${engineOptions}</select></label>
                <button class="btn btn-secondary" type="reset" data-content-search-reset>清除筛选</button>
            </form>
            <p class="content-search-status" id="content-search-status" aria-live="polite" data-content-search-status>正在加载公开索引…</p>
            <div class="content-search-results" id="content-search-results" aria-label="检索结果" aria-describedby="content-search-status" data-content-search-results></div>
            <noscript><p class="content-search-fallback">浏览器未启用 JavaScript。仍可通过<a href="blog.html">正式文章</a>、<a href="#game-design-library">游戏设计资料库</a>和<a href="#recent-audits">近期审计</a>浏览公开内容。</p></noscript>
        </div>
    </section>`;
}

function renderJournalContent(journalData, sourceData, chains, searchIndex) {
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
                <p class="journal-kicker">CURATED LEARNING · QUESTIONS TO APPLICATION</p>
                <h1>${escapeHtml(journalData.title)}</h1>
                <p class="journal-lead">从一个值得追问的问题出发，连接源码观察、设计推理与实际应用，让每篇记录都能影响下一次系统选择。</p>
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
    <section class="journal-section" id="knowledge-streams">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">KNOWLEDGE STREAMS</p><h2>${journalData.streams.length} 条相互验证的知识流</h2></div><p>研究引擎如何工作，提炼游戏为何成立，再用工程记录约束判断是否可靠。</p></div>
            <div class="stream-grid">${streams}
            </div>
        </div>
    </section>
${renderContentSearch(searchIndex)}
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
${renderEvidenceChains(chains, 'evidence-chains')}
    <section class="journal-section">
        <div class="container">
            <div class="journal-bridge">
                <div><p class="journal-kicker">RESEARCH → SYSTEM → WORK</p><h2>记录的价值，在于改变下一次实现</h2><p>只有能够跨项目复用的结论，才进入 Sakura Framework；只有被实际作品验证的能力，才成为作品集证据。</p></div>
                <div class="bridge-actions"><a class="bridge-card" href="framework.html"><span>02 / SYSTEM</span><strong>Sakura Framework</strong><i class="fas fa-arrow-right" aria-hidden="true"></i></a><a class="bridge-card" href="game.html"><span>03 / WORK</span><strong>《言铸之剑》</strong><i class="fas fa-arrow-right" aria-hidden="true"></i></a></div>
            </div>
        </div>
    </section>`;
}

function renderEvidenceChains(chains, sectionId = '') {
  const cards = chains.map((chain, index) => {
    const researchLinks = chain.research.map((reference) => `<a href="${escapeAttribute(reference.href)}"><span>${reference.type === 'article' ? '正式文章' : '设计索引'}</span><strong>${escapeHtml(reference.title)}</strong><small>${escapeHtml(reference.relation)}</small></a>`).join('');
    const workflowLinks = chain.controlPlane.workflows.map((workflow) => `<a href="engineering.html#workflow-${escapeAttribute(workflow.id)}"><strong>${escapeHtml(workflow.label)}</strong><small>${escapeHtml(workflow.title)}</small></a>`).join('');
    const capabilityLinks = chain.controlPlane.capabilities.map((capability) => `<a href="engineering.html#capability-${escapeAttribute(capability.id)}"><strong>${escapeHtml(capability.title)}</strong><small>${escapeHtml(capability.id)}</small></a>`).join('');
    return `<article class="evidence-chain-card" id="evidence-chain-${escapeAttribute(chain.id)}">
                    <p class="evidence-chain-index">0${index + 1} · ${escapeHtml(chain.gameSystem)}</p>
                    <h3>${escapeHtml(chain.title)}</h3>
                    <p class="evidence-chain-question">${escapeHtml(chain.question)}</p>
                    <div class="evidence-chain-path" aria-label="研究、控制面、框架与游戏证据">
                        <div class="evidence-chain-research"><span>RESEARCH</span>${researchLinks}</div>
                        <div class="evidence-chain-control-plane"><span>CONTROL PLANE</span><p>${escapeHtml(chain.controlPlane.projectId)}</p>${workflowLinks}${capabilityLinks}</div>
                        <a href="framework.html#game-adoption"><span>FRAMEWORK</span><strong>${chain.frameworkPackages.map((name) => `<code>${escapeHtml(name)}</code>`).join(' ')}</strong><small>${escapeHtml(chain.adoptionEvidence)}</small></a>
                        <a href="game.html#${escapeAttribute(chain.gameAnchor)}"><span>GAME</span><strong>《言铸之剑》</strong><small>${escapeHtml(chain.gameSystem)}</small></a>
                    </div>
                    <div class="evidence-chain-relationships" aria-label="四个部分之间的关系"><p><strong>RESEARCH → CONTROL PLANE</strong>${escapeHtml(chain.relationships.researchToControlPlane)}</p><p><strong>CONTROL PLANE → FRAMEWORK</strong>${escapeHtml(chain.relationships.controlPlaneToFramework)}</p><p><strong>FRAMEWORK → GAME</strong>${escapeHtml(chain.relationships.frameworkToGame)}</p></div>
                    <p class="evidence-chain-limit"><strong>证据边界</strong>${escapeHtml(chain.limitation)} ${escapeHtml(chain.authorityBoundary)}</p>
                </article>`;
  }).join('');
  return `<section class="evidence-chain-section"${sectionId ? ` id="${escapeAttribute(sectionId)}"` : ''} aria-labelledby="evidence-chain-title">
        <div class="container">
            <div class="section-heading">
                <p class="section-kicker">RESEARCH → CONTROL PLANE → FRAMEWORK → GAME</p>
                <h2 id="evidence-chain-title">从研究判断到游戏验证的四段公开证据链</h2>
                <p>同一条链同时指向公开研究、Iris Engineering 控制面、Framework 采用映射和游戏系统；公开证据不足的部分直接写在边界里。</p>
            </div>
            <div class="evidence-chain-grid">${cards}
            </div>
        </div>
    </section>`;
}

function renderBlogIndex(sourceData, discovery, featuredReading) {
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
  const featured = featuredReading.map(({ series: seriesEntry, article }) => `<article class="blog-featured-card">
                <p class="project-status">${escapeHtml(seriesEntry.name)} · ${escapeHtml(article.updatedAt)}</p>
                <h2>${escapeHtml(article.title)}</h2>
                <p>${escapeHtml(article.summary)}</p>
                <a class="note-link" href="blog/${escapeAttribute(article.slug)}.html">开始阅读<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
            </article>`).join('');
  return `<header class="blog-hero">
        <div class="container">
            <p class="section-kicker">GAME SYSTEMS · ENGINEERING PRACTICE</p>
            <h1>游戏系统与工程设计博客</h1>
            <p>围绕游戏系统、框架实践与工程决策，整理可以独立阅读的完整文章。</p>
            <div class="hero-buttons"><a class="btn btn-primary" href="#articles">阅读文章</a><a class="btn btn-secondary" href="journal.html">查看研究索引</a><a class="btn btn-secondary" href="../rss.xml"><i class="fas fa-rss" aria-hidden="true"></i>订阅 RSS</a></div>
        </div>
    </header>
    <section class="blog-featured-reading" id="featured-reading" aria-labelledby="featured-reading-title">
        <div class="container">
            <div class="journal-section-heading"><div><p class="journal-kicker">FEATURED READING</p><h2 id="featured-reading-title">从每个系列开始的一篇文章</h2></div><p>每个正式系列选择最新文章作为入口；完整历史仍由系列、标签与 RSS 承载。</p></div>
            <div class="blog-featured-grid">${featured}</div>
        </div>
    </section>
    <section class="blog-taxonomy" id="blog-taxonomy" aria-labelledby="blog-taxonomy-title">
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

function renderFrameworkStoryHero(story) {
  const { positioning, architectureMap } = story;
  const claims = positioning.claims.map((claim) => `<span class="framework-story-chip">${escapeHtml(claim)}</span>`).join('');
  const stack = [
    architectureMap.layers[0],
    architectureMap.layers[1],
    architectureMap.layers[2],
    architectureMap.layers[3]
  ].map((layer, index) => {
    const statusAttribute = layer.status ? ` data-story-status="${escapeAttribute(layer.status)}"` : '';
    return `<div class="stack-layer${index === architectureMap.layers.length - 1 ? ' highlight-layer' : ''}"${statusAttribute}>${escapeHtml(layer.label)}</div>`;
  }).join('');
  return `<div class="container framework-hero-grid">
            <div class="framework-hero-copy">
                <p class="section-kicker">${escapeHtml(positioning.eyebrow)}</p>
                <h1>${escapeHtml(positioning.title)}</h1>
                <p class="framework-subtitle">${escapeHtml(positioning.summary)}</p>
                <div class="framework-story-chips" aria-label="Framework 公开定位">${claims}</div>
                <div class="framework-actions">
                    <a href="#architecture-map" class="btn btn-primary">查看架构地图</a>
                    <a href="#reference" class="btn btn-secondary">浏览技术参考</a>
                    <a href="framework-engineering.html" class="btn btn-secondary">打开 Engineering Hub</a>
                </div>
            </div>
            <div class="framework-stack" aria-label="Portable Core 到 Games / Consumers 的架构路径">${stack}</div>
        </div>`;
}

function renderFrameworkStory(story) {
  const { positioning, architectureMap, pillars, evidence } = story;
  const layerCards = architectureMap.layers.map((layer, index) => {
    const statusAttribute = layer.status ? ` data-story-status="${escapeAttribute(layer.status)}"` : '';
    return `<article class="framework-map-layer framework-map-layer-${escapeAttribute(layer.id)}"${statusAttribute}>
                    <span class="framework-map-step">0${index + 1}</span>
                    <div><h3>${escapeHtml(layer.label)}</h3><p>${escapeHtml(layer.description)}</p></div>
                </article>`;
  }).join('');
  const branches = architectureMap.branches.map((branch) => `<article class="framework-map-branch framework-map-branch-${escapeAttribute(branch.id)}" data-story-status="${escapeAttribute(branch.status)}">
                    <span class="framework-map-status">${escapeHtml(branch.status.replace('-', ' '))}</span>
                    <h3>${escapeHtml(branch.label)}</h3><strong>${escapeHtml(branch.runtimeLabel)}</strong><p>${escapeHtml(branch.description)}</p>
                </article>`).join('');
  const governance = architectureMap.governance.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
  const boundaries = architectureMap.boundaries.map((boundary) => `<article data-story-status="${escapeAttribute(boundary.status)}"><span>${escapeHtml(boundary.status.replace('-', ' '))}</span><h3>${escapeHtml(boundary.label)}</h3><p>${escapeHtml(boundary.description)}</p></article>`).join('');
  const pillarCards = pillars.map((pillar, index) => `<article class="framework-pillar framework-pillar-${escapeAttribute(pillar.id)}">
                    <p class="section-kicker">${escapeHtml(pillar.eyebrow)}</p>
                    <span class="framework-pillar-index">0${index + 1}</span>
                    <h3>${escapeHtml(pillar.title)}</h3>
                    <p class="framework-pillar-thesis">${escapeHtml(pillar.thesis)}</p>
                    <p>${escapeHtml(pillar.description)}</p>
                    <ul>${pillar.signals.map((signal) => `<li>${escapeHtml(signal)}</li>`).join('')}</ul>
                </article>`).join('');
  return `<section class="framework-positioning" id="positioning" aria-labelledby="framework-positioning-title">
        <div class="container framework-story-intro">
            <div><p class="section-kicker">${escapeHtml(positioning.eyebrow)}</p><h2 class="section-title" id="framework-positioning-title">从模块集合到工程判断</h2></div>
            <div><p>${escapeHtml(positioning.description)}</p><p class="framework-story-boundary"><strong>边界</strong>${escapeHtml(positioning.boundary)}</p></div>
        </div>
    </section>
    <section class="framework-architecture-map" id="architecture-map" aria-labelledby="framework-architecture-title">
        <div class="container">
            <div class="section-heading-row">
                <div><p class="section-kicker">${escapeHtml(architectureMap.eyebrow)}</p><h2 class="section-title" id="framework-architecture-title">${escapeHtml(architectureMap.title)}</h2></div>
                <p class="section-intro">${escapeHtml(architectureMap.summary)}</p>
            </div>
            <div class="framework-map-flow" aria-label="Cross-Engine Architecture Map">
                <div class="framework-map-layer-list">${layerCards}</div>
                <div class="framework-map-branches">${branches}</div>
            </div>
            <div class="framework-map-governance"><span>横向约束</span>${governance}</div>
            <div class="framework-map-boundaries" aria-label="Cross-Engine 未交付边界">${boundaries}</div>
        </div>
    </section>
    <section class="framework-pillars" id="pillars" aria-labelledby="framework-pillars-title">
        <div class="container">
            <div class="section-heading-row">
                <div><p class="section-kicker">THREE ENGINEERING PILLARS</p><h2 class="section-title" id="framework-pillars-title">三条比模块数量更重要的工程判断</h2></div>
                <div>
                    <p class="section-intro">${escapeHtml(evidence.summary)}</p>
                    <p class="framework-evidence-line" aria-label="Framework 公开证据状态"><span>PUBLIC EVIDENCE</span><strong>${escapeHtml(evidence.local)} / ${escapeHtml(evidence.runner)}</strong></p>
                </div>
            </div>
            <div class="framework-pillar-grid">${pillarCards}</div>
        </div>
    </section>`;
}

function renderFrameworkReference(story) {
  const items = story.reference.items.map((item, index) => `<a class="framework-reference-card" href="${escapeAttribute(item.href)}">
                    <span>0${index + 1}</span><div><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.description)}</p></div><i class="fas fa-arrow-right" aria-hidden="true"></i>
                </a>`).join('');
  return `<section class="framework-reference" id="reference" aria-labelledby="framework-reference-title">
        <div class="container">
            <div class="section-heading-row">
                <div><p class="section-kicker">${escapeHtml(story.reference.eyebrow)}</p><h2 class="section-title" id="framework-reference-title">${escapeHtml(story.reference.title)}</h2></div>
                <p class="section-intro">${escapeHtml(story.reference.summary)}</p>
            </div>
            <div class="framework-reference-grid">${items}</div>
        </div>
    </section>`;
}

function renderFrameworkEngineering(hub, authorities) {
  const depthCards = hub.depthModel.map((depth, index) => `<article class="framework-depth-card">
                    <span class="framework-card-index">0${index + 1}</span>
                    <p class="section-kicker">${escapeHtml(depth.label)}</p>
                    <h3>${escapeHtml(depth.goal)}</h3>
                    <p>${escapeHtml(depth.answers)}</p>
                    <a class="framework-status-badge" href="${escapeAttribute(depth.route)}">${escapeHtml(deliveryStatusLabel(depth.status))}</a>
                </article>`).join('');
  const readerCards = hub.readerPaths.map((path, index) => `<a class="framework-reader-card" href="${escapeAttribute(path.href)}">
                    <span class="framework-card-index">0${index + 1}</span>
                    <p class="section-kicker">${escapeHtml(path.label)}</p>
                    <h3>${escapeHtml(path.audience)}</h3>
                    <p>${escapeHtml(path.description)}</p>
                    <span class="framework-card-link">从这里开始 <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
                </a>`).join('');
  const domainCards = hub.domains.map((domain, index) => `<article class="framework-domain-card" id="domain-${escapeAttribute(domain.id)}">
                    <div class="framework-domain-card-heading"><span class="framework-card-index">${String(index + 1).padStart(2, '0')}</span><span class="framework-status-badge">${escapeHtml(deliveryStatusLabel(domain.status))}</span></div>
                    <h3>${escapeHtml(domain.title)}</h3>
                    <p>${escapeHtml(domain.summary)}</p>
                    <a class="framework-card-link" href="${escapeAttribute(domain.route)}">打开深度页面 <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    <p class="framework-deferred-reason"><strong>交付证据</strong>${escapeHtml(domain.evidence)}</p>
                </article>`).join('');
  const levelLabels = new Map(authorities.levels.map((level) => [level.id, level.label]));
  const authorityCards = authorities.authorities.map((authority) => `<article class="framework-evidence-authority-card">
                    <p class="section-kicker">${escapeHtml(authority.label)}</p>
                    <div class="framework-authority-heading"><h3>${escapeHtml(levelLabels.get(authority.level) ?? authority.level)}</h3><code>${escapeHtml(authority.level)}</code></div>
                    <p class="framework-authority-source"><strong>权威来源</strong>${escapeHtml(authority.source)}</p>
                    <div class="framework-authority-limits"><div><strong>可以声明</strong><ul>${authority.mayClaim.map((claim) => `<li>${escapeHtml(claim)}</li>`).join('')}</ul></div><div><strong>不能声明</strong><ul>${authority.mayNotClaim.map((claim) => `<li>${escapeHtml(claim)}</li>`).join('')}</ul></div></div>
                </article>`).join('');
  const adoptionLinks = [
    [hub.links.framework, 'Framework Reference', '回到成熟度、架构地图与采用路线。'],
    [hub.links.quickstart, '15-minute Quickstart', '沿着安装、首次事件、对象池与清理完成最小验证。'],
    [`${hub.links.portfolio}#consumer-lab`, 'Consumer Evidence', '查看独立 Consumer 的真实引用与验证范围。'],
    [hub.links.cases, 'Five Flagship Cases', '用统一十二段模板查看完整工程闭环。'],
    [hub.links.knowledge, 'Knowledge Graph', '从 Framework 判断反向进入已发布研究。'],
    [hub.links.reference, 'Selected Reference', '查看精选模块的角色、层级、依赖与证据。'],
    [hub.links.home, 'IrisSakura Home', '回到个人站点的完整工程与项目入口。']
  ].map(([href, label, description]) => `<a class="framework-adoption-route-card" href="${escapeAttribute(href)}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(description)}</span><i class="fas fa-arrow-right" aria-hidden="true"></i></a>`).join('');

  return `<header class="framework-hero framework-engineering-hero page-cover">
        <div class="container framework-engineering-hero-inner">
            <div class="framework-engineering-hero-copy">
                <p class="section-kicker">${escapeHtml(hub.positioning.eyebrow)}</p>
                <h1>${escapeHtml(hub.positioning.title)}</h1>
                <p class="framework-subtitle">${escapeHtml(hub.positioning.description)}</p>
                <p class="framework-engineering-boundary"><strong>公开边界</strong>${escapeHtml(hub.positioning.boundary)}</p>
                <div class="framework-actions"><a href="#depth-model" class="btn btn-primary">理解 Sakura</a><a href="#architecture-domains" class="btn btn-secondary">探索 Engineering</a></div>
            </div>
            <aside class="framework-engineering-status" aria-label="Framework Engineering 证据状态">
                <p class="section-kicker">EVIDENCE BOUNDARY</p>
                <div class="framework-engineering-status-row"><span>LOCAL</span><strong>${escapeHtml(hub.evidence.local)}</strong></div>
                <div class="framework-engineering-status-row"><span>RUNNER</span><strong>${escapeHtml(hub.evidence.runner)}</strong></div>
                <div class="framework-engineering-status-row"><span>PRODUCTION</span><strong>${escapeHtml(hub.evidence.production)}</strong></div>
                <p>${escapeHtml(hub.evidence.summary)}</p>
            </aside>
        </div>
    </header>
    <section class="framework-engineering-section framework-depth-model" id="depth-model" aria-labelledby="framework-depth-model-title">
        <div class="container">
            <div class="section-heading-row"><div><p class="section-kicker">D0 → D3</p><h2 class="section-title" id="framework-depth-model-title">四层深度模型</h2></div><p class="section-intro">先建立信号，再解释系统、架构取舍与证据边界。深度模型是阅读路径，不把未交付的深页包装成现状。</p></div>
            <div class="framework-depth-grid">${depthCards}</div>
        </div>
    </section>
    <section class="framework-engineering-section framework-reader-section" id="reader-paths" aria-labelledby="framework-reader-paths-title">
        <div class="container">
            <div class="section-heading-row"><div><p class="section-kicker">THREE READER PATHS</p><h2 class="section-title" id="framework-reader-paths-title">按你的问题进入 Framework</h2></div><p class="section-intro">三条入口共享同一事实边界：理解定位、探索工程判断、开始采用时，分别跳到本 Hub 的真实锚点。</p></div>
            <div class="framework-reader-grid">${readerCards}</div>
        </div>
    </section>
    <section class="framework-engineering-section framework-domain-map" id="architecture-domains" aria-labelledby="framework-domain-map-title">
        <div class="container">
            <div class="section-heading-row"><div><p class="section-kicker">TEN ARCHITECTURE DOMAINS</p><h2 class="section-title" id="framework-domain-map-title">从模块目录走向工程领域</h2></div><p class="section-intro">十个领域均已连接真实深度页面；页面内容完成不改变其中 Framework 能力各自的 Local、Runner、Release 或 Production 状态。</p></div>
            <div class="framework-domain-grid">${domainCards}</div>
        </div>
    </section>
    <section class="framework-engineering-section framework-evidence-boundary" id="evidence-boundary" aria-labelledby="framework-evidence-boundary-title">
        <div class="container">
            <div class="section-heading-row"><div><p class="section-kicker">SOURCE → STATUS → PROOF</p><h2 class="section-title" id="framework-evidence-boundary-title">证据权威各自负责，不跨级声明</h2></div><p class="section-intro">${escapeHtml(hub.evidence.summary)}</p></div>
            <p class="framework-evidence-summary"><strong>${escapeHtml(hub.evidence.local)} / ${escapeHtml(hub.evidence.runner)}</strong><span>Production: ${escapeHtml(hub.evidence.production)}</span></p>
            <div class="framework-evidence-authority-grid">${authorityCards}</div>
            <ul class="framework-evidence-boundaries">${authorities.boundaries.map((boundary) => `<li>${escapeHtml(boundary)}</li>`).join('')}</ul>
        </div>
    </section>
    <section class="framework-engineering-section framework-adoption-route" id="adoption-route" aria-labelledby="framework-adoption-route-title">
        <div class="container">
            <div class="section-heading-row"><div><p class="section-kicker">THREE WAYS TO CONTINUE</p><h2 class="section-title" id="framework-adoption-route-title">从 Hub 进入真实参考与采用入口</h2></div><p class="section-intro">理解架构、检查证据与开始采用是三条不同路径；所有入口只连接本次生成并验证的真实页面。</p></div>
            <div class="framework-adoption-route-grid">${adoptionLinks}</div>
        </div>
    </section>`;
}

function deliveryStatusLabel(status) {
  if (status === 'implemented') return 'Implemented';
  if (status === 'information-architecture-closed-with-deferred-status') return 'Deferred';
  throw new Error(`unsupported Framework delivery status: ${status}`);
}

function renderFrameworkDeepPage(page, context) {
  let html;
  if (page.frameworkDeepKind === 'architecture') html = renderArchitectureDeepPage(page.content, context.architecture);
  else if (page.frameworkDeepKind === 'evidence') html = renderEvidenceDeepPage(page.content, context);
  else if (page.frameworkDeepKind === 'case') html = renderCaseStudyDeepPage(page.content, context.cases.sectionOrder);
  else if (page.frameworkDeepKind === 'evolution') html = renderEvolutionDeepPage(page.content);
  else if (page.frameworkDeepKind === 'knowledge') html = renderKnowledgeDeepPage(page.content, context);
  else if (page.frameworkDeepKind === 'reference') html = renderModuleReferenceDeepPage(page.content);
  else throw new Error(`unsupported Framework deep page kind: ${page.frameworkDeepKind}`);

  return localizeFrameworkDeepLinks(html, page.file);
}

function localizeFrameworkDeepLinks(html, pageFile) {
  const sourceDirectory = path.posix.dirname(pageFile);
  return html.replace(/href="(\/pages\/[^"?#]+)([^" ]*)"/gu, (_match, targetPath, suffix) => {
    const relativePath = path.posix.relative(sourceDirectory, targetPath.slice(1));
    return `href="${escapeAttribute(relativePath)}${escapeAttribute(suffix)}"`;
  });
}

function renderDeepHero(content, eyebrow = content.eyebrow ?? 'SAKURA FRAMEWORK ENGINEERING') {
  return `<header class="framework-detail-hero page-cover">
        <div class="container framework-detail-hero-inner">
            <div><p class="section-kicker">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(content.title)}</h1><p class="framework-subtitle">${escapeHtml(content.summary ?? content.subtitle)}</p></div>
            <div class="framework-detail-hero-actions"><a class="btn btn-primary" href="#overview">阅读本页</a><a class="btn btn-secondary" href="/pages/framework-engineering.html">返回 Engineering Hub</a></div>
        </div>
    </header>`;
}

function renderDeepOverview(content) {
  return `<section class="framework-detail-overview" id="overview">
        <div class="container"><div class="framework-boundary-grid">
            <article><p class="section-kicker">WHAT THIS SOLVES</p><h2>解决什么</h2><p>${escapeHtml(content.solves)}</p></article>
            <article><p class="section-kicker">WHAT THIS COSTS</p><h2>付出什么</h2><p>${escapeHtml(content.costs)}</p></article>
            <article><p class="section-kicker">WHERE IT DOES NOT APPLY</p><h2>哪里不适用</h2><p>${escapeHtml(content.whereNotApply)}</p></article>
        </div></div>
    </section>`;
}

function renderArchitectureDeepPage(content, architecture) {
  if (content.id === 'decisions') {
    const labels = [
      ['problem','Problem'],['constraints','Constraints'],['naiveApproach','Naive Approach'],['failure','Failure'],['decision','Decision'],['tradeoffs','Trade-offs / Where Not Apply'],['value','Value']
    ];
    const decisions = architecture.decisions.map((decision, index) => `<article class="framework-decision-card" id="decision-${escapeAttribute(decision.id)}">
                    <header><span>${String(index + 1).padStart(2, '0')}</span><h2>${escapeHtml(decision.title)}</h2></header>
                    <div class="framework-decision-sections">${labels.map(([key,label])=>`<section><h3>${label}</h3><p>${escapeHtml(decision[key])}</p></section>`).join('')}</div>
                </article>`).join('');
    return `${renderDeepHero(content)}${renderDeepOverview(content)}
    <section class="framework-detail-body framework-decision-list" id="decision-list"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">TEN DECISIONS · SEVEN SECTIONS</p><h2 class="section-title">为什么这样设计</h2></div><p class="section-intro">决策不是最佳实践清单；每项都保留约束、失败方案、代价和适用边界。</p></div>${decisions}</div></section>
    ${renderDeepNext(['/pages/framework/cases.html','/pages/framework/evidence.html','/pages/framework/reference.html'])}`;
  }
  return `${renderDeepHero(content)}${renderDeepOverview(content)}
    <section class="framework-detail-body" id="focus"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">SYSTEM MODEL</p><h2 class="section-title">系统重点</h2></div></div>${renderTextCards(content.focusPoints,'framework-focus-grid')}</div></section>
    <section class="framework-detail-body framework-failure-section" id="failure-model"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">FAILURE BEFORE HAPPY PATH</p><h2 class="section-title">失败模型</h2></div></div>${renderTextCards(content.failureModes,'framework-focus-grid')}</div></section>
    <section class="framework-detail-body" id="tradeoffs"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">TRADE-OFFS</p><h2 class="section-title">代价与边界</h2></div></div>${renderTextCards(content.tradeoffs,'framework-focus-grid')}</div></section>
    ${renderDeepNext(['/pages/framework/decisions.html','/pages/framework/cases.html','/pages/framework/evidence.html'])}`;
}

function renderEvidenceDeepPage(content, context) {
  let body = '';
  if (content.id === 'tooling') {
    body = `<section class="framework-detail-body" id="toolchains"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">WORKFLOW, NOT SCREENSHOTS</p><h2 class="section-title">三条可复跑工具链</h2></div></div><div class="framework-toolchain-grid">${context.evidence.toolchains.map((tool)=>`<article><span class="framework-status-badge">${escapeHtml(tool.status)}</span><h2>${escapeHtml(tool.title)}</h2><ol>${tool.workflow.map((step)=>`<li>${escapeHtml(step)}</li>`).join('')}</ol><p class="framework-boundary-note">${escapeHtml(tool.boundary)}</p></article>`).join('')}</div></div></section>`;
  } else if (content.id === 'evidence') {
    const ladder = context.authorities.levels.map((level,index)=>`<li><span>${String(index+1).padStart(2,'0')}</span><div><strong>${escapeHtml(level.label)}</strong><p>${escapeHtml(level.meaning)}</p></div></li>`).join('');
    const topics = context.evidence.evidenceTopics.map((topic)=>`<article><span class="framework-status-badge">${escapeHtml(topic.status)}</span><h2>${escapeHtml(topic.title)}</h2><p>${escapeHtml(topic.summary)}</p></article>`).join('');
    body = `<section class="framework-detail-body" id="evidence-ladder"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">DESIGNED → UNKNOWN</p><h2 class="section-title">八级 Evidence Ladder</h2></div><p class="section-intro">顺序表示证据类型，不表示可以自动逐级推断。</p></div><ol class="framework-evidence-ladder">${ladder}</ol></div></section><section class="framework-detail-body" id="evidence-topics"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">EVIDENCE BY TOPIC</p><h2 class="section-title">按主题保留真实上限</h2></div></div><div class="framework-topic-grid">${topics}</div></div></section>`;
  } else if (content.id === 'consumers') {
    const casesById = new Map(context.consumers.cases.map((entry)=>[entry.id,entry]));
    const rows = context.evidence.consumerHypotheses.map((hypothesis)=>{
      const consumer = casesById.get(hypothesis.caseId);
      if (!consumer) throw new Error(`consumer hypothesis references missing case: ${hypothesis.caseId}`);
      const verification = [consumer.verification.static ?? '', consumer.verification.editMode ? `EditMode ${consumer.verification.editMode.passed}/${consumer.verification.editMode.total}` : '', consumer.verification.playMode ? `PlayMode ${consumer.verification.playMode.passed}/${consumer.verification.playMode.total}` : '', consumer.verification.player ?? ''].filter(Boolean).join(' · ');
      return `<article class="framework-consumer-card"><div><p class="section-kicker">${escapeHtml(consumer.category)}</p><h2>${escapeHtml(consumer.title)}</h2><p>${escapeHtml(hypothesis.question)}</p></div><dl><div><dt>Packages</dt><dd>${consumer.packages.map((item)=>`<code>${escapeHtml(item.replace('com.unitygame.framework.',''))}</code>`).join(' ')}</dd></div><div><dt>Evidence</dt><dd>${escapeHtml(verification)}</dd></div><div><dt>Status</dt><dd>${escapeHtml(consumer.status)} / ${escapeHtml(consumer.runnerStatus)}</dd></div></dl><p class="framework-boundary-note">${escapeHtml(consumer.evidenceBoundary)}</p></article>`;
    }).join('');
    body = `<section class="framework-detail-body" id="consumer-matrix"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">SEVEN HYPOTHESES</p><h2 class="section-title">固定快照，不做泛化背书</h2></div><p class="section-intro">验证数字只说明对应提交和测试范围，不是排行榜。</p></div><div class="framework-consumer-grid">${rows}</div></div></section>`;
  } else if (content.id === 'cases') {
    body = `<section class="framework-detail-body" id="case-grid"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">FIVE COMPLETE LOOPS</p><h2 class="section-title">从问题到验证后的变化</h2></div></div><div class="framework-case-grid">${context.cases.cases.map((entry)=>`<a href="/pages/framework/cases/${escapeAttribute(entry.id)}.html"><span>${escapeHtml(entry.index)}</span><h2>${escapeHtml(entry.title)}</h2><p>${escapeHtml(entry.subtitle)}</p><strong>${escapeHtml(entry.status)}</strong></a>`).join('')}</div></div></section>`;
  }
  return `${renderDeepHero(content)}${renderDeepOverview(content)}${body}${renderDeepNext(['/pages/framework/decisions.html','/pages/framework/evolution.html','/pages/framework/reference.html'])}`;
}

function renderCaseStudyDeepPage(content, sectionOrder) {
  const labels = {problem:'Problem',constraints:'Constraints',naiveApproach:'Naive Approach',architectureDecision:'Architecture Decision',systemModel:'System Model',failureModel:'Failure Model',tradeOffs:'Trade-offs',implementation:'Implementation',evidence:'Evidence',consumer:'Consumer',knownLimitations:'Known Limitations',whatChangedAfterValidation:'What Changed After Validation'};
  const sections = sectionOrder.map((key,index)=>`<section><header><span>${String(index+1).padStart(2,'0')}</span><h2>${labels[key]}</h2></header><p>${escapeHtml(content.sections[key])}</p></section>`).join('');
  return `${renderDeepHero(content,`CASE ${content.index} · ${content.status}`)}<section class="framework-detail-overview" id="overview"><div class="container"><p class="framework-case-summary"><strong>${escapeHtml(content.status)}</strong><span>${escapeHtml(content.subtitle)}</span></p></div></section><section class="framework-detail-body framework-case-sections" id="case-sections"><div class="container">${sections}</div></section>${renderDeepNext(['/pages/framework/cases.html','/pages/framework/evidence.html','/pages/framework-engineering.html'])}`;
}

function renderEvolutionDeepPage(content) {
  return `${renderDeepHero(content)}<section class="framework-detail-overview" id="overview"><div class="container"><p class="section-intro">${escapeHtml(content.summary)} 时间线只展示公开工程变化，不投影内部 PLAN/TODO。</p></div></section><section class="framework-detail-body" id="timeline"><div class="container"><ol class="framework-evolution-timeline">${content.entries.map((entry)=>`<li><span>${escapeHtml(entry.phase)}</span><article><h2>${escapeHtml(entry.title)}</h2><dl><div><dt>Trigger</dt><dd>${escapeHtml(entry.trigger)}</dd></div><div><dt>Change</dt><dd>${escapeHtml(entry.change)}</dd></div><div><dt>Evidence</dt><dd>${escapeHtml(entry.evidence)}</dd></div><div><dt>Limitation</dt><dd>${escapeHtml(entry.limitation)}</dd></div></dl></article></li>`).join('')}</ol></div></section>${renderDeepNext(['/pages/framework/knowledge.html','/pages/framework/reference.html','/pages/framework-engineering.html'])}`;
}

function renderKnowledgeDeepPage(content, context) {
  const seriesBySlug = new Map(context.blogDiscovery.series.map((entry)=>[entry.slug,entry]));
  const series = content.series.map((slug)=>{ const entry=seriesBySlug.get(slug); if(!entry) throw new Error(`knowledge graph missing series: ${slug}`); return `<a href="/pages/blog/series/${escapeAttribute(slug)}.html"><span>Series</span><h2>${escapeHtml(entry.name)}</h2><p>${escapeHtml(entry.description)}</p></a>`; }).join('');
  const publishedById = new Map(context.publishedBlogs.map((entry)=>[entry.id,entry]));
  const articles = content.articles.map((id)=>{ const publication=context.publicationById.get(id); const article=publishedById.get(id); if(!publication||!article) throw new Error(`knowledge graph missing published article: ${id}`); return `<a href="/pages/blog/${escapeAttribute(publication.slug)}.html"><span>Article</span><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.summary)}</p></a>`; }).join('');
  const chainsById = new Map(context.evidenceChains.map((entry)=>[entry.id,entry]));
  const chains = content.evidenceChains.map((id)=>{const entry=chainsById.get(id);if(!entry)throw new Error(`knowledge graph missing evidence chain: ${id}`);return `<article><span>Evidence Chain</span><h2>${escapeHtml(entry.title)}</h2><p>${escapeHtml(entry.question)}</p><p class="framework-boundary-note">${escapeHtml(entry.limitation)}</p></article>`;}).join('');
  return `${renderDeepHero(content)}<section class="framework-detail-overview" id="overview"><div class="container"><div class="framework-knowledge-clusters">${content.clusters.map((entry)=>`<a href="/${escapeAttribute(entry.frameworkRoute)}"><span>${escapeHtml(entry.title)}</span><p>${escapeHtml(entry.question)}</p></a>`).join('')}</div></div></section><section class="framework-detail-body" id="knowledge-series"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">FRAMEWORK → SERIES</p><h2 class="section-title">长期研究入口</h2></div></div><div class="framework-knowledge-grid">${series}</div></div></section><section class="framework-detail-body" id="knowledge-articles"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">DECISION SOURCES</p><h2 class="section-title">已发布文章节点</h2></div></div><div class="framework-knowledge-grid">${articles}</div></div></section><section class="framework-detail-body" id="evidence-graph"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">JOURNAL → FRAMEWORK → CONSUMER</p><h2 class="section-title">公开证据链</h2></div></div><div class="framework-topic-grid">${chains}</div></div></section>${renderDeepNext(['/pages/journal.html','/pages/blog.html','/pages/framework/evidence.html'])}`;
}

function renderModuleReferenceDeepPage(content) {
  const cards = content.modules.map((entry)=>`<article class="framework-module-reference-card"><header><div><p class="section-kicker">${escapeHtml(entry.layer)} · ${escapeHtml(entry.lifecycle)}</p><h2>${escapeHtml(entry.id)}</h2></div><code>${escapeHtml(entry.version)}</code></header><p>${escapeHtml(entry.role)}</p><dl><div><dt>Engine Boundary</dt><dd>${escapeHtml(entry.engineBoundary)}</dd></div><div><dt>Dependencies</dt><dd>${entry.dependencies.length?entry.dependencies.map((dep)=>`<code>${escapeHtml(dep)}</code>`).join(' '):'none'}</dd></div><div><dt>Consumers</dt><dd>${escapeHtml(entry.consumers)}</dd></div><div><dt>Evidence</dt><dd>${escapeHtml(entry.evidence)}</dd></div><div><dt>Public Surface</dt><dd>${escapeHtml(entry.publicSurface)}</dd></div></dl></article>`).join('');
  return `${renderDeepHero(content)}<section class="framework-detail-overview" id="overview"><div class="container"><p class="section-intro">${escapeHtml(content.summary)} <a href="/pages/framework.html#reference">返回完整自动 Reference。</a></p></div></section><section class="framework-detail-body" id="module-reference"><div class="container"><div class="section-heading-row"><div><p class="section-kicker">TWELVE CURATED MODULES</p><h2 class="section-title">Role / Layer / Lifecycle / Boundary / Evidence</h2></div></div><div class="framework-module-reference-grid">${cards}</div></div></section>${renderDeepNext(['/pages/framework.html#reference','/pages/framework/consumers.html','/pages/framework-engineering.html'])}`;
}

function renderTextCards(items, className) { return `<div class="${className}">${items.map((item,index)=>`<article><span>${String(index+1).padStart(2,'0')}</span><p>${escapeHtml(item)}</p></article>`).join('')}</div>`; }
function renderDeepNext(routes) { const labels={'/pages/framework-engineering.html':'Engineering Hub','/pages/framework/decisions.html':'Architecture Decisions','/pages/framework/cases.html':'Flagship Cases','/pages/framework/evidence.html':'Evidence Model','/pages/framework/evolution.html':'Evolution','/pages/framework/reference.html':'Module Reference','/pages/framework/knowledge.html':'Knowledge Graph','/pages/framework/consumers.html':'Consumer Matrix','/pages/framework.html#reference':'Full Framework Reference','/pages/journal.html':'Journal','/pages/blog.html':'Blog'}; return `<section class="framework-detail-next" id="next-route"><div class="container"><p class="section-kicker">CONTINUE THE SYSTEM</p><div>${routes.map((route)=>`<a href="${escapeAttribute(route)}">${escapeHtml(labels[route]??'Continue')} <i class="fas fa-arrow-right" aria-hidden="true"></i></a>`).join('')}</div></div></section>`; }

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
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="../style/iris-sakura.css">
    <!-- brand-styles:end -->
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

async function writeFrameworkEngineeringSource(shellTemplate) {
  const marker = '<!-- framework-engineering-content:start -->';
  if (!shellTemplate.includes(marker) || !shellTemplate.includes('<!-- framework-engineering-content:end -->')) {
    throw new Error('framework engineering shell must expose its generator-owned content block');
  }
  if (!shellTemplate.includes('framework-engineering.css')) {
    throw new Error('framework engineering shell must load its page stylesheet');
  }
  await writeFile(path.join(root, 'pages/framework-engineering.html'), shellTemplate);
}

async function writeFrameworkDeepSources(definitions) {
  for (const definition of definitions) {
    const absolutePath = path.join(root, definition.file);
    const sourcePrefix = '../'.repeat(definition.file.split('/').length - 1);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(definition.title)}</title>
    <link rel="stylesheet" href="${sourcePrefix}style/main.css">
    <link rel="stylesheet" href="${sourcePrefix}style/framework.css">
    <link rel="stylesheet" href="${sourcePrefix}style/framework-engineering.css">
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="${sourcePrefix}style/iris-sakura.css">
    <!-- brand-styles:end -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
<a class="skip-link" href="#main-content">跳到主要内容</a>
<nav class="navbar"></nav>
<main id="main-content" class="main-content framework-detail-main">
    <!-- framework-detail-content:start -->
    <!-- framework-detail-content:end -->
</main>
<footer class="footer"></footer>
<script src="${sourcePrefix}dist/site.js" type="module"></script>
</body>
</html>
`);
  }
}

async function writeBrandSource() {
  await writeFile(path.join(root, 'pages/brand.html'), `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IrisSakura Brand System | IrisSakura</title>
    <link rel="stylesheet" href="../style/main.css">
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="../style/iris-sakura.css">
    <!-- brand-styles:end -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
<a class="skip-link" href="#main-content">跳到主要内容</a>
<nav class="navbar"></nav>
<main id="main-content" class="main-content brand-main">
    <!-- brand-content:start -->
    <!-- brand-content:end -->
</main>
<footer class="footer"></footer>
<script src="../dist/site.js" type="module"></script>
</body>
</html>
`);
}

async function writeCompatibilityRouteSources() {
  await Promise.all([
    writeFile(path.join(root, 'pages/about.html'), `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0; url=../index.html">
    <title>关于页面已迁移 | IrisSakura</title>
    <link rel="stylesheet" href="../style/main.css">
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="../style/iris-sakura.css">
    <!-- brand-styles:end -->
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
`),
    writeFile(path.join(root, 'pages/art-music.html'), `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0; url=brand.html">
    <title>品牌页面已迁移 | IrisSakura</title>
    <link rel="stylesheet" href="../style/main.css">
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="../style/iris-sakura.css">
    <!-- brand-styles:end -->
</head>
<body>
<a class="skip-link" href="#main-content">跳到主要内容</a>
<nav class="navbar"></nav>
<main id="main-content" class="not-found-main">
    <section class="container not-found-card">
        <p class="section-kicker">ROUTE MOVED</p>
        <h1>品牌系统已迁移到独立页面</h1>
        <p>原“美术音乐”入口不再承担品牌规范职责；这个旧地址会自动前往 Brand 页面。</p>
        <a class="btn btn-primary" href="brand.html">前往 Brand</a>
    </section>
</main>
<footer class="footer"></footer>
<script src="../dist/site.js" type="module"></script>
</body>
</html>
`)
  ]);
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
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="../../style/iris-sakura.css">
    <!-- brand-styles:end -->
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
    <title>${escapeHtml(design.title)} | IrisSakura Journal</title>
    <link rel="stylesheet" href="../../style/main.css">
    <link rel="stylesheet" href="../../style/journal.css">
    <link rel="stylesheet" href="../../style/blog.css">
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="../../style/iris-sakura.css">
    <!-- brand-styles:end -->
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
      h1: ['id'],
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
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="../../../style/iris-sakura.css">
    <!-- brand-styles:end -->
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
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="../../style/iris-sakura.css">
    <!-- brand-styles:end -->
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
    <title>${escapeHtml(note.title)} | IrisSakura Journal</title>
    <link rel="stylesheet" href="../../style/main.css">
    <link rel="stylesheet" href="../../style/journal.css">
    <!-- brand-styles:start -->
    <link rel="stylesheet" href="../../style/iris-sakura.css">
    <!-- brand-styles:end -->
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

function renderPageIndex(config) {
  const links = config.items.map(([id, label], index) => (
    `<a href="#${escapeAttribute(id)}" data-page-index-link${index === 0 ? ' aria-current="location"' : ''}><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(label)}</a>`
  )).join('');
  return `<!-- page-index:start -->
    <nav class="page-index" aria-label="${escapeAttribute(config.ariaLabel)}" data-page-index>
        <div class="container page-index-inner">
            <span class="page-index-heading" aria-hidden="true"><small>ON THIS PAGE</small><strong>${escapeHtml(config.title)}</strong></span>
            <div class="page-index-links">${links}</div>
            <span class="page-index-progress" aria-hidden="true"></span>
        </div>
    </nav>
    <!-- page-index:end -->`;
}

function installPageIndex(html, page) {
  const config = page.pageIndex
    ? { ariaLabel: `${page.title} 章节`, title: '浏览本页', insertBefore: '    <!-- framework-detail-content:start -->', items: page.pageIndex }
    : PAGE_INDEXES[page.file];
  html = html.replace(/<!-- page-index:start -->[\s\S]*?<!-- page-index:end -->/u, '');
  if (!config) return html;

  const insertionOffset = html.indexOf(config.insertBefore);
  if (insertionOffset < 0) {
    throw new Error(`missing page index insertion point in ${page.file}`);
  }
  html = `${html.slice(0, insertionOffset)}${renderPageIndex(config)}\n${html.slice(insertionOffset)}`;

  for (const [id] of config.items) {
    const targetPattern = new RegExp(`(<[a-z][^>]*\\bid="${escapeRegExp(id)}"[^>]*)(>)`, 'iu');
    let installed = false;
    html = html.replace(targetPattern, (fullMatch, openTag, closeTag) => {
      installed = true;
      return openTag.includes('data-page-index-target')
        ? fullMatch
        : `${openTag} data-page-index-target${closeTag}`;
    });
    if (!installed) throw new Error(`missing page index target ${id} in ${page.file}`);
  }
  return html;
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

function formatPublicDate(value) {
  return value.slice(0, 10);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
