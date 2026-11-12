// file: main.js
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const products = {
  micro: {
    title: "Micro", index: "01", edition: "Pocket edition", size: "4–8 cm",
    comparison: "thumb-sized", price: "Impulse", lead: "3 weeks", accent: "#F2C500",
    image: "./assets/product-micro.jpg",
    description: "A pocket-scale duck with the same unmistakable attitude as the larger editions. Made for desks, bags and small places that need a little character."
  },
  classic: {
    title: "Classic", index: "02", edition: "Everyday edition", size: "10–25 cm",
    comparison: "cat-sized", price: "Mid", lead: "3 weeks", accent: "#F2C500",
    image: "./assets/product-classic.jpg",
    description: "The familiar silhouette in a considered indoor scale. Soft enough to live on a shelf, graphic enough to hold its own on camera."
  },
  designer: {
    title: "Designer", index: "03", edition: "Studio edition", size: "15–30 cm",
    comparison: "cat-sized", price: "Mid+", lead: "6 weeks", accent: "#F2C500",
    image: "./assets/product-designer.jpg",
    description: "A refined studio object with carefully balanced proportions, selected for hospitality spaces, creative desks and display-led interiors."
  },
  mega: {
    title: "Mega", index: "04", edition: "Photographic edition", size: "50–120 cm",
    comparison: "photo objects", price: "Premium", lead: "6 weeks", accent: "#F2C500",
    image: "./assets/product-mega.jpg",
    description: "A large-format duck built to become a focal point. Its bold silhouette gives campaigns, lobbies and installations an immediate visual anchor."
  },
  architect: {
    title: "Architect", index: "05", edition: "Commission edition", size: "1.5–3 m",
    comparison: "bear-sized", price: "On request", lead: "12 weeks", accent: "#F2C500",
    image: "./assets/product-architect.jpg",
    description: "A room-sized presence developed as an architectural gesture. Bespoke finishes, structural coordination and installation guidance are available for each commission."
  }
};

const modalStyle = document.createElement("style");
modalStyle.textContent = `
  dialog[data-product-dialog] {
    width: min(920px, calc(100vw - 32px));
    max-width: none;
    max-height: calc(100vh - 32px);
    max-height: calc(100dvh - 32px);
    margin: auto;
    padding: 0;
    overflow: auto;
    border: 1px solid rgba(247,245,239,.2);
    border-radius: 2px;
    background: #111820;
    color: #f7f5ef;
    box-shadow: 0 30px 100px rgba(0,0,0,.7);
  }
  dialog[data-product-dialog]::backdrop {
    background: rgba(0,0,0,.78);
    backdrop-filter: blur(8px);
  }
  dialog[data-product-dialog] [data-modal-layout] {
    display: grid;
    grid-template-columns: minmax(0,.92fr) minmax(0,1.08fr);
    min-height: min(680px, calc(100vh - 64px));
  }
  dialog[data-product-dialog] [data-modal-media] img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(.82) contrast(1.06);
  }
  @media (max-width: 720px) {
    dialog[data-product-dialog] { width: calc(100vw - 20px); }
    dialog[data-product-dialog] [data-modal-layout] { grid-template-columns: 1fr; }
    dialog[data-product-dialog] [data-modal-media] { min-height: 36vh; }
  }
`;
document.head.append(modalStyle);

const dialog = document.createElement("dialog");
dialog.id = "quacktory-product-dialog";
dialog.dataset.productDialog = "";
dialog.setAttribute("aria-labelledby", "product-dialog-title");
dialog.setAttribute("aria-describedby", "product-dialog-description");

const panel = document.createElement("div");
panel.style.position = "relative";
dialog.append(panel);
document.body.append(dialog);

let currentProduct = "";
let lastTrigger = null;
let closingModal = false;

function readShareCount(key) {
  try {
    return Math.min(99, Number.parseInt(sessionStorage.getItem(`quacktory-share-${key}`), 10) || 0);
  } catch {
    return 0;
  }
}

function updateShareCount() {
  const counter = panel.querySelector("[data-share-count]");
  if (!counter) return;
  const count = readShareCount(currentProduct);
  counter.textContent = `${count} ${count === 1 ? "share" : "shares"}${count === 99 ? " · cap" : ""}`;
}

function setActiveTrigger(trigger) {
  document.querySelectorAll("[data-open-product]").forEach((item) => {
    const active = item === trigger;
    item.setAttribute("aria-pressed", String(active));
    const label = item.querySelector(".scale-name");
    const index = item.querySelector(".scale-index");
    if (label) label.style.color = active ? "var(--accent)" : "";
    if (index) index.style.color = active ? "var(--accent)" : "";
  });
}

function openProduct(key, trigger) {
  const product = products[key];
  if (!product) return;

  currentProduct = key;
  lastTrigger = trigger;
  setActiveTrigger(trigger);
  dialog.style.setProperty("--product-accent", product.accent);

  const rows = [
    ["Edition", product.edition],
    ["Size", product.size],
    ["Comparison", product.comparison],
    ["Price positioning", product.price],
    ["Lead time", product.lead]
  ].map(([label, value]) => `
    <div style="display:grid;grid-template-columns:minmax(110px,.75fr) 1.25fr;gap:18px;padding:11px 0;border-top:1px solid rgba(247,245,239,.12)">
      <dt style="color:#c7c7c2;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase">${label}</dt>
      <dd style="margin:0;font-size:.83rem">${value}</dd>
    </div>
  `).join("");

  panel.innerHTML = `
    <button type="button" data-modal-close aria-label="Close product details" style="position:absolute;z-index:2;top:12px;right:12px;width:44px;height:44px;border:1px solid rgba(247,245,239,.35);border-radius:2px;background:rgba(11,11,11,.72);color:#f7f5ef;font-size:1.45rem;line-height:1;cursor:pointer">×</button>
    <div data-modal-layout>
      <div data-modal-media style="position:relative;min-height:360px;overflow:hidden;background:#080808">
        <img src="${product.image}" alt="${product.title} duck">
        <span style="position:absolute;left:20px;bottom:20px;padding:7px 10px;background:rgba(11,11,11,.78);color:#f2c500;font-size:.68rem;letter-spacing:.12em">${product.index} / 05</span>
      </div>
      <div data-modal-copy style="display:flex;flex-direction:column;justify-content:center;padding:clamp(32px,5vw,64px)">
        <p style="margin:0 0 18px;color:#f2c500;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase">Product range · ${product.index}</p>
        <h2 id="product-dialog-title" style="margin:0;font-family:var(--display);font-size:clamp(3rem,7vw,5.4rem);font-weight:400;line-height:.95">${product.title}</h2>
        <div style="width:54px;height:2px;margin:28px 0;background:#f2c500"></div>
        <p id="product-dialog-description" style="max-width:44ch;margin:0 0 30px;color:#c7c7c2;font-size:.92rem;line-height:1.75">${product.description}</p>
        <dl style="margin:0 0 32px">${rows}</dl>
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px">
          <button type="button" data-share style="display:flex;align-items:center;gap:14px;min-height:44px;padding:10px 14px;border:1px solid rgba(247,245,239,.3);border-radius:2px;background:transparent;color:#f7f5ef;font-size:.72rem;cursor:pointer">
            <span>Share this duck</span><span data-share-count aria-live="polite" style="color:#f2c500">0 shares</span>
          </button>
          <a data-modal-quote href="#custom" style="display:inline-flex;align-items:center;min-height:44px;padding:10px 16px;border:1px solid #f2c500;border-radius:2px;background:#f2c500;color:#0b0b0b;font-size:.72rem;font-weight:600">Request a quote</a>
        </div>
      </div>
    </div>
  `;

  updateShareCount();
  if (!dialog.open) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  if (!reducedMotion() && typeof panel.animate === "function") {
    panel.animate(
      [{ opacity: 0, transform: "translate3d(0,14px,0)" }, { opacity: 1, transform: "translate3d(0,0,0)" }],
      { duration: 360, easing: EASE }
    );
  }
}

function shareCurrentProduct() {
  if (!currentProduct) return;
  const count = Math.min(99, readShareCount(currentProduct) + 1);
  try { sessionStorage.setItem(`quacktory-share-${currentProduct}`, String(count)); } catch { /* Storage may be unavailable. */ }
  updateShareCount();

  const product = products[currentProduct];
  const payload = {
    title: `Quacktory ${product.title}`,
    text: `Take a look at the Quacktory ${product.title}.`,
    url: `${window.location.href.split("#")[0]}#catalog`
  };

  if (typeof navigator.share === "function") {
    try { Promise.resolve(navigator.share(payload)).catch(() => {}); } catch { /* Sharing was cancelled. */ }
  } else if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(payload.url).catch(() => {});
  }
}

async function closeProductModal() {
  if (!dialog.open || closingModal) return;
  closingModal = true;
  if (!reducedMotion() && typeof panel.animate === "function") {
    const animation = panel.animate(
      [{ opacity: 1, transform: "translate3d(0,0,0)" }, { opacity: 0, transform: "translate3d(0,8px,0)" }],
      { duration: 180, easing: EASE, fill: "both" }
    );
    try { await animation.finished; } catch { /* Continue closing. */ }
  }
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
  closingModal = false;
}

document.querySelectorAll("[data-open-product]").forEach((trigger) => {
  trigger.setAttribute("aria-controls", dialog.id);
  trigger.setAttribute("aria-pressed", "false");
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openProduct(trigger.dataset.openProduct, trigger);
  });
});

dialog.addEventListener("click", (event) => {
  if (event.target.closest("[data-modal-close]")) {
    closeProductModal();
    return;
  }
  if (event.target.closest("[data-share]")) {
    shareCurrentProduct();
    return;
  }
  const quote = event.target.closest("[data-modal-quote]");
  if (quote) {
    event.preventDefault();
    closeProductModal().then(() => scrollToHash("#custom"));
    return;
  }
  if (event.target === dialog) closeProductModal();
});

dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeProductModal();
});

dialog.addEventListener("close", () => {
  closingModal = false;
  if (lastTrigger) lastTrigger.focus({ preventScroll: true });
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const menuBars = menuToggle ? [...menuToggle.querySelectorAll(".menu-glyph span")] : [];
let menuOpen = false;
const menuMode = () => menuToggle && getComputedStyle(menuToggle).display !== "none";

function setMenu(open) {
  if (!menuToggle || !navLinks) return;
  menuOpen = open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Product range");

  if (open) {
    Object.assign(navLinks.style, {
      position: "fixed", top: "var(--nav-height)", left: "0", right: "0", zIndex: "99",
      flexDirection: "column", alignItems: "flex-start", gap: "8px",
      maxHeight: "calc(100vh - var(--nav-height))", overflowY: "auto",
      padding: "24px clamp(20px,3vw,52px)", background: "rgba(11,11,11,.98)",
      borderBottom: "1px solid rgba(247,245,239,.16)"
    });
    navLinks.style.setProperty("display", "flex", "important");
    navLinks.removeAttribute("aria-hidden");
    if (menuBars[0]) menuBars[0].style.transform = "translateY(3.5px) rotate(45deg)";
    if (menuBars[1]) menuBars[1].style.transform = "translateY(-3.5px) rotate(-45deg)";
    return;
  }

  menuBars.forEach((bar) => bar.style.removeProperty("transform"));
  if (menuMode()) {
    navLinks.style.setProperty("display", "none", "important");
    navLinks.setAttribute("aria-hidden", "true");
  } else {
    ["display", "position", "top", "left", "right", "zIndex", "flexDirection", "alignItems", "gap", "maxHeight", "overflowY", "padding", "background", "borderBottom"].forEach((property) => navLinks.style.removeProperty(property));
    navLinks.removeAttribute("aria-hidden");
  }
}

if (menuToggle && navLinks) {
  setMenu(false);
  menuToggle.addEventListener("click", () => {
    setMenu(!menuOpen);
    if (menuOpen) navLinks.querySelector(".nav-link")?.focus({ preventScroll: true });
  });
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (!menuOpen) return;
      menuToggle.focus({ preventScroll: true });
      setMenu(false);
    });
  });
  document.addEventListener("click", (event) => {
    if (menuOpen && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) {
      event.preventDefault();
      setMenu(false);
      menuToggle.focus({ preventScroll: true });
    }
  });
  window.addEventListener("resize", () => {
    requestAnimationFrame(() => {
      if (menuOpen && !menuMode()) setMenu(false);
      else if (!menuOpen && menuMode()) setMenu(false);
    });
  });
}

function scrollToHash(hash) {
  let id = hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* Use the original id. */ }
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  try { history.pushState(null, "", hash); } catch { /* Hash updates are optional. */ }
}

document.addEventListener("click", (event) => {
  const anchor = event.target.closest("a[href^='#']");
  if (!anchor || anchor.defaultPrevented) return;
  const hash = anchor.getAttribute("href");
  if (!hash || hash === "#" || !document.getElementById(hash.slice(1))) return;
  event.preventDefault();
  scrollToHash(hash);
});

const heroSequence = [
  [document.querySelector(".hero-kicker"), 0],
  ...[...document.querySelectorAll(".hero-title-line")].map((line, index) => [line, 100 + index * 100]),
  [document.querySelector(".hero-rule"), 420],
  [document.querySelector(".hero-credo"), 500],
  [document.querySelector(".hero-content .button-primary"), 580]
].filter(([element]) => element);

if (reducedMotion()) {
  heroSequence.forEach(([element]) => {
    element.style.opacity = "1";
    element.style.transform = "none";
  });
} else {
  heroSequence.forEach(([element, delay]) => {
    element.style.opacity = "0";
    element.style.transform = "translate3d(0,22px,0)";
    requestAnimationFrame(() => {
      if (typeof element.animate !== "function") {
        element.style.opacity = "1";
        element.style.transform = "none";
        return;
      }
      const animation = element.animate(
        [{ opacity: 0, transform: "translate3d(0,22px,0)" }, { opacity: 1, transform: "translate3d(0,0,0)" }],
        { duration: 620, delay, easing: EASE, fill: "both" }
      );
      animation.onfinish = () => {
        element.style.opacity = "1";
        element.style.transform = "none";
        animation.cancel();
      };
    });
  });

  const heroMedia = document.querySelector(".hero-media");
  if (heroMedia && typeof heroMedia.animate === "function") {
    heroMedia.style.transformOrigin = "center center";
    heroMedia.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.008)" }],
      { duration: 1800, easing: EASE, fill: "forwards" }
    );
  }
}

const revealElements = [...document.querySelectorAll(".reveal")];
function revealElement(element) {
  if (reducedMotion() || typeof element.animate !== "function") {
    element.style.opacity = "1";
    element.style.transform = "none";
    return;
  }
  const animation = element.animate(
    [{ opacity: 0, transform: "translate3d(0,18px,0)" }, { opacity: 1, transform: "translate3d(0,0,0)" }],
    { duration: 560, easing: EASE, fill: "both" }
  );
  animation.onfinish = () => {
    element.style.opacity = "1";
    element.style.transform = "none";
    animation.cancel();
  };
}

if (revealElements.length) {
  if (reducedMotion() || !("IntersectionObserver" in window)) {
    revealElements.forEach(revealElement);
  } else {
    revealElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translate3d(0,18px,0)";
    });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealElement(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealElements.forEach((element) => revealObserver.observe(element));
  }
}
