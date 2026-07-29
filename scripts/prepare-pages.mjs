import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '_site');
const entries = [
  '404.html',
  'index.html',
  'assets',
  'data',
  'dist',
  'pages',
  'robots.txt',
  'site.webmanifest',
  'sitemap.xml',
  'style'
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of entries) {
  await cp(path.join(root, entry), path.join(output, entry), {
    recursive: true,
    filter: (source) => path.basename(source) !== '.DS_Store'
  });
}
console.log(`Prepared GitHub Pages artifact with ${entries.length} entries.`);
