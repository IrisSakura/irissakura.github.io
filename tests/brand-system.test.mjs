import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

const brandAssets = [
  '00_full_brand_board.png',
  '01_iris_x_sakura_header.png',
  '02_iris_engineering_brand_card.png',
  '03_sakura_game_framework_brand_card.png',
  '04_iris_persona_engineering_project_management.png',
  '05_sakura_persona_game_framework.png',
  '06_iris_sakura_joint_emblem.png',
  '07_color_palette.png',
  '08_iconography_style.png',
  '09_naming_rule.png',
  '10_iris_character_portrait.png',
  '11_sakura_character_portrait.png'
];

test('all v3 brand sources remain local while public pages use the recommended editorial slices', async () => {
  const [home, page] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('pages/art-music.html', root), 'utf8')
  ]);
  for (const asset of brandAssets) {
    await access(new URL(`assets/images/brand/${asset}`, root));
  }

  for (const asset of [
    '02_iris_engineering_brand_card.png',
    '03_sakura_game_framework_brand_card.png',
    '06_iris_sakura_joint_emblem.png'
  ]) {
    assert.ok(!home.includes(asset), `homepage still treats the cropped ${asset} slice as a standalone mark`);
  }
  for (const asset of [
    '00_full_brand_board.png',
    '01_iris_x_sakura_header.png',
    '10_iris_character_portrait.png',
    '11_sakura_character_portrait.png'
  ]) {
    assert.ok(page.includes(`../assets/images/brand/${asset}`), `brand page is missing curated ${asset}`);
  }
});

test('brand portfolio is public, indexable and generator-owned', async () => {
  const [page, generator, sitemap] = await Promise.all([
    readFile(new URL('pages/art-music.html', root), 'utf8'),
    readFile(new URL('scripts/generate-site.mjs', root), 'utf8'),
    readFile(new URL('sitemap.xml', root), 'utf8')
  ]);

  assert.ok(page.includes('id="brand-system"'));
  assert.ok(page.includes('<!-- brand-content:start -->'));
  assert.ok(page.includes('<title>品牌视觉与创作 | IrisSakura</title>'));
  assert.ok(!page.includes('name="robots" content="noindex'));
  assert.match(generator, /title:\s*'品牌视觉与创作 \| IrisSakura'/u);
  assert.match(generator, /replaceGeneratedBlock\(html, 'brand-content', renderBrandContent\(\)\)/u);
  assert.match(generator, /function renderBrandContent\(\)/u);
  assert.ok(sitemap.includes('/pages/art-music.html'));
});

test('brand story is expressed as live dual tracks, convergence, palette and naming rules', async () => {
  const page = await readFile(new URL('pages/art-music.html', root), 'utf8');

  assert.ok(page.includes('class="brand-lockup'));
  assert.equal((page.match(/data-brand-branch=/g) ?? []).length, 2);
  assert.ok(page.includes('data-brand-branch="iris"'));
  assert.ok(page.includes('data-brand-branch="sakura"'));
  assert.ok(page.includes('data-brand-convergence'));
  assert.ok(page.includes('BUILD · ORGANIZE · BLOOM'));
  for (const value of ['#4C3DF5', '#7B73FF', '#A06BFF', '#FF7EB6', '#FFC1D8', '#7EC6FF']) {
    assert.ok(page.includes(value), `brand page is missing live palette value ${value}`);
  }
  assert.ok(page.includes('IRIS-*'));
  assert.ok(page.includes('SAKURA-*'));
  for (const marker of [
    'ENGINEER · MANAGE · DELIVER',
    'FRAME · POWER · EXTEND',
    'Engineering &amp; Project Management',
    'SakuraGameFramework',
    'Game Framework / Modules / Runtime / Tooling'
  ]) {
    assert.ok(page.includes(marker), `brand page is missing v3 ownership marker ${marker}`);
  }
  assert.doesNotMatch(page, /IRIS \/ FRAMEWORK|Games &amp; Experiences|Worlds &amp; IP|CREATE · INSPIRE · CONNECT/u);
});

test('generated public shell uses one joint brand mark without the retired gamepad identity', async () => {
  const [home, brandPage, favicon] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('pages/art-music.html', root), 'utf8'),
    readFile(new URL('assets/favicon.svg', root), 'utf8')
  ]);

  for (const page of [home, brandPage]) {
    assert.ok(page.includes('class="brand-wordmark"'));
    assert.ok(page.includes('class="brand-mark"'));
    assert.ok(page.includes('BUILD · ORGANIZE · BLOOM'));
    assert.ok(page.includes('Iris Engineering'));
    assert.ok(page.includes('Sakura Framework'));
    assert.ok(!page.includes('BUILD · CREATE · BLOOM'));
    assert.ok(!page.includes('fa-gamepad'));
  }
  assert.ok(favicon.includes('IRIS × SAKURA 联合标识'));
  assert.ok(favicon.includes('#4C3DF5'));
  assert.ok(favicon.includes('#FF7EB6'));
});

test('the single brand palette preserves the three-part wordmark', async () => {
  const css = await readFile(new URL('style/iris-sakura.css', root), 'utf8');
  assert.doesNotMatch(css, /\.logo\s+span\s*,[\s\S]*?\.footer-logo\s+span\s*\{/u);
  assert.doesNotMatch(css, /\.footer\s+\.footer-logo\s+span\s*\{/u);
});

test('IRIS/Sakura contrast composition is exactly three of ten governed story sections', async () => {
  const [home, brandPage] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('pages/art-music.html', root), 'utf8')
  ]);
  const combined = `${home}\n${brandPage}`;
  const governed = combined.match(/data-brand-layout="(?:contrast|editorial)"/g) ?? [];
  const contrast = combined.match(/data-brand-layout="contrast"/g) ?? [];
  assert.equal(governed.length, 10);
  assert.equal(contrast.length, 3);
  assert.equal(contrast.length / governed.length, 0.3);
});

test('shared cards carry one restrained IRIS-to-SAKURA signature across page types', async () => {
  const css = await readFile(new URL('style/main.css', root), 'utf8');

  for (const selector of [
    '.project-card',
    '.blog-card',
    '.stream-card',
    '.design-summary-card',
    '.game-system-card',
    '.research-row',
    '.evidence-chain-card'
  ]) {
    assert.ok(css.includes(selector), `shared brand signature is missing ${selector}`);
  }
  assert.ok(css.includes('Cross-page IRIS × SAKURA signature'));
  assert.ok(css.includes('linear-gradient(90deg, var(--brand-iris), var(--brand-shared), var(--brand-sakura))'));
});

test('homepage turns the brand promise into a data-owned product proof rail', async () => {
  const [site, home, generator, css] = await Promise.all([
    readFile(new URL('data/site.json', root), 'utf8').then(JSON.parse),
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('scripts/generate-site.mjs', root), 'utf8'),
    readFile(new URL('style/main.css', root), 'utf8')
  ]);

  assert.deepEqual(site.brandProof.items.map((item) => item.id), ['iris', 'sakura', 'outcome']);
  assert.equal((home.match(/data-brand-proof=/g) ?? []).length, 3);
  for (const marker of [
    'BRAND PROMISE → PRODUCT PROOF',
    'Engineer · Manage · Deliver',
    'Observe → Authorize → Execute → Verify',
    'Frame · Power · Extend',
    'Profiles → Packages → Verification',
    'Research → System → Playable Work'
  ]) {
    assert.ok(home.includes(marker), `homepage is missing brand proof marker ${marker}`);
  }
  assert.match(generator, /assertBrandProof\(site\)/u);
  assert.ok(css.includes('.brand-proof-grid'));
});
