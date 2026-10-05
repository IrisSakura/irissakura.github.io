import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { assertFrameworkAdoptionReviewed } from './framework-adoption-review.mjs';
import { assertFrameworkQuickstart } from './framework-quickstart.mjs';

export async function readFrameworkReviewedContent() {
  const root = new URL('../../', import.meta.url);
  const [framework, adoption, quickstart, projects, previousReview] = await Promise.all([
    'data/framework.json',
    'data/framework-adoption.json',
    'data/framework-quickstart.json',
    'data/projects.json',
    'data/framework-previous-review.json'
  ].map(async file => JSON.parse(await readFile(new URL(file, root), 'utf8'))));
  return { framework, ...resolveFrameworkReviewedContent(framework, adoption, quickstart, projects, previousReview) };
}

// Keep the next review available to the Framework prerequisite while publishing
// only the complete review matching the snapshot that has actually arrived.
export function resolveFrameworkReviewedContent(framework, adoption, quickstart, projects, previousReview) {
  const currentProject = projects?.projects?.find(project => project.id === 'sakura-framework');
  const reviews = [{ adoption, quickstart, project: currentProject }];
  if (previousReview !== undefined) {
    if (previousReview?.schemaVersion !== 1) {
      throw new Error('framework previous review must use schemaVersion 1');
    }
    reviews.push(previousReview);
  }

  const hashes = new Set();
  for (const review of reviews) {
    assertFrameworkAdoptionReviewed(review.adoption, review.adoption);
    if (hashes.has(review.adoption.adoptionReviewHash)) {
      throw new Error('framework reviews must have distinct adoptionReviewHash values');
    }
    hashes.add(review.adoption.adoptionReviewHash);
    assertAdoptionFactsHash(review.adoption);
    assertFrameworkQuickstart(review.quickstart, review.adoption);
    if (review.project?.id !== 'sakura-framework'
      || review.project.reviewedFrameworkAdoptionHash !== review.adoption.adoptionReviewHash) {
      throw new Error('framework review must include matching Sakura Framework project facts');
    }
  }

  const selected = reviews.find(review => (
    review.adoption.adoptionReviewContract === framework.adoptionReviewContract
    && review.adoption.adoptionReviewHash === framework.adoptionReviewHash
  ));
  // Preserve the existing fail-closed diagnostic for an unreviewed snapshot.
  assertFrameworkAdoptionReviewed(framework, selected?.adoption ?? adoption);
  if (framework.lifecycleCounts?.Supported !== selected.adoption.supportedPackages.length) {
    throw new Error('framework Supported count does not match the selected adoption review');
  }

  const projectedProjects = projects.projects.map(project => (
    project.id === 'sakura-framework' ? selected.project : project
  ));
  return {
    adoption: selected.adoption,
    quickstart: selected.quickstart,
    projects: {
      ...projects,
      updatedAt: projectedProjects.map(project => project.updatedAt).sort().at(-1),
      projects: projectedProjects
    }
  };
}

function assertAdoptionFactsHash(adoption) {
  // supported-stable-v1 uses ordinal sorting and hashes package/module
  // identities and stable route closures, never display metadata or versions.
  const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
  const packagesById = new Map(adoption.supportedPackages.map(entry => [entry.id, entry]));
  const facts = {
    schemaVersion: 1,
    supportedPackages: adoption.supportedPackages.map(entry => ({
      name: entry.packageName,
      moduleIds: [...(entry.moduleIds ?? [entry.id])].sort(compare)
    })).sort((left, right) => compare(left.name, right.name)),
    stableRoutes: adoption.stableRoutes.map(route => ({
      id: route.id,
      moduleIds: [...(route.moduleIds ?? route.packages)].sort(compare),
      packageNames: route.packages.map(id => packagesById.get(id)?.packageName).sort(compare)
    })).sort((left, right) => compare(left.id, right.id))
  };
  const hash = `sha256:${createHash('sha256').update(JSON.stringify(facts), 'utf8').digest('hex')}`;
  if (hash !== adoption.adoptionReviewHash) {
    throw new Error('framework adoption review hash does not match Supported package identities and stable route closures');
  }
}
