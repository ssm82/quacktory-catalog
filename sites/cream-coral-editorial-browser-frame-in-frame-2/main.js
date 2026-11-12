/* Quacktory — Pinterest 53198839343857608 edition
 * - smooth-scroll polyfill
 * - scroll-reveal observer
 * - SKU modal (open on click, close on overlay / X / Escape)
 * - timeline-rail active state (one tick at a time)
 */

const SKUS = {
  micro: {
    tag: 'Micro · 01',
    title: 'Micro',
    dim: '4 cm · keychain edition',
    body: 'A four-centimetre duck on a braided cotton loop. Twelve to a box, or pick one off the parts tray.',
    finish: 'Glossy warm amber',
    price: '€6',
    lead: 'Ships in 2 days',
  },
  classic: {
    tag: 'Classic · 02',
    title: 'Classic',
    dim: '15 cm · the workhorse',
    body: 'Fifteen centimetres of warm amber shell. The most-photographed duck on the planet, sold singly or in a six-pack.',
    finish: 'Glossy warm amber',
    price: '€14',
    lead: 'Ships in 2 days',
  },
  designer: {
    tag: 'Designer · 03',
    title: 'Designer',
    dim: '20 cm · hand-painted',
    body: 'The signature edition. Hand-primed, lacquered, then finished with a single hot-orange kinetic streak across the body.',
    finish: 'Amber + orange streak',
    price: '€48',
    lead: 'Ships in 7 days',
  },
  mega: {
    tag: 'Mega · 04',
    title: 'Mega',
    dim: '50 cm · matte ivory',
    body: 'Half a metre of matte ivory shell. Heavy enough to anchor a monitor arm, soft enough to bounce a paper airplane off.',
    finish: 'Matte ivory',
    price: '€220',
    lead: 'Ships in 5 days',
  },
  architect: {
    tag: 'Architect · 05',
    title: 'Architect',
    dim: '3 m · statement piece',
    body: 'A one-and-a-half-metre duck for lobbies, trade shows, and the occasional gallery wall. Crated, delivered, installed.',
    finish: 'Smooth ivory',
    price: '€4,800',
    lead: 'Crated in 14 days',
  },
};

/* ---------- smooth scroll fallback ---------- */
if (!('scrollBehavior' in document.documentElement.style)) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ---------- scroll reveal ---------- */
const revealEls = document.querySelectorAll(
  '.section-head, .sku, .m-card, .footer-inner, .ladder-rail'
);
revealEls.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach((el) => io.observe(el));

/* ---------- SKU modal ---------- */
const modal = document.getElementById('sku-modal');
const modalEyebrow = document.getElementById('modal-eyebrow');
const modalTitle = document.getElementById('modal-title');
const modalDim = document.getElementById('modal-dim');
const modalBody = document.getElementById('modal-body');
const modalFinish = document.getElementById('modal-finish');
const modalPrice = document.getElementById('modal-price');
const modalLead = document.getElementById('modal-lead');
const railNodes = document.querySelectorAll('.rail-node');
const skuCards = document.querySelectorAll('.sku');

let lastFocus = null;

function openModal(slug) {
  const data = SKUS[slug];
  if (!data || !modal) return;
  modalEyebrow.textContent = data.tag;
  modalTitle.textContent = data.title;
  modalDim.textContent = data.dim;
  modalBody.textContent = data.body;
  modalFinish.textContent = data.finish;
  modalPrice.textContent = data.price;
  modalLead.textContent = data.lead;

  railNodes.forEach((n) => n.classList.toggle('is-active', n.dataset.size === slug));

  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = '';
  railNodes.forEach((n) => n.classList.remove('is-active'));
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

skuCards.forEach((card) => {
  card.addEventListener('click', () => {
    const slug = (card.className.match(/sku--(\w+)/) || [])[1];
    if (slug) openModal(slug);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

railNodes.forEach((node) => {
  node.addEventListener('click', () => {
    const slug = node.dataset.size;
    if (slug) openModal(slug);
  });
});

modal.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
