// Scroll-based Image Transition
class ScrollImageTransition {
  constructor() {
    this.aboutSection = document.querySelector('.about');
    this.humanImage = document.querySelector('.profile-image.human');
    this.robotImage = document.querySelector('.profile-image.bot');
    this.imageWrapper = document.querySelector('.image-wrapper');

    this.init();
  }

  init() {
    if (!this.aboutSection || !this.humanImage || !this.robotImage) return;

    this.setupScrollListener();
    this.updateImageTransition(); // Initial state
  }

  setupScrollListener() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateImageTransition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  updateImageTransition() {
    const aboutRect = this.aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const sectionTop = aboutRect.top;
    const sectionHeight = aboutRect.height;
    const sectionBottom = aboutRect.bottom;

    let progress = 0;

    // Only start transition when section is in viewport
    if (sectionTop <= windowHeight && sectionBottom >= 0) {
      // Calculate progress from when section enters to when it exits
      if (sectionTop <= 0) {
        // Section has scrolled past the top - calculate progress through the section
        const scrolledDistance = Math.abs(sectionTop);
        const totalScrollableDistance = sectionHeight - windowHeight;
        progress = Math.min(scrolledDistance / totalScrollableDistance, 1);
      } else {
        // Section is still entering viewport - no transition yet
        progress = 0;
      }
    } else if (sectionBottom < 0) {
      // Section has completely scrolled past - fully robot
      progress = 1;
    } else {
      // Section hasn't entered yet - fully human
      progress = 0;
    }

    // Apply transition based on progress
    this.applyImageTransition(progress);
  }

  applyImageTransition(progress) {
    // Smooth transition from human (0) to robot (1)
    const humanOpacity = Math.max(0, Math.min(1, 1 - progress));
    const robotOpacity = Math.max(0, Math.min(1, progress));

    this.humanImage.style.opacity = humanOpacity;
    this.robotImage.style.opacity = robotOpacity;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ScrollImageTransition();
});