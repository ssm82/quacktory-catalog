// file: main.js
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SKU_DATA = {
    micro:     { size: '4–8 cm',   tag: 'thumb-sized',   aud: 'Impulse · gifts · merch',  price: 'from $8',     lead: '3 weeks',  accent: '#E83A2E', desc: 'A keychain duck. Fits on a carabiner, in a coat pocket, on a lanyard. Single-piece moulded food-grade silicone, 8-cavity steel mould, ~45 s per cycle.' },
    classic:   { size: '10–25 cm', tag: 'palm-sized',   aud: 'Bathroom · office · kids 3+', price: 'from $24',   lead: '3 weeks',  accent: '#F2C14E', desc: 'The reference duck. Same silhouette as Micro, scaled to a hand. Compression moulded in aluminium, ~3 min per cycle, EN 71-3 certified.' },
    designer:  { size: '15–30 cm', tag: 'cat-sized',    aud: 'Limited · illustrators · 6+', price: 'from $78',   lead: '6 weeks',  accent: '#A23B72', desc: 'A collaboration line. Hand-cast silicone for runs ≤ 300, compression above. Each piece signed on the keel, edition stamped on the foot.' },
    mega:      { size: '50–120 cm', tag: 'child-sized', aud: 'Display · photo object',      price: 'from $640',  lead: '6 weeks',  accent: '#2A6FB8', desc: 'A shop-window duck. Rotationally moulded with a fibreglass internal frame. Pallet delivery. Not a toy — display only.' },
    architect: { size: '1.5–3 m',  tag: 'bear-sized',   aud: 'Installations · events · B2B', price: 'on request', lead: '12 weeks', accent: '#5C5C5C', desc: 'A lobby duck. CNC-milled polystyrene master, fibreglass split mould, on-site assembly protocol, ultrasonic weld inspection.' }
  };

  // ---- Modal ----
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="modal__overlay" data-modal-close></div>
    <div class="modal__panel" role="document">
      <button class="modal__close" type="button" data-modal-close aria-label="Close">
        <span>Close</span><span class="dot dot--lg" aria-hidden="true"></span>
      </button>
      <div class="modal__body"></div>
    </div>`;
  document.body.appendChild(modal);

  const modalBody = modal.querySelector('.modal__body');

  function openModal(html, accent) {
    modalBody.innerHTML = html;
    if (accent) modalBody.style.setProperty('--modal-accent', accent);
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('.modal__close');
    focusable && focusable.focus();
  }
  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  modal.addEventListener('click', (e) => { if (e.target.dataset.modalClose !== undefined) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('modal--open')) closeModal(); });

  // ---- SKU buttons -> modal ----
  document.querySelectorAll('.sku__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sku;
      const data = SKU_DATA[key];
      if (!data) return;
      const name = btn.querySelector('.sku__tag span:last-child')?.textContent || key;
      const num = btn.querySelector('.sku__num')?.textContent || '00';
      const img = btn.querySelector('img')?.getAttribute('src') || '';
      const alt = btn.querySelector('img')?.getAttribute('alt') || '';
      openModal(`
        <div class="modal__head">
          <span class="modal__num">${num} / Line</span>
          <span class="dot dot--accent" aria-hidden="true"></span>
          <span class="modal__tag">${name}</span>
        </div>
        <h2 class="modal__title">${name}</h2>
        ${img ? `<figure class="modal__media"><img src="${img}" alt="${alt}" loading="lazy" decoding="async"></figure>` : ''}
        <p class="modal__desc">${data.desc}</p>
        <dl class="modal__kv">
          <div><dt>Size</dt><dd>${data.size} <em>${data.tag}</em></dd></div>
          <div><dt>Audience</dt><dd>${data.aud}</dd></div>
          <div><dt>Price</dt><dd>${data.price}</dd></div>
          <div><dt>Lead time</dt><dd>${data.lead}</dd></div>
        </dl>
      `, data.accent);
    });
  });

  // ---- Pagination dots (hero) ----
  const dots = document.querySelectorAll('.hero__pagination .dot--lg');
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      dots.forEach((d) => { d.classList.remove('dot--active'); d.setAttribute('aria-selected', 'false'); });
      dot.classList.add('dot--active');
      dot.setAttribute('aria-selected', 'true');
      const i = Array.from(dots).indexOf(dot);
      const targets = ['#hero', '#ladder', '#production', '#b2b', '#contact'];
      const t = document.querySelector(targets[i]);
      if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // ---- Menu toggle (off-canvas) ----
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('primary-menu');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      if (open) menu.setAttribute('hidden', ''); else menu.removeAttribute('hidden');
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('hidden', '');
    }));
  }

  // ---- Smooth scroll fallback + close menu on link click ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // ---- Scroll-spy: keep active pagination dot in sync ----
  const sections = ['hero', 'ladder', 'production', 'b2b', 'contact']
    .map((id) => document.getElementById(id)).filter(Boolean);
  if (sections.length && dots.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const i = sections.indexOf(entry.target);
        if (i < 0) return;
        dots.forEach((d, j) => {
          d.classList.toggle('dot--active', j === i);
          d.setAttribute('aria-selected', String(j === i));
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  // ---- Entry animations: opacity + translate-up on visible blocks ----
  const reveal = (sel, delay = 0) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = reduceMotion ? 'none' : 'translateY(10px)';
      el.style.transition = 'opacity 500ms var(--ease), transform 500ms var(--ease)';
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }, i * (reduceMotion ? 0 : 60) + delay);
            io.unobserve(el);
          }
        });
      }, { threshold: 0.15 });
      io.observe(el);
    });
  };
  reveal('.hero__heading, .hero__sub, .hero__media, .hero__eyebrow', 0);
  reveal('.section__header, .sku, .production__col, .b2b__tpm', 80);
})();
