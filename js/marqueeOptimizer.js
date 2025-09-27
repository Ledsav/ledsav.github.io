// Simple Marquee Optimizer
// Ensures smooth continuous scrolling without jumps

function initMarqueeAnimation() {
  const marqueeRows = document.querySelectorAll('.marquee-row');

  marqueeRows.forEach((row, index) => {
    const content = row.querySelector('.marquee-content');

    if (!content) return;

    // Set consistent timing for smooth animation
    const duration = 60; // seconds for full cycle
    const direction = index % 2 === 0 ? 'marqueeLeft' : 'marqueeRight';

    // Apply animation with consistent timing
    content.style.animation = `${direction} ${duration}s linear infinite`;

    // Ensure hardware acceleration
    content.style.willChange = 'transform';
    content.style.backfaceVisibility = 'hidden';
    content.style.perspective = '1000px';
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all styles are loaded
  setTimeout(initMarqueeAnimation, 100);
});