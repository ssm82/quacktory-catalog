// file: main.js
const SKUS = {
  Micro:     { title: 'An everyday keychain.',     tag: '№ 001 / Micro',     size: '4–8 cm',     price: 'from $7',     lead: '3 weeks', age: '6+' },
  Classic:   { title: 'The duck that lives on a shelf.', tag: '№ 002 / Classic',   size: '10–25 cm',   price: 'from $18',   lead: '3 weeks', age: '3+' },
  Designer:  { title: 'Collaboration. Limited. Story.', tag: '№ 003 / Designer',  size: '15–30 cm',   price: 'from $55',   lead: '6 weeks', age: '6+ · collectible' },
  Mega:      { title: 'An object, not a toy.',        tag: '№ 004 / Mega',      size: '50–120 cm',  price: 'from $350',  lead: '6 weeks', age: 'art object' },
  Architect: { title: 'A duck for the foyer.',                 tag: '№ 005 / Architect', size: '1.5–3 m',    price: 'on request',   lead: '12 weeks',age: 'installation' }
};

const SHARE_CAP = 999;
let shareCount = 0;

function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.hidden = false;
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => m.classList.add('is-open'));
  const focusable = m.querySelector('.modal__close, .modal__title');
  if (focusable) focusable.focus({ preventScroll: true });
}

function closeModal(m) {
  if (!m) return;
  m.classList.remove('is-open');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { m.hidden = true; }, 220);
}

function closeAll() {
  document.querySelectorAll('.modal').forEach(closeModal);
}

function wireScaleNodes() {
  document.querySelectorAll('.scale__node').forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.scale__node').forEach(n => n.classList.remove('is-active'));
      node.classList.add('is-active');
      const sku = node.dataset.sku;
      const id = `modal-${sku.toLowerCase()}`;
      openModal(id);
    });
  });
}

function wireCards() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.modal;
      if (id) openModal(id);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.dataset.modal;
        if (id) openModal(id);
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
  });
}

function wireCloseTriggers() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-close]');
    if (t) {
      const m = t.closest('.modal');
      if (m) closeModal(m);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
}

function wireHeroCta() {
  const cta = document.querySelector('.hero__cta');
  if (!cta) return;
  cta.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('scale');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function wireShare() {
  const triggers = document.querySelectorAll('[data-share]');
  if (!triggers.length) return;
  triggers.forEach(btn => {
    const label = document.createElement('span');
    label.className = 'share__count';
    label.textContent = shareCount;
    btn.appendChild(label);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (shareCount < SHARE_CAP) {
        shareCount++;
        label.textContent = shareCount;
        btn.classList.add('is-pulsed');
        setTimeout(() => btn.classList.remove('is-pulsed'), 400);
      }
    });
  });
}

function wireSettings() {
  const gear = document.querySelector('[data-settings]');
  if (!gear) return;
  gear.addEventListener('click', (e) => {
    e.preventDefault();
    let m = document.getElementById('modal-settings');
    if (!m) {
      m = document.createElement('div');
      m.className = 'modal';
      m.id = 'modal-settings';
      m.setAttribute('aria-hidden', 'true');
      m.innerHTML = `
        <div class="modal__backdrop" data-close></div>
        <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-settings-title">
          <button class="modal__close" data-close aria-label="Close">×</button>
          <span class="modal__tag">№ 000 / Settings</span>
          <h3 class="modal__title" id="modal-settings-title">System settings.</h3>
          <p class="modal__copy">Session parameters, units (cm / inches), and animation preferences are stored locally. There's nothing here worth changing manually — Quacktory works the way it should, out of the box.</p>
          <dl class="modal__spec">
            <div><dt>Units</dt><dd>centimeters</dd></div>
            <div><dt>Animations</dt><dd>enabled</dd></div>
            <div><dt>Session</dt><dd>${(performance.now()/1000).toFixed(1)} s</dd></div>
          </dl>
        </div>`;
      document.body.appendChild(m);
    }
    m.hidden = false;
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => m.classList.add('is-open'));
  });
}

function wireTopbar() {
  document.querySelectorAll('.topbar__link[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function wireScrollFade() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.card, .scale__node, .step').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

function init() {
  wireScaleNodes();
  wireCards();
  wireCloseTriggers();
  wireHeroCta();
  wireShare();
  wireSettings();
  wireTopbar();
  wireScrollFade();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
