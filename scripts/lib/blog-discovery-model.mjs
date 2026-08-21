const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function reconcileBlogTaxonomy(taxonomy, articles) {
  if (taxonomy?.schemaVersion !== 1 || !Array.isArray(taxonomy.series) || !Array.isArray(taxonomy.tags)) {
    throw new Error('Blog taxonomy must use schemaVersion 1 and expose series and tags arrays.');
  }
  if (!Array.isArray(articles) || articles.length === 0) throw new Error('Blog taxonomy reconciliation requires formal articles.');

  const seriesByName = buildRegistry(taxonomy.series, 'series');
  const tagsByName = buildRegistry(taxonomy.tags, 'tag');
  const usedSeries = new Set(articles.map((article) => article.series));
  const usedTags = new Set(articles.flatMap((article) => article.tags));

  for (const name of usedSeries) {
    if (!seriesByName.has(name)) {
      throw new Error(`New Journal series ${name} requires an explicit semantic taxonomy entry.`);
    }
  }

  const series = taxonomy.series.filter((entry) => usedSeries.has(entry.name));
  const tags = taxonomy.tags.filter((entry) => usedTags.has(entry.name));
  for (const name of usedTags) {
    if (tagsByName.has(name)) continue;
    if (!SLUG_PATTERN.test(name ?? '')) {
      throw new Error(`New Journal tag ${name ?? '(missing)'} requires a semantic taxonomy slug.`);
    }
    tags.push({
      name,
      slug: name,
      description: `${name} 主题的公开研究文章。`
    });
  }

  const reconciled = { ...taxonomy, series, tags };
  resolveBlogDiscovery(reconciled, articles);
  return reconciled;
}

export function stringifyBlogTaxonomy(taxonomy) {
  if (taxonomy?.schemaVersion !== 1 || !Array.isArray(taxonomy.series) || !Array.isArray(taxonomy.tags)) {
    throw new Error('Blog taxonomy must use schemaVersion 1 and expose series and tags arrays.');
  }
  const series = JSON.stringify(taxonomy.series, null, 2)
    .split('\n')
    .map((line, index) => index === 0 ? line : `  ${line}`)
    .join('\n');
  const tags = taxonomy.tags.map((entry) => (
    `    { "name": ${JSON.stringify(entry.name)}, "slug": ${JSON.stringify(entry.slug)}, `
    + `"description": ${JSON.stringify(entry.description)} }`
  )).join(',\n');
  return `{\n  "schemaVersion": 1,\n  "series": ${series},\n  "tags": [\n${tags}\n  ]\n}\n`;
}

export function resolveBlogDiscovery(taxonomy, articles) {
  if (taxonomy?.schemaVersion !== 1 || !Array.isArray(taxonomy.series) || !Array.isArray(taxonomy.tags)) {
    throw new Error('Blog taxonomy must use schemaVersion 1 and expose series and tags arrays.');
  }
  if (!Array.isArray(articles) || articles.length === 0) throw new Error('Blog discovery requires formal articles.');

  const seriesByName = buildRegistry(taxonomy.series, 'series');
  const tagsByName = buildRegistry(taxonomy.tags, 'tag');
  const usedSeries = new Set();
  const usedTags = new Set();
  const articlesBySlug = new Map();

  for (const article of articles) {
    if (!SLUG_PATTERN.test(article.slug ?? '') || articlesBySlug.has(article.slug)) {
      throw new Error(`Formal article slug must be unique and semantic: ${article.slug ?? '(missing)'}.`);
    }
    articlesBySlug.set(article.slug, article);
    if (!seriesByName.has(article.series)) throw new Error(`Formal article ${article.id} uses unregistered series ${article.series}.`);
    usedSeries.add(article.series);
    for (const tag of article.tags) {
      if (!tagsByName.has(tag)) throw new Error(`Formal article ${article.id} uses unregistered tag ${tag}.`);
      usedTags.add(tag);
    }
  }
  assertNoUnusedEntries(seriesByName, usedSeries, 'series');
  assertNoUnusedEntries(tagsByName, usedTags, 'tag');

  const byNewest = (left, right) => (
    right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug)
  );
  const series = taxonomy.series.map((entry) => ({
    ...entry,
    articles: articles.filter((article) => article.series === entry.name).sort(byNewest)
  }));
  const tags = taxonomy.tags.map((entry) => ({
    ...entry,
    articles: articles.filter((article) => article.tags.includes(entry.name)).sort(byNewest)
  }));
  const routableTags = tags.filter((entry) => entry.articles.length >= 2);
  const relatedBySlug = new Map(articles.map((article) => {
    const related = articles
      .filter((candidate) => candidate.slug !== article.slug)
      .map((candidate) => {
        const sharedTags = candidate.tags.filter((tag) => article.tags.includes(tag));
        return {
          article: candidate,
          score: (candidate.series === article.series ? 100 : 0) + sharedTags.length * 10,
          relation: candidate.series === article.series
            ? `同属「${article.series}」${sharedTags.length > 0 ? `，共享 ${sharedTags.join('、')}` : ''}`
            : sharedTags.length > 0
              ? `共享 ${sharedTags.join('、')}`
              : '近期正式文章'
        };
      })
      .sort((left, right) => right.score - left.score || byNewest(left.article, right.article))
      .slice(0, 3);
    return [article.slug, related];
  }));

  return {
    series,
    tags,
    routableTags,
    seriesByName: new Map(series.map((entry) => [entry.name, entry])),
    tagsByName: new Map(tags.map((entry) => [entry.name, entry])),
    relatedBySlug
  };
}

function buildRegistry(entries, type) {
  const byName = new Map();
  const slugs = new Set();
  for (const entry of entries) {
    if (typeof entry.name !== 'string' || entry.name.trim() === '' || byName.has(entry.name)) {
      throw new Error(`Blog ${type} names must be unique and non-empty.`);
    }
    if (!SLUG_PATTERN.test(entry.slug ?? '') || slugs.has(entry.slug)) {
      throw new Error(`Blog ${type} slug must be unique and semantic: ${entry.slug ?? '(missing)'}.`);
    }
    if (typeof entry.description !== 'string' || entry.description.trim().length < 8) {
      throw new Error(`Blog ${type} ${entry.name} requires a useful description.`);
    }
    byName.set(entry.name, entry);
    slugs.add(entry.slug);
  }
  return byName;
}

function assertNoUnusedEntries(registry, used, type) {
  for (const name of registry.keys()) {
    if (!used.has(name)) throw new Error(`Blog taxonomy exposes unused ${type} ${name}.`);
  }
}
