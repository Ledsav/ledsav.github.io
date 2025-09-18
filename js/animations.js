// =============================================================================
// ANIMATIONS MODULE
// Single Responsibility: Handle all visual animations and effects
// =============================================================================

class AnimationsManager {
    constructor() {
        this.init();
    }

    init() {
        // this.setupHeroTitleAnimation();
        this.setupHeroSubtitleAnimation();
        this.setupCardHoverEffects();
    }

    setupHeroTitleAnimation() {
        // Add typing effect to hero title
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.style.borderRight = '2px solid var(--color-primary)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    // Remove cursor after typing
                    setTimeout(() => {
                        heroTitle.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // Start typing effect after a short delay
            setTimeout(typeWriter, 500);
        }
    }

    setupHeroSubtitleAnimation() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            const titles = [
                'Biomedical Engineer',
                'Full Stack Developer', 
                'Sport Lover',
                'Event Organizer',
                'Artist for hobby'
            ];
            
            let currentTitleIndex = 0;
            let currentCharIndex = 0;
            let isDeleting = false;
            
            const typeSpeed = 100;
            const deleteSpeed = 50;
            const pauseDuration = 2000;
            
            // Add blinking cursor effect with gradient-compatible styling
            heroSubtitle.style.position = 'relative';
            
            // Create cursor element
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '|';
            cursor.style.cssText = `
                color: var(--accent-color);
                animation: blink 1s infinite;
                margin-left: 2px;
            `;
            
            // Add CSS for blinking cursor
            const style = document.createElement('style');
            style.textContent = `
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            const typeWriter = () => {
                const currentTitle = titles[currentTitleIndex];
                
                if (!isDeleting) {
                    // Typing
                    if (currentCharIndex < currentTitle.length) {
                        heroSubtitle.textContent = currentTitle.substring(0, currentCharIndex + 1);
                        currentCharIndex++;
                        setTimeout(typeWriter, typeSpeed);
                    } else {
                        // Pause before deleting
                        setTimeout(() => {
                            isDeleting = true;
                            typeWriter();
                        }, pauseDuration);
                    }
                } else {
                    // Deleting
                    if (currentCharIndex > 0) {
                        heroSubtitle.textContent = currentTitle.substring(0, currentCharIndex - 1);
                        currentCharIndex--;
                        setTimeout(typeWriter, deleteSpeed);
                    } else {
                        // Move to next title
                        isDeleting = false;
                        currentTitleIndex = (currentTitleIndex + 1) % titles.length;
                        setTimeout(typeWriter, typeSpeed);
                    }
                }
                
                // Append cursor after text
                heroSubtitle.appendChild(cursor);
            };
            
            // Start the animation after title animation completes
            setTimeout(typeWriter, 2500);
        }
    }

    setupCardHoverEffects() {
        // Add simple hover effects to project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Add simple hover effects to skill cards
        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05)';
                card.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
            });
        });
    }
}