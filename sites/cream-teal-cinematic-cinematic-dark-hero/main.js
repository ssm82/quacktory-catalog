// Quacktory × The Hall of Zero Limits
const DATA = {
  micro: {
    title: "MICRO", size: "4–8 cm · about a thumb",
    body: "Keychain, merch, impulse gift. Injection molding under pressure, steel mold, 8 cavities, ~45 sec/cycle. EN 71-3.",
    spec: { "AGE": "6+", "SERIES": "impulse", "LEAD TIME": "3 weeks", "PRICE": "from $7 per unit" },
    cap: 132
  },
  classic: {
    title: "CLASSIC", size: "10–25 cm · like a cat",
    body: "Kids', bath, office. Compression molding, aluminum mold, ~3 min/cycle. No plastic, no metal, no glued seams.",
    spec: { "AGE": "3+", "SERIES": "mid", "LEAD TIME": "3 weeks", "QC": "5 checks" },
    cap: 132
  },
  designer: {
    title: "DESIGNER", size: "15–30 cm · limited edition",
    body: "Collaborations with illustrators. Hand molding in a silicone flask (≤300 pcs) or compression for larger runs. Design approval with the collaborator.",
    spec: { "AGE": "6+", "SERIES": "mid+", "LEAD TIME": "6 weeks", "RUN": "limited" },
    cap: 64
  },
  mega: {
    title: "MEGA", size: "50–120 cm · like a child",
    body: "Photo objects, window displays, gift-experiences. Rotational molding, internal fiberglass reinforcing frame. Decorative object, not a toy.",
    spec: { "AGE": "art object", "SERIES": "premium", "LEAD TIME": "6 weeks", "DELIVERY": "courier required" },
    cap: 24
  },
  architect: {
    title: "ARCHITECT", size: "1.5–3 m · like a bear",
    body: "Installations, events, weddings, branded spaces. Sculptural casting into a master model from CNC-milled polystyrene. Steel frame with stiffening ribs.",
    spec: { "AGE": "installation", "SERIES": "contract", "LEAD TIME": "12 weeks", "INSTALL": "certified crew" },
    cap: 12
  }
};

const modal = document.getElementById("modal");
const mTitle = document.getElementById("modal-title");
const mSize = document.getElementById("modal-size");
const mBody = document.getElementById("modal-body");
const mSpec = document.getElementById("modal-spec");
const shareNum = document.getElementById("share-num");
const shareCap = document.getElementById("share-cap");
const shareBtn = document.getElementById("share");
let count = 0;

function openModal(sku) {
  const d = DATA[sku];
  if (!d) return;
  count = 0;
  mTitle.textContent = d.title;
  mSize.textContent = d.size;
  mBody.textContent = d.body;
  mSpec.innerHTML = "";
  Object.entries(d.spec).forEach(([k, v]) => {
    const dt = document.createElement("dt"); dt.textContent = k;
    const dd = document.createElement("dd"); dd.textContent = v;
    mSpec.appendChild(dt); mSpec.appendChild(dd);
  });
  shareNum.textContent = "0";
  shareCap.textContent = d.cap;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelectorAll(".hex-node[data-sku] .hex-node__btn").forEach(b => {
    const parent = b.closest(".hex-node");
    b.setAttribute("aria-selected", parent && parent.dataset.sku === sku ? "true" : "false");
  });
  modal.querySelector(".modal__close").focus();
}
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  document.querySelectorAll(".hex-node[data-sku] .hex-node__btn").forEach(b => b.setAttribute("aria-selected", "false"));
}
document.querySelectorAll("[data-sku]").forEach(el => {
  el.addEventListener("click", () => openModal(el.dataset.sku));
});
document.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", closeModal);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});
shareBtn.addEventListener("click", () => {
  const cap = parseInt(shareCap.textContent, 10) || 132;
  if (count < cap) count++;
  shareNum.textContent = String(count);
});
