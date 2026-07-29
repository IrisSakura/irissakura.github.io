export {};

type ProjectCategory = 'research' | 'game' | 'tool';

interface PortfolioProject {
    id: string;
    title: string;
    category: ProjectCategory;
    categoryLabel: string;
    status: string;
    year: number;
    role: string;
    summary: string;
    technologies: string[];
    evidence: string[];
    href: string;
    linkLabel: string;
    image?: string;
    imageAlt?: string;
}

interface ProjectsData {
    projects: PortfolioProject[];
}

class PortfolioPage {
    private projects: PortfolioProject[] = [];
    private filter: 'all' | ProjectCategory = 'all';

    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => void this.init());
        } else {
            void this.init();
        }
    }

    private async init(): Promise<void> {
        this.setupFilters();
        await this.loadProjects();
    }

    private setupFilters(): void {
        document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const nextFilter = button.dataset.filter as 'all' | ProjectCategory;
                this.filter = nextFilter;
                document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach((candidate) => {
                    const active = candidate === button;
                    candidate.classList.toggle('active', active);
                    candidate.setAttribute('aria-pressed', String(active));
                });
                this.renderProjects();
            });
        });
    }

    private async loadProjects(): Promise<void> {
        const grid = document.getElementById('portfolio-grid');
        if (!grid) return;

        try {
            const response = await fetch('../data/projects.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json() as ProjectsData;
            this.projects = data.projects;
            this.renderProjects();
        } catch {
            grid.innerHTML = '<p class="content-error">项目数据暂时无法加载，请稍后重试。</p>';
        }
    }

    private renderProjects(): void {
        const grid = document.getElementById('portfolio-grid');
        if (!grid) return;
        const projects = this.filter === 'all'
            ? this.projects
            : this.projects.filter((project) => project.category === this.filter);

        grid.innerHTML = projects.map((project) => `
            <article class="portfolio-item" data-category="${project.category}">
                <div class="portfolio-image" data-category="${project.categoryLabel}">
                    ${project.image ? `<img src="${project.image}" alt="${project.imageAlt ?? ''}">` : '<div class="portfolio-placeholder" aria-hidden="true"></div>'}
                    <span class="portfolio-status">${project.status}</span>
                </div>
                <div class="portfolio-content">
                    <p class="project-status">${project.categoryLabel} · ${project.year}</p>
                    <h3>${project.title}</h3>
                    <p>${project.summary}</p>
                    <p class="portfolio-role"><strong>职责：</strong>${project.role}</p>
                    <ul class="portfolio-evidence">
                        ${project.evidence.slice(0, 3).map((item) => `<li>${item}</li>`).join('')}
                    </ul>
                    <div class="portfolio-tags">${project.technologies.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
                    <a href="${project.href}" class="portfolio-link">${project.linkLabel}<i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                </div>
            </article>
        `).join('');
    }
}

new PortfolioPage();
