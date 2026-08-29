import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readText = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const readJson = async (relativePath) => JSON.parse(await readText(relativePath));

test('brand contract owns names, modes, assets and deprecated naming', async () => {
  const brand = await readJson('config/brand.json');

  assert.equal(brand.schemaVersion, 1);
  assert.equal(brand.id, 'iris-sakura');
  assert.equal(brand.masterBrand, 'IrisSakura');
  assert.equal(brand.jointLockup, 'IRIS × SAKURA');
  assert.deepEqual(Object.keys(brand.families), ['master', 'iris', 'sakura', 'journal', 'consumer', 'games']);
  assert.deepEqual(Object.keys(brand.modes), ['master', 'iris', 'sakura', 'journal', 'game']);
  assert.deepEqual(brand.deprecated, [
    { name: 'Sakura Design Journal', replacement: 'IrisSakura Journal' }
  ]);
  assert.deepEqual(brand.naming.forbidden, [
    'Iris Framework',
    'Sakura Engineering',
    'Sakura Project Management',
    'Iris Gameplay',
    'Sakura Workflow',
    'Iris Game'
  ]);

  for (const [mode, contract] of Object.entries(brand.modes)) {
    assert.equal(contract.id, mode);
    assert.match(contract.themeColor, /^#[0-9a-f]{6}$/i);
    assert.equal(contract.socialPalette.length, 6);
    for (const dimension of ['color', 'geometry', 'pattern', 'icon', 'density', 'motion']) {
      assert.equal(typeof contract.experience[dimension], 'string', `${mode} missing ${dimension}`);
      assert.ok(contract.experience[dimension].length > 0, `${mode} has empty ${dimension}`);
    }
  }
});

test('official vector identity and core iconography are complete and self-contained', async () => {
  const brand = await readJson('config/brand.json');
  const requiredAssetKeys = [
    'favicon', 'symbol',
    'masterLogo',
    'irisLogo',
    'sakuraLogo',
    'jointLockup',
    'masterWordmark',
    'irisWordmark',
    'sakuraWordmark',
    'iconSprite',
    'readmeHeader', 'socialLogo', 'brandBoard'
  ];
  for (const key of requiredAssetKeys) {
    const relativePath = brand.assets[key];
    assert.match(relativePath, /^assets\/[a-z0-9/._-]+\.(?:png|svg)$/);
    await access(path.join(root, relativePath));
    if (!relativePath.endsWith('.svg')) continue;
    const svg = await readText(relativePath);
    assert.match(svg, /<svg\b/);
    assert.match(svg, /<title(?:\s|>)/);
    assert.match(svg, /<desc(?:\s|>)/);
    assert.match(svg, /viewBox=/);
    assert.doesNotMatch(svg.replace('http://www.w3.org/2000/svg', ''), /https?:\/\//, `${relativePath} must not load remote assets`);
  }

  const sprite = await readText(brand.assets.iconSprite);
  const symbols = [...sprite.matchAll(/<symbol\s+id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(symbols.length, 22);
  for (const id of [
    'iris-engineering', 'iris-workflow', 'iris-pipeline', 'iris-automation',
    'iris-reliability', 'iris-verification', 'iris-project', 'iris-delivery',
    'sakura-framework', 'sakura-runtime', 'sakura-gameplay', 'sakura-module',
    'sakura-tooling', 'sakura-extension', 'sakura-composition', 'sakura-integration',
    'shared-research', 'shared-game', 'shared-evidence', 'shared-experiment',
    'shared-consumer', 'shared-architecture'
  ]) assert.ok(symbols.includes(id), `icon sprite missing ${id}`);
});

test('brand automation drives page modes, social cards, SEO and public naming', async () => {
  const [brand, generator, social, verifier, packageJson] = await Promise.all([
    readJson('config/brand.json'),
    readText('scripts/generate-site.mjs'),
    readText('scripts/lib/social-image.mjs'),
    readText('scripts/verify-brand.mjs'),
    readJson('package.json')
  ]);

  assert.deepEqual(brand.pageModes, {
    home: 'master', portfolio: 'master', engineering: 'iris', framework: 'sakura',
    journal: 'journal', brand: 'master', game: 'game', contact: 'master', system: 'master'
  });
  assert.ok(generator.includes("readJson('config/brand.json')"));
  assert.ok(generator.includes('resolvePageBrandMode'));
  assert.ok(generator.includes('brandConfig.modes[page.brandMode].themeColor'));
  assert.ok(generator.includes('writeSocialImages(root, pageDefinitions, brandConfig)'));
  assert.ok(social.includes('brand.modes[page.brandMode].socialPalette'));
  assert.ok(verifier.includes('assertPublicBrandNaming'));
  assert.ok(verifier.includes('assertBrandAssets'));
  assert.equal(packageJson.scripts['test:brand'], 'node scripts/verify-brand.mjs');
  assert.ok(packageJson.scripts.check.includes('npm run test:brand'));
});

test('mode experience layer differentiates six visual dimensions and respects game identity', async () => {
  const [css, modes, themes, navbar, footer] = await Promise.all([
    readText('style/components/brand-experience.css'),
    readText('style/tokens/modes.css'),
    readJson('data/themes.json'),
    readText('components/navbar.html'),
    readText('components/footer.html')
  ]);

  assert.ok(themes.tokenStylesheets.includes('style/components/brand-experience.css'));
  for (const mode of ['iris', 'sakura', 'journal']) {
    assert.ok(css.includes(`html[data-brand-mode="${mode}"]`), `missing ${mode} experience selector`);
  }
  for (const token of [
    '--brand-mode-card-radius', '--brand-mode-pattern-image', '--brand-mode-icon',
    '--brand-mode-density', '--brand-mode-motion-duration', '--brand-mode-motion-easing'
  ]) assert.ok(modes.includes(`${token}:`), `mode token missing ${token}`);
  assert.match(css, /html\[data-brand-mode="game"\][\s\S]*?--brand-experience-opacity:\s*0/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.ok(navbar.includes('{{masterWordmark}}'));
  assert.ok(footer.includes('{{masterWordmark}}'));
});

test('brand operating documents cover naming, voice, modes, iconography and maintenance', async () => {
  const docs = await Promise.all([
    'docs/brand/naming.md',
    'docs/brand/voice.md',
    'docs/brand/page-modes.md',
    'docs/brand/iconography.md',
    'docs/brand/maintenance.md'
  ].map(readText));
  for (const document of docs) assert.ok(document.length > 500);
  assert.match(docs[1], /Value[\s\S]*System[\s\S]*Result[\s\S]*Evidence[\s\S]*Boundary[\s\S]*Next/);
  assert.match(docs[4], /季度品牌审计/);
  assert.match(docs[4], /每月站点检查/);
});
