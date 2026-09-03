const REQUIREMENT_STATUSES = [
  'implemented',
  'information-architecture-closed-with-deferred-status',
  'non-goal'
];
const REQUIREMENT_IDS = Array.from({ length: 95 }, (_, index) => 'REQ-' + String(index + 1).padStart(3, '0'));
const NON_GOAL_IDS = new Set(['REQ-075', 'REQ-091']);
const REQUIREMENT_SOURCE_DOCUMENT_HASH = 'a1d48ac2e64de9c6a4420461b7f5b26b6cc713990ca670384a702adcc58c998b';
const REQUIREMENT_TOPICS = [
  ...Array(10).fill('hub'), ...Array(4).fill('governance'), ...Array(5).fill('cross-engine'),
  ...Array(4).fill('runtime'), ...Array(4).fill('ui'), ...Array(3).fill('gameplay'),
  ...Array(3).fill('tooling'), ...Array(2).fill('card-balance'), ...Array(4).fill('evidence'),
  ...Array(3).fill('consumers'), ...Array(4).fill('decisions'), ...Array(3).fill('evolution'),
  ...Array(7).fill('homepage'), ...Array(2).fill('cases'), ...Array(3).fill('reference'),
  ...Array(6).fill('knowledge'),
  'cross-engine','governance','cases','consumers','tooling','evidence','evolution','scope','hub',
  'reader-paths','reader-paths','hub','decisions','hub','decisions','hub','maintenance','maintenance','hub',
  'maintenance','maintenance','maintenance','maintenance','scope','cases','cases','hub','hub'
];
const REQUIREMENT_TOPOLOGY = Object.freeze({
  hub: Object.freeze({ owner: 'data/framework-engineering.json', route: 'pages/framework-engineering.html#architecture-domains' }),
  homepage: Object.freeze({ owner: 'data/framework-story.json', route: 'pages/framework.html#architecture-map' }),
  governance: Object.freeze({ owner: 'data/framework-architecture.json', route: 'pages/framework/governance.html#overview' }),
  'cross-engine': Object.freeze({ owner: 'data/framework-architecture.json', route: 'pages/framework/cross-engine.html#overview' }),
  runtime: Object.freeze({ owner: 'data/framework-architecture.json', route: 'pages/framework/runtime.html#failure-model' }),
  ui: Object.freeze({ owner: 'data/framework-architecture.json', route: 'pages/framework/ui.html#tradeoffs' }),
  gameplay: Object.freeze({ owner: 'data/framework-architecture.json', route: 'pages/framework/gameplay.html#focus' }),
  tooling: Object.freeze({ owner: 'data/framework-evidence.json', route: 'pages/framework/tooling.html#toolchains' }),
  'card-balance': Object.freeze({ owner: 'data/framework-case-studies.json', route: 'pages/framework/cases/card-balance-toolchain.html#case-sections' }),
  evidence: Object.freeze({ owner: 'data/framework-evidence.json', route: 'pages/framework/evidence.html#evidence-ladder' }),
  consumers: Object.freeze({ owner: 'data/framework-evidence.json', route: 'pages/framework/consumers.html#consumer-matrix' }),
  decisions: Object.freeze({ owner: 'data/framework-architecture.json', route: 'pages/framework/decisions.html#decision-list' }),
  evolution: Object.freeze({ owner: 'data/framework-evolution.json', route: 'pages/framework/evolution.html#timeline' }),
  cases: Object.freeze({ owner: 'data/framework-case-studies.json', route: 'pages/framework/cases.html#case-grid' }),
  reference: Object.freeze({ owner: 'data/framework-module-reference.json', route: 'pages/framework/reference.html#module-reference' }),
  knowledge: Object.freeze({ owner: 'data/framework-knowledge-graph.json', route: 'pages/framework/knowledge.html#knowledge-series' }),
  'reader-paths': Object.freeze({ owner: 'data/framework-engineering.json', route: 'pages/framework-engineering.html#reader-paths' }),
  maintenance: Object.freeze({ owner: 'docs/maintenance/framework-engineering.md', route: 'pages/framework-engineering.html#adoption-route' }),
  scope: Object.freeze({ owner: 'data/framework-engineering.json', route: 'pages/framework-engineering.html#evidence-boundary' })
});
const REQUIREMENT_TITLES = [
  '背景',
  '当前核心问题',
  '当前网站与 Framework 实际状态的错位',
  'SakuraGameFramework 的网站定位应发生变化',
  '网站中的 Sakura 应从“项目”升级为“技术能力主证据库”',
  '新的内容深度模型',
  'D1 — System',
  'D2 — Architecture',
  'D3 — Evidence',
  '推荐的网站内容结构',
  'Architecture & Governance',
  '可展示的 Governance 内容',
  '推荐 Architecture Governance Case Study',
  'Governance 应体现 Architecture as Code',
  'Cross-Engine Architecture',
  'Cross-Engine 页面不应该只写“支持 Godot”',
  '推荐 Cross-Engine 架构图',
  'Engine Boundary 应作为核心设计原则',
  'Cross-Engine 推荐旗舰案例',
  'Runtime Lifecycle & Ownership',
  '生命周期页面应回答的问题',
  'Runtime Lifecycle 推荐图',
  'Lifecycle 内容不应只展示正常流程',
  'UI / Presentation Architecture',
  'UI 的核心公开观点',
  'UI 典型页面映射',
  'UI 页面应体现的设计判断',
  'Gameplay Kernel & Semantic Systems',
  '推荐 Gameplay Kernel 公开结构',
  '推荐 Gameplay 叙事',
  'Tooling / Developer Experience',
  'Tooling 不应变成截图合集',
  'Tooling 的核心价值',
  'Card Balance Analyzer 应成为旗舰 Case Study',
  'Card Balance Case Study 应回答',
  'Evidence Engineering',
  '推荐 Evidence Ladder',
  '建议统一公开 Evidence 状态',
  'Evidence 页面应明确限制',
  'Consumer Validation',
  'Consumer Matrix 推荐格式',
  'Consumer 页面真正要证明的内容',
  'Architecture Decisions / Trade-offs',
  '推荐 Architecture Decision 主题',
  '每个 Decision 的标准结构',
  '示例：为什么 MVVM 不是默认',
  'Framework Evolution',
  '推荐演进时间线',
  'Framework Evolution 的展示价值',
  'Framework 首页信息架构应重新设计',
  '生命周期和模块目录不应删除',
  'Framework 首页应该控制在 3 分钟阅读量',
  '第一屏：Framework Identity',
  '第一屏建议展示的关键标签',
  '第二屏：Architecture Map',
  '第三屏：Three Engineering Pillars',
  '首页推荐五个旗舰 Case Study',
  'Case Study 页面模板',
  'Module Explorer 的定位应下降',
  'Module Card 应增加的信息',
  '推荐 Module Card 示例',
  'Blog 与 Framework 应建立反向知识图谱',
  '推荐 Framework → Blog 组织方式',
  '建议增加 Framework Engineering Series 作为中心页面',
  'Evidence Chain 应显著扩展',
  '推荐 Evidence Chain 方向',
  'Evidence Chain 可以统一四大品牌板块',
  '当前最值得优先建设的五个区域',
  'P0 — Architecture Decisions & Governance',
  'P0 — Flagship Case Studies',
  'P1 — Consumer Evidence Matrix',
  'P1 — Toolchain / Designer Experience',
  'P1 — Evidence Model',
  'P2 — Framework Evolution Timeline',
  '不建议投入的内容',
  '推荐站点层级',
  '用户群需要分层',
  '因此需要三种入口',
  '网站叙事应从“我有什么”转向“我解决了什么”',
  '网站应直接展示 Trade-off',
  '推荐网站公开技术语气',
  '对 Framework Architecture 能力的最终展示目标',
  '与个人能力基准的对应关系',
  'Website 本身也可以成为 Engineering Evidence',
  '推荐继续强化同步模型',
  'Framework Website 的最终目标',
  '第一阶段验收标准',
  '第二阶段验收标准',
  '第三阶段验收标准',
  '推荐实施顺序',
  '第一阶段不要做的事情',
  '内容选择标准',
  '推荐内容优先级公式',
  '最终推荐的网站核心故事',
  '最终结论'
];

export { REQUIREMENT_IDS, REQUIREMENT_SOURCE_DOCUMENT_HASH, REQUIREMENT_STATUSES, REQUIREMENT_TITLES, REQUIREMENT_TOPICS, REQUIREMENT_TOPOLOGY };

export function assertFrameworkRequirementCoverage(value) {
  assertObject(value, 'framework requirement coverage');
  assertExactKeys(value, ['schemaVersion', 'id', 'planVersion', 'sourceDocumentHash', 'requirements'], 'framework requirement coverage');
  if (value.schemaVersion !== 1 || value.id !== 'framework-plan-coverage' || value.planVersion !== 7) {
    throw new Error('framework requirement coverage identity or plan version is unsupported');
  }
  if (value.sourceDocumentHash !== REQUIREMENT_SOURCE_DOCUMENT_HASH) {
    throw new Error('framework requirement coverage source document hash is unsupported');
  }
  if (!Array.isArray(value.requirements) || value.requirements.length !== REQUIREMENT_IDS.length) {
    throw new Error('framework requirement coverage must contain exactly 95 requirements');
  }
  value.requirements.forEach((entry, index) => {
    const label = 'framework requirement ' + (index + 1);
    assertObject(entry, label);
    assertString(entry.id, label + ' id');
    if (entry.id !== REQUIREMENT_IDS[index]) throw new Error('framework requirements must be ordered REQ-001 through REQ-095');
    assertString(entry.title, label + ' title');
    if (entry.sourceSection !== index + 1) {
      throw new Error(label + ' sourceSection must match its ordered source section');
    }
    if (entry.title !== REQUIREMENT_TITLES[index]) {
      throw new Error(label + ' title must match its source document heading');
    }
    assertString(entry.topic, label + ' topic');
    if (entry.topic !== REQUIREMENT_TOPICS[index]) throw new Error(label + ' topic must match the reviewed section topology');
    const topology = REQUIREMENT_TOPOLOGY[entry.topic];
    if (!topology || entry.owner !== topology.owner || entry.route !== topology.route) throw new Error(label + ' owner or route does not match its topic authority');
    assertEnum(entry.status, REQUIREMENT_STATUSES, label + ' status');
    assertString(entry.owner, label + ' owner');
    assertRoute(entry.route, label + ' route');
    if (entry.status === 'implemented') {
      assertExactKeys(entry, ['id', 'title', 'sourceSection', 'topic', 'status', 'owner', 'route', 'evidence'], label);
      assertString(entry.evidence, label + ' evidence');
      if (!entry.evidence.includes(entry.title) || !entry.evidence.includes(entry.route)) throw new Error(label + ' evidence must identify its source heading and rendered route');
    } else {
      assertExactKeys(entry, ['id', 'title', 'sourceSection', 'topic', 'status', 'owner', 'route', 'deferredReason'], label);
      assertString(entry.deferredReason, label + ' deferredReason');
    }
    if (entry.status === 'non-goal' && !NON_GOAL_IDS.has(entry.id)) {
      throw new Error(entry.id + ' is not approved as a non-goal');
    }
    if (NON_GOAL_IDS.has(entry.id) && entry.status !== 'non-goal') {
      throw new Error(entry.id + ' must remain non-goal');
    }
    if (!NON_GOAL_IDS.has(entry.id) && entry.status !== 'implemented') throw new Error(entry.id + ' is locally deliverable and must be implemented in V7');
  });
  const serialized = JSON.stringify(value);
  for (const forbidden of ['/Users/', 'file://', 'git@', 'runner-passed', 'production-ready']) {
    if (serialized.includes(forbidden)) throw new Error('framework requirement coverage contains forbidden content: ' + forbidden);
  }
  return true;
}

export function resolveFrameworkRequirementCoverage(value) {
  assertFrameworkRequirementCoverage(value);
  return { ...value, requirements: value.requirements.map((entry) => ({ ...entry })) };
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new Error(label + ' must be a plain object');
  }
}

function assertExactKeys(value, expected, label) {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(sortedExpected)) {
    throw new Error(label + ' keys must be exactly ' + expected.join(', '));
  }
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '' || /[\u0000-\u001f]/u.test(value)) {
    throw new Error(label + ' must be clean non-empty text');
  }
}

function assertRoute(value, label) {
  assertString(value, label);
  if (!/^(?:#[a-z0-9-]+|(?:\.\.\/)?(?:index|[a-z0-9-]+)\.html(?:#[a-z0-9-]+)?|pages\/(?:framework\/cases\/[a-z0-9-]+|framework\/[a-z0-9-]+|[a-z0-9-]+)\.html(?:#[a-z0-9-]+)?)$/u.test(value)) {
    throw new Error(label + ' must be a public site route');
  }
}

function assertEnum(value, values, label) {
  if (!values.includes(value)) throw new Error(label + ' must be one of ' + values.join(', '));
}
