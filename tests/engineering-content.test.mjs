import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
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
  assert.ok(data.evidence.some((entry) => entry.state === 'failed-closed'));
  assert.ok(data.boundaries.length >= 4);
  if (data.schemaVersion === 2) assert.match(data.sourceUpdatedAt, /^\d{4}-\d{2}-\d{2}T/u);

  const publicData = JSON.stringify(data);
  for (const forbidden of ['/Users/', '154.37.215.57', 'git@', 'credential-revoked', 'remote-matched']) {
    assert.ok(!publicData.includes(forbidden), `engineering public data leaks ${forbidden}`);
  }
});

test('generated Iris Engineering page explains capability, evidence and limits without private routes', async () => {
  const [html, generator] = await Promise.all([
    readText('pages/engineering.html'),
    readText('scripts/generate-site.mjs')
  ]);

  for (const fragment of [
    'IRIS ENGINEERING',
    '研发工作流控制面',
    'Observe',
    'Authorize',
    'Execute',
    'Verify',
    'Research Artifact',
    'Agent Execution',
    '失败关闭',
    '当前边界'
  ]) {
    assert.ok(html.includes(fragment), `missing engineering fragment: ${fragment}`);
  }
  for (const anchor of ['workflow-observe', 'workflow-authorize', 'workflow-verify', 'capability-workflow-core']) {
    assert.ok(html.includes(`id="${anchor}"`), `missing stable control-plane anchor: ${anchor}`);
  }
  assert.ok(html.includes('RESEARCH → CONTROL PLANE → FRAMEWORK → GAME'));
  assert.match(generator, /function renderEngineeringContent\(/u);
  assert.match(generator, /engineering\.sourceUpdatedAt/u);
  assert.match(generator, /源仓更新/u);
  assert.ok(html.includes('data-brand="iris-sakura"'));
  assert.ok(html.includes('href="../style/engineering.css"'));
  for (const forbidden of ['/Users/', '154.37.215.57', 'git@', 'external-read-passed']) {
    assert.ok(!html.includes(forbidden), `engineering page leaks ${forbidden}`);
  }
});
