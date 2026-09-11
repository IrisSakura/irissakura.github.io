import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');
const mainPages = ['index.html', ...['development', 'portfolio', 'engineering', 'framework', 'journal', 'tools', 'brand', 'contact'].map((name) => `pages/${name}.html`)];

test('both project heroes use the shared fixed-navigation content offset', async () => {
  for (const [file, specificClass] of [['pages/tools.html', 'tools-main'], ['pages/journal.html', 'journal-main']]) {
    const html = await read(file);
    const main = html.match(/<main\b[^>]*id="main-content"[^>]*>/u)?.[0] ?? '';
    const classes = main.match(/class="([^"]*)"/u)?.[1].split(/\s+/u) ?? [];
    assert.ok(classes.includes('main-content'), `${file} omits the shared navigation offset`);
    assert.ok(classes.includes(specificClass), `${file} loses its page-specific styling`);
  }
});

test('visitor surfaces and metadata do not repeat rejected maintenance explanations', async () => {
  const rejected = [
    'Source-push Repository', '这里展示的是架构方向与已公开证据', '不替代 Gitea 权威仓库',
    '历史 V3', '嵌入文案', '历史来源快照', '查看历史证据与限制',
    '不构成下载、平台支持或发布状态声明', '不提供在线使用、公开下载、签名或发布承诺',
    '不在此页宣称下载', '不把网站包装成在线版工作区', '保留稳定 Journal 路由',
    'VERIFIED PUBLIC ROUTE', '证据展示、限制披露', '按原 Generation 重跑',
    '当前没有自动续作的活动工作', '公开展示只描述已实现的本地产品边界',
    '索引只包含已公开的标题、摘要与分类'
  ];
  for (const file of mainPages) {
    const html = await read(file);
    for (const text of rejected) assert.ok(!html.includes(text), `${file} still publishes: ${text}`);
  }
});

test('brand page presents four current project identities and their characters', async () => {
  const html = await read('pages/brand.html');
  for (const name of ['iris', 'sakura', 'myosotis', 'violet']) {
    assert.ok(html.includes(`assets/images/brand/v1/character-${name}.png`), `missing current ${name} character`);
  }
  for (const route of ['engineering', 'framework', 'journal', 'tools']) {
    assert.ok(html.includes(`href="${route}.html"`), `missing project route ${route}`);
  }
  assert.doesNotMatch(html, /00_full_brand_board\.png|01_iris_x_sakura_header\.png|两套命名家族/u);
});

test('Violet presents useful capabilities without the retired technology snapshot', async () => {
  const tools = await read('pages/tools.html');
  assert.match(tools, /暂未开放下载/u);
  assert.doesNotMatch(tools, /Tauri|Generation|CURRENT LOCAL CANDIDATE/u);
  const portfolio = await read('pages/portfolio.html');
  const shelf = portfolio.match(/<article\b[^>]*id="project-iris-shelf"[\s\S]*?<\/article>/u)?.[0];
  assert.ok(shelf);
  assert.match(shelf, /href="tools\.html"/u);
  assert.doesNotMatch(shelf, /Tauri|Companion interop|UNSIGNED UNIVERSAL/u);
});
