// Quacktory · Serenity — interactivity
// 1) smooth-scroll fallback
// 2) tile & value fade-in via IntersectionObserver
// 3) tile / node click → size modal
// 4) hero & ghost pill micro-interactions

const SIZES = {
  micro: {
    eyebrow: 'Micro · 4 cm',
    title: 'A duck for your keychain',
    body: 'Hand-finished in warm amber-ivory, with a small loop for hanging. The smallest member of the family, and the one most likely to be lost between couch cushions.'
  },
  classic: {
    eyebrow: 'Classic · 15 cm',
    title: 'The house duck',
    body: 'Fifteen centimeters of warm walnut-brown, fired three times. Most-photographed piece, often given as a housewarming, occasionally kept on a windowsill for years.'
  },
  designer: {
    eyebrow: 'Designer · 20 cm',
    title: 'A limited annual edition',
    body: 'Deep bronze-terracotta glaze with a small carved eucalyptus collar. Two hundred numbered pieces per year, and a different finish every season. Vol. 01 is the one on the page right now.'
  },
  mega: {
    eyebrow: 'Mega · 50 cm',
    title: 'A duck for a shelf',
    body: 'Warm taupe-stone matte, heavy enough to need two hands. Too quiet to be a toy. Sits on a shelf, not on a shelf.'
  },
  architect: {
    eyebrow: 'Architect · 1.5 m',
    title: 'A duck for a steam room',
    body: 'Deep umber-wood finish with a eucalyptus wreath collar. Built to order, shipped in a wooden crate, and signed on the base by the person who glazed it.'
  }
};

// ---- smooth-scroll fallback for older browsers ----
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ---- tile fade-in via IntersectionObserver ----
const animItems = document.querySelectorAll('.tile');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = Array.from(animItems).indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.max(0, idx) * 110}ms`;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  animItems.forEach((el) => io.observe(el));
} else {
  animItems.forEach((el) => el.classList.add('is-visible'));
}

// ---- size modal ----
const modal = document.getElementById('sizeModal');
const modalSize = document.getElementById('modalSize');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalCloseBtns = modal.querySelectorAll('[data-close]');

function openModal(slug) {
  const data = SIZES[slug];
  if (!data) return;
  modalSize.textContent = data.eyebrow;
  modalTitle.textContent = data.title;
  modalBody.textContent = data.body;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.node').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn.dataset.size));
});
document.querySelectorAll('.tile').forEach((tile) => {
  tile.addEventListener('click', () => {
    const slug = tile.dataset.size;
    if (!slug) return;
    const node = document.querySelector(`.node-${slug}`);
    if (node) {
      node.animate(
        [
          { transform: 'translateY(0) scale(1)' },
          { transform: 'translateY(-10px) scale(1.15)' },
          { transform: 'translateY(0) scale(1)' }
        ],
        { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)' }
      );
    }
    setTimeout(() => openModal(slug), 180);
  });
});
modalCloseBtns.forEach((el) => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

// ---- ghost-pill share micro-interaction ----
const share = document.querySelector('.ghost-share');
if (share) {
  let count = 287;
  share.style.cursor = 'pointer';
  share.addEventListener('click', () => {
    count += 1;
    share.textContent = `★ ${count}`;
    share.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
      { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
  });
}
