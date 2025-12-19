"use strict";
//import { Animations } from './utils/animations';
// 个人简介页面逻辑
class AboutPage {
    constructor() {
        this.currentYearElement = null;
        this.skillBars = null;
        this.mobileToggle = null;
        this.navMenu = null;
        console.log('AboutPage 初始化');
        // 立即获取DOM元素
        this.currentYearElement = document.getElementById('current-year');
        this.skillBars = document.querySelectorAll('.skill-level');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }
    init() {
        console.log('初始化个人简介页面');
        this.setCurrentYear();
        this.setupEventListeners();
        /*
        this.initAnimations();
        this.animateSkillBars();
        this.initScrollAnimations();
        */
    }
    setCurrentYear() {
        if (this.currentYearElement) {
            this.currentYearElement.textContent = new Date().getFullYear().toString();
            console.log('设置当前年份');
        }
    }
    setupEventListeners() {
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
                const target = e.target;
                console.log('导航点击:', target.dataset.page);
                // 移动端点击后关闭菜单
                if (window.innerWidth <= 768) {
                    this.navMenu?.classList.remove('active');
                }
            });
        });
    }
}
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加载完成，初始化个人简介页面');
    new AboutPage();
});
// 全局导出（如果需要）
window.AboutPage = AboutPage;
//# sourceMappingURL=about.js.map