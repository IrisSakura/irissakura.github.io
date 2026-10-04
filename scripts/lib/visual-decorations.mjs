// Decorations are deliberately limited to collection/intro pages, never article bodies or game imagery.
export const AMBIENT_PAGES = new Set([
  'index.html', 'pages/portfolio.html', 'pages/blog.html', 'pages/development.html',
  'pages/engineering.html', 'pages/framework.html', 'pages/journal.html', 'pages/tools.html',
  'pages/mods.html', 'pages/contact.html', 'pages/now.html', 'pages/subscribe.html'
]);

const CREATOR_SCENES = {
  reading: '阅读与记录',
  playing: '游戏与原型',
  letters: '来信与交流'
};

// Static cover art: reserve its square before decoding and request only the needed size.
export function renderCreatorVignette(scene, prefix = '../') {
  if (!Object.hasOwn(CREATOR_SCENES, scene)) throw new Error(`Unknown creator scene: ${scene}`);
  const source = `${prefix}assets/images/decorative/creator-vignettes-v1/${scene}`;
  return `<figure class="cover-illustration" data-creator-scene="${scene}" aria-hidden="true"><img src="${source}-640.webp" srcset="${source}-320.webp 320w, ${source}-640.webp 640w" sizes="(max-width: 700px) 208px, (max-width: 1100px) 32vw, 384px" alt="" width="640" height="640" decoding="async"><figcaption>${CREATOR_SCENES[scene]}</figcaption></figure>`;
}

const PROJECT_CHIBIS = {
  iris: 'IRIS · 整理蓝图',
  sakura: 'SAKURA · 连接想法',
  myosotis: 'MYOSOTIS · 翻阅档案',
  violet: 'VIOLET · 创作手边的小事',
  freesia: 'FREESIA · 改造与发现',
  wisteria: 'WISTERIA · 提灯守望'
};

// Reuse the approved chibi artwork for compact project identities.
// CSS crops the portrait; the source images and full-scene illustrations stay intact.
export function renderProjectIcon(persona, { prefix = '', className = '', size = 80 } = {}) {
  if (!Object.hasOwn(PROJECT_CHIBIS, persona)) throw new Error(`Unknown project icon: ${persona}`);
  const source = `${prefix}assets/personas/chibi-v1/${persona}`;
  return `<span class="project-icon${className ? ` ${className}` : ''}" data-project-icon="${persona}" data-persona="${persona}" style="--project-icon-size:${size}px" aria-hidden="true"><img src="${source}-320.webp" srcset="${source}-320.webp 320w, ${source}-640.webp 640w" sizes="${Math.ceil(size * 1.66)}px" alt="" width="320" height="320" loading="lazy" decoding="async"></span>`;
}

export function renderProjectChibi(persona, { compact = false } = {}) {
  if (!Object.hasOwn(PROJECT_CHIBIS, persona)) throw new Error(`Unknown project chibi: ${persona}`);
  const source = `../assets/personas/chibi-v1/${persona}`;
  const sizes = compact ? '(max-width: 600px) 128px, 192px' : '(max-width: 600px) 176px, (max-width: 900px) 224px, 264px';
  const caption = PROJECT_CHIBIS[persona].split(' · ').map((part) => `<span>${part}</span>`).join('');
  return `<figure class="project-chibi" data-project-chibi="${persona}" aria-hidden="true"><img src="${source}-640.webp" srcset="${source}-320.webp 320w, ${source}-640.webp 640w" sizes="${sizes}" alt="" width="640" height="640" loading="lazy" decoding="async"><figcaption>${caption}</figcaption></figure>`;
}

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
    html = html.replace(profileEnd, `</div>${wrap(`<figure class="profile-illustration" aria-hidden="true"><span class="creator-note">创作进行中<span>CREATOR AT WORK</span></span><i class="creator-spark"></i><img src="${prefix}${brand.assets.creatorIllustration}" alt="" width="1100" height="917" decoding="async"><span class="creator-stamp">IRIS SAKURA<span>想象，然后动手。</span></span></figure>`)}</div></section>\n<section id="now"`);
    html = html.replace(/(<section\b[^>]*id="writing"[^>]*>)/, `$1${image('blossomDecoration', 'section-flourish section-flourish-writing')}`);
    html = html.replace(/(<section\b[^>]*id="recent-updates"[^>]*>)/, `$1${image('orbitDecoration', 'section-flourish section-flourish-updates')}`);
    html = html.replace(/(<div class="container about-home">)/, `$1${image('blossomDecoration', 'about-flourish')}`);
  }
  if (['pages/now.html', 'pages/subscribe.html', 'pages/contact.html'].includes(page.file)) {
    html = html.replace(/(<main\b[^>]*>)/, `$1${image('blossomDecoration', 'page-flourish')}`);
  }
  return html;
}
