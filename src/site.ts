export {};

const SYSTEM_THEME = 'system';
const FALLBACK_STORAGE_KEY = 'irissakura-theme';
const REVEAL_SELECTOR = [
    '.profile-hero-inner > *',
    '.flagship-grid > *',
    '.focus-grid > *',
    '.section-heading',
    '.section-heading-row',
    '.research-list > *',
    '.evidence-chain-grid > *',
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
    '.blog-series-list > *',
    '.blog-tag-list > *',
    '.related-articles a',
    '.discussion-grid > *',
    '.public-route-list > *',
    '.journal-detail > header',
    '.journal-detail-grid > *',
    '.blog-article > header',
    '.footer-content > *'
].join(',');
const DEPTH_SELECTOR = [
    '.project-card',
    '.blog-card',
    '.blog-series-list > a',
    '.related-articles a',
    '.stream-card',
    '.note-card',
    '.journal-update-card',
    '.design-summary-card',
    '.principle-item',
    '.gallery-card',
    '.game-system-card',
    '.preference-card',
    '.discussion-grid article',
    '.public-route-card',
    '.maturity-summary article',
    '.stable-route-list article',
    '.research-row',
    '.focus-card',
    '.evidence-chain-card'
].join(',');

class SiteShell {
    private toggle: HTMLButtonElement | null = null;
    private menu: HTMLElement | null = null;
    private lastFocused: HTMLElement | null = null;
    private themeSelect: HTMLSelectElement | null = null;
    private themeStylesheets: HTMLLinkElement[] = [];
    private colorSchemeQuery: MediaQueryList | null = null;
    private profileDrawerTrigger: HTMLButtonElement | null = null;
    private profileDrawer: HTMLElement | null = null;
    private profileDrawerBackdrop: HTMLButtonElement | null = null;
    private profileDrawerClose: HTMLButtonElement | null = null;
    private profileDrawerLastFocused: HTMLElement | null = null;
    private motionObserver: IntersectionObserver | null = null;
    private navigationAbort: AbortController | null = null;
    private themeTransitionOverlay: HTMLElement | null = null;
    private themeTransitionSequence = 0;

    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    private init(): void {
        this.normalizePersistentUrls();
        this.toggle = document.querySelector<HTMLButtonElement>('.mobile-toggle');
        this.menu = document.querySelector<HTMLElement>('.nav-menu');
        this.themeSelect = document.querySelector<HTMLSelectElement>('.theme-select');
        this.themeStylesheets = Array.from(
            document.querySelectorAll<HTMLLinkElement>('[data-theme-stylesheet]')
        );
        this.profileDrawerTrigger = document.querySelector<HTMLButtonElement>(
            '.profile-drawer-trigger'
        );
        this.profileDrawer = document.querySelector<HTMLElement>('#profile-drawer');
        this.profileDrawerBackdrop = document.querySelector<HTMLButtonElement>(
            '[data-profile-drawer-backdrop]'
        );
        this.profileDrawerClose = document.querySelector<HTMLButtonElement>(
            '.profile-drawer-close'
        );
        this.colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        document.querySelectorAll<HTMLElement>('[data-current-year]').forEach((element) => {
            element.textContent = new Date().getFullYear().toString();
        });
        this.setupTheme();
        this.setupProfileDrawer();
        this.setupNavigation();
        this.setupSoftNavigation();
        this.setupFaq();
        this.setupNavbarDepth();
        this.setupMotion();
    }

    private normalizePersistentUrls(): void {
        document.head.querySelectorAll<HTMLLinkElement>('link[href]').forEach((link) => {
            link.href = link.href;
            if (link.relList.contains('stylesheet') && new URL(link.href).origin === location.origin) {
                link.dataset.siteLocalStylesheet = '';
            }
        });
        document.querySelectorAll<HTMLAnchorElement>(
            '.skip-link[href], .navbar a[href], .profile-drawer a[href], .footer a[href]'
        ).forEach((link) => {
            link.href = link.href;
        });
        document.querySelectorAll<HTMLOptionElement>(
            '.theme-select option[data-home-hero-image]'
        ).forEach((option) => {
            const heroImage = option.dataset.homeHeroImage;
            if (heroImage) option.dataset.homeHeroImage = new URL(heroImage, location.href).href;
        });
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
            void this.transitionThemePreference(preference, true);
        });

        this.colorSchemeQuery?.addEventListener('change', () => {
            if (!this.readStoredTheme()) {
                void this.transitionThemePreference(SYSTEM_THEME);
            }
        });

        window.addEventListener('storage', (event) => {
            if (event.key !== this.getStorageKey()) return;
            const preference = this.isTheme(event.newValue)
                ? event.newValue
                : SYSTEM_THEME;
            void this.transitionThemePreference(preference);
        });
    }

    private async transitionThemePreference(preference: string, persist = false): Promise<void> {
        if (!this.themeSelect) return;
        const resolvedTheme = preference === SYSTEM_THEME
            ? this.getSystemTheme()
            : preference;
        const option = this.getThemeOption(resolvedTheme);
        if (!option) return;

        const transitionSequence = ++this.themeTransitionSequence;
        const currentTheme = document.documentElement.dataset.theme;
        if (
            currentTheme === resolvedTheme
            || window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            this.applyThemePreference(preference, persist);
            this.themeTransitionOverlay?.classList.remove('is-covering');
            document.documentElement.classList.remove('theme-transitioning');
            return;
        }

        const root = document.documentElement;
        const overlay = this.getThemeTransitionOverlay();
        const assetsReady = this.waitForThemeAssets(resolvedTheme, option);

        if (!root.classList.contains('theme-transitioning')) {
            overlay.style.setProperty(
                '--theme-transition-color',
                window.getComputedStyle(document.body).backgroundColor
            );
            root.classList.add('theme-transitioning');
            await this.waitForNextPaint();
            if (transitionSequence !== this.themeTransitionSequence) return;
            overlay.classList.add('is-covering');
            await this.waitForThemeTransition(overlay);
        } else if (!overlay.classList.contains('is-covering')) {
            overlay.classList.add('is-covering');
            await this.waitForThemeTransition(overlay);
        }

        if (transitionSequence !== this.themeTransitionSequence) return;
        this.applyThemePreference(preference, persist);
        await assetsReady;
        await this.waitForNextPaint();
        if (transitionSequence !== this.themeTransitionSequence) return;

        overlay.classList.remove('is-covering');
        await this.waitForThemeTransition(overlay);
        if (transitionSequence !== this.themeTransitionSequence) return;
        root.classList.remove('theme-transitioning');
    }

    private getThemeTransitionOverlay(): HTMLElement {
        if (this.themeTransitionOverlay?.isConnected) return this.themeTransitionOverlay;
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.append(overlay);
        this.themeTransitionOverlay = overlay;
        return overlay;
    }

    private waitForThemeAssets(
        resolvedTheme: string,
        option: HTMLOptionElement
    ): Promise<void> {
        const assets: Promise<unknown>[] = this.themeStylesheets
            .filter((stylesheet) => (
                (stylesheet.dataset.themes ?? '').split(/\s+/).includes(resolvedTheme)
            ))
            .filter((stylesheet) => !stylesheet.sheet)
            .map((stylesheet) => new Promise<void>((resolve) => {
                stylesheet.addEventListener('load', () => resolve(), { once: true });
                stylesheet.addEventListener('error', () => resolve(), { once: true });
            }));

        const heroImage = option.dataset.homeHeroImage;
        if (heroImage) {
            assets.push(new Promise<void>((resolve) => {
                const image = new Image();
                image.addEventListener('load', () => resolve(), { once: true });
                image.addEventListener('error', () => resolve(), { once: true });
                image.src = heroImage;
                if (image.complete) resolve();
            }));
        }

        if (document.fonts) assets.push(document.fonts.ready);
        return Promise.race([
            Promise.all(assets).then(() => undefined),
            new Promise<void>((resolve) => window.setTimeout(resolve, 1200))
        ]);
    }

    private waitForNextPaint(): Promise<void> {
        return new Promise((resolve) => {
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => resolve());
            });
        });
    }

    private waitForThemeTransition(overlay: HTMLElement): Promise<void> {
        return new Promise((resolve) => {
            let settled = false;
            const finish = (): void => {
                if (settled) return;
                settled = true;
                overlay.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };
            const onTransitionEnd = (event: TransitionEvent): void => {
                if (event.target === overlay && event.propertyName === 'opacity') finish();
            };
            overlay.addEventListener('transitionend', onTransitionEnd);
            window.setTimeout(finish, 400);
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
        const heroImage = option.dataset.homeHeroImage;
        if (heroImage) {
            document.documentElement.style.setProperty('--home-hero-image', `url('${heroImage}')`);
        }
        const heroPosition = option.dataset.homeHeroPosition;
        if (heroPosition) {
            document.documentElement.style.setProperty('--home-hero-position', heroPosition);
        }
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
            this.setProfileDrawerOpen(false);
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

    private setupSoftNavigation(): void {
        if (!('fetch' in window) || !('DOMParser' in window) || !history.pushState) return;
        history.scrollRestoration = 'manual';

        document.addEventListener('click', (event) => {
            if (
                event.defaultPrevented
                || event.button !== 0
                || event.metaKey
                || event.ctrlKey
                || event.shiftKey
                || event.altKey
            ) {
                return;
            }

            const target = event.target;
            if (!(target instanceof Element)) return;
            const link = target.closest<HTMLAnchorElement>('a[href]');
            if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) {
                return;
            }

            const destination = new URL(link.href, location.href);
            if (!this.canSoftNavigate(destination)) return;
            event.preventDefault();
            this.setProfileDrawerOpen(false);
            this.setMenuOpen(false);
            void this.navigate(destination, true);
        });

        window.addEventListener('popstate', () => {
            void this.navigate(new URL(location.href), false);
        });
    }

    private canSoftNavigate(destination: URL): boolean {
        if (destination.origin !== location.origin) return false;
        if (!['http:', 'https:'].includes(destination.protocol)) return false;
        if (
            destination.pathname === location.pathname
            && destination.search === location.search
            && destination.hash
        ) {
            return false;
        }
        return destination.pathname === '/' || destination.pathname.endsWith('.html');
    }

    private async navigate(destination: URL, pushHistory: boolean): Promise<void> {
        this.navigationAbort?.abort();
        const controller = new AbortController();
        this.navigationAbort = controller;
        const currentMain = document.querySelector<HTMLElement>('main#main-content');
        currentMain?.setAttribute('aria-busy', 'true');
        document.documentElement.dataset.siteNavigating = '';

        try {
            const response = await fetch(destination.href, {
                headers: { 'X-IrisSakura-Navigation': 'partial' },
                signal: controller.signal
            });
            if (!response.ok) throw new Error(`navigation returned HTTP ${response.status}`);
            const nextDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
            const nextMain = nextDocument.querySelector<HTMLElement>('main#main-content');
            if (!nextMain) throw new Error('navigation response is missing main#main-content');

            await this.syncLocalStylesheets(nextDocument, destination, controller.signal);
            if (controller.signal.aborted) return;

            if (pushHistory) history.pushState(null, '', destination.href);
            this.syncMetadata(nextDocument, destination);
            this.syncNavigationState(nextDocument, destination);
            currentMain?.replaceWith(document.importNode(nextMain, true));
            this.updateCurrentYear();
            this.setupFaq();
            this.setupMotion();
            await this.loadPageModules(nextDocument, destination);
            document.dispatchEvent(new CustomEvent('site:navigation-complete', {
                detail: { url: destination.href }
            }));
            this.restoreNavigationPosition(destination);
        } catch (error) {
            if (controller.signal.aborted) return;
            console.error('[site-navigation] soft navigation failed; using a full page load', error);
            if (pushHistory) {
                location.assign(destination.href);
            } else {
                location.reload();
            }
        } finally {
            if (this.navigationAbort === controller) {
                this.navigationAbort = null;
                delete document.documentElement.dataset.siteNavigating;
                document.querySelector<HTMLElement>('main#main-content')
                    ?.removeAttribute('aria-busy');
            }
        }
    }

    private async syncLocalStylesheets(
        nextDocument: Document,
        destination: URL,
        signal: AbortSignal
    ): Promise<void> {
        const desired = Array.from(
            nextDocument.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"][href]')
        ).map((source) => ({
            source,
            href: new URL(source.getAttribute('href') ?? '', destination).href
        })).filter(({ href }) => new URL(href).origin === location.origin);
        const desiredUrls = new Set(desired.map(({ href }) => href));
        const current = new Map(
            Array.from(
                document.querySelectorAll<HTMLLinkElement>(
                    'link[rel~="stylesheet"][data-site-local-stylesheet]'
                )
            ).map((link) => [link.href, link])
        );

        const additions = desired
            .filter(({ href }) => !current.has(href))
            .map(({ source, href }) => this.addStylesheet(source, href, current));
        await Promise.all(additions);
        if (signal.aborted) return;

        for (const [href, link] of current) {
            if (!desiredUrls.has(href)) link.remove();
        }
        const firstExternalStylesheet = Array.from(
            document.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"]')
        ).find((link) => new URL(link.href).origin !== location.origin) ?? null;
        for (const { href } of desired) {
            const link = current.get(href);
            if (link) document.head.insertBefore(link, firstExternalStylesheet);
        }
        this.themeStylesheets = Array.from(
            document.querySelectorAll<HTMLLinkElement>('[data-theme-stylesheet]')
        );
        const preference = document.documentElement.dataset.themePreference ?? SYSTEM_THEME;
        this.applyThemePreference(preference);
    }

    private addStylesheet(
        source: HTMLLinkElement,
        href: string,
        current: Map<string, HTMLLinkElement>
    ): Promise<void> {
        const link = document.createElement('link');
        for (const attribute of Array.from(source.attributes)) {
            if (attribute.name !== 'href' && attribute.name !== 'disabled') {
                link.setAttribute(attribute.name, attribute.value);
            }
        }
        link.href = href;
        link.dataset.siteLocalStylesheet = '';
        if (source.hasAttribute('data-theme-stylesheet')) {
            const activeTheme = document.documentElement.dataset.theme ?? '';
            const supportedThemes = (source.dataset.themes ?? '').split(/\s+/);
            link.disabled = !supportedThemes.includes(activeTheme);
        } else {
            link.disabled = source.disabled;
        }
        current.set(href, link);

        return new Promise((resolve) => {
            link.addEventListener('load', () => resolve(), { once: true });
            link.addEventListener('error', () => resolve(), { once: true });
            document.head.append(link);
        });
    }

    private syncMetadata(nextDocument: Document, destination: URL): void {
        document.title = nextDocument.title;
        const selectors = [
            'meta[name="description"]',
            'meta[name="robots"]',
            'meta[property^="og:"]',
            'meta[name^="twitter:"]',
            'link[rel="canonical"]',
            'script[type="application/ld+json"]'
        ];
        for (const selector of selectors) {
            document.head.querySelectorAll(selector).forEach((element) => element.remove());
            nextDocument.head.querySelectorAll(selector).forEach((element) => {
                const clone = document.importNode(element, true);
                if (
                    clone instanceof HTMLLinkElement
                    && clone.relList.contains('canonical')
                    && clone.getAttribute('href')
                ) {
                    clone.href = new URL(clone.getAttribute('href') ?? '', destination).href;
                }
                document.head.append(clone);
            });
        }
    }

    private syncNavigationState(nextDocument: Document, destination: URL): void {
        const currentLinks = Array.from(
            document.querySelectorAll<HTMLAnchorElement>('.nav-menu a[href]')
        );
        const nextLinks = Array.from(
            nextDocument.querySelectorAll<HTMLAnchorElement>('.nav-menu a[href]')
        );
        currentLinks.forEach((link, index) => {
            const nextLink = nextLinks[index];
            if (!nextLink) return;
            link.className = nextLink.className;
            const href = nextLink.getAttribute('href');
            if (href) link.href = new URL(href, destination).href;
            const ariaCurrent = nextLink.getAttribute('aria-current');
            if (ariaCurrent) {
                link.setAttribute('aria-current', ariaCurrent);
            } else {
                link.removeAttribute('aria-current');
            }
        });
        const currentLogo = document.querySelector<HTMLAnchorElement>('.navbar .logo[href]');
        const nextLogo = nextDocument.querySelector<HTMLAnchorElement>('.navbar .logo[href]');
        if (currentLogo && nextLogo?.getAttribute('href')) {
            currentLogo.href = new URL(nextLogo.getAttribute('href') ?? '', destination).href;
        }
    }

    private async loadPageModules(nextDocument: Document, destination: URL): Promise<void> {
        const modules = Array.from(
            nextDocument.querySelectorAll<HTMLScriptElement>('script[type="module"][src]')
        ).map((script) => new URL(script.getAttribute('src') ?? '', destination).href)
            .filter((source) => !/\/dist\/site\.js$/u.test(new URL(source).pathname));
        for (const source of modules) {
            await import(source);
        }
    }

    private restoreNavigationPosition(destination: URL): void {
        if (destination.hash) {
            const id = decodeURIComponent(destination.hash.slice(1));
            window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
            return;
        }
        window.scrollTo(0, 0);
        const main = document.querySelector<HTMLElement>('main#main-content');
        main?.setAttribute('tabindex', '-1');
        main?.focus({ preventScroll: true });
    }

    private updateCurrentYear(): void {
        document.querySelectorAll<HTMLElement>('[data-current-year]').forEach((element) => {
            element.textContent = new Date().getFullYear().toString();
        });
    }

    private setupProfileDrawer(): void {
        if (
            !this.profileDrawerTrigger
            || !this.profileDrawer
            || !this.profileDrawerBackdrop
            || !this.profileDrawerClose
        ) {
            return;
        }

        this.profileDrawerTrigger.addEventListener('click', () => {
            const open = this.profileDrawer?.getAttribute('aria-hidden') !== 'false';
            this.setProfileDrawerOpen(open, !open);
        });
        this.profileDrawerClose.addEventListener('click', () => {
            this.setProfileDrawerOpen(false, true);
        });
        this.profileDrawerBackdrop.addEventListener('click', () => {
            this.setProfileDrawerOpen(false, true);
        });
        this.profileDrawer.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => this.setProfileDrawerOpen(false));
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.profileDrawer?.getAttribute('aria-hidden') === 'false') {
                this.setProfileDrawerOpen(false, true);
            }
        });
    }

    private setProfileDrawerOpen(open: boolean, restoreFocus = false): void {
        if (!this.profileDrawerTrigger || !this.profileDrawer) return;
        if (open) {
            this.setMenuOpen(false);
            this.profileDrawerLastFocused = document.activeElement as HTMLElement | null;
        }

        this.profileDrawerTrigger.setAttribute('aria-expanded', String(open));
        this.profileDrawer.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('profile-drawer-open', open);
        if (open) {
            this.profileDrawerClose?.focus({ preventScroll: true });
        }
        for (const element of document.querySelectorAll<HTMLElement>(
            '.navbar, main#main-content, footer.footer'
        )) {
            element.inert = open;
        }

        if (!open && restoreFocus) {
            (this.profileDrawerLastFocused ?? this.profileDrawerTrigger).focus();
        }
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
        this.motionObserver?.disconnect();
        this.motionObserver = null;
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

        this.motionObserver = observer;
        revealables.forEach((element) => observer.observe(element));
    }
}

new SiteShell();
