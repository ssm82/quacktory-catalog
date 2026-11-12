// file: main.js
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ---------- Smooth scroll fallback ----------
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      const top = tgt.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- Modal system (document-native cards) ----------
  const openModals = new Map();
  let lastTrigger = null;

  function openModal(id, trigger) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    openModals.set(id, modal);
    document.body.style.overflow = 'hidden';
    lastTrigger = trigger || null;
    const close = modal.querySelector('.modal-close');
    if (close) requestAnimationFrame(() => close.focus());
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    openModals.delete(modal.id);
    if (!openModals.size) document.body.style.overflow = '';
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    lastTrigger = null;
  }

  $$('[data-open="modal"]').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      openModal(trigger.dataset.target, trigger);
    });
  });

  $$('.modal [data-close]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      closeModal(el.closest('.modal'));
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && openModals.size) {
      closeModal(Array.from(openModals.values()).pop());
    }
  });

  // ---------- Scroll rail active state on scroll ----------
  const railDots = $$('.scroll-rail-dot');
  const sections = $$('main section[id], main > section');
  if (railDots.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const id = '#' + en.target.id;
        railDots.forEach(d => d.classList.toggle('is-active', d.getAttribute('href') === id));
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => s.id && io.observe(s));
  }

  // ---------- Reveal on scroll ----------
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-revealed');
          reveal.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    $$('.scale-item, .product, .section-head').forEach(el => {
      el.classList.add('to-reveal');
      reveal.observe(el);
    });
  }

  // ---------- Scroll cue pulse on idle ----------
  const cue = $('.scroll-cue');
  if (cue) {
    let idle = 0;
    const tick = () => {
      idle = Math.min(idle + 1, 5);
      cue.style.setProperty('--cue-idle', idle / 5);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.addEventListener('scroll', () => { idle = 0; }, { passive: true });
  }
})();
