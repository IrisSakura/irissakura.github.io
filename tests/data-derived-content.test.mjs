import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('generated public copy derives volatile counts from authoritative registries', async () => {
  const [
    framework,
    adoption,
    journal,
    projects,
    consumerLab,
    frameworkHtml,
    journalHtml,
    portfolioHtml
  ] = await Promise.all([
    readJson('data/framework.json'),
    readJson('data/framework-adoption.json'),
    readJson('data/journal.json'),
    readJson('data/projects.json'),
    readJson('data/consumer-lab.json'),
    readText('pages/framework.html'),
    readText('pages/journal.html'),
    readText('pages/portfolio.html')
  ]);

  assert.ok(
    frameworkHtml.includes(
      `${framework.summary.packageCount} 个 Package 中只有 ${framework.lifecycleCounts.Supported} 个处于 Supported`
    ),
    'Framework maturity copy must use the synchronized lifecycle counts'
  );
  assert.ok(
    frameworkHtml.includes(`${adoption.supportedPackages.length} 个 Supported 包与最小采用路线`),
    'Framework adoption heading must use the reviewed package registry'
  );
  assert.equal((journalHtml.match(/class="stream-card"/g) ?? []).length, journal.streams.length);
  assert.ok(frameworkHtml.includes(`${consumerLab.cases.length} 个玩法案例`));
  assert.doesNotMatch(portfolioHtml, /个真实项目|个独立玩法实验/u);
});

async function readJson(path) { return JSON.parse(await readText(path)); }
