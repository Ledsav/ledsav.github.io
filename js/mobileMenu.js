// =============================================================================
// MOBILE MENU MODULE
// Single Responsibility: Handle mobile menu toggle and interactions
// =============================================================================

class MobileMenuManager {
    constructor() {
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (this.mobileMenuBtn && this.navMenu) {
            this.setupMenuToggle();
            this.setupMenuClosing();
        }
    }

    setupMenuToggle() {
        this.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMenu();
        });
    }

    setupMenuClosing() {
        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.mobileMenuBtn.classList.toggle('active');
        
        // Animate hamburger icon
        if (this.navMenu.classList.contains('active')) {
            this.mobileMenuBtn.innerHTML = '✕';
        } else {
            this.mobileMenuBtn.innerHTML = '☰';
        }
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.mobileMenuBtn.classList.remove('active');
        this.mobileMenuBtn.innerHTML = '☰';
    }
}