import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { assertNowData, assertUpdatesData, assertLivingHref, resolveHomeWriting, resolveRecentUpdates, shanghaiToday } from '../scripts/lib/living-site-model.mjs';
import { renderLivingHome, renderLivingNow } from '../scripts/lib/living-site-render.mjs';
const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const json = async (file) => JSON.parse(await read(file));
const now = await json('data/now.json');
const updates = await json('data/updates.json');
const today = '2026-09-20';
test('living content validates calendar dates, duplicates, nonempty copy and safe optional links', () => {
  assertNowData(now);
  assertUpdatesData(updates, { today });
  for (const mutate of [
    (d) => { d.updatedAt = '2026-02-30'; },
    (d) => { d.current.push(d.current[0]); },
    (d) => { d.current[0].summary = ' '; },
    (d) => { d.thinking = Array.from({ length: 5 }, (_, i) => ({ id: `q-${i}`, title: '问题' })); },
    (d) => { d.recentlyCompleted = Array.from({ length: 6 }, (_, i) => ({ id: `r-${i}`, title: '结果', summary: '说明' })); }
  ]) { const invalid = structuredClone(now); mutate(invalid); assert.throws(() => assertNowData(invalid)); }
  for (const unsafe of ['javascript:alert(1)', 'data:text/html,test', '//example.com', '/\\example.com', '/%2e%2e/private', '/a/../b', 'https://user:secret@example.com', ' https://example.com', 'http://example.com']) assert.throws(() => assertLivingHref(unsafe), /unsafe/);
  for (const safe of [null, undefined, '/', '/pages/now.html#current', 'https://example.com/path']) assert.doesNotThrow(() => assertLivingHref(safe));
  const stale = { ...now, updatedAt: '2020-01-01', thinking: [], recentlyCompleted: [] };
  assert.doesNotThrow(() => assertNowData(stale));
  const output = renderLivingNow(stale, { schemaVersion: 1, items: [] });
  assert.doesNotMatch(output, /id="thinking"|id="recently-completed"/);
});
test('updates enforce editorial order and Shanghai dates while preserving same-day order', () => {
  assert.equal(shanghaiToday(new Date('2026-09-19T16:00:00Z')), today);
  for (const mutate of [
    (d) => { d.items[0].date = '2026-09-21'; },
    (d) => { d.items[0].type = 'commit'; },
    (d) => { d.items[0].title = ''; },
    (d) => { d.items[0].summary = ''; },
    (d) => { d.items.push(d.items[0]); },
    (d) => { d.items = [{ ...d.items[0], id: 'older', date: '2026-09-19' }, d.items[0]]; }
  ]) { const invalid = structuredClone(updates); mutate(invalid); assert.throws(() => assertUpdatesData(invalid, { today })); }
  const data = { schemaVersion: 1, items: ['z', 'a', 'c'].map((id) => ({ ...updates.items[0], id, href: null })) };
  assert.deepEqual(resolveRecentUpdates(data, 2, { today }).map(({ id }) => id), ['z', 'a']);
});
test('latest writing is based on publication rather than modifications and does not mutate its input', () => {
  const articles = [{ slug: 'old', publishedAt: '2020-01-01', updatedAt: today }, { slug: 'z', publishedAt: today }, { slug: 'a', publishedAt: today }];
  assert.deepEqual(resolveHomeWriting(articles, 2).map(({ slug }) => slug), ['a', 'z']);
  assert.equal(articles[0].slug, 'old');
});
test('frontstage copy hides maintenance metadata; technical articles remain unrestricted', async () => {
  for (const route of ['index.html', ...['portfolio', 'blog', 'development', 'mods', 'contact', 'now', 'game'].map((id) => `pages/${id}.html`)]) {
    const html = await read(route);
    assert.doesNotMatch(html, /source-push|fixed-snapshot|source SHA|owner-only|provenance|reviewedJournalCurationHash|reviewed hash|sync registry|exact commit import|repository-scoped runner/iu, route);
  }
});
test('Now ships canonical metadata, safe links, sitemap inclusion and no extra RSS items', async () => {
  const [html, sitemap, rss, publication] = await Promise.all([read('pages/now.html'), read('sitemap.xml'), read('rss.xml'), json('config/blog-publication.json')]);
  assert.match(html, /<h1>最近在做什么<\/h1>/u);
  assert.match(html, /rel="canonical" href="https:\/\/irissakura.github.io\/pages\/now.html"/u);
  assert.ok(html.includes(`datetime="${now.updatedAt}"`));
  assert.ok(sitemap.includes('/pages/now.html'));
  assert.equal((rss.match(/<item>/gu) ?? []).length, publication.articles.filter(({ status }) => status === 'published').length);
  assert.doesNotMatch(rss, /pages\/now.html/u);
});
test('home rendering obeys reordered configuration and escapes editorial input', async () => {
  const [projects, site, presentation, brand, series, publication] = await Promise.all([json('data/projects.json'), json('data/site.json'), json('config/site-presentation.json'), json('config/brand.json'), json('config/mod-series.json'), json('config/blog-publication.json')]);
  const altered = structuredClone(presentation);
  altered.home.sectionOrder = [...altered.home.sectionOrder].reverse();
  const malicious = structuredClone(now); malicious.current[0].title = '<script>alert(1)</script>';
  const { personas } = await json('config/personas-v2.json');
  const html = renderLivingHome({ projects, site, presentations: [], presentation: altered, now: malicious, updates, articles: publication.articles.filter(({ status }) => status === 'published'), series, brand, personas });
  assert.ok(html.indexOf('id="contact"') < html.indexOf('id="profile"'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>alert(1)</script>'));
});
