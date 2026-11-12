// Quacktory × Siena Film Foundation — interactivity
const DATA = {
  micro: {
    title: "MICRO",
    size: "4–8 cm · thumb-sized",
    body: "Keychain, merch, impulse gift. Single-piece compression moulding in an 8-cavity steel tool. ~45 seconds per cycle. Black pupil, white sclera, eye shape invariant.",
    spec: { "AGE": "6+", "RANGE": "impulse", "LEAD TIME": "3 weeks", "SHIPPING": "courier / postal" },
    cap: 132
  },
  classic: {
    title: "CLASSIC",
    size: "10–25 cm · cat-sized",
    body: "For kids, bathtub, desk. Compression moulding in an aluminium tool. No plastic inserts, no metal inside, no glued seams. Certified to GOST 25779-83 and EN 71-3.",
    spec: { "AGE": "3+", "RANGE": "mid", "LEAD TIME": "3 weeks", "TEST": "5 drops × 1 m" },
    cap: 132
  },
  designer: {
    title: "DESIGNER",
    size: "15–30 cm · cat-sized, limited",
    body: "Illustrator collaborations. Hand-poured into silicone flask (≤300 pcs) or compression moulding for larger runs. One cycle per day per flask. Design approval with the author.",
    spec: { "AGE": "6+", "RANGE": "mid+", "LEAD TIME": "6 weeks", "RUN": "limited" },
    cap: 64
  },
  mega: {
    title: "MEGA",
    size: "50–120 cm · child-sized",
    body: "Photo objects, window props, gift-with-impact. Rotational moulding. Internal fibreglass reinforcing frame. Decorative object — not a toy. Pallet shipping.",
    spec: { "AGE": "art object", "RANGE": "premium", "LEAD TIME": "6 weeks", "SHIPPING": "specialist courier required" },
    cap: 24
  },
  architect: {
    title: "ARCHITECT",
    size: "1.5–3 m · bear-sized",
    body: "Installations, events, weddings, branded spaces. Sculptural casting around a CNC-milled polystyrene master. Steel skeleton with stiffening ribs. Ultrasonic inspection of welded seams.",
    spec: { "AGE": "installation", "RANGE": "contract", "LEAD TIME": "12 weeks", "INSTALL": "certified crew" },
    cap: 12
  }
};

const modal = document.getElementById("modal");
const mTitle = document.getElementById("modal-title");
const mEyebrow = document.getElementById("modal-eyebrow");
const mSize = document.getElementById("modal-size");
const mBody = document.getElementById("modal-body");
const mSpec = document.getElementById("modal-spec");
const shareNum = document.getElementById("share-num");
const shareCap = document.getElementById("share-cap");
const shareBtn = document.getElementById("share");
let activeSku = null;
let count = 0;

function openModal(sku) {
  const d = DATA[sku];
  if (!d) return;
  activeSku = sku;
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
  document.querySelectorAll(".node").forEach(n => {
    n.setAttribute("aria-selected", n.dataset.sku === sku ? "true" : "false");
  });
  modal.querySelector(".modal__close").focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  activeSku = null;
  document.querySelectorAll(".node").forEach(n => n.setAttribute("aria-selected", "false"));
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