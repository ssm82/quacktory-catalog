// file: main.js
const body = document.body;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");
const productTriggers = [...document.querySelectorAll("[data-product-trigger]")];

let menuIsOpen = false;
let lastProductTrigger = null;

function syncBodyLock() {
  const dialogIsOpen = Boolean(productDialog?.open);
  body.classList.toggle("modal-open", menuIsOpen || dialogIsOpen);
}

function setMenu(open, restoreFocus = true) {
  if (!menuToggle || !siteMenu) return;

  menuIsOpen = open;
  menuToggle.setAttribute("aria-expanded", String(open));
  siteMenu.setAttribute("aria-hidden", String(!open));
  siteMenu.inert = !open;
  syncBodyLock();

  if (open) {
    requestAnimationFrame(() => {
      siteMenu.querySelector(".site-menu__link")?.focus({ preventScroll: true });
    });
  } else if (restoreFocus) {
    menuToggle.focus({ preventScroll: true });
  }
}

menuToggle?.addEventListener("click", () => setMenu(!menuIsOpen));

siteMenu?.addEventListener("click", (event) => {
  if (event.target.closest("[data-menu-close]")) {
    setMenu(false, event.target.closest(".site-menu__link") ? false : true);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuIsOpen && !productDialog?.open) {
    event.preventDefault();
    setMenu(false);
  }
});

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const id = decodeURIComponent(link.getAttribute("href").slice(1));
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();

  if (siteMenu?.contains(link) && menuIsOpen) {
    setMenu(false, false);
  }

  target.scrollIntoView({
    behavior: reducedMotion.matches ? "auto" : "smooth",
    block: "start"
  });

  try {
    history.pushState(null, "", `#${id}`);
  } catch {
    // The visual navigation still works when history updates are unavailable.
  }

  if (event.detail === 0) {
    const heading = target.querySelector("h1, h2, h3");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      window.setTimeout(() => heading.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 650);
    }
  }
});

const revealItems = [...document.querySelectorAll(".reveal")];

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const item = entry.target;
      const index = revealItems.indexOf(item);
      item.style.transitionDelay = `${Math.min((index % 4) * 60, 180)}ms`;
      item.style.opacity = "1";
      item.style.transform = "none";
      observer.unobserve(item);

      window.setTimeout(() => {
        item.style.transitionDelay = "";
        item.style.willChange = "";
      }, 1000);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  revealItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.visibility = "visible";
    item.style.transform = "translateY(24px)";
    item.style.transition = "opacity 760ms var(--ease), transform 760ms var(--ease)";
    item.style.willChange = "opacity, transform";
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.style.opacity = "1";
    item.style.transform = "none";
  });
}

if (!document.getElementById("quacktory-product-style")) {
  const productStyle = document.createElement("style");
  productStyle.id = "quacktory-product-style";
  productStyle.textContent = `
    #quacktory-product-dialog {
      width: min(58rem, calc(100vw - 2rem));
      max-height: min(48rem, calc(100dvh - 2rem));
      margin: auto;
      padding: 0;
      overflow: auto;
      border: 1px solid rgba(169,241,244,.24);
      background: #06131d;
      color: var(--fg);
      font-family: var(--body);
      box-shadow: 0 2rem 7rem rgba(0,0,0,.5);
    }
    #quacktory-product-dialog::backdrop {
      background: rgba(2,10,16,.78);
      backdrop-filter: blur(10px);
    }
    #quacktory-product-dialog[open] {
      animation: quacktory-dialog-in 420ms var(--ease) both;
    }
    #quacktory-product-dialog > div {
      display: grid;
      grid-template-columns: minmax(17rem,.9fr) minmax(0,1.1fr);
      min-height: 34rem;
    }
    #quacktory-product-media {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 22rem;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 45%, color-mix(in srgb,var(--product-accent) 22%,transparent), transparent 58%),
        #071823;
    }
    #quacktory-product-image {
      width: 100%;
      height: 100%;
      max-height: 42rem;
      object-fit: cover;
      filter: saturate(.82) contrast(1.04);
    }
    #quacktory-product-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: clamp(2rem,5vw,4.5rem);
    }
    #quacktory-product-kicker {
      margin: 0 0 1rem;
      color: var(--product-accent);
      font-size: .68rem;
      font-weight: 600;
      letter-spacing: .24em;
      text-transform: uppercase;
    }
    #quacktory-product-title {
      margin: 0;
      color: var(--accent);
      font-family: var(--display);
      font-size: clamp(4rem,9vw,7.5rem);
      font-weight: 400;
      letter-spacing: .025em;
      line-height: .82;
      text-transform: uppercase;
    }
    #quacktory-product-description {
      max-width: 34rem;
      margin: 1.5rem 0 2rem;
      color: var(--fg);
      font-size: 1rem;
      font-weight: 300;
      line-height: 1.75;
    }
    #quacktory-product-facts {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 1rem 1.5rem;
      margin: 0 0 2rem;
    }
    #quacktory-product-facts > div {
      min-width: 0;
      padding-top: .75rem;
      border-top: 1px solid rgba(183,193,199,.14);
    }
    #quacktory-product-facts dt {
      margin: 0 0 .25rem;
      color: var(--muted);
      font-size: .62rem;
      letter-spacing: .16em;
      text-transform: uppercase;
    }
    #quacktory-product-facts dd {
      margin: 0;
      color: var(--fg);
      font-size: .82rem;
      line-height: 1.5;
    }
    #quacktory-product-quote {
      align-self: flex-start;
      color: var(--product-accent);
      font-size: .75rem;
      font-weight: 600;
      letter-spacing: .16em;
      text-transform: uppercase;
      text-decoration: underline;
      text-underline-offset: .45rem;
      transition: color 200ms ease, transform 200ms var(--ease);
    }
    #quacktory-product-quote:hover {
      color: var(--accent);
      transform: translateY(-2px);
    }
    #quacktory-product-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 2;
      width: 2.75rem;
      height: 2.75rem;
      border: 1px solid rgba(169,241,244,.3);
      border-radius: 50%;
      background: rgba(6,19,29,.76);
      color: var(--accent);
      font-size: 1.4rem;
      line-height: 1;
      cursor: pointer;
      transition: background 200ms ease, transform 200ms var(--ease);
    }
    #quacktory-product-close:hover {
      background: rgba(169,241,244,.12);
      transform: rotate(8deg);
    }
    @keyframes quacktory-dialog-in {
      from { opacity: 0; transform: translateY(16px) scale(.985); }
      to { opacity: 1; transform: none; }
    }
    @media (max-width: 680px) {
      #quacktory-product-dialog > div { grid-template-columns: 1fr; }
      #quacktory-product-media { min-height: 15rem; max-height: 38dvh; }
      #quacktory-product-image { max-height: 38dvh; }
      #quacktory-product-content { padding: 2rem 1.4rem; }
      #quacktory-product-facts { grid-template-columns: 1fr; }
    }
    @media (prefers-reduced-motion: reduce) {
      #quacktory-product-dialog[open] { animation: none; }
    }
  `;
  document.head.appendChild(productStyle);
}

let productDialog = document.getElementById("quacktory-product-dialog");

if (!productDialog) {
  productDialog = document.createElement("dialog");
  productDialog.id = "quacktory-product-dialog";
  productDialog.setAttribute("aria-labelledby", "quacktory-product-title");
  productDialog.setAttribute("aria-describedby", "quacktory-product-description");
  productDialog.innerHTML = `
    <div>
      <div id="quacktory-product-media">
        <img id="quacktory-product-image" src="" alt="">
      </div>
      <div id="quacktory-product-content">
        <p id="quacktory-product-kicker">Product specification</p>
        <h2 id="quacktory-product-title"></h2>
        <p id="quacktory-product-description"></p>
        <dl id="quacktory-product-facts"></dl>
        <a id="quacktory-product-quote" href="#custom-development">Request a quote</a>
      </div>
      <button id="quacktory-product-close" type="button" aria-label="Close product details">×</button>
    </div>
  `;
  body.appendChild(productDialog);
}

const productImage = productDialog.querySelector("#quacktory-product-image");
const productTitle = productDialog.querySelector("#quacktory-product-title");
const productDescription = productDialog.querySelector("#quacktory-product-description");
const productFacts = productDialog.querySelector("#quacktory-product-facts");
const productClose = productDialog.querySelector("#quacktory-product-close");
const productQuote = productDialog.querySelector("#quacktory-product-quote");
const productAccents = ["#a9f1f4", "#8ebce8", "#9ed8f0", "#b7dfea", "#c0e8df"];

function openProduct(trigger) {
  const data = trigger.dataset;
  const product = data.product || "Duck";
  const price = [data.price, data.priceNote, data.shippingNote].filter(Boolean).join(" · ");
  const facts = [
    ["Scale", data.size],
    ["Made for", data.audience],
    ["Price", price],
    ["Lead time", data.leadTime],
    ["Production", data.production],
    ["Tooling", data.tooling],
    ["Cycle", data.cycle],
    ["Packaging", data.packaging],
    ["Logistics", data.logistics],
    ["Age / use", data.age]
  ].filter(([, value]) => value);

  lastProductTrigger = trigger;
  productTitle.textContent = product;
  productDescription.textContent = `${product} is ${data.size || "made to order"}, designed for ${data.audience || "the shelf"}.`;
  productImage.src = data.image || "";
  productImage.alt = data.size ? `${product} — ${data.size}` : product;
  productFacts.replaceChildren();

  facts.forEach(([label, value]) => {
    const group = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = value;
    group.append(term, detail);
    productFacts.appendChild(group);
  });

  const accentIndex = Math.max(0, productTriggers.indexOf(trigger));
  productDialog.style.setProperty("--product-accent", productAccents[accentIndex % productAccents.length]);
  productDialog.dataset.product = product;
  productDialog.dataset.size = data.size || "";

  if (!productDialog.open) {
    if (typeof productDialog.showModal === "function") {
      productDialog.showModal();
    } else {
      productDialog.setAttribute("open", "");
    }
  }

  syncBodyLock();
  requestAnimationFrame(() => productClose.focus({ preventScroll: true }));
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-product-trigger]");
  if (!trigger) return;
  event.preventDefault();
  openProduct(trigger);
});

productClose?.addEventListener("click", () => productDialog.close("dismiss"));

productQuote?.addEventListener("click", () => {
  if (productDialog.open) productDialog.close("quote");
});

productDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  productDialog.close("dismiss");
});

productDialog.addEventListener("click", (event) => {
  if (event.target !== productDialog) return;
  const bounds = productDialog.getBoundingClientRect();
  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;
  if (outside) productDialog.close("dismiss");
});

productDialog.addEventListener("close", () => {
  syncBodyLock();
  if (lastProductTrigger?.isConnected) {
    lastProductTrigger.focus({ preventScroll: true });
  }
});

syncBodyLock();
