const products = {"micro": {"title": "Micro", "size": "4 cm — thumb-sized", "price": "from $7", "term": "today", "description": "keychains, merch, gifts", "image": "hero-lifestyle.jpg"}, "classic": {"title": "Classic", "size": "25 cm", "price": "mid", "term": "3 weeks", "description": "kids, bathroom, office", "image": "product-classic.jpg"}, "designer": {"title": "Designer", "size": "30 cm — cat-sized", "price": "mid+", "term": "6 weeks", "description": "illustrator collabs, limited editions", "image": "product-designer.jpg"}, "mega": {"title": "Mega", "size": "120 cm", "price": "premium", "term": "6 weeks", "description": "photo objects, window displays, statement gifts", "image": "product-mega.jpg"}, "architect": {"title": "Architect", "size": "3 m — bear-sized", "price": "price on request", "term": "12 weeks", "description": "installations, events, weddings, branded spaces", "image": "product-architect.jpg"}};
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
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
let lastTrigger = null;

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

function closeMenu() {
  if (!menu || !burger) return;
  menu.hidden = true;
  burger.setAttribute('aria-expanded', 'false');
}

if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    if (open) {
      closeMenu();
    } else {
      menu.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
    }
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
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
