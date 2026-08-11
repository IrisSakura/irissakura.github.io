import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { promisify } from 'node:util';

import { assertConsumerLabCurrent } from '../scripts/lib/consumer-lab-model.mjs';

const root = new URL('../', import.meta.url);
const execFileAsync = promisify(execFile);
const EXPECTED_CASES = new Set([
  'route-wave-td',
  'kitchen-shift',
  'railworks-factory',
  'living-bestiary',
  'ashfall-loot-run',
  'willow-hearth'
]);
const EXPECTED_PUBLIC_CASES = new Map([
  ['route-wave-td', { category: '塔防原型', highlights: ['路线封锁', '波次推进', '建造窗口', '胜负结算'] }],
  ['kitchen-shift', { category: '时间管理原型', highlights: ['并行烹饪', '配方前置', '顾客耐心', '班次结算'] }],
  ['railworks-factory', { category: '工厂物流原型', highlights: ['生产排程', '铁路发运', '堵塞恢复', '历史清理'] }],
  ['living-bestiary', { category: '生态收集原型', highlights: ['季节循环', '生物遭遇', '检查点存档', '备份恢复'] }],
  ['ashfall-loot-run', { category: '刷装战斗原型', highlights: ['三段遭遇', '确定性掉落', '伤害预算', '拾取幂等'] }],
  ['willow-hearth', { category: '生活模拟原型', highlights: ['小时推进', 'NPC 日程', '农田成长', '出货结算'] }]
]);

test('Consumer Lab registry maintains six reviewed exact-SHA consumer snapshots', async () => {
  const registry = await readJson('data/consumer-lab.json');
  assert.doesNotThrow(() => assertConsumerLabCurrent(registry));
  assert.equal(registry.schemaVersion, 2);
  assert.equal(registry.cases.length, EXPECTED_CASES.size);
  assert.deepEqual(new Set(registry.cases.map((entry) => entry.id)), EXPECTED_CASES);
  for (const entry of registry.cases) {
    assert.match(entry.consumerCommit, /^[a-f0-9]{40}$/u);
    assert.match(entry.frameworkCommit, /^[a-f0-9]{40}$/u);
    assert.match(entry.unityVersion, /^\d+\.\d+\.\d+f\d+c\d+$/u);
    assert.match(entry.sourceCommittedAt, /^2026-08-11T/u);
    assert.match(entry.reviewedPackageHash, /^[a-f0-9]{64}$/u);
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

test('Consumer Lab registry requires concise visitor-facing project copy', async () => {
  const registry = await readJson('data/consumer-lab.json');
  const missingCategory = structuredClone(registry);
  missingCategory.cases[0].category = '';
  assert.throws(() => assertConsumerLabCurrent(missingCategory), /category/u);

  const noisyHighlights = structuredClone(registry);
  noisyHighlights.cases[0].highlights = ['重复系统', '重复系统', '第三个系统'];
  assert.throws(() => assertConsumerLabCurrent(noisyHighlights), /highlights/u);
});

test('generated portfolio presents projects without owner-only Consumer Lab metadata', async () => {
  const [registry, html] = await Promise.all([
    readJson('data/consumer-lab.json'),
    readFile(new URL('pages/portfolio.html', root), 'utf8')
  ]);
  assert.ok(html.includes(`aria-label="${registry.cases.length} 个独立玩法项目"`));
  assert.ok(html.includes('六个独立玩法项目'));
  for (const entry of registry.cases) {
    const publicCase = EXPECTED_PUBLIC_CASES.get(entry.id);
    assert.ok(publicCase, `missing public contract for ${entry.id}`);
    assert.ok(html.includes(`id="consumer-${entry.id}"`), `missing ${entry.id}`);
    assert.ok(html.includes(entry.title), `missing ${entry.title}`);
    assert.ok(html.includes(publicCase.category), `missing ${entry.id} category`);
    for (const highlight of publicCase.highlights) {
      assert.ok(html.includes(highlight), `missing ${entry.id} highlight: ${highlight}`);
    }
  }

  const section = html.match(/<section class="consumer-lab"[\s\S]*?<\/section>/u)?.[0] ?? '';
  for (const forbidden of [
    '/Users/',
    '154.37.215.57',
    'Gitea',
    'git@',
    'data-consumer-commit',
    '本地通过',
    'Runner',
    'Framework 快照',
    'Framework packages',
    'EditMode',
    'PlayMode',
    'Build + actual smoke',
    '消费快照',
    '证据边界',
    ...registry.cases.map((entry) => entry.frameworkCommit.slice(0, 12)),
    ...registry.cases.map((entry) => entry.consumerCommit.slice(0, 12)),
    ...registry.cases.map((entry) => entry.evidenceBoundary)
  ]) {
    assert.ok(!section.includes(forbidden), `Consumer Lab section leaks ${forbidden}`);
  }
});

test('GitHub Pages artifact omits the owner-only Consumer Lab registry', async () => {
  await execFileAsync(process.execPath, ['scripts/prepare-pages.mjs'], {
    cwd: root,
    encoding: 'utf8'
  });
  await access(new URL('_site/pages/portfolio.html', root));
  await assert.rejects(
    access(new URL('_site/data/consumer-lab.json', root)),
    (error) => error?.code === 'ENOENT',
    'published artifact must not expose the owner-only Consumer Lab registry'
  );
});

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}
