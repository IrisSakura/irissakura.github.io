import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { assertProjectFactsCurrent } from '../scripts/lib/project-facts.mjs';
import { resolveFrameworkReviewedContent } from '../scripts/lib/framework-reviewed-content.mjs';

const root = new URL('../', import.meta.url);
const readJson = async file => JSON.parse(await readFile(new URL(file, root), 'utf8'));

async function inputs() {
  const [framework, adoption, quickstart, projects, previousReview, journal] = await Promise.all([
    'data/framework.json', 'data/framework-adoption.json', 'data/framework-quickstart.json',
    'data/projects.json', 'data/framework-previous-review.json', 'data/journal.json'
  ].map(readJson));
  // Model the cross-repository transition even after a new snapshot arrives.
  framework.adoptionReviewHash = previousReview.adoption.adoptionReviewHash;
  framework.lifecycleCounts.Supported = previousReview.adoption.supportedPackages.length;
  return { framework, adoption, quickstart, projects, previousReview, journal };
}

function resolve(input) {
  return resolveFrameworkReviewedContent(
    input.framework, input.adoption, input.quickstart, input.projects, input.previousReview
  );
}

test('a prerequisite review keeps the complete current snapshot publishable without promoting its packages', async () => {
  const input = await inputs();
  const current = resolve(input);
  assert.equal(current.adoption.adoptionReviewHash, input.framework.adoptionReviewHash);
  assert.equal(current.quickstart.adoptionReviewHash, input.framework.adoptionReviewHash);
  assert.equal(current.adoption.supportedPackages.length, input.previousReview.adoption.supportedPackages.length);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'work-orchestration'), true);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'reddot'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'reddot-foundation'), true);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'save'), true);
  for (const id of ['parallel', 'hitbox', 'swarm']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['command', 'ticker', 'shield']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['input', 'movement', 'secondary-animation']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['asset', 'audio', 'rendering']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['gas', 'semantic-combat', 'combat-director']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['ui-core', 'ui-binding', 'localization', 'mvvm', 'ui']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['networking', 'simulation', 'online']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['interaction', 'dialogue', 'codex']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['survival', 'calendar', 'tech-tree']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['config', 'service-flow']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), true);
  for (const id of ['evolutionary-computation', 'homeostasis', 'lotka-volterra']) assert.equal(current.adoption.supportedPackages.some(entry => entry.id === id), false);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'save-foundation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'simulation-foundation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'command-presentation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'motion-foundation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'asset-presentation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'combat-foundation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'ui-foundation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'online-foundation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'content-interaction-foundation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'world-progression-foundation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'configured-service-foundation'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'adaptive-balance-foundation'), false);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'quest'), true);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'quest-foundation').packages, ['rules', 'quest']);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'leaderboard'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'leaderboard-only'), true);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'mail'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'mail-only'), true);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'welfare'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'welfare-foundation'), true);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'rules'), true);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'rules-only'), true);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'response-rules'), true);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'response-rules-only').packages, ['response-rules']);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'pathfinding'), true);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'ledger'), true);
  assert.equal(current.adoption.supportedPackages.some(entry => entry.id === 'economy'), true);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'ledger-only').packages, ['ledger']);
  assert.equal(current.adoption.stableRoutes.some(route => route.id === 'work-orchestration-only'), true);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'pathfinding-foundation').packages, ['core', 'pathfinding']);
  assert.deepEqual(current.projects.projects.find(project => project.id === 'sakura-framework'), input.previousReview.project);
  assert.doesNotThrow(() => assertProjectFactsCurrent(current.projects, input.framework, input.journal));
  for (const project of input.projects.projects.filter(project => project.id !== 'sakura-framework')) {
    assert.deepEqual(current.projects.projects.find(entry => entry.id === project.id), project);
  }
  assert.equal(input.adoption.supportedPackages.length, input.previousReview.adoption.supportedPackages.length + 3, 'the reviewed three-package prerequisite must remain available');
  assert.notEqual(input.adoption.adoptionReviewHash, input.framework.adoptionReviewHash);
});

test('arrival of the reviewed Framework snapshot switches adoption, quickstart and project facts together', async () => {
  const input = await inputs();
  // A future synchronized snapshot, not a claim that this snapshot has arrived.
  input.framework = {
    ...input.framework,
    adoptionReviewHash: input.adoption.adoptionReviewHash,
    lifecycleCounts: { ...input.framework.lifecycleCounts, Supported: input.adoption.supportedPackages.length }
  };
  const current = resolve(input);
  assert.equal(current.adoption, input.adoption);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'pathfinding-foundation').packages, ['core', 'pathfinding']);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'pathfinding').length, 1);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'ledger').length, 1);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'economy').length, 1);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'work-orchestration').length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'work-orchestration-only').packages, ['work-orchestration']);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'economy-foundation').packages, ['economy', 'ledger']);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'ledger-only').packages, ['ledger']);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'rules').length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'rules-only').packages, ['rules']);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'welfare').length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'welfare-foundation').packages, ['rules','welfare']);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'mail').length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'mail-only').packages, ['mail']);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'leaderboard').length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'leaderboard-only').packages, ['leaderboard']);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'quest').length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'quest-foundation').packages, ['rules','quest']);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'reddot').length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'reddot-foundation').packages, ['core', 'reddot']);
  assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === 'save').length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'save-foundation').packages, ['core', 'save']);
  for (const id of ['parallel', 'hitbox', 'swarm']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'simulation-foundation').packages, ['core', 'parallel', 'hitbox', 'swarm']);
  for (const id of ['command', 'ticker', 'shield']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'command-presentation').packages, ['core', 'command', 'ticker', 'shield']);
  for (const id of ['input', 'movement', 'secondary-animation']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'motion-foundation').packages, ['core', 'pooling', 'gamehelper', 'event', 'input', 'movement', 'secondary-animation']);
  for (const id of ['asset', 'audio', 'rendering']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'asset-presentation').packages, ["core","pooling","gamehelper","event","preferences","input","asset","audio","rendering"]);
  for (const id of ['gas', 'semantic-combat', 'combat-director']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'combat-foundation').packages, ["core","pooling","gamehelper","event","preferences","input","asset","audio","rendering","hitbox","gas","semantic-combat","combat-director"]);
  for (const id of ['ui-core', 'ui-binding', 'localization', 'mvvm', 'ui']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'ui-foundation').packages, ["core","pooling","gamehelper","event","preferences","input","asset","save","ui-core","ui-binding","localization","mvvm","ui"]);
  for (const id of ['networking', 'simulation', 'online']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'online-foundation').packages, ["core","command","networking","simulation","online"]);
  for (const id of ['interaction', 'dialogue', 'codex']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'content-interaction-foundation').packages, ["core","pooling","gamehelper","event","preferences","asset","localization","interaction","dialogue","codex"]);
  for (const id of ['survival', 'calendar', 'tech-tree']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'world-progression-foundation').packages, ["core", "pooling", "gamehelper", "event", "asset", "parallel", "save", "ledger", "economy", "survival", "calendar", "tech-tree"]);
  for (const id of ['config', 'service-flow']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'configured-service-foundation').packages, ["core", "pooling", "gamehelper", "event", "asset", "config-core", "config", "service-flow"]);
  for (const id of ['evolutionary-computation', 'homeostasis', 'lotka-volterra']) assert.equal(current.adoption.supportedPackages.filter(entry => entry.id === id).length, 1);
  assert.deepEqual(current.adoption.stableRoutes.find(route => route.id === 'adaptive-balance-foundation').packages, ['core', 'evolutionary-computation', 'homeostasis', 'lotka-volterra']);
  assert.equal(current.quickstart, input.quickstart);
  assert.equal(current.adoption.stableRoutes.find(route => route.id === 'config-core-only').packages.join(','), 'config-core');
  assert.doesNotThrow(() => assertProjectFactsCurrent(current.projects, input.framework, input.journal));
});

test('a single matching review remains supported', async () => {
  const input = await inputs();
  input.adoption = input.previousReview.adoption;
  input.quickstart = input.previousReview.quickstart;
  input.projects.projects = input.projects.projects.map(project => (
    project.id === 'sakura-framework' ? input.previousReview.project : project
  ));
  input.previousReview = undefined;
  assert.equal(resolve(input).adoption, input.adoption);
});

test('an unknown Framework hash or contract remains blocked', async () => {
  const input = await inputs();
  input.framework.adoptionReviewHash = `sha256:${'f'.repeat(64)}`;
  assert.throws(() => resolve(input), /adoption review required.*Supported package identities.*stable route closures/u);
  input.framework.adoptionReviewContract = 'supported-stable-v2';
  assert.throws(() => resolve(input), /adoption review required.*supported-stable-v2/u);
});

test('retained reviews cannot silently change identities, route closures, quickstart or project facts', async () => {
  const input = await inputs();
  for (const mutate of [
    review => { review.adoption.supportedPackages[0].packageName += '-changed'; },
    review => { review.adoption.stableRoutes[0].packages.push('event'); },
    review => { review.quickstart.adoptionReviewHash = input.adoption.adoptionReviewHash; },
    review => { review.project.reviewedFrameworkAdoptionHash = input.adoption.adoptionReviewHash; }
  ]) {
    const changed = structuredClone(input);
    mutate(changed.previousReview);
    assert.throws(() => resolve(changed), /review hash does not match|quickstart adoption review hash is stale|matching Sakura Framework project facts/u);
  }
  const duplicated = { ...input, previousReview: { schemaVersion: 1, adoption: input.adoption, quickstart: input.quickstart, project: input.projects.projects.find(project => project.id === 'sakura-framework') } };
  assert.throws(() => resolve(duplicated), /distinct adoptionReviewHash/u);
  input.framework.lifecycleCounts.Supported = input.previousReview.adoption.supportedPackages.length + 1;
  assert.throws(() => resolve(input), /Supported count does not match/u);
});

test('generated adoption uses the same reviewed package set as the actual Framework snapshot', async () => {
  const [framework, adoption, quickstart, projects, previousReview] = await Promise.all([
    'data/framework.json', 'data/framework-adoption.json', 'data/framework-quickstart.json',
    'data/projects.json', 'data/framework-previous-review.json'
  ].map(readJson));
  const current = resolveFrameworkReviewedContent(framework, adoption, quickstart, projects, previousReview);
  const html = await readFile(new URL('pages/framework.html', root), 'utf8');
  const adoptionBlock = html.match(/<!-- framework-adoption:start -->([\s\S]*?)<!-- framework-adoption:end -->/u)?.[1];
  assert.ok(adoptionBlock, 'generated Framework adoption block must exist');
  assert.ok(adoptionBlock.includes(`${current.adoption.supportedPackages.length} 个 Supported 包`));
  for (const entry of current.adoption.supportedPackages) assert.ok(adoptionBlock.includes(entry.packageName));
  if (!current.adoption.supportedPackages.some(entry => entry.id === 'config-core')) {
    assert.doesNotMatch(adoptionBlock, /Config Snapshot Core|Config Core Only|com\.unitygame\.framework\.config-core/u);
  }
});


test('a complete package can retain multiple logical module identities in the existing review contract', async () => {
  const input = await inputs();
  input.framework.adoptionReviewHash = input.adoption.adoptionReviewHash;
  input.framework.lifecycleCounts.Supported = input.adoption.supportedPackages.length;
  const current = resolve(input);
  const survival = current.adoption.supportedPackages.find(entry => entry.id === 'survival');
  const route = current.adoption.stableRoutes.find(entry => entry.id === 'world-progression-foundation');
  assert.deepEqual(survival.moduleIds, ['survival', 'survival-world']);
  assert.equal(route.packages.length, 12);
  assert.equal(new Set(route.packages).size, 12);
  assert.equal(route.moduleIds.length, 13);
  assert.ok(route.moduleIds.includes('survival-world'));
  const reordered = structuredClone(input);
  reordered.adoption.supportedPackages.find(entry => entry.id === 'survival').moduleIds.reverse();
  reordered.adoption.stableRoutes.find(entry => entry.id === 'world-progression-foundation').moduleIds.reverse();
  assert.doesNotThrow(() => resolve(reordered));
  for (const mutate of [
    adoption => { adoption.supportedPackages.find(entry => entry.id === 'survival').moduleIds.pop(); },
    adoption => { adoption.stableRoutes.find(entry => entry.id === 'world-progression-foundation').moduleIds.pop(); },
    adoption => { adoption.stableRoutes.find(entry => entry.id === 'world-progression-foundation').moduleIds.push('unreviewed'); }
  ]) {
    const changed = structuredClone(input);
    mutate(changed.adoption);
    assert.throws(() => resolve(changed), /review hash does not match/u);
  }
});
