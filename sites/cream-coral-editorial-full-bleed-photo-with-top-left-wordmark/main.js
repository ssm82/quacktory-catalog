// file: main.js
(function () {
  'use strict';

  // ========== DATA ==========
  const skus = [
    { num: '(01)', name: 'Micro',      size: '4–8 cm',   compare: 'thumb-sized',   aud: 'Keychains, merch, impulse gifts under ~$7.', price: 'from $4',     priceMeta: 'pc · shipping included', meta: 'Lead 3 weeks · 6+ (4 cm — not for children under 3)', accent: '#E84A1D', accentName: 'Quack Orange', edition: '2025', collection: 'Stock' },
    { num: '(02)', name: 'Classic',    size: '10–25 cm', compare: 'coffee-mug sized', aud: 'Kids, bath, desk. The brand\'s baseline scale.', price: 'from $20',  priceMeta: 'pc · shipping included', meta: 'Lead 3 weeks · 3+',                              accent: '#1A1A1F', accentName: 'Studio Ink',   edition: '2025', collection: 'Stock' },
    { num: '(03)', name: 'Designer',   size: '15–30 cm', compare: 'cat-sized',           aud: 'Collab drops with illustrators. Limited, numbered editions.', price: 'from $65',  priceMeta: 'pc · shipping included', meta: 'Lead 6 weeks · 6+ (collectible object)',        accent: '#3C5572', accentName: 'Slate Blue',   edition: '2024', collection: 'Limited' },
    { num: '(04)', name: 'Mega',       size: '50–120 cm',compare: 'child-sized',         aud: 'Photo objects, window displays, statement gifts.', price: 'from $330', priceMeta: 'pallet shipping',   meta: 'Lead 6 weeks · Not a toy. Decorative object.',  accent: '#B5945A', accentName: 'Brass Museum', edition: '2024', collection: 'Studio' },
    { num: '(05)', name: 'Architect',  size: '1.5–3 m',  compare: 'bear-sized',         aud: 'Installations, events, weddings, branded spaces.', price: 'Price on request', priceMeta: 'product passport',  meta: 'Lead 12 weeks · Installed by a certified crew', accent: '#1E8FFF', accentName: 'Electric Wave', edition: '2025', collection: 'Bespoke' }
  ];

  const pigments = [
    { name: 'Quack Orange',  code: 'TPM 01', hex: '#E84A1D', desc: 'Signal orange. Heritage of rescue-vest high-vis.' },
    { name: 'Studio Ink',    code: 'TPM 02', hex: '#1A1A1F', desc: 'Deep neutral graphite. The base tone for every photo shoot.' },
    { name: 'Foam Cream',    code: 'TPM 03', hex: '#F5F4EF', desc: 'Warm off-white. The backdrop for catalog spreads.' },
    { name: 'Slate Blue',    code: 'TPM 04', hex: '#3C5572', desc: 'Grey-blue slate. The archival mark.' },
    { name: 'Brass Museum',  code: 'TPM 05', hex: '#B5945A', desc: 'Brass. A warm metallic accent.' },
    { name: 'Electric Wave', code: 'TPM 06', hex: '#1E8FFF', desc: 'Electric blue. 2024 promo series.' },
    { name: 'Mint Pool',     code: 'TPM 07', hex: '#7FBFB3', desc: 'Mint. Spring limited edition.' },
    { name: 'Plaster Grey',  code: 'TPM 08', hex: '#9A9A95', desc: 'Plaster grey. Studio background.' },
    { name: 'Coral Bloom',   code: 'TPM 09', hex: '#F0856B', desc: 'Coral. Illustrator limited drops.' },
    { name: 'Carbon Black',  code: 'TPM 10', hex: '#0D0D10', desc: 'Carbon black. Deep, no blue cast.' },
    { name: 'Bone White',    code: 'TPM 11', hex: '#E8E2D5', desc: 'Bone white. Warm, not cool.' },
    { name: 'Forest Tone',   code: 'TPM 12', hex: '#2A4A3A', desc: 'Forest tone. Autumn archive.' }
  ];

  // ========== MODAL ==========
  const SHARE_CAP = 99;
  let modal = null, lastFocus = null, shareCount = 0;

  function ensureModal() {
    if (modal) return modal;
    const style = document.createElement('style');
    style.textContent = `
      .q-modal{position:fixed;inset:0;z-index:100;background:rgba(13,21,37,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .3s ease}
      .q-modal.is-open{opacity:1;pointer-events:auto}
      .q-modal__panel{background:#F5F4EF;color:#101828;max-width:560px;width:100%;position:relative;transform:translateY(20px) scale(.98);transition:transform .35s cubic-bezier(.2,.7,.2,1);border:1px solid rgba(16,24,40,.18)}
      .q-modal.is-open .q-modal__panel{transform:translateY(0) scale(1)}
      .q-modal__close{position:absolute;top:12px;right:14px;width:36px;height:36px;border:none;background:transparent;font-size:26px;line-height:1;cursor:pointer;color:#101828;font-family:inherit}
      .q-modal__close:hover{opacity:.55}
      .q-modal__inner{padding:36px 32px 26px}
      .q-modal__eyebrow{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#9A9A95;font-weight:500;display:block;margin-bottom:10px}
      .q-modal__title{font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:clamp(40px,6vw,72px);line-height:.9;letter-spacing:-.005em;text-transform:uppercase;margin-bottom:18px}
      .q-modal__body{font-size:14px;line-height:1.6;color:#3a3a40}
      .q-modal__body p{margin-bottom:10px}
      .q-modal__body strong{color:#101828;font-weight:600}
      .q-modal__foot{margin-top:22px;padding-top:16px;border-top:1px solid rgba(16,24,40,.12);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
      .q-modal__accent{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#9A9A95}
      .q-modal__accent::before{content:'';width:14px;height:14px;background:var(--accent-c,#1A1A1F);display:inline-block}
      .q-modal__share{display:inline-flex;align-items:center;gap:10px;border:1px solid #101828;background:transparent;color:#101828;padding:9px 14px;font:inherit;font-size:11px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:background .2s,color .2s}
      .q-modal__share:hover{background:#101828;color:#F5F4EF}
      .q-modal__share-count{font-variant-numeric:tabular-nums;font-weight:600;min-width:1.5em;text-align:right}
      .q-modal__share.is-capped{opacity:.5;cursor:default}
      .q-modal__share.is-capped:hover{background:transparent;color:#101828}
      .q-gear{position:fixed;left:20px;bottom:20px;z-index:60;width:46px;height:46px;border-radius:50%;border:1px solid rgba(16,24,40,.25);background:rgba(245,244,239,.92);backdrop-filter:blur(6px);color:#101828;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .4s,background .2s,color .2s,border-color .2s;box-shadow:0 6px 18px rgba(16,24,40,.12)}
      .q-gear:hover{transform:rotate(60deg);background:#101828;color:#EEEAE2;border-color:#101828}
      .sku,.scale__step,.qc__item,.pigments li{opacity:0;transform:translateY(16px);transition:opacity .7s ease,transform .7s ease}
      .sku.is-in,.scale__step.is-in,.qc__item.is-in,.pigments li.is-in{opacity:1;transform:translateY(0)}
      .scale__step{position:relative;cursor:pointer}
      .scale__step.is-active::after{content:'';position:absolute;left:-6px;right:-6px;top:-6px;bottom:-6px;border:1px solid #101828;pointer-events:none}
      .pigments li{cursor:pointer}
    `;
    document.head.appendChild(style);

    modal = document.createElement('div');
    modal.className = 'q-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="q-modal__panel" role="document">
        <button class="q-modal__close" type="button" aria-label="Close">×</button>
        <div class="q-modal__inner">
          <div class="q-modal__head">
            <span class="q-modal__eyebrow"></span>
            <h3 class="q-modal__title"></h3>
          </div>
          <div class="q-modal__body"></div>
          <div class="q-modal__foot">
            <span class="q-modal__accent"></span>
            <button class="q-modal__share" type="button">
              <span class="q-modal__share-label">Share</span>
              <span class="q-modal__share-count">0</span>
            </button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modal.querySelector('.q-modal__close').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

    const shareBtn = modal.querySelector('.q-modal__share');
    const shareLbl = modal.querySelector('.q-modal__share-count');
    const shareTxt = modal.querySelector('.q-modal__share-label');
    shareBtn.addEventListener('click', () => {
      if (shareCount >= SHARE_CAP) return;
      shareCount++;
      shareLbl.textContent = shareCount;
      if (shareCount >= SHARE_CAP) { shareBtn.classList.add('is-capped'); shareTxt.textContent = 'Shared'; }
    });
    return modal;
  }

  function openModal(d) {
    const m = ensureModal();
    m.querySelector('.q-modal__eyebrow').textContent = d.eyebrow || '';
    m.querySelector('.q-modal__title').textContent = d.title || '';
    m.querySelector('.q-modal__body').innerHTML = d.body || '';
    const acc = m.querySelector('.q-modal__accent');
    acc.textContent = d.accentLabel || '';
    acc.style.setProperty('--accent-c', d.accentColor || '#1A1A1F');
    const shareBtn = m.querySelector('.q-modal__share');
    const shareLbl = m.querySelector('.q-modal__share-count');
    const shareTxt = m.querySelector('.q-modal__share-label');
    shareCount = 0;
    shareLbl.textContent = '0';
    shareBtn.classList.remove('is-capped');
    shareTxt.textContent = 'Share';
    lastFocus = document.activeElement;
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => m.querySelector('.q-modal__close').focus(), 60);
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ========== DATA → MODAL ==========
  const skuData = (s) => ({
    eyebrow: `${s.num} · Edition ${s.edition} · ${s.collection}`,
    title: s.name,
    body: `<p><strong>${s.size}</strong> <span style="color:#9A9A95">/ ${s.compare}</span></p>
           <p>${s.aud}</p>
           <p><strong>${s.price}</strong> <span style="color:#9A9A95">/ ${s.priceMeta}</span></p>
           <p style="color:#9A9A95;font-size:12px;letter-spacing:.04em">${s.meta}</p>`,
    accentLabel: s.accentName,
    accentColor: s.accent
  });
  const pigData = (p) => ({
    eyebrow: `${p.code} · Pigment Menu`,
    title: p.name,
    body: `<p>${p.desc}</p>
           <p style="font-family:'Anton',Impact,sans-serif;font-size:34px;line-height:1;letter-spacing:.04em;text-transform:uppercase">${p.hex}</p>
           <p style="color:#9A9A95;font-size:12px;letter-spacing:.04em">Pigment mixed through the mass before casting. Available for segment D (Designer, Mega, Architect).</p>`,
    accentLabel: p.name,
    accentColor: p.hex
  });
  const settingsData = () => ({
    eyebrow: 'Settings · Preferences',
    title: 'Studio prefs',
    body: `<p>Settings will live here: language (RU / EN), units (cm / inches), reduced motion and release notifications.</p>
           <p style="color:#9A9A95;font-size:12px">Demo mode — real settings are on the way. Watch the studio.</p>`,
    accentLabel: 'Quacktory · 2025',
    accentColor: '#3FCB6E'
  });

  // ========== WIRE UP STAGE OBJECTS ==========
  document.querySelectorAll('.sku').forEach((el, i) => {
    const s = skus[i]; if (!s) return;
    el.addEventListener('click', (e) => { if (e.target.closest('.sku__link')) return; openModal(skuData(s)); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(skuData(s)); } });
  });

  document.querySelectorAll('.scale__step').forEach((el, i) => {
    const s = skus[i]; if (!s) return;
    el.addEventListener('click', () => {
      document.querySelectorAll('.scale__step').forEach((n) => n.classList.remove('is-active'));
      el.classList.add('is-active');
      openModal(skuData(s));
    });
  });

  document.querySelectorAll('.pigments li').forEach((el, i) => {
    const p = pigments[i]; if (!p) return;
    el.addEventListener('click', () => openModal(pigData(p)));
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(pigData(p)); } });
  });

  // ========== SETTINGS GEAR ==========
  const gear = document.createElement('button');
  gear.className = 'q-gear';
  gear.type = 'button';
  gear.setAttribute('aria-label', 'Open settings');
  gear.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
  document.body.appendChild(gear);
  gear.addEventListener('click', () => openModal(settingsData()));

  // ========== CLOCK ==========
  function tickClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    el.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  tickClock();
  setInterval(tickClock, 1000);

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const t = document.querySelector(href);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ========== SCROLL-TRIGGERED FADE-IN ==========
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.sku, .scale__step, .qc__item, .pigments li').forEach((el) => io.observe(el));
  }

  // ========== MARQUEE — seamless loop ==========
  const track = document.querySelector('.marquee__track');
  if (track) {
    track.style.willChange = 'transform';
    let pos = 0, last = performance.now();
    const speed = 0.045; // px per ms
    function step(now) {
      const dt = now - last; last = now;
      pos -= speed * dt;
      const half = track.scrollWidth / 2;
      if (half > 0 && -pos >= half) pos += half;
      track.style.transform = `translate3d(${pos}px,0,0)`;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();
