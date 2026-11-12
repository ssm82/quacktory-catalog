// file: main.js
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clampCount = (value) => Math.min(999, Math.max(0, value));
const titleCase = (value = '') => value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const modalStyles = document.createElement('style');
modalStyles.textContent = `
  dialog[data-quacktory-modal] {
    position: fixed; inset: 0; width: min(960px, calc(100vw - 32px));
    max-height: calc(100dvh - 32px); margin: auto; padding: 0; border: 0;
    color: var(--fg); background: var(--surface); overflow: auto;
    box-shadow: 0 36px 120px rgba(8, 4, 15, .62);
  }
  dialog[data-quacktory-modal]::backdrop {
    background: rgba(16, 11, 26, .82); backdrop-filter: blur(4px);
  }
  [data-modal-panel] { display: grid; grid-template-columns: minmax(280px, .9fr) 1.1fr; min-height: min(680px, calc(100dvh - 32px)); }
  [data-modal-media] { position: relative; min-height: 100%; overflow: hidden; background: radial-gradient(circle at 45% 40%, #9b6bff, #35105c 48%, #100b1a 100%); }
  [data-modal-image] { width: 100%; height: 100%; min-height: 480px; object-fit: cover; }
  [data-modal-body] { position: relative; padding: 74px clamp(28px, 5vw, 68px) 52px; }
  [data-modal-eyebrow] { margin: 0 0 16px; color: var(--cyan); font-size: 10px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
  [data-modal-title] { margin: 0; font-family: "Playfair Display", Georgia, serif; font-size: clamp(46px, 7vw, 86px); font-weight: 500; line-height: .9; }
  [data-modal-summary] { margin: 26px 0 0; color: var(--muted); font-size: 15px; line-height: 1.7; }
  [data-modal-price] { margin-top: 30px; padding: 18px 0; border-block: 1px solid rgba(242,240,245,.18); }
  [data-modal-price] strong { display: block; font-size: 19px; }
  [data-modal-price] span { display: block; margin-top: 4px; color: var(--muted); font-size: 9px; letter-spacing: .16em; text-transform: uppercase; }
  [data-modal-specs] { display: grid; grid-template-columns: 1fr 1fr; gap: 0 26px; margin: 26px 0 34px; }
  [data-modal-specs] > div { padding: 14px 0; border-top: 1px solid rgba(242,240,245,.12); }
  [data-modal-specs] dt { margin-bottom: 5px; color: var(--muted); font-size: 8px; font-weight: 700; letter-spacing: .17em; text-transform: uppercase; }
  [data-modal-specs] dd { margin: 0; font-size: 12px; line-height: 1.55; }
  [data-modal-close] { position: absolute; z-index: 3; top: 20px; right: 20px; min-height: 40px; padding: 0 14px; border: 0; color: var(--ink); background: var(--fg); cursor: pointer; }
  [data-modal-quote] { width: fit-content; }
  .scale-trigger[aria-pressed="true"] .scale-orbit { outline: 1px solid var(--cyan); outline-offset: 7px; }
  .scale-trigger[aria-pressed="true"] .scale-line-name { color: var(--cyan); }
  @media (max-width: 700px) {
    [data-modal-panel] { grid-template-columns: 1fr; }
    [data-modal-media] { min-height: 240px; }
    [data-modal-image] { min-height: 240px; max-height: 42dvh; }
    [data-modal-body] { padding: 58px 22px 34px; }
    [data-modal-specs] { grid-template-columns: 1fr; }
  }
`;
document.head.append(modalStyles);

const modal = document.createElement('dialog');
modal.setAttribute('data-quacktory-modal', '');
modal.setAttribute('aria-labelledby', 'quacktory-modal-title');
modal.innerHTML = `
  <div data-modal-panel>
    <button data-modal-close class="modal-action" type="button" aria-label="Close details">Close <span class="action-arrow" aria-hidden="true">×</span></button>
    <div data-modal-media><img data-modal-image alt="" hidden></div>
    <div data-modal-body>
      <p data-modal-eyebrow></p>
      <h2 id="quacktory-modal-title" data-modal-title></h2>
      <p data-modal-summary></p>
      <div data-modal-price hidden><strong data-modal-price-main></strong><span data-modal-price-meta></span></div>
      <dl data-modal-specs></dl>
      <a data-modal-quote class="primary-action" href="#custom">Request a quote <span class="action-arrow" aria-hidden="true">↗</span></a>
    </div>
  </div>
`;
document.body.append(modal);

const modalImage = $('[data-modal-image]', modal);
const modalTitle = $('[data-modal-title]', modal);
const modalEyebrow = $('[data-modal-eyebrow]', modal);
const modalSummary = $('[data-modal-summary]', modal);
const modalPrice = $('[data-modal-price]', modal);
const modalPriceMain = $('[data-modal-price-main]', modal);
const modalPriceMeta = $('[data-modal-price-meta]', modal);
const modalSpecs = $('[data-modal-specs]', modal);
const scaleTriggers = $$('.scale-trigger');
let returnFocus = null;

function resolveModalTrigger(target) {
  const explicit = target.closest('[data-modal-trigger]');
  const holder = target.closest('[data-product-id]');
  const trigger = explicit || (holder && (holder.matches('button, a, [role="button"]') ? holder : holder.querySelector('[data-modal-trigger]')));
  if (!trigger) return null;
  const cardTrigger = trigger.closest('.scale-card')?.querySelector('.scale-trigger');
  return {
    trigger: cardTrigger || trigger,
    data: { ...(cardTrigger?.dataset || {}), ...(holder?.dataset || {}), ...trigger.dataset }
  };
}

function openModal(trigger, source = trigger.dataset || {}) {
  const title = titleCase(source.title || source.productId || source.modalTrigger || 'Quacktory');
  const summary = source.summary || `Meet the ${title}. A considered Quacktory object made for shelves, screens and very selective duck ponds.`;
  const scaleTrigger = trigger.matches('.scale-trigger') ? trigger : trigger.closest('.scale-card')?.querySelector('.scale-trigger');

  scaleTriggers.forEach((button) => button.setAttribute('aria-pressed', 'false'));
  if (scaleTrigger) scaleTrigger.setAttribute('aria-pressed', 'true');

  modalTitle.textContent = title;
  modalSummary.textContent = summary;
  const scaleIndex = scaleTriggers.indexOf(scaleTrigger);
  modalEyebrow.textContent = scaleIndex >= 0 ? `Scale ladder / ${String(scaleIndex + 1).padStart(2, '0')}` : 'Quacktory / object';

  modalImage.onerror = () => { modalImage.hidden = true; };
  modalImage.hidden = !source.image;
  if (source.image) {
    modalImage.src = source.image;
    modalImage.alt = `${title} rubber duck`;
  } else {
    modalImage.removeAttribute('src');
  }

  const pricePrimary = source.priceDisplay || (source.pricePositioning ? `${titleCase(source.pricePositioning)} pricing` : '');
  const priceSecondary = [source.priceDisplay && source.pricePositioning ? source.pricePositioning : '', source.priceUnit, source.priceShipping].filter(Boolean).join(' · ');
  modalPrice.hidden = !pricePrimary;
  modalPriceMain.textContent = pricePrimary;
  modalPriceMeta.textContent = priceSecondary;

  const details = [
    ['Size', source.size], ['Comparison', source.comparison], ['Best for', source.audience],
    ['Market position', source.pricePositioning], ['Material', source.material],
    ['Production', source.technology], ['Tooling', source.tooling], ['Cycle', source.cycle],
    ['Packaging', source.packaging], ['Shipping', source.shipping], ['Lead time', source.leadTime],
    ['Age & use', source.age]
  ].filter(([, value]) => value);

  modalSpecs.replaceChildren(...details.map(([label, value]) => {
    const group = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    group.append(term, description);
    return group;
  }));

  returnFocus = trigger;
  if (!modal.open) {
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  }
  if (!reducedMotion.matches && typeof modal.animate === 'function') {
    modal.animate(
      [{ opacity: 0, transform: 'translateY(20px) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
      { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );
  }
}

function closeModal() {
  if (!modal.open) return;
  if (typeof modal.close === 'function') modal.close();
  else {
    modal.removeAttribute('open');
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  }
}

document.addEventListener('click', (event) => {
  const resolved = resolveModalTrigger(event.target);
  if (!resolved || modal.contains(event.target)) return;
  event.preventDefault();
  openModal(resolved.trigger, resolved.data);
});

$('[data-modal-close]', modal).addEventListener('click', closeModal);
modal.addEventListener('cancel', (event) => { event.preventDefault(); closeModal(); });
modal.addEventListener('close', () => {
  if (returnFocus?.isConnected) returnFocus.focus();
  returnFocus = null;
});
modal.addEventListener('click', (event) => {
  if (event.target !== modal) return;
  const bounds = modal.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) closeModal();
});

const menuToggle = $('.menu-toggle');
const navLinks = $('.nav-links');
const primaryNav = $('.primary-nav');
let menuOpen = false;
let scrollTimer;

function menuIsCompact() {
  return Boolean(menuToggle && getComputedStyle(menuToggle).display !== 'none');
}

function setMenu(open) {
  if (!menuToggle || !navLinks) return;
  const compact = menuIsCompact();
  menuOpen = Boolean(open && compact);
  menuToggle.setAttribute('aria-expanded', String(menuOpen));
  navLinks.setAttribute('aria-expanded', String(menuOpen));
  navLinks.id = navLinks.id || 'primary-menu';

  if (!compact) {
    navLinks.hidden = false;
    primaryNav && (primaryNav.style.position = '');
    ['position', 'top', 'left', 'right', 'display', 'flex-direction', 'align-items', 'gap', 'padding', 'background', 'box-shadow', 'z-index'].forEach((property) => navLinks.style.removeProperty(property));
    return;
  }

  primaryNav && (primaryNav.style.position = 'relative');
  if (menuOpen) {
    navLinks.hidden = false;
    Object.assign(navLinks.style, {
      position: 'absolute', top: 'calc(100% + 8px)', left: '0', right: '0',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
      padding: '22px 24px', background: 'rgba(36, 16, 68, .98)',
      boxShadow: '0 24px 60px rgba(8, 4, 15, .42)', zIndex: '45'
    });
  } else {
    navLinks.hidden = true;
    ['position', 'top', 'left', 'right', 'display', 'flex-direction', 'align-items', 'gap', 'padding', 'background', 'box-shadow', 'z-index'].forEach((property) => navLinks.style.removeProperty(property));
  }
}

menuToggle?.addEventListener('click', () => setMenu(!menuOpen));
window.addEventListener('resize', () => setMenu(menuOpen));
setMenu(false);

document.addEventListener('click', (event) => {
  if (menuOpen && !menuToggle.contains(event.target) && !navLinks.contains(event.target)) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuOpen) setMenu(false);
});

document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;
  const hash = anchor.getAttribute('href');
  if (!hash || hash.length < 2) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  event.preventDefault();
  setMenu(false);
  if (modal.contains(anchor)) closeModal();
  target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  history.pushState(null, '', hash);
  clearTimeout(scrollTimer);
  const heading = target.matches('h1, h2') ? target : target.querySelector('h1, h2') || target;
  heading.setAttribute('tabindex', '-1');
  scrollTimer = setTimeout(() => heading.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 700);
});

$$('.technology-drawer').forEach((drawer) => {
  const symbol = $('.drawer-symbol', drawer);
  const syncSymbol = () => { if (symbol) symbol.textContent = drawer.open ? '−' : '+'; };
  drawer.addEventListener('toggle', syncSymbol);
  syncSymbol();
});

if (!reducedMotion.matches) {
  const motion = (node, frames, options) => node?.animate?.(frames, options);
  motion($('.brand-lockup'), [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
  motion($('.primary-action'), [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, delay: 100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
  motion($('.hero-orbit'), [{ opacity: .25, transform: 'scale(.96)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
  $$('.hero-letter').forEach((letter, index) => motion(letter, [
    { opacity: 0, transform: 'translateY(36px)', clipPath: 'inset(0 0 100% 0)' },
    { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' }
  ], { duration: 720, delay: 180 + index * 85, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }));
}

const revealNodes = $$('.section-heading, .production-intro, .production-card, .quality-card, .technology-drawer, .fact-card');
if (!reducedMotion.matches && 'IntersectionObserver' in window && revealNodes.length) {
  revealNodes.forEach((node) => { node.style.opacity = '0'; });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = entry.target.parentElement ? [...entry.target.parentElement.children].indexOf(entry.target) : 0;
      const animation = entry.target.animate(
        [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 700, delay: (siblings % 4) * 65, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }
      );
      animation?.addEventListener('finish', () => { entry.target.style.opacity = ''; }, { once: true });
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  revealNodes.forEach((node) => observer.observe(node));
}

const hero = $('.hero-section');
const atmosphere = $('.hero-atmosphere');
const heroOrbit = $('.hero-orbit');
if (hero && atmosphere && heroOrbit && window.matchMedia('(pointer: fine)').matches) {
  let frame = 0;
  hero.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches) return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
    const y = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
    if (!frame) frame = requestAnimationFrame(() => {
      atmosphere.style.translate = `${x * 10}px ${y * 8}px`;
      heroOrbit.style.translate = `${x * 5}px ${y * 4}px`;
      frame = 0;
    });
  });
  hero.addEventListener('pointerleave', () => {
    atmosphere.style.translate = '';
    heroOrbit.style.translate = '';
  });
}

const settingsControl = $$('button, a').find((node) => /settings/i.test(node.getAttribute('aria-label') || node.getAttribute('title') || ''));
if (settingsControl && !settingsControl.hasAttribute('data-modal-trigger')) {
  settingsControl.addEventListener('click', (event) => {
    event.preventDefault();
    openModal(settingsControl, {
      title: 'Settings',
      summary: 'Display and motion preferences follow your system. Reduced-motion support is enabled automatically.'
    });
  });
}

const shareControl = $$('button, a').find((node) => /share/i.test([
  node.getAttribute('aria-label'), node.getAttribute('title'), node.getAttribute('href'), node.dataset.share, node.textContent
].filter(Boolean).join(' ')));
if (shareControl) {
  let counter = $('[data-share-count]', shareControl) || $('[data-share-count]', shareControl.parentElement || document);
  if (!counter) {
    counter = document.createElement('span');
    counter.setAttribute('data-share-count', '');
    counter.setAttribute('aria-live', 'polite');
    counter.style.cssText = 'display:inline-flex;margin-left:.5rem;font-size:9px;letter-spacing:.12em;text-transform:uppercase;';
    shareControl.insertAdjacentElement('afterend', counter);
  }
  const existingCount = Number((counter.textContent.match(/\d+/) || [0])[0]);
  let count = clampCount(existingCount);
  counter.textContent = `${count} ${count === 1 ? 'share' : 'shares'}`;
  shareControl.addEventListener('click', () => {
    count = clampCount(count + 1);
    counter.textContent = `${count} ${count === 1 ? 'share' : 'shares'}`;
  });
}
