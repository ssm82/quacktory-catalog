// file: main.js
const SKU = {
  micro:     { num:'01', name:'Micro',     size:'4 — 8 cm',   comp:'thumb-sized',  price:'from $8',          lead:'Today',              unit:'per unit · incl. shipping', audience:'Impulse · gifts · merch',          accent:'#c87238' },
  classic:   { num:'02', name:'Classic',   size:'10 — 25 cm', comp:'cat-sized',    price:'from $24',         lead:'Today — 3 weeks',    unit:'per unit · incl. shipping', audience:'Parent · kids · office',            accent:'#b85a2a' },
  designer:  { num:'03', name:'Designer',  size:'15 — 30 cm', comp:'cat-sized',    price:'from $58',         lead:'6 weeks',            unit:'per unit · incl. shipping', audience:'Collector · illustrator collabs',    accent:'#1d3a3a' },
  mega:      { num:'04', name:'Mega',      size:'50 — 120 cm',comp:'child-sized',  price:'from $320',        lead:'6 weeks',            unit:'per unit · incl. shipping', audience:'Shop window · statement gift',       accent:'#7a3e22' },
  architect: { num:'05', name:'Architect', size:'1.5 — 3 m',  comp:'bear-sized',   price:'price on request', lead:'On-site survey',     unit:'spec sheet · 12 weeks',       audience:'Installation · event · wedding',     accent:'#f5efe6' }
};

let modal, shareCount = 0;
const SHARE_CAP = 9;

function ensureModal() {
  if (modal) return modal;
  modal = document.getElementById('sku-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'sku-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'sku-modal-title');
    modal.innerHTML = `
      <div class="modal-overlay" data-modal-close></div>
      <div class="modal-card" role="document">
        <button class="modal-close" type="button" data-modal-close aria-label="Close">×</button>
        <p class="modal-eyebrow"><span class="modal-num"></span> · <span class="modal-comp"></span></p>
        <h3 class="modal-title" id="sku-modal-title"></h3>
        <p class="modal-size"></p>
        <div class="modal-specs">
          <div><span>Price</span><strong class="modal-price"></strong><em class="modal-unit"></em></div>
          <div><span>Lead time</span><strong class="modal-lead"></strong></div>
          <div><span>Audience</span><strong class="modal-audience"></strong></div>
        </div>
        <p class="modal-note">Material, moulding, packaging, compliance, and shipping are listed in § 02 — How we make it. Click anywhere outside this card, press <kbd>Esc</kbd>, or hit × to close.</p>
      </div>`;
    document.body.appendChild(modal);
  }
  modal.hidden = true;
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-modal-close]')) closeModal();
  });
  return modal;
}

function openModal(skuId) {
  const m = ensureModal();
  const d = SKU[skuId];
  if (!d) return;
  m.querySelector('.modal-num').textContent = '§ ' + d.num;
  m.querySelector('.modal-comp').textContent = d.comp;
  m.querySelector('.modal-title').textContent = d.name + ' duck';
  m.querySelector('.modal-size').textContent = d.size;
  m.querySelector('.modal-price').textContent = d.price;
  m.querySelector('.modal-unit').textContent = d.unit;
  m.querySelector('.modal-lead').textContent = d.lead;
  m.querySelector('.modal-audience').textContent = d.audience;
  m.style.setProperty('--modal-accent', d.accent);
  m.hidden = false;
  m.classList.add('is-open');
  document.body.classList.add('modal-on');
  const focusable = m.querySelector('.modal-close');
  focusable && focusable.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.hidden = true;
  document.body.classList.remove('modal-on');
}

function bindSkuButtons() {
  document.querySelectorAll('[data-modal-open="sku-modal"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-sku-id');
      openModal(id);
    });
  });
}

function bindSwatches() {
  const swatchData = {
    'swatch-teal-deep':   { name:'Deep Teal',    note:'Body-through pigment. No surface paint.' },
    'swatch-rust':        { name:'Rust',         note:'Body-through pigment. No surface paint.' },
    'swatch-olive':       { name:'Olive Haze',   note:'Body-through pigment. No surface paint.' },
    'swatch-cream':       { name:'Cream',        note:'Body-through pigment. No surface paint.' },
    'swatch-forest':      { name:'Forest',       note:'Body-through pigment. No surface paint.' },
    'swatch-brick':       { name:'Brick',        note:'Body-through pigment. No surface paint.' },
    'swatch-sand':        { name:'Sand',         note:'Body-through pigment. No surface paint.' },
    'swatch-slate':       { name:'Slate',        note:'Body-through pigment. No surface paint.' },
    'swatch-terracotta':  { name:'Terracotta',   note:'Body-through pigment. No surface paint.' },
    'swatch-tobacco':     { name:'Tobacco',      note:'Body-through pigment. No surface paint.' },
    'swatch-camel':       { name:'Camel',        note:'Body-through pigment. No surface paint.' },
    'swatch-carbon':      { name:'Carbon',       note:'Body-through pigment. No surface paint.' }
  };
  document.querySelectorAll('.swatches li').forEach((li) => {
    const chip = li.querySelector('.swatch-chip');
    if (!chip) return;
    const key = Array.from(chip.classList).find((c) => swatchData[c]);
    const d = key ? swatchData[key] : null;
    if (!d) return;
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    const open = () => {
      const m = ensureModal();
      m.querySelector('.modal-num').textContent = 'TPM';
      m.querySelector('.modal-comp').textContent = 'Quacktory Pigment Menu';
      m.querySelector('.modal-title').textContent = d.name;
      m.querySelector('.modal-size').textContent = '';
      m.querySelector('.modal-price').textContent = 'in catalogue';
      m.querySelector('.modal-unit').textContent = '12 Pantone-equivalents';
      m.querySelector('.modal-lead').textContent = '3 — 12 weeks';
      m.querySelector('.modal-audience').textContent = 'B2B · custom runs';
      m.querySelector('.modal-note').textContent = d.note + ' Click anywhere outside this card, press Esc, or hit × to close.';
      m.hidden = false;
      m.classList.add('is-open');
      document.body.classList.add('modal-on');
    };
    li.addEventListener('click', open);
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

function bindShareCounter() {
  const btn = document.querySelector('[data-share]');
  if (!btn) return;
  const label = btn.querySelector('.share-label') || btn;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (shareCount >= SHARE_CAP) return;
    shareCount += 1;
    label.textContent = 'Shared ' + shareCount + ' / ' + SHARE_CAP;
    btn.classList.add('is-shared');
    if (navigator.clipboard && shareCount <= 1) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  });
}

function bindSettingsGear() {
  const gear = document.querySelector('[data-settings]');
  if (!gear) return;
  gear.addEventListener('click', (e) => {
    e.preventDefault();
    const m = ensureModal();
    m.querySelector('.modal-num').textContent = 'CFG';
    m.querySelector('.modal-comp').textContent = 'Preferences';
    m.querySelector('.modal-title').textContent = 'Display settings';
    m.querySelector('.modal-size').textContent = '';
    m.querySelector('.modal-price').textContent = 'defaults';
    m.querySelector('.modal-unit').textContent = 'stored locally';
    m.querySelector('.modal-lead').textContent = 'session';
    m.querySelector('.modal-audience').textContent = 'all visitors';
    m.querySelector('.modal-note').textContent = 'Animation density, motion preference, and grain intensity follow the device. This site does not set cookies. Press Esc, ×, or click outside to dismiss.';
    m.classList.add('is-open');
    document.body.classList.add('modal-on');
  });
}

function bindMadeCards() {
  document.querySelectorAll('.made-card').forEach((card) => {
    const num = card.querySelector('.made-num');
    const h = card.querySelector('h3');
    const p = card.querySelector('p:last-of-type');
    if (!h || !p) return;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const open = () => {
      const m = ensureModal();
      m.querySelector('.modal-num').textContent = '§ ' + (num ? num.textContent.trim() : '02');
      m.querySelector('.modal-comp').textContent = 'How we make it';
      m.querySelector('.modal-title').textContent = h.textContent.trim();
      m.querySelector('.modal-size').textContent = '';
      m.querySelector('.modal-price').textContent = 'standard';
      m.querySelector('.modal-unit').textContent = 'every SKU';
      m.querySelector('.modal-lead').textContent = 'in-house';
      m.querySelector('.modal-audience').textContent = 'production';
      m.querySelector('.modal-note').textContent = p.textContent.trim() + ' Close with ×, the overlay, or Escape.';
      m.hidden = false;
      m.classList.add('is-open');
      document.body.classList.add('modal-on');
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

function bindSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 70;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
}

function bindReveal() {
  const targets = document.querySelectorAll('.section-head, .sku, .made-card, .b2b-facts-block, .palette, .lead-list li');
  if (!('IntersectionObserver' in window) || !targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((t) => { t.classList.add('will-reveal'); io.observe(t); });
}

function bindGlobalKeys() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function bindWordmarkHome() {
  const wm = document.querySelector('.wordmark[href="#top"]');
  if (!wm) return;
  wm.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function init() {
  ensureModal();
  bindSkuButtons();
  bindSwatches();
  bindShareCounter();
  bindSettingsGear();
  bindMadeCards();
  bindSmoothScroll();
  bindReveal();
  bindGlobalKeys();
  bindWordmarkHome();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
