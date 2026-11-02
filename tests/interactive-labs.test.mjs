import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { NUMERIC_DEFAULTS, DECK_DEFAULTS, calculateNumeric, numericDocument, readNumericDocument, calculateDeck, deckInput, probabilityAt } from '../src/labs/models.js';
import { createSearch, gridPreset, runSearch } from '../src/labs/pathfinding.js';

test('numeric projection matches the approved attack-crit golden and preserves independent expected hits', () => {
  assert.deepEqual(calculateNumeric(NUMERIC_DEFAULTS), { singleDamage: 2880, totalDamage: 14400, dps: 1440, base: 1920 });
  assert.equal(calculateNumeric({ ...NUMERIC_DEFAULTS, critRate: 0 }).singleDamage, 1920);
  assert.equal(calculateNumeric({ ...NUMERIC_DEFAULTS, critRate: 1 }).singleDamage, 3840);
  assert.equal(calculateNumeric({ ...NUMERIC_DEFAULTS, attack: 0 }).dps, 0);
});
test('numeric rejects invalid domains and overflow instead of displaying finite-looking invalid metrics', () => {
  for (const change of [{ attack: -1 }, { critRate: 1.01 }, { damageRetention: -1 }, { critMultiplier: .9 }, { hitCount: 1.5 }, { hitCount: 1000001 }, { windowSeconds: 0 }, { attack: Infinity }, { attack: 1e308, skillMultiplier: 1e308 }]) assert.throws(() => calculateNumeric({ ...NUMERIC_DEFAULTS, ...change }));
});
test('versioned numeric import restores parameters and both snapshots without accepting unknown executable content', () => {
  const document = numericDocument(NUMERIC_DEFAULTS, { A: NUMERIC_DEFAULTS, B: { ...NUMERIC_DEFAULTS, attack: 1200 } });
  assert.deepEqual(readNumericDocument(JSON.stringify(document)), document);
  for (const change of [{ modelId: 'unknown' }, { demoVersion: '9' }, { modelVersion: 0 }, { script: 'alert(1)' }, { parameters: { ...NUMERIC_DEFAULTS, formula: 'x()' } }, { snapshots: { A: false, B: null } }, { snapshots: {} }]) assert.throws(() => readNumericDocument(JSON.stringify({ ...document, ...change })));
  assert.throws(() => readNumericDocument('{'));
  assert.throws(() => readNumericDocument(' '.repeat(32769)));
});
test('deck golden, one-category zero boundaries and reproducible comparison', () => {
  const two = calculateDeck(DECK_DEFAULTS), three = calculateDeck({ ...DECK_DEFAULTS, categoryA: 3 });
  assert.ok(Math.abs(two.final - .4473684210526316) < 1e-12);
  assert.ok(Math.abs(three.final - .6008771929824561) < 1e-12);
  assert.ok(three.final > two.final);
  for (const [change, expected] of [[{ categoryA: 0 }, 0], [{ categoryA: 20 }, 1], [{ openingHand: 0 }, 0], [{ requiredA: 0 }, 1], [{ requiredA: 6 }, 0]]) assert.equal(calculateDeck({ ...DECK_DEFAULTS, ...change }).final, expected);
  assert.equal(calculateDeck({ ...DECK_DEFAULTS, categoryB: 0, requiredB: 1000 }).final, two.final);
  assert.equal(calculateDeck({ ...DECK_DEFAULTS, laterDraws: 4 }).final, calculateDeck({ ...DECK_DEFAULTS, openingHand: 9 }).final);
});
test('two disjoint categories match independent exhaustive subsets of eight cards at every threshold and draw count', () => {
  for (let requiredA = 0; requiredA <= 4; requiredA++) for (let requiredB = 0; requiredB <= 4; requiredB++) {
    const input = deckInput({ deckSize: 8, categoryA: 3, requiredA, categoryB: 3, requiredB, openingHand: 0, laterDraws: 8 });
    for (let draws = 0; draws <= 8; draws++) {
      let total = 0, success = 0;
      for (let mask = 0; mask < 256; mask++) {
        let n = 0, a = 0, b = 0;
        for (let bit = 0; bit < 8; bit++) if (mask & (1 << bit)) { n++; if (bit < 3) a++; else if (bit < 6) b++; }
        if (n === draws) { total++; if (a >= requiredA && b >= requiredB) success++; }
      }
      assert.ok(Math.abs(probabilityAt(input, draws) - success / total) < 1e-12, JSON.stringify({ requiredA, requiredB, draws }));
    }
  }
});
test('deck invalid counts fail; bounded full-range and high-threshold progression stays finite and monotone', () => {
  for (const change of [{ deckSize: 0 }, { categoryA: 18, categoryB: 3 }, { openingHand: 19, laterDraws: 2 }, { openingHand: .5 }, { requiredA: NaN }]) assert.throws(() => calculateDeck({ ...DECK_DEFAULTS, ...change }));
  for (const required of [1, 100, 250, 400]) {
    const result = calculateDeck({ deckSize: 1000, categoryA: 400, requiredA: required, categoryB: 400, requiredB: required, openingHand: 0, laterDraws: 1000 });
    assert.ok(result.progression.length <= 25);
    assert.ok(Math.abs(result.final - 1) < 1e-12);
    for (let i = 0; i < result.progression.length; i++) { const value = result.progression[i].probability; assert.ok(Number.isFinite(value) && value >= 0 && value <= 1); if (i) assert.ok(value + 1e-12 >= result.progression[i - 1].probability); }
  }
});
test('search counts the goal, distinguishes budgets from unreachable and treats equal endpoints as zero expansion', () => {
  const grid = { width: 3, height: 2, cells: [1, 1, 1, 0, 0, 0], start: 0, goal: 2, budget: 3 };
  const found = runSearch(grid);
  assert.deepEqual({ status: found.status, cost: found.cost, expanded: found.expanded, path: found.path }, { status: 'FOUND', cost: 2, expanded: 3, path: [0, 1, 2] });
  assert.equal(runSearch({ ...grid, budget: 2 }).status, 'BUDGET_EXHAUSTED');
  assert.equal(runSearch({ ...grid, cells: [1, 0, 1, 0, 0, 0] }).status, 'PROVED_UNREACHABLE');
  assert.deepEqual(runSearch({ ...grid, goal: 0 }), { status: 'FOUND', cost: 0, expanded: 0, path: [0], events: [] });
  for (const change of [{ budget: 0 }, { budget: 1025 }, { start: 5 }, { goal: 100 }, { width: 33 }, { cells: [1] }]) assert.equal(runSearch({ ...grid, ...change }).status, 'INVALID_INPUT');
});
test('step replay, immutable input snapshot and rerun produce the same real search result', () => {
  const grid = gridPreset('weighted'), search = createSearch(grid), events = [];
  const expected = runSearch(grid);
  grid.cells.fill(0);
  while (['READY', 'RUNNING'].includes(search.status)) { const event = search.step(); if (event) events.push(event); }
  assert.deepEqual({ status: search.status, cost: search.cost, expanded: search.expanded, path: search.path, events }, expected);
  assert.equal(search.step(), null);
});
test('weighted A* costs and reachability match an independent Dijkstra oracle over 80 seeded maps', () => {
  let seed = 12891;
  const random = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let example = 0; example < 80; example++) {
    const cells = Array.from({ length: 64 }, () => random() < .25 ? 0 : 1 + Math.floor(random() * 8)); cells[0] = cells[63] = 1;
    const grid = { width: 8, height: 8, cells, start: 0, goal: 63, budget: 1024 };
    const distances = Array(64).fill(Infinity), seen = new Set(); distances[0] = 0;
    while (seen.size < 64) {
      let node = -1;
      for (let i = 0; i < 64; i++) if (!seen.has(i) && (node < 0 || distances[i] < distances[node])) node = i;
      if (node < 0 || !Number.isFinite(distances[node])) break;
      seen.add(node);
      for (let next = 0; next < 64; next++) if (cells[next] && Math.abs(next % 8 - node % 8) + Math.abs(Math.floor(next / 8) - Math.floor(node / 8)) === 1) distances[next] = Math.min(distances[next], distances[node] + cells[next]);
    }
    const result = runSearch(grid);
    if (Number.isFinite(distances[63])) { assert.equal(result.status, 'FOUND'); assert.equal(result.cost, distances[63]); assert.equal(result.path.slice(1).reduce((sum, id) => sum + cells[id], 0), result.cost); }
    else assert.equal(result.status, 'PROVED_UNREACHABLE');
  }
});
test('all lab routes have registered families, project navigation, search entries, sitemap and project/home entrances', async () => {
  const root = new URL('../', import.meta.url), index = JSON.parse(await readFile(new URL('data/site-search-index.json', root)));
  const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
  for (const [slug, owner] of [['numeric-workbench', 'tools'], ['deck-odds', 'tools'], ['pathfinding', 'framework']]) {
    const route = `/pages/labs/${slug}.html`, html = await readFile(new URL(route.slice(1), root), 'utf8');
    assert.ok(html.includes('data-interactive-lab=')); assert.ok(html.includes('data-page-family="project"'));
    assert.ok(html.includes('data-nav-section-current="true"')); assert.ok(html.includes(`https://irissakura.com${route}`));
    assert.ok(index.documents.some(item => item.url === route)); assert.ok(sitemap.includes(route));
    for (const page of ['index.html', `pages/${owner}.html`]) assert.ok((await readFile(new URL(page, root), 'utf8')).includes(`href="${page === 'index.html' ? 'pages/' : ''}labs/${slug}.html"`));
  }
});

test('experiments remain within the homepage Projects section and project-page entrances precede reference navigation', async () => {
  const root = new URL('../', import.meta.url);
  const home = await readFile(new URL('index.html', root), 'utf8');
  const projects = home.slice(home.indexOf('<section id="projects"'), home.indexOf('<section class="home-live'));
  assert.ok(projects.includes('class="lab-entrances"'));
  for (const owner of ['tools', 'framework']) {
    const html = await readFile(new URL(`pages/${owner}.html`, root), 'utf8');
    assert.ok(html.indexOf('class="lab-entrances container"') < html.indexOf('class="page-index"'), owner);
  }
});
