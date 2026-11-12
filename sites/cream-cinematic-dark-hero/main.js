// file: main.js
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const canAnimate = typeof Element !== "undefined" && typeof Element.prototype.animate === "function";

const resolveElement = (value) =>
  typeof value === "string" ? document.querySelector(value) : value;

const animateElement = (element, keyframes, options = {}) => {
  if (!canAnimate) return null;
  const target = resolveElement(element);
  if (!target?.animate) return null;
  return target.animate(keyframes, {
    easing: EASE,
    fill: "both",
    ...options,
  });
};

const revealHero = () => {
  if (reducedMotion.matches) return;

  animateElement(".hero-media", [
    { opacity: 0 },
    { opacity: 1 },
  ], { duration: 700 });

  animateElement(".hero-haze", [
    { opacity: 0 },
    { opacity: 1 },
  ], { duration: 900, delay: 120 });

  animateElement(".hero-glow", [
    { opacity: 0, scale: "0.96" },
    { opacity: 1, scale: "1" },
  ], { duration: 850, delay: 180 });

  animateElement(".hero-title", [
    { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    { opacity: 1, clipPath: "inset(0 0 0 0)" },
  ], { duration: 900, delay: 110 });

  animateElement(".hero-kicker", [
    { opacity: 0, translate: "0 8px" },
    { opacity: 1, translate: "0 0" },
  ], { duration: 420, delay: 260 });

  animateElement(".hero-manifesto", [
    { opacity: 0 },
    { opacity: 1 },
  ], { duration: 500, delay: 390 });

  [".hero-red-top", ".hero-red-bottom"].forEach((selector, index) => {
    animateElement(selector, [
      { opacity: 0, translate: "0 12px" },
      { opacity: 1, translate: "0 0" },
    ], { duration: 360, delay: 230 + index * 80 });
  });
};

const revealElements = [
  ...document.querySelectorAll([
    ".section-heading",
    ".scale-item",
    ".production-intro",
    ".fact-band",
    ".quality-block",
    ".specification-band",
    ".custom-heading",
    ".custom-question",
    ".palette-rail",
    ".lead-times",
    ".custom-cta-row",
  ].join(",")),
];

let revealObserver;

if (canAnimate && !reducedMotion.matches && "IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      element.style.opacity = "0";
      element.style.translate = "0 24px";
      const siblings = element.parentElement
        ? [...element.parentElement.children]
        : [];
      const delay = Math.min(siblings.indexOf(element), 5) * 70;
      const animation = animateElement(element, [
        { opacity: 0, translate: "0 24px" },
        { opacity: 1, translate: "0 0" },
      ], { duration: 560, delay, fill: "backwards" });

      if (animation) {
        animation.addEventListener("finish", () => {
          element.style.opacity = "";
          element.style.translate = "";
        });
      }

      revealObserver.unobserve(element);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
}

reducedMotion.addEventListener?.("change", (event) => {
  if (!event.matches) return;
  revealObserver?.disconnect();
  revealElements.forEach((element) => {
    element.style.opacity = "";
    element.style.translate = "";
  });
});

revealHero();

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const hash = link.getAttribute("href");
  if (!hash || hash.length < 2) return;

  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({
    behavior: reducedMotion.matches ? "auto" : "smooth",
    block: "start",
  });

  try {
    history.pushState(null, "", hash);
  } catch {
    location.hash = hash;
  }
});

const closeControlSelector =
  '[data-dialog-close], [data-close-dialog], [aria-label*="close" i], [title*="close" i]';

const findCloseControl = (dialog) => {
  const explicit = dialog.querySelector(closeControlSelector);
  if (explicit) return explicit;

  return [...dialog.querySelectorAll("button")].find((button) =>
    /^(close|dismiss)\b|^[×✕]$/i.test(button.textContent.trim()),
  );
};

const isCloseButton = (button) =>
  button.matches(closeControlSelector) ||
  /^(close|dismiss)\b|^[×✕]$/i.test(button.textContent.trim());

const modalTriggers = [
  ...new Set(document.querySelectorAll(
    '[data-dialog], [aria-haspopup="dialog"][aria-controls]',
  )),
];

const knownDialogs = new Set();
const modalState = new WeakMap();
let activeDialog = null;
let previousFocus = null;
let previousOverflow = "";

const makeDialogVisible = (dialog) => {
  dialog.hidden = false;
  Object.assign(dialog.style, {
    position: "fixed",
    inset: "0",
    zIndex: "9998",
    display: "grid",
    placeItems: "center",
    width: "100vw",
    height: "100dvh",
    margin: "0",
    padding: "1rem",
    overflowY: "auto",
    visibility: "visible",
    opacity: "1",
    background: "rgba(5, 5, 5, 0.86)",
  });
};

const openDialog = (dialog, trigger) => {
  if (!dialog) return;
  if (activeDialog && activeDialog !== dialog) closeDialog(activeDialog);

  previousFocus = trigger || document.activeElement;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const state = {
    trigger,
    custom: dialog.tagName !== "DIALOG",
    hidden: dialog.hidden,
    style: dialog.getAttribute("style"),
    ariaHidden: dialog.getAttribute("aria-hidden"),
    ariaModal: dialog.getAttribute("aria-modal"),
    hadExpanded: trigger?.hasAttribute("aria-expanded") ?? false,
    expanded: trigger?.getAttribute("aria-expanded"),
  };

  modalState.set(dialog, state);
  dialog.setAttribute("aria-hidden", "false");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("data-open", "");

  if (trigger) trigger.setAttribute("aria-expanded", "true");

  if (state.custom) {
    makeDialogVisible(dialog);
  } else if (!dialog.open) {
    try {
      dialog.showModal();
    } catch {
      state.custom = true;
      dialog.setAttribute("open", "");
      makeDialogVisible(dialog);
    }
  }

  activeDialog = dialog;

  requestAnimationFrame(() => {
    const focusTarget =
      dialog.querySelector("[autofocus]") ||
      findCloseControl(dialog) ||
      dialog.querySelector("button, a[href], input, select, textarea");
    focusTarget?.focus?.({ preventScroll: true });
  });
};

const finalizeDialog = (dialog) => {
  const state = modalState.get(dialog);
  if (!state) return;
  modalState.delete(dialog);

  if (state.custom) {
    dialog.hidden = state.hidden;
    if (state.style === null) dialog.removeAttribute("style");
    else dialog.setAttribute("style", state.style);
  }

  if (state.ariaHidden === null) dialog.removeAttribute("aria-hidden");
  else dialog.setAttribute("aria-hidden", state.ariaHidden);

  if (state.ariaModal === null) dialog.removeAttribute("aria-modal");
  else dialog.setAttribute("aria-modal", state.ariaModal);

  dialog.removeAttribute("data-open");

  if (state.trigger) {
    if (state.hadExpanded) state.trigger.setAttribute("aria-expanded", state.expanded);
    else state.trigger.removeAttribute("aria-expanded");
  }

  if (activeDialog === dialog) {
    activeDialog = null;
    document.body.style.overflow = previousOverflow;
    if (previousFocus?.isConnected) {
      previousFocus.focus?.({ preventScroll: true });
    }
  }
};

const closeDialog = (dialog = activeDialog) => {
  if (!dialog) return;

  if (dialog.tagName === "DIALOG" && typeof dialog.close === "function" && dialog.open) {
    dialog.close();
  }

  finalizeDialog(dialog);
};

const attachDialogEvents = (dialog) => {
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
  dialog.addEventListener("close", () => finalizeDialog(dialog));
};

modalTriggers.forEach((trigger) => {
  const id = (
    trigger.dataset.dialog ||
    trigger.getAttribute("aria-controls") ||
    ""
  ).trim();
  const dialog = id ? document.getElementById(id) : null;
  if (!dialog) return;

  knownDialogs.add(dialog);
  attachDialogEvents(dialog);

  trigger.addEventListener("click", (event) => {
    if (trigger.tagName === "A") event.preventDefault();
    openDialog(dialog, trigger);
  });
});

document.addEventListener("click", (event) => {
  if (!activeDialog) return;

  const clickedButton = event.target.closest("button");
  if (
    clickedButton &&
    activeDialog.contains(clickedButton) &&
    isCloseButton(clickedButton)
  ) {
    event.preventDefault();
    closeDialog(activeDialog);
    return;
  }

  if (event.target !== activeDialog) return;

  if (activeDialog.tagName === "DIALOG") {
    const rect = activeDialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (outside) closeDialog(activeDialog);
  } else {
    closeDialog(activeDialog);
  }
});

document.addEventListener("keydown", (event) => {
  if (!activeDialog) return;

  if (event.key === "Escape" && activeDialog.tagName !== "DIALOG") {
    event.preventDefault();
    closeDialog(activeDialog);
    return;
  }

  if (event.key !== "Tab" || activeDialog.tagName === "DIALOG") return;

  const focusable = [...activeDialog.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )].filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");

  if (!focusable.length) {
    event.preventDefault();
    activeDialog.focus?.();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const shareCounters = [...document.querySelectorAll("[data-share-count]")];
const shareButtons = [...document.querySelectorAll("[data-share], [data-share-button]")];
let shareCount = Math.min(
  999,
  Number.parseInt(shareCounters[0]?.textContent || "0", 10) || 0,
);

shareButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    shareCount = Math.min(999, shareCount + 1);
    shareCounters.forEach((counter) => {
      counter.textContent = String(shareCount);
    });
    button.setAttribute("aria-label", `Share — ${shareCount}`);

    const sharedValue = button.dataset.share || "";
    const url = /^https?:\/\//i.test(sharedValue) ? sharedValue : location.href;
    const data = { title: document.title, text: document.title, url };

    try {
      if (navigator.share) await navigator.share(data);
      else if (navigator.clipboard) await navigator.clipboard.writeText(url);
    } catch {
      // Sharing can be dismissed without affecting the counter.
    }
  });
});

const settingsButtons = [...document.querySelectorAll("[data-settings]")];

settingsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const requestedId = button.dataset.settings || button.getAttribute("aria-controls");
    let dialog = requestedId
      ? document.getElementById(requestedId)
      : document.querySelector("[data-settings-dialog]");

    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.setAttribute("data-settings-dialog", "");
      dialog.setAttribute("aria-label", "Display settings");
      dialog.style.cssText =
        "max-width:min(90vw,32rem);border:1px solid rgba(221,235,255,.2);background:#050505;color:#f7f8fa;padding:2rem;";

      const heading = document.createElement("h2");
      heading.textContent = "Display settings";
      const copy = document.createElement("p");
      copy.textContent = "Motion follows your system preference. Contrast and pacing remain tuned to your device.";
      const close = document.createElement("button");
      close.type = "button";
      close.textContent = "Close";
      close.setAttribute("data-dialog-close", "");

      dialog.append(heading, copy, close);
      document.body.append(dialog);
      knownDialogs.add(dialog);
      attachDialogEvents(dialog);
    }

    openDialog(dialog, button);
  });
});
