// file: main.js
(() => {
  'use strict';

  // ---- Data: modal content keyed by data-modal values ----
  const MODAL_DATA = {
    'architect-drop': { kicker: 'News · 10.03', title: 'Architect drop — 3 m at the Polyforum, Mexico City', body: 'A three-metre duck, cast in one pour, installed this week at the Polyforum Siqueiros. Painted by hand in TPM Cream over twelve working days.', accent: '#D6562A', tag: 'Architect · 3 m' },
    'tseloval':       { kicker: 'News · 09.28', title: 'Designer collab with studio Tseloval — 240 pieces', body: 'The Tseloval duck returns for a 2024 run of 240 hand-poured pieces, signed on the foot and numbered on the belly.', accent: '#4A4630', tag: 'Designer · 30 cm' },
    'micro-return':   { kicker: 'News · 09.22', title: 'Micro 4 cm returns in twelve TPM pigments, ships today', body: 'The original keyring duck, re-cast in all twelve Pantone-equivalent tones. Ships same day from the workshop in Khimki.', accent: '#D6562A', tag: 'Micro · 4 cm' },
    'casting':        { kicker: 'News · 09.15', title: 'How we cast a 1.5 m duck in one pour — production notes', body: 'A long-form piece on rotational moulding, vacuum forming, and why we never glue seams. Includes a four-minute timelapse from the floor.', accent: '#1A1A1A', tag: 'Production' },
    'tpm':            { kicker: 'News · 09.08', title: 'B2B — the Quacktory Pigment Menu opens to twelve Pantone-equal tones', body: 'Twelve tested tones, three gloss levels, full safety data. B2B enquiries now ship with a printed swatch card on request.', accent: '#3D3924', tag: 'B2B · Pigments' },
    'cert':           { kicker: 'News · 09.01', title: 'EN 71-3 and REACH re-test passed, certificates renewed', body: 'Quarterly re-test passed clean across all five lines. Certificates and SDS are linked from the footer of every product page.', accent: '#1A1A1A', tag: 'Compliance' },

    'micro-lead':     { kicker: 'Line 01 · 4 — 8 cm', title: 'A duck for a keyring, not a bath.', body: 'The Micro line: a thumb-sized duck, vulcanized in one piece, in twelve TPM pigments. Sits on a keyring, a watch dial, a window ledge.', accent: '#D6562A', tag: 'Micro · from 290 ₽' },
    'micro-mustard':  { kicker: 'Micro · 4 cm',      title: 'Quack keychain, mustard', body: 'TPM Mustard 14-0848, food-grade silicone, brass keyring. From 290 ₽, ships today.', accent: '#D6562A', tag: '4 cm · 290 ₽' },
    'micro-terracotta':{ kicker: 'Micro · 4 cm',     title: 'Quack keychain, terracotta', body: 'TPM Terracotta 17-1456, food-grade silicone, brass keyring. From 290 ₽, ships today.', accent: '#D6562A', tag: '4 cm · 290 ₽' },
    'micro-ink':      { kicker: 'Micro · 4 cm',      title: 'Quack keychain, ink', body: 'TPM Ink 19-3911, food-grade silicone, brass keyring. From 290 ₽, ships today.', accent: '#D6562A', tag: '4 cm · 290 ₽' },

    'classic-bath':   { kicker: 'Classic · 18 cm',   title: 'The Bath One, 18 cm', body: 'The duck that goes in the bath. Vulcanized rubber, no plastic eyes, 1 290 ₽, ships today.', accent: '#4A4630', tag: '18 cm · 1 290 ₽' },
    'classic-office': { kicker: 'Classic · 12 cm',   title: 'The Office One, 12 cm', body: 'A desk duck. Sits next to the monitor, holds a paperclip, never looks bored. 890 ₽, ships today.', accent: '#4A4630', tag: '12 cm · 890 ₽' },
    'classic-lead':   { kicker: 'Line 02 · 10 — 25 cm', title: 'Vulcanized in one piece. No plastic eyes.', body: 'The Classic line is compression-moulded in aluminium, drop-tested 5 times from 1 m onto concrete, and carries the GOST 25779-83 mark.', accent: '#4A4630', tag: 'Classic · from 890 ₽' },

    'designer-lead':  { kicker: 'Line 03 · 15 — 30 cm', title: 'A new duck every season, signed by the author.', body: 'Hand-poured in silicone moulds from original illustrations. Runs of 240 to 300 pieces, each signed and numbered, with EN 71-3 and REACH certificates.', accent: '#1A1A1A', tag: 'Designer · from 2 900 ₽' },
    'designer-tseloval':{ kicker: 'Designer · 30 cm', title: 'Tseloval, 2024', body: 'Six weeks lead time. 240 pieces. 4 900 ₽. Signed on the foot, numbered on the belly.', accent: '#1A1A1A', tag: '30 cm · 4 900 ₽' },
    'designer-hesper':{ kicker: 'Designer · 22 cm',  title: 'Hesper, 2023', body: 'Six weeks lead time. 300 pieces. 3 600 ₽. The dark-olive line that started the run.', accent: '#1A1A1A', tag: '22 cm · 3 600 ₽' },
    'designer-brick': { kicker: 'Designer · 18 cm',  title: 'Pale Brick, 2022', body: 'Six weeks lead time. 280 pieces. 2 900 ₽. The first of the new pigment set.', accent: '#1A1A1A', tag: '18 cm · 2 900 ₽' },

    'mega-60':        { kicker: 'Line 04 · 60 cm',   title: 'The 60 cm — the smallest of the big ones.', body: 'Rotational moulding, fibreglass core, twelve TPM pigments. The duck that goes in a window or on a stage.', accent: '#F2EDE3', tag: 'Mega · from 49 000 ₽' },
    'mega-120':       { kicker: 'Line 04 · 120 cm',  title: 'The 120 cm. Pallet delivery, indoor only.', body: 'Six weeks lead time, UV-protected, −20 °C to +60 °C. Pallet delivery, white-glove install on request.', accent: '#F2EDE3', tag: 'Mega · 120 cm' },

    'settings':       { kicker: 'Quacktory · Settings', title: 'A short note on settings', body: 'This is a static editorial page. The only adjustable surface is the share counter, the modal close, and the smooth-scroll. The site does not set cookies, run analytics, or fingerprint the device. That is the entire settings menu.', accent: '#D6562A', tag: 'Preferences' }
  };

  // ---- Modal build ----
  const overlay = document.createElement('div');
  overlay.className = 'qk-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="qk-modal" role="document">
      <button class="qk-close" type="button" aria-label="Close">×</button>
      <p class="qk-kicker"></p>
      <h3 class="qk-title"></h3>
      <p class="qk-body"></p>
      <div class="qk-foot">
        <span class="qk-tag"></span>
        <div class="qk-share">
          <span class="qk-share-label">SHARED</span>
          <span class="qk-share-count">0</span>
          <span class="qk-share-cap">/ 50</span>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const modalEl    = overlay.querySelector('.qk-modal');
  const kickerEl   = overlay.querySelector('.qk-kicker');
  const titleEl    = overlay.querySelector('.qk-title');
  const bodyEl     = overlay.querySelector('.qk-body');
  const tagEl      = overlay.querySelector('.qk-tag');
  const countEl    = overlay.querySelector('.qk-share-count');
  const closeBtn   = overlay.querySelector('.qk-close');
  let shareCount   = 0;
  const SHARE_CAP  = 50;

  // Inject the modal styles once (kept in JS to avoid touching CSS)
  const style = document.createElement('style');
  style.textContent = `
    .qk-overlay{position:fixed;inset:0;background:rgba(10,10,10,0.55);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s ease}
    .qk-overlay.is-open{opacity:1;pointer-events:auto}
    .qk-modal{position:relative;max-width:560px;width:calc(100% - 40px);background:var(--surface);color:var(--ink);padding:36px 32px 28px;border:1px solid rgba(26,26,26,0.12);transform:translateY(12px) scale(.98);transition:transform .3s cubic-bezier(.2,.8,.2,1);box-shadow:0 30px 80px -20px rgba(0,0,0,0.4)}
    .qk-overlay.is-open .qk-modal{transform:translateY(0) scale(1)}
    .qk-close{position:absolute;top:10px;right:14px;background:transparent;border:0;font-size:28px;line-height:1;cursor:pointer;color:var(--ink);width:32px;height:32px;display:flex;align-items:center;justify-content:center;transition:color .2s,transform .2s}
    .qk-close:hover{color:var(--accent);transform:rotate(90deg)}
    .qk-kicker{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
    .qk-title{font-family:var(--font-display);font-size:clamp(28px,4vw,42px);line-height:1.05;letter-spacing:-.005em;margin-bottom:14px;color:var(--ink)}
    .qk-body{font-size:14px;line-height:1.6;color:#333;margin-bottom:22px}
    .qk-foot{display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid rgba(26,26,26,0.12);font-size:10px;letter-spacing:.2em;text-transform:uppercase}
    .qk-tag{color:var(--muted)}
    .qk-share{display:flex;gap:6px;align-items:center}
    .qk-share-label{color:var(--muted)}
    .qk-share-count{color:var(--accent);font-weight:600;font-size:12px}
    .qk-share-cap{color:var(--muted)}
    .qk-cta-share{background:var(--accent);color:#fff;border:0;padding:6px 14px;font-size:10px;letter-spacing:.2em;cursor:pointer;text-transform:uppercase;transition:background .2s}
    .qk-cta-share:hover{background:#b04520}
  `;
  document.head.appendChild(style);

  // Add a share button dynamically into the foot
  const shareBtn = document.createElement('button');
  shareBtn.className = 'qk-cta-share';
  shareBtn.type = 'button';
  shareBtn.textContent = 'Share';
  shareBtn.style.marginLeft = '12px';
  shareBtn.addEventListener('click', () => {
    if (shareCount >= SHARE_CAP) return;
    shareCount += 1;
    countEl.textContent = shareCount;
    if (shareCount === SHARE_CAP) {
      shareBtn.disabled = true;
      shareBtn.textContent = 'Capped';
      shareBtn.style.opacity = '0.5';
      shareBtn.style.cursor = 'not-allowed';
    }
  });
  overlay.querySelector('.qk-share').after(shareBtn);

  function openModal(key) {
    const d = MODAL_DATA[key] || {
      kicker: 'Quacktory',
      title: key.replace(/-/g, ' '),
      body: 'A short note on this subject. The line is described in the section above; the modal here is a second-screen reading of the same card.',
      accent: '#D6562A',
      tag: key
    };
    kickerEl.textContent = d.kicker;
    titleEl.textContent  = d.title;
    bodyEl.textContent   = d.body;
    tagEl.textContent    = d.tag;
    modalEl.style.borderTop = `3px solid ${d.accent}`;
    shareCount = 0;
    countEl.textContent = '0';
    shareBtn.disabled = false;
    shareBtn.textContent = 'Share';
    shareBtn.style.opacity = '1';
    shareBtn.style.cursor = 'pointer';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ---- Wire every data-modal subject on the page ----
  document.querySelectorAll('[data-modal]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-modal');
      if (key) openModal(key);
    });
  });

  // ---- Settings gear (floating, bottom-left) ----
  const gear = document.createElement('button');
  gear.className = 'qk-gear';
  gear.type = 'button';
  gear.setAttribute('aria-label', 'Settings');
  gear.innerHTML = '⚙';
  gear.style.cssText = 'position:fixed;left:20px;bottom:20px;width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--surface);border:0;font-size:20px;cursor:pointer;z-index:90;box-shadow:0 10px 30px -10px rgba(0,0,0,0.4);transition:transform .35s ease,background .2s';
  gear.addEventListener('mouseenter', () => { gear.style.transform = 'rotate(60deg)'; });
  gear.addEventListener('mouseleave', () => { gear.style.transform = 'rotate(0)'; });
  gear.addEventListener('click', () => openModal('settings'));
  document.body.appendChild(gear);

  // ---- Smooth scroll fallback for nav anchors ----
  document.querySelectorAll('.nav-item, .wordmark, .architect-cta, .see-all').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

  // ---- IntersectionObserver: stagger cards on view ----
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.style.transition = 'opacity .8s ease, transform .8s ease';
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0)';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.card, .rail-item, .architect-figure, .orange-inner, .prod-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      io.observe(el);
    });
  }

  // ---- Hero caption: cycle through three lines ----
  const cap = document.querySelector('.hero-caption');
  if (cap) {
    const lines = [
      'No. 12 — the duck that will not get in the water.',
      'No. 12 — hand-poured, hand-painted, hand-numbered.',
      'No. 12 — a duck, but not as you know it.'
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % lines.length;
      cap.style.opacity = '0';
      setTimeout(() => {
        cap.textContent = lines[i];
        cap.style.opacity = '1';
      }, 250);
    }, 4200);
    cap.style.transition = 'opacity .25s ease';
  }
})();
