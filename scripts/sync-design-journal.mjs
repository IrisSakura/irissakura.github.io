import { execFileSync } from 'node:child_process';
import { readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildPublicSnapshot,
  diffCatalogs,
  stringifyJson
} from './lib/journal-sync-model.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'config', 'journal-curation.json');
const outputPath = path.join(root, 'data', 'journal.json');
const options = parseOptions(process.argv.slice(2));

if (!options.journal) {
  throw new Error('Pass the private Journal checkout with --journal <path> or SAKURA_DESIGN_JOURNAL_PATH.');
}

const journalRoot = await realpath(options.journal);
const repositoryRoot = git(journalRoot, ['rev-parse', '--show-toplevel']).trim();
if (await realpath(repositoryRoot) !== journalRoot) {
  throw new Error('The supplied Journal path must be the Git repository root.');
}

const config = JSON.parse(await readFile(configPath, 'utf8'));
const currentCommit = git(journalRoot, ['rev-parse', 'HEAD']).trim();
const currentCatalog = readCatalog(journalRoot, currentCommit);
const baselineCommit = config.source?.baselineCommit;
const baselineCatalog = readCatalog(journalRoot, baselineCommit);
const changes = diffCatalogs(baselineCatalog, currentCatalog);
const sourceChanged = currentCommit !== baselineCommit || currentCatalog.contentDigest !== config.source.baselineCatalogDigest;

if (options.mode === 'status') {
  console.log(JSON.stringify({
    policy: 'committed-head-only',
    sourceChanged,
    baselineCommit,
    currentCommit,
    baselineCatalogDigest: config.source.baselineCatalogDigest,
    currentCatalogDigest: currentCatalog.contentDigest,
    ...changes
  }, null, 2));
  process.exit(0);
}

if (sourceChanged && !options.advanceSource) {
  throw new Error('Committed Journal content changed. Review `npm run journal:status` and rerun with --advance-source only after curation.');
}

const nextConfig = structuredClone(config);
if (options.advanceSource) {
  nextConfig.source.baselineCommit = currentCommit;
  nextConfig.source.baselineCatalogDigest = currentCatalog.contentDigest;
}

const publicSnapshot = buildPublicSnapshot(nextConfig, currentCatalog);
const expectedOutput = stringifyJson(publicSnapshot);
const currentOutput = await readFile(outputPath, 'utf8');
const outputChanged = currentOutput !== expectedOutput;
const configChanged = stringifyJson(config) !== stringifyJson(nextConfig);

if (options.mode === 'check') {
  if (outputChanged || configChanged) {
    throw new Error('Journal snapshot is not synchronized with its curation config.');
  }
  console.log('Journal snapshot is synchronized with the committed Journal catalog.');
  process.exit(0);
}

if (outputChanged) await writeFile(outputPath, expectedOutput);
if (configChanged) await writeFile(configPath, stringifyJson(nextConfig));
console.log(outputChanged || configChanged
  ? 'Updated the curated public Journal snapshot.'
  : 'Journal snapshot already matches the committed Journal catalog.');

function readCatalog(repository, commit) {
  if (!/^[a-f0-9]{40}$/.test(commit ?? '')) {
    throw new Error(`Invalid Journal baseline commit: ${commit ?? '(missing)'}`);
  }
  const text = git(repository, ['show', `${commit}:game-designs/catalog.v1.json`]);
  return JSON.parse(text);
}

function git(repository, args) {
  return execFileSync('git', ['-C', repository, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function parseOptions(args) {
  const options = {
    journal: process.env.SAKURA_DESIGN_JOURNAL_PATH,
    mode: 'write',
    advanceSource: false
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--journal') options.journal = args[++index];
    else if (argument === '--status') options.mode = 'status';
    else if (argument === '--check') options.mode = 'check';
    else if (argument === '--advance-source') options.advanceSource = true;
    else throw new Error(`Unknown option: ${argument}`);
  }
  return options;
}
