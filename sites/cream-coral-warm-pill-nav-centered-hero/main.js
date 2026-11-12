const SKU = {
  micro:    { size: "4 cm",      title: "Micro",     price: "$ 7",      desc: "A pocketable companion cast in warm peach-pink satin. Ships in a tin with a keyring loop — paddles through the day on a lanyard." },
  classic:  { size: "15 cm",     title: "Classic",   price: "$ 35",     desc: "The workhorse, finished in dusty rose with a soft satin surface. The most-photographed Quacktory duck — 15 cm of dependable presence." },
  designer: { size: "20 cm",     title: "Designer",  price: "$ 55",     desc: "A pearlescent dusty-mauve edition with subtle iridescent sheen. Limited cast, numbered on the base, finished by hand." },
  mega:     { size: "50 cm",     title: "Mega",      price: "$ 150",    desc: "A 50 cm parlor piece in soft blush porcelain matte. Holds a centre position in the room without ever raising its voice." },
  architect:{ size: "1.5 m",     title: "Architect", price: "$ 1,100",  desc: "A 1.5 m hand-glazed ceramic monument in dusty lavender-pink. Ships in a custom crate, sited by appointment." },
};

const modal    = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalSize  = document.getElementById("modalSize");
const modalTitle = document.getElementById("modalTitle");
const modalDesc  = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");

function openModal(sku) {
  const data = SKU[sku];
  if (!data) return;
  modalImg.src        = `./assets/product-${sku}.jpg`;
  modalImg.alt        = `${data.title} rubber duck`;
  modalSize.textContent  = data.size;
  modalTitle.textContent = data.title;
  modalDesc.textContent  = data.desc;
  modalPrice.textContent = data.price + " · ships in 14 days";
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-sku]").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.sku));
});
document.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", closeModal);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

document.getElementById("openOrder").addEventListener("click", () => openModal("classic"));