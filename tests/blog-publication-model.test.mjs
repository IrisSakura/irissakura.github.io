import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { selectPublishedBlogs, stripBlogPublicationPreamble } from '../scripts/lib/blog-publication-model.mjs';

const root = new URL('../', import.meta.url);

test('publication manifest is complete and only approved or published entries are selected', async () => {
  const [manifest, source] = await Promise.all([
    readJson('config/blog-publication.json'),
    readJson('data/journal-source.json')
  ]);
  const bodies = new Map(await Promise.all(source.blogs.map(async (article) => (
    [article.id, await readFile(new URL(article.contentPath, root))]
  ))));
  const selected = selectPublishedBlogs(manifest, source, bodies);

  assert.deepEqual(new Set(selected.map((article) => article.status)), new Set(['published']));
  assert.equal(selected.length, 6);
  assert.ok(selected.every((article) => article.publishedAt <= article.updatedAt));
  assert.ok(selected.every((article) => !/^blog-[a-f0-9]{8,}$/u.test(article.slug)));
});

test('publication validation fails closed when a draft marker is marked as published', async () => {
  const [manifest, source] = await Promise.all([
    readJson('config/blog-publication.json'),
    readJson('data/journal-source.json')
  ]);
  const bodies = new Map(await Promise.all(source.blogs.map(async (article) => (
    [article.id, await readFile(new URL(article.contentPath, root))]
  ))));
  const invalid = structuredClone(manifest);
  const invalidSource = structuredClone(source);
  const invalidBodies = new Map(bodies);
  const draft = invalid.articles.find((article) => article.status === 'draft');
  assert.ok(draft);
  draft.status = 'published';
  draft.publishedAt = draft.updatedAt;
  const body = Buffer.concat([
    invalidBodies.get(draft.sourceId),
    Buffer.from('\n> 状态：草稿\n')
  ]);
  const contentHash = createHash('sha256').update(body).digest('hex');
  draft.contentHash = contentHash;
  const sourceArticle = invalidSource.blogs.find((article) => article.id === draft.sourceId);
  assert.ok(sourceArticle);
  sourceArticle.sha256 = contentHash;
  invalidBodies.set(draft.sourceId, body);

  assert.throws(
    () => selectPublishedBlogs(invalid, invalidSource, invalidBodies),
    /contains a draft marker/u
  );
});

test('publication preamble is removed from rendered article prose', () => {
  const markdown = '# Title\n\n> 系列：测试\n>\n> 状态：可发布候选\n\n正文。\n';
  assert.equal(stripBlogPublicationPreamble(markdown), '正文。\n');
});

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}
