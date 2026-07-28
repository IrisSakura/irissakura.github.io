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
    '从研究到作品',
    '学习与源码研究',
    '设计范式提炼',
    '框架与作品验证',
    'data-filter="research"',
    'Sakura Design Journal'
  ]) {
    assert.ok(html.includes(fragment), `missing portfolio journey fragment: ${fragment}`);
  }
});

test('portfolio data keeps research distinct from finished work', async () => {
  const source = await readText('src/portfolio.ts');

  assert.ok(source.includes("'research' | 'game'"), 'research should be a first-class portfolio category');
  assert.ok(source.includes('title: "Sakura Design Journal"'));
  assert.ok(source.includes('title: "Sakura Framework"'));
  assert.ok(source.includes("'research': '研究与设计'"));
  assert.ok(source.includes('link: "journal.html"'));
  assert.ok(source.includes('title: "言铸之剑"'));
  assert.ok(source.includes('link: "game.html"'));
  assert.ok(source.includes('assets/images/sword-of-words/combat-room.png'));

  for (const fabricatedTitle of [
    '像素地牢',
    '节奏迷宫',
    '科幻角色设计集',
    '游戏原声带 - 宇宙之旅',
    '对话系统编辑器',
    '环境音效包',
    'UI组件库'
  ]) {
    assert.ok(!source.includes(fabricatedTitle), `fabricated project should be removed: ${fabricatedTitle}`);
  }
});

test('public portfolio does not expose the private journal origin', async () => {
  const html = await readText('pages/portfolio.html');
  const source = await readText('src/portfolio.ts');

  assert.ok(!html.includes('154.37.215.57'));
  assert.ok(!source.includes('154.37.215.57'));
});

test('portfolio exposes only categories backed by real projects', async () => {
  const html = await readText('pages/portfolio.html');
  const source = await readText('src/portfolio.ts');

  for (const filter of ['all', 'research', 'game', 'tool']) {
    assert.ok(html.includes(`data-filter="${filter}"`), `missing real category: ${filter}`);
  }

  for (const emptyCategory of ['art', 'music']) {
    assert.ok(!html.includes(`data-filter="${emptyCategory}"`), `empty category should be removed: ${emptyCategory}`);
  }

  assert.ok(!html.includes('load-more-btn'));
  assert.ok(!source.includes('loadMoreBtn'));
});

test('about page describes only the verified project chain', async () => {
  const html = await readText('pages/about.html');

  for (const realProject of ['Sakura Design Journal', 'Sakura Framework', '言铸之剑']) {
    assert.ok(html.includes(realProject), `missing verified project: ${realProject}`);
  }

  for (const unsupportedClaim of ['像素地牢', '1000次下载', '第一个完整作品发布']) {
    assert.ok(!html.includes(unsupportedClaim), `unsupported project claim should be removed: ${unsupportedClaim}`);
  }
});

test('finished game page presents the real playable loop and public screenshots', async () => {
  const html = await readText('pages/game.html');
  const source = await readText('src/game.ts');
  const publicText = `${html}\n${source}`;

  for (const fragment of [
    '言铸之剑',
    'COMPLETE GAME',
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
});
