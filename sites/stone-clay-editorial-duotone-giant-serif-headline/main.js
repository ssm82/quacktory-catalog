// file: main.js
// Quacktory — interactivity layer
(() => {
  'use strict';

  // ============================================================
  // Modal system
  // ============================================================
  const modals = document.querySelectorAll('.modal');

  const openModal = (sku) => {
    const target = document.querySelector(`.modal[data-modal="${sku}"]`);
    if (!target) return;
    modals.forEach(m => {
      m.setAttribute('aria-hidden', 'true');
      m.classList.remove('is-open');
    });
    target.setAttribute('aria-hidden', 'false');
    target.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const closeBtn = target.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };

  const closeModal = (modal) => {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    if (![...modals].some(m => m.classList.contains('is-open'))) {
      document.body.style.overflow = '';
    }
  };

  // ---- Duck / ladder nodes → matching modal + active state ----
  document.querySelectorAll('.duck').forEach(duck => {
    const fire = () => {
      const sku = duck.getAttribute('data-sku');
      if (!sku) return;
      document.querySelectorAll('.duck').forEach(d => d.classList.remove('is-active'));
      duck.classList.add('is-active');
      openModal(sku);
    };
    duck.addEventListener('click', fire);
    duck.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fire();
      }
    });
  });

  // ---- Central QUACK cloud → opens the largest line (architect) ----
  const cloud = document.querySelector('.ladder-cloud');
  if (cloud) {
    cloud.setAttribute('role', 'button');
    cloud.setAttribute('tabindex', '0');
    cloud.setAttribute('aria-label', 'Open Architect details');
    const fire = () => {
      document.querySelectorAll('.duck').forEach(d => d.classList.remove('is-active'));
      const architect = document.querySelector('.duck-architect');
      if (architect) architect.classList.add('is-active');
      openModal('architect');
    };
    cloud.addEventListener('click', fire);
    cloud.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fire();
      }
    });
  }

  // ---- Hero annotations → tooltip pills, open architect modal ----
  document.querySelectorAll('.hero-annotations .hand-note').forEach(note => {
    note.setAttribute('role', 'button');
    note.setAttribute('tabindex', '0');
    const fire = () => openModal('architect');
    note.addEventListener('click', fire);
    note.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fire();
      }
    });
  });

  // ---- Close: button + overlay click + Escape key ----
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal(modal);
      });
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal.is-open');
      if (open) closeModal(open);
    }
  });

  // ============================================================
  // Smooth scroll for in-page anchors
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (history.pushState) history.pushState(null, '', href);
      }
    });
  });

  // ============================================================
  // Scroll-triggered reveals
  // ============================================================
  if ('IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.duck, .how-card, .aside-list li, .b2b-card, .scale-frame').forEach(el => {
      el.classList.add('reveal');
      revealIO.observe(el);
    });
  }

  // ============================================================
  // Topnav active state on scroll
  // ============================================================
  const sections = ['ladder', 'how', 'b2b']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.topnav a');
  if ('IntersectionObserver' in window && sections.length) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l => {
            l.classList.toggle('is-current', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => navIO.observe(s));
  }

  // ============================================================
  // Wordmark → scroll to top
  // ============================================================
  const mark = document.querySelector('.wordmark');
  if (mark) {
    mark.addEventListener('click', (e) => {
      const href = mark.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (history.pushState) history.pushState(null, '', href);
      }
    });
  }

})();
