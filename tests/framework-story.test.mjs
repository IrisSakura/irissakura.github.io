import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  FRAMEWORK_STORY_COMMIT,
  assertFrameworkStory,
  resolveFrameworkStory
} from '../scripts/lib/framework-story-model.mjs';

const root = new URL('../', import.meta.url);

async function readText(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

async function readJson(relativePath) {
  return JSON.parse(await readText(relativePath));
}

test('framework story is a closed, website-owned contract bound to committed truth', async () => {
  const story = await readJson('data/framework-story.json');

  assert.doesNotThrow(() => assertFrameworkStory(story));
  assert.equal(story.frameworkCommit, FRAMEWORK_STORY_COMMIT);
  assert.match(story.positioning.seoTitle, /Portable Core/);
  assert.match(story.positioning.seoTitle, /Cross-Engine Architecture/);
  assert.deepEqual(story.positioning.claims, [
    'Portable Core',
    'Explicit Ownership',
    'Unity Supported',
    'Godot Parallel Preview',
    'Architecture Governance',
    'Independent Consumers'
  ]);
  assert.deepEqual(story.pillars.map((pillar) => pillar.id), [
    'explicit-ownership',
    'engine-agnostic-semantics',
    'evidence-before-claims'
  ]);
  assert.deepEqual(story.architectureMap.branches.map((branch) => [branch.id, branch.status]), [
    ['unity', 'supported'],
    ['godot', 'parallel-preview']
  ]);
  const portableCore = story.architectureMap.layers.find((layer) => layer.id === 'portable-core');
  assert.equal(portableCore.label, 'Portable .NET Core / Config Core / Parallel');
  assert.equal(portableCore.status, 'portable-preview');
  assert.match(portableCore.description, /Portable Preview/);
  assert.deepEqual(story.architectureMap.layers
    .filter((layer) => layer.id !== 'portable-core')
    .map((layer) => Object.hasOwn(layer, 'status')), [false, false, false]);
  assert.deepEqual(story.architectureMap.branches
    .filter((branch) => branch.id === 'godot')
    .map((branch) => [branch.label, branch.runtimeLabel]), [['Parallel Godot Adapter', 'Godot translation boundary']]);
  assert.deepEqual(story.architectureMap.boundaries.map((boundary) => [boundary.id, boundary.status]), [
    ['godot-core-config', 'deferred'],
    ['godot-runtime-host', 'not-delivered']
  ]);
  assert.deepEqual(story.evidence, {
    local: 'local-passed',
    runner: 'runner-pending',
    summary: story.evidence.summary
  });
  assert.ok(!JSON.stringify(story).includes('/Users/'));
  assert.ok(!JSON.stringify(story).includes('runner-passed'));
});

test('framework story model fails closed on source drift, status drift and schema expansion', async () => {
  const story = await readJson('data/framework-story.json');

  assert.throws(
    () => assertFrameworkStory({ ...story, frameworkCommit: 'a'.repeat(40) }),
    /must bind committed truth/
  );
  assert.throws(
    () => assertFrameworkStory({
      ...story,
      evidence: { ...story.evidence, runner: 'runner-passed' }
    }),
    /runner evidence must be one of/
  );
  assert.throws(
    () => assertFrameworkStory({ ...story, unexpected: true }),
    /keys must be exactly/
  );
  assert.throws(
    () => assertFrameworkStory({
      ...story,
      architectureMap: {
        ...story.architectureMap,
        branches: story.architectureMap.branches.map((branch) => (
          branch.id === 'godot' ? { ...branch, status: 'supported' } : branch
        ))
      }
    }),
    /branch statuses must remain/
  );
  assert.throws(
    () => assertFrameworkStory({
      ...story,
      architectureMap: {
        ...story.architectureMap,
        layers: story.architectureMap.layers.map((layer) => (
          layer.id === 'portable-core' ? { ...layer, status: 'parallel-preview' } : layer
        ))
      }
    }),
    /portable-core status must remain Portable Preview/
  );
  assert.throws(
    () => assertFrameworkStory({
      ...story,
      architectureMap: {
        ...story.architectureMap,
        layers: story.architectureMap.layers.map((layer) => (
          layer.id === 'gameplay-semantics' ? { ...layer, status: 'portable-preview' } : layer
        ))
      }
    }),
    /keys must be exactly/
  );
  assert.throws(
    () => assertFrameworkStory({
      ...story,
      architectureMap: {
        ...story.architectureMap,
        branches: story.architectureMap.branches.map((branch) => (
          branch.id === 'godot' ? { ...branch, label: 'Godot Adapter', runtimeLabel: 'Godot Runtime API' } : branch
        ))
      }
    }),
    /Godot branch must remain Parallel Godot Adapter/
  );
});

test('framework story resolution is detached and retains the reference anchors', async () => {
  const story = await readJson('data/framework-story.json');
  const resolved = resolveFrameworkStory(story);

  assert.notEqual(resolved, story);
  assert.notEqual(resolved.pillars, story.pillars);
  assert.deepEqual(resolved.reference.items.map((item) => item.href), [
    '#maturity', '#adoption', '#game-adoption', '#modules', '#architecture', '#lifecycle', 'framework-quickstart.html'
  ]);
  resolved.pillars[0].signals.push('test-only');
  assert.equal(story.pillars[0].signals.includes('test-only'), false);
});

test('Framework page is generated from the story blocks before the technical reference', async () => {
  const [html, generator, maintenance, story] = await Promise.all([
    readText('pages/framework.html'),
    readText('scripts/generate-site.mjs'),
    readText('docs/maintenance/framework-sync.md'),
    readJson('data/framework-story.json')
  ]);

  for (const marker of ['framework-story-hero', 'framework-story', 'framework-reference']) {
    assert.equal((html.match(new RegExp(`<!-- ${marker}:start -->`, 'g')) ?? []).length, 1);
    assert.equal((html.match(new RegExp(`<!-- ${marker}:end -->`, 'g')) ?? []).length, 1);
    assert.ok(generator.includes(`replaceGeneratedBlock(html, '${marker}'`));
  }
  for (const fragment of [
    'Portable Core',
    'Explicit Ownership',
    'Godot Parallel Preview',
    'Parallel Godot Adapter',
    'Godot translation boundary',
    'Godot Core / Config',
    'Godot Runtime Host',
    'THREE ENGINEERING PILLARS',
    'Reference / 核心模块'
  ]) assert.ok(html.includes(fragment), `missing Framework story fragment: ${fragment}`);
  assert.match(html, new RegExp(`<title>${escapeRegExp(story.positioning.seoTitle)}</title>`));
  assert.match(html, new RegExp(`<meta name="description" content="${escapeRegExp(story.positioning.description)}">`));
  const structuredData = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/u)?.[1] ?? '{}');
  assert.equal(structuredData.name, story.positioning.seoTitle);
  assert.equal(structuredData.description, story.positioning.description);
  assert.equal(structuredData.runtimePlatform, 'Portable .NET; Unity; Godot Parallel Preview');
  const pageIndex = html.match(/<!-- page-index:start -->[\s\S]*?<!-- page-index:end -->/u)?.[0] ?? '';
  assert.deepEqual(
    [...pageIndex.matchAll(/<a href="#([^"]+)"[^>]*data-page-index-link/gu)].map((match) => match[1]),
    ['architecture-map', 'pillars', 'reference', 'maturity', 'adoption', 'game-adoption']
  );
  assert.match(generator, /insertBefore: '    <!-- framework-story:start -->'/u);
  assert.doesNotMatch(html, /framework-map-layer-gameplay-semantics[^>]*data-story-status/gu);
  assert.doesNotMatch(html, /framework-map-layer-runtime-services[^>]*data-story-status/gu);
  assert.match(html, /framework-map-layer-portable-core[^>]*data-story-status="portable-preview"/u);
  for (const anchor of ['maturity', 'adoption', 'game-adoption', 'modules', 'architecture', 'lifecycle']) {
    assert.match(html, new RegExp(`id="${anchor}"`));
    assert.match(html, new RegExp(`href="#${anchor}"`));
  }
  assert.match(maintenance, /data\/framework-story\.json/);
  assert.match(maintenance, new RegExp(FRAMEWORK_STORY_COMMIT));
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}
