// file: main.js
(() => {
  'use strict';

  /* ===== DATA ============================================== */
  const SKU = {
    micro:     { title:'MICRO',     line:'04–08 cm',  hint:'thumb-sized', price:'from $4',      lead:'today', edition:'A · impulse',      accent:'#C8102E', desc:'Keychain line. One mold-relief, four Pigment Menu colors, UV-stable eye pigmentation. Final packaging — embossed tin box.' },
    classic:   { title:'CLASSIC',   line:'10–25 cm',  hint:'palm-sized',       price:'from $16',    lead:'3 wks',  edition:'B · parent',     accent:'#D1442E', desc:'Baseline series for the bath and the windowsill. Solid cast, hand-painted eyes, five QC stages on every duck.' },
    designer:  { title:'DESIGNER',  line:'15–30 cm',  hint:'cat-sized',        price:'from $60',    lead:'6 wks',  edition:'C · collector', accent:'#B85A5A', desc:'Shelf and window-display line. Natural rubber with EPDM additives, expanded Pigment Menu palette, brass tag.' },
    mega:      { title:'MEGA',      line:'50–120 cm', hint:'child-sized',      price:'from $480',   lead:'6 wks',  edition:'C+ · photo object', accent:'#A83A3A', desc:'Mid-size installation for lobbies, studios, sets. Reinforced frame, photo-logged install.' },
    architect: { title:'ARCHITECT', line:'1.5–3 m',   hint:'bear-sized',      price:'on request',    lead:'12 wks', edition:'D · B2B / event',  accent:'#7A2028', desc:'Architectural installation. Ultrasonic weld inspection on the frame, dedicated install crew, insurance, object passport.' }
  };
  const HERO     = { title:'QUACKTORY', line:'hero / 01', hint:'one silhouette', price:'5 SKU', lead:'field', edition:'signature', accent:'#C8102E', desc:'The field\'s main subject. One silhouette — five lines. Click any duck below to open its product passport.' };
  const SETTINGS = { title:'SPECTRAL SETTINGS', line:'pigment menu v1.0', hint:'interface', price:'locked', lead:'build', edition:'admin', accent:'#C8102E', desc:'Palette, sizes, interface language and "photo protocol" mode are all controlled here. In the current build the menu is locked — the parameters are pinned to the SKU.' };
  const TICK = { a:SKU.micro, b:SKU.classic, c:SKU.designer, d:SKU.mega, e:SKU.architect };

  /* ===== INJECTED STYLES (modal + helpers) ================= */
  const css = `
    .modal{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .25s ease}
    .modal.is-open{opacity:1;pointer-events:auto}
    .modal__overlay{position:absolute;inset:0;background:rgba(8,8,8,.78);backdrop-filter:blur(6px)}
    .modal__panel{position:relative;width:min(560px,92vw);background:#0F0E0C;border:1px solid var(--line-strong);padding:34px 30px 26px;color:var(--fg);font-family:var(--font);text-transform:uppercase;letter-spacing:.14em;font-size:11px;line-height:1.7;transform:translateY(14px);transition:transform .35s cubic-bezier(.2,.7,.2,1);box-shadow:0 30px 80px rgba(0,0,0,.55)}
    .modal.is-open .modal__panel{transform:translateY(0)}
    .modal__close{position:absolute;top:14px;right:16px;color:var(--muted);font-size:18px;line-height:1;width:24px;height:24px;display:grid;place-items:center;transition:color .2s}
    .modal__close:hover{color:var(--accent)}
    .modal__eyebrow{display:block;color:var(--muted);font-size:9px;letter-spacing:.24em;margin-bottom:14px}
    .modal__title{font-size:18px;font-weight:400;margin:0 0 10px;letter-spacing:.18em}
    .modal__pill{display:inline-block;padding:4px 10px;border:1px solid var(--line-strong);color:var(--muted);font-size:9px;letter-spacing:.22em;margin-bottom:18px}
    .modal__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}
    .modal__cell{padding:10px 8px;border:1px solid var(--line-soft);background:rgba(255,210,74,.02)}
    .modal__cell span{display:block;font-size:8px;color:var(--muted);letter-spacing:.24em;margin-bottom:4px}
    .modal__cell b{display:block;font-size:11px;color:var(--fg);font-weight:400;letter-spacing:.1em}
    .modal__body{margin:0 0 18px;font-size:11px;letter-spacing:.06em;line-height:1.7;color:#9C8470;text-transform:none;max-width:46ch}
    .modal__meta{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:14px;border-top:1px solid var(--line-soft)}
    .modal__chip{font-size:9px;color:var(--muted);letter-spacing:.22em;display:inline-flex;align-items:center;gap:8px}
    .modal__chip::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--accent,#FFD24A);box-shadow:0 0 10px var(--accent,#FFD24A)}
    .modal__share{font:inherit;color:var(--muted);font-size:10px;letter-spacing:.18em;padding:6px 10px;border:1px solid var(--line);transition:color .2s,border-color .2s;cursor:pointer}
    .modal__share:hover{color:var(--accent);border-color:var(--line-strong)}
    .modal__share em{font-style:normal;color:var(--accent)}
    body.no-scroll{overflow:hidden}
    .topbar__gear{display:inline-flex;align-items:center;gap:6px;font:inherit;color:var(--muted);font-size:10px;letter-spacing:.2em;padding:6px 8px;border:1px solid var(--line);margin-left:12px;transition:color .2s,border-color .2s;cursor:pointer}
    .topbar__gear:hover{color:var(--accent);border-color:var(--line-strong)}
    .field__rail-tick{cursor:pointer;transition:transform .25s,background .25s}
    .field__rail-tick.is-active{background:var(--fg);transform:scaleY(1.8)}
    .platform-shared{color:var(--accent) !important}
    .js-ready .sku,.js-ready .card,.js-ready .field__legend-item{opacity:0;transform:translateY(14px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
    .js-ready .sku.is-in,.js-ready .card.is-in,.js-ready .field__legend-item.is-in{opacity:1;transform:translateY(0)}
  `;
  document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));
  document.body.classList.add('js-ready');

  /* ===== MODAL ============================================= */
  const modal = Object.assign(document.createElement('div'), {
    className: 'modal', hidden: true,
    innerHTML: `
      <div class="modal__overlay" data-close></div>
      <div class="modal__panel">
        <button class="modal__close" type="button" data-close aria-label="close">×</button>
        <span class="modal__eyebrow" data-f="line"></span>
        <h2 class="modal__title" data-f="title"></h2>
        <span class="modal__pill" data-f="edition"></span>
        <div class="modal__grid">
          <div class="modal__cell"><span>range</span><b data-f="hint"></b></div>
          <div class="modal__cell"><span>price</span><b data-f="price"></b></div>
          <div class="modal__cell"><span>lead</span><b data-f="lead"></b></div>
        </div>
        <p class="modal__body" data-f="desc"></p>
        <div class="modal__meta">
          <span class="modal__chip" data-f="chip"></span>
          <button class="modal__share" type="button">share · <em data-share>0</em></button>
        </div>
      </div>`
  });
  document.body.appendChild(modal);

  const fields = modal.querySelectorAll('[data-f]');
  const shareEl = modal.querySelector('[data-share]');
  let lastFocus = null, shareCount = 0;
  const SHARE_CAP = 99;

  const openModal = data => {
    if (!data) return;
    lastFocus = document.activeElement;
    fields.forEach(n => {
      const k = n.dataset.f;
      n.textContent = k === 'chip' ? 'accent · ' + (data.accent || '#FFD24A') : (data[k] || '');
    });
    const accent = data.accent || '#FFD24A';
    modal.querySelector('.modal__title').style.color = accent;
    modal.querySelector('.modal__chip').style.setProperty('--accent', accent);
    shareCount = 0; shareEl.textContent = '0';
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.classList.add('no-scroll');
    modal.querySelector('.modal__close').focus();
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { modal.hidden = true; }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  modal.querySelector('.modal__share').addEventListener('click', () => {
    if (shareCount < SHARE_CAP) shareCount += 1;
    shareEl.textContent = shareCount;
  });

  /* ===== BINDINGS ========================================== */
  const bind = (sel, get, keys) => {
    document.querySelectorAll(sel).forEach(node => {
      const fire = e => { e.preventDefault(); openModal(get(node)); };
      node.addEventListener('click', fire);
      if (keys) node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') fire(e);
      });
    });
  };

  bind('.sku', n => SKU[n.dataset.sku], true);
  bind('.hero__form',   () => HERO, true);
  bind('.hero__object', () => HERO, true);
  bind('.mark', n => ({
    title: n.textContent.trim(), line:'marker', hint:'technical mark',
    price:'—', lead:'—', edition:'field', accent:'#FFD24A',
    desc:'Coordinate mark on the subject. λ — wavelength of warm yellow, ε — scale coefficient (×75), σ — root-mean-square deviation of the form (zero).'
  }));
  bind('.field__rail-tick', n => {
    const k = [...n.classList].find(c => c.startsWith('field__rail-tick--')).slice(-1);
    return TICK[k] || HERO;
  });
  document.querySelectorAll('.field__rail-tick').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.field__rail-tick').forEach(x => x.classList.remove('is-active'));
      t.classList.add('is-active');
    });
  });
  bind('.field__legend-item', n => ({
    title: n.textContent.trim(), line:'segment', hint:'audience',
    price:'—', lead:'—', edition:'legend', accent:'#FFD24A',
    desc:'The audience segment the matching SKU is aimed at. Impulse — a gift, parent — a child, collector — a display, B2B — an event.'
  }));
  bind('.field__rail-label', n => ({
    title: n.textContent.trim(), line:'scale label', hint:'range',
    price:'—', lead:'—', edition:'scale', accent:'#FFD24A',
    desc:'Label on the lower size ladder. Places the keychain (4 cm) and the installation (3 m) in the same field of view.'
  }));

  /* ===== SETTINGS GEAR ===================================== */
  const nav = document.querySelector('.topbar__nav');
  if (nav) {
    const gear = Object.assign(document.createElement('button'), {
      type: 'button', className: 'topbar__gear',
      textContent: '⚙ settings', 'aria-label': 'spectral settings'
    });
    gear.addEventListener('click', e => { e.preventDefault(); openModal(SETTINGS); });
    nav.appendChild(gear);
  }

  /* ===== PLATFORM SHARE COUNTER ============================ */
  let shares = 0;
  const PLATFORM_CAP = 999;
  document.querySelectorAll('.hero__platforms a').forEach(a => {
    const orig = a.textContent;
    a.addEventListener('click', e => {
      e.preventDefault();
      if (shares < PLATFORM_CAP) shares += 1;
      a.classList.add('platform-shared');
      a.textContent = `${orig} · ${shares}`;
      clearTimeout(a._t);
      a._t = setTimeout(() => { a.textContent = orig; a.classList.remove('platform-shared'); }, 1600);
    });
  });

  /* ===== SMOOTH SCROLL ===================================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ===== INTERSECTION FADES ================================ */
  const io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }});
  }, { threshold: 0.15 });
  document.querySelectorAll('.sku, .card, .field__legend-item').forEach(el => io.observe(el));

})();
