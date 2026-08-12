import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { selectPublishedBlogs, stripBlogPublicationPreamble } from '../scripts/lib/blog-publication-model.mjs';

const root = new URL('../', import.meta.url);

test('publication contract selects every imported article for public reading', async () => {
  const [manifest, source] = await Promise.all([
    readJson('config/blog-publication.json'),
    readJson('data/journal-source.json')
  ]);
  const bodies = new Map(await Promise.all(source.blogs.map(async (article) => (
    [article.id, await readFile(new URL(article.contentPath, root))]
  ))));
  const selected = selectPublishedBlogs(manifest, source, bodies);

  assert.deepEqual(new Set(selected.map((article) => article.status)), new Set(['published']));
  assert.equal(manifest.articles.length, source.blogs.length);
  assert.deepEqual(
    new Set(manifest.articles.map((article) => article.sourceId)),
    new Set(source.blogs.map((article) => article.id))
  );
  assert.equal(selected.length, source.blogs.length);
  assert.ok(selected.every((article) => article.publishedAt <= article.updatedAt));
  assert.ok(selected.every((article) => !/^blog-[a-f0-9]{8,}$/u.test(article.slug)));
});

test('unregistered Journal blogs remain in implicit review without entering publication selection', async () => {
  const [manifest, source] = await Promise.all([
    readJson('config/blog-publication.json'),
    readJson('data/journal-source.json')
  ]);
  const bodies = new Map(await Promise.all(source.blogs.map(async (article) => (
    [article.id, await readFile(new URL(article.contentPath, root))]
  ))));
  const omitted = manifest.articles.find((article) => article.status === 'published');
  assert.ok(omitted);
  const sparseManifest = structuredClone(manifest);
  sparseManifest.articles = sparseManifest.articles.filter((article) => article.sourceId !== omitted.sourceId);

  const selected = selectPublishedBlogs(sparseManifest, source, bodies);
  assert.ok(selected.every((article) => article.id !== omitted.sourceId));
});

test('explicit publication entries fail closed on source deletion, metadata drift and body drift', async () => {
  const [manifest, source] = await Promise.all([
    readJson('config/blog-publication.json'),
    readJson('data/journal-source.json')
  ]);
  const bodies = new Map(await Promise.all(source.blogs.map(async (article) => (
    [article.id, await readFile(new URL(article.contentPath, root))]
  ))));
  const published = manifest.articles.find((article) => article.status === 'published');
  assert.ok(published);

  const missingSource = structuredClone(source);
  missingSource.blogs = missingSource.blogs.filter((article) => article.id !== published.sourceId);
  assert.throws(
    () => selectPublishedBlogs(manifest, missingSource, bodies),
    new RegExp(`Publication source no longer exists: ${published.sourceId}`)
  );

  const driftedSource = structuredClone(source);
  const driftedArticle = driftedSource.blogs.find((article) => article.id === published.sourceId);
  assert.ok(driftedArticle);
  driftedArticle.title = `${driftedArticle.title} drift`;
  assert.throws(
    () => selectPublishedBlogs(manifest, driftedSource, bodies),
    new RegExp(`Blog ${published.sourceId} publication title does not match Journal metadata`)
  );

  const driftedBodies = new Map(bodies);
  driftedBodies.set(published.sourceId, Buffer.concat([
    driftedBodies.get(published.sourceId),
    Buffer.from('\nbody drift\n')
  ]));
  assert.throws(
    () => selectPublishedBlogs(manifest, source, driftedBodies),
    new RegExp(`Blog ${published.sourceId} publication content hash does not match its body`)
  );
});

test('publication validation ignores stripped editorial preambles but rejects draft markers in prose', async () => {
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
  const draft = invalid.articles.find((article) => article.status === 'published');
  assert.ok(draft);
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
