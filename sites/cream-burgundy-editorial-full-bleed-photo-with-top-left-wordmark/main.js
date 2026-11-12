// file: main.js
const SPECS = {
  micro:     { num: 'i.',   title: 'Micro',     size: '4–8 cm · thumb-sized',     price: '$9 / unit',   lead: '3 weeks',  desc: 'Cast in food-grade silicone. The smallest duck in the line — pocket, pencil cup, stocking. Same oval eye as every other duck, in every line.' },
  classic:   { num: 'ii.',  title: 'Classic',   size: '10–25 cm · hand-sized',    price: '$24 / unit',  lead: '3 weeks',  desc: 'Compression-moulded vulcanised rubber. The hand-sized duck — desk, shelf, windowsill. Eye painted by hand post-cure.' },
  designer:  { num: 'iii.', title: 'Designer',  size: '15–30 cm · cat-sized',     price: '$68 / unit',  lead: '6 weeks',  desc: 'Hand-cast in natural rubber with EPDM additives. Limited to 300 units per batch. For studios, mantels, side tables.' },
  mega:      { num: 'iv.',  title: 'Mega',      size: '50–120 cm · child-sized',  price: '$420 / unit', lead: '6 weeks',  desc: 'Rotationally moulded in natural rubber. The child-sized duck — for lobbies, set pieces, waiting rooms. The same silhouette, scaled.' },
  architect: { num: 'v.',   title: 'Architect', size: '1.5–3 m · bear-sized',     price: 'on request',  lead: '12 weeks', desc: 'Sculptural casting against a CNC-milled master. Steel frame, on-site survey, installation included. The same duck as the Micro — that is the architectural move.' },
};

const PIGMENTS = [
  { name: 'Pine 1', code: '#1B3324', note: 'Deep pine, lifted slightly warmer than the background field.' },
  { name: 'Pine 2', code: '#102A1E', note: 'Forest floor at dusk. The darkest in the line.' },
  { name: 'Moss',   code: '#2E5440', note: 'Mid-green, the frond core tone.' },
  { name: 'Bark',   code: '#5A4A2A', note: 'Warm olive-brown trunk tone.' },
  { name: 'Amber',  code: '#9B6A2A', note: 'Rust leaflet highlight — autumn at the canopy edge.' },
  { name: 'Bone',   code: '#E8E2D0', note: 'Ivory copy colour, lifted cream.' },
  { name: 'Rust',   code: '#7A3B2A', note: 'Warm rust, terra-cotta undertone.' },
  { name: 'Cocoa',  code: '#3A2E20', note: 'Roasted cocoa, deep umber.' },
  { name: 'Slate',  code: '#4A5A4A', note: 'Cool slate, eucalyptus-tinged.' },
  { name: 'Ash',    code: '#A8A29A', note: 'Soft ash, weathered limestone.' },
  { name: 'Loam',   code: '#2A1A1A', note: 'Black loam, near-black soil.' },
  { name: 'Walnut', code: '#5C4A2E', note: 'Walnut brown, oiled timber.' },
];

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const modal   = $('#modal');
const mTitle  = $('#modal-title');
const mSize   = $('#modal-size');
const mNum    = $('#modal-num');
const mPrice  = $('#modal-price');
const mLead   = $('#modal-lead');
const mNote   = $('#modal-note');
let lastFocus = null;

function setSpec(cell, value) {
  if (!cell) return;
  cell.textContent = value ?? '—';
  const row = cell.closest('.modal__specs > div');
  if (row) row.hidden = !value;
}

function openModal({ num, title, size, price, lead, desc, accent, img } = {}) {
  if (!modal) return;
  if (mNum)   mNum.textContent   = num   ?? '—';
  if (mTitle) mTitle.textContent = title ?? '—';
  setSpec(mSize, size);
  setSpec(mPrice, price);
  setSpec(mLead, lead);
  if (mNote) mNote.textContent = desc ?? '—';

  const card = modal.querySelector('.modal__card');
  if (card && accent) card.style.setProperty('--modal-accent', accent);

  const fig = modal.querySelector('.modal__figure');
  const mImg = $('#modal-img');
  if (fig && mImg) {
    if (img) {
      mImg.src = img;
      mImg.alt = title ? `${title} duck` : '';
      mImg.style.display = '';
      fig.style.background = '';
    } else {
      mImg.removeAttribute('src');
      mImg.style.display = 'none';
      fig.style.background = accent || '';
    }
  }

  lastFocus = document.activeElement;
  modal.classList.add('modal--open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('.modal__close')?.focus(), 50);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('modal--open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const burger = $('.nav__menu');
  if (burger) burger.setAttribute('aria-expanded', 'false');
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

// Ladder: open spec sheet per duck
$$('.ladder__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const data = SPECS[btn.dataset.open];
    if (!data) return;
    const img = btn.querySelector('img');
    openModal({ ...data, img: img ? img.getAttribute('src') : '' });
  });
});

// B2B swatches: open pigment modal
$$('.b2b__swatch').forEach((sw, i) => {
  const p = PIGMENTS[i];
  if (!p) return;
  sw.setAttribute('role', 'button');
  sw.setAttribute('tabindex', '0');
  const open = () => openModal({
    num: '— pigment', title: p.name, size: p.code, desc: p.note, accent: p.code,
  });
  sw.addEventListener('click', open);
  sw.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
});

// Close: button, backdrop, Escape
$$('[data-close]', modal).forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('modal--open')) closeModal();
});

// Hamburger opens studio / about modal
const hamburger = $('.nav__menu');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = modal.classList.contains('modal--open');
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    if (isOpen) {
      closeModal();
    } else {
      openModal({
        num: '— studio',
        title: 'Quacktory',
        size: 'A story of shelves',
        desc: 'Vulcanised rubber, hand-painted eyes, five sizes. Made in one silhouette, no exceptions. We make ducks you don\'t want to drop in the water — you want to put them on a shelf.',
      });
    }
  });
}

// Smooth-scroll fallback for in-page anchors (CSS scroll-behavior covers most)
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });
});
