/** Validate generated, site-owned URLs without rejecting historical or external links. */
export function assertPublishedSiteUrls(file, text, siteUrl) {
  const origin = new URL(siteUrl).origin;
  const ownUrl = (value, label) => {
    if (!value || new URL(value).origin !== origin || (value !== origin && !value.startsWith(`${origin}/`))) {
      throw new Error(`${file}: ${label} must use ${origin}: ${value}`);
    }
    return value;
  };
  const required = (pattern, label) => {
    const value = text.match(pattern)?.[1];
    if (!value) throw new Error(`${file}: missing ${label}`);
    return value;
  };

  if (file.endsWith('.html')) {
    const canonical = ownUrl(required(/<link rel="canonical" href="([^"]+)"/u, 'canonical'), 'canonical');
    const ogUrl = ownUrl(required(/<meta property="og:url" content="([^"]+)"/u, 'og:url'), 'og:url');
    if (ogUrl !== canonical) throw new Error(`${file}: og:url differs from canonical`);
    ownUrl(required(/<meta property="og:image" content="([^"]+)"/u, 'og:image'), 'og:image');
    ownUrl(required(/<meta name="twitter:image" content="([^"]+)"/u, 'twitter:image'), 'twitter:image');
    const structured = JSON.parse(required(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/u, 'JSON-LD'));
    const siteFields = new Set(['@id', 'url', 'item', 'image', 'mainEntityOfPage']);
    const visit = (value, key = '') => {
      if (typeof value === 'string' && siteFields.has(key)) ownUrl(value, `JSON-LD ${key}`);
      else if (Array.isArray(value)) value.forEach((item) => visit(item, key));
      else if (value && typeof value === 'object') {
        for (const [childKey, child] of Object.entries(value)) visit(child, childKey);
      }
    };
    visit(structured);
  } else if (file === 'sitemap.xml') {
    const urls = [...text.matchAll(/<loc>([^<]+)<\/loc>/gu)];
    if (!urls.length) throw new Error(`${file}: missing sitemap URLs`);
    for (const [, value] of urls) ownUrl(value, 'loc');
  } else if (file === 'rss.xml') {
    const urls = [...text.matchAll(/<(?:link|guid)(?:\s[^>]*)?>([^<]+)<\/(?:link|guid)>/gu)];
    if (!urls.length) throw new Error(`${file}: missing feed URLs`);
    for (const [, value] of urls) ownUrl(value, 'feed URL');
    const self = required(/<atom:link href="([^"]+)"/u, 'feed self URL');
    if (ownUrl(self, 'feed self URL') !== `${origin}/rss.xml`) throw new Error(`${file}: invalid feed self URL`);
  } else if (file === 'robots.txt') {
    const sitemap = required(/^Sitemap: (\S+)/mu, 'Sitemap');
    if (ownUrl(sitemap, 'Sitemap') !== `${origin}/sitemap.xml`) throw new Error(`${file}: invalid Sitemap URL`);
  }
}
