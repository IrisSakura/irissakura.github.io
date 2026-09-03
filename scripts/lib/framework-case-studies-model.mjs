const COMMIT='9d436c62f5cfbe78c84c9ef44fe8b5f8214d5cd1';
export const FRAMEWORK_CASE_IDS=['cross-engine-foundation','lifecycle-ownership','paradigm-neutral-ui','card-balance-toolchain','independent-consumer-validation'];
export const FRAMEWORK_CASE_SECTION_ORDER=['problem','constraints','naiveApproach','architectureDecision','systemModel','failureModel','tradeOffs','implementation','evidence','consumer','knownLimitations','whatChangedAfterValidation'];
export function assertFrameworkCaseStudies(value){
  object(value,'case studies'); keys(value,['schemaVersion','id','frameworkCommit','sectionOrder','cases'],'case studies');
  if(value.schemaVersion!==1||value.id!=='framework-case-studies'||value.frameworkCommit!==COMMIT)throw new Error('case studies identity drift');
  if(JSON.stringify(value.sectionOrder)!==JSON.stringify(FRAMEWORK_CASE_SECTION_ORDER))throw new Error('case section order drift');
  if(!Array.isArray(value.cases)||value.cases.length!==5)throw new Error('exactly five flagship cases required');
  value.cases.forEach((entry,index)=>{ object(entry,`case[${index}]`);keys(entry,['id','route','index','title','subtitle','status','sections'],`case[${index}]`);if(entry.id!==FRAMEWORK_CASE_IDS[index]||entry.index!==String(index+1).padStart(2,'0')||entry.route!==`pages/framework/cases/${entry.id}.html`)throw new Error('case identity or route drift');for(const key of ['title','subtitle','status'])text(entry[key],`case.${key}`);object(entry.sections,'case sections');keys(entry.sections,FRAMEWORK_CASE_SECTION_ORDER,'case sections');FRAMEWORK_CASE_SECTION_ORDER.forEach((key)=>text(entry.sections[key],`case.sections.${key}`)); });
  const raw=JSON.stringify(value);for(const token of ['/Users/','file://','git@','production-ready','Production-grade'])if(raw.includes(token))throw new Error('case studies contain forbidden claim');return true;
}
export function resolveFrameworkCaseStudies(value){assertFrameworkCaseStudies(value);return{...value,sectionOrder:[...value.sectionOrder],cases:value.cases.map((entry)=>({...entry,sections:{...entry.sections}}))};}
function object(value,label){if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)throw new Error(`${label} must be object`);}
function keys(value,expected,label){if(JSON.stringify(Object.keys(value).sort())!==JSON.stringify([...expected].sort()))throw new Error(`${label} keys drift`);}
function text(value,label){if(typeof value!=='string'||!value.trim()||/[\u0000-\u001f]/u.test(value))throw new Error(`${label} must be text`);}
