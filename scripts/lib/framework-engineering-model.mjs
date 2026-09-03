const FRAMEWORK_ENGINEERING_COMMIT = '9d436c62f5cfbe78c84c9ef44fe8b5f8214d5cd1';
const DEPTH_IDS = ['d0-signal', 'd1-system', 'd2-architecture', 'd3-evidence'];
const READER_PATH_IDS = ['understand-sakura', 'explore-engineering', 'start-using'];
const DOMAIN_IDS = [
  'architecture-governance',
  'cross-engine-architecture',
  'runtime-lifecycle-ownership',
  'ui-presentation-architecture',
  'gameplay-kernel-semantics',
  'tooling-developer-experience',
  'evidence-engineering',
  'consumer-validation',
  'architecture-decisions-tradeoffs',
  'framework-evolution'
];
const DELIVERY_STATUSES = ['implemented', 'information-architecture-closed-with-deferred-status'];
const DEPTH_ROUTES = ['framework.html', '#architecture-domains', 'framework/decisions.html', 'framework/evidence.html'];
const DOMAIN_ROUTES = ['framework/governance.html','framework/cross-engine.html','framework/runtime.html','framework/ui.html','framework/gameplay.html','framework/tooling.html','framework/evidence.html','framework/consumers.html','framework/decisions.html','framework/evolution.html'];

export { FRAMEWORK_ENGINEERING_COMMIT };

export function assertFrameworkEngineering(value) {
  assertObject(value, 'framework engineering');
  assertExactKeys(value, [
    'schemaVersion', 'id', 'frameworkCommit', 'evidence', 'positioning', 'depthModel', 'readerPaths', 'domains', 'links'
  ], 'framework engineering');
  if (value.schemaVersion !== 1 || value.id !== 'framework-engineering') {
    throw new Error('framework engineering identity or schema is unsupported');
  }
  if (value.frameworkCommit !== FRAMEWORK_ENGINEERING_COMMIT) {
    throw new Error('framework engineering must bind the immutable Framework commit');
  }

  assertObject(value.evidence, 'framework engineering evidence');
  assertExactKeys(value.evidence, ['local', 'runner', 'production', 'summary'], 'framework engineering evidence');
  assertEnum(value.evidence.local, ['local-passed'], 'framework engineering local evidence');
  assertEnum(value.evidence.runner, ['runner-pending'], 'framework engineering runner evidence');
  assertEnum(value.evidence.production, ['unknown'], 'framework engineering production evidence');
  assertString(value.evidence.summary, 'framework engineering evidence summary');

  assertObject(value.positioning, 'framework engineering positioning');
  assertExactKeys(value.positioning, ['eyebrow', 'title', 'seoTitle', 'description', 'boundary'], 'framework engineering positioning');
  for (const key of ['eyebrow', 'title', 'seoTitle', 'description', 'boundary']) {
    assertString(value.positioning[key], 'framework engineering positioning ' + key);
  }
  if (!value.positioning.seoTitle.includes('Architecture') || !value.positioning.seoTitle.includes('Evidence')) {
    throw new Error('framework engineering SEO title must describe Architecture and Evidence');
  }

  assertOrderedEntries(value.depthModel, DEPTH_IDS, 'framework engineering depth model', ['id', 'label', 'goal', 'answers', 'status', 'route'], (entry, label, index) => {
    assertString(entry.label, label + '.label');
    assertString(entry.goal, label + '.goal');
    assertString(entry.answers, label + '.answers');
    assertEnum(entry.status, DELIVERY_STATUSES, label + '.status');
    assertRoute(entry.route, label + '.route');
    if (entry.route !== DEPTH_ROUTES[index]) throw new Error(label + '.route does not match the delivered depth owner');
  });
  if (value.depthModel.some((entry) => entry.status !== 'implemented')) {
    throw new Error('framework engineering depth model must be implemented before deeper case studies are added');
  }

  assertOrderedEntries(value.readerPaths, READER_PATH_IDS, 'framework engineering reader paths', ['id', 'label', 'audience', 'description', 'href'], (entry, label) => {
    assertString(entry.label, label + '.label');
    assertString(entry.audience, label + '.audience');
    assertString(entry.description, label + '.description');
    assertRoute(entry.href, label + '.href');
  });

  assertOrderedEntries(value.domains, DOMAIN_IDS, 'framework engineering domains', ['id', 'title', 'summary', 'route', 'status', 'evidence'], (entry, label, index) => {
    assertString(entry.title, label + '.title');
    assertString(entry.summary, label + '.summary');
    assertRoute(entry.route, label + '.route');
    if (entry.status !== 'implemented' || entry.route !== DOMAIN_ROUTES[index]) throw new Error(label + ' must bind an implemented deep route');
    assertString(entry.evidence, label + '.evidence');
  });

  assertObject(value.links, 'framework engineering links');
  assertExactKeys(value.links, ['home', 'framework', 'quickstart', 'portfolio', 'cases', 'knowledge', 'reference'], 'framework engineering links');
  for (const key of ['home', 'framework', 'quickstart', 'portfolio', 'cases', 'knowledge', 'reference']) assertRoute(value.links[key], 'framework engineering links ' + key);

  const serialized = JSON.stringify(value);
  for (const forbidden of ['/Users/', 'file://', 'git@', 'runner-passed', 'production-ready', 'Production-grade']) {
    if (serialized.includes(forbidden)) throw new Error('framework engineering contains forbidden private or overstated claim: ' + forbidden);
  }
  return true;
}

export function resolveFrameworkEngineering(value) {
  assertFrameworkEngineering(value);
  return {
    ...value,
    evidence: { ...value.evidence },
    positioning: { ...value.positioning },
    depthModel: value.depthModel.map((entry) => ({ ...entry })),
    readerPaths: value.readerPaths.map((entry) => ({ ...entry })),
    domains: value.domains.map((entry) => ({ ...entry })),
    links: { ...value.links }
  };
}

function assertOrderedEntries(entries, expectedIds, label, keys, validate) {
  if (!Array.isArray(entries) || entries.length !== expectedIds.length) {
    throw new Error(label + ' must contain exactly ' + expectedIds.length + ' entries');
  }
  entries.forEach((entry, index) => {
    const entryLabel = label + '[' + index + ']';
    assertObject(entry, entryLabel);
    assertExactKeys(entry, keys, entryLabel);
    if (entry.id !== expectedIds[index]) throw new Error(label + ' order or id drifted');
    assertString(entry.id, entryLabel + '.id');
    validate(entry, entryLabel, index);
  });
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new Error(label + ' must be a plain object');
  }
}

function assertExactKeys(value, expected, label) {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(sortedExpected)) {
    throw new Error(label + ' keys must be exactly ' + expected.join(', '));
  }
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '' || /[\u0000-\u001f]/u.test(value)) {
    throw new Error(label + ' must be clean non-empty text');
  }
}

function assertRoute(value, label) {
  assertString(value, label);
  if (!/^(?:#[a-z0-9-]+|(?:\.\.\/)?(?:index|[a-z0-9-]+)\.html(?:#[a-z0-9-]+)?|(?:pages\/)?framework\/[a-z0-9-]+\.html(?:#[a-z0-9-]+)?|pages\/[a-z0-9-]+\.html(?:#[a-z0-9-]+)?)$/u.test(value)) {
    throw new Error(label + ' must be a public site route');
  }
}

function assertEnum(value, values, label) {
  if (!values.includes(value)) throw new Error(label + ' must be one of ' + values.join(', '));
}
