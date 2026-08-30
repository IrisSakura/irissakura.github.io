import { createHash } from 'node:crypto';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REVIEW_HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const SYNC_MODES = new Set(['source-push', 'fixed-snapshot', 'versioned-review', 'site-curated']);

export function assertProjectFactsCurrent(projectData, framework, journal) {
  if (projectData?.schemaVersion !== 3 || !Array.isArray(projectData.projects)) {
    throw new Error('Project facts must use schemaVersion 3 and expose projects.');
  }
  const projectsById = new Map(projectData.projects.map((project) => [project.id, project]));
  if (projectsById.size !== projectData.projects.length) throw new Error('Project facts contain duplicate ids.');

  for (const project of projectData.projects) {
    if (!DATE_PATTERN.test(project.updatedAt ?? '') || !DATE_PATTERN.test(project.lastReviewedAt ?? '')) {
      throw new Error(`Project ${project.id} requires valid update and review dates.`);
    }
    if (project.lastReviewedAt < project.updatedAt) {
      throw new Error(`Project ${project.id} cannot be reviewed before its latest factual update.`);
    }
    if (!SYNC_MODES.has(project.syncMode) || typeof project.syncLabel !== 'string' || project.syncLabel.trim().length === 0) {
      throw new Error(`Project ${project.id} requires a reviewed public sync mode and label.`);
    }
    if (!Array.isArray(project.milestones) || project.milestones.length === 0) {
      throw new Error(`Project ${project.id} requires completed milestones.`);
    }
    const completed = new Set(project.milestones);
    const repeated = project.next?.find((entry) => completed.has(entry));
    if (repeated) throw new Error(`Project ${project.id} repeats completed work in next: ${repeated}.`);
    if (project.proof !== undefined) {
      if (!Array.isArray(project.proof) || project.proof.length !== 3
        || project.proof.some((item) => typeof item?.value !== 'string' || typeof item?.label !== 'string')
        || typeof project.proofFooter !== 'string' || typeof project.visualLabel !== 'string') {
        throw new Error(`Project ${project.id} requires a closed three-item proof visual contract.`);
      }
    }
  }

  if (projectsById.get('sword-of-words')?.categoryLabel !== '独立游戏项目') {
    throw new Error('The playable prototype must be categorized as an independent game project.');
  }
  const game = projectsById.get('sword-of-words');
  if (
    !/^assets\/images\/[a-z0-9._/-]+\.(?:png|webp)$/i.test(game?.homeImage ?? '')
    || !/^assets\/images\/[a-z0-9._/-]+\.(?:png|webp)$/i.test(game?.featureImage ?? '')
    || game.homeImage === game.featureImage
    || typeof game.featureImageAlt !== 'string'
    || game.featureImageAlt.trim().length < 12
  ) {
    throw new Error('The playable prototype requires distinct home and flagship visual evidence.');
  }

  const latestProjectDate = projectData.projects.map((project) => project.updatedAt).sort().at(-1);
  if (projectData.updatedAt !== latestProjectDate) {
    throw new Error('Project registry updatedAt must equal its latest project fact date.');
  }

  const frameworkProject = projectsById.get('sakura-framework');
  if (!REVIEW_HASH_PATTERN.test(frameworkProject?.reviewedFrameworkAdoptionHash ?? '')) {
    throw new Error('Sakura Framework project facts require reviewedFrameworkAdoptionHash.');
  }
  if (frameworkProject.reviewedFrameworkAdoptionHash !== framework?.adoptionReviewHash) {
    throw new Error('Framework adoption contract changed; review Sakura Framework project facts.');
  }

  const journalProject = projectsById.get('sakura-design-journal');
  if (!REVIEW_HASH_PATTERN.test(journalProject?.reviewedJournalCurationHash ?? '')) {
    throw new Error('IrisSakura Journal project facts require reviewedJournalCurationHash.');
  }
  if (journalProject.reviewedJournalCurationHash !== journalCurationReviewHash(journal)) {
    throw new Error('Journal curation contract changed; review IrisSakura Journal project facts.');
  }
}

export function journalCurationReviewHash(journal) {
  if (!Array.isArray(journal?.streams) || !Array.isArray(journal?.featuredNotes)) {
    throw new Error('Journal curation review requires streams and featuredNotes.');
  }
  const semanticContract = {
    title: journal.title,
    description: journal.summary?.description,
    streams: journal.streams,
    featuredNotes: journal.featuredNotes
  };
  const digest = createHash('sha256')
    .update(JSON.stringify(canonicalize(semanticContract)))
    .digest('hex');
  return `sha256:${digest}`;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalize(value[key])])
    );
  }
  return value;
}
