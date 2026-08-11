#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import {
  assertConsumerEvidenceFresh,
  buildConsumerProjection
} from './lib/consumer-sync-model.mjs';

const execFileAsync = promisify(execFile);
const options = parseOptions(process.argv.slice(2));
const source = path.resolve(options.source);
const commit = await git(['rev-parse', `${options.commit}^{commit}`]);
if (commit !== options.commit) throw new Error('Consumer export requires one fixed 40-character commit SHA.');

const [configText, manifest, projectVersion, sourceCommittedAt] = await Promise.all([
  git(['show', `${commit}:consumer-site.v1.json`]),
  git(['show', `${commit}:Packages/manifest.json`]),
  git(['show', `${commit}:ProjectSettings/ProjectVersion.txt`]),
  git(['show', '-s', '--format=%cI', commit])
]);
const config = JSON.parse(configText);
const frameworkCommit = extractFrameworkCommit(manifest);
const editModePath = `evidence/${frameworkCommit}/editmode-results.xml`;
const playModePath = `evidence/${frameworkCommit}/playmode-results.xml`;
const [editModeXml, playModeXml, editEvidenceCommit, playEvidenceCommit] = await Promise.all([
  git(['show', `${commit}:${editModePath}`]),
  git(['show', `${commit}:${playModePath}`]),
  lastCommitFor(commit, editModePath),
  lastCommitFor(commit, playModePath)
]);
const changedPaths = new Set([
  ...await changedProductPaths(editEvidenceCommit, commit),
  ...await changedProductPaths(playEvidenceCommit, commit)
]);
assertConsumerEvidenceFresh([...changedPaths]);

const projection = buildConsumerProjection({
  config,
  consumerCommit: commit,
  sourceCommittedAt,
  manifest,
  projectVersion,
  editModeXml,
  playModeXml
});
await writeAtomic(path.resolve(options.output), `${JSON.stringify(projection, null, 2)}\n`);
console.log(`Exported Consumer Lab projection ${projection.id}@${commit.slice(0, 8)}.`);

async function git(args) {
  const { stdout } = await execFileAsync('git', args, {
    cwd: source,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
  return stdout.trimEnd();
}

async function lastCommitFor(targetCommit, file) {
  const evidenceCommit = await git(['log', '-1', '--format=%H', targetCommit, '--', file]);
  if (!evidenceCommit) throw new Error(`Consumer evidence is not committed at ${file}.`);
  return evidenceCommit;
}

async function changedProductPaths(fromCommit, targetCommit) {
  if (fromCommit === targetCommit) return [];
  const changed = await git([
    'diff',
    '--name-only',
    `${fromCommit}..${targetCommit}`,
    '--',
    'Assets',
    'Packages',
    'ProjectSettings'
  ]);
  return changed.split('\n').filter(Boolean);
}

function extractFrameworkCommit(manifestText) {
  const manifest = JSON.parse(manifestText);
  const commits = new Set(Object.entries(manifest.dependencies ?? {})
    .filter(([packageName]) => packageName.startsWith('com.unitygame.framework.'))
    .map(([, value]) => typeof value === 'string' ? value.match(/#([a-f0-9]{40})$/u)?.[1] : undefined));
  if (commits.size !== 1 || commits.has(undefined)) {
    throw new Error('Consumer manifest must resolve one exact Framework commit.');
  }
  return [...commits][0];
}

async function writeAtomic(destination, content) {
  await mkdir(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.tmp-${process.pid}`;
  try {
    await writeFile(temporary, content);
    await rename(temporary, destination);
  } finally {
    await rm(temporary, { force: true });
  }
}

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === '--source') options.source = args[++index];
    else if (option === '--commit') options.commit = args[++index];
    else if (option === '--output') options.output = args[++index];
    else throw new Error(`Unknown option: ${option}`);
  }
  if (!options.source || !/^[a-f0-9]{40}$/u.test(options.commit ?? '') || !options.output) {
    throw new Error(
      'Usage: export-consumer-projection.mjs --source <repository> --commit <sha> --output <file>'
    );
  }
  return options;
}
