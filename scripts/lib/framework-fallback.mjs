function calculatePercentage(value, total) {
  if (total <= 0) return 0;
  return Math.max(value > 0 ? 1 : 0, Math.round((value / total) * 100));
}

export function updateFrameworkFallback(html, data, adoption) {
  const foundationLayer = data.layers.find((layer) => layer.id === 'foundation');
  if (!foundationLayer) {
    throw new Error('framework snapshot must include the foundation layer');
  }
  const supportedCount = data.lifecycleCounts.Supported ?? 0;
  const replacements = {
    'framework-package-count': data.summary.packageCount,
    'framework-module-count': data.summary.catalogModuleCount,
    'framework-profile-count': data.summary.profileCount,
    'framework-maturity-summary': `${data.summary.packageCount} 个 Package 中只有 ${supportedCount} 个处于 Supported；Preview 和 Experimental 不应被解释为同等稳定的生产能力。`,
    'framework-module-result-count': `${data.featuredModules.length} 个模块`,
    'framework-supported-count': supportedCount,
    'framework-preview-count': data.lifecycleCounts.Preview ?? 0,
    'framework-experimental-count': data.lifecycleCounts.Experimental ?? 0,
    'framework-docsonly-count': data.lifecycleCounts.DocsOnly ?? 0,
    'framework-frozen-count': data.lifecycleCounts.Frozen ?? 0,
    'framework-layer-detail-description': foundationLayer.description,
    'framework-layer-detail-count': foundationLayer.packageCount,
    'framework-layer-detail-share': `${calculatePercentage(foundationLayer.packageCount, data.summary.packageCount)}%`,
    'framework-lifecycle-detail-count': supportedCount,
    'framework-lifecycle-detail-share': `${calculatePercentage(supportedCount, data.summary.packageCount)}%`,
    'framework-supported-package-list': adoption.supportedPackages.map((entry) => entry.displayName).join('、')
  };
  for (const [id, value] of Object.entries(replacements)) {
    html = html.replace(
      new RegExp(`(<[^>]+id="${id}"[^>]*>)[\\s\\S]*?(</[^>]+>)`),
      `$1${value}$2`
    );
  }
  html = html.replace(
    /(<button[^>]+data-layer-id="foundation"[^>]*>\s*<span>)[\s\S]*?(<\/span>)/,
    `$1${foundationLayer.packageCount}$2`
  );
  html = html.replace(
    /(<button[^>]+data-lifecycle-name="Supported"[^>]*>\s*<strong>)[\s\S]*?(<\/strong>)/,
    `$1${supportedCount}$2`
  );
  return html;
}
