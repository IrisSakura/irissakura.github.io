#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { lstat, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  planEngineeringImport,
  stringifyJson,
  validateEngineeringExport
} from './lib/engineering-import-model.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try {
  await main();
} catch (error) {
  console.error(safeErrorMessage(error, 'Iris Engineering import failed.'));
  process.exitCode = 1;
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const input = await requireAbsoluteRegularDirectory(options.input, 'export input');
  const sourceRepository = await requireAbsoluteRegularDirectory(options.sourceRepository, 'source repository');
  await assertExactExportFiles(input);
  const manifest = await readJson(path.join(input, 'manifest.json'), 'Engineering manifest');
  const payloadBytes = await readFile(path.join(input, 'iris-engineering.json'));
  const verified = validateEngineeringExport(manifest, payloadBytes);
  const sourceHead = git(sourceRepository, ['rev-parse', '--verify', 'HEAD^{commit}']).stdout.trim();
  if (sourceHead !== verified.sourceCommit) throw new Error('Fixed source checkout does not match the export manifest.');
  const provenancePath = path.join(root, 'config/iris-engineering-sync.json');
  const dataPath = path.join(root, 'data/iris-engineering.json');
  const currentProvenance = await readJsonIfPresent(provenancePath);
  const plan = planEngineeringImport(currentProvenance, verified, (current, incoming) => {
    const result = git(sourceRepository, ['merge-base', '--is-ancestor', current, incoming], true);
    if (result.status === 0) return true;
    if (result.status === 1) return false;
    throw new Error('Unable to prove Iris Engineering source ancestry.');
  });
  const expectedData = Buffer.from(verified.payloadText);
  const expectedProvenance = Buffer.from(stringifyJson(verified.provenance));
  if (options.check) {
    if (plan.kind !== 'noop') throw new Error('Iris Engineering import is stale.');
    await assertFileEquals(dataPath, expectedData, 'public snapshot');
    await assertFileEquals(provenancePath, expectedProvenance, 'owner provenance');
    console.log(`Iris Engineering import matches ${verified.sourceCommit.slice(0, 8)}.`);
    return;
  }
  if (plan.kind === 'noop') {
    await assertFileEquals(dataPath, expectedData, 'public snapshot');
    await assertFileEquals(provenancePath, expectedProvenance, 'owner provenance');
    console.log(`Iris Engineering import is already current at ${verified.sourceCommit.slice(0, 8)}.`);
    return;
  }
  await replacePair([
    [dataPath, expectedData],
    [provenancePath, expectedProvenance]
  ]);
  console.log(`Imported Iris Engineering snapshot from ${verified.sourceCommit.slice(0, 8)}.`);
}

async function requireAbsoluteRegularDirectory(value, label) {
  if (!path.isAbsolute(value)) throw new Error(`${label} must be an absolute directory.`);
  const resolved = path.resolve(value);
  const stat = await lstat(resolved).catch(() => null);
  if (!stat?.isDirectory() || stat.isSymbolicLink()) throw new Error(`${label} must be one regular directory.`);
  return resolved;
}

async function assertExactExportFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const names = entries.map((entry) => entry.name).sort();
  if (JSON.stringify(names) !== JSON.stringify(['iris-engineering.json', 'manifest.json'])) {
    throw new Error('Engineering export directory has missing or unexpected files.');
  }
  if (entries.some((entry) => !entry.isFile() || entry.isSymbolicLink())) {
    throw new Error('Engineering export files must be regular files.');
  }
}

function git(directory, args, acceptStatus = false) {
  const result = spawnSync('git', ['-C', directory, ...args], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
  });
  if (!acceptStatus && result.status !== 0) throw new Error('Unable to verify the fixed Iris Engineering checkout.');
  return result;
}

async function readJsonIfPresent(file) {
  const body = await readFile(file, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (body === null) return null;
  try {
    return JSON.parse(body);
  } catch {
    throw new Error('Current Iris Engineering provenance is not valid JSON.');
  }
}

async function readJson(file, label) {
  const body = await readFile(file, 'utf8');
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`${label} is not valid JSON.`);
  }
}

async function assertFileEquals(file, expected, label) {
  const current = await readFile(file).catch(() => null);
  if (!current?.equals(expected)) throw new Error(`Iris Engineering ${label} has same-commit drift.`);
}

async function replacePair(entries) {
  const records = [];
  try {
    for (const [destination, content] of entries) {
      const parent = path.dirname(destination);
      await mkdir(parent, { recursive: true });
      const parentStat = await lstat(parent);
      if (!parentStat.isDirectory() || parentStat.isSymbolicLink()) {
        throw new Error('Iris Engineering import destination parent must be one regular directory.');
      }
      const temporary = `${destination}.tmp-${process.pid}`;
      const backup = `${destination}.backup-${process.pid}`;
      await rm(temporary, { force: true });
      await rm(backup, { force: true });
      await writeFile(temporary, content, { flag: 'wx' });
      records.push({ destination, temporary, backup, hadExisting: false, installed: false });
    }
    for (const record of records) {
      await rename(record.destination, record.backup).then(() => { record.hadExisting = true; }).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
    }
    for (const record of records) {
      await rename(record.temporary, record.destination);
      record.installed = true;
    }
    for (const record of records) if (record.hadExisting) await rm(record.backup, { force: true }).catch(() => {});
  } catch (error) {
    for (const record of records.reverse()) {
      if (record.installed) await rm(record.destination, { force: true });
      if (record.hadExisting) await rename(record.backup, record.destination).catch(() => {});
      await rm(record.temporary, { force: true });
    }
    throw error;
  }
}

function parseOptions(args) {
  let input;
  let sourceRepository;
  let check = false;
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === '--check') check = true;
    else if (option === '--input') input = args[++index];
    else if (option === '--source-repository') sourceRepository = args[++index];
    else throw new Error(`Unknown option: ${option}`);
  }
  if (!input || !sourceRepository) {
    throw new Error('Usage: import-engineering-export.mjs --input <absolute-export-directory> --source-repository <absolute-checkout> [--check]');
  }
  return { input, sourceRepository, check };
}

function safeErrorMessage(error, fallback) {
  return error instanceof Error && !('path' in error) && !('syscall' in error) ? error.message : fallback;
}
