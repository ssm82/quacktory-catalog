// file: main.js
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const all = (selector, root = document) => [...root.querySelectorAll(selector)];

function animate(element, frames, options = {}) {
  if (!element || typeof element.animate !== "function") return null;
  return element.animate(frames, {
    fill: "both",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    ...options
  });
}

const modalStyle = document.createElement("style");
modalStyle.textContent = `
dialog[data-product-dialog]{position:fixed;inset:0;z-index:120;width:min(900px,calc(100vw - 32px));max-width:none;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);margin:auto;padding:0;overflow:hidden;border:1px solid rgba(168,138,85,.58);border-radius:0;background:#11110f;color:#d8d0c2;font-family:var(--body);box-shadow:0 32px 100px rgba(0,0,0,.82)}
dialog[data-product-dialog]::backdrop{background:rgba(4,5,4,.86);backdrop-filter:blur(8px)}
dialog[data-product-dialog]>div{display:grid;grid-template-columns:minmax(280px,.88fr) minmax(340px,1.12fr);min-height:min(620px,calc(100vh - 32px));min-height:min(620px,calc(100dvh - 32px));max-height:min(820px,calc(100vh - 32px));max-height:min(820px,calc(100dvh - 32px));overflow:auto;background:linear-gradient(135deg,rgba(32,33,30,.96),rgba(9,10,8,.98))}
dialog[data-product-dialog] [data-role="visual"]{position:relative;min-height:620px;margin:0;overflow:hidden;background:radial-gradient(circle at 50% 42%,rgba(168,138,85,.22),transparent 58%),#090a08}
dialog[data-product-dialog] [data-role="visual"]::after{position:absolute;inset:0;content:"";background:linear-gradient(90deg,transparent 45%,rgba(9,10,8,.72)),linear-gradient(0deg,rgba(9,10,8,.8),transparent 38%);pointer-events:none}
dialog[data-product-dialog] [data-role="image"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:sepia(.2) saturate(.65) contrast(1.08) brightness(.78)}
dialog[data-product-dialog] figcaption{position:absolute;z-index:1;right:28px;bottom:25px;left:28px;color:#a49d8e;font-size:11px;letter-spacing:.18em;text-transform:uppercase}
dialog[data-product-dialog] [data-role="content"]{overflow-y:auto;padding:58px 42px 38px}
dialog[data-product-dialog] [data-role="eyebrow"]{margin:0 0 15px;color:var(--product-accent,#a88a55);font-size:11px;letter-spacing:.23em;text-transform:uppercase}
dialog[data-product-dialog] h2{margin:0;color:#d8d0c2;font-family:var(--display);font-size:clamp(44px,6vw,74px);font-weight:500;letter-spacing:.06em;line-height:.9;text-transform:uppercase}
dialog[data-product-dialog] [data-role="size"]{margin:13px 0 0;color:#a88a55;font-size:15px;letter-spacing:.16em;text-transform:uppercase}
dialog[data-product-dialog] [data-role="intro"]{margin:25px 0 30px;color:#a49d8e;font-size:17px;line-height:1.55}
dialog[data-product-dialog] [data-role="details"]{margin:0;border-top:1px solid rgba(216,208,194,.16)}
dialog[data-product-dialog] [data-role="details"]>div{display:grid;grid-template-columns:116px minmax(0,1fr);gap:16px;padding:12px 0;border-bottom:1px solid rgba(216,208,194,.12)}
dialog[data-product-dialog] dt{color:#8a6a3b;font-size:11px;letter-spacing:.15em;text-transform:uppercase}
dialog[data-product-dialog] dd{margin:0;color:#c7c0b3;font-size:14px;line-height:1.45}
dialog[data-product-dialog] [data-role="ladder"]{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin-top:30px;padding:0 24px;border:1px solid #d8d0c2;background:#d8d0c2;color:#11110f;font-size:12px;letter-spacing:.16em;text-transform:uppercase;transition:transform 220ms var(--ease),filter 220ms var(--ease)}
dialog[data-product-dialog] [data-role="ladder"]:hover{transform:translateY(-2px);filter:brightness(1.08)}
dialog[data-product-dialog] [data-role="close"]{position:absolute;z-index:5;top:16px;right:16px;width:42px;height:42px;padding:0;border:1px solid rgba(216,208,194,.35);border-radius:0;background:rgba(9,10,8,.72);color:#d8d0c2;font-size:25px;font-weight:300;line-height:1;cursor:pointer;transition:border-color 220ms ease,transform 220ms ease}
dialog[data-product-dialog] [data-role="close"]:hover{border-color:#a88a55;transform:rotate(4deg)}
.scale-stop[aria-current="true"] .scale-stop__stage{outline:1px solid rgba(168,138,85,.58);outline-offset:-1px}
.scale-stop[aria-current="true"] .duck-trigger__glow{opacity:1!important}
@media(max-width:680px){dialog[data-product-dialog]>div{grid-template-columns:1fr;min-height:0;max-height:calc(100dvh - 24px)}dialog[data-product-dialog] [data-role="visual"]{min-height:250px;height:250px}dialog[data-product-dialog] [data-role="content"]{padding:38px 24px 28px}dialog[data-product-dialog] [data-role="details"]>div{grid-template-columns:96px minmax(0,1fr);gap:12px}}
`;
(document.head || document.documentElement).append(modalStyle);

const productDialog = document.createElement("dialog");
productDialog.setAttribute("data-product-dialog", "");
productDialog.setAttribute("aria-labelledby", "product-dialog-title");

const modalPanel = document.createElement("div");
const modalVisual = document.createElement("figure");
modalVisual.setAttribute("data-role", "visual");
const modalImage = document.createElement("img");
modalImage.setAttribute("data-role", "image");
modalImage.alt = "";
const modalCaption = document.createElement("figcaption");
const modalContent = document.createElement("section");
modalContent.setAttribute("data-role", "content");
const modalEyebrow = document.createElement("p");
modalEyebrow.setAttribute("data-role", "eyebrow");
const modalTitle = document.createElement("h2");
modalTitle.id = "product-dialog-title";
const modalSize = document.createElement("p");
modalSize.setAttribute("data-role", "size");
const modalIntro = document.createElement("p");
modalIntro.setAttribute("data-role", "intro");
const modalDetails = document.createElement("dl");
modalDetails.setAttribute("data-role", "details");
const modalLadder = document.createElement("a");
modalLadder.className = "button button--primary";
modalLadder.setAttribute("data-role", "ladder");
modalLadder.textContent = "View on the size ladder";
const modalClose = document.createElement("button");
modalClose.type = "button";
modalClose.setAttribute("data-role", "close");
modalClose.setAttribute("aria-label", "Close details");
modalClose.textContent = "×";

modalVisual.append(modalImage, modalCaption);
modalContent.append(modalEyebrow, modalTitle, modalSize, modalIntro, modalDetails, modalLadder);
modalPanel.append(modalVisual, modalContent);
productDialog.append(modalPanel, modalClose);
document.body.append(productDialog);

const triggers = all(".duck-trigger");
const scaleStops = all(".scale-stop");
const accentMap = {
  micro: "#b89a62",
  classic: "#a88a55",
  designer: "#957542",
  mega: "#737a71",
  architect: "#b09a70"
};
let lastTrigger = null;
let previousBodyOverflow = "";

function setActiveStop(id) {
  scaleStops.forEach((stop) => {
    if (stop.id === id) stop.setAttribute("aria-current", "true");
    else stop.removeAttribute("aria-current");
  });
}

function populateDetails(values) {
  modalDetails.replaceChildren();
  values.forEach(([label, value]) => {
    if (!value) return;
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = value;
    row.append(term, detail);
    modalDetails.append(row);
  });
}

function openProductDialog(trigger) {
  const data = trigger.dataset;
  const product = data.product || "";
  const title = data.line || "Edition";
  const comparison = (data.comparison || "considered").replace(/[()]/g, "");
  const audience = data.audience || "collectors, studios and architectural spaces";

  modalTitle.textContent = title;
  modalSize.textContent = data.size || "Made to specification";
  modalEyebrow.textContent = "Collector’s edition / field specification";
  modalIntro.textContent = `${title} is a ${data.size || "custom"} edition with ${comparison} proportions, conceived for ${audience}.`;
  modalCaption.textContent = `${title} / ${(data.size || "Custom").toUpperCase()}`;
  modalLadder.href = `#${product}`;
  productDialog.style.setProperty("--product-accent", accentMap[product] || "#a88a55");

  const sourceImage = trigger.querySelector("img");
  modalImage.src = sourceImage?.currentSrc || sourceImage?.src || "";
  modalImage.alt = sourceImage?.alt || `${title} duck`;
  modalImage.hidden = !modalImage.src;

  populateDetails([
    ["Edition", title],
    ["Size", data.size],
    ["Comparison", comparison],
    ["Best for", data.audience],
    ["Price", data.price],
    ["Material", data.material],
    ["Moulding", data.moulding],
    ["Tooling", data.tooling],
    ["Cycle", data.cycle],
    ["Lead time", data.lead],
    ["Quality", data.quality],
    ["Use / safety", data.age]
  ]);

  lastTrigger = trigger;
  setActiveStop(product);
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  if (!productDialog.open) {
    if (typeof productDialog.showModal === "function") productDialog.showModal();
    else productDialog.setAttribute("open", "");
  }
  if (!prefersReducedMotion.matches) {
    animate(productDialog, [
      { opacity: 0, transform: "translateY(18px) scale(.985)" },
      { opacity: 1, transform: "translateY(0) scale(1)" }
    ], { duration: 380 });
  }
  requestAnimationFrame(() => modalClose.focus());
}

function closeProductDialog() {
  if (!productDialog.open) return;
  if (typeof productDialog.close === "function") productDialog.close();
  else {
    productDialog.removeAttribute("open");
    document.body.style.overflow = previousBodyOverflow;
  }
}

productDialog.addEventListener("close", () => {
  document.body.style.overflow = previousBodyOverflow;
  if (lastTrigger) {
    try { lastTrigger.focus({ preventScroll: true }); }
    catch { lastTrigger.focus(); }
  }
});
productDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeProductDialog();
});
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) closeProductDialog();
});
modalClose.addEventListener("click", closeProductDialog);
modalLadder.addEventListener("click", (event) => {
  event.preventDefault();
  const target = document.getElementById(productDialog.querySelector('[data-role="ladder"]').hash.slice(1));
  closeProductDialog();
  try { history.pushState(null, "", modalLadder.hash); } catch {}
  requestAnimationFrame(() => target?.scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start"
  }));
});

triggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openProductDialog(trigger);
  });
  const glow = trigger.querySelector(".duck-trigger__glow");
  if (glow) {
    trigger.addEventListener("pointerenter", () => { glow.style.opacity = "1"; });
    trigger.addEventListener("pointerleave", () => { glow.style.opacity = ""; });
    trigger.addEventListener("focus", () => { glow.style.opacity = "1"; });
    trigger.addEventListener("blur", () => { glow.style.opacity = ""; });
  }
});

all(".side-selector").forEach((selector) => {
  const product = selector.getAttribute("href")?.replace("#", "");
  const trigger = triggers.find((item) => item.dataset.product === product);
  if (!trigger) return;
  selector.addEventListener("click", (event) => {
    event.preventDefault();
    openProductDialog(trigger);
  });
});

const menuButton = document.querySelector(".menu-control");
const menu = document.querySelector(".site-menu");
const menuLines = all(".menu-control__line");
let menuOpen = false;

function setMenu(open) {
  menuOpen = open;
  menu?.classList.toggle("is-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  if (menuLines[0]) menuLines[0].style.transform = open ? "translateY(7px) rotate(45deg)" : "";
  if (menuLines[1]) menuLines[1].style.opacity = open ? "0" : "";
  if (menuLines[2]) menuLines[2].style.transform = open ? "translateY(-7px) rotate(-45deg)" : "";
}

menuButton?.addEventListener("click", () => setMenu(!menuOpen));
document.addEventListener("click", (event) => {
  if (menuOpen && !menu?.contains(event.target) && !menuButton?.contains(event.target)) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (productDialog.open) {
    event.preventDefault();
    closeProductDialog();
  } else if (menuOpen) {
    setMenu(false);
    menuButton?.focus();
  }
});

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || !(event.target instanceof Element)) return;
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.closest("dialog")) return;
  const id = link.getAttribute("href").slice(1);
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  event.preventDefault();
  setMenu(false);
  target.scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start"
  });
  try { history.pushState(null, "", `#${id}`); } catch {}
});

const revealTargets = all(".scale-stop, .production-fact, .pigment-visual, .production-section__layout, .custom-section__layout");
if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target, [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 650 });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  revealTargets.forEach((target) => {
    target.style.opacity = "0";
    observer.observe(target);
  });
}

requestAnimationFrame(() => {
  if (prefersReducedMotion.matches) return;
  all(".hero__title-line").forEach((line, index) => {
    animate(line, [
      { opacity: 0, transform: "translateY(20px) scale(.98)", filter: "blur(7px)" },
      { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" }
    ], { duration: 720, delay: index * 105 });
  });
  animate(document.querySelector(".hero__manifesto"), [
    { opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }
  ], { duration: 600, delay: 250 });
  animate(document.querySelector(".hero__divider"), [
    { opacity: 0, transform: "scaleX(0)" }, { opacity: 1, transform: "scaleX(1)" }
  ], { duration: 650, delay: 340 });
  animate(document.querySelector(".hero__actions"), [
    { opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }
  ], { duration: 600, delay: 430 });
  animate(document.querySelector(".hero__tail"), [
    { opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }
  ], { duration: 600, delay: 550 });
  animate(document.querySelector(".hero__media-image"), [
    { transform: "scale(1.035) translate3d(-.35%,0,0)" },
    { transform: "scale(1.065) translate3d(.35%,-.6%,0)" }
  ], { duration: 22000, iterations: Infinity, direction: "alternate", easing: "linear" });
});
