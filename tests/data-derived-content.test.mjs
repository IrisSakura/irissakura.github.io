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
  assert.ok(
    journalHtml.includes(`${journal.streams.length} 条相互验证的知识流`),
    'Journal stream heading must use the curated stream registry'
  );
  assert.ok(
    portfolioHtml.includes(`aria-label="${projects.projects.length} 个真实项目"`),
    'portfolio accessibility copy must use the project registry'
  );
  assert.ok(
    portfolioHtml.includes(`${projects.projects.length} 条真实项目主线与 ${consumerLab.cases.length} 个独立消费项目组成从研究、框架到游戏验证的完整链路`),
    'portfolio metadata must use the project and Consumer Lab registries'
  );
});

async function readJson(path) {
  return JSON.parse(await readText(path));
}
