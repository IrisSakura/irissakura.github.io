// src/utils/animations.ts - 替代GSAP的核心工具
export class Animations {
    // 淡入动画
    static fadeIn(element: Element | null, options: { duration?: number, delay?: number } = {}): void {
        if (!element) return;

        const { duration = 0.8, delay = 0 } = options;
        const el = element as HTMLElement;

        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity ${duration}s ease, transform ${duration}s ease`;

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, delay * 1000);
    }

    // 批量淡入（替代stagger效果）
    static fadeInStagger(
        selector: string,
        options: { duration?: number, delay?: number, stagger?: number } = {}
    ): void {
        const { duration = 0.8, delay = 0, stagger = 0.1 } = options;
        const elements = document.querySelectorAll(selector);

        elements.forEach((el, index) => {
            this.fadeIn(el, {
                duration,
                delay: delay + (index * stagger)
            });
        });
    }

    // 缩放动画
    static scaleIn(element: Element | null, options: { duration?: number, delay?: number } = {}): void {
        if (!element) return;

        const { duration = 0.8, delay = 0 } = options;
        const el = element as HTMLElement;

        el.style.opacity = '0';
        el.style.transform = 'scale(0.8)';
        el.style.transition = `opacity ${duration}s ease, transform ${duration}s ease`;

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
        }, delay * 1000);
    }

    // 滚动触发动画
    static initScrollAnimations(): void {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement;

                    // 根据自定义属性应用不同动画
                    const animationType = element.dataset.animation || 'fade-up';

                    switch (animationType) {
                        case 'fade-up':
                            this.fadeIn(element, { duration: 0.6 });
                            break;
                        case 'fade-left':
                            element.style.opacity = '0';
                            element.style.transform = 'translateX(-30px)';
                            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            setTimeout(() => {
                                element.style.opacity = '1';
                                element.style.transform = 'translateX(0)';
                            }, 100);
                            break;
                        case 'scale':
                            this.scaleIn(element, { duration: 0.5 });
                            break;
                    }

                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // 观察所有有 data-animation 属性的元素
        document.querySelectorAll('[data-animation]').forEach(el => {
            observer.observe(el);
        });
    }
}

// 全局导出
(window as any).Animations = Animations;