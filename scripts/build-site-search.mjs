import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { buildSiteSearchAssets } from './lib/site-search-assets.mjs';

const load = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [index, budget] = await Promise.all([
  load('../data/site-search-index.json'),
  load('../config/performance-budget.json')
]);
const output = new URL('../dist/site-search/', import.meta.url);
const files = buildSiteSearchAssets(index, budget.searchIndexBytes);
await mkdir(output, { recursive: true });
await Promise.all([...files].filter(([name]) => name !== 'index.json')
  .map(([name, contents]) => writeFile(new URL(name, output), contents)));
await writeFile(new URL('index.json', output), files.get('index.json'));
