// QUACKTORY — site-pinterest-53198839343569149
// Vanilla JS. Three responsibilities:
//   1. Smooth-scroll polyfill for the hero scroll cue.
//   2. Modal open/close (button click, overlay click, Escape).
//   3. Reveal-on-scroll for sections below the fold.

const ENTRIES = {
  micro: {
    code: "M01 · MICRO",
    title: "The Micro",
    cm: "04 cm",
    finish: "Warm amber satin",
    edition: "Open edition",
    copy:
      "A keychain-sized duck, cast in the season's warm amber with a soft satin sheen. Carry it. Lose it. Order another."
  },
  classic: {
    code: "C02 · CLASSIC",
    title: "The Classic",
    cm: "15 cm",
    finish: "Deep teal matte",
    edition: "Open edition",
    copy:
      "The workhorse of the ladder. Cast in deep teal with the matte of oxidised bronze and a single quiet amber catch-light."
  },
  designer: {
    code: "D03 · DESIGNER",
    title: "The Designer",
    cm: "20 cm",
    finish: "Metallic copper",
    edition: "Season edition · 500",
    copy:
      "A copper-plated duck for the season. Heavier in the hand than it looks, brighter under amber than you'd expect."
  },
  mega: {
    code: "X04 · MEGA",
    title: "The Mega",
    cm: "50 cm",
    finish: "Charcoal matte obsidian",
    edition: "Open edition",
    copy:
      "A duck that takes up half a shelf. Matte obsidian, light-absorbing, with a single faint gloss at the highest point of the curve."
  },
  architect: {
    code: "A05 · ARCHITECT",
    title: "The Architect",
    cm: "300 cm",
    finish: "Cream ivory porcelain",
    edition: "Made to order · 12 / yr",
    copy:
      "Three metres. Cream ivory porcelain. A statement you install in a lobby and live with for a decade. Shown only by appointment."
  }
};

// ---------- Modal ----------
const modal = document.getElementById("entry-modal");
const modalTitle = document.getElementById("modal-title");
const modalCode = document.getElementById("modal-code");
const modalCm = document.getElementById("modal-cm");
const modalFinish = document.getElementById("modal-finish");
const modalEdition = document.getElementById("modal-edition");
const modalCopy = document.getElementById("modal-copy");

function openModal(sku) {
  const entry = ENTRIES[sku];
  if (!entry) return;
  modalCode.textContent = entry.code;
  modalTitle.textContent = entry.title;
  modalCm.textContent = entry.cm;
  modalFinish.textContent = entry.finish;
  modalEdition.textContent = entry.edition;
  modalCopy.textContent = entry.copy;
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (e) => {
  if (e.target instanceof HTMLElement && e.target.matches("[data-close]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});

// Vitrine cards open their entry on click of the card itself.
document.querySelectorAll(".vitrine__card").forEach((card) => {
  card.addEventListener("click", () => {
    const sku = card.dataset.sku;
    if (sku) openModal(sku);
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const sku = card.dataset.sku;
      if (sku) openModal(sku);
    }
  });
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
});

// Rail nodes open the modal too.
document.querySelectorAll(".rail__node").forEach((node) => {
  node.addEventListener("click", () => {
    const sku = node.dataset.sku;
    if (sku) openModal(sku);
  });
});

// ---------- Smooth-scroll polyfill (hero → manifesto) ----------
const cue = document.querySelector(".hero__cue");
if (cue) {
  cue.style.cursor = "pointer";
  cue.addEventListener("click", () => {
    const target = document.querySelector(".manifesto");
    if (!target) return;
    if ("scrollBehavior" in document.documentElement.style) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      target.scrollIntoView();
    }
  });
}

// ---------- Reveal (staggered entrance) ----------
const revealTargets = document.querySelectorAll(
  ".manifesto, .vitrine__head, .vitrine__card, .rail, .foot"
);
revealTargets.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.setProperty("--reveal-delay", `${Math.min(i * 80, 420)}ms`);
});

requestAnimationFrame(() => requestAnimationFrame(() => {
  revealTargets.forEach((el) => el.classList.add("is-in"));
}));