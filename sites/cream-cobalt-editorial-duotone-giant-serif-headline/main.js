// file: main.js
(() => {
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

  const duckData = {
    Micro:     { size: '4–8 cm · thumb-sized',     price: '$8',         meta: 'per unit · incl. shipping', accent: '#C9A8AE', desc: 'Keychain-scale. Vulcanised food-grade silicone, 8-cavity injection mould, 45 s/cycle. EN 71-3, no phthalates, no BPA.' },
    Classic:   { size: '10–25 cm · fist-sized',    price: '$24',        meta: 'per unit · incl. shipping', accent: '#9CC28B', desc: 'Compression mould, 3 min/cycle. The reference duck — soft, matte, pocketable, washable. Indoor only.' },
    Designer:  { size: '15–30 cm · cat-sized',     price: '$89',        meta: 'per unit · incl. shipping', accent: '#C9A8AE', desc: 'Hand-cast in silicone (≤300 pieces) or compression for larger runs. Each piece ships with an embossed paper certificate.' },
    Mega:      { size: '50–120 cm · child-sized',  price: '$420',       meta: 'per unit · incl. shipping', accent: '#6B7FA3', desc: 'Rotational mould, 2 h + 8 h cooling. Indoor decoration — not a toy. Above +70 °C risk of deformation.' },
    Architect: { size: '1.5–3 m · bear-sized',     price: 'on request', meta: 'spec sheet · contract',     accent: '#1F2A44', desc: 'Sculptural casting against a CNC-milled master. 2–4 weeks per duck, on-site survey included. Wooden crate, climate control.' }
  };

  // Inject component styles
  const style = document.createElement('style');
  style.textContent = `
    .modal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:24px}
    .modal--open{display:flex;animation:mfade 220ms cubic-bezier(.4,0,.2,1) both}
    @keyframes mfade{from{opacity:0}to{opacity:1}}
    .modal__overlay{position:absolute;inset:0;background:rgba(31,42,68,.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);cursor:pointer}
    .modal__panel{position:relative;background:#F4F6FA;border-radius:22px;padding:28px;max-width:480px;width:100%;box-shadow:0 30px 80px rgba(31,42,68,.35);animation:mpop 320ms cubic-bezier(.22,1,.36,1) both}
    @keyframes mpop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}
    .modal__close{position:absolute;top:12px;right:12px;background:transparent;border:none;width:36px;height:36px;border-radius:50%;font-size:22px;cursor:pointer;color:#1F2A44;line-height:1;transition:background 180ms cubic-bezier(.4,0,.2,1)}
    .modal__close:hover{background:rgba(31,42,68,.08)}
    .modal__accent{width:48px;height:4px;border-radius:4px;margin-bottom:14px;background:#C9A8AE;transition:background 320ms ease}
    .modal__kicker{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(31,42,68,.7);margin-bottom:6px}
    .modal__title{font-family:Manrope,system-ui,sans-serif;font-weight:500;font-size:28px;letter-spacing:-.02em;margin-bottom:12px;color:#1F2A44;line-height:1.05}
    .modal__desc{font-size:14px;line-height:1.55;color:rgba(31,42,68,.85);margin-bottom:18px}
    .modal__meta{display:flex;flex-direction:column;gap:6px;padding:14px;background:rgba(31,42,68,.05);border-radius:12px;margin-bottom:18px}
    .modal__row{display:flex;justify-content:space-between;gap:12px;font-size:13px}
    .modal__row span{color:rgba(31,42,68,.55)}
    .modal__row b{font-weight:500;color:#1F2A44;text-align:right}
    .modal__share{display:flex;align-items:center;gap:10px}
    .modal__share-btn{background:#1F2A44;color:#F4F6FA;border:none;padding:10px 20px;border-radius:999px;font-size:13px;cursor:pointer;font-weight:500;font-family:inherit;transition:transform 180ms cubic-bezier(.4,0,.2,1)}
    .modal__share-btn:hover{transform:translateY(-1px)}
    .modal__share-count{font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(31,42,68,.75);padding:5px 10px;background:rgba(31,42,68,.08);border-radius:999px;min-width:32px;text-align:center}
    .settings-gear{position:fixed;bottom:24px;left:24px;width:44px;height:44px;border-radius:50%;background:#F4F6FA;border:1px solid rgba(31,42,68,.1);box-shadow:0 8px 24px rgba(31,42,68,.1);cursor:pointer;font-size:18px;z-index:50;display:grid;place-items:center;color:#1F2A44;font-family:inherit;transition:transform 220ms cubic-bezier(.4,0,.2,1),box-shadow 220ms cubic-bezier(.4,0,.2,1)}
    .settings-gear:hover{transform:translateY(-2px) rotate(20deg);box-shadow:0 16px 38px rgba(31,42,68,.18)}
    .settings-gear:focus-visible{outline:2px solid #1F2A44;outline-offset:3px}
    .sidebar__card{opacity:0;transform:translateY(8px);transition:opacity 520ms cubic-bezier(.22,1,.36,1),transform 520ms cubic-bezier(.22,1,.36,1)}
    .sidebar__card.is-in{opacity:1;transform:none}
    .ladder__step{cursor:pointer;transition:transform 180ms cubic-bezier(.4,0,.2,1);border-radius:12px;padding:4px}
    .ladder__step:hover{transform:translateY(-2px)}
    .ladder__step:focus-visible{outline:2px solid #1F2A44;outline-offset:4px}
    .theme-dot{transition:transform 180ms cubic-bezier(.4,0,.2,1),box-shadow 180ms cubic-bezier(.4,0,.2,1)}
    .theme-dot:hover{transform:scale(1.15)}
    .field__dot{transition:opacity 320ms ease}
    @media (prefers-reduced-motion:reduce){.modal--open,.modal__panel,.sidebar__card{animation:none!important;transition:opacity 120ms!important;transform:none!important}.settings-gear:hover{transform:none}}
  `;
  document.head.appendChild(style);

  // Modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="modal__overlay" data-close></div>
    <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="m-title">
      <button class="modal__close" data-close aria-label="Close" type="button">×</button>
      <div class="modal__accent" id="m-accent"></div>
      <p class="modal__kicker" id="m-kicker"></p>
      <h3 class="modal__title" id="m-title"></h3>
      <p class="modal__desc" id="m-desc"></p>
      <div class="modal__meta" id="m-meta"></div>
      <div class="modal__share">
        <button class="modal__share-btn" id="m-share" type="button">Share</button>
        <span class="modal__share-count" id="m-count">0</span>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const SHARE_CAP = 99;
  let shareCount = 0;

  const openModal = (d) => {
    $('#m-kicker', modal).textContent = d.kicker || '';
    $('#m-title', modal).textContent = d.title || '';
    $('#m-desc', modal).textContent = d.desc || '';
    $('#m-meta', modal).innerHTML = d.meta || '';
    $('#m-accent', modal).style.background = d.accent || '#C9A8AE';
    shareCount = 0;
    $('#m-count', modal).textContent = '0';
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('modal--open')) closeModal(); });
  $('#m-share', modal).addEventListener('click', () => {
    if (shareCount < SHARE_CAP) { shareCount++; $('#m-count', modal).textContent = shareCount; }
  });

  // Ducks → open modal with line data
  $$('.duck').forEach(duck => {
    const fire = () => {
      const sku = duck.dataset.sku;
      const d = duckData[sku] || {};
      openModal({
        kicker: 'Quacktory · ' + sku,
        title: sku,
        desc: d.desc,
        meta: `<div class="modal__row"><span>Size</span><b>${d.size}</b></div><div class="modal__row"><span>Price</span><b>${d.price}</b></div><div class="modal__row"><span>Notes</span><b>${d.meta}</b></div>`,
        accent: d.accent
      });
    };
    duck.addEventListener('click', fire);
    duck.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
  });

  // Ladder steps → open modal with size-ladder data
  $$('.ladder__step').forEach(step => {
    step.setAttribute('tabindex', '0');
    const name = step.querySelector('.ladder__name')?.textContent?.trim();
    const size = step.querySelector('.ladder__size')?.textContent?.trim();
    const time = step.querySelector('.ladder__time')?.textContent?.trim();
    const accent = (duckData[name] || {}).accent || '#C9A8AE';
    const fire = () => openModal({
      kicker: 'Size ladder',
      title: name,
      desc: name === 'Micro' ? 'Entry line. Off-the-shelf, shipped today. Keychain attachment included.' :
            name === 'Architect' ? 'Largest line. Bear-sized, sculptural casting, on-site installation, 12 weeks.' :
            'Mid-tier production. Same mould relief, scaled up. Lead time and dimensions are fixed; custom geometry is a separate scope.',
      meta: `<div class="modal__row"><span>Size</span><b>${size}</b></div><div class="modal__row"><span>Lead time</span><b>${time}</b></div>`,
      accent
    });
    step.addEventListener('click', fire);
    step.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
  });

  // Theme dots → toggle active + open modal
  $$('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      $$('.theme-dot').forEach(d => d.classList.remove('theme-dot--active'));
      dot.classList.add('theme-dot--active');
      const line = dot.dataset.line;
      const d = duckData[line] || {};
      openModal({
        kicker: 'Line switcher',
        title: line,
        desc: `Active accent switched to ${line}. ${d.desc || ''}`,
        meta: `<div class="modal__row"><span>Size</span><b>${d.size || ''}</b></div><div class="modal__row"><span>Price</span><b>${d.price || ''}</b></div>`,
        accent: d.accent
      });
    });
  });

  // Smooth scroll for in-page anchors
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = id && document.getElementById(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Sidebar cards: scroll-triggered reveal
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.sidebar__card').forEach((c, i) => { c.style.transitionDelay = (i * 60) + 'ms'; io.observe(c); });
  } else {
    $$('.sidebar__card').forEach(c => c.classList.add('is-in'));
  }

  // Field dots: gentle pulse on a staggered loop
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    $$('.field__dot').forEach((dot, i) => {
      dot.style.animation = `fdot 4.2s ${i * 0.6}s ease-in-out infinite`;
    });
    const dotStyle = document.createElement('style');
    dotStyle.textContent = '@keyframes fdot{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.85;transform:scale(1.25)}}.field__dot{transform-origin:center}';
    document.head.appendChild(dotStyle);
  }
})();
