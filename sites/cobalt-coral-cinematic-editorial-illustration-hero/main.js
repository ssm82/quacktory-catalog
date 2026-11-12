// file: main.js
const SKU = {
  micro:    { name: 'MICRO',      size: '04–08 cm',  comp: 'like a thumb', price: 'from $4',    age: '6+ · not for <3',  tag: 'The thumb',         desc: 'Keychain, merch, gift up to $7. Impulse buy from a marketplace shelf.',         accent: '#1FC6C0' },
  classic:  { name: 'CLASSIC',    size: '10–25 cm',  comp: 'like a palm',        price: 'from $8',    age: '3+',              tag: 'The pond classic',  desc: "Kids' bath, office desk, no-reason gift. The icon of the genre.",                accent: '#FF2D8C' },
  designer: { name: 'DESIGNER',   size: '15–30 cm',  comp: 'like a cat',         price: 'from $20',  age: '6+ · limited',    tag: 'The collab',        desc: 'Limited collabs with illustrators. Collectible object, not a toy.', accent: '#C03FB8' },
  mega:     { name: 'MEGA',       size: '50–120 cm', comp: 'like a child',       price: 'from $200', age: 'art object',      tag: 'The room',          desc: 'Photo object, window display, gift-experience. Decorative object, not a toy.', accent: '#7A6BD9' },
  architect:{ name: 'ARCHITECT',  size: '1.5–3 m',   comp: 'like a bear',       price: 'on request',   age: 'installation',     tag: 'The installation',  desc: 'Installation, event, wedding, branded spaces. Installed by a certified crew.', accent: '#B6FF3C' },
  custom:   { name: 'B2B · CUSTOM', size: 'custom', comp: 'PMS-equivalent', price: 'on request',   age: 'B2B · 3–12 weeks',  tag: 'Pigment menu',     desc: '12 Quacktory Pantone equivalents. Through-mass pigment, not a surface paint.', accent: '#FFE94A' }
};

const STEPS = [
  { n: '01', t: 'Material', d: 'Food-grade silicone compound for Micro and Classic. Natural rubber with EPDM additives for Designer, Mega, and Architect. No plastic inserts, no metal, no glued seams.', accent: '#1FC6C0' },
  { n: '02', t: 'Eyes',     d: 'Eyes are paint, not inserts. Pigment is applied by hand after vulcanization, using food-grade silicone dye. UV- and water-resistant.',                          accent: '#FF2D8C' },
  { n: '03', t: 'Mold',     d: 'Injection 45 sec for Micro. Compression 3 min for Classic. Hand-poured silicone mold for Designer. Rotational 2 h for Mega. Sculptural cast 2–4 weeks for Architect.', accent: '#C03FB8' },
  { n: '04', t: 'QC',       d: '5 checks on every duck: visual, geometry ±2%, 5 drops from 1 m, odor test, gravimetry ±3%. Architect — extended protocol + ultrasonic inspection.', accent: '#B6FF3C' }
];

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

// ---------- modal ----------
let modal, backdrop, lastFocus;
function ensureModal() {
  if (modal) return modal;
  backdrop = document.createElement('div');
  backdrop.className = 'qd-modal';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.innerHTML = `
    <div class="qd-modal__panel">
      <button class="qd-modal__close" aria-label="Close">×</button>
      <div class="qd-modal__tag"></div>
      <h2 class="qd-modal__title"></h2>
      <div class="qd-modal__grid"></div>
      <p class="qd-modal__desc"></p>
      <div class="qd-modal__foot">
        <span class="qd-modal__share">SHARED <b>0</b>/256</span>
        <a class="qd-modal__cta" href="#contact">GET IN TOUCH</a>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  modal = backdrop;
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  $('.qd-modal__close', backdrop).addEventListener('click', closeModal);
  return backdrop;
}

function openModal({ tag, title, accent, fields, desc, shareable=true }) {
  ensureModal();
  const root = backdrop;
  root.style.setProperty('--qd-accent', accent || '#FF2D8C');
  $('.qd-modal__tag', root).textContent  = tag || '';
  $('.qd-modal__title', root).textContent = title || '';
  $('.qd-modal__desc', root).textContent  = desc || '';
  const grid = $('.qd-modal__grid', root);
  grid.innerHTML = (fields || []).map(([k,v]) => `<div class="qd-cell"><span>${k}</span><b>${v}</b></div>`).join('');

  const share = $('.qd-modal__share b', root);
  let count = 0;
  share.textContent = count;
  if (shareable) {
    share.parentElement.onclick = () => {
      if (count < 256) { count++; share.textContent = count; }
    };
  }

  lastFocus = document.activeElement;
  root.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('.qd-modal__close', root).focus(), 30);
}

function closeModal() {
  if (!backdrop) return;
  backdrop.classList.remove('is-open');
  document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ---------- SKU / card openers ----------
function openSku(sku, sourceTitle) {
  const d = SKU[sku]; if (!d) return;
  openModal({
    tag: `${d.name} · ${d.size}`,
    title: sourceTitle || d.tag,
    desc: d.desc,
    accent: d.accent,
    fields: [
      ['Size',    d.size],
      ['Scale',   d.comp],
      ['Price',   d.price],
      ['Age',     d.age],
      ['Edition', sku === 'architect' ? '1 / 1' : sku === 'custom' ? 'B2B · Pantone' : 'open run']
    ]
  });
}

$$('[data-sku]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const sku = el.dataset.sku;
    const name = (el.querySelector('.card-name, .sku-name') || {}).textContent;
    openSku(sku, name);
  });
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
});

// ---------- duck click ----------
$$('.duck, .duck-body, .duck-head, .duck-feet').forEach(el => {
  el.style.cursor = 'pointer';
  el.addEventListener('click', () => openSku('classic', 'The Quacktory duck'));
});

// ---------- process steps ----------
$$('.process-step').forEach((el, i) => {
  el.style.cursor = 'pointer';
  el.addEventListener('click', () => {
    const s = STEPS[i] || STEPS[0];
    openModal({ tag: `PRODUCTION · STEP ${s.n}`, title: s.t, desc: s.d, accent: s.accent, shareable: false,
      fields: [['Step', s.n], ['Stage', s.t]] });
  });
});

// ---------- mirror plates (tooltip pills) ----------
$$('.mirror-plate').forEach(el => {
  el.style.cursor = 'pointer';
  el.addEventListener('click', () => {
    const txt = el.textContent.trim();
    openModal({ tag: 'TYPOGRAPHIC PLATE', title: txt, accent: '#7A6BD9', shareable: false,
      desc: 'Decorative mirror plate, set dressing for the scene. Not editable copy.', fields: [['Plate', txt]] });
  });
});

// ---------- carousel dots ----------
$$('.dot-row .dot').forEach((dot, i, all) => {
  dot.style.cursor = 'pointer';
  dot.addEventListener('click', () => {
    all.forEach(d => d.classList.remove('dot--active'));
    dot.classList.add('dot--active');
    const labels = ['Hero', 'Lineup', 'Production', 'B2B', 'Contact'];
    openModal({ tag: `SLIDE 0${i+1} / 0${all.length}`, title: labels[i] || `Frame ${i+1}`,
      desc: 'Quick jump. Use ← → to scrub through the showcase.',
      accent: i === 0 ? '#FF2D8C' : i === 1 ? '#1FC6C0' : i === 2 ? '#C03FB8' : i === 3 ? '#7A6BD9' : '#B6FF3C',
      fields: [['Index', `${i+1} / ${all.length}`], ['Frame', labels[i] || '—']],
      shareable: false });
  });
});

// ---------- GET IN TOUCH pills ----------
$$('.pill, .scene-cta .pill').forEach(p => {
  p.addEventListener('click', e => {
    if (p.getAttribute('href') === '#contact') {
      e.preventDefault();
      const t = $('#contact');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---------- settings gear (brand mark) ----------
const gear = $('.brand-mark');
if (gear) {
  gear.style.cursor = 'pointer';
  gear.addEventListener('click', () => {
    openModal({ tag: 'SETTINGS', title: 'Preferences', accent: '#FFE94A', shareable: false,
      desc: 'RGB-shift, chromatic-aberration density, and glitch intensity are driven by CSS variables. A direct UI to them isn\'t wired in this demo — by design.',
      fields: [['Glitch', 'fixed · 100%'], ['RGB-shift', 'cyan / magenta'], ['Floor', 'teal → magenta → lavender'], ['Build', 'v0.04 · motiondeep-49758']] });
  });
}

// ---------- keyboard scroll helper ----------
window.addEventListener('keydown', e => {
  if (e.target.closest('input, textarea, [contenteditable]')) return;
  if (e.key === 'ArrowDown') { window.scrollBy({ top:  window.innerHeight*0.85, behavior: 'smooth' }); }
  if (e.key === 'ArrowUp')   { window.scrollBy({ top: -window.innerHeight*0.85, behavior: 'smooth' }); }
});

// ---------- scroll reveal ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
$$('.section-head, .sku, .card, .process-step, .cert, .manifesto .line').forEach(el => io.observe(el));

// ---------- floating blocks parallax ----------
const stage = $('.scene');
if (stage) {
  stage.addEventListener('mousemove', e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    $$('.block').forEach((b, i) => {
      const k = (i + 1) * 6;
      b.style.transform = `translate3d(${x*k}px, ${y*k}px, 0)`;
    });
  });
  stage.addEventListener('mouseleave', () => {
    $$('.block').forEach(b => b.style.transform = '');
  });
}
