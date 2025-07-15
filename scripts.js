// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
            
            // Toggle hamburger/close icon
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('block')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('block');
            mobileMenuButton.querySelector('i').classList.remove('fa-times');
            mobileMenuButton.querySelector('i').classList.add('fa-bars');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Check if the link is from index.html to team.html
            if (this.getAttribute('href').startsWith('team.html#')) {
                return; // Let the link work normally
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('block');
                    mobileMenuButton.querySelector('i').classList.remove('fa-times');
                    mobileMenuButton.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Change button text to indicate processing
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = `<i class="fas fa-circle-notch fa-spin mr-2"></i> Sending...`;
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
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }

    // Initialize Mapbox map if element exists
    const officeMap = document.getElementById('office-map');
    if (officeMap && typeof mapboxgl !== 'undefined') {
        mapboxgl.accessToken = 'pk.eyJ1IjoibmRvbWUyMiIsImEiOiJjbWE4MHpzcW8waHQ3MnFzZ2locGhvNzVyIn0.G0XRxSa4D0qiVIEFoMW-qw';
        
        // Coordinates for Senteu Plaza, Kilimani
        const officeLocation = [36.8057, -1.2921]; // Longitude, Latitude
        
        // Create map
        const map = new mapboxgl.Map({
            container: 'office-map',
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: officeLocation,
            zoom: 15,
            pitch: 45,
            bearing: -20
        });
        
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());
        
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
        });
    }

    // PWA Installation Prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show your custom install prompt
        showInstallPromotion();
    });
    
    function showInstallPromotion() {
        // Create and show your custom install prompt UI
        const installPrompt = document.createElement('div');
        installPrompt.className = 'fixed bottom-0 left-0 right-0 bg-blue-800 text-white p-4 flex justify-between items-center z-50';
        installPrompt.innerHTML = `
            <div>
                <p class="font-medium">Install SpatioAI for a better experience?</p>
                <p class="text-sm opacity-80">Add to your home screen for quick access</p>
            </div>
            <div class="flex space-x-2">
                <button id="dismiss-install" class="px-4 py-2 rounded border border-white">Later</button>
                <button id="install-app" class="px-4 py-2 rounded bg-white text-blue-800 font-medium">Install</button>
            </div>
        `;
        
        document.body.appendChild(installPrompt);
        
        document.getElementById('install-app').addEventListener('click', async () => {
            // Hide the install prompt
            installPrompt.style.display = 'none';
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            // Optionally, send analytics event with outcome of user choice
            console.log(`User response to the install prompt: ${outcome}`);
            // We've used the prompt, and can't use it again, throw it away
            deferredPrompt = null;
        });
        
        document.getElementById('dismiss-install').addEventListener('click', () => {
            installPrompt.style.display = 'none';
        });
    }
    
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration.scope);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});