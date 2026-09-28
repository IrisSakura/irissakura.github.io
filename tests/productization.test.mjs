import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import path from 'node:path';

import { rankSiteSearch } from '../scripts/lib/site-search-index.mjs';
import { buildContentGraph, relatedForPage } from '../scripts/lib/content-relations.mjs';

const root = path.resolve(import.meta.dirname, '..');
const readText = (name) => readFile(path.join(root, name), 'utf8');
const readJson = async (name) => JSON.parse(await readText(name));

test('global discovery covers public pages and finds Chinese, English and CamelCase terms deterministically', async () => {
  const index = await readJson('data/site-search-index.json');
  assert.equal(index.schemaVersion, 1);
  assert.equal(index.totalCount, index.documents.length);
  assert.equal(new Set(index.documents.map((doc) => doc.id)).size, index.totalCount);
  const lookup = (query) => rankSiteSearch(index.documents, query).map((doc) => doc.id);
  assert.ok(lookup('SakuraGameFramework').includes('project:sakura-framework'));
  assert.ok(lookup('object pool').includes('framework:pooling'));
  assert.ok(lookup('对象池').includes('framework:pooling'));
  assert.ok(lookup('unity').some((id) => id.startsWith('article:')));
  assert.ok(lookup('游戏系统的共同语言').includes('article:authoritative-time-source'));
  assert.deepEqual(lookup('Sakura'), lookup('Sakura'));
  assert.deepEqual(lookup('not-present-in-public-index-xyz'), []);
  assert.ok(index.documents.every((doc) => doc.url.startsWith('/')));
  assert.doesNotMatch(JSON.stringify(index), /\/Users\/|sourceCommit|contentPath|sha256|sakura-design-journal\.git/iu);
});

test('relations use valid public IDs and derive only from declared content facts', async () => {
  const [index, graph, source, presentation, chains] = await Promise.all([
    readJson('data/site-search-index.json'), readJson('data/content-graph.json'),
    readJson('data/content-relations.json'), readJson('config/site-presentation.json'), readJson('data/evidence-chains.json')
  ]);
  assert.deepEqual(graph, buildContentGraph(index, source, presentation.projects, chains));
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const identities = new Set();
  for (const relation of graph.relations) {
    assert.ok(nodes.has(relation.from) && nodes.has(relation.to));
    const identity = `${relation.from}|${relation.to}|${relation.type}`;
    assert.ok(!identities.has(identity), `duplicate relation ${identity}`);
    identities.add(identity);
    assert.ok(['explicit', 'presentation', 'publication', 'evidence-chain'].includes(relation.origin));
  }
  assert.ok(relatedForPage(graph, '/pages/blog/authoritative-time-source.html')
    .some((node) => node.id === 'game-design:metroidvania'));
  assert.ok(relatedForPage(graph, '/pages/game.html').some((node) => node.type === 'article'));
  assert.doesNotMatch(JSON.stringify(graph), /\/Users\/|sourceCommit|contentPath|sha256|sakura-design-journal\.git/iu);
});

test('generated JSON-LD is parseable, canonical, typed and keeps publication dates truthful', async () => {
  const files = ['index.html', ...(await htmlFiles(path.join(root, 'pages'), 'pages'))];
  for (const file of files) {
    const html = await readText(file);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/u)?.[1];
    const json = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/u)?.[1];
    assert.ok(canonical && json, `${file} lacks canonical or JSON-LD`);
    const data = JSON.parse(json);
    const entities = data['@graph'] ?? [data];
    assert.ok(entities.some((entity) => entity.url === canonical), `${file} entity URL differs from canonical`);
    for (const entity of entities) {
      if (entity.url) assert.equal(new URL(entity.url).protocol, 'https:');
      if (entity.datePublished) assert.match(entity.datePublished, /^\d{4}-\d{2}-\d{2}/u);
      if (entity.dateModified) assert.match(entity.dateModified, /^\d{4}-\d{2}-\d{2}/u);
    }
    assert.doesNotMatch(json, /\/Users\/|sourceCommit|contentPath|sha256/iu);
  }
  const home = JSON.parse((await readText('index.html')).match(/<script type="application\/ld\+json">([^<]+)<\/script>/u)[1]);
  assert.ok(home['@graph'].some((entity) => entity['@type'] === 'WebSite'));
  assert.ok(home['@graph'].some((entity) => entity['@type'] === 'Person'));
  const article = JSON.parse((await readText('pages/blog/authoritative-time-source.html'))
    .match(/<script type="application\/ld\+json">([^<]+)<\/script>/u)[1]);
  const posting = article['@graph'].find((entity) => entity['@type'] === 'BlogPosting');
  assert.ok(posting?.datePublished && posting?.dateModified && posting?.author);
});

test('indexing and disabled analytics match generated page contracts', async () => {
  const [sitemap, robots, config, home, legacy] = await Promise.all([
    readText('sitemap.xml'), readText('robots.txt'), readJson('config/analytics.json'),
    readText('index.html'), readText('pages/about.html')
  ]);
  assert.match(robots, /Sitemap: https:\/\/irissakura\.github\.io\/sitemap\.xml/u);
  assert.ok(sitemap.includes('https://irissakura.github.io/'));
  assert.ok(!sitemap.includes('/pages/about.html'));
  assert.match(legacy, /name="robots" content="noindex, follow"/u);
  assert.ok(config.enabled === false && config.siteDomain === null);
  assert.match(home, /id="site-analytics-config">\{"enabled":false/u);
  assert.doesNotMatch(home, /<script[^>]+src="https:\/\/plausible\.io/u);
  assert.match(home, /data-site-search/u);
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]);
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'sitemap contains duplicate canonical URLs');
  const sitemapSet = new Set(sitemapUrls);
  for (const file of ['index.html', ...(await htmlFiles(path.join(root, 'pages'), 'pages')), '404.html']) {
    const html = await readText(file);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/u)?.[1];
    assert.ok(canonical, `${file} lacks canonical`);
    if (/<meta name="robots" content="noindex, follow">/u.test(html)) {
      assert.ok(!sitemapSet.has(`https://irissakura.github.io/${file === 'index.html' ? '' : file}`), `${file} is noindex but appears in sitemap`);
    } else {
      assert.ok(sitemapSet.has(canonical), `${file} is indexable but absent from sitemap`);
    }
  }
});

async function htmlFiles(directory, prefix) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) files.push(...await htmlFiles(path.join(directory, entry.name), `${prefix}/${entry.name}`));
    else if (entry.name.endsWith('.html')) files.push(`${prefix}/${entry.name}`);
  }
  return files;
}
