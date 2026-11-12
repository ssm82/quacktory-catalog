// file: main.js
(() => {
  'use strict';

  // ---------- Modal ----------
  const modal = document.getElementById('modal');
  const fields = {};
  if (modal) {
    modal.querySelectorAll('[data-modal-field]').forEach((el) => {
      const key = el.getAttribute('data-modal-field');
      (fields[key] = fields[key] || []).push(el);
    });
  }
  const setField = (key, value) => {
    (fields[key] || []).forEach((el) => { el.textContent = value && value.trim() ? value.trim() : '—'; });
  };
  const pick = (el, sel) => {
    const node = el.querySelector(sel);
    return node ? node.textContent.trim() : '';
  };

  const fill = (el) => {
    const d = el.dataset || {};
    const isSwatch = el.classList.contains('swatch');
    const isScale = el.classList.contains('scale-mark');
    const isProd = el.classList.contains('prod-card');

    let name = d.name || '';
    let line = d.line || '';
    let size = d.size || '';
    let voice = d.voice || '';
    let price = d.price || '';
    let shipping = d.shipping || '';
    let spec = d.spec || '';

    if (isSwatch) {
      name = pick(el, '.swatch-name');
      line = pick(el, '.swatch-code');
      const m = (el.getAttribute('style') || '').match(/--c:\s*([^;]+)/);
      spec = m ? 'TPM pigment · ' + m[1].trim() : '';
    } else if (isScale) {
      name = pick(el, '.scale-line');
      size = pick(el, '.scale-size');
      voice = pick(el, '.scale-comp') + ' · ' + pick(el, '.scale-tag');
    } else if (isProd) {
      name = pick(el, '.prod-title');
      line = pick(el, '.prod-num');
      voice = pick(el, '.prod-text');
    } else {
      name = name || pick(el, '.line-name');
      size = size || pick(el, '.line-size');
      voice = voice || pick(el, '.line-voice');
      price = price || pick(el, '.line-price');
    }

    setField('line', line);
    setField('size', size);
    setField('name', name || 'Quacktory');
    setField('voice', voice);
    setField('price', price);
    setField('shipping', shipping);
    setField('spec', spec);
  };

  const openModal = (el) => {
    if (!modal) return;
    fill(el);
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const close = modal.querySelector('.modal-close');
    if (close) close.focus();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modal) {
    modal.addEventListener('click', (e) => {
      const trigger = e.target.closest ? e.target.closest('[data-close]') : null;
      if (trigger) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // ---------- Bind clickable subjects ----------
  document.querySelectorAll('.line-card, .scale-mark, .swatch, .prod-card').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(el);
    });
  });

  // ---------- Scale active state ----------
  document.querySelectorAll('.scale-mark').forEach((node) => {
    node.addEventListener('click', () => {
      document.querySelectorAll('.scale-mark').forEach((n) => n.classList.remove('is-active'));
      node.classList.add('is-active');
    });
  });

  // ---------- Get notified toggle ----------
  const cta = document.querySelector('.cta-pill');
  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      cta.classList.toggle('is-on');
    });
  }

  // ---------- Scroll cue ----------
  const cue = document.querySelector('.scroll-cue');
  if (cue) {
    cue.addEventListener('click', () => {
      const target = document.querySelector('#scale');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---------- Smooth scroll for in-page anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Entrance reveals ----------
  const revealTargets = document.querySelectorAll(
    '.section-head, .line-card, .prod-card, .scale-mark, .swatch, .b2b-copy, .palette, .manifesto-text, .footer-grid > *'
  );
  revealTargets.forEach((el) => el.classList.add('js-reveal'));
  requestAnimationFrame(() => requestAnimationFrame(() => {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }));
})();
