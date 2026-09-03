const AUTHORITY_IDS = [
  'designed',
  'implemented',
  'local',
  'runner',
  'consumer',
  'release',
  'production',
  'unknown'
];
const EVIDENCE_LEVELS = [
  'designed',
  'implemented',
  'local-verification',
  'ci-runner',
  'consumer-validation',
  'release',
  'production',
  'unknown-deferred'
];
const AUTHORITY_LEVELS = Object.freeze({
  designed: 'designed',
  implemented: 'implemented',
  local: 'local-verification',
  runner: 'ci-runner',
  consumer: 'consumer-validation',
  release: 'release',
  production: 'production',
  unknown: 'unknown-deferred'
});
const LEVEL_LABELS = Object.freeze({
  designed: 'Designed',
  implemented: 'Implemented',
  'local-verification': 'Local Verification',
  'ci-runner': 'CI / Runner',
  'consumer-validation': 'Consumer Validation',
  release: 'Release',
  production: 'Production',
  'unknown-deferred': 'Unknown / Deferred'
});
const AUTHORITY_SOURCES = Object.freeze({
  designed: 'Framework Work Status / spec-plan',
  implemented: 'Framework snapshot / committed code',
  local: 'site local evidence records',
  runner: 'same-SHA Runner artifacts',
  consumer: 'consumer registry',
  release: 'release metadata',
  production: 'production record',
  unknown: 'explicit boundary'
});

export { AUTHORITY_IDS, AUTHORITY_LEVELS, EVIDENCE_LEVELS };

export function assertFrameworkEvidenceAuthorities(value) {
  assertObject(value, 'framework evidence authorities');
  assertExactKeys(value, ['schemaVersion', 'id', 'levels', 'authorities', 'boundaries'], 'framework evidence authorities');
  if (value.schemaVersion !== 1 || value.id !== 'framework-evidence-authorities') {
    throw new Error('framework evidence authorities identity or schema is unsupported');
  }
  assertOrderedEntries(value.levels, EVIDENCE_LEVELS, 'framework evidence levels', ['id', 'label', 'meaning'], (entry, label) => {
    if (entry.label !== LEVEL_LABELS[entry.id]) throw new Error(label + '.label drifted from the locked evidence level');
    assertString(entry.label, label + '.label');
    assertString(entry.meaning, label + '.meaning');
  });
  assertOrderedEntries(value.authorities, AUTHORITY_IDS, 'framework evidence authorities', ['id', 'label', 'source', 'level', 'mayClaim', 'mayNotClaim'], (entry, label) => {
    assertString(entry.label, label + '.label');
    assertString(entry.source, label + '.source');
    assertEnum(entry.level, EVIDENCE_LEVELS, label + '.level');
    if (entry.level !== AUTHORITY_LEVELS[entry.id]) throw new Error(label + '.level crosses its authority boundary');
    if (entry.source !== AUTHORITY_SOURCES[entry.id]) throw new Error(label + '.source crosses its authority boundary');
    assertStringArray(entry.mayClaim, label + '.mayClaim');
    assertStringArray(entry.mayNotClaim, label + '.mayNotClaim');
  });
  assertStringArray(value.boundaries, 'framework evidence boundaries');
  const local = value.authorities.find((entry) => entry.id === 'local');
  const runner = value.authorities.find((entry) => entry.id === 'runner');
  if (!local || !runner || local.level === runner.level || local.source === runner.source) {
    throw new Error('local and Runner authorities must remain separate evidence levels');
  }
  const production = value.authorities.find((entry) => entry.id === 'production');
  if (!production?.mayNotClaim.some((claim) => /production|上线/iu.test(claim))) {
    throw new Error('production authority must explicitly prohibit unverified production claims');
  }
  const unknown = value.authorities.find((entry) => entry.id === 'unknown');
  if (!unknown?.mayClaim.some((claim) => /Unknown|Deferred/iu.test(claim))) {
    throw new Error('unknown authority must preserve Unknown or Deferred');
  }
  const serialized = JSON.stringify(value);
  for (const forbidden of ['/Users/', 'file://', 'git@', 'runner-passed']) {
    if (serialized.includes(forbidden)) throw new Error('framework evidence authorities contains forbidden content: ' + forbidden);
  }
  return true;
}

export function resolveFrameworkEvidenceAuthorities(value) {
  assertFrameworkEvidenceAuthorities(value);
  return {
    ...value,
    levels: value.levels.map((entry) => ({ ...entry })),
    authorities: value.authorities.map((entry) => ({ ...entry, mayClaim: [...entry.mayClaim], mayNotClaim: [...entry.mayNotClaim] })),
    boundaries: [...value.boundaries]
  };
}

function assertOrderedEntries(entries, expectedIds, label, keys, validate) {
  if (!Array.isArray(entries) || entries.length !== expectedIds.length) throw new Error(label + ' must contain exactly ' + expectedIds.length + ' entries');
  entries.forEach((entry, index) => {
    const entryLabel = label + '[' + index + ']';
    assertObject(entry, entryLabel);
    assertExactKeys(entry, keys, entryLabel);
    if (entry.id !== expectedIds[index]) throw new Error(label + ' order or id drifted');
    validate(entry, entryLabel);
  });
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) throw new Error(label + ' must be a plain object');
}

function assertExactKeys(value, expected, label) {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(sortedExpected)) throw new Error(label + ' keys must be exactly ' + expected.join(', '));
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '' || /[\u0000-\u001f]/u.test(value)) throw new Error(label + ' must be clean non-empty text');
}

function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) throw new Error(label + ' must be a non-empty array');
  value.forEach((entry, index) => assertString(entry, label + '[' + index + ']'));
  if (new Set(value).size !== value.length) throw new Error(label + ' must not contain duplicates');
}

function assertEnum(value, values, label) {
  if (!values.includes(value)) throw new Error(label + ' must be one of ' + values.join(', '));
}
