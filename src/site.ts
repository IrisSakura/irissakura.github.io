export {};

type SiteTheme = 'pastoral' | 'night';

const THEME_STORAGE_KEY = 'irissakura-theme';
const PASTORAL_THEME: SiteTheme = 'pastoral';
const NIGHT_THEME: SiteTheme = 'night';

class SiteShell {
    private toggle: HTMLButtonElement | null = null;
    private menu: HTMLElement | null = null;
    private lastFocused: HTMLElement | null = null;
    private themeToggle: HTMLButtonElement | null = null;
    private themeStylesheet: HTMLLinkElement | null = null;
    private colorSchemeQuery: MediaQueryList | null = null;

    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    private init(): void {
        this.toggle = document.querySelector<HTMLButtonElement>('.mobile-toggle');
        this.menu = document.querySelector<HTMLElement>('.nav-menu');
        this.themeToggle = document.querySelector<HTMLButtonElement>('.theme-toggle');
        this.themeStylesheet = document.querySelector<HTMLLinkElement>('[data-theme-stylesheet]');
        this.colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        document.querySelectorAll<HTMLElement>('[data-current-year]').forEach((element) => {
            element.textContent = new Date().getFullYear().toString();
        });
        this.setupTheme();
        this.setupNavigation();
        this.setupFaq();
    }

    private setupTheme(): void {
        const initialTheme = this.readDocumentTheme()
            ?? this.readStoredTheme()
            ?? this.getSystemTheme();
        this.applyTheme(initialTheme);

        this.themeToggle?.addEventListener('click', () => {
            const nextTheme = this.readDocumentTheme() === NIGHT_THEME
                ? PASTORAL_THEME
                : NIGHT_THEME;
            this.applyTheme(nextTheme, true);
        });

        this.colorSchemeQuery?.addEventListener('change', (event) => {
            if (!this.readStoredTheme()) {
                this.applyTheme(event.matches ? NIGHT_THEME : PASTORAL_THEME);
            }
        });

        window.addEventListener('storage', (event) => {
            if (event.key !== THEME_STORAGE_KEY) return;
            const theme = this.isTheme(event.newValue)
                ? event.newValue
                : this.getSystemTheme();
            this.applyTheme(theme);
        });
    }

    private applyTheme(theme: SiteTheme, persist = false): void {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme === NIGHT_THEME ? 'dark' : 'light';
        if (this.themeStylesheet) {
            this.themeStylesheet.disabled = theme === NIGHT_THEME;
        }
        document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
            ?.setAttribute('content', theme === NIGHT_THEME ? '#121212' : '#d7e8eb');

        if (persist) {
            try {
                localStorage.setItem(THEME_STORAGE_KEY, theme);
            } catch {
                // 隐私模式或受限存储环境下仍保持本次页面切换可用。
            }
        }

        this.updateThemeToggle(theme);
    }

    private updateThemeToggle(theme: SiteTheme): void {
        if (!this.themeToggle) return;
        const nightActive = theme === NIGHT_THEME;
        const label = this.themeToggle.querySelector<HTMLElement>('.theme-toggle-label');
        const icon = this.themeToggle.querySelector<HTMLElement>('i');

        this.themeToggle.setAttribute('aria-pressed', String(nightActive));
        this.themeToggle.setAttribute(
            'aria-label',
            nightActive ? '启用田园明亮主题' : '启用夜色深色主题'
        );
        if (label) label.textContent = nightActive ? '田园' : '夜色';
        icon?.classList.toggle('fa-moon', !nightActive);
        icon?.classList.toggle('fa-sun', nightActive);
    }

    private readDocumentTheme(): SiteTheme | null {
        const theme = document.documentElement.dataset.theme;
        return this.isTheme(theme) ? theme : null;
    }

    private readStoredTheme(): SiteTheme | null {
        try {
            const theme = localStorage.getItem(THEME_STORAGE_KEY);
            return this.isTheme(theme) ? theme : null;
        } catch {
            return null;
        }
    }

    private getSystemTheme(): SiteTheme {
        return this.colorSchemeQuery?.matches ? NIGHT_THEME : PASTORAL_THEME;
    }

    private isTheme(value: string | null | undefined): value is SiteTheme {
        return value === PASTORAL_THEME || value === NIGHT_THEME;
    }

    private setupNavigation(): void {
        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => {
            this.setMenuOpen(!this.menu?.classList.contains('active'));
        });

        this.menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => this.setMenuOpen(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.menu?.classList.contains('active')) {
                this.setMenuOpen(false, true);
            }
        });

        window.matchMedia('(min-width: 769px)').addEventListener('change', (event) => {
            if (event.matches) this.setMenuOpen(false);
        });
    }

    private setMenuOpen(open: boolean, restoreFocus = false): void {
        if (!this.toggle || !this.menu) return;
        if (open) this.lastFocused = document.activeElement as HTMLElement | null;
        this.menu.classList.toggle('active', open);
        this.toggle.setAttribute('aria-expanded', String(open));
        this.toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
        document.body.classList.toggle('nav-open', open);

        if (open) {
            this.menu.querySelector<HTMLElement>('a')?.focus();
        } else if (restoreFocus) {
            (this.lastFocused ?? this.toggle).focus();
        }
    }

    private setupFaq(): void {
        document.querySelectorAll<HTMLButtonElement>('[data-faq-toggle]').forEach((button) => {
            const answerId = button.getAttribute('aria-controls');
            const answer = answerId ? document.getElementById(answerId) : null;
            if (!answer) return;

            button.addEventListener('click', () => {
                const expanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', String(!expanded));
                answer.hidden = expanded;
                button.closest('.faq-item')?.classList.toggle('active', !expanded);
            });
        });
    }
}

new SiteShell();
