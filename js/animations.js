/* =============================================================================
   ANIMATIONS - GRADIENT PULSE DESIGN SYSTEM
   ============================================================================= */

/**
 * Animation controller for gradient and scroll-based animations
 */
class AnimationController {
  constructor() {
    this.observers = new Map();
    this.animatedElements = new Set();
    this.isReducedMotion = prefersReducedMotion();
    
    this.init();
  }
  
  init() {
    this.setupScrollAnimations();
    this.setupSkillBars();
    this.setupCounterAnimations();
    this.setupGradientAnimations();
    this.setupParallaxEffects();
    
    Console.success('Animation Controller initialized');
  }
  
  /**
   * Setup scroll-triggered animations using Intersection Observer
   */
  setupScrollAnimations() {
    if (!Device.supportsIntersectionObserver()) {
      Console.warn('IntersectionObserver not supported, falling back to scroll events');
      this.setupFallbackScrollAnimations();
      return;
    }
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.animateElement(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatableElements = document.querySelectorAll(
      '.animate-fade-up, .animate-on-scroll, .skill-bar, .stat-number'
    );
    
    animatableElements.forEach(element => {
      observer.observe(element);
    });
    
    this.observers.set('scroll', observer);
  }
  
  /**
   * Fallback scroll animations for browsers without IntersectionObserver
   */
  setupFallbackScrollAnimations() {
    const handleScroll = throttle(() => {
      const animatableElements = document.querySelectorAll(
        '.animate-fade-up:not(.animated), .animate-on-scroll:not(.animated)'
      );
      
      animatableElements.forEach(element => {
        if (isInViewport(element, 0.1)) {
          this.animateElement(element);
        }
      });
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
  }
  
  /**
   * Animate individual element
   */
  animateElement(element) {
    if (this.isReducedMotion) {
      element.classList.add('animated');
      return;
    }
    
    // Add staggered delay for grouped elements
    const delay = this.calculateStaggerDelay(element);
    
    setTimeout(() => {
      element.classList.add('animated');
      
      // Trigger custom animation event
      dispatchCustomEvent('elementAnimated', { element }, element);
    }, delay);
  }
  
  /**
   * Calculate stagger delay for grouped animations
   */
  calculateStaggerDelay(element) {
    const parent = element.closest('.skills-grid, .projects-grid, .timeline');
    if (!parent) return 0;
    
    const siblings = Array.from(parent.children);
    const index = siblings.indexOf(element.closest(siblings[0].tagName));
    
    return index * 100; // 100ms delay between each element
  }
  
  /**
   * Setup skill bar animations
   */
  setupSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach(skillBar => {
      const levelElement = skillBar.closest('.skill-item')?.querySelector('[data-level]');
      if (!levelElement) return;
      
      const level = parseInt(levelElement.dataset.level) || 0;
      
      // Create progress fill element
      if (!skillBar.querySelector('.skill-progress-fill')) {
        const fill = document.createElement('div');
        fill.className = 'skill-progress-fill';
        skillBar.appendChild(fill);
      }
      
      // Animate when in viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateSkillBar(skillBar, level);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(skillBar);
    });
  }
  
  /**
   * Animate skill bar progress
   */
  animateSkillBar(skillBar, level) {
    const fill = skillBar.querySelector('.skill-progress-fill') || skillBar.querySelector('::before');
    if (!fill) return;
    
    if (this.isReducedMotion) {
      skillBar.style.setProperty('--skill-width', `${level}%`);
      return;
    }
    
    let currentLevel = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentLevel = level * easeOut;
      
      skillBar.style.setProperty('--skill-width', `${currentLevel}%`);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * Setup counter animations for statistics
   */
  setupCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
      const text = element.textContent.trim();
      const matches = text.match(/(\d+)/);
      if (!matches) return;
      
      const targetNumber = parseInt(matches[1]);
      const suffix = text.replace(matches[1], '');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateNumber(element, 0, targetNumber, 2000, (current) => {
              element.textContent = `${Math.floor(current)}${suffix}`;
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(element);
    });
  }
  
  /**
   * Setup gradient animations and effects
   */
  setupGradientAnimations() {
    this.setupGradientShift();
    this.setupFloatingOrbs();
    this.setupEnergyField();
  }
  
  /**
   * Setup gradient shift animations
   */
  setupGradientShift() {
    const gradientElements = document.querySelectorAll('.gradient-text, .hero-title');
    
    gradientElements.forEach(element => {
      if (this.isReducedMotion) return;
      
      // Add CSS animation class if not present
      if (!element.style.animation) {
        element.style.animation = 'gradient-shift 3s ease-in-out infinite';
      }
    });
  }
  
  /**
   * Setup floating orb animations in hero section
   */
  setupFloatingOrbs() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
      if (this.isReducedMotion) return;
      
      // Randomize animation timing
      const delay = index * 2;
      const duration = 6 + random(-1, 1);
      
      orb.style.animationDelay = `${delay}s`;
      orb.style.animationDuration = `${duration}s`;
      
      // Add random movement
      this.addOrbMovement(orb);
    });
  }
  
  /**
   * Add subtle random movement to orbs
   */
  addOrbMovement(orb) {
    const moveOrb = () => {
      if (this.isReducedMotion) return;
      
      const x = random(-20, 20);
      const y = random(-20, 20);
      const rotation = random(-10, 10);
      
      orb.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      
      setTimeout(moveOrb, random(3000, 8000));
    };
    
    setTimeout(moveOrb, random(1000, 3000));
  }
  
  /**
   * Setup energy field pulse animation
   */
  setupEnergyField() {
    const energyField = document.querySelector('.energy-field');
    if (!energyField || this.isReducedMotion) return;
    
    // Dynamic pulse based on scroll position
    const updateEnergyField = throttle(() => {
      const scrollProgress = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
      const intensity = mapRange(scrollProgress, 0, 1, 0.3, 0.8);
      
      energyField.style.opacity = intensity;
    }, 50);
    
    window.addEventListener('scroll', updateEnergyField);
  }
  
  /**
   * Setup parallax effects
   */
  setupParallaxEffects() {
    if (this.isReducedMotion || Device.isMobile()) return;
    
    const parallaxElements = document.querySelectorAll('.hero-background, .gradient-orb');
    
    const handleParallax = throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.2;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleParallax);
  }
  
  /**
   * Cleanup observers and event listeners
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.animatedElements.clear();
    
    Console.info('Animation Controller cleaned up');
  }
}

/**
 * Loading screen animation controller
 */
class LoadingScreen {
  constructor() {
    this.loadingElement = document.getElementById('loading-screen');
    this.isComplete = false;
    
    this.init();
  }
  
  init() {
    if (!this.loadingElement) return;
    
    // Start loading animation
    this.startLoadingAnimation();
    
    // Complete loading when page is ready
    if (document.readyState === 'complete') {
      this.complete();
    } else {
      window.addEventListener('load', () => this.complete());
    }
  }
  
  startLoadingAnimation() {
    const spinner = this.loadingElement.querySelector('.gradient-spinner');
    const text = this.loadingElement.querySelector('.loading-text');
    
    if (spinner && !prefersReducedMotion()) {
      spinner.style.animation = 'spin 2s linear infinite';
    }
    
    if (text) {
      this.animateLoadingText(text);
    }
  }
  
  animateLoadingText(textElement) {
    const messages = [
      'Initializing Experience...',
      'Loading Gradients...',
      'Preparing Interface...',
      'Almost Ready...'
    ];
    
    let currentIndex = 0;
    
    const updateText = () => {
      if (this.isComplete) return;
      
      textElement.style.opacity = '0';
      
      setTimeout(() => {
        textElement.textContent = messages[currentIndex];
        textElement.style.opacity = '1';
        currentIndex = (currentIndex + 1) % messages.length;
        
        setTimeout(updateText, 1500);
      }, 300);
    };
    
    updateText();
  }
  
  complete() {
    if (this.isComplete) return;
    this.isComplete = true;
    
    // Fade out loading screen
    this.loadingElement.style.opacity = '0';
    
    setTimeout(() => {
      this.loadingElement.classList.add('hidden');
      this.loadingElement.style.display = 'none';
      
      // Trigger page ready event
      dispatchCustomEvent('pageReady');
      Console.success('Loading complete');
    }, 600);
  }
}

/**
 * Initialize animations when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize loading screen
  window.loadingScreen = new LoadingScreen();
  
  // Initialize animation controller after loading
  document.addEventListener('pageReady', () => {
    window.animationController = new AnimationController();
  });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.animationController) {
    window.animationController.cleanup();
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AnimationController,
    LoadingScreen
  };
}
