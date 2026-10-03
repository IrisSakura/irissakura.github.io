import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  buildJournalSnapshot,
  validateJournalSource
} from '../scripts/lib/journal-import-model.mjs';

const body = Buffer.from('# Article\n\nComplete body.');
const source = {
  schemaVersion: 1,
  sourceCommit: 'a'.repeat(40),
  generatedAt: '2026-07-29T20:00:00+08:00',
  summary: { auditCount: 1, blogCount: 1, gameDesignCount: 1 },
  gameDesignCatalogDigest: 'b'.repeat(64),
  audits: [{ id: 'audit-2026-07-29', title: 'Audit', summary: 'Safe.', updatedAt: '2026-07-29', redacted: false }],
  gameDesigns: [{
    id: 'design',
    title: 'Design',
    summary: 'Safe.',
    tags: ['design'],
    updatedAt: '2026-07-29',
    sha256: 'c'.repeat(64)
  }],
  blogs: [{
    id: 'article',
    title: 'Article',
    summary: 'Safe.',
    series: 'Series',
    tags: ['design'],
    updatedAt: '2026-07-29',
    sha256: '4009791562ab525c18bc8baeb3441b586150b68f1740823e542063321b2ccea0',
    bytes: 25,
    contentPath: 'content/blogs/article.md'
  }]
};
const curation = {
  schemaVersion: 1,
  title: 'Journal',
  summary: { description: 'Public research.' },
  streams: [{ id: 'design', title: 'Design' }],
  featuredNotes: [{ id: 'design', source: { kind: 'catalog', id: 'design' }, title: 'Design' }]
};

test('valid fixed-sha export builds the curated site snapshot', () => {
  validateJournalSource(source, new Map([['article', body]]));
  const snapshot = buildJournalSnapshot(curation, source);

  assert.deepEqual(snapshot.summary, {
    gameDesignCount: 1,
    auditCount: 1,
    importedBlogCount: 1,
    knowledgeStreamCount: 1,
    description: 'Public research.'
  });
  assert.equal(snapshot.featuredNotes[0].source, undefined);
  assert.equal(snapshot.sourceSnapshot.sourceCommit, source.sourceCommit);
});

test('tampered bodies and private content fail closed', () => {
  assert.throws(
    () => validateJournalSource(source, new Map([['article', Buffer.from('tampered')]])),
    /digest mismatch/
  );
  const unsafe = structuredClone(source);
  unsafe.audits[0].summary = '/Users/example/private';
  assert.throws(
    () => validateJournalSource(unsafe, new Map([['article', body]])),
    /private or credential-bearing/
  );
  assert.throws(
    () => validateJournalSource({ ...source, gameDesigns: [{ ...source.gameDesigns[0], sha256: 'invalid' }] }, new Map([['article', body]])),
    /Invalid game design catalog digest/
  );
});

function importFixture(context) {
  const repository = fileURLToPath(new URL('../', import.meta.url));
  const directory = mkdtempSync(path.join(tmpdir(), 'journal-import-cli-'));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  const site = path.join(directory, 'site');
  const input = path.join(directory, 'export');
  for (const folder of ['scripts/lib', 'config', 'data', 'content/game-designs']) mkdirSync(path.join(site, folder), { recursive: true });
  mkdirSync(input);
  for (const file of [
    'scripts/import-journal-export.mjs', 'scripts/lib/journal-import-model.mjs',
    'scripts/lib/blog-publication-model.mjs', 'scripts/lib/blog-discovery-model.mjs',
    'config/blog-publication.json', 'config/journal-curation.json',
    'data/journal.json', 'data/journal-source.json', 'data/blog-taxonomy.json'
  ]) cpSync(path.join(repository, file), path.join(site, file));
  cpSync(path.join(repository, 'content/blogs'), path.join(site, 'content/blogs'), { recursive: true });
  cpSync(path.join(repository, 'content/blogs'), path.join(input, 'blogs'), { recursive: true });
  writeFileSync(path.join(site, 'content/blogs/stale.md'), 'Old article retained on failure.');
  writeFileSync(path.join(site, 'content/game-designs/legacy.md'), 'Old design retained on failure.');
  const incoming = JSON.parse(readFileSync(path.join(site, 'data/journal-source.json'), 'utf8'));
  incoming.sourceCommit = 'e'.repeat(40);
  const first = incoming.blogs[0];
  const file = path.join(input, 'blogs', `${first.id}.md`);
  const nextBody = Buffer.concat([readFileSync(file), Buffer.from('\n\nImported fixture paragraph.\n')]);
  first.bytes = nextBody.length;
  first.sha256 = createHash('sha256').update(nextBody).digest('hex');
  writeFileSync(file, nextBody);
  writeFileSync(path.join(input, 'journal-source.json'), JSON.stringify(incoming));

  // Inject filesystem failures only in this isolated CLI subprocess.
  const hook = path.join(directory, 'fault.mjs');
  writeFileSync(hook, `import fs from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
const rename = fs.rename, writeFile = fs.writeFile;
const fault = process.env.JOURNAL_TEST_FAULT;
let failed = false;
const fail = () => { failed = true; throw Object.assign(new Error('injected journal filesystem failure'), { code: 'EIO' }); };
fs.writeFile = async (file, ...args) => {
  if (!failed && fault === 'stage-write' && String(file).includes('/incoming-blogs/')) fail();
  return writeFile(file, ...args);
};
fs.rename = async (from, to) => {
  const installing = String(from).includes('/incoming');
  if (!failed && ((fault === 'metadata-install' && installing && String(to).endsWith('/data/journal-source.json'))
    || (['blog-install', 'rollback-failure'].includes(fault) && installing && String(to).endsWith('/content/blogs'))
    || (fault === 'design-backup' && String(from).endsWith('/content/game-designs')))) fail();
  if (failed && fault === 'rollback-failure' && String(from).includes('/previous-') && String(to).endsWith('/data/journal-source.json')) fail();
  return rename(from, to);
};
syncBuiltinESMExports();
`);
  const run = (fault = '', ...args) => spawnSync(process.execPath, [
    '--import', hook, path.join(site, 'scripts/import-journal-export.mjs'), '--input', input, ...args
  ], { encoding: 'utf8', env: { ...process.env, JOURNAL_TEST_FAULT: fault } });
  return { site, run, incoming, first, nextBody };
}

function snapshot(directory) {
  const files = {};
  const walk = folder => {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(file);
      else files[path.relative(directory, file)] = readFileSync(file).toString('base64');
    }
  };
  for (const folder of ['config', 'data', 'content']) walk(path.join(directory, folder));
  return files;
}

for (const fault of ['stage-write', 'metadata-install', 'blog-install', 'design-backup']) {
  test(`Journal CLI restores metadata and content after ${fault} failure`, context => {
    const { site, run } = importFixture(context);
    const before = snapshot(site);
    const result = run(fault);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /injected journal filesystem failure/u);
    assert.deepEqual(snapshot(site), before, 'a failed import must retain every installed byte');
    assert.ok(existsSync(path.join(site, 'content/blogs')));
    assert.ok(readdirSync(path.join(site, 'content')).every(name => !name.startsWith('.journal-import-')));
  });
}

test('Journal CLI installs a complete snapshot, removes stale bodies and is idempotent', context => {
  const { site, run, incoming, first, nextBody } = importFixture(context);
  assert.equal(run().status, 0);
  assert.equal(JSON.parse(readFileSync(path.join(site, 'data/journal-source.json'), 'utf8')).sourceCommit, incoming.sourceCommit);
  assert.deepEqual(readFileSync(path.join(site, 'content/blogs', `${first.id}.md`)), nextBody);
  assert.equal(existsSync(path.join(site, 'content/blogs/stale.md')), false);
  assert.equal(existsSync(path.join(site, 'content/game-designs')), false);
  const installed = snapshot(site);
  assert.equal(run('', '--check').status, 0);
  assert.equal(run().status, 0);
  assert.deepEqual(snapshot(site), installed);
});

test('Journal CLI retains recovery files when the filesystem also rejects rollback', context => {
  const { site, run } = importFixture(context);
  const original = readFileSync(path.join(site, 'data/journal-source.json'));
  const result = run('rollback-failure');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /rollback incomplete; retained recovery files:/u);
  const recovery = readdirSync(path.join(site, 'content')).filter(name => name.startsWith('.journal-import-'));
  assert.equal(recovery.length, 1);
  const folder = path.join(site, 'content', recovery[0]);
  assert.ok(readdirSync(folder).some(name => name.startsWith('previous-') && readFileSync(path.join(folder, name)).equals(original)), 'original metadata survives even if restoration fails');
  assert.ok(existsSync(path.join(site, 'content/blogs/stale.md')));
});
