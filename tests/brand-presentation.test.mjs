import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { currentProductName } from '../scripts/lib/brand-presentation.mjs';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');

test('v2 presentation keeps stable IDs and exposes the reviewed four-project names', async () => {
  const [brand, tools, architecture, presentation] = await Promise.all([read('config/brand.json'), read('pages/tools.html'), read('docs/brand/brand-architecture.md'), read('config/site-presentation.json')]);
  assert.match(brand, /"journal"/);
  assert.match(brand, /"violet"/);
  assert.match(tools, /Violet Shelf/);
  assert.match(tools, /不提供在线使用、公开下载、签名或发布承诺/);
  assert.match(presentation, /SakuraGameFramework/);
  assert.match(presentation, /Myosotis/);
  assert.match(architecture, /IRIS × SAKURA/);
});

test('stable identifiers receive presentation-owned display names without mutating unknown historical labels', async () => {
  const presentation = JSON.parse(await read('config/site-presentation.json'));
  assert.equal(currentProductName('sakura-design-journal', 'IrisSakura Journal', presentation.projects), 'Myosotis');
  assert.equal(currentProductName('iris-shelf', 'Iris Shelf', presentation.projects), 'Violet Shelf');
  assert.equal(currentProductName('historical-source', 'Iris Shelf'), 'Iris Shelf');
});

test('controlled master design retains complete source-body provenance boundaries', async () => {
  const document = await read('docs/brand/master-design-v1.md');
  assert.match(document, /controlled-copy-provenance:start/);
  assert.match(document, /source-body:start/);
  assert.match(document, /source-body:end/);
  assert.match(document, /9e2ba53b981ac4915acd8de4c8b96bb10ef63d4c490182ae490e8836b0c8a4c0/);
});
