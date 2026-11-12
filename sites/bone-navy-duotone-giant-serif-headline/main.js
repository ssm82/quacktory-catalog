// file: main.js
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const reveal = (element, delay = 0, mode = 'up') => {
  if (!element) return;

  if (typeof element.animate !== 'function') {
    element.style.opacity = '';
    return;
  }

  const reduced = motionQuery.matches;
  let from = 'translateY(16px)';

  if (mode === 'scale') from = 'translateY(10px) scale(.96)';
  if (mode === 'fragment') from = 'translateY(8px) rotate(-1.5deg)';

  const frames = reduced
    ? [{ opacity: 0 }, { opacity: 1 }]
    : [
        { opacity: 0, transform: from },
        { opacity: 1, transform: 'translateY(0) rotate(0) scale(1)' }
      ];

  const animation = element.animate(frames, {
    duration: reduced ? 160 : mode === 'scale' ? 620 : 460,
    delay: reduced ? 0 : delay,
    easing: EASE,
    fill: 'backwards'
  });

  const clearInlineState = () => {
    element.style.opacity = '';
  };

  animation.finished.then(clearInlineState, clearInlineState);
};

const heroFrames = [...document.querySelectorAll('.story-frame')];

const revealHero = () => {
  heroFrames.forEach((frame, frameIndex) => {
    const offset = frameIndex * 90;

    reveal(frame.querySelector('.story-frame__index'), offset);
    reveal(frame.querySelector('.story-frame__kicker'), offset + 35);
    reveal(frame.querySelector('.story-frame__heading'), offset + 75);
    reveal(
      frame.querySelector('.duck-graphic, .fold-graphic, .media-crop'),
      offset + 135,
      'scale'
    );
    reveal(frame.querySelector('.round-control'), offset + 225);

    frame.querySelectorAll('.fragment').forEach((fragment, fragmentIndex) => {
      reveal(fragment, offset + 180 + fragmentIndex * 45, 'fragment');
    });
  });
};

requestAnimationFrame(revealHero);

const scaleCards = [...document.querySelectorAll('.sku-card')];
const productionItems = [...document.querySelectorAll('.production-item')];
const revealTargets = [
  ...document.querySelectorAll('.scale-section__head'),
  ...scaleCards,
  ...productionItems
];

const revealDelays = new WeakMap();
scaleCards.forEach((card, index) => revealDelays.set(card, index * 55));
productionItems.forEach((item, index) => revealDelays.set(item, index * 45));

if ('IntersectionObserver' in window && revealTargets.length) {
  if (!motionQuery.matches) {
    revealTargets.forEach((element) => {
      element.style.opacity = '0';
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const mode = element.classList.contains('sku-card') ? 'scale' : 'up';
        reveal(element, revealDelays.get(element) || 0, mode);
        observer.unobserve(element);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => reveal(element));
}

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (finePointer.matches && !motionQuery.matches) {
  document.querySelectorAll('.story-frame__screen').forEach((screen) => {
    const graphic = screen.querySelector('.duck-graphic, .fold-graphic, .media-crop');
    if (!graphic) return;

    screen.addEventListener('pointermove', (event) => {
      const bounds = screen.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

      graphic.style.translate = `${(offsetX * 4).toFixed(2)}px ${(offsetY * 4).toFixed(2)}px`;
    });

    screen.addEventListener('pointerleave', () => {
      graphic.style.translate = '';
    });
  });
}

const dialogs = [...document.querySelectorAll('dialog')];
const returnFocus = new WeakMap();
const closingDialogs = new WeakSet();
const skuTriggers = [...document.querySelectorAll('.sku-card__trigger')];
let activeDialog = null;

const isOpen = (dialog) => (
  dialog.matches('dialog') ? dialog.open : dialog.hasAttribute('open')
);

const closeControlFor = (dialog) => {
  const explicit = dialog.querySelector('[data-modal-close]');
  if (explicit) return explicit;

  return [...dialog.querySelectorAll('button')].find((button) => {
    const label = [
      button.getAttribute('aria-label') || '',
      String(button.className || ''),
      button.textContent || ''
    ].join(' ');

    return /close|dismiss|×|✕/i.test(label);
  });
};

const animateDialog = (dialog, opening) => {
  if (motionQuery.matches || typeof dialog.animate !== 'function') return;

  const frames = opening
    ? [
        { opacity: 0, transform: 'translateY(12px) scale(.98)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ]
    : [
        { opacity: 1, transform: 'translateY(0) scale(1)' },
        { opacity: 0, transform: 'translateY(8px) scale(.985)' }
      ];

  dialog.animate(frames, {
    duration: opening ? 320 : 210,
    easing: EASE
  });
};

const openDialog = (dialog, trigger) => {
  if (!dialog) return;

  if (activeDialog && activeDialog !== dialog && isOpen(activeDialog)) {
    if (typeof activeDialog.close === 'function') activeDialog.close();
  }

  if (!isOpen(dialog)) {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
      dialog.setAttribute('aria-modal', 'true');
    }
  }

  activeDialog = dialog;
  returnFocus.set(dialog, trigger);
  requestAnimationFrame(() => animateDialog(dialog, true));
};

const closeDialog = async (dialog) => {
  if (!dialog || !isOpen(dialog) || closingDialogs.has(dialog)) return;

  closingDialogs.add(dialog);

  if (!motionQuery.matches && typeof dialog.animate === 'function') {
    const animation = dialog.animate(
      [
        { opacity: 1, transform: 'translateY(0) scale(1)' },
        { opacity: 0, transform: 'translateY(8px) scale(.985)' }
      ],
      { duration: 210, easing: EASE }
    );

    await animation.finished.catch(() => {});
  }

  if (dialog.matches('dialog') && typeof dialog.close === 'function') {
    if (dialog.open) dialog.close();
  } else {
    dialog.removeAttribute('open');
  }

  closingDialogs.delete(dialog);
};

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const explicitClose = target.closest('[data-modal-close]');
  if (explicitClose && activeDialog) {
    event.preventDefault();
    void closeDialog(activeDialog);
    return;
  }

  const trigger = target.closest('[data-modal-target]');
  if (!trigger) return;

  const dialog = document.getElementById(trigger.dataset.modalTarget);
  if (!dialog) return;

  if (trigger.matches('.sku-card__trigger')) {
    skuTriggers.forEach((item) => {
      item.setAttribute('aria-pressed', item === trigger ? 'true' : 'false');
    });
  }

  openDialog(dialog, trigger);
});

dialogs.forEach((dialog) => {
  const closeControl = closeControlFor(dialog);

  if (closeControl && !closeControl.hasAttribute('data-modal-close')) {
    closeControl.addEventListener('click', (event) => {
      event.preventDefault();
      void closeDialog(dialog);
    });
  }

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;

    const bounds = dialog.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (outside) void closeDialog(dialog);
  });

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    void closeDialog(dialog);
  });

  dialog.addEventListener('close', () => {
    closingDialogs.delete(dialog);
    if (activeDialog === dialog) activeDialog = null;

    const trigger = returnFocus.get(dialog);
    if (!trigger) return;

    requestAnimationFrame(() => {
      try {
        trigger.focus({ preventScroll: true });
      } catch {
        trigger.focus();
      }
    });
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !activeDialog) return;

  event.preventDefault();
  void closeDialog(activeDialog);
});
