// ═══════════════════════════════════════════
// OZ — Broadway-style site JS
// ═══════════════════════════════════════════

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const newsletterForm = document.getElementById('newsletter-form');

// Mobile nav
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
});

// Smooth scroll for all internal links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
});

// Intersection Observer — fade in
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.discover-card, .award-quote, .story-header, .story-text, .story-image, .highlight-item, ' +
    '.newsletter-box, .function-card, .team-member, .producer-box, .contact-item, .contact-form-wrap'
).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Forms → Google Apps Script proxy → Notion
const FORMS_PROXY = 'https://script.google.com/macros/s/AKfycbyKtW3wO7OegF8G16XmT6x_nSG8RwkIu2t7uRwVlnG4M7xY_ukXGBHnYwfXOEKtJ8Jt/exec';

// Honeypot check — bots fill hidden fields
function isBot(form) {
    const hp = form.querySelector('[name="website"]');
    return hp && hp.value.length > 0;
}

// Newsletter form
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isBot(newsletterForm)) return;
    const email = newsletterForm.querySelector('input[type="email"]').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Por favor ingresá un email válido', 'error');
        return;
    }
    const btn = newsletterForm.querySelector('button');
    btn.textContent = 'Suscribiendo...';
    btn.disabled = true;
    
    fetch(FORMS_PROXY, {
        method: 'POST',
        body: JSON.stringify({ type: 'newsletter', email })
    }).then(r => {
        if (!r.ok) throw new Error('fail');
        showNotification('¡Gracias! Te avisaremos cuando salgan las entradas.', 'success');
        newsletterForm.reset();
    }).catch(() => {
        showNotification('Hubo un error. Intentá de nuevo.', 'error');
    }).finally(() => {
        btn.textContent = 'Suscribirme';
        btn.disabled = false;
    });
});

// Notification
function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">&times;</button>`;
    
    document.body.appendChild(n);
    requestAnimationFrame(() => requestAnimationFrame(() => n.classList.add('show')));
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 4500);
}

// Page load
window.addEventListener('load', () => document.body.classList.add('loaded'));

// ESC closes mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Steampunk side elements — scroll-driven enter/exit
const steamEls = document.querySelectorAll('.steam-el');
function updateSteamElements() {
    const scrollY = window.scrollY;
    const viewH = window.innerHeight;
    steamEls.forEach(el => {
        const showAt = parseInt(el.dataset.scrollShow) || 0;
        // Element is visible when scroll is within a range around its position
        const inRange = scrollY > showAt - viewH * 0.6 && scrollY < showAt + viewH * 0.8;
        el.classList.toggle('visible', inRange);
        // Position vertically relative to scroll
        const yPos = showAt - scrollY + viewH * 0.3;
        el.style.top = yPos + 'px';
    });
}
window.addEventListener('scroll', updateSteamElements, { passive: true });
updateSteamElements();

console.log('🎭 Oz, el Secreto de la Ciudad Esmeralda — loaded');
