// =============================================================================
// PORTFOLIO ORCHESTRATOR - MAIN APPLICATION ENTRY POINT
// Open/Closed Principle: Open for extension via new modules, closed for modification
// Dependency Inversion: Depends on abstractions (module interfaces), not concrete implementations
// =============================================================================

class PortfolioApp {
    constructor() {
        this.modules = [];
        this.init();
    }

    init() {
        // Initialize all portfolio modules
        this.initializeModules();
    }

    initializeModules() {
        // Initialize each module - follows Interface Segregation Principle
        // Each module has a single, focused responsibility
        try {
            this.modules.push(new NavigationManager());
            this.modules.push(new MobileMenuManager());
            this.modules.push(new ScrollEffectsManager());
            this.modules.push(new ContactFormManager());
            this.modules.push(new AnimationsManager());
            this.modules.push(new MouseFollowerManager());
        } catch (error) {
            console.error('Error initializing portfolio modules:', error);
        }
    }

    // Method to add new modules dynamically (Open/Closed Principle)
    addModule(moduleInstance) {
        this.modules.push(moduleInstance);
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Load parallax and 3D tilt scroll effects
import('./scrollParallax.js').catch(() => {
  const script = document.createElement('script');
  script.src = 'js/scrollParallax.js';
  document.body.appendChild(script);
});
