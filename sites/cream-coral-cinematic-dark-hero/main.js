// file: main.js
"use strict";

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

const scaleTriggers = [...document.querySelectorAll(".scale-trigger")];
const railDots = [...document.querySelectorAll(".scale-rail-dot")];
const modalIds = new Set(
  [...document.querySelectorAll("[data-open-modal]")]
    .map((trigger) => trigger.dataset.openModal)
    .filter(Boolean)
);

let activeModal = null;
let activeTrigger = null;
let fallbackDialog = null;
let closeTimer = 0;
let previousBodyOverflow = "";

function prepareModal(modal) {
  if (!modal || modal.dataset.prepared === "true") return;
  modal.dataset.prepared = "true";
  modal.setAttribute("aria-hidden", "true");

  const closeButton = [...modal.querySelectorAll("button")].find((button) => {
    const label = `${button.getAttribute("aria-label") || ""} ${button.textContent || ""}`.toLowerCase();
    return /close|dismiss|×|✕/.test(label);
  });

  if (closeButton) {
    closeButton.setAttribute("data-close-modal", "");
  } else {
    const fallbackClose = document.createElement("button");
    fallbackClose.type = "button";
    fallbackClose.setAttribute("aria-label", "Close dialog");
    fallbackClose.setAttribute("data-close-modal", "");
    fallbackClose.textContent = "×";
    Object.assign(fallbackClose.style, {
      position: "fixed",
      top: "1rem",
      right: "1rem",
      zIndex: "1002",
      width: "2.75rem",
      height: "2.75rem",
      color: "#f2f0ee",
      background: "#101225",
      border: "1px solid #e7194d",
      fontSize: "1.25rem",
      cursor: "pointer"
    });
    modal.appendChild(fallbackClose);
  }
}

function buildFallbackDialog() {
  const dialog = document.createElement("dialog");
  dialog.id = "quacktory-fallback-dialog";
  dialog.setAttribute("aria-labelledby", "quacktory-fallback-title");

  Object.assign(dialog.style, {
    width: "min(92vw, 36rem)",
    maxHeight: "85vh",
    margin: "auto",
    padding: "0",
    color: "#f2f0ee",
    background: "#101225",
    border: "1px solid rgba(231,25,77,.85)",
    boxShadow: "0 30px 100px rgba(0,0,0,.6), 0 0 45px rgba(231,25,77,.18)"
  });

  const style = document.createElement("style");
  style.textContent = "#quacktory-fallback-dialog::backdrop{background:rgba(4,6,16,.82);backdrop-filter:blur(8px);}";

  const frame = document.createElement("div");
  Object.assign(frame.style, {
    position: "relative",
    display: "grid",
    gap: "1rem",
    padding: "clamp(2rem, 6vw, 3.5rem)"
  });

  const kicker = document.createElement("p");
  kicker.textContent = "Product range";
  Object.assign(kicker.style, {
    margin: "0",
    color: "#e7194d",
    fontSize: ".68rem",
    letterSpacing: ".18em",
    textTransform: "uppercase"
  });

  const title = document.createElement("h2");
  title.id = "quacktory-fallback-title";
  Object.assign(title.style, {
    margin: "0",
    fontSize: "clamp(1.7rem, 6vw, 3rem)",
    fontWeight: "400",
    lineHeight: "1.15"
  });

  const meta = document.createElement("p");
  Object.assign(meta.style, {
    margin: "0",
    color: "#c6c6cf",
    fontSize: ".75rem",
    letterSpacing: ".1em",
    textTransform: "uppercase"
  });

  const copy = document.createElement("p");
  Object.assign(copy.style, {
    margin: ".5rem 0 0",
    color: "#c6c6cf",
    lineHeight: "1.8"
  });

  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "Close dialog");
  close.setAttribute("data-close-modal", "");
  close.textContent = "×";
  Object.assign(close.style, {
    position: "absolute",
    top: ".8rem",
    right: ".8rem",
    width: "2.5rem",
    height: "2.5rem",
    color: "#f2f0ee",
    background: "transparent",
    border: "1px solid #e7194d",
    cursor: "pointer"
  });

  frame.append(kicker, title, meta, copy, close);
  dialog.appendChild(frame);
  document.head.appendChild(style);
  document.body.appendChild(dialog);
  return dialog;
}

function populateFallback(dialog, trigger) {
  const item = trigger.closest(".scale-item");
  const read = (selector) =>
    item?.querySelector(selector)?.textContent.replace(/\s+/g, " ").trim() || "";

  const name = read(".scale-name") || "Quacktory duck";
  const size = read(".scale-size");
  const comparison = read(".scale-comparison");
  const audience = read(".scale-audience");
  const price = read(".scale-price-value");
  const lead = read(".scale-lead");

  dialog.querySelector("#quacktory-fallback-title").textContent =
    size ? `${name} / ${size}` : name;
  dialog.querySelector("p + h2 + p").textContent =
    [comparison, audience].filter(Boolean).join(" · ") || "Quacktory product range";
  dialog.querySelector("p + h2 + p + p").textContent =
    `A ${name.toLowerCase()} Quacktory duck${audience ? ` for ${audience}` : ""}.` +
    `${price ? ` Price positioning: ${price}.` : ""}${lead ? ` Estimated lead time: ${lead}.` : ""}`;
}

function syncRail(targetId) {
  railDots.forEach((dot) => {
    const active = dot.dataset.openModal === targetId;
    dot.setAttribute("aria-pressed", String(active));
    dot.style.opacity = active ? "1" : ".48";
    dot.style.transform = active ? "scale(1.55)" : "scale(1)";
    dot.style.background = active ? "var(--accent)" : "";
    dot.style.boxShadow = active ? "0 0 1rem rgba(231,25,77,.7)" : "";
  });
}

function openModal(trigger) {
  const targetId = trigger.dataset.openModal;
  let modal = document.getElementById(targetId);

  if (!modal) {
    fallbackDialog ||= buildFallbackDialog();
    modal = fallbackDialog;
    populateFallback(modal, trigger);
  } else {
    prepareModal(modal);
  }

  if (activeModal && activeModal !== modal) closeModal(activeModal, false);
  if (!activeModal) previousBodyOverflow = document.body.style.overflow;

  activeModal = modal;
  activeTrigger = trigger;
  syncRail(targetId);
  modal.setAttribute("aria-hidden", "false");
  modal.removeAttribute("inert");
  modal.hidden = false;
  modal.removeAttribute("hidden");
  document.body.style.overflow = "hidden";

  if (modal instanceof HTMLDialogElement) {
    if (!modal.open) modal.showModal();
  } else {
    clearTimeout(closeTimer);
    const display = getComputedStyle(modal).display;
    modal.style.setProperty("display", display === "none" ? "grid" : display, "important");
    modal.style.setProperty("opacity", "1", "important");
    modal.style.setProperty("visibility", "visible", "important");
    modal.style.setProperty("pointer-events", "auto", "important");
    modal.style.setProperty("z-index", "1000", "important");
  }

  trigger.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => {
    const focusTarget = modal.querySelector("[data-close-modal]") ||
      modal.querySelector(focusableSelector);
    focusTarget?.focus({ preventScroll: true });
  });
}

function closeModal(modal = activeModal, restoreFocus = true) {
  if (!modal || activeModal !== modal) return;

  const returnTarget = activeTrigger;
  activeModal = null;
  activeTrigger = null;
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = previousBodyOverflow;

  if (modal instanceof HTMLDialogElement) {
    if (modal.open) modal.close();
  } else {
    modal.style.setProperty("opacity", "0", "important");
    modal.style.setProperty("pointer-events", "none", "important");
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      modal.hidden = true;
    }, motionQuery.matches ? 0 : 260);
  }

  returnTarget?.setAttribute("aria-expanded", "false");
  if (restoreFocus && returnTarget?.isConnected) {
    requestAnimationFrame(() => returnTarget.focus({ preventScroll: true }));
  }
}

modalIds.forEach((id) => prepareModal(document.getElementById(id)));

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-open-modal]");
  if (trigger) {
    event.preventDefault();
    openModal(trigger);
    return;
  }

  const closeButton = event.target.closest("[data-close-modal], [data-modal-close]");
  if (closeButton && activeModal?.contains(closeButton)) {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.target.closest("[data-modal-backdrop]")) {
    closeModal();
    return;
  }

  if (activeModal && event.target === activeModal) {
    closeModal();
    return;
  }

  const anchor = event.target.closest("a[href^='#']");
  if (!anchor) return;

  const hash = anchor.getAttribute("href");
  if (!hash || hash === "#") return;
  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  event.preventDefault();
  if (activeModal) closeModal(activeModal, false);
  target.scrollIntoView({
    behavior: motionQuery.matches ? "auto" : "smooth",
    block: "start"
  });
  try {
    history.pushState(null, "", hash);
  } catch {
    location.hash = hash;
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
  const focusable = [...activeModal.querySelectorAll(focusableSelector)]
    .filter((element) => element.getClientRects().length);

  if (!focusable.length) {
    activeModal.setAttribute("tabindex", "-1");
    activeModal.focus();
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

const rail = document.querySelector(".scale-rail");
if (rail && railDots.length) {
  rail.removeAttribute("aria-hidden");
  rail.setAttribute("role", "group");
  rail.setAttribute("aria-label", "Product range shortcuts");

  railDots.forEach((dot, index) => {
    const trigger = scaleTriggers[index];
    if (!trigger) return;

    const name = trigger.querySelector(".scale-name")?.textContent.trim() || `Product ${index + 1}`;
    dot.dataset.openModal = trigger.dataset.openModal;
    dot.setAttribute("role", "button");
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("aria-label", `Open ${name} details`);
    dot.setAttribute("aria-pressed", "false");
    dot.title = `${name} — open details`;
    dot.style.cursor = "pointer";
    dot.style.transition = "opacity 260ms ease, transform 260ms ease, background 260ms ease";

    dot.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        trigger.click();
      }
    });
  });
}

function reveal(element, delay = 0, clip = false) {
  if (!element || motionQuery.matches || !element.animate) return;
  const from = { opacity: 0, transform: "translateY(18px)" };
  const to = { opacity: 1, transform: "translateY(0)" };
  if (clip) {
    from.clipPath = "inset(0 0 100% 0)";
    to.clipPath = "inset(0 0 0 0)";
  }
  element.animate([from, to], {
    duration: 800,
    delay,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "both"
  });
}

reveal(document.querySelector(".hero-kicker"), 0);
document.querySelectorAll(".hero-title-line").forEach((element, index) => {
  reveal(element, 100 + index * 80, true);
});
document.querySelectorAll(".hero-manifesto-line").forEach((element, index) => {
  reveal(element, 250 + index * 50);
});
reveal(document.querySelector(".hero-visual"), 390);
reveal(document.querySelector(".hero-cta"), 540);

const halo = document.querySelector(".hero-halo");
if (halo?.animate && !motionQuery.matches) {
  halo.animate(
    [
      { opacity: ".72", transform: "scale(.985)" },
      { opacity: "1", transform: "scale(1.015)" },
      { opacity: ".72", transform: "scale(.985)" }
    ],
    { duration: 7000, iterations: Infinity, easing: "ease-in-out" }
  );
}

const scrollTargets = document.querySelectorAll(
  ".section-heading, .scale-item, .production-ledger, .production-materials, .custom-copy, .custom-spectrum"
);

if ("IntersectionObserver" in window && !motionQuery.matches) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const siblings = element.parentElement ? [...element.parentElement.children] : [];
      const delay = element.classList.contains("scale-item")
        ? Math.max(0, siblings.indexOf(element)) * 70
        : 0;

      element.style.opacity = "0";
      element.style.transform = "translateY(18px)";
      const animation = element.animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration: 780,
          delay,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both"
        }
      );

      animation.finished.then(() => {
        animation.cancel();
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
      }).catch(() => {});

      instance.unobserve(element);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

  scrollTargets.forEach((element) => observer.observe(element));
} else {
  scrollTargets.forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("transform");
  });
}
