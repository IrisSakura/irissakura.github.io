const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function assertProjectFactsCurrent(projectData, framework, journalSource) {
  if (projectData?.schemaVersion !== 2 || !Array.isArray(projectData.projects)) {
    throw new Error('Project facts must use schemaVersion 2 and expose projects.');
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
    if (!Array.isArray(project.milestones) || project.milestones.length === 0) {
      throw new Error(`Project ${project.id} requires completed milestones.`);
    }
    const completed = new Set(project.milestones);
    const repeated = project.next?.find((entry) => completed.has(entry));
    if (repeated) throw new Error(`Project ${project.id} repeats completed work in next: ${repeated}.`);
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
}
