/* Quacktory × LUSION — frame-in-frame interactivity */
const DUCKS = [
  {
    id: 'micro', line: 'Micro', size: '4–8 cm (thumb-sized)',
    price: 'from $7 · per piece', term: 'today', img: './assets/product-micro.jpg',
    accent: '#2A52E8',
    desc: 'Injection molding under pressure, 8 cavities, ~45 sec/cycle. Keychains, merch, impulse gift. Ages 6+, separate sticker "not for children under 3".'
  },
  {
    id: 'classic', line: 'Classic', size: '10–25 cm (cat-sized)',
    price: 'mid · shipping included', term: '3 weeks', img: './assets/product-classic.jpg',
    accent: '#1F4FE0',
    desc: 'Compression molding, aluminum mold, ~3 min/cycle. Kids, bathroom, office. Ages 3+. Drop test — 5 drops from 1 m onto concrete.'
  },
  {
    id: 'designer', line: 'Designer', size: '15–30 cm (collab)',
    price: 'mid+ · edition ≤300', term: '6 weeks', img: './assets/product-designer.jpg',
    accent: '#2A52E8',
    desc: 'Hand molding in silicone flask. Collaborations with illustrators, limited editions. Ages 6+ (collectible object, not a toy).'
  },
  {
    id: 'mega', line: 'Mega', size: '50–120 cm (child-sized)',
    price: 'premium · pallet delivery', term: '6 weeks', img: './assets/product-mega.jpg',
    accent: '#1F4FE0',
    desc: 'Rotational molding, internal fiberglass frame. Photo objects, window displays, gift-as-experience. Not a toy. Decorative object.'
  },
  {
    id: 'architect', line: 'Architect', size: '1.5–3 m (bear-sized)',
    price: 'on request / passport', term: '12 weeks', img: './assets/product-architect.jpg',
    accent: '#2A52E8',
    desc: 'Sculptural cast from a master model, steel frame with stiffening ribs. Installations, events, weddings. 2–4 weeks per duck. Installation by certified crew.'
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
  modalNum.textContent = `— ${item.id.toUpperCase()} /`;
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

function bumpShare() {
  if (shareCount >= SHARE_CAP) return;
  shareCount += 1;
  shareLabel.textContent = `Share ${shareCount} / ${SHARE_CAP}`;
  if (shareCount === SHARE_CAP) shareLabel.style.color = 'var(--accent)';
}

document.querySelectorAll('[data-id]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    openModal(el.dataset.id);
  });
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
