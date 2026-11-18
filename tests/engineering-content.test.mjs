import { styleSource } from './lib/style-source.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  if (path.startsWith('style/')) return styleSource(path);
  return readFile(new URL(path, root), 'utf8');
}

test('Iris Engineering public snapshot exposes a reviewed control-plane contract', async () => {
  const data = JSON.parse(await readText('data/iris-engineering.json'));

  assert.ok([1, 2].includes(data.schemaVersion));
  assert.equal(data.id, 'iris-engineering');
  assert.equal(typeof data.operatingMode, 'string');
  assert.equal(typeof data.statusLabel, 'string');
  assert.deepEqual(data.workflow.map((step) => step.id), ['observe', 'authorize', 'execute', 'verify']);
  assert.deepEqual(data.capabilities.map((group) => group.id), [
    'workflow-core',
    'read-models',
    'research-intake',
    'agent-execution'
  ]);
  assert.ok(data.evidence.length > 0 && data.evidence.every(({ state }) => ['local-passed', 'failed-closed'].includes(state)));
  assert.ok(data.boundaries.length > 0);
  if (data.schemaVersion === 2) assert.match(data.sourceUpdatedAt, /^\d{4}-\d{2}-\d{2}T/u);

  const publicData = JSON.stringify(data);
  for (const forbidden of ['/Users/', '154.37.215.57', 'git@', 'credential-revoked', 'remote-matched']) {
    assert.ok(!publicData.includes(forbidden), `engineering public data leaks ${forbidden}`);
  }
});

test('Iris Engineering page shows product screens, plain section names and a real entry point', async () => {
  const html = await readText('pages/engineering.html');
  for (const label of ['工作事项', '执行请求', '交付验收', '接入与权限', 'MCP', 'Desktop Worker']) {
    assert.ok(html.includes(label));
  }
  assert.match(html, /href="https:\/\/iris\.irissakura\.com\/">打开工作台<\/a>/u);
  for (const file of ['workbench', 'execution', 'delivery']) {
    const image = `../assets/images/iris-engineering/${file}.png`;
    assert.ok(html.includes(`href="${image}"`));
    assert.ok(html.includes(`src="${image}"`));
    const bytes = await readFile(new URL(image.slice(3), root));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  }
  for (const anchor of ['workflow-observe', 'workflow-authorize', 'workflow-execute', 'workflow-verify', 'capability-workflow-core']) {
    assert.ok(html.includes(`id="${anchor}"`));
  }
  assert.match(html, /href="journal\.html#evidence-chains"/u);
  assert.doesNotMatch(html, /ENGINEERING SYSTEM|ON THIS PAGE|BUILD · ORGANIZE · BLOOM|CONTINUE EXPLORING|让工程推进有据可依/u);
  assert.doesNotMatch(html, /\/Users\/|154\.37\.215\.57|git@|external-read-passed/u);
});

test('Iris project links show the current product in visitor entry points', async () => {
  const [home, portfolio, development] = await Promise.all([
    readText('index.html'), readText('pages/portfolio.html'), readText('pages/development.html')
  ]);
  assert.match(home, /data-project-id="iris-engineering"[\s\S]*?pages\/engineering\.html[\s\S]*?Desktop Worker/u);
  assert.match(portfolio, /id="engineering-tools"[\s\S]*?id="project-iris-engineering"[\s\S]*?版本的结果[\s\S]*?engineering\.html/u);
  assert.equal((portfolio.match(/id="project-iris-engineering"/gu) ?? []).length, 1);
  assert.match(development, /data-project-id="iris-engineering"[\s\S]*?交付审核/u);
});

test('Iris engineering guide renders capability and workflow descriptions from the source snapshot', async () => {
  const [data, html] = await Promise.all([
    readText('data/iris-engineering.json').then(JSON.parse), readText('pages/engineering.html')
  ]);
  const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  for (const { id, title, description } of data.capabilities) {
    assert.ok(html.includes(`id="capability-${id}">`));
    assert.ok(html.includes(`<dt>${escape(title)}</dt><dd>${escape(description)}</dd>`));
  }
  for (const { title, description } of data.workflow) {
    assert.ok(html.includes(`<dt>${escape(title)}</dt><dd>${escape(description)}</dd>`));
  }
});
