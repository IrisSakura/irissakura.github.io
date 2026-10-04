const FORBIDDEN = /(?:\/Users\/|sourceCommit|contentPath|sha256|WEBSITE_GITHUB_SSH_KEY|sakura-design-journal\.git|\b[a-f0-9]{40}\b)/iu;
const MODULE_TERMS = { pooling: ['object pool', '对象池'], bootstrap: ['quickstart', '启动'], save: ['存档'], event: ['事件'], ui: ['界面'] };
const EXTRA_PROJECT_ROUTES = {
  'sword-of-words': '/pages/game.html',
  'iris-core': '/pages/mods.html#mod-foundations',
  'the-weaver': '/pages/mods/the-weaver.html',
  udgap: '/pages/portfolio.html#portfolio-cases'
};

export function buildSiteSearchIndex({ pages, journalIndex, presentations, projects, framework, showcases }) {
  const presentationById = new Map(presentations.map((entry) => [entry.projectId, entry]));
  const documents = [];
  const add = (entry) => {
    if (!entry.id || !entry.title || !entry.url || !entry.url.startsWith('/')) throw new Error(`Invalid search document ${entry.id}`);
    const clean = {
      id: entry.id,
      type: entry.type,
      title: redact(entry.title),
      summary: redact(entry.summary),
      url: entry.url,
      keywords: (entry.keywords ?? []).map(redact),
      tags: (entry.tags ?? []).map(redact),
      series: redact(entry.series ?? ''),
      projectId: entry.projectId ?? null
    };
    if (FORBIDDEN.test(JSON.stringify(clean))) throw new Error(`Private search content: ${entry.id}`);
    documents.push(clean);
  };

  for (const entry of journalIndex.entries) {
    add({
      id: entry.id,
      type: entry.type === 'article' ? 'article' : 'research',
      title: entry.title,
      summary: entry.summary,
      url: entry.url,
      keywords: entry.engines,
      tags: entry.tags,
      series: entry.series
    });
  }
  for (const project of projects.projects) {
    const presentation = presentationById.get(project.id);
    const url = presentation?.route ?? EXTRA_PROJECT_ROUTES[project.id];
    if (!url) throw new Error(`Project has no public route: ${project.id}`);
    add({
      id: `project:${project.id}`,
      type: 'project',
      title: presentation?.displayName ?? project.title,
      summary: presentation?.summary ?? project.summary,
      url,
      keywords: presentation?.keywords ?? project.technologies ?? [],
      tags: [project.category, presentation?.status && presentation.status !== '以公开项目近况为准' ? presentation.status : project.status],
      projectId: project.id
    });
  }
  for (const presentation of presentations) {
    if (documents.some((entry) => entry.id === `project:${presentation.projectId}`)) continue;
    add({ id: `project:${presentation.projectId}`, type: 'project', title: presentation.displayName,
      summary: presentation.summary, url: presentation.route, keywords: presentation.keywords ?? [presentation.role], projectId: presentation.projectId });
  }
  for (const [projectId, chapters] of Object.entries(showcases?.chapters ?? {})) {
    const presentation = presentationById.get(projectId);
    const route = presentation?.route ?? EXTRA_PROJECT_ROUTES[projectId];
    if (!route) throw new Error(`Project chapter has no public route: ${projectId}`);
    for (const chapter of chapters) {
      add({ id: `chapter:${projectId}:${chapter.id}`, type: 'project', title: chapter.title,
        summary: chapter.intro, url: `${route}#${chapter.id}`, projectId,
        keywords: [presentation?.displayName ?? projectId, ...(chapter.cards ?? []).map((item) => item.title), ...(chapter.steps ?? []).map((item) => item.title)] });
    }
  }
  for (const module of framework.featuredModules) {
    add({ id: `framework:${module.id}`, type: 'framework', title: module.displayName,
      summary: `SakuraGameFramework ${module.displayName} 模块与能力参考。`,
      url: `/pages/framework.html#module-${module.id}`,
      keywords: [module.id, ...(MODULE_TERMS[module.id] ?? [])], projectId: 'sakura-framework' });
  }
  const usedUrls = new Set(documents.filter((entry) => entry.type !== 'framework').map((entry) => entry.url));
  for (const page of pages) {
    if (page.noIndex || page.file === '404.html' || usedUrls.has(page.canonical)) continue;
    add({ id: `page:${page.file}`, type: 'page', title: page.title.replace(/ \| .*$/u, ''),
      summary: page.description, url: page.canonical, keywords: [page.key, page.schemaType].filter(Boolean) });
  }
  documents.sort((left, right) => left.id.localeCompare(right.id, 'en'));
  if (new Set(documents.map((entry) => entry.id)).size !== documents.length) throw new Error('Duplicate search document ID');
  return { schemaVersion: 1, totalCount: documents.length, documents };
}

function redact(value) {
  return String(value ?? '').replace(/\b[a-f0-9]{7,40}(?:\.{3}|…)?(?=\W|$)/giu, '已脱敏提交');
}

export function rankSiteSearch(documents, query) {
  const terms = String(query).normalize('NFKC').toLocaleLowerCase('zh-CN').trim().split(/\s+/u).filter(Boolean);
  if (!terms.length) return documents.slice(0, 12);
  const score = (doc) => {
    const fields = [doc.title, doc.keywords.join(' '), doc.tags.join(' '), doc.series, doc.summary]
      .map((field) => field.normalize('NFKC').toLocaleLowerCase('zh-CN'));
    if (!terms.every((term) => fields.some((field) => field.includes(term)))) return 0;
    return terms.reduce((sum, term) => sum + Math.max(
      fields[0] === term ? 120 : 0,
      fields[0].startsWith(term) ? 90 : 0,
      fields[0].includes(term) ? 70 : 0,
      fields[1].includes(term) ? 55 : 0,
      fields[2].includes(term) ? 45 : 0,
      fields[3].includes(term) ? 35 : 0,
      fields[4].includes(term) ? 15 : 0
    ), 0);
  };
  return documents.map((doc) => ({ doc, score: score(doc) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.id.localeCompare(b.doc.id, 'en'))
    .map((entry) => entry.doc);
}
