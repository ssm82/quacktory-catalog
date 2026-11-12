// file: main.js
const PRODUCTS = {
  "modal-micro": {
    title: "Micro",
    number: "01",
    size: "4–8 cm",
    position: "Impulse",
    comparison: "Thumb-sized",
    audience: "Keychains, merch, gifts",
    description: "A pocket-scale duck for keychains, merchandise and gifts, moulded as one precise piece.",
    accent: "#6db7f2",
    image: "./assets/product-micro.jpg"
  },
  "modal-classic": {
    title: "Classic",
    number: "02",
    size: "10–25 cm",
    position: "Mid",
    comparison: "Bathroom-sized",
    audience: "Kids, bathroom, office",
    description: "The familiar bathroom-sized duck, made for children, offices and everyday display.",
    accent: "#0875d1",
    image: "./assets/product-classic.jpg"
  },
  "modal-designer": {
    title: "Designer",
    number: "03",
    size: "15–30 cm",
    position: "Mid+",
    comparison: "Cat-sized",
    audience: "Illustrator collabs, limited runs",
    description: "A cat-sized collector with a sharper point of view, built for illustrator collaborations and limited runs.",
    accent: "#62a9e8",
    image: "./assets/product-designer.jpg"
  },
  "modal-mega": {
    title: "Mega",
    number: "04",
    size: "50–120 cm",
    position: "Premium",
    comparison: "Statement-sized",
    audience: "Photo objects, shop-window displays, statement gifts",
    description: "A statement duck for photo sets, retail windows and gifts that need to be seen across the room.",
    accent: "#2e8ed6",
    image: "./assets/product-mega.jpg"
  },
  "modal-architect": {
    title: "Architect",
    number: "05",
    size: "1.5–3 m",
    position: "Contract",
    comparison: "Bear-sized",
    audience: "Installations, events, weddings, branded spaces",
    description: "A bear-sized installation for events, weddings and branded spaces, built as sculptural hardware.",
    accent: "#7cc0f4",
    image: "./assets/product-architect.jpg"
  }
};

const modalTriggers = [...document.querySelectorAll("[data-modal]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeModal = null;
let activeTrigger = null;
let lastFocused = null;
let fallbackModal = null;
let backdrop = null;
let closeTimer = 0;
let previousBodyOverflow = "";

function createFallbackModal() {
  const dialog = document.createElement("div");
  dialog.id = "quacktory-dialog";
  dialog.hidden = true;
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "quacktory-dialog-title");
  Object.assign(dialog.style, {
    position: "fixed",
    inset: "0",
    zIndex: "10001",
    display: "grid",
    placeItems: "center",
    padding: "clamp(1rem, 4vw, 4rem)",
    overflowY: "auto",
    background: "transparent",
    color: "#f0efed"
  });

  const panel = document.createElement("div");
  panel.setAttribute("data-modal-panel", "");
  Object.assign(panel.style, {
    width: "min(720px, 100%)",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "clamp(1.5rem, 5vw, 4rem)",
    background: "#151515",
    borderTop: "4px solid var(--accent)",
    boxShadow: "0 24px 80px rgba(0,0,0,.55)"
  });

  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("data-modal-close", "");
  close.setAttribute("aria-label", "Close dialog");
  close.textContent = "Close ×";
  Object.assign(close.style, {
    position: "fixed",
    top: "clamp(1rem, 3vw, 2.5rem)",
    right: "clamp(1rem, 3vw, 2.5rem)",
    zIndex: "10002",
    padding: ".65rem .8rem",
    border: "0",
    background: "transparent",
    color: "#fff",
    font: "500 .72rem/1 Archivo, Arial, sans-serif",
    letterSpacing: ".08em",
    textTransform: "uppercase",
    cursor: "pointer"
  });

  const kicker = document.createElement("p");
  kicker.setAttribute("data-modal-kicker", "");
  Object.assign(kicker.style, {
    margin: "0 0 .8rem",
    color: "var(--accent)",
    fontSize: ".72rem",
    letterSpacing: ".12em",
    textTransform: "uppercase"
  });

  const title = document.createElement("h2");
  title.id = "quacktory-dialog-title";
  title.setAttribute("data-modal-title", "");
  Object.assign(title.style, {
    margin: "0",
    font: "clamp(3.5rem, 10vw, 7rem)/.85 'Bebas Neue', Impact, sans-serif",
    letterSpacing: ".02em"
  });

  const image = document.createElement("img");
  image.setAttribute("data-modal-image", "");
  Object.assign(image.style, {
    width: "100%",
    maxHeight: "38vh",
    margin: "2rem 0",
    objectFit: "contain"
  });

  const description = document.createElement("p");
  description.setAttribute("data-modal-description", "");
  Object.assign(description.style, {
    maxWidth: "54ch",
    margin: "0 0 2rem",
    color: "#f0efed",
    fontSize: "1rem"
  });

  const details = document.createElement("dl");
  details.setAttribute("data-modal-details", "");
  Object.assign(details.style, {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "1rem 2rem",
    margin: "0"
  });

  [
    ["size", "Size"],
    ["position", "Position"],
    ["comparison", "Comparison"],
    ["audience", "Best for"]
  ].forEach(([key, label]) => {
    const term = document.createElement("dt");
    term.textContent = label;
    term.style.color = "#9c9c98";
    const value = document.createElement("dd");
    value.setAttribute("data-modal-field", key);
    value.style.margin = "0";
    details.append(term, value);
  });

  panel.append(kicker, title, image, description, details);
  dialog.append(close, panel);
  document.body.append(dialog);
  return dialog;
}

function ensureCloseButton(modal) {
  const existing = [...modal.querySelectorAll("button, a[href]")].find((element) => {
    const label = `${element.textContent} ${element.getAttribute("aria-label") || ""} ${typeof element.className === "string" ? element.className : ""}`;
    return element.hasAttribute("data-modal-close") || /close|dismiss|×/i.test(label);
  });

  if (existing) {
    existing.addEventListener("click", (event) => {
      event.preventDefault();
      closeModal(modal);
    });
    return existing;
  }

  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("data-modal-close", "");
  close.setAttribute("aria-label", "Close dialog");
  close.textContent = "Close ×";
  Object.assign(close.style, {
    position: "fixed",
    top: "clamp(1rem, 3vw, 2.5rem)",
    right: "clamp(1rem, 3vw, 2.5rem)",
    zIndex: "10002",
    padding: ".65rem .8rem",
    border: "0",
    background: "transparent",
    color: "#fff",
    font: "500 .72rem/1 Archivo, Arial, sans-serif",
    letterSpacing: ".08em",
    textTransform: "uppercase",
    cursor: "pointer"
  });
  close.addEventListener("click", () => closeModal(modal));
  modal.append(close);
  return close;
}

function prepareModal(modal) {
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.setAttribute("data-modal-backdrop", "");
    Object.assign(backdrop.style, {
      position: "fixed",
      inset: "0",
      zIndex: "10000",
      background: "rgba(16,16,16,.82)",
      pointerEvents: "auto"
    });
    backdrop.hidden = true;
    backdrop.addEventListener("click", () => closeModal());
    document.body.append(backdrop);
  }

  if (modal.parentElement) modal.parentElement.insertBefore(backdrop, modal);
  else document.body.append(backdrop);

  if (getComputedStyle(modal).position === "static" && modal.tagName !== "DIALOG") {
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      zIndex: "10001",
      overflowY: "auto"
    });
  } else {
    modal.style.zIndex = "10001";
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
      return;
    }
    const className = typeof event.target.className === "string" ? event.target.className : "";
    if (/overlay|backdrop/i.test(className) && !/panel|dialog|content/i.test(className)) closeModal(modal);
  });

  if (modal.tagName === "DIALOG") {
    modal.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeModal(modal);
    });
  }

  return ensureCloseButton(modal);
}

function inferProduct(trigger) {
  const item = trigger.closest(".scale-item");
  const read = (selector) => item?.querySelector(selector)?.textContent.trim() || "";
  return {
    title: read(".scale-name") || trigger.getAttribute("aria-label") || "Quacktory",
    number: read(".scale-number") || "—",
    size: read(".scale-size") || "Made to measure",
    position: read(".scale-position") || "Selected range",
    comparison: read(".scale-comparison") || "",
    audience: read(".scale-audience") || "",
    description: "A considered Quacktory object, designed for display and built to last.",
    accent: "#0875d1",
    image: item?.querySelector(".scale-image")?.getAttribute("src") || ""
  };
}

function fillModal(modal, product) {
  modal.dataset.productTitle = product.title;
  modal.dataset.productSize = product.size;
  modal.dataset.accent = product.accent;
  modal.style.setProperty("--accent", product.accent);

  const title = modal.querySelector("[data-modal-title]") || modal.querySelector("h1, h2, h3");
  if (title) title.textContent = product.title;

  const kicker = modal.querySelector("[data-modal-kicker]");
  if (kicker) kicker.textContent = `${product.number} / ${product.position}`;

  const description = modal.querySelector("[data-modal-description]");
  if (description) description.textContent = product.description;

  modal.querySelectorAll("[data-modal-field]").forEach((field) => {
    const key = field.dataset.modalField.toLowerCase();
    if (product[key]) field.textContent = product[key];
  });

  const definitionList = modal.querySelector("dl");
  if (definitionList) {
    definitionList.querySelectorAll("dt").forEach((term) => {
      const label = term.textContent.toLowerCase();
      const value = /size|scale/.test(label) ? product.size
        : /position/.test(label) ? product.position
        : /compar/.test(label) ? product.comparison
        : /audience|best for/.test(label) ? product.audience
        : /edition|product/.test(label) ? product.title : "";
      const definition = term.nextElementSibling;
      if (value && definition?.tagName === "DD") definition.textContent = value;
    });
  }

  const image = modal.querySelector("img");
  if (image && product.image) {
    image.src = product.image;
    image.alt = `Quacktory ${product.title} rubber duck, ${product.size}`;
  }
}

function setActiveProduct(id) {
  document.querySelectorAll(".hero-dot").forEach((dot) => {
    const active = dot.dataset.modal === id;
    dot.classList.toggle("hero-dot-active", active);
    dot.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll(".scale-item").forEach((item) => {
    const active = item.dataset.modal === id;
    item.classList.toggle("scale-item-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
}

function openModal(trigger) {
  const id = trigger.dataset.modal;
  if (!id) return;

  if (activeModal) closeModal(activeModal, false);
  clearTimeout(closeTimer);

  const modal = document.getElementById(id) || fallbackModal || (fallbackModal = createFallbackModal());
  const product = PRODUCTS[id] || inferProduct(trigger);
  activeTrigger = trigger;
  activeModal = modal;
  lastFocused = trigger;
  previousBodyOverflow = document.body.style.overflow;

  fillModal(modal, product);
  prepareModal(modal);
  setActiveProduct(id);
  modal.removeAttribute("hidden");
  modal.setAttribute("aria-hidden", "false");
  modal.setAttribute("data-open", "true");
  modal.style.removeProperty("display");
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  modal.style.pointerEvents = "auto";

  if (modal.tagName === "DIALOG" && !modal.open) modal.showModal();
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  trigger.setAttribute("aria-expanded", "true");

  requestAnimationFrame(() => {
    const close = modal.querySelector("[data-modal-close]");
    close?.focus({ preventScroll: true });
  });
}

function closeModal(modal = activeModal, restoreFocus = true) {
  if (!modal) return;
  if (modal === activeModal) activeModal = null;

  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("data-open");
  modal.style.opacity = "0";
  modal.style.pointerEvents = "none";
  modal.style.visibility = "hidden";

  if (modal.tagName === "DIALOG") {
    if (modal.open) modal.close();
  } else if (!restoreFocus) {
    modal.hidden = true;
  } else {
    closeTimer = window.setTimeout(() => {
      if (modal !== activeModal) modal.hidden = true;
    }, reducedMotion.matches ? 0 : 240);
  }

  if (backdrop) backdrop.hidden = true;
  document.body.style.overflow = previousBodyOverflow;
  modalTriggers.forEach((trigger) => trigger.removeAttribute("aria-expanded"));

  if (restoreFocus && lastFocused?.isConnected) {
    requestAnimationFrame(() => lastFocused.focus({ preventScroll: true }));
  }
}

function getFocusableElements(modal) {
  return [...modal.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")]
    .filter((element) => element.getClientRects().length > 0);
}

modalTriggers.forEach((trigger) => {
  const modal = document.getElementById(trigger.dataset.modal);
  if (modal) {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  }
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(trigger);
  });
});

document.addEventListener("keydown", (event) => {
  if (!activeModal) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key !== "Tab") return;
  const focusable = getFocusableElements(activeModal);
  if (!focusable.length) {
    event.preventDefault();
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

const quoteForm = document.querySelector(".quote-form");
if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;

    const submit = quoteForm.querySelector(".quote-submit");
    const actions = quoteForm.querySelector(".form-actions");
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    status.textContent = "Request received — we’ll be in touch shortly.";
    Object.assign(status.style, {
      margin: ".75rem 0 0",
      color: "#0875d1",
      fontSize: ".8rem"
    });

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Request received";
    }
    actions?.append(status);
  });
}
