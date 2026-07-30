import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('portfolio explains the path from research to finished work', async () => {
  const html = await readText('pages/portfolio.html');

  for (const fragment of [
    '研究 → 范式 → 框架 → 游戏验证',
    '研究问题',
    '工程抽象',
    '作品验证',
    'portfolio-case-game',
    'Sakura Design Journal'
  ]) {
    assert.ok(html.includes(fragment), `missing portfolio journey fragment: ${fragment}`);
  }
});

test('portfolio data keeps research distinct from finished work', async () => {
  const data = JSON.parse(await readText('data/projects.json'));
  const titles = data.projects.map((project) => project.title);

  assert.deepEqual(titles, ['Sakura Design Journal', 'Sakura Framework', '言铸之剑']);
  assert.deepEqual(new Set(data.projects.map((project) => project.category)), new Set(['research', 'tool', 'game']));
  for (const project of data.projects) {
    assert.ok(project.status.length > 0, `${project.title} needs a status`);
    assert.ok(project.role.length > 0, `${project.title} needs a role`);
    assert.ok(project.evidence.length > 0, `${project.title} needs evidence`);
    assert.ok(project.limitations.length > 0, `${project.title} needs limitations`);
    assert.ok(project.next.length > 0, `${project.title} needs next steps`);
  }

  for (const fabricatedTitle of [
    '像素地牢',
    '节奏迷宫',
    '科幻角色设计集',
    '游戏原声带 - 宇宙之旅',
    '对话系统编辑器',
    '环境音效包',
    'UI组件库'
  ]) {
    assert.ok(!JSON.stringify(data).includes(fabricatedTitle), `fabricated project should be removed: ${fabricatedTitle}`);
  }
});

test('portfolio project evidence does not duplicate volatile snapshot counts', async () => {
  const data = JSON.parse(await readText('data/projects.json'));
  for (const projectId of ['sakura-design-journal', 'sakura-framework']) {
    const project = data.projects.find((entry) => entry.id === projectId);
    assert.ok(project, `missing project ${projectId}`);
    for (const evidence of project.evidence) {
      assert.doesNotMatch(
        evidence,
        /\d+\s*(?:个|条|项|篇)/u,
        `${projectId} evidence must describe stable proof instead of copying snapshot counts`
      );
    }
  }
});

test('public portfolio does not expose the private journal origin', async () => {
  const html = await readText('pages/portfolio.html');
  const data = await readText('data/projects.json');

  assert.ok(!html.includes('154.37.215.57'));
  assert.ok(!data.includes('154.37.215.57'));
});

test('portfolio renders exactly three fixed evidence-led cases with the game first', async () => {
  const html = await readText('pages/portfolio.html');
  assert.equal((html.match(/class="portfolio-case /g) ?? []).length, 3);
  assert.ok(!html.includes('portfolio-filters'));
  assert.ok(!html.includes('data-filter='));
  assert.ok(html.indexOf('project-sword-of-words') < html.indexOf('project-sakura-framework'));
  assert.ok(html.indexOf('project-sakura-framework') < html.indexOf('project-sakura-design-journal'));
  assert.ok(html.includes('framework-proof-visual'));
  assert.ok(html.includes('journal-proof-visual'));
});

test('about page explains motivation, current focus and working preferences without unsupported claims', async () => {
  const html = await readText('pages/about.html');

  for (const fragment of ['WHY SAKURA FRAMEWORK', '当前主要开发方向', '我偏好的项目与工作方式', '交流范围', '言铸之剑']) {
    assert.ok(html.includes(fragment), `missing about-page context: ${fragment}`);
  }

  for (const unsupportedClaim of ['像素地牢', '1000次下载', '第一个完整作品发布']) {
    assert.ok(!html.includes(unsupportedClaim), `unsupported project claim should be removed: ${unsupportedClaim}`);
  }
});

test('finished game page presents the real playable loop and public screenshots', async () => {
  const html = await readText('pages/game.html');
  const publicText = html;

  for (const fragment of [
    '言铸之剑',
    'PLAYABLE PROTOTYPE',
    '选择房间',
    '实时战斗',
    '构筑成长',
    '推进与保存',
    'combat-room.png',
    'room-selection.png',
    'potential-tree.png',
    'blessing-request.png',
    'Sakura Design Journal',
    'Sakura Framework'
  ]) {
    assert.ok(html.includes(fragment), `missing finished-game fragment: ${fragment}`);
  }

  assert.ok(!publicText.includes('/Users/'));
  assert.ok(!publicText.includes('gitProject'));
  assert.ok(html.includes('暂无 Demo'));
  assert.ok(html.includes('已知限制'));
});
