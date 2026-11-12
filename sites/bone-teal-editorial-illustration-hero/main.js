// file: main.js
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function animate(element, keyframes, options) {
  if (!element || typeof element.animate !== "function") return null;
  return element.animate(keyframes, { fill: "backwards", easing: EASE, ...options });
}

document.addEventListener("click", (event) => {
  const anchor = event.target.closest?.('a[href^="#"]');
  if (!anchor || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const href = anchor.getAttribute("href");
  if (!href || href === "#") return;
  const target = document.getElementById(decodeURIComponent(href.slice(1)));
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({
    behavior: motionQuery.matches ? "auto" : "smooth",
    block: "start"
  });
  try {
    history.pushState(null, "", href);
  } catch {
    location.hash = href;
  }
});

const heroTitle = qs(".hero__title");
const heroArtifact = qs(".hero__artifact");
const heroManifesto = qs(".hero__manifesto");

if (!motionQuery.matches) {
  animate(heroTitle, [
    { opacity: 0, clipPath: "inset(0 100% 0 0)", transform: "translateX(-0.08em)" },
    { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "translateX(0)" }
  ], { duration: 850 });

  animate(heroArtifact, [
    { opacity: 0, transform: "translateY(18px)" },
    { opacity: 1, transform: "translateY(0)" }
  ], { duration: 650, delay: 110 });

  animate(heroManifesto, [
    { opacity: 0, transform: "translateY(10px)" },
    { opacity: 1, transform: "translateY(0)" }
  ], { duration: 500, delay: 300 });

  qsa(".hero__facet").forEach((facet, index) => {
    animate(facet, [
      { opacity: 0, clipPath: "inset(35% 35% 35% 35%)" },
      { opacity: 1, clipPath: "inset(0 0 0 0)" }
    ], { duration: 620, delay: 220 + index * 70 });
  });
}

const revealNodes = qsa(
  ".section-intro, .scale-card, .production-header, .production-card, " +
  ".custom-section__head, .custom-detail, .lead-times, .custom-cta"
);
let revealObserver;

function clearRevealStyles() {
  revealNodes.forEach((node) => {
    node.style.removeProperty("opacity");
    node.style.removeProperty("transform");
    node.style.removeProperty("will-change");
  });
}

if (!motionQuery.matches && "IntersectionObserver" in window) {
  const groupCounts = new WeakMap();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const parent = node.parentElement;
      const order = groupCounts.get(parent) || 0;
      groupCounts.set(parent, order + 1);
      revealObserver.unobserve(node);

      const animation = animate(node, [
        { opacity: 0, transform: "translateY(18px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 620, delay: Math.min(order * 55, 220) });

      if (animation) {
        animation.onfinish = () => {
          node.style.removeProperty("opacity");
          node.style.removeProperty("transform");
          node.style.removeProperty("will-change");
        };
      } else {
        clearRevealStyles();
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  revealNodes.forEach((node) => {
    node.style.opacity = "0";
    node.style.transform = "translateY(18px)";
    node.style.willChange = "opacity, transform";
    revealObserver.observe(node);
  });
}

let parallaxFrame = 0;
function renderParallax() {
  parallaxFrame = 0;
  if (!heroArtifact) return;
  const offset = motionQuery.matches ? 0 : Math.max(-7, -window.scrollY * 0.018);
  heroArtifact.style.translate = `0 ${offset}px`;
}

window.addEventListener("scroll", () => {
  if (!parallaxFrame) parallaxFrame = requestAnimationFrame(renderParallax);
}, { passive: true });

motionQuery.addEventListener?.("change", (event) => {
  if (!event.matches) return;
  revealObserver?.disconnect();
  clearRevealStyles();
  if (heroArtifact) heroArtifact.style.translate = "0 0";
});

const dialogTriggers = new WeakMap();
const wiredDialogs = new WeakSet();
let activeDialog = null;
let savedBodyOverflow = "";

function getFocusable(dialog) {
  return qsa(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
    'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    dialog
  ).filter((element) => element.getClientRects().length > 0);
}

function findCloseControl(target) {
  const control = target.closest?.(
    '[data-dialog-close], [data-close-dialog], [data-modal-close], ' +
    '[aria-label*="close" i], [aria-label*="dismiss" i]'
  );
  if (control) return control;

  const button = target.closest?.("button");
  if (button && /^(close|dismiss|×|✕)$/i.test(button.textContent.trim())) return button;
  return null;
}

function cleanupDialog(dialog) {
  const trigger = dialogTriggers.get(dialog);
  if (trigger) {
    trigger.setAttribute("aria-expanded", "false");
    const card = trigger.closest(".scale-card");
    if (card) {
      card.style.removeProperty("outline");
      card.style.removeProperty("outline-offset");
    }
  }

  if (activeDialog === dialog) {
    document.body.style.overflow = savedBodyOverflow;
    activeDialog = null;
  }
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function" && dialog.open) {
    try {
      dialog.close();
    } catch {
      dialog.removeAttribute("open");
      dialog.hidden = true;
    }
  } else {
    dialog.removeAttribute("open");
    dialog.hidden = true;
  }
  dialog.removeAttribute("data-open");
  cleanupDialog(dialog);
}

function wireDialog(dialog) {
  if (wiredDialogs.has(dialog)) return;
  wiredDialogs.add(dialog);

  dialog.addEventListener("click", (event) => {
    const closeControl = findCloseControl(event.target);
    if (closeControl && dialog.contains(closeControl)) {
      event.preventDefault();
      closeDialog(dialog);
      return;
    }
    if (event.target === dialog) closeDialog(dialog);
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
  dialog.addEventListener("close", () => cleanupDialog(dialog));
}

function openDialog(trigger) {
  const id = trigger.dataset.dialogTarget;
  const dialog = document.getElementById(id);
  if (!dialog) return;
  if (activeDialog === dialog) return;
  if (activeDialog) closeDialog(activeDialog);

  dialogTriggers.set(dialog, trigger);
  wireDialog(dialog);
  dialog.hidden = false;

  if (typeof dialog.showModal === "function") {
    try {
      if (dialog.open) dialog.close();
      dialog.showModal();
    } catch {
      dialog.setAttribute("open", "");
    }
  } else {
    dialog.setAttribute("open", "");
  }

  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("data-open", "true");
  if (!dialog.hasAttribute("tabindex")) dialog.setAttribute("tabindex", "-1");

  const accent = trigger.dataset.accent || getComputedStyle(trigger).getPropertyValue("--accent").trim();
  if (accent) dialog.style.setProperty("--accent", accent);

  if (!activeDialog) savedBodyOverflow = document.body.style.overflow;
  activeDialog = dialog;
  document.body.style.overflow = "hidden";
  trigger.setAttribute("aria-expanded", "true");

  const card = trigger.closest(".scale-card");
  if (card) {
    card.style.outline = `1px solid ${accent || "#00d5ff"}`;
    card.style.outlineOffset = "5px";
  }

  requestAnimationFrame(() => {
    const target = qs("[autofocus]", dialog) || getFocusable(dialog)[0] || dialog;
    target.focus({ preventScroll: true });
  });
}

qsa("[data-dialog-target]").forEach((trigger) => {
  trigger.setAttribute("aria-expanded", "false");
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openDialog(trigger);
  });
});

document.addEventListener("keydown", (event) => {
  if (!activeDialog) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeDialog(activeDialog);
    return;
  }
  if (event.key !== "Tab") return;

  const focusable = getFocusable(activeDialog);
  if (!focusable.length) {
    event.preventDefault();
    activeDialog.focus();
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
