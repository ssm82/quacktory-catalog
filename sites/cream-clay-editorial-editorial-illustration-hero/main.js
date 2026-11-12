// file: main.js
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

// ============================================
// MODAL
// ============================================
const backdrop = document.createElement('div');
backdrop.className = 'modal';
backdrop.innerHTML = `
  <div class="modal__panel" role="dialog" aria-modal="true" aria-label="Details">
    <button class="modal__close" aria-label="Close">✕</button>
    <span class="modal__eyebrow"></span>
    <h3 class="modal__title"></h3>
    <p class="modal__desc"></p>
    <div class="modal__meta"></div>
    <div class="modal__share">
      <button class="modal__share-btn">Share</button>
      <span class="modal__count">0</span>
    </div>
  </div>`;
document.body.appendChild(backdrop);

const panel = $('.modal__panel', backdrop);
const closeBtn = $('.modal__close', backdrop);
const titleEl = $('.modal__title', backdrop);
const descEl = $('.modal__desc', backdrop);
const metaEl = $('.modal__meta', backdrop);
const eyeEl = $('.modal__eyebrow', backdrop);
const countEl = $('.modal__count', backdrop);
const shareBtn = $('.modal__share-btn', backdrop);

let shareCount = 0;
const SHARE_CAP = 99;

const DUCK_DATA = {
  Designer:   { title: 'Designer',  size: '15–30 cm',  desc: 'Collaborations with illustrators, limited editions. Silicone mold, ≤300 pcs.', color: '#E91FB8' },
  Architect:  { title: 'Architect', size: '1.5–3 m',   desc: 'Sculptural cast for installations, events, branded spaces.', color: '#A084DC' },
  Micro:      { title: 'Micro',     size: '4–8 cm',    desc: 'Keychains, merch, gifts. Injection molding, ~45 sec/cycle.',           color: '#3FD9D7' },
  Classic:    { title: 'Classic',   size: '10–25 cm',  desc: 'Kids, bath, office. Compression molding, aluminum mold.', color: '#FFD93D' },
  Mega:       { title: 'Mega',      size: '50–120 cm', desc: 'Photo objects, window displays, gift-experiences. Rotational molding.',    color: '#F39C2C' }
};

function openModal(sku, source = 'duck') {
  const data = DUCK_DATA[sku] || { title: sku, size: '—', desc: 'Description coming soon.', color: '#E63A82' };
  eyeEl.textContent = source === 'card' ? '— lineup' : '— collection 25 / 26';
  titleEl.textContent = data.title;
  descEl.textContent = data.desc;
  metaEl.innerHTML = `
    <span class="modal__chip" style="--c:${data.color}">${data.size}</span>
    <span class="modal__chip modal__chip--ink">SKU: ${sku}</span>
  `;
  panel.style.setProperty('--accent', data.color);
  backdrop.classList.add('modal--open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeModal() {
  backdrop.classList.remove('modal--open');
  document.body.style.overflow = '';
}

// close handlers
closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && backdrop.classList.contains('modal--open')) closeModal(); });

// share counter
shareBtn.addEventListener('click', () => {
  if (shareCount < SHARE_CAP) {
    shareCount++;
    countEl.textContent = shareCount;
    countEl.classList.add('modal__count--bump');
    setTimeout(() => countEl.classList.remove('modal__count--bump'), 320);
  }
});

// open modal triggers
$$('.duck').forEach(d => d.addEventListener('click', () => openModal(d.dataset.sku, 'duck')));
$$('.card').forEach(c => c.addEventListener('click', e => {
  if (e.target.closest('a, button')) return;
  openModal(c.dataset.sku, 'card');
}));

// ============================================
// PILL NAV — active toggle + smooth scroll
// ============================================
$$('.pill').forEach(pill => {
  pill.addEventListener('click', e => {
    $$('.pill').forEach(p => p.classList.remove('pill--active'));
    if (!pill.classList.contains('pill--accent')) pill.classList.add('pill--active');
    const href = pill.getAttribute('href');
    if (href && href.startsWith('#')) {
      const t = $(href);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ============================================
// SCALEBAR / TIMELINE RAIL — clickable nodes
// ============================================
$$('.scalebar__text').forEach(node => {
  node.addEventListener('click', () => {
    $$('.scalebar__text').forEach(n => n.classList.remove('scalebar__node--active'));
    node.classList.add('scalebar__node--active');
    const label = node.querySelector('strong')?.textContent;
    if (label && DUCK_DATA[label]) openModal(label, 'scalebar');
  });
});

// ============================================
// HOVER MICRO-INTERACTIONS (class toggle)
// ============================================
$$('.duck').forEach(d => {
  d.addEventListener('pointerenter', () => d.classList.add('is-hover'));
  d.addEventListener('pointerleave', () => d.classList.remove('is-hover'));
});

// ============================================
// SCROLL FADES (IntersectionObserver)
// ============================================
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.15 });

$$('.card, .scalebar, .sizes__header, .hero__copy, .hero__shipping').forEach(el => {
  el.classList.add('will-reveal');
  io.observe(el);
});

// ============================================
// FAN LAYOUT — gentle parallax on mouse
// ============================================
const fan = $('.fan');
if (fan) {
  fan.addEventListener('mousemove', e => {
    const r = fan.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    $$('.card', fan).forEach((c, i) => {
      const k = (i - 2) * 4;
      c.style.transform = `translateY(${(-y * 6).toFixed(2)}px) translateX(${(x * k).toFixed(2)}px)`;
    });
  });
  fan.addEventListener('mouseleave', () => {
    $$('.card', fan).forEach(c => c.style.transform = '');
  });
}
