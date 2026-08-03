import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { assertJsonHasNoDuplicateKeys } from '../scripts/lib/json-integrity.mjs';

const root = new URL('../', import.meta.url);

test('raw JSON validation rejects duplicate keys at every object depth', () => {
  assert.throws(
    () => assertJsonHasNoDuplicateKeys('{"outer":{"value":1,"value":2}}', 'fixture.json'),
    /fixture\.json:1:21: duplicate key "value" at \$\.outer/u
  );
  assert.doesNotThrow(() => assertJsonHasNoDuplicateKeys('{"left":{"value":1},"right":{"value":2}}'));
});

test('repository JSON sources contain no duplicate keys', async () => {
  for (const relativePath of ['package.json', 'package-lock.json', 'tsconfig.json']) {
    const source = await readFile(new URL(relativePath, root), 'utf8');
    assertJsonHasNoDuplicateKeys(source, relativePath);
  }
});
