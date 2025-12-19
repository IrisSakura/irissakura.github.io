// src/components/ComponentLoader.ts
export class ComponentLoader {
    private components: Map<string, string> = new Map();

    async loadComponent(componentName: string): Promise<string> {
        if (this.components.has(componentName)) {
            return this.components.get(componentName)!;
        }

        try {
            const response = await fetch(`/components/${componentName}.html`);
            if (!response.ok) throw new Error(`Failed to load ${componentName}`);

            const html = await response.text();
            this.components.set(componentName, html);
            return html;
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            return `<div class="component-error">无法加载 ${componentName}</div>`;
        }
    }

    async renderComponent(componentName: string, targetSelector: string): Promise<boolean> {
        const html = await this.loadComponent(componentName);
        const target = document.querySelector(targetSelector) as HTMLElement;

        if (target) {
            target.innerHTML = html;

            // 组件特定的初始化逻辑
            switch (componentName) {
                case 'navbar':
                    this.setActiveNavLink();
                    break;
                case 'footer':
                    this.setCurrentYear();
                    break;
            }

            this.rebindEvents();
            return true;
        }
        return false;
    }

    private setActiveNavLink(): void {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const element = link as HTMLElement;
            element.classList.remove('active');

            const href = element.getAttribute('href');
            if (href && this.isCurrentPage(href, currentPath)) {
                element.classList.add('active');
            }
        });
    }

    private isCurrentPage(href: string, currentPath: string): boolean {
        // 简化路径匹配逻辑
        if (currentPath.endsWith(href)) return true;
        if (currentPath === '/' && href === '/') return true;
        if (currentPath.includes('/pages/') && href.includes('/pages/')) {
            return currentPath.split('/').pop() === href.split('/').pop();
        }
        return false;
    }

    private setCurrentYear(): void {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear().toString();
        }
    }

    private rebindEvents(): void {
        // 重新绑定事件
        const mobileToggle = document.querySelector('.mobile-toggle') as HTMLElement;
        const navMenu = document.querySelector('.nav-menu');

        if (mobileToggle && navMenu) {
            // 简单的事件重新绑定
            const newToggle = mobileToggle.cloneNode(true) as HTMLElement;
            mobileToggle.parentNode?.replaceChild(newToggle, mobileToggle);

            newToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }
}

// 创建全局实例
(window as any).ComponentLoader = new ComponentLoader();