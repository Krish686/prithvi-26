
// ===========================
// 1. THREE.JS 3D EARTH
// ===========================
let scene, camera, renderer, earth, particles, material, particlesMat;
let mouseX = 0;
let mouseY = 0;

function initThreeJS() {
    try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const canvas = document.getElementById('geo-canvas');
        if (canvas) {
            canvas.appendChild(renderer.domElement);
        }

        // Earth Geometry
        const geometry = new THREE.IcosahedronGeometry(5, 15);
        material = new THREE.MeshBasicMaterial({
            color: 0x00f2ff,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        // Particles
        const particlesGeo = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesMat = new THREE.PointsMaterial({ size: 0.03, color: 0x7c3aed });
        particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        camera.position.z = 10;

        animate();
    } catch (error) {
        console.error('Three.js initialization failed:', error);
    }
}



document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
});

function animate() {
    requestAnimationFrame(animate);
    material.opacity = 0.1 + Math.sin(Date.now() * 0.001) * 0.05;

    if (earth) {
        // Base rotation + mouse influence for a more natural feel
        earth.rotation.y += 0.001 + (mouseX * 0.05);
        earth.rotation.x += 0.0005 + (mouseY * 0.05);
    }

    if (particles) {
        // Particles rotate slightly slower for depth (Parallax effect)
        particles.rotation.y -= 0.0002;
        particles.rotation.x += mouseX * 0.01;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
});

initThreeJS();

// ===========================
// 2. THEME SWITCHER
// ===========================
const themeBtn = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
    if (themeBtn) {
        if (theme === 'light') {
            themeBtn.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
        }
    }
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);

        // Update 3D colors
        if (material && particlesMat) {
            if (next === 'light') {
                material.color.setHex(0x0284c7);
                particlesMat.color.setHex(0x0d9488);
            } else {
                material.color.setHex(0x00f2ff);
                particlesMat.color.setHex(0x7c3aed);
            }
        }
    });
}

// ===========================
// 3. MOBILE MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu(show) {
    if (mobileMenu && hamburger) {
        const isOpen = show !== undefined ? show : !mobileMenu.classList.contains('active');

        mobileMenu.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);

        // Use visibility instead of 'hidden' attribute for smoother GSAP/CSS transitions
        mobileMenu.style.visibility = isOpen ? 'visible' : 'hidden';
    }
}

if (hamburger) hamburger.addEventListener('click', () => toggleMenu());
if (closeMenu) closeMenu.addEventListener('click', () => toggleMenu(false));

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
        toggleMenu(false);
    }
});

// ===========================
// 4. COUNTDOWN TIMER
// ===========================
function updateCountdown() {
    const target = new Date("2026-04-03T09:00:00+05:30").getTime();

    countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const diff = target - now;

        if (diff < 0) {
            clearInterval(countdownTimer);
            document.getElementById('d').innerText = '00';
            document.getElementById('h').innerText = '00';
            document.getElementById('m').innerText = '00';
            document.getElementById('s').innerText = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('d').innerText = String(days).padStart(2, '0');
        document.getElementById('h').innerText = String(hours).padStart(2, '0');
        document.getElementById('m').innerText = String(minutes).padStart(2, '0');
        document.getElementById('s').innerText = String(seconds).padStart(2, '0');
    }, 1000);
}

updateCountdown();

// ===========================
// 5. GSAP SCROLL REVEAL
// ===========================
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach(elem => {
        gsap.from(elem, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                once: true
            }
        });
    });
}

// ===========================
// 6. VANILLA TILT
// ===========================
if (typeof VanillaTilt !== 'undefined') {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(element => {
        VanillaTilt.init(element, {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.5,
        });
    });
}
// ===========================
// 7. FORM HANDLING (AJAX for Formspree)
// ===========================
const registrationForm = document.getElementById('registrationForm');

if (registrationForm) {
    registrationForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 1. STOP the redirect

        // 2. Get Values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const institution = document.getElementById('institution').value.trim();
        const category = document.getElementById('category').value;

        // 3. Validate
        if (!fullName || !email || !institution || !category) {
            alert('Please fill all required fields');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // 4. Send Data via AJAX
        const statusBtn = registrationForm.querySelector('.btn-submit');
        const originalText = statusBtn.innerText;
        statusBtn.innerText = "SENDING...";
        statusBtn.disabled = true;

        try {
            const response = await fetch("https://formspree.io/f/xojwpprk", {
                method: "POST",
                body: new FormData(registrationForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // SUCCESS!
                alert("Registration Successful! Welcome to the Expedition.");
                registrationForm.reset();
            } else {
                // ERROR from Server
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert("Oops! There was a problem submitting your form");
                }
            }
        } catch (error) {
            // NETWORK ERROR
            alert("Network error. Please try again.");
        } finally {
            // Reset Button
            statusBtn.innerText = originalText;
            statusBtn.disabled = false;
        }
    });
}

// ===========================
// 8. NEWSLETTER SUBSCRIPTION (Updated for EmailJS)
// ===========================
async function handleNewsletterSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const emailInput = form.querySelector('.news-input');
    const btn = form.querySelector('.news-btn');
    const originalIcon = btn.innerHTML; // Store the arrow icon

    // 1. Validation
    const email = emailInput.value.trim();
    if (!email) return;

    // 2. UI Loading State (Professional Touch)
    // Disable button and show spinner to prevent double-submit
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    // 3. EmailJS Service Parameters
    const serviceID = 'service_3rh241b';
    const templateID = 'template_djrpfme';

    try {
        // Send the form directly using the form element
        await emailjs.sendForm(serviceID, templateID, form);

        // 4. Success Feedback
        alert('Welcome to the Expedition! Please check your inbox for confirmation.');
        form.reset();

    } catch (error) {
        console.error('Newsletter Error:', error);
        alert('Transmission failed. Please check your connection and try again.');
    } finally {
        // 5. Reset UI State
        btn.disabled = false;
        btn.innerHTML = originalIcon;
    }
}

// Make sure it is globally available since you use onsubmit in HTML
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ===========================
// 9. SMOOTH SCROLL BEHAVIOR
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// 10. ERROR LOGGING
// ===========================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
