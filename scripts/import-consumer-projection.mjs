#!/usr/bin/env node

import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assertConsumerLabCurrent } from './lib/consumer-lab-model.mjs';
import { mergeConsumerProjection } from './lib/consumer-sync-model.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const options = parseOptions(process.argv.slice(2));
const destination = path.join(root, 'data', 'consumer-lab.json');
const [registryText, projectionText] = await Promise.all([
  readFile(destination, 'utf8'),
  readFile(path.resolve(options.input), 'utf8')
]);
const registry = JSON.parse(registryText);
const projection = JSON.parse(projectionText);
const next = mergeConsumerProjection(registry, projection);
assertConsumerLabCurrent(next);
const expected = stringifyRegistry(next);

if (options.check) {
  if (registryText !== expected) {
    throw new Error(`Consumer Lab import is stale for ${projection.id}@${projection.consumerCommit.slice(0, 8)}.`);
  }
  console.log(`Consumer Lab import matches ${projection.id}@${projection.consumerCommit.slice(0, 8)}.`);
  process.exit(0);
}

await writeAtomic(destination, expected);
console.log(`Imported Consumer Lab projection ${projection.id}@${projection.consumerCommit.slice(0, 8)}.`);

async function writeAtomic(destinationPath, content) {
  const temporary = `${destinationPath}.tmp-${process.pid}`;
  try {
    await writeFile(temporary, content);
    await rename(temporary, destinationPath);
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
  if (!input) {
    throw new Error('Usage: import-consumer-projection.mjs --input <projection.json> [--check]');
  }
  return { input, check };
}

function stringifyRegistry(value) {
  return `${JSON.stringify(value, null, 2)
    .replace(
      /"highlights": \[\n\s+"([^"]+)",\n\s+"([^"]+)",\n\s+"([^"]+)",\n\s+"([^"]+)"\n\s+\]/gu,
      '"highlights": ["$1", "$2", "$3", "$4"]'
    )
    .replace(
      /"(editMode|playMode)": \{\n\s+"passed": (\d+),\n\s+"total": (\d+)\n\s+\}/gu,
      '"$1": { "passed": $2, "total": $3 }'
    )}\n`;
}
