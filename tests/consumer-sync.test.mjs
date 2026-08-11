import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

import {
  assertConsumerEvidenceFresh,
  buildConsumerProjection,
  computeConsumerPackageHash,
  mergeConsumerProjection
} from '../scripts/lib/consumer-sync-model.mjs';
import { isConsumerSyncOwnedPath } from '../scripts/verify-consumer-sync-scope.mjs';

const CONSUMER_COMMIT = '1234567890abcdef1234567890abcdef12345678';
const FRAMEWORK_COMMIT = 'abcdef1234567890abcdef1234567890abcdef12';
const PACKAGES = [
  'com.unitygame.framework.core',
  'com.unitygame.framework.pathfinding'
];
const execFileAsync = promisify(execFile);
const root = new URL('../', import.meta.url);

test('consumer exporter emits only a sanitized technical projection', () => {
  const projection = buildConsumerProjection({
    config: {
      schemaVersion: 1,
      id: 'route-wave-td',
      static: null,
      player: 'macOS Player Build + actual smoke'
    },
    consumerCommit: CONSUMER_COMMIT,
    sourceCommittedAt: '2026-08-11T12:58:27+08:00',
    manifest: manifestFor(PACKAGES),
    projectVersion: 'm_EditorVersion: 2022.3.62f3c1\n',
    editModeXml: passedXml(6),
    playModeXml: passedXml(3)
  });

  assert.deepEqual(projection, {
    schemaVersion: 1,
    id: 'route-wave-td',
    consumerCommit: CONSUMER_COMMIT,
    sourceCommittedAt: '2026-08-11T12:58:27+08:00',
    frameworkCommit: FRAMEWORK_COMMIT,
    unityVersion: '2022.3.62f3c1',
    packages: PACKAGES,
    status: 'local-passed',
    runnerStatus: 'runner-pending',
    verification: {
      static: null,
      editMode: { passed: 6, total: 6 },
      playMode: { passed: 3, total: 3 },
      player: 'macOS Player Build + actual smoke'
    }
  });
  assert.doesNotMatch(JSON.stringify(projection), /(?:154\.37\.215\.57|git@|https?:\/\/|\/Users\/)/u);
});

test('consumer exporter rejects failed Unity XML and mixed Framework commits', () => {
  const input = {
    config: {
      schemaVersion: 1,
      id: 'route-wave-td',
      static: null,
      player: 'macOS Player Build + actual smoke'
    },
    consumerCommit: CONSUMER_COMMIT,
    sourceCommittedAt: '2026-08-11T12:58:27+08:00',
    manifest: manifestFor(PACKAGES),
    projectVersion: 'm_EditorVersion: 2022.3.62f3c1\n',
    editModeXml: passedXml(6),
    playModeXml: passedXml(3)
  };
  assert.throws(
    () => buildConsumerProjection({ ...input, editModeXml: failedXml() }),
    /passing EditMode/u
  );

  const mixedManifest = JSON.parse(input.manifest);
  mixedManifest.dependencies['com.unitygame.framework.pathfinding'] =
    'http://private.invalid/framework.git?path=/pathfinding#1111111111111111111111111111111111111111';
  assert.throws(
    () => buildConsumerProjection({ ...input, manifest: JSON.stringify(mixedManifest) }),
    /one exact Framework commit/u
  );
});

test('consumer import advances technical facts without rewriting curated copy', () => {
  const registry = registryFixture();
  const projection = projectionFixture({
    consumerCommit: '2222222222222222222222222222222222222222',
    sourceCommittedAt: '2026-08-12T08:30:00+08:00',
    verification: {
      static: 'Node 2/2',
      editMode: { passed: 7, total: 7 },
      playMode: { passed: 4, total: 4 },
      player: 'macOS Player Build + actual smoke'
    }
  });

  const next = mergeConsumerProjection(registry, projection);
  assert.equal(next.updatedAt, '2026-08-12');
  assert.equal(next.cases[0].consumerCommit, projection.consumerCommit);
  assert.deepEqual(next.cases[0].verification, projection.verification);
  assert.deepEqual(
    pickCurated(next.cases[0]),
    pickCurated(registry.cases[0])
  );
  assert.deepEqual(registry, registryFixture(), 'merge must not mutate its inputs');
});

test('consumer import is idempotent and rejects stale, tampered or semantic drift', () => {
  const registry = registryFixture();
  const current = projectionFixture();
  assert.deepEqual(mergeConsumerProjection(registry, current), registry);

  assert.throws(
    () => mergeConsumerProjection(registry, projectionFixture({
      consumerCommit: '3333333333333333333333333333333333333333',
      sourceCommittedAt: '2026-08-10T08:00:00+08:00'
    })),
    /stale/u
  );

  assert.throws(
    () => mergeConsumerProjection(registry, projectionFixture({
      verification: {
        static: 'Node 9/9',
        editMode: { passed: 6, total: 6 },
        playMode: { passed: 3, total: 3 },
        player: 'macOS Player Build + actual smoke'
      }
    })),
    /same consumer commit/u
  );

  assert.throws(
    () => mergeConsumerProjection(registry, projectionFixture({
      consumerCommit: '4444444444444444444444444444444444444444',
      sourceCommittedAt: '2026-08-12T08:00:00+08:00',
      packages: [...PACKAGES, 'com.unitygame.framework.swarm']
    })),
    /package review/u
  );
});

test('consumer evidence freshness allows governance files but rejects later product changes', () => {
  assert.doesNotThrow(() => assertConsumerEvidenceFresh([
    'README.md',
    'consumer-site.v1.json',
    '.gitea/workflows/sync-personal-site.yml'
  ]));
  assert.throws(
    () => assertConsumerEvidenceFresh(['Assets/SakuraConsumer/GameHost.cs']),
    /newer than its Unity evidence/u
  );
  assert.throws(
    () => assertConsumerEvidenceFresh(['Packages/manifest.json']),
    /newer than its Unity evidence/u
  );
  assert.throws(
    () => assertConsumerEvidenceFresh(['ProjectSettings/ProjectSettings.asset']),
    /newer than its Unity evidence/u
  );
});

test('consumer sync owns only its internal registry and generated portfolio page', () => {
  for (const owned of ['data/consumer-lab.json', 'pages/portfolio.html']) {
    assert.equal(isConsumerSyncOwnedPath(owned), true, `missing owned sync path ${owned}`);
  }
  for (const forbidden of [
    'package.json',
    'scripts/import-consumer-projection.mjs',
    'pages/framework.html',
    'style/portfolio.css',
    '.github/workflows/site-quality-and-pages.yml',
    'data/../README.md'
  ]) {
    assert.equal(isConsumerSyncOwnedPath(forbidden), false, `sync must not own ${forbidden}`);
  }
});

test('consumer export command binds XML evidence to the fixed Git commit', async () => {
  const source = await mkdtemp(path.join(tmpdir(), 'consumer-sync-source-'));
  const output = path.join(source, 'projection.json');
  try {
    await execFileAsync('git', ['init', '-q'], { cwd: source });
    await execFileAsync('git', ['config', 'user.name', 'Consumer Sync Test'], { cwd: source });
    await execFileAsync('git', ['config', 'user.email', 'consumer-sync@example.invalid'], { cwd: source });
    await mkdir(path.join(source, 'Assets'), { recursive: true });
    await mkdir(path.join(source, 'Packages'), { recursive: true });
    await mkdir(path.join(source, 'ProjectSettings'), { recursive: true });
    await mkdir(path.join(source, 'evidence', FRAMEWORK_COMMIT), { recursive: true });
    await writeFile(path.join(source, 'consumer-site.v1.json'), JSON.stringify({
      schemaVersion: 1,
      id: 'route-wave-td',
      static: null,
      player: 'macOS Player Build + actual smoke'
    }));
    await writeFile(path.join(source, 'Assets', 'Game.cs'), 'sealed class Game {}\n');
    await writeFile(path.join(source, 'Packages', 'manifest.json'), manifestFor(PACKAGES));
    await writeFile(path.join(source, 'ProjectSettings', 'ProjectVersion.txt'), 'm_EditorVersion: 2022.3.62f3c1\n');
    await writeFile(path.join(source, 'evidence', FRAMEWORK_COMMIT, 'editmode-results.xml'), passedXml(6));
    await writeFile(path.join(source, 'evidence', FRAMEWORK_COMMIT, 'playmode-results.xml'), passedXml(3));
    await execFileAsync('git', ['add', '--', '.'], { cwd: source });
    await execFileAsync('git', ['commit', '-q', '-m', 'verified consumer'], { cwd: source });
    const { stdout: consumerCommit } = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: source });

    await execFileAsync(process.execPath, [
      'scripts/export-consumer-projection.mjs',
      '--source', source,
      '--commit', consumerCommit.trim(),
      '--output', output
    ], { cwd: root });
    const projection = JSON.parse(await readFile(output, 'utf8'));
    assert.equal(projection.consumerCommit, consumerCommit.trim());
    assert.deepEqual(projection.packages, PACKAGES);

    await writeFile(path.join(source, 'Assets', 'Game.cs'), 'sealed class Game { public int Version => 2; }\n');
    await execFileAsync('git', ['add', '--', 'Assets/Game.cs'], { cwd: source });
    await execFileAsync('git', ['commit', '-q', '-m', 'unverified product change'], { cwd: source });
    const { stdout: staleCommit } = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: source });
    await assert.rejects(
      execFileAsync(process.execPath, [
        'scripts/export-consumer-projection.mjs',
        '--source', source,
        '--commit', staleCommit.trim(),
        '--output', output
      ], { cwd: root }),
      /newer than its Unity evidence/u
    );
  } finally {
    await rm(source, { recursive: true, force: true });
  }
});

test('consumer import command verifies an already current projection without rewriting', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'consumer-sync-import-'));
  try {
    const registry = JSON.parse(await readFile(new URL('data/consumer-lab.json', root), 'utf8'));
    const entry = registry.cases[0];
    const projection = {
      schemaVersion: 1,
      id: entry.id,
      consumerCommit: entry.consumerCommit,
      sourceCommittedAt: entry.sourceCommittedAt,
      frameworkCommit: entry.frameworkCommit,
      unityVersion: entry.unityVersion,
      packages: entry.packages,
      status: entry.status,
      runnerStatus: entry.runnerStatus,
      verification: entry.verification
    };
    const input = path.join(directory, 'projection.json');
    await writeFile(input, `${JSON.stringify(projection, null, 2)}\n`);
    const { stdout } = await execFileAsync(process.execPath, [
      'scripts/import-consumer-projection.mjs',
      '--input', input,
      '--check'
    ], { cwd: root });
    assert.match(stdout, /Consumer Lab import matches route-wave-td@60c227c7/u);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

function manifestFor(packages) {
  return JSON.stringify({
    dependencies: Object.fromEntries(packages.map((packageName) => [
      packageName,
      `http://154.37.215.57:3000/private/framework.git?path=/${packageName}#${FRAMEWORK_COMMIT}`
    ]))
  });
}

function passedXml(total) {
  return `<?xml version="1.0"?><test-run result="Passed" total="${total}" passed="${total}" failed="0" inconclusive="0" skipped="0"></test-run>`;
}

function failedXml() {
  return '<?xml version="1.0"?><test-run result="Failed" total="1" passed="0" failed="1" inconclusive="0" skipped="0"></test-run>';
}

function registryFixture() {
  return {
    schemaVersion: 2,
    updatedAt: '2026-08-11',
    title: '四个独立玩法项目',
    description: '面向访客的整体说明，保持由网站所有。',
    evidenceBoundary: '内部边界只用于校验，不在公开页面呈现。',
    cases: [{
      id: 'route-wave-td',
      title: 'Route-Wave TD',
      category: '塔防原型',
      summary: '面向访客的项目摘要不会被消费者投影覆盖。',
      highlights: ['路线封锁', '波次推进', '建造窗口', '胜负结算'],
      capability: '内部能力说明保留在站点策展数据中用于复核。',
      consumerCommit: CONSUMER_COMMIT,
      sourceCommittedAt: '2026-08-11T12:58:27+08:00',
      frameworkCommit: FRAMEWORK_COMMIT,
      unityVersion: '2022.3.62f3c1',
      packages: PACKAGES,
      reviewedPackageHash: computeConsumerPackageHash(PACKAGES),
      status: 'local-passed',
      runnerStatus: 'runner-pending',
      verification: {
        static: null,
        editMode: { passed: 6, total: 6 },
        playMode: { passed: 3, total: 3 },
        player: 'macOS Player Build + actual smoke'
      },
      evidenceBoundary: '当前没有远端 Runner、签名或 Release 证据。'
    }]
  };
}

function projectionFixture(overrides = {}) {
  return {
    schemaVersion: 1,
    id: 'route-wave-td',
    consumerCommit: CONSUMER_COMMIT,
    sourceCommittedAt: '2026-08-11T12:58:27+08:00',
    frameworkCommit: FRAMEWORK_COMMIT,
    unityVersion: '2022.3.62f3c1',
    packages: PACKAGES,
    status: 'local-passed',
    runnerStatus: 'runner-pending',
    verification: {
      static: null,
      editMode: { passed: 6, total: 6 },
      playMode: { passed: 3, total: 3 },
      player: 'macOS Player Build + actual smoke'
    },
    ...overrides
  };
}

function pickCurated(entry) {
  return {
    title: entry.title,
    category: entry.category,
    summary: entry.summary,
    highlights: entry.highlights,
    capability: entry.capability,
    evidenceBoundary: entry.evidenceBoundary,
    reviewedPackageHash: entry.reviewedPackageHash
  };
}
