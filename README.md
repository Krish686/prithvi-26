# 🌍 PRITHVI 2026 | The Geological Zenith

> **The 18th International Earth Science Symposium at IIT Kharagpur**  
> *Unearth the Future • April 3–5, 2026*

![Prithvi 2026 Banner](assets/logos/og-image.jpg)

🔗 **Live Website:** https://krish686.github.io/prithvi-26/

---

## 📖 About the Project

**PRITHVI 2026** is the official website for the annual international geological symposium organized by the **Department of Geology & Geophysics, IIT Kharagpur**.

The website acts as a central digital hub for:
- Event information  
- Competition details  
- Registrations  
- Past symposium archives  

It features a modern **Glassmorphism-inspired UI** combined with a dual-theme experience derived from geological extremes:
- 🌑 **Seismic Night** — Dark Mode  
- ❄️ **Glacial Day** — Light Mode  

---

## ✨ Key Features

- 🌐 **3D Interactive Earth**  
  A rotating wireframe Earth built using **Three.js**, responding dynamically to mouse movements.

- 🎨 **Dual Theme System**  
  Seamless toggle between Dark and Light modes with preferences stored in Local Storage.

- 🎞️ **Advanced Animations**
  - **GSAP ScrollTrigger** for smooth scroll-based reveals  
  - **Vanilla Tilt.js** for immersive 3D hover effects  
  - **Live Countdown Timer** counting down to the event

- 📱 **Fully Responsive Design**  
  Mobile-first layout optimized for all screen sizes.

- 📝 **Registration System**  
  Integrated with **Formspree** for secure form submissions without a backend.

---

## 🛠️ Tech Stack

### Frontend
- HTML5  
- CSS3 (Custom Properties & Media Queries)  
- JavaScript (ES6+)

### Libraries & Tools
- **Three.js** — 3D graphics rendering  
- **GSAP (GreenSock)** — Advanced animations  
- **Vanilla Tilt.js** — Parallax hover effects  
- **Font Awesome 6** — Icons  
- **Google Fonts** — Michroma, Rajdhani, Syne  

### Form Handling
- **Formspree**

---

## 📂 Project Structure

```text
prithvi-26/
├── assets/
│   ├── gallery/      # Event photos and highlights
│   ├── logos/        # Favicons, banners, OG images
│   └── speakers/     # Guest speaker headshots
├── index.html        # Main landing page
├── style.css         # Global styles and responsive layout
├── script.js         # Three.js, theme toggle, countdown logic
├── 404.html          # Custom geological-themed error page
├── robots.txt        # SEO crawler directives
└── sitemap.xml       # Search engine sitemap
