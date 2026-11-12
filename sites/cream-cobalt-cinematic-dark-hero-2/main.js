// file: main.js
const initSite = () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const body = document.body;
  let activeModal = null;
  let activeTrigger = null;
  let lastTrigger = null;
  let previousOverflow = '';
  let fallbackDialog = null;

  const modalStyle = document.createElement('style');
  modalStyle.textContent = `
    dialog[data-reactor-dialog] {
      width: min(42rem, calc(100vw - 2rem));
      max-width: none;
      max-height: calc(100svh - 2rem);
      margin: auto;
      padding: 0;
      border: 1px solid rgba(247, 248, 250, .24);
      border-radius: 0;
      background: var(--ink);
      color: var(--fg);
      box-shadow: 0 2rem 6rem rgba(0, 0, 0, .42);
      overflow: auto;
    }
    dialog[data-reactor-dialog]::backdrop {
      background: rgba(17, 24, 32, .82);
      backdrop-filter: blur(5px);
    }
    dialog[data-reactor-dialog][open] {
      animation: reactor-modal-in 520ms var(--ease-out) both;
    }
    dialog[data-reactor-dialog] [data-reactor-modal-panel] {
      position: relative;
      padding: clamp(2rem, 6vw, 4.5rem);
      border-top: 3px solid var(--modal-accent, var(--accent));
    }
    dialog[data-reactor-dialog] [data-reactor-modal-kicker] {
      margin: 0 0 1rem;
      color: var(--muted);
      font-size: .7rem;
      font-weight: 700;
      letter-spacing: .18em;
      text-transform: uppercase;
    }
    dialog[data-reactor-dialog] [data-reactor-modal-title] {
      max-width: 10ch;
      margin: 0 0 1.4rem;
      font-family: "Bebas Neue", sans-serif;
      font-size: clamp(3.4rem, 9vw, 6.5rem);
      font-weight: 400;
      letter-spacing: -.02em;
      line-height: .86;
      text-transform: uppercase;
    }
    dialog[data-reactor-dialog] [data-reactor-modal-description] {
      max-width: 38rem;
      margin: 0;
      color: rgba(247, 248, 250, .76);
      font-size: 1rem;
      line-height: 1.6;
    }
    dialog[data-reactor-dialog] [data-reactor-modal-facts] {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1px;
      margin: 2.5rem 0 0;
      background: rgba(247, 248, 250, .14);
    }
    dialog[data-reactor-dialog] [data-reactor-modal-facts] > div {
      padding: 1rem;
      background: var(--ink);
    }
    dialog[data-reactor-dialog] dt {
      margin-bottom: .35rem;
      color: var(--surface);
      font-size: .62rem;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
    }
    dialog[data-reactor-dialog] dd {
      margin: 0;
      font-size: .86rem;
    }
    dialog[data-reactor-dialog] [data-reactor-modal-close] {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 2;
      padding: .65rem .85rem;
      border: 1px solid rgba(247, 248, 250, .35);
      border-radius: 0;
      background: var(--ink);
      color: var(--fg);
      cursor: pointer;
      font-size: .65rem;
      font-weight: 700;
      letter-spacing: .14em;
      text-transform: uppercase;
    }
    @keyframes reactor-modal-in {
      from { opacity: 0; transform: translateY(24px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @media (max-width: 36rem) {
      dialog[data-reactor-dialog] [data-reactor-modal-facts] {
        grid-template-columns: 1fr;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      dialog[data-reactor-dialog][open] { animation: none; }
    }
  `;
  document.head.append(modalStyle);

  const readText = (root, selector) => {
    const text = root.querySelector(selector)?.textContent;
    return text ? text.replace(/\s+/g, ' ').trim() : '';
  };

  const accentRules = [
    ['product-card--micro', '#6da9ff'],
    ['product-card--classic', '#bfd7ea'],
    ['product-card--designer', '#b08d57'],
    ['product-card--mega', '#2d73df'],
    ['product-card--architect', '#f7f8fa']
  ];

  const getCardData = (card) => {
    const size = readText(card, '.product-card__size');
    const comparison = readText(card, '.product-card__comparison');
    const audience = readText(card, '.product-card__audience');
    const lead = readText(card, '.product-card__lead');
    const price = readText(card, '.product-card__price');
    const accent = accentRules.find(([className]) => card.classList.contains(className))?.[1]
      || getComputedStyle(card).getPropertyValue('--accent').trim()
      || '#6da9ff';

    return {
      kicker: size || 'Collection detail',
      title: readText(card, '.product-card__line') || 'Object study',
      description: [comparison, audience].filter(Boolean).join(' — ') || 'A closer look at this piece.',
      accent,
      facts: [
        { label: 'Size', value: size },
        { label: 'Scale', value: comparison },
        { label: 'Audience', value: audience },
        { label: 'Lead time', value: lead },
        { label: 'Price', value: price }
      ]
    };
  };

  const updateFallback = (data) => {
    const panel = fallbackDialog.querySelector('[data-reactor-modal-panel]');
    panel.style.setProperty('--modal-accent', data.accent);
    fallbackDialog.querySelector('[data-reactor-modal-kicker]').textContent = data.kicker;
    fallbackDialog.querySelector('[data-reactor-modal-title]').textContent = data.title;
    fallbackDialog.querySelector('[data-reactor-modal-description]').textContent = data.description;

    const facts = fallbackDialog.querySelector('[data-reactor-modal-facts]');
    const factNodes = data.facts.filter(({ value }) => value).map(({ label, value }) => {
      const wrapper = document.createElement('div');
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = value;
      wrapper.append(term, detail);
      return wrapper;
    });
    facts.replaceChildren(...factNodes);
    facts.hidden = factNodes.length === 0;
  };

  const ensureFallback = () => {
    if (fallbackDialog) return fallbackDialog;

    fallbackDialog = document.createElement('dialog');
    fallbackDialog.id = 'reactor-object-dialog';
    fallbackDialog.setAttribute('data-reactor-dialog', '');
    fallbackDialog.setAttribute('aria-labelledby', 'reactor-object-title');
    fallbackDialog.setAttribute('aria-describedby', 'reactor-object-description');
    fallbackDialog.innerHTML = `
      <div data-reactor-modal-panel>
        <button type="button" data-close-modal data-reactor-modal-close>Close</button>
        <p data-reactor-modal-kicker></p>
        <h2 id="reactor-object-title" data-reactor-modal-title></h2>
        <p id="reactor-object-description" data-reactor-modal-description></p>
        <dl data-reactor-modal-facts></dl>
      </div>
    `;
    body.append(fallbackDialog);
    return fallbackDialog;
  };

  const isNativeDialog = (modal) => typeof modal?.showModal === 'function';

  const isCloseControl = (control) => {
    if (!control) return false;
    const label = `${control.getAttribute('aria-label') || ''} ${control.textContent || ''}`
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    return control.hasAttribute('data-close-modal')
      || control.hasAttribute('data-modal-close')
      || /close|dismiss/.test(label)
      || label === '×'
      || label === 'x';
  };

  const ensureCloseControl = (modal) => {
    const controls = [...modal.querySelectorAll('button, a, [role="button"]')];
    if (controls.some(isCloseControl)) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-close-modal', '');
    button.setAttribute('aria-label', 'Close dialog');
    button.textContent = 'Close';
    button.style.cssText = 'position:absolute;top:1rem;right:1rem;z-index:3;padding:.65rem .85rem;border:1px solid rgba(247,248,250,.35);background:var(--ink);color:var(--fg);cursor:pointer;font:700 .65rem Archivo,sans-serif;letter-spacing:.14em;text-transform:uppercase';
    modal.append(button);
  };

  const closeModal = (modal = activeModal, restoreFocus = true) => {
    if (!modal) return;

    if (isNativeDialog(modal)) {
      if (modal.open) modal.close();
    } else {
      modal.hidden = true;
      modal.style.display = 'none';
    }

    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('data-modal-open');
    activeTrigger?.setAttribute('aria-expanded', 'false');
    activeTrigger = null;
    activeModal = null;
    body.style.overflow = previousOverflow;

    if (restoreFocus && lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
    lastTrigger = null;
  };

  const openModal = (trigger, data) => {
    const requestedId = trigger.dataset.openModal;
    const existingModal = requestedId ? document.getElementById(requestedId) : null;
    const modal = existingModal || ensureFallback();

    if (activeModal && activeModal !== modal) closeModal(activeModal, false);
    if (!existingModal) updateFallback(data);
    if (!activeModal) previousOverflow = body.style.overflow;

    lastTrigger = trigger;
    activeTrigger = trigger;
    activeModal = modal;
    body.style.overflow = 'hidden';
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('data-modal-open', 'true');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-controls', modal.id);

    if (isNativeDialog(modal)) {
      modal.setAttribute('aria-modal', 'true');
      if (!modal.open) modal.showModal();
    } else {
      Object.assign(modal.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '10000',
        display: 'flex',
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        maxHeight: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 4rem)',
        overflowY: 'auto',
        background: 'rgba(17, 24, 32, .84)'
      });
    }

    ensureCloseControl(modal);
    requestAnimationFrame(() => {
      if (activeModal !== modal) return;
      const focusTarget = [...modal.querySelectorAll('button, a, [tabindex]')]
        .find((element) => isCloseControl(element));
      (focusTarget || modal).focus?.({ preventScroll: true });
    });
  };

  const isBackdropClick = (modal, event) => {
    if (isNativeDialog(modal)) {
      if (event.target !== modal) return false;
      const rect = modal.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right
        || event.clientY < rect.top || event.clientY > rect.bottom;
    }

    if (event.target === modal) return true;
    const heading = modal.querySelector('h1, h2, h3');
    if (!heading) return false;
    let panel = heading;
    while (panel.parentElement && panel.parentElement !== modal) panel = panel.parentElement;
    return panel.parentElement === modal && !panel.contains(event.target);
  };

  document.querySelectorAll('[data-open-modal]').forEach((card) => {
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-expanded', 'false');
    card.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(card, getCardData(card));
    });
  });

  const heroMedia = document.querySelector('.hero__media');
  if (heroMedia) {
    heroMedia.setAttribute('role', 'button');
    heroMedia.setAttribute('tabindex', '0');
    heroMedia.setAttribute('aria-haspopup', 'dialog');
    heroMedia.setAttribute('aria-expanded', 'false');
    heroMedia.setAttribute('aria-label', 'Explore the central collection');
    heroMedia.style.cursor = 'pointer';

    const openHero = () => {
      const size = readText(heroMedia, '.hero__media-size');
      const note = readText(heroMedia, '.hero__media-note');
      openModal(heroMedia, {
        kicker: readText(heroMedia, '.hero__edge-label') || 'Central object',
        title: readText(heroMedia, '.hero__media-caption') || 'Collection study',
        description: [size, note].filter(Boolean).join(' — '),
        accent: '#b08d57',
        facts: [
          { label: 'Scale', value: size },
          { label: 'Placement', value: note }
        ]
      });
    };

    heroMedia.addEventListener('click', openHero);
    heroMedia.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openHero();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!activeModal) return;
    const control = event.target.closest?.('button, a, [role="button"]');
    if (control && activeModal.contains(control) && isCloseControl(control)) {
      event.preventDefault();
      closeModal();
      return;
    }
    if (isBackdropClick(activeModal, event)) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (!activeModal) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = [...activeModal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => !element.hidden);

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (activeModal || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const link = event.target.closest?.('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    let target;
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return;
    }
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    try {
      history.replaceState(null, '', hash);
    } catch {
      // Keep navigation functional in restricted preview contexts.
    }
  });

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if (revealItems.length) {
    const show = (element) => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    };

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealItems.forEach(show);
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });

      revealItems.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(32px)';
        element.style.transition = 'opacity 720ms var(--ease-out), transform 720ms var(--ease-out)';
        element.style.willChange = 'opacity, transform';
        observer.observe(element);
      });
    }
  }

  const parallaxRoot = document.querySelector('[data-parallax-root]');
  const parallaxLayers = [...document.querySelectorAll('[data-parallax]')];
  if (parallaxRoot && parallaxLayers.length) {
    let frame = 0;

    const render = (x, y) => {
      parallaxLayers.forEach((layer) => {
        const depth = Number.parseFloat(layer.dataset.parallax) || 0.1;
        layer.style.setProperty(
          'translate',
          `${(x * depth * 60).toFixed(2)}px ${(y * depth * 60).toFixed(2)}px`
        );
      });
    };

    parallaxRoot.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches) return;
      const rect = parallaxRoot.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => render(x, y));
    });

    parallaxRoot.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => render(0, 0));
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite, { once: true });
} else {
  initSite();
}
