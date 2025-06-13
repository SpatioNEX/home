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
// const contactForm = document.querySelector('form');
// if (contactForm) {
//     contactForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         alert('Thank you for your message! Our team will respond within 24 hours.');
//         this.reset();
//     });
// }

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

// Update the form submission part of your scripts.js
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Change button text to indicate processing
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.innerHTML = `
            <i class="fas fa-circle-notch fa-spin mr-2"></i> Sending...
        `;
        submitButton.disabled = true;
        
        // Submit the form data
        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Redirect to thank you page
                window.location.href = "https://spatioaitech.github.io/home/thank-you.html";
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            // Show error message
            formStatus.textContent = 'Oops! There was a problem submitting your form. Please try again.';
            formStatus.classList.remove('hidden', 'text-green-600');
            formStatus.classList.add('text-red-600');
            formStatus.classList.remove('hidden');
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });
}

// mapbox

// Initialize Mapbox map
document.addEventListener('DOMContentLoaded', function() {
    // Set your Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoibmRvbWUyMiIsImEiOiJjbWE4MHpzcW8waHQ3MnFzZ2locGhvNzVyIn0.G0XRxSa4D0qiVIEFoMW-qw';
    
    // Coordinates for Senteu Plaza, Kilimani
    const officeLocation = [36.8057, -1.2921]; // Longitude, Latitude
    
    // Create map
    const map = new mapboxgl.Map({
        container: 'office-map',
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Using a hybrid style
        center: officeLocation,
        zoom: 15,
        pitch: 45, // Tilt the map for 3D effect
        bearing: -20 // Rotate the map slightly
    });
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());
    
    // Add 3D terrain (requires Mapbox's terrain tiles)
    map.on('load', () => {
        // Add terrain source
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        
        // Add the DEM source as a terrain layer
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        
        // Add sky layer for realistic lighting
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
        
        // Add a custom marker with popup
        const marker = new mapboxgl.Marker({
            color: "#3b82f6",
            scale: 1.2
        })
        .setLngLat(officeLocation)
        .setPopup(new mapboxgl.Popup().setHTML("<h3 class='font-bold text-blue-800'>SpatioAI Technologies</h3><p class='text-sm'>Senteu Plaza, Kilimani</p>"))
        .addTo(map);
        
        // Add some geospatial layers to showcase your expertise
        // This is a simplified example - you could add real data layers here
        map.addLayer({
            'id': 'sample-geospatial-layer',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Polygon',
                                'coordinates': [[
                                    [36.8000, -1.2900],
                                    [36.8100, -1.2900],
                                    [36.8100, -1.2950],
                                    [36.8000, -1.2950],
                                    [36.8000, -1.2900]
                                ]]
                            }
                        }
                    ]
                }
            },
            'paint': {
                'fill-color': '#3b82f6',
                'fill-opacity': 0.5,
                'fill-outline-color': '#1d4ed8'
            }
        });
        
        // Add a heatmap layer for demonstration
        map.addLayer({
            'id': 'sample-heatmap',
            'type': 'heatmap',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': { 'value': 10 },
                            'geometry': { 'type': 'Point', 'coordinates': [36.803, -1.291] }
                        },
                        {
                            'type': 'Feature',
                            'properties': { 'value': 5 },
                            'geometry': { 'type': 'Point', 'coordinates': [36.808, -1.293] }
                        }
                    ]
                }
            },
            'paint': {
                'heatmap-weight': ['interpolate', ['linear'], ['get', 'value'], 0, 0, 10, 1],
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(59, 130, 246, 0)',
                    0.2, 'rgba(59, 130, 246, 0.5)',
                    0.4, 'rgba(99, 102, 241, 0.8)',
                    0.6, 'rgba(79, 70, 229, 0.9)',
                    0.8, 'rgba(67, 56, 202, 1)'
                ],
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
                'heatmap-opacity': 0.7
            }
        });
    });
});