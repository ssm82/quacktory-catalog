// file: main.js
(() => {
  'use strict';

  // === Modal shell (injected once) ===
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" type="button" aria-label="Close">×</button>
      <div class="modal-accent" aria-hidden="true"></div>
      <p class="modal-eyebrow"></p>
      <h2 class="modal-title" id="modal-title"></h2>
      <p class="modal-desc"></p>
      <dl class="modal-meta"></dl>
      <div class="modal-share">
        <button class="modal-share-btn" type="button">
          <span class="modal-share-label">Share</span>
          <span class="modal-share-count">0</span>
        </button>
        <span class="modal-share-cap">/ 999</span>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const modal = overlay.querySelector('.modal');
  const modalAccent = overlay.querySelector('.modal-accent');
  const modalEyebrow = overlay.querySelector('.modal-eyebrow');
  const modalTitle = overlay.querySelector('.modal-title');
  const modalDesc = overlay.querySelector('.modal-desc');
  const modalMeta = overlay.querySelector('.modal-meta');
  const shareCountEl = overlay.querySelector('.modal-share-count');
  const shareBtn = overlay.querySelector('.modal-share-btn');
  const SHARE_CAP = 999;
  let shareCount = 0;
  let lastFocus = null;

  // === Injected styles (modal + gear + reveals + active states) ===
  const style = document.createElement('style');
  style.textContent = `
    .modal-overlay{position:fixed;inset:0;z-index:100;background:rgba(26,20,16,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .3s ease}
    .modal-overlay.is-open{opacity:1;pointer-events:auto}
    .modal{position:relative;background:#F2EDE2;color:#2A221C;max-width:560px;width:100%;border-radius:4px;padding:48px 40px 32px;font-family:'Manrope',sans-serif;transform:translateY(20px) scale(.98);transition:transform .35s cubic-bezier(.2,.7,.2,1);box-shadow:0 40px 80px -20px rgba(0,0,0,.5)}
    .modal-overlay.is-open .modal{transform:translateY(0) scale(1)}
    .modal-accent{position:absolute;top:0;left:0;right:0;height:4px;background:var(--modal-accent,#2A221C);border-radius:4px 4px 0 0}
    .modal-close{position:absolute;top:12px;right:12px;width:36px;height:36px;border:none;background:transparent;font-size:24px;line-height:1;color:#2A221C;cursor:pointer;border-radius:50%;transition:background .2s}
    .modal-close:hover{background:rgba(42,34,28,.08)}
    .modal-eyebrow{font-size:11px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#6B5F54;margin:0 0 14px}
    .modal-title{font-family:'Playfair Display',serif;font-weight:500;font-size:clamp(28px,4vw,40px);line-height:1.1;margin:0 0 14px;color:#1A1410;letter-spacing:-.01em}
    .modal-desc{font-size:14px;line-height:1.65;color:#6B5F54;margin:0 0 22px}
    .modal-meta{display:grid;grid-template-columns:auto 1fr;gap:8px 20px;margin:0 0 24px;font-size:13px}
    .modal-meta dt{color:#6B5F54;font-weight:500}
    .modal-meta dd{margin:0;color:#1A1410;font-weight:500}
    .modal-share{display:flex;align-items:center;gap:10px;padding-top:18px;border-top:1px solid rgba(42,34,28,.12)}
    .modal-share-btn{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;background:#2A221C;color:#F2EDE2;border:none;border-radius:999px;font-family:'Manrope',sans-serif;font-size:12px;font-weight:600;letter-spacing:.04em;cursor:pointer;transition:transform .25s,background .25s}
    .modal-share-btn:hover{transform:translateY(-1px);background:#1A1410}
    .modal-share-count{min-width:24px;text-align:center;background:rgba(242,237,226,.15);border-radius:999px;padding:2px 8px;font-variant-numeric:tabular-nums}
    .modal-share-cap{font-size:11px;color:#6B5F54;letter-spacing:.08em}
    .gear-btn{position:fixed;bottom:24px;right:24px;z-index:60;width:48px;height:48px;border-radius:50%;background:#2A221C;color:#F2EDE2;border:1px solid rgba(242,237,226,.15);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 32px -8px rgba(0,0,0,.4);transition:transform .4s cubic-bezier(.2,.7,.2,1),background .25s}
    .gear-btn:hover{transform:rotate(45deg) translateY(-2px);background:#1A1410}
    .gear-btn:focus-visible{outline:2px solid #C85A3A;outline-offset:3px}
    .reveal{opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
    .reveal.is-in{opacity:1;transform:translateY(0)}
    .scale-item,.craft-card,.b2b-swatch,.b2b-timeline li,.band-item{transition:transform .3s cubic-bezier(.2,.7,.2,1)}
    .scale-item:hover,.craft-card:hover{transform:translateY(-4px)}
    .b2b-swatch.is-active{outline:2px solid #2A221C;outline-offset:4px}
    .b2b-timeline li.is-active .b2b-tl-time{color:#C85A3A;font-weight:700}
  `;
  document.head.appendChild(style);

  // === Modal open/close ===
  function openModal(d) {
    lastFocus = document.activeElement;
    modalAccent.style.setProperty('--modal-accent', d.accent || '#2A221C');
    modalEyebrow.textContent = d.eyebrow || '';
    modalTitle.textContent = d.title || '';
    modalDesc.textContent = d.desc || '';
    modalMeta.innerHTML = '';
    (d.meta || []).forEach(([k, v]) => {
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      modalMeta.append(dt, dd);
    });
    shareCount = 0;
    shareCountEl.textContent = '0';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }
  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
  shareBtn.addEventListener('click', () => {
    if (shareCount >= SHARE_CAP) return;
    shareCount++;
    shareCountEl.textContent = shareCount;
    shareBtn.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }],
      { duration: 280, easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
  });

  // === Generic clickable wire-up helper ===
  function wire(els, onClick) {
    els.forEach(el => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.addEventListener('click', () => onClick(el));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
  }

  // === Products (5) ===
  wire(document.querySelectorAll('.scale-item'), item => {
    const variant = [...item.classList].find(c => c.startsWith('scale-') && c !== 'scale-item');
    const accent = getComputedStyle(item).getPropertyValue('--g-' + variant).trim() || '#C85A3A';
    const dim = item.querySelector('.scale-dim');
    const price = item.querySelector('.scale-price');
    openModal({
      accent,
      eyebrow: item.querySelector('.scale-line')?.textContent || 'Line',
      title: item.querySelector('.scale-name')?.textContent || '',
      desc: item.querySelector('.scale-audience')?.textContent || '',
      meta: [
        ['Size', dim?.childNodes[0]?.textContent.trim() || '—'],
        ['Comparison', item.querySelector('.scale-compare')?.textContent || '—'],
        ['Price', price?.childNodes[0]?.textContent.trim() || '—'],
        ['Delivery', item.querySelector('.scale-price-sub')?.textContent || '—']
      ]
    });
  });

  // === Craft cards (4) ===
  wire(document.querySelectorAll('.craft-card'), card => {
    openModal({
      accent: '#2A221C',
      eyebrow: card.querySelector('.craft-card-label')?.textContent || 'Production',
      title: card.querySelector('.craft-card-title')?.textContent || '',
      desc: card.querySelector('.craft-card-copy')?.textContent || '',
      meta: [
        ['Category', 'Production'],
        ['Standard', 'GOST · EN 71-3 · REACH'],
        ['Certificate', 'phthalate-free · BPA-free']
      ]
    });
  });

  // === B2B swatches (12) ===
  wire(document.querySelectorAll('.b2b-swatch'), sw => {
    document.querySelectorAll('.b2b-swatch.is-active').forEach(s => s.classList.remove('is-active'));
    sw.classList.add('is-active');
    const color = getComputedStyle(sw).getPropertyValue('--sw').trim();
    openModal({
      accent: color,
      eyebrow: 'TPM · Pigment Menu',
      title: sw.querySelector('.b2b-swatch-name')?.textContent || '',
      desc: `Through-pigment — the entire mass is colored before molding, not surface painting. UV and water resistant. HEX ${color}.`,
      meta: [
        ['Code', sw.querySelector('.b2b-swatch-code')?.textContent || '—'],
        ['HEX', color],
        ['Through-color', 'yes'],
        ['MOQ', '50 pcs. (Micro · Classic)']
      ]
    });
  });

  // === Timeline rail (3) ===
  wire(document.querySelectorAll('.b2b-timeline li'), li => {
    document.querySelectorAll('.b2b-timeline li.is-active').forEach(x => x.classList.remove('is-active'));
    li.classList.add('is-active');
    openModal({
      accent: '#C85A3A',
      eyebrow: 'Delivery times',
      title: li.querySelector('.b2b-tl-name')?.textContent || '',
      desc: `Production and delivery time for the batch: ${li.querySelector('.b2b-tl-time')?.textContent || '—'}. Micro and Classic — CDEK/Russian Post. Mega — pallet. Architect — special transport with installation.`,
      meta: [
        ['Lines', li.querySelector('.b2b-tl-name')?.textContent || '—'],
        ['Duration', li.querySelector('.b2b-tl-time')?.textContent || '—'],
        ['Contract', 'offer + invoice']
      ]
    });
  });

  // === Band values (6) ===
  wire(document.querySelectorAll('.band-item'), bi => {
    openModal({
      accent: '#2A221C',
      eyebrow: 'Quality standard',
      title: bi.querySelector('.band-word')?.textContent || '',
      desc: bi.querySelector('.band-sub')?.textContent || '',
      meta: [
        ['Category', 'Quality control'],
        ['Checks', '5 per batch'],
        ['Temperature', '−20 … +60 °C']
      ]
    });
  });

  // === Settings gear ===
  const gear = document.createElement('button');
  gear.className = 'gear-btn';
  gear.type = 'button';
  gear.setAttribute('aria-label', 'Settings');
  gear.textContent = '⚙';
  document.body.appendChild(gear);
  gear.addEventListener('click', () => {
    openModal({
      accent: '#6B5F54',
      eyebrow: 'Settings',
      title: 'Display settings',
      desc: 'This site does not use analytics, advertising, or cookie trackers. Only the editorial font Playfair Display, the human sans Manrope, and food-grade silicone in the frame.',
      meta: [
        ['Font', 'Playfair Display + Manrope'],
        ['Theme', 'editorial cream'],
        ['Cookie', 'no'],
        ['Sound', 'off']
      ]
    });
  });

  // === Scroll reveals (IntersectionObserver) ===
  const revealTargets = document.querySelectorAll(
    '.scale-item, .craft-card, .band-item, .b2b-swatch, .section-head, .signature, .b2b-aside'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => io.observe(el));

  // === Smooth-scroll fallback for nav anchors ===
  document.querySelectorAll('.nav-link[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();