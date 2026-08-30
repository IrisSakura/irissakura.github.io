import { isIP } from 'node:net';

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ANCHOR_PATTERN = /^system-[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const PUBLIC_STATUSES = new Set(['approved', 'published']);
const AUTHORITY_KEYS = ['schemaVersion', 'id', 'order', 'controlPlane', 'relationships', 'boundary'];
const CONTROL_PLANE_KEYS = ['projectId', 'workflowIds', 'capabilityId'];
const RELATIONSHIP_KEYS = ['researchToControlPlane', 'controlPlaneToFramework', 'frameworkToGame'];
const EXPECTED_ORDER = ['research', 'control-plane', 'framework', 'game'];
const EXPECTED_AUTHORITY_ID = 'iris-sakura-four-authority-chain';
const EXPECTED_WORKFLOWS = ['observe', 'authorize', 'verify'];
const EXPECTED_CAPABILITY = 'workflow-core';
const PROSE_LABEL_PATTERN = /(?<![\p{L}\p{N}._-])(?:stage|note|label|section|title|step|phase|status|result|example):/gu;
const UNSAFE_TEXT_PATTERNS = [
  /(?<![\p{L}\p{N}._-])\/(?:[^\s/]+(?:\/[^\s/]*)*)/u,
  /(?<![\p{L}\p{N}._-])~(?:\/|[\p{L}\p{N}._-]+\/)/u,
  /\b[a-z]:(?:[\\/][^\s]*|[\p{L}\p{N}._~$-]+(?:[\\/][^\s]*)?)/u,
  /(?<![\p{L}\p{N}._-])\\+[^\s\\]+(?:\\+[^\s]+)?/u,
  /\b(?:https?|ssh|git):\/\//u,
  /\b[a-z0-9._-]+@[a-z0-9._-]+:/u,
  /\b(?:remote(?:s)?|origin|upstream|localhost|gitea)\b/u,
  /\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/u,
  /\b(?:\d{1,3}\.){3}\d{1,3}\b/u,
  /(?<![\p{L}\p{N}._-])(?:[a-z0-9._-]+@)?[a-z0-9._-]+:(?:~\/|\/|[\p{L}\p{N}._-]+(?:\/[\p{L}\p{N}._-]+)*)(?=$|[\s\p{P}])/u,
  /\b(?:sha(?:-?256)?|commit|source[\s_-]*commit|hash|checksum)\b/u,
  /(?:提交[\s_-]*(?:哈希|hash|sha|指纹)|(?:源|来源|仓库)[\s_-]*提交(?:号|哈希|指纹)?|校验和|哈希)/u,
  /\b[a-f0-9]{7,64}\b/u,
  /\b(?:credential(?:s)?|secret(?:s)?|token(?:s)?|password|private[\s_-]*key|api[\s_-]*key|access[\s_-]*key)\b/u,
  /(?:凭据|密钥|口令|令牌|私钥|访问密钥)/u,
  /\brunner\b/u,
  /\b(?:transport|provenance)\b/u
];

export function assertEvidenceChainAuthorities(authorities, irisEngineering) {
  assertExactKeys(authorities, AUTHORITY_KEYS, 'Evidence chain authority config');
  if (authorities.schemaVersion !== 1 || authorities.id !== EXPECTED_AUTHORITY_ID) {
    throw new Error(`Evidence chain authority config requires schemaVersion 1 and id ${EXPECTED_AUTHORITY_ID}.`);
  }
  if (JSON.stringify(authorities.order) !== JSON.stringify(EXPECTED_ORDER)) {
    throw new Error('Evidence chain authority order must be research, control-plane, framework, game.');
  }
  assertExactKeys(authorities.controlPlane, CONTROL_PLANE_KEYS, 'Evidence chain control plane');
  if (authorities.controlPlane.projectId !== 'iris-engineering') {
    throw new Error('Evidence chain control plane must use the stable iris-engineering project id.');
  }
  assertExactIdList(authorities.controlPlane.workflowIds, EXPECTED_WORKFLOWS, 'workflow');
  if (authorities.controlPlane.capabilityId !== EXPECTED_CAPABILITY) {
    throw new Error(`Evidence chain capability id must be exactly ${EXPECTED_CAPABILITY}.`);
  }
  assertExactKeys(authorities.relationships, RELATIONSHIP_KEYS, 'Evidence chain relationships');
  for (const key of RELATIONSHIP_KEYS) assertSubstantiveText(authorities.relationships[key], `relationship ${key}`);
  assertSubstantiveText(authorities.boundary, 'authority boundary');
  const publicAuthorityText = RELATIONSHIP_KEYS.map((key) => authorities.relationships[key]);
  publicAuthorityText.push(authorities.boundary);
  if (containsUnsafeAuthorityText(publicAuthorityText)) {
    throw new Error('Evidence chain authority config contains private, transport or provenance details.');
  }

  assertPublicIrisContract(irisEngineering, authorities.controlPlane);
}

export function assertEvidenceChains(data, adoption, journalSource, publication, irisEngineering, authorities) {
  assertEvidenceChainAuthorities(authorities, irisEngineering);
  if (data?.schemaVersion !== 1 || !Array.isArray(data.chains) || data.chains.length === 0) {
    throw new Error('Evidence chains must use schemaVersion 1 and expose a non-empty chains array.');
  }
  if (!Array.isArray(adoption?.gameAdoption) || !Array.isArray(journalSource?.gameDesigns) || !Array.isArray(journalSource?.blogs)) {
    throw new Error('Evidence chains require reviewed adoption and Journal public snapshots.');
  }
  if (!Array.isArray(publication?.articles)) throw new Error('Evidence chains require a blog publication manifest.');

  const adoptionBySystem = uniqueMap(adoption.gameAdoption, 'gameSystem', 'game adoption system');
  const designsById = uniqueMap(journalSource.gameDesigns, 'id', 'Journal design');
  const blogsById = uniqueMap(journalSource.blogs, 'id', 'Journal blog');
  const publicationById = uniqueMap(publication.articles, 'sourceId', 'publication article');
  const chainIds = new Set();
  const gameSystems = new Set();
  const anchors = new Set();

  for (const chain of data.chains) {
    if (!ID_PATTERN.test(chain.id ?? '') || chainIds.has(chain.id)) {
      throw new Error(`Evidence chain id must be unique and semantic: ${chain.id ?? '(missing)'}.`);
    }
    chainIds.add(chain.id);
    if (gameSystems.has(chain.gameSystem)) throw new Error(`Evidence chain game system must be unique: ${chain.gameSystem}.`);
    gameSystems.add(chain.gameSystem);
    if (!ANCHOR_PATTERN.test(chain.gameAnchor ?? '') || anchors.has(chain.gameAnchor)) {
      throw new Error(`Evidence chain game anchor must be unique and semantic: ${chain.gameAnchor ?? '(missing)'}.`);
    }
    anchors.add(chain.gameAnchor);
    for (const field of ['title', 'question', 'limitation']) assertSubstantiveText(chain[field], `chain ${chain.id} ${field}`);

    const adoptionEntry = adoptionBySystem.get(chain.gameSystem);
    if (!adoptionEntry) throw new Error(`Evidence chain ${chain.id} references an unknown game adoption system.`);
    if (!Array.isArray(chain.frameworkPackages) || JSON.stringify(chain.frameworkPackages) !== JSON.stringify(adoptionEntry.frameworkPackages)) {
      throw new Error(`Evidence chain ${chain.id} package list does not match the reviewed adoption mapping.`);
    }
    if (!Array.isArray(chain.research) || chain.research.length === 0) {
      throw new Error(`Evidence chain ${chain.id} requires at least one public research reference.`);
    }

    const references = new Set();
    for (const reference of chain.research) {
      const referenceKey = `${reference.type}:${reference.id}`;
      if (references.has(referenceKey)) throw new Error(`Evidence chain ${chain.id} repeats ${referenceKey}.`);
      references.add(referenceKey);
      assertSubstantiveText(reference.relation, `chain ${chain.id} reference ${referenceKey} relation`);
      if (reference.type === 'design') {
        if (!designsById.has(reference.id)) throw new Error(`Evidence chain ${chain.id} references an unknown public Journal design ${reference.id}.`);
        continue;
      }
      if (reference.type === 'article') {
        const article = publicationById.get(reference.id);
        if (!blogsById.has(reference.id) || !article || !PUBLIC_STATUSES.has(article.status)) {
          throw new Error(`Evidence chain ${chain.id} reference ${reference.id} is not a published article in the public Journal snapshot.`);
        }
        continue;
      }
      throw new Error(`Evidence chain ${chain.id} uses unsupported research type ${reference.type}.`);
    }
  }
}

export function resolveEvidenceChains(data, adoption, journalSource, publication, irisEngineering, authorities) {
  assertEvidenceChains(data, adoption, journalSource, publication, irisEngineering, authorities);
  const adoptionBySystem = new Map(adoption.gameAdoption.map((entry) => [entry.gameSystem, entry]));
  const designsById = new Map(journalSource.gameDesigns.map((entry) => [entry.id, entry]));
  const blogsById = new Map(journalSource.blogs.map((entry) => [entry.id, entry]));
  const publicationById = new Map(publication.articles.map((entry) => [entry.sourceId, entry]));
  const controlPlane = resolveControlPlane(irisEngineering, authorities.controlPlane);

  return data.chains.map((chain) => ({
    ...chain,
    adoptionEvidence: adoptionBySystem.get(chain.gameSystem).evidence,
    controlPlane,
    relationships: authorities.relationships,
    authorityBoundary: authorities.boundary,
    research: chain.research.map((reference) => {
      if (reference.type === 'design') {
        const design = designsById.get(reference.id);
        return { ...reference, title: design.title, href: `journal/${design.id}.html` };
      }
      const article = blogsById.get(reference.id);
      const publicEntry = publicationById.get(reference.id);
      return { ...reference, title: article.title, href: `blog/${publicEntry.slug}.html` };
    })
  }));
}

function assertPublicIrisContract(irisEngineering, controlPlane) {
  if (irisEngineering?.id !== 'iris-engineering' || !Array.isArray(irisEngineering.workflow) || !Array.isArray(irisEngineering.capabilities)) {
    throw new Error('Evidence chain control plane requires the public Iris Engineering snapshot.');
  }
  const workflows = uniqueMap(irisEngineering.workflow, 'id', 'Iris workflow');
  const capabilities = uniqueMap(irisEngineering.capabilities, 'id', 'Iris capability');
  for (const id of controlPlane.workflowIds) {
    if (!workflows.has(id)) throw new Error(`Evidence chain references an unknown Iris workflow ${id}.`);
  }
  if (!capabilities.has(controlPlane.capabilityId)) {
    throw new Error(`Evidence chain references an unknown Iris capability ${controlPlane.capabilityId}.`);
  }
}

function resolveControlPlane(irisEngineering, controlPlaneConfig) {
  const workflows = new Map(irisEngineering.workflow.map((step) => [step.id, step]));
  const capabilities = new Map(irisEngineering.capabilities.map((group) => [group.id, group]));
  return {
    projectId: controlPlaneConfig.projectId,
    capabilityId: controlPlaneConfig.capabilityId,
    workflows: controlPlaneConfig.workflowIds.map((id) => ({ id, label: workflows.get(id).label, title: workflows.get(id).title })),
    capabilities: [{
      id: controlPlaneConfig.capabilityId,
      title: capabilities.get(controlPlaneConfig.capabilityId).title
    }]
  };
}

function assertExactIdList(value, expected, label) {
  if (!Array.isArray(value) || JSON.stringify(value) !== JSON.stringify(expected)) {
    throw new Error(`Evidence chain ${label} ids must be exactly ${expected.join(', ')}.`);
  }
}

function assertSubstantiveText(value, label) {
  if (typeof value !== 'string' || value.trim().length < 12) throw new Error(`Evidence chain requires substantive ${label}.`);
}

function assertExactKeys(value, expected, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || JSON.stringify(Object.keys(value).sort()) !== JSON.stringify([...expected].sort())) {
    throw new Error(`${label} has an unexpected key set.`);
  }
}

function uniqueMap(entries, key, label) {
  const result = new Map();
  for (const entry of entries) {
    const value = entry?.[key];
    if (typeof value !== 'string' || result.has(value)) throw new Error(`Duplicate or missing ${label}: ${value ?? '(missing)'}.`);
    result.set(value, entry);
  }
  return result;
}

function containsUnsafeAuthorityText(value) {
  const strings = [];
  collectStrings(value, strings);
  const normalizedValues = strings.map(normalizeAuthorityText);
  if (normalizedValues.some((value) => value === null)) return true;
  const normalized = normalizedValues.join('\n');
  const inspectionText = normalized.replace(PROSE_LABEL_PATTERN, '');
  const compact = inspectionText.replace(/\s+/gu, '');
  return UNSAFE_TEXT_PATTERNS.some((pattern) => pattern.test(inspectionText) || pattern.test(compact))
    || [inspectionText, compact].some((text) => [...text.matchAll(/(?<![a-z0-9])(?:[0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}(?![a-z0-9])/gu)]
      .some(([candidate]) => isIP(candidate) === 6));
}

function collectStrings(value, strings) {
  if (typeof value === 'string') {
    strings.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const entry of value) collectStrings(entry, strings);
    return;
  }
  if (value && typeof value === 'object') {
    for (const entry of Object.values(value)) collectStrings(entry, strings);
  }
}

function normalizeAuthorityText(value) {
  let normalized = value.normalize('NFKC').replace(/\p{Cf}/gu, '').toLowerCase();
  for (let pass = 0; pass < 3; pass += 1) {
    if (!normalized.includes('%')) break;
    if (/%(?![0-9a-f]{2})/iu.test(normalized)) return null;
    let decoded;
    try {
      decoded = decodeURIComponent(normalized);
    } catch {
      return null;
    }
    if (decoded === normalized) break;
    normalized = decoded.normalize('NFKC').replace(/\p{Cf}/gu, '').toLowerCase();
  }
  if (normalized.includes('%')) return null;
  return normalized.replace(/\s+/gu, ' ').trim();
}
