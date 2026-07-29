import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('journal snapshot exposes a small curated public contract', async () => {
  const data = JSON.parse(await readText('data/journal.json'));

  assert.equal(data.schemaVersion, 1);
  assert.equal(data.title, 'Sakura Design Journal');
  assert.equal(data.summary.gameDesignCount, 38);
  assert.equal(data.summary.knowledgeStreamCount, 3);
  assert.equal(data.streams.length, 3);
  assert.ok(data.featuredNotes.length >= 6);

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

test('journal page binds every curated view and preserves the private boundary', async () => {
  const html = await readText('pages/journal.html');
  const source = await readText('src/journal.ts');
  const publicFiles = [html, source, await readText('data/journal.json')].join('\n');

  for (const id of [
    'journal-description',
    'journal-design-count',
    'journal-stream-count',
    'journal-streams',
    'journal-notes',
    'featured-notes'
  ]) {
    assert.ok(html.includes(`id="${id}"`), `missing journal target ${id}`);
  }

  for (const behavior of ['loadJournalData', 'renderSummary', 'renderStreams', 'renderNotes', 'note-details']) {
    assert.ok(source.includes(behavior), `missing journal behavior ${behavior}`);
  }

  assert.ok(!publicFiles.includes('154.37.215.57'));
  assert.ok(!publicFiles.includes('sakura-design-journal.git'));
});
