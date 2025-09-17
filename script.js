        // --- Interactive Particle System ---
        const INTERACTIVE_PARTICLE_COUNT = 40;
        const interactiveParticles = [];
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        class InteractiveParticle {
            constructor() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = (Math.random() - 0.5) * 1.2;
                this.size = Math.random() * 3 + 2;
                this.el = document.createElement('div');
                this.el.className = 'particle';
                this.el.style.width = this.size + 'px';
                this.el.style.height = this.size + 'px';
                this.el.style.background = 'rgba(255,255,255,0.85)';
                this.el.style.position = 'absolute';
                this.el.style.borderRadius = '50%';
                this.el.style.pointerEvents = 'none';
                this.el.style.zIndex = '3';
                document.body.appendChild(this.el);
            }
            update() {
                // Attraction/repulsion to mouse
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    // Repel
                    this.vx -= dx / dist * 0.15;
                    this.vy -= dy / dist * 0.15;
                } else if (dist < 300) {
                    // Attract
                    this.vx += dx / dist * 0.01;
                    this.vy += dy / dist * 0.01;
                }
                // Damping
                this.vx *= 0.96;
                this.vy *= 0.96;
                // Move
                this.x += this.vx;
                this.y += this.vy;
                // Bounce off edges
                if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
                if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
                // Draw
                this.el.style.left = this.x + 'px';
                this.el.style.top = this.y + 'px';
            }
        }
        for (let i = 0; i < INTERACTIVE_PARTICLE_COUNT; i++) {
            interactiveParticles.push(new InteractiveParticle());
        }
        function animateInteractiveParticles() {
            for (const p of interactiveParticles) p.update();
            requestAnimationFrame(animateInteractiveParticles);
        }
        animateInteractiveParticles();
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('touchmove', e => {
            if (e.touches && e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        });
        window.addEventListener('resize', () => {
            // Optionally reposition particles on resize
            for (const p of interactiveParticles) {
                p.x = Math.random() * window.innerWidth;
                p.y = Math.random() * window.innerHeight;
            }
        });

        // Create floating particles
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            // Random particle size
            const size = Math.random() * 2 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.3;
            
            document.body.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 25000);
        }

        // Create glowing orbs
        function createOrb() {
            const orb = document.createElement('div');
            orb.className = 'orb';
            orb.style.top = Math.random() * 100 + 'vh';
            orb.style.left = '-100px';
            
            const size = Math.random() * 100 + 50;
            orb.style.width = size + 'px';
            orb.style.height = size + 'px';
            orb.style.animationDuration = (Math.random() * 20 + 30) + 's';
            
            document.body.appendChild(orb);
            
            setTimeout(() => {
                if (orb.parentNode) {
                    orb.parentNode.removeChild(orb);
                }
            }, 50000);
        }

        // Generate particles continuously
        setInterval(createParticle, 300);
        setInterval(createOrb, 8000);

        // Initial particles
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 100);
        }

        // Initial orbs
        for (let i = 0; i < 3; i++) {
            setTimeout(createOrb, i * 3000);
        }

        // Button click handler
        function handleClick() {
            // Add click animation
            const button = document.querySelector('button');
            button.style.transform = 'scale(0.95)';
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.borderRadius = '50%';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            
            button.appendChild(ripple);
            
            // Animate ripple
            ripple.animate([
                { width: '0px', height: '0px' },
                { width: '200px', height: '200px', opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-out'
            });
            
            setTimeout(() => {
                button.style.transform = '';
                ripple.remove();
            }, 150);
        }

        // Mouse move effect for particles
        document.addEventListener('mousemove', (e) => {
            // Increase the number of particles per mouse move
            for (let i = 0; i < 5; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = (Math.random() * 3 + 2) + 'px';
                particle.style.height = particle.style.width;
                particle.style.background = 'rgba(255, 255, 255, 0.7)';
                particle.style.borderRadius = '50%';
                // Spread particles around the cursor
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * 20;
                const x = e.clientX + Math.cos(angle) * radius;
                const y = e.clientY + Math.sin(angle) * radius;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '15';
                document.body.appendChild(particle);
                particle.animate([
                    { opacity: 1, transform: 'scale(1)' },
                    { opacity: 0, transform: 'scale(0.5)' }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                });
                setTimeout(() => particle.remove(), 1000);
            }
        });
// Scroll animation observer
function initScrollAnimations() {
    // Only run animations on desktop (screen width > 768px)
    if (window.innerWidth <= 768) {
        return;
    }

    const animatedSections = document.querySelectorAll('#myintro, #Contributions, #competitions, #exp, #Hobbies');

    const observerOptions = {
        threshold: 0.3, // Trigger when 30% of element is visible
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before element comes into view
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all animated sections
    animatedSections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Re-initialize on window resize (in case user switches between mobile/desktop)
window.addEventListener('resize', () => {
    // Remove existing animations
    const animatedSections = document.querySelectorAll('#myintro, #Contributions, #competitions, #exp, #Hobbies');
    animatedSections.forEach(section => {
        section.classList.remove('animate');
    });
    
    // Re-initialize
    setTimeout(initScrollAnimations, 100);
});