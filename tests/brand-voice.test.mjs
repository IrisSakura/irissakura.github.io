import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readText = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

test('core routes expose value-first narrative stages', async () => {
  for (const page of ['index.html', 'pages/portfolio.html', 'pages/engineering.html', 'pages/framework.html', 'pages/journal.html']) {
    const html = await readText(page);
    for (const stage of ['value', 'system', 'result', 'evidence', 'boundary', 'next']) {
      assert.ok(html.includes(`data-content-stage="${stage}"`), `${page} missing ${stage} stage`);
    }
    const hero = html.match(/<(section|header|div)\b[^>]*(?:hero|page-cover)[\s\S]*?<\/\1>/)?.[0] ?? '';
    assert.ok(hero.length > 0, `${page} missing hero`);
    assert.doesNotMatch(hero, /\b(?:EVIDENCE|VERIFIED|BOUNDARY)\b/g, `${page} hero leads with proof language`);
  }
});

test('games preserve player-first identity and receive only small brand attribution', async () => {
  const game = await readText('pages/game.html');
  assert.ok(game.includes('data-game-brand-attribution'));
  assert.ok(game.includes('IRIS × SAKURA 技术生态支持'));
  assert.doesNotMatch(game, /class="brand-mode-signature"/);
  const hero = game.match(/<(header|section)\b[^>]*game-hero[\s\S]*?<\/\1>/)?.[0] ?? '';
  assert.match(hero, /玩家|战斗|房间|构筑/);
});
