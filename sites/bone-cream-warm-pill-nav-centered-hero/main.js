// Quacktory — modal open/close, scroll reveals, smooth-scroll fallback
const modalNodes = document.querySelectorAll('.modal');

function openModal(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  const closeBtn = modal.querySelector('.modal__close');
  if (closeBtn) closeBtn.focus();
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-target]').forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(trigger.dataset.target);
  });
});

modalNodes.forEach((modal) => {
  modal.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', () => closeModal(modal));
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  modalNodes.forEach((m) => { if (!m.hidden) closeModal(m); });
});

// IntersectionObserver — fade cards in as they enter the viewport
const cards = document.querySelectorAll('.card');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
cards.forEach((c, i) => {
  c.style.opacity = '0';
  c.style.transform = 'translateY(24px)';
  c.style.transition = `opacity .6s ${i * 60}ms cubic-bezier(.2,.7,.2,1), transform .6s ${i * 60}ms cubic-bezier(.2,.7,.2,1)`;
  io.observe(c);
});

// Smooth-scroll fallback for browsers without native scroll-behavior
if (!('scrollBehavior' in document.documentElement.style)) {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}