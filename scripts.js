// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.toggle('hidden');
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Language selector dropdown
const languageSelector = document.querySelector('.language-selector');
if (languageSelector) {
    const dropdown = languageSelector.querySelector('.language-dropdown');
    
    // Desktop: hover
    languageSelector.addEventListener('mouseenter', function() {
        if (dropdown) dropdown.classList.remove('hidden');
    });
    
    languageSelector.addEventListener('mouseleave', function() {
        if (dropdown) dropdown.classList.add('hidden');
    });
    
    // Mobile: click
    languageSelector.addEventListener('click', function() {
        if (dropdown) dropdown.classList.toggle('hidden');
    });
}

// Form submission
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! Our team will respond within 24 hours.');
        this.reset();
    });
}

// Intersection Observer for scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    
    // Map zoom functionality
    const mapZoom = document.getElementById('map-zoom');
    const mapContainer = document.querySelector('.map-container');
    
    if (mapZoom && mapContainer) {
        mapZoom.addEventListener('click', () => {
            mapContainer.classList.toggle('fixed');
            mapContainer.classList.toggle('inset-0');
            mapContainer.classList.toggle('z-50');
            mapContainer.classList.toggle('h-screen');
            mapContainer.classList.toggle('rounded-none');
            
            if (mapContainer.classList.contains('fixed')) {
                mapZoom.innerHTML = '<i class="fas fa-compress text-blue-800"></i>';
            } else {
                mapZoom.innerHTML = '<i class="fas fa-expand text-blue-800"></i>';
            }
        });
    }
    
    // Add animation classes to elements
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 100}ms`;
    });
});