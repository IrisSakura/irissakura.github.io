"use strict";
// 联系应用类
class ContactApp {
    constructor() {
        this.contactForm = null;
        this.formMessage = null;
        console.log('ContactApp constructor called');
        if (document.readyState === 'loading') {
            this.contactForm = document.getElementById('contact-form');
            this.formMessage = document.getElementById('form-message');
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
        else {
            this.init();
        }
    }
    init() {
        console.log('Initializing ContactApp...');
        this.setCurrentYear();
        this.setupEventListeners();
        this.initAnimations();
    }
    setupEventListeners() {
        console.log('Setting up contact event listeners...');
        // 联系表单提交
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        // FAQ 展开/收起
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
        /*
        // 使用事件委托处理FAQ点击
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const faqItem = target.closest('.faq-item');

            if (faqItem) {
                console.log('FAQ item clicked');
                faqItem.classList.toggle('active');
            }

            // 检查是否点击了FAQ问题（可能点击的是内部的h3或图标）
            const faqQuestion = target.closest('.faq-question');
            if (faqQuestion && faqQuestion.parentElement) {
                console.log('FAQ问题被点击');
                faqQuestion.parentElement.classList.toggle('active');
            }
        });

         */
        // 移动端菜单切换
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }
    async handleFormSubmit() {
        console.log('Handling form submission...');
        if (!this.contactForm || !this.formMessage)
            return;
        // 获取表单数据
        const formData = {
            name: this.contactForm.querySelector('#name').value,
            email: this.contactForm.querySelector('#email').value,
            subject: this.contactForm.querySelector('#subject').value,
            message: this.contactForm.querySelector('#message').value
        };
        // 简单验证
        if (!this.validateForm(formData)) {
            this.showMessage('请填写所有必填字段', 'error');
            return;
        }
        // 显示加载状态
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = '发送中...';
        submitButton.disabled = true;
        try {
            // 模拟API调用
            await this.sendFormData(formData);
            // 显示成功消息
            this.showMessage('消息已发送！我会尽快回复您。', 'success');
            // 重置表单
            this.contactForm.reset();
        }
        catch (error) {
            console.error('发送消息失败:', error);
            this.showMessage('发送失败，请稍后重试。', 'error');
        }
        finally {
            // 恢复按钮状态
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    validateForm(formData) {
        return (formData.name.trim() !== '' &&
            formData.email.trim() !== '' &&
            this.validateEmail(formData.email) &&
            formData.subject.trim() !== '' &&
            formData.message.trim() !== '');
    }
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    async sendFormData(formData) {
        // 在实际应用中，这里会发送到后端API
        // 这里模拟网络延迟
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data sent:', formData);
                resolve();
            }, 1500);
        });
    }
    showMessage(message, type) {
        if (!this.formMessage)
            return;
        this.formMessage.textContent = message;
        this.formMessage.className = `form-message ${type}`;
        // 3秒后隐藏消息
        setTimeout(() => {
            this.formMessage.style.display = 'none';
        }, 5000);
    }
    initAnimations() {
        // 使用GSAP动画
        if (typeof gsap !== 'undefined') {
            // 信息卡片动画
            gsap.from('.info-card', {
                scrollTrigger: {
                    trigger: '.contact-info',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.2
            });
            // 表单动画
            gsap.from('.contact-form-container', {
                scrollTrigger: {
                    trigger: '.contact-form-container',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 1,
                y: 50,
                opacity: 0
            });
            // 社交媒体卡片动画
            gsap.from('.social-platform', {
                scrollTrigger: {
                    trigger: '.social-platforms',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: 0.6,
                y: 30,
                opacity: 0,
                stagger: 0.1
            });
        }
    }
    setCurrentYear() {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear().toString();
        }
    }
}
// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing ContactApp...');
    new ContactApp();
});
//# sourceMappingURL=contact.js.map