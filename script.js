/* ═══════════════════════════════════════════════════════════════
   NEXUS AI – script.js
   Features: Star canvas, typing animation, scroll reveal,
   counter animation, mobile nav, dark mode, form validation,
   back-to-top, active nav highlighting
═══════════════════════════════════════════════════════════════ */

"use strict";

// ────────────────────────────────────────────────────────────────
// 1. DOM Ready
// ────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initStarCanvas();
  initTypingAnimation();
  initMobileNav();
  initScrollBehavior();
  initScrollReveal();
  initCounterAnimation();
  initFormValidation();
  initBackToTop();
  initActiveNavHighlight();
  initCurrentYear();
  initNewsletterForm();
  initCardKeyboard();
});

// ────────────────────────────────────────────────────────────────
// 2. Theme Toggle (Dark / Light)
// ────────────────────────────────────────────────────────────────
function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  // Persist preference; default to dark
  const saved = localStorage.getItem("nexus-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");

  applyTheme(theme);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("nexus-theme", next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

// ────────────────────────────────────────────────────────────────
// 3. Star Canvas (hero background)
// ────────────────────────────────────────────────────────────────
function initStarCanvas() {
  const canvas = document.getElementById("starCanvas");
  if (!canvas) return;

  // Skip if reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  let width, height, stars, mouse = { x: 0, y: 0 };
  let animFrame;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createStars();
  }

  function createStars() {
    const count = Math.floor((width * height) / 8000);
    stars = Array.from({ length: Math.min(count, 200) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.2,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.01 + 0.003,
      twinklePhase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(timestamp) {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((s) => {
      // Subtle mouse parallax
      const dx = (mouse.x / width - 0.5) * 0.4;
      const dy = (mouse.y / height - 0.5) * 0.4;

      s.x += s.vx + dx * 0.015;
      s.y += s.vy + dy * 0.015;

      // Wrap around
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      // Twinkle
      const twinkle = 0.5 + 0.5 * Math.sin(timestamp * s.twinkleSpeed + s.twinklePhase);
      const alpha = s.alpha * (0.6 + 0.4 * twinkle);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.r > 1.2 ? "180,190,255" : "140,160,220"},${alpha})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(draw);
  }

  // Resize observer
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Mouse tracking for parallax
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Start animation
  animFrame = requestAnimationFrame(draw);

  // Pause when off-screen (performance)
  const heroSection = document.getElementById("home");
  if (heroSection && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animFrame) animFrame = requestAnimationFrame(draw);
          } else {
            cancelAnimationFrame(animFrame);
            animFrame = null;
          }
        });
      },
      { threshold: 0 }
    );
    obs.observe(heroSection);
  }
}

// ────────────────────────────────────────────────────────────────
// 4. Typing Animation
// ────────────────────────────────────────────────────────────────
function initTypingAnimation() {
  const el = document.getElementById("typed-text");
  if (!el) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = "Artificial Intelligence";
    return;
  }

  const phrases = [
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Vision",
    "Generative AI",
    "Neural Networks",
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;
  const TYPE_SPEED = 80, DELETE_SPEED = 40, PAUSE = 2000;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // Start after hero headline animates in
  setTimeout(tick, 900);
}

// ────────────────────────────────────────────────────────────────
// 5. Mobile Navigation
// ────────────────────────────────────────────────────────────────
function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  if (!hamburger || !navLinks) return;

  function openMenu() {
    navLinks.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    // Trap focus within menu
    navLinks.querySelector("a")?.focus();
  }

  function closeMenu() {
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  // Close when nav link is clicked
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      closeMenu();
      hamburger.focus();
    }
  });
}

// ────────────────────────────────────────────────────────────────
// 6. Scroll Behavior (header + smooth scroll)
// ────────────────────────────────────────────────────────────────
function initScrollBehavior() {
  const header = document.getElementById("site-header");
  if (!header) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle("scrolled", window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Smooth scroll for anchor links (polyfill for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    });
  });
}

// ────────────────────────────────────────────────────────────────
// 7. Scroll Reveal (IntersectionObserver)
// ────────────────────────────────────────────────────────────────
function initScrollReveal() {
  if (!("IntersectionObserver" in window)) {
    // Fallback: show everything
    document.querySelectorAll(".reveal-fade, .reveal-up").forEach((el) => {
      el.classList.add("revealed");
    });
    return;
  }

  const reducer = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducer) {
    document.querySelectorAll(".reveal-fade, .reveal-up").forEach((el) => {
      el.classList.add("revealed");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal-fade, .reveal-up").forEach((el) => {
    observer.observe(el);
  });
}

// ────────────────────────────────────────────────────────────────
// 8. Counter Animation
// ────────────────────────────────────────────────────────────────
function initCounterAnimation() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".counter").forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      el.textContent = formatNumber(target) + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".counter").forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 2000;
  const start = performance.now();

  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = formatNumber(value) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

// ────────────────────────────────────────────────────────────────
// 9. Form Validation
// ────────────────────────────────────────────────────────────────
function initFormValidation() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("submit-btn");
  const successMsg = document.getElementById("form-success");

  // Live validation on blur
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("error")) validateField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll("[required]").forEach((field) => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      // Focus first error
      form.querySelector(".error")?.focus();
      return;
    }

    // Simulate async submit
    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-label").textContent = "Sending…";

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-label").textContent = "Send Message";
      successMsg.textContent = "✓ Message sent! We'll get back to you within one business day.";
      form.reset();
      setTimeout(() => (successMsg.textContent = ""), 6000);
    }, 1500);
  });
}

function validateField(field) {
  const errorEl = document.getElementById(field.id + "-error");
  let message = "";

  if (field.required && !field.value.trim()) {
    message = `${getLabel(field)} is required.`;
  } else if (field.type === "email" && field.value.trim()) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(field.value.trim())) {
      message = "Please enter a valid email address.";
    }
  } else if (field.tagName === "TEXTAREA" && field.value.trim().length < 10 && field.value.trim()) {
    message = "Message must be at least 10 characters.";
  }

  field.classList.toggle("error", !!message);
  if (errorEl) errorEl.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");

  return !message;
}

function getLabel(field) {
  const label = document.querySelector(`label[for="${field.id}"]`);
  if (!label) return "This field";
  // Strip the asterisk child text
  return label.childNodes[0]?.textContent?.trim() || "This field";
}

// ────────────────────────────────────────────────────────────────
// 10. Back to Top
// ────────────────────────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle("visible", window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Return focus to top of page
    setTimeout(() => document.getElementById("site-header")?.focus(), 600);
  });
}

// ────────────────────────────────────────────────────────────────
// 11. Active Nav Highlighting
// ────────────────────────────────────────────────────────────────
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    }
  );

  sections.forEach((s) => observer.observe(s));
}

// ────────────────────────────────────────────────────────────────
// 12. Current Year in Footer
// ────────────────────────────────────────────────────────────────
function initCurrentYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = new Date().getFullYear();
}

// ────────────────────────────────────────────────────────────────
// 13. Newsletter Form (simple feedback)
// ────────────────────────────────────────────────────────────────
function initNewsletterForm() {
  const form = document.querySelector(".newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='email']");
    const btn = form.querySelector("button");
    if (!input || !input.value.trim()) return;

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(input.value.trim())) {
      input.style.borderColor = "var(--color-error)";
      setTimeout(() => (input.style.borderColor = ""), 2000);
      return;
    }

    btn.textContent = "Subscribed!";
    btn.disabled = true;
    input.value = "";
    input.disabled = true;
    setTimeout(() => {
      btn.textContent = "Subscribe";
      btn.disabled = false;
      input.disabled = false;
    }, 4000);
  });
}

// ────────────────────────────────────────────────────────────────
// 14. Keyboard accessibility for interactive cards
// ────────────────────────────────────────────────────────────────
function initCardKeyboard() {
  // Cards with tabindex="0" should activate on Enter/Space
  document.querySelectorAll(
    ".solution-card[tabindex], .project-card[tabindex], .robotics-card[tabindex], .blog-card[tabindex]"
  ).forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Find primary CTA link and follow it
        const link = card.querySelector("a");
        if (link) link.click();
      }
    });
  });
}
