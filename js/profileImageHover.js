// Profile Image Hover Control
class ProfileImageHover {
  constructor() {
    this.container = document.querySelector('.image-wrapper');
    this.isAnimating = false;
    this.hoverTimeout = null;
    this.lastHoverTime = 0;
    this.minHoverDelay = 300; // Minimum time between hover state changes

    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
    this.container.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));

    // Prevent rapid state changes
    this.container.addEventListener('transitionstart', () => {
      this.isAnimating = true;
    });

    this.container.addEventListener('transitionend', () => {
      this.isAnimating = false;
    });
  }

  handleMouseEnter(e) {
    const currentTime = Date.now();

    // Clear any pending timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Check if enough time has passed since last hover
    if (currentTime - this.lastHoverTime < this.minHoverDelay && this.isAnimating) {
      return;
    }

    this.lastHoverTime = currentTime;
    this.container.classList.add('hovered');
  }

  handleMouseLeave(e) {
    const currentTime = Date.now();

    // Add a small delay before removing hover state to prevent rapid toggling
    this.hoverTimeout = setTimeout(() => {
      if (currentTime - this.lastHoverTime >= this.minHoverDelay) {
        this.container.classList.remove('hovered');
        this.lastHoverTime = currentTime;
      }
    }, 100);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProfileImageHover();
});