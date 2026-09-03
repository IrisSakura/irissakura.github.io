import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  REQUIREMENT_IDS,
  REQUIREMENT_SOURCE_DOCUMENT_HASH,
  REQUIREMENT_TITLES,
  REQUIREMENT_TOPICS,
  REQUIREMENT_TOPOLOGY,
  assertFrameworkRequirementCoverage,
  resolveFrameworkRequirementCoverage
} from '../scripts/lib/framework-requirement-coverage.mjs';

const root = new URL('../', import.meta.url);

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}

test('Framework plan coverage contains exactly REQ-001 through REQ-095', async () => {
  const coverage = await readJson('tests/contracts/framework-plan-coverage.json');

  assert.doesNotThrow(() => assertFrameworkRequirementCoverage(coverage));
  assert.equal(coverage.planVersion, 7);
  assert.equal(coverage.sourceDocumentHash, REQUIREMENT_SOURCE_DOCUMENT_HASH);
  assert.deepEqual(coverage.requirements.map((entry) => entry.id), REQUIREMENT_IDS);
  assert.deepEqual(coverage.requirements.map((entry) => entry.sourceSection), Array.from({ length: 95 }, (_, index) => index + 1));
  assert.deepEqual(coverage.requirements.map((entry) => entry.title), REQUIREMENT_TITLES);
  assert.deepEqual(coverage.requirements.map((entry) => entry.topic), REQUIREMENT_TOPICS);
  assert.equal(coverage.requirements.length, 95);
  assert.deepEqual(
    coverage.requirements.filter((entry) => entry.status === 'non-goal').map((entry) => entry.id),
    ['REQ-075', 'REQ-091']
  );
  assert.ok(coverage.requirements.filter((entry) => entry.status !== 'non-goal').every((entry) => entry.status === 'implemented' && entry.evidence.includes(entry.title)));
  assert.ok(coverage.requirements.every((entry) => entry.owner === REQUIREMENT_TOPOLOGY[entry.topic].owner && entry.route === REQUIREMENT_TOPOLOGY[entry.topic].route));
  for (const entry of coverage.requirements) {
    const [file, anchor] = entry.route.split('#');
    const html = await readFile(new URL(file, root), 'utf8');
    if (anchor) assert.match(html, new RegExp(`\\bid=["']${anchor}["']`, 'u'), `${entry.id} route anchor must exist`);
  }
});

test('Framework plan coverage fails closed on duplicate, unsupported, or under-specified rows', async () => {
  const coverage = await readJson('tests/contracts/framework-plan-coverage.json');

  assert.throws(
    () => assertFrameworkRequirementCoverage({
      ...coverage,
      sourceDocumentHash: 'b'.repeat(64)
    }),
    /source document hash/u
  );
  assert.throws(
    () => assertFrameworkRequirementCoverage({
      ...coverage,
      requirements: coverage.requirements.map((entry, index) => (
        index === 1 ? { ...entry, sourceSection: 1 } : entry
      ))
    }),
    /sourceSection must match/u
  );
  assert.throws(
    () => assertFrameworkRequirementCoverage({
      ...coverage,
      requirements: coverage.requirements.map((entry, index) => (
        index === 1 ? { ...entry, title: 'requirement 002' } : entry
      ))
    }),
    /title must match its source document heading/u
  );
  assert.throws(
    () => assertFrameworkRequirementCoverage({
      ...coverage,
      requirements: coverage.requirements.map((entry, index) => (
        index === 1 ? { ...entry, id: coverage.requirements[0].id } : entry
      ))
    }),
    /ordered REQ-001/
  );
  assert.throws(
    () => assertFrameworkRequirementCoverage({
      ...coverage,
      requirements: coverage.requirements.map((entry) => (
        entry.id === 'REQ-010' ? { ...entry, topic: 'runtime', owner: REQUIREMENT_TOPOLOGY.runtime.owner, route: REQUIREMENT_TOPOLOGY.runtime.route } : entry
      ))
    }),
    /topic must match/
  );
  assert.throws(
    () => assertFrameworkRequirementCoverage({
      ...coverage,
      requirements: coverage.requirements.map((entry) => (
        entry.id === 'REQ-075' ? { ...entry, status: 'implemented', evidence: `不建议投入的内容 ${entry.route}` } : entry
      ))
    }),
    /keys must be exactly|REQ-075 must remain non-goal/
  );
  assert.throws(
    () => assertFrameworkRequirementCoverage({
      ...coverage,
      requirements: coverage.requirements.map((entry) => (
        entry.id === 'REQ-001' ? { ...entry, owner: 'tests/framework-engineering.test.mjs' } : entry
      ))
    }),
    /owner or route does not match/
  );
  assert.throws(
    () => assertFrameworkRequirementCoverage({
      ...coverage,
      requirements: coverage.requirements.map((entry) => entry.id === 'REQ-001' ? { ...entry, evidence: 'generic completion' } : entry)
    }),
    /evidence must identify/
  );
});

test('Framework plan coverage resolution is detached', async () => {
  const coverage = await readJson('tests/contracts/framework-plan-coverage.json');
  const resolved = resolveFrameworkRequirementCoverage(coverage);
  assert.notEqual(resolved.requirements, coverage.requirements);
  resolved.requirements[0].title = 'test-only';
  assert.notEqual(coverage.requirements[0].title, 'test-only');
});
