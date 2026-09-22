import { styleSource } from './lib/style-source.mjs';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  if (path.startsWith('style/')) return styleSource(path);
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

  assert.match(css, /--page-gutter:\s*clamp\(1\.25rem,\s*4vw,\s*4rem\)/);

  assert.match(
    css,
    /\.container\s*\{[^}]*width:\s*min\([^;]*var\(--page-gutter\)[^;]*var\(--container-width\)[^;]*\)[^}]*padding:\s*0/s
  );
  assert.doesNotMatch(
    css,
    /\[data-page-cover\]\.page-cover\s*>\s*\.container\s*\{[^}]*width:\s*100%/s,
    'page covers must preserve the shared fluid container width'
  );
  assert.match(
    css,
    /\.hero-section \.hero\s*\{[^}]*min-height:\s*var\(--hero-block-size\)[^}]*padding-block:\s*clamp\([^;]*svh/s
  );
});

test('home uses a creator profile and three project bridges with linear mobile fallback', async () => {
 const css=await readText('style/main.css');
 assert.match(css,/\.living-profile/);
 assert.match(css,/\.ecosystem-bridge\s*\{[^}]*grid-template-columns:\s*repeat\(3,minmax\(0,1fr\)\)/s);
 assert.match(css,/@media\s*\(max-width:900px\)[\s\S]*?\.ecosystem-bridge\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test('Consumer Lab uses a bounded two-column matrix with readable narrow-screen fallbacks', async () => {
  const css = await readText('style/portfolio.css');

  assert.match(
    css,
    /\.consumer-lab-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s
  );
  assert.match(css, /\.consumer-lab-card\s*\{[^}]*min-width:\s*0/s);
  assert.match(css, /\.consumer-lab-card\s*\{[^}]*scroll-margin-top:\s*10\.2rem/s);
  assert.match(
    css,
    /\.consumer-lab-card-featured\s*\{[^}]*grid-column:\s*1\s*\/\s*-1[^}]*grid-template-columns:\s*minmax\(0,\s*1\.15fr\)\s+minmax\(16rem,\s*0\.85fr\)/s
  );
  assert.match(
    css,
    /\.consumer-lab-highlights\s*\{[^}]*display:\s*flex[^}]*flex-wrap:\s*wrap/s
  );
  assert.match(
    css,
    /\.consumer-lab-local-proof-list\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s
  );
  const tabletFallback = [...css.matchAll(/@media \(max-width: 900px\)\s*\{([\s\S]*?)\n\}/g)].map(m=>m[1]).join('\n');
  assert.match(
    tabletFallback,
    /\.consumer-lab-grid\s*\{[^}]*grid-template-columns:\s*1fr/s
  );
  assert.match(
    tabletFallback,
    /\.consumer-lab-card-featured\s*\{[^}]*grid-template-columns:\s*1fr/s
  );
  assert.match(
    tabletFallback,
    /\.consumer-lab-card\s*\{[^}]*scroll-margin-top:\s*9\.6rem/s
  );
  const phoneFallback = [...css.matchAll(/@media \(max-width: 560px\)\s*\{([\s\S]*?)\n\}/g)].map(m=>m[1]).join('\n');
  assert.match(
    phoneFallback,
    /\.consumer-lab-local-proof-list\s*\{[^}]*grid-template-columns:\s*1fr/s
  );
});

test('Journal cards wrap long mixed-language titles inside their padding', async () => {
  const css = await readText('style/journal.css');

  assert.match(
    css,
    /\.journal-update-card h3,\s*\.design-summary-card h3\s*\{[^}]*overflow-wrap:\s*anywhere/s
  );
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
