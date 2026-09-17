export const MOD_SERIES_ROLES = Object.freeze(['featured-mod', 'shared-foundation']);

export function assertModSeriesConfig(config, brand, projects) {
  if (!config || config.schemaVersion !== 1) throw new Error('mod-series violation: expected schemaVersion 1');
  if (config.series?.id !== 'freesia-mods') throw new Error('mod-series violation: unknown series id');
  if (config.series?.displayName !== 'Freesia Mods') throw new Error('mod-series violation: display name drift');
  if (config.series?.brandFamily !== 'freesia' || !brand.families?.freesia) throw new Error('mod-series violation: unknown brand family');
  if (config.series?.route !== '/pages/mods.html') throw new Error('mod-series violation: route drift');
  if (typeof config.series?.tagline !== 'string' || config.series.tagline.trim() === '') throw new Error('mod-series violation: tagline is required');
  if (!Array.isArray(config.entries) || config.entries.length === 0) throw new Error('mod-series violation: entries must not be empty');
  const projectIds = new Set();
  const orders = new Set();
  for (const entry of config.entries) {
    if (!MOD_SERIES_ROLES.includes(entry.role)) throw new Error(`mod-series violation: unknown role ${entry.role}`);
    if (projectIds.has(entry.projectId)) throw new Error(`mod-series violation: duplicate project ${entry.projectId}`);
    if (!Number.isInteger(entry.order) || entry.order < 1 || orders.has(entry.order)) throw new Error(`mod-series violation: invalid or duplicate order ${entry.order}`);
    if (typeof entry.hostGame !== 'string' || entry.hostGame.trim() === '') throw new Error(`mod-series violation: ${entry.projectId} needs a host game`);
    if (!projects.projects.some(({ id }) => id === entry.projectId)) throw new Error(`mod-series violation: missing public project ${entry.projectId}`);
    projectIds.add(entry.projectId);
    orders.add(entry.order);
  }
  return config;
}

export function resolveModSeries(config, projects) {
  const entries = [...config.entries].sort((a, b) => a.order - b.order).map((entry) => Object.freeze({
    ...entry,
    source: projects.projects.find(({ id }) => id === entry.projectId)
  }));
  const grouped = new Map();
  for (const entry of entries) {
    if (!grouped.has(entry.hostGame)) grouped.set(entry.hostGame, []);
    grouped.get(entry.hostGame).push(entry);
  }
  const groups = [...grouped.entries()].map(([hostGame, members]) => ({
    hostGame,
    mods: members.filter(({ role }) => role === 'featured-mod'),
    foundations: members.filter(({ role }) => role === 'shared-foundation')
  }));
  return Object.freeze({ ...config.series, entries, groups });
}
