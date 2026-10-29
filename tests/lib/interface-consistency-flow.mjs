import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const routes = [
  ['home', '/'], ['portfolio', '/pages/portfolio.html'], ['blog', '/pages/blog.html'],
  ['development', '/pages/development.html'], ['engineering', '/pages/engineering.html'],
  ['framework', '/pages/framework.html'], ['journal', '/pages/journal.html'],
  ['tools', '/pages/tools.html'], ['mods', '/pages/mods.html'], ['wisteria', '/pages/wisteria.html'],
  ['contact', '/pages/contact.html'], ['now', '/pages/now.html'], ['subscribe', '/pages/subscribe.html'],
  ['article', '/pages/blog/authoritative-time-source.html'],
  ['framework-engineering', '/pages/framework-engineering.html']
];
const fields = '.module-search input, .content-search-controls input, .content-search-controls select, .subscribe-controls input';
const chips = '.note-tags > a, .note-tags > span, .blog-tag-list a, .context-tags > *, .mod-tags span, .system-tags span, .capability-list li';
const cards = '.content-card, .module-card, .blog-featured-card, .framework-domain-card, .framework-depth-card, .content-search-result, .mod-work-card, .public-route-card';

/** Compare the same roles across real routes so page-specific overrides cannot split them again. */
export async function assertInterfaceConsistency(browser, baseUrl, output) {
  if (output) await mkdir(output, { recursive: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  const page = await context.newPage();
  const evidence = [];
  try {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      const baseline = new Map();
      for (const [name, route] of routes) {
        await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
        if (name === 'framework') await page.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        const state = await page.evaluate(({ fields, chips, cards }) => {
          const read = (selector, properties) => [...document.querySelectorAll(selector)]
            // Offscreen archive cards use content-visibility:auto; inspect them after
            // scrolling them into view below, rather than reading skipped subtrees.
            .filter(el => el.checkVisibility({ contentVisibilityAuto: true }))
            .map(el => {
              const css = getComputedStyle(el);
              return { label: el.textContent.trim().slice(0, 45) || el.getAttribute('aria-label') || el.tagName,
                values: Object.fromEntries(properties.map(property => [property, css[property]])) };
            });
          return {
            buttons: read('main .btn', ['borderRadius', 'borderWidth', 'minHeight', 'padding', 'fontSize', 'lineHeight']),
            fields: read(fields, ['borderRadius', 'borderWidth', 'minHeight', 'paddingTop', 'paddingBottom', 'fontSize']),
            chips: read(chips, ['borderRadius', 'borderWidth', 'fontSize', 'lineHeight']),
            cards: read(cards, ['borderRadius', 'boxShadow']),
            heading: read('h1', ['fontFamily', 'fontSize', 'lineHeight']),
            overflow: document.documentElement.scrollWidth - innerWidth
          };
        }, { fields, chips, cards });
        assert.ok(state.overflow <= 1, `${width}px ${name}: horizontal overflow`);
        for (const role of ['buttons', 'fields', 'chips', 'cards']) {
          for (const item of state[role]) {
            // The selected module card deliberately carries an inset selection stripe.
            const values = { ...item.values };
            if (role === 'cards') delete values.boxShadow;
            if (!baseline.has(role)) baseline.set(role, values);
            assert.deepEqual(values, baseline.get(role), `${width}px ${name}: ${role} drift for ${item.label}`);
          }
        }
        if (['engineering', 'framework', 'journal', 'tools', 'mods', 'wisteria'].includes(name)) {
          const heading = state.heading[0].values;
          if (!baseline.has('project-title')) baseline.set('project-title', heading);
          assert.deepEqual(heading, baseline.get('project-title'), `${width}px ${name}: project heading scale differs`);
        }
        evidence.push({ width, name, ...state });
        if (output) await page.screenshot({ path: path.join(output, `${name}-${width}.png`) });
      }
    }

    await page.goto(baseUrl + '/pages/journal.html', { waitUntil: 'networkidle' });
    const archiveCard = page.locator('.journal-design-scroll .design-summary-card').nth(1);
    await archiveCard.scrollIntoViewIfNeeded();
    const archiveTags = await archiveCard.locator('.note-tags span').evaluateAll(elements => elements.map(el => {
      const css = getComputedStyle(el);
      return { borderRadius: css.borderRadius, borderWidth: css.borderWidth, fontSize: css.fontSize, lineHeight: css.lineHeight };
    }));
    assert.ok(archiveTags.length > 0, 'Scrolled archive card exposes its topic chips');
    const chipSample = evidence.find(row => row.chips.length).chips[0].values;
    for (const tag of archiveTags) assert.deepEqual(tag, chipSample, 'Rendered archive chip retains shared geometry');

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const primary = page.locator('.profile-identity .btn-primary');
    await primary.hover();
    assert.equal(await primary.evaluate(el => getComputedStyle(el).transform), 'none', 'Action hover must not shift its target');
    await page.locator('[data-search-open]').click();
    const searchField = await page.locator('[data-search-input]').evaluate(el => {
      const css = getComputedStyle(el);
      return { radius: css.borderRadius, height: css.minHeight, border: css.borderWidth };
    });
    const fieldSample = evidence.find(row => row.fields.length).fields[0].values;
    assert.deepEqual(searchField, { radius: fieldSample.borderRadius, height: fieldSample.minHeight, border: fieldSample.borderWidth });
    if (output) await page.locator('[data-site-search]').screenshot({ path: path.join(output, 'search-dialog.png') });
    await page.keyboard.press('Escape');
    if (output) {
      for (const [name, selector] of [['home-buttons', '.profile-identity .hero-buttons'], ['contact-buttons', '.about-home .hero-buttons']]) {
        await page.locator(selector).screenshot({ path: path.join(output, `${name}.png`) });
      }
    }

    for (const [route, selector, name] of [
      ['/pages/tools.html', '.tool-drawer', 'tool-drawer'],
      ['/pages/blog/authoritative-time-source.html', '.article-toc', 'article-toc'],
      ['/pages/portfolio.html', '.technical-work details', 'portfolio-details']
    ]) {
      await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
      const disclosure = page.locator(selector).first();
      const summary = disclosure.locator(':scope > summary');
      const wasOpen = await disclosure.evaluate(el => el.open);
      await summary.focus();
      const initial = await summary.evaluate(el => getComputedStyle(el, '::after').transform);
      await page.keyboard.press('Enter');
      assert.equal(await disclosure.evaluate(el => el.open), !wasOpen, `${name}: keyboard disclosure`);
      await page.waitForFunction(({ selector, initial }) =>
        getComputedStyle(document.querySelector(selector + ' > summary'), '::after').transform !== initial,
      { selector, initial });
      assert.notEqual(await summary.evaluate(el => getComputedStyle(el, '::after').transform), initial, `${name}: chevron must reflect state`);
      await page.keyboard.press('Enter');
      assert.equal(await disclosure.evaluate(el => el.open), wasOpen, `${name}: keyboard close/restore`);
      if (output && name === 'tool-drawer') {
        if (!wasOpen) await summary.click();
        await disclosure.screenshot({ path: path.join(output, 'tool-drawer.png') });
      }
    }
    if (output) await writeFile(path.join(output, 'interface-consistency.json'), JSON.stringify(evidence, null, 2));
  } finally {
    await context.close();
  }
}
