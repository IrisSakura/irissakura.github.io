import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { AMBIENT_PAGES, installVisualDecorations } from '../scripts/lib/visual-decorations.mjs';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const brand = JSON.parse(await read('config/brand.json'));
test('decorations are idempotent and limited to the explicit intro routes', async () => {
  for (const file of AMBIENT_PAGES) {
    const html = await read(file);
    const mode = html.match(/data-brand-mode="([^"]+)"/)[1];
    const prefix = file === 'index.html' ? '' : '../';
    const output = installVisualDecorations(html, { file, brandMode: mode }, prefix, brand);
    assert.equal(installVisualDecorations(output, { file, brandMode: mode }, prefix, brand), output, file);
    assert.equal((output.match(/data-ambient-layer/g) ?? []).length, 1, file);
    assert.equal((output.match(/class="ambient-particle/g) ?? []).length, 12, file);
    assert.match(output, /data-ambient-layer aria-hidden="true"/);
  }
  for (const file of ['pages/game.html', 'pages/blog/unity-quickstart.html', 'pages/journal/crpg.html', 'pages/framework/runtime.html']) {
    const html = await read(file);
    assert.doesNotMatch(html, /data-ambient-layer|visual-decorations.css|class="profile-illustration"/, file);
  }
});
