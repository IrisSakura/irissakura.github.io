import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '_site');
const publicData = new Set(['framework-public.json', 'search-index.json', 'site-search-index.json', 'content-graph.json']);
const dataFiles = await readdir(path.join(output, 'data'));
if (dataFiles.some((file) => !publicData.has(file)) || dataFiles.length !== publicData.size) {
  throw new Error(`Public data projection differs from allowlist: ${dataFiles.join(', ')}`);
}

const sourceCommits = new Set();
for (const file of await readdir(path.join(root, 'data'))) {
  if (!file.endsWith('.json')) continue;
  const source = await readFile(path.join(root, 'data', file), 'utf8');
  for (const [, commit] of source.matchAll(/"sourceCommit"\s*:\s*"([a-f0-9]{40})"/giu)) sourceCommits.add(commit);
}
const forbidden = [
  /\/Users\//u, /sourceCommit/u, /adoptionReviewHash/u, /contentPath/u,
  /(?:git@|https?:\/\/)[^\s"']*sakura-design-journal\.git/iu,
  /WEBSITE_GITHUB_SSH_KEY/u, /private[-_]journal/iu
];
const errors = [];
for (const file of await walk(output)) {
  if (!/\.(?:html|json|js|css|xml|txt|svg|webmanifest|md)$/iu.test(file)) continue;
  const text = await readFile(file, 'utf8');
  const relative = path.relative(output, file);
  for (const pattern of forbidden) if (pattern.test(text)) errors.push(`${relative}: ${pattern}`);
  for (const commit of sourceCommits) if (text.includes(commit)) errors.push(`${relative}: source commit ${commit.slice(0, 8)}`);
}
if (errors.length) throw new Error(`Public artifact contains owner-only material:\n${errors.slice(0, 30).join('\n')}`);
console.log(`Public artifact verified: ${publicData.size} runtime data files, no source provenance or private paths.`);

async function walk(directory) {
  const files = [];
  for (const name of await readdir(directory)) {
    const file = path.join(directory, name);
    if ((await stat(file)).isDirectory()) files.push(...await walk(file));
    else files.push(file);
  }
  return files;
}
