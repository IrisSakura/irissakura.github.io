import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundleCss } from './lib/css-bundle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist/styles/site.css');
const css = await bundleCss(path.join(root, 'style/main.css'), output);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${css.toString()}\n`);
console.log(`Built layered CSS bundle (${Buffer.byteLength(css.toString())} bytes).`);
