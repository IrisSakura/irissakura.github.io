import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, root), 'utf8'));
}

test('public profile data owns the homepage identity and a local avatar', async () => {
  const site = await readJson('data/site.json');

  assert.ok(site.profile, 'site profile registry must exist');
  assert.deepEqual(Object.keys(site.profile).sort(), [
    'avatar',
    'avatarAlt',
    'introduction',
    'nickname',
    'role'
  ]);
  assert.equal(site.profile.nickname, 'IrisSakura');
  assert.equal(site.profile.role, '独立游戏开发者与游戏系统设计者');
  assert.ok(site.profile.introduction.length >= 30);
  assert.match(site.profile.introduction, /做游戏/u);
  assert.match(site.profile.introduction, /文章/u);
  assert.match(site.profile.avatar, /^assets\/images\/profile\/.+\.jpe?g$/iu);
  assert.ok(site.profile.avatarAlt.includes('IrisSakura'));
  await access(new URL(site.profile.avatar, root));
});

test('the single brand owns one local homepage hero image', async () => {
  const brand = await readJson('data/themes.json');
  assert.equal(brand.id, 'iris-sakura');
  assert.equal(brand.label, 'IRIS × SAKURA');
  assert.equal(brand.stylesheet, 'style/iris-sakura.css');
  assert.equal(brand.homeHeroImage, 'assets/images/profile/home-hero-iris-sakura.png');
  assert.match(brand.homeHeroPosition, /^\d+(?:\.\d+)?% \d+(?:\.\d+)?%$/u);
  await access(new URL(brand.homeHeroImage, root));
});

test('generated pages load one static brand without theme controls or bootstrap code', async () => {
  const brand = await readJson('data/themes.json');
  const pages = [
    { path: 'index.html', prefix: '' },
    { path: 'pages/development.html', prefix: '../' },
    { path: 'pages/framework.html', prefix: '../' }
  ];

  for (const page of pages) {
    const html = await readFile(new URL(page.path, root), 'utf8');
    assert.ok(html.includes('data-brand="iris-sakura"'));
    assert.ok(html.includes(`href="${page.prefix}${brand.stylesheet}"`));
    assert.ok(
      html.includes(`--home-hero-image: url('/${brand.homeHeroImage}')`),
      `${page.path} must use a root-relative hero URL so CSS consumption cannot resolve under /style/`
    );
    for (const forbidden of ['theme-select', 'theme-bootstrap', 'data-theme-stylesheet', 'localStorage']) {
      assert.ok(!html.includes(forbidden), `${page.path} still contains ${forbidden}`);
    }
  }
});

test('shared navigation exposes one six-route menu and a direct profile link at every depth', async () => {
  const site = await readJson('data/site.json');
  const pages = [
    { path: 'index.html', prefix: '' },
    { path: 'pages/framework.html', prefix: '../' }
  ];
  const routeTargets = [
    'index.html',
    'pages/portfolio.html',
    'pages/mods.html',
    'pages/development.html',
    'pages/journal.html',
    'pages/contact.html'
  ];

  for (const page of pages) {
    const html = await readFile(new URL(page.path, root), 'utf8');
    const navbar = html.match(/<nav class="navbar"[\s\S]*?<\/nav>/u)?.[0] ?? '';
    assert.ok(navbar.includes('class="nav-profile-link"'));
    assert.ok(navbar.includes('aria-label="关于与联系"'));
    assert.ok(navbar.includes(`${page.prefix}${site.profile.avatar}`));
    assert.equal((navbar.match(/class="nav-link(?: active)?"/g) ?? []).length, routeTargets.length);
    assert.ok(!html.includes('profile-drawer'));
    for (const target of routeTargets) {
      assert.ok(html.includes(`href="${page.prefix}${target}"`), `${page.path} missing ${target}`);
    }
  }
});

test('homepage follows the approved living sections and exposes real articles', async () => {
  const [site, config, home] = await Promise.all([readJson('data/site.json'), readJson('config/site-presentation.json'), readFile(new URL('index.html', root), 'utf8')]);
  let previous = -1;
  for (const id of config.home.sectionOrder) {
    const offset = home.indexOf(`id="${id}"`);
    assert.ok(offset > previous, `${id} must exist in the configured order`);
    previous = offset;
  }
  assert.ok(home.includes(site.profile.nickname));
  assert.ok(home.includes(site.profile.introduction));
  assert.ok(home.includes(`src="${site.profile.avatar}"`));
  assert.equal((home.match(/class="project-entry-card /g) ?? []).length, 0);
  assert.match(home, /class="ecosystem-bridge"/u);
  assert.match(home, /id="live"/u);
  assert.equal((home.match(/class="writing-entry"/g) ?? []).length, 3);
  assert.match(home, /href="pages\/now.html"/u);
  assert.doesNotMatch(home, /精选知识|工程控制面|显式授权|LATEST CONSUMER/u);
});
