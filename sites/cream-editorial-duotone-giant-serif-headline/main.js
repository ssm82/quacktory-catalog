// ============================================================
// QUACKTORY · interactive bits (vanilla, no deps)
// - IntersectionObserver scroll fade-in for moodboard cards
// - Modal: opens on card / rail-node click, closes on overlay / X / Esc
// - Smooth-scroll polyfill for browsers without CSS scroll-behavior
// ============================================================

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---------- Smooth-scroll polyfill ----------
if (!('scrollBehavior' in document.documentElement.style)) {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const tgt = document.querySelector(id);
        if (tgt) {
          e.preventDefault();
          tgt.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// ---------- Card reveal (staggered cascade) ----------
const cards = $$('.card');
cards.forEach((el, i) => {
  const delay = (i % 3) * 90 + Math.floor(i / 3) * 60;
  setTimeout(() => el.classList.add('is-visible'), 120 + delay);
});

// ---------- Modal ----------
const modal = $('#modal');
const mTitle = $('#modal-title');
const mDesc = $('#modal-desc');
const mEyebrow = $('#modal-eyebrow');
const mSize = $('#modal-size');

function openModal({ title, desc, size, eyebrow }) {
  mTitle.textContent = title || '';
  mDesc.textContent = desc || '';
  if (mSize) mSize.textContent = size || '—';
  if (mEyebrow) mEyebrow.textContent = eyebrow || '';
  modal.hidden = false;
  modal.classList.add('is-opening');
  document.body.style.overflow = 'hidden';
  // focus close button for keyboard users
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus({ preventScroll: true });
}

function closeModal() {
  modal.hidden = true;
  modal.classList.remove('is-opening');
  document.body.style.overflow = '';
}

$$('.card').forEach(card => {
  card.addEventListener('click', () => {
    openModal({
      title: card.dataset.title || '',
      desc: card.dataset.desc || '',
      size: card.dataset.size || '',
      eyebrow: card.dataset.sku ? `SKU · ${card.dataset.sku.toUpperCase()}` : '',
    });
  });
});

$$('.rail-node').forEach(node => {
  node.addEventListener('click', () => {
    const sku = node.dataset.sku;
    const matchingCard = $(`.card[data-sku="${sku}"]`);
    if (matchingCard) {
      const rect = matchingCard.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY - 80;
      window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
    }
  });
});

modal.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});
