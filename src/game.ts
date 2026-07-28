class GamePage {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    private init(): void {
        const year = document.getElementById('current-year');
        if (year) year.textContent = new Date().getFullYear().toString();

        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');
        mobileToggle?.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
        });
    }
}

new GamePage();
