export {};

interface Project {
    id: string;
    title: string;
    categoryLabel: string;
    status: string;
    year: number;
    summary: string;
    technologies: string[];
    href: string;
    linkLabel: string;
    image?: string;
    homeImage?: string;
    imageAlt?: string;
    featured: boolean;
}

interface ProjectsData {
    projects: Project[];
}

interface JournalNote {
    id: string;
    title: string;
    description: string;
    track: string;
    updatedAt?: string;
}

interface JournalData {
    featuredNotes: JournalNote[];
}

class MainPage {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => void this.init());
        } else {
            void this.init();
        }
    }

    private async init(): Promise<void> {
        await Promise.all([this.loadProjects(), this.loadResearchUpdates()]);
    }

    private async loadProjects(): Promise<void> {
        const container = document.getElementById('featured-projects');
        if (!container) return;

        try {
            const response = await fetch('data/projects.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json() as ProjectsData;
            const projects = data.projects.filter((project) => project.featured);
            container.innerHTML = projects.map((project) => `
                <article class="project-card">
                    ${project.homeImage ? `
                        <a class="project-image" href="pages/${project.href}" aria-label="查看${project.title}案例">
                            <img src="${project.homeImage}" alt="${project.imageAlt ?? ''}">
                        </a>
                    ` : ''}
                    <div class="project-content">
                        <p class="project-status">${project.categoryLabel} · ${project.status}</p>
                        <h3 class="project-title">${project.title}</h3>
                        <p>${project.summary}</p>
                        <div class="project-tags">${project.technologies.slice(0, 4).map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
                        <a class="project-detail-link" href="pages/${project.href}">
                            ${project.linkLabel}<i class="fas fa-arrow-right" aria-hidden="true"></i>
                        </a>
                    </div>
                </article>
            `).join('');
        } catch {
            container.innerHTML = '<p class="content-error">项目数据暂时无法加载，请前往作品集查看静态说明。</p>';
        }
    }

    private async loadResearchUpdates(): Promise<void> {
        const container = document.getElementById('recent-posts');
        if (!container) return;

        try {
            const response = await fetch('data/journal.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json() as JournalData;
            container.innerHTML = data.featuredNotes.slice(0, 3).map((note) => `
                <article class="blog-card">
                    <div class="blog-content">
                        <p class="project-status">${note.track}${note.updatedAt ? ` · ${note.updatedAt}` : ''}</p>
                        <h3 class="blog-title">${note.title}</h3>
                        <p>${note.description}</p>
                        <a href="pages/journal.html#note-${note.id}" class="project-detail-link">
                            查看研究摘要<i class="fas fa-arrow-right" aria-hidden="true"></i>
                        </a>
                    </div>
                </article>
            `).join('');
        } catch {
            container.innerHTML = '<p class="content-error">研究摘要暂时无法加载，请直接进入研究记录页。</p>';
        }
    }
}

new MainPage();
