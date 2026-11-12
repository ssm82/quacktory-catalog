// file: main.js
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const dialog = document.querySelector("#line-dialog");
const dialogFrame = dialog?.querySelector(".dialog-frame");
const dialogKicker = dialog?.querySelector(".dialog-kicker");
const dialogTitle = dialog?.querySelector(".dialog-title");
const dialogCopy = dialog?.querySelector(".dialog-copy");
const dialogLabels = dialog ? [...dialog.querySelectorAll(".dialog-specs dt")] : [];
const dialogValues = dialog ? [...dialog.querySelectorAll(".dialog-specs dd")] : [];
const dialogLink = dialog?.querySelector(".dialog-link");
const cards = [...document.querySelectorAll(".line-card")];
const heroObject = document.querySelector(".hero-object");

const accents = {
  micro: "#ef3e39",
  classic: "#e53935",
  designer: "#db342f",
  mega: "#cf302c",
  architect: "#c42d29"
};

let lastTrigger = null;
let savedOverflow = "";

function withPeriod(value = "") {
  const text = value.trim();
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function setSpec(index, label, value) {
  if (dialogLabels[index]) dialogLabels[index].textContent = label;
  if (dialogValues[index]) dialogValues[index].textContent = value;
}

function openDetails(details) {
  if (!dialog) return;

  dialogKicker.textContent = details.kicker;
  dialogTitle.textContent = details.title;
  dialogCopy.textContent = withPeriod(details.copy);
  dialog.dataset.line = details.key || "";

  details.specs.forEach(([label, value], index) => setSpec(index, label, value));

  const accentFrame = dialogFrame || dialog;
  accentFrame.style.setProperty("--accent", details.accent || "#e53935");

  if (dialogLink) {
    dialogLink.textContent = "View all five scales";
    dialogLink.setAttribute("aria-label", "View all five Quacktory scales");
  }

  lastTrigger = details.trigger || document.activeElement;

  if (!dialog.open) {
    savedOverflow = document.body.style.overflow;

    if (typeof dialog.showModal === "function") {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute("open", "");
      }
    } else {
      dialog.setAttribute("open", "");
    }

    document.body.style.overflow = "hidden";
  }
}

function restoreDialog() {
  document.body.style.overflow = savedOverflow;
  const trigger = lastTrigger;
  lastTrigger = null;

  if (trigger && document.contains(trigger)) {
    requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
  }
}

function closeDetails() {
  if (!dialog?.open) return;

  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
    restoreDialog();
  }
}

function setActiveCard(card, accent) {
  cards.forEach((item) => {
    const active = item === card;
    item.setAttribute("aria-pressed", active ? "true" : "false");

    if (active) {
      item.dataset.active = "true";
      item.style.setProperty("--accent", accent);
      item.style.filter = "brightness(1.08)";
      item.style.outline = "1px solid var(--accent)";
      item.style.outlineOffset = "3px";
    } else {
      delete item.dataset.active;
      item.style.removeProperty("--accent");
      item.style.removeProperty("filter");
      item.style.removeProperty("outline");
      item.style.removeProperty("outline-offset");
    }
  });
}

cards.forEach((card) => {
  card.setAttribute("aria-haspopup", "dialog");
  card.setAttribute("aria-controls", "line-dialog");
  card.setAttribute("aria-pressed", "false");

  card.addEventListener("click", () => {
    const key = card.dataset.line || "";
    const accent = accents[key] || "#e53935";
    const size = card.dataset.lineSize || "";
    const title = size.replace(/\s*\([^)]*\)\s*$/, "");

    setActiveCard(card, accent);
    openDetails({
      key,
      kicker: card.dataset.lineName || key,
      title,
      copy: card.dataset.lineAudience || "A Quacktory collector object.",
      accent,
      trigger: card,
      specs: [
        ["Size", size],
        ["Audience", card.dataset.lineAudience || "Collectors and design lovers"],
        ["Age", card.dataset.lineAge || "See product guidance"]
      ]
    });
  });
});

if (heroObject) {
  heroObject.setAttribute("aria-haspopup", "dialog");
  heroObject.setAttribute("aria-controls", "line-dialog");
  heroObject.setAttribute("aria-label", "Open Quacktory scale details");

  heroObject.addEventListener("click", (event) => {
    event.preventDefault();
    setActiveCard(null);
    openDetails({
      key: "scale-ladder",
      kicker: "Scale ladder",
      title: "4 cm — 3 m",
      copy: "From thumb-sized pocket objects to bear-sized lobby installations.",
      accent: "#e53935",
      trigger: heroObject,
      specs: [
        ["Size", "4 cm (thumb-sized) — 3 m (bear-sized)"],
        ["Editions", "Micro / Classic / Designer / Mega / Architect"],
        ["Format", "Collector objects to architectural installations"]
      ]
    });
  });
}

dialog?.querySelector("[data-dialog-close]")?.addEventListener("click", closeDetails);
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeDetails();
});
dialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDetails();
});
dialog?.addEventListener("close", restoreDialog);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && dialog?.open) {
    event.preventDefault();
    closeDetails();
  }
});

document.addEventListener("click", (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) return;

  const eventTarget = event.target instanceof Element ? event.target : null;
  const link = eventTarget?.closest('a[href^="#"]');
  const hash = link?.getAttribute("href");

  if (!link || !hash || hash === "#") return;

  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    id = hash.slice(1);
  }

  const section = document.getElementById(id);
  if (!section) return;

  event.preventDefault();
  if (dialog?.open && dialog.contains(link)) closeDetails();

  section.scrollIntoView({
    behavior: reducedMotion.matches ? "auto" : "smooth",
    block: "start"
  });

  try {
    history.pushState(null, "", hash);
  } catch {
    window.location.hash = hash;
  }
});

const easing =
  getComputedStyle(document.documentElement).getPropertyValue("--ease-out").trim() ||
  "cubic-bezier(0.22, 1, 0.36, 1)";

function hasKeyframes(element) {
  return getComputedStyle(element).animationName !== "none";
}

function animateElement(element, from, delay = 0, duration = 560, clearStyles = false) {
  if (!element) return;

  if (reducedMotion.matches || typeof element.animate !== "function" || hasKeyframes(element)) {
    if (clearStyles) {
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
      element.style.removeProperty("clip-path");
    }
    return;
  }

  element.style.willChange = "transform, opacity";

  const animation = element.animate(
    [
      from,
      {
        opacity: 1,
        transform: "none",
        clipPath: "inset(0 0 0 0)"
      }
    ],
    {
      duration,
      delay,
      easing,
      fill: "both"
    }
  );

  const cleanup = () => {
    animation.cancel();
    element.style.removeProperty("will-change");
    if (clearStyles) {
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
      element.style.removeProperty("clip-path");
    }
  };

  if (animation.finished) {
    animation.finished.then(cleanup).catch(cleanup);
  } else {
    animation.onfinish = cleanup;
  }
}

requestAnimationFrame(() => {
  document.querySelectorAll(".hero-meta").forEach((element, index) => {
    animateElement(
      element,
      { opacity: 0, transform: "translateY(12px)" },
      index * 65,
      480
    );
  });

  animateElement(
    document.querySelector(".hero-object-wrap"),
    { opacity: 0, transform: "scale(0.82, 1.14) rotate(-1.5deg)" },
    100,
    600
  );

  document.querySelectorAll(".manifesto-line").forEach((element, index) => {
    animateElement(
      element,
      {
        opacity: 0,
        transform: "translateY(28px)",
        clipPath: "inset(0 0 100% 0)"
      },
      170 + index * 75,
      560
    );
  });

  animateElement(
    document.querySelector(".hero-action"),
    { opacity: 0, transform: "translateY(10px)" },
    430,
    500
  );
});

const revealTargets = [
  ...document.querySelectorAll(
    ".section-intro, .line-card, .scale-baseline, .process-heading, .process-block, .production-ledger, .quality-block, .ledger-row, .quality-item, .compliance-card"
  )
];

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const prepared = revealTargets.filter((element) => {
    if (hasKeyframes(element)) return false;
    if (element.getBoundingClientRect().top <= window.innerHeight * 0.92) return false;

    element.style.opacity = "0";
    element.style.transform = "translateY(18px)";
    return true;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children]
          : [];
        const index = Math.max(0, siblings.indexOf(entry.target));
        const delay = Math.min(index, 5) * 55;

        animateElement(
          entry.target,
          { opacity: 0, transform: "translateY(18px)" },
          delay,
          620,
          true
        );
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );

  prepared.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("transform");
  });
}
