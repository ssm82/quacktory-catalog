// file: main.js
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

const catalog = {
  micro: {
    title: "Micro", size: "4–8 cm", scale: "Thumb-sized", use: "Keychains · merch · gifts",
    age: "6+", material: "Food-grade silicone", lead: "3 weeks", price: "Impulse",
    edition: "Core range / 01", accent: "#4a8cff",
    description: "Our smallest duck: a precise, palm-sized rubber companion made for pockets, keychains and small gifts."
  },
  classic: {
    title: "Classic", size: "10–25 cm", scale: "Kid-sized", use: "Kids · bathroom · office",
    age: "3+", material: "Food-grade silicone", lead: "3 weeks", price: "Mid",
    edition: "Core range / 02", accent: "#245bff",
    description: "The original shelf duck. Uncompromisingly round, made to live on a desk and remain recognisable from across the room."
  },
  designer: {
    title: "Designer", size: "15–30 cm", scale: "Cat-sized", use: "Illustrator collabs · limited runs",
    age: "6+", material: "Natural rubber + EPDM", lead: "6 weeks", price: "Mid+",
    edition: "Limited edition / 03", accent: "#6f8cff",
    description: "A sharper silhouette for collector shelves, artist collaborations and limited releases that deserve their own spotlight."
  },
  mega: {
    title: "Mega", size: "50–120 cm", scale: "Photo-object-sized", use: "Photo objects · shop-window displays",
    age: "Not a toy", material: "Natural rubber + EPDM", lead: "6 weeks", price: "Premium",
    edition: "Display range / 04", accent: "#2d6bff",
    description: "A cinematic rubber duck built for lobbies, campaigns and shop windows. Presence first; toy shelf optional."
  },
  architect: {
    title: "Architect", size: "1.5–3 m", scale: "Bear-sized", use: "Installations · events · weddings",
    age: "Installation", material: "Natural rubber + EPDM", lead: "12 weeks", price: "Price on request",
    edition: "Commission range / 05", accent: "#ff3b0a",
    description: "A room-sized duck with engineered proportions, delivered as a full installation with a project-specific spec sheet."
  }
};

const make = (tag, text = "", styles = {}) => {
  const element = document.createElement(tag);
  element.textContent = text;
  Object.assign(element.style, styles);
  return element;
};

let modal = document.getElementById("product-dialog");
if (!modal) {
  modal = document.createElement("dialog");
  modal.id = "product-dialog";
  document.body.append(modal);
}

modal.setAttribute("role", "dialog");
modal.setAttribute("aria-modal", "true");
modal.setAttribute("aria-labelledby", "product-dialog-title");
Object.assign(modal.style, {
  position: "fixed", inset: "0", zIndex: "2000", width: "100vw", height: "100vh",
  maxWidth: "none", maxHeight: "none", margin: "0", padding: "0", border: "0",
  background: "transparent", overflow: "hidden", display: "none", opacity: "0",
  visibility: "hidden", pointerEvents: "none"
});

let modalOpen = false;
let modalPanel;
let modalMedia;
let modalSpecs;
let previousFocus;
let previousOverflow;
let activeTrigger;

function readText(root, className) {
  return root?.querySelector(`.${className}`)?.textContent.trim() || "";
}

function productData(key, trigger) {
  const item = catalog[key] || catalog.classic;
  const source = trigger?.matches(".product-trigger")
    ? trigger
    : document.querySelector(`.product-trigger[data-product="${key}"]`);
  const image = source?.querySelector(".product-frame img")?.getAttribute("src")
    || `./assets/product-${key}.jpg`;

  return {
    ...item,
    title: readText(source, "product-line") || item.title,
    size: readText(source, "product-size") || item.size,
    scale: readText(source, "product-comparison") || item.scale,
    use: readText(source, "product-audience") || item.use,
    age: readText(source, "product-age") || item.age,
    price: readText(source, "price-figure") || item.price,
    lead: readText(source, "product-lead") || item.lead,
    image
  };
}

function applyPanelLayout() {
  if (!modalPanel || !modalMedia) return;
  const compact = window.innerWidth < 700;
  modalPanel.style.width = compact ? "calc(100vw - 20px)" : "min(940px, calc(100vw - 32px))";
  modalPanel.style.gridTemplateColumns = compact ? "1fr" : "minmax(280px, .86fr) minmax(0, 1.14fr)";
  modalMedia.style.minHeight = compact ? "250px" : "500px";
  modalMedia.style.height = compact ? "250px" : "auto";
  if (modalSpecs) modalSpecs.style.gridTemplateColumns = compact ? "1fr" : "repeat(2, minmax(0, 1fr))";
}

function renderProduct(data) {
  modal.replaceChildren();

  const overlay = make("div", "", {
    position: "absolute", inset: "0", background: "rgba(2, 11, 29, .78)",
    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)"
  });
  overlay.addEventListener("click", closeProduct);

  modalPanel = make("article", "", {
    position: "relative", zIndex: "1", maxHeight: "calc(100vh - 32px)",
    overflow: "auto", display: "grid", color: "var(--fg)",
    background: "linear-gradient(145deg, #0b2a61 0%, #061735 100%)",
    border: "1px solid rgba(244,245,242,.16)", boxShadow: "0 30px 100px rgba(0,0,0,.55)",
    transform: "translateY(0)"
  });
  modalPanel.setAttribute("role", "document");
  modalPanel.style.setProperty("--accent", data.accent);

  const closeButton = make("button", "Close", {
    position: "absolute", top: "16px", right: "16px", zIndex: "3", minWidth: "64px",
    minHeight: "44px", padding: "10px 16px", border: "1px solid rgba(244,245,242,.28)",
    borderRadius: "0", background: "rgba(2,11,29,.78)", color: "var(--fg)",
    fontSize: ".62rem", fontWeight: "700", letterSpacing: ".18em", textTransform: "uppercase",
    cursor: "pointer", transition: "background 160ms ease, color 160ms ease, transform 160ms ease"
  });
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close product details");
  closeButton.addEventListener("click", closeProduct);
  closeButton.addEventListener("pointerenter", () => {
    closeButton.style.background = "var(--accent)";
    closeButton.style.color = "#020b1d";
    closeButton.style.transform = "translateY(-1px)";
  });
  closeButton.addEventListener("pointerleave", () => {
    closeButton.style.background = "rgba(2,11,29,.78)";
    closeButton.style.color = "var(--fg)";
    closeButton.style.transform = "";
  });

  modalMedia = make("div", "", {
    position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", padding: "clamp(30px, 5vw, 64px)",
    background: `radial-gradient(circle at 28% 24%, ${data.accent}66, transparent 55%), linear-gradient(145deg, #09245d, #020b1d)`
  });
  const image = make("img", "", {
    width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 22px 28px rgba(0,0,0,.42))",
    transition: "transform 500ms var(--ease)"
  });
  image.src = data.image;
  image.alt = `${data.title} — ${data.size}, ${data.scale}`;
  image.addEventListener("error", () => { image.style.opacity = "0"; });
  modalMedia.addEventListener("pointerenter", () => { image.style.transform = "scale(1.025)"; });
  modalMedia.addEventListener("pointerleave", () => { image.style.transform = "scale(1)"; });
  modalMedia.append(image);
  modalMedia.append(make("span", "QUACKTORY / RUBBER SERIES", {
    position: "absolute", left: "22px", bottom: "20px", color: "rgba(244,245,242,.66)",
    fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase"
  }));
  modalMedia.append(make("span", "", {
    position: "absolute", left: "0", top: "0", width: "100%", height: "4px", background: "var(--accent)"
  }));

  const content = make("div", "", {
    display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(30px, 5vw, 54px)"
  });
  content.append(make("p", `${data.edition} / ${String(Object.keys(catalog).indexOf(data.title.toLowerCase()) + 1 || 1).padStart(2, "0")}`, {
    margin: "0 0 20px", color: "rgba(244,245,242,.62)", fontSize: ".62rem",
    fontWeight: "600", letterSpacing: ".2em", textTransform: "uppercase"
  }));
  const title = make("h2", data.title, {
    margin: "0", color: "var(--fg)", fontFamily: "var(--display)", fontSize: "clamp(3.2rem, 8vw, 6.8rem)",
    lineHeight: ".82", letterSpacing: ".015em", textTransform: "uppercase"
  });
  title.id = "product-dialog-title";
  content.append(title);
  content.append(make("p", `${data.size} / ${data.scale}`, {
    margin: "22px 0 0", color: "var(--accent)", fontSize: ".72rem",
    fontWeight: "700", letterSpacing: ".16em", textTransform: "uppercase"
  }));
  content.append(make("p", data.description, {
    maxWidth: "46ch", margin: "22px 0 0", color: "rgba(244,245,242,.76)",
    fontSize: ".95rem", lineHeight: "1.7"
  }));

  modalSpecs = make("dl", "", {
    display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0 28px", margin: "32px 0 0"
  });
  [
    ["Best for", data.use], ["Material", data.material], ["Lead time", data.lead],
    ["Audience", data.age], ["Price", data.price], ["Edition", data.edition]
  ].forEach(([label, value]) => {
    const group = make("div", "", { padding: "15px 0", borderTop: "1px solid rgba(244,245,242,.12)" });
    group.append(make("dt", label, { color: "rgba(244,245,242,.48)", fontSize: ".56rem", letterSpacing: ".17em", textTransform: "uppercase" }));
    group.append(make("dd", value, { margin: "5px 0 0", color: "var(--fg)", fontSize: ".78rem" }));
    modalSpecs.append(group);
  });
  content.append(modalSpecs);

  const cta = make("a", `Ask about ${data.title}`, {
    alignSelf: "flex-start", minHeight: "48px", display: "inline-flex", alignItems: "center",
    justifyContent: "center", marginTop: "30px", padding: "13px 20px", color: "#020b1d",
    background: "var(--accent)", textDecoration: "none", fontSize: ".66rem", fontWeight: "700",
    letterSpacing: ".16em", textTransform: "uppercase", transition: "transform 160ms ease, filter 160ms ease"
  });
  cta.href = "#custom";
  cta.addEventListener("click", closeProduct);
  cta.addEventListener("pointerenter", () => { cta.style.transform = "translateY(-2px)"; cta.style.filter = "brightness(1.1)"; });
  cta.addEventListener("pointerleave", () => { cta.style.transform = ""; cta.style.filter = ""; });
  content.append(cta);

  modalPanel.append(modalMedia, content);
  modal.append(overlay, modalPanel, closeButton);
  applyPanelLayout();
}

function openProduct(key, trigger) {
  if (!key || !catalog[key]) return;
  activeTrigger = trigger;
  previousFocus = document.activeElement;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  renderProduct(productData(key, trigger));
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  if (modal instanceof HTMLDialogElement) {
    if (!modal.open) modal.showModal();
  }
  modal.style.display = "grid";
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
  modal.style.pointerEvents = "auto";
  modalOpen = true;
  trigger?.setAttribute("aria-expanded", "true");

  if (!reducedMotion.matches) {
    modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
    modalPanel.animate([
      { opacity: 0, transform: "translateY(22px) scale(.985)" },
      { opacity: 1, transform: "translateY(0) scale(1)" }
    ], { duration: 620, easing: ease });
  }
  requestAnimationFrame(() => modal.querySelector("button")?.focus());
}

function closeProduct() {
  if (!modalOpen) return;
  modalOpen = false;
  if (modal instanceof HTMLDialogElement && modal.open) modal.close();
  modal.style.display = "none";
  modal.style.opacity = "0";
  modal.style.visibility = "hidden";
  modal.style.pointerEvents = "none";
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = previousOverflow;
  activeTrigger?.setAttribute("aria-expanded", "false");
  previousFocus?.focus?.();
}

const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
let menuOpen = false;

function setMenu(open) {
  if (!menuButton || !mobileNav) return;
  menuOpen = open;
  menuButton.setAttribute("aria-expanded", String(open));
  mobileNav.hidden = !open;
}

menuButton?.addEventListener("click", () => setMenu(!menuOpen));
mobileNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));

document.addEventListener("click", event => {
  const trigger = event.target.closest?.("[data-open-product]");
  if (!trigger) return;
  event.preventDefault();
  setMenu(false);
  openProduct(trigger.dataset.openProduct, trigger);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (modalOpen) closeProduct();
    else if (menuOpen) setMenu(false);
  }
  if (event.key !== "Tab" || !modalOpen || !modalPanel) return;
  const focusable = [...modalPanel.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")];
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

document.addEventListener("click", event => {
  const link = event.target.closest?.("a[href^='#']");
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const id = decodeURIComponent(link.getAttribute("href").slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  try { history.pushState(null, "", `#${id}`); } catch { /* file protocol fallback */ }
});

window.addEventListener("resize", () => {
  if (modalOpen) applyPanelLayout();
});

if (!reducedMotion.matches) {
  [
    [".eyebrow", 0, 14], [".hero-title", 80, 90], [".accent-rule", 300, 0],
    [".manifesto-copy", 360, 24], [".hero-stage", 500, 28]
  ].forEach(([selector, delay, distance]) => {
    const element = document.querySelector(selector);
    if (!element) return;
    const horizontal = selector === ".accent-rule";
    element.animate([
      { opacity: 0, transform: horizontal ? "scaleX(0)" : `translateY(${distance}px)` },
      { opacity: 1, transform: horizontal ? "scaleX(1)" : "translateY(0)" }
    ], { duration: horizontal ? 700 : 900, delay, easing: ease, fill: "both" });
  });

  const targets = document.querySelectorAll(".product-trigger, .material-fact, .qc-item, .compliance-item");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const delay = Math.min((Number(element.dataset.revealIndex) || 0) % 6 * 60, 300);
        element.style.opacity = "0";
        element.style.transform = "translateY(18px)";
        const animation = element.animate([
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: 680, delay, easing: ease, fill: "both" });
        animation.finished.then(() => { element.style.opacity = ""; element.style.transform = ""; });
        observer.unobserve(element);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    targets.forEach((element, index) => {
      element.dataset.revealIndex = String(index);
      observer.observe(element);
    });
  }
}
