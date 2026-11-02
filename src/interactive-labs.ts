import { NUMERIC_DEFAULTS, NUMERIC_FIELDS, DECK_DEFAULTS, DECK_FIELDS, calculateNumeric, numericDocument, readNumericDocument, deckInput, LAB_VERSION } from './labs/models.js';
import { createSearch, gridPreset, validateGrid } from './labs/pathfinding.js';

type Parameters = Record<string, number>;
type Snapshots = { A: Parameters | null; B: Parameters | null };
let numericSession: { current: Parameters; snapshots: Snapshots } = { current: { ...NUMERIC_DEFAULTS }, snapshots: { A: null, B: null } };
const format = (value: number) => Math.abs(value) >= 1e9 ? value.toExponential(3) : new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 3 }).format(value);
const percent = (value: number) => value > 0 && value < .000001 ? `${(value * 100).toExponential(3)}%` : `${(value * 100).toFixed(4)}%`;
const reason = (error: unknown) => error instanceof Error ? error.message : '操作未完成，请检查输入后重试。';

class InteractiveLab {
    private lifetime = new AbortController();
    private worker: Worker | null = null;
    private timer: number | null = null;
    private deadline: number | null = null;
    private grid = gridPreset();
    private search: ReturnType<typeof createSearch> | null = null;
    private explored = new Set<number>();
    private frontier = new Set<number>();
    private playing = false;
    private dragging = false;
    private lastPainted = -1;
    private deckResults: any[] | null = null;
    readonly kind: string;
    constructor(readonly root: HTMLElement) {
        this.kind = root.dataset.interactiveLab ?? '';
        this.on(root, 'click', (event) => {
            const action = (event.target as Element).closest<HTMLElement>('[data-action]')?.dataset.action;
            if (action) this.action(action);
        });
        this.on(document, 'visibilitychange', () => {
            if (document.hidden) {
                this.pause();
                if (this.worker) { this.stopWorker(); this.status('计算已暂停，回到页面后可重新计算。'); }
            }
        });
        if (this.kind === 'numeric') this.initNumeric();
        if (this.kind === 'deck') this.initDeck();
        if (this.kind === 'path') this.initPath();
    }
    get disposed(): boolean { return this.lifetime.signal.aborted; }
    private on(target: EventTarget, event: string, listener: (event: Event) => void): void { target.addEventListener(event, listener, { signal: this.lifetime.signal }); }
    private find<T extends HTMLElement = HTMLElement>(selector: string): T { return this.root.querySelector<T>(selector)!; }
    private status(message: string, error = false): void { const node = this.find('[data-status]'); node.textContent = message; node.dataset.error = String(error); }
    private read(fields: readonly any[][], prefix = ''): Parameters {
        return Object.fromEntries(fields.map(([key]) => { const value = this.find<HTMLInputElement>(`#${prefix}${key}`).value; return [key, value.trim() ? Number(value) : NaN]; }));
    }
    private fill(input: Parameters, prefix = ''): void { for (const [key, value] of Object.entries(input)) this.find<HTMLInputElement>(`#${prefix}${key}`).value = String(value); }
    private download(name: string, value: unknown): void {
        const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a'); link.href = url; link.download = name; link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
    }
    private initNumeric(): void {
        this.fill(numericSession.current);
        this.on(this.find('[data-numeric-form]'), 'submit', event => { event.preventDefault(); this.numeric(); });
        this.on(this.find('[data-numeric-form]'), 'input', () => this.numeric());
        this.on(this.find('[data-import-file]'), 'change', async () => {
            const file = this.find<HTMLInputElement>('[data-import-file]').files?.[0];
            if (!file) return;
            if (file.size > 32768) { this.find('[data-config-status]').textContent = '配置文件最大为 32 KiB。'; return; }
            try { const text = await file.text(); if (!this.disposed && this.root.isConnected) this.importNumeric(text); }
            catch { if (!this.disposed) this.find('[data-config-status]').textContent = '无法读取文件，请重新选择。'; }
            this.find<HTMLInputElement>('[data-import-file]').value = '';
        });
        this.numeric(); this.comparison();
    }
    private numeric(): Parameters | null {
        this.root.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
        try {
            const input = this.read(NUMERIC_FIELDS), result = calculateNumeric(input);
            numericSession.current = { ...input };
            this.find('[data-numeric-results]').innerHTML = `<dl class="lab-metrics"><div><dt>单次期望伤害</dt><dd>${format(result.singleDamage)}</dd></div><div><dt>总伤害</dt><dd>${format(result.totalDamage)}</dd></div><div><dt>DPS / 每秒伤害</dt><dd>${format(result.dps)}</dd></div></dl><p>${format(input.hitCount)} 次命中 / ${format(input.windowSeconds)} 秒；基础伤害 ${format(result.base)}。</p>`;
            this.status('已按当前参数计算。'); return input;
        } catch (error) {
            const field = (error as { field?: string }).field;
            if (field) this.root.querySelector(`#${field}`)?.setAttribute('aria-invalid', 'true');
            this.find('[data-numeric-results]').textContent = '修正参数后显示计算结果。'; this.status(reason(error), true); return null;
        }
    }
    private comparison(): void {
        const { A, B } = numericSession.snapshots;
        const target = this.find('[data-numeric-comparison]');
        if (!A && !B) { target.textContent = '尚未保存方案。'; return; }
        const a = A ? calculateNumeric(A) : null, b = B ? calculateNumeric(B) : null;
        const max = Math.max(a?.dps ?? 0, b?.dps ?? 0, 1);
        target.innerHTML = `<table><caption>保存的实验快照</caption><thead><tr><th scope="col">指标</th><th scope="col">方案 A</th><th scope="col">方案 B</th><th scope="col">B − A</th></tr></thead><tbody>${[['singleDamage', '单次伤害'], ['totalDamage', '总伤害'], ['dps', 'DPS']].map(([key, label]) => `<tr><th scope="row">${label}</th><td>${a ? format((a as any)[key]) : '未保存'}</td><td>${b ? format((b as any)[key]) : '未保存'}</td><td>${a && b ? format((b as any)[key] - (a as any)[key]) : '—'}</td></tr>`).join('')}</tbody></table>${[['A', a], ['B', b]].map(([label, value]) => value ? `<div class="lab-compare-bar"><strong>${label}</strong><meter min="0" max="${max}" value="${(value as any).dps}" aria-label="方案 ${label} 的 DPS">${format((value as any).dps)}</meter><span>${format((value as any).dps)}</span></div>` : '').join('')}`;
    }
    private importNumeric(text: string): void {
        try {
            const document = readNumericDocument(text);
            numericSession = { current: document.parameters, snapshots: document.snapshots };
            this.fill(numericSession.current); this.numeric(); this.comparison();
            this.find('[data-config-status]').textContent = '已恢复当前参数与 A/B 快照。';
        } catch (error) { this.find('[data-config-status]').textContent = `导入失败：${reason(error)} 原实验保持不变。`; }
    }
    private initDeck(): void {
        this.on(this.find('[data-deck-form]'), 'submit', event => { event.preventDefault(); this.deck(); });
        this.on(this.find('[data-deck-form]'), 'input', () => { this.stopWorker(); this.deckResults = null; this.find('[data-deck-results]').textContent = ''; this.deckModes(); this.status('参数已变化，点击“计算概率”更新结果。'); });
        this.deckModes(); this.deck();
    }
    private deckModes(): void {
        for (let i = 0; i < 2; i++) this.find(`[data-deck-mode="${i}"]`).textContent = Number(this.find<HTMLInputElement>(`#scenario-${i}-categoryB`).value) > 0 ? '双类：同时达到 A、B 的最低张数。' : '单类：B 为 0，忽略 B 的最低张数。';
    }
    private stopWorker(): void {
        this.worker?.terminate(); this.worker = null;
        if (this.deadline !== null) window.clearTimeout(this.deadline);
        this.deadline = null;
        if (this.kind === 'deck') this.find<HTMLButtonElement>('button[type="submit"]').disabled = false;
    }
    private deck(): void {
        this.stopWorker(); this.deckResults = null; this.find('[data-deck-results]').textContent = '';
        try {
            const scenarios = [0, 1].map(i => deckInput(this.read(DECK_FIELDS, `scenario-${i}-`)));
            this.deckModes(); this.status('正在计算组合概率…');
            this.find<HTMLButtonElement>('button[type="submit"]').disabled = true;
            const worker = new Worker(new URL('./labs/deck-worker.js', import.meta.url), { type: 'module' });
            this.worker = worker;
            worker.onmessage = event => {
                if (this.worker !== worker || !this.root.isConnected || this.disposed) { worker.terminate(); return; }
                this.stopWorker();
                if (event.data.error) { this.status(event.data.error, true); return; }
                this.deckResults = event.data.results; this.renderDeck(); this.status('计算完成：无放回组合概率。');
            };
            worker.onerror = () => { if (this.worker === worker) { this.stopWorker(); this.status('计算未完成，请重试或减小输入。', true); } };
            this.deadline = window.setTimeout(() => { this.stopWorker(); this.status('本次计算达到 5 秒上限，请减小牌库或抽牌区间。', true); }, 5000);
            worker.postMessage(scenarios);
        } catch (error) { this.stopWorker(); this.status(reason(error), true); }
    }
    private renderDeck(): void {
        const [a, b] = this.deckResults!;
        const maximumDraws = Math.max(a.input.openingHand + a.input.laterDraws, b.input.openingHand + b.input.laterDraws, 1);
        const points = (result: any) => result.progression.map((point: any) => `${20 + point.draws / maximumDraws * 440},${180 - point.probability * 160}`).join(' ');
        const markers = (result: any, series: string) => result.progression.map((point: any) => `<circle class="chart-${series}" cx="${20 + point.draws / maximumDraws * 440}" cy="${180 - point.probability * 160}" r="3"/>`).join('');
        this.find('[data-deck-results]').innerHTML = `<table><caption>达到目标的概率</caption><thead><tr><th scope="col">阶段</th><th scope="col">方案 A</th><th scope="col">方案 B</th></tr></thead><tbody><tr><th scope="row">起手</th><td>${percent(a.opening)}</td><td>${percent(b.opening)}</td></tr><tr><th scope="row">累计抽牌</th><td>${percent(a.final)}</td><td>${percent(b.final)}</td></tr></tbody></table><p>累计概率差 B − A：<strong>${format((b.final - a.final) * 100)} 个百分点</strong>。</p><svg class="lab-chart" viewBox="0 0 480 200" role="img" aria-label="累计抽牌概率曲线，方案 A 实线、方案 B 虚线；数值见下表"><path class="chart-axis" d="M20 20 V180 H460"/><polyline class="chart-a" points="${points(a)}"/><polyline class="chart-b" points="${points(b)}"/>${markers(a, 'a')}${markers(b, 'b')}</svg><p>横轴：累计抽牌 0–${maximumDraws} 张；纵轴：概率 0–100%。A 为实线，B 为虚线。</p><details><summary>查看曲线数值</summary><table><caption>曲线采样点（最多 25 点 / 方案）</caption><thead><tr><th scope="col">方案</th><th scope="col">累计张数</th><th scope="col">概率</th></tr></thead><tbody>${[a, b].map((result, i) => result.progression.map((point: any) => `<tr><th scope="row">${i === 0 ? 'A' : 'B'}</th><td>${point.draws}</td><td>${percent(point.probability)}</td></tr>`).join('')).join('')}</tbody></table></details>`;
    }
    private initPath(): void {
        this.renderGrid(); this.pathStatus('编辑地图，或直接开始搜索。');
        const grid = this.find('[data-grid]');
        this.on(grid, 'focusin', event => {
            const cell = (event.target as Element).closest<HTMLElement>('[data-cell]');
            if (cell) grid.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.tabIndex = button === cell ? 0 : -1; });
        });
        this.on(grid, 'pointerdown', event => {
            const pointer = event as PointerEvent;
            if (pointer.button !== 0) return;
            const cell = (event.target as Element).closest<HTMLElement>('[data-cell]');
            if (cell) { event.preventDefault(); this.dragging = true; this.lastPainted = -1; cell.focus({ preventScroll: true }); this.paint(Number(cell.dataset.cell)); }
        });
        this.on(window, 'pointerup', () => { this.dragging = false; this.lastPainted = -1; });
        this.on(window, 'pointercancel', () => { this.dragging = false; });
        this.on(grid, 'pointermove', event => {
            if (!this.dragging) return;
            event.preventDefault();
            const pointer = event as PointerEvent;
            const cell = document.elementFromPoint(pointer.clientX, pointer.clientY)?.closest<HTMLElement>('[data-cell]');
            if (cell && grid.contains(cell)) this.paint(Number(cell.dataset.cell));
        });
        this.on(grid, 'keydown', event => {
            const key = event as KeyboardEvent, cell = (key.target as Element).closest<HTMLElement>('[data-cell]');
            if (!cell) return;
            const id = Number(cell.dataset.cell), delta = { ArrowDown: 8, ArrowUp: -8, ArrowLeft: -1, ArrowRight: 1 }[key.key];
            if (delta !== undefined) {
                key.preventDefault(); const next = id + delta;
                if (next >= 0 && next < 64 && (Math.abs(delta) === 8 || Math.floor(next / 8) === Math.floor(id / 8))) { cell.tabIndex = -1; const target = this.find<HTMLElement>(`[data-cell="${next}"]`); target.tabIndex = 0; target.focus(); }
            } else if (key.key === ' ' || key.key === 'Enter') { key.preventDefault(); this.lastPainted = -1; this.paint(id); }
        });
        this.on(this.find('[data-map-preset]'), 'change', () => { this.resetSearch(); this.grid = gridPreset(this.find<HTMLSelectElement>('[data-map-preset]').value); this.renderGrid(); this.pathStatus('已载入预设，可以继续编辑。'); });
        this.on(this.find('#search-budget'), 'input', () => { this.resetSearch(); this.pathStatus('预算已更新，重新运行后生效。'); });
        this.on(this.find('[data-speed]'), 'change', () => { if (this.playing) { this.pause(); this.run(); } });
    }
    private paint(id: number): void {
        if (id === this.lastPainted) return; this.lastPainted = id;
        const tool = this.find<HTMLSelectElement>('[data-map-tool]').value;
        if (tool === 'wall' && [this.grid.start, this.grid.goal].includes(id)) { this.pathStatus('起终点不能直接设为障碍，请先移动端点。'); return; }
        this.resetSearch();
        if (tool === 'start' || tool === 'goal') { this.grid[tool] = id; this.grid.cells[id] = Math.max(1, this.grid.cells[id]); }
        else this.grid.cells[id] = tool === 'wall' ? 0 : tool === 'weight' ? 6 : 1;
        this.renderGrid(); this.pathStatus('地图已更新，旧搜索已清除。');
    }
    private renderGrid(): void {
        const grid = this.find('[data-grid]');
        if (!grid.children.length) grid.innerHTML = this.grid.cells.map((_value: number, id: number) => `<button type="button" class="lab-cell" data-cell="${id}" tabindex="${id === this.grid.start ? '0' : '-1'}"></button>`).join('');
        const path = new Set(this.search?.path ?? []);
        this.grid.cells.forEach((weight: number, id: number) => {
            const state = id === this.grid.start ? 'start' : id === this.grid.goal ? 'goal' : weight === 0 ? 'wall' : path.has(id) ? 'path' : this.explored.has(id) ? 'visited' : this.frontier.has(id) ? 'open' : 'empty';
            const cell = grid.children[id] as HTMLButtonElement;
            cell.dataset.state = state;
            cell.textContent = ({ start: 'S', goal: 'G', wall: '#', path: '◆', visited: '×', open: '○' } as Record<string, string>)[state] ?? (weight > 1 ? String(weight) : '·');
            cell.setAttribute('aria-label', `第 ${id % 8 + 1} 列、第 ${Math.floor(id / 8) + 1} 行，${({ start: '起点', goal: '终点', wall: '障碍', path: '路径', visited: '已探索', open: '待探索', empty: '未探索' } as Record<string, string>)[state]}，进入代价 ${weight}`);
        });
    }
    private pathStatus(message?: string): void {
        const labels: Record<string, string> = { FOUND: '找到路径', PROVED_UNREACHABLE: '已证明无路径', BUDGET_EXHAUSTED: '预算耗尽，尚无结论', INVALID_INPUT: '配置无效', READY: '已就绪', RUNNING: this.playing ? '正在探索' : '已暂停' };
        this.status(message ?? `${labels[this.search?.status ?? 'READY']} · ${this.search?.status ?? 'READY'}${this.search?.message ? `：${this.search.message}` : ''}`, this.search?.status === 'INVALID_INPUT');
        this.find('[data-path-metrics]').innerHTML = `<div><dt>扩展节点</dt><dd>${this.search?.expanded ?? 0}</dd></div><div><dt>路径代价</dt><dd>${this.search?.status === 'FOUND' ? this.search.cost : '—'}</dd></div><div><dt>路径格数</dt><dd>${this.search?.path.length ?? 0}</dd></div>`;
        this.find('[data-path-text]').textContent = this.search?.status === 'FOUND' ? `路径：${this.search.path.map((id: number) => `(${id % 8 + 1},${Math.floor(id / 8) + 1})`).join(' → ')}` : '坐标从左上角 (1,1) 开始；失败结果不包含完整路径。';
    }
    private resetSearch(): void { this.pause(); this.search = null; this.explored.clear(); this.frontier.clear(); }
    private pause(): void { this.playing = false; if (this.timer !== null) window.clearTimeout(this.timer); this.timer = null; if (this.kind === 'path') this.pathStatus(); }
    private step(): void {
        if (!this.search) this.search = createSearch({ ...this.grid, budget: Number(this.find<HTMLInputElement>('#search-budget').value) });
        const event = this.search.step();
        if (event) { this.explored.add(event.node); this.frontier.delete(event.node); event.opened.forEach((id: number) => this.frontier.add(id)); }
        if (!['READY', 'RUNNING'].includes(this.search.status)) this.pause();
        this.renderGrid(); this.pathStatus();
    }
    private run(): void {
        if (this.playing) return;
        this.playing = true;
        const advance = () => {
            if (!this.root.isConnected || this.disposed) { this.dispose(); return; }
            if (!this.playing || document.hidden) { this.pause(); return; }
            this.step();
            if (this.playing) this.timer = window.setTimeout(advance, Number(this.find<HTMLSelectElement>('[data-speed]').value));
        };
        advance();
    }
    private action(action: string): void {
        if (action === 'numeric-reset') { numericSession = { current: { ...NUMERIC_DEFAULTS }, snapshots: { A: null, B: null } }; this.fill(numericSession.current); this.numeric(); this.comparison(); this.find('[data-config-status]').textContent = '已恢复默认并清空快照。'; }
        if (action === 'save-a' || action === 'save-b') { const input = this.numeric(); if (input) { numericSession.snapshots[action === 'save-a' ? 'A' : 'B'] = { ...input }; this.comparison(); this.status(`已保存方案 ${action === 'save-a' ? 'A' : 'B'}。`); } }
        if (action === 'numeric-import') this.importNumeric(this.find<HTMLTextAreaElement>('[data-import-text]').value);
        if (action === 'numeric-export' || action === 'numeric-copy') {
            const input = this.numeric(); if (!input) return;
            const config = numericDocument(input, numericSession.snapshots);
            if (action === 'numeric-export') { this.download('numeric-experiment.json', config); this.find('[data-config-status]').textContent = '实验 JSON 已下载。'; }
            else {
                const text = JSON.stringify(config, null, 2); this.find<HTMLTextAreaElement>('[data-import-text]').value = text;
                void navigator.clipboard?.writeText(text).then(() => { if (!this.disposed) this.find('[data-config-status]').textContent = '实验 JSON 已复制。'; }).catch(() => {});
                this.find('[data-config-status]').textContent = '配置已填入下方文本框；也可选中并手动复制。';
            }
        }
        if (action === 'deck-reset') { this.stopWorker(); for (let i = 0; i < 2; i++) this.fill({ ...DECK_DEFAULTS, categoryA: i ? 3 : 2 }, `scenario-${i}-`); this.deck(); }
        if (action === 'deck-export') {
            try { const scenarios = [0, 1].map(i => { const input = deckInput(this.read(DECK_FIELDS, `scenario-${i}-`)); return { ...input, mode: input.categoryB > 0 ? 'two-disjoint' : 'single' }; }); this.download('deck-experiment.json', { formatVersion: 1, demoVersion: LAB_VERSION, modelVersion: 1, scenarios }); }
            catch (error) { this.status(reason(error), true); }
        }
        if (action === 'run') this.run();
        if (action === 'step') { this.pause(); this.step(); }
        if (action === 'pause') this.pause();
        if (action === 'path-reset') { this.resetSearch(); this.renderGrid(); this.pathStatus('搜索已重置，地图保留。'); }
        if (action === 'path-clear') { this.resetSearch(); this.grid = gridPreset('empty'); this.find<HTMLSelectElement>('[data-map-preset]').value = 'empty'; this.renderGrid(); this.pathStatus('地图已清空。'); }
        if (action === 'path-export') {
            try { const grid = validateGrid({ ...this.grid, budget: Number(this.find<HTMLInputElement>('#search-budget').value) }); this.download('pathfinding-map.json', { formatVersion: 1, demoVersion: LAB_VERSION, algorithm: 'four-way-astar', ...grid }); }
            catch (error) { this.status(reason(error), true); }
        }
    }
    dispose(): void { if (this.disposed) return; this.pause(); this.stopWorker(); this.lifetime.abort(); }
}
let active: InteractiveLab | null = null;
function connect(): void {
    const root = document.querySelector<HTMLElement>('[data-interactive-lab]');
    if (root === active?.root && !active?.disposed) return;
    active?.dispose(); active = root ? new InteractiveLab(root) : null;
}
document.addEventListener('site:navigation-complete', connect);
window.addEventListener('pagehide', () => active?.dispose());
window.addEventListener('pageshow', connect);
if (!document.documentElement.hasAttribute('data-site-navigating')) connect();
