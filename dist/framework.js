"use strict";
class FrameworkPage {
    constructor() {
        this.mobileToggle = null;
        this.navMenu = null;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
        else {
            this.init();
        }
    }
    init() {
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.setCurrentYear();
        this.setupEventListeners();
    }
    setCurrentYear() {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear().toString();
        }
    }
    setupEventListeners() {
        if (this.mobileToggle && this.navMenu) {
            this.mobileToggle.addEventListener('click', () => {
                this.navMenu?.classList.toggle('active');
            });
        }
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.navMenu?.classList.remove('active');
                }
            });
        });
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            }
            else {
                navbar?.classList.remove('scrolled');
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new FrameworkPage();
});
