import { createHash } from 'node:crypto';

const FORBIDDEN_PUBLIC_PATTERNS = [
  { pattern: /\/Users\//i, label: 'local macOS path' },
  { pattern: /[A-Z]:\\/i, label: 'local Windows path' },
  { pattern: /(?:https?:\/\/|ssh:\/\/|git@)/i, label: 'repository or external URL' },
  { pattern: /\.git(?:\b|\/)/i, label: 'Git repository reference' }
];

export function validateCatalog(catalog) {
  if (catalog?.schemaVersion !== 1 || !Array.isArray(catalog.routes)) {
    throw new Error('Journal catalog must use schemaVersion 1 and expose routes[].');
  }
  if (catalog.entryCount !== catalog.routes.length) {
    throw new Error(`Journal catalog entryCount ${catalog.entryCount} does not match routes length ${catalog.routes.length}.`);
  }
  if (!/^[a-f0-9]{64}$/.test(catalog.contentDigest ?? '')) {
    throw new Error('Journal catalog contentDigest must be a SHA-256 value.');
  }

  const ids = new Set();
  for (const route of catalog.routes) {
    if (!route?.id || !route?.title || !route?.summary || !Array.isArray(route.tags)) {
      throw new Error('Every Journal catalog route must expose id, title, summary and tags.');
    }
    if (ids.has(route.id)) throw new Error(`Duplicate Journal catalog route id: ${route.id}`);
    ids.add(route.id);
  }
}

export function validateCuration(config, catalog) {
  if (config?.schemaVersion !== 1 || !Array.isArray(config.streams) || !Array.isArray(config.featuredNotes)) {
    throw new Error('Journal curation must use schemaVersion 1 and expose streams[] and featuredNotes[].');
  }
  if (config.summary?.knowledgeStreamCount !== config.streams.length) {
    throw new Error('Journal knowledgeStreamCount must match streams length.');
  }

  const routeIds = new Set(catalog.routes.map((route) => route.id));
  const noteIds = new Set();
  for (const note of config.featuredNotes) {
    if (noteIds.has(note.id)) throw new Error(`Duplicate curated note id: ${note.id}`);
    noteIds.add(note.id);
    if (note.source?.kind === 'catalog' && !routeIds.has(note.source.id)) {
      throw new Error(`Curated catalog source does not exist at committed HEAD: ${note.source.id}`);
    }
    if (!['catalog', 'manual'].includes(note.source?.kind)) {
      throw new Error(`Curated note ${note.id} must use a catalog or manual source.`);
    }
  }
}

export function buildPublicSnapshot(config, catalog) {
  validateCatalog(catalog);
  validateCuration(config, catalog);

  const snapshot = {
    schemaVersion: 1,
    title: config.title,
    summary: {
      gameDesignCount: catalog.entryCount,
      knowledgeStreamCount: config.summary.knowledgeStreamCount,
      description: config.summary.description
    },
    streams: config.streams,
    featuredNotes: config.featuredNotes.map(({ source: _source, ...note }) => note),
    sourceSnapshot: {
      catalogDigest: catalog.contentDigest,
      curatedCatalogCount: config.featuredNotes.filter((note) => note.source.kind === 'catalog').length
    }
  };

  assertPublicSafe(snapshot);
  return snapshot;
}

export function diffCatalogs(previousCatalog, currentCatalog) {
  validateCatalog(previousCatalog);
  validateCatalog(currentCatalog);

  const previous = new Map(previousCatalog.routes.map((route) => [route.id, route]));
  const current = new Map(currentCatalog.routes.map((route) => [route.id, route]));
  const added = [...current.keys()].filter((id) => !previous.has(id)).sort();
  const removed = [...previous.keys()].filter((id) => !current.has(id)).sort();
  const changed = [...current.keys()]
    .filter((id) => previous.has(id) && routeFingerprint(previous.get(id)) !== routeFingerprint(current.get(id)))
    .sort();

  return { added, changed, removed };
}

export function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function routeFingerprint(route) {
  return createHash('sha256')
    .update(JSON.stringify({
      title: route.title,
      summary: route.summary,
      tags: route.tags,
      sha256: route.sha256
    }))
    .digest('hex');
}

function assertPublicSafe(value, path = 'journal') {
  if (typeof value === 'string') {
    for (const forbidden of FORBIDDEN_PUBLIC_PATTERNS) {
      if (forbidden.pattern.test(value)) {
        throw new Error(`${path} contains a forbidden ${forbidden.label}.`);
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertPublicSafe(entry, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      assertPublicSafe(entry, `${path}.${key}`);
    }
  }
}
