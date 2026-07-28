"use strict";
//import { Animations } from './utils/animations';
// 作品集应用类
class PortfolioApp {
    constructor() {
        this.currentFilter = 'all';
        this.allItems = [];
        this.portfolioGrid = document.getElementById('portfolio-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.init();
    }
    async init() {
        // 设置当前年份
        this.setCurrentYear();
        // 加载作品数据
        await this.loadPortfolioItems();
        // 初始化事件监听器
        this.setupEventListeners();
        // 渲染作品
        this.renderPortfolioItems();
        //this.initAnimations();
    }
    async loadPortfolioItems() {
        try {
            // 模拟从API加载数据
            this.allItems = [
                {
                    id: 9,
                    title: "Sakura Design Journal",
                    category: "research",
                    description: "持续积累游戏设计范式、Godot 源码研究与每日审计记录。它保存作品背后的问题、证据和设计判断，也是 Sakura Framework 的研究输入。",
                    tags: ["Game Design", "Godot Research", "Architecture", "Knowledge Base"],
                    year: 2026,
                    role: "研究与系统设计",
                    link: "journal.html",
                    linkLabel: "查看学习记录"
                },
                {
                    id: 10,
                    title: "Sakura Framework",
                    category: "tool",
                    description: "面向 Unity 游戏项目的模块化开发框架，将研究中可复用的生命周期、运行时服务与玩法规则沉淀为可组合能力。",
                    tags: ["Unity", "C#", "Framework", "Modular Architecture"],
                    year: 2026,
                    role: "架构与框架开发",
                    link: "framework.html",
                    linkLabel: "查看框架详情"
                },
                {
                    id: 1,
                    title: "言铸之剑",
                    category: "game",
                    description: "一款以房间推进、实时动作战斗和构筑成长为核心的 2D Roguelike。技能、潜能、祝福、背包与存档共同形成可重复游玩的完整局内循环。",
                    tags: ["Unity", "C#", "2D Action", "Roguelike", "LLM Gameplay"],
                    year: 2026,
                    role: "独立游戏开发 / 系统设计",
                    link: "game.html",
                    linkLabel: "查看游戏详情",
                    image: "../assets/images/sword-of-words/combat-room.png",
                    imageAlt: "言铸之剑战斗房间：玩家面对两名骷髅敌人，底部显示生命、理智与技能栏"
                }
            ];
        }
        catch (error) {
            console.error('加载作品数据失败:', error);
            this.showErrorMessage('无法加载作品数据');
        }
    }
    renderPortfolioItems() {
        if (!this.portfolioGrid)
            return;
        // 筛选作品
        const filteredItems = this.currentFilter === 'all'
            ? this.allItems
            : this.allItems.filter(item => item.category === this.currentFilter);
        if (filteredItems.length === 0) {
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
        this.portfolioGrid.innerHTML = filteredItems.map(item => `
            <div class="portfolio-item" data-category="${item.category}">
                <div class="portfolio-image" data-category="${this.getCategoryLabel(item.category)}">
                    ${item.image ? `<img src="${item.image}" alt="${item.imageAlt ?? item.title}" loading="lazy">` : ''}
                </div>
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
                        ${item.link ? `
                            <a
                                href="${item.link}"
                                class="btn btn-outline portfolio-link"
                                ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}
                            >
                                ${item.linkLabel ?? '查看详情'}
                                ${item.external ? '<i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>' : ''}
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    getCategoryLabel(category) {
        const labels = {
            'research': '研究与设计',
            'game': '完整游戏',
            'tool': '开发工具'
        };
        return labels[category] || category;
    }
    setupEventListeners() {
        // 筛选按钮点击事件
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 更新激活状态
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // 更新筛选条件
                this.currentFilter = button.dataset.filter || 'all';
                // 重新渲染作品
                this.renderPortfolioItems();
            });
        });
        // 移动端菜单切换
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }
    /*
    private initAnimations(): void {
        console.log('初始化作品集动画');

        setTimeout(() => {
            // 作品卡片动画
            document.querySelectorAll('.portfolio-item').forEach((item, index) => {
                (item as HTMLElement).style.animationDelay = `${index * 0.1}s`;
                item.classList.add('fade-up');
            });

            // 筛选按钮动画
            Animations.fadeInStagger('.filter-btn', {
                duration: 0.5,
                stagger: 0.05,
                delay: 0.2
            });
        }, 300);

        // 初始化滚动动画
        Animations.initScrollAnimations();
    }
    */
    setCurrentYear() {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear().toString();
        }
    }
    showErrorMessage(message) {
        if (!this.portfolioGrid)
            return;
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
    console.log('DOM fully loaded, initializing PortfolioApp...');
    new PortfolioApp();
});
//# sourceMappingURL=portfolio.js.map