const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ANCHOR_PATTERN = /^system-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PUBLIC_STATUSES = new Set(['approved', 'published']);

export function assertEvidenceChains(data, adoption, journalSource, publication) {
  if (data?.schemaVersion !== 1 || !Array.isArray(data.chains) || data.chains.length === 0) {
    throw new Error('Evidence chains must use schemaVersion 1 and expose a non-empty chains array.');
  }

  const adoptionBySystem = new Map(adoption.gameAdoption.map((entry) => [entry.gameSystem, entry]));
  const designsById = new Map(journalSource.gameDesigns.map((entry) => [entry.id, entry]));
  const blogsById = new Map(journalSource.blogs.map((entry) => [entry.id, entry]));
  const publicationById = new Map(publication.articles.map((entry) => [entry.sourceId, entry]));
  const chainIds = new Set();
  const anchors = new Set();

  for (const chain of data.chains) {
    if (!ID_PATTERN.test(chain.id ?? '') || chainIds.has(chain.id)) {
      throw new Error(`Evidence chain id must be unique and semantic: ${chain.id ?? '(missing)'}.`);
    }
    chainIds.add(chain.id);
    if (!ANCHOR_PATTERN.test(chain.gameAnchor ?? '') || anchors.has(chain.gameAnchor)) {
      throw new Error(`Evidence chain game anchor must be unique and semantic: ${chain.gameAnchor ?? '(missing)'}.`);
    }
    anchors.add(chain.gameAnchor);
    for (const field of ['title', 'question', 'limitation']) {
      if (typeof chain[field] !== 'string' || chain[field].trim().length < 12) {
        throw new Error(`Evidence chain ${chain.id} requires a substantive ${field}.`);
      }
    }

    const adoptionEntry = adoptionBySystem.get(chain.gameSystem);
    if (!adoptionEntry) throw new Error(`Evidence chain ${chain.id} references an unknown game adoption system.`);
    if (JSON.stringify(chain.frameworkPackages) !== JSON.stringify(adoptionEntry.frameworkPackages)) {
      throw new Error(`Evidence chain ${chain.id} package list does not match the reviewed adoption mapping.`);
    }
    if (!Array.isArray(chain.research) || chain.research.length === 0) {
      throw new Error(`Evidence chain ${chain.id} requires at least one public research reference.`);
    }

    const references = new Set();
    for (const reference of chain.research) {
      const referenceKey = `${reference.type}:${reference.id}`;
      if (references.has(referenceKey)) throw new Error(`Evidence chain ${chain.id} repeats ${referenceKey}.`);
      references.add(referenceKey);
      if (typeof reference.relation !== 'string' || reference.relation.trim().length < 12) {
        throw new Error(`Evidence chain ${chain.id} reference ${referenceKey} requires a relation.`);
      }
      if (reference.type === 'design') {
        if (!designsById.has(reference.id)) throw new Error(`Evidence chain ${chain.id} references an unknown design ${reference.id}.`);
        continue;
      }
      if (reference.type === 'article') {
        const article = publicationById.get(reference.id);
        if (!blogsById.has(reference.id) || !article || !PUBLIC_STATUSES.has(article.status)) {
          throw new Error(`Evidence chain ${chain.id} reference ${reference.id} is not a published article.`);
        }
        continue;
      }
      throw new Error(`Evidence chain ${chain.id} uses unsupported research type ${reference.type}.`);
    }
  }
}

export function resolveEvidenceChains(data, adoption, journalSource, publication) {
  assertEvidenceChains(data, adoption, journalSource, publication);
  const adoptionBySystem = new Map(adoption.gameAdoption.map((entry) => [entry.gameSystem, entry]));
  const designsById = new Map(journalSource.gameDesigns.map((entry) => [entry.id, entry]));
  const blogsById = new Map(journalSource.blogs.map((entry) => [entry.id, entry]));
  const publicationById = new Map(publication.articles.map((entry) => [entry.sourceId, entry]));

  return data.chains.map((chain) => ({
    ...chain,
    adoptionEvidence: adoptionBySystem.get(chain.gameSystem).evidence,
    research: chain.research.map((reference) => {
      if (reference.type === 'design') {
        const design = designsById.get(reference.id);
        return { ...reference, title: design.title, href: `journal.html#design-${design.id}` };
      }
      const article = blogsById.get(reference.id);
      const publicEntry = publicationById.get(reference.id);
      return { ...reference, title: article.title, href: `blog/${publicEntry.slug}.html` };
    })
  }));
}
