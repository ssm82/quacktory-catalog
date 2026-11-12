// file: main.js

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const $ = (selector, root = document) => root.querySelector(selector);
const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const read = (root, selector) => clean(root?.querySelector(selector)?.textContent);
const escapeHTML = (value) => String(value || '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
}[character]));

const catalog = {
  micro: {
    title: 'Micro', edition: 'Pocket edition', size: '4–8 cm', comparison: 'thumb-sized',
    audience: 'Keychains, merchandise, and gifts up to roughly $10.',
    age: 'Ages 6+; the 4 cm version is not for children under three.',
    price: 'up to ~$10', unit: 'per unit', shipping: 'including shipping', lead: '3 weeks',
    accent: '#29B8E5', description: 'A thumb-sized release built for keychains, small gifts, and collections that travel.'
  },
  classic: {
    title: 'Classic', edition: 'Core edition', size: '10–25 cm', comparison: 'office-sized',
    audience: 'Kids, bathrooms, desks, and offices.',
    age: 'Ages 3+.',
    price: 'mid', unit: 'per unit', shipping: 'including shipping', lead: '3 weeks',
    accent: '#43C6E8', description: 'The daily office duck, made for shelves, playrooms, desks, and camera-ready interiors.'
  },
  designer: {
    title: 'Designer', edition: 'Limited edition', size: '15–30 cm', comparison: 'cat-sized',
    audience: 'Illustrator collaborations and considered collections.',
    age: 'Ages 6+; a collector’s object rather than a toy.',
    price: 'mid+', unit: 'per unit', shipping: 'including shipping', lead: '6 weeks',
    accent: '#8BD5E7', description: 'A singular, limited-run object for illustrator collaborations and collectors.'
  },
  mega: {
    title: 'Mega', edition: 'Statement edition', size: '50–120 cm', comparison: 'shop-window sized',
    audience: 'Photo sets, shop windows, statement gifts, and branded spaces.',
    age: 'Decorative object; not a toy.',
    price: 'premium', unit: 'per unit', shipping: 'including shipping', lead: '6 weeks',
    accent: '#146A9C', description: 'A dramatic statement duck built for photography, retail displays, and unforgettable gifts.'
  },
  architect: {
    title: 'Architect', edition: 'Installation edition', size: '1.5–3 m', comparison: 'bear-sized',
    audience: 'Installations, events, weddings, and branded environments.',
    age: 'Installation only; mounting by a certified crew.',
    price: 'price on request / spec sheet', unit: '', shipping: '', lead: '12 weeks',
    accent: '#B3D8E2', description: 'An architectural-scale installation that transforms events, venues, and branded environments.'
  }
};

Object.entries(catalog).forEach(([key, item]) => {
  const card = document.querySelector(`.scale-card--${key}`);
  if (!card) return;
  item.title = read(card, '.scale-card__name') || item.title;
  item.size = read(card, '.scale-card__size') || item.size;
  item.comparison = read(card, '.scale-card__comparison') || item.comparison;
  item.audience = read(card, '.scale-card__audience') || item.audience;
  item.age = read(card, '.scale-card__age') || item.age;
  item.price = read(card, '.price-block__figure') || item.price;
  item.unit = read(card, '.price-block__unit') || item.unit;
  item.shipping = read(card, '.price-block__shipping') || item.shipping;
  item.lead = read(card, '.lead-time').replace(/^Lead time\s*/i, '') || item.lead;
});

const modalStyle = document.createElement('style');
modalStyle.textContent = `
#patronus-dialog{width:min(680px,calc(100vw - 32px));max-width:none;max-height:calc(100dvh - 32px);margin:auto;padding:0;border:1px solid rgba(41,184,229,.35);border-radius:0;background:#071724;color:#dce4ea;overflow:hidden;box-shadow:0 30px 100px rgba(0,0,0,.72)}
#patronus-dialog::backdrop{background:rgba(3,10,18,.82);backdrop-filter:blur(7px)}
#patronus-modal-content{position:relative;max-height:calc(100dvh - 32px);overflow:auto}
#patronus-modal-body{padding:clamp(1.5rem,5vw,4rem)}
#patronus-close{position:absolute;z-index:2;top:18px;right:18px;width:44px;height:44px;padding:0;font-size:1.35rem;line-height:1}
#patronus-modal-accent{width:64px;height:3px;margin-bottom:1.6rem;box-shadow:0 0 24px currentColor}
#patronus-modal-eyebrow{margin:0 0 .75rem}
#patronus-modal-title{margin:0 0 .6rem;padding-right:3rem;font-size:clamp(2.4rem,8vw,5rem);line-height:.95}
#patronus-modal-size{margin:0 0 1.2rem;color:var(--accent)}
#patronus-modal-description{max-width:48rem;margin:0 0 2rem;color:rgba(220,228,234,.78)}
#patronus-modal-meta{margin:0;border-top:1px solid var(--line)}
#patronus-modal-meta>div{display:grid;grid-template-columns:140px 1fr;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--line)}
#patronus-modal-meta dt{color:rgba(220,228,234,.54);font-size:.66rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
#patronus-modal-meta dd{margin:0}
#patronus-settings-action{margin-top:2rem}
@media(max-width:560px){#patronus-modal-meta>div{grid-template-columns:1fr;gap:.25rem}}
@media(prefers-reduced-motion:reduce){#patronus-dialog[open]{animation:none}}
@keyframes patronus-dialog-in{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
`;
document.head.append(modalStyle);

const dialog = document.createElement('dialog');
dialog.id = 'patronus-dialog';
dialog.setAttribute('aria-labelledby', 'patronus-modal-title');
dialog.innerHTML = `
  <div id="patronus-modal-content">
    <button class="primary-button" id="patronus-close" type="button" aria-label="Close details">×</button>
    <div id="patronus-modal-body"></div>
  </div>
`;
document.body.append(dialog);

const atmosphereToggle = document.querySelector('.atmosphere-toggle');
const taxonomyNodes = [...document.querySelectorAll('.hero__taxonomy-item')];
let lastTrigger = null;
let modalOpen = false;
let userPaused = false;

function renderProduct(item) {
  const price = [item.price, item.unit, item.shipping].filter(Boolean).join(' · ');
  const rows = [
    ['Size', item.size], ['Edition', item.edition], ['Made for', item.audience],
    ['Price', price], ['Lead time', item.lead], ['Safety', item.age]
  ].map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('');

  $('#patronus-modal-body').innerHTML = `
    <div id="patronus-modal-accent" style="background:${item.accent};color:${item.accent}" aria-label="Accent color ${item.accent}"></div>
    <p id="patronus-modal-eyebrow" class="section-kicker">Quacktory / ${escapeHTML(item.edition)}</p>
    <h2 id="patronus-modal-title" class="section-title">${escapeHTML(item.title)}</h2>
    <p id="patronus-modal-size" class="scale-card__size">${escapeHTML(item.size)} · ${escapeHTML(item.comparison)}</p>
    <p id="patronus-modal-description" class="making__lead">${escapeHTML(item.description)}</p>
    <dl id="patronus-modal-meta">${rows}</dl>
  `;
  dialog.setAttribute('aria-describedby', 'patronus-modal-description');
}

function renderSettings() {
  $('#patronus-modal-body').innerHTML = `
    <div id="patronus-modal-accent" style="background:#29b8e5;color:#29b8e5"></div>
    <p id="patronus-modal-eyebrow" class="section-kicker">Scene settings</p>
    <h2 id="patronus-modal-title" class="section-title">Atmosphere</h2>
    <p id="patronus-modal-description" class="making__lead">Ambient light and gentle depth drift shape the scene. Pause the motion whenever you prefer a still composition.</p>
    <dl id="patronus-modal-meta">
      <div><dt>Scene</dt><dd>Nocturnal blue studio</dd></div>
      <div><dt>Motion</dt><dd>Ambient glow and restrained parallax</dd></div>
      <div><dt>Accessibility</dt><dd>System reduced-motion preferences are respected</dd></div>
    </dl>
    <button class="primary-button" id="patronus-settings-action" type="button">Pause ambient motion</button>
  `;
  dialog.setAttribute('aria-describedby', 'patronus-modal-description');
  updateSettingsAction();
}

function updateSettingsAction() {
  const action = $('#patronus-settings-action');
  if (!action) return;
  action.textContent = reducedMotion.matches ? 'Reduced motion enabled by system' : userPaused ? 'Resume ambient motion' : 'Pause ambient motion';
  action.setAttribute('aria-pressed', String(userPaused));
  action.disabled = reducedMotion.matches;
}

function setActiveTaxonomy(key) {
  taxonomyNodes.forEach((node) => {
    const active = node.dataset.modalOpen === key;
    node.setAttribute('aria-pressed', String(active));
    node.style.color = active ? catalog[key].accent : '';
    node.style.textShadow = active ? '0 0 18px rgba(41,184,229,.45)' : '';
  });
}

function applyMotionState() {
  const running = !reducedMotion.matches && !userPaused && !modalOpen;
  document.querySelectorAll('.hero__backdrop, .hero__figure-glow, .hero__figure-image, .particle').forEach((element) => {
    element.style.animationPlayState = running ? 'running' : 'paused';
  });
  atmosphereToggle?.setAttribute('aria-pressed', String(userPaused));
}

function openDialog(trigger) {
  lastTrigger = trigger;
  modalOpen = true;
  applyMotionState();
  atmosphereToggle?.setAttribute('aria-expanded', 'true');
  if (!dialog.open) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  requestAnimationFrame(() => $('#patronus-close')?.focus({ preventScroll: true }));
}

function finishClosing() {
  modalOpen = false;
  atmosphereToggle?.setAttribute('aria-expanded', 'false');
  applyMotionState();
  if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
}

function closeDialog() {
  if (!dialog.open) return;
  if (typeof dialog.close === 'function') dialog.close();
  else {
    dialog.removeAttribute('open');
    finishClosing();
  }
}

function showProduct(key, trigger) {
  const item = catalog[key];
  if (!item) return;
  renderProduct(item);
  setActiveTaxonomy(key);
  openDialog(trigger);
}

taxonomyNodes.forEach((node) => {
  const key = clean(node.textContent).toLowerCase();
  if (!catalog[key]) return;
  node.dataset.modalOpen = key;
  node.setAttribute('role', 'button');
  node.setAttribute('tabindex', '0');
  node.setAttribute('aria-haspopup', 'dialog');
  node.setAttribute('aria-pressed', 'false');
  node.setAttribute('aria-label', `Open ${catalog[key].title} details`);
  node.title = `View ${catalog[key].title} details`;
  node.style.cursor = 'pointer';
  node.style.touchAction = 'manipulation';
});

const heroFigure = document.querySelector('.hero__figure');
if (heroFigure) {
  heroFigure.removeAttribute('aria-hidden');
  heroFigure.dataset.modalOpen = 'classic';
  heroFigure.setAttribute('role', 'button');
  heroFigure.setAttribute('tabindex', '0');
  heroFigure.setAttribute('aria-haspopup', 'dialog');
  heroFigure.setAttribute('aria-label', 'Open Classic duck details');
  heroFigure.title = 'View Classic duck details';
  heroFigure.style.cursor = 'pointer';
}

document.querySelectorAll('.scale-card__visual').forEach((visual) => {
  const opener = visual.querySelector('[data-modal-open]');
  if (!opener) return;
  visual.style.cursor = 'pointer';
  opener.title = `View ${clean(opener.getAttribute('aria-label'))} details`;
});

if (atmosphereToggle) {
  atmosphereToggle.setAttribute('aria-label', 'Atmosphere settings');
  atmosphereToggle.setAttribute('aria-haspopup', 'dialog');
  atmosphereToggle.setAttribute('aria-expanded', 'false');
  atmosphereToggle.style.minWidth = '44px';
  atmosphereToggle.style.minHeight = '44px';
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const target = event.target;

  const opener = target.closest('[data-modal-open]');
  if (opener) {
    event.preventDefault();
    showProduct(opener.dataset.modalOpen, opener);
    return;
  }

  const visual = target.closest('.scale-card__visual');
  if (visual) {
    const inner = visual.querySelector('[data-modal-open]');
    if (inner) {
      event.preventDefault();
      showProduct(inner.dataset.modalOpen, inner);
    }
    return;
  }

  const atmosphere = target.closest('.atmosphere-toggle');
  if (atmosphere) {
    event.preventDefault();
    renderSettings();
    openDialog(atmosphere);
    return;
  }

  const settingsAction = target.closest('#patronus-settings-action');
  if (settingsAction && !reducedMotion.matches) {
    userPaused = !userPaused;
    applyMotionState();
    updateSettingsAction();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const trigger = event.target.closest('.hero__taxonomy-item, .hero__figure');
  if (!trigger || trigger !== event.target) return;
  event.preventDefault();
  trigger.click();
});

$('#patronus-close')?.addEventListener('click', closeDialog);
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener('close', finishClosing);
dialog.addEventListener('pointerdown', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) closeDialog();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && dialog.open && typeof dialog.showModal !== 'function') closeDialog();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    try { history.pushState(null, '', hash); } catch {}
  });
});

const hero = document.querySelector('.hero');
const backdrop = document.querySelector('.hero__backdrop');
const facets = document.querySelector('.hero__facets');
let parallaxPending = false;

function paintParallax() {
  parallaxPending = false;
  if (!hero || reducedMotion.matches || userPaused || modalOpen) return;
  const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / Math.max(hero.offsetHeight, 1)));
  backdrop?.style.setProperty('translate', `0 ${progress * 30}px`);
  facets?.style.setProperty('translate', `0 ${progress * 7}px`);
  heroFigure?.style.setProperty('translate', `0 ${progress * -14}px`);
}

window.addEventListener('scroll', () => {
  if (parallaxPending) return;
  parallaxPending = true;
  requestAnimationFrame(paintParallax);
}, { passive: true });

const introAnimations = [];
function animateIntro(selector, delay) {
  const element = document.querySelector(selector);
  if (!element || reducedMotion.matches) return;
  const animation = element.animate([
    { opacity: 0, transform: 'translateY(18px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 780, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
  animation.addEventListener('finish', () => animation.cancel(), { once: true });
  introAnimations.push(animation);
}

[
  ['.brand-mark', 0], ['.hero__eyebrow', 120], ['.hero__title', 220],
  ['.hero__support', 390], ['.hero__actions', 470], ['.hero__taxonomy', 550],
  ['.hero__hint', 610], ['.hero__figure', 300]
].forEach(([selector, delay]) => animateIntro(selector, delay));

const revealTargets = [...document.querySelectorAll('.section-heading, .scale-card, .making__intro, .making__chapter')];
let revealObserver;
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  revealTargets.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(24px)';
  });
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const siblings = element.parentElement ? [...element.parentElement.children] : [];
      const delay = Math.min(siblings.indexOf(element), 6) * 65;
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.animate([
        { opacity: 0, transform: 'translateY(24px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 760, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      revealObserver.unobserve(element);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });
  revealTargets.forEach((element) => revealObserver.observe(element));
}

reducedMotion.addEventListener('change', (event) => {
  if (event.matches) {
    introAnimations.forEach((animation) => animation.cancel());
    revealObserver?.disconnect();
    revealTargets.forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    });
    backdrop?.style.removeProperty('translate');
    facets?.style.removeProperty('translate');
    heroFigure?.style.removeProperty('translate');
  }
  applyMotionState();
  updateSettingsAction();
});

applyMotionState();
paintParallax();
