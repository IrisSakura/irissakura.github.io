import { createHash } from 'node:crypto';
import { TextDecoder } from 'node:util';

const MANIFEST_KEYS = ['schemaVersion', 'projectId', 'sourceCommit', 'sourceCommittedAt', 'payload'];
const PAYLOAD_KEYS = [
  'schemaVersion', 'id', 'title', 'eyebrow', 'headline', 'description', 'operatingMode',
  'statusLabel', 'status', 'sourceUpdatedAt', 'workflow', 'capabilities', 'evidence', 'boundaries'
];
const PROVENANCE_KEYS = ['schemaVersion', 'sourceCommit', 'sourceCommittedAt', 'payloadSha256', 'payloadBytes'];
const WORKFLOW_IDS = ['observe', 'authorize', 'execute', 'verify'];
const CAPABILITY_IDS = ['workflow-core', 'read-models', 'research-intake', 'agent-execution'];
const SHA_PATTERN = /^[a-f0-9]{40}$/u;
const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const FORBIDDEN_PUBLIC_PATTERNS = [
  /\/Users\//iu,
  /[A-Z]:\\/u,
  /154\.37\.215\.57/u,
  /(?:git|ssh):?@/iu,
  /https?:\/\/[^\s"']*gitea/iu,
  /\.git(?:\b|\/)/iu,
  /(?:credential|secret|token|private[_ -]?key|deploy[_ -]?key|known[_ -]?hosts)/iu,
  /remote-matched/iu,
  /\b[a-f0-9]{40}\b/iu
];

export function validateEngineeringExport(manifest, payloadBytes) {
  validateManifest(manifest);
  if (!Buffer.isBuffer(payloadBytes) || payloadBytes.length === 0 || payloadBytes.length > 256 * 1024) {
    throw new Error('Engineering payload must be a bounded non-empty buffer.');
  }
  const actualHash = createHash('sha256').update(payloadBytes).digest('hex');
  if (payloadBytes.length !== manifest.payload.bytes || actualHash !== manifest.payload.sha256) {
    throw new Error('Engineering payload hash or bytes indicate tampering.');
  }
  const payloadText = new TextDecoder('utf-8', { fatal: true }).decode(payloadBytes);
  let payload;
  try {
    payload = JSON.parse(payloadText);
  } catch {
    throw new Error('Engineering payload is not valid JSON.');
  }
  validatePayload(payload);
  if (payload.sourceUpdatedAt !== manifest.sourceCommittedAt) {
    throw new Error('Engineering payload time does not match its manifest.');
  }
  const provenance = {
    schemaVersion: 1,
    sourceCommit: manifest.sourceCommit,
    sourceCommittedAt: manifest.sourceCommittedAt,
    payloadSha256: manifest.payload.sha256,
    payloadBytes: manifest.payload.bytes
  };
  return { sourceCommit: manifest.sourceCommit, payload, payloadText, provenance };
}

export function planEngineeringImport(currentProvenance, incoming, isAncestor) {
  validateProvenance(incoming?.provenance, 'incoming provenance');
  if (currentProvenance === null || currentProvenance === undefined) return { kind: 'write' };
  validateProvenance(currentProvenance, 'current provenance');
  if (currentProvenance.sourceCommit === incoming.provenance.sourceCommit) {
    if (JSON.stringify(currentProvenance) !== JSON.stringify(incoming.provenance)) {
      throw new Error('The same source commit has provenance or payload hash drift.');
    }
    return { kind: 'noop' };
  }
  if (typeof isAncestor !== 'function' || isAncestor(currentProvenance.sourceCommit, incoming.provenance.sourceCommit) !== true) {
    throw new Error('Incoming source commit is stale or not an ancestor-descendant update.');
  }
  return { kind: 'write' };
}

export function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function validateManifest(manifest) {
  assertPlainObject(manifest, 'manifest');
  assertKeys(manifest, MANIFEST_KEYS, 'manifest');
  if (manifest.schemaVersion !== 1 || manifest.projectId !== 'iris-engineering') {
    throw new Error('Engineering manifest has an unsupported identity or schema.');
  }
  if (!SHA_PATTERN.test(manifest.sourceCommit)) throw new Error('Engineering manifest requires an exact source commit SHA.');
  assertCanonicalInstant(manifest.sourceCommittedAt, 'manifest.sourceCommittedAt');
  assertPlainObject(manifest.payload, 'manifest.payload');
  assertKeys(manifest.payload, ['path', 'sha256', 'bytes'], 'manifest.payload');
  if (manifest.payload.path !== 'iris-engineering.json') throw new Error('Engineering manifest has an unexpected payload path.');
  if (!HASH_PATTERN.test(manifest.payload.sha256)) throw new Error('Engineering manifest has an invalid payload hash.');
  if (!Number.isSafeInteger(manifest.payload.bytes) || manifest.payload.bytes < 1 || manifest.payload.bytes > 256 * 1024) {
    throw new Error('Engineering manifest has invalid payload bytes.');
  }
}

function validatePayload(payload) {
  assertPlainObject(payload, 'payload');
  assertKeys(payload, PAYLOAD_KEYS, 'payload');
  if (payload.schemaVersion !== 2 || payload.id !== 'iris-engineering') {
    throw new Error('Engineering payload must use schemaVersion 2 and the stable project id.');
  }
  for (const key of ['title', 'eyebrow', 'headline', 'description', 'operatingMode', 'statusLabel', 'status']) {
    assertText(payload[key], `payload.${key}`, 1, key === 'description' || key === 'status' ? 600 : 180);
  }
  assertCanonicalInstant(payload.sourceUpdatedAt, 'payload.sourceUpdatedAt');
  validateEntries(payload.workflow, WORKFLOW_IDS, ['id', 'label', 'title', 'description'], 'workflow', (entry, label) => {
    assertText(entry.label, `${label}.label`, 1, 80);
    assertText(entry.title, `${label}.title`, 1, 100);
    assertText(entry.description, `${label}.description`, 1, 500);
  });
  validateEntries(payload.capabilities, CAPABILITY_IDS, ['id', 'title', 'description', 'items'], 'capabilities', (entry, label) => {
    assertText(entry.title, `${label}.title`, 1, 120);
    assertText(entry.description, `${label}.description`, 1, 500);
    assertTextArray(entry.items, `${label}.items`, 1, 12, 120);
  });
  if (!Array.isArray(payload.evidence) || payload.evidence.length < 1 || payload.evidence.length > 12) {
    throw new Error('payload.evidence must contain 1-12 entries.');
  }
  payload.evidence.forEach((entry, index) => {
    const label = `payload.evidence[${index}]`;
    assertPlainObject(entry, label);
    assertKeys(entry, ['label', 'state', 'summary'], label);
    assertText(entry.label, `${label}.label`, 1, 120);
    if (!['local-passed', 'failed-closed'].includes(entry.state)) throw new Error(`${label}.state is unsupported.`);
    assertText(entry.summary, `${label}.summary`, 1, 500);
  });
  assertTextArray(payload.boundaries, 'payload.boundaries', 1, 16, 500);
  assertPublicSafe(payload, 'payload');
}

function validateProvenance(value, label) {
  assertPlainObject(value, label);
  assertKeys(value, PROVENANCE_KEYS, label);
  if (value.schemaVersion !== 1 || !SHA_PATTERN.test(value.sourceCommit) || !HASH_PATTERN.test(value.payloadSha256)) {
    throw new Error(`${label} has an invalid identity or hash.`);
  }
  assertCanonicalInstant(value.sourceCommittedAt, `${label}.sourceCommittedAt`);
  if (!Number.isSafeInteger(value.payloadBytes) || value.payloadBytes < 1 || value.payloadBytes > 256 * 1024) {
    throw new Error(`${label} has invalid payload bytes.`);
  }
}

function validateEntries(entries, expectedIds, keys, label, validate) {
  if (!Array.isArray(entries) || entries.length !== expectedIds.length) throw new Error(`payload.${label} has an invalid shape or order.`);
  entries.forEach((entry, index) => {
    const entryLabel = `payload.${label}[${index}]`;
    assertPlainObject(entry, entryLabel);
    assertKeys(entry, keys, entryLabel);
    if (entry.id !== expectedIds[index]) throw new Error(`payload.${label} has an invalid order or id.`);
    validate(entry, entryLabel);
  });
}

function assertCanonicalInstant(value, label) {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== value) {
    throw new Error(`${label} must be a canonical time.`);
  }
}

function assertPlainObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new Error(`${label} must be a plain object.`);
  }
}

function assertKeys(value, keys, label) {
  if (JSON.stringify(Object.keys(value)) !== JSON.stringify(keys)) throw new Error(`${label} has an unknown or reordered shape.`);
}

function assertText(value, label, minimum, maximum) {
  if (typeof value !== 'string' || value.length < minimum || value.length > maximum || value.trim() !== value || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(value)) {
    throw new Error(`${label} must be bounded clean text.`);
  }
}

function assertTextArray(value, label, minimum, maximum, itemMaximum) {
  if (!Array.isArray(value) || value.length < minimum || value.length > maximum) throw new Error(`${label} has an invalid length.`);
  value.forEach((entry, index) => assertText(entry, `${label}[${index}]`, 1, itemMaximum));
  if (new Set(value).size !== value.length) throw new Error(`${label} contains duplicate entries.`);
}

function assertPublicSafe(value, label) {
  if (typeof value === 'string') {
    if (FORBIDDEN_PUBLIC_PATTERNS.some((pattern) => pattern.test(value))) throw new Error(`${label} contains private or unsafe content.`);
    return;
  }
  if (Array.isArray(value)) return value.forEach((entry, index) => assertPublicSafe(entry, `${label}[${index}]`));
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) assertPublicSafe(entry, `${label}.${key}`);
  }
}
