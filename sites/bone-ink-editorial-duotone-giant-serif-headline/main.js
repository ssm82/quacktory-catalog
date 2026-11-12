// file: main.js
(function () {
  // ── Inject modal/gear/reveal styles ──
  const css = document.createElement('style');
  css.textContent = `
    .qt-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;pointer-events:none;transition:opacity .3s}
    .qt-overlay.is-open{opacity:1;pointer-events:auto}
    .qt-modal{position:relative;background:#0A0A0A;border:1px solid var(--qt-accent,#F5C518);max-width:540px;width:calc(100% - 40px);padding:42px 36px 30px;border-radius:4px;color:#F2F2F2;transform:translateY(24px) scale(.97);transition:transform .4s cubic-bezier(.2,.7,.2,1);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 80px var(--qt-accent-soft,rgba(245,197,24,.20))}
    .qt-overlay.is-open .qt-modal{transform:translateY(0) scale(1)}
    .qt-close{position:absolute;top:14px;right:14px;width:32px;height:32px;background:transparent;border:1px solid rgba(255,255,255,.18);color:#F2F2F2;font-size:14px;line-height:1;cursor:pointer;border-radius:2px;transition:background .2s,border-color .2s,transform .2s;font-family:var(--mono)}
    .qt-close:hover{background:var(--qt-accent,#F5C518);color:#0A0A0A;border-color:var(--qt-accent,#F5C518);transform:rotate(90deg)}
    .qt-accent{position:absolute;top:0;left:0;width:3px;height:100%;background:var(--qt-accent,#F5C518)}
    .qt-num{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9A9A9A;display:block;margin-bottom:10px}
    .qt-title{font-family:var(--display);font-size:30px;font-weight:600;letter-spacing:-.015em;margin:0 0 14px;color:#fff;line-height:1.1}
    .qt-desc{font-size:14px;line-height:1.6;color:#cfcfcf;margin:0 0 22px}
    .qt-specs{margin:0 0 24px;display:grid;grid-template-columns:1fr 1fr;gap:12px 22px}
    .qt-specs div{display:flex;flex-direction:column;gap:3px}
    .qt-specs dt{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#9A9A9A}
    .qt-specs dd{font-size:13px;color:#F2F2F2;margin:0}
    .qt-share{display:flex;align-items:center;gap:14px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08)}
    .qt-share-label{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9A9A9A}
    .qt-share-btn{display:inline-flex;align-items:center;gap:9px;background:transparent;border:1px solid rgba(255,255,255,.18);color:#F2F2F2;padding:8px 13px;font-family:var(--mono);font-size:12px;cursor:pointer;border-radius:2px;transition:background .2s,border-color .2s,color .2s}
    .qt-share-btn:hover{background:var(--qt-accent,#F5C518);color:#0A0A0A;border-color:var(--qt-accent,#F5C518)}
    .qt-share-btn.is-bumped{animation:qtBump .4s ease}
    .qt-share-icon{font-size:14px}
    @keyframes qtBump{0%{transform:scale(1)}45%{transform:scale(1.18)}100%{transform:scale(1)}}
    .qt-reveal{opacity:0;transform:translateY(20px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
    .qt-reveal.is-in{opacity:1;transform:translateY(0)}
    .scale-item{transition:transform .25s,box-shadow .3s}
    .scale-item.is-active{transform:translateY(-4px);box-shadow:0 14px 40px rgba(0,0,0,.5)}
    @media (prefers-reduced-motion:reduce){.qt-reveal{opacity:1;transform:none;transition:none}.qt-share-btn.is-bumped{animation:none}}
  `;
  document.head.appendChild(css);

  // ── Data ──
  const SCALE = {
    micro:     { num:'4 cm',   title:'Micro',     eq:'thumb-sized',   meta:'keychain · 6+ · from $7 · 3 wks',   accent:'#F5C518' },
    classic:   { num:'20 cm',  title:'Classic',   eq:'cat-sized',     meta:'bathtub · 3+ · mid · 3 wks',       accent:'#E89A1F' },
    designer:  { num:'30 cm',  title:'Designer',  eq:'cushion-sized', meta:'collabs · 6+ · mid+ · 6 wks',      accent:'#C24A4A' },
    mega:      { num:'80 cm',  title:'Mega',      eq:'child-sized',   meta:'window display · premium · 6 wks', accent:'#5B7B8C' },
    architect: { num:'3 m',    title:'Architect', eq:'bear-sized',    meta:'installation · contract · 12 wks', accent:'#8A4F8E' }
  };
  const CARD = SCALE;
  const PROD = {
    material:   { title:'Body and eyes',              desc:'Vulcanised rubber: food-grade silicone compound for Micro/Classic, natural rubber with EPDM additives for Designer/Mega/Architect. The eyes are pigment applied after vulcanisation — no plastic inserts. UV- and water-resistant, applied by hand.', accent:'#9DB7A0' },
    cast:       { title:'Method by lineup',           desc:'Micro — injection 45 sec/cycle. Classic — compression 3 min/cycle. Designer — hand-poured in flask. Mega — rotational 2 h + 8 h cooling. Architect — sculptural casting 2–4 wks with a photo log of the install.', accent:'#E89A1F' },
    qc:         { title:'5 checks per duck',          desc:'Visual inspection (pores, streaks, under-fill). Geometry — beak, eyes, feet in place; proportions ±2%. Drop test — 5× from 1 m onto concrete. Smell test (bad vulcanisation). Gravimetric — mass ±3% of the master.', accent:'#6fcf97' },
    compliance: { title:'Certifications and conditions', desc:'GOST 25779-83 (rubber toys) · EN 71-3 (chemical migration) · REACH (phthalate-free and BPA-free). Temperature range −20 °C … +60 °C. Indoor use only. Architect — extended protocol with ultrasonic inspection of the frame.', accent:'#3F4A4F' }
  };
  const SECTIONS = {
    '1': { title:'Manifest',     desc:'Serious ducks for un-serious people. Single-piece moulding, eyes painted after vulcanisation, no plastic, no glue.', accent:'#F5C518' },
    '2': { title:'Scale',        desc:'Five SKUs, one silhouette. Proportions don\'t scale linearly — the larger duck must read as the same duck as the smaller one, not as an enlarged copy.', accent:'#E89A1F' },
    '3': { title:'Lineup',       desc:'Product cards. Single-piece moulding: food-grade silicone compound (Micro/Classic) or natural rubber with EPDM (Designer/Mega/Architect).', accent:'#C24A4A' },
    '4': { title:'Production',   desc:'Full production factology, no marketing. Temperature, pressure, cycle time, method per lineup.', accent:'#9DB7A0' },
    '5': { title:'Custom · B2B', desc:'Twelve signature TPM pigments. Mass-dyed body — not a surface paint. Custom Pantone: +2 wks, +15% to the price.', accent:'#8A4F8E' },
    '6': { title:'Care',         desc:'Care: warm water, mild soap, no abrasives or alcohols. Indoor use only. −20 °C … +60 °C. Direct UV — colour degrades over 2+ years.', accent:'#3F4A4F' }
  };

  // ── Modal DOM ──
  const overlay = document.createElement('div');
  overlay.className = 'qt-overlay';
  overlay.innerHTML = `
    <div class="qt-modal" role="dialog" aria-modal="true" aria-labelledby="qt-title">
      <button class="qt-close" type="button" aria-label="Close">✕</button>
      <div class="qt-accent"></div>
      <span class="qt-num"></span>
      <h2 class="qt-title" id="qt-title"></h2>
      <p class="qt-desc"></p>
      <dl class="qt-specs"></dl>
      <div class="qt-share">
        <span class="qt-share-label">Share · capped 99</span>
        <button class="qt-share-btn" type="button">
          <span class="qt-share-icon">↗</span>
          <span class="qt-share-count">0</span>
        </button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const modal   = overlay.querySelector('.qt-modal');
  const elNum   = overlay.querySelector('.qt-num');
  const elTitle = overlay.querySelector('.qt-title');
  const elDesc  = overlay.querySelector('.qt-desc');
  const elSpecs = overlay.querySelector('.qt-specs');
  const elClose = overlay.querySelector('.qt-close');
  const shareBtn= overlay.querySelector('.qt-share-btn');
  const shareCnt= overlay.querySelector('.qt-share-count');
  const SHARES_CAP = 99;
  let shares = 0;

  function open({ num, title, desc, specs, accent }) {
    elNum.textContent   = num || '';
    elTitle.textContent = title || '';
    elDesc.textContent  = desc || '';
    elSpecs.innerHTML = '';
    (specs || []).forEach(([k, v]) => {
      const d = document.createElement('div');
      d.innerHTML = `<dt>${k}</dt><dd>${v}</dd>`;
      elSpecs.appendChild(d);
    });
    const a = accent || '#F5C518';
    modal.style.setProperty('--qt-accent', a);
    modal.style.setProperty('--qt-accent-soft', a + '33');
    shares = 0; shareCnt.textContent = '0';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    elClose.focus();
  }
  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  elClose.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('is-open')) close(); });
  shareBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (shares >= SHARES_CAP) return;
    shares++; shareCnt.textContent = shares;
    shareBtn.classList.remove('is-bumped');
    void shareBtn.offsetWidth;
    shareBtn.classList.add('is-bumped');
  });

  // ── Universal binder (click + keyboard) ──
  function bind(el, handler) {
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
    });
  }

  // ── Cards (lineup) ──
  document.querySelectorAll('.card').forEach(card => {
    const m = [...card.classList].find(c => c.startsWith('card--'));
    if (!m) return;
    const d = CARD[m.replace('card--','')];
    if (!d) return;
    const specs = [...card.querySelectorAll('.card-specs > div')]
      .map(div => [div.querySelector('dt').textContent, div.querySelector('dd').textContent]);
    const num = card.querySelector('.card-num')?.textContent || '';
    const tag = card.querySelector('.card-tag')?.textContent || '';
    bind(card, () => open({ num, title: d.title, desc: `${tag} · ${d.eq} — ${d.meta}`, specs, accent: d.accent }));
  });

  // ── Scale items (timeline rail nodes) ──
  document.querySelectorAll('.scale-item').forEach(item => {
    const m = [...item.classList].find(c => c.startsWith('scale-item--'));
    if (!m) return;
    const d = SCALE[m.replace('scale-item--','')];
    if (!d) return;
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    bind(item, () => {
      document.querySelectorAll('.scale-item').forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      open({ num: d.num, title: d.title, desc: `${d.eq}. ${d.meta}.`, specs: [['Scale', d.eq], ['Size', d.num], ['Run', d.meta], ['Family', d.title]], accent: d.accent });
    });
  });

  // ── Swatches (palette — clickable subjects) ──
  document.querySelectorAll('.swatch').forEach(sw => {
    const code = sw.querySelector('.swatch-code')?.textContent || '';
    const name = sw.querySelector('.swatch-name')?.textContent || '';
    const color = getComputedStyle(sw).getPropertyValue('--swatch').trim();
    sw.setAttribute('tabindex', '0');
    sw.setAttribute('role', 'button');
    bind(sw, () => open({
      num: code, title: name,
      desc: 'A solid pigment-in-body colour from the TPM palette — not a surface paint. Fastness and price stay predictable. Custom Pantone: +2 wks lead time, +15% to the price.',
      specs: [['Code', code], ['Family', 'TPM'], ['Method', 'pigment-in-body'], ['Custom Pantone', '+2 wks / +15%']],
      accent: color
    }));
  });

  // ── Production blocks ──
  const prodKeys = Object.keys(PROD);
  document.querySelectorAll('.prod-block').forEach((b, i) => {
    const d = PROD[prodKeys[i] || 'material'];
    b.setAttribute('tabindex', '0');
    b.setAttribute('role', 'button');
    bind(b, () => open({ num: '// ' + (prodKeys[i] || 'note'), title: d.title, desc: d.desc, specs: null, accent: d.accent }));
  });

  // ── Section tags (tooltip pills) ──
  document.querySelectorAll('.section-tag').forEach(tag => {
    const m = tag.textContent.match(/(\d+)/);
    if (!m) return;
    const key = String(parseInt(m[1], 10));
    const d = SECTIONS[key];
    if (!d) return;
    tag.setAttribute('tabindex', '0');
    tag.setAttribute('role', 'button');
    bind(tag, () => open({ num: '№ ' + key, title: d.title, desc: d.desc, specs: null, accent: d.accent }));
  });

  // ── Smooth-scroll fallback ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── IntersectionObserver reveal ──
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.scale-item, .card, .prod-block, .swatch, .section-head, .palette, .care-list').forEach(el => {
    el.classList.add('qt-reveal');
    io.observe(el);
  });
})();