import { personaPicture } from './personas-v2.mjs';
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function pageFamily(file, registry) {
  const matches = registry.rules.filter(r => r.match.endsWith('*') ? file.startsWith(r.match.slice(0,-1)) : file === r.match);
  const rule = matches.sort((a,b)=>b.match.length-a.match.length)[0];
  if (!rule) throw new Error(`Page family missing: ${file}`);
  return rule;
}
export function projectComposition(persona, { prefix, engineering, framework, projectStatus }) {
  const art = `<figure class="brand-mode-hero-art brand-mode-hero-art-${persona.mode}" aria-hidden="true">${personaPicture(persona,{prefix,eager:true,decorative:true})}</figure>`;
  let structure='';
  if(persona.id==='iris') structure=`<div class="system-axis"><p class="section-kicker">ENGINEERING SYSTEM</p><p class="system-state">${esc(projectStatus)}</p><ol>${engineering.workflow.map((s,i)=>`<li><a href="#workflow-${esc(s.id)}"><span>0${i+1}</span>${esc(s.label)}</a></li>`).join('')}</ol></div>`;
  if(persona.id==='sakura') structure=`<nav class="module-branch" aria-label="框架结构"><p class="section-kicker">COMPOSE YOUR GAME</p><a class="branch-root" href="#architecture-map">${esc(framework.architectureMap.layers[0].label)}</a><ol>${framework.architectureMap.layers.slice(1).map(l=>`<li><a href="#architecture-map">${esc(l.label)}</a></li>`).join('')}</ol><a href="framework-quickstart.html">从采用路线开始 →</a></nav>`;
  if(persona.id==='myosotis') structure=`<nav class="archive-index" aria-label="Myosotis 档案入口"><p class="section-kicker">ARCHIVE / INDEX</p><a href="#content-search">01 / 查找研究</a><a href="blog.html">02 / 阅读文章</a><a href="blog.html#blog-taxonomy">03 / 沿系列阅读</a><a href="subscribe.html">04 / 订阅更新</a></nav>`;
  if(persona.id==='violet') structure='<nav class="workbench-tray" aria-label="工具台入口"><span>YOUR WORKBENCH</span><a href="#tools">卡牌 · 素材 · 表格 · 概率</a><a href="#status">本地制作与使用 →</a></nav>';
  return `<div class="project-composition composition-${persona.id}" data-grammar="${({iris:'system-axis',sakura:'module-branch',myosotis:'archive-index',violet:'tool-shelf'})[persona.id]}">${art}${structure}</div>`;
}
export function ecosystemMap(projects, brand, prefix='../') {
  const names=new Map(projects.map(p=>[p.projectId,p]));
  return `<nav class="ecosystem-map" aria-label="项目关系图"><div class="ecosystem-origin"><span>IRISSAKURA</span><strong>创作 · 研究 · 生活</strong></div><ol>${projects.map(p=>`<li data-persona="${esc(p.personaId)}"><a href="#ecosystem-${esc(p.projectId)}"><img src="${prefix}${brand.assets[p.logoAssetKey]}" alt="" width="40" height="40"><strong>${esc(p.displayName)}</strong><span>${esc(p.role)}</span></a></li>`).join('')}</ol></nav><div class="project-routes">${projects.map(p=>`<article class="project-route" id="ecosystem-${esc(p.projectId)}" data-project-id="${esc(p.projectId)}" data-persona="${esc(p.personaId)}"><p class="section-kicker">0${p.order} / ${esc(p.role)}</p><h2>${esc(p.displayName)}</h2><p>${esc(p.summary)}</p><dl><div><dt>负责</dt><dd>${esc(p.owns)}</dd></div><div><dt>产出</dt><dd>${esc(p.produces)}</dd></div><div><dt>近况</dt><dd>${esc(p.status === '以公开项目近况为准' ? p.source?.status ?? p.status : p.status)}</dd></div></dl><nav aria-label="${esc(p.displayName)} 的关联项目">${p.relationships.map(id=>`<a href="${prefix}${names.get(id).route.slice(1)}">${esc(names.get(id).displayName)} ↗</a>`).join('')}</nav><a class="btn btn-secondary" href="${prefix}${p.route.slice(1)}">进入 ${esc(p.displayName)}</a></article>`).join('')}</div>`;
}
export function publicationList(articles, prefix='blog/', ordered=false) {
  const sorted=[...articles].sort((a,b)=>ordered ? a.publishedAt.localeCompare(b.publishedAt)||a.slug.localeCompare(b.slug) : b.publishedAt.localeCompare(a.publishedAt)||a.slug.localeCompare(b.slug));
  let month='';
  return `<ol class="${ordered?'reading-order':'publication-list'}">${sorted.map((a,i)=>{const group=a.publishedAt.slice(0,7);const marker=!ordered&&month!==group?`<span class="publication-month">${group}</span>`:'';month=group;return `<li>${marker}<article><span class="publication-index">${ordered?String(i+1).padStart(2,'0'):a.publishedAt.slice(8)}</span><div><p class="publication-meta"><time datetime="${a.publishedAt}">${a.publishedAt}</time> · ${esc(a.series)}</p><h2><a href="${prefix}${esc(a.slug)}.html">${esc(a.title)}</a></h2><p>${esc(a.summary)}</p><a class="note-link" href="${prefix}${esc(a.slug)}.html">阅读全文 →</a></div></article></li>`;}).join('')}</ol>`;
}
export function readingBody(body, context='') {
  const headings=[...body.matchAll(/<h([2-3]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)];
  const toc=headings.map(([,depth,id,text])=>`<li class="toc-level-${depth}"><a href="#${esc(id)}">${text.replace(/<[^>]+>/g,'')}</a></li>`).join('');
  // Split only top-level block content. Wide blocks get a dedicated row below the rails.
  const parts=splitReadingBlocks(body);
  const wrapped=parts.map(block=>/^(<pre>|<table>)/.test(block)?`<div class="article-breakout blog-prose" tabindex="0" role="region" aria-label="${block.startsWith('<pre>')?'代码，可横向滚动':'表格，可横向滚动'}">${block}</div>`:`<div class="article-prose-section blog-prose">${block}</div>`).join('');
  return `<div class="article-shell"><details class="article-toc" open><summary>本文目录</summary><nav aria-label="本文目录"><ol>${toc||'<li>正文</li>'}</ol></nav></details><aside class="series-context">${context||'<p class="section-kicker">MYOSOTIS / RESEARCH</p><a href="../journal.html">返回研究档案 →</a>'}</aside><div class="article-body">${wrapped}</div></div>`;
}

// Sanitized HTML may contain code/tables inside lists or quotations. Only lift
// top-level blocks so their surrounding element tree remains intact.
export function splitReadingBlocks(body) {
  const parts=[]; let depth=0, start=0, wideStart=-1;
  const voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  for(const m of body.matchAll(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi)) {
    const name=m[1].toLowerCase(), closing=m[0].startsWith('</');
    if(closing) {
      depth=Math.max(0,depth-1);
      if(depth===0 && wideStart>=0) {
        parts.push(body.slice(wideStart,m.index+m[0].length)); start=m.index+m[0].length; wideStart=-1;
      }
    } else if(!voidTags.has(name) && !m[0].endsWith('/>')) {
      if(depth===0 && (name==='pre'||name==='table')) { parts.push(body.slice(start,m.index)); wideStart=m.index; }
      depth++;
    }
  }
  parts.push(body.slice(start));
  return parts.filter(p=>p.trim());
}
