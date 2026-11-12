// file: main.js
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // ---------- Modal ----------
  const modal = document.createElement('div');
  modal.className = 'qk-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="qk-modal__overlay" data-close></div>
    <div class="qk-modal__panel" role="dialog" aria-modal="true" aria-label="Object details">
      <button class="qk-modal__close" data-close aria-label="Close">×</button>
      <span class="qk-modal__eyebrow"></span>
      <h2 class="qk-modal__title"></h2>
      <p class="qk-modal__desc"></p>
      <dl class="qk-modal__facts"></dl>
      <div class="qk-modal__foot">
        <span class="qk-modal__accent"></span>
        <span class="qk-modal__share-label">Shares</span>
        <span class="qk-modal__share-count">0</span>
        <button class="qk-modal__share">+ Share</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const css = document.createElement('style');
  css.textContent = `
    .qk-modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center}
    .qk-modal.is-open{display:flex}
    .qk-modal__overlay{position:absolute;inset:0;background:rgba(0,0,0,.72)}
    .qk-modal__panel{position:relative;background:var(--bg);color:var(--ink);border:1px solid var(--ink);max-width:560px;width:calc(100% - 40px);padding:28px 30px 22px;animation:qk-in .35s cubic-bezier(.22,1,.36,1)}
    .qk-modal__close{position:absolute;top:8px;right:12px;font-size:28px;line-height:1;padding:4px 10px;font-family:var(--display)}
    .qk-modal__eyebrow{font-size:10px;letter-spacing:.22em;text-transform:uppercase;opacity:.7;display:block;margin-bottom:6px}
    .qk-modal__title{font-family:var(--display);font-size:42px;line-height:.9;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:10px}
    .qk-modal__desc{font-size:13px;line-height:1.55;margin-bottom:14px}
    .qk-modal__facts{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:12px;letter-spacing:.04em;margin-bottom:16px}
    .qk-modal__facts dt{font-weight:700;text-transform:uppercase}
    .qk-modal__facts dd{opacity:.85}
    .qk-modal__foot{display:flex;align-items:center;gap:10px;padding-top:12px;border-top:1px solid var(--ink);font-size:11px;letter-spacing:.18em;text-transform:uppercase}
    .qk-modal__accent{width:12px;height:12px;background:var(--ink);display:inline-block;margin-right:auto}
    .qk-modal__share{padding:6px 10px;border:1px solid var(--ink);background:transparent;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;transition:transform .2s ease-out}
    .qk-modal__share:hover{transform:translateY(-1px)}
    .qk-modal__share-count{font-weight:700;min-width:18px;text-align:center}
    .qk-modal__share-count.is-bump{animation:qk-bump .4s ease-out}
    @keyframes qk-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    @keyframes qk-bump{0%{transform:scale(1)}40%{transform:scale(1.4)}100%{transform:scale(1)}}
    .ladder__item.is-active{background:rgba(0,0,0,.04);outline:1px solid var(--ink);outline-offset:-1px}
    .reveal{opacity:0;transform:translateY(14px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
    .reveal.is-in{opacity:1;transform:none}
    @media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}.qk-modal__panel{animation:none}}
  `;
  document.head.appendChild(css);

  const SHARE_CAP = 99;
  const products = {
    micro:    {name:'Micro',     size:'4–8 cm',   compare:'thumb-sized',  price:'from $10',  lead:'3 weeks · MOQ 6+', method:'Injection · 8-cavity steel mould', cycle:'~45 s / cycle', accent:'#000000', desc:'A keychain duck, made in one piece. Sits on a bag strap, a belt loop, or a studio key rack.'},
    classic:  {name:'Classic',   size:'10–25 cm', compare:'hand-sized',   price:'from $24',  lead:'3 weeks · MOQ 3+', method:'Compression · aluminium mould',     cycle:'~3 min / cycle', accent:'#1a1a1a', desc:'The bathroom duck, remade without the seams. Single vulcanised body, pigmented eyes.'},
    designer: {name:'Designer',  size:'15–30 cm', compare:'cat-sized',    price:'from $89',  lead:'6 weeks · MOQ 6+', method:'Hand-cast in silicone rubber mould', cycle:'1 cycle / day',  accent:'#2a2a2a', desc:'A collaboration line. Same silhouette, signed sole, twelve pigment options.'},
    mega:     {name:'Mega',      size:'50–120 cm',compare:'child-sized',  price:'from $480', lead:'6 weeks · art object', method:'Rotational · steel split mould', cycle:'~2 h + 8 h cooling', accent:'#3a3a3a', desc:'Statement piece for studios, lobbies and product launches. Ships on a pallet.'},
    architect:{name:'Architect', size:'1.5–3 m',  compare:'bear-sized',   price:'on request',lead:'12 weeks · install', method:'Sculptural cast over CNC master', cycle:'2–4 weeks', accent:'#000000', desc:'A duck you install. A duck you walk around. Cast over a CNC master, finished by hand.'}
  };

  const panel = modal.querySelector('.qk-modal__panel');
  const titleEl = modal.querySelector('.qk-modal__title');
  const eyebrowEl = modal.querySelector('.qk-modal__eyebrow');
  const descEl = modal.querySelector('.qk-modal__desc');
  const factsEl = modal.querySelector('.qk-modal__facts');
  const accentEl = modal.querySelector('.qk-modal__accent');
  const countEl = modal.querySelector('.qk-modal__share-count');
  const shareBtn = modal.querySelector('.qk-modal__share');
  let currentShares = 0, lastTrigger = null;

  const open = (data, eyebrow, trigger) => {
    eyebrowEl.textContent = eyebrow;
    titleEl.textContent = data.name || 'Object';
    descEl.textContent = data.desc || '';
    accentEl.style.background = data.accent || '#000';
    factsEl.innerHTML = '';
    const fields = [
      ['Size', data.size], ['Compare', data.compare], ['Price', data.price],
      ['Lead', data.lead], ['Method', data.method], ['Cycle', data.cycle]
    ];
    fields.forEach(([k,v]) => { if(!v) return; factsEl.innerHTML += `<dt>${k}</dt><dd>${v}</dd>`; });
    currentShares = 0; countEl.textContent = '0';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lastTrigger = trigger || null;
    panel.querySelector('.qk-modal__close').focus();
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if(lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  };

  modal.addEventListener('click', e => { if(e.target.dataset.close !== undefined) close(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal.classList.contains('is-open')) close(); });

  shareBtn.addEventListener('click', () => {
    if(currentShares >= SHARE_CAP) return;
    currentShares++;
    countEl.textContent = currentShares;
    countEl.classList.remove('is-bump');
    void countEl.offsetWidth;
    countEl.classList.add('is-bump');
  });

  // ---------- Bind product ladder ----------
  $$('.ladder__item').forEach(item => {
    const sku = item.dataset.sku;
    const data = products[sku];
    if(!data) return;
    item.style.cursor = 'pointer';
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    const trigger = () => { $$('.ladder__item.is-active').forEach(n => n.classList.remove('is-active')); item.classList.add('is-active'); open(data, `Line · ${item.querySelector('.ladder__marker')?.textContent || ''}`, item); };
    item.addEventListener('click', trigger);
    item.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } });
  });

  // ---------- Bind hero corners ----------
  const cornerMap = { left: products.micro, right: products.architect };
  $$('.hero__corner').forEach(c => {
    const data = c.classList.contains('hero__corner--left') ? cornerMap.left : cornerMap.right;
    if(!data) return;
    c.style.cursor = 'pointer';
    c.tabIndex = 0;
    c.setAttribute('role', 'button');
    const trigger = () => open(data, 'Corner · Anchor', c);
    c.addEventListener('click', trigger);
    c.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } });
  });

  // ---------- Bind swatches ----------
  const swatchNames = ['Bone White','Signal Black','Pigment Ochre','Cobalt Slate','Tin Grey','Brick Rust','Forest Ink','Plum Black','Mustard','Slate Blue','Smoke','Off-Black'];
  $$('.b2b__swatch').forEach((sw, i) => {
    sw.style.cursor = 'pointer';
    sw.tabIndex = 0;
    sw.setAttribute('role', 'button');
    const data = {
      name: swatchNames[i] || sw.textContent.trim(),
      size: 'Tinted through body',
      compare: 'Pantone-equivalent',
      price: 'included in quote',
      lead: '+0 weeks vs. stock',
      method: 'Body-through pigment',
      cycle: 'additive to base cycle',
      accent: getComputedStyle(sw).backgroundColor || '#000',
      desc: 'Pigment mixed into the rubber before moulding. Not paint, not a sticker — the colour is the body.'
    };
    const trigger = () => open(data, 'TPM · ' + (i+1).toString().padStart(2,'0'), sw);
    sw.addEventListener('click', trigger);
    sw.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } });
  });

  // ---------- Settings gear (header) ----------
  const gear = document.createElement('button');
  gear.className = 'qk-gear';
  gear.setAttribute('aria-label', 'Settings');
  gear.innerHTML = '⚙';
  gear.style.cssText = 'background:transparent;border:1px solid var(--ink);width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;margin-left:14px;transition:transform .25s ease-out';
  gear.addEventListener('mouseenter', () => gear.style.transform = 'rotate(60deg)');
  gear.addEventListener('mouseleave', () => gear.style.transform = '');
  $('.meta-strip__right')?.appendChild(gear);
  gear.addEventListener('click', () => open({
    name: 'Settings', desc: 'Display, motion, and share preferences live here. Toggle the grain layer, switch between the Anton display and Inter body, or open the colophon.',
    accent: '#000'
  }, 'Site · Settings', gear));

  // ---------- Scroll reveal ----------
  if('IntersectionObserver' in window && !reduce){
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
    $$('.ladder__item, .production__row, .b2b__swatch, .footer__col').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i, 6) * 60) + 'ms';
      io.observe(el);
    });
  }

  // ---------- Smooth scroll fallback ----------
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id.length < 2) return;
      const t = $(id);
      if(!t) return;
      e.preventDefault();
      t.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
    });
  });
})();
