
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

// Animate Loop
function animate() {
    requestAnimationFrame(animate);

    // Battery Saver: Don't render if tab is hidden
    if (document.hidden) return;

    // Safety Checks: Prevent crash if assets aren't loaded yet
    if (material) {
        material.opacity = 0.1 + Math.sin(Date.now() * 0.001) * 0.05;
    }

    if (earth) {
        earth.rotation.y += 0.001 + (mouseX * 0.05);
        earth.rotation.x += 0.0005 + (mouseY * 0.05);
    }

    if (particles) {
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
        mobileMenu.setAttribute('aria-hidden', !isOpen)

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

    const d = document.getElementById('d');
    if (!d) return;
    
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
// 7. POPUP AUTH SYSTEM (SECURE & PROFILE)
// ===========================

// --- CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyAaQONyUOTMdPvG_1ovVuYiJH17ta82V90",
    authDomain: "prithvi-26.firebaseapp.com",
    projectId: "prithvi-26",
    storageBucket: "prithvi-26.firebasestorage.app",
    messagingSenderId: "823596921518",
    appId: "1:823596921518:web:88af0a6faf31f4d72eb33f"
};

// Initialize Firebase only once
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}
const auth = firebase.auth();
const db = firebase.firestore();

// --- STATE MANAGEMENT ---
let currentUser = null;

// 1. Listen for Auth Changes (Auto-update Button)
// 1. Listen for Auth Changes
auth.onAuthStateChanged(async (user) => {
    const navBtn = document.getElementById('navAuthBtn');
    const mobileBtn = document.getElementById('mobileAuthBtn');

    // STRICT CHECK: User must be logged in AND Verified
    if (user && user.emailVerified) {
        // User is Logged In & Verified -> SHOW PROFILE
        currentUser = user;
        const profileIcon = '<i class="fas fa-user-circle"></i> PROFILE';
        if (navBtn) navBtn.innerHTML = profileIcon;
        if (mobileBtn) mobileBtn.innerHTML = profileIcon;
    } else {
        // User is Logged Out OR Unverified -> SHOW LOGIN
        currentUser = null;

        // If user is technically logged in but unverified, force sign out (optional but safe)
        if (user && !user.emailVerified) {
            auth.signOut();
        }

        if (navBtn) navBtn.innerHTML = 'LOGIN';
        if (mobileBtn) mobileBtn.innerHTML = 'Login';
    }
});

// --- MODAL CONTROLS ---
function handleAuthClick() {
    if (currentUser) {
        openAuthModal('profile');
    } else {
        openAuthModal('login');
    }
}

function openAuthModal(view = 'login') {
    document.getElementById('authModal').classList.add('active');
    switchView(view);
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchView(view) {
    // Hide ALL views
    ['loginView', 'registerView', 'profileView', 'forgotPassView'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // Reset forms
    document.getElementById('loginForm').reset();

    // Show requested view
    if (view === 'login') {
        document.getElementById('loginView').classList.remove('hidden');
    } else if (view === 'register') {
        document.getElementById('registerView').classList.remove('hidden');
        currentStep = 1;
        updateSteps();
    } else if (view === 'profile') {
        document.getElementById('profileView').classList.remove('hidden');
        loadUserProfile();
    } else if (view === 'forgot') {
        document.getElementById('forgotPassView').classList.remove('hidden');
    }
}

// --- REGISTRATION LOGIC (With Phone & Strict Security) ---
let currentStep = 1;

function nextStep(step) {
    const user = auth.currentUser;
    const isGoogleAuth = user && user.providerData[0].providerId === 'google.com';

    // STEP 1 CHECK: Email & Password
    if (step === 2 && !isGoogleAuth) {
        const email = document.getElementById('regEmail').value.trim();
        const pass = document.getElementById('regPass').value;

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }

        // PASSWORD SECURITY CHECK (Min 8 chars, Number, Symbol)
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passRegex.test(pass)) {
            showToast("Password Request:\n- Min 8 characters\n- At least one Uppercase (A-Z)\n- At least one Lowercase (a-z)\n- At least one Number (0-9)\n- At least one Symbol (@$!%*?&)", "error");
            return;
        }
    }

    // STEP 2 CHECK: Details & Phone
    if (step === 3) {
        const name = document.getElementById('regName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const inst = document.getElementById('regInst').value.trim();

        if (!name || !inst) {
            showToast("Please fill in your Name and Institution.", "error");
            return;
        }

        // Basic Phone Validation
        if (phone.length < 10) {
            showToast("Please enter a valid Phone Number.", "error");
            return;
        }
    }

    currentStep = step;
    updateSteps();
}

function prevStep(step) {
    currentStep = step;
    updateSteps();
}

function updateSteps() {
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    document.getElementById(`step${currentStep}`).classList.remove('hidden');
}

// --- SUBMISSION HANDLERS ---
async function submitRegistration() {
    const txn = document.getElementById('regTxn').value;
    if (!txn || txn.length < 5) { showToast("Please enter a valid Transaction ID.", "error"); return; }

    const submitBtn = document.querySelector('#step3 .btn-submit');
    submitBtn.innerText = "PROCESSING...";
    submitBtn.disabled = true;

    try {
        let user = auth.currentUser;
        const email = document.getElementById('regEmail').value;

        // If not logged in via Google, create account
        if (!user) {
            const pass = document.getElementById('regPass').value;
            const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
            user = userCredential.user;
            await user.sendEmailVerification();
        }

        // Save Data to Firestore (Includes new Phone field)
        await db.collection("registrations").doc(user.uid).set({
            fullName: document.getElementById('regName').value,
            phone: document.getElementById('regPhone').value, // SAVING PHONE NUMBER
            institution: document.getElementById('regInst').value,
            year: document.getElementById('regYear').value,
            paymentTxn: txn,
            email: user.email,
            verified: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast("Registration Complete! Welcome to Prithvi.", "success");
        closeAuthModal();

    } catch (error) {
        showToast("Registration Error: " + error.message, "error");
    } finally {
        submitBtn.innerText = "COMPLETE";
        submitBtn.disabled = false;
    }
}

// ===========================
// ADD THIS SECTION: LOGIN & AUTH HANDLERS
// ===========================

// Optimized Login Handler with Verification Check
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const btn = document.querySelector('#loginForm .btn-submit');
    const originalText = btn.innerText;

    btn.innerText = "VERIFYING...";
    btn.disabled = true;

    try {
        // 1. Attempt Sign In
        const userCredential = await auth.signInWithEmailAndPassword(email, pass);
        const user = userCredential.user;

        // 2. CRITICAL: Check Email Verification
        if (!user.emailVerified) {
            await auth.signOut(); // Kick them out immediately
            showToast("Access Denied: Please verify your email address first.\n\nCheck your inbox (and spam folder) for the verification link.", "error");

            btn.innerText = originalText;
            btn.disabled = false;
            return; // Stop execution
        }

        // 3. Success
        showToast("Login Successful! Welcome back.", "success");
        closeAuthModal();

    } catch (error) {
        console.error("Login Error:", error);

        let msg = "Login failed. Please try again.";

        // SPECIFIC ERROR MESSAGES
        if (error.code === "auth/user-not-found") {
            msg = "No account found with this email. Please register first.";
        } else if (error.code === "auth/wrong-password") {
            msg = "Incorrect credentials. Please check your password.";
        } else if (error.code === "auth/invalid-email") {
            msg = "Invalid email format.";
        } else if (error.code === "auth/too-many-requests") {
            msg = "Too many failed attempts. Try again later.";
        }

        showToast(msg, "error");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// 2. Handle Google Login
async function handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // Check if this is a new user (optional: check firestore)
        const doc = await db.collection("registrations").doc(user.uid).get();

        if (!doc.exists) {
            // If new Google user, force them to fill details
            showToast("Google Sign-In Successful! Please complete your registration details.", "success");
            switchView('register');
            nextStep(2); // Skip email/pass step
        } else {
            showToast("Welcome back, " + user.displayName, "success");
            closeAuthModal();
        }
    } catch (error) {
        showToast("Google Sign-In Error: " + error.message, "error");
    }
}

// 3. Handle Password Reset
async function handlePasswordResetSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = "CHECKING...";
    btn.disabled = true;

    try {
        // 1. Check if user exists first
        const signInMethods = await auth.fetchSignInMethodsForEmail(email);

        if (signInMethods.length === 0) {
            showToast("This email is not registered. Please create an account first.", "error");
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        // 2. If exists, send email
        await auth.sendPasswordResetEmail(email);
        showToast("Reset link sent! Check your inbox.", "success");
        switchView('login');

    } catch (error) {
        console.error("Reset Error:", error);
        showToast("Error: " + error.message, "error");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
window.handlePasswordResetSubmit = handlePasswordResetSubmit;

// EXPORT TO WINDOW (Crucial for HTML onclick to work)
window.handleLogin = handleLogin;
window.handleGoogleLogin = handleGoogleLogin;
window.resetPassword = resetPassword;

// --- VIEW CONTROLS ---
function switchProfileTab(tab) {
    const detailsTab = document.getElementById('tabDetails');
    const securityTab = document.getElementById('tabSecurity');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tab === 'details') {
        detailsTab.classList.remove('hidden');
        securityTab.classList.add('hidden');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        detailsTab.classList.add('hidden');
        securityTab.classList.remove('hidden');
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

function toggleEditMode(enable) {
    const inputs = document.querySelectorAll('#tabDetails .input-field');
    const actions = document.getElementById('editActions');
    const editBtn = document.getElementById('editProfileBtn');

    inputs.forEach(input => input.disabled = !enable);

    if (enable) {
        actions.classList.remove('hidden');
        editBtn.classList.add('hidden');
    } else {
        actions.classList.add('hidden');
        editBtn.classList.remove('hidden');
        loadUserProfile(); // Reset data if canceled
    }
}

// --- DATA LOADING ---
async function loadUserProfile() {
    if (!currentUser) return;

    try {
        const doc = await db.collection("registrations").doc(currentUser.uid).get();
        if (doc.exists) {
            const data = doc.data();

            // Text Details
            document.getElementById('profileNameDisplay').innerText = data.fullName || "Explorer";
            document.getElementById('profileEmailDisplay').innerText = currentUser.email;

            // Form Fields
            document.getElementById('profName').value = data.fullName || "";
            document.getElementById('profPhone').value = data.phone || "";
            document.getElementById('profInst').value = data.institution || "";
            document.getElementById('profYear').value = data.year || "1st";

            // --- DIGITAL ID UPDATE ---
            document.getElementById('cardName').innerText = data.fullName || "EXPLORER";
            document.getElementById('cardId').innerText = `ID: PRITHVI-${currentUser.uid.substring(0, 6).toUpperCase()}`;
        }
    } catch (error) {
        console.error("Profile Load Error:", error);
        showToast("Failed to load profile data", "error");
    }
}
// --- RE-AUTHENTICATION SYSTEM ---
let reauthResolve = null;
let reauthReject = null;

function promptReauth() {
    return new Promise((resolve, reject) => {
        const modal = document.getElementById('reauthModal');
        const passInput = document.getElementById('reauthPass');

        // Setup UI
        passInput.value = '';
        modal.classList.remove('hidden');
        modal.classList.add('active');

        // Store callbacks
        reauthResolve = resolve;
        reauthReject = reject;
    });
}

function cancelReauth() {
    document.getElementById('reauthModal').classList.remove('active');
    document.getElementById('reauthModal').classList.add('hidden');
    if (reauthReject) reauthReject(new Error("Cancelled by user"));
}

async function confirmReauth() {
    const pass = document.getElementById('reauthPass').value;
    const modal = document.getElementById('reauthModal');

    if (!pass) {
        showToast("Please enter your password.", "error");
        return;
    }

    try {
        // 1. Check Auth Provider
        const providerId = currentUser.providerData[0].providerId;

        if (providerId === 'password') {
            // Email/Password Re-auth
            const cred = firebase.auth.EmailAuthProvider.credential(currentUser.email, pass);
            await currentUser.reauthenticateWithCredential(cred);
        } else if (providerId === 'google.com') {
            // Google Re-auth (Trigger Popup)
            const provider = new firebase.auth.GoogleAuthProvider();
            await currentUser.reauthenticateWithPopup(provider);
        }

        // 2. Success - Close Modal & Resolve Promise
        modal.classList.remove('active');
        modal.classList.add('hidden');
        if (reauthResolve) reauthResolve(true);

    } catch (error) {
        console.error(error);
        showToast("Verification Failed: " + "Invalid Password or Google Sign-In failed.", "error");
        // Do not reject immediately, let them try again
    }
}

// --- SECURE UPDATE ACTIONS ---

async function updateUserProfile(e) {
    e.preventDefault();
    if (!currentUser) return;

    // 1. Trigger Security Check
    try {
        await promptReauth(); // Waits here until user enters correct password
    } catch (error) {
        return; // Stop if cancelled
    }

    // 2. If Verified, Proceed to Save
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "SAVING...";
    btn.disabled = true;

    try {
        await db.collection("registrations").doc(currentUser.uid).update({
            fullName: document.getElementById('profName').value,
            phone: document.getElementById('profPhone').value,
            institution: document.getElementById('profInst').value,
            year: document.getElementById('profYear').value
        });

        showToast("Security Verified. Profile Updated Successfully!", "success");
        document.getElementById('profileNameDisplay').innerText = document.getElementById('profName').value;
        toggleEditMode(false); // Lock inputs again

    } catch (error) {
        showToast("Update failed: " + error.message, "error");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

async function changeUserPassword(e) {
    e.preventDefault();

    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    if (newPass.length < 8) {
        showToast("New password must be at least 8 characters.", "error");
        return;
    }
    if (newPass !== confirmPass) {
        showToast("Passwords do not match.", "error");
        return;
    }

    // 1. Trigger Security Check
    try {
        await promptReauth(); // Waits here for current password
    } catch (error) {
        return;
    }

    // 2. If Verified, Update Password
    try {
        await currentUser.updatePassword(newPass);
        showToast("Security Verified. Password Changed Successfully! Please login again.", "success");
        handleLogout();
    } catch (error) {
        showToast("Error: " + error.message, "error");
    }
}

function handleLogout() {
    auth.signOut().then(() => {
        showToast("Logged out successfully.", "success");
        closeAuthModal();
        window.location.reload();
    });
}

// Export global functions
window.switchProfileTab = switchProfileTab;
window.toggleEditMode = toggleEditMode;
window.updateUserProfile = updateUserProfile;
window.changeUserPassword = changeUserPassword;
window.handleLogout = handleLogout;
window.cancelReauth = cancelReauth;
window.confirmReauth = confirmReauth;

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
        showToast('Welcome to the Expedition! Please check your inbox for confirmation.', "success");
        form.reset();

    } catch (error) {
        console.error('Newsletter Error:', error);
        showToast('Transmission failed. Please check your connection and try again.', "error");
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


// --- TOAST NOTIFICATION SYSTEM ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');

    // Icon selection
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const colorClass = type; // 'success' or 'error' defined in CSS

    toast.className = `toast ${colorClass}`;
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}
// Export
window.showToast = showToast;
