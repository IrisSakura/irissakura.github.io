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
  'willow-hearth',
  'gamejam-game'
]);
const EXPECTED_PUBLIC_CASES = new Map([
  ['route-wave-td', { category: '塔防原型', highlights: ['路线封锁', '波次推进', '建造窗口', '胜负结算'] }],
  ['kitchen-shift', { category: '时间管理原型', highlights: ['并行烹饪', '配方前置', '顾客耐心', '班次结算'] }],
  ['railworks-factory', { category: '工厂物流原型', highlights: ['生产排程', '铁路发运', '堵塞恢复', '历史清理'] }],
  ['living-bestiary', { category: '生态收集原型', highlights: ['季节循环', '生物遭遇', '检查点存档', '备份恢复'] }],
  ['ashfall-loot-run', { category: '刷装战斗原型', highlights: ['三段遭遇', '确定性掉落', '伤害预算', '拾取幂等'] }],
  ['willow-hearth', { category: '生活模拟原型', highlights: ['小时推进', 'NPC 日程', '农田成长', '出货结算'] }],
  ['gamejam-game', { category: '双模式战斗项目', highlights: ['自动竞技场', '三人编队', '角色技能与切换', '双币经济闭环'] }]
]);
const PLAYER_EVIDENCE = new Set([
  'macOS Player Build + actual smoke',
  'Unity WebGL Build + browser smoke'
]);

test('Consumer Lab registry maintains seven reviewed exact-SHA consumer snapshots', async () => {
  const registry = await readJson('data/consumer-lab.json');
  assert.doesNotThrow(() => assertConsumerLabCurrent(registry));
  assert.equal(registry.schemaVersion, 2);
  assert.equal(registry.cases.length, EXPECTED_CASES.size);
  assert.deepEqual(new Set(registry.cases.map((entry) => entry.id)), EXPECTED_CASES);
  for (const entry of registry.cases) {
    assert.match(entry.consumerCommit, /^[a-f0-9]{40}$/u);
    assert.match(entry.frameworkCommit, /^[a-f0-9]{40}$/u);
    assert.match(entry.unityVersion, /^\d+\.\d+\.\d+f\d+c\d+$/u);
    assert.ok(Number.isFinite(Date.parse(entry.sourceCommittedAt)));
    assert.match(entry.reviewedPackageHash, /^[a-f0-9]{64}$/u);
    assert.equal(entry.status, 'local-passed');
    assert.equal(entry.runnerStatus, 'runner-pending');
    assert.ok(entry.packages.includes('com.unitygame.framework.core'));
    assert.equal(entry.verification.editMode.passed, entry.verification.editMode.total);
    assert.equal(entry.verification.playMode.passed, entry.verification.playMode.total);
    assert.ok(PLAYER_EVIDENCE.has(entry.verification.player));
  }

  const gameJam = registry.cases.find((entry) => entry.id === 'gamejam-game');
  assert.ok(gameJam);
  assert.equal(gameJam.consumerCommit, '4fb1ba3b9240cbae86cb38ac18fd81c3ce99431a');
  assert.equal(gameJam.frameworkCommit, '5d5eafc18cec8c1cd99ccbb850f660a807d7edd7');
  assert.equal(gameJam.sourceCommittedAt, '2026-08-28T01:50:09+08:00');
  assert.equal(gameJam.reviewedPackageHash, '8aee9b253e0922198e47ab4fdf7859287e587d1f492cd975dd1a85c3c32eda9d');
  assert.deepEqual(gameJam.verification.editMode, { passed: 144, total: 144 });
  assert.deepEqual(gameJam.verification.playMode, { passed: 59, total: 59 });
  assert.equal(gameJam.verification.player, 'Unity WebGL Build + browser smoke');
  assert.deepEqual(gameJam.brandNarrative, {
    iris: '先约束共享存档、双币经济与战斗状态的一致性，再验证两套模式是否形成完整闭环。',
    sakura: 'GAS、Event、Pooling 与 Ledger 分别承担技能、解耦、复用和可信经济记账。'
  });
});

test('Consumer Lab registry rejects private transport details and overstated evidence', async () => {
  const registry = await readJson('data/consumer-lab.json');
  const privateCopy = structuredClone(registry);
  privateCopy.cases[0].summary += ' http://154.37.215.57:3000/private';
  assert.throws(() => assertConsumerLabCurrent(privateCopy), /private transport or local path/u);

  const overstated = structuredClone(registry);
  overstated.cases[0].runnerStatus = 'runner-passed';
  assert.throws(() => assertConsumerLabCurrent(overstated), /runner-pending/u);

  const unknownRuntime = structuredClone(registry);
  unknownRuntime.cases[0].verification.player = 'Browser looked okay';
  assert.throws(() => assertConsumerLabCurrent(unknownRuntime), /reviewed Player evidence/u);

  const missingBrandNarrative = structuredClone(registry);
  delete missingBrandNarrative.cases.find((entry) => entry.id === 'gamejam-game').brandNarrative;
  assert.throws(() => assertConsumerLabCurrent(missingBrandNarrative), /brand narrative/u);

  const leakedBrandNarrative = structuredClone(registry);
  leakedBrandNarrative.cases.find((entry) => entry.id === 'gamejam-game').brandNarrative.iris += ' /Users/private';
  assert.throws(() => assertConsumerLabCurrent(leakedBrandNarrative), /private transport or local path/u);
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
  assert.ok(html.includes('七个独立玩法项目'));
  assert.ok(html.includes('class="consumer-lab-card consumer-lab-card-featured" id="consumer-gamejam-game"'));
  assert.ok(html.includes('data-brand-bridge="iris-sakura"'));
  assert.ok(html.includes('data-brand-side="iris"'));
  assert.ok(html.includes('IRIS · DEFINE THE PROOF'));
  assert.ok(html.includes('data-brand-side="sakura"'));
  assert.ok(html.includes('SAKURA · POWER THE SYSTEM'));
  assert.ok(html.includes('class="consumer-lab-local-proof"'));
  assert.equal((html.match(/class="consumer-lab-compact-proof"/gu) ?? []).length, 2);
  assert.equal((html.match(/LOCAL UNITY VERIFIED · NOT A RELEASE/gu) ?? []).length, 3);
  assert.ok(html.includes('7 个案例 · 4 个 Source-push Repository · 3 个固定快照'));
  assert.ok(html.includes('href="framework-quickstart.html"'));
  for (const publicEvidence of ['144 / 144', '59 / 59', 'WebGL + Browser']) {
    assert.ok(html.includes(publicEvidence), `missing featured local evidence: ${publicEvidence}`);
  }
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
