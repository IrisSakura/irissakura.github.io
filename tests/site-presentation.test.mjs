import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { assertSitePresentationConfig, resolveFeaturedKnowledge, resolveNavigationId, resolveProjectPresentations } from '../scripts/lib/site-presentation.mjs';

const root = new URL('../', import.meta.url);
const readJson = async (file) => JSON.parse(await readFile(new URL(file, root), 'utf8'));

test('site presentation owns five visitor routes and four stable projects', async () => {
  const [config, brand, projects, search] = await Promise.all([
    readJson('config/site-presentation.json'), readJson('config/brand.json'), readJson('data/projects.json'), readJson('data/search-index.json')
  ]);
  assertSitePresentationConfig(config, brand);
  assert.deepEqual(config.navigation.map(({ label }) => label), ['首页', '作品', '项目', '知识', '关于与联系']);
  assert.deepEqual(config.projects.map(({ projectId }) => projectId), ['iris-engineering', 'sakura-framework', 'sakura-design-journal', 'iris-shelf']);
  assert.deepEqual(resolveProjectPresentations(config, brand, projects).map(({ displayName }) => displayName), ['Iris Engineering', 'SakuraGameFramework', 'Myosotis', 'Violet Shelf']);
  assert.deepEqual(resolveFeaturedKnowledge(config, search).map(({ id }) => id), config.home.featuredKnowledgeIds);
});

test('navigation grouping keeps deep routes stable without duplicate active items', async () => {
  const config = await readJson('config/site-presentation.json');
  const expectations = {
    'index.html': 'home',
    'pages/game.html': 'portfolio',
    'pages/development.html': 'projects',
    'pages/engineering.html': 'projects',
    'pages/tools.html': 'projects',
    'pages/framework/cases.html': 'projects',
    'pages/journal.html': 'knowledge',
    'pages/journal/bowling.html': 'knowledge',
    'pages/blog/authoritative-time-source.html': 'knowledge',
    'pages/contact.html': 'contact',
    'pages/brand.html': 'contact'
  };
  for (const [file, expected] of Object.entries(expectations)) assert.equal(resolveNavigationId(config, file), expected, file);
});

test('generated visitor surfaces reuse the presentation contract', async () => {
  const [home, projects, portfolio, tools, navbar] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('pages/development.html', root), 'utf8'),
    readFile(new URL('pages/portfolio.html', root), 'utf8'),
    readFile(new URL('pages/tools.html', root), 'utf8'),
    readFile(new URL('components/navbar.html', root), 'utf8')
  ]);
  for (const name of ['Iris Engineering', 'SakuraGameFramework', 'Myosotis', 'Violet Shelf']) {
    assert.match(home, new RegExp(name));
    assert.match(projects, new RegExp(name));
  }
  assert.doesNotMatch(home, /按兴趣选择|<strong>2<\/strong>|最近更新/u);
  assert.match(home, /精选知识/u);
  assert.match(portfolio, /href="tools\.html"[^>]*>查看 Violet Shelf/u);
  assert.match(tools, /id="tools"[\s\S]*id="status"/u);
  assert.doesNotMatch(navbar, /profile-drawer/u);
});
