// file: main.js

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

const smoothScroll = (target) => {
  target.scrollIntoView({
    behavior: motionQuery.matches ? 'auto' : 'smooth',
    block: 'start'
  });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    smoothScroll(target);
    try {
      history.pushState(null, '', hash);
    } catch {
      location.hash = hash;
    }
  });
});

const animate = (element, frames, options) => {
  if (!element || typeof element.animate !== 'function') return;
  element.animate(frames, options);
};

if (!motionQuery.matches) {
  document.querySelectorAll('.display-line').forEach((line, index) => {
    animate(line, [
      { opacity: 0, transform: 'translateY(20px)', clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' }
    ], { duration: 680, delay: 80 + index * 65, easing: ease, fill: 'backwards' });
  });

  animate(document.querySelector('.hero-disc--halo'), [
    { opacity: 0, clipPath: 'circle(0% at 50% 50%)' },
    { opacity: 1, clipPath: 'circle(75% at 50% 50%)' }
  ], { duration: 700, delay: 260, easing: ease, fill: 'backwards' });

  animate(document.querySelector('.hero-portrait'), [
    { opacity: 0, transform: 'translateY(18px) scale(.97)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ], { duration: 720, delay: 410, easing: ease, fill: 'backwards' });
}

const revealSelectors = [
  '.edit-header',
  '.scale-item',
  '.production__intro',
  '.production-block',
  '.packaging-band',
  '.custom__header',
  '.custom-feature'
];
const revealTargets = [...new Set(revealSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]))];
const revealIndexes = new WeakMap();
revealTargets.forEach((element, index) => revealIndexes.set(element, index));

const revealElement = (element, delay = 0) => {
  animate(element, [
    { opacity: 0, transform: 'translateY(16px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 520, delay, easing: ease, fill: 'backwards' });
};

if (!motionQuery.matches) {
  const revealed = new WeakSet();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || revealed.has(entry.target)) return;
        revealed.add(entry.target);
        revealElement(entry.target, (revealIndexes.get(entry.target) % 6) * 45);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element, index) => revealElement(element, (index % 6) * 45));
  }
}

const dialog = document.querySelector('.subject-dialog');
const shell = dialog?.querySelector('.dialog-shell');
const closeForm = dialog?.querySelector('.dialog-close-form');
const title = dialog?.querySelector('#dialog-title');
const scaleItems = [...document.querySelectorAll('.scale-item')];

const fieldMeta = {
  size: ['Size', ['size', 'dimensions']],
  audience: ['Audience', ['audience', 'best for']],
  age: ['Age / use', ['age', 'suitable for']],
  price: ['Price', ['price']],
  'lead-time': ['Lead time', ['lead time', 'lead-time']],
  material: ['Material', ['material']],
  method: ['Moulding method', ['method', 'moulding method']],
  tooling: ['Tooling', ['tooling', 'mould']],
  cycle: ['Cycle', ['cycle', 'cycle time']],
  packaging: ['Packaging', ['packaging']],
  shipping: ['Shipping', ['shipping', 'delivery']],
  quality: ['Quality control', ['quality', 'quality control']]
};

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const subjectDescriptions = {
  Micro: 'A thumb-sized duck built for pockets, keys, small gifts and camera-ready details.',
  Classic: 'A familiar room-scale duck made for kids, bathrooms, desks and everyday display.',
  Designer: 'A collectible object with a more deliberate presence, made for limited runs and collaborations.',
  Mega: 'A generous statement piece for photographs, shop windows and memorable installations.',
  Architect: 'A monumental duck engineered as an installation for events, weddings and branded spaces.'
};

let generatedDetails = null;
const getDetails = () => {
  if (dialog.querySelector('dl')) return dialog.querySelector('dl');
  if (generatedDetails) return generatedDetails;
  generatedDetails = document.createElement('dl');
  generatedDetails.setAttribute('data-generated-details', '');
  generatedDetails.style.display = 'grid';
  generatedDetails.style.gridTemplateColumns = 'minmax(6.5rem, auto) 1fr';
  generatedDetails.style.gap = '.7rem 1.25rem';
  generatedDetails.style.margin = '1.5rem 0 0';
  (title?.parentElement || shell).append(generatedDetails);
  return generatedDetails;
};

const setField = (key, value) => {
  let node = dialog.querySelector(
    `[data-field="${key}"], [data-dialog-${key}"], #dialog-${key}, [id$="-${key}"]`
  );
  if (!node) {
    const aliases = fieldMeta[key][1].map(normalize);
    const label = [...dialog.querySelectorAll('dt, label, th, span, p')].find((element) => {
      if (element.children.length) return false;
      const text = normalize(element.textContent);
      return aliases.some((alias) => text === alias || text.startsWith(`${alias} `));
    });
    node = label?.nextElementSibling;
  }
  if (node) {
    node.textContent = value;
    return;
  }
  const generated = dialog.querySelector(`[data-generated-detail="${key}"]`);
  if (generated) {
    generated.textContent = value;
    return;
  }
  const details = getDetails();
  const term = document.createElement('dt');
  const description = document.createElement('dd');
  term.textContent = fieldMeta[key][0];
  description.textContent = value;
  description.setAttribute('data-generated-detail', key);
  details.append(term, description);
};

const populateSubject = (item, index) => {
  const data = item.dataset;
  const subject = data.subject || 'Object';
  dialog.dataset.subject = subject;
  title.textContent = subject;

  const indexNode = dialog.querySelector('#dialog-index, [data-dialog-index]');
  if (indexNode) indexNode.textContent = `${String(index + 1).padStart(2, '0')} / 05`;

  const description = dialog.querySelector(
    '#dialog-description, #dialog-summary, [data-dialog-description], [data-description]'
  );
  const descriptionText = subjectDescriptions[subject] ||
    `${subject} is made at ${data.size || 'a considered scale'} for ${data.audience || 'display and gifting'}.`;
  if (description) {
    description.textContent = descriptionText;
  } else {
    const generated = document.createElement('p');
    generated.setAttribute('data-generated-description', '');
    generated.textContent = descriptionText;
    generated.style.margin = '.75rem 0 1.25rem';
    generated.style.maxWidth = '44rem';
    generated.style.lineHeight = '1.65';
    title?.insertAdjacentElement('afterend', generated);
  }

  let image = dialog.querySelector('img');
  if (!image) {
    image = document.createElement('img');
    image.width = 900;
    image.height = 900;
    image.style.width = '100%';
    image.style.maxHeight = '70vh';
    image.style.objectFit = 'contain';
    const figure = dialog.querySelector('figure');
    (figure || title?.parentElement || shell).prepend(image);
  }
  if (data.image) image.src = data.image;
  image.alt = `${subject} duck`;
  image.removeAttribute('srcset');

  Object.keys(fieldMeta).forEach((key) => {
    const value = data[key] || (key === 'price' ? 'Price on request' : '—');
    setField(key, value);
  });
};

const stateStyle = document.createElement('style');
stateStyle.textContent = '.scale-item[aria-pressed="true"] .scale-item__line{text-decoration:underline;text-underline-offset:.3em}';
document.head.append(stateStyle);

let previousOverflow = '';
let nativeDialog = false;

const setActiveItem = (activeItem) => {
  scaleItems.forEach((item) => {
    const active = item === activeItem;
    item.setAttribute('aria-pressed', String(active));
    item.setAttribute('aria-expanded', String(active));
  });
};

const closeDialog = () => {
  if (nativeDialog && typeof dialog.close === 'function') {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
    document.body.style.overflow = previousOverflow;
  }
};

const openSubject = (item, index) => {
  populateSubject(item, index);
  setActiveItem(item);
  if (!dialog.open) previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  if (typeof dialog.showModal === 'function') {
    nativeDialog = true;
    if (!dialog.open) dialog.showModal();
  } else {
    nativeDialog = false;
    dialog.setAttribute('open', '');
  }

  requestAnimationFrame(() => {
    if (!motionQuery.matches) {
      animate(shell, [
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 380, easing: ease });
    }
    title?.setAttribute('tabindex', '-1');
    title?.focus({ preventScroll: true });
  });
};

scaleItems.forEach((item, index) => {
  item.setAttribute('aria-pressed', 'false');
  item.setAttribute('aria-expanded', 'false');
  item.addEventListener('click', () => openSubject(item, index));
});

if (dialog) {
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    scaleItems.forEach((item) => item.setAttribute('aria-expanded', 'false'));
  });

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) closeDialog();
  });

  closeForm?.addEventListener('submit', (event) => {
    if (!nativeDialog) {
      event.preventDefault();
      closeDialog();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !nativeDialog && dialog.open) {
      event.preventDefault();
      closeDialog();
    }
  });
}
