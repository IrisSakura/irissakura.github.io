import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('framework.json exposes only the public contract', async () => {
  const data = JSON.parse(await readText('data/framework.json'));
  const allowed = [
    'schemaVersion',
    'sourceCommit',
    'generatedAt',
    'summary',
    'lifecycleCounts',
    'layers',
    'featuredModules'
  ];

  assert.deepEqual(Object.keys(data).sort(), allowed.sort());
  assert.equal(data.schemaVersion, 1);
  assert.match(data.sourceCommit, /^[0-9a-f]{7,40}$/);
  assert.ok(!Number.isNaN(Date.parse(data.generatedAt)));

  for (const key of ['packageCount', 'catalogModuleCount', 'presetCount', 'profileCount', 'asmdefCount']) {
    assert.ok(Number.isInteger(data.summary[key]));
    assert.ok(data.summary[key] >= 0);
  }

  assert.ok(Array.isArray(data.layers));
  assert.ok(data.layers.length > 0);
  for (const layer of data.layers) {
    assert.deepEqual(Object.keys(layer).sort(), ['description', 'id', 'packageCount']);
    assert.equal(typeof layer.id, 'string');
    assert.equal(typeof layer.description, 'string');
    assert.ok(Number.isInteger(layer.packageCount));
  }

  assert.ok(Array.isArray(data.featuredModules));
  for (const module of data.featuredModules) {
    assert.deepEqual(Object.keys(module).sort(), ['description', 'displayName', 'id']);
  }
});

test('framework page contains one target for each dynamic field', async () => {
  const html = await readText('pages/framework.html');
  const ids = [
    'framework-package-count',
    'framework-module-count',
    'framework-profile-count',
    'framework-module-search',
    'framework-module-result-count',
    'framework-module-list',
    'framework-module-detail',
    'framework-module-detail-title',
    'framework-module-capabilities',
    'framework-module-use-cases',
    'framework-module-route',
    'framework-module-layer-link',
    'framework-layer-list',
    'framework-layer-detail',
    'framework-layer-detail-title',
    'framework-layer-detail-count',
    'framework-layer-detail-share',
    'framework-lifecycle-list',
    'framework-lifecycle-detail',
    'framework-lifecycle-detail-title',
    'framework-lifecycle-detail-count',
    'framework-lifecycle-detail-share',
    'framework-source-commit',
    'framework-generated-at',
    'framework-data-status'
  ];

  for (const id of ids) {
    const matches = html.match(new RegExp(`id=["']${id}["']`, 'g')) ?? [];
    assert.equal(matches.length, 1, `${id} should occur exactly once`);
  }
});

test('framework explorer binds synchronized modules to interactive views', async () => {
  const data = JSON.parse(await readText('data/framework.json'));
  const html = await readText('pages/framework.html');
  const source = await readText('src/framework.ts');

  for (const filter of ['all', 'foundation', 'gameplay', 'experience']) {
    assert.ok(
      html.includes(`data-module-filter="${filter}"`),
      `missing ${filter} module filter`
    );
  }

  for (const module of data.featuredModules) {
    assert.match(
      source,
      new RegExp(`\\b${module.id}:\\s*\\{`, 'u'),
      `${module.id} needs website-owned explorer metadata`
    );
  }

  for (const behavior of [
    'renderFeaturedModules',
    'selectModule',
    'renderLayers',
    'selectLayer',
    'renderLifecycle',
    'selectLifecycle',
    'restoreSectionHash',
    'revealDetailOnNarrowLayout',
    'history.replaceState',
    'scrollIntoView'
  ]) {
    assert.ok(source.includes(behavior), `missing explorer behavior ${behavior}`);
  }

  for (const detailId of [
    'framework-module-detail',
    'framework-layer-detail',
    'framework-lifecycle-detail'
  ]) {
    assert.ok(
      source.includes(`revealDetailOnNarrowLayout('${detailId}')`),
      `${detailId} should be revealed after a narrow-layout selection`
    );
  }
});

test('framework page presents maturity before scale and documents sync ownership', async () => {
  const html = await readText('pages/framework.html');
  const maintenance = await readText('docs/maintenance/framework-sync.md');

  for (const fragment of [
    '先看成熟度，再看规模',
    '4 个处于 Supported',
    '101',
    'Preview',
    '23',
    'Experimental',
    '不把同名系统自动宣称'
  ]) {
    assert.ok(html.includes(fragment), `missing maturity disclosure: ${fragment}`);
  }

  assert.ok(maintenance.includes('data/framework.json'));
  assert.ok(maintenance.includes('白名单公开快照'));
  assert.ok(maintenance.includes('gitea-patch/'));
});
