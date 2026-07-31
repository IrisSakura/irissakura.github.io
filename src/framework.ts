export {};

interface FrameworkSummary {
    packageCount: number;
    catalogModuleCount: number;
    presetCount: number;
    profileCount: number;
    asmdefCount: number;
}

interface FrameworkLayer {
    id: string;
    description: string;
    packageCount: number;
}

interface FrameworkModule {
    id: string;
    displayName: string;
    description: string;
}

interface FrameworkPublicData {
    schemaVersion: number;
    sourceCommit: string;
    generatedAt: string;
    adoptionReviewContract: string;
    adoptionReviewHash: string;
    summary: FrameworkSummary;
    lifecycleCounts: Record<string, number>;
    layers: FrameworkLayer[];
    featuredModules: FrameworkModule[];
}

type ModuleCategory = 'foundation' | 'gameplay' | 'experience';

interface ModulePresentation {
    displayName?: string;
    category: ModuleCategory;
    categoryLabel: string;
    icon: string;
    summary: string;
    capabilities: string[];
    useCases: string[];
    route: string[];
    layerId: string;
    keywords: string[];
}

interface LayerPresentation {
    displayName: string;
    role: string;
    decision: string;
}

interface LifecyclePresentation {
    description: string;
    tone: string;
}

const MODULE_PRESENTATIONS: Record<string, ModulePresentation> = {
    core: {
        category: 'foundation',
        categoryLabel: '基础',
        icon: 'fa-cubes',
        summary: '统一生命周期、服务注册与宿主边界，为所有上层能力提供稳定起点。',
        capabilities: ['生命周期与作用域', '服务注册与解析', '时间、日志与通用契约'],
        useCases: ['建立新项目启动骨架', '隔离引擎依赖与业务规则'],
        route: ['安装 Core 包', '创建框架 Host', '按需注册上层模块'],
        layerId: 'foundation',
        keywords: ['host', 'scope', 'service', 'bootstrap', '生命周期', '服务']
    },
    bootstrap: {
        displayName: 'Bootstrap / DI',
        category: 'foundation',
        categoryLabel: '基础',
        icon: 'fa-diagram-project',
        summary: '集中管理项目启动、依赖注入装配和模块作用域，让服务注册、初始化与释放只有一个明确入口。',
        capabilities: ['组合根与启动顺序', 'VContainer 与服务注册适配', 'App、Scene、Gameplay 作用域'],
        useCases: ['搭建可替换服务的新项目骨架', '避免模块被多个 Host 重复初始化'],
        route: ['安装 Core 与 Bootstrap', '定义项目 Installer 或容器', '按作用域注册并启动可选模块'],
        layerId: 'runtime-service',
        keywords: ['bootstrap', 'di', 'dependency injection', 'vcontainer', 'installer', '依赖注入', '生命周期', '装配']
    },
    'ecs-runtime': {
        displayName: 'ECS Runtime',
        category: 'foundation',
        categoryLabel: '基础',
        icon: 'fa-network-wired',
        summary: '提供后端中立的 ECS 会话与宿主边界，可按项目能力选择 Portable Arch 或 Unity Entities。',
        capabilities: ['后端中立 Session', 'Portable Arch 运行时', 'Unity Entities 条件适配'],
        useCases: ['高密度单位与数据导向系统', '在不锁定后端的前提下逐步引入 ECS'],
        route: ['安装 ECS Runtime', '选择 Arch 或 Entities 能力', '接入 Session、Host 与业务系统'],
        layerId: 'adapter-bridge',
        keywords: ['ecs', 'entity', 'entities', 'arch', 'dots', 'session', '数据导向', '实体']
    },
    pooling: {
        category: 'foundation',
        categoryLabel: '基础',
        icon: 'fa-boxes-stacked',
        summary: '统一复用 GameObject 与纯 C# 对象，明确获取、归还和清理边界，减少高频分配与实例化成本。',
        capabilities: ['GameObject 对象池', '纯 C# 对象复用', '容量与释放治理'],
        useCases: ['弹幕、特效和敌人生成', '高频临时消息与数据对象'],
        route: ['选择对象池类型', '配置创建与重置策略', '在 Owner 结束时归还或释放'],
        layerId: 'foundation',
        keywords: ['pool', 'pooling', 'reuse', 'allocation', '对象池', '复用', '分配']
    },
    event: {
        category: 'foundation',
        categoryLabel: '基础',
        icon: 'fa-tower-broadcast',
        summary: '用明确的发布与订阅边界连接玩法、UI 和运行时服务，降低跨系统耦合。',
        capabilities: ['类型化事件通道', '同步与异步分发', '订阅生命周期管理'],
        useCases: ['战斗结果通知 UI', '跨场景广播运行时状态'],
        route: ['定义事件事实', '注册订阅者', '由业务入口发布事件'],
        layerId: 'runtime-service',
        keywords: ['event', 'message', 'signal', 'publish', '事件', '消息', '通信']
    },
    asset: {
        category: 'foundation',
        categoryLabel: '基础',
        icon: 'fa-box-open',
        summary: '收敛资源引用、加载入口和释放责任，让玩法代码不直接依赖路径与加载后端。',
        capabilities: ['统一资源句柄', '异步加载入口', '引用与释放治理'],
        useCases: ['加载角色和关卡资源', '替换 Addressables 或自定义后端'],
        route: ['声明资源引用', '通过服务请求句柄', '在作用域结束时释放'],
        layerId: 'runtime-service',
        keywords: ['asset', 'addressables', 'load', 'resource', '资源', '加载']
    },
    gas: {
        category: 'gameplay',
        categoryLabel: '玩法',
        icon: 'fa-fire-flame-curved',
        summary: '把标签、属性、效果和技能执行组织成可组合规则，支撑持续扩展的战斗系统。',
        capabilities: ['Gameplay Tag', '属性与效果结算', '技能激活与冷却'],
        useCases: ['角色技能与 Buff', '装备词条和持续伤害'],
        route: ['建立标签与属性', '配置效果规则', '从技能入口提交执行'],
        layerId: 'gameplay-kernel',
        keywords: ['gas', 'ability', 'effect', 'tag', '技能', '属性', '效果', '战斗']
    },
    ai: {
        category: 'gameplay',
        categoryLabel: '玩法',
        icon: 'fa-brain',
        summary: '组合决策评分、行为执行和上下文数据，快速搭建可解释的敌人与 NPC 行为。',
        capabilities: ['行为树与任务节点', 'Utility 决策评分', '黑板与感知上下文'],
        useCases: ['敌人战斗决策', 'NPC 日程和目标选择'],
        route: ['定义上下文数据', '组合决策或行为节点', '由 Agent 驱动更新'],
        layerId: 'gameplay-kernel',
        keywords: ['ai', 'behavior', 'utility', 'blackboard', 'npc', '行为树', '决策']
    },
    save: {
        category: 'experience',
        categoryLabel: '体验',
        icon: 'fa-floppy-disk',
        summary: '通过统一存档与序列化边界保存玩家进度，并把版本迁移、读写入口和业务状态解耦。',
        capabilities: ['存档读写入口', '序列化与版本迁移', '槽位与进度管理'],
        useCases: ['Run 进度与长期成长', '设置、角色和世界状态持久化'],
        route: ['定义可持久化数据', '选择存储与序列化实现', '在明确时机提交和恢复快照'],
        layerId: 'runtime-service',
        keywords: ['save', 'persistence', 'serialize', 'snapshot', '存档', '持久化', '序列化']
    },
    input: {
        category: 'experience',
        categoryLabel: '体验',
        icon: 'fa-gamepad',
        summary: '把设备输入、动作语义和复杂指令识别分离，让键鼠、手柄与玩法命令共享同一接入边界。',
        capabilities: ['Input System 抽象', '动作映射与设备切换', '搓招与组合输入'],
        useCases: ['跨设备角色控制', '格斗指令和快捷操作'],
        route: ['声明业务动作', '绑定设备输入', '将动作转发到玩法命令'],
        layerId: 'runtime-service',
        keywords: ['input', 'action', 'gamepad', 'combo', '输入', '手柄', '搓招']
    },
    networking: {
        category: 'experience',
        categoryLabel: '体验',
        icon: 'fa-link',
        summary: '封装断线重连、心跳与消息序列对齐，为联机玩法提供可观察、可恢复的连接状态。',
        capabilities: ['重连状态机', '心跳与超时检测', '消息序列对齐'],
        useCases: ['弱网环境恢复', '客户端状态同步和连接诊断'],
        route: ['接入传输实现', '配置心跳与重试策略', '订阅连接状态并恢复会话'],
        layerId: 'runtime-service',
        keywords: ['network', 'networking', 'reconnect', 'heartbeat', 'sync', '网络', '重连', '同步']
    },
    ui: {
        category: 'experience',
        categoryLabel: '体验',
        icon: 'fa-window-maximize',
        summary: '统一页面路由、数据绑定和交互状态，让界面可以独立于具体场景持续演进。',
        capabilities: ['页面与弹窗路由', 'MVVM 数据绑定', 'UI 生命周期与层级'],
        useCases: ['主界面和功能页面', '复杂列表与状态反馈'],
        route: ['声明页面与 ViewModel', '注册路由入口', '绑定业务状态与命令'],
        layerId: 'runtime-service',
        keywords: ['ui', 'mvvm', 'route', 'viewmodel', '界面', '路由', '绑定']
    }
};

const FALLBACK_MODULES: FrameworkModule[] = Object.entries(MODULE_PRESENTATIONS).map(([id, presentation]) => ({
    id,
    displayName: {
        core: 'Core 核心',
        event: 'Event 事件',
        asset: 'Asset 资源',
        bootstrap: 'Bootstrap / DI',
        'ecs-runtime': 'ECS Runtime',
        pooling: 'Pooling 对象池',
        gas: 'GAS 技能',
        ai: 'AI 决策',
        save: 'Save 存档',
        input: 'Input 输入',
        networking: 'Networking 重连同步',
        ui: 'UI 界面'
    }[id] ?? presentation.displayName ?? id,
    description: presentation.summary
}));

const LAYER_PRESENTATIONS: Record<string, LayerPresentation> = {
    'adapter-bridge': {
        displayName: 'Adapter Bridge',
        role: '连接 Unity、ECS、Native 或外部后端，同时保护 Core 不被具体引擎实现反向污染。',
        decision: '当能力需要访问引擎 API 或替换外部后端时，把绑定放在这一层。'
    },
    'domain-framework': {
        displayName: 'Domain Framework',
        role: '组合多个通用内核，形成面向生存、模拟、策略等具体游戏类型的可选框架。',
        decision: '只有跨项目复用的玩法域模型才进入这一层，单个游戏内容仍留在项目侧。'
    },
    foundation: {
        displayName: 'Foundation',
        role: '提供稳定、低依赖、可被上层重复使用的基础契约。',
        decision: '当能力不应依赖具体玩法或 Unity 场景对象时，优先落在这一层。'
    },
    'gameplay-kernel': {
        displayName: 'Gameplay Kernel',
        role: '沉淀属性、AI、任务、战斗等可跨游戏类型复用的玩法规则。',
        decision: '当规则有清晰输入输出且能脱离具体关卡内容复用时，归入这一层。'
    },
    'runtime-service': {
        displayName: 'Runtime Service',
        role: '承载资源、存档、输入、UI、网络等项目运行期间持续存在的通用服务。',
        decision: '当能力需要生命周期、异步任务或平台服务，但不定义玩法规则时，归入这一层。'
    },
    'tooling-docs': {
        displayName: 'Tooling & Docs',
        role: '提供编辑器工具、安装器、验证脚本和文档投影，降低使用与维护成本。',
        decision: '不会进入玩家运行时、但能改善开发体验或治理质量的能力放在这一层。'
    }
};

const LIFECYCLE_PRESENTATIONS: Record<string, LifecyclePresentation> = {
    Supported: {
        description: '已有稳定使用边界、验证证据和维护承诺的框架能力。',
        tone: 'supported'
    },
    Preview: {
        description: '能力可用并持续收敛，适合试用，但接口或接入路径仍可能调整。',
        tone: 'preview'
    },
    Experimental: {
        description: '用于验证方向和核心假设，默认不进入稳定项目依赖闭包。',
        tone: 'experimental'
    },
    Research: {
        description: '处于研究与设计阶段，尚未形成承诺可用的运行时产品。',
        tone: 'research'
    },
    DocsOnly: {
        description: '只提供文档、设计或使用指导，不作为可安装运行时包发布。',
        tone: 'docs'
    },
    Frozen: {
        description: '保留兼容和历史用途，通常只接受必要修复，不再主动扩展。',
        tone: 'frozen'
    },
    Deprecated: {
        description: '已进入迁移窗口，不建议新项目继续采用。',
        tone: 'deprecated'
    }
};

const LIFECYCLE_ORDER = ['Supported', 'Preview', 'Experimental', 'Research', 'DocsOnly', 'Frozen', 'Deprecated'];

class FrameworkPage {
    private modules: FrameworkModule[] = FALLBACK_MODULES;
    private layers: FrameworkLayer[] = [];
    private lifecycleCounts: Record<string, number> = {};
    private packageCount = 0;
    private moduleFilter = 'all';
    private moduleQuery = '';
    private selectedModuleId = 'core';
    private selectedLayerId = 'foundation';
    private selectedLifecycle = 'Supported';

    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    private init(): void {
        this.setupEventListeners();
        this.applyModuleHash();
        this.renderFeaturedModules();
        void this.loadFrameworkData();
    }

    private isNonNegativeInteger(value: unknown): value is number {
        return Number.isInteger(value) && (value as number) >= 0;
    }

    private validateFrameworkData(value: unknown): value is FrameworkPublicData {
        if (!value || typeof value !== 'object') return false;
        const data = value as Partial<FrameworkPublicData>;
        if (data.schemaVersion !== 1 || typeof data.sourceCommit !== 'string' || Number.isNaN(Date.parse(data.generatedAt ?? ''))) return false;
        if (data.adoptionReviewContract !== 'supported-stable-v1') return false;
        if (typeof data.adoptionReviewHash !== 'string' || !/^sha256:[0-9a-f]{64}$/.test(data.adoptionReviewHash)) return false;
        if (!data.summary || typeof data.summary !== 'object') return false;
        const summary = data.summary as Partial<FrameworkSummary>;
        for (const key of ['packageCount', 'catalogModuleCount', 'presetCount', 'profileCount', 'asmdefCount'] as const) {
            if (!this.isNonNegativeInteger(summary[key])) return false;
        }
        if (!data.lifecycleCounts || typeof data.lifecycleCounts !== 'object') return false;
        if (!Object.values(data.lifecycleCounts).every(value => this.isNonNegativeInteger(value))) return false;
        if (!Array.isArray(data.layers) || !data.layers.every(layer =>
            layer && typeof layer.id === 'string' && typeof layer.description === 'string' && this.isNonNegativeInteger(layer.packageCount))) return false;
        if (!Array.isArray(data.featuredModules) || !data.featuredModules.every(module =>
            module && typeof module.id === 'string' && typeof module.displayName === 'string' && typeof module.description === 'string')) return false;
        return true;
    }

    private async loadFrameworkData(): Promise<void> {
        const status = document.getElementById('framework-data-status');
        try {
            const response = await fetch('../data/framework.json', { cache: 'no-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const payload: unknown = await response.json();
            if (!this.validateFrameworkData(payload)) throw new Error('invalid public data contract');
            this.renderFrameworkData(payload);
            if (status) status.textContent = '已加载由框架权威清单生成的公开快照。';
        } catch (error) {
            if (status) status.textContent = '实时数据暂不可用，当前展示仓库内置的静态快照。';
            console.error('[framework-data] failed to load public framework snapshot', error);
        } finally {
            this.restoreSectionHash();
        }
    }

    private renderFrameworkData(data: FrameworkPublicData): void {
        this.modules = data.featuredModules.filter(module => MODULE_PRESENTATIONS[module.id]);
        if (this.modules.length === 0) this.modules = FALLBACK_MODULES;
        this.layers = data.layers;
        this.lifecycleCounts = data.lifecycleCounts;
        this.packageCount = data.summary.packageCount;

        this.setText('framework-package-count', data.summary.packageCount.toString());
        this.setText('framework-module-count', data.summary.catalogModuleCount.toString());
        this.setText('framework-profile-count', data.summary.profileCount.toString());
        this.setText('framework-source-commit', data.sourceCommit.slice(0, 7));

        const generatedAt = document.getElementById('framework-generated-at');
        if (generatedAt) {
            generatedAt.textContent = new Date(data.generatedAt).toLocaleDateString('zh-CN');
            generatedAt.setAttribute('datetime', data.generatedAt);
        }

        this.applyModuleHash();
        this.renderFeaturedModules();
        this.renderLayers();
        this.renderLifecycle();
    }

    private renderFeaturedModules(): void {
        const moduleList = document.getElementById('framework-module-list');
        if (!moduleList) return;

        const visibleModules = this.modules.filter(module => {
            const presentation = MODULE_PRESENTATIONS[module.id];
            if (!presentation) return false;
            const categoryMatches = this.moduleFilter === 'all' || presentation.category === this.moduleFilter;
            const searchable = [
                module.id,
                module.displayName,
                presentation.displayName ?? '',
                module.description,
                presentation.summary,
                ...presentation.capabilities,
                ...presentation.useCases,
                ...presentation.keywords
            ].join(' ').toLocaleLowerCase('zh-CN');
            return categoryMatches && searchable.includes(this.moduleQuery);
        });

        this.setText('framework-module-result-count', `${visibleModules.length} 个模块`);
        moduleList.replaceChildren();

        if (visibleModules.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'module-empty';
            const icon = document.createElement('i');
            icon.className = 'fas fa-filter-circle-xmark';
            icon.setAttribute('aria-hidden', 'true');
            const title = document.createElement('strong');
            title.textContent = '没有匹配的模块';
            const copy = document.createElement('span');
            copy.textContent = '换一个关键词或分类。';
            empty.append(icon, title, copy);
            moduleList.append(empty);
            return;
        }

        if (!visibleModules.some(module => module.id === this.selectedModuleId)) {
            this.selectedModuleId = visibleModules[0].id;
        }

        moduleList.append(...visibleModules.map(module => this.createModuleCard(module)));
        this.selectModule(this.selectedModuleId, false);
    }

    private createModuleCard(module: FrameworkModule): HTMLButtonElement {
        const presentation = MODULE_PRESENTATIONS[module.id];
        const button = document.createElement('button');
        button.className = 'module-card';
        button.type = 'button';
        button.dataset.moduleId = module.id;
        button.setAttribute('aria-pressed', String(module.id === this.selectedModuleId));

        const top = document.createElement('span');
        top.className = 'module-card-top';
        const icon = document.createElement('i');
        icon.className = `fas ${presentation.icon}`;
        icon.setAttribute('aria-hidden', 'true');
        const category = document.createElement('span');
        category.className = 'module-card-category';
        category.textContent = presentation.categoryLabel;
        top.append(icon, category);

        const title = document.createElement('span');
        title.className = 'module-card-title';
        title.textContent = this.moduleDisplayName(module);
        const description = document.createElement('span');
        description.className = 'module-card-description';
        description.textContent = this.moduleDescription(module);
        const action = document.createElement('span');
        action.className = 'module-card-action';
        action.textContent = '查看职责';
        const arrow = document.createElement('i');
        arrow.className = 'fas fa-arrow-right';
        arrow.setAttribute('aria-hidden', 'true');
        action.append(arrow);

        button.append(top, title, description, action);
        return button;
    }

    private selectModule(moduleId: string, updateHash = true): void {
        const module = this.modules.find(candidate => candidate.id === moduleId);
        const presentation = MODULE_PRESENTATIONS[moduleId];
        if (!module || !presentation) return;

        this.selectedModuleId = moduleId;
        document.querySelectorAll<HTMLButtonElement>('[data-module-id]').forEach(button => {
            const selected = button.dataset.moduleId === moduleId;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });

        this.setText('framework-module-detail-category', `${presentation.categoryLabel.toUpperCase()} · ${module.id.toUpperCase()}`);
        this.setText('framework-module-detail-title', this.moduleDisplayName(module));
        this.setText('framework-module-detail-description', this.moduleDescription(module));
        this.replaceIcon('framework-module-detail-icon', presentation.icon);
        this.replaceList('framework-module-capabilities', presentation.capabilities);
        this.replaceList('framework-module-use-cases', presentation.useCases);
        this.replaceList('framework-module-route', presentation.route);

        const layerLink = document.getElementById('framework-module-layer-link');
        if (layerLink) layerLink.dataset.layerId = presentation.layerId;

        if (updateHash) {
            history.replaceState(null, '', `${location.pathname}${location.search}#module-${moduleId}`);
            this.revealDetailOnNarrowLayout('framework-module-detail');
        }
    }

    private renderLayers(): void {
        const layerList = document.getElementById('framework-layer-list');
        if (!layerList || this.layers.length === 0) return;

        if (!this.layers.some(layer => layer.id === this.selectedLayerId)) {
            this.selectedLayerId = this.layers[0].id;
        }

        layerList.replaceChildren(...this.layers.map(layer => {
            const presentation = this.layerPresentation(layer.id);
            const button = document.createElement('button');
            button.className = 'principle-item';
            button.type = 'button';
            button.dataset.layerId = layer.id;
            button.setAttribute('aria-pressed', String(layer.id === this.selectedLayerId));

            const count = document.createElement('span');
            count.textContent = layer.packageCount.toString();
            const copy = document.createElement('div');
            const title = document.createElement('h3');
            title.textContent = presentation.displayName;
            const description = document.createElement('p');
            description.textContent = layer.description;
            const track = document.createElement('span');
            track.className = 'layer-share-track';
            const fill = document.createElement('span');
            fill.style.width = `${this.percentage(layer.packageCount, this.packageCount)}%`;
            track.append(fill);
            copy.append(title, description, track);
            button.append(count, copy);
            return button;
        }));

        this.selectLayer(this.selectedLayerId, false);
    }

    private selectLayer(layerId: string, focusDetail = true): void {
        const layer = this.layers.find(candidate => candidate.id === layerId);
        if (!layer) return;

        this.selectedLayerId = layerId;
        const presentation = this.layerPresentation(layerId);
        document.querySelectorAll<HTMLButtonElement>('#framework-layer-list [data-layer-id]').forEach(button => {
            const selected = button.dataset.layerId === layerId;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });

        this.setText('framework-layer-detail-title', presentation.displayName);
        this.setText('framework-layer-detail-description', layer.description);
        this.setText('framework-layer-detail-count', layer.packageCount.toString());
        this.setText('framework-layer-detail-share', `${this.percentage(layer.packageCount, this.packageCount)}%`);
        this.setText('framework-layer-detail-role', presentation.role);
        this.setText('framework-layer-detail-decision', presentation.decision);

        if (focusDetail) {
            document.getElementById('framework-layer-detail')?.classList.add('is-emphasized');
            window.setTimeout(() => document.getElementById('framework-layer-detail')?.classList.remove('is-emphasized'), 500);
            this.revealDetailOnNarrowLayout('framework-layer-detail');
        }
    }

    private renderLifecycle(): void {
        const lifecycleList = document.getElementById('framework-lifecycle-list');
        if (!lifecycleList || Object.keys(this.lifecycleCounts).length === 0) return;

        const names = Object.keys(this.lifecycleCounts).sort((left, right) => {
            const leftIndex = LIFECYCLE_ORDER.indexOf(left);
            const rightIndex = LIFECYCLE_ORDER.indexOf(right);
            return (leftIndex < 0 ? Number.MAX_SAFE_INTEGER : leftIndex) - (rightIndex < 0 ? Number.MAX_SAFE_INTEGER : rightIndex);
        });

        if (!names.includes(this.selectedLifecycle)) this.selectedLifecycle = names[0];
        lifecycleList.replaceChildren(...names.map(name => {
            const button = document.createElement('button');
            button.className = 'stat-item';
            button.type = 'button';
            button.dataset.lifecycleName = name;
            button.setAttribute('aria-pressed', String(name === this.selectedLifecycle));
            const count = document.createElement('strong');
            count.textContent = this.lifecycleCounts[name].toString();
            const label = document.createElement('span');
            label.textContent = name;
            button.append(count, label);
            return button;
        }));

        this.selectLifecycle(this.selectedLifecycle);
    }

    private selectLifecycle(name: string, revealDetail = false): void {
        if (!(name in this.lifecycleCounts)) return;
        this.selectedLifecycle = name;
        const presentation = LIFECYCLE_PRESENTATIONS[name] ?? {
            description: '该状态由框架清单定义，用于说明当前支持边界。',
            tone: 'default'
        };

        document.querySelectorAll<HTMLButtonElement>('[data-lifecycle-name]').forEach(button => {
            const selected = button.dataset.lifecycleName === name;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });

        this.setText('framework-lifecycle-detail-title', name);
        this.setText('framework-lifecycle-detail-description', presentation.description);
        this.setText('framework-lifecycle-detail-count', this.lifecycleCounts[name].toString());
        this.setText('framework-lifecycle-detail-share', `${this.percentage(this.lifecycleCounts[name], this.packageCount)}%`);

        const indicator = document.getElementById('framework-lifecycle-indicator');
        const detail = document.getElementById('framework-lifecycle-detail');
        if (indicator) indicator.dataset.tone = presentation.tone;
        if (detail) detail.dataset.tone = presentation.tone;
        if (revealDetail) this.revealDetailOnNarrowLayout('framework-lifecycle-detail');
    }

    private moduleDescription(module: FrameworkModule): string {
        const presentation = MODULE_PRESENTATIONS[module.id];
        const generatedDescription = module.description.trim();
        return generatedDescription && !/framework module\.?$/iu.test(generatedDescription)
            ? generatedDescription
            : presentation.summary;
    }

    private moduleDisplayName(module: FrameworkModule): string {
        return MODULE_PRESENTATIONS[module.id]?.displayName ?? module.displayName;
    }

    private layerPresentation(layerId: string): LayerPresentation {
        return LAYER_PRESENTATIONS[layerId] ?? {
            displayName: layerId.replace(/-/gu, ' '),
            role: '承载该架构层声明的框架职责。',
            decision: '依据依赖方向、运行时责任和复用边界决定能力归属。'
        };
    }

    private percentage(value: number, total: number): number {
        if (total <= 0) return 0;
        return Math.max(value > 0 ? 1 : 0, Math.round((value / total) * 100));
    }

    private replaceIcon(id: string, iconName: string): void {
        const container = document.getElementById(id);
        if (!container) return;
        const icon = document.createElement('i');
        icon.className = `fas ${iconName}`;
        icon.setAttribute('aria-hidden', 'true');
        container.replaceChildren(icon);
    }

    private replaceList(id: string, values: string[]): void {
        const list = document.getElementById(id);
        if (!list) return;
        list.replaceChildren(...values.map(value => {
            const item = document.createElement('li');
            item.textContent = value;
            return item;
        }));
    }

    private applyModuleHash(): void {
        const match = location.hash.match(/^#module-([a-z0-9-]+)$/iu);
        if (match && MODULE_PRESENTATIONS[match[1]]) {
            this.selectedModuleId = match[1];
        }
    }

    private restoreSectionHash(): void {
        const moduleHash = /^#module-[a-z0-9-]+$/iu.test(location.hash);
        const targetId = moduleHash ? 'modules' : location.hash.slice(1);
        if (!['modules', 'architecture', 'lifecycle'].includes(targetId)) return;

        window.requestAnimationFrame(() => {
            document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
        });
    }

    private revealDetailOnNarrowLayout(detailId: string): void {
        if (!window.matchMedia('(max-width: 1100px)').matches) return;
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

        window.requestAnimationFrame(() => {
            document.getElementById(detailId)?.scrollIntoView({ behavior, block: 'start' });
        });
    }

    private setText(id: string, value: string): void {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    private setupEventListeners(): void {
        document.getElementById('framework-module-search')?.addEventListener('input', event => {
            const input = event.currentTarget as HTMLInputElement;
            this.moduleQuery = input.value.trim().toLocaleLowerCase('zh-CN');
            this.renderFeaturedModules();
        });

        document.querySelectorAll<HTMLButtonElement>('[data-module-filter]').forEach(button => {
            button.addEventListener('click', () => {
                this.moduleFilter = button.dataset.moduleFilter ?? 'all';
                document.querySelectorAll<HTMLButtonElement>('[data-module-filter]').forEach(candidate => {
                    const selected = candidate === button;
                    candidate.classList.toggle('is-active', selected);
                    candidate.setAttribute('aria-pressed', String(selected));
                });
                this.renderFeaturedModules();
            });
        });

        document.getElementById('framework-module-list')?.addEventListener('click', event => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const button = target.closest<HTMLButtonElement>('[data-module-id]');
            if (button?.dataset.moduleId) this.selectModule(button.dataset.moduleId);
        });

        document.getElementById('framework-layer-list')?.addEventListener('click', event => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const button = target.closest<HTMLButtonElement>('[data-layer-id]');
            if (button?.dataset.layerId) this.selectLayer(button.dataset.layerId);
        });

        document.getElementById('framework-lifecycle-list')?.addEventListener('click', event => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const button = target.closest<HTMLButtonElement>('[data-lifecycle-name]');
            if (button?.dataset.lifecycleName) this.selectLifecycle(button.dataset.lifecycleName, true);
        });

        document.getElementById('framework-module-layer-link')?.addEventListener('click', event => {
            const button = event.currentTarget as HTMLButtonElement;
            const layerId = button.dataset.layerId;
            if (!layerId) return;
            this.selectLayer(layerId);
            document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        window.addEventListener('hashchange', () => {
            this.applyModuleHash();
            this.selectModule(this.selectedModuleId, false);
        });

    }
}

new FrameworkPage();
