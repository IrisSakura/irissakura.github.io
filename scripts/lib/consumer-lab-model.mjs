const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA_PATTERN = /^[a-f0-9]{40}$/;
const PACKAGE_PATTERN = /^com\.unitygame\.framework\.[a-z0-9-]+$/;
const PRIVATE_TRANSPORT_PATTERN = /(?:\/Users\/|154\.37\.215\.57|\bGitea\b|git@|https?:\/\/)/iu;

export function assertConsumerLabCurrent(registry) {
  if (registry?.schemaVersion !== 1 || !Array.isArray(registry.cases)) {
    throw new Error('Consumer Lab must use schemaVersion 1 and expose cases.');
  }
  if (!DATE_PATTERN.test(registry.updatedAt ?? '')) {
    throw new Error('Consumer Lab requires a valid updatedAt date.');
  }
  if (!SHA_PATTERN.test(registry.frameworkCommit ?? '')) {
    throw new Error('Consumer Lab requires one exact Framework commit.');
  }
  if (registry.unityVersion !== '2022.3.62f3c1') {
    throw new Error('Consumer Lab Unity version must match the reviewed consumer baseline.');
  }
  if (registry.cases.length !== 4) {
    throw new Error('Consumer Lab must expose exactly four reviewed consumer cases.');
  }
  if (PRIVATE_TRANSPORT_PATTERN.test(JSON.stringify(registry))) {
    throw new Error('Consumer Lab public facts contain a private transport or local path.');
  }

  const ids = new Set();
  for (const entry of registry.cases) {
    if (!ID_PATTERN.test(entry.id ?? '') || ids.has(entry.id)) {
      throw new Error(`Consumer Lab case id is invalid or duplicated: ${entry.id ?? ''}.`);
    }
    ids.add(entry.id);
    if (!SHA_PATTERN.test(entry.consumerCommit ?? '')) {
      throw new Error(`Consumer Lab case ${entry.id} requires an exact consumer commit.`);
    }
    for (const field of ['title', 'summary', 'capability', 'evidenceBoundary']) {
      if (typeof entry[field] !== 'string' || entry[field].trim().length < 12) {
        throw new Error(`Consumer Lab case ${entry.id} requires reviewed ${field} copy.`);
      }
    }
    if (entry.status !== 'local-passed') {
      throw new Error(`Consumer Lab case ${entry.id} must remain local-passed.`);
    }
    if (entry.runnerStatus !== 'runner-pending') {
      throw new Error(`Consumer Lab case ${entry.id} must remain runner-pending.`);
    }
    if (
      !Array.isArray(entry.packages)
      || entry.packages.length < 2
      || !entry.packages.includes('com.unitygame.framework.core')
      || new Set(entry.packages).size !== entry.packages.length
      || entry.packages.some((packageName) => !PACKAGE_PATTERN.test(packageName))
    ) {
      throw new Error(`Consumer Lab case ${entry.id} has an invalid Framework package set.`);
    }
    assertPassedCount(entry.id, 'EditMode', entry.verification?.editMode);
    assertPassedCount(entry.id, 'PlayMode', entry.verification?.playMode);
    if (entry.verification?.player !== 'macOS Player Build + actual smoke') {
      throw new Error(`Consumer Lab case ${entry.id} requires reviewed Player evidence.`);
    }
    if (
      entry.verification.static !== null
      && !/^Node \d+\/\d+$/.test(entry.verification.static ?? '')
    ) {
      throw new Error(`Consumer Lab case ${entry.id} has invalid static evidence.`);
    }
  }
}

function assertPassedCount(caseId, label, result) {
  if (
    !Number.isInteger(result?.passed)
    || !Number.isInteger(result?.total)
    || result.passed <= 0
    || result.passed !== result.total
  ) {
    throw new Error(`Consumer Lab case ${caseId} requires a passing ${label} result.`);
  }
}
