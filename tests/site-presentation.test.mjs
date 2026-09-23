import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { assertSitePresentationConfig, resolveNavigationId, resolveProjectPresentations } from '../scripts/lib/site-presentation.mjs';

const root = new URL('../', import.meta.url);
const readJson = async (file) => JSON.parse(await readFile(new URL(file, root), 'utf8'));

test('site presentation owns six visitor routes and six stable brand entries', async () => {
  const [config, brand, projects, search] = await Promise.all([
    readJson('config/site-presentation.json'), readJson('config/brand.json'), readJson('data/projects.json'), readJson('data/search-index.json')
  ]);
  assertSitePresentationConfig(config, brand);
  assert.deepEqual(config.navigation.map(({ label }) => label), ['首页', '作品', '文章', '项目', 'Mods', '关于']);
  assert.deepEqual(config.projects.map(({ projectId }) => projectId), ['iris-engineering', 'sakura-framework', 'sakura-design-journal', 'iris-shelf', 'freesia-mods', 'wisteria']);
  assert.deepEqual(resolveProjectPresentations(config, brand, projects).map(({ displayName }) => displayName), ['Iris Engineering', 'SakuraGameFramework', 'Myosotis', 'Violet Shelf', 'Freesia Mods', 'Wisteria']);
  assertSitePresentationConfig(config, brand, projects);
  const invalid = structuredClone(config); invalid.portfolio.groups[0].projectIds.push('missing-work');
  assert.throws(() => assertSitePresentationConfig(invalid, brand, projects), /unknown project/);
});

test('navigation grouping keeps deep routes stable without duplicate active items', async () => {
  const config = await readJson('config/site-presentation.json');
  const expectations = {
    'index.html': 'home',
    'pages/game.html': 'portfolio',
    'pages/mods.html': 'mods',
    'pages/mods/the-weaver.html': 'mods',
    'pages/development.html': 'projects',
    'pages/engineering.html': 'projects',
    'pages/tools.html': 'projects',
    'pages/framework/cases.html': 'projects',
    'pages/journal.html': 'projects',
    'pages/journal/bowling.html': 'projects',
    'pages/blog/authoritative-time-source.html': 'writing',
    'pages/contact.html': 'about',
    'pages/brand.html': 'about'
  };
  for (const [file, expected] of Object.entries(expectations)) assert.equal(resolveNavigationId(config, file), expected, file);
});

test('generated visitor surfaces reuse the presentation contract', async () => {
  const [home, projects, portfolio, mods, tools, navbar] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('pages/development.html', root), 'utf8'),
    readFile(new URL('pages/portfolio.html', root), 'utf8'),
    readFile(new URL('pages/mods.html', root), 'utf8'),
    readFile(new URL('pages/tools.html', root), 'utf8'),
    readFile(new URL('components/navbar.html', root), 'utf8')
  ]);
  for (const name of ['Iris Engineering', 'SakuraGameFramework', 'Myosotis', 'Violet Shelf']) {
    assert.match(home, new RegExp(name));
    assert.match(projects, new RegExp(name));
  }
  assert.doesNotMatch(home, /精选知识/u);
  assert.match(home, /最近写的/u);
  assert.match(projects, /Violet Shelf[\s\S]*?本地开发与使用 · 暂未开放下载/u);
  assert.doesNotMatch(projects, /完整本地产品/u);
  assert.match(portfolio, /href="\.\.\/pages\/development\.html"/u);
  assert.match(home, />Mods</u);
  assert.match(home, /Freesia Mods/u);
  assert.match(portfolio, /查看 Freesia Mods 系列/u);
  assert.match(mods, /让喜欢的游戏，长出新的可能。/u);
  assert.match(mods, /The Weaver/u);
  assert.match(mods, /Iris Core/u);
  assert.doesNotMatch(mods, /Download|Play Now|Workshop/u);
  assert.match(tools, /id="tools"[\s\S]*id="status"/u);
  assert.doesNotMatch(navbar, /profile-drawer/u);
});
