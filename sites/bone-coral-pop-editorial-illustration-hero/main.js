const products = {"micro": {"title": "Micro", "size": "4 cm — about a thumb", "price": "from ~$7", "term": "today", "description": "keychains, merch, gifts", "image": "hero-lifestyle.jpg"}, "classic": {"title": "Classic", "size": "25 cm", "price": "mid-range", "term": "3 weeks", "description": "kids, bathroom, desk", "image": "product-classic.jpg"}, "designer": {"title": "Designer", "size": "30 cm — about a cat", "price": "mid-range+", "term": "6 weeks", "description": "illustrator collabs, limited runs", "image": "product-designer.jpg"}, "mega": {"title": "Mega", "size": "120 cm", "price": "premium", "term": "6 weeks", "description": "photo objects, shop windows, gift-as-experience", "image": "product-mega.jpg"}, "architect": {"title": "Architect", "size": "3 m — about a bear", "price": "price on request", "term": "12 weeks", "description": "installations, events, weddings, branded spaces", "image": "product-architect.jpg"}};
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('#modal-title');
const modalSize = document.querySelector('.modal-size');
const modalDescription = document.querySelector('.modal-description');
const modalPrice = document.querySelector('.modal-price');
const modalTerm = document.querySelector('.modal-term');
const modalImage = document.querySelector('[data-modal-image]');
const closeButton = document.querySelector('.modal-close');
const subjectButtons = [...document.querySelectorAll('[data-subject]')];
const timelineButtons = [...document.querySelectorAll('.timeline [data-subject]')];
const shareButton = document.querySelector('.share');
const shareCount = shareButton ? shareButton.querySelector('span') : null;
let lastTrigger = null;
let shares = 0;

function setActive(key) {
  timelineButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.subject === key);
  });
}

function openProduct(key, trigger) {
  const product = products[key];
  if (!product) return;
  lastTrigger = trigger;
  modalTitle.textContent = product.title;
  modalSize.textContent = product.size;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price;
  modalTerm.textContent = product.term;
  modalImage.src = `./assets/${product.image}`;
  modalImage.alt = `Quacktory ${product.title} duck`;
  setActive(key);
  modal.showModal();
}

function closeModal() {
  modal.close();
  if (lastTrigger) lastTrigger.focus();
}

subjectButtons.forEach((button) => {
  button.addEventListener('click', () => openProduct(button.dataset.subject, button));
});

closeButton.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeModal();
});

if (shareButton && shareCount) {
  shareButton.addEventListener('click', async () => {
    const cap = Number(shareButton.dataset.cap);
    shares = Math.min(shares + 1, cap);
    shareCount.textContent = `${shares} / ${cap}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: location.href });
      } catch (error) {
        if (error.name !== 'AbortError') shareButton.focus();
      }
    }
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const button = entry.target.querySelector('[data-subject]');
    if (button) setActive(button.dataset.subject);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.scale-item').forEach((item) => observer.observe(item));

const gear = document.querySelector('.gear');
if (gear) {
  gear.addEventListener('click', () => {
    document.body.classList.toggle('quiet');
  });
}
