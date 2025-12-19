//import { Animations } from './utils/animations';
// 个人简介页面逻辑
class AboutPage {
    private currentYearElement: HTMLElement | null = null;
    private skillBars: NodeListOf<HTMLElement> | null = null;
    private mobileToggle: HTMLElement | null = null;
    private navMenu: HTMLElement | null = null;

    constructor() {
        console.log('AboutPage 初始化');

        // 立即获取DOM元素
        this.currentYearElement = document.getElementById('current-year');
        this.skillBars = document.querySelectorAll('.skill-level');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.navMenu = document.querySelector('.nav-menu');

        this.init();
    }

    private init(): void {
        console.log('初始化个人简介页面');

        this.setCurrentYear();
        this.setupEventListeners();
        /*
        this.initAnimations();
        this.animateSkillBars();
        this.initScrollAnimations();
        */
    }

    private setCurrentYear(): void {
        if (this.currentYearElement) {
            this.currentYearElement.textContent = new Date().getFullYear().toString();
            console.log('设置当前年份');
        }
    }

    private setupEventListeners(): void {
        console.log('设置事件监听器');

        // 移动端菜单切换
        if (this.mobileToggle && this.navMenu) {
            this.mobileToggle.addEventListener('click', () => {
                console.log('移动菜单切换');
                this.navMenu?.classList.toggle('active');
            });
        }

        // 导航链接点击
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                console.log('导航点击:', target.dataset.page);

                // 移动端点击后关闭菜单
                if (window.innerWidth <= 768) {
                    this.navMenu?.classList.remove('active');
                }
            });
        });
    }

    /*
    private initAnimations(): void {
        console.log('初始化动画');

        setTimeout(() => {
            // 英雄区域动画
            Animations.fadeInStagger('.hero-title, .hero-subtitle, .hero-description', {
                duration: 1,
                stagger: 0.2,
                delay: 0.3
            });

            // 头像动画
            const avatar = document.querySelector('.developer-avatar');
            if (avatar) {
                avatar.classList.add('scale-in');
            }

            // 时间线项目添加动画类
            document.querySelectorAll('.timeline-item').forEach((item, index) => {
                (item as HTMLElement).style.animationDelay = `${index * 0.3}s`;
                item.classList.add('fade-up');
            });

            // 技能矩阵卡片动画
            document.querySelectorAll('.matrix-category').forEach((card, index) => {
                (card as HTMLElement).style.animationDelay = `${index * 0.2}s`;
                card.classList.add('fade-up');
            });

            // 哲学卡片动画
            document.querySelectorAll('.philosophy-card').forEach((card, index) => {
                (card as HTMLElement).style.animationDelay = `${index * 0.15}s`;
                card.classList.add('fade-up');
            });

            // 兴趣卡片动画
            document.querySelectorAll('.interest-card').forEach((card, index) => {
                (card as HTMLElement).style.animationDelay = `${index * 0.15}s`;
                card.classList.add('fade-up');
            });
        }, 300);
    }

    private initScrollAnimations(): void {
        // 初始化滚动触发动画
        Animations.initScrollAnimations();

        // 为时间线添加滚动观察
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const item = entry.target as HTMLElement;
                        item.classList.add('visible');
                        observer.unobserve(item);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            timelineItems.forEach(item => {
                item.classList.add('animate-on-scroll');
                observer.observe(item);
            });
        }
    }

    private animateSkillBars(): void {
        if (!this.skillBars || this.skillBars.length === 0) {
            console.log('未找到技能条元素');
            return;
        }

        console.log(`找到 ${this.skillBars.length} 个技能条`);

        // 使用 Intersection Observer 检测技能条是否进入视口
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target as HTMLElement;
                    const width = skillBar.style.width;

                    // 重置宽度为0，然后动画到目标宽度
                    skillBar.style.width = '0%';

                    setTimeout(() => {
                        skillBar.style.transition = 'width 1.5s ease-in-out';
                        skillBar.style.width = width;
                    }, 300);

                    observer.unobserve(skillBar);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        // 观察所有技能条
        this.skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    */




    /*
    private initAnimations(): void {
        // 使用全局 gsap（通过CDN引入）
        if (typeof gsap !== 'undefined') {
            console.log('GSAP 可用，初始化动画');

            // 英雄区域动画
            gsap.from('.hero-title, .hero-subtitle, .hero-description', {
                duration: 1,
                y: 30,
                opacity: 0,
                stagger: 0.2,
                delay: 0.3
            });

            gsap.from('.developer-avatar', {
                duration: 1.5,
                scale: 0.8,
                opacity: 0,
                delay: 0.5,
                ease: "back.out(1.7)"
            });

            // 时间线动画
            gsap.from('.timeline-item', {
                scrollTrigger: {
                    trigger: '.personal-story',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                x: -50,
                opacity: 0,
                stagger: 0.3
            });

            // 技能卡片动画
            gsap.from('.matrix-category', {
                scrollTrigger: {
                    trigger: '.skills-matrix',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.6,
                y: 30,
                opacity: 0,
                stagger: 0.2
            });

            // 哲学卡片动画
            gsap.from('.philosophy-card', {
                scrollTrigger: {
                    trigger: '.philosophy',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.6,
                y: 30,
                opacity: 0,
                stagger: 0.15
            });

            // 兴趣卡片动画
            gsap.from('.interest-card', {
                scrollTrigger: {
                    trigger: '.interests',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.6,
                y: 30,
                opacity: 0,
                stagger: 0.15
            });

        } else {
            console.warn('GSAP 不可用，跳过动画');
        }
    }

    private animateSkillBars(): void {
        if (!this.skillBars || this.skillBars.length === 0) {
            console.log('未找到技能条元素');
            return;
        }

        console.log(`找到 ${this.skillBars.length} 个技能条`);

        // 使用 Intersection Observer 检测技能条是否进入视口
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target as HTMLElement;
                    const width = skillBar.style.width;

                    // 重置宽度为0，然后动画到目标宽度
                    skillBar.style.width = '0%';

                    setTimeout(() => {
                        skillBar.style.transition = 'width 1.5s ease-in-out';
                        skillBar.style.width = width;
                    }, 300);

                    observer.unobserve(skillBar);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        // 观察所有技能条
        this.skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    */
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加载完成，初始化个人简介页面');
    new AboutPage();
});

// 全局导出（如果需要）
(window as any).AboutPage = AboutPage;