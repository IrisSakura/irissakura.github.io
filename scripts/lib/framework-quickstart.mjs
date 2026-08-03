const EXPECTED_ROUTE_SEQUENCE = ['core-only', 'bootstrap-lite'];
const EXPECTED_STEPS = [
  ['install-editor-tools', 0, 2],
  ['confirm-core-only', 2, 4],
  ['install-bootstrap-lite', 4, 7],
  ['run-first-event', 7, 10],
  ['reuse-first-object', 10, 12],
  ['verify-and-clean', 12, 15]
];
const EDITOR_TOOLS_URL = 'https://github.com/IrisSakura/UnityGameFramework.git?path=/Packages/com.unitygame.framework.editor-tools#main';

export function assertFrameworkQuickstart(quickstart, adoption) {
  assertObject(quickstart, 'framework quickstart');
  assertObject(adoption, 'framework adoption');

  if (quickstart.schemaVersion !== 1) {
    throw new Error(`unsupported framework quickstart schema: ${quickstart.schemaVersion}`);
  }
  if (quickstart.adoptionReviewContract !== adoption.adoptionReviewContract) {
    throw new Error('framework quickstart adoption review contract is stale');
  }
  if (quickstart.adoptionReviewHash !== adoption.adoptionReviewHash) {
    throw new Error('framework quickstart adoption review hash is stale');
  }
  if (quickstart.durationMinutes !== 15) {
    throw new Error('framework quickstart duration must be exactly 15 minutes');
  }

  assertString(quickstart.title, 'framework quickstart title');
  assertStringArray(quickstart.prerequisites, 'framework quickstart prerequisites');
  assertStringArray(quickstart.completionChecks, 'framework quickstart completion checks');
  assertStringArray(quickstart.cleanup, 'framework quickstart cleanup');
  assertStringArray(quickstart.stableGuidance, 'framework quickstart stable guidance');

  assertObject(quickstart.channel, 'framework quickstart channel');
  if (quickstart.channel.stability !== 'development-evaluation') {
    throw new Error('Framework #main channel must remain development-evaluation');
  }
  if (quickstart.channel.installUrl !== EDITOR_TOOLS_URL) {
    throw new Error('Framework editor-tools evaluation URL has not been reviewed');
  }
  assertString(quickstart.channel.label, 'framework quickstart channel label');
  assertString(quickstart.channel.packageName, 'framework quickstart channel package name');

  const supportedById = new Map();
  for (const entry of adoption.supportedPackages ?? []) {
    assertObject(entry, 'framework supported package');
    if (supportedById.has(entry.id)) {
      throw new Error(`duplicate supported package id: ${entry.id}`);
    }
    assertString(entry.id, 'framework supported package id');
    assertString(entry.packageName, `framework supported package ${entry.id} name`);
    supportedById.set(entry.id, entry);
  }

  const routesById = new Map();
  for (const route of adoption.stableRoutes ?? []) {
    assertObject(route, 'framework stable route');
    assertString(route.id, 'framework stable route id');
    if (routesById.has(route.id)) throw new Error(`duplicate stable route id: ${route.id}`);
    if (!Array.isArray(route.packages) || route.packages.length === 0) {
      throw new Error(`framework stable route ${route.id} must include packages`);
    }
    for (const packageId of route.packages) {
      if (!supportedById.has(packageId)) {
        throw new Error(`framework stable route ${route.id} references unsupported package ${packageId}`);
      }
    }
    routesById.set(route.id, route);
  }

  if (!Array.isArray(quickstart.routeSequence)) {
    throw new Error('framework quickstart route sequence must be an array');
  }
  if (quickstart.routeSequence.join('\0') !== EXPECTED_ROUTE_SEQUENCE.join('\0')) {
    const unknown = quickstart.routeSequence.find((id) => !routesById.has(id));
    if (unknown) throw new Error(`framework quickstart references unknown stable route ${unknown}`);
    throw new Error(`framework quickstart route sequence must be ${EXPECTED_ROUTE_SEQUENCE.join(' -> ')}`);
  }
  for (const routeId of quickstart.routeSequence) {
    if (!routesById.has(routeId)) {
      throw new Error(`framework quickstart references unknown stable route ${routeId}`);
    }
  }

  if (!Array.isArray(quickstart.steps) || quickstart.steps.length !== EXPECTED_STEPS.length) {
    throw new Error(`framework quickstart must contain ${EXPECTED_STEPS.length} steps`);
  }
  quickstart.steps.forEach((step, index) => {
    assertObject(step, `framework quickstart step ${index + 1}`);
    const [expectedId, expectedStart, expectedEnd] = EXPECTED_STEPS[index];
    if (step.id !== expectedId || step.startMinute !== expectedStart || step.endMinute !== expectedEnd) {
      throw new Error(`framework quickstart step ${index + 1} must be ${expectedId} (${expectedStart}-${expectedEnd})`);
    }
    assertString(step.title, `framework quickstart step ${step.id} title`);
    assertString(step.summary, `framework quickstart step ${step.id} summary`);
    assertStringArray(step.actions, `framework quickstart step ${step.id} actions`);
    assertString(step.completion, `framework quickstart step ${step.id} completion`);
    if (Object.hasOwn(step, 'packages')) {
      throw new Error(`framework quickstart step ${step.id} must derive packages from adoption routes`);
    }
    if (step.routeId && !routesById.has(step.routeId)) {
      throw new Error(`framework quickstart step ${step.id} references unknown stable route ${step.routeId}`);
    }
    if (step.code !== undefined) assertString(step.code, `framework quickstart step ${step.id} code`);
  });

  assertObject(quickstart.runtimeStarter, 'Runtime Starter identity');
  if (
    quickstart.runtimeStarter.maturity !== 'Preview'
    || quickstart.runtimeStarter.isProfile !== false
    || quickstart.runtimeStarter.isPreset !== false
    || quickstart.runtimeStarter.isStable !== false
  ) {
    throw new Error('Runtime Starter must remain Preview and non-stable');
  }
  assertObject(quickstart.runtimeStarterGuide, 'Runtime Starter guide');
  assertString(quickstart.runtimeStarterGuide.summary, 'Runtime Starter guide summary');
  assertStringArray(quickstart.runtimeStarterGuide.requiredChecks, 'Runtime Starter required checks');
  assertStringArray(quickstart.runtimeStarterGuide.optionalChecks, 'Runtime Starter optional checks');

  if (!Array.isArray(quickstart.troubleshooting) || quickstart.troubleshooting.length === 0) {
    throw new Error('framework quickstart troubleshooting must not be empty');
  }
  for (const entry of quickstart.troubleshooting) {
    assertObject(entry, 'framework quickstart troubleshooting entry');
    assertString(entry.symptom, 'framework quickstart troubleshooting symptom');
    assertString(entry.resolution, 'framework quickstart troubleshooting resolution');
  }

  const serialized = JSON.stringify(quickstart);
  if (/\/Users\/|file:\/\/|git@/u.test(serialized)) {
    throw new Error('framework quickstart contains a private or local-only path');
  }
  if (/\bv?\d+\.\d+\.\d+\b/u.test(serialized)) {
    throw new Error('framework quickstart must not pin an unreviewed version');
  }

  return true;
}

export function resolveQuickstartRoutes(quickstart, adoption) {
  assertFrameworkQuickstart(quickstart, adoption);
  const packagesById = new Map(adoption.supportedPackages.map((entry) => [entry.id, entry]));
  const routesById = new Map(adoption.stableRoutes.map((route) => [route.id, route]));
  return quickstart.routeSequence.map((routeId) => {
    const route = routesById.get(routeId);
    return {
      ...route,
      packages: route.packages.map((packageId) => packagesById.get(packageId))
    };
  });
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty array`);
  }
  value.forEach((entry, index) => assertString(entry, `${label}[${index}]`));
}
