// Quackery Kitchen — minimal interactivity for the demo.
// - Cart badge counter
// - Heart toggle
// - Tab switch between SKUs (click side phone or ladder nodes)
// - Smooth scroll for in-page links

const SKUS = {
  micro: {
    img: './assets/product-micro.jpg',
    alt: "Micro 4cm rubber duck with chef's collar and basil leaf",
    tag: 'Micro · 4cm',
    title: 'Micro · 4cm',
    meta: 'Keychain · dishwasher-safe',
    desc: 'A pocket-sized tasting portion. Tomato-red glaze, basil at the beak, fits on a single spoon. Hang it from your bag and pretend it\u2019s a kitchen tool.',
    price: '\u20AC 12.00',
  },
  classic: {
    img: './assets/product-classic.jpg',
    alt: "Classic 15cm rubber duck in yolk-orange matte with chef's collar and cucumber-slice hat",
    tag: 'Classic · 15cm',
    title: 'Classic · 15cm',
    meta: 'Glazed ceramic · oven-safe to 220°C',
    desc: 'Our house staple: an egg-yolk-orange duck finished in matte glaze, served with a hand-painted chef\u2019s collar and a cucumber-slice cap. The kitchen\u2019s most-photographed guest.',
    price: '\u20AC 48.00',
  },
  designer: {
    img: './assets/product-designer.jpg',
    alt: "Designer 20cm rubber duck in basil-green matte with chef's apron prop",
    tag: 'Designer · 20cm',
    meta: 'Limited edition · numbered 1–240',
    desc: 'A collaboration with atelier Marrow & Sage: basil-green glaze, rosemary at the beak, a tiny apron stitched by hand. One per household, please.',
    price: '\u20AC 86.00',
  },
  mega: {
    img: './assets/product-mega.jpg',
    alt: 'Mega 50cm rubber duck in terracotta-orange matte with herb wreath',
    tag: 'Mega · 50cm',
    meta: 'Floor piece · arrives in a crate',
    desc: 'A monumental duck in terracotta-orange glaze with a wide chef\u2019s collar and a fresh herb wreath. Sits at the foot of the dining table, judges your cooking.',
    price: '\u20AC 240.00',
  },
  architect: {
    img: './assets/product-architect.jpg',
    alt: 'Architect 1.5m rubber duck in deep bowl-navy matte with chef hat and rosemary garland',
    tag: 'Architect · 1.5m',
    meta: 'Bespoke · 8-week lead time',
    desc: 'A 1.5-metre statement duck in deep bowl-navy glaze, finished with a giant chef\u2019s hat and rosemary garland. Plated like a centerpiece. Quacktory\u2019s flagship commission.',
    price: '\u20AC 2,400',
  },
};

const state = {
  cart: 0,
  hearted: false,
  current: 'classic',
};

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

function bumpCart() {
  state.cart += 1;
  const badge = $('#cart-badge');
  badge.textContent = String(state.cart);
  badge.classList.add('is-on');
}

function toggleHeart() {
  state.hearted = !state.hearted;
  const btn = $('#heart-btn');
  btn.classList.toggle('is-on', state.hearted);
  btn.setAttribute('aria-pressed', String(state.hearted));
}

function switchSku(key) {
  const sku = SKUS[key];
  if (!sku || key === state.current) return;
  state.current = key;

  const imgWrap = $('.phone-image');
  imgWrap.classList.add('is-fading');

  setTimeout(() => {
    const img = $('#hero-img');
    img.src = sku.img;
    img.alt = sku.alt;
    $('#image-tag').textContent = sku.tag;
    $('#card-title').textContent = sku.title;
    $('#card-meta').textContent = sku.meta;
    $('#card-desc').textContent = sku.desc;
    $('#card-price').textContent = sku.price;

    // update ladder current
    $$('.ladder-node').forEach((n) => {
      n.classList.toggle('is-current', n.dataset.key === key);
    });

    imgWrap.classList.remove('is-fading');
  }, 180);
}

function wireCta() {
  const cta = $('#cta-btn');
  cta.addEventListener('click', () => {
    bumpCart();
    cta.animate(
      [{ transform: 'scale(1.015)' }, { transform: 'scale(0.97)' }, { transform: 'scale(1)' }],
      { duration: 280, easing: 'cubic-bezier(.2,.7,.3,1)' },
    );
  });
}

function wireHeart() {
  $('#heart-btn').addEventListener('click', toggleHeart);
}

function wireCart() {
  $('#cart-btn').addEventListener('click', bumpCart);
}

function wireSkuSwitch() {
  const side = $('#phone-micro');
  side.addEventListener('click', () => switchSku('micro'));
  side.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      switchSku('micro');
    }
  });

  $$('.ladder-node').forEach((node) => {
    node.addEventListener('click', () => switchSku(node.dataset.key));
  });
}

function wireSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      if ('scrollBehavior' in document.documentElement.style) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        target.scrollIntoView();
      }
    });
  });
}

function init() {
  wireCta();
  wireHeart();
  wireCart();
  wireSkuSwitch();
  wireSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
