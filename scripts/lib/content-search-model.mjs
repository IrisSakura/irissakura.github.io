const TYPE_DEFINITIONS = [
  { id: 'article', label: '正式文章' },
  { id: 'game-design', label: '游戏设计' },
  { id: 'framework-audit', label: '框架审计' }
];
const ENGINE_DEFINITIONS = [
  { id: 'cocos-engine', label: 'Cocos Engine', tags: new Set(['cocos-engine']) },
  { id: 'godot', label: 'Godot', tags: new Set(['godot']) },
  { id: 'unity', label: 'Unity', tags: new Set(['unity']) },
  { id: 'unreal-engine', label: 'Unreal Engine', tags: new Set(['unreal', 'unreal-engine', 'ue6']) }
];
const PRIVATE_PATTERNS = [/\/Users\//u, /(?:git@|https?:\/\/)[^\s]*sakura-design-journal/iu, /WEBSITE_GITHUB_SSH_KEY/u];
const SOURCE_SHA_PATTERN = /\b[a-f0-9]{7,40}(?:\.{3}|…)?(?=\W|$)/giu;

export function buildContentSearchIndex(sourceData, publishedBlogs, discovery) {
  if (
    !Array.isArray(sourceData?.audits)
    || !Array.isArray(sourceData?.gameDesigns)
    || !Array.isArray(publishedBlogs)
    || !Array.isArray(discovery?.series)
  ) {
    throw new Error('Content search requires public audits, game designs, formal articles and taxonomy.');
  }

  const entries = [
    ...publishedBlogs.map((article) => createEntry({
      id: `article:${article.id}`,
      type: 'article',
      typeLabel: '正式文章',
      title: article.title,
      summary: article.summary,
      tags: article.tags,
      series: article.series,
      updatedAt: article.updatedAt,
      url: `/pages/blog/${article.slug}.html`
    })),
    ...sourceData.gameDesigns.map((design) => createEntry({
      id: `game-design:${design.id}`,
      type: 'game-design',
      typeLabel: '游戏设计',
      title: design.title,
      summary: design.summary,
      tags: design.tags,
      series: '',
      updatedAt: design.updatedAt,
      url: `/pages/journal/${design.id}.html`
    })),
    ...sourceData.audits.map((audit) => createEntry({
      id: `framework-audit:${audit.id}`,
      type: 'framework-audit',
      typeLabel: '框架审计',
      title: audit.title,
      summary: audit.summary,
      tags: [],
      series: '',
      updatedAt: audit.updatedAt,
      url: '/pages/journal.html#content-search'
    }))
  ].sort((left, right) => (
    right.updatedAt.localeCompare(left.updatedAt)
    || left.type.localeCompare(right.type)
    || left.id.localeCompare(right.id)
  ));

  if (new Set(entries.map((entry) => entry.id)).size !== entries.length) {
    throw new Error('Content search entry IDs must be unique.');
  }
  const serialized = JSON.stringify(entries);
  for (const pattern of PRIVATE_PATTERNS) {
    if (pattern.test(serialized)) throw new Error(`Content search index contains private text matching ${pattern}.`);
  }

  const facets = {
    types: TYPE_DEFINITIONS.map((definition) => ({
      id: definition.id,
      label: definition.label,
      count: entries.filter((entry) => entry.type === definition.id).length
    })),
    series: discovery.series.map((entry) => ({
      id: entry.slug,
      label: entry.name,
      count: entries.filter((candidate) => candidate.series === entry.name).length
    })),
    engines: ENGINE_DEFINITIONS.map(({ id, label }) => ({
      id,
      label,
      count: entries.filter((entry) => entry.engines.includes(id)).length
    })).filter((entry) => entry.count > 0)
  };

  return {
    schemaVersion: 1,
    generatedAt: sourceData.generatedAt,
    totalCount: entries.length,
    facets,
    entries
  };
}

export function resolveFeaturedReading(discovery) {
  if (!Array.isArray(discovery?.series) || discovery.series.length === 0) {
    throw new Error('Featured Reading requires resolved Blog Series.');
  }
  return discovery.series.map((series) => {
    const article = series.articles?.[0];
    if (!article) throw new Error(`Featured Reading Series ${series.name} has no formal article.`);
    return {
      series: { name: series.name, slug: series.slug, description: series.description },
      article
    };
  });
}

function createEntry({ id, type, typeLabel, title, summary, tags, series, updatedAt, url }) {
  if (
    !TYPE_DEFINITIONS.some((entry) => entry.id === type && entry.label === typeLabel)
    || typeof id !== 'string'
    || typeof title !== 'string'
    || title.trim() === ''
    || typeof summary !== 'string'
    || summary.trim() === ''
    || !Array.isArray(tags)
    || tags.some((tag) => typeof tag !== 'string' || tag.trim() === '')
    || typeof series !== 'string'
    || !/^\d{4}-\d{2}-\d{2}/u.test(updatedAt ?? '')
    || !/^\/pages\//u.test(url ?? '')
  ) {
    throw new Error(`Invalid public search entry ${id ?? '(missing)'}.`);
  }
  const normalizedTags = [...new Set(tags)];
  return {
    id,
    type,
    typeLabel,
    title,
    summary: summary.replace(SOURCE_SHA_PATTERN, '已脱敏提交'),
    tags: normalizedTags,
    series,
    engines: ENGINE_DEFINITIONS
      .filter((definition) => normalizedTags.some((tag) => definition.tags.has(tag)))
      .map((definition) => definition.id),
    updatedAt: updatedAt.slice(0, 10),
    url
  };
}
