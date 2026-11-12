// file: main.js

// ============ INJECTED STYLES ============
const style = document.createElement('style');
style.textContent = `
  .modal { position: fixed; inset: 0; z-index: 1000; display: none; align-items: center; justify-content: center; }
  .modal.is-open { display: flex; }
  .modal-overlay { position: absolute; inset: 0; background: rgba(17,17,17,0.6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); cursor: pointer; }
  .modal-card { position: relative; max-width: 520px; width: calc(100% - 48px); background: #F2F0EA; color: #111; border-radius: 20px; padding: 40px 36px 32px; font-family: 'Inter', system-ui, sans-serif; box-shadow: 0 30px 80px rgba(0,0,0,0.35); overflow: hidden; }
  .modal-accent { position: absolute; top: 0; left: 0; right: 0; height: 6px; background: #C9B89E; transition: background 0.3s ease; }
  .modal-close { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border: none; background: transparent; font-size: 22px; cursor: pointer; color: #111; line-height: 1; font-family: inherit; }
  .modal-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #8A8A86; display: block; margin-bottom: 6px; font-family: 'Inter', sans-serif; }
  .modal-title { font-family: 'Anton', sans-serif; font-size: 32px; letter-spacing: 0.02em; margin: 0 0 14px; color: #111; line-height: 1.05; }
  .modal-desc { font-size: 14px; line-height: 1.6; color: #2A2A2A; margin: 0 0 20px; }
  .modal-meta { display: flex; flex-wrap: wrap; gap: 8px; }
  .modal-tag { display: inline-flex; gap: 5px; padding: 5px 11px; background: rgba(0,0,0,0.06); border-radius: 999px; font-size: 11px; color: #2A2A2A; }
  .modal-tag b { color: #8A8A86; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
  .scale-item.is-active { outline: 2px solid #C9B89E; outline-offset: 4px; border-radius: 8px; }
  .reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.2,.8,.2,1); }
  .reveal.is-in { opacity: 1; transform: none; }
  .faq-icon { transition: transform 0.3s ease; display: inline-block; }
  .hero-pill, .scale-item, .spec-row, .prod-block, .swatch, .faq-item, .hero-viewer { cursor: pointer; }
  @media (max-width: 720px) {
    .modal-card { padding: 32px 24px 24px; }
    .modal-title { font-size: 26px; }
  }
`;
document.head.appendChild(style);

// ============ MODAL ============
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
  <div class="modal-overlay" data-close></div>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="m-title">
    <div class="modal-accent"></div>
    <button class="modal-close" data-close aria-label="Close">×</button>
    <span class="modal-eyebrow" id="m-eyebrow"></span>
    <h3 class="modal-title" id="m-title"></h3>
    <p class="modal-desc"></p>
    <div class="modal-meta"></div>
  </div>
`;
document.body.appendChild(modal);
const mAccent = modal.querySelector('.modal-accent');
const mEyebrow = modal.querySelector('.modal-eyebrow');
const mTitle = modal.querySelector('.modal-title');
const mDesc = modal.querySelector('.modal-desc');
const mMeta = modal.querySelector('.modal-meta');

function openModal(d) {
  mAccent.style.background = d.accent;
  mEyebrow.textContent = d.eyebrow || 'Quacktory';
  mTitle.textContent = d.title;
  mDesc.textContent = d.desc;
  mMeta.innerHTML = '';
  Object.entries(d.meta).forEach(([k, v]) => {
    const tag = document.createElement('span');
    tag.className = 'modal-tag';
    tag.innerHTML = `<b>${k}</b><span>${v}</span>`;
    mMeta.appendChild(tag);
  });
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}
modal.addEventListener('click', e => { if (e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

// ============ DATA: ACCENT MAP ============
const ACCENTS = {
  'size-micro': '#FFD93D',
  'size-classic': '#6BCBEF',
  'size-designer': '#FF6B9D',
  'size-mega': '#F4A261',
  'size-architect': '#6B8E9E',
  'pill-tan': '#C9B89E',
  'pill-dark': '#2A2A2A'
};

// ============ HERO PILLS (tooltip pills) ============
document.querySelectorAll('.hero-pill').forEach(p => {
  const isTan = p.classList.contains('pill-tan');
  p.addEventListener('click', () => openModal({
    title: isTan ? 'Manifesto' : 'Scale Range',
    desc: isTan
      ? 'Serious ducks for not-so-serious people. The Quacktory brand credo.'
      : 'Five lines: from 4 cm (Micro) to 3 m (Architect). One silhouette — different scenarios.',
    accent: ACCENTS[isTan ? 'pill-tan' : 'pill-dark'],
    eyebrow: 'Hero Pill',
    meta: { tag: isTan ? 'Brand' : 'Range', size: isTan ? '—' : '4 cm — 3 m' }
  }));
});

// ============ HERO 3D VIEWER ============
const viewer = document.querySelector('.hero-viewer');
if (viewer) {
  viewer.addEventListener('click', () => openModal({
    title: '3D Viewer',
    desc: 'Interactive product viewer. In the demo: a static render of the Architect duck, credit Filiz Uzun.',
    accent: '#C9B89E',
    eyebrow: 'Viewer',
    meta: { type: '3D', control: 'Orbit', state: 'Static demo' }
  }));
}

// ============ SCALE TIMELINE NODES ============
document.querySelectorAll('.scale-item').forEach(item => {
  const key = [...item.classList].find(c => c.startsWith('size-'));
  const accent = ACCENTS[key] || '#C9B89E';
  const name = item.querySelector('.scale-name').textContent;
  const size = item.querySelector('.size').textContent;
  const meta = item.querySelector('.meta').textContent;
  const num = item.querySelector('.scale-num').textContent;
  item.addEventListener('click', () => {
    document.querySelectorAll('.scale-item.is-active').forEach(n => n.classList.remove('is-active'));
    item.classList.toggle('is-active');
    openModal({
      title: name,
      desc: `Line ${name}. ${size}.`,
      accent,
      eyebrow: `Line /${num}`,
      meta: { line: name, size, lead: meta }
    });
  });
});

// ============ SPEC ROWS ============
document.querySelectorAll('.spec-row').forEach((row, i) => {
  const label = row.querySelector('.spec-label').textContent;
  const value = row.querySelector('.spec-value').textContent;
  row.addEventListener('click', () => openModal({
    title: label,
    desc: value,
    accent: '#C9B89E',
    eyebrow: 'Spec /' + String(i + 1).padStart(2, '0'),
    meta: { type: 'Spec', line: label, idx: i + 1 }
  }));
});

// ============ PRODUCTION BLOCKS ============
document.querySelectorAll('.prod-block').forEach(block => {
  const t = block.querySelector('h3').textContent;
  const d = block.querySelector('p').textContent;
  const n = block.querySelector('.prod-num').textContent;
  block.addEventListener('click', () => openModal({
    title: t,
    desc: d,
    accent: '#C9B89E',
    eyebrow: 'Production ' + n,
    meta: { type: 'Process', stage: n, name: t }
  }));
});

// ============ SWATCHES ============
document.querySelectorAll('.swatch').forEach(sw => {
  const c = sw.style.getPropertyValue('--c').trim() || '#C9B89E';
  const name = sw.getAttribute('title') || 'TPM';
  sw.addEventListener('click', () => openModal({
    title: `TPM · ${name}`,
    desc: 'Through-body pigment, not a surface paint. A base color from the Quacktory Pigment Menu palette.',
    accent: c,
    eyebrow: 'Pigment',
    meta: { type: 'Color', color: c, menu: 'TPM' }
  }));
});

// ============ FAQ ============
document.querySelectorAll('.faq-item').forEach(item => {
  const icon = item.querySelector('.faq-icon');
  if (icon && item.open) icon.style.transform = 'rotate(45deg)';
  item.addEventListener('click', () => openModal({
    title: item.querySelector('.faq-q').textContent,
    desc: item.querySelector('p').textContent,
    accent: '#C9B89E',
    eyebrow: 'FAQ ' + item.querySelector('.faq-num').textContent,
    meta: { type: 'FAQ', num: item.querySelector('.faq-num').textContent }
  }));
  item.addEventListener('toggle', () => {
    if (icon) icon.style.transform = item.open ? 'rotate(45deg)' : '';
  });
});

// ============ SMOOTH SCROLL FALLBACK ============
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============ SCROLL REVEAL ============
const io = new IntersectionObserver(es => {
  es.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section-heading, .scale-item, .prod-block, .faq-item, .b2b-list li, .podium-frame, .b2b-palette, .feature-grid > div, .faq > h2, .production > p')
  .forEach(el => { el.classList.add('reveal'); io.observe(el); });