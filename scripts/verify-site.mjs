import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = [
  'index.html',
  '404.html',
  ...(await listHtmlFiles(path.join(root, 'pages'), 'pages'))
].sort();
const errors = [];
const forbiddenClaims = [
  '完整文章内容',
  'blog-post.html',
  'contact@gamedevportfolio.com',
  '从像素艺术到3A级体验',
  '音乐创作者 × 视觉设计师',
  'href="#"'
];

for (const relativeFile of htmlFiles) {
  const html = await readFile(path.join(root, relativeFile), 'utf8');
  checkCount(relativeFile, html, /<title>[^<]+<\/title>/g, 1, 'title');
  checkCount(relativeFile, html, /<meta name="description"[^>]+>/g, 1, 'meta description');
  checkCount(relativeFile, html, /<link rel="canonical"[^>]+>/g, 1, 'canonical');
  checkCount(relativeFile, html, /<main\b[^>]*id="main-content"[^>]*>/g, 1, 'main landmark');
  checkCount(relativeFile, html, /<nav class="navbar"/g, 1, 'navigation');
  checkCount(relativeFile, html, /<footer class="footer"/g, 1, 'footer');

  for (const claim of forbiddenClaims) {
    if (html.includes(claim)) errors.push(`${relativeFile}: forbidden placeholder or unsupported claim: ${claim}`);
  }
  if (!html.includes('class="skip-link"')) errors.push(`${relativeFile}: missing skip link`);
  if (!html.includes('aria-controls="main-navigation"')) errors.push(`${relativeFile}: mobile navigation lacks aria-controls`);
  if (!html.includes('aria-expanded="false"')) errors.push(`${relativeFile}: mobile navigation lacks initial aria-expanded`);

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (
      reference.startsWith('#') ||
      reference.startsWith('http://') ||
      reference.startsWith('https://') ||
      reference.startsWith('mailto:') ||
      reference.startsWith('tel:') ||
      reference.startsWith('data:')
    ) continue;

    const cleanReference = reference.split(/[?#]/, 1)[0];
    if (!cleanReference) continue;
    const resolved = path.resolve(path.dirname(path.join(root, relativeFile)), cleanReference);
    if (!resolved.startsWith(root + path.sep) && resolved !== root) {
      errors.push(`${relativeFile}: reference escapes site root: ${reference}`);
      continue;
    }
    try {
      await access(resolved);
    } catch {
      errors.push(`${relativeFile}: missing local reference: ${reference}`);
    }
  }
}

for (const required of ['robots.txt', 'sitemap.xml', 'site.webmanifest', 'assets/favicon.svg', 'assets/images/home-preview.png', 'data/site.json', 'data/projects.json', 'data/framework-adoption.json']) {
  try {
    await access(path.join(root, required));
  } catch {
    errors.push(`missing required site file: ${required}`);
  }
}

const sourceFiles = (await readdir(path.join(root, 'src'))).filter((file) => file.endsWith('.ts'));
for (const file of sourceFiles) {
  const source = await readFile(path.join(root, 'src', file), 'utf8');
  if (source.includes('console.log')) errors.push(`src/${file}: production console.log is not allowed`);
}

if (errors.length > 0) {
  console.error(`Site verification failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Site verification passed: ${htmlFiles.length} HTML pages and local references checked.`);
}

function checkCount(file, html, pattern, expected, label) {
  const count = html.match(pattern)?.length ?? 0;
  if (count !== expected) errors.push(`${file}: expected ${expected} ${label}, found ${count}`);
}

async function listHtmlFiles(directory, prefix) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      files.push(...await listHtmlFiles(path.join(directory, entry.name), `${prefix}/${entry.name}`));
    } else if (entry.name.endsWith('.html')) {
      files.push(`${prefix}/${entry.name}`);
    }
  }
  return files;
}
