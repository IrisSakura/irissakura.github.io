import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import { createSocialImage } from '../scripts/lib/social-image.mjs';

const root = new URL('../', import.meta.url);
const readText = async (file) => readFile(new URL(file, root), 'utf8');

test('deterministic social images are valid 1200x630 PNG assets', () => {
  const first = createSocialImage('article-one', 'article');
  const repeated = createSocialImage('article-one', 'article');
  const different = createSocialImage('article-two', 'article');
  assert.deepEqual(first, repeated);
  assert.notDeepEqual(first, different);
  assert.deepEqual([...first.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(first.readUInt32BE(16), 1200);
  assert.equal(first.readUInt32BE(20), 630);
});

test('the same content receives distinct deterministic geometry by Brand Mode', () => {
  const palette = ['101722', '1d3557', '2575fc', '6a11cb', 'ff4081', '8ce7dc'];
  const iris = createSocialImage('/same-page', 'site', palette, 'iris');
  const sakura = createSocialImage('/same-page', 'site', palette, 'sakura');
  const journal = createSocialImage('/same-page', 'site', palette, 'journal');
  assert.notDeepEqual(iris, sakura);
  assert.notDeepEqual(sakura, journal);
  assert.deepEqual(iris, createSocialImage('/same-page', 'site', palette, 'iris'));
});

test('formal articles and major sections expose distinct social images while implicit review exposes none', async () => {
  const [source, publication] = await Promise.all([
    JSON.parse(await readText('data/journal-source.json')),
    JSON.parse(await readText('config/blog-publication.json'))
  ]);
  const publicArticles = publication.articles.filter((entry) => ['approved', 'published'].includes(entry.status));
  const pages = [
    'index.html',
    'pages/framework.html',
    'pages/journal.html',
    'pages/blog.html',
    'pages/game.html',
    'pages/contact.html',
    ...publicArticles.map((entry) => `pages/blog/${entry.slug}.html`)
  ];
  const images = [];
  for (const page of pages) {
    const html = await readText(page);
    const image = html.match(/<meta property="og:image" content="https:\/\/irissakura\.github\.io(\/assets\/social\/[a-z0-9-]+\.png)">/)?.[1];
    assert.ok(image, `${page} must use a generated social image`);
    assert.ok(html.includes('meta property="og:image:alt"'), `${page} missing social image alt text`);
    await access(new URL(`.${image}`, root));
    images.push(image);
  }
  assert.equal(new Set(images).size, images.length, 'major sections and formal articles must not share social images');
  const publicationIds = new Set(publication.articles.map((entry) => entry.sourceId));
  const implicitReview = source.blogs.filter((entry) => !publicationIds.has(entry.id));
  for (const article of implicitReview) {
    await assert.rejects(
      access(new URL(`../assets/social/pages-blog-${article.id}.png`, import.meta.url)),
      (error) => error?.code === 'ENOENT',
      `implicit-review blog must not expose a social image: ${article.id}`
    );
  }
});
