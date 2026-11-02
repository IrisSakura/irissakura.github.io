import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';

export async function assertInteractiveLabs(browser, baseUrl, root) {
  const evidence = path.join(root, 'output/playwright/interactive-labs');
  await mkdir(path.join(evidence, 'after'), { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: path.join(evidence, 'recordings'), size: { width: 1440, height: 1000 } } });
  const page = await context.newPage(), errors = [];
  let passed = false;
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.request().url().startsWith(baseUrl) || route.request().url().startsWith('blob:') ? route.continue() : route.abort());
  const status = () => page.locator('[data-interactive-lab] [data-status]');
  const action = name => page.locator(`[data-action="${name}"]`);
  const waitText = async (selector, text) => page.waitForFunction(({ selector, text }) => document.querySelector(selector)?.textContent.includes(text), { selector, text });
  try {
    await page.goto(baseUrl);
    for (const slug of ['numeric-workbench', 'deck-odds', 'pathfinding']) assert.equal(await page.locator(`.lab-entrances a[href="pages/labs/${slug}.html"]`).count(), 1);
    await page.evaluate(() => { window.__labSoftNavigation = 'retained'; });
    await page.locator('.lab-entrances a[href="pages/labs/numeric-workbench.html"]').click();
    await page.waitForURL('**/labs/numeric-workbench.html');
    await waitText('[data-numeric-results]', '2,880');
    assert.equal(await page.evaluate(() => window.__labSoftNavigation), 'retained');
    await action('save-a').click();
    await page.locator('#attack').fill('1200');
    await action('save-b').click();
    assert.match(await page.locator('[data-numeric-comparison]').innerText(), /3,456/);
    const downloadEvent = page.waitForEvent('download'); await action('numeric-export').click();
    const download = await downloadEvent; await download.saveAs(path.join(evidence, 'numeric-experiment.json'));
    const config = JSON.parse(await readFile(path.join(evidence, 'numeric-experiment.json'), 'utf8'));
    assert.equal(config.snapshots.A.attack, 1000); assert.equal(config.snapshots.B.attack, 1200);
    await action('numeric-reset').click();
    await page.locator('[data-import-file]').setInputFiles(path.join(evidence, 'numeric-experiment.json'));
    await waitText('[data-config-status]', '已恢复');
    assert.equal(await page.locator('#attack').inputValue(), '1200');
    const unchanged = await page.locator('[data-numeric-comparison]').innerText();
    await page.locator('[data-import-text]').fill(JSON.stringify({ ...config, modelVersion: 99 })); await action('numeric-import').click();
    await waitText('[data-config-status]', '导入失败');
    assert.equal(await page.locator('[data-numeric-comparison]').innerText(), unchanged);
    await page.locator('#critRate').fill('1.5');
    assert.equal(await status().getAttribute('data-error'), 'true'); assert.equal(await page.locator('#critRate').getAttribute('aria-invalid'), 'true');
    await page.locator('#critRate').fill('0.5');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.screenshot({ path: path.join(evidence, 'after/numeric-comparison-1440.png') });
    await page.locator('[data-numeric-comparison]').screenshot({ path: path.join(evidence, 'after/numeric-comparison-detail.png') });

    await page.locator('.lab-switcher a[href="deck-odds.html"]').click(); await page.waitForURL('**/deck-odds.html');
    await waitText('[data-deck-results]', '44.7368%');
    assert.match(await page.locator('[data-deck-results]').innerText(), /60\.0877%/);
    await page.locator('#scenario-0-categoryB').fill('3');
    assert.equal(await page.locator('[data-deck-results]').innerText(), '');
    await page.locator('button[type="submit"]').click(); await waitText('[data-status]', '计算完成');
    assert.match(await page.locator('[data-deck-mode="0"]').innerText(), /双类/);
    await page.locator('#scenario-0-categoryB').fill('0');
    await page.locator('#scenario-0-requiredB').fill('1000');
    await page.locator('button[type="submit"]').click(); await waitText('[data-deck-results]', '44.7368%');
    await page.locator('#scenario-0-categoryA').fill('21'); await page.locator('button[type="submit"]').click();
    assert.equal(await status().getAttribute('data-error'), 'true');
    await action('deck-reset').click(); await waitText('[data-deck-results]', '44.7368%');
    const deckDownload = page.waitForEvent('download'); await action('deck-export').click();
    const deckFile = await deckDownload; await deckFile.saveAs(path.join(evidence, 'deck-experiment.json'));
    assert.equal(JSON.parse(await readFile(path.join(evidence, 'deck-experiment.json'), 'utf8')).scenarios.length, 2);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.screenshot({ path: path.join(evidence, 'after/deck-comparison-1440.png') });

    await page.locator('.lab-switcher a[href="pathfinding.html"]').click(); await page.waitForURL('**/pathfinding.html');
    await page.waitForSelector('[data-cell="63"]');
    const from = await page.locator('[data-cell="16"]').boundingBox(), to = await page.locator('[data-cell="18"]').boundingBox();
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2); await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 16 }); await page.mouse.up();
    for (const id of [16, 17, 18]) assert.equal(await page.locator(`[data-cell="${id}"]`).getAttribute('data-state'), 'wall');
    await action('path-clear').click();
    await page.locator('[data-cell="10"]').focus(); await page.keyboard.press(' ');
    assert.equal(await page.locator('[data-cell="10"]').getAttribute('data-state'), 'wall');
    await page.keyboard.press('ArrowRight'); assert.equal(await page.locator('[data-cell="11"]').evaluate(node => node === document.activeElement), true);
    assert.equal(await page.locator('[data-cell][tabindex="0"]').count(), 1);
    await action('step').click(); assert.match(await page.locator('[data-path-metrics]').innerText(), /1/);
    await page.locator('[data-speed]').selectOption('150'); await action('run').click(); await action('pause').click();
    const paused = await page.locator('[data-path-metrics]').innerText(); await page.waitForTimeout(220);
    assert.equal(await page.locator('[data-path-metrics]').innerText(), paused);
    await page.locator('[data-speed]').selectOption('5'); await action('run').click(); await waitText('[data-status]', 'FOUND');
    const found = await page.locator('[data-path-metrics]').innerText();
    await action('path-reset').click(); await action('run').click(); await waitText('[data-status]', 'FOUND');
    assert.equal(await page.locator('[data-path-metrics]').innerText(), found);
    await page.locator('[data-map-preset]').selectOption('unreachable'); await action('run').click(); await waitText('[data-status]', 'PROVED_UNREACHABLE');
    await page.locator('[data-map-preset]').selectOption('empty'); await page.locator('#search-budget').fill('1'); await action('run').click(); await waitText('[data-status]', 'BUDGET_EXHAUSTED');
    await page.locator('#search-budget').fill('0'); await action('run').click(); await waitText('[data-status]', 'INVALID_INPUT');
    await action('path-export').click(); assert.equal(await status().getAttribute('data-error'), 'true');
    await page.locator('#search-budget').fill('1024'); await page.locator('[data-map-preset]').selectOption('weighted'); await action('run').click(); await waitText('[data-status]', 'FOUND');
    const mapDownload = page.waitForEvent('download'); await action('path-export').click(); const mapFile = await mapDownload;
    await mapFile.saveAs(path.join(evidence, 'pathfinding-map.json')); assert.equal(JSON.parse(await readFile(path.join(evidence, 'pathfinding-map.json'), 'utf8')).cells.length, 64);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.screenshot({ path: path.join(evidence, 'after/path-result-1440.png') });
    // Real history, refresh and repeated soft navigation must reconnect once and clean up old work.
    for (let i = 0; i < 3; i++) {
      await action('path-reset').click(); await action('run').click();
      await page.locator('.lab-switcher a[href="deck-odds.html"]').click(); await page.waitForURL('**/deck-odds.html');
      await page.goBack(); await page.waitForURL('**/pathfinding.html'); await page.waitForSelector('[data-cell="63"]');
    }
    await page.reload(); await page.waitForSelector('[data-cell="63"]');
    await page.goBack(); await page.goForward(); await page.waitForURL('**/pathfinding.html'); await page.waitForSelector('[data-cell="63"]');
    // Freeze decorative entrance motion for stable static contrast and screenshots;
    // the preceding real-input recording runs with normal motion.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const measurements = [];
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      for (const slug of ['numeric-workbench', 'deck-odds', 'pathfinding']) {
        await page.goto(`${baseUrl}/pages/labs/${slug}.html`); await page.waitForSelector('[data-interactive-lab]');
        if (slug === 'deck-odds') await waitText('[data-status]', '计算完成');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert.equal(overflow, false, `${slug} overflows at ${width}`);
        const axe = await new AxeBuilder({ page }).analyze();
        assert.deepEqual(axe.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), [], `${slug} accessibility at ${width}`);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: path.join(evidence, `after/${slug}-${width}.png`), fullPage: true });
        measurements.push({ slug, width, overflow, accessibilityViolations: axe.violations.length });
      }
      for (const route of ['/', '/pages/tools.html', '/pages/framework.html']) {
        await page.goto(`${baseUrl}${route}`);
        const label = route === '/' ? 'home' : route.includes('tools') ? 'tools' : 'framework';
        await page.screenshot({ path: path.join(evidence, `after/${label}-${width}.png`) });
        await page.locator('.lab-entrances').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(evidence, `after/${label}-entrance-${width}.png`) });
      }
    }
    // Touch input edits the actual map; this is browser emulation, not a physical-phone claim.
    const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    try {
      const touch = await touchContext.newPage();
      await touch.goto(`${baseUrl}/pages/labs/pathfinding.html`); await touch.locator('[data-cell="16"]').tap();
      assert.equal(await touch.locator('[data-cell="16"]').getAttribute('data-state'), 'wall');
    } finally { await touchContext.close(); }
    assert.deepEqual(errors, []);
    await writeFile(path.join(evidence, 'browser-results.json'), JSON.stringify({ passed: true, measurements, runtimeErrors: errors, scope: 'Chromium desktop, responsive viewports, touch emulation; no Safari/physical-device or deployment evidence' }, null, 2));
    passed = true;
    console.log('Interactive Labs passed: numeric compare/import/export, deck probabilities, map drag/keyboard/touch, real steps/history/cleanup, 3 widths and accessibility.');
  } finally {
    const video = page.video();
    await context.close();
    if (passed && video) await video.saveAs(path.join(evidence, 'interaction.webm'));
  }
}
