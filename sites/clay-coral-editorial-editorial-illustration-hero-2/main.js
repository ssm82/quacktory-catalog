// file: main.js
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

// ── Burger menu ──
const burger = $('.burger');
const topnav = $('.topnav');
if (burger && topnav) {
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    topnav.classList.toggle('is-open', !open);
    document.body.classList.toggle('no-scroll', !open);
  });
  $$('.topnav a').forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    topnav.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }));
}

// ── Smooth scroll fallback for in-page anchors ──
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  });
});

// ── Modal system ──
const openModals = new Set();

function openModal(modal) {
  if (!modal) return;
  modal.hidden = false;
  // force reflow so transitions run
  void modal.offsetWidth;
  modal.classList.add('is-open');
  document.body.classList.add('no-scroll');
  openModals.add(modal);
  const closeBtn = $('.modal__close', modal);
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeModal(modal) {
  if (!modal || !openModals.has(modal)) return;
  modal.classList.remove('is-open');
  setTimeout(() => {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
  }, 220);
  openModals.delete(modal);
}

function closeAllModals() {
  openModals.forEach(closeModal);
}

// Close handlers: button + overlay + ESC
$$('.modal').forEach(modal => {
  $('.modal__close', modal)?.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal);
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && openModals.size) closeAllModals();
});

// ── SKU cards → open matching modal ──
$$('.sku').forEach(card => {
  const key = card.dataset.sku;
  if (!key) return;
  const handler = () => openModal($('#modal-' + key));
  card.addEventListener('click', handler);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  });
});

// ── Hero scroll-cue → scroll to next section ──
const cue = $('.scroll-cue');
if (cue) {
  cue.style.cursor = 'pointer';
  cue.addEventListener('click', () => {
    const next = $('.scale') || $('#mission');
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ── Active timeline: highlight SKU in viewport (scale rail) ──
const rail = $('.scale__rail');
if (rail && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersited) return;
      en.target.classList.toggle('is-in-view', en.isIntersecting);
    });
  }, { threshold: 0.45 });
  $$('.sku', rail).forEach(el => obs.observe(el));
}

// ── Reveal-on-scroll for facts & commission ──
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-revealed');
        reveal.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.fact, .commission__layout > *').forEach(el => reveal.observe(el));
}

// ── Commission form: lightweight validation feedback ──
const cform = $('.commission__form');
if (cform) {
  cform.addEventListener('submit', e => {
    e.preventDefault();
    if (!cform.checkValidity()) {
      cform.reportValidity();
      return;
    }
    const btn = $('.commission__submit', cform);
    if (btn) {
      btn.classList.add('is-sent');
      btn.querySelector('span').textContent = 'Request sent ✓';
    }
    cform.reset();
  });
}
