const FRAMEWORK_STORY_COMMIT = '9d436c62f5cfbe78c84c9ef44fe8b5f8214d5cd1';
const STORY_KEYS = [
  'schemaVersion',
  'storyId',
  'frameworkCommit',
  'evidence',
  'positioning',
  'architectureMap',
  'pillars',
  'reference'
];
const EVIDENCE_STATES = ['local-passed', 'runner-pending'];
const BRANCH_STATUSES = ['supported', 'parallel-preview'];
const BOUNDARY_STATUSES = ['deferred', 'not-delivered'];
const PILLAR_IDS = ['explicit-ownership', 'engine-agnostic-semantics', 'evidence-before-claims'];
const REFERENCE_IDS = ['maturity', 'adoption', 'game-adoption', 'modules', 'architecture', 'lifecycle', 'quickstart'];

export { FRAMEWORK_STORY_COMMIT };

export function assertFrameworkStory(story) {
  assertObject(story, 'framework story');
  assertExactKeys(story, STORY_KEYS, 'framework story');
  if (story.schemaVersion !== 1) throw new Error(`unsupported framework story schema: ${story.schemaVersion}`);
  assertString(story.storyId, 'framework story id');
  if (story.storyId !== 'sakura-framework-engineering') throw new Error('framework story id is not stable');
  if (story.frameworkCommit !== FRAMEWORK_STORY_COMMIT) {
    throw new Error(`framework story must bind committed truth ${FRAMEWORK_STORY_COMMIT}`);
  }

  assertObject(story.evidence, 'framework story evidence');
  assertExactKeys(story.evidence, ['local', 'runner', 'summary'], 'framework story evidence');
  assertEnum(story.evidence.local, EVIDENCE_STATES, 'framework story local evidence');
  assertEnum(story.evidence.runner, EVIDENCE_STATES, 'framework story runner evidence');
  if (story.evidence.local !== 'local-passed' || story.evidence.runner !== 'runner-pending') {
    throw new Error('framework story evidence must remain local-passed / runner-pending');
  }
  assertString(story.evidence.summary, 'framework story evidence summary');

  assertObject(story.positioning, 'framework story positioning');
  assertExactKeys(story.positioning, ['eyebrow', 'title', 'seoTitle', 'summary', 'description', 'claims', 'boundary'], 'framework story positioning');
  for (const key of ['eyebrow', 'title', 'seoTitle', 'summary', 'description', 'boundary']) assertString(story.positioning[key], `framework story positioning ${key}`);
  if (!story.positioning.seoTitle.includes('Portable Core') || !story.positioning.seoTitle.includes('Cross-Engine')) {
    throw new Error('framework story SEO title must describe Portable Core and Cross-Engine Architecture');
  }
  assertStringArray(story.positioning.claims, 'framework story positioning claims');
  if (story.positioning.claims.length < 4) throw new Error('framework story positioning needs at least four claims');

  assertObject(story.architectureMap, 'framework story architecture map');
  assertExactKeys(story.architectureMap, ['eyebrow', 'title', 'summary', 'layers', 'branches', 'governance', 'boundaries'], 'framework story architecture map');
  for (const key of ['eyebrow', 'title', 'summary']) assertString(story.architectureMap[key], `framework story architecture map ${key}`);
  assertArchitectureLayers(story.architectureMap.layers);
  if (story.architectureMap.layers.map((entry) => entry.id).join('\0') !== 'consumers\0gameplay-semantics\0runtime-services\0portable-core') {
    throw new Error('framework architecture layers have drifted');
  }
  if (story.architectureMap.layers[3].status !== 'portable-preview') {
    throw new Error('framework portable-core status must remain Portable Preview');
  }
  if (story.architectureMap.layers[3].label !== 'Portable .NET Core / Config Core / Parallel') {
    throw new Error('framework portable-core capability unit has drifted');
  }
  assertEntries(story.architectureMap.branches, 'framework architecture branch', BRANCH_STATUSES);
  if (story.architectureMap.branches.map((entry) => entry.id).join('\0') !== 'unity\0godot') {
    throw new Error('framework architecture branches must be Unity then Godot');
  }
  if (story.architectureMap.branches[0].status !== 'supported' || story.architectureMap.branches[1].status !== 'parallel-preview') {
    throw new Error('framework architecture branch statuses must remain Unity Supported / Godot Parallel Preview');
  }
  if (story.architectureMap.branches[1].label !== 'Parallel Godot Adapter') {
    throw new Error('framework Godot branch must remain Parallel Godot Adapter');
  }
  if (story.architectureMap.branches[1].runtimeLabel !== 'Godot translation boundary') {
    throw new Error('framework Godot branch must remain a translation boundary');
  }
  if (/(?:Runtime Host|Runtime API|Input|UI)/u.test(story.architectureMap.branches[1].runtimeLabel)) {
    throw new Error('framework Godot branch must not imply a general runtime, input or UI host');
  }
  assertStringArray(story.architectureMap.governance, 'framework architecture governance');
  if (story.architectureMap.governance.join('\0') !== 'Tooling\0Governance\0Verification\0Diagnostics') {
    throw new Error('framework architecture governance boundary has drifted');
  }
  assertEntries(story.architectureMap.boundaries, 'framework architecture boundary', BOUNDARY_STATUSES);
  if (story.architectureMap.boundaries.map((entry) => entry.id).join('\0') !== 'godot-core-config\0godot-runtime-host') {
    throw new Error('framework architecture boundaries have drifted');
  }
  if (story.architectureMap.boundaries[0].status !== 'deferred' || story.architectureMap.boundaries[1].status !== 'not-delivered') {
    throw new Error('framework architecture boundary statuses must remain Deferred / Not delivered');
  }

  if (!Array.isArray(story.pillars) || story.pillars.length !== 3) {
    throw new Error('framework story must contain exactly three engineering pillars');
  }
  if (story.pillars.map((pillar) => pillar.id).join('\0') !== PILLAR_IDS.join('\0')) {
    throw new Error('framework engineering pillar order has drifted');
  }
  story.pillars.forEach((pillar, index) => {
    assertObject(pillar, `framework story pillar ${index + 1}`);
    assertExactKeys(pillar, ['id', 'eyebrow', 'title', 'thesis', 'description', 'signals'], `framework story pillar ${index + 1}`);
    assertString(pillar.id, `framework story pillar ${index + 1} id`);
    for (const key of ['eyebrow', 'title', 'thesis', 'description']) assertString(pillar[key], `framework story pillar ${pillar.id} ${key}`);
    assertStringArray(pillar.signals, `framework story pillar ${pillar.id} signals`);
  });

  assertObject(story.reference, 'framework story reference');
  assertExactKeys(story.reference, ['eyebrow', 'title', 'summary', 'items'], 'framework story reference');
  for (const key of ['eyebrow', 'title', 'summary']) assertString(story.reference[key], `framework story reference ${key}`);
  if (!Array.isArray(story.reference.items) || story.reference.items.length !== REFERENCE_IDS.length) {
    throw new Error('framework story reference must retain all seven technical entry points');
  }
  if (story.reference.items.map((item) => item.id).join('\0') !== REFERENCE_IDS.join('\0')) {
    throw new Error('framework story reference order has drifted');
  }
  story.reference.items.forEach((item, index) => {
    assertObject(item, `framework story reference item ${index + 1}`);
    assertExactKeys(item, ['id', 'label', 'description', 'href'], `framework story reference item ${index + 1}`);
    for (const key of ['id', 'label', 'description', 'href']) assertString(item[key], `framework story reference item ${index + 1} ${key}`);
    if (item.id === 'quickstart') {
      if (item.href !== 'framework-quickstart.html') throw new Error('framework Quickstart reference route drifted');
    } else if (item.href !== `#${item.id}`) {
      throw new Error(`framework reference item ${item.id} must preserve its anchor`);
    }
  });

  const serialized = JSON.stringify(story);
  for (const forbidden of ['/Users/', 'file://', 'git@', 'remote-matched', 'runner-passed', 'Godot Runtime Supported']) {
    if (serialized.includes(forbidden)) throw new Error(`framework story contains forbidden private or overstated claim: ${forbidden}`);
  }
  return true;
}

export function resolveFrameworkStory(story) {
  assertFrameworkStory(story);
  return {
    ...story,
    positioning: { ...story.positioning, claims: [...story.positioning.claims] },
    architectureMap: {
      ...story.architectureMap,
      layers: story.architectureMap.layers.map((entry) => ({ ...entry })),
      branches: story.architectureMap.branches.map((entry) => ({ ...entry })),
      governance: [...story.architectureMap.governance],
      boundaries: story.architectureMap.boundaries.map((entry) => ({ ...entry }))
    },
    pillars: story.pillars.map((pillar) => ({ ...pillar, signals: [...pillar.signals] })),
    reference: { ...story.reference, items: story.reference.items.map((item) => ({ ...item })) }
  };
}

function assertEntries(entries, label, statuses) {
  if (!Array.isArray(entries) || entries.length === 0) throw new Error(`${label} list must not be empty`);
  entries.forEach((entry, index) => {
    assertObject(entry, `${label} ${index + 1}`);
    assertExactKeys(entry, Object.hasOwn(entry, 'runtimeLabel') ? ['id', 'label', 'runtimeLabel', 'status', 'description'] : ['id', 'label', 'status', 'description'], `${label} ${index + 1}`);
    for (const key of ['id', 'label', 'description']) assertString(entry[key], `${label} ${index + 1} ${key}`);
    assertEnum(entry.status, statuses, `${label} ${entry.id} status`);
    if (entry.runtimeLabel !== undefined) assertString(entry.runtimeLabel, `${label} ${entry.id} runtime label`);
  });
}

function assertArchitectureLayers(layers) {
  if (!Array.isArray(layers) || layers.length === 0) throw new Error('framework architecture layer list must not be empty');
  const expectedIds = ['consumers', 'gameplay-semantics', 'runtime-services', 'portable-core'];
  if (layers.map((entry) => entry.id).join('\0') !== expectedIds.join('\0')) {
    throw new Error('framework architecture layers have drifted');
  }
  layers.forEach((entry, index) => {
    assertObject(entry, `framework architecture layer ${index + 1}`);
    const isCapabilityUnit = entry.id === 'portable-core';
    assertExactKeys(
      entry,
      isCapabilityUnit ? ['id', 'label', 'status', 'description'] : ['id', 'label', 'description'],
      `framework architecture layer ${index + 1}`
    );
    for (const key of ['id', 'label', 'description']) assertString(entry[key], `framework architecture layer ${index + 1} ${key}`);
    if (isCapabilityUnit && entry.status !== 'portable-preview') {
      throw new Error('framework portable-core status must remain Portable Preview');
    }
    if (!isCapabilityUnit && Object.hasOwn(entry, 'status')) {
      throw new Error(`framework conceptual layer ${entry.id} must not carry a maturity status`);
    }
  });
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
}

function assertExactKeys(value, expected, label) {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(sortedExpected)) {
    throw new Error(`${label} keys must be exactly ${expected.join(', ')}`);
  }
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${label} must be a non-empty string`);
}

function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`${label} must be a non-empty array`);
  value.forEach((entry, index) => assertString(entry, `${label}[${index}]`));
}

function assertEnum(value, values, label) {
  if (!values.includes(value)) throw new Error(`${label} must be one of ${values.join(', ')}`);
}
