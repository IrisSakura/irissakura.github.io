import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildPublicSnapshot,
  diffCatalogs
} from '../scripts/lib/journal-sync-model.mjs';

function catalog(routes, digest = 'a'.repeat(64)) {
  return {
    schemaVersion: 1,
    entryCount: routes.length,
    contentDigest: digest,
    routes
  };
}

function route(id, sha256 = 'b'.repeat(64)) {
  return {
    id,
    title: `Title ${id}`,
    summary: `Summary ${id}`,
    tags: ['design'],
    sha256
  };
}

function curation(note = {}) {
  return {
    schemaVersion: 1,
    title: 'Journal',
    summary: {
      knowledgeStreamCount: 1,
      description: 'Curated research.'
    },
    streams: [{
      id: 'research',
      label: 'Research',
      title: 'Research stream',
      description: 'Verified notes.',
      icon: 'fa-book'
    }],
    featuredNotes: [{
      id: 'alpha',
      source: { kind: 'catalog', id: 'alpha' },
      title: 'Alpha',
      description: 'A safe summary.',
      tags: ['Design'],
      track: 'Game design',
      question: 'What changes?',
      method: 'Compare the facts.',
      finding: 'Keep ownership explicit.',
      impact: 'Shapes the public work.',
      updatedAt: '2026-07-29',
      ...note
    }]
  };
}

test('public snapshot derives catalog counts and strips private source metadata', () => {
  const snapshot = buildPublicSnapshot(curation(), catalog([route('alpha'), route('beta')]));

  assert.equal(snapshot.summary.gameDesignCount, 2);
  assert.equal(snapshot.sourceSnapshot.curatedCatalogCount, 1);
  assert.equal(snapshot.featuredNotes[0].source, undefined);
  assert.ok(!JSON.stringify(snapshot).includes('baselineCommit'));
});

test('catalog diff reports added, changed and removed stable ids', () => {
  const previous = catalog([route('alpha'), route('removed')], 'c'.repeat(64));
  const current = catalog([route('alpha', 'd'.repeat(64)), route('added')], 'e'.repeat(64));

  assert.deepEqual(diffCatalogs(previous, current), {
    added: ['added'],
    changed: ['alpha'],
    removed: ['removed']
  });
});

test('public snapshot rejects local paths and repository URLs', () => {
  assert.throws(
    () => buildPublicSnapshot(curation({ description: '/Users/example/private note' }), catalog([route('alpha')])),
    /forbidden local macOS path/
  );
  assert.throws(
    () => buildPublicSnapshot(curation({ description: 'https://private.example/repository.git' }), catalog([route('alpha')])),
    /forbidden repository or external URL/
  );
});
