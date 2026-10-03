#!/usr/bin/env node

import { mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildJournalSnapshot,
  stringifyJson,
  validateJournalSource
} from './lib/journal-import-model.mjs';
import { reconcileBlogPublication, selectPublishedBlogs } from './lib/blog-publication-model.mjs';
import { reconcileBlogTaxonomy, stringifyBlogTaxonomy } from './lib/blog-discovery-model.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const options = parseOptions(process.argv.slice(2));
const input = path.resolve(options.input);
const source = JSON.parse(await readFile(path.join(input, 'journal-source.json'), 'utf8'));
const curation = JSON.parse(await readFile(path.join(root, 'config/journal-curation.json'), 'utf8'));
const currentPublication = JSON.parse(await readFile(path.join(root, 'config/blog-publication.json'), 'utf8'));
const currentTaxonomy = JSON.parse(await readFile(path.join(root, 'data/blog-taxonomy.json'), 'utf8'));
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
const sourceBlogIds = new Set(source.blogs.map((blog) => blog.id));
const publication = reconcileBlogPublication({
  ...currentPublication,
  articles: currentPublication.articles.filter((entry) => sourceBlogIds.has(entry.sourceId))
}, source);
const publishedBlogs = selectPublishedBlogs(publication, source, blogBodies);
const taxonomy = reconcileBlogTaxonomy(currentTaxonomy, publishedBlogs);
const journal = buildJournalSnapshot(curation, source);

const expected = new Map([
  [path.join(root, 'config/blog-publication.json'), Buffer.from(stringifyJson(publication))],
  [path.join(root, 'data/blog-taxonomy.json'), Buffer.from(stringifyBlogTaxonomy(taxonomy))],
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
  const designDirectory = path.join(root, 'content/game-designs');
  const currentDesignFiles = await readdir(designDirectory).catch(() => []);
  if (currentDesignFiles.length) throw new Error('Imported game design directory must remain absent for summary-only exports.');
  console.log(`Journal import matches ${source.sourceCommit.slice(0, 8)}.`);
  process.exit(0);
}

await mkdir(path.join(root, 'data'), { recursive: true });
await installSnapshot();
console.log(
  `Imported ${source.summary.gameDesignCount} design summaries, ${source.summary.auditCount} audits and `
  + `${source.summary.blogCount} blogs from ${source.sourceCommit.slice(0, 8)}.`
);

async function installSnapshot() {
  const contentDirectory = path.join(root, 'content');
  const blogDirectory = path.join(contentDirectory, 'blogs');
  await mkdir(contentDirectory, { recursive: true });
  const transaction = await mkdtemp(path.join(contentDirectory, '.journal-import-'));
  const records = [];
  let keepRecovery = false;
  try {
    // Finish all writes before touching the installed metadata or article tree.
    for (const [destination, body] of expected) {
      if (path.dirname(destination) === blogDirectory) continue;
      const staged = path.join(transaction, `incoming-${records.length}`);
      await writeFile(staged, body);
      records.push({ destination, staged });
    }
    const stagedBlogs = path.join(transaction, 'incoming-blogs');
    await mkdir(stagedBlogs);
    for (const [id, body] of blogBodies) await writeFile(path.join(stagedBlogs, `${id}.md`), body);
    records.push({ destination: blogDirectory, staged: stagedBlogs });
    // Summary-only imports remove old design bodies as part of the same rollback.
    records.push({ destination: path.join(contentDirectory, 'game-designs'), staged: null });

    for (const [index, record] of records.entries()) {
      record.backup = path.join(transaction, `previous-${index}`);
      try {
        await rename(record.destination, record.backup);
        record.backedUp = true;
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      if (record.staged) {
        await rename(record.staged, record.destination);
        record.installed = true;
      }
    }
  } catch (error) {
    const recoveryErrors = [];
    for (const record of records.toReversed()) {
      try {
        if (record.installed) await rm(record.destination, { recursive: true, force: true });
        if (record.backedUp) await rename(record.backup, record.destination);
      } catch (recoveryError) {
        recoveryErrors.push(recoveryError);
      }
    }
    if (recoveryErrors.length) {
      keepRecovery = true;
      throw new AggregateError([error, ...recoveryErrors], `Journal import rollback incomplete; retained recovery files: ${transaction}`);
    }
    throw error;
  } finally {
    if (!keepRecovery) {
      await rm(transaction, { recursive: true, force: true }).catch(error => {
        console.warn(`Journal import temporary directory cleanup failed: ${transaction}: ${error.message}`);
      });
    }
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
