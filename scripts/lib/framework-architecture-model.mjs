export const FRAMEWORK_ARCHITECTURE_COMMIT = '9d436c62f5cfbe78c84c9ef44fe8b5f8214d5cd1';
export const FRAMEWORK_ARCHITECTURE_PAGE_IDS = ['governance', 'cross-engine', 'decisions', 'runtime', 'ui', 'gameplay'];
export const FRAMEWORK_DECISION_IDS = ['engine-boundary', 'explicit-ownership', 'architecture-as-code', 'di-not-everywhere', 'mvvm-not-default', 'evidence-before-claims', 'generated-projections', 'consumer-independent-proof', 'fail-closed-promotion', 'domain-last'];

export function assertFrameworkArchitecture(value) {
  assertObject(value, 'framework architecture');
  assertKeys(value, ['schemaVersion', 'id', 'frameworkCommit', 'pages', 'decisions'], 'framework architecture');
  if (value.schemaVersion !== 1 || value.id !== 'framework-architecture' || value.frameworkCommit !== FRAMEWORK_ARCHITECTURE_COMMIT) throw new Error('framework architecture identity drift');
  assertOrdered(value.pages, FRAMEWORK_ARCHITECTURE_PAGE_IDS, 'architecture pages', ['id','route','eyebrow','title','summary','status','solves','costs','whereNotApply','focusPoints','failureModes','tradeoffs'], (entry, label) => {
    for (const key of ['route','eyebrow','title','summary','solves','costs','whereNotApply']) assertText(entry[key], `${label}.${key}`);
    if (entry.route !== `pages/framework/${entry.id}.html` || entry.status !== 'implemented') throw new Error(`${label} route or status drift`);
    for (const key of ['focusPoints','failureModes','tradeoffs']) assertTextList(entry[key], `${label}.${key}`, 3);
  });
  assertOrdered(value.decisions, FRAMEWORK_DECISION_IDS, 'architecture decisions', ['id','title','problem','constraints','naiveApproach','failure','decision','tradeoffs','value'], (entry, label) => {
    for (const key of ['title','problem','constraints','naiveApproach','failure','decision','tradeoffs','value']) assertText(entry[key], `${label}.${key}`);
  });
  rejectPrivateOrOverstated(value, 'framework architecture');
  return true;
}

export function resolveFrameworkArchitecture(value) {
  assertFrameworkArchitecture(value);
  return {...value, pages:value.pages.map((entry)=>({...entry,focusPoints:[...entry.focusPoints],failureModes:[...entry.failureModes],tradeoffs:[...entry.tradeoffs]})), decisions:value.decisions.map((entry)=>({...entry}))};
}

function assertOrdered(entries, ids, label, keys, validate) { if (!Array.isArray(entries) || entries.length !== ids.length) throw new Error(`${label} must contain exactly ${ids.length}`); entries.forEach((entry,index)=>{ assertObject(entry,`${label}[${index}]`); assertKeys(entry,keys,`${label}[${index}]`); if(entry.id!==ids[index]) throw new Error(`${label} order drift`); validate(entry,`${label}[${index}]`); }); }
function assertObject(value,label){ if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype) throw new Error(`${label} must be a plain object`); }
function assertKeys(value,keys,label){ if(JSON.stringify(Object.keys(value).sort())!==JSON.stringify([...keys].sort())) throw new Error(`${label} keys drift`); }
function assertText(value,label){ if(typeof value!=='string'||!value.trim()||/[\u0000-\u001f]/u.test(value)) throw new Error(`${label} must be text`); }
function assertTextList(value,label,min){ if(!Array.isArray(value)||value.length<min||new Set(value).size!==value.length) throw new Error(`${label} must contain ${min} unique entries`); value.forEach((entry)=>assertText(entry,label)); }
function rejectPrivateOrOverstated(value,label){ const text=JSON.stringify(value); for(const token of ['/Users/','file://','git@','production-ready','Production-grade']) if(text.includes(token)) throw new Error(`${label} contains forbidden claim`); }
