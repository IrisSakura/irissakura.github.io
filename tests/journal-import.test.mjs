import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildJournalSnapshot,
  validateJournalSource
} from '../scripts/lib/journal-import-model.mjs';

const body = Buffer.from('# Article\n\nComplete body.');
const source = {
  schemaVersion: 1,
  sourceCommit: 'a'.repeat(40),
  generatedAt: '2026-07-29T20:00:00+08:00',
  summary: { auditCount: 1, blogCount: 1, gameDesignCount: 1 },
  gameDesignCatalogDigest: 'b'.repeat(64),
  audits: [{ id: 'audit-2026-07-29', title: 'Audit', summary: 'Safe.', updatedAt: '2026-07-29', redacted: false }],
  gameDesigns: [{ id: 'design', title: 'Design', summary: 'Safe.', tags: ['design'], updatedAt: '2026-07-29', sha256: 'c'.repeat(64) }],
  blogs: [{
    id: 'article',
    title: 'Article',
    summary: 'Safe.',
    series: 'Series',
    tags: ['design'],
    updatedAt: '2026-07-29',
    sha256: '4009791562ab525c18bc8baeb3441b586150b68f1740823e542063321b2ccea0',
    bytes: 25,
    contentPath: 'content/blogs/article.md'
  }]
};
const curation = {
  schemaVersion: 1,
  title: 'Journal',
  summary: { description: 'Public research.' },
  streams: [{ id: 'design', title: 'Design' }],
  featuredNotes: [{ id: 'design', source: { kind: 'catalog', id: 'design' }, title: 'Design' }]
};

test('valid fixed-sha export builds the curated site snapshot', () => {
  validateJournalSource(source, new Map([['article', body]]));
  const snapshot = buildJournalSnapshot(curation, source);

  assert.deepEqual(snapshot.summary, {
    gameDesignCount: 1,
    auditCount: 1,
    importedBlogCount: 1,
    knowledgeStreamCount: 1,
    description: 'Public research.'
  });
  assert.equal(snapshot.featuredNotes[0].source, undefined);
  assert.equal(snapshot.sourceSnapshot.sourceCommit, source.sourceCommit);
});

test('tampered bodies and private content fail closed', () => {
  assert.throws(
    () => validateJournalSource(source, new Map([['article', Buffer.from('tampered')]])),
    /digest mismatch/
  );
  const unsafe = structuredClone(source);
  unsafe.audits[0].summary = '/Users/example/private';
  assert.throws(
    () => validateJournalSource(unsafe, new Map([['article', body]])),
    /private or credential-bearing/
  );
});
