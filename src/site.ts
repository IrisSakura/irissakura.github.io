export {};

class SiteShell {
    private toggle: HTMLButtonElement | null = null;
    private menu: HTMLElement | null = null;
    private lastFocused: HTMLElement | null = null;

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
        document.querySelectorAll<HTMLElement>('[data-current-year]').forEach((element) => {
            element.textContent = new Date().getFullYear().toString();
        });
        this.setupNavigation();
        this.setupFaq();
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
