/* =============================================================================
   UTILITY FUNCTIONS - GRADIENT PULSE DESIGN SYSTEM
   ============================================================================= */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Percentage of element that should be visible
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element, threshold = 0.1) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
  
  return (vertInView && horInView) && (rect.height * threshold < windowHeight - rect.top);
}

/**
 * Smooth scroll to element
 * @param {string|HTMLElement} target - Target element or selector
 * @param {number} offset - Offset from top in pixels
 * @param {number} duration - Animation duration in milliseconds
 */
function smoothScrollTo(target, offset = 0, duration = 1000) {
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;
  
  const targetPosition = targetElement.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }
  
  function easeInOutQuart(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t*t + b;
    t -= 2;
    return -c/2 * (t*t*t*t - 2) + b;
  }
  
  requestAnimationFrame(animation);
}

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
function random(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Clamp number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Map a value from one range to another
 * @param {number} value - Value to map
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Get element's offset from document top
 * @param {HTMLElement} element - Element to get offset for
 * @returns {number} Offset in pixels
 */
function getElementOffset(element) {
  let offset = 0;
  while (element) {
    offset += element.offsetTop;
    element = element.offsetParent;
  }
  return offset;
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create and dispatch custom event
 * @param {string} eventName - Name of the event
 * @param {any} detail - Event detail data
 * @param {HTMLElement} element - Element to dispatch from (default: document)
 */
function dispatchCustomEvent(eventName, detail = null, element = document) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
}

/**
 * Wait for specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after specified time
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get CSS custom property value
 * @param {string} property - CSS custom property name (with or without --)
 * @param {HTMLElement} element - Element to get property from (default: document.documentElement)
 * @returns {string} Property value
 */
function getCSSProperty(property, element = document.documentElement) {
  const propName = property.startsWith('--') ? property : `--${property}`;
  return getComputedStyle(element).getPropertyValue(propName).trim();
}

/**
 * Set CSS custom property value
 * @param {string} property - CSS custom property name (with or without --)
 * @param {string} value - Property value
 * @param {HTMLElement} element - Element to set property on (default: document.documentElement)
 */
function setCSSProperty(property, value, element = document.documentElement) {
  const propName = property.startsWith('--') ? property : `--${property}`;
  element.style.setProperty(propName, value);
}

/**
 * Preload images
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @returns {Promise} Promise that resolves when all images are loaded
 */
function preloadImages(imageUrls) {
  const promises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
  });
  
  return Promise.all(promises);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Animate number from start to end
 * @param {HTMLElement} element - Element to update
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} onUpdate - Callback for each update (optional)
 */
function animateNumber(element, start, end, duration = 1000, onUpdate = null) {
  if (prefersReducedMotion()) {
    element.textContent = formatNumber(end);
    if (onUpdate) onUpdate(end);
    return;
  }
  
  const range = end - start;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (range * easeOut);
    
    element.textContent = formatNumber(Math.floor(current));
    if (onUpdate) onUpdate(current);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = formatNumber(end);
      if (onUpdate) onUpdate(end);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Device and feature detection utilities
 */
const Device = {
  isMobile: () => /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isTablet: () => /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
  isDesktop: () => !Device.isMobile() && !Device.isTablet(),
  isTouchDevice: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  supportsWebP: () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  },
  supportsIntersectionObserver: () => 'IntersectionObserver' in window,
  supportsResizeObserver: () => 'ResizeObserver' in window
};

/**
 * Console styling utilities for debugging
 */
const Console = {
  success: (message) => console.log(`%c✓ ${message}`, 'color: #10B981; font-weight: bold;'),
  error: (message) => console.error(`%c✗ ${message}`, 'color: #EF4444; font-weight: bold;'),
  info: (message) => console.info(`%cℹ ${message}`, 'color: #3B82F6; font-weight: bold;'),
  warn: (message) => console.warn(`%c⚠ ${message}`, 'color: #F59E0B; font-weight: bold;')
};

// Export utilities for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    isInViewport,
    smoothScrollTo,
    random,
    clamp,
    lerp,
    mapRange,
    getElementOffset,
    prefersReducedMotion,
    dispatchCustomEvent,
    wait,
    getCSSProperty,
    setCSSProperty,
    preloadImages,
    formatNumber,
    animateNumber,
    Device,
    Console
  };
}
