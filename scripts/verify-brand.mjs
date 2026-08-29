import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assertBrandAssets, assertBrandContract, assertPublicBrandNaming } from './lib/brand-contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brand = assertBrandContract(JSON.parse(await readFile(path.join(root, 'config/brand.json'), 'utf8')));
await assertBrandAssets(root, brand);

const publicFiles = ['index.html', '404.html', ...await listHtml(path.join(root, 'pages'))];
const sources = await Promise.all(publicFiles.map(async (file) => ({
  file,
  content: await readFile(path.join(root, file), 'utf8')
})));
assertPublicBrandNaming(brand, sources);

for (const source of sources) {
  const mode = source.content.match(/<html\b[^>]*\bdata-brand-mode="([^"]+)"/)?.[1];
  if (!brand.modes[mode]) throw new Error(`brand-contract violation: ${source.file} has invalid mode ${mode ?? '(missing)'}`);
  const expectedTheme = brand.modes[mode].themeColor;
  if (!source.content.includes(`<meta name="theme-color" content="${expectedTheme}">`)) {
    throw new Error(`brand-contract violation: ${source.file} has stale mode theme color`);
  }
}

console.log(`Brand contract verified: ${sources.length} HTML pages, ${Object.keys(brand.assets).length} assets, ${Object.keys(brand.modes).length} modes.`);

async function listHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await listHtml(absolute));
    if (entry.isFile() && entry.name.endsWith('.html')) paths.push(path.relative(root, absolute));
  }
  return paths.sort();
}
