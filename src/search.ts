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
    projectId: string | null;
}
interface SearchIndex { schemaVersion: number; totalCount: number; documents: SearchDocument[]; }
interface SearchableDocument { doc: SearchDocument; fields: string[]; }
const LABELS: Record<SearchDocument['type'], string> = {
    project: '项目', article: '文章', framework: 'Framework', research: '研究', page: '页面'
};
const ORDER: SearchDocument['type'][] = ['project', 'article', 'framework', 'research', 'page'];

export class SiteSearch {
    private dialog = document.querySelector<HTMLDialogElement>('[data-site-search]');
    private input = this.dialog?.querySelector<HTMLInputElement>('[data-search-input]');
    private results = this.dialog?.querySelector<HTMLElement>('[data-search-results]');
    private status = this.dialog?.querySelector<HTMLElement>('[data-search-status]');
    private index: SearchIndex | null = null;
    private searchable: SearchableDocument[] = [];
    private loading: Promise<void> | null = null;
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
            this.render();
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
        this.render();
        void this.load();
    }

    private close(): void {
        this.dialog?.close();
        this.trigger?.focus();
    }

    private async load(): Promise<void> {
        if (this.index || this.loading) return this.loading ?? Promise.resolve();
        const path = this.dialog?.dataset.searchIndex;
        if (!path) return;
        this.loading = (async () => {
            try {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`Search index HTTP ${response.status}`);
                const data = await response.json() as SearchIndex;
                if (data.schemaVersion !== 1 || !Array.isArray(data.documents) || data.documents.length !== data.totalCount) {
                    throw new Error('Invalid site search index');
                }
                this.searchable = data.documents.map((doc) => ({
                    doc,
                    fields: [doc.title, doc.keywords.join(' '), doc.tags.join(' '), doc.series, doc.summary]
                        .map((value) => value.normalize('NFKC').toLocaleLowerCase('zh-CN'))
                }));
                this.index = data;
                this.render();
            } catch {
                if (this.status) this.status.textContent = '搜索暂时不可用，请使用主导航或下方的研究资料库入口。';
            } finally { this.loading = null; }
        })();
        return this.loading;
    }

    private rank(query: string): SearchDocument[] {
        if (!this.index) return [];
        const terms = query.normalize('NFKC').toLocaleLowerCase('zh-CN').trim().split(/\s+/u).filter(Boolean);
        if (!terms.length) return this.index.documents.filter((entry) => entry.type === 'project').slice(0, 8);
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
        if (!this.results || !this.status || !this.input || !this.index) return;
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
