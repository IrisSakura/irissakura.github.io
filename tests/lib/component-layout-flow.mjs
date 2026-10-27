import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';

const cardSelectors = [
  '.module-detail', '.framework-boundary-grid article', '.framework-focus-grid article',
  '.framework-toolchain-grid article', '.framework-topic-grid article', '.framework-case-grid a',
  '.framework-knowledge-grid a', '.framework-knowledge-clusters a', '.framework-module-reference-card',
  '.framework-consumer-card', '.framework-decision-card', '.framework-case-sections > section',
  '.supported-package-list li', '.stable-route-list article'
].join(',');

async function frameworkRoutes(directory = new URL('../../pages/framework/', import.meta.url), prefix = '/pages/framework/') {
  const entries = await readdir(directory, { withFileTypes: true });
  const routes = await Promise.all(entries.map(entry => entry.isDirectory()
    ? frameworkRoutes(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`)
    : entry.name.endsWith('.html') ? [`${prefix}${entry.name}`] : []));
  return routes.flat();
}

async function assertInsetFocus(page, selector) {
  const focused = page.locator(selector);
  assert.equal(await focused.evaluate(el => el.matches(':focus-visible')), true, `${selector}: keyboard focus must be visible`);
  const clipped = await focused.evaluate(el => {
    const css = getComputedStyle(el);
    const outset = Math.max(0, parseFloat(css.outlineWidth) + parseFloat(css.outlineOffset));
    const box = el.getBoundingClientRect();
    const failures = [];
    for (let parent = el.parentElement; parent; parent = parent.parentElement) {
      const style = getComputedStyle(parent);
      const bounds = parent.getBoundingClientRect();
      const left = bounds.left + parent.clientLeft, top = bounds.top + parent.clientTop;
      if (/(auto|scroll|hidden|clip)/.test(style.overflowX)
        && (box.left - outset < left - 1 || box.right + outset > left + parent.clientWidth + 1)) failures.push('inline');
      if (/(auto|scroll|hidden|clip)/.test(style.overflowY)
        && (box.top - outset < top - 1 || box.bottom + outset > top + parent.clientHeight + 1)) failures.push('block');
      if (parent.classList.contains('module-filters')) {
        for (const [property, horizontal, vertical] of [
          ['borderTopLeftRadius', 'left', 'top'], ['borderTopRightRadius', 'right', 'top'],
          ['borderBottomLeftRadius', 'left', 'bottom'], ['borderBottomRightRadius', 'right', 'bottom']
        ]) {
          if (Math.abs(box[horizontal] - bounds[horizontal]) <= 2
            && Math.abs(box[vertical] - bounds[vertical]) <= 2
            && parseFloat(css[property]) < parseFloat(style[property]) - 2) failures.push(`rounded ${property}`);
        }
      }
    }
    return failures;
  });
  assert.deepEqual(clipped, [], `${selector}: focus ring is clipped by a component container`);
}

export async function assertComponentLayouts(browser, baseUrl) {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  const page = await context.newPage();
  try {
    const routes = ['/pages/framework.html', ...await frameworkRoutes()];
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'load' });
        if (route === '/pages/framework.html') await page.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
        await page.evaluate(() => document.fonts.ready);
        const failures = await page.locator(cardSelectors).evaluateAll(cards => {
          const failures = [];
          for (const card of cards) {
            if (!card.checkVisibility()) continue;
            const bounds = card.getBoundingClientRect(), css = getComputedStyle(card);
            const left = parseFloat(css.paddingLeft) + parseFloat(css.borderLeftWidth);
            const right = parseFloat(css.paddingRight) + parseFloat(css.borderRightWidth);
            if (left < 16 || right < 16) failures.push(`${card.className}: missing safe card inset`);
            const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              const node = walker.currentNode;
              if (!node.textContent.trim() || !node.parentElement.checkVisibility()
                || node.parentElement.closest('[aria-hidden="true"]')) continue;
              const range = document.createRange(); range.selectNodeContents(node);
              for (const rect of range.getClientRects()) {
                if (rect.left < bounds.left + left - 2 || rect.right > bounds.right - right + 2) {
                  failures.push(`${card.className}: ${node.textContent.trim().slice(0,60)} enters card padding`);
                }
              }
            }
          }
          return failures;
        });
        assert.deepEqual(failures, [], `${width}px ${route}: ${failures.slice(0, 6).join('; ')}`);
        if (route === '/pages/framework.html') {
          const listFailures = await page.locator('.supported-package-list').evaluate(list => {
            const failures = [];
            const last = list.lastElementChild.getBoundingClientRect();
            if (list.getBoundingClientRect().bottom - last.bottom > 2) failures.push('list is stretched beyond its last row');
            for (const code of list.querySelectorAll('code')) {
              const range = document.createRange(); range.selectNodeContents(code);
              const bounds = code.getBoundingClientRect();
              if ([...range.getClientRects()].some(rect => rect.left < bounds.left - 1 || rect.right > bounds.right + 1)) {
                failures.push(`${code.textContent}: package identifier leaves its column`);
              }
            }
            return failures;
          });
          assert.deepEqual(listFailures, [], `${width}px adoption list: ${listFailures.join('; ')}`);
        }
      }
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
    await page.locator('.page-index-links a').first().focus();
    await page.keyboard.press('Tab');
    await assertInsetFocus(page, '.page-index-links a:focus');

    await page.goto(`${baseUrl}/pages/framework.html`, { waitUntil: 'networkidle' });
    await page.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator('.module-filter').first().focus();
      for (let index = 0; index < 4; index++) {
        if (index) await page.keyboard.press('Tab');
        await assertInsetFocus(page, '.module-filter:focus');
      }
    }

    await page.locator('[data-search-open]').click();
    await page.locator('[data-search-input]').fill('框架');
    await page.locator('.site-search-results a').first().waitFor();
    await page.keyboard.press('ArrowDown');
    await assertInsetFocus(page, '.site-search-results a:focus');
    await page.keyboard.press('Escape');
  } finally { await context.close(); }
  console.log('Component layouts passed: all Framework detail routes keep text inside card padding at 320/390/768/1440px; directory, filters and search retain complete keyboard focus rings.');
}
