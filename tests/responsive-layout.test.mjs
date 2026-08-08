import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('shared layout uses fluid viewport-aware geometry tokens', async () => {
  const css = await readText('style/main.css');

  for (const token of [
    '--page-gutter',
    '--section-space',
    '--story-grid-gap',
    '--hero-block-size'
  ]) {
    assert.ok(css.includes(`${token}:`), `shared CSS missing ${token}`);
  }

  assert.match(css, /--page-gutter:\s*clamp\(1\.25rem,\s*5vw,\s*5rem\)/);

  assert.match(
    css,
    /\.container\s*\{[^}]*width:\s*min\([^;]*var\(--page-gutter\)[^;]*var\(--container-width\)[^;]*\)[^}]*padding:\s*0/s
  );
  assert.match(
    css,
    /\.hero-section \.hero\s*\{[^}]*min-height:\s*var\(--hero-block-size\)[^}]*padding-block:\s*clamp\([^;]*svh/s
  );
});

test('home cases and research use asymmetric desktop compositions with linear mobile fallbacks', async () => {
  const css = await readText('style/main.css');

  assert.match(css, /\.case-list\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(12,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /\.case-list\s*>\s*article:first-child\s*\{[^}]*grid-column:\s*span 7/s);
  assert.match(css, /\.case-list\s*>\s*article:nth-child\(2\)\s*\{[^}]*grid-column:\s*span 5/s);
  assert.match(css, /\.case-list\s*>\s*article:nth-child\(3\)\s*\{[^}]*grid-column:\s*3 \/ span 8/s);

  assert.match(css, /\.research-list\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /\.research-row:first-child\s*\{[^}]*grid-row:\s*1 \/ span 2/s);

  const tabletFallback = css.match(/@media \(max-width: 1000px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(tabletFallback, /\.case-list,[\s\S]*?\.research-list\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(tabletFallback, /\.case-list\s*>\s*article,[\s\S]*?\.research-row:first-child\s*\{[^}]*grid-column:\s*auto[^}]*grid-row:\s*auto/s);
});

test('fluid geometry is the only layout system and obsolete presets are removed', async () => {
  for (const path of ['data/layouts.json', 'style/layout-compact.css', 'style/layout-wide.css']) {
    await assert.rejects(
      access(new URL(path, root)),
      (error) => error?.code === 'ENOENT',
      `${path} should be deleted`
    );
  }

  const sources = await Promise.all([
    readText('components/navbar.html'),
    readText('scripts/generate-site.mjs'),
    readText('src/site.ts'),
    readText('style/main.css'),
    readText('index.html')
  ]);
  for (const source of sources) {
    for (const marker of [
      'irissakura-layout',
      'layout-picker',
      'layout-select',
      'data-layout',
      'layout-bootstrap',
      'layout-styles'
    ]) {
      assert.ok(!source.includes(marker), `obsolete layout marker remains: ${marker}`);
    }
  }
});
