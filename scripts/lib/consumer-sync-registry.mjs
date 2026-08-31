const REGISTRY_KEYS = [
  'schemaVersion',
  'sourcePushCaseIds',
  'fixedSnapshotCaseIds',
  'representativeEvidenceCaseIds'
];

export function resolveConsumerSyncRegistry(registry, consumerLab) {
  if (!registry || Object.keys(registry).sort().join('|') !== [...REGISTRY_KEYS].sort().join('|')) {
    throw new Error('Consumer sync registry must use the closed schemaVersion 1 contract.');
  }
  if (registry.schemaVersion !== 1 || !Array.isArray(consumerLab?.cases) || consumerLab.cases.length === 0) {
    throw new Error('Consumer sync registry requires schemaVersion 1 and reviewed Consumer Cases.');
  }

  const sourcePushCaseIds = assertUniqueIds(registry.sourcePushCaseIds, 'source-push');
  const fixedSnapshotCaseIds = assertUniqueIds(registry.fixedSnapshotCaseIds, 'fixed snapshot');
  const representativeEvidenceCaseIds = assertUniqueIds(
    registry.representativeEvidenceCaseIds,
    'representative evidence'
  );
  const caseIds = consumerLab.cases.map((entry) => entry.id);
  const partition = [...sourcePushCaseIds, ...fixedSnapshotCaseIds];
  if (
    partition.length !== caseIds.length
    || new Set(partition).size !== partition.length
    || !sameSet(partition, caseIds)
  ) {
    throw new Error('Consumer sync registry must partition every Consumer Case exactly once.');
  }
  if (
    representativeEvidenceCaseIds.length < 2
    || representativeEvidenceCaseIds.length > 3
    || representativeEvidenceCaseIds.some((id) => !caseIds.includes(id))
  ) {
    throw new Error('Consumer sync registry representative evidence must select two or three known Cases.');
  }

  const casesById = new Map(consumerLab.cases.map((entry) => [entry.id, entry]));
  for (const id of representativeEvidenceCaseIds) {
    const entry = casesById.get(id);
    if (
      entry.status !== 'local-passed'
      || entry.runnerStatus !== 'runner-pending'
      || entry.verification?.editMode?.passed !== entry.verification?.editMode?.total
      || entry.verification?.playMode?.passed !== entry.verification?.playMode?.total
      || typeof entry.verification?.player !== 'string'
      || entry.verification.player.trim() === ''
    ) {
      throw new Error(`Representative Consumer Case ${id} requires complete reviewed local evidence.`);
    }
  }

  return Object.freeze({
    caseCount: caseIds.length,
    sourcePushCount: sourcePushCaseIds.length,
    fixedSnapshotCount: fixedSnapshotCaseIds.length,
    sourcePushCaseIds,
    fixedSnapshotCaseIds,
    representativeEvidenceCaseIds
  });
}

function assertUniqueIds(value, label) {
  if (
    !Array.isArray(value)
    || value.length === 0
    || value.some((id) => typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id))
    || new Set(value).size !== value.length
  ) {
    throw new Error(`Consumer sync registry ${label} Case IDs must be unique semantic IDs.`);
  }
  return [...value];
}

function sameSet(left, right) {
  return left.length === right.length && left.every((value) => right.includes(value));
}
