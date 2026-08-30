import { createHash } from 'node:crypto';
import { TextDecoder } from 'node:util';

const MANIFEST_KEYS = ['schemaVersion', 'projectId', 'sourceCommit', 'sourceCommittedAt', 'profileCommit', 'profileCommittedAt', 'payload'];
const PAYLOAD_KEYS = ['schemaVersion', 'projectId', 'sourceUpdatedAt', 'project'];
const PROJECT_KEYS = [
  'id', 'title', 'category', 'categoryLabel', 'status', 'syncMode', 'syncLabel', 'updatedAt',
  'lastReviewedAt', 'year', 'role', 'summary', 'technologies', 'goal', 'constraints', 'evidence',
  'milestones', 'limitations', 'next', 'linkLabel', 'proof', 'proofFooter', 'visualLabel', 'featured', 'sourceFacts'
];
const PROVENANCE_KEYS = [
  'schemaVersion', 'projectId', 'sourceCommit', 'sourceCommittedAt', 'profileCommit', 'profileCommittedAt',
  'payloadSha256', 'payloadBytes'
];
const PROJECT_CONTRACTS = new Map([
  ['iris-shelf', { category: 'tool', syncLabel: '源仓推送公开投影', sourceFactKeys: ['kind', 'productVersion'], sourceKind: 'desktop-app' }],
  ['udgap', { category: 'game', syncLabel: '源仓推送公开基线', sourceFactKeys: ['kind', 'editorVersion', 'productName', 'bundleVersion'], sourceKind: 'unity-project' }]
]);
const SHA_PATTERN = /^[a-f0-9]{40}$/u;
const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;
const FORBIDDEN_PUBLIC_PATTERNS = [
  /\/Users\//iu, /[A-Z]:\\/u, /154\.37\.215\.57/u, /(?:git|ssh):?@/iu,
  /https?:\/\/[^\s"']*gitea/iu, /\.git(?:\b|\/)/iu,
  /(?:credential|secret|token|private[_ -]?key|deploy[_ -]?key|known[_ -]?hosts)/iu,
  /remote-matched/iu, /\b[a-f0-9]{40}\b/iu
];

export function validatePublicProjectExport(manifest, payloadBytes, expectedProjectId) {
  validateManifest(manifest, expectedProjectId);
  if (!Buffer.isBuffer(payloadBytes) || payloadBytes.length < 1 || payloadBytes.length > 256 * 1024) throw new Error('Public project payload must be a bounded non-empty buffer.');
  const actualHash = createHash('sha256').update(payloadBytes).digest('hex');
  if (payloadBytes.length !== manifest.payload.bytes || actualHash !== manifest.payload.sha256) throw new Error('Public project payload hash or bytes indicate tampering.');
  let payload;
  const payloadText = new TextDecoder('utf-8', { fatal: true }).decode(payloadBytes);
  try { payload = JSON.parse(payloadText); } catch { throw new Error('Public project payload is not valid JSON.'); }
  validatePayload(payload, expectedProjectId);
  if (payload.sourceUpdatedAt !== manifest.profileCommittedAt) throw new Error('Public project payload time does not match the profile commit.');
  const provenance = {
    schemaVersion: 1,
    projectId: expectedProjectId,
    sourceCommit: manifest.sourceCommit,
    sourceCommittedAt: manifest.sourceCommittedAt,
    profileCommit: manifest.profileCommit,
    profileCommittedAt: manifest.profileCommittedAt,
    payloadSha256: manifest.payload.sha256,
    payloadBytes: manifest.payload.bytes
  };
  return { sourceCommit: manifest.sourceCommit, payload, payloadText, provenance };
}

export function planPublicProjectImport(currentProvenance, incoming, isAncestor) {
  validateProvenance(incoming?.provenance, 'incoming provenance');
  if (currentProvenance === null || currentProvenance === undefined) return { kind: 'write' };
  validateProvenance(currentProvenance, 'current provenance');
  if (currentProvenance.projectId !== incoming.provenance.projectId) throw new Error('Public project provenance identity changed.');
  if (currentProvenance.sourceCommit === incoming.provenance.sourceCommit) {
    if (JSON.stringify(currentProvenance) !== JSON.stringify(incoming.provenance)) throw new Error('The same source commit has provenance or payload hash drift.');
    return { kind: 'noop' };
  }
  if (typeof isAncestor !== 'function' || isAncestor(currentProvenance.sourceCommit, incoming.provenance.sourceCommit) !== true) throw new Error('Incoming source commit is stale or not an ancestor-descendant update.');
  return { kind: 'write' };
}

export function applyPublicProjectToRegistry(registry, payloadValue) {
  const payload = typeof payloadValue === 'string' ? parseJson(payloadValue, 'Public project payload') : payloadValue;
  validatePayload(payload, payload?.projectId);
  assertPlainObject(registry, 'project registry');
  assertKeys(registry, ['schemaVersion', 'updatedAt', 'projects'], 'project registry');
  if (registry.schemaVersion !== 3 || !Array.isArray(registry.projects)) throw new Error('Project registry has an unsupported schema.');
  const matches = registry.projects.filter((entry) => entry?.id === payload.projectId);
  if (matches.length !== 1) throw new Error('Project registry must contain exactly one matching project.');
  const projects = registry.projects.map((entry) => entry.id === payload.projectId ? payload.project : entry);
  const updatedAt = projects.map((entry) => entry.updatedAt).sort().at(-1);
  return { schemaVersion: 3, updatedAt, projects };
}

export function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function stringifyProjectRegistry(registry) {
  assertPlainObject(registry, 'project registry');
  assertKeys(registry, ['schemaVersion', 'updatedAt', 'projects'], 'project registry');
  if (registry.schemaVersion !== 3 || !DATE_PATTERN.test(registry.updatedAt) || !Array.isArray(registry.projects)) {
    throw new Error('Project registry has an unsupported schema or date.');
  }
  const lines = [
    '{',
    '  "schemaVersion": 3,',
    `  "updatedAt": ${JSON.stringify(registry.updatedAt)},`,
    '  "projects": ['
  ];
  registry.projects.forEach((project, index) => {
    lines.push(...formatProject(project));
    if (index < registry.projects.length - 1) lines[lines.length - 1] += ',';
  });
  lines.push('  ]', '}');
  return `${lines.join('\n')}\n`;
}

function validateManifest(manifest, expectedProjectId) {
  const contract = requireContract(expectedProjectId);
  void contract;
  assertPlainObject(manifest, 'manifest');
  assertKeys(manifest, MANIFEST_KEYS, 'manifest');
  if (manifest.schemaVersion !== 1 || manifest.projectId !== expectedProjectId) throw new Error('Public project manifest has an unsupported identity or schema.');
  if (!SHA_PATTERN.test(manifest.sourceCommit) || !SHA_PATTERN.test(manifest.profileCommit)) throw new Error('Public project manifest requires exact Git SHAs.');
  assertCanonicalInstant(manifest.sourceCommittedAt, 'manifest.sourceCommittedAt');
  assertCanonicalInstant(manifest.profileCommittedAt, 'manifest.profileCommittedAt');
  assertPlainObject(manifest.payload, 'manifest.payload');
  assertKeys(manifest.payload, ['path', 'sha256', 'bytes'], 'manifest.payload');
  if (manifest.payload.path !== `${expectedProjectId}.json`) throw new Error('Public project manifest has an unexpected payload path.');
  if (!HASH_PATTERN.test(manifest.payload.sha256)) throw new Error('Public project manifest has an invalid payload hash.');
  if (!Number.isSafeInteger(manifest.payload.bytes) || manifest.payload.bytes < 1 || manifest.payload.bytes > 256 * 1024) throw new Error('Public project manifest has invalid payload bytes.');
}

function validatePayload(payload, expectedProjectId) {
  const contract = requireContract(expectedProjectId);
  assertPlainObject(payload, 'payload');
  assertKeys(payload, PAYLOAD_KEYS, 'payload');
  if (payload.schemaVersion !== 1 || payload.projectId !== expectedProjectId) throw new Error('Public project payload has an unsupported identity or schema.');
  assertCanonicalInstant(payload.sourceUpdatedAt, 'payload.sourceUpdatedAt');
  validateProject(payload.project, contract, expectedProjectId, payload.sourceUpdatedAt.slice(0, 10));
}

function validateProject(project, contract, projectId, reviewedDate) {
  assertPlainObject(project, 'payload.project');
  assertKeys(project, PROJECT_KEYS, 'payload.project');
  if (project.id !== projectId || project.category !== contract.category || project.syncMode !== 'source-push' || project.syncLabel !== contract.syncLabel) throw new Error('Public project classification or sync identity is invalid.');
  if (project.updatedAt !== reviewedDate || project.lastReviewedAt !== reviewedDate || !DATE_PATTERN.test(project.updatedAt)) throw new Error('Public project review dates must match the committed profile time.');
  if (!Number.isSafeInteger(project.year) || project.year < 2020 || project.year > 2100 || project.featured !== true) throw new Error('Public project year or featured state is invalid.');
  for (const key of ['title', 'categoryLabel', 'status', 'role', 'summary', 'goal', 'linkLabel', 'proofFooter', 'visualLabel']) assertText(project[key], `payload.project.${key}`, 1, key === 'summary' || key === 'goal' ? 600 : 180);
  for (const key of ['technologies', 'constraints', 'evidence', 'milestones', 'limitations', 'next']) assertTextArray(project[key], `payload.project.${key}`, 1, key === 'technologies' ? 12 : 16, 500);
  if (!Array.isArray(project.proof) || project.proof.length !== 3) throw new Error('Public project proof must contain exactly three entries.');
  project.proof.forEach((entry, index) => {
    assertPlainObject(entry, `payload.project.proof[${index}]`);
    assertKeys(entry, ['value', 'label'], `payload.project.proof[${index}]`);
    assertText(entry.value, `payload.project.proof[${index}].value`, 1, 40);
    assertText(entry.label, `payload.project.proof[${index}].label`, 1, 100);
  });
  assertPlainObject(project.sourceFacts, 'payload.project.sourceFacts');
  assertKeys(project.sourceFacts, contract.sourceFactKeys, 'payload.project.sourceFacts');
  if (project.sourceFacts.kind !== contract.sourceKind) throw new Error('Public project source fact kind is invalid.');
  for (const [key, value] of Object.entries(project.sourceFacts)) assertText(value, `payload.project.sourceFacts.${key}`, 1, 100);
  assertPublicSafe(project, 'payload.project');
}

function validateProvenance(value, label) {
  assertPlainObject(value, label);
  assertKeys(value, PROVENANCE_KEYS, label);
  requireContract(value.projectId);
  if (value.schemaVersion !== 1 || !SHA_PATTERN.test(value.sourceCommit) || !SHA_PATTERN.test(value.profileCommit) || !HASH_PATTERN.test(value.payloadSha256)) throw new Error(`${label} has an invalid identity or hash.`);
  assertCanonicalInstant(value.sourceCommittedAt, `${label}.sourceCommittedAt`);
  assertCanonicalInstant(value.profileCommittedAt, `${label}.profileCommittedAt`);
  if (!Number.isSafeInteger(value.payloadBytes) || value.payloadBytes < 1 || value.payloadBytes > 256 * 1024) throw new Error(`${label} has invalid payload bytes.`);
}

function formatProject(project) {
  assertPlainObject(project, 'project registry entry');
  const entries = Object.entries(project);
  if (entries.length === 0) throw new Error('Project registry entry must not be empty.');
  const lines = ['    {'];
  entries.forEach(([key, value], index) => {
    const suffix = index < entries.length - 1 ? ',' : '';
    const prefix = `      ${JSON.stringify(key)}: `;
    if (Array.isArray(value)) {
      if (value.every((entry) => typeof entry === 'string')) {
        lines.push(`${prefix}[${value.map((entry) => JSON.stringify(entry)).join(', ')}]${suffix}`);
        return;
      }
      if (key === 'proof' && value.every(isInlineTextObject)) {
        lines.push(`${prefix}[`);
        value.forEach((entry, entryIndex) => {
          const objectText = `{ ${Object.entries(entry).map(([entryKey, entryValue]) => `${JSON.stringify(entryKey)}: ${JSON.stringify(entryValue)}`).join(', ')} }`;
          lines.push(`        ${objectText}${entryIndex < value.length - 1 ? ',' : ''}`);
        });
        lines.push(`      ]${suffix}`);
        return;
      }
      throw new Error(`Project registry entry has an unsupported array field: ${key}`);
    }
    if (value && typeof value === 'object') {
      if (!isInlineTextObject(value)) throw new Error(`Project registry entry has an unsupported object field: ${key}`);
      lines.push(`${prefix}{`);
      Object.entries(value).forEach(([entryKey, entryValue], entryIndex, nestedEntries) => {
        lines.push(`        ${JSON.stringify(entryKey)}: ${JSON.stringify(entryValue)}${entryIndex < nestedEntries.length - 1 ? ',' : ''}`);
      });
      lines.push(`      }${suffix}`);
      return;
    }
    if (!['string', 'number', 'boolean'].includes(typeof value) || (typeof value === 'number' && !Number.isFinite(value))) {
      throw new Error(`Project registry entry has an unsupported scalar field: ${key}`);
    }
    lines.push(`${prefix}${JSON.stringify(value)}${suffix}`);
  });
  lines.push('    }');
  return lines;
}

function isInlineTextObject(value) {
  return Boolean(value) && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype
    && Object.keys(value).length > 0 && Object.values(value).every((entry) => typeof entry === 'string');
}

function requireContract(projectId) {
  const contract = PROJECT_CONTRACTS.get(projectId);
  if (!contract) throw new Error('Public project id is not authorized for source sync.');
  return contract;
}
function parseJson(value, label) { try { return JSON.parse(value); } catch { throw new Error(`${label} is not valid JSON.`); } }
function assertCanonicalInstant(value, label) { if (typeof value !== 'string' || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== value) throw new Error(`${label} must be a canonical time.`); }
function assertPlainObject(value, label) { if (!value || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) throw new Error(`${label} must be a plain object.`); }
function assertKeys(value, keys, label) { if (JSON.stringify(Object.keys(value)) !== JSON.stringify(keys)) throw new Error(`${label} has an unknown or reordered shape.`); }
function assertText(value, label, minimum, maximum) { if (typeof value !== 'string' || value.length < minimum || value.length > maximum || value.trim() !== value || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(value)) throw new Error(`${label} must be bounded clean text.`); }
function assertTextArray(value, label, minimum, maximum, itemMaximum) { if (!Array.isArray(value) || value.length < minimum || value.length > maximum) throw new Error(`${label} has an invalid length.`); value.forEach((entry, index) => assertText(entry, `${label}[${index}]`, 1, itemMaximum)); if (new Set(value).size !== value.length) throw new Error(`${label} contains duplicate entries.`); }
function assertPublicSafe(value, label) { if (typeof value === 'string') { if (FORBIDDEN_PUBLIC_PATTERNS.some((pattern) => pattern.test(value))) throw new Error(`${label} contains private or unsafe content.`); return; } if (Array.isArray(value)) return value.forEach((entry, index) => assertPublicSafe(entry, `${label}[${index}]`)); if (value && typeof value === 'object') for (const [key, entry] of Object.entries(value)) assertPublicSafe(entry, `${label}.${key}`); }
