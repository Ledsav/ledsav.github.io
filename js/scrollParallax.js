// Parallax and 3D tilt scroll effects for project and experience cards
(function() {
  function lerp(a, b, n) {
    return (1 - n) * a + n * b;
  }

  // Parallax for images
  function parallaxImages() {
    const images = document.querySelectorAll('.featured-project-image img');
    window.addEventListener('scroll', () => {
      const winH = window.innerHeight;
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < winH && rect.bottom > 0) {
          const percent = (rect.top + rect.height/2 - winH/2) / winH;
          img.style.transform = `scale(1.05) translateY(${percent * 30}px)`;
        } else {
          img.style.transform = '';
        }
      });
    });
  }

  // 3D tilt for cards
  function tiltCards() {
    const cards = document.querySelectorAll('.featured-project-card, .experience-card');
    window.addEventListener('scroll', () => {
      const winH = window.innerHeight;
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < winH && rect.bottom > 0) {
          const percent = (rect.top + rect.height/2 - winH/2) / winH;
          const tilt = percent * 8; // degrees
          card.style.transform = `perspective(800px) rotateX(${tilt}deg)`;
        } else {
          card.style.transform = '';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    parallaxImages();
    tiltCards();
  });
})();
