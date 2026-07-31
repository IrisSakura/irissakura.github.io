import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('site configuration exposes verified direct contacts and public routes', async () => {
  const site = JSON.parse(await readText('data/site.json'));
  assert.equal(site.positioning, '可验证的 Unity 游戏系统开发者');
  assert.equal(site.tagline, '研究 · 框架 · 游戏验证');
  assert.deepEqual(site.contacts.map((contact) => contact.id), ['work-email', 'work-qq']);
  const workEmail = site.contacts.find((contact) => contact.id === 'work-email');
  const workQq = site.contacts.find((contact) => contact.id === 'work-qq');
  assert.match(workEmail.value, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  assert.equal(workEmail.href, `mailto:${workEmail.value}`);
  assert.match(workQq.value, /^\d{5,12}$/);
  assert.equal(workQq.href, undefined);
  assert.deepEqual(site.socials.map((social) => social.id), ['github', 'bilibili']);
  for (const social of site.socials) assert.match(social.url, /^https:\/\//);

  const contactPage = await readText('pages/contact.html');
  for (const contact of site.contacts) {
    for (const fragment of [contact.label, contact.value, contact.description]) {
      assert.ok(contactPage.includes(fragment), `contact page missing ${fragment}`);
    }
  }
});

test('profile and major page covers are generated from one local configuration', async () => {
  const site = JSON.parse(await readText('data/site.json'));
  const profile = site.profile;
  assert.equal(profile.displayName, 'IrisSakura');
  assert.ok(profile.bio.length > 20);
  assert.ok(profile.focuses.length >= 3);
  assert.match(profile.backgroundPosition, /^\d{1,3}% \d{1,3}%$/);

  const majorPages = {
    home: 'index.html',
    portfolio: 'pages/portfolio.html',
    framework: 'pages/framework.html',
    journal: 'pages/journal.html',
    blog: 'pages/blog.html',
    game: 'pages/game.html',
    about: 'pages/about.html',
    contact: 'pages/contact.html'
  };
  assert.deepEqual(Object.keys(site.pageCovers).sort(), Object.keys(majorPages).sort());

  const localImages = [
    profile.avatar,
    profile.backgroundImage,
    ...Object.values(site.pageCovers).map((cover) => cover.image)
  ].filter(Boolean);
  for (const imagePath of localImages) {
    assert.match(imagePath, /^assets\/images\/.+\.(?:avif|jpe?g|png|webp)$/i);
    await access(new URL(`../${imagePath}`, import.meta.url));
  }

  const home = await readText('index.html');
  for (const fragment of [
    'class="profile-card"',
    'id="profile-title"',
    profile.displayName,
    profile.role,
    profile.backgroundImage
  ]) {
    assert.ok(home.includes(fragment), `home profile missing ${fragment}`);
  }
  if (profile.avatar) {
    assert.ok(home.includes(profile.avatar));
  } else {
    assert.ok(home.includes('class="profile-avatar-fallback"'));
    assert.ok(home.includes(profile.initials));
  }

  for (const [coverKey, pagePath] of Object.entries(majorPages)) {
    const html = await readText(pagePath);
    const prefix = pagePath === 'index.html' ? '' : '../';
    assert.ok(html.includes('page-cover'), `${pagePath} missing shared page-cover class`);
    assert.ok(html.includes(`data-page-cover="${coverKey}"`), `${pagePath} missing ${coverKey} cover key`);
    assert.ok(
      html.includes(`${prefix}${site.pageCovers[coverKey].image}`),
      `${pagePath} missing configured ${coverKey} cover image`
    );
  }
});

test('all public pages use generated metadata and shared accessible shell', async () => {
  const themeConfig = JSON.parse(await readText('data/themes.json'));
  const pages = [
    'index.html',
    '404.html',
    ...(await listHtmlFiles(new URL('../pages/', import.meta.url), 'pages'))
  ];

  for (const page of pages) {
    const html = await readText(page);
    for (const fragment of [
      'site-meta:start',
      'meta name="description"',
      'rel="canonical"',
      'application/ld+json',
      'class="skip-link"',
      'id="main-navigation"',
      'aria-controls="main-navigation"',
      'aria-expanded="false"',
      'theme-styles:start',
      'data-theme-stylesheet',
      'data-themes=',
      'theme-bootstrap:start',
      'class="theme-select"',
      'aria-label="选择页面主题"',
      'option value="system"',
      'dist/site.js'
    ]) {
      assert.ok(html.includes(fragment), `${page} missing ${fragment}`);
    }

    assert.ok(
      html.indexOf('theme-styles:start') < html.indexOf('theme-bootstrap:start'),
      `${page} must load registered theme styles before applying the stored preference`
    );
    assert.ok(
      html.indexOf('theme-bootstrap:start') < html.indexOf('</head>'),
      `${page} must apply the theme before body rendering`
    );
    for (const theme of themeConfig.themes) {
      assert.ok(
        html.includes(`option value="${theme.id}"`),
        `${page} missing registered theme option ${theme.id}`
      );
    }
    for (const stylesheet of new Set(themeConfig.themes.flatMap((theme) => theme.stylesheets))) {
      assert.ok(
        html.includes(stylesheet),
        `${page} missing registered theme stylesheet ${stylesheet}`
      );
    }
  }
});

test('theme selector follows the registry and system until the visitor stores a preference', async () => {
  const [siteSource, generator, navbar, themeConfig] = await Promise.all([
    readText('src/site.ts'),
    readText('scripts/generate-site.mjs'),
    readText('components/navbar.html'),
    readText('data/themes.json').then(JSON.parse)
  ]);

  assert.ok(generator.includes("readJson('data/themes.json')"));
  assert.ok(generator.includes('renderThemeOptions'));
  assert.ok(generator.includes('renderThemeStyles'));
  assert.ok(generator.includes("prefers-color-scheme: dark"));
  assert.ok(siteSource.includes("querySelector<HTMLSelectElement>('.theme-select')"));
  assert.ok(siteSource.includes("window.addEventListener('storage'"));
  assert.ok(siteSource.includes('localStorage.setItem'));
  assert.ok(siteSource.includes('localStorage.removeItem'));
  assert.ok(navbar.includes('{{themeOptions}}'));
  assert.ok(navbar.includes('data-default-light="{{defaultLightTheme}}"'));
  assert.equal(themeConfig.storageKey, 'irissakura-theme');
});

test('theme registry supports shared layers and the sakura village atmosphere', async () => {
  const config = JSON.parse(await readText('data/themes.json'));
  const ids = config.themes.map((theme) => theme.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ids, ['night', 'pastoral', 'sakura-village']);
  assert.equal(
    config.themes.find((theme) => theme.id === config.defaultLight)?.colorScheme,
    'light'
  );
  assert.equal(
    config.themes.find((theme) => theme.id === config.defaultDark)?.colorScheme,
    'dark'
  );

  const registeredStylesheets = new Set(config.themes.flatMap((theme) => theme.stylesheets));
  for (const stylesheet of registeredStylesheets) {
    await readText(stylesheet);
  }

  const sakuraTheme = config.themes.find((theme) => theme.id === 'sakura-village');
  assert.deepEqual(
    sakuraTheme.stylesheets,
    ['style/pastoral.css', 'style/sakura-village.css']
  );
  const sakuraCss = await readText('style/sakura-village.css');
  for (const motif of ['--torii', '--sakura', '.hero-section::before', '.theme-picker']) {
    assert.ok(sakuraCss.includes(motif), `sakura theme missing motif ${motif}`);
  }
});

test('placeholder blog, simulated form and unsupported template claims are absent', async () => {
  const publicFiles = [
    await readText('index.html'),
    await readText('pages/about.html'),
    await readText('pages/blog.html'),
    await readText('pages/contact.html'),
    await readText('src/site.ts')
  ].join('\n');

  for (const forbidden of [
    '完整文章内容',
    'blog-post.html',
    '游戏音乐中的互动音频设计',
    '消息已发送',
    '模拟API调用',
    'itch.io',
    'ArtStation',
    '从像素艺术到3A级体验',
    '音乐创作者 × 视觉设计师',
    'skill-percent'
  ]) {
    assert.ok(!publicFiles.includes(forbidden), `unsupported content remains: ${forbidden}`);
  }
});

async function listHtmlFiles(directory, prefix) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      files.push(...await listHtmlFiles(new URL(`${entry.name}/`, directory), `${prefix}/${entry.name}`));
    } else if (entry.name.endsWith('.html')) {
      files.push(`${prefix}/${entry.name}`);
    }
  }
  return files;
}

test('repository metadata and publishing policy are explicit', async () => {
  const packageJson = JSON.parse(await readText('package.json'));
  const readme = await readText('README.md');
  const workflow = await readText('.github/workflows/site-quality-and-pages.yml');

  assert.equal(packageJson.author, 'IrisSakura');
  assert.equal(packageJson.license, 'ISC');
  assert.equal(packageJson.homepage, 'https://irissakura.github.io/');
  assert.ok(!packageJson.dependencies?.gsap);
  assert.ok(readme.includes('内容真实性原则'));
  assert.ok(readme.includes('dist/'));
  assert.ok(workflow.includes('npm run check'));
  assert.ok(workflow.includes('npm run test:smoke'));
  assert.ok(workflow.includes('actions/deploy-pages@v4'));
});

test('shared text colors meet WCAG AA contrast on dark surfaces', async () => {
  const css = await readText('style/main.css');
  const secondaryText = readCssHexVariable(css, 'secondary-text-color');
  const mutedText = readCssHexVariable(css, 'muted-text-color');
  const grayText = readCssHexVariable(css, 'gray-color');

  for (const background of ['#29173d', '#2d1b41', '#1e1e1e']) {
    assert.ok(
      contrastRatio(secondaryText, background) >= 4.5,
      `${secondaryText} must reach 4.5:1 on ${background}`
    );
  }
  assert.ok(contrastRatio(mutedText, '#040404') >= 4.5);
  assert.ok(contrastRatio(grayText, '#121212') >= 4.5);

  assert.match(css, /\.tag\s*\{[^}]*color:\s*var\(--secondary-text-color\)/s);
  assert.match(css, /\.project-status\s*\{[^}]*color:\s*var\(--secondary-text-color\)/s);
  assert.match(css, /\.footer-description\s*\{[^}]*color:\s*var\(--muted-text-color\)/s);
  assert.match(css, /\.footer-links a\s*\{[^}]*color:\s*var\(--muted-text-color\)/s);
  assert.match(css, /\.footer-bottom\s*\{[^}]*color:\s*var\(--muted-text-color\)/s);
});

test('sakura village text and actions meet WCAG AA contrast', async () => {
  const css = await readText('style/sakura-village.css');
  const paper = readCssHexVariable(css, 'paper');
  const ink = readCssHexVariable(css, 'ink');
  const inkSoft = readCssHexVariable(css, 'ink-soft');
  const petalStrong = readCssHexVariable(css, 'petal-strong');
  const torii = readCssHexVariable(css, 'torii');

  for (const foreground of [ink, inkSoft, petalStrong]) {
    assert.ok(
      contrastRatio(foreground, paper) >= 4.5,
      `${foreground} must reach 4.5:1 on sakura paper ${paper}`
    );
  }
  assert.ok(
    contrastRatio('#fffaf2', torii) >= 4.5,
    `primary button text must reach 4.5:1 on torii ${torii}`
  );
});

function readCssHexVariable(css, name) {
  const value = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
  assert.ok(value, `missing --${name}`);
  return value;
}

function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/.{2}/g).map((channel) => {
      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}
