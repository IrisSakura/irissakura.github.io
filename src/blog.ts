// 博客文章类型
interface BlogArticle {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    category: string;
    tags: string[];
    readTime: number;
    views: number;
    featured: boolean;
}

// 博客应用类
class BlogApp {
    private blogPostsContainer: HTMLElement | null=null;
    private blogCategoriesContainer: HTMLElement | null=null;
    private popularPostsContainer: HTMLElement | null=null;
    private tagCloudContainer: HTMLElement | null=null;
    private blogPaginationContainer: HTMLElement | null=null;
    private blogSearchInput: HTMLInputElement | null=null;
    private currentPage: number = 1;
    private postsPerPage: number = 5;
    private allArticles: BlogArticle[] = [];
    private filteredArticles: BlogArticle[] = [];

    constructor() {
        console.log('BlogApp constructor called');

        setTimeout(() => {
            this.blogPostsContainer = document.getElementById('blog-posts');
            this.blogCategoriesContainer = document.getElementById('blog-categories');
            this.popularPostsContainer = document.getElementById('popular-posts');
            this.tagCloudContainer = document.getElementById('tag-cloud');
            this.blogPaginationContainer = document.getElementById('blog-pagination');
            this.blogSearchInput = document.getElementById('blog-search') as HTMLInputElement;

            this.init();
        }, 100);
    }

    private async init(): Promise<void> {
        console.log('Initializing BlogApp...');
        this.setCurrentYear();
        await this.loadArticles();
        this.setupEventListeners();
        this.renderBlogPosts();
        this.renderCategories();
        this.renderPopularPosts();
        this.renderTagCloud();
        this.renderPagination();
    }

    private async loadArticles(): Promise<void> {
        console.log('Loading blog articles...');
        try {
            this.allArticles = [
                {
                    id: 1,
                    title: "游戏音乐中的互动音频设计",
                    excerpt: "探讨如何通过互动音频增强游戏沉浸感，分享使用FMOD和Wwise的实践经验。",
                    content: "完整文章内容...",
                    date: "2023-10-15",
                    category: "音频设计",
                    tags: ["音频", "FMOD", "Wwise", "沉浸感"],
                    readTime: 8,
                    views: 1245,
                    featured: true
                },
                {
                    id: 2,
                    title: "TypeScript在游戏开发中的应用",
                    excerpt: "如何利用TypeScript的类型系统提高游戏代码的可维护性和开发效率。",
                    content: "完整文章内容...",
                    date: "2023-09-28",
                    category: "编程",
                    tags: ["TypeScript", "编程", "工具", "开发"],
                    readTime: 10,
                    views: 1890,
                    featured: true
                },
                {
                    id: 3,
                    title: "独立游戏的视觉风格选择",
                    excerpt: "从像素艺术到低多边形：如何为你的游戏选择合适的视觉风格。",
                    content: "完整文章内容...",
                    date: "2023-09-12",
                    category: "美术设计",
                    tags: ["美术", "设计", "像素艺术", "风格"],
                    readTime: 6,
                    views: 1567,
                    featured: true
                },
                {
                    id: 4,
                    title: "Unity Shader Graph入门指南",
                    excerpt: "学习使用Shader Graph创建自定义着色器效果的基础知识。",
                    content: "完整文章内容...",
                    date: "2023-08-25",
                    category: "编程",
                    tags: ["Unity", "Shader", "图形", "教程"],
                    readTime: 12,
                    views: 2103,
                    featured: false
                },
                {
                    id: 5,
                    title: "游戏叙事设计的心理学原理",
                    excerpt: "了解心理学原理如何影响玩家的游戏体验和情感共鸣。",
                    content: "完整文章内容...",
                    date: "2023-08-10",
                    category: "游戏设计",
                    tags: ["叙事", "心理学", "设计", "情感"],
                    readTime: 9,
                    views: 1321,
                    featured: false
                },
                {
                    id: 6,
                    title: "使用Godot引擎开发2D游戏",
                    excerpt: "Godot引擎在2D游戏开发中的优势和实践技巧分享。",
                    content: "完整文章内容...",
                    date: "2023-07-22",
                    category: "编程",
                    tags: ["Godot", "2D", "引擎", "教程"],
                    readTime: 11,
                    views: 1789,
                    featured: false
                },
            ];

            this.filteredArticles = [...this.allArticles];
            console.log('Articles loaded:', this.allArticles.length);

        } catch (error) {
            console.error('加载文章数据失败:', error);
        }
    }

    private renderBlogPosts(): void {
        console.log('Rendering blog posts...');
        if (!this.blogPostsContainer) {
            console.error('Blog posts container not found!');
            return;
        }

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

        if (articlesToShow.length === 0) {
            this.blogPostsContainer.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: var(--gray-color);"></i>
                    <h3>未找到文章</h3>
                    <p>尝试其他搜索关键词或分类</p>
                </div>
            `;
            return;
        }

        this.blogPostsContainer.innerHTML = articlesToShow.map(article => `
            <article class="blog-article">
                <div class="article-image" style="background: linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)});"></div>
                <div class="article-content">
                    <div class="article-header">
                        <h2 class="article-title">
                            <a href="blog-post.html?id=${article.id}">${article.title}</a>
                        </h2>
                        <div class="article-meta">
                            <span><i class="far fa-calendar"></i> ${article.date}</span>
                            <span><i class="far fa-folder"></i> ${article.category}</span>
                            <span><i class="far fa-clock"></i> ${article.readTime}分钟阅读</span>
                            <span><i class="far fa-eye"></i> ${article.views}次阅读</span>
                        </div>
                    </div>
                    <div class="article-excerpt">
                        <p>${article.excerpt}</p>
                    </div>
                    <div class="article-footer">
                        <div class="article-tags">
                            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <a href="blog-post.html?id=${article.id}" class="read-more">
                            阅读全文 <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `).join('');

        console.log('Blog posts rendered:', articlesToShow.length);
    }

    private renderCategories(): void {
        if (!this.blogCategoriesContainer) return;

        const categories = this.allArticles.reduce((acc, article) => {
            acc[article.category] = (acc[article.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        this.blogCategoriesContainer.innerHTML = Object.entries(categories)
            .map(([category, count]) => `
                <div class="category-item" data-category="${category}">
                    <span>${category}</span>
                    <span class="category-count">${count}</span>
                </div>
            `).join('');
    }

    private renderPopularPosts(): void {
        if (!this.popularPostsContainer) return;

        const popularArticles = [...this.allArticles]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);

        this.popularPostsContainer.innerHTML = popularArticles.map(article => `
            <div class="popular-post">
                <div class="popular-image"></div>
                <div class="popular-content">
                    <h4><a href="blog-post.html?id=${article.id}">${article.title}</a></h4>
                    <div class="popular-date">${article.date}</div>
                </div>
            </div>
        `).join('');
    }

    private renderTagCloud(): void {
        if (!this.tagCloudContainer) return;

        const allTags = this.allArticles.flatMap(article => article.tags);
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const tags = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 15);

        this.tagCloudContainer.innerHTML = tags.map(([tag, count]) => `
            <a href="#" class="tag" data-tag="${tag}">${tag} (${count})</a>
        `).join('');
    }

    private renderPagination(): void {
        if (!this.blogPaginationContainer) return;

        const totalPages = Math.ceil(this.filteredArticles.length / this.postsPerPage);

        if (totalPages <= 1) {
            this.blogPaginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // 上一页按钮
        if (this.currentPage > 1) {
            paginationHTML += `<a href="#" class="page-link prev" data-page="${this.currentPage - 1}">上一页</a>`;
        } else {
            paginationHTML += `<span class="page-link disabled">上一页</span>`;
        }

        // 页码按钮
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<a href="#" class="page-link active" data-page="${i}">${i}</a>`;
            } else {
                paginationHTML += `<a href="#" class="page-link" data-page="${i}">${i}</a>`;
            }
        }

        // 下一页按钮
        if (this.currentPage < totalPages) {
            paginationHTML += `<a href="#" class="page-link next" data-page="${this.currentPage + 1}">下一页</a>`;
        } else {
            paginationHTML += `<span class="page-link disabled">下一页</span>`;
        }

        this.blogPaginationContainer.innerHTML = paginationHTML;
    }

    private setupEventListeners(): void {
        console.log('Setting up blog event listeners...');

        // 分类点击事件
        if (this.blogCategoriesContainer) {
            this.blogCategoriesContainer.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const categoryItem = target.closest('.category-item') as HTMLElement;

                if (categoryItem) {
                    const category = categoryItem.dataset.category;
                    console.log('Category clicked:', category);

                    if (category) {
                        this.filteredArticles = category === 'all'
                            ? [...this.allArticles]
                            : this.allArticles.filter(article => article.category === category);

                        this.currentPage = 1;
                        this.renderBlogPosts();
                        this.renderPagination();
                    }
                }
            });
        }

        // 标签点击事件
        if (this.tagCloudContainer) {
            this.tagCloudContainer.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target as HTMLElement;
                const tagElement = target.closest('.tag') as HTMLElement;

                if (tagElement) {
                    const tag = tagElement.dataset.tag;
                    console.log('Tag clicked:', tag);

                    if (tag) {
                        this.filteredArticles = this.allArticles.filter(article =>
                            article.tags.includes(tag)
                        );

                        this.currentPage = 1;
                        this.renderBlogPosts();
                        this.renderPagination();
                    }
                }
            });
        }

        // 分页点击事件
        if (this.blogPaginationContainer) {
            this.blogPaginationContainer.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target as HTMLElement;
                const pageLink = target.closest('.page-link') as HTMLElement;

                if (pageLink && !pageLink.classList.contains('disabled')) {
                    const page = pageLink.dataset.page;
                    if (page) {
                        this.currentPage = parseInt(page);
                        this.renderBlogPosts();
                        this.renderPagination();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            });
        }

        // 搜索功能
        if (this.blogSearchInput) {
            this.blogSearchInput.addEventListener('input', () => {
                const searchTerm = this.blogSearchInput?.value.toLowerCase() || '';

                if (searchTerm.length >= 2) {
                    this.filteredArticles = this.allArticles.filter(article =>
                        article.title.toLowerCase().includes(searchTerm) ||
                        article.excerpt.toLowerCase().includes(searchTerm) ||
                        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                    );
                } else {
                    this.filteredArticles = [...this.allArticles];
                }

                this.currentPage = 1;
                this.renderBlogPosts();
                this.renderPagination();
            });
        }

        // FAQ 展开/收起
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
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

    private setCurrentYear(): void {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear().toString();
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing BlogApp...');
    new BlogApp();
});