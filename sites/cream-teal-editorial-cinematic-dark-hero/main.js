// file: main.js

(() => {
  const modal = document.getElementById('duck-modal');
  if (!modal) return;

  const fields = {
    image: modal.querySelector('.modal__image'),
    eyebrow: modal.querySelector('#modal-eyebrow'),
    title: modal.querySelector('#modal-title'),
    lede: modal.querySelector('#modal-lede'),
    size: modal.querySelector('#modal-size'),
    audience: modal.querySelector('#modal-audience'),
    price: modal.querySelector('#modal-price'),
    lead: modal.querySelector('#modal-lead'),
    age: modal.querySelector('#modal-age'),
    material: modal.querySelector('#modal-material'),
  };

  let lastFocus = null;
  const closers = modal.querySelectorAll('[data-modal-close]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openModal(data) {
    lastFocus = document.activeElement;
    if (fields.eyebrow) fields.eyebrow.textContent = data.eyebrow || '';
    if (fields.title) fields.title.textContent = data.title || '';
    if (fields.lede) fields.lede.textContent = data.lede || '';
    if (fields.size) fields.size.textContent = data.size || '';
    if (fields.audience) fields.audience.textContent = data.audience || '';
    if (fields.price) fields.price.textContent = data.price || '';
    if (fields.lead) fields.lead.textContent = data.lead || '';
    if (fields.age) fields.age.textContent = data.age || '';
    if (fields.material) fields.material.textContent = data.material || '';
    if (fields.image && data.image) {
      fields.image.src = data.image;
      fields.image.alt = data.title || '';
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  closers.forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Focus trap inside the open modal
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || modal.hidden) return;
    const focusables = modal.querySelectorAll(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Ducks — every duck article opens the modal with its own data
  function bindDuck(duck) {
    const data = {
      eyebrow: duck.dataset.eyebrow,
      title: duck.dataset.title,
      lede: duck.dataset.lede,
      size: duck.dataset.size,
      audience: duck.dataset.audience,
      price: duck.dataset.price,
      lead: duck.dataset.lead,
      age: duck.dataset.age,
      material: duck.dataset.material,
      image: duck.dataset.image,
    };
    const activate = () => {
      document.querySelectorAll('.duck').forEach(d => d.classList.remove('is-active'));
      duck.classList.add('is-active');
      openModal(data);
    };
    duck.addEventListener('click', activate);
    duck.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  }
  document.querySelectorAll('.duck').forEach(bindDuck);

  // B2B palette chips — same modal, colour context
  document.querySelectorAll('.b2b__chip').forEach(chip => {
    const color = chip.textContent.trim();
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    const open = () => openModal({
      eyebrow: 'tpm palette',
      title: color,
      lede: 'A mass-tinted rubber colour from the Quacktory palette. Pigment is mixed into the compound before moulding — not painted on the surface.',
      size: 'applied to all five SKUs',
      audience: 'brands · venues · custom runs',
      price: 'included in standard lead time',
      lead: '3 weeks (micro / classic) · 6 weeks (designer / mega) · 12 weeks (architect)',
      age: 'indoor · uv-sensitive after 2+ years',
      material: 'vulcanised food-grade silicone or natural rubber with EPDM',
    });
    chip.addEventListener('click', open);
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  // Share counter — the edition pill increments the data HUD numerator, capped at 5
  const pill = document.querySelector('.hud--pill');
  const dataHud = document.querySelector('.hud--data');
  if (pill && dataHud) {
    const numEl = dataHud.querySelector('.hud__data-num');
    const cap = 5;
    let count = 0;
    if (numEl) {
      const m = numEl.textContent.split('/')[0].match(/\d+/);
      if (m) count = Math.min(parseInt(m[0], 10), cap);
    }
    pill.removeAttribute('aria-hidden');
    pill.setAttribute('role', 'button');
    pill.setAttribute('tabindex', '0');
    pill.setAttribute('aria-label', 'Share — increment viewer count');
    const bump = () => {
      if (count >= cap) return;
      count++;
      if (numEl) {
        const padded = String(count).padStart(2, '0');
        numEl.textContent = `${padded} / ${String(cap).padStart(2, '0')}`;
      }
      pill.classList.add('is-bumped');
      setTimeout(() => pill.classList.remove('is-bumped'), 320);
    };
    pill.addEventListener('click', bump);
    pill.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        bump();
      }
    });
  }

  // Settings / system note — the ring opens the modal with a short settings message
  const ring = document.querySelector('.hud--ring');
  if (ring) {
    ring.removeAttribute('aria-hidden');
    ring.setAttribute('role', 'button');
    ring.setAttribute('tabindex', '0');
    ring.setAttribute('aria-label', 'System note — how the duck is made');
    const open = () => openModal({
      eyebrow: 'system note',
      title: 'how the duck is made',
      lede: 'A single mould, vulcanised rubber, hand-painted eyes. The shape is the same from 4 cm to 3 m — only the moulding process scales.',
      size: '4 cm → 3 m',
      audience: 'collectors · designers · brands',
      price: 'from $8 to price-on-request',
      lead: 'today (micro) · 12 weeks (architect)',
      age: 'indoor use · -20°C to +60°C',
      material: 'food-grade silicone · natural rubber with EPDM',
    });
    ring.addEventListener('click', open);
    ring.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });

  // Respect prefers-reduced-motion: stop the particle drift
  if (reduceMotion) {
    document.querySelectorAll('.petal').forEach(p => {
      p.style.animation = 'none';
    });
  }
})();
