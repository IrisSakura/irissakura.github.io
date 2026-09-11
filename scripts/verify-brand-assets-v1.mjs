import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hash = (value) => createHash('sha256').update(value).digest('hex');
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const PNG_CRC_TABLE = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
const OUTPUT_NAMES = Object.freeze([
  'b01-overview.png', 'b02-master.png', 'b03-iris.png', 'b04-sakura.png', 'b05-myosotis.png', 'b06-violet.png',
  'c01-iris.png', 'c02-sakura.png', 'c03-myosotis.png', 'c04-violet.png',
  'character-iris.png', 'character-sakura.png', 'character-myosotis.png', 'character-violet.png'
]);
const SVG_NAMES = Object.freeze([
  'logo-myosotis.svg', 'logo-myosotis-small.svg', 'wordmark-myosotis.svg', 'lockup-myosotis-stacked.svg',
  'logo-violet-shelf.svg', 'logo-violet-shelf-small.svg', 'wordmark-violet-shelf.svg', 'lockup-violet-shelf-stacked.svg'
]);
const ALLOWED_SOURCE_PREFIXES = Object.freeze(['01_original_cut_package/', '02_transparent_png/']);

function safeRelative(value, label) {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.length > 0 && !value.includes('\\') && !path.posix.isAbsolute(value), `${label} must be a safe relative path`);
  const segments = value.split('/');
  assert.ok(segments.every((segment) => segment && segment !== '.' && segment !== '..'), `${label} must not traverse directories`);
}

function safeOutput(value) {
  safeRelative(value, 'asset output');
  assert.ok(OUTPUT_NAMES.includes(value), 'asset output is outside the closed output set');
}

function safeSource(value) {
  safeRelative(value, 'asset source');
  assert.ok(ALLOWED_SOURCE_PREFIXES.some((prefix) => value.startsWith(prefix)), 'asset source is outside the approved bundle roots');
}

function resolveInside(root, relative, label) {
  const resolved = path.resolve(root, relative);
  assert.ok(resolved.startsWith(`${root}${path.sep}`), `${label} resolves outside its root`);
  return resolved;
}

function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = PNG_CRC_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function verifyPng(bytes, output) {
  assert.ok(bytes.length >= 33 && bytes.subarray(0, 8).equals(PNG_SIGNATURE), `${output} has an invalid PNG signature`);
  let offset = 8;
  let chunkIndex = 0;
  let width;
  let height;
  let idatCount = 0;
  let ended = false;
  while (offset < bytes.length) {
    assert.ok(offset + 12 <= bytes.length, `${output} has a truncated PNG chunk header`);
    const length = bytes.readUInt32BE(offset);
    const type = bytes.subarray(offset + 4, offset + 8).toString('ascii');
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    assert.ok(dataEnd + 4 <= bytes.length, `${output} has an out-of-bounds PNG chunk`);
    const expectedCrc = bytes.readUInt32BE(dataEnd);
    assert.equal(crc32(bytes.subarray(offset + 4, dataEnd)), expectedCrc, `${output} has an invalid PNG chunk CRC`);
    if (chunkIndex === 0) {
      assert.equal(type, 'IHDR', `${output} must begin with IHDR`);
      assert.equal(length, 13, `${output} IHDR length must be 13`);
      width = bytes.readUInt32BE(dataStart);
      height = bytes.readUInt32BE(dataStart + 4);
      assert.ok(width > 0 && height > 0, `${output} PNG dimensions must be positive`);
    }
    if (type === 'IDAT') idatCount += 1;
    if (type === 'IEND') {
      assert.equal(length, 0, `${output} IEND must be empty`);
      assert.equal(dataEnd + 4, bytes.length, `${output} has trailing bytes after IEND`);
      ended = true;
      break;
    }
    offset = dataEnd + 4;
    chunkIndex += 1;
  }
  assert.ok(ended, `${output} is missing IEND`);
  assert.ok(idatCount > 0, `${output} is missing IDAT`);
  return `${width}x${height}`;
}

function decodeCssEscapes(value) {
  return value.replace(/\\([0-9a-f]{1,6})(?:\s)?/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16))).replace(/\\(.)/gsu, '$1');
}

function verifySafeSvg(svg, output) {
  const decoded = decodeCssEscapes(svg);
  assert.match(decoded, /<svg\b[^>]*\bviewBox\s*=/iu, `${output} needs an SVG viewBox`);
  assert.match(decoded, /<svg\b[^>]*\bxmlns\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/iu, `${output} needs the SVG namespace`);
  assert.match(decoded, /<title\b/iu, `${output} needs an accessible title`);
  assert.match(decoded, /<desc\b/iu, `${output} needs an accessible description`);
  assert.doesNotMatch(decoded, /<!\s*(?:doctype|entity)\b|<\?xml-stylesheet\b/iu, `${output} contains an XML entity or stylesheet`);
  assert.doesNotMatch(decoded, /<\s*(?:script|foreignobject|style)\b|@import\b|\b(?:src|data)\s*=/iu, `${output} contains executable or external CSS content`);
  assert.doesNotMatch(decoded, /\son[a-z][\w:-]*\s*=/iu, `${output} contains an event handler`);
  for (const match of decoded.matchAll(/(?:xlink:)?href\s*=\s*(["'])(.*?)\1/giu)) {
    assert.match(match[2].trim(), /^#[A-Za-z_][\w.-]*$/u, `${output} has a non-local href`);
  }
  for (const match of decoded.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/giu)) {
    assert.match(match[2].trim(), /^#[A-Za-z_][\w.-]*$/u, `${output} has a non-local URL reference`);
  }
}

export async function verifyBrandAssets(root) {
  const manifest = JSON.parse(await readFile(path.join(root, 'config/brand-assets-v1.json'), 'utf8'));
  assert.equal(manifest.schemaVersion, 1, 'manifest schema version must be 1');
  assert.equal(manifest.assets.length, OUTPUT_NAMES.length, 'manifest must declare exactly fourteen PNG outputs');
  const outputs = manifest.assets.map((asset) => asset.output);
  assert.equal(new Set(outputs).size, outputs.length, 'manifest contains duplicate asset output');
  assert.deepEqual([...outputs].sort(), [...OUTPUT_NAMES].sort(), 'manifest output set does not match the closed output set');

  const boards = new Map(manifest.assets.filter((asset) => /^b0[1-6]-/u.test(asset.output)).map((asset) => [asset.output.slice(0, 3).toUpperCase(), asset]));
  for (const id of ['B01', 'B02', 'B03', 'B04', 'B05', 'B06']) {
    assert.match(manifest.boards?.[id] ?? '', /^[a-f0-9]{64}$/u, `${id} board hash is invalid`);
    assert.equal(boards.get(id)?.sha256, manifest.boards[id], `${id} board hash does not match its PNG record`);
  }

  const pngRoot = path.resolve(root, 'assets/images/brand/v1');
  for (const asset of manifest.assets) {
    safeSource(asset.source);
    safeOutput(asset.output);
    assert.match(asset.sha256 ?? '', /^[a-f0-9]{64}$/u, `${asset.output} hash is invalid`);
    assert.match(asset.dimensions ?? '', /^\d+x\d+$/u, `${asset.output} dimensions are invalid`);
    assert.ok(asset.purpose && asset.importedAt, `${asset.output} needs provenance metadata`);
    const bytes = await readFile(resolveInside(pngRoot, asset.output, 'asset output'));
    assert.equal(hash(bytes), asset.sha256, `${asset.output} hash does not match its recorded provenance`);
    assert.equal(verifyPng(bytes, asset.output), asset.dimensions, `${asset.output} dimensions do not match its recorded provenance`);
  }

  const derived = [...(manifest.svgDerivations?.myosotis ?? []), ...(manifest.svgDerivations?.violetShelfVariants ?? [])];
  assert.equal(derived.length, SVG_NAMES.length, 'manifest must declare exactly eight SVG derivations');
  const svgOutputs = derived.map((asset) => asset.output);
  assert.equal(new Set(svgOutputs).size, svgOutputs.length, 'manifest contains duplicate SVG output');
  assert.deepEqual([...svgOutputs].sort(), [...SVG_NAMES].sort(), 'manifest SVG output set is incomplete');
  const svgRoot = path.resolve(root, 'assets/brand');
  for (const asset of derived) {
    safeRelative(asset.output, 'SVG output');
    assert.ok(SVG_NAMES.includes(asset.output), 'SVG output is outside the closed derivation set');
    assert.ok(asset.reference && asset.disclosure, `${asset.output} needs reference and reconstruction disclosure`);
    assert.match(asset.sha256 ?? '', /^[a-f0-9]{64}$/u, `${asset.output} hash is invalid`);
    const svg = await readFile(resolveInside(svgRoot, asset.output, 'SVG output'), 'utf8');
    verifySafeSvg(svg, asset.output);
    assert.equal(hash(svg), asset.sha256, `${asset.output} hash does not match its recorded derivation`);
  }
  await Promise.all(SVG_NAMES.map((name) => access(resolveInside(svgRoot, name, 'SVG output'))));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await verifyBrandAssets(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
  console.log('Brand v1 asset manifest verified.');
}
