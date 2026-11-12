// file: main.js
const products = {
  micro: { category: 'Size ladder / Quacktory', title: 'Micro', size: '4 cm', edition: 'Thumb-sized', price: '~$10', qualifier: 'up to', unit: 'per unit', shipping: 'Shipping included', lead: '3 weeks', year: '2025 catalogue', audience: 'Keychains, merch and gifts up to ~$10', description: 'A pocket-scale duck with the same sculpted body, black pupil and white sclera as every Quacktory edition.', accent: '#f10a12', image: './assets/product-micro.jpg' },
  classic: { category: 'Size ladder / Quacktory', title: 'Classic', size: '10–25 cm', edition: 'Cat-sized', price: 'Mid', qualifier: '', unit: 'per unit', shipping: 'Shipping included', lead: '3 weeks', year: '2025 catalogue', audience: 'Kids, bathrooms and office desks', description: 'The everyday desk duck: a compact, single-piece rubber sculpture made for shelves, desks and everyday handling.', accent: '#f10a12', image: './assets/product-classic.jpg' },
  designer: { category: 'Size ladder / Quacktory', title: 'Designer', size: '15–30 cm', edition: 'Cat-sized / Limited run', price: 'Mid+', qualifier: '', unit: 'per unit', shipping: 'Shipping included', lead: '6 weeks', year: '2025 catalogue', audience: 'Illustrator collaborations and limited runs', description: 'A limited studio edition with the signature mould relief, produced for collaborators and small collections.', accent: '#f10a12', image: './assets/product-designer.jpg' },
  mega: { category: 'Size ladder / Quacktory', title: 'Mega', size: '50–120 cm', edition: 'Bear-sized', price: 'Premium', qualifier: '', unit: 'per unit', shipping: 'Shipping included', lead: '6 weeks', year: '2025 catalogue', audience: 'Photo objects, shop windows and statement gifts', description: 'A large-format duck designed as a visible object for photography, retail displays and generous interiors.', accent: '#f10a12', image: './assets/product-mega.jpg' },
  architect: { category: 'Size ladder / Quacktory', title: 'Architect', size: '3 m', edition: 'Bear-sized / Made to spec', price: 'Price on request', qualifier: '', unit: '', shipping: 'Specification sheet', lead: '12 weeks', year: '2025 catalogue', audience: 'Installations, events, weddings and branded spaces', description: 'A full-scale architectural duck made for permanent installations, event environments and commissioned spaces.', accent: '#f10a12', image: './assets/product-architect.jpg' },
  settings: { category: 'System / Settings', title: 'Interface settings', size: 'Motion profile', edition: 'System-aware', price: 'Editorial', qualifier: '', unit: '', shipping: '', lead: 'Reduced-motion ready', year: 'Live', audience: 'Keyboard, pointer and touch controls', description: 'Motion follows your system preference. The experience remains restrained, legible and fully operable without animation.', accent: '#f10a12', image: '' }
};

const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
const body = document.body;
let dialog = document.getElementById('product-dialog');

if (!dialog) {
  dialog = document.createElement('dialog');
  dialog.id = 'product-dialog';
  document.body.append(dialog);
} else if (dialog.tagName !== 'DIALOG') {
  const nativeDialog = document.createElement('dialog');
  nativeDialog.id = 'product-dialog';
  nativeDialog.className = dialog.className;
  nativeDialog.innerHTML = dialog.innerHTML;
  for (const attribute of dialog.attributes) {
    if (attribute.name !== 'id' && attribute.name !== 'class') nativeDialog.setAttribute(attribute.name, attribute.value);
  }
  dialog.replaceWith(nativeDialog);
  dialog = nativeDialog;
}

dialog.setAttribute('aria-modal', 'true');
if (!dialog.classList.length) {
  dialog.style.width = 'min(760px, calc(100vw - 2rem))';
  dialog.style.maxWidth = 'none';
  dialog.style.padding = '0';
  dialog.style.border = '1px solid rgba(202,190,218,.24)';
  dialog.style.borderRadius = '32px';
  dialog.style.background = '#111126';
  dialog.style.color = '#f5f3f3';
  dialog.style.overflow = 'hidden';
}

if (!document.getElementById('product-dialog-style')) {
  const modalStyle = document.createElement('style');
  modalStyle.id = 'product-dialog-style';
  modalStyle.textContent = '#product-dialog::backdrop{background:rgba(5,5,16,.84);backdrop-filter:blur(10px)}';
  document.head.append(modalStyle);
}

const primaryTitle = dialog.querySelector('.product-name') || dialog.querySelector('[data-dialog-field="name"]') || dialog.querySelector('h2') || dialog.querySelector('h3');
const hasSize = dialog.querySelector('.product-size, [data-dialog-field="size"]');
const hasPrice = dialog.querySelector('.price-figure, [data-dialog-field="price"]');
let summary = dialog.querySelector('[data-dialog-summary]');

if ((!primaryTitle || !hasSize || !hasPrice) && !summary) {
  summary = document.createElement('section');
  summary.className = 'section-shell';
  summary.setAttribute('data-dialog-summary', '');
  summary.style.cssText = 'width:min(100%,760px);padding:clamp(1.5rem,4vw,3rem);';
  summary.innerHTML = `
    <header class="section-heading">
      <p class="section-code" data-dialog-field="category"></p>
      ${primaryTitle ? '' : '<h2 class="section-title" id="product-dialog-title" data-dialog-field="title"></h2>'}
      <p class="section-deck" data-dialog-field="size"></p>
    </header>
    <div class="process-grid">
      <article class="process-panel process-panel--body">
        <p class="process-panel-label" data-dialog-field="edition-label">Edition</p>
        <h3 class="process-title" data-dialog-field="edition"></h3>
        <p class="process-copy" data-dialog-field="description"></p>
      </article>
      <article class="process-panel process-panel--eyes">
        <p class="process-panel-label" data-dialog-field="price-label">Specification</p>
        <h3 class="process-title" data-dialog-field="price"></h3>
        <ul class="eye-list">
          <li data-dialog-field="audience"></li>
          <li data-dialog-field="lead"></li>
          <li data-dialog-field="year"></li>
        </ul>
      </article>
    </div>`;
  dialog.append(summary);
}

const labelElement = summary?.querySelector('[data-dialog-field="title"]') || primaryTitle;
if (labelElement) {
  if (!labelElement.id) labelElement.id = 'product-dialog-title';
  dialog.setAttribute('aria-labelledby', labelElement.id);
}

const fieldSelectors = {
  title: '[data-dialog-field="title"], [data-dialog-field="name"], .product-name, h2',
  size: '[data-dialog-field="size"], .product-size',
  edition: '[data-dialog-field="edition"], .product-comparison',
  price: '[data-dialog-field="price"], .price-figure',
  audience: '[data-dialog-field="audience"], .product-audience',
  lead: '[data-dialog-field="lead"], .product-lead',
  year: '[data-dialog-field="year"]',
  description: '[data-dialog-field="description"], .process-copy',
  category: '[data-dialog-field="category"]',
  'edition-label': '[data-dialog-field="edition-label"]',
  'price-label': '[data-dialog-field="price-label"]'
};

function setField(name, value) {
  const target = dialog.querySelector(fieldSelectors[name]) || (name === 'title' ? primaryTitle : null);
  if (target) target.textContent = value;
}

const closeButton = Array.from(dialog.querySelectorAll('button')).find((button) => {
  const label = `${button.getAttribute('aria-label') || ''} ${button.textContent || ''}`;
  return button.hasAttribute('data-dialog-close') || /close|dismiss|×|✕/i.test(label);
}) || (() => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', 'Close details');
  button.textContent = '×';
  button.style.cssText = 'position:absolute;z-index:10;top:1rem;right:1rem;width:44px;height:44px;border:1px solid rgba(245,243,243,.32);border-radius:50%;background:#111126;color:#f5f3f3;font-size:1.25rem;cursor:pointer;';
  if (getComputedStyle(dialog).position === 'static') dialog.style.position = 'relative';
  dialog.append(button);
  return button;
})();

let previousOverflow = '';
let lastSource = null;

function openDetails(key, source = null) {
  const base = products[key];
  if (!base) return;

  const trigger = source?.matches?.('.product-trigger[data-product]') ? source : document.querySelector(`.product-trigger[data-product="${key}"]`);
  const read = (selector) => trigger?.querySelector(selector)?.textContent.trim() || '';
  const data = {
    ...base,
    title: read('.product-name') || base.title,
    size: read('.product-size') || base.size,
    edition: read('.product-comparison') || base.edition,
    price: read('.price-figure') || base.price,
    audience: read('.product-audience') || base.audience,
    lead: read('.product-lead') || base.lead,
    image: trigger?.querySelector('.product-image')?.getAttribute('src') || base.image
  };

  setField('category', data.category);
  setField('title', data.title);
  setField('size', data.size);
  setField('edition', data.edition);
  setField('price', data.price);
  setField('audience', data.audience);
  setField('lead', data.lead);
  setField('year', data.year);
  setField('description', data.description);
  setField('edition-label', key === 'settings' ? 'Profile' : 'Edition');
  setField('price-label', key === 'settings' ? 'Behaviour' : 'Specification');
  if (primaryTitle && primaryTitle !== dialog.querySelector(fieldSelectors.title)) primaryTitle.textContent = data.title;

  let image = dialog.querySelector('[data-dialog-field="image"], .product-image, img');
  if (!image && summary && data.image) {
    image = document.createElement('img');
    image.className = 'product-image';
    image.setAttribute('data-dialog-field', 'image');
    image.style.cssText = 'display:block;width:100%;max-height:320px;object-fit:contain;margin-bottom:1.5rem;border-radius:24px;background:#090a1b;';
    summary.prepend(image);
  }
  if (image && data.image) {
    image.src = data.image;
    image.alt = `${data.title} Quacktory duck`;
  }

  dialog.style.setProperty('--accent', data.accent);
  dialog.setAttribute('aria-label', `${data.title} details`);
  lastSource = source || trigger;
  document.querySelectorAll('.product-trigger').forEach((item) => item.setAttribute('aria-expanded', String(item === trigger)));

  if (!dialog.open) {
    previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    try {
      dialog.showModal();
    } catch {
      dialog.setAttribute('open', '');
    }
  }
  requestAnimationFrame(() => closeButton?.focus());
}

function finishClose() {
  body.style.overflow = previousOverflow;
  document.querySelectorAll('.product-trigger').forEach((item) => item.setAttribute('aria-expanded', 'false'));
  if (lastSource?.isConnected) lastSource.focus({ preventScroll: true });
}

function closeDialog() {
  if (dialog.open && typeof dialog.close === 'function') dialog.close();
  else {
    dialog.removeAttribute('open');
    finishClose();
  }
}

dialog.addEventListener('close', finishClose);
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener('click', (event) => {
  const button = event.target.closest?.('button');
  const label = button ? `${button.getAttribute('aria-label') || ''} ${button.textContent || ''}` : '';
  if (button && (button.hasAttribute('data-dialog-close') || /close|dismiss|×|✕/i.test(label))) {
    event.preventDefault();
    closeDialog();
    return;
  }
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog();
  }
});

document.querySelectorAll('.product-trigger[data-product]').forEach((trigger) => {
  trigger.setAttribute('aria-expanded', 'false');
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openDetails(trigger.dataset.product, trigger);
  });
});

function makeActivatable(element, key, label) {
  if (!element || !products[key]) return;
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '0');
  element.setAttribute('aria-haspopup', 'dialog');
  element.setAttribute('aria-controls', 'product-dialog');
  element.setAttribute('aria-label', label);
  element.style.cursor = 'pointer';
  element.addEventListener('click', () => openDetails(key, element));
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails(key, element);
    }
  });
}

makeActivatable(document.querySelector('.hero-duck'), 'classic', 'Open Classic duck details');
[
  ['.stage-label--top', 'designer'],
  ['.stage-label--bottom', 'classic'],
  ['.stage-side-label--left', 'micro'],
  ['.stage-side-label--right', 'architect']
].forEach(([selector, key]) => makeActivatable(document.querySelector(selector), key, `Open ${products[key].title} details`));

const rail = document.querySelector('.marker-rail');
const railNodes = Array.from(document.querySelectorAll('.rail-node'));
if (rail) rail.removeAttribute('aria-hidden');
[['--top', 'micro'], ['--mid', 'designer'], ['--bottom', 'architect']].forEach(([position, key]) => {
  const node = document.querySelector(`.rail-node${position}`);
  if (!node) return;
  makeActivatable(node, key, `Open ${products[key].title} details`);
  node.addEventListener('click', () => {
    railNodes.forEach((item) => {
      item.setAttribute('aria-current', 'false');
      item.style.borderColor = '';
      item.style.boxShadow = '';
    });
    node.setAttribute('aria-current', 'true');
    node.style.borderColor = 'var(--accent)';
    node.style.boxShadow = '0 0 12px rgba(241,10,18,.45)';
  });
});

document.querySelectorAll('[data-tooltip]').forEach((element) => {
  const key = element.dataset.product || element.dataset.tooltip;
  makeActivatable(element, key, `Open ${products[key]?.title || 'item'} details`);
});

const orbital = document.querySelector('.orbital-control');
const orbitalMark = orbital?.querySelector('.orbital-mark');
if (orbital && orbitalMark) {
  orbital.addEventListener('click', () => {
    orbital.setAttribute('aria-busy', 'true');
    orbitalMark.style.transition = 'transform 480ms cubic-bezier(.22,1,.36,1)';
    orbitalMark.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      orbitalMark.style.transform = 'rotate(0deg)';
      orbital.removeAttribute('aria-busy');
    }, 480);
  });
}

const settingsControl = Array.from(document.querySelectorAll('button, a')).find((element) => /settings|preferences|configure|⚙/i.test(`${element.getAttribute('aria-label') || ''} ${element.textContent || ''}`));
if (settingsControl) settingsControl.addEventListener('click', (event) => { event.preventDefault(); openDetails('settings', settingsControl); });

const shareControl = Array.from(document.querySelectorAll('button, a')).find((element) => /share/i.test(element.getAttribute('aria-label') || '') || /^\s*share\b/i.test(element.textContent || ''));
if (shareControl) {
  let shareCount = 0;
  const cap = 12;
  const counter = shareControl.querySelector('[data-share-count]') || document.createElement('span');
  counter.className = 'aside-label';
  counter.setAttribute('data-share-count', '');
  counter.setAttribute('aria-live', 'polite');
  counter.style.cssText = 'display:inline-block;margin-left:.65rem;white-space:nowrap;';
  if (!counter.parentElement) shareControl.append(counter);
  const updateCounter = () => { counter.textContent = `Shares ${shareCount} / ${cap}`; };
  updateCounter();
  shareControl.addEventListener('click', () => {
    shareCount = Math.min(cap, shareCount + 1);
    updateCounter();
  });
}

document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href^="#"]');
  if (!link || event.defaultPrevented || reducedMotion) return;
  const id = decodeURIComponent(link.getAttribute('href').slice(1));
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  try { history.pushState(null, '', `#${id}`); } catch { location.hash = id; }
  setTimeout(() => {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }, 600);
});

if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  Array.from(document.querySelectorAll('.section-heading, .scale-item, .process-panel')).filter((element) => !element.closest('#product-dialog')).forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(18px)';
    element.style.transition = 'opacity 700ms var(--ease-out), transform 700ms var(--ease-out)';
    element.style.transitionDelay = `${(index % 5) * 55}ms`;
    observer.observe(element);
  });
}
