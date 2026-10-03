import assert from 'node:assert/strict';

async function traverse(page, delta) {
  // URL changes before the asynchronous soft navigation has committed.
  await page.evaluate(delta => new Promise(resolve => {
    window.addEventListener('popstate', () => resolve(), { once: true });
    history.go(delta);
  }), delta);
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-site-navigating'));
}

async function settleNavigation(page) {
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-site-navigating'));
}

async function recordDepartures(page) {
  // Observe the viewport immediately before an entry is replaced. Locator
  // actionability, scroll anchoring and reading during a pending fetch can all
  // move it after a test's earlier scrollTo call.
  await page.evaluate(() => {
    window.__historyDepartures = {};
    const push = history.pushState.bind(history);
    history.pushState = (...args) => {
      window.__historyDepartures[location.pathname] = scrollY;
      return push(...args);
    };
  });
}

async function assertReadingPosition(page, expected, message) {
  const actual = await page.evaluate(() => scrollY);
  const diagnostic = Number.isFinite(expected) && Math.abs(actual - expected) <= 2 ? ''
    : await page.evaluate(() => JSON.stringify(window.__historyDiagnostic));
  assert.ok(Number.isFinite(expected) && Math.abs(actual - expected) <= 2,
    `${message}: expected ${expected}px, actual ${actual}px, delta ${actual - expected}px; ${diagnostic}`);
}

export async function assertNavigationLifecycle(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  let releaseNavigation = () => {};
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(`${baseUrl}/pages/framework.html`, { waitUntil: 'networkidle' });
    await page.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
    await page.locator('[data-module-filter="gameplay"]').click();
    await page.locator('#framework-module-search').fill('GAS');
    await page.locator('[data-search-open]').click();
    await page.locator('[data-search-input]').fill('对象池');
    await page.locator('[data-search-result="framework:pooling"]').click();
    await page.waitForFunction(() => document.querySelector('[data-module-id="pooling"]')?.getAttribute('aria-pressed') === 'true');
    assert.equal(new URL(page.url()).hash, '#module-pooling');
    assert.equal(await page.locator('#framework-module-search').inputValue(), '');
    assert.equal(await page.locator('[data-module-filter="all"]').getAttribute('aria-pressed'), 'true');
    await page.waitForFunction(() => {
      const section = document.querySelector('#modules');
      const top = section.getBoundingClientRect().top;
      const expected = parseFloat(getComputedStyle(section).scrollMarginTop)
        + parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
      return Math.abs(top - expected) <= 2
        && top >= document.querySelector('.navbar').getBoundingClientRect().bottom
        && top < innerHeight;
    });

    await page.locator('[data-search-open]').click();
    const input = page.locator('[data-search-input]');
    await input.fill('SakuraGameFramework');
    await page.locator('[data-search-results] a[href="/pages/framework.html"]').waitFor();
    for (const key of ['ArrowDown', 'ArrowUp', 'Enter', 'Escape']) {
      const state = await input.evaluate((element, key) => {
        const event = new KeyboardEvent('keydown', { key, isComposing: true, bubbles: true, cancelable: true });
        element.dispatchEvent(event);
        return { prevented: event.defaultPrevented, focused: document.activeElement === element,
          open: document.querySelector('[data-site-search]').open };
      }, key);
      assert.deepEqual(state, { prevented: false, focused: true, open: true }, `IME ${key} belongs to the composition session`);
    }
    await page.keyboard.press('Escape');
    assert.equal(new URL(page.url()).hash, '#module-pooling');

    await page.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
    await page.locator('[data-content-search-results] article').first().waitFor();
    await page.locator('[data-content-search-query]').fill('Godot');
    await page.evaluate(() => {
      window.__reviewMain = document.querySelector('main');
      window.__reviewDocument = true;
      scrollTo({ top: 1200, behavior: 'instant' });
    });
    let journalRequests = 0;
    page.on('request', request => {
      if (request.url() === `${baseUrl}/pages/journal.html`) journalRequests++;
    });
    // Locator clicks scroll an offscreen directory into view before dispatching.
    // Restore the position at the actual click, rather than before that scroll.
    await page.evaluate(() => document.addEventListener('click', () => {
      window.__anchorOriginY = scrollY;
    }, { capture: true, once: true }));
    await page.locator('[data-page-index-link][href="#featured-notes"]').click();
    const initialPosition = await page.evaluate(() => window.__anchorOriginY);
    assert.ok(initialPosition > 0);
    const sameHashLength = await page.evaluate(() => history.length);
    await page.locator('[data-page-index-link][href="#featured-notes"]').click();
    assert.equal(await page.evaluate(() => history.length), sameHashLength, 'repeating an anchor does not add duplicate history');
    await traverse(page, -1);
    assert.equal(await page.evaluate(() => document.querySelector('main') === window.__reviewMain), true, 'anchor history retains the current DOM');
    assert.equal(await page.locator('[data-content-search-query]').inputValue(), 'Godot');
    assert.equal(journalRequests, 0, 'anchor history performs no HTML request');
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - initialPosition) <= 2);
    await traverse(page, 1);
    assert.equal(journalRequests, 0);
    assert.equal(await page.locator('[data-content-search-query]').inputValue(), 'Godot');

    // Saved reading position takes precedence over the entry's old anchor.
    await page.evaluate(() => scrollTo({ top: 1800, behavior: 'instant' }));
    const journalPosition = await page.evaluate(() => scrollY);
    await page.locator('.nav-menu').getByRole('link', { name: '文章', exact: true }).click();
    await page.waitForURL('**/pages/blog.html');
    await settleNavigation(page);
    await page.evaluate(() => scrollTo({ top: 700, behavior: 'instant' }));
    const blogPosition = await page.evaluate(() => scrollY);
    await traverse(page, -1);
    assert.equal(new URL(page.url()).pathname, '/pages/journal.html');
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - journalPosition) <= 2, 'Back restores reading position');
    await traverse(page, 1);
    assert.equal(new URL(page.url()).pathname, '/pages/blog.html');
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - blogPosition) <= 2, 'Forward restores reading position');
    assert.equal(await page.evaluate(() => window.__reviewDocument), true);

    // Framework module selection uses replaceState and must preserve the entry key.
    await page.locator('.footer').getByRole('link', { name: 'SakuraGameFramework', exact: true }).click();
    await page.waitForURL('**/pages/framework.html');
    await page.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
    await settleNavigation(page);
    const key = await page.evaluate(() => history.state.siteNavigationKey);
    await page.locator('[data-module-id="pooling"]').click();
    assert.equal(await page.evaluate(() => history.state.siteNavigationKey), key);
    await recordDepartures(page);
    await page.evaluate(() => {
      const entries = window.__historyDiagnostic = [];
      const scroll = window.scrollTo.bind(window);
      window.scrollTo = (...args) => {
        const before = scrollY;
        scroll(...args);
        entries.push({ type: 'scrollTo', args, before, after: scrollY });
      };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) entries.push({
          type: 'layout-shift', value: entry.value, scrollY,
          sources: entry.sources.map(source => ({
            element: source.node?.outerHTML.slice(0, 200),
            before: source.previousRect, after: source.currentRect
          }))
        });
      }).observe({ type: 'layout-shift' });
    });
    await page.evaluate(() => scrollTo({ top: 1200, behavior: 'instant' }));
    let requested;
    const held = new Promise(resolve => { releaseNavigation = resolve; });
    const started = new Promise(resolve => { requested = resolve; });
    await page.route('**/pages/blog.html', async route => {
      requested();
      await held;
      await route.continue();
    });
    await page.locator('.nav-menu').getByRole('link', { name: '文章', exact: true }).click();
    await started;
    // Continue reading while the destination is loading. Restoring the earlier
    // 1200px sample would lose this user input even if the module cache is sound.
    await page.evaluate(() => scrollTo({ top: 1370, behavior: 'instant' }));
    releaseNavigation();
    await page.unrouteAll({ behavior: 'wait' });
    await page.waitForURL('**/pages/blog.html');
    await settleNavigation(page);
    const frameworkPosition = await page.evaluate(() => window.__historyDepartures['/pages/framework.html']);
    assert.ok(frameworkPosition > 1300, `pending navigation must retain the later reading position: ${frameworkPosition}px`);
    await traverse(page, -1);
    await page.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await assertReadingPosition(page, frameworkPosition, 'cached module initialization must not override history restoration');
    assert.equal(await page.locator('[data-module-id="pooling"]').getAttribute('aria-pressed'), 'true');
    assert.deepEqual(errors, []);
  } finally {
    releaseNavigation();
    await page.unrouteAll({ behavior: 'wait' });
    await context.close();
  }

  await assertSlowNavigation(browser, baseUrl);
  await assertPendingSearch(browser, baseUrl);
  await assertRapidHistory(browser, baseUrl);
  await assertKeyboardRecovery(browser, baseUrl);
  await assertLateFrameworkData(browser, baseUrl);
  console.log('Navigation lifecycle passed: IME, module links, anchor history, rapid Back/Forward, stable relative links, keyboard focus, search recovery and late data.');
}

async function assertRapidHistory(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  const page = await context.newPage();
  let release = () => {};
  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await recordDepartures(page);
    await page.evaluate(() => scrollTo({ top: 600, behavior: 'instant' }));
    await page.locator('.nav-menu').getByRole('link', { name: '文章', exact: true }).click();
    await page.waitForURL('**/pages/blog.html');
    await settleNavigation(page);
    await page.evaluate(() => scrollTo({ top: 1200, behavior: 'instant' }));
    await page.locator('.nav-menu').getByRole('link', { name: 'Mods', exact: true }).click();
    await page.waitForURL('**/pages/mods.html');
    await settleNavigation(page);
    const departures = await page.evaluate(() => window.__historyDepartures);
    assert.ok(departures['/pages/blog.html'] > 1000 && departures['/pages/blog.html'] < 1400);
    await page.evaluate(() => scrollTo({ top: 2300, behavior: 'instant' }));
    let requested;
    const held = new Promise(resolve => { release = resolve; });
    const started = new Promise(resolve => { requested = resolve; });
    await page.route('**/pages/blog.html', async route => {
      requested(); await held; await route.continue();
    });
    await page.evaluate(() => history.back());
    await started;
    await traverse(page, -1);
    assert.equal(new URL(page.url()).pathname, '/');
    assert.equal(await page.evaluate(() => scrollY), departures['/']);
    release();
    await page.unrouteAll({ behavior: 'wait' });
    await traverse(page, 1);
    assert.equal(new URL(page.url()).pathname, '/pages/blog.html');
    assert.equal(await page.evaluate(() => scrollY), departures['/pages/blog.html'], 'an uncommitted traversal must not overwrite the intermediate entry');
    await traverse(page, 1);
    assert.equal(await page.evaluate(() => scrollY), 2300);

    const articleRoute = '/pages/blog/authoritative-time-source.html';
    await page.goto(`${baseUrl}${articleRoute}`, { waitUntil: 'networkidle' });
    await page.locator('.nav-menu').getByRole('link', { name: '文章', exact: true }).click();
    await page.waitForURL('**/pages/blog.html');
    await settleNavigation(page);
    const link = page.locator('main a[href="blog/authoritative-time-source.html"]').first();
    const expectedHref = await link.evaluate(element => element.href);
    const nextHeld = new Promise(resolve => { release = resolve; });
    const nextStarted = new Promise(resolve => { requested = resolve; });
    await page.route(`**${articleRoute}`, async route => {
      requested(); await nextHeld; await route.continue();
    });
    await page.evaluate(() => history.back());
    await nextStarted;
    assert.equal(await link.evaluate(element => element.href), expectedHref, 'visible links retain the rendered document base during a pending traversal');
    assert.equal(await page.evaluate(() => document.baseURI), `${baseUrl}/pages/blog.html`);
    await traverse(page, 1);
    release();
    await page.unrouteAll({ behavior: 'wait' });
    await link.click();
    await page.waitForURL(`**${articleRoute}`);
    await settleNavigation(page);
    assert.equal(await page.evaluate(() => document.baseURI), `${baseUrl}${articleRoute}`);
    assert.ok(await page.locator('.navbar img, .footer img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), 'persistent branding survives a directory change');
  } finally {
    release();
    await page.unrouteAll({ behavior: 'wait' });
    await context.close();
  }
}

async function assertKeyboardRecovery(browser, baseUrl) {
  for (const width of [1280, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    const page = await context.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.locator('.skip-link').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => document.activeElement?.id), 'main-content');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => !!document.activeElement?.closest('main')), true, 'Tab after skipping navigation starts in the content');

      if (width === 390) {
        await page.locator('.logo').focus();
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => !!document.activeElement?.closest('.nav-menu')), false, 'closed mobile links are outside the tab order');
        await page.locator('.mobile-toggle').click();
        assert.equal(await page.evaluate(() => !!document.activeElement?.closest('.nav-menu')), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('mobile-toggle')), true);
        await page.setViewportSize({ width: 1280, height: 844 });
        await page.locator('.logo').focus();
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => !!document.activeElement?.closest('.nav-menu')), true, 'desktop navigation remains keyboard-accessible after resizing');
        await page.setViewportSize({ width, height: 844 });
      }

      await page.route('**/data/site-search-index.json', route => route.abort());
      await page.locator('[data-search-open]').click();
      await page.getByText('搜索暂时不可用', { exact: false }).waitFor();
      await page.locator('.site-search-fallback a').click();
      await page.waitForURL('**/pages/journal.html#content-search');
      await settleNavigation(page);
      assert.equal(await page.locator('[data-site-search]').evaluate(dialog => dialog.open), false, 'fallback navigation must release the modal');
      assert.equal(await page.evaluate(() => document.activeElement?.id), 'content-search');
      await page.locator('[data-content-search-query]').fill('Godot');
      await page.locator('[data-content-search-results] article').first().waitFor();

      // The same fallback can also target the document already on screen.
      await page.locator('[data-search-open]').click();
      await page.getByText('搜索暂时不可用', { exact: false }).waitFor();
      await page.locator('.site-search-fallback a').click();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.evaluate(() => document.activeElement?.id), 'content-search', 'a delayed dialog close event must not steal destination focus');
      assert.equal(await page.locator('[data-content-search-query]').inputValue(), 'Godot');
    } finally { await context.close(); }
  }
}

async function assertLateFrameworkData(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  const page = await context.newPage();
  let release;
  const held = new Promise(resolve => { release = resolve; });
  await page.route('**/data/framework-public.json', async route => { await held; await route.continue(); });
  try {
    await page.goto(`${baseUrl}/pages/framework.html#module-pooling`, { waitUntil: 'domcontentloaded' });
    const module = page.locator('[data-module-id="pooling"]');
    await module.waitFor({ state: 'attached' });
    await page.waitForFunction(() => {
      const rect = document.getElementById('modules').getBoundingClientRect();
      return rect.top >= 0 && rect.top < 320;
    });
    await module.click();
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    release();
    await page.locator('#framework-module-list[data-framework-loaded="true"]').waitFor();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.evaluate(() => scrollY), 0, 'late data must not move the reader back to the initial anchor');
    assert.equal(await module.getAttribute('aria-pressed'), 'true');
    assert.equal(await module.evaluate(element => element === document.activeElement), true, 'data refresh preserves module keyboard focus');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => {
      const target = document.getElementById('architecture');
      const scroll = target.scrollIntoView.bind(target);
      target.scrollIntoView = options => {
        window.__architectureScrollBehavior = options.behavior;
        scroll(options);
      };
    });
    await page.locator('#framework-module-layer-link').click();
    assert.equal(await page.evaluate(() => window.__architectureScrollBehavior), 'auto', 'scripted section jumps respect reduced motion');
  } finally { release(); await context.close(); }
}

async function assertSlowNavigation(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
  const page = await context.newPage();
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let requested;
  const requestStarted = new Promise(resolve => { requested = resolve; });
  const cancelled = page.waitForEvent('requestfailed', { predicate: request => request.url().endsWith('/pages/blog.html') });
  try {
    await page.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'networkidle' });
    await page.route('**/pages/blog.html', async route => {
      requested();
      await held;
      await route.continue();
    });
    await page.locator('.nav-menu').getByRole('link', { name: '文章', exact: true }).click();
    await requestStarted;
    await page.locator('[data-page-index-link][href="#featured-notes"]').click();
    await settleNavigation(page);
    release();
    await cancelled;
    assert.equal(new URL(page.url()).pathname, '/pages/journal.html');
    assert.equal(new URL(page.url()).hash, '#featured-notes');
    assert.equal(await page.locator('main').getAttribute('aria-busy'), null);
  } finally { release(); await context.close(); }
}

async function assertPendingSearch(browser, baseUrl) {
  for (const fail of [false, true]) {
    const context = await browser.newContext();
    await context.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    const page = await context.newPage();
    let release;
    const held = new Promise(resolve => { release = resolve; });
    await page.route('**/data/search-index.json', async route => {
      await held;
      if (fail) await route.abort();
      else await route.continue();
    });
    try {
      await page.goto(`${baseUrl}/pages/journal.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.querySelector('[data-content-search]')?.dataset.searchReady === 'true');
      await page.evaluate(() => { window.__searchDocument = true; });
      const input = page.locator('[data-content-search-query]');
      await input.fill('Godot');
      const assertLocalSubmit = async () => {
        assert.equal(await page.locator('[data-content-search-form]').evaluate(form => {
          const event = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(event);
          return event.defaultPrevented;
        }), true, 'submit must stay local before/after a failed request');
        await input.press('Enter');
        assert.equal(await page.evaluate(() => window.__searchDocument), true);
        assert.equal(await input.inputValue(), 'Godot');
        assert.equal(new URL(page.url()).search, '');
      };
      await assertLocalSubmit();
      release();
      if (fail) {
        await page.locator('[data-content-search][data-search-state="failed"]').waitFor();
        await assertLocalSubmit();
      } else {
        await page.locator('[data-content-search-results] article').first().waitFor();
        assert.match(await page.locator('[data-content-search-status]').textContent(), /找到/u);
      }
    } finally { release(); await context.close(); }
  }
}
