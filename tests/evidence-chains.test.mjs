import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { assertEvidenceChains, resolveEvidenceChains } from '../scripts/lib/evidence-chain-model.mjs';

const root = new URL('../', import.meta.url);
const readJson = async (file) => JSON.parse(await readFile(new URL(file, root), 'utf8'));
const readText = async (file) => readFile(new URL(file, root), 'utf8');

test('evidence chains resolve only reviewed game, framework and public research facts', async () => {
  const [data, adoption, journalSource, publication] = await Promise.all([
    readJson('data/evidence-chains.json'),
    readJson('data/framework-adoption.json'),
    readJson('data/journal-source.json'),
    readJson('config/blog-publication.json')
  ]);

  assert.doesNotThrow(() => assertEvidenceChains(data, adoption, journalSource, publication));
  const chains = resolveEvidenceChains(data, adoption, journalSource, publication);
  assert.equal(chains.length, 3);
  assert.ok(chains.every((chain) => chain.research.length > 0));
  assert.ok(chains.some((chain) => chain.research.some((item) => item.href === 'blog/metroidvania-capability-gated-topology.html')));
  assert.ok(chains.some((chain) => chain.research.some((item) => item.href === 'journal/extraction-cross-session-loop.html')));

  const unknownSystem = structuredClone(data);
  unknownSystem.chains[0].gameSystem = '不存在的系统';
  assert.throws(
    () => assertEvidenceChains(unknownSystem, adoption, journalSource, publication),
    /unknown game adoption system/
  );

  const referencedArticleId = data.chains
    .flatMap((chain) => chain.research)
    .find((reference) => reference.type === 'article')?.id;
  assert.ok(referencedArticleId, 'fixture requires a referenced public article');
  const draftPublication = structuredClone(publication);
  draftPublication.articles.find((article) => article.sourceId === referencedArticleId).status = 'draft';
  assert.throws(
    () => assertEvidenceChains(data, adoption, journalSource, draftPublication),
    /is not a published article/
  );
});

test('game, Framework and research pages expose the same bidirectional evidence chain', async () => {
  const [data, game, framework, journal] = await Promise.all([
    readJson('data/evidence-chains.json'),
    readText('pages/game.html'),
    readText('pages/framework.html'),
    readText('pages/journal.html')
  ]);

  for (const chain of data.chains) {
    for (const [page, html] of Object.entries({ game, framework, journal })) {
      assert.ok(html.includes(`id="evidence-chain-${chain.id}"`), `${page} missing ${chain.id}`);
      assert.ok(html.includes(`game.html#${chain.gameAnchor}`), `${page} missing game link for ${chain.id}`);
      assert.ok(html.includes('framework.html#game-adoption'), `${page} missing Framework adoption link`);
    }
    assert.ok(game.includes(`id="${chain.gameAnchor}"`), `game missing source anchor ${chain.gameAnchor}`);
  }
});
