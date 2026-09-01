import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildContentSearchIndex, resolveFeaturedReading } from '../scripts/lib/content-search-model.mjs';
import { resolveBlogDiscovery } from '../scripts/lib/blog-discovery-model.mjs';
import { selectPublishedBlogs } from '../scripts/lib/blog-publication-model.mjs';

const root = new URL('../', import.meta.url);
const readText = async (file) => readFile(new URL(file, root), 'utf8');
const readJson = async (file) => JSON.parse(await readText(file));

async function loadPublishedBlogs(source, publication) {
  const bodies = new Map(await Promise.all(source.blogs.map(async (article) => (
    [article.id, await readText(article.contentPath)]
  ))));
  return selectPublishedBlogs(publication, source, bodies);
}

test('static search index covers only approved public content with useful facets', async () => {
  const [source, publication, taxonomy] = await Promise.all([
    readJson('data/journal-source.json'),
    readJson('config/blog-publication.json'),
    readJson('data/blog-taxonomy.json')
  ]);
  const publishedBlogs = await loadPublishedBlogs(source, publication);
  const discovery = resolveBlogDiscovery(taxonomy, publishedBlogs);
  const expected = buildContentSearchIndex(source, publishedBlogs, discovery);
  const generated = await readJson('data/search-index.json');

  assert.deepEqual(generated, expected);
  assert.equal(generated.totalCount, source.audits.length + source.gameDesigns.length + publishedBlogs.length);
  assert.deepEqual(generated.facets.types.map((entry) => entry.id), ['article', 'game-design', 'framework-audit']);
  assert.equal(generated.facets.series.length, discovery.series.length);
  assert.deepEqual(generated.facets.engines.map((entry) => entry.id), ['cocos-engine', 'godot', 'unity', 'unreal-engine']);
  assert.deepEqual(
    generated.entries.find((entry) => entry.id === 'article:cocos-jsb-dual-runtime-identity-lifecycle')?.engines,
    ['cocos-engine']
  );

  const serialized = JSON.stringify(generated);
  for (const forbidden of ['sourceCommit', 'contentPath', 'sha256', '/Users/', 'sakura-design-journal.git']) {
    assert.ok(!serialized.includes(forbidden), `search index exposes ${forbidden}`);
  }
  assert.ok(generated.entries.every((entry) => !/\b[a-f0-9]{7,40}(?:\.{3}|…)?(?=\W|$)/iu.test(entry.summary)), 'search summaries expose source commit identities');
  assert.ok(generated.entries.every((entry) => entry.url.startsWith('/pages/')));
});

test('Featured Reading selects one newest formal article per existing Series', async () => {
  const [source, publication, taxonomy, blog] = await Promise.all([
    readJson('data/journal-source.json'),
    readJson('config/blog-publication.json'),
    readJson('data/blog-taxonomy.json'),
    readText('pages/blog.html')
  ]);
  const publishedBlogs = await loadPublishedBlogs(source, publication);
  const discovery = resolveBlogDiscovery(taxonomy, publishedBlogs);
  const featured = resolveFeaturedReading(discovery);

  assert.equal(featured.length, discovery.series.length);
  for (const entry of featured) {
    assert.equal(entry.article.slug, discovery.seriesByName.get(entry.series.name).articles[0].slug);
    assert.ok(blog.includes(`blog/${entry.article.slug}.html`));
  }
  assert.match(blog, /id="featured-reading"[\s\S]*FEATURED READING/u);
});

test('Journal exposes an accessible progressively enhanced content search shell', async () => {
  const journal = await readText('pages/journal.html');
  assert.match(journal, /id="content-search"[^>]*data-content-search[^>]*data-search-index="\.\.\/data\/search-index\.json"/u);
  assert.match(journal, /<label[^>]*for="content-search-query"/u);
  assert.match(journal, /id="content-search-status"[^>]*aria-live="polite"/u);
  assert.match(journal, /id="content-search-results"[^>]*aria-label="检索结果"/u);
});
