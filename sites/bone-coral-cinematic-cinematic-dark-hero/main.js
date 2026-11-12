// file: main.js

// ===== Modal scaffold (injected once) =====
const SHARE_CAP = 99;
let shareCount = 0;
let activeNode = null;

const modal = document.createElement('div');
modal.className = 'qmodal';
modal.setAttribute('aria-hidden', 'true');
modal.innerHTML = `
  <div class="qmodal__overlay" data-close></div>
  <div class="qmodal__panel" role="dialog" aria-modal="true" aria-label="Object details">
    <button class="qmodal__close" data-close aria-label="Close">×</button>
    <div class="qmodal__media">
      <img class="qmodal__img" alt="">
      <span class="qmodal__tag"></span>
    </div>
    <div class="qmodal__body">
      <p class="qmodal__eyebrow">QUACKTORY · PASSPORT</p>
      <h3 class="qmodal__title"></h3>
      <p class="qmodal__desc"></p>
      <dl class="qmodal__facts"></dl>
      <div class="qmodal__actions">
        <button class="qmodal__share" type="button">
          <span class="qmodal__share-label">SHARE</span>
          <span class="qmodal__share-count">0 / ${SHARE_CAP}</span>
        </button>
        <button class="qmodal__gear" type="button" aria-label="Settings" title="Settings">⚙</button>
      </div>
      <p class="qmodal__settings" hidden>Passport settings: B2B / retail toggle, TPM pigment selector, PDF export — coming soon.</p>
    </div>
  </div>
`;
document.body.appendChild(modal);

const panel    = modal.querySelector('.qmodal__panel');
const img      = modal.querySelector('.qmodal__img');
const tag      = modal.querySelector('.qmodal__tag');
const titleEl  = modal.querySelector('.qmodal__title');
const descEl   = modal.querySelector('.qmodal__desc');
const factsEl  = modal.querySelector('.qmodal__facts');
const shareBtn = modal.querySelector('.qmodal__share');
const shareLbl = modal.querySelector('.qmodal__share-count');
const gearBtn  = modal.querySelector('.qmodal__gear');
const settingsMsg = modal.querySelector('.qmodal__settings');

function paintNode(node) {
  if (activeNode && activeNode !== node) activeNode.classList.remove('is-active');
  activeNode = node;
  node.classList.add('is-active');
  node.focus({ preventScroll: true });

  panel.style.setProperty('--qmodal-accent', node.dataset.glow || '#E63946');
  img.src = node.dataset.img || '';
  img.alt = node.querySelector('.node__name')?.textContent || '';
  tag.textContent = node.dataset.num || '';
  titleEl.textContent = node.querySelector('.node__name')?.textContent || node.dataset.line || '';
  descEl.innerHTML = `<em>${node.dataset.line || ''}</em> — ${node.dataset.aud || ''}`;

  const rows = [
    ['Size',     node.dataset.size],
    ['Audience', node.dataset.aud],
    ['Price',    node.dataset.price],
    ['Lead time',node.dataset.ship],
    ['Age',      node.dataset.age],
  ];
  factsEl.innerHTML = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<div class="qmodal__row"><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('');

  shareCount = 0;
  shareLbl.textContent = `0 / ${SHARE_CAP}`;
  shareBtn.disabled = false;
  shareBtn.classList.remove('is-cap');
  settingsMsg.hidden = true;
}

function open(node) {
  paintNode(node);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function openSettings() {
  if (activeNode) { activeNode.classList.remove('is-active'); activeNode = null; }
  panel.style.setProperty('--qmodal-accent', '#E63946');
  img.removeAttribute('src');
  img.alt = '';
  tag.textContent = '§ 00';
  titleEl.textContent = 'Settings';
  descEl.textContent = 'Theme switcher, regional prices (RUB / EUR), print mode, PDF export. Stored locally.';
  factsEl.innerHTML = '';
  settingsMsg.hidden = false;
  shareCount = 0;
  shareLbl.textContent = `0 / ${SHARE_CAP}`;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function close() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (activeNode) { activeNode.classList.remove('is-active'); activeNode = null; }
}

// ===== Single delegated click handler =====
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]'))           { close(); return; }
  if (e.target.closest('[data-action="settings"]')) { openSettings(); return; }

  const pill = e.target.closest('.node__tag');
  if (pill) {
    const n = pill.closest('.node');
    if (n) { e.preventDefault(); open(n); return; }
  }

  const node = e.target.closest('.node');
  if (node) { e.preventDefault(); open(node); return; }

  if (e.target.closest('.qmodal__share')) {
    if (shareCount < SHARE_CAP) {
      shareCount++;
      shareLbl.textContent = `${shareCount} / ${SHARE_CAP}`;
      if (shareCount >= SHARE_CAP) {
        shareBtn.disabled = true;
        shareBtn.classList.add('is-cap');
      }
    }
    return;
  }

  if (e.target.closest('.qmodal__gear')) {
    settingsMsg.hidden = !settingsMsg.hidden;
    return;
  }

  const cta = e.target.closest('[data-cta]');
  if (cta) {
    cta.classList.add('is-pulsed');
    setTimeout(() => cta.classList.remove('is-pulsed'), 650);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
});

// ===== Smooth scroll for in-page anchors =====
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Scroll-triggered reveals =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.node, .step, .section__head, .b2b__plate, .b2b__side, .manifesto, .foot__col')
  .forEach((el) => { el.classList.add('q-fade'); io.observe(el); });

// ===== Inject settings gear into the top bar =====
(() => {
  const meta = document.querySelector('.bar__meta');
  if (!meta || meta.querySelector('[data-action="settings"]')) return;
  const btn = document.createElement('button');
  btn.className = 'bar__gear';
  btn.type = 'button';
  btn.setAttribute('data-action', 'settings');
  btn.setAttribute('aria-label', 'Settings');
  btn.title = 'Settings';
  btn.textContent = '⚙';
  meta.appendChild(btn);
})();

// ===== Hover-class parity for nodes (CSS handles visuals; JS toggles a class) =====
document.querySelectorAll('.node').forEach((n) => {
  n.addEventListener('mouseenter', () => n.classList.add('is-hover'));
  n.addEventListener('mouseleave', () => n.classList.remove('is-hover'));
  n.addEventListener('focusin',  () => n.classList.add('is-hover'));
  n.addEventListener('focusout', () => n.classList.remove('is-hover'));
  n.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === n) {
      e.preventDefault();
      open(n);
    }
  });
});

// ===== B2B form: visual feedback only (no real submit) =====
const b2bForm = document.querySelector('.b2b__form');
if (b2bForm) {
  b2bForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = b2bForm.querySelector('[data-cta]');
    if (btn) {
      btn.classList.add('is-pulsed');
      setTimeout(() => btn.classList.remove('is-pulsed'), 800);
    }
  });
}
