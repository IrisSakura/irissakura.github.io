const escape = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export function assertPersonas(config) {
  const expected = ['iris', 'sakura', 'myosotis', 'violet', 'freesia', 'wisteria'];
  if (config.schemaVersion !== 1 || JSON.stringify(config.personas?.map(({ id }) => id)) !== JSON.stringify(expected)) throw new Error('Persona V2: six identities required');
  const routes = new Set();
  for (const persona of config.personas) {
    if (persona.assetRoot !== `assets/personas/v2/${persona.id}` || !/^\/pages\/[a-z-]+\.html$/u.test(persona.route) || routes.has(persona.route)) throw new Error(`Persona V2: invalid path for ${persona.id}`);
    routes.add(persona.route);
    if (!/^[a-f0-9]{64}$/u.test(persona.source.sha256)) throw new Error(`Persona V2: missing source hash for ${persona.id}`);
    for (const color of Object.values(persona.colors)) if (!/^#[a-f0-9]{6}$/iu.test(color)) throw new Error('Persona V2: invalid palette');
  }
  return config.personas;
}

export function personaPicture(persona, { prefix = '', eager = false, className = '', decorative = false, sizes = '(max-width: 700px) 88vw, 440px' } = {}) {
  const base = prefix + persona.assetRoot + '/web/character-';
  const sources = ['avif', 'webp'].map((format) => `<source type="image/${format}" srcset="${[360, 720, 1086].map((width) => `${base}${width}.${format} ${width}w`).join(', ')}" sizes="${escape(sizes)}">`).join('');
  return `<picture class="persona-picture" data-persona="${persona.id}">${sources}<img class="${escape(className)}" src="${base}720.webp" alt="${decorative ? '' : escape(persona.alt)}" width="1086" height="1448" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}></picture>`;
}

export function personaCards(personas, brand, { prefix = '', kind = 'home' } = {}) {
  return personas.map((persona, index) => {
    const development = kind === 'development';
    const classes = development ? `development-card development-card-${persona.mode}` : `project-entry-card project-entry-card-${persona.mode}`;
    const title = development ? 'h2' : 'h3';
    return `<article class="${classes}" data-persona="${persona.id}" data-project-id="${persona.projectId}"><div class="persona-card-stage" aria-hidden="true">${personaPicture(persona, { prefix, decorative: true, sizes: '(max-width: 600px) 88vw, (max-width: 1000px) 42vw, 360px' })}<span class="persona-motif" aria-hidden="true"></span></div><img class="${development ? 'development-card-logo' : 'persona-card-logo'}" src="${prefix}${brand.assets[persona.logoAssetKey]}" alt="" width="48" height="48" loading="lazy"><p class="${development ? 'development-card-index' : 'project-entry-index'}">0${index + 1} · ${escape(persona.subtitle)}</p><${title}>${escape(persona.project)}</${title}><p>${escape(persona.summary)}</p><a class="${development ? 'btn btn-secondary' : 'text-link'}" href="${prefix === '../' ? persona.route.replace('/pages/', '') : prefix + persona.route.slice(1)}">${development ? '进入 ' + escape(persona.project) : '了解项目 →'}</a></article>`;
  }).join('');
}
