/* ── SUPABASE ── */
const SUPABASE_URL = 'https://ihqdmshidclohxgnixuo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocWRtc2hpZGNsb2h4Z25peHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODA3MjIsImV4cCI6MjA4NzI1NjcyMn0.hKqaUSHBLlOsRjNwpR-RACiTTs91QvT-25X6ZNR7QDg';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── NAVIGATION ── */
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ── THEME ── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
    updateParticleColors(next);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ── PARTICLES ── */
const canvas = document.getElementById('particles-bg');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

function getParticleColor() {
    const dark = root.getAttribute('data-theme') === 'dark';
    return dark
        ? `rgba(255,255,255,${Math.random() * 0.22 + 0.04})`
        : `rgba(15,15,15,${Math.random() * 0.10 + 0.03})`;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
        this.color = getParticleColor();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const count = Math.floor((canvas.width * canvas.height) / 9500);
    for (let i = 0; i < count; i++) particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

function updateParticleColors(theme) {
    particlesArray.forEach(p => {
        p.color = theme === 'dark'
            ? `rgba(255,255,255,${Math.random() * 0.22 + 0.04})`
            : `rgba(15,15,15,${Math.random() * 0.10 + 0.03})`;
    });
}

initParticles();
animateParticles();

/* ── TYPEWRITER ── */
const words = ['UI/UX Designer', 'Web Developer', 'Aspiring Cybersecurity Specialist', 'Student'];
const typewriterEl = document.getElementById('typewriter');
let wordIndex = 0, charIndex = 0, isDeleting = false;

function typeWriter() {
    if (!typewriterEl) return;
    const word = words[wordIndex];
    if (!isDeleting) {
        typewriterEl.textContent = word.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === word.length) {
            isDeleting = true;
            setTimeout(typeWriter, 1500);
            return;
        }
        setTimeout(typeWriter, 75);
    } else {
        typewriterEl.textContent = word.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeWriter, 400);
            return;
        }
        setTimeout(typeWriter, 38);
    }
}
setTimeout(typeWriter, 1000);

/* ── INTERSECTION OBSERVERS ── */
function createObserver(callback, options = {}) {
    return new IntersectionObserver(
        entries => entries.forEach(e => callback(e.target, e.isIntersecting)),
        { threshold: 0.1, ...options }
    );
}

// Introduction
const introContent = document.querySelector('#introduction .intro-content');
const introImage = document.querySelector('#introduction .intro-image');
const introObs = createObserver((el, visible) => el.classList.toggle('animate-active', visible));
if (introContent) introObs.observe(introContent);
if (introImage) introObs.observe(introImage);

// About Me
const homeTitle = document.querySelector('#home h1');
const homeObs = createObserver((el, visible) => el.classList.toggle('animated-in', visible));
if (homeTitle) homeObs.observe(homeTitle);
document.querySelectorAll('#home .info-card').forEach(c => homeObs.observe(c));

// Skills
const skillsTitle = document.querySelector('#about h1');
const skillsGrid = document.querySelector('#about .skills-grid');
const skillsObs = createObserver((el, visible) => el.classList.toggle('animated-in', visible));
if (skillsTitle) skillsObs.observe(skillsTitle);
if (skillsGrid) skillsObs.observe(skillsGrid);

// Skill bars
const skillBarsObs = createObserver((el, visible) => {
    if (visible) {
        const pct = el.getAttribute('data-percent');
        setTimeout(() => { el.style.width = pct + '%'; }, 80);
    } else {
        el.style.width = '0%';
    }
});
document.querySelectorAll('.skill-fill').forEach(f => skillBarsObs.observe(f));

// Projects
const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('animated-in', e.isIntersecting));
}, { threshold: 0.15 });
document.querySelectorAll('.project-card').forEach(c => cardObs.observe(c));

// Contacts
const genObs = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('animated-in', e.isIntersecting));
}, { threshold: 0.1 });
[
    document.querySelector('#contacts h1'),
    document.querySelector('.section-subtitle'),
    document.querySelector('.contacts-right'),
    document.querySelector('.github-repos-section'),
    document.querySelector('.location-badge')
].filter(Boolean).forEach(el => genObs.observe(el));
document.querySelectorAll('.contact-info-block').forEach(b => genObs.observe(b));

/* ── CAROUSEL ── */
document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const imgs = [...carousel.querySelectorAll('img')];
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');
    const dotsEl = carousel.querySelector('.carousel-dots');
    if (!imgs.length) return;
    let current = 0, timer;

    imgs.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', e => { e.stopPropagation(); go(i); });
        dotsEl.appendChild(d);
    });

    const dots = [...dotsEl.querySelectorAll('.dot')];

    function go(index) {
        imgs[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + imgs.length) % imgs.length;
        imgs[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function startAuto() { timer = setInterval(() => go(current + 1), 3000); }
    function stopAuto() { clearInterval(timer); }

    prev.addEventListener('click', e => { e.stopPropagation(); stopAuto(); go(current - 1); startAuto(); });
    next.addEventListener('click', e => { e.stopPropagation(); stopAuto(); go(current + 1); startAuto(); });
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    startAuto();
});

/* ── VIDEO ── */
const videoCard = document.querySelector('.video-card');
if (videoCard) {
    const video = videoCard.querySelector('.inline-video');
    const overlay = videoCard.querySelector('.play-overlay');
    overlay.addEventListener('click', e => {
        e.stopPropagation();
        videoCard.classList.add('playing');
        video.play();
    });
    video.addEventListener('ended', () => {
        videoCard.classList.remove('playing');
        video.currentTime = 0;
    });
}

/* ── GEOLOCATION ── */
fetch('https://ipinfo.io/json?token=df480705132df7')
    .then(r => r.json())
    .then(data => {
        const loc = [data.city, data.region, data.country].filter(Boolean).join(', ');
        document.getElementById('location-text').textContent = loc || 'Philippines';
        document.querySelector('.location-badge').classList.add('visible');
    })
    .catch(() => {
        document.getElementById('location-text').textContent = 'Camarines Norte, PH';
        document.querySelector('.location-badge').classList.add('visible');
    });

/* ── GITHUB REPOS ── */
fetch('https://api.github.com/users/Ariesss05/repos?sort=updated&per_page=6')
    .then(r => r.json())
    .then(repos => {
        const grid = document.getElementById('github-repos-grid');
        grid.innerHTML = '';
        if (!repos || !repos.length) {
            grid.innerHTML = '<p style="color:var(--text-faint)">No repos found.</p>';
            return;
        }
        repos.forEach((repo, i) => {
            const card = document.createElement('a');
            card.className = 'repo-card';
            card.href = repo.html_url;
            card.target = '_blank';
            card.rel = 'noopener';
            card.style.animationDelay = `${i * 0.08}s`;
            card.innerHTML = `
                <div class="repo-card-name"><i class="fas fa-code-branch"></i> ${repo.name}</div>
                <p class="repo-card-desc">${repo.description || 'No description provided.'}</p>
                <div class="repo-card-meta">
                    ${repo.language ? `<span class="repo-lang">${repo.language}</span>` : ''}
                    <span class="repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                </div>`;
            grid.appendChild(card);
        });
    })
    .catch(() => {
        document.getElementById('github-repos-grid').innerHTML =
            `<p style="color:var(--text-faint)">Could not load repos.
             <a href="https://github.com/Ariesss05" target="_blank"
                style="color:#c53636">View on GitHub</a></p>`;
    });

/* ── EMAILJS ── */
emailjs.init({ publicKey: 'yD86ai_MV4qKa-fEx' });

const contactForm = document.getElementById('contact-form');
const sendBtn = document.getElementById('send-btn');
const statusEl = document.getElementById('form-status');

function validateContact() {
    let valid = true;
    ['name-err', 'email-err', 'msg-err'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
    if (!document.getElementById('from_name').value.trim()) {
        document.getElementById('name-err').textContent = 'Name is required.';
        valid = false;
    }
    const email = document.getElementById('from_email').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email) {
        document.getElementById('email-err').textContent = 'Email is required.';
        valid = false;
    } else if (!emailOk) {
        document.getElementById('email-err').textContent = 'Enter a valid email address.';
        valid = false;
    }
    if (!document.getElementById('message').value.trim()) {
        document.getElementById('msg-err').textContent = 'Message cannot be empty.';
        valid = false;
    }
    return valid;
}

contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateContact()) return;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    statusEl.style.display = 'none';

    const name = document.getElementById('from_name').value.trim();
    const email = document.getElementById('from_email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Save to Supabase FIRST — independently of EmailJS
    try {
        const { error: dbError } = await db
            .from('messages')
            .insert([{ name: name, email: email, message: message }]);

        if (dbError) {
            console.error('Supabase error:', dbError.message, dbError.details);
        } else {
            console.log('✓ Saved to Supabase');
        }
    } catch (err) {
        console.error('Supabase exception:', err);
    }

    // Send email via EmailJS separately
    try {
        await emailjs.send('service_lhjxk7j', 'template_ypgvqz8', {
            from_name: name,
            from_email: email,
            message: message
        });
        statusEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
        statusEl.className = 'form-status success';
        contactForm.reset();
    } catch (err) {
        console.error('EmailJS error:', err);
        statusEl.textContent = '✗ Something went wrong. Try emailing me directly.';
        statusEl.className = 'form-status error';
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
});

/* ── PAYMENT SIMULATION ── */
const paymentForm = document.getElementById('payment-form');
const paymentReceipt = document.getElementById('payment-receipt');
const receiptDetail = document.getElementById('receipt-detail');

function validatePayment() {
    let valid = true;
    ['pay-name-err', 'pay-amount-err', 'pay-method-err'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
    if (!document.getElementById('pay-name').value.trim()) {
        document.getElementById('pay-name-err').textContent = 'Name is required.';
        valid = false;
    }
    if (!document.getElementById('pay-amount').value ||
        parseFloat(document.getElementById('pay-amount').value) <= 0) {
        document.getElementById('pay-amount-err').textContent = 'Enter a valid amount.';
        valid = false;
    }
    if (!document.getElementById('pay-method').value) {
        document.getElementById('pay-method-err').textContent = 'Please select a method.';
        valid = false;
    }
    return valid;
}

paymentForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validatePayment()) return;
    const name = document.getElementById('pay-name').value.trim();
    const amount = parseFloat(document.getElementById('pay-amount').value).toFixed(2);
    const method = document.getElementById('pay-method').value;
    const ref = 'SIM-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const payBtn = document.getElementById('pay-btn');
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing…';

    setTimeout(async () => {

        // Save to Supabase
        try {
            const { error: dbError } = await db
                .from('payments')
                .insert([{
                    name: name,
                    amount: parseFloat(amount),
                    method: method,
                    reference: ref
                }]);

            if (dbError) {
                console.error('Supabase payment error:', dbError.message, dbError.details);
            } else {
                console.log('✓ Payment saved to Supabase');
            }
        } catch (err) {
            console.error('Supabase payment exception:', err);
        }

        paymentForm.style.display = 'none';
        paymentReceipt.style.display = 'block';
        receiptDetail.innerHTML = `<strong>${name}</strong> paid <strong>₱${amount}</strong>
            via <strong>${method}</strong><br>
            Reference: <code style="color:#c53636">${ref}</code>`;
        payBtn.disabled = false;
        payBtn.innerHTML = '<i class="fas fa-coins"></i> Simulate Payment';

    }, 1800);
});

document.getElementById('pay-again-btn').addEventListener('click', () => {
    paymentReceipt.style.display = 'none';
    paymentForm.style.display = 'flex';
    paymentForm.reset();
    ['pay-name-err', 'pay-amount-err', 'pay-method-err'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
});

/* ── BURGER NAV TOGGLE ── */
const burgerBtn = document.getElementById('burger-btn');
const floatingNav = document.getElementById('floating-nav');

burgerBtn.addEventListener('click', () => {
    floatingNav.classList.toggle('nav-open');
});

/* Close nav when clicking anywhere outside it */
document.addEventListener('click', (e) => {
    if (!floatingNav.contains(e.target)) {
        floatingNav.classList.remove('nav-open');
    }
});

function closeNav() {
    floatingNav.classList.remove('nav-open');
}