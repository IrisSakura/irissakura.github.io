import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';

import {
  planEngineeringImport,
  stringifyJson,
  validateEngineeringExport
} from '../scripts/lib/engineering-import-model.mjs';

const sourceCommit = 'a'.repeat(40);
const sourceCommittedAt = '2026-08-30T03:04:05.000Z';

function payload(overrides = {}) {
  return {
    schemaVersion: 2,
    id: 'iris-engineering',
    title: 'Iris Engineering',
    eyebrow: 'IRIS ENGINEERING · CONTROL PLANE',
    headline: '把研发事实组织成可复查的工作流',
    description: '明确事实、授权、执行和验证边界。',
    operatingMode: 'maintenance',
    statusLabel: 'P10',
    status: '本地产品基线已完成。',
    sourceUpdatedAt: sourceCommittedAt,
    workflow: [
      { id: 'observe', label: 'Observe', title: '读取事实', description: '读取稳定事实。' },
      { id: 'authorize', label: 'Authorize', title: '显式授权', description: '限定执行边界。' },
      { id: 'execute', label: 'Execute', title: '受限执行', description: '执行已授权任务。' },
      { id: 'verify', label: 'Verify', title: '验证与审计', description: '记录验证证据。' }
    ],
    capabilities: [
      { id: 'workflow-core', title: 'Workflow Core', description: '稳定工作流合同。', items: ['Closed schema'] },
      { id: 'read-models', title: 'Read Models', description: '只读行动视图。', items: ['Today'] },
      { id: 'research-intake', title: 'Research Intake', description: '待审批研究提案。', items: ['Proposal'] },
      { id: 'agent-execution', title: 'Agent Execution', description: '受限执行合同。', items: ['Lease'] }
    ],
    evidence: [
      { label: '本地产品基线', state: 'local-passed', summary: '本地合同已通过。' },
      { label: '外部读取', state: 'failed-closed', summary: '没有证据时保持失败关闭。' }
    ],
    boundaries: ['外部写入需要单独授权。'],
    ...overrides
  };
}

function exported(payloadValue = payload(), overrides = {}) {
  const payloadText = stringifyJson(payloadValue);
  return {
    payloadText,
    manifest: {
      schemaVersion: 1,
      projectId: 'iris-engineering',
      sourceCommit,
      sourceCommittedAt,
      payload: {
        path: 'iris-engineering.json',
        sha256: createHash('sha256').update(payloadText).digest('hex'),
        bytes: Buffer.byteLength(payloadText)
      },
      ...overrides
    }
  };
}

test('engineering export verifies closed payload, hash and private boundaries', () => {
  const fixture = exported();
  const verified = validateEngineeringExport(fixture.manifest, Buffer.from(fixture.payloadText));
  assert.equal(verified.sourceCommit, sourceCommit);
  assert.equal(verified.payload.sourceUpdatedAt, sourceCommittedAt);
  assert.equal(verified.provenance.payloadSha256, fixture.manifest.payload.sha256);

  assert.throws(() => validateEngineeringExport({ ...fixture.manifest, extra: true }, Buffer.from(fixture.payloadText)), /unknown|shape/iu);
  assert.throws(() => validateEngineeringExport(fixture.manifest, Buffer.from(`${fixture.payloadText} `)), /hash|bytes|tamper/iu);
  const unsafe = exported(payload({ description: 'private /Users/operator/source' }));
  assert.throws(() => validateEngineeringExport(unsafe.manifest, Buffer.from(unsafe.payloadText)), /private|unsafe/iu);
});

test('engineering import plan handles first import, idempotence, drift and ancestry', () => {
  const verified = validateEngineeringExport(exported().manifest, Buffer.from(exported().payloadText));
  assert.equal(planEngineeringImport(null, verified, () => false).kind, 'write');
  assert.equal(planEngineeringImport(verified.provenance, verified, () => false).kind, 'noop');
  assert.throws(() => planEngineeringImport({ ...verified.provenance, payloadSha256: 'b'.repeat(64) }, verified, () => false), /same|drift|hash/iu);

  const next = validateEngineeringExport(
    exported(payload({ sourceUpdatedAt: '2026-08-30T04:04:05.000Z' }), {
      sourceCommit: 'c'.repeat(40),
      sourceCommittedAt: '2026-08-30T04:04:05.000Z'
    }).manifest,
    Buffer.from(exported(payload({ sourceUpdatedAt: '2026-08-30T04:04:05.000Z' }), {
      sourceCommit: 'c'.repeat(40),
      sourceCommittedAt: '2026-08-30T04:04:05.000Z'
    }).payloadText)
  );
  assert.equal(planEngineeringImport(verified.provenance, next, () => true).kind, 'write');
  assert.throws(() => planEngineeringImport(verified.provenance, next, () => false), /ancestor|stale|branch/iu);
});

test('engineering import CLI verifies fixed checkout, updates atomically and rejects a side branch', (context) => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), 'engineering-import-cli-'));
  const siteRoot = join(fixtureRoot, 'site');
  const sourceRoot = join(fixtureRoot, 'source repository');
  const exportRoot = join(fixtureRoot, 'export');
  const cli = join(siteRoot, 'scripts/import-engineering-export.mjs');
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'Iris Test',
    GIT_AUTHOR_EMAIL: 'iris-test@example.invalid',
    GIT_COMMITTER_NAME: 'Iris Test',
    GIT_COMMITTER_EMAIL: 'iris-test@example.invalid',
    GIT_TERMINAL_PROMPT: '0'
  };
  context.after(() => rmSync(fixtureRoot, { recursive: true, force: true }));
  mkdirSync(join(siteRoot, 'scripts/lib'), { recursive: true });
  mkdirSync(join(siteRoot, 'config'), { recursive: true });
  mkdirSync(join(siteRoot, 'data'), { recursive: true });
  mkdirSync(sourceRoot, { recursive: true });
  mkdirSync(exportRoot, { recursive: true });
  copyFileSync(new URL('../scripts/import-engineering-export.mjs', import.meta.url), cli);
  copyFileSync(new URL('../scripts/lib/engineering-import-model.mjs', import.meta.url), join(siteRoot, 'scripts/lib/engineering-import-model.mjs'));

  const git = (...args) => spawnSync('git', ['-C', sourceRoot, ...args], { encoding: 'utf8', env });
  const commit = (message, time) => {
    const commitEnv = { ...env, GIT_AUTHOR_DATE: time, GIT_COMMITTER_DATE: time };
    assert.equal(spawnSync('git', ['-C', sourceRoot, 'add', '--all'], { encoding: 'utf8', env: commitEnv }).status, 0);
    assert.equal(spawnSync('git', ['-C', sourceRoot, 'commit', '-m', message], { encoding: 'utf8', env: commitEnv }).status, 0);
    return git('rev-parse', 'HEAD').stdout.trim();
  };
  const writeExport = (commitSha, time) => {
    const fixture = exported(payload({ sourceUpdatedAt: time }), { sourceCommit: commitSha, sourceCommittedAt: time });
    writeFileSync(join(exportRoot, 'manifest.json'), stringifyJson(fixture.manifest));
    writeFileSync(join(exportRoot, 'iris-engineering.json'), fixture.payloadText);
    return fixture;
  };
  const run = (...extra) => spawnSync(process.execPath, [
    cli,
    '--input', exportRoot,
    '--source-repository', sourceRoot,
    ...extra
  ], { encoding: 'utf8', env });

  assert.equal(git('init', '--initial-branch=main').status, 0);
  writeFileSync(join(sourceRoot, 'source.txt'), 'first\n');
  const firstCommit = commit('first', sourceCommittedAt);
  const firstExport = writeExport(firstCommit, sourceCommittedAt);
  assert.equal(run().status, 0);
  assert.deepEqual(JSON.parse(readFileSync(join(siteRoot, 'data/iris-engineering.json'), 'utf8')), JSON.parse(firstExport.payloadText));
  assert.equal(run('--check').status, 0);
  assert.equal(run().status, 0);

  writeFileSync(join(sourceRoot, 'source.txt'), 'second\n');
  const secondTime = '2026-08-30T04:04:05.000Z';
  const secondCommit = commit('second', secondTime);
  writeExport(secondCommit, secondTime);
  assert.equal(run().status, 0);

  assert.equal(git('switch', '-c', 'side', firstCommit).status, 0);
  writeFileSync(join(sourceRoot, 'source.txt'), 'side\n');
  const sideTime = '2026-08-30T05:04:05.000Z';
  const sideCommit = commit('side', sideTime);
  writeExport(sideCommit, sideTime);
  const rejected = run();
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /ancestor|stale|branch/iu);

  writeFileSync(join(exportRoot, 'unexpected.txt'), 'no\n');
  const extraRejected = run();
  assert.notEqual(extraRejected.status, 0);
  assert.match(extraRejected.stderr, /unexpected|missing/iu);
});
