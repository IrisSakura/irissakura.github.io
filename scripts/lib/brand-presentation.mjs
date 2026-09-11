/** Display aliases only: stable IDs, routes, exports and source records stay untouched. */
export function currentProductName(stableId, fallback, projectPresentations = []) {
  return projectPresentations.find(({ projectId }) => projectId === stableId)?.displayName ?? fallback;
}
