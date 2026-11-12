// file: main.js

// === Modal shell ===
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
  <div class="modal__overlay" data-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button class="modal__close" data-close type="button" aria-label="Close">✕</button>
    <div class="modal__accent"></div>
    <div class="modal__num"></div>
    <h3 class="modal__title" id="modal-title"></h3>
    <div class="modal__meta"></div>
    <p class="modal__desc"></p>
    <div class="modal__share">
      <button class="modal__share-btn" type="button">↗ Share spec</button>
      <span class="modal__share-count" aria-live="polite">0 / 99</span>
    </div>
  </div>
`;
document.body.appendChild(modal);

// === Subject registry (taxonomy: size / edition / year) ===
const DATA = {
  micro:     { num:'M01', title:'Micro',     size:'4–8 cm',    edition:'Standard',  year:'2022', desc:'Keychains, merch, gifts. Impulse buy. ~$7, lead 3 weeks.', accent:'#5AB6FF' },
  classic:   { num:'M02', title:'Classic',   size:'10–25 cm',  edition:'Standard',  year:'2022', desc:'Kids, bath, office. The most popular line, lead 3 weeks.',          accent:'#1E6BFF' },
  designer:  { num:'M03', title:'Designer',  size:'15–30 cm',  edition:'Limited',   year:'2022', desc:'Collaborations and limited editions. Hand flask, lead 6 weeks.',   accent:'#4FA8FF' },
  mega:      { num:'M04', title:'Mega',      size:'50–120 cm', edition:'Premium',   year:'2022', desc:'Photo objects and window displays. Rotational molding, lead 6 weeks.',           accent:'#2A6FE0' },
  architect: { num:'M05', title:'Architect', size:'1.5–3 m',   edition:'Contract',  year:'2022', desc:'Installations, events, weddings. CNC master model, lead 12 weeks.',   accent:'#5AB6FF' },
  scale:     { num:'T-01', title:'Scale',     size:'4 cm → 3 m', edition:'System',   year:'2024', desc:'Lineup from 4 cm to 3 m. The body doesn’t scale linearly — each line is engineered separately.', accent:'#5AB6FF' },
  lines:     { num:'T-02', title:'Lines',     size:'5 SKU',     edition:'Catalog',   year:'2024', desc:'Five lines: Micro, Classic, Designer, Mega, Architect. One silhouette at different scales.',            accent:'#1E6BFF' },
  pigment:   { num:'T-03', title:'Pigment',   size:'12 Pantone-eq', edition:'TPM',    year:'2024', desc:'12 signature Pantone equivalents. Through-mass pigment before casting.',                              accent:'#4FA8FF' },
  lead:      { num:'T-04', title:'Lead',      size:'3–12 weeks',edition:'Schedule',  year:'2024', desc:'Production lead time from 3 weeks (Micro) to 12 weeks (Architect).',                                   accent:'#2A6FE0' },
  'ruler-start': { num:'R-0', title:'0 cm',   size:'Origin',    edition:'Scale',     year:'—',    desc:'Start of the scale. The smallest size — Micro, 4 cm.',                                                accent:'#5AB6FF' },
  'ruler-end':   { num:'R-3', title:'3 m',    size:'Apex',      edition:'Scale',     year:'—',    desc:'Apex of the scale. Architect, 1.5–3 m, contract production.',                                       accent:'#2A6FE0' },
  settings:  { num:'SYS',  title:'Settings',  size:'Display',   edition:'Preferences', year:'2024.11', desc:'Grid: on · Motion: reduced · Language: en · Theme: dark / blueprint · Catalog: 2024.11. Everything works as intended.', accent:'#4FA8FF' }
};

// === Open / close ===
let shareCount = 0;
const SHARE_CAP = 99;
const panel   = modal.querySelector('.modal__panel');
const elAccent= modal.querySelector('.modal__accent');
const elNum   = modal.querySelector('.modal__num');
const elTitle = modal.querySelector('.modal__title');
const elDesc  = modal.querySelector('.modal__desc');
const elMeta  = modal.querySelector('.modal__meta');
const elCount = modal.querySelector('.modal__share-count');

function openModal(key){
  const d = DATA[key];
  if(!d) return;
  elAccent.style.background = d.accent;
  elNum.textContent   = d.num;
  elTitle.textContent = d.title;
  elDesc.textContent  = d.desc;
  elMeta.innerHTML = `<span><b>Size</b> ${d.size}</span><span><b>Edition</b> ${d.edition}</span><span><b>Year</b> ${d.year}</span>`;
  elCount.textContent = `${shareCount} / ${SHARE_CAP}`;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

// === Share counter ===
modal.querySelector('.modal__share-btn').addEventListener('click', () => {
  if(shareCount < SHARE_CAP){
    shareCount++;
    elCount.textContent = `${shareCount} / ${SHARE_CAP}`;
  } else {
    elCount.textContent = `capped`;
  }
});

// === Ducks (timeline / lineup subjects) ===
document.querySelectorAll('.duck').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.duck').forEach(d => d.classList.remove('is-active'));
    el.classList.add('is-active');
    openModal(el.dataset.line);
  });
});

// === Hero callouts (tooltip pills) ===
document.querySelectorAll('.callout').forEach(el => {
  el.addEventListener('click', () => {
    const m = el.className.match(/callout--(\w+)/);
    if(m) openModal(m[1]);
  });
});

// === Timeline rail nodes ===
document.querySelectorAll('.lineup__ruler-mark').forEach(el => {
  el.addEventListener('click', () => {
    const key = el.classList.contains('lineup__ruler-mark--start') ? 'ruler-start' : 'ruler-end';
    el.classList.toggle('is-active');
    openModal(key);
  });
});

// === TPM color chips ===
document.querySelectorAll('.b2b__chips span').forEach(el => {
  el.addEventListener('click', () => openModal('pigment'));
});

// === Settings gear (appended to topnav) ===
const gear = document.createElement('button');
gear.type = 'button';
gear.className = 'topnav__item topnav__item--gear';
gear.setAttribute('aria-label', 'Settings');
gear.textContent = '⚙';
document.querySelector('.topnav').appendChild(gear);
gear.addEventListener('click', e => { e.preventDefault(); openModal('settings'); });

// === Modal close: button, overlay, Escape ===
modal.addEventListener('click', e => { if(e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// === Smooth scroll fallback ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if(!href || href.length < 2) return;
    const t = document.querySelector(href);
    if(t){
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === Scroll-triggered fade-in ===
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if(en.isIntersecting){
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.duck, .prod-card, .b2b__panel, .callout').forEach(el => io.observe(el));
