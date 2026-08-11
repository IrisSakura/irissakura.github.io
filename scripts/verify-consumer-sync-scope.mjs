#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const allowed = new Set([
  'data/consumer-lab.json',
  'pages/portfolio.html'
]);

export function isConsumerSyncOwnedPath(file) {
  return allowed.has(file);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL(`file://${process.argv[1]}`))) {
  const changed = new Set([
    ...gitNames(['diff', '--name-only', '-z']),
    ...gitNames(['ls-files', '--others', '--exclude-standard', '-z'])
  ]);
  const forbidden = [...changed].filter((file) => !isConsumerSyncOwnedPath(file)).sort();
  if (forbidden.length) {
    throw new Error(`Consumer sync attempted to modify non-owned paths:\n${forbidden.join('\n')}`);
  }
  console.log(`Consumer sync scope contains ${changed.size} owned path(s).`);
}

function gitNames(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.split('\0').filter(Boolean);
}
