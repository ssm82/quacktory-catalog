/* Quacktory × IMMERSIVE GARDEN — interactivity */
const DUCKS = [
  {
    id: 'micro', line: 'Micro', size: '4–8 cm (thumb-sized)',
    price: 'from $7 · per piece', term: 'today', img: './assets/product-micro.jpg',
    accent: '#A23A2E',
    desc: 'Line i. Injection molding under pressure, 8 cavities, ~45 sec/cycle. Keychains, merch, impulse gift. Recycled cardboard, no polyethylene. Ages 6+.'
  },
  {
    id: 'classic', line: 'Classic', size: '10–25 cm (cat-sized)',
    price: 'mid · shipping included', term: '3 weeks', img: './assets/product-classic.jpg',
    accent: '#1B2A4E',
    desc: 'Line ii. Compression molding, aluminum mold, ~3 min/cycle. Kids, bathroom, office. Ages 3+. Cardboard + paper pulp insert.'
  },
  {
    id: 'designer', line: 'Designer', size: '15–30 cm (collab)',
    price: 'mid+ · edition ≤300', term: '6 weeks', img: './assets/product-designer.jpg',
    accent: '#3E6B7A',
    desc: 'Line iii. Hand molding in silicone flask. Collaborations with illustrators, limited editions. Embossed cardboard + paper certificate. Ages 6+ (collectible object).'
  },
  {
    id: 'mega', line: 'Mega', size: '50–120 cm (child-sized)',
    price: 'premium · pallet delivery', term: '6 weeks', img: './assets/product-mega.jpg',
    accent: '#2E3A22',
    desc: 'Line iv. Rotational molding, fiberglass frame. Corrugated box + foam insert. Not a toy. Decorative object.'
  },
  {
    id: 'architect', line: 'Architect', size: '1.5–3 m (bear-sized)',
    price: 'on request / passport', term: '12 weeks', img: './assets/product-architect.jpg',
    accent: '#A23A2E',
    desc: 'Line v. Sculptural cast from a master model, steel frame with stiffening ribs. Wooden crate + climate control. Installation by certified crew.'
  }
];

const SHARE_CAP = 132;
let shareCount = 0;

const modal = document.getElementById('modal');
const modalImg = modal.querySelector('.modal__img');
const modalNum = modal.querySelector('.modal__num');
const modalTitle = modal.querySelector('.modal__title');
const modalSize = modal.querySelector('.modal__size');
const modalDesc = modal.querySelector('.modal__desc');
const modalPrice = modal.querySelector('.modal__price');
const modalTerm = modal.querySelector('.modal__term');
const shareLabel = document.getElementById('share-count');
const docBody = document.body;
let lastFocused = null;

function openModal(id) {
  const item = DUCKS.find(d => d.id === id);
  if (!item) return;
  lastFocused = document.activeElement;
  modalImg.src = item.img;
  modalImg.alt = `${item.line} duck`;
  modalNum.textContent = `— ${item.id} /`;
  modalTitle.textContent = item.line;
  modalSize.textContent = `Size: ${item.size}`;
  modalDesc.textContent = item.desc;
  modalPrice.textContent = item.price;
  modalTerm.textContent = `Lead time: ${item.term}`;
  modalImg.style.boxShadow = `0 0 50px ${item.accent}55`;
  modal.hidden = false;
  docBody.style.overflow = 'hidden';
  modal.querySelector('.modal__close').focus();
}

function closeModal() {
  modal.hidden = true;
  docBody.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

function bumpShare() {
  if (shareCount >= SHARE_CAP) return;
  shareCount += 1;
  shareLabel.textContent = `Share ${shareCount} / ${SHARE_CAP}`;
  if (shareCount === SHARE_CAP) shareLabel.style.color = 'var(--accent-warm)';
}

document.querySelectorAll('[data-id]').forEach(el => {
  el.addEventListener('click', e => openModal(el.dataset.id));
});

document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', closeModal);
});

document.getElementById('settings-gear').addEventListener('click', e => {
  e.preventDefault();
  bumpShare();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});
