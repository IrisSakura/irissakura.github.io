import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('shared component tokens own common actions, controls, chips, surfaces and focus states', async () => {
  const [main, framework, journal, blog, game] = await Promise.all([
    readText('style/main.css'),
    readText('style/framework.css'),
    readText('style/journal.css'),
    readText('style/blog.css'),
    readText('style/game.css')
  ]);

  for (const token of [
    '--ui-surface-card',
    '--ui-surface-hover',
    '--ui-border-subtle',
    '--ui-border-strong',
    '--ui-focus-color',
    '--ui-control-height',
    '--ui-pill-radius',
    '--ui-action-radius',
    '--ui-chip-radius'
  ]) {
    assert.ok(main.includes(`${token}:`), `shared CSS missing ${token}`);
  }

  assert.match(main, /\.btn\s*\{[^}]*var\(--ui-action-radius\)/s);
  assert.match(main, /\.brand-seal\s*\{[^}]*var\(--ui-control-border\)[^}]*var\(--ui-pill-radius\)/s);
  assert.match(main, /\.tag,[\s\S]*?\.portfolio-tags span\s*\{[^}]*var\(--ui-chip-surface\)/s);
  assert.match(main, /:focus-visible\s*\{[^}]*var\(--ui-focus-color\)/s);
  assert.match(framework, /\.module-search input\s*\{[^}]*var\(--ui-control-border\)/s);
  assert.match(framework, /\.module-filter\s*\{[^}]*var\(--ui-control-surface\)/s);
  assert.match(journal, /\.note-tags span\s*\{[^}]*var\(--ui-chip-border\)/s);
  assert.match(blog, /\.blog-card,[\s\S]*?\.design-summary-card\s*\{[^}]*var\(--ui-surface-card\)/s);
  assert.match(game, /\.system-tags span\s*\{[^}]*var\(--ui-chip-surface\)/s);
});

test('the single brand palette configures tokens without re-declaring shared components', async () => {
  const css = await readText('style/iris-sakura.css');
  for (const token of [
    '--ui-action-primary-bg',
    '--ui-action-secondary-text',
    '--ui-control-surface',
    '--ui-control-surface-hover',
    '--ui-chip-surface',
    '--ui-focus-color'
  ]) {
    assert.ok(css.includes(`${token}:`), `brand palette missing ${token}`);
  }
  for (const selector of ['.btn', '.theme-picker', '.tag']) {
    assert.ok(!css.includes(selector), `brand palette re-declares shared selector ${selector}`);
  }
});

test('component library decision is explicit and does not add an unscoped UI dependency', async () => {
  const [packageJson, guide] = await Promise.all([
    readText('package.json').then(JSON.parse),
    readText('docs/ui-components.md')
  ]);
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  for (const dependency of [
    'bootstrap',
    '@picocss/pico',
    'tailwindcss',
    '@tailwindcss/cli',
    '@awesome.me/webawesome'
  ]) {
    assert.equal(dependencies[dependency], undefined, `unexpected full UI dependency ${dependency}`);
  }
  for (const library of ['Bootstrap', 'Pico CSS', 'Tailwind', 'Web Awesome']) {
    assert.ok(guide.includes(library), `component guide does not assess ${library}`);
  }
  assert.ok(guide.includes('按需单组件'), 'component guide must keep future library adoption scoped');
});
