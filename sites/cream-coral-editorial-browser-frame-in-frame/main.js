// file: main.js
// quacktory — frame-in-frame / interactive layer

const DUCKS = {
  micro:     { title:'Quacktory Micro',     size:'4 cm',  edition:'Pocket line',  year:2024, desc:'Thumb-sized vulcanised rubber duck. Fits in a coin pocket. Comes in any of the twelve pigments.',     accent:'#7FBF6E' },
  classic:   { title:'Quacktory Classic',   size:'25 cm', edition:'Bath line',    year:2022, desc:'The mug-sized duck — the original silhouette. Black-on-white eyes, mass-tinted body, no paint, no film.', accent:'#D4A78A' },
  designer:  { title:'Quacktory Designer',  size:'30 cm', edition:'Shelf line',   year:2023, desc:'Cat-sized collector piece. Same silhouette, recoloured for shelves and studio desks.',                    accent:'#A38AC2' },
  mega:      { title:'Quacktory Mega',      size:'1.2 m', edition:'Display line', year:2024, desc:'Child-sized decorative duck for lobbies, retail floors, photo sets. Not a toy.',                          accent:'#F4B6C8' },
  architect: { title:'Quacktory Architect', size:'3 m',   edition:'Install line', year:2025, desc:'Bear-sized installation duck. Twelve-week lead. Made to spec, signed under the foot.',                   accent:'#1C1F23' }
};

const PIGMENTS = {
  Ink:'#1C1F23', Surface:'#F2F7F9', Blush:'#F4B6C8', Seafoam:'#7CB8A6',
  Lavender:'#A38AC2', Peach:'#D4A78A', Leaf:'#7FBF6E', Mist:'#D9E8EE',
  Lichen:'#C8DDD0', Earth:'#8A6A4A', Charcoal:'#1F2226', Apricot:'#E8B4A0'
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- smooth scroll fallback ----------
if (!('scrollBehavior' in document.documentElement.style)) {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });
}

// ---------- modal factory ----------
const overlay = document.createElement('div');
overlay.className = 'modal-overlay';
overlay.innerHTML = `
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button class="modal__close" aria-label="Close">×</button>
    <span class="modal__chip" data-chip></span>
    <h2 class="modal__title" id="modal-title"></h2>
    <p class="modal__meta"></p>
    <p class="modal__desc"></p>
    <span class="modal__accent" aria-hidden="true"></span>
  </div>`;
document.body.appendChild(overlay);

const modalEl    = overlay.querySelector('.modal');
const chipEl     = modalEl.querySelector('[data-chip]');
const titleEl    = modalEl.querySelector('.modal__title');
const metaEl     = modalEl.querySelector('.modal__meta');
const descEl     = modalEl.querySelector('.modal__desc');
const accentEl   = modalEl.querySelector('.modal__accent');
const closeBtn   = modalEl.querySelector('.modal__close');
let   lastFocus  = null;

function openModal(d) {
  lastFocus = document.activeElement;
  chipEl.textContent     = d.chip || 'detail';
  titleEl.textContent    = d.title;
  metaEl.textContent     = d.meta || '';
  descEl.textContent     = d.desc || '';
  accentEl.style.background = d.accent || '#1C1F23';
  modalEl.style.setProperty('--accent', d.accent || '#1C1F23');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => closeBtn.focus(), 30);
}
function closeModal() {
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
closeBtn.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ---------- duck cards (clickable subjects) ----------
document.querySelectorAll('.duck-card').forEach(card => {
  const d = DUCKS[card.dataset.line];
  if (!d) return;
  const show = () => openModal({
    chip: 'product',
    title: d.title,
    meta: `${d.size} · ${d.edition} · ${d.year}`,
    desc: d.desc,
    accent: d.accent
  });
  card.addEventListener('click', show);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
  });
});

// ---------- scale rail nodes (timeline) ----------
const NODES     = Array.from(document.querySelectorAll('.scale-rail__tick'));
const LINE_KEYS = ['micro','classic','designer','mega','architect'];
NODES.forEach((tick, i) => {
  tick.setAttribute('tabindex', '0');
  tick.setAttribute('role', 'button');
  const show = () => {
    NODES.forEach(t => t.classList.remove('is-active'));
    tick.classList.add('is-active');
    const d = DUCKS[LINE_KEYS[i]] || {};
    const num  = tick.querySelector('.scale-rail__num')?.textContent || '';
    const unit = tick.querySelector('.scale-rail__unit')?.textContent || '';
    const size = `${num} ${unit}`.trim();
    openModal({
      chip: 'scale',
      title: `${LINE_KEYS[i] || 'Node'} — ${size}`,
      meta: `Scale node ${i+1} of ${NODES.length}`,
      desc: d.desc || `Quacktory line at the ${size} mark on the scale rail.`,
      accent: d.accent || '#1C1F23'
    });
  };
  tick.addEventListener('click', show);
  tick.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }});
});

// ---------- swatch tooltips (pigments) ----------
document.querySelectorAll('.swatch').forEach(sw => {
  const name = sw.getAttribute('title') || 'Pigment';
  const hex  = PIGMENTS[name] || '#1C1F23';
  sw.setAttribute('tabindex', '0');
  sw.setAttribute('role', 'button');
  const show = () => openModal({
    chip: 'pigment',
    title: name,
    meta: `Hex ${hex}`,
    desc: 'Mass-tinted into the rubber before moulding. No paint, no film, no sticker. Available on every line.',
    accent: hex
  });
  sw.addEventListener('click', show);
  sw.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }});
});

// ---------- share counter (status pill) with cap ----------
const statusPill = document.querySelector('.status-pill');
if (statusPill) {
  const statusText = statusPill.querySelector('.status-pill__text');
  const SHARE_CAP  = 50;
  let count = parseInt((statusText.textContent.match(/\d+/) || ['5'])[0], 10);
  statusPill.setAttribute('role', 'button');
  statusPill.setAttribute('tabindex', '0');
  const bump = () => {
    count = Math.min(count + 1, SHARE_CAP);
    statusText.textContent = count >= SHARE_CAP
      ? `cap reached · ${SHARE_CAP} lines`
      : `${count} lines in production`;
    statusPill.classList.add('is-pulsed');
    setTimeout(() => statusPill.classList.remove('is-pulsed'), 320);
  };
  statusPill.addEventListener('click', bump);
  statusPill.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bump(); }});
}

// ---------- hero reveal (single-shot) ----------
const heroCard    = document.querySelector('.hero__card');
const heroWord    = document.querySelector('.hero__wordmark');
const heroActions = document.querySelector('.hero__actions');
const petals      = document.querySelectorAll('.petal');

if (!reduce) {
  [heroCard, heroWord, heroActions, ...petals].forEach(el => el && el.classList.add('will-animate'));
  requestAnimationFrame(() => {
    setTimeout(() => heroCard    && heroCard.classList.add('is-in'),   60);
    setTimeout(() => petals.forEach(p => p.classList.add('is-in')),   320);
    setTimeout(() => heroWord    && heroWord.classList.add('is-in'),  720);
    setTimeout(() => heroActions && heroActions.classList.add('is-in'), 980);
  });
}

// ---------- scroll reveals ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.duck-card, .b2b__panel, .manifesto__line, .ladder__head, .b2b__palette')
  .forEach(el => { el.classList.add('reveal'); io.observe(el); });
