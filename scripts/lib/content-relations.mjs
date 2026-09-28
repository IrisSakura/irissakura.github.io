const TYPES = new Set(['belongs-to', 'explains', 'researches', 'implements', 'uses', 'validates', 'extends', 'related']);

export function buildContentGraph(index, source, presentations, evidenceChains) {
  if (source?.schemaVersion !== 1 || !Array.isArray(source.relations)) throw new Error('Invalid content relations');
  const nodes = index.documents.map(({ id, type, title, url }) => ({ id, type, title, url }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const relations = [];
  const seen = new Set();
  const add = (from, to, type, origin) => {
    if (!byId.has(from) || !byId.has(to) || from === to || !TYPES.has(type)) throw new Error(`Invalid relation ${from} -> ${to}`);
    const key = [from, to, type].join('|');
    if (seen.has(key)) throw new Error(`Duplicate relation ${key}`);
    seen.add(key);
    relations.push({ from, to, type, origin });
  };
  const addDerived = (from, to, type, origin) => {
    if (!byId.has(from) || !byId.has(to) || seen.has([from, to, type].join('|'))) return;
    add(from, to, type, origin);
  };
  for (const relation of source.relations) add(relation.from, relation.to, relation.type, 'explicit');
  for (const presentation of presentations) {
    for (const target of presentation.relationships ?? []) {
      const from = `project:${presentation.projectId}`;
      const to = `project:${target}`;
      addDerived(from, to, 'related', 'presentation');
    }
  }
  const articles = index.documents.filter((doc) => doc.type === 'article');
  for (let i = 0; i < articles.length; i++) for (let j = i + 1; j < articles.length; j++) {
    const left = articles[i], right = articles[j];
    if (left.series && left.series === right.series || left.tags.some((tag) => right.tags.includes(tag))) {
      addDerived(left.id, right.id, 'related', 'publication');
    }
  }
  for (const chain of evidenceChains.chains) {
    const researchIds = chain.research.map((entry) => `${entry.type === 'design' ? 'game-design' : 'article'}:${entry.id}`);
    for (let i = 0; i < researchIds.length; i++) {
      addDerived(researchIds[i], 'project:sword-of-words', 'related', 'evidence-chain');
      for (let j = i + 1; j < researchIds.length; j++) addDerived(researchIds[i], researchIds[j], 'related', 'evidence-chain');
      for (const packageName of chain.frameworkPackages) {
        addDerived(researchIds[i], `framework:${packageName.toLowerCase()}`, 'related', 'evidence-chain');
      }
    }
    for (const packageName of chain.frameworkPackages) {
      addDerived('project:sword-of-words', `framework:${packageName.toLowerCase()}`, 'uses', 'evidence-chain');
    }
  }
  relations.sort((a, b) => a.from.localeCompare(b.from, 'en') || a.to.localeCompare(b.to, 'en') || a.type.localeCompare(b.type, 'en'));
  return { schemaVersion: 1, nodes, relations };
}

export function relatedForPage(graph, canonical) {
  const primary = graph.nodes.filter((node) => node.url === canonical);
  const ids = new Set(primary.map((node) => node.id));
  const seenUrls = new Set([canonical]);
  const matches = [];
  for (const edge of graph.relations) {
    const targetId = ids.has(edge.from) ? edge.to : ids.has(edge.to) ? edge.from : null;
    if (!targetId) continue;
    const target = graph.nodes.find((node) => node.id === targetId);
    if (!target || seenUrls.has(target.url)) continue;
    seenUrls.add(target.url);
    matches.push({ ...target, relation: edge.type });
  }
  return matches.sort((a, b) => a.type.localeCompare(b.type, 'en') || a.title.localeCompare(b.title, 'zh-CN')).slice(0, 6);
}
