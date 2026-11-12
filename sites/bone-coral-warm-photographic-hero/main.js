// file: main.js
// Quacktory — editorial landing interactions
// Modal, share counter, scroll fades, smooth scroll

const DATA = {
  'micro-4':    { title:'MICRO · 4 cm',     sub:'Keyring «Big Thumb»',  size:'4 cm',   ed:'Micro',     yr:'2024', desc:'Keychain. Injection molding, 8 cavities, 45 sec/cycle.', color:'#E8553D' },
  'classic-25': { title:'CLASSIC · 25 cm',  sub:'XL Bath «Palma»',      size:'25 cm',  ed:'Classic',   yr:'2024', desc:'Solid rubber, black pupil + white sclera. Test: 5 drops from 1 m.', color:'#F5B82E' },
  'designer-30':{ title:'DESIGNER · 30 cm', sub:'Square Eyes, Soft Body',size:'30 cm', ed:'Designer',  yr:'2024', desc:'Studio Polyhedra × Quacktory. Limit 300 pcs.', color:'#0A0A0A' },
  'mega-120':   { title:'MEGA · 120 cm',    sub:'Photo «Lobby»',        size:'120 cm', ed:'Mega',      yr:'2024', desc:'Photo object for foyer. 2 h/cycle + 8 h cooling.', color:'#9A9A9A' },
  'arch-300':   { title:'ARCHITECT · 3 m',  sub:'Sculptural Install',   size:'3 m',    ed:'Architect', yr:'2024', desc:'Sculptural cast, steel frame, 12 weeks.', color:'#1A1A1A' },
  'pill-4':     { title:'MICRO · 4 cm',     sub:'«Big Thumb»',          size:'4 cm',   ed:'Micro',     yr:'2024', desc:'Keychain. Impulse purchase up to 500 ₽.', color:'#E8553D' },
  'pill-6':     { title:'MICRO · 6 cm',     sub:'Pocket «Egg»',         size:'6 cm',   ed:'Micro',     yr:'2024', desc:'Pocket duck. Not for children under 3 years.', color:'#E8553D' },
  'pill-8':     { title:'MICRO · 8 cm',     sub:'Charm «Tiny»',         size:'8 cm',   ed:'Micro',     yr:'2024', desc:'Pendant. Cardboard without polyethylene.', color:'#E8553D' },
  'pill-50':    { title:'MEGA · 50 cm',     sub:'Display «Pedestal»',   size:'50 cm',  ed:'Mega',      yr:'2024', desc:'Display duck. Rotational molding.', color:'#9A9A9A' },
  'pill-80':    { title:'MEGA · 80 cm',     sub:'Object «Stand»',       size:'80 cm',  ed:'Mega',      yr:'2024', desc:'Object duck. Reinforcing frame.', color:'#9A9A9A' },
  'pill-120':   { title:'MEGA · 120 cm',    sub:'Photo «Lobby»',        size:'120 cm', ed:'Mega',      yr:'2024', desc:'Photo object. Pallet delivery.', color:'#9A9A9A' }
};

// ---- inject styles ----
const style = document.createElement('style');
style.textContent = `
  .q-modal{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center}
  .q-modal[aria-hidden="false"]{display:flex}
  .q-modal__overlay{position:absolute;inset:0;background:rgba(10,10,10,.6);backdrop-filter:blur(6px);cursor:pointer}
  .q-modal__panel{position:relative;background:var(--bg,#F2C9B4);color:var(--fg,#1A1A1A);max-width:540px;width:calc(100% - 32px);padding:40px 32px;border-radius:4px;max-height:88vh;overflow:auto;box-shadow:0 24px 60px -20px rgba(0,0,0,.5)}
  .q-modal__close{position:absolute;top:8px;right:14px;background:none;border:0;font-size:32px;line-height:1;cursor:pointer;color:inherit}
  .q-modal__tag{font-size:10px;letter-spacing:.2em;opacity:.6;margin-bottom:8px}
  .q-modal__title{font-family:'Archivo','Arial Black',sans-serif;font-weight:900;letter-spacing:-.015em;font-size:42px;line-height:.95;margin-bottom:6px}
  .q-modal__sub{font-size:14px;margin-bottom:18px;opacity:.75}
  .q-modal__meta{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px;padding:14px 0;border-top:1px solid currentColor;border-bottom:1px solid currentColor}
  .q-modal__meta dt{font-size:9px;letter-spacing:.18em;opacity:.5;text-transform:uppercase}
  .q-modal__meta dd{font-size:15px;font-weight:700;margin:3px 0 0}
  .q-modal__desc{font-size:13px;line-height:1.6;margin-bottom:14px}
  .q-modal__accent{height:6px;margin-bottom:20px;border-radius:3px}
  .q-modal__share-btn{background:var(--accent,#E8553D);color:#fff;border:0;padding:12px 24px;font-size:11px;font-weight:700;letter-spacing:.16em;cursor:pointer;border-radius:999px;transition:transform .15s}
  .q-modal__share-btn:hover{transform:translateY(-2px)}
  .q-modal__share-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .q-fade{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
  .q-fade.is-in{opacity:1;transform:translateY(0)}
  .qm-stagger>*{opacity:0;transform:translateY(8px);animation:qmIn .45s ease forwards}
  .qm-stagger>*:nth-child(1){animation-delay:.05s}
  .qm-stagger>*:nth-child(2){animation-delay:.1s}
  .qm-stagger>*:nth-child(3){animation-delay:.15s}
  .qm-stagger>*:nth-child(4){animation-delay:.2s}
  .qm-stagger>*:nth-child(5){animation-delay:.25s}
  .qm-stagger>*:nth-child(6){animation-delay:.3s}
  .qm-stagger>*:nth-child(7){animation-delay:.35s}
  @keyframes qmIn{to{opacity:1;transform:translateY(0)}}
  .hero__scale-dot{cursor:pointer;transition:transform .2s}
  .hero__scale-dot:hover{transform:translateY(-4px) scale(1.12)}
  .hero__scale-dot.is-active b{color:var(--accent,#E8553D)}
  .card__pill{cursor:pointer;transition:transform .2s,box-shadow .2s}
  .card__pill:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(0,0,0,.15)}
  .card,.lifestyle__row,.lifestyle__main,.fullbleed{transition:transform .3s}
`;
document.head.appendChild(style);

// ---- build modal ----
const modal = document.createElement('div');
modal.className = 'q-modal';
modal.setAttribute('aria-hidden', 'true');
modal.innerHTML = `
  <div class="q-modal__overlay" data-close></div>
  <div class="q-modal__panel qm-stagger" role="dialog" aria-modal="true" aria-labelledby="qmTitle">
    <button class="q-modal__close" data-close aria-label="Close">×</button>
    <div class="q-modal__tag" id="qmTag">EDITION</div>
    <h2 class="q-modal__title" id="qmTitle">Title</h2>
    <p class="q-modal__sub" id="qmSub">Subtitle</p>
    <dl class="q-modal__meta">
      <div><dt>Size</dt><dd id="qmSize">—</dd></div>
      <div><dt>Edition</dt><dd id="qmEdition">—</dd></div>
      <div><dt>Year</dt><dd id="qmYear">—</dd></div>
    </dl>
    <p class="q-modal__desc" id="qmDesc">Description</p>
    <div class="q-modal__accent" id="qmAccent"></div>
    <button class="q-modal__share-btn" id="qmShare">SHARE 0 / 100</button>
  </div>`;
document.body.appendChild(modal);

let shareCount = 0;
const SHARE_CAP = 100;
let lastFocus = null;

function fillModal(d) {
  modal.querySelector('#qmTag').textContent = d.ed.toUpperCase() + ' EDITION';
  modal.querySelector('#qmTitle').textContent = d.title;
  modal.querySelector('#qmSub').textContent = d.sub;
  modal.querySelector('#qmSize').textContent = d.size;
  modal.querySelector('#qmEdition').textContent = d.ed;
  modal.querySelector('#qmYear').textContent = d.yr;
  modal.querySelector('#qmDesc').textContent = d.desc;
  modal.querySelector('#qmAccent').style.background = d.color;
  shareCount = 0;
  updateShare();
  // re-trigger stagger
  const p = modal.querySelector('.q-modal__panel');
  p.classList.remove('qm-stagger');
  void p.offsetWidth;
  p.classList.add('qm-stagger');
}

function openModal(key) {
  const d = DATA[key];
  if (!d) return;
  lastFocus = document.activeElement;
  fillModal(d);
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.q-modal__close').focus();
}
function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
function updateShare() {
  const btn = modal.querySelector('#qmShare');
  if (shareCount >= SHARE_CAP) { btn.disabled = true; btn.textContent = 'SHARED · CAP REACHED'; }
  else btn.textContent = 'SHARE ' + shareCount + ' / ' + SHARE_CAP;
}

modal.querySelector('#qmShare').addEventListener('click', () => {
  if (shareCount < SHARE_CAP) { shareCount++; updateShare(); }
});
modal.addEventListener('click', e => { if (e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

// ---- wire scale dots (timeline rail) ----
const scaleKeys = ['micro-4','classic-25','designer-30','mega-120','arch-300'];
document.querySelectorAll('.hero__scale-dot').forEach((dot, i) => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.hero__scale-dot').forEach(d => d.classList.remove('is-active'));
    dot.classList.add('is-active');
    if (scaleKeys[i]) openModal(scaleKeys[i]);
  });
});

// ---- wire tooltip pills ----
document.querySelectorAll('.card__pill').forEach(pill => {
  const m = pill.textContent.match(/(\d+)\s*cm/);
  if (m && DATA['pill-' + m[1]]) pill.addEventListener('click', () => openModal('pill-' + m[1]));
});

// ---- wire cards / lifestyle rows / fullbleed ----
function openByCard(card) {
  const section = card.closest('.band');
  const label = section ? section.querySelector('.section__label')?.textContent.replace('///','').trim() : 'CARD';
  const titleEl = card.querySelector('.card__title, .lifestyle__title, h3, h4');
  const title = titleEl ? titleEl.textContent.replace(/\s+/g,' ').trim() : label;
  const descEl = card.querySelector('.lifestyle__desc, .fullbleed__caption p');
  const desc = descEl ? descEl.textContent.trim() : card.textContent.trim().slice(0, 180);
  const matchKey = Object.keys(DATA).find(k => title.toLowerCase().includes(DATA[k].sub.toLowerCase().replace(/[«»"]/g,'').split(' ')[0]));
  if (matchKey) openModal(matchKey);
  else {
    fillModal({ ed: label, title, sub: '', size: '—', yr: '2024', desc, color: '#E8553D' });
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
}
document.querySelectorAll('.card, .lifestyle__row, .lifestyle__main, .fullbleed').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', e => {
    if (e.target.closest('a') && !e.target.closest('.card__pill')) return;
    openByCard(card);
  });
});

// ---- scroll fade-in ----
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.band, .card, .lifestyle__row, .lifestyle__main, .fullbleed').forEach(el => { el.classList.add('q-fade'); io.observe(el); });

// ---- smooth-scroll fallback for in-page anchors ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });
});
