import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { assertProjectFactsCurrent } from '../scripts/lib/project-facts.mjs';

const root = new URL('../', import.meta.url);

test('synchronized source dates may advance without rewriting reviewed project facts', async () => {
  const [projects, framework, journalSource] = await Promise.all([
    readJson('data/projects.json'),
    readJson('data/framework.json'),
    readJson('data/journal-source.json')
  ]);
  assert.doesNotThrow(() => assertProjectFactsCurrent(projects, framework, journalSource));

  const nextFrameworkSnapshot = { ...framework, generatedAt: '2026-08-04T12:34:18+08:00' };
  const nextJournalSnapshot = { ...journalSource, generatedAt: '2026-08-05T09:15:00+08:00' };
  assert.doesNotThrow(
    () => assertProjectFactsCurrent(projects, nextFrameworkSnapshot, nextJournalSnapshot)
  );
});

test('project facts still reject updates newer than their review date', async () => {
  const [projects, framework, journalSource] = await Promise.all([
    readJson('data/projects.json'),
    readJson('data/framework.json'),
    readJson('data/journal-source.json')
  ]);
  const unreviewed = structuredClone(projects);
  unreviewed.projects.find((project) => project.id === 'sakura-framework').updatedAt = '2026-08-04';
  assert.throws(
    () => assertProjectFactsCurrent(unreviewed, framework, journalSource),
    /cannot be reviewed before its latest factual update/u
  );
});

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}
