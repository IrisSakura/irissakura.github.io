interface FrameworkSummary {
    packageCount: number;
    catalogModuleCount: number;
    presetCount: number;
    profileCount: number;
    asmdefCount: number;
}

interface FrameworkLayer {
    id: string;
    description: string;
    packageCount: number;
}

interface FrameworkModule {
    id: string;
    displayName: string;
    description: string;
}

interface FrameworkPublicData {
    schemaVersion: number;
    sourceCommit: string;
    generatedAt: string;
    summary: FrameworkSummary;
    lifecycleCounts: Record<string, number>;
    layers: FrameworkLayer[];
    featuredModules: FrameworkModule[];
}

class FrameworkPage {
    private mobileToggle: HTMLElement | null = null;
    private navMenu: HTMLElement | null = null;

    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    private init(): void {
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.setCurrentYear();
        this.setupEventListeners();
        void this.loadFrameworkData();
    }

    private isNonNegativeInteger(value: unknown): value is number {
        return Number.isInteger(value) && (value as number) >= 0;
    }

    private validateFrameworkData(value: unknown): value is FrameworkPublicData {
        if (!value || typeof value !== 'object') return false;
        const data = value as Partial<FrameworkPublicData>;
        if (data.schemaVersion !== 1 || typeof data.sourceCommit !== 'string' || Number.isNaN(Date.parse(data.generatedAt ?? ''))) return false;
        if (!data.summary || typeof data.summary !== 'object') return false;
        const summary = data.summary as Partial<FrameworkSummary>;
        for (const key of ['packageCount', 'catalogModuleCount', 'presetCount', 'profileCount', 'asmdefCount'] as const) {
            if (!this.isNonNegativeInteger(summary[key])) return false;
        }
        if (!data.lifecycleCounts || typeof data.lifecycleCounts !== 'object') return false;
        if (!Object.values(data.lifecycleCounts).every(value => this.isNonNegativeInteger(value))) return false;
        if (!Array.isArray(data.layers) || !data.layers.every(layer =>
            layer && typeof layer.id === 'string' && typeof layer.description === 'string' && this.isNonNegativeInteger(layer.packageCount))) return false;
        if (!Array.isArray(data.featuredModules) || !data.featuredModules.every(module =>
            module && typeof module.id === 'string' && typeof module.displayName === 'string' && typeof module.description === 'string')) return false;
        return true;
    }

    private async loadFrameworkData(): Promise<void> {
        const status = document.getElementById('framework-data-status');
        try {
            const response = await fetch('../data/framework.json', { cache: 'no-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const payload: unknown = await response.json();
            if (!this.validateFrameworkData(payload)) throw new Error('invalid public data contract');
            this.renderFrameworkData(payload);
            if (status) status.textContent = '已加载由框架权威清单生成的公开快照。';
        } catch (error) {
            if (status) status.textContent = '实时数据暂不可用，当前展示仓库内置的静态快照。';
            console.error('[framework-data] failed to load public framework snapshot', error);
        }
    }

    private renderFrameworkData(data: FrameworkPublicData): void {
        this.setText('framework-package-count', data.summary.packageCount.toString());
        this.setText('framework-module-count', data.summary.catalogModuleCount.toString());
        this.setText('framework-profile-count', data.summary.profileCount.toString());
        this.setText('framework-source-commit', data.sourceCommit.slice(0, 7));

        const generatedAt = document.getElementById('framework-generated-at');
        if (generatedAt) {
            generatedAt.textContent = new Date(data.generatedAt).toLocaleDateString('zh-CN');
            generatedAt.setAttribute('datetime', data.generatedAt);
        }

        const layerList = document.getElementById('framework-layer-list');
        if (layerList) {
            layerList.replaceChildren(...data.layers.map(layer => {
                const item = document.createElement('div');
                item.className = 'principle-item';
                const count = document.createElement('span');
                count.textContent = layer.packageCount.toString();
                const copy = document.createElement('div');
                const title = document.createElement('h3');
                title.textContent = layer.id;
                const description = document.createElement('p');
                description.textContent = layer.description;
                copy.append(title, description);
                item.append(count, copy);
                return item;
            }));
        }

        const lifecycleList = document.getElementById('framework-lifecycle-list');
        if (lifecycleList) {
            lifecycleList.replaceChildren(...Object.entries(data.lifecycleCounts).map(([name, count]) => {
                const item = document.createElement('div');
                item.className = 'stat-item';
                const strong = document.createElement('strong');
                strong.textContent = count.toString();
                const label = document.createElement('span');
                label.textContent = name;
                item.append(strong, label);
                return item;
            }));
        }
    }

    private setText(id: string, value: string): void {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    private setCurrentYear(): void {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) currentYearElement.textContent = new Date().getFullYear().toString();
    }

    private setupEventListeners(): void {
        if (this.mobileToggle && this.navMenu) {
            this.mobileToggle.addEventListener('click', () => this.navMenu?.classList.toggle('active'));
        }
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) this.navMenu?.classList.remove('active');
            });
        });
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            navbar?.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
}

new FrameworkPage();
