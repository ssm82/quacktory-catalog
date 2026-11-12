// file: main.js
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = () => motionQuery.matches;
const body = document.body;

document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href^="#"]');
  if (!link) return;

  let id = link.getAttribute('href').slice(1);
  if (!id) return;

  try { id = decodeURIComponent(id); } catch {}
  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({
    behavior: reducedMotion() ? 'auto' : 'smooth',
    block: 'start'
  });

  if (history.pushState) history.pushState(null, '', `#${id}`);
});

const entranceItems = [
  ['.hero-marker', 100],
  ['.hero-copy', 170],
  ['.hero-actions', 240],
  ['.edge-media--left', 300],
  ['.edge-media--right', 340]
];

if (!reducedMotion()) {
  entranceItems.forEach(([selector, delay]) => {
    const element = document.querySelector(selector);
    if (!element?.animate) return;

    element.animate(
      [
        { opacity: 0, transform: 'translate3d(0, 12px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ],
      {
        duration: 520,
        delay,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'both'
      }
    );
  });
}

const revealItems = document.querySelectorAll('.section-head, .scale-card, .fact-panel');

if ('IntersectionObserver' in window && !reducedMotion()) {
  revealItems.forEach((item) => {
    item.style.opacity = '0';
    item.style.transform = 'translate3d(0, 14px, 0)';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const siblings = [...entry.target.parentElement.children];
      const delay = Math.min(Math.max(siblings.indexOf(entry.target), 0) * 45, 180);
      const animation = entry.target.animate(
        [
          { opacity: 0, transform: 'translate3d(0, 14px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ],
        {
          duration: 520,
          delay,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both'
        }
      );

      const settle = () => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = '';
        animation.cancel();
      };

      animation.finished.then(settle, settle);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const modalTriggers = document.querySelectorAll('[data-modal-open]');
const customStack = [];
const customStates = new WeakMap();
const nativeTriggers = new WeakMap();
const preparedDialogs = new WeakSet();
let bodyLockCount = 0;
let previousBodyOverflow = '';

function lockBody() {
  if (bodyLockCount === 0) previousBodyOverflow = body.style.overflow;
  bodyLockCount += 1;
  body.style.overflow = 'hidden';
}

function unlockBody() {
  bodyLockCount = Math.max(0, bodyLockCount - 1);
  if (bodyLockCount === 0) body.style.overflow = previousBodyOverflow;
}

function focusableItems(root) {
  return [...root.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
  )].filter((item) => !item.hasAttribute('hidden'));
}

function modalPanel(modal) {
  if (modal.matches('[role="dialog"]')) return modal;
  return modal.querySelector('[role="dialog"], [data-modal-panel]') || modal.firstElementChild || modal;
}

function animateModal(modal) {
  if (reducedMotion()) return;
  const panel = modalPanel(modal);
  if (!panel?.animate) return;

  panel.animate(
    [
      { opacity: 0, transform: 'translate3d(0, 14px, 0) scale(0.985)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
    ],
    {
      duration: 360,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both'
    }
  );
}

function prepareDialog(dialog) {
  if (preparedDialogs.has(dialog)) return;
  preparedDialogs.add(dialog);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeModal(dialog);
  });

  dialog.addEventListener('close', () => {
    const trigger = nativeTriggers.get(dialog);
    trigger?.setAttribute('aria-expanded', 'false');
    unlockBody();
    trigger?.focus();
  });
}

function openCustomModal(modal, trigger) {
  if (customStates.get(modal)?.open) return;

  if (customStack.length) {
    closeCustomModal(customStack[customStack.length - 1], false);
  }

  const state = { open: true, trigger };
  customStates.set(modal, state);

  modal.hidden = false;
  modal.style.display = 'grid';
  modal.style.opacity = '1';
  modal.style.visibility = 'visible';
  modal.style.pointerEvents = 'auto';
  modal.setAttribute('aria-hidden', 'false');
  modal.setAttribute('aria-modal', 'true');
  trigger?.setAttribute('aria-expanded', 'true');

  const overlayClick = (event) => {
    if (event.target === modal && !modal.matches('[role="dialog"]')) {
      closeModal(modal);
    }
  };

  modal.addEventListener('click', overlayClick);
  state.cleanup = () => modal.removeEventListener('click', overlayClick);

  customStack.push(modal);
  lockBody();
  animateModal(modal);

  requestAnimationFrame(() => {
    const panel = modalPanel(modal);
    const firstFocusable = focusableItems(panel)[0];
    firstFocusable?.focus();
  });
}

function closeCustomModal(modal, restoreFocus = true) {
  const state = customStates.get(modal);
  if (!state?.open) return;

  state.open = false;
  state.trigger?.setAttribute('aria-expanded', 'false');
  state.cleanup?.();

  const index = customStack.indexOf(modal);
  if (index !== -1) customStack.splice(index, 1);

  modal.style.pointerEvents = 'none';
  modal.setAttribute('aria-hidden', 'true');

  const finish = () => {
    modal.hidden = true;
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    unlockBody();
    if (restoreFocus) state.trigger?.focus();
  };

  if (!reducedMotion() && modal.animate) {
    const animation = modal.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 180, easing: 'ease-out', fill: 'both' }
    );
    animation.finished.then(finish, finish);
  } else {
    finish();
  }
}

function openModal(modal, trigger) {
  trigger?.setAttribute('aria-haspopup', 'dialog');

  if (modal.tagName === 'DIALOG') {
    nativeTriggers.set(modal, trigger);
    prepareDialog(modal);

    if (!modal.open) {
      lockBody();
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
    }

    trigger?.setAttribute('aria-expanded', 'true');
    animateModal(modal);
  } else {
    openCustomModal(modal, trigger);
  }
}

function closeModal(modal, restoreFocus = true) {
  if (!modal) return;

  if (modal.tagName === 'DIALOG') {
    if (modal.open) modal.close();
  } else {
    closeCustomModal(modal, restoreFocus);
  }
}

document.querySelectorAll('dialog').forEach(prepareDialog);

document.addEventListener('click', (event) => {
  const target = event.target;
  let closer = target.closest?.('[data-modal-close]');

  if (!closer) {
    const button = target.closest?.('button');
    const label = button
      ? `${button.getAttribute('aria-label') || ''} ${button.textContent || ''}`
      : '';
    if (button && /close|dismiss|×|✕/i.test(label)) closer = button;
  }

  if (closer) {
    event.preventDefault();

    const value = closer.getAttribute('data-modal-close');
    let modal = value && value !== 'true' ? document.getElementById(value) : null;

    modal ||= closer.closest('dialog, [aria-modal="true"]');
    modal ||= [...customStack].reverse().find((item) => item.contains(closer));
    closeModal(modal);
    return;
  }

  const opener = target.closest?.('[data-modal-open]');
  if (!opener) return;

  event.preventDefault();
  const id = opener.getAttribute('data-modal-open').replace(/^#/, '');
  const modal = document.getElementById(id);
  if (modal) openModal(modal, opener);
});

document.addEventListener('keydown', (event) => {
  const customModal = customStack[customStack.length - 1];

  if (event.key === 'Escape' && customModal) {
    event.preventDefault();
    closeModal(customModal);
    return;
  }

  if (event.key !== 'Tab' || !customModal) return;

  const focusables = focusableItems(modalPanel(customModal));
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const navShell = document.querySelector('.nav-shell');
const navLinks = document.querySelector('.nav-links');
const navUtility = document.querySelector('.nav-utility');
const mobileQuery = window.matchMedia('(max-width: 820px)');
let menuButton = null;
let menuOpen = false;

function setMenu(open) {
  if (!mobileQuery.matches || !navLinks || !menuButton) return;
  menuOpen = open;
  navLinks.hidden = !open;
  navLinks.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
}

function configureMobileNav() {
  if (!navShell || !navLinks) return;

  if (mobileQuery.matches) {
    if (!menuButton) {
      menuButton = document.createElement('button');
      menuButton.type = 'button';
      menuButton.textContent = 'Menu';
      menuButton.setAttribute('aria-label', 'Toggle navigation');
      menuButton.setAttribute('aria-expanded', 'false');
      Object.assign(menuButton.style, {
        minHeight: '42px',
        padding: '0 14px',
        border: '1px solid rgba(255,255,255,.22)',
        borderRadius: '999px',
        background: 'transparent',
        color: '#fff',
        font: '600 11px "Space Grotesk", Arial, sans-serif',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        cursor: 'pointer'
      });
      navShell.append(menuButton);
    }

    navShell.style.gridTemplateColumns = '1fr auto';
    navShell.style.position = 'relative';
    Object.assign(navLinks.style, {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: '0',
      right: '0',
      zIndex: '120',
      padding: '18px',
      gap: '4px',
      flexDirection: 'column',
      alignItems: 'stretch',
      background: '#0b0b0b',
      border: '1px solid rgba(255,255,255,.12)',
      borderRadius: '16px',
      boxShadow: '0 18px 50px rgba(11,11,11,.2)'
    });
    if (navUtility) navUtility.hidden = true;
    setMenu(false);
  } else {
    menuButton?.remove();
    menuButton = null;
    menuOpen = false;
    navShell.style.gridTemplateColumns = '';
    navShell.style.position = '';
    navLinks.hidden = false;
    navLinks.removeAttribute('aria-hidden');
    Object.assign(navLinks.style, {
      position: '',
      top: '',
      left: '',
      right: '',
      zIndex: '',
      padding: '',
      gap: '',
      flexDirection: '',
      alignItems: '',
      background: '',
      border: '',
      borderRadius: '',
      boxShadow: ''
    });
    if (navUtility) navUtility.hidden = false;
  }
}

if (navShell && navLinks) {
  menuButton?.addEventListener('click', () => setMenu(!menuOpen));
  navLinks.addEventListener('click', (event) => {
    if (event.target.closest?.('a')) setMenu(false);
  });
  document.addEventListener('click', (event) => {
    if (menuOpen && !navShell.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) setMenu(false);
  });
  configureMobileNav();
  if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', configureMobileNav);
  else mobileQuery.addListener(configureMobileNav);
}
