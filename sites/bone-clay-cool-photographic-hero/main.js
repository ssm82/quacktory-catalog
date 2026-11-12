// Quacktory — FLUX-S028
// Editorial cover site. Vanilla JS only.
// - Modal open/close on size-ladder node click
// - Scroll-reveal sections via IntersectionObserver
// - ESC and overlay click close the modal
// - Smooth-scroll fallback for browsers without CSS smooth scroll

const DOSSIERS = {
  micro: {
    code: 'FLX-M01 · MICRO',
    title: 'Keychain, 4 cm',
    img: './assets/product-micro.jpg',
    height: '4 cm',
    finish: 'Matte warm ivory',
    edition: 'Open',
    notes: 'Pocket specimen',
    copy: 'A reference object the size of a thumb. Studied at eye level under plinth light. Often clipped to a bag strap, sometimes photographed at 1:1. Its job is to remind the eye that the silhouette is one thing at every scale.',
  },
  classic: {
    code: 'FLX-M02 · CLASSIC',
    title: 'Workhorse, 15 cm',
    img: './assets/product-classic.jpg',
    height: '15 cm',
    finish: 'Warm amber matte',
    edition: 'Open',
    notes: 'Most-photographed',
    copy: 'The specimen most people mean when they say "the duck". Fifteen centimetres of warm amber matte, photographed against a pure white sweep. Read this plate as the typographic baseline against which the others are quoted.',
  },
  designer: {
    code: 'FLX-D03 · DESIGNER',
    title: 'Edition, 20 cm',
    img: './assets/product-designer.jpg',
    height: '20 cm',
    finish: 'Muted terracotta, stone-matte',
    edition: 'Quarterly',
    notes: 'Directional object',
    copy: 'The editorial object of the plate. Twenty centimetres, terracotta with a hand-finished matte. Each quarter the surface treatment shifts by a single hue. The silhouette is held constant; only the colour moves.',
  },
  mega: {
    code: 'FLX-M04 · MEGA',
    title: 'Statement, 50 cm',
    img: './assets/product-mega.jpg',
    height: '50 cm',
    finish: 'Pale stone grey',
    edition: 'Open',
    notes: 'Reads as a small object',
    copy: 'At half a metre the duck stops reading as a bath toy and starts reading as a small piece of furniture. Pale stone grey. Photographed at full-room distance. The eye finally stops trying to make it cute.',
  },
  architect: {
    code: 'FLX-A05 · ARCHITECT',
    title: 'Monument, 1.5 m',
    img: './assets/product-architect.jpg',
    height: '1.5 m',
    finish: 'Architectural concrete grey',
    edition: 'On commission',
    notes: 'B2B / Custom',
    copy: 'A monument. One and a half metres of architectural concrete-grey matte, cast as a single piece. Placed on plinths in lobbies, galleries, and a handful of very specific kitchens. Not sold in a shop; commissioned by the room that will hold it.',
  },
};

// ---------- Modal --------------------------------------------------------

const modal = document.getElementById('dossier');
const mImg = document.getElementById('dossier-img');
const mTitle = document.getElementById('dossier-title');
const mCode = document.getElementById('dossier-code');
const mHeight = document.getElementById('dossier-height');
const mFinish = document.getElementById('dossier-finish');
const mEdition = document.getElementById('dossier-edition');
const mNotes = document.getElementById('dossier-notes');
const mCopy = document.getElementById('dossier-copy');
let lastFocus = null;

function openDossier(key) {
  const d = DOSSIERS[key];
  if (!d) return;
  mImg.src = d.img;
  mImg.alt = d.title;
  mTitle.textContent = d.title;
  mCode.textContent = d.code;
  mHeight.textContent = d.height;
  mFinish.textContent = d.finish;
  mEdition.textContent = d.edition;
  mNotes.textContent = d.notes;
  mCopy.textContent = d.copy;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lastFocus = document.activeElement;
  modal.querySelector('.modal__close').focus({ preventScroll: true });
}
function closeDossier() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

// wire nodes
document.querySelectorAll('.rail__node').forEach((node) => {
  const key = node.dataset.size;
  node.addEventListener('click', () => openDossier(key));
  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDossier(key);
    }
  });
});

// close handlers
modal.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeDossier);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
    closeDossier();
  }
});

// ---------- Scroll reveal ----------------------------------------------

const targets = document.querySelectorAll('.section, .hero');
targets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  targets.forEach((el) => io.observe(el));
} else {
  targets.forEach((el) => el.classList.add('is-in'));
}

// ---------- Smooth-scroll fallback -------------------------------------

if (typeof window !== 'undefined' && !('scrollBehavior' in document.documentElement.style)) {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
