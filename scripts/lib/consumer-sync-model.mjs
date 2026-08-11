import { createHash } from 'node:crypto';

const SHA_PATTERN = /^[a-f0-9]{40}$/u;
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const PACKAGE_PATTERN = /^com\.unitygame\.framework\.[a-z0-9-]+$/u;
const ISO_INSTANT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/u;
const PRIVATE_TRANSPORT_PATTERN = /(?:\/Users\/|154\.37\.215\.57|\bGitea\b|git@|https?:\/\/)/iu;
const PLAYER_EVIDENCE = 'macOS Player Build + actual smoke';

export function buildConsumerProjection(input) {
  const { config } = input;
  assertExactKeys(config, ['schemaVersion', 'id', 'static', 'player'], 'Consumer sync config');
  if (config.schemaVersion !== 1 || !ID_PATTERN.test(config.id ?? '')) {
    throw new Error('Consumer sync config requires schemaVersion 1 and a valid id.');
  }
  if (config.player !== PLAYER_EVIDENCE) {
    throw new Error('Consumer sync config requires reviewed Player evidence.');
  }
  if (PRIVATE_TRANSPORT_PATTERN.test(JSON.stringify(config))) {
    throw new Error('Consumer sync config contains a private transport or local path.');
  }

  const manifest = parseJson(input.manifest, 'Consumer manifest');
  const frameworkDependencies = Object.entries(manifest.dependencies ?? {})
    .filter(([packageName]) => packageName.startsWith('com.unitygame.framework.'));
  const packages = frameworkDependencies.map(([packageName]) => packageName);
  if (
    packages.length < 2
    || !packages.includes('com.unitygame.framework.core')
    || new Set(packages).size !== packages.length
    || packages.some((packageName) => !PACKAGE_PATTERN.test(packageName))
  ) {
    throw new Error('Consumer manifest requires a valid Framework package set.');
  }
  const frameworkCommits = new Set(frameworkDependencies.map(([, value]) => {
    const match = typeof value === 'string' ? value.match(/#([a-f0-9]{40})$/u) : null;
    if (!match) throw new Error('Consumer manifest Framework packages require exact commits.');
    return match[1];
  }));
  if (frameworkCommits.size !== 1) {
    throw new Error('Consumer manifest must resolve one exact Framework commit.');
  }

  if (!SHA_PATTERN.test(input.consumerCommit ?? '')) {
    throw new Error('Consumer projection requires one exact consumer commit.');
  }
  assertIsoInstant(input.sourceCommittedAt, 'Consumer projection sourceCommittedAt');
  const unityVersion = input.projectVersion.match(/^m_EditorVersion:\s*([^\s]+)\s*$/mu)?.[1];
  if (!unityVersion) throw new Error('Consumer project requires an exact Unity editor version.');

  const projection = {
    schemaVersion: 1,
    id: config.id,
    consumerCommit: input.consumerCommit,
    sourceCommittedAt: input.sourceCommittedAt,
    frameworkCommit: [...frameworkCommits][0],
    unityVersion,
    packages,
    status: 'local-passed',
    runnerStatus: 'runner-pending',
    verification: {
      static: normalizeStatic(config.static),
      editMode: parsePassedXml(config.id, 'EditMode', input.editModeXml),
      playMode: parsePassedXml(config.id, 'PlayMode', input.playModeXml),
      player: PLAYER_EVIDENCE
    }
  };
  assertConsumerProjection(projection);
  return projection;
}

export function mergeConsumerProjection(registry, projection) {
  assertConsumerProjection(projection);
  const next = structuredClone(registry);
  const entry = next.cases?.find((candidate) => candidate.id === projection.id);
  if (!entry) throw new Error(`Consumer projection id is not curated by this site: ${projection.id}.`);
  if (computeConsumerPackageHash(projection.packages) !== entry.reviewedPackageHash) {
    throw new Error(`Consumer ${projection.id} package review is stale; review public copy before importing.`);
  }

  const currentTechnical = technicalProjectionForEntry(entry);
  if (projection.consumerCommit === entry.consumerCommit) {
    if (stableJson(currentTechnical) !== stableJson(projection)) {
      throw new Error(`Consumer ${projection.id} changed facts for the same consumer commit.`);
    }
    return next;
  }
  if (Date.parse(projection.sourceCommittedAt) <= Date.parse(entry.sourceCommittedAt)) {
    throw new Error(`Consumer ${projection.id} projection is stale.`);
  }

  Object.assign(entry, {
    consumerCommit: projection.consumerCommit,
    sourceCommittedAt: projection.sourceCommittedAt,
    frameworkCommit: projection.frameworkCommit,
    unityVersion: projection.unityVersion,
    packages: [...projection.packages],
    status: projection.status,
    runnerStatus: projection.runnerStatus,
    verification: structuredClone(projection.verification)
  });
  next.updatedAt = maxDate(next.updatedAt, projection.sourceCommittedAt.slice(0, 10));
  return next;
}

export function assertConsumerProjection(projection) {
  assertExactKeys(
    projection,
    [
      'schemaVersion',
      'id',
      'consumerCommit',
      'sourceCommittedAt',
      'frameworkCommit',
      'unityVersion',
      'packages',
      'status',
      'runnerStatus',
      'verification'
    ],
    'Consumer projection'
  );
  if (projection.schemaVersion !== 1 || !ID_PATTERN.test(projection.id ?? '')) {
    throw new Error('Consumer projection requires schemaVersion 1 and a valid id.');
  }
  if (!SHA_PATTERN.test(projection.consumerCommit ?? '') || !SHA_PATTERN.test(projection.frameworkCommit ?? '')) {
    throw new Error(`Consumer projection ${projection.id} requires exact commits.`);
  }
  assertIsoInstant(projection.sourceCommittedAt, `Consumer projection ${projection.id} sourceCommittedAt`);
  if (typeof projection.unityVersion !== 'string' || !/^\d+\.\d+\.\d+f\d+c\d+$/u.test(projection.unityVersion)) {
    throw new Error(`Consumer projection ${projection.id} requires an exact Unity version.`);
  }
  if (
    !Array.isArray(projection.packages)
    || projection.packages.length < 2
    || !projection.packages.includes('com.unitygame.framework.core')
    || new Set(projection.packages).size !== projection.packages.length
    || projection.packages.some((packageName) => !PACKAGE_PATTERN.test(packageName))
  ) {
    throw new Error(`Consumer projection ${projection.id} has an invalid Framework package set.`);
  }
  if (projection.status !== 'local-passed' || projection.runnerStatus !== 'runner-pending') {
    throw new Error(`Consumer projection ${projection.id} overstates its evidence status.`);
  }
  assertPassedCount(projection.id, 'EditMode', projection.verification?.editMode);
  assertPassedCount(projection.id, 'PlayMode', projection.verification?.playMode);
  if (
    projection.verification?.static !== null
    && !/^Node \d+\/\d+$/u.test(projection.verification?.static ?? '')
  ) {
    throw new Error(`Consumer projection ${projection.id} has invalid static evidence.`);
  }
  if (projection.verification?.player !== PLAYER_EVIDENCE) {
    throw new Error(`Consumer projection ${projection.id} requires reviewed Player evidence.`);
  }
  if (PRIVATE_TRANSPORT_PATTERN.test(JSON.stringify(projection))) {
    throw new Error('Consumer projection contains a private transport or local path.');
  }
}

export function computeConsumerPackageHash(packages) {
  if (!Array.isArray(packages) || packages.some((packageName) => !PACKAGE_PATTERN.test(packageName))) {
    throw new Error('Consumer package review requires valid Framework package names.');
  }
  return createHash('sha256').update(stableJson([...packages].sort())).digest('hex');
}

export function assertConsumerEvidenceFresh(changedPaths) {
  const stale = changedPaths.find((file) => (
    file === 'Packages'
    || file.startsWith('Packages/')
    || file === 'Assets'
    || file.startsWith('Assets/')
    || file === 'ProjectSettings'
    || file.startsWith('ProjectSettings/')
  ));
  if (stale) {
    throw new Error(`Consumer product path is newer than its Unity evidence: ${stale}.`);
  }
}

function parsePassedXml(caseId, label, xml) {
  const root = xml?.match(/<test-run\b([^>]*)>/u)?.[1];
  if (!root) throw new Error(`Consumer ${caseId} requires passing ${label} XML.`);
  const attributes = Object.fromEntries(
    [...root.matchAll(/([a-z-]+)="([^"]*)"/gu)].map((match) => [match[1], match[2]])
  );
  const result = {
    passed: Number.parseInt(attributes.passed, 10),
    total: Number.parseInt(attributes.total, 10)
  };
  if (
    attributes.result !== 'Passed'
    || Number.parseInt(attributes.failed, 10) !== 0
    || Number.parseInt(attributes.inconclusive, 10) !== 0
    || Number.parseInt(attributes.skipped, 10) !== 0
  ) {
    throw new Error(`Consumer ${caseId} requires passing ${label} XML.`);
  }
  assertPassedCount(caseId, label, result);
  return result;
}

function normalizeStatic(value) {
  if (value === null) return null;
  assertExactKeys(value, ['passed', 'total'], 'Consumer static verification');
  if (!Number.isInteger(value.passed) || value.passed <= 0 || value.passed !== value.total) {
    throw new Error('Consumer static verification must be fully passing.');
  }
  return `Node ${value.passed}/${value.total}`;
}

function technicalProjectionForEntry(entry) {
  return {
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
}

function assertPassedCount(caseId, label, result) {
  if (
    !Number.isInteger(result?.passed)
    || !Number.isInteger(result?.total)
    || result.passed <= 0
    || result.passed !== result.total
  ) {
    throw new Error(`Consumer ${caseId} requires a passing ${label} result.`);
  }
}

function assertExactKeys(value, expected, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (stableJson(actual) !== stableJson(wanted)) {
    throw new Error(`${label} has unexpected or missing fields.`);
  }
}

function assertIsoInstant(value, label) {
  if (!ISO_INSTANT_PATTERN.test(value ?? '') || !Number.isFinite(Date.parse(value))) {
    throw new Error(`${label} must be an ISO-8601 instant.`);
  }
}

function parseJson(value, label) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`${label} must be valid JSON.`);
  }
}

function maxDate(left, right) {
  return left >= right ? left : right;
}

function stableJson(value) {
  return JSON.stringify(value);
}
