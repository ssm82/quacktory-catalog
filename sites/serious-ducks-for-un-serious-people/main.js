// file: main.js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuButton = document.querySelector('.menu-trigger');
const menu = document.querySelector('.site-menu');
let menuOpen = false;
let menuHideTimer;

function setMenu(open, restoreFocus = true) {
  if (!menu || !menuButton) return;
  menuOpen = open;
  menuButton.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
  clearTimeout(menuHideTimer);

  if (open) {
    menu.style.visibility = 'visible';
    menu.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
      menu.style.opacity = '1';
      menu.style.transform = 'translateY(0)';
    });
    requestAnimationFrame(() => {
      menu.querySelector('.site-menu-link')?.focus({ preventScroll: true });
    });
  } else {
    menu.style.opacity = '0';
    menu.style.transform = 'translateY(-10px)';
    menu.style.pointerEvents = 'none';
    menuHideTimer = setTimeout(() => {
      if (!menuOpen) menu.style.visibility = 'hidden';
    }, 260);
    if (restoreFocus) menuButton.focus({ preventScroll: true });
  }
}

menuButton?.addEventListener('click', () => setMenu(!menuOpen, false));
menu?.addEventListener('click', (event) => {
  if (event.target.closest('.site-menu-link')) setMenu(false, false);
});

document.addEventListener('pointerdown', (event) => {
  if (!menuOpen || !menu || !menuButton) return;
  if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
    setMenu(false, false);
  }
});

function scrollToElement(element) {
  const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - 16);
  if (reducedMotion) {
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, top);
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previous;
    });
    return;
  }
  try {
    window.scrollTo({ top, behavior: 'smooth' });
  } catch {
    window.scrollTo(0, top);
  }
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const hash = anchor.getAttribute('href');
  if (!hash || hash === '#') return;

  let target;
  try {
    target = document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    target = null;
  }
  if (!target) return;

  event.preventDefault();
  scrollToElement(target);
  try {
    if (location.hash !== hash) history.pushState(null, '', hash);
  } catch {
    location.hash = hash;
  }
});

function animateElement(element, frames, delay = 0, duration = 700) {
  if (!element?.animate || reducedMotion) return;
  element.animate(frames, {
    duration,
    delay,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'both'
  });
}

requestAnimationFrame(() => {
  animateElement(
    document.querySelector('.hero-media'),
    [
      { opacity: 0.62, transform: 'scale(1.03)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    0,
    1500
  );
  animateElement(
    document.querySelector('.hero-kicker'),
    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
    180
  );
  document.querySelectorAll('.hero-line').forEach((line, index) => {
    animateElement(
      line,
      [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
      260 + index * 70,
      760
    );
  });
  const rule = document.querySelector('.hero-rule');
  if (rule) rule.style.transformOrigin = 'center';
  animateElement(
    rule,
    [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }],
    510
  );
  animateElement(
    document.querySelector('.hero-manifesto'),
    [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }],
    610
  );
  animateElement(
    document.querySelector('.hero-routes'),
    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
    710
  );
  animateElement(
    document.querySelector('.primary-action'),
    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
    790
  );
});

const revealItems = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const siblings = [...(element.parentElement?.children || [])].filter((child) =>
        child.classList.contains('reveal')
      );
      const index = Math.max(0, siblings.indexOf(element));
      element.style.transitionDelay = `${Math.min(index * 55, 330)}ms`;
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.visibility = 'visible';
      observer.unobserve(element);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => {
    item.style.opacity = '1';
    item.style.transform = 'none';
    item.style.visibility = 'visible';
  });
}

let dialog;
let closeButton;
let lastProductTrigger;
let previousBodyOverflow = '';

function ensureProductDialog() {
  if (dialog) return;

  dialog = document.createElement('dialog');
  dialog.id = 'quack-product-dialog';
  dialog.setAttribute('aria-labelledby', 'quack-product-title');
  dialog.setAttribute('aria-describedby', 'quack-product-summary');
  dialog.innerHTML = `
    <button id="quack-product-close" type="button" aria-label="Close product details">Close <span aria-hidden="true">×</span></button>
    <div id="quack-product-layout">
      <figure id="quack-product-figure">
        <img id="quack-product-image" src="" alt="">
      </figure>
      <div id="quack-product-copy">
        <p id="quack-product-index"></p>
        <h2 id="quack-product-title"></h2>
        <p id="quack-product-size"></p>
        <p id="quack-product-summary"></p>
        <dl id="quack-product-details"></dl>
      </div>
    </div>`;

  const style = document.createElement('style');
  style.textContent = `
    #quack-product-dialog{width:min(980px,calc(100vw - 32px));max-height:calc(100dvh - 32px);margin:auto;padding:0;border:1px solid rgba(247,247,244,.3);border-radius:0;background:#1d2321;color:#f7f7f4;box-shadow:0 28px 90px rgba(0,0,0,.52);overflow:auto;color-scheme:dark}
    #quack-product-dialog::backdrop{background:rgba(5,8,7,.84);backdrop-filter:blur(3px)}
    #quack-product-layout{display:grid;grid-template-columns:minmax(280px,.9fr) minmax(320px,1.1fr);min-height:580px}
    #quack-product-figure{margin:0;min-height:100%;background:#101514;overflow:hidden}
    #quack-product-image{width:100%;height:100%;min-height:580px;object-fit:cover;filter:saturate(.82) contrast(1.04)}
    #quack-product-copy{padding:72px clamp(28px,5vw,64px) 48px;border-top:3px solid var(--product-accent,#b4a800)}
    #quack-product-index{margin:0 0 18px;color:var(--product-accent,#b4a800);font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
    #quack-product-title{margin:0;font-family:var(--display,"Arial Narrow",sans-serif);font-size:clamp(48px,7vw,88px);line-height:.9;letter-spacing:-.015em;text-transform:uppercase}
    #quack-product-size{margin:14px 0 0;color:rgba(247,247,244,.74);font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
    #quack-product-summary{margin:34px 0 0;padding-top:24px;border-top:1px solid rgba(247,247,244,.2);font-size:18px;line-height:1.55}
    #quack-product-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 28px;margin:34px 0 0}
    #quack-product-details dt{color:rgba(247,247,244,.5);font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
    #quack-product-details dd{margin:5px 0 0;font-size:13px;line-height:1.45}
    #quack-product-close{position:absolute;top:14px;right:14px;z-index:2;min-width:86px;height:42px;padding:0 14px;border:1px solid rgba(247,247,244,.48);border-radius:0;background:#101514;color:#f7f7f4;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}
    #quack-product-close:hover{background:#f7f7f4;color:#101514}
    #quack-product-close span{margin-left:8px;font-size:16px}
    @media(max-width:700px){#quack-product-layout{grid-template-columns:1fr}#quack-product-figure{min-height:34vh}#quack-product-image{min-height:34vh;max-height:38vh}#quack-product-copy{padding:44px 24px 32px}#quack-product-details{grid-template-columns:1fr}}
  `;
  document.head.append(style);
  document.body.append(dialog);

  closeButton = dialog.querySelector('#quack-product-close');
  closeButton.addEventListener('click', closeProductDialog);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeProductDialog();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousBodyOverflow;
    lastProductTrigger?.focus({ preventScroll: true });
  });
}

function closeProductDialog() {
  if (!dialog?.open) return;
  if (typeof dialog.close === 'function') dialog.close();
  else {
    dialog.removeAttribute('open');
    document.body.style.overflow = previousBodyOverflow;
    lastProductTrigger?.focus({ preventScroll: true });
  }
}

function openProduct(trigger) {
  const card = trigger.closest('.scale-card');
  if (!card) return;
  ensureProductDialog();

  lastProductTrigger = trigger;
  const data = card.dataset;
  const number = card.querySelector('.product-number')?.textContent.trim() || '01';
  const accents = ['#b4a800', '#a28f48', '#567e88', '#8a815b', '#6f7651'];
  const accent = accents[(Number.parseInt(number, 10) - 1) % accents.length] || accents[0];
  const fields = [
    ['Range', data.productRange],
    ['Audience', data.productAudience],
    ['Age / use', data.productAge],
    ['Material', data.productMaterial],
    ['Production', data.productMethod],
    ['Tooling', data.productTooling],
    ['Cycle', data.productCycle],
    ['Lead time', data.productLeadTime],
    ['Packaging', data.productPackaging],
    ['Shipping', data.productShipping]
  ];

  dialog.style.setProperty('--product-accent', accent);
  dialog.querySelector('#quack-product-index').textContent = `Quacktory / Object ${number}`;
  dialog.querySelector('#quack-product-title').textContent = data.productName || 'Object';
  dialog.querySelector('#quack-product-size').textContent = data.productSize || '';
  dialog.querySelector('#quack-product-summary').textContent =
    data.productSummary || data.productAudience || 'A serious duck for an un-serious world.';

  const details = dialog.querySelector('#quack-product-details');
  details.replaceChildren();
  fields.forEach(([label, value]) => {
    if (!value) return;
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    details.append(term, description);
  });

  const figure = dialog.querySelector('#quack-product-figure');
  const image = dialog.querySelector('#quack-product-image');
  figure.hidden = !data.productImage;
  image.hidden = !data.productImage;
  image.onerror = () => {
    figure.hidden = true;
  };
  if (data.productImage) {
    image.src = data.productImage;
    image.alt = `${data.productName || 'Object'} — ${data.productSize || ''}`;
  } else {
    image.removeAttribute('src');
  }

  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  if (!dialog.open) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  requestAnimationFrame(() => closeButton?.focus({ preventScroll: true }));
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const trigger = event.target.closest('.product-open');
  if (!trigger) return;
  event.preventDefault();
  openProduct(trigger);
});

document.addEventListener('click', (event) => {
  if (!dialog?.open) return;
  const bounds = dialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) closeProductDialog();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (dialog?.open) {
    event.preventDefault();
    closeProductDialog();
  } else if (menuOpen) {
    event.preventDefault();
    setMenu(false);
  }
});
