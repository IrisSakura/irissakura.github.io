import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await Promise.all([
  rm(path.join(root, 'dist'), { recursive: true, force: true }),
  rm(path.join(root, '_site'), { recursive: true, force: true })
]);
console.log('Removed local build and Pages artifact directories.');
