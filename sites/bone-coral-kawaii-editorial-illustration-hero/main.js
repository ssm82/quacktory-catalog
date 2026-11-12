// file: main.js
// Quacktory — interactivity layer

const CATALOG = {
  micro:     { title: 'Micro',     cm: '4–8 cm',  price: 'from $4',  meta: 'Keychain talisman · 6+',  accent: '#F4D03F', desc: 'Pocket talisman. Impulse buy at the till, sold in six-colour packs.' },
  classic:   { title: 'Classic',   cm: '10–25 cm', price: 'from $9',  meta: 'Bathtub classic · 3+', accent: '#FFB627', desc: 'The hero of the shelf. Dense rubber that keeps its sheen in salt water.' },
  designer:  { title: 'Designer',  cm: '20–35 cm', price: 'from $20', meta: 'Limited editions with illustrators · collabs', accent: '#FF8FB1', desc: 'Capsule drops with independent illustrators. Runs of 200–500 units.' },
  mega:      { title: 'Mega',      cm: '50–80 cm', price: 'from $66', meta: 'Photo object · gift', accent: '#6BCB77', desc: 'For window displays, for photos, for the gift you cannot miss.' },
  architect: { title: 'Architect', cm: '1.5–3 m',  price: 'on request', meta: 'Installation · B2B', accent: '#9B72CF', desc: 'Art object for lobbies, offices, events. Frame, finish and install under one roof.' }
};

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

// ---------- Modal ----------
const modal = document.createElement('div');
modal.className = 'modal';
modal.setAttribute('aria-hidden', 'true');
modal.innerHTML = `
  <div class="modal__overlay" data-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <button class="modal__close" data-close aria-label="Close">×</button>
    <span class="modal__pill" id="modalPill"></span>
    <h2 class="modal__title" id="modalTitle"></h2>
    <p class="modal__cm" id="modalCm"></p>
    <p class="modal__meta" id="modalMeta"></p>
    <p class="modal__desc" id="modalDesc"></p>
    <p class="modal__price" id="modalPrice"></p>
  </div>`;
document.body.appendChild(modal);

const style = document.createElement('style');
style.textContent = `
  .modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;font-family:'Quicksand',sans-serif}
  .modal.is-open{display:flex;animation:fadeIn .2s ease}
  .modal__overlay{position:absolute;inset:0;background:rgba(31,31,31,.55);backdrop-filter:blur(6px)}
  .modal__panel{position:relative;background:#F5F5F4;border-radius:24px;padding:36px 32px;max-width:520px;width:calc(100% - 40px);box-shadow:0 30px 80px rgba(0,0,0,.25);transform:translateY(20px);animation:rise .25s ease forwards}
  .modal__close{position:absolute;top:14px;right:18px;font-size:28px;line-height:1;color:#888;background:none;border:none;cursor:pointer;transition:color .2s,transform .2s}
  .modal__close:hover{color:#E60012;transform:rotate(90deg)}
  .modal__pill{display:inline-block;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;background:#2B2A29;color:#EEF2DD;margin-bottom:14px;letter-spacing:.04em;text-transform:uppercase}
  .modal__title{font-family:'Fredoka',sans-serif;font-size:34px;line-height:1.1;margin-bottom:8px;color:var(--accent,#2B2A29)}
  .modal__cm{font-size:18px;font-weight:600;margin-bottom:6px;color:#2B2A29}
  .modal__meta{font-size:13px;color:#888;margin-bottom:14px}
  .modal__desc{font-size:15px;line-height:1.55;color:#2B2A29;margin-bottom:22px}
  .modal__row{display:flex;align-items:center;justify-content:space-between;gap:14px}
  .modal__price{font-family:'Fredoka',sans-serif;font-size:24px;font-weight:600}
  .reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes rise{from{transform:translateY(20px)}to{transform:translateY(0)}}
  .reveal.is-in{opacity:1;transform:translateY(0)}
  .scale__step.is-active .scale__duck{transform:translateY(-6px) scale(1.08)}
  .mascot.is-clicked{animation:wiggle .5s ease}
  @keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}}
`;
document.head.appendChild(style);

let activeCard = null;
let lastFocus = null;

function openModal(data) {
  if (!data) return;
  lastFocus = document.activeElement;
  $('#modalPill').textContent   = data.title;
  $('#modalTitle').textContent  = data.title;
  $('#modalCm').textContent     = data.cm;
  $('#modalMeta').textContent   = data.meta;
  $('#modalDesc').textContent   = data.desc;
  $('#modalPrice').textContent  = data.price;
  const panel = $('.modal__panel');
  panel.style.setProperty('--accent', data.accent || '#2B2A29');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('.modal__close').focus();
}
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
modal.addEventListener('click', e => { if (e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

// ---------- Wire up cards (lineup) ----------
$$('.card').forEach(card => {
  const sku = card.dataset.sku;
  const data = CATALOG[sku];
  if (!data) return;
  const open = () => {
    activeCard = card;
    card.classList.add('is-active');
    openModal(data);
  };
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
  const origClose = closeModal;
  closeModal = function() { origClose(); if (activeCard) activeCard.classList.remove('is-active'); activeCard = null; };
});

// ---------- Scale steps ----------
const SCALE_NAMES = { micro:'4 cm · Micro', classic:'15 cm · Classic', designer:'30 cm · Designer', mega:'80 cm · Mega', architect:'3 m · Architect' };
$$('.scale__step').forEach((step, i) => {
  step.classList.add('reveal');
  const duck = step.querySelector('.scale__duck');
  if (!duck) return;
  const sizes = ['micro','classic','designer','mega','architect'];
  const sku = sizes[i] || 'classic';
  const data = CATALOG[sku];
  const nameLabel = step.querySelector('.scale__cm')?.textContent || '';
  const custom = { ...data, title: 'Size: ' + (data.title), cm: nameLabel, meta: 'Tap to see the details', desc: 'This duck is part of the ' + data.title + ' lineup. Comparing to familiar objects helps you pick a size before ordering.' };
  step.addEventListener('click', () => {
    $$('.scale__step').forEach(s => s.classList.remove('is-active'));
    step.classList.add('is-active');
    openModal(custom);
  });
  step.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step.click(); }
  });
  step.tabIndex = 0;
});

// ---------- Mascots in lockup ----------
const MASCOT_DATA = [
  { title: 'Micro mascot',  cm: '4 cm',  price: '—', meta: 'Keychain hero',  accent: '#F4D03F', desc: 'The smallest member of the lockup. Loves pockets and backpacks.' },
  { title: 'Classic mascot', cm: '15 cm', price: '—', meta: 'Bathtub hero',  accent: '#FFB627', desc: 'The gold standard. The silhouette everyone recognises.' },
  { title: 'Architect mascot', cm: '3 m', price: '—', meta: 'Art object',   accent: '#9B72CF', desc: 'Big, serious, photogenic. Built for lobbies and installations.' }
];
$$('.scene__lockup .mascot').forEach((m, i) => {
  const data = MASCOT_DATA[i];
  if (!data) return;
  m.addEventListener('click', () => {
    m.classList.add('is-clicked');
    setTimeout(() => m.classList.remove('is-clicked'), 500);
    openModal(data);
  });
  m.tabIndex = 0;
  m.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); m.click(); }
  });
});

// ---------- Hero duck ----------
const heroDuck = $('.hero-duck');
if (heroDuck) {
  heroDuck.tabIndex = 0;
  heroDuck.addEventListener('click', () => openModal({
    title: 'Quacktory Duck', cm: 'any size',
    price: 'from $4', meta: 'Brand hero', accent: '#E60012',
    desc: 'One silhouette, five sizes, endless scenarios. Tap any card below to pick your size.'
  }));
}

// ---------- Smooth scroll fallback for older browsers ----------
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.15 });
$$('.section-head, .card, .scale__step, .hero-duck, .scene__copy').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// ---------- Cursor parallax on hero duck ----------
const duck = $('.hero-duck');
if (duck && matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth  - 0.5) * 12;
    const y = (e.clientY / innerHeight - 0.5) * 12;
    duck.style.transform = `translate(${x}px, ${y}px)`;
  });
}