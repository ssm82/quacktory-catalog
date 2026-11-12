// file: main.js

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const wiredModals = new WeakSet();
let activeModal = null;
let activeTrigger = null;
let bodyOverflow = "";

const classText = (element) => Array.from(element?.classList || []).join(" ");
const textOf = (root, selector) => root?.querySelector(selector)?.textContent.trim() || "";

function createModal(id) {
  const modal = document.createElement("div");
  const safeId = id.replace(/[^a-z0-9_-]/gi, "-");
  const titleId = `${safeId}-title`;
  const panel = document.createElement("article");
  const title = document.createElement("h2");
  const description = document.createElement("p");
  const close = document.createElement("button");

  modal.id = id;
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", titleId);
  modal.style.cssText = "position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(5,7,17,.82);backdrop-filter:blur(18px);opacity:0;visibility:hidden;pointer-events:none";

  panel.style.cssText = "position:relative;width:min(620px,100%);max-height:86vh;overflow:auto;padding:clamp(24px,5vw,52px);background:#0b0d20;border:1px solid rgba(168,184,255,.3);color:#e2e3ec";
  title.id = titleId;
  title.dataset.modalTitle = "";
  title.style.cssText = "margin:0 0 18px;font-size:clamp(24px,4vw,44px);font-weight:400;letter-spacing:.08em;text-transform:uppercase";
  description.dataset.modalDescription = "";
  description.style.cssText = "margin:0;color:#a8abb8;line-height:1.8";
  close.type = "button";
  close.dataset.close = "";
  close.textContent = "Close";
  close.style.cssText = "margin-top:32px;padding:10px 16px;border:1px solid rgba(168,184,255,.35);background:transparent;color:#e2e3ec;font-size:10px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer";

  panel.append(title, description, close);
  modal.append(panel);
  document.body.append(modal);
  return modal;
}

function findPanel(modal) {
  for (const child of modal.children) {
    if (/panel|dialog|content|card/i.test(classText(child))) return child;
  }
  const semanticPanel = modal.querySelector('[role="dialog"], [aria-modal="true"]');
  return semanticPanel && semanticPanel !== modal ? semanticPanel : modal;
}

function closeButtons(modal) {
  return Array.from(modal.querySelectorAll("button, [data-close]")).filter((element) => {
    if (element.hasAttribute("data-close")) return true;
    const label = `${element.getAttribute("aria-label") || ""} ${element.getAttribute("title") || ""} ${element.textContent}`;
    return /close|dismiss/i.test(label) || /close|dismiss/i.test(classText(element));
  });
}

function stateToken(modal) {
  return Array.from(modal.classList).find((token) => /^(is-)?(open|active|visible|shown)$/.test(token));
}

function wireModal(modal) {
  if (wiredModals.has(modal)) return;
  wiredModals.add(modal);

  closeButtons(modal).forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      closeModal(modal);
    });
  });

  const overlay = Array.from(modal.children).find((child) => /overlay|backdrop/i.test(classText(child)));
  overlay?.addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });

  if (modal.tagName === "DIALOG") {
    modal.addEventListener("close", () => {
      if (activeModal === modal) closeModal(modal, true, true);
    });
  }
}

function applyModalData(modal, trigger) {
  const sku = trigger.closest(".sku-cell");
  const custom = trigger.closest(".custom-copy");
  const title = textOf(sku, ".sku-name") || textOf(trigger, ".outline-label") || trigger.getAttribute("aria-label") || trigger.textContent.trim().split("\n")[0] || "Quacktory detail";
  const size = textOf(sku, ".sku-size");
  const context = textOf(sku, ".sku-context");
  const customCopy = custom
    ? Array.from(custom.querySelectorAll(".custom-text")).map((element) => element.textContent.trim()).join(" ")
    : "";
  const description = trigger.dataset.description || textOf(sku, ".sku-meta") || customCopy || context || "An interactive piece from the Quacktory collection.";
  const glow = sku?.querySelector(".sku-glow");
  const rootAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#a8b8ff";
  const accent = glow ? getComputedStyle(glow).backgroundColor : rootAccent;

  modal.dataset.title = title;
  modal.dataset.description = description;
  modal.dataset.size = size;
  modal.dataset.context = context;
  modal.dataset.accent = accent;
  modal.style.setProperty("--modal-accent", accent);
  modal.style.setProperty("--accent", accent);

  const fields = { title, description, size, context };
  Object.entries(fields).forEach(([field, value]) => {
    const target = modal.querySelector(`[data-modal-${field}]`);
    if (target) target.textContent = value;
  });

  const panel = findPanel(modal);
  const heading = panel.querySelector("h1, h2, h3");
  if (heading && !heading.textContent.trim()) heading.textContent = title;
  const paragraph = panel.querySelector("p");
  if (paragraph && !paragraph.textContent.trim()) paragraph.textContent = description;
}

function openModal(modal, trigger) {
  if (!modal) return;
  if (activeModal && activeModal !== modal) closeModal(activeModal, false, true);
  wireModal(modal);
  applyModalData(modal, trigger);

  if (!activeModal) bodyOverflow = document.body.style.overflow;
  activeModal = modal;
  activeTrigger = trigger;
  document.body.style.overflow = "hidden";
  trigger.setAttribute("aria-expanded", "true");
  trigger.setAttribute("aria-haspopup", "dialog");

  const token = stateToken(modal);
  if (token) modal.classList.add(token);
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  modal.style.visibility = "visible";
  modal.style.pointerEvents = "auto";
  modal.style.display = "flex";
  modal.style.opacity = "0";

  if (modal.tagName === "DIALOG" && !modal.open) modal.showModal();

  const panel = findPanel(modal);
  panel.style.transition = "opacity 320ms cubic-bezier(.22,1,.36,1), translate 320ms cubic-bezier(.22,1,.36,1)";
  panel.style.opacity = "0";
  panel.style.translate = "0 12px";

  requestAnimationFrame(() => {
    modal.style.opacity = "1";
    panel.style.opacity = "1";
    panel.style.translate = "0 0";
  });

  window.setTimeout(() => {
    const button = closeButtons(modal)[0];
    if (button) button.focus({ preventScroll: true });
    else {
      panel.tabIndex = -1;
      panel.focus({ preventScroll: true });
    }
  }, motionQuery.matches ? 0 : 80);
}

function closeModal(modal = activeModal, restoreFocus = true, immediate = false) {
  if (!modal) return;
  const wasActive = activeModal === modal;
  const trigger = activeTrigger;
  const panel = findPanel(modal);
  const token = stateToken(modal);
  if (token) modal.classList.remove(token);

  panel.style.opacity = "0";
  panel.style.translate = "0 10px";
  modal.style.opacity = "0";
  modal.setAttribute("aria-hidden", "true");
  trigger?.setAttribute("aria-expanded", "false");

  if (modal.tagName === "DIALOG") {
    if (modal.open) modal.close();
  } else {
    window.clearTimeout(modal.closeTimer);
    if (immediate || motionQuery.matches) {
      modal.hidden = true;
      modal.style.visibility = "hidden";
      modal.style.pointerEvents = "none";
    } else {
      modal.closeTimer = window.setTimeout(() => {
        modal.hidden = true;
        modal.style.visibility = "hidden";
        modal.style.pointerEvents = "none";
      }, 280);
    }
  }

  if (wasActive) {
    activeModal = null;
    activeTrigger = null;
    document.body.style.overflow = bodyOverflow;
  }

  if (restoreFocus && trigger) {
    window.setTimeout(() => trigger.focus({ preventScroll: true }), motionQuery.matches ? 0 : 60);
  }
}

document.querySelectorAll("[data-modal]").forEach((trigger) => {
  trigger.setAttribute("aria-controls", trigger.dataset.modal.replace(/^#/, ""));
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const id = trigger.dataset.modal.replace(/^#/, "");
    openModal(createModal(id), trigger);
    const group = trigger.closest(".scale-ladder");
    if (group) {
      group.querySelectorAll(".sku-trigger").forEach((node) => {
        node.setAttribute("aria-pressed", String(node === trigger));
      });
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (!activeModal) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeModal(activeModal);
    return;
  }
  if (event.key !== "Tab") return;

  const focusable = Array.from(activeModal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => element.offsetParent !== null);
  if (!focusable.length) return;
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

let scrollFrame = 0;
let scrollBehaviorBefore = "";
function stopCustomScroll() {
  cancelAnimationFrame(scrollFrame);
  document.documentElement.style.scrollBehavior = scrollBehaviorBefore;
}

function smoothScrollTo(target) {
  const root = document.documentElement;
  const start = window.scrollY;
  const destination = Math.max(0, target.getBoundingClientRect().top + start - 72);
  const distance = destination - start;

  stopCustomScroll();
  if (motionQuery.matches || Math.abs(distance) < 2) {
    window.scrollTo(0, destination);
    return 0;
  }

  scrollBehaviorBefore = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  const duration = Math.min(900, Math.max(380, Math.abs(distance) * 0.55));
  const started = performance.now();

  const frame = (now) => {
    const progress = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - progress, 4);
    window.scrollTo(0, start + distance * eased);
    if (progress < 1) scrollFrame = requestAnimationFrame(frame);
    else stopCustomScroll();
  };
  scrollFrame = requestAnimationFrame(frame);
  return duration;
}

document.addEventListener("click", (event) => {
  const anchor = event.target.closest?.('a[href^="#"]');
  if (!anchor || anchor.hasAttribute("data-modal") || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const id = decodeURIComponent(anchor.getAttribute("href").slice(1));
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  event.preventDefault();
  const duration = smoothScrollTo(target);
  try { history.replaceState(null, "", `#${id}`); } catch {}
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  window.setTimeout(() => target.focus({ preventScroll: true }), duration + 30);
});

const revealTargets = document.querySelectorAll(".section-heading, .sku-cell, .production-card, .qc-item, .spec-block, .custom-copy, .leadtime-panel");
if ("IntersectionObserver" in window && !motionQuery.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.revealed) return;
      entry.target.dataset.revealed = "true";
      entry.target.style.transition = "opacity 700ms var(--ease), translate 700ms var(--ease)";
      entry.target.style.transitionDelay = `${Math.min(180, Number(entry.target.dataset.revealIndex || 0) * 55)}ms`;
      entry.target.style.opacity = "1";
      entry.target.style.translate = "0 0";
      window.setTimeout(() => { entry.target.style.transitionDelay = "0ms"; }, 900);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6%" });

  revealTargets.forEach((target, index) => {
    target.dataset.revealIndex = String(index % 4);
    target.style.opacity = "0";
    target.style.translate = "0 18px";
    observer.observe(target);
  });
}

const hero = document.querySelector(".hero");
if (hero && !motionQuery.matches) {
  const intro = [hero.querySelector(".hero-eyebrow"), ...hero.querySelectorAll(".hero-line"), hero.querySelector(".outline-button")].filter(Boolean);
  intro.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.translate = "0 16px";
    element.style.transition = "opacity 700ms var(--ease), translate 700ms var(--ease)";
    window.setTimeout(() => {
      element.style.opacity = "1";
      element.style.translate = "0 0";
    }, 90 + index * 90);
  });
}

const allControls = () => Array.from(document.querySelectorAll("button, a"));
const controlText = (control) => `${control.textContent} ${control.getAttribute("aria-label") || ""} ${control.getAttribute("title") || ""} ${control.dataset.share || ""}`;
const footer = document.querySelector("footer");
let footerGroup = null;
const getFooterGroup = () => {
  if (!footer) return null;
  if (!footerGroup) {
    footerGroup = document.createElement("div");
    footerGroup.style.cssText = "display:flex;gap:12px;align-items:center;flex-wrap:wrap";
    footer.append(footerGroup);
  }
  return footerGroup;
};

let shareControls = allControls().filter((control) => /share|copy link|native share/i.test(controlText(control)));
let settingsControls = allControls().filter((control) => /settings|preferences|display options/i.test(controlText(control)));

if (!shareControls.length && footer) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "outline-button";
  button.textContent = "Share this page";
  getFooterGroup()?.append(button);
  shareControls = [button];
}

if (!settingsControls.length && footer) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "outline-button";
  button.textContent = "Display settings";
  getFooterGroup()?.append(button);
  settingsControls = [button];
}

const SHARE_LIMIT = 999;
const SHARE_KEY = "quacktory-share-count";
let shareCount = 0;
try { shareCount = Math.min(SHARE_LIMIT, Number(localStorage.getItem(SHARE_KEY)) || 0); } catch {}

const counterNodes = new WeakMap();
function shareCounter(control) {
  if (counterNodes.has(control)) return counterNodes.get(control);
  let counter = control.querySelector("[data-share-count]");
  if (!counter && control.parentElement) {
    counter = control.parentElement.querySelector("[data-share-count]");
    if (!counter) {
      counter = Array.from(control.parentElement.querySelectorAll("*")).find((element) => /share.*count|count.*share/.test(classText(element)) && element !== control);
    }
  }
  if (!counter) {
    counter = document.createElement("span");
    counter.dataset.shareCount = "";
    counter.style.cssText = "display:inline-block;margin-left:.65em;font-size:9px;letter-spacing:.14em;text-transform:uppercase;opacity:.68;white-space:nowrap";
    control.append(counter);
  }
  counter.setAttribute("aria-live", "polite");
  counterNodes.set(control, counter);
  return counter;
}

function renderShareCount() {
  shareControls.forEach((control) => {
    const counter = shareCounter(control);
    counter.textContent = shareCount >= SHARE_LIMIT ? `${SHARE_LIMIT} share limit` : `${shareCount} ${shareCount === 1 ? "share" : "shares"}`;
    if (control.tagName === "BUTTON") control.disabled = shareCount >= SHARE_LIMIT;
    control.setAttribute("aria-disabled", String(shareCount >= SHARE_LIMIT));
  });
}

shareControls.forEach((control) => {
  control.addEventListener("click", async (event) => {
    event.preventDefault();
    if (shareCount >= SHARE_LIMIT) return;
    shareCount += 1;
    try { localStorage.setItem(SHARE_KEY, String(shareCount)); } catch {}
    renderShareCount();
    try {
      if (navigator.share) await navigator.share({ title: document.title, url: window.location.href });
      else await navigator.clipboard?.writeText(window.location.href);
    } catch {}
  });
});
renderShareCount();

if (settingsControls.length) {
  const settingsModal = createModal("modal-settings");
  const panel = findPanel(settingsModal);
  const heading = panel.querySelector("h2");
  const paragraph = panel.querySelector("p");
  if (heading) heading.textContent = "Display settings";
  if (paragraph) paragraph.textContent = "Motion follows your device’s reduced-motion preference. Every product detail remains available without animation.";
  settingsControls.forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(settingsModal, control);
    });
  });
}
