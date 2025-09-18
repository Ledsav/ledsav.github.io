




class MouseFollowerManager {
    constructor() {
        this.followerDot = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.delay = 0.1; 
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.createFollowerDot();
        this.setupMouseTracking();
        this.startAnimation();
    }

    createFollowerDot() {
        
        this.followerDot = document.createElement('div');
        this.followerDot.className = 'mouse-follower-dot';
        
        
        this.followerDot.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--gradient-text);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        `;
        
        
        document.body.appendChild(this.followerDot);
        
        
        setTimeout(() => {
            this.followerDot.style.opacity = '1';
        }, 50);
    }

    setupMouseTracking() {
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        
        document.addEventListener('mouseleave', () => {
            this.followerDot.style.opacity = '0';
        });

        
        document.addEventListener('mouseenter', () => {
            this.followerDot.style.opacity = '1';
        });

        
        document.addEventListener('click', () => {
            this.addClickEffect();
        });
    }

    startAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.animate();
    }

    animate() {
        
        this.dotX += (this.mouseX - this.dotX) * this.delay;
        this.dotY += (this.mouseY - this.dotY) * this.delay;
        
        
        if (this.followerDot) {
            this.followerDot.style.left = `${this.dotX}px`;
            this.followerDot.style.top = `${this.dotY}px`;
        }
        
        
        requestAnimationFrame(() => this.animate());
    }

    addClickEffect() {
        if (!this.followerDot) return;
        
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
            left: ${this.mouseX}px;
            top: ${this.mouseY}px;
            animation: ripple-effect 0.6s ease-out forwards;
        `;
        
        
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple-effect {
                    to {
                        transform: translate(-50%, -50%) scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(ripple);
        
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
        
        
        this.followerDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        setTimeout(() => {
            this.followerDot.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 150);
    }

    
    setHoverState(isHovering) {
        if (!this.followerDot) return;
        
        if (isHovering) {
            this.followerDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            this.followerDot.style.background = 'var(--gradient-aurora-teal)';
        } else {
            this.followerDot.style.transform = 'translate(-50%, -50%) scale(1)';
            this.followerDot.style.background = 'var(--gradient-text)';
        }
    }

    
    hide() {
        if (this.followerDot) {
            this.followerDot.style.opacity = '0';
        }
    }

    
    show() {
        if (this.followerDot) {
            this.followerDot.style.opacity = '1';
        }
    }
}