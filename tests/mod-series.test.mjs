import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { assertModSeriesConfig, resolveModSeries } from '../scripts/lib/mod-series.mjs';

const root = new URL('../', import.meta.url);
const readJson = async (file) => JSON.parse(await readFile(new URL(file, root), 'utf8'));
const load = () => Promise.all([readJson('config/mod-series.json'), readJson('config/brand.json'), readJson('data/projects.json')]);

test('Freesia series resolves registered public projects without duplicating facts', async () => {
  const [config, brand, projects] = await load();
  assertModSeriesConfig(config, brand, projects);
  const resolved = resolveModSeries(config, projects);
  assert.equal(resolved.entries[0].source, projects.projects.find(({ id }) => id === 'the-weaver'));
});

test('shared foundations stay separate from featured mods', async () => {
  const [config,, projects] = await load();
  const [group] = resolveModSeries(config, projects).groups;
  assert.deepEqual(group.mods.map(({ projectId }) => projectId), ['the-weaver']);
  assert.deepEqual(group.foundations.map(({ projectId }) => projectId), ['iris-core']);
});

test('invalid Freesia membership fails closed', async () => {
  const [config, brand, projects] = await load();
  const mutate = (change) => ({ ...config, entries: config.entries.map((entry) => ({ ...entry })), ...change });
  assert.throws(() => assertModSeriesConfig(mutate({ entries: [{ ...config.entries[0], projectId: 'unknown' }] }), brand, projects), /missing public project/u);
  assert.throws(() => assertModSeriesConfig(mutate({ entries: [config.entries[0], { ...config.entries[1], projectId: config.entries[0].projectId }] }), brand, projects), /duplicate project/u);
  assert.throws(() => assertModSeriesConfig(mutate({ entries: [{ ...config.entries[0], role: 'unknown' }] }), brand, projects), /unknown role/u);
});
