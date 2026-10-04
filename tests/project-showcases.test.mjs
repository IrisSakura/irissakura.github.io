import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { assertProjectShowcases, renderProjectChapters, renderFrameworkUseCases } from '../scripts/lib/project-showcases.mjs';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const data = JSON.parse(await read('data/project-showcases.json'));

test('project chapters reject media fields and unsafe reading links', () => {
  assertProjectShowcases(data);
  for (const mutate of [
    (copy) => { copy.chapters.wisteria[0].image = 'assets/runtime.png'; },
    (copy) => { copy.chapters.wisteria[0].cards[0].video = 'recording.mp4'; },
    (copy) => { copy.chapters.wisteria[0].links = [{ label: 'Private', href: 'file:///private/source' }]; },
    (copy) => { copy.chapters.wisteria.push(copy.chapters.wisteria[0]); }
  ]) {
    const copy = structuredClone(data); mutate(copy);
    assert.throws(() => assertProjectShowcases(copy), /project-showcases:/u);
  }
});

test('chapter rendering escapes copy and resolves links from nested pages', () => {
  const chapter = structuredClone(data.chapters['the-weaver'].at(-1));
  chapter.title = '<script>example</script>';
  const html = renderProjectChapters([chapter], '../../');
  assert.match(html, /&lt;script&gt;example&lt;\/script&gt;/u);
  assert.doesNotMatch(html, /<script>/u);
  assert.match(html, /href="\.\.\/\.\.\/pages\/mods.html"/u);
});

test('framework scenarios only expose routes present in the effective adoption snapshot', () => {
  const entries = [{ routeId: 'live', title: 'Available', body: 'Live route' }, { routeId: 'pending', title: 'Pending', body: 'Not published' }];
  const html = renderFrameworkUseCases(entries, { stableRoutes: [{ id: 'live', label: 'Live' }] });
  assert.match(html, /href="#adoption-live"/u);
  assert.doesNotMatch(html, /Pending|adoption-pending/u);
});

test('Wisteria ships readable technical chapters without product media', async () => {
  const html = await read('pages/wisteria.html');
  const main = html.match(/<main\b[\s\S]*?<\/main>/u)?.[0];
  assert.ok(main);
  assert.match(main, /data-presentation="text-only"/u);
  assert.doesNotMatch(main, /<(?:img|picture|video|audio|iframe|canvas)\b|world-scene|persona-gallery-stage/u);
  for (const chapter of data.chapters.wisteria) assert.ok(main.includes(`id="${chapter.id}"`));
});

test('new project chapters and the character detail can be found through site search', async () => {
  const index = JSON.parse(await read('data/site-search-index.json'));
  const shelf = index.documents.find((entry) => entry.id === 'project:iris-shelf');
  assert.ok(shelf.keywords.includes('Electron'));
  assert.ok(!shelf.keywords.includes('Tauri 2'));
  assert.ok(index.documents.find((entry) => entry.id === 'project:wisteria').keywords.includes('Godot'));
  assert.equal(index.documents.find((entry) => entry.id === 'project:the-weaver').url, '/pages/mods/the-weaver.html');
  for (const [project, chapters] of Object.entries(data.chapters)) {
    for (const chapter of chapters) assert.ok(index.documents.some((entry) => entry.id === `chapter:${project}:${chapter.id}`));
  }
});
