// =============================================================================
// CONTACT FORM MODULE
// Single Responsibility: Handle contact form submission and validation
// =============================================================================

class ContactFormManager {
    constructor() {
        this.contactForm = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.setupFormSubmission();
        }
    }

    setupFormSubmission() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple form validation and submission feedback
            const name = this.contactForm.querySelector('input[type="text"]').value;
            const email = this.contactForm.querySelector('input[type="email"]').value;
            const message = this.contactForm.querySelector('textarea').value;

            if (name && email && message) {
                // Show success message
                this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.contactForm.reset();
            } else {
                this.showMessage('Please fill in all fields.', 'error');
            }
        });
    }

    showMessage(text, type) {
        // Create message element
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.textContent = text;
        
        // Add styles
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-secondary)' : 'var(--color-accent)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(message);
        
        // Animate in
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateX(100%)';
            setTimeout(() => document.body.removeChild(message), 300);
        }, 3000);
    }
}