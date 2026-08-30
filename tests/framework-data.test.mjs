import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { assertFrameworkAdoptionReviewed } from '../scripts/lib/framework-adoption-review.mjs';
import { updateFrameworkFallback } from '../scripts/lib/framework-fallback.mjs';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('framework.json exposes only the public contract', async () => {
  const data = JSON.parse(await readText('data/framework.json'));
  const allowed = [
    'adoptionReviewContract',
    'adoptionReviewHash',
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
  assert.equal(data.sourceCommit, 'c47ec76e23ad6e57408acb27390ff78239a66dbf');
  assert.match(data.sourceCommit, /^[0-9a-f]{7,40}$/);
  assert.equal(data.adoptionReviewContract, 'supported-stable-v1');
  assert.match(data.adoptionReviewHash, /^sha256:[0-9a-f]{64}$/);
  assert.ok(!Number.isNaN(Date.parse(data.generatedAt)));

  for (const key of ['packageCount', 'catalogModuleCount', 'presetCount', 'profileCount', 'asmdefCount']) {
    assert.ok(Number.isInteger(data.summary[key]));
    assert.ok(data.summary[key] >= 0);
  }
  assert.equal(data.summary.asmdefCount, 869);

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

test('framework adoption snapshot names the supported packages and pins reviewed facts', async () => {
  const framework = JSON.parse(await readText('data/framework.json'));
  const adoption = JSON.parse(await readText('data/framework-adoption.json'));

  assert.equal(adoption.schemaVersion, 1);
  assert.match(adoption.sourceCommit, /^[0-9a-f]{7,40}$/);
  assert.equal(adoption.adoptionReviewContract, framework.adoptionReviewContract);
  assert.equal(adoption.adoptionReviewHash, framework.adoptionReviewHash);
  assert.doesNotThrow(() => assertFrameworkAdoptionReviewed(
    { ...framework, sourceCommit: 'a'.repeat(40) },
    { ...adoption, sourceCommit: 'b'.repeat(40) }
  ));
  assert.deepEqual(
    adoption.supportedPackages.map((entry) => entry.id),
    ['core', 'event', 'gamehelper', 'pooling', 'bootstrap', 'preferences']
  );
  assert.deepEqual(
    adoption.stableRoutes.map((entry) => entry.id),
    ['core-only', 'bootstrap-lite', 'runtime-foundation', 'preferences-only']
  );
  assert.equal(adoption.gameAdoption.length, 4);
  assert.ok(adoption.gameAdoption.some((entry) => entry.gameSystem === 'Run 存档'));
  assert.ok(!JSON.stringify(adoption).includes('/Users/'));
  assert.ok(!JSON.stringify(adoption).includes('git@'));
});

test('framework adoption review fails closed with an actionable fact-drift error', () => {
  const framework = {
    adoptionReviewContract: 'supported-stable-v1',
    adoptionReviewHash: `sha256:${'a'.repeat(64)}`,
    sourceCommit: '1'.repeat(40)
  };
  const adoption = {
    adoptionReviewContract: 'supported-stable-v1',
    adoptionReviewHash: `sha256:${'b'.repeat(64)}`,
    sourceCommit: '2'.repeat(40)
  };

  assert.throws(
    () => assertFrameworkAdoptionReviewed(framework, adoption),
    /adoption review required.*Supported package identities.*stable route closures/u
  );
});

test('framework adoption review rejects unsupported or mismatched contract versions', () => {
  const hash = `sha256:${'a'.repeat(64)}`;
  const framework = {
    adoptionReviewContract: 'supported-stable-v2',
    adoptionReviewHash: hash
  };
  const adoption = {
    adoptionReviewContract: 'supported-stable-v1',
    adoptionReviewHash: hash
  };

  assert.throws(
    () => assertFrameworkAdoptionReviewed(framework, adoption),
    /adoption review required.*supported-stable-v2/u
  );
});

test('framework fallback projection refreshes synchronized explorer defaults', () => {
  const html = `
    <button data-layer-id="foundation"><span>13</span></button>
    <p id="framework-layer-detail-description">stale</p>
    <strong id="framework-layer-detail-count">13</strong>
    <strong id="framework-layer-detail-share">9%</strong>
    <button data-lifecycle-name="Supported"><strong>4</strong></button>
    <strong id="framework-lifecycle-detail-count">4</strong>
    <strong id="framework-lifecycle-detail-share">2%</strong>
  `;
  const data = {
    summary: { packageCount: 146, catalogModuleCount: 141, profileCount: 10 },
    lifecycleCounts: { Supported: 5 },
    layers: [{ id: 'foundation', description: '最小基底能力，供多数 Core 复用。', packageCount: 14 }],
    featuredModules: []
  };

  const actual = updateFrameworkFallback(html, data, { supportedPackages: [] });

  assert.match(actual, /data-layer-id="foundation"><span>14<\/span>/);
  assert.match(actual, /id="framework-layer-detail-description">最小基底能力，供多数 Core 复用。<\/p>/);
  assert.match(actual, /id="framework-layer-detail-count">14<\/strong>/);
  assert.match(actual, /id="framework-layer-detail-share">10%<\/strong>/);
  assert.match(actual, /data-lifecycle-name="Supported"><strong>5<\/strong>/);
  assert.match(actual, /id="framework-lifecycle-detail-count">5<\/strong>/);
  assert.match(actual, /id="framework-lifecycle-detail-share">3%<\/strong>/);
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
    'framework-lifecycle-detail-share'
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
  const expectedFeaturedModuleIds = [
    'ai',
    'asset',
    'bootstrap',
    'core',
    'ecs-runtime',
    'event',
    'gas',
    'input',
    'networking',
    'pooling',
    'save',
    'ui'
  ];

  for (const filter of ['all', 'foundation', 'gameplay', 'experience']) {
    assert.ok(
      html.includes(`data-module-filter="${filter}"`),
      `missing ${filter} module filter`
    );
  }

  assert.deepEqual(
    data.featuredModules.map(module => module.id),
    expectedFeaturedModuleIds
  );
  assert.ok(
    html.includes(`${expectedFeaturedModuleIds.length} 个模块`),
    'static module count should match the synchronized featured set'
  );

  for (const module of data.featuredModules) {
    assert.match(
      source,
      new RegExp(`(?:\\b${module.id}|['"]${module.id}['"]):\\s*\\{`, 'u'),
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
  const framework = JSON.parse(await readText('data/framework.json'));
  const maintenance = await readText('docs/maintenance/framework-sync.md');

  for (const fragment of [
    '先看成熟度，再看规模',
    'Preview',
    'Experimental',
    'DocsOnly',
    'Frozen',
    'Core Only',
    'Bootstrap Lite',
    '《言铸之剑》采用映射'
  ]) {
    assert.ok(html.includes(fragment), `missing maturity disclosure: ${fragment}`);
  }

  assert.ok(
    html.includes(
      `${framework.summary.packageCount} 个 Package 中只有 ${framework.lifecycleCounts.Supported} 个处于 Supported`
    ),
    'maturity introduction should use the synchronized package and Supported counts'
  );
  for (const [id, value] of [
    ['framework-supported-count', framework.lifecycleCounts.Supported],
    ['framework-preview-count', framework.lifecycleCounts.Preview],
    ['framework-experimental-count', framework.lifecycleCounts.Experimental],
    ['framework-docsonly-count', framework.lifecycleCounts.DocsOnly],
    ['framework-frozen-count', framework.lifecycleCounts.Frozen]
  ]) {
    assert.ok(
      html.includes(`id="${id}">${value}</strong>`),
      `${id} should match the synchronized lifecycle count`
    );
  }

  const foundationLayer = framework.layers.find((layer) => layer.id === 'foundation');
  assert.ok(foundationLayer, 'framework snapshot should include the foundation layer');
  assert.match(
    html,
    new RegExp(
      `data-layer-id="foundation"[\\s\\S]*?<span>${foundationLayer.packageCount}</span>[\\s\\S]*?</button>`
    ),
    'static architecture explorer fallback should use the synchronized foundation count'
  );
  assert.ok(
    html.includes(`id="framework-layer-detail-count">${foundationLayer.packageCount}</strong>`),
    'static architecture detail fallback should use the synchronized foundation count'
  );
  assert.ok(
    html.includes(`id="framework-layer-detail-description">${foundationLayer.description}</p>`),
    'static architecture detail fallback should use the synchronized foundation description'
  );
  const expectedFoundationShare = Math.max(
    foundationLayer.packageCount > 0 ? 1 : 0,
    Math.round((foundationLayer.packageCount / framework.summary.packageCount) * 100)
  );
  assert.ok(
    html.includes(`id="framework-layer-detail-share">${expectedFoundationShare}%</strong>`),
    'static architecture detail fallback should use the synchronized foundation share'
  );
  assert.match(
    html,
    new RegExp(
      `data-lifecycle-name="Supported"[\\s\\S]*?<strong>${framework.lifecycleCounts.Supported}</strong>[\\s\\S]*?</button>`
    ),
    'static lifecycle explorer fallback should use the synchronized Supported count'
  );
  assert.ok(
    html.includes(`id="framework-lifecycle-detail-count">${framework.lifecycleCounts.Supported}</strong>`),
    'static lifecycle detail fallback should use the synchronized Supported count'
  );
  const expectedSupportedShare = Math.max(
    framework.lifecycleCounts.Supported > 0 ? 1 : 0,
    Math.round((framework.lifecycleCounts.Supported / framework.summary.packageCount) * 100)
  );
  assert.ok(
    html.includes(`id="framework-lifecycle-detail-share">${expectedSupportedShare}%</strong>`),
    'static lifecycle detail fallback should use the synchronized Supported share'
  );

  assert.ok(maintenance.includes('data/framework.json'));
  assert.ok(maintenance.includes('data/framework-adoption.json'));
  assert.ok(maintenance.includes('白名单公开快照'));
  assert.ok(maintenance.includes('gitea-patch/'));
});
