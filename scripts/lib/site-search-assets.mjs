import { createHash } from 'node:crypto';

export function buildSiteSearchAssets(index, maxBytes) {
  const files = new Map();
  const parts = [];
  const suggestions = index.documents.filter(({ type }) => type === 'project').slice(0, 8);
  let rows = [];
  let bytes = 3; // Opening and closing brackets, plus the final newline.

  const finishPart = () => {
    const payload = `[${rows.join(',')}]\n`;
    const digest = createHash('sha256').update(payload).digest('hex');
    const name = `part-${digest}.json`;
    files.set(name, payload);
    parts.push(name);
    rows = [];
    bytes = 3;
  };

  for (const document of index.documents) {
    const row = JSON.stringify(document);
    const rowBytes = Buffer.byteLength(row);
    if (rowBytes + 3 > maxBytes) throw new Error(`Search document exceeds asset budget: ${document.id}`);
    if (bytes + rowBytes + Number(rows.length > 0) > maxBytes) finishPart();
    bytes += rowBytes + Number(rows.length > 0);
    rows.push(row);
  }
  if (rows.length) finishPart();

  const manifest = `${JSON.stringify({ schemaVersion: 1, totalCount: index.documents.length, suggestions, parts })}\n`;
  if (Buffer.byteLength(manifest) > maxBytes) throw new Error('Search manifest exceeds asset budget');
  files.set('index.json', manifest);
  return files;
}
