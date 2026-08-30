import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assertEvidenceChainAuthorities, assertEvidenceChains } from './lib/evidence-chain-model.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));

const [authorities, evidenceChains, adoption, journalSource, publication, irisEngineering] = await Promise.all([
  readJson('config/evidence-chain-authorities.json'),
  readJson('data/evidence-chains.json'),
  readJson('data/framework-adoption.json'),
  readJson('data/journal-source.json'),
  readJson('config/blog-publication.json'),
  readJson('data/iris-engineering.json')
]);

assertEvidenceChainAuthorities(authorities, irisEngineering);
assertEvidenceChains(evidenceChains, adoption, journalSource, publication, irisEngineering, authorities);
console.log('Evidence chain authority contract passed: four public segments and stable IDs are reviewed.');
