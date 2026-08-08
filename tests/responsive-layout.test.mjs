import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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

test('layout presets tune shared geometry instead of re-owning homepage compositions', async () => {
  for (const path of ['style/layout-compact.css', 'style/layout-wide.css']) {
    const css = await readText(path);
    for (const token of ['--container-width', '--page-gutter', '--section-space', '--hero-block-size']) {
      assert.ok(css.includes(`${token}:`), `${path} missing ${token}`);
    }
    for (const selector of ['.case-list', '.research-list', '.research-row']) {
      assert.ok(!css.includes(selector), `${path} must not re-own ${selector}`);
    }
  }
});
