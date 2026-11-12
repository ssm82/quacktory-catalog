// file: main.js
const PIGMENT_META = 'A signature Quacktory Pigment Menu colour. Mass-dyed before moulding — the pigment never wears off or fades in the sun.';

function buildPigmentModal() {
  if (document.getElementById('modal-pigment')) return;
  const m = document.createElement('div');
  m.className = 'modal';
  m.id = 'modal-pigment';
  m.setAttribute('role', 'dialog');
  m.setAttribute('aria-modal', 'true');
  m.setAttribute('aria-labelledby', 'modal-pigment-title');
  m.setAttribute('aria-hidden', 'true');
  m.hidden = true;
  m.innerHTML = `
    <div class="modal__backdrop" data-close></div>
    <div class="modal__panel" role="document">
      <button class="modal__close" type="button" data-close aria-label="Close">×</button>
      <span class="modal__eyebrow">§ custom · TPM</span>
      <h3 class="modal__title" id="modal-pigment-title">—</h3>
      <p class="modal__meta" id="modal-pigment-meta">—</p>
      <dl class="modal__specs" id="modal-pigment-specs"></dl>
    </div>`;
  document.body.appendChild(m);
}

function openModal(el) {
  if (!el) return;
  document.querySelectorAll('.modal.is-open').forEach(open => {
    open.hidden = true;
    open.classList.remove('is-open');
    open.setAttribute('aria-hidden', 'true');
  });
  el.hidden = false;
  el.classList.add('is-open');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const close = el.querySelector('.modal__close');
  if (close) close.focus();
}

function closeModal() {
  document.querySelectorAll('.modal.is-open').forEach(open => {
    open.hidden = true;
    open.classList.remove('is-open');
    open.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

function openPigmentModal(name, hex) {
  buildPigmentModal();
  const m = document.getElementById('modal-pigment');
  m.querySelector('#modal-pigment-title').textContent = name;
  m.querySelector('#modal-pigment-meta').textContent = PIGMENT_META;
  const dl = m.querySelector('#modal-pigment-specs');
  dl.innerHTML = '';
  [['Name', name], ['Hex', hex], ['Form', 'mass dye'], ['Stability', 'UV · water · −20…+60 °C']]
    .forEach(([k, v]) => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = k;
      dd.textContent = v;
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
  openModal(m);
}

function setupScale() {
  document.querySelectorAll('.scale__node').forEach(node => {
    node.addEventListener('click', () => {
      openModal(document.getElementById(node.dataset.modal || ''));
    });
  });
}

function setupPalette() {
  document.querySelectorAll('.palette__swatch').forEach(sw => {
    sw.setAttribute('role', 'button');
    sw.setAttribute('tabindex', '0');
    const name = sw.dataset.name || '—';
    const hex = sw.style.getPropertyValue('--swatch').trim();
    const fire = () => openPigmentModal(name, hex);
    sw.addEventListener('click', fire);
    sw.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
  });
}

function setupModalDismiss() {
  document.addEventListener('click', e => {
    if (e.target.dataset && e.target.dataset.close !== undefined) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function setupCTA() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

function init() {
  document.querySelectorAll('.modal').forEach(m => m.setAttribute('aria-hidden', 'true'));
  setupScale();
  setupPalette();
  setupModalDismiss();
  setupCTA();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else { init(); }
