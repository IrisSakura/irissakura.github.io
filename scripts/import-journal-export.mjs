#!/usr/bin/env node

import { mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildJournalSnapshot,
  stringifyJson,
  validateJournalSource
} from './lib/journal-import-model.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const options = parseOptions(process.argv.slice(2));
const input = path.resolve(options.input);
const source = JSON.parse(await readFile(path.join(input, 'journal-source.json'), 'utf8'));
const curation = JSON.parse(await readFile(path.join(root, 'config/journal-curation.json'), 'utf8'));
const sourceBlogDirectory = path.join(input, 'blogs');
const blogFiles = (await readdir(sourceBlogDirectory)).filter((entry) => entry.endsWith('.md')).sort();
const expectedBlogFiles = source.blogs.map((blog) => `${blog.id}.md`).sort();
if (JSON.stringify(blogFiles) !== JSON.stringify(expectedBlogFiles)) {
  throw new Error('Journal export blog files do not exactly match its metadata.');
}
const blogBodies = new Map(await Promise.all(source.blogs.map(async (blog) => (
  [blog.id, await readFile(path.join(sourceBlogDirectory, `${blog.id}.md`))]
))));
validateJournalSource(source, blogBodies);
const journal = buildJournalSnapshot(curation, source);

const expected = new Map([
  [path.join(root, 'data/journal-source.json'), Buffer.from(stringifyJson(source))],
  [path.join(root, 'data/journal.json'), Buffer.from(stringifyJson(journal))],
  ...[...blogBodies].map(([id, body]) => [path.join(root, 'content/blogs', `${id}.md`), body])
]);

if (options.check) {
  for (const [destination, body] of expected) {
    const current = await readFile(destination).catch(() => null);
    if (!current?.equals(body)) throw new Error(`Journal import is stale: ${path.relative(root, destination)}.`);
  }
  const currentBlogFiles = (await readdir(path.join(root, 'content/blogs'))).filter((entry) => entry.endsWith('.md')).sort();
  if (JSON.stringify(currentBlogFiles) !== JSON.stringify(expectedBlogFiles)) {
    throw new Error('Imported blog directory contains stale or missing files.');
  }
  console.log(`Journal import matches ${source.sourceCommit.slice(0, 8)}.`);
  process.exit(0);
}

await mkdir(path.join(root, 'data'), { recursive: true });
await writeAtomic(path.join(root, 'data/journal-source.json'), stringifyJson(source));
await writeAtomic(path.join(root, 'data/journal.json'), stringifyJson(journal));
const destinationBlogDirectory = path.join(root, 'content/blogs');
const temporaryBlogDirectory = path.join(root, `content/.blogs-import-${process.pid}`);
await rm(temporaryBlogDirectory, { recursive: true, force: true });
await mkdir(temporaryBlogDirectory, { recursive: true });
for (const [id, body] of blogBodies) await writeFile(path.join(temporaryBlogDirectory, `${id}.md`), body);
await rm(destinationBlogDirectory, { recursive: true, force: true });
await rename(temporaryBlogDirectory, destinationBlogDirectory);
console.log(
  `Imported ${source.summary.gameDesignCount} designs, ${source.summary.auditCount} audits and `
  + `${source.summary.blogCount} blogs from ${source.sourceCommit.slice(0, 8)}.`
);

async function writeAtomic(destination, content) {
  const temporary = `${destination}.tmp-${process.pid}`;
  try {
    await writeFile(temporary, content);
    await rename(temporary, destination);
  } finally {
    await rm(temporary, { force: true });
  }
}

function parseOptions(args) {
  let input;
  let check = false;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--input') input = args[++index];
    else if (args[index] === '--check') check = true;
    else throw new Error(`Unknown option: ${args[index]}`);
  }
  if (!input) throw new Error('Usage: import-journal-export.mjs --input <export-directory> [--check]');
  return { input, check };
}
