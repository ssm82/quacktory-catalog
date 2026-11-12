// file: main.js
// Quacktory — main.js
// Aristide-portfolio-2021 inspired interactivity

const SKU_DATA = {
  micro: {
    index: 'Lineup 01 / 05',
    name: 'MICRO',
    size: '4–8 cm · thumb-sized',
    img: './assets/product-micro.jpg',
    lead: 'Keychain, merch, impulse gift up to ~$7. A pocket duck for those who are not ready for serious relationships but want to keep something pleasant in hand.',
    accent: 'var(--glow-micro)',
    spec: [
      ['Material', 'Food-grade silicone · one piece'],
      ['Weight', '12–28 g'],
      ['Pigment', 'Solid · 12 TPM colors'],
      ['Test', 'Drop 5× from 1 m onto concrete'],
      ['Certification', 'EN 71-3 · REACH'],
      ['Lead time', '3 weeks']
    ]
  },
  classic: {
    index: 'Lineup 02 / 05',
    name: 'CLASSIC',
    size: '10–25 cm · bathroom / office',
    img: './assets/product-classic.jpg',
    lead: 'The workhorse of the lineup. A standard size at which the duck stops being a toy and becomes an object. Bathroom, office shelf, windowsill.',
    accent: 'var(--glow-classic)',
    spec: [
      ['Material', 'Food-grade silicone'],
      ['Weight', '90–180 g'],
      ['Pigment', 'Solid · 12 TPM colors'],
      ['Test', 'Geometry ±2% · Gravimetry ±3%'],
      ['Certification', 'GOST 25779-83 · EN 71-3'],
      ['Lead time', '3 weeks']
    ]
  },
  designer: {
    index: 'Lineup 03 / 05',
    name: 'DESIGNER',
    size: '15–30 cm · limited edition',
    img: './assets/product-designer.jpg',
    lead: 'Collaboration series. Every season — one guest author and their palette. The run is limited and fixed in the product passport.',
    accent: 'var(--glow-designer)',
    spec: [
      ['Author', 'Seasonal collaborator'],
      ['Material', 'Natural rubber + EPDM'],
      ['Weight', '140–260 g'],
      ['Pigment', 'Author palette · solid'],
      ['Run', 'Limited edition'],
      ['Lead time', '6 weeks']
    ]
  },
  mega: {
    index: 'Lineup 04 / 05',
    name: 'MEGA',
    size: '50–120 cm · child-sized',
    img: './assets/product-mega.jpg',
    lead: 'A photo prop. A duck that makes you feel scale. In a kid\'s room, in a studio, in a window, on stage. Holds the frame.',
    accent: 'var(--glow-mega)',
    spec: [
      ['Material', 'Natural rubber + EPDM'],
      ['Weight', '1.2–3.4 kg'],
      ['Pigment', 'Solid · 12 TPM colors'],
      ['Frame', 'No internal frame'],
      ['Test', 'Geometry ±2% · Ultrasonic check'],
      ['Lead time', '6 weeks']
    ]
  },
  architect: {
    index: 'Lineup 05 / 05',
    name: 'ARCHITECT',
    size: '1.5–3 m · installation',
    img: './assets/product-architect.jpg',
    lead: 'Architectural format. The duck as an environmental object: lobby, exhibition space, presentation, event. Survey, measurements, master model, install.',
    accent: 'var(--glow-architect)',
    spec: [
      ['Material', 'Natural rubber + EPDM'],
      ['Weight', '18–65 kg'],
      ['Frame', 'Internal load-bearing'],
      ['Inspection', 'Ultrasonic · photo protocol'],
      ['Install', 'Crew on site'],
      ['Lead time', '12 weeks']
    ]
  }
};

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

// =====================================================
// MODAL
// =====================================================
const modal       = $('#sku-modal');
const modalTitle  = $('#modal-title');
const modalEye    = $('#modal-eyebrow');
const modalSize   = $('#modal-size');
const modalLead   = $('#modal-lead');
const modalSpec   = $('#modal-spec');
const modalImg    = $('#modal-img');
const modalMedia  = $('.modal__media');
const modalPanel  = $('.modal__panel');
const modalCta    = $('#modal-cta');
let lastFocus     = null;

function openModal(data) {
  if (!data || !modal) return;
  lastFocus = document.activeElement;

  modalEye.textContent   = data.index;
  modalTitle.textContent = data.name;
  modalSize.textContent  = data.size;
  modalLead.textContent  = data.lead;

  modalSpec.innerHTML = '';
  data.spec.forEach(([k, v]) => {
    const dt = document.createElement('dt'); dt.textContent = k;
    const dd = document.createElement('dd'); dd.textContent = v;
    modalSpec.append(dt, dd);
  });

  if (data.img && modalImg) {
    modalImg.src = data.img;
    modalImg.alt = data.name;
    modalMedia.style.display = '';
  } else if (modalMedia) {
    modalMedia.style.display = 'none';
  }

  modalPanel.style.setProperty('--modal-accent', data.accent || 'var(--fg)');
  modalCta.textContent = data.img ? 'Request a quote →' : 'Get in touch →';
  modalCta.setAttribute('href', 'mailto:hello@quacktory.space');

  modal.classList.add('modal--open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const c = modal.querySelector('.modal__close');
    if (c) c.focus();
  }, 40);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('modal--open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

// Tile click → open SKU modal
$$('.tile').forEach(tile => {
  const sku = tile.dataset.sku;
  tile.addEventListener('click', (e) => {
    if (e.target.closest('.tile__pill')) return; // pill handles itself
    if (sku && SKU_DATA[sku]) openModal(SKU_DATA[sku]);
  });
  tile.addEventListener('mouseenter', () => tile.classList.add('tile--hover'));
  tile.addEventListener('mouseleave', () => tile.classList.remove('tile--hover'));
  tile.addEventListener('focusin',  () => tile.classList.add('tile--hover'));
  tile.addEventListener('focusout', () => tile.classList.remove('tile--hover'));
});

// Tooltip pill → same modal
$$('.tile__pill').forEach(pill => {
  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    const tile = pill.closest('.tile');
    if (!tile) return;
    const sku = tile.dataset.sku;
    if (sku && SKU_DATA[sku]) openModal(SKU_DATA[sku]);
  });
  pill.setAttribute('role', 'button');
  pill.setAttribute('tabindex', '0');
});

// Close handlers
$$('[data-close]', modal).forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('modal--open')) closeModal();
});

// =====================================================
// ABOUT — the single nav label opens the title page
// =====================================================
const about      = $('#about');
const aboutOpen  = $('[data-open-about]');
let aboutLastFocus = null;

function openAbout() {
  if (!about) return;
  aboutLastFocus = document.activeElement;
  about.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const close = about.querySelector('.about__close');
  if (close) close.focus();
}

function closeAbout() {
  if (!about) return;
  about.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (aboutLastFocus && aboutLastFocus.focus) aboutLastFocus.focus();
}

if (aboutOpen) {
  aboutOpen.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAbout();
  });
}

$$('[data-about-close]').forEach(el => el.addEventListener('click', closeAbout));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && about && about.getAttribute('aria-hidden') === 'false') closeAbout();
});

// =====================================================
// SCALE RAIL — clickable tick marks
// =====================================================
const ticks = $$('.scale-rail__ticks span');
ticks.forEach((tick, i) => {
  tick.setAttribute('role', 'button');
  tick.setAttribute('tabindex', '0');
  tick.setAttribute('aria-label', `Tick ${i + 1} of ${ticks.length} on the 04 cm — 3 m scale`);

  const openTick = () => {
    ticks.forEach(t => t.classList.remove('scale-rail__ticks--active'));
    tick.classList.add('scale-rail__ticks--active');
    const cm = ((i + 1) / ticks.length) * 300; // 04 cm → 300 cm
    const skuMatch = i < 4 ? 'micro' : i < 9 ? 'classic' : i < 14 ? 'designer' : i < 19 ? 'mega' : 'architect';
    openModal({
      ...SKU_DATA[skuMatch],
      index: `Tick ${String(i + 1).padStart(2, '0')} / ${ticks.length}`,
      name: `${(cm / 100).toFixed(2)} M`,
      size: `~${Math.round(cm)} cm on the Quacktory scale`,
      lead: `This tick corresponds to ${(cm / 100).toFixed(2)} m on the lineup. Tapping the scale opens the matching SKU passport.`
    });
  };
  tick.addEventListener('click', openTick);
  tick.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTick(); }
  });
});

// =====================================================
// SMOOTH SCROLL fallback
// =====================================================
$$('a[href^="#"]').forEach(a => {
  if (a.hasAttribute('data-open-about')) return;
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// =====================================================
// INTERSECTION OBSERVER — scroll reveals
// =====================================================
const revealTargets = $$('.footline, .filmstrip');
revealTargets.forEach(el => el.classList.add('is-reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-revealed'));
}
