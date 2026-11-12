const products = {
  micro: { title: 'Micro', size: '4–8 cm', description: 'Keychains, merch, gifts up to ~$7. Small ones go in your pocket.', audience: 'keychains, merch, gifts up to ~$7', price: 'impulse', age: '6+ · Not for children under 3 years. Small parts.', accent: '#5BE9FF' },
  classic: { title: 'Classic', size: '10–25 cm', description: 'Kids, bathroom, office. Single-piece cast from vulcanized rubber.', audience: 'kids, bathroom, office', price: 'mid-range', age: '3+', accent: '#E64FE0' },
  designer: { title: 'Designer', size: '15–30 cm', description: 'Collaborations with illustrators, limited editions. Collectible object, not a toy.', audience: 'collaborations with illustrators, limited editions', price: 'mid-range+', age: '6+ · collectible object, not a toy', accent: '#9CFF6B' },
  mega: { title: 'Mega', size: '50–120 cm', description: 'Photo props, window displays, gift-experiences. Art object, not a toy.', audience: 'photo props, window displays, gift-experiences', price: 'premium', age: 'Not a toy. Decorative object.', accent: '#8A4FFF' },
  architect: { title: 'Architect', size: '1.5–3 m', description: 'Installations, events, weddings, brand spaces. Installed by a certified crew.', audience: 'installations, events, weddings, brand spaces', price: 'price on request / product passport', age: 'Installation. Installed by a certified crew.', accent: '#FFFFFF' }
};
const modal = document.querySelector('.modal');
const panel = document.querySelector('.modal-panel');
const title = document.querySelector('.modal-title');
const size = document.querySelector('.modal-size');
const description = document.querySelector('.modal-description');
const audience = document.querySelector('.modal-audience');
const price = document.querySelector('.modal-price');
const age = document.querySelector('.modal-age');
const closeButton = document.querySelector('.modal-close');
const overlay = document.querySelector('.modal-overlay');
let lastTrigger = null;
function activateProduct(id) {
  document.querySelectorAll('[data-product]').forEach((trigger) => trigger.classList.toggle('is-active', trigger.dataset.product === id));
}
function openProduct(id, trigger) {
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
  activateProduct(id);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeButton.focus();
}
function closeProduct() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastTrigger) lastTrigger.focus();
}
document.querySelectorAll('[data-product]').forEach((trigger) => trigger.addEventListener('click', () => openProduct(trigger.dataset.product, trigger)));
closeButton.addEventListener('click', closeProduct);
overlay.addEventListener('click', closeProduct);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeProduct();
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
}, { threshold: 0.15 });
document.querySelectorAll('.product-card, .material-copy, .b2b-title').forEach((element) => observer.observe(element));
