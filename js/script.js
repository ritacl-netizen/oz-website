// ═══════════════════════════════════════════
// OZ — Broadway-style site JS
// ═══════════════════════════════════════════

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const newsletterForm = document.getElementById('newsletter-form'); // may be null

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

// Animate section title dividers on scroll
document.querySelectorAll('.section-title').forEach(el => observer.observe(el));

// Forms → Google Apps Script proxy → Notion
const FORMS_PROXY = 'https://script.google.com/macros/s/AKfycbyKtW3wO7OegF8G16XmT6x_nSG8RwkIu2t7uRwVlnG4M7xY_ukXGBHnYwfXOEKtJ8Jt/exec';

// Honeypot check — bots fill hidden fields
function isBot(form) {
    const hp = form.querySelector('[name="website"]');
    return hp && hp.value.length > 0;
}

// Newsletter form
if (newsletterForm) {
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
}

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

// Floating particles — reusable
function addParticles(container, count) {
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w, h;
    function resize() { w = canvas.width = container.offsetWidth; h = canvas.height = container.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['rgba(212,175,55,', 'rgba(80,200,120,', 'rgba(255,255,255,'];
    const particles = Array.from({length: count}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -Math.random() * 0.4 - 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.002 + 0.001
    }));

    function draw() {
        ctx.clearRect(0, 0, w, h);
        const t = Date.now();
        particles.forEach(p => {
            const alpha = 0.3 + Math.sin(t * p.speed + p.phase) * 0.3;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + alpha + ')';
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
            if (p.x < -10 || p.x > w + 10) p.x = Math.random() * w;
        });
        requestAnimationFrame(draw);
    }
    draw();
}
addParticles(document.querySelector('.hero'), 35);
addParticles(document.querySelector('.functions'), 20);

// Trailer — sound toggle + view tracking
(function() {
    const video = document.querySelector('.trailer-video');
    const btn = document.querySelector('.trailer-sound');
    if (!video || !btn) return;
    const icon = btn.querySelector('i');
    let unmuted = false;

    btn.addEventListener('click', function() {
        video.muted = !video.muted;
        unmuted = !video.muted;
        icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        btn.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar');
        if (unmuted && typeof gtag === 'function') {
            gtag('event', 'trailer_unmute', { location: 'trailer_section' });
        }
    });

    // Track when trailer is scrolled into view (viewed)
    let tracked = false;
    const obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !tracked) {
                tracked = true;
                if (typeof gtag === 'function') {
                    gtag('event', 'view_trailer', { location: 'trailer_section' });
                }
            }
        });
    }, { threshold: 0.5 });
    obs.observe(video);
})();

// Filmstrip infinite scroll with touch drag + randomized order
(function() {
    const filmstrip = document.querySelector('.filmstrip');
    const track = document.querySelector('.filmstrip-track');
    if (!track || !filmstrip) return;

    // Build randomized photo list
    const photos = filmstrip.dataset.castPhotos.split(',');
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    const order = shuffle(photos);
    // Duplicate for seamless loop
    const all = order.concat(order);
    track.innerHTML = all.map(p => `<img src="images/${p}.jpg" alt="Elenco Oz">`).join('');

    let pos = 0;
    const baseSpeed = 0.25;
    let dragging = false;
    let startX = 0;
    let dragOffset = 0;

    filmstrip.addEventListener('touchstart', function(e) {
        dragging = true;
        startX = e.touches[0].clientX;
        dragOffset = 0;
    }, { passive: true });

    filmstrip.addEventListener('touchmove', function(e) {
        if (!dragging) return;
        dragOffset = startX - e.touches[0].clientX;
        startX = e.touches[0].clientX;
        pos += dragOffset;
    }, { passive: true });

    filmstrip.addEventListener('touchend', function() {
        dragging = false;
    });

    function scroll() {
        if (!dragging) pos += baseSpeed;
        var half = track.scrollWidth / 2;
        if (pos >= half) pos -= half;
        if (pos < 0) pos += half;
        track.style.transform = 'translateX(-' + pos + 'px)';
        requestAnimationFrame(scroll);
    }
    requestAnimationFrame(scroll);
})();

console.log('🎭 Oz, el Secreto de la Ciudad Esmeralda — loaded');
