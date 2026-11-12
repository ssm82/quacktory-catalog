// file: main.js
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const SHARE_LIMIT = 99;
const dialogOpeners = new WeakMap();
let shareCount = 0;
let bodyLocked = false;
let savedOverflow = "";
let fallbackDialog = null;

function syncBodyLock() {
  const hasOpenDialog = Boolean($("dialog[open], [role='dialog'][open]"));
  if (hasOpenDialog && !bodyLocked) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    bodyLocked = true;
  } else if (!hasOpenDialog && bodyLocked) {
    document.body.style.overflow = savedOverflow;
    bodyLocked = false;
  }
}

function prepareDialog(dialog) {
  if (!dialog || dialog.dataset.dialogPrepared) return;
  dialog.dataset.dialogPrepared = "true";
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) closeDialog(dialog);
  });
  dialog.addEventListener("close", () => {
    syncBodyLock();
    const opener = dialogOpeners.get(dialog);
    if (opener && !$("dialog[open]")) opener.focus({ preventScroll: true });
    $$("[data-dialog-target]").forEach((trigger) => {
      if (trigger.dataset.dialogTarget === dialog.id) trigger.setAttribute("aria-expanded", "false");
    });
  });
}

function openDialog(dialog) {
  if (!dialog) return;
  prepareDialog(dialog);
  if (typeof dialog.showModal === "function") {
    if (!dialog.open) {
      try { dialog.showModal(); }
      catch { dialog.setAttribute("open", ""); }
    }
  } else {
    dialog.removeAttribute("hidden");
    dialog.setAttribute("open", "");
  }
  dialogOpeners.set(dialog, document.activeElement instanceof HTMLElement ? document.activeElement : null);
  syncBodyLock();
  if (!motionQuery.matches && typeof dialog.animate === "function") {
    dialog.animate(
      [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  }
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function" && dialog.open) dialog.close();
  else dialog.removeAttribute("open");
  syncBodyLock();
}

function ensureFallbackDialog() {
  if (fallbackDialog) return fallbackDialog;
  fallbackDialog = document.createElement("dialog");
  fallbackDialog.setAttribute("aria-labelledby", "fallback-title");
  fallbackDialog.style.cssText = "width:min(720px,calc(100vw - 32px));max-height:calc(100dvh - 32px);border:1px solid #080a0a;border-radius:0;padding:0;background:#fff;color:#080a0a;overflow:auto;";
  fallbackDialog.innerHTML = `<div style="position:relative;padding:clamp(30px,6vw,72px)"><button type="button" data-dialog-close aria-label="Close dialog" style="position:absolute;top:16px;right:16px;border:0;background:transparent;font:600 11px Archivo,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer">Close</button><p id="fallback-kicker" style="margin:0 0 22px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase"></p><h2 id="fallback-title" style="margin:0;font-size:clamp(36px,7vw,72px);line-height:.94;letter-spacing:-.055em"></h2><div id="fallback-accent" style="width:56px;height:4px;margin:28px 0;background:#9eb3c0"></div><p id="fallback-description" style="max-width:56ch;margin:0;font-size:18px;line-height:1.5;white-space:pre-line"></p><div id="fallback-meta" style="margin-top:30px;padding-top:18px;border-top:1px solid #111;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;white-space:pre-line"></div></div>`;
  document.body.append(fallbackDialog);
  prepareDialog(fallbackDialog);
  return fallbackDialog;
}

function installShareControls(dialog) {
  if (!dialog || $("[data-share-count]", dialog)) return;
  const row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:center;gap:12px;margin:0 24px 24px;padding-top:16px;border-top:1px solid #111;";
  const label = document.createElement("span");
  label.textContent = "Share";
  label.style.cssText = "font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;";
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.shareTrigger = "";
  button.textContent = "Copy link";
  button.style.cssText = "border:1px solid #111;background:#080a0a;color:#fff;padding:10px 14px;font:600 11px Archivo,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;";
  const counter = document.createElement("span");
  counter.dataset.shareCount = "";
  counter.setAttribute("aria-live", "polite");
  counter.style.cssText = "margin-left:auto;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;";
  row.append(label, button, counter);
  dialog.append(row);
}

function updateShareCounters() {
  $$("[data-share-count]").forEach((counter) => {
    counter.textContent = `${shareCount} / ${SHARE_LIMIT} shares`;
    counter.setAttribute("aria-label", `${shareCount} shares, maximum ${SHARE_LIMIT}`);
  });
}

function openFallback(data) {
  const dialog = ensureFallbackDialog();
  $("#fallback-kicker", dialog).textContent = data.eyebrow || "Mendo";
  $("#fallback-title", dialog).textContent = data.title || "Collection";
  $("#fallback-description", dialog).textContent = data.description || "";
  $("#fallback-meta", dialog).textContent = data.meta || "";
  $("#fallback-accent", dialog).style.background = data.accent || "#9eb3c0";
  dialog.style.setProperty("--accent", data.accent || "#9eb3c0");
  installShareControls(dialog);
  updateShareCounters();
  openDialog(dialog);
}

function accentFor(title) {
  const accents = { micro: "#9eb3c0", classic: "#d8d0c8", designer: "#b8aa9a", mega: "#82939b", architect: "#596b74" };
  return accents[title.trim().toLowerCase()] || "#9eb3c0";
}

function productData(card) {
  const title = $(".product-card__line", card)?.textContent.trim() || "Collection item";
  const number = $(".product-card__number", card)?.textContent.trim() || "01";
  const size = $(".product-card__size", card)?.textContent.trim() || "";
  const comparison = $(".product-card__comparison", card)?.textContent.trim() || "";
  const audience = $(".product-card__audience", card)?.textContent.trim() || "";
  const meta = $$(".product-card__meta span", card).map((node) => node.textContent.trim()).filter(Boolean);
  return {
    eyebrow: `Collection / ${number}`,
    title,
    description: [comparison, audience].filter(Boolean).join(" · "),
    meta: [size, ...meta].filter(Boolean).join(" · "),
    accent: accentFor(title)
  };
}

$$("[data-dialog-target]").forEach((trigger) => {
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.getElementById(trigger.dataset.dialogTarget);
    const card = trigger.closest(".product-card");
    const data = card ? productData(card) : { title: "Collection", description: "Explore the complete collection.", accent: "#9eb3c0" };
    trigger.setAttribute("aria-expanded", "true");
    if (target) {
      target.style.setProperty("--accent", data.accent);
      installShareControls(target);
      openDialog(target);
    } else {
      openFallback(data);
    }
  });
});

$$("dialog").forEach((dialog) => {
  prepareDialog(dialog);
  installShareControls(dialog);
});

const qcItems = $$(".qc-item");
let activeQcItem = null;
function toggleQcItem(item) {
  const activate = activeQcItem !== item;
  qcItems.forEach((node) => {
    node.setAttribute("aria-pressed", "false");
    node.style.outline = "";
    node.style.outlineOffset = "";
  });
  activeQcItem = activate ? item : null;
  if (activate) {
    item.setAttribute("aria-pressed", "true");
    item.style.outline = "2px solid #080a0a";
    item.style.outlineOffset = "4px";
  }
}
qcItems.forEach((item) => {
  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
  item.setAttribute("aria-haspopup", "dialog");
  const showDetail = () => openFallback({
    eyebrow: `Quality control / ${$(".qc-number", item)?.textContent.trim() || "01"}`,
    title: $(".qc-title", item)?.textContent.trim() || "Inspection",
    description: $(".qc-copy", item)?.textContent.trim() || "",
    meta: "Every object is checked before it leaves the studio.",
    accent: "#9eb3c0"
  });
  item.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    toggleQcItem(item);
    showDetail();
  });
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleQcItem(item);
      showDetail();
    }
  });
});

$$("button, a").forEach((control) => {
  const marker = `${control.getAttribute("aria-label") || ""} ${control.getAttribute("title") || ""} ${control.textContent || ""}`;
  if (/\bshare\b/i.test(marker) && !control.matches("[data-share-trigger]")) control.dataset.shareTrigger = "";
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-share-trigger]");
  if (!trigger) return;
  event.preventDefault();
  event.stopPropagation();
  if (shareCount < SHARE_LIMIT) shareCount += 1;
  updateShareCounters();
  trigger.setAttribute("aria-label", `Share this item. ${shareCount} of ${SHARE_LIMIT} shares.`);
  trigger.setAttribute("title", `${shareCount} / ${SHARE_LIMIT} shares`);
  if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).catch(() => {});
});

document.addEventListener("click", (event) => {
  const explicitClose = event.target.closest("[data-dialog-close]");
  if (explicitClose) {
    closeDialog(explicitClose.closest("dialog, [role='dialog']"));
    return;
  }
  const button = event.target.closest("button");
  if (!button) return;
  const text = button.textContent.trim();
  const label = button.getAttribute("aria-label") || "";
  if (/^(close|dismiss|×|✕)$/i.test(text) || /close (dialog|modal)|dismiss/i.test(label)) {
    closeDialog(button.closest("dialog, [role='dialog']"));
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") $$("dialog[open]").forEach(closeDialog);
});

let settingsTrigger = $$("button, a").find((control) => /settings|preferences/i.test(`${control.getAttribute("aria-label") || ""} ${control.getAttribute("title") || ""}`));
if (settingsTrigger) {
  settingsTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    openFallback({
      eyebrow: "Preferences",
      title: "Settings",
      description: "Motion follows your device preference. Navigation, quantity controls and dialogs remain keyboard accessible.",
      meta: "Press Escape to close any dialog.",
      accent: "#9eb3c0"
    });
  });
}

function quantityAction(button) {
  const marker = `${button.textContent || ""} ${button.getAttribute("aria-label") || ""} ${button.dataset.action || ""} ${button.dataset.quantityAction || ""}`;
  if (/\b(increase|increment|plus)\b|\+/.test(marker)) return 1;
  if (/\b(decrease|decrement|minus)\b|−/.test(marker)) return -1;
  return 0;
}

function updateCartTotals() {
  const cart = document.getElementById("cart") || $("[data-cart]");
  if (!cart) return;
  let sum = 0;
  let count = 0;
  let found = false;
  let symbol = "$";
  $$("[data-cart-item], [data-line-item], article, tr", cart).forEach((row) => {
    const qtyNode = $("[data-quantity], input[type='number'], output", row);
    const priceNode = $("[data-item-price], [data-price]", row) || $$("span, p", row).find((node) => node.children.length === 0 && /[$€£¥]\s*\d/.test(node.textContent));
    if (!priceNode) return;
    const priceText = priceNode.dataset.price ?? priceNode.dataset.itemPrice ?? row.dataset.price ?? priceNode.textContent;
    const price = Number(String(priceText).replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(price)) return;
    const qtyRaw = qtyNode?.dataset.value ?? qtyNode?.value ?? qtyNode?.textContent ?? row.dataset.quantity ?? "1";
    const qty = Number((String(qtyRaw).match(/\d+/) || [1])[0]);
    sum += price * qty;
    count += qty;
    found = true;
    symbol ||= String(priceText).match(/[$€£¥]/)?.[0] || "$";
  });
  const totalNode = $("[data-cart-total-value], [data-cart-total], [data-subtotal-value]", cart);
  if (found && totalNode) {
    const amount = Number.isInteger(sum) ? String(sum) : sum.toFixed(2);
    totalNode.textContent = `${symbol}${amount}`;
  }
  const countNode = $("[data-cart-count]", cart);
  if (found && countNode) countNode.textContent = String(count);
}

$$("button").forEach((button) => {
  const step = quantityAction(button);
  if (!step) return;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const scope = button.closest("[data-cart-item], [data-line-item], tr, li, article") || button.parentElement;
    const reference = button.dataset.quantityTarget || button.getAttribute("aria-controls");
    let target = reference ? document.getElementById(reference) : null;
    if (!target || !target.matches("input, output, [data-quantity], span")) {
      target = scope?.querySelector("input[type='number'], output, [data-quantity]") || null;
    }
    if (!target) target = $$("span", button.parentElement).find((node) => !node.contains(button) && /^\d+$/.test(node.textContent.trim()));
    if (!target) return;
    const raw = target.value ?? target.dataset.value ?? target.textContent;
    const current = Number((String(raw).match(/\d+/) || [0])[0]);
    const minimum = target instanceof HTMLInputElement && target.min !== "" ? Number(target.min) : 1;
    const maximum = target instanceof HTMLInputElement && target.max !== "" ? Number(target.max) : SHARE_LIMIT;
    const next = Math.min(maximum, Math.max(minimum, current + step));
    if (target instanceof HTMLInputElement) target.value = String(next);
    else {
      target.textContent = String(next);
      target.dataset.value = String(next);
    }
    target.setAttribute("aria-valuenow", String(next));
    target.dispatchEvent(new Event("input", { bubbles: true }));
    target.dispatchEvent(new Event("change", { bubbles: true }));
    updateCartTotals();
  });
});

const checkoutTrigger = $$("button, a").find((control) => /\b(checkout|place order|buy now)\b/i.test(`${control.textContent || ""} ${control.getAttribute("aria-label") || ""}`));
if (checkoutTrigger) {
  checkoutTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    updateCartTotals();
    const cart = document.getElementById("cart") || $("[data-cart]");
    const total = cart ? $("[data-cart-total-value], [data-cart-total], [data-subtotal-value]", cart)?.textContent : "";
    openFallback({
      eyebrow: "Your bag",
      title: "Ready to check out",
      description: total ? `Your selection totals ${total}. Continue to complete your order.` : "Your selection is ready. Continue to complete your order.",
      meta: "Secure checkout · Editorial objects · Worldwide delivery",
      accent: "#080a0a"
    });
  });
}

const quoteForm = $(".quote-form");
if (quoteForm) {
  const lineSelect = $("[name='line']", quoteForm);
  const sizeSelect = $("[name='size']", quoteForm);
  const sizes = { micro: ["4-8"], classic: ["10-25"], designer: ["15-30"], mega: ["50-120"], architect: ["1.5-3"] };
  lineSelect?.addEventListener("change", () => {
    if (!sizeSelect) return;
    const allowed = sizes[lineSelect.value] || [];
    [...sizeSelect.options].forEach((option) => {
      const enabled = option.value === "" || allowed.includes(option.value);
      option.disabled = !enabled;
      option.hidden = !enabled;
    });
    if (sizeSelect.selectedOptions[0]?.disabled) sizeSelect.selectedIndex = 0;
  });
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = (name) => {
      const select = $(`[name='${name}']`, quoteForm);
      return select?.selectedOptions[0]?.textContent.trim() || "Not selected";
    };
    openFallback({
      eyebrow: "B2B / Custom development",
      title: "Your project is ready to scope.",
      description: `Line: ${selected("line")}\nSize: ${selected("size")}\nColour: ${selected("colour")}`,
      meta: "We’ll follow up with availability, lead time and a considered quotation.",
      accent: "#9eb3c0"
    });
  });
}

if (!motionQuery.matches && "IntersectionObserver" in window) {
  const targets = $$(".hero-panel, .section-heading, .product-card, .qc-item, .production__main, .production__side, .custom__intro");
  targets.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.translate = "0 18px";
    element.style.transition = "opacity 420ms var(--ease), translate 420ms var(--ease)";
    element.style.transitionDelay = `${(index % 6) * 60}ms`;
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      element.style.opacity = "1";
      element.style.translate = "0 0";
      observer.unobserve(element);
      window.setTimeout(() => {
        element.style.transition = "";
        element.style.transitionDelay = "";
        element.style.translate = "";
        element.style.opacity = "";
      }, 760);
    });
  }, { threshold: 0.01, rootMargin: "0px 0px -6% 0px" });
  targets.forEach((element) => observer.observe(element));
}
