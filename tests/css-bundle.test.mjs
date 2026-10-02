import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { bundleCss } from '../scripts/lib/css-bundle.mjs';

test('CSS bundling preserves layer order, strings and URL origins at nested depths', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'iris-css-'));
  try {
    await mkdir(path.join(dir, 'parts'));
    await writeFile(path.join(dir, 'main.css'), '@layer reset,tokens,base; @import url("parts/base.css") layer(base); .end { content: "a ; { } /*literal*/"; background: url("./hero.svg?v=1#x") }');
    await writeFile(path.join(dir, 'parts/base.css'), '.base { background: url(../petal.svg); mask: url("data:image/svg+xml,%3Csvg%3E"); color: red }');
    const css = (await bundleCss(path.join(dir, 'main.css'), path.join(dir, 'dist/site.css'))).toString();
    assert.match(css, /^@layer reset,tokens,base;@layer base\{\.base/u);
    assert.doesNotMatch(css, /@import/u);
    assert.match(css, /url\("\.\.\/petal.svg"\)/u);
    assert.match(css, /url\("\.\.\/hero.svg\?v=1#x"\)/u);
    assert.match(css, /url\("data:image\/svg\+xml,%3Csvg%3E"\)/u);
    assert.match(css, /content:"a ; \{ \} \/\*literal\*\/"/u);
    await writeFile(path.join(dir, 'parts/base.css'), '@import url("../main.css");');
    await assert.rejects(bundleCss(path.join(dir, 'main.css'), path.join(dir, 'out.css')), /cycle/u);
    await writeFile(path.join(dir, 'main.css'), '@import url("parts/base.css") screen;');
    await assert.rejects(bundleCss(path.join(dir, 'main.css'), path.join(dir, 'out.css')), /Unsupported/u);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
