import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { assertConsumerLabCurrent } from '../scripts/lib/consumer-lab-model.mjs';

const root = new URL('../', import.meta.url);
const FRAMEWORK_COMMIT = '7be137c5efaa74d64c609aa1bc3fdf13d82c1563';
const EXPECTED_CASES = new Map([
  ['route-wave-td', '60c227c747ae75e9de84fc61d8bd749c5d5c8049'],
  ['kitchen-shift', '23637da77a9b996237a0bc72ad06e0bc7b698c01'],
  ['railworks-factory', 'afc07e17d0dfdb97798e69550d04150e41a79a8a'],
  ['living-bestiary', '05d7d7594cbfd1cb0c77d9be84365074e834e8e2']
]);

test('Consumer Lab registry freezes four reviewed exact-SHA consumer snapshots', async () => {
  const registry = await readJson('data/consumer-lab.json');
  assert.doesNotThrow(() => assertConsumerLabCurrent(registry));
  assert.equal(registry.frameworkCommit, FRAMEWORK_COMMIT);
  assert.equal(registry.unityVersion, '2022.3.62f3c1');
  assert.equal(registry.cases.length, EXPECTED_CASES.size);
  assert.deepEqual(
    new Map(registry.cases.map((entry) => [entry.id, entry.consumerCommit])),
    EXPECTED_CASES
  );
  for (const entry of registry.cases) {
    assert.equal(entry.status, 'local-passed');
    assert.equal(entry.runnerStatus, 'runner-pending');
    assert.ok(entry.packages.includes('com.unitygame.framework.core'));
    assert.equal(entry.verification.editMode.passed, entry.verification.editMode.total);
    assert.equal(entry.verification.playMode.passed, entry.verification.playMode.total);
    assert.equal(entry.verification.player, 'macOS Player Build + actual smoke');
  }
});

test('Consumer Lab registry rejects private transport details and overstated evidence', async () => {
  const registry = await readJson('data/consumer-lab.json');
  const privateCopy = structuredClone(registry);
  privateCopy.cases[0].summary += ' http://154.37.215.57:3000/private';
  assert.throws(() => assertConsumerLabCurrent(privateCopy), /private transport or local path/u);

  const overstated = structuredClone(registry);
  overstated.cases[0].runnerStatus = 'runner-passed';
  assert.throws(() => assertConsumerLabCurrent(overstated), /runner-pending/u);
});

test('generated portfolio presents all Consumer Lab cases with an honest evidence boundary', async () => {
  const [registry, html] = await Promise.all([
    readJson('data/consumer-lab.json'),
    readFile(new URL('pages/portfolio.html', root), 'utf8')
  ]);
  assert.ok(html.includes(`aria-label="${registry.cases.length} 个独立消费项目"`));
  assert.ok(html.includes('Domain Consumer Lab'));
  assert.ok(html.includes('本地通过 · Runner 待验证'));
  assert.ok(html.includes(FRAMEWORK_COMMIT.slice(0, 12)));
  for (const entry of registry.cases) {
    assert.ok(html.includes(`id="consumer-${entry.id}"`), `missing ${entry.id}`);
    assert.ok(html.includes(entry.title), `missing ${entry.title}`);
    assert.ok(html.includes(entry.consumerCommit.slice(0, 12)), `missing ${entry.id} commit`);
    assert.ok(html.includes(`${entry.verification.editMode.passed}/${entry.verification.editMode.total}`));
    assert.ok(html.includes(`${entry.verification.playMode.passed}/${entry.verification.playMode.total}`));
  }

  const section = html.match(/<section class="consumer-lab"[\s\S]*?<\/section>/u)?.[0] ?? '';
  for (const forbidden of ['/Users/', '154.37.215.57', 'Gitea', 'git@', 'runner-passed']) {
    assert.ok(!section.includes(forbidden), `Consumer Lab section leaks ${forbidden}`);
  }
});

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}
