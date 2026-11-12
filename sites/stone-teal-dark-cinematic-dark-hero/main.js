// file: main.js

const DATA = {
  trinity: {
    micro:    { title: 'Micro',    size: '4–8 cm',  desc: 'Keychain, merch, impulse purchase. One silhouette, minimal SKU.', accent: '#C9A86A', meta: 'up to 500 ₽ · 3 wks · 06+' },
    classic:  { title: 'Classic',  size: '10–25 cm', desc: 'Bathroom, office, shelf. Mid-segment. The most frequent order.', accent: '#2F4A3A', meta: 'mid · 3 wks · 03+' },
    designer: { title: 'Designer', size: '15–30 cm', desc: 'Collabs with illustrators, limited editions.', accent: '#7A8B7E', meta: 'collab / limited · 6 wks · 06+' }
  },
  vitrine: {
    micro:     { title: 'Micro · 4–8 cm',      size: '06+',  desc: 'Keychains · Merch · Impulse',         accent: '#C9A86A', meta: 'up to 500 ₽ · 3 wks' },
    classic:   { title: 'Classic · 10–25 cm',  size: '03+',  desc: 'Kids · Bathroom · Office',              accent: '#2F4A3A', meta: 'mid · 3 wks' },
    designer:  { title: 'Designer · 15–30 cm', size: '06+',  desc: 'Collabs with illustrators · Limited editions', accent: '#7A8B7E', meta: 'collab · 6 wks' },
    architect: { title: 'Architect · 1.5–3 m', size: '12+',  desc: 'Installations · Events · Branding',    accent: '#3A3A3A', meta: 'on request · 12 wks' }
  },
  scale: {
    Micro:     { title: 'Micro',     size: '4 cm',     desc: 'The smallest SKU. Keychain, merch, impulse.', accent: '#C9A86A', meta: '06+ · 3 wks' },
    Classic:   { title: 'Classic',   size: '10–25 cm', desc: 'Universal format. Bathroom, office, gift.', accent: '#2F4A3A', meta: '03+ · 3 wks' },
    Designer:  { title: 'Designer',  size: '15–30 cm', desc: "Author's object, limited collabs.", accent: '#7A8B7E', meta: '06+ · 6 wks' },
    Mega:      { title: 'Mega',      size: '50–120 cm', desc: 'Decorative object for showrooms, events, photos.', accent: '#A8835C', meta: 'on request · 8 wks' },
    Architect: { title: 'Architect', size: '1.5–3 m',  desc: 'Installation in the lobby, space branding.', accent: '#3A3A3A', meta: 'on request · 12 wks' }
  },
  production: {
    Material:   { title: 'Material',   size: 'Silicone / Rubber', desc: 'Food-grade silicone for Micro/Classic. Natural rubber with EPDM — for Designer/Mega/Architect. No plastic, no glue.', accent: '#2F4A3A', meta: 'Phthalate-free · BPA-free' },
    Mould:      { title: 'Mould',      size: '1 silhouette',         desc: 'Injection, compression, rotational molding, or hand-casting for limited editions.', accent: '#7A8B7E', meta: 'All SKUs' },
    Eyes:       { title: 'Eyes',       size: 'Pigment',          desc: 'Black pupil + white sclera. Applied after vulcanization with food-grade silicone dye.', accent: '#C9A86A', meta: 'UV-resistant · waterproof' },
    QC:         { title: 'QC',         size: '97%',              desc: '5 checks: visual, geometry ±2%, drop test, odor test, gravimetry ±3%.', accent: '#2F4A3A', meta: 'Pass QC rate · 97%' },
    Compliance: { title: 'Compliance', size: 'GOST · EN · REACH', desc: 'GOST 25779-83, EN 71-3, REACH. Free of phthalates and bisphenol A. Temperature range −20…+60 °C.', accent: '#3A3A3A', meta: 'Indoor only · −20…+60 °C' }
  }
};

const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
  <div class="modal__overlay" data-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="mt">
    <button class="modal__close" data-close aria-label="Close">×</button>
    <span class="modal__pin" aria-hidden="true"></span>
    <p class="modal__size"></p>
    <h3 class="modal__title" id="mt"></h3>
    <p class="modal__desc"></p>
    <span class="modal__meta"></span>
    <span class="modal__bar" aria-hidden="true"><span class="modal__bar-fill"></span></span>
  </div>`;
document.body.appendChild(modal);

function openModal(d) {
  modal.querySelector('.modal__title').textContent = d.title;
  modal.querySelector('.modal__size').textContent = d.size;
  modal.querySelector('.modal__desc').textContent = d.desc;
  modal.querySelector('.modal__meta').textContent = d.meta;
  modal.querySelector('.modal__pin').style.background = d.accent;
  modal.querySelector('.modal__bar-fill').style.background = d.accent;
  modal.classList.add('modal--open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('modal--open');
  document.body.style.overflow = '';
}
modal.addEventListener('click', e => { if (e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Trinity cards
document.querySelectorAll('.trinity__card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const d = DATA.trinity[card.dataset.sku];
    if (d) openModal(d);
  });
});

// Vitrine cards
document.querySelectorAll('.vitrine__card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const cls = [...card.classList].find(c => c.startsWith('vitrine__card--'));
    if (!cls) return;
    const key = cls.replace('vitrine__card--', '');
    const d = DATA.vitrine[key];
    if (d) openModal(d);
  });
});

// Scale rail nodes — toggle active and open modal
document.querySelectorAll('.scale__step').forEach(step => {
  step.style.cursor = 'pointer';
  step.addEventListener('click', () => {
    document.querySelectorAll('.scale__step').forEach(s => s.classList.remove('scale__step--active'));
    step.classList.add('scale__step--active');
    const d = DATA.scale[step.dataset.line];
    if (d) openModal(d);
  });
});

// Production steps
document.querySelectorAll('.production__step').forEach(step => {
  const h3 = step.querySelector('h3');
  if (!h3) return;
  step.style.cursor = 'pointer';
  step.addEventListener('click', () => {
    const d = DATA.production[h3.textContent.trim()];
    if (d) openModal(d);
  });
});

// B2B color chips — tooltip pills
document.querySelectorAll('.b2b__chip').forEach(chip => {
  chip.style.cursor = 'pointer';
  chip.addEventListener('click', () => {
    const code = chip.textContent.trim();
    const sw = getComputedStyle(chip).getPropertyValue('--sw').trim() || '#2F4A3A';
    openModal({
      title: code,
      size: sw.toUpperCase(),
      desc: `TPM palette · ${code} · pigment in mass BEFORE casting, not surface paint.`,
      accent: sw,
      meta: '12 signature Pantone equivalents'
    });
  });
});

// Metric widget — opens QC info
const metric = document.querySelector('.metric');
if (metric) {
  metric.style.cursor = 'pointer';
  metric.addEventListener('click', () => openModal(DATA.production.QC));
}

// Settings via burger
const burger = document.querySelector('.burger');
if (burger) {
  burger.addEventListener('click', () => openModal({
    title: 'Settings',
    size: 'v 1.0',
    desc: "Quacktory — a nursery of author's ducks. Notification, language, and theme settings will appear in the next build. Everything is minimal right now.",
    accent: '#2F4A3A',
    meta: 'Indoor only · −20…+60 °C'
  }));
}

// Social glyphs
document.querySelectorAll('.socials__item').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
  });
});

// Smooth scroll fallback (CSS has scroll-behavior but we ensure hash jumps work)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.trinity__card, .vitrine__card, .production__step, .b2b__chip, .scale__step, .spotlight').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});