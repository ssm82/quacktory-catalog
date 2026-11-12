const products = {
  micro: {
    title: 'Micro',
    size: '4–8 cm',
    description: 'Keychains, merch, gifts up to ~$7. Small ones go in your pocket.',
    audience: 'keychains, merch, gifts up to ~$7',
    price: 'impulse',
    age: '6+ · Not for children under 3 years. Small parts.',
    accent: '#FF6A1F'
  },
  classic: {
    title: 'Classic',
    size: '10–25 cm',
    description: 'Kids, bathroom, office. Single-piece cast from vulcanized rubber.',
    audience: 'kids, bathroom, office',
    price: 'mid-range',
    age: '3+',
    accent: '#9BCB32'
  },
  designer: {
    title: 'Designer',
    size: '15–30 cm',
    description: 'Collaborations with illustrators, limited editions. Collectible object, not a toy.',
    audience: 'collaborations with illustrators, limited editions',
    price: 'mid-range+',
    age: '6+ · collectible object, not a toy',
    accent: '#A855F7'
  },
  mega: {
    title: 'Mega',
    size: '50–120 cm',
    description: 'Photo props, window displays, gift-experiences. Art object, not a toy.',
    audience: 'photo props, window displays, gift-experiences',
    price: 'premium',
    age: 'Not a toy. Decorative object.',
    accent: '#F5C518'
  },
  architect: {
    title: 'Architect',
    size: '1.5–3 m',
    description: 'Installations, events, weddings, brand spaces. Installed by a certified crew.',
    audience: 'installations, events, weddings, brand spaces',
    price: 'price on request / product passport',
    age: 'Installation. Installed by a certified crew.',
    accent: '#5BE9FF'
  },
  settings: {
    title: 'Settings',
    size: 'Quacktory gallery · 2021',
    description: 'Five objects on one table. Dark stage, single overhead spot, colour-coded under-glow — orange for the pocket duck, green for the classic, violet for the collab, amber for the photo prop, cyan for the installation.',
    audience: 'four centres to three metres',
    price: 'the whole lineup, one room',
    age: 'Indoor only.',
    accent: '#9BCB32'
  }
};

const modal = document.querySelector('.modal');
const panel = document.querySelector('.modal-panel');
const modalTitle = document.querySelector('.modal-title');
const modalSize = document.querySelector('.modal-size');
const modalDescription = document.querySelector('.modal-description');
const modalAudience = document.querySelector('.modal-audience');
const modalPrice = document.querySelector('.modal-price');
const modalAge = document.querySelector('.modal-age');
const closeButton = document.querySelector('.modal-close');
const overlay = document.querySelector('.modal-overlay');
const triggers = document.querySelectorAll('[data-product]');
const shareButton = document.querySelector('.share-button');
const shareCount = document.querySelector('.share-count');
const gearButton = document.querySelector('.gear-button');
let lastTrigger = null;
let shares = 0;

function setActive(productId) {
  document.querySelectorAll('[data-product]').forEach((element) => {
    element.classList.toggle('is-active', element.dataset.product === productId);
  });
}

function openProduct(productId, trigger) {
  const product = products[productId];
  if (!product) return;
  lastTrigger = trigger;
  modalTitle.textContent = product.title;
  modalSize.textContent = product.size;
  modalDescription.textContent = product.description;
  modalAudience.textContent = product.audience;
  modalPrice.textContent = product.price;
  modalAge.textContent = product.age;
  panel.style.setProperty('--product-accent', product.accent);
  setActive(productId);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeButton.focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastTrigger) lastTrigger.focus();
}

triggers.forEach((trigger) => {
  trigger.addEventListener('click', () => openProduct(trigger.dataset.product, trigger));
});

closeButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

shareButton.addEventListener('click', () => {
  if (shares < 132) shares += 1;
  shareCount.textContent = `${shares} / 132`;
  shareButton.classList.toggle('is-active', shares > 0);
});

if (gearButton) {
  gearButton.addEventListener('click', () => openProduct('settings', gearButton));
}
