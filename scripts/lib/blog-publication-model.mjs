import { createHash } from 'node:crypto';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_STATUSES = new Set(['draft', 'review', 'approved', 'published', 'revised', 'archived']);
const PUBLIC_STATUSES = new Set(['approved', 'published']);
const FORBIDDEN_PUBLIC_MARKERS = [
  /(?:^|[>\s])状态\s*[：:]\s*草稿(?:\s|$)/imu,
  /(?:^|[>\s])待补充(?:\s|$)/imu,
  /(?:^|[>\s])TODO(?:\s|$)/imu
];

export function selectPublishedBlogs(manifest, source, blogBodies) {
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.articles)) {
    throw new Error('Blog publication manifest must use schemaVersion 1 and expose articles.');
  }
  if (!Array.isArray(source?.blogs)) throw new Error('Journal source must expose blogs.');
  if (!(blogBodies instanceof Map)) throw new Error('Blog publication validation requires a body map.');

  const sourceById = new Map(source.blogs.map((article) => [article.id, article]));
  const manifestIds = new Set();
  const slugs = new Set();
  const selected = [];

  for (const entry of manifest.articles) {
    if (!SLUG_PATTERN.test(entry?.sourceId ?? '')) throw new Error('Publication sourceId must be stable kebab-case.');
    if (manifestIds.has(entry.sourceId)) throw new Error(`Duplicate publication sourceId: ${entry.sourceId}.`);
    manifestIds.add(entry.sourceId);
    const article = sourceById.get(entry.sourceId);
    if (!article) throw new Error(`Publication source no longer exists: ${entry.sourceId}.`);

    if (!ALLOWED_STATUSES.has(entry.status)) throw new Error(`Invalid publication status for ${entry.sourceId}.`);
    if (!SLUG_PATTERN.test(entry.slug ?? '') || /^blog-[a-f0-9]{8,}$/u.test(entry.slug)) {
      throw new Error(`Blog ${entry.sourceId} requires a semantic slug.`);
    }
    if (slugs.has(entry.slug)) throw new Error(`Duplicate publication slug: ${entry.slug}.`);
    slugs.add(entry.slug);

    for (const [field, sourceField] of [
      ['title', 'title'],
      ['description', 'summary'],
      ['series', 'series'],
      ['updatedAt', 'updatedAt'],
      ['contentHash', 'sha256']
    ]) {
      if (entry[field] !== article[sourceField]) {
        throw new Error(`Blog ${entry.sourceId} publication ${field} does not match Journal metadata.`);
      }
    }
    if (JSON.stringify(entry.tags) !== JSON.stringify(article.tags)) {
      throw new Error(`Blog ${entry.sourceId} publication tags do not match Journal metadata.`);
    }
    if (!DATE_PATTERN.test(entry.updatedAt ?? '')) throw new Error(`Blog ${entry.sourceId} has an invalid update date.`);
    if (!HASH_PATTERN.test(entry.contentHash ?? '')) throw new Error(`Blog ${entry.sourceId} has an invalid content hash.`);
    if ([...entry.description].length < 30) throw new Error(`Blog ${entry.sourceId} description is too short for publication.`);

    const bodyValue = blogBodies.get(entry.sourceId);
    if (bodyValue === undefined) throw new Error(`Missing publication body for ${entry.sourceId}.`);
    const body = Buffer.isBuffer(bodyValue) ? bodyValue : Buffer.from(bodyValue);
    if (createHash('sha256').update(body).digest('hex') !== entry.contentHash) {
      throw new Error(`Blog ${entry.sourceId} publication content hash does not match its body.`);
    }

    const isPublic = PUBLIC_STATUSES.has(entry.status);
    if (isPublic) {
      if (!DATE_PATTERN.test(entry.publishedAt ?? '')) {
        throw new Error(`Published blog ${entry.sourceId} requires publishedAt.`);
      }
      if (entry.publishedAt > entry.updatedAt) {
        throw new Error(`Published blog ${entry.sourceId} cannot be updated before it was published.`);
      }
      const markdown = stripBlogPublicationPreamble(body.toString('utf8'));
      for (const marker of FORBIDDEN_PUBLIC_MARKERS) {
        if (marker.test(markdown)) throw new Error(`Published blog ${entry.sourceId} contains a draft marker.`);
      }
      selected.push({
        ...article,
        ...entry,
        id: entry.sourceId,
        summary: entry.description
      });
    } else if (entry.publishedAt !== null) {
      throw new Error(`Unpublished blog ${entry.sourceId} must use a null publishedAt.`);
    }
  }

  return selected;
}

export function stripBlogPublicationPreamble(markdown) {
  const withoutTitle = markdown.replace(/^#\s+.+?(?:\r?\n){1,2}/u, '');
  const lines = withoutTitle.split(/\r?\n/u);
  let index = 0;
  while (lines[index]?.trim() === '') index += 1;
  if (!lines[index]?.trimStart().startsWith('>')) return withoutTitle;
  while (index < lines.length && (lines[index].trim() === '' || lines[index].trimStart().startsWith('>'))) {
    index += 1;
  }
  while (lines[index]?.trim() === '') index += 1;
  return lines.slice(index).join('\n');
}
