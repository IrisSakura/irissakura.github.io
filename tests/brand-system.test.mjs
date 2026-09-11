import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { cp, mkdtemp, readFile as readBytes, rm, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { verifyBrandAssets } from '../scripts/verify-brand-assets-v1.mjs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');

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

test('all curated brand sources remain local while the independent Brand page uses the recommended editorial slices', async () => {
  const [home, page] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('pages/brand.html', root), 'utf8')
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
  for (const asset of ['00_full_brand_board.png', '01_iris_x_sakura_header.png']) {
    assert.ok(page.includes(`../assets/images/brand/${asset}`), `brand page is missing curated ${asset}`);
  }
  assert.match(page, /历史 V3 完整品牌总板/u);
  for (const asset of ['b01-overview.png', 'b02-master.png']) {
    assert.ok(page.includes(`../assets/images/brand/v1/${asset}`), `brand page is missing distinct ${asset} reference`);
  }
  assert.match(page, /B01 品牌参考板 · 嵌入文案为历史设计材料/u);
  assert.match(page, /B02 品牌参考板 · 嵌入文案为历史设计材料/u);
  for (const asset of [
    'c01-iris.png',
    'c02-sakura.png',
    'c03-myosotis.png',
    'c04-violet.png'
  ]) {
    assert.ok(page.includes(`../assets/images/brand/v1/${asset}`), `brand page is missing v1 persona board ${asset}`);
  }
});

test('asset verifier fails closed from a fresh fixture for provenance, path, PNG and SVG attacks', async () => {
  const freshFixture = async () => {
    const fixture = await mkdtemp(path.join(os.tmpdir(), 'brand-assets-'));
    await cp(new URL('config', root), path.join(fixture, 'config'), { recursive: true });
    await cp(new URL('assets', root), path.join(fixture, 'assets'), { recursive: true });
    await verifyBrandAssets(fixture);
    return fixture;
  };
  const rejectFromFreshFixture = async (mutate, expected) => {
    const fixture = await freshFixture();
    try {
      await mutate(fixture);
      await assert.rejects(() => verifyBrandAssets(fixture), expected);
    } finally {
      await rm(fixture, { recursive: true, force: true });
    }
  };
  const manifestAt = (fixture) => path.join(fixture, 'config/brand-assets-v1.json');
  const updateManifest = async (fixture, mutate) => {
    const manifestPath = manifestAt(fixture);
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    mutate(manifest);
    await writeFile(manifestPath, JSON.stringify(manifest));
  };
  const hashBytes = (value) => createHash('sha256').update(value).digest('hex');
  const crc32 = (bytes) => {
    let value = 0xffffffff;
    for (const byte of bytes) {
      value ^= byte;
      for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    return (value ^ 0xffffffff) >>> 0;
  };

  await rejectFromFreshFixture((fixture) => updateManifest(fixture, (manifest) => { manifest.assets[0].sha256 = '0'.repeat(64); }), /hash does not match/u);
  await rejectFromFreshFixture(async (fixture) => {
    const file = path.join(fixture, 'assets/images/brand/v1/b01-overview.png');
    const bytes = await readBytes(file); bytes[0] = 0; await writeFile(file, bytes);
    await updateManifest(fixture, (manifest) => { manifest.assets[0].sha256 = hashBytes(bytes); manifest.boards.B01 = manifest.assets[0].sha256; });
  }, /invalid PNG signature/u);
  await rejectFromFreshFixture(async (fixture) => {
    const file = path.join(fixture, 'assets/images/brand/v1/b01-overview.png');
    const bytes = await readBytes(file); bytes.writeUInt32BE(1, 16); bytes.writeUInt32BE(crc32(bytes.subarray(12, 29)), 29); await writeFile(file, bytes);
    await updateManifest(fixture, (manifest) => { manifest.assets[0].sha256 = hashBytes(bytes); manifest.boards.B01 = manifest.assets[0].sha256; });
  }, /dimensions do not match/u);
  await rejectFromFreshFixture(async (fixture) => {
    const file = path.join(fixture, 'assets/images/brand/v1/b01-overview.png');
    const fake = Buffer.alloc(24); Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(fake); fake.writeUInt32BE(1, 16); fake.writeUInt32BE(1, 20); await writeFile(file, fake);
    await updateManifest(fixture, (manifest) => { manifest.assets[0].sha256 = hashBytes(fake); manifest.assets[0].dimensions = '1x1'; manifest.boards.B01 = manifest.assets[0].sha256; });
  }, /invalid PNG signature/u);
  await rejectFromFreshFixture((fixture) => updateManifest(fixture, (manifest) => { manifest.assets[0].source = '01_original_cut_package/../escape.png'; }), /must not traverse/u);
  await rejectFromFreshFixture((fixture) => updateManifest(fixture, (manifest) => { manifest.assets[0].source = '/absolute.png'; }), /safe relative path/u);
  await rejectFromFreshFixture((fixture) => updateManifest(fixture, (manifest) => { manifest.assets[0].source = '01_original_cut_package\\escape.png'; }), /safe relative path/u);
  await rejectFromFreshFixture((fixture) => updateManifest(fixture, (manifest) => { manifest.assets[0].output = 'outside.png'; }), /closed output set/u);
  await rejectFromFreshFixture((fixture) => updateManifest(fixture, (manifest) => { manifest.assets[1].output = manifest.assets[0].output; }), /duplicate asset output/u);
  await rejectFromFreshFixture((fixture) => updateManifest(fixture, (manifest) => { manifest.assets.splice(0, 1); }), /exactly fourteen/u);
  await rejectFromFreshFixture((fixture) => unlink(path.join(fixture, 'assets/images/brand/v1/b01-overview.png')), /ENOENT/u);
  await rejectFromFreshFixture((fixture) => updateManifest(fixture, (manifest) => { manifest.svgDerivations.myosotis[0].disclosure = ''; }), /reference and reconstruction disclosure/u);
  await rejectFromFreshFixture((fixture) => unlink(path.join(fixture, 'assets/brand/logo-myosotis.svg')), /ENOENT/u);

  const unsafeSvg = (fragment) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><title>x</title><desc>x</desc>${fragment}</svg>`;
  const writeUnsafeSvg = async (fixture, fragment) => {
    const text = unsafeSvg(fragment);
    await writeFile(path.join(fixture, 'assets/brand/logo-myosotis.svg'), text);
    await updateManifest(fixture, (manifest) => { manifest.svgDerivations.myosotis[0].sha256 = hashBytes(text); });
  };
  await rejectFromFreshFixture((fixture) => writeUnsafeSvg(fixture, '<script/>'), /executable or external CSS/u);
  await rejectFromFreshFixture((fixture) => writeUnsafeSvg(fixture, '<path onclick="x()"/>'), /event handler/u);
  await rejectFromFreshFixture((fixture) => writeUnsafeSvg(fixture, '<use href="https://example.test/a.svg#x"/>'), /non-local href/u);
  await rejectFromFreshFixture((fixture) => writeUnsafeSvg(fixture, '<path fill="url(https://example.test/a.svg#x)"/>'), /non-local URL reference/u);
  await rejectFromFreshFixture((fixture) => writeUnsafeSvg(fixture, String.raw`<path fill="u\72l(file:///private/x)"/>`), /non-local URL reference/u);
  await rejectFromFreshFixture((fixture) => writeUnsafeSvg(fixture, '<style>@IMPORT url(https://example.test/x.css);</style>'), /executable or external CSS/u);
  await rejectFromFreshFixture((fixture) => writeUnsafeSvg(fixture, '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///private/x">]><path/>'), /XML entity or stylesheet/u);
});

test('generated current product surfaces use aliases while source records and controlled body remain stable', async () => {
  const [portfolio, detail, projects, controlled] = await Promise.all([
    read('pages/portfolio.html'), read('pages/journal/alchemy-magical-crafting.html'), read('data/projects.json'), readBytes(new URL('docs/brand/master-design-v1.md', root))
  ]);
  assert.match(portfolio, /<h2>Violet Shelf<\/h2>/); assert.match(portfolio, /<h2>Myosotis<\/h2>/); assert.match(portfolio, /aria-label="Violet Shelf 项目状态"/); assert.doesNotMatch(portfolio, /Iris Shelf 项目状态/); assert.match(portfolio, /Myosotis 保存判断/);
  assert.match(detail, /<title>.* \| Myosotis<\/title>/); assert.match(projects, /"Iris Shelf"/); assert.match(projects, /"IrisSakura Journal"/);
  const body = controlled.toString('utf8').match(/<!-- source-body:start -->\n([\s\S]*?)\n<!-- source-body:end -->/)?.[1]; assert.ok(body); const source = Buffer.from(`${body}\n`); assert.equal(source.byteLength, 48928); assert.match(controlled.toString('utf8'), /当前授权桌面运行时为 Electron/);
  assert.equal(createHash('sha256').update(source).digest('hex'), '9e2ba53b981ac4915acd8de4c8b96bb10ef63d4c490182ae490e8836b0c8a4c0');
});

test('creator surfaces use IrisSakura while the joint label is scoped to the Iris–Sakura cooperation mark', async () => {
  const [header, navbar, brandPage] = await Promise.all([read('assets/brand/readme-header.svg'), read('components/navbar.html'), read('pages/brand.html')]);
  assert.match(header, />IrisSakura<\/text>/u);
  assert.match(header, /CREATOR IDENTITY · INDEPENDENT PROJECTS/u);
  assert.doesNotMatch(header, />IRIS × SAKURA<\/text>/u);
  assert.doesNotMatch(navbar, /IRIS × SAKURA/u);
  assert.match(brandPage, /IRIS × SAKURA 仅表达这两者的直接合作/u);
});

test('Violet Shelf tools explain only implemented local operations with truthful public routes and local-source boundaries', async () => {
  const [tools, styles] = await Promise.all([read('pages/tools.html'), read('style/tools.css')]);
  for (const operation of [
    '创建或导入版本化卡牌文档', '选择一个资源目录，为内容条目关联图片、音频或文档',
    '只读导入用户选定的 JSON／CSV', '精确无放回抽取概率',
    '预览、暂停、重置并拖动矩形或精确资源图片', '报告缺失、空值、重复与不支持语法'
  ]) assert.ok(tools.includes(operation), `tools page is missing implemented operation: ${operation}`);
  for (const href of ['portfolio.html#project-iris-shelf', 'brand.html']) {
    assert.ok(tools.includes(`href="${href}"`), `tools page is missing truthful public route: ${href}`);
  }
  assert.match(tools, /不提供在线使用、公开下载、签名或发布承诺/u);
  assert.match(tools, /历史来源快照/u);
  assert.doesNotMatch(tools, /docs\/product\//u);
  assert.doesNotMatch(tools, /github\.com\/IrisSakura\/IrisShelf/u);
  assert.doesNotMatch(tools, /href="\.\.\/README\.md"/u);
  assert.match(styles, /\.tools-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,/u);
  assert.match(styles, /\.tools-status\s*\{[\s\S]*?grid-template-columns:/u);
});

test('brand portfolio is public, indexable and generator-owned', async () => {
  const [page, generator, sitemap] = await Promise.all([
    readFile(new URL('pages/brand.html', root), 'utf8'),
    readFile(new URL('scripts/generate-site.mjs', root), 'utf8'),
    readFile(new URL('sitemap.xml', root), 'utf8')
  ]);

  assert.ok(page.includes('id="brand-system"'));
  assert.ok(page.includes('<!-- brand-content:start -->'));
  assert.ok(page.includes('<title>IrisSakura Brand System | IrisSakura</title>'));
  assert.ok(!page.includes('name="robots" content="noindex'));
  assert.match(generator, /title:\s*'IrisSakura Brand System \| IrisSakura'/u);
  assert.match(generator, /replaceGeneratedBlock\(html, 'brand-content', renderBrandContent\(brandConfig\)\)/u);
  assert.match(generator, /function renderBrandContent\(brand\)/u);
  assert.ok(sitemap.includes('/pages/brand.html'));
  assert.ok(!sitemap.includes('/pages/art-music.html'));
});

test('brand story is expressed as live dual tracks, convergence, palette and naming rules', async () => {
  const page = await readFile(new URL('pages/brand.html', root), 'utf8');

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
    readFile(new URL('pages/brand.html', root), 'utf8'),
    readFile(new URL('assets/favicon.svg', root), 'utf8')
  ]);

  for (const page of [home, brandPage]) {
    assert.ok(page.includes('class="brand-wordmark"'));
    assert.ok(page.includes('class="brand-mark"'));
    assert.ok(page.includes('BUILD · ORGANIZE · BLOOM'));
    assert.ok(page.includes('Iris Engineering'));
    assert.ok(page.includes('SakuraGameFramework'));
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

test('visitor homepage stays editorial while the dedicated Brand page owns contrast composition', async () => {
  const [home, brandPage] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('pages/brand.html', root), 'utf8')
  ]);
  const combined = `${home}\n${brandPage}`;
  const governed = combined.match(/data-brand-layout="(?:contrast|editorial)"/g) ?? [];
  const contrast = combined.match(/data-brand-layout="contrast"/g) ?? [];
  assert.equal(governed.length, 9);
  assert.equal(contrast.length, 2);
  assert.equal((home.match(/data-brand-layout="contrast"/g) ?? []).length, 0);
  assert.equal((brandPage.match(/data-brand-layout="contrast"/g) ?? []).length, 2);
});

test('brand architecture is frozen as a maintained repository contract', async () => {
  const document = await readFile(new URL('docs/brand/brand-architecture.md', root), 'utf8');

  for (const marker of [
    'IrisSakura',
    'Iris Engineering',
    'Sakura Framework',
    'IrisSakura Journal',
    'Consumer Lab',
    'IRIS × SAKURA',
    'Sakura Design Journal',
    'Deprecated'
  ]) {
    assert.ok(document.includes(marker), `brand architecture is missing ${marker}`);
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

test('homepage leaves brand-system detail to the dedicated secondary route', async () => {
  const [site, home, brandPage, generator] = await Promise.all([
    readFile(new URL('data/site.json', root), 'utf8').then(JSON.parse),
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('pages/brand.html', root), 'utf8'),
    readFile(new URL('scripts/generate-site.mjs', root), 'utf8')
  ]);

  assert.equal('brandProof' in site, false);
  assert.equal((home.match(/data-brand-proof=/g) ?? []).length, 0);
  assert.ok(!home.includes('BRAND PROMISE → PRODUCT PROOF'));
  assert.ok(brandPage.includes('id="brand-system"'));
  assert.ok(brandPage.includes('IrisSakura Brand System'));
  assert.ok(home.includes('href="pages/brand.html"'));
  assert.ok(home.includes('品牌与视觉资料'));
  assert.doesNotMatch(generator, /assertBrandProof/u);
});
