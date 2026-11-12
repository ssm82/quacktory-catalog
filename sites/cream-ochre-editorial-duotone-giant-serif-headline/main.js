// file: main.js

const PRODUCTS = {
  micro: {
    eyebrow: '02.A · the smallest',
    title: 'Micro',
    lede: 'Keychain, merch, impulse gift up to $7. Injection molding, 8 cavities, ~45 seconds per cycle. In a pocket, on a keychain, in frame.',
    size: '4–8 cm',
    compare: 'like a thumb',
    audience: 'retail · merch · gift',
    time: '3 weeks',
    price: 'from $4',
    img: './assets/product-micro.jpg',
    accent: '#F5D93A'
  },
  classic: {
    eyebrow: '01 · Classic line',
    title: 'Classic',
    lede: "Kids' assortment, bath, office. Stable geometry, food-grade silicone, free of phthalates and bisphenol A.",
    size: '10–25 cm',
    compare: 'like a palm',
    audience: 'kids · office · bath',
    time: '3 weeks',
    price: 'from $9',
    img: './assets/product-classic.jpg',
    accent: '#E0BE8B'
  },
  designer: {
    eyebrow: '01 · Designer line',
    title: 'Designer',
    lede: 'Collabs with illustrators, artist approval, limited ≤300 pcs. Natural rubber, EPDM vulcanization.',
    size: '15–30 cm',
    compare: 'like a cat',
    audience: 'collabs · limited · window display',
    time: '6 weeks',
    price: 'from $32',
    img: './assets/product-designer.jpg',
    accent: '#B9A8DC'
  },
  mega: {
    eyebrow: '01 · Mega line',
    title: 'Mega',
    lede: 'Window displays, installations, photo objects. Single-piece cast without seams, internal steel frame for large formats.',
    size: '50–120 cm',
    compare: 'like a child',
    audience: 'window display · installation · photo',
    time: '6 weeks',
    price: 'from $200',
    img: './assets/product-mega.jpg',
    accent: '#7A9559'
  },
  architect: {
    eyebrow: '02.B · the largest',
    title: 'Architect',
    lede: 'Installation 1.5–3 m. Sculptural cast, master model with CNC milling, steel frame with stiffening ribs. Mounted by a certified crew.',
    size: '1.5–3 m',
    compare: 'like a bear',
    audience: 'lobbies · installations · B2B',
    time: '12 weeks',
    price: 'price on request',
    img: './assets/product-architect.jpg',
    accent: '#1C1A1A'
  }
};

const modal       = document.getElementById('modal');
const modalPanel  = modal?.querySelector('.modal__panel');
const modalImg    = document.getElementById('modal-img');
const eyebrowEl   = document.getElementById('modal-eyebrow');
const titleEl     = document.getElementById('modal-title');
const ledeEl      = document.getElementById('modal-lede');
const sizeEl      = document.getElementById('modal-size');
const compareEl   = document.getElementById('modal-compare');
const audienceEl  = document.getElementById('modal-audience');
const timeEl      = document.getElementById('modal-time');
const priceEl     = document.getElementById('modal-price');

let lastFocus = null;
let closeTimer = null;

function fillModal(sku) {
  const p = PRODUCTS[sku];
  if (!p) return false;
  modalImg.src = p.img;
  modalImg.alt = p.title;
  eyebrowEl.textContent  = p.eyebrow;
  titleEl.textContent    = p.title;
  ledeEl.textContent     = p.lede;
  sizeEl.textContent     = p.size;
  compareEl.textContent  = p.compare;
  audienceEl.textContent = p.audience;
  timeEl.textContent     = p.time;
  priceEl.textContent    = p.price;
  if (modalPanel) modalPanel.style.setProperty('--modal-accent', p.accent);
  return true;
}

function fillMenuModal() {
  modalImg.removeAttribute('src');
  modalImg.alt = '';
  eyebrowEl.textContent  = 'navigation';
  titleEl.textContent    = 'Main menu';
  ledeEl.textContent     = 'Catalog · Brand story · Contacts · Wholesale. Full navigation will appear in the final version of the site.';
  sizeEl.textContent     = '5 sections';
  compareEl.textContent  = 'soon';
  audienceEl.textContent = 'all visitors';
  timeEl.textContent     = '—';
  priceEl.textContent    = '—';
  if (modalPanel) modalPanel.style.setProperty('--modal-accent', '#F5D93A');
}

function openModal(sku) {
  if (!modal) return;
  if (sku === '__menu__') {
    fillMenuModal();
  } else if (!fillModal(sku)) {
    return;
  }
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modal.classList.add('is-open'));
  const closeBtn = modal.querySelector('.modal__close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeModal() {
  if (!modal || modal.hidden) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => { modal.hidden = true; }, 240);
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

// Delegated clicks: openers, closers, topbar menu, icon pulses
document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-modal-open]');
  if (opener) {
    e.preventDefault();
    const sku = opener.getAttribute('data-sku') || 'micro';
    openModal(sku);
    if (opener.classList.contains('scale__step')) {
      document.querySelectorAll('.scale__step').forEach(s => s.classList.remove('is-active'));
      opener.classList.add('is-active');
    }
    if (opener.classList.contains('plus')) {
      opener.classList.add('is-pressed');
      setTimeout(() => opener.classList.remove('is-pressed'), 320);
    }
    return;
  }

  const menuBtn = e.target.closest('.icon-btn--menu');
  if (menuBtn) {
    e.preventDefault();
    openModal('__menu__');
    return;
  }

  const anyIcon = e.target.closest('.icon-btn');
  if (anyIcon) {
    anyIcon.classList.add('is-pulsed');
    setTimeout(() => anyIcon.classList.remove('is-pulsed'), 420);
  }

  if (e.target.closest('[data-modal-close]')) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const tgt = document.querySelector(id);
    if (tgt) {
      e.preventDefault();
      tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Image strip · drag-to-scroll + vertical-wheel-to-horizontal
const strip = document.querySelector('.strip__track');
if (strip) {
  let isDown = false, startX = 0, scrollLeft = 0;
  strip.addEventListener('mousedown', (e) => {
    isDown = true;
    strip.classList.add('is-dragging');
    startX = e.pageX - strip.offsetLeft;
    scrollLeft = strip.scrollLeft;
  });
  ['mouseleave', 'mouseup'].forEach((ev) =>
    strip.addEventListener(ev, () => {
      isDown = false;
      strip.classList.remove('is-dragging');
    })
  );
  strip.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - strip.offsetLeft;
    strip.scrollLeft = scrollLeft - (x - startX) * 1.2;
  });
  strip.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        strip.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    },
    { passive: false }
  );
}

// Scroll-triggered fade reveals
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document
  .querySelectorAll('.scale__step, .diptych, .b2b__card, .how__step, .strip__tile')
  .forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
