import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('brand contract and generator own a closed five-mode page contract', async () => {
  const [site, brand, theme, generator] = await Promise.all([
    readText('data/site.json').then(JSON.parse),
    readText('config/brand.json').then(JSON.parse),
    readText('data/themes.json').then(JSON.parse),
    readText('scripts/generate-site.mjs')
  ]);

  assert.equal(site.pages, undefined);
  assert.deepEqual(brand.pageModes, {
    home: 'master',
    portfolio: 'master',
    engineering: 'iris',
    framework: 'sakura',
    journal: 'journal',
    brand: 'master',
    game: 'game',
    contact: 'master',
    system: 'master'
  });
  assert.deepEqual(theme.tokenStylesheets, [
    'style/tokens/primitive.css',
    'style/tokens/semantic.css',
    'style/tokens/modes.css',
    'style/components/brand-experience.css'
  ]);
  assert.ok(generator.includes('const BRAND_MODES = new Set(BRAND_MODE_IDS)'));
  assert.ok(generator.includes('data-brand-mode="${brandMode}"'));
  assert.ok(generator.includes("brandModeKey: 'game'"));
});

test('primitive semantic and mode styles form a one-way token chain', async () => {
  const [primitive, semantic, modes, main, brand] = await Promise.all([
    readText('style/tokens/primitive.css'),
    readText('style/tokens/semantic.css'),
    readText('style/tokens/modes.css'),
    readText('style/main.css'),
    readText('style/iris-sakura.css')
  ]);

  for (const token of [
    '--brand-iris-500',
    '--brand-sakura-500',
    '--brand-shared-500',
    '--neutral-000',
    '--neutral-900'
  ]) {
    assert.ok(primitive.includes(`${token}:`), `primitive token missing ${token}`);
  }
  for (const token of [
    '--color-background',
    '--color-surface',
    '--color-text-primary',
    '--color-text-secondary',
    '--color-action-primary',
    '--color-brand-highlight'
  ]) {
    assert.ok(semantic.includes(`${token}:`), `semantic token missing ${token}`);
  }
  for (const mode of ['master', 'iris', 'sakura', 'journal', 'game']) {
    assert.ok(modes.includes(`html[data-brand-mode="${mode}"]`), `mode token block missing ${mode}`);
  }
  for (const token of [
    '--brand-mode-accent',
    '--brand-mode-hero-background',
    '--brand-mode-hero-text',
    '--brand-mode-hero-muted'
  ]) {
    assert.ok(modes.includes(`${token}:`), `mode contract missing ${token}`);
  }

  for (const literal of ['#6a11cb', '#2575fc', '#ff4081', '#4c3df5', '#ff7eb6', '#a06bff']) {
    assert.ok(!main.toLowerCase().includes(literal), `shared component source still owns brand literal ${literal}`);
  }
  assert.match(
    main,
    /html\[data-brand="iris-sakura"\] \[data-page-cover\]\.page-cover\s*\{[^}]*background-image:\s*var\(--brand-mode-hero-background\)/s
  );
  assert.ok(brand.includes('--primary-color: var(--color-action-primary)'));
  assert.ok(brand.includes('--accent-color: var(--color-brand-highlight)'));
});

test('generated routes receive the correct mode and shared token styles', async () => {
  const expectations = new Map([
    ['index.html', 'master'],
    ['pages/portfolio.html', 'master'],
    ['pages/brand.html', 'master'],
    ['pages/contact.html', 'master'],
    ['pages/engineering.html', 'iris'],
    ['pages/framework.html', 'sakura'],
    ['pages/framework-quickstart.html', 'sakura'],
    ['pages/journal.html', 'journal'],
    ['pages/blog.html', 'journal'],
    ['pages/journal/crpg.html', 'journal'],
    ['pages/blog/growth-function-replacement.html', 'journal'],
    ['pages/game.html', 'game'],
    ['404.html', 'master']
  ]);

  for (const [path, mode] of expectations) {
    const html = await readText(path);
    assert.ok(html.includes(`data-brand-mode="${mode}"`), `${path} missing ${mode} mode`);
    for (const stylesheet of ['tokens/primitive.css', 'tokens/semantic.css', 'tokens/modes.css', 'components/brand-experience.css']) {
      assert.ok(html.includes(`style/${stylesheet}`), `${path} missing ${stylesheet}`);
    }
  }
});

test('representative page heroes consume mode tokens instead of new page literals', async () => {
  const pages = await Promise.all([
    readText('style/iris-sakura.css'),
    readText('style/engineering.css'),
    readText('style/framework.css'),
    readText('style/journal.css'),
    readText('style/game.css')
  ]);

  for (const css of pages) {
    assert.ok(css.includes('var(--brand-mode-hero-background)'), 'page hero does not consume mode background');
    assert.ok(css.includes('var(--brand-mode-hero-text)'), 'page hero does not consume mode text');
  }
});

test('long-form detail routes share one patternless editorial canvas', async () => {
  const css = await readText('style/iris-sakura.css');
  const detailCanvas = css.match(/\.journal-detail-main,\s*\n\.blog-detail-main\s*\{(?<rules>[^}]*)\}/u);

  assert.ok(detailCanvas?.groups?.rules, 'Blog and Journal details must share one reading canvas');
  assert.ok(detailCanvas.groups.rules.includes('radial-gradient'), 'detail canvas must retain soft brand atmosphere');
  assert.ok(detailCanvas.groups.rules.includes('linear-gradient'), 'detail canvas must include a stable paper base');
  assert.ok(!detailCanvas.groups.rules.includes('repeating-'), 'detail canvas must not repeat stripes or grids');
  assert.doesNotMatch(
    css,
    /\.journal-detail-main\s*\{[^}]*repeating-(?:linear|radial)-gradient/su,
    'Journal detail must not restore the former notebook stripe background'
  );
});
