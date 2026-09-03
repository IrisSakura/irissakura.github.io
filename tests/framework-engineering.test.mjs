import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  FRAMEWORK_ENGINEERING_COMMIT,
  assertFrameworkEngineering,
  resolveFrameworkEngineering
} from '../scripts/lib/framework-engineering-model.mjs';

const root = new URL('../', import.meta.url);

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}

test('Framework Engineering Hub is a closed, exact-SHA architecture contract', async () => {
  const hub = await readJson('data/framework-engineering.json');

  assert.doesNotThrow(() => assertFrameworkEngineering(hub));
  assert.equal(hub.frameworkCommit, FRAMEWORK_ENGINEERING_COMMIT);
  assert.deepEqual(hub.depthModel.map((entry) => entry.id), [
    'd0-signal', 'd1-system', 'd2-architecture', 'd3-evidence'
  ]);
  assert.deepEqual(hub.readerPaths.map((entry) => entry.label), [
    'Understand Sakura', 'Explore Engineering', 'Start Using'
  ]);
  assert.equal(hub.domains.length, 10);
  assert.ok(hub.domains.every((entry) => entry.status === 'implemented'));
  assert.ok(hub.domains.every((entry) => entry.route.startsWith('framework/') && entry.evidence));
  assert.equal(hub.depthModel.find((entry) => entry.id === 'd2-architecture').route, 'framework/decisions.html');
  assert.equal(hub.depthModel.find((entry) => entry.id === 'd3-evidence').route, 'framework/evidence.html');
  assert.deepEqual(hub.evidence, {
    local: 'local-passed',
    runner: 'runner-pending',
    production: 'unknown',
    summary: hub.evidence.summary
  });
  assert.equal(hub.links.quickstart, 'framework-quickstart.html');
});

test('Framework Engineering Hub fails closed on identity, evidence, and status drift', async () => {
  const hub = await readJson('data/framework-engineering.json');

  assert.throws(
    () => assertFrameworkEngineering({ ...hub, frameworkCommit: 'a'.repeat(40) }),
    /immutable Framework commit/
  );
  assert.throws(
    () => assertFrameworkEngineering({
      ...hub,
      evidence: { ...hub.evidence, production: 'local-passed' }
    }),
    /production evidence must be one of/
  );
  assert.throws(
    () => assertFrameworkEngineering({
      ...hub,
      domains: hub.domains.map((entry, index) => (
        index === 0 ? { ...entry, status: 'information-architecture-closed-with-deferred-status' } : entry
      ))
    }),
    /implemented deep route/
  );
  assert.throws(
    () => assertFrameworkEngineering({
      ...hub,
      depthModel: hub.depthModel.map((entry) => entry.id === 'd3-evidence' ? { ...entry, route: '#evidence-boundary' } : entry)
    }),
    /delivered depth owner/
  );
  assert.throws(
    () => assertFrameworkEngineering({
      ...hub,
      readerPaths: hub.readerPaths.map((entry, index) => (
        index === 2 ? { ...entry, href: 'https://private.example/route' } : entry
      ))
    }),
    /public site route/
  );
});

test('Framework Engineering resolution detaches nested public metadata', async () => {
  const hub = await readJson('data/framework-engineering.json');
  const resolved = resolveFrameworkEngineering(hub);

  assert.notEqual(resolved, hub);
  assert.notEqual(resolved.depthModel, hub.depthModel);
  resolved.domains[0].evidence = 'test-only';
  assert.notEqual(hub.domains[0].evidence, 'test-only');
});
