#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const allowed = [
  /^content\/blogs\/[a-z0-9-]+\.md$/,
  /^data\/journal(?:-source)?\.json$/,
  /^index\.html$/,
  /^pages\/blog\.html$/,
  /^pages\/blog\/[a-z0-9-]+\.html$/,
  /^pages\/journal\.html$/,
  /^pages\/portfolio\.html$/,
  /^sitemap\.xml$/
];

export function isJournalSyncOwnedPath(file) {
  return allowed.some((pattern) => pattern.test(file));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL(`file://${process.argv[1]}`))) {
  const changed = new Set([
    ...gitNames(['diff', '--name-only', '-z']),
    ...gitNames(['ls-files', '--others', '--exclude-standard', '-z'])
  ]);
  const forbidden = [...changed].filter((file) => !isJournalSyncOwnedPath(file)).sort();
  if (forbidden.length) {
    throw new Error(`Journal sync attempted to modify non-owned paths:\n${forbidden.join('\n')}`);
  }
  console.log(`Journal sync scope contains ${changed.size} owned path(s).`);
}

function gitNames(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.split('\0').filter(Boolean);
}
