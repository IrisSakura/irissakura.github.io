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
  assert.equal(site.profile.role, '可验证的 Unity 游戏系统开发者');
  assert.ok(site.profile.introduction.length >= 30);
  assert.match(site.profile.introduction, /Iris Engineering/u);
  assert.match(site.profile.introduction, /Sakura Framework/u);
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

test('shared navigation exposes the profile avatar and six real quick routes at every depth', async () => {
  const site = await readJson('data/site.json');
  const pages = [
    { path: 'index.html', prefix: '' },
    { path: 'pages/framework.html', prefix: '../' }
  ];
  const routeTargets = [
    'pages/game.html',
    'pages/engineering.html',
    'pages/framework.html',
    'pages/journal.html',
    'pages/portfolio.html#consumer-lab',
    'pages/contact.html'
  ];

  for (const page of pages) {
    const html = await readFile(new URL(page.path, root), 'utf8');
    const navbar = html.match(/<nav class="navbar"[\s\S]*?<\/nav>/u)?.[0] ?? '';
    assert.ok(navbar.includes('class="profile-drawer-trigger"'));
    assert.ok(navbar.includes('aria-controls="profile-drawer"'));
    assert.ok(navbar.includes('aria-expanded="false"'));
    assert.ok(navbar.includes(`${page.prefix}${site.profile.avatar}`));
    assert.ok(navbar.indexOf('profile-drawer-trigger') < navbar.indexOf('class="logo"'));

    assert.ok(html.includes('id="profile-drawer"'));
    assert.ok(html.includes('role="dialog"'));
    assert.ok(html.includes('aria-modal="true"'));
    assert.equal((html.match(/data-profile-quick-link/g) ?? []).length, routeTargets.length);
    for (const target of routeTargets) {
      assert.ok(html.includes(`href="${page.prefix}${target}"`), `${page.path} missing ${target}`);
    }
  }
});

test('homepage presents identity, flagship work and four secondary focus areas in order', async () => {
  const [site, home] = await Promise.all([
    readJson('data/site.json'),
    readFile(new URL('index.html', root), 'utf8')
  ]);

  const profileOffset = home.indexOf('id="profile"');
  const brandOffset = home.indexOf('class="brand-ecosystem-section"');
  const flagshipOffset = home.indexOf('class="flagship-section"');
  const focusOffset = home.indexOf('class="focus-section"');
  const researchOffset = home.indexOf('class="research-section"');
  const contactOffset = home.indexOf('class="public-cta"');
  assert.ok(profileOffset >= 0, 'homepage profile must exist');
  assert.ok(flagshipOffset > profileOffset, 'flagship must immediately follow the profile hierarchy');
  assert.ok(brandOffset > flagshipOffset, 'brand ecosystem must support, not precede, the flagship');
  assert.ok(focusOffset > brandOffset, 'secondary focus areas must follow the brand signature');
  assert.ok(researchOffset > focusOffset, 'selected research must follow focus areas');
  assert.ok(contactOffset > researchOffset, 'contact CTA must close the homepage');

  assert.ok(home.includes(site.profile.nickname));
  assert.ok(home.includes(site.profile.role));
  assert.ok(home.includes(site.profile.introduction));
  assert.ok(home.includes(`src="${site.profile.avatar}"`));
  assert.equal((home.match(/data-home-focus/g) ?? []).length, 4);
  for (const label of ['Iris Engineering', 'Sakura Framework', 'Sakura Design Journal', 'Consumer Lab']) {
    assert.ok(home.includes(label), `homepage focus areas are missing ${label}`);
  }
  assert.ok(home.includes('class="brand-lockup'));
  assert.equal((home.match(/data-home-brand-branch/g) ?? []).length, 2);
  assert.ok(home.includes('BUILD · ORGANIZE · BLOOM'));
  assert.ok(home.includes('Engineering &amp; Project Management'));
  assert.ok(home.includes('Game Framework'));
  for (const obsoleteClass of ['evidence-strip', 'case-section', 'method-section']) {
    assert.ok(!home.includes(`class="${obsoleteClass}"`), `homepage still renders ${obsoleteClass}`);
  }
});
