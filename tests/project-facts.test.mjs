import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  assertProjectFactsCurrent,
  journalCurationReviewHash
} from '../scripts/lib/project-facts.mjs';

const root = new URL('../', import.meta.url);

test('synchronized source dates may advance without rewriting reviewed project facts', async () => {
  const [projects, framework, journal] = await Promise.all([
    readJson('data/projects.json'),
    readJson('data/framework.json'),
    readJson('data/journal.json')
  ]);
  assert.doesNotThrow(() => assertProjectFactsCurrent(projects, framework, journal));

  const nextFrameworkSnapshot = { ...framework, generatedAt: '2026-08-04T12:34:18+08:00' };
  const nextJournalSnapshot = structuredClone(journal);
  nextJournalSnapshot.sourceSnapshot.generatedAt = '2026-08-05T09:15:00+08:00';
  nextJournalSnapshot.sourceSnapshot.sourceCommit = 'f'.repeat(40);
  assert.doesNotThrow(
    () => assertProjectFactsCurrent(projects, nextFrameworkSnapshot, nextJournalSnapshot)
  );
});

test('project facts still reject updates newer than their review date', async () => {
  const [projects, framework, journal] = await Promise.all([
    readJson('data/projects.json'),
    readJson('data/framework.json'),
    readJson('data/journal.json')
  ]);
  const unreviewed = structuredClone(projects);
  unreviewed.projects.find((project) => project.id === 'sakura-framework').updatedAt = '2099-01-01';
  assert.throws(
    () => assertProjectFactsCurrent(unreviewed, framework, journal),
    /cannot be reviewed before its latest factual update/u
  );
});

test('semantic Framework and Journal contracts require project copy review', async () => {
  const [projects, framework, journal] = await Promise.all([
    readJson('data/projects.json'),
    readJson('data/framework.json'),
    readJson('data/journal.json')
  ]);
  assert.equal(
    projects.projects.find((project) => project.id === 'sakura-framework').reviewedFrameworkAdoptionHash,
    framework.adoptionReviewHash
  );
  assert.equal(
    projects.projects.find((project) => project.id === 'sakura-design-journal').reviewedJournalCurationHash,
    journalCurationReviewHash(journal)
  );

  const changedFramework = { ...framework, adoptionReviewHash: `sha256:${'f'.repeat(64)}` };
  assert.throws(
    () => assertProjectFactsCurrent(projects, changedFramework, journal),
    /Framework adoption contract changed/u
  );

  const changedJournal = structuredClone(journal);
  changedJournal.featuredNotes[0].finding += ' Semantic change.';
  assert.throws(
    () => assertProjectFactsCurrent(projects, framework, changedJournal),
    /Journal curation contract changed/u
  );
});

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}
