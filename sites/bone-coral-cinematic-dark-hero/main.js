// file: main.js
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const body = document.body;
const previousDialog = document.getElementById("product-dialog");
const dialog = document.createElement("dialog");

dialog.id = "product-dialog";
dialog.setAttribute("aria-labelledby", "product-dialog-title");
dialog.setAttribute("aria-describedby", "product-dialog-description");
dialog.innerHTML = `
  <div data-modal-shell>
    <figure data-modal-visual>
      <img data-modal-image alt="" hidden>
      <div data-modal-fallback><span data-modal-fallback-mark>Q</span></div>
    </figure>
    <section data-modal-content>
      <button type="button" data-modal-close aria-label="Close details">×</button>
      <p data-modal-kicker></p>
      <h2 id="product-dialog-title" data-modal-title></h2>
      <p id="product-dialog-description" data-modal-subtitle></p>
      <p data-modal-description></p>
      <dl data-modal-details></dl>
      <button type="button" data-modal-primary>Copy the specs</button>
    </section>
  </div>
`;

const dialogStyles = document.createElement("style");
dialogStyles.textContent = `
  #product-dialog{--dialog-accent:#ff2788;width:min(920px,calc(100vw - 32px));max-width:none;max-height:min(88vh,760px);padding:0;margin:auto;border:1px solid rgba(255,255,255,.18);border-radius:32px;overflow:hidden;color:#fff;background:#071a38;box-shadow:0 30px 100px rgba(0,0,0,.55);font-family:var(--body)}
  #product-dialog::backdrop{background:rgba(2,10,27,.78);backdrop-filter:blur(12px)}
  #product-dialog[open]{animation:dialogIn .38s var(--ease-out)}
  #product-dialog [data-modal-shell]{display:grid;grid-template-columns:.86fr 1.14fr;min-height:560px}
  #product-dialog [data-modal-visual]{position:relative;min-height:100%;margin:0;overflow:hidden;background:radial-gradient(circle at 35% 25%,var(--dialog-accent),#071a38 68%)}
  #product-dialog [data-modal-image]{width:100%;height:100%;object-fit:cover;filter:saturate(1.15) contrast(1.04)}
  #product-dialog [data-modal-fallback]{position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(circle at 35% 25%,var(--dialog-accent),transparent 54%),linear-gradient(145deg,#071a38,#041126)}
  #product-dialog [data-modal-fallback-mark]{display:grid;width:120px;height:120px;place-items:center;border:1px solid rgba(255,255,255,.3);border-radius:50%;color:#fff;font:900 64px/1 var(--display)}
  #product-dialog [data-modal-content]{position:relative;padding:clamp(28px,5vw,58px);overflow:auto}
  #product-dialog [data-modal-close]{position:absolute;z-index:2;top:18px;right:18px;display:grid;width:44px;height:44px;padding:0;place-items:center;border:1px solid rgba(255,255,255,.28);border-radius:50%;color:#fff;background:rgba(7,26,56,.72);font-size:28px;line-height:1;cursor:pointer;transition:background .2s ease,transform .2s ease}
  #product-dialog [data-modal-close]:hover{background:var(--dialog-accent);transform:rotate(8deg)}
  #product-dialog [data-modal-kicker]{margin:0 56px 12px 0;color:var(--dialog-accent);font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase}
  #product-dialog [data-modal-title]{margin:0 40px 10px 0;font:italic 900 clamp(38px,5vw,68px)/.95 var(--display);letter-spacing:-.055em}
  #product-dialog [data-modal-subtitle]{margin:0 0 20px;color:#c5d3e4;font-size:17px;font-weight:700}
  #product-dialog [data-modal-description]{margin:0 0 26px;color:#c5d3e4;line-height:1.65}
  #product-dialog [data-modal-details]{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin:0 0 28px;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(255,255,255,.12)}
  #product-dialog [data-modal-details]>div{min-width:0;padding:15px;background:#0b2549}
  #product-dialog dt{margin-bottom:5px;color:#8fa8c2;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
  #product-dialog dd{margin:0;color:#fff;font-size:13px;line-height:1.45}
  #product-dialog [data-modal-primary]{min-height:48px;padding:0 22px;border:0;border-radius:999px;color:#071a38;background:#fff;font-size:14px;font-weight:900;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease}
  #product-dialog [data-modal-primary]:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.28)}
  #product-dialog [hidden]{display:none!important}
  @keyframes dialogIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
  @media(max-width:700px){#product-dialog{border-radius:24px}#product-dialog [data-modal-shell]{grid-template-columns:1fr;grid-template-rows:34vh 1fr;min-height:620px}#product-dialog [data-modal-visual]{min-height:34vh}#product-dialog [data-modal-content]{padding:28px 22px}#product-dialog [data-modal-details]{grid-template-columns:1fr}#product-dialog [data-modal-title]{font-size:42px}}
  @media(prefers-reduced-motion:reduce){#product-dialog[open]{animation:none}}
`;
document.head.append(dialogStyles);
if (previousDialog) previousDialog.replaceWith(dialog);
else body.append(dialog);

let activeTrigger = null;
let bodyOverflow = "";
let modalPayload = null;

const setText = (key, value) => {
  const element = dialog.querySelector(`[data-modal-${key}]`);
  if (!element) return;
  element.textContent = value || "";
  element.hidden = !value;
};

const validAccent = (value) => /^#[\da-f]{3,8}$/i.test(value || "") ? value : "#ff2788";

function openModal(payload, trigger) {
  if (!dialog.open) {
    activeTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
    bodyOverflow = body.style.overflow;
  }

  modalPayload = payload;
  dialog.style.setProperty("--dialog-accent", validAccent(payload.accent));
  setText("kicker", payload.kicker);
  setText("title", payload.title);
  setText("subtitle", payload.subtitle);
  setText("description", payload.description);

  const details = dialog.querySelector("[data-modal-details]");
  details.replaceChildren();
  payload.details.forEach(([label, value]) => {
    if (!value) return;
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    details.append(row);
  });
  details.hidden = !details.children.length;

  const image = dialog.querySelector("[data-modal-image]");
  const fallback = dialog.querySelector("[data-modal-fallback]");
  const fallbackMark = dialog.querySelector("[data-modal-fallback-mark]");
  fallbackMark.textContent = (payload.title || "Q").trim().charAt(0);
  image.hidden = true;
  fallback.hidden = true;

  if (payload.image) {
    image.alt = payload.title || "Quacktory duck";
    image.onload = () => {
      image.hidden = false;
      fallback.hidden = true;
    };
    image.onerror = () => {
      image.hidden = true;
      fallback.hidden = false;
    };
    image.src = payload.image;
  } else {
    fallback.hidden = false;
  }

  if (!dialog.open) dialog.showModal();
  body.style.overflow = "hidden";
  if (activeTrigger instanceof HTMLElement) activeTrigger.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => dialog.querySelector("[data-modal-close]").focus({ preventScroll: true }));
}

function restoreDialog() {
  body.style.overflow = bodyOverflow;
  if (activeTrigger instanceof HTMLElement) {
    activeTrigger.setAttribute("aria-expanded", "false");
    activeTrigger.focus({ preventScroll: true });
  }
}

function closeModal() {
  if (dialog.open) dialog.close();
  else restoreDialog();
}

dialog.addEventListener("close", restoreDialog);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeModal();
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeModal();
});
dialog.querySelector("[data-modal-close]").addEventListener("click", closeModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && dialog.open) {
    event.preventDefault();
    closeModal();
  }
});

async function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.opacity = "0";
  body.append(area);
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  if (!copied) throw new Error("Copy unavailable");
}

const modalPrimary = dialog.querySelector("[data-modal-primary]");
modalPrimary.addEventListener("click", async () => {
  if (!modalPayload) return;
  const summary = [modalPayload.title, modalPayload.subtitle, modalPayload.description].filter(Boolean).join("\n");
  try {
    await copyText(summary);
    modalPrimary.textContent = "Copied — let's play!";
  } catch {
    modalPrimary.textContent = "Copy unavailable";
  }
  setTimeout(() => { modalPrimary.textContent = "Copy the specs"; }, 1800);
});

const accents = {
  micro: "#29d7ef",
  classic: "#ff2788",
  designer: "#b99cff",
  mega: "#ffd85a",
  architect: "#ffffff"
};

function productPayload(button) {
  const data = button.dataset;
  const price = [data.productPrice, data.productPriceUnit].filter(Boolean).join(" ");
  return {
    kicker: `${data.product || "Collection"} edition`,
    title: data.productName || data.product || "Quacktory",
    subtitle: [data.productSize, data.productComparison].filter(Boolean).join(" · "),
    description: data.productDescription || "A seriously considered duck for a seriously unserious world.",
    image: data.productImage || "",
    accent: accents[data.product] || "#ff2788",
    details: [
      ["Best for", data.productAudience],
      ["Price", price],
      ["Shipping", data.productPriceShipping],
      ["Lead time", data.productLead],
      ["Made by", data.productMethod],
      ["Tooling", data.productTooling],
      ["Cycle", data.productCycle],
      ["Age / use", data.productAge]
    ]
  };
}

document.querySelectorAll(".subject-button, [data-product]").forEach((button) => {
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-controls", "product-dialog");
  button.addEventListener("click", (event) => {
    if (button.tagName === "A") event.preventDefault();
    document.querySelectorAll(".scale-item").forEach((item) => {
      item.removeAttribute("data-active");
      item.querySelector(".subject-button")?.setAttribute("aria-pressed", "false");
    });
    const activeItem = button.closest(".scale-item");
    if (activeItem) {
      activeItem.dataset.active = "true";
      button.setAttribute("aria-pressed", "true");
    }
    openModal(productPayload(button), button);
  });
});

document.querySelectorAll(".production-pill").forEach((pill) => {
  const text = pill.textContent.trim();
  const lower = text.toLowerCase();
  let description = "A close-up detail from Quacktory's single-piece production process.";
  if (lower.includes("plastic")) description = "No plastic inserts, no metal inside, and no glued seams — every duck stays one continuous piece.";
  else if (lower.includes("pupil")) description = "The signature black pupil and bright white sclera are hand-finished after moulding.";
  else if (lower.includes("eyes")) description = "Eyes are painted directly onto the finished duck, preserving its beautifully simple silhouette.";
  pill.setAttribute("role", "button");
  pill.setAttribute("tabindex", "0");
  pill.setAttribute("aria-haspopup", "dialog");
  pill.setAttribute("aria-controls", "product-dialog");
  pill.setAttribute("aria-expanded", "false");
  const activate = () => openModal({
    kicker: "How we make it",
    title: text,
    subtitle: "Inside the workshop",
    description,
    accent: "#29d7ef",
    details: [
      ["Process", "Single-piece moulding"],
      ["Finish", "Hand-finished details"],
      ["Material", "Silicone or EPDM rubber"]
    ]
  }, pill);
  pill.addEventListener("click", activate);
  pill.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });
});

const timelineNodes = [...document.querySelectorAll("[data-timeline-node]")];
timelineNodes.forEach((node) => {
  node.addEventListener("click", (event) => {
    if (node.tagName === "A") event.preventDefault();
    timelineNodes.forEach((item) => {
      item.dataset.active = "false";
      item.setAttribute("aria-current", "false");
    });
    node.dataset.active = "true";
    node.setAttribute("aria-current", "step");
    openModal({
      kicker: "Quacktory timeline",
      title: node.dataset.title || node.dataset.label || node.dataset.timelineNode || node.textContent.trim(),
      subtitle: node.dataset.subtitle || "Another stop in the making",
      description: node.dataset.description || "Explore the people, processes, and playful ideas behind this stage.",
      image: node.dataset.image || "",
      accent: node.dataset.accent || "#b99cff",
      details: [["Year", node.dataset.year], ["Size", node.dataset.size], ["Edition", node.dataset.edition]]
    }, node);
  });
});

document.querySelectorAll('[data-settings], [aria-label*="settings" i], [aria-label*="preferences" i]').forEach((control) => {
  control.addEventListener("click", (event) => {
    if (control.tagName === "A") event.preventDefault();
    openModal({
      kicker: "Playground settings",
      title: "Set the pace",
      subtitle: "Motion follows your device automatically.",
      description: "The site already respects your reduced-motion preference, keeps the experience playful, and avoids unnecessary effects.",
      accent: "#29d7ef",
      details: [["Sound", "Not required"], ["Motion", reducedMotion.matches ? "Reduced" : "Full"], ["Interaction", "Always available"]]
    }, control);
  });
});

const shareControls = document.querySelectorAll('[data-share], [aria-label*="share" i]');
let shareCounter = document.querySelector("[data-share-count]");
let shareCount = shareCounter ? Math.min(999, parseInt(shareCounter.textContent, 10) || 0) : 0;
if (shareControls.length && !shareCounter) {
  shareCounter = document.createElement("span");
  shareCounter.dataset.shareCount = "";
  shareCounter.style.cssText = "display:inline-flex;margin-left:10px;color:#c5d3e4;font-size:12px;font-weight:700";
  shareControls[0].insertAdjacentElement("afterend", shareCounter);
}
if (shareCounter) {
  shareCounter.textContent = `${shareCount}/999 shares`;
  shareControls.forEach((control) => control.addEventListener("click", () => {
    if (shareCount >= 999) return;
    shareCount += 1;
    shareCounter.textContent = `${shareCount}/999 shares`;
    shareCounter.setAttribute("aria-label", `${shareCount} of 999 shares`);
  }));
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = decodeURIComponent(anchor.getAttribute("href").slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
  });
});

const introElements = [...document.querySelectorAll(".hero-eyebrow, .hero-title-main, .hero-title-line, .hero-manifesto, .hero-content .primary-cta")];
if (!reducedMotion.matches) {
  introElements.forEach((element, index) => {
    element.animate([
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 620, delay: index * 80, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
  });
}

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.animate([
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 560, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
      revealer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section-heading, .scale-item, .production-item, .production-stage, .care-strip, .b2b-copy").forEach((element) => revealer.observe(element));
}

const heroMedia = document.querySelector(".hero-media");
let parallaxFrame = 0;
window.addEventListener("scroll", () => {
  if (!heroMedia || reducedMotion.matches || parallaxFrame) return;
  parallaxFrame = requestAnimationFrame(() => {
    const offset = Math.min(window.scrollY * 0.06, 14).toFixed(2);
    heroMedia.style.translate = `0 ${offset}px`;
    parallaxFrame = 0;
  });
}, { passive: true });
