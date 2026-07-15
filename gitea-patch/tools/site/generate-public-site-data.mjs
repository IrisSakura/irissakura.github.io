import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const FEATURED_MODULE_IDS = new Set(['core', 'event', 'asset', 'gas', 'ai', 'ui']);

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || !value) throw new Error(`Invalid argument near ${key ?? '<end>'}`);
    result[key.slice(2)] = value;
  }
  return result;
}

function nonNegativeInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  return value;
}

export function buildPublicSnapshot(input, sourceCommit, generatedAt = new Date().toISOString()) {
  if (!input || typeof input !== 'object') throw new Error('Inventory root must be an object');
  if (input.schemaVersion !== 1) throw new Error('Unsupported or missing schemaVersion');
  if (!input.summary || typeof input.summary !== 'object') throw new Error('Missing summary');
  if (!Array.isArray(input.layers)) throw new Error('Missing layers');
  if (!Array.isArray(input.modules)) throw new Error('Missing modules');
  if (!/^[0-9a-f]{7,40}$/i.test(sourceCommit)) throw new Error('Invalid source commit');

  const summary = {
    packageCount: nonNegativeInteger(input.summary.packageCount, 'summary.packageCount'),
    catalogModuleCount: nonNegativeInteger(input.summary.catalogModuleCount, 'summary.catalogModuleCount'),
    presetCount: nonNegativeInteger(input.summary.presetCount, 'summary.presetCount'),
    profileCount: nonNegativeInteger(input.summary.profileCount, 'summary.profileCount'),
    asmdefCount: nonNegativeInteger(input.summary.asmdefCount, 'summary.asmdefCount')
  };

  const lifecycleCounts = {};
  for (const [name, count] of Object.entries(input.summary.lifecycleCounts ?? {}).sort(([a], [b]) => a.localeCompare(b))) {
    lifecycleCounts[name] = nonNegativeInteger(count, `lifecycleCounts.${name}`);
  }

  const layers = input.layers.map(layer => ({
    id: String(layer.id),
    description: String(layer.description),
    packageCount: nonNegativeInteger(layer.packageCount, `layers.${layer.id}.packageCount`)
  })).sort((a, b) => a.id.localeCompare(b.id));

  const featuredModules = input.modules
    .filter(module => FEATURED_MODULE_IDS.has(module.id))
    .map(module => ({
      id: String(module.id),
      displayName: String(module.displayName),
      description: String(module.description ?? `${module.displayName} framework module.`)
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    schemaVersion: 1,
    sourceCommit: sourceCommit.toLowerCase(),
    generatedAt,
    summary,
    lifecycleCounts,
    layers,
    featuredModules
  };
}

export async function generateFile({ inputPath, outputPath, sourceCommit }) {
  const input = JSON.parse(await readFile(resolve(inputPath), 'utf8'));
  const output = buildPublicSnapshot(input, sourceCommit);
  const destination = resolve(outputPath);
  const temporary = `${destination}.tmp`;
  await mkdir(dirname(destination), { recursive: true });
  try {
    await writeFile(temporary, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
    await rename(temporary, destination);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const args = parseArgs(process.argv.slice(2));
    await generateFile({
      inputPath: args.input,
      outputPath: args.output,
      sourceCommit: args['source-commit']
    });
  } catch (error) {
    console.error(`[framework-site-export] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
