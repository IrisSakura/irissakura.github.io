interface JournalSummary {
    gameDesignCount: number;
    knowledgeStreamCount: number;
    description: string;
}

interface JournalStream {
    id: string;
    label: string;
    title: string;
    description: string;
    icon: string;
}

interface JournalNote {
    id: string;
    title: string;
    description: string;
    tags: string[];
    track: string;
}

interface JournalData {
    schemaVersion: number;
    title: string;
    summary: JournalSummary;
    streams: JournalStream[];
    featuredNotes: JournalNote[];
}

class JournalPage {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    private init(): void {
        this.setCurrentYear();
        this.setupNavigation();
        void this.loadJournalData();
    }

    private async loadJournalData(): Promise<void> {
        try {
            const response = await fetch('../data/journal.json', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json() as JournalData;
            this.renderSummary(data.summary);
            this.renderStreams(data.streams);
            this.renderNotes(data.featuredNotes);
        } catch (error) {
            console.error('[journal-data] failed to load curated journal snapshot', error);
            this.showLoadError();
        }
    }

    private renderSummary(summary: JournalSummary): void {
        this.setText('journal-description', summary.description);
        this.setText('journal-design-count', summary.gameDesignCount.toString());
        this.setText('journal-stream-count', summary.knowledgeStreamCount.toString());
    }

    private renderStreams(streams: JournalStream[]): void {
        const container = document.getElementById('journal-streams');
        if (!container) return;

        container.innerHTML = streams.map((stream, index) => `
            <article class="stream-card" data-stream="${stream.id}">
                <div class="stream-card-topline">
                    <span>0${index + 1}</span>
                    <i class="fas ${stream.icon}" aria-hidden="true"></i>
                </div>
                <p class="stream-label">${stream.label}</p>
                <h3>${stream.title}</h3>
                <p>${stream.description}</p>
            </article>
        `).join('');
    }

    private renderNotes(notes: JournalNote[]): void {
        const container = document.getElementById('journal-notes');
        if (!container) return;

        container.innerHTML = notes.map(note => `
            <article class="note-card" data-note="${note.id}">
                <span class="note-track">${note.track}</span>
                <h3>${note.title}</h3>
                <p>${note.description}</p>
                <div class="note-tags">
                    ${note.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </article>
        `).join('');
    }

    private showLoadError(): void {
        const message = '<p class="journal-error">精选摘要暂时无法加载，请稍后刷新页面。</p>';
        const streams = document.getElementById('journal-streams');
        const notes = document.getElementById('journal-notes');
        if (streams) streams.innerHTML = message;
        if (notes) notes.innerHTML = message;
        this.setText('journal-description', '学习记录摘要暂时无法加载。');
    }

    private setupNavigation(): void {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');

        mobileToggle?.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
        });
    }

    private setCurrentYear(): void {
        this.setText('current-year', new Date().getFullYear().toString());
    }

    private setText(id: string, value: string): void {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }
}

new JournalPage();
