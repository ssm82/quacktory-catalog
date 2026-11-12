// file: main.js

// ---------- Modal system (injected) ----------
const modal = document.createElement('div');
modal.className = 'noomo-modal';
modal.innerHTML = `
  <div class="noomo-modal__overlay" data-close></div>
  <div class="noomo-modal__card" role="dialog" aria-modal="true">
    <button class="noomo-modal__close" data-close aria-label="Close">×</button>
    <span class="noomo-modal__tag"></span>
    <h3 class="noomo-modal__title"></h3>
    <p class="noomo-modal__body"></p>
    <div class="noomo-modal__meta"></div>
  </div>`;
document.body.appendChild(modal);

const mCard = modal.querySelector('.noomo-modal__card');
const mTag = modal.querySelector('.noomo-modal__tag');
const mTitle = modal.querySelector('.noomo-modal__title');
const mBody = modal.querySelector('.noomo-modal__body');
const mMeta = modal.querySelector('.noomo-modal__meta');

function openModal({ tag = '', title = '', body = '', meta = '', accent = '#D45FB0' }) {
  mTag.textContent = tag;
  mTitle.textContent = title;
  mBody.textContent = body;
  mMeta.innerHTML = meta;
  mCard.style.setProperty('--item-accent', accent);
  modal.classList.add('is-open');
  document.documentElement.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('is-open');
  document.documentElement.style.overflow = '';
}
modal.addEventListener('click', (e) => { if (e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

// ---------- Duck cards (taxonomy) ----------
const skuMeta = {
  micro:     { tag: 'SKU · MICRO',     accent: '#B8E0FF' },
  classic:   { tag: 'SKU · CLASSIC',   accent: '#D45FB0' },
  designer:  { tag: 'SKU · DESIGNER',  accent: '#E07A3A' },
  mega:      { tag: 'SKU · MEGA',      accent: '#F2C94C' },
  architect: { tag: 'SKU · ARCHITECT', accent: '#1E2A78' }
};
document.querySelectorAll('.duck').forEach((duck) => {
  const sku = duck.dataset.sku || '';
  const meta = skuMeta[sku] || {};
  const line  = duck.querySelector('.duck-line')?.textContent?.trim() || sku;
  const title = duck.querySelector('.duck-title')?.textContent?.trim() || '';
  const desc  = duck.querySelector('.duck-desc')?.textContent?.trim() || '';
  const size  = duck.querySelector('.duck-marker')?.textContent?.trim() || '';
  const price = duck.querySelector('.duck-price')?.textContent?.trim() || '';
  const accent = duck.style.getPropertyValue('--item-accent').trim() || meta.accent || '#D45FB0';
  const payload = {
    tag: meta.tag || `SKU · ${sku.toUpperCase()}`,
    title: line,
    body: desc,
    meta: `<span>${size}</span><span>${price}</span>`,
    accent
  };
  const fire = (e) => {
    if (e.target.closest('a')) return;
    openModal(payload);
  };
  duck.addEventListener('click', fire);
});

// ---------- Scale legend (timeline rail) ----------
const scaleMap = {
  '0':      { title: 'Origin',    body: 'The master model is hand-cut. The silhouette is fixed before the first casting.', meta: 'Day 0' },
  '4 cm':   { title: 'Micro',     body: 'Keychain, merch, gift. Impulse up to $7.', meta: 'Micro' },
  '25 cm':  { title: 'Classic',   body: 'Mid size, mid price. Compression, 3 min/cycle.', meta: 'Classic' },
  '30 cm':  { title: 'Designer',  body: 'Collabs with illustrators. Run ≤300 pcs.', meta: 'Designer' },
  '120 cm': { title: 'Mega',      body: 'Photo object and window display. Internal fiberglass frame.', meta: 'Mega' },
  '3 m':    { title: 'Architect', body: 'Foyer installation. CNC milling, certified installation.', meta: 'Architect' },
  '∞':      { title: 'Beyond',    body: 'No ceiling. Any size, any color — by contract.', meta: 'Custom contract' }
};
document.querySelectorAll('.legend-tick').forEach((tick) => {
  tick.setAttribute('role', 'button');
  tick.tabIndex = 0;
  const key = tick.textContent.trim();
  const data = scaleMap[key];
  if (!data) return;
  const open = () => openModal({ tag: 'Scale milestone', title: data.title, body: data.body, meta: data.meta, accent: '#B8E0FF' });
  tick.addEventListener('click', open);
  tick.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
});

// ---------- Hero sidecard & object ----------
const sidecard = document.querySelector('.hero-sidecard');
if (sidecard) {
  sidecard.setAttribute('role', 'button'); sidecard.tabIndex = 0;
  const fire = () => {
    const lines = [...sidecard.querySelectorAll('.sidecard-line')].map(n => n.textContent.trim());
    openModal({ tag: 'Spec', title: 'Quacktory', body: lines.join(' · '), meta: 'Specification sheet', accent: '#D45FB0' });
  };
  sidecard.addEventListener('click', fire);
  sidecard.addEventListener('keydown', (e) => { if (e.key === 'Enter') fire(); });
}
const heroObject = document.querySelector('.hero-object');
if (heroObject) {
  heroObject.style.cursor = 'pointer';
  heroObject.addEventListener('click', () => openModal({
    tag: 'Hero object',
    title: 'The Quacktory silhouette',
    body: 'One silhouette, five scales. Proportions don\'t scale linearly: Architect is the same duck as Micro, just stood up vertically.',
    meta: 'CGI · iridescent shader',
    accent: '#D45FB0'
  }));
}
const metaQuote = document.querySelector('.meta-quote');
if (metaQuote) {
  metaQuote.style.cursor = 'pointer';
  metaQuote.addEventListener('click', () => openModal({
    tag: '— 01 / Manifesto', title: 'Quacktory manifesto', body: metaQuote.textContent.trim(),
    meta: 'est. 2022 · Moscow', accent: '#E07A3A'
  }));
}

// ---------- Audio toggle: settings modal + share counter ----------
const SHARE_CAP = 99;
let shareCount = 0;
const audioBtn = document.querySelector('.audio');
if (audioBtn) {
  audioBtn.addEventListener('click', () => {
    audioBtn.classList.toggle('is-on');
    if (shareCount < SHARE_CAP) shareCount++;
    const on = audioBtn.classList.contains('is-on');
    openModal({
      tag: 'Settings',
      title: on ? 'Sound · on' : 'Sound · off',
      body: on
        ? 'Audio mode is on. The quiet duck has receded into the background. Background score engaged.'
        : 'Audio is off. The duck is in silence. Made in Moscow, from vulcanized rubber.',
      meta: `<span>Share counter</span><span>${shareCount} / ${SHARE_CAP}</span>`,
      accent: '#1E2A78'
    });
  });
}

// ---------- CTA share increment ----------
const cta = document.querySelector('.cta');
if (cta) {
  cta.addEventListener('click', () => {
    if (shareCount < SHARE_CAP) shareCount++;
  });
}

// ---------- Smooth scroll fallback ----------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });
});

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  }
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.hero-stage, .section-head, .duck, .prod-card').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});
