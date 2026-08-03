#!/usr/bin/env node

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assertJsonHasNoDuplicateKeys } from './lib/json-integrity.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsonFiles = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  ...await listJsonFiles('config'),
  ...await listJsonFiles('data')
].sort();

for (const relativePath of jsonFiles) {
  const source = await readFile(path.join(root, relativePath), 'utf8');
  assertJsonHasNoDuplicateKeys(source, relativePath);
  JSON.parse(source);
}

console.log(`JSON integrity passed: ${jsonFiles.length} files checked for syntax and duplicate keys.`);

async function listJsonFiles(relativeDirectory) {
  const directory = path.join(root, relativeDirectory);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) files.push(...await listJsonFiles(relativePath));
    else if (entry.name.endsWith('.json')) files.push(relativePath);
  }
  return files;
}
