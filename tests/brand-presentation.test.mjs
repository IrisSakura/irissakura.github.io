import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { currentProductName } from '../scripts/lib/brand-presentation.mjs';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');

test('v1 presentation keeps stable journal identity and adds a display-only Violet route', async () => {
  const [brand, tools, architecture] = await Promise.all([read('config/brand.json'), read('pages/tools.html'), read('docs/brand/brand-architecture.md')]);
  assert.match(brand, /"journal"/);
  assert.match(brand, /"violet"/);
  assert.match(tools, /Violet Shelf/);
  assert.match(tools, /不提供公开发布或下载/);
  assert.match(architecture, /IRIS × SAKURA/);
});

test('stable identifiers receive display-only aliases without mutating unknown historical labels', () => {
  assert.equal(currentProductName('sakura-design-journal', 'IrisSakura Journal'), 'Myosotis');
  assert.equal(currentProductName('iris-shelf', 'Iris Shelf'), 'Violet Shelf');
  assert.equal(currentProductName('historical-source', 'Iris Shelf'), 'Iris Shelf');
});

test('controlled master design retains complete source-body provenance boundaries', async () => {
  const document = await read('docs/brand/master-design-v1.md');
  assert.match(document, /controlled-copy-provenance:start/);
  assert.match(document, /source-body:start/);
  assert.match(document, /source-body:end/);
  assert.match(document, /9e2ba53b981ac4915acd8de4c8b96bb10ef63d4c490182ae490e8836b0c8a4c0/);
});
