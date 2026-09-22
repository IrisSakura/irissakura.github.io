import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '_site');
const generatedSocial = path.join(root, '.generated', 'social');
const ownerOnlySources = new Set([
  path.join(root, 'data', 'consumer-lab.json')
]);
const entries = [
  '404.html',
  'index.html',
  'assets',
  'data',
  'dist',
  'pages',
  'robots.txt',
  'rss.xml',
  'site.webmanifest',
  'sitemap.xml',
  'style'
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of entries) {
  await cp(path.join(root, entry), path.join(output, entry), {
    recursive: true,
    filter: (source) => (
      path.basename(source) !== '.DS_Store'
      && !ownerOnlySources.has(path.resolve(source))
      && !(source.includes(`${path.sep}personas${path.sep}v2${path.sep}`) && path.basename(source) === 'master')
      && !source.startsWith(path.join(root, 'assets/images/brand/v1'))
      && !source.startsWith(path.join(root, 'assets/images/brand/site-v2'))
      && !(path.dirname(source) === path.join(root, 'assets/images/brand') && /\.(png|webp)$/u.test(source))
      && path.basename(source) !== 'character-freesia-hero.webp'
    )
  });
}
await rm(path.join(output, 'assets', 'social'), { recursive: true, force: true });
await cp(generatedSocial, path.join(output, 'assets', 'social'), { recursive: true });
console.log(`Prepared GitHub Pages artifact with ${entries.length} entries.`);
