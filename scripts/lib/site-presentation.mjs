const NAVIGATION_IDS = Object.freeze(['home', 'portfolio', 'projects', 'knowledge', 'contact']);
const PROJECT_IDS = Object.freeze(['iris-engineering', 'sakura-framework', 'sakura-design-journal', 'iris-shelf']);

export function assertSitePresentationConfig(config, brand) {
  if (!config || config.schemaVersion !== 1) throw new Error('site-presentation violation: expected schemaVersion 1');
  if (JSON.stringify(config.navigation?.map(({ id }) => id)) !== JSON.stringify(NAVIGATION_IDS)) {
    throw new Error('site-presentation violation: navigation must expose the reviewed five-item order');
  }
  if (JSON.stringify(config.projects?.map(({ projectId }) => projectId)) !== JSON.stringify(PROJECT_IDS)) {
    throw new Error('site-presentation violation: projects must expose the reviewed four-project order');
  }
  assertUnique(config.navigation.map(({ route }) => route), 'navigation routes');
  assertUnique(config.projects.map(({ route }) => route), 'project routes');
  for (const item of config.navigation) {
    assertText(item.label, `navigation ${item.id} label`);
    assertRoute(item.route, `navigation ${item.id} route`);
    if (!Array.isArray(item.matches) || item.matches.length === 0) throw new Error(`site-presentation violation: navigation ${item.id} needs matches`);
  }
  for (const [index, project] of config.projects.entries()) {
    if (project.order !== index + 1) throw new Error(`site-presentation violation: project ${project.projectId} order drift`);
    if (!brand.families?.[project.brandFamily]) throw new Error(`site-presentation violation: project ${project.projectId} has unknown brand family`);
    if (!brand.assets?.[project.logoAssetKey] || !brand.assets?.[project.heroAssetKey]) throw new Error(`site-presentation violation: project ${project.projectId} has missing assets`);
    if (!NAVIGATION_IDS.includes(project.navigationGroup)) throw new Error(`site-presentation violation: project ${project.projectId} has invalid navigation group`);
    for (const key of ['displayName', 'subtitle', 'summary', 'heroClass']) assertText(project[key], `project ${project.projectId} ${key}`);
    assertRoute(project.route, `project ${project.projectId} route`);
    assertAction(project.primaryAction, project.projectId, 'primary');
    assertAction(project.secondaryAction, project.projectId, 'secondary');
  }
  if (JSON.stringify(config.home?.sectionOrder) !== JSON.stringify(['profile', 'featured-work', 'projects', 'knowledge', 'contact'])) {
    throw new Error('site-presentation violation: home section order drift');
  }
  if (!Array.isArray(config.home.featuredKnowledgeIds) || config.home.featuredKnowledgeIds.length !== 3) {
    throw new Error('site-presentation violation: home needs three featured knowledge entries');
  }
  return config;
}

export function resolveNavigationId(config, pageFile) {
  const matches = config.navigation.filter((item) => item.matches.some((pattern) => matchPath(pageFile, pattern)));
  if (matches.length > 1) throw new Error(`site-presentation violation: ${pageFile} matches multiple navigation groups`);
  return matches[0]?.id ?? '';
}

export function resolveProjectPresentations(config, brand, registry) {
  return config.projects.map((project) => {
    const source = registry.projects.find(({ id }) => id === project.projectId);
    if (!source) throw new Error(`site-presentation violation: missing public project ${project.projectId}`);
    return Object.freeze({
      ...project,
      logo: brand.assets[project.logoAssetKey],
      hero: brand.assets[project.heroAssetKey],
      source
    });
  });
}

export function resolveFeaturedKnowledge(config, searchIndex) {
  return config.home.featuredKnowledgeIds.map((id) => {
    const entry = searchIndex.entries.find((candidate) => candidate.id === id);
    if (!entry) throw new Error(`site-presentation violation: missing featured knowledge ${id}`);
    return entry;
  });
}

export function resolveFooterGroups(config, projects) {
  const navigationById = new Map(config.navigation.map((item) => [item.id, item]));
  const projectById = new Map(projects.map((item) => [item.projectId, item]));
  return config.footer.map((group) => ({
    label: group.label,
    links: group.navigationIds?.map((id) => ({ label: navigationById.get(id)?.label, route: navigationById.get(id)?.route }))
      ?? group.projectIds?.map((id) => ({ label: projectById.get(id)?.displayName, route: projectById.get(id)?.route }))
      ?? group.links
  }));
}

function matchPath(file, pattern) {
  return pattern.endsWith('/**') ? file.startsWith(pattern.slice(0, -2)) : file === pattern;
}
function assertText(value, label) { if (typeof value !== 'string' || value.trim() === '') throw new Error(`site-presentation violation: ${label} is required`); }
function assertRoute(value, label) { if (typeof value !== 'string' || !/^\/(?:$|[a-z0-9./#-]+)$/u.test(value) || value.includes('..')) throw new Error(`site-presentation violation: invalid ${label}`); }
function assertUnique(values, label) { if (new Set(values).size !== values.length) throw new Error(`site-presentation violation: duplicate ${label}`); }
function assertAction(action, projectId, kind) { assertText(action?.label, `project ${projectId} ${kind} action label`); assertRoute(action?.href, `project ${projectId} ${kind} action route`); }

export { NAVIGATION_IDS, PROJECT_IDS };
