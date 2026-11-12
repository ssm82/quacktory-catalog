// file: main.js
// Quacktory — interactive layer: modal for duck lines & scale rail, smooth scroll, scroll reveal.

const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

const modal = $('#modal');

const lineData = {
  micro:     { num: '01', title: 'MICRO',     size: '4 — 8 cm',    price: 'from 290 ₽',    lead: 'Lead · 3 weeks',  body: 'Keychain. Merch. Impulse gift up to ~500 ₽. Food-grade silicone compound, one-piece molded form, ~45 sec/injection cycle.' },
  classic:   { num: '02', title: 'CLASSIC',   size: '10 — 25 cm',  price: 'from 1 290 ₽',  lead: 'Lead · 3 weeks',  body: 'Bathroom. Office. Children 3+. The most honest size. Compression molding, ~3 min/cycle. No plastic inserts, metal, or glued seams.' },
  designer:  { num: '03', title: 'DESIGNER',  size: '15 — 30 cm',  price: 'from 4 900 ₽',  lead: 'Lead · 6 weeks',  body: 'Collaboration with illustrators. Limited editions. Collectible object. Hand-molded in a silicone flask with design approval from the author.' },
  mega:      { num: '04', title: 'MEGA',      size: '50 — 120 cm', price: 'from 28 000 ₽', lead: 'Lead · 6 weeks',  body: 'Photo object. Display case. Experience gift. Rotational molding with an internal fiberglass frame. Withstands a 1 m drop.' },
  architect: { num: '05', title: 'ARCHITECT', size: '1.5 — 3 m',   price: 'on request',  lead: 'Lead · 12 weeks', body: 'Installation. Wedding. Space branding. Sculptural casting with a master model and steel frame. On-site measurements and certified installation.' }
};

const scaleData = {
  '4 cm':  { title: 'MICRO',     size: '4 cm',  body: 'As a thumb. Keychain, merch, impulse gift.' },
  '18 cm': { title: 'CLASSIC',   size: '18 cm', body: 'As a kitten. Bathroom, office, children 3+.' },
  '25 cm': { title: 'DESIGNER',  size: '25 cm', body: 'As a cat. Collaboration, limited editions, collectible object.' },
  '90 cm': { title: 'MEGA',      size: '90 cm', body: 'As a child. Photo object, display case, experience gift.' },
  '3 m':   { title: 'ARCHITECT', size: '3 m',   body: 'As a bear. Installation, wedding, branding.' }
};

if (modal) {
  const elNum   = $('[data-modal="num"]',   modal);
  const elTitle = $('[data-modal="title"]', modal);
  const elSize  = $('[data-modal="size"]',  modal);
  const elPrice = $('[data-modal="price"]', modal);
  const elLead  = $('[data-modal="lead"]',  modal);
  const elBody  = $('[data-modal="body"]',  modal);
  let lastFocus = null;

  function openModal(data) {
    if (!data) return;
    lastFocus = document.activeElement;
    if (elNum)   elNum.textContent   = data.num   || '—';
    if (elTitle) elTitle.textContent = data.title || '—';
    if (elSize)  elSize.textContent  = data.size  || '—';
    if (elPrice) elPrice.textContent = data.price || '—';
    if (elLead)  elLead.textContent  = data.lead  || '—';
    if (elBody)  elBody.innerHTML    = '<p>' + (data.body || '—') + '</p>';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(() => { const c = $('.modal__close', modal); if (c) c.focus(); }, 40);
  }

  function closeModal() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  // Duck cards → modal
  $$('.duck').forEach(card => {
    const fire = () => openModal(lineData[card.dataset.line]);
    card.addEventListener('click', fire);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); }
    });
  });

  // Scale rail nodes → modal
  $$('.scale-rail__item').forEach(item => {
    const size = $('.scale-rail__size', item);
    if (!size) return;
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    const fire = () => {
      const d = scaleData[size.textContent.trim()];
      if (d) {
        d.num = (item.querySelector('.scale-rail__name')?.textContent || '—').trim();
        openModal(d);
      }
    };
    item.addEventListener('click', fire);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); }
    });
  });

  // Close: button, overlay, Escape
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// Smooth scroll fallback (CSS scroll-behavior covers modern browsers)
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const t = $(id);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    }
  });
});

// Scroll reveal
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  $$('section, .duck, .scale-rail__item, .prod-cell, .b2b__col').forEach(el => io.observe(el));
}