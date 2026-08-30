import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  applyPublicProjectToRegistry,
  planPublicProjectImport,
  stringifyJson,
  stringifyProjectRegistry,
  validatePublicProjectExport
} from '../scripts/lib/public-project-import-model.mjs';

const sourceCommit = 'a'.repeat(40);
const profileCommit = 'b'.repeat(40);
const sourceCommittedAt = '2026-08-31T01:02:03.000Z';
const profileCommittedAt = '2026-08-30T03:04:05.000Z';

function project(overrides = {}) {
  return {
    id: 'iris-shelf',
    title: 'Iris Shelf',
    category: 'tool',
    categoryLabel: '桌面开发工具',
    status: '完整本地产品',
    syncMode: 'source-push',
    syncLabel: '源仓推送公开投影',
    updatedAt: '2026-08-30',
    lastReviewedAt: '2026-08-30',
    year: 2026,
    role: '桌面产品 / 本地开发入口',
    summary: '独立 local-first 桌面伴侣。',
    technologies: ['Tauri 2', 'Rust'],
    goal: '提供安静且可恢复的本地入口。',
    constraints: ['本地优先且无遥测'],
    evidence: ['完整 v1 桌面功能面'],
    milestones: ['完成 Iris Shelf v1 本地产品'],
    limitations: ['尚未签名、公证或公开发布'],
    next: ['开始 Personal Beta 常态使用'],
    linkLabel: '当前状态已公开',
    proof: [
      { value: 'LOCAL', label: 'Local-first desktop' },
      { value: 'READ-ONLY', label: 'Git health' },
      { value: 'V1', label: 'Companion interop' }
    ],
    proofFooter: 'UNSIGNED UNIVERSAL BUNDLE · LOCAL INTEROP PASSED',
    visualLabel: 'DESKTOP PRODUCT',
    featured: true,
    sourceFacts: { kind: 'desktop-app', productVersion: '1.0.0' },
    ...overrides
  };
}

function exported(projectValue = project(), overrides = {}) {
  const payload = {
    schemaVersion: 1,
    projectId: projectValue.id,
    sourceUpdatedAt: profileCommittedAt,
    project: projectValue
  };
  const payloadText = stringifyJson(payload);
  return {
    payloadText,
    manifest: {
      schemaVersion: 1,
      projectId: projectValue.id,
      sourceCommit,
      sourceCommittedAt,
      profileCommit,
      profileCommittedAt,
      payload: {
        path: `${projectValue.id}.json`,
        sha256: createHash('sha256').update(payloadText).digest('hex'),
        bytes: Buffer.byteLength(payloadText)
      },
      ...overrides
    }
  };
}

test('public project export validates closed shape, hash and private boundaries', () => {
  const fixture = exported();
  const verified = validatePublicProjectExport(fixture.manifest, Buffer.from(fixture.payloadText), 'iris-shelf');
  assert.equal(verified.payload.project.syncMode, 'source-push');
  assert.equal(verified.provenance.sourceCommit, sourceCommit);
  assert.equal(verified.provenance.profileCommit, profileCommit);
  assert.throws(() => validatePublicProjectExport({ ...fixture.manifest, extra: true }, Buffer.from(fixture.payloadText), 'iris-shelf'), /shape|unknown/iu);
  assert.throws(() => validatePublicProjectExport(fixture.manifest, Buffer.from(`${fixture.payloadText} `), 'iris-shelf'), /hash|bytes|tamper/iu);
  const unsafe = exported(project({ summary: 'private /Users/operator/source' }));
  assert.throws(() => validatePublicProjectExport(unsafe.manifest, Buffer.from(unsafe.payloadText), 'iris-shelf'), /private|unsafe/iu);
});

test('public project import plan handles first import, idempotence, drift and ancestry', () => {
  const fixture = exported();
  const verified = validatePublicProjectExport(fixture.manifest, Buffer.from(fixture.payloadText), 'iris-shelf');
  assert.equal(planPublicProjectImport(null, verified, () => false).kind, 'write');
  assert.equal(planPublicProjectImport(verified.provenance, verified, () => false).kind, 'noop');
  assert.throws(() => planPublicProjectImport({ ...verified.provenance, payloadSha256: 'c'.repeat(64) }, verified, () => false), /same|drift|hash/iu);
  const advancedFixture = exported(project(), { sourceCommit: 'd'.repeat(40), sourceCommittedAt: '2026-08-31T02:02:03.000Z' });
  const advanced = validatePublicProjectExport(advancedFixture.manifest, Buffer.from(advancedFixture.payloadText), 'iris-shelf');
  assert.equal(planPublicProjectImport(verified.provenance, advanced, () => true).kind, 'write');
  assert.throws(() => planPublicProjectImport(verified.provenance, advanced, () => false), /ancestor|stale|branch/iu);
});

test('registry update replaces exactly one project and recomputes factual date', () => {
  const registry = {
    schemaVersion: 3,
    updatedAt: '2026-08-29',
    projects: [project({ syncMode: 'versioned-review', syncLabel: '版本化产品状态' }), project({ id: 'other', title: 'Other', updatedAt: '2026-08-29', lastReviewedAt: '2026-08-29' })]
  };
  const updated = applyPublicProjectToRegistry(registry, exported().payloadText);
  assert.equal(updated.projects.length, 2);
  assert.equal(updated.projects[0].syncMode, 'source-push');
  assert.equal(updated.updatedAt, '2026-08-30');
  assert.equal(updated.projects[1].title, 'Other');
  const originalText = stringifyProjectRegistry(registry);
  const updatedText = stringifyProjectRegistry(updated);
  assert.deepEqual(JSON.parse(updatedText), updated);
  assert.match(updatedText, /"technologies": \["Tauri 2", "Rust"\]/u);
  assert.match(updatedText, /\{ "value": "LOCAL", "label": "Local-first desktop" \}/u);
  assert.equal(projectBlock(updatedText, 'other'), projectBlock(originalText, 'other'));
});

test('public project import CLI binds exact checkout, writes atomically and advances provenance on unrelated commits', (context) => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), 'public-project-import-cli-'));
  const siteRoot = join(fixtureRoot, 'site');
  const sourceRoot = join(fixtureRoot, 'source repository');
  const exportRoot = join(fixtureRoot, 'export');
  const cli = join(siteRoot, 'scripts/import-public-project-export.mjs');
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'Project Test', GIT_AUTHOR_EMAIL: 'project-test@example.invalid',
    GIT_COMMITTER_NAME: 'Project Test', GIT_COMMITTER_EMAIL: 'project-test@example.invalid',
    GIT_TERMINAL_PROMPT: '0', GIT_LFS_SKIP_SMUDGE: '1'
  };
  context.after(() => rmSync(fixtureRoot, { recursive: true, force: true }));
  mkdirSync(join(siteRoot, 'scripts/lib'), { recursive: true });
  mkdirSync(join(siteRoot, 'config/project-sync'), { recursive: true });
  mkdirSync(join(siteRoot, 'data'), { recursive: true });
  mkdirSync(sourceRoot, { recursive: true });
  mkdirSync(exportRoot, { recursive: true });
  copyFileSync(new URL('../scripts/import-public-project-export.mjs', import.meta.url), cli);
  copyFileSync(new URL('../scripts/lib/public-project-import-model.mjs', import.meta.url), join(siteRoot, 'scripts/lib/public-project-import-model.mjs'));
  writeFileSync(join(siteRoot, 'data/projects.json'), stringifyJson({
    schemaVersion: 3,
    updatedAt: '2026-08-30',
    projects: [project({ syncMode: 'versioned-review', syncLabel: '版本化产品状态' })]
  }));
  const git = (...args) => spawnSync('git', ['-C', sourceRoot, ...args], { encoding: 'utf8', env });
  assert.equal(git('init', '--initial-branch=main').status, 0);
  writeFileSync(join(sourceRoot, 'profile.txt'), 'first\n');
  assert.equal(git('add', '--all').status, 0);
  assert.equal(spawnSync('git', ['-C', sourceRoot, 'commit', '-m', 'profile'], { encoding: 'utf8', env: { ...env, GIT_AUTHOR_DATE: profileCommittedAt, GIT_COMMITTER_DATE: profileCommittedAt } }).status, 0);
  const profileRevision = git('rev-parse', 'HEAD').stdout.trim();
  const writeExport = (commit, commitTime) => {
    const payload = { schemaVersion: 1, projectId: 'iris-shelf', sourceUpdatedAt: profileCommittedAt, project: project() };
    const payloadText = stringifyJson(payload);
    const manifest = {
      schemaVersion: 1, projectId: 'iris-shelf', sourceCommit: commit, sourceCommittedAt: commitTime,
      profileCommit: profileRevision, profileCommittedAt,
      payload: { path: 'iris-shelf.json', sha256: createHash('sha256').update(payloadText).digest('hex'), bytes: Buffer.byteLength(payloadText) }
    };
    writeFileSync(join(exportRoot, 'manifest.json'), stringifyJson(manifest));
    writeFileSync(join(exportRoot, 'iris-shelf.json'), payloadText);
  };
  const run = (...extra) => spawnSync(process.execPath, [cli, '--project', 'iris-shelf', '--input', exportRoot, '--source-repository', sourceRoot, ...extra], { encoding: 'utf8', env });
  writeExport(profileRevision, profileCommittedAt);
  assert.equal(run().status, 0);
  assert.equal(run('--check').status, 0);
  assert.equal(JSON.parse(readFileSync(join(siteRoot, 'data/projects.json'), 'utf8')).projects[0].syncMode, 'source-push');
  writeFileSync(join(sourceRoot, 'unrelated.txt'), 'second\n');
  assert.equal(git('add', '--all').status, 0);
  const secondTime = '2026-08-31T02:02:03.000Z';
  assert.equal(spawnSync('git', ['-C', sourceRoot, 'commit', '-m', 'unrelated'], { encoding: 'utf8', env: { ...env, GIT_AUTHOR_DATE: secondTime, GIT_COMMITTER_DATE: secondTime } }).status, 0);
  const secondCommit = git('rev-parse', 'HEAD').stdout.trim();
  writeExport(secondCommit, secondTime);
  assert.equal(run().status, 0);
  assert.equal(run('--check').status, 0);
  const provenance = JSON.parse(readFileSync(join(siteRoot, 'config/project-sync/iris-shelf.json'), 'utf8'));
  assert.equal(provenance.sourceCommit, secondCommit);
  assert.equal(provenance.profileCommit, profileRevision);
});

function projectBlock(body, projectId) {
  const start = body.indexOf(`    {\n      "id": ${JSON.stringify(projectId)}`);
  assert.notEqual(start, -1, `missing project block ${projectId}`);
  const end = body.indexOf('\n    }', start);
  assert.notEqual(end, -1, `unterminated project block ${projectId}`);
  return body.slice(start, end + '\n    }'.length);
}
