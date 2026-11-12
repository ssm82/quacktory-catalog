// file: main.js
const SKUS = {
  micro:     { title:'Micro',     sku:'MICRO',            size:'4 cm',  edition:'Thumb-sized',  year:'2018', color:'#A4B5BC', desc:'Keychain, merch, gifts up to ~$10. Injection-moulded food-grade silicone. Lead time: today.', role:'KEYCHAIN' },
  classic:   { title:'Classic',   sku:'CLASSIC',          size:'18 cm', edition:'Hand-sized',   year:'2019', color:'#D9CDBE', desc:'Kids, bathroom, office. Compression-moulded food-grade silicone. Lead time: 3 weeks.', role:'BATHROOM' },
  designer:  { title:'Designer',  sku:'DESIGNER · WINNER',size:'30 cm', edition:'Cat-sized',    year:'2021', color:'#C9A876', desc:'Illustrator collabs, limited runs. Hand-cast in silicone moulds. Lead time: 6 weeks.', role:'WINNER' },
  mega:      { title:'Mega',      sku:'MEGA',             size:'80 cm', edition:'Child-sized',  year:'2023', color:'#B85A4A', desc:'Photo object, shop window, statement gift. Rotational mould with internal fibreglass frame.', role:'STATEMENT' },
  architect: { title:'Architect', sku:'ARCHITECT',        size:'3 m',   edition:'Bear-sized',   year:'2025', color:'#0E1014', desc:'Sculptural casting against a CNC-milled polystyrene master. Installation piece.', role:'INSTALL' }
};

// Build shared modal markup
function buildModal(id) {
  const m = document.createElement('div');
  m.className = 'modal'; m.id = id; m.setAttribute('aria-hidden', 'true');
  m.innerHTML = `
    <div class="modal-overlay" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true">
      <button class="modal-close" data-close aria-label="Close">×</button>
      <span class="modal-eyebrow"></span>
      <h2 class="modal-title"></h2>
      <div class="modal-grid">
        <div class="modal-block"><span>Size</span><strong data-f="size"></strong></div>
        <div class="modal-block"><span>Edition</span><strong data-f="edition"></strong></div>
        <div class="modal-block"><span>Year</span><strong data-f="year"></strong></div>
        <div class="modal-block"><span>Role</span><strong data-f="role"></strong></div>
      </div>
      <p class="modal-desc" data-f="desc"></p>
      <div class="modal-actions">
        <span class="modal-swatch" data-f="swatch"></span>
        <button class="modal-share" data-share>Share <span data-f="count">0</span>/50</button>
      </div>
    </div>`;
  document.body.appendChild(m);
  return m;
}

const modal = buildModal('duck-modal');
const settingsModal = buildModal('settings-modal');
settingsModal.querySelector('.modal-eyebrow').textContent = 'SETTINGS';
settingsModal.querySelector('.modal-title').textContent = 'Preferences';
settingsModal.querySelector('.modal-desc').textContent = 'This catalog page is intentionally fixed — no preferences are exposed. The hero, palette, and SKU grid are tuned by us, not by you.';
settingsModal.querySelector('.modal-actions').remove();

let shareCount = 0;
const SHARE_CAP = 50;
let lastData = null;

function fillModal(m, data) {
  m.querySelector('.modal-eyebrow').textContent = data.sku;
  m.querySelector('.modal-title').textContent = data.title;
  m.querySelector('[data-f="size"]').textContent = data.size;
  m.querySelector('[data-f="edition"]').textContent = data.edition;
  m.querySelector('[data-f="year"]').textContent = data.year;
  m.querySelector('[data-f="role"]').textContent = data.role;
  m.querySelector('[data-f="desc"]').textContent = data.desc;
  const sw = m.querySelector('[data-f="swatch"]');
  if (sw) sw.style.background = data.color;
  const cnt = m.querySelector('[data-f="count"]');
  if (cnt) cnt.textContent = shareCount;
  const btn = m.querySelector('[data-share]');
  if (btn) btn.disabled = shareCount >= SHARE_CAP;
}

function openModal(skuKey, source) {
  const data = SKUS[skuKey];
  if (!data) return;
  lastData = data;
  fillModal(modal, data);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  if (source && source.classList.contains('row')) {
    document.querySelectorAll('.row').forEach(r => r.classList.remove('row--active'));
    source.classList.add('row--active');
  }
}

function closeModal(m) { m.classList.remove('is-open'); m.setAttribute('aria-hidden','true'); document.body.classList.remove('is-locked'); }
function closeAnyModal() { if (modal.classList.contains('is-open')) closeModal(modal); if (settingsModal.classList.contains('is-open')) closeModal(settingsModal); }

[modal, settingsModal].forEach(m => {
  m.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) closeModal(m); });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAnyModal(); });

modal.querySelector('[data-share]').addEventListener('click', e => {
  e.stopPropagation();
  if (shareCount >= SHARE_CAP) return;
  shareCount++;
  modal.querySelector('[data-f="count"]').textContent = shareCount;
  if (shareCount >= SHARE_CAP) e.currentTarget.disabled = true;
});

// Bind every clickable subject
document.querySelectorAll('[data-sku]').forEach(el => {
  el.addEventListener('click', e => {
    if (el.tagName === 'A') e.preventDefault();
    openModal(el.getAttribute('data-sku'), el);
  });
});
document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); openModal(el.getAttribute('data-modal'), null); });
});

// Settings gear
const gear = document.createElement('button');
gear.className = 'settings-gear';
gear.setAttribute('aria-label', 'Settings');
gear.innerHTML = '⚙';
gear.addEventListener('click', () => {
  settingsModal.classList.add('is-open');
  settingsModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
});
document.body.appendChild(gear);

// Smooth scroll fallback
if (!('scrollBehavior' in document.documentElement.style)) {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
      }
    });
  });
}

// Scroll reveals
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.sku-card, .ladder-step, .prod-block, .manifesto-line').forEach(el => { el.classList.add('reveal'); io.observe(el); });

// Pill click feedback
document.querySelectorAll('.pill').forEach(p => {
  p.addEventListener('click', e => { e.stopPropagation(); });
});

// Modal + reveal + gear styles (injected so CSS file stays clean)
const css = document.createElement('style');
css.textContent = `
  .modal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:2rem;font-family:'Inter',sans-serif}
  .modal.is-open{display:flex}
  .modal-overlay{position:absolute;inset:0;background:rgba(14,16,20,.55);backdrop-filter:blur(8px);cursor:pointer}
  .modal-card{position:relative;background:#fff;width:min(92%,520px);padding:2.6rem 2.2rem 2rem;animation:modalIn .35s ease}
  @keyframes modalIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
  .modal-close{position:absolute;top:1rem;right:1rem;width:36px;height:36px;font-size:1.4rem;line-height:1;background:#F4F4F6;border-radius:50%;transition:transform .25s}
  .modal-close:hover{transform:rotate(90deg)}
  .modal-eyebrow{font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;color:#6E7378;font-weight:600;display:block;margin-bottom:.6rem}
  .modal-title{font-family:'Archivo',sans-serif;font-weight:900;font-size:2.1rem;letter-spacing:-.01em;margin-bottom:1.4rem;color:#0E1014}
  .modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-bottom:1.4rem}
  .modal-block{background:#F4F4F6;padding:.9rem 1rem;display:flex;flex-direction:column;gap:.2rem}
  .modal-block span{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:#6E7378}
  .modal-block strong{font-family:'Archivo',sans-serif;font-weight:800;font-size:1.05rem;color:#0E1014}
  .modal-desc{font-size:.92rem;line-height:1.6;color:#3E4A52;margin-bottom:1.6rem}
  .modal-actions{display:flex;align-items:center;justify-content:space-between;gap:1rem}
  .modal-swatch{width:28px;height:28px;border-radius:50%;border:1px solid rgba(0,0,0,.08)}
  .modal-share{background:#0E1014;color:#fff;padding:.75rem 1.2rem;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;transition:transform .2s,opacity .2s}
  .modal-share:hover{transform:translateY(-2px)}.modal-share:disabled{opacity:.4;cursor:not-allowed}
  body.is-locked{overflow:hidden}
  .settings-gear{position:fixed;bottom:1.6rem;right:1.6rem;width:48px;height:48px;border-radius:50%;background:#0E1014;color:#fff;font-size:1.3rem;z-index:90;display:flex;align-items:center;justify-content:center;transition:transform .4s;box-shadow:0 6px 22px rgba(0,0,0,.22)}
  .settings-gear:hover{transform:rotate(60deg) scale(1.05)}
  .reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
  .reveal.is-in{opacity:1;transform:translateY(0)}
  .sku-card.reveal:nth-child(2),.ladder-step.reveal:nth-child(2){transition-delay:.06s}
  .sku-card.reveal:nth-child(3),.ladder-step.reveal:nth-child(3){transition-delay:.12s}
  .sku-card.reveal:nth-child(4),.ladder-step.reveal:nth-child(4){transition-delay:.18s}
  .sku-card.reveal:nth-child(5),.ladder-step.reveal:nth-child(5){transition-delay:.24s}
`;
document.head.appendChild(css);
