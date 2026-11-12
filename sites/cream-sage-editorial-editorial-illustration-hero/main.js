const products = {
  micro: { title: 'Micro', size: '4–8 cm', description: 'Keychains, merch, gifts up to ~$7. Small ones go in your pocket.', audience: 'keychains, merch, gifts up to ~$7', price: 'impulse', age: '6+ · Not for children under 3 years. Small parts.', accent: '#1AFF66' },
  classic: { title: 'Classic', size: '10–25 cm', description: 'Kids, bathroom, office. Single-piece cast from vulcanized rubber.', audience: 'kids, bathroom, office', price: 'mid-range', age: '3+', accent: '#A3FFBF' },
  designer: { title: 'Designer', size: '15–30 cm', description: 'Collaborations with illustrators, limited editions. Collectible object, not a toy.', audience: 'collaborations with illustrators, limited editions', price: 'mid-range+', age: '6+ · collectible object, not a toy', accent: '#D9D6CC' },
  mega: { title: 'Mega', size: '50–120 cm', description: 'Photo props, window displays, gift-experiences. Art object, not a toy.', audience: 'photo props, window displays, gift-experiences', price: 'premium', age: 'Not a toy. Decorative object.', accent: '#7CFF9D' },
  architect: { title: 'Architect', size: '1.5–3 m', description: 'Installations, events, weddings, brand spaces. Installed by a certified crew.', audience: 'installations, events, weddings, brand spaces', price: 'price on request / product passport', age: 'Installation. Installed by a certified crew.', accent: '#B7FFCD' }
};
const modal = document.querySelector('.modal');
const panel = document.querySelector('.modal-panel');
const title = document.querySelector('.modal-title');
const size = document.querySelector('.modal-size');
const description = document.querySelector('.modal-description');
const audience = document.querySelector('.modal-audience');
const price = document.querySelector('.modal-price');
const age = document.querySelector('.modal-age');
const close = document.querySelector('.modal-close');
const overlay = document.querySelector('.modal-overlay');
let lastTrigger;
function activate(id) {
  document.querySelectorAll('[data-product]').forEach((item) => item.classList.toggle('is-active', item.dataset.product === id));
}
function openModal(id, trigger) {
  const product = products[id];
  if (!product) return;
  lastTrigger = trigger;
  title.textContent = product.title;
  size.textContent = product.size;
  description.textContent = product.description;
  audience.textContent = product.audience;
  price.textContent = product.price;
  age.textContent = product.age;
  panel.style.setProperty('--product-accent', product.accent);
  activate(id);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  close.focus();
}
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastTrigger) lastTrigger.focus();
}
document.querySelectorAll('[data-product]').forEach((trigger) => trigger.addEventListener('click', () => openModal(trigger.dataset.product, trigger)));
close.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});
const menuToggle = document.querySelector('[data-menu-toggle]');
const menuClose = document.querySelector('[data-menu-close]');
const menuPanel = document.getElementById('utility-menu');
const searchToggle = document.querySelector('[data-search-toggle]');
const searchDrawer = document.getElementById('search-drawer');
const searchInput = document.getElementById('size-search');

function setMenu(open) {
  menuPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (open) menuClose.focus();
}
menuToggle.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
menuPanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

function setSearch(open) {
  searchDrawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (open) searchInput.focus();
}
searchToggle.addEventListener('click', () => setSearch(searchDrawer.getAttribute('aria-hidden') === 'true'));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (menuPanel.getAttribute('aria-hidden') === 'false') setMenu(false);
  if (searchDrawer.getAttribute('aria-hidden') === 'false') setSearch(false);
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll('.product-row').forEach((row) => {
    row.hidden = query !== '' && !row.textContent.toLowerCase().includes(query);
  });
});
const reveal = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
}, { threshold: 0.12 });
document.querySelectorAll('.product-row, .production-item, .b2b-title').forEach((item) => reveal.observe(item));
