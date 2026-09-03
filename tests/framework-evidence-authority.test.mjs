import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  AUTHORITY_IDS,
  EVIDENCE_LEVELS,
  assertFrameworkEvidenceAuthorities,
  resolveFrameworkEvidenceAuthorities
} from '../scripts/lib/framework-evidence-authority.mjs';

const root = new URL('../', import.meta.url);

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}

test('Framework evidence authorities preserve independent evidence levels', async () => {
  const authorities = await readJson('tests/contracts/framework-evidence-authorities.json');

  assert.doesNotThrow(() => assertFrameworkEvidenceAuthorities(authorities));
  assert.deepEqual(authorities.levels.map((entry) => entry.id), EVIDENCE_LEVELS);
  assert.equal(authorities.levels.length, 8);
  assert.deepEqual(authorities.authorities.map((entry) => entry.id), AUTHORITY_IDS);
  assert.equal(authorities.authorities.find((entry) => entry.id === 'designed').level, 'designed');
  assert.equal(authorities.authorities.find((entry) => entry.id === 'implemented').level, 'implemented');
  assert.equal(authorities.authorities.find((entry) => entry.id === 'local').level, 'local-verification');
  assert.equal(authorities.authorities.find((entry) => entry.id === 'runner').level, 'ci-runner');
  assert.equal(authorities.authorities.find((entry) => entry.id === 'consumer').level, 'consumer-validation');
  assert.equal(authorities.authorities.find((entry) => entry.id === 'release').level, 'release');
  assert.equal(authorities.authorities.find((entry) => entry.id === 'production').level, 'production');
  assert.equal(authorities.authorities.find((entry) => entry.id === 'unknown').level, 'unknown-deferred');
  assert.notEqual(
    authorities.authorities.find((entry) => entry.id === 'local').source,
    authorities.authorities.find((entry) => entry.id === 'runner').source
  );
  assert.ok(authorities.boundaries.length >= 4);
});

test('Framework evidence authorities fail closed on cross-level claims', async () => {
  const authorities = await readJson('tests/contracts/framework-evidence-authorities.json');

  assert.throws(
    () => assertFrameworkEvidenceAuthorities({
      ...authorities,
      authorities: authorities.authorities.map((entry) => (
        entry.id === 'runner' ? { ...entry, level: 'production' } : entry
      ))
    }),
    /crosses its authority boundary/
  );
  assert.throws(
    () => assertFrameworkEvidenceAuthorities({
      ...authorities,
      authorities: authorities.authorities.map((entry) => (
        entry.id === 'local' ? { ...entry, source: 'same-SHA Runner artifacts' } : entry
      ))
    }),
    /source crosses its authority boundary/
  );
  assert.throws(
    () => assertFrameworkEvidenceAuthorities({
      ...authorities,
      authorities: authorities.authorities.map((entry) => (
        entry.id === 'production'
          ? { ...entry, mayNotClaim: ['不能把本地或 Runner 证据升级为其他等级'] }
          : entry
      ))
    }),
    /explicitly prohibit unverified production claims/
  );
  assert.throws(
    () => assertFrameworkEvidenceAuthorities({
      ...authorities,
      authorities: authorities.authorities.map((entry) => (
        entry.id === 'unknown'
          ? { ...entry, mayClaim: ['unverified'] }
          : entry
      ))
    }),
    /must preserve Unknown or Deferred/
  );
});

test('Framework evidence authority resolution detaches lists', async () => {
  const authorities = await readJson('tests/contracts/framework-evidence-authorities.json');
  const resolved = resolveFrameworkEvidenceAuthorities(authorities);
  assert.notEqual(resolved.authorities, authorities.authorities);
  resolved.authorities[0].mayClaim.push('test-only');
  assert.equal(authorities.authorities[0].mayClaim.includes('test-only'), false);
});
