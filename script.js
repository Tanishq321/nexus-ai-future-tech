/* ============================================================
   NEXUS AI — script.js
   ============================================================ */

'use strict';

/* ─── PAGE LOADER ────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 1800);
  });
})();

/* ─── STARFIELD CANVAS ───────────────────────────────────── */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [];
  const STAR_COUNT = 200;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createStar() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.5 + 0.3,
      vx:   (Math.random() - 0.5) * 0.12,
      vy:   (Math.random() - 0.5) * 0.12,
      alpha: Math.random() * 0.6 + 0.2,
      dalpha: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
    };
  }

  function initStars() {
    stars = Array.from({ length: STAR_COUNT }, createStar);
  }

  // Shooting star
  let shooters = [];
  function spawnShooter() {
    shooters.push({
      x:  Math.random() * W,
      y:  Math.random() * H * 0.5,
      vx: 4 + Math.random() * 4,
      vy: 2 + Math.random() * 2,
      len: 80 + Math.random() * 80,
      alpha: 1,
    });
  }
  setInterval(spawnShooter, 4000);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw static stars
    stars.forEach(s => {
      s.x += s.vx; s.y += s.vy;
      s.alpha += s.dalpha;
      if (s.alpha <= 0.1 || s.alpha >= 0.9) s.dalpha *= -1;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.alpha})`;
      ctx.fill();
    });

    // Draw shooters
    shooters = shooters.filter(s => s.alpha > 0.02);
    shooters.forEach(s => {
      s.x += s.vx; s.y += s.vy;
      s.alpha -= 0.018;
      const grad = ctx.createLinearGradient(s.x - s.vx * s.len / s.vx, s.y - s.vy * s.len / s.vx, s.x, s.y);
      grad.addColorStop(0, `rgba(0,229,255,0)`);
      grad.addColorStop(1, `rgba(0,229,255,${s.alpha})`);
      ctx.beginPath();
      ctx.moveTo(s.x - s.vx * 15, s.y - s.vy * 15);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  resize();
  initStars();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); initStars(); }, 200);
  });
})();

/* ─── TYPING ANIMATION ───────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const words = [
    'Artificial Intelligence',
    'Machine Learning',
    'Smart Robotics',
    'Future Technologies',
    'Intelligent Automation',
    'Predictive Analytics',
  ];

  let wordIdx = 0, charIdx = 0, deleting = false;
  const DELAY_WRITE = 70, DELAY_DELETE = 40, DELAY_PAUSE = 2000;

  function type() {
    const word = words[wordIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(type, DELAY_PAUSE);
        return;
      }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? DELAY_DELETE : DELAY_WRITE);
  }

  type();
})();

/* ─── NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  // Scroll shrink
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link highlighting on scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  const links    = document.querySelectorAll('.nav-link[data-section]');

  function updateActive() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        const id = section.getAttribute('id');
        links.forEach(l => {
          l.classList.toggle('active', l.dataset.section === id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('navbar').offsetHeight + 8;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ─── BACK TO TOP ────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('revealed'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ─── ANIMATED COUNTERS ──────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  function easeOutQuad(t) { return t * (2 - t); }

  function animateCounter(el) {
    const target  = parseInt(el.dataset.count);
    const suffix  = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutQuad(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ─── TESTIMONIALS CAROUSEL ──────────────────────────────── */
(function initTestimonials() {
  const track   = document.getElementById('testiTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');
  if (!track) return;

  const cards  = track.querySelectorAll('.testi-card');
  const total  = cards.length;
  let current  = 0;
  let autoPlay;

  // Build dots
  cards.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className  = 'testi-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function startAuto() {
    stopAuto();
    autoPlay = setInterval(() => goTo(current + 1), 5500);
  }
  function stopAuto() { clearInterval(autoPlay); }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  track.parentElement.addEventListener('mouseenter', stopAuto);
  track.parentElement.addEventListener('mouseleave', startAuto);

  // Touch / swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
  }, { passive: true });

  startAuto();
})();

/* ─── CONTACT FORM VALIDATION ────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  if (!form) return;

  function setError(inputId, errorId, msg) {
    const inp = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (!inp || !err) return;
    err.textContent = msg;
    inp.classList.toggle('error', !!msg);
  }

  function clearErrors() {
    ['nameError', 'emailError', 'messageError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    ['inputName', 'inputEmail', 'inputMessage'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });
  }

  function validate() {
    clearErrors();
    let valid = true;

    const name    = document.getElementById('inputName');
    const email   = document.getElementById('inputEmail');
    const message = document.getElementById('inputMessage');

    if (!name.value.trim()) {
      setError('inputName', 'nameError', 'Please enter your full name.');
      valid = false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      setError('inputEmail', 'emailError', 'Please enter your email address.');
      valid = false;
    } else if (!emailRe.test(email.value.trim())) {
      setError('inputEmail', 'emailError', 'Please enter a valid email address.');
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      setError('inputMessage', 'messageError', 'Message must be at least 10 characters.');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      clearErrors();
      successBox.removeAttribute('hidden');
      btn.textContent = 'Send Message';
      btn.disabled = false;
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => successBox.setAttribute('hidden', ''), 8000);
    }, 1200);
  });
})();

/* ─── DEMO MODAL ─────────────────────────────────────────── */
function openDemoModal() {
  const modal = document.getElementById('demoModal');
  if (!modal) return;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}

function closeDemoModal() {
  const modal = document.getElementById('demoModal');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

// ESC to close modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDemoModal();
});

/* ─── SOLUTION CARD TILT (subtle on desktop) ─────────────── */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.sol-card, .proj-card, .rob-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── TIMELINE PROGRESS HIGHLIGHT ───────────────────────── */
(function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.tl-content').style.borderColor = 'rgba(0,229,255,0.35)';
      }
    });
  }, { threshold: 0.5 });

  items.forEach(item => observer.observe(item));
})();

/* ─── GLOW FOLLOW (hero area only) ──────────────────────── */
(function initGlowFollow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth)  * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });
})();

/* ─── ENHANCEMENT 2: DARK/LIGHT THEME TOGGLE ─────────────── */
(function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  // Persist preference
  const saved = localStorage.getItem('nexus-theme');
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    btn.textContent = '☀️';
  }

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    btn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('nexus-theme', isLight ? 'light' : 'dark');
    showToast('Theme', isLight ? '☀️ Light mode activated' : '🌙 Dark mode activated');
  });
})();

/* ─── ENHANCEMENT 3: ANIMATED SKILL / PROGRESS BARS ─────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.dataset.width + '%';
        // Small delay so user sees the animation
        setTimeout(() => {
          target.style.width = width;
          target.classList.add('animated');
        }, 200);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ─── ENHANCEMENT 4: TOAST NOTIFICATION SYSTEM ───────────── */
function showToast(title, message, duration) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">✦</span>
    <div class="toast-msg">
      <strong>${title}</strong>
      ${message}
    </div>
  `;
  container.appendChild(toast);

  const ms = duration || 3500;
  setTimeout(() => {
    toast.classList.add('fadeout');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, ms);
}

// Show welcome toast after page loads
window.addEventListener('load', () => {
  setTimeout(() => showToast('Welcome', 'Exploring Nexus AI Platform', 4000), 2200);
});

// Show toast on section enter for key sections
(function initSectionToasts() {
  const toastMap = {
    solutions:    { title: 'AI Solutions',   msg: 'Discover our 6 core platforms' },
    robotics:     { title: 'Robotics',        msg: 'Physical intelligence at scale' },
    projects:     { title: 'Projects',        msg: '4 deployed flagship systems' },
    stats:        { title: 'Statistics',      msg: 'Real results, real impact' },
  };
  const shown = new Set();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !shown.has(entry.target.id)) {
        const info = toastMap[entry.target.id];
        if (info) { showToast(info.title, info.msg); shown.add(entry.target.id); }
      }
    });
  }, { threshold: 0.3 });

  Object.keys(toastMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();

/* ─── ENHANCEMENT 1 (JS part): DYNAMIC DOM MANIPULATION ──── */
/* Adds a real-time "live" indicator to the hero that updates  */
(function initLiveIndicator() {
  // Inject live data chip into hero dynamically (DOM manipulation)
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  const liveBar = document.createElement('div');
  liveBar.className = 'live-indicator';
  liveBar.setAttribute('aria-live', 'polite');
  liveBar.innerHTML = `
    <span class="live-dot" aria-hidden="true"></span>
    <span class="live-label">LIVE:</span>
    <span class="live-value" id="liveValue">Loading system status…</span>
  `;
  heroContent.insertBefore(liveBar, heroContent.querySelector('.hero-headline'));

  // Simulated live status cycling
  const statuses = [
    '2.4B data events processed today',
    '142 active AI deployments online',
    '98.3% average model accuracy',
    '6 continents — 120+ enterprise clients',
    'System health: ALL SYSTEMS NOMINAL',
  ];
  let idx = 0;
  const liveValue = document.getElementById('liveValue');

  function updateStatus() {
    if (!liveValue) return;
    liveValue.style.opacity = '0';
    setTimeout(() => {
      liveValue.textContent = statuses[idx];
      liveValue.style.opacity = '1';
      idx = (idx + 1) % statuses.length;
    }, 300);
  }

  // Add CSS inline (this is JS-driven DOM styling, not inline HTML attribute)
  const style = document.createElement('style');
  style.textContent = `
    .live-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(0,229,255,0.06);
      border: 1px solid rgba(0,229,255,0.2);
      border-radius: 50px;
      padding: 0.35rem 1rem;
      font-family: var(--font-heading);
      font-size: 0.62rem;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 1.2rem;
    }
    .live-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #00FFAE;
      box-shadow: 0 0 8px #00FFAE;
      animation: dotPulse 1.5s ease-in-out infinite;
      flex-shrink: 0;
    }
    .live-label {
      color: #00FFAE;
      font-weight: 700;
    }
    .live-value {
      color: var(--text-primary);
      transition: opacity 0.3s ease;
    }
  `;
  document.head.appendChild(style);

  updateStatus();
  setInterval(updateStatus, 3500);
})();

