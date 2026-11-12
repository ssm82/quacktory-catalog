// file: main.js
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = reduceMotionQuery.matches;
const body = document.body;
const dialogs = new Set();
const openers = new WeakMap();
const revealTargets = [];
let activeDialog = null;
let bodyLocks = 0;
let previousOverflow = '';
let revealObserver = null;

function lockBody() {
  if (bodyLocks === 0) previousOverflow = body.style.overflow;
  bodyLocks += 1;
  body.style.overflow = 'hidden';
}

function unlockBody() {
  bodyLocks = Math.max(0, bodyLocks - 1);
  if (bodyLocks === 0) body.style.overflow = previousOverflow;
}

function finishDialogClose(dialog) {
  if (typeof dialog.close !== 'function') {
    dialog.removeAttribute('open');
    dialog.hidden = true;
  }
  if (activeDialog === dialog) activeDialog = null;
  unlockBody();
  const opener = openers.get(dialog);
  if (opener && document.contains(opener)) {
    opener.setAttribute('aria-expanded', 'false');
    opener.focus({ preventScroll: true });
  }
}

function prepareDialog(dialog) {
  if (dialogs.has(dialog)) return;
  dialogs.add(dialog);
  dialog.setAttribute('data-modal-container', '');
  if (typeof dialog.close === 'function') {
    dialog.addEventListener('close', () => finishDialogClose(dialog));
  }
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) closeDialog(dialog);
  });
  const closeControl = [...dialog.querySelectorAll('button, a')].find((control) => {
    const label = `${control.getAttribute('aria-label') || ''} ${control.textContent || ''}`;
    return /close|dismiss|×|✕/i.test(label);
  });
  if (closeControl) {
    closeControl.setAttribute('data-close', '');
  } else {
    const firstButton = dialog.querySelector('button');
    if (firstButton) firstButton.setAttribute('data-close', '');
  }
}

function openDialog(dialog, opener) {
  if (!dialog) return;
  prepareDialog(dialog);
  const wasOpen = dialog.open || dialog.hasAttribute('open');
  openers.set(dialog, opener);
  if (typeof dialog.showModal === 'function') {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.hidden = false;
    dialog.setAttribute('open', '');
  }
  if (!wasOpen) lockBody();
  activeDialog = dialog;
  if (opener) opener.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => {
    const focusTarget = dialog.querySelector('[autofocus], button:not([disabled]), a[href]');
    focusTarget?.focus({ preventScroll: true });
  });
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === 'function') {
    if (dialog.open) dialog.close();
  } else if (dialog.hasAttribute('open') || !dialog.hidden) {
    dialog.removeAttribute('open');
    finishDialogClose(dialog);
  }
}

document.querySelectorAll('dialog').forEach(prepareDialog);

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-modal]');
  if (!trigger) return;
  event.preventDefault();
  const target = document.getElementById(trigger.dataset.modal);
  if (target) openDialog(target, trigger);
  else openInfo(trigger);
});

document.addEventListener('click', (event) => {
  const control = event.target.closest('button, a, [data-close]');
  const owner = control?.closest('[data-modal-container]');
  if (!control || !owner) return;
  const label = `${control.getAttribute('aria-label') || ''} ${control.textContent || ''}`;
  if (control.hasAttribute('data-close') || /close|dismiss|×|✕/i.test(label)) {
    event.preventDefault();
    closeDialog(owner);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeDialog) {
    event.preventDefault();
    closeDialog(activeDialog);
  }
});

let infoDialog = null;

function ensureInfoDialog() {
  if (infoDialog) return infoDialog;
  infoDialog = document.createElement('dialog');
  infoDialog.id = 'quacktory-details-dialog';
  infoDialog.setAttribute('aria-label', 'Details');
  Object.assign(infoDialog.style, {
    width: 'min(420px, calc(100vw - 32px))',
    padding: '0',
    border: '0',
    borderRadius: '18px',
    background: 'transparent',
    overflow: 'visible'
  });
  infoDialog.innerHTML = `
    <div class="module-card" style="position:relative;min-width:0;padding:34px;">
      <button class="brand-icon" type="button" data-close aria-label="Close details"
        style="position:absolute;top:12px;right:12px;">×</button>
      <span class="module-index">INFO</span>
      <span class="module-title">Details</span>
      <span class="module-copy"></span>
      <span class="module-meta"></span>
      <span class="module-arrow" aria-hidden="true">→</span>
    </div>`;
  body.append(infoDialog);
  prepareDialog(infoDialog);
  return infoDialog;
}

function textFrom(root, selectors) {
  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (element?.textContent.trim()) {
      return element.textContent.trim().replace(/\s+/g, ' ');
    }
  }
  return '';
}

function openInfo(trigger, isSettings = false) {
  const dialog = ensureInfoDialog();
  const title = isSettings
    ? 'Site settings'
    : textFrom(trigger, ['.module-title', '.scale-line', '.quality-title', '.custom-panel-title']) ||
      trigger.getAttribute('aria-label') || 'Details';
  const copy = isSettings
    ? 'Motion preferences follow your device, keeping every transition calm and accessible.'
    : textFrom(trigger, ['.module-copy', '.scale-audience', '.quality-copy', '.custom-lead']) ||
      'Open this item to explore the details behind the platform.';
  const meta = isSettings
    ? 'No account, cookies, or tracking are required.'
    : textFrom(trigger, ['.module-meta', '.scale-size', '.scale-comparison-text']);
  const index = textFrom(trigger, ['.module-index', '.quality-number']) || 'INFO';
  const accent = trigger?.dataset.accent ||
    (trigger ? getComputedStyle(trigger).getPropertyValue('--accent').trim() : '') ||
    '#4285F4';
  dialog.setAttribute('aria-label', title);
  dialog.querySelector('.module-index').textContent = index;
  dialog.querySelector('.module-title').textContent = title;
  dialog.querySelector('.module-copy').textContent = copy;
  dialog.querySelector('.module-meta').textContent = meta;
  dialog.querySelector('.module-card').style.setProperty('--accent', accent);
  openDialog(dialog, trigger);
  animateIn(dialog.querySelector('.module-card'), 0, 320);
}

let settingsTrigger = document.querySelector(
  '[data-settings], [aria-controls*="setting" i], [aria-label*="settings" i], [aria-label*="preferences" i]'
);

if (!settingsTrigger && document.querySelector('.site-header')) {
  settingsTrigger = document.createElement('button');
  settingsTrigger.type = 'button';
  settingsTrigger.className = 'brand-icon';
  settingsTrigger.setAttribute('aria-label', 'Open settings');
  settingsTrigger.setAttribute('aria-haspopup', 'dialog');
  settingsTrigger.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true"
      style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5 7 7M17 17l1.5 1.5M18.5 5.5 17 7M7 17l-1.5 1.5"></path>
    </svg>`;
  document.querySelector('.site-header').append(settingsTrigger);
}

if (settingsTrigger && !settingsTrigger.hasAttribute('data-modal')) {
  settingsTrigger.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = settingsTrigger.getAttribute('aria-controls');
    const target = targetId ? document.getElementById(targetId) : null;
    if (target) openDialog(target, settingsTrigger);
    else openInfo(settingsTrigger, true);
  });
}

const shareTrigger = document.querySelector('[data-share], [aria-label*="share" i]') ||
  [...document.querySelectorAll('button, a')].find((control) => /^\s*share\b/i.test(control.textContent));

if (shareTrigger) {
  const shareLimit = 99;
  let shareCount = 0;
  const counter = document.createElement('span');
  counter.setAttribute('data-share-count', '');
  counter.setAttribute('aria-live', 'polite');
  counter.textContent = '0 shares';
  shareTrigger.append(' ', counter);
  shareTrigger.addEventListener('click', () => {
    shareCount = Math.min(shareLimit, shareCount + 1);
    counter.textContent = `${shareCount} share${shareCount === 1 ? '' : 's'} · ${shareCount}/${shareLimit}`;
    shareTrigger.setAttribute('aria-label', `Shared ${shareCount} time${shareCount === 1 ? '' : 's'}`);
  });
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.closest('[data-modal-container]')) return;
  const hash = link.getAttribute('href');
  if (!hash || hash === '#') return;
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  try {
    history.replaceState(null, '', hash);
  } catch {
    // History can be unavailable in sandboxed previews.
  }
});

function animateIn(element, delay = 0, duration = 600) {
  if (!element || reduceMotion || typeof element.animate !== 'function') return;
  element.animate([
    { opacity: 0, transform: 'translateY(14px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], {
    duration,
    delay,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'both'
  });
}

animateIn(document.querySelector('.hero-eyebrow'), 0, 420);
document.querySelectorAll('.title-line').forEach((line, index) => {
  animateIn(line, 70 + index * 70, 700);
});
animateIn(document.querySelector('.hero-copy'), 220, 540);
animateIn(document.querySelector('.hero-actions'), 270, 540);
document.querySelectorAll('.module-card').forEach((card, index) => {
  animateIn(card, 330 + index * 55, 520);
});
animateIn(document.querySelector('.orbital-stage'), 470, 700);

revealTargets.push(...document.querySelectorAll(
  '.range-header, .scale-card, .scale-note, .process-intro, .quality-card, ' +
  '.architect-note, .compliance-strip, .custom-copy, .custom-panel'
));

if ('IntersectionObserver' in window && !reduceMotion) {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const siblings = target.parentElement ? [...target.parentElement.children] : [target];
      const index = Math.max(0, siblings.indexOf(target));
      target.style.opacity = '';
      target.style.transform = '';
      animateIn(target, Math.min(index * 55, 220), 520);
      revealObserver.unobserve(target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((target) => {
    target.style.opacity = '0';
    target.style.transform = 'translateY(14px)';
    revealObserver.observe(target);
  });
}

reduceMotionQuery.addEventListener('change', (event) => {
  reduceMotion = event.matches;
  if (reduceMotion) {
    revealTargets.forEach((target) => {
      target.style.opacity = '1';
      target.style.transform = 'none';
      revealObserver?.unobserve(target);
    });
  }
});
