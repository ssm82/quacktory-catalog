const shell = document.querySelector('.site-shell');
const shareButton = document.querySelector('.share-pill');
const settingsButton = document.querySelector('.settings-pill');
const modal = document.querySelector('.product-modal');
const modalClose = document.querySelector('.modal-close');
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

const updateShareLabel = () => {
  const count = Number(shareButton.dataset.count);
  const cap = Number(shareButton.dataset.cap);
  shareButton.textContent = `Share ${count} / ${cap}`;
};

const incrementShare = async () => {
  const cap = Number(shareButton.dataset.cap);
  const current = Number(shareButton.dataset.count);
  shareButton.dataset.count = String(Math.min(current + 1, cap));
  updateShareLabel();

  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url: window.location.href });
    } catch (error) {
      if (error.name !== 'AbortError') {
        return;
      }
    }
  }
};

const setActiveSubject = (trigger) => {
  subjects.forEach((subject) => {
    subject.classList.toggle('is-active', subject === trigger);
  });
};

const fillModal = (trigger) => {
  modalLine.textContent = trigger.dataset.line;
  modalTitle.textContent = trigger.dataset.title;
  modalDescription.textContent = trigger.dataset.description;
  modalSize.textContent = trigger.dataset.size;
  modalPrice.textContent = trigger.dataset.price;
  modalDelivery.textContent = trigger.dataset.delivery;
  modalCompliance.textContent = trigger.dataset.compliance;
  modalImage.src = trigger.dataset.image;
  modalImage.alt = `${trigger.dataset.title}, ${trigger.dataset.size}`;
};

const openModal = (trigger) => {
  lastTrigger = trigger;
  setActiveSubject(trigger);
  fillModal(trigger);
  modal.showModal();
  document.body.style.overflow = 'hidden';
  modalClose.focus();
};

const closeModal = () => {
  if (!modal.open) {
    return;
  }

  modal.close();
  document.body.style.overflow = '';
  lastTrigger?.focus();
};

subjects.forEach((subject) => {
  subject.addEventListener('click', () => openModal(subject));
});

shareButton.addEventListener('click', incrementShare);

settingsButton.addEventListener('click', () => {
  const quiet = shell.classList.toggle('is-quiet');
  settingsButton.setAttribute('aria-pressed', String(quiet));
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  const bounds = modal.getBoundingClientRect();
  const outside = event.clientX < bounds.left
    || event.clientX > bounds.right
    || event.clientY < bounds.top
    || event.clientY > bounds.bottom;

  if (outside) {
    closeModal();
  }
});

modal.addEventListener('close', () => {
  document.body.style.overflow = '';
});

modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeModal();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.open) {
    closeModal();
  }
});

updateShareLabel();
