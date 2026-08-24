import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

const brandAssets = [
  '00_full_brand_board.png',
  '01_iris_x_sakura_header.png',
  '02_irisgameframework_brand_card.png',
  '03_iris_engineering_brand_card.png',
  '04_iris_persona.png',
  '05_sakura_persona.png',
  '06_iris_sakura_joint_emblem.png',
  '07_color_palette.png',
  '08_iconography_style.png',
  '09_naming_rule.png',
  '10_iris_character_portrait.png',
  '11_sakura_character_portrait.png'
];

test('all supplied brand sources remain local while public pages use the curated board and portraits', async () => {
  const [home, page] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('pages/art-music.html', root), 'utf8')
  ]);
  for (const asset of brandAssets) {
    await access(new URL(`assets/images/brand/${asset}`, root));
  }

  for (const asset of [
    '01_iris_x_sakura_header.png',
    '02_irisgameframework_brand_card.png',
    '03_iris_engineering_brand_card.png',
    '06_iris_sakura_joint_emblem.png'
  ]) {
    assert.ok(!home.includes(asset), `homepage still treats the cropped ${asset} slice as a standalone mark`);
  }
  for (const asset of [
    '00_full_brand_board.png',
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
  assert.ok(page.includes('BUILD · CREATE · BLOOM'));
  for (const value of ['#4C4CF5', '#7B73FF', '#A06BFF', '#FF7EB6', '#FFC1D8', '#7EC6FF']) {
    assert.ok(page.includes(value), `brand page is missing live palette value ${value}`);
  }
  assert.ok(page.includes('IRIS-*'));
  assert.ok(page.includes('SAKURA-*'));
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
    assert.ok(!page.includes('fa-gamepad'));
  }
  assert.ok(favicon.includes('IRIS × SAKURA 联合标识'));
  assert.ok(favicon.includes('#4C4CF5'));
  assert.ok(favicon.includes('#FF7EB6'));
});

test('theme palettes preserve the three-part IRIS × SAKURA wordmark instead of flattening it', async () => {
  const themeCss = await Promise.all([
    'style/iris-sakura.css',
    'style/pastoral.css',
    'style/sakura-village.css'
  ].map((path) => readFile(new URL(path, root), 'utf8')));

  for (const css of themeCss) {
    assert.doesNotMatch(css, /\.logo\s+span\s*,[\s\S]*?\.footer-logo\s+span\s*\{/u);
    assert.doesNotMatch(css, /\.footer\s+\.footer-logo\s+span\s*\{/u);
  }
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
