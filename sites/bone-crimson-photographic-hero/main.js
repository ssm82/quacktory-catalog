// ===========================================================
// Quacktory — All In Or Floating
// Vanilla JS: live timer, modal, menu, scroll-fade
// ===========================================================

const SKUS = {
  micro: {
    size: '[ 4 CM ]',
    name: 'Micro',
    lede: 'A keychain duck. The same silhouette, scaled down until it lives on your bag. Glossy crimson lacquer, ivory beak.',
    img: './assets/product-micro.jpg',
    price: '€9',
    edition: 'Crimson series · 2026',
    alt: 'Micro duck, glossy crimson lacquer, ivory beak'
  },
  classic: {
    size: '[ 15 CM ]',
    name: 'Classic',
    lede: 'The workhorse. The duck most photographed. Matte ivory body, polished crimson beak. The reference point for every other size.',
    img: './assets/product-classic.jpg',
    price: '€22',
    edition: 'Crimson series · 2026',
    alt: 'Classic duck, matte ivory with crimson beak'
  },
  designer: {
    size: '[ 20 CM ]',
    name: 'Designer',
    lede: 'High-gloss oxblood lacquer with a single ivory racing stripe. The seasonal piece — finishes change, silhouette stays.',
    img: './assets/product-designer.jpg',
    price: '€48',
    edition: 'Crimson series · 2026',
    alt: 'Designer duck, oxblood lacquer with ivory racing stripe'
  },
  mega: {
    size: '[ 50 CM ]',
    name: 'Mega',
    lede: 'Shelf-sized. Soft warm ivory porcelain with fine crimson veining — a body you can see across the room.',
    img: './assets/product-mega.jpg',
    price: '€120',
    edition: 'Crimson series · 2026',
    alt: 'Mega duck, ivory porcelain with crimson veining'
  },
  architect: {
    size: '[ 1.5 M ]',
    name: 'Architect',
    lede: 'A statement piece. Polished marble in ivory with deep crimson veins. Made to order; ships on a pallet.',
    img: './assets/product-architect.jpg',
    price: '€1,400',
    edition: 'Crimson series · 2026',
    alt: 'Architect duck, monumental marble with crimson veins'
  }
};

// ---------- live timer (so it's not a liar element) ----------
function pad(n) { return String(n).padStart(2, '0'); }
function tick() {
  const now = new Date();
  document.getElementById('t-h').textContent = pad(now.getHours());
  document.getElementById('t-m').textContent = pad(now.getMinutes());
  document.getElementById('t-s').textContent = pad(now.getSeconds());
}
tick();
setInterval(tick, 1000);

// ---------- modal ----------
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalSize = document.getElementById('modal-size');
const modalName = document.getElementById('modal-name');
const modalLede = document.getElementById('modal-lede');
const modalPrice = document.getElementById('modal-price');
const modalEdition = document.getElementById('modal-edition');

function openModal(sku) {
  const data = SKUS[sku];
  if (!data) return;
  modalSize.textContent = data.size;
  modalName.textContent = data.name;
  modalLede.textContent = data.lede;
  modalImg.src = data.img;
  modalImg.alt = data.alt;
  modalPrice.textContent = data.price;
  modalEdition.textContent = data.edition;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.node').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.sku));
});
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    openModal(card.dataset.sku);
  });
});
modal.addEventListener('click', e => {
  if (e.target.dataset.close !== undefined) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal.getAttribute('aria-hidden') === 'false') closeModal();
    if (menu.getAttribute('aria-hidden') === 'false') toggleMenu();
  }
});

// ---------- menu ----------
const menuBtn = document.querySelector('.pill__menu');
const menu = document.getElementById('menu');
function toggleMenu() {
  const open = menu.getAttribute('aria-hidden') === 'false';
  menu.setAttribute('aria-hidden', open ? 'true' : 'false');
  menuBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
  document.body.style.overflow = open ? '' : 'hidden';
}
menuBtn.addEventListener('click', toggleMenu);
menu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (menu.getAttribute('aria-hidden') === 'false') toggleMenu();
  });
});

// ---------- scroll fade-in ----------
const revealTargets = document.querySelectorAll('.section, .card, .spotlight__fig');
revealTargets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => io.observe(el));

// ---------- smooth anchor fallback ----------
if (!('scrollBehavior' in document.documentElement.style)) {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}
