const shell = document.querySelector('.site-shell');
const cookieButton = document.querySelector('.gate-cookie');
const soundButton = document.querySelector('.gate-sound');
const modal = document.querySelector('.product-modal');
const closeButton = document.querySelector('.modal-close');
const modalImage = document.querySelector('.modal-image');
const modalLine = document.querySelector('.modal-line');
const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.querySelector('.modal-description');
const modalSize = document.querySelector('.modal-size');
const modalPrice = document.querySelector('.modal-price');
const modalDelivery = document.querySelector('.modal-delivery');
const modalCompliance = document.querySelector('.modal-compliance');
const subjects = [...document.querySelectorAll('.subject-card')];
let lastTrigger = null;

cookieButton.addEventListener('click', () => {
  const quiet = shell.classList.toggle('is-quiet');
  cookieButton.setAttribute('aria-pressed', String(quiet));
});

soundButton.addEventListener('click', () => {
  const muted = soundButton.getAttribute('aria-pressed') === 'true';
  soundButton.setAttribute('aria-pressed', String(!muted));
});

function setActiveSubject(trigger) {
  subjects.forEach((subject) => {
    subject.classList.toggle('is-active', subject === trigger);
  });
}

function fillModal(trigger) {
  modalLine.textContent = trigger.dataset.line;
  modalTitle.textContent = trigger.dataset.title;
  modalDescription.textContent = trigger.dataset.description;
  modalSize.textContent = trigger.dataset.size;
  modalPrice.textContent = trigger.dataset.price;
  modalDelivery.textContent = trigger.dataset.delivery;
  modalCompliance.textContent = trigger.dataset.compliance;
  modalImage.src = trigger.dataset.image;
  modalImage.alt = `${trigger.dataset.title}, ${trigger.dataset.size}`;
}

function openModal(trigger) {
  lastTrigger = trigger;
  setActiveSubject(trigger);
  fillModal(trigger);
  modal.showModal();
  document.body.style.overflow = 'hidden';
  closeButton.focus();
}

function closeModal() {
  if (!modal.open) return;
  modal.close();
  document.body.style.overflow = '';
  lastTrigger?.focus();
}

subjects.forEach((subject) => {
  subject.addEventListener('click', () => openModal(subject));
});

closeButton.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  const bounds = modal.getBoundingClientRect();
  const outside = event.clientX < bounds.left
    || event.clientX > bounds.right
    || event.clientY < bounds.top
    || event.clientY > bounds.bottom;
  if (outside) closeModal();
});

modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeModal();
});

modal.addEventListener('close', () => {
  document.body.style.overflow = '';
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.open) closeModal();
});
