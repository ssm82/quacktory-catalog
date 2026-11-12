// file: main.js
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

const products = {
  micro: {
    title: "Micro", index: "01", size: "4–8 cm", edition: "Pocket Edition",
    audience: "Keychains, merchandise and gifts up to ~$10",
    price: "Impulse", lead: "3 weeks", accent: "#8DB3C7",
    description: "A thumb-sized duck with the same unmistakable silhouette as the full collection, made to travel lightly."
  },
  classic: {
    title: "Classic", index: "02", size: "10–25 cm", edition: "Studio Classic",
    audience: "Kids, bathrooms and offices", price: "Mid", lead: "3 weeks", accent: "#F1F0E9",
    description: "The familiar everyday duck, balanced between domestic scale and presence without taking over the room."
  },
  designer: {
    title: "Designer", index: "03", size: "15–30 cm", edition: "Limited Edition",
    audience: "Illustrator collaborations and limited runs", price: "Mid+", lead: "6 weeks", accent: "#D52C64",
    description: "A character-led edition made for limited releases, collaborations and objects with a point of view."
  },
  mega: {
    title: "Mega", index: "04", size: "50–120 cm", edition: "Exhibition Edition",
    audience: "Photo objects, displays and statement gifts", price: "Premium", lead: "6 weeks", accent: "#4D8CAD",
    description: "A large-format silhouette built for visual impact, shop windows, sets and memorable pictures."
  },
  architect: {
    title: "Architect", index: "05", size: "1.5–3 m", edition: "Architectural Edition",
    audience: "Installations, events, weddings and branded spaces", price: "Price on request", lead: "12 weeks", accent: "#A31E4A",
    description: "A monumental duck developed as a spatial object for installations, public interiors and cinematic events."
  }
};

const find = (root, selectors) => {
  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (element) return element;
  }
  return null;
};

const setText = (element, value) => {
  if (element) element.textContent = value;
};

let productModal = document.querySelector(".product-modal");

if (!productModal) {
  productModal = document.createElement("dialog");
  productModal.className = "product-modal";
  productModal.id = "product-dialog";
  productModal.innerHTML = `
    <div class="edge-menu__inner" data-product-content>
      <button class="edge-menu__close" type="button" data-modal-close aria-label="Close">
        <span class="edge-menu__close-label" aria-hidden="true">×</span>
        <span class="edge-menu__close-line"></span>
      </button>
      <p class="edge-menu__eyebrow" data-product-eyebrow></p>
      <h2 class="section-title" data-product-title></h2>
      <p class="section-deck" data-product-description></p>
      <img class="product-card__image" data-product-image alt="" style="width:min(100%,34rem);max-height:42vh;object-fit:contain;margin:2rem 0;">
      <dl data-product-details></dl>
      <div class="edge-menu__footer">
        <span class="edge-menu__footer-line"></span>
        <span class="edge-menu__footer-copy">Serious ducks for un-serious people.</span>
      </div>
    </div>`;
  document.body.appendChild(productModal);
}

productModal.id = "product-dialog";
productModal.setAttribute("aria-labelledby", "product-dialog-title");

const contentHost = productModal.querySelector("[data-product-content], [class*='product-modal__content'], [class*='product-modal__body']") || productModal.querySelector("h2, h3")?.parentElement || productModal;
const productTitle = find(productModal, ["[data-product-title]", "[class*='product-modal__title']", "h2", "h3"]) || (() => {
  const heading = document.createElement("h2");
  heading.setAttribute("data-product-title", "");
  contentHost.prepend(heading);
  return heading;
})();

productTitle.id = "product-dialog-title";

const productEyebrow = find(productModal, ["[data-product-eyebrow]", "[class*='product-modal__eyebrow']", "[class*='product-modal__kicker']"]) || (() => {
  const eyebrow = document.createElement("p");
  eyebrow.className = "edge-menu__eyebrow";
  eyebrow.setAttribute("data-product-eyebrow", "");
  contentHost.insertBefore(eyebrow, productTitle);
  return eyebrow;
})();

const paragraphs = [...productModal.querySelectorAll("p")];
const productDescription = find(productModal, ["[data-product-description]", "[class*='product-modal__description']", "[class*='product-modal__copy']"]) || paragraphs.find((paragraph) => paragraph !== productEyebrow && !paragraph.closest(".edge-menu__footer")) || (() => {
  const paragraph = document.createElement("p");
  paragraph.setAttribute("data-product-description", "");
  productTitle.insertAdjacentElement("afterend", paragraph);
  return paragraph;
})();

const productImage = find(productModal, ["[data-product-image]", "[class*='product-modal__image']", "img"]);
const productSize = find(productModal, ["[data-product-size]", "[class*='product-modal__size']"]);
const productIndex = find(productModal, ["[data-product-index]", "[class*='product-modal__index']"]);
const productAudience = find(productModal, ["[data-product-audience]", "[class*='product-modal__audience']"]);
const productPrice = find(productModal, ["[data-product-price]", "[class*='product-modal__price']"]);
const productLead = find(productModal, ["[data-product-lead]", "[class*='product-modal__lead']", ".lead-time"]);
const productDetails = productModal.querySelector("[data-product-details]") || (() => {
  const details = document.createElement("dl");
  details.setAttribute("data-product-details", "");
  details.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(8rem,1fr));gap:1.25rem 2rem;margin:2rem 0 0;padding:1.25rem 0 0;border-top:1px solid rgba(241,240,233,.28);";
  contentHost.appendChild(details);
  return details;
})();

let closeButton = find(productModal, ["[data-modal-close]", "[aria-label='Close']", "[class*='product-modal__close']"]);
if (!closeButton) {
  closeButton = document.createElement("button");
  closeButton.className = "edge-menu__close";
  closeButton.type = "button";
  closeButton.setAttribute("data-modal-close", "");
  closeButton.setAttribute("aria-label", "Close");
  closeButton.innerHTML = '<span class="edge-menu__close-label" aria-hidden="true">×</span><span class="edge-menu__close-line"></span>';
  productModal.prepend(closeButton);
}

const railLinks = [...document.querySelectorAll(".rail-link")];
let lastProductTrigger = null;
let previousModalOverflow = "";

function activateRail(key, selectedRail) {
  railLinks.forEach((link) => {
    const active = link === selectedRail || link.getAttribute("href") === `#${key}`;
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
    link.style.textDecoration = active ? "underline" : "none";
    link.style.textUnderlineOffset = active ? "0.35em" : "";
  });
}

function populateProduct(key) {
  const product = products[key];
  if (!product) return;

  const card = document.querySelector(`.product-card[data-product="${key}"]`);
  const sourceImage = card?.querySelector(".product-card__image");
  const fields = [
    ["Size", product.size],
    ["Edition", product.edition],
    ["Price", product.price],
    ["Lead time", product.lead]
  ];

  setText(productTitle, product.title);
  setText(productEyebrow, `${product.index} / ${product.edition}`);
  setText(productDescription, product.description);
  setText(productSize, product.size);
  setText(productIndex, product.index);
  setText(productAudience, product.audience);
  setText(productPrice, product.price);
  setText(productLead, product.lead);

  if (sourceImage && productImage) {
    productImage.src = sourceImage.currentSrc || sourceImage.src;
    productImage.alt = sourceImage.alt || `${product.title} rubber duck, ${product.size}`;
    productImage.hidden = false;
  }

  productDetails.replaceChildren();
  fields.forEach(([label, value]) => {
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = value;
    term.style.cssText = "font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;opacity:.62;";
    detail.style.cssText = "margin:.35rem 0 0;font-size:1rem;";
    productDetails.append(term, detail);
  });

  productModal.dataset.product = key;
  productModal.style.setProperty("--accent", product.accent);
  productModal.style.setProperty("--product-accent", product.accent);
  productDetails.style.borderTopColor = product.accent;
}

function openProduct(key, trigger) {
  if (!products[key]) return;
  if (menuOpen) closeMenu(false);
  populateProduct(key);
  lastProductTrigger = trigger || document.activeElement;
  previousModalOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  productModal.setAttribute("aria-hidden", "false");

  if (typeof productModal.showModal === "function") {
    if (!productModal.open) productModal.showModal();
  } else {
    productModal.setAttribute("open", "");
    productModal.style.display = "block";
  }

  requestAnimationFrame(() => closeButton?.focus());
}

function restoreModalState() {
  productModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = previousModalOverflow;
  if (lastProductTrigger) {
    try {
      lastProductTrigger.focus({ preventScroll: true });
    } catch {
      lastProductTrigger.focus();
    }
  }
}

function closeProduct() {
  if (typeof productModal.close === "function" && productModal.open) {
    productModal.close();
  } else {
    productModal.removeAttribute("open");
    productModal.style.removeProperty("display");
    restoreModalState();
  }
}

productModal.addEventListener("close", restoreModalState);
productModal.addEventListener("click", (event) => {
  const closer = event.target.closest?.("[data-modal-close], [aria-label='Close'], [class*='product-modal__close']");
  if (closer || event.target === productModal) closeProduct();
});

const menuButton = document.querySelector(".hero__menu");
const edgeMenu = document.querySelector(".edge-menu");
const menuClose = document.querySelector(".edge-menu__close");
let menuOpen = false;
let previousMenuOverflow = "";
let menuCloseTimer = 0;

function openMenu() {
  if (!edgeMenu || !menuButton) return;
  clearTimeout(menuCloseTimer);
  menuOpen = true;
  previousMenuOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  edgeMenu.inert = false;
  edgeMenu.setAttribute("aria-hidden", "false");
  edgeMenu.style.opacity = "1";
  edgeMenu.style.visibility = "visible";
  edgeMenu.style.transform = "translateX(0)";
  edgeMenu.style.pointerEvents = "auto";
  menuButton.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => menuClose?.focus());
}

function closeMenu(restoreFocus = true) {
  if (!edgeMenu || !menuButton) return;
  menuOpen = false;
  edgeMenu.inert = true;
  edgeMenu.setAttribute("aria-hidden", "true");
  edgeMenu.style.opacity = "0";
  edgeMenu.style.visibility = "hidden";
  edgeMenu.style.pointerEvents = "none";
  menuButton.setAttribute("aria-expanded", "false");
  document.body.style.overflow = previousMenuOverflow;
  menuCloseTimer = window.setTimeout(() => {
    if (!menuOpen) edgeMenu.style.transform = "";
  }, 320);
  if (restoreFocus) menuButton.focus();
}

menuButton?.addEventListener("click", () => menuOpen ? closeMenu() : openMenu());
menuClose?.addEventListener("click", () => closeMenu());

document.addEventListener("click", (event) => {
  const rail = event.target.closest?.(".rail-link");
  if (rail) {
    event.preventDefault();
    const key = rail.getAttribute("href")?.replace("#", "");
    activateRail(key, rail);
    openProduct(key, rail);
    return;
  }

  const trigger = event.target.closest?.("[data-product-target]");
  if (trigger) {
    event.preventDefault();
    const key = trigger.dataset.productTarget;
    activateRail(key);
    openProduct(key, trigger);
    return;
  }

  const card = event.target.closest?.(".product-card[data-product]");
  if (card && !event.target.closest?.("a, button")) {
    const key = card.dataset.product;
    activateRail(key);
    openProduct(key, card);
    return;
  }

  const anchor = event.target.closest?.("a[href^='#']");
  if (!anchor) return;
  const hash = anchor.getAttribute("href");
  if (!hash || hash.length < 2) return;

  let id = hash.slice(1);
  try { id = decodeURIComponent(id); } catch {}
  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  if (edgeMenu?.contains(anchor)) closeMenu(false);
  requestAnimationFrame(() => target.scrollIntoView({
    behavior: reducedMotion.matches ? "auto" : "smooth",
    block: "start"
  }));
  try { history.replaceState(null, "", `#${id}`); } catch {}
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuOpen) {
    event.preventDefault();
    closeMenu();
    return;
  }

  if (event.key === "Tab" && menuOpen && edgeMenu) {
    const focusable = [...edgeMenu.querySelectorAll("a[href], button:not([disabled])")].filter((element) => !element.hidden);
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
  }
});

function animateHero() {
  if (reducedMotion.matches || !window.Element?.prototype.animate) return;
  const sequences = [
    [".hero__eyebrow", [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], 80],
    [".hero__title-line", [{ opacity: 0, clipPath: "inset(0 100% 0 0)", transform: "translateX(-8px)" }, { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "translateX(0)" }], 180],
    [".hero__support", [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], 360],
    [".hero__rail", [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], 500]
  ];

  sequences.forEach(([selector, frames, delay]) => {
    const element = document.querySelector(selector);
    element?.animate(frames, { duration: 760, delay, easing: ease, fill: "both" });
  });
}

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealItems = [...document.querySelectorAll(".section-heading, .product-card")];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const index = revealItems.indexOf(element);
      const animation = element.animate(
        [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 700, delay: (index % 5) * 80, easing: ease, fill: "both" }
      );
      animation.addEventListener("finish", () => {
        animation.cancel();
        element.style.opacity = "";
      });
      observer.unobserve(element);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

  revealItems.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    element.style.opacity = "0";
    observer.observe(element);
  });
}

animateHero();
