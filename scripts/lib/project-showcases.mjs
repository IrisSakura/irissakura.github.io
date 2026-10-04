import { esc } from './website-v2.mjs';

const ID = /^[a-z][a-z0-9-]*$/u;
const ROUTE = /^\/pages\/[a-z0-9/-]+\.html(?:#[a-z0-9-]+)?$/u;
const fail = (message) => { throw new Error(`project-showcases: ${message}`); };
const text = (value) => { if (typeof value !== 'string' || !value.trim()) fail('expected nonempty text'); };
const only = (value, keys) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some((key) => !keys.includes(key))) fail('unknown content field');
};
const links = (items = []) => {
  if (!Array.isArray(items)) fail('expected links');
  for (const item of items) {
    only(item, ['label', 'href']); text(item.label);
    if (!ROUTE.test(item.href)) fail('expected an internal reading route');
  }
};

// The shared chapter format is deliberately text-only. Product media belongs to
// an explicitly authored page, never a chapter or a Wisteria content import.
export function assertProjectShowcases(data) {
  only(data, ['schemaVersion', 'updatedAt', 'chapters', 'tools', 'frameworkUseCases']);
  if (data.schemaVersion !== 1 || !/^\d{4}-\d{2}-\d{2}$/u.test(data.updatedAt)) fail('invalid version or date');
  if (!data.chapters || !Array.isArray(data.chapters.wisteria)) fail('missing Wisteria chapters');
  for (const [project, chapters] of Object.entries(data.chapters)) {
    if (!ID.test(project) || !Array.isArray(chapters)) fail('invalid chapter group');
    const ids = new Set();
    for (const chapter of chapters) {
      only(chapter, ['id', 'kicker', 'title', 'intro', 'paragraphs', 'cards', 'steps', 'note', 'links']);
      if (!ID.test(chapter.id) || ids.has(chapter.id)) fail('duplicate or invalid chapter id');
      ids.add(chapter.id);
      for (const field of ['kicker', 'title', 'intro']) text(chapter[field]);
      if (chapter.note !== undefined) text(chapter.note);
      if (chapter.paragraphs !== undefined) {
        if (!Array.isArray(chapter.paragraphs)) fail('expected paragraphs');
        chapter.paragraphs.forEach(text);
      }
      for (const field of ['cards', 'steps']) {
        if (chapter[field] === undefined) continue;
        if (!Array.isArray(chapter[field])) fail(`expected ${field}`);
        for (const item of chapter[field]) {
          only(item, ['title', 'body', 'links']); text(item.title); text(item.body); links(item.links);
        }
      }
      links(chapter.links);
    }
  }
  if (!Array.isArray(data.tools) || !Array.isArray(data.frameworkUseCases)) fail('missing tools or use cases');
  for (const tool of data.tools) {
    only(tool, ['name', 'input', 'output']); ['name', 'input', 'output'].forEach((field) => text(tool[field]));
  }
  const routes = new Set();
  for (const entry of data.frameworkUseCases) {
    only(entry, ['routeId', 'title', 'body']); text(entry.title); text(entry.body);
    if (!ID.test(entry.routeId) || routes.has(entry.routeId)) fail('invalid or duplicate adoption route');
    routes.add(entry.routeId);
  }
  return data;
}

function renderLinks(items = [], prefix) {
  return items.length ? `<ul class="chapter-links">${items.map(({ label, href }) => `<li><a href="${esc(prefix + href.slice(1))}">${esc(label)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul>` : '';
}

export function renderProjectChapters(chapters, prefix = '../') {
  return chapters.map((chapter) => `<section class="project-chapter" id="${esc(chapter.id)}" aria-labelledby="${esc(chapter.id)}-title"><div class="container">
    <header class="chapter-heading"><p class="section-kicker">${esc(chapter.kicker)}</p><h2 id="${esc(chapter.id)}-title">${esc(chapter.title)}</h2><p>${esc(chapter.intro)}</p></header>
    ${(chapter.paragraphs ?? []).map((paragraph) => `<p class="chapter-prose">${esc(paragraph)}</p>`).join('')}
    ${chapter.steps ? `<ol class="chapter-steps">${chapter.steps.map((step, index) => `<li><span class="chapter-step-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><h3>${esc(step.title)}</h3><p>${esc(step.body)}</p>${renderLinks(step.links, prefix)}</li>`).join('')}</ol>` : ''}
    ${chapter.cards ? `<div class="chapter-grid">${chapter.cards.map((card) => `<article><h3>${esc(card.title)}</h3><p>${esc(card.body)}</p>${renderLinks(card.links, prefix)}</article>`).join('')}</div>` : ''}
    ${chapter.note ? `<p class="chapter-note">${esc(chapter.note)}</p>` : ''}
    ${renderLinks(chapter.links, prefix)}
  </div></section>`).join('\n');
}

export function renderFrameworkUseCases(entries, adoption) {
  const routes = new Map(adoption.stableRoutes.map((route) => [route.id, route]));
  // A reviewed route may be waiting for its authoritative source snapshot.
  // Only render routes in the effective, hash-matched adoption set.
  const available = entries.filter((entry) => routes.has(entry.routeId));
  return `<section class="project-chapter" id="use-cases" aria-labelledby="use-cases-title"><div class="container"><header class="chapter-heading"><p class="section-kicker">CHOOSE BY THE PROBLEM</p><h2 id="use-cases-title">从要解决的问题，找到采用路线</h2><p>先确定项目需要的行为，再选择对应组合。每条路线都说明项目仍需提供的内容和生命周期管理。</p></header><div class="chapter-grid">${available.map((entry) => {
    const route = routes.get(entry.routeId);
    return `<article><p class="chapter-eyebrow">${esc(route.label)}</p><h3>${esc(entry.title)}</h3><p>${esc(entry.body)}</p><ul class="chapter-links"><li><a href="#adoption-${esc(route.id)}">查看组合与使用边界 <span aria-hidden="true">↓</span></a></li></ul></article>`;
  }).join('')}</div></div></section>`;
}
