const SHARE_CAP = 132;
const SKU = {
  micro:    {eyebrow:'MICRO · 01', title:'Micro — keychain 4–8 cm', desc:'Impulse merch and gift up to ~$7. Food-grade silicone, injection molding, 8 cavities. Cycle ~45 sec. Age 6+ (4 cm — not for children under 3).', size:'4 cm', compare:'thumb-sized', price:'$7 · per piece', lead:'today'},
  classic:  {eyebrow:'CLASSIC · 02', title:'Classic — bathroom and office 10–25 cm', desc:'Solid silicone, compression molding. Drop test from 1 m, no "rubber" odor. Age 3+.', size:'18 cm', compare:'palm-sized', price:'$19 · per piece', lead:'today'},
  designer: {eyebrow:'DESIGNER · 03', title:'Designer — limited editions 15–30 cm', desc:'Collaborations with illustrators. Hand casting in silicone flask, ≤300 pcs. Design coordination with the author — 6 weeks. Collectible object, not a toy.', size:'25 cm', compare:'cat-sized', price:'$72 · per piece', lead:'6 weeks'},
  mega:     {eyebrow:'MEGA · 04', title:'Mega — photo prop 50–120 cm', desc:'Rotational molding with fiberglass frame. Pallet delivery, courier on-site required. Art object, not a toy.', size:'80 cm', compare:'child-sized', price:'$560 · per piece', lead:'6 weeks'},
  architect:{eyebrow:'ARCHITECT · 05', title:'Architect — installation 1.5–3 m', desc:'Sculptural cast from a polystyrene master model. Steel frame with stiffening ribs. Installed by a certified crew. 12 weeks including survey.', size:'3 m', compare:'bear-sized', price:'price on request · product passport', lead:'12 weeks'}
};

let shareCount = 0;
const shareEl = document.getElementById('shareCount');
const shareBtn = document.querySelector('.share-pill');

shareBtn.addEventListener('click', () => {
  if (shareCount >= SHARE_CAP) return;
  shareCount += 1;
  shareEl.textContent = shareCount;
  if (shareCount >= SHARE_CAP) {
    shareBtn.querySelector('span:first-child').textContent = 'Limit reached';
    shareBtn.setAttribute('aria-disabled', 'true');
  }
});

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalEyebrow = document.getElementById('modalEyebrow');
const modalSize = document.getElementById('modalSize');
const modalCompare = document.getElementById('modalCompare');
const modalPrice = document.getElementById('modalPrice');
const modalLead = document.getElementById('modalLead');

function openModal(sku){
  const data = SKU[sku];
  if (!data) return;
  modalImg.src = `./assets/product-${sku}.jpg`;
  modalImg.alt = data.title;
  modalEyebrow.textContent = data.eyebrow;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  modalSize.textContent = data.size;
  modalCompare.textContent = data.compare;
  modalPrice.textContent = data.price;
  modalLead.textContent = data.lead;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}
function closeModal(){
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('.node').forEach(node => {
  node.addEventListener('click', () => openModal(node.dataset.sku));
  node.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(node.dataset.sku); }
  });
});

document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

// subtle parallax for hero wordmark
const word = document.querySelector('.wordmark');
if (word) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    word.style.transform = `rotate(-4deg) translateY(${y * -0.05}px)`;
  }, { passive: true });
}
