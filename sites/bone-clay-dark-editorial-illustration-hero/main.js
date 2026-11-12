// file: main.js
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const LINES = {
  micro:    { num: '01', title: 'Micro',  size: '4–8 cm',  comp: 'like a thumb', aud: 'keychains, merch, gifts', price: 'from 500 ₽',  color: '#f4d35e', copy: 'The smallest duck in the lineup. Silicone compound, food-grade certification, survives a one-meter drop. Keychain, gift, talisman — anything except the bathroom.' },
  classic:  { num: '02', title: 'Classic', size: '10–25 cm', comp: 'like a palm',        aud: 'kids, bathroom, office',   price: 'mid-tier', color: '#e88c4d', copy: 'The canonical duck. The one with the yellow beak and calm gaze. Compression molding, hand-painted eyes, five checks per batch.' },
  designer: { num: '03', title: 'Designer',size: '15–30 cm', comp: 'like a cat',          aud: 'collabs, limited editions',     price: 'mid-tier+',  color: '#c98bbf', copy: 'Collaboration lineup. Silicone mold case, hand-shaping, proprietary TPM pigments. Every season — a new author.' },
  mega:     { num: '04', title: 'Mega',    size: '50–120 cm',comp: 'like a child',         aud: 'photo objects, displays',price: 'premium',   color: '#6ba4d6', copy: 'A large duck for displays, shoots, and lobbies. Rotational molding with an internal frame. Twelve proprietary Pantone equivalents.' },
  architect:{ num: '05', title: 'Architect',size: '1.5–3 m', comp: 'like a bear',         aud: 'installations, branding', price: 'on request', color: '#8b9bb4', copy: 'Sculptural casting with a master model from CNC polystyrene foam. Climate-controlled delivery, certified on-site installation.' }
};

const ENTRIES = {
  material:  { num: '01', title: 'Material',  copy: 'Solid cast from vulcanized rubber. Food-grade silicone compound for Micro and Classic, natural rubber with EPDM additives for Designer, Mega, and Architect. No plastic inserts, no metal inside, no glued seams.' },
  eyes:      { num: '02', title: 'Eyes',      copy: 'Eyes are paint, not inserts. Black pupil and white sclera are applied with food-grade silicone pigment after vulcanization, by hand. UV- and water-resistant. Eye shape — a single mold relief across all SKUs.' },
  casting:   { num: '03', title: 'Casting',   copy: 'Micro — injection under pressure, 45 seconds per cycle. Classic — compression, 3 minutes. Designer — hand-shaping in a silicone mold case. Mega — rotational molding with an internal frame. Architect — sculptural casting with a master model from CNC polystyrene foam.' },
  qc:        { num: '04', title: 'QC',        copy: 'Five checks per duck: visual inspection, geometry with ±2% tolerance, one-meter drop test, odor test, gravimetry ±3%. Architect undergoes an extended protocol with ultrasonic inspection of frame weld seams.' },
  compliance:{ num: '05', title: 'Compliance',copy: 'GOST 25779-83, EN 71-3 on chemical migration, REACH — free of phthalates and bisphenol A. Age marking is mandatory: Micro 4 cm — 6+, Classic — 3+, Designer — 6+, Mega — decorative object, Architect — installation under certified mounting.' },
  care:      { num: '06', title: 'Care',      copy: 'Temperature range: −20 °C … +60 °C. Indoor only. Protect from direct UV and from oils and solvents. Wash with warm water and mild soap. Do not use abrasives, alcohols, or bleaches. Product passport — in every box.' }
};

const PALETTE = ['#c0392b','#d35400','#e88c4d','#f4d35e','#a8b86c','#6ba4d6','#4a6fa5','#6b4e8a','#2c2d34','#8b9bb4','#c98bbf','#f0f0f0'];

const modal = $('#modal');
const mBody = $('#modal-body');
const mBackdrop = $('.modal__backdrop', modal);
const mClose = $('.modal__close', modal);
let lastFocus = null;

function openModal(build) {
  lastFocus = document.activeElement;
  build(mBody);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  mClose.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function setField(sel, val) {
  const el = mBody.querySelector(sel);
  if (el) el.textContent = val;
}

function setSpecs(specs) {
  const dl = mBody.querySelector('[data-modal="specs"]');
  if (!dl) return;
  dl.innerHTML = '';
  for (const [k, v] of Object.entries(specs)) {
    const dt = document.createElement('dt'); dt.textContent = k;
    const dd = document.createElement('dd'); dd.textContent = v;
    dl.appendChild(dt); dl.appendChild(dd);
  }
}

function showLine(key) {
  const d = LINES[key]; if (!d) return;
  openModal((body) => {
    setField('[data-modal="num"]', d.num);
    setField('[data-modal="title"]', d.title);
    setField('[data-modal="copy"]', d.copy);
    setSpecs({ Size: d.size, Comparison: d.comp, Audience: d.aud, Price: d.price });
    const img = body.querySelector('[data-modal="img"]');
    if (img) { img.src = `./assets/product-${key}.jpg`; img.alt = d.title; img.style.background = d.color; }
  });
  $$('.line-dot').forEach(b => b.classList.toggle('is-active', b.dataset.line === key));
}

function showEntry(key) {
  const d = ENTRIES[key]; if (!d) return;
  openModal((body) => {
    setField('[data-modal="num"]', d.num);
    setField('[data-modal="title"]', d.title);
    setField('[data-modal="copy"]', d.copy);
    setSpecs({});
    const img = body.querySelector('[data-modal="img"]');
    if (img) { img.removeAttribute('src'); img.alt = ''; }
  });
}

function showSwatch(idx) {
  const hex = PALETTE[idx];
  const num = String(idx + 1).padStart(2, '0');
  openModal((body) => {
    setField('[data-modal="num"]', num);
    setField('[data-modal="title"]', 'Pigment Menu');
    setField('[data-modal="copy"]', `Proprietary pigment ${hex}. Through-body mass coloring — before casting, not surface paint. Included in the Quacktory TPM palette at no extra formula charge.`);
    setSpecs({ Hex: hex, Index: num, Lead: '3 / 6 / 12 weeks' });
    const img = body.querySelector('[data-modal="img"]');
    if (img) { img.removeAttribute('src'); img.alt = ''; img.style.background = hex; }
  });
}

function showSettings() {
  openModal((body) => {
    setField('[data-modal="num"]', '—');
    setField('[data-modal="title"]', 'Settings');
    setField('[data-modal="copy"]', 'Demo site settings. In this prototype, settings are unavailable — we kept the gear as a structural anchor so the design matches the awwwards review pattern. Return to the scenario: duck lines, journal, B2B.');
    setSpecs({ Theme: 'Editorial · Travel', Stack: 'HTML · CSS · JS', Status: 'Demo' });
  });
}

// Wire modal close
mBackdrop.addEventListener('click', closeModal);
mClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

// Line dots (vertical pagination)
$$('.line-dot').forEach(btn => {
  btn.addEventListener('click', () => showLine(btn.dataset.line));
});

// Scale rows
$$('.scale__row').forEach(row => {
  row.addEventListener('click', () => showLine(row.dataset.line));
  row.style.cursor = 'pointer';
});

// Duck figures
$$('.duck').forEach(fig => {
  fig.addEventListener('click', () => showLine(fig.dataset.line));
  fig.style.cursor = 'pointer';
});

// Journal entries
$$('.entry').forEach((el, i) => {
  const key = ['material','eyes','casting','qc','compliance','care'][i];
  if (key) { el.addEventListener('click', () => showEntry(key)); el.style.cursor = 'pointer'; }
});

// B2B palette
$$('.b2b__palette li').forEach((li, i) => {
  li.addEventListener('click', () => showSwatch(i));
  li.style.cursor = 'pointer';
});

// Settings trigger — gear via long-press on logo or via .topbar__logo
const logo = $('.topbar__logo');
if (logo) {
  logo.addEventListener('dblclick', showSettings);
  logo.title = 'Double-click for settings';
}

// Smooth scroll for nav anchors (fallback for older browsers)
$$('.topbar__nav a, .hero__cta').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const t = document.querySelector(href);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Scroll-triggered fades
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });

$$('.manifesto__line, .scale__row, .entry, .b2b__panel, .duck').forEach(el => {
  el.classList.add('will-in');
  io.observe(el);
});