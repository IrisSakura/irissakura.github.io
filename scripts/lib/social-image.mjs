import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { deflateSync } from 'node:zlib';

const WIDTH = 1200;
const HEIGHT = 630;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const BRAND_MODES = new Set(['master', 'iris', 'sakura', 'journal', 'game']);
const PALETTES = {
  home: ['101722', '1d3557', '2575fc', '6a11cb', 'ff4081', '8ce7dc'],
  portfolio: ['17131f', '493548', 'a56b46', 'd99a72', 'f2d4b5', '7e9da8'],
  framework: ['0b1820', '123b4a', '1f6f78', '49a6a5', '99d8cf', 'd6f2eb'],
  research: ['1d1420', '4a263d', '8b3e62', 'c96f8b', 'efb7c8', 'b6d6d7'],
  article: ['15121d', '382252', '7046a6', 'aa7bd6', 'd8b9ef', '79c7ca'],
  game: ['1b1016', '4d1d2c', '982f45', 'd6656f', 'f3b0a7', 'f2d36d'],
  contact: ['1c1510', '54321f', '9a5a2f', 'd99657', 'f0c992', '7fc4be'],
  site: ['121722', '253047', '47658b', '719eb9', 'd7e8eb', 'c9788d']
};

export function createSocialImage(seed, category = 'site', paletteOverride, brandMode = 'master') {
  if (typeof seed !== 'string' || seed.trim() === '') throw new Error('Social image seed is required.');
  if (!BRAND_MODES.has(brandMode)) throw new Error(`Unknown social card brand mode: ${brandMode}.`);
  const paletteSource = paletteOverride ?? PALETTES[category] ?? PALETTES.site;
  if (!Array.isArray(paletteSource) || paletteSource.length !== 6 || paletteSource.some((color) => !/^[0-9a-f]{6}$/i.test(color))) {
    throw new Error('Social image palette must contain exactly six RGB hex colors.');
  }
  const palette = paletteSource.map(hexToRgb);
  const hash = createHash('sha256').update(`${brandMode}:${category}:${seed}`).digest();
  const pixels = Buffer.alloc((WIDTH + 1) * HEIGHT);
  const diagonal = 280 + hash[0];
  const circleX = 780 + hash[1];
  const circleY = 170 + (hash[2] % 180);
  const circleRadius = 120 + (hash[3] % 90);
  const nodeOffset = hash[4] % 120;
  const petals = Array.from({ length: 5 }, (_, index) => {
    const angle = (-Math.PI / 2) + index * (Math.PI * 2 / 5);
    return [circleX + Math.cos(angle) * 128, circleY + Math.sin(angle) * 128];
  });

  for (let y = 0; y < HEIGHT; y += 1) {
    const row = y * (WIDTH + 1);
    pixels[row] = 0;
    for (let x = 0; x < WIDTH; x += 1) {
      let color = 0;
      const distance = (x - circleX) ** 2 + (y - circleY) ** 2;
      if (brandMode === 'master') {
        if (x + y > diagonal && x + y < diagonal + 230) color = 1;
        if ((x + hash[5]) % 96 < 2 || (y + hash[6]) % 96 < 2) color = Math.max(color, 2);
        if (distance < circleRadius ** 2) color = 3;
        if (distance < (circleRadius * 0.62) ** 2) color = 4;
      }
      if (brandMode === 'iris') {
        if ((x + hash[5]) % 72 < 2 || (y + hash[6]) % 72 < 2) color = 1;
        if (x + y > diagonal && x + y < diagonal + 72) color = 2;
      }
      if (brandMode === 'master' || brandMode === 'iris') {
        for (let node = 0; node < 3; node += 1) {
          const nodeX = 150 + node * 210 + nodeOffset;
          const nodeY = 430 - node * 62 + (hash[7 + node] % 38);
          if (x > nodeX && x < nodeX + 158 && y > nodeY && y < nodeY + 72) color = 5;
          if (node < 2 && x >= nodeX + 158 && x <= nodeX + 210 && Math.abs(y - (nodeY + 36)) < 5) color = 4;
        }
      }
      if (brandMode === 'sakura') {
        if (distance < 72 ** 2) color = 4;
        for (const [petalX, petalY] of petals) {
          const petalDistance = (x - petalX) ** 2 + (y - petalY) ** 2;
          if (petalDistance < circleRadius * 0.46 * (circleRadius * 0.46)) color = 3;
        }
        if (Math.abs(x - circleX) < 4 && y > circleY + 68) color = 5;
        if (y > circleY + 210 && Math.abs((x - circleX) - (y - circleY - 210) * 0.7) < 4) color = 2;
      }
      if (brandMode === 'journal') {
        if ((y + hash[6]) % 42 < 2) color = 1;
        if (Math.abs(x - (145 + hash[4] % 40)) < 3) color = 2;
        if (distance < circleRadius ** 2 && distance > (circleRadius - 14) ** 2) color = 4;
        if (Math.abs((x - circleX) - (y - circleY) * 0.78) < 5 && y > circleY) color = 5;
      }
      if (brandMode === 'game') {
        if (x + y > diagonal && x + y < diagonal + 290) color = 1;
        const inFrameX = x > 118 && x < 1082;
        const inFrameY = y > 84 && y < 546;
        if (inFrameX && inFrameY && (x < 130 || x > 1070 || y < 96 || y > 534)) color = 4;
        if (distance < circleRadius ** 2) color = 3;
      }
      pixels[row + x + 1] = color;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8;
  ihdr[9] = 3;
  const paletteBytes = Buffer.from(palette.flat());
  const description = Buffer.from(`Description\0IrisSakura ${brandMode} ${category} ${seed}`, 'utf8');
  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', ihdr),
    pngChunk('PLTE', paletteBytes),
    pngChunk('tEXt', description),
    pngChunk('IDAT', deflateSync(pixels, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

export async function writeSocialImages(root, pages, brand) {
  const directory = path.join(root, 'assets/social');
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  const seen = new Set();
  await Promise.all(pages.map(async (page) => {
    if (!/^\/assets\/social\/[a-z0-9-]+\.png$/.test(page.image ?? '')) {
      throw new Error(`Page ${page.file} must use a generated social image path.`);
    }
    if (seen.has(page.image)) throw new Error(`Generated social image path is not unique: ${page.image}.`);
    seen.add(page.image);
    const palette = brand.modes[page.brandMode].socialPalette;
    await writeFile(path.join(root, page.image.slice(1)), createSocialImage(page.canonical, page.socialCategory, palette, page.brandMode));
  }));
}

function hexToRgb(hex) {
  return [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
