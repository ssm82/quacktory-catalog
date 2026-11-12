// file: main.js
const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = () => motionMedia.matches;

const products = {
  micro: {
    name: 'Micro', size: '4–8 cm', comparison: 'thumb-sized', lead: '3 weeks',
    material: 'Food-grade silicone', edition: 'Core range', accent: '#D79445',
    image: './assets/product-micro.jpg',
    description: 'A thumb-sized duck moulded in food-grade silicone, made for pockets, desks and introductions that stay dry.'
  },
  classic: {
    name: 'Classic', size: '10–25 cm', comparison: 'cat-sized', lead: '3 weeks',
    material: 'Food-grade silicone', edition: 'Core range', accent: '#F3D08A',
    image: './assets/product-classic.jpg',
    description: 'A cat-sized duck with the same single-piece moulding and food-grade silicone compound, ready for a shelf or a small crew.'
  },
  designer: {
    name: 'Designer', size: '15–30 cm', comparison: "collector’s-object-sized", lead: '6 weeks',
    material: 'Natural rubber with EPDM additives', edition: 'Core range', accent: '#760B20',
    image: './assets/product-designer.jpg',
    description: 'A collector’s-object-sized duck moulded in natural rubber with EPDM additives, with the same calm, camera-ready silhouette.'
  },
  mega: {
    name: 'Mega', size: '50–120 cm', comparison: 'shop-window-sized', lead: '6 weeks',
    material: 'Natural rubber with EPDM additives', edition: 'Core range', accent: '#5C536D',
    image: './assets/product-mega.jpg',
    description: 'A shop-window-sized duck in natural rubber with EPDM additives, scaled to hold a room without becoming furniture.'
  },
  architect: {
    name: 'Architect', size: '1.5–3 m', comparison: 'bear-sized', lead: '12 weeks',
    material: 'Natural rubber with EPDM additives', edition: 'Core range', accent: '#7DE7F4',
    image: './assets/product-architect.jpg',
    description: 'A bear-sized duck in natural rubber with EPDM additives, with welded-frame inspection and an on-site assembly photo protocol.'
  }
};

const menuTrigger = document.querySelector('[data-menu-trigger]');
const menu = document.querySelector('[data-menu]');
const dialog = document.querySelector('#object-dialog');
const objectTriggers = [...document.querySelectorAll('[data-open-dialog]')];
let menuIsOpen = false;
let activeTrigger = null;
let previousOverflow = null;
let dialogWasHidden = false;

function focusWithoutScrolling(element) {
  if (!element) return;
  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
}

function setMenu(open) {
  if (!menu || !menuTrigger) return;
  menuIsOpen = open;
  menuTrigger.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
  if (open) menu.removeAttribute('inert');
  else menu.setAttribute('inert', '');
  document.body.classList.toggle('menu-is-open', open);

  if (open) {
    requestAnimationFrame(() => focusWithoutScrolling(menu.querySelector('a[href], button')));
  } else if (menu.contains(document.activeElement)) {
    focusWithoutScrolling(menuTrigger);
  }
}

if (menuTrigger && menu) {
  menuTrigger.addEventListener('click', () => setMenu(!menuIsOpen));

  document.addEventListener('pointerdown', (event) => {
    if (menuIsOpen && !menu.contains(event.target) && !menuTrigger.contains(event.target)) {
      setMenu(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !menuIsOpen) return;
    const focusable = [
      menuTrigger,
      ...menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      focusWithoutScrolling(last);
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      focusWithoutScrolling(first);
    }
  });
}

function scrollToElement(target, updateUrl = true) {
  target.scrollIntoView({
    behavior: reducedMotion() ? 'auto' : 'smooth',
    block: 'start'
  });
  if (updateUrl && target.id) {
    try {
      history.pushState(null, '', `#${encodeURIComponent(target.id)}`);
    } catch {
      // Navigation can be unavailable in sandboxed frames.
    }
  }
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link) return;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || !url.hash) return;

  let id = url.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    id = url.hash.slice(1);
  }

  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();

  const wasMenuOpen = menuIsOpen;
  if (wasMenuOpen) setMenu(false);
  window.setTimeout(() => scrollToElement(target), wasMenuOpen && !reducedMotion() ? 120 : 0);
});

function findClassField(root, suffixes) {
  const wanted = Array.isArray(suffixes) ? suffixes : [suffixes];
  const matches = [...root.querySelectorAll('*')].filter((element) =>
    [...element.classList].some((className) =>
      wanted.some((suffix) => className.endsWith(`__${suffix}`) || className.endsWith(`-${suffix}`))
    )
  );
  matches.sort((a, b) => a.children.length - b.children.length);
  return matches[0] || null;
}

function bindField(root, names, value) {
  names.forEach((name) => {
    const kebab = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const attributes = [...new Set([
      `data-dialog-${kebab}`,
      `data-dialog-${name.toLowerCase()}`,
      `data-${kebab}`
    ])];
    const selector = attributes.map((attribute) => `[${attribute}]`).join(',');

    root.querySelectorAll(selector).forEach((element) => {
      if (name === 'image' || element.tagName === 'IMG') {
        element.src = value;
      } else if (name === 'accent') {
        element.style.backgroundColor = value;
        element.setAttribute('aria-label', value);
      } else {
        element.textContent = value;
      }
    });
  });
}

function productFor(trigger) {
  const key = trigger.dataset.openDialog;
  const product = products[key] ? { ...products[key] } : {
    name: 'Quacktory', size: '', comparison: '', lead: '',
    material: '', edition: 'Core range', accent: '#760B20', description: ''
  };
  const read = (selector) => trigger.querySelector(selector)?.textContent.trim() || '';
  product.name = read('.sku__name') || product.name;
  product.size = read('.sku__size') || product.size;
  product.comparison = read('.sku__comparison') || product.comparison;
  product.lead = read('.sku__lead') || product.lead;
  return product;
}

function populateDialog(product, key, trigger) {
  bindField(dialog, ['title', 'name'], product.name);
  bindField(dialog, ['size'], product.size);
  bindField(dialog, ['comparison'], product.comparison);
  bindField(dialog, ['lead', 'leadTime', 'lead-time'], product.lead);
  bindField(dialog, ['material'], product.material);
  bindField(dialog, ['edition'], product.edition);
  bindField(dialog, ['description', 'copy'], product.description);
  bindField(dialog, ['accent'], product.accent);
  bindField(dialog, ['image'], product.image);

  const heading = dialog.querySelector('h1, h2, h3');
  const titleField = findClassField(dialog, ['title', 'name']);
  if (titleField) titleField.textContent = product.name;
  else if (heading) heading.textContent = product.name;

  const eyebrow = findClassField(dialog, 'eyebrow');
  if (eyebrow) eyebrow.textContent = `Quacktory / ${product.name}`;

  const sizeField = findClassField(dialog, 'size');
  if (sizeField) sizeField.textContent = product.size;
  const comparisonField = findClassField(dialog, 'comparison');
  if (comparisonField) comparisonField.textContent = product.comparison;
  const leadField = findClassField(dialog, ['lead', 'lead-time']);
  if (leadField) leadField.textContent = product.lead;
  const materialField = findClassField(dialog, 'material');
  if (materialField) materialField.textContent = product.material;

  dialog.querySelectorAll('dt').forEach((term) => {
    const label = term.textContent.trim().toLowerCase();
    let value = '';
    if (label.includes('size')) value = product.size;
    else if (label.includes('compar') || label.includes('scale')) value = product.comparison;
    else if (label.includes('lead')) value = product.lead;
    else if (label.includes('material') || label.includes('compound')) value = product.material;
    else if (label.includes('edition')) value = product.edition;
    const valueElement = term.nextElementSibling;
    if (value && valueElement && valueElement.tagName === 'DD') valueElement.textContent = value;
  });

  let description = findClassField(dialog, ['description', 'copy']);
  if (!description) {
    const paragraphs = [...dialog.querySelectorAll('p')];
    description = paragraphs.find((paragraph) => paragraph !== eyebrow && paragraph.textContent.trim().length > 18);
    if (!description && paragraphs.length > 1) description = paragraphs[1];
  }
  if (description) {
    description.textContent = product.description;
  } else if (heading) {
    const paragraph = document.createElement('p');
    paragraph.textContent = product.description;
    heading.insertAdjacentElement('afterend', paragraph);
  }

  const sourceImage = trigger.querySelector('.sku__image');
  const dialogImage = dialog.querySelector('img');
  if (dialogImage && sourceImage) {
    dialogImage.src = sourceImage.currentSrc || sourceImage.src;
    dialogImage.alt = sourceImage.alt || `Quacktory ${product.name}`;
  }

  dialog.dataset.sku = key;
  dialog.dataset.accent = product.accent;
  dialog.style.setProperty('--dialog-accent', product.accent);
  dialog.style.setProperty('--product-accent', product.accent);
  dialog.style.setProperty('--accent', product.accent);
  dialog.setAttribute('aria-label', `${product.name} product details`);

  objectTriggers.forEach((item) => {
    const active = item === trigger;
    item.setAttribute('aria-pressed', String(active));
    item.dataset.active = String(active);
    item.style.setProperty('--product-accent', active ? product.accent : '');
    item.style.setProperty('--accent', active ? product.accent : '');
  });

  const ray = document.querySelector(`.scale-ray--${key}`);
  if (ray) {
    ray.dataset.active = 'true';
    ray.style.setProperty('--product-accent', product.accent);
  }
}

function cleanupDialog() {
  if (previousOverflow !== null) {
    document.body.style.overflow = previousOverflow;
    previousOverflow = null;
  }
  objectTriggers.forEach((item) => {
    item.setAttribute('aria-pressed', 'false');
    item.dataset.active = 'false';
    item.style.removeProperty('--product-accent');
    item.style.removeProperty('--accent');
  });
  document.querySelectorAll('.scale-ray').forEach((ray) => {
    ray.dataset.active = 'false';
    ray.style.removeProperty('--product-accent');
  });
  if (dialog) dialog.setAttribute('aria-hidden', 'true');
  if (dialogWasHidden && dialog) dialog.setAttribute('hidden', '');
  dialogWasHidden = false;
  if (activeTrigger) focusWithoutScrolling(activeTrigger);
  activeTrigger = null;
}

function closeDialog() {
  if (!dialog) return;
  if (typeof dialog.close === 'function' && dialog.open) dialog.close();
  else {
    dialog.removeAttribute('open');
    cleanupDialog();
  }
}

function openDialog(trigger) {
  if (!dialog) return;
  const key = trigger.dataset.openDialog;
  const product = productFor(trigger);
  activeTrigger = trigger;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  dialogWasHidden = dialog.hasAttribute('hidden');
  dialog.removeAttribute('hidden');
  dialog.removeAttribute('inert');
  dialog.setAttribute('aria-hidden', 'false');
  populateDialog(product, key, trigger);

  if (typeof dialog.showModal === 'function') {
    try {
      if (!dialog.open) dialog.showModal();
    } catch {
      dialog.setAttribute('open', '');
    }
  } else {
    dialog.setAttribute('open', '');
  }

  requestAnimationFrame(() => {
    const closeButton = [...dialog.querySelectorAll('button')].find((button) => {
      const label = `${button.getAttribute('aria-label') || ''} ${button.textContent || ''}`.toLowerCase();
      return label.includes('close');
    });
    focusWithoutScrolling(closeButton || dialog.querySelector('button'));
  });
}

objectTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (menuIsOpen) setMenu(false);
    openDialog(trigger);
  });
});

if (dialog) {
  dialog.addEventListener('close', cleanupDialog);

  dialog.querySelectorAll('button').forEach((button) => {
    const label = `${button.getAttribute('aria-label') || ''} ${button.textContent || ''}`.toLowerCase();
    if (!button.hasAttribute('data-dialog-close') && label.includes('close')) {
      button.addEventListener('click', closeDialog);
    }
  });

  dialog.addEventListener('click', (event) => {
    let element = event.target;
    while (element && element !== dialog) {
      const isBackdrop = element.hasAttribute('data-dialog-close') ||
        [...element.classList].some((className) => className.includes('backdrop'));
      if (isBackdrop) {
        closeDialog();
        return;
      }
      element = element.parentElement;
    }
    if (event.target === dialog) closeDialog();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (dialog && (dialog.open || dialog.hasAttribute('open'))) {
    event.preventDefault();
    closeDialog();
  } else if (menuIsOpen) {
    setMenu(false);
  }
});

function play(el, keyframes, delay = 0, duration = 700) {
  if (!el || typeof el.animate !== 'function') return;
  const animation = el.animate(keyframes, {
    duration,
    delay,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'backwards'
  });
  animation.finished.then(() => {
    el.style.opacity = '';
    el.style.transform = '';
    el.style.clipPath = '';
  }).catch(() => {});
}

const heroMedia = document.querySelector('.hero-scene__media');
const heroCopy = document.querySelector('.hero-scene__copy');
const scenes = [...document.querySelectorAll('.scale-scene, .making-scene, .custom-scene')];

requestAnimationFrame(() => {
  if (reducedMotion()) return;
  play(heroMedia, [
    { opacity: 0, clipPath: 'inset(0 0 9% 0)' },
    { opacity: 1, clipPath: 'inset(0 0 0 0)' }
  ], 0, 950);
  play(heroCopy, [
    { opacity: 0, transform: 'translateY(18px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], 160, 650);
  play(menuTrigger, [{ opacity: 0 }, { opacity: 1 }], 220, 220);
});

if ('IntersectionObserver' in window && scenes.length) {
  if (!reducedMotion()) {
    scenes.forEach((scene) => {
      scene.style.opacity = '0';
      scene.style.transform = 'translateY(28px)';
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      play(entry.target, [
        { opacity: 0.001, transform: 'translateY(28px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], 0, 800);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  scenes.forEach((scene) => {
    if (reducedMotion()) {
      scene.style.opacity = '';
      scene.style.transform = '';
    } else {
      observer.observe(scene);
    }
  });
}

if (motionMedia.addEventListener) {
  motionMedia.addEventListener('change', (event) => {
    if (!event.matches) return;
    scenes.forEach((scene) => {
      scene.getAnimations?.().forEach((animation) => animation.cancel());
      scene.style.opacity = '';
      scene.style.transform = '';
    });
  });
}
