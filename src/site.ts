export {};

const SYSTEM_THEME = 'system';
const FALLBACK_STORAGE_KEY = 'irissakura-theme';
const FALLBACK_BGM_STORAGE_KEY = 'irissakura-bgm';
const BGM_STATE_VERSION = 1;
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

interface BgmState {
    version: number;
    enabled: boolean;
    volume: number;
    currentTime: number;
}

class BgmPlayer {
    private wantsPlayback = false;
    private restoreTime = 0;
    private lastPersistedSecond = -1;

    private constructor(
        private readonly root: HTMLElement,
        private readonly audio: HTMLAudioElement,
        private readonly toggle: HTMLButtonElement,
        private readonly volume: HTMLInputElement,
        private readonly status: HTMLElement | null,
        private readonly storageKey: string,
        private readonly title: string,
        private readonly artist: string,
        private readonly defaultVolume: number
    ) {}

    static connect(): BgmPlayer | null {
        const root = document.querySelector<HTMLElement>('[data-bgm-player]');
        const audio = root?.querySelector<HTMLAudioElement>('[data-bgm-audio]');
        const toggle = root?.querySelector<HTMLButtonElement>('[data-bgm-toggle]');
        const volume = root?.querySelector<HTMLInputElement>('[data-bgm-volume]');
        if (!root || !audio || !toggle || !volume) return null;

        const configuredVolume = Number(root.dataset.defaultVolume);
        const defaultVolume = Number.isFinite(configuredVolume)
            ? BgmPlayer.clampVolume(configuredVolume)
            : 0.3;
        const player = new BgmPlayer(
            root,
            audio,
            toggle,
            volume,
            root.querySelector<HTMLElement>('[data-bgm-status]'),
            root.dataset.storageKey ?? FALLBACK_BGM_STORAGE_KEY,
            root.dataset.trackTitle ?? '背景音乐',
            root.dataset.trackArtist ?? '',
            defaultVolume
        );
        player.init();
        return player;
    }

    private init(): void {
        const state = this.readState();
        this.wantsPlayback = state.enabled;
        this.restoreTime = state.currentTime;
        this.audio.volume = state.volume;
        this.volume.value = state.volume.toString();
        this.updateUi();

        this.toggle.addEventListener('click', () => {
            if (!this.audio.paused) {
                this.wantsPlayback = false;
                this.audio.pause();
                this.persist();
                this.announce(`已暂停《${this.title}》`);
                return;
            }

            this.wantsPlayback = true;
            this.persist();
            void this.tryPlay(false);
        });

        this.volume.addEventListener('input', () => {
            this.audio.volume = BgmPlayer.clampVolume(Number(this.volume.value));
            this.persist();
        });

        this.audio.addEventListener('loadedmetadata', () => this.restorePosition());
        this.audio.addEventListener('play', () => {
            this.wantsPlayback = true;
            this.updateUi();
            this.persist();
        });
        this.audio.addEventListener('pause', () => this.updateUi());
        this.audio.addEventListener('timeupdate', () => {
            const currentSecond = Math.floor(this.audio.currentTime);
            if (currentSecond === this.lastPersistedSecond) return;
            this.lastPersistedSecond = currentSecond;
            this.restoreTime = this.audio.currentTime;
            this.persist();
        });
        this.audio.addEventListener('error', () => {
            this.updateUi('blocked');
            this.announce('背景音乐暂时无法加载');
        });

        window.addEventListener('pagehide', () => this.persist());
        window.addEventListener('storage', (event) => {
            if (event.key !== this.storageKey) return;
            const nextState = this.parseState(event.newValue);
            this.applyExternalState(nextState);
        });

        if (this.audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
            this.restorePosition();
        }
        if (this.wantsPlayback) {
            void this.tryPlay(true);
        }
    }

    private async tryPlay(resuming: boolean): Promise<void> {
        this.updateUi('loading');
        try {
            await this.audio.play();
            this.announce(`${resuming ? '继续播放' : '正在播放'}《${this.title}》`);
        } catch {
            this.updateUi('blocked');
            this.announce(
                resuming
                    ? '浏览器阻止了自动续播，请点击播放按钮继续'
                    : '浏览器暂时无法播放，请再次点击播放按钮'
            );
        }
    }

    private applyExternalState(state: BgmState): void {
        this.wantsPlayback = state.enabled;
        this.restoreTime = state.currentTime;
        this.audio.volume = state.volume;
        this.volume.value = state.volume.toString();
        this.restorePosition();

        if (!state.enabled && !this.audio.paused) {
            this.audio.pause();
        } else if (state.enabled && this.audio.paused) {
            void this.tryPlay(true);
        } else {
            this.updateUi();
        }
    }

    private restorePosition(): void {
        if (!Number.isFinite(this.audio.duration) || this.audio.duration <= 0) return;
        const maxTime = Math.max(0, this.audio.duration - 0.25);
        const targetTime = this.audio.loop
            ? this.restoreTime % this.audio.duration
            : Math.min(this.restoreTime, maxTime);
        if (targetTime > 0 && Math.abs(this.audio.currentTime - targetTime) > 0.75) {
            this.audio.currentTime = targetTime;
        }
    }

    private updateUi(override?: 'loading' | 'blocked'): void {
        const playing = !this.audio.paused && !this.audio.ended;
        const state = playing
            ? 'playing'
            : override ?? (this.wantsPlayback ? 'ready' : 'paused');
        this.root.dataset.state = state;
        this.toggle.setAttribute('aria-pressed', String(playing));
        this.toggle.setAttribute(
            'aria-label',
            `${playing ? '暂停' : '播放'}背景音乐《${this.title}》${this.artist ? `— ${this.artist}` : ''}`
        );
        const icon = this.toggle.querySelector<HTMLElement>('i');
        icon?.classList.toggle('fa-music', !playing);
        icon?.classList.toggle('fa-pause', playing);
    }

    private announce(message: string): void {
        if (this.status) this.status.textContent = message;
    }

    private readState(): BgmState {
        try {
            return this.parseState(localStorage.getItem(this.storageKey));
        } catch {
            return this.defaultState();
        }
    }

    private parseState(raw: string | null): BgmState {
        if (!raw) return this.defaultState();
        try {
            const state = JSON.parse(raw) as Partial<BgmState>;
            if (
                state.version !== BGM_STATE_VERSION
                || typeof state.enabled !== 'boolean'
                || typeof state.volume !== 'number'
                || typeof state.currentTime !== 'number'
            ) {
                return this.defaultState();
            }
            return {
                version: BGM_STATE_VERSION,
                enabled: state.enabled,
                volume: BgmPlayer.clampVolume(state.volume),
                currentTime: Number.isFinite(state.currentTime)
                    ? Math.max(0, state.currentTime)
                    : 0
            };
        } catch {
            return this.defaultState();
        }
    }

    private defaultState(): BgmState {
        return {
            version: BGM_STATE_VERSION,
            enabled: false,
            volume: this.defaultVolume,
            currentTime: 0
        };
    }

    private persist(): void {
        const currentTime = Number.isFinite(this.audio.currentTime) && this.audio.currentTime > 0
            ? this.audio.currentTime
            : this.restoreTime;
        this.restoreTime = currentTime;
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                version: BGM_STATE_VERSION,
                enabled: this.wantsPlayback,
                volume: this.audio.volume,
                currentTime
            } satisfies BgmState));
        } catch {
            // 隐私模式或受限存储环境下仍保持当前页面的播放器可用。
        }
    }

    private static clampVolume(volume: number): number {
        if (!Number.isFinite(volume)) return 0.3;
        return Math.min(1, Math.max(0, volume));
    }
}

class SiteShell {
    private toggle: HTMLButtonElement | null = null;
    private menu: HTMLElement | null = null;
    private lastFocused: HTMLElement | null = null;
    private themeSelect: HTMLSelectElement | null = null;
    private themeStylesheets: HTMLLinkElement[] = [];
    private colorSchemeQuery: MediaQueryList | null = null;
    private bgmPlayer: BgmPlayer | null = null;

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
        this.bgmPlayer = BgmPlayer.connect();
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
