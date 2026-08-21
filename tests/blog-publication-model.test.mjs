import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  reconcileBlogPublication,
  selectPublishedBlogs,
  stripBlogPublicationPreamble
} from '../scripts/lib/blog-publication-model.mjs';

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

test('publication reconciliation updates Journal facts and appends semantic public articles', () => {
  const existingBody = Buffer.from('# Existing\n\nUpdated complete publication body.\n');
  const addedBody = Buffer.from('# Added\n\nNew complete publication body.\n');
  const manifest = {
    schemaVersion: 1,
    articles: [{
      sourceId: 'existing-article',
      status: 'published',
      slug: 'curated-existing-slug',
      publishedAt: '2026-08-01',
      updatedAt: '2026-08-01',
      title: 'Old title',
      description: 'Old publication description long enough for validation.',
      series: 'Old series',
      tags: ['old'],
      contentHash: '0'.repeat(64)
    }]
  };
  const source = {
    blogs: [
      sourceArticle('existing-article', existingBody, { updatedAt: '2026-08-20' }),
      sourceArticle('added-semantic-article', addedBody, { updatedAt: '2026-08-21' })
    ]
  };

  const reconciled = reconcileBlogPublication(manifest, source);
  assert.equal(reconciled.articles.length, 2);
  assert.deepEqual(
    pick(reconciled.articles[0], ['status', 'slug', 'publishedAt']),
    { status: 'published', slug: 'curated-existing-slug', publishedAt: '2026-08-01' }
  );
  assert.deepEqual(
    pick(reconciled.articles[0], ['updatedAt', 'title', 'description', 'series', 'tags', 'contentHash']),
    {
      updatedAt: '2026-08-20',
      title: 'Existing article title',
      description: 'Existing article summary is intentionally long enough for public validation.',
      series: 'Test series',
      tags: ['testing'],
      contentHash: createHash('sha256').update(existingBody).digest('hex')
    }
  );
  assert.deepEqual(
    pick(reconciled.articles[1], ['sourceId', 'status', 'slug', 'publishedAt', 'updatedAt']),
    {
      sourceId: 'added-semantic-article',
      status: 'published',
      slug: 'added-semantic-article',
      publishedAt: '2026-08-21',
      updatedAt: '2026-08-21'
    }
  );
  assert.equal(selectPublishedBlogs(
    reconciled,
    source,
    new Map([
      ['existing-article', existingBody],
      ['added-semantic-article', addedBody]
    ])
  ).length, 2);
});

test('publication reconciliation keeps deletion and non-semantic URL decisions fail closed', () => {
  const staleManifest = {
    schemaVersion: 1,
    articles: [{
      sourceId: 'removed-article',
      status: 'published',
      slug: 'removed-article',
      publishedAt: '2026-08-01',
      updatedAt: '2026-08-01',
      title: 'Removed article',
      description: 'Removed publication description long enough for validation.',
      series: 'Test series',
      tags: ['testing'],
      contentHash: '0'.repeat(64)
    }]
  };
  const withoutBlogs = { blogs: [] };
  const reconciled = reconcileBlogPublication(staleManifest, withoutBlogs);
  assert.deepEqual(reconciled, staleManifest);
  assert.throws(
    () => selectPublishedBlogs(reconciled, withoutBlogs, new Map()),
    /Publication source no longer exists: removed-article/u
  );

  const body = Buffer.from('# Hash fallback\n\nComplete body.\n');
  assert.throws(
    () => reconcileBlogPublication(
      { schemaVersion: 1, articles: [] },
      { blogs: [sourceArticle('blog-deadbeef', body)] }
    ),
    /requires an explicit semantic publication slug/u
  );
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

function sourceArticle(id, body, { updatedAt = '2026-08-20' } = {}) {
  return {
    id,
    title: id === 'existing-article' ? 'Existing article title' : 'Added article title',
    summary: id === 'existing-article'
      ? 'Existing article summary is intentionally long enough for public validation.'
      : 'Added article summary is intentionally long enough for public validation.',
    series: 'Test series',
    tags: ['testing'],
    updatedAt,
    sha256: createHash('sha256').update(body).digest('hex')
  };
}

function pick(value, keys) {
  return Object.fromEntries(keys.map((key) => [key, value[key]]));
}
