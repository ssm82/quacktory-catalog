/* ----------------------------------------------------------------------- */
/*  Quacktory Quarterly — Ducks.                                           */
/*  Interactivity: scroll reveal, modal specimen card, counter.           */
/* ----------------------------------------------------------------------- */

const SKU_DATA = {
  micro: {
    sku: "QQ-MICRO",
    name: "Micro",
    size: "4 cm",
    desc: "Keychain-scale porcelain. Pocket companion. Designed to ride on a bag zip or a lanyard — small enough to lose, sturdy enough to find.",
    finish: "porcelain · ivory",
    edition: "open edition · catalog QQ-MICRO",
    photo: "soft three-point · seamless white",
    price: "€18",
  },
  classic: {
    sku: "QQ-CLASSIC",
    name: "Classic",
    size: "15 cm",
    desc: "The workhorse of the line. The most-photographed SKU in the catalog, set on desks and bookshelves since 2018. Matte porcelain in pale blush.",
    finish: "porcelain · blush",
    edition: "open edition · catalog QQ-CLASSIC",
    photo: "soft three-point · seamless white",
    price: "€42",
  },
  designer: {
    sku: "QQ-DESIGNER-04",
    name: "Designer",
    size: "20 cm",
    desc: "Collectors' edition. A fine halftone dot pattern in deep teal over an ivory base, hand-illustrated for the Static issue. Limited to 320 numbered units.",
    finish: "halftone · teal / ivory",
    edition: "limited · 320 units · catalog QQ-DESIGNER-04",
    photo: "soft three-point · seamless white",
    price: "€96",
  },
  mega: {
    sku: "QQ-MEGA",
    name: "Mega",
    size: "50 cm",
    desc: "Statement piece. Matte porcelain in deep ink with warm undertones, scaled to read as furniture. Heavy enough to anchor a room.",
    finish: "porcelain · ink",
    edition: "open edition · catalog QQ-MEGA",
    photo: "soft three-point · seamless white",
    price: "€320",
  },
  architect: {
    sku: "QQ-ARCHITECT",
    name: "Architect",
    size: "150 cm",
    desc: "Public-installation scale. Cream-ivory porcelain, hand-finished, shipped in a custom crate. Commissioned for galleries and lobbies.",
    finish: "porcelain · paper-ivory",
    edition: "by commission · catalog QQ-ARCHITECT",
    photo: "soft three-point · seamless white",
    price: "€4,200",
  },
};

const state = {
  count: 12,
  activeSku: null,
};

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalSku = document.getElementById("modal-sku");
const modalSize = document.getElementById("modal-size");
const modalDesc = document.getElementById("modal-desc");
const modalSpecs = document.getElementById("modal-specs");
const modalCta = document.getElementById("modal-cta");

function openModal(sku) {
  const data = SKU_DATA[sku];
  if (!data) return;
  state.activeSku = sku;

  modalTitle.textContent = data.name;
  modalSku.textContent = `SKU · ${data.sku}`;
  modalSize.textContent = data.size;
  modalDesc.textContent = data.desc;

  modalSpecs.innerHTML = "";
  const entries = [
    ["Finish", data.finish],
    ["Edition", data.edition],
    ["Photography", data.photo],
    ["Price", data.price],
  ];
  for (const [k, v] of entries) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = v;
    row.append(dt, dd);
    modalSpecs.appendChild(row);
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  state.activeSku = null;
}

/* Modal close handlers */
modal.addEventListener("click", (e) => {
  if (e.target.matches("[data-modal-close]")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

/* Open from any node or plate */
document.querySelectorAll("[data-sku]").forEach((el) => {
  const sku = el.dataset.sku;
  el.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(sku);
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(sku);
    }
  });
});

/* Counter — bumps on CTA click or pill click */
const counterValue = document.getElementById("counter-value");
const counterBtn = document.getElementById("counter-btn");
function bumpCount() {
  state.count += 1;
  counterValue.textContent = String(state.count).padStart(3, "0");
  counterBtn.classList.remove("is-bumped");
  void counterBtn.offsetWidth; /* restart animation */
  counterBtn.classList.add("is-bumped");
}
counterBtn.addEventListener("click", bumpCount);
modalCta.addEventListener("click", () => {
  bumpCount();
  modalCta.classList.remove("is-bumped");
  void modalCta.offsetWidth;
  modalCta.classList.add("is-bumped");
  setTimeout(closeModal, 320);
});

/* Scroll reveal — IntersectionObserver */
const revealEls = document.querySelectorAll(".ladder__node, .plate");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = Array.from(
          el.parentElement.querySelectorAll(":scope > *")
        );
        const idx = siblings.indexOf(el);
        el.style.setProperty("--reveal-delay", `${idx * 90}ms`);
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* Subtle parallax on the cover photo — translates on scroll */
const coverPhoto = document.querySelector(".cover__photo img");
const coverWordmark = document.querySelector(".cover__wordmark");
const coverBlock = document.querySelector(".cover__block");

function onScroll() {
  const y = window.scrollY;
  if (coverPhoto && y < window.innerHeight) {
    coverPhoto.style.transform = `translateY(${y * 0.08}px) scale(${1 + y * 0.0002})`;
  }
  if (coverWordmark && y < window.innerHeight) {
    coverWordmark.style.transform = `translateY(${y * 0.04}px)`;
  }
}
let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true }
);

/* Subtle teal-block hue shift on scroll position relative to it */
if (coverBlock) {
  const blockObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          coverBlock.style.transition = "background 0.4s ease";
        }
      });
    },
    { threshold: 0.5 }
  );
  blockObserver.observe(coverBlock);
}
