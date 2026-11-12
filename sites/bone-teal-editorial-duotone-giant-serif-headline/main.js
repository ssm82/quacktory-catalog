const SHARE_CAP = 132;
const SKU = {
  micro:    {eyebrow:'MICRO · 01', title:'Micro — keychain 4–8 cm', desc:'Impulse merch and gift up to ~$7. Food-grade silicone, injection molding. Age 6+ (4 cm — not for children under 3).', size:'4 cm', compare:'thumb-sized', price:'$7 · per piece', lead:'today'},
  classic:  {eyebrow:'CLASSIC · 02', title:'Classic — bathroom and office 10–25 cm', desc:'Solid silicone, compression molding. Drop test from 1 m. Age 3+.', size:'18 cm', compare:'palm-sized', price:'$19 · per piece', lead:'today'},
  designer: {eyebrow:'DESIGNER · 03', title:'Designer — limited editions 15–30 cm', desc:'Collaborations with illustrators. Hand casting in silicone flask, ≤300 pcs. Collectible object, not a toy.', size:'25 cm', compare:'cat-sized', price:'$72 · per piece', lead:'6 weeks'},
  mega:     {eyebrow:'MEGA · 04', title:'Mega — photo prop 50–120 cm', desc:'Rotational molding with fiberglass frame. Pallet delivery. Art object, not a toy.', size:'80 cm', compare:'child-sized', price:'$560 · per piece', lead:'6 weeks'},
  architect:{eyebrow:'ARCHITECT · 05', title:'Architect — installation 1.5–3 m', desc:'Sculptural cast from a polystyrene master model. Steel frame with stiffening ribs. Installed by a certified crew.', size:'3 m', compare:'bear-sized', price:'price on request · product passport', lead:'12 weeks'}
};

let shareCount = 0;
const shareEl = document.getElementById('shareCount');
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', () => {
  if (shareCount >= SHARE_CAP) return;
  shareCount += 1;
  shareEl.textContent = shareCount;
  if (shareCount >= SHARE_CAP) shareBtn.textContent = 'Limit';
});

// countdown
(function(){
  const el = document.getElementById('countdown');
  const target = new Date();
  target.setDate(target.getDate() + 12);
  function tick(){
    const d = Math.max(0, target - new Date());
    const dd = Math.floor(d/86400000);
    const hh = Math.floor(d/3600000)%24;
    const mm = Math.floor(d/60000)%60;
    const ss = Math.floor(d/1000)%60;
    el.textContent = `${String(dd).padStart(2,'0')}d ${String(hh).padStart(2,'0')}h ${String(mm).padStart(2,'0')}m ${String(ss).padStart(2,'0')}s`;
  }
  tick(); setInterval(tick, 1000);
})();

const modal = document.getElementById('modal');
const fields = {
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
  fields.img.src = `./assets/product-${sku}.jpg`;
  fields.img.alt = d.title;
  fields.eyebrow.textContent = d.eyebrow;
  fields.title.textContent = d.title;
  fields.desc.textContent = d.desc;
  fields.size.textContent = d.size;
  fields.compare.textContent = d.compare;
  fields.price.textContent = d.price;
  fields.lead.textContent = d.lead;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}
function closeModal(){ modal.hidden = true; document.body.style.overflow = ''; }

document.querySelectorAll('.node').forEach(n => {
  n.addEventListener('click', () => openModal(n.dataset.sku));
  n.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(n.dataset.sku); }
  });
});
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
