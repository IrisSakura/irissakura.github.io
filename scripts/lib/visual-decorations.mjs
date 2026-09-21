// Decorations are deliberately limited to collection/intro pages, never article bodies or game imagery.
export const AMBIENT_PAGES = new Set([
  'index.html', 'pages/portfolio.html', 'pages/blog.html', 'pages/development.html',
  'pages/engineering.html', 'pages/framework.html', 'pages/journal.html', 'pages/tools.html',
  'pages/mods.html', 'pages/contact.html', 'pages/now.html', 'pages/subscribe.html'
]);

export function installVisualDecorations(html, page, prefix, brand) {
  html = html.replace(/<!-- visual-decoration:start -->[\s\S]*?<!-- visual-decoration:end -->/g, '')
    .replace(/\sdata-ambient-page="[^"]*"/g, '')
    .replace(/\s*<link rel="stylesheet" href="[^"]*style\/components\/visual-decorations.css">/g, '');
  if (!AMBIENT_PAGES.has(page.file)) return html;
  const wrap = (markup) => `<!-- visual-decoration:start -->${markup}<!-- visual-decoration:end -->`;
  const image = (key, className) => wrap(`<img class="${className}" src="${prefix}${brand.assets[key]}" alt="" aria-hidden="true" width="400" height="300" loading="lazy" decoding="async">`);
  const particles = Array.from({ length: 12 }, (_, i) => {
    const x = i % 2 ? 80 + (i * 7 % 19) : 2 + (i * 3 % 19);
    return `<i class="ambient-particle${i % 3 === 0 ? ' ambient-star' : ''}" style="--x:${x}%;--y:${8 + i * 7}%;--delay:-${i * 3}s;--duration:${18 + i % 5 * 3}s;--drift:${i % 2 ? -24 : 24}px;--size:${i % 3 === 0 ? 7 : 13 + i % 4 * 3}px"></i>`;
  }).join('');
  const field = wrap(`<div class="ambient-field" data-ambient-layer aria-hidden="true">${particles}</div>`);
  html = html.replace(/<main\b([^>]*)>/, `<main$1 data-ambient-page="${page.brandMode}">${field}`);
  html = html.replace('</head>', `<link rel="stylesheet" href="${prefix}style/components/visual-decorations.css">\n</head>`);
  if (page.file === 'index.html') {
    // Match the end of the profile's identity panel, leaving its original responsive layout intact.
    const profileEnd = '</div></div></section>\n<section id="now"';
    if (!html.includes(profileEnd)) throw new Error('visual decorations: homepage profile boundary missing');
    html = html.replace(profileEnd, `</div>${wrap(`<figure class="profile-illustration" aria-hidden="true"><img src="${prefix}${brand.assets.creatorIllustration}" alt="" width="1100" height="917" decoding="async"></figure>`)}</div></section>\n<section id="now"`);
    html = html.replace(/(<img class="profile-avatar-large"[^>]*>)/, `$1${wrap(`<figure class="profile-illustration-mobile" aria-hidden="true"><img src="${prefix}${brand.assets.creatorIllustration}" alt="" width="1100" height="917" decoding="async"></figure>`)}`);
    html = html.replace(/(<section\b[^>]*id="writing"[^>]*>)/, `$1${image('blossomDecoration', 'section-flourish section-flourish-writing')}`);
    html = html.replace(/(<section\b[^>]*id="recent-updates"[^>]*>)/, `$1${image('orbitDecoration', 'section-flourish section-flourish-updates')}`);
    html = html.replace(/(<div class="container about-home">)/, `$1${image('blossomDecoration', 'about-flourish')}`);
  }
  if (['pages/now.html', 'pages/subscribe.html', 'pages/contact.html'].includes(page.file)) {
    html = html.replace(/(<main\b[^>]*>)/, `$1${image('blossomDecoration', 'page-flourish')}`);
  }
  return html;
}
