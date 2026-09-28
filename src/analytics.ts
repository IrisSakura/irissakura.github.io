type EventName =
    | 'navigation.search_open' | 'navigation.search_query' | 'navigation.search_result_open' | 'navigation.rss_open'
    | 'content.article_open' | 'content.project_open' | 'content.related_open'
    | 'framework.quickstart_open' | 'external.repository_open' | 'external.contact_open'
    | 'external.link_open';
type Properties = Record<string, string | number>;
interface AnalyticsConfig {
    enabled: boolean;
    provider: 'plausible';
    siteDomain: string | null;
    endpoint: string;
    privacyMode: boolean;
    trackPageViews: boolean;
    trackOutboundLinks: boolean;
}

const ALLOWED_EVENTS = new Set<EventName>([
    'navigation.search_open', 'navigation.search_query', 'navigation.search_result_open', 'navigation.rss_open',
    'content.article_open', 'content.project_open', 'content.related_open',
    'framework.quickstart_open', 'external.repository_open', 'external.contact_open', 'external.link_open'
]);
const ALLOWED_PROPERTIES = new Set(['category', 'queryLength', 'resultCount', 'contentType', 'destination']);

class AnalyticsAdapter {
    private readonly config: AnalyticsConfig | null;

    constructor() {
        try {
            const source = document.getElementById('site-analytics-config')?.textContent;
            const parsed = source ? JSON.parse(source) as AnalyticsConfig : null;
            this.config = parsed?.enabled && parsed.provider === 'plausible' && parsed.privacyMode
                && typeof parsed.siteDomain === 'string' && /^[a-z0-9.-]+$/iu.test(parsed.siteDomain)
                && parsed.endpoint === 'https://plausible.io/api/event' ? parsed : null;
        } catch {
            this.config = null;
        }
    }

    get enabled(): boolean { return this.config !== null; }
    get trackOutboundLinks(): boolean { return Boolean(this.config?.trackOutboundLinks); }

    trackPageView(): void {
        if (this.config?.trackPageViews) this.send('pageview');
    }

    trackEvent(name: EventName, properties: Properties = {}): void {
        if (!ALLOWED_EVENTS.has(name)) return;
        const props = Object.fromEntries(Object.entries(properties)
            .filter(([key, value]) => ALLOWED_PROPERTIES.has(key)
                && (typeof value === 'number' && Number.isFinite(value)
                    || typeof value === 'string' && /^[\p{L}\p{N} ._-]{1,64}$/u.test(value))));
        this.send(name, props);
    }

    trackOutbound(kind: 'repository' | 'contact' | 'link'): void {
        if (!this.trackOutboundLinks) return;
        this.trackEvent(`external.${kind}_open`);
    }

    private send(name: string, props?: Properties): void {
        if (!this.config) return;
        const url = new URL(location.pathname, location.origin).href;
        let referrer: string | undefined;
        try { if (document.referrer) referrer = new URL(document.referrer).origin; } catch { /* ignore malformed referrer */ }
        const payload = JSON.stringify({ name, domain: this.config.siteDomain, url, ...(referrer ? { referrer } : {}),
            ...(props && Object.keys(props).length ? { props } : {}) });
        void fetch(this.config.endpoint, {
            method: 'POST', mode: 'no-cors', credentials: 'omit', referrerPolicy: 'no-referrer',
            keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: payload
        }).catch(() => { /* observability cannot interrupt navigation */ });
    }
}

export const analytics = new AnalyticsAdapter();
