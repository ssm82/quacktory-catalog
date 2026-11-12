// file: main.js

// ─── SKU DATA (drives the modal taxonomy: size / edition / year / accent) ───
const SKU = {
  micro:    { name:'Micro',    num:'01 / Micro',    size:'4–8 cm',     use:'Keychain · Gift',         price:'from $10',   lead:'In stock', edition:'Open run',   year:'2022', accent:'#0A0A0A', desc:'A thumb-sized duck. Balances on a fingertip, hides in a coin pocket, lives on a keychain. Food-grade silicone compound, painted eyes, single-piece moulding.' },
  classic:  { name:'Classic',  num:'02 / Classic',  size:'10–25 cm',   use:'Shelf · Bath · Desk',     price:'mid-tier',  lead:'3 weeks',  edition:'Open run',   year:'2022', accent:'#3A3A3A', desc:'The reference duck. Reads as a duck at any distance, holds water, survives a 1 m drop. Compression-moulded in aluminium, three minutes per cycle.' },
  designer: { name:'Designer', num:'03 / Designer', size:'15–30 cm',   use:'Illustrator collabs',     price:'mid+',      lead:'6 weeks',  edition:'≤ 300 units',year:'2023', accent:'#A89B8A', desc:'Hand-cast in silicone moulds. Reserved for illustrator collaborations. Limited editions, hand-finished, signed and numbered.' },
  mega:     { name:'Mega',     num:'04 / Mega',     size:'50–120 cm',  use:'Shop-window · Photo',     price:'premium',   lead:'6 weeks',  edition:'Open run',   year:'2024', accent:'#5A6B5A', desc:'A child-sized duck for shop windows, photo sets, and front desks. Rotational-moulded with an internal fibreglass frame for rigidity.' },
  architect:{ name:'Architect',num:'05 / Architect',size:'1.5–3 m',    use:'Installation · Events',   price:'on request',lead:'12 weeks', edition:'One-off',   year:'2024', accent:'#704858', desc:'A 3-metre duck for hotel lobbies and architectural installations. Sculptural casting against a CNC-milled master, welded internal frame, ships in a wooden crate with climate control.' }
};

let shareCount = 0;
const SHARE_CAP = 99;
let lastFocus = null;

// ─── MODAL FACTORY ───
function buildModal(cls) {
  const m = document.createElement('div');
  m.className = 'modal ' + (cls || '');
  m.innerHTML = `
    <div class="modal__overlay" data-close></div>
    <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal__close" data-close aria-label="Close">×</button>
      <div class="modal__body"></div>
    </div>`;
  document.body.appendChild(m);
  m.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  return m;
}

function openSku(sku) {
  const d = SKU[sku]; if (!d) return;
  const m = buildModal('modal--sku');
  lastFocus = document.activeElement;
  m.querySelector('.modal__body').innerHTML = `
    <div class="modal__head">
      <span class="modal__num">${d.num}</span>
      <span class="modal__edition">Edition · ${d.edition} · ${d.year}</span>
    </div>
    <h2 class="modal__title" id="modal-title">${d.name}</h2>
    <p class="modal__desc">${d.desc}</p>
    <dl class="modal__spec">
      <div><dt>Size</dt><dd>${d.size}</dd></div>
      <div><dt>Use</dt><dd>${d.use}</dd></div>
      <div><dt>Price</dt><dd>${d.price}</dd></div>
      <div><dt>Lead time</dt><dd>${d.lead}</dd></div>
    </dl>
    <div class="modal__actions">
      <button class="modal__share" data-share>
        <span>Share</span>
        <span class="modal__share-count" aria-label="Share counter">${shareCount}/${SHARE_CAP}</span>
      </button>
      <a class="modal__cta" href="#quote">Request a quote</a>
    </div>
    <span class="modal__accent" style="--accent:${d.accent}" aria-hidden="true"></span>`;
  const shareBtn = m.querySelector('[data-share]');
  shareBtn.addEventListener('click', () => {
    if (shareCount < SHARE_CAP) {
      shareCount++;
      m.querySelector('.modal__share-count').textContent = `${shareCount}/${SHARE_CAP}`;
    }
  });
  showModal(m);
}

function openSettings() {
  const m = buildModal('modal--settings');
  lastFocus = document.activeElement;
  m.querySelector('.modal__body').innerHTML = `
    <div class="modal__head"><span class="modal__num">Settings</span></div>
    <h2 class="modal__title">Display preferences</h2>
    <p class="modal__desc">This is a single-page editorial site. No persistent settings are stored — movement, contrast, and the dark/light rhythm are part of the design, they don't toggle.</p>
    <p class="modal__desc">Accessibility is delegated to the OS: <em>prefers-reduced-motion</em> disables the staggered reveals, <em>forced-colors</em> inherits from the system, and the dark/light alternation is set by the section, not the user.</p>`;
  showModal(m);
}

function showModal(m) {
  m.classList.add('is-open');
  document.body.classList.add('is-locked');
  const c = m.querySelector('.modal__close'); if (c) c.focus();
}

function closeModal() {
  document.querySelectorAll('.modal.is-open').forEach(m => m.classList.remove('is-open'));
  document.body.classList.remove('is-locked');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // Cards → modal
  document.querySelectorAll('.card__link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const card = link.closest('.card');
      if (card && card.dataset.sku) openSku(card.dataset.sku);
    });
  });

  // Scale rail nodes → modal
  document.querySelectorAll('.scale__step').forEach(step => {
    step.addEventListener('click', () => {
      document.querySelectorAll('.scale__step').forEach(s => s.classList.remove('is-active'));
      step.classList.add('is-active');
      const n = step.querySelector('.scale__name');
      if (n) { const key = n.textContent.trim().toLowerCase(); if (SKU[key]) openSku(key); }
    });
  });

  // Filter chips (tooltip pills)
  const filterBtns = document.querySelectorAll('.filter__btn');
  const cards = document.querySelectorAll('.card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filterBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('is-active'); btn.setAttribute('aria-selected','true');
      cards.forEach(card => {
        card.classList.toggle('is-hidden', !(f === 'all' || card.dataset.size === f));
      });
    });
  });

  // Escape closes any open modal
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Reveal on scroll (IntersectionObserver)
  const revealEls = document.querySelectorAll('.manifesto__headline, .manifesto__col-r, .catalog__title, .catalog__head-r, .card, .scale__title, .scale__step, .production__title, .prod, .b2b__title, .swatch, .palette');
  revealEls.forEach(el => el.classList.add('will-reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-revealed'); io.unobserve(en.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  // Hero parallax (subtle, respects reduced motion)
  const heroImg = document.querySelector('.hero__media img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let raf = false;
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) heroImg.style.transform = `scale(1.02) translateY(${y * 0.06}px)`;
        raf = false;
      });
    }, { passive: true });
  }

  // Form
  const form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'Sent — reply within 48h'; btn.disabled = true; }
    });
  }

  // Settings gear
  const gear = document.createElement('button');
  gear.className = 'gear';
  gear.setAttribute('aria-label', 'Settings');
  gear.innerHTML = '<span>Settings</span>';
  gear.addEventListener('click', openSettings);
  document.body.appendChild(gear);

  // Smooth-scroll fallback
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href'); if (!id || id.length < 2) return;
        const t = document.querySelector(id); if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' }); }
      });
    });
  }
});
