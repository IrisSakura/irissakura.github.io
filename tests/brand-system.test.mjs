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

test('all supplied brand slices are local and presented by the brand portfolio', async () => {
  const page = await readFile(new URL('pages/art-music.html', root), 'utf8');

  for (const asset of brandAssets) {
    await access(new URL(`assets/images/brand/${asset}`, root));
    assert.ok(page.includes(`../assets/images/brand/${asset}`), `brand page is missing ${asset}`);
  }
});

test('brand portfolio is public, indexable and generator-owned', async () => {
  const [page, generator, sitemap] = await Promise.all([
    readFile(new URL('pages/art-music.html', root), 'utf8'),
    readFile(new URL('scripts/generate-site.mjs', root), 'utf8'),
    readFile(new URL('sitemap.xml', root), 'utf8')
  ]);

  assert.ok(page.includes('id="brand-system"'));
  assert.ok(page.includes('<title>品牌视觉与创作 | IrisSakura</title>'));
  assert.ok(!page.includes('name="robots" content="noindex'));
  assert.match(generator, /title:\s*'品牌视觉与创作 \| IrisSakura'/u);
  assert.ok(sitemap.includes('/pages/art-music.html'));
});
