import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('journal snapshot exposes a small curated public contract', async () => {
  const data = JSON.parse(await readText('data/journal.json'));
  const source = JSON.parse(await readText('data/journal-source.json'));

  assert.equal(data.schemaVersion, 1);
  assert.equal(data.title, 'Sakura Design Journal');
  assert.equal(data.summary.gameDesignCount, source.gameDesigns.length);
  assert.equal(data.summary.auditCount, source.audits.length);
  assert.equal(data.summary.blogCount, source.blogs.length);
  assert.equal(data.summary.knowledgeStreamCount, 3);
  assert.equal(data.streams.length, 3);
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
  const details = await Promise.all(data.featuredNotes.map((note) => readText(`pages/journal/${note.id}.html`)));
  const publicFiles = [html, ...details, JSON.stringify(data)].join('\n');

  assert.ok(html.includes('id="featured-notes"'));
  assert.ok(!html.includes('正在读取'));
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
    const detail = details.find((page) => page.includes(`<h1>${note.title}</h1>`));
    assert.ok(detail, `missing generated detail page ${note.id}`);
    for (const heading of ['问题背景', '研究方法', '核心发现', '对框架或游戏的影响', '更新时间']) {
      assert.ok(detail.includes(heading), `${note.id} missing ${heading}`);
    }
  }
  for (const design of source.gameDesigns) {
    assert.ok(html.includes(`id="design-${design.id}"`), `missing game design summary ${design.id}`);
  }
  for (const audit of source.audits.slice(0, 6)) {
    assert.ok(html.includes(audit.summary), `missing recent audit ${audit.id}`);
  }

  assert.ok(!publicFiles.includes('154.37.215.57'));
  assert.ok(!publicFiles.includes('sakura-design-journal.git'));
  assert.ok(!publicFiles.includes('/Users/'));
});
