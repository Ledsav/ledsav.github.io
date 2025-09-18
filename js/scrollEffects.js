// =============================================================================
// SCROLL EFFECTS MODULE
// Single Responsibility: Handle scroll-based visual effects
// =============================================================================

class ScrollEffectsManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        this.setupNavbarScrollEffect();
        this.setupFadeInAnimations();
    }

    setupNavbarScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }

    setupFadeInAnimations() {
        // Simple fade-in animation for elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all sections for fade-in effect
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
}