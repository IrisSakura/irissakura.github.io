import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  assertFrameworkQuickstart,
  resolveQuickstartRoutes
} from '../scripts/lib/framework-quickstart.mjs';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

test('quickstart is a 15-minute fail-closed projection of reviewed stable routes', async () => {
  const [quickstart, adoption] = await Promise.all([
    readJson('data/framework-quickstart.json'),
    readJson('data/framework-adoption.json')
  ]);

  assert.doesNotThrow(() => assertFrameworkQuickstart(quickstart, adoption));
  assert.equal(quickstart.schemaVersion, 1);
  assert.equal(quickstart.durationMinutes, 15);
  assert.deepEqual(quickstart.routeSequence, ['core-only', 'bootstrap-lite']);
  assert.deepEqual(
    quickstart.steps.map((step) => step.id),
    [
      'install-editor-tools',
      'confirm-core-only',
      'install-bootstrap-lite',
      'run-first-event',
      'reuse-first-object',
      'verify-and-clean'
    ]
  );

  const resolved = resolveQuickstartRoutes(quickstart, adoption);
  assert.deepEqual(
    resolved.map((route) => route.packages.map((entry) => entry.packageName)),
    quickstart.routeSequence.map((routeId) => {
      const route = adoption.stableRoutes.find((entry) => entry.id === routeId);
      return route.packages.map((id) => (
        adoption.supportedPackages.find((entry) => entry.id === id).packageName
      ));
    })
  );

  for (const step of quickstart.steps) {
    assert.ok(!Object.hasOwn(step, 'packages'), `${step.id} must derive packages from the adoption registry`);
  }

  const serialized = JSON.stringify(quickstart);
  assert.ok(!serialized.includes('/Users/'));
  assert.ok(!serialized.includes('file://'));
  assert.ok(!serialized.includes('git@'));
  assert.doesNotMatch(serialized, /\bv?\d+\.\d+\.\d+\b/u, 'website quickstart must not pin an unreviewed version');
  assert.equal(quickstart.channel.stability, 'development-evaluation');
  assert.match(quickstart.channel.installUrl, /^https:\/\/github\.com\/IrisSakura\/UnityGameFramework\.git\?path=\/Packages\/com\.unitygame\.framework\.editor-tools#main$/u);
  assert.deepEqual(
    quickstart.runtimeStarter,
    {
      maturity: 'Preview',
      isProfile: false,
      isPreset: false,
      isStable: false
    }
  );

  const eventStep = quickstart.steps.find((step) => step.id === 'run-first-event');
  for (const api of ['EventService', 'IEvent', 'AddListener', 'TriggerEvent', 'RemoveListener', 'Clear']) {
    assert.ok(eventStep.code.includes(api), `event example must show ${api}`);
  }

  const poolingStep = quickstart.steps.find((step) => step.id === 'reuse-first-object');
  for (const api of ['ObjectPool<', '.Get()', '.Release(', '.Clear()']) {
    assert.ok(poolingStep.code.includes(api), `pooling example must show ${api}`);
  }
});

test('quickstart contract rejects route drift and a promoted Runtime Starter claim', async () => {
  const [quickstart, adoption] = await Promise.all([
    readJson('data/framework-quickstart.json'),
    readJson('data/framework-adoption.json')
  ]);

  const unknownRoute = structuredClone(quickstart);
  unknownRoute.routeSequence[1] = 'preview-everything';
  assert.throws(
    () => assertFrameworkQuickstart(unknownRoute, adoption),
    /unknown stable route.*preview-everything/u
  );

  const promotedRuntimeStarter = structuredClone(quickstart);
  promotedRuntimeStarter.runtimeStarter.isStable = true;
  assert.throws(
    () => assertFrameworkQuickstart(promotedRuntimeStarter, adoption),
    /Runtime Starter must remain Preview and non-stable/u
  );

  const unsupportedPackage = structuredClone(adoption);
  unsupportedPackage.stableRoutes[1].packages.push('preview-module');
  assert.throws(
    () => assertFrameworkQuickstart(quickstart, unsupportedPackage),
    /stable route.*unsupported package.*preview-module/u
  );
});

test('generated quickstart is indexable, self-contained and linked from Framework', async () => {
  const [quickstart, adoption, quickstartHtml, frameworkHtml, sitemap, projects, maintenance] = await Promise.all([
    readJson('data/framework-quickstart.json'),
    readJson('data/framework-adoption.json'),
    readText('pages/framework-quickstart.html'),
    readText('pages/framework.html'),
    readText('sitemap.xml'),
    readJson('data/projects.json'),
    readText('docs/maintenance/framework-sync.md')
  ]);

  assert.ok(quickstartHtml.includes('"@type":"HowTo"'));
  assert.ok(quickstartHtml.includes('"totalTime":"PT15M"'));
  assert.ok(quickstartHtml.includes('15 分钟快速开始'));
  assert.ok(quickstartHtml.includes('开发 / 评估入口'));
  assert.ok(quickstartHtml.includes('正式项目不要把 <code>#main</code> 当作 Stable'));
  assert.ok(quickstartHtml.includes('dependency-missing'));
  assert.ok(quickstartHtml.includes('Config / Audio'));
  assert.ok(quickstartHtml.includes('按 owner token 清理'));

  for (const step of quickstart.steps) {
    assert.ok(quickstartHtml.includes(`id="${step.id}"`), `generated page missing ${step.id}`);
  }
  const quickstartPackageIds = new Set(
    adoption.stableRoutes
      .filter((route) => quickstart.routeSequence.includes(route.id))
      .flatMap((route) => route.packages)
  );
  for (const packageEntry of adoption.supportedPackages.filter((entry) => quickstartPackageIds.has(entry.id))) {
    assert.ok(quickstartHtml.includes(packageEntry.packageName), `generated page missing ${packageEntry.packageName}`);
  }

  assert.ok(frameworkHtml.includes('href="framework-quickstart.html"'));
  assert.ok(sitemap.includes('/pages/framework-quickstart.html'));
  const frameworkProject = projects.projects.find((project) => project.id === 'sakura-framework');
  assert.ok(frameworkProject.milestones.includes('发布站内 15 分钟快速开始'));
  assert.ok(frameworkProject.next.includes('提供独立 Sample Repository'));
  assert.ok(!frameworkProject.next.some((entry) => entry.includes('15 分钟快速开始')));
  assert.ok(maintenance.includes('data/framework-quickstart.json'));
  assert.ok(maintenance.includes('路线 ID'));
});
