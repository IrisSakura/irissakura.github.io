import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

export const BRAND_MODE_IDS = Object.freeze(['master', 'iris', 'sakura', 'journal', 'game']);

export function assertBrandContract(brand) {
  if (!brand || brand.schemaVersion !== 1 || brand.id !== 'iris-sakura') {
    throw new Error('brand-contract violation: expected iris-sakura schemaVersion 1');
  }
  if (brand.masterBrand !== 'IrisSakura' || brand.jointLockup !== 'IRIS × SAKURA') {
    throw new Error('brand-contract violation: master identity drift');
  }
  const familyIds = Object.keys(brand.families ?? {});
  if (JSON.stringify(familyIds) !== JSON.stringify(['master', 'iris', 'sakura', 'journal', 'consumer', 'games'])) {
    throw new Error('brand-contract violation: product family registry drift');
  }
  if (JSON.stringify(Object.keys(brand.modes ?? {})) !== JSON.stringify(BRAND_MODE_IDS)) {
    throw new Error('brand-contract violation: page mode registry drift');
  }
  for (const id of BRAND_MODE_IDS) {
    const mode = brand.modes[id];
    if (mode.id !== id || !brand.families[mode.family]) {
      throw new Error(`brand-contract violation: invalid ${id} mode family`);
    }
    if (!/^#[0-9a-f]{6}$/i.test(mode.themeColor ?? '')) {
      throw new Error(`brand-contract violation: invalid ${id} theme color`);
    }
    if (!Array.isArray(mode.socialPalette) || mode.socialPalette.length !== 6 || mode.socialPalette.some((color) => !/^[0-9a-f]{6}$/i.test(color))) {
      throw new Error(`brand-contract violation: invalid ${id} social palette`);
    }
    for (const dimension of ['color', 'geometry', 'pattern', 'icon', 'density', 'motion']) {
      if (typeof mode.experience?.[dimension] !== 'string' || mode.experience[dimension].trim() === '') {
        throw new Error(`brand-contract violation: ${id} missing ${dimension}`);
      }
    }
  }
  const requiredPages = ['home', 'portfolio', 'engineering', 'framework', 'journal', 'brand', 'game', 'contact', 'system'];
  if (JSON.stringify(Object.keys(brand.pageModes ?? {})) !== JSON.stringify(requiredPages)) {
    throw new Error('brand-contract violation: page mode keys drift');
  }
  for (const [page, mode] of Object.entries(brand.pageModes)) {
    if (!BRAND_MODE_IDS.includes(mode)) throw new Error(`brand-contract violation: ${page} uses unknown mode ${mode}`);
  }
  const deprecated = brand.deprecated?.map(({ name, replacement }) => `${name}->${replacement}`);
  if (JSON.stringify(deprecated) !== JSON.stringify(['Sakura Design Journal->IrisSakura Journal'])) {
    throw new Error('brand-contract violation: deprecated naming registry drift');
  }
  return brand;
}

export function resolvePageBrandMode(brand, pageKey) {
  const mode = brand.pageModes?.[pageKey];
  if (!BRAND_MODE_IDS.includes(mode)) {
    throw new Error(`brand-contract violation: page ${pageKey} has no reviewed brand mode`);
  }
  return mode;
}

export async function assertBrandAssets(root, brand) {
  const required = [
    'favicon', 'symbol', 'masterLogo', 'irisLogo', 'sakuraLogo', 'jointLockup',
    'masterWordmark', 'irisWordmark', 'sakuraWordmark', 'iconSprite', 'readmeHeader',
    'socialLogo', 'brandBoard'
  ];
  for (const key of required) {
    const relativePath = brand.assets?.[key];
    if (!/^assets\/[a-z0-9/._-]+\.(?:png|svg)$/.test(relativePath ?? '') || relativePath.includes('..')) {
      throw new Error(`brand-contract violation: invalid ${key} asset path`);
    }
    const absolutePath = path.join(root, relativePath);
    await access(absolutePath);
    if (!relativePath.endsWith('.svg')) continue;
    const svg = await readFile(absolutePath, 'utf8');
    if (!/<svg\b/.test(svg) || !/<title(?:\s|>)/.test(svg) || !/<desc(?:\s|>)/.test(svg) || !/viewBox=/.test(svg)) {
      throw new Error(`brand-contract violation: incomplete SVG metadata in ${relativePath}`);
    }
    if (/https?:\/\//.test(svg.replace('http://www.w3.org/2000/svg', ''))) {
      throw new Error(`brand-contract violation: remote dependency in ${relativePath}`);
    }
  }
}

export function assertPublicBrandNaming(brand, sources) {
  const violations = [];
  const terms = [
    ...(brand.naming?.forbidden ?? []),
    ...(brand.deprecated ?? []).map((entry) => entry.name)
  ];
  for (const source of sources) {
    for (const term of terms) {
      if (source.content.includes(term)) violations.push(`${source.file}: ${term}`);
    }
  }
  if (violations.length > 0) {
    throw new Error(`brand-contract violation: public naming drift\n${violations.join('\n')}`);
  }
}
