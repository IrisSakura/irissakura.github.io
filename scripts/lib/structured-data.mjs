const PERSON_ID = 'https://irissakura.github.io/#person';
const WEBSITE_ID = 'https://irissakura.github.io/#website';

export function buildStructuredData(page, site, image) {
  const url = `${site.siteUrl}${page.canonical}`;
  const person = { '@type': 'Person', '@id': PERSON_ID, name: site.profile.nickname,
    url: site.siteUrl, sameAs: site.socials.map(({ url: socialUrl }) => socialUrl) };
  const pageEntity = { '@type': page.schemaType ?? 'WebPage', '@id': `${url}#webpage`,
    name: page.title, description: page.description, url };
  if (page.file === 'index.html') {
    return { '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebSite', '@id': WEBSITE_ID, name: site.siteName, url: site.siteUrl,
        description: site.description, publisher: { '@id': PERSON_ID } },
      person,
      { ...pageEntity, mainEntity: { '@id': PERSON_ID }, isPartOf: { '@id': WEBSITE_ID } }
    ] };
  }
  if (page.file === 'pages/contact.html') pageEntity.mainEntity = person;
  if (page.schemaType === 'SoftwareSourceCode') {
    pageEntity.creator = { '@id': PERSON_ID };
    pageEntity.programmingLanguage = 'C#';
    pageEntity.runtimePlatform = page.runtimePlatform ?? 'Unity';
  }
  if (page.schemaType === 'VideoGame') {
    pageEntity.author = { '@id': PERSON_ID };
    pageEntity.gamePlatform = 'Unity 2022.3 LTS';
  }
  if (page.schemaType === 'HowTo' && page.quickstart) {
    pageEntity.totalTime = `PT${page.quickstart.durationMinutes}M`;
    pageEntity.step = page.quickstart.steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1,
      name: step.title, text: `${step.summary} 完成标准：${step.completion}`, url: `${url}#${step.id}` }));
  }
  if (page.article) {
    pageEntity['@type'] = 'BlogPosting';
    pageEntity.headline = page.article.title;
    pageEntity.datePublished = page.article.publishedAt;
    pageEntity.dateModified = page.article.updatedAt;
    pageEntity.author = { '@id': PERSON_ID };
    pageEntity.image = image;
    pageEntity.keywords = page.article.tags;
    pageEntity.articleSection = page.article.series;
    pageEntity.mainEntityOfPage = url;
  } else if (page.schemaType === 'Article' && (page.design || page.note)) {
    const content = page.design ?? page.note;
    pageEntity.headline = content.title;
    if (content.updatedAt) pageEntity.dateModified = content.updatedAt;
    pageEntity.author = { '@id': PERSON_ID };
    pageEntity.image = image;
  }
  const breadcrumb = { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
    itemListElement: breadcrumbItems(page, site.siteUrl).map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name, item: item.url
    })) };
  return { '@context': 'https://schema.org', '@graph': [pageEntity, breadcrumb] };
}

function breadcrumbItems(page, siteUrl) {
  const items = [{ name: '首页', url: `${siteUrl}/` }];
  if (page.file.startsWith('pages/blog/')) items.push({ name: '文章', url: `${siteUrl}/pages/blog.html` });
  else if (page.file.startsWith('pages/journal/')) items.push({ name: '研究', url: `${siteUrl}/pages/journal.html` });
  else if (page.file.startsWith('pages/framework/')) items.push({ name: 'Framework', url: `${siteUrl}/pages/framework.html` });
  items.push({ name: page.title.replace(/ \| .*$/u, ''), url: `${siteUrl}${page.canonical}` });
  return items;
}
