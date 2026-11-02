// Independent, small-grid A* projection with one observable expansion per step.
export function validateGrid(raw) {
  if (!raw || !Number.isInteger(raw.width) || !Number.isInteger(raw.height) || raw.width < 2 || raw.height < 2 || raw.width > 32 || raw.height > 32) throw new Error('网格宽高须为 2–32 的整数。');
  const count = raw.width * raw.height;
  if (!Array.isArray(raw.cells) || raw.cells.length !== count || raw.cells.some(value => !Number.isInteger(value) || value < 0 || value > 100)) throw new Error('网格须为 0（障碍）或 1–100 的整数进入权重。');
  if (![raw.start, raw.goal].every(value => Number.isInteger(value) && value >= 0 && value < count && raw.cells[value] > 0)) throw new Error('起点与终点须位于网格内的可通行格。');
  if (!Number.isInteger(raw.budget) || raw.budget < 1 || raw.budget > 1024) throw new Error('扩展预算须为 1–1024 的整数。');
  return { ...raw, cells: [...raw.cells] };
}
export function createSearch(raw) {
  let grid;
  try { grid = validateGrid(raw); } catch (error) {
    return { status: 'INVALID_INPUT', path: [], cost: 0, expanded: 0, message: error.message, step() { return null; } };
  }
  const { width, start, goal, cells, budget } = grid;
  const distance = (a, b) => Math.abs(a % width - b % width) + Math.abs(Math.floor(a / width) - Math.floor(b / width));
  const minimum = Math.min(...cells.filter(value => value > 0));
  let order = 0;
  const frontier = new Map([[start, { priority: distance(start, goal) * minimum, order: order++ }]]);
  const costs = new Map([[start, 0]]), parents = new Map(), closed = new Set();
  const state = {
    status: start === goal ? 'FOUND' : 'READY', path: start === goal ? [start] : [], cost: 0, expanded: 0, message: '',
    step() {
      if (state.status !== 'READY' && state.status !== 'RUNNING') return null;
      state.status = 'RUNNING';
      let current = -1, best = { priority: Infinity, order: Infinity };
      for (const [id, entry] of frontier) if (entry.priority < best.priority || entry.priority === best.priority && entry.order < best.order) { current = id; best = entry; }
      if (current < 0) { state.status = 'PROVED_UNREACHABLE'; return null; }
      if (state.expanded >= budget) { state.status = 'BUDGET_EXHAUSTED'; return null; }
      frontier.delete(current); closed.add(current); state.expanded++;
      const event = { node: current, opened: [], expanded: state.expanded };
      if (current === goal) {
        state.path = [goal];
        while (state.path[0] !== start) state.path.unshift(parents.get(state.path[0]));
        state.cost = costs.get(goal); state.status = 'FOUND';
        return event;
      }
      const x = current % width, y = Math.floor(current / width);
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const nx = x + dx, ny = y + dy, next = ny * width + nx;
        if (nx < 0 || nx >= width || ny < 0 || ny >= grid.height || cells[next] === 0) continue;
        const proposed = costs.get(current) + cells[next];
        if (proposed >= (costs.get(next) ?? Infinity)) continue;
        parents.set(next, current); costs.set(next, proposed); closed.delete(next);
        frontier.set(next, { priority: proposed + distance(next, goal) * minimum, order: order++ });
        event.opened.push(next);
      }
      if (!frontier.size) state.status = 'PROVED_UNREACHABLE';
      return event;
    }
  };
  return state;
}
export function runSearch(grid) {
  const search = createSearch(grid), events = [];
  while (['READY', 'RUNNING'].includes(search.status)) { const event = search.step(); if (event) events.push(event); }
  return { status: search.status, path: search.path, cost: search.cost, expanded: search.expanded, events };
}
export function gridPreset(name = 'passage') {
  const width = 8, height = 8, cells = Array(64).fill(1);
  if (name !== 'empty') for (let y = 0; y < 8; y++) if (y !== 5) cells[y * width + 4] = 0;
  if (name === 'weighted') for (let x = 1; x < 7; x++) cells[3 * width + x] = 6;
  if (name === 'unreachable') cells[5 * width + 4] = 0;
  return { width, height, cells, start: 9, goal: 54, budget: 1024 };
}
