import { initWaterBackground } from './water';

// Create ripple effect on click
function createClickRipple(x: number, y: number) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'radial-gradient(circle, rgba(78, 96, 163, 0.6) 0%, rgba(122, 154, 199, 0.3) 50%, transparent 70%)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1000';
    ripple.style.transition = 'all 0.6s ease-out';

    document.body.appendChild(ripple);

    // Animate the ripple
    setTimeout(() => {
        ripple.style.width = '300px';
        ripple.style.height = '300px';
        ripple.style.opacity = '0';
    }, 10);

    // Remove the ripple element
    setTimeout(() => {
        document.body.removeChild(ripple);
    }, 600);
}

// Search input functionality
function setupSearchInput() {
    const searchInput = document.getElementById('heroSearch') as HTMLInputElement;
    const searchSubmit = document.getElementById('searchSubmit') as HTMLButtonElement;

    if (!searchInput || !searchSubmit) return;

    // Focus interaction
    searchInput.addEventListener('focus', () => {
        console.log('Search input focused');
        searchInput.style.boxShadow = '0 0 30px rgba(78, 96, 163, 0.5), inset 0 0 20px rgba(78, 96, 163, 0.2)';
    });

    // Blur interaction
    searchInput.addEventListener('blur', () => {
        if (!searchInput.value) {
            searchInput.style.boxShadow = '';
        }
    });

    // Input interaction with real-time effects
    searchInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        if (value.length > 0) {
            searchSubmit.style.background = 'rgba(78, 96, 163, 0.8)';
            searchSubmit.style.boxShadow = '0 0 20px rgba(78, 96, 163, 0.6)';

            // Add subtle glow to the hero title when typing
            const heroTitle = document.querySelector('.hero-title') as HTMLElement;
            if (heroTitle) {
                heroTitle.style.filter = 'drop-shadow(0 0 40px rgba(122, 154, 199, 0.7))';
            }
        } else {
            searchSubmit.style.background = 'rgba(78, 96, 163, 0.4)';
            searchSubmit.style.boxShadow = '';

            const heroTitle = document.querySelector('.hero-title') as HTMLElement;
            if (heroTitle) {
                heroTitle.style.filter = '';
            }
        }
    });

    // Submit interaction
    searchSubmit.addEventListener('click', () => {
        simulateSearch();
    });

    // Enter key submission
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            simulateSearch();
        }
    });
}

// Simulate search functionality with enhanced feedback
function simulateSearch() {
    const searchInput = document.getElementById('heroSearch') as HTMLInputElement;
    const searchSubmit = document.getElementById('searchSubmit') as HTMLButtonElement;
    const originalPlaceholder = searchInput.placeholder;

    if (!searchInput.value.trim()) {
        // Show feedback for empty search
        searchInput.style.borderColor = 'rgba(255, 100, 100, 0.5)';
        searchInput.placeholder = 'Please enter a question...';

        setTimeout(() => {
            searchInput.style.borderColor = 'rgba(78, 96, 163, 0.3)';
            searchInput.placeholder = originalPlaceholder;
        }, 2000);
        return;
    }

    // Animate search process
    searchInput.placeholder = 'Searching...';
    searchInput.disabled = true;
    searchSubmit.innerHTML = '⟳';
    searchSubmit.style.animation = 'spin 1s linear infinite';

    // Add CSS for spin animation if not exists
    if (!document.getElementById('spinKeyframes')) {
        const style = document.createElement('style');
        style.id = 'spinKeyframes';
        style.textContent = `
            @keyframes spin {
                from { transform: translateY(-50%) rotate(0deg) scale(1.1); }
                to { transform: translateY(-50%) rotate(360deg) scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        searchInput.placeholder = 'Ask me anything else...';
        searchInput.disabled = false;
        searchInput.value = '';
        searchSubmit.innerHTML = '<span>↑</span>';
        searchSubmit.style.animation = '';

        // Reset styles
        searchSubmit.style.background = 'rgba(78, 96, 163, 0.4)';
        searchSubmit.style.boxShadow = '';

        const heroTitle = document.querySelector('.hero-title') as HTMLElement;
        if (heroTitle) {
            heroTitle.style.filter = '';
        }
    }, 2000);
}

// Button interactions with enhanced effects
function setupButtonInteractions() {
    const buttons = document.querySelectorAll('button');

    for (const button of buttons) {
        button.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;

            // Add click animation
            target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                target.style.transform = '';
            }, 150);

            // Create particle effect for buttons
            createButtonParticles(e as MouseEvent);
        });

        // Hover effects
        button.addEventListener('mouseenter', () => {
            button.style.filter = 'brightness(1.2)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.filter = '';
        });
    }
}

// Create particle effect for button clicks
function createButtonParticles(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(78, 96, 163, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1001';
        particle.style.transition = 'all 0.8s ease-out';

        document.body.appendChild(particle);

        // Animate particles
        setTimeout(() => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = '0';
            particle.style.width = '2px';
            particle.style.height = '2px';
        }, 10);

        setTimeout(() => {
            document.body.removeChild(particle);
        }, 800);
    }
}

// Hamburger menu toggle
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger') as HTMLButtonElement;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    for (const link of links) {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target as Node) && !navLinks.contains(e.target as Node)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a');

    for (const link of navLinks) {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Add visual feedback for nav clicks
            link.classList.add('clicked');
            setTimeout(() => {
                link.classList.remove('clicked');
            }, 300);

            console.log(`Navigation clicked: ${link.textContent}`);
        });
    }
}

// Add CSS for nav click effect
function addNavClickEffect() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a.clicked {
            color: white !important;
            text-shadow: 0 0 15px rgba(78, 96, 163, 0.8) !important;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
}

// Keyboard shortcuts and easter eggs
function setupKeyboardInteractions() {
    document.addEventListener('keydown', (e) => {
        // Space bar creates a random color burst
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            createColorBurst();
        }

        // Enter key focuses search if not already focused
        if (e.code === 'Enter' && e.target === document.body) {
            const searchInput = document.getElementById('heroSearch') as HTMLInputElement;
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape key blurs search input
        if (e.code === 'Escape') {
            const searchInput = document.getElementById('heroSearch') as HTMLInputElement;
            if (searchInput) {
                searchInput.blur();
            }
        }
    });
}

// Create color burst effect
function createColorBurst() {
    const colors = [
        'rgba(78, 96, 163, 0.8)',
        'rgba(122, 154, 199, 0.8)',
        'rgba(83, 52, 131, 0.8)',
        'rgba(43, 51, 94, 0.8)'
    ];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1002';
        particle.style.transition = 'all 1.2s ease-out';

        document.body.appendChild(particle);

        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = '0';
            particle.style.width = '2px';
            particle.style.height = '2px';
        }, 10);

        setTimeout(() => {
            document.body.removeChild(particle);
        }, 1200);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 X.AI Interactive Landing Page Initialized');
    console.log('💡 Try moving your mouse, clicking, typing in the search box, or pressing Space!');

    // Initialize all functionality
    initWaterBackground();
    setupSearchInput();
    setupButtonInteractions();
    setupHamburgerMenu();
    setupSmoothScrolling();
    setupKeyboardInteractions();
    addNavClickEffect();

    // Welcome animation
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title') as HTMLElement;
        if (heroTitle) {
            heroTitle.style.transition = 'all 1s ease';
            heroTitle.style.filter = 'drop-shadow(0 0 30px rgba(122, 154, 199, 0.6))';

            setTimeout(() => {
                heroTitle.style.filter = '';
            }, 2000);
        }
    }, 500);
});

// Export for potential external use
export {
    createClickRipple,
    createColorBurst,
    simulateSearch
};

