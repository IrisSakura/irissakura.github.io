import assert from 'node:assert/strict';
import test from 'node:test';

import { isEngineeringSyncOwnedPath } from '../scripts/verify-engineering-sync-scope.mjs';

test('Iris Engineering sync owns exactly its provenance, public data and three generated pages', () => {
  for (const owned of [
    'config/iris-engineering-sync.json',
    'data/iris-engineering.json',
    'index.html',
    'pages/engineering.html',
    'pages/portfolio.html'
  ]) assert.equal(isEngineeringSyncOwnedPath(owned), true, `missing owned path ${owned}`);

  for (const forbidden of [
    'package.json',
    'scripts/import-engineering-export.mjs',
    'config/brand.json',
    'assets/brand/iris-wordmark.svg',
    'style/engineering.css',
    'pages/brand.html',
    'pages/../index.html',
    '.github/workflows/site-quality-and-pages.yml'
  ]) assert.equal(isEngineeringSyncOwnedPath(forbidden), false, `sync must not own ${forbidden}`);
});
