import { chromium } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { access, mkdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [journalSource, projectData, siteData, sitemap] = await Promise.all([
  readJson('data/journal-source.json'),
  readJson('data/projects.json'),
  readJson('data/site.json'),
  readFile(path.join(root, 'sitemap.xml'), 'utf8')
]);
const indexedRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, location]) => new URL(location).pathname);
if (indexedRoutes.length === 0) throw new Error('sitemap does not expose any indexable routes');
const [representativeBlog] = journalSource.blogs;
if (!representativeBlog) throw new Error('blog registry does not contain a representative complete article');
const gameProject = projectData.projects.find((project) => project.category === 'game');
if (!gameProject) throw new Error('project registry does not contain a game case');
const server = createServer(async (request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
  let filePath = path.resolve(root, `.${requestPath === '/' ? '/index.html' : requestPath}`);
  if (!filePath.startsWith(root + path.sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(filePath)).isDirectory()) filePath = path.join(filePath, 'index.html');
    await access(filePath);
    response.writeHead(200, { 'Content-Type': contentType(filePath) });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    createReadStream(path.join(root, '404.html')).pipe(response);
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('failed to bind static test server');
const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const route of indexedRoutes) {
    const response = await desktop.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`${route} returned ${response?.status()}`);
    if (await desktop.locator('main#main-content').count() !== 1) throw new Error(`${route} lacks one main landmark`);
  }
  if (process.env.SITE_SCREENSHOT_DIR) {
    await mkdir(process.env.SITE_SCREENSHOT_DIR, { recursive: true });
    await desktop.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'home-desktop.png'), fullPage: true });
    await desktop.goto(`${baseUrl}/pages/framework.html`, { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'framework-desktop.png'), fullPage: true });
  }

  await desktop.goto(`${baseUrl}/pages/portfolio.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.portfolio-case').count() !== projectData.projects.length) throw new Error('portfolio does not expose every registered project');
  if (!await desktop.locator('.portfolio-case').first().filter({ hasText: gameProject.title }).isVisible()) throw new Error('registered game project is not the first portfolio case');

  await desktop.goto(`${baseUrl}/pages/blog.html`, { waitUntil: 'networkidle' });
  if (await desktop.locator('.blog-card').count() !== journalSource.blogs.length) throw new Error('blog index does not expose the registered complete articles');
  await desktop.locator(`.blog-card a[href="blog/${encodeURIComponent(representativeBlog.id)}.html"]`).click();
  if (!await desktop.getByRole('heading', { level: 1, name: representativeBlog.title, exact: true }).isVisible()) throw new Error('registered blog title is not visible');
  if (!await desktop.locator('.blog-prose').isVisible()) throw new Error('complete blog body is not visible');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const toggle = mobile.locator('.mobile-toggle');
  if (await toggle.getAttribute('aria-label') !== '打开导航菜单') throw new Error('mobile menu lacks its initial accessible name');
  await toggle.click();
  if (await toggle.getAttribute('aria-expanded') !== 'true') throw new Error('mobile menu did not expose expanded state');
  if (await toggle.getAttribute('aria-label') !== '关闭导航菜单') throw new Error('mobile menu did not update its accessible name');
  await mobile.keyboard.press('Escape');
  if (await toggle.getAttribute('aria-expanded') !== 'false') throw new Error('Escape did not close mobile menu');

  await mobile.goto(`${baseUrl}/pages/contact.html`, { waitUntil: 'networkidle' });
  const expectedContactCards = siteData.contacts.length + siteData.socials.length;
  if (await mobile.locator('.public-route-card').count() !== expectedContactCards) throw new Error('direct contacts or verified public routes are missing');
  for (const contact of siteData.contacts) {
    if (!await mobile.getByText(contact.value, { exact: true }).isVisible()) throw new Error(`direct contact is missing: ${contact.id}`);
    if (contact.href && !await mobile.locator(`.direct-contact-card[href="${contact.href}"]`).isVisible()) throw new Error(`direct contact link is missing: ${contact.id}`);
  }
  for (const social of siteData.socials) {
    if (!await mobile.locator(`.public-route-card[href="${social.url}"]`).isVisible()) throw new Error(`verified public route is missing: ${social.id}`);
  }
  if (!await mobile.getByRole('heading', { name: '适合交流的主题' }).isVisible()) throw new Error('discussion scope is missing');
  if (process.env.SITE_SCREENSHOT_DIR) {
    await mobile.screenshot({ path: path.join(process.env.SITE_SCREENSHOT_DIR, 'contact-mobile.png'), fullPage: true });
  }

  console.log('Browser smoke passed: routes, complete blog publishing, evidence-led portfolio, mobile navigation and contact routes checked.');
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

function contentType(filePath) {
  const extension = path.extname(filePath);
  return {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  }[extension] ?? 'application/octet-stream';
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}
