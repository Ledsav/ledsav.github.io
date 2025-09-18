// Marquee Animation Optimizer
// Calculates precise animation distances to eliminate jumps

function optimizeMarqueeAnimation() {
  const marqueeRows = document.querySelectorAll('.marquee-row');
  
  marqueeRows.forEach((row, index) => {
    const content = row.querySelector('.marquee-content');
    const skillItems = content.querySelectorAll('.skill-item');
    
    // Calculate the width of the first half (original items)
    const originalItemsCount = skillItems.length / 2;
    let totalWidth = 0;
    
    // Calculate width of first half including gaps
    for (let i = 0; i < originalItemsCount; i++) {
      const item = skillItems[i];
      const computedStyle = window.getComputedStyle(item);
      const itemWidth = item.offsetWidth + parseFloat(computedStyle.marginRight) + parseFloat(computedStyle.marginLeft);
      totalWidth += itemWidth;
    }
    
    // Add gaps between items
    const gap = parseFloat(window.getComputedStyle(content).gap);
    totalWidth += gap * (originalItemsCount - 1);
    
    // Calculate the precise percentage
    const containerWidth = content.scrollWidth;
    const precisePercentage = (totalWidth / containerWidth) * 100;
    
    // Create optimized keyframes
    const animationName = index % 2 === 0 ? 'marqueeLeftOptimized' : 'marqueeRightOptimized';
    const direction = index % 2 === 0 ? -precisePercentage : precisePercentage;
    
    // Inject optimized CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${animationName} {
        0% { transform: translate3d(${index % 2 === 0 ? '0%' : -precisePercentage + '%'}, 0, 0); }
        100% { transform: translate3d(${index % 2 === 0 ? -precisePercentage + '%' : '0%'}, 0, 0); }
      }
    `;
    document.head.appendChild(style);
    
    // Apply the optimized animation
    content.style.animation = `${animationName} 40s linear infinite`;
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all styles are loaded
  setTimeout(optimizeMarqueeAnimation, 100);
});

// Re-optimize on window resize
window.addEventListener('resize', () => {
  clearTimeout(window.marqueeResizeTimeout);
  window.marqueeResizeTimeout = setTimeout(optimizeMarqueeAnimation, 250);
});