// file: main.js
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- injected styles (kept inside JS to stay self-contained) ----------
  const css = document.createElement('style');
  css.textContent = `
    .q-modal{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:24px}
    .q-modal.is-open{display:flex}
    .q-modal-overlay{position:absolute;inset:0;background:rgba(10,10,10,.74);backdrop-filter:blur(2px);cursor:pointer}
    .q-modal-panel{position:relative;background:#F2F2F0;max-width:640px;width:100%;max-height:88vh;overflow-y:auto;padding:44px 40px 40px;border-top:6px solid var(--accent,#7CFAB1);box-shadow:0 24px 60px rgba(0,0,0,.18);animation:qModalIn .32s cubic-bezier(.2,.7,.2,1)}
    @keyframes qModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    .q-modal-close{position:absolute;top:12px;right:12px;width:36px;height:36px;border:0;background:transparent;font-size:24px;line-height:1;cursor:pointer;color:#0A0A0A}
    .q-modal-close:hover{color:#7CFAB1}
    .q-modal-eyebrow{font-family:Inter,sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#7A7A7A;margin:0 0 14px;font-weight:500}
    .q-modal-title{font-family:Manrope,sans-serif;font-size:34px;line-height:1.04;letter-spacing:-.02em;margin:0 0 14px;color:#0A0A0A;font-weight:600}
    .q-modal-desc{font-size:14px;line-height:1.6;color:#1a1a1a;margin:0 0 26px;max-width:48ch}
    .q-modal-grid{display:grid;grid-template-columns:1fr;border-top:1px solid #111}
    .q-modal-row{display:grid;grid-template-columns:140px 1fr;gap:18px;padding:12px 0;border-bottom:1px solid #111;font-size:13px;line-height:1.5}
    .q-modal-key{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#7A7A7A;font-weight:500;padding-top:2px}
    .q-modal-val{color:#0A0A0A}
    .q-nav-gear{background:transparent;border:1px solid #111;width:34px;height:34px;border-radius:50%;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;margin-right:14px;color:#0A0A0A;transition:background .2s,transform .2s;font-family:inherit}
    .q-nav-gear:hover{background:#7CFAB1;transform:rotate(45deg)}
    .q-share{position:fixed;bottom:22px;right:22px;z-index:30;background:#0A0A0A;color:#F2F2F0;border:0;padding:12px 18px;border-radius:999px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;display:inline-flex;gap:10px;align-items:center;font-weight:600;font-family:Inter,sans-serif;transition:background .2s,transform .2s}
    .q-share:hover{background:#1a1a1a;transform:translateY(-1px)}
    .q-share-count{background:#7CFAB1;color:#0A0A0A;padding:2px 8px;border-radius:999px;font-size:10px;letter-spacing:.04em;min-width:22px;text-align:center;font-weight:700}
    .q-reveal{opacity:0;transform:translateY(14px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
    .q-reveal.is-visible{opacity:1;transform:none}
    .q-ladder-item{cursor:pointer;transition:background .25s ease}
    .q-ladder-item:hover{background:rgba(124,250,177,.08)}
    .q-ladder-item.is-active .ladder-marker{background:#7CFAB1 !important;transform:scale(1.25)}
    .q-collection-row{transition:background .25s ease,box-shadow .25s ease}
    .q-collection-row:focus-visible{outline:2px solid #7CFAB1;outline-offset:-2px}
    @media (prefers-reduced-motion: reduce){
      .q-reveal{opacity:1 !important;transform:none !important;transition:none !important}
      .q-modal-panel{animation:none !important}
    }
  `;
  document.head.appendChild(css);

  // ---------- modal scaffolding ----------
  const modal = document.createElement('div');
  modal.className = 'q-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="q-modal-overlay" data-modal-close aria-label="Close modal"></div>
    <div class="q-modal-panel" role="document">
      <button class="q-modal-close" data-modal-close aria-label="Close">×</button>
      <div class="q-modal-body"></div>
    </div>`;
  document.body.appendChild(modal);
  const modalBody = modal.querySelector('.q-modal-body');
  let lastFocus = null;

  function openModal(html, accent) {
    lastFocus = document.activeElement;
    modalBody.innerHTML = html;
    modal.style.setProperty('--accent', accent || '#7CFAB1');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.q-modal-close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }
  function closeModal() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-modal-close]')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // ---------- collection rows → modal ----------
  const fieldLabels = {
    tag: 'Tag', size: 'Size', audience: 'Audience', moulding: 'Moulding',
    tooling: 'Tooling', cycle: 'Cycle', material: 'Material', packaging: 'Packaging',
    shipping: 'Shipping', price: 'Price', lead: 'Lead time', age: 'Age',
  };
  const lineIndex = { micro: 1, classic: 2, designer: 3, mega: 4, architect: 5 };

  document.querySelectorAll('.collection-row').forEach((row) => {
    row.classList.add('q-collection-row');
    const open = () => {
      const d = row.dataset;
      const rows = Object.keys(fieldLabels)
        .filter((k) => d[k])
        .map((k) => `<div class="q-modal-row"><span class="q-modal-key">${fieldLabels[k]}</span><span class="q-modal-val">${d[k]}</span></div>`)
        .join('');
      const desc = row.querySelector('.collection-desc')?.textContent || '';
      const accent = (row.classList.contains('collection-row-dark') || row.classList.contains('collection-row-navy')) ? '#7CFAB1' : '#0A0A0A';
      const fig = String(lineIndex[d.line] || '0').padStart(2, '0');
      openModal(`
        <p class="q-modal-eyebrow">${d.tag || 'Collection line'} · Fig. 0${fig}</p>
        <h2 class="q-modal-title">${d.name || ''}</h2>
        <p class="q-modal-desc">${desc}</p>
        <div class="q-modal-grid">${rows}</div>
      `, accent);
    };
    row.addEventListener('click', (e) => {
      if (e.target.closest('a[href]')) return;
      open();
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  // ---------- ladder nodes → modal + active toggle ----------
  const ladderMap = {
    'ladder-marker-1': { name: 'Micro',     size: '4 cm',  note: 'Thumb-sized. Keyring, pocket, locker magnet. The first conversation with the duck.' },
    'ladder-marker-2': { name: 'Classic',   size: '15 cm', note: 'Palm-sized. The duck that earns its place on a shelf, a windowsill, a meeting-room desk.' },
    'ladder-marker-3': { name: 'Designer',  size: '30 cm', note: 'Cat-sized. Hand-cast in limited runs with illustrator collabs and a paper certificate.' },
    'ladder-marker-4': { name: 'Mega',      size: '1 m',   note: 'Child-sized. Rotational-moulded with an internal fibreglass frame for podiums and shop windows.' },
    'ladder-marker-5': { name: 'Architect', size: '3 m',   note: 'Bear-sized. Sculptural casting against a CNC-milled master, internal steel frame. Mounted by a certified crew.' },
  };

  document.querySelectorAll('.ladder-item').forEach((item) => {
    const marker = item.querySelector('[class*="ladder-marker-"]');
    if (!marker) return;
    const cls = Array.from(marker.classList).find((c) => /^ladder-marker-\d+$/.test(c));
    const data = cls && ladderMap[cls];
    if (!data) return;

    item.classList.add('q-ladder-item');
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Ladder node ${data.name}, ${data.size}`);

    const open = () => {
      openModal(`
        <p class="q-modal-eyebrow">Ladder node ${cls.slice(-1)} / 5</p>
        <h2 class="q-modal-title">${data.name}</h2>
        <p class="q-modal-desc">${data.note}</p>
        <div class="q-modal-grid">
          <div class="q-modal-row"><span class="q-modal-key">Height</span><span class="q-modal-val">${data.size}</span></div>
          <div class="q-modal-row"><span class="q-modal-key">Position</span><span class="q-modal-val">Step ${cls.slice(-1)} of 5</span></div>
          <div class="q-modal-row"><span class="q-modal-key">Line</span><span class="q-modal-val">${data.name}</span></div>
          <div class="q-modal-row"><span class="q-modal-key">Scale</span><span class="q-modal-val">×750 (Micro → Architect)</span></div>
        </div>
      `, '#7CFAB1');
      document.querySelectorAll('.q-ladder-item').forEach((i) => i.classList.remove('is-active'));
      item.classList.add('is-active');
    };
    item.addEventListener('click', open);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  // ---------- settings gear (nav) ----------
  const navInner = document.querySelector('.nav-inner');
  if (navInner) {
    const gear = document.createElement('button');
    gear.className = 'q-nav-gear';
    gear.setAttribute('aria-label', 'Settings');
    gear.setAttribute('title', 'Settings');
    gear.textContent = '⚙';
    const cta = navInner.querySelector('.nav-cta');
    if (cta) navInner.insertBefore(gear, cta); else navInner.appendChild(gear);
    gear.addEventListener('click', () => {
      openModal(`
        <p class="q-modal-eyebrow">Settings</p>
        <h2 class="q-modal-title">Display preferences</h2>
        <p class="q-modal-desc">A printed catalog, served on screen. Motion, language, and contrast follow your system. Reduced motion is honored automatically.</p>
        <div class="q-modal-grid">
          <div class="q-modal-row"><span class="q-modal-key">Motion</span><span class="q-modal-val">${reduceMotion ? 'Reduced' : 'Standard'}</span></div>
          <div class="q-modal-row"><span class="q-modal-key">Type system</span><span class="q-modal-val">Manrope · Inter</span></div>
          <div class="q-modal-row"><span class="q-modal-key">Language</span><span class="q-modal-val">English (US)</span></div>
          <div class="q-modal-row"><span class="q-modal-key">Catalog edition</span><span class="q-modal-val">02 · Winter</span></div>
        </div>
      `, '#7CFAB1');
    });
  }

  // ---------- share counter (fixed, capped) ----------
  const share = document.createElement('button');
  share.className = 'q-share';
  share.type = 'button';
  share.setAttribute('aria-label', 'Share this catalog');
  share.innerHTML = `Share <span class="q-share-count" aria-live="polite">0</span>`;
  document.body.appendChild(share);
  let shareCount = 0;
  const SHARE_CAP = 999;
  const shareCountEl = share.querySelector('.q-share-count');
  share.addEventListener('click', () => {
    if (shareCount < SHARE_CAP) {
      shareCount++;
      shareCountEl.textContent = shareCount;
    }
    if (navigator.share) {
      navigator.share({ title: document.title, url: location.href }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href).catch(() => {});
    }
  });

  // ---------- scroll reveals ----------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const targets = document.querySelectorAll('.ladder-item, .collection-row, .credo-band, .production-block');
    targets.forEach((el, i) => {
      el.classList.add('q-reveal');
      el.style.transitionDelay = ((i % 5) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.ladder-item, .collection-row, .credo-band, .production-block')
      .forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- smooth-scroll fallback for older engines ----------
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const tgt = document.getElementById(id);
        if (tgt) { e.preventDefault(); tgt.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }
})();
