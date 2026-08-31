import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { resolveConsumerSyncRegistry } from '../scripts/lib/consumer-sync-registry.mjs';

const root = new URL('../', import.meta.url);
const readText = async (file) => readFile(new URL(file, root), 'utf8');
const readJson = async (file) => JSON.parse(await readText(file));

test('Consumer Case and source repository identities are explicit and complete', async () => {
  const [registry, consumerLab] = await Promise.all([
    readJson('config/consumer-sync.json'),
    readJson('data/consumer-lab.json')
  ]);
  const resolved = resolveConsumerSyncRegistry(registry, consumerLab);

  assert.equal(resolved.caseCount, 7);
  assert.equal(resolved.sourcePushCount, 4);
  assert.equal(resolved.fixedSnapshotCount, 3);
  assert.deepEqual(resolved.representativeEvidenceCaseIds, [
    'route-wave-td',
    'willow-hearth',
    'gamejam-game'
  ]);

  const unknown = structuredClone(registry);
  unknown.sourcePushCaseIds.push('unknown-case');
  assert.throws(
    () => resolveConsumerSyncRegistry(unknown, consumerLab),
    /must partition every Consumer Case exactly once/u
  );

  const overlap = structuredClone(registry);
  overlap.fixedSnapshotCaseIds.push(overlap.sourcePushCaseIds[0]);
  assert.throws(
    () => resolveConsumerSyncRegistry(overlap, consumerLab),
    /must partition every Consumer Case exactly once/u
  );
});

test('README and Portfolio use generated project and Consumer summaries', async () => {
  const [readme, portfolio] = await Promise.all([
    readText('README.md'),
    readText('pages/portfolio.html')
  ]);

  assert.match(readme, /<!-- project-summary:start -->[\s\S]*6 个正式公开项目[\s\S]*<!-- project-summary:end -->/u);
  assert.match(readme, /<!-- consumer-summary:start -->[\s\S]*7 个 Consumer Lab 案例[\s\S]*4 个仓库启用 source-push[\s\S]*3 个固定快照[\s\S]*<!-- consumer-summary:end -->/u);
  assert.ok(!readme.includes('四条真实项目主线'));
  assert.match(portfolio, /7 个案例 · 4 个 Source-push Repository · 3 个固定快照/u);
});
