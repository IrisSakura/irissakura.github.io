import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { resolveBlogDiscovery } from '../scripts/lib/blog-discovery-model.mjs';
import { selectPublishedBlogs } from '../scripts/lib/blog-publication-model.mjs';

const root = new URL('../', import.meta.url);
const readText = async (file) => readFile(new URL(file, root), 'utf8');
const readJson = async (file) => JSON.parse(await readText(file));

async function loadPublishedBlogs() {
  const [source, publication] = await Promise.all([
    readJson('data/journal-source.json'),
    readJson('config/blog-publication.json')
  ]);
  const bodies = new Map(await Promise.all(source.blogs.map(async (article) => (
    [article.id, await readText(article.contentPath)]
  ))));
  return selectPublishedBlogs(publication, source, bodies);
}

test('blog taxonomy is explicit, semantic and covers exactly the formal articles', async () => {
  const [taxonomy, articles] = await Promise.all([
    readJson('data/blog-taxonomy.json'),
    loadPublishedBlogs()
  ]);
  const discovery = resolveBlogDiscovery(taxonomy, articles);
  assert.equal(discovery.series.length, 5);
  assert.equal(discovery.tags.length, 49);
  assert.ok(discovery.routableTags.length < discovery.tags.length);
  assert.ok(discovery.routableTags.every((entry) => entry.articles.length >= 2));
  assert.ok(discovery.tags.filter((entry) => entry.articles.length >= 2).every((entry) => discovery.routableTags.includes(entry)));
  assert.ok(discovery.series.every((entry) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)));
  assert.ok(discovery.tags.every((entry) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)));
  assert.ok(articles.every((article) => discovery.relatedBySlug.get(article.slug).length > 0));

  const missingTag = structuredClone(taxonomy);
  missingTag.tags = missingTag.tags.filter((entry) => entry.name !== 'stealth');
  assert.throws(() => resolveBlogDiscovery(missingTag, articles), /unregistered tag stealth/);
});

test('series and multi-article tags form indexable discovery routes', async () => {
  const [taxonomy, articles, index, sitemap] = await Promise.all([
    readJson('data/blog-taxonomy.json'),
    loadPublishedBlogs(),
    readText('pages/blog.html'),
    readText('sitemap.xml')
  ]);
  const discovery = resolveBlogDiscovery(taxonomy, articles);
  assert.ok(index.includes('class="blog-taxonomy"'));
  assert.ok(index.includes('href="../rss.xml"'));

  for (const collection of [...discovery.series, ...discovery.routableTags]) {
    const kind = discovery.series.includes(collection) ? 'series' : 'tag';
    const route = `pages/blog/${kind}/${collection.slug}.html`;
    const html = await readText(route);
    assert.ok(html.includes('"@type":"CollectionPage"'), `${route} missing CollectionPage schema`);
    assert.ok(html.includes(`>${collection.name}<`), `${route} missing taxonomy name`);
    assert.ok(sitemap.includes(`/${route}`), `sitemap missing ${route}`);
  }

  for (const collection of discovery.tags.filter((entry) => entry.articles.length === 1)) {
    const route = `pages/blog/tag/${collection.slug}.html`;
    await assert.rejects(readText(route), /ENOENT/u);
    assert.ok(!sitemap.includes(`/${route}`), `single-article tag leaked into sitemap: ${route}`);
    assert.ok(!index.includes(`blog/tag/${collection.slug}.html`), `single-article tag leaked into index: ${route}`);
  }

  for (const article of articles) {
    const html = await readText(`pages/blog/${article.slug}.html`);
    assert.ok(html.includes('class="related-articles"'), `${article.slug} missing related articles`);
    assert.ok(html.includes(`series/${discovery.seriesByName.get(article.series).slug}.html`));
    for (const tag of article.tags) {
      const collection = discovery.tagsByName.get(tag);
      if (collection.articles.length >= 2) {
        assert.ok(html.includes(`tag/${collection.slug}.html`));
      } else {
        assert.ok(html.includes(`<span>${tag}</span>`));
        assert.ok(!html.includes(`tag/${collection.slug}.html`));
      }
    }
  }
});

test('RSS contains only formal semantic article routes with contract dates', async () => {
  const [source, publication, rss] = await Promise.all([
    readJson('data/journal-source.json'),
    readJson('config/blog-publication.json'),
    readText('rss.xml')
  ]);
  assert.ok(rss.includes('<rss version="2.0"'));
  assert.ok(rss.includes('rel="self" type="application/rss+xml"'));
  const publicationById = new Map(publication.articles.map((article) => [article.sourceId, article]));
  for (const article of source.blogs) {
    const contract = publicationById.get(article.id);
    const isPublic = ['approved', 'published'].includes(contract?.status);
    assert.equal(rss.includes(`<title>${article.title}</title>`), isPublic, `RSS publication mismatch for ${article.id}`);
    if (contract) {
      assert.equal(rss.includes(`/pages/blog/${contract.slug}.html`), isPublic, `RSS route mismatch for ${article.id}`);
    } else {
      assert.ok(!rss.includes(article.id), `unregistered blog appears in RSS: ${article.id}`);
    }
    if (isPublic) assert.ok(rss.includes(new Date(`${contract.publishedAt}T00:00:00Z`).toUTCString()));
  }
});
