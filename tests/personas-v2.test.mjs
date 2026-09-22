import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { assertPersonas, personaCards } from '../scripts/lib/personas-v2.mjs';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');
const json = async (file) => JSON.parse(await read(file));

test('six current personas preserve approved PNG masters and every optimized derivative', async () => {
  const config = await json('config/personas-v2.json');
  const personas = assertPersonas(config);
  const manifest = await json('assets/personas/v2/manifest.json');
  assert.equal(personas.length, 6);
  for (const persona of personas) {
    const bytes = await readFile(new URL(`${persona.assetRoot}/master/character.png`, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), persona.source.sha256);
    assert.equal(bytes.readUInt32BE(16), 1086);
    assert.equal(bytes.readUInt32BE(20), 1448);
    assert.equal(bytes[25], 6, 'PNG must retain RGBA');
    const derived = manifest.assets.filter((asset) => asset.sourceSha256 === persona.source.sha256);
    assert.equal(derived.length, 6);
    for (const asset of derived) {
      const output = await readFile(new URL(asset.file, root));
      assert.equal(createHash('sha256').update(output).digest('hex'), asset.sha256);
      assert.equal(asset.width * 4, asset.height * 3);
    }
    const page = await read(persona.route.slice(1));
    assert.ok(page.includes(`${persona.assetRoot}/web/character-720.webp`));
    assert.ok(page.includes('type="image/avif"'));
    assert.ok(page.includes('fetchpriority="high"'));
    assert.ok(page.includes(`data-brand-mode="${persona.mode}"`));
  }
  const broken = structuredClone(config); broken.personas[5].route = broken.personas[0].route;
  assert.throws(() => assertPersonas(broken), /invalid path/);
});

test('six visitor entry points resolve locally and rendered pages do not reference old personas', async () => {
  const { personas } = await json('config/personas-v2.json');
  const brand = await json('config/brand.json');
  const html = personaCards(personas, brand, { prefix: '../', kind: 'development' });
  for (const persona of personas) {
    assert.ok(html.includes(`href="${persona.route.replace('/pages/', '')}"`));
    for (const file of ['index.html', 'pages/development.html', 'pages/brand.html', 'pages/contact.html']) {
      assert.ok((await read(file)).includes(persona.project), `${file} missing ${persona.id}`);
    }
  }
  const walk = async (directory) => {
    for (const item of await readdir(new URL(directory, root), { withFileTypes: true })) {
      const file = `${directory}/${item.name}`;
      if (item.isDirectory()) await walk(file);
      else if (file.endsWith('.html')) assert.doesNotMatch(await read(file), /(?:src|srcset)="[^"]*(?:brand\/v1\/|brand\/site-v2\/|character-freesia-hero|hero-(?:iris-engineering|sakura-framework|journal)-v1)/u);
    }
  };
  await walk('pages');
  assert.doesNotMatch(await read('index.html'), /brand\/(?:v1|site-v2)\//u);
  const wisteria = await read('pages/wisteria.html');
  assert.match(wisteria, /正在制作中/u);
  assert.doesNotMatch(wisteria, /<a[^>]+download/u);
});
