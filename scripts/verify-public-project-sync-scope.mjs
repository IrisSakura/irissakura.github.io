#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const allowedProjectIds = new Set(['iris-shelf', 'udgap']);

export function isPublicProjectSyncOwnedPath(projectId, file) {
  if (!allowedProjectIds.has(projectId)) return false;
  return new Set([
    `config/project-sync/${projectId}.json`,
    'data/projects.json',
    'pages/portfolio.html'
  ]).has(file);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL(`file://${process.argv[1]}`))) {
  const projectIndex = process.argv.indexOf('--project');
  const projectId = projectIndex >= 0 ? process.argv[projectIndex + 1] : undefined;
  if (!allowedProjectIds.has(projectId)) throw new Error('Usage: verify-public-project-sync-scope.mjs --project <iris-shelf|udgap>');
  const changed = new Set([
    ...gitNames(['diff', '--name-only', '-z', 'HEAD', '--']),
    ...gitNames(['ls-files', '--others', '--exclude-standard', '-z'])
  ]);
  const forbidden = [...changed].filter((file) => !isPublicProjectSyncOwnedPath(projectId, file)).sort();
  if (forbidden.length) throw new Error(`Public project sync attempted to modify non-owned paths:\n${forbidden.join('\n')}`);
  console.log(`${projectId} sync scope contains ${changed.size} owned path(s).`);
}

function gitNames(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) throw new Error('Unable to verify public project sync scope.');
  return result.stdout.split('\0').filter(Boolean);
}
