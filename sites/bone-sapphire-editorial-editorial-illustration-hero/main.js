// file: main.js
// Quacktory — interactive modal system, share counter, smooth scroll, scroll fades

const SHARE_CAP = 999;

const MODAL_DATA = {
  micro:    { title: 'Micro Line',     line: 'Micro',     size: '4–8 cm',    sub: 'Thumb-sized',              price: '$8 / unit',       lead: 'Today',         accent: '#C9BEE0', desc: 'Solid vulcanised rubber, keychain-grade. Food-grade silicone. Single-mould, single-piece. Drop-tested from 1 m.' },
  classic:  { title: 'Classic Line',   line: 'Classic',   size: '10–25 cm',  sub: 'Palm-sized',               price: '$24 / unit',      lead: '3 weeks',       accent: '#B58AB8', desc: 'Solid vulcanised rubber, single-mould. EPDM-natural compound. EN 71-3 compliant, REACH-clean. Hand-painted pupils.' },
  designer: { title: 'Designer Line',  line: 'Designer',  size: '15–30 cm',  sub: 'Cat-sized',                price: '$86 / unit',      lead: '6 weeks',       accent: '#C68A3C', desc: 'Solid vulcanised rubber, single-mould. Author-signed. Mass-pigmented, not paint-on-top. Predictable lead time.' },
  mega:     { title: 'Mega Line',      line: 'Mega',      size: '50–120 cm', sub: 'Child-sized',              price: '$640 / unit',     lead: '6 weeks',       accent: '#5A6A78', desc: 'Solid vulcanised rubber, single-mould. Pallet delivery. On-site survey available. Geometry within ±2%.' },
  architect:{ title: 'Architect Line', line: 'Architect', size: '1.5–3 m',   sub: 'Bear-sized · installation', price: 'On request',     lead: '12 weeks',      accent: '#7E63B3', desc: 'Solid vulcanised rubber, single-mould. Installation-class. Ultrasonic frame inspection on every unit.' }
};

const PILL_DATA = {
  '05 / Lines':                  { title: 'Five lines, one mould',     desc: 'Micro, Classic, Designer, Mega, Architect — the same duck, scaled by the same factor. Not a slightly larger one — the same one.', accent: '#7E63B3' },
  'Solid rubber':                { title: 'Solid vulcanised rubber',   desc: 'No inserts, no glued seams, no plastic inside. One piece. One mould. One material — food-grade for small, EPDM-natural for large.', accent: '#C68A3C' },
  'EN 71-3 · REACH':             { title: 'EN 71-3 · REACH',            desc: 'Toy-safe. No phthalates, no bisphenol A. Age-marked packaging. Indoor use only. −20 °C to +60 °C operating range.', accent: '#5A6A78' },
  'Vulcanised · single mould':   { title: 'Vulcanised · single mould',  desc: 'One master model. Production-grade rubber. Predictable lead time, predictable price. Five checks per unit.', accent: '#B58AB8' }
};

// ---- Build modal ----
const modal = document.createElement('div');
modal.className = 'q-modal';
modal.setAttribute('aria-hidden', 'true');
modal.innerHTML = `
  <div class="q-modal-overlay" data-close></div>
  <article class="q-modal-card" role="dialog" aria-modal="true" aria-labelledby="q-modal-title">
    <button class="q-modal-close" data-close aria-label="Close">×</button>
    <p class="q-modal-eyebrow" id="q-modal-eyebrow"></p>
    <h2 class="q-modal-title" id="q-modal-title"></h2>
    <div class="q-modal-grid">
      <div><span>Size</span><b id="q-modal-size"></b></div>
      <div><span>Format</span><b id="q-modal-sub"></b></div>
      <div><span>Price</span><b id="q-modal-price"></b></div>
      <div><span>Lead time</span><b id="q-modal-lead"></b></div>
    </div>
    <p class="q-modal-desc" id="q-modal-desc"></p>
    <footer class="q-modal-foot">
      <button class="q-share" data-share type="button" aria-label="Share this line">
        <span class="q-share-label">Share</span>
        <b class="q-share-count">0</b>
        <span class="q-share-cap">/ ${SHARE_CAP}</span>
      </button>
      <a class="q-modal-cta" href="#scale" data-close>Visit the line →</a>
    </footer>
  </article>
`;
modal.style.cssText = 'position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(15,15,18,0.78);backdrop-filter:blur(6px);';
document.body.appendChild(modal);

const modalCard  = modal.querySelector('.q-modal-card');
const eyebrow    = modal.querySelector('#q-modal-eyebrow');
const titleEl    = modal.querySelector('#q-modal-title');
const sizeEl     = modal.querySelector('#q-modal-size');
const subEl      = modal.querySelector('#q-modal-sub');
const priceEl    = modal.querySelector('#q-modal-price');
const leadEl     = modal.querySelector('#q-modal-lead');
const descEl     = modal.querySelector('#q-modal-desc');
const shareBtn   = modal.querySelector('.q-share');
const shareNum   = modal.querySelector('.q-share-count');

modalCard.style.cssText = 'position:relative;max-width:520px;width:100%;background:#1A1A1E;border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:32px;color:#C9BEE0;font-family:Inter,sans-serif;box-shadow:0 30px 80px rgba(0,0,0,0.6);transform:translateY(8px);transition:transform .35s cubic-bezier(.2,.8,.2,1);';
const closeBtn = modal.querySelector('.q-modal-close');
closeBtn.style.cssText = 'position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;background:transparent;border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:18px;line-height:1;cursor:pointer;';
modal.querySelector('.q-modal-eyebrow').style.cssText = 'font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8A8A8A;margin:0 0 12px;';
modal.querySelector('.q-modal-title').style.cssText = 'font-family:"Playfair Display",serif;font-weight:400;font-size:32px;line-height:1.05;color:#fff;margin:0 0 24px;letter-spacing:-0.02em;';
modal.querySelector('.q-modal-grid').style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:14px 24px;margin:0 0 22px;padding:18px 0;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);';
modal.querySelector('.q-modal-grid').querySelectorAll('div').forEach(d => {
  d.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
  d.querySelector('span').style.cssText = 'font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#8A8A8A;';
  d.querySelector('b').style.cssText = 'font-weight:400;font-size:13px;color:#fff;';
});
modal.querySelector('.q-modal-desc').style.cssText = 'font-size:13px;line-height:1.65;color:#BFBFBF;margin:0 0 24px;font-weight:300;';
modal.querySelector('.q-modal-foot').style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;';
shareBtn.style.cssText = 'display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:transparent;border:1px solid rgba(255,255,255,0.14);color:#fff;font-size:11px;letter-spacing:.05em;cursor:pointer;font-family:Inter,sans-serif;';
shareNum.style.cssText = 'font-weight:500;color:#C9BEE0;';
modal.querySelector('.q-modal-cta').style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:999px;background:#fff;color:#0F0F12;font-size:11px;font-weight:500;letter-spacing:.04em;text-decoration:none;';

let shareCount = 0;
let lastKey = null;

function openModal(key) {
  const d = MODAL_DATA[key];
  if (!d) return;
  lastKey = key;
  eyebrow.textContent = `Quacktory · Studio · ${d.line}`;
  titleEl.textContent  = d.title;
  sizeEl.textContent   = d.size;
  subEl.textContent    = d.sub;
  priceEl.textContent  = d.price;
  leadEl.textContent   = d.lead;
  descEl.textContent   = d.desc;
  modalCard.style.borderTop = `3px solid ${d.accent}`;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { modalCard.style.transform = 'translateY(0)'; });
  shareCount = 0;
  shareNum.textContent = '0';
}

function openCustom(d) {
  lastKey = null;
  eyebrow.textContent = 'Quacktory · Spec';
  titleEl.textContent  = d.title;
  sizeEl.textContent   = '—';
  subEl.textContent    = '—';
  priceEl.textContent  = '—';
  leadEl.textContent   = '—';
  descEl.textContent   = d.desc;
  modalCard.style.borderTop = `3px solid ${d.accent}`;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { modalCard.style.transform = 'translateY(0)'; });
  shareCount = 0;
  shareNum.textContent = '0';
}

function closeModal() {
  modalCard.style.transform = 'translateY(8px)';
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modal.addEventListener('click', e => {
  if (e.target.matches('[data-close]')) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
});

shareBtn.addEventListener('click', () => {
  if (shareCount >= SHARE_CAP) return;
  shareCount++;
  shareNum.textContent = shareCount;
  shareBtn.style.transform = 'scale(0.96)';
  setTimeout(() => { shareBtn.style.transform = ''; }, 120);
});

// ---- Cardstack cards (center column, hero) ----
document.querySelectorAll('.cardstack-card').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('.cardstack-card').forEach(x => x.classList.remove('is-front'));
    c.classList.add('is-front');
    openModal(c.dataset.line);
  });
  c.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); }
  });
});

// ---- Ladder steps (timeline rail) ----
document.querySelectorAll('.ladder-step').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.ladder-step').forEach(x => x.classList.remove('is-active'));
    s.classList.add('is-active');
    openModal(s.dataset.line);
  });
  s.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.click(); }
  });
});

// ---- Scene pills (floating tooltip labels) ----
document.querySelectorAll('.scene-pill').forEach(p => {
  p.addEventListener('click', () => {
    const text = p.textContent.trim();
    const d = PILL_DATA[text] || { title: 'Spec', desc: text, accent: '#7E63B3' };
    openCustom(d);
  });
  p.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.click(); }
  });
});

// ---- Topbar icon = settings ----
const tbi = document.querySelector('.topbar-icon');
if (tbi) {
  tbi.setAttribute('tabindex', '0');
  tbi.setAttribute('role', 'button');
  tbi.setAttribute('aria-label', 'Settings');
  tbi.addEventListener('click', () => {
    openCustom({
      title: 'Settings',
      desc: 'Theme is dark. Units are cm and m. Noise is silent. Preferences will be added in a future release — this award is for innovation in food & beverage design, with a bottle, not a settings panel.',
      accent: '#7E63B3'
    });
  });
  tbi.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tbi.click(); }
  });
}

// ---- Smooth scroll fallback ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const t = document.getElementById(id);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Scroll-triggered fades ----
const fadeTargets = document.querySelectorAll(
  '.hero-col, .ladder-step, .prod-card, .b2b-frame, .production-head, .ladder-head, .b2b-form'
);
fadeTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(14px)';
  el.style.transition = 'opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1)';
});

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
fadeTargets.forEach(el => io.observe(el));

// ---- Hero parallax on cardstack ----
const cardstack = document.getElementById('ladder');
if (cardstack) {
  let raf = null;
  window.addEventListener('mousemove', e => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      cardstack.style.transform = `translate(${x}px, ${y}px)`;
    });
  }, { passive: true });
}
