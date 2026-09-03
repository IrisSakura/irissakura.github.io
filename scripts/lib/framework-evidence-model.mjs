const COMMIT='9d436c62f5cfbe78c84c9ef44fe8b5f8214d5cd1';
const PAGE_IDS=['tooling','evidence','consumers','cases'];
const TOOL_IDS=['card-balance','runtime-console','public-projection'];
const TOPIC_IDS=['godot','lifecycle','ui','consumer'];
const CONSUMER_IDS=['route-wave-td','kitchen-shift','railworks-factory','living-bestiary','ashfall-loot-run','willow-hearth','gamejam-game'];
export { PAGE_IDS as FRAMEWORK_EVIDENCE_PAGE_IDS };
export function assertFrameworkEvidence(value){
  object(value,'framework evidence'); keys(value,['schemaVersion','id','frameworkCommit','pages','toolchains','evidenceTopics','consumerHypotheses'],'framework evidence');
  if(value.schemaVersion!==1||value.id!=='framework-evidence'||value.frameworkCommit!==COMMIT) throw new Error('framework evidence identity drift');
  ordered(value.pages,PAGE_IDS,'evidence pages',['id','route','eyebrow','title','summary','solves','costs','whereNotApply'],(entry,label)=>{ texts(entry,['route','eyebrow','title','summary','solves','costs','whereNotApply'],label); if(entry.route!==`pages/framework/${entry.id}.html`) throw new Error(`${label} route drift`); });
  ordered(value.toolchains,TOOL_IDS,'toolchains',['id','title','workflow','status','boundary'],(entry,label)=>{ texts(entry,['title','status','boundary'],label); list(entry.workflow,`${label}.workflow`,4); });
  ordered(value.evidenceTopics,TOPIC_IDS,'evidence topics',['id','title','status','summary'],(entry,label)=>texts(entry,['title','status','summary'],label));
  ordered(value.consumerHypotheses,CONSUMER_IDS,'consumer hypotheses',['caseId','question'],(entry,label)=>{ if(entry.caseId!==CONSUMER_IDS[Number(label.match(/\d+/u)?.[0]??0)]){} text(entry.question,`${label}.question`); },'caseId');
  const raw=JSON.stringify(value); for(const token of ['/Users/','file://','git@','production-ready','Production-grade']) if(raw.includes(token)) throw new Error('framework evidence contains forbidden claim');
  return true;
}
export function resolveFrameworkEvidence(value){ assertFrameworkEvidence(value); return {...value,pages:value.pages.map((x)=>({...x})),toolchains:value.toolchains.map((x)=>({...x,workflow:[...x.workflow]})),evidenceTopics:value.evidenceTopics.map((x)=>({...x})),consumerHypotheses:value.consumerHypotheses.map((x)=>({...x}))}; }
function ordered(entries,ids,label,expected,validate,idKey='id'){ if(!Array.isArray(entries)||entries.length!==ids.length) throw new Error(`${label} count drift`); entries.forEach((entry,index)=>{object(entry,`${label}[${index}]`);keys(entry,expected,`${label}[${index}]`);if(entry[idKey]!==ids[index])throw new Error(`${label} order drift`);validate(entry,`${label}[${index}]`);}); }
function object(value,label){if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)throw new Error(`${label} must be object`);}
function keys(value,expected,label){if(JSON.stringify(Object.keys(value).sort())!==JSON.stringify([...expected].sort()))throw new Error(`${label} keys drift`);}
function text(value,label){if(typeof value!=='string'||!value.trim()||/[\u0000-\u001f]/u.test(value))throw new Error(`${label} must be text`);}
function texts(value,names,label){names.forEach((name)=>text(value[name],`${label}.${name}`));}
function list(value,label,count){if(!Array.isArray(value)||value.length!==count||new Set(value).size!==count)throw new Error(`${label} must contain ${count} unique entries`);value.forEach((item)=>text(item,label));}
