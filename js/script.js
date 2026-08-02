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

// Filmstrip — carrusel infinito con ventana deslizante, arrastre con inercia y lightbox.
// Solo mantiene en el DOM las fotos visibles (+ un margen), asi la cantidad total de
// fotos no afecta ni la memoria ni los datos que descarga el visitante.
(function() {
    const filmstrip = document.querySelector('.filmstrip');
    const track = filmstrip && filmstrip.querySelector('.filmstrip-track');
    const PHOTOS = window.CAST_PHOTOS || [];
    if (!filmstrip || !track || !PHOTOS.length) return;

    const GAP = 24;             // debe coincidir con el gap del CSS
    const BUFFER = 600;         // px de fotos precargadas fuera de pantalla a cada lado
    const BASE_SPEED = 0.25;    // px por frame del desplazamiento automatico
    const FRICTION = 0.94;      // cuanto frena la inercia tras soltar
    const TAP_SLOP = 8;         // px de movimiento que todavia cuentan como click

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Mazo barajado: se reparte de a una foto y se vuelve a barajar al agotarse,
    // asi nunca se repite una foto antes de haber pasado todas.
    let deck = [];
    function draw() {
        if (!deck.length) deck = shuffle(PHOTOS);
        return deck.pop();
    }

    let items = [];   // fotos vivas en el DOM, de izquierda a derecha
    let origin = 0;   // coordenada virtual del borde izquierdo de items[0]
    let pos = 0;      // cuanto se desplazo el carrusel, en coordenadas virtuales
    let momentum = 0;
    let paused = false;

    function makeItem(photo) {
        const img = document.createElement('img');
        img.src = 'images/' + photo.n + '.jpg';
        img.alt = 'Elenco de Oz, el Secreto de la Ciudad Esmeralda';
        img.width = photo.w;      // reserva el espacio antes de que cargue
        img.height = photo.h;
        img.draggable = false;
        img.dataset.photo = photo.n;
        return { el: img, photo: photo, w: 0 };
    }

    function measure(item) {
        // Los atributos width/height reservan la proporcion, asi que el ancho ya
        // es correcto apenas se inserta, sin esperar a que baje la imagen.
        item.w = item.el.getBoundingClientRect().width;
        return item;
    }

    function totalWidth() {
        return items.reduce((sum, it) => sum + it.w + GAP, 0);
    }

    function fill() {
        const viewport = filmstrip.clientWidth;
        // Agrega por la derecha hasta cubrir pantalla + margen
        let guard = 0;
        while (origin + totalWidth() < pos + viewport + BUFFER && guard++ < 50) {
            const item = makeItem(draw());
            track.appendChild(item.el);
            items.push(measure(item));
        }
        // Agrega por la izquierda si el visitante arrastro hacia atras
        guard = 0;
        while (origin > pos - BUFFER && guard++ < 50) {
            const item = makeItem(draw());
            track.insertBefore(item.el, track.firstChild);
            items.unshift(measure(item));
            origin -= item.w + GAP;
        }
    }

    function recycle() {
        // Descarta las que ya salieron por la izquierda
        while (items.length > 2 && origin + items[0].w + GAP <= pos - BUFFER) {
            origin += items[0].w + GAP;
            items.shift().el.remove();
        }
        // Descarta las que quedaron muy lejos por la derecha
        const viewport = filmstrip.clientWidth;
        while (items.length > 2 && origin + totalWidth() - (items[items.length - 1].w + GAP) > pos + viewport + BUFFER) {
            items.pop().el.remove();
        }
    }

    function render() {
        track.style.transform = 'translate3d(' + -(pos - origin) + 'px,0,0)';
    }

    function frame() {
        if (!dragging) {
            // La pausa frena el avance automatico, pero deja que la inercia
            // del ultimo arrastre termine de deslizarse suavemente.
            const auto = (paused || reduceMotion) ? 0 : BASE_SPEED;
            pos += auto + momentum;
            momentum *= FRICTION;
            if (Math.abs(momentum) < 0.05) momentum = 0;
        }
        fill();
        recycle();
        render();
        requestAnimationFrame(frame);
    }

    // ── Arrastre con mouse y dedo ───────────────────────────────────────────
    let dragging = false;
    let lastX = 0;
    let travelled = 0;
    let lastMoveTime = 0;
    let pressed = null;   // capturar el puntero re-dirige el pointerup al contenedor,
                          // asi que guardamos aca la foto donde empezo el gesto

    filmstrip.addEventListener('pointerdown', function(e) {
        if (e.button !== undefined && e.button !== 0) return;
        dragging = true;
        travelled = 0;
        momentum = 0;
        lastX = e.clientX;
        lastMoveTime = e.timeStamp;
        pressed = e.target && e.target.dataset ? e.target.dataset.photo : null;
        filmstrip.setPointerCapture(e.pointerId);
        filmstrip.classList.add('is-dragging');
    });

    filmstrip.addEventListener('pointermove', function(e) {
        if (!dragging) return;
        const dx = lastX - e.clientX;
        const dt = Math.max(1, e.timeStamp - lastMoveTime);
        pos += dx;
        travelled += Math.abs(dx);
        momentum = dx / dt * 16;   // px por frame de 16ms
        lastX = e.clientX;
        lastMoveTime = e.timeStamp;
    });

    function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        filmstrip.classList.remove('is-dragging');
        if (e && e.pointerId !== undefined && filmstrip.hasPointerCapture(e.pointerId)) {
            filmstrip.releasePointerCapture(e.pointerId);
        }
        // Si apenas se movio, fue un click: abrir la foto
        if (travelled < TAP_SLOP && pressed) openLightbox(pressed);
        pressed = null;
    }
    filmstrip.addEventListener('pointerup', endDrag);
    filmstrip.addEventListener('pointercancel', endDrag);

    // Pausa al pasar el mouse por encima, para poder hacer click comodo
    filmstrip.addEventListener('pointerenter', function(e) {
        if (e.pointerType === 'mouse') paused = true;
    });
    filmstrip.addEventListener('pointerleave', function(e) {
        if (e.pointerType === 'mouse') paused = false;
    });

    // Teclado: las fotos son navegables con Tab y se abren con Enter
    filmstrip.addEventListener('keydown', function(e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.photo) {
            e.preventDefault();
            openLightbox(e.target.dataset.photo);
        }
    });

    // ── Lightbox ────────────────────────────────────────────────────────────
    let lb = null, lbImg = null, lbOrder = [], lbIndex = 0;

    function buildLightbox() {
        lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-modal', 'true');
        lb.setAttribute('aria-label', 'Foto del elenco');
        lb.innerHTML =
            '<button class="lightbox-close" aria-label="Cerrar"><i class="fas fa-times"></i></button>' +
            '<button class="lightbox-nav lightbox-prev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>' +
            '<img class="lightbox-img" alt="Elenco de Oz, el Secreto de la Ciudad Esmeralda">' +
            '<button class="lightbox-nav lightbox-next" aria-label="Siguiente"><i class="fas fa-chevron-right"></i></button>';
        document.body.appendChild(lb);
        lbImg = lb.querySelector('.lightbox-img');

        lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lb.querySelector('.lightbox-prev').addEventListener('click', function(e) { e.stopPropagation(); step(-1); });
        lb.querySelector('.lightbox-next').addEventListener('click', function(e) { e.stopPropagation(); step(1); });
        lb.addEventListener('click', function(e) { if (e.target === lb) closeLightbox(); });

        // Deslizar el dedo para cambiar de foto
        let sx = 0, sy = 0;
        lb.addEventListener('touchstart', function(e) {
            sx = e.touches[0].clientX; sy = e.touches[0].clientY;
        }, { passive: true });
        lb.addEventListener('touchend', function(e) {
            const dx = e.changedTouches[0].clientX - sx;
            const dy = e.changedTouches[0].clientY - sy;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
        }, { passive: true });
    }

    function srcFor(photo) {
        return 'images/' + photo.n + (photo.full ? '-full' : '') + '.jpg';
    }

    function show(i) {
        lbIndex = (i + lbOrder.length) % lbOrder.length;
        const photo = lbOrder[lbIndex];
        lbImg.src = srcFor(photo);
        // Precarga las vecinas para que el cambio sea instantaneo
        [1, -1].forEach(function(d) {
            const p = lbOrder[(lbIndex + d + lbOrder.length) % lbOrder.length];
            if (p) new Image().src = srcFor(p);
        });
    }

    function step(d) { show(lbIndex + d); }

    function openLightbox(name) {
        if (!lb) buildLightbox();
        // Se navega sobre el orden completo, arrancando por la foto tocada
        lbOrder = shuffle(PHOTOS);
        const at = lbOrder.findIndex(function(p) { return p.n === name; });
        show(at >= 0 ? at : 0);
        lb.classList.add('open');
        document.body.classList.add('lightbox-open');
        paused = true;
        if (typeof gtag === 'function') gtag('event', 'open_cast_photo', { photo: name });
    }

    function closeLightbox() {
        lb.classList.remove('open');
        document.body.classList.remove('lightbox-open');
        paused = false;
    }

    document.addEventListener('keydown', function(e) {
        if (!lb || !lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowRight') step(1);
        else if (e.key === 'ArrowLeft') step(-1);
    });

    window.addEventListener('resize', function() {
        items.forEach(measure);
    });

    requestAnimationFrame(frame);
})();

console.log('🎭 Oz, el Secreto de la Ciudad Esmeralda — loaded');
