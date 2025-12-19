import gsap from 'gsap'// 类型定义

interface Project {
    id: number;
    title: string;
    category: string;
    description: string;
    tags: string[];
    year: number;
    featured: boolean;
}

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: number;
}

// 主应用类
class MainApp {
    private featuredProjectsContainer: HTMLElement | null=null;
    private recentPostsContainer: HTMLElement | null=null;
    private currentYearElement: HTMLElement | null=null;
    private mobileToggle: HTMLElement | null=null;
    private navMenu: HTMLElement | null=null;

    constructor() {
        console.log('MainApp constructor called');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initElements());
        } else {
            this.initElements();
        }

    }

    private initElements(): void {
        this.featuredProjectsContainer = document.getElementById('featured-projects');
        this.recentPostsContainer = document.getElementById('recent-posts');
        this.currentYearElement = document.getElementById('current-year');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.navMenu = document.querySelector('.nav-menu');

        console.log('Elements found:', {
            featured: this.featuredProjectsContainer,
            posts: this.recentPostsContainer,
            year: this.currentYearElement
        });

        this.init();
    }

    private init(): void {
        // 初始化事件监听器
        this.setupEventListeners();

        // 加载数据
        this.loadFeaturedProjects();
        this.loadRecentPosts();

        // 设置当前年份
        this.setCurrentYear();

        // 初始化页面动画
        this.initAnimations();
    }

    private setupEventListeners(): void {
        // 移动端菜单切换
        if (this.mobileToggle && this.navMenu) {
            this.mobileToggle.addEventListener('click', () => {
                this.navMenu?.classList.toggle('active');
            });
        }

        // 导航链接点击事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.dataset.page === 'home') {
                    e.preventDefault();
                    this.scrollToTop();
                }

                // 移动端点击后关闭菜单
                if (window.innerWidth <= 768) {
                    this.navMenu?.classList.remove('active');
                }
            });
        });

        // 页面滚动时更新导航状态
        window.addEventListener('scroll', () => {
            this.updateNavOnScroll();
        });
    }

    private async loadFeaturedProjects(): Promise<void> {
        try {
            // 实际项目中，这里会从API或JSON文件加载数据
            const projects: Project[] = [
                {
                    id: 1,
                    title: "像素地牢",
                    category: "roguelike 地牢探索",
                    description: "传统roguelike游戏，具有复杂的战斗系统和丰富的物品系统。",
                    tags: ["TypeScript", "Pixel Art", "Procedural Generation"],
                    year: 2023,
                    featured: true
                }
            ];

            this.renderFeaturedProjects(projects);
        } catch (error) {
            console.error('加载作品数据失败:', error);
            this.showErrorMessage(this.featuredProjectsContainer, '无法加载作品数据');
        }
    }

    private renderFeaturedProjects(projects: Project[]): void {
        if (!this.featuredProjectsContainer) return;

        this.featuredProjectsContainer.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-image"></div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-category">${project.category} • ${project.year}</p>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    private async loadRecentPosts(): Promise<void> {
        try {
            // 实际项目中，这里会从API或JSON文件加载数据
            const posts: BlogPost[] = [
                {
                    id: 1,
                    title: "游戏音乐中的互动音频设计",
                    excerpt: "探讨如何通过互动音频增强游戏沉浸感，分享使用FMOD和Wwise的实践经验。",
                    date: "2023-10-15",
                    category: "音频设计",
                    readTime: 8
                }
            ];

            this.renderRecentPosts(posts);
        } catch (error) {
            console.error('加载博客数据失败:', error);
            this.showErrorMessage(this.recentPostsContainer, '无法加载博客文章');
        }
    }

    private renderRecentPosts(posts: BlogPost[]): void {
        if (!this.recentPostsContainer) return;

        this.recentPostsContainer.innerHTML = posts.map(post => `
            <div class="blog-card">
                <div class="blog-image"></div>
                <div class="blog-content">
                    <h3 class="blog-title">${post.title}</h3>
                    <div class="blog-meta">
                        <span>${post.date}</span> • 
                        <span>${post.category}</span> • 
                        <span>${post.readTime} 分钟阅读</span>
                    </div>
                    <p>${post.excerpt}</p>
                    <a href="pages/blog.html#post-${post.id}" class="btn btn-outline" style="margin-top: 1rem;">阅读更多</a>
                </div>
            </div>
        `).join('');
    }

    private setCurrentYear(): void {
        if (this.currentYearElement) {
            this.currentYearElement.textContent = new Date().getFullYear().toString();
        }
    }

    private initAnimations(): void {
        // 使用GSAP初始化动画
        if (typeof gsap !== 'undefined') {
            // 英雄区域动画
            gsap.from('.hero-title, .hero-subtitle, .hero-description', {
                duration: 1,
                y: 30,
                opacity: 0,
                stagger: 0.2,
                delay: 0.3
            });

            gsap.from('.hero-buttons', {
                duration: 1,
                y: 30,
                opacity: 0,
                delay: 0.8
            });

            gsap.from('.pixel-art', {
                duration: 1.5,
                scale: 0.8,
                opacity: 0,
                delay: 0.5,
                ease: "back.out(1.7)"
            });

            // 技能卡片动画
            gsap.from('.skill-card', {
                scrollTrigger: {
                    trigger: '.skills-section',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.2
            });
        }
    }

    private updateNavOnScroll(): void {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }

    private scrollToTop(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    private showErrorMessage(container: HTMLElement | null, message: string): void {
        if (!container) return;

        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; color: var(--gray-color);">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});

// 防止重复初始化
(window as any).MainApp = MainApp;