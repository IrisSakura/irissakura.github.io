import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { assertEvidenceChainAuthorities, assertEvidenceChains, resolveEvidenceChains } from '../scripts/lib/evidence-chain-model.mjs';

const root = new URL('../', import.meta.url);
const readJson = async (file) => JSON.parse(await readFile(new URL(file, root), 'utf8'));
const readText = async (file) => readFile(new URL(file, root), 'utf8');

test('evidence chain authority config closes the four public segments', async () => {
  const [authorities, irisEngineering] = await Promise.all([
    readJson('config/evidence-chain-authorities.json'),
    readJson('data/iris-engineering.json')
  ]);

  assert.doesNotThrow(() => assertEvidenceChainAuthorities(authorities, irisEngineering));
  assert.deepEqual(Object.keys(authorities).sort(), ['boundary', 'controlPlane', 'id', 'order', 'relationships', 'schemaVersion']);
  assert.equal(authorities.id, 'iris-sakura-four-authority-chain');
  assert.deepEqual(authorities.order, ['research', 'control-plane', 'framework', 'game']);
  assert.deepEqual(authorities.controlPlane.workflowIds, ['observe', 'authorize', 'verify']);
  assert.deepEqual(Object.keys(authorities.controlPlane).sort(), ['capabilityId', 'projectId', 'workflowIds']);
  assert.equal(authorities.controlPlane.capabilityId, 'workflow-core');

  const unknownKey = structuredClone(authorities);
  unknownKey.extra = 'not allowed';
  assert.throws(() => assertEvidenceChainAuthorities(unknownKey, irisEngineering), /unexpected key set/);
  const wrongAuthorityId = structuredClone(authorities);
  wrongAuthorityId.id = 'another-authority-chain';
  assert.throws(() => assertEvidenceChainAuthorities(wrongAuthorityId, irisEngineering), /iris-sakura-four-authority-chain/);
  const unsafe = structuredClone(authorities);
  unsafe.boundary = 'https://private.example/remote evidence';
  assert.throws(() => assertEvidenceChainAuthorities(unsafe, irisEngineering), /private, transport or provenance/);
  const reordered = structuredClone(authorities);
  reordered.order.reverse();
  assert.throws(() => assertEvidenceChainAuthorities(reordered, irisEngineering), /order must be research/);
  const unknownWorkflow = structuredClone(authorities);
  unknownWorkflow.controlPlane.workflowIds[0] = 'unknown-workflow';
  assert.throws(() => assertEvidenceChainAuthorities(unknownWorkflow, irisEngineering), /workflow ids must be exactly/);
  const unknownCapability = structuredClone(authorities);
  unknownCapability.controlPlane.capabilityId = 'unknown-capability';
  assert.throws(() => assertEvidenceChainAuthorities(unknownCapability, irisEngineering), /capability id must be exactly/);
});

test('authority free text rejects normalized private and transport details without rejecting public prose', async () => {
  const [authorities, irisEngineering] = await Promise.all([
    readJson('config/evidence-chain-authorities.json'),
    readJson('data/iris-engineering.json')
  ]);
  const unsafeValues = [
    '/home/alice/private/repo',
    '/var/lib/project/repo',
    '~/private/repo',
    '154.37.215.57',
    '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    '::1',
    'server:path/to/repo',
    'localhost',
    'gitea',
    'abcdef1',
    'SHA: abcdef1234567',
    'commit hash abcdef1234567',
    'source commit abcdef1234567',
    '提交哈希 abcdef1234567',
    '／ｈｏｍｅ／ａａｌｉｃｅ／ｐｒｉｖａｔｅ／ｒｅｐｏ',
    '%2Fhome%2Falice%2Fprivate%2Frepo',
    'C:\\private\\repo',
    '\\\\server\\share\\repo',
    'example.com',
    'REMOTE origin upstream',
    'credential and API token',
    'Runner identity',
    'transport provenance',
    '%ZZ%2Fhome%2Falice%2Fprivate%2Frepo',
    'API to\u2060ken stays private',
    '位置、/home/alice/private/repo',
    '%2525252Fhome%2525252Falice%2525252Fprivate%2525252Frepo',
    'devbox\u2060:path/to/repo',
    'devbox:repo',
    'devbox:private-repo',
    'dev_box:path/to/repo',
    'devbox:file',
    'build_host:artifact',
    'server:private',
    'alice@devbox:repo',
    'devbox:私有仓库路径',
    'devbox:私有仓库路径。',
    'devbox:私有仓库路径！',
    'devbox:/',
    'devbox:/。',
    '\\private',
    '\\private。',
    'C:私有仓库路径',
    'builder:构建物',
    'C:private\\repo',
    '\\private\\repo',
    '位置、~alice/private/repo',
    'Stage:公开证据保持可见。/home/alice/private/repo',
    'Note:公开证据保持可见。%2Fhome%2Falice%2Fprivate%2Frepo',
    'Label:公开证据保持可见。\\private\\repo',
    'Section:公开证据保持可见。\\\\server\\share\\repo',
    'Status:凭据与私钥不得公开。',
    'Result:来源提交号与哈希不得公开。'
  ];
  for (const value of unsafeValues) {
    const unsafe = structuredClone(authorities);
    unsafe.boundary = `该项公开说明用于检验边界，${value}`;
    assert.throws(
      () => assertEvidenceChainAuthorities(unsafe, irisEngineering),
      /private, transport or provenance/,
      `expected unsafe authority text to fail: ${value}`
    );
  }
  for (const value of [
    '研究结论保留公开来源与边界，再进入工作流判断。',
    '四个部分共同说明一条可复查的公开系统链路。',
    '页面只描述已验证能力，不扩大实现承诺。',
    '公开分类 A/B 的说明。',
    '概念 A/B/C 仍属于公开说明。',
    '研究和/或框架说明仍是公开文本。',
    '版本甲/乙均为公开说明，保持可复查。',
    'Stage:公开证据保持可见。',
    'Note:公开证据保持可见。'
  ]) {
    const safe = structuredClone(authorities);
    safe.boundary = value;
    assert.doesNotThrow(() => assertEvidenceChainAuthorities(safe, irisEngineering));
  }
});

test('evidence chains resolve only reviewed four-part public facts', async () => {
  const [data, adoption, journalSource, publication, irisEngineering, authorities] = await Promise.all([
    readJson('data/evidence-chains.json'),
    readJson('data/framework-adoption.json'),
    readJson('data/journal-source.json'),
    readJson('config/blog-publication.json'),
    readJson('data/iris-engineering.json'),
    readJson('config/evidence-chain-authorities.json')
  ]);

  assert.doesNotThrow(() => assertEvidenceChains(data, adoption, journalSource, publication, irisEngineering, authorities));
  const chains = resolveEvidenceChains(data, adoption, journalSource, publication, irisEngineering, authorities);
  assert.equal(chains.length, 3);
  assert.ok(chains.every((chain) => chain.research.length > 0));
  assert.ok(chains.every((chain) => chain.controlPlane.projectId === 'iris-engineering'));
  assert.ok(chains.every((chain) => chain.controlPlane.capabilityId === 'workflow-core'));
  assert.deepEqual(chains[0].controlPlane.workflows.map((workflow) => workflow.id), ['observe', 'authorize', 'verify']);
  assert.ok(chains.some((chain) => chain.research.some((item) => item.href === 'blog/metroidvania-capability-gated-topology.html')));
  assert.ok(chains.some((chain) => chain.research.some((item) => item.href === 'journal/extraction-cross-session-loop.html')));

  const unknownSystem = structuredClone(data);
  unknownSystem.chains[0].gameSystem = '不存在的系统';
  assert.throws(
    () => assertEvidenceChains(unknownSystem, adoption, journalSource, publication, irisEngineering, authorities),
    /unknown game adoption system/
  );

  const referencedArticleId = data.chains
    .flatMap((chain) => chain.research)
    .find((reference) => reference.type === 'article')?.id;
  assert.ok(referencedArticleId, 'fixture requires a referenced public article');
  const draftPublication = structuredClone(publication);
  draftPublication.articles.find((article) => article.sourceId === referencedArticleId).status = 'draft';
  assert.throws(
    () => assertEvidenceChains(data, adoption, journalSource, draftPublication, irisEngineering, authorities),
    /is not a published article/
  );
});

test('all four public pages expose the same ordered evidence chain', async () => {
  const [data, authorities, engineering, game, framework, journal] = await Promise.all([
    readJson('data/evidence-chains.json'),
    readJson('config/evidence-chain-authorities.json'),
    readText('pages/engineering.html'),
    readText('pages/game.html'),
    readText('pages/framework.html'),
    readText('pages/journal.html')
  ]);

  for (const chain of data.chains) {
    for (const [page, html] of Object.entries({ engineering, game, framework, journal })) {
      assert.ok(html.includes(`id="evidence-chain-${chain.id}"`), `${page} missing ${chain.id}`);
      assert.ok(html.includes(`game.html#${chain.gameAnchor}`), `${page} missing game link for ${chain.id}`);
      assert.ok(html.includes('framework.html#game-adoption'), `${page} missing Framework adoption link`);
      assert.ok(html.includes('engineering.html#workflow-observe'), `${page} missing control-plane workflow link`);
      assert.ok(html.includes('engineering.html#capability-workflow-core'), `${page} missing control-plane capability link`);
      for (const relationship of Object.values(authorities.relationships)) {
        assert.ok(html.includes(relationship), `${page} missing relationship text: ${relationship}`);
      }
      const path = html.slice(html.indexOf(`id="evidence-chain-${chain.id}"`), html.indexOf(`id="evidence-chain-${chain.id}"`) + 3500);
      assert.ok(path.indexOf('RESEARCH') < path.indexOf('CONTROL PLANE'), `${page} has wrong research/control-plane order`);
      assert.ok(path.indexOf('CONTROL PLANE') < path.indexOf('FRAMEWORK'), `${page} has wrong control-plane/framework order`);
      assert.ok(path.indexOf('FRAMEWORK') < path.indexOf('GAME'), `${page} has wrong framework/game order`);
    }
    assert.ok(game.includes(`id="${chain.gameAnchor}"`), `game missing source anchor ${chain.gameAnchor}`);
  }
});
