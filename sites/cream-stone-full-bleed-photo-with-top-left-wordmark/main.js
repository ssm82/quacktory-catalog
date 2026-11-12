// file: main.js
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionQuery.matches;

const siteHeader = document.querySelector('.site-header');
const interactionStyles = document.createElement('style');
interactionStyles.textContent = `
  .site-nav__link[aria-current="location"]::after {
    transform: scaleX(1);
    transform-origin: left;
  }
  .scale-frame__trigger[aria-pressed="true"] .scale-frame__corner {
    transform: rotate(90deg);
  }
  .scale-frame__trigger[aria-pressed="true"] .scale-frame__image {
    filter: saturate(0.82) contrast(1.04) brightness(1.02);
  }
`;
document.head.append(interactionStyles);

const supportsViewTimeline = window.CSS?.supports?.('animation-timeline: view()');

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    const headerHeight = siteHeader?.getBoundingClientRect().height ?? 0;
    const destination = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - headerHeight - 16
    );
    const behavior = reducedMotion ? 'auto' : 'smooth';

    try {
      window.scrollTo({ top: destination, behavior });
    } catch {
      window.scrollTo(0, destination);
    }

    history.pushState(null, '', href);
  });
});

const navLinks = Array.from(document.querySelectorAll('.site-nav__link'));
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (navLinks.length && navSections.length && 'IntersectionObserver' in window) {
  const setCurrentSection = (id) => {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setCurrentSection(visible.target.id);
  }, { threshold: 0, rootMargin: '-30% 0px -62% 0px' });

  navSections.forEach((section) => navObserver.observe(section));
}

const dialogTriggers = Array.from(document.querySelectorAll('[data-dialog]'));
const ladderTriggers = Array.from(document.querySelectorAll('.scale-ladder .scale-frame__trigger'));
const dialogs = Array.from(document.querySelectorAll('.product-dialog'));

let activeDialog = null;
let activeTrigger = null;

dialogTriggers.forEach((trigger) => {
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  if (trigger.dataset.dialog) trigger.setAttribute('aria-controls', trigger.dataset.dialog);
});

ladderTriggers.forEach((trigger) => {
  trigger.setAttribute('aria-pressed', 'false');
});

function finalizeDialog(dialog) {
  if (activeDialog !== dialog) return;

  const trigger = activeTrigger;
  activeDialog = null;
  activeTrigger = null;

  dialogTriggers.forEach((item) => item.setAttribute('aria-expanded', 'false'));

  requestAnimationFrame(() => {
    if (!activeDialog && trigger?.isConnected) {
      trigger.focus({ preventScroll: true });
    }
  });
}

function closeDialog(dialog) {
  if (!dialog) return;

  if (typeof dialog.close === 'function' && dialog.open) {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
    finalizeDialog(dialog);
  }
}

function openDialog(dialog, trigger) {
  if (!dialog) return;

  if (activeDialog && activeDialog !== dialog) {
    closeDialog(activeDialog);
  }

  activeDialog = dialog;
  activeTrigger = trigger;
  dialogTriggers.forEach((item) => item.setAttribute('aria-expanded', 'false'));
  trigger?.setAttribute('aria-expanded', 'true');

  ladderTriggers.forEach((item) => {
    const selected = item === trigger;
    item.setAttribute('aria-pressed', String(selected));
  });

  if (typeof dialog.showModal === 'function') {
    try {
      dialog.showModal();
    } catch {
      dialog.setAttribute('open', '');
    }
  } else {
    dialog.setAttribute('open', '');
  }

  requestAnimationFrame(() => {
    dialog.querySelector('.product-dialog__close')?.focus({ preventScroll: true });
  });
}

dialogTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    const dialog = document.getElementById(trigger.dataset.dialog);
    if (!dialog) return;
    event.preventDefault();
    openDialog(dialog, trigger);
  });
});

dialogs.forEach((dialog) => {
  dialog.querySelector('.product-dialog__close')?.addEventListener('click', () => {
    closeDialog(dialog);
  });

  dialog.addEventListener('close', () => finalizeDialog(dialog));

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;

    const panel = dialog.querySelector('.product-dialog__panel');
    if (!panel) {
      closeDialog(dialog);
      return;
    }

    const bounds = panel.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (outside) closeDialog(dialog);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeDialog && typeof activeDialog.showModal !== 'function') {
    closeDialog(activeDialog);
    return;
  }

  const currentIndex = ladderTriggers.indexOf(document.activeElement);
  if (currentIndex < 0) return;

  let nextIndex = currentIndex;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % ladderTriggers.length;
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + ladderTriggers.length) % ladderTriggers.length;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = ladderTriggers.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  ladderTriggers[nextIndex].focus();
});

motionQuery.addEventListener?.('change', (event) => {
  reducedMotion = event.matches;
});
