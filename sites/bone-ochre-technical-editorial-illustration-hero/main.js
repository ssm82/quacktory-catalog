// file: main.js
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1/+esm';

const ACCENT = '#E8E600';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Lenis smooth scroll ---------- */
const lenis = new Lenis({ duration: 1.1, smoothWheel: true, easing: t => 1 - Math.pow(1 - t, 4) });
const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
requestAnimationFrame(raf);
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -80 }); }
}));

/* ---------- Entrance animations ---------- */
if (!reduce) {
  gsap.from('.hero-meta', { opacity: 0, y: 12, duration: 0.6, ease: 'power3.out' });
  gsap.from('.hero-heading-line', { opacity: 0, y: 14, duration: 0.7, stagger: 0.14, delay: 0.15, ease: 'power3.out' });
  gsap.from('.hero-manifesto, .hero-cta-row, .hero-pagination', { opacity: 0, y: 10, duration: 0.6, stagger: 0.08, delay: 0.55, ease: 'power3.out' });
  gsap.from('.hero-visual', { opacity: 0, scale: 0.985, duration: 1.0, delay: 0.25, ease: 'power2.out' });
  gsap.from('.hero-visual-annotation', { opacity: 0, x: -8, duration: 0.5, stagger: 0.12, delay: 0.9, ease: 'power2.out' });
}

/* ---------- IntersectionObserver scroll reveals ---------- */
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
}), { threshold: 0.18 });
$$('.ladder-step, .taxon-card, .section-header, .production-item, .b2b-card, .timeline-node').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

/* ---------- Modal system ---------- */
const data = {
  annotation: {
    a: { title: 'Single-piece moulding', desc: 'One continuous vulcanised rubber body. No glued seams, no internal cavities — the duck is hollow only when the design requires it.', tag: 'Process · 01', accent: ACCENT },
    b: { title: 'Internal steel frame', desc: 'Architect-scale units carry a welded steel armature so the silhouette can hold its pose above 1.2 m without internal air pressure.', tag: 'Process · 02', accent: ACCENT }
  },
  ladder: {
    micro: { title: 'Micro — 4 cm', desc: 'Thumb-sized. Injection-moulded thermoplastic elastomer, 8-cavity tool, 45 s cycle.', tag: 'Scale · Micro', accent: ACCENT, size: '4 cm', comp: 'thumb-sized', meta: '8 cm max' },
    classic: { title: 'Classic — 10 cm', desc: 'Hand-sized. Compression-moulded food-grade silicone, the bath-shelf default.', tag: 'Scale · Classic', accent: ACCENT, size: '10 cm', comp: 'hand-sized', meta: '25 cm max' },
    designer: { title: 'Designer — 15 cm', desc: 'Cat-sized. Hand-cast in silicone moulds, ≤300 units, paper certificate included.', tag: 'Scale · Designer', accent: ACCENT, size: '15 cm', comp: 'cat-sized', meta: '30 cm max' },
    mega: { title: 'Mega — 50 cm', desc: 'Child-sized. Rotational-moulded shell with internal fibreglass frame, 2 h cycle + 8 h cure.', tag: 'Scale · Mega', accent: ACCENT, size: '50 cm', comp: 'child-sized', meta: '120 cm max' },
    architect: { title: 'Architect — 1.5 m', desc: 'Person-sized. Lobby duck, shop-window duck, photographed duck. Steel frame, painted finish.', tag: 'Scale · Architect', accent: ACCENT, size: '1.5 m', comp: 'person-sized', meta: '3 m max' }
  },
  card: {
    micro: { title: 'Keychain duck', desc: 'Impulse-grade. Goes in a pocket, on a bag, on a keyring. 8-cavity steel tool, 45 s per cycle.', tag: 'SKU 01 · Micro', accent: ACCENT, size: '4–8 cm · thumb-sized', audience: 'Impulse buyer · 18–35', price: 'from $8', lead: '3 weeks', age: '6+ · Not for children under 3' },
    classic: { title: 'Bathroom duck', desc: 'The default. Compression-moulded, food-grade silicone, 3 minutes per cycle.', tag: 'SKU 02 · Classic', accent: ACCENT, size: '10–25 cm · hand-sized', audience: 'Parent · 30–45', price: 'from $22', lead: '3 weeks', age: '3+' },
    designer: { title: 'Illustrator collab', desc: 'Limited runs ≤300. Hand-cast, one cycle per day, signed by the author.', tag: 'SKU 03 · Designer', accent: ACCENT, size: '15–30 cm · cat-sized', audience: 'Design-object collector', price: 'from $140', lead: '6 weeks', age: '6+ · Collector’s object' },
    mega: { title: 'Photo object', desc: 'Rotational-moulded with internal fibreglass frame. 2 h cycle + 8 h cooling.', tag: 'SKU 04 · Mega', accent: ACCENT, size: '50–120 cm · child-sized', audience: 'Brand manager · event', price: 'from $1,800', lead: '6 weeks', age: 'Not a toy · Decorative object' },
    architect: { title: 'Lobby installation', desc: 'Custom. Welded steel armature, painted shell, on-site delivery and craning.', tag: 'SKU 05 · Architect', accent: ACCENT, size: '1.5–3.0 m · person-sized', audience: 'Architect · gallery · brand HQ', price: 'on quote', lead: '8 weeks', age: 'Not a toy · Public installation' }
  },
  settings: { title: 'Studio settings', desc: 'This is a static demo — there is nothing to configure. The settings modal exists so any subject on the page (annotations, scale steps, catalog cards) can hand off its data to a single host.', tag: 'System', accent: ACCENT }
};

const overlay = document.createElement('div');
overlay.className = 'modal-overlay';
overlay.innerHTML = `
  <div class="modal" role="dialog" aria-modal="true">
    <button class="modal-close" aria-label="Close">×</button>
    <span class="modal-tag"></span>
    <h3 class="modal-title"></h3>
    <p class="modal-desc"></p>
    <dl class="modal-specs"></dl>
    <div class="modal-actions">
      <button class="modal-share" type="button"><span>Share</span><span class="modal-share-count">0</span></button>
      <a class="modal-cta" href="#production" tabindex="0">Open brief →</a>
    </div>
  </div>`;
document.body.appendChild(overlay);
const modal = $('.modal', overlay);
const tagEl = $('.modal-tag', overlay);
const titleEl = $('.modal-title', overlay);
const descEl = $('.modal-desc', overlay);
const specsEl = $('.modal-specs', overlay);
const shareBtn = $('.modal-share', overlay);
const shareCountEl = $('.modal-share-count', overlay);

const open = (d) => {
  tagEl.textContent = d.tag || '—';
  titleEl.textContent = d.title || '';
  descEl.textContent = d.desc || '';
  modal.style.setProperty('--modal-accent', d.accent || ACCENT);
  const specs = [];
  if (d.size) specs.push(['Size', d.size]);
  if (d.audience) specs.push(['Audience', d.audience]);
  if (d.price) specs.push(['Price', d.price]);
  if (d.lead) specs.push(['Lead time', d.lead]);
  if (d.age) specs.push(['Age', d.age]);
  if (d.comp) specs.push(['Comparison', d.comp]);
  if (d.meta) specs.push(['Max', d.meta]);
  specsEl.innerHTML = specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  shareCountEl.textContent = '0';
  shareBtn.dataset.count = '0';
  overlay.classList.add('is-open');
  if (!reduce) gsap.fromTo(modal, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
  document.body.style.overflow = 'hidden';
};
const close = () => {
  if (!reduce) gsap.to(modal, { opacity: 0, y: 8, duration: 0.2, ease: 'power2.in', onComplete: () => overlay.classList.remove('is-open') });
  else overlay.classList.remove('is-open');
  document.body.style.overflow = '';
};
$('.modal-close', overlay).addEventListener('click', close);
overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('is-open')) close(); });

/* ---------- Share counter (capped) ---------- */
shareBtn.addEventListener('click', () => {
  const n = Math.min(99, (+shareBtn.dataset.count || 0) + 1);
  shareBtn.dataset.count = n;
  shareCountEl.textContent = n;
  shareBtn.classList.add('is-pulsed');
  setTimeout(() => shareBtn.classList.remove('is-pulsed'), 320);
});

/* ---------- Wire annotations ---------- */
$$('.hero-visual-annotation').forEach((el, i) => {
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  const key = el.classList.contains('hero-visual-annotation--a') ? 'a' : 'b';
  el.addEventListener('click', () => open(data.annotation[key]));
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(data.annotation[key]); } });
});

/* ---------- Wire ladder steps ---------- */
$$('.ladder-step').forEach(el => {
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  const key = el.classList[1].replace('ladder-step--', '');
  el.addEventListener('click', () => { $$('.ladder-step').forEach(s => s.classList.remove('is-active')); el.classList.add('is-active'); open(data.ladder[key]); });
  el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); el.click(); } });
});

/* ---------- Wire taxonomy cards ---------- */
$$('.taxon-card').forEach(el => {
  el.addEventListener('click', e => { if (e.target.closest('a')) return; open(data.card[el.dataset.line]); });
});

/* ---------- Settings (hamburger) ---------- */
$('.nav-hamburger').addEventListener('click', () => open(data.settings));
