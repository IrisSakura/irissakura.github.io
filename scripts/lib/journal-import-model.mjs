import { createHash } from 'node:crypto';

const SHA_PATTERN = /^[a-f0-9]{40}$/;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FORBIDDEN_PUBLIC_PATTERNS = [
  /\/Users\//i,
  /[A-Z]:\\/,
  /154\.37\.215\.57/,
  /(?:git@|ssh:\/\/)/i,
  /https?:\/\/[^\s)]*\.git(?:\b|\/)/i,
  /(?:GITEA_TOKEN|WEBSITE_GITHUB_SSH_KEY|PASSWORD\s*=)/
];
const FORBIDDEN_HTML = /<(?:script|iframe|object|embed|form)\b|on[a-z]+\s*=/i;

export function validateJournalSource(source, blogBodies) {
  if (source?.schemaVersion !== 1) throw new Error('Journal source schemaVersion must be 1.');
  if (!SHA_PATTERN.test(source.sourceCommit ?? '')) throw new Error('Journal sourceCommit must be a full Git SHA.');
  if (Number.isNaN(Date.parse(source.generatedAt))) throw new Error('Journal generatedAt must be an ISO date-time.');
  if (!DIGEST_PATTERN.test(source.gameDesignCatalogDigest ?? '')) {
    throw new Error('Journal gameDesignCatalogDigest must be SHA-256.');
  }
  if (!Array.isArray(source.audits) || !Array.isArray(source.gameDesigns) || !Array.isArray(source.blogs)) {
    throw new Error('Journal source must expose audits, gameDesigns and blogs arrays.');
  }
  const expectedCounts = {
    auditCount: source.audits.length,
    blogCount: source.blogs.length,
    gameDesignCount: source.gameDesigns.length
  };
  if (JSON.stringify(source.summary) !== JSON.stringify(expectedCounts)) {
    throw new Error('Journal source summary counts do not match its collections.');
  }

  assertUniqueIds(source.audits, 'audit');
  assertUniqueIds(source.gameDesigns, 'game design');
  assertUniqueIds(source.blogs, 'blog');
  for (const entry of [...source.audits, ...source.gameDesigns, ...source.blogs]) {
    if (!ID_PATTERN.test(entry.id ?? '')) throw new Error(`Invalid public Journal id: ${entry.id ?? '(missing)'}.`);
    if (!DATE_PATTERN.test(entry.updatedAt ?? '')) throw new Error(`Invalid update date for ${entry.id}.`);
    assertPublicSafe(entry, `journal.${entry.id}`);
  }
  if (!(blogBodies instanceof Map) || blogBodies.size !== source.blogs.length) {
    throw new Error('Blog body set does not match Journal blog metadata.');
  }
  for (const blog of source.blogs) {
    if (blog.contentPath !== `content/blogs/${blog.id}.md`) {
      throw new Error(`Unexpected blog content path for ${blog.id}.`);
    }
    const body = blogBodies.get(blog.id);
    if (!Buffer.isBuffer(body)) throw new Error(`Missing blog body for ${blog.id}.`);
    if (body.length !== blog.bytes || sha256(body) !== blog.sha256) {
      throw new Error(`Blog body digest mismatch for ${blog.id}.`);
    }
    const markdown = body.toString('utf8');
    assertPublicSafe(markdown, `blog.${blog.id}`);
    if (FORBIDDEN_HTML.test(markdown)) throw new Error(`Blog ${blog.id} contains executable or form HTML.`);
  }
}

export function buildJournalSnapshot(curation, source) {
  if (
    curation?.schemaVersion !== 1
    || !Array.isArray(curation.streams)
    || !Array.isArray(curation.featuredNotes)
  ) {
    throw new Error('Journal curation must use schemaVersion 1 and expose streams and featuredNotes.');
  }
  const gameDesignIds = new Set(source.gameDesigns.map((entry) => entry.id));
  for (const note of curation.featuredNotes) {
    if (note.source?.kind === 'catalog' && !gameDesignIds.has(note.source.id)) {
      throw new Error(`Curated Journal source no longer exists: ${note.source.id}.`);
    }
  }
  const snapshot = {
    schemaVersion: 1,
    title: curation.title,
    summary: {
      gameDesignCount: source.summary.gameDesignCount,
      auditCount: source.summary.auditCount,
      blogCount: source.summary.blogCount,
      knowledgeStreamCount: curation.streams.length,
      description: curation.summary.description
    },
    streams: curation.streams,
    featuredNotes: curation.featuredNotes.map(({ source: _source, ...note }) => note),
    sourceSnapshot: {
      sourceCommit: source.sourceCommit,
      generatedAt: source.generatedAt,
      catalogDigest: source.gameDesignCatalogDigest
    }
  };
  assertPublicSafe(snapshot, 'journal');
  return snapshot;
}

export function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function assertUniqueIds(entries, label) {
  const ids = new Set();
  for (const entry of entries) {
    if (ids.has(entry.id)) throw new Error(`Duplicate ${label} id: ${entry.id}.`);
    ids.add(entry.id);
  }
}

function assertPublicSafe(value, label) {
  if (typeof value === 'string') {
    for (const pattern of FORBIDDEN_PUBLIC_PATTERNS) {
      if (pattern.test(value)) throw new Error(`${label} contains private or credential-bearing content.`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertPublicSafe(entry, `${label}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) assertPublicSafe(entry, `${label}.${key}`);
  }
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}
