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
});

test('public portfolio does not expose the private journal origin', async () => {
  const html = await readText('pages/portfolio.html');
  const source = await readText('src/portfolio.ts');

  assert.ok(!html.includes('154.37.215.57'));
  assert.ok(!source.includes('154.37.215.57'));
});
