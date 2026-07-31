export {};

const SYSTEM_THEME = 'system';
const FALLBACK_STORAGE_KEY = 'irissakura-theme';
const REVEAL_SELECTOR = [
    '.hero-content > *',
    '.hero-proof',
    '.profile-card-body > *',
    '.evidence-grid > *',
    '.flagship-grid > *',
    '.section-heading',
    '.section-heading-row',
    '.method-chain > *',
    '.case-list > *',
    '.research-list > *',
    '.portfolio-header .container > *',
    '.portfolio-cases > *',
    '.framework-hero-grid > *',
    '.maturity-summary > *',
    '.principle-list > *',
    '.game-hero-grid > *',
    '.game-gallery > *',
    '.game-system-grid > *',
    '.journal-hero-grid > *',
    '.journal-dashboard',
    '.stream-grid > *',
    '.note-grid > *',
    '.journal-update-grid > *',
    '.design-summary-grid > *',
    '.blog-hero .container > *',
    '.blog-card-grid > *',
    '.about-intro-grid > *',
    '.about-story-grid > *',
    '.about-focus-list > *',
    '.about-preferences-grid > *',
    '.discussion-grid > *',
    '.public-route-list > *',
    '.route-boundary-inner > *',
    '.journal-detail > header',
    '.journal-detail-grid > *',
    '.blog-article > header',
    '.footer-content > *'
].join(',');
const DEPTH_SELECTOR = [
    '.project-card',
    '.profile-card',
    '.blog-card',
    '.stream-card',
    '.note-card',
    '.journal-update-card',
    '.design-summary-card',
    '.principle-item',
    '.gallery-card',
    '.game-system-card',
    '.about-focus-list article',
    '.preference-card',
    '.discussion-grid article',
    '.public-route-card',
    '.maturity-summary article',
    '.stable-route-list article',
    '.research-row',
    '.method-chain li'
].join(',');

class SiteShell {
    private toggle: HTMLButtonElement | null = null;
    private menu: HTMLElement | null = null;
    private lastFocused: HTMLElement | null = null;
    private themeSelect: HTMLSelectElement | null = null;
    private themeStylesheets: HTMLLinkElement[] = [];
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
        this.themeSelect = document.querySelector<HTMLSelectElement>('.theme-select');
        this.themeStylesheets = Array.from(
            document.querySelectorAll<HTMLLinkElement>('[data-theme-stylesheet]')
        );
        this.colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        document.querySelectorAll<HTMLElement>('[data-current-year]').forEach((element) => {
            element.textContent = new Date().getFullYear().toString();
        });
        this.setupTheme();
        this.setupNavigation();
        this.setupFaq();
        this.setupNavbarDepth();
        this.setupMotion();
    }

    private setupTheme(): void {
        const themeSelect = this.themeSelect;
        if (!themeSelect) return;
        const initialPreference = this.readDocumentPreference()
            ?? this.readStoredTheme()
            ?? SYSTEM_THEME;
        this.applyThemePreference(initialPreference);

        themeSelect.addEventListener('change', () => {
            const preference = this.isTheme(themeSelect.value)
                ? themeSelect.value
                : SYSTEM_THEME;
            this.applyThemePreference(preference, true);
        });

        this.colorSchemeQuery?.addEventListener('change', () => {
            if (!this.readStoredTheme()) {
                this.applyThemePreference(SYSTEM_THEME);
            }
        });

        window.addEventListener('storage', (event) => {
            if (event.key !== this.getStorageKey()) return;
            const preference = this.isTheme(event.newValue)
                ? event.newValue
                : SYSTEM_THEME;
            this.applyThemePreference(preference);
        });
    }

    private applyThemePreference(preference: string, persist = false): void {
        if (!this.themeSelect) return;
        const resolvedTheme = preference === SYSTEM_THEME
            ? this.getSystemTheme()
            : preference;
        const option = this.getThemeOption(resolvedTheme);
        if (!option) return;

        document.documentElement.dataset.theme = resolvedTheme;
        document.documentElement.dataset.themePreference = preference;
        document.documentElement.style.colorScheme = option.dataset.colorScheme ?? 'light';
        for (const stylesheet of this.themeStylesheets) {
            const supportedThemes = (stylesheet.dataset.themes ?? '').split(/\s+/);
            stylesheet.disabled = !supportedThemes.includes(resolvedTheme);
        }
        document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
            ?.setAttribute('content', option.dataset.themeColor ?? '#d7e8eb');
        this.themeSelect.value = preference;

        if (persist) {
            try {
                if (preference === SYSTEM_THEME) {
                    localStorage.removeItem(this.getStorageKey());
                } else {
                    localStorage.setItem(this.getStorageKey(), preference);
                }
            } catch {
                // 隐私模式或受限存储环境下仍保持本次页面选择可用。
            }
        }
    }

    private readDocumentPreference(): string | null {
        const preference = document.documentElement.dataset.themePreference;
        return this.isTheme(preference) ? preference : null;
    }

    private readStoredTheme(): string | null {
        try {
            const theme = localStorage.getItem(this.getStorageKey());
            return this.isTheme(theme) && theme !== SYSTEM_THEME ? theme : null;
        } catch {
            return null;
        }
    }

    private getSystemTheme(): string {
        const preferredTheme = this.colorSchemeQuery?.matches
            ? this.themeSelect?.dataset.defaultDark
            : this.themeSelect?.dataset.defaultLight;
        return this.isTheme(preferredTheme) && preferredTheme !== SYSTEM_THEME
            ? preferredTheme
            : this.firstRegisteredTheme();
    }

    private getThemeOption(theme: string): HTMLOptionElement | null {
        if (!this.themeSelect) return null;
        return Array.from(this.themeSelect.options)
            .find((option) => option.value === theme) ?? null;
    }

    private firstRegisteredTheme(): string {
        if (!this.themeSelect) return '';
        return Array.from(this.themeSelect.options)
            .find((option) => option.value !== SYSTEM_THEME)?.value ?? '';
    }

    private getStorageKey(): string {
        return this.themeSelect?.dataset.storageKey ?? FALLBACK_STORAGE_KEY;
    }

    private isTheme(value: string | null | undefined): value is string {
        if (!value || !this.themeSelect) return false;
        return Array.from(this.themeSelect.options).some((option) => option.value === value);
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

    private setupNavbarDepth(): void {
        const navbar = document.querySelector<HTMLElement>('.navbar');
        if (!navbar) return;

        let updateScheduled = false;
        const update = (): void => {
            navbar.classList.toggle('scrolled', window.scrollY > 36);
            updateScheduled = false;
        };
        const scheduleUpdate = (): void => {
            if (updateScheduled) return;
            updateScheduled = true;
            window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', scheduleUpdate, { passive: true });
    }

    private setupMotion(): void {
        const revealables = Array.from(
            document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
        );
        document.querySelectorAll<HTMLElement>(DEPTH_SELECTOR).forEach((element) => {
            element.classList.add('depth-card');
        });

        const orderByParent = new Map<Element, number>();
        for (const element of revealables) {
            element.dataset.reveal = '';
            const parent = element.parentElement;
            const order = parent ? orderByParent.get(parent) ?? 0 : 0;
            element.style.setProperty('--reveal-order', String(Math.min(order, 4)));
            if (parent) orderByParent.set(parent, order + 1);
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotion.matches || !('IntersectionObserver' in window)) {
            revealables.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        document.documentElement.classList.add('motion-ready');
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        }, {
            rootMargin: '0px 0px -8%',
            threshold: 0.12
        });

        revealables.forEach((element) => observer.observe(element));
    }
}

new SiteShell();
