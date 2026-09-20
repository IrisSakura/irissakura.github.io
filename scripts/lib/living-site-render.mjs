import { resolveCurrentNow, resolveRecentUpdates, resolveHomeWriting, UPDATE_TYPES } from './living-site-model.mjs';

const escape = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const href = (route, prefix) => route.startsWith('/') ? `${prefix}${route === '/' ? 'index.html' : route.slice(1)}` : route;
const link = (route, label, prefix, className = 'text-link') => `<a class="${className}" href="${escape(href(route, prefix))}">${escape(label)}</a>`;
const heading = (kicker, title, action = '') => `<div class="living-heading"><div><p class="section-kicker">${kicker}</p><h2>${title}</h2></div>${action}</div>`;
export function renderNowList(items, prefix = '') {
  return `<ul class="now-list">${items.map((item) => `<li><h3>${item.href ? link(item.href, item.title, prefix) : escape(item.title)}</h3>${item.summary ? `<p>${escape(item.summary)}</p>` : ''}</li>`).join('')}</ul>`;
}
export function renderUpdateFeed(items, prefix = '') {
  return `<div class="update-feed">${items.map((item) => `<article class="update-entry" data-update-id="${escape(item.id)}"><time datetime="${item.date}">${item.date}</time><div><p class="update-type">${UPDATE_TYPES[item.type]}</p><h3>${item.href ? link(item.href, item.title, prefix) : escape(item.title)}</h3><p>${escape(item.summary)}</p></div></article>`).join('')}</div>`;
}
function featuredWork(game, prefix, id, headingLevel = 2) {
  return `<section class="flagship-section living-featured" id="${id}" data-brand-layout="editorial"><div class="container flagship-grid"><div class="flagship-media"><img src="${escape(prefix + game.homeImage)}" alt="${escape(game.imageAlt)}" loading="lazy" decoding="async" width="1920" height="1080"></div><div class="flagship-copy"><p class="section-kicker">FEATURED WORK</p><h${headingLevel}>《${escape(game.title)}》</h${headingLevel}><p class="living-lead">在战斗、选择与构筑之间，走出自己的冒险。</p><p>选择下一个房间，在实时战斗中应对敌人，再用潜能、技能与祝福塑造这一局的玩法。</p><p>我想探索动作操作与局内构筑如何相互影响，让每次选择都能改变下一场战斗。</p>${link('/pages/game.html', '查看作品', prefix, 'btn btn-primary')}<p class="work-availability">可玩原型 · 暂无公开 Demo</p></div></div></section>`;
}
export function renderLivingHome({ projects, site, presentations, presentation, now, updates, articles, series, brand }) {
  const current = resolveCurrentNow(now);
  const game = projects.projects.find(({ id }) => id === presentation.home.featuredWorkId);
  const writing = resolveHomeWriting(articles, presentation.home.recentArticleLimit);
  const sections = {
    profile: `<section id="profile" class="hero-section profile-hero living-profile" data-brand-layout="editorial"><div class="container profile-hero-inner"><div class="profile-identity"><img class="profile-avatar-large" src="${escape(site.profile.avatar)}" alt="${escape(site.profile.avatarAlt)}" width="120" height="120" decoding="async"><div class="profile-copy"><p class="section-kicker">GAMES · SYSTEMS · WRITING</p><h1 class="hero-title">你好，我是 <span class="highlight">${escape(site.profile.nickname)}</span></h1><p class="profile-role">${escape(site.profile.role)}</p><p class="hero-description">${escape(site.profile.introduction)}</p></div><div class="hero-buttons">${link('/pages/portfolio.html', '查看作品', '', 'btn btn-primary')}${link('/pages/now.html', '最近在做什么', '', 'btn btn-secondary')}</div></div></div></section>`,
    now: `<section id="now" class="home-now living-section"><div class="container">${heading('NOW', '最近在做', link('/pages/now.html', '查看 Now →', ''))}${renderNowList(current.current)}<p class="living-date">更新于 <time datetime="${current.updatedAt}">${current.updatedAt}</time></p></div></section>`,
    'featured-work': featuredWork(game, '', 'featured-work'),
    'recent-updates': `<section id="recent-updates" class="home-updates living-section"><div class="container">${heading('UPDATES', '最近更新')}${renderUpdateFeed(resolveRecentUpdates(updates, presentation.home.recentUpdateLimit))}</div></section>`,
    writing: `<section id="writing" class="home-writing living-section"><div class="container">${heading('WRITING', '最近写的', link('/pages/blog.html', '全部文章 →', ''))}<div class="writing-list">${writing.map((article) => `<article class="writing-entry" data-article-id="${escape(article.id)}"><time datetime="${article.publishedAt}">${article.publishedAt}</time><h3>${link(`/pages/blog/${article.slug}.html`, article.title, '')}</h3><p>${escape(article.summary)}</p></article>`).join('')}</div></div></section>`,
    mods: `<section id="mods" class="home-mod-series" data-brand-layout="editorial" aria-labelledby="home-mod-series-title"><div class="container home-mod-series-inner"><img src="${escape(brand.assets.freesiaLogoSmall)}" alt="" width="112" height="112" loading="lazy" decoding="async"><div><p class="section-kicker">MODS</p><h2 id="home-mod-series-title">${escape(series.displayName)}</h2><p>我为喜欢的游戏做的一些 Mod。</p></div>${link('/pages/mods.html', '浏览 Mods', '', 'btn btn-secondary')}</div></section>`,
    projects: `<section id="projects" class="home-projects home-projects-compact living-section" data-brand-layout="editorial"><div class="container">${heading('PROJECTS', '支持这些创作的长期项目')}<div class="project-entry-grid">${presentations.map((project) => `<article class="project-entry-card project-entry-card-${project.brandFamily}" data-project-id="${project.projectId}"><img src="${escape(project.logo)}" alt="" width="48" height="48" loading="lazy" decoding="async"><h3>${escape(project.displayName)}</h3><p>${escape(project.summary)}</p>${link(project.route, '了解项目 →', '')}</article>`).join('')}</div></div></section>`,
    contact: `<section id="contact" class="public-cta living-section"><div class="container about-home"><p class="section-kicker">ABOUT</p><h2>关于我</h2><p>我主要做游戏。程序是目前最主要的工具，但我的兴趣也延伸到游戏系统、创作工具，以及这些东西为什么应该这样工作。</p><div class="hero-buttons">${link('/pages/contact.html', '关于我', '', 'btn btn-secondary')}${link('/pages/contact.html#contact', '联系', '', 'btn btn-secondary')}</div></div></section>`
  };
  return `<section id="home-page" class="page active living-home">${presentation.home.sectionOrder.map((id) => sections[id]).join('\n')}</section>`;
}
export function renderLivingNow(now, updates) {
  const current = resolveCurrentNow(now);
  const optional = (id, label, items) => items.length ? `<section class="living-section" id="${id}"><h2>${label}</h2>${renderNowList(items, '../')}</section>` : '';
  return `<header class="now-hero"><p class="section-kicker">NOW</p><h1>最近在做什么</h1><p class="living-date">更新于 <time datetime="${current.updatedAt}">${current.updatedAt}</time></p><p class="living-lead">${escape(current.intro)}</p></header><section class="living-section" id="current"><h2>正在做</h2>${renderNowList(current.current, '../')}</section>${optional('thinking', '最近在想', current.thinking)}${optional('recently-completed', '刚完成', current.recentlyCompleted)}<section class="living-section" id="recent-updates"><h2>最近更新</h2>${renderUpdateFeed(resolveRecentUpdates(updates, 12), '../')}</section><nav class="living-next" aria-label="继续浏览">${link('/pages/portfolio.html', '作品', '../')}${link('/pages/blog.html', '文章', '../')}${link('/pages/development.html', '项目', '../')}</nav>`;
}
export function renderLivingPortfolio(projectData, presentation, consumers) {
  const featured = projectData.projects.find(({ id }) => id === presentation.portfolio.featuredProjectId);
  const groups = presentation.portfolio.groups.map((group) => {
    const entries = group.projectIds.filter((id) => id !== featured.id).map((id) => projectData.projects.find((project) => project.id === id));
    if (!entries.length) return '';
    return `<section class="living-section work-group" id="${group.id}"><div class="container"><h2>${escape(group.label)}</h2>${entries.map((project) => `<article class="work-entry" id="project-${project.id}"><h3>${escape(project.title)}</h3><p>${escape(presentation.portfolio.descriptions?.[project.id] ?? project.summary)}</p><p class="work-availability">开发中 · 暂无公开试玩</p>${project.href ? link(project.href, '了解作品', '../') : ''}</article>`).join('')}</div></section>`;
  }).join('');
  return `<header class="portfolio-header"><div class="container"><p class="section-kicker">WORKS</p><h1>游戏与作品</h1><p>做出来的游戏、Mod，以及仍在生长的原型。</p></div></header>
    <div id="portfolio-journey" class="legacy-anchor"></div><div id="portfolio-cases">${featuredWork(featured, '../', `project-${featured.id}`)}</div>
    <section class="living-section work-mods" id="work-mods"><div class="container">${heading('MODS', 'Freesia Mods')}<p>为喜欢的游戏添加角色、卡牌与新的玩法想法。</p>${link('/pages/mods.html', '查看 Freesia Mods 系列 →', '../')}<p id="project-the-weaver">${link('/pages/mods.html#mod-works', 'The Weaver · 杀戮尖塔 2 角色 Mod', '../')}</p><p id="project-iris-core">${link('/pages/mods.html#mod-foundations', 'Mod 制作的技术基础', '../')}</p></div></section>${groups}
    <section class="living-section technical-work" id="consumer-lab"><div class="container"><h2>技术实验与采用案例</h2><p>我也做了一些用于玩法和框架验证的实验项目。</p>${link('/pages/framework.html#game-adoption', '查看技术实验与采用案例 →', '../')}<p>${link('/pages/development.html', '了解长期项目', '../')}</p><details class="legacy-consumer-links"><summary>查找项目与实验</summary>${presentation.projects.map((project) => `<p id="project-${project.projectId}">${link(project.route, project.displayName, '../')}</p>`).join('')}${consumers.cases.map((entry) => `<p id="consumer-${entry.id}">${link(`/pages/framework.html#consumer-${entry.id}`, entry.title, '../')}</p>`).join('')}</details></div></section>`;
}
