#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const allowed = new Set([
  'config/iris-engineering-sync.json',
  'data/iris-engineering.json',
  'index.html',
  'pages/engineering.html',
  'pages/portfolio.html'
]);

export function isEngineeringSyncOwnedPath(file) {
  return allowed.has(file);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL(`file://${process.argv[1]}`))) {
  const changed = new Set([
    ...gitNames(['diff', '--name-only', '-z', 'HEAD', '--']),
    ...gitNames(['ls-files', '--others', '--exclude-standard', '-z'])
  ]);
  const forbidden = [...changed].filter((file) => !isEngineeringSyncOwnedPath(file)).sort();
  if (forbidden.length) throw new Error(`Iris Engineering sync attempted to modify non-owned paths:\n${forbidden.join('\n')}`);
  console.log(`Iris Engineering sync scope contains ${changed.size} owned path(s).`);
}

function gitNames(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) throw new Error('Unable to verify Iris Engineering sync scope.');
  return result.stdout.split('\0').filter(Boolean);
}
