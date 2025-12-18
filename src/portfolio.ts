// 作品类型定义
interface PortfolioItem {
    id: number;
    title: string;
    category: 'game' | 'art' | 'music' | 'tool';
    description: string;
    tags: string[];
    year: number;
    role: string;
    link?: string;
}

// 作品集应用类
class PortfolioApp {
    private portfolioGrid: HTMLElement | null;
    private filterButtons: NodeListOf<HTMLElement>;
    private loadMoreBtn: HTMLElement | null;
    private currentFilter: string = 'all';
    private displayedItems: number = 6;
    private allItems: PortfolioItem[] = [];

    constructor() {
        this.portfolioGrid = document.getElementById('portfolio-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.loadMoreBtn = document.getElementById('load-more-btn');

        this.init();
    }

    private async init(): Promise<void> {
        // 设置当前年份
        this.setCurrentYear();

        // 加载作品数据
        await this.loadPortfolioItems();

        // 初始化事件监听器
        this.setupEventListeners();

        // 渲染作品
        this.renderPortfolioItems();
    }

    private async loadPortfolioItems(): Promise<void> {
        try {
            // 模拟从API加载数据
            this.allItems = [
                {
                    id: 1,
                    title: "星际探险家",
                    category: "game",
                    description: "一款基于物理的太空探索游戏，具有程序生成的行星系统和动态叙事。玩家可以探索广阔的宇宙，发现外星文明并参与星际贸易。",
                    tags: ["Unity", "C#", "3D", "Procedural Generation", "Physics"],
                    year: 2023,
                    role: "全栈开发"
                },
                {
                    id: 2,
                    title: "像素地牢",
                    category: "game",
                    description: "传统roguelike游戏，具有复杂的战斗系统、丰富的物品和随机生成的地下城。包含原创的像素美术和背景音乐。",
                    tags: ["TypeScript", "Pixel Art", "Roguelike", "Procedural Generation"],
                    year: 2023,
                    role: "全栈开发"
                },
                {
                    id: 3,
                    title: "节奏迷宫",
                    category: "game",
                    description: "结合音乐节奏与解谜元素的2D平台游戏。玩家必须跟随音乐节奏移动，解决各种音乐相关的谜题。",
                    tags: ["Godot", "GDScript", "Music", "2D", "Puzzle"],
                    year: 2022,
                    role: "全栈开发"
                },
                {
                    id: 4,
                    title: "科幻角色设计集",
                    category: "art",
                    description: "为科幻游戏创作的一系列角色概念设计和3D模型。包括人类、外星人和机器人的设计。",
                    tags: ["Blender", "Photoshop", "Character Design", "3D Modeling"],
                    year: 2023,
                    role: "美术设计"
                },
                {
                    id: 5,
                    title: "游戏原声带 - 宇宙之旅",
                    category: "music",
                    description: "为太空探索游戏创作的原声带，包含10首原创曲目。融合了电子音乐和古典元素，营造太空探索的氛围。",
                    tags: ["Ableton Live", "Orchestral", "Electronic", "Sound Design"],
                    year: 2023,
                    role: "音乐制作"
                },
                {
                    id: 6,
                    title: "对话系统编辑器",
                    category: "tool",
                    description: "为游戏叙事设计的可视化对话系统编辑器。支持分支对话、角色表情和声音触发。",
                    tags: ["React", "TypeScript", "Tool Development", "Narrative"],
                    year: 2023,
                    role: "工具开发"
                },
                {
                    id: 7,
                    title: "环境音效包",
                    category: "music",
                    description: "包含200多个高质量环境音效的素材包，适用于各种游戏场景。",
                    tags: ["Field Recording", "Sound Design", "SFX", "Audio Processing"],
                    year: 2022,
                    role: "音效设计"
                },
                {
                    id: 8,
                    title: "UI组件库",
                    category: "tool",
                    description: "为游戏引擎开发的通用UI组件库，包含按钮、滑块、对话框等可复用组件。",
                    tags: ["C#", "Unity", "UI/UX", "Tool Development"],
                    year: 2022,
                    role: "工具开发"
                }
            ];

        } catch (error) {
            console.error('加载作品数据失败:', error);
            this.showErrorMessage('无法加载作品数据');
        }
    }

    private renderPortfolioItems(): void {
        if (!this.portfolioGrid) return;

        // 筛选作品
        const filteredItems = this.currentFilter === 'all'
            ? this.allItems
            : this.allItems.filter(item => item.category === this.currentFilter);

        // 限制显示数量
        const itemsToShow = filteredItems.slice(0, this.displayedItems);

        if (itemsToShow.length === 0) {
            this.portfolioGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: var(--gray-color);"></i>
                    <h3>未找到作品</h3>
                    <p>当前筛选条件下没有作品，请尝试其他筛选条件。</p>
                </div>
            `;
            return;
        }

        // 渲染作品
        this.portfolioGrid.innerHTML = itemsToShow.map(item => `
            <div class="portfolio-item" data-category="${item.category}">
                <div class="portfolio-image" data-category="${this.getCategoryLabel(item.category)}"></div>
                <div class="portfolio-content">
                    <h3 class="portfolio-title">${item.title}</h3>
                    <div class="portfolio-meta">
                        <span>${item.year}</span> • 
                        <span>${item.role}</span>
                    </div>
                    <p class="portfolio-description">${item.description}</p>
                    <div class="portfolio-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="portfolio-footer">
                        <span class="category-badge">${this.getCategoryLabel(item.category)}</span>
                        ${item.link ? `<a href="${item.link}" class="btn btn-outline" style="padding: 0.5rem 1rem;">查看详情</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // 更新加载更多按钮状态
        this.updateLoadMoreButton(filteredItems.length);
    }

    private getCategoryLabel(category: string): string {
        const labels: Record<string, string> = {
            'game': '完整游戏',
            'art': '美术作品',
            'music': '音乐作品',
            'tool': '开发工具'
        };
        return labels[category] || category;
    }

    private setupEventListeners(): void {
        // 筛选按钮点击事件
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 更新激活状态
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // 更新筛选条件
                this.currentFilter = button.dataset.filter || 'all';
                this.displayedItems = 6;

                // 重新渲染作品
                this.renderPortfolioItems();
            });
        });

        // 加载更多按钮点击事件
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.displayedItems += 6;
                this.renderPortfolioItems();
            });
        }

        // 移动端菜单切换
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    private updateLoadMoreButton(totalItems: number): void {
        if (!this.loadMoreBtn) return;

        if (this.displayedItems >= totalItems) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'inline-block';
        }
    }

    private setCurrentYear(): void {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear().toString();
        }
    }

    private showErrorMessage(message: string): void {
        if (!this.portfolioGrid) return;

        this.portfolioGrid.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: var(--danger-color);"></i>
                <h3>加载失败</h3>
                <p>${message}</p>
                <button id="retry-btn" class="btn btn-primary" style="margin-top: 1rem;">重试</button>
            </div>
        `;

        // 添加重试按钮事件
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', async () => {
                await this.loadPortfolioItems();
                this.renderPortfolioItems();
            });
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});