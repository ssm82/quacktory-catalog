// file: main.js
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

  // ---------- NAV TOGGLE ----------
  const navTrigger = document.querySelector('.nav__trigger');
  const navMenu = document.getElementById('primary-menu');
  if (navTrigger && navMenu) {
    navTrigger.addEventListener('click', () => {
      const open = navTrigger.getAttribute('aria-expanded') === 'true';
      navTrigger.setAttribute('aria-expanded', String(!open));
      navMenu.hidden = open;
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navTrigger.setAttribute('aria-expanded', 'false');
      navMenu.hidden = true;
    }));
  }

  // ---------- MODAL ----------
  const modal = document.createElement('div');
  modal.className = 'uc-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="uc-modal__overlay" data-close></div>
    <div class="uc-modal__panel">
      <button class="uc-modal__close" type="button" aria-label="Close" data-close>×</button>
      <p class="uc-modal__eyebrow"></p>
      <h3 class="uc-modal__title"></h3>
      <p class="uc-modal__desc"></p>
      <dl class="uc-modal__spec"></dl>
    </div>`;
  document.body.appendChild(modal);
  const mEyebrow = modal.querySelector('.uc-modal__eyebrow');
  const mTitle = modal.querySelector('.uc-modal__title');
  const mDesc = modal.querySelector('.uc-modal__desc');
  const mSpec = modal.querySelector('.uc-modal__spec');
  const openModal = ({ eyebrow = '', title = '', desc = '', specs = '', accent = '#0A0A0A' } = {}) => {
    mEyebrow.textContent = eyebrow;
    mTitle.textContent = title;
    mDesc.textContent = desc;
    mSpec.innerHTML = specs;
    modal.style.setProperty('--accent', accent);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (!prefersReduced) {
      modal.querySelector('.uc-modal__panel').animate(
        [{ opacity: 0, transform: 'translate(-50%, -48%)' }, { opacity: 1, transform: 'translate(-50%, -50%)' }],
        { duration: 280, easing: 'ease-out', fill: 'forwards' }
      );
    }
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

  // ---------- REVEAL ON SCROLL ----------
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const siblings = Array.from(el.parentElement?.children || []).filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(el);
        el.style.transition = `opacity 600ms ${ease} ${idx * 90}ms, transform 600ms ${ease} ${idx * 90}ms`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; io.observe(el); });
  } else {
    reveals.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  // ---------- HERO ENTRANCE ----------
  if (!prefersReduced) {
    const letters = document.querySelectorAll('.hero__letter');
    letters.forEach((l, i) => {
      l.style.opacity = '0';
      l.style.transform = 'translateY(14px)';
      l.style.transition = `opacity 600ms ${ease} ${i * 55}ms, transform 600ms ${ease} ${i * 55}ms`;
    });
    requestAnimationFrame(() => requestAnimationFrame(() => letters.forEach(l => {
      l.style.opacity = '1'; l.style.transform = 'translateY(0)';
    })));
    const media = document.querySelector('.hero__media');
    if (media) {
      media.style.opacity = '0';
      media.style.transform = 'scale(0.97)';
      media.style.transition = `opacity 700ms ${ease} 500ms, transform 700ms ${ease} 500ms`;
      setTimeout(() => { media.style.opacity = '1'; media.style.transform = 'scale(1)'; }, 520);
    }
  }

  // ---------- LADDER NODES (timeline rail) ----------
  document.querySelectorAll('.ladder__item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      document.querySelectorAll('.ladder__item.is-active').forEach(n => n.classList.remove('is-active'));
      item.classList.add('is-active');
      const name = item.querySelector('.ladder__name')?.textContent || '';
      const scale = item.querySelector('.ladder__scale')?.textContent || '';
      const price = item.dataset.price || '';
      openModal({
        eyebrow: 'Scale ladder',
        title: `${name} · ${scale}`,
        desc: 'Same duck, five scales. Proportions are tuned per scale so the Architect reads as the same duck as the Micro — that is the architectural move.',
        specs: `<dt>Scale</dt><dd>${scale}</dd><dt>Line</dt><dd>${name}</dd><dt>Price</dt><dd>${price}</dd><dt>Material</dt><dd>Vulcanised rubber</dd>`
      });
    });
  });

  // ---------- TOOLTIP PILLS (eyebrows, list items, ladder marks) ----------
  const pillEls = document.querySelectorAll('.eyebrow, .architect__list li, .ladder__rule-mark');
  pillEls.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const label = el.textContent.trim();
      openModal({
        eyebrow: 'Detail',
        title: label.length > 48 ? label.slice(0, 48) + '…' : label,
        desc: 'Specification node. Tap any card, ladder item, or settings gear for the full data sheet. The system reserves saturation for a single interactive accent.',
        specs: `<dt>Label</dt><dd>${label}</dd><dt>Zone</dt><dd>${el.closest('section')?.className.split(' ')[0] || 'page'}</dd>`
      });
    });
  });

  // ---------- HEADER EXTRAS: settings gear + share counter ----------
  const header = document.querySelector('.site-header');
  if (header) {
    const extras = document.createElement('div');
    extras.className = 'uc-extras';
    extras.innerHTML = `
      <button class="uc-share" type="button" aria-label="Share">
        <span class="uc-share__lbl">Share</span>
        <span class="uc-share__count">0</span>
      </button>
      <button class="uc-gear" type="button" aria-label="Settings">⚙</button>`;
    header.appendChild(extras);

    const shareBtn = extras.querySelector('.uc-share');
    const shareCount = extras.querySelector('.uc-share__count');
    const SHARE_CAP = 999;
    shareBtn.addEventListener('click', () => {
      const n = Math.min(parseInt(shareCount.textContent, 10) + 1, SHARE_CAP);
      shareCount.textContent = n;
    });

    extras.querySelector('.uc-gear').addEventListener('click', () => {
      openModal({
        eyebrow: 'Settings',
        title: 'Display preferences',
        desc: 'Two-zone light/dark composition, reserved monochrome accent for the single call to action. Motion: opacity + 12px translate, 500ms, ease-out. Reduced motion collapses to 150ms opacity only.',
        specs: '<dt>Mode</dt><dd>Editorial · monochrome</dd><dt>Grid</dt><dd>12 columns</dd><dt>Motion</dt><dd>Restraint</dd><dt>Accent</dt><dd>#0A0A0A</dd>'
      });
    });
  }

  // ---------- SMOOTH SCROLL FALLBACK ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // ---------- INJECTED STYLES (modal + header extras + active node) ----------
  const css = document.createElement('style');
  css.textContent = `
    .uc-modal{position:fixed;inset:0;z-index:200;pointer-events:none;opacity:0;transition:opacity 200ms ${ease};--accent:#0A0A0A}
    .uc-modal.is-open{pointer-events:auto;opacity:1}
    .uc-modal__overlay{position:absolute;inset:0;background:rgba(10,10,10,0.55)}
    .uc-modal__panel{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(560px,calc(100vw - 32px));background:#fff;border:1px solid var(--ink);padding:36px 32px;max-height:85vh;overflow:auto}
    .uc-modal__close{position:absolute;top:10px;right:10px;width:36px;height:36px;font-size:24px;line-height:1;background:transparent;border:1px solid var(--rule)}
    .uc-modal__close:hover{background:var(--ink);color:#fff}
    .uc-modal__eyebrow{font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;font-weight:500}
    .uc-modal__title{font-family:'Unbounded',sans-serif;font-weight:700;font-size:clamp(22px,3.6vw,30px);margin-bottom:14px;letter-spacing:-0.01em;border-left:3px solid var(--accent);padding-left:14px}
    .uc-modal__desc{font-size:14px;line-height:1.6;color:var(--ink);margin-bottom:18px}
    .uc-modal__spec{display:grid;grid-template-columns:auto 1fr;gap:6px 18px;font-size:13px}
    .uc-modal__spec dt{color:var(--muted);text-transform:uppercase;letter-spacing:0.18em;font-size:10px;align-self:center}
    .uc-modal__spec dd{color:var(--ink)}
    .ladder__item.is-active{outline:2px solid var(--ink);outline-offset:-4px}
    .uc-extras{justify-self:end;display:inline-flex;align-items:center;gap:10px}
    .uc-share{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border:1px solid var(--rule);border-radius:999px;background:transparent;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:500;cursor:pointer;color:var(--ink);transition:background 200ms}
    .uc-share:hover{background:rgba(0,0,0,0.04)}
    .uc-share__count{min-width:22px;padding:2px 7px;background:var(--ink);color:#fff;border-radius:999px;font-size:10px;letter-spacing:0;text-align:center}
    .uc-gear{width:36px;height:36px;border:1px solid var(--rule);border-radius:999px;background:transparent;cursor:pointer;font-size:16px;color:var(--ink);display:grid;place-items:center;transition:background 200ms,transform 200ms}
    .uc-gear:hover{background:rgba(0,0,0,0.04);transform:rotate(40deg)}
    @media (max-width:720px){.uc-extras .uc-share__lbl{display:none}.uc-modal__panel{padding:28px 20px}}
  `;
  document.head.appendChild(css);
})();
