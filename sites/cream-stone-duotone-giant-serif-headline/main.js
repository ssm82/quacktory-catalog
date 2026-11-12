// file: main.js
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const productData = {
  micro: {
    title: "Micro",
    size: "4–8 cm",
    comparison: "thumb-sized",
    audience: "Keychains, merch, gifts",
    edition: "Edition 01 — Pocket scale",
    description: "A pocket-scale duck with the same moulded silhouette and hand-finished eyes as the larger editions.",
    accent: "#C9BEB2",
  },
  classic: {
    title: "Classic",
    size: "10–25 cm",
    comparison: "bathroom-sized",
    audience: "Kids, bathroom, office",
    edition: "Edition 02 — Permanent collection",
    description: "The everyday bathroom-sized duck, made for shelves, desks and other places where ducks belong.",
    accent: "#B8C6CA",
  },
  designer: {
    title: "Designer",
    size: "15–30 cm",
    comparison: "cat-sized",
    audience: "Illustrator collaborations, limited runs",
    edition: "Edition 03 — Limited release",
    description: "A cat-sized edition for illustrated editions and small-run collaborations.",
    accent: "#C8BDC7",
  },
  mega: {
    title: "Mega",
    size: "50–120 cm",
    comparison: "statement-sized",
    audience: "Photo objects, displays, statement gifts",
    edition: "Edition 04 — Studio series",
    description: "A statement-scale duck designed for photography, shop windows and memorable interiors.",
    accent: "#A9B8B4",
  },
  architect: {
    title: "Architect",
    size: "1.5–3 m",
    comparison: "bear-sized",
    audience: "Installations, events, weddings, branded spaces",
    edition: "Edition 05 — Bespoke installation",
    description: "An architectural duck built for installations, events and permanently scaled spaces.",
    accent: "#899995",
  },
};

const productOrder = Object.keys(productData);
const taxonomyItems = [...document.querySelectorAll(".taxonomy-item")];
const productTriggers = [...document.querySelectorAll("[data-product-target]")];

const existingModal = document.getElementById("product-modal");
const modal = existingModal?.tagName === "DIALOG"
  ? existingModal
  : document.createElement("dialog");

if (existingModal && modal !== existingModal) {
  modal.id = existingModal.id;
  modal.setAttribute("class", existingModal.getAttribute("class") || "");
  existingModal.replaceWith(modal);
} else if (!existingModal) {
  modal.id = "product-modal";
  document.body.append(modal);
}

modal.hidden = true;
modal.setAttribute("aria-hidden", "true");
modal.setAttribute("aria-labelledby", "product-modal-title");
modal.setAttribute("aria-describedby", "product-modal-description");
modal.style.cssText = "position:fixed;inset:0;width:100vw;max-width:none;height:100vh;height:100dvh;max-height:none;margin:0;padding:clamp(1rem,4vw,3rem);border:0;box-sizing:border-box;overflow:hidden;background:transparent;color:#242C2B;display:grid;opacity:1;pointer-events:auto;";

const backdropStyle = document.createElement("style");
backdropStyle.textContent = "#product-modal::backdrop{background:rgba(36,44,43,.48);backdrop-filter:blur(5px);}";
document.head.append(backdropStyle);

modal.innerHTML = `
  <div style="position:relative;width:min(760px,100%);max-height:calc(100dvh - 2rem);margin:auto;padding:clamp(1.25rem,4vw,2.5rem);overflow:auto;box-sizing:border-box;background:rgba(241,239,234,.98);border:1px solid rgba(36,44,43,.24);border-top:4px solid #CDD6DA;box-shadow:0 24px 80px rgba(36,44,43,.18);">
    <button class="button" type="button" style="position:absolute;top:1rem;right:1rem;z-index:2;width:auto;min-width:5.5rem;padding:.65rem .9rem;font-size:.68rem;" aria-label="Close product details">Close</button>
    <div aria-live="polite" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(1.5rem,4vw,3rem);align-items:start;">
      <div style="min-height:300px;overflow:hidden;background:#DED7D0;">
        <img style="display:block;width:100%;height:100%;min-height:300px;object-fit:cover;filter:saturate(.72) contrast(.92);" alt="">
      </div>
      <div style="padding-top:2.6rem;">
        <p id="product-modal-kicker" style="margin:0 0 .8rem;color:#69706C;font-size:.72rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;"></p>
        <h2 id="product-modal-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:clamp(2.25rem,6vw,4rem);font-weight:400;line-height:1;"></h2>
        <p style="margin:1rem 0 0;font-size:1.25rem;"><span id="product-modal-size"></span> <span id="product-modal-comparison" style="color:#69706C;"></span></p>
        <p id="product-modal-description" style="margin:1.4rem 0;max-width:34rem;line-height:1.6;"></p>
        <dl style="display:grid;gap:.85rem;margin:1.5rem 0 0;padding-top:1.25rem;border-top:1px solid rgba(36,44,43,.18);">
          <div style="display:grid;grid-template-columns:5.5rem 1fr;gap:1rem;">
            <dt style="color:#69706C;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;">Edition</dt>
            <dd id="product-modal-edition" style="margin:0;"></dd>
          </div>
          <div style="display:grid;grid-template-columns:5.5rem 1fr;gap:1rem;">
            <dt style="color:#69706C;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;">For</dt>
            <dd id="product-modal-audience" style="margin:0;"></dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
`;

const refs = {
  panel: modal.firstElementChild,
  close: modal.querySelector("button"),
  image: modal.querySelector("img"),
  imageWrap: modal.querySelector("img")?.parentElement,
  kicker: modal.querySelector("#product-modal-kicker"),
  title: modal.querySelector("#product-modal-title"),
  size: modal.querySelector("#product-modal-size"),
  comparison: modal.querySelector("#product-modal-comparison"),
  description: modal.querySelector("#product-modal-description"),
  edition: modal.querySelector("#product-modal-edition"),
  audience: modal.querySelector("#product-modal-audience"),
};

let lastTrigger = null;
let previousOverflow = "";

const fallbackData = (trigger) => {
  const sizeNode = trigger.querySelector(".taxonomy-size");
  const sizeCopy = sizeNode?.cloneNode(true);
  sizeCopy?.querySelector(".taxonomy-comparison")?.remove();

  return {
    title: trigger.querySelector(".taxonomy-line")?.textContent.trim() || "Quacktory edition",
    size: sizeCopy?.textContent.replace(/\s+/g, " ").trim() || "Made to order",
    comparison: sizeNode?.querySelector(".taxonomy-comparison")?.textContent.replace(/[()]/g, "").trim() || "",
    audience: trigger.querySelector(".taxonomy-audience")?.textContent.trim() || "Objects, gifts and installations",
    edition: "Quacktory collection",
    description: "A considered duck from the Quacktory size ladder, formed as a single piece and finished by hand.",
    accent: "#CDD6DA",
  };
};

const updateActiveItem = (trigger) => {
  const activeItem = trigger.closest(".taxonomy-item");

  taxonomyItems.forEach((item) => {
    const active = item === activeItem;
    item.classList.toggle("is-active", active);
    item.setAttribute("data-active", String(active));
  });

  productTriggers.forEach((item) => {
    item.setAttribute("aria-expanded", String(item === trigger));
    if (item === trigger) item.setAttribute("aria-current", "true");
    else item.removeAttribute("aria-current");
  });
};

const openProduct = (trigger) => {
  const key = trigger.dataset.productTarget || "";
  const data = productData[key] || fallbackData(trigger);
  const index = productOrder.indexOf(key);
  const imageNode = trigger.querySelector(".taxonomy-image");
  const imageSource = imageNode?.currentSrc || imageNode?.src || "";

  refs.kicker.textContent = index >= 0
    ? `Size ladder · ${String(index + 1).padStart(2, "0")} / ${String(productOrder.length).padStart(2, "0")}`
    : "Quacktory collection";
  refs.title.textContent = data.title;
  refs.size.textContent = data.size;
  refs.comparison.textContent = data.comparison ? `(${data.comparison})` : "";
  refs.description.textContent = data.description;
  refs.edition.textContent = data.edition;
  refs.audience.textContent = data.audience;
  refs.panel.style.borderTopColor = data.accent;
  refs.image.alt = `${data.title} duck`;
  refs.image.src = imageSource;
  refs.image.hidden = !imageSource;
  refs.imageWrap.hidden = !imageSource;

  lastTrigger = trigger;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  updateActiveItem(trigger);

  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("is-open");
  modal.dataset.product = key;

  if (!modal.open) {
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
  }

  requestAnimationFrame(() => refs.close.focus({ preventScroll: true }));
};

const finishClose = () => {
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("is-open");
  document.body.style.overflow = previousOverflow;
  if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
  lastTrigger = null;
};

const closeProduct = () => {
  if (modal.open && typeof modal.close === "function") modal.close();
  else {
    modal.removeAttribute("open");
    finishClose();
  }
};

refs.close.addEventListener("click", closeProduct);
modal.addEventListener("close", finishClose);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProduct();
});
modal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeProduct();
});
refs.image.addEventListener("error", () => {
  refs.image.hidden = true;
  refs.imageWrap.hidden = true;
});

productTriggers.forEach((trigger) => {
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");

  const activate = (event) => {
    event.preventDefault();
    openProduct(trigger);
  };

  trigger.addEventListener("click", activate);

  if (trigger.tagName !== "BUTTON" && trigger.tagName !== "A") {
    trigger.setAttribute("role", "button");
    trigger.tabIndex = 0;
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") activate(event);
    });
  }
});

const revealNodes = [...document.querySelectorAll(".reveal")];
const heroRevealNodes = [...document.querySelectorAll(".hero__content .reveal")];

heroRevealNodes.forEach((node, index) => {
  node.style.transitionDelay = `${index * 90}ms`;
});

const revealNode = (node) => {
  node.classList.add("is-visible");
  node.setAttribute("data-revealed", "true");
};

if (motionQuery.matches || !("IntersectionObserver" in window)) {
  revealNodes.forEach(revealNode);
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealNode(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  revealNodes.forEach((node) => revealObserver.observe(node));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    event.preventDefault();
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;

    if (motionQuery.matches) root.style.scrollBehavior = "auto";
    target.scrollIntoView({ behavior: motionQuery.matches ? "auto" : "smooth", block: "start" });
    if (motionQuery.matches) requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });

    try {
      history.pushState(null, "", hash);
    } catch {
      location.hash = hash;
    }
  });
});
