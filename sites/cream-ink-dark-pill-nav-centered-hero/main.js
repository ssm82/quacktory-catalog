const SKU = {
  Micro: {
    title: "A duck the size of a coin.",
    desc: "Cast in solid aged-ivory resin, hung on a brass keyring. The cartouche medallion is struck from the same brass as the ring — the whole duck survives a pocket and a hand-wash.",
    meta: ["4 cm · 28 g", "Solid resin", "Brass cartouche", "Edition · Open"]
  },
  Classic: {
    title: "The house duck.",
    desc: "15 centimetres of museum-piece ivory. Sits on a walnut shelf without shifting, and the brass cartouche on its chest is the only place we put our maker's mark.",
    meta: ["15 cm · 240 g", "Aged-ivory finish", "Brass cartouche", "Edition · Open"]
  },
  Designer: {
    title: "Engraved for a single room.",
    desc: "20 centimetres, with the brass cartouche engraved in classical scrollwork. Each Designer duck is numbered and arrives with a card bearing its scrollwork pattern.",
    meta: ["20 cm · 380 g", "Engraved brass", "Numbered", "Edition · Limited"]
  },
  Mega: {
    title: "The shelf duck.",
    desc: "50 centimetres and apothecary-true: the cartouche label is the size of a playing card. A duck meant for the centre of a room, not its corner.",
    meta: ["50 cm · 1.6 kg", "Aged-ivory resin", "Large cartouche", "Edition · Open"]
  },
  Architect: {
    title: "A duck that fills a wall.",
    desc: "Monumental, 1.5 to 3 metres. Cast to a measured footprint, finished by hand, shipped in a walnut crate. The Atelier commissions it to a room — the room does not commission the duck.",
    meta: ["1.5 — 3 m", "Hand-finished", "Bespoke inscription", "Edition · By brief"]
  }
};

const modal = document.getElementById("modal");
const modalSize = document.getElementById("modalSize");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalMeta = document.getElementById("modalMeta");

function openModal(size) {
  const data = SKU[size];
  if (!data) return;
  modalSize.textContent = size.toUpperCase();
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  modalMeta.innerHTML = data.meta.map(t => `<span>${t}</span>`).join("");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".duck-node").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.size));
});

modal.addEventListener("click", e => {
  if (e.target.dataset.close !== undefined) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

// Cartouche hover aura
const cartouche = document.getElementById("heroCartouche");
if (cartouche) {
  let auraTimer;
  cartouche.addEventListener("mouseenter", () => {
    clearTimeout(auraTimer);
    cartouche.classList.add("pulse");
  });
  cartouche.addEventListener("mouseleave", () => {
    auraTimer = setTimeout(() => cartouche.classList.remove("pulse"), 600);
  });
}

// Scroll-triggered fade-in
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  ".sec-head, .vitrine, .cartouche-section .card, .apoth-img, .apoth-copy, .cat-card, .atelier-content, .hero-frame, .rail, .hero-credits"
).forEach(el => {
  el.classList.add("reveal");
  io.observe(el);
});
