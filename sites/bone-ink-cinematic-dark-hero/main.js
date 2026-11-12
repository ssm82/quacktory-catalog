// file: main.js
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const rangeTrack = document.querySelector(".range-track");
const productCards = [...document.querySelectorAll(".range-card[data-product-trigger]")];
const productMap = new Map(productCards.map((card) => [card.dataset.product, card]));
const revealTargets = [...document.querySelectorAll(".section-heading, .range-panel, .production-heading-grid, .production-display, .method-row")];

const style = document.createElement("style");
style.textContent = `
  .site-nav .nav-link[aria-current="page"] { color: var(--fg); }
  .site-nav .nav-link[aria-current="page"]::after { transform: scaleX(1); }
  .index-link[aria-current="true"] { color: var(--fg); }
  .index-link[aria-current="true"] .index-number { color: var(--fg); }
  .ladder-step[aria-current="step"] .ladder-dot { background: var(--fg); transform: scale(1.35); box-shadow: 0 0 0 4px rgba(245,245,245,.08); }
  .ladder-step[aria-current="step"] .ladder-label { color: var(--fg); }
  #product-dialog { width: min(720px, calc(100vw - 32px)); max-height: calc(100dvh - 32px); padding: 0; overflow: auto; border: 1px solid var(--line-bright); background: var(--surface); color: var(--fg); box-shadow: 0 30px 100px rgba(0,0,0,.75); }
  #product-dialog::backdrop { background: rgba(0,0,0,.82); backdrop-filter: blur(6px); }
  #product-dialog-frame { position: relative; padding: clamp(24px, 4vw, 48px); }
  #product-dialog-close { position: absolute; top: 18px; right: 18px; z-index: 2; width: auto; min-height: 40px; padding: 0 14px; cursor: pointer; }
  #product-dialog-close span { font-size: 1.25rem; line-height: 1; }
  #product-dialog-kicker { margin: 0 100px 12px 0; }
  #product-dialog-title { max-width: 590px; margin: 0; font-size: clamp(2.6rem, 8vw, 5rem); line-height: .92; }
  #product-dialog-media { height: clamp(190px, 31vw, 330px); margin: 28px 0; overflow: hidden; background: #090909; }
  #product-dialog-media img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.04); transition: transform 600ms var(--ease); }
  #product-dialog:hover #product-dialog-media img { transform: scale(1.015); }
  #product-dialog-description { max-width: 580px; margin: 0 0 28px; color: var(--muted); }
  #product-dialog-details { border-top: 1px solid var(--line); }
  #product-dialog-details .method-row, #product-dialog-accent-row { display: grid; grid-template-columns: minmax(96px, .32fr) 1fr; gap: 24px; padding: 12px 0; border-bottom: 1px solid var(--line); }
  #product-dialog-details .method-name, #product-dialog-accent-row .method-name { color: var(--muted); }
  #product-dialog-details .method-process, #product-dialog-accent-row .method-process { color: var(--fg); font-size: .82rem; line-height: 1.5; letter-spacing: 0; text-transform: none; }
  #product-dialog-accent-swatch { display: inline-block; width: 11px; height: 11px; margin-right: 9px; border: 1px solid var(--line-bright); background: var(--product-accent); vertical-align: middle; }
  @media (max-width: 560px) {
    #product-dialog { width: calc(100vw - 20px); max-height: calc(100dvh - 20px); }
    #product-dialog-details .method-row, #product-dialog-accent-row { grid-template-columns: 1fr; gap: 4px; }
  }
  @media (prefers-reduced-motion: reduce) { #product-dialog-media img { transition: none; } }
`;
document.head.append(style);

const dialog = document.createElement("dialog");
dialog.id = "product-dialog";
dialog.setAttribute("aria-labelledby", "product-dialog-title");
dialog.setAttribute("aria-describedby", "product-dialog-description");
dialog.innerHTML = `
  <div id="product-dialog-frame">
    <button id="product-dialog-close" class="outline-cta" type="button" aria-label="Close product details"><span aria-hidden="true">&times;</span></button>
    <p id="product-dialog-kicker" class="section-kicker">Size / edition / method</p>
    <h2 id="product-dialog-title" class="section-title"></h2>
    <div id="product-dialog-media"><img id="product-dialog-image" alt=""></div>
    <p id="product-dialog-description" class="section-intro"></p>
    <div id="product-dialog-details"></div>
    <div id="product-dialog-accent-row" class="method-row">
      <span class="method-name">Accent</span>
      <span class="method-process"><span id="product-dialog-accent-swatch" aria-hidden="true"></span><span id="product-dialog-accent-name"></span></span>
    </div>
  </div>
`;
document.body.append(dialog);

const accents = {
  micro: ["#e8e8e8", "Chalk"],
  classic: ["#d7d7d7", "Silver"],
  designer: ["#c7c7c7", "Graphite"],
  mega: ["#b8b8b8", "Smoke"],
  architect: ["#f5f5f5", "Museum white"]
};
const priceLabels = { impulse: "Impulse", mid: "Mid", "mid+": "Mid +", premium: "Premium", contract: "Contract" };
let activeProduct = productCards[0]?.dataset.product || "";
let returnFocus = null;
let previousBodyOverflow = "";
let closing = false;

function setActiveProduct(key) {
  if (!key) return;
  activeProduct = key;
  document.querySelectorAll(".ladder-step").forEach((step) => {
    if (step.dataset.rangeTarget === `product-${key}`) step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
  });
  document.querySelectorAll(".index-link").forEach((link) => {
    if (link.getAttribute("href") === `#product-${key}`) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

function scrollToPanel(card) {
  const panel = card?.closest(".range-panel");
  if (!panel) return;
  const behavior = reducedMotion.matches ? "auto" : "smooth";
  if (rangeTrack && rangeTrack.scrollWidth > rangeTrack.clientWidth + 4) {
    const trackRect = rangeTrack.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const left = rangeTrack.scrollLeft + panelRect.left - trackRect.left - (rangeTrack.clientWidth - panelRect.width) / 2;
    rangeTrack.scrollTo({ left: Math.max(0, left), behavior });
  } else {
    panel.scrollIntoView({ behavior, block: "center" });
  }
}

function openProduct(card, opener) {
  const data = card.dataset;
  const title = data.title || card.querySelector(".range-name")?.textContent || "Product";
  const size = data.size || "—";
  const audience = data.audience || "Collectors and admirers";
  const method = data.method || "Moulded rubber";
  const cycle = data.cycle || "Made to order";
  const accent = accents[data.product] || ["#f5f5f5", "Museum white"];
  const sourceImage = card.querySelector(".range-image");
  const image = dialog.querySelector("#product-dialog-image");

  dialog.style.setProperty("--product-accent", accent[0]);
  dialog.querySelector("#product-dialog-title").textContent = title;
  dialog.querySelector("#product-dialog-description").textContent = `${title} is a ${size} duck for ${audience}. It is produced by ${method} at ${cycle}.${data.leadTime ? ` Lead time: ${data.leadTime}.` : ""}${data.age ? ` Use note: ${data.age}.` : ""}`;
  dialog.querySelector("#product-dialog-accent-name").textContent = accent[1];
  image.src = sourceImage?.src || "";
  image.alt = sourceImage?.alt || `${title} — ${size}`;

  const rows = [
    ["Size", size],
    ["Audience", audience],
    ["Price position", priceLabels[data.pricePositioning] || data.pricePositioning],
    ["Method", method],
    ["Cycle", cycle],
    ["Lead time", data.leadTime],
    ["Age / use", data.age]
  ].filter(([, value]) => value);

  const details = dialog.querySelector("#product-dialog-details");
  details.replaceChildren(...rows.map(([label, value]) => {
    const row = document.createElement("div");
    row.className = "method-row";
    const name = document.createElement("span");
    name.className = "method-name";
    name.textContent = label;
    const content = document.createElement("span");
    content.className = "method-process";
    content.textContent = value;
    row.append(name, content);
    return row;
  }));

  returnFocus = opener instanceof HTMLElement ? opener : document.activeElement;
  if (!dialog.open) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  if (!reducedMotion.matches && dialog.animate) {
    dialog.animate(
      [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 280, easing: "cubic-bezier(.22,1,.36,1)" }
    );
  }
  requestAnimationFrame(() => dialog.querySelector("#product-dialog-close").focus({ preventScroll: true }));
}

function activateProduct(key, opener, shouldScroll = true) {
  const card = productMap.get(key);
  if (!card) return;
  setActiveProduct(key);
  if (shouldScroll) scrollToPanel(card);
  openProduct(card, opener);
}

function closeDialog() {
  if (!dialog.open || closing) return;
  closing = true;
  const finish = () => {
    if (typeof dialog.close === "function") dialog.close();
    else {
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("close"));
    }
    closing = false;
  };
  if (reducedMotion.matches || !dialog.animate) finish();
  else {
    const animation = dialog.animate(
      [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(10px)" }],
      { duration: 180, easing: "ease-in" }
    );
    animation.finished.then(finish).catch(finish);
  }
}

dialog.querySelector("#product-dialog-close").addEventListener("click", closeDialog);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) closeDialog();
});
dialog.addEventListener("close", () => {
  document.body.style.overflow = previousBodyOverflow;
  returnFocus?.focus({ preventScroll: true });
});

productCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    activateProduct(card.dataset.product, card, false);
  });
});

document.querySelectorAll(".index-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const id = link.getAttribute("href").slice(1);
    const key = id.startsWith("product-") ? id.slice(8) : id;
    activateProduct(key, link, true);
    try { history.replaceState(null, "", link.getAttribute("href")); } catch {}
  });
});

document.querySelectorAll(".ladder-step").forEach((step) => {
  step.addEventListener("click", (event) => {
    event.preventDefault();
    const key = step.dataset.rangeTarget.replace("product-", "");
    activateProduct(key, step, true);
  });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest?.('a[href^="#"]');
  if (!link || link.classList.contains("index-link")) return;
  const target = document.getElementById(decodeURIComponent(link.getAttribute("href").slice(1)));
  if (!target) return;
  event.preventDefault();
  const header = document.querySelector(".site-header");
  const offset = header ? header.getBoundingClientRect().height + 16 : 0;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  window.scrollTo({ top, behavior: reducedMotion.matches ? "auto" : "smooth" });
  try { history.replaceState(null, "", link.getAttribute("href")); } catch {}
});

if (rangeTrack) {
  rangeTrack.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const focusedCard = document.activeElement.closest?.(".range-card");
    if (!focusedCard) return;
    const index = productCards.indexOf(focusedCard);
    const next = productCards[index + (event.key === "ArrowRight" ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    next.focus({ preventScroll: true });
    scrollToPanel(next);
  });
}

setActiveProduct(activeProduct);
if (rangeTrack && "IntersectionObserver" in window) {
  const rangeObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    const card = visible?.target.querySelector(".range-card");
    if (card) setActiveProduct(card.dataset.product);
  }, { root: rangeTrack, threshold: [0.45, 0.65] });
  document.querySelectorAll(".range-panel").forEach((panel) => rangeObserver.observe(panel));
}

const navLinks = [...document.querySelectorAll('.site-nav .nav-link[href^="#"]')];
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries.find((entry) => entry.isIntersecting);
    if (!visible) return;
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${visible.target.id}`) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-30% 0px -60%", threshold: 0 });
  navLinks.forEach((link) => {
    const section = document.getElementById(link.getAttribute("href").slice(1));
    if (section) navObserver.observe(section);
  });
}

function animateReveal(element, delay = 0) {
  if (!element.animate) return;
  const animation = element.animate(
    [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 620, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }
  );
  animation.finished.then(() => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("transform");
    animation.cancel();
  }).catch(() => {});
}

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  revealTargets.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(14px)";
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealObserver.unobserve(entry.target);
      const delay = entry.target.classList.contains("method-row") ? (index % 5) * 45 : entry.target.classList.contains("range-panel") ? index * 40 : 0;
      animateReveal(entry.target, delay);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => animateReveal(element));
}

requestAnimationFrame(() => {
  const heroItems = [...document.querySelectorAll(".hero-copy > *")];
  heroItems.forEach((element, index) => {
    if (!element.animate || reducedMotion.matches) return;
    const frames = element.classList.contains("hero-title")
      ? [{ opacity: 0, transform: "translateY(16px)", clipPath: "inset(0 0 100% 0)" }, { opacity: 1, transform: "translateY(0)", clipPath: "inset(0 0 0% 0)" }]
      : [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }];
    element.animate(frames, { duration: 680, delay: index * 100, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
  });
});
