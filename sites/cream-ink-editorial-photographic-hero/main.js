// Quacktory · Botanical Atelier — interactivity
// 1) smooth scroll polyfill for older browsers
// 2) feature strip: scroll-triggered fade-in via IntersectionObserver
// 3) size timeline: click a node to open the size modal
// 4) catalog card click → scroll to timeline + flash matching node

const SIZES = {
  micro: {
    eyebrow: 'Micro · 4 cm',
    title: 'A duck for your keychain',
    body: 'Hand-glazed in matte olive, with a small loop for hanging. The smallest member of the family, and the one most likely to be lost between couch cushions.'
  },
  classic: {
    eyebrow: 'Classic · 15 cm',
    title: 'The house duck',
    body: 'Fifteen centimeters of warm walnut-brown, fired three times. Most-photographed piece, often given as a housewarming, occasionally kept on a windowsill for years.'
  },
  designer: {
    eyebrow: 'Designer · 20 cm',
    title: 'A limited annual edition',
    body: 'Rust-terracotta glaze, with a botanical sprig collar. Two hundred numbered pieces per year, and a different color every season. Vol. 04 is the one on the page right now.'
  },
  mega: {
    eyebrow: 'Mega · 50 cm',
    title: 'A duck for a shelf',
    body: 'Warm tan matte with a leaf-vest prop. Heavy enough to need two hands, too quiet to be a toy. Sits on a shelf, not a shelf.'
  },
  architect: {
    eyebrow: 'Architect · 1.5 m',
    title: 'A duck for a greenhouse',
    body: 'Deep forest green, with a botanical wreath collar. Built to order, shipped in a wooden crate, and signed on the base by the person who glazed it.'
  }
};

// ---- smooth scroll fallback (Safari < 15.4, etc.) ----
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

// ---- feature strip: scroll-triggered fade-in ----
const featureCards = document.querySelectorAll('.feature');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger by index inside the visible set
        const idx = Array.from(featureCards).indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 90}ms`;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  featureCards.forEach((el) => io.observe(el));
} else {
  featureCards.forEach((el) => el.classList.add('is-visible'));
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
modalCloseBtns.forEach((el) => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

// ---- catalog card: scroll to the matching timeline node ----
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('click', () => {
    const sku = card.dataset.sku;
    // cream + forest use a slightly different match in the timeline
    const map = {
      micro: 'micro', classic: 'classic', designer: 'designer',
      mega: 'mega', forest: 'classic', cream: 'micro'
    };
    const target = map[sku] || sku;
    const node = document.querySelector(`.node-${target}`);
    if (node) {
      document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        node.animate(
          [
            { transform: 'translateY(0) scale(1)' },
            { transform: 'translateY(-10px) scale(1.15)' },
            { transform: 'translateY(0) scale(1)' }
          ],
          { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
        setTimeout(() => openModal(target), 320);
      }, 500);
    }
  });
});
