// ============================================
// RED ANGEL SENATE - WEBSITE SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    initNavScroll();
    initSmoothScroll();
    initCounters();
    initScrollAnimations();
});

// Loading Screen
function initLoader() {
    const loader = document.getElementById('loadingScreen');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2500);
    });
    
    // Fallback
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 4000);
}

// Floating Particles
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 15 + 10}s;
            animation-delay: ${Math.random() * 15}s;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
        `;
        container.appendChild(particle);
    }
}

// Navigation Scroll
function initNavScroll() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .mode-card, .coming-card, .about-feature, .screenshot-item, .social-card, .download-btn'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mobile Menu (if needed)
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });
}

// Console Easter Egg
console.log(`
%c 😈 RED ANGEL SENATE 😈 
%c ═══════════════════════════════════════
%c Your Private AI Command Center
%c Six Minds. One Question. No Limits.
%c ═══════════════════════════════════════

%c ⬇️  Download: https://redangel.fun
%c 𝕏  Community: https://x.com/i/communities/1983507349546357091
%c 🤗 Hugging Face: https://huggingface.co/shayzinasimulation

%c Made with ❤️ by Shayz Productions
%c No data collection. No tracking. Ever.
`,
'color: #ff2d2d; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #ff2d2d;',
'color: #ff2d2d;',
'color: #ffffff; font-size: 14px;',
'color: #ff6b6b; font-size: 12px; font-style: italic;',
'color: #ff2d2d;',
'color: #00ff88; font-size: 12px;',
'color: #00ff88; font-size: 12px;',
'color: #00ff88; font-size: 12px;',
'color: #ffd700; font-size: 11px; margin-top: 10px;',
'color: #666666; font-size: 10px;'
);

// Keyboard shortcut to open dev tools message
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        console.log('%c 👋 Welcome, fellow developer!', 'color: #ff2d2d; font-size: 16px;');
    }
});
