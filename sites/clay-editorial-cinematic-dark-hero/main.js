/* Quacktory × HAPE — interactivity */
const DUCKS = [
  {
    id: 'micro', line: 'Micro', size: '4–8 cm (thumb-sized)',
    price: 'from $7', term: 'today', img: './assets/product-micro.jpg',
    accent: '#E2A85F',
    desc: 'Keychains, merch, impulse gift. Injection molding under pressure, ~45 sec/cycle. Ages 6+. Separate sticker: "Not for children under 3. Small part."'
  },
  {
    id: 'classic', line: 'Classic', size: '10–25 cm (cat-sized)',
    price: 'mid, shipping included', term: '3 weeks', img: './assets/product-classic.jpg',
    accent: '#D49A4A',
    desc: 'Kids, bathroom, office. Compression molding, aluminum mold. Ages 3+. Drop test — 5 drops from 1 m onto concrete, no cracks.'
  },
  {
    id: 'designer', line: 'Designer', size: '15–30 cm (collab)',
    price: 'mid+, edition ≤300 pcs', term: '6 weeks', img: './assets/product-designer.jpg',
    accent: '#F0B870',
    desc: 'Collaborations with illustrators, limited editions. Hand molding in silicone flask. Ages 6+ (collectible object, not a toy). 1 cycle per day per flask.'
  },
  {
    id: 'mega', line: 'Mega', size: '50–120 cm (child-sized)',
    price: 'premium, pallet delivery', term: '6 weeks', img: './assets/product-mega.jpg',
    accent: '#E8AC68',
    desc: 'Photo objects, window displays, gift-as-experience. Rotational molding with internal fiberglass frame. Not a toy. Decorative object.'
  },
  {
    id: 'architect', line: 'Architect', size: '1.5–3 m (bear-sized)',
    price: 'on request / product passport', term: '12 weeks', img: './assets/product-architect.jpg',
    accent: '#FFD9A0',
    desc: 'Installations, events, weddings, branded spaces. Sculptural cast from a master model, internal steel frame. Installation by certified crew.'
  }
];

const modal = document.getElementById('modal');
const modalImg = modal.querySelector('.modal__img');
const modalLine = modal.querySelector('.modal__line');
const modalTitle = modal.querySelector('.modal__title');
const modalSize = modal.querySelector('.modal__size');
const modalDesc = modal.querySelector('.modal__desc');
const modalPrice = modal.querySelector('.modal__price');
const modalTerm = modal.querySelector('.modal__term');
const docBody = document.body;

let lastFocused = null;

function openModal(id) {
  const item = DUCKS.find(d => d.id === id);
  if (!item) return;
  lastFocused = document.activeElement;
  modalImg.src = item.img;
  modalImg.alt = `${item.line} duck`;
  modalLine.textContent = `// Lineup / ${item.line}`;
  modalTitle.textContent = item.line;
  modalSize.textContent = `Size: ${item.size}`;
  modalDesc.textContent = item.desc;
  modalPrice.textContent = item.price;
  modalTerm.textContent = `Lead time: ${item.term}`;
  modalImg.style.boxShadow = `0 0 60px ${item.accent}55`;
  modal.hidden = false;
  docBody.style.overflow = 'hidden';
  modal.querySelector('.modal__close').focus();
}

function closeModal() {
  modal.hidden = true;
  docBody.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('[data-id]').forEach(el => {
  el.addEventListener('click', e => {
    openModal(el.dataset.id);
  });
});

document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
  if (e.key === 'Tab' && !modal.hidden) {
    const focusables = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

document.querySelectorAll('.node').forEach((node, i, all) => {
  node.addEventListener('click', () => {
    all.forEach(n => n.classList.remove('is-active'));
    node.classList.add('is-active');
  });
});
