/** Small CSS-driven ambient fields, scoped to the current page and visible viewport. */
export class AmbientMotion {
    private observer: IntersectionObserver | null = null;
    private controller: AbortController | null = null;
    private paused = false;
    private readonly storageKey = 'irissakura-ambient-paused';

    constructor() {
        try { this.paused = localStorage.getItem(this.storageKey) === 'true'; } catch { /* Session-only preference. */ }
    }

    setup(): void {
        this.observer?.disconnect();
        this.observer = null;
        this.controller?.abort();
        this.controller = null;
        const layer = document.querySelector<HTMLElement>('[data-ambient-layer]');
        const toggle = document.querySelector<HTMLButtonElement>('[data-ambient-toggle]');
        const settings = document.querySelector<HTMLElement>('[data-ambient-settings]');
        const label = toggle?.querySelector<HTMLElement>('[data-ambient-label]');
        if (settings) settings.hidden = true;
        if (!layer || !toggle || !settings || !label) return;

        const controller = new AbortController();
        this.controller = controller;
        const { signal } = controller;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        let visible = false;
        const refresh = (): void => {
            const running = visible && !document.hidden && !reduced.matches && !this.paused;
            layer.dataset.motion = running ? 'running' : 'paused';
            settings.hidden = reduced.matches || !this.observer;
            toggle.setAttribute('aria-checked', String(!this.paused));
            label.textContent = this.paused ? '关闭' : '开启';
        };
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                visible = entries.some((entry) => entry.isIntersecting);
                refresh();
            }, { threshold: 0 });
            this.observer.observe(layer);
        }
        toggle.addEventListener('click', () => {
            this.paused = !this.paused;
            try { localStorage.setItem(this.storageKey, String(this.paused)); } catch { /* Keep the in-memory choice. */ }
            refresh();
        }, { signal });
        reduced.addEventListener('change', refresh, { signal });
        document.addEventListener('visibilitychange', refresh, { signal });
        window.addEventListener('pagehide', () => { layer.dataset.motion = 'paused'; }, { signal });
        window.addEventListener('pageshow', refresh, { signal });
        refresh();
    }
}
