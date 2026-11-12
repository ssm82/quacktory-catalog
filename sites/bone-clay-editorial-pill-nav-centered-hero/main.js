// file: main.js
// Quacktory / Women of Vision Awards — interactive layer

const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

/* ============== SMOOTH SCROLL ============== */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $$('.topnav__item').forEach(n => n.classList.remove('is-active'));
    const nav = $$('.topnav__item').find(n => n.getAttribute('href') === id);
    if (nav) nav.classList.add('is-active');
  });
});

/* ============== MODAL ============== */
let modal;
const buildModal = () => {
  modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal__overlay" data-close="1"></div>
    <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal__close" data-close="1" aria-label="Close">×</button>
      <span class="modal__edition"></span>
      <h3 class="modal__title" id="modal-title"></h3>
      <span class="modal__rule"></span>
      <dl class="modal__meta">
        <div><dt>Size</dt><dd class="modal__size"></dd></div>
        <div><dt>Edition</dt><dd class="modal__year"></dd></div>
      </dl>
      <p class="modal__desc"></p>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => {
    if (e.target.dataset.close) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
};

const openModal = data => {
  if (!modal) buildModal();
  modal.querySelector('.modal__title').textContent    = data.title;
  modal.querySelector('.modal__edition').textContent  = data.edition;
  modal.querySelector('.modal__size').textContent     = data.size;
  modal.querySelector('.modal__year').textContent     = data.year;
  modal.querySelector('.modal__desc').textContent     = data.desc;
  modal.querySelector('.modal__panel').style.setProperty('--modal-accent', data.accent || '#C9A26A');
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
};

/* ============== SKU DATA ============== */
const skuData = {
  micro:     { title: 'Line I — Micro',     edition: '01 / V',  year: '2024', size: '4 – 8 cm',    accent: '#C9A26A', desc: 'Thumb-sized, keychain scale. First line in the collection. Designed for pockets, zips and the back of a phone.' },
  classic:   { title: 'Line II — Classic',  edition: '02 / V',  year: '2024', size: '10 – 25 cm',  accent: '#D9B07A', desc: 'Palm-sized, bath-scale. Compression-moulded food-grade silicone. The reference silhouette for the whole ladder.' },
  designer:  { title: 'Line III — Designer',edition: '03 / V',  year: '2024', size: '15 – 30 cm',  accent: '#E8C99B', desc: 'Illustrator editions. Hand-cast in silicone moulds. Limited drops, signed base, numbered to 250.' },
  mega:      { title: 'Line IV — Mega',     edition: '04 / V',  year: '2024', size: '50 – 120 cm', accent: '#C9A26A', desc: 'Statement object. Rotational-moulded. Reads at room scale and lives on a plinth.' },
  architect: { title: 'Line V — Architect', edition: '05 / V',  year: '2024', size: '1.5 – 3 m',   accent: '#B78A55', desc: 'Installation scale. Sculptural cast, 2–4 weeks lead. Site-specific, by request only.' }
};

/* ============== SKU CLICK → MODAL ============== */
$$('.sku').forEach(sku => {
  const key = sku.dataset.size;
  const open = () => openModal(skuData[key] || skuData.micro);
  sku.addEventListener('click', open);
  sku.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
});

/* ============== QC TIMELINE RAIL ============== */
const qcData = [
  { title: '01 — Visual inspection', edition: 'QC STAGE I',   size: 'human eye',  year: '≤ 2 min',     desc: 'No porosity, streaks, or short shots. Body must be free of mould flash above 0.3 mm.' },
  { title: '02 — Geometry',         edition: 'QC STAGE II',  size: '± 2 %',       year: '5 min',       desc: 'Beak, eyes, feet present. Proportions within ±2% of the master spec.' },
  { title: '03 — Drop test',        edition: 'QC STAGE III', size: '5 × 1 m',     year: 'concrete',    desc: 'Five drops from one metre onto concrete. No cracks, no deformation of the beak.' },
  { title: '04 — Smell test',       edition: 'QC STAGE IV',  size: 'qualitative', year: '24 h cure',  desc: 'No rubbery smell. Sign of poor vulcanisation — units returned to line.' }
];
$$('.qc__step').forEach((step, i) => {
  step.setAttribute('tabindex', '0');
  step.setAttribute('role', 'button');
  const open = () => {
    $$('.qc__step').forEach(s => s.classList.remove('is-active'));
    step.classList.add('is-active');
    openModal(qcData[i] || qcData[0]);
  };
  step.addEventListener('click', open);
  step.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
});

/* ============== TICKETS PILL → SETTINGS-EQUIVALENT MODAL ============== */
const ticketPill = $('.ticket-pill');
if (ticketPill) {
  ticketPill.addEventListener('click', e => {
    e.preventDefault();
    openModal({
      title: 'Tickets — Limited drops',
      edition: 'DROP 04 / V',
      size: '3 waves',
      year: '2024',
      accent: '#E03A2F',
      desc: 'Each Micro and Classic drop is released in three waves. Subscribers receive a 24-hour head start. The Architect line is on request only.'
    });
  });
}

/* ============== TOOLTIP PILLS (ticker items) ============== */
const tickerNotes = {
  '4 cm · thumb-sized':   '4 cm — pocketable, fits on a thumb. Silicone-only body, no insert.',
  '8 cm · keychain':      '8 cm — comes with a brass D-ring. Designed to live on a keychain.',
  '15 cm · palm-sized':   '15 cm — the smallest hand-held scale. The original 1972 silhouette.',
  '25 cm · cat-sized':    '25 cm — slightly larger than a domestic cat. Reads as a small object.',
  '60 cm · dog-sized':    '60 cm — the entry into room-scale. First line that needs a plinth.',
  '1.2 m · child-sized':  '1.2 m — sized to a standing child. The crowd-pleaser of the line-up.',
  '3 m · bear-sized':     '3 m — installation scale. Built on a steel armature, removable for transport.'
};
$$('.ticker__item').forEach(t => {
  t.setAttribute('tabindex', '0');
  t.setAttribute('role', 'button');
  const note = tickerNotes[t.textContent.trim()];
  if (!note) return;
  const open = () => openModal({
    title: t.textContent.trim(),
    edition: 'SIZE NOTE',
    size: t.textContent.trim().split('·')[0].trim(),
    year: '2024',
    accent: '#D9B07A',
    desc: note
  });
  t.addEventListener('click', open);
  t.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
});

/* ============== SHARE COUNTER ============== */
const SHARE_CAP = 999;
let shareCount = 0;
const shareEl = document.createElement('button');
shareEl.className = 'share-counter';
shareEl.setAttribute('aria-label', 'Share this page');
shareEl.innerHTML = `
  <span class="share-counter__icon" aria-hidden="true">⤴</span>
  <span class="share-counter__num">0</span>
  <span class="share-counter__label">shares · cap ${SHARE_CAP}</span>`;
document.body.appendChild(shareEl);
shareEl.addEventListener('click', () => {
  if (shareCount >= SHARE_CAP) return;
  shareCount++;
  shareEl.querySelector('.share-counter__num').textContent = shareCount;
  shareEl.classList.add('is-pulsed');
  setTimeout(() => shareEl.classList.remove('is-pulsed'), 350);
  if (shareCount >= SHARE_CAP) {
    shareEl.classList.add('is-cap');
    shareEl.querySelector('.share-counter__label').textContent = 'cap reached';
  }
});

/* ============== SCROLL-DRIVEN FADE-IN ============== */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
$$('.sku, .qc__step, .section-head, .making__col, .ladder__note').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

/* ============== NAV ACTIVE-ON-SCROLL ============== */
const sections = ['#hero', '#ladder', '#making'];
const setActive = () => {
  const y = window.scrollY + 120;
  let current = '#hero';
  for (const id of sections) {
    const el = document.querySelector(id);
    if (el && el.offsetTop <= y) current = id;
  }
  $$('.topnav__item').forEach(n => {
    n.classList.toggle('is-active', n.getAttribute('href') === current);
  });
};
window.addEventListener('scroll', setActive, { passive: true });
setActive();
