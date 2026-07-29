import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('every registered Journal blog is published as a complete indexable article', async () => {
  const source = JSON.parse(await readText('data/journal-source.json'));
  const index = await readText('pages/blog.html');

  assert.ok(index.includes('<!-- indexable page -->'));
  assert.ok(!index.includes('noindex'));
  for (const article of source.blogs) {
    const markdown = await readText(article.contentPath);
    const html = await readText(`pages/blog/${article.id}.html`);
    assert.ok(index.includes(`blog/${article.id}.html`), `missing blog index link ${article.id}`);
    assert.ok(html.includes(`<h1>${article.title}</h1>`), `missing title ${article.id}`);
    assert.ok(html.includes('<div class="blog-prose">'), `missing rendered body ${article.id}`);
    assert.ok(html.length > markdown.length, `blog detail is unexpectedly shorter than source ${article.id}`);
    assert.ok(html.includes('"@type":"Article"'), `missing Article schema ${article.id}`);
  }
});

test('published blog HTML contains no executable source HTML or private repository details', async () => {
  const source = JSON.parse(await readText('data/journal-source.json'));
  const pages = await Promise.all(source.blogs.map((article) => readText(`pages/blog/${article.id}.html`)));
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
