// file: main.js
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canAnimate = typeof Element !== "undefined" && typeof Element.prototype.animate === "function";
const body = document.body;
const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");

const setStyles = (element, styles) => {
  Object.entries(styles).forEach(([property, value]) => {
    element.style[property] = value;
  });
};

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

if (canAnimate && hero && !reduceMotion) {
  heroImage?.animate(
    [
      { transform: "scale(1.045)", opacity: 0.82 },
      { transform: "scale(1.02)", opacity: 1 }
    ],
    { duration: 1500, easing: ease, fill: "backwards" }
  );

  document.querySelectorAll(".hero-line").forEach((line, index) => {
    line.animate(
      [
        { clipPath: "inset(0 0 100% 0)", transform: "translateY(24px)", opacity: 0 },
        { clipPath: "inset(0 0 0% 0)", transform: "translateY(0)", opacity: 1 }
      ],
      { duration: 820, delay: 120 + index * 95, easing: ease, fill: "both" }
    );
  });

  [
    [".hero-eyebrow", 80],
    [".hero-manifesto", 520],
    [".hero-actions", 640],
    [".hero-mark", 760],
    [".site-header", 700]
  ].forEach(([selector, delay]) => {
    document.querySelector(selector)?.animate(
      [
        { transform: "translateY(14px)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 }
      ],
      { duration: 650, delay, easing: ease, fill: "both" }
    );
  });
}

const revealSelectors = [
  ".section-intro",
  ".scale-item",
  ".production-header",
  ".technique-title",
  ".technique-item",
  ".production-checks",
  ".eye-note",
  ".care-panel",
  ".compliance-item"
].join(",");

const revealItems = [...document.querySelectorAll(revealSelectors)];

if (canAnimate && revealItems.length && "IntersectionObserver" in window && !reduceMotion) {
  revealItems.forEach((item, index) => {
    item.dataset.revealIndex = String(index % 6);
    item.style.opacity = "0";
    item.style.transform = "translateY(24px)";
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.revealIndex || 0) * 55;
        const animation = entry.target.animate(
          [
            { opacity: 0, transform: "translateY(24px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 720, delay, easing: ease, fill: "both" }
        );
        animation.addEventListener("finish", () => {
          entry.target.style.opacity = "";
          entry.target.style.transform = "";
          animation.cancel();
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const id = decodeURIComponent(hash.slice(1));
    const destination = document.getElementById(id);
    if (!destination) return;

    event.preventDefault();
    destination.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });

    try {
      history.pushState(null, "", hash);
    } catch {
      window.location.hash = hash;
    }
  });
});

if (hero && heroImage && !reduceMotion) {
  let parallaxQueued = false;

  const updateParallax = () => {
    const top = hero.getBoundingClientRect().top;
    const offset = Math.max(0, Math.min(30, -top * 0.075));
    heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.045)`;
    parallaxQueued = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (parallaxQueued) return;
      parallaxQueued = true;
      requestAnimationFrame(updateParallax);
    },
    { passive: true }
  );

  updateParallax();
}

let activeModal = null;
const fallbackModals = new Map();

const accentColors = {
  micro: "#e8d2a0",
  classic: "#6e9147",
  designer: "#f2dfc1",
  mega: "#3c6a35",
  architect: "#ffffff"
};

const readText = (root, selector) => root.querySelector(selector)?.textContent.trim() || "";

const getAccent = (trigger) => {
  const item = trigger.closest(".scale-item");
  const variant = item
    ? [...item.classList].find((name) => name.startsWith("scale-item--"))?.replace("scale-item--", "")
    : "";
  return accentColors[variant] || "#e8d2a0";
};

const isCloseButton = (button) => {
  const labels = [button.getAttribute("aria-label"), button.getAttribute("title"), button.textContent]
    .filter(Boolean)
    .join(" ");
  return /close|dismiss|×|✕|✖/i.test(labels) ||
    [...button.classList].some((name) => /close|dismiss/i.test(name));
};

const findPanel = (target) => {
  if (target.getAttribute("role") === "dialog") return target;
  const rolePanel = target.querySelector('[role="dialog"]');
  if (rolePanel) return rolePanel;

  for (const child of target.children) {
    const buttons = [...child.querySelectorAll("button")];
    if (buttons.some(isCloseButton)) return child;
  }
  return null;
};

const createFallbackModal = (trigger, id) => {
  const overlay = document.createElement("div");
  overlay.id = id;
  overlay.setAttribute("role", "presentation");
  setStyles(overlay, {
    position: "fixed",
    inset: "0",
    zIndex: "1000",
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    overflowY: "auto",
    padding: "clamp(16px, 4vw, 48px)",
    background: "rgba(23, 44, 29, 0.76)"
  });

  const panel = document.createElement("section");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", `${id}-title`);
  setStyles(panel, {
    width: "min(640px, 100%)",
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
    padding: "clamp(24px, 5vw, 44px)",
    color: "#172c1d",
    background: "#f2dfc1",
    borderTop: `4px solid ${getAccent(trigger)}`,
    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)"
  });

  const title = document.createElement("h2");
  title.id = `${id}-title`;
  title.textContent = readText(trigger, ".product-line") || trigger.getAttribute("aria-label") || "Quacktory";
  title.style.cssText = "margin:0 0 12px;font-size:clamp(32px,6vw,64px);line-height:.95;text-transform:uppercase;";

  const description = document.createElement("p");
  description.textContent = readText(trigger, ".product-audience") || "Part of the Quacktory size ladder.";
  description.style.cssText = "margin:0 0 24px;font-size:16px;line-height:1.6;";

  const details = [
    [".product-size", "Size"],
    [".product-lead", "Lead time"],
    [".price-value", "Price"]
  ];
  const list = document.createElement("dl");
  list.style.cssText = "display:grid;grid-template-columns:auto 1fr;gap:10px 24px;margin:0;";

  details.forEach(([selector, label]) => {
    const value = readText(trigger, selector);
    if (!value) return;
    const term = document.createElement("dt");
    const descriptionValue = document.createElement("dd");
    term.textContent = label;
    descriptionValue.textContent = value;
    term.style.cssText = "font-size:10px;letter-spacing:.16em;text-transform:uppercase;";
    descriptionValue.style.cssText = "margin:0;font-weight:500;";
    list.append(term, descriptionValue);
  });

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Close modal");
  setStyles(close, {
    position: "absolute",
    top: "14px",
    right: "14px",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "1px solid rgba(23,44,29,.35)",
    background: "transparent",
    color: "inherit",
    fontSize: "26px",
    cursor: "pointer"
  });

  panel.append(close, title, description, list);
  overlay.appendChild(panel);
  body.appendChild(overlay);
  fallbackModals.set(id, overlay);
  return overlay;
};

const openModal = (trigger) => {
  const id = trigger.dataset.modalTarget;
  if (!id) return;

  if (activeModal) closeModal(false);

  let target = document.getElementById(id);
  const generated = !target;
  if (!target) target = createFallbackModal(trigger, id);

  const original = {
    style: target.getAttribute("style"),
    hidden: target.hidden,
    ariaHidden: target.getAttribute("aria-hidden"),
    tabindex: target.getAttribute("tabindex"),
    parent: target.parentNode,
    next: target.nextSibling
  };

  const panel = findPanel(target);
  const panelOriginalStyle = panel?.getAttribute("style") ?? null;
  const panelOriginalAriaModal = panel?.getAttribute("aria-modal") ?? null;
  let wrapper = null;

  if (target.getAttribute("role") === "dialog") {
    wrapper = document.createElement("div");
    setStyles(wrapper, {
      position: "fixed",
      inset: "0",
      zIndex: "1000",
      display: "grid",
      alignItems: "center",
      justifyItems: "center",
      overflowY: "auto",
      padding: "24px",
      background: "rgba(23, 44, 29, 0.76)"
    });
    original.parent?.insertBefore(wrapper, target);
    wrapper.appendChild(target);
    setStyles(target, {
      position: "relative",
      inset: "auto",
      zIndex: "1",
      display: "block",
      width: "min(640px, 100%)",
      maxHeight: "calc(100vh - 48px)",
      overflowY: "auto",
      padding: "32px",
      color: "#172c1d",
      background: "#f2dfc1",
      opacity: "1",
      visibility: "visible",
      transform: "none"
    });
  } else {
    setStyles(target, {
      position: "fixed",
      inset: "0",
      zIndex: "1000",
      display: "grid",
      alignItems: "center",
      justifyItems: "center",
      overflowY: "auto",
      padding: "clamp(16px, 4vw, 48px)",
      background: "rgba(23, 44, 29, 0.76)",
      backdropFilter: "blur(8px)",
      opacity: "1",
      visibility: "visible",
      pointerEvents: "auto",
      transform: "none"
    });
  }

  if (panel && panel !== target) {
    panel.style.setProperty("opacity", "1", "important");
    panel.style.setProperty("visibility", "visible", "important");
    panel.style.setProperty("transform", "none", "important");
    panel.style.setProperty("pointer-events", "auto", "important");
    panel.setAttribute("aria-modal", "true");
  }

  target.hidden = false;
  target.setAttribute("aria-hidden", "false");
  target.style.setProperty("--accent", getAccent(trigger));
  if (!target.hasAttribute("tabindex") && !target.querySelector("button, a[href]")) {
    target.setAttribute("tabindex", "-1");
  }

  activeModal = {
    id,
    target,
    panel,
    wrapper,
    trigger,
    generated,
    original,
    panelOriginalStyle,
    panelOriginalAriaModal
  };

  body.classList.add("modal-open");
  trigger.setAttribute("aria-expanded", "true");

  requestAnimationFrame(() => {
    const closeButton = panel
      ? [...panel.querySelectorAll("button")].find(isCloseButton)
      : null;
    (closeButton || panel || target).focus?.({ preventScroll: true });
  });
};

const closeModal = (restoreFocus = true) => {
  if (!activeModal) return;
  const state = activeModal;
  activeModal = null;

  if (state.wrapper) {
    state.original.parent?.insertBefore(state.target, state.original.next);
    state.wrapper.remove();
  }

  if (state.panel && state.panel !== state.target) {
    if (state.panelOriginalStyle === null) state.panel.removeAttribute("style");
    else state.panel.setAttribute("style", state.panelOriginalStyle);

    if (state.panelOriginalAriaModal === null) state.panel.removeAttribute("aria-modal");
    else state.panel.setAttribute("aria-modal", state.panelOriginalAriaModal);
  }

  if (state.generated) {
    state.target.remove();
    fallbackModals.delete(state.id);
  } else {
    if (state.original.style === null) state.target.removeAttribute("style");
    else state.target.setAttribute("style", state.original.style);

    state.target.hidden = state.original.hidden;
    if (state.original.ariaHidden === null) state.target.removeAttribute("aria-hidden");
    else state.target.setAttribute("aria-hidden", state.original.ariaHidden);

    if (state.original.tabindex === null) state.target.removeAttribute("tabindex");
    else state.target.setAttribute("tabindex", state.original.tabindex);
  }

  body.classList.remove("modal-open");
  state.trigger.removeAttribute("aria-expanded");

  if (restoreFocus) state.trigger.focus?.({ preventScroll: true });
};

document.querySelectorAll("[data-modal-target]").forEach((trigger) => {
  const id = trigger.dataset.modalTarget;
  if (!id) return;
  trigger.setAttribute("aria-haspopup", "dialog");
  if (!trigger.hasAttribute("aria-controls")) trigger.setAttribute("aria-controls", id);
});

document.addEventListener("click", (event) => {
  const element = event.target instanceof Element ? event.target : null;
  if (!element) return;

  const trigger = element.closest("[data-modal-target]");
  if (trigger) {
    event.preventDefault();
    openModal(trigger);
    return;
  }

  if (!activeModal) return;
  const { target, panel, wrapper } = activeModal;

  if (target.contains(element)) {
    const explicitClose = element.closest("[data-modal-close], [data-close]");
    const button = element.closest("button");

    if (explicitClose || (button && isCloseButton(button))) {
      closeModal();
      return;
    }

    if (panel && !panel.contains(element)) {
      closeModal();
      return;
    }

    if (element === target) {
      closeModal();
      return;
    }

    if (!panel) {
      let child = element;
      while (child.parentElement && child.parentElement !== target) child = child.parentElement;
      if (
        child.parentElement === target &&
        [...child.classList].some((name) => /backdrop|overlay/i.test(name))
      ) {
        closeModal();
      }
    }
  } else if (wrapper && element === wrapper) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (!activeModal) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key !== "Tab") return;
  const root = activeModal.panel || activeModal.target;
  const focusable = [...root.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((element) => element.getClientRects().length);

  if (!focusable.length) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
    event.preventDefault();
    first.focus();
  }
});
