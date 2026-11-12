// file: main.js

// ---------- modal system ----------
const modal = document.createElement('div');
modal.className = 'js-modal';
modal.setAttribute('aria-hidden', 'true');
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
modal.innerHTML = `
  <div class="js-modal__overlay" data-close="1"></div>
  <div class="js-modal__panel" role="document">
    <button class="js-modal__close" type="button" aria-label="Close">×</button>
    <span class="js-modal__num"></span>
    <p class="js-modal__kicker"></p>
    <h3 class="js-modal__title"></h3>
    <p class="js-modal__body"></p>
    <div class="js-modal__meta"></div>
  </div>
`;
document.body.appendChild(modal);

const panel = modal.querySelector('.js-modal__panel');
const style = document.createElement('style');
style.textContent = `
  .js-modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:24px}
  .js-modal[data-open="1"]{display:flex}
  .js-modal__overlay{position:absolute;inset:0;background:rgba(10,31,40,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);animation:jm-fade .22s ease}
  .js-modal__panel{position:relative;max-width:520px;width:100%;background:#C8D6CE;color:#0A1F28;border-radius:20px;padding:38px 34px 30px;box-shadow:0 30px 80px -20px rgba(0,0,0,.6);animation:jm-pop .28s cubic-bezier(.2,.9,.3,1.2);font-family:'Inter',sans-serif}
  .js-modal__panel::before{content:"";position:absolute;left:0;top:0;height:4px;width:100%;background:var(--accent,#1F4A5A);border-radius:20px 20px 0 0}
  .js-modal__close{position:absolute;right:14px;top:10px;background:none;border:0;font-size:26px;line-height:1;cursor:pointer;color:#0A1F28;width:36px;height:36px;border-radius:50%;transition:background .15s}
  .js-modal__close:hover{background:rgba(10,31,40,.08)}
  .js-modal__num{font-family:'Playfair Display',serif;font-style:italic;font-size:64px;line-height:1;color:var(--accent,#1F4A5A);opacity:.18;position:absolute;right:28px;top:18px;pointer-events:none}
  .js-modal__kicker{margin:0 0 6px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#1F4A5A;font-weight:500}
  .js-modal__title{margin:0 0 14px;font-family:'Playfair Display',serif;font-style:italic;font-weight:400;font-size:28px;line-height:1.1;color:#0A1F28}
  .js-modal__body{margin:0 0 18px;font-size:14px;line-height:1.6;color:#2A4A55}
  .js-modal__meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;padding-top:16px;border-top:1px solid rgba(10,31,40,.12)}
  .js-modal__meta span{font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:5px 10px;border:1px solid rgba(10,31,40,.18);border-radius:999px;color:#1F4A5A}
  @keyframes jm-fade{from{opacity:0}to{opacity:1}}
  @keyframes jm-pop{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
`;
document.head.appendChild(style);

const ACCENTS = ['#1F4A5A', '#2A6B7A', '#3A8A95', '#4A6B5A', '#5A4A6B'];
let lastFocus = null;

function openModal(data) {
  const num = data.num || '00';
  panel.style.setProperty('--accent', data.accent || ACCENTS[Math.floor(Math.random() * ACCENTS.length)]);
  modal.querySelector('.js-modal__num').textContent = num;
  modal.querySelector('.js-modal__kicker').textContent = data.kicker || '';
  modal.querySelector('.js-modal__title').textContent = data.title || '';
  modal.querySelector('.js-modal__body').textContent = data.body || '';
  const meta = modal.querySelector('.js-modal__meta');
  meta.innerHTML = '';
  (data.tags || []).forEach(t => { const s = document.createElement('span'); s.textContent = t; meta.appendChild(s); });
  lastFocus = document.activeElement;
  modal.dataset.open = '1';
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('.js-modal__close').focus(), 30);
}
function closeModal() {
  modal.dataset.open = '0';
  document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
modal.addEventListener('click', e => { if (e.target.dataset.close) closeModal(); });
modal.querySelector('.js-modal__close').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.dataset.open === '1') closeModal(); });

// ---------- card → modal ----------
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const num = card.dataset.num || card.querySelector('.card__num')?.textContent || '00';
    const title = card.querySelector('.card__title')?.textContent.trim() || '';
    const kicker = card.querySelector('.card__kicker')?.textContent.trim() || '';
    const body = card.querySelector('.card__body')?.textContent.trim() || '';
    const price = card.querySelector('.card__price')?.textContent.trim() || '';
    const tags = [kicker, card.dataset.sku && `SKU · ${card.dataset.sku}`, price].filter(Boolean);
    openModal({ num, kicker, title, body, tags });
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});

// ---------- step → modal ----------
document.querySelectorAll('.step').forEach(step => {
  step.addEventListener('click', () => {
    const num = step.dataset.num || step.querySelector('.step__num')?.textContent || '00';
    const kicker = step.querySelector('.step__kicker')?.textContent.trim() || '';
    const title = step.querySelector('.step__title')?.textContent.trim() || '';
    const body = step.querySelector('.step__body')?.textContent.trim() || '';
    openModal({ num, kicker, title, body, tags: [kicker, 'B2B flow'] });
  });
});

// ---------- scale rail nodes ----------
document.querySelectorAll('.scale__node').forEach(node => {
  node.addEventListener('click', () => {
    document.querySelectorAll('.scale__node').forEach(n => n.classList.remove('is-active'));
    node.classList.add('is-active');
    const label = node.dataset.label || '';
    const name = node.querySelector('em')?.textContent || '';
    openModal({
      num: '◆',
      kicker: 'Scale · ' + label,
      title: 'The ' + name,
      body: `A Quacktory duck at ${label}. Same vector silhouette, engineered proportions, cast as a single piece in the ${name} line.`,
      tags: [label, name, 'Cast rubber']
    });
  });
});

// ---------- tooltip pills → modal ----------
document.querySelectorAll('.hero__pills .pill, .pill--ghost').forEach(pill => {
  pill.addEventListener('click', e => {
    if (pill.tagName === 'A') return;
    e.preventDefault();
    const txt = pill.textContent.trim();
    if (!txt) return;
    openModal({
      num: '+',
      kicker: 'Pill',
      title: txt,
      body: 'Tap a card to dive deeper into this scale, material, or compliance note.',
      tags: ['Tooltip', txt]
    });
  });
});

// ---------- share counter ----------
const share = document.querySelector('.hero__tag');
if (share) {
  const counter = document.createElement('span');
  counter.className = 'js-share';
  let count = 0;
  const cap = 12;
  counter.textContent = `· ${count}/${cap} shares`;
  Object.assign(counter.style, { marginLeft: '14px', color: '#C8D6CE', fontStyle: 'normal', letterSpacing: '0.24em', cursor: 'pointer' });
  share.appendChild(counter);
  counter.addEventListener('click', () => {
    if (count >= cap) return;
    count++;
    counter.textContent = `· ${count}/${cap} shares`;
    counter.animate([{ transform: 'scale(1.3)', color: '#E8E4D5' }, { transform: 'scale(1)' }], { duration: 280, easing: 'ease-out' });
  });
}

// ---------- settings gear ----------
const gear = document.createElement('button');
gear.type = 'button';
gear.className = 'js-gear';
gear.setAttribute('aria-label', 'Settings');
gear.textContent = '⚙';
Object.assign(gear.style, {
  position: 'fixed', right: '20px', bottom: '20px', zIndex: 90,
  width: '46px', height: '46px', borderRadius: '50%', border: '1px solid rgba(232,228,213,.25)',
  background: 'rgba(14,42,53,.78)', color: '#E8E4D5', fontSize: '20px', cursor: 'pointer',
  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
  transition: 'transform .25s ease, border-color .25s ease, background .25s ease'
});
gear.addEventListener('mouseenter', () => { gear.style.transform = 'rotate(40deg)'; gear.style.borderColor = 'rgba(200,214,206,.6)'; });
gear.addEventListener('mouseleave', () => { gear.style.transform = 'rotate(0)'; gear.style.borderColor = 'rgba(232,228,213,.25)'; });
gear.addEventListener('click', () => {
  openModal({
    num: '§',
    kicker: 'Settings',
    title: 'Display preferences',
    body: 'This demo uses cream-on-teal editorial defaults. Reduce motion if the bento cards feel busy — toggle the halftone masks, scale rail pulse, and halo breathing animation.',
    tags: ['Reduce motion', 'Theme', 'Reading mode']
  });
});
document.body.appendChild(gear);

// ---------- smooth scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const tgt = document.querySelector(id);
    if (!tgt) return;
    e.preventDefault();
    tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ---------- scroll reveals ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.card, .step, .section__head, .hero__display, .closer__title').forEach(el => {
  el.classList.add('js-reveal');
  io.observe(el);
});
const revealCss = document.createElement('style');
revealCss.textContent = `.js-reveal{opacity:0;transform:translateY(18px);transition:opacity .7s ease,transform .7s ease}.js-reveal.is-in{opacity:1;transform:none}.scale__node{transition:transform .2s ease,background .2s ease}.scale__node:hover{cursor:pointer}.scale__node.is-active span{background:#C8D6CE;box-shadow:0 0 12px rgba(200,214,206,.7)}`;
document.head.appendChild(revealCss);

// ---------- card glow follow ----------
document.querySelectorAll('.card--sku').forEach(card => {
  const glow = card.querySelector('.card__glow');
  if (!glow) return;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    glow.style.left = (e.clientX - r.left) + 'px';
    glow.style.top = (e.clientY - r.top) + 'px';
  });
});
