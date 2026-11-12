const SHARE_CAP = 132;
const SKU = {
  micro:    {eyebrow:'MICRO · 01', title:'Micro — keychain 4–8 cm', desc:'Impulse merch and a gift under ~$7. Food-grade silicone, injection cast. Age 6+ (4 cm — not for children under 3).', size:'4 cm', compare:'thumb-sized', price:'$7 · per piece', lead:'today'},
  classic:  {eyebrow:'CLASSIC · 02', title:'Classic — bath & desk 10–25 cm', desc:'Solid silicone, compression molding. Drop test from 1 m. Age 3+.', size:'18 cm', compare:'palm-sized', price:'$17 · per piece', lead:'today'},
  designer: {eyebrow:'DESIGNER · 03', title:'Designer — limited 15–30 cm', desc:'Collaborations with illustrators. Hand-laid silicone-mold forming, ≤300 pcs. Collectible object, not a toy.', size:'25 cm', compare:'cat-sized', price:'$65 · per piece', lead:'6 weeks'},
  mega:     {eyebrow:'MEGA · 04', title:'Mega — photo object 50–120 cm', desc:'Rotational molding with a fiberglass frame. Pallet shipping. Art object, not a toy.', size:'80 cm', compare:'child-sized', price:'$500 · per piece', lead:'6 weeks'},
  architect:{eyebrow:'ARCHITECT · 05', title:'Architect — installation 1.5–3 m', desc:'Sculptural pour from a polystyrene master model. Steel frame with stiffening ribs. Installed by a certified crew.', size:'3 m', compare:'bear-sized', price:'price on request · product passport', lead:'12 weeks'}
};

let shareCount = 0;
const shareEl = document.getElementById('shareCount');
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', () => {
  if (shareCount >= SHARE_CAP) return;
  shareCount += 1;
  shareEl.textContent = shareCount;
  if (shareCount >= SHARE_CAP) shareBtn.textContent = 'Cap';
});

const modal = document.getElementById('modal');
const f = {
  img: document.getElementById('modalImg'),
  title: document.getElementById('modalTitle'),
  desc: document.getElementById('modalDesc'),
  eyebrow: document.getElementById('modalEyebrow'),
  size: document.getElementById('modalSize'),
  compare: document.getElementById('modalCompare'),
  price: document.getElementById('modalPrice'),
  lead: document.getElementById('modalLead')
};
function openModal(sku){
  const d = SKU[sku]; if (!d) return;
  f.img.src = `./assets/product-${sku}.jpg`;
  f.img.alt = d.title;
  f.eyebrow.textContent = d.eyebrow;
  f.title.textContent = d.title;
  f.desc.textContent = d.desc;
  f.size.textContent = d.size;
  f.compare.textContent = d.compare;
  f.price.textContent = d.price;
  f.lead.textContent = d.lead;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}
function closeModal(){ modal.hidden = true; document.body.style.overflow = ''; }

document.querySelectorAll('.card-mini').forEach(n => {
  n.addEventListener('click', () => openModal(n.dataset.sku));
  n.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(n.dataset.sku); }
  });
});
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
