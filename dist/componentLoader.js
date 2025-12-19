// src/components/ComponentLoader.ts
export class ComponentLoader {
    constructor() {
        this.components = new Map();
    }
    async loadComponent(componentName) {
        if (this.components.has(componentName)) {
            return this.components.get(componentName);
        }
        try {
            const response = await fetch(`../components/${componentName}.html`);
            if (!response.ok)
                throw new Error(`Failed to load ${componentName}`);
            const html = await response.text();
            this.components.set(componentName, html);
            return html;
        }
        catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            return `<div class="component-error">无法加载 ${componentName}</div>`;
        }
    }
    async renderComponent(componentName, targetSelector) {
        const html = await this.loadComponent(componentName);
        const target = document.querySelector(targetSelector);
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
    setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const element = link;
            element.classList.remove('active');
            const href = element.getAttribute('href');
            if (href && this.isCurrentPage(href, currentPath)) {
                element.classList.add('active');
            }
        });
    }
    isCurrentPage(href, currentPath) {
        // 简化路径匹配逻辑
        if (currentPath.endsWith(href))
            return true;
        if (currentPath === '/' && href === '/')
            return true;
        if (currentPath.includes('/pages/') && href.includes('/pages/')) {
            return currentPath.split('/').pop() === href.split('/').pop();
        }
        return false;
    }
    setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear().toString();
        }
    }
    rebindEvents() {
        // 重新绑定事件
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileToggle && navMenu) {
            // 简单的事件重新绑定
            const newToggle = mobileToggle.cloneNode(true);
            mobileToggle.parentNode?.replaceChild(newToggle, mobileToggle);
            newToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }
}
// 创建全局实例
window.ComponentLoader = new ComponentLoader();
