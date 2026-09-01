import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

test('journal snapshot exposes a small curated public contract', async () => {
  const data = JSON.parse(await readText('data/journal.json'));
  const source = JSON.parse(await readText('data/journal-source.json'));

  assert.equal(data.schemaVersion, 1);
  assert.equal(data.title, 'IrisSakura Journal');
  assert.equal(data.summary.gameDesignCount, source.gameDesigns.length);
  assert.equal(data.summary.auditCount, source.audits.length);
  assert.equal(data.summary.importedBlogCount, source.blogs.length);
  assert.equal(source.summary.gameDesignCount, source.gameDesigns.length);
  assert.equal(source.summary.auditCount, source.audits.length);
  assert.equal(source.summary.blogCount, source.blogs.length);
  assert.ok(!Object.hasOwn(data.summary, 'blogCount'));
  assert.equal(data.summary.knowledgeStreamCount, data.streams.length);
  assert.ok(data.streams.length > 0);
  assert.ok(data.featuredNotes.length >= 6);
  assert.match(data.sourceSnapshot.catalogDigest, /^[a-f0-9]{64}$/);
  assert.match(data.sourceSnapshot.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(data.sourceSnapshot.sourceCommit, source.sourceCommit);

  for (const note of data.featuredNotes) {
    assert.deepEqual(
      Object.keys(note).sort(),
      ['description', 'finding', 'id', 'impact', 'method', 'question', 'tags', 'title', 'track', 'updatedAt']
    );
    assert.ok(note.tags.length > 0);
    assert.ok(note.question.length > 0);
    assert.ok(note.method.length > 0);
    assert.ok(note.finding.length > 0);
    assert.ok(note.impact.length > 0);
    assert.match(note.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('journal page statically renders every curated view and preserves the private boundary', async () => {
  const html = await readText('pages/journal.html');
  const data = JSON.parse(await readText('data/journal.json'));
  const source = JSON.parse(await readText('data/journal-source.json'));
  const publication = JSON.parse(await readText('config/blog-publication.json'));
  const publishedBlogCount = publication.articles.filter((article) => (
    ['approved', 'published'].includes(article.status)
  )).length;
  const detailIds = new Set([
    ...data.featuredNotes.map((note) => note.id),
    ...source.gameDesigns.map((design) => design.id)
  ]);
  const details = new Map(await Promise.all([...detailIds].map(async (id) => (
    [id, await readText(`pages/journal/${id}.html`)]
  ))));
  const publicFiles = [html, ...details.values(), JSON.stringify(data)].join('\n');

  assert.ok(html.includes('id="featured-notes"'));
  assert.ok(!html.includes('正在读取'));
  assert.ok(
    html.includes(`<strong>${data.summary.importedBlogCount}</strong><span>完整博客</span>`),
    'complete-blog metric must use the imported complete-body count'
  );
  assert.ok(
    html.includes(`<small>${publishedBlogCount} 篇已公开</small>`),
    'complete-blog metric must distinguish public articles from imported bodies'
  );
  for (const [className, titleId] of [
    ['journal-featured-scroll', 'featured-notes-title'],
    ['journal-audit-scroll', 'recent-audits-title'],
    ['journal-design-scroll', 'game-design-library-title']
  ]) {
    assert.ok(
      html.includes(`class="journal-scroll-region ${className}" role="region" aria-labelledby="${titleId}" tabindex="0"`),
      `missing accessible scroll region ${className}`
    );
  }
  for (const stream of data.streams) {
    assert.ok(html.includes(`data-stream="${stream.id}"`), `missing journal stream ${stream.id}`);
  }
  for (const note of data.featuredNotes) {
    assert.ok(html.includes(`journal/${note.id}.html`), `missing journal detail link ${note.id}`);
    const detail = details.get(note.id);
    assert.ok(detail, `missing generated detail page ${note.id}`);
    for (const heading of ['问题背景', '研究方法', '核心发现', '对框架或游戏的影响', '更新时间']) {
      assert.ok(detail.includes(heading), `${note.id} missing ${heading}`);
    }
  }
  for (const design of source.gameDesigns) {
    assert.ok(html.includes(`id="design-${design.id}"`), `missing game design summary ${design.id}`);
    assert.ok(html.includes(`journal/${design.id}.html`), `missing game design detail link ${design.id}`);
    const detail = details.get(design.id);
    assert.ok(detail.includes(`<h1>${escapeHtml(design.title)}</h1>`), `missing design detail title ${design.id}`);
    assert.ok(detail.includes('完整研究结构'), `missing complete research heading ${design.id}`);
    assert.ok(detail.includes('class="blog-prose research-prose"'), `missing full design prose ${design.id}`);
  }
  for (const design of source.gameDesigns) {
    const detail = details.get(design.id);
    const ids = new Set([...detail.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]));
    for (const match of detail.matchAll(/\shref="#([^"]+)"/gu)) {
      const target = decodeURIComponent(match[1]);
      assert.ok(ids.has(target), `${design.id} has unresolved local heading anchor ${target}`);
    }
  }
  for (const audit of source.audits.slice(0, 6)) {
    assert.ok(html.includes(audit.summary), `missing recent audit ${audit.id}`);
  }

  assert.ok(!publicFiles.includes('154.37.215.57'));
  assert.ok(!publicFiles.includes('sakura-design-journal.git'));
  assert.ok(!publicFiles.includes('/Users/'));
});
