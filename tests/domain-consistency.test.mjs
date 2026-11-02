import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { buildStructuredData } from '../scripts/lib/structured-data.mjs';
import { assertPublishedSiteUrls } from '../scripts/lib/published-site-urls.mjs';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');
const json = async (file) => JSON.parse(await read(file));
const structured = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/u)[1]);

test('the canonical root is irissakura.com while repository identity stays unchanged', async () => {
  const [site, pkg] = await Promise.all([json('data/site.json'), json('package.json')]);
  assert.equal(site.siteUrl, 'https://irissakura.com');
  assert.equal(pkg.homepage, `${site.siteUrl}/`);
  assert.equal(pkg.name, 'irissakura.github.io');
  assert.equal(pkg.repository.url, 'git+https://github.com/IrisSakura/irissakura.github.io.git');
});

test('homepage and a published article share the same site-owned entity identities', async () => {
  const [site, publication, home, feed, sitemap, robots, subscribe] = await Promise.all([
    json('data/site.json'), json('config/blog-publication.json'), read('index.html'),
    read('rss.xml'), read('sitemap.xml'), read('robots.txt'), read('pages/subscribe.html')
  ]);
  const published = publication.articles.find(({ status }) => ['approved', 'published'].includes(status));
  assert.ok(published, 'a formal article is required');
  const articleFile = `pages/blog/${published.slug}.html`;
  const article = await read(articleFile);
  for (const [file, text] of [['index.html', home], [articleFile, article], ['rss.xml', feed],
    ['sitemap.xml', sitemap], ['robots.txt', robots], ['pages/subscribe.html', subscribe]]) {
    assertPublishedSiteUrls(file, text, site.siteUrl);
  }
  const graph = structured(home)['@graph'];
  const website = graph.find((entity) => entity['@type'] === 'WebSite');
  const person = graph.find((entity) => entity['@type'] === 'Person');
  const profile = graph.find((entity) => entity.isPartOf);
  assert.equal(website['@id'], `${site.siteUrl}/#website`);
  assert.equal(person['@id'], `${site.siteUrl}/#person`);
  assert.equal(website.publisher['@id'], person['@id']);
  assert.equal(profile.isPartOf['@id'], website['@id']);
  assert.equal(profile.mainEntity['@id'], person['@id']);
  const posting = structured(article)['@graph'].find((entity) => entity['@type'] === 'BlogPosting');
  assert.equal(posting.author['@id'], person['@id']);
  assert.equal(posting.url, `${site.siteUrl}/${articleFile}`);
  assert.equal(posting.mainEntityOfPage, posting.url);
  assert.ok(subscribe.includes(`${site.siteUrl}/rss.xml`));
  assert.ok(feed.includes(posting.url));
});

test('entity identifiers follow the supplied site root instead of a second hardcoded origin', async () => {
  const site = { ...await json('data/site.json'), siteUrl: 'https://preview.example' };
  const page = { file: 'index.html', canonical: '/', title: 'Preview', description: 'Preview' };
  const graph = buildStructuredData(page, site, `${site.siteUrl}/image.png`)['@graph'];
  assert.equal(graph.find((entity) => entity['@type'] === 'Person')['@id'], `${site.siteUrl}/#person`);
  assert.equal(graph.find((entity) => entity['@type'] === 'WebSite')['@id'], `${site.siteUrl}/#website`);
});

test('the package URL audit rejects stale metadata and entity references but allows historical links', async () => {
  const { siteUrl } = await json('data/site.json');
  const home = await read('index.html');
  const historical = `${home}\n<a href="https://irissakura.github.io/">Historical entry</a>`;
  assert.doesNotThrow(() => assertPublishedSiteUrls('index.html', historical, siteUrl));
  for (const [field, pattern] of [
    ['canonical', /(<link rel="canonical" href=")https:\/\/irissakura\.com/u],
    ['og:url', /(<meta property="og:url" content=")https:\/\/irissakura\.com/u],
    ['og:image', /(<meta property="og:image" content=")https:\/\/irissakura\.com/u],
    ['twitter:image', /(<meta name="twitter:image" content=")https:\/\/irissakura\.com/u],
    ['entity reference', /("publisher":\{"@id":")https:\/\/irissakura\.com/u]
  ]) {
    const changed = home.replace(pattern, '$1https://irissakura.github.io');
    assert.notEqual(changed, home, `fixture did not change ${field}`);
    assert.throws(() => assertPublishedSiteUrls('index.html', changed, siteUrl), undefined, field);
  }
  for (const file of ['sitemap.xml', 'rss.xml', 'robots.txt']) {
    const text = await read(file);
    const changed = text.replace('https://irissakura.com', 'https://irissakura.github.io');
    assert.notEqual(changed, text);
    assert.throws(() => assertPublishedSiteUrls(file, changed, siteUrl), undefined, file);
  }
});
