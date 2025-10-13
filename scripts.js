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
                    window.location.href = "https://docs.spationex.com/thank-you.html";
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
            .setPopup(new mapboxgl.Popup().setHTML("<h3 class='font-bold text-blue-800'>SpatioNEX Technologies</h3><p class='text-sm'>Senteu Plaza, Kilimani</p>"))
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
                <p class="font-medium">Install SpatioNEX for a better experience?</p>
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



// 3D Globe Visualization
document.addEventListener('DOMContentLoaded', () => {
    const globeContainer = document.getElementById('globe-visualization');
    if (globeContainer) {
        // added new

        function setGlobeHeight() {
        if (window.innerWidth < 768) {
            globeContainer.style.height = '300px';
        } else {
            globeContainer.style.height = '500px';
        }
    }
    
    // Call initially and on resize
    setGlobeHeight();
    window.addEventListener('resize', setGlobeHeight);

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
        globeContainer.appendChild(renderer.domElement);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Create globe
        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const texture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
        const bumpMap = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            bumpMap: bumpMap,
            bumpScale: 0.05,
            specular: new THREE.Color('grey'),
            shininess: 5
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);
        
        // Add clouds
        const cloudGeometry = new THREE.SphereGeometry(5.1, 32, 32);
        const cloudTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png');
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: cloudTexture,
            transparent: true,
            opacity: 0.4
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(clouds);
        
        // Position camera
        camera.position.z = 10;
        
        // Add orbit controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        
        // Add data points (Africa-focused)
        const dataPoints = [
            { lat: -1.2921, lng: 36.8219, size: 0.2, color: 0xff0000 }, // Nairobi
            { lat: -0.0236, lng: 37.9062, size: 0.15, color: 0x00ff00 }, // Mt. Kenya
            { lat: -3.0674, lng: 37.3556, size: 0.25, color: 0x0000ff }, // Kilimanjaro
            { lat: 9.1450, lng: 40.4897, size: 0.2, color: 0xffff00 }, // Addis Ababa
            { lat: -26.2041, lng: 28.0473, size: 0.2, color: 0xff00ff } // Johannesburg
        ];
        
        dataPoints.forEach(point => {
            const phi = (90 - point.lat) * (Math.PI / 180);
            const theta = (point.lng + 180) * (Math.PI / 180);
            
            const x = -(5.2) * Math.sin(phi) * Math.cos(theta);
            const y = (5.2) * Math.cos(phi);
            const z = (5.2) * Math.sin(phi) * Math.sin(theta);
            
            const geometry = new THREE.SphereGeometry(point.size, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: point.color });
            const sphere = new THREE.Mesh(geometry, material);
            
            sphere.position.set(x, y, z);
            scene.add(sphere);
            
            // Add pulsing animation
            let scale = 1;
            const animatePulse = () => {
                scale = 1 + Math.sin(Date.now() * 0.002) * 0.3;
                sphere.scale.set(scale, scale, scale);
                requestAnimationFrame(animatePulse);
            };
            animatePulse();
        });
        
        // Add connecting lines (simulating data flows)
        for (let i = 0; i < dataPoints.length - 1; i++) {
            const phi1 = (90 - dataPoints[i].lat) * (Math.PI / 180);
            const theta1 = (dataPoints[i].lng + 180) * (Math.PI / 180);
            const x1 = -(5.1) * Math.sin(phi1) * Math.cos(theta1);
            const y1 = (5.1) * Math.cos(phi1);
            const z1 = (5.1) * Math.sin(phi1) * Math.sin(theta1);
            
            const phi2 = (90 - dataPoints[i+1].lat) * (Math.PI / 180);
            const theta2 = (dataPoints[i+1].lng + 180) * (Math.PI / 180);
            const x2 = -(5.1) * Math.sin(phi2) * Math.cos(theta2);
            const y2 = (5.1) * Math.cos(phi2);
            const z2 = (5.1) * Math.sin(phi2) * Math.sin(theta2);
            
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(x1, y1, z1),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(x2, y2, z2)
            ]);
            
            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: 0x00ffff,
                transparent: true,
                opacity: 0.6
            });
            
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            
            // Animate the line
            let progress = 0;
            const animateLine = () => {
                progress = (progress + 0.002) % 1;
                const visiblePoints = Math.floor(points.length * progress);
                const visibleGeometry = new THREE.BufferGeometry().setFromPoints(points.slice(0, visiblePoints));
                line.geometry.dispose();
                line.geometry = visibleGeometry;
                requestAnimationFrame(animateLine);
            };
            animateLine();
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
        });
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            clouds.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();
    }
});