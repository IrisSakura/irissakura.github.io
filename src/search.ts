import { analytics } from './analytics.js';

interface SearchDocument {
    id: string;
    type: 'page' | 'article' | 'research' | 'project' | 'framework';
    title: string;
    summary: string;
    url: string;
    keywords: string[];
    tags: string[];
    series: string;
    projectId?: string | null;
}
interface SearchIndex { schemaVersion: number; totalCount: number; documents: SearchDocument[]; }
interface SearchManifest {
    schemaVersion: number;
    totalCount: number;
    suggestions: SearchDocument[];
    parts: string[];
}
interface SearchableDocument { doc: SearchDocument; fields: string[]; }
const manifestUrl = new URL('./site-search/index.json', import.meta.url);
const LABELS: Record<SearchDocument['type'], string> = {
    project: '项目', article: '文章', framework: 'Framework', research: '研究', page: '页面'
};
const ORDER: SearchDocument['type'][] = ['project', 'article', 'framework', 'research', 'page'];

export class SiteSearch {
    private dialog = document.querySelector<HTMLDialogElement>('[data-site-search]');
    private input = this.dialog?.querySelector<HTMLInputElement>('[data-search-input]');
    private results = this.dialog?.querySelector<HTMLElement>('[data-search-results]');
    private status = this.dialog?.querySelector<HTMLElement>('[data-search-status]');
    private manifest: SearchManifest | null = null;
    private suggestions: SearchDocument[] | null = null;
    private searchable: SearchableDocument[] | null = null;
    private loading = false;
    private loadFailed = false;
    private trigger: HTMLElement | null = null;
    private debounce: number | null = null;

    setup(): void {
        if (!this.dialog || !this.input || !this.results || !this.status) return;
        document.addEventListener('click', (event) => {
            const target = event.target as Element | null;
            const opener = target?.closest<HTMLElement>('[data-search-open]');
            if (opener) { this.open(opener); return; }
            if (target?.closest('[data-search-close]')) this.close();
        });
        document.addEventListener('keydown', (event) => {
            if (event.isComposing) return;
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                if (!this.dialog?.open) this.open(document.activeElement as HTMLElement);
                else this.input?.focus();
            }
        });
        // close() restores focus synchronously. An asynchronous close listener
        // would steal focus back after a link has focused its destination.
        this.dialog.addEventListener('keydown', (event) => this.onKeyDown(event));
        this.input.addEventListener('input', () => {
            this.update();
            if (this.debounce !== null) window.clearTimeout(this.debounce);
            this.debounce = window.setTimeout(() => {
                analytics.trackEvent('navigation.search_query', {
                    queryLength: this.input?.value.trim().length ?? 0,
                    resultCount: this.rank(this.input?.value ?? '').length
                });
            }, 350);
        });
        this.dialog.addEventListener('click', (event) => {
            const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
            if (!link) return;
            if (link.hasAttribute('data-search-result')) {
                analytics.trackEvent('navigation.search_result_open', { contentType: link.dataset.type ?? 'page' });
            }
            this.close();
        });
    }

    private open(trigger: HTMLElement): void {
        if (!this.dialog || !this.input) return;
        this.trigger = trigger;
        this.dialog.showModal();
        this.input.focus();
        analytics.trackEvent('navigation.search_open');
        if (this.loadFailed) {
            this.loadFailed = false;
            this.manifest = null;
            this.suggestions = null;
        }
        this.update();
    }

    private close(): void {
        this.dialog?.close();
        this.trigger?.focus();
    }

    private update(): void {
        if (!this.dialog?.open) return;
        this.render();
        if (!this.loading && !this.loadFailed && (!this.suggestions || (this.input?.value.trim() && !this.searchable))) {
            void this.load();
        }
    }

    private async load(): Promise<void> {
        this.loading = true;
        try {
            if (!this.suggestions) await this.loadManifest();
            if (this.manifest && this.dialog?.open && this.input?.value.trim() && !this.searchable) {
                const { parts, totalCount } = this.manifest;
                const shards = await Promise.all(parts.map(async (name) => {
                    const response = await fetch(new URL(name, manifestUrl));
                    if (!response.ok) throw new Error(`Search part HTTP ${response.status}`);
                    const data = await response.json();
                    if (!Array.isArray(data)) throw new Error('Invalid site search part');
                    return data as SearchDocument[];
                }));
                const documents = shards.flat();
                if (documents.length !== totalCount || new Set(documents.map(({ id }) => id)).size !== totalCount) {
                    throw new Error('Incomplete site search index');
                }
                this.indexDocuments(documents);
            }
        } catch {
            this.loadFailed = true;
        } finally {
            this.loading = false;
            this.update();
        }
    }

    private async loadManifest(): Promise<void> {
        const response = await fetch(manifestUrl, { cache: 'no-cache' });
        const legacyUrl = this.dialog?.dataset.searchIndex;
        if (response.status === 404 && legacyUrl) {
            const legacy = await fetch(legacyUrl);
            if (!legacy.ok) throw new Error(`Search index HTTP ${legacy.status}`);
            const data = await legacy.json() as SearchIndex;
            if (data.schemaVersion !== 1 || !Array.isArray(data.documents) || data.documents.length !== data.totalCount) {
                throw new Error('Invalid site search index');
            }
            this.indexDocuments(data.documents);
            this.suggestions = data.documents.filter(({ type }) => type === 'project').slice(0, 8);
            return;
        }
        if (!response.ok) throw new Error(`Search manifest HTTP ${response.status}`);
        const data = await response.json() as SearchManifest;
        if (data.schemaVersion !== 1 || !Number.isSafeInteger(data.totalCount) || data.totalCount < 0
            || !Array.isArray(data.suggestions) || data.suggestions.length > 8
            || !Array.isArray(data.parts) || !data.parts.every((name) => /^part-[a-f0-9]{64}\.json$/u.test(name))
            || new Set(data.parts).size !== data.parts.length) {
            throw new Error('Invalid site search manifest');
        }
        this.manifest = data;
        this.suggestions = data.suggestions;
    }

    private indexDocuments(documents: SearchDocument[]): void {
        this.searchable = documents.map((doc) => ({
            doc,
            fields: [doc.title, doc.keywords.join(' '), doc.tags.join(' '), doc.series, doc.summary]
                .map((value) => value.normalize('NFKC').toLocaleLowerCase('zh-CN'))
        }));
    }

    private rank(query: string): SearchDocument[] {
        const terms = query.normalize('NFKC').toLocaleLowerCase('zh-CN').trim().split(/\s+/u).filter(Boolean);
        if (!terms.length) return this.suggestions ?? [];
        if (!this.searchable) return [];
        const scored = this.searchable.map(({ doc, fields }) => {
            if (!terms.every((term) => fields.some((value) => value.includes(term)))) return { doc, score: 0 };
            const score = terms.reduce((sum, term) => sum + Math.max(
                fields[0] === term ? 120 : 0, fields[0].startsWith(term) ? 90 : 0,
                fields[0].includes(term) ? 70 : 0, fields[1].includes(term) ? 55 : 0,
                fields[2].includes(term) ? 45 : 0, fields[3].includes(term) ? 35 : 0,
                fields[4].includes(term) ? 15 : 0
            ), 0);
            return { doc, score };
        });
        return scored.filter((entry) => entry.score > 0)
            .sort((left, right) => right.score - left.score || left.doc.id.localeCompare(right.doc.id, 'en'))
            .map((entry) => entry.doc);
    }

    private render(): void {
        if (!this.results || !this.status || !this.input) return;
        if (this.input.value.trim() ? !this.searchable : !this.suggestions) {
            this.results.replaceChildren();
            this.status.textContent = this.loadFailed
                ? '搜索暂时不可用，请使用主导航或下方的研究资料库入口。'
                : '正在加载搜索内容…';
            return;
        }
        const matches = this.rank(this.input.value);
        this.results.replaceChildren();
        if (!matches.length) {
            const empty = document.createElement('p');
            empty.textContent = '没有找到匹配内容。试试项目名称、英文术语或更短的中文词。';
            this.results.append(empty);
            this.status.textContent = '没有找到结果。';
            return;
        }
        const shown = matches.slice(0, 16);
        const fragment = document.createDocumentFragment();
        for (const type of ORDER) {
            const group = shown.filter((entry) => entry.type === type);
            if (!group.length) continue;
            const section = document.createElement('section');
            const heading = document.createElement('h3');
            heading.textContent = LABELS[type];
            section.append(heading);
            for (const entry of group) {
                const link = document.createElement('a');
                link.href = entry.url;
                link.dataset.searchResult = entry.id;
                link.dataset.type = entry.type;
                const title = document.createElement('strong');
                title.textContent = entry.title;
                const summary = document.createElement('span');
                summary.textContent = entry.summary;
                link.append(title, summary);
                section.append(link);
            }
            fragment.append(section);
        }
        this.results.replaceChildren(fragment);
        this.status.textContent = this.input.value.trim()
            ? `找到 ${matches.length} 项，显示前 ${shown.length} 项。`
            : '热门项目与内容入口。输入关键词可检索全站。';
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.isComposing || !this.dialog?.open || !this.results) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            this.close();
            return;
        }
        const links = [...this.results.querySelectorAll<HTMLAnchorElement>('a[data-search-result]')];
        const current = links.indexOf(document.activeElement as HTMLAnchorElement);
        if (event.key === 'ArrowDown' && links.length) {
            event.preventDefault();
            links[(current + 1) % links.length].focus();
        } else if (event.key === 'ArrowUp' && links.length) {
            event.preventDefault();
            if (current <= 0) this.input?.focus();
            else links[current - 1].focus();
        } else if (event.key === 'Enter' && document.activeElement === this.input && links.length) {
            event.preventDefault();
            links[0].click();
        }
    }
}
