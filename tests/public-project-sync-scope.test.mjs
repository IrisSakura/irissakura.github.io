import assert from 'node:assert/strict';
import test from 'node:test';

import { isPublicProjectSyncOwnedPath } from '../scripts/verify-public-project-sync-scope.mjs';

test('public project sync owns one provenance file, the registry and generated Portfolio only', () => {
  for (const projectId of ['iris-shelf', 'udgap']) {
    for (const owned of [
      `config/project-sync/${projectId}.json`,
      'data/projects.json',
      'pages/portfolio.html'
    ]) assert.equal(isPublicProjectSyncOwnedPath(projectId, owned), true, `missing ${projectId} owner path ${owned}`);
  }

  for (const forbidden of [
    'package.json',
    'README.md',
    'index.html',
    'pages/game.html',
    'config/iris-engineering-sync.json',
    '.github/workflows/site-quality-and-pages.yml',
    'pages/../portfolio.html'
  ]) assert.equal(isPublicProjectSyncOwnedPath('iris-shelf', forbidden), false, `sync must not own ${forbidden}`);
  assert.equal(isPublicProjectSyncOwnedPath('sword-of-words', 'data/projects.json'), false);
});
