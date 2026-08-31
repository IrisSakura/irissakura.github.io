import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

const pageContracts = {
  'pages/portfolio.html': ['portfolio-journey', 'portfolio-cases', 'consumer-lab'],
  'pages/framework.html': ['maturity', 'adoption', 'game-adoption', 'modules', 'architecture', 'lifecycle'],
  'pages/journal.html': ['knowledge-streams', 'content-search', 'featured-notes', 'recent-audits', 'game-design-library', 'evidence-chains'],
  'pages/blog.html': ['featured-reading', 'blog-taxonomy', 'articles']
};

test('long collection pages expose one generated accessible section index with stable targets', async () => {
  const generator = await readText('scripts/generate-site.mjs');
  assert.ok(generator.includes('PAGE_INDEXES'), 'generator must own the page-index registry');
  assert.ok(generator.includes('renderPageIndex'), 'generator must own shared page-index markup');

  for (const [pagePath, targetIds] of Object.entries(pageContracts)) {
    const html = await readText(pagePath);
    assert.equal((html.match(/data-page-index(?=[\s>])/g) ?? []).length, 1, `${pagePath} must expose one page index`);
    assert.match(html, /<nav class="page-index"[^>]*aria-label="[^"]+"[^>]*data-page-index/u);

    const links = Array.from(html.matchAll(/<a href="#([^"]+)"[^>]*data-page-index-link/g), (match) => match[1]);
    assert.deepEqual(links, targetIds, `${pagePath} page-index order drifted`);
    assert.equal(new Set(links).size, links.length, `${pagePath} page index repeats a target`);

    for (const targetId of targetIds) {
      assert.match(html, new RegExp(`id="${targetId}"[^>]*data-page-index-target|data-page-index-target[^>]*id="${targetId}"`, 'u'), `${pagePath} is missing target ${targetId}`);
    }
  }

  for (const pagePath of ['index.html', 'pages/game.html', 'pages/blog/unreal-engine-rdg-compilation.html']) {
    const html = await readText(pagePath);
    assert.ok(!html.includes('data-page-index'), `${pagePath} should not receive the collection-page index`);
  }
});

test('shared page index is sticky, mobile-scrollable and progressively enhanced', async () => {
  const [css, runtime] = await Promise.all([
    readText('style/main.css'),
    readText('src/site.ts')
  ]);

  assert.match(css, /\.page-index\s*\{[^}]*position:\s*sticky[^}]*top:\s*5\.15rem/s);
  assert.match(css, /\.page-index-links\s*\{[^}]*overflow-x:\s*auto[^}]*scrollbar-width:\s*none/s);
  assert.match(css, /\.page-index-progress\s*::after\s*\{[^}]*scale:\s*var\(--page-index-progress,\s*0\)\s+1/s);
  assert.match(css, /\[data-page-index-target\]\s*\{[^}]*scroll-margin-top:/s);
  assert.match(css, /@media \(max-width:\s*620px\)[\s\S]*?\.page-index\s*\{[^}]*top:\s*4\.9rem/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.page-index-progress::after[^}]*transition-duration:\s*0\.01ms\s*!important/s);

  for (const contract of [
    'setupPageIndex()',
    'pageIndexObserver',
    'pageIndexAbort',
    "'[data-page-index]'",
    "'[data-page-index-link]'",
    'IntersectionObserver',
    "setAttribute('aria-current', 'location')",
    "setProperty('--page-index-progress'"
  ]) {
    assert.ok(runtime.includes(contract), `page-index runtime missing ${contract}`);
  }
});
