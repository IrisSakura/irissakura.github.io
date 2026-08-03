import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('only manifest-approved Journal blogs are published as complete indexable articles', async () => {
  const [source, publication] = await Promise.all([
    readJson('data/journal-source.json'),
    readJson('config/blog-publication.json')
  ]);
  const publicationById = new Map(publication.articles.map((article) => [article.sourceId, article]));
  const published = source.blogs.filter((article) => ['approved', 'published'].includes(publicationById.get(article.id)?.status));
  const unpublished = source.blogs.filter((article) => !['approved', 'published'].includes(publicationById.get(article.id)?.status));
  const index = await readText('pages/blog.html');
  const sitemap = await readText('sitemap.xml');

  assert.ok(index.includes('<!-- indexable page -->'));
  assert.ok(!index.includes('noindex'));
  assert.ok(index.includes(`${published.length} 篇正式文章`));
  for (const article of published) {
    const contract = publicationById.get(article.id);
    const markdown = await readText(article.contentPath);
    const html = await readText(`pages/blog/${contract.slug}.html`);
    assert.ok(index.includes(`blog/${contract.slug}.html`), `missing blog index link ${contract.slug}`);
    assert.ok(html.includes(`<h1>${article.title}</h1>`), `missing title ${article.id}`);
    assert.ok(html.includes('<div class="blog-prose">'), `missing rendered body ${article.id}`);
    assert.ok(html.length > markdown.length / 2, `blog detail is unexpectedly short for ${article.id}`);
    assert.ok(html.includes('"@type":"Article"'), `missing Article schema ${article.id}`);
    assert.ok(html.includes(`"datePublished":"${contract.publishedAt}"`), `missing published date ${article.id}`);
    assert.ok(html.includes(`"dateModified":"${contract.updatedAt}"`), `missing modified date ${article.id}`);
    assert.ok(sitemap.includes(`/pages/blog/${contract.slug}.html`), `sitemap missing ${contract.slug}`);
    for (const marker of ['状态：草稿', '状态：可发布候选', '待补充', 'TODO']) {
      assert.ok(!html.includes(marker), `${article.id} exposes editorial marker ${marker}`);
    }
  }
  for (const article of unpublished) {
    const contract = publicationById.get(article.id);
    assert.ok(!index.includes(article.title), `unpublished blog appears in the index: ${article.id}`);
    assert.ok(!sitemap.includes(`/pages/blog/${contract.slug}.html`), `unpublished blog appears in sitemap: ${article.id}`);
    const alias = await readText(`pages/blog/${article.id}.html`);
    assert.ok(alias.includes('noindex, follow'), `unpublished legacy route must be noindex: ${article.id}`);
    assert.ok(!alias.includes('class="blog-prose"'), `unpublished legacy route exposes prose: ${article.id}`);
  }
});

test('published blog HTML contains no executable source HTML or private repository details', async () => {
  const [source, publication] = await Promise.all([
    readJson('data/journal-source.json'),
    readJson('config/blog-publication.json')
  ]);
  const published = publication.articles.filter((article) => ['approved', 'published'].includes(article.status));
  const pages = await Promise.all(published.map((article) => readText(`pages/blog/${article.slug}.html`)));
  const publicText = [
    await readText('pages/blog.html'),
    await readText('pages/journal.html'),
    JSON.stringify(source),
    ...pages
  ].join('\n');

  for (const forbidden of [
    '<iframe',
    '<object',
    '<embed',
    '<form',
    'onclick=',
    '/Users/',
    '154.37.215.57',
    'sakura-design-journal.git',
    'WEBSITE_GITHUB_SSH_KEY'
  ]) {
    assert.ok(!publicText.includes(forbidden), `published content exposes ${forbidden}`);
  }
});

async function readJson(path) {
  return JSON.parse(await readText(path));
}
