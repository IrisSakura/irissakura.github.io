export const UPDATE_TYPES = Object.freeze({ work: '作品', project: '项目', writing: '文章', mod: 'Mod', site: '个人网站', research: '研究' });
const fail = (message) => { throw new Error(`living-site: ${message}`); };
const text = (value, label) => { if (typeof value !== 'string' || !value.trim()) fail(`${label} must be nonempty`); };
export function assertLivingDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) fail('invalid date');
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) fail('invalid date');
}
export function assertLivingHref(href) {
  if (href === undefined || href === null) return;
  if (typeof href !== 'string' || /[\s\\\u0000-\u001f]/u.test(href)) fail('unsafe href');
  if (/^\/(?!\/)/u.test(href) && !href.includes('..') && !/%(?:2e|2f|5c)/iu.test(href)) return;
  try {
    const url = new URL(href);
    if (url.protocol === 'https:' && !url.username && !url.password) return;
  } catch { /* Report all unsupported URL forms through the same boundary. */ }
  fail('unsafe href');
}
function entries(items, label, summary, max = Infinity) {
  if (!Array.isArray(items) || items.length > max) fail(`invalid ${label} list`);
  const ids = new Set();
  for (const item of items) {
    if (!item || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(item.id ?? '') || ids.has(item.id)) fail(`duplicate or invalid ${label} id`);
    ids.add(item.id);
    text(item.title, `${label} title`);
    if (summary) text(item.summary, `${label} summary`);
    assertLivingHref(item.href);
  }
}
export function assertNowData(data) {
  if (data?.schemaVersion !== 1) fail('unsupported Now schema');
  assertLivingDate(data.updatedAt);
  text(data.intro, 'Now intro');
  entries(data.current, 'current', true);
  entries(data.thinking, 'thinking', false, 4);
  entries(data.recentlyCompleted, 'recentlyCompleted', true, 5);
  return data;
}
export function shanghaiToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function assertUpdatesData(data, { today = shanghaiToday() } = {}) {
  if (data?.schemaVersion !== 1) fail('unsupported Updates schema');
  assertLivingDate(today);
  entries(data.items, 'update', true);
  let previous = '9999-12-31';
  for (const item of data.items) {
    assertLivingDate(item.date);
    if (item.date > today) fail('future date');
    if (item.date > previous) fail('updates must be in descending date order');
    previous = item.date;
    if (!Object.hasOwn(UPDATE_TYPES, item.type)) fail('unknown update type');
  }
  return data;
}
function limitCount(limit) { if (!Number.isInteger(limit) || limit < 1) fail('limit must be a positive integer'); }
export function resolveCurrentNow(data) { return structuredClone(assertNowData(data)); }
export function resolveRecentUpdates(data, limit, options) {
  limitCount(limit);
  return structuredClone(assertUpdatesData(data, options).items.slice(0, limit));
}
export function resolveHomeWriting(publishedBlogs, limit) {
  limitCount(limit);
  return [...publishedBlogs].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug)).slice(0, limit);
}
