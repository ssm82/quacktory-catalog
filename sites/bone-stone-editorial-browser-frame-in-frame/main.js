// file: main.js
// Quacktory — Zorge 9 interactive layer
// Modal, smooth scroll, share counter, settings, reveal-on-scroll

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MODAL_DATA = {
  micro:    { title:'Quacktory Micro',    edition:'Line 01 / 05 · MMXXIV', size:'4–8 cm',     year:'MMXXIV', description:'Keychain, gift, merch. Injection mould, eight cavities per cycle. Recycled cardboard, no polyethylene. Not for children under three.', color:'#D4A574', price:'From $8',        lead:'Today'   },
  classic:  { title:'Quacktory Classic',  edition:'Line 02 / 05 · MMXXIV', size:'10–25 cm',   year:'MMXXIV', description:'Kids, bathroom, office desk. Aluminium mould, compression. Drop-tested five times from one metre onto concrete. EN 71-3, REACH.',        color:'#B08A6E', price:'From $24',       lead:'3 weeks' },
  designer: { title:'Quacktory Designer', edition:'Line 03 / 05 · MMXXIV', size:'15–30 cm',   year:'MMXXIV', description:'Limited runs, illustrator collabs. Hand-cast in silicone for runs ≤ 300. Paper certificate, embossed cardboard. A collector’s object.', color:'#8B3A3A', price:'From $68',       lead:'6 weeks' },
  mega:     { title:'Quacktory Mega',     edition:'Line 04 / 05 · MMXXIV', size:'50–120 cm',  year:'MMXXIV', description:'Shop-window, statement gift, gallery. Rotational mould with internal fibreglass frame. Pallet delivery, courier visit required. Not a toy.', color:'#3A5A6E', price:'From $640',      lead:'6 weeks' },
  architect:{ title:'Quacktory Architect',edition:'Line 05 / 05 · MMXXIV', size:'1.5–3 m',    year:'MMXXIV', description:'Lobbies, weddings, branded spaces. CNC-milled polystyrene master, fibreglass mould, internal steel frame. On-site survey, climate-controlled transport.', color:'#5A6A7A', price:'Price on request', lead:'12 weeks' },
  hero:     { title:'Lot 001 — Classic',  edition:'MMXXIV · Edition 01',   size:'240 mm',     year:'MMXXIV', description:'A single duck, photographed at Classic scale, on a papered surface, lit by a single window. Single-piece vulcanised rubber. Body-through pigment. No paint, no stickers, no seams.', color:'#B08A6E', price:'Manifesto — line 01 / 03', lead:'Open the manifesto' },
  settings: { title:'Settings',           edition:'Studio preferences',     size:'Display · Motion', year:'MMXXIV', description:'This site is best viewed with motion enabled, on a wide canvas, in dark mode. The duck is the same in every setting — the system is not. Reduce-motion is respected; the marble does not move; the wordmark does not animate on hover.', color:'#B08A6E', price:'v1.0 · MMXXIV', lead:'Single-piece vulcanised' }
};

function buildModal() {
  if (document.getElementById('qmodal')) return;
  const m = document.createElement('div');
  m.id = 'qmodal'; m.className = 'qmodal'; m.setAttribute('aria-hidden','true'); m.setAttribute('role','dialog');
  m.innerHTML = `
    <div class="qmodal__overlay" data-close="1"></div>
    <div class="qmodal__panel" role="document">
      <button class="qmodal__close" type="button" aria-label="Close" data-close="1">×</button>
      <div class="qmodal__head">
        <span class="qmodal__edition" data-field="edition"></span>
        <span class="qmodal__size" data-field="size"></span>
      </div>
      <h3 class="qmodal__title" data-field="title"></h3>
      <div class="qmodal__swatch"><span class="qmodal__dot" data-field="dot"></span><span data-field="colorName"></span></div>
      <p class="qmodal__desc" data-field="description"></p>
      <dl class="qmodal__meta">
        <div class="qmodal__row"><dt>Year</dt><dd data-field="year"></dd></div>
        <div class="qmodal__row"><dt>Scale</dt><dd data-field="size2"></dd></div>
        <div class="qmodal__row"><dt>Price</dt><dd data-field="price"></dd></div>
        <div class="qmodal__row"><dt>Lead</dt><dd data-field="lead"></dd></div>
      </dl>
    </div>`;
  document.body.appendChild(m);

  const css = document.createElement('style');
  css.textContent = `
    .qmodal{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;font-family:'Inter',system-ui,sans-serif}
    .qmodal[aria-hidden="false"]{display:flex}
    .qmodal__overlay{position:absolute;inset:0;background:rgba(0,0,0,.78);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
    .qmodal__panel{position:relative;max-width:560px;width:calc(100% - 48px);background:linear-gradient(180deg,#1A1A1A 0%,#0A0A0A 100%);border:1px solid rgba(176,138,110,.18);padding:48px 40px 36px;color:#fff;animation:qmodalIn 420ms cubic-bezier(.22,1,.36,1) both}
    @keyframes qmodalIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    .qmodal__close{position:absolute;top:14px;right:14px;width:36px;height:36px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,.18);font-size:20px;line-height:1;cursor:pointer;transition:background 200ms cubic-bezier(.22,1,.36,1)}
    .qmodal__close:hover{background:rgba(255,255,255,.06)}
    .qmodal__head{display:flex;justify-content:space-between;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.06)}
    .qmodal__title{font-family:'Playfair Display',serif;font-size:36px;font-weight:500;line-height:1.1;margin-bottom:18px;color:var(--modal-accent,#B08A6E)}
    .qmodal__swatch{display:flex;align-items:center;gap:10px;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:22px}
    .qmodal__dot{width:12px;height:12px;background:var(--modal-accent,#B08A6E);display:inline-block;border:1px solid rgba(255,255,255,.18)}
    .qmodal__desc{font-size:14px;line-height:1.65;color:rgba(255,255,255,.82);margin-bottom:26px;font-weight:300}
    .qmodal__meta{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;border-top:1px solid rgba(255,255,255,.06);padding-top:18px}
    .qmodal__row{display:flex;justify-content:space-between;gap:12px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)}
    .qmodal__row dt{color:rgba(255,255,255,.5)}
    .qmodal__row dd{color:#fff;text-align:right}
  `;
  document.head.appendChild(css);

  m.addEventListener('click', (e) => { if (e.target.dataset.close === '1') closeModal(); });
}

function openModal(key) {
  const data = MODAL_DATA[key];
  if (!data) return;
  const m = document.getElementById('qmodal');
  m.querySelector('[data-field="title"]').textContent = data.title;
  m.querySelector('[data-field="edition"]').textContent = data.edition;
  m.querySelector('[data-field="size"]').textContent = data.size;
  m.querySelector('[data-field="size2"]').textContent = data.size;
  m.querySelector('[data-field="description"]').textContent = data.description;
  m.querySelector('[data-field="year"]').textContent = data.year;
  m.querySelector('[data-field="price"]').textContent = data.price;
  m.querySelector('[data-field="lead"]').textContent = data.lead;
  m.querySelector('[data-field="dot"]').style.background = data.color;
  m.querySelector('[data-field="colorName"]').textContent = data.title;
  m.style.setProperty('--modal-accent', data.color);
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const m = document.getElementById('qmodal');
  if (!m) return;
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

function wireSubjects() {
  document.querySelectorAll('.ladder__step').forEach((step) => {
    step.addEventListener('click', () => {
      document.querySelectorAll('.ladder__step').forEach((s) => s.classList.remove('is-active'));
      step.classList.add('is-active');
      openModal(step.dataset.line);
    });
    step.style.cursor = 'pointer';
  });
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => openModal(card.dataset.line));
    card.style.cursor = 'pointer';
  });
  const heroMedia = document.querySelector('.hero__media');
  if (heroMedia) { heroMedia.addEventListener('click', () => openModal('hero')); heroMedia.style.cursor = 'pointer'; }
  document.querySelectorAll('.swatch').forEach((sw, i) => {
    sw.addEventListener('click', () => {
      const c = sw.style.getPropertyValue('--c') || '#000';
      MODAL_DATA['swatch_'+i] = {
        title: 'TPM Palette · ' + String(i+1).padStart(2,'0') + ' / 12',
        edition: 'Body-through pigment', size: c, year: 'MMXXIV',
        description: 'Twelve Pantone-equivalents, body-through pigment. No paint. No stickers. Pigment mixed into the rubber before moulding — the colour runs through the duck, not on top of it.',
        color: c, price: 'Standard palette', lead: 'Included in line price'
      };
      openModal('swatch_'+i);
    });
    sw.style.cursor = 'pointer';
  });
}

function wireSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      tgt.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function wireReveal() {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.wordmark, .ladder, .collection, .b2b, .card, .ladder__step');
  targets.forEach((el) => el.classList.add('qreveal'));
  const css = document.createElement('style');
  css.textContent = `.qreveal{opacity:0;transform:translateY(24px);transition:opacity 700ms cubic-bezier(.22,1,.36,1),transform 700ms cubic-bezier(.22,1,.36,1)}.qreveal.is-in{opacity:1;transform:translateY(0)}`;
  document.head.appendChild(css);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  targets.forEach((el) => io.observe(el));
}

function wireChrome() {
  const topbar = document.querySelector('.topbar__nav');
  if (!topbar || document.getElementById('qgear')) return;

  const gear = document.createElement('button');
  gear.id = 'qgear'; gear.type = 'button'; gear.className = 'qchrome';
  gear.setAttribute('aria-label', 'Settings');
  gear.innerHTML = '<span aria-hidden="true">⚙</span><span>Settings</span>';
  gear.addEventListener('click', () => openModal('settings'));
  topbar.appendChild(gear);

  const share = document.createElement('button');
  share.id = 'qshare'; share.type = 'button'; share.className = 'qchrome qshare';
  share.innerHTML = '<span class="qshare__label">Share</span><span class="qshare__count">0</span>';
  let count = 0; const cap = 5;
  share.addEventListener('click', () => {
    if (count >= cap) return;
    count++;
    share.querySelector('.qshare__count').textContent = count;
    share.classList.add('pulse'); setTimeout(() => share.classList.remove('pulse'), 350);
    if (count === cap) { share.classList.add('is-maxed'); share.querySelector('.qshare__label').textContent = 'Maxed'; }
  });
  topbar.appendChild(share);

  const css = document.createElement('style');
  css.textContent = `
    .qchrome{background:transparent;border:1px solid rgba(255,255,255,.18);color:#fff;padding:6px 10px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;font-family:'Inter',system-ui,sans-serif;transition:background 200ms cubic-bezier(.22,1,.36,1);margin-left:12px;display:inline-flex;align-items:center;gap:6px}
    .qchrome:hover{background:rgba(255,255,255,.06)}
    .qshare__count{background:#B08A6E;color:#000;padding:2px 6px;font-size:10px;min-width:18px;text-align:center;transition:transform 200ms cubic-bezier(.22,1,.36,1)}
    .qshare.pulse .qshare__count{transform:scale(1.18)}
    .qshare.is-maxed{opacity:.55;cursor:default}
  `;
  document.head.appendChild(css);
}

function init() {
  buildModal();
  wireSubjects();
  wireSmoothScroll();
  wireReveal();
  wireChrome();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
