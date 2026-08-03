import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { assertProjectFactsCurrent } from '../scripts/lib/project-facts.mjs';

const root = new URL('../', import.meta.url);

test('project registry dates and review state match synchronized source facts', async () => {
  const [projects, framework, journalSource] = await Promise.all([
    readJson('data/projects.json'),
    readJson('data/framework.json'),
    readJson('data/journal-source.json')
  ]);
  assert.doesNotThrow(() => assertProjectFactsCurrent(projects, framework, journalSource));

  const stale = structuredClone(projects);
  stale.projects.find((project) => project.id === 'sakura-framework').updatedAt = '2026-07-28';
  assert.throws(
    () => assertProjectFactsCurrent(stale, framework, journalSource),
    /Framework project updatedAt must match/u
  );
});

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}
