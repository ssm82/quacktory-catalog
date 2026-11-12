const modal = document.getElementById('modal');
const modalSide = document.getElementById('modal-side');
const modalEyebrow = document.getElementById('modal-eyebrow');
const modalTitle = document.getElementById('modal-title');
const modalSize = document.getElementById('modal-size');
const modalMood = document.getElementById('modal-mood');
const modalBody = document.getElementById('modal-body');

let lastFocus = null;

function openModal(rail) {
  if (!modal || !rail) return;
  lastFocus = document.activeElement;
  modalSide.textContent = rail.dataset.side || '';
  modalEyebrow.textContent = `SIDE ${rail.dataset.side || ''} · ${(rail.dataset.name || '').toUpperCase()}`;
  modalTitle.textContent = rail.dataset.name || '';
  modalSize.textContent = rail.dataset.size || '';
  modalMood.textContent = rail.dataset.mood || '';
  modalBody.textContent = rail.dataset.note || '';
  modal.hidden = false;
  modal.querySelector('.modal__card')?.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

document.querySelectorAll('.rail').forEach((rail) => {
  rail.addEventListener('click', () => openModal(rail));
  rail.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(rail); }
  });
});

modal?.addEventListener('click', (e) => {
  const t = e.target;
  if (t && t.dataset && t.dataset.close !== undefined) closeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.rail, .cta, .liner').forEach((el) => io.observe(el));

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
