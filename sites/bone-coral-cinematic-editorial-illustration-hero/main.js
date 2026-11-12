// file: main.js
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const ACCENTS = {
    micro: '#F2C94C', classic: '#5BA8C9', designer: '#A23B72',
    mega: '#E89B4A', architect: '#C8202A'
  };

  // === Modal ===
  const modal = document.getElementById('qt-modal');
  const titleEl = modal.querySelector('#qt-modal-title');
  const tagEl = modal.querySelector('.qt-modal__tag');
  const copyEl = modal.querySelector('#qt-modal-copy');
  const specEl = modal.querySelector('#qt-modal-spec');
  const SPEC_FIELDS = [
    ['Size', 'size'],
    ['Audience', 'aud'],
    ['Price', 'price'],
    ['Age', 'age'],
    ['Lead time', 'lead']
  ];

  let currentSubject = null;

  const openModal = (subject) => {
    currentSubject = subject;
    const d = subject.dataset;
    const key = (d.modal || d.line || 'subject').toLowerCase();
    const line = (d.line || key).toUpperCase();
    titleEl.textContent = line;
    tagEl.textContent = `[ ${key.toUpperCase()} ]`;
    copyEl.textContent = d.desc || `The ${line.toLowerCase()} line of the Quacktory scale ladder. One silhouette across every size, vulcanised rubber, hand-painted eyes.`;
    specEl.innerHTML = SPEC_FIELDS
      .map(([label, field]) => `<dt>${label}</dt><dd>${d[field] || '—'}</dd>`)
      .join('');
    modal.style.setProperty('--accent', ACCENTS[key] || '#C8202A');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (!reduced) {
      const panel = modal.querySelector('.qt-modal__panel');
      panel.style.transition = 'none';
      panel.style.transform = 'translateY(10px)';
      panel.style.opacity = '0';
      requestAnimationFrame(() => {
        panel.style.transition = `transform 380ms ${easeOut}, opacity 380ms ${easeOut}`;
        panel.style.transform = 'translateY(0)';
        panel.style.opacity = '1';
      });
    }
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentSubject = null;
  };

  modal.addEventListener('click', (e) => { if (e.target.closest('[data-modal-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

  // === Bind all subjects (tiles, sections, gear) ===
  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); openModal(el); });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(el); }
    });
  });

  // === Tooltip pills (open parent tile's modal) ===
  document.querySelectorAll('.qt-tile__pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const tile = pill.closest('[data-modal]');
      if (tile) openModal(tile);
    });
  });

  // === Active state on timeline rail (tiles) + nav ===
  const tiles = document.querySelectorAll('.qt-tile');
  tiles.forEach(t => t.addEventListener('click', () => {
    tiles.forEach(o => o.classList.remove('is-active'));
    t.classList.add('is-active');
  }));

  const navItems = document.querySelectorAll('.qt-nav__item');
  navItems.forEach(n => n.addEventListener('click', () => {
    navItems.forEach(o => o.classList.remove('is-active'));
    n.classList.add('is-active');
  }));

  // === Smooth scroll fallback ===
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  // === Scroll-driven reveals ===
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.qt-tile, .qt-prod-block, .qt-section-head, .qt-hero__tag, .qt-hero__manifesto, .qt-corner-label')
      .forEach(el => { el.classList.add('qt-reveal'); io.observe(el); });
  }
})();
